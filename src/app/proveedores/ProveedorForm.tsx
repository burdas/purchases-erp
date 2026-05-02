'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Proveedor } from '@/types'

const providerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  nif: z.string().optional(),
  email_contacto: z.string().email('Email inválido').optional().or(z.literal('')),
  telefono: z.string().optional(),
  activo: z.boolean().default(true),
})

type ProviderFormValues = z.infer<typeof providerSchema>

interface ProveedorFormProps {
  initialData?: Proveedor
  onSubmit: (data: ProviderFormValues) => void
  onCancel: () => void
}

export function ProveedorForm({ initialData, onSubmit, onCancel }: ProveedorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      nif: initialData?.nif || '',
      email_contacto: initialData?.email_contacto || '',
      telefono: initialData?.telefono || '',
      activo: initialData?.activo ?? true,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" {...register('nombre')} />
        {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="nif">NIF/CIF</Label>
        <Input id="nif" {...register('nif')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email_contacto">Email de contacto</Label>
        <Input id="email_contacto" type="email" {...register('email_contacto')} />
        {errors.email_contacto && <p className="text-sm text-red-500">{errors.email_contacto.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input id="telefono" {...register('telefono')} />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}
