import { Injectable, Provider } from '@nestjs/common';
import { Location } from '@dungeon-maister/data-models';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class LocationService {
  constructor(private readonly locations: Location[]) {
    console.log('[LocationService] Constructor called with locations:', this.locations?.length || 0);
  }

  public getLocation(id: string): Location | undefined {
    return this.locations.find(location => location.id === id);
  }

  public getAllLocations(): Location[] {
    console.log('[LocationService] getAllLocations called, returning:', this.locations?.length || 0, 'locations');
    return this.locations;
  }
}

export const locationServiceProvider: Provider = {
  provide: LocationService,
  useFactory: async () => {
    const filePath = path.join(process.cwd(), 'core-data', 'src', 'lib', 'lore', 'locations.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const locations = JSON.parse(data);
    console.log('[LocationService] Locations loaded.');
    return new LocationService(locations);
  },
};
