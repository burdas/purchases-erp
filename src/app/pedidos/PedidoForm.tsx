'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Plus, AlertCircle } from 'lucide-react'
import { Proveedor, Usuario } from '@/types'
import { getProveedores, getUsuarios } from './_actions'

const lineaSchema = z.object({
  descripcion: z.string().min(1, 'Descripción requerida'),
  cantidad: z.number().min(1, 'Mínimo 1'),
  unidad: z.string(),
  precio_unitario: z.number().min(0, 'Precio inválido'),
  importe_linea: z.number(),
})

const pedidoSchema = z.object({
  proveedor_id: z.string().uuid('Proveedor requerido'),
  creado_por: z.string().uuid('Usuario requerido').optional(), // Campo añadido
  numero: z.string().min(1, 'Número requerido'),
  fecha_pedido: z.string().min(1, 'Fecha requerida'),
  fecha_entrega_esperada: z.string().optional().nullable(),
  notas: z.string().optional(),
  tiene_incidencia: z.boolean().default(false), // Campo añadido
  motivo_incidencia: z.string().optional(), // Campo añadido
  lineas: z.array(lineaSchema).min(1, 'Debe haber al menos una línea'),
})

type PedidoFormValues = z.infer<typeof pedidoSchema>

interface PedidoFormProps {
  onSubmit: (data: PedidoFormValues) => void
  onCancel: () => void
}

export function PedidoForm({ onSubmit, onCancel }: PedidoFormProps) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([]) // Estado para usuarios

  useEffect(() => {
    getProveedores().then(setProveedores).catch(console.error)
    getUsuarios().then(setUsuarios).catch(console.error) // Fetch users
  }, [])

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      numero: `PED-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fecha_pedido: new Date().toISOString().split('T')[0],
      lineas: [{ descripcion: '', cantidad: 1, unidad: 'ud', precio_unitario: 0, importe_linea: 0 }],
      tiene_incidencia: false, // Valor por defecto para incidencia
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineas',
  })

  const lineas = watch('lineas')
  const total = lineas.reduce((acc, curr) => acc + (curr.importe_linea || 0), 0)
  const tieneIncidencia = watch('tiene_incidencia') // Observar el estado de incidencia

  const updateImporte = (index: number) => {
    const cantidad = watch(`lineas.${index}.cantidad`)
    const precio = watch(`lineas.${index}.precio_unitario`)
    setValue(`lineas.${index}.importe_linea`, (Number(cantidad) || 0) * (Number(precio) || 0))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proveedor_id">Proveedor</Label>
                <Select onValueChange={(value) => setValue('proveedor_id', (value ?? '') as string)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.proveedor_id && <p className="text-sm text-red-500">{errors.proveedor_id.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="creado_por">Solicitante</Label> {/* Campo añadido */}
                <Select onValueChange={(value) => setValue('creado_por', (value ?? '') as string)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar solicitante" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.creado_por && <p className="text-sm text-red-500">{errors.creado_por.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número de Pedido</Label>
              <Input id="numero" {...register('numero')} />
              {errors.numero && <p className="text-sm text-red-500">{errors.numero.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_pedido">Fecha Pedido</Label>
                <Input id="fecha_pedido" type="date" {...register('fecha_pedido')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_entrega_esperada">Entrega Esperada</Label>
                <Input id="fecha_entrega_esperada" type="date" {...register('fecha_entrega_esperada')} />
              </div>
            </div>
            
            {/* Sección de Incidencia */}
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tiene_incidencia" 
                  checked={tieneIncidencia}
                  onCheckedChange={(checked) => setValue('tiene_incidencia', checked === true)}
                />
                <Label htmlFor="tiene_incidencia" className="flex items-center gap-2 cursor-pointer">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  ¿Tiene alguna incidencia?
                </Label>
              </div>

              {tieneIncidencia && (
                <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-1">
                  <Label htmlFor="motivo_incidencia">Motivo de la Incidencia</Label>
                  <textarea
                    id="motivo_incidencia"
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...register('motivo_incidencia')}
                    placeholder="Describe el problema..."
                  />
                  {errors.motivo_incidencia && <p className="text-sm text-red-500">{errors.motivo_incidencia.message}</p>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register('notas')}
              placeholder="Notas adicionales para el pedido..."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Líneas de Pedido</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ descripcion: '', cantidad: 1, unidad: 'ud', precio_unitario: 0, importe_linea: 0 })}
          >
            <Plus className="mr-2 h-4 w-4" /> Añadir Línea
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-4 items-end border-b pb-4 last:border-0">
                <div className="col-span-5 space-y-2">
                  <Label>Descripción</Label>
                  <Input {...register(`lineas.${index}.descripcion` as const)} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Cant.</Label>
                  <Input
                    type="number"
                    {...register(`lineas.${index}.cantidad` as const, {
                      valueAsNumber: true,
                      onChange: () => updateImporte(index),
                    })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Precio</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`lineas.${index}.precio_unitario` as const, {
                      valueAsNumber: true,
                      onChange: () => updateImporte(index),
                    })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Importe</Label>
                  <Input
                    type="number"
                    readOnly
                    className="bg-gray-50"
                    {...register(`lineas.${index}.importe_linea` as const, { valueAsNumber: true })}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Pedido</p>
              <p className="text-3xl font-bold">{total.toFixed(2)}€</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar Pedido'}
        </Button>
      </div>
    </form>
  )
}


      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Líneas de Pedido</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ descripcion: '', cantidad: 1, unidad: 'ud', precio_unitario: 0, importe_linea: 0 })}
          >
            <Plus className="mr-2 h-4 w-4" /> Añadir Línea
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-4 items-end border-b pb-4 last:border-0">
                <div className="col-span-5 space-y-2">
                  <Label>Descripción</Label>
                  <Input {...register(`lineas.${index}.descripcion` as const)} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Cant.</Label>
                  <Input
                    type="number"
                    {...register(`lineas.${index}.cantidad` as const, {
                      valueAsNumber: true,
                      onChange: () => updateImporte(index),
                    })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Precio</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`lineas.${index}.precio_unitario` as const, {
                      valueAsNumber: true,
                      onChange: () => updateImporte(index),
                    })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Importe</Label>
                  <Input
                    type="number"
                    readOnly
                    className="bg-gray-50"
                    {...register(`lineas.${index}.importe_linea` as const, { valueAsNumber: true })}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Pedido</p>
              <p className="text-3xl font-bold">{total.toFixed(2)}€</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar Pedido'}
        </Button>
      </div>
    </form>
  )
}
