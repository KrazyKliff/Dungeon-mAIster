import express from 'express';
import { createBaselineCharacter, performSkillCheck } from '@dungeon-maister/rule-engine';

// Create our sample character once when the server starts
const playerCharacter = createBaselineCharacter('char-01', 'Boric the Brave');

const app = express();
const PORT = 3000;

// This middleware is needed to read JSON from requests
app.use(express.json());

// A new endpoint to handle player commands
app.post('/command', (req, res) => {
  const commandText: string = req.body.command || '';
  console.log(`Received command: "${commandText}"`);

  let responseMessage = "I don't understand that command.";

  // Simple command parser
  if (commandText.toLowerCase() === 'roll perception') {
    // A Skill Check is 1d20 + mods vs a DC
    const success = performSkillCheck(playerCharacter, 'perception', 15);
    responseMessage = success ? 'You notice something glittering in the corner!' : 'You see nothing out of the ordinary.';
  }

  res.json({ reply: responseMessage });
});


app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
  console.log('Player character created:', playerCharacter.name);
});
