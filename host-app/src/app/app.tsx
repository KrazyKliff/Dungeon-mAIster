import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { NarrativeLog, GameMessage } from './narrative-log';
import { MapViewer } from './map-viewer';

// Define the MapData type to be used by both the app and the component
type MapData = number[][];

export function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [mapData, setMapData] = useState<MapData>([]);

  // Function to fetch a new map from the backend
  const fetchNewMap = useCallback(async () => {
    try {
      // We use the Vite proxy for the fetch call as well
      const response = await fetch('/map'); 
      const newMap = await response.json();
      setMapData(newMap);
    } catch (error) {
      console.error("Failed to fetch map:", error);
    }
  }, []);

  useEffect(() => {
    // Fetch the initial map when the component mounts
    fetchNewMap();

    const newSocket = io();
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    
    newSocket.on('message', (message: GameMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    
    return () => { newSocket.disconnect(); };
  }, [fetchNewMap]);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1a1a1a', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ flex: 1, padding: '24px', borderRight: '2px solid #555', overflowY: 'auto' }}>
        <h1>Journal & Dashboard</h1>
        <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
        <hr />
        <NarrativeLog messages={messages} />
      </div>
      <div style={{ flex: 2, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <MapViewer mapData={mapData} />
        <button onClick={fetchNewMap} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
          Generate New Map
        </button>
      </div>
    </div>
  );
}
export default App;
