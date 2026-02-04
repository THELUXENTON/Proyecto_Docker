README del Frontend
# 🎬 Cliente Web - Cine 

Interfaz moderna y responsiva para la gestión del catálogo de cine. Permite ver la cartelera pública y gestionar películas/directores mediante un panel de administración protegido.

## 👨‍💻 Autores
* **Andrés Tulcanaza**
* **David Puga**

## ⚡ Tecnologías Usadas
* **React + Vite** (Framework frontend)
* **Material UI (MUI)** (Diseño de componentes)
* **Axios** (Conexión HTTP)
* **React Router DOM** (Navegación)

## 🛠️ Instalación y Configuración

### 1. Preparar el proyecto
Asegúrate de tener **Node.js** instalado.

```bash
# Entrar a la carpeta
cd frontend

# Instalar librerías
npm install
2. Configurar Variables de Entorno
Crea un archivo llamado .env en la raíz de la carpeta frontend y agrega tus credenciales del backend:

Fragmento de código
VITE_API_URL=http://127.0.0.1:8000
VITE_CLIENT_ID=TU_CLIENT_ID_COPIADO_DEL_BACKEND
VITE_CLIENT_SECRET=TU_CLIENT_SECRET_COPIADO_DEL_BACKEND
3. Ejecutar Proyecto
Bash
npm run dev
La aplicación abrirá en http://localhost:5173/

🌟 Funcionalidades
Cartelera Pública: Vista de películas para visitantes.

Autenticación: Login seguro conectado a Django OAuth2.

Gestión de Contenido: Crear, Editar y Eliminar Películas y Directores (Solo Admin).

Subida de Archivos: Carga de posters y fotos reales.


---

### 💡 Un consejo extra de profesional
Si quieres verte aún más pro, puedes crear un archivo `README.md` en la carpeta **RAÍZ** (fuera de backend y frontend) que diga algo como:

> **Proyecto Final - Sistemas Distribuidos**
>
> Este repositorio contiene el código fuente del sistema "Cine".
>
> * `/backend`: API REST en Django.
> * `/frontend`: Cliente web en React.
>
> **Autores:** David Puga & Andrés Tulcanaza.

¡Con eso queda documentado de lujo! 🚀