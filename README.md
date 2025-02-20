# MPD & LIC Finder 🕵️‍♂️

MPD & LIC Finder is a Chrome extension that automatically detects **`.mpd` files** and **URLs containing "lic"** in network requests. It allows users to **copy detected values** easily for further use.

## 🔥 Features
- ✅ **Detects `.mpd` files** from network requests.
- ✅ **Extracts `<cenc:pssh>` values** from `.mpd` files.
- ✅ **Finds and lists URLs containing "lic"** dynamically.
- ✅ **Allows easy copying of extracted values** with a single click.
- ✅ **Works per active tab**, keeping MPD and LIC results separate for each Chrome tab.
- ✅ **Lightweight & privacy-friendly**: Only listens to network requests, no tracking.

---

## 📥 Installation
### 1️⃣ **Manual Installation**
Since this is a developer extension, install it manually:

1. **Download the repository**:

`git clone https://github.com/davidebassan/MPD-LIC-Finder.git`

2. **Go to** `chrome://extensions/` in Chrome.
3. **Enable "Developer Mode"** (top-right corner).
4. **Click "Load unpacked"** and select the downloaded folder.

---

## 🎯 How to Use

1. Open a webpage that loads **`.mpd` files** (e.g., streaming services using MPEG-DASH).
2. If the page contains network requests with **"lic"**, the extension will capture them.
3. Click on the **MPD & LIC Finder icon** to open the popup.
4. You will see:
- **A dropdown of detected `.mpd` files.**
- **Extracted `<cenc:pssh>` values from `.mpd` files.**
- **A list of URLs containing "lic".**
5. **Copy values easily** using the "📋 Copy" buttons.

---

## 🛠️ Possible Use Cases
MPD & LIC Finder can be useful for:

- **Developers & Security Researchers**: Debugging network requests related to **DASH streaming & DRM-protected content**.
- **Streaming Enthusiasts**: Extracting `.mpd` files and their PSSH values.
- **Reverse Engineers**: Analyzing how streaming services handle MPD and license requests.

---

## 🔧 Development & Contribution
Want to improve the extension? Follow these steps:

1. Clone the repository:

`git clone https://github.com/davidebassan/MPD-LIC-Finder.git`

2. Make changes and commit:

`git add . git commit -m "Your feature update" git push origin main`

3. Submit a **Pull Request** and contribute! 🚀

---

## 📜 License
This project is licensed under the **MIT License** – you're free to modify and distribute it.

---

## ✉️ Contact & Feedback
Created by **Davide Bassan**. Feel free to reach out on [GitHub](https://github.com/davidebassan) if you have suggestions or issues.  
Happy coding! 🚀
