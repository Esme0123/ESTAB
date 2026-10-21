<?php
/**
 * /backend/api/productos.php
 * CRUD de productos para Estab Group S.R.L.
 *
 * GET    -> Lista o detalle. Incluye 'precio_referencial' SOLO si hay sesión/token válido
 *           (Admin o Ventas). El público NO ve el precio referencial interno.
 * POST   -> Crear producto (rol Admin). Si llega un 'id', actualiza el producto.
 * PUT    -> Editar producto + imágenes + especificaciones (rol Admin).
 * DELETE -> Eliminar producto (rol Admin).
 *
 * La autenticación acepta sesión PHP (PHPSESSID) o cabecera Authorization: Bearer <token>.
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
    case 'PATCH':
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
    return "p.id, p.nombre, p.descripcion, p.marca, p.procedencia, p.categoria_id, c.nombre AS categoria_nombre, p.estado{$price}";
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

/**
 * Normaliza una URL de imagen: acepta cadenas o filas {url_imagen}.
 */
function normalizeImageUrl($value): string
{
    if (is_array($value)) {
        $value = $value['url_imagen'] ?? '';
    }
    return textValue($value, 500);
}

/**
 * Reemplaza las imágenes de un producto (tabla producto_imagenes).
 */
function replaceProductImages(int $productId, array $imagenes): int
{
    $db = db();

    $stmt = $db->prepare('DELETE FROM producto_imagenes WHERE producto_id = ?');
    $stmt->execute([$productId]);

    $stmtImg = $db->prepare('INSERT INTO producto_imagenes (producto_id, url_imagen) VALUES (?, ?)');
    $inserted = 0;
    foreach ($imagenes as $imagen) {
        $url = normalizeImageUrl($imagen);
        if ($url === '') {
            continue;
        }
        $stmtImg->execute([$productId, $url]);
        $inserted++;
    }

    return $inserted;
}

/**
 * Reemplaza las especificaciones de un producto (tabla producto_especificaciones).
 */
function replaceProductSpecifications(int $productId, array $especificaciones): int
{
    $db = db();

    $stmt = $db->prepare('DELETE FROM producto_especificaciones WHERE producto_id = ?');
    $stmt->execute([$productId]);

    $stmtSpec = $db->prepare(
        'INSERT INTO producto_especificaciones (producto_id, especificacion) VALUES (?, ?)'
    );
    $inserted = 0;
    foreach ($especificaciones as $spec) {
        $value = is_array($spec) ? ($spec['especificacion'] ?? '') : $spec;
        $value = textValue($value, 500);
        if ($value === '') {
            continue;
        }
        $stmtSpec->execute([$productId, $value]);
        $inserted++;
    }

    return $inserted;
}

function replaceProductDetails(int $productId, array $imagenes, array $especificaciones): void
{
    replaceProductImages($productId, $imagenes);
    replaceProductSpecifications($productId, $especificaciones);
}

/**
 * Valida y normaliza el payload de productos.
 * - $current: producto existente (opcional). Permite conservar valores
 *   (categoría, estado, precio) cuando el cliente no los envía.
 */
