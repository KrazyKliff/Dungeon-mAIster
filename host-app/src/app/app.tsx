import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { GameState } from '@dungeon-maister/data-models';

export function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const newSocket = io();
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    
    newSocket.on('gameState', (newGameState: GameState) => {
      setGameState(newGameState);
    });
    
    return () => { newSocket.disconnect(); };
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', padding: '24px', color: 'white', backgroundColor: '#1a1a1a', height: '100vh' }}>
      <h1>Dungeon-mAIster Host (Debug View)</h1>
      <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <hr />
      <h2>Raw Game State:</h2>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {gameState ? JSON.stringify(gameState, null, 2) : 'Waiting for game state...'}
      </pre>
    </div>
  );
}
export default App;
