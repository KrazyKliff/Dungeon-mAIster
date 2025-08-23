import React from 'react';

// For now, our map data is a simple 2D array of numbers
// 0 = floor, 1 = wall
type MapData = number[][];

interface MapViewerProps {
  mapData: MapData;
}

const tileStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  border: '1px solid #333',
  boxSizing: 'border-box',
};

export const MapViewer: React.FC<MapViewerProps> = ({ mapData }) => {
  return (
    <div style={{ border: '1px solid #555', padding: '10px' }}>
      <div style={{ display: 'inline-block', backgroundColor: '#000' }}>
        {mapData.map((row, y) => (
          <div key={y} style={{ display: 'flex' }}>
            {row.map((tile, x) => (
              <div
                key={`${x}-${y}`}
                style={{
                  ...tileStyle,
                  backgroundColor: tile === 1 ? '#4a4a4a' : '#2a2a2a',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
