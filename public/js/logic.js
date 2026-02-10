/* logic.js — Core navigation + Search + Progress + NGN INTEGRATION (MASTER VERSION) */
/* 🔗 ESTADO: SYNCED WITH ENGINE & ANATOMY */

(function () {
    'use strict';
  
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
    // --- 1. RESCATE DE TEMAS PREVIOS (CRÍTICO PARA ANATOMÍA) ---
    // Antes de que logic.js tome el control, guardamos lo que ngn_engine ya registró
    const existingTopics = (window.NCLEX && Array.isArray(window.NCLEX.topics)) ? window.NCLEX.topics : [];
    console.log(`📥 Logic.js: Importando ${existingTopics.length} temas previos (Ej: Anatomía).`);

    // --- COLOR MAP SYSTEM ---
    const colorMap = {
        blue:   { bg: 'bg-blue-500',   text: 'text-blue-500',   grad: 'from-blue-500 to-blue-600',   light: 'bg-blue-100',   dark: 'dark:bg-blue-900/30' },
        purple: { bg: 'bg-purple-500', text: 'text-purple-500', grad: 'from-purple-500 to-purple-600', light: 'bg-purple-100', dark: 'dark:bg-purple-900/30' },
        green:  { bg: 'bg-green-500',  text: 'text-green-500',  grad: 'from-green-500 to-green-600',  light: 'bg-green-100',  dark: 'dark:bg-green-900/30' },
        red:    { bg: 'bg-red-500',    text: 'text-red-500',    grad: 'from-red-500 to-red-600',    light: 'bg-red-100',    dark: 'dark:bg-red-900/30' },
        orange: { bg: 'bg-orange-500', text: 'text-orange-500', grad: 'from-orange-500 to-orange-600', light: 'bg-orange-100', dark: 'dark:bg-orange-900/30' },
        teal:   { bg: 'bg-teal-500',   text: 'text-teal-500',   grad: 'from-teal-500 to-teal-600',   light: 'bg-teal-100',   dark: 'dark:bg-teal-900/30' },
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', grad: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-100', dark: 'dark:bg-indigo-900/30' },
        cyan:   { bg: 'bg-cyan-500',   text: 'text-cyan-500',   grad: 'from-cyan-500 to-cyan-600',   light: 'bg-cyan-100',   dark: 'dark:bg-cyan-900/30' },
        pink:   { bg: 'bg-pink-500',   text: 'text-pink-500',   grad: 'from-pink-500 to-pink-600',   light: 'bg-pink-100',   dark: 'dark:bg-pink-900/30' },
        rose:   { bg: 'bg-rose-500',   text: 'text-rose-500',   grad: 'from-rose-500 to-rose-600',   light: 'bg-rose-100',   dark: 'dark:bg-rose-900/30' },
        slate:  { bg: 'bg-slate-500',  text: 'text-slate-500',  grad: 'from-slate-500 to-slate-600',  light: 'bg-slate-100',  dark: 'dark:bg-slate-800/50' },
        yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', grad: 'from-yellow-400 to-yellow-600', light: 'bg-yellow-100', dark: 'dark:bg-yellow-900/30' },
        emerald:{ bg: 'bg-emerald-500',text: 'text-emerald-500',grad: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-100', dark: 'dark:bg-emerald-900/30' },
        stone:  { bg: 'bg-stone-500',  text: 'text-stone-500',  grad: 'from-stone-500 to-stone-600',   light: 'bg-stone-100',   dark: 'dark:bg-stone-800/50' },
        violet: { bg: 'bg-violet-500', text: 'text-violet-500', grad: 'from-violet-500 to-violet-600', light: 'bg-violet-100', dark: 'dark:bg-violet-900/30' },
        sky:    { bg: 'bg-sky-500',    text: 'text-sky-500',    grad: 'from-sky-500 to-sky-600',     light: 'bg-sky-100',    dark: 'dark:bg-sky-900/30' },
        gray:   { bg: 'bg-gray-500',   text: 'text-gray-500',   grad: 'from-gray-500 to-gray-600',   light: 'bg-gray-100',   dark: 'dark:bg-gray-800/50' }
    };

    const getColor = (colorName) => colorMap[colorName] || colorMap['blue'];
  
    // SAFE STORAGE
    let savedProgress = [];
    try {
        const stored = localStorage.getItem('nclex_progress');
        savedProgress = stored ? JSON.parse(stored) : [];
    } catch (e) {
        localStorage.setItem('nclex_progress', '[]');
    }
  
    const savedTheme = localStorage.getItem('nclex_theme') || 'dark';
    const savedLang = localStorage.getItem('nclex_lang') || 'es';
  
    const state = {
      topics: [...existingTopics], // <--- AQUÍ ESTÁ LA MAGIA: Cargamos lo que ya existía
      currentRoute: 'home',
      currentLang: savedLang,
      currentTheme: savedTheme,
      completedTopics: savedProgress,
      isAppLoaded: false,
      updateTimer: null,
      scrollPositions: {} 
    };

    const SYSTEM_TOPIC_IDS = new Set(['library', 'dashboard']);
    const isSystemTopic = (id) => SYSTEM_TOPIC_IDS.has(String(id));
    const getStudyTopics = () => state.topics.filter(t => !isSystemTopic(t.id));

    // --- SEARCH ENGINE ---
    const SmartTextIndex = (() => {
      const index = [];
      const PRIORITY_KEYWORDS = ['priority', 'safety', 'airway', 'breathing', 'circulation', 'emergency'];
    
      function stripHTML(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
      }
    
      function normalize(text) {
        return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }
    
      function indexTopic(topic) {
        let rawContent = (typeof topic.render === 'function') ? topic.render() : (topic.content || '');
        if (!rawContent) return;
        index.push({
          id: topic.id,
          title: topic.title?.es || topic.title || '',
          text: normalize(stripHTML(rawContent)),
          color: topic.color || 'blue'
        });
      }
    
      function build(topics) {
        index.length = 0;
        topics.forEach(indexTopic);
      }
    
      function search(term) {
        const q = normalize(term);
        return index.filter(t => t.text.includes(q)).map(t => ({
            type: 'topic',
            topic: state.topics.find(st => st.id === t.id),
            score: 10,
            matches: ['content'],
            title: t.title,
            subtitle: 'Coincidencia encontrada',
            color: t.color
        }));
      }
      return { build, search };
    })();

    // --- GLOBAL API (REDEFINED SECURELY) ---
    window.NCLEX = {
      registerTopic(topic) {
        if (!topic || !topic.id) return;
        topic.id = String(topic.id);
        
        // Evitar duplicados
        const idx = state.topics.findIndex(t => t.id === topic.id);
        if (idx >= 0) state.topics[idx] = topic;
        else state.topics.push(topic);

        // Ordenar numéricamente
        state.topics.sort((a, b) => {
            const numA = parseInt(a.id.match(/^\d+/)?.[0]) || 999;
            const numB = parseInt(b.id.match(/^\d+/)?.[0]) || 999;
            if (numA !== numB) return numA - numB;
            return 0;
        });
        
        // Actualizar UI
        if (state.updateTimer) clearTimeout(state.updateTimer);
        state.updateTimer = setTimeout(() => {
            if (state.isAppLoaded) {
                updateNav();
                SmartTextIndex.build(getStudyTopics());
                // Si estamos en la página del tema, recargar
                if (state.currentRoute === `topic/${topic.id}`) render(state.currentRoute);
            }
        }, 50);
      },
      getAllTopics() { return state.topics; }
    };
  
    window.nclexApp = {
      navigate(route) {
        if (state.currentRoute === route && route !== 'home') return true;
        const main = $('#main-content');
        if (main) state.scrollPositions[state.currentRoute] = main.scrollTop;

        state.currentRoute = route;
        render(route);
        updateNavActive(route);
        
        if(route === 'home' && state.scrollPositions['home']) {
            setTimeout(() => { if(main) main.scrollTop = state.scrollPositions['home']; }, 10);
        } else {
            if(window.scrollToTop) window.scrollToTop();
        }
        return true;
      },
      toggleLanguage() {
        state.currentLang = state.currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('nclex_lang', state.currentLang);
        applyLanguageGlobal(); 
      },
      toggleTheme() {
        state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('nclex_theme', state.currentTheme);
        applyTheme();
        updateNavActive(state.currentRoute); 
      },
      toggleTopicComplete(topicId) {
          if (isSystemTopic(topicId)) return;
          const index = state.completedTopics.indexOf(topicId);
          if (index > -1) state.completedTopics.splice(index, 1);
          else state.completedTopics.push(topicId);
          localStorage.setItem('nclex_progress', JSON.stringify(state.completedTopics));
          render(state.currentRoute);
          updateNav();
      },
      navigateToQuestion(index) {
          this.navigate('simulator');
          setTimeout(() => { if(window.showSimulatorQuestion) window.showSimulatorQuestion(index); }, 200);
      },
      openTopicWithHighlight(id, term) { this.navigate('topic/'+id); },
      clearHighlights() {},
      getTopics() { return state.topics; }
    };
  
    window.scrollToTop = function() {
      const main = $('#main-content');
      if(main) main.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    if(!window.toggleNotepad) window.toggleNotepad = function() {};
  
    // --- UI FUNCTIONS ---
    function initSearch() {
      const searchInput = $('#global-search');
      if(searchInput) {
          searchInput.addEventListener('input', (e) => {
              const term = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              const navContainer = $('#topics-nav');
              if(navContainer) {
                  $$('.nav-btn', navContainer).forEach(btn => {
                      const text = btn.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                      btn.style.display = (term === '' || text.includes(term)) ? 'flex' : 'none';
                  });
              }
          });
      }
    }

    function initHomeSearch() {
        // Implementación simplificada para asegurar funcionamiento
        const input = $('#home-search');
        if(!input) return;
        input.addEventListener('input', (e) => {
            // Lógica de búsqueda visual aquí si es necesaria
        });
    }

    function applyTheme() {
      document.documentElement.classList.toggle('dark', state.currentTheme === 'dark');
    }
  
    function getBilingualTitle(t) {
        if (!t.title) return 'Sin título';
        if (typeof t.title === 'object') {
            return `<span class="lang-es">${t.title.es}</span><span class="lang-en hidden-lang">${t.title.en}</span>`;
        }
        return t.title;
    }

    function normalizeFaIcon(icon) {
        if (!icon) return 'book';
        if (icon.includes('fa-')) return icon.replace('fa-', '');
        return icon;
    }

    function getClinicalBadges(t) { return ''; } // Simplificado para robustez
  
    function updateNav() {
      const container = $('#topics-nav');
      if (!container) return;
  
      container.innerHTML = getStudyTopics().map(t => {
        const isComplete = state.completedTopics.includes(t.id);
        const checkMark = isComplete ? `<i class="fa-solid fa-circle-check text-green-500 ml-auto text-xs"></i>` : '';
        const titleHTML = getBilingualTitle(t);
        const colors = getColor(t.color || 'blue');
        
        return `
        <button onclick="window.nclexApp.navigate('topic/${t.id}')" data-route="topic/${t.id}" class="nav-btn w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-500 dark:text-gray-400 group text-left">
          <div class="w-6 flex justify-center shrink-0">
              <i class="fa-solid fa-${normalizeFaIcon(t.icon)} ${colors.text} group-hover:scale-110 transition-transform"></i>
          </div>
          <span class="hidden lg:block text-sm font-bold truncate flex-1">${titleHTML}</span>
          ${checkMark}
        </button>
      `}).join('');
      
      updateNavActive(state.currentRoute);
      applyLanguageGlobal();
    }
  
    function updateNavActive(route) {
      $$('.nav-btn').forEach(btn => {
        const btnRoute = btn.getAttribute('data-route');
        const isActive = btnRoute === route;
        btn.classList.remove('bg-gray-100', 'bg-white/10', 'text-brand-blue', 'text-white');
        if (isActive) {
           btn.classList.add(state.currentTheme === 'light' ? 'bg-gray-100' : 'bg-white/10');
           btn.classList.add(state.currentTheme === 'light' ? 'text-brand-blue' : 'text-white');
        }
      });
    }
  
    function render(route) {
      const view = $('#app-view');
      if (!view) return;
  
      view.style.opacity = '0';
      setTimeout(() => {
          if (route === 'home') {
            view.innerHTML = renderHome();
            setTimeout(initHomeSearch, 50);
          } else if (route === 'simulator') {
             view.innerHTML = window.renderSimulatorPage ? window.renderSimulatorPage() : '<div class="p-10 text-center">Cargando Simulador...</div>';
          } else if (route.startsWith('topic/')) {
            const topicId = route.split('/')[1];
            view.innerHTML = renderTopic(topicId);
          } else {
            view.innerHTML = '<div class="p-10 text-center">Página no encontrada</div>';
          }
          applyLanguageGlobal();
          updateNavActive(route);
          view.style.opacity = '1';
      }, 100);
    }
  
    function renderHome() {
      const topics = getStudyTopics();
      const progress = Math.round((state.completedTopics.length / Math.max(1, topics.length)) * 100);
      
      const cards = topics.map(t => {
          const colors = getColor(t.color || 'blue');
          const title = getBilingualTitle(t);
          const icon = normalizeFaIcon(t.icon);
          return `
          <div onclick="window.nclexApp.navigate('topic/${t.id}')" class="bg-white dark:bg-brand-card p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-brand-border hover:shadow-xl transition-all cursor-pointer group">
            <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${colors.grad} flex items-center justify-center text-white text-xl">
                    <i class="fa-solid fa-${icon}"></i>
                </div>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">${title}</h3>
            <div class="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full"><div class="h-full ${colors.bg} w-0 group-hover:w-full transition-all duration-500"></div></div>
          </div>`;
      }).join('');

      return `
        <div class="mb-8">
            <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2"><span class="lang-es">Panel Principal</span><span class="lang-en hidden-lang">Dashboard</span></h1>
            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl shadow-lg border border-gray-200 dark:border-brand-border">
                <div class="flex justify-between items-end mb-2">
                    <h2 class="font-bold text-gray-700 dark:text-gray-300">Progreso Total</h2>
                    <span class="text-3xl font-black text-brand-blue">${progress}%</span>
                </div>
                <div class="w-full h-4 bg-gray-100 dark:bg-black/30 rounded-full overflow-hidden">
                    <div class="h-full bg-brand-blue transition-all duration-1000" style="width: ${progress}%"></div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
      `;
    }
  
    function renderTopic(topicId) {
      const topic = state.topics.find(t => t.id === topicId);
      if (!topic) return `<div class="p-10 text-center font-bold text-red-500">Tema no encontrado: ${topicId}</div>`;
      
      let content = typeof topic.render === 'function' ? topic.render() : topic.content;
      
      return `
        <div class="animate-fade-in pb-20">
            <button onclick="window.nclexApp.navigate('home')" class="mb-4 flex items-center gap-2 text-gray-500 hover:text-brand-blue">
                <i class="fa-solid fa-arrow-left"></i> <span class="lang-es">Volver</span><span class="lang-en hidden-lang">Back</span>
            </button>
            <div class="prose dark:prose-invert max-w-none">${content}</div>
        </div>
      `;
    }

    function applyLanguageGlobal() {
      const isEs = state.currentLang === 'es';
      $$('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      $$('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
    }
  
    // --- INIT ---
    function init() {
      applyTheme();
      applyLanguageGlobal();
      state.isAppLoaded = true;
      updateNav();
      SmartTextIndex.build(getStudyTopics());
      render('home');
      updateNavActive('home');
      initSearch();
      const loader = $('#loading');
      if(loader) setTimeout(() => loader.classList.add('hidden'), 500);
    }
  
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  
})();
