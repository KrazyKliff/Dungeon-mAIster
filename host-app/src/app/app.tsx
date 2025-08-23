import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { NarrativeLog } from './narrative-log';
import { MapViewer } from './map-viewer';
import { GameEntity, MapData, GameMessage } from '@dungeon-maister/data-models';

interface GameState {
  map: MapData;
  entities: GameEntity[];
}

export function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [gameState, setGameState] = useState<GameState>({ map: [], entities: [] });

  useEffect(() => {
    const newSocket = io();
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    
    newSocket.on('message', (message: GameMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('gameState', (newGameState: GameState) => {
      setGameState(newGameState);
    });
    
    return () => { newSocket.disconnect(); };
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1a1a1a', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ flex: 1, padding: '24px', borderRight: '2px solid #555', overflowY: 'auto' }}>
        <h1>Journal & Dashboard</h1>
        <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
        <hr />
        <NarrativeLog messages={messages} />
      </div>
      <div style={{ flex: 2, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {gameState.map.length > 0 ? (
          <MapViewer mapData={gameState.map} entities={gameState.entities} />
        ) : (
          <p>Waiting for map data from server...</p>
        )}
      </div>
    </div>
  );
}
export default App;
