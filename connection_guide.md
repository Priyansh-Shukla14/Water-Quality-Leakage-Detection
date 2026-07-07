# 🌊 AquaGuard — Connection & Setup Guide (Single Sensor Edition)

## System Architecture

```
[ESP32 + Sensors] → WiFi HTTP POST → [server.js :3001] → [React Dashboard :5174]
```

---

## How It Works

| Condition | Water Level Sensor | Relay Module LED | Buzzer |
|---|---|---|---|
| **No water** | GPIO 32 = LOW | 🔴 **RED** (relay OFF) | 🔇 Silent |
| **Water detected** | GPIO 32 = HIGH | 🟢 **GREEN** (relay ON) | 🔊 Beeping every 500ms |

> The relay module has a **built-in LED** that visually changes:
> - **RED** when relay is de-energized (no water)
> - **GREEN** when relay is energized (water detected)

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

## PART 2 — Hardware Wiring

### 📌 Pin Connections (Single Sensor Setup)

| Component | Component Pin | ESP32 Pin | Notes |
|---|---|---|---|
| **SEN0189 Turbidity** | VCC | 5V (Vin) | ⚠️ Must use 5V, NOT 3.3V |
| | GND | GND | |
| | Signal | GPIO 35 | Via 10kΩ + 20kΩ voltage divider (see below) |
| **pH Sensor Module** | V+ | 5V (Vin) | |
| | G | GND | |
| | PO | GPIO 14 | Analog probe output |
| **Water Level Sensor** | VCC | 3.3V | Single sensor only |
| | GND | GND | |
| | Signal | GPIO 32 | HIGH = water touching sensor |
| **Relay Module** | VCC | 5V (Vin) | |
| | GND | GND | |
| | IN | GPIO 25 | HIGH = Relay ON → LED turns GREEN |
| **Buzzer** | + | GPIO 26 | HIGH = Beep |
| | − | GND | |

### ⚡ Relay LED Behavior
```
GPIO 25 = LOW  → Relay OFF → LED = 🔴 RED   (no water)
GPIO 25 = HIGH → Relay ON  → LED = 🟢 GREEN  (water detected)
```

The relay module's **built-in LED** is your visual indicator:
- When the water level sensor is **DRY** → LED stays **RED**
- When water **touches the sensor** → LED flips to **GREEN** + Buzzer beeps

### ⚠️ Voltage Divider for SEN0189 Turbidity Signal Pin
The SEN0189 outputs **up to 4.5V** but ESP32 GPIO is **3.3V max**. Use a voltage divider:

```
Sensor Signal Pin ──┬── 10kΩ ──── GPIO 35 (ESP32)
                    │
                   20kΩ
                    │
                   GND
```
This scales 4.5V → ~3.0V which is safe for the ESP32.

---

## PART 3 — Firmware Configuration

Open `firmware/water_quality_esp32.ino` and update these two lines:

```cpp
const char* ssid     = "YOUR_WIFI_SSID";      // ← Type your WiFi name here
const char* password = "YOUR_WIFI_PASSWORD";   // ← Type your WiFi password here
```

> [!IMPORTANT]
> Update the server IP to your computer's local IP address:
> ```cpp
> const char* serverEndpoint = "http://<YOUR_PC_IP>:3001/api/sensors/data";
> ```
> Find your PC's IP: open PowerShell → type `ipconfig` → look for **IPv4 Address**
> Make sure your ESP32 and PC are on the **same WiFi network**.

---

## PART 4 — Running the Backend Server

Open a **terminal** in the project folder and run:

```bash
cd "d:\water level detection and quality test"
node server.js
```

You should see:
```
==================================================
🌊 AquaGuard Backend listening on port 3001
👉 ESP32 should POST data to: http://<YOUR_IP>:3001/api/sensors/data
🤖 Simulated readings will start in ~3s (until ESP32 connects)
==================================================
[Simulation] 🔄 No ESP32 detected — starting simulated readings...
[Simulated ] pH: 7.7 | Turbidity: 6.42 NTU | DRY → Relay LED=RED | Buzzer=SILENT | Quality: Moderate
[Simulated ] pH: 7.9 | Turbidity: 8.15 NTU | WET → Relay LED=GREEN | Buzzer=BEEPING | Quality: Moderate
```

