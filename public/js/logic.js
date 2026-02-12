/* logic.js — Software Core */
(function () {
    'use strict';
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
    const state = {
      topics: [],
      currentRoute: 'home',
      currentLang: localStorage.getItem('nclex_lang') || 'es',
      currentTheme: localStorage.getItem('nclex_theme') || 'dark',
      isAppLoaded: false
    };

    function getSafeTitle(t, lang) {
      if (!t) return "Módulo";
      if (t.title && typeof t.title === 'object') return t.title[lang] || t.title['es'] || "Módulo";
      if (t[`label_${lang}`]) return t[`label_${lang}`];
      return t.name || t.id || "Módulo";
    }

    // FILTRO DE SIDEBAR
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

    // SMART SEARCH DASHBOARD
    function setupSmartSearchUI() {
        const input = document.getElementById('home-search');
        const resultsBox = document.getElementById('smart-search-results');
        if (!input || !resultsBox) return;

        input.addEventListener('input', (e) => {
            const term = e.target.value;
            if (term.length < 2) { resultsBox.classList.add('hidden'); return; }
            if (window.SmartSearchEngine && window.SmartSearchEngine.isReady) {
                const matches = window.SmartSearchEngine.query(term);
                resultsBox.innerHTML = matches.length ? matches.slice(0, 6).map(m => `
                    <div onclick="window.nclexApp.navigate('topic/${m.id}')" class="p-4 hover:bg-blue-50 dark:hover:bg-white/5 cursor-pointer flex items-center gap-4 border-b border-gray-100 dark:border-white/5 transition-colors">
                        <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                            <i class="fa-solid fa-${m.icon.replace('fa-solid ', '').replace('fa-', '')}"></i>
                        </div>
                        <div class="min-w-0">
                            <div class="font-bold text-sm text-slate-800 dark:text-white truncate">
                                <span class="lang-es">${m.titleES}</span><span class="lang-en hidden-lang">${m.titleEN}</span>
                            </div>
                            <div class="text-[11px] text-gray-400 truncate italic">${m.preview}</div>
                        </div>
                    </div>`).join('') : '<div class="p-6 text-center text-gray-400 text-sm italic">No keyword matches.</div>';
                resultsBox.classList.remove('hidden');
                applyLanguageGlobal();
            }
        });
        document.addEventListener('click', (e) => { if (!input.contains(e.target) && !resultsBox.contains(e.target)) resultsBox.classList.add('hidden'); });
    }

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
        if (route === 'home') setTimeout(setupSmartSearchUI, 100);
      },
      getTopics() { return state.topics; },
      toggleLanguage() {
        state.currentLang = state.currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('nclex_lang', state.currentLang);
        applyLanguageGlobal();
      },
      toggleTheme() {
        state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('nclex_theme', state.currentTheme);
        document.documentElement.classList.toggle('dark', state.currentTheme === 'dark');
      }
    };

    function renderHome() {
        return `
        <header class="mb-10 animate-slide-in">
          <h1 class="text-4xl font-black text-slate-900 dark:text-white mb-2">NCLEX OS</h1>
          <p class="text-gray-500 font-medium">Panel de Control de Preparación</p>
        </header>

        <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg mb-10 relative z-20">
          <h2 class="text-xl font-bold mb-4">🧠 Smart Search</h2>
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" id="home-search" class="w-full bg-gray-50 dark:bg-black/30 border-2 border-gray-100 dark:border-brand-border rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:border-brand-blue text-slate-900 dark:text-white text-lg" placeholder="Busca en el contenido profundo...">
            <div id="smart-search-results" class="hidden absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 max-h-[400px] overflow-y-auto"></div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
           <div onclick="window.nclexApp.navigate('simulator')" class="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-3xl text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-all">
                <h2 class="text-xl font-black mb-1">Simulator</h2>
                <p class="text-sm opacity-80">Práctica Adaptativa</p>
           </div>
           <div onclick="window.nclexApp.navigate('ngn-sepsis')" class="bg-gradient-to-br from-rose-500 to-orange-600 p-6 rounded-3xl text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-all">
                <h2 class="text-xl font-black mb-1">NGN Sepsis</h2>
                <p class="text-sm opacity-80">Casos Clínicos</p>
           </div>
           <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg flex flex-col justify-center">
             <h2 class="text-xl font-bold text-gray-400">Módulos</h2>
             <span class="text-4xl font-black">${state.topics.length}</span>
           </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${state.topics.map(t => `
            <div onclick="window.nclexApp.navigate('topic/${t.id}')" class="bg-white dark:bg-brand-card p-6 rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-all cursor-pointer">
                <h3 class="font-bold text-slate-800 dark:text-white truncate">${getSafeTitle(t, state.currentLang)}</h3>
            </div>`).join('')}
        </div>`;
    }

    function render(route) {
        const view = $('#app-view');
        if (!view) return;
        if (route === 'home') view.innerHTML = renderHome();
        else if (route.startsWith('topic/')) {
            const topic = state.topics.find(t => t.id === route.split('/')[1]);
            if (topic) view.innerHTML = `<div class="animate-fade-in">${typeof topic.render === 'function' ? topic.render() : topic.content}</div>`;
        }
        else if (route === 'simulator' && window.renderSimulatorPage) view.innerHTML = window.renderSimulatorPage();
        else if (route === 'ngn-sepsis' && window.renderNGNCase) view.innerHTML = window.renderNGNCase('sepsis');
        applyLanguageGlobal();
    }

    function updateNav() {
        const nav = $('#topics-nav');
        if (nav) nav.innerHTML = state.topics.map(t => `
            <button onclick="window.nclexApp.navigate('topic/${t.id}')" class="w-full text-left p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-sm font-bold truncate">
                ${getSafeTitle(t, state.currentLang)}
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
        setTimeout(setupSmartSearchUI, 500);
        if($('#loading')) $('#loading').classList.add('hidden');
    }
    init();
})();