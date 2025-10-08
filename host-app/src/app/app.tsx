import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { NarrativeLog } from './narrative-log';
import { MapViewer } from './map-viewer';
import { GameState, GameMessage } from '@dungeon-maister/data-models';
import { AIDebugViewer } from './ai-debug-viewer';
import { CharacterCreationWizard } from './components/character-creation/CharacterCreationWizard';
import {
  GmScreenContainer,
  HostLayoutRoot,
  LeftPanel,
  RightPanel,
  TechnicalLogContainer,
} from './layout/HostLayout';
import { TechnicalLog } from './components/TechnicalLog';
import { MenuBar } from './components/MenuBar';
import { InfoBar } from './components/InfoBar';

const ErrorBanner = ({ message, onClose }) => (
  <div style={{
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#D32F2F',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '80%',
  }}>
    <span>{message}</span>
    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', marginLeft: '16px', cursor: 'pointer', fontSize: '16px' }}>
      &times;
    </button>
  </div>
);

export function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isDebuggerVisible, setIsDebuggerVisible] = useState(false);
  const [lastAIResponse, setLastAIResponse] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);
    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });
    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('message', (message: GameMessage) =>
      setMessages((prev) => [message, ...prev])
    );
    newSocket.on('gameState', (newGameState: GameState) => {
      console.log('Received new game state:', newGameState);
      setGameState(newGameState);
    });
    newSocket.on('ai_debug', (data) => setLastAIResponse(data));

    newSocket.on('error', (errorData: { message: string }) => {
      console.error('Server Error:', errorData);
      setError(errorData.message || 'An unknown error occurred.');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection Error:', err);
      setError(`Connection failed: ${err.message}`);
    });

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '`') {
        setIsDebuggerVisible((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      newSocket.disconnect();
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleSelectEntity = (entityId: string) => {
    if (!gameState) return;
    const newSelectedId =
      gameState.selectedEntityId === entityId ? null : entityId;
    socket?.emit('selectEntity', { entityId: newSelectedId });
  };

  const handleStartCombat = () => {
    socket?.emit('startCombat');
  };

  const handleNextTurn = () => {
    socket?.emit('nextTurn');
  };

  return (
    <HostLayoutRoot>
      <LeftPanel>
        <GmScreenContainer>
          <NarrativeLog messages={messages} />
        </GmScreenContainer>
        <TechnicalLogContainer>
          <TechnicalLog />
        </TechnicalLogContainer>
      </LeftPanel>
      <RightPanel>
        <div style={{ flexShrink: 0 }}>
          <MenuBar />
          <InfoBar />
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '16px',
            flexDirection: 'column',
          }}
        >
          {gameState && gameState.map.length > 0 ? (
            <>
              <MapViewer
                mapData={gameState.map}
                entities={gameState.entities}
                props={gameState.props}
                selectedEntityId={gameState.selectedEntityId}
                onEntityClick={handleSelectEntity}
              />
              {gameState.combat?.isActive ? (
                <div>
                  <h3>Turn Order</h3>
                  <ol>
                    {gameState.combat.order.map((entityId, index) => (
                      <li
                        key={entityId}
                        style={{
                          fontWeight:
                            gameState.combat && index === gameState.combat.turn
                              ? 'bold'
                              : 'normal',
                        }}
                      >
                        {gameState.characters[entityId]?.name || entityId}
                      </li>
                    ))}
                  </ol>
                  <button onClick={handleNextTurn}>Next Turn</button>
                </div>
              ) : (
                <button onClick={handleStartCombat}>Start Combat</button>
              )}
            </>
          ) : (
            socket && <CharacterCreationWizard socket={socket} />
          )}
        </div>
      </RightPanel>
      {isDebuggerVisible && (
        <AIDebugViewer
          lastResponse={lastAIResponse}
          onClose={() => setIsDebuggerVisible(false)}
        />
      )}
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
    </HostLayoutRoot>
  );
}
export default App;
