import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
import { io, Socket } from 'socket.io-client';

// Define the structure of a message object to match the backend
interface GameMessage {
  type: 'narrative' | 'dialogue' | 'action';
  content: string;
  author?: string;
}

const App = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  // Tell our state that we are storing an array of GameMessage objects
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [command, setCommand] = useState('');

  useEffect(() => {
    const newSocket = io('http://10.0.2.2:3000');
    setSocket(newSocket);
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    
    // Listen for incoming message objects
    newSocket.on('message', (message: GameMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => { newSocket.disconnect(); };
  }, []);

  const sendCommand = () => {
    if (socket && command) {
      socket.emit('command', command);
      setCommand(''); // Clear the input after sending
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
          {/* THE FIX: Render msg.content, not the whole msg object */}
          {messages.map((msg, index) => (
            <Text key={index} style={styles.message}>
              {msg.author && `${msg.author}: `}{msg.content}
            </Text>
          ))}
        </ScrollView>
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
  logContainer: { flex: 1 },
  message: { marginTop: 4, fontSize: 14, }
});

export default App;
