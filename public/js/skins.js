// skins.js — Sistema de skins "Universal" (Soporta todos tus nuevos temas)
// FEATURES: Inyección de color dinámica + Tema Masterpiece especial
// VERSIÓN AMPLIADA: +6 nuevos skins elegantes

(function() {
    'use strict';

    // ===== CONFIGURACIÓN DE TEMAS =====
    const SKINS = [
        // MASTERPIECE
        { id: 'masterpiece', name: 'Vision Pro', nameEs: 'Vision Pro', icon: 'sparkles', colors: ['#A1A9B0', '#E9ECF5', '#C7B9FF'], animation: 'shimmer' },

        // ULTRA MINIMAL TECH
        { id: 'silver', name: 'Silver', nameEs: 'Plata', icon: 'microchip', colors: ['#E3E4E5', '#C0C2C4', '#A1A4A7'], animation: 'pulse-soft' },
        { id: 'space-gray', name: 'Space Gray', nameEs: 'Gris Espacial', icon: 'laptop', colors: ['#4A4E51', '#2E3134', '#1C1E20'], animation: 'float-slow' },
        { id: 'titanium', name: 'Titanium', nameEs: 'Titanio', icon: 'bolt', colors: ['#7F8C8D', '#5A6570', '#3A404B'], animation: 'spin-linear-slow' },
        { id: 'graphite', name: 'Graphite', nameEs: 'Grafito', icon: 'cube', colors: ['#6B7280', '#4B5563', '#1F2937'], animation: 'pulse-soft' },

        // COSMIC FUTURE
        { id: 'nebula', name: 'Nebula', nameEs: 'Nebulosa', icon: 'cloud', colors: ['#8B5CF6', '#EC4899', '#0E0B1F'], animation: 'glow-breathe' },
        { id: 'deep-space', name: 'Deep Space', nameEs: 'Espacio Profundo', icon: 'meteor', colors: ['#0B1026', '#1A237E', '#311B92'], animation: 'glow-breathe' },
        { id: 'cosmic-dust', name: 'Cosmic Dust', nameEs: 'Polvo Cósmico', icon: 'sparkles', colors: ['#3A1C5A', '#7D3C98', '#C39BD3'], animation: 'glow-breathe' },
        { id: 'stellar', name: 'Stellar', nameEs: 'Estelar', icon: 'star', colors: ['#FDB813', '#F9791E', '#0B0C1E'], animation: 'glow-breathe' },

        // GAMING ELITE
        { id: 'carbon-fiber', name: 'Carbon Fiber', nameEs: 'Fibra de Carbono', icon: 'grid', colors: ['#2B2B2B', '#3F3F3F', '#1E1E1E'], animation: 'bounce-subtle' },
        { id: 'obsidian', name: 'Obsidian', nameEs: 'Obsidiana', icon: 'gem', colors: ['#0F0F0F', '#2A2A2A', '#4A4A4A'], animation: 'pulse-soft' },
        { id: 'neon-racer', name: 'Neon Racer', nameEs: 'Neón Carrera', icon: 'flag-checkered', colors: ['#00FFAA', '#FF00CC', '#0B0B0B'], animation: 'spin-linear-slow' },
        { id: 'cyber', name: 'Cyber', nameEs: 'Ciber', icon: 'robot', colors: ['#00FFFF', '#FF00FF', '#101010'], animation: 'bounce-subtle' },

        // LUXURY FUTURISM
        { id: 'gold-leaf', name: 'Gold Leaf', nameEs: 'Pan de Oro', icon: 'crown', colors: ['#D4AF37', '#F1C40F', '#7D5A1E'], animation: 'float-slow' },
        { id: 'digital-marble', name: 'Digital Marble', nameEs: 'Mármol Digital', icon: 'square', colors: ['#F5F5F5', '#E0E0E0', '#C0C0C0'], animation: 'spin-linear-slow' },
        { id: 'sapphire', name: 'Sapphire', nameEs: 'Zafiro', icon: 'diamond', colors: ['#0F52BA', '#1E3F66', '#082032'], animation: 'glow-breathe' },
        { id: 'rose-gold', name: 'Rose Gold', nameEs: 'Oro Rosa', icon: 'heart', colors: ['#B76E79', '#F7CAC9', '#D4A5A5'], animation: 'float-slow' },

        // HYPER MODERN ENERGY
        { id: 'sunset-gradient', name: 'Sunset Gradient', nameEs: 'Gradiente Atardecer', icon: 'sun', colors: ['#FF6B6B', '#FFD93D', '#6BCF9F'], animation: 'shimmer' },
        { id: 'ocean-breeze', name: 'Ocean Breeze', nameEs: 'Brisa Marina', icon: 'water', colors: ['#00C6FB', '#005BEA', '#0077B6'], animation: 'float-slow' },
        { id: 'lime-fizz', name: 'Lime Fizz', nameEs: 'Lima Espumosa', icon: 'leaf', colors: ['#A8E6CF', '#56AB2F', '#3B8B2E'], animation: 'pulse-soft' },
        { id: 'electric', name: 'Electric', nameEs: 'Eléctrico', icon: 'bolt', colors: ['#00F5FF', '#FF00FF', '#7A04EB'], animation: 'shimmer' }
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

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '0, 122, 255';
    }

    function notifySkinChange(skinId) {
        window.dispatchEvent(new CustomEvent('skinchange', { 
            detail: { skin: skinId, theme: getCurrentTheme(), timestamp: Date.now() } 
        }));
        // Eliminamos la llamada a refreshUI para evitar doble render
    }

    function applySkin(skinId, save = true) {
        if (isApplyingSkin) return;
        isApplyingSkin = true;

        const skin = SKINS.find(s => s.id === skinId) || SKINS[0];
        skinId = skin.id;

        SKINS.forEach(s => document.documentElement.classList.remove(`skin-${s.id}`));
        document.documentElement.classList.add(`skin-${skinId}`);
        currentSkin = skinId;

        const styleId = 'nclex-masterpiece-style';
        const existingStyle = document.getElementById(styleId);
        
        if (skinId === 'masterpiece') {
            document.documentElement.classList.add('dark');
            if (!existingStyle) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = MASTERPIECE_CSS;
                document.head.appendChild(style);
            }
        } else {
            if (existingStyle) existingStyle.remove();
            const primaryColorHex = skin.colors[0];
            const primaryColorRgb = hexToRgb(primaryColorHex);
            document.documentElement.style.setProperty('--brand-blue-rgb', primaryColorRgb);
        }
        
        if (save) try { localStorage.setItem(STORAGE_KEY, skinId); } catch (e) {}

        setTimeout(() => { isApplyingSkin = false; notifySkinChange(skinId); }, 50);
    }

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
                        <span class="text-xs text-[var(--brand-text-muted)]">SkinSystem v4.3</span>
                        <button onclick="window.nclexApp.navigate('home')" class="px-4 py-2 rounded-xl bg-[var(--brand-bg)] border border-[var(--brand-border)] text-sm font-bold hover:opacity-80">
                            ${isEs ? 'Volver' : 'Back'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function init() {
        if (isInitialized) return;
        isInitialized = true;
        
        try { const savedSkin = localStorage.getItem(STORAGE_KEY); if (savedSkin) currentSkin = savedSkin; } catch (e) {}
        
        applySkin(currentSkin, false);
        console.log('🎨 SkinSystem v4.3 Loaded');
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