
export interface Item {
  id: string;
  name: string;
  description: string;
  borrowedTo?: string | null;
}

export interface BoxLocation {
  estanteriaId: string;
  baldaId: string;
  estanteriaName: string; // For display purposes
  baldaName: string;     // For display purposes
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
}
