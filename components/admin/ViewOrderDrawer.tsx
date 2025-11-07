'use client';

import { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, CreditCard, Truck, Calendar, MapPin, Package } from "lucide-react";
import { orderService } from '@/services/api/orders';
import type { PedidosDetail } from '@/types/shop';

interface ViewOrderDrawerProps {
  orderId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewOrderDrawer({ orderId, isOpen, onClose }: ViewOrderDrawerProps) {
  const [order, setOrder] = useState<PedidosDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrder();
    }
  }, [isOpen, orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    setIsLoading(true);
    try {
      const data = await orderService.getPedido(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return 'default';
      case 'enviado':
        return 'secondary';
      case 'procesando':
        return 'outline';
      case 'pendiente':
        return 'outline';
      case 'cancelado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return 'Entregado';
      case 'enviado':
        return 'Enviado';
      case 'procesando':
        return 'Procesando';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getPaymentStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pagado':
        return 'default';
      case 'pendiente':
        return 'outline';
      case 'fallido':
        return 'destructive';
      case 'reembolsado':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pagado':
        return 'Pagado';
      case 'pendiente':
        return 'Pendiente';
      case 'fallido':
        return 'Fallido';
      case 'reembolsado':
        return 'Reembolsado';
      default:
        return status;
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="max-h-[100vh] w-[600px] ml-auto">
        <DrawerHeader>
          <DrawerTitle>Detalles del Pedido #{orderId}</DrawerTitle>
          <DrawerDescription>
            Información completa del pedido seleccionado
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-4 overflow-y-auto max-h-[calc(100vh-100px)]">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Cargando detalles...</span>
            </div>
          ) : order ? (
            <div className="space-y-4">
              {/* Order Status Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Estado del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estado del Pedido:</span>
                    <Badge variant={getStatusVariant(order.estadoPedido)}>
                      {getStatusLabel(order.estadoPedido)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estado del Pago:</span>
                    <Badge variant={getPaymentStatusVariant(order.estadoPago)}>
                      {getPaymentStatusLabel(order.estadoPago)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Monto Total:</span>
                    <span className="text-lg font-bold text-green-600">
                      ${order.montoTotal.toLocaleString('es-CO')} COP
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Información del Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Cliente ID:</span>
                    <p className="font-medium">{order.clienteId}</p>
                  </div>
                  {order.cliente_nombre && (
                    <div>
                      <span className="text-sm text-gray-600">Nombre:</span>
                      <p className="font-medium">{order.cliente_nombre}</p>
                    </div>
                  )}
                  {order.cliente_email && (
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="font-medium">{order.cliente_email}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Información de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Método de Pago:</span>
                    <p className="font-medium">{order.metodoPago || 'No especificado'}</p>
                  </div>
                  {order.cupon_codigo && (
                    <div>
                      <span className="text-sm text-gray-600">Cupón Aplicado:</span>
                      <p className="font-medium">{order.cupon_codigo}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    Información de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.direccionEnvio && (
                    <div>
                      <span className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        Dirección de Envío:
                      </span>
                      <p className="font-medium mt-1">{order.direccionEnvio}</p>
                    </div>
                  )}
                  {order.metodo_envio_nombre && (
                    <div>
                      <span className="text-sm text-gray-600">Método de Envío:</span>
                      <p className="font-medium">{order.metodo_envio_nombre}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Metadata */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Información Adicional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Fecha de Creación:</span>
                    <p className="font-medium">
                      {new Date(order.creadoEn).toLocaleString('es-CO', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No se encontró información del pedido
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
