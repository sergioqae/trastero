
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
import { PackagePlus, PlusCircle } from "lucide-react";
import type { Item } from "@/lib/types";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "El nombre del objeto es obligatorio"),
  description: z.string().optional(),
  borrowedTo: z.string().optional(),
});

type AddLooseItemFormValues = z.infer<typeof formSchema>;

interface AddLooseItemDialogProps {
  estanteriaId: string;
  baldaId: string;
  onAddItem: (estanteriaId: string, baldaId: string, itemData: Omit<Item, "id">) => void;
}

export function AddLooseItemDialog({ estanteriaId, baldaId, onAddItem }: AddLooseItemDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<AddLooseItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      borrowedTo: "",
    },
  });

  const onSubmit = (data: AddLooseItemFormValues) => {
    onAddItem(estanteriaId, baldaId, {
      name: data.name,
      description: data.description || "",
      borrowedTo: data.borrowedTo || null,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PackagePlus className="mr-2 h-4 w-4" />
          Añadir Objeto Suelto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Objeto Suelto a Balda</DialogTitle>
          <DialogDescription>
            Introduce los detalles del nuevo objeto suelto.
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
                    <Input placeholder="Ej: Destornillador Estrella" {...field} />
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
                    <Textarea placeholder="Ej: Mango de goma, punta magnética" {...field} />
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
                    <Input placeholder="Ej: Vecino del 5º" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">Añadir Objeto</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
