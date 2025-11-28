'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import Header from '@/components/layout/header';
import { productService, productAssemblyService } from '@/services';
import type { Producto, ProductoUpdate, ProductoEnsamble, ProductoEnsambleCreate } from '@/types/shop';

interface ComponentRow {
    id?: number; // undefined for new components
    idProductoHijo: number;
    cantidad: number;
    componentName?: string;
    isNew?: boolean;
}

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = Number(params.id);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Product form data
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precioVenta, setPrecioVenta] = useState('');
    const [tipo, setTipo] = useState<string>('SIMPLE');
    const [categoria, setCategoria] = useState<string>('');
    const [codbarra, setCodbarra] = useState('');
    const [estado, setEstado] = useState<string>('activo');
    const [imagenUrl, setImagenUrl] = useState('');
    const [localImagenUrl, setLocalImagenUrl] = useState('');

    // Categories and products for dropdowns
    const [allProducts, setAllProducts] = useState<Producto[]>([]);

    // Assembly components management
    const [components, setComponents] = useState<ComponentRow[]>([]);
    const [deletedComponentIds, setDeletedComponentIds] = useState<number[]>([]);

    // New component form
    const [newComponentId, setNewComponentId] = useState<string>('');
    const [newComponentQty, setNewComponentQty] = useState<string>('1');

    useEffect(() => {
        if (productId) {
            fetchData();
        }
    }, [productId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch product details
            const productData = await productService.getProducto(productId);
            setNombre(productData.nombre);
            setDescripcion(productData.descripcion || '');
            setPrecioVenta(productData.precioVenta.toString());
            setTipo(productData.tipo || 'SIMPLE');
            setCategoria(productData.categoria || '');
            setCodbarra(productData.codbarra || '');
            setEstado(productData.estado || 'activo');
            setImagenUrl(productData.imagenUrl || '');
            setLocalImagenUrl(productData.imagenUrl || '');

            // Fetch all products for component selection
            const productsData = await productService.getProductos({tipo: 'SIMPLE', estado: 'activo', limit: 100, skip: 0 });
            setAllProducts(productsData.filter(p => p.id !== productId)); // Exclude current product

            // Fetch assembly components
            try {
                const assemblyData = await productAssemblyService.getComponentsByEnsamble(productId);
                const componentsWithDetails = await Promise.all(
                    assemblyData.map(async (comp) => {
                        try {
                            const componentProduct = await productService.getProducto(comp.idProductoHijo );
                            return {
                                id: comp.id,
                                idProductoHijo: comp.idProductoHijo,
                                cantidad: comp.cantidad,
                                componentName: componentProduct.nombre,
                                isNew: false,
                            };
                        } catch (err) {
                            return {
                                id: comp.id,
                                idProductoHijo: comp.idProductoHijo,
                                cantidad: comp.cantidad,
                                componentName: 'Producto no encontrado',
                                isNew: false,
                            };
                        }
                    })
                );
                setComponents(componentsWithDetails);
            } catch (err) {
                console.error('Failed to fetch components:', err);
                setComponents([]);
            }
        } catch (err: any) {
            console.error('Failed to fetch product:', err);
            setError('No se pudo cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    const handleAddComponent = () => {
        if (!newComponentId || !newComponentQty) return;

        const componentIdNum = Number(newComponentId);
        const quantity = Number(newComponentQty);

        // Check if component already exists
        if (components.some(c => c.idProductoHijo === componentIdNum)) {
            alert('Este componente ya está agregado');
            return;
        }

        const product = allProducts.find(p => p.id === componentIdNum);

        setComponents([
            ...components,
            {
                idProductoHijo: componentIdNum,
                cantidad: quantity,
                componentName: product?.nombre || 'Desconocido',
                isNew: true,
            },
        ]);

        setNewComponentId('');
        setNewComponentQty('1');
    };

    const handleRemoveComponent = (index: number) => {
        const component = components[index];

        // If it's an existing component (has id), mark for deletion
        if (component.id) {
            setDeletedComponentIds([...deletedComponentIds, component.id]);
        }

        // Remove from current list
        setComponents(components.filter((_, i) => i !== index));
    };

    const handleUpdateComponentQuantity = (index: number, newQty: string) => {
        const quantity = Number(newQty);
        if (isNaN(quantity) || quantity < 1) return;

        const updated = [...components];
        updated[index] = { ...updated[index], cantidad: quantity };
        setComponents(updated);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            // Validate
            if (!nombre.trim()) {
                setError('El nombre es requerido');
                return;
            }

            const precioNum = Number(precioVenta);
            if (isNaN(precioNum) || precioNum < 0) {
                setError('El precio debe ser un número válido');
                return;
            }

            // Update product
            const updateData: ProductoUpdate = {
                nombre: nombre.trim(),
                descripcion: descripcion.trim() || undefined,
                precioVenta: precioNum,
                tipo: tipo,
                categoria: categoria.trim() || undefined,
                codbarra: codbarra.trim() || undefined,
                estado: estado,
                imagenUrl: imagenUrl.trim() || undefined,
            };

            await productService.updateProducto(productId, updateData);

            // Delete removed components
            for (const componentId of deletedComponentIds) {
                try {
                    await productAssemblyService.deleteProductoEnsamble(componentId);
                } catch (err) {
                    console.error(`Failed to delete component ${componentId}:`, err);
                }
            }

            // Create new components
            for (const component of components.filter(c => c.isNew)) {
                try {
                    const createData: ProductoEnsambleCreate = {
                        idProductoPadre: productId,
                        idProductoHijo: component.idProductoHijo,
                        cantidad: component.cantidad,
                    };
                    await productAssemblyService.createProductoEnsamble(createData);
                } catch (err) {
                    console.error('Failed to create component:', err);
                }
            }

            // Update existing components quantities
            for (const component of components.filter(c => !c.isNew && c.id)) {
                try {
                    await productAssemblyService.updateProductoEnsambleCantidad(component.id!, component.cantidad);
                } catch (err) {
                    console.error(`Failed to update component ${component.id}:`, err);
                }
            }

            // Redirect to product details
            router.push(`/admin/products/${productId}`);
        } catch (err: any) {
            console.error('Failed to save product:', err);
            setError('Error al guardar el producto');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-lg">Cargando producto...</div>
                </div>
            </div>
        );
    }

    if (error && !nombre) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => router.push('/admin/products')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a productos
                </Button>
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center text-red-600">{error}</div>
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
                            <Button variant="ghost" onClick={() => router.push(`/admin/products/${productId}`)}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold">Editar Producto</h1>
                                <p className="text-muted-foreground mt-1">Producto #{productId}</p>
                            </div>
                        </div>
                        <Button onClick={handleSave} disabled={saving}>
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>

                    {error && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="py-4">
                                <p className="text-red-600 text-sm">{error}</p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información Básica</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="nombre">Nombre del Producto *</Label>
                                        <Input
                                            id="nombre"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            placeholder="Ej: Ramo de Rosas"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="descripcion">Descripción</Label>
                                        <Textarea
                                            id="descripcion"
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                            placeholder="Descripción del producto..."
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="precioVenta">Precio de Venta *</Label>
                                            <Input
                                                id="precioVenta"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={precioVenta}
                                                onChange={(e) => setPrecioVenta(e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="tipo">Tipo de Producto</Label>
                                            <Select value={tipo} onValueChange={setTipo}>
                                                <SelectTrigger id="tipo">
                                                    <SelectValue placeholder="Seleccionar tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SIMPLE">Simple</SelectItem>
                                                    <SelectItem value="ENSAMBLE">Ensamble</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="categoria">Categoría</Label>
                                            <Input
                                                id="categoria"
                                                value={categoria}
                                                onChange={(e) => setCategoria(e.target.value)}
                                                placeholder="Ej: Flores, Regalos"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="codbarra">Código de Barras</Label>
                                            <Input
                                                id="codbarra"
                                                value={codbarra}
                                                onChange={(e) => setCodbarra(e.target.value)}
                                                placeholder="Código de barras"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="estado">Estado</Label>
                                        <Select value={estado} onValueChange={setEstado}>
                                            <SelectTrigger id="estado">
                                                <SelectValue placeholder="Seleccionar estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="activo">Activo</SelectItem>
                                                <SelectItem value="inactivo">Inactivo</SelectItem>
                                                <SelectItem value="agotado">Agotado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="imagenUrl">URL de Imagen</Label>
                                        <Input
                                            id="imagenUrl"
                                            value={imagenUrl}
                                            onChange={(e) => setImagenUrl(e.target.value)}
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Assembly Components */}
                            {tipo === 'ENSAMBLE' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Componentes del Ensamble
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Define los productos que componen este ensamble
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Add Component Form */}
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Select value={newComponentId} onValueChange={setNewComponentId}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar componente" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {allProducts.map((product) => (
                                                        <SelectItem key={product.id} value={product.id.toString()}>
                                                            {product.nombre} - ${product.precioVenta.toLocaleString()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={newComponentQty}
                                            onChange={(e) => setNewComponentQty(e.target.value)}
                                            placeholder="Cant."
                                            className="w-24"
                                        />
                                        <Button onClick={handleAddComponent} disabled={!newComponentId}>
                                            <Plus className="h-4 w-4 mr-1" />
                                            Agregar
                                        </Button>
                                    </div>

                                    {/* Components Table */}
                                    {components.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground border rounded-lg">
                                            No hay componentes agregados
                                        </div>
                                    ) : (
                                        <div className="border rounded-lg overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Componente</TableHead>
                                                        <TableHead className="w-32">Cantidad</TableHead>
                                                        <TableHead className="w-24">Estado</TableHead>
                                                        <TableHead className="w-20"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {components.map((component, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="font-medium">
                                                                {component.componentName}
                                                                <span className="text-xs text-muted-foreground ml-2">
                                                                    ID: {component.idProductoHijo}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    min="1"
                                                                    value={component.cantidad}
                                                                    onChange={(e) => handleUpdateComponentQuantity(index, e.target.value)}
                                                                    className="w-20"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                {component.isNew ? (
                                                                    <Badge variant="default" className="bg-blue-500">
                                                                        Nuevo
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="secondary">Existente</Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveComponent(index)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Image Preview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Vista Previa</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {localImagenUrl ? (
                                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                            <img
                                                src={ localImagenUrl }
                                                alt={nombre || 'Producto'}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement!.innerHTML =
                                                        '<div class="text-muted-foreground text-center p-4">Imagen no disponible</div>';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                            <div className="text-center text-muted-foreground p-4">
                                                <Package className="h-12 w-12 mx-auto mb-2" />
                                                <p className="text-sm">Sin imagen</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Resumen</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Componentes</span>
                                        <Badge variant="secondary">{components.length}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Nuevos</span>
                                        <Badge variant="default" className="bg-blue-500">
                                            {components.filter(c => c.isNew).length}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Eliminados</span>
                                        <Badge variant="destructive">{deletedComponentIds.length}</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Help */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ayuda</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground space-y-2">
                                    <p>• Los campos con * son obligatorios</p>
                                    <p>• Los componentes definen los productos que forman este ensamble</p>
                                    <p>• Puedes agregar múltiples unidades de cada componente</p>
                                    <p>• Los cambios se guardarán al hacer clic en "Guardar Cambios"</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