function validateProductPayload(array $input, ?array $current = null): array
{
    $nombre = textValue($input['nombre'] ?? ($current['nombre'] ?? ''));
    $descripcionProvided = array_key_exists('descripcion', $input);
    $precioProvided = array_key_exists('precio_referencial', $input);
    $categoriaProvided = array_key_exists('categoria_id', $input) && (int) $input['categoria_id'] > 0;
    $estadoProvided = array_key_exists('estado', $input) && $input['estado'] !== null && $input['estado'] !== '';

    $categoriaId = $categoriaProvided
        ? (int) $input['categoria_id']
        : (int) ($current['categoria_id'] ?? 0);
    $precio = $precioProvided
        ? (float) $input['precio_referencial']
        : (float) ($current['precio_referencial'] ?? 0);
    $estado = $estadoProvided ? (int) $input['estado'] : (int) ($current['estado'] ?? 1);

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
        'descripcion'       => $descripcionProvided
            ? textValue($input['descripcion'])
            : textValue($current['descripcion'] ?? ''),
        'marca'             => array_key_exists('marca', $input)
            ? textValue($input['marca'], 100)
            : textValue($current['marca'] ?? '', 100),
        'procedencia'       => array_key_exists('procedencia', $input)
            ? textValue($input['procedencia'], 100)
            : textValue($current['procedencia'] ?? '', 100),
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
    $input = jsonBody();

    // POST con 'id' actualiza el producto (compatibilidad con clientes que
    // no pueden enviar PUT).
    $id = (int) ($_GET['id'] ?? ($input['id'] ?? 0));
    if ($id > 0) {
        updateProducto($id, $input);
        return;
    }

    $payload = validateProductPayload($input);

    $db = db();
    $stmt = $db->prepare(
        'INSERT INTO productos (nombre, descripcion, marca, procedencia, precio_referencial, categoria_id, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $payload['nombre'],
        $payload['descripcion'],
        $payload['marca'],
        $payload['procedencia'],
        $payload['precio_referencial'],
        $payload['categoria_id'],
        $payload['estado'],
    ]);

    $productId = (int) $db->lastInsertId();
    replaceProductDetails($productId, $payload['imagenes'], $payload['especificaciones']);

    $stmt = $db->prepare(
        'SELECT ' . productSelectColumns(true) . '
           FROM productos p
           JOIN categorias c ON c.id = p.categoria_id
          WHERE p.id = ?'
    );
    $stmt->execute([$productId]);
    $producto = hydrateProduct($stmt->fetch());

    jsonResponse([
        'success'  => true,
        'message'  => 'Producto creado correctamente',
        'producto' => $producto,
    ] + $producto, 201);
}

function handlePut(): void
{
    requireAdmin();
    $input = jsonBody();

    $id = (int) ($_GET['id'] ?? ($input['id'] ?? 0));
    if ($id <= 0) {
        jsonResponse(['error' => 'El id del producto es obligatorio'], 422);
    }

    updateProducto($id, $input);
}

/**
 * Actualiza el producto (tabla productos) y sus imágenes (producto_imagenes).
 */
function updateProducto(int $id, array $input): void
{
    $db = db();

    $current = $db->prepare(
        'SELECT id, nombre, descripcion, marca, procedencia, precio_referencial, categoria_id, estado
           FROM productos
          WHERE id = ?'
    );
    $current->execute([$id]);
    $row = $current->fetch();
    if (!$row) {
        jsonResponse(['error' => 'Producto no encontrado'], 404);
    }

    $payload = validateProductPayload($input, $row);

    $stmt = $db->prepare(
        'UPDATE productos
            SET nombre = ?, descripcion = ?, marca = ?, procedencia = ?, precio_referencial = ?, categoria_id = ?, estado = ?
          WHERE id = ?'
    );
    $stmt->execute([
        $payload['nombre'],
        $payload['descripcion'],
        $payload['marca'],
        $payload['procedencia'],
        $payload['precio_referencial'],
        $payload['categoria_id'],
        $payload['estado'],
        $id,
    ]);

    // Las imágenes sólo se reemplazan si el cliente envía el arreglo.
    if (array_key_exists('imagenes', $input)) {
        replaceProductImages($id, $payload['imagenes']);
    }
    if (array_key_exists('especificaciones', $input)) {
        replaceProductSpecifications($id, $payload['especificaciones']);
    }

    $stmt = $db->prepare(
        'SELECT ' . productSelectColumns(true) . '
           FROM productos p
           JOIN categorias c ON c.id = p.categoria_id
          WHERE p.id = ?'
    );
    $stmt->execute([$id]);
    $producto = hydrateProduct($stmt->fetch());

    jsonResponse([
        'success'  => true,
        'message'  => 'Producto e imágenes actualizados correctamente',
        'producto' => $producto,
    ] + $producto);
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

    // Las imágenes y especificaciones se borran explícitamente (el cascade
    // de la FK es una red de seguridad, no la única garantía).
    $stmt = $db->prepare('DELETE FROM producto_imagenes WHERE producto_id = ?');
    $stmt->execute([$id]);

    $stmt = $db->prepare('DELETE FROM producto_especificaciones WHERE producto_id = ?');
    $stmt->execute([$id]);

    $stmt = $db->prepare('DELETE FROM productos WHERE id = ?');
    $stmt->execute([$id]);

    jsonResponse(['ok' => true, 'success' => true]);
}