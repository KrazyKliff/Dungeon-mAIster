import { Injectable } from '@nestjs/common';
import { getFactions } from '@dungeon-maister/core-data';
import {
  WorldState,
  FactionInfluence,
  WorldEvent,
} from '@dungeon-maister/data-models';
import {
  WorldEventService,
  LocationService,
} from '@dungeon-maister/rule-engine';

@Injectable()
export class WorldStateService {
  private worldState: WorldState;

  constructor(
    private readonly worldEventService: WorldEventService,
    private readonly locationService: LocationService
  ) {
    this.initialize();
  }

  private initialize(): void {
    const factions = getFactions();
    const factionInfluences: FactionInfluence[] = factions.map((faction) => ({
      factionId: faction.id,
      influence: 10, // Default influence
    }));
    const locations = this.locationService.getAllLocations();

    this.worldState = {
      factionInfluences,
      activeEvents: [],
      locations,
    };

    console.log('[WorldStateService] World state initialized.');
  }

  getFactionInfluence(factionId: string): number | undefined {
    return this.worldState.factionInfluences.find(
      (fi) => fi.factionId === factionId
    )?.influence;
  }

  updateFactionInfluence(factionId: string, change: number): void {
    const factionInfluence = this.worldState.factionInfluences.find(
      (fi) => fi.factionId === factionId
    );
    if (factionInfluence) {
      factionInfluence.influence += change;
      console.log(
        `[WorldStateService] Influence of ${factionId} updated to ${factionInfluence.influence}`
      );
      this.checkForEvents(factionId, factionInfluence.influence);
    }
  }

  private checkForEvents(factionId: string, influence: number): void {
    const triggeredEvents = this.worldEventService.getTriggeredEvents(
      factionId,
      influence
    );
    triggeredEvents.forEach((event) => {
      if (
        !this.worldState.activeEvents.find(
          (activeEvent) => activeEvent.id === event.id
        )
      ) {
        this.worldState.activeEvents.push(event);
        console.log(
          `[WorldStateService] New world event triggered: ${event.name}`
        );
      }
    });
  }

  public getActiveEvents(): WorldEvent[] {
    return this.worldState.activeEvents;
  }
}
