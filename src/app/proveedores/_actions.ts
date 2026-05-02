'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function getProveedores() {
  const supabase = await createClient()
  
  const { data, error, status, statusText } = await supabase
    .from('proveedor')
    .select('*')

  if (error) {
    console.error('Error de Supabase:', error)
    return []
  }
  
  console.log('--- DEBUG ---')
  console.log('Status:', status, statusText)
  console.log('Filas encontradas:', data?.length)
  
  return data || []
}

export async function createProveedor(formData: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('proveedor').insert([formData])

  if (error) throw new Error(error.message)
  revalidatePath('/proveedores')
}

export async function updateProveedor(id: string, formData: any) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('proveedor')
    .update(formData)
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/proveedores')
}

export async function deleteProveedor(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('proveedor').delete().eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/proveedores')
}
