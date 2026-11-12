const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'urls-db.json');
const REGISTER_DIR = path.join(__dirname, 'url-register');

// Función para validar y procesar un archivo JSON
function procesarArchivo(filePath) {
    try {
        const rawData = fs.readFileSync(filePath, 'utf8');
        const userData = JSON.parse(rawData);

        // Validaciones
        if (!userData.url || !userData.title) {
            console.error(`❌ [${path.basename(filePath)}] Faltan campos obligatorios (url o title).`);
            return false;
        }

        if (!userData.url.startsWith('http')) {
            console.error(`❌ [${path.basename(filePath)}] La URL debe empezar con http:// o https://`);
            return false;
        }

        return userData;
    } catch (error) {
        console.error(`❌ Error leyendo ${path.basename(filePath)}:`, error.message);
        return false;
    }
}

function main() {
    console.log("🤖 [Chronioñ Bot] Iniciando escaneo de la carpeta url-register...");

    // 1. Verificar que la carpeta existe
    if (!fs.existsSync(REGISTER_DIR)) {
        console.error("❌ La carpeta url-register no existe.");
        process.exit(1);
    }

    // 2. Leer todos los archivos de la carpeta
    const files = fs.readdirSync(REGISTER_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json') && file !== 'template.json');

    if (jsonFiles.length === 0) {
        console.log("⚠️ No se encontraron nuevos archivos JSON para procesar.");
        process.exit(0);
    }

    // 3. Cargar la base de datos actual (o crearla si no existe)
    let db = [];
    if (fs.existsSync(DB_FILE)) {
        db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }

    let urlsAñadidas = 0;

    // 4. Procesar cada archivo
    jsonFiles.forEach(file => {
        const filePath = path.join(REGISTER_DIR, file);
        const userData = procesarArchivo(filePath);

        if (userData) {
            // Comprobar si la URL ya está registrada
            const yaExiste = db.some(item => item.url === userData.url);
            
            if (yaExiste) {
                console.log(`⚠️ [${file}] La URL ${userData.url} ya está registrada. Ignorando.`);
            } else {
                // Añadir a la base de datos
                db.push({
                    url: userData.url,
                    title: userData.title,
                    description: userData.description || "Sin descripción.",
                    category: userData.category || "Otro",
                    owner: userData.owner || "Desconocido",
                    date: new Date().toISOString()
                });
                urlsAñadidas++;
                console.log(`✅ [${file}] URL registrada: ${userData.url}`);
            }

            // Borrar el archivo del usuario después de procesarlo
            fs.unlinkSync(filePath);
            console.log(`🗑️ Archivo ${file} eliminado.`);
        }
    });

    // 5. Guardar la base de datos actualizada
    if (urlsAñadidas > 0) {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
        console.log(`\n🎉 ¡Éxito! Se añadieron ${urlsAñadidas} URLs nuevas.`);
    } else {
        console.log("\n⚠️ No se añadieron URLs nuevas.");
    }
}

main();
