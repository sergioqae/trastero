
"use client";

import type { Box, Item } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box as BoxIcon, Trash2 } from "lucide-react";
import { ItemCard } from "./ItemCard";
import { AddItemDialog } from "./AddItemDialog";
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

interface BoxCardProps {
  box: Box;
  onAddItem: (boxId: string, itemData: Omit<Item, "id">) => void;
  onUpdateItem: (boxId: string, itemId: string, itemData: Omit<Item, "id">) => void;
  onDeleteItem: (boxId: string, itemId: string) => void;
  onDeleteBox: (boxId: string) => void;
  isFilteredView?: boolean; // To adjust display if items are filtered
}

export function BoxCard({ box, onAddItem, onUpdateItem, onDeleteItem, onDeleteBox, isFilteredView }: BoxCardProps) {
  const itemsToShow = box.items;
  const totalItemsInBoxBeforeFilter = box.items.length; // This might need to come from original box if items are pre-filtered

  return (
    <Card className="w-full shadow-lg bg-card border border-border/70">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center">
            <BoxIcon className="mr-3 h-7 w-7 text-primary" />
            {box.name}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <AddItemDialog boxId={box.id} onAddItem={onAddItem} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                   <span className="sr-only">Eliminar Caja</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente la caja "{box.name}" y todos sus objetos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteBox(box.id)}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Eliminar Caja
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <CardDescription className="pt-1">
          {isFilteredView && itemsToShow.length !== totalItemsInBoxBeforeFilter 
            ? `${itemsToShow.length} objeto(s) coincidente(s) en esta caja.`
            : `${itemsToShow.length} objeto${itemsToShow.length === 1 ? '' : 's'} en esta caja.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {itemsToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {itemsToShow.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                boxId={box.id}
                onUpdateItem={onUpdateItem}
                onDeleteItem={onDeleteItem}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            {isFilteredView ? "No hay objetos coincidentes con el filtro en esta caja." : "Esta caja está vacía. ¡Añade algunos objetos!"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

    