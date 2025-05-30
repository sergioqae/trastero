
"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IterationCcw } from "lucide-react";
import type { Box } from "@/lib/types";

const formSchema = z.object({
  boxId: z.string().min(1, "Debes seleccionar una caja"),
});

type AssignBoxFormValues = z.infer<typeof formSchema>;

interface AssignBoxDialogProps {
  estanteriaId: string;
  baldaId?: string | null; 
  boxes: Box[]; 
  onAssignBox: (boxId: string, estanteriaId: string, baldaId?: string | null) => void;
  triggerText?: string;
}

export function AssignBoxDialog({ estanteriaId, baldaId, boxes, onAssignBox, triggerText = "Asignar Caja Existente" }: AssignBoxDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<AssignBoxFormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: AssignBoxFormValues) => {
    onAssignBox(data.boxId, estanteriaId, baldaId); 
    form.reset();
    setOpen(false);
  };

  const dialogTitle = baldaId ? "Asignar Caja a esta Balda" : "Asignar Caja a esta Estantería";
  const dialogDescription = baldaId 
    ? "Selecciona una caja de la lista de cajas sin ubicar para asignarla a esta balda."
    : "Selecciona una caja de la lista de cajas sin ubicar para asignarla directamente a esta estantería.";


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IterationCcw className="mr-2 h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {boxes.length > 0 ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="boxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caja a Asignar</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una caja" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {boxes.map((box) => (
                          <SelectItem key={box.id} value={box.id}>
                            {box.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit">Asignar Caja</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <p className="py-4 text-muted-foreground">No hay cajas sin ubicar disponibles para asignar.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
