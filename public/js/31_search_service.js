/* logic.js — Navigation + Sidebar Filter + Smart Search Connection */

(function () {
    'use strict';
  
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
    // --- ESTADO Y CONFIG ---
    const savedTheme = localStorage.getItem('nclex_theme') || 'dark';
    const savedLang = localStorage.getItem('nclex_lang') || 'es';
  
    const state = {
      topics: [],
      currentRoute: 'home',
      currentLang: savedLang,
      currentTheme: savedTheme,
      completedTopics: JSON.parse(localStorage.getItem('nclex_progress') || '[]'),
      isAppLoaded: false
    };

    // --- BÚSQUEDA 1: SIDEBAR (Filtro de Temas) ---
    function initSidebarSearch() {
        const input = document.getElementById('global-search');
        if (!input) return;
        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            $$('#topics-nav button').forEach(btn => {
                btn.classList.toggle('hidden', !btn.innerText.toLowerCase().includes(term));
            });
        });
    }

    // --- BÚSQUEDA 2: DASHBOARD (Smart Search Profundo) ---
    function setupSmartSearch() {
        const input = document.getElementById('home-search');
        const resultsBox = document.getElementById('smart-search-results');
        if (!input || !resultsBox) return;

        input.addEventListener('input', (e) => {
            const term = e.target.value;
            if (term.length < 2) {
                resultsBox.classList.add('hidden');
                return;
            }

            // Usar el motor de tu archivo 31
            if (window.SmartSearchEngine && window.SmartSearchEngine.isReady) {
                const matches = window.SmartSearchEngine.query(term);
                renderSmartResults(matches, resultsBox);
            }
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
                resultsBox.classList.add('hidden');
            }
        });
    }

    function renderSmartResults(matches, container) {
        if (matches.length === 0) {
            container.innerHTML = `<div class="p-4 text-center text-gray-400 text-sm">No se encontraron palabras clave.</div>`;
        } else {
            container.innerHTML = matches.slice(0, 5).map(m => `
                <div onclick="window.nclexApp.navigate('topic/${m.id}')" class="p-3 hover:bg-blue-50 dark:hover:bg-white/5 cursor-pointer flex items-center gap-3 border-b border-gray-100 dark:border-white/5 last:border-0 transition-colors">
                    <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <i class="fa-solid fa-${(m.icon || 'book').replace('fa-solid ', '').replace('fa-', '')}"></i>
                    </div>
                    <div class="min-w-0">
                        <div class="font-bold text-sm text-slate-800 dark:text-white truncate">
                            <span class="lang-es">${m.titleObj.es}</span><span class="lang-en hidden-lang">${m.titleObj.en}</span>
                        </div>
                        <div class="text-[10px] text-gray-400 truncate italic">...${m.contentPreview}</div>
                    </div>
                </div>
            `).join('');
        }
        container.classList.remove('hidden');
        applyLanguageGlobal();
    }

    // --- SISTEMA CORE ---
    window.NCLEX = {
      registerTopic(topic) {
        if (!topic || !topic.id) return;
        state.topics.push(topic);
        if (state.isAppLoaded) {
            updateNav();
            if (window.SmartSearchEngine) window.SmartSearchEngine.tryBuildIndex();
        }
      }
    };
  
    window.nclexApp = {
      navigate(route) {
        state.currentRoute = route;
        render(route);
        if (route === 'home') setTimeout(setupSmartSearch, 100);
      },
      getTopics() { return state.topics; },
      toggleLanguage() {
        state.currentLang = state.currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('nclex_lang', state.currentLang);
        applyLanguageGlobal();
      }
    };

    function renderHome() {
        return `
        <header class="mb-8 animate-slide-in">
          <h1 class="text-3xl font-black text-slate-900 dark:text-white">NCLEX Masterclass OS</h1>
        </header>

        <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg mb-10 relative z-20">
          <h2 class="text-xl font-bold mb-4">🧠 Smart Search</h2>
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" id="home-search" class="w-full bg-gray-50 dark:bg-black/30 border-2 border-gray-100 dark:border-brand-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-blue text-slate-900 dark:text-white" placeholder="Search for symptoms, drugs, or notes...">
            <div id="smart-search-results" class="hidden absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"></div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           ${state.topics.map(t => `<div onclick="window.nclexApp.navigate('topic/${t.id}')" class="bg-white dark:bg-brand-card p-6 rounded-2xl border border-gray-200 dark:border-brand-border cursor-pointer hover:-translate-y-1 transition-all">
                <h3 class="font-bold text-slate-900 dark:text-white">${t.title.es || t.title}</h3>
           </div>`).join('')}
        </div>`;
    }

    function render(route) {
        const view = $('#app-view');
        if (!view) return;
        if (route === 'home') view.innerHTML = renderHome();
        else if (route.startsWith('topic/')) {
            const topic = state.topics.find(t => t.id === route.split('/')[1]);
            view.innerHTML = topic ? (typeof topic.render === 'function' ? topic.render() : topic.content) : "Not found";
        }
        applyLanguageGlobal();
    }

    function updateNav() {
        const nav = $('#topics-nav');
        if (nav) nav.innerHTML = state.topics.map(t => `
            <button onclick="window.nclexApp.navigate('topic/${t.id}')" class="w-full text-left p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-sm font-bold truncate">
                ${t.title.es || t.title}
            </button>`).join('');
    }

    function applyLanguageGlobal() {
      const isEs = state.currentLang === 'es';
      $$('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      $$('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
    }

    function init() {
        document.documentElement.classList.toggle('dark', state.currentTheme === 'dark');
        state.isAppLoaded = true;
        updateNav();
        initSidebarSearch();
        render('home');
        setTimeout(setupSmartSearch, 500);
        const loader = $('#loading');
        if(loader) loader.classList.add('hidden');
    }

    init();
})();