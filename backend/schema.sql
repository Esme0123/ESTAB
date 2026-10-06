-- ============================================================
-- Estab Group S.R.L. - Esquema de Base de Datos (MySQL 8+)
-- ============================================================

CREATE DATABASE IF NOT EXISTS estab_group_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE estab_group_db;

-- ---------- Roles ----------
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ---------- Usuarios ----------
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol_id INT NOT NULL,
  CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles(id)
) ENGINE=InnoDB;

-- ---------- Categorias ----------
CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL UNIQUE,
  descripcion VARCHAR(200) NULL,
  icono VARCHAR(60) NULL
) ENGINE=InnoDB;

-- ---------- Productos ----------
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(180) NOT NULL,
  descripcion TEXT,
  precio_referencial DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  marca VARCHAR(100) NULL,
  procedencia VARCHAR(100) NULL,
  categoria_id INT NOT NULL,
  estado TINYINT NOT NULL DEFAULT 1,
  CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB;

-- ---------- Imagenes de producto ----------
CREATE TABLE IF NOT EXISTS producto_imagenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  url_imagen VARCHAR(500) NOT NULL,
  CONSTRAINT fk_imagenes_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- Especificaciones de producto ----------
CREATE TABLE IF NOT EXISTS producto_especificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  especificacion VARCHAR(500) NOT NULL,
  CONSTRAINT fk_specs_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- Datos iniciales
-- ============================================================

INSERT INTO roles (nombre) VALUES ('Admin'), ('Ventas');

INSERT INTO categorias (id, nombre, descripcion, icono) VALUES
  (1, 'Equipamiento y Prendas Médicas', 'Equipamiento médico, insumos, prendas y ropa hospitalaria', 'Stethoscope'),
  (2, 'Mobiliario de Oficina y Clínica', 'Mobiliario ergonómico de oficina, clínico y de laboratorio', 'Building2'),
  (3, 'Equipos de Computación y Audiovisual', 'Computadoras, laptops, material educativo y equipos audiovisuales', 'Laptop'),
  (4, 'Material de Escritorio y Papelería', 'Material de escritorio, suministros de oficina y papelería general', 'FileText'),
  (5, 'Material de Limpieza y Corporativo', 'Insumos de higiene, desinfectantes y productos corporativos', 'Sparkles'),
  (6, 'Maquinaria Industrial y Ferretería', 'Maquinaria pesada, industrial y herramientas de ferretería', 'Wrench'),
  (7, 'Electrodomésticos y Material Eléctrico', 'Línea blanca, electrodomésticos e instalaciones eléctricas', 'Zap'),
  (8, 'Confección y Textiles en General', 'Confección de textiles, uniformes y ropa en general', 'Scissors');

-- Contraseña de ambos usuarios de prueba: password
INSERT INTO usuarios (nombre, email, password, rol_id) VALUES
  ('Administrador', 'admin@estabgroup.com',
   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
  ('Ventas', 'ventas@estabgroup.com',
   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2);