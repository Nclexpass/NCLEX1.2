// skins.js — Sistema de skins para NCLEX Masterclass (VERSIÓN FINAL)
(function() {
    'use strict';

    // ===== CONFIGURACIÓN DE SKINS =====
    const SKINS = [
        { 
            id: 'default', 
            name: 'Default', 
            nameEs: 'Predeterminado', 
            icon: 'palette',
            colors: ['#007AFF', '#5856D6', '#FF2D55']
        },
        { 
            id: 'ocean', 
            name: 'Ocean', 
            nameEs: 'Océano', 
            icon: 'water',
            colors: ['#0A84FF', '#64D2FF', '#00C7BE']
        },
        { 
            id: 'forest', 
            name: 'Forest', 
            nameEs: 'Bosque', 
            icon: 'tree',
            colors: ['#2C6E49', '#4C9A70', '#FFC857']
        },
        { 
            id: 'lavender', 
            name: 'Lavender', 
            nameEs: 'Lavanda', 
            icon: 'flower',
            colors: ['#9B87F8', '#B8A9FF', '#FF9F1C']
        },
        { 
            id: 'midnight', 
            name: 'Midnight', 
            nameEs: 'Medianoche', 
            icon: 'moon',
            colors: ['#FFB347', '#FF9F1C', '#00A8E8']
        }
    ];

    const STORAGE_KEY = 'nclex_skin';
    let currentSkin = localStorage.getItem(STORAGE_KEY) || 'default';
    let isInitialized = false;

    // ===== APLICAR SKIN =====
    function applySkin(skinId) {
        // Validar que la skin exista
        if (!SKINS.find(s => s.id === skinId)) {
            skinId = 'default';
        }

        // Remover todas las skins previas
        SKINS.forEach(skin => {
            document.documentElement.classList.remove(`skin-${skin.id}`);
        });

        // Agregar la nueva skin
        document.documentElement.classList.add(`skin-${skinId}`);
        currentSkin = skinId;
        localStorage.setItem(STORAGE_KEY, skinId);

        // Disparar evento para otros componentes (opcional)
        window.dispatchEvent(new CustomEvent('skinchange', { detail: { skin: skinId } }));
        
        console.log(`🎨 Skin aplicada: ${skinId}`);
    }

    // ===== OBTENER IDIOMA ACTUAL =====
    function getLang() {
        try {
            return localStorage.getItem('nclex_lang') || 'es';
        } catch {
            return 'es';
        }
    }

    // ===== RENDERIZAR SELECTOR DE SKINS =====
    function renderSkinSelector() {
        const isEs = getLang() === 'es';
        
        return `
            <div class="p-6 max-w-5xl mx-auto animate-fade-in">
                <div class="rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-card">
                    
                    <!-- Cabecera -->
                    <div class="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/10 dark:to-pink-500/10 border-b border-slate-200 dark:border-white/10">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-300">
                                <i class="fa-solid fa-palette text-2xl"></i>
                            </div>
                            <div>
                                <h1 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                                    ${isEs ? 'Personalizar apariencia' : 'Customize appearance'}
                                </h1>
                                <p class="text-slate-600 dark:text-slate-300 mt-1">
                                    ${isEs ? 'Elige el estilo visual de tu aplicación' : 'Choose the visual style of your application'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Grid de skins -->
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${SKINS.map(skin => {
                            const isActive = currentSkin === skin.id;
                            const activeClasses = isActive 
                                ? 'border-brand-blue bg-brand-blue/5 dark:bg-brand-blue/10 ring-2 ring-brand-blue/50' 
                                : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20';
                            
                            return `
                                <button 
                                    onclick="window.SkinSystem.setSkin('${skin.id}')" 
                                    class="relative p-5 rounded-2xl border-2 transition-all text-left ${activeClasses} group"
                                >
                                    <div class="flex items-start gap-4">
                                        <!-- Previsualización de colores -->
                                        <div class="flex -space-x-2">
                                            ${skin.colors.map(color => `
                                                <div class="w-8 h-8 rounded-full border-2 border-white dark:border-brand-card shadow-md" 
                                                     style="background-color: ${color}"></div>
                                            `).join('')}
                                        </div>
                                        
                                        <!-- Nombre de la skin -->
                                        <div class="flex-1">
                                            <div class="font-bold text-lg text-slate-900 dark:text-white">
                                                ${isEs ? skin.nameEs : skin.name}
                                            </div>
                                            <div class="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                                <i class="fa-solid fa-${skin.icon}"></i>
                                                <span>${skin.colors.length} colores</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Check de activo -->
                                        ${isActive ? `
                                            <div class="absolute top-3 right-3 w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center shadow-lg">
                                                <i class="fa-solid fa-check text-white text-xs"></i>
                                            </div>
                                        ` : ''}
                                    </div>
                                    
                                    <!-- Efecto hover -->
                                    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent to-white/5 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                </button>
                            `;
                        }).join('')}
                    </div>
                    
                    <!-- Footer informativo -->
                    <div class="p-6 pt-0 border-t border-slate-200 dark:border-white/10 mt-2">
                        <div class="flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <i class="fa-solid fa-circle-info mt-0.5"></i>
                            <span>
                                ${isEs 
                                    ? 'Las skins cambian los colores principales de la interfaz. Compatible con modo oscuro/claro.' 
                                    : 'Skins change the main colors of the interface. Compatible with dark/light mode.'}
                            </span>
                        </div>
                        <div class="mt-4 flex gap-2">
                            <button onclick="window.nclexApp.navigate('home')" 
                                class="px-5 py-2.5 rounded-2xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-black hover:opacity-90 transition flex items-center gap-2">
                                <i class="fa-solid fa-arrow-left"></i>
                                ${isEs ? 'Volver al inicio' : 'Back to home'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== API PÚBLICA =====
    window.SkinSystem = {
        SKINS,
        currentSkin: () => currentSkin,
        setSkin: applySkin,
        renderSkinSelector
    };

    // ===== INICIALIZACIÓN (UNA SOLA VEZ) =====
    function init() {
        if (isInitialized) return;
        isInitialized = true;
        
        // Aplicar skin guardada al cargar la página
        applySkin(currentSkin);
        
        console.log('🎨 SkinSystem cargado. Skin actual:', currentSkin);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();