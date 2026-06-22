# 🌊 AquaGuard — Full Connection & Setup Guide

## System Architecture

```
[ESP32 + Sensors] → WiFi HTTP POST → [server.js :3001] → [React Dashboard :5174]
```

---

## PART 1 — Arduino IDE: Libraries to Install

Open **Arduino IDE** → Go to **Tools → Manage Libraries** and install each of these:

| Library Name | Version | Install via |
|---|---|---|
| **ArduinoJson** by Benoit Blanchon | `v6.x` (latest) | Library Manager |
| **WiFi** (ESP32 built-in) | Built-in | Already included with ESP32 board package |
| **HTTPClient** (ESP32 built-in) | Built-in | Already included with ESP32 board package |

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

### 📌 Pin Connections

| Component | Component Pin | ESP32 Pin | Notes |
|---|---|---|---|
| **SEN0189 Turbidity** | VCC | 5V (Vin) | Do NOT use 3.3V |
| | GND | GND | |
| | Signal | GPIO 34 (via voltage divider) | ⚠️ Use 10kΩ + 20kΩ resistors (see below) |
| **Water Level Sensor 1** (Bottom/Low) | VCC | 3.3V | |
| | GND | GND | |
| | Signal | GPIO 32 | LOW = submerged |
| **Water Level Sensor 2** (Top/High) | VCC | 3.3V | |
| | GND | GND | |
| | Signal | GPIO 33 | LOW = submerged |
| **Relay Module** | VCC | 5V (Vin) | |
| | GND | GND | |
| | IN (Control) | GPIO 25 | HIGH = Relay ON |
| **Buzzer** | + | GPIO 26 | HIGH = Buzzer ON |
| | − | GND | |

### ⚠️ Voltage Divider for SEN0189 Signal Pin
The SEN0189 turbidity sensor outputs **up to 4.5V** but ESP32 GPIO pins are only **3.3V tolerant**. You MUST use a voltage divider:

```
Sensor Signal Pin ──┬── 10kΩ ──── GPIO 34 (ESP32)
                    │
                   20kΩ
                    │
                   GND
```
This scales 4.5V → ~3.0V which is safe for the ESP32.

---

## PART 3 — Firmware Configuration

Open [water_quality_esp32.ino](file:///c:/Users/DARSHIL%20PATEL/OneDrive/Desktop/IOT%20PBL/Water-Quality-Leakage-Detection/firmware/water_quality_esp32.ino) and update these two lines:

```cpp
const char* ssid     = "YOUR_WIFI_SSID";      // ← Type your WiFi name here
const char* password = "YOUR_WIFI_PASSWORD";   // ← Type your WiFi password here
```

> [!IMPORTANT]
> The server endpoint is already pre-configured with your PC's IP address:
> ```cpp
> const char* serverEndpoint = "http://192.168.0.110:3001/api/sensors/data";
> ```
> Make sure your ESP32 and your PC are connected to the **same WiFi network**.

---

## PART 4 — Running the Backend Server

Open a **new terminal** in the project folder and run:

```bash
cd "c:\Users\DARSHIL PATEL\OneDrive\Desktop\IOT PBL\Water-Quality-Leakage-Detection"
node server.js
```

You should see:
```
==================================================
🌊 AquaGuard Backend listening on port 3001
👉 ESP32 should POST data to: http://192.168.0.110:3001/api/sensors/data
==================================================
```

> [!NOTE]
> Keep this terminal open the entire time. If you close it, the ESP32 data won't reach the dashboard.

---

## PART 5 — Running the Frontend Dashboard

Open a **second terminal** and run:

```bash
cd "c:\Users\DARSHIL PATEL\OneDrive\Desktop\IOT PBL\Water-Quality-Leakage-Detection"
npm run dev
```

Then open your browser at **[http://localhost:5174](http://localhost:5174)**

---

## PART 6 — Upload Firmware to ESP32

1. Open `firmware/water_quality_esp32.ino` in **Arduino IDE**
2. Select the correct port: **Tools → Port → COMx** (whichever port your ESP32 is on)
3. Click the **Upload** button (→)
4. Open **Serial Monitor** (Tools → Serial Monitor, baud rate: **115200**)
5. You should see:
   ```
   Connecting to WiFi: YOUR_SSID
   ...
   WiFi Connected successfully!
   IP Address: 192.168.0.xxx
   Turbidity Voltage: 4.10V, NTU: 2.3
   Water Level: 50.0%
   Sending POST data: {"ph":7.0,"turbidity":2.3,...}
   HTTP Response code: 200
   ```

---

## PART 7 — Verify Everything Works

| Step | What to check |
|---|---|
| ✅ Backend running | Terminal shows `listening on port 3001` |
| ✅ ESP32 connected | Serial Monitor shows `WiFi Connected` |
| ✅ Data flowing | Backend terminal prints `[Sensor Update] pH: ...` every 3 seconds |
| ✅ Dashboard live | Browser at `localhost:5174` shows **real values** (no "Demo" badge) |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| ESP32 can't connect to WiFi | Double-check SSID and password — they are case-sensitive |
| HTTP Response code: -1 | ESP32 can't reach the server — ensure both are on the same WiFi. Check PC firewall |
| Dashboard still shows "Demo" | Backend server is not running. Run `node server.js` in a new terminal |
| Turbidity always 0 | Check voltage divider wiring. Verify sensor is powered by 5V |
| Water level always 10% | Check that float switch GND and VCC are connected correctly |

---

## Port Summary (Quick Reference)

| Port | What it does |
|---|---|
| **5174** | Vite dev server — view the dashboard in your browser |
| **3001** | Express backend — receives ESP32 data & answers frontend API calls |
