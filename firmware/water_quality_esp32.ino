/**
 * 🌊 AquaGuard — ESP32 Firmware for Water Quality & Leakage Detection
 *
 * Hardware Pin Mapping:
 * 1. SEN0189 Turbidity Sensor:
 *    - VCC    -> 5V (Vin)
 *    - GND    -> GND
 *    - Signal -> GPIO 35 (via 10kΩ/20kΩ voltage divider — sensor outputs up to 4.5V)
 *
 * 2. pH Sensor Module (Pins: V+, G, G, PO, GO):
 *    - V+  -> 5V (Vin)
 *    - G   -> GND  (use only ONE G pin)
 *    - G   -> leave unconnected (second G, not needed)
 *    - PO  -> GPIO 14  (Probe Output — analog signal)
 *    - GO  -> leave unconnected (digital output, not used)
 *
 * 3. Two Water Level Sensors (Conductivity / Resistive):
 *    - Sensor 1 (Low Level/Bottom): GPIO 32 (INPUT — HIGH when submerged)
 *    - Sensor 2 (High Level/Top):   GPIO 33 (INPUT — HIGH when submerged)
 *
 * 4. Relay Module (Controls Pump/Valve):
 *    - VCC -> 5V (Vin) | GND -> GND | IN -> GPIO 25
 *
 * 5. Buzzer (Audible Alarm):
 *    - (+) -> GPIO 26 | (-) -> GND
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ─── WiFi Configuration ──────────────────────────────────────────────────────
const char* ssid     = "Priyansh's S24 Ultra";
const char* password = "nhi bataunga";

// ─── Server Endpoint ─────────────────────────────────────────────────────────
// PC's IP address — ESP32 and PC must be on the same WiFi network
const char* serverEndpoint = "http://10.243.110.149:3001/api/sensors/data";

// ─── Pin Definitions ─────────────────────────────────────────────────────────
#define PH_PIN                14   // Analog — pH sensor (PO pin)
#define TURBIDITY_PIN         35   // Analog — SEN0189 turbidity
#define LEVEL_SENSOR_LOW_PIN  32   // Digital — bottom water level sensor
#define LEVEL_SENSOR_HIGH_PIN 33   // Digital — top water level sensor
#define RELAY_PIN             25   // Digital OUT — relay/pump control
#define BUZZER_PIN            26   // Digital OUT — buzzer alarm

// ─── Tank Configuration (adjust to your actual tank height) ──────────────────
const float TANK_HEIGHT_CM  = 100.0; // Total tank height in cm
const float LEVEL_EMPTY_CM  =   0.0; // Water level when tank is empty
const float LEVEL_HALF_CM   =  50.0; // Water level when sensor 1 (bottom) is submerged
const float LEVEL_FULL_CM   = 100.0; // Water level when both sensors are submerged

// ─── pH Calibration ──────────────────────────────────────────────────────────
// Adjust OFFSET if your sensor reads differently at known pH values
// pH 7 buffer solution should produce ~2.5V at sensor board output
const float PH_NEUTRAL_VOLTAGE = 2.5;   // Voltage corresponding to pH 7
const float PH_SENSITIVITY     = 0.18;  // Volts per pH unit (typical for most boards)

// ─── Sampling & Timing ───────────────────────────────────────────────────────
const int   numSamples        = 20;
const unsigned long publishInterval    = 3000;  // POST to server every 3 seconds
const unsigned long levelCheckInterval = 10000; // Check for leakage every 10 seconds

// ─── Leakage Threshold ───────────────────────────────────────────────────────
const float LEAKAGE_THRESHOLD_DROP_CM = 30.0; // cm drop within interval = leak

// ─── State Variables ─────────────────────────────────────────────────────────
float currentPh         = 7.0;
float currentTurbidity  = 0.0;
float currentWaterLevel = 0.0;   // in cm (from D32/D33)
float currentWaterLevelPct = 0.0; // percentage derived from cm
bool  relayState        = false;
bool  buzzerState       = false;
bool  leakageDetected   = false;

float previousWaterLevel = 0.0;
unsigned long lastPublishTime   = 0;
unsigned long lastLevelCheckTime = 0;

// ═════════════════════════════════════════════════════════════════════════════
void setup() {
  Serial.begin(115200);

  // Pin Modes
  pinMode(LEVEL_SENSOR_LOW_PIN,  INPUT);   // Active HIGH when submerged
  pinMode(LEVEL_SENSOR_HIGH_PIN, INPUT);   // Active HIGH when submerged
  pinMode(RELAY_PIN,  OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  // ADC attenuation for analog pins (0 – 3.3V full range)
  analogSetPinAttenuation(PH_PIN,        ADC_11db);
  analogSetPinAttenuation(TURBIDITY_PIN, ADC_11db);

  // Outputs OFF by default
  digitalWrite(RELAY_PIN,  LOW);
  digitalWrite(BUZZER_PIN, LOW);

  connectToWiFi();
  Serial.println("✅ AquaGuard System Initialized.");
}

// ═════════════════════════════════════════════════════════════════════════════
void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }

  readPhSensor();
  readTurbiditySensor();
  readWaterLevelSensors();
  checkLeakage();
  controlSystem();

  if (millis() - lastPublishTime >= publishInterval) {
    publishSensorData();
    lastPublishTime = millis();
  }

  delay(200);
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Reads pH sensor on GPIO 36
 * Formula: pH = 7 + (neutralVoltage - actualVoltage) / sensitivity
 */
