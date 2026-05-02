import Link from 'next/link'
import { getFacturas } from './_actions'
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
import { Plus, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

const statusColors: Record<string, string> = {
  recibida: 'bg-gray-100 text-gray-800',
  en_validacion: 'bg-blue-100 text-blue-800',
  aprobada: 'bg-green-100 text-green-800',
  rechazada: 'bg-red-100 text-red-800',
  pagada: 'bg-purple-100 text-purple-800',
}

export default async function FacturasPage() {
  let facturas = []
  try {
    facturas = await getFacturas()
  } catch (error) {
    console.error('Error fetching facturas:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Facturas</h1>
        <Link href="/facturas/nueva">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nueva Factura
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
              <TableHead>Total</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facturas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron facturas.
                </TableCell>
              </TableRow>
            ) : (
              facturas.map((factura: any) => (
                <TableRow key={factura.id}>
                  <TableCell className="font-medium">{factura.numero_factura}</TableCell>
                  <TableCell>
                    {format(new Date(factura.fecha_factura), 'dd MMM yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>{factura.proveedor?.nombre}</TableCell>
                  <TableCell>{factura.importe_total?.toFixed(2)}€</TableCell>
                  <TableCell>
                    {factura.factura_pedido?.length > 0 ? (
                      <Badge variant="secondary">
                        {factura.factura_pedido.length} {factura.factura_pedido.length === 1 ? 'pedido' : 'pedidos'}
                      </Badge>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[factura.estado] || 'bg-gray-100'} variant="outline">
                      {factura.estado.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" disabled>
                      <Eye className="h-4 w-4" />
                    </Button>
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
