
export interface Item {
  id: string;
  name: string;
  description: string;
  borrowedTo?: string | null;
}

export interface BoxLocation {
  estanteriaId: string;
  estanteriaName: string; // For display purposes
  baldaId?: string | null; // Optional: if null, box is directly on estanteria
  baldaName?: string | null; // Optional
}

export interface Box {
  id: string;
  name: string;
  items: Item[];
  location?: BoxLocation | null;
}

export interface Balda {
  id: string;
  name: string;
  looseItems: Item[];
}

export interface Estanteria {
  id: string;
  name: string;
  baldas: Balda[];
  looseItems: Item[]; // For items directly on the estanteria
}
