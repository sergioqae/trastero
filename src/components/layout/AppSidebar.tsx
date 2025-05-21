
"use client";

import type { Box } from "@/lib/types";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Package } from "lucide-react"; // Using Package for better semantics

interface AppSidebarProps {
  boxes: Box[];
  selectedBoxId: string | null;
  onSelectBox: (boxId: string | null) => void;
}

export function AppSidebar({ boxes, selectedBoxId, onSelectBox }: AppSidebarProps) {
  return (
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            onClick={() => onSelectBox(null)} 
            isActive={selectedBoxId === null}
            tooltip="Mostrar todas las cajas"
          >
            <Home />
            <span>Todas las Cajas</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {boxes.map((box) => (
          <SidebarMenuItem key={box.id}>
            <SidebarMenuButton
              onClick={() => onSelectBox(box.id)}
              isActive={box.id === selectedBoxId}
              tooltip={`Ver contenido de ${box.name}`}
            >
              <Package /> 
              <span>{box.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
  );
}

    