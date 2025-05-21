
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
import { Library, PlusCircle } from "lucide-react";
import type { Estanteria } from "@/lib/types";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "El nombre de la estantería es obligatorio"),
});

type CreateEstanteriaFormValues = z.infer<typeof formSchema>;

interface CreateEstanteriaDialogProps {
  onCreateEstanteria: (estanteriaData: Omit<Estanteria, "id" | "baldas" | "looseItems">) => void;
}

export function CreateEstanteriaDialog({ onCreateEstanteria }: CreateEstanteriaDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateEstanteriaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateEstanteriaFormValues) => {
    onCreateEstanteria(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Library className="mr-2 h-4 w-4" />
          Crear Estantería
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Estantería</DialogTitle>
          <DialogDescription>
            Introduce un nombre para tu nueva estantería.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Estantería</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Estantería Metálica Roja" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">Crear Estantería</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
