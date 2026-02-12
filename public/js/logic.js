/* logic.js — Core navigation + Search + Progress + NGN INTEGRATION + SKINS + ICONOS ORIGINALES */

(function () {
    'use strict';
  
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
    const colorMap = {
        blue:   { bg: 'bg-blue-500',   text: 'text-blue-500',   grad: 'from-blue-500 to-blue-600',   light: 'bg-blue-100',   dark: 'dark:bg-blue-900/30' },
        purple: { bg: 'bg-purple-500', text: 'text-purple-500', grad: 'from-purple-500 to-purple-600', light: 'bg-purple-100', dark: 'dark:bg-purple-900/30' },
        green:  { bg: 'bg-green-500',  text: 'text-green-500',  grad: 'from-green-500 to-green-600',  light: 'bg-green-100',  dark: 'dark:bg-green-900/30' },
        red:    { bg: 'bg-red-500',    text: 'text-red-500',    grad: 'from-red-500 to-red-600',    light: 'bg-red-100',    dark: 'dark:bg-red-900/30' },
        orange: { bg: 'bg-orange-500', text: 'text-orange-500', grad: 'from-orange-500 to-orange-600', light: 'bg-orange-100', dark: 'dark:bg-orange-900/30' },
        teal:   { bg: 'bg-teal-500',   text: 'text-teal-500',   grad: 'from-teal-500 to-teal-600',   light: 'bg-teal-100',   dark: 'dark:bg-teal-900/30' },
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', grad: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-100', dark: 'dark:bg-indigo-900/30' },
        yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', grad: 'from-yellow-400 to-yellow-600', light: 'bg-yellow-100', dark: 'dark:bg-yellow-900/30' },
        gray:   { bg: 'bg-gray-500',   text: 'text-gray-500',   grad: 'from-gray-500 to-gray-600',   light: 'bg-gray-100',   dark: 'dark:bg-gray-800/50' }
    };

    const getColor = (colorName) => colorMap[colorName] || colorMap['blue'];
  
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
      topics: [],
      currentRoute: 'home',
      currentLang: savedLang,
      currentTheme: savedTheme,
      completedTopics: savedProgress,
      isAppLoaded: false,
      updateTimer: null,
      scrollPositions: {} 
    };
  
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

    window.NCLEX = {
      registerTopic(topic) {
        if (!topic || !topic.id) return;
        const idx = state.topics.findIndex(t => t.id === topic.id);
        if (idx >= 0) state.topics[idx] = topic;
        else state.topics.push(topic);

        state.topics.sort((a, b) => (parseInt(a.order || 999) - parseInt(b.order || 999)));
        
        if (state.updateTimer) clearTimeout(state.updateTimer);
        state.updateTimer = setTimeout(() => {
            if (state.isAppLoaded) {
                updateNav();
                if (window.SmartSearchEngine) {
                    window.SmartSearchEngine.buildIndex(state.topics);
                }
                if (state.currentRoute === 'home') render('home');
            }
        }, 100);
      }
    };
  
    window.nclexApp = {
      navigate(route) {
        const main = $('#main-content');
        if (main) state.scrollPositions[state.currentRoute] = main.scrollTop;
        state.currentRoute = route;
        render(route);
        updateNavActive(route);
        if(main) main.scrollTop = (route === 'home' ? (state.scrollPositions['home'] || 0) : 0);
        
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
        }, 50);
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
      },
      
      toggleTopicComplete(topicId) {
          const index = state.completedTopics.indexOf(topicId);
          if (index > -1) state.completedTopics.splice(index, 1);
          else state.completedTopics.push(topicId);
          localStorage.setItem('nclex_progress', JSON.stringify(state.completedTopics));
          render(state.currentRoute);
          updateNav();
      },

      getTopics() { return state.topics; }
    };
  
    // ========== RENDER HOME ==========
    function renderHome() {
      const total = state.topics.length;
      const completed = state.completedTopics.length;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  
      return `
        <header class="mb-8 animate-slide-in">
          <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">NCLEX Masterclass OS</h1>
          <p class="text-gray-500 text-lg"><span class="lang-es">Tu éxito empieza hoy.</span><span class="lang-en hidden-lang">Your success starts today.</span></p>
        </header>

        <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg mb-10">
           <div class="flex justify-between items-end mb-2">
             <div>
                 <h2 class="text-xl font-bold text-slate-900 dark:text-white"><span class="lang-es">Progreso Global</span><span class="lang-en hidden-lang">Overall Progress</span></h2>
                 <p class="text-sm text-gray-500">${completed} / ${total} modules</p>
             </div>
             <span class="text-3xl font-black text-brand-blue">${percent}%</span>
           </div>
           <div class="w-full h-4 bg-gray-100 dark:bg-black/40 rounded-full overflow-hidden">
             <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000" style="width: ${percent}%"></div>
           </div>
        </div>

        <!-- SMART SEARCH (HOME) -->
        <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg mb-10">
          <h2 class="text-xl font-bold mb-4"><i class="fa-solid fa-search mr-2 text-brand-blue"></i> Smart Search</h2>
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" id="home-search" class="w-full bg-gray-50 dark:bg-black/30 border-2 border-gray-100 dark:border-brand-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-blue text-slate-900 dark:text-white" placeholder="Search medical terms, diagnoses, drugs...">
          </div>
          <div id="home-search-results" class="mt-3 w-full bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-lg shadow-lg max-h-96 overflow-y-auto no-scrollbar hidden"></div>
        </div>

        <!-- GRID DE ACCESO RÁPIDO -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
           <div onclick="window.nclexApp.navigate('simulator')" class="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-3xl text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-transform">
                <h2 class="text-xl font-black mb-1"><i class="fa-solid fa-brain mr-2"></i> Simulator</h2>
                <p class="text-sm opacity-90">Adaptive practice (SATA + Options)</p>
           </div>
           <div onclick="window.nclexApp.navigate('ngn-sepsis')" class="bg-gradient-to-br from-rose-500 to-orange-600 p-6 rounded-3xl text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-transform">
                <h2 class="text-xl font-black mb-1"><i class="fa-solid fa-notes-medical mr-2"></i> NGN Case: Sepsis</h2>
                <p class="text-sm opacity-90">Next Gen Case Study Demo</p>
           </div>
           <div onclick="window.nclexApp.navigate('skins')" class="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-3xl text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-transform">
                <h2 class="text-xl font-black mb-1">
                    <i class="fa-solid fa-palette mr-2"></i>
                    <span class="lang-es">Apariencia</span>
                    <span class="lang-en hidden-lang">Appearance</span>
                </h2>
                <p class="text-sm opacity-90">
                    <span class="lang-es">5 skins • Colores personalizados</span>
                    <span class="lang-en hidden-lang">5 skins • Custom colors</span>
                </p>
           </div>
           <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg flex flex-col justify-center">
             <h2 class="text-xl font-bold mb-1"><i class="fa-solid fa-layer-group text-brand-blue mr-2"></i> Library</h2>
             <span class="text-4xl font-black">${total} <span class="text-gray-500 text-sm">Topics</span></span>
           </div>
        </div>

        <!-- MÓDULOS (temas) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${state.topics.map(t => {
            const isComplete = state.completedTopics.includes(t.id);
            const colors = getColor(t.color);
            return `
              <div onclick="window.nclexApp.navigate('topic/${t.id}')" class="bg-white dark:bg-brand-card p-6 rounded-2xl shadow-lg border ${isComplete ? 'border-green-500' : 'border-gray-200 dark:border-brand-border'} hover:-translate-y-1 transition-all cursor-pointer group">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-12 h-12 bg-gradient-to-br ${colors.grad} rounded-xl flex items-center justify-center text-white shadow-md">
                    <i class="fa-solid fa-${normalizeFaIcon(t.icon)} text-xl"></i>
                  </div>
                  <div class="flex gap-1">${getClinicalBadges(t)}</div>
                </div>
                <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-white truncate">${getBilingualTitle(t)}</h3>
                <div class="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full ${colors.bg} w-0 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  
    // ========== RENDER ==========
    function render(route) {
      const view = $('#app-view');
      if (!view) return;
      view.style.opacity = '0';
      
      setTimeout(() => {
          if (route === 'home') {
              view.innerHTML = renderHome();
          }
          else if (route.startsWith('topic/')) {
              const topic = state.topics.find(t => t.id === route.split('/')[1]);
              if (topic) view.innerHTML = `<div class="animate-fade-in">${typeof topic.render === 'function' ? topic.render() : topic.content}</div>`;
              else view.innerHTML = "<div class='p-10 text-center'>Module not found</div>";
          }
          else if (route === 'simulator' && window.renderSimulatorPage) {
              view.innerHTML = window.renderSimulatorPage();
          }
          else if (route === 'ngn-sepsis' && window.renderNGNCase) {
              view.innerHTML = window.renderNGNCase('sepsis');
          }
          else if (route === 'skins' && window.SkinSystem) {
              view.innerHTML = window.SkinSystem.renderSkinSelector();
          }

          applyLanguageGlobal();
          view.style.opacity = '1';
      }, 100);
    }
  
    // ========== UPDATE NAV (CON COLORES ORIGINALES RESTAURADOS) ==========
    function updateNav() {
      const nav = $('#topics-nav');
      if (!nav) return;
      nav.innerHTML = state.topics.map(t => {
        const colors = getColor(t.color);
        return `
          <button onclick="window.nclexApp.navigate('topic/${t.id}')" data-route="topic/${t.id}" class="nav-btn w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-500 dark:text-gray-400">
            <div class="w-6 flex justify-center">
              <i class="fa-solid fa-${normalizeFaIcon(t.icon)} ${colors.text}"></i> <!-- 🟢 COLOR ORIGINAL DEL TEMA -->
            </div>
            <span class="hidden lg:block text-sm font-bold truncate">${getBilingualTitle(t)}</span>
          </button>
        `;
      }).join('');
    }
  
    function updateNavActive(route) {
      $$('.nav-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-route') === route;
        btn.classList.toggle('bg-brand-blue/10', isActive);
        btn.classList.toggle('text-brand-blue', isActive);
      });
    }

    function applyLanguageGlobal() {
      const isEs = state.currentLang === 'es';
      $$('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      $$('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
    }
  
    function applyTheme() {
      document.documentElement.classList.toggle('dark', state.currentTheme === 'dark');
    }
  
    function init() {
      applyTheme();
      state.isAppLoaded = true;
      updateNav();
      render('home');
      updateNavActive('home');
      const loader = $('#loading');
      if(loader) setTimeout(() => loader.classList.add('hidden'), 500);
    }
  
    // 🟢 ACTUALIZAR EL SIDEBAR CUANDO CAMBIA LA SKIN (solo fondos, no colores de iconos)
    window.addEventListener('skinchange', function() {
        if (state.isAppLoaded) {
            updateNavActive(state.currentRoute);
        }
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();