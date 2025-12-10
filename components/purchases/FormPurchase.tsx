'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import z from 'zod';
import { Button } from '../ui/button';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useGetEntidades } from '@/hooks/use-entidad';
import { useGetProductos } from '@/hooks/use-products';
import { useEffect, useState } from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Producto } from '@/types/shop';
import { CompraDetalle } from '@/services/api/purchases';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Input } from '../ui/input';
import { useCreatePurchase, useUpdatePurchase } from '@/hooks/use-purchase';
import { useRouter } from 'next/navigation';


// ------------------- SCHEMA -------------------
const formSchema = z.object({
  id: z.number().nullable(),
  idEntidad: z.number(),
  factura: z.string().min(1, "Factura requerida"),
  subTotal: z.number().min(0, "Debe ser >= 0"),
  descuento: z.number().min(0, "Debe ser >= 0"),
  total: z.number().min(0, "Debe ser >= 0"),
  saldo: z.number().min(0, "Debe ser >= 0"),
  metodoPago: z.string().min(1, "Método requerido"),
  fechaLimite: z.string().min(1, "Fecha Limite requerida"),
  efectivo: z.number(),
  transferencia: z.number(),
  observacion: z.string(),
  usuario: z.string(),
  registro: z.string(),
  details: z.array(z.object({
    idCompra: z.number().optional(),
    idProducto: z.number(),
    cantidad: z.number(),
    costo: z.number(),
    iva: z.number(),
    costoIva: z.number(),
    totalUnitario: z.number(),
    precioVenta: z.number()
  })).min(1)
});

export type FormClientData = z.infer<typeof formSchema>;

const dafaultData: FormClientData = {
  id: null,
  idEntidad: 0,
  factura: "",
  subTotal: 0,
  descuento: 0,
  total: 0,
  saldo: 0,
  metodoPago: "",
  fechaLimite: "",
  efectivo: 0,
  transferencia: 0,
  observacion: "",
  usuario: "admin",
  registro: "",
  details: []
};

interface Props {
  mode?: 'create' | 'edit'
  initialValues?: FormClientData;
}


