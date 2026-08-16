<?php
/**
 * POST /backend/api/login.php
 * Autenticación por email y password.
 * Retorna token, nombre, email y rol.
 */

require __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Método no permitido'], 405);
}

$input = jsonBody();
$email = strtolower(trim($input['email'] ?? ''));
$password = $input['password'] ?? '';

if ($email === '' || $password === '') {
    jsonResponse(['error' => 'Email y contraseña son obligatorios'], 422);
}

$stmt = db()->prepare(
    'SELECT u.id, u.nombre, u.email, u.password, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON r.id = u.rol_id
      WHERE u.email = ?'
);
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    jsonResponse(['error' => 'Credenciales incorrectas. Verifica e inténtalo de nuevo.'], 401);
}

jsonResponse([
    'token'  => generateToken((int) $user['id']),
    'nombre' => $user['nombre'],
    'email'  => $user['email'],
    'rol'    => $user['rol'],
]);