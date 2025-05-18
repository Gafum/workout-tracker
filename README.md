# Sport Counter

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![LocalStorage](https://img.shields.io/badge/LocalStorage-F8DD35?style=for-the-badge&logo=javascript&logoColor=black)

A modern, minimalist workout and body weight tracking application designed for simplicity and efficiency. Built with a focus on a clean, responsive user interface, it allows users to seamlessly track their fitness progress on both desktop and mobile devices. The entire application operates client-side, utilizing `localStorage` for data persistence, ensuring your data stays private and on your device.

### ⚠️ Disclaimer

This project was heavily scaffolded and partially written by an AI. As a result, the codebase may not follow standard architectural patterns, may include inefficient structures, and can be hard to maintain or scale.

The logic might not be fully optimized, and some parts of the code may appear unclear, redundant, or inconsistent.

Manual refactoring and review are highly recommended before using it in production or building upon it for serious use.

## ✨ Features

-  **Daily Weight Logging:** Track your body weight before and after workouts.
-  **Exercise Tracking:** Log exercises with details for sets, repetitions, and optional weight.
-  **Intelligent Suggestions:** Get suggestions for exercises based on your past entries.
-  **Calendar Navigation:** Easily review your workout history and progress on specific days.
-  **Autocomplete & Prefill:** Speeds up data entry by autocompleting and prefilling previously logged exercises.
-  **Fully Responsive UI:** Optimized for a seamless experience across desktop, tablet, and mobile devices.
-  **Client-Side Storage:** All data is stored locally in your browser using `localStorage`, ensuring privacy and offline access.

## 🛠️ Tech Stack

-  **Frontend:** React
-  **Build Tool:** Vite
-  **JavaScript Runtime & Package Manager:** Bun
-  **Styling:** Tailwind CSS v3
-  **Language:** TypeScript
-  **Data Persistence:** Browser `localStorage`

## 🚀 Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed on your system.

### Installation

1. Clone the repository
2. Install dependencies using Bun:
   ```bash
   bun install
   ```
3. Start the development server:
   ```bash
   bun run dev
   ```
   The application will typically be available at `http://localhost:5173` (or another port if 5173 is in use).
