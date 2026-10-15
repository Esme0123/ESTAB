<?php
/**
 * /backend/api/seeder_caranavi.php
 * Seeder masivo de productos extraídos de los Excel de Caranavi.
 *
 * USO:
 *   - Navegador:  GET  seeder_caranavi.php          → panel interactivo HTML
 *   - Ejecución:  POST seeder_caranavi.php  (o GET ?run=1) → ejecuta y retorna JSON
 *   - Endpoint:   curl -X POST https://estab.com.bo/api/seeder_caranavi.php
 *
 * Lógica idempotente: consulta por `nombre` antes de insertar; los duplicados
 * se omiten y se reportan en la respuesta JSON final.
 */

require __DIR__ . '/../config/database.php';

// ---------------------------------------------------------------------------
// Dataset: productos extraídos de los Excel de Caranavi.
// Reemplazar/extendger este array con la extracción definitiva.
// Campos: nombre, descripcion, unidad, grupo_quirurgico, marca, procedencia.
// ---------------------------------------------------------------------------
$PRODUCTOS_CARANAVI = [
    // ---- 1. Equipamiento y Prendas Médicas ----
    ['nombre' => 'Bata Quirúrgica Estéril Azul', 'descripcion' => 'Bata quirúrgica de algodón poliéster, manga larga con puño elástico.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Quirófano - Vestimenta', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Mascarilla Quirúrgica Triplaza', 'descripcion' => 'Mascarilla desechable de 3 capas con clip nasal ajustable.', 'unidad' => 'caja x 50', 'grupo_quirurgico' => 'Protección Personal', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Guante de Nitrilo Talla M (Caja 100)', 'descripcion' => 'Guante de nitrilo sin polvo, texturizado, libre de látex.', 'unidad' => 'caja x 100', 'grupo_quirurgico' => 'Protección Personal', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Jeringa Desechable 5ml con Aguja', 'descripcion' => 'Jeringa estéril de 5 ml con aguja hipodérmica 21G x 1 1/2.', 'unidad' => 'caja x 100', 'grupo_quirurgico' => 'Insumos Básicos', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Estetoscopio Dual Cámara', 'descripcion' => 'Estetoscopio de doble cámara con diafragma y campana pediátrica.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Diagnóstico', 'marca' => 'ESTAB', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Camilla de Exámenes Ajustable', 'descripcion' => 'Camilla clínica de 3 secciones con cojín acolchado y ruedas.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Consultorio', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Máscara de Anestesia Adulto', 'descripcion' => 'Máscara de anestesia silicona transparente con conector estándar.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Anestesiología', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Pinza Kelly Recta 14 cm', 'descripcion' => 'Pinza hemostática de acero inoxidable autoclavable.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Instrumental Quirúrgico', 'marca' => 'ESTAB', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Termómetro Digital Clínico', 'descripcion' => 'Termómetro digital de punta flexible con alarma de fiebre.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Diagnóstico', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Alcohol Gel 70% 500ml', 'descripcion' => 'Gel desinfectante a base de alcohol 70% con glicerina humectante.', 'unidad' => 'frasco x 500ml', 'grupo_quirurgico' => 'Desinfección', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],

    // ---- 2. Mobiliario de Oficina y Clínica ----
    ['nombre' => 'Silla Giratoria Ergonómica Negra', 'descripcion' => 'Silla oficina con soporte lumbar, brazos regulables y base nylon.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Oficina', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Escritorio Ejecutivo 1.60m', 'descripcion' => 'Escritorio de melamina con cajonera lateral y canalización de cables.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Oficina', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Archivo Metálico 4 Cajones', 'descripcion' => 'Archivo de acero con cerradura central y ruedas giratorias.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Oficina', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Mesa de Examen Clínica', 'descripcion' => 'Mesa de examen con cojín de espuma tapizado y altura ajustable.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Consultorio', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Rack de Computación 19" 12U', 'descripcion' => 'Rack cerrado con cristal templado, cerradura y ventiladores.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Oficina', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Silla de Espera Trípode', 'descripcion' => 'Silla de espera con estructura metálica cromada y tapizado vinílico.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Consultorio', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],

    // ---- 3. Equipos de Computación y Audiovisual ----
    ['nombre' => 'Laptop Core i5 16GB RAM 512GB SSD', 'descripcion' => 'Laptop 14" con procesador Intel Core i5, 16 GB RAM y SSD 512 GB.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Cómputo', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Impresora Multifuncional Láser', 'descripcion' => 'Impresora láser blanco y negro con escáner y copiadora integrada.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Cómputo', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Proyector Full HD 4000 Lúmenes', 'descripcion' => 'Proyector DLP Full HD con HDMI, USB y zoom óptico.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Audiovisual', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Monitor LED 24" FHD', 'descripcion' => 'Monitor LED 24 pulgadas Full HD con panel IPS y conectividad HDMI.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Cómputo', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Televisor LED 50" UHD 4K', 'descripcion' => 'Televisor LED 50 pulgadas Ultra HD 4K con Smart TV y Wi-Fi.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Audiovisual', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Pizarra Blanca Magnética 120x90', 'descripcion' => 'Pizarra blanca de superficie cerámica con marco de aluminio.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Audiovisual', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],

    // ---- 4. Material de Escritorio y Papelería ----
    ['nombre' => 'Papel Bond Carta 75g (Resma)', 'descripcion' => 'Papel bond blanco 75 gramos, tamaño carta, 500 hojas por resma.', 'unidad' => 'resma x 500', 'grupo_quirurgico' => 'Papelería', 'marca' => 'GENÉRICO', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Tóner Compatible HP 85A', 'descripcion' => 'Tóner negro compatible con HP LaserJet Pro M125/M127.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Cómputo', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Cuaderno Profesional A4 100Hojas', 'descripcion' => 'Cuaderno profesional cosido con cubierta dura, 100 hojas rayado.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Papelería', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Set de Marcadores Permanentes x12', 'descripcion' => 'Set de marcadores permanentes de punta fina, colores surtidos.', 'unidad' => 'set x 12', 'grupo_quirurgico' => 'Papelería', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Carpetas A4 Clip 5cm (Caja 100)', 'descripcion' => 'Carpetas de archivo con clip metálico, tamaño A4, color azul.', 'unidad' => 'caja x 100', 'grupo_quirurgico' => 'Papelería', 'marca' => 'GENÉRICO', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Calculadora Científica 240 Funciones', 'descripcion' => 'Calculadora científica con pantalla dual y 240 funciones.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Papelería', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],

    // ---- 5. Material de Limpieza y Corporativo ----
    ['nombre' => 'Detergente Industrial 5L', 'descripcion' => 'Detergente concentrado multiusos para pisos y superficies.', 'unidad' => 'bidón x 5L', 'grupo_quirurgico' => 'Limpieza', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Jabón Líquido Antibacterial 1L', 'descripcion' => 'Jabón líquido antibacterial para lavado de manos frecuente.', 'unidad' => 'frasco x 1L', 'grupo_quirurgico' => 'Higiene', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Papel Higiénico Institutional 500m', 'descripcion' => 'Rollo industrial de papel higiénico doble capa, 500 metros.', 'unidad' => 'rollo x 500m', 'grupo_quirurgico' => 'Higiene', 'marca' => 'GENÉRICO', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Toalla de Papel Interdoblada', 'descripcion' => 'Toalla de papel interdoblada blanca para secado de manos.', 'unidad' => 'paquete x 200', 'grupo_quirurgico' => 'Higiene', 'marca' => 'GENÉRICO', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Desinfectante Cloro 5L', 'descripcion' => 'Desinfectante a base de cloro para desinfección general.', 'unidad' => 'bidón x 5L', 'grupo_quirurgico' => 'Desinfección', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Bolsa de Basura 60x90 (Rollo 20)', 'descripcion' => 'Bolsa de basura negra resistente 60x90 pulgadas, rollo de 20.', 'unidad' => 'rollo x 20', 'grupo_quirurgico' => 'Limpieza', 'marca' => 'GENÉRICO', 'procedencia' => 'NACIONAL'],

    // ---- 6. Maquinaria Industrial y Ferretería ----
    ['nombre' => 'Compresor de Aire 50L 2HP', 'descripcion' => 'Compresor de tornillo con tanque de 50 litros y motor 2 HP.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Maquinaria', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Soldadora Inverter 200A', 'descripcion' => 'Máquina de soldar inverter MMA 200A con cable de masa y pinza.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Herramientas', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Taladro Percutor 13mm 750W', 'descripcion' => 'Taladro percutor de 13mm con velocidad variable y maletín.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Herramientas', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Set de Herramientas 108 Piezas', 'descripcion' => 'Set completo de llaves, dados y accesorios en maletín metálico.', 'unidad' => 'set x 108', 'grupo_quirurgico' => 'Herramientas', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Generador Eléctrico 5.5kW Bencina', 'descripcion' => 'Grupo electrógeno a bencina de 5.5 kW con arranque eléctrico.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Maquinaria', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Máquina de Soldar CO2 250A', 'descripcion' => 'Soldadora MIG/MAG CO2 de 250 amperes con ruedas móviles.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Maquinaria', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],

    // ---- 7. Electrodomésticos y Material Eléctrico ----
    ['nombre' => 'Refrigeradora No Frost 420L', 'descripcion' => 'Refrigeradora doble puerta No Frost 420 litros, eficiencia energética A.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Línea Blanca', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Microondas 0.7 Cu Ft 700W', 'descripcion' => 'Horno de microondas 700W con 6 niveles de potencia y grill.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Línea Blanca', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Aire Acondicionado Split 12000 BTU', 'descripcion' => 'Aire acondicionado split frío/calor 12000 BTU inverter.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Climatización', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
    ['nombre' => 'Cable Eléctrico 2.5mm (Rollo 100m)', 'descripcion' => 'Cable unipolar 2.5 mm² cobre puro, rollo de 100 metros.', 'unidad' => 'rollo x 100m', 'grupo_quirurgico' => 'Eléctrico', 'marca' => 'GENÉRICO', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Tablero Eléctrico 12 Módulos', 'descripcion' => 'Tablero de distribución con 12 módulos y diferencial 25A.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Eléctrico', 'marca' => 'GENÉRICO', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Ventilador de Techo 4 Aspas 56"', 'descripcion' => 'Ventilador de techo de 56 pulgadas con control remoto y luz LED.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Climatización', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],

    // ---- 8. Confección y Textiles en General ----
    ['nombre' => 'Uniforme Hospitalario Completo', 'descripcion' => 'Conjunto uniforme hospitalario (top y pantalón) en tela sanitaria.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Vestimenta', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Mantel Quirúrgico Verde 150x180', 'descripcion' => 'Mantel quirúrgico de algodón verde estéril, 150x180 cm.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Quirófano - Textil', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Cojín de Camilla Acolchado', 'descripcion' => 'Cojín tapizado de espuma alta densidad para camillas clínicas.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Consultorio - Textil', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Toalla Facial Microfibra (Pack 10)', 'descripcion' => 'Toalla facial de microfibra suave, pack de 10 unidades surtidas.', 'unidad' => 'pack x 10', 'grupo_quirurgico' => 'Textil General', 'marca' => 'GENÉRICO', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Cortina Hospitalaria Opaca 2m', 'descripcion' => 'Cortina hospitalaria opaca con anillos de acero, 2 metros de ancho.', 'unidad' => 'unidad', 'grupo_quirurgico' => 'Quirófano - Textil', 'marca' => 'ESTAB', 'procedencia' => 'NACIONAL'],
    ['nombre' => 'Delantal de Protección Desechable', 'descripcion' => 'Delantal desechable de polipropileno con manga larga y cierre trasero.', 'unidad' => 'caja x 10', 'grupo_quirurgico' => 'Protección Personal', 'marca' => 'GENÉRICO', 'procedencia' => 'IMPORTADO'],
];

// ---------------------------------------------------------------------------
// Mapeo dinámico a las 8 categorías oficiales por palabras clave.
// ---------------------------------------------------------------------------
const CATEGORIAS_OFICIALES = [
    1 => 'Equipamiento y Prendas Médicas',
    2 => 'Mobiliario de Oficina y Clínica',
    3 => 'Equipos de Computación y Audiovisual',
    4 => 'Material de Escritorio y Papelería',
    5 => 'Material de Limpieza y Corporativo',
    6 => 'Maquinaria Industrial y Ferretería',
    7 => 'Electrodomésticos y Material Eléctrico',
    8 => 'Confección y Textiles en General',
];

const CATEGORIA_PALABRAS_CLAVE = [
    1 => ['bata', 'mascarilla', 'guante', 'jeringa', 'estetoscopio', 'camilla', 'máscara', 'anestesia', 'pinza', 'termómetro', 'quirúrgic', 'hospital', 'médic', 'clínic', 'insumo', 'alcohol gel', 'desinfectante manos'],
    2 => ['silla', 'escritorio', 'archivo', 'rack', 'mesa de examen', 'mobiliario', 'oficina', 'espera'],
    3 => ['laptop', 'impresora', 'proyector', 'monitor', 'televisor', 'comput', 'pizarra', 'imprim'],
    4 => ['papel bond', 'tóner', 'cuaderno', 'marcador', 'carpeta', 'calculadora', 'papeler', 'escritorio', 'tinta', 'resma'],
    5 => ['detergente', 'jabón', 'papel higiénico', 'toalla de papel', 'cloro', 'bolsa de basura', 'limpieza', 'higiene', 'desinfectante'],
    6 => ['compresor', 'soldador', 'soldadora', 'taladro', 'herramienta', 'generador', 'maquinaria', 'ferreter', 'inverter'],
    7 => ['refrigeradora', 'microondas', 'aire acondicionado', 'ventilador', 'cable eléctric', 'tablero eléctric', 'electrodoméstic', 'climatiz', 'split', 'línea blanca'],
    8 => ['uniforme', 'mantel', 'cojín', 'toalla facial', 'cortina', 'delantal', 'textil', 'confección', 'ropa', 'vestimenta'],
];

function mapearCategoria(string $texto): int
{
    $texto = mb_strtolower($texto, 'UTF-8');
    $mejorCategoria = 1;
    $mejorPuntaje = 0;

    foreach (CATEGORIA_PALABRAS_CLAVE as $catId => $palabras) {
        $puntaje = 0;
        foreach ($palabras as $palabra) {
            if (mb_strpos($texto, mb_strtolower($palabra, 'UTF-8'), 0, 'UTF-8') !== false) {
                $puntaje++;
            }
        }
        if ($puntaje > $mejorPuntaje) {
            $mejorPuntaje = $puntaje;
            $mejorCategoria = $catId;
        }
    }

    return $mejorCategoria;
}

// ---------------------------------------------------------------------------
// Motor de siembra idempotente.
// ---------------------------------------------------------------------------
function ejecutarSeeder(array $productos): array
{
    $db = db();

    $existeStmt = $db->prepare('SELECT id FROM productos WHERE nombre = ? LIMIT 1');
    $insertStmt = $db->prepare(
        'INSERT INTO productos (nombre, descripcion, marca, procedencia, precio_referencial, categoria_id, estado)
         VALUES (?, ?, ?, ?, ?, ?, 1)'
    );
    $insertImagen = $db->prepare(
        'INSERT INTO producto_imagenes (producto_id, url_imagen) VALUES (?, ?)'
    );

    $insertados = 0;
    $omitidos = 0;
    $detalleOmitidos = [];
    $porCategoria = array_fill_keys(array_keys(CATEGORIAS_OFICIALES), 0);

    $db->beginTransaction();

    try {
        foreach ($productos as $item) {
            $nombre = trim($item['nombre'] ?? '');
            if ($nombre === '') {
                $omitidos++;
                continue;
            }

            $existeStmt->execute([$nombre]);
            if ($existeStmt->fetch()) {
                $omitidos++;
                $detalleOmitidos[] = $nombre;
                continue;
            }

            $descripcion = trim($item['descripcion'] ?? '');
            $unidad = trim($item['unidad'] ?? '');
            $grupo = trim($item['grupo_quirurgico'] ?? '');

            if ($unidad !== '' || $grupo !== '') {
                $descripcion .= sprintf(
                    ' | Unidad: %s | Grupo: %s',
                    $unidad !== '' ? $unidad : 'N/A',
                    $grupo !== '' ? $grupo : 'N/A'
                );
            }

            $marca = in_array($item['marca'] ?? '', ['GENÉRICO', 'ESTAB'], true)
                ? $item['marca']
                : 'GENÉRICO';
            $procedencia = in_array($item['procedencia'] ?? '', ['NACIONAL', 'IMPORTADO'], true)
                ? $item['procedencia']
                : 'NACIONAL';

            $categoriaId = mapearCategoria($nombre . ' ' . $descripcion);

            $insertStmt->execute([
                $nombre,
                $descripcion,
                $marca,
                $procedencia,
                0.00,
                $categoriaId,
            ]);

            $productoId = (int) $db->lastInsertId();
            $insertImagen->execute([$productoId, '/assets/fallback-product.webp']);

            $insertados++;
            $porCategoria[$categoriaId]++;
        }

        $db->commit();
    } catch (Throwable $e) {
        $db->rollBack();
        jsonResponse([
            'ok' => false,
            'error' => 'Transacción fallida: ' . $e->getMessage(),
        ], 500);
    }

    return [
        'ok' => true,
        'total_procesados' => count($productos),
        'insertados' => $insertados,
        'omitidos' => $omitidos,
        'motivo_omision' => 'Productos duplicados por nombre (ya existentes en la BD).',
        'productos_omitidos' => $detalleOmitidos,
        'categorias' => array_map(
            static fn (int $id, string $nombreCat): array => [
                'id' => $id,
                'nombre' => $nombreCat,
                'insertados' => $porCategoria[$id],
            ],
            array_keys(CATEGORIAS_OFICIALES),
            array_values(CATEGORIAS_OFICIALES)
        ),
    ];
}

// ---------------------------------------------------------------------------
// Enrutamiento: panel HTML en GET, ejecución en POST o GET ?run=1.
// ---------------------------------------------------------------------------
$method = $_SERVER['REQUEST_METHOD'];
$run = $method === 'POST' || ($_GET['run'] ?? '') === '1';

if ($run) {
    $resultado = ejecutarSeeder($PRODUCTOS_CARANAVI);
    jsonResponse($resultado, $resultado['ok'] ? 200 : 500);
}

// Panel interactivo para navegador.
$totalProductos = count($PRODUCTOS_CARANAVI);
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seeder Caranavi — Estab Group S.R.L.</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #1A1C38 0%, #0f1020 100%);
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            color: #e2e8f0;
        }
        .card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(59,181,74,0.3);
            border-radius: 16px;
            padding: 40px; max-width: 560px; width: 92%;
            backdrop-filter: blur(12px); text-align: center;
        }
        .card h1 { font-size: 1.5rem; color: #fff; margin-bottom: 6px; }
        .card h1 span { color: #3BB54A; }
        .card p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px; }
        .count { font-size: 2.6rem; font-weight: 800; color: #3BB54A; margin-bottom: 4px; }
        .count-label { color: #64748b; font-size: 0.8rem; margin-bottom: 24px; }
        button {
            background: linear-gradient(135deg, #3BB54A, #2d9139);
            color: #fff; border: none; padding: 14px 36px; border-radius: 999px;
            font-size: 1rem; font-weight: 700; cursor: pointer;
            transition: transform 0.15s, box-shadow 0.15s;
            box-shadow: 0 4px 20px rgba(59,181,74,0.35);
        }
        button:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(59,181,74,0.5); }
        button:disabled { opacity: 0.6; cursor: wait; transform: none; }
        #resultado {
            margin-top: 24px; text-align: left; font-size: 0.85rem;
            background: rgba(0,0,0,0.3); border-radius: 10px; padding: 16px;
            display: none; white-space: pre-wrap; word-break: break-word;
        }
        .ok { color: #3BB54A; } .warn { color: #EAB308; }
    </style>
</head>
<body>
<div class="card">
    <h1>Seeder <span>Caranavi</span> — Estab Group</h1>
    <p>Carga masiva de productos extraídos de los Excel de Caranavi.<br>El proceso es idempotente: los duplicados se omiten automáticamente.</p>
    <div class="count"><?php echo $totalProductos; ?></div>
    <div class="count-label">productos listos para sembrar</div>
    <button id="btnRun" onclick="runSeeder()">🚀 Ejecutar Seeder</button>
    <pre id="resultado"></pre>
</div>
<script>
async function runSeeder() {
    const btn = document.getElementById('btnRun');
    const out = document.getElementById('resultado');
    btn.disabled = true; btn.textContent = '⏳ Sembrando...';
    out.style.display = 'block'; out.textContent = 'Procesando...';
    try {
        const res = await fetch(window.location.pathname + '?run=1', { method: 'GET' });
        const data = await res.json();
        if (data.ok) {
            out.innerHTML =
                '<span class="ok">✅ Siembra completada.</span>\n' +
                'Insertados: ' + data.insertados + '\n' +
                'Omitidos (duplicados): ' + data.omitidos + '\n\n' +
                'Por categoría:\n' +
                data.categorias.map(c => '  ' + c.id + '. ' + c.nombre + ': ' + c.insertados).join('\n');
        } else {
            out.innerHTML = '<span style="color:#ef4444">❌ Error: ' + (data.error || 'desconocido') + '</span>';
        }
    } catch (e) {
        out.innerHTML = '<span style="color:#ef4444">❌ ' + e.message + '</span>';
    }
    btn.disabled = false; btn.textContent = '🚀 Ejecutar Seeder';
}
</script>
</body>
</html>
