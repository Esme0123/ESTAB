-- ============================================================
-- Estab Group S.R.L. - Esquema de Base de Datos (MySQL 8+)
-- ============================================================

CREATE DATABASE IF NOT EXISTS estab_group
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE estab_group;

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
  nombre VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ---------- Productos ----------
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(180) NOT NULL,
  descripcion TEXT,
  precio_referencial DECIMAL(10,2) NOT NULL DEFAULT 0.00,
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

INSERT INTO categorias (nombre) VALUES
  ('Equipamiento Médico'),
  ('Mobiliario de Laboratorio y Clínica'),
  ('Insumos Médicos'),
  ('Material Corporativo y Limpieza');

-- Contraseña de ambos usuarios de prueba: password
INSERT INTO usuarios (nombre, email, password, rol_id) VALUES
  ('Administrador', 'admin@estabgroup.com',
   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
  ('Ventas', 'ventas@estabgroup.com',
   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2);