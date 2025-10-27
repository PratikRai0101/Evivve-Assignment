# Multiplayer Grid Application

A real-time multiplayer web application where players can update cells in a shared 10x10 grid with Unicode characters.

## 🤖 AI Tools Disclosure

**This project was developed with assistance from GitHub Copilot AI.** The AI was used for:
- Code suggestions and completions
- Boilerplate generation
- Problem-solving assistance
- Documentation writing

The overall architecture, logic, and implementation decisions were made by the developer with AI as a coding assistant.

## 📋 Features

### Core Requirements
- ✅ 10x10 interactive grid
- ✅ Real-time updates across all connected players
- ✅ One-time character submission per player
- ✅ Live player count display
- ✅ Shared grid state across all users

### Extra Features
- ⏱️ 1-minute cooldown after submission (then player can update again)
- 📜 Historical updates viewer (time-travel feature)
- 🔄 Grouped updates within the same second

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Real-time**: Socket.IO
- **Styling**: CSS

## 📦 Project Structure

```
multiplayer-grid/
├── server/          # Backend server
│   ├── src/
│   │   ├── server.ts
│   │   ├── gridManager.ts
│   │   └── types.ts
│   ├── package.json
│   └── tsconfig.json
└── client/          # Frontend React app
    ├── src/
    ├── package.json
    └── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Running

#### Backend Server
```bash
cd server
npm install
npm run dev
```
Server runs on `http://localhost:3001`

#### Frontend Client
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`

## 📝 How to Use

1. Open the application in your browser
2. You'll see a 10x10 grid with the number of online players
3. Click any empty cell to enter a Unicode character
4. After submitting, you'll have a 1-minute cooldown before you can update again
5. All updates are visible to all connected players in real-time
6. Use the history timeline to view past states of the grid

## 👨‍💻 Development Process

This project was built incrementally with proper Git commits showing the development progression.

## 📄 License

MIT
