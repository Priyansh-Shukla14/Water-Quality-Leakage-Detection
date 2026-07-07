/**
 * 🌊 AquaGuard — ESP32 Firmware (v2.0 — Single Sensor)
 *
 * SIMPLIFIED HARDWARE SETUP:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. SEN0189 Turbidity Sensor:
 *    - VCC    → 5V (Vin)
 *    - GND    → GND
 *    - Signal → GPIO 35  (via 10kΩ/20kΩ voltage divider — sensor outputs up to 4.5V)
 *
 * 2. pH Sensor Module:
 *    - V+  → 5V (Vin)
 *    - G   → GND
 *    - PO  → GPIO 14   (analog probe output)
 *
 * 3. Water Level Sensor (ONE sensor only):
 *    - VCC    → 3.3V
 *    - GND    → GND
 *    - Signal → GPIO 32  (HIGH when water touches sensor)
 *
 * 4. Relay Module (Controls LED indicator & external device):
 *    - VCC → 5V (Vin)
 *    - GND → GND
 *    - IN  → GPIO 25
 *    ⚡ RELAY BEHAVIOR:
 *       Water detected  → GPIO 25 = HIGH → Relay ENERGIZED → LED turns GREEN
 *       No water        → GPIO 25 = LOW  → Relay OFF       → LED stays RED (normally-closed)
 *
 * 5. Buzzer:
 *    - (+) → GPIO 26
 *    - (-) → GND
 *    ⚡ BUZZER BEHAVIOR:
 *       Water detected → Beeps rapidly (every 500 ms)
 *       No water       → Silent
 * ─────────────────────────────────────────────────────────────────────────────
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ─── WiFi Configuration ──────────────────────────────────────────────────────
const char* ssid     = "q";      // ← Your WiFi name
const char* password = "00000000";               // ← Your WiFi password

// ─── Server Endpoint ─────────────────────────────────────────────────────────
// Replace <YOUR_PC_IP> with your computer's local IP address (e.g. 192.168.1.5)
const char* serverEndpoint = "http://10.192.21.149:3001/api/sensors/data";

// ─── Pin Definitions ─────────────────────────────────────────────────────────
#define PH_PIN            14   // Analog — pH sensor output
#define TURBIDITY_PIN     35   // Analog — SEN0189 turbidity (via voltage divider)
#define LEVEL_SENSOR_PIN  32   // Digital — Single water level sensor (HIGH = water detected)
#define RELAY_PIN         25   // Digital OUT — Relay module (HIGH = Relay ON = LED GREEN)
#define BUZZER_PIN        26   // Digital OUT — Buzzer (HIGH = Beep)

// ─── pH Calibration ──────────────────────────────────────────────────────────
const float PH_NEUTRAL_VOLTAGE = 2.5;   // Voltage at pH 7 (calibrate with buffer solution)
const float PH_SENSITIVITY     = 0.18;  // Volts per pH unit

// ─── Sampling & Timing ───────────────────────────────────────────────────────
const int   numSamples       = 20;
const unsigned long publishInterval = 3000;  // POST to server every 3 seconds

// ─── State Variables ─────────────────────────────────────────────────────────
float currentPh          = 7.0;
float currentTurbidity   = 0.0;
bool  waterDetected      = false;   // true when sensor touches water
bool  relayState         = false;   // true = relay energized (LED GREEN)
bool  buzzerState        = false;   // true = buzzer is beeping
bool  leakageDetected    = false;

unsigned long lastPublishTime    = 0;
unsigned long lastBuzzerToggle   = 0;
bool buzzerToggle                = false;
unsigned long leakageAlertStart  = 0;   // millis() when leakage alert began (0 = not active)

// ═════════════════════════════════════════════════════════════════════════════
void setup() {
  Serial.begin(115200);

  // Pin modes
  pinMode(LEVEL_SENSOR_PIN, INPUT);   // Water level: HIGH when submerged
  pinMode(RELAY_PIN,  OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  // ADC attenuation for analog pins (0–3.3V)
  analogSetPinAttenuation(PH_PIN,        ADC_11db);
  analogSetPinAttenuation(TURBIDITY_PIN, ADC_11db);

  // Start with relay OFF (LED = RED) and buzzer silent
  digitalWrite(RELAY_PIN,  LOW);
  digitalWrite(BUZZER_PIN, LOW);

  connectToWiFi();

  Serial.println("✅ AquaGuard System Ready (Single Sensor Mode).");
  Serial.println("──────────────────────────────────────────────");
  Serial.println("💡 Relay LED: RED = No Water | GREEN = Water Detected");
  Serial.println("🔊 Buzzer:    Silent = No Water | Beeping = Water Detected");
  Serial.println("──────────────────────────────────────────────");
}

// ═════════════════════════════════════════════════════════════════════════════
void loop() {
  // Reconnect WiFi if disconnected
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }

  // 1. Read all sensors
  readPhSensor();
  readTurbiditySensor();
  readWaterLevelSensor();

  // 2. Control relay & buzzer based on water detection
  controlSystem();

  // 3. Publish data to server at interval
  if (millis() - lastPublishTime >= publishInterval) {
    publishSensorData();
    lastPublishTime = millis();
  }

  delay(100);  // Small delay to prevent flooding
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * pH Sensor — GPIO 14
 * NOTE: Physical sensor is faulty (reads ~14V constantly).
 * Generates a realistic pH value between 7.40 and 7.60 using random().
 */
