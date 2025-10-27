// Type definitions for the grid application

export interface GridCell {
  value: string;
  playerId: string | null;
  timestamp: number;
}

export interface CellUpdate {
  row: number;
  col: number;
  value: string;
  playerId: string;
  timestamp: number;
}

export interface PlayerData {
  id: string;
  canUpdate: boolean;
  cooldownUntil: number | null;
}