// ------------------- COMPONENTE PRINCIPAL -------------------
export const FormPurchase = ({ initialValues, mode = 'create' }: Props) => {
  const router = useRouter()
  const { mutate: create, isLoading: isLoadingCreate, isSuccess: isSuccessCreate } = useCreatePurchase()
  const { mutate: updatePurchase, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate } = useUpdatePurchase()
  const isLoading = isLoadingCreate || isLoadingUpdate
  // const disableForm = isLoading
  const { entitys, isLoading: isLoadingEntitys, isError: isErrorEntitys } = useGetEntidades();
  const { handleSubmit, control, watch, setValue } = useForm<FormClientData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || dafaultData,
  });

  const details = watch('details');
  const subTotal = watch('subTotal');
  const descuento = watch('descuento');
  const total = watch('total');
  const handleValidateForm = (data: FormClientData) => {
    if (data.details.length === 0) return false
    return true
  }
  const onSubmit = (data: FormClientData) => {
    console.log(data)
    if (!handleValidateForm(data)) return
    const dataPayload = {
      ...data,
      fechaLimite: `${data.fechaLimite}T00:00`
    }
    if (mode === 'create') {
      create(dataPayload)
    } else {
      updatePurchase(dataPayload)
    }
  };

  const handleAddDetail = (detail: CompraDetalleF) => {
    setValue("details", [...details, detail]);
  };

  const handleEditDetail = (detail: CompraDetalleF) => {
    const updated = details.map(d =>
      d.idProducto === detail.idProducto ? detail : d
    );
    setValue("details", updated);
  };

  const handleDeleteDetail = (detail: CompraDetalleF) => {
    setValue("details", details.filter(d => d.idProducto !== detail.idProducto));
  };

  useEffect(() => {
    if (details.length === 0) {
      setValue("subTotal", 0);
      setValue("total", 0);
      return;
    }

    // Subtotal = suma de (cantidad * costo)
    const newSubTotal = details.reduce((acc, item) => {
      return acc + item.cantidad * item.costo;
    }, 0);

    // Total = suma de totalUnitario
    const newTotal = details.reduce((acc, item) => {
      return acc + item.totalUnitario;
    }, 0);

    setValue("subTotal", newSubTotal);
    setValue("total", newTotal - descuento);
  }, [details, descuento, setValue]);
  useEffect(() => {
    if (!isSuccessCreate) return
    router.push('/admin/purchases')
  }, [isSuccessCreate])
  useEffect(() => {
    if (!isSuccessUpdate) return
    router.push('/admin/purchases')
  }, [isSuccessUpdate])
  return (
    <form
      onSubmit={handleSubmit(onSubmit, (...errors) => {
        console.log(errors)
      })}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href={'/admin/purchases/'}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancelar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Crear Nuevo Pedido</h1>
            <p className="text-muted-foreground mt-1">
              Complete la información necesaria para {mode === 'create' ? 'crear' : 'Actualizar'} un nuevo pedido
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)}>
          <Save className="h-4 w-4 mr-2" />
          {mode === 'create' ? 'Crear' : 'Actualizar'}
        </Button>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* IZQUIERDA */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-4">

          {/* ------------------- CARD PROVEEDOR ------------------- */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Proveedor</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="idEntidad"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Seleccione Entidad<span className="text-red-500">*</span>
                    </FieldLabel>

                    {isLoadingEntitys ? (<div>cargando...</div>) :
                      isErrorEntitys ? (<div>error</div>) :
                        entitys ? (
                          <Select
                            value={field.value.toString()}
                            onValueChange={e => field.onChange(Number(e))}
                            disabled={isLoading}
                          >
                            <SelectTrigger id={field.name}>
                              <SelectValue placeholder="Seleccionar proveedor" />
                            </SelectTrigger>

                            <SelectContent>
                              {entitys.map(e => (
                                <SelectItem key={e.id} value={e.id.toString()}>
                                  {e.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : null}

                    {fieldState.error ? (
                      <FieldError>{fieldState.error.message}</FieldError>
                    ) : (
                      <FieldDescription>Proveedor</FieldDescription>
                    )}
                  </Field>
                )}
              />
            </CardContent>
          </Card>


          {/* ------------------- NUEVA SECCIÓN: DETALLES DE COMPRA ------------------- */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Compra</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* FACTURA */}
              <Controller
                name="factura"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Número de Factura</FieldLabel>
                    <Input {...field}
                      disabled={isLoading}
                    />
                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                  </Field>
                )}
              />

              {/* DESCUENTO */}
              <Controller
                name="descuento"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Descuento</FieldLabel>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))}
                      disabled={isLoading}
                    />
                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                  </Field>
                )}
              />

              {/* METODO DE PAGO */}
              <Controller
                name="metodoPago"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Método de Pago</FieldLabel>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                        <SelectItem value="transferencia">Transferencia</SelectItem>
                        <SelectItem value="mixto">Mixto</SelectItem>
                      </SelectContent>
                    </Select>

                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                  </Field>
                )}
              />

              {/* FECHA LIMITE */}
              <Controller
                name="fechaLimite"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Fecha Límite</FieldLabel>
                    <Input
                      {...field}
                      type="date"
                      value={field.value ?? ""}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                    />
                  </Field>
                )}
              />

              {/* EFECTIVO */}
              <Controller
                name="efectivo"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Efectivo</FieldLabel>
                    <Input
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      value={field.value ?? ""}
                      id={field.name}
                      type="number"
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                    />
                  </Field>
                )}
              />

              {/* TRANSFERENCIA */}
              <Controller
                name="transferencia"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Transferencia</FieldLabel>
                    <Input
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      value={field.value?.toString() ?? ""}
                      id={field.name}
                      type="number"
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                    />
                  </Field>
                )}
              />

              {/* OBSERVACION */}
              <Controller
                name="observacion"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="md:col-span-2">
                    <FieldLabel>Observación</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                    />
                  </Field>
                )}
              />

              {/* REGISTRO */}
              <Controller
                name="registro"
                control={control}
                render={({ field }) => (
                  <Field className="md:col-span-2">
                    <FieldLabel>Fecha de Registro</FieldLabel>
                    <Input type="datetime-local" {...field}
                      disabled={isLoading}
                    />
                  </Field>
                )}
              />

            </CardContent>
          </Card>


          {/* ------------------- GRUPO DE PRODUCTOS ------------------- */}
          <FormGroupProducts
            details={details}
            onAdd={handleAddDetail}
            onEdit={handleEditDetail}
            onDelete={handleDeleteDetail}
          />
        </div>


        {/* DERECHA */}
        <div className="col-span-1 lg:col-span-4">

          <Card>
            <CardHeader>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Descuento</span>
                  <span className="font-medium text-red-600">
                    -{formatPrice(descuento)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Monto Total</span>
                  <span className="font-bold text-lg text-green-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </form>
  );
};


