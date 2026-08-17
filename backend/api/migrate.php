<?php
/**
 * GET/POST /backend/api/migrate.php
 * Auto-migración: crea las tablas (IF NOT EXISTS) y siembra datos iniciales
 * si las tablas están vacías. Ideal para ejecutar al arrancar el servidor
 * (p. ej. en Render) o de forma manual tras desplegar.
 */

require __DIR__ . '/../config/database.php';

$db = db();

// ---------- Creación de tablas (IF NOT EXISTS) ----------
$tables = [
    'roles' => 'CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL UNIQUE
    ) ENGINE=InnoDB',

    'usuarios' => 'CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(120) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        rol_id INT NOT NULL,
        CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles(id)
    ) ENGINE=InnoDB',

    'categorias' => 'CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(120) NOT NULL UNIQUE
    ) ENGINE=InnoDB',

    'productos' => 'CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(180) NOT NULL,
        descripcion TEXT,
        precio_referencial DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        categoria_id INT NOT NULL,
        estado TINYINT NOT NULL DEFAULT 1,
        CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ) ENGINE=InnoDB',

    'producto_imagenes' => 'CREATE TABLE IF NOT EXISTS producto_imagenes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        producto_id INT NOT NULL,
        url_imagen VARCHAR(500) NOT NULL,
        CONSTRAINT fk_imagenes_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
    ) ENGINE=InnoDB',

    'producto_especificaciones' => 'CREATE TABLE IF NOT EXISTS producto_especificaciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        producto_id INT NOT NULL,
        especificacion VARCHAR(500) NOT NULL,
        CONSTRAINT fk_specs_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
    ) ENGINE=InnoDB',
];

foreach ($tables as $sql) {
    $db->exec($sql);
}

// ---------- Siembra de datos iniciales (solo si están vacías) ----------

$rolesCount = (int) $db->query('SELECT COUNT(*) FROM roles')->fetchColumn();
if ($rolesCount === 0) {
    $stmt = $db->prepare('INSERT INTO roles (nombre) VALUES (?)');
    $stmt->execute(['Admin']);
    $stmt->execute(['Ventas']);
}

$categoriasCount = (int) $db->query('SELECT COUNT(*) FROM categorias')->fetchColumn();
if ($categoriasCount === 0) {
    $stmt = $db->prepare('INSERT INTO categorias (nombre) VALUES (?)');
    foreach (
        [
            'Equipamiento Médico',
            'Mobiliario de Laboratorio y Clínica',
            'Insumos Médicos',
            'Material Corporativo y Limpieza',
        ] as $categoria
    ) {
        $stmt->execute([$categoria]);
    }
}

// ---------- Usuarios iniciales (upsert: inserta o actualiza ambos) ----------
// Garantiza que tanto Admin como Ventas existan siempre con hashing BCRYPT consistente.
$roleIds = [];
foreach ($db->query('SELECT id, nombre FROM roles') as $role) {
    $roleIds[$role['nombre']] = (int) $role['id'];
}

$seedUsers = [
    ['nombre' => 'Administrador', 'email' => 'admin@estabgroup.com', 'rol' => 'Admin'],
    ['nombre' => 'Ventas', 'email' => 'ventas@estabgroup.com', 'rol' => 'Ventas'],
];

$upsert = $db->prepare(
    'INSERT INTO usuarios (nombre, email, password, rol_id)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       nombre = VALUES(nombre),
       password = VALUES(password),
       rol_id = VALUES(rol_id)'
);

foreach ($seedUsers as $u) {
    if (!isset($roleIds[$u['rol']])) {
        $stmt = $db->prepare('INSERT INTO roles (nombre) VALUES (?)');
        $stmt->execute([$u['rol']]);
        $roleIds[$u['rol']] = (int) $db->lastInsertId();
    }

    $upsert->execute([
        $u['nombre'],
        $u['email'],
        password_hash('password', PASSWORD_BCRYPT),
        $roleIds[$u['rol']],
    ]);
}

jsonResponse([
    'success' => true,
    'message' => 'Estructura de base de datos sincronizada correctamente',
]);