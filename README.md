# 🔍 Chronioñ Search

¡Bienvenido a **Chronioñ Search**! El motor de búsqueda open-source, ultraligero y centrado en la privacidad. Diseñado para integrarse con la suite de navegadores **Chronioñ** (PC y Android) y con un ecosistema único de privacidad y moderación.

🌐 **Web Oficial:** [https://chronion-search.duckdns.org](https://chronion-search.duckdns.org)

---

## 🚀 Características Principales

- **Minimalista y Rápido:** Interfaz limpia inspirada en Google, sin anuncios molestos ni rastreadores.
- **Integración con Wikipedia:** Los resultados se obtienen en tiempo real desde la API de Wikipedia.
- **Modo Incógnito:** Búsquedas y chats sin guardar historial. Nada se queda en tu dispositivo.
- **Modo IA (Chat):** Chat con historial persistente (LocalStorage) y respuestas basadas en Wikipedia.
- **Easter Eggs:** Busca "amogus" para desbloquear un minijuego.
- **Ban-Bot-18:** Sistema de moderación global que bloquea búsquedas de contenido +18 y banea al usuario por 24 horas.
- **Registro de URLs (Comunidad):** Cualquiera puede registrar su web mediante un Pull Request en GitHub. El bot la indexa automáticamente.
- **Temas Estacionales:** El logo cambia en Halloween (calabaza) y Navidad (árbol + nieve).

---

## 🛠️ Estructura del Proyecto

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Portada principal del buscador (con logo SVG y temas estacionales). |
| `search.html` | Interfaz de resultados (Wikipedia, Modo IA, imágenes, vídeos, noticias). |
| `chat.html` | Chat del Modo IA (con historial en LocalStorage). |
| `incognito.html` | Portada del Modo Incógnito (sin rastreo). |
| `incognito-search.html` | Buscador del Modo Incógnito (sin guardar historial). |
| `incognito-ai.html` | Chat del Modo Incógnito (sin guardar nada). |
| `ban-bot-18.js` | Script de moderación global que banea por IP simulada. |
| `url-register/index.html` | Página de registro de URLs para la comunidad. |
| `url-register-index-now.js` | Bot que procesa los JSONs de la carpeta `url-register/`. |
| `.github/workflows/indexar-url.yml` | GitHub Action que ejecuta el bot automáticamente. |
| `urls-db.json` | Base de datos de URLs registradas por la comunidad. |
| `logo.svg` / `favicon.svg` | Identidad visual de Chronioñ. |

---

## 🎮 Cómo usar el Buscador

1. Entra a [https://chronion-search.duckdns.org](https://chronion-search.duckdns.org).
2. Escribe tu búsqueda y pulsa **Enter** o el botón **Buscar**.
3. Usa las pestañas para cambiar entre **Todo**, **Modo IA**, **Imágenes**, **Vídeos** y **Noticias**.
4. Si buscas "amogus", prepárate para el caos. 🚀

---

## 🕵️‍♂️ Modo Incógnito

Para buscar o chatear sin dejar rastro:
- **Buscador:** [https://chronion-search.duckdns.org/incognito.html](https://chronion-search.duckdns.org/incognito.html)
- **Chat IA:** [https://chronion-search.duckdns.org/incognito-ai.html](https://chronion-search.duckdns.org/incognito-ai.html)

No se guarda historial, ni cookies, ni datos en LocalStorage.

---

## 🌐 Registrar tu Web (Comunidad)

Si quieres que tu página aparezca en los resultados de Chronioñ:

1. Haz un **Fork** de este repositorio.
2. Ve a la carpeta `url-register/`.
3. Crea un archivo `.json` (ej. `mi-web.json`) con el siguiente formato:

```json
{
  "url": "https://tu-sitio-web.com",
  "title": "Título de tu sitio",
  "description": "Descripción corta.",
  "category": "Tecnología",
  "owner": "TuUsuarioDeGitHub"
}
```

4. Haz un **Pull Request**.
5. El administrador revisará tu URL manualmente. Si es segura y no contiene contenido prohibido, será indexada automáticamente.

---

## 🚨 Moderación (Ban-Bot-18)

Chronioñ tiene un sistema de moderación global que detecta búsquedas de contenido +18 en **todos los HTML**. Si detecta una infracción:
- Bloquea la pantalla del usuario.
- Registra la IP simulada del usuario.
- Aplica un baneo de 24 horas en LocalStorage.
- Si el usuario recarga, sigue baneado hasta que expire el tiempo.

---

## 🛡️ Privacidad

- **Sin cookies de rastreo.**
- **Sin anuncios.**
- **Sin perfiles de usuario.**
- **El Modo Incógnito no guarda nada.**
- **El Ban-Bot solo actúa en el navegador del usuario (no hay servidor central).**

---

## 📜 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

Hecho con 🐋 por el [NEXUS HQ](https://github.com/anyelo888ra-ux).
