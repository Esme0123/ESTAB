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
        nombre VARCHAR(120) NOT NULL UNIQUE,
        descripcion VARCHAR(200) NULL,
        icono VARCHAR(60) NULL
    ) ENGINE=InnoDB',

    'productos' => 'CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(180) NOT NULL,
        descripcion TEXT,
        precio_referencial DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        marca VARCHAR(100) NULL,
        procedencia VARCHAR(100) NULL,
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

// ---------- Columnas nuevas en bases de datos existentes (idempotente) ----------
$columnaNueva = static function (string $tabla, string $columna, string $alterSql) use ($db): void {
    $stmt = $db->prepare(
        'SELECT COUNT(*) FROM information_schema.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?'
    );
    $stmt->execute([$tabla, $columna]);
    if ((int) $stmt->fetchColumn() === 0) {
        $db->exec($alterSql);
    }
};

$columnaNueva(
    'productos',
    'marca',
    'ALTER TABLE productos ADD COLUMN marca VARCHAR(100) NULL AFTER precio_referencial'
);
$columnaNueva(
    'productos',
    'procedencia',
    'ALTER TABLE productos ADD COLUMN procedencia VARCHAR(100) NULL AFTER marca'
);
$columnaNueva(
    'categorias',
    'descripcion',
    'ALTER TABLE categorias ADD COLUMN descripcion VARCHAR(200) NULL AFTER nombre'
);
$columnaNueva(
    'categorias',
    'icono',
    'ALTER TABLE categorias ADD COLUMN icono VARCHAR(60) NULL AFTER descripcion'
);

// ---------- Siembra de datos iniciales (solo si están vacías) ----------

$rolesCount = (int) $db->query('SELECT COUNT(*) FROM roles')->fetchColumn();
if ($rolesCount === 0) {
    $stmt = $db->prepare('INSERT INTO roles (nombre) VALUES (?)');
    $stmt->execute(['Admin']);
    $stmt->execute(['Ventas']);
}

$categoriasCount = (int) $db->query('SELECT COUNT(*) FROM categorias')->fetchColumn();

// ---------- Categorías oficiales (registro oficial de la empresa) ----------
$CATEGORIAS_OFICIALES = [
    1 => ['nombre' => 'Equipamiento y Prendas Médicas', 'descripcion' => 'Equipamiento médico, insumos, prendas y ropa hospitalaria', 'icono' => 'Stethoscope'],
    2 => ['nombre' => 'Mobiliario de Oficina y Clínica', 'descripcion' => 'Mobiliario ergonómico de oficina, clínico y de laboratorio', 'icono' => 'Building2'],
    3 => ['nombre' => 'Equipos de Computación y Audiovisual', 'descripcion' => 'Computadoras, laptops, material educativo y equipos audiovisuales', 'icono' => 'Laptop'],
    4 => ['nombre' => 'Material de Escritorio y Papelería', 'descripcion' => 'Material de escritorio, suministros de oficina y papelería general', 'icono' => 'FileText'],
    5 => ['nombre' => 'Material de Limpieza y Corporativo', 'descripcion' => 'Insumos de higiene, desinfectantes y productos corporativos', 'icono' => 'Sparkles'],
    6 => ['nombre' => 'Maquinaria Industrial y Ferretería', 'descripcion' => 'Maquinaria pesada, industrial y herramientas de ferretería', 'icono' => 'Wrench'],
    7 => ['nombre' => 'Electrodomésticos y Material Eléctrico', 'descripcion' => 'Línea blanca, electrodomésticos e instalaciones eléctricas', 'icono' => 'Zap'],
    8 => ['nombre' => 'Confección y Textiles en General', 'descripcion' => 'Confección de textiles, uniformes y ropa en general', 'icono' => 'Scissors'],
];

// Categorías históricas reemplazadas por el listado oficial => id destino.
$CATEGORIAS_ANTIGUAS = [
    'Equipamiento Médico' => 1,
    'Insumos Médicos' => 1,
    'Mobiliario de Laboratorio y Clínica' => 2,
    'Material Corporativo y Limpieza' => 5,
];

$nombresOficiales = array_column($CATEGORIAS_OFICIALES, 'nombre');

/** Mueve una categoría a otro id liberando la FK de los productos. */
$moverCategoria = static function (int $desde, int $hasta) use ($db): void {
    if ($desde === $hasta) {
        return;
    }
    $tmp = (int) $db->query('SELECT COALESCE(MAX(id), 0) + 1 FROM categorias')->fetchColumn();
    $db->prepare('INSERT INTO categorias (id, nombre) VALUES (?, ?)')->execute([$tmp, '__tmp_' . $tmp]);
    $db->prepare('UPDATE productos SET categoria_id = ? WHERE categoria_id = ?')->execute([$tmp, $desde]);
    $db->prepare('UPDATE categorias SET id = ? WHERE id = ?')->execute([$hasta, $desde]);
    $db->prepare('UPDATE productos SET categoria_id = ? WHERE categoria_id = ?')->execute([$hasta, $tmp]);
    $db->prepare('DELETE FROM categorias WHERE id = ?')->execute([$tmp]);
};

