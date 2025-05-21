
import type { Timestamp } from 'firebase/firestore';

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
  createdAt?: Timestamp; // Opcional, para ordenar por fecha de creación si se usa Firestore
  userId?: string; // Para asociar la caja a un usuario
}
