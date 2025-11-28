'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Tag, DollarSign, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Header from '@/components/layout/header';
import { productService, productAssemblyService } from '@/services';
import type { Producto, ProductoEnsamble } from '@/types/shop';

interface ProductoEnsambleWithDetails extends ProductoEnsamble {
    componente?: Producto;
}

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const productId = Number(params.id);

    const [product, setProduct] = useState<Producto | null>(null);
    const [assemblyComponents, setAssemblyComponents] = useState<ProductoEnsambleWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch product details
            const productData = await productService.getProducto(productId);
            setProduct(productData);

            // Note: Category is now a string field in the new model
            // No need to fetch category separately

            // Fetch assembly components (products that make up this product)
            try {
                const components = await productAssemblyService.getComponentsByEnsamble(productId);

                // Fetch details for each component
                const componentsWithDetails = await Promise.all(
                    components.map(async (comp) => {
                        try {
                            const componentProduct = await productService.getProducto(comp.idProductoHijo);
                            return { ...comp, componente: componentProduct };
                        } catch (err) {
                            console.error(`Failed to fetch component ${comp.idProductoHijo}:`, err);
                            return comp;
                        }
                    })
                );

                setAssemblyComponents(componentsWithDetails);
            } catch (err) {
                console.error('Failed to fetch assembly components:', err);
                // Not an error if product has no components
                setAssemblyComponents([]);
            }
        } catch (err: any) {
            console.error('Failed to fetch product details:', err);
            setError('No se pudo cargar los detalles del producto');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getStatusBadge = () => {
        // Mock status - replace with actual inventory/status logic
        const hasStock = productId % 3 !== 0;
        return hasStock ? (
            <Badge variant="default" className="bg-green-500">
                Activo
            </Badge>
        ) : (
            <Badge variant="secondary">Inactivo</Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-lg">Cargando detalles del producto...</div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => router.push('/admin/products')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a productos
                </Button>
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center text-red-600">
                            {error || 'Producto no encontrado'}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => router.push('/admin/products')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold">{product.nombre}</h1>
                                <p className="text-muted-foreground mt-1">
                                    Detalles del producto #{product.id}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {getStatusBadge()}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Información Básica
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Nombre
                                            </label>
                                            <p className="mt-1 text-lg font-medium">{product.nombre}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                ID del Producto
                                            </label>
                                            <p className="mt-1 text-lg font-medium">#{product.id}</p>
                                        </div>
                                    </div>

                                    {product.descripcion && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Descripción
                                            </label>
                                            <p className="mt-1">{product.descripcion}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Tipo
                                            </label>
                                            <p className="mt-1 text-lg">
                                                {product.tipo === 'SIMPLE' ? 'Simple' : product.tipo === 'ENSAMBLE' ? 'Ensamble' : product.tipo}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Estado
                                            </label>
                                            <p className="mt-1 text-lg capitalize">
                                                {product.estado || 'No especificado'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                <Tag className="h-4 w-4" />
                                                Categoría
                                            </label>
                                            <p className="mt-1 text-lg">
                                                {product.categoria || 'Sin categoría'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                <DollarSign className="h-4 w-4" />
                                                Precio de Venta
                                            </label>
                                            <p className="mt-1 text-2xl font-bold text-green-600">
                                                {formatPrice(product.precioVenta)}
                                            </p>
                                        </div>
                                    </div>

                                    {product.codbarra && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Código de Barras
                                            </label>
                                            <p className="mt-1 text-lg font-mono">{product.codbarra}</p>
                                        </div>
                                    )}

                                    {product.imagenUrl && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                <ImageIcon className="h-4 w-4" />
                                                URL de Imagen
                                            </label>
                                            <p className="mt-1 text-sm break-all">{product.imagenUrl}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Assembly Components */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Componentes del Ensamble</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Productos que componen este ensamble
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    {assemblyComponents.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            Este producto no tiene componentes de ensamble
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>ID</TableHead>
                                                        <TableHead>Componente</TableHead>
                                                        <TableHead>Cantidad</TableHead>
                                                        <TableHead className="text-right">Precio</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {assemblyComponents.map((component) => (
                                                        <TableRow key={component.id}>
                                                            <TableCell className="font-mono">
                                                                #{component.idProductoHijo}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {component.componente?.nombre || 'Producto no disponible'}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">
                                                                    {component.cantidad} unidad{component.cantidad !== 1 ? 'es' : ''}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {component.componente
                                                                    ? formatPrice(component.componente.precioVenta)
                                                                    : '-'}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Product Image */}
                            {product.imagenUrl && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Imagen del Producto</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                            <img
                                                src={product.imagenUrl}
                                                alt={product.nombre}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement!.innerHTML =
                                                        '<div class="text-muted-foreground flex items-center justify-center h-full"><ImageIcon class="h-12 w-12" /></div>';
                                                }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Summary Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Resumen</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Estado</span>
                                        {getStatusBadge()}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Componentes</span>
                                        <Badge variant="secondary">{assemblyComponents.length}</Badge>
                                    </div>
                                    {assemblyComponents.length > 0 && (
                                        <div className="flex justify-between items-center pt-3 border-t">
                                            <span className="text-sm font-medium">Costo Total Componentes</span>
                                            <span className="font-bold">
                                                {formatPrice(
                                                    assemblyComponents.reduce(
                                                        (sum, comp) =>
                                                            sum + ((comp as ProductoEnsambleWithDetails).componente?.precioVenta || 0) * comp.cantidad,
                                                        0
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Acciones</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={() => router.push(`/admin/products/${productId}/edit`)}
                                    >
                                        Editar Producto
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        Ver Inventario
                                    </Button>
                                    <Button className="w-full" variant="outline" disabled>
                                        Eliminar Producto
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
