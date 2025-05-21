
"use client";

import { useState, useMemo, useEffect } from "react";
import type { Box, Item, Estanteria, Balda } from "@/lib/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Header } from "@/components/layout/Header";
import { CreateBoxDialog } from "@/components/CreateBoxDialog";
import { BoxCard } from "@/components/BoxCard";
import { ListView } from "@/components/ListView";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PackageSearch, List, LayoutGrid, FileDown, Library, Layers, PlusCircle, ArchiveRestore, Rows3, PackagePlus, IterationCcw, CornerRightDown, Package, Trash2, Server, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar, type SidebarSelection } from "@/components/layout/AppSidebar";
import { CreateEstanteriaDialog } from "@/components/CreateEstanteriaDialog";
import { CreateBaldaDialog } from "@/components/CreateBaldaDialog";
import { AddLooseItemDialog } from "@/components/AddLooseItemDialog";
import { AddLooseItemToEstanteriaDialog } from "@/components/AddLooseItemToEstanteriaDialog";
import { AssignBoxDialog } from "@/components/AssignBoxDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemCard } from "@/components/ItemCard";
import { EditItemDialog } from "@/components/EditItemDialog";
import { EditNameDialog } from "@/components/EditNameDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HomePage() {
  const [boxes, setBoxes] = useLocalStorage<Box[]>("trastero-app-boxes", []);
  const [estanterias, setEstanterias] = useLocalStorage<Estanteria[]>("trastero-app-estanterias", []);
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [currentYear, setCurrentYear] = useState<string | null>(null);
  const { toast } = useToast();

  const [sidebarSelection, setSidebarSelection] = useState<SidebarSelection>({ type: 'all-estanterias' });

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  // --- ESTANTERIA Management ---
  const handleCreateEstanteria = (estanteriaData: Omit<Estanteria, "id" | "baldas" | "looseItems">) => {
    const newEstanteria: Estanteria = { ...estanteriaData, id: crypto.randomUUID(), baldas: [], looseItems: [] };
    setEstanterias(prev => [...prev, newEstanteria].sort((a,b) => a.name.localeCompare(b.name)));
    toast({ title: "Estantería Creada", description: `La estantería "${newEstanteria.name}" ha sido creada.` });
  };

  const handleUpdateEstanteriaName = (estanteriaId: string, newName: string) => {
    const oldEstanteria = estanterias.find(e => e.id === estanteriaId);
    if (!oldEstanteria) return;

    setEstanterias(prev => 
      prev.map(e => 
        e.id === estanteriaId ? { ...e, name: newName } : e
      ).sort((a,b) => a.name.localeCompare(b.name))
    );
    setBoxes(prevBoxes => 
      prevBoxes.map(b => 
        b.location?.estanteriaId === estanteriaId ? { ...b, location: { ...b.location, estanteriaName: newName } } : b
      )
    );
    if (sidebarSelection.type === 'estanteria' && sidebarSelection.id === estanteriaId) {
      setSidebarSelection(prev => ({ ...prev, name: newName }));
    } else if (sidebarSelection.type === 'balda' && sidebarSelection.estanteriaId === estanteriaId) {
       // If a balda of this estanteria is selected, its title will update via selectedEstanteria dependency
    }
    toast({ title: "Estantería Actualizada", description: `Nombre cambiado a "${newName}".` });
  };

  const handleDeleteEstanteria = (estanteriaIdToDelete: string) => {
    const estanteria = estanterias.find(e => e.id === estanteriaIdToDelete);
    if (!estanteria) return;

    const updatedBoxes = boxes.map(box => {
      if (box.location?.estanteriaId === estanteriaIdToDelete) {
        return { ...box, location: null }; 
      }
      return box;
    });
    setBoxes(updatedBoxes);

    setEstanterias(prev => prev.filter(e => e.id !== estanteriaIdToDelete));
    if (sidebarSelection.type === 'estanteria' && sidebarSelection.id === estanteriaIdToDelete) {
      setSidebarSelection({ type: 'all-estanterias' });
    } else if (sidebarSelection.type === 'balda' && sidebarSelection.estanteriaId === estanteriaIdToDelete) {
      setSidebarSelection({ type: 'all-estanterias' });
    }
    toast({ title: "Estantería Eliminada", description: `La estantería "${estanteria.name}" y todo su contenido han sido eliminados.`, variant: "destructive" });
  };

  // --- LOOSE ITEM Management on Estanteria ---
  const handleAddLooseItemToEstanteria = (estanteriaId: string, itemData: Omit<Item, "id">) => {
    const newItem: Item = { ...itemData, id: crypto.randomUUID() };
    setEstanterias(prevEstanterias =>
      prevEstanterias.map(est =>
        est.id === estanteriaId
          ? { ...est, looseItems: [...(est.looseItems || []), newItem].sort((a,b)=>a.name.localeCompare(b.name)) }
          : est
      )
    );
    toast({ title: "Objeto Añadido a Estantería", description: `El objeto "${newItem.name}" ha sido añadido.` });
  };

  const handleUpdateLooseItemOnEstanteria = (estanteriaId: string, itemId: string, itemData: Omit<Item, "id">) => {
    setEstanterias(prevEstanterias =>
        prevEstanterias.map(est => 
            est.id === estanteriaId 
            ? {
                ...est,
                looseItems: (est.looseItems || []).map(item => 
                    item.id === itemId ? { ...item, ...itemData } : item
                ).sort((a,b)=>a.name.localeCompare(b.name))
              }
            : est
        )
    );
    toast({ title: "Objeto de Estantería Actualizado", description: `El objeto "${itemData.name}" ha sido actualizado.` });
  };
  
  const handleDeleteLooseItemFromEstanteria = (estanteriaId: string, itemId: string) => {
    let itemName = "El objeto seleccionado";
    const est = estanterias.find(e => e.id === estanteriaId);
    if (est) {
        const item = (est.looseItems || []).find(i => i.id === itemId);
        if (item) itemName = item.name;
    }
    setEstanterias(prevEstanterias =>
      prevEstanterias.map(est =>
        est.id === estanteriaId
          ? { ...est, looseItems: (est.looseItems || []).filter(item => item.id !== itemId) }
          : est
      )
    );
    toast({ title: "Objeto Eliminado de Estantería", description: `El objeto "${itemName}" ha sido eliminado.`, variant: "destructive" });
  };


  // --- BALDA Management ---
  const handleCreateBalda = (estanteriaId: string, baldaData: Omit<Balda, "id" | "looseItems">) => {
    const newBalda: Balda = { ...baldaData, id: crypto.randomUUID(), looseItems: [] };
    setEstanterias(prevEstanterias =>
      prevEstanterias.map(est =>
        est.id === estanteriaId
          ? { ...est, baldas: [...(est.baldas || []), newBalda].sort((a,b) => a.name.localeCompare(b.name)) }
          : est
      )
    );
    toast({ title: "Balda Creada", description: `La balda "${newBalda.name}" ha sido añadida.` });
  };

  const handleUpdateBaldaName = (estanteriaId: string, baldaId: string, newName: string) => {
    const estanteria = estanterias.find(e => e.id === estanteriaId);
    if (!estanteria) return;
    const oldBalda = (estanteria.baldas || []).find(b => b.id === baldaId);
    if (!oldBalda) return;

    setEstanterias(prev => 
        prev.map(est => 
            est.id === estanteriaId 
            ? { ...est, baldas: (est.baldas || []).map(b => b.id === baldaId ? { ...b, name: newName } : b).sort((a,b) => a.name.localeCompare(b.name)) } 
            : est
        )
    );
    setBoxes(prevBoxes => 
      prevBoxes.map(b => 
        (b.location?.estanteriaId === estanteriaId && b.location?.baldaId === baldaId) 
        ? { ...b, location: { ...b.location, baldaName: newName } } 
        : b
      )
    );
    if (sidebarSelection.type === 'balda' && sidebarSelection.id === baldaId) {
      setSidebarSelection(prev => ({ ...prev, name: newName }));
    }
    toast({ title: "Balda Actualizada", description: `Nombre cambiado a "${newName}".` });
  };

  const handleDeleteBalda = (estanteriaId: string, baldaIdToDelete: string) => {
    const estanteria = estanterias.find(e => e.id === estanteriaId);
    const balda = (estanteria?.baldas || []).find(b => b.id === baldaIdToDelete);
    if (!balda || !estanteria) return;

    const updatedBoxes = boxes.map(box => {
      if (box.location?.estanteriaId === estanteriaId && box.location?.baldaId === baldaIdToDelete) {
        return { ...box, location: null };
      }
      return box;
    });
    setBoxes(updatedBoxes);
    
    setEstanterias(prevEstanterias =>
      prevEstanterias.map(est =>
        est.id === estanteriaId
          ? { ...est, baldas: (est.baldas || []).filter(b => b.id !== baldaIdToDelete) }
          : est
      )
    );
    if (sidebarSelection.type === 'balda' && sidebarSelection.id === baldaIdToDelete) {
      setSidebarSelection({ type: 'estanteria', id: estanteriaId, name: estanteria.name, estanteriaId: estanteria.id });
    }
    toast({ title: "Balda Eliminada", description: `La balda "${balda.name}" ha sido eliminada.`, variant: "destructive" });
  };

  // --- LOOSE ITEM Management on Balda ---
  const handleAddLooseItemToBalda = (estanteriaId: string, baldaId: string, itemData: Omit<Item, "id">) => {
    const newItem: Item = { ...itemData, id: crypto.randomUUID() };
    setEstanterias(prevEstanterias =>
      prevEstanterias.map(est =>
        est.id === estanteriaId
          ? {
              ...est,
              baldas: (est.baldas || []).map(balda =>
                balda.id === baldaId
                  ? { ...balda, looseItems: [...(balda.looseItems || []), newItem].sort((a,b)=>a.name.localeCompare(b.name)) }
                  : balda
              ),
            }
          : est
      )
    );
    toast({ title: "Objeto Añadido a Balda", description: `El objeto "${newItem.name}" ha sido añadido.` });
  };

  const handleUpdateLooseItemOnBalda = (estanteriaId: string, baldaId: string, itemId: string, itemData: Omit<Item, "id">) => {
    setEstanterias(prevEstanterias =>
        prevEstanterias.map(est => 
            est.id === estanteriaId 
            ? {
                ...est,
                baldas: (est.baldas || []).map(balda => 
                    balda.id === baldaId
                    ? {
                        ...balda,
                        looseItems: (balda.looseItems || []).map(item => 
                            item.id === itemId ? { ...item, ...itemData } : item
                        ).sort((a,b)=>a.name.localeCompare(b.name))
                      }
                    : balda
                )
              }
            : est
        )
    );
    toast({ title: "Objeto de Balda Actualizado", description: `El objeto "${itemData.name}" ha sido actualizado.` });
  };

  const handleDeleteLooseItemFromBalda = (estanteriaId: string, baldaId: string, itemId: string) => {
    let itemName = "El objeto seleccionado";
    const est = estanterias.find(e => e.id === estanteriaId);
    const balda = (est?.baldas || []).find(b => b.id === baldaId);
    if (balda) {
        const item = (balda.looseItems || []).find(i => i.id === itemId);
        if (item) itemName = item.name;
    }
    setEstanterias(prevEstanterias =>
      prevEstanterias.map(est =>
        est.id === estanteriaId
          ? {
              ...est,
              baldas: (est.baldas || []).map(balda =>
                balda.id === baldaId
                  ? { ...balda, looseItems: (balda.looseItems || []).filter(item => item.id !== itemId) }
                  : balda
              ),
            }
          : est
      )
    );
    toast({ title: "Objeto Eliminado de Balda", description: `El objeto "${itemName}" ha sido eliminado.`, variant: "destructive" });
  };

  // --- BOX Management (Create, Delete, Item in Box) ---
  const handleCreateBox = (boxData: Omit<Box, "id" | "items" | "location">) => {
    const newBox: Box = { ...boxData, id: crypto.randomUUID(), items: [], location: null };
    setBoxes(prevBoxes => [newBox, ...prevBoxes].sort((a, b) => a.name.localeCompare(b.name)));
    toast({ title: "Caja Creada", description: `La caja "${newBox.name}" ha sido creada.` });
  };

  const handleUpdateBoxName = (boxId: string, newName: string) => {
    setBoxes(prev => 
      prev.map(b => 
        b.id === boxId ? { ...b, name: newName } : b
      ).sort((a,b) => a.name.localeCompare(b.name))
    );
    if (sidebarSelection.type === 'box' && sidebarSelection.id === boxId) {
      setSidebarSelection(prev => ({ ...prev, name: newName }));
    }
    toast({ title: "Caja Actualizada", description: `Nombre cambiado a "${newName}".` });
  };

  const handleDeleteBox = (boxIdToDelete: string) => {
    const boxName = boxes.find(b => b.id === boxIdToDelete)?.name || "La caja seleccionada";
    setBoxes(prevBoxes => prevBoxes.filter(box => box.id !== boxIdToDelete));
    if (sidebarSelection.type === 'box' && sidebarSelection.id === boxIdToDelete) {
      setSidebarSelection({ type: 'all-boxes' });
    }
    toast({ title: "Caja Eliminada", description: `La caja "${boxName}" y todos sus objetos han sido eliminados.`, variant: "destructive" });
  };

  const handleAddItemToBox = (boxId: string, itemData: Omit<Item, "id">) => {
    const newItem: Item = { ...itemData, id: crypto.randomUUID() };
    setBoxes(prevBoxes =>
      prevBoxes.map(box =>
        box.id === boxId ? { ...box, items: [...box.items, newItem].sort((a,b)=>a.name.localeCompare(b.name)) } : box
      )
    );
    toast({ title: "Objeto Añadido a Caja", description: `El objeto "${newItem.name}" ha sido añadido.` });
  };
  
  const handleUpdateItemInBox = (boxId: string, itemId: string, itemData: Omit<Item, "id">) => {
    setBoxes(prevBoxes =>
      prevBoxes.map(box =>
        box.id === boxId
          ? { ...box, items: box.items.map(item => item.id === itemId ? { ...item, ...itemData } : item).sort((a,b)=>a.name.localeCompare(b.name)) }
          : box
      )
    );
    toast({ title: "Objeto de Caja Actualizado", description: `El objeto "${itemData.name}" ha sido actualizado.` });
  };

  const handleDeleteItemFromBox = (boxId: string, itemId: string) => {
    let itemName = "El objeto seleccionado";
    const box = boxes.find(b => b.id === boxId);
    if (box) {
        const item = box.items.find(i => i.id === itemId);
        if (item) itemName = item.name;
    }
    setBoxes(prevBoxes =>
      prevBoxes.map(b =>
        b.id === boxId ? { ...b, items: b.items.filter(i => i.id !== itemId) } : b
      )
    );
    toast({ title: "Objeto de Caja Eliminado", description: `El objeto "${itemName}" ha sido eliminado.`, variant: "destructive" });
  };

  // --- BOX Assignment to Location (Estanteria or Balda) ---
  const handleAssignBoxToLocation = (boxId: string, estanteriaId: string, baldaId?: string | null) => {
    const estanteria = estanterias.find(e => e.id === estanteriaId);
    if (!estanteria) {
        toast({ title: "Error", description: "Estantería no encontrada.", variant: "destructive"});
        return;
    }
    const boxToAssign = boxes.find(b => b.id === boxId);
    if (!boxToAssign) {
        toast({ title: "Error", description: "Caja no encontrada.", variant: "destructive"});
        return;
    }

    let locationData: Box["location"];
    let locationDescription: string;

    if (baldaId) {
      const balda = (estanteria.baldas || []).find(b => b.id === baldaId);
      if (!balda) {
        toast({ title: "Error", description: "Balda no encontrada.", variant: "destructive"});
        return;
      }
      locationData = { estanteriaId, baldaId, estanteriaName: estanteria.name, baldaName: balda.name };
      locationDescription = `${estanteria.name} > ${balda.name}`;
    } else {
      locationData = { estanteriaId, estanteriaName: estanteria.name, baldaId: null, baldaName: null };
      locationDescription = `${estanteria.name} (directo)`;
    }

    setBoxes(prevBoxes =>
      prevBoxes.map(box =>
        box.id === boxId ? { ...box, location: locationData } : box
      )
    );
    toast({ title: "Caja Asignada", description: `La caja "${boxToAssign.name}" ha sido asignada a ${locationDescription}.` });
  };

  const handleUnassignBox = (boxId: string) => {
    const boxToUnassign = boxes.find(b => b.id === boxId);
    if (!boxToUnassign) return;

    setBoxes(prevBoxes =>
      prevBoxes.map(box => (box.id === boxId ? { ...box, location: null } : box))
    );
    toast({ title: "Caja Desasignada", description: `La caja "${boxToUnassign.name}" ahora está sin ubicar.` });
  };


  const sortedEstanterias = useMemo(() => {
    return [...estanterias].sort((a, b) => a.name.localeCompare(b.name));
  }, [estanterias]);

  const sortedBoxes = useMemo(() => {
    return [...boxes].sort((a, b) => a.name.localeCompare(b.name));
  }, [boxes]);

  const unassignedBoxes = useMemo(() => {
    return sortedBoxes.filter(box => !box.location);
  }, [sortedBoxes]);
  
  const selectedEstanteria = useMemo(() => {
    if (sidebarSelection.type === 'estanteria' || sidebarSelection.type === 'balda') {
      return sortedEstanterias.find(e => e.id === sidebarSelection.estanteriaId);
    }
    return null;
  }, [sortedEstanterias, sidebarSelection]);

  const selectedBalda = useMemo(() => {
    if (sidebarSelection.type === 'balda' && selectedEstanteria) {
      return (selectedEstanteria.baldas || []).find(b => b.id === sidebarSelection.id);
    }
    return null;
  }, [selectedEstanteria, sidebarSelection]);

  const boxesOnSelectedBalda = useMemo(() => {
    if (selectedBalda && selectedEstanteria) {
      return sortedBoxes.filter(box => 
        box.location?.estanteriaId === selectedEstanteria.id && 
        box.location?.baldaId === selectedBalda.id
      );
    }
    return [];
  }, [sortedBoxes, selectedBalda, selectedEstanteria]);

  const boxesOnSelectedEstanteriaDirectly = useMemo(() => {
    if (selectedEstanteria) {
      return sortedBoxes.filter(box =>
        box.location?.estanteriaId === selectedEstanteria.id && !box.location?.baldaId
      );
    }
    return [];
  }, [sortedBoxes, selectedEstanteria]);


  // Filtering logic for display
  const filteredEstanterias = useMemo(() => {
    if (!filter) return sortedEstanterias;
    const lowerFilter = filter.toLowerCase();
    return sortedEstanterias.filter(e => 
      e.name.toLowerCase().includes(lowerFilter) ||
      (e.looseItems || []).some(item => item.name.toLowerCase().includes(lowerFilter) || item.description?.toLowerCase().includes(lowerFilter)) ||
      (e.baldas || []).some(b => 
        b.name.toLowerCase().includes(lowerFilter) || 
        (b.looseItems || []).some(item => item.name.toLowerCase().includes(lowerFilter) || item.description?.toLowerCase().includes(lowerFilter)) ||
        sortedBoxes.some(box => box.location?.baldaId === b.id && (box.name.toLowerCase().includes(lowerFilter) || box.items.some(item => item.name.toLowerCase().includes(lowerFilter) || item.description?.toLowerCase().includes(lowerFilter))))
      ) ||
      sortedBoxes.some(box => box.location?.estanteriaId === e.id && !box.location?.baldaId && (box.name.toLowerCase().includes(lowerFilter) || box.items.some(item => item.name.toLowerCase().includes(lowerFilter) || item.description?.toLowerCase().includes(lowerFilter))))
    );
  }, [sortedEstanterias, filter, sortedBoxes]);

  const filteredUnassignedBoxes = useMemo(() => {
    if (!filter) return unassignedBoxes;
    const lowerFilter = filter.toLowerCase();
    return unassignedBoxes.filter(box => 
      box.name.toLowerCase().includes(lowerFilter) ||
      box.items.some(item => item.name.toLowerCase().includes(lowerFilter) || item.description?.toLowerCase().includes(lowerFilter))
    );
  }, [unassignedBoxes, filter]);
  
  const filteredBaldasInSelectedEstanteria = useMemo(() => {
    if (!selectedEstanteria) return [];
    const baldas = (selectedEstanteria.baldas || []).sort((a,b) => a.name.localeCompare(b.name));
    if (!filter) return baldas;
    const lowerFilter = filter.toLowerCase();
    return baldas.filter(b => 
      b.name.toLowerCase().includes(lowerFilter) ||
      (b.looseItems || []).some(item => item.name.toLowerCase().includes(lowerFilter) || item.description?.toLowerCase().includes(lowerFilter)) ||
      boxesOnSelectedBalda.filter(box => box.location?.baldaId === b.id).some(box => box.name.toLowerCase().includes(lowerFilter) || box.items.some(item => item.name.toLowerCase().includes(lowerFilter) || item.description?.toLowerCase().includes(lowerFilter)))
    );
  }, [selectedEstanteria, filter, boxesOnSelectedBalda]);

  const filteredLooseItemsOnSelectedBalda = useMemo(() => {
    if (!selectedBalda) return [];
    const items = (selectedBalda.looseItems || []).sort((a,b) => a.name.localeCompare(b.name));
    if (!filter) return items;
    const lowerFilter = filter.toLowerCase();
    return items.filter(item => item.name.toLowerCase().includes(lowerFilter) || item.description?.toLowerCase().includes(lowerFilter));
  }, [selectedBalda, filter]);

  const filteredBoxesOnSelectedBalda = useMemo(() => {
    const items = boxesOnSelectedBalda.sort((a,b) => a.name.localeCompare(b.name));
    if (!filter) return items;
    const lowerFilter = filter.toLowerCase();
    return items.filter(box => 
        box.name.toLowerCase().includes(lowerFilter) ||
        box.items.some(item => item.name.toLowerCase().includes(lowerFilter) || item.description?.toLowerCase().includes(lowerFilter))
    );
  }, [boxesOnSelectedBalda, filter]);

  const filteredLooseItemsOnSelectedEstanteria = useMemo(() => {
    if (!selectedEstanteria) return [];
    const items = (selectedEstanteria.looseItems || []).sort((a,b) => a.name.localeCompare(b.name));
    if (!filter) return items;
    const lowerFilter = filter.toLowerCase();
    return items.filter(item => item.name.toLowerCase().includes(lowerFilter) || item.description?.toLowerCase().includes(lowerFilter));
  },[selectedEstanteria, filter]);

  const filteredBoxesOnSelectedEstanteriaDirectly = useMemo(() => {
    const items = boxesOnSelectedEstanteriaDirectly.sort((a,b) => a.name.localeCompare(b.name));
    if (!filter) return items;
    const lowerFilter = filter.toLowerCase();
    return items.filter(box => 
        box.name.toLowerCase().includes(lowerFilter) ||
        box.items.some(item => item.name.toLowerCase().includes(lowerFilter) || item.description?.toLowerCase().includes(lowerFilter))
    );
  }, [boxesOnSelectedEstanteriaDirectly, filter]);


  const allBoxesFiltered = useMemo(() => {
     if (!filter) return sortedBoxes;
    const lowerFilter = filter.toLowerCase();
    return sortedBoxes.filter(box => 
      box.name.toLowerCase().includes(lowerFilter) ||
      box.items.some(item => item.name.toLowerCase().includes(lowerFilter) || item.description?.toLowerCase().includes(lowerFilter))
    );
  }, [sortedBoxes, filter]);


  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yPosition = 15;
    const pageHeight = doc.internal.pageSize.height;
    const bottomMargin = 15;

    doc.setFontSize(18);
    doc.text("Inventario Completo del Trastero", doc.internal.pageSize.width / 2, yPosition, { align: "center" });
    yPosition += 12;

    if (sortedEstanterias.length > 0) {
      doc.setFontSize(16);
      doc.text("Estanterías:", 10, yPosition);
      yPosition += 8;
      sortedEstanterias.forEach(est => {
        if (yPosition > pageHeight - bottomMargin - 30) { doc.addPage(); yPosition = 15; }
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Estantería: ${est.name}`, 15, yPosition);
        yPosition += 7;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        // Loose items on Estanteria
        const estLooseItems = est.looseItems || [];
        if (estLooseItems.length > 0) {
          doc.setFont(undefined, 'bold');
          doc.text("  Objetos Sueltos (en Estantería):", 20, yPosition); yPosition += 5;
          doc.setFont(undefined, 'normal');
          estLooseItems.forEach(item => {
            if (yPosition > pageHeight - bottomMargin - 10) { doc.addPage(); yPosition = 15; }
            doc.text(`    - ${item.name}${item.description ? ` (${item.description})` : ''} ${item.borrowedTo ? `(Prestado a: ${item.borrowedTo})` : '(Disponible)'}`, 25, yPosition);
            yPosition += 5;
          });
        }
        // Boxes directly on Estanteria
        const boxesDirectlyOnEstanteria = sortedBoxes.filter(box => box.location?.estanteriaId === est.id && !box.location?.baldaId);
        if (boxesDirectlyOnEstanteria.length > 0) {
          doc.setFont(undefined, 'bold');
          doc.text("  Cajas (en Estantería):", 20, yPosition); yPosition += 5;
          doc.setFont(undefined, 'normal');
          boxesDirectlyOnEstanteria.forEach(box => {
            if (yPosition > pageHeight - bottomMargin - 10) { doc.addPage(); yPosition = 15; }
            doc.text(`    Caja: ${box.name}`, 25, yPosition); yPosition += 5;
            box.items.forEach(item => {
              if (yPosition > pageHeight - bottomMargin - 10) { doc.addPage(); yPosition = 15; }
              doc.text(`      - ${item.name}${item.description ? ` (${item.description})` : ''} ${item.borrowedTo ? `(Prestado a: ${item.borrowedTo})` : '(Disponible)'}`, 30, yPosition);
              yPosition += 5;
            });
            if (box.items.length === 0) {
                doc.setFont(undefined, 'italic');
                doc.text(`      (Esta caja está vacía)`, 30, yPosition); yPosition += 5;
                doc.setFont(undefined, 'normal');
            }
          });
        }

        // Baldas
        const estBaldas = est.baldas || [];
        if (estBaldas.length > 0) {
          doc.setFont(undefined, 'bold');
          doc.text("  Baldas:", 20, yPosition); yPosition += 5;
          doc.setFont(undefined, 'normal');
          estBaldas.forEach(balda => {
            if (yPosition > pageHeight - bottomMargin - 20) { doc.addPage(); yPosition = 15; }
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`    Balda: ${balda.name}`, 25, yPosition);
            yPosition += 6;
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            const baldaLooseItems = balda.looseItems || [];
            if (baldaLooseItems.length > 0) {
              doc.text("      Objetos Sueltos (en Balda):", 30, yPosition); yPosition += 5;
              baldaLooseItems.forEach(item => {
                if (yPosition > pageHeight - bottomMargin - 10) { doc.addPage(); yPosition = 15; }
                doc.text(`        - ${item.name}${item.description ? ` (${item.description})` : ''} ${item.borrowedTo ? `(Prestado a: ${item.borrowedTo})` : '(Disponible)'}`, 35, yPosition);
                yPosition += 5;
              });
            }
            const boxesOnThisBalda = sortedBoxes.filter(box => box.location?.estanteriaId === est.id && box.location?.baldaId === balda.id);
            if (boxesOnThisBalda.length > 0) {
              doc.text("      Cajas (en Balda):", 30, yPosition); yPosition += 5;
              boxesOnThisBalda.forEach(box => {
                if (yPosition > pageHeight - bottomMargin - 10) { doc.addPage(); yPosition = 15; }
                doc.text(`        Caja: ${box.name}`, 35, yPosition); yPosition += 5;
                box.items.forEach(item => {
                  if (yPosition > pageHeight - bottomMargin - 10) { doc.addPage(); yPosition = 15; }
                  doc.text(`          - ${item.name}${item.description ? ` (${item.description})` : ''} ${item.borrowedTo ? `(Prestado a: ${item.borrowedTo})` : '(Disponible)'}`, 40, yPosition);
                  yPosition += 5;
                });
                 if (box.items.length === 0) {
                    doc.setFont(undefined, 'italic');
                    doc.text(`          (Esta caja está vacía)`, 40, yPosition); yPosition += 5;
                    doc.setFont(undefined, 'normal');
                }
              });
            }
            if (baldaLooseItems.length === 0 && boxesOnThisBalda.length === 0) {
              doc.setFont(undefined, 'italic');
              doc.text("      (Esta balda está vacía)", 30, yPosition); yPosition += 5;
              doc.setFont(undefined, 'normal');
            }
          });
        }
         if (estLooseItems.length === 0 && boxesDirectlyOnEstanteria.length === 0 && estBaldas.length === 0) {
            doc.setFont(undefined, 'italic');
            doc.text("  (Esta estantería está vacía)", 20, yPosition); yPosition += 5;
            doc.setFont(undefined, 'normal');
        }
        yPosition += 5; // Extra space between estanterias
      });
    } else {
      doc.setFontSize(12);
      doc.setFont(undefined, 'italic');
      doc.text("No hay estanterías definidas.", 15, yPosition);
      yPosition += 7;
      doc.setFont(undefined, 'normal');
    }
    
    yPosition += 7;
    if (yPosition > pageHeight - bottomMargin - 20) { doc.addPage(); yPosition = 15; }

    if (unassignedBoxes.length > 0) {
        doc.setFontSize(16);
        doc.text("Cajas Sin Ubicar:", 10, yPosition);
        yPosition += 8;
        unassignedBoxes.forEach(box => {
            if (yPosition > pageHeight - bottomMargin - 20) { doc.addPage(); yPosition = 15; }
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`Caja: ${box.name}`, 15, yPosition);
            yPosition += 7;
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            if (box.items.length > 0) {
                box.items.forEach(item => {
                    if (yPosition > pageHeight - bottomMargin - 10) { doc.addPage(); yPosition = 15; }
                    doc.text(`  - ${item.name}${item.description ? ` (${item.description})` : ''} ${item.borrowedTo ? `(Prestado a: ${item.borrowedTo})` : '(Disponible)'}`, 20, yPosition);
                    yPosition += 5;
                });
            } else {
                doc.setFont(undefined, 'italic');
                doc.text("  (Esta caja está vacía)", 20, yPosition); yPosition += 5;
                doc.setFont(undefined, 'normal');
            }
            yPosition += 5;
        });
    } else {
        doc.setFontSize(12);
        doc.setFont(undefined, 'italic');
        doc.text("No hay cajas sin ubicar.", 15, yPosition);
        yPosition += 7;
        doc.setFont(undefined, 'normal');
    }

    doc.save("inventario_trastero_completo.pdf");
    toast({ title: "PDF Generado", description: "El inventario completo ha sido descargado.", duration: 5000 });
  };

  let pageTitle = "Mi Trastero";
  if (sidebarSelection.type === 'estanteria' && selectedEstanteria) pageTitle = selectedEstanteria.name;
  else if (sidebarSelection.type === 'balda' && selectedBalda && selectedEstanteria) pageTitle = `${selectedEstanteria.name} > ${selectedBalda.name}`;
  else if (sidebarSelection.type === 'box' && sortedBoxes.find(b => b.id === sidebarSelection.id)) pageTitle = sortedBoxes.find(b => b.id === sidebarSelection.id)!.name;
  else if (sidebarSelection.type === 'all-boxes') pageTitle = "Todas las Cajas";
  else if (sidebarSelection.type === 'unassigned-boxes') pageTitle = "Cajas sin Ubicar";
  else if (sidebarSelection.type === 'all-estanterias') pageTitle = "Todas las Estanterías";


  const renderContent = () => {
    if (sidebarSelection.type === 'box') {
      const box = sortedBoxes.find(b => b.id === sidebarSelection.id);
      if (!box) return <p>Caja no encontrada.</p>;
      return (
        <BoxCard
          key={box.id}
          box={box}
          onAddItem={handleAddItemToBox}
          onUpdateItem={handleUpdateItemInBox}
          onDeleteItem={handleDeleteItemFromBox}
          onDeleteBox={handleDeleteBox}
          onUpdateBoxName={handleUpdateBoxName}
          onUnassignBox={handleUnassignBox}
          totalItemsInBoxOriginal={boxes.find(b=>b.id === box.id)?.items.length || 0}
        />
      );
    }

    if (sidebarSelection.type === 'all-boxes') {
      return (
        <>
          {allBoxesFiltered.length > 0 ? (
             viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allBoxesFiltered.map(box => (
                    <BoxCard
                    key={box.id}
                    box={box}
                    onAddItem={handleAddItemToBox}
                    onUpdateItem={handleUpdateItemInBox}
                    onDeleteItem={handleDeleteItemFromBox}
                    onDeleteBox={handleDeleteBox}
                    onUpdateBoxName={handleUpdateBoxName}
                    onUnassignBox={handleUnassignBox}
                    totalItemsInBoxOriginal={boxes.find(b=>b.id === box.id)?.items.length || 0}
                    />
                ))}
                </div>
             ) : (
                <ListView boxes={allBoxesFiltered} isFilteredView={!!filter} allItemsCount={boxes.reduce((acc, curr) => acc + curr.items.length, 0)} />
             )
          ) : (
            <div className="text-center py-12">
              <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold text-muted-foreground mb-2">No hay cajas</h2>
              <p className="text-muted-foreground">Crea tu primera caja.</p>
              {filter && <Button variant="link" onClick={() => setFilter('')} className="mt-4">Limpiar filtro</Button>}
            </div>
          )}
        </>
      );
    }
    
    if (sidebarSelection.type === 'unassigned-boxes') {
       return (
        <>
          {filteredUnassignedBoxes.length > 0 ? (
             viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUnassignedBoxes.map(box => (
                    <BoxCard
                    key={box.id}
                    box={box}
                    onAddItem={handleAddItemToBox}
                    onUpdateItem={handleUpdateItemInBox}
                    onDeleteItem={handleDeleteItemFromBox}
                    onDeleteBox={handleDeleteBox}
                    onUpdateBoxName={handleUpdateBoxName}
                    onUnassignBox={handleUnassignBox}
                    totalItemsInBoxOriginal={boxes.find(b=>b.id === box.id)?.items.length || 0}
                    />
                ))}
                </div>
             ) : (
                 <ListView boxes={filteredUnassignedBoxes} isFilteredView={!!filter} allItemsCount={unassignedBoxes.length} />
             )
          ) : (
            <div className="text-center py-12">
              <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold text-muted-foreground mb-2">No hay cajas sin ubicar</h2>
              <p className="text-muted-foreground">{filter ? "Prueba a cambiar el filtro." : "Todas tus cajas están ubicadas o no tienes cajas."}</p>
              {filter && <Button variant="link" onClick={() => setFilter('')} className="mt-4">Limpiar filtro</Button>}
            </div>
          )}
        </>
      );
    }

    if (sidebarSelection.type === 'balda' && selectedEstanteria && selectedBalda) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span>Contenido de Balda: {selectedBalda.name}</span>
                    <EditNameDialog
                        currentName={selectedBalda.name}
                        itemTypeForTitle="Balda"
                        onSave={(newName) => handleUpdateBaldaName(selectedEstanteria.id, selectedBalda.id, newName)}
                    />
                </div>
              <div className="flex gap-2">
                 <AddLooseItemDialog estanteriaId={selectedEstanteria.id} baldaId={selectedBalda.id} onAddItem={handleAddLooseItemToBalda} />
                 <AssignBoxDialog
                    estanteriaId={selectedEstanteria.id}
                    baldaId={selectedBalda.id}
                    onAssignBox={handleAssignBoxToLocation}
                    boxes={unassignedBoxes}
                    triggerText="Asignar Caja a Balda"
                 />
              </div>
            </CardTitle>
             <CardDescription>En Estantería: {selectedEstanteria.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center"><Package className="mr-2 h-5 w-5 text-primary"/>Objetos Sueltos ({(filteredLooseItemsOnSelectedBalda || []).length})</h3>
              {filteredLooseItemsOnSelectedBalda.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLooseItemsOnSelectedBalda.map(item => (
                    <ItemCard 
                        key={item.id} 
                        item={item} 
                        boxId={selectedBalda!.id} // Context is baldaId for loose items on balda
                        onUpdateItem={(baldaId, itemId, itemData) => handleUpdateLooseItemOnBalda(selectedEstanteria!.id, baldaId, itemId, itemData)}
                        onDeleteItem={(baldaId, itemId) => handleDeleteLooseItemFromBalda(selectedEstanteria!.id, baldaId, itemId)}
                    />
                  ))}
                </div>
              ) : <p className="text-muted-foreground">{filter ? "No hay objetos sueltos que coincidan con el filtro." : "No hay objetos sueltos en esta balda."}</p>}
            </div>
            <hr/>
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center"><ArchiveRestore className="mr-2 h-5 w-5 text-primary"/>Cajas Asignadas ({(filteredBoxesOnSelectedBalda || []).length})</h3>
              {filteredBoxesOnSelectedBalda.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBoxesOnSelectedBalda.map(box => (
                     <BoxCard
                        key={box.id}
                        box={box}
                        onAddItem={handleAddItemToBox}
                        onUpdateItem={handleUpdateItemInBox}
                        onDeleteItem={handleDeleteItemFromBox}
                        onDeleteBox={handleDeleteBox}
                        onUpdateBoxName={handleUpdateBoxName}
                        onUnassignBox={handleUnassignBox}
                        totalItemsInBoxOriginal={boxes.find(b=>b.id === box.id)?.items.length || 0}
                      />
                  ))}
                </div>
              ) : <p className="text-muted-foreground">{filter ? "No hay cajas asignadas que coincidan con el filtro." : "No hay cajas asignadas a esta balda."}</p>}
            </div>
          </CardContent>
        </Card>
      );
    }
    
    if (sidebarSelection.type === 'estanteria' && selectedEstanteria) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span>Contenido de Estantería: {selectedEstanteria.name}</span>
                     <EditNameDialog
                        currentName={selectedEstanteria.name}
                        itemTypeForTitle="Estantería"
                        onSave={(newName) => handleUpdateEstanteriaName(selectedEstanteria.id, newName)}
                    />
                </div>
              <div className="flex flex-wrap gap-2">
                <AddLooseItemToEstanteriaDialog estanteriaId={selectedEstanteria.id} onAddItem={handleAddLooseItemToEstanteria} />
                <AssignBoxDialog
                    estanteriaId={selectedEstanteria.id}
                    onAssignBox={handleAssignBoxToLocation}
                    boxes={unassignedBoxes}
                    triggerText="Asignar Caja a Estantería"
                 />
                <CreateBaldaDialog estanteriaId={selectedEstanteria.id} onCreateBalda={handleCreateBalda} />
              </div>
            </CardTitle>
            <CardDescription>
                {(selectedEstanteria.looseItems || []).length} objeto(s) suelto(s) directo(s), {boxesOnSelectedEstanteriaDirectly.length} caja(s) directa(s), {(selectedEstanteria.baldas || []).length} balda(s).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center"><Package className="mr-2 h-5 w-5 text-primary"/>Objetos Sueltos en Estantería ({(filteredLooseItemsOnSelectedEstanteria || []).length})</h3>
              {filteredLooseItemsOnSelectedEstanteria.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLooseItemsOnSelectedEstanteria.map(item => (
                    <ItemCard 
                        key={item.id} 
                        item={item} 
                        boxId={selectedEstanteria!.id} 
                        onUpdateItem={(estanteriaId, itemId, itemData) => handleUpdateLooseItemOnEstanteria(estanteriaId, itemId, itemData)}
                        onDeleteItem={(estanteriaId, itemId) => handleDeleteLooseItemFromEstanteria(estanteriaId, itemId)}
                    />
                  ))}
                </div>
              ) : <p className="text-muted-foreground">{filter ? "No hay objetos sueltos que coincidan." : "No hay objetos sueltos directamente en esta estantería."}</p>}
            </div>
            <hr/>
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center"><ArchiveRestore className="mr-2 h-5 w-5 text-primary"/>Cajas en Estantería ({(filteredBoxesOnSelectedEstanteriaDirectly || []).length})</h3>
              {filteredBoxesOnSelectedEstanteriaDirectly.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBoxesOnSelectedEstanteriaDirectly.map(box => (
                     <BoxCard
                        key={box.id}
                        box={box}
                        onAddItem={handleAddItemToBox}
                        onUpdateItem={handleUpdateItemInBox}
                        onDeleteItem={handleDeleteItemFromBox}
                        onDeleteBox={handleDeleteBox}
                        onUpdateBoxName={handleUpdateBoxName}
                        onUnassignBox={handleUnassignBox}
                        totalItemsInBoxOriginal={boxes.find(b=>b.id === box.id)?.items.length || 0}
                      />
                  ))}
                </div>
              ) : <p className="text-muted-foreground">{filter ? "No hay cajas que coincidan." : "No hay cajas directamente en esta estantería."}</p>}
            </div>
            <hr/>
            <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center"><Layers className="mr-2 h-5 w-5 text-primary"/>Baldas ({(filteredBaldasInSelectedEstanteria || []).length})</h3>
                {filteredBaldasInSelectedEstanteria.length > 0 ? (
                <div className="space-y-4">
                    {filteredBaldasInSelectedEstanteria.map(balda => (
                    <Card key={balda.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Button variant="link" className="p-0 h-auto text-lg" onClick={() => setSidebarSelection({type: 'balda', id: balda.id, estanteriaId: selectedEstanteria!.id, name: balda.name})}>
                                <Layers className="mr-2 h-5 w-5 text-primary"/>{balda.name}
                                </Button>
                                <EditNameDialog
                                    currentName={balda.name}
                                    itemTypeForTitle="Balda"
                                    onSave={(newName) => handleUpdateBaldaName(selectedEstanteria!.id, balda.id, newName)}
                                />
                            </div>
                            <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar Balda?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Se eliminará la balda "{balda.name}". Las cajas en esta balda pasarán a estar "sin ubicar". Los objetos sueltos se eliminarán.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteBalda(selectedEstanteria!.id, balda.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                    Eliminar Balda
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <CardDescription className="pt-1">
                            {(balda.looseItems || []).length} objeto(s) suelto(s). {boxes.filter(b => b.location?.baldaId === balda.id && b.location?.estanteriaId === selectedEstanteria!.id).length} caja(s) asignada(s).
                        </CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 pb-3">
                            <Button size="sm" variant="outline" onClick={() => setSidebarSelection({type: 'balda', id: balda.id, estanteriaId: selectedEstanteria!.id, name: balda.name})}>
                                <CornerRightDown className="mr-2 h-4 w-4"/> Ver Contenido de la Balda
                            </Button>
                        </CardContent>
                    </Card>
                    ))}
                </div>
                ) : (
                <p className="text-muted-foreground">{filter ? "No hay baldas que coincidan con el filtro." : "Esta estantería no tiene baldas. ¡Añade algunas!"}</p>
                )}
            </div>
          </CardContent>
        </Card>
      );
    }

    // Default View: List of Estanterias and Unassigned Boxes
    return (
      <div className="space-y-8">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold flex items-center"><Library className="mr-3 h-7 w-7 text-primary"/>Mis Estanterías ({filteredEstanterias.length})</h2>
            <CreateEstanteriaDialog onCreateEstanteria={handleCreateEstanteria} />
          </div>
          {filteredEstanterias.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEstanterias.map(est => (
                <Card key={est.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Button variant="link" className="p-0 h-auto text-xl" onClick={() => setSidebarSelection({type: 'estanteria', id: est.id, name: est.name, estanteriaId: est.id })}>
                                <Server className="mr-2 h-6 w-6 text-primary"/>{est.name}
                            </Button>
                            <EditNameDialog
                                currentName={est.name}
                                itemTypeForTitle="Estantería"
                                onSave={(newName) => handleUpdateEstanteriaName(est.id, newName)}
                            />
                       </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar Estantería?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esto eliminará permanentemente la estantería "{est.name}", todos sus objetos sueltos, todas sus baldas y los objetos sueltos en ellas. Las cajas (tanto directas como en baldas) serán desasignadas (pasarán a "sin ubicar").
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteEstanteria(est.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                              Eliminar Estantería
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <CardDescription className="pt-1">{(est.looseItems || []).length} obj. suelto(s), {boxes.filter(b => b.location?.estanteriaId === est.id && !b.location?.baldaId).length} caja(s) directa(s), {(est.baldas || []).length} balda(s)</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Button size="sm" variant="outline" onClick={() => setSidebarSelection({type: 'estanteria', id: est.id, name: est.name, estanteriaId: est.id })}>
                        <CornerRightDown className="mr-2 h-4 w-4"/> Ver Contenido
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">{filter ? "No hay estanterías que coincidan con el filtro." : "Aún no has creado ninguna estantería."}</p>
          )}
        </section>

        <hr />

        <section>
           <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold flex items-center"><Package className="mr-3 h-7 w-7 text-primary"/>Cajas sin Ubicar ({filteredUnassignedBoxes.length})</h2>
            <CreateBoxDialog onCreateBox={handleCreateBox}/>
          </div>
          {filteredUnassignedBoxes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUnassignedBoxes.map(box => (
                <BoxCard
                  key={box.id}
                  box={box}
                  onAddItem={handleAddItemToBox}
                  onUpdateItem={handleUpdateItemInBox}
                  onDeleteItem={handleDeleteItemFromBox}
                  onDeleteBox={handleDeleteBox}
                  onUpdateBoxName={handleUpdateBoxName}
                  onUnassignBox={handleUnassignBox}
                  totalItemsInBoxOriginal={boxes.find(b=>b.id === box.id)?.items.length || 0}
                />
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground">{filter ? "No hay cajas sin ubicar que coincidan con el filtro." : "Todas tus cajas están ubicadas o no tienes cajas."}</p>
          )}
        </section>
      </div>
    );
  };

  const currentFilterPlaceholder = useMemo(() => {
    if (sidebarSelection.type === 'balda' && selectedBalda) return `Filtrar en balda "${selectedBalda.name}"...`;
    if (sidebarSelection.type === 'estanteria' && selectedEstanteria) return `Filtrar en estantería "${selectedEstanteria.name}"...`;
    if (sidebarSelection.type === 'box' && sidebarSelection.id) {
        const box = sortedBoxes.find(b => b.id === sidebarSelection.id);
        return box ? `Filtrar en caja "${box.name}"...` : "Filtrar...";
    }
    if (sidebarSelection.type === 'all-boxes') return "Filtrar todas las cajas...";
    if (sidebarSelection.type === 'unassigned-boxes') return "Filtrar cajas sin ubicar...";
    return "Filtrar todo (estanterías, baldas, cajas, objetos)...";
  }, [sidebarSelection, selectedBalda, selectedEstanteria, sortedBoxes]);


  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar side="left" collapsible="icon" className="border-r">
            <SidebarHeader className="p-2 flex justify-between items-center">
              <span className="font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">Navegación</span>
              <SidebarTrigger className="hidden md:flex" />
            </SidebarHeader>
            <AppSidebar
              boxes={sortedBoxes}
              estanterias={sortedEstanterias}
              currentSelection={sidebarSelection}
              onSelect={setSidebarSelection}
            />
          </Sidebar>
          <SidebarInset>
            <main className="flex-1 container mx-auto py-8 px-4">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="md:hidden" />
                  <h1 className="text-3xl font-bold text-foreground">{pageTitle}</h1>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                 {sidebarSelection.type === 'all-boxes' && (
                     <Button variant="outline" onClick={() => setViewMode(prev => prev === 'card' ? 'list' : 'card')}>
                        {viewMode === 'card' ? <List className="mr-2 h-4 w-4" /> : <LayoutGrid className="mr-2 h-4 w-4" />}
                        {viewMode === 'card' ? 'Ver como Lista' : 'Ver como Tarjetas'}
                    </Button>
                 )}
                  <Button variant="outline" onClick={handleExportPDF}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar Inventario
                  </Button>
                  {sidebarSelection.type === 'all-estanterias' && <CreateEstanteriaDialog onCreateEstanteria={handleCreateEstanteria} />}
                  { (sidebarSelection.type === 'all-boxes' || sidebarSelection.type === 'unassigned-boxes' || sidebarSelection.type === 'all-estanterias') && <CreateBoxDialog onCreateBox={handleCreateBox} />}
                </div>
              </div>

              <div className="mb-8">
                <div className="relative">
                  <PackageSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={currentFilterPlaceholder}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-10 w-full text-base"
                  />
                </div>
              </div>
              
              {renderContent()}

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

