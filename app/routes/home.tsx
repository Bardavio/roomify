import { useState, useEffect, useRef } from "react";
import type { Route } from "./+types/home";
import { Button } from "../../components/ui/button"; // Importamos nuestro botón premium
import { useAuth } from "../context/AuthContext"; // Importamos el hook global de autenticación
import { uploadToPuterHosting } from "../utils/puter.hosting"; // Utilidad de hosting de imágenes de Puter
import { getProjects, createProject } from "../utils/puter.action";
import type { Project } from "../utils/puter.action";
import { generateDesign } from "../utils/ia.action";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

// Base de datos de renders de alta fidelidad para el simulador de IA
const RENDERS_DATABASE: Record<string, string> = {
  // Se configuran renders 2D alineados del apartamento completo cargado localmente
  "modern_entire_floor_plan": "/test-images/rendered_apartment.png",
  "minimalist_entire_floor_plan": "/test-images/rendered_apartment.png",
  "scandinavian_entire_floor_plan": "/test-images/rendered_apartment.png",
  "industrial_entire_floor_plan": "/test-images/rendered_apartment.png",
  "boho_entire_floor_plan": "/test-images/rendered_apartment.png",

  // Variedad de renders de planos en 3D para las demostraciones
  "rendered_simple_room": "/test-images/rendered_simple_room.png",
  "rendered_simple_lshape": "/test-images/rendered_simple_lshape.png",
  "rendered_sketch_layout": "/test-images/rendered_sketch_layout.png",
};

// Opciones globales de tipo de espacio para el configurador (habitación de apartamento)
const ROOM_OPTIONS = [
  { id: "entire_floor_plan", name: "Apartamento Completo (Todo Junto)" },
];

// Filtros de CSS para simular estilos sobre el renderizado 2D del apartamento completo
const STYLE_FILTERS: Record<string, string> = {
  modern: "",
  minimalist: "saturate(0.4) brightness(1.05) contrast(0.95)",
  scandinavian: "sepia(0.15) saturate(0.85) brightness(1.05)",
  industrial: "contrast(1.15) brightness(0.85) saturate(0.9) hue-rotate(-15deg)",
  boho: "saturate(1.25) sepia(0.2) hue-rotate(10deg)",
};

// Define las metaetiquetas SEO para la página de inicio
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roomifi - Renderizado Arquitectónico con IA" },
    { name: "description", content: "Transforma tus planos 2D en renders 3D fotorealistas al instante con inteligencia artificial." },
  ];
}

/**
 * Componente principal de la ruta Home ("/").
 * Actúa como enrutador y controlador de estado:
 * - Si el estado de sesión está cargando, dibuja un spinner de carga centrado.
 * - Si el usuario ya está autenticado, renderiza el componente del Workspace.
 * - Si el usuario está desconectado, renderiza la Landing Page comercial.
 */
export default function Home() {
  // Consumimos el contexto global de autenticación
  const { user, signIn, isLoading } = useAuth();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#cbd5e1] text-slate-800 flex flex-col justify-between">
      {/* Luces de fondo decorativas en degradado cian/ámbar */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.04] blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-amber-500/[0.04] blur-[130px]" />

      {/* Condición: si está autenticado muestra el Workspace, de lo contrario la Landing page */}
      {isLoading ? (
        <div className="flex flex-grow items-center justify-center">
          {/* Spinner de carga inicial para la sesión */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        </div>
      ) : user ? (
        <Workspace user={user} />
      ) : (
        <LandingPage onSignIn={signIn} />
      )}
    </div>
  );
}

// ==========================================
// COMPONENTE: LANDING PAGE (USUARIOS LOGOUT)
// ==========================================
/**
 * Componente de la Landing Page que se presenta a los usuarios que visitan Roomifi sin iniciar sesión.
 * Ofrece la propuesta de valor del SaaS, características clave y botón para abrir el popup de login de Puter.
 * 
 * @param onSignIn Función callback del botón central para iniciar el diálogo de autenticación.
 */
function LandingPage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 text-center flex-grow">
      {/* Etiqueta de aviso superior con efecto de brillo */}
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-700 backdrop-blur-sm mb-8 animate-fade-in">
        <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
        Desarrollado con Puter.js y AI gratis
      </div>

      {/* Título principal con gradientes de color */}
      <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-tight text-slate-900">
        Transforma planos
        <span className="block bg-gradient-to-r from-cyan-600 via-sky-600 to-amber-500 bg-clip-text text-transparent">
          2D en Renders 3D
        </span>
        al instante con IA
      </h1>

      {/* Subtítulo descriptivo de la plataforma */}
      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
        Visualiza el futuro de tus espacios de forma fotorealista. Sube tus planos de planta en 2D y deja que la IA se encargue de modelar la arquitectura por ti.
      </p>

      {/* Botones de acción principales */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button variant="primary" size="lg" onClick={onSignIn}>
          Empezar Gratis
        </Button>
      </div>

      {/* Características del servicio en grid de 3 columnas */}
      <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm hover:border-cyan-500/30 hover:shadow-md transition-all">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-900">Sube Planos en 2D</h3>
          <p className="text-slate-650 text-sm">Arrastra y suelta tus archivos de plano o bocetos. Soportamos JPG, PNG y PDF.</p>
        </div>

        <div className="group rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm hover:border-teal-500/30 hover:shadow-md transition-all">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 border border-teal-500/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-900">Generación por IA</h3>
          <p className="text-slate-650 text-sm">Modelos neuronales avanzados procesan la imagen para crear profundidad y texturas 3D.</p>
        </div>

        <div className="group rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm hover:border-amber-500/30 hover:shadow-md transition-all">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-900">Almacenamiento Cloud Gratis</h3>
          <p className="text-slate-650 text-sm">Guardado permanente en la nube de Puter de forma gratuita y sin límites de ancho de banda.</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: WORKSPACE PANEL (LOGIN SUCCESS)
// ==========================================
/**
 * Componente Workspace.
 * Representa el panel interactivo privado principal al que acceden los usuarios logueados.
 * Permite subir planos 2D, seleccionar estilos, configurar prompts de detalle, generar renders
 * mediante Puter AI e interactuar con el visor comparativo.
 * 
 * @param user Objeto del usuario autenticado en la sesión actual.
 */
function Workspace({ user }: { user: any }) {
  // Estado para la previsualización del plano de entrada
  const [filePreview, setFilePreview] = useState<string | null>(null);
  // Bandera de carga durante la subida al FileSystem de Puter
  const [isUploading, setIsUploading] = useState<boolean>(false);
  // Tipo de espacio seleccionado (inicializado en Apartamento Completo)
  const [roomType, setRoomType] = useState<string>("entire_floor_plan");
  // Estilo de diseño arquitectónico (ej: Moderno, Bohemio)
  const [designStyle, setDesignStyle] = useState<string>("modern");
  // Prompt con detalles adicionales opcionales escritos por el usuario
  const [additionalPrompt, setAdditionalPrompt] = useState<string>("");
  // Bandera de carga activa durante el renderizado por la IA
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  // Paso de carga neuronal actual (0 a 3) para la barra de progreso
  const [generationStep, setGenerationStep] = useState<number>(0);
  // Enlace URL del render 3D resultante retornado
  const [renderResult, setRenderResult] = useState<string | null>(null);
  // Lista histórica de proyectos guardados por el usuario
  const [projects, setProjects] = useState<any[]>([]);
  // Mensaje de alerta/error en rojo del formulario
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Bandera que indica si el render visualizado es simulado offline debido a fallo de conexión
  const [usingSimulationFallback, setUsingSimulationFallback] = useState<boolean>(false);

  // Referencia para disparar el evento de selección del archivo oculto <input type="file" />
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carga el historial de proyectos guardados en la nube de Puter KV al arrancar el componente
  useEffect(() => {
    const loadProjects = async () => {
      if (user) {
        try {
          const fetchedProjects = await getProjects(user.username);
          setProjects(fetchedProjects);
        } catch (e) {
          console.error("Error al cargar proyectos de Puter KV, aplicando fallback local:", e);
          const local = localStorage.getItem("roomifi_projects");
          if (local) {
            setProjects(JSON.parse(local));
          }
        }
      } else {
        const local = localStorage.getItem("roomifi_projects");
        if (local) {
          setProjects(JSON.parse(local));
        }
      }
    };
    loadProjects();
  }, [user]);

  /**
   * Sube el plano 2D original del usuario a su hosting web estático asignado en Puter.
   * Si ocurre un fallo de red o WebSocket bloqueado, conmuta al fallback Base64 en memoria.
   * 
   * @param file Archivo físico capturado del explorador o dropzone.
   */
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setErrorMsg(null);
    if (window.puter && window.puter.auth.isSignedIn() && user) {
      try {
        // Subimos usando nuestro módulo de hosting y obtenemos la URL pública en el dominio de Puter
        const publicUrl = await uploadToPuterHosting(file, user.username);
        setFilePreview(publicUrl);
        setRenderResult(null);
      } catch (e) {
        console.error("Error al subir al hosting de Puter, aplicando fallback local:", e);
        fallbackLocalPreview(file);
      } finally {
        setIsUploading(false);
      }
    } else {
      fallbackLocalPreview(file);
    }
  };

  /**
   * Genera una previsualización de la imagen cargada de forma puramente local.
   * Utiliza la API de FileReader para convertir el archivo en Base64 en memoria del cliente.
   * 
   * @param file Archivo capturado.
   */
  const fallbackLocalPreview = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
      setRenderResult(null);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Maneja la selección tradicional de archivos cuando el usuario utiliza el explorador del sistema.
   * 
   * @param e Evento de cambio del input file.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleUpload(selectedFile);
    }
  };

  /**
   * Cancela el comportamiento de arrastre por defecto del navegador web
   * para posibilitar la captura personalizada del plano 2D.
   * 
   * @param e Evento de arrastre sobre el contenedor.
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  /**
   * Captura el archivo de plano 2D arrastrado y soltado en la Dropzone.
   * Valida que sea de tipo imagen antes de procesar su subida.
   * 
   * @param e Evento drop.
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      handleUpload(droppedFile);
    }
  };

  /**
   * Desencadena el motor de renderizado por IA de Puter.
   * Controla las animaciones de la barra de carga por fases y se encarga de:
   * 1. Invocar la llamada a la API neural de Puter AI de forma asíncrona.
   * 2. Persistir el render e imagen de origen como un proyecto en la nube (Puter KV) o LocalStorage.
   * 3. Sincronizar y actualizar el historial inferior de proyectos.
   */
  const handleGenerate = () => {
    if (!filePreview) {
      setErrorMsg("Sube un plano de planta en 2D antes de generar.");
      return;
    }
    setErrorMsg(null);
    setIsGenerating(true);
    setGenerationStep(0);

    // Animamos los pasos progresivamente simulando procesamiento neuronal pesado
    setTimeout(() => setGenerationStep(1), 1200);
    setTimeout(() => setGenerationStep(2), 2600);
    setTimeout(() => setGenerationStep(3), 4000);

    // Finalización de generación
    setTimeout(async () => {
      // Buscamos el nombre del espacio traducido al español para la base de datos local
      const roomName = ROOM_OPTIONS.find(opt => opt.id === roomType)?.name || roomType;
      
      try {
        setUsingSimulationFallback(false);
        const renderUrl = await generateDesign(filePreview, designStyle, roomType, additionalPrompt);
        setRenderResult(renderUrl);

        // Creamos la estructura del nuevo proyecto
        const rawProject = {
          id: Date.now().toString(),
          styleName: designStyle.charAt(0).toUpperCase() + designStyle.slice(1),
          roomName: roomName,
          prompt: additionalPrompt || "Diseño generado con Puter AI",
          originalImage: filePreview,
          renderImage: renderUrl,
          date: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
        };

        if (user) {
          console.log("[Workspace] Guardando y hosteando imágenes del proyecto en Puter...");
          const savedProject = await createProject(rawProject, user.username, "private");
          setProjects(prev => [savedProject, ...prev.filter(p => p.id !== savedProject.id)]);
        } else {
          const newProjectWithTimestamp = { ...rawProject, timestamp: Date.now() };
          const updatedProjects = [newProjectWithTimestamp, ...projects];
          setProjects(updatedProjects);
          localStorage.setItem("roomifi_projects", JSON.stringify(updatedProjects));
        }
      } catch (e) {
        console.warn("[Workspace] La generación real con Puter AI falló, aplicando simulación local:", e);
        setUsingSimulationFallback(true);

        let renderUrl = RENDERS_DATABASE[`${designStyle}_${roomType}`] || RENDERS_DATABASE["modern_entire_floor_plan"];

        // Conmutamos la simulación según el tipo de plano de entrada para tener variedad y correspondencia
        if (filePreview.includes("simple_room")) {
          renderUrl = RENDERS_DATABASE["rendered_simple_room"];
        } else if (filePreview.includes("simple_lshape")) {
          renderUrl = RENDERS_DATABASE["rendered_simple_lshape"];
        } else if (filePreview.includes("sketch_layout")) {
          renderUrl = RENDERS_DATABASE["rendered_sketch_layout"];
        }

        setRenderResult(renderUrl);

        // Creamos la estructura del proyecto simulado como fallback
        const rawProject = {
          id: Date.now().toString(),
          styleName: designStyle.charAt(0).toUpperCase() + designStyle.slice(1),
          roomName: roomName,
          prompt: additionalPrompt || "Diseño limpio predeterminado (Simulación)",
          originalImage: filePreview,
          renderImage: renderUrl,
          date: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
        };

        if (user) {
          try {
            const savedProject = await createProject(rawProject, user.username, "private");
            setProjects(prev => [savedProject, ...prev.filter(p => p.id !== savedProject.id)]);
          } catch (err) {
            console.error("Error guardando proyecto simulado en Puter, aplicando fallback local:", err);
            const newProjectWithTimestamp = { ...rawProject, timestamp: Date.now() };
            const updatedProjects = [newProjectWithTimestamp, ...projects];
            setProjects(updatedProjects);
            localStorage.setItem("roomifi_projects", JSON.stringify(updatedProjects));
          }
        } else {
          const newProjectWithTimestamp = { ...rawProject, timestamp: Date.now() };
          const updatedProjects = [newProjectWithTimestamp, ...projects];
          setProjects(updatedProjects);
          localStorage.setItem("roomifi_projects", JSON.stringify(updatedProjects));
        }
      } finally {
        setIsGenerating(false);
      }
    }, 5500);
  };



  // Definición de estilos arquitectónicos en tarjeta con colores degradados descriptivos
  const styleOptions = [
    { id: "modern", name: "Moderno", desc: "Minimalista, tonos neutros y acabados finos", border: "hover:border-cyan-500" },
    { id: "minimalist", name: "Minimalista", desc: "Espacios vacíos amplios e iluminación pura", border: "hover:border-teal-500" },
    { id: "scandinavian", name: "Escandinavo", desc: "Madera cálida, naturaleza y luz suave", border: "hover:border-sky-500" },
    { id: "industrial", name: "Industrial", desc: "Tuberías expuestas, cemento y ladrillo", border: "hover:border-amber-500" },
    { id: "boho", name: "Bohemio", desc: "Colores tierra, tapices y plantas", border: "hover:border-cyan-500" },
  ];

  // Se eliminó la constante local roomOptions para usar la global ROOM_OPTIONS

  // Textos animados para las fases del loader de IA
  const stepTexts = [
    "Inicializando motor neuronal y cargando plano arquitectónico...",
    "Analizando geometría del plano, delimitando muros y vanos...",
    "Construyendo modelo 3D isométrico e integrando mobiliario...",
    "Aplicando iluminación global, renderizando texturas y acabados finales...",
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-grow">
      
      {/* Mensa      <div className="mb-8 text-left">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
          Hola, <span className="bg-gradient-to-r from-slate-900 via-cyan-600 to-amber-600 bg-clip-text text-transparent">{user.username}</span>
        </h2>
        <p className="text-cyan-650 text-sm mt-1">Configura los parámetros a la izquierda para visualizar tu espacio en 3D.</p>
      </div>

      {/* Grid del configurador y visor del render */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        
        {/* COLUMNA 1: CONFIGURACIÓN (IZQUIERDA) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Caja 1: Zona de subida de planos */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-500" />
              1. Plano 2D
            </h3>
            
            {isUploading ? (
              /* Indicador visual de carga durante la subida al Puter FS */
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-44 flex flex-col items-center justify-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
                <p className="text-xs text-cyan-600 font-semibold animate-pulse">Subiendo plano a la nube de Puter...</p>
              </div>
            ) : filePreview ? (
              /* Previsualización del plano cargado */
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-44 flex items-center justify-center">
                <img src={filePreview} alt="Plano original" className="h-full w-full object-contain" />
                
                {/* Indicador visual de la ubicación del archivo (Local vs Nube) */}
                <div className="absolute bottom-2 left-2 rounded bg-white/90 px-2.5 py-1 text-[10px] font-semibold border border-slate-200 backdrop-blur-sm z-10 flex items-center gap-1.5">
                  {filePreview.startsWith("data:") || filePreview.startsWith("blob:") || filePreview.startsWith("/test-images/") ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-amber-650">Local (Sin subir a Puter)</span>
                    </>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                      <span className="text-cyan-600">Nube (Puter FS)</span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => {
                    setFilePreview(null);
                    setRenderResult(null);
                  }}
                  className="absolute top-2 right-2 rounded-lg bg-white/90 p-1.5 text-pink-650 border border-slate-200 hover:bg-slate-100 transition-colors z-10"
                >
                  {/* Icono de papelera para borrar */}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ) : (
              /* Zona de arrastrar archivos con opción de plano de demostración */
              <div className="flex flex-col gap-3 w-full">
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-cyan-500/50 bg-slate-50/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:bg-slate-50"
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 text-cyan-600 shadow-sm">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-800">Sube una imagen de tu plano</p>
                    <p className="text-xs text-slate-505 mt-1">Arrastra y suelta o haz click para explorar (PNG o JPG)</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 mt-1.5">
                  <p className="text-[10px] text-cyan-650 font-bold uppercase tracking-wider">Planos de ejemplo para probar:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilePreview("/test-images/blueprint_apartment.png");
                        setRenderResult(null);
                        setErrorMsg(null);
                      }}
                      className="py-2 px-3 rounded-lg text-[10px] font-bold bg-cyan-50 border border-cyan-100 text-cyan-700 hover:bg-cyan-100/50 transition-all text-center cursor-pointer shadow-sm"
                    >
                      Apartamento Completo
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilePreview("/test-images/simple_room.png");
                        setRenderResult(null);
                        setErrorMsg(null);
                      }}
                      className="py-2 px-3 rounded-lg text-[10px] font-bold bg-teal-50 border border-teal-100 text-teal-700 hover:bg-teal-100/50 transition-all text-center cursor-pointer shadow-sm"
                    >
                      Habitación Simple (IA)
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilePreview("/test-images/simple_lshape.png");
                        setRenderResult(null);
                        setErrorMsg(null);
                      }}
                      className="py-2 px-3 rounded-lg text-[10px] font-bold bg-sky-50 border border-sky-100 text-sky-700 hover:bg-sky-100/50 transition-all text-center cursor-pointer shadow-sm"
                    >
                      Habitación en L (IA)
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilePreview("/test-images/sketch_layout.png");
                        setRenderResult(null);
                        setErrorMsg(null);
                      }}
                      className="py-2 px-3 rounded-lg text-[10px] font-bold bg-amber-50 border border-amber-100 text-amber-700 hover:bg-amber-100/50 transition-all text-center cursor-pointer shadow-sm"
                    >
                      Boceto a Mano
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Caja 2: Selector de estilo arquitectónico */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-teal-500" />
              2. Estilo de Diseño
            </h3>
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {styleOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setDesignStyle(opt.id)}
                  className={`flex items-start gap-3 rounded-xl p-3 border cursor-pointer transition-all ${
                    designStyle === opt.id
                      ? "bg-cyan-50/50 border-cyan-500 shadow-sm text-cyan-700"
                      : `bg-slate-50/80 border-slate-200/80 ${opt.border}`
                  }`}
                >
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border mt-0.5 ${
                    designStyle === opt.id ? "border-cyan-500 bg-cyan-500" : "border-slate-300 bg-transparent"
                  }`}>
                    {designStyle === opt.id && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${designStyle === opt.id ? "text-cyan-700" : "text-slate-800"}`}>{opt.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Caja 3: Prompt complementario y botón generar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                3. Detalles de Prompt (Opcional)
              </h3>
              <textarea
                value={additionalPrompt}
                onChange={(e) => setAdditionalPrompt(e.target.value)}
                placeholder="Ej. Suelos de roble, plantas de interior, iluminación cálida al atardecer, sofá acogedor beige..."
                rows={2}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            {errorMsg && <p className="text-xs font-semibold text-pink-650">{errorMsg}</p>}

            {/* Disparador de la IA */}
            <Button
              variant="primary"
              className="w-full py-4 text-sm font-bold shadow-md shadow-cyan-500/15"
              isLoading={isGenerating}
              onClick={handleGenerate}
            >
              Generar Render 3D
            </Button>
          </div>

          </div>

        {/* COLUMNA 2: VISOR DEL RENDER 3D (DERECHA) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">Resultado del Renderizado</h3>
              {renderResult && (
                <a
                  href={renderResult}
                  download={`Roomifi-Render-${designStyle}-${roomType}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-xs font-semibold text-cyan-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  {/* Icono de descarga */}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar
                </a>
              )}
            </div>

            {/* Caja contenedora del render */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden min-h-[420px] flex items-center justify-center shadow-inner">
              
              {isGenerating ? (
                /* Pantalla de carga por fases de IA */
                <div className="flex flex-col items-center justify-center p-8 max-w-md text-center gap-6">
                  
                  {/* Animación del radar de carga */}
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500/10 opacity-75" />
                    <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-cyan-600 shadow-sm">
                      <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  </div>

                  {/* Fases del cargador animado */}
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold text-slate-800">Generando tu Render 3D...</p>
                    <p className="text-xs text-cyan-600 font-semibold animate-pulse h-8">
                      {stepTexts[generationStep]}
                    </p>
                  </div>

                  {/* Barra de progreso visual */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(generationStep + 1) * 25}%` }}
                    />
                  </div>

                </div>
              ) : renderResult && filePreview ? (
                /* Deslizador comparativo Before/After interactivo con react-compare-slider */
                <div className="relative w-full h-[420px] select-none bg-slate-100">
                  <ReactCompareSlider
                    className="w-full h-full"
                    handle={
                      <div className="flex flex-col items-center justify-center h-full relative">
                        <div className="absolute top-0 bottom-0 w-0.5 bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)] z-20 pointer-events-none" />
                        <div className="relative z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white border-2 border-cyan-500 text-cyan-600 shadow-md cursor-ew-resize">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 9l-4 4 4 4m8 0l4-4-4-4" />
                          </svg>
                        </div>
                      </div>
                    }
                    itemOne={
                      <ReactCompareSliderImage
                        src={filePreview}
                        alt="Plano Original 2D"
                        style={{
                          objectFit: "contain",
                          width: "100%",
                          height: "100%"
                        }}
                      />
                    }
                    itemTwo={
                      <ReactCompareSliderImage
                        src={renderResult}
                        alt="Render Generado"
                        style={{
                          objectFit: "contain",
                          width: "100%",
                          height: "100%",
                          filter: roomType === "entire_floor_plan" && STYLE_FILTERS[designStyle] ? STYLE_FILTERS[designStyle] : undefined,
                        }}
                      />
                    }
                  />

                  {/* Etiquetas de estado flotantes con z-index superior */}
                  {usingSimulationFallback && (
                    <span className="absolute top-4 right-4 rounded-lg bg-amber-500 text-white px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wider border border-amber-400 z-30 pointer-events-none animate-pulse shadow-sm">
                      Simulación Local (IA Offline)
                    </span>
                  )}
                  <span className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-650 border border-slate-200 backdrop-blur-sm z-30 pointer-events-none shadow-sm">
                    Plano 2D (Original)
                  </span>
                  <span className="absolute bottom-4 right-4 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold text-cyan-700 border border-slate-200 backdrop-blur-sm z-30 pointer-events-none shadow-sm">
                    {roomType === "entire_floor_plan" ? "Plano Renderizado (2D)" : "Render 3D (IA)"}
                  </span>
                </div>
              ) : (
                /* Estado vacío inicial */
                <div className="flex flex-col items-center justify-center p-12 text-center gap-4 text-cyan-600">
                  <div className="h-16 w-16 rounded-full border border-slate-200 bg-white flex items-center justify-center text-cyan-500 shadow-sm">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 116 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Esperando plano y configuración</p>
                    <p className="text-xs text-slate-400 mt-1">Sube un plano a la izquierda y presiona Generar</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* SECCIÓN 3: GALERÍA DE PROYECTOS RECIPENTES */}
      {projects.length > 0 && (
        <div className="mt-20 text-left animate-fade-in">
          <div className="flex flex-col gap-1 mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">Projects</h2>
            <p className="text-cyan-650 text-sm">Your latest work and shared community projects, all in one place.</p>
          </div>

          {/* Grid de proyectos guardados */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setFilePreview(proj.originalImage);
                  setRenderResult(proj.renderImage);
                  setDesignStyle(proj.styleName.toLowerCase());
                  
                  // Intentamos encontrar el ID de la habitación para actualizar el selector de Habitación
                  const matchRoom = ROOM_OPTIONS.find(opt => opt.name === proj.roomName);
                  if (matchRoom) {
                    setRoomType(matchRoom.id);
                  }
                  
                  setAdditionalPrompt(proj.prompt === "Diseño limpio predeterminado" ? "" : proj.prompt);
                  
                  // Desplazamos al usuario suavemente hacia el Workspace
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-cyan-500/30 hover:shadow-lg transition-all flex flex-col shadow-sm"
              >
                {/* Visualizador del render guardado con Hover Cross-Fade e indicador de diapositivas */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  
                  {/* Imagen 1: Render Generado (vista por defecto) */}
                  <img
                    src={proj.renderImage}
                    alt={`${proj.roomName} Renderizado`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Imagen 2: Plano original (se revela en hover con un crossfade) */}
                  <img
                    src={proj.originalImage}
                    alt={`${proj.roomName} Plano Original`}
                    className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out group-hover:scale-105 pointer-events-none"
                  />

                  {/* Badge de visibilidad al estilo del video */}
                  <div className="absolute top-4 left-4 z-20 rounded-md bg-white/95 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold tracking-widest text-slate-800 uppercase shadow-sm">
                    {proj.visibility === "public" ? "Community" : "Private"}
                  </div>

                  {/* Indicador de páginas/diapositivas (micro-animación) */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 px-4">
                    <span className="h-1 flex-1 max-w-[40px] rounded-full bg-white opacity-90 group-hover:bg-white/40 group-hover:opacity-100 transition-all duration-300"></span>
                    <span className="h-1 flex-1 max-w-[40px] rounded-full bg-white/40 group-hover:bg-white group-hover:opacity-90 transition-all duration-300"></span>
                  </div>

                  {/* Indicación de hover para el usuario */}
                  <div className="absolute inset-0 bg-slate-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-slate-800 border border-slate-200 backdrop-blur-sm pointer-events-none shadow-sm">
                      Hover para ver Plano 2D
                    </span>
                  </div>
                </div>

                {/* Detalles del proyecto */}
                <div className="p-5 flex items-center justify-between flex-grow">
                  <div className="flex-grow pr-4">
                    <h3 className="text-slate-800 font-sans text-lg font-bold group-hover:text-cyan-600 transition-colors">
                      {proj.roomName.startsWith("Apartamento") ? `Project ${proj.styleName}` : `Project ${proj.roomName}`}
                    </h3>
                    <div className="flex items-center gap-1.5 text-cyan-650 text-xs mt-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{proj.date} BY {user ? user.username.toUpperCase() : "JS MASTERY"}</span>
                    </div>
                  </div>
                  
                  {/* Botón de flecha premium */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white shadow-md shadow-cyan-500/25 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