$nombreExiste = static function (string $nombre) use ($db): ?int {
    $stmt = $db->prepare('SELECT id FROM categorias WHERE nombre = ?');
    $stmt->execute([$nombre]);
    $row = $stmt->fetch();
    return $row ? (int) $row['id'] : null;
};

$idLibre = static function (int $id) use ($db): bool {
    $stmt = $db->prepare('SELECT id FROM categorias WHERE id = ?');
    $stmt->execute([$id]);
    return !$stmt->fetch();
};

if ($categoriasCount > 0) {
    // A) Dar de alta primero las categorías NUEVAS (ids 5 a 8): la
    //    reasignación de productos de más abajo apunta a esos ids.
    foreach ($CATEGORIAS_OFICIALES as $id => $cat) {
        if ($id <= 4 || $nombreExiste($cat['nombre']) !== null || !$idLibre($id)) {
            continue;
        }
        $db->prepare('INSERT INTO categorias (id, nombre, descripcion, icono) VALUES (?, ?, ?, ?)')
            ->execute([$id, $cat['nombre'], $cat['descripcion'], $cat['icono']]);
    }

    // B) Reasignar los productos de las categorías antiguas (por nombre).
    foreach ($CATEGORIAS_ANTIGUAS as $vieja => $nueva) {
        if (!isset($CATEGORIAS_OFICIALES[$nueva])) {
            continue;
        }
        $db->prepare(
            'UPDATE productos p
               JOIN categorias c ON c.id = p.categoria_id
                SET p.categoria_id = ?
              WHERE c.nombre = ? AND p.categoria_id <> ?'
        )->execute([$nueva, $vieja, $nueva]);
    }
}

// C) Asegurar las 8 categorías oficiales con sus ids fijos.
//    Fase 1: mover a su id oficial las categorías que ya existen con ese
//    nombre (se hace antes de absorber para no pisar nombres oficiales).
foreach ($CATEGORIAS_OFICIALES as $id => $cat) {
    $existenteId = $nombreExiste($cat['nombre']);
    if ($existenteId !== null && $existenteId !== $id && $idLibre($id)) {
        $moverCategoria($existenteId, $id);
    }
}

//    Fase 2: crear las que falten en el id oficial libre.
foreach ($CATEGORIAS_OFICIALES as $id => $cat) {
    if ($nombreExiste($cat['nombre']) === null && $idLibre($id)) {
        $db->prepare('INSERT INTO categorias (id, nombre, descripcion, icono) VALUES (?, ?, ?, ?)')
            ->execute([$id, $cat['nombre'], $cat['descripcion'], $cat['icono']]);
    }
}

//    Fase 3: descripción / ícono + absorción de los ids oficiales ocupados.
foreach ($CATEGORIAS_OFICIALES as $id => $cat) {
    $existenteId = $nombreExiste($cat['nombre']);

    if ($existenteId === null) {
        // El id oficial lo ocupa una categoría que NO es oficial: absorbe el
        // id (no se pierden los productos que ya apuntan a él).
        $stmt = $db->prepare('SELECT nombre FROM categorias WHERE id = ?');
        $stmt->execute([$id]);
        $ocupante = $stmt->fetch();
        if ($ocupante && in_array($ocupante['nombre'], $nombresOficiales, true)) {
            continue; // nunca pisar otro nombre oficial
        }
        $db->prepare('UPDATE categorias SET nombre = ?, descripcion = ?, icono = ? WHERE id = ?')
            ->execute([$cat['nombre'], $cat['descripcion'], $cat['icono'], $id]);
        continue;
    }

    $db->prepare('UPDATE categorias SET descripcion = ?, icono = ? WHERE id = ?')
        ->execute([$cat['descripcion'], $cat['icono'], $existenteId]);
}

// D) Limpieza: retira las categorías que ya no son oficiales y sin productos.
$placeholders = implode(',', array_fill(0, count($nombresOficiales), '?'));
$db->prepare(
    "DELETE FROM categorias
      WHERE nombre NOT IN ({$placeholders})
        AND id NOT IN (SELECT categoria_id FROM (SELECT categoria_id FROM productos) t)"
)->execute($nombresOficiales);

$maxCat = (int) $db->query('SELECT COALESCE(MAX(id), 8) FROM categorias')->fetchColumn();
$db->exec('ALTER TABLE categorias AUTO_INCREMENT = ' . ($maxCat + 1));

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