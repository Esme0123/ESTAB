<?php
/**
 * Estab Group S.R.L. - Configuración central
 * Conexión PDO a MySQL + CORS + helpers de autenticación por token.
 */

declare(strict_types=1);

/**
 * Orígenes permitidos por CORS.
 * - Para desarrollo local (Vite) se autoriza http://localhost:5173
 * - En producción se incluye el dominio de GoDaddy.
 * Dejar como '*' permite cualquier origen (útil durante la migración).
 */
const ALLOWED_ORIGINS = [
    'http://localhost:5173',      // dev server de Vite
    'http://127.0.0.1:5173',
    'https://estab.com.bo', // <- GoDaddy (producción)
    '*',                          // wildcard (permite cualquier origen durante la migración)
];

// ---------- CORS ----------
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Con credenciales (cookies de sesión) el navegador exige un origen concreto:
// un comodín '*' haría fallar la validación CORS del lado del cliente.
if ($requestOrigin !== '' && in_array($requestOrigin, ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $requestOrigin);
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');

const DB_HOST = 'localhost';
const DB_PORT = 3306;
const DB_NAME = 'estab_bd';
const DB_USER = 'esme';
const DB_PASS = 'chochocomani123.';

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
        $name = getenv('DB_NAME') ?: 'estab_bd';
        $user = getenv('DB_USER') ?: 'esme';
        $pass = getenv('DB_PASSWORD') ?: 'chochocomani123.';
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

/**
 * Convierte cualquier valor recibido por JSON en texto limpio y acotado.
 */
function textValue($value, int $maxLength = 0): string
{
    if (!is_scalar($value)) {
        return '';
    }
    $text = trim((string) $value);
    if ($maxLength > 0) {
        $text = mb_substr($text, 0, $maxLength);
    }
    return $text;
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

/**
 * Indica si el origen de la petición está permitido.
 * Las peticiones del mismo origen no envía cabecera Origin y se consideran de confianza.
 */
function originIsAllowed(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return true;
    }
    if (in_array($origin, ALLOWED_ORIGINS, true)) {
        return true;
    }

    // Petición del mismo origen que sirve la API.
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if ($host === '') {
        return false;
    }
    $scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';

    return $origin === $scheme . '://' . $host;
}

/**
 * Inicia la sesión PHP (PHPSESSID) para permitir autenticación por cookie.
 * - $force = true  -> siempre inicia sesión (login).
 * - $force = false -> sólo si el cliente ya envío la cookie de sesión.
 */
function startPhpSession(bool $force = false): bool
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return true;
    }
    if (headers_sent()) {
        return false;
    }

    if (!$force) {
        $name = session_name();
        if (empty($_COOKIE[$name]) && empty($_GET[$name]) && empty($_POST[$name])) {
            return false;
        }
    }

    return session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
        'use_strict_mode' => 1,
        'use_only_cookies' => 1,
    ]);
}

/**
 * Crea la sesión PHP con los datos del usuario autenticado.
 */
function loginPhpSession(array $user): void
{
    if (!startPhpSession(true)) {
        return;
    }
    $_SESSION['usuario'] = [
        'id'     => (int) $user['id'],
        'nombre' => $user['nombre'] ?? '',
        'email'  => $user['email'] ?? '',
        'rol'    => $user['rol'] ?? '',
    ];
    $_SESSION['user_id'] = (int) $user['id'];
}

function destroyPhpSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                (bool) $params['secure'],
                (bool) $params['httponly']
            );
        }
        session_destroy();
    }
}

/**
 * Busca el usuario en la base de datos a partir de su id.
 */
function fetchUserById(int $userId): ?array
{
    if ($userId <= 0) {
        return null;
    }

    $stmt = db()->prepare(
        'SELECT u.id, u.nombre, u.email, r.nombre AS rol
           FROM usuarios u
           JOIN roles r ON r.id = u.rol_id
          WHERE u.id = ?'
    );
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    return $user ?: null;
}

/**
 * Autenticación por cabecera Authorization: Bearer <token>.
 */
function bearerUser(): ?array
{
    $auth = authorizationHeader();
    if (!$auth || !preg_match('/Bearer\s+(.+)/i', $auth, $m)) {
        return null;
    }

    $tokenData = decodeToken(trim($m[1]));
    if (!$tokenData) {
        return null;
    }

    return fetchUserById((int) $tokenData['user_id']);
}

/**
 * Autenticación por sesión PHP (PHPSESSID).
 */
function sessionUser(): ?array
{
    // Una cookie de sesión sólo se acepta desde orígenes permitidos (anti-CSRF).
    if (!originIsAllowed()) {
        return null;
    }
    if (!startPhpSession(false)) {
        return null;
    }

    $userId = 0;
    if (isset($_SESSION['usuario']['id'])) {
        $userId = (int) $_SESSION['usuario']['id'];
    } elseif (isset($_SESSION['user_id'])) {
        $userId = (int) $_SESSION['user_id'];
    }

    if ($userId <= 0) {
        return null;
    }

    return fetchUserById($userId);
}

/**
 * Usuario autenticado: se acepta sesión PHP o token Bearer.
 * Devuelve null cuando la petición es pública.
 */
function authUser(): ?array
{
    $user = bearerUser();
    if ($user) {
        return $user;
    }
    return sessionUser();
}

function requireAdmin(): array
{
    $user = authUser();
    if (!$user) {
        jsonResponse(['error' => 'Sesión no válida o expirada. Inicia sesión nuevamente.'], 401);
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
        jsonResponse(['error' => 'Sesión no válida o expirada. Inicia sesión nuevamente.'], 401);
    }
    return $user;
}