-- Seed data for Proveedores
INSERT INTO proveedor (nombre, nif, email_contacto, telefono) VALUES
('Suministros Industriales S.A.', 'A12345678', 'contacto@sumindustriales.com', '912345678'),
('Papelería Técnica S.L.', 'B87654321', 'ventas@papeleriatecnica.es', '934567890'),
('Mantenimientos Express', 'G11223344', 'info@mantexpress.com', '955667788');

-- Seed data for Usuarios
INSERT INTO usuario (nombre, email, rol) VALUES
('Admin User', 'admin@erp.com', 'admin'),
('Compras Manager', 'compras@erp.com', 'compras');

-- Seed data for Facturas
INSERT INTO factura (numero_factura, proveedor_id, importe_bruto, importe_iva, importe_total, estado, fecha_factura, fecha_vencimiento, fecha_recepcion_doc, tiene_incidencia, motivo_incidencia) VALUES
('FAC-2024-101', (SELECT id FROM proveedor WHERE nif = 'A12345678'), 150.00, 31.50, 181.50, 'recibida', '2024-01-20', '2024-02-20', '2024-01-20T09:00:00Z', false, NULL),
('FAC-2024-202', (SELECT id FROM proveedor WHERE nif = 'B87654321'), 75.50, 15.85, 91.35, 'aprobada', '2024-01-18', '2024-02-18', '2024-01-18T15:30:00Z', true, 'Falta documentación adicional.');

-- Seed data for Pedidos
INSERT INTO pedido (numero, proveedor_id, creado_por, estado, importe_total, fecha_pedido, fecha_entrega_esperada, tiene_incidencia, motivo_incidencia, factura_id) VALUES
('PED-2024-001', (SELECT id FROM proveedor WHERE nif = 'A12345678'), (SELECT id FROM usuario WHERE email = 'compras@erp.com'), 'borrador', 150.00, '2024-01-10', '2024-01-20', false, NULL, (SELECT id FROM factura WHERE numero_factura = 'FAC-2024-101')),
('PED-2024-002', (SELECT id FROM proveedor WHERE nif = 'B87654321'), (SELECT id FROM usuario WHERE email = 'compras@erp.com'), 'enviado', 75.50, '2024-01-12', '2024-01-15', true, 'Retraso en la entrega por parte del proveedor.', (SELECT id FROM factura WHERE numero_factura = 'FAC-2024-202')),
('PED-2024-003', (SELECT id FROM proveedor WHERE nif = 'G11223344'), (SELECT id FROM usuario WHERE email = 'compras@erp.com'), 'confirmado', 500.00, '2024-01-15', '2024-01-25', false, NULL, NULL);

-- Seed data for Lineas de Pedido
INSERT INTO linea_pedido (pedido_id, descripcion, cantidad, unidad, precio_unitario, importe_linea, cantidad_recibida, fecha_recepcion, estado_recepcion) VALUES
((SELECT id FROM pedido WHERE numero = 'PED-2024-001'), 'Cinta aislante negra 20m', 10, 'ud', 5.00, 50.00, 10, '2024-01-10T10:00:00Z', 'recibido_completo'),
((SELECT id FROM pedido WHERE numero = 'PED-2024-001'), 'Pack Destornilladores (6 uds)', 4, 'ud', 25.00, 100.00, 2, '2024-01-10T10:00:00Z', 'recibido_parcial'),
((SELECT id FROM pedido WHERE numero = 'PED-2024-002'), 'Papel A4 80g (Caja 5 resmas)', 10, 'caja', 7.55, 75.50, 5, '2024-01-12T11:00:00Z', 'recibido_parcial'),
((SELECT id FROM pedido WHERE numero = 'PED-2024-003'), 'Mantenimiento preventivo climatización Q1', 1, 'ud', 500.00, 500.00, 1, '2024-01-15T14:00:00Z', 'recibido_completo');
