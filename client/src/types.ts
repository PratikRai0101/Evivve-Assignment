// Type definitions for the client

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

export interface PlayerStatus {
  canUpdate: boolean;
  cooldownUntil: number | null;
}
