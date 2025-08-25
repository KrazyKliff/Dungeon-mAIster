import { MapParameters, MapPropParameters } from '@dungeon-maister/llm-orchestrator';

export interface Location {
  id: string;
  name: string;
  description: string;
  biome: string;
  preGeneratedMapParameters?: {
    mapParams: MapParameters;
    propParams: MapPropParameters;
  } | null;
}
