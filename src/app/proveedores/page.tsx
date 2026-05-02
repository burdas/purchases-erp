import { getProveedores } from './_actions'
import { ProveedoresClient } from './proveedores-client'

export const dynamic = 'force-dynamic'

export default async function ProveedoresPage() {
  let proveedores = []
  try {
    proveedores = await getProveedores()
  } catch (error) {
    console.error('Error fetching proveedores:', error)
  }

  return <ProveedoresClient initialData={proveedores} />
}
