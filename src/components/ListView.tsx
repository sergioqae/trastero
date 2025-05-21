
"use client";

import type { Box } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ListViewProps {
  boxes: Box[];
  isFilteredView?: boolean; // To adjust display message if items are filtered
}

export function ListView({ boxes, isFilteredView }: ListViewProps) {
  return (
    <ScrollArea className="h-[calc(100vh-300px)] pr-4">
      <div className="space-y-4">
        {boxes.map((box) => (
          <Card key={box.id} className="shadow-sm border border-border/70">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-lg font-semibold">{box.name}</CardTitle>
            </CardHeader>
            <CardContent className="py-3 px-4">
              {box.items.length > 0 ? (
                <ul className="space-y-1 list-disc list-inside pl-1">
                  {box.items.map((item) => (
                    <li key={item.id} className="text-sm text-foreground">
                      {item.name}
                      {item.description && <span className="text-muted-foreground"> ({item.description})</span>}
                      {item.borrowedTo ? (
                        <span className="text-accent ml-1 font-medium">(Prestado a: {item.borrowedTo})</span>
                      ) : (
                        <span className="text-primary ml-1 font-medium">(Disponible)</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  {isFilteredView ? "No hay objetos coincidentes con el filtro en esta caja." : "Esta caja está vacía."}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

    