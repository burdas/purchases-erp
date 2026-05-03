'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { Pedido, LineaPedido } from '@/types'

export async function getPedidos() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pedido')
    .select('*, proveedor(nombre), factura(id, numero_factura), usuario(nombre)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getPedido(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pedido')
    .select('*, proveedor(*), linea_pedido(*), usuario(nombre)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getUsuarios() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('activo', true)
    .order('nombre', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function createPedido(pedidoData: Partial<Pedido>, lineas: Partial<LineaPedido>[]) {
  const supabase = await createClient()
  
  // Sanitize data: convert empty strings to null for optional fields
  const sanitizedPedido = {
    ...pedidoData,
    fecha_entrega_esperada: pedidoData.fecha_entrega_esperada || null,
    notas: pedidoData.notas || null,
    motivo_incidencia: pedidoData.motivo_incidencia || null,
    creado_por: pedidoData.creado_por || null
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

export async function updatePedido(id: string, pedidoData: Partial<Pedido>, lineas: Partial<LineaPedido>[]) {
  const supabase = await createClient()
  
  // Sanitize data
  const sanitizedPedido = {
    ...pedidoData,
    fecha_entrega_esperada: pedidoData.fecha_entrega_esperada || null,
    notas: pedidoData.notas || null,
    motivo_incidencia: pedidoData.motivo_incidencia || null,
    creado_por: pedidoData.creado_por || null,
    updated_at: new Date().toISOString()
  }

  const { error: pedidoError } = await supabase
    .from('pedido')
    .update(sanitizedPedido)
    .eq('id', id)

  if (pedidoError) throw new Error(pedidoError.message)

  // For lines, the simplest approach for MVP is delete and re-insert
  // though for production a more surgical update is preferred.
  const { error: deleteError } = await supabase
    .from('linea_pedido')
    .delete()
    .eq('pedido_id', id)

  if (deleteError) throw new Error(deleteError.message)

  const lineasWithPedidoId = lineas.map(linea => ({
    ...linea,
    pedido_id: id
  }))

  const { error: lineasError } = await supabase
    .from('linea_pedido')
    .insert(lineasWithPedidoId)

  if (lineasError) throw new Error(lineasError.message)

  revalidatePath('/pedidos')
  revalidatePath(`/pedidos/${id}`)
  return { success: true }
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
