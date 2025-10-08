import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { io, Socket } from 'socket.io-client';
import { GameState } from '@dungeon-maister/data-models';
import { darkTheme } from '@dungeon-maister/ui-shared';

import { ImmersiveScreen } from './screens/ImmersiveScreen';
import { CharacterSheetScreen } from './screens/CharacterSheetScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { ActionsScreen } from './screens/ActionsScreen';
import { CharacterCreationScreen } from './screens/CharacterCreationScreen';
import { Text, View, StyleSheet, Pressable } from 'react-native';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, iconName }) => (
  <Text style={{ color: focused ? darkTheme.colors.accent : darkTheme.colors.text, fontSize: 10 }}>
    {iconName}
  </Text>
);

const ErrorBanner = ({ message, onClose }) => (
  <View style={styles.errorBanner}>
    <Text style={styles.errorText}>{message}</Text>
    <Pressable onPress={onClose}>
      <Text style={styles.errorClose}>&times;</Text>
    </Pressable>
  </View>
);

const App = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For Android emulator, 'localhost' is 10.0.2.2
    const newSocket = io('http://10.0.2.2:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });
    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('gameState', (newGameState: GameState) => {
      setGameState(newGameState);
    });

    newSocket.on('error', (errorData: { message: string }) => {
      console.error('Server Error:', errorData);
      setError(errorData.message || 'An unknown error occurred.');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection Error:', err);
      setError(`Connection failed: ${err.message}`);
      setIsConnected(false);
    });

    return () => { newSocket.disconnect(); };
  }, []);

  const connectingScreen = (
    <View style={styles.centeredScreen}>
      <Text style={{ color: darkTheme.colors.text }}>
        {error ? 'Connection Failed' : 'Connecting to server...'}
      </Text>
      {error && <Text style={{ color: darkTheme.colors.danger, marginTop: 10 }}>{error}</Text>}
    </View>
  );

  if (!isConnected && !error) {
    return connectingScreen;
  }

  return (
    <View style={{ flex: 1, backgroundColor: darkTheme.colors.background }}>
      <NavigationContainer>
        {!gameState ? (
          <CharacterCreationScreen socket={socket} />
        ) : (
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: darkTheme.colors.surface,
                borderTopColor: darkTheme.colors.primary,
              },
              tabBarActiveTintColor: darkTheme.colors.accent,
              tabBarInactiveTintColor: darkTheme.colors.text,
              headerStyle: {
                backgroundColor: darkTheme.colors.surface,
              },
              headerTitleStyle: {
                color: darkTheme.colors.text,
                fontFamily: darkTheme.typography.fontFamily.heading,
              },
            }}
          >
            <Tab.Screen
              name="Character"
              component={CharacterSheetScreen}
              options={{ tabBarIcon: (props) => <TabBarIcon {...props} iconName="SHEET" /> }}
            />
            <Tab.Screen
              name="Home"
              component={ImmersiveScreen}
              options={{ tabBarIcon: (props) => <TabBarIcon {...props} iconName="HOME" /> }}
            />
            <Tab.Screen
              name="Inventory"
              component={InventoryScreen}
              options={{ tabBarIcon: (props) => <TabBarIcon {...props} iconName="BAG" /> }}
            />
            <Tab.Screen
              name="Actions"
              component={ActionsScreen}
              options={{ tabBarIcon: (props) => <TabBarIcon {...props} iconName="ACTION" /> }}
            />
          </Tab.Navigator>
        )}
      </NavigationContainer>
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkTheme.colors.background,
  },
  errorBanner: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#D32F2F',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
  },
  errorText: {
    color: 'white',
    flex: 1,
  },
  errorClose: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default App;
