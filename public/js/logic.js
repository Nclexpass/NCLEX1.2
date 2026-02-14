/* logic.js — Core navigation + Search + Progress + NGN INTEGRATION + SKINS (VERSIÓN 3.5.1) */

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
        completedTopics: [],
        isAppLoaded: false,
        isRendering: false,
        scrollPositions: {},
        updateQueue: [],
        lastUpdate: 0,
        streak: 0,
        lastVisit: null
    };
  
    // ===== PERSISTENCIA SEGURA =====
    
    function loadPersistedState() {
        try {
            const stored = localStorage.getItem('nclex_progress');
            state.completedTopics = stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.warn('Error loading progress:', e);
            state.completedTopics = [];
            safeStorageSet('nclex_progress', '[]');
        }
        
        state.currentTheme = safeStorageGet('nclex_theme', 'dark');
        state.currentLang = safeStorageGet('nclex_lang', 'es');

        try {
            const streakData = JSON.parse(localStorage.getItem('nclex_streak') || '{}');
            state.streak = streakData.streak || 0;
            state.lastVisit = streakData.lastVisit ? new Date(streakData.lastVisit) : null;
        } catch (e) {
            state.streak = 0;
            state.lastVisit = null;
        }
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

    function updateStreak() {
        const today = new Date();
        today.setHours(0,0,0,0);
        
        if (!state.lastVisit) {
            state.streak = 1;
        } else {
            const last = new Date(state.lastVisit);
            last.setHours(0,0,0,0);
            const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
                // mismo día, no cambia
            } else if (diffDays === 1) {
                state.streak += 1;
            } else if (diffDays > 1) {
                state.streak = 1;
            }
        }
        
        state.lastVisit = new Date();
        safeStorageSet('nclex_streak', JSON.stringify({
            streak: state.streak,
            lastVisit: state.lastVisit.toISOString()
        }));
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
            
            render(state.currentRoute);
            updateNav();
        },
        
        toggleTheme() {
            state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
            safeStorageSet('nclex_theme', state.currentTheme);
            applyTheme();
            
            window.dispatchEvent(new CustomEvent('themechange', {
                detail: { theme: state.currentTheme }
            }));
        },
        
        toggleTopicComplete(topicId) {
            const index = state.completedTopics.indexOf(topicId);
            if (index > -1) {
                state.completedTopics.splice(index, 1);
            } else {
                state.completedTopics.push(topicId);
            }
            safeStorageSet('nclex_progress', JSON.stringify(state.completedTopics));
            render(state.currentRoute);
            updateNav();
        },

        getTopics() { 
            return [...state.topics]; 
        },

        getCurrentRoute() {
            return state.currentRoute;
        },

        refreshUI() {
            render(state.currentRoute);
            updateNav();
        }
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
  
        let motivationalMessage = '';
        if (percent === 0) motivationalMessage = t('¡Empieza hoy! Cada paso cuenta.', 'Start today! Every step counts.');
        else if (percent < 25) motivationalMessage = t('Buen comienzo. Sigue así.', 'Great start. Keep going.');
        else if (percent < 50) motivationalMessage = t('Vas por buen camino.', 'You\'re on the right track.');
        else if (percent < 75) motivationalMessage = t('Más de la mitad. ¡Excelente!', 'More than halfway. Excellent!');
        else if (percent < 100) motivationalMessage = t('Casi listo para el examen.', 'Almost ready for the exam.');
        else motivationalMessage = t('¡Completaste todo! Eres un maestro.', 'You completed everything! You\'re a master.');

        const incompleteTopics = state.topics.filter(t => !state.completedTopics.includes(t.id));
        const nextTopics = incompleteTopics.slice(0, 3);

        const skinCount = window.SkinSystem?.SKINS?.length || 18;
        const primaryColor = `rgb(var(--brand-blue-rgb))`;

        return `
            <header class="mb-8 animate-slide-in">
                <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-[var(--brand-text)] mb-2">NCLEX ESSENTIALS</h1>
                <p class="text-[var(--brand-text-muted)] text-lg">
                    <span class="lang-es">Tu éxito empieza hoy.</span>
                    <span class="lang-en hidden-lang">Your success starts today.</span>
                </p>
            </header>

            <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)] shadow-lg mb-8 transition-colors">
                <div class="flex flex-col md:flex-row items-center gap-6">
                    <div class="relative w-24 h-24 flex-shrink-0">
                        <svg class="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--brand-border)" stroke-width="8" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(var(--brand-blue-rgb))" stroke-width="8" stroke-dasharray="251.2" stroke-dashoffset="${251.2 * (1 - percent/100)}" stroke-linecap="round" transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 0.5s ease;" />
                            <text x="50" y="50" text-anchor="middle" dy="0.3em" class="text-2xl font-black fill-current text-[var(--brand-text)]">${percent}%</text>
                        </svg>
                    </div>
                    
                    <div class="flex-1 w-full">
                        <div class="flex justify-between items-center mb-2">
                            <div>
                                <h2 class="text-xl font-bold text-[var(--brand-text)]">
                                    <span class="lang-es">Progreso Global</span>
                                    <span class="lang-en hidden-lang">Overall Progress</span>
                                </h2>
                                <p class="text-sm text-[var(--brand-text-muted)]">${completed} / ${total} módulos</p>
                            </div>
                            <span class="text-sm font-bold px-3 py-1 rounded-full bg-[rgb(var(--brand-blue-rgb))] text-white">
                                <i class="fa-regular fa-calendar-check mr-1"></i> ${state.streak} día${state.streak !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div class="w-full h-4 bg-[var(--brand-bg)] rounded-full overflow-hidden border border-[var(--brand-border)] mb-3">
                            <div class="h-full transition-all duration-1000 ease-out" 
                                 style="width: ${percent}%; background: linear-gradient(90deg, ${primaryColor}, rgba(var(--brand-blue-rgb), 0.7));"></div>
                        </div>
                        <p class="text-sm text-[var(--brand-text-muted)] italic">
                            <i class="fa-regular fa-star mr-1" style="color: ${primaryColor};"></i> ${motivationalMessage}
                        </p>
                    </div>
                </div>

                ${nextTopics.length > 0 ? `
                <div class="mt-6 pt-4 border-t border-[var(--brand-border)]">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-[var(--brand-text-muted)] mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-stethoscope"></i>
                        <span class="lang-es">Continúa con:</span>
                        <span class="lang-en hidden-lang">Continue with:</span>
                    </h3>
                    <div class="flex flex-wrap gap-2">
                        ${nextTopics.map(t => {
                            const colors = getColor(t.color);
                            return `
                                <button onclick="window.nclexApp.navigate('topic/${t.id}')" 
                                    class="px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 bg-gradient-to-r ${colors.grad} text-white shadow-md">
                                    <i class="fa-solid fa-${normalizeFaIcon(t.icon)}"></i>
                                    <span>${t.title[state.currentLang] || t.title}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
                ` : ''}
            </div>

            <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)] shadow-lg mb-10 transition-colors">
                <h2 class="text-xl font-bold mb-4 text-[var(--brand-text)]">
                    <i class="fa-solid fa-search mr-2" style="color: ${primaryColor};"></i> Smart Search
                </h2>
                <div class="relative">
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)]"></i>
                    <input type="text" id="home-search" 
                        class="w-full bg-[var(--brand-bg)] border-2 border-[var(--brand-border)] focus:border-[rgb(var(--brand-blue-rgb))] rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[rgba(var(--brand-blue-rgb),0.2)] transition-all placeholder-[var(--brand-text-muted)] text-[var(--brand-text)]"
                        placeholder="Search medical terms, diagnoses, drugs...">
                </div>
                <div id="home-search-results" class="mt-3 w-full bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-lg shadow-lg max-h-96 overflow-y-auto no-scrollbar hidden"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                
                <div onclick="window.nclexApp.navigate('simulator')" 
                    class="group relative p-6 rounded-3xl text-white shadow-xl cursor-pointer overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                    style="background: linear-gradient(135deg, ${primaryColor}, rgba(var(--brand-blue-rgb), 0.7) 70%, rgba(var(--brand-blue-rgb), 0.4));">
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-tr from-white via-transparent to-transparent"></div>
                    <div class="relative z-10">
                        <h2 class="text-xl font-black mb-1 flex items-center gap-2">
                            <i class="fa-solid fa-brain text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"></i> 
                            Simulator
                        </h2>
                        <p class="text-sm opacity-90 font-medium tracking-wide">Adaptive practice (SATA + Options)</p>
                        <div class="w-12 h-1 bg-white/30 rounded-full mt-4 group-hover:w-20 transition-all duration-300"></div>
                    </div>
                </div>
                
                <div onclick="window.nclexApp.navigate('ngn-sepsis')" 
                    class="group relative p-6 rounded-3xl text-white shadow-xl cursor-pointer overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                    style="background: linear-gradient(135deg, rgba(var(--brand-blue-rgb), 0.9), rgba(var(--brand-blue-rgb), 0.6) 80%, rgba(var(--brand-blue-rgb), 0.3));">
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-tr from-white via-transparent to-transparent"></div>
                    <div class="relative z-10">
                        <h2 class="text-xl font-black mb-1 flex items-center gap-2">
                            <i class="fa-solid fa-notes-medical text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"></i> 
                            NGN Case: Sepsis
                        </h2>
                        <p class="text-sm opacity-90 font-medium tracking-wide">Next Gen Case Study Demo</p>
                        <div class="w-12 h-1 bg-white/30 rounded-full mt-4 group-hover:w-20 transition-all duration-300"></div>
                    </div>
                </div>
                
                <div onclick="window.nclexApp.navigate('skins')" 
                    class="group relative p-6 rounded-3xl text-white shadow-xl cursor-pointer overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                    style="background: linear-gradient(135deg, rgba(var(--brand-blue-rgb), 0.8), rgba(var(--brand-blue-rgb), 0.5) 60%, rgba(var(--brand-blue-rgb), 0.2));">
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-tr from-white via-transparent to-transparent"></div>
                    <div class="relative z-10">
                        <h2 class="text-xl font-black mb-1 flex items-center gap-2">
                            <i class="fa-solid fa-palette text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"></i>
                            <span class="lang-es">Apariencia</span>
                            <span class="lang-en hidden-lang">Appearance</span>
                        </h2>
                        <p class="text-sm opacity-90 font-medium tracking-wide">
                            <span class="lang-es">${skinCount} skins • Colores personalizados</span>
                            <span class="lang-en hidden-lang">${skinCount} skins • Custom colors</span>
                        </p>
                        <div class="w-12 h-1 bg-white/30 rounded-full mt-4 group-hover:w-20 transition-all duration-300"></div>
                    </div>
                </div>
                
                <div onclick="window.Library?.open()" 
                    class="group relative p-6 rounded-3xl text-white shadow-xl cursor-pointer overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                    style="background: linear-gradient(135deg, rgba(var(--brand-blue-rgb), 0.7), rgba(var(--brand-blue-rgb), 0.4) 50%, rgba(var(--brand-blue-rgb), 0.1));">
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-tr from-white via-transparent to-transparent"></div>
                    <div class="relative z-10">
                        <h2 class="text-xl font-black mb-1 flex items-center gap-2">
                            <i class="fa-solid fa-book text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"></i> 
                            Library
                        </h2>
                        <div class="flex items-end justify-between mt-2">
                            <span class="text-sm opacity-90 font-medium tracking-wide">Topics disponibles</span>
                            <span class="text-4xl font-black text-white drop-shadow-lg">${total}</span>
                        </div>
                        <div class="w-12 h-1 bg-white/30 rounded-full mt-4 group-hover:w-20 transition-all duration-300"></div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${state.topics.map(t => {
                    const isComplete = state.completedTopics.includes(t.id);
                    const colors = getColor(t.color);
                    return `
                        <div onclick="window.nclexApp.navigate('topic/${t.id}')" 
                            class="bg-[var(--brand-card)] p-6 rounded-2xl shadow-lg border ${isComplete ? 'border-green-500' : 'border-[var(--brand-border)]'} hover:-translate-y-1 transition-all cursor-pointer group">
                            <div class="flex items-start justify-between mb-4">
                                <div class="w-12 h-12 bg-gradient-to-br ${colors.grad} rounded-xl flex items-center justify-center text-white shadow-md">
                                    <i class="fa-solid fa-${normalizeFaIcon(t.icon)} text-xl"></i>
                                </div>
                                <div class="flex gap-1">${getClinicalBadges(t)}</div>
                            </div>
                            <h3 class="text-lg font-bold mb-2 text-[var(--brand-text)] truncate">${getBilingualTitle(t)}</h3>
                            <div class="w-full h-1 bg-[var(--brand-bg)] rounded-full overflow-hidden">
                                <div class="h-full ${colors.bg} w-0 group-hover:w-full transition-all duration-500"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
  
    function render(route) {
        if (state.isRendering) {
            console.warn('Render bloqueado: ya hay uno en progreso');
            return;
        }

        const view = $('#app-view');
        if (!view) {
            console.error('No se encontró #app-view');
            return;
        }

        state.isRendering = true;
        
        view.style.opacity = '0';
        view.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            try {
                let content = '';
                // Definir el color primario para usar en los botones de error
                const brandBlueRgb = 'rgb(var(--brand-blue-rgb))';
                
                if (route === 'home') {
                    content = renderHome();
                }
                else if (route.startsWith('topic/')) {
                    const topicId = route.split('/')[1];
                    const topic = state.topics.find(t => t.id === topicId);
                    
                    if (topic) {
                        let topicContent = '';
                        if (typeof topic.render === 'function') {
                            topicContent = topic.render();
                        } else if (topic.content) {
                            topicContent = topic.content;
                        } else {
                            topicContent = `
                                <div class="p-10 text-center">
                                    <div class="text-6xl mb-4">🔍</div>
                                    <h2 class="text-2xl font-bold text-[var(--brand-text)] mb-2">Module not found</h2>
                                    <p class="text-[var(--brand-text-muted)] mb-4">The topic "${topicId}" doesn't exist or hasn't loaded yet.</p>
                                    <button onclick="window.nclexApp.navigate('home')" 
                                        class="px-6 py-3 rounded-xl font-bold text-white transition-transform hover:scale-105 active:scale-95"
                                        style="background-color: ${brandBlueRgb};">
                                        Back to Home
                                    </button>
                                </div>
                            `;
                        }

                        const isCompleted = state.completedTopics.includes(topicId);
                        const buttonHtml = `
                            <div class="flex justify-end mb-6">
                                <button 
                                    onclick="window.nclexApp.toggleTopicComplete('${topicId}')"
                                    class="px-6 py-3 rounded-xl font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg ${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}"
                                    style="background-color: ${isCompleted ? '' : brandBlueRgb};">
                                    <span class="lang-es">${isCompleted ? '✓ Completado' : 'Marcar como completado'}</span>
                                    <span class="lang-en hidden-lang">${isCompleted ? '✓ Completed' : 'Mark as completed'}</span>
                                </button>
                            </div>
                        `;

                        content = buttonHtml + `<div class="animate-fade-in">${topicContent}</div>`;
                    } else {
                        content = `
                            <div class="p-10 text-center">
                                <div class="text-6xl mb-4">🔍</div>
                                <h2 class="text-2xl font-bold text-[var(--brand-text)] mb-2">Module not found</h2>
                                <p class="text-[var(--brand-text-muted)] mb-4">The topic "${topicId}" doesn't exist or hasn't loaded yet.</p>
                                <button onclick="window.nclexApp.navigate('home')" 
                                    class="px-6 py-3 rounded-xl font-bold text-white transition-transform hover:scale-105 active:scale-95"
                                    style="background-color: ${brandBlueRgb};">
                                    Back to Home
                                </button>
                            </div>
                        `;
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
                    content = `
                        <div class="p-10 text-center">
                            <div class="text-6xl mb-4">🚧</div>
                            <h2 class="text-2xl font-bold text-[var(--brand-text)] mb-2">Feature not available</h2>
                            <p class="text-[var(--brand-text-muted)] mb-4">The "${route}" module is loading or not available.</p>
                            <button onclick="window.nclexApp.navigate('home')" 
                                class="px-6 py-3 rounded-xl font-bold text-white transition-transform hover:scale-105 active:scale-95"
                                style="background-color: ${brandBlueRgb};">
                                Back to Home
                            </button>
                        </div>
                    `;
                }

                view.innerHTML = content;
                applyLanguageGlobal();
                
            } catch (error) {
                console.error('Error en render:', error);
                view.innerHTML = `
                    <div class="p-10 text-center text-red-500">
                        <h2 class="text-2xl font-bold mb-2">Error loading content</h2>
                        <p>${error.message}</p>
                    </div>
                `;
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

        const isEs = state.currentLang === 'es';
        
        nav.innerHTML = state.topics.map(t => {
            const colors = getColor(t.color);
            const isComplete = state.completedTopics.includes(t.id);
            
            return `
                <button onclick="window.nclexApp.navigate('topic/${t.id}')" 
                    data-route="topic/${t.id}" 
                    class="nav-btn w-full flex items-center gap-4 p-3 rounded-xl transition-all text-[var(--brand-text-muted)] group ${isComplete ? 'opacity-75' : ''}">
                    <div class="w-6 flex justify-center relative">
                        <i class="fa-solid fa-${normalizeFaIcon(t.icon)}" style="color: rgb(${colors.rgb});"></i>
                        ${isComplete ? '<span class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>' : ''}
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
            
            const icon = btn.querySelector('i');
            if (icon && isActive) {
                icon.style.color = `rgb(var(--brand-blue-rgb))`;
            }
        });
    }

    function applyLanguageGlobal() {
        const isEs = state.currentLang === 'es';
        
        $$('.lang-es').forEach(el => {
            el.classList.toggle('hidden-lang', !isEs);
        });
        
        $$('.lang-en').forEach(el => {
            el.classList.toggle('hidden-lang', isEs);
        });

        document.documentElement.lang = state.currentLang;
    }
  
    function applyTheme() {
        const isDark = state.currentTheme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        
        const metaTheme = $('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.content = isDark ? '#0F0F11' : '#F5F5F7';
        }
    }

    function init() {
        const v = window.NCLEX_VERSION || '3.5.0';
        console.log(`🚀 NCLEX App v${v} initializing...`);
        
        loadPersistedState();
        updateStreak();
        
        applyTheme();
        applyLanguageGlobal();
        
        state.isAppLoaded = true;
        
        updateNav();
        render('home');
        updateNavActive('home');
        
        window.scrollToTop = function() {
            const main = $('#main-content');
            if (main) {
                main.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        const mainContent = $('#main-content');
        const backToTop = $('#back-to-top');
        
        if (mainContent && backToTop) {
            mainContent.addEventListener('scroll', () => {
                const shouldShow = mainContent.scrollTop > 300;
                backToTop.classList.toggle('hidden', !shouldShow);
                backToTop.classList.toggle('flex', shouldShow);
            });
        }
        
        document.dispatchEvent(new CustomEvent('nclex:ready'));
        
        if (typeof window.hideLoader === 'function') {
            window.hideLoader();
        }
        
        console.log('✅ NCLEX App initialized successfully');
    }

    // ===== EXPONER FUNCIONES GLOBALES =====
    window.applyGlobalLanguage = applyLanguageGlobal;
    window.safeStorageGet = safeStorageGet;
    window.safeStorageSet = safeStorageSet;
    window.t = (es, en) => state.currentLang === 'es' ? es : en;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('skinchange', (e) => {
        console.log('Skin changed, refreshing UI...');
        if (state.isAppLoaded) {
            updateNav();
            if (state.currentRoute === 'home' || state.currentRoute === 'skins') {
                render(state.currentRoute);
            }
        }
    });

})();