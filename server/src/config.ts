/**
 * Configuration for the Grid Manager
 * 
 * USE_COOLDOWN:
 * - true: Players can update again after the cooldown period (bonus feature)
 * - false: Players can only submit once (core requirement)
 */

export const CONFIG = {
  USE_COOLDOWN: true,  // Set to false for one-time submission only
  COOLDOWN_TIME: 60000, // 1 minute in milliseconds
  GRID_SIZE: 10
};
