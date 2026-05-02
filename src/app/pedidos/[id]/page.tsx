import { getPedido, updateEstadoPedido } from '../_actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const statusColors: Record<string, string> = {
  borrador: 'bg-gray-100 text-gray-800',
  enviado: 'bg-blue-100 text-blue-800',
  confirmado: 'bg-green-100 text-green-800',
  recibido_parcial: 'bg-yellow-100 text-yellow-800',
  cerrado: 'bg-purple-100 text-purple-800',
  cancelado: 'bg-red-100 text-red-800',
}

export default async function PedidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pedido = await getPedido(id)

  if (!pedido) return <div>Pedido no encontrado</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/pedidos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Pedido {pedido.numero}</h1>
        <Badge className={statusColors[pedido.estado] || 'bg-gray-100'} variant="outline">
          {pedido.estado.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Líneas de Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Recibido</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Importe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedido.linea_pedido?.map((linea: any) => (
                  <TableRow key={linea.id}>
                    <TableCell>{linea.descripcion}</TableCell>
                    <TableCell>{linea.cantidad} {linea.unidad}</TableCell>
                    <TableCell>{linea.cantidad_recibida} {linea.unidad}</TableCell>
                    <TableCell>{linea.precio_unitario.toFixed(2)}€</TableCell>
                    <TableCell>{linea.importe_linea.toFixed(2)}€</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Pedido</p>
                <p className="text-2xl font-bold">{pedido.importe_total?.toFixed(2)}€</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proveedor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold">{pedido.proveedor?.nombre}</p>
              <p className="text-sm text-gray-500">NIF: {pedido.proveedor?.nif}</p>
              <p className="text-sm text-gray-500">{pedido.proveedor?.email_contacto}</p>
              <p className="text-sm text-gray-500">{pedido.proveedor?.telefono}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalles de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm"><span className="text-gray-500">Fecha Pedido:</span> {format(new Date(pedido.fecha_pedido), 'dd/MM/yyyy')}</p>
              {pedido.fecha_entrega_esperada && (
                <p className="text-sm"><span className="text-gray-500">Entrega Esperada:</span> {format(new Date(pedido.fecha_entrega_esperada), 'dd/MM/yyyy')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
