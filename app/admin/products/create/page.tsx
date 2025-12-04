'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Package } from 'lucide-react';
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
import Header from '@/components/layout/header';
import { productService } from '@/services';
import type { Categoria, ProductoCreate } from '@/types/shop';

export default function CreateProductPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
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

    // Categories for dropdown

    const handleCreate = async () => {
        try {
            setLoading(true);
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

            // Create product
            const createData: ProductoCreate = {
                nombre: nombre.trim(),
                descripcion: descripcion.trim() || undefined,
                precioVenta: precioNum,
                tipo: tipo,
                categoria: categoria.trim() || undefined,
                codbarra: codbarra.trim() || undefined,
                estado: estado,
                imagenUrl: imagenUrl.trim() || undefined,
            };

            const newProduct = await productService.createProducto(createData);

            // Redirect to product details
            router.push(`/admin/products/${newProduct.id}`);
        } catch (err: any) {
            console.error('Failed to create product:', err);
            setError('Error al crear el producto');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (nombre || descripcion || precioVenta || imagenUrl || codbarra || categoria) {
            if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los cambios.')) {
                router.push('/admin/products');
            }
        } else {
            router.push('/admin/products');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={handleCancel}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold">Crear Nuevo Producto</h1>
                                <p className="text-muted-foreground mt-1">
                                    Agrega un nuevo producto al catálogo
                                </p>
                            </div>
                        </div>
                        <Button onClick={handleCreate} disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Creando...' : 'Crear Producto'}
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
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información del Producto</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Completa la información básica del producto
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="nombre">Nombre del Producto *</Label>
                                        <Input
                                            id="nombre"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            placeholder="Ej: Ramo de Rosas Rojas"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="descripcion">Descripción</Label>
                                        <Textarea
                                            id="descripcion"
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                            placeholder="Descripción detallada del producto..."
                                            rows={4}
                                            disabled={loading}
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
                                                disabled={loading}
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Precio en pesos colombianos (COP)
                                            </p>
                                        </div>

                                        <div>
                                            <Label htmlFor="tipo">Tipo de Producto *</Label>
                                            <Select
                                                value={tipo}
                                                onValueChange={setTipo}
                                                disabled={loading}
                                            >
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
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="codbarra">Código de Barras</Label>
                                            <Input
                                                id="codbarra"
                                                value={codbarra}
                                                onChange={(e) => setCodbarra(e.target.value)}
                                                placeholder="Código de barras"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="estado">Estado</Label>
                                        <Select
                                            value={estado}
                                            onValueChange={setEstado}
                                            disabled={loading}
                                        >
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
                                            disabled={loading}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            URL de la imagen del producto
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Image Preview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Vista Previa</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {imagenUrl ? (
                                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                            <img
                                                src={imagenUrl}
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

                            {/* Information Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground space-y-3">
                                    <div>
                                        <p className="font-medium text-foreground mb-1">Campos requeridos</p>
                                        <p>• Nombre del producto</p>
                                        <p>• Precio de venta</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground mb-1">Componentes del ensamble</p>
                                        <p>Los componentes del ensamble se pueden agregar después de crear el producto desde la página de edición.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Help Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ayuda</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground space-y-2">
                                    <p>• Completa al menos el nombre y precio del producto</p>
                                    <p>• La categoría y la imagen son opcionales</p>
                                    <p>• Después de crear el producto, podrás editarlo para agregar componentes de ensamble</p>
                                    <p>• Los cambios se guardarán al hacer clic en "Crear Producto"</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
