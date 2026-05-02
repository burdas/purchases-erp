-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- USUARIO
-- ------------------------------------------------------------
CREATE TABLE usuario (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre     varchar     NOT NULL,
  email      varchar     NOT NULL UNIQUE,
  rol        varchar     NOT NULL, -- 'compras | admin | direccion'
  activo     boolean     NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE usuario IS 'Usuarios del sistema. El rol controla los permisos de acceso.';

-- ------------------------------------------------------------
-- PROVEEDOR
-- ------------------------------------------------------------
CREATE TABLE proveedor (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre         varchar     NOT NULL,
  nif            varchar     UNIQUE, -- 'CIF/NIF del proveedor'
  email_contacto varchar,
  telefono       varchar,
  activo         boolean     NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE proveedor IS 'Catálogo de proveedores homologados.';

-- ------------------------------------------------------------
-- PEDIDO
-- ------------------------------------------------------------
CREATE TABLE pedido (
  id                     uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  numero                 varchar       NOT NULL UNIQUE, -- 'Número legible: PED-2024-0001'
  proveedor_id           uuid          NOT NULL REFERENCES proveedor(id),
  creado_por             uuid          REFERENCES usuario(id), -- Opcional según PLAN.md
  estado                 varchar       NOT NULL DEFAULT 'borrador', -- 'borrador | enviado | confirmado | recibido_parcial | cerrado | cancelado'
  importe_total          numeric(12,2),
  fecha_pedido           timestamptz   NOT NULL DEFAULT now(),
  fecha_entrega_esperada date,
  notas                  text,
  tiene_incidencia       boolean       NOT NULL DEFAULT false,
  motivo_incidencia      text,
  created_at             timestamptz   NOT NULL DEFAULT now(),
  updated_at             timestamptz   NOT NULL DEFAULT now()
);

COMMENT ON TABLE pedido IS 'Cabecera del pedido al proveedor. El estado se recalcula a partir de sus líneas.';

-- ------------------------------------------------------------
-- LINEA_PEDIDO
-- ------------------------------------------------------------
CREATE TABLE linea_pedido (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id         uuid          NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
  descripcion       varchar       NOT NULL,
  cantidad          integer       NOT NULL,
  unidad            varchar, -- 'ud | kg | l | m | caja ...'
  precio_unitario   numeric(12,2) NOT NULL,
  importe_linea     numeric(12,2) NOT NULL, -- 'cantidad * precio_unitario'
  cantidad_recibida integer       NOT NULL DEFAULT 0,
  fecha_recepcion   timestamptz,
  estado_recepcion  varchar       NOT NULL DEFAULT 'pendiente' -- 'pendiente | recibido_parcial | recibido_completo'
);

COMMENT ON TABLE linea_pedido IS 'Líneas del pedido. La recepción se registra directamente aquí en el MVP.';

-- ------------------------------------------------------------
-- FACTURA
-- ------------------------------------------------------------
CREATE TABLE factura (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_factura      varchar       NOT NULL,
  proveedor_id        uuid          NOT NULL REFERENCES proveedor(id),
  importe_bruto       numeric(12,2) NOT NULL,
  importe_iva         numeric(12,2) NOT NULL DEFAULT 0,
  importe_total       numeric(12,2) NOT NULL,
  estado              varchar       NOT NULL DEFAULT 'recibida', -- 'recibida | en_validacion | aprobada | rechazada | pagada'
  fecha_factura       date          NOT NULL,
  fecha_recepcion_doc timestamptz   NOT NULL DEFAULT now(),
  fecha_vencimiento   date,
  notas               text,
  tiene_incidencia    boolean       NOT NULL DEFAULT false,
  motivo_incidencia   text,
  created_at          timestamptz   NOT NULL DEFAULT now(),
  updated_at          timestamptz   NOT NULL DEFAULT now(),
  CONSTRAINT uq_factura_proveedor UNIQUE (numero_factura, proveedor_id)
);

COMMENT ON TABLE factura IS 'Facturas recibidas de proveedores. La constraint única sobre (numero_factura, proveedor_id) previene duplicados.';

-- ------------------------------------------------------------
-- FACTURA_PEDIDO
-- ------------------------------------------------------------
CREATE TABLE factura_pedido (
  factura_id       uuid          NOT NULL REFERENCES factura(id) ON DELETE CASCADE,
  pedido_id        uuid          NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
  importe_imputado numeric(12,2) NOT NULL, -- 'Parte del importe de la factura asignada a este pedido'
  PRIMARY KEY (factura_id, pedido_id)
);

COMMENT ON TABLE factura_pedido IS 'Relación N:M entre facturas y pedidos. Facilita el matching de importes.';
