# F1 2026 Predictions App 🏎️

A mobile-first PWA for predicting the 2026 Formula 1 season.

| Calendar | Voting | Leaderboard |
|------|----------|--------|-------------|
| <img src="https://github.com/user-attachments/assets/de01bec2-829a-4b15-b126-9bf57640e9c9" width="180" alt="Calendar"> | <img src="https://github.com/user-attachments/assets/a38c9177-b5b2-4895-8c2b-0c14bcec0681" width="180" alt="Vote"> | <img src="https://github.com/user-attachments/assets/03d09dd6-29e9-4c1a-a133-846538b50044" width="180" alt="Leaderboard"> |

## Features

### ✅ Complete 2026 Season Data

- **22 Drivers** across all 11 teams (Alpine, Aston Martin, Williams, Audi, Cadillac, Ferrari, Haas, McLaren, Mercedes, Racing Bulls, Red Bull Racing)
- **24 Races** with full calendar (Australia through Abu Dhabi)
- Updated driver numbers and team assignments
- Country flags for each driver

### 🎯 Interactive Predictions

- **Drag-to-Reorder Rankings**: Intuitive drag-and-drop interface to order drivers for championship predictions
- **Race-by-Race Voting**: Vote for race winners with countdown timers to FP1
- **Full Calendar View**: See all 24 races with status indicators and countdowns
- **Leaderboard**: Track predictions and results

### 📱 Mobile-First Design

- **Responsive Layout**: Optimized for phones, tablets, and desktop
- **Touch-Optimized**: Large tap targets (64px+) for easy interaction
- **Safe Area Support**: Respects notches and rounded corners on modern devices
- **Bottom Navigation**: Easy thumb access on mobile devices
- **Icon-Based Nav**: Clear visual navigation with emoji icons
- **Smooth Animations**: Active states and micro-interactions for feedback
- **No Tap Highlight**: Clean, native-feeling interactions

### 🎨 Modern UI/UX

- **Gradient Headers**: Eye-catching red-to-orange F1-themed gradients
- **Team Colors**: Each driver card shows team colors for quick identification
- **Dark Mode**: Native dark theme for comfortable viewing
- **Smooth Scrolling**: Polished navigation experience
- **Status Indicators**: Visual feedback for race status (upcoming, today, completed)

## Pages

### 🏆 Season Predictions (`/season`)

- Rank all 22 drivers by dragging them into your predicted championship order
- Top 10 predictions are saved
- Real-time reordering with position numbers

### 📅 Calendar (`/calendar`)

- Full 2026 race calendar
- Highlighted next race with countdown
- Color-coded race status (completed, today, upcoming, future)
- Countdown timers showing days/hours until each race

### 🏁 Race Voting (`/race/[round]`)

- Vote for individual race winners
- Countdown to FP1 session
- All drivers listed with team colors and country flags

### 📊 Leaderboard (`/leaderboard`)

- View prediction statistics
- Track voting history

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **Drag & Drop**: @dnd-kit (sortable, utilities)
- **State**: Zustand with IndexedDB persistence
- **PWA**: Service Worker with offline support
- **TypeScript**: Full type safety

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3009](http://localhost:3009) to view the app.

## Mobile Optimization Features

1. **Viewport Configuration**: Allows zoom for accessibility
2. **Safe Area Insets**: Proper padding for notched devices
3. **Touch Actions**: Optimized touch event handling
4. **Large Touch Targets**: Minimum 48px for accessibility
5. **Bottom Navigation**: Thumb-friendly on mobile
6. **Responsive Typography**: Scales appropriately across devices

## Data Structure

### Drivers

Each driver includes:

- Name, number, team
- Team colors (for visual identification)
- Country flag emoji
- Unique ID

### Races

Each race includes:

- Round number (1-24)
- Official name and location
- Date/time (ISO format)
- Status tracking

## Progressive Web App (PWA)

The app works offline and can be installed on:

- iOS (Add to Home Screen)
- Android (Install App)
- Desktop (Chrome, Edge)

## License

MIT
