'use client'

import { useState } from 'react'
import { Proveedor } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ProveedorForm } from './ProveedorForm'
import { createProveedor, updateProveedor, deleteProveedor } from './_actions'
import { toast } from 'sonner'
import { Search, Plus, Pencil, Trash2 } from 'lucide-react'

interface ProveedoresClientProps {
  initialData: Proveedor[]
}

export function ProveedoresClient({ initialData }: ProveedoresClientProps) {
  const [proveedores, setProveedores] = useState<Proveedor[]>(initialData)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null)

  const filteredProveedores = proveedores.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.nif?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  const handleCreate = async (data: any) => {
    try {
      await createProveedor(data)
      setIsCreateOpen(false)
      toast.success('Proveedor creado correctamente')
      // In a real app, revalidatePath would handle this, 
      // but for immediate UI feedback we might need to refresh or fetch again.
      // For this MVP, we'll assume the page refresh will happen or we update local state.
      window.location.reload() 
    } catch (error: any) {
      toast.error('Error al crear proveedor: ' + error.message)
    }
  }

  const handleUpdate = async (data: any) => {
    if (!editingProveedor) return
    try {
      await updateProveedor(editingProveedor.id, data)
      setEditingProveedor(null)
      toast.success('Proveedor actualizado correctamente')
      window.location.reload()
    } catch (error: any) {
      toast.error('Error al actualizar proveedor: ' + error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este proveedor?')) return
    try {
      await deleteProveedor(id)
      toast.success('Proveedor eliminado correctamente')
      window.location.reload()
    } catch (error: any) {
      toast.error('Error al eliminar proveedor: ' + error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Proveedor
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Proveedor</DialogTitle>
            </DialogHeader>
            <ProveedorForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por nombre o NIF..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>NIF</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProveedores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron proveedores.
                </TableCell>
              </TableRow>
            ) : (
              filteredProveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell className="font-medium">{proveedor.nombre}</TableCell>
                  <TableCell>{proveedor.nif || '-'}</TableCell>
                  <TableCell>{proveedor.email_contacto || '-'}</TableCell>
                  <TableCell>{proveedor.telefono || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProveedor(proveedor)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(proveedor.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingProveedor} onOpenChange={(open) => !open && setEditingProveedor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
          </DialogHeader>
          {editingProveedor && (
            <ProveedorForm
              initialData={editingProveedor}
              onSubmit={handleUpdate}
              onCancel={() => setEditingProveedor(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
