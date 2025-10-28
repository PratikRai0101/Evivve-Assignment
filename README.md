# Multiplayer Grid Application

A real-time multiplayer web application where players can interact with a shared 10×10 grid by placing Unicode characters. Built with React, TypeScript, Node.js, Express, and Socket.IO.

## AI Tools Disclosure

**This project was developed with assistance from GitHub Copilot and Claude** 
The AI was used for:
- Brain-Storming
- Documentation writing
- Error Solving

The overall architecture, logic, and implementation decisions were made by me along with some help from Github Copilot.

## Features

### Core Requirements 
- **10×10 Interactive Grid** - Players can click on any cell to place a character
- **Real-time Synchronization** - All updates are instantly visible to all connected players
- **Player Restrictions** - Once a player submits, they have a cooldown period
- **Live Player Count** - See how many players are currently online
- **Shared State** - Single grid state shared across all players

### Bonus Features 
- **1-Minute Cooldown** - After placing a character, players wait 60 seconds before updating again
- **Time-Travel History** - View the grid at any point in time from the past
- **Grouped Updates** - Multiple updates within the same second are grouped together
- **Modal Interface** - Clean modal for character input
- **Visual Feedback** - Clear status indicators for player state

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Socket.IO Client
- CSS3

**Backend:**
- Node.js
- Express.js
- TypeScript
- Socket.IO Server

## Project Structure

```
Evvive-Assignment/
├── server/                 # Backend server
│   ├── src/
│   │   ├── server.ts      # Main server with Socket.IO
│   │   ├── gridManager.ts # Grid state management
│   │   └── types.ts       # TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
│
└── client/                 # Frontend application
    ├── src/
    │   ├── components/
    │   │   ├── Grid.tsx        # Grid component with modal
    │   │   ├── Grid.css
    │   │   ├── History.tsx     # Time-travel history
    │   │   └── History.css
    │   ├── App.tsx             # Main app component
    │   ├── App.css
    │   ├── types.ts            # TypeScript interfaces
    │   └── main.tsx
    ├── package.json
    └── tsconfig.json
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- A modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/PratikRai0101/Evivve-Assignment.git
cd Evivve-Assignment
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../client
npm install
```

### Running the Application

You need to run both the backend and frontend servers:

#### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```
Server will start on `http://localhost:3001`

#### Terminal 2 - Frontend Client
```bash
cd client
npm run dev
```
Client will start on `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173`

## How to Use

1. Open the application in your browser
2. You'll see a 10x10 grid with the number of online players
3. Click any empty cell to enter a Unicode character
4. After submitting, you'll have a 1-minute cooldown before you can update again
   - Note: Once a cell is filled by any player, it cannot be modified by anyone. You can only fill empty cells after your cooldown expires.
5. All updates are visible to all connected players in real-time
6. Use the history timeline to view past states of the grid## Development Process

This project was built incrementally with proper Git commits showing the development progression.

## License

MIT License - Feel free to use this code for learning purposes.

## Developer

**Pratik Rai**
- GitHub: [@PratikRai0101](https://github.com/PratikRai0101)

## Acknowledgments

- Evivve for the interview opportunity
- GitHub Copilot & Claude AI for development assistance
- Socket.IO community for excellent real-time communication library

---

**Built with ❤️ for Evivve Interview Assignment**

