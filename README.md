# F1 2025 Vote PWA

A mobile-first, offline-capable voting app for the 2025 F1 Season built with Next.js 14 (App Router), Tailwind CSS, Zustand, and Workbox.

## Features

- **Offline First**: Votes are stored locally in IndexedDB and sync in background.
- **PWA**: Installable on iOS/Android.
- **Responsive**: Mobile-optimized design (thumb-friendly).
- **Zero API**: Fully client-side logic.

## Getting Started

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Run locally**:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000).

3.  **Build for production**:
    ```bash
    npm run build
    npm start
    ```

## Customization

### Changing Drivers or Calendar

Edit `lib/data.ts`.

- `drivers`: Array of driver objects (ID, Name, Number, Team, Color).
- `races`: Array of race events for the season.

### Resetting Votes

Clear your browser's IndexedDB storage for "f1-votes".

## Testing Offline Mode

1. Open Chrome DevTools (F12).
2. Go to **Application** tab.
3. Select **Service Workers** in the left sidebar.
4. Check **Offline**.
5. Reload the page or navigate. The app should continue to work, allowing you to vote.
6. Votes made offline will be persisted to IndexedDB.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State**: Zustand + IndexedDB (idb-keyval)
- **PWA**: @ducanh2912/next-pwa (Workbox wrapper)
