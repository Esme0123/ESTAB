<?php
/**
 * Estab Group S.R.L. - Configuración central
 * Conexión PDO a MySQL + CORS + helpers de autenticación por token.
 */

declare(strict_types=1);

// ---------- CORS ----------
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------- Secretos (cambiar en producción) ----------
const JWT_SECRET = 'estab_group_secret_2026';
const TOKEN_TTL = 28800; // 8 horas en segundos

// ---------- Conexión a la base de datos ----------
function db(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $host = getenv('DB_HOST') ?: 'localhost';
        $name = getenv('DB_NAME') ?: 'estab_group_db';
        $user = getenv('DB_USER') ?: 'root';
        $pass = getenv('DB_PASSWORD') ?: '';
        $port = getenv('DB_PORT') ?: '3306';

        $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";

        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }

    return $pdo;
}

// ---------- Respuestas JSON ----------
function jsonResponse(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonBody(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '[]', true);
    return is_array($data) ? $data : [];
}

// ---------- Tokens ----------
function generateToken(int $userId): string
{
    $payload = $userId . '|' . time();
    $signature = hash_hmac('sha256', $payload, JWT_SECRET);
    return base64_encode($payload . '.' . $signature);
}

function decodeToken(string $token): ?array
{
    $decoded = base64_decode($token, true);
    if ($decoded === false) {
        return null;
    }

    $parts = explode('.', $decoded, 2);
    if (count($parts) !== 2) {
        return null;
    }

    [$payload, $signature] = $parts;

    if (!hash_equals(hash_hmac('sha256', $payload, JWT_SECRET), $signature)) {
        return null;
    }

    $segments = explode('|', $payload);
    if (count($segments) !== 2) {
        return null;
    }

    [$userId, $issued] = array_map('intval', $segments);

    if (time() - $issued > TOKEN_TTL) {
        return null;
    }

    return ['user_id' => $userId, 'issued' => $issued];
}

function authorizationHeader(): ?string
{
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? null;
        if ($auth) {
            return $auth;
        }
    }
    return $_SERVER['HTTP_AUTHORIZATION'] ?? null;
}

function authUser(): ?array
{
    $auth = authorizationHeader();
    if (!$auth || !preg_match('/Bearer\s+(.+)/i', $auth, $m)) {
        return null;
    }

    $tokenData = decodeToken(trim($m[1]));
    if (!$tokenData) {
        return null;
    }

    $stmt = db()->prepare(
        'SELECT u.id, u.nombre, u.email, r.nombre AS rol
           FROM usuarios u
           JOIN roles r ON r.id = u.rol_id
          WHERE u.id = ?'
    );
    $stmt->execute([$tokenData['user_id']]);
    $user = $stmt->fetch();

    return $user ?: null;
}

function requireAdmin(): array
{
    $user = authUser();
    if (!$user) {
        jsonResponse(['error' => 'Token inválido o expirado'], 401);
    }
    if ($user['rol'] !== 'Admin') {
        jsonResponse(['error' => 'No autorizado para esta acción'], 403);
    }
    return $user;
}

function requireStaff(): array
{
    $user = authUser();
    if (!$user) {
        jsonResponse(['error' => 'Token inválido o expirado'], 401);
    }
    return $user;
}