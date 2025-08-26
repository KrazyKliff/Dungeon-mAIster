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

export function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isDebuggerVisible, setIsDebuggerVisible] = useState(false);
  const [lastAIResponse, setLastAIResponse] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('message', (message: GameMessage) =>
      setMessages((prev) => [message, ...prev])
    );
    newSocket.on('gameState', (newGameState: GameState) => {
      console.log('Received new game state:', newGameState);
      setGameState(newGameState);
    });
    newSocket.on('ai_debug', (data) => setLastAIResponse(data));

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
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '16px' }}>
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
      </RightPanel>
      {isDebuggerVisible && (
        <AIDebugViewer
          lastResponse={lastAIResponse}
          onClose={() => setIsDebuggerVisible(false)}
        />
      )}
    </HostLayoutRoot>
  );
}
export default App;
