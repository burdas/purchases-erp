import { getFactura, updateEstadoFactura } from '../_actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, AlertCircle, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const statusColors: Record<string, string> = {
  recibida: 'bg-gray-100 text-gray-800',
  en_validacion: 'bg-blue-100 text-blue-800',
  aprobada: 'bg-green-100 text-green-800',
  rechazada: 'bg-red-100 text-red-800',
  pagada: 'bg-purple-100 text-purple-800',
}

export default async function FacturaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const factura = await getFactura(id)

  if (!factura) return <div>Factura no encontrada</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/facturas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Factura {factura.numero_factura}</h1>
        <Badge className={statusColors[factura.estado] || 'bg-gray-100'} variant="outline">
          {factura.estado.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de Factura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Fecha Factura</p>
                  <p className="font-medium">{format(new Date(factura.fecha_factura), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">{factura.importe_total?.toFixed(2)}€</p>
                </div>
              </div>
              {factura.pedido && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Pedido Relacionado</p>
                  <Link href={`/pedidos/${factura.pedido.id}`} className="flex items-center text-blue-600 hover:underline">
                    <FileText className="h-4 w-4 mr-1" /> Pedido {factura.pedido.numero}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proveedor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold">{factura.proveedor?.nombre}</p>
              <p className="text-sm text-gray-500">NIF: {factura.proveedor?.nif}</p>
              <p className="text-sm text-gray-500">{factura.proveedor?.email_contacto}</p>
              <p className="text-sm text-gray-500">{factura.proveedor?.telefono}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalles Adicionales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm"><span className="text-gray-500">Fecha Recepción Doc.:</span> {factura.fecha_recepcion_doc ? format(new Date(factura.fecha_recepcion_doc), 'dd/MM/yyyy HH:mm') : '-'}</p>
              {factura.tiene_incidencia && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-red-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> Incidencia Detectada
                  </p>
                  <p className="text-sm text-red-500">{factura.motivo_incidencia}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
