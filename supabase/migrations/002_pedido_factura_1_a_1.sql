-- 002_pedido_factura_1_a_1.sql

-- 1. Añadir columna factura_id a pedido
ALTER TABLE pedido ADD COLUMN factura_id uuid REFERENCES factura(id);

-- 2. Migrar datos existentes desde factura_pedido
UPDATE pedido p
SET factura_id = fp.factura_id
FROM factura_pedido fp
WHERE p.id = fp.pedido_id;

-- 3. Añadir constraint UNIQUE para asegurar 1:1
ALTER TABLE pedido ADD CONSTRAINT uq_pedido_factura UNIQUE (factura_id);

-- 4. Eliminar tabla intermedia
DROP TABLE factura_pedido;
