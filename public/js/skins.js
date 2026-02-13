// skins.js — Sistema de skins "Universal" (Soporta todos tus nuevos temas)
// FEATURES: Inyección de color dinámica + Tema Masterpiece especial
// VERSIÓN AMPLIADA: +6 nuevos skins elegantes

(function() {
    'use strict';

    // ===== CONFIGURACIÓN DE TEMAS =====
    const SKINS = [
        // ULTRA MINIMAL TECH
        { id: 'titanium', name: 'Titanium', nameEs: 'Titanio', icon: 'cube', colors: ['#8E8E93', '#C7C7CC', '#48484A'], animation: 'shimmer' },
        { id: 'silver', name: 'Silver', nameEs: 'Plata', icon: 'square', colors: ['#E5E5EA', '#F2F2F7', '#AEAEB2'], animation: 'pulse-soft' },
        { id: 'graphite', name: 'Graphite', nameEs: 'Grafito', icon: 'diamond', colors: ['#1C1C1E', '#2C2C2E', '#48484A'], animation: 'float-slow' },
        { id: 'pearl', name: 'Pearl', nameEs: 'Perla', icon: 'circle', colors: ['#F9F9F9', '#E8E8ED', '#D1D1D6'], animation: 'glow-breathe' },

        // COSMIC FUTURE
        { id: 'nebula', name: 'Nebula', nameEs: 'Nebulosa', icon: 'star', colors: ['#5E17EB', '#BF40BF', '#8B00FF'], animation: 'glow-breathe' },
        { id: 'void', name: 'Void', nameEs: 'Vacío', icon: 'moon', colors: ['#0A0E27', '#1A1F3A', '#2D3561'], animation: 'pulse-soft' },
        { id: 'aurora', name: 'Aurora', nameEs: 'Aurora', icon: 'sparkles', colors: ['#00FFC6', '#00B8D4', '#7B2FF7'], animation: 'shimmer' },
        { id: 'cosmos', name: 'Cosmos', nameEs: 'Cosmos', icon: 'moon', colors: ['#1E0342', '#4B0082', '#9400D3'], animation: 'float-slow' },

        // GAMING ELITE
        { id: 'carbon', name: 'Carbon', nameEs: 'Carbono', icon: 'shield', colors: ['#0D0D0D', '#1A1A1A', '#FF0054'], animation: 'spin-linear-slow' },
        { id: 'blackops', name: 'Black Ops', nameEs: 'Operaciones Negras', icon: 'crosshairs', colors: ['#000000', '#1C1C1C', '#00FF41'], animation: 'pulse-soft' },
        { id: 'striker', name: 'Striker', nameEs: 'Atacante', icon: 'bolt', colors: ['#FF4500', '#FF6347', '#DC143C'], animation: 'bounce-subtle' },
        { id: 'phantom', name: 'Phantom', nameEs: 'Fantasma', icon: 'ghost', colors: ['#2F4F4F', '#708090', '#00CED1'], animation: 'float-slow' },

        // LUXURY FUTURISM
        { id: 'masterpiece', name: 'Masterpiece', nameEs: 'Obra Maestra', icon: 'crown', colors: ['#C0C0C0', '#E8E8E8', '#4DFFF3'], animation: 'shimmer-morph' },
        { id: 'sapphire', name: 'Sapphire', nameEs: 'Zafiro', icon: 'gem', colors: ['#0F52BA', '#4169E1', '#1E90FF'], animation: 'glow-breathe' },
        { id: 'marble', name: 'Marble', nameEs: 'Mármol', icon: 'mountain', colors: ['#F5F5F5', '#D3D3D3', '#B8860B'], animation: 'float-slow' },
        { id: 'platinum', name: 'Platinum', nameEs: 'Platino', icon: 'star', colors: ['#E5E4E2', '#D4D4D4', '#C9C0BB'], animation: 'pulse-soft' },

        // HYPER MODERN ENERGY
        { id: 'neural', name: 'Neural Frost', nameEs: 'Escarcha Neural', icon: 'brain', colors: ['#00D4FF', '#0099FF', '#A020F0'], animation: 'shimmer' },
        { id: 'velocity', name: 'Velocity', nameEs: 'Velocidad', icon: 'rocket', colors: ['#FF006E', '#FB5607', '#FFBE0B'], animation: 'bounce-subtle' },
        { id: 'prism', name: 'Prism', nameEs: 'Prisma', icon: 'wand-magic-sparkles', colors: ['#FF0080', '#7928CA', '#00DFD8'], animation: 'glow-breathe' },
        { id: 'quantum', name: 'Quantum', nameEs: 'Cuántico', icon: 'atom', colors: ['#6366F1', '#8B5CF6', '#EC4899'], animation: 'spin-linear-slow' },
        { id: 'photon', name: 'Photon', nameEs: 'Fotón', icon: 'lightbulb', colors: ['#FBBF24', '#F59E0B', '#EF4444'], animation: 'pulse-soft' }
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