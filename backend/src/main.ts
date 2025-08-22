import express from 'express';
import { createBaselineCharacter } from '@dungeon-maister/rule-engine';
import { Character } from '@dungeon-maister/data-models';

// Create a sample character using your rule engine
const sampleCharacter: Character = createBaselineCharacter(
  'char-01',
  'Boric the Brave'
);

// Log the character to the console to see the result
console.log('Generated Character:', sampleCharacter);


const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  // Send the character data as a JSON response
  res.json(sampleCharacter);
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});