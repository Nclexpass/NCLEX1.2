// skins.js — Sistema de skins para NCLEX Masterclass (VERSIÓN CORREGIDA 3.1)
// FIXED: Prevenir bucle infinito en observer de tema

(function() {
    'use strict';

    // ===== CONFIGURACIÓN =====
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
    const STORAGE_THEME_KEY = 'nclex_theme';
    
    // Estado interno
    let currentSkin = 'default';
    let isInitialized = false;
    let themeObserver = null;
    let isApplyingSkin = false;  // ✅ FIXED: Flag para prevenir bucle

    // ===== UTILIDADES =====
    
    function getCurrentTheme() {
        try {
            return localStorage.getItem(STORAGE_THEME_KEY) || 'dark';
        } catch {
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }
    }

    function getLang() {
        try {
            return localStorage.getItem('nclex_lang') || 'es';
        } catch {
            return 'es';
        }
    }

    function notifySkinChange(skinId) {
        window.dispatchEvent(new CustomEvent('skinchange', { 
            detail: { 
                skin: skinId,
                theme: getCurrentTheme(),
                timestamp: Date.now()
            } 
        }));

        if (window.nclexApp && typeof window.nclexApp.refreshUI === 'function') {
            window.nclexApp.refreshUI();
        }

        console.log(`🎨 Skin aplicada: ${skinId} | Tema: ${getCurrentTheme()}`);
    }

    // ===== APLICAR SKIN =====
    
    function applySkin(skinId, save = true) {
        // ✅ FIXED: Prevenir reentrada
        if (isApplyingSkin) return;
        isApplyingSkin = true;

        // Pausar observer temporalmente
        if (themeObserver) {
            themeObserver.disconnect();
        }

        const skin = SKINS.find(s => s.id === skinId);
        if (!skin) {
            console.warn(`Skin "${skinId}" no encontrada, usando default`);
            skinId = 'default';
        }

        // Remover todas las skins previas
        SKINS.forEach(s => {
            document.documentElement.classList.remove(`skin-${s.id}`);
        });

        // Agregar la nueva skin
        if (skinId !== 'default') {
            document.documentElement.classList.add(`skin-${skinId}`);
        }

        currentSkin = skinId;
        
        if (save) {
            try {
                localStorage.setItem(STORAGE_KEY, skinId);
            } catch (e) {
                console.warn('No se pudo guardar skin en localStorage');
            }
        }

        updateSidebarElements();
        
        // Reconectar observer después de un delay
        setTimeout(() => {
            initThemeObserver();
            isApplyingSkin = false;  // Liberar flag
            notifySkinChange(skinId);
        }, 100);
    }

    function updateSidebarElements() {
        const sidebar = document.getElementById('main-sidebar');
        if (!sidebar) return;

        sidebar.style.display = 'none';
        sidebar.offsetHeight;
        sidebar.style.display = '';

        const activeBtn = sidebar.querySelector('.nav-btn.active');
        if (activeBtn) {
            activeBtn.classList.remove('active');
            setTimeout(() => activeBtn.classList.add('active'), 0);
        }
    }

    // ===== OBSERVADOR DE TEMA =====
    
    function initThemeObserver() {
        if (!window.MutationObserver || themeObserver) return;

        themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    // Solo reaccionar si no estamos aplicando skin nosotros mismos
                    if (!isApplyingSkin) {
                        const hasDark = document.documentElement.classList.contains('dark');
                        const storedTheme = getCurrentTheme();
                        
                        if ((hasDark && storedTheme !== 'dark') || 
                            (!hasDark && storedTheme !== 'light')) {
                            applySkin(currentSkin, false);
                        }
                    }
                }
            });
        });

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // ===== RENDERIZAR SELECTOR =====
    
    function renderSkinSelector() {
        const isEs = getLang() === 'es';
        
        return `
            <div class="p-6 max-w-5xl mx-auto animate-fade-in">
                <div class="rounded-3xl overflow-hidden shadow-xl border border-[var(--brand-border)] bg-[var(--brand-card)]">
                    
                    <!-- Cabecera -->
                    <div class="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/10 dark:to-pink-500/10 border-b border-[var(--brand-border)]">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center" style="color: rgb(var(--brand-blue-rgb));">
                                <i class="fa-solid fa-palette text-2xl"></i>
                            </div>
                            <div>
                                <h1 class="text-2xl md:text-3xl font-black text-[var(--brand-text)]">
                                    ${isEs ? 'Personalizar apariencia' : 'Customize appearance'}
                                </h1>
                                <p class="text-[var(--brand-text-muted)] mt-1">
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
                                ? 'border-[rgb(var(--brand-blue-rgb))] bg-[rgba(var(--brand-blue-rgb),0.08)] ring-2 ring-[rgba(var(--brand-blue-rgb),0.3)]' 
                                : 'border-[var(--brand-border)] hover:border-[var(--brand-text-muted)]';
                            
                            return `
                                <button 
                                    onclick="window.SkinSystem.setSkin('${skin.id}')" 
                                    class="relative p-5 rounded-2xl border-2 transition-all text-left ${activeClasses} group"
                                    aria-pressed="${isActive}"
                                >
                                    <div class="flex items-start gap-4">
                                        <div class="flex -space-x-2">
                                            ${skin.colors.map(color => `
                                                <div class="w-8 h-8 rounded-full border-2 border-[var(--brand-card)] shadow-md" 
                                                     style="background-color: ${color}"></div>
                                            `).join('')}
                                        </div>
                                        
                                        <div class="flex-1">
                                            <div class="font-bold text-lg text-[var(--brand-text)]">
                                                ${isEs ? skin.nameEs : skin.name}
                                            </div>
                                            <div class="text-xs text-[var(--brand-text-muted)] mt-1 flex items-center gap-1">
                                                <i class="fa-solid fa-${skin.icon}"></i>
                                                <span>${skin.colors.length} colores</span>
                                            </div>
                                        </div>
                                        
                                        ${isActive ? `
                                            <div class="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center shadow-lg text-white text-xs"
                                                 style="background-color: rgb(var(--brand-blue-rgb));">
                                                <i class="fa-solid fa-check"></i>
                                            </div>
                                        ` : ''}
                                    </div>
                                    
                                    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent to-white/5 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                </button>
                            `;
                        }).join('')}
                    </div>
                    
                    <div class="p-6 pt-0 border-t border-[var(--brand-border)] mt-2">
                        <div class="flex items-start gap-3 text-xs text-[var(--brand-text-muted)]">
                            <i class="fa-solid fa-circle-info mt-0.5"></i>
                            <span>
                                ${isEs 
                                    ? 'Las skins cambian los colores principales de la interfaz. Compatible con modo oscuro/claro.' 
                                    : 'Skins change the main colors of the interface. Compatible with dark/light mode.'}
                            </span>
                        </div>
                        <div class="mt-4 flex gap-2">
                            <button onclick="window.nclexApp.navigate('home')" 
                                class="px-5 py-2.5 rounded-2xl font-black hover:opacity-90 transition flex items-center gap-2"
                                style="background-color: var(--brand-bg); color: var(--brand-text); border: 1px solid var(--brand-border);">
                                <i class="fa-solid fa-arrow-left"></i>
                                ${isEs ? 'Volver al inicio' : 'Back to home'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== INICIALIZACIÓN SEGURA =====
    
    function init() {
        if (isInitialized) {
            console.log('🎨 SkinSystem ya inicializado');
            return;
        }
        
        isInitialized = true;
        
        try {
            const savedSkin = localStorage.getItem(STORAGE_KEY);
            if (savedSkin && SKINS.find(s => s.id === savedSkin)) {
                currentSkin = savedSkin;
            }
        } catch (e) {
            console.warn('No se pudo leer skin de localStorage');
        }
        
        applySkin(currentSkin, false);
        
        console.log('🎨 SkinSystem cargado. Skin actual:', currentSkin);
    }

    // ===== API PÚBLICA =====
    window.SkinSystem = {
        SKINS,
        currentSkin: () => currentSkin,
        
        setSkin: function(skinId) {
            applySkin(skinId, true);
            
            if (window.nclexApp && typeof window.nclexApp.getCurrentRoute === 'function') {
                const route = window.nclexApp.getCurrentRoute();
                if (route === 'skins') {
                    const view = document.getElementById('app-view');
                    if (view && typeof window.SkinSystem.renderSkinSelector === 'function') {
                        view.innerHTML = window.SkinSystem.renderSkinSelector();
                        if (typeof window.applyGlobalLanguage === 'function') {
                            window.applyGlobalLanguage();
                        }
                    }
                }
            }
        },
        
        renderSkinSelector,
        
        refresh: function() {
            applySkin(currentSkin, false);
        },
        
        getCurrentSkinInfo: function() {
            return SKINS.find(s => s.id === currentSkin) || SKINS[0];
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 10);
    }

    window.__skinSystemDebug = {
        getState: () => ({ currentSkin, isInitialized, SKINS }),
        forceInit: init
    };

})();