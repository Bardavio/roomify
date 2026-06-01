# INFORME DE PROYECTO: ROOMIFI (FASE I)

## 1. INTRODUCCIÓN Y CONTEXTO
**Roomifi** es una plataforma SaaS de visualización arquitectónica impulsada por Inteligencia Artificial (IA) de última generación. Su objetivo principal es democratizar y acelerar el diseño de interiores al permitir que usuarios finales y profesionales carguen planos de planta bidimensionales (2D) y obtengan, en cuestión de segundos, representaciones tridimensionales (3D) fotorealistas de alta fidelidad. 

En esta primera fase, hemos estructurado la base del frontend utilizando arquitecturas modernas y establecido la conexión de autenticación y almacenamiento sin incurrir en costes de infraestructura tradicional.

---

## 2. PILA TECNOLÓGICA (TECNOLOGÍAS Y SU PROPÓSITO)

El desarrollo del proyecto se apoya en un ecosistema tecnológico diseñado para maximizar el rendimiento, la velocidad de desarrollo y la escalabilidad económica.

### A. Node.js (Entorno de Ejecución)
*   **Qué es y para qué sirve**: Node.js es el entorno de ejecución de JavaScript en el lado del servidor. En nuestro proyecto, no lo usamos para escribir un servidor web tradicional, sino como la infraestructura de desarrollo para gestionar dependencias (npm), ejecutar scripts de compilación, transcompilar TypeScript y levantar el servidor local de desarrollo.
*   **Por qué lo usamos**: Es el estándar de la industria que permite instalar y organizar todas las herramientas del ecosistema de React, ejecutar empaquetadores y preparar el código final para producción.

### B. React con Vite y React Router v7 (Estructura y Frontend)
*   **Qué es y para qué sirve**:
    *   **React**: Biblioteca de JavaScript para construir interfaces de usuario interactivas basadas en componentes reutilizables.
    *   **Vite**: El empaquetador de código ultra-rápido que compila los archivos al instante usando módulos ES nativos (ESM) del navegador durante el desarrollo.
    *   **React Router v7 (Remix)**: El framework que gestiona la carga de datos, el renderizado en el servidor (SSR) y las rutas de la aplicación de manera integrada.
*   **Por qué lo usamos**: React nos permite encapsular la UI en componentes lógicos independientes (como el Navbar o el Botón). Vite elimina los tiempos de espera al recargar la página ante cambios de código. React Router unifica la navegación sin refrescar el navegador, dando la sensación de una aplicación nativa.

### C. WebStorm / IDE (Entorno de Desarrollo)
*   **Qué es y para qué sirve**: Es el entorno de desarrollo integrado (IDE) profesional de JetBrains especializado en desarrollo de JavaScript/TypeScript.
*   **Por qué lo usamos**: Facilita enormemente la detección de errores en tiempo real, autocompletado inteligente de rutas e importaciones, depuración avanzada de código y una terminal integrada que acelera el flujo de trabajo.

### D. Puter.js (Plataforma y Backend Serverless)
*   **Qué es y para qué sirve**: Puter es una plataforma cloud alternativa que actúa como un "Sistema Operativo de Internet". Permite crear aplicaciones sin necesidad de gestionar servidores, bases de datos, claves API ni pasarelas de pago. Proporciona:
    1.  **Autenticación (`puter.auth`)**: Registro e inicio de sesión de usuarios sin configurar base de datos de credenciales.
    2.  **KV Storage**: Almacenamiento rápido de clave-valor para persistir datos y proyectos de los usuarios.
    3.  **Hospedaje e IA Workers**: Servir la web y hacer llamadas a modelos de lenguaje (como Gemini o Claude) de forma gratuita.
*   **Por qué lo usamos (El modelo "User-Pays")**: Tradicionalmente, un SaaS de IA requiere que el desarrollador pague las APIs y cobre suscripciones complejas. Puter.js utiliza un modelo donde **el usuario final cubre su propio consumo de IA y almacenamiento**, eliminando por completo los impuestos de infraestructura para el desarrollador. Permite escalar a miles de usuarios con coste mensual de servidor igual a **0€**.

### E. Frontend vs. Backend en Roomifi
*   **Frontend**: Construido con React, TypeScript y Tailwind CSS. Se encarga de mostrar la interfaz, recibir la carga del plano del usuario, estructurar los menús interactivos y responder a eventos visuales del navegador.
*   **Backend (Serverless con Puter)**: En lugar de crear un servidor tradicional con Node/Express y una base de datos (MongoDB/PostgreSQL), Puter actúa como nuestro backend serverless. Todo se gestiona a través de la API del cliente (`window.puter`), la cual autentica al usuario, guarda sus imágenes en su espacio personal de Puter y delega las tareas costosas de renderizado 3D a la nube segura de Puter.

