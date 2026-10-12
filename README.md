# Ferretería Orion
Aplicación web de gestión de inventario desarrollada con Spring Boot y React. Cuenta con una API REST para gestionar los artículos de una ferretería y una interfaz web interactiva que permite realizar operaciones CRUD (crear, consultar, actualizar y eliminar productos). Utiliza MySQL para el almacenamiento de datos.

## Tecnologías

### Backend
| Componente | Tecnología | Versión |
|---|---|---|
| **Lenguaje** | Java (LTS) | 21 |
| **Framework** | Spring Boot | 3.3.4 |
| **Persistencia / ORM** | Spring Data JPA / Hibernate | MySQL8Dialect |
| **Base de Datos** | MySQL | 8.x |
| **Seguridad** | Spring Security | 6 (BCrypt, HTTP Basic) |
| **Herramienta de Construcción** | Maven Wrapper | 3.9.x |
| **Productividad** | Project Lombok | 1.18.42 |

### Frontend Moderno (SPA)
| Componente | Tecnología | Versión |
|---|---|---|
| **Librería UI** | React | 19.2.8 |
| **Empaquetador / Bundler** | Vite | 8.3.0 |
| **Framework CSS** | Bootstrap | 5.3.8 |
| **Iconografía** | Lucide React | 1.55.0 |
| **Alertas & Diálogos** | SweetAlert2 | 11.26.25 |
| **Linter** | Oxlint | 1.81.0 |


## Estructura del Repositorio

El proyecto está organizado en una estructura desacoplada:

```
ferreteria-orion/
├── README.md                                    
├── .gitignore                                   
├── backend/                                     
│   ├── pom.xml                                  # Descriptor de dependencias Maven
│   ├── mvnw / mvnw.cmd                          # Maven Wrapper para Linux/Mac y Windows
│   └── src/
│       ├── main/java/com/hibernate/ferreteria/
│       │   ├── FerreteriaApplication.java       # Punto de entrada de la aplicación Spring Boot
│       │   ├── GeneraPass.java                  # Utilidad para cifrar contraseñas con BCrypt
│       │   ├── controladores/
│       │   │   └── ArticuloController.java      # Endpoints REST (/api/articulos) con CORS habilitado
│       │   ├── servicios/
│       │   │   ├── ArticulosServices.java       # Lógica de negocio de inventario
│       │   │   └── UsuarioServices.java         # Implementación de UserDetailsService
│       │   ├── repositorios/
│       │   │   ├── Repo_articulos.java          # JpaRepository para artículos
│       │   │   └── Repo_usuarios.java           # JpaRepository para usuarios
│       │   ├── entity/
│       │   │   ├── Articulos.java               # Entidad JPA para la tabla `articulos`
│       │   │   └── Usuario.java                 # Entidad JPA para la tabla `usuarios`
│       │   ├── dto/
│       │   │   └── ArticulosDTO.java            # DTO para transferencia de datos
│       │   ├── mapper/
│       │   │   └── ArticuloMapper.java          # Conversor estático Entidad ↔ DTO
│       │   └── seguridad/
│       │       └── SecurityConfig.java          # Configuración de filtros, roles y BCrypt
│       ├── main/resources/
│       │   ├── application.properties           # Configuración de conexión MySQL y JPA
│       │   └── static/
│       │       └── index.html                   # UI Legacy (jQuery 3.6)
│       └── test/java/com/hibernate/ferreteria/
│           └── FerreteriaApplicationTests.java  # Pruebas unitarias y de contexto
│
└── frontend/                                    
    ├── package.json                             # Dependencias y scripts de Node.js
    ├── vite.config.js                           # Configuración del servidor de desarrollo y build
    ├── .oxlintrc.json                           # Configuración de reglas para Oxlint
    ├── index.html                               # Plantilla raíz de la SPA
    └── src/
        ├── main.jsx                             # Entry point (Bootstrap CSS e inyección al DOM)
        ├── App.jsx                              # Componente principal (estado, KPIs, búsqueda, modal)
        ├── App.css                              # Paleta de diseño Orion (--orion-orange, cards, badges)
        ├── index.css                            # Reseteo y estilos base globales
        ├── components/
        │   ├── ArticuloModal.jsx                # Modal de creación y edición de productos
        │   └── ArticuloTabla.jsx                # Tabla responsiva de artículos con badges de stock
        └── services/
            └── articuloService.js               # Conexión HTTP (fetch) hacia la API REST
```

