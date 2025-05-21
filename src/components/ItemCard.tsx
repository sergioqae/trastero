"use client";

import type { Item } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, UserCheck, UserX, Package } from "lucide-react";
import { EditItemDialog } from "./EditItemDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ItemCardProps {
  item: Item;
  boxId: string; // This contextId can be boxId, estanteriaId or baldaId
  onUpdateItem: (contextId: string, itemId: string, itemData: Omit<Item, "id">) => void;
  onDeleteItem: (contextId: string, itemId: string) => void;
}

export function ItemCard({ item, boxId: contextId, onUpdateItem, onDeleteItem }: ItemCardProps) {
  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Package className="mr-2 h-5 w-5 text-primary" />
            {item.name}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <EditItemDialog item={item} boxId={contextId} onUpdateItem={onUpdateItem} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar Objeto</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el objeto "{item.name}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteItem(contextId, item.id)}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {item.description && (
          <CardDescription className="pt-1 text-sm">{item.description}</CardDescription>
        )}
      </CardHeader>
      <CardFooter>
        {item.borrowedTo ? (
          <div className="text-sm text-accent-foreground bg-accent/20 px-2 py-1 rounded-md flex items-center">
            <UserCheck className="mr-2 h-4 w-4 text-accent" />
            Prestado a: {item.borrowedTo}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground flex items-center">
            <UserX className="mr-2 h-4 w-4" />
            Disponible
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
