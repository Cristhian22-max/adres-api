# ADRES - Gestión de Adquisiciones

Este proyecto es una aplicación web desarrollada con Node.js y Express que permite gestionar adquisiciones institucionales. Incluye un frontend responsivo en HTML, CSS y JavaScript puro, junto con un backend basado en almacenamiento local utilizando archivos JSON.

## 🚀 Funcionalidades

- Crear nuevas adquisiciones con datos completos y archivo PDF obligatorio.
- Modificar adquisiciones existentes (con o sin cambiar el archivo adjunto).
- Desactivar adquisiciones sin eliminarlas.
- Eliminar adquisiciones de forma permanente (junto con su archivo).
- Consultar historial de cambios por adquisición.
- Filtrar adquisiciones por unidad o proveedor.
- Vista organizada del formulario y el listado en pantalla dividida.
- Validación de campos y visualización de montos en pesos colombianos (COP).

## 🛠️ Instalación previa (recomendado)

Antes de iniciar el proyecto por primera vez, asegúrate de tener lo siguiente instalado:

1. Node.js  
   Descárgalo desde: https://nodejs.org (versión recomendada LTS 16 o superior)

2. Git  
   Descárgalo desde: https://git-scm.com/downloads  
   Durante la instalación, asegúrate de activar la opción:
   “Git from the command line and also from 3rd-party software”

3. Editor recomendado: Visual Studio Code (opcional)  
   https://code.visualstudio.com/

4. Crea una cuenta en GitHub si deseas clonar o subir el proyecto:  
   https://github.com/join

## 📌 Requisitos

- Node.js 16 o superior
- Git configurado en la terminal
- Navegador moderno
- Sistema operativo con permisos de escritura en archivos locales

## 🧱 Estructura del proyecto

```
adres-api/
├── app.js                  # Servidor principal con rutas API
├── multer-config.js        # Configuración de subida de archivos
├── adquisiciones.json      # Base de datos local (JSON)
├── uploads/                # Carpeta donde se guardan los PDFs
├── frontend/
│   ├── index.html          # Interfaz principal
│   ├── style.css           # Estilos personalizados
│   └── script.js           # Lógica del frontend
├── package.json
└── .gitignore
```

## ⚙️ Instalación y uso

1. Clona el repositorio:

```bash
git clone https://github.com/Cristhian22-max/adres-api.git
cd adres-api
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea la carpeta de subida de archivos (si no existe):

```bash
mkdir uploads
```

4. Ejecuta el servidor:

```bash
node app.js
```

5. Abre el frontend:

Abre el archivo frontend/index.html en tu navegador (doble clic o arrastrar al navegador).

⚠️ Asegúrate de que el servidor backend esté corriendo en http://localhost:3000

## ✍️ Autor

Cristhian Gomez  
💼 GitHub: [Cristhian22-max](https://github.com/Cristhian22-max)

---

Este proyecto fue desarrollado como ejercicio técnico de integración entre frontend y backend con almacenamiento local. ¡Gracias por visitar!
