
"use client";

import { useState, useMemo, useEffect } from "react";
import type { Box, Item } from "@/lib/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Header } from "@/components/layout/Header";
import { CreateBoxDialog } from "@/components/CreateBoxDialog";
import { BoxCard } from "@/components/BoxCard";
import { ListView } from "@/components/ListView";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PackageSearch, List, LayoutGrid, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Link from "next/link";

export default function HomePage() {
  const [boxes, setBoxes] = useLocalStorage<Box[]>("trasteroBoxes", []);
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleCreateBox = (boxData: Omit<Box, "id" | "items">) => {
    const newBox: Box = {
      ...boxData,
      id: crypto.randomUUID(),
      items: [],
    };
    setBoxes((prevBoxes) => [...prevBoxes, newBox]);
    toast({ title: "Caja Creada", description: `La caja "${newBox.name}" ha sido creada con éxito.` });
  };

  const handleDeleteBox = (boxIdToDelete: string) => {
    const boxName = boxes.find(b => b.id === boxIdToDelete)?.name || "La caja seleccionada";
    setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== boxIdToDelete));
    if (selectedBoxId === boxIdToDelete) {
      setSelectedBoxId(null); 
    }
    toast({ title: "Caja Eliminada", description: `La caja "${boxName}" y todos sus objetos han sido eliminados.`, variant: "destructive" });
  };

  const handleAddItem = (boxId: string, itemData: Omit<Item, "id">) => {
    const newItem: Item = { ...itemData, id: crypto.randomUUID() };
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === boxId ? { ...box, items: [...box.items, newItem] } : box
      )
    );
    toast({ title: "Objeto Añadido", description: `El objeto "${newItem.name}" ha sido añadido a la caja.` });
  };

  const handleUpdateItem = (boxId: string, itemId: string, itemData: Omit<Item, "id">) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === boxId
          ? {
              ...box,
              items: box.items.map((item) =>
                item.id === itemId ? { ...item, ...itemData } : item
              ),
            }
          : box
      )
    );
    toast({ title: "Objeto Actualizado", description: `El objeto "${itemData.name}" ha sido actualizado.` });
  };

  const handleDeleteItem = (boxId: string, itemId: string) => {
     let itemName = "El objeto seleccionado";
     const box = boxes.find(b => b.id === boxId);
     if (box) {
        const item = box.items.find(i => i.id === itemId);
        if (item) itemName = item.name;
     }
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === boxId
          ? { ...box, items: box.items.filter((item) => item.id !== itemId) }
          : box
      )
    );
    toast({ title: "Objeto Eliminado", description: `El objeto "${itemName}" ha sido eliminado.`, variant: "destructive" });
  };

  const selectedBox = useMemo(() => boxes.find(box => box.id === selectedBoxId), [boxes, selectedBoxId]);

  const boxesToDisplay = useMemo(() => {
    const lowercasedFilter = filter.trim().toLowerCase();

    let candidateBoxes = boxes;
    if (selectedBoxId) {
      const focusedBox = boxes.find(b => b.id === selectedBoxId);
      candidateBoxes = focusedBox ? [focusedBox] : [];
    }

    if (!lowercasedFilter) {
      return candidateBoxes;
    }

    return candidateBoxes
      .map(box => {
        const itemsInBox = selectedBoxId && box.id === selectedBoxId ? box.items : box.items; 
        
        const matchingItems = itemsInBox.filter(
          item =>
            item.name.toLowerCase().includes(lowercasedFilter) ||
            item.description.toLowerCase().includes(lowercasedFilter) ||
            (item.borrowedTo && item.borrowedTo.toLowerCase().includes(lowercasedFilter))
        );

        const boxNameMatches = box.name.toLowerCase().includes(lowercasedFilter);
        
        if (selectedBoxId && box.id === selectedBoxId) { 
            return matchingItems.length > 0 || boxNameMatches ? { ...box, items: matchingItems } : { ...box, items: [] } 
        }

        if (boxNameMatches || matchingItems.length > 0) {
          return {
            ...box,
            items: boxNameMatches && !selectedBoxId ? box.items : matchingItems,
          };
        }
        return null;
      })
      .filter(box => box !== null) as Box[];
  }, [boxes, filter, selectedBoxId]);


  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yPosition = 15; 
    const pageHeight = doc.internal.pageSize.height;
    const bottomMargin = 15; 

    doc.setFontSize(18);
    doc.text("Inventario del Trastero", doc.internal.pageSize.width / 2, yPosition, { align: "center" });
    yPosition += 12;

    const boxesForPdf = selectedBoxId ? boxes.filter(b => b.id === selectedBoxId) : boxes;

    boxesForPdf.forEach((box) => {
      if (yPosition + 20 > pageHeight - bottomMargin) { 
        doc.addPage();
        yPosition = 15;
        doc.setFontSize(18); 
        doc.text("Inventario del Trastero (Continuación)", doc.internal.pageSize.width / 2, yPosition, { align: "center" });
        yPosition += 12;
      }
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(`${box.name}:`, 10, yPosition);
      doc.setFont(undefined, 'normal');
      yPosition += 8;

      if (box.items.length > 0) {
        box.items.forEach(item => {
          const availability = item.borrowedTo ? `Prestado a: ${item.borrowedTo}` : 'Disponible';
          let itemText = `- ${item.name}`;
          if (item.description) {
              itemText += ` (${item.description || 'Sin descripción'})`;
          }
          itemText += ` (${availability})`;
          
          const splitText = doc.splitTextToSize(itemText, doc.internal.pageSize.width - 20 - 15); 

          if (yPosition + (splitText.length * 6) > pageHeight - bottomMargin) { 
            doc.addPage();
            yPosition = 15;
          }
          doc.setFontSize(10);
          doc.text(splitText, 15, yPosition);
          yPosition += (splitText.length * 6); 
        });
      } else {
        if (yPosition + 10 > pageHeight - bottomMargin) { 
          doc.addPage();
          yPosition = 15;
        }
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text("- (Esta caja está vacía)", 15, yPosition);
        doc.setFont(undefined, 'normal');
        yPosition += 7;
      }
      yPosition += 6; 
    });

    doc.save("inventario_trastero.pdf");
    toast({
      title: "PDF Generado",
      description: "El archivo 'inventario_trastero.pdf' ha sido descargado.",
      duration: 5000,
    });
  };
  
  const pageTitle = selectedBox ? selectedBox.name : "Mis Cajas de Trastero";
  
  let emptyStateTitle = "¡Aún no hay cajas!";
  let emptyStateDescription = "Crea tu primera caja para empezar.";

  if (boxes.length > 0) { 
    if (selectedBoxId && boxesToDisplay.length === 0 && filter) { 
      emptyStateTitle = `No se encontraron objetos en "${selectedBox?.name}"`;
      emptyStateDescription = "Intenta ajustar tu filtro.";
    } else if (!selectedBoxId && boxesToDisplay.length === 0 && filter) { 
      emptyStateTitle = "No se encontraron cajas u objetos";
      emptyStateDescription = "Intenta ajustar tu filtro o añade nuevos objetos.";
    } else if (selectedBoxId && boxesToDisplay.length > 0 && boxesToDisplay[0].items.length === 0 && !filter) { 
        emptyStateTitle = `"${selectedBox?.name}" está vacía`;
        emptyStateDescription = "Añade algunos objetos a esta caja.";
    }
  }


  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar side="left" collapsible="icon" className="border-r">
            <SidebarHeader className="p-2 flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden" onClick={() => setSelectedBoxId(null)}>
                <span className="font-semibold text-lg text-sidebar-foreground">Cajas</span>
              </Link>
              <SidebarTrigger className="hidden md:flex" /> {/* Desktop trigger */}
            </SidebarHeader>
            <AppSidebar boxes={boxes} selectedBoxId={selectedBoxId} onSelectBox={setSelectedBoxId} />
          </Sidebar>
          <SidebarInset>
            <main className="flex-1 container mx-auto py-8 px-4">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="md:hidden" /> {/* Mobile trigger */}
                  <h1 className="text-3xl font-bold text-foreground">{pageTitle}</h1>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <Button variant="outline" onClick={() => setViewMode(prev => prev === 'card' ? 'list' : 'card')}>
                    {viewMode === 'card' ? <List className="mr-2 h-4 w-4" /> : <LayoutGrid className="mr-2 h-4 w-4" />}
                    {viewMode === 'card' ? 'Ver como Lista' : 'Ver como Tarjetas'}
                  </Button>
                  <Button variant="outline" onClick={handleExportPDF}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar a PDF
                  </Button>
                  <CreateBoxDialog onCreateBox={handleCreateBox} />
                </div>
              </div>

              <div className="mb-8">
                <div className="relative">
                  <PackageSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={selectedBoxId ? `Filtrar objetos en "${selectedBox?.name}"...` : "Filtrar cajas u objetos..."}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-10 w-full text-base"
                  />
                </div>
              </div>

              {boxesToDisplay.length > 0 ? (
                viewMode === 'card' ? (
                  <div className="grid grid-cols-1 gap-8">
                    {boxesToDisplay.map((box) => (
                      <BoxCard
                        key={box.id}
                        box={box}
                        onAddItem={handleAddItem}
                        onUpdateItem={handleUpdateItem}
                        onDeleteItem={handleDeleteItem}
                        onDeleteBox={handleDeleteBox}
                        isFilteredView={!!filter && (!selectedBoxId || (selectedBoxId && box.id === selectedBoxId))}
                        totalItemsInBoxOriginal={boxes.find(b => b.id === box.id)?.items.length || 0}
                      />
                    ))}
                  </div>
                ) : (
                   <ListView 
                      boxes={boxesToDisplay} 
                      isFilteredView={!!filter} 
                      allItemsCount={boxes.reduce((acc, curr) => acc + curr.items.length, 0)}
                      selectedBoxName={selectedBox?.name}
                    />
                )
              ) : (
                <div className="text-center py-12">
                  <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
                    {emptyStateTitle}
                  </h2>
                  <p className="text-muted-foreground">
                    {emptyStateDescription}
                  </p>
                  {boxes.length > 0 && filter && (
                      <Button variant="link" onClick={() => setFilter('')} className="mt-4">Limpiar filtro</Button>
                  )}
                </div>
              )}
            </main>
          </SidebarInset>
        </div>
        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          Gestor de Trasteros &copy; {currentYear || '...'}
        </footer>
      </div>
    </SidebarProvider>
  );
}
