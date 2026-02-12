// 31_search_service.js — Deep Search Engine (FULL UI INTEGRATION)
(function() {
  'use strict';

  const SearchService = {
    index: [],
    isReady: false,
    attempts: 0,
    maxAttempts: 15,

    init() {
      console.log("🔍 Smart Search: Iniciando cerebro...");
      this.tryBuildIndex();
      this.bindUI(); // Vincula eventos de búsqueda
    },

    tryBuildIndex() {
      const topics = window.nclexApp && typeof window.nclexApp.getTopics === 'function' 
        ? window.nclexApp.getTopics() : [];
      if (topics.length > 0) {
        this.buildIndex(topics);
      } else {
        this.attempts++;
        if (this.attempts < this.maxAttempts) setTimeout(() => this.tryBuildIndex(), 1000);
      }
    },

    getSafeTitle(t, lang) {
      if (!t) return "";
      if (t.title && typeof t.title === 'object') return t.title[lang] || t.title['es'] || "";
      if (t[`label_${lang}`]) return t[`label_${lang}`];
      return t.name || t.id || "Módulo";
    },

    buildIndex(topics) {
      this.index = [];
      topics.forEach(topic => {
        if (!topic || !topic.id) return;
        
        const titleES = this.getSafeTitle(topic, 'es');
        const titleEN = this.getSafeTitle(topic, 'en');

        const div = document.createElement('div');
        div.innerHTML = (typeof topic.render === 'function' ? topic.render() : topic.content) || '';
        const rawContent = div.textContent || div.innerText || '';

        this.index.push({
          id: topic.id,
          fullSearchText: (titleES + ' ' + titleEN + ' ' + rawContent).toLowerCase(),
          titleES, titleEN,
          icon: topic.icon || 'book',
          preview: rawContent.substring(0, 80).trim() + '...'
        });
      });
      this.isReady = true;
      console.log(`✅ Smart Search: ${this.index.length} módulos indexados con éxito.`);
    },

    query(term) {
      if (!term || term.length < 2) return [];
      const q = term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return this.index.filter(item => {
          const target = item.fullSearchText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return target.includes(q);
      });
    },

    // ========== NUEVAS FUNCIONES DE UI ==========

    bindUI() {
      // 1. Sidebar search (estático)
      const sidebarInput = document.getElementById('global-search');
      if (sidebarInput) {
        sidebarInput.addEventListener('input', (e) => {
          this.handleSearch(e.target.value, 'sidebar-search-results');
        });
        // Cerrar resultados al hacer clic fuera (opcional)
        document.addEventListener('click', (e) => {
          const results = document.getElementById('sidebar-search-results');
          if (results && !sidebarInput.contains(e.target) && !results.contains(e.target)) {
            results.classList.remove('active');
            results.innerHTML = '';
          }
        });
      }

      // 2. Home search (dinámico, usamos delegación)
      document.addEventListener('input', (e) => {
        if (e.target.id === 'home-search') {
          this.handleSearch(e.target.value, 'home-search-results');
        }
      });

      // También delegación para clicks en resultados (navegación)
      document.addEventListener('click', (e) => {
        const resultItem = e.target.closest('[data-search-result-id]');
        if (resultItem) {
          const topicId = resultItem.dataset.searchResultId;
          if (topicId && window.nclexApp) {
            window.nclexApp.navigate(`topic/${topicId}`);
            // Ocultar contenedor de resultados
            const container = resultItem.closest('[id$="search-results"]');
            if (container) {
              container.classList.remove('active');
              container.innerHTML = '';
            }
            // Opcional: limpiar input
            const input = document.getElementById('home-search') || document.getElementById('global-search');
            if (input) input.value = '';
          }
        }
      });
    },

    handleSearch(term, containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;

      if (!term || term.length < 2) {
        container.classList.remove('active');
        container.innerHTML = '';
        return;
      }

      const results = this.query(term);
      if (results.length === 0) {
        container.innerHTML = `<div class="p-4 text-center text-gray-500 dark:text-gray-400">${this.getLang() === 'es' ? 'No se encontraron resultados' : 'No results found'}</div>`;
        container.classList.add('active');
        return;
      }

      // Renderizar resultados
      const isEs = this.getLang() === 'es';
      const itemsHtml = results.map(item => {
        const title = isEs ? item.titleES : item.titleEN;
        return `
          <div data-search-result-id="${item.id}" class="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue flex-shrink-0">
              <i class="fa-solid fa-${item.icon} text-sm"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-bold text-sm text-gray-900 dark:text-white truncate">${title}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate">${item.preview}</div>
            </div>
          </div>
        `;
      }).join('');

      container.innerHTML = itemsHtml;
      container.classList.add('active');
    },

    getLang() {
      try {
        return localStorage.getItem('nclex_lang') || 'es';
      } catch {
        return 'es';
      }
    }
  };

  window.SmartSearchEngine = SearchService;
  SearchService.init();
})();