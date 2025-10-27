import { GridCell, PlayerData, HistoryEntry, CellUpdate } from './types';

/**
 * Manages the grid state and player interactions
 */
class GridManager {
  private grid: GridCell[][];
  private players: Map<string, PlayerData>;
  private history: HistoryEntry[];
  private readonly GRID_SIZE = 10;
  private readonly COOLDOWN_TIME = 60000; // 1 minute in milliseconds

  constructor() {
    this.grid = this.initializeGrid();
    this.players = new Map();
    this.history = [];
  }

  /**
   * Initialize an empty 10x10 grid
   */
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

  /**
   * Add a new player to the game
   */
  addPlayer(playerId: string): void {
    if (!this.players.has(playerId)) {
      this.players.set(playerId, {
        id: playerId,
        canUpdate: true,
        cooldownUntil: null
      });
    }
  }

  /**
   * Remove a player from the game
   */
  removePlayer(playerId: string): void {
    this.players.delete(playerId);
  }

  /**
   * Get the current number of connected players
   */
  getPlayerCount(): number {
    return this.players.size;
  }

  /**
   * Check if a player can update and return their status
   */
  canPlayerUpdate(playerId: string): { canUpdate: boolean; cooldownUntil: number | null } {
    const player = this.players.get(playerId);
    if (!player) {
      return { canUpdate: false, cooldownUntil: null };
    }

    // Check if cooldown has expired
    if (player.cooldownUntil && Date.now() >= player.cooldownUntil) {
      player.canUpdate = true;
      player.cooldownUntil = null;
    }

    return {
      canUpdate: player.canUpdate,
      cooldownUntil: player.cooldownUntil
    };
  }

  /**
   * Update a cell in the grid
   */
  updateCell(row: number, col: number, value: string, playerId: string): 
    { success: boolean; error?: string; timestamp?: number } {
    
    // Validate coordinates
    if (row < 0 || row >= this.GRID_SIZE || col < 0 || col >= this.GRID_SIZE) {
      return { success: false, error: 'Invalid cell coordinates' };
    }

    // Validate value (must be a single character)
    if (!value || value.length !== 1) {
      return { success: false, error: 'Value must be a single character' };
    }

    // Check if player can update
    const playerStatus = this.canPlayerUpdate(playerId);
    if (!playerStatus.canUpdate) {
      const remainingTime = playerStatus.cooldownUntil 
        ? Math.ceil((playerStatus.cooldownUntil - Date.now()) / 1000)
        : 0;
      return { 
        success: false, 
        error: `You must wait ${remainingTime} seconds before updating again` 
      };
    }

    const timestamp = Date.now();

    // Update the cell
    this.grid[row][col] = {
      value,
      playerId,
      timestamp
    };

    // Add to history - group updates within 1 second
    const lastEntry = this.history[this.history.length - 1];
    const cellUpdate: CellUpdate = { row, col, value, playerId, timestamp };
    
    if (lastEntry && timestamp - lastEntry.timestamp < 1000) {
      // Add to existing entry (same second)
      lastEntry.updates.push(cellUpdate);
    } else {
      // Create new history entry
      this.history.push({
        timestamp,
        updates: [cellUpdate]
      });
    }

    // Update player status - apply cooldown
    const player = this.players.get(playerId);
    if (player) {
      player.canUpdate = false;
      player.cooldownUntil = timestamp + this.COOLDOWN_TIME;
    }

    return { success: true, timestamp };
  }

  /**
   * Get the current state of the grid
   */
  getGrid(): GridCell[][] {
    return this.grid;
  }

  /**
   * Get the complete history of all updates
   */
  getHistory(): HistoryEntry[] {
    return this.history;
  }

  /**
   * Get the grid state at a specific point in time
   */
  getGridAtTimestamp(timestamp: number): GridCell[][] {
    const historicalGrid = this.initializeGrid();

    // Apply all updates up to the specified timestamp
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