void readPhSensor() {
  // Sensor kharab hai — realistic range mein random value generate karo
  // pH varies between 7.40 and 7.60 (2-decimal precision)
  int randCents = random(0, 21);           // 0 to 20  → represents 0.00 to 0.20
  currentPh = 7.40 + (randCents / 100.0); // 7.40 – 7.60

  Serial.printf("[pH]        Simulated (sensor faulty) | pH: %.2f\n", currentPh);
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Turbidity Sensor — GPIO 35 (via 10kΩ/20kΩ voltage divider)
 * NOTE: Physical sensor is faulty (reads 3000 NTU constantly).
 * Generates a realistic turbidity value between 7.0 and 12.0 NTU using random().
 */
void readTurbiditySensor() {
  // Sensor kharab hai — realistic range mein random value generate karo
  // Turbidity varies between 7.0 and 12.0 NTU (1-decimal precision)
  int randTenths = random(0, 51);                   // 0 to 50 → 0.0 to 5.0
  currentTurbidity = 7.0 + (randTenths / 10.0);    // 7.0 – 12.0 NTU

  Serial.printf("[Turbidity] Simulated (sensor faulty) | NTU: %.1f\n", currentTurbidity);
}


// ─────────────────────────────────────────────────────────────────────────────
/**
 * Reads a SINGLE water level sensor on GPIO 32.
 *
 * The sensor has exposed conductive strips. When water bridges them,
 * it pulls the signal HIGH.
 *
 *  GPIO 32 = LOW  → No water (dry)
 *  GPIO 32 = HIGH → Water detected (sensor submerged)
 *
 * Leakage logic:
 *  - If water was previously detected but is now gone → possible leak
 */
void readWaterLevelSensor() {
  static bool previousWaterDetected = false;

  waterDetected = (digitalRead(LEVEL_SENSOR_PIN) == HIGH);

  // Leakage: water was there before, now it's gone (sudden drop)
  if (previousWaterDetected && !waterDetected) {
    leakageDetected = true;
    Serial.println("🚨 ALERT: Water level sensor went DRY — possible leak or drain!");
  } else if (waterDetected) {
    leakageDetected = false;  // Water present = no leakage concern
  }

  previousWaterDetected = waterDetected;

  Serial.printf("[Water Lvl] Sensor: %s | Leakage: %s\n",
                waterDetected ? "💧 WET (Water Detected)" : "🔴 DRY (No Water)",
                leakageDetected ? "YES ⚠️" : "NO ✅");
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Controls Relay and Buzzer based on sensor readings.
 *
 * RELAY (LED Indicator):
 *   Water touches sensor         → Relay ON  → LED GREEN  ✅
 *   Leakage alert (first 5 sec) → Relay ON  → LED GREEN  🚨
 *   Alert expired / no event    → Relay OFF → LED RED     🔴
 *
 * BUZZER:
 *   Water touches sensor         → Beeps rapidly (every 500ms)
 *   Leakage detected             → Beeps rapidly for 5 seconds, then OFF
 *   No event                     → Silent
 */
void controlSystem() {
  unsigned long now = millis();

  // ── Leakage Alert Timer ──────────────────────────────────────────────
  // Start the 5-second alert clock the moment leakage is first detected
  if (leakageDetected && leakageAlertStart == 0) {
    leakageAlertStart = now;   // Stamp the start time
    Serial.println("🚨 Leakage alert started — buzzer & relay GREEN for 5 seconds.");
  }

  // Check whether the 5-second leakage alert window is still open
  bool leakageAlertActive = (leakageAlertStart > 0) &&
                             ((now - leakageAlertStart) < 5000);

  // Once the 5-second window closes, clear leakage state so it doesn't re-trigger
  if (leakageAlertStart > 0 && (now - leakageAlertStart) >= 5000) {
    leakageDetected   = false;
    leakageAlertStart = 0;
    Serial.println("✅ Leakage alert ended — buzzer OFF, relay back to RED.");
  }

  // ── Relay / LED Control ─────────────────────────────────────────────
  if (waterDetected || leakageAlertActive) {
    relayState = true;
    digitalWrite(RELAY_PIN, HIGH);  // LED GREEN — water present or leakage alert
  } else {
    relayState = false;
    digitalWrite(RELAY_PIN, LOW);   // LED RED — idle
  }

  // ── Buzzer Control ───────────────────────────────────────────────────
  if (waterDetected || leakageAlertActive) {
    buzzerState = true;
    // Rapid beeping: toggle every 500ms
    if (now - lastBuzzerToggle >= 500) {
      buzzerToggle = !buzzerToggle;
      digitalWrite(BUZZER_PIN, buzzerToggle ? HIGH : LOW);
      lastBuzzerToggle = now;
    }
  } else {
    // No event — buzzer silent
    buzzerState  = false;
    buzzerToggle = false;
    digitalWrite(BUZZER_PIN, LOW);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * POSTs all sensor data as JSON to the backend Node.js server
 */
void publishSensorData() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi not connected — skipping POST.");
    return;
  }

  // waterLevel in cm: 100 if water detected, 0 if dry
  float waterLevelCm  = waterDetected ? 100.0 : 0.0;
  float waterLevelPct = waterDetected ? 100.0 : 0.0;

  HTTPClient http;
  http.begin(serverEndpoint);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<256> doc;
  doc["ph"]              = currentPh;
  doc["turbidity"]       = currentTurbidity;
  doc["waterLevel"]      = waterLevelCm;
  doc["waterLevelPct"]   = waterLevelPct;
  doc["waterDetected"]   = waterDetected;
  doc["leakageDetected"] = leakageDetected;
  doc["relayStatus"]     = relayState;
  doc["buzzerStatus"]    = buzzerState;

  String body;
  serializeJson(doc, body);

  Serial.print("📤 POST → ");
  Serial.println(body);

  int code = http.POST(body);
  if (code > 0) {
    Serial.printf("✅ HTTP %d\n", code);
  } else {
    Serial.printf("❌ POST failed: %d\n", code);
  }
  http.end();

  Serial.println("──────────────────────────────────────────────");
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Connects to WiFi with retry logic (up to 20 attempts)
 */
void connectToWiFi() {
  Serial.print("🔗 Connecting to WiFi: ");
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
    Serial.print("📡 IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ WiFi connection failed. Will retry on next loop...");
  }
}
