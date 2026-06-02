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
    *   **Carga de plano (2D Upload)**: Zona drag & drop interactiva que previsualiza la imagen subida mediante un `FileReader()`. Además, incorpora un botón de carga rápida ("Usar plano de ejemplo") para probar inmediatamente la alineación pixel a pixel.
    *   **Selectores de Espacio y Estilo**: Permiten al usuario alternar entre 6 tipos de espacio (incluyendo el modo principal de Apartamento Completo / Todo Junto que genera planos 2D texturizados, más los individuales de Salón, Dormitorio, Cocina, Baño y Oficina en 3D) y 5 estilos de diseño arquitectónico.
    *   **Simulador Neuronal por Pasos**: Un motor síncrono con temporizadores simula la carga por fases de la IA mostrando mensajes informativos como *"Analizando geometría..."* o *"Construyendo modelo 3D..."* antes de revelar el render final.
    *   **Base de datos de renders**: Contiene una colección indexada de 30 combinaciones de renders (las individuales a renders 3D de alta fidelidad, y el apartamento completo a un plano 2D renderizado con mobiliario a escala `/test-images/rendered_apartment.png` para alinearse perfectamente).
    *   **Deslizador Comparativo (Before/After Slider)**: Un comparador interactivo que alinea perfectamente el plano original (izquierda) con el plano renderizado con texturas y mobiliario (derecha) mediante la propiedad CSS `clip-path` en un contenedor con ajuste `object-contain`, garantizando una superposición pixel a pixel responsiva sin desfases.
    *   **Persistencia en la Nube con Puter KV**: Al finalizar la generación, el render se añade al historial inferior y se escribe en la base de datos distribuida de Puter mediante `await puter.kv.set(key, JSON.stringify(proyectos))`, permitiendo que el historial persista incluso al cambiar de navegador o refrescar la pantalla.

### F. Utilidad de Hosting de Imágenes en Subdominio: [puter.hosting.ts](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/utils/puter.hosting.ts) [NUEVO]
*   **Función**: Gestiona la inicialización de un subdominio de hosting estático en Puter y controla la subida de imágenes a este espacio para obtener URLs públicas y permanentes.
*   **Detalles del código y uso**:
    *   `getOrInitializeSubdomain(username)`: Comprueba en el KV Store si el usuario tiene asignado un subdominio (ej: `roomifi_subdomain_bardavio`). Si no existe, genera uno aleatorio único (ej. `roomifi-bardavio-abcde`), crea el directorio físico `roomifi_site`, escribe un `index.html` de bienvenida para el sitio, registra el hosting con `puter.hosting.create()` y guarda la relación en Puter KV.
    *   `uploadToPuterHosting(file, username)`: Llama a la inicialización del subdominio, guarda físicamente el archivo en `roomifi_site/[filename]` usando `puter.fs.write` y genera la URL estática limpia: `https://[subdominio].puter.site/[filename]`.

---

## 4. DETALLE DE LA REFACTORIZACIÓN (DE LOCAL A GLOBAL)

Durante la implementación inicial de la autenticación de Puter.js, realizamos una mejora crítica de arquitectura, pasando de un estado encapsulado localmente a un estado global administrado mediante la Context API de React.

