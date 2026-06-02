import { getOrInitializeSubdomain } from "./puter.hosting";

declare global {
  interface Window {
    puter?: any;
  }
}

// Interfaz para el Proyecto
export interface Project {
  id: string;
  styleName: string;
  roomName: string;
  prompt: string;
  originalImage: string; // Puede ser DataURL, File o URL final
  renderImage: string;   // Puede ser DataURL o URL final
  date: string;
  timestamp: number;
  visibility?: "public" | "private";
}

/**
 * Abre el diálogo de inicio de sesión de Puter.
 */
export async function signIn(): Promise<any> {
  if (!window.puter) throw new Error("Puter SDK no cargado");
  return await window.puter.auth.signIn();
}

/**
 * Cierra la sesión activa de Puter.
 */
export function signOut(): void {
  if (window.puter) {
    window.puter.auth.signOut();
  }
}

/**
 * Obtiene el usuario autenticado actual, o null si no hay sesión.
 */
export async function getUser(): Promise<any> {
  if (!window.puter) return null;
  try {
    if (window.puter.auth.isSignedIn()) {
      return await window.puter.auth.getUser();
    }
  } catch (error) {
    console.error("Error obteniendo usuario de Puter:", error);
  }
  return null;
}

/**
 * Obtiene la lista de proyectos guardados del usuario en Puter KV.
 * Intenta primero a través del Puter Serverless Worker (si está configurado) y si falla, hace fallback al KV del cliente.
 */
export async function getProjects(username: string): Promise<Project[]> {
  const workerUrl = import.meta.env.VITE_PUTER_WORKER_URL;
  if (workerUrl) {
    try {
      console.log(`[Puter Action] Obteniendo proyectos desde el Worker: ${workerUrl}/api/projects/list`);
      const response = await fetch(`${workerUrl}/api/projects/list`);
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.projects)) {
          return data.projects;
        }
      }
    } catch (e) {
      console.warn("[Puter Action] Falló la llamada al Worker, aplicando fallback de KV cliente:", e);
    }
  }

  if (!window.puter) return [];
  try {
    const key = `roomifi_projects_${username.toLowerCase()}`;
    const stored = await window.puter.kv.get(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error al leer proyectos de Puter KV:", e);
  }
  return [];
}

/**
 * Auxiliar para subir una imagen (ya sea File, DataURL o URL remota) a Puter Hosting.
 */
async function uploadProjectImage(
  imageSource: any,
  username: string,
  projectId: string,
  label: "original" | "render"
): Promise<string> {
  if (!window.puter) throw new Error("Puter SDK no disponible");

  // Si ya es una URL de puter.site, la retornamos tal cual
  if (typeof imageSource === "string" && imageSource.includes(".puter.site")) {
    return imageSource;
  }

  const subdomain = await getOrInitializeSubdomain(username);
  let blob: Blob | null = null;
  let mimeType = "image/png";

  if (imageSource instanceof File || imageSource instanceof Blob) {
    blob = imageSource;
    mimeType = imageSource.type;
  } else if (typeof imageSource === "string") {
    if (imageSource.startsWith("data:")) {
      blob = dataURLToBlob(imageSource);
      const mimeMatch = imageSource.match(/:(.*?);/);
      if (mimeMatch) mimeType = mimeMatch[1];
    } else if (imageSource.startsWith("http://") || imageSource.startsWith("https://")) {
      blob = await fetchURLToBlob(imageSource);
    }
  }

  if (!blob) {
    // Si no se pudo procesar, pero ya es una URL (por ejemplo local /test-images), la dejamos como está
    if (typeof imageSource === "string") return imageSource;
    throw new Error("No se pudo procesar la imagen para subirla a Puter");
  }

  const ext = getExtensionFromMime(mimeType);
  const path = `roomifi_site/projects/${projectId}`;
  
  // Aseguramos que la carpeta de proyectos exista
  try {
    await window.puter.fs.mkdir(path, { createMissingParents: true });
  } catch (e) {
    // Ignorar si ya existe
  }

  const fileName = `${label}.${ext}`;
  const fullPath = `${path}/${fileName}`;

  console.log(`[Puter Action] Escribiendo imagen del proyecto en Puter FS: ${fullPath}`);
  await window.puter.fs.write(fullPath, blob);

  return `https://${subdomain}.puter.site/projects/${projectId}/${fileName}`;
}

