
"use client";

import type { Box } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ListViewProps {
  boxes: Box[];
  isFilteredView?: boolean;
  allItemsCount: number; // Total items across all original boxes (pre-filter)
  selectedBoxName?: string; // Name of the currently selected box, if any
}

export function ListView({ boxes, isFilteredView, allItemsCount, selectedBoxName }: ListViewProps) {
  const displayedItemsCount = boxes.reduce((acc, box) => acc + box.items.length, 0);

  let headerDescription = "";
  if (isFilteredView) {
    if (selectedBoxName) {
      const originalBox = boxes.find(b => b.name === selectedBoxName); 
      headerDescription = `Mostrando ${displayedItemsCount} objeto(s) filtrado(s) en "${selectedBoxName}".`;
    } else {
      headerDescription = `Mostrando ${displayedItemsCount} de ${allItemsCount} objeto(s) filtrado(s) en todas las cajas.`;
    }
  } else {
    if (selectedBoxName) {
      headerDescription = `Hay ${displayedItemsCount} objeto(s) en "${selectedBoxName}".`;
    } else {
      headerDescription = `Total de ${displayedItemsCount} objeto(s) en ${boxes.length} caja(s).`;
    }
  }


  return (
    <div className="space-y-4">
      {isFilteredView && (
        <CardDescription className="mb-2 px-1 text-sm text-muted-foreground">
          {headerDescription}
        </CardDescription>
      )}
      <ScrollArea className="h-[calc(100vh-360px)] pr-4"> 
        <div className="space-y-4">
          {boxes.map((box) => (
            <Card key={box.id} className="shadow-sm border border-border/70">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-lg font-semibold">{box.name}</CardTitle>
                 {isFilteredView && selectedBoxName && box.name === selectedBoxName && box.items.length === 0 && (
                  <CardDescription className="text-sm italic">No hay objetos coincidentes con el filtro en esta caja.</CardDescription>
                )}
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
                    {!isFilteredView ? "Esta caja está vacía." : (selectedBoxName && box.name === selectedBoxName ? "" : "No hay objetos coincidentes con el filtro en esta caja.")}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
    
