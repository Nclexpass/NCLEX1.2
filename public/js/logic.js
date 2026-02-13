/* logic.js — Core navigation + Search + Progress + NGN INTEGRATION + SKINS (VERSIÓN CORREGIDA 4.0 - FIXED PROGRESS & UI) */

(function () {
    'use strict';
  
    // ===== UTILIDADES =====
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
    // Mapa de colores con fallback seguro
    const colorMap = {
        blue:   { bg: 'bg-blue-500',   text: 'text-blue-500',   grad: 'from-blue-500 to-blue-600',   light: 'bg-blue-100',   dark: 'dark:bg-blue-900/30', rgb: '59, 130, 246' },
        purple: { bg: 'bg-purple-500', text: 'text-purple-500', grad: 'from-purple-500 to-purple-600', light: 'bg-purple-100', dark: 'dark:bg-purple-900/30', rgb: '168, 85, 247' },
        green:  { bg: 'bg-green-500',  text: 'text-green-500',  grad: 'from-green-500 to-green-600',  light: 'bg-green-100',  dark: 'dark:bg-green-900/30', rgb: '34, 197, 94' },
        red:    { bg: 'bg-red-500',    text: 'text-red-500',    grad: 'from-red-500 to-red-600',    light: 'bg-red-100',    dark: 'dark:bg-red-900/30', rgb: '239, 68, 68' },
        orange: { bg: 'bg-orange-500', text: 'text-orange-500', grad: 'from-orange-500 to-orange-600', light: 'bg-orange-100', dark: 'dark:bg-orange-900/30', rgb: '249, 115, 22' },
        teal:   { bg: 'bg-teal-500',   text: 'text-teal-500',   grad: 'from-teal-500 to-teal-600',   light: 'bg-teal-100',   dark: 'dark:bg-teal-900/30', rgb: '20, 184, 166' },
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', grad: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-100', dark: 'dark:bg-indigo-900/30', rgb: '99, 102, 241' },
        yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', grad: 'from-yellow-400 to-yellow-600', light: 'bg-yellow-100', dark: 'dark:bg-yellow-900/30', rgb: '234, 179, 8' },
        gray:   { bg: 'bg-gray-500',   text: 'text-gray-500',   grad: 'from-gray-500 to-gray-600',   light: 'bg-gray-100',   dark: 'dark:bg-gray-800/50', rgb: '107, 114, 128' }
    };

    const getColor = (colorName) => colorMap[colorName] || colorMap['blue'];
  
    // ===== ESTADO GLOBAL =====
    const state = {
        topics: [],
        currentRoute: 'home',
        currentLang: 'es',
        currentTheme: 'dark',
        isStudyMode: false, // Nuevo: Modo Borroso para memorizar
        completedTopics: [],
        isAppLoaded: false,
        isRendering: false,
        scrollPositions: {},
        updateQueue: [],
        lastUpdate: 0
    };
  
    // ===== PERSISTENCIA SEGURA =====
    
    function loadPersistedState() {
        try {
            const storedProgress = localStorage.getItem('nclex_progress');
            state.completedTopics = storedProgress ? JSON.parse(storedProgress) : [];
            
            // Cargar preferencia de Study Mode
            const storedStudyMode = localStorage.getItem('nclex_study_mode');
            state.isStudyMode = storedStudyMode === 'true';

        } catch (e) {
            console.warn('Error loading state:', e);
            state.completedTopics = [];
            safeStorageSet('nclex_progress', '[]');
        }
        
        state.currentTheme = safeStorageGet('nclex_theme', 'dark');
        state.currentLang = safeStorageGet('nclex_lang', 'es');
    }

    function safeStorageGet(key, defaultValue) {
        try {
            return localStorage.getItem(key) || defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }

    function safeStorageSet(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.warn(`Error saving ${key}:`, e);
            return false;
        }
    }

    // ===== HELPERS DE UI =====
    
    function normalizeFaIcon(icon) {
        if (!icon || typeof icon !== 'string') return 'book';
        return icon.replace('fa-solid ', '').replace('fa-', '').trim();
    }

    function getBilingualTitle(t) {
        if (!t || !t.title) return 'Sin título';
        if (typeof t.title === 'object') {
            return `<span class="lang-es">${t.title.es || ''}</span><span class="lang-en hidden-lang">${t.title.en || ''}</span>`;
        }
        return t.title;
    }

    function getClinicalBadges(t) {
        if (!t || !t.title) return '';
        let titleStr = typeof t.title === 'object' ? ((t.title.es || "") + (t.title.en || "")) : String(t.title);
        const title = titleStr.toLowerCase();
        let badges = '';
        
        if(title.includes('pharm') || title.includes('drug')) badges += `<span title="Pharmacology" class="mr-1">💊</span>`;
        if(title.includes('pediatric') || title.includes('child')) badges += `<span title="Pediatrics" class="mr-1">👶</span>`;
        if(title.includes('maternity') || title.includes('labor')) badges += `<span title="Maternity" class="mr-1">🤰</span>`;
        if(title.includes('priority') || title.includes('emergency')) badges += `<span title="High Priority" class="mr-1">🚨</span>`;
            
        return badges;
    }

    // ===== SISTEMA DE REGISTRO DE TOPICS =====
    
    function registerTopic(topic) {
        if (!topic || !topic.id) {
            console.warn('Intento de registrar topic inválido:', topic);
            return;
        }

        const existingIndex = state.topics.findIndex(t => t.id === topic.id);
        
        if (existingIndex >= 0) {
            state.topics[existingIndex] = {
                ...state.topics[existingIndex],
                ...topic,
                render: topic.render || state.topics[existingIndex].render
            };
        } else {
            state.topics.push(topic);
        }

        state.topics.sort((a, b) => (parseInt(a.order || 999) - parseInt(b.order || 999)));
        queueUpdate();
    }

    function queueUpdate() {
        const now = Date.now();
        if (state.updateQueue.length > 0) {
            clearTimeout(state.updateQueue[0]);
            state.updateQueue = [];
        }
        
        const delay = Math.max(0, 50 - (now - state.lastUpdate));
        
        const timeoutId = setTimeout(() => {
            if (!state.isAppLoaded) return;
            state.lastUpdate = Date.now();
            updateNav();
            
            if (window.SmartSearchEngine && typeof window.SmartSearchEngine.buildIndices === 'function') {
                window.SmartSearchEngine.buildIndices(state.topics);
            }
            
            if (state.currentRoute === 'home') {
                render('home');
            }
            state.updateQueue = [];
        }, delay);
        
        state.updateQueue.push(timeoutId);
    }

    // ===== API PÚBLICA =====
    window.NCLEX = {
        registerTopic: registerTopic
    };
  
    window.nclexApp = {
        navigate(route) {
            if (state.isRendering) {
                console.warn('Navegación bloqueada: render en progreso');
                return;
            }

            const main = $('#main-content');
            if (main) {
                state.scrollPositions[state.currentRoute] = main.scrollTop;
            }

            state.currentRoute = route;
            render(route);
            updateNavActive(route);
            
            if (main) {
                main.scrollTop = (route === 'home' ? (state.scrollPositions['home'] || 0) : 0);
            }
            
            clearSearchResults();
        },
        
        toggleLanguage() {
            state.currentLang = state.currentLang === 'es' ? 'en' : 'es';
            safeStorageSet('nclex_lang', state.currentLang);
            applyLanguageGlobal();
            render(state.currentRoute); // Re-render para actualizar textos dinámicos
        },
        
        toggleTheme() {
            state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
            safeStorageSet('nclex_theme', state.currentTheme);
            applyTheme();
        },

        // Nueva función para Modo Estudio (Blur)
        toggleStudyMode() {
            state.isStudyMode = !state.isStudyMode;
            safeStorageSet('nclex_study_mode', state.isStudyMode);
            applyStudyMode();
            // Refrescamos el Home para ver el estado del botón
            if(state.currentRoute === 'home') renderHome(); 
        },
        
        toggleTopicComplete(topicId) {
            // Evitamos recargas innecesarias
            const index = state.completedTopics.indexOf(topicId);
            if (index > -1) {
                state.completedTopics.splice(index, 1);
            } else {
                state.completedTopics.push(topicId);
            }
            safeStorageSet('nclex_progress', JSON.stringify(state.completedTopics));
            
            // Actualización optimizada sin re-renderizar todo si es posible
            updateNav();
            if (state.currentRoute === 'home') {
                render('home'); // Refrescamos para ver barra de progreso y checks
            }
        },

        getTopics() { return [...state.topics]; },
        getCurrentRoute() { return state.currentRoute; },
        getCurrentLang() { return state.currentLang; }, // Importante para Simulador
        refreshUI() { render(state.currentRoute); updateNav(); }
    };
  
    // ===== RENDERIZADO =====

    function clearSearchResults() {
        setTimeout(() => {
            const homeResults = $('#home-search-results');
            if (homeResults) {
                homeResults.classList.remove('active');
                homeResults.innerHTML = '';
            }
            const sidebarResults = $('#sidebar-search-results');
            if (sidebarResults) {
                sidebarResults.classList.remove('active');
                sidebarResults.innerHTML = '';
            }
            const homeSearch = $('#home-search');
            if (homeSearch) homeSearch.value = '';
            const globalSearch = $('#global-search');
            if (globalSearch) globalSearch.value = '';
        }, 50);
    }
  
    function renderHome() {
        const total = state.topics.length;
        const completed = state.completedTopics.length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
        
        // Colores de UI
        const brandColor = 'rgb(var(--brand-blue-rgb))';

        return `
            <div class="animate-slide-in pb-10">
                <header class="mb-8">
                    <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-[var(--brand-text)] mb-2">NCLEX ESSENTIALS</h1>
                    <p class="text-[var(--brand-text-muted)] text-lg mb-6">
                        <span class="lang-es">Tu camino hacia el éxito clínico.</span>
                        <span class="lang-en hidden-lang">Your path to clinical success.</span>
                    </p>

                    <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)] shadow-lg transition-colors relative overflow-hidden">
                         <div class="absolute top-0 right-0 p-4 opacity-10">
                            <i class="fa-solid fa-book-medical text-8xl text-[var(--brand-text)]"></i>
                         </div>
                         
                         <div class="relative z-10">
                            <div class="flex justify-between items-end mb-4">
                                <div>
                                    <h2 class="text-xl font-bold text-[var(--brand-text)] flex items-center gap-2">
                                        <i class="fa-solid fa-chart-line" style="color: ${brandColor};"></i>
                                        <span class="lang-es">Mi Progreso</span>
                                        <span class="lang-en hidden-lang">My Progress</span>
                                    </h2>
                                    <p class="text-sm text-[var(--brand-text-muted)] mt-1">
                                        ${completed} <span class="lang-es">módulos completados de</span><span class="lang-en hidden-lang">modules completed of</span> ${total}
                                    </p>
                                </div>
                                <span class="text-4xl font-black" style="color: ${brandColor};">${percent}%</span>
                            </div>
                            
                            <div class="w-full h-4 bg-[var(--brand-bg)] rounded-full overflow-hidden border border-[var(--brand-border)]">
                                <div class="h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--brand-blue-rgb),0.5)]" 
                                     style="width: ${percent}%; background: linear-gradient(90deg, ${brandColor}, rgba(var(--brand-blue-rgb), 0.7));"></div>
                            </div>
                         </div>
                    </div>
                </header>

                <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)] shadow-lg mb-8 transition-colors">
                    <div class="relative">
                        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)]"></i>
                        <input type="text" id="home-search" 
                            class="w-full bg-[var(--brand-bg)] border-2 border-[var(--brand-border)] focus:border-[rgb(var(--brand-blue-rgb))] rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[rgba(var(--brand-blue-rgb),0.2)] transition-all placeholder-[var(--brand-text-muted)] text-[var(--brand-text)]"
                            placeholder="Search medical terms, drugs, diagnoses...">
                    </div>
                    <div id="home-search-results" class="mt-3 w-full bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-lg shadow-lg max-h-96 overflow-y-auto no-scrollbar hidden"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    
                    <div onclick="window.nclexApp.navigate('simulator')" 
                        class="p-5 rounded-2xl text-white shadow-lg cursor-pointer hover:scale-[1.02] transition-transform bg-gradient-to-br from-indigo-600 to-violet-600 flex flex-col justify-between h-32">
                        <div class="text-3xl"><i class="fa-solid fa-brain"></i></div>
                        <div>
                            <h2 class="font-bold">Simulator</h2>
                            <p class="text-xs opacity-80">Adaptive Tests</p>
                        </div>
                    </div>
                    
                    <div onclick="window.nclexApp.navigate('ngn-sepsis')" 
                        class="p-5 rounded-2xl text-white shadow-lg cursor-pointer hover:scale-[1.02] transition-transform bg-gradient-to-br from-rose-500 to-orange-600 flex flex-col justify-between h-32">
                        <div class="text-3xl"><i class="fa-solid fa-user-doctor"></i></div>
                        <div>
                            <h2 class="font-bold">NGN Case</h2>
                            <p class="text-xs opacity-80">Sepsis Protocol</p>
                        </div>
                    </div>

                    <div onclick="window.nclexApp.toggleStudyMode()" 
                        class="p-5 rounded-2xl shadow-lg cursor-pointer hover:scale-[1.02] transition-transform border border-[var(--brand-border)] bg-[var(--brand-card)] flex flex-col justify-between h-32 relative overflow-hidden">
                        <div class="absolute top-0 right-0 p-2">
                             <div class="w-10 h-6 rounded-full p-1 transition-colors ${state.isStudyMode ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}">
                                <div class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${state.isStudyMode ? 'translate-x-4' : ''}"></div>
                             </div>
                        </div>
                        <div class="text-3xl text-[var(--brand-text)]"><i class="fa-solid fa-eye-slash"></i></div>
                        <div>
                            <h2 class="font-bold text-[var(--brand-text)]">
                                <span class="lang-es">Modo Estudio</span>
                                <span class="lang-en hidden-lang">Study Mode</span>
                            </h2>
                            <p class="text-xs text-[var(--brand-text-muted)]">
                                <span class="lang-es">Ocultar cifras/labs</span>
                                <span class="lang-en hidden-lang">Blur numbers/labs</span>
                            </p>
                        </div>
                    </div>

                    <div onclick="window.nclexApp.navigate('skins')" 
                        class="p-5 rounded-2xl text-white shadow-lg cursor-pointer hover:scale-[1.02] transition-transform bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col justify-between h-32">
                        <div class="text-3xl"><i class="fa-solid fa-palette"></i></div>
                        <div>
                            <h2 class="font-bold">
                                <span class="lang-es">Apariencia</span>
                                <span class="lang-en hidden-lang">Skins</span>
                            </h2>
                            <p class="text-xs opacity-80">Custom UI</p>
                        </div>
                    </div>
                </div>

                <h3 class="text-xl font-bold text-[var(--brand-text)] mb-4 pl-1">
                    <span class="lang-es">Módulos de Aprendizaje</span>
                    <span class="lang-en hidden-lang">Learning Modules</span>
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${state.topics.map(t => {
                        const isComplete = state.completedTopics.includes(t.id);
                        const colors = getColor(t.color);
                        
                        return `
                            <div onclick="window.nclexApp.navigate('topic/${t.id}')" 
                                class="relative bg-[var(--brand-card)] p-6 rounded-2xl shadow-lg border-2 ${isComplete ? 'border-green-500/50' : 'border-[var(--brand-border)]'} hover:-translate-y-1 transition-all cursor-pointer group overflow-hidden">
                                
                                <button onclick="event.stopPropagation(); window.nclexApp.toggleTopicComplete('${t.id}')" 
                                    class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isComplete ? 'bg-green-500 text-white shadow-md hover:bg-green-600' : 'bg-[var(--brand-bg)] text-[var(--brand-text-muted)] border border-[var(--brand-border)] hover:border-green-500 hover:text-green-500'}">
                                    <i class="fa-solid fa-check text-sm"></i>
                                </button>

                                <div class="flex items-start justify-between mb-4 pr-8">
                                    <div class="w-12 h-12 bg-gradient-to-br ${colors.grad} rounded-xl flex items-center justify-center text-white shadow-md">
                                        <i class="fa-solid fa-${normalizeFaIcon(t.icon)} text-xl"></i>
                                    </div>
                                </div>

                                <div class="mb-2">
                                    <div class="flex flex-wrap gap-1 mb-1 opacity-80 text-xs">${getClinicalBadges(t)}</div>
                                    <h3 class="text-lg font-bold text-[var(--brand-text)] leading-tight line-clamp-2 min-h-[3rem] flex items-center">
                                        ${getBilingualTitle(t)}
                                    </h3>
                                </div>
                                
                                <div class="w-full h-1.5 bg-[var(--brand-bg)] rounded-full overflow-hidden mt-4">
                                    <div class="h-full ${isComplete ? 'bg-green-500' : colors.bg} w-0 group-hover:w-full ${isComplete ? 'w-full' : ''} transition-all duration-700 ease-out"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <footer class="mt-16 py-8 border-t border-[var(--brand-border)] text-center">
                    <p class="text-[var(--brand-text-muted)] font-medium text-sm">
                        NCLEX Essentials &copy; 2026
                    </p>
                    <p class="text-[var(--brand-text)] font-bold text-sm mt-1">
                        <span class="lang-es">Creado por Reynier Diaz Gerones</span>
                        <span class="lang-en hidden-lang">Created by Reynier Diaz Gerones</span>
                    </p>
                    <div class="flex justify-center gap-4 mt-4 text-[var(--brand-text-muted)] text-xl">
                        <i class="fa-brands fa-github hover:text-[var(--brand-text)] cursor-pointer transition-colors"></i>
                        <i class="fa-brands fa-linkedin hover:text-[var(--brand-text)] cursor-pointer transition-colors"></i>
                        <i class="fa-solid fa-envelope hover:text-[var(--brand-text)] cursor-pointer transition-colors"></i>
                    </div>
                </footer>
            </div>
        `;
    }
  
    function render(route) {
        if (state.isRendering) return;

        const view = $('#app-view');
        if (!view) return;

        state.isRendering = true;
        view.style.opacity = '0';
        view.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            try {
                let content = '';
                
                if (route === 'home') {
                    content = renderHome();
                }
                else if (route.startsWith('topic/')) {
                    const topicId = route.split('/')[1];
                    const topic = state.topics.find(t => t.id === topicId);
                    
                    if (topic && typeof topic.render === 'function') {
                        content = `<div class="animate-fade-in">${topic.render()}</div>`;
                    } else if (topic && topic.content) {
                        content = `<div class="animate-fade-in">${topic.content}</div>`;
                    } else {
                        content = `<div class="p-10 text-center">Module Not Found</div>`;
                    }
                }
                else if (route === 'simulator' && typeof window.renderSimulatorPage === 'function') {
                    content = window.renderSimulatorPage();
                }
                else if (route === 'ngn-sepsis' && typeof window.renderNGNCase === 'function') {
                    content = window.renderNGNCase('sepsis');
                }
                else if (route === 'skins' && window.SkinSystem && typeof window.SkinSystem.renderSkinSelector === 'function') {
                    content = window.SkinSystem.renderSkinSelector();
                }
                else {
                    content = `<div class="p-10 text-center">Page Not Found</div>`;
                }

                view.innerHTML = content;
                applyLanguageGlobal();
                applyStudyMode(); // Re-aplicar modo estudio tras render
                
            } catch (error) {
                console.error('Error en render:', error);
                view.innerHTML = `<div class="p-10 text-center text-red-500">Error: ${error.message}</div>`;
            } finally {
                requestAnimationFrame(() => {
                    view.style.opacity = '1';
                    view.style.transform = 'translateY(0)';
                    state.isRendering = false;
                });
            }
        }, 100);
    }
  
    function updateNav() {
        const nav = $('#topics-nav');
        if (!nav) return;

        nav.innerHTML = state.topics.map(t => {
            const colors = getColor(t.color);
            const isComplete = state.completedTopics.includes(t.id);
            
            return `
                <button onclick="window.nclexApp.navigate('topic/${t.id}')" 
                    data-route="topic/${t.id}" 
                    class="nav-btn w-full flex items-center gap-4 p-3 rounded-xl transition-all text-[var(--brand-text-muted)] group ${isComplete ? 'opacity-75' : ''}">
                    <div class="w-6 flex justify-center relative">
                        <i class="fa-solid fa-${normalizeFaIcon(t.icon)}" style="color: rgb(${colors.rgb});"></i>
                        ${isComplete ? '<span class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-[var(--brand-bg)]"></span>' : ''}
                    </div>
                    <span class="hidden lg:block text-sm font-bold truncate text-[var(--brand-text)]">${getBilingualTitle(t)}</span>
                </button>
            `;
        }).join('');

        updateNavActive(state.currentRoute);
    }
  
    function updateNavActive(route) {
        $$('.nav-btn').forEach(btn => {
            const btnRoute = btn.getAttribute('data-route');
            const isActive = btnRoute === route;
            btn.classList.toggle('active', isActive);
            
            // Highlight icon
            const icon = btn.querySelector('i');
            if (icon && isActive) {
                icon.style.color = `rgb(var(--brand-blue-rgb))`;
            }
        });
    }

    function applyLanguageGlobal() {
        const isEs = state.currentLang === 'es';
        $$('.lang-es').forEach(el => el.classList.toggle('hidden-lang', !isEs));
        $$('.lang-en').forEach(el => el.classList.toggle('hidden-lang', isEs));
        document.documentElement.lang = state.currentLang;
    }
  
    function applyTheme() {
        const isDark = state.currentTheme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        const metaTheme = $('meta[name="theme-color"]');
        if (metaTheme) metaTheme.content = isDark ? '#0F0F11' : '#F5F5F7';
    }

    function applyStudyMode() {
        // Agrega una clase al body para manejar efectos CSS globales (Blur)
        if (state.isStudyMode) {
            document.body.classList.add('study-blur-active');
        } else {
            document.body.classList.remove('study-blur-active');
        }
    }

    function init() {
        console.log('🚀 NCLEX App v4.0 initializing...');
        loadPersistedState();
        applyTheme();
        applyLanguageGlobal();
        applyStudyMode();
        
        state.isAppLoaded = true;
        updateNav();
        render('home');
        updateNavActive('home');
        
        document.dispatchEvent(new CustomEvent('nclex:ready'));
        if (typeof window.hideLoader === 'function') window.hideLoader();
    }

    // ===== EXPONER FUNCIONES GLOBALES =====
    window.applyGlobalLanguage = applyLanguageGlobal;
    window.safeStorageGet = safeStorageGet;
    window.safeStorageSet = safeStorageSet;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Listener para cambios de skin dinámicos
    window.addEventListener('skinchange', () => {
        if (state.isAppLoaded) {
            updateNav();
            if (state.currentRoute === 'home') render('home');
        }
    });

})();