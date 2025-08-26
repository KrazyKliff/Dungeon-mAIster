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
} from '@dungeon-maister/data-models';
import { Location } from './location.models';

@Injectable()
export class DataAccessService {
  // Character Creation Data
  private skills: SkillDefinition[] = [];
  private kingdoms: Kingdom[] = [];
  private mammalFeatures: SpeciesFeature[] = [];
  private origins: Origin[] = [];
  private lifeEvents: LifeEvent[] = [];
  private careers: Career[] = [];
  private devotions: Devotion[] = [];
  private birthSigns: BirthSign[] = [];

  // Location Data
  private locations: Map<string, Location> = new Map();

  constructor() {
    this.loadCharacterCreationData();
  }

  private loadCharacterCreationData() {
    const dataPath = path.join(__dirname, 'assets/character-creation');
    console.log(`[DataAccessService] Loading character creation data from: ${dataPath}`);

    try {
      this.skills = this.loadDataFile<SkillDefinition[]>(dataPath, 'skills.json');
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
      // In a real application, we might want to exit the process if this core data fails to load.
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

  // --- Getters for Character Creation Data ---
  getSkills = () => this.skills;
  getKingdoms = () => this.kingdoms;
  getMammalFeatures = () => this.mammalFeatures;
  getOrigins = () => this.origins;
  getLifeEvents = () => this.lifeEvents;
  getCareers = () => this.careers;
  getDevotions = () => this.devotions;
  getBirthSigns = () => this.birthSigns;


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
