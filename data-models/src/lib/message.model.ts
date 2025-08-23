// Defines the structure of all messages sent from the backend to the UIs
export interface GameMessage {
  type: 'narrative' | 'dialogue' | 'action';
  content: string;
  author?: string;
}
