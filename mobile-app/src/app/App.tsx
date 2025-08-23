import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, ScrollView, TextInput, Button, ActivityIndicator } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { GameState, GameMessage, Character } from '@dungeon-maister/data-models';
import { CharacterSheet } from './character-sheet';

const App = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const myCharacterId = 'char-01';

  useEffect(() => {
    const newSocket = io('http://10.0.2.2:3000');
    setSocket(newSocket);
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('gameState', (newGameState: GameState) => {
      setGameState(newGameState);
    });
    return () => { newSocket.disconnect(); };
  }, []);

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
  const selectedEntity = gameState.entities.find(e => e.id === gameState.selectedEntityId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Player Controller</Text>
          <Text style={styles.status}>
            Status: {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
          
          {selectedEntity && (
            <Text style={styles.selectedText}>Selected: {selectedEntity.name}</Text>
          )}

          <CharacterSheet character={myCharacter} />
          
          <View style={styles.dpadContainer}>
            <View style={styles.dpadRow}><Button title="Up" onPress={() => sendMoveCommand('up')} /></View>
            <View style={styles.dpadRow}>
              <View style={styles.dpadButton}><Button title="Left" onPress={() => sendMoveCommand('left')} /></View>
              <View style={styles.dpadButton}><Button title="Down" onPress={() => sendMoveCommand('down')} /></View>
              <View style={styles.dpadButton}><Button title="Right" onPress={() => sendMoveCommand('right')} /></View>
            </View>
          </View>
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
  selectedText: { textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: 'blue', marginBottom: 10 },
  dpadContainer: { marginTop: 20, alignItems: 'center' },
  dpadRow: { flexDirection: 'row', justifyContent: 'center' },
  dpadButton: { margin: 4, width: 70 },
});

export default App;
