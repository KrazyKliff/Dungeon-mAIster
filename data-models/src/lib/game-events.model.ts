// --- Game Events ---

export const GAME_EVENT_USE_ITEM = 'use_item';
export const GAME_EVENT_USE_ABILITY = 'use_ability';

// --- Combat Events ---

export const COMBAT_ACTION_ATTACK = 'combat_attack';

export interface UseItemPayload {
  itemId: string;
  targetId?: string;
}

export interface UseAbilityPayload {
  abilityId: string;
  targetId?: string;
}

export interface AttackPayload {
    targetId: string;
}
