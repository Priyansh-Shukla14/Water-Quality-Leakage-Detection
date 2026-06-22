/**
 * 🌊 AquaGuard — ESP32 Firmware for Water Quality & Leakage Detection
 * 
 * Hardware Pin Mapping:
 * 1. SEN0189 Turbidity Sensor: 
 *    - VCC -> 5V (Sensor board)
 *    - GND -> GND
 *    - Signal -> GPIO 34 (Analog input via 5V to 3.3V voltage divider to protect ESP32 pin)
 * 
 * 2. Two Water Level Sensors (Float Switches / Contact Sensors):
 *    - Sensor 1 (Low Level/Bottom): GPIO 32 (Digital Input with internal pull-up)
 *    - Sensor 2 (High Level/Top): GPIO 33 (Digital Input with internal pull-up)
 * 
 * 3. Relay Module (Controls Pump/Valve):
 *    - Control -> GPIO 25 (Digital Output)
 * 
 * 4. Buzzer (Audible Alarm):
 *    - Control -> GPIO 26 (Digital Output)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server URL Configuration
// Your PC's IP address is 192.168.0.110 — make sure ESP32 is on the same WiFi network
const char* serverEndpoint = "http://192.168.0.110:3001/api/sensors/data";

// Pin Definitions
#define TURBIDITY_PIN         34
#define LEVEL_SENSOR_LOW_PIN  32
#define LEVEL_SENSOR_HIGH_PIN 33
#define RELAY_PIN             25
#define BUZZER_PIN            26

// Sampling constants
const int numSamples = 20;
unsigned long lastPublishTime = 0;
const unsigned long publishInterval = 3000; // Publish every 3 seconds

// State variables
float currentPh = 7.0; // Placeholders for pH logic if pH sensor is added later
float currentTurbidity = 0.0;
float currentWaterLevel = 0.0;
bool relayState = false;
bool buzzerState = false;
bool leakageDetected = false;

// Leakage Detection variables
float previousWaterLevel = 0.0;
unsigned long lastLevelCheckTime = 0;
const unsigned long levelCheckInterval = 10000; // Check level drop every 10 seconds
const float LEAKAGE_THRESHOLD_DROP = 15.0;     // 15% drop indicates a leak

void setup() {
  Serial.begin(115200);

  // Initialize Input/Output Pins
  pinMode(LEVEL_SENSOR_LOW_PIN, INPUT_PULLUP);
  pinMode(LEVEL_SENSOR_HIGH_PIN, INPUT_PULLUP);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  // Default outputs to OFF
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("ESP32 Water Quality & Leakage System Initialized.");
}

void loop() {
  // Keep WiFi connected
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }

  // Read Sensors
  readTurbiditySensor();
  readWaterLevelSensors();
  
  // Check for leakage
  checkLeakage();

  // Control Logic (Pump and Alarm)
  controlSystem();

  // Publish Data to Web App Server
  if (millis() - lastPublishTime >= publishInterval) {
    publishSensorData();
    lastPublishTime = millis();
  }

  delay(200);
}

/**
 * Reads and converts SEN0189 Analog value to Turbidity (NTU)
 */
void readTurbiditySensor() {
  int sensorValue = 0;
  
  // Take average of samples to reduce noise
  for (int i = 0; i < numSamples; i++) {
    sensorValue += analogRead(TURBIDITY_PIN);
    delay(10);
  }
  sensorValue = sensorValue / numSamples;

  // Convert ESP32 analog reading (0 - 4095) to Voltage (0 - 3.3V)
  float voltage = sensorValue * (3.3 / 4095.0);
  
  // If using a voltage divider (e.g. 10k/20k) to scale 5V down to 3.3V:
  // Multiply voltage by correction factor (approx 1.5) to get actual sensor voltage
  float actualSensorVoltage = voltage * 1.515; 

  // DFRobot SEN0189 Formula to convert voltage to NTU:
  // Turbidity (NTU) = -1120.4 * V^2 + 5742.3 * V - 4352.9
  if (actualSensorVoltage >= 4.2) {
    currentTurbidity = 0.0; // Clear water
  } else if (actualSensorVoltage < 2.5) {
    currentTurbidity = 3000.0; // Clamped maximum turbidity
  } else {
    currentTurbidity = -1120.4 * (actualSensorVoltage * actualSensorVoltage) 
                       + 5742.3 * actualSensorVoltage 
                       - 4352.9;
  }
  
  // Clamp negative values
  if (currentTurbidity < 0) currentTurbidity = 0.0;

  Serial.print("Turbidity Voltage: ");
  Serial.print(actualSensorVoltage);
  Serial.print("V, NTU: ");
  Serial.println(currentTurbidity);
}

/**
 * Reads two float switches to compute discrete water level percentages:
 * - Both switches open (LOW) -> Empty / 10%
 * - Bottom switch closed (HIGH), Top open (LOW) -> Half Full / 50%
 * - Both switches closed (HIGH) -> Full / 100%
 */
void readWaterLevelSensors() {
  // Float switches with pull-ups read LOW when active/submerged, HIGH when dry.
  // We invert the read to make logic intuitive: true = submerged, false = dry.
  bool lowLevelSubmerged = (digitalRead(LEVEL_SENSOR_LOW_PIN) == LOW);
  bool highLevelSubmerged = (digitalRead(LEVEL_SENSOR_HIGH_PIN) == LOW);

  if (highLevelSubmerged && lowLevelSubmerged) {
    currentWaterLevel = 100.0; // Tank is full
  } 
  else if (!highLevelSubmerged && lowLevelSubmerged) {
    currentWaterLevel = 50.0;  // Tank is half full
  } 
  else if (!highLevelSubmerged && !lowLevelSubmerged) {
    currentWaterLevel = 10.0;   // Tank is empty / critical low
  } 
  else {
    // Top sensor wet but bottom dry (Sensor configuration error or wave motion)
    currentWaterLevel = 50.0; 
    Serial.println("Warning: Discrepancy in water level sensors (High submerged, Low dry).");
  }

  Serial.print("Water Level: ");
  Serial.print(currentWaterLevel);
  Serial.println("%");
}

/**
 * Detects leaks based on rapid drops in water level when pump (relay) is not active
 */
void checkLeakage() {
  if (millis() - lastLevelCheckTime >= levelCheckInterval) {
    // If the water level is dropping rapidly (>= threshold) AND the relay/pump is OFF
    if (!relayState && (previousWaterLevel - currentWaterLevel >= LEAKAGE_THRESHOLD_DROP)) {
      leakageDetected = true;
      Serial.println("ALERT: Rapid water level drop detected! Potential leak!");
    } else {
      leakageDetected = false;
    }
    
    previousWaterLevel = currentWaterLevel;
    lastLevelCheckTime = millis();
  }
}

/**
 * Automates relay and alarm buzzer controls based on sensor readings
 */
void controlSystem() {
  // 1. Relay Control (Pump)
  // Turn ON pump if water is critically low and no leakage is active
  if (currentWaterLevel <= 10.0 && !leakageDetected) {
    relayState = true;
    digitalWrite(RELAY_PIN, HIGH);
  } 
  // Turn OFF pump if tank is full or if a leak has been detected to prevent water loss
  else if (currentWaterLevel >= 100.0 || leakageDetected) {
    relayState = false;
    digitalWrite(RELAY_PIN, LOW);
  }

  // 2. Buzzer Control (Alarm)
  // Alarm triggers if leakage is detected or water turbidity is extremely high
  if (leakageDetected || currentTurbidity > 50.0) {
    buzzerState = true;
    // Rapid beep logic
    digitalWrite(BUZZER_PIN, (millis() / 500) % 2); 
  } else {
    buzzerState = false;
    digitalWrite(BUZZER_PIN, LOW);
  }
}

/**
 * Posts JSON sensor data to the API Server
 */
void publishSensorData() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverEndpoint);
    http.addHeader("Content-Type", "application/json");

    // Create JSON Document
    StaticJsonDocument<200> doc;
    doc["ph"] = currentPh;
    doc["turbidity"] = currentTurbidity;
    doc["waterLevel"] = currentWaterLevel;
    doc["leakageDetected"] = leakageDetected;
    doc["relayStatus"] = relayState;
    doc["buzzerStatus"] = buzzerState;

    String requestBody;
    serializeJson(doc, requestBody);

    Serial.print("Sending POST data: ");
    Serial.println(requestBody);

    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error code in POST request: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  }
}

/**
 * Handles WiFi connection routine
 */
void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected successfully!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi Connection failed. Will retry...");
  }
}
