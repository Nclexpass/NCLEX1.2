// skins.js — Sistema de skins "Universal" (Soporta todos tus nuevos temas)
// FEATURES: Inyección de color dinámica + Tema Masterpiece especial

(function() {
    'use strict';

    // ===== CONFIGURACIÓN DE TEMAS =====
    const SKINS = [
        // CLÁSICOS
        { id: 'default', name: 'Default', nameEs: 'Predeterminado', icon: 'palette', colors: ['#007AFF', '#5856D6', '#FF2D55'] },
        { id: 'ocean', name: 'Ocean', nameEs: 'Océano', icon: 'water', colors: ['#0A84FF', '#64D2FF', '#00C7BE'] },
        { id: 'forest', name: 'Forest', nameEs: 'Bosque', icon: 'tree', colors: ['#2C6E49', '#4C9A70', '#FFC857'] },
        { id: 'lavender', name: 'Lavender', nameEs: 'Lavanda', icon: 'flower', colors: ['#9B87F8', '#B8A9FF', '#FF9F1C'] },
        { id: 'midnight', name: 'Midnight', nameEs: 'Medianoche', icon: 'moon', colors: ['#FFB347', '#FF9F1C', '#00A8E8'] },
        
        // ✨ TEMA ESPECIAL
        { id: 'masterpiece', name: 'Masterpiece', nameEs: 'Obra Maestra', icon: 'crown', colors: ['#D4AF37', '#14181F', '#F0F3FA'] },

        // 🎨 TUS NUEVOS TEMAS (¡Excelentes elecciones!)
        { id: 'sunset', name: 'Sunset', nameEs: 'Atardecer', icon: 'sun', colors: ['#FF6B6B', '#FFD93D', '#6BCF9F'] },
        { id: 'rose', name: 'Rose', nameEs: 'Rosa', icon: 'heart', colors: ['#FF69B4', '#FFB7C5', '#D4A5A5'] },
        { id: 'mint', name: 'Mint', nameEs: 'Menta', icon: 'leaf', colors: ['#3EB489', '#98FB98', '#2F6B4F'] },
        { id: 'charcoal', name: 'Charcoal', nameEs: 'Carbón', icon: 'gem', colors: ['#36454F', '#7F8C8D', '#2C3E50'] },
        { id: 'autumn', name: 'Autumn', nameEs: 'Otoño', icon: 'wind', colors: ['#E07A5F', '#F2C94C', '#B85C38'] },
        { id: 'neon', name: 'Neon', nameEs: 'Neón', icon: 'bolt', colors: ['#FF00FF', '#00FFFF', '#FFFF00'] }
    ];

    const STORAGE_KEY = 'nclex_skin';
    let currentSkin = 'default';
    let isInitialized = false;
    let isApplyingSkin = false;

    // ===== ESTILOS ESPECIALES (MASTERPIECE) =====
    const MASTERPIECE_CSS = `
        :root {
            --brand-bg: #0a0c12 !important;
            --brand-card: #14181f !important;
            --brand-border: rgba(212, 175, 55, 0.25) !important;
            --brand-sidebar: #0f1218 !important;
            --brand-sidebar-border: rgba(212, 175, 55, 0.15) !important;
            --brand-text: #f0f3fa !important;
            --brand-text-muted: #a0a8b8 !important;
            --brand-blue-rgb: 212, 175, 55 !important;
        }
        body.skin-masterpiece { background-color: #0a0c12 !important; color: #f0f3fa !important; }
        .skin-masterpiece h1, .skin-masterpiece h2, .skin-masterpiece .font-black { font-family: 'Cormorant Garamond', serif !important; letter-spacing: 0.5px; }
        .skin-masterpiece p, .skin-masterpiece button { font-family: 'Inter', sans-serif; }
        .skin-masterpiece .bg-blue-600 { background-color: rgba(212, 175, 55, 0.8) !important; color: #000 !important; }
        .skin-masterpiece .text-blue-600 { color: #d4af37 !important; }
        .skin-masterpiece input:focus { border-color: #d4af37 !important; box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2) !important; }
    `;

    // ===== UTILIDADES =====
    function getCurrentTheme() { return document.documentElement.classList.contains('dark') ? 'dark' : 'light'; }
    function getLang() { try { return localStorage.getItem('nclex_lang') || 'es'; } catch { return 'es'; } }

    // Función auxiliar: Convierte Hex (#FF0000) a RGB (255, 0, 0)
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '0, 122, 255'; // Fallback azul
    }

    function notifySkinChange(skinId) {
        window.dispatchEvent(new CustomEvent('skinchange', { 
            detail: { skin: skinId, theme: getCurrentTheme(), timestamp: Date.now() } 
        }));
        if (window.nclexApp && typeof window.nclexApp.refreshUI === 'function') window.nclexApp.refreshUI();
    }

    // ===== LÓGICA DE APLICACIÓN =====
    function applySkin(skinId, save = true) {
        if (isApplyingSkin) return;
        isApplyingSkin = true;

        const skin = SKINS.find(s => s.id === skinId) || SKINS[0];
        skinId = skin.id;

        // 1. Limpiar clases previas
        SKINS.forEach(s => document.documentElement.classList.remove(`skin-${s.id}`));
        document.documentElement.classList.add(`skin-${skinId}`);
        currentSkin = skinId;

        // 2. Manejo de Masterpiece (CSS Inyectado)
        const styleId = 'nclex-masterpiece-style';
        const existingStyle = document.getElementById(styleId);
        
        if (skinId === 'masterpiece') {
            document.documentElement.classList.add('dark'); // Forzar oscuro
            if (!existingStyle) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = MASTERPIECE_CSS;
                document.head.appendChild(style);
            }
        } else {
            if (existingStyle) existingStyle.remove();
            
            // 3. INYECCIÓN AUTOMÁTICA DE COLORES PARA LOS NUEVOS SKINS
            // Toma el primer color de tu lista y lo aplica como el color principal
            const primaryColorHex = skin.colors[0];
            const primaryColorRgb = hexToRgb(primaryColorHex);
            
            // Sobrescribimos la variable CSS globalmente
            document.documentElement.style.setProperty('--brand-blue-rgb', primaryColorRgb);
        }
        
        if (save) try { localStorage.setItem(STORAGE_KEY, skinId); } catch (e) {}

        setTimeout(() => { isApplyingSkin = false; notifySkinChange(skinId); }, 50);
    }

    // ===== RENDERIZAR SELECTOR =====
    function renderSkinSelector() {
        const isEs = getLang() === 'es';
        
        return `
            <div class="p-6 max-w-6xl mx-auto animate-fade-in">
                <div class="rounded-3xl overflow-hidden shadow-xl border border-[var(--brand-border)] bg-[var(--brand-card)]">
                    
                    <div class="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-[var(--brand-border)]">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-[rgb(var(--brand-blue-rgb))]">
                                <i class="fa-solid fa-palette text-2xl"></i>
                            </div>
                            <div>
                                <h1 class="text-2xl md:text-3xl font-black text-[var(--brand-text)]">
                                    ${isEs ? 'Apariencia' : 'Appearance'}
                                </h1>
                                <p class="text-[var(--brand-text-muted)] mt-1">
                                    ${isEs ? 'Selecciona tu estilo favorito' : 'Select your favorite style'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        ${SKINS.map(skin => {
                            const isActive = currentSkin === skin.id;
                            const isMasterpiece = skin.id === 'masterpiece';
                            
                            let btnClass = isActive 
                                ? 'border-[rgb(var(--brand-blue-rgb))] bg-[rgba(var(--brand-blue-rgb),0.08)] ring-2 ring-[rgba(var(--brand-blue-rgb),0.3)]' 
                                : 'border-[var(--brand-border)] hover:border-[var(--brand-text-muted)]';
                            
                            if (isMasterpiece) btnClass += ' bg-gradient-to-br from-gray-900 to-black text-yellow-500 border-yellow-600/50';

                            return `
                                <button onclick="window.SkinSystem.setSkin('${skin.id}')" 
                                    class="relative p-4 rounded-2xl border-2 transition-all text-left ${btnClass} group">
                                    
                                    <div class="flex items-center gap-3">
                                        <div class="flex -space-x-2">
                                            ${skin.colors.map(color => `
                                                <div class="w-6 h-6 rounded-full border border-white/20 shadow-sm" style="background-color: ${color}"></div>
                                            `).join('')}
                                        </div>
                                        
                                        <div class="flex-1 min-w-0">
                                            <div class="font-bold text-base truncate ${isMasterpiece ? 'text-[#d4af37]' : 'text-[var(--brand-text)]'}">
                                                ${isEs ? skin.nameEs : skin.name}
                                            </div>
                                        </div>
                                        
                                        ${isActive ? `<i class="fa-solid fa-circle-check text-[rgb(var(--brand-blue-rgb))]"></i>` : ''}
                                    </div>
                                </button>
                            `;
                        }).join('')}
                    </div>

                    <div class="p-6 border-t border-[var(--brand-border)] flex justify-between items-center">
                        <span class="text-xs text-[var(--brand-text-muted)]">SkinSystem v4.2</span>
                        <button onclick="window.nclexApp.navigate('home')" class="px-4 py-2 rounded-xl bg-[var(--brand-bg)] border border-[var(--brand-border)] text-sm font-bold hover:opacity-80">
                            ${isEs ? 'Volver' : 'Back'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== INICIALIZACIÓN =====
    function init() {
        if (isInitialized) return;
        isInitialized = true;
        
        try { const savedSkin = localStorage.getItem(STORAGE_KEY); if (savedSkin) currentSkin = savedSkin; } catch (e) {}
        
        applySkin(currentSkin, false);
        console.log('🎨 SkinSystem v4.2 Loaded');
    }

    window.SkinSystem = {
        SKINS,
        currentSkin: () => currentSkin,
        setSkin: (id) => {
            applySkin(id, true);
            const view = document.getElementById('app-view');
            if (view && view.innerHTML.includes('Apariencia')) view.innerHTML = renderSkinSelector();
        },
        renderSkinSelector,
        getCurrentSkinInfo: () => SKINS.find(s => s.id === currentSkin) || SKINS[0]
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();