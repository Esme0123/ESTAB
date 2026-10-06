-- ============================================================
-- Estab Group S.R.L. - Migración: Marca / Procedencia + Categorías oficiales
-- Base de datos: estab_bd
--
-- Ejecutar en phpMyAdmin (pestaña SQL) o en la consola de MySQL.
-- Adaptado al esquema real del proyecto:
--   * productos.precio_referencial (NO existe la columna "precio")
--   * categorias(id, nombre) con UNIQUE en nombre
--   * productos.categoria_id tiene FK hacia categorias(id),
--     por lo que NO se puede hacer TRUNCATE mientras haya productos.
--
-- Orden lógico:
--   1) Nuevas columnas
--   2) Alta de las categorías nuevas (ids 5 a 8)
--   3) Reasignación de los productos de las categorías antiguas
--   4) Limpieza de categorías antiguas sin productos
--   5) Alta/actualización de las 8 categorías oficiales
--
-- El script es idempotente: se puede ejecutar cuantas veces haga falta
-- (las columnas solo se crean si no existen y las categorías se reasignan
-- por nombre). Para migraciones automáticas del backend existe
-- backend/api/migrate.php, que hace el mismo trabajo con detección de columnas.
-- ============================================================

USE `estab_bd`;

-- ------------------------------------------------------------
-- 1) Marca y Procedencia en productos (idempotente: solo si no existen)
-- ------------------------------------------------------------
SET @existe = (SELECT COUNT(*) FROM `information_schema`.`COLUMNS`
                WHERE `TABLE_SCHEMA` = 'estab_bd'
                  AND `TABLE_NAME`   = 'productos'
                  AND `COLUMN_NAME` IN ('marca', 'procedencia'));
SET @sql = IF(@existe = 0,
  'ALTER TABLE `productos` ADD COLUMN `marca` VARCHAR(100) NULL AFTER `precio_referencial`,
                           ADD COLUMN `procedencia` VARCHAR(100) NULL AFTER `marca`',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ------------------------------------------------------------
-- 1b) Descripción e ícono en categorías (idempotente)
-- ------------------------------------------------------------
SET @existe = (SELECT COUNT(*) FROM `information_schema`.`COLUMNS`
                WHERE `TABLE_SCHEMA` = 'estab_bd'
                  AND `TABLE_NAME`   = 'categorias'
                  AND `COLUMN_NAME` IN ('descripcion', 'icono'));
SET @sql = IF(@existe = 0,
  'ALTER TABLE `categorias` ADD COLUMN `descripcion` VARCHAR(200) NULL AFTER `nombre`,
                             ADD COLUMN `icono` VARCHAR(60) NULL AFTER `descripcion`',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ------------------------------------------------------------
-- 2) Categorías nuevas (ids 5 a 8): se insertan ANTES de reasignar
--    productos, porque la reenvasación apunta al id 5.
-- ------------------------------------------------------------
INSERT INTO `categorias` (`id`, `nombre`, `descripcion`, `icono`) VALUES
(5, 'Material de Limpieza y Corporativo', 'Insumos de higiene, desinfectantes y productos corporativos', 'Sparkles'),
(6, 'Maquinaria Industrial y Ferretería', 'Maquinaria pesada, industrial y herramientas de ferretería', 'Wrench'),
(7, 'Electrodomésticos y Material Eléctrico', 'Línea blanca, electrodomésticos e instalaciones eléctricas', 'Zap'),
(8, 'Confección y Textiles en General', 'Confección de textiles, uniformes y ropa en general', 'Scissors')
ON DUPLICATE KEY UPDATE
  `nombre`      = VALUES(`nombre`),
  `descripcion` = VALUES(`descripcion`),
  `icono`       = VALUES(`icono`);

-- ------------------------------------------------------------
-- 3) Reasignar productos de las categorías antiguas a las nuevas
--    (se hace por NOMBRE para que sea seguro repetir el script)
--      Equipamiento Médico / Insumos Médicos            -> 1
--      Mobiliario de Laboratorio y Clínica              -> 2
--      Material Corporativo y Limpieza                  -> 5
-- ------------------------------------------------------------
UPDATE `productos` p
  JOIN `categorias` c ON c.id = p.categoria_id
   SET p.categoria_id = CASE c.nombre
         WHEN 'Equipamiento Médico'                THEN 1
         WHEN 'Insumos Médicos'                    THEN 1
         WHEN 'Mobiliario de Laboratorio y Clínica' THEN 2
         WHEN 'Material Corporativo y Limpieza'     THEN 5
         ELSE p.categoria_id
       END
 WHERE c.nombre IN (
         'Equipamiento Médico',
         'Insumos Médicos',
         'Mobiliario de Laboratorio y Clínica',
         'Material Corporativo y Limpieza'
       );

-- ------------------------------------------------------------
-- 4) Eliminar las categorías antiguas que ya no tienen productos
-- ------------------------------------------------------------
DELETE FROM `categorias`
 WHERE `nombre` NOT IN (
         'Equipamiento y Prendas Médicas',
         'Mobiliario de Oficina y Clínica',
         'Equipos de Computación y Audiovisual',
         'Material de Escritorio y Papelería',
         'Material de Limpieza y Corporativo',
         'Maquinaria Industrial y Ferretería',
         'Electrodomésticos y Material Eléctrico',
         'Confección y Textiles en General'
       )
   AND `id` NOT IN (
         SELECT `categoria_id` FROM (SELECT `categoria_id` FROM `productos`) t
       );

-- ------------------------------------------------------------
-- 5) Listado oficial de las 8 categorías (ids fijos 1 a 8)
-- ------------------------------------------------------------
INSERT INTO `categorias` (`id`, `nombre`, `descripcion`, `icono`) VALUES
(1, 'Equipamiento y Prendas Médicas', 'Equipamiento médico, insumos, prendas y ropa hospitalaria', 'Stethoscope'),
(2, 'Mobiliario de Oficina y Clínica', 'Mobiliario ergonómico de oficina, clínico y de laboratorio', 'Building2'),
(3, 'Equipos de Computación y Audiovisual', 'Computadoras, laptops, material educativo y equipos audiovisuales', 'Laptop'),
(4, 'Material de Escritorio y Papelería', 'Material de escritorio, suministros de oficina y papelería general', 'FileText'),
(5, 'Material de Limpieza y Corporativo', 'Insumos de higiene, desinfectantes y productos corporativos', 'Sparkles'),
(6, 'Maquinaria Industrial y Ferretería', 'Maquinaria pesada, industrial y herramientas de ferretería', 'Wrench'),
(7, 'Electrodomésticos y Material Eléctrico', 'Línea blanca, electrodomésticos e instalaciones eléctricas', 'Zap'),
(8, 'Confección y Textiles en General', 'Confección de textiles, uniformes y ropa en general', 'Scissors')
ON DUPLICATE KEY UPDATE
  `nombre`      = VALUES(`nombre`),
  `descripcion` = VALUES(`descripcion`),
  `icono`       = VALUES(`icono`);

SET @max_cat = (SELECT COALESCE(MAX(`id`), 8) FROM `categorias`);
SET @sql = CONCAT('ALTER TABLE `categorias` AUTO_INCREMENT = ', @max_cat + 1);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
