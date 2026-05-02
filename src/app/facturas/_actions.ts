'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function getFacturas() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('factura')
    .select('*, proveedor(nombre), pedido(id, numero)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createFactura(facturaData: any, pedidosRelacionados: { pedido_id: string }[]) {
  const supabase = await createClient()

  // Sanitize data: convert empty strings to null for optional fields
  const sanitizedFactura = {
    ...facturaData,
    fecha_vencimiento: facturaData.fecha_vencimiento || null,
    notas: facturaData.notas || null,
    motivo_incidencia: facturaData.motivo_incidencia || null
  }

  const { data: factura, error: facturaError } = await supabase
    .from('factura')
    .insert([sanitizedFactura])
    .select()
    .single()

  if (facturaError) throw new Error(facturaError.message)

  // Link invoices to orders (1:1 per order)
  if (pedidosRelacionados.length > 0) {
    for (const rel of pedidosRelacionados) {
      const { error: updateError } = await supabase
        .from('pedido')
        .update({ factura_id: factura.id })
        .eq('id', rel.pedido_id)

      if (updateError) throw new Error(updateError.message)
    }
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
