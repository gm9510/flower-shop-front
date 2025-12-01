import { useState, useEffect } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { Producto } from '@/types/shop';
import type { OrderCreateFormData } from '../schema/orderCreateSchema';
import { PedidoDetalleCreate } from '@/services/api/order-items';

export const useOrderItems = (
    products: Producto[],
    setValue: UseFormSetValue<OrderCreateFormData>,
    watch: UseFormWatch<OrderCreateFormData>
) => {
    const [orderItems, setOrderItems] = useState<PedidoDetalleCreate[]>([]);
    const [deletedItemIds, setDeletedItemIds] = useState<number[]>([]);
    const [showAddItem, setShowAddItem] = useState(false);
    const [newItem, setNewItem] = useState({
        productoId: 0,
        cantidad: 1,
        precioUnitario: 0,
    });

    // Recalculate subtotal and total when order items change
    const handleAddItem = async (setError: (error: string | null) => void) => {
        if (!newItem.productoId || newItem.cantidad <= 0) {
            setError('Por favor selecciona un producto y una cantidad válida');
            return;
        }

        try {
            const product = products.find((p) => p.id === newItem.productoId);
            if (!product) return;

            // Add to local state
            setOrderItems([...orderItems, {
                idPedido: 0,
                idProducto: newItem.productoId,
                cantidad: newItem.cantidad,
                precioUnitario: newItem.precioUnitario,
            }]);

            // Reset form
            setNewItem({ productoId: 0, cantidad: 1, precioUnitario: 0 });
            setShowAddItem(false);
        } catch (error) {
            console.error('Error adding item:', error);
            setError('Error al agregar el producto');
        }
    };

    const handleRemoveItem = (index: number) => {
        setDeletedItemIds([...deletedItemIds, index]);
        const updatedItems = orderItems.filter((_, i) => i !== index);
        setOrderItems(updatedItems);
    };

    const handleUpdateItemQuantity = (index: number, cantidad: number) => {
        const updatedItems = orderItems.map((item, i) => {
            if (i === index) {
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
