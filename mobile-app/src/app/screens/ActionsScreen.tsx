import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { darkTheme } from '@dungeon-maister/ui-shared';

export const ActionsScreen = () => {
  const [command, setCommand] = useState('');

  const sendCommand = () => {
    // In a real app, this would emit the command via socket
    console.log('Sending command:', command);
    setCommand('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actions</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={command}
          onChangeText={setCommand}
          placeholder="What do you want to do?"
          placeholderTextColor={darkTheme.colors.text}
        />
        <TouchableOpacity style={styles.button} onPress={sendCommand}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
      {/* We could add quick action buttons here later */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
    padding: darkTheme.spacing(2),
  },
  title: {
    fontSize: 28,
    fontFamily: darkTheme.typography.fontFamily.heading,
    color: darkTheme.colors.text,
    textAlign: 'center',
    marginBottom: darkTheme.spacing(2),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: darkTheme.colors.surface,
    borderColor: darkTheme.colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    padding: darkTheme.spacing(1.5),
    marginRight: darkTheme.spacing(1),
    color: darkTheme.colors.text,
    fontSize: 16,
  },
  button: {
    backgroundColor: darkTheme.colors.accent,
    padding: darkTheme.spacing(1.5),
    borderRadius: 8,
  },
  buttonText: {
    color: darkTheme.colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