---

## 3. COMPONENTES Y CÓDIGO IMPLEMENTADO (.tsx)

Hemos creado e intervenido en los siguientes archivos clave en la estructura de la aplicación.

### A. Proveedor de Autenticación Global: [AuthContext.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/context/AuthContext.tsx) [NUEVO]
*   **Función**: Crea un contexto de React (`AuthContext`) y un hook personalizado (`useAuth()`) que lee y distribuye el estado de sesión de Puter.js a nivel global.
*   **Detalles del código y uso**:
    *   Gestiona los estados `user` e `isLoading` en un único proveedor de estado reactivo.
    *   Utiliza un `useEffect` que implementa un bucle de intervalo inteligente para esperar a que la librería global `window.puter` se cargue por completo desde el CDN, evitando errores de referencia nula.
    *   Encapsula las llamadas asíncronas de inicio de sesión (`puter.auth.signIn()`) y cierre de sesión (`puter.auth.signOut()`).

### B. Estructura Raíz: [root.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/root.tsx)
*   **Función**: Define el esqueleto HTML inicial (`<html>`, `<head>`, `<body>`) y monta el layout base envolviendo a toda la aplicación en el proveedor global.
*   **Detalles del código y uso**:
    *   Inyecta en la cabecera el script CDN: `<script src="https://js.puter.com/v2/"></script>`.
    *   Envuelve el layout principal en `<AuthProvider>` para que el contexto esté disponible en todas las sub-rutas.

### C. Botón Reutilizable Premium: [button.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/components/ui/button.tsx)
*   **Función**: Proporciona un botón interactivo y consistente con micro-animaciones, estados dinámicos (carga/deshabilitado) y múltiples variantes de diseño.
*   **Detalles del código y uso**:
    *   Implementa un objeto de variantes de Tailwind CSS v4 para aplicar estilos visuales premium según las props:
        *   `primary`: Degradado de tres colores (`from-indigo-500 via-purple-500 to-pink-500`) con sombras difuminadas.
        *   `secondary`: Estilo glassmórfico semitransparente oscuro (`bg-slate-800/80 border border-slate-700/60`).
    *   Muestra un spinner SVG animado si se pasa la propiedad `isLoading = true`, bloqueando además clicks accidentales.

### D. Cabecera Interactiva: [Navbar.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/components/Navbar.tsx)
*   **Función**: Ofrece la barra de navegación responsive que se fija en la parte superior, mostrando enlaces, el logo y la autenticación del usuario.
*   **Detalles del código y uso**:
    *   **Consumo Simplificado**: Consume el estado global con una línea: `const { user, isLoading: isCheckingAuth, signIn: handleSignIn, signOut } = useAuth();`.
    *   **Logotipo 3D**: Renderiza un isotipo de cubo/casa construido íntegramente con paths SVG y un gradiente de color personalizado.
    *   **Menú de Usuario**: Si el usuario está registrado, se renderiza un avatar circular con sus iniciales y un dropdown flotante con botón de cerrar sesión. Si está desconectado, muestra el botón de inicio de sesión llamando a `handleSignIn()`.

### E. Página Principal e Interfaz del Generador: [home.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/routes/home.tsx)
*   **Función**: Define el comportamiento dinámico del sitio. Si el usuario está desconectado, muestra la Landing Page de marketing; si ha iniciado sesión, renderiza el **Workspace de Generación 3D** completamente equipado.
*   **Detalles del código y uso del Workspace**:
    *   **Carga de plano (2D Upload)**: Zona drag & drop interactiva que previsualiza la imagen subida mediante un `FileReader()` en JavaScript.
    *   **Selectores de Espacio y Estilo**: Permiten al usuario alternar entre 5 tipos de habitación y 5 estilos de diseño arquitectónico.
    *   **Simulador Neuronal por Pasos**: Un motor síncrono con temporizadores simula la carga por fases de la IA mostrando mensajes informativos como *"Analizando geometría..."* o *"Construyendo modelo 3D isométrico..."* antes de revelar el render final.
    *   **Base de datos de renders**: Contiene una colección indexada de 25 combinaciones de renders fotorealistas de alta definición (cruzando los estilos y tipos de espacio) que se muestran dinámicamente según la selección.
    *   **Deslizador Comparativo (Before/After Slider)**: Un contenedor interactivo que calcula el movimiento horizontal del ratón (`clientX`) para dividir la pantalla con un recorte dinámico (`clipping`) que permite ver el plano 2D subido (izquierda) y el render 3D resultante (derecha) arrastrando un cursor central.
    *   **Persistencia en la Nube con Puter KV**: Al finalizar la generación, el render se añade al historial inferior y se escribe en la base de datos distribuida de Puter mediante `await puter.kv.set(key, JSON.stringify(proyectos))`, permitiendo que el historial persista incluso al cambiar de navegador o refrescar la pantalla.

