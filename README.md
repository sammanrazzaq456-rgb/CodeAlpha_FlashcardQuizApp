# Memora Flashcards 

A single-screen flashcard study application featuring tactile 3D card flips, rich imagery, topic tagging, procedural Lo-Fi ambient audio, and daily streak habit tracking.

---

##  Features

### 1. 3D Tactile Flashcard Flipping
- Realistic 3D card rotation using CSS 3D transforms (`perspective`, `rotateY`, `backface-visibility`).
- Smooth slide transitions when navigating between cards.
- Instant toggle with mouse clicks or keyboard shortcuts (`Space` or `Enter`).

### 2. Topic Tagging & Smart Deck Filtering
- **Tag Cards by Subject**: Organize cards with topics such as `Science`, `Biology`, `Geography`, `Computer Science`, `History`, `Arts`, or custom tags.
- **One-Click Topic Filter**: The Deck Manager features a horizontal filter bar with real-time card counts for each topic (`All Topics`, `#Science`, `#Geography`, etc.).
- **Click-to-Filter on Cards**: Clicking any topic tag badge directly on a card filters the deck to that topic immediately.
- **Tag Search**: The search bar queries questions, answers, and `#tags`.

### 3. Visual Learning with High-Resolution Imagery
- Supports image uploads (via FileReader) or image URLs for each card.
- Starter deck includes 10 visual flashcards with custom-generated illustrations covering astronomy, biology, computer science, geography, physics, and world art.

### 4. Spaced Mastery & Confetti Celebration
- Rate each flashcard as **Still Learning** (amber) or **Mastered** (emerald).
- Visual progress bar displays unrated, learning, and mastered counts.
- **Mastery Celebration**: Full-screen confetti celebration triggers when you master all cards in the deck.

### 5. Daily Study Streak & Habit Retention
- Tracks consecutive days studied with automatic calendar calculations.
- Detailed streak stats modal showing current streak, longest streak record, total study sessions, and milestone progress badges.
- Visual indicator in the header whenever today's study goal is met.

### 6. Procedural Lo-Fi Ambient Study Sound
- Synthesized in real time using the **Web Audio API** (100% offline, zero external audio asset lag).
- Multiple study presets:
  - 🌌 **Deep Space Drone** (warm analog low-frequency relaxation)
  - 🌧️ **Rain & Thunder** (pink-noise rain simulation with gentle thunder rumbles)
  - 🧠 **Binaural Study Beats** (40Hz Gamma wave entrainment for deep concentration)
  - 🍃 **Forest Wind** (modulated filtered ambient breeze)
- Adjustable volume control and quick toggle from the header and side drawer.

### 7. Interactive 3D Parallax Background
- Dynamic Canvas 3D scene with floating geometric polyhedra (cubes, rings, spheres).
- Realistic mouse parallax tilt and gentle ambient audio pulsing.

### 8. Deck Management, Import & Export
- **Full Deck Search**: Quickly find any flashcard across your entire library.
- **JSON Backup & Restore**: Export your entire deck to a standalone `.json` file or import cards from backup.
- **One-Click Default Restore**: Revert to the 10 starter cards anytime.

### 9. Google Account & Profile Integration
- Integrated Google Account profile view with user avatars and sync status.

### 10. Light & Dark Themes
- Seamless toggle with persistence in `localStorage` and system theme detection.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| Space / Enter | Flip flashcard (Question ⇄ Answer) |
| → | Next flashcard |
| ← | Previous flashcard |
| N | Add new flashcard |
| E | Edit current flashcard |
| Del / Backspace | Delete current flashcard |
| Esc | Close modal / drawer |
| Ctrl + Enter | Save card in editor |

---

##  Tech Stack

- **Framework**: React 18 (TypeScript)
- **Bundler**: Vite
- **Styling**: Tailwind CSS with custom CSS 3D transforms
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API (Synthesizers, Biquad Filters, Pink Noise Generators)
- **Effects**: canvas-confetti
- **Storage**: Browser `localStorage` (offline, instant)

---

##  Getting Started

### Prerequisites
- Node.js 18+ or Bun

### Installation
```bash
npm install
