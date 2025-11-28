'use client';

import { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateOrderForm from './CreateOrderForm';

interface CreateOrderDrawerProps {
  children?: React.ReactNode;
}

export default function CreateOrderDrawer({ children }: CreateOrderDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    // Optionally refresh the orders table or show a success message
    window.location.reload(); // Simple refresh for now
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerTrigger asChild>
        {children || (
          <Button className="w-full h-auto p-4 justify-start">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Plus className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-medium">Crear Pedido</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Crear un nuevo pedido para un cliente
                </div>
              </div>
            </div>
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-h-[100vh]">
        <DrawerHeader>
          <DrawerTitle>Crear Nuevo Pedido</DrawerTitle>
          <DrawerDescription>
            Complete la información necesaria para crear un nuevo pedido en el sistema.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto max-h-[100vh]">
          <CreateOrderForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}