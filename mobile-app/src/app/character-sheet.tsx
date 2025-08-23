import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Character } from '@dungeon-maister/data-models';

interface CharacterSheetProps {
  character: Character | null;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ character }) => {
  if (!character) {
    return <Text>Loading character...</Text>;
  }

  return (
    <View style={styles.sheetContainer}>
      <Text style={styles.characterName}>{character.name}</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.statItem}>HP: {character.hp.current} / {character.hp.max}</Text>
        <Text style={styles.statItem}>DEF: {character.defense}</Text>
        <Text style={styles.statItem}>SPD: {character.movementSpeed}ft</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.attributesContainer}>
        {Object.values(character.primaryAttributes).map((attr) => (
          <View key={attr.name} style={styles.attributeItem}>
            <Text style={styles.attributeName}>{attr.name}</Text>
            <Text style={styles.attributeScore}>{attr.score}</Text>
            <Text style={styles.attributeModifier}>({attr.modifier >= 0 ? `+${attr.modifier}` : attr.modifier})</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 16,
  },
  characterName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  statItem: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  attributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  attributeItem: {
    alignItems: 'center',
    margin: 8,
    minWidth: 50,
  },
  attributeName: {
    fontSize: 14,
    color: '#666',
  },
  attributeScore: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  attributeModifier: {
    fontSize: 14,
  },
});
