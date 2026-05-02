import { getPedidos } from './pedidos/_actions'
import { getFacturas } from './facturas/_actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, FileText, AlertCircle, Clock } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [pedidos, facturas] = await Promise.all([
    getPedidos().catch(() => []),
    getFacturas().catch(() => [])
  ])

  const pedidosAbiertos = pedidos.filter((p: any) => p.estado !== 'cerrado' && p.estado !== 'cancelado').length
  const facturasPendientes = facturas.filter((f: any) => f.estado !== 'pagada').length
  const totalPedidos = pedidos.reduce((acc: number, curr: any) => acc + (curr.importe_total || 0), 0)
  const totalFacturas = facturas.reduce((acc: number, curr: any) => acc + (curr.importe_total || 0), 0)

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Abiertos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pedidosAbiertos}</div>
            <p className="text-xs text-muted-foreground">Esperando recepción o cierre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facturasPendientes}</div>
            <p className="text-xs text-muted-foreground">Pendientes de pago o aprobación</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volumen Compras</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPedidos.toFixed(2)}€</div>
            <p className="text-xs text-muted-foreground">Importe total de pedidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFacturas.toFixed(2)}€</div>
            <p className="text-xs text-muted-foreground">Importe total de facturas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.slice(0, 5).map((pedido: any) => (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">{pedido.numero}</TableCell>
                    <TableCell>{pedido.proveedor?.nombre}</TableCell>
                    <TableCell>{pedido.importe_total?.toFixed(2)}€</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Facturas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facturas.slice(0, 5).map((factura: any) => (
                  <TableRow key={factura.id}>
                    <TableCell className="font-medium">{factura.numero_factura}</TableCell>
                    <TableCell>{factura.proveedor?.nombre}</TableCell>
                    <TableCell>{factura.importe_total?.toFixed(2)}€</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
