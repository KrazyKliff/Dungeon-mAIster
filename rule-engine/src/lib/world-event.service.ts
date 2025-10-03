import { Injectable, Provider } from '@nestjs/common';
import { WorldEvent } from '@dungeon-maister/data-models';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class WorldEventService {
  constructor(private readonly worldEvents: WorldEvent[]) {}

  public getTriggeredEvents(factionId: string, influence: number): WorldEvent[] {
    return this.worldEvents.filter(event => {
      return event.trigger.factionId === factionId && influence >= event.trigger.threshold;
    });
  }
}

export const worldEventServiceProvider: Provider = {
  provide: WorldEventService,
  useFactory: async () => {
    const filePath = path.join(process.cwd(), 'core-data', 'src', 'lib', 'lore', 'world-events.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const worldEvents = JSON.parse(data);
    console.log('[WorldEventService] World events loaded.');
    return new WorldEventService(worldEvents);
  },
};
