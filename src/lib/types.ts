
export interface Item {
  id: string;
  name: string;
  description: string;
  borrowedTo?: string | null;
}

export interface Box {
  id: string;
  name: string;
  items: Item[];
}
