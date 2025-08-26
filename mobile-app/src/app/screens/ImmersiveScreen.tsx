import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { darkTheme } from '@dungeon-maister/ui-shared';

// Mock data for the character
const mockCharacter = {
  name: 'Valerius',
  avatarUrl: 'https://via.placeholder.com/150', // Placeholder image
  status: ['Healthy', 'Energized'],
};

export const ImmersiveScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: mockCharacter.avatarUrl }} style={styles.avatar} />
      <Text style={styles.name}>{mockCharacter.name}</Text>
      <View style={styles.statusContainer}>
        {mockCharacter.status.map((s, index) => (
          <View key={index} style={styles.statusBadge}>
            <Text style={styles.statusText}>{s}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.prompt}>What do you do?</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkTheme.colors.background,
    padding: darkTheme.spacing(3),
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: darkTheme.colors.accent,
    marginBottom: darkTheme.spacing(2),
  },
  name: {
    fontSize: 28,
    fontFamily: darkTheme.typography.fontFamily.heading,
    color: darkTheme.colors.text,
    marginBottom: darkTheme.spacing(1),
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: darkTheme.spacing(4),
  },
  statusBadge: {
    backgroundColor: darkTheme.colors.surface,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statusText: {
    color: darkTheme.colors.accent,
    fontSize: 14,
  },
  prompt: {
    fontSize: 18,
    color: darkTheme.colors.text,
    fontFamily: darkTheme.typography.fontFamily.body,
    textAlign: 'center',
  },
});
