import React from 'react';
import { GameEntity, MapData, MapProp } from '@dungeon-maister/data-models';

interface MapViewerProps {
  mapData: MapData;
  entities: GameEntity[];
  props: MapProp[]; // <-- THIS IS THE FIX
  selectedEntityId: string | null;
  onEntityClick: (entityId: string) => void;
}

const TILE_SIZE = 40;

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
  transition: 'top 0.3s linear, left 0.3s linear',
};

export const MapViewer: React.FC<MapViewerProps> = ({ mapData, entities, props, selectedEntityId, onEntityClick }) => {
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
        {/* Render Props */}
        {props.map((prop, index) => (
          <div key={`prop-${index}`} style={{
            position: 'absolute',
            top: prop.y * TILE_SIZE,
            left: prop.x * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
            textAlign: 'center',
            fontSize: '24px',
          }}>
            ??
          </div>
        ))}
        {/* Render Entities */}
        {entities.map((entity) => (
          <div
            key={entity.id}
            onClick={() => onEntityClick(entity.id)}
            style={{
              ...entityTokenStyle,
              top: entity.y * TILE_SIZE + (TILE_SIZE * 0.15),
              left: entity.x * TILE_SIZE + (TILE_SIZE * 0.15),
              backgroundColor: entity.isPlayer ? 'blue' : 'red',
              border: entity.id === selectedEntityId ? '3px solid yellow' : '2px solid white',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
};
