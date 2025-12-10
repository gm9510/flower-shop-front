'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const formSchema = z.object({
  id: z.number().nullable(),
  nit: z.string().min(1, "El NIT es obligatorio"),
  dv: z.number().min(0).max(9),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  telefono: z.string().optional(),
  correo: z.string().email("Correo inválido"),
  estado: z.boolean(),
  direccion: z.string().optional(),
});

export type FormClientData = z.infer<typeof formSchema>;

const defaultData: FormClientData = {
  id: null,
  nit: "",
  dv: 0,
  nombre: "",
  telefono: "",
  correo: "",
  estado: true,
  direccion: "",
};

interface Props {
  mode?: "create" | "edit";
  initialValues?: FormClientData;
}

// 🟢 IMPORTANTE
// Asumimos que ya tienes estos hooks implementados:
import { useCreateEntidad, useUpdateEntidad } from "@/hooks/use-entidad";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const FormEntity = ({ initialValues, mode = "create" }: Props) => {
  const router = useRouter()
  const { mutate: createEntidad, isLoading: isLoadingCreate, isSuccess: isSuccessCreate } = useCreateEntidad();
  const { mutate: updateEntidad, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate } = useUpdateEntidad();

  const { handleSubmit, control } = useForm<FormClientData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || defaultData,
  });

  const onSubmit = (data: FormClientData) => {
    if (mode === "create") {
      createEntidad(data);
    } else {
      updateEntidad(data);
    }
  };

  const isLoading = isLoadingCreate || isLoadingUpdate;
  const isSuccess = isSuccessCreate || isSuccessUpdate;
  useEffect(() => {
    if (!isSuccess) return
    router.push('/admin/entitys')
  }, [isSuccess])
  return (
    <form className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href={"/admin/entitys/"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancelar
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl font-bold">
              {mode === "create" ? "Crear Nueva Entidad" : "Editar Entidad"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete la información necesaria para {mode === "create" ? "crear" : "actualizar"} la entidad
            </p>
          </div>
        </div>

        <Button disabled={isLoading} onClick={handleSubmit(onSubmit)}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-8 bg-white p-6 rounded-xl shadow">

        {/* NIT */}
        <Controller
          name="nit"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>NIT</FieldLabel>
              <Input {...field} />
              {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
            </Field>
          )}
        />

        {/* DV */}
        <Controller
          name="dv"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>DV</FieldLabel>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
            </Field>
          )}
        />

        {/* Nombre */}
        <Controller
          name="nombre"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Nombre</FieldLabel>
              <Input {...field} />
              {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
            </Field>
          )}
        />

        {/* Teléfono */}
        <Controller
          name="telefono"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Teléfono</FieldLabel>
              <Input {...field} />
              {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
            </Field>
          )}
        />

        {/* Correo */}
        <Controller
          name="correo"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Correo</FieldLabel>
              <Input type="email" {...field} />
              {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
            </Field>
          )}
        />

        {/* Dirección */}
        <Controller
          name="direccion"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Dirección</FieldLabel>
              <Input {...field} />
              {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
            </Field>
          )}
        />

      </div>
    </form>
  );
};
