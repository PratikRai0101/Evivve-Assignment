import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import GridManager from './gridManager';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

//Grid manager ko init kiya
const gridManager = new GridManager();

// Socket IO ka init
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Server is running'
  });
});

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  gridManager.addPlayer(socket.id);

  socket.emit('gridState', gridManager.getGrid());

  io.emit('playerCount', gridManager.getPlayerCount());

  const playerStatus = gridManager.canPlayerUpdate(socket.id);
  socket.emit('updateStatus', playerStatus);

  socket.on('updateCell', (data: { row: number; col: number; value: string }) => {
    const { row, col, value } = data;
    const result = gridManager.updateCell(row, col, value, socket.id);

    if (result.success && result.timestamp) {
      io.emit('cellUpdated', {
        row,
        col,
        value,
        playerId: socket.id,
        timestamp: result.timestamp
      });

      const playerStatus = gridManager.canPlayerUpdate(socket.id);
      socket.emit('updateStatus', playerStatus);
    } else {
      socket.emit('error', result.error || 'Failed to update cell');
    }
  });

  socket.on('requestGrid', () => {
    socket.emit('gridState', gridManager.getGrid());
  });

  // Handle history requests
  socket.on('requestHistory', () => {
    socket.emit('historyData', gridManager.getHistory());
  });

  // Handle time-travel requests
  socket.on('requestGridAtTime', (timestamp: number) => {
    const historicalGrid = gridManager.getGridAtTimestamp(timestamp);
    socket.emit('gridState', historicalGrid);
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    gridManager.removePlayer(socket.id);
    io.emit('playerCount', gridManager.getPlayerCount());
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