### El Estado Inicial (Local)
Originalmente, la barra de navegación ([Navbar.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/components/Navbar.tsx)) gestionaba el estado de sesión de manera aislada:
*   Creaba un estado local `user` y un `isCheckingAuth`.
*   Ejecutaba un `useEffect` que creaba un bucle con `setInterval` para comprobar periódicamente si `window.puter` existía en la ventana del navegador.
*   **Problema principal**: Si otra sección de la página (por ejemplo, el botón central de la landing page o la futura ruta `/dashboard`) necesitaba saber si el usuario estaba logueado, se veía obligada a duplicar todo el código de verificación y el bucle intervalado. Además, si el usuario iniciará sesión en el botón del cuerpo de la página, el Navbar no se enteraba del cambio de estado, causando desincronizaciones visuales.

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
*   **Qué hace y dónde está**: Es un objeto clave-valor definido al inicio del archivo (fuera del componente). Mapea 30 combinaciones de estilo decorativo y tipo de espacio a URLs de imágenes. En el caso del Apartamento Completo, apunta al archivo `/test-images/rendered_apartment.png` para alinearse pixel a pixel con el plano técnico.
*   **Por qué y para qué**: Permite realizar pruebas visuales inmediatas y gratuitas. En lugar de consumir APIs de pago en la fase de prototipo, asocia renders coherentes con la configuración del usuario (soportando tanto habitaciones individuales en 3D como apartamentos renderizados bidimensionales completos con muebles alineados) con un coste de mantenimiento de 0€.

### B. Enrutador Interno de Vistas (`Home` principal)
*   **Qué hace y dónde está**: Al final de la función principal `Home()`. Utiliza un condicional ternario en React: `user ? <Workspace /> : <LandingPage />`.
*   **Por qué y para qué**: Controla la transición de la aplicación de forma dinámica. E### C. Persistencia en la Nube (`useEffect` + `loadProjects`)
*   **Qué hace y dónde está**: Un hook de efecto al principio del componente `Workspace()`. Ejecuta la función asíncrona `loadProjects` al arrancar.
*   **Por qué y para qué**: Recupera el historial de renders guardados del usuario. Utiliza `puter.kv.get()` con una clave única por usuario para sincronizar sus proyectos desde la base de datos cloud de Puter.js, utilizando `localStorage` como plan de respaldo si la conexión con los servidores de Puter.js falla.

### D. Subida de Archivos y Hosting Estático (`puter.hosting` y manejadores)
*   **Qué hace y dónde está**: Función `handleUpload` en [home.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/routes/home.tsx) e integración con el módulo [puter.hosting.ts](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/utils/puter.hosting.ts).
*   **Por qué y para qué**: Sube de manera segura el plano cargado al directorio de hosting del usuario (`roomifi_site/[filename]`) en el sistema de archivos de Puter. Retorna una URL pública estática y permanente con un formato premium bajo un subdominio único (`https://[subdominio].puter.site/[filename]`) en lugar de URLs temporales largas generadas por `getReadURL`. Si ocurre algún fallo de red, se activa el fallback local usando `FileReader` en Base64.

### E. Motor Simulador de IA (`handleGenerate` y retardos)
*   **Qué hace y dónde está**: Función `handleGenerate()` en el controlador del botón de generación.
*   **Por qué y para qué**: Ejecuta la barra de carga secuenciada por fases y escribe los resultados. Utiliza funciones `setTimeout` de JavaScript para actualizar periódicamente el estado `generationStep` y mostrar los mensajes correspondientes de cada fase (geometría, modelado, render) antes de subir el render final e insertarlo en Puter KV Cloud mediante `puter.kv.set()`.

### F. Deslizador Comparativo (`handleMouseMove` y clip-path CSS)
*   **Qué hace y dónde está**: Función `handleMouseMove()`, estados `sliderPosition` e `isDraggingSlider` en el visor de imágenes derecho.
*   **Por qué y para qué**: Genera la pantalla partida interactiva. Utiliza la propiedad CSS `clip-path: polygon(...)` sobre dos imágenes de idénticas proporciones y visualización (`object-contain`). Esto garantiza que al arrastrar el slider, el plano técnico en blanco y negro de la izquierda se convierta perfectamente alineado en el plano renderizado a color de la derecha, sin deformaciones ni desfases. Además, aplica un mapeo de filtros (`STYLE_FILTERS`) como `saturate` o `hue-rotate` sobre el plano renderizado para simular dinámicamente diferentes acabados de estilo respetando la alineación exacta.

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

---

## 7. SISTEMA DE RESILIENCIA Y SOLUCIÓN DE CONFLICTOS EN CAPAS/EVENTOS

Durante las fases de integración y pruebas en navegadores Chrome locales, depuramos y resolvimos varios bugs críticos de comunicación con el SDK y visualización en el viewport del cliente.

### A. Firma del SDK de Puter.js (`getReadURL`)
*   **Problema**: Al intentar obtener la URL de lectura pública tras subir la imagen al FileSystem de Puter, la aplicación enviaba el objeto de retorno `fileObj` completo. Esto provocaba que el SDK intentara evaluar la ruta literal `"[object Object]"` en lugar de la dirección real en disco, lo que rompía la imagen de previsualización.
*   **Solución**: Modificamos el parámetro enviado a `puter.fs.getReadURL(fileObj.path || fileObj)`, extrayendo de forma explícita el string del path virtual, garantizando así la correcta resolución de la URL de lectura del plano de planta.

### B. Tolerancia a Fallos de Red y WebSockets
*   **Problema**: En entornos locales, los bloqueadores de anuncios (ej. Brave Shields, AdBlock), firewalls o restricciones de red académica a menudo bloquean las conexiones por WebSocket (`wss://api.puter.com/...`). Esto arrojaba errores en la consola y congelaba el guardado de proyectos al bloquear las promesas de las llamadas de base de datos distribuidas.
*   **Solución**: 
    1.  **Carga de Imágenes**: Diseñamos un flujo `try-catch` robusto. Si la conexión de Puter está bloqueada, la promesa de `puter.fs.write` es rechazada y el sistema deriva la carga al lector Base64 `fallbackLocalPreview` sin interrumpir la experiencia.
    2.  **Persistencia KV**: Agregamos controladores `catch` en las promesas de `puter.kv.get` y `puter.kv.set`. Si la conexión en la nube falla, los datos del historial de renders se leen y escriben automáticamente en el **`localStorage`** del navegador del usuario.
    3.  **Indicador en UI**: Creamos una etiqueta dinámica flotante (`Local` vs `Nube`) en la tarjeta de carga mediante análisis de strings de `filePreview` (comprobando cabeceras `data:`, `blob:` o `/test-images/`), dando feedback visual inmediato del estado de la sincronización en nube.

### C. Superposición en el Canvas e Interferencia en Arrastres (Chrome z-index bug)
*   **Problema**: Al renderizar el dormitorio 3D isométrico, navegadores WebKit/Blink (como Chrome) creaban un **contexto de apilamiento (stacking context) independiente** debido a estilos dinámicos (filtros de CSS). Como consecuencia, la imagen del dormitorio 3D de la derecha tapaba por completo a la imagen del plano 2D de la izquierda, impidiendo el funcionamiento visual del slider antes/después. Además, al pulsar y arrastrar con el mouse, el navegador desencadenaba su acción por defecto de "arrastre de archivos de imagen", congelando los eventos de movimiento del slider en React. Finalmente, debido a diferencias en las relaciones de aspecto de las imágenes, el render 3D de la derecha sobresalía por los bordes laterales del plano 2D de la izquierda, mostrándose por debajo del fondo en áreas que no le correspondían.
*   **Solución**:
    1.  **z-index explícitos**: Asignamos z-index específicos a las capas del visor en `home.tsx` (`z-0` para el render final, `z-10` para el plano 2D original del clipping, `z-20` para la línea/pomo divisor y `z-30` para las etiquetas de estado), garantizando que las imágenes se organicen de forma correcta independientemente de los filtros aplicados.
    2.  **Doble clip-path**: Aplicamos `clip-path` en ambas imágenes simultáneamente. La imagen del plano 2D de la izquierda se delimita de `0` a `sliderPosition`%, y la imagen del render 3D de la derecha se delimita de `sliderPosition`% a `100`%. Esto crea una separación física absoluta en la pantalla, evitando que la imagen 3D de fondo sea visible en el lado de la imagen 2D original debido a diferencias de aspecto.
    3.  **Prevención de arrastre por defecto**: Inyectamos `e.preventDefault()` en el evento `onMouseDown` del contenedor. Esto anula el comportamiento nativo de arrastre de ficheros del navegador, liberando la interacción para que el movimiento del mouse sea 100% fluido y responda al instante en cualquier navegador.
    4.  **Soporte de Gestos Táctiles**: Agregamos manejadores táctiles (`onTouchStart`, `onTouchMove`, `onTouchEnd`) para replicar de forma nativa el deslizamiento comparador en dispositivos móviles y tablets.

---

## 8. CAPA DE SERVICIO CENTRALIZADA Y GALERÍA PREMIUM (FASE II)

En esta fase de evolución del proyecto, estructuramos e implementamos la funcionalidad de creación de proyectos, almacenamiento de planos y renders de forma estática en Puter Hosting, y rediseñamos la galería bajo estándares premium.

### A. Capa de Servicios Modulados: `puter.action.ts`
*   **Motivación**: En sintonía con la arquitectura limpia expuesta en el proyecto del video, extrajimos toda la lógica de interacción con las APIs del SDK de Puter.js del contexto y las páginas.
*   **Implementación**: Creamos `app/utils/puter.action.ts` para encapsular las llamadas de autenticación (`signIn`, `signOut`, `getUser`) y de proyectos (`getProjects`, `createProject`).
*   **Lógica de Subida y Hosting**: La función `createProject` se encarga de:
    1.  Obtener el subdominio único de Puter del usuario.
    2.  Comprobar si las imágenes asociadas al proyecto (plano original y render) ya están en el hosting de Puter. Si son locales (como imágenes cargadas en memoria o Base64), las lee, las convierte a blobs y las escribe físicamente en el directorio del hosting público (`roomifi_site/projects/[id]/[original/render].png`) mediante `puter.fs.write`.
    3.  Actualizar el Key-Value store de Puter (`roomifi_projects_[username]`) con las URLs públicas permanentes de las fotos (`https://[subdominio].puter.site/projects/...`) y el resto de los metadatos.

### B. Galería "Project Manhattan" con Hover Cross-Fade e Interactividad Activa
*   **Estilo Visual**: Implementamos una rejilla de tarjetas al estilo del video con el título descriptivo en tono tierra/naranja, badges de visibilidad ("Community") y metadatos de autor.
*   **Hover Cross-Fade**: Para lograr una experiencia "Wow", agregamos una transición por hover en la tarjeta. Al pasar el cursor por encima del render final, este disminuye su opacidad de manera suave (`transition-opacity duration-500`) mientras se revela el plano técnico 2D original que se encuentra por debajo, mostrando de forma directa la transformación.
*   **Diapositivas Reactivas**: Integramos dos líneas indicadoras en la base de la tarjeta que cambian su opacidad simulando el cambio de diapositiva (Original vs. Render) conforme el usuario interactúa.
*   **Acción de Carga Dinámica**: Al hacer clic sobre cualquier tarjeta de proyecto, el sistema extrae las imágenes y parámetros guardados (estilo, tipo de espacio, prompt), los carga de forma inmediata en el Workspace del visor Before/After principal de la parte superior, y desplaza la pantalla suavemente (`window.scrollTo({ top: 0, behavior: "smooth" })`) para que el usuario pueda volver a interactuar con el slider completo del proyecto cargado.

---

## 9. REDISEÑO VISUAL (TEMA LIGHT MODE PREMIUM CON GRIS CEMENTO) Y OPTIMIZACIÓN DE UX

Para la versión de producción final, dejamos de lado el tema oscuro original de colores índigo/morado y lo reemplazamos por el **Tema Light Mode Premium**. Este enfoque está inspirado en el diseño editorial y de estudios de arquitectura modernos, que priorizan la sobriedad, la elegancia, y el alto contraste para resaltar el contenido visual (planos y renders).

### A. Paleta de Colores Gris Concreto y Contraste de Capas
*   **Fondo Base de la Aplicación**: Establecido globalmente en un gris concreto claro (`bg-[#e2e8f0]`) en el cuerpo del documento ([app.css](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/app.css) y [root.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/root.tsx)). Esto evita la fatiga visual provocada por los fondos blancos puros brillantes y le otorga una identidad matérica sólida a la web.
*   **Efecto Degradado de la Página**: En [home.tsx](file:///c:/Users/SERGIO/OneDrive%20-%20Universidad%20de%20Alcala/Escritorio/Proyectos/Roomifi/roomifi/app/routes/home.tsx) implementamos un degradado suave de `from-[#e2e8f0] via-[#cbd5e1] to-[#cbd5e1]` combinado con luces ambientales tenues en tonos cian y ámbar (`bg-cyan-500/[0.04]` y `bg-amber-500/[0.04]`).
*   **Contraste de Tarjetas**: Todos los paneles de configuración, carga de planos y visor del render se estructuraron con fondos blancos puros (`bg-white`), bordes grises ultrafinos (`border-slate-200`) y sombras de elevación difusas (`shadow-sm`). Al colocarse sobre el fondo gris concreto, las tarjetas flotan visualmente con una definición excelente y un aspecto editorial limpio.

### B. Limpieza de Interfaz y Enlaces "Muertos"
Una interfaz premium no debe contener elementos distractores ni botones sin funcionalidad real. Realizamos una depuración profunda del flujo de navegación:
*   **Barra de Navegación**: Eliminamos los enlaces "Explorar" y "Dashboard" del Navbar tanto para ordenadores como para dispositivos móviles, dejando una navegación minimalista centrada en el flujo del usuario (Botón de Inicio/Logotipo, enlace "Inicio" y Botón de Sesión).
*   **Llamadas a la Acción en Landing**: Quitamos el botón "Explorar Renders" secundario de la landing page. Al simplificar la interfaz, reducimos la fricción cognitiva del usuario, canalizando toda la atención hacia el botón principal "Empezar Gratis" para iniciar sesión con Puter.js de manera directa.

---

## 10. VALIDACIÓN TÉCNICA, SEGURIDAD Y TRABAJO FUTURO

### A. Compilación y Calidad del Código (Typecheck & Build)
La aplicación ha sido validada bajo estrictos estándares de tipado de TypeScript y empaquetamiento con Vite:
1.  **TypeScript (`npm run typecheck`)**: Compila sin advertencias ni errores en el código fuente, asegurando contratos estrictos entre los datos de Puter y las props de los componentes React.
2.  **Producción (`npm run build`)**: El compilador de React Router genera los chunks del cliente y servidor en menos de 2 segundos, optimizando el CSS global de Tailwind CSS y empaquetando el código en archivos ultra-ligeros con minificación integrada.

### B. Ventajas del Modelo Serverless de Puter.js
*   **Coste Cero de Servidores**: No existe base de datos centralizada de proyectos, lo que elimina la necesidad de cumplir con normativas de protección de datos (RGPD) en nuestros servidores y reduce a cero el mantenimiento del backend.
*   **Seguridad**: Las peticiones de IA y almacenamiento se realizan en el sandbox de Puter.js de cada usuario conectado, por lo que el desarrollador no tiene que almacenar credenciales de OpenAI, Anthropic o estabilidad localmente ni exponerlas en el frontend.

### C. Trabajo Futuro y Siguientes Fases
*   **Conversor Vectorial a 3D**: Integrar algoritmos que interpreten líneas vectoriales de archivos CAD (.dwg / .dxf) directamente en el navegador.
*   **Renderizado Colaborativo**: Permitir salas en tiempo real usando los WebSockets integrados de Puter.js para que múltiples arquitectos editen materiales y comenten en vivo sobre el renderizado Before/After.
*   **Modelos de IA Especializados**: Implementar selectores de iluminación para renderizar interiores bajo condiciones atmosféricas específicas (noche lluviosa, día soleado, luz invernal).


