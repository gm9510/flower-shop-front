import { useState, useEffect } from 'react';
import { entityService } from '@/services/api/clients';
import { couponService } from '@/services/api/coupons';
import { shippingService } from '@/services/api/shipping';
import type { Cupon, Entity, MetodoEnvio, Producto } from '@/types/shop';
import { productService } from '@/services/api/products';

export const useCreateOrderData = () => {
    const [clients, setClients] = useState<Entity[]>([]);
    const [coupons, setCoupons] = useState<Cupon[]>([]);
    const [shippingMethods, setShippingMethods] = useState<MetodoEnvio[]>([]);
    const [products, setProducts] = useState<Producto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const [clientsData, couponsData, shippingData, productsData] = await Promise.all([
                    entityService.getEntidades(),
                    couponService.getActiveCupones(),
                    shippingService.getMetodosEnvio(),
                    productService.getProductos(), // Assuming productService is imported
                ]);

                setClients(clientsData);
                setCoupons(couponsData);
                setShippingMethods(shippingData);
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error al cargar los datos necesarios');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        clients,
        coupons,
        shippingMethods,
        products,
        isLoading,
        error,
    };
};
