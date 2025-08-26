import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { darkTheme } from '@dungeon-maister/ui-shared';

const mockInventory = [
  { id: '1', name: 'Health Potion', quantity: 3, description: 'Restores 10 HP.' },
  { id: '2', name: 'Longsword', quantity: 1, description: 'A sharp, reliable blade.' },
  { id: '3', name: 'Leather Armor', quantity: 1, description: 'Basic protection.' },
  { id: '4', name: 'Gold Coins', quantity: 50, description: 'Shiny.' },
];

export const InventoryScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name} (x{item.quantity})</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      <FlatList
        data={mockInventory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
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
  list: {
    width: '100%',
  },
  itemContainer: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: 8,
    padding: darkTheme.spacing(2),
    marginBottom: darkTheme.spacing(1),
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.colors.accent,
  },
  itemDescription: {
    fontSize: 14,
    color: darkTheme.colors.text,
    marginTop: 4,
  },
});
