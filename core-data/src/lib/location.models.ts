import { MapParameters } from '@dungeon-maister/data-models';

export interface Location {
  id: string;
  name: string;
  description: string;
  biome: string;
  preGeneratedMapParameters?: {
    mapParams: MapParameters;
    // propParams: MapPropParameters;
  } | null;
}
