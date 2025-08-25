import { Injectable } from '@nestjs/common';
import { Location } from './location.models';

@Injectable()
export class DataAccessService {
  private locations: Map<string, Location> = new Map();

  updateLocationBlueprint(locationId: string, blueprint: any) {
    const location = this.locations.get(locationId) ?? {
      id: locationId,
      name: `Location \${locationId}`,
      description: 'A dynamically discovered location.',
      biome: 'unknown'
    };
    location.preGeneratedMapParameters = blueprint;
    this.locations.set(locationId, location);
    console.log(`[DataAccessService] Saved blueprint for \${locationId}`);
  }

  getLocationBlueprint(locationId: string) {
    console.log(`[DataAccessService] Fetching blueprint for \${locationId}`);
    return this.locations.get(locationId)?.preGeneratedMapParameters;
  }
}
