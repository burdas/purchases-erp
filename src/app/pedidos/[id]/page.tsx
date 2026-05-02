import { getPedido, updateEstadoPedido } from '../_actions'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { ArrowLeft, AlertCircle } from 'lucide-react'
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
                  <TableHead>Estado Recepción</TableHead> {/* Campo añadido */}
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
                    <TableCell> {/* Campo añadido */}
                      <Badge variant="outline" className={`
                        ${linea.estado_recepcion === 'pendiente' ? 'bg-gray-100 text-gray-800' : ''}
                        ${linea.estado_recepcion === 'recibido_parcial' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${linea.estado_recepcion === 'recibido_completo' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {linea.estado_recepcion.toUpperCase()}
                      </Badge>
                    </TableCell>
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
              {/* Campo activo y created_at del proveedor (si fuera necesario mostrarlo) */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalles Adicionales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm"><span className="text-gray-500">Creado por:</span> {pedido.creado_por ? pedido.usuario?.nombre : 'N/A'}</p> {/* Campo añadido */}
              <p className="text-sm"><span className="text-gray-500">Fecha Pedido:</span> {format(new Date(pedido.fecha_pedido), 'dd/MM/yyyy')}</p>
              {pedido.fecha_entrega_esperada && (
                <p className="text-sm"><span className="text-gray-500">Entrega Esperada:</span> {format(new Date(pedido.fecha_entrega_esperada), 'dd/MM/yyyy')}</p>
              )}
              <p className="text-sm"><span className="text-gray-500">Fecha Recepción Doc.:</span> {pedido.fecha_recepcion_doc ? format(new Date(pedido.fecha_recepcion_doc), 'dd/MM/yyyy HH:mm') : '-'}</p> {/* Campo añadido */}
              {pedido.tiene_incidencia && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-red-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> Incidencia Detectada
                  </p>
                  <p className="text-sm text-red-500">{pedido.motivo_incidencia}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sección para la recepción de líneas de pedido si fuera necesario editarla */}
          {pedido.linea_pedido && pedido.linea_pedido.some((linea: any) => linea.estado_recepcion !== 'recibido_completo') && (
            <Card>
              <CardHeader>
                <CardTitle>Recepción de Líneas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">Actualiza la cantidad recibida y el estado para cada línea.</p>
                {pedido.linea_pedido.map((linea: any) => (
                  <div key={linea.id} className="grid grid-cols-3 gap-3 mb-4 last:mb-0 items-center">
                    <div className="col-span-1">
                      <p className="text-sm font-medium">{linea.descripcion}</p>
                    </div>
                    <div className="col-span-1">
                      <Label className="text-xs">Recibido</Label>
                      <Input type="number" defaultValue={linea.cantidad_recibida} min={0} max={linea.cantidad} className="text-sm p-1 h-8" />
                    </div>
                    <div className="col-span-1">
                      <Label className="text-xs">Estado</Label>
                      <Select defaultValue={linea.estado_recepcion}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="recibido_parcial">Recibido Parcial</SelectItem>
                          <SelectItem value="recibido_completo">Recibido Completo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
                {/* Botón para guardar cambios de recepción - MVP no implementado */}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
