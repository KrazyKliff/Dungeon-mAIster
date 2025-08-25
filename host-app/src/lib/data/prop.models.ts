// This mirrors the backend definition in core-data/src/lib/prop.models.ts
export interface Prop {
  id: string;
  name: string;
  symbol: string;
  themes: string[];
  isWalkable: boolean;
}
