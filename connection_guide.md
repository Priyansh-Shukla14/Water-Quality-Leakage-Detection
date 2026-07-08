# 🌊 AquaGuard — Complete ESP32 Wiring Guide

## System Architecture

```
[ESP32 + Sensors] → WiFi HTTP POST → [server.js :3001] → [React Dashboard :5174]
```

---

## ⚡ ESP32 Power Pins (Reference)

```
ESP32 Board
┌─────────────────────────────────┐
│  3V3  → 3.3V output             │
│  Vin  → 5V output (from USB)    │
│  GND  → Ground                  │
└─────────────────────────────────┘
```

---

## 📋 COMPLETE PINOUT TABLE

| Component            | Component Pin | ESP32 Pin   | Wire Color (Suggestion) |
|----------------------|---------------|-------------|--------------------------|
| **pH Sensor**        | V+            | Vin (5V)    | 🔴 Red                  |
|                      | G             | GND         | ⚫ Black                 |
|                      | PO            | GPIO 14     | 🟡 Yellow                |
| **Turbidity Sensor** | VCC           | Vin (5V)    | 🔴 Red                  |
|                      | GND           | GND         | ⚫ Black                 |
|                      | Signal        | GPIO 35 *   | 🟡 Yellow (via divider)  |
| **Water Level Sensor**| VCC          | 3.3V (3V3)  | 🔴 Red                  |
|                      | GND           | GND         | ⚫ Black                 |
|                      | Signal        | GPIO 32     | 🟢 Green                 |
| **Relay Module**     | VCC           | Vin (5V)    | 🔴 Red                  |
|                      | GND           | GND         | ⚫ Black                 |
|                      | IN            | GPIO 25     | 🔵 Blue                  |
| **Buzzer**           | + (Positive)  | GPIO 26     | 🔵 Blue                  |
|                      | − (Negative)  | GND         | ⚫ Black                 |

> ⚠️ **GPIO 35 ke liye voltage divider zaroori hai** — neeche dekho

---

## 🔌 SENSOR-BY-SENSOR COMPLETE DIAGRAM

---

### 1️⃣ pH Sensor Module → ESP32

```
         pH Sensor Module
        ┌──────────────────┐
        │                  │
5V ─────┤ V+               │
        │                  │
GND ────┤ G                │
        │                  │
GPIO 14 ┤ PO (Signal)      │   ← Analog Output (0–3V, safe for ESP32)
        │                  │
        └──────────────────┘

ESP32 Pin:  GPIO 14  →  PO
ESP32 Pin:  Vin (5V) →  V+
ESP32 Pin:  GND      →  G
```

---

### 2️⃣ SEN0189 Turbidity Sensor → ESP32 (Voltage Divider Required!)

```
         Turbidity Sensor                  Voltage Divider         ESP32
        ┌──────────────────┐
        │                  │
5V ─────┤ VCC              │
        │                  │
GND ────┤ GND              ├──────── 20kΩ ──── GND
        │                  │
        │ Signal           ├──┬───── 10kΩ ──── GPIO 35
        │                  │  │
        └──────────────────┘  └───── 20kΩ ──── GND

Explanation:
  Sensor Signal → 10kΩ → GPIO 35 (ESP32)
                          |
                        20kΩ
                          |
                         GND

Yeh circuit 4.5V → ~3.0V mein convert karta hai (ESP32-safe)

ESP32 Pin:  GPIO 35  →  Signal (via divider)
ESP32 Pin:  Vin (5V) →  VCC
ESP32 Pin:  GND      →  GND
```

---

### 3️⃣ Water Level Sensor → ESP32

```
         Water Level Sensor
        ┌──────────────────┐
        │                  │
3.3V ───┤ VCC              │   ← SIRF 3.3V use karo, 5V nahi!
        │                  │
GND ────┤ GND              │
        │                  │
GPIO 32 ┤ Signal           │   ← HIGH = Pani hai | LOW = Sukha hai
        │                  │
        └──────────────────┘

ESP32 Pin:  GPIO 32  →  Signal
ESP32 Pin:  3V3      →  VCC
ESP32 Pin:  GND      →  GND
```

---

### 4️⃣ Relay Module → ESP32

```
         Relay Module
        ┌──────────────────┐
        │                  │
5V ─────┤ VCC              │
        │                  │
GND ────┤ GND              │
        │                  │
GPIO 25 ┤ IN               │   ← HIGH = Relay ON → LED GREEN
        │                  │      LOW  = Relay OFF → LED RED
        │ NO/COM/NC        │   ← External device ke liye (optional)
        └──────────────────┘

Relay LED Behavior:
  GPIO 25 = HIGH → Relay Energized → LED 🟢 GREEN (Pani detect hua)
  GPIO 25 = LOW  → Relay OFF       → LED 🔴 RED   (Sukha hai)

ESP32 Pin:  GPIO 25  →  IN
ESP32 Pin:  Vin (5V) →  VCC
ESP32 Pin:  GND      →  GND
```

---

### 5️⃣ Buzzer → ESP32

```
         Buzzer
        ┌──────────────────┐
        │                  │
GPIO 26 ┤ + (Positive)     │   ← HIGH = Beep | LOW = Silent
        │                  │
GND ────┤ − (Negative)     │
        │                  │
        └──────────────────┘

⚠️ Buzzer ka + aur − dhyan se dekho — ulta lagane pe kaam nahi karega

ESP32 Pin:  GPIO 26  →  + (Positive)
ESP32 Pin:  GND      →  − (Negative)
```

---

## 🗺️ MASTER WIRING DIAGRAM (ESP32 Board View)

```
                    ┌─────────────────────────────────────┐
                    │             ESP32 DevKit             │
                    │                                      │
          3V3 ──────┤ 3V3                          GND ───┤──── GND (sabka)
          Vin ──────┤ Vin (5V)                     D26 ───┤──── Buzzer (+)
                    │                              D25 ───┤──── Relay (IN)
          GND ──────┤ GND                          D32 ───┤──── Water Level Signal
                    │                              D35 ───┤──── Turbidity Signal*
                    │                              D14 ───┤──── pH Sensor (PO)
                    │                                      │
                    └─────────────────────────────────────┘

Power Distribution:
  Vin (5V) → pH Sensor V+
  Vin (5V) → Turbidity VCC
  Vin (5V) → Relay VCC
  3V3      → Water Level VCC

Ground (sabko common GND se jodo):
  GND → pH Sensor G
  GND → Turbidity GND
  GND → Water Level GND
  GND → Relay GND
  GND → Buzzer (−)

* Turbidity Signal: Seedha connect mat karo!
  Voltage divider use karo: Signal → 10kΩ → GPIO 35 → 20kΩ → GND
```

---

## ⚡ QUICK REFERENCE TABLE

| GPIO | Component          | Type         | Signal Behavior              |
|------|--------------------|--------------|------------------------------|
| 14   | pH Sensor (PO)     | Analog IN    | 0–3V → pH 0–14               |
| 35   | Turbidity (Signal) | Analog IN    | Voltage divider se (3V max)  |
| 32   | Water Level        | Digital IN   | HIGH = Pani | LOW = Sukha    |
| 25   | Relay (IN)         | Digital OUT  | HIGH = LED Green | LOW = Red |
| 26   | Buzzer (+)         | Digital OUT  | HIGH = Beep | LOW = Silent   |

---

## ⚠️ IMPORTANT WARNINGS

> **1. Turbidity sensor → Voltage Divider MUST hai**
> Turbidity sensor 4.5V tak output deta hai — seedha GPIO 35 se lagaoge toh ESP32 burn ho sakta hai. 10kΩ + 20kΩ voltage divider ZAROORI hai.

> **2. Water Level Sensor → SIRF 3.3V**
> Is sensor ko 5V mat do — 3.3V se kaam karta hai aur ESP32 GPIO ke saath compatible rahega.

> **3. pH Sensor → 5V chahiye**
> pH sensor 3.3V pe sahi reading nahi deta — Vin (5V) se connect karo.

> **4. Buzzer Polarity**
> Buzzer ka + aur − sahi lagao — ulta lagane pe sound nahi aayegi.

> **5. Common GND**
> Sabke GND ko ESP32 ke GND se connect karo — ek GND rail pe sabko jodo.

---

## 🛠️ PARTS LIST

| Component            | Quantity | Notes                              |
|----------------------|----------|------------------------------------|
| ESP32 DevKit v1      | 1        | USB se power milegi                |
| pH Sensor Module     | 1        | With BNC probe                     |
| SEN0189 Turbidity    | 1        | DFRobot                            |
| Water Level Sensor   | 1        | Simple resistive type              |
| Relay Module (5V)    | 1        | With built-in LED indicator        |
| Active Buzzer        | 1        | Active type (sirf HIGH chahiye)    |
| 10kΩ Resistor        | 1        | Voltage divider ke liye            |
| 20kΩ Resistor        | 1        | Voltage divider ke liye            |
| Jumper Wires         | ~20      | Male-to-male / Male-to-female      |
| Breadboard           | 1        | Voltage divider circuit ke liye    |

---

## PART 1 — Arduino IDE: Libraries to Install

Open **Arduino IDE** → Go to **Tools → Manage Libraries** and install:

| Library Name | Version |
|---|---|
| **ArduinoJson** by Benoit Blanchon | `v6.x` (latest) |
| **WiFi** (ESP32 built-in) | Already included |
| **HTTPClient** (ESP32 built-in) | Already included |

### Install ESP32 Board Package (if not done yet)
1. Go to **File → Preferences**
2. In "Additional Boards Manager URLs" paste:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Go to **Tools → Board → Boards Manager**
4. Search for **esp32** and install **ESP32 by Espressif Systems**
5. Select board: **Tools → Board → ESP32 Arduino → ESP32 Dev Module**

---

## PART 2 — Firmware Configuration

Open `firmware/water_quality_esp32.ino` and update:

```cpp
const char* ssid     = "YOUR_WIFI_SSID";      // ← Apna WiFi naam likhو
const char* password = "YOUR_WIFI_PASSWORD";   // ← Apna WiFi password likhو
```

> [!IMPORTANT]
> Server IP update karo — apne PC ka local IP daalo:
> ```cpp
> const char* serverEndpoint = "http://<YOUR_PC_IP>:3001/api/sensors/data";
> ```
> PC ka IP jaanne ke liye: PowerShell mein `ipconfig` type karo → **IPv4 Address** dekho
> ESP32 aur PC ek hi WiFi pe hone chahiye.

---

## PART 3 — Running the System

### Step 1: Backend chalaao
```bash
cd "d:\water level detection and quality test"
node server.js
```

### Step 2: Frontend chalaao (naya terminal)
```bash
cd "d:\water level detection and quality test"
npm run dev
```

### Step 3: Browser mein kholо
**http://localhost:5173**

### Step 4: ESP32 pe firmware upload karo
1. Arduino IDE mein `firmware/water_quality_esp32.ino` kholо
2. Port select karo: **Tools → Port → COMx**
3. Upload button dabao (→)
4. Serial Monitor kholо (baud: **115200**)

---

## PART 4 — Verify Everything Works

| Step | Kya check karo |
|---|---|
| ✅ Backend running | Terminal mein `listening on port 3001` dikhе |
| ✅ ESP32 connected | Serial Monitor mein `WiFi Connected` dikhе |
| ✅ Data flowing | Backend terminal har 3 second mein data print kare |
| ✅ Dashboard live | Browser `localhost:5173` pe real values dikhе |
| ✅ Sensor test | Water Level sensor ko pani mein daalo → Relay LED GREEN + Buzzer beep kare |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| ESP32 WiFi se connect nahi ho raha | SSID aur password dobara check karo — case-sensitive hai |
| HTTP Response code: -1 | ESP32 server tak nahi pahunch raha — same WiFi pe hain? PC firewall check karo |
| Dashboard "Demo" dikh raha hai | Backend nahi chal raha — `node server.js` run karo |
| Relay LED hamesha RED | GPIO 25 wire check karo. Relay VCC pe 5V hai? |
| Buzzer beep nahi kar raha | GPIO 26 wire check karo. Buzzer polarity sahi hai? |
| Water Level kabhi WET nahi dikhata | Sensor VCC pe 3.3V check karo. GPIO 32 connection? |
| Turbidity hamesha 0 | Voltage divider wiring check karo. Sensor VCC pe 5V hai? |
