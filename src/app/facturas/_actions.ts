'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function getFacturas() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('factura')
    .select('*, proveedor(nombre)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createFactura(facturaData: any, pedidosRelacionados: { pedido_id: string, importe_imputado: number }[]) {
  const supabase = await createClient()

  // Sanitize data: convert empty strings to null for optional fields
  const sanitizedFactura = {
    ...facturaData,
    fecha_vencimiento: facturaData.fecha_vencimiento || null,
    notas: facturaData.notas || null
  }

  const { data: factura, error: facturaError } = await supabase
    .from('factura')
    .insert([sanitizedFactura])
    .select()
    .single()

  if (facturaError) throw new Error(facturaError.message)

  if (pedidosRelacionados.length > 0) {
    const relations = pedidosRelacionados.map(rel => ({
      factura_id: factura.id,
      pedido_id: rel.pedido_id,
      importe_imputado: rel.importe_imputado
    }))

    const { error: relError } = await supabase
      .from('factura_pedido')
      .insert(relations)

    if (relError) throw new Error(relError.message)
  }

  revalidatePath('/facturas')
  return factura
}

export async function updateEstadoFactura(id: string, estado: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('factura')
    .update({ estado })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/facturas')
}
