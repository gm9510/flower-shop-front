import { useState, useEffect } from 'react';
import { orderService } from '@/services/api/orders';
import { orderItemService, type PedidoDetalle } from '@/services/api/order-items';
import { productService } from '@/services/api/products';
import type { PedidosResponse, Producto } from '@/types/shop';

export const useOrderDetails = (orderId: number) => {
    const [order, setOrder] = useState<PedidosResponse | null>(null);
    const [orderItems, setOrderItems] = useState<PedidoDetalle[]>([]);
    const [products, setProducts] = useState<Map<number, Producto>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch order and order items in parallel
            const [orderData, itemsData] = await Promise.all([
                orderService.getPedido(orderId),
                orderItemService.getItemsByPedido(orderId),
            ]);

            setOrder(orderData);
            setOrderItems(itemsData);

            // Fetch product details for all items
            if (itemsData.length > 0) {
                const productIds = [...new Set(itemsData.map(item => item.idProducto))];
                const productsData = await Promise.all(
                    productIds.map(id => productService.getProducto(id).catch(() => null))
                );

                const productsMap = new Map<number, Producto>();
                productsData.forEach(product => {
                    if (product) {
                        productsMap.set(product.id, product);
                    }
                });
                setProducts(productsMap);
            }
        } catch (err: any) {
            console.error('Failed to fetch order details:', err);
            setError('No se pudo cargar los detalles del pedido');
        } finally {
            setLoading(false);
        }
    };

    const getProductName = (productoId: number) => {
        const product = products.get(productoId);
        return product?.nombre || `Producto #${productoId}`;
    };

    return {
        order,
        orderItems,
        products,
        loading,
        error,
        getProductName,
    };
};
