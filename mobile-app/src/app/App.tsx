import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
import { io, Socket } from 'socket.io-client';

// ... (GameMessage interface and styles remain the same)

const App = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [command, setCommand] = useState('');

  useEffect(() => {
    const newSocket = io('http://10.0.2.2:3000');
    setSocket(newSocket);
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    // We don't need to listen for messages on the controller for now
    return () => { newSocket.disconnect(); };
  }, []);

  const sendCommand = () => {
    if (socket && command) {
      socket.emit('command', command);
      setCommand('');
    }
  };

  const sendMoveCommand = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (socket) {
      socket.emit('move', { direction });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <View style={styles.container}>
        <Text style={styles.title}>Player Controller</Text>
        <Text style={styles.status}>
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
        
        {/* Movement Controls */}
        <View style={styles.dpadContainer}>
          <View style={styles.dpadRow}>
            <View style={styles.dpadButton}><Button title="Up" onPress={() => sendMoveCommand('up')} /></View>
          </View>
          <View style={styles.dpadRow}>
            <View style={styles.dpadButton}><Button title="Left" onPress={() => sendMoveCommand('left')} /></View>
            <View style={styles.dpadButton}><Button title="Down" onPress={() => sendMoveCommand('down')} /></View>
            <View style={styles.dpadButton}><Button title="Right" onPress={() => sendMoveCommand('right')} /></View>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Text Command Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={command}
            onChangeText={setCommand}
            placeholder="Enter your action..."
          />
          <Button title="Send" onPress={sendCommand} disabled={!isConnected} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '600', textAlign: 'center' },
  status: { fontSize: 16, textAlign: 'center', marginVertical: 8, color: '#666' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, borderRadius: 4, padding: 8, marginRight: 8 },
  separator: { marginVertical: 16, height: 1, backgroundColor: '#eee' },
  dpadContainer: { marginTop: 20, alignItems: 'center' },
  dpadRow: { flexDirection: 'row', justifyContent: 'center' },
  dpadButton: { margin: 4, width: 70 },
});

export default App;
