// search_service.js — Buscador PRO: Fuzzy Search, Scoring, Cache & High Performance
(function() {
  'use strict';

  // Configuración
  const CONFIG = {
    minQueryLength: 2,
    maxResults: 15, // Optimizado para pantallas de laptop
    highlightDelay: 500, // Un poco más de tiempo para asegurar que la vista cargó
    debounceTime: 300,
    maxIndexAttempts: 20,
    indexRetryDelay: 800
  };

  class SearchService {
    constructor() {
      this.index = [];
      this.isIndexed = false;
      this.attempts = 0;
      this.lastQuery = '';
      
      // Referencias al DOM
      this.searchInput = null;
      this.resultsContainer = null;
      this.searchWrapper = null;
      
      // Cache y Timers
      this.resultsCache = new Map();
      this.debounceTimer = null;
      
      // Stats para depuración
      this.stats = { searches: 0, navigations: 0 };
    }

    init() {
      console.log('🔍 Search Service PRO: Inicializando...');
      
      // Intentar conectar a la App principal
      this.checkAppReady();
    }

    checkAppReady() {
      const app = window.nclexApp || window.NCLEX;
      if (app) {
        this.buildIndex(app);
        this.connectUI();
        this.setupGlobalListeners(app);
        window.SearchService = this; // Exponer API
      } else {
        // Si la app no está lista, reintentar
        setTimeout(() => this.checkAppReady(), 500);
      }
    }

    // 1. CONSTRUCCIÓN DEL ÍNDICE (CEREBRO)
    async buildIndex(app) {
      if (this.isIndexed) return;
      
      const topics = typeof app.getTopics === 'function' ? app.getTopics() : [];
      
      if (!topics || topics.length === 0) {
        this.attempts++;
        if (this.attempts < CONFIG.maxIndexAttempts) {
          setTimeout(() => this.buildIndex(app), CONFIG.indexRetryDelay);
          return;
        }
        return;
      }
      
      console.log(`📚 Search Indexer: Procesando ${topics.length} módulos.`);
      
      this.index = topics
        .filter(topic => topic && topic.id && topic.title)
        .map(topic => {
          // Normalizamos todo el texto para búsquedas "insensibles"
          const textES = this.normalizeText(topic.title?.es + ' ' + (topic.subtitle?.es || ''));
          const textEN = this.normalizeText(topic.title?.en + ' ' + (topic.subtitle?.en || ''));
          
          return {
            id: topic.id,
            // Creamos un string gigante con todo lo buscable
            searchable: `${textES} ${textEN}`,
            original: {
              titleES: topic.title?.es || '',
              titleEN: topic.title?.en || '',
              subtitleES: topic.subtitle?.es || '',
              subtitleEN: topic.subtitle?.en || '',
              icon: topic.icon || 'book',
              color: topic.color || 'blue',
              category: topic.category || 'General'
            },
            lastAccessed: 0 // Para dar puntos extra si ya lo visitaste
          };
        });
      
      this.isIndexed = true;
    }

    normalizeText(str) {
      if (!str) return '';
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    // 2. CONEXIÓN VISUAL
    connectUI() {
      // Intentamos conectar con los elementos existentes del HTML
      this.searchInput = document.getElementById('global-search');
      this.resultsContainer = document.getElementById('home-search-results');
      this.searchWrapper = this.searchInput?.closest('.relative') || this.searchInput?.parentNode;
      
      if (!this.searchInput || !this.resultsContainer) {
        // Reintento silencioso si el DOM aun no pinta la barra
        setTimeout(() => this.connectUI(), 1000);
        return;
      }
      
      this.setupInputEvents();
      
      // Estilos forzados para asegurar que se vea bien
      Object.assign(this.resultsContainer.style, {
        width: '100%',
        minWidth: '320px',
        maxWidth: '500px', // Evitar que sea gigante
        borderRadius: '0 0 12px 12px'
      });
    }

    setupInputEvents() {
      // Debounce: Espera a que dejes de escribir para buscar
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(this.debounceTimer);
        const query = e.target.value;
        
        if (query.length === 0) this.hideResults();
        
        this.debounceTimer = setTimeout(() => {
          this.handleSearch(query);
        }, CONFIG.debounceTime);
      });
      
      // Tecla Escape limpia
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.clearSearch();
          this.searchInput.blur();
        }
      });
      
      // Al hacer click en el input, si hay texto, mostrar resultados de nuevo
      this.searchInput.addEventListener('click', () => {
        if (this.searchInput.value.length >= CONFIG.minQueryLength) {
            this.showResults();
        }
      });
    }

    setupGlobalListeners(app) {
      // Cerrar al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (this.searchWrapper && !this.searchWrapper.contains(e.target)) {
          this.hideResults();
        }
      });
      
      // Atajos de teclado (Flechas y Enter)
      document.addEventListener('keydown', (e) => {
        // Ctrl + K para enfocar
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          this.focusSearch();
        }
        
        // Navegación en resultados
        if (this.resultsContainer && this.resultsContainer.style.display === 'block') {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateResults(e.key === 'ArrowDown' ? 1 : -1);
          }
          if (e.key === 'Enter') {
            e.preventDefault();
            this.selectActiveResult(app);
          }
        }
      });
    }

    // 3. LÓGICA DE BÚSQUEDA (SCORING)
    handleSearch(query) {
      if (!this.isIndexed) return;
      
      query = query.trim();
      this.lastQuery = query;
      
      if (query.length < CONFIG.minQueryLength) {
        this.hideResults();
        return;
      }
      
      // Cache check
      const lang = localStorage.getItem('nclex_lang') || 'es';
      const cacheKey = `${query}_${lang}`;
      if (this.resultsCache.has(cacheKey)) {
        this.renderResults(this.resultsCache.get(cacheKey));
        return;
      }
      
      // Algoritmo de Scoring
      const normQuery = this.normalizeText(query);
      const queryWords = normQuery.split(' ').filter(w => w.length > 0);
      
      const results = this.index
        .map(item => {
          let score = 0;
          
          queryWords.forEach(word => {
            // 10 puntos si encuentra la palabra en cualquier lado
            if (item.searchable.includes(word)) score += 10;
            
            // 5 puntos EXTRA si está en el título (más relevante)
            const title = lang === 'es' ? item.original.titleES : item.original.titleEN;
            if (this.normalizeText(title).includes(word)) score += 5;
            
            // 20 puntos si es coincidencia exacta
            if (this.normalizeText(title) === word) score += 20;
          });
          
          // 2 puntos extra si lo visitaste hoy (Historial reciente)
          if (Date.now() - item.lastAccessed < 86400000 && item.lastAccessed > 0) {
            score += 2;
          }
          
          return { ...item, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score) // Ordenar por puntuación
        .slice(0, CONFIG.maxResults); // Top resultados
        
      this.resultsCache.set(cacheKey, results);
      this.renderResults(results);
    }

    // 4. RENDERIZADO
    renderResults(results) {
      if (!results || results.length === 0) {
        this.renderNoResults();
        return;
      }
      
      const isEs = (localStorage.getItem('nclex_lang') || 'es') === 'es';
      
      let html = `<div class="py-2">`;
      
      results.forEach((result, index) => {
        const title = isEs ? result.original.titleES : result.original.titleEN;
        const subtitle = isEs ? result.original.subtitleES : result.original.subtitleEN;
        
        // Highlight seguro
        const hlTitle = this.safeHighlight(title, this.lastQuery);
        
        html += `
          <div class="search-result-item ${index === 0 ? 'active' : ''} cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
               data-id="${result.id}"
               onclick="window.SearchService.navigateToResult('${result.id}')"
               onmouseover="window.SearchService.setActiveResult(${index})">
            <div class="px-4 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
              <div class="w-9 h-9 rounded-lg bg-${result.original.color}-100 dark:bg-${result.original.color}-900/40 text-${result.original.color}-600 dark:text-${result.original.color}-400 flex items-center justify-center shrink-0 shadow-sm">
                <i class="fa-solid fa-${result.original.icon} text-sm"></i>
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-bold text-sm text-gray-800 dark:text-gray-100 mb-0.5 leading-tight">${hlTitle}</div>
                <div class="text-xs text-gray-500 truncate">${subtitle}</div>
              </div>
              <i class="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
            </div>
          </div>
        `;
      });
      
      html += `
        <div class="px-4 py-1.5 text-[10px] text-gray-400 bg-gray-50 dark:bg-black/20 flex justify-between items-center rounded-b-lg">
           <span>Select: ↵ Enter</span>
           <span>Navigate: ↓ ↑</span>
        </div></div>`;
      
      this.resultsContainer.innerHTML = html;
      this.showResults();
    }

    // Método seguro para resaltar sin romper HTML
    safeHighlight(text, query) {
        if (!query) return text;
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.replace(regex, '<span class="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-0.5 rounded font-bold">$1</span>');
    }

    renderNoResults() {
      const isEs = (localStorage.getItem('nclex_lang') || 'es') === 'es';
      this.resultsContainer.innerHTML = `
        <div class="p-8 text-center">
          <i class="fa-solid fa-magnifying-glass text-gray-300 text-3xl mb-3 block"></i>
          <p class="text-gray-500 text-sm font-medium">
            ${isEs ? 'No encontramos coincidencias' : 'No matches found'}
          </p>
        </div>
      `;
      this.showResults();
    }

    // 5. NAVEGACIÓN Y ACCIONES
    navigateToResult(topicId) {
      // Marcar como visitado para el scoring futuro
      const item = this.index.find(i => i.id === topicId);
      if (item) item.lastAccessed = Date.now();
      
      const app = window.nclexApp || window.NCLEX;
      if (app && typeof app.navigate === 'function') {
        app.navigate(`topic/${topicId}`);
      }
      
      this.hideResults();
      this.searchInput.value = '';
      this.searchInput.blur();
      
      // Esperar a que cargue y resaltar contenido
      setTimeout(() => {
        this.highlightAllContent(this.lastQuery);
      }, CONFIG.highlightDelay);
    }

    // Highlight en el contenido (TreeWalker - Método Robusto)
    highlightAllContent(query) {
      const contentArea = document.getElementById('app-view') || document.body;
      if (!query || !contentArea) return;
      
      // Limpiar highlights previos
      this.clearHighlights();
      
      const walker = document.createTreeWalker(
        contentArea,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            // Ignorar scripts, estilos y elementos ocultos
            const parent = node.parentElement;
            if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
            if (parent.offsetParent === null) return NodeFilter.FILTER_REJECT; 
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      
      const normQuery = this.normalizeText(query);
      const matchingNodes = [];
      let node;
      
      // Fase 1: Encontrar nodos
      while (node = walker.nextNode()) {
        if (this.normalizeText(node.nodeValue).includes(normQuery)) {
          matchingNodes.push(node);
        }
      }
      
      // Fase 2: Resaltar (Usando mark)
      let firstHighlight = null;
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      
      matchingNodes.forEach(textNode => {
        const span = document.createElement('span');
        span.innerHTML = textNode.nodeValue.replace(regex, '<mark class="bg-yellow-300 text-black px-1 rounded shadow-sm animate-pulse search-highlight">$1</mark>');
        textNode.parentNode.replaceChild(span, textNode);
        if (!firstHighlight) firstHighlight = span;
      });
      
      // Fase 3: Scroll al primero
      if (firstHighlight) {
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Quitar la animación después de 3 segundos
        setTimeout(() => {
            document.querySelectorAll('mark.search-highlight').forEach(el => {
                el.classList.remove('animate-pulse');
                // Opcional: Quitar el highlight completamente después de 5s
                // setTimeout(() => this.clearHighlights(), 5000); 
            });
        }, 3000);
      }
    }

    clearHighlights() {
      // Eliminar <mark> y restaurar texto original
      document.querySelectorAll('.search-highlight').forEach(mark => {
         const parent = mark.parentNode; // El span wrapper
         if (parent) {
             parent.replaceWith(parent.textContent);
         }
      });
    }

    // Helpers UI
    showResults() {
      this.resultsContainer.style.display = 'block';
      this.resultsContainer.classList.remove('hidden');
    }
    
    hideResults() {
      this.resultsContainer.style.display = 'none';
      this.resultsContainer.classList.add('hidden');
    }
    
    clearSearch() {
      this.searchInput.value = '';
      this.hideResults();
      this.clearHighlights();
    }
    
    focusSearch() {
      this.searchInput.focus();
    }
    
    // Helpers Navegación Teclado
    navigateResults(direction) {
      const items = this.resultsContainer.querySelectorAll('.search-result-item');
      if (items.length === 0) return;
      
      const current = this.resultsContainer.querySelector('.active');
      let index = Array.from(items).indexOf(current);
      
      // Calcular nuevo índice circular
      if (index === -1 && direction > 0) index = 0;
      else if (index === -1 && direction < 0) index = items.length - 1;
      else {
          index = (index + direction + items.length) % items.length;
      }
      
      this.setActiveResult(index);
      items[index].scrollIntoView({ block: 'nearest' });
    }
    
    setActiveResult(index) {
        const items = this.resultsContainer.querySelectorAll('.search-result-item');
        items.forEach(el => el.classList.remove('active', 'bg-gray-50', 'dark:bg-white/5'));
        if (items[index]) {
            items[index].classList.add('active', 'bg-gray-50', 'dark:bg-white/5');
        }
    }
    
    selectActiveResult(app) {
        const active = this.resultsContainer.querySelector('.active');
        if (active) this.navigateToResult(active.dataset.id);
    }
  }

  // Inicialización Segura
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => new SearchService().init());
  } else {
      new SearchService().init();
  }

})();
