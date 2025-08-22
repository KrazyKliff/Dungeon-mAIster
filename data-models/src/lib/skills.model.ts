// Interface for a single skill a character possesses
export interface Skill {
  id: string; // A unique identifier, e.g., 'athletics'
  name: string; // The display name, e.g., 'Athletics'
  rank: number; // The rank from 0-5
  xp: number;   // Experience points accumulated toward the next rank
}
