'use client';

import { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import EditOrderForm from './EditOrderForm';

interface EditOrderDrawerProps {
  orderId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditOrderDrawer({ orderId, isOpen, onClose, onSuccess }: EditOrderDrawerProps) {
  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="max-h-[100vh] w-[600px] ml-auto">
        <DrawerHeader>
          <DrawerTitle>Editar Pedido #{orderId}</DrawerTitle>
          <DrawerDescription>
            Modifica la información del pedido seleccionado.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto max-h-[calc(100vh-100px)]">
          {orderId && (
            <EditOrderForm
              orderId={orderId}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
