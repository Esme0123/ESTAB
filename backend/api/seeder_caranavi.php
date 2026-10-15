<?php
/**
 * Estab Group S.R.L. - Seeder Masivo Consolidado (516 Productos Únicos)
 * Ejecutar vía navegador o cPanel: https://estab.com.bo/api/seeder_caranavi.php
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

header('Content-Type: text/html; charset=utf-8');

try {
    $pdo = db();

    // Consultas preparadas
    // NOTA: el esquema real usa `precio_referencial` (no `precio`) y guarda las
    // imágenes en la tabla `producto_imagenes` (no como columna de `productos`).
    $stmtCheck = $pdo->prepare('SELECT id FROM productos WHERE LOWER(TRIM(nombre)) = LOWER(TRIM(?))');
    $stmtInsert = $pdo->prepare('INSERT INTO productos (categoria_id, nombre, descripcion, precio_referencial, marca, procedencia, estado) VALUES (?, ?, ?, ?, ?, ?, 1)');
    $stmtImagen = $pdo->prepare('INSERT INTO producto_imagenes (producto_id, url_imagen) VALUES (?, ?)');

    // Lista consolidada de productos de los libros de Excel
    // Estructura: [categoria_id, 'nombre', 'descripcion', precio, 'marca', 'procedencia']
    $productosCaranavi = [
        [1, 'PINZA KELLY RECTA', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA KELLY CURVA', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA KOCHER RECTA', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA KOCHER CURVA', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA BACKAUS', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'SEPARADORES FARABEUFF', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PORTA AGUJAS MEDIANO', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PORTA AGUJAS PEQUENO', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'MANGO DE BISTURI NRO 3', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'MANGO DE BISTURI NRO 4', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'MANGO DE BISTURI NRO 7', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'CANULA DE ASPIRAR PEQUEÑO', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA DE ASEPSIA', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA ANATOMICA', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA QUIRURGICA', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA ARO RECTA GRANDE', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'CAJA DE INSTRUMENTAL BASICO DE TRAUMATOLOGIA', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'CAJA DE CIRUGIA MAYOR', 'Grupo: CAJA DE CIRUGIA MAYOR', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'CAJA DE CIRUGIA MENOR', 'Grupo: CAJA DE CIRUGIA MENOR', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'CAJA DE ATENCION DE PARTO', 'Grupo: CAJA DE ATENCION DE PARTO', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'CAJA DE LEGRADO UTERINO', 'Grupo: CAJA DE LEGRADO UTERINO', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'EQUIPO DENTAL COMPLETO CON SILLON DENTAL', 'Unidad: UNIDAD | Odontología', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'MODELO ANATOMICO DE EMBRIOLOGIA Y DESARROLLO FETAL', 'Unidad: PIEZA | Simulación Educativa UPEA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'SIMULADOR DE MANIQUI DE PARTO AVANZADO', 'Unidad: PIEZA | Laboratorio Clínico UPEA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'LINEA ARTERIAL PARA HEMODIALISIS', 'Unidad: PIEZA | Especialidad Hemodiálisis', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'LINEA VENOSA PARA HEMODIALISIS', 'Unidad: PIEZA | Especialidad Hemodiálisis', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'DIALIZADOR DE ALTO FLUJO', 'Unidad: PIEZA | Especialidad Hemodiálisis', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'DIALIZADOR DE BAJO FLUJO', 'Unidad: PIEZA | Especialidad Hemodiálisis', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'BICARBONATO DE SODIO EN POLVO PARA HEMODIALISIS', 'Unidad: BOLSA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'ACIDO CONCENTRADO PARA HEMODIALISIS', 'Unidad: BIDON', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'CATETER CEMENTADO PARA HEMODIALISIS', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'CATETER TEMPORAL DOBLE LUMEN PARA HEMODIALISIS', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'AGUJAS PARA FISTULA ARTERIOVENOSA NRO 16G Y 17G', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [8, 'SABANAS PARA TRASLADO DE PACIENTE TELA POPELINA (PRIMERA) COLOR VERDE BEBÉ', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'SALEAS DE TELA KAKI COLOR CELESTE AGUA', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'PARES DE BOTAS TELA DACRON COLOR VERDE BEBE', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'GORRO CON LIGA COLOR VERDE BEBE DE TELA POPELINA PRIMERA', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'BATAS CON BOTONES A PRESIÓN COLOR VERDE BEBE TELA POPELINA PRIMERA', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'BATA PARA PEDIATRÍA PARA DISTINTAS EDADES COLOR LILA BEBE', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'DELANTAL DE HULE IMPERMEABLE COLOR GUINDO', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'PIJAMA PARA EL INGRESO A QUIRÓFANO (CHAQUETA Y PANTALON)', 'Tela Dacron, color plomo ratón con logo institucional', 0, 'ESTAB', 'NACIONAL'],
        [8, 'BATAS CON MANGAS LARGA CON PUÑO DE ALGODÓN', 'Unidad: Grandes', 0, 'ESTAB', 'NACIONAL'],
        [8, 'CAMPOS SIMPLES DE TELA QUIRURGICA', 'Unidad: 120cm x 120 cm', 0, 'ESTAB', 'NACIONAL'],
        [8, 'PONCHO QUIRURGICO IMPERMEABLE', 'Unidad: 2.5 mts x 3 mts', 0, 'ESTAB', 'NACIONAL'],
        [8, 'ALFORJA QUIRURGICA DE TELA', 'Unidad: 35 cm x 90 cm', 0, 'ESTAB', 'NACIONAL'],
        [8, 'FUNDA DE MAYO CON DOBLE CUBIERTA', 'Unidad: 115 cm x 75 cm', 0, 'ESTAB', 'NACIONAL'],
        [2, 'SILLA DE RUEDA MARCA DRIVE', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [2, 'MESA DE EXAMINACION GINECOLOGICA', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'NACIONAL'],
        [2, 'CAMILLA DE TRANSPORTE DE PACIENTES CON RUEDAS', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'NACIONAL'],
        [2, 'SILLON CLINICO ODONTOLOGICO', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'IMPORTADO'],
        [2, 'VELADOR CLINICO METALICO', 'Unidad: PIEZA', 0, 'GENÉRICO', 'NACIONAL'],
        [2, 'ESCRITORIO DE OFICINA DE 3 CAJONES', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'NACIONAL'],
        [2, 'SILLA ERGONOMICA EJECUTIVA GIRATORIA', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'IMPORTADO'],
        [2, 'TANDEM DE 3 ASIENTOS METALICOS PARA SALA DE ESPERA', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'IMPORTADO'],
        [3, 'COMPUTADORA DE ESCRITORIO COMPLETA CON MONITOR', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'IMPORTADO'],
        [3, 'LAPTOP PORTATIL INTEL CORE I5 / I7', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'IMPORTADO'],
        [3, 'IMPRESORA MULTIFUNCIONAL A COLOR', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'IMPORTADO'],
        [3, 'PROYECTOR DATA SHOW HD', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'IMPORTADO'],
        [4, 'PAPEL BOND TAMAÑO CARTA 75G 500 HOJAS', 'Unidad: PAQUETE', 0, 'ARTWORCK', 'IMPORTADO'],
        [4, 'PAPEL BOND TAMAÑO OFICIO 75G 500 HOJAS', 'Unidad: PAQUETE', 0, 'ARTWORCK', 'IMPORTADO'],
        [4, 'ARCHIVADOR DE PALANCA ANCHO OFICIO', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'NACIONAL'],
        [4, 'BOLIGRAFO COLOR AZUL / NEGRO / ROJO', 'Unidad: CAJA', 0, 'GENÉRICO', 'IMPORTADO'],
        [5, 'LAVANDINA DESINFECTANTE DE 5 LITROS', 'Unidad: FRASCO', 0, 'OLA', 'NACIONAL'],
        [5, 'DETERGENTE EN POLVO DE 5 KG', 'Unidad: BOLSA', 0, 'OMO', 'NACIONAL'],
        [5, 'DESINFECTANTE AROMATIZADO AMBIENTADOR 360 ML', 'Unidad: AEROSOL', 0, 'SAPOLIO', 'IMPORTADO'],
        [5, 'LIMPIADOR DE VIDRIOS CON GATILLO 900 ML', 'Unidad: FRASCO', 0, 'BRISTAR', 'NACIONAL'],
        [6, 'TALADRO PERCUTOR INDUSTRIAL 750W', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'IMPORTADO'],
        [6, 'CAJA DE HERRAMIENTAS DE MANO 100 PIEZAS', 'Unidad: SET', 0, 'GENÉRICO', 'IMPORTADO'],
        [7, 'REFRIGERADOR CONGELADOR PARA VACUNAS / CLINICO', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'IMPORTADO'],
        [7, 'MICROONDAS INDUSTRIAL DE ACERO INOXIDABLE', 'Unidad: UNIDAD', 0, 'GENÉRICO', 'IMPORTADO']
    ];

    $insertados = 0;
    $omitidos = 0;
    $porCategoria = array_fill(1, 8, 0);

    foreach ($productosCaranavi as $p) {
        $stmtCheck->execute([$p[1]]);
        if ($stmtCheck->fetch()) {
            $omitidos++;
            continue;
        }

        $imagenFallback = '/assets/fallback-product.webp';

        $stmtInsert->execute([
            $p[0], // categoria_id
            $p[1], // nombre
            $p[2], // descripcion
            $p[3], // precio_referencial
            $p[4], // marca
            $p[5]  // procedencia
        ]);

        $productoId = (int) $pdo->lastInsertId();
        $stmtImagen->execute([$productoId, $imagenFallback]);

        $insertados++;
        $porCategoria[$p[0]]++;
    }

    $total = count($productosCaranavi);

    // Pantalla de respuesta HTML
    echo "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'><title>Seeder Estab Group</title>";
    echo "<style>body{font-family:sans-serif;background:#0f172a;color:#fff;padding:2rem;} .card{background:#1e293b;padding:2rem;border-radius:12px;max-width:600px;margin:auto;} h1{color:#3bb54a;} .stat{font-size:1.2rem;margin:10px 0;} ul{list-style:none;padding:0;}</style></head><body>";
    echo "<div class='card'>";
    echo "<h1>🏥 Estab Group S.R.L. - Sincronización de Catálogo</h1>";
    echo "<div class='stat'>📦 Total Ítems Procesados: <strong>$total</strong></div>";
    echo "<div class='stat'>✅ Nuevos Productos Insertados: <strong>$insertados</strong></div>";
    echo "<div class='stat'>ℹ️ Omitidos (Ya Existían): <strong>$omitidos</strong></div>";
    echo "<h3>Desglose de Insertados por Categoría:</h3><ul>";

    $catNombres = [
        1 => 'Equipamiento y Prendas Médicas',
        2 => 'Mobiliario de Oficina y Clínica',
        3 => 'Equipos de Computación y Audiovisual',
        4 => 'Material de Escritorio y Papelería',
        5 => 'Material de Limpieza y Corporativo',
        6 => 'Maquinaria Industrial y Ferretería',
        7 => 'Electrodomésticos y Material Eléctrico',
        8 => 'Confección y Textiles en General'
    ];

    foreach ($porCategoria as $catId => $cant) {
        echo "<li><strong>{$catNombres[$catId]}:</strong> $cant productos</li>";
    }

    echo "</ul></div></body></html>";
} catch (Exception $e) {
    http_response_code(500);
    echo "<h1>Error en el Seeder:</h1><pre>" . htmlspecialchars($e->getMessage()) . "</pre>";
}
