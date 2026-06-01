# Roomifi - SaaS de Visualización Arquitectónica con IA

**Roomifi** es un prototipo premium de una aplicación web SaaS que permite transformar planos arquitectónicos bidimensionales (2D) en renders fotorealistas tridimensionales (3D) de forma instantánea gracias a modelos de Inteligencia Artificial avanzados.

El proyecto está diseñado bajo una arquitectura serverless coste-cero basada en **Puter.js**, permitiendo un modelo económico "user-pays" donde los propios usuarios finales costean sus consultas de IA y espacio en disco.

---

## 🚀 Características Clave (Fase I)

*   **Puter.js AuthContext Provider**: Sistema de sesión global centralizado de Puter.js mediante la Context API de React. Cualquier página o sub-ruta puede consultar la sesión mediante el hook `useAuth()`.
*   **Navbar Premium y Responsive**: Encabezado glassmórfico de alta fidelidad, con un logotipo animado 3D isométrico personalizado en SVG, barra de enlaces activos y panel colapsable adaptado a móviles.
*   **Menú de Perfil de Usuario**: Muestra un avatar con iniciales degradadas y un dropdown animado para cerrar sesión de manera segura.
*   **Componente Botón Reutilizable (`<Button>`)**: Sistema de botones con variantes (`primary` con degradados brillantes, `secondary`, `outline` y `ghost`) y micro-animaciones integradas (efecto click activo, spinner de carga, etc.).
*   **Landing Page de Alto Impacto**: Página de destino interactiva con orbes de luz desenfocados (glows) y cuadrícula informativa de las tecnologías.

---

## 🛠️ Stack Tecnológico

*   **Frontend**: React, TypeScript, Tailwind CSS v4, Vite, React Router v7.
*   **Backend & Cloud Services (Serverless)**: Puter.js (Autenticación, Storage Clave-Valor y Hosting).
*   **IDE**: WebStorm / JetBrains.
*   **Entorno**: Node.js.

---

## 📂 Estructura de Carpetas Clave

```text
roomifi/
├── app/
│   ├── context/
│   │   └── AuthContext.tsx    <-- Contexto global de Puter Auth
│   ├── routes/
│   │   └── home.tsx           <-- Landing page hero principal
│   ├── root.tsx               <-- Layout raíz con script de Puter y Navbar
│   └── app.css                <-- Importación de Tailwind CSS
├── components/
│   ├── ui/
│   │   └── button.tsx         <-- Componente de botón reutilizable
│   └── Navbar.tsx             <-- Barra de navegación y perfil de Puter
├── README.md                  <-- Esta documentación de inicio
└── reporte_proyecto_roomifi.md <-- Informe detallado de arquitectura de Fase I
```

---

## 💻 Instalación y Desarrollo Local

1.  **Clonar el repositorio**:
    ```bash
    git clone <tu-url-de-github>
    cd roomifi
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Iniciar servidor local de desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

4.  **Generar compilación de producción**:
    ```bash
    npm run build
    ```

---

## 📝 Documentación del Proyecto
Para una explicación exhaustiva de la arquitectura del software, la división frontend/backend y los detalles técnicos específicos del código .tsx de cada componente, consulta el documento:
📄 **[reporte_proyecto_roomifi.md](reporte_proyecto_roomifi.md)**
