'use client'

import { useRouter } from 'next/navigation'
import { PedidoForm } from '../../PedidoForm'
import { updatePedido } from '../../_actions'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { getPedido } from '../../_actions'

import { use } from 'react'

import { Pedido, LineaPedido } from '@/types'

export default function EditPedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [initialData, setInitialData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPedido(id)
      .then((pedido: Pedido & { linea_pedido: LineaPedido[] }) => {
        // Transform data for the form
        const formData = {
          ...pedido,
          fecha_pedido: pedido.fecha_pedido ? new Date(pedido.fecha_pedido).toISOString().split('T')[0] : '',
          fecha_entrega_esperada: pedido.fecha_entrega_esperada || '',
          lineas: pedido.linea_pedido.map((l: LineaPedido) => ({
            descripcion: l.descripcion,
            cantidad: l.cantidad,
            unidad: l.unidad,
            precio_unitario: l.precio_unitario,
            importe_linea: l.importe_linea,
          }))
        }
        setInitialData(formData)
        setLoading(false)
      })
      .catch((error: Error) => {
        toast.error('Error al cargar pedido: ' + error.message)
        router.push('/pedidos')
      })
  }, [id, router])

  const handleSubmit = async (data: any) => {
    try {
      const { lineas, ...pedidoData } = data
      const importe_total = lineas.reduce((acc: number, curr: any) => acc + curr.importe_linea, 0)
      
      await updatePedido(id, { ...pedidoData, importe_total }, lineas)
      toast.success('Pedido actualizado correctamente')
      router.push(`/pedidos/${id}`)
    } catch (error: any) {
      toast.error('Error al actualizar pedido: ' + error.message)
    }
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Editar Pedido</h1>
      <PedidoForm 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        onCancel={() => router.push(`/pedidos/${id}`)} 
      />
    </div>
  )
}
