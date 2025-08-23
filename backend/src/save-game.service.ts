import * as fs from 'fs/promises';
import * as path from 'path';

// This is a placeholder for your GameState type.
// In a larger app, you'd import this from your data-models.
interface GameState {
  map: any;
  entities: any[];
  characters: Record<string, any>;
}

const SAVE_DIR = path.join(__dirname, 'saves');

async function ensureSaveDirectory(): Promise<void> {
  try {
    await fs.mkdir(SAVE_DIR);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

export async function saveGameState(gameState: GameState, slot: number): Promise<boolean> {
  await ensureSaveDirectory();
  const filePath = path.join(SAVE_DIR, `savegame_${slot}.json`);
  try {
    const jsonString = JSON.stringify(gameState, null, 2); // Pretty-print the JSON
    await fs.writeFile(filePath, jsonString);
    console.log(`[SaveGameService]: Game state saved to slot ${slot}.`);
    return true;
  } catch (error) {
    console.error(`[SaveGameService]: Error saving game to slot ${slot}:`, error);
    return false;
  }
}

export async function loadGameState(slot: number): Promise<GameState | null> {
  const filePath = path.join(SAVE_DIR, `savegame_${slot}.json`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const gameState = JSON.parse(fileContent);
    console.log(`[SaveGameService]: Game state loaded from slot ${slot}.`);
    return gameState;
  } catch (error) {
    console.error(`[SaveGameService]: Error loading game from slot ${slot}:`, error);
    return null;
  }
}
