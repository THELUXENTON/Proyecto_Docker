# 🎬 Proyecto Final: Sistema Distribuido de Gestión de Cine

Este repositorio contiene la implementación técnica del Proyecto Final para la asignatura de **Computación Distribuida**. El sistema simula una plataforma de gestión de inventario cinematográfico utilizando una arquitectura de microservicios contenerizados.

## 📋 Descripción de la Arquitectura

El proyecto ha sido diseñado para desacoplar completamente la lógica de negocio, la persistencia de datos y la interfaz de usuario. Se utiliza **Docker Compose** para orquestar tres contenedores independientes que se comunican a través de una red virtual interna (`bridge`).

### Componentes del Sistema:

| Servicio | Tecnología | Puerto (Host) | Descripción |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + Vite (Node.js 20) | `5173` | Interfaz de usuario para consumo de API. |
| **Backend** | Django REST Framework (Python 3.10) | `8000` | Lógica de negocio y exposición de API REST. |
| **Base de Datos** | PostgreSQL 15 | `5432` (Interno) | Persistencia de datos relacional. |

---

## 🚀 Instrucciones de Despliegue

Este proyecto es agnóstico al sistema operativo. Para ejecutarlo, asegúrese de tener instalado **Docker Desktop**.

### 1. Clonar el repositorio
```bash
git clone [https://github.com/THELUXENTON/Proyecto_Docker.git](https://github.com/THELUXENTON/Proyecto_Docker.git)
cd Proyecto_Docker
2. Ejecutar la orquestación
Construye las imágenes y levanta los servicios en segundo plano:

Bash

docker compose up --build
3. Acceder a los servicios
Una vez que la terminal indique que los servicios están listos:

Aplicación Web (Frontend): http://localhost:5173

API Root (Backend): http://localhost:8000/api/

Panel Administrativo: http://localhost:8000/admin/

⚙️ Configuración y Credenciales
Crear Superusuario (Administrador)
Dado que la base de datos se inicia vacía, debe crear un administrador para gestionar el catálogo:

Bash

# Ejecutar comando dentro del contenedor de backend
docker exec -it cine_backend python manage.py createsuperuser
(Siga las instrucciones en pantalla para definir usuario y contraseña).

Variables de Entorno
La configuración es dinámica y se gestiona a través del archivo docker-compose.yml.

Base de Datos: postgres://cine_user:cine_password@db:5432/cine_db

API URL (Frontend): VITE_API_URL=http://localhost:8000

📂 Estructura del Proyecto
/backend: Código fuente de la API Django (Modelos, Serializers, Views).

/frontend: Código fuente del cliente React (Componentes, Axios, Vite config).

docker-compose.yml: Archivo maestro de orquestación de servicios.

Universidad Internacional SEK Computación Distribuida - 2026
