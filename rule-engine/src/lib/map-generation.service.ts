import { askAI } from '@dungeon-maister/llm-orchestrator';
import { MapData, MapProp, MapParameters, MapConfig } from '@dungeon-maister/data-models';

function extractJsonFromString(text: string): string | null {
  const jsonObjStart = text.indexOf('{');
  const jsonObjEnd = text.lastIndexOf('}');
  if (jsonObjStart !== -1 && jsonObjEnd !== -1 && jsonObjEnd > jsonObjStart) {
    return text.substring(jsonObjStart, jsonObjEnd + 1);
  }
  return null;
}

export async function getMapParametersFromAI(theme: string): Promise<MapParameters> {
  const prompt = `You are a game designer setting parameters for a level. The theme is "${theme}". Provide parameters for this level. - propDensity: 'low', 'medium', or 'high'. - propThemes: A JSON array of 3-5 thematic prop names (e.g., ["chest", "rubble"]). - enemyCount: A number between 2 and 5. Respond ONLY with a valid JSON object. Example: {"propDensity":"medium","propThemes":["rubble","broken cart","goblin skull"],"enemyCount":3}`;
  try {
    const rawResponse = await askAI(prompt);
    console.log('--- RAW AI PARAMS RESPONSE START ---\n', rawResponse, '\n--- RAW AI PARAMS RESPONSE END ---');
    const jsonString = extractJsonFromString(rawResponse);
    if (!jsonString) { throw new Error("No valid JSON object in AI response."); }
    const params = JSON.parse(jsonString);
    console.log('[ParamGen]: AI generated parameters:', params);
    return params;
  } catch (error) {
    console.error('[ParamGen]: Failed to get params from AI. Using defaults.', error);
    return { propDensity: 'low', propThemes: ['rock', 'pebble'], enemyCount: 1 };
  }
}

export function generateMap(width: number, height: number, params: MapParameters): { map: MapData; props: MapProp[] } {
  const map = Array.from({ length: height }, () => Array(width).fill(1));
  let currentRow = Math.floor(height / 2);
  let currentColumn = Math.floor(width / 2);
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (let i = 0; i < (width * height); i++) {
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const newRow = currentRow + randomDirection[0];
    const newCol = currentColumn + randomDirection[1];
    if (newRow > 0 && newRow < height - 1 && newCol > 0 && newCol < width - 1) {
      currentRow = newRow;
      currentColumn = newCol;
      map[currentRow][currentColumn] = 0;
    }
  }

  const floorTiles = [];
  map.forEach((row, y) => row.forEach((tile, x) => { if (tile === 0) floorTiles.push({x, y}); }));

  const props: MapProp[] = [];
  const propCount = params.propDensity === 'high' ? 7 : params.propDensity === 'medium' ? 5 : 3;
  for (let i = 0; i < propCount && floorTiles.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * floorTiles.length);
    const tile = floorTiles.splice(randomIndex, 1)[0];
    const propName = params.propThemes[Math.floor(Math.random() * params.propThemes.length)];
    props.push({ name: propName, x: tile.x, y: tile.y });
  }
  console.log('[MapGen]: Deterministically placed props:', props);
  return { map, props };
}