/**
 * Crea o guarda un proyecto en Puter KV y sube sus fotos a Puter Hosting.
 * Intenta guardar mediante el Puter Serverless Worker, aplicando fallback al KV del cliente.
 */
export async function createProject(
  projectData: Omit<Project, "timestamp">,
  username: string,
  visibility: "public" | "private" = "private"
): Promise<Project> {
  if (!window.puter) throw new Error("Puter SDK no disponible");

  const projectId = projectData.id;
  
  // 1. Subir imagen original
  let originalUrl = projectData.originalImage;
  try {
    originalUrl = await uploadProjectImage(projectData.originalImage, username, projectId, "original");
  } catch (e) {
    console.error("Error subiendo imagen original a Puter Hosting:", e);
  }

  // 2. Subir imagen render
  let renderUrl = projectData.renderImage;
  try {
    renderUrl = await uploadProjectImage(projectData.renderImage, username, projectId, "render");
  } catch (e) {
    console.error("Error subiendo imagen de render a Puter Hosting:", e);
  }

  const newProject: Project = {
    ...projectData,
    originalImage: originalUrl,
    renderImage: renderUrl,
    timestamp: Date.now(),
    visibility
  };

  // Intentamos guardar mediante el Puter Serverless Worker si está configurado
  const workerUrl = import.meta.env.VITE_PUTER_WORKER_URL;
  let savedViaWorker = false;
  if (workerUrl) {
    try {
      console.log(`[Puter Action] Guardando proyecto en el Worker: ${workerUrl}/api/projects/save`);
      const response = await fetch(`${workerUrl}/api/projects/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project: newProject }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.success) {
          savedViaWorker = true;
        }
      }
    } catch (e) {
      console.warn("[Puter Action] Falló guardado en Worker, aplicando fallback cliente:", e);
    }
  }

  // Si no se guardó con el Worker (o no está configurado), hacemos fallback a KV cliente clásico
  try {
    const key = `roomifi_projects_${username.toLowerCase()}`;
    const stored = await window.puter.kv.get(key);
    let projectsArray: Project[] = [];
    if (stored) {
      projectsArray = JSON.parse(stored);
    }
    const updatedProjects = [newProject, ...projectsArray.filter(p => p.id !== projectId)];
    await window.puter.kv.set(key, JSON.stringify(updatedProjects));
    
    // Además, guardamos en localStorage como fallback
    localStorage.setItem("roomifi_projects", JSON.stringify(updatedProjects));
  } catch (e) {
    console.error("[Puter Action] Error guardando proyecto en KV cliente:", e);
    // LocalStorage como último recurso
    const local = localStorage.getItem("roomifi_projects");
    let projectsArray: Project[] = [];
    if (local) {
      projectsArray = JSON.parse(local);
    }
    const updatedProjects = [newProject, ...projectsArray.filter(p => p.id !== projectId)];
    localStorage.setItem("roomifi_projects", JSON.stringify(updatedProjects));
  }

  return newProject;
}

// Helpers de conversión
function dataURLToBlob(dataURL: string): Blob | null {
  try {
    const parts = dataURL.split(",");
    if (parts.length !== 2) return null;
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "";
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.error("Error converting data URL to Blob:", e);
    return null;
  }
}

async function fetchURLToBlob(url: string): Promise<Blob | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.blob();
  } catch (e) {
    console.error("Error fetching URL to Blob:", e);
    return null;
  }
}

function getExtensionFromMime(mime: string, defaultExt: string = "png"): string {
  if (mime.includes("png")) return "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  return defaultExt;
}
