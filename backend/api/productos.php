<?php
/**
 * /backend/api/productos.php
 * CRUD de productos para Estab Group S.R.L.
 *
 * GET    -> Lista o detalle. Incluye 'precio_referencial' SOLO si hay token válido
 *           (Admin o Ventas). El público NO ve el precio referencial interno.
 * POST   -> Crear producto (rol Admin).
 * PUT    -> Editar producto + imágenes + especificaciones (rol Admin).
 * DELETE -> Eliminar producto (rol Admin).
 */

require __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$user = authUser(); // null => petición pública

switch ($method) {
    case 'GET':
        handleGet($user);
        break;
    case 'POST':
        handlePost();
        break;
    case 'PUT':
        handlePut();
        break;
    case 'DELETE':
        handleDelete();
        break;
    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}

// ------------------------------------------------------------

function productSelectColumns(bool $includePrice): string
{
    $price = $includePrice ? ', p.precio_referencial' : '';
    return "p.id, p.nombre, p.descripcion, p.categoria_id, c.nombre AS categoria_nombre, p.estado{$price}";
}

function hydrateProduct(array $row): array
{
    $stmt = db()->prepare(
        'SELECT id, url_imagen FROM producto_imagenes WHERE producto_id = ? ORDER BY id ASC'
    );
    $stmt->execute([$row['id']]);
    $row['imagenes'] = $stmt->fetchAll();

    $stmt = db()->prepare(
        'SELECT id, especificacion FROM producto_especificaciones WHERE producto_id = ? ORDER BY id ASC'
    );
    $stmt->execute([$row['id']]);
    $row['especificaciones'] = $stmt->fetchAll();

    return $row;
}

function replaceProductDetails(int $productId, array $imagenes, array $especificaciones): void
{
    $db = db();

    $stmt = $db->prepare('DELETE FROM producto_imagenes WHERE producto_id = ?');
    $stmt->execute([$productId]);

    $stmt = $db->prepare('DELETE FROM producto_especificaciones WHERE producto_id = ?');
    $stmt->execute([$productId]);

    $stmtImg = $db->prepare('INSERT INTO producto_imagenes (producto_id, url_imagen) VALUES (?, ?)');
    foreach (array_values(array_filter($imagenes)) as $url) {
        $stmtImg->execute([$productId, trim($url)]);
    }

    $stmtSpec = $db->prepare(
        'INSERT INTO producto_especificaciones (producto_id, especificacion) VALUES (?, ?)'
    );
    foreach (array_values(array_filter($especificaciones)) as $spec) {
        $stmtSpec->execute([$productId, trim($spec)]);
    }
}

function validateProductPayload(array $input): array
{
    $nombre = trim($input['nombre'] ?? '');
    $categoriaId = (int) ($input['categoria_id'] ?? 0);
    $precio = isset($input['precio_referencial'])
        ? (float) $input['precio_referencial']
        : 0.0;
    $estado = isset($input['estado']) ? (int) $input['estado'] : 1;

    if ($nombre === '') {
        jsonResponse(['error' => 'El nombre del producto es obligatorio'], 422);
    }
    if ($precio < 0) {
        jsonResponse(['error' => 'El precio referencial no puede ser negativo'], 422);
    }
    if ($estado !== 0 && $estado !== 1) {
        jsonResponse(['error' => 'El estado debe ser 0 o 1'], 422);
    }

    $catStmt = db()->prepare('SELECT id FROM categorias WHERE id = ?');
    $catStmt->execute([$categoriaId]);
    if (!$catStmt->fetch()) {
        jsonResponse(['error' => 'La categoría seleccionada no existe'], 422);
    }

    return [
        'nombre'            => $nombre,
        'descripcion'       => trim($input['descripcion'] ?? ''),
        'precio_referencial' => $precio,
        'categoria_id'      => $categoriaId,
        'estado'            => $estado,
        'imagenes'          => is_array($input['imagenes'] ?? null) ? $input['imagenes'] : [],
        'especificaciones'  => is_array($input['especificaciones'] ?? null) ? $input['especificaciones'] : [],
    ];
}

// ------------------------------------------------------------

function handleGet(?array $user): void
{
    $includePrice = $user !== null;
    $db = db();
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id > 0) {
        $stmt = $db->prepare(
            'SELECT ' . productSelectColumns($includePrice) . '
               FROM productos p
               JOIN categorias c ON c.id = p.categoria_id
              WHERE p.id = ?'
        );
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            jsonResponse(['error' => 'Producto no encontrado'], 404);
        }
        jsonResponse(hydrateProduct($row));
    }

    $stmt = $db->query(
        'SELECT ' . productSelectColumns($includePrice) . '
           FROM productos p
           JOIN categorias c ON c.id = p.categoria_id
          ORDER BY p.id DESC'
    );

    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) {
        $row = hydrateProduct($row);
    }

    jsonResponse(['productos' => $rows]);
}

function handlePost(): void
{
    requireAdmin();
    $input = validateProductPayload(jsonBody());

    $db = db();
    $stmt = $db->prepare(
        'INSERT INTO productos (nombre, descripcion, precio_referencial, categoria_id, estado)
         VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $input['nombre'],
        $input['descripcion'],
        $input['precio_referencial'],
        $input['categoria_id'],
        $input['estado'],
    ]);

    $productId = (int) $db->lastInsertId();
    replaceProductDetails($productId, $input['imagenes'], $input['especificaciones']);

    $stmt = $db->prepare(
        'SELECT ' . productSelectColumns(true) . '
           FROM productos p
           JOIN categorias c ON c.id = p.categoria_id
          WHERE p.id = ?'
    );
    $stmt->execute([$productId]);
    jsonResponse(hydrateProduct($stmt->fetch()), 201);
}

function handlePut(): void
{
    requireAdmin();
    $input = validateProductPayload(jsonBody());

    $id = isset($_GET['id']) ? (int) $_GET['id'] : (int) ($input['id'] ?? 0);
    if ($id <= 0) {
        jsonResponse(['error' => 'El id del producto es obligatorio'], 422);
    }

    $db = db();
    $exists = $db->prepare('SELECT id FROM productos WHERE id = ?');
    $exists->execute([$id]);
    if (!$exists->fetch()) {
        jsonResponse(['error' => 'Producto no encontrado'], 404);
    }

    $stmt = $db->prepare(
        'UPDATE productos
            SET nombre = ?, descripcion = ?, precio_referencial = ?, categoria_id = ?, estado = ?
          WHERE id = ?'
    );
    $stmt->execute([
        $input['nombre'],
        $input['descripcion'],
        $input['precio_referencial'],
        $input['categoria_id'],
        $input['estado'],
        $id,
    ]);

    replaceProductDetails($id, $input['imagenes'], $input['especificaciones']);

    $stmt = $db->prepare(
        'SELECT ' . productSelectColumns(true) . '
           FROM productos p
           JOIN categorias c ON c.id = p.categoria_id
          WHERE p.id = ?'
    );
    $stmt->execute([$id]);
    jsonResponse(hydrateProduct($stmt->fetch()));
}

function handleDelete(): void
{
    requireAdmin();
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    if ($id <= 0) {
        jsonResponse(['error' => 'El id del producto es obligatorio'], 422);
    }

    $db = db();
    $exists = $db->prepare('SELECT id FROM productos WHERE id = ?');
    $exists->execute([$id]);
    if (!$exists->fetch()) {
        jsonResponse(['error' => 'Producto no encontrado'], 404);
    }

    // Las filas de imágenes y especificaciones se borran en cascada.
    $stmt = $db->prepare('DELETE FROM productos WHERE id = ?');
    $stmt->execute([$id]);

    jsonResponse(['ok' => true]);
}