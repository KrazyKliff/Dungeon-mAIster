import * as fs from 'fs';
import * as path from 'path';
import {
  BirthSign,
  Career,
  Devotion,
  Kingdom,
  LifeEvent,
  Origin,
  SpeciesFeature,
  SkillDefinition,
  CombatRules,
  CriticalHits,
  DeathRules,
  EnvironmentRules,
  Faction,
  Belief,
  HistoricalEvent,
} from '@dungeon-maister/data-models';
import { Location } from './location.models';
import { Logger } from '@dungeon-maister/shared';

// --- Data Loading ---

const assetPath = process.env['NODE_ENV'] === 'test'
  ? path.join(process.cwd(), 'core-data/src/lib/assets') // Correct path for tests
  : path.join(__dirname, 'assets');


function loadDataFile<T>(dataPath: string, fileName: string): T {
  const filePath = path.join(dataPath, fileName);
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    Logger.info(`[DataStore] Successfully read ${fileName}.`);
    return JSON.parse(fileContent) as T;
  } catch (error) {
    if (error instanceof Error) {
        Logger.error(`[DataStore] Failed to read or parse ${fileName} from ${filePath}. Error: ${error.message}`);
    }
    // Return a default value or an empty array to prevent crashing the app
    // This is a temporary measure until all data files are created.
    if (fileName === 'skills.json') return [] as T;
    throw error;
  }
}

// --- Memoization Caching ---
let _skills: SkillDefinition[] | null = null;
let _combatRules: CombatRules | null = null;
let _criticalHits: CriticalHits | null = null;
let _deathRules: DeathRules | null = null;
let _environmentRules: EnvironmentRules | null = null;
let _kingdoms: Kingdom[] | null = null;
let _mammalFeatures: SpeciesFeature[] | null = null;
let _origins: Origin[] | null = null;
let _lifeEvents: LifeEvent[] | null = null;
let _careers: Career[] | null = null;
let _devotions: Devotion[] | null = null;
let _birthSigns: BirthSign[] | null = null;
let _factions: Faction[] | null = null;
let _beliefs: Belief[] | null = null;
let _history: HistoricalEvent[] | null = null;

// --- Game Rules Data ---

export const getSkills = () => {
    if (!_skills) {
        const skillsPath = path.join(assetPath, 'rules');
        _skills = loadDataFile<SkillDefinition[]>(skillsPath, 'skills.json');
    }
    return _skills;
};
export const getAllSkills = () => getSkills();
export const findSkillById = (skillId: string): SkillDefinition | undefined => {
  return getSkills().find((skill) => skill.id === skillId);
}
export const findSkillByName = (name: string): SkillDefinition | undefined => {
  const lowerCaseName = name.toLowerCase();
  return getSkills().find((skill) => skill.name.toLowerCase() === lowerCaseName);
}
export const getCombatRules = () => {
    if (!_combatRules) {
        const rulesPath = path.join(assetPath, 'rules');
        _combatRules = loadDataFile<CombatRules>(rulesPath, 'combat.json');
    }
    return _combatRules;
};
export const getCriticalHits = () => {
    if (!_criticalHits) {
        const rulesPath = path.join(assetPath, 'rules');
        _criticalHits = loadDataFile<CriticalHits>(rulesPath, 'critical-hits.json');
    }
    return _criticalHits;
};
export const getDeathRules = () => {
    if (!_deathRules) {
        const rulesPath = path.join(assetPath, 'rules');
        _deathRules = loadDataFile<DeathRules>(rulesPath, 'death.json');
    }
    return _deathRules;
};
export const getEnvironmentRules = () => {
    if (!_environmentRules) {
        const rulesPath = path.join(assetPath, 'rules');
        _environmentRules = loadDataFile<EnvironmentRules>(rulesPath, 'environment.json');
    }
    return _environmentRules;
};

// --- Character Creation Data ---

export const getKingdoms = () => {
    if (!_kingdoms) {
        const charCreationPath = path.join(assetPath, 'character-creation');
        _kingdoms = loadDataFile<Kingdom[]>(charCreationPath, 'kingdoms.json');
    }
    return _kingdoms;
};
export const getMammalFeatures = () => {
    if (!_mammalFeatures) {
        const charCreationPath = path.join(assetPath, 'character-creation');
        _mammalFeatures = loadDataFile<SpeciesFeature[]>(charCreationPath, 'mammal-features.json');
    }
    return _mammalFeatures;
};
export const getOrigins = () => {
    if (!_origins) {
        const charCreationPath = path.join(assetPath, 'character-creation');
        _origins = loadDataFile<Origin[]>(charCreationPath, 'origins.json');
    }
    return _origins;
};
export const getLifeEvents = () => {
    if (!_lifeEvents) {
        const charCreationPath = path.join(assetPath, 'character-creation');
        _lifeEvents = loadDataFile<LifeEvent[]>(charCreationPath, 'life-events.json');
    }
    return _lifeEvents;
};
export const getCareers = () => {
    if (!_careers) {
        const charCreationPath = path.join(assetPath, 'character-creation');
        _careers = loadDataFile<Career[]>(charCreationPath, 'careers.json');
    }
    return _careers;
};
export const getDevotions = () => {
    if (!_devotions) {
        const charCreationPath = path.join(assetPath, 'character-creation');
        _devotions = loadDataFile<Devotion[]>(charCreationPath, 'devotions.json');
    }
    return _devotions;
};
export const getBirthSigns = () => {
    if (!_birthSigns) {
        const charCreationPath = path.join(assetPath, 'character-creation');
        _birthSigns = loadDataFile<BirthSign[]>(charCreationPath, 'birth-signs.json');
    }
    return _birthSigns;
};

// --- Lore Data ---

export const getFactions = () => {
    if (!_factions) {
        const lorePath = path.join(assetPath, 'lore');
        const commonwealths = loadDataFile<Faction[]>(lorePath, 'commonwealths.json');
        const unalignedPeoples = loadDataFile<Faction[]>(lorePath, 'unaligned_peoples.json');
        _factions = [...commonwealths, ...unalignedPeoples];
    }
    return _factions;
};
export const getBeliefs = () => {
    if (!_beliefs) {
        const lorePath = path.join(assetPath, 'lore');
        _beliefs = loadDataFile<Belief[]>(lorePath, 'beliefs.json');
    }
    return _beliefs;
};
export const getHistory = () => {
    if (!_history) {
        const lorePath = path.join(assetPath, 'lore');
        _history = loadDataFile<HistoricalEvent[]>(lorePath, 'history.json');
    }
    return _history;
};

// --- Location Blueprint Logic ---

const locations: Map<string, Location> = new Map();

export const updateLocationBlueprint = (locationId: string, blueprint: any) => {
  const location = locations.get(locationId) ?? {
    id: locationId,
    name: `Location ${locationId}`,
    description: 'A dynamically discovered location.',
    biome: 'unknown'
  };
  location.preGeneratedMapParameters = blueprint;
  locations.set(locationId, location);
  Logger.info(`[DataStore] Saved blueprint for ${locationId}`);
};

export const getLocationBlueprint = (locationId: string) => {
  Logger.info(`[DataStore] Fetching blueprint for ${locationId}`);
  return locations.get(locationId)?.preGeneratedMapParameters;
};
