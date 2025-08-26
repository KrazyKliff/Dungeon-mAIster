import { SkillDefinition } from './skills.model';

// --- Combat Rules ---
export interface CombatAction {
  name: string;
  cost: string;
  description?: string;
  examples?: string[];
}

export interface RelevantSubAttribute {
  weaponType: string[];
  attribute: string;
}

export interface TargetedAttack {
  area: string;
  modifier: string;
  effect: string;
}

export interface SituationalModifier {
  condition: string;
  effect: string;
}

export interface DamageBonusSource {
  type: string;
  attribute?: string;
  description?: string;
  example?: string;
}

export interface CombatRules {
  combatFlow: {
    type: string;
    roundDuration: string;
    initiative: {
      formula: string;
      description: string;
    };
    turn: {
      apAllocation: string;
      actions: CombatAction[];
    };
  };
  attackRoll: {
    formula: string;
    condition: string;
    relevantSubAttribute: RelevantSubAttribute[];
    targetedAttacks: TargetedAttack[];
    situationalModifiers: SituationalModifier[];
  };
  damageCalculation: {
    formula: string;
    bonusSources: DamageBonusSource[];
    criticalSuccess: {
      trigger: string;
      effect: string;
    };
    damageReduction: string;
    damageTypes: string[];
  };
}

// --- Critical Hits ---
export interface CriticalHitResult {
  roll: number | number[];
  name: string;
  effect: string;
}

export interface CriticalHitTable {
  name: string;
  roll: string;
  trigger: string;
  results: CriticalHitResult[];
}

export interface CriticalHits {
  triggerConditions: string[];
  criticalHitTable: CriticalHitTable;
  limbIncapacitationTable: CriticalHitTable;
}

// --- Death Rules ---
export interface DeathRules {
  reachingZeroHP: {
    description: string;
    woundThresholds: {
      description: string;
      thresholds: string[];
    };
  };
  stabilizing: {
    skill: string;
    action: string;
    effect: string;
  };
  specialRules: {
    name: string;
    effect: string;
  }[];
}

// --- Environment Rules ---
export interface TerrainType {
  name: string;
  effect: string;
}

export interface CoverType {
  name: string;
  effect: string;
}

export interface EnvironmentalCondition {
  name: string;
  effect: string;
}

export interface EnvironmentRules {
  terrainTypes: TerrainType[];
  coverTypes: CoverType[];
  environmentalConditions: EnvironmentalCondition[];
}

// --- Unified Rules Object ---
export interface GameRules {
  skills: SkillDefinition[];
  combat: CombatRules;
  criticalHits: CriticalHits;
  death: DeathRules;
  environment: EnvironmentRules;
}
