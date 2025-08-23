import React from 'react';
import { GameEntity, MapData } from '@dungeon-maister/data-models';

interface MapViewerProps {
  mapData: MapData;
  entities: GameEntity[];
}

const TILE_SIZE = 40; // in pixels

const tileStyle: React.CSSProperties = {
  width: TILE_SIZE,
  height: TILE_SIZE,
  border: '1px solid #333',
  boxSizing: 'border-box',
};

const entityTokenStyle: React.CSSProperties = {
  width: TILE_SIZE * 0.7,
  height: TILE_SIZE * 0.7,
  borderRadius: '50%',
  position: 'absolute',
  boxSizing: 'border-box',
  border: '2px solid white',
  transition: 'top 0.3s linear, left 0.3s linear', // Smooth movement
};

export const MapViewer: React.FC<MapViewerProps> = ({ mapData, entities }) => {
  return (
    <div style={{ border: '1px solid #555', padding: '10px' }}>
      <div style={{ display: 'inline-block', backgroundColor: '#000', position: 'relative' }}>
        {/* Render Map Tiles */}
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
        {/* Render Entities on top of the map */}
        {entities.map((entity) => (
          <div
            key={entity.id}
            style={{
              ...entityTokenStyle,
              top: entity.y * TILE_SIZE + (TILE_SIZE * 0.15),
              left: entity.x * TILE_SIZE + (TILE_SIZE * 0.15),
              backgroundColor: entity.isPlayer ? 'blue' : 'red',
            }}
          />
        ))}
      </div>
    </div>
  );
};
