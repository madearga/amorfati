> *"I wish you can do everyday thoroughly."*

# Amor Fati — Life Grid

> *"Every box is a moment. See how many you've lived — and how many remain."*

A personal web app that visualizes your life as a grid of moments. Each cell represents a unit of time — days, weeks, months, or years. Cells fill up as time passes, leaving the empty ones as a quiet reminder of what remains.

Built for nightly reflection. Open it before bed. See the grid. Close it. No journaling, no stats, no social — just a visual lens on your finite time.

---

## 🇮🇩 Bahasa Indonesia

> *"Setiap kotak adalah momen. Lihat berapa banyak yang sudah kamu jalani — dan berapa yang tersisa."*

Aplikasi web pribadi yang memvisualisasikan hidupmu sebagai grid. Setiap sel mewakili satu unit waktu — hari, minggu, bulan, atau tahun. Sel terisi seiring waktu berjalan, menyisakan sel kosong sebagai pengingat bahwa waktu terbatas.

Dibangun untuk refleksi malam. Buka sebelum tidur. Lihat grid. Tutup. Tanpa jurnal, tanpa stats, tanpa social — hanya lensa visual tentang waktu yang terbatas.

---

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **PWA** (installable, service worker, push notifications)
- **localStorage** (no backend, no account)

## Features

- **Onboarding** — set your birth date, life expectancy, and notification time once
- **Life Grid** — visual grid at four granularities: day, week, month, year
- **Counter** — remaining time in the active unit (e.g. "1,247 weeks remaining")
- **Settings** — adjust life expectancy and notification time anytime
- **Nightly notification** — one push reminder per day to open and reflect
- **Dark mode** — always dark, always calm

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
npm run build
npm start
```

## License

MIT
