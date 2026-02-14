/* logic.js — Core navigation + Search + Progress + NGN + LIBRARY (VERSIÓN 4.1) */

(function () {
    'use strict';
  
    // ===== UTILIDADES =====
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
    // Mapa de colores semánticos
    const colorMap = {
        blue:   { bg: 'bg-blue-500',   grad: 'from-blue-500 to-blue-600',   rgb: '59, 130, 246' },
        purple: { bg: 'bg-purple-500', grad: 'from-purple-500 to-purple-600', rgb: '168, 85, 247' },
        green:  { bg: 'bg-green-500',  grad: 'from-green-500 to-green-600',  rgb: '34, 197, 94' },
        red:    { bg: 'bg-red-500',    grad: 'from-red-500 to-red-600',    rgb: '239, 68, 68' },
        orange: { bg: 'bg-orange-500', grad: 'from-orange-500 to-orange-600', rgb: '249, 115, 22' },
        teal:   { bg: 'bg-teal-500',   grad: 'from-teal-500 to-teal-600',   rgb: '20, 184, 166' },
        indigo: { bg: 'bg-indigo-500', grad: 'from-indigo-500 to-indigo-600', rgb: '99, 102, 241' },
        yellow: { bg: 'bg-yellow-500', grad: 'from-yellow-400 to-yellow-600', rgb: '234, 179, 8' },
        gray:   { bg: 'bg-gray-500',   grad: 'from-gray-500 to-gray-600',   rgb: '107, 114, 128' }
    };

    const getColor = (colorName) => colorMap[colorName] || colorMap['blue'];
  
    // ===== ESTADO GLOBAL =====
    const state = {
        topics: [],
        currentRoute: 'home',
        currentLang: 'es',
        completedTopics: [],
        isAppLoaded: false,
        isRendering: false,
        scrollPositions: {},
        updateQueue: [],
        lastUpdate: 0,
        streak: 0,
        lastVisit: null
    };
  
    // ===== PERSISTENCIA =====
    function loadPersistedState() {
        try {
            const stored = localStorage.getItem('nclex_progress');
            state.completedTopics = stored ? JSON.parse(stored) : [];
        } catch (e) { state.completedTopics = []; }
        state.currentLang = localStorage.getItem('nclex_lang') || 'es';
        
        try {
            const streakData = JSON.parse(localStorage.getItem('nclex_streak') || '{}');
            state.streak = streakData.streak || 0;
            state.lastVisit = streakData.lastVisit ? new Date(streakData.lastVisit) : null;
        } catch (e) { state.streak = 0; }
    }

    function updateStreak() {
        const today = new Date();
        today.setHours(0,0,0,0);
        if (!state.lastVisit) { state.streak = 1; } 
        else {
            const last = new Date(state.lastVisit);
            last.setHours(0,0,0,0);
            const diff = Math.floor((today - last) / (1000 * 60 * 60 * 24));
            if (diff === 1) state.streak += 1;
            else if (diff > 1) state.streak = 1;
        }
        state.lastVisit = new Date();
        localStorage.setItem('nclex_streak', JSON.stringify({ streak: state.streak, lastVisit: state.lastVisit }));
    }

    // ===== HELPERS UI =====
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
        let titleStr = typeof t.title === 'object' ? ((t.title.es || "") + (t.title.en || "")) : String(t.title);
        const title = titleStr.toLowerCase();
        let badges = '';
        if(title.includes('pharm') || title.includes('drug')) badges += `<span title="Pharm" class="mr-1">💊</span>`;
        if(title.includes('pediatric') || title.includes('child')) badges += `<span title="Peds" class="mr-1">👶</span>`;
        if(title.includes('maternity') || title.includes('labor')) badges += `<span title="OB" class="mr-1">🤰</span>`;
        if(title.includes('priority') || title.includes('emergency')) badges += `<span title="Priority" class="mr-1">🚨</span>`;
        return badges;
    }

    // ===== REGISTRO DE TOPICS =====
    function registerTopic(topic) {
        if (!topic || !topic.id) return;
        const existingIndex = state.topics.findIndex(t => t.id === topic.id);
        if (existingIndex >= 0) state.topics[existingIndex] = { ...state.topics[existingIndex], ...topic };
        else state.topics.push(topic);
        state.topics.sort((a, b) => (parseInt(a.order || 999) - parseInt(b.order || 999)));
        queueUpdate();
    }

    function queueUpdate() {
        if (state.updateQueue.length > 0) clearTimeout(state.updateQueue[0]);
        state.updateQueue = [];
        const timeoutId = setTimeout(() => {
            if (!state.isAppLoaded) return;
            updateNav();
            if (window.SmartSearchEngine?.buildIndices) window.SmartSearchEngine.buildIndices(state.topics);
            if (state.currentRoute === 'home') render('home');
        }, 50);
        state.updateQueue.push(timeoutId);
    }

    // ===== API PÚBLICA =====
    window.NCLEX = { registerTopic };
    window.nclexApp = {
        navigate(route) {
            if (state.isRendering) return;
            state.scrollPositions[state.currentRoute] = $('#main-content')?.scrollTop || 0;
            state.currentRoute = route;
            render(route);
            updateNavActive(route);
            setTimeout(() => {
                const main = $('#main-content');
                if(main) main.scrollTop = (route === 'home' ? (state.scrollPositions['home'] || 0) : 0);
            }, 50);
            clearSearchResults();
        },
        toggleLanguage() {
            state.currentLang = state.currentLang === 'es' ? 'en' : 'es';
            localStorage.setItem('nclex_lang', state.currentLang);
            applyLanguageGlobal();
            render(state.currentRoute);
            updateNav();
        },
        toggleTopicComplete(topicId) {
            const index = state.completedTopics.indexOf(topicId);
            if (index > -1) state.completedTopics.splice(index, 1);
            else state.completedTopics.push(topicId);
            localStorage.setItem('nclex_progress', JSON.stringify(state.completedTopics));
            if(window.NCLEX_AUTH?.forceSave) window.NCLEX_AUTH.forceSave();
            render(state.currentRoute);
            updateNav();
        },
        getTopics: () => [...state.topics],
        getCurrentRoute: () => state.currentRoute,
        getCurrentLang: () => state.currentLang,
        refreshUI: () => { render(state.currentRoute); updateNav(); }
    };

    function clearSearchResults() {
        $$('.search-results-container, #home-search-results, #sidebar-search-results').forEach(el => {
            el.classList.remove('active');
            el.innerHTML = '';
        });
        $$('input[type="search"], #home-search, #global-search').forEach(el => el.value = '');
    }
  
    // ===== RENDERIZADO HOME (Con Buscador y Librería) =====
    function renderHome() {
        const total = state.topics.length;
        const completed = state.completedTopics.length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
        let msg = percent < 50 ? t('¡Vamos!', 'Let\'s go!') : t('¡Excelente!', 'Great job!');
        const incompleteTopics = state.topics.filter(t => !state.completedTopics.includes(t.id)).slice(0, 3);
        const skinCount = window.NCLEX_SKINS?.all?.length || 20;
        const brandColor = `rgb(var(--brand-blue-rgb))`;

        return `
            <header class="mb-8 animate-slide-in">
                <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-[var(--brand-text)] mb-2">NCLEX ESSENTIALS</h1>
                <p class="text-[var(--brand-text-muted)] text-lg">
                    <span class="lang-es">Tu éxito empieza hoy.</span>
                    <span class="lang-en hidden-lang">Your success starts today.</span>
                </p>
            </header>

            <div class="relative group mb-10 z-30">
                <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <i class="fa-solid fa-search text-[var(--brand-text-muted)] text-xl group-focus-within:text-[var(--brand-blue)]"></i>
                </div>
                <input type="text" id="home-search" autocomplete="off"
                    class="w-full p-5 pl-14 rounded-2xl bg-[var(--brand-card)] border-2 border-[var(--brand-border)] text-[var(--brand-text)] placeholder-[var(--brand-text-muted)] focus:border-[rgb(var(--brand-blue-rgb))] focus:ring-4 focus:ring-[rgba(var(--brand-blue-rgb),0.1)] transition-all text-lg shadow-sm font-medium"
                    placeholder="${state.currentLang === 'es' ? 'Busca en todo el contenido (ej. Digoxin)...' : 'Search all content (e.g., Digoxin)...'}">
                <div id="home-search-results" class="absolute top-full left-0 right-0 mt-3 rounded-2xl bg-[var(--brand-card)] shadow-2xl border border-[var(--brand-border)] overflow-hidden hidden max-h-[60vh] overflow-y-auto"></div>
            </div>

            <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)] shadow-lg mb-8 transition-colors">
                <div class="flex flex-col md:flex-row items-center gap-6">
                    <div class="relative w-24 h-24 flex-shrink-0">
                        <svg class="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--brand-border)" stroke-width="8" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="${brandColor}" stroke-width="8" stroke-dasharray="251.2" stroke-dashoffset="${251.2 * (1 - percent/100)}" stroke-linecap="round" transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 1s ease;" />
                            <text x="50" y="50" text-anchor="middle" dy="0.3em" class="text-2xl font-black fill-current text-[var(--brand-text)]">${percent}%</text>
                        </svg>
                    </div>
                    <div class="flex-1 w-full">
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="text-xl font-bold text-[var(--brand-text)]"><span class="lang-es">Progreso</span><span class="lang-en hidden-lang">Progress</span></h2>
                            <span class="text-sm font-bold px-3 py-1 rounded-full text-white" style="background-color: ${brandColor}"><i class="fa-regular fa-calendar-check mr-1"></i> ${state.streak} d</span>
                        </div>
                        <div class="w-full h-4 bg-[var(--brand-bg)] rounded-full overflow-hidden border border-[var(--brand-border)] mb-3">
                            <div class="h-full transition-all duration-1000 ease-out" style="width: ${percent}%; background: linear-gradient(90deg, ${brandColor}, rgba(var(--brand-blue-rgb), 0.7));"></div>
                        </div>
                        <p class="text-sm text-[var(--brand-text-muted)] italic">${msg}</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                ${renderMainCard('simulator', 'Simulator', 'Practice', 'brain', brandColor)}
                ${renderMainCard('ngn-sepsis', 'NGN Case', 'Sepsis', 'user-doctor', brandColor)}
                ${renderMainCard('library', 'Library', 'Books', 'book-open', brandColor)}
                ${renderMainCard('skins', 'Skins', `${skinCount} Themes`, 'palette', brandColor)}
            </div>

            <h3 class="text-lg font-bold text-[var(--brand-text)] mb-4 pl-1">Study Modules</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${state.topics.map(t => {
                    const isComplete = state.completedTopics.includes(t.id);
                    const c = getColor(t.color);
                    return `
                        <div onclick="window.nclexApp.navigate('topic/${t.id}')" 
                            class="bg-[var(--brand-card)] p-6 rounded-2xl shadow-sm border ${isComplete ? 'border-green-500' : 'border-[var(--brand-border)]'} hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                            <div class="flex items-start justify-between mb-4 relative z-10">
                                <div class="w-12 h-12 bg-gradient-to-br ${c.grad} rounded-xl flex items-center justify-center text-white shadow-md">
                                    <i class="fa-solid fa-${normalizeFaIcon(t.icon)} text-xl"></i>
                                </div>
                                <div class="flex gap-1">${getClinicalBadges(t)}</div>
                            </div>
                            <h3 class="text-lg font-bold mb-2 text-[var(--brand-text)] truncate relative z-10">${getBilingualTitle(t)}</h3>
                            <div class="w-full h-1 bg-[var(--brand-bg)] rounded-full overflow-hidden relative z-10">
                                <div class="h-full ${c.bg} w-0 group-hover:w-full transition-all duration-500"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function renderMainCard(route, title, subtitle, icon, color) {
        return `
            <div onclick="window.nclexApp.navigate('${route}')" 
                class="group relative p-5 rounded-2xl text-white shadow-lg cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-95"
                style="background: linear-gradient(135deg, ${color}, rgba(var(--brand-blue-rgb), 0.7));">
                <div class="relative z-10 text-center">
                    <i class="fa-solid fa-${icon} text-3xl mb-2 block drop-shadow-md"></i> 
                    <h2 class="text-sm font-black uppercase tracking-wider mb-0.5">
                        <span class="lang-es">${title}</span><span class="lang-en hidden-lang">${title}</span>
                    </h2>
                    <p class="text-[10px] opacity-90 font-medium">${subtitle}</p>
                </div>
            </div>
        `;
    }

    // RENDERIZADOR DE PÁGINAS (SKINS, LIBRARY, ETC)
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
                
                if (route === 'home') content = renderHome();
                else if (route === 'skins') content = renderSkinSelector();
                // RUTA DE LIBRERÍA (RECUPERADA)
                else if (route === 'library' && window.renderLibraryPage) content = window.renderLibraryPage();
                else if (route === 'simulator' && window.renderSimulatorPage) content = window.renderSimulatorPage();
                else if (route === 'ngn-sepsis' && window.renderNGNCase) content = window.renderNGNCase('sepsis');
                else if (route.startsWith('topic/')) {
                    const topicId = route.split('/')[1];
                    const topic = state.topics.find(t => t.id === topicId);
                    if (topic) {
                        const topicContent = (typeof topic.render === 'function') ? topic.render() : (topic.content || 'Content unavailable');
                        const isCompleted = state.completedTopics.includes(topicId);
                        content = `
                            <button onclick="window.nclexApp.navigate('home')" class="mb-4 text-sm font-bold text-[var(--brand-blue)] hover:underline">← Home</button>
                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <h1 class="text-2xl md:text-3xl font-black text-[var(--brand-text)]">${getBilingualTitle(topic)}</h1>
                                <button onclick="window.nclexApp.toggleTopicComplete('${topicId}')"
                                    class="px-5 py-2 rounded-xl font-bold text-white transition-all shadow-md ${isCompleted ? 'bg-green-600' : 'bg-gray-400 hover:bg-[var(--brand-blue)]'}">
                                    ${isCompleted ? '<i class="fa-solid fa-check mr-2"></i>Completed' : 'Mark Complete'}
                                </button>
                            </div>
                            <div class="animate-fade-in">${topicContent}</div>
                        `;
                    } else content = `<div class="p-10 text-center">Topic not found</div>`;
                } else content = `<div class="p-10 text-center">Module not found</div>`;

                view.innerHTML = content;
                applyLanguageGlobal();
                
            } catch (error) {
                console.error('Render error:', error);
                view.innerHTML = `<div class="p-10 text-red-500">Error: ${error.message}</div>`;
            } finally {
                requestAnimationFrame(() => {
                    view.style.opacity = '1';
                    view.style.transform = 'translateY(0)';
                    state.isRendering = false;
                });
            }
        }, 50);
    }

    // RENDERIZADOR DE SKINS
    function renderSkinSelector() {
        if (!window.NCLEX_SKINS) return '<div class="p-8 text-center">Loading skins...</div>';
        const skins = window.NCLEX_SKINS.all;
        const currentId = window.NCLEX_SKINS.current();
        return `
            <header class="mb-8">
                <button onclick="window.nclexApp.navigate('home')" class="mb-4 text-sm font-bold text-[var(--brand-blue)] hover:underline">← Volver</button>
                <h1 class="text-3xl font-black text-[var(--brand-text)]">Galería de Temas</h1>
            </header>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                ${skins.map(skin => {
                    const isActive = skin.id === currentId;
                    const grad = `linear-gradient(135deg, ${skin.colors[0]}, ${skin.colors[2]})`;
                    return `
                        <div onclick="window.NCLEX_SKINS.apply('${skin.id}')" 
                             class="cursor-pointer rounded-2xl border-2 ${isActive ? 'border-[var(--brand-blue)] ring-2 ring-[var(--brand-blue)] ring-opacity-50' : 'border-[var(--brand-border)]'} overflow-hidden transition-all hover:scale-[1.02] bg-[var(--brand-card)]">
                            <div class="h-24 w-full relative" style="background: ${grad}">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <i class="fa-solid fa-${skin.icon} text-3xl text-white drop-shadow-md"></i>
                                </div>
                                ${skin.isMasterpiece ? '<span class="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full shadow">PRO</span>' : ''}
                            </div>
                            <div class="p-4">
                                <h3 class="font-bold text-[var(--brand-text)] flex justify-between items-center">
                                    <span>${skin.name}</span>
                                    ${isActive ? '<i class="fa-solid fa-circle-check text-[var(--brand-blue)]"></i>' : ''}
                                </h3>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
  
    function updateNav() {
        const nav = $('#topics-nav');
        if (!nav) return;
        nav.innerHTML = state.topics.map(t => {
            const c = getColor(t.color);
            const isComplete = state.completedTopics.includes(t.id);
            return `
                <button onclick="window.nclexApp.navigate('topic/${t.id}')" 
                    data-route="topic/${t.id}" 
                    class="nav-btn w-full flex items-center gap-4 p-3 rounded-xl transition-all text-[var(--brand-text-muted)] group ${isComplete ? 'opacity-70' : ''}">
                    <div class="w-6 flex justify-center relative">
                        <i class="fa-solid fa-${normalizeFaIcon(t.icon)}" style="color: rgb(${c.rgb});"></i>
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
            const isActive = btn.getAttribute('data-route') === route;
            btn.classList.toggle('active', isActive);
            if (isActive) btn.querySelector('i').style.color = `rgb(var(--brand-blue-rgb))`;
        });
    }

    function applyLanguageGlobal() {
        const isEs = state.currentLang === 'es';
        $$('.lang-es').forEach(el => el.classList.toggle('hidden-lang', !isEs));
        $$('.lang-en').forEach(el => el.classList.toggle('hidden-lang', isEs));
    }

    // ===== INIT =====
    function init() {
        loadPersistedState();
        updateStreak();
        applyLanguageGlobal();
        state.isAppLoaded = true;
        updateNav();
        render('home');
        updateNavActive('home');
        document.dispatchEvent(new CustomEvent('nclex:ready'));
        if (window.hideLoader) window.hideLoader();
    }

    window.addEventListener('skinChanged', () => {
        if (state.isAppLoaded) {
            if (state.currentRoute === 'home' || state.currentRoute === 'skins') render(state.currentRoute);
            updateNav();
        }
    });

    window.applyGlobalLanguage = applyLanguageGlobal;
    window.t = (es, en) => state.currentLang === 'es' ? es : en;

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();