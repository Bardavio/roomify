declare global {
  interface Window {
    puter?: any;
  }
}

/**
 * Obtiene el subdominio asignado al usuario en Puter KV.
 * Si no tiene uno, genera uno nuevo y lo registra en la base de datos de Puter y en Puter Hosting.
 * 
 * @param username Nombre del usuario autenticado en Puter.
 * @returns El subdominio asignado (ej. "roomifi-bardavio-abcde").
 */
export async function getOrInitializeSubdomain(username: string): Promise<string> {
  if (!window.puter) {
    throw new Error("El SDK de Puter no está cargado.");
  }

  const key = `roomifi_subdomain_${username.toLowerCase()}`;
  let subdomain = await window.puter.kv.get(key);

  if (!subdomain) {
    // Generamos un subdominio único y válido (solo letras minúsculas, números y guiones)
    const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9]/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    subdomain = `roomifi-${sanitizedUsername}-${randomSuffix}`;

    console.log(`[Puter Hosting] Generando nuevo subdominio único: ${subdomain}`);

    // Aseguramos que la carpeta que servirá el hosting exista
    try {
      await window.puter.fs.mkdir("roomifi_site");
    } catch (e) {
      // Ignorar si la carpeta ya existe
    }

    // Escribimos un index.html básico para el dominio
    try {
      await window.puter.fs.write(
        "roomifi_site/index.html",
        `<!DOCTYPE html>
<html>
<head>
    <title>Roomifi Hosting</title>
</head>
<body style="font-family: sans-serif; background-color: #0b1329; color: #ffffff; text-align: center; padding: 50px;">
    <h1>Roomifi Image Hosting</h1>
    <p>Dominio de hosting de imágenes de ${username} para el proyecto Roomifi.</p>
</body>
</html>`
      );
    } catch (e) {
      console.error("[Puter Hosting] Error al escribir index.html de base:", e);
    }

    // Registramos la carpeta como hosting con el subdominio en Puter
    try {
      await window.puter.hosting.create(subdomain, "roomifi_site");
      console.log(`[Puter Hosting] Subdominio ${subdomain}.puter.site creado con éxito.`);
    } catch (e: any) {
      // Si el subdominio ya existe o falla por otra cosa, intentamos actualizar o registrar
      console.warn(`[Puter Hosting] Error al crear hosting en Puter, reintentando asociación:`, e);
      try {
        await window.puter.hosting.update(subdomain, "roomifi_site");
      } catch (err) {
        console.error("[Puter Hosting] Error al actualizar hosting:", err);
      }
    }

    // Guardamos el subdominio en el KV Store
    await window.puter.kv.set(key, subdomain);
  }

  return subdomain;
}

/**
 * Sube una imagen a la carpeta del hosting y retorna su URL pública en el dominio de Puter.
 * 
 * @param file El archivo File a subir.
 * @param username El nombre de usuario para el subdominio.
 * @returns La URL pública (ej. "https://roomifi-bardavio-abcde.puter.site/123456789_file.png").
 */
export async function uploadToPuterHosting(file: File, username: string): Promise<string> {
  if (!window.puter) {
    throw new Error("El SDK de Puter no está cargado.");
  }

  // 1. Obtenemos el subdominio del usuario
  const subdomain = await getOrInitializeSubdomain(username);

  // 2. Limpiamos el nombre del archivo para evitar caracteres no válidos en URLs
  const cleanName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "");
  const fileName = `${Date.now()}_${cleanName}`;

  // 3. Escribimos el archivo en el directorio hosted "roomifi_site"
  console.log(`[Puter Hosting] Escribiendo archivo en roomifi_site/${fileName}...`);
  await window.puter.fs.write(`roomifi_site/${fileName}`, file);

  // 4. Retornamos la URL pública asociada
  const publicUrl = `https://${subdomain}.puter.site/${fileName}`;
  console.log(`[Puter Hosting] Archivo subido con éxito. URL: ${publicUrl}`);
  
  return publicUrl;
}
