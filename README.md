# 📓 STA Journal - Scalper Trading Academy

> **Local-First, Dual-Persistence Trading Journal Web Application**  
> Built with **React 18**, **Vite**, and **Tailwind CSS**.  
> **Designed specifically for Scalpers and Day Traders.**  
> 
> 🔒 **100% OF YOUR DATA IS STORED LOCALLY ON YOUR COMPUTER**  
> - No external database  
> - No cloud server subscriptions  
> - Zero data leaves your computer  
> - Works 100% offline  

---

## 📑 Table of Contents
1. [Physical File Locations on Your PC](#1-physical-file-locations-on-your-pc)
2. [The Separate Local Data Files (File-by-File Breakdown)](#2-the-separate-local-data-files-file-by-file-breakdown)
3. [Complete Data Field Dictionary](#3-complete-data-field-dictionary)
4. [How Dual-Storage & Auto-Sync Works](#4-how-dual-storage--auto-sync-works)
5. [How to View, Edit & Backup Your Files in Windows](#5-how-to-view-edit--backup-your-files-in-windows)
6. [How Uploaded Chart Images are Handled](#6-how-uploaded-chart-images-are-handled)
7. [How to Inspect Data in the Browser (F12)](#7-how-to-inspect-data-in-the-browser-f12)
8. [Application Views & Features Walkthrough](#8-application-views--features-walkthrough)
9. [Physical File Controls in the Settings Page](#9-physical-file-controls-in-the-settings-page)
10. [Frequently Asked Questions (FAQ)](#10-frequently-asked-questions-faq)
11. [How to Run & Build the Project](#11-how-to-run--build-the-project)

---

## 1. Physical File Locations on Your PC

All your data is saved into **separate, physical JSON files** inside your project folder on your Desktop:

### 📂 Folder Path:
```text
C:\Users\nandh\Desktop\naveen web\data\
```

### 📁 Directory Layout:
```text
naveen web/
├── data/
│   ├── trades.json            <-- Individual file containing all trade logs
│   ├── journals.json          <-- Individual file containing all journal folders
│   ├── profile.json           <-- Individual file containing trader profile & settings
│   └── sta_full_backup.json   <-- Master backup snapshot containing everything
├── src/                       <-- React source code
├── public/                    <-- Static assets
├── index.html                 <-- Entry HTML
├── package.json               <-- Project configuration
└── vite.config.js             <-- Vite server & local file persistence plugin
```

---

## 2. The Separate Local Data Files (File-by-File Breakdown)

### 📄 File 1: `data/trades.json`
Every trade setup, outcome, P&L, emotional state, notes, and chart screenshots are saved here.

```json
[
  {
    "id": "trade-demo-1",
    "journalId": "journal-demo",
    "date": "2024-10-01",
    "time": "10:04",
    "pair": "xAU",
    "direction": "Buy",
    "result": "Win",
    "timeframe": "15m",
    "session": "London",
    "pnl": 453.00,
    "rr": "1:1.1",
    "entryType": "Breakout",
    "tradingPlan": "No Plan",
    "emotion": "Confident",
    "notes": "Clean London session breakout on Gold (XAUUSD) after liquidity sweep of Asian highs. Quick impulse move to TP.",
    "chartImage1": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "chartUrl2": "https://images.unsplash.com/...",
    "chartUrl3": "",
    "exitChart": "",
    "createdAt": "2024-10-01T10:04:00.000Z"
  }
]
```

### 📄 File 2: `data/journals.json`
Stores all your journal accounts (e.g. `demo`, `test1`, or your custom prop accounts).

```json
[
  {
    "id": "journal-test1",
    "name": "test1",
    "description": "Scalping tests & live setups",
    "color": "#06b6d4",
    "createdAt": "2024-09-15"
  },
  {
    "id": "journal-demo",
    "name": "demo",
    "description": "Main demo journal for scalping",
    "color": "#6366f1",
    "createdAt": "2024-10-01"
  }
]
```

### 📄 File 3: `data/profile.json`
Stores your personal trader settings, role, avatar initials, and preferred currency symbol.

```json
{
  "name": "Naveen Kumar",
  "role": "Trader",
  "avatar": "NK",
  "email": "naveen.trader@example.com",
  "currency": "$",
  "portalUrl": "https://scalpertradingacademy.com"
}
```

### 📄 File 4: `data/sta_full_backup.json`
A combined single-file snapshot of your entire database for quick one-click archiving or transferring.

---

## 3. Complete Data Field Dictionary

Here is what each field in `trades.json` means:

| Field Name | Type | Description | Example Values |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the trade record | `"trade-1729440240000"` |
| `journalId` | `string` | ID of the journal this trade belongs to | `"journal-demo"` |
| `date` | `string` | Date of execution (`YYYY-MM-DD`) | `"2024-10-01"` |
| `time` | `string` | Time of execution (`HH:mm`) | `"10:04"` |
| `pair` | `string` | Traded asset or forex symbol | `"XAUUSD"`, `"EURUSD"`, `"US30"`, `"BTCUSD"` |
| `direction` | `string` | Trade direction | `"Buy"` (Long) or `"Sell"` (Short) |
| `result` | `string` | Trade outcome | `"Win"`, `"Loss"`, or `"Breakeven"` |
| `pnl` | `number` | Net monetary gain or loss | `453.00`, `-120.50`, `0.00` |
| `rr` | `string` | Risk to Reward ratio achieved | `"1:1.1"`, `"1:2.0"`, `"1:3.5"` |
| `timeframe` | `string` | Execution chart timeframe | `"1m"`, `"5m"`, `"15m"`, `"1h"`, `"4h"` |
| `session` | `string` | Trading session | `"London"`, `"New York"`, `"Asian"`, `"Sydney"` |
| `entryType` | `string` | Setup trigger classification | `"Breakout"`, `"Pullback"`, `"Liquidity Sweep"` |
| `tradingPlan` | `string` | Rule-based trading playbook | `"No Plan"`, `"London Scalp"`, `"SMC Strategy"` |
| `emotion` | `string` | Psychological state during trade | `"Confident"`, `"FOMO"`, `"Disciplined"`, `"Revenge"` |
| `notes` | `string` | Detailed analysis & post-trade thoughts | Plain text notes |
| `chartImage1` | `string` | Base64-encoded local entry screenshot | `"data:image/jpeg;base64,..."` |
| `exitChart` | `string` | Base64-encoded local exit screenshot | `"data:image/jpeg;base64,..."` |
| `chartUrl2` | `string` | External chart image link | `"https://www.tradingview.com/x/..."` |
| `chartUrl3` | `string` | Additional external chart link | `"https://..."` |
| `createdAt` | `string` | ISO 8601 creation timestamp | `"2024-10-01T10:04:00.000Z"` |

---

## 4. How Dual-Storage & Auto-Sync Works

Every time you log, edit, or delete a trade, two persistence mechanisms execute in parallel:

```text
               ┌──────────────────────────────────────────────┐
               │              User Interaction                │
               │   (New Trade, Edit Setup, Rename Journal)    │
               └───────────────────────┬──────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────────────────────┐   ┌────────────────────────────────────────┐
│     Layer 1: Browser LocalStorage     │   │     Layer 2: Physical PC Disk Files    │
│                                       │   │                                        │
│  - window.localStorage.setItem()      │   │  - POST /api/save-local-files          │
│  - Instant UI re-render (< 2ms)       │   │  - Writes directly to disk:            │
│  - Win Rate % & charts update live    │   │    • C:\...\data\trades.json           │
│  - Works with zero network latency    │   │    • C:\...\data\journals.json         │
│                                       │   │    • C:\...\data\profile.json          │
└───────────────────────────────────────┘   └────────────────────────────────────────┘
```

### Why Dual-Storage is Superior:
1. **Ultra Fast Experience**: LocalStorage ensures zero loading spinners and instantaneous UI feedback.
2. **Permanent Safety**: The physical files on your hard drive guarantee that even if you wipe browser cookies or format your browser, your files remain completely untouched on your PC.
3. **Bidirectional Sync**: When the app starts, it checks the physical files on disk. If you edited `trades.json` in Notepad, the app updates its state automatically.

---

## 5. How to View, Edit & Backup Your Files in Windows

You can open and inspect your data at any time directly through Windows Explorer:

1. Press **`Win + E`** to open File Explorer.
2. Navigate to:
   ```text
   C:\Users\nandh\Desktop\naveen web\data\
   ```
3. Right-click any file (`trades.json`, `journals.json`, `profile.json`) and choose **Open with -> Notepad** (or VS Code).
4. **Copying / Backing Up**:
   - You can copy the entire `data/` folder to a USB thumb drive, external hard drive, or cloud backup folder (Google Drive, Dropbox, OneDrive).

---

## 6. How Uploaded Chart Images are Handled

- When you click **"Choose File"** in the New Entry modal, the browser reads the file via the HTML5 `FileReader` API.
- An in-memory canvas automatically resizes large high-DPI screenshots down to a maximum width of `1280px` and compresses them to clean JPEG quality (`0.78`).
- The image is converted into an offline **Base64 Data URL** string (`data:image/jpeg;base64,...`).
- This means your chart screenshots are **physically saved inside `data/trades.json`** directly on your hard drive — completely independent of external image hosting services.

---

## 7. How to Inspect Data in the Browser (F12)

You can also view the browser's copy of the data at any time:

1. Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.
2. Press **`F12`** (or right-click anywhere and click **Inspect**).
3. Click the **Application** tab at the top (In Firefox, click **Storage**).
4. On the left sidebar, expand **Local Storage** -> `http://localhost:5173`.
5. Click on `sta_trades`, `sta_journals`, or `sta_user_profile` to view your data in real time.

---

## 8. Application Views & Features Walkthrough

### 🏠 1. Dashboard (Home View)
- Header: **`Hey Naveen 👋`** with current date and greeting.
- 4 Top Metric Cards: **Total Trades**, **Win Rate %**, **Wins count**, and **Total Net P&L** (`+$453.00`).
- **Performance Overview**: Radial donut chart displaying Win Rate % with visual progress bars for Wins, Losses, and Breakevens.
- **My Journals**: Quick-access list of trading accounts with `+ New` button.
- **Recent Entries**: Feed of latest executed setups with one-click full inspection.

### 📓 2. Journals View
- **My Journals Directory**: Overview cards showing trades count, win rate %, and total P&L for each account.
- **Inside Journal (`← demo`)**:
  - Filter Pills: **`All`**, **`Win`** (green), **`Loss`** (red), **`Buy`** (blue), **`Sell`** (purple).
  - Search bar: Filter instantly by pair, session, notes, or strategy.
  - Action Menu (`...`): **Rename Journal**, **Manage Fields / Color**, and **Delete Journal**.
  - Trade Cards: Display Pair (`xAU`), Direction (`Buy`), Session (`London`), Date, P&L (`+$453.00`), Result badge (`Win`), and Risk:Reward (`1:1.1`).

### 📊 3. Performance Analysis
- Filter by specific Journal or Trading Plan.
- **Trade Distribution**: Donut breakdown of Wins, Losses, and Breakevens.
- **Asset / Pair Performance**: Detailed breakdown by currency pair or commodity.
- **Session Performance**: London, New York, Asian, and Sydney breakdowns.
- **Trading Plan Performance**: Evaluate win rate by strategy.
- **Psychology Analysis**: Win rate and profit contribution by emotion (*Confident*, *Disciplined*, *FOMO*, *Revenge*, *Impatient*).
- **Weekly Performance Report**: Generates an automated trader assessment card with discipline grade and actionable insights.

### 📅 4. Trading Calendar
- Monthly calendar grid (`< October 2024 >`).
- Active trading days display trade counts and daily Net P&L (`+$453` in green or negative in red).
- Time filters: **`All`**, **`This Week`**, **`This Month`**.
- Clicking any date filters the trade feed below to that specific day.

### ✍️ 5. New Entry Modal
- Date picker & Journal selector.
- Pair input with 1-click quick-select chips (`XAUUSD`, `EURUSD`, `GBPUSD`, `BTCUSD`, `US30`, `NAS100`).
- Direction toggle (`Buy` / `Sell`) & Result selector (`Win` / `Loss` / `Breakeven`).
- Timeframe & Session dropdowns.
- P&L amount & Risk:Reward ratio.
- Entry Type & Trading Plan tags.
- Emotional state selector.
- Detailed Trade Notes textarea.
- Chart attachments: Local file upload (Entry chart & Exit chart) + external URLs.

---

## 9. Physical File Controls in the Settings Page

Go to the **Settings** view in the application to access the physical file manager:

1. **"Sync to Files" button**: Manually forces an immediate write of all current records to `data/trades.json`, `data/journals.json`, and `data/profile.json`.
2. **"Reload From Files" button**: Reads the latest data from `data/*.json` on your PC and updates the web app.
3. **Individual Download Buttons**: Download `trades.json`, `journals.json`, or `profile.json` independently to your PC.
4. **"Save to Custom Location on PC"**: Opens the native Windows file save dialog to save a copy anywhere on your computer (e.g. an external drive).
5. **Live Storage Monitor**: Shows the exact kilobytes used by each key and remaining browser storage capacity.

---

## 10. Frequently Asked Questions (FAQ)

#### Q: If I shut down my computer, will my data be lost?
**No.** All data is permanently written to physical files in `C:\Users\nandh\Desktop\naveen web\data\` and to browser `localStorage`. It will never disappear on restart.

#### Q: Can I edit `data/trades.json` directly in Notepad?
**Yes.** You can open `data/trades.json` in Notepad, add or modify entries, save the file, and then click **"Reload From Files"** in the Settings tab (or refresh the page).

#### Q: Can I back up my data to a USB flash drive or Google Drive?
**Yes.** Simply copy the `data/` folder to your USB drive, or use the **"Export Backup (JSON)"** button in the Settings page.

#### Q: Is any of my trading data sent to an external server?
**No.** The app is 100% local. It contains zero tracking, zero third-party analytics, and zero external database connections.

---

## 11. How to Run & Build the Project

### Prerequisites:
- [Node.js](https://nodejs.org/) (v18 or higher)

### 1. Start Development Server:
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your web browser.

### 2. Build for Production / Static Hosting:
```bash
npm run build
```
Generates an optimized static production bundle in the `dist/` directory.
