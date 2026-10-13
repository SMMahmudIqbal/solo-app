# SOLO — The Todo App That Shows You Exactly One Thing

> **Design Read:** Radical minimalist focus utility for high-leverage execution, styled in authentic **Nothing OS** hardware and typography aesthetics.  
> **Dials:** `DESIGN_VARIANCE: 4` | `MOTION_INTENSITY: 2` | `VISUAL_DENSITY: 2`

---

## 1. Product Principles Implemented

1. **One Visible Task (The Billboard):**
   - The current active task dominates the display in massive Dot-Matrix type (`DotGothic16`), surrounded by deliberate, calm whitespace.
   - Zero endless lists or checkbox overwhelm. The system determines the focus; you execute.
2. **2-Second Capture (`N` or `C` Hotkey):**
   - Instant capture modal into the priority buffer with optional quick time estimates and a "Surface immediately" override.
3. **No Anxiety Theater:**
   - No red badges or guilt messages. Tasks quietly reorder and stay calm.
   - Signal Red (`#D71921`) is preserved strictly for tasks untouched for 7+ days (`>7D IDLE`) and destructive "Abandon Task" triggers.
4. **Dot-Matrix Stamp Celebration:**
   - Tapping the custom dot-matrix checkbox triggers a cell-by-cell square fill sequence (16 dots in sequence).
   - Once filled, a full-screen dot-matrix stamp (`DONE.`) activates with subtle monochrome square confetti before sliding the next task into focus.
5. **Nothing OS Homescreen Widget Emulation:**
   - Interactive 2x2 widget simulator showing how the active task renders on a Nothing Phone lockscreen or homescreen.
6. **Executed Log & Peek Drawer:**
   - Quiet monospace bottom line: `QUEUE · [COUNT] NEXT [PEEK]` toggles the priority drawer without cluttering the screen.
   - Plain history log (`Executed Log`) preserves finished items with timestamps.

---

## 2. Technical Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + Nothing OS CSS Tokens
- **Typography:** Google Fonts `DotGothic16` (Dot-Matrix Display), `Space Grotesk` (Body), and `Space Mono` (Hardware Specs & Annotations)
- **State Management:** Reactive local storage persistence for tasks and history
- **Interactive Micro-Interactions:** Custom SVG/CSS cell-by-cell dot-matrix checkbox fill + Canvas Confetti monochrome burst
- **Tactile Audio & Haptics Engine:** Web Audio API algorithmic mechanical relay clicks and low-frequency stamp impact sound (zero external audio assets)
- **Native Android APK Package:** Built with Capacitor + Gradle 8.14 + Android SDK 34/36

---

## 3. Android APK File

The ready-to-install Android package is available directly at:
- Root project file: [`SOLO-v1.0.apk`](file:///C:/Users/rupai/.gemini/antigravity/scratch/solo-app/SOLO-v1.0.apk) (4.1 MB)
- Web direct download: Accessible directly from the top navigation bar pill (`APK · 4.1MB`) when running the app.
- Build output path: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 4. Keyboard Shortcuts

- `N` or `C`: Open Quick Capture Buffer
- `Q`: Peek / Toggle Queue Drawer
- `H`: Open Executed History Log
- `ESC`: Dismiss all drawers / overlays / stamps

---

*Developed by S. M. Mahmud Iqbal*
