/* logic.js — Core Logic & Navigation Engine (MASTER CLASS EDITION) */
/* Autor: Reynier Diaz Gerones */

(function () {
    'use strict';

    // --- 1. ESTADO GLOBAL & CONFIGURACIÓN ---
    const state = {
        currentView: 'home',
        language: localStorage.getItem('nclex_lang') || 'es',
        theme: localStorage.getItem('nclex_theme') || 'light',
        modules: {}, // Registro de módulos (temas)
        history: [], // Historial de navegación
        sidebarOpen: false
    };

    // Mapa de colores para consistencia visual
    const colorMap = {
        blue:   { bg: 'bg-blue-500',   text: 'text-blue-500',   light: 'bg-blue-50',   dark: 'dark:bg-blue-900/20', border: 'border-blue-200' },
        green:  { bg: 'bg-green-500',  text: 'text-green-500',  light: 'bg-green-50',  dark: 'dark:bg-green-900/20', border: 'border-green-200' },
        red:    { bg: 'bg-red-500',    text: 'text-red-500',    light: 'bg-red-50',    dark: 'dark:bg-red-900/20', border: 'border-red-200' },
        purple: { bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-50', dark: 'dark:bg-purple-900/20', border: 'border-purple-200' },
        orange: { bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50', dark: 'dark:bg-orange-900/20', border: 'border-orange-200' },
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', light: 'bg-indigo-50', dark: 'dark:bg-indigo-900/20', border: 'border-indigo-200' },
        teal:   { bg: 'bg-teal-500',   text: 'text-teal-500',   light: 'bg-teal-50',   dark: 'dark:bg-teal-900/20', border: 'border-teal-200' },
        gray:   { bg: 'bg-gray-500',   text: 'text-gray-500',   light: 'bg-gray-50',   dark: 'dark:bg-gray-800',     border: 'border-gray-200' }
    };

    // --- 2. API PÚBLICA (window.NCLEX) ---
    const NCLEX = {
        // Registro de módulos externos
        registerTopic: (moduleConfig) => {
            if (!moduleConfig.id) return console.error('Module ID required');
            state.modules[moduleConfig.id] = {
                ...moduleConfig,
                colorData: colorMap[moduleConfig.color || 'blue']
            };
            console.log(`[NCLEX] Módulo registrado: ${moduleConfig.id}`);
            renderSidebar(); // Actualizar menú
            if (state.currentView === 'home') renderHome(); // Actualizar home si estamos ahí
        },

        // Navegación
        navigate: (viewId, params = {}) => {
            state.currentView = viewId;
            state.params = params;
            
            // Actualizar UI
            renderView(viewId);
            updateSidebarActive(viewId);
            
            // Scroll top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Cerrar menú móvil si está abierto
            if (window.innerWidth < 768) {
                const sidebar = document.getElementById('main-sidebar');
                const overlay = document.getElementById('modal-overlay');
                if (sidebar) sidebar.classList.remove('translate-x-0');
                if (sidebar) sidebar.classList.add('-translate-x-full'); // Asumiendo estado inicial oculto en móvil
                if (overlay) overlay.classList.add('hidden');
                state.sidebarOpen = false;
            }
        },

        // Gestión de Tema
        toggleTheme: () => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            state.theme = newTheme;
            localStorage.setItem('nclex_theme', newTheme);
            applyTheme();
        },

        // Gestión de Idioma
        toggleLanguage: () => {
            const newLang = state.language === 'es' ? 'en' : 'es';
            state.language = newLang;
            localStorage.setItem('nclex_lang', newLang);
            applyLanguage();
        },
        
        // Utilidad: Obtener estado actual
        getState: () => ({ ...state }),

        // Utilidad: Notificaciones Toast (Simple)
        showToast: (msg, type = 'info') => {
            // Implementación básica, se puede expandir
            alert(msg); 
        }
    };

    // Alias para compatibilidad
    window.NCLEX = NCLEX;
    window.nclexApp = NCLEX;

    // --- 3. FUNCIONES INTERNAS DE RENDERIZADO ---

    function applyTheme() {
        const html = document.documentElement;
        if (state.theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }

    function applyLanguage() {
        const isEs = state.language === 'es';
        
        document.querySelectorAll('.lang-es').forEach(el => {
            el.style.display = isEs ? '' : 'none';
        });
        document.querySelectorAll('.lang-en').forEach(el => {
            el.style.display = !isEs ? '' : 'none';
        });

        // Evento personalizado para que los módulos se actualicen si es necesario
        window.dispatchEvent(new CustomEvent('nclex-lang-change', { detail: { lang: state.language } }));
    }

    function renderSidebar() {
        const nav = document.getElementById('topics-nav');
        if (!nav) return;

        nav.innerHTML = '';
        
        // Botón Home siempre primero
        const homeBtn = document.createElement('button');
        homeBtn.className = `w-full text-left px-4 py-3 rounded-xl mb-2 flex items-center gap-3 transition-all duration-200 group ${state.currentView === 'home' ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`;
        homeBtn.onclick = () => NCLEX.navigate('home');
        homeBtn.innerHTML = `
            <div class="${state.currentView === 'home' ? 'text-white' : 'text-brand-blue group-hover:scale-110 transition-transform'}">
                <i class="fa-solid fa-house text-lg"></i>
            </div>
            <span class="font-semibold text-sm">Dashboard</span>
        `;
        nav.appendChild(homeBtn);

        // Renderizar módulos registrados
        Object.values(state.modules).forEach(mod => {
            // No mostrar módulos ocultos si los hubiera
            if (mod.hidden) return;

            const btn = document.createElement('button');
            const isActive = state.currentView === mod.id;
            const colors = mod.colorData || colorMap.gray;

            btn.className = `w-full text-left px-4 py-3 rounded-xl mb-1 flex items-center gap-3 transition-all duration-200 group ${isActive ? `${colors.bg} text-white shadow-lg` : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`;
            btn.onclick = () => NCLEX.navigate(mod.id);
            
            // Título bilingüe
            const titleEs = typeof mod.title === 'object' ? mod.title.es : mod.title;
            const titleEn = typeof mod.title === 'object' ? mod.title.en : mod.title;

            btn.innerHTML = `
                <div class="${isActive ? 'text-white' : `${colors.text} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform`}">
                    <i class="fa-solid fa-${mod.icon || 'book'} w-5 text-center"></i>
                </div>
                <div class="flex-1 overflow-hidden">
                    <span class="block truncate font-medium text-sm lang-es">${titleEs}</span>
                    <span class="block truncate font-medium text-sm lang-en hidden-lang" style="display:none">${titleEn}</span>
                </div>
            `;
            nav.appendChild(btn);
        });
        
        applyLanguage(); // Re-aplicar idioma a los nuevos elementos
    }

    function updateSidebarActive(viewId) {
        renderSidebar(); // Por simplicidad, re-renderizamos (eficiente en este caso pequeño)
    }

    function renderView(viewId) {
        const container = document.getElementById('app-view');
        const content = document.createElement('div');
        content.className = 'animate-fade-in w-full';

        if (viewId === 'home') {
            content.innerHTML = renderHomeHTML();
        } else {
            const mod = state.modules[viewId];
            if (mod && typeof mod.render === 'function') {
                // Renderizado delegado al módulo
                const moduleContent = mod.render();
                if (typeof moduleContent === 'string') {
                    content.innerHTML = moduleContent;
                } else if (moduleContent instanceof Node) {
                    content.appendChild(moduleContent);
                }
            } else {
                content.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-64 text-gray-400">
                        <i class="fa-solid fa-screwdriver-wrench text-4xl mb-4"></i>
                        <p>Módulo no encontrado o en construcción: <b>${viewId}</b></p>
                    </div>
                `;
            }
        }

        container.innerHTML = '';
        container.appendChild(content);
        applyLanguage();
    }

    function renderHomeHTML() {
        // Generar grid de módulos para el Home
        let modulesGrid = '';
        Object.values(state.modules).forEach(mod => {
            const colors = mod.colorData || colorMap.gray;
            const titleEs = typeof mod.title === 'object' ? mod.title.es : mod.title;
            const titleEn = typeof mod.title === 'object' ? mod.title.en : mod.title;
            const subEs = mod.subtitle ? (typeof mod.subtitle === 'object' ? mod.subtitle.es : mod.subtitle) : 'Módulo de estudio';
            const subEn = mod.subtitle ? (typeof mod.subtitle === 'object' ? mod.subtitle.en : mod.subtitle) : 'Study module';

            modulesGrid += `
                <button onclick="NCLEX.navigate('${mod.id}')" 
                    class="group relative overflow-hidden bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl border ${colors.border} dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col h-full">
                    
                    <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                         <i class="fa-solid fa-${mod.icon || 'circle'} text-9xl ${colors.text}"></i>
                    </div>

                    <div class="w-12 h-12 rounded-xl ${colors.light} ${colors.text} ${colors.dark} flex items-center justify-center mb-4 text-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <i class="fa-solid fa-${mod.icon || 'book'}"></i>
                    </div>
                    
                    <h3 class="font-bold text-lg text-slate-800 dark:text-white mb-1 leading-tight z-10">
                        <span class="lang-es">${titleEs}</span>
                        <span class="lang-en hidden-lang" style="display:none">${titleEn}</span>
                    </h3>
                    
                    <p class="text-xs text-gray-500 dark:text-gray-400 font-medium z-10">
                        <span class="lang-es">${subEs}</span>
                        <span class="lang-en hidden-lang" style="display:none">${subEn}</span>
                    </p>

                    <div class="mt-auto pt-4 flex items-center text-xs font-semibold ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                        <span class="lang-es">ABRIR MÓDULO</span>
                        <span class="lang-en hidden-lang" style="display:none">OPEN MODULE</span>
                        <i class="fa-solid fa-arrow-right ml-2"></i>
                    </div>
                </button>
            `;
        });

        // Header del Dashboard
        return `
            <div class="space-y-8">
                <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                            <span class="lang-es">Panel Principal</span>
                            <span class="lang-en hidden-lang" style="display:none">Main Dashboard</span>
                        </h2>
                        <p class="text-gray-500 dark:text-gray-400 max-w-lg">
                            <span class="lang-es">Bienvenido a tu centro de preparación NCLEX de alto rendimiento. Selecciona un módulo para comenzar.</span>
                            <span class="lang-en hidden-lang" style="display:none">Welcome to your high-performance NCLEX prep hub. Select a module to begin.</span>
                        </p>
                    </div>
                    <div class="flex items-center gap-3">
                        <button onclick="NCLEX.toggleLanguage()" class="px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                            <span class="lang-es">🇺🇸 English</span>
                            <span class="lang-en hidden-lang" style="display:none">🇪🇸 Español</span>
                        </button>
                        <div class="text-right hidden md:block">
                            <p class="text-xs text-gray-400 font-mono">V.2.5.0 MASTER</p>
                            <p class="text-[10px] text-brand-blue font-bold tracking-wider">RN/NGN READY</p>
                        </div>
                    </div>
                </header>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    ${modulesGrid}
                </div>
                
                ${modulesGrid === '' ? `
                <div class="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/10">
                    <div class="spinner border-t-transparent border-brand-blue w-8 h-8 rounded-full border-2 animate-spin mx-auto mb-4"></div>
                    <p class="text-gray-400">Cargando módulos del sistema...</p>
                </div>` : ''}
            </div>
        `;
    }

    // --- 4. INICIALIZACIÓN ---

    function init() {
        console.log("🚀 NCLEX Core Initializing...");
        
        applyTheme();
        
        // Mobile Sidebar Logic
        const menuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('main-sidebar');
        const overlay = document.getElementById('modal-overlay');

        if (menuBtn && sidebar) {
            // Ajuste para móvil: el sidebar debe tener clases específicas para transform
            sidebar.className = "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1c1c1e] shadow-2xl transform -translate-x-full transition-transform duration-300 md:translate-x-0 md:static md:shadow-none border-r border-gray-200 dark:border-white/10 flex flex-col";
            
            menuBtn.onclick = () => {
                state.sidebarOpen = !state.sidebarOpen;
                if (state.sidebarOpen) {
                    sidebar.classList.remove('-translate-x-full');
                    if(overlay) {
                        overlay.classList.remove('hidden');
                        overlay.classList.remove('opacity-0');
                    }
                } else {
                    sidebar.classList.add('-translate-x-full');
                    if(overlay) {
                        overlay.classList.add('hidden');
                        overlay.classList.add('opacity-0');
                    }
                }
            };

            if (overlay) {
                overlay.onclick = () => {
                    state.sidebarOpen = false;
                    sidebar.classList.add('-translate-x-full');
                    overlay.classList.add('hidden');
                };
            }
        }

        // Simular carga inicial
        setTimeout(() => {
            const loader = document.getElementById('loading');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }
            // Render inicial
            renderSidebar();
            renderView('home');
        }, 800);
    }

    // Arrancar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
