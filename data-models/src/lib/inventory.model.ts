export interface Item {
  id: string;
  name: string;
  description: string;
}

export interface Inventory {
  items: Item[];
  gold: number;
}