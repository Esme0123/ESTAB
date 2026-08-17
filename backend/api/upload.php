<?php
/**
 * POST /backend/api/upload.php
 * Recibe un archivo de imagen, lo guarda en backend/uploads/ y retorna la URL pública.
 * Solo usuarios con rol Admin pueden subir imágenes.
 */

require __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Método no permitido'], 405);
}

requireAdmin();

if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['error' => 'No se recibió un archivo válido'], 422);
}

$file = $_FILES['file'];

$allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowed, true)) {
    jsonResponse(['error' => 'Formato de imagen no permitido (jpg, png, webp, gif)'], 422);
}

if ($file['size'] > 5 * 1024 * 1024) {
    jsonResponse(['error' => 'La imagen supera el tamaño máximo de 5 MB'], 422);
}

$uploadDir = dirname(__DIR__) . '/uploads';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0775, true);
}

$filename = 'prod_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;

if (!move_uploaded_file($file['tmp_name'], $uploadDir . '/' . $filename)) {
    jsonResponse(['error' => 'No se pudo guardar la imagen'], 500);
}

$scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$basePath = rtrim(dirname($_SERVER['SCRIPT_NAME'], 2), '/');
$publicPath = $basePath . '/uploads/' . $filename;

jsonResponse([
    'url' => $scheme . '://' . $host . $publicPath,
]);