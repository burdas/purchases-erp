'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function getPedidos() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pedido')
    .select('*, proveedor(nombre), factura_pedido(factura_id)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getPedido(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pedido')
    .select('*, proveedor(*), linea_pedido(*)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createPedido(pedidoData: any, lineas: any[]) {
  const supabase = await createClient()
  
  // Sanitize data: convert empty strings to null for optional fields
  const sanitizedPedido = {
    ...pedidoData,
    fecha_entrega_esperada: pedidoData.fecha_entrega_esperada || null,
    notas: pedidoData.notas || null
  }

  const { data: pedido, error: pedidoError } = await supabase
    .from('pedido')
    .insert([sanitizedPedido])
    .select()
    .single()

  if (pedidoError) throw new Error(pedidoError.message)

  const lineasWithPedidoId = lineas.map(linea => ({
    ...linea,
    pedido_id: pedido.id
  }))

  const { error: lineasError } = await supabase
    .from('linea_pedido')
    .insert(lineasWithPedidoId)

  if (lineasError) {
    // Should ideally rollback, but for MVP we'll just throw
    throw new Error(lineasError.message)
  }

  revalidatePath('/pedidos')
  return pedido
}

export async function getPedidosByProveedor(proveedorId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pedido')
    .select('*')
    .eq('proveedor_id', proveedorId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function updateEstadoPedido(id: string, estado: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('pedido')
    .update({ estado })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/pedidos')
  revalidatePath(`/pedidos/${id}`)
}
