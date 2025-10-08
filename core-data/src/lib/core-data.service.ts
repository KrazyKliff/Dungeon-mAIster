import { Injectable } from '@nestjs/common';
import { Faction, Belief, HistoricalEvent } from '@dungeon-maister/data-models';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CoreDataService {
  private loadJson<T>(filePath: string): T {
    const fullPath = path.join(__dirname, 'assets', 'lore', filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(fileContent) as T;
  }

  getFactions(): Faction[] {
    return this.loadJson<Faction[]>('factions.json');
  }

  getBeliefs(): Belief[] {
    return this.loadJson<Belief[]>('beliefs.json');
  }

  getHistory(): HistoricalEvent[] {
    return this.loadJson<HistoricalEvent[]>('history.json');
  }
}
