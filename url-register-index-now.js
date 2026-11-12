const fs = require('fs');
const path = require('path');

// Archivo oficial donde se guardan TODAS las URLs aprobadas
const DB_FILE = path.join(__dirname, 'urls-db.json');

// Archivo que el usuario modificó en su PR (puede ser una carpeta o un archivo)
const USER_FILE = path.join(__dirname, 'url-register', 'template.json');

function procesarURL() {
    try {
        console.log("🤖 [Chronioñ Bot] Iniciando revisión de URL...");

        // 1. Verificar si el usuario modificó el archivo
        if (!fs.existsSync(USER_FILE)) {
            console.log("⚠️ No se encontró el archivo template.json modificado.");
            process.exit(0);
        }

        // 2. Leer el JSON del usuario
        const rawData = fs.readFileSync(USER_FILE, 'utf8');
        const userData = JSON.parse(rawData);

        // 3. Validaciones básicas
        if (!userData.url || !userData.title) {
            console.error("❌ Error: Faltan campos obligatorios (url o title).");
            process.exit(1); // Falla el Action
        }

        if (!userData.url.startsWith('http')) {
            console.error("❌ Error: La URL debe empezar con http:// o https://");
            process.exit(1);
        }

        // 4. Leer la base de datos actual (o crearla si no existe)
        let db = [];
        if (fs.existsSync(DB_FILE)) {
            db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        }

        // 5. Comprobar si la URL ya está registrada (para no duplicar)
        const yaExiste = db.some(item => item.url === userData.url);
        if (yaExiste) {
            console.log("⚠️ La URL ya está registrada. Ignorando...");
            process.exit(0);
        }

        // 6. Añadir la nueva URL a la base de datos
        db.push({
            url: userData.url,
            title: userData.title,
            description: userData.description || "Sin descripción.",
            category: userData.category || "Otro",
            owner: userData.owner || "Desconocido",
            date: new Date().toISOString()
        });

        // 7. Guardar la base de datos actualizada
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
        console.log(`✅ [Chronioñ Bot] URL registrada con éxito: ${userData.url}`);

        // 8. (Opcional) Restaurar el template para el próximo usuario
        const templateOriginal = {
            url: "https://tu-sitio-web.com",
            title: "Título de tu sitio",
            description: "Descripción corta...",
            category: "Tecnología",
            owner: "TuNombreDeUsuarioGitHub"
        };
        fs.writeFileSync(USER_FILE, JSON.stringify(templateOriginal, null, 2));
        console.log("🔄 Template restaurado para el próximo PR.");

    } catch (error) {
        console.error("❌ Error procesando el JSON:", error.message);
        process.exit(1);
    }
}

procesarURL();