> [!NOTE]
> Keep this terminal open the entire time. The simulation alternates WET/DRY every 3 seconds so you can preview the dashboard behavior.

---

## PART 5 — Running the Frontend Dashboard

Open a **second terminal** and run:

```bash
cd "d:\water level detection and quality test"
npm run dev
```

Then open your browser at **[http://localhost:5173](http://localhost:5173)**

---

## PART 6 — Upload Firmware to ESP32

1. Open `firmware/water_quality_esp32.ino` in **Arduino IDE**
2. Select your port: **Tools → Port → COMx**
3. Click the **Upload** button (→)
4. Open **Serial Monitor** (baud rate: **115200**)

You should see output like:
```
🔗 Connecting to WiFi: YOUR_SSID
...
✅ WiFi Connected!
📡 IP Address: 192.168.0.105
──────────────────────────────────────────────
💡 Relay LED: RED = No Water | GREEN = Water Detected
🔊 Buzzer:    Silent = No Water | Beeping = Water Detected
──────────────────────────────────────────────
[pH]        Raw: 2048 | Voltage: 1.650V | pH: 7.50
[Turbidity] Raw: 3800 | GPIO: 3.058V | Sensor: 4.587V | NTU: 0.0
[Water Lvl] Sensor: 🔴 DRY (No Water) | Leakage: NO ✅
📤 POST → {"ph":7.5,"turbidity":0.0,"waterLevel":0,"waterLevelPct":0,"waterDetected":false,...}
✅ HTTP 200
```

When you **dip the sensor in water**:
```
[Water Lvl] Sensor: 💧 WET (Water Detected) | Leakage: NO ✅
📤 POST → {"ph":7.5,"turbidity":0.0,"waterLevel":100,"waterLevelPct":100,"waterDetected":true,...}
✅ HTTP 200
```
→ **Relay LED turns GREEN** + **Buzzer starts beeping**!

---

## PART 7 — Verify Everything Works

| Step | What to check |
|---|---|
| ✅ Backend running | Terminal shows `listening on port 3001` |
| ✅ ESP32 connected | Serial Monitor shows `WiFi Connected` |
| ✅ Data flowing | Backend terminal prints real ESP32 data every 3 seconds |
| ✅ Dashboard live | Browser at `localhost:5173` shows **real values** (no "Demo" badge) |
| ✅ Sensor test | Touch sensor to water → Relay LED turns GREEN + Buzzer beeps |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| ESP32 can't connect to WiFi | Double-check SSID and password — case-sensitive |
| HTTP Response code: -1 | ESP32 can't reach server — ensure both on same WiFi. Check PC firewall |
| Dashboard still shows "Demo" | Backend not running. Run `node server.js` |
| Relay LED always RED | Check GPIO 25 wire. Verify 5V to relay VCC |
| Buzzer not beeping | Check GPIO 26 wire. Verify buzzer polarity |
| Sensor never reads WET | Ensure 3.3V to sensor VCC. Check GPIO 32 connection |
| Turbidity always 0 | Check voltage divider wiring. Verify 5V to sensor |

---

## Quick Reference

| Port | Purpose |
|---|---|
| **5173** | Vite dev server — view the dashboard in browser |
| **3001** | Express backend — receives ESP32 data & serves frontend API |

| GPIO | Component | Signal |
|---|---|---|
| GPIO 14 | pH Sensor (PO) | Analog in |
| GPIO 35 | Turbidity Sensor | Analog in (via divider) |
| GPIO 32 | Water Level Sensor | Digital in (HIGH = wet) |
| GPIO 25 | Relay Module (IN) | Digital out (HIGH = LED GREEN) |
| GPIO 26 | Buzzer (+) | Digital out (HIGH = beep) |
