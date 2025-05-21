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
import { PlusCircle } from "lucide-react";
import type { Box } from "@/lib/types";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "El nombre de la caja es obligatorio"),
});

type CreateBoxFormValues = z.infer<typeof formSchema>;

interface CreateBoxDialogProps {
  onCreateBox: (boxData: Omit<Box, "id" | "items" | "location">) => void;
}

export function CreateBoxDialog({ onCreateBox }: CreateBoxDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateBoxFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateBoxFormValues) => {
    onCreateBox(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Nueva Caja
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Caja</DialogTitle>
          <DialogDescription>
            Introduce un nombre para tu nueva caja de trastero.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Caja</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Decoración de Navidad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">Crear Caja</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
