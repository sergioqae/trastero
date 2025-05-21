
export interface Item {
  id: string;
  name: string;
  description: string;
  borrowedTo?: string | null;
}

export interface BoxLocation {
  estanteriaId: string;
  estanteriaName: string; 
  baldaId?: string | null; 
  baldaName?: string | null; 
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
  looseItems: Item[]; 
}
