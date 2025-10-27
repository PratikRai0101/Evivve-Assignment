import { useState } from 'react';
import type { HistoryEntry } from '../types';
import './History.css';

interface HistoryProps {
  history: HistoryEntry[];
  onTimeTravel: (timestamp: number | null) => void;
  currentTimestamp: number | null;
}

const History = ({ history, onTimeTravel, currentTimestamp }: HistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleReset = () => {
    onTimeTravel(null);
  };

  return (
    <div className="history-container">
      <button 
        className="history-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        📜 {isExpanded ? 'Hide' : 'Show'} History ({history.length} entries)
      </button>

      {isExpanded && (
        <div className="history-panel">
          <div className="history-header">
            <h3>Update History</h3>
            {currentTimestamp && (
              <button className="reset-button" onClick={handleReset}>
                ↻ Back to Present
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="no-history">No updates yet. Be the first to make a change!</p>
          ) : (
            <div className="history-list">
              {[...history].reverse().map((entry) => (
                <div
                  key={entry.timestamp}
                  className={`history-entry ${
                    currentTimestamp === entry.timestamp ? 'active' : ''
                  }`}
                  onClick={() => onTimeTravel(entry.timestamp)}
                >
                  <div className="entry-time">
                    {formatTime(entry.timestamp)}
                    <span className="entry-date">{formatDate(entry.timestamp)}</span>
                  </div>
                  <div className="entry-updates">
                    {entry.updates.length} update{entry.updates.length !== 1 ? 's' : ''}
                    {entry.updates.length > 1 && ' (grouped)'}
                  </div>
                  <div className="entry-details">
                    {entry.updates.map((update, i) => (
                      <span key={i} className="update-detail">
                        [{update.row}, {update.col}] → "{update.value}"
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
