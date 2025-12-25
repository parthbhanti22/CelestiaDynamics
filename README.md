# Celestia Dynamics V2

**The High-Fidelity Physics Exploration & Education Platform.**

Celestia Dynamics is a cutting-edge, interactive 3D web application designed to bridge the gap between complex theoretical physics and intuitive visual understanding. Built with a "simulation-first" philosophy, it leverages WebGL and Generative AI to provide an immersive educational experience.

## 🚀 Core Features

- **Event Horizon Simulation**: Real-time visualization of Schwarzschild and Kerr geometry, accretion disks, and gravitational lensing.
- **Quantum Atomic Models**: Interactive Bohr models with energy state transitions (excitation/relaxation).
- **Cosmos Explorer**: A multi-scale traversal from the Cosmic Web down to local Solar Systems using procedural point clouds.
- **Thermal Dynamics**: 2D grid-based heat diffusion simulation using custom Laplacian algorithms.
- **Kinematics Engine**: High-accuracy projectile motion simulation with adjustable gravity and air resistance parameters.
- **Theory Hub**: A curated repository of mathematical derivations rendered in LaTeX, supplemented by **Google Gemini 3 Pro** for deep contextual explanations.

## 🛠 Tech Stack

- **Framework**: React 19 (Modern Hooks, Concurrent Rendering)
- **3D Engine**: Three.js & React Three Fiber (R3F)
- **AI**: Google Gemini API (gemini-3-pro-preview)
- **State Management**: Zustand (Atomic state updates)
- **Math Rendering**: KaTeX
- **Styling**: Tailwind CSS (Cosmic/Dark UI Palette)
- **Animation**: Lucide React & Framer-inspired transitions
- **Build Tool**: Vite

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/parthbhanti22/celestia-dynamics.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Ensure you have a valid Google AI Studio API Key.
   ```env
   API_KEY=your_gemini_api_key_here
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## ⚖️ License

Copyright © 2024 Parth Bhanti. All rights reserved.

This software is proprietary. Viewing the source code is permitted for educational purposes only. Redistribution, modification, or commercial use of this code, in part or in whole, is strictly prohibited without explicit written permission from the author.
