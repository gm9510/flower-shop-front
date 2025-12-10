'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/header';
import { productService} from '@/services';
import type { Producto} from '@/types/shop';

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getProductos();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };


    // Filter products based on search term, type, and status
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.nombre
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesType =
            selectedType === 'all' || product.tipo?.toString() === selectedType;
        // Mock status logic - you can replace with actual status field
        const hasStock = Math.random() > 0.3; // Mock stock availability
        const matchesStatus =
            selectedStatus === 'all' ||
            (selectedStatus === 'active' && hasStock) ||
            (selectedStatus === 'inactive' && !hasStock);

        return matchesSearch && matchesType && matchesStatus;
    });

    const getStatusBadge = (productId: number) => {
        // Mock status - replace with actual inventory/status logic
        const hasStock = productId % 3 !== 0; // Simple mock logic
        return hasStock ? (
            <Badge variant="default" className="bg-green-500">
                Activo
            </Badge>
        ) : (
            <Badge variant="secondary">Inactivo</Badge>
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Productos</h1>
                            <p className="text-muted-foreground mt-1">
                                Gestiona el catálogo de productos
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => router.push('/admin/products/create')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Producto
                            </Button>
                            <Button onClick={() => router.push('/admin/entitys')} variant="outline">
                                Ir a Proveedores
                            </Button>
                            <Button onClick={() => router.push('/admin/purchases')} variant="outline">
                                Ir a Compras
                            </Button>
                        </div>
                    </div>

                    {/* Filters Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filtros
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por nombre..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Type Filter */}
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filtrar por tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los tipos</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Status Filter */}
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filtrar por estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los estados</SelectItem>
                                        <SelectItem value="active">Activo</SelectItem>
                                        <SelectItem value="inactive">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Precio de Venta</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8">
                                                    Cargando productos...
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredProducts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8">
                                                    No se encontraron productos
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredProducts.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell className="font-medium">
                                                        {product.nombre}
                                                    </TableCell>
                                                    <TableCell>{product.tipo}</TableCell>
                                                    <TableCell>{formatPrice(product.precioVenta)}</TableCell>
                                                    <TableCell>{getStatusBadge(product.id)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => router.push(`/admin/products/${product.id}`)}
                                                        >
                                                            Ver
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                                                        >
                                                            Editar
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results Summary */}
                    {!loading && (
                        <div className="text-sm text-muted-foreground text-center">
                            Mostrando {filteredProducts.length} de {products.length} productos
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
