import { Injectable } from '@nestjs/common';
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

@Injectable()
export class DataAccessService {
  // --- Game Rules Data ---
  private skills: SkillDefinition[] = [];
  private combatRules: CombatRules | null = null;
  private criticalHits: CriticalHits | null = null;
  private deathRules: DeathRules | null = null;
  private environmentRules: EnvironmentRules | null = null;

  // --- Character Creation Data ---
  private kingdoms: Kingdom[] = [];
  private mammalFeatures: SpeciesFeature[] = [];
  private origins: Origin[] = [];
  private lifeEvents: LifeEvent[] = [];
  private careers: Career[] = [];
  private devotions: Devotion[] = [];
  private birthSigns: BirthSign[] = [];

  // --- Location Data ---
  private locations: Map<string, Location> = new Map();

  // --- Lore Data ---
  private factions: Faction[] = [];
  private beliefs: Belief[] = [];
  private history: HistoricalEvent[] = [];
  private assetPath: string;

  constructor(assetPath?: string) {
    this.assetPath = assetPath || path.join(__dirname, 'assets');
    this.loadGameRulesData();
    this.loadCharacterCreationData();
    this.loadLoreData();
  }

  private loadLoreData() {
    const dataPath = path.join(this.assetPath, 'lore');
    console.log(`[DataAccessService] Loading lore data from: ${dataPath}`);

    try {
      const commonwealths = this.loadDataFile<Faction[]>(dataPath, 'commonwealths.json');
      const unalignedPeoples = this.loadDataFile<Faction[]>(dataPath, 'unaligned_peoples.json');
      this.factions = [...commonwealths, ...unalignedPeoples];
      this.beliefs = this.loadDataFile<Belief[]>(dataPath, 'beliefs.json');
      this.history = this.loadDataFile<HistoricalEvent[]>(dataPath, 'history.json');
      console.log('[DataAccessService] All lore data loaded successfully.');
    } catch (error) {
      console.error('[DataAccessService] CRITICAL: Failed to load lore data.', error);
    }
  }

  private loadGameRulesData() {
    const dataPath = path.join(this.assetPath, 'rules');
    console.log(`[DataAccessService] Loading game rules data from: ${dataPath}`);

    try {
      this.skills = this.loadDataFile<SkillDefinition[]>(dataPath, 'skills.json');
      this.combatRules = this.loadDataFile<CombatRules>(dataPath, 'combat.json');
      this.criticalHits = this.loadDataFile<CriticalHits>(dataPath, 'critical-hits.json');
      this.deathRules = this.loadDataFile<DeathRules>(dataPath, 'death.json');
      this.environmentRules = this.loadDataFile<EnvironmentRules>(dataPath, 'environment.json');
      console.log('[DataAccessService] All game rules data loaded successfully.');
    } catch (error) {
      console.error('[DataAccessService] CRITICAL: Failed to load game rules data.', error);
    }
  }

  private loadCharacterCreationData() {
    const dataPath = path.join(this.assetPath, 'character-creation');
    console.log(`[DataAccessService] Loading character creation data from: ${dataPath}`);

    try {
      this.kingdoms = this.loadDataFile<Kingdom[]>(dataPath, 'kingdoms.json');
      this.mammalFeatures = this.loadDataFile<SpeciesFeature[]>(dataPath, 'mammal-features.json');
      this.origins = this.loadDataFile<Origin[]>(dataPath, 'origins.json');
      this.lifeEvents = this.loadDataFile<LifeEvent[]>(dataPath, 'life-events.json');
      this.careers = this.loadDataFile<Career[]>(dataPath, 'careers.json');
      this.devotions = this.loadDataFile<Devotion[]>(dataPath, 'devotions.json');
      this.birthSigns = this.loadDataFile<BirthSign[]>(dataPath, 'birth-signs.json');
      console.log('[DataAccessService] All character creation data loaded successfully.');
    } catch (error) {
      console.error('[DataAccessService] CRITICAL: Failed to load character creation data.', error);
    }
  }

  private loadDataFile<T>(dataPath: string, fileName: string): T {
    const filePath = path.join(dataPath, fileName);
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      console.log(`[DataAccessService] Successfully read ${fileName}.`);
      return JSON.parse(fileContent) as T;
    } catch (error) {
      console.error(`[DataAccessService] Failed to read or parse ${fileName} from ${filePath}`);
      throw error;
    }
  }

  // --- Getters for Game Rules ---
  getSkills = () => this.skills;
  getCombatRules = () => this.combatRules;
  getCriticalHits = () => this.criticalHits;
  getDeathRules = () => this.deathRules;
  getEnvironmentRules = () => this.environmentRules;

  // --- Getters for Character Creation Data ---
  getKingdoms = () => this.kingdoms;
  getMammalFeatures = () => this.mammalFeatures;
  getOrigins = () => this.origins;
  getLifeEvents = () => this.lifeEvents;
  getCareers = () => this.careers;
  getDevotions = () => this.devotions;
  getBirthSigns = () => this.birthSigns;

  // --- Getters for Lore Data ---
  getFactions = () => this.factions;
  getBeliefs = () => this.beliefs;
  getHistory = () => this.history;


  // --- Existing Location Blueprint Logic ---
  updateLocationBlueprint(locationId: string, blueprint: any) {
    const location = this.locations.get(locationId) ?? {
      id: locationId,
      name: `Location ${locationId}`,
      description: 'A dynamically discovered location.',
      biome: 'unknown'
    };
    location.preGeneratedMapParameters = blueprint;
    this.locations.set(locationId, location);
    console.log(`[DataAccessService] Saved blueprint for ${locationId}`);
  }

  getLocationBlueprint(locationId: string) {
    console.log(`[DataAccessService] Fetching blueprint for ${locationId}`);
    return this.locations.get(locationId)?.preGeneratedMapParameters;
  }
}
