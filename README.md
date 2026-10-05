## Descripción

**Ferretería Orion** es una aplicación web de gestión de inventario que permite administrar los artículos de una ferretería mediante una **API REST** construida con Spring Boot. Incluye una interfaz web SPA (Single Page Application) para realizar operaciones CRUD de forma intuitiva.

El sistema cuenta con autenticación y autorización de usuarios mediante **Spring Security** con roles (`ADMIN`, `USER`) y contraseñas cifradas con **BCrypt**.


## Tecnologías

| Capa          | Tecnología                                    |
|---------------|-----------------------------------------------|
| **Lenguaje**  | Java 21                                       |
| **Framework** | Spring Boot 3.3.4                             |
| **ORM**       | Spring Data JPA / Hibernate                   |
| **BD**        | MySQL 8                                       |
| **Seguridad** | Spring Security (BCrypt, HTTP Basic)          |
| **Build**     | Maven 3.9.12 (Wrapped)                        |
| **Frontend**  | HTML + CSS + JavaScript (jQuery 3.6)          |
| **Utilidades**| Lombok, SweetAlert2, Font Awesome 6           |


## Estructura del Proyecto

```
ferreteria/
├── src/main/java/com/hibernate/ferreteria/
│   ├── FerreteriaApplication.java          # Punto de entrada
│   ├── controladores/
│   │   └── ArticuloController.java         # Endpoints REST
│   ├── dto/
│   │   └── ArticulosDTO.java               # DTO de artículos
│   ├── entity/
│   │   ├── Articulos.java                  # Entidad: artículos
│   │   └── Usuario.java                    # Entidad: usuarios
│   ├── mapper/
│   │   └── ArticuloMapper.java             # Mapper Entity ↔ DTO
│   ├── repositorios/
│   │   ├── Repo_articulos.java             # Repositorio artículos
│   │   └── Repo_usuarios.java              # Repositorio usuarios
│   ├── seguridad/
│   │   └── SecurityConfig.java             # Config. Spring Security
│   └── servicios/
│       ├── ArticulosServices.java          # Lógica de negocio
│       └── UsuarioServices.java            # UserDetailsService
├── src/main/resources/
│   ├── application.properties              # Configuración
│   └── static/
│       └── index.html                      # Frontend SPA
└── pom.xml                                 # Dependencias
```


## Requisitos Previos

- **Java 21** (JDK)
- **MySQL 8** corriendo en `localhost:3306`
- **Maven 3.9+** (o usar el Maven Wrapper incluido)


## Instalación y Ejecución

### 1. Crear la Base de Datos

```sql
CREATE DATABASE IF NOT EXISTS db_ferreteria;
CREATE USER IF NOT EXISTS 'ferreteria_user'@'localhost' IDENTIFIED BY 'alumnos';
GRANT ALL PRIVILEGES ON db_ferreteria.* TO 'ferreteria_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Clonar y Ejecutar

```bash
git clone https://github.com/tu-usuario/ferreteria.git
cd ferreteria

# Compilar
./mvnw clean install

# Ejecutar
./mvnw spring-boot:run
```

O ejecutar el JAR directamente:

```bash
java -jar target/ferreteria-0.0.1-SNAPSHOT.jar
```

### 3. Acceder

| Recurso            | URL                              |
|--------------------|----------------------------------|
| **Frontend (UI)**  | http://localhost:8080/            |
| **API REST**       | http://localhost:8080/api/articulos |

> Las tablas (`articulos`, `usuarios`) se crean automáticamente gracias a `spring.jpa.generate-ddl=true`.



## Autenticación

Usuarios por defecto configurados en `application.properties`:

| Usuario | Contraseña                           | Rol  |
|---------|--------------------------------------|------|
| `user1` | `0ab8b5f3-1773-43ff-ae00-e18d5143c143` | USER |

También puedes registrar usuarios en la base de datos con roles `ADMIN` o `USER`. Las contraseñas deben cifrarse con **BCrypt**. Usa la clase `GeneraPass.java` para generar hashes.


## API REST

Base URL: `http://localhost:8080/api/articulos`

| Método | Endpoint              | Descripción             |
|--------|-----------------------|-------------------------|
| `GET`  | `/api/articulos`       | Listar todos los artículos |
| `GET`  | `/api/articulos/{id}`  | Obtener artículo por ID |
| `POST` | `/api/articulos`       | Crear un nuevo artículo |
| `PUT`  | `/api/articulos/{id}`  | Actualizar un artículo  |
| `DELETE`| `/api/articulos/{id}` | Eliminar un artículo    |

### Ejemplo de Cuerpo (JSON)

```json
{
  "nombreArticulo": "Martillo",
  "precio": 250.00,
  "existencia": 15
}
```


## Esquema de Base de Datos

### Tabla `articulos`

| Columna         | Tipo     | Descripción            |
|-----------------|----------|------------------------|
| `id`            | BIGINT   | Clave primaria (autoincrement) |
| `nombreArticulo`| VARCHAR  | Nombre del artículo    |
| `precio`        | DOUBLE   | Precio                 |
| `existencia`    | INT      | Cantidad en stock      |

### Tabla `usuarios`

| Columna   | Tipo     | Descripción                |
|-----------|----------|----------------------------|
| `id`      | BIGINT   | Clave primaria (autoincrement) |
| `usuario` | VARCHAR(50) | Nombre de usuario (único) |
| `password`| VARCHAR(60) | Hash BCrypt de la contraseña |
| `rol`     | VARCHAR(60) | Rol del usuario (`ADMIN`, `USER`) |
