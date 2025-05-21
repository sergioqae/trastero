
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
import { Archive, Trash2, CornerLeftUp, Edit3 } from "lucide-react";
import { ItemCard } from "./ItemCard";
import { AddItemDialog } from "./AddItemDialog";
import { EditNameDialog } from "./EditNameDialog";
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
  onUpdateBoxName: (boxId: string, newName: string) => void;
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
  onUpdateBoxName,
  onUnassignBox,
  isFilteredView,
  totalItemsInBoxOriginal,
}: BoxCardProps) {
  const itemsToShow = box.items;

  let descriptionText = `${itemsToShow.length} objeto${
    itemsToShow.length === 1 ? "" : "s"
  } en esta caja.`;
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
    ? `Ubicación: ${box.location.estanteriaName}${
        box.location.baldaName
          ? ` > ${box.location.baldaName}`
          : " (Directo en Estantería)"
      }`
    : "Sin ubicar";

  return (
    <Card className="w-full shadow-lg bg-card border border-border/70 flex flex-col">
      <CardHeader className="border-b p-4 space-y-2">
        {/* First row: Title, Edit Name, Delete Box */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            <Archive className="h-6 w-6 text-primary flex-shrink-0" />
            <CardTitle className="text-xl font-semibold leading-tight min-w-0">
              <span className="truncate block" title={box.name}>{box.name}</span>
            </CardTitle>
            <EditNameDialog
              currentName={box.name}
              itemTypeForTitle="Caja"
              onSave={(newName) => onUpdateBoxName(box.id, newName)}
            />
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon" className="flex-shrink-0">
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

        {/* Second row: Location and Add Item button */}
        <div className="flex justify-between items-center">
          <CardDescription className="text-xs text-muted-foreground truncate flex-1 mr-2" title={locationText}>
            {locationText}
          </CardDescription>
          <AddItemDialog boxId={box.id} onAddItem={onAddItem} />
        </div>
        
        {/* Item count description */}
        <CardDescription className="pt-1 text-sm">
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
            {isFilteredView && !itemsToShow.length
              ? "No hay objetos coincidentes con el filtro en esta caja."
              : "Esta caja está vacía. ¡Añade algunos objetos!"}
          </p>
        )}
      </CardContent>
      {onUnassignBox && box.location && (
        <CardFooter className="border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUnassignBox(box.id)}
          >
            <CornerLeftUp className="mr-2 h-4 w-4" /> Desasignar de Ubicación
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
