import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { darkTheme } from '@dungeon-maister/ui-shared';

const mockCharacter = {
    name: 'Valerius',
    hp: { current: 25, max: 30 },
    defense: 16,
    movementSpeed: 30,
    primaryAttributes: {
        strength: { name: 'STR', score: 16, modifier: 3 },
        dexterity: { name: 'DEX', score: 14, modifier: 2 },
        constitution: { name: 'CON', score: 15, modifier: 2 },
        intelligence: { name: 'INT', score: 10, modifier: 0 },
        wisdom: { name: 'WIS', score: 12, modifier: 1 },
        charisma: { name: 'CHA', score: 8, modifier: -1 },
    }
};

export const CharacterSheetScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{mockCharacter.name}</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.statItem}>HP: {mockCharacter.hp.current} / {mockCharacter.hp.max}</Text>
        <Text style={styles.statItem}>DEF: {mockCharacter.defense}</Text>
        <Text style={styles.statItem}>SPD: {mockCharacter.movementSpeed}ft</Text>
      </View>

      <View style={styles.separator} />

      <Text style={styles.sectionTitle}>Attributes</Text>
      <View style={styles.attributesContainer}>
        {Object.values(mockCharacter.primaryAttributes).map((attr) => (
          <View key={attr.name} style={styles.attributeItem}>
            <Text style={styles.attributeName}>{attr.name}</Text>
            <Text style={styles.attributeScore}>{attr.score}</Text>
            <Text style={styles.attributeModifier}>({attr.modifier >= 0 ? `+${attr.modifier}` : attr.modifier})</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
    padding: darkTheme.spacing(2),
  },
  name: {
    fontSize: 28,
    fontFamily: darkTheme.typography.fontFamily.heading,
    color: darkTheme.colors.text,
    textAlign: 'center',
    marginBottom: darkTheme.spacing(2),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: darkTheme.spacing(2),
    backgroundColor: darkTheme.colors.surface,
    borderRadius: 8,
    marginBottom: darkTheme.spacing(2),
  },
  statItem: {
    fontSize: 18,
    color: darkTheme.colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: darkTheme.colors.surface,
    marginVertical: darkTheme.spacing(2),
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: darkTheme.typography.fontFamily.heading,
    color: darkTheme.colors.text,
    marginBottom: darkTheme.spacing(1),
  },
  attributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  attributeItem: {
    alignItems: 'center',
    backgroundColor: darkTheme.colors.surface,
    borderRadius: 8,
    padding: darkTheme.spacing(2),
    margin: darkTheme.spacing(1),
    minWidth: 80,
  },
  attributeName: {
    fontSize: 14,
    color: darkTheme.colors.accent,
  },
  attributeScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: darkTheme.colors.text,
  },
  attributeModifier: {
    fontSize: 16,
    color: darkTheme.colors.text,
  },
});