// ------------------- TIPOS -------------------
interface CompraDetalleF extends Omit<CompraDetalle, "id" | "idCompra"> { }

interface FormGroupProductsProps {
  details: CompraDetalleF[]
  onAdd: (element: CompraDetalleF) => void
  onEdit: (element: CompraDetalleF) => void
  onDelete: (element: CompraDetalleF) => void
}


// ------------------- GROUP PRODUCTOS -------------------
const FormGroupProducts = ({ details, onAdd, onDelete, onEdit }: FormGroupProductsProps) => {
  const [product, setProduct] = useState<Producto>()
  const { products, isLoading: isLoadingProducts, isError: isErrorProducts } = useGetProductos()
  const [costo, setCosto] = useState(0)
  const [cantidad, setCantidad] = useState(0)

  const handleAdd = () => {
    if (!product || costo === 0 || cantidad === 0) return;
    onAdd({
      idProducto: product.id,
      precioVenta: product.precioVenta,
      costo,
      cantidad,
      iva: 0,
      costoIva: 0,
      totalUnitario: costo * cantidad,
    });
    setCantidad(0)
    setCosto(0)
    setProduct(undefined)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos del Pedido de Proveedor</CardTitle>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col w-full gap-4'>

          <div className='border border-gray-300 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <div className='lg:col-span-3'>
              {isLoadingProducts ? (<div>cargando...</div>) :
                isErrorProducts ? (<div>error</div>) :
                  products ? (
                    <Select
                      value={product?.id.toString()}
                      onValueChange={e =>
                        setProduct(products.find(e2 => e2.id.toString() === e))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>

                      <SelectContent>
                        {products.map(e => (
                          <SelectItem key={e.id} value={e.id.toString()}>
                            {e.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
            </div>

            <div className='flex flex-col gap-2'>
              <label>Costo</label>
              <Input type='number' value={costo.toString()} onChange={e => setCosto(Number(e.target.value))} />
            </div>

            <div className='flex flex-col gap-2'>
              <label>Cantidad</label>
              <Input type='number' value={cantidad.toString()} onChange={e => setCantidad(Number(e.target.value))} />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='opacity-0'>x</label>
              <Button type='button' onClick={handleAdd}>Agregar</Button>
            </div>
          </div>

          <div className='border rounded'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {details.length > 0 &&
                  details.map((detail) => (
                    <FormGroupProductsTableRow
                      key={detail.idProducto}
                      products={products ?? []}
                      detail={detail}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}

                {details.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>No hay Productos</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}


// ------------------- FILA EDITABLE -------------------
const FormGroupProductsTableRow = ({ detail, products, onEdit, onDelete }: FormGroupProductsTableRowProps) => {
  const [cantidad, setCantidad] = useState(detail.cantidad);
  const [costo, setCosto] = useState(detail.costo);

  useEffect(() => {
    const totalUnitario = cantidad * costo;
    onEdit({
      ...detail,
      cantidad,
      costo,
      totalUnitario,
      costoIva: 0,
    });
  }, [cantidad, costo]);

  const product = products.find(p => p.id === detail.idProducto);

  return (
    <TableRow key={detail.idProducto}>
      <TableCell>{detail.idProducto}</TableCell>
      <TableCell>{product?.nombre}</TableCell>

      <TableCell>
        <input
          type="number"
          className="w-20 border p-1 rounded"
          value={cantidad}
          onChange={e => setCantidad(Number(e.target.value))}
        />
      </TableCell>

      <TableCell>
        <input
          type="number"
          className="w-24 border p-1 rounded"
          value={costo}
          onChange={e => setCosto(Number(e.target.value))}
        />
      </TableCell>

      <TableCell>
        {cantidad * costo}
      </TableCell>

      <TableCell>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(detail)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

interface FormGroupProductsTableRowProps {
  products: Producto[]
  detail: CompraDetalleF
  onEdit: (element: CompraDetalleF) => void
  onDelete: (element: CompraDetalleF) => void
}
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
