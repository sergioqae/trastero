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
}

export function BoxCard({ box, onAddItem, onUpdateItem, onDeleteItem, onDeleteBox }: BoxCardProps) {
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
                   <span className="sr-only">Delete Box</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the box "{box.name}" and all its items.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteBox(box.id)}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Delete Box
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <CardDescription className="pt-1">
          {box.items.length} item(s) in this box.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {box.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {box.items.map((item) => (
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
          <p className="text-muted-foreground text-center py-4">This box is empty. Add some items!</p>
        )}
      </CardContent>
    </Card>
  );
}
