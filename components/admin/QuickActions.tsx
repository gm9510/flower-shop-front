'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  RotateCcw, 
  Printer,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  const handleCreateOrder = () => {
    router.push('/admin/orders/create');
  };

  const handleRefund = () => {
    console.log("Reembolsar Pedido");
    // Add refund logic here
  };

  const handlePrintGuide = () => {
    console.log("Imprimir Guía");
    // Add print logic here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="default"
          className="w-full h-auto p-4 justify-start"
          onClick={handleCreateOrder}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Plus className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="font-medium">Crear Pedido</div>
              <div className="text-xs text-muted-foreground mt-1">
                Registrar un nuevo pedido
              </div>
            </div>
          </div>
        </Button>

        <Button
          variant="secondary"
          className="w-full h-auto p-4 justify-start"
          onClick={handleRefund}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <RotateCcw className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="font-medium">Reembolsar Pedido</div>
              <div className="text-xs text-muted-foreground mt-1">
                Procesar devolución de dinero
              </div>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full h-auto p-4 justify-start"
          onClick={handlePrintGuide}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Printer className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="font-medium">Imprimir Guía</div>
              <div className="text-xs text-muted-foreground mt-1">
                Generar guía de envío
              </div>
            </div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}