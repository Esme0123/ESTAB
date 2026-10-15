# 🏥 Estab Group S.R.L. - Sistema Web & Cotizador Institucional

Plataforma web full-stack para el catálogo de productos, cotizador multi-formato (PDF/Excel/WhatsApp) y gestión de inventario de **Estab Group S.R.L.** (Bolivia).

<p align="center">
  <strong>Catálogo institucional · Cotizador profesional · Panel de administración</strong>
</p>

---

## 🚀 Tecnologías Utilizadas

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, jsPDF + AutoTable, XLSX (SheetJS).
- **Backend:** PHP 8.x (API RESTful), PDO, JWT Authentication, CORS Headers.
- **Base de Datos:** MySQL 8.x / MariaDB (utf8mb4).
- **Despliegue:** Apache / GoDaddy cPanel (con `.htaccess` para SPA Routing).

---

## 👥 Roles y Permisos

### 1. Público (Cliente)

- Navegación por catálogo con 8 categorías oficiales.
- Cotización rápida multi-producto enviada directamente al WhatsApp corporativo (`+591 71814954`).
- Búsqueda en tiempo real e inspección de fichas técnicas con marca y procedencia.

### 2. Ventas / Cotizador

- Ajuste dinámico de cantidades y precios unitarios negociados.
- Cálculo automático del monto Total en números (Bs.) y en formato Literal Boliviano.
- Exportación instantánea a PDF institucional con marca de agua y Excel estructurado.
- Envíos de cotizaciones dirigidos al WhatsApp individual del cliente.

### 3. Administrador

- Control total CRUD de catálogo, categorías e inventario.
- Edición en línea de precios y filtro de productos sin precio asignado (0 Bs.).

---

## 🏛️ Categorías Oficiales

| ID | Categoría |
|----|-----------|
| 1 | Equipamiento y Prendas Médicas |
| 2 | Mobiliario de Oficina y Clínica |
| 3 | Equipos de Computación y Audiovisual |
| 4 | Material de Escritorio y Papelería |
| 5 | Material de Limpieza y Corporativo |
| 6 | Maquinaria Industrial y Ferretería |
| 7 | Electrodomésticos y Material Eléctrico |
| 8 | Confección y Textiles en General |

---

## 📁 Estructura del Proyecto

```text
ESTAB/
├── backend/
│   ├── api/
│   │   ├── login.php             # Autenticación con BCRYPT
│   │   ├── productos.php         # CRUD de productos, marca y procedencia
│   │   ├── migrate.php           # Script de migración idempotente
│   │   ├── seeder_caranavi.php   # Poblador masivo de base de datos
│   │   ├── upload.php            # Carga de imágenes de productos
│   │   └── ping.php              # Keep-alive del servidor
│   ├── config/
│   │   └── database.php          # Conexión PDO + JWT + CORS + helpers de auth
│   ├── migrations/
│   │   └── 001_marca_procedencia_categorias.sql
│   ├── schema.sql                # Esquema completo + seeds
│   └── Dockerfile                # Imagen PHP 8.2 + Apache
└── frontend/
    ├── public/
    │   └── .htaccess             # Reescritura de rutas para React Router en Apache
    ├── src/
    │   ├── components/           # Navbar, Footer, CotizadorPanel, ProductModal,
    │   │                         #   ProductImage (fallback) y PriceEditor (in-line)
    │   ├── pages/                # Home, CatalogPage, Contacto, Nosotros, Login
    │   ├── utils/                # Conversor de números a letras (Literal Bolivianos)
    │   ├── services/             # Cliente HTTP centralizado (api.js)
    │   └── lib/                  # Gestión de sesión y roles (auth.js)
    ├── package.json
    └── vite.config.js
```

> **Nota:** La conexión PDO vive en `backend/config/database.php` y es consumida
> por los endpoints mediante `require __DIR__ . '/../config/database.php'`.

---

## ⚡ Puesta en Marcha

### Requisitos previos

- Node.js 18+ y npm.
- PHP 8.1+ con extensiones `pdo` y `pdo_mysql`.
- MySQL 8.x / MariaDB.

### 1. Backend (API PHP)

1. Crear la base de datos y cargar el esquema:

   ```bash
   mysql -u root -p < backend/schema.sql
   ```

2. Configurar credenciales en `backend/config/database.php` (o vía variables de
   entorno: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).

3. Ejecutar la migración idempotente (crea tablas, categorías y usuarios semilla):

   ```bash
   php backend/api/migrate.php
   ```

4. Servir la carpeta `backend/` con Apache/PHP.

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env      # Ajustar VITE_API_URL si es necesario
npm run dev               # Servidor de desarrollo en http://localhost:5173
```

### 3. Build de producción

```bash
cd frontend
npm run build             # Genera /dist para desplegar en el hosting
```

---

## 🌱 Seeder Masivo — Productos Caranavi

`backend/api/seeder_caranavi.php` carga de forma masiva el **listado literal de
productos** extraído de los libros de Excel de la empresa. Cada ítem define su
`categoria_id`, nombre, descripción, precio, marca y procedencia.

**Características:**

- Inserta de forma **idempotente**: compara `LOWER(TRIM(nombre))` antes de
  insertar; los duplicados se **omiten** y se contabilizan.
- Persiste el precio en la columna `productos.precio_referencial` (por defecto
  `0.00 Bs.`, listo para la edición in-line del Admin).
- Registra la imagen `/assets/fallback-product.webp` en la tabla
  `producto_imagenes` (el esquema real no tiene columna `imagen` en `productos`).
- Al finalizar renderiza una **pantalla HTML** con el total procesado, los
  insertados, los omitidos y el desglose por categoría.

**Uso (navegador):**

| Invocación | Resultado |
|-----------|-----------|
| `GET /api/seeder_caranavi.php` | Ejecuta la siembra y devuelve el panel HTML resumen |

Ejemplo con `curl`:

```bash
curl https://estab.com.bo/api/seeder_caranavi.php
```

### 🖥️ Ejecución en cPanel (producción)

1. Subir el proyecto a `public_html/` (el `DocumentRoot` debe apuntar a la raíz,
   de modo que `https://estab.com.bo/api/...` resuelva a `backend/api/...`).
2. Verificar las credenciales de MySQL en `backend/config/database.php` (o
   definir las variables de entorno `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`,
   `DB_PASSWORD`).
3. Abrir en el navegador: `https://estab.com.bo/api/migrate.php` para crear
   tablas, categorías y usuarios semilla.
4. Abrir en el navegador: `https://estab.com.bo/api/seeder_caranavi.php`.
   El script inserta el catálogo y muestra el resumen. Puede ejecutarse varias
   veces sin duplicar productos.
5. Regresar al catálogo (`https://estab.com.bo/`) e iniciar sesión como Admin
   para completar los precios con la edición rápida.

> Alternativa por SSH: `php /ruta/a/backend/api/seeder_caranavi.php`.

---

## ✏️ Edición Rápida de Precios (Admin)

Dentro del catálogo en modo Administrador:

- **Filtro "Productos sin precio (0 Bs.)":** chip con ícono de alerta en la
  cabecera que muestra únicamente los productos con precio referencial `0` o nulo.
- **Edición en línea:** hacer clic sobre la cifra de precio convierte la celda en
  un campo numérico editable. Al presionar **Enter** o perder el foco (`onBlur`)
  se ejecuta un `PUT` a `/api/productos.php` y se muestra un indicador verde
  **"Precio actualizado"** sin recargar la página.
- **Fallback de imagen:** si la URL de la imagen está vacía o falla (`onError`),
  se renderiza un contenedor con gradiente corporativo Azul Marino (`#1A1C38`) /
  Verde (`#3BB54A`), el ícono y las iniciales de la categoría.

**Archivos involucrados:**

- `frontend/src/pages/CatalogPage.jsx` — listado admin, filtro y flujo de guardado.
- `frontend/src/components/PriceEditor.jsx` — campo numérico en línea con confirmación.
- `frontend/src/components/ProductImage.jsx` — imagen con fallback corporativo.
- `frontend/src/services/api.js` — método `api.updatePrecio(id, producto, precio)`.

---

## 🔐 Credenciales Semilla

Las credenciales de prueba son creadas por la migración (cambiar en producción):

| Rol | Email | Password |
|-----|-------|----------|
| Administrador | `admin@estabgroup.com` | `password` |
| Ventas | `ventas@estabgroup.com` | `password` |

---

## 🔌 Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/login.php` | Autenticación (BCRYPT) | Público |
| `GET` | `/api/productos.php` | Lista productos (`precio_referencial` solo con token) | Opcional |
| `GET` | `/api/productos.php?id=N` | Detalle de producto | Opcional |
| `POST` | `/api/productos.php` | Crear producto | Admin |
| `PUT` | `/api/productos.php?id=N` | Actualizar producto | Admin |
| `DELETE` | `/api/productos.php?id=N` | Eliminar producto | Admin |
| `POST` | `/api/upload.php` | Subir imagen de producto | Admin |
| `GET` | `/api/ping.php` | Estado del servidor | Público |
| `GET` | `/api/migrate.php` | Migración idempotente | Público |

---

## 📄 Licencia

© 2026 **Estab Group S.R.L.** — Todos los derechos reservados. Bolivia 🇧🇴
