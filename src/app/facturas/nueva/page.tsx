'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFactura } from '../_actions'
import { getProveedores } from '../../proveedores/_actions'
import { Proveedor } from '@/types'
import { toast } from 'sonner'

const facturaSchema = z.object({
  numero_factura: z.string().min(1, 'Número de factura requerido'),
  proveedor_id: z.string().uuid('Proveedor requerido'),
  importe_bruto: z.number().min(0),
  importe_iva: z.number().min(0),
  importe_total: z.number().min(0),
  fecha_factura: z.string(),
  fecha_vencimiento: z.string().optional().nullable(),
  notas: z.string().optional(),
})

type FacturaFormValues = z.infer<typeof facturaSchema>

export default function NuevaFacturaPage() {
  const router = useRouter()
  const [proveedores, setProveedores] = useState<Proveedor[]>([])

  useEffect(() => {
    getProveedores().then(setProveedores).catch(console.error)
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FacturaFormValues>({
    resolver: zodResolver(facturaSchema),
    defaultValues: {
      fecha_factura: new Date().toISOString().split('T')[0],
      importe_bruto: 0,
      importe_iva: 0,
      importe_total: 0,
    },
  })

  const bruto = watch('importe_bruto')
  const iva = watch('importe_iva')

  useEffect(() => {
    setValue('importe_total', (Number(bruto) || 0) + (Number(iva) || 0))
  }, [bruto, iva, setValue])

  const onSubmit = async (data: any) => {
    try {
      await createFactura(data, [])
      toast.success('Factura registrada correctamente')
      router.push('/facturas')
    } catch (error: any) {
      toast.error('Error al registrar factura: ' + error.message)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Registrar Nueva Factura</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Datos de la Factura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proveedor_id">Proveedor</Label>
                <Select onValueChange={(value) => setValue('proveedor_id', value)}>
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
                <Label htmlFor="numero_factura">Número de Factura</Label>
                <Input id="numero_factura" {...register('numero_factura')} />
                {errors.numero_factura && <p className="text-sm text-red-500">{errors.numero_factura.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_factura">Fecha Factura</Label>
                <Input id="fecha_factura" type="date" {...register('fecha_factura')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_vencimiento">Vencimiento</Label>
                <Input id="fecha_vencimiento" type="date" {...register('fecha_vencimiento')} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="importe_bruto">Base Imponible</Label>
                <Input
                  id="importe_bruto"
                  type="number"
                  step="0.01"
                  {...register('importe_bruto', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="importe_iva">IVA</Label>
                <Input
                  id="importe_iva"
                  type="number"
                  step="0.01"
                  {...register('importe_iva', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label>Total</Label>
                <Input
                  type="number"
                  readOnly
                  className="bg-gray-50 font-bold"
                  {...register('importe_total', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Notas</Label>
              <textarea
                id="notas"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('notas')}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push('/facturas')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar Factura'}
          </Button>
        </div>
      </form>
    </div>
  )
}
