import { Injectable } from '@nestjs/common';
import { Character, Item, Inventory, GameState } from '@dungeon-maister/data-models';

@Injectable()
export class InventoryService {
  public static createEmptyInventory(): Inventory {
    return { items: [], gold: 0 };
  }

  public addItem(character: Character, item: Item): Inventory {
    const newInventory = { ...character.inventory };
    newInventory.items.push(item);
    return newInventory;
  }

  public removeItem(character: Character, itemId: string): Inventory {
    const newInventory = { ...character.inventory };
    newInventory.items = newInventory.items.filter((item) => item.id !== itemId);
    return newInventory;
  }

  public addGold(character: Character, amount: number): Inventory {
    const newInventory = { ...character.inventory };
    newInventory.gold += amount;
    return newInventory;
  }

  public useItem(character: Character, itemId: string, targetId: string | undefined, gameState: GameState): GameState {
    // TODO: Implement item logic
    console.log(`Character ${character.name} used item ${itemId} on target ${targetId}`);
    return gameState;
  }
}