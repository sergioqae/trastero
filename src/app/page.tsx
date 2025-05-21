
"use client";

import { useState, useMemo } from "react";
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

export default function HomePage() {
  const [boxes, setBoxes] = useLocalStorage<Box[]>("trasteroBoxes", []);
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const { toast } = useToast();

  const handleCreateBox = (boxData: Omit<Box, "id" | "items">) => {
    const newBox: Box = {
      ...boxData,
      id: crypto.randomUUID(),
      items: [],
    };
    setBoxes((prevBoxes) => [...prevBoxes, newBox]);
    toast({ title: "Caja Creada", description: `La caja "${newBox.name}" ha sido creada con éxito.` });
  };

  const handleDeleteBox = (boxId: string) => {
    const boxName = boxes.find(b => b.id === boxId)?.name || "La caja seleccionada";
    setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== boxId));
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

  const filteredBoxes = useMemo(() => {
    if (!filter) return boxes;
    const lowercasedFilter = filter.toLowerCase();
    return boxes
      .map(box => {
        const filteredItems = box.items.filter(
          item =>
            item.name.toLowerCase().includes(lowercasedFilter) ||
            item.description.toLowerCase().includes(lowercasedFilter) ||
            (item.borrowedTo && item.borrowedTo.toLowerCase().includes(lowercasedFilter))
        );
        if (box.name.toLowerCase().includes(lowercasedFilter) || filteredItems.length > 0) {
          return { ...box, items: box.name.toLowerCase().includes(lowercasedFilter) && filteredItems.length === 0 ? box.items : filteredItems };
        }
        return null; 
      })
      .filter(box => box !== null) as Box[];
  }, [boxes, filter]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yPosition = 15; // Initial Y position for text, increased margin from top
    const pageHeight = doc.internal.pageSize.height;
    const bottomMargin = 15; // Margin from bottom

    doc.setFontSize(18);
    doc.text("Inventario del Trastero", doc.internal.pageSize.width / 2, yPosition, { align: "center" });
    yPosition += 12;

    boxes.forEach((box, boxIndex) => {
      if (yPosition + 20 > pageHeight - bottomMargin) { // Check if new page is needed before box title
        doc.addPage();
        yPosition = 15;
        doc.setFontSize(18); // Re-set title font size for new page if needed, though not a title here
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
          
          const splitText = doc.splitTextToSize(itemText, doc.internal.pageSize.width - 20 - 15); // 10 for left margin, 15 for indent

          if (yPosition + (splitText.length * 6) > pageHeight - bottomMargin) { // Check before printing item
            doc.addPage();
            yPosition = 15;
          }
          doc.setFontSize(10);
          doc.text(splitText, 15, yPosition);
          yPosition += (splitText.length * 6); 
        });
      } else {
        if (yPosition + 10 > pageHeight - bottomMargin) { // Check before printing empty message
          doc.addPage();
          yPosition = 15;
        }
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text("- (Esta caja está vacía)", 15, yPosition);
        doc.setFont(undefined, 'normal');
        yPosition += 7;
      }
      yPosition += 6; // Extra space between boxes
    });

    doc.save("inventario_trastero.pdf");
    toast({
      title: "PDF Generado",
      description: "El archivo 'inventario_trastero.pdf' ha sido descargado.",
      duration: 5000,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-foreground">Mis Cajas de Trastero</h1>
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
              placeholder="Filtrar cajas u objetos por nombre, descripción o prestatario..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 w-full text-base"
            />
          </div>
        </div>

        {filteredBoxes.length > 0 ? (
          viewMode === 'card' ? (
            <div className="grid grid-cols-1 gap-8">
              {filteredBoxes.map((box) => (
                <BoxCard
                  key={box.id}
                  box={box}
                  onAddItem={handleAddItem}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                  onDeleteBox={handleDeleteBox}
                />
              ))}
            </div>
          ) : (
            <ListView boxes={filteredBoxes} />
          )
        ) : (
          <div className="text-center py-12">
            <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
              {boxes.length === 0 ? "¡Aún no hay cajas!" : "No se encontraron cajas u objetos coincidentes."}
            </h2>
            <p className="text-muted-foreground">
              {boxes.length === 0 ? "Crea tu primera caja para empezar." : "Intenta ajustar tu filtro o añade nuevos objetos."}
            </p>
            {boxes.length > 0 && filter && (
                 <Button variant="link" onClick={() => setFilter('')} className="mt-4">Limpiar filtro</Button>
            )}
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        Gestor de Trasteros &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
