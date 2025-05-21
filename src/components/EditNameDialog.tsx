
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
import { Edit3 } from "lucide-react";
import { useState, useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
});

type EditNameFormValues = z.infer<typeof formSchema>;

interface EditNameDialogProps {
  currentName: string;
  itemTypeForTitle: string; // e.g., "Caja", "Estantería", "Balda"
  onSave: (newName: string) => void;
  triggerButton?: React.ReactNode;
  triggerVariant?: "ghost" | "outline" | "default" | "destructive" | "secondary" | "link" | null | undefined;
  triggerSize?: "icon" | "sm" | "default" | "lg" | null | undefined;
  triggerClassName?: string;
}

export function EditNameDialog({
  currentName,
  itemTypeForTitle,
  onSave,
  triggerButton,
  triggerVariant = "ghost",
  triggerSize = "icon",
  triggerClassName,
}: EditNameDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<EditNameFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentName,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ name: currentName });
    }
  }, [currentName, form, open]);

  const onSubmit = (data: EditNameFormValues) => {
    onSave(data.name);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton ? (
          triggerButton
        ) : (
          <Button variant={triggerVariant} size={triggerSize} className={triggerClassName}>
            <Edit3 className="h-4 w-4" />
            <span className="sr-only">Editar Nombre</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Nombre de {itemTypeForTitle}</DialogTitle>
          <DialogDescription>
            Introduce el nuevo nombre para "{currentName}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nuevo Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
