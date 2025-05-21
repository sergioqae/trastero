"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit3 } from "lucide-react";
import type { Item } from "@/lib/types";
import { useState, useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, "El nombre del objeto es obligatorio"),
  description: z.string().optional(),
  borrowedTo: z.string().optional(),
});

type EditItemFormValues = z.infer<typeof formSchema>;

interface EditItemDialogProps {
  item: Item;
  boxId: string;
  onUpdateItem: (boxId: string, itemId: string, itemData: Omit<Item, "id">) => void;
}

export function EditItemDialog({ item, boxId, onUpdateItem }: EditItemDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<EditItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      description: item.description,
      borrowedTo: item.borrowedTo || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: item.name,
      description: item.description,
      borrowedTo: item.borrowedTo || "",
    });
  }, [item, form, open]);


  const onSubmit = (data: EditItemFormValues) => {
    onUpdateItem(boxId, item.id, {
      name: data.name,
      description: data.description || "",
      borrowedTo: data.borrowedTo || null,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit3 className="h-4 w-4" />
          <span className="sr-only">Editar Objeto</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Objeto</DialogTitle>
          <DialogDescription>
            Actualiza los detalles de este objeto.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Objeto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="borrowedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prestado A (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Dejar en blanco si no está prestado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
