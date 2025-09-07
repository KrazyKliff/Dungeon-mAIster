import {
  Character,
  CombatState,
  GameEntity,
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