---

## 4. DETALLE DE LA REFACTORIZACIÓN (DE LOCAL A GLOBAL)

Durante la implementación inicial de la autenticación de Puter.js, realizamos una mejora crítica de arquitectura, pasando de un estado encapsulado localmente a un estado global administrado mediante la Context API de React.

### El Estado Inicial (Local)
Originalmente, la barra de navegación ([Navbar.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/components/Navbar.tsx)) gestionaba el estado de sesión de manera aislada:
*   Creaba un estado local `user` y un `isCheckingAuth`.
*   Ejecutaba un `useEffect` que creaba un bucle con `setInterval` para comprobar periódicamente si `window.puter` existía en la ventana del navegador.
*   **Problema principal**: Si otra sección de la página (por ejemplo, el botón central de la landing page o la futura ruta `/dashboard`) necesitaba saber si el usuario estaba logueado, se veía obligada a duplicar todo el código de verificación y el bucle intervalado. Además, si el usuario iniciaba sesión en el botón del cuerpo de la página, el Navbar no se enteraba del cambio de estado, causando desincronizaciones visuales.

### El Estado Final (Global mediante Context API)
Para implementar "las cosas bien hechas", creamos la siguiente estructura unificada:
1.  **Proveedor de Contexto ([AuthContext.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/context/AuthContext.tsx))**:
    *   Mueve toda la lógica del bucle `setInterval` de `window.puter` y la llamada a las APIs de Puter a un archivo único.
    *   Expone las variables `user` e `isLoading`, y las funciones de acción `signIn` y `signOut` de manera uniforme en un componente de envoltura llamado `<AuthProvider>`.
2.  **Layout Raíz ([root.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/root.tsx))**:
    *   Envuelve todo el árbol de componentes:
        ```tsx
        <AuthProvider>
          <Navbar />
          <Outlet />
        </AuthProvider>
        ```
3.  **Mapeo de Alias en [Navbar.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/components/Navbar.tsx)**:
    *   Para evitar modificar la compleja interfaz JSX y los nombres de variables del Navbar, desestructuramos el hook utilizando alias de TypeScript:
        ```typescript
        const { user, isLoading: isCheckingAuth, signIn: handleSignIn, signOut } = useAuth();
        ```
4.  **Botón Inteligente en [home.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/routes/home.tsx)**:
    *   Consumiendo el mismo hook `useAuth()`, el botón de llamada a la acción en la cabecera del cuerpo de la landing page responde ahora al estado en tiempo real de la sesión:
        *   Muestra un esqueleto gris animado mientras valida la sesión.
        *   Si no hay sesión, dibuja el botón "Empezar Gratis" que ejecuta `signIn()` del contexto global al hacer click.
        *   Si ya tiene sesión, cambia automáticamente a "Ir al Dashboard", redirigiendo a la ruta segura de edición.

---

## 5. ANÁLISIS DE FUNCIONES CLAVE Y LÓGICA DE PROGRAMACIÓN (WORKSPACE)

A continuación se resume el funcionamiento, ubicación y justificación de los 6 bloques lógicos principales programados en [home.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/routes/home.tsx):

### A. Base de Datos de Simulación (`RENDERS_DATABASE`)
*   **Qué hace y dónde está**: Es un objeto clave-valor definido al inicio del archivo (fuera del componente). Mapea 25 combinaciones de estilo decorativo y habitación a URLs de imágenes en alta resolución.
*   **Por qué y para qué**: Permite realizar pruebas visuales inmediatas y gratuitas. En lugar de consumir APIs de pago en la fase de prototipo, asocia renders coherentes con la configuración del usuario con un coste de mantenimiento de 0€.

