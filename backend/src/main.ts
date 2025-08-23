import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createBaselineCharacter, performSkillCheck, generateMap } from '@dungeon-maister/rule-engine';
import { askAI } from '@dungeon-maister/llm-orchestrator';

const PORT = 3000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

const playerCharacter = createBaselineCharacter('char-01', 'Boric the Brave');

app.use(express.json());

// NEW ENDPOINT for map generation
app.get('/map', (req, res) => {
  console.log('[server]: Received request for a new map.');
  const newMap = generateMap({
    width: 20,
    height: 15,
    maxTunnels: 50,
    maxLength: 8,
  });
  res.json(newMap);
});


io.on('connection', (socket) => {
  console.log(`[socket]: A user connected with id ${socket.id}`);
  socket.emit('message', { type: 'narrative', content: 'Welcome! You are connected to the Dungeon-mAIster server.' });

  socket.on('command', async (commandText: string) => {
    console.log(`[socket]: Received command from ${socket.id}: "${commandText}"`);
    io.emit('message', { type: 'action', content: commandText, author: 'Player' });
    let responseMessage;
    if (commandText.toLowerCase() === 'roll perception') {
      const success = performSkillCheck(playerCharacter, 'perception', 15);
      const content = `Player rolled perception and ${success ? 'succeeded' : 'failed'}!`;
      responseMessage = { type: 'narrative', content: content, author: 'Game Master' };
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

httpServer.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
