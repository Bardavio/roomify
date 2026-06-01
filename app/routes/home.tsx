import { useState, useEffect, useRef } from "react";
import type { Route } from "./+types/home";
import { Button } from "../../components/ui/button"; // Importamos nuestro botón premium
import { useAuth } from "../context/AuthContext"; // Importamos el hook global de autenticación

// Base de datos de renders de alta fidelidad para el simulador de IA (25 combinaciones)
const RENDERS_DATABASE: Record<string, string> = {
  "modern_living_room": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
  "modern_bedroom": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
  "modern_kitchen": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
  "modern_bathroom": "https://images.unsplash.com/photo-1620626011161-997c51447094?auto=format&fit=crop&w=1200&q=80",
  "modern_office": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",

  "minimalist_living_room": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
  "minimalist_bedroom": "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80",
  "minimalist_kitchen": "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
  "minimalist_bathroom": "https://images.unsplash.com/photo-1600566752229-2751565c9276?auto=format&fit=crop&w=1200&q=80",
  "minimalist_office": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",

  "scandinavian_living_room": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
  "scandinavian_bedroom": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
  "scandinavian_kitchen": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "scandinavian_bathroom": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
  "scandinavian_office": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",

  "industrial_living_room": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  "industrial_bedroom": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  "industrial_kitchen": "https://images.unsplash.com/photo-1539922980492-38b66729f988?auto=format&fit=crop&w=1200&q=80",
  "industrial_bathroom": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80",
  "industrial_office": "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=1200&q=80",

  "boho_living_room": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  "boho_bedroom": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
  "boho_kitchen": "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1200&q=80",
  "boho_bathroom": "https://images.unsplash.com/photo-1564540574859-0dfb63985953?auto=format&fit=crop&w=1200&q=80",
  "boho_office": "https://images.unsplash.com/photo-1531971589569-0d93700fd00f?auto=format&fit=crop&w=1200&q=80",
};

// Define las metaetiquetas SEO para la página de inicio
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roomifi - Renderizado Arquitectónico con IA" },
    { name: "description", content: "Transforma tus planos 2D en renders 3D fotorealistas al instante con inteligencia artificial." },
  ];
}

export default function Home() {
  // Consumimos el contexto global de autenticación
  const { user, signIn, isLoading } = useAuth();

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Luces de fondo decorativas en degradado violeta/azul */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-600/5 blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-purple-600/5 blur-[130px]" />

      {/* Condición: si está autenticado muestra el Workspace, de lo contrario la Landing page */}
      {isLoading ? (
        <div className="flex flex-grow items-center justify-center">
          {/* Spinner de carga inicial para la sesión */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
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
function LandingPage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 text-center flex-grow">
      {/* Etiqueta de aviso superior con efecto de brillo */}
      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-sm mb-8 animate-fade-in">
        <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
        Desarrollado con Puter.js y AI gratis
      </div>

      {/* Título principal con gradientes de color */}
      <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-tight">
        Transforma planos
        <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
          2D en Renders 3D
        </span>
        al instante con IA
      </h1>

      {/* Subtítulo descriptivo de la plataforma */}
      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
        Visualiza el futuro de tus espacios de forma fotorealista. Sube tus planos de planta en 2D y deja que la IA se encargue de modelar la arquitectura por ti.
      </p>

      {/* Botones de acción principales */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button variant="primary" size="lg" onClick={onSignIn}>
          Empezar Gratis
        </Button>
        <Button variant="secondary" size="lg">
          Explorar Renders
        </Button>
      </div>

      {/* Características del servicio en rejilla de 3 columnas */}
      <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/50 p-8 text-left backdrop-blur-sm hover:border-indigo-500/30 transition-colors">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-100">Sube Planos en 2D</h3>
          <p className="text-slate-400 text-sm">Arrastra y suelta tus archivos de plano o bocetos. Soportamos JPG, PNG y PDF.</p>
        </div>

        <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/50 p-8 text-left backdrop-blur-sm hover:border-purple-500/30 transition-colors">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-100">Generación por IA</h3>
          <p className="text-slate-400 text-sm">Modelos neuronales avanzados procesan la imagen para crear profundidad y texturas 3D.</p>
        </div>

        <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/50 p-8 text-left backdrop-blur-sm hover:border-pink-500/30 transition-colors">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-100">Almacenamiento Cloud Gratis</h3>
          <p className="text-slate-400 text-sm">Guardado permanente en la nube de Puter de forma gratuita y sin límites de ancho de banda.</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: WORKSPACE PANEL (LOGIN SUCCESS)
// ==========================================
function Workspace({ user }: { user: any }) {
  // Estado para la previsualización del archivo 2D subido
  const [filePreview, setFilePreview] = useState<string | null>(null);
  // Estado para el tipo de habitación seleccionado
  const [roomType, setRoomType] = useState<string>("living_room");
  // Estado para el estilo arquitectónico
  const [designStyle, setDesignStyle] = useState<string>("modern");
  // Estado para el prompt complementario del usuario
  const [additionalPrompt, setAdditionalPrompt] = useState<string>("");
  // Estado para la barra de progreso de IA
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  // Paso actual de la generación de la IA (0, 1, 2, 3)
  const [generationStep, setGenerationStep] = useState<number>(0);
  // URL del render resultante generado
  const [renderResult, setRenderResult] = useState<string | null>(null);
  // Posición del cursor del comparador Before/After (0 a 100)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  // Estado para controlar el arrastre del ratón en el slider
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  // Listado de proyectos (historial) del usuario
  const [projects, setProjects] = useState<any[]>([]);
  // Mensajes de error del panel
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Referencia al input de tipo file oculto
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Efecto para cargar los proyectos persistidos del usuario desde Puter KV o LocalStorage
  useEffect(() => {
    const loadProjects = async () => {
      if (window.puter && window.puter.auth.isSignedIn() && user) {
        try {
          const key = `roomifi_projects_${user.username}`;
          const storedStr = await window.puter.kv.get(key);
          if (storedStr) {
            setProjects(JSON.parse(storedStr));
          }
        } catch (e) {
          console.error("Error al cargar proyectos de Puter KV:", e);
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

  // Manejador para cuando se selecciona un archivo de imagen plano
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
        setRenderResult(null);
        setErrorMsg(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Manejadores para subir plano arrastrando (drag & drop)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
        setRenderResult(null);
        setErrorMsg(null);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  // Dispara la simulación de renderizado por IA con barra de carga por fases
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
      const renderKey = `${designStyle}_${roomType}`;
      const renderUrl = RENDERS_DATABASE[renderKey] || RENDERS_DATABASE["modern_living_room"];
      setRenderResult(renderUrl);
      setIsGenerating(false);

      // Creamos la estructura del nuevo proyecto
      const newProject = {
        id: Date.now().toString(),
        styleName: designStyle.charAt(0).toUpperCase() + designStyle.slice(1),
        roomName: roomType.replace("_", " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        prompt: additionalPrompt || "Diseño limpio predeterminado",
        originalImage: filePreview,
        renderImage: renderUrl,
        date: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
      };

      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);

      // Guardamos la información en Puter KV (Cloud) o LocalStorage alternativo
      if (window.puter && window.puter.auth.isSignedIn() && user) {
        try {
          const key = `roomifi_projects_${user.username}`;
          await window.puter.kv.set(key, JSON.stringify(updatedProjects));
        } catch (e) {
          console.error("Error al persistir proyectos en Puter KV:", e);
        }
      } else {
        localStorage.setItem("roomifi_projects", JSON.stringify(updatedProjects));
      }
    }, 5500);
  };

  // Manejador del arrastre del mouse para el slider comparativo
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSlider) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  // Definición de estilos arquitectónicos en tarjeta con colores degradados descriptivos
  const styleOptions = [
    { id: "modern", name: "Moderno", desc: "Minimalista, tonos neutros y acabados finos", border: "hover:border-indigo-500" },
    { id: "minimalist", name: "Minimalista", desc: "Espacios vacíos amplios e iluminación pura", border: "hover:border-purple-500" },
    { id: "scandinavian", name: "Escandinavo", desc: "Madera cálida, naturaleza y luz suave", border: "hover:border-pink-500" },
    { id: "industrial", name: "Industrial", desc: "Tuberías expuestas, cemento y ladrillo", border: "hover:border-orange-500" },
    { id: "boho", name: "Bohemio", desc: "Colores tierra, tapices y plantas", border: "hover:border-teal-500" },
  ];

  // Tipos de habitaciones con sus respectivos iconos vectoriales
  const roomOptions = [
    { id: "living_room", name: "Salón" },
    { id: "bedroom", name: "Dormitorio" },
    { id: "kitchen", name: "Cocina" },
    { id: "bathroom", name: "Baño" },
    { id: "office", name: "Oficina" },
  ];

  // Textos animados para las fases del loader de IA
  const stepTexts = [
    "Inicializando motor neuronal y cargando plano arquitectónico...",
    "Analizando geometría del plano, delimitando muros y vanos...",
    "Construyendo modelo 3D isométrico e integrando mobiliario...",
    "Aplicando iluminación global, renderizando texturas y acabados finales...",
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-grow">
      
      {/* Mensaje de bienvenida con nombre de usuario */}
      <div className="mb-8 text-left">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-100">
          Hola, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">{user.username}</span>
        </h2>
        <p className="text-slate-400 text-sm mt-1">Configura los parámetros a la izquierda para visualizar tu espacio en 3D.</p>
      </div>

      {/* Grid del configurador y visor del render */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        
        {/* COLUMNA 1: CONFIGURACIÓN (IZQUIERDA) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Caja 1: Zona de subida de planos */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
              1. Plano 2D
            </h3>
            
            {filePreview ? (
              /* Previsualización del plano cargado */
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-44 flex items-center justify-center">
                <img src={filePreview} alt="Plano original" className="h-full w-full object-contain" />
                <button
                  onClick={() => {
                    setFilePreview(null);
                    setRenderResult(null);
                  }}
                  className="absolute top-2 right-2 rounded-lg bg-slate-950/80 p-1.5 text-pink-500 border border-slate-800 hover:bg-slate-900 transition-colors"
                >
                  {/* Icono de papelera para borrar */}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ) : (
              /* Zona de arrastrar archivos */
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/40 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:bg-slate-950/60"
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-200">Sube una imagen de tu plano</p>
                  <p className="text-xs text-slate-500 mt-1">Arrastra y suelta o haz click para explorar (PNG o JPG)</p>
                </div>
              </div>
            )}
          </div>

          {/* Caja 2: Selector de habitación */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-purple-500" />
              2. Tipo de Espacio
            </h3>
            <div className="flex flex-wrap gap-2">
              {roomOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setRoomType(opt.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    roomType === opt.id
                      ? "bg-purple-500 border-purple-400 text-white shadow-md shadow-purple-500/20"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>

          {/* Caja 3: Selector de estilo arquitectónico */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-pink-500" />
              3. Estilo de Diseño
            </h3>
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {styleOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setDesignStyle(opt.id)}
                  className={`flex items-start gap-3 rounded-xl p-3 border cursor-pointer transition-all ${
                    designStyle === opt.id
                      ? "bg-indigo-500/10 border-indigo-500/80 shadow-md shadow-indigo-500/10"
                      : `bg-slate-950/60 border-slate-800 ${opt.border}`
                  }`}
                >
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border mt-0.5 ${
                    designStyle === opt.id ? "border-indigo-400 bg-indigo-500" : "border-slate-700 bg-transparent"
                  }`}>
                    {designStyle === opt.id && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${designStyle === opt.id ? "text-indigo-300" : "text-slate-200"}`}>{opt.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Caja 4: Prompt complementario y botón generar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <span className="flex h-1.5 w-1.5 rounded-full bg-teal-500" />
                4. Detalles de Prompt (Opcional)
              </h3>
              <textarea
                value={additionalPrompt}
                onChange={(e) => setAdditionalPrompt(e.target.value)}
                placeholder="Ej. Suelos de roble, plantas de interior, iluminación cálida al atardecer, sofá acogedor beige..."
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>

            {errorMsg && <p className="text-xs font-semibold text-pink-500">{errorMsg}</p>}

            {/* Disparador de la IA */}
            <Button
              variant="primary"
              className="w-full py-4 text-sm font-bold shadow-xl shadow-indigo-500/10"
              isLoading={isGenerating}
              onClick={handleGenerate}
            >
              Generar Render 3D
            </Button>
          </div>

        </div>

        {/* COLUMNA 2: VISOR DEL RENDER 3D (DERECHA) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/20 p-6 backdrop-blur-sm flex flex-col gap-6">
            
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <h3 className="text-lg font-bold text-slate-200">Resultado del Renderizado</h3>
              {renderResult && (
                <a
                  href={renderResult}
                  download={`Roomifi-Render-${designStyle}-${roomType}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-indigo-400 border border-slate-800 hover:bg-slate-800 transition-colors"
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
            <div className="relative rounded-2xl border border-slate-800/80 bg-slate-950/80 overflow-hidden min-h-[420px] flex items-center justify-center shadow-inner">
              
              {isGenerating ? (
                /* Pantalla de carga por fases de IA */
                <div className="flex flex-col items-center justify-center p-8 max-w-md text-center gap-6">
                  
                  {/* Animación del radar de carga */}
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500/20 opacity-75" />
                    <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
                      <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  </div>

                  {/* Fases del cargador animado */}
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold text-slate-200">Generando tu Render 3D...</p>
                    <p className="text-xs text-indigo-400 font-semibold animate-pulse h-8">
                      {stepTexts[generationStep]}
                    </p>
                  </div>

                  {/* Barra de progreso visual */}
                  <div className="w-full bg-slate-900 rounded-full h-1.5 border border-slate-800 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(generationStep + 1) * 25}%` }}
                    />
                  </div>

                </div>
              ) : renderResult && filePreview ? (
                /* Deslizador comparativo Before/After interactivo */
                <div
                  className="relative w-full h-[420px] select-none cursor-ew-resize overflow-hidden"
                  onMouseMove={handleMouseMove}
                  onMouseDown={() => setIsDraggingSlider(true)}
                  onMouseUp={() => setIsDraggingSlider(false)}
                  onMouseLeave={() => setIsDraggingSlider(false)}
                >
                  {/* Capa de la derecha: Render 3D generado */}
                  <img src={renderResult} alt="Render 3D IA" className="absolute inset-0 h-full w-full object-cover pointer-events-none" />

                  {/* Capa de la izquierda: Plano original delimitado por clipping */}
                  <div
                    className="absolute inset-0 border-r-2 border-indigo-400/80 shadow-[5px_0_15px_rgba(99,102,241,0.4)]"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={filePreview}
                      alt="Plano Original 2D"
                      className="absolute inset-0 h-[420px] w-[670px] max-w-none object-cover bg-slate-950 pointer-events-none"
                    />
                  </div>

                  {/* Cursor de arrastre en el medio del slider */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border-2 border-indigo-400 text-white shadow-lg pointer-events-none z-10"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 9l-4 4 4 4m8 0l4-4-4-4" />
                    </svg>
                  </div>

                  {/* Etiquetas de estado flotantes */}
                  <span className="absolute bottom-4 left-4 rounded-lg bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-slate-300 border border-slate-800 backdrop-blur-sm z-20 pointer-events-none">
                    Plano 2D (Original)
                  </span>
                  <span className="absolute bottom-4 right-4 rounded-lg bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-indigo-300 border border-slate-800 backdrop-blur-sm z-20 pointer-events-none">
                    Render 3D (IA)
                  </span>
                </div>
              ) : (
                /* Estado vacío inicial */
                <div className="flex flex-col items-center justify-center p-12 text-center gap-4 text-slate-500">
                  <div className="h-16 w-16 rounded-full border border-slate-900 bg-slate-900/50 flex items-center justify-center text-slate-600">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-400">Esperando plano y configuración</p>
                    <p className="text-xs text-slate-600 mt-1">Sube un plano a la izquierda y presiona Generar</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* SECCIÓN 3: GALERÍA DE PROYECTOS RECIPENTES */}
      {projects.length > 0 && (
        <div className="mt-16 text-left animate-fade-in">
          <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl text-slate-200 mb-6 flex items-center gap-2">
            <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Mis Proyectos Recientes
          </h3>

          {/* Grid de proyectos guardados */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {projects.map((proj) => (
              <div key={proj.id} className="group rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden hover:border-slate-700 transition-all">
                {/* Visualizador del render guardado */}
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img src={proj.renderImage} alt={proj.styleName} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 rounded bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold text-indigo-300 border border-slate-800">
                    {proj.styleName}
                  </div>
                </div>
                {/* Detalles de la tarjeta de proyecto */}
                <div className="p-4">
                  <p className="text-sm font-bold text-slate-200">{proj.roomName}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{proj.date}</p>
                  <p className="text-xs text-slate-400 mt-2 italic truncate">"{proj.prompt}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
