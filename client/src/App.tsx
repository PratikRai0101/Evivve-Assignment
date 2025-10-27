import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Grid from './components/Grid';
import type { GridCell, PlayerStatus } from './types';
import './App.css';

const SOCKET_URL = 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>({
    canUpdate: true,
    cooldownUntil: null
  });
  const [error, setError] = useState<string>('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Listen for grid state
    newSocket.on('gridState', (gridData: GridCell[][]) => {
      setGrid(gridData);
    });

    // Listen for player count updates
    newSocket.on('playerCount', (count: number) => {
      setPlayerCount(count);
    });

    // Listen for update status
    newSocket.on('updateStatus', (status: PlayerStatus) => {
      setPlayerStatus(status);
    });

    // Listen for cell updates
    newSocket.on('cellUpdated', (data: {
      row: number;
      col: number;
      value: string;
      playerId: string;
      timestamp: number;
    }) => {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map(row => [...row]);
        newGrid[data.row][data.col] = {
          value: data.value,
          playerId: data.playerId,
          timestamp: data.timestamp
        };
        return newGrid;
      });
    });

    // Listen for errors
    newSocket.on('error', (message: string) => {
      setError(message);
      setTimeout(() => setError(''), 3000);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (!playerStatus.cooldownUntil) {
      setCooldownSeconds(0);
      return;
    }

    const updateCooldown = () => {
      const remaining = Math.max(0, Math.ceil((playerStatus.cooldownUntil! - Date.now()) / 1000));
      setCooldownSeconds(remaining);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);

    return () => clearInterval(interval);
  }, [playerStatus.cooldownUntil]);

  const handleCellClick = (row: number, col: number) => {
    if (socket && playerStatus.canUpdate) {
      const value = prompt('Enter a character:');
      if (value && value.length === 1) {
        socket.emit('updateCell', { row, col, value });
      }
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Multiplayer Grid</h1>
        <div className="info-bar">
          <div className="player-count">
            👥 Players Online: <strong>{playerCount}</strong>
          </div>
          <div className={`status ${playerStatus.canUpdate ? 'ready' : 'cooldown'}`}>
            {playerStatus.canUpdate ? (
              <span>✅ Ready to update</span>
            ) : (
              <span>⏱️ Cooldown: {cooldownSeconds}s</span>
            )}
          </div>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <main>
        {grid.length > 0 ? (
          <Grid 
            grid={grid} 
            onCellClick={handleCellClick}
            canUpdate={playerStatus.canUpdate}
          />
        ) : (
          <div className="loading">Loading grid...</div>
        )}
      </main>

      <footer>
        <p>Click any empty cell to place your character</p>
        <p className="note">You can update again after the 1-minute cooldown</p>
      </footer>
    </div>
  );
}

export default App;

