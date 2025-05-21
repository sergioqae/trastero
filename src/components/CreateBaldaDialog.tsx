
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
import { Layers, PlusCircle } from "lucide-react";
import type { Balda } from "@/lib/types";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "El nombre de la balda es obligatorio"),
});

type CreateBaldaFormValues = z.infer<typeof formSchema>;

interface CreateBaldaDialogProps {
  estanteriaId: string;
  onCreateBalda: (estanteriaId: string, baldaData: Omit<Balda, "id" | "looseItems">) => void;
}

export function CreateBaldaDialog({ estanteriaId, onCreateBalda }: CreateBaldaDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateBaldaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateBaldaFormValues) => {
    onCreateBalda(estanteriaId, data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Layers className="mr-2 h-4 w-4" />
          Añadir Balda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nueva Balda</DialogTitle>
          <DialogDescription>
            Introduce un nombre para la nueva balda.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Balda</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Nivel Superior, Balda Izquierda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">Añadir Balda</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
