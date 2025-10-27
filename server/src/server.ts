import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import GridManager from './gridManager';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// Initialize Grid Manager
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Server is running'
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Add player to grid manager
  gridManager.addPlayer(socket.id);

  // Send current grid state to the new player
  socket.emit('gridState', gridManager.getGrid());

  // Send player count to all clients
  io.emit('playerCount', gridManager.getPlayerCount());

  // Send player's update status
  const playerStatus = gridManager.canPlayerUpdate(socket.id);
  socket.emit('updateStatus', playerStatus);

  // Handle cell update requests
  socket.on('updateCell', (data: { row: number; col: number; value: string }) => {
    const { row, col, value } = data;
    const result = gridManager.updateCell(row, col, value, socket.id);

    if (result.success && result.timestamp) {
      // Broadcast the update to all clients
      io.emit('cellUpdated', {
        row,
        col,
        value,
        playerId: socket.id,
        timestamp: result.timestamp
      });

      // Send updated status to the player
      const playerStatus = gridManager.canPlayerUpdate(socket.id);
      socket.emit('updateStatus', playerStatus);
    } else {
      // Send error to the requesting client
      socket.emit('error', result.error || 'Failed to update cell');
    }
  });

  // Handle grid state requests
  socket.on('requestGrid', () => {
    socket.emit('gridState', gridManager.getGrid());
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    gridManager.removePlayer(socket.id);
    io.emit('playerCount', gridManager.getPlayerCount());
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
