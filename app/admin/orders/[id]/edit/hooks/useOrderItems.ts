import { useState, useEffect } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { orderItemService, type PedidoDetalle } from '@/services/api/order-items';
import type { Producto } from '@/types/shop';
import type { OrderFormData } from '../schema/orderSchema';

export const useOrderItems = (
    orderId: number,
    products: Producto[],
    setValue: UseFormSetValue<OrderFormData>,
    watch: UseFormWatch<OrderFormData>
) => {
    const [orderItems, setOrderItems] = useState<PedidoDetalle[]>([]);
    const [deletedItemIds, setDeletedItemIds] = useState<number[]>([]);
    const [showAddItem, setShowAddItem] = useState(false);
    const [newItem, setNewItem] = useState({
        productoId: 0,
        cantidad: 1,
        precioUnitario: 0,
    });

    // Load order items on mount
    useEffect(() => {
        if (orderId) {
            loadOrderItems();
        }
    }, [orderId]);

    const loadOrderItems = async () => {
        try {
            const itemsData = await orderItemService.getItemsByPedido(orderId);
            setOrderItems(itemsData);
        } catch (error) {
            console.error('Error loading order items:', error);
        }
    };

    const handleAddItem = async (setError: (error: string | null) => void) => {
        if (!newItem.productoId || newItem.cantidad <= 0) {
            setError('Por favor selecciona un producto y una cantidad válida');
            return;
        }

        try {
            const product = products.find((p) => p.id === newItem.productoId);
            if (!product) return;

            // Create the new item in the database
            const createdItem = await orderItemService.createPedidoDetalle({
                idPedido: orderId,
                idProducto: newItem.productoId,
                cantidad: newItem.cantidad,
                precioUnitario: product.precioVenta,
            });

            // Add to local state
            setOrderItems([...orderItems, createdItem]);

            // Reset form
            setNewItem({ productoId: 0, cantidad: 1, precioUnitario: 0 });
            setShowAddItem(false);
        } catch (error) {
            console.error('Error adding item:', error);
            setError('Error al agregar el producto');
        }
    };

    const handleRemoveItem = (itemId: number) => {
        setDeletedItemIds([...deletedItemIds, itemId]);
        const updatedItems = orderItems.filter((item) => item.id !== itemId);
        setOrderItems(updatedItems);
    };

    const handleUpdateItemQuantity = (itemId: number, cantidad: number) => {
        const updatedItems = orderItems.map((item) => {
            if (item.id === itemId) {
                const subtotal = cantidad * item.precioUnitario;
                return { ...item, cantidad, subtotal };
            }
            return item;
        });
        setOrderItems(updatedItems);
    };

    const getProductName = (productoId: number) => {
        const product = products.find((p) => p.id === productoId);
        return product?.nombre || `Producto #${productoId}`;
    };

    return {
        orderItems,
        deletedItemIds,
        showAddItem,
        setShowAddItem,
        newItem,
        setNewItem,
        handleAddItem,
        handleRemoveItem,
        handleUpdateItemQuantity,
        getProductName,
    };
};
