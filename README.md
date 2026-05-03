# Purchases ERP - MVP

Sistema de gestión de compras y facturación desarrollado con **Next.js 15**, **Supabase** y **Tailwind CSS**. Este ERP permite gestionar proveedores, pedidos de compra y la recepción de facturas, facilitando el matching entre ellas.

## 🚀 Tecnologías Principales

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript.
- **Backend:** Supabase (PostgreSQL, Auth, RLS).
- **Estilos:** Tailwind CSS, Radix UI (Base UI).
- **Formularios:** React Hook Form + Zod.
- **Base de Datos:** PostgreSQL con migraciones y seeding automatizado.

## 📂 Estructura del Proyecto

```text
purchases-erp-wsl/
├── src/
│   ├── app/                # Rutas y Server Actions (Next.js App Router)
│   │   ├── facturas/       # Gestión de facturas recibidas
│   │   ├── pedidos/        # Gestión de órdenes de compra
│   │   └── proveedores/    # Gestión de catálogo de proveedores
│   ├── components/         # Componentes UI (shadcn/ui adaptado)
│   ├── lib/                # Configuración de Supabase y utilidades
│   └── types/              # Definiciones de tipos TypeScript
├── supabase/
│   ├── migrations/         # Esquema de base de datos (001_init.sql)
│   └── seed.sql            # Datos de prueba (Proveedores, Pedidos, etc.)
├── scripts/                # Scripts de automatización (Seeding)
└── .github/workflows/      # Automatización CI/CD (GitHub Actions)
```

## 🛠️ Configuración Local

### 1. Requisitos
- Node.js 20+ 
- pnpm

### 2. Variables de Entorno
Crea un archivo `.env.local` basado en las claves necesarias para Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
DATABASE_URL=postgresql://postgres.ID_PROYECTO:PASSWORD@HOST_POOLER:6543/postgres
```

### 3. Instalación
```bash
pnpm install
```

### 4. Inicializar Base de Datos
Puedes cargar los datos de prueba (`seed.sql`) de dos formas:

- **Local:** Ejecuta `pnpm db:seed` (requiere `DATABASE_URL` configurado).
- **Manual:** Copia el contenido de `supabase/seed.sql` y ejecútalo en el SQL Editor de Supabase.

### 5. Desarrollo
```bash
pnpm dev
```

## 📊 Modelo de Datos (ERD)

A continuación se muestra el diagrama entidad-relación de la base de datos, reflejando la estructura actual tras las migraciones (incluyendo la relación 1:1 entre Pedidos y Facturas):

```mermaid
erDiagram
    usuario ||--o{ pedido : "creado_por"
    proveedor ||--o{ pedido : "proveedor_id"
    proveedor ||--o{ factura : "proveedor_id"
    pedido ||--o{ linea_pedido : "pedido_id"
    pedido |o--o| factura : "factura_id"

    usuario {
        uuid id PK
        varchar nombre
        varchar email
        varchar rol
        boolean activo
        timestamptz created_at
    }

    proveedor {
        uuid id PK
        varchar nombre
        varchar nif
        varchar email_contacto
        varchar telefono
        boolean activo
        timestamptz created_at
    }

    pedido {
        uuid id PK
        varchar numero
        uuid proveedor_id FK
        uuid creado_por FK
        varchar estado
        numeric importe_total
        timestamptz fecha_pedido
        date fecha_entrega_esperada
        text notas
        boolean tiene_incidencia
        text motivo_incidencia
        uuid factura_id FK
        timestamptz created_at
        timestamptz updated_at
    }

    linea_pedido {
        uuid id PK
        uuid pedido_id FK
        varchar descripcion
        integer cantidad
        varchar unidad
        numeric precio_unitario
        numeric importe_linea
        integer cantidad_recibida
        timestamptz fecha_recepcion
        varchar estado_recepcion
    }

    factura {
        uuid id PK
        varchar numero_factura
        uuid proveedor_id FK
        numeric importe_bruto
        numeric importe_iva
        numeric importe_total
        varchar estado
        date fecha_factura
        timestamptz fecha_recepcion_doc
        date fecha_vencimiento
        text notas
        boolean tiene_incidencia
        text motivo_incidencia
        timestamptz created_at
        timestamptz updated_at
    }
```

## 🔄 Automatización (GitHub Actions)

El proyecto incluye un workflow de GitHub que sincroniza los datos de prueba:
- **Seed Database:** Se ejecuta automáticamente al hacer push a la rama `main` si el archivo `supabase/seed.sql` ha cambiado. Requiere el secret `DATABASE_URL` en GitHub.

## 📝 Scripts Disponibles

- `pnpm dev`: Inicia el servidor de desarrollo.
- `pnpm build`: Crea la versión de producción (valida tipos y linting).
- `pnpm db:seed`: Ejecuta el script de carga de datos en la DB remota.
- `pnpm lint`: Ejecuta el análisis estático de código.

---
Desarrollado como prototipo funcional para la gestión de compras corporativas.