---

## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu entorno:

- **Java Development Kit (JDK) 21**
- **Node.js 18+** y **npm 9+**
- **MySQL Server 8.x** activo en `localhost:3306`
- **Git**

---

## Pasos a Ejecutar

### 1. Configurar la Base de Datos MySQL

Conéctate a tu servidor MySQL y ejecuta el siguiente script para crear la base de datos y el usuario con los permisos requeridos:

```sql
CREATE DATABASE IF NOT EXISTS db_ferreteria;
CREATE USER IF NOT EXISTS 'ferreteria_user'@'localhost' IDENTIFIED BY 'alumnos';
GRANT ALL PRIVILEGES ON db_ferreteria.* TO 'ferreteria_user'@'localhost';
FLUSH PRIVILEGES;
```

> **Nota**: Las tablas (`articulos` y `usuarios`) se crearán automáticamente al iniciar la aplicación Spring Boot gracias a la propiedad `spring.jpa.generate-ddl=true`.

---

### 2. Iniciar el Backend (Spring Boot)

```bash
cd backend

# Descargar dependencias y compilar
./mvnw clean install

# Iniciar el servidor en modo desarrollo (puerto 8080)
./mvnw spring-boot:run
```

*(En Windows utiliza `mvnw.cmd`)*

Si prefieres ejecutar el paquete JAR generado:

```bash
java -jar target/ferreteria-0.0.1-SNAPSHOT.jar
```

### 3. Iniciar el Frontend (React 19 + Vite)


```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo de Vite (puerto 5173)
npm run dev
```

---

## Puntos de Acceso del Sistema

| Módulo / Servicio | URL | Descripción |
|---|---|---|
| **Frontend Moderno (React SPA)** | [http://localhost:5173](http://localhost:5173) | Interfaz principal con panel de métricas, búsqueda y CRUD en tiempo real |
| **API REST** | [http://localhost:8080/api/articulos](http://localhost:8080/api/articulos) | Endpoints de artículos |
| **Frontend Clásico (Legacy)** | [http://localhost:8080/](http://localhost:8080/) | Interfaz estática clásica basada en jQuery servida por Spring Boot |

---

## Catálogo de la API REST

**Base URL**: `http://localhost:8080/api/articulos`

| Método | Endpoint | Acceso | Descripción | Body Request (JSON) | Respuesta Éxito |
|---|---|---|---|---|---|
| `GET` | `/api/articulos` | Público | Obtener lista completa de artículos | *Ninguno* | `200 OK` (Array de artículos) |
| `GET` | `/api/articulos/{id}` | Público | Obtener un artículo específico por ID | *Ninguno* | `200 OK` (Objeto artículo) |
| `POST` | `/api/articulos` | Público | Registrar un nuevo artículo | `ArticulosDTO` | `200 OK` (Artículo creado) |
| `PUT` | `/api/articulos/{id}` | Público | Actualizar un artículo existente | `ArticulosDTO` | `200 OK` (Artículo actualizado) |
| `DELETE` | `/api/articulos/{id}` | Público | Eliminar un artículo por ID | *Ninguno* | `200 OK` ("articulo eliminado") |

### Estructura de Datos (`ArticulosDTO`)
```json
{
  "id": 1,
  "nombreArticulo": "Martillo tubular de 16 oz",
  "precio": 249.50,
  "existencia": 12
}
```


## Esquema de Base de Datos

### Tabla `articulos`
| Columna | Tipo de Dato | Restricciones / Descripción |
|---|---|---|
| `id` | `BIGINT` | Clave primaria, Auto-incremental |
| `nombreArticulo` | `VARCHAR(255)` | Nombre o descripción del producto |
| `precio` | `DOUBLE` | Precio unitario de venta |
| `existencia` | `INT` | Unidades disponibles en inventario |

### Tabla `usuarios`
| Columna | Tipo de Dato | Restricciones / Descripción |
|---|---|---|
| `id` | `BIGINT` | Clave primaria, Auto-incremental |
| `usuario` | `VARCHAR(50)` | Nombre de usuario (único, not null) |
| `password` | `VARCHAR(60)` | Contraseña cifrada en hash BCrypt |
| `rol` | `VARCHAR(60)` | Rol asignado (`ADMIN`, `USER`) |


