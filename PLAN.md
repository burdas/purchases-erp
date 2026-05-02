# Plan de Desarrollo: ERP de Compras y Facturación (MVP)

## 1. Resumen del Proyecto

El objetivo es construir un Prototipo Mínimo Viable (MVP) de una aplicación para la gestión de compras y facturación. La aplicación permitirá gestionar proveedores, crear y seguir pedidos, y registrar y procesar facturas.

**Prioridad:** Desarrollar un prototipo funcional rápidamente, **omitiendo la capa de autenticación y gestión de usuarios** para centrarse en las funcionalidades clave del negocio.

## 2. Stack Técnico

- **Framework**: Next.js 14+ (App Router)
- **Base de datos**: Supabase (PostgreSQL)
- **UI**: Tailwind CSS + shadcn/ui
- **Lenguaje**: TypeScript
- **Gestor de Paquetes**: pnpm

## 3. Plan de Desarrollo

### Fase 1: Configuración del Proyecto y Base de Datos

1.  **Inicialización del Proyecto Next.js:** Configurar un nuevo proyecto con Next.js, TypeScript y Tailwind CSS.
2.  **Instalación de Dependencias:** Añadir las librerías necesarias: `@supabase/ssr`, `shadcn/ui`, `zod`, `react-hook-form`, `date-fns`.
3.  **Esquema de Base de Datos:**
    - Crear el archivo de migración `supabase/migrations/001_init.sql` basándose en el esquema `compras_v3.dbml`.
    - En el script SQL, la columna `creado_por` de la tabla `pedido` se definirá como opcional (`NULL`) para eliminar la dependencia de la tabla `usuario` en este prototipo.
4.  **Datos de Prueba:** Crear un archivo `supabase/seed.sql` con datos iniciales para proveedores, pedidos y facturas, facilitando el desarrollo y las pruebas.
5.  **Configuración del Entorno:** Crear el archivo `.env.local` y añadir las variables de entorno de Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).

### Fase 2: Layout y Módulos Principales

1.  **Layout y Navegación:** Diseñar un layout principal con una barra lateral estática que contenga los enlaces de navegación a los diferentes módulos de la aplicación (Dashboard, Proveedores, Pedidos, Facturas).
2.  **Módulo de Proveedores:** Implementar la funcionalidad CRUD completa (Crear, Leer, Actualizar, Eliminar) para la gestión de proveedores, incluyendo un listado con capacidades de búsqueda y filtrado.
3.  **Módulo de Pedidos:**
    - Desarrollar el formulario de creación de pedidos, permitiendo añadir líneas de pedido de forma dinámica.
    - Implementar el cálculo automático de importes en el formulario.
    - Crear una página de listado de pedidos con filtros por estado y proveedor.
    - Diseñar una página de detalle del pedido que permita la visualización de sus líneas y la funcionalidad para registrar la recepción de mercancía.

### Fase 3: Módulo de Facturación y Dashboard

1.  **Módulo de Facturas:**
    - Crear el formulario para el registro de nuevas facturas.
    - Implementar la lógica para vincular facturas a uno o varios pedidos existentes de un proveedor.
    - Desarrollar la funcionalidad para gestionar el flujo de estados de una factura (ej. `recibida` -> `aprobada` -> `pagada`).
    - Construir una página de listado de facturas con opciones de filtrado.
2.  **Dashboard:** Diseñar y desarrollar la página principal de la aplicación, que mostrará:
    - Indicadores Clave de Rendimiento (KPIs) como pedidos abiertos, facturas pendientes, etc.
    - Tablas de resumen con los últimos pedidos y facturas registrados.
