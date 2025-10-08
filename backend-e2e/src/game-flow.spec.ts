import { io, Socket } from 'socket.io-client';
import { CC_EVENT_READY_FOR_NEXT_STEP, CC_EVENT_SELECT_CHOICE, CC_EVENT_START, GameState } from '@dungeon-maister/data-models';

const SERVER_URL = 'http://localhost:3000';

describe('Game Flow E2E', () => {
  let client1: Socket;
  let client2: Socket;
  const sessionId = `test-session-${Date.now()}`;
  const char1Id = 'char1';
  const char2Id = 'char2';
  let initialGameState: GameState;

  beforeAll((done) => {
    client1 = io(SERVER_URL, { multiplex: false });
    client2 = io(SERVER_URL, { multiplex: false });

    let connectCount = 0;
    const onConnect = () => {
      connectCount++;
      if (connectCount === 2) {
        // Both clients connected, start character creation
        startCharacterCreation();
      }
    };

    client1.on('connect', onConnect);
    client2.on('connect', onConnect);

    const startCharacterCreation = () => {
        let char1Ready = false;
        let char2Ready = false;

        client1.on('gameState', (gameState: GameState) => {
            if (gameState.map.length > 0) { // Game has started
              initialGameState = gameState;
              done();
            }
        });

        // Character 1 joins
        client1.emit(CC_EVENT_START, { sessionId, characterId: char1Id, name: 'Player 1' });
        client1.on(CC_EVENT_READY_FOR_NEXT_STEP, ({ nextStep }) => {
          if (nextStep === 'complete') {
            char1Ready = true;
            return;
          }
          client1.emit(CC_EVENT_SELECT_CHOICE, { sessionId, characterId: char1Id, step: nextStep, choiceId: getChoiceIdForStep(nextStep, 1) });
        });

        // Character 2 joins
        client2.emit(CC_EVENT_START, { sessionId, characterId: char2Id, name: 'Player 2' });
        client2.on(CC_EVENT_READY_FOR_NEXT_STEP, ({ nextStep }) => {
            if (nextStep === 'complete') {
                char2Ready = true;
                return;
            }
            client2.emit(CC_EVENT_SELECT_CHOICE, { sessionId, characterId: char2Id, step: nextStep, choiceId: getChoiceIdForStep(nextStep, 2) });
        });
    }
  }, 30000);

  afterAll(() => {
    client1.disconnect();
    client2.disconnect();
  });

  it('should start the game with two characters', () => {
    expect(initialGameState).toBeDefined();
    expect(initialGameState.characters[char1Id]).toBeDefined();
    expect(initialGameState.characters[char2Id]).toBeDefined();
  });

  it('should allow a player to move and not move other players', (done) => {
    const player1 = initialGameState.entities.find(e => e.id === char1Id);
    const player2 = initialGameState.entities.find(e => e.id === char2Id);
    const player1InitialPosition = { x: player1.x, y: player1.y };
    const player2InitialPosition = { x: player2.x, y: player2.y };

    client1.on('gameState', (newGameState: GameState) => {
      const newPlayer1 = newGameState.entities.find(e => e.id === char1Id);
      const newPlayer2 = newGameState.entities.find(e => e.id === char2Id);
      
      // This assumes moving right always adds 1 to x, which is a safe assumption for this test
      expect(newPlayer1.x).toBe(player1InitialPosition.x + 1);
      expect(newPlayer2.x).toBe(player2InitialPosition.x);
      expect(newPlayer2.y).toBe(player2InitialPosition.y);
      done();
    });

    client1.emit('move', { direction: 'right' });
  }, 10000);

  it('should receive action and narrative messages after a command', (done) => {
    let actionMessageReceived = false;

    client1.on('message', (message: { type: string, content: string, author: string }) => {
      if (message.type === 'action' && message.author === 'Player') {
        actionMessageReceived = true;
      }
      if (message.type === 'narrative' && message.author === 'Game Master') {
        expect(actionMessageReceived).toBe(true);
        expect(message.content).toBeDefined();
        expect(message.content.length).toBeGreaterThan(0);
        done();
      }
    });

    client1.emit('command', 'look around');
  }, 10000);

  it('should start combat and advance the turn order', (done) => {
    let combatStarted = false;
    client1.on('gameState', (gameState: GameState) => {
      if (gameState.combat?.isActive && !combatStarted) {
        combatStarted = true;
        expect(gameState.combat.order.length).toBeGreaterThan(0);
        expect(gameState.combat.turn).toBe(0);
        
        // Now, test next turn
        client1.emit('nextTurn');
      } else if (combatStarted) {
        expect(gameState.combat.turn).toBe(1);
        done();
      }
    });

    client1.emit('startCombat');
  }, 10000);


function getChoiceIdForStep(step: string, player: number): string {
    if (player === 1) {
        switch (step) {
            case 'kingdom': return 'vaneer-concord';
            case 'species_feature': return 'claws';
            case 'origin': return 'the_wilds';
            case 'life_event': return 'found_a_mentor';
            case 'career': return 'soldier';
            case 'devotion': return 'none';
            default: return '';
        }
    } else {
        switch (step) {
            case 'kingdom': return 'heartland-alliance';
            case 'species_feature': return 'tough_hide';
            case 'origin': return 'a_small_village';
            case 'life_event': return 'survived_a_plague';
            case 'career': return 'scholar';
            case 'devotion': return 'the_old_gods';
            default: return '';
        }
    }
}
});