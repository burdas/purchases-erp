import Link from 'next/link'
import { LayoutDashboard, Users, ShoppingCart, FileText } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Proveedores', href: '/proveedores', icon: Users },
  { name: 'Pedidos', href: '/pedidos', icon: ShoppingCart },
  { name: 'Facturas', href: '/facturas', icon: FileText },
]

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <span className="text-xl font-bold">ERP Compras</span>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-800 hover:text-white"
          >
            <item.icon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-white" aria-hidden="true" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
