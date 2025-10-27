# Multiplayer Grid Application

A real-time multiplayer web application where players can interact with a shared 10×10 grid by placing Unicode characters. Built with React, TypeScript, Node.js, Express, and Socket.IO.

## AI Tools Disclosure

**This project was developed with assistance from GitHub Copilot and Claude** The AI was used for:
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

1. **Open the Application** - Navigate to `http://localhost:5173` in your browser
2. **See Online Players** - The player count updates automatically when users connect/disconnect
3. **Click a Cell** - Click any empty cell in the 10×10 grid
4. **Enter Character** - A modal will appear - enter any single Unicode character (I have also tried adding Emojis tho it is a bit inconsistent)
5. **Submit** - Click submit to place your character
6. **Cooldown Period** - You'll have a 60-second cooldown before you can update again
7. **Real-time Updates** - Watch as other players update cells in real-time
8. **View History** - Click "Show History" to see all past updates
9. **Time Travel** - Click any history entry to view the grid at that point in time
10. **Back to Present** - Click "Back to Present" to return to the current state

## Key Features Explained

### Grid State Management
- Server maintains the authoritative grid state
- All updates are validated server-side
- Grid state is synchronized to all connected clients

### Player Restrictions
- Each player has a cooldown timer after submitting
- Cooldown is 60 seconds (configurable in `gridManager.ts`)
- Players can update again after cooldown expires
- Server enforces restrictions to prevent cheating

### Real-time Communication
- Socket.IO enables bidirectional real-time communication
- Events: `gridState`, `cellUpdated`, `playerCount`, `updateStatus`, `historyData`
- Automatic reconnection handling

### History & Time Travel
- Every update is recorded with timestamp
- Updates within 1 second are grouped together
- Click any history entry to view grid at that moment
- Server reconstructs historical grid states on-demand

## Architecture

### Backend (Server)
- **server.ts** - Express server with Socket.IO integration
- **gridManager.ts** - Core business logic for grid management
- **types.ts** - Shared TypeScript interfaces

### Frontend (Client)
- **App.tsx** - Main component with Socket.IO client
- **Grid.tsx** - Grid visualization and interaction
- **History.tsx** - Historical updates viewer


## 🔧 Configuration

### Server Port
Edit `server/src/server.ts`:
```typescript
const PORT = process.env.PORT || 3001;
```

### Cooldown Time
Edit `server/src/gridManager.ts`:
```typescript
private readonly COOLDOWN_TIME = 60000; // In milliseconds
```

### Grid Size
Edit `server/src/gridManager.ts`:
```typescript
private readonly GRID_SIZE = 10;
```

## Testing

1. Open multiple browser windows/tabs
2. Connect from different devices on the same network
3. Test real-time synchronization
4. Verify cooldown timer functionality
5. Test history and time-travel features

## Contributing

This is a take-home assignment project. While contributions are not expected, the code is open for review and learning.

## 📄 License

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

