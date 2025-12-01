import { useState, useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { orderService } from '@/services/api/orders';
import { clientService } from '@/services/api/clients';
import { couponService } from '@/services/api/coupons';
import { shippingService } from '@/services/api/shipping';
import { productService } from '@/services/api/products';
import type {
    PedidosResponse,
    Cliente,
    Cupon,
    MetodoEnvio,
    Producto,
} from '@/types/shop';
import type { OrderFormData } from '../schema/orderSchema';

export const useOrderData = (orderId: number, setValue: UseFormSetValue<OrderFormData>) => {
    const [isLoadingOrder, setIsLoadingOrder] = useState(true);
    const [order, setOrder] = useState<PedidosResponse | null>(null);
    const [clients, setClients] = useState<Cliente[]>([]);
    const [coupons, setCoupons] = useState<Cupon[]>([]);
    const [shippingMethods, setShippingMethods] = useState<MetodoEnvio[]>([]);
    const [products, setProducts] = useState<Producto[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId) {
            loadData();
        }
    }, [orderId]);

    const loadData = async () => {
        try {
            setIsLoadingOrder(true);
            setError(null);

            // Load order details
            const orderData = await orderService.getPedido(orderId);
            setOrder(orderData);

            // Set form values with existing order data
            setValue('numeroFactura', orderData.numeroFactura);
            setValue('idEntidad', orderData.idEntidad);
            setValue('subTotal', orderData.subTotal);
            setValue('descuento', orderData.descuento);
            setValue('montoTotal', orderData.montoTotal);
            setValue('saldo', orderData.saldo);
            setValue('estadoPedido', orderData.estadoPedido as any);
            setValue('estadoPago', orderData.estadoPago as any);
            setValue('metodoPago', orderData.metodoPago || '');
            setValue('direccionEnvio', orderData.direccionEnvio || '');
            setValue('fechaEntrega', orderData.fechaEntrega ? orderData.fechaEntrega.split('T')[0] : '');
            setValue('idCupon', orderData.idCupon || null);
            setValue('idEnvio', orderData.idEnvio || null);
            setValue('efectivo', orderData.efectivo || 0);
            setValue('transferencia', orderData.transferencia || 0);
            setValue('usuario', orderData.usuario || '');

            // Load dropdown data
            const [clientsData, couponsData, shippingData, productsData] = await Promise.all([
                clientService.getClientes({ limit: 100 }),
                couponService.getCupones(),
                shippingService.getMetodosEnvio(),
                productService.getProductos({ limit: 500 }),
            ]);

            setClients(clientsData);
            setCoupons(couponsData);
            setShippingMethods(shippingData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error loading data:', error);
            setError('No se pudo cargar la información del pedido');
        } finally {
            setIsLoadingOrder(false);
        }
    };

    return {
        isLoadingOrder,
        order,
        clients,
        coupons,
        shippingMethods,
        products,
        error,
        setError,
    };
};
