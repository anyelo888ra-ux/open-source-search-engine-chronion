// ==========================================
// BAN-BOT-18 - Sistema de Moderación Global
// ==========================================
(function() {
    // 1. Configuración
    const PALABRAS_PROHIBIDAS = [
        "porno", "xxx", "sexo", "desnudo", "hentai", "onlyfans", 
        "putas", "tetas", "culos", "vagina", "pene", "erotico",
        "18+", "adulto", "contenido adulto"
    ];
    
    const BAN_TIME = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
    const STORAGE_KEY = "chronion_ban_status";

    // 2. Verificar si el usuario ya está baneado al cargar la página
    function checkBanStatus() {
        const banData = localStorage.getItem(STORAGE_KEY);
        if (banData) {
            const ban = JSON.parse(banData);
            const now = Date.now();
            
            if (now < ban.expira) {
                // Todavía está baneado
                showBanScreen(ban.motivo, ban.expira);
                return true;
            } else {
                // El baneo expiró
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        return false;
    }

    // 3. Función para banear
    async function banearUsuario(palabraDetectada) {
        // Obtener IP simulada (o real si usas ipify)
        let ip = "190.0.0.1"; // IP por defecto (Venezuela)
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            ip = data.ip;
        } catch(e) {}

        const banData = {
            ip: ip,
            motivo: `Búsqueda de contenido +18 detectada: "${palabraDetectada}"`,
            expira: Date.now() + BAN_TIME,
            fecha: new Date().toLocaleString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(banData));
        showBanScreen(banData.motivo, banData.expira);
    }

    // 4. Pantalla de Baneo (Inyecta un overlay en el DOM)
    function showBanScreen(motivo, expiraTimestamp) {
        // Si ya hay una pantalla de baneo, no hacer nada
        if (document.getElementById('ban-overlay')) return;

        // Calcular tiempo restante
        const now = Date.now();
        const restante = expiraTimestamp - now;
        const horas = Math.floor(restante / (1000 * 60 * 60));
        const minutos = Math.floor((restante % (1000 * 60 * 60)) / (1000 * 60));

        // Crear el overlay
        const overlay = document.createElement('div');
        overlay.id = 'ban-overlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; background: #0d0e10; z-index: 999999;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            font-family: 'Segoe UI', sans-serif; color: #e3e3e3; text-align: center; padding: 20px;
        `;

        overlay.innerHTML = `
            <div style="background: #1e1f20; border: 2px solid #ea4335; border-radius: 16px; padding: 40px; max-width: 500px; box-shadow: 0 10px 50px rgba(234,67,53,0.3);">
                <div style="font-size: 60px; margin-bottom: 20px;">🚫</div>
                <h1 style="color: #ea4335; font-size: 28px; margin-bottom: 10px;">ACCESO DENEGADO</h1>
                <p style="color: #9aa0a6; font-size: 14px; margin-bottom: 20px;">
                    El <b>Ban-Bot-18</b> ha detectado una violación de las normas de la comunidad.
                </p>
                <div style="background: rgba(234,67,53,0.1); border: 1px solid rgba(234,67,53,0.3); padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: left; font-size: 13px;">
                    <p><b>Motivo:</b> ${motivo}</p>
                    <p><b>IP Registrada:</b> ${JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').ip || 'Desconocida'}</p>
                    <p><b>Expiración:</b> en ${horas}h ${minutos}m</p>
                </div>
                <p style="font-size: 12px; color: #64748b;">Si crees que es un error, contacta al administrador del NEXUS HQ.</p>
            </div>
        `;

        document.body.appendChild(overlay);
        
        // Deshabilitar scroll
        document.body.style.overflow = 'hidden';
    }

    // 5. Escanear inputs en busca de palabras prohibidas
    function escanearInputs() {
        const inputs = document.querySelectorAll('input[type="text"], textarea');
        
        inputs.forEach(input => {
            // Evitar duplicar el listener
            if (input.dataset.banListener) return;
            input.dataset.banListener = "true";

            input.addEventListener('input', (e) => {
                const texto = e.target.value.toLowerCase();
                
                for (let palabra of PALABRAS_PROHIBIDAS) {
                    if (texto.includes(palabra)) {
                        banearUsuario(palabra);
                        break;
                    }
                }
            });
        });
    }

    // 6. Inicializar
    window.addEventListener('DOMContentLoaded', () => {
        // Si ya está baneado, bloquear todo
        if (checkBanStatus()) return;

        // Escanear inputs existentes
        escanearInputs();

        // Observar si se añaden nuevos inputs dinámicamente (ej. en el chat)
        const observer = new MutationObserver(() => {
            escanearInputs();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

})();
