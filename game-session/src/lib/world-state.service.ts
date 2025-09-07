import { Injectable } from '@nestjs/common';
import { getFactions } from '@dungeon-maister/core-data';
import { WorldState, FactionInfluence } from '@dungeon-maister/data-models';

@Injectable()
export class WorldStateService {
  private worldState: WorldState;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const factions = getFactions();
    const factionInfluences: FactionInfluence[] = factions.map(faction => ({
      factionId: faction.id,
      influence: 10, // Default influence
    }));

    this.worldState = {
      factionInfluences,
    };

    console.log('[WorldStateService] World state initialized.');
  }

  getFactionInfluence(factionId: string): number | undefined {
    return this.worldState.factionInfluences.find(fi => fi.factionId === factionId)?.influence;
  }

  updateFactionInfluence(factionId: string, change: number): void {
    const factionInfluence = this.worldState.factionInfluences.find(fi => fi.factionId === factionId);
    if (factionInfluence) {
      factionInfluence.influence += change;
      console.log(`[WorldStateService] Influence of ${factionId} updated to ${factionInfluence.influence}`);
      this.checkForEvents(factionId);
    }
  }

  private checkForEvents(factionId: string): void {
    // In the future, this method will check if the new influence level triggers any world events.
    // For now, it's a placeholder.
  }
}
