import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, ScrollView, TextInput, Button, ActivityIndicator } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { GameState, GameMessage} from '@dungeon-maister/data-models';
import { CharacterSheet } from './character-sheet';

const App = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [command, setCommand] = useState('');
  const myCharacterId = 'char-01';

  useEffect(() => {
    const newSocket = io('http://10.0.2.2:3000');
    setSocket(newSocket);
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('gameState', (newGameState: GameState) => {
      setGameState(newGameState);
    });
    newSocket.on('message', (message: GameMessage) => {
      setMessages((prevMessages) => [message, ...prevMessages]);
    });
    return () => { newSocket.disconnect(); };
  }, []);

  const sendCommand = () => {
    if (socket && command) { socket.emit('command', command); setCommand(''); }
  };
  const sendMoveCommand = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (socket) { socket.emit('move', { direction }); }
  };
  
  if (!gameState) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        <Text>Connecting to server...</Text>
      </View>
    );
  }

  const myCharacter = gameState.characters[myCharacterId];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Player Controller</Text>
          <Text style={styles.status}>
            Status: {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
          <CharacterSheet character={myCharacter} />
          <View style={styles.dpadContainer}>
            <View style={styles.dpadRow}><Button title="Up" onPress={() => sendMoveCommand('up')} /></View>
            <View style={styles.dpadRow}>
              <View style={styles.dpadButton}><Button title="Left" onPress={() => sendMoveCommand('left')} /></View>
              <View style={styles.dpadButton}><Button title="Down" onPress={() => sendMoveCommand('down')} /></View>
              <View style={styles.dpadButton}><Button title="Right" onPress={() => sendMoveCommand('right')} /></View>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={command}
              onChangeText={setCommand}
              placeholder="Enter your action..."
            />
            <Button title="Send" onPress={sendCommand} disabled={!isConnected} />
          </View>
          <View style={styles.separator} />
          <ScrollView style={styles.logContainer}>
            {messages.map((msg, index) => (
              <Text key={index} style={styles.message}>
                <Text style={{fontWeight: 'bold'}}>{msg.author || 'GM'}: </Text>{msg.content}
              </Text>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f0f0' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '600', textAlign: 'center' },
  status: { fontSize: 16, textAlign: 'center', marginVertical: 8, color: '#666' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  input: { flex: 1, backgroundColor: 'white', borderColor: '#ccc', borderWidth: 1, borderRadius: 4, padding: 8, marginRight: 8 },
  separator: { marginVertical: 16, height: 1, backgroundColor: '#ddd' },
  dpadContainer: { marginTop: 20, alignItems: 'center' },
  dpadRow: { flexDirection: 'row', justifyContent: 'center' },
  dpadButton: { margin: 4, width: 70 },
  logContainer: { flex: 1, height: 150, backgroundColor: 'white', borderRadius: 4, padding: 8, borderWidth: 1, borderColor: '#ddd' },
  message: { marginTop: 4, fontSize: 14, }
});

export default App;

