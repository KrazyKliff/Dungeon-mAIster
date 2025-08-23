import React from 'react';
import { GameEntity, MapData } from '@dungeon-maister/data-models';

interface MapViewerProps {
  mapData: MapData;
  entities: GameEntity[];
  selectedEntityId: string | null;
  onEntityClick: (entityId: string) => void;
}

const TILE_SIZE = 40;
// ... (tileStyle and entityTokenStyle remain the same) ...

export const MapViewer: React.FC<MapViewerProps> = ({ mapData, entities, selectedEntityId, onEntityClick }) => {
  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      {/* ... (map rendering code) ... */}
      {entities.map((entity) => (
        <div
          key={entity.id}
          onClick={() => onEntityClick(entity.id)}
          style={{
            /* ... (entityTokenStyle) ... */
            border: entity.id === selectedEntityId ? '3px solid yellow' : '2px solid white', // Highlight if selected
            cursor: 'pointer',
          }}
        />
      ))}
    </div>
  );
};
