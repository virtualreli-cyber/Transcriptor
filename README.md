# AudioScribe

Aplicación web para transcribir notas de voz usando Google Gemini.

## 🚀 Despliegue en Netlify

Este proyecto está configurado para desplegarse fácilmente en Netlify manteniendo tu API Key segura.

### Pasos para desplegar:

1. **Sube este código a GitHub**:
   - Crea un nuevo repositorio en GitHub.
   - Sube todos los archivos (excepto la carpeta `node_modules` y `.env.local` que son ignorados automáticamente).

2. **Conecta con Netlify**:
   - Entra en [Netlify](https://app.netlify.com/).
   - Haz clic en "Add new site" > "Import an existing project".
   - Selecciona **GitHub** y elige tu repositorio.

3. **Configura la API Key (¡IMPORTANTE!)**:
   - En la configuración del sitio en Netlify, el comando de build y el directorio de publicación se detectarán automáticamente gracias al archivo `netlify.toml`.
   - **ANTES DE PULSAR "DEPLOY"** (o justo después), ve a **Site configuration > Environment variables**.
   - Añade una nueva variable:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: *Tu clave de API de Gemini* (la que empieza por `AIza...`)

4. **¡Listo!**:
   - Netlify construirá el sitio y la función "serverless" que protege tu clave.
   - Tu aplicación estará disponible en la URL que te dé Netlify (ej: `https://tu-sitio.netlify.app`).

## 🛠️ Desarrollo Local

Para probarlo en tu ordenador:

1. Asegúrate de tener el archivo `.env.local` con `GEMINI_API_KEY=tu_clave`.
2. Instala las dependencias: `npm install`.
3. Para probar las funciones de Netlify localmente, necesitas `netlify-cli`:
   ```bash
   npm install netlify-cli -g
   netlify dev
   ```
   *Nota: Si solo usas `npm run dev` (Vite), la parte de transcripción fallará porque necesita el backend de Netlify.*

## ❓ Solución de Problemas

### Netlify dice que es "HTML" y no me deja seleccionar "Vite" o "React"
Esto pasa si Netlify no detecta bien los archivos de configuración al importar.
1. **Asegúrate de subir TODOS los archivos**: Especialmente `package.json`, `package-lock.json` y `netlify.toml`.
2. Si sigue fallando, en la configuración de Netlify (Build settings):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Gracias al archivo `netlify.toml` que he incluido, Netlify debería corregirse solo una vez que pulse el botón de desplegar, incluso si al principio dice "HTML".
