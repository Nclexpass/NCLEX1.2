// 31_search_service.js — Buscador Integrado con Highlight (Sin botón flotante)
(function() {
  'use strict';

  // Esperar a que la app principal exista
  if (!window.nclexApp && !window.NCLEX) return;

  const SearchService = {
    index: [],
    attempts: 0,
    maxAttempts: 20,
    
    // Referencias al DOM
    searchInput: null,
    resultsContainer: null,
    contentArea: null,

    init() {
      console.log("🔍 Search Service: Iniciando integración...");
      
      // 1. Indexar contenido (reintentar si logic.js no ha cargado)
      this.tryBuildIndex();

      // 2. Conectar a la barra de búsqueda existente en el HTML
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => this.connectUI());
      } else {
          this.connectUI();
      }
    },

    tryBuildIndex() {
      const topics = window.nclexApp && typeof window.nclexApp.getTopics === 'function' 
        ? window.nclexApp.getTopics() 
        : [];
        
      if (topics.length > 0) {
        this.buildIndex(topics);
      } else {
        this.attempts++;
        if (this.attempts < this.maxAttempts) {
          setTimeout(() => this.tryBuildIndex(), 1000);
        }
      }
    },

    buildIndex(topics) {
      this.index = [];
      topics.forEach(topic => {
        if (!topic || !topic.id) return;
        // Normalizar texto para búsqueda insensible a acentos/mayúsculas
        const textES = this.normalize(topic.title?.es + ' ' + (topic.subtitle?.es || ''));
        const textEN = this.normalize(topic.title?.en + ' ' + (topic.subtitle?.en || ''));

        this.index.push({
          id: topic.id,
          searchable: textES + ' | ' + textEN,
          data: topic
        });
      });
      console.log(`✅ Search Index: ${this.index.length} módulos listos.`);
    },

    normalize(str) {
        return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
    },

    connectUI() {
        this.searchInput = document.getElementById('global-search');
        this.resultsContainer = document.getElementById('home-search-results');
        this.contentArea = document.getElementById('app-view');

        if (!this.searchInput || !this.resultsContainer) {
            console.warn("⚠️ No se encontró la barra de búsqueda #global-search");
            return;
        }

        // Evento: Escribir
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.length > 1) {
                this.renderResults(query);
                this.resultsContainer.classList.add('active');
                this.resultsContainer.style.display = 'block';
            } else {
                this.resultsContainer.style.display = 'none';
            }
        });

        // Evento: Clic fuera para cerrar
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.resultsContainer.contains(e.target)) {
                this.resultsContainer.style.display = 'none';
            }
        });

        // Evento: Teclado (Ctrl+K para enfocar)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
    },

    renderResults(query) {
        const normQuery = this.normalize(query);
        const matches = this.index.filter(item => item.searchable.includes(normQuery));
        const isEs = (localStorage.getItem('nclex_lang') || 'es') === 'es';

        if (matches.length === 0) {
            this.resultsContainer.innerHTML = `<div class="p-4 text-center text-gray-400 text-sm">Sin resultados / No results</div>`;
            return;
        }

        let html = '<div class="py-1">';
        matches.forEach(m => {
            const t = m.data;
            const title = isEs ? t.title.es : t.title.en;
            const sub = isEs ? (t.subtitle?.es || '') : (t.subtitle?.en || '');
            
            // Resaltar coincidencia en el título del menú
            const displayTitle = title.replace(new RegExp(`(${query})`, 'gi'), '<span class="text-blue-600 font-extrabold">$1</span>');

            html += `
                <div onclick="window.SearchService.go('${m.id}', '${query}')" 
                     class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex items-center gap-3 border-b border-gray-100 dark:border-white/5 last:border-0">
                    <div class="w-8 h-8 rounded-lg bg-${t.color || 'blue'}-100 dark:bg-${t.color || 'blue'}-900/30 text-${t.color || 'blue'}-600 flex items-center justify-center shrink-0">
                        <i class="fa-solid fa-${t.icon || 'book'} text-sm"></i>
                    </div>
                    <div class="min-w-0">
                        <div class="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">${displayTitle}</div>
                        <div class="text-xs text-gray-500 truncate">${sub}</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        this.resultsContainer.innerHTML = html;
    },

    // Navegar y activar Highlight
    go(topicId, query) {
        // 1. Navegar
        if (window.nclexApp) window.nclexApp.navigate(`topic/${topicId}`);
        
        // 2. Limpiar UI
        this.resultsContainer.style.display = 'none';
        this.searchInput.value = '';

        // 3. Esperar carga y resaltar
        setTimeout(() => {
            this.highlightContent(query);
        }, 600); 
    },

    highlightContent(query) {
        if (!query || !this.contentArea) return;
        
        // Limpiar anteriores
        const marks = this.contentArea.querySelectorAll('mark.highlight-pulse');
        marks.forEach(m => {
            const text = document.createTextNode(m.textContent);
            m.parentNode.replaceChild(text, m);
        });

        // Buscar texto en nodos visibles
        const walker = document.createTreeWalker(this.contentArea, NodeFilter.SHOW_TEXT, null, false);
        const normQuery = this.normalize(query);
        const nodesToMark = [];

        let node;
        while(node = walker.nextNode()) {
            if (node.parentElement.tagName === 'SCRIPT' || node.parentElement.tagName === 'STYLE') continue;
            if (this.normalize(node.nodeValue).includes(normQuery)) {
                nodesToMark.push(node);
            }
        }

        // Aplicar resaltado (solo a la primera coincidencia para no saturar)
        if (nodesToMark.length > 0) {
            const targetNode = nodesToMark[0];
            const span = document.createElement('span');
            const regex = new RegExp(`(${query})`, 'gi');
            span.innerHTML = targetNode.nodeValue.replace(regex, '<mark class="highlight-pulse bg-yellow-300 text-black px-1 rounded shadow-sm">$1</mark>');
            
            targetNode.parentNode.replaceChild(span, targetNode);
            
            // Scroll suave
            setTimeout(() => {
                const mark = document.querySelector('mark.highlight-pulse');
                if(mark) mark.scrollIntoView({behavior: "smooth", block: "center"});
            }, 100);
        }
    }
  };

  window.SearchService = SearchService;
  SearchService.init();

})();
