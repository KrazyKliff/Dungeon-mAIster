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
import { Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

// A simple text component for tab icons
const TabBarIcon = ({ focused, iconName }) => (
  <Text style={{ color: focused ? darkTheme.colors.accent : darkTheme.colors.text, fontSize: 10 }}>
    {iconName}
  </Text>
);

const App = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const newSocket = io('http://10.0.2.2:3000');
    setSocket(newSocket);
    newSocket.on('connect', () => {
      console.log('Socket connected!');
      setIsConnected(true)
    });
    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('gameState', (newGameState: GameState) => {
      console.log('Received gameState update');
      setGameState(newGameState);
    });
    return () => { newSocket.disconnect(); };
  }, []);

  if (!isConnected) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: darkTheme.colors.background }}>
        <Text style={{ color: darkTheme.colors.text }}>Connecting to server...</Text>
      </View>
    );
  }

  return (
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
  );
};

export default App;
