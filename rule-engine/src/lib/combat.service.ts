import {
  Character,
  CombatState,
  GameEntity,
  GameState,
} from '@dungeon-maister/data-models';

export function startCombat(
  entities: GameEntity[],
  characters: Record<string, Character>
): CombatState {
  const combatants = entities
    .map((entity) => ({
      id: entity.id,
      initiative: characters[entity.id].initiative,
    }))
    .sort((a, b) => b.initiative - a.initiative);

  return {
    isActive: true,
    turn: 0,
    order: combatants.map((c) => c.id),
  };
}

export function nextTurn(currentState: CombatState): CombatState {
  const nextTurn = (currentState.turn + 1) % currentState.order.length;
  return {
    ...currentState,
    turn: nextTurn,
  };
}

export function endCombat(): null {
  return null;
}

export function performAttack(
  attacker: Character,
  defender: Character,
  gameState: GameState
): { newGameState: GameState; narrative: string } {
  // Simple attack logic
  const attackRoll = Math.floor(Math.random() * 20) + 1;
  const didHit = attackRoll > defender.defense;

  let narrative = '';
  let newGameState = { ...gameState };

  if (didHit) {
    const damage = Math.floor(Math.random() * 6) + 1; // 1d6 damage
    const newHp = defender.hp.current - damage;
    narrative = `${attacker.name} attacks ${defender.name} and hits for ${damage} damage!`;

    // Update defender's HP
    const newCharacters = { ...newGameState.characters };
    newCharacters[defender.id] = {
      ...defender,
      hp: { ...defender.hp, current: newHp },
    };
    newGameState = { ...newGameState, characters: newCharacters };
  } else {
    narrative = `${attacker.name} attacks ${defender.name} but misses!`;
  }

  return { newGameState, narrative };
}
