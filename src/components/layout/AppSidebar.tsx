
"use client";

import type { Box, Estanteria, Balda } from "@/lib/types";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Home, Package, Library, Layers, Archive, ArchiveRestore, Server } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion"; // For expandable estanterias

export interface SidebarSelection {
  type: 'all-estanterias' | 'estanteria' | 'balda' | 'all-boxes' | 'unassigned-boxes' | 'box';
  id?: string; // estanteriaId, baldaId, or boxId depending on type
  estanteriaId?: string; // Relevant for balda
  name?: string; // For display in title, etc.
}

interface AppSidebarProps {
  boxes: Box[];
  estanterias: Estanteria[];
  currentSelection: SidebarSelection;
  onSelect: (selection: SidebarSelection) => void;
}

export function AppSidebar({ boxes, estanterias, currentSelection, onSelect }: AppSidebarProps) {
  const unassignedBoxesCount = boxes.filter(box => !box.location).length;

  return (
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            onClick={() => onSelect({ type: 'all-estanterias' })} 
            isActive={currentSelection.type === 'all-estanterias'}
            tooltip="Mostrar todas las estanterías y cajas sin ubicar"
          >
            <Home />
            <span>Inicio (Estanterías)</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarSeparator />
        <SidebarMenuItem>
            <span className="px-3 text-xs font-medium text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">ESTANTERÍAS</span>
        </SidebarMenuItem>

        {estanterias.length > 0 ? (
            <Accordion.Root type="multiple" className="w-full group-data-[collapsible=icon]:hidden">
              {estanterias.map((est) => (
                <Accordion.Item value={est.id} key={est.id} className="border-none">
                  <SidebarMenuItem>
                    <Accordion.Trigger asChild className="w-full">
                       <SidebarMenuButton
                        onClick={() => onSelect({ type: 'estanteria', id: est.id, estanteriaId: est.id, name: est.name })}
                        isActive={currentSelection.type === 'estanteria' && currentSelection.id === est.id}
                        tooltip={`Ver estantería ${est.name}`}
                        className="justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Server /> 
                          <span>{est.name}</span>
                        </div>
                        {/* Chevron will be added by Accordion.Trigger if needed, or style one */}
                      </SidebarMenuButton>
                    </Accordion.Trigger>
                  </SidebarMenuItem>
                  <Accordion.Content className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <SidebarMenuSub>
                      {(est.baldas || []).length > 0 ? (est.baldas || []).map((balda) => (
                        <SidebarMenuSubItem key={balda.id}>
                          <SidebarMenuSubButton
                            onClick={() => onSelect({ type: 'balda', id: balda.id, estanteriaId: est.id, name: balda.name })}
                            isActive={currentSelection.type === 'balda' && currentSelection.id === balda.id}
                          >
                            <Layers className="mr-1 h-3.5 w-3.5" />
                            <span>{balda.name}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )) : (
                        <SidebarMenuSubItem>
                            <span className="px-2 py-1.5 text-xs text-sidebar-foreground/60 italic">Sin baldas</span>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
        ) : (
             <SidebarMenuItem>
                <span className="px-3 text-xs text-sidebar-foreground/60 italic group-data-[collapsible=icon]:hidden">No hay estanterías</span>
            </SidebarMenuItem>
        )}
         {/* For icon-only mode, list estanterias without accordion */}
        <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-1">
            {estanterias.map((est) => (
                <SidebarMenuItem key={`icon-${est.id}`}>
                    <SidebarMenuButton
                        onClick={() => onSelect({ type: 'estanteria', id: est.id, estanteriaId: est.id, name: est.name })}
                        isActive={currentSelection.type === 'estanteria' && currentSelection.id === est.id}
                        tooltip={est.name}
                    >
                        <Server />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </div>


        <SidebarSeparator />
        <SidebarMenuItem>
            <span className="px-3 text-xs font-medium text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">CAJAS</span>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton 
            onClick={() => onSelect({ type: 'all-boxes' })} 
            isActive={currentSelection.type === 'all-boxes'}
            tooltip="Mostrar todas las cajas"
          >
            <Package />
            <span>Todas las Cajas</span>
            <span className="ml-auto text-xs opacity-70">{boxes.length}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            onClick={() => onSelect({ type: 'unassigned-boxes' })} 
            isActive={currentSelection.type === 'unassigned-boxes'}
            tooltip="Mostrar cajas sin ubicar en estanterías"
          >
            <ArchiveRestore />
            <span>Cajas sin Ubicar</span>
             <span className="ml-auto text-xs opacity-70">{unassignedBoxesCount}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
         {/* Optional: List individual boxes if needed, might be too much with many boxes
        {boxes.map((box) => (
          <SidebarMenuItem key={box.id}>
            <SidebarMenuButton
              onClick={() => onSelect({ type: 'box', id: box.id, name: box.name })}
              isActive={currentSelection.type === 'box' && currentSelection.id === box.id}
              tooltip={`Ver contenido de ${box.name}`}
            >
              <Archive /> 
              <span>{box.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        */}
      </SidebarMenu>
    </SidebarContent>
  );
}
