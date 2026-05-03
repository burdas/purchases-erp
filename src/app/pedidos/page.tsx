import Link from 'next/link'
import { getPedidos } from './_actions'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, AlertCircle, FileText, ArrowUpRightIcon } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

const statusColors: Record<string, string> = {
  borrador: 'bg-gray-100 text-gray-800',
  enviado: 'bg-blue-100 text-blue-800',
  confirmado: 'bg-green-100 text-green-800',
  recibido_parcial: 'bg-yellow-100 text-yellow-800',
  cerrado: 'bg-purple-100 text-purple-800',
  cancelado: 'bg-red-100 text-red-800',
}

export default async function PedidosPage() {
  let pedidos = []
  try {
    pedidos = await getPedidos()
  } catch (error) {
    console.error('Error fetching pedidos:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
        <Link href="/pedidos/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Pedido
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Creado por</TableHead> {/* Columna añadida */}
              <TableHead>Total</TableHead>
              <TableHead>Factura</TableHead>
              <TableHead>Incidencia</TableHead> {/* Columna añadida */}
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center"> {/* Colspan aumentado */}
                  No se encontraron pedidos.
                </TableCell>
              </TableRow>
            ) : (
              pedidos.map((pedido: any) => (
                <TableRow key={pedido.id}>
                  <TableCell className="font-medium">{pedido.numero}</TableCell>
                  <TableCell>
                    {format(new Date(pedido.fecha_pedido), 'dd MMM yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>{pedido.proveedor?.nombre}</TableCell>
                  <TableCell>{pedido.usuario?.nombre}</TableCell> {/* Campo añadido */}
                  <TableCell>{pedido.importe_total?.toFixed(2)}€</TableCell>
                  <TableCell>
                    {pedido.factura ? (
                      <Badge variant="secondary" className="cursor-pointer hover:border-gray-500">
                        <Link href={`/facturas/${pedido.factura.id}`}>
                          {pedido.factura.numero_factura} <ArrowUpRightIcon className="h-3 w-3 ml-1 inline" />
                        </Link>
                      </Badge>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell> {/* Campo añadido: Incidencia */}
                    {pedido.tiene_incidencia && (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[pedido.estado] || 'bg-gray-100'} variant="outline">
                      {pedido.estado.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/pedidos/${pedido.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
