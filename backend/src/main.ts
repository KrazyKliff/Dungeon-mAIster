import { createServer } from 'http';
import { Server } from 'socket.io';
import { createBaselineCharacter, performSkillCheck, getMapParametersFromAI, generateMap, moveEntity } from '@dungeon-maister/rule-engine';
import { askAI } from '@dungeon-maister/llm-orchestrator';
import { GameState } from '@dungeon-maister/data-models';

const PORT = 3000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

let gameState: GameState;

async function initializeGameState() {
  console.log('[Server]: Initializing new game state...');
  const playerCharacter = createBaselineCharacter('char-01', 'Boric the Brave');
  
  const mapParams = await getMapParametersFromAI('a forgotten goblin outpost');
  const { map, props } = generateMap(20, 15, mapParams);
  
  let startPos = { x: 0, y: 0 };
  for (let y = 0; y < map.length; y++) { const x = map[y].indexOf(0); if (x > -1) { startPos = { x, y }; break; } }

  gameState = {
    map,
    props,
    entities: [
      { id: playerCharacter.id, name: playerCharacter.name, x: startPos.x, y: startPos.y, isPlayer: true },
    ],
    characters: { [playerCharacter.id]: playerCharacter },
    selectedEntityId: null,
  };
  console.log('[Server]: Game state initialized.');
}

io.on('connection', (socket) => {
  console.log(`[socket]: A user connected with id ${socket.id}`);
  socket.emit('gameState', gameState);
  socket.emit('message', { type: 'narrative', content: 'Welcome! You are connected.' });

  socket.on('selectEntity', (data: { entityId: string | null }) => {
    gameState.selectedEntityId = data.entityId;
    io.emit('gameState', gameState);
  });

  socket.on('move', (data: { direction: 'up' | 'down' | 'left' | 'right' }) => {
    const playerEntity = gameState.entities.find(e => e.isPlayer);
    if (playerEntity) {
        const newPosition = moveEntity(playerEntity, data.direction, gameState.map);
        playerEntity.x = newPosition.x;
        playerEntity.y = newPosition.y;
        io.emit('gameState', gameState);
        io.emit('message', { type: 'action', content: `Player moved ${data.direction}.`, author: 'SYSTEM' });
    }
  });
  
  socket.on('command', async (commandText: string) => {
    io.emit('message', { type: 'action', content: commandText, author: 'Player' });
    let responseMessage;
    const player = gameState.characters['char-01'];
    if (commandText.toLowerCase() === 'roll perception') {
      const success = performSkillCheck(player, 'perception', 15);
      responseMessage = { type: 'narrative', content: `Player rolled perception and ${success ? 'succeeded' : 'failed'}!`, author: 'Game Master' };
    } else {
      const aiContent = await askAI(commandText);
      responseMessage = { type: 'narrative', content: aiContent, author: 'Game Master' };
    }
    io.emit('message', responseMessage);
  });

  socket.on('disconnect', () => {
    console.log(`[socket]: User ${socket.id} disconnected`);
  });
});

initializeGameState().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
});
