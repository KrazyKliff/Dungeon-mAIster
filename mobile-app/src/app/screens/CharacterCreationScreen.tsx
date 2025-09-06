import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { Socket } from 'socket.io-client';
import {
  Character,
  ChoiceStep,
  ChoiceList,
  CC_EVENT_START,
  CC_EVENT_GET_CHOICES,
  CC_EVENT_SELECT_CHOICE,
  CC_EVENT_CHOICES_LIST,
  CC_EVENT_CHARACTER_UPDATED,
  CC_EVENT_READY_FOR_NEXT_STEP,
  CC_EVENT_COMPLETE,
} from '@dungeon-maister/data-models';
import { darkTheme } from '@dungeon-maister/ui-shared';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface CharacterCreationScreenProps {
  socket: Socket | null;
}

export const CharacterCreationScreen = ({ socket }: CharacterCreationScreenProps) => {
  const [sessionId, setSessionId] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [characterId, setCharacterId] = useState('');
  const [character, setCharacter] = useState<Character | null>(null);
  const [step, setStep] = useState<ChoiceStep | 'start' | 'complete'>('start');
  const [choices, setChoices] = useState<ChoiceList>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on(CC_EVENT_CHARACTER_UPDATED, ({ character: updatedCharacter }) => {
      if (updatedCharacter.id === characterId) {
        setCharacter(updatedCharacter);
      }
    });

    socket.on(CC_EVENT_READY_FOR_NEXT_STEP, ({ nextStep }) => {
      setStep(nextStep);
      if (nextStep !== 'complete') {
        socket.emit(CC_EVENT_GET_CHOICES, { sessionId, step: nextStep });
      }
    });

    socket.on(CC_EVENT_CHOICES_LIST, ({ choices: newChoices }) => {
      setChoices(newChoices);
    });

    socket.on(CC_EVENT_COMPLETE, () => {
      setStep('complete');
    });

    return () => {
      socket.off(CC_EVENT_CHARACTER_UPDATED);
      socket.off(CC_EVENT_READY_FOR_NEXT_STEP);
      socket.off(CC_EVENT_CHOICES_LIST);
      socket.off(CC_EVENT_COMPLETE);
    };
  }, [socket, characterId, sessionId]);

  const handleStart = () => {
    if (socket && sessionId && characterName) {
      const newCharacterId = uuidv4();
      setCharacterId(newCharacterId);
      socket.emit(CC_EVENT_START, {
        sessionId,
        characterId: newCharacterId,
        name: characterName,
      });
    }
  };

  const handleSelectChoice = (choiceId: string) => {
    if (socket && step !== 'start' && step !== 'complete') {
      socket.emit(CC_EVENT_SELECT_CHOICE, {
        sessionId,
        characterId,
        step,
        choiceId,
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'start':
        return (
          <View>
            <Text style={styles.label}>Session ID</Text>
            <TextInput
              style={styles.input}
              value={sessionId}
              onChangeText={setSessionId}
              placeholder="Enter Session ID"
              placeholderTextColor={darkTheme.colors.text}
            />
            <Text style={styles.label}>Character Name</Text>
            <TextInput
              style={styles.input}
              value={characterName}
              onChangeText={setCharacterName}
              placeholder="Enter Character Name"
              placeholderTextColor={darkTheme.colors.text}
            />
            <Button title="Start" onPress={handleStart} color={darkTheme.colors.primary} />
          </View>
        );
      case 'complete':
        return <Text style={styles.label}>Character creation complete! Waiting for other players...</Text>;
      default:
        return (
          <View>
            <Text style={styles.label}>Choose your {step.replace('_', ' ')}:</Text>
            <FlatList
              data={choices}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.choiceItem}>
                  <Button title={item.name} onPress={() => handleSelectChoice(item.id)} color={darkTheme.colors.primary} />
                  <Text style={styles.description}>{item.description}</Text>
                </V>
              )}
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Character Creation</Text>
      {renderStep()}
      {character && (
        <View style={styles.characterSheet}>
          <Text style={styles.characterName}>{character.name}</Text>
          {/* Render more character details here as needed */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: darkTheme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: darkTheme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: darkTheme.colors.text,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: darkTheme.colors.primary,
    color: darkTheme.colors.text,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  choiceItem: {
    marginBottom: 10,
  },
  description: {
    color: darkTheme.colors.text,
    fontSize: 12,
    marginLeft: 10,
  },
  characterSheet: {
    marginTop: 20,
    padding: 10,
    backgroundColor: darkTheme.colors.surface,
    borderRadius: 5,
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: darkTheme.colors.accent,
  },
});
