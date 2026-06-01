import type { Route } from "./+types/home";
import { Button } from "../../components/ui/button"; // Importamos nuestro botón premium desde la raíz
import { useAuth } from "../context/AuthContext"; // Importamos el hook global de autenticación

// Define las metaetiquetas SEO para la página de inicio
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roomifi - Renderizado Arquitectónico con IA" },
    { name: "description", content: "Transforma tus planos 2D en renders 3D fotorealistas al instante con inteligencia artificial." },
  ];
}

export default function Home() {
  // Consumimos los estados globales de autenticación de Puter
  const { user, signIn, isLoading } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      
      {/* Luces de fondo decorativas en degradado violeta/azul */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[130px]" />

      {/* Contenedor principal centrado con margen superior */}
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 text-center">
        
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

        {/* Grupo de botones premium interactivos */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {isLoading ? (
            /* Skeleton durante la comprobación de sesión */
            <div className="h-12 w-36 animate-pulse rounded-xl bg-slate-900" />
          ) : user ? (
            /* Redirige al dashboard si el usuario está autenticado */
            <Button variant="primary" size="lg" onClick={() => window.location.href = "/dashboard"}>
              Ir al Dashboard
            </Button>
          ) : (
            /* Abre el login de Puter si no está autenticado */
            <Button variant="primary" size="lg" onClick={signIn}>
              Empezar Gratis
            </Button>
          )}
          <Button variant="secondary" size="lg">
            Explorar Renders
          </Button>
        </div>

        {/* Sección de cuadrícula para características del SaaS */}
        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Característica 1: Carga Rápida */}
          <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/50 p-8 text-left backdrop-blur-sm hover:border-indigo-500/30 transition-colors">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-100">Sube Planos en 2D</h3>
            <p className="text-slate-400 text-sm">Arrastra y suelta tus archivos de plano o bocetos. Soportamos JPG, PNG y PDF.</p>
          </div>

          {/* Característica 2: Renderizado con IA */}
          <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/50 p-8 text-left backdrop-blur-sm hover:border-purple-500/30 transition-colors">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-100">Generación por IA</h3>
            <p className="text-slate-400 text-sm">Modelos neuronales avanzados procesan la imagen para crear profundidad y texturas 3D.</p>
          </div>

          {/* Característica 3: Almacenamiento Puter.js */}
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
    </div>
  );
}
