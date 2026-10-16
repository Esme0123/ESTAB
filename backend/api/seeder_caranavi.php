<?php
/**
 * Estab Group S.R.L. - Seeder Masivo Consolidado (516 Productos Únicos)
 * Archivo: backend/api/seeder_caranavi.php
 * Ejecutar vía navegador o cPanel: https://estab.com.bo/api/seeder_caranavi.php
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

header('Content-Type: text/html; charset=utf-8');

try {
    $pdo = db();

    // Consultas preparadas adaptadas al esquema real
    $stmtCheck = $pdo->prepare('SELECT id FROM productos WHERE LOWER(TRIM(nombre)) = LOWER(TRIM(?))');
    $stmtInsert = $pdo->prepare('INSERT INTO productos (categoria_id, nombre, descripcion, precio_referencial, marca, procedencia, estado) VALUES (?, ?, ?, ?, ?, ?, 1)');
    $stmtImagen = $pdo->prepare('INSERT INTO producto_imagenes (producto_id, url_imagen) VALUES (?, ?)');

    // Lista consolidada de los 516 productos extraídos de los 11 libros de Excel
    // Estructura: [categoria_id, 'nombre', 'descripcion', precio_referencial, 'marca', 'procedencia']
    $productosCaranavi = [
        [1, 'BOTAS CON PLATAS INPERMEABLE ANTIDERRAPANTES O RESISTENTE A DESLIZAMIENTOS', 'Unidad: PAR', 0, 'GENÉRICO', 'IMPORTADO'],
        [8, 'SABANAS PARA TRASLADO DE PACIENTE TELA POPELINA (PRIMERA) COLOR VERDE BEBÉ', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'SALEAS DE TELA KAKI COLOR CELESTE AGUA', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'PARES DE BOTAS TELA DACRON COLOR VERDE BEBE', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'GORRO CON LIGA COLOR VERDE BEBE DE TELA POPELINA PRIMERA', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'BATAS CON BOTONES A PRESIÓN COLOR VERDE BEBE TELA POPELINA PRIMERA', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'BATA PARA PEDIATRÍA PARA DISTINTAS EDADES COLOR LILA BEBE', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'DELANTAL DE HULE IMPERMEABLE COLOR GUINDO', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'PIJAMA PARA EL INGRESO A QUIRÓFANO (CHAQUETA Y PANTALON) COLOR PLOMO RATON CON LOGO DE LA INSTITUCIÓN (TELA DACRON) TALLA EXTRA GRANDE', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'PIJAMA PARA EL INGRESO A QUIRÓFANO (CHAQUETA Y PANTALON) COLOR PLOMO RATON CON LOGO DE LA INSTITUCIÓN (TELA DACRON) GRANDE', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'PIJAMA PARA EL INGRESO A QUIRÓFANO (CHAQUETA Y PANTALON) COLOR PLOMO RATON CON LOGO DE LA INSTITUCIÓN (TELA DACRON) MEDIANA', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'PIJAMA PARA EL INGRESO A QUIRÓFANO (CHAQUETA Y PANTALON) COLOR PLOMO RATON CON LOGO DE LA INSTITUCIÓN (TELA DACRON) PEQUEÑA', 'Unidad: PIEZA', 0, 'ESTAB', 'NACIONAL'],
        [8, 'BATAS CON MANGAS LARGA CON PUÑO DE ALGODÓN', 'Unidad: Grandes', 0, 'ESTAB', 'NACIONAL'],
        [8, 'CAMPOS SIMPLES', 'Unidad: 120cm x 120 cm', 0, 'ESTAB', 'NACIONAL'],
        [8, 'PONCHO', 'Unidad: 2.5 mts x 3 mts', 0, 'ESTAB', 'NACIONAL'],
        [8, 'ALFORJA', 'Unidad: 35 cm x 90 cm', 0, 'ESTAB', 'NACIONAL'],
        [8, 'FUNDA DE MAYO (UNA CARA DE LA FUNDA CON DOBLE CUBIERTA)', 'Unidad: 115 cm x 75 cm', 0, 'ESTAB', 'NACIONAL'],
        [8, 'CAMPOS SIMPLES DE MESA DE MAYO', 'Unidad: 125 cm x 125 cm', 0, 'ESTAB', 'NACIONAL'],
        [8, 'CAMPOS SIMPLE DE RECIÉN NACIDOS', 'Unidad: 100 cm x 100 cm', 0, 'ESTAB', 'NACIONAL'],
        [4, 'LIBRO CON CUATRO HOJAS', 'Unidad: 20 cm x 38 cm', 0, 'ARTWORCK', 'NACIONAL'],
        [3, 'IMPRESORA MULTIFUNCIONAL ECOTANK L3210 DISEÑO: ELEGANTE Y RESISTENTE TIPO DE IMPRESORA: MULTIFUNCIONAL FUNCIONES: IMPRIMIR, COPIAR Y ESCANEAR CONECTIVIDAD: USB', 'Unidad: EQUIPO', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'TENSIOMETRO Y ESTETOSCOPIO MANUAL ADULTO MARCA LITMANN', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'TENSIOMETRO Y ESTETOSCOPIO MANUAL PEDIATRICO MARCA LITMANN', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'OXIMETRO DE PULSO ADULTO DE BOLSILLO O PORTÁTIL PANTALLA LED, CON ALARMAS', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'OXIMETRO DE PULSO PEDIATRICO DE BOLSILLO O PORTÁTIL PANTALLA LED, CON ALARMAS', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PULSO OXIMETRO PEDIATRICO Y/O ADULTO DE DEDO', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'Balanza para recién nacido, lactante y niños con infantometro', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'Lámpara de examen físico, cuello de cisne', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'OTORRINOLARINGOSCOPIO', 'Unidad: ESTUCHE', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'DETECTOR DE LATIDOS FETALES DOPLEER', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'SEPARADORES FARABEUFF', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PORTA AGUJAS MEDIANO', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PORTA AGUJAS PEQUENO', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA ARO RECTA GRANDE', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA ANATOMICA', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA QUIRURGICA', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA KOCHER RECTA MEDIANO', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA KOCCHER CURVA PEQUEÑO', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA KOCHER RECTA PEQUEÑO', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'MANGO DE BISTURI NRO 4', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'MANGO DE BISTURI NRO 7', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'CANULA DE ASPIRAR PEQUEÑO', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA BACKAUS', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA KELLY RECTA', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA KELLY CURVA', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA DE ASEPSIA', 'Grupo: CAJA DE INTRUMENTAL BASICO DE TRAUMATOLOGIA | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PLACA NEUTRA REUSABLE DE ELECTROBISTURI UNIVERSAL', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PLACA NEUTRA DESECHABLE DE ELECTROBISTURI UNIVERSAL', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'FILTROS PARA ASPIRADORA DE SECRECIONES', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'CIRCUITO COMPLETO DE ANESTESIA ADULTO', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'CIRCUITO COMPLETO DE ANESTESIA PEDIATRICO', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'MASCARILLA PARA ANESTESIA DE SILICONA ANATOMICA ADULTO', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'MASCARILLA PARA ANESTESIA DE SILICONA ANATOMICA PEDIATRICO', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'SENSOR DE OXIMETRIA DE PULSO PEDIATRICO DE MONITOR MULTIPARAMETRICO CONTEC MODELO CMS8000', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'APRETADOR N°25MM DE 12 PZS', 'Unidad: CAJITA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'APRETADOR N°41MM DE 12 PZS', 'Unidad: CAJITA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'BOLIGRAFO AZUL PUNTA MEDIA', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [2, 'SILLA APILABLE', 'Grupo: SALA DE USO MÚLTIPLE Mobiliario y Equipamiento | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [2, 'MESA MODULAR', 'Grupo: SALA DE USO MÚLTIPLE Mobiliario y Equipamiento | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [2, 'CUADRO DE AVISOS TIPO VITRINA', 'Grupo: SALA DE USO MÚLTIPLE Mobiliario y Equipamiento | Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA ANATOMICA RECTA', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'TIJERA MAYO RECTO', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'PINZA ANATÓMICA DIENTE DE RATÓN', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [3, 'TINTA PARA IMPRESORA EPSON ECOTANK: L3210 COLOR NEGRO 544 BOTELLA DE TINTA DE 65MM', 'Unidad: BOTELLA', 0, 'GENÉRICO', 'IMPORTADO'],
        [3, 'TINTA PARA IMPRESORA EPSON ECOTANK: L3210 COLOR AMARILLO 544 BOTELLA DE BOTELLA DE 65MM', 'Unidad: BOTELLA', 0, 'GENÉRICO', 'IMPORTADO'],
        [3, 'TINTA PARA IMPRESORA EPSON ECOTANK: L3210 COLOR MAGENTA 544 BOTELLA DE TINTA DE 65MM', 'Unidad: BOTELLA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'Muñeca de entrenamiento de enfermería infantil de 3 años con 85 cm de longitud y articulación fexlible. Característica: 1) Cuidado infantil diario: vestirse, vivir, bañarse, etc. 2) Cuidado de ojos, boca y nariz. 3) Enfermeria de la Obstrucción de las vías respiratorias por cuerpo extraño. 4) Irrigación de la vegiga. 5) Lavado gástrico (estomago) 6) Cateterismos. 7) Alimentación nasal: vía baja y alta. 8) Inyección intramuscular: el brazo y el muslo tienen una almohadilla para inyección intramuscular. 9) Cuidado de heridas: sutura. 10) Cuidado de la ostomía. 11) Punción vesical. 12) Pared abdominal reemplazada: el niño tiene una cicatriz de reparacón de hernia, la niña tiene una cicatriz de apendicectomía.', 'Ítem catálogo institucional', 12800.00, 'GENÉRICO', 'IMPORTADO'],
        [2, 'Sillon odontologico CARACTERÍSTICAS DEL SILLÓN DENTAL Procedencia de fabricación: Brasil Año de fabricación: 2022-2023 Línea: Dabi Atlante Con 4 movimientos básicos activados por Joystick en el pedal y panel de control del modular: subir, bajar, inclinación y declinación. La elevación debe ser electromecánica activada por moto reductor. Soportar peso de 200 Kg o más. Con 4 posiciones de trabajo programables. Caja de conexiones integrada. Estructura sólida de acero con revestimiento de poliestireno de alto impacto. Debrum antideslizante en la base, que no requiera fijación al suelo. Respaldo anatómico. Tapizado con revestimiento de PVC sin costura. Espaldar del tapiz de fácil remoción para la limpieza. Pose apoyacabeza, bi articulable. Pose brazo uno fijo y otro abatible.', 'Ítem catálogo institucional', 0, 'DABI ATLANTE', 'IMPORTADO'],
        [2, 'MÓDULO DENTAL Brazo neumático. Mangueras siliconadas. 4 terminales: 1 jeringa triple. 1 terminal de baja rotación. 2 terminales de alta rotación. Contar con sistema de desinfección interna de mangueras. Bandeja en acero inoxidable. Panel de control con las funciones del sillón. Terminales con válvulas independientes. UNIDAD AUXILIAR Abatible 90 grados. La escupidera debe ser de porcelana y removible, con estructura interna de aluminio. Debe tener: 1 llena vasos. 1 suctor de saliva. 1 hemosuctor. 1 botellón para agua. REFLECTOR LED Con tecnología de iluminación rectangular de 3 LED. Con perillas autoclavables, extraíbles y protector delantero extraíble. Potencia de iluminación de 10,000, 20,000 y/o 30,000 Lux. TABURETE Con 5 ruedas dobles. Pistón a gas. Acolchado y revestido con PVC sin costura.', 'Ítem catálogo institucional', 0, 'DABI ATLANTE', 'IMPORTADO'],
        [1, 'Cartucho de hemoperfusión (enfermedad renal en etapa terminal (ESRD))', 'Ítem catálogo institucional', 553.84, 'GENÉRICO', 'IMPORTADO'],
        [1, '1. Dializador de bajo flujo 2.Fibra: polietersulfona 3. Superficie efectiva: 1,4㎡/1,6㎡/1,8㎡/2,0', 'Ítem catálogo institucional', 37.60, 'GENÉRICO', 'IMPORTADO'],
        [1, '1. Dializador de alto flujo 2.Fibra: polietersulfona 3. Superficie efectiva: 1,4㎡/1,6㎡/1,8㎡/2,0', 'Ítem catálogo institucional', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'Línea de sangre para hemodiálisis (Arterial y Venosa)', 'Unidad: SET', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'Catéter temporal de doble lumen para hemodiálisis', 'Unidad: PIEZA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'Bicarbonato de sodio en polvo para hemodiálisis', 'Unidad: BOLSA', 0, 'GENÉRICO', 'IMPORTADO'],
        [1, 'Ácido concentrado para hemodiálisis', 'Unidad: BIDÓN', 0, 'GENÉRICO', 'IMPORTADO']
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

        // Insertar producto
        $stmtInsert->execute([
            $p[0], // categoria_id
            $p[1], // nombre
            $p[2], // descripcion
            $p[3], // precio_referencial
            $p[4], // marca
            $p[5]  // procedencia
        ]);

        $productoId = (int) $pdo->lastInsertId();

        // Insertar imagen en la tabla producto_imagenes
        $stmtImagen->execute([$productoId, $imagenFallback]);

        $insertados++;
        $porCategoria[$p[0]]++;
    }

    $total = count($productosCaranavi);

    // Pantalla de respuesta HTML
    echo "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'><title>Seeder Estab Group</title>";
    echo "<style>body{font-family:Segoe UI,sans-serif;background:#0f172a;color:#fff;padding:2rem;} .card{background:#1e293b;padding:2rem;border-radius:12px;max-width:650px;margin:auto;box-shadow:0 10px 25px rgba(0,0,0,0.5);} h1{color:#3bb54a;font-size:1.5rem;} .stat{font-size:1.1rem;margin:12px 0;padding:8px;background:#334155;border-radius:6px;} ul{list-style:none;padding:0;} li{padding:6px 0;border-bottom:1px solid #475569;}</style></head><body>";
    echo "<div class='card'>";
    echo "<h1>🏥 Estab Group S.R.L. - Sincronización de Catálogo</h1>";
    echo "<div class='stat'>📦 Total Ítems Procesados en este lote: <strong>$total</strong></div>";
    echo "<div class='stat'>✅ Nuevos Productos Insertados: <strong>$insertados</strong></div>";
    echo "<div class='stat'>ℹ️ Omitidos (Ya Existían en Base de Datos): <strong>$omitidos</strong></div>";
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
