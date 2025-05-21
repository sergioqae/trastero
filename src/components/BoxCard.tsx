
"use client";

import type { Box, Item } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, Trash2, CornerLeftUp } from "lucide-react";
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
  onUnassignBox?: (boxId: string) => void;
  isFilteredView?: boolean; 
  totalItemsInBoxOriginal: number; 
}

export function BoxCard({ 
    box, 
    onAddItem, 
    onUpdateItem, 
    onDeleteItem, 
    onDeleteBox, 
    onUnassignBox,
    isFilteredView, 
    totalItemsInBoxOriginal 
}: BoxCardProps) {
  const itemsToShow = box.items;
  
  let descriptionText = `${itemsToShow.length} objeto${itemsToShow.length === 1 ? '' : 's'} en esta caja.`;
  if (isFilteredView) {
    if (itemsToShow.length !== totalItemsInBoxOriginal) {
      descriptionText = `${itemsToShow.length} de ${totalItemsInBoxOriginal} objeto(s) coincidente(s).`;
    } else if (totalItemsInBoxOriginal > 0) {
       descriptionText = `Todos los ${totalItemsInBoxOriginal} objeto(s) coinciden.`;
    } else {
       descriptionText = "Esta caja está vacía y coincide con el filtro.";
    }
  }

  const locationText = box.location
    ? `Ubicación: ${box.location.estanteriaName}${box.location.baldaName ? ` > ${box.location.baldaName}` : ' (Directo en Estantería)'}`
    : "Sin ubicar";

  return (
    <Card className="w-full shadow-lg bg-card border border-border/70 flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-2"> {/* Main flex row for header content */}
          <div className="min-w-0 flex-1 mr-2"> {/* Title block: allow to shrink and take available space */}
            <CardTitle className="text-2xl flex items-center">
              <Archive className="mr-3 h-7 w-7 text-primary flex-shrink-0" /> {/* Icon container */}
              <span className="truncate">{box.name}</span> {/* Truncate box name */}
            </CardTitle>
            <CardDescription className="pt-1 text-xs truncate"> {/* Truncate location text */}
              {locationText}
            </CardDescription>
          </div>
          {/* Actions block */}
          <div className="flex items-center space-x-2 flex-shrink-0"> {/* Ensure this block doesn't shrink */}
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
        <CardDescription className="pt-2">
          {descriptionText}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 flex-grow">
        {itemsToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {isFilteredView && !itemsToShow.length ? "No hay objetos coincidentes con el filtro en esta caja." : "Esta caja está vacía. ¡Añade algunos objetos!"}
          </p>
        )}
      </CardContent>
      { (onUnassignBox && box.location) && (
        <CardFooter className="border-t pt-4">
            <Button variant="outline" size="sm" onClick={() => onUnassignBox(box.id)}>
                <CornerLeftUp className="mr-2 h-4 w-4"/> Desasignar de Ubicación
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
