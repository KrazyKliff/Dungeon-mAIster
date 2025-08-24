import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { NarrativeLog } from './narrative-log';
import { GameMessage } from '@dungeon-maister/data-models';

export function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<GameMessage[]>([]);

  useEffect(() => {
    const newSocket = io();
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    
    // Listen for incoming message objects
    newSocket.on('message', (message: GameMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    
    return () => { newSocket.disconnect(); };
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '24px', color: 'white', backgroundColor: '#1a1a1a', height: '100vh', overflowY: 'auto' }}>
      <h1>Dungeon-mAIster Host</h1>
      <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <hr />
      <NarrativeLog messages={messages} />
    </div>
  );
}
export default App;
