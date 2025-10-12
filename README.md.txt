# Bacis Calulator with Instant TipCalc — Quick Tip Calculator (PWA)

Fast, mobile‑first basic calculator with instant tip calculator. Enter a bill, tap **10% / 15% / 20% / 25%**, instantly see **Bill · Tip · Total**. Works offline and is installable as a PWA.

---

## ✨ Features

* One‑tap tip buttons (10/15/20/25%)
* Inline **Bill · Tip · Total** readout
* Clean mobile UI sized with `clamp()` for all phones
* PWA: offline cache, install to Home Screen
* Keyboard‑friendly (tab/enter support if you add it)

---

## 🚀 Live demo

* **Netlify:** [https://YOUR-SITE-NAME.netlify.app/](https://YOUR-SITE-NAME.netlify.app/)

> Replace the URL after deploying (see instructions below).

---

## 🧱 Tech Stack

* Vanilla **HTML/CSS/JavaScript**
* **Service Worker** for offline caching
* **Web App Manifest** with icons (installable)

---

## 📦 Project Structure

```
.
├─ index.html
├─ styles.css
├─ main.js
├─ sw.js                 # service worker (offline caching)
├─ site.webmanifest      # PWA manifest
└─ icons/
   ├─ icon-192.png
   ├─ icon-512.png
   ├─ maskable-192.png
   └─ maskable-512.png
```

---

## 🛠️ Local Setup

No build step required. Just open `index.html` or run any static server.

```bash
# option A: VS Code Live Server extension

# option B: npx http-server (Node required)
npm i -g http-server
http-server -p 5173
```

> Visit [http://localhost:5173](http://localhost:5173) (or the port you choose).

---

## 📲 PWA Details

* `site.webmanifest` declares app name, icons, colors, start URL.
* `sw.js` precaches core assets and serves them offline.
* Registering the service worker is handled in `main.js`:

```js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(console.error)
  })
}
```

**iOS edge‑to‑edge:**

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

```css
#calculator { padding-bottom: calc(14px + env(safe-area-inset-bottom)); }
```

---

## 🌐 Deploy to Netlify

1. **Push to GitHub**

   * Create a new repo and commit all files.
2. **Netlify → Add new site → Import from Git**

   * Select your repo.
   * Build command: **(none)**
   * Publish directory: **/**
3. **Post‑deploy**

   * Update the **Live demo** URL in this README.
   * Confirm PWA: Chrome DevTools → Application → Manifest & Service Workers.

> If using a subdirectory or custom paths, ensure `sw.js` and icons resolve (no 404s). Update `ASSETS` in `sw.js` accordingly.

---

## 🧪 Manual Test Checklist

* [ ] Enter bill **50.52**, tap **10%** → **Tip 5.05**, **Total 55.57**
* [ ] Enter bill **125.20**, tap **20%** → **Tip 25.04**, **Total 150.24**
* [ ] Enter bill **89.65**, tap **25%** → **Tip 22.41**, **Total 112.06**
* [ ] `AC` clears display and hides Tip/Total
* [ ] Works offline after first load
* [ ] Install prompt / Add to Home Screen works

---

## ♿ Accessibility Notes

* High contrast on dark background
* Large hit targets (circular buttons, `aspect-ratio: 1/1`)
* Consider: `aria-live` region for Tip/Total; logical tab order; focus styles

---

## 🧭 Roadmap (nice-to-haves)

* Currency/locale selection (USD, KRW, etc.)
* Default tip setting
* Bill split (people count)
* Key click haptics (via Capacitor) and share sheet
* History of last 10 calculations (localStorage)

---

## 📄 License

MIT © penningtonProgramming

---

## 📷 Screenshots (optional)

![TipCalc mobile](images/mobile.png)
