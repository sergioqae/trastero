export interface Item {
  id: string;
  name: string;
  description: string;
  borrowedTo?: string | null; // Name of the person item is borrowed to, or null/undefined
}

export interface Box {
  id: string;
  name: string;
  items: Item[];
}
