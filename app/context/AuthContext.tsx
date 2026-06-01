import React, { createContext, useContext, useState, useEffect } from "react";

// Declaración del tipo de datos expuesto por el contexto de autenticación
interface AuthContextType {
  user: any; // Datos del usuario logueado en Puter
  isLoading: boolean; // Indica si se está comprobando la sesión actualmente
  signIn: () => Promise<void>; // Abre el diálogo de inicio de sesión de Puter
  signOut: () => void; // Limpia la sesión actual
}

// Inicialización del contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor global que envolverá la aplicación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estado para el usuario actual
  const [user, setUser] = useState<any>(null);
  // Estado para el indicador de carga
  const [isLoading, setIsLoading] = useState(true);

  // Efecto ejecutado al montar el proveedor para validar si ya hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      try {
        if (window.puter && window.puter.auth.isSignedIn()) {
          const puterUser = await window.puter.auth.getUser();
          setUser(puterUser);
        }
      } catch (error) {
        console.error("Error al validar sesión global de Puter:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Reintenta de forma recursiva hasta que el script de Puter.js en el head esté listo
    if (window.puter) {
      checkSession();
    } else {
      const interval = setInterval(() => {
        if (window.puter) {
          clearInterval(interval);
          checkSession();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // Función asíncrona global para iniciar sesión mediante popup
  const signIn = async () => {
    try {
      if (window.puter) {
        const puterUser = await window.puter.auth.signIn();
        setUser(puterUser);
      }
    } catch (error) {
      console.error("Error al iniciar sesión global en Puter:", error);
    }
  };

  // Función síncrona global para cerrar sesión y limpiar el estado
  const signOut = () => {
    if (window.puter) {
      window.puter.auth.signOut();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para consumir el estado de autenticación en cualquier parte
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}
