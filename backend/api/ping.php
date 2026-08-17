<?php
/**
 * GET /backend/api/ping.php
 * Endpoint liviano de keep-alive. Retorna HTTP 200 con estado del servicio.
 */

require __DIR__ . '/../config/database.php';

jsonResponse([
    'status' => 'online',
    'time'   => date('c'),
]);