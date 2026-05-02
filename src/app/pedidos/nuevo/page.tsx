'use client'

import { useRouter } from 'next/navigation'
import { PedidoForm } from '../PedidoForm'
import { createPedido } from '../_actions'
import { toast } from 'sonner'

export default function NuevoPedidoPage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      const { lineas, ...pedidoData } = data
      const importe_total = lineas.reduce((acc: number, curr: any) => acc + curr.importe_linea, 0)
      
      await createPedido({ ...pedidoData, importe_total }, lineas)
      toast.success('Pedido creado correctamente')
      router.push('/pedidos')
    } catch (error: any) {
      toast.error('Error al crear pedido: ' + error.message)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Crear Nuevo Pedido</h1>
      <PedidoForm onSubmit={handleSubmit} onCancel={() => router.push('/pedidos')} />
    </div>
  )
}
