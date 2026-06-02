declare global {
  interface Window {
    puter?: any;
  }
}

/**
 * Descarga una imagen desde una URL y la convierte en una cadena Base64 Data URL.
 * Cumple estrictamente con el prompt solicitado (fetch -> blob -> FileReader -> Promise).
 * Si la imagen ya es una Data URL (Base64), la retorna inmediatamente.
 * 
 * @param url Dirección de la imagen a descargar o Data URL.
 * @returns Promesa que resuelve en una cadena Data URL de la imagen en Base64.
 */
export async function fetchAsDataURL(url: string): Promise<string> {
  if (url.startsWith("data:")) {
    return url;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert image to Data URL"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Genera un render 3D arquitectónico a partir de un plano 2D utilizando Puter AI.
 * 
 * @param originalImageUrl URL o Data URL del plano 2D original.
 * @param designStyle Estilo arquitectónico (ej. "modern", "minimalist").
 * @param roomType Tipo de espacio/habitación (ej. "living_room", "bedroom").
 * @param additionalPrompt Prompt adicional/personalizado del usuario.
 * @returns Promesa que resuelve en la URL o Data URL del render 3D generado.
 */
export async function generateDesign(
  originalImageUrl: string,
  designStyle: string,
  roomType: string,
  additionalPrompt: string
): Promise<string> {
  if (!window.puter) {
    throw new Error("El SDK de Puter no está cargado.");
  }

  console.log("[Puter AI] Iniciando generación de render...");
  
  // 1. Convertimos la imagen de origen a Base64 Data URL
  console.log("[Puter AI] Convirtiendo plano a Base64...");
  const base64DataUrl = await fetchAsDataURL(originalImageUrl);

  // 2. Definimos el prompt del sistema al estilo de la configuración de Roomify
  const SYSTEM_PROMPT = `TASK: Convert the input 2D floor plan into a **photorealistic, topdown 3D architectural render**.

STRICT REQUIREMENTS (do not violate):
1) **REMOVE ALL TEXT**: Do not render any letters, numbers, labels, dimensions, or annotations. Floors must be continuous where text used to be.
2) **GEOMETRY MUST MATCH**: Walls, rooms, doors, and windows must follow the exact lines and positions in the plan. Do not shift or resize.
3) **TOPDOWN ONLY**: Orthographic topdown view. No perspective tilt.
4) **CLEAN, REALISTIC OUTPUT**: Crisp edges, balanced lighting, and realistic materials. No sketch/handdrawn look.
5) **NO EXTRA CONTENT**: Do not add rooms, furniture, or objects that are not clearly indicated by the plan.

STRUCTURE & DETAILS:
- **Walls**: Extrude precisely from the plan lines. Consistent wall height and thickness.
- Finish: professional architectural visualization; no text, no watermarks, no logos.`;

  // 3. Estructuramos el prompt completo combinando las opciones del usuario
  const fullPrompt = `${SYSTEM_PROMPT}

User Settings for generation:
- Room Space Type: ${roomType.replace(/_/g, " ")}
- Interior Design Style: ${designStyle}
- Additional Custom Instructions: ${additionalPrompt || "None, stick to standard layout details."}`;

  console.log(`[Puter AI] Llamando a puter.ai.txt2img... Prompt: "Project ${designStyle} ${roomType}"`);

  // 4. Invocamos Puter AI con la imagen original como guía (image-to-image / ControlNet)
  const options = {
    model: "black-forest-labs/flux-schnell", // Un modelo de imagen premium y rápido
    image_url: base64DataUrl,                  // Guía de imagen
    input_image: base64DataUrl,                // Parámetro alternativo para compatibilidad
  };

  const imgElement = await window.puter.ai.txt2img(fullPrompt, options);

  if (!imgElement || !imgElement.src) {
    throw new Error("Puter AI no retornó ninguna imagen válida.");
  }

  console.log("[Puter AI] Render generado con éxito.");
  return imgElement.src;
}