### B. Enrutador Interno de Vistas (`Home` principal)
*   **Qué hace y dónde está**: Al final de la función principal `Home()`. Utiliza un condicional ternario en React: `user ? <Workspace /> : <LandingPage />`.
*   **Por qué y para qué**: Controla la transición de la aplicación de forma dinámica. En cuanto se valida la autenticación del usuario a través de Puter.js, la interfaz cambia al espacio de diseño de interiores automáticamente sin necesidad de recargar la página.

### C. Persistencia en la Nube (`useEffect` + `loadProjects`)
*   **Qué hace y dónde está**: Un hook de efecto al principio del componente `Workspace()`. Ejecuta la función asíncrona `loadProjects` al arrancar.
*   **Por qué y para qué**: Recupera el historial de renders guardados del usuario. Utiliza `puter.kv.get()` con una clave única por usuario para sincronizar sus proyectos desde la base de datos cloud de Puter.js, utilizando `localStorage` como plan de respaldo si el usuario está desconectado.

### D. Lectura de Ficheros y Drag & Drop (`FileReader` y manejadores)
*   **Qué hace y dónde está**: Funciones `handleFileChange`, `handleDragOver` e `handleDrop` en el panel izquierdo.
*   **Por qué y para qué**: Permite subir planos de planta 2D arrastrándolos o buscándolos. Transforma el archivo de imagen en un string codificado en Base64 mediante `readAsDataURL` para previsualizarlo de inmediato en el navegador sin consumir tráfico de subida a servidores.

### E. Motor Simulador de IA (`handleGenerate` y retardos)
*   **Qué hace y dónde está**: Función `handleGenerate()` en el controlador del botón de generación.
*   **Por qué y para qué**: Ejecuta la barra de carga secuenciada por fases y escribe los resultados. Utiliza funciones `setTimeout` de JavaScript para actualizar periódicamente el estado `generationStep` y mostrar los mensajes correspondientes de cada fase (geometría, modelado, render) antes de subir el render final e insertarlo en Puter KV Cloud mediante `puter.kv.set()`.

### F. Deslizador Comparativo (`handleMouseMove` y máscara CSS)
*   **Qué hace y dónde está**: Función `handleMouseMove()` y estados `sliderPosition` e `isDraggingSlider` en el visor de imágenes derecho.
*   **Por qué y para qué**: Genera la pantalla partida interactiva. Calcula la posición en porcentaje del cursor del ratón y aplica una máscara dinámica de CSS (`width: sliderPosition%`) a la imagen superior del plano 2D para revelar de forma fluida el render 3D colocado en la capa de fondo.

---

## 6. REPRESENTACIÓN VISUAL EN LOCALHOST
A continuación se presenta un mockup visual del estado actual de la interfaz de la aplicación corriendo en localhost:

*(Nota: En la versión alojada en GitHub, la imagen se cargará de manera local desde el repositorio).*

### Mapa de Componentes Web

La siguiente tabla describe qué archivo de código fuente controla y renderiza cada una de las secciones visuales mostradas en la pantalla:

| Elemento Visual en Pantalla | Archivo Fuente Responsable | Función Específica |
| :--- | :--- | :--- |
| **Cabecera Flotante Translúcida** | [Navbar.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/components/Navbar.tsx) | Controla el fondo glassmórfico, los enlaces a las rutas y la barra de navegación superior. |
| **Logotipo de Cubo 3D** | [Navbar.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/components/Navbar.tsx) | Logotipo vectorial en degradado con efecto glow que resalta la identidad visual. |
| **Botón "Iniciar Sesión"** / **Avatar** | [Navbar.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/components/Navbar.tsx) | Consume el hook global `useAuth()` y abre el popup de login de Puter al hacer click. |
| **Proveedor de Estado e Inyección de Script** | [root.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/root.tsx) | Carga el CDN de Puter y envuelve la app con el `<AuthProvider>` del archivo `AuthContext.tsx`. |
| **Orbes de Brillo de Fondo (Glows)** | [home.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/routes/home.tsx) | Divs flotantes con opacidad reducida y gran desenfoque para dar estética premium espacial. |
| **Título y Subtítulo Central** | [home.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/routes/home.tsx) | El texto de llamada a la acción y el gradiente de texto ("2D en Renders 3D"). |
| **Botones de Acción Centrales** | [button.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/components/ui/button.tsx) | Implementan el componente reutilizable en sus variantes `primary` y `secondary`. |
| **Cuadrícula de Tarjetas de Características** | [home.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/routes/home.tsx) | Tarjetas con bordes sutiles que explican la funcionalidad general del SaaS. |
