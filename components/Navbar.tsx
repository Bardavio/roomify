import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router";
import { Button } from "./ui/button";
// Importamos el hook global de autenticación
import { useAuth } from "../app/context/AuthContext";

// Tipado global para declarar que la API de Puter.js existe en window
declare global {
  interface Window {
    puter?: any;     //Para poder hacer window.puter sin que de error
  }
}

export default function Navbar() {
  // Consumimos el estado y funciones de autenticación globales
  const { user, isLoading: isCheckingAuth, signIn: handleSignIn, signOut } = useAuth();
  // Estado para controlar la apertura del menú móvil (Hamburguesa)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Estado para alternar el menú desplegable del perfil de usuario
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  // Referencia para detectar clicks fuera del menú de perfil
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Efecto para cerrar el dropdown si el usuario hace click fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Función para cerrar la sesión y ocultar el menú desplegable
  const handleSignOut = () => {
    signOut();
    setIsProfileDropdownOpen(false);
  };

  // Enlaces de navegación comunes en la aplicación
  const navLinks = [
    { name: "Inicio", path: "/" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-[#e2e8f0]/75 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Sección del logotipo animado en 3D */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 transition-transform group-hover:scale-105">
              {/* Cubo isométrico 3D de diseño arquitectónico */}
              <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 3L30 11V21L16 29L2 21V11L16 3Z" fill="url(#logo-grad)" opacity="0.15" />
                <path d="M16 3L30 11L16 19L2 11L16 3Z" stroke="url(#logo-grad)" strokeWidth="2" strokeLinejoin="round" />
                <path d="M2 11V21L16 29" stroke="url(#logo-grad)" strokeWidth="2" strokeLinejoin="round" />
                <path d="M30 11V21L16 29" stroke="url(#logo-grad)" strokeWidth="2" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="logo-grad" x1="2" y1="3" x2="30" y2="29" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#22d3ee" />
                    <stop offset="0.5" stopColor="#38bdf8" />
                    <stop offset="1" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Resplandor de fondo para el logotipo */}
              <span className="absolute -inset-1 -z-10 rounded-xl bg-cyan-500/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
            </div>
            {/* Texto de la marca con gradiente */}
            <span className="bg-gradient-to-r from-slate-900 to-cyan-600 bg-clip-text text-xl font-extrabold tracking-wide text-transparent">
              Roomifi
            </span>
          </Link>

          {/* Menú de navegación principal para pantallas grandes */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-medium transition-colors hover:text-slate-900 ${
                    isActive ? "text-cyan-600" : "text-slate-500"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {/* Línea indicadora animada para el enlace activo */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Área de Autenticación en pantallas grandes */}
          <div className="hidden md:flex items-center gap-4">
            {isCheckingAuth ? (
              /* Skeleton de carga mientras verifica la sesión */
              <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100" />
            ) : user ? (
              /* Menú desplegable para usuarios autenticados */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 rounded-full bg-slate-50/80 p-1.5 pr-4 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 transition-all"
                >
                  {/* Inicial del usuario con fondo degradado */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-amber-500 text-sm font-bold text-white uppercase">
                    {user.username.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate text-sm font-medium text-slate-700">
                    {user.username}
                  </span>
                  {/* Icono de flecha indicadora */}
                  <svg className={`h-4 w-4 text-slate-400 transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Contenedor flotante del menú del usuario */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 text-xs text-slate-500 border-b border-slate-100 mb-1">
                      Conectado como {user.username}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-pink-600 hover:bg-slate-50 transition-colors"
                    >
                      {/* Icono de cerrar sesión */}
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Botón de inicio de sesión con Puter */
              <Button variant="primary" onClick={handleSignIn}>
                Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Botón de hamburguesa móvil */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Contenedor del menú desplegable móvil */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-150 bg-white px-4 py-6 md:hidden animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium py-2 rounded-lg transition-colors ${
                    isActive ? "text-cyan-600" : "text-slate-600"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            {/* Divisor estético para separar navegación de la autenticación */}
            <div className="my-2 h-px bg-slate-150" />
            
            {isCheckingAuth ? (
              <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
            ) : user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-amber-500 text-sm font-bold text-white">
                    {user.username.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.username}</span>
                </div>
                <Button variant="secondary" className="w-full justify-start text-pink-600 hover:text-pink-700 bg-slate-100 hover:bg-slate-200" onClick={handleSignOut}>
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Button variant="primary" className="w-full" onClick={handleSignIn}>
                Iniciar Sesión
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}