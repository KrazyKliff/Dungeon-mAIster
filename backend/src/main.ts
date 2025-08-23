import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createBaselineCharacter, performSkillCheck, generateMap, moveEntity } from '@dungeon-maister/rule-engine';
import { askAI } from '@dungeon-maister/llm-orchestrator';
import { GameState } from '@dungeon-maister/data-models';

const PORT = 3000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

let gameState: GameState;

function initializeGameState() {
  const playerCharacter = createBaselineCharacter('char-01', 'Boric the Brave');
  const initialMap = generateMap({ width: 20, height: 15, maxTunnels: 50, maxLength: 8 });
  let startPos = { x: 0, y: 0 };
  for (let y = 0; y < initialMap.length; y++) {
    const x = initialMap[y].indexOf(0);
    if (x > -1) {
      startPos = { x, y };
      break;
    }
  }

  gameState = {
    map: initialMap,
    entities: [
      { id: playerCharacter.id, name: playerCharacter.name, x: startPos.x, y: startPos.y, isPlayer: true },
    ],
    characters: {
      [playerCharacter.id]: playerCharacter,
    },
    selectedEntityId: null,
  };
}

initializeGameState();

io.on('connection', (socket) => {
  console.log(`[socket]: A user connected with id ${socket.id}`);
  socket.emit('gameState', gameState);

  socket.on('selectEntity', (data: { entityId: string | null }) => {
    gameState.selectedEntityId = data.entityId;
    console.log(`[socket]: Entity ${data.entityId} selected.`);
    io.emit('gameState', gameState);
  });

  socket.on('move', (data: { direction: 'up' | 'down' | 'left' | 'right' }) => {
    const playerEntity = gameState.entities[0];
    const newPosition = moveEntity(playerEntity, data.direction, gameState.map);
    playerEntity.x = newPosition.x;
    playerEntity.y = newPosition.y;
    io.emit('gameState', gameState);
  });
  
  // ( ... other listeners ... )

  socket.on('disconnect', () => {
    console.log(`[socket]: User ${socket.id} disconnected`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
