export interface Proveedor {
  id: string
  nombre: string
  nif: string | null
  email_contacto: string | null
  telefono: string | null
  activo: boolean
  created_at: string
}

export interface Pedido {
  id: string
  numero: string
  proveedor_id: string
  creado_por: string | null
  estado: string
  importe_total: number | null
  fecha_pedido: string
  fecha_entrega_esperada: string | null
  notas: string | null
  tiene_incidencia: boolean
  motivo_incidencia: string | null
  created_at: string
  updated_at: string
  proveedor?: Proveedor
  lineas?: LineaPedido[]
}

export interface LineaPedido {
  id: string
  pedido_id: string
  descripcion: string
  cantidad: number
  unidad: string | null
  precio_unitario: number
  importe_linea: number
  cantidad_recibida: number
  fecha_recepcion: string | null
  estado_recepcion: string
}

export interface Factura {
  id: string
  numero_factura: string
  proveedor_id: string
  importe_bruto: number
  importe_iva: number
  importe_total: number
  estado: string
  fecha_factura: string
  fecha_recepcion_doc: string
  fecha_vencimiento: string | null
  notas: string | null
  tiene_incidencia: boolean
  motivo_incidencia: string | null
  created_at: string
  updated_at: string
  proveedor?: Proveedor
  pedidos?: Pedido[]
}

export interface FacturaPedido {
  factura_id: string
  pedido_id: string
  importe_imputado: number
}
