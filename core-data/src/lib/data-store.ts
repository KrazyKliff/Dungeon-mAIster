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

// --- Data Loading ---

const assetPath = process.env.NODE_ENV === 'test'
  ? path.join(process.cwd(), 'core-data/src/lib')
  : path.join(__dirname, 'assets');


function loadDataFile<T>(dataPath: string, fileName: string): T {
  const filePath = path.join(dataPath, fileName);
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log(`[DataStore] Successfully read ${fileName}.`);
    return JSON.parse(fileContent) as T;
  } catch (error) {
    console.error(`[DataStore] Failed to read or parse ${fileName} from ${filePath}`);
    throw error;
  }
}

// --- Game Rules Data ---

const skillsPath = path.join(assetPath, 'rules');
const skills: SkillDefinition[] = loadDataFile<SkillDefinition[]>(skillsPath, 'skills.json');
const combatRules: CombatRules = loadDataFile<CombatRules>(skillsPath, 'combat.json');
const criticalHits: CriticalHits = loadDataFile<CriticalHits>(skillsPath, 'critical-hits.json');
const deathRules: DeathRules = loadDataFile<DeathRules>(skillsPath, 'death.json');
const environmentRules: EnvironmentRules = loadDataFile<EnvironmentRules>(skillsPath, 'environment.json');

export const getSkills = () => skills;
export const getAllSkills = () => skills;
export const findSkillById = (skillId: string): SkillDefinition | undefined => {
  return skills.find((skill) => skill.id === skillId);
}
export const findSkillByName = (name: string): SkillDefinition | undefined => {
  const lowerCaseName = name.toLowerCase();
  return skills.find((skill) => skill.name.toLowerCase() === lowerCaseName);
}
export const getCombatRules = () => combatRules;
export const getCriticalHits = () => criticalHits;
export const getDeathRules = () => deathRules;
export const getEnvironmentRules = () => environmentRules;

// --- Character Creation Data ---

const charCreationPath = path.join(assetPath, 'character-creation');
const kingdoms: Kingdom[] = loadDataFile<Kingdom[]>(charCreationPath, 'kingdoms.json');
const mammalFeatures: SpeciesFeature[] = loadDataFile<SpeciesFeature[]>(charCreationPath, 'mammal-features.json');
const origins: Origin[] = loadDataFile<Origin[]>(charCreationPath, 'origins.json');
const lifeEvents: LifeEvent[] = loadDataFile<LifeEvent[]>(charCreationPath, 'life-events.json');
const careers: Career[] = loadDataFile<Career[]>(charCreationPath, 'careers.json');
const devotions: Devotion[] = loadDataFile<Devotion[]>(charCreationPath, 'devotions.json');
const birthSigns: BirthSign[] = loadDataFile<BirthSign[]>(charCreationPath, 'birth-signs.json');

export const getKingdoms = () => kingdoms;
export const getMammalFeatures = () => mammalFeatures;
export const getOrigins = () => origins;
export const getLifeEvents = () => lifeEvents;
export const getCareers = () => careers;
export const getDevotions = () => devotions;
export const getBirthSigns = () => birthSigns;

// --- Lore Data ---

const lorePath = path.join(assetPath, 'lore');
const commonwealths = loadDataFile<Faction[]>(lorePath, 'commonwealths.json');
const unalignedPeoples = loadDataFile<Faction[]>(lorePath, 'unaligned_peoples.json');
const factions: Faction[] = [...commonwealths, ...unalignedPeoples];
const beliefs: Belief[] = loadDataFile<Belief[]>(lorePath, 'beliefs.json');
const history: HistoricalEvent[] = loadDataFile<HistoricalEvent[]>(lorePath, 'history.json');

export const getFactions = () => factions;
export const getBeliefs = () => beliefs;
export const getHistory = () => history;

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
  console.log(`[DataStore] Saved blueprint for ${locationId}`);
};

export const getLocationBlueprint = (locationId: string) => {
  console.log(`[DataStore] Fetching blueprint for ${locationId}`);
  return locations.get(locationId)?.preGeneratedMapParameters;
};
