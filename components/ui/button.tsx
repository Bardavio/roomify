import React from "react";

// Tipado de las propiedades del botón
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"; // Estilo visual
  size?: "sm" | "md" | "lg"; // Tamaño del botón
  isLoading?: boolean; // Estado de carga con spinner
}

//Permitir que componente padre toque el botón
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    
    // Clases base para centrado, tipografía, transición suave y efecto de click
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    // Variaciones de diseño premium del botón (gradientes, glassmorphism y brillos)
    const variants = {
      primary: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110",
      secondary: "bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-100 backdrop-blur-sm",
      outline: "border-2 border-indigo-500/50 bg-transparent text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500",
      ghost: "text-slate-400 hover:text-white hover:bg-slate-800/50",
    };

    // Tamaños del botón para diferentes contextos de pantalla
    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}  //Si ya le has dado no permite que le vuelvas a dar mientras carga
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {/* Renderiza el spinner animado si está en estado de carga */}
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {/* Contenido principal del botón */}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