void readPhSensor() {
  int rawSum = 0;
  for (int i = 0; i < numSamples; i++) {
    rawSum += analogRead(PH_PIN);
    delay(10);
  }
  int rawAvg = rawSum / numSamples;

  // Convert 12-bit ADC to voltage (0 – 3.3V)
  float voltage = rawAvg * (3.3 / 4095.0);

  // If sensor board outputs 5V scale, correct for 10k/20k divider
  // float voltage = (rawAvg * (3.3 / 4095.0)) * 1.5;

  // pH formula
  currentPh = 7.0 + (PH_NEUTRAL_VOLTAGE - voltage) / PH_SENSITIVITY;

  // Clamp to valid range 0–14
  if (currentPh < 0.0)  currentPh = 0.0;
  if (currentPh > 14.0) currentPh = 14.0;

  Serial.print("[pH] Raw ADC: ");
  Serial.print(rawAvg);
  Serial.print(" | Voltage: ");
  Serial.print(voltage, 3);
  Serial.print("V | pH: ");
  Serial.println(currentPh, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Reads SEN0189 turbidity sensor on GPIO 35
 * NTU formula valid for sensor voltage 2.5V – 4.2V
 */
void readTurbiditySensor() {
  int rawSum = 0;
  for (int i = 0; i < numSamples; i++) {
    rawSum += analogRead(TURBIDITY_PIN);
    delay(10);
  }
  int rawAvg = rawSum / numSamples;

  // GPIO voltage (0 – 3.3V)
  float voltage = rawAvg * (3.3 / 4095.0);

  // Correct for 10kΩ/20kΩ divider → actual sensor output voltage
  float sensorVoltage = voltage * 1.5;

  if (sensorVoltage >= 4.2) {
    currentTurbidity = 0.0;                 // Clear water
  } else if (sensorVoltage >= 2.5) {
    currentTurbidity = -1120.4 * (sensorVoltage * sensorVoltage)
                       + 5742.3 * sensorVoltage
                       - 4352.9;
    if (currentTurbidity < 0) currentTurbidity = 0.0;
  } else {
    // Voltage out of range — proportional fallback
    currentTurbidity = map(rawAvg, 4095, 0, 0, 3000);
  }

  Serial.print("[Turbidity] Raw ADC: ");
  Serial.print(rawAvg);
  Serial.print(" | GPIO: ");
  Serial.print(voltage, 3);
  Serial.print("V | Sensor: ");
  Serial.print(sensorVoltage, 3);
  Serial.print("V | NTU: ");
  Serial.println(currentTurbidity, 1);
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Reads two resistive water level sensors (active HIGH = submerged)
 * Reports water level in cm AND percentage — no new wiring needed
 *
 * D32 (Low/Bottom) | D33 (High/Top) | cm  | %
 * ──────────────────────────────────────────────
 *   DRY             |  DRY           |  0  |  0%
 *   WET             |  DRY           | 50  | 50%
 *   WET             |  WET           | 100 | 100%
 */
void readWaterLevelSensors() {
  bool lowSubmerged  = (digitalRead(LEVEL_SENSOR_LOW_PIN)  == HIGH);
  bool highSubmerged = (digitalRead(LEVEL_SENSOR_HIGH_PIN) == HIGH);

  Serial.print("[Water Level] D32: ");
  Serial.print(lowSubmerged  ? "WET" : "DRY");
  Serial.print(" | D33: ");
  Serial.print(highSubmerged ? "WET" : "DRY");

  if (highSubmerged && lowSubmerged) {
    currentWaterLevel = LEVEL_FULL_CM;
  } else if (!highSubmerged && lowSubmerged) {
    currentWaterLevel = LEVEL_HALF_CM;
  } else if (!highSubmerged && !lowSubmerged) {
    currentWaterLevel = LEVEL_EMPTY_CM;
  } else {
    currentWaterLevel = LEVEL_HALF_CM;
    Serial.print(" | WARNING: Sensor discrepancy!");
  }

  // Derive percentage from cm — no extra sensor or wiring needed
  currentWaterLevelPct = (currentWaterLevel / TANK_HEIGHT_CM) * 100.0;

  Serial.print(" | ");
  Serial.print(currentWaterLevel);
  Serial.print(" cm | ");
  Serial.print(currentWaterLevelPct, 1);
  Serial.println("%");
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Detects leakage if water level drops > threshold when pump is OFF
 */
void checkLeakage() {
  if (millis() - lastLevelCheckTime >= levelCheckInterval) {
    float drop = previousWaterLevel - currentWaterLevel;

    if (!relayState && drop >= LEAKAGE_THRESHOLD_DROP_CM) {
      leakageDetected = true;
      Serial.println("🚨 ALERT: Water level dropped rapidly — possible leak!");
    } else {
      leakageDetected = false;
    }

    previousWaterLevel  = currentWaterLevel;
    lastLevelCheckTime  = millis();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Controls relay (pump) and buzzer based on sensor readings
 */
void controlSystem() {
  // Relay: turn ON pump if tank is empty and no leak
  if (currentWaterLevel <= LEVEL_EMPTY_CM && !leakageDetected) {
    relayState = true;
    digitalWrite(RELAY_PIN, HIGH);
  }
  // Relay: turn OFF if tank is full or leak detected
  else if (currentWaterLevel >= LEVEL_FULL_CM || leakageDetected) {
    relayState = false;
    digitalWrite(RELAY_PIN, LOW);
  }

  // Buzzer: ON if leakage or very turbid water
  if (leakageDetected || currentTurbidity > 50.0) {
    buzzerState = true;
    digitalWrite(BUZZER_PIN, (millis() / 500) % 2);  // rapid beep
  } else {
    buzzerState = false;
    digitalWrite(BUZZER_PIN, LOW);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * POSTs sensor data as JSON to the backend server
 */
void publishSensorData() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverEndpoint);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> doc;
    doc["ph"]               = currentPh;
    doc["turbidity"]        = currentTurbidity;
    doc["waterLevel"]       = currentWaterLevel;    // cm from D32/D33
    doc["waterLevelPct"]    = currentWaterLevelPct; // percentage derived from cm
    doc["leakageDetected"]  = leakageDetected;
    doc["relayStatus"]      = relayState;
    doc["buzzerStatus"]     = buzzerState;

    String body;
    serializeJson(doc, body);

    Serial.print("📤 POST: ");
    Serial.println(body);

    int code = http.POST(body);
    if (code > 0) {
      Serial.print("✅ HTTP ");
      Serial.println(code);
    } else {
      Serial.print("❌ POST failed: ");
      Serial.println(code);
    }
    http.end();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Connects to WiFi with retry logic
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
    Serial.println("\n✅ WiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ WiFi connection failed. Will retry...");
  }
}
