import { GridCell, PlayerData, HistoryEntry, CellUpdate } from './types';
import { CONFIG } from './config';

class GridManager {
  private grid: GridCell[][];
  private players: Map<string, PlayerData>;
  private history: HistoryEntry[];
  private readonly GRID_SIZE = CONFIG.GRID_SIZE;
  private readonly COOLDOWN_TIME = CONFIG.COOLDOWN_TIME;
  private readonly USE_COOLDOWN = CONFIG.USE_COOLDOWN;

  constructor() {
    this.grid = this.initializeGrid();
    this.players = new Map();
    this.history = [];
  }

  private initializeGrid(): GridCell[][] {
    const grid: GridCell[][] = [];
    for (let i = 0; i < this.GRID_SIZE; i++) {
      grid[i] = [];
      for (let j = 0; j < this.GRID_SIZE; j++) {
        grid[i][j] = {
          value: '',
          playerId: null,
          timestamp: 0
        };
      }
    }
    return grid;
  }

  addPlayer(playerId: string): void {
    if (!this.players.has(playerId)) {
      this.players.set(playerId, {
        id: playerId,
        canUpdate: true,
        cooldownUntil: null
      });
    }
  }

  removePlayer(playerId: string): void {
    this.players.delete(playerId);
  }

  getPlayerCount(): number {
    return this.players.size;
  }

  canPlayerUpdate(playerId: string): { canUpdate: boolean; cooldownUntil: number | null } {
    const player = this.players.get(playerId);
    if (!player) {
      return { canUpdate: false, cooldownUntil: null };
    }

    // If cooldown is enabled, check if it has expired
    if (this.USE_COOLDOWN && player.cooldownUntil && Date.now() >= player.cooldownUntil) {
      player.canUpdate = true;
      player.cooldownUntil = null;
    }

    return {
      canUpdate: player.canUpdate,
      cooldownUntil: player.cooldownUntil
    };
  }

  updateCell(row: number, col: number, value: string, playerId: string): 
    { success: boolean; error?: string; timestamp?: number } {
    
    if (row < 0 || row >= this.GRID_SIZE || col < 0 || col >= this.GRID_SIZE) {
      return { success: false, error: 'Invalid cell coordinates' };
    }

    if (!value || value.length !== 1) {
      return { success: false, error: 'Value must be a single character' };
    }

    const playerStatus = this.canPlayerUpdate(playerId);
    if (!playerStatus.canUpdate) {
      if (this.USE_COOLDOWN && playerStatus.cooldownUntil) {
        const remainingTime = Math.ceil((playerStatus.cooldownUntil - Date.now()) / 1000);
        return { 
          success: false, 
          error: `You must wait ${remainingTime} seconds before updating again` 
        };
      } else {
        return { 
          success: false, 
          error: 'You have already submitted. Each player can only update once.' 
        };
      }
    }

    // Prevent a player from editing the same cell they previously filled.
    const currentCell = this.grid[row][col];
    if (currentCell.playerId && currentCell.playerId === playerId) {
      return { success: false, error: 'You cannot modify a cell you previously filled.' };
    }

    const timestamp = Date.now();

    this.grid[row][col] = {
      value,
      playerId,
      timestamp
    };

    const lastEntry = this.history[this.history.length - 1];
    const cellUpdate: CellUpdate = { row, col, value, playerId, timestamp };
    
    if (lastEntry && timestamp - lastEntry.timestamp < 1000) {
      lastEntry.updates.push(cellUpdate);
    } else {
      this.history.push({
        timestamp,
        updates: [cellUpdate]
      });
    }

    const player = this.players.get(playerId);
    if (player) {
      player.canUpdate = false;
      // Only set cooldown if USE_COOLDOWN is enabled
      if (this.USE_COOLDOWN) {
        player.cooldownUntil = timestamp + this.COOLDOWN_TIME;
      } else {
        player.cooldownUntil = null;
      }
    }

    return { success: true, timestamp };
  }

  getGrid(): GridCell[][] {
    return this.grid;
  }

  getHistory(): HistoryEntry[] {
    return this.history;
  }

  getGridAtTimestamp(timestamp: number): GridCell[][] {
    const historicalGrid = this.initializeGrid();

    for (const entry of this.history) {
      if (entry.timestamp > timestamp) {
        break;
      }
      for (const update of entry.updates) {
        historicalGrid[update.row][update.col] = {
          value: update.value,
          playerId: update.playerId,
          timestamp: update.timestamp
        };
      }
    }

    return historicalGrid;
  }
}

export default GridManager;
