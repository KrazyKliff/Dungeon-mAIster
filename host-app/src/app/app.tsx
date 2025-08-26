import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { NarrativeLog } from './narrative-log';
import { MapViewer } from './map-viewer';
import { GameState, GameMessage } from '@dungeon-maister/data-models';
import { AIDebugViewer } from './ai-debug-viewer';
import { CharacterCreationWizard } from './components/character-creation/CharacterCreationWizard';

export function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isDebuggerVisible, setIsDebuggerVisible] = useState(false);
  const [lastAIResponse, setLastAIResponse] = useState(null);

  useEffect(() => {
    // The backend now expects the client to initiate character creation.
    // We will not send a default gameState until creation is complete.
    const newSocket = io('http://localhost:3000'); // Explicitly connect
    setSocket(newSocket);
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('message', (message: GameMessage) => setMessages((prev) => [message, ...prev]));
    newSocket.on('gameState', (newGameState: GameState) => {
      console.log('Received new game state:', newGameState);
      setGameState(newGameState);
    });
    newSocket.on('ai_debug', (data) => setLastAIResponse(data));
    
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '`') { setIsDebuggerVisible(prev => !prev); }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      newSocket.disconnect();
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleSelectEntity = (entityId: string) => {
    const newSelectedId = gameState.selectedEntityId === entityId ? null : entityId;
    socket?.emit('selectEntity', { entityId: newSelectedId });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1a1a1a', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ flex: 1, padding: '24px', borderRight: '2px solid #555', overflowY: 'auto' }}>
        <h1>Journal & Dashboard</h1>
        <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
        <hr />
        <NarrativeLog messages={messages} />
      </div>
      <div style={{ flex: 2, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {gameState && gameState.map.length > 0 ? (
          <MapViewer
            mapData={gameState.map}
            entities={gameState.entities}
            props={gameState.props}
            selectedEntityId={gameState.selectedEntityId}
            onEntityClick={handleSelectEntity}
          />
        ) : (
          socket && <CharacterCreationWizard socket={socket} />
        )}
      </div>
      {isDebuggerVisible && <AIDebugViewer lastResponse={lastAIResponse} onClose={() => setIsDebuggerVisible(false)} />}
    </div>
  );
}
export default App;
