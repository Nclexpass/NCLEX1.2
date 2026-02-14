// 31_search_service.js — Deep Search Engine (VERSIÓN PROD 3.0)
// SMART SEARCH: Highlight en contenido de módulos
// SIDEBAR SEARCH: Solo navegación a módulos (sin highlight)

(function() {
  'use strict';

  const SearchService = {
    // Índices separados para cada tipo de búsqueda
    modulesIndex: [],      // Para sidebar (solo títulos)
    contentIndex: [],      // Para smart search (contenido completo)
    
    isReady: false,
    attempts: 0,
    maxAttempts: 15,
    
    // Configuración
    config: {
      sidebarMinChars: 2,
      smartMinChars: 3,
      maxResults: 10,
      debounceMs: 150
    },

    // Timers para debounce
    timers: {
      sidebar: null,
      smart: null
    },

    init() {
      console.log("🔍 Search Service: Iniciando...");
      this.tryBuildIndex();
      this.bindUI();
    },

    // ===== CONSTRUCCIÓN DE ÍNDICES =====

    tryBuildIndex() {
      const topics = window.nclexApp && typeof window.nclexApp.getTopics === 'function' 
        ? window.nclexApp.getTopics() : [];
      
      if (topics.length > 0) {
        this.buildIndices(topics);
      } else {
        this.attempts++;
        if (this.attempts < this.maxAttempts) {
          setTimeout(() => this.tryBuildIndex(), 1000);
        }
      }
    },

    getSafeTitle(t, lang) {
      if (!t) return "";
      if (t.title && typeof t.title === 'object') {
        return t.title[lang] || t.title['es'] || t.id || "";
      }
      if (t[`label_${lang}`]) return t[`label_${lang}`];
      return t.name || t.id || "Módulo";
    },

    /**
     * Construye dos índices separados:
     * 1. modulesIndex: Solo títulos para sidebar
     * 2. contentIndex: Contenido completo para smart search
     */
    buildIndices(topics) {
      this.modulesIndex = [];
      this.contentIndex = [];

      topics.forEach(topic => {
        if (!topic || !topic.id) return;
        
        const titleES = this.getSafeTitle(topic, 'es');
        const titleEN = this.getSafeTitle(topic, 'en');

        // ===== ÍNDICE PARA SIDEBAR (solo títulos) =====
        this.modulesIndex.push({
          id: topic.id,
          titleES: titleES.toLowerCase(),
          titleEN: titleEN.toLowerCase(),
          displayTitleES: titleES,
          displayTitleEN: titleEN,
          icon: topic.icon || 'book',
          order: topic.order || 999
        });

        // ===== ÍNDICE PARA SMART SEARCH (contenido completo) =====
        // Extraer texto plano del contenido HTML
        let plainContent = '';
        let rawHtml = '';
        
        if (typeof topic.render === 'function') {
          rawHtml = topic.render();
        } else if (topic.content) {
          rawHtml = topic.content;
        }

        // Crear div temporal para extraer texto
        if (rawHtml) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = rawHtml;
          plainContent = (tempDiv.textContent || tempDiv.innerText || '').toLowerCase();
        }

        this.contentIndex.push({
          id: topic.id,
          titleES: titleES,
          titleEN: titleEN,
          icon: topic.icon || 'book',
          content: plainContent,                    // Texto plano para búsqueda
          rawHtml: rawHtml,                         // HTML original para highlight
          preview: this.generatePreview(plainContent) // Preview para resultados
        });
      });

      this.isReady = true;
      console.log(`✅ Search Service: ${this.modulesIndex.length} módulos indexados`);
    },

    /**
     * Genera un preview del contenido (primeros 150 chars)
     */
    generatePreview(text) {
      if (!text) return '';
      return text.substring(0, 150).trim().replace(/\s+/g, ' ') + '...';
    },

    // ===== BÚSQUEDAS =====

    /**
     * Búsqueda para SIDEBAR: solo coincidencias en títulos
     */
    querySidebar(term) {
      if (!term || term.length < this.config.sidebarMinChars) return [];
      
      const q = term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      return this.modulesIndex
        .filter(item => {
          const targetES = item.titleES.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const targetEN = item.titleEN.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return targetES.includes(q) || targetEN.includes(q);
        })
        .sort((a, b) => {
          // Priorizar coincidencias al inicio del título
          const aStarts = a.titleES.startsWith(q) || a.titleEN.startsWith(q);
          const bStarts = b.titleES.startsWith(q) || b.titleEN.startsWith(q);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.order - b.order;
        })
        .slice(0, this.config.maxResults);
    },

    /**
     * Búsqueda para SMART SEARCH: coincidencias en contenido completo
     */
    querySmart(term) {
      if (!term || term.length < this.config.smartMinChars) return [];
      
      const normalizedTerm = term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const terms = normalizedTerm.split(/\s+/).filter(t => t.length >= 2);
      
      return this.contentIndex
        .map(item => {
          const normalizedContent = item.content.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          
          // Calcular score de relevancia
          let score = 0;
          let matches = [];
          
          // Coincidencia en título (más peso)
          const titleES = item.titleES.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const titleEN = item.titleEN.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          
          if (titleES.includes(normalizedTerm) || titleEN.includes(normalizedTerm)) {
            score += 100;
            matches.push('title');
          }
          
          // Coincidencias en contenido
          terms.forEach(t => {
            const regex = new RegExp(t, 'g');
            const contentMatches = (normalizedContent.match(regex) || []).length;
            score += contentMatches * 10;
            
            if (contentMatches > 0) matches.push('content');
          });
          
          // Encontrar snippet con contexto
          const snippet = this.findSnippetWithContext(item.content, normalizedTerm, terms);
          
          return {
            ...item,
            score,
            matches: [...new Set(matches)],
            snippet: snippet || item.preview
          };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, this.config.maxResults);
    },

    /**
     * Encuentra un snippet del contenido con el término buscado y contexto
     */
    findSnippetWithContext(content, mainTerm, terms) {
      if (!content) return '';
      
      const normalizedContent = content.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const index = normalizedContent.indexOf(mainTerm);
      
      if (index === -1) {
        // Buscar primer término individual
        for (const term of terms) {
          const idx = normalizedContent.indexOf(term);
          if (idx !== -1) {
            const start = Math.max(0, idx - 60);
            const end = Math.min(content.length, idx + term.length + 60);
            return '...' + content.substring(start, end).trim() + '...';
          }
        }
        return '';
      }
      
      const start = Math.max(0, index - 60);
      const end = Math.min(content.length, index + mainTerm.length + 60);
      const prefix = start > 0 ? '...' : '';
      const suffix = end < content.length ? '...' : '';
      
      return prefix + content.substring(start, end).trim() + suffix;
    },

    // ===== HIGHLIGHT EN CONTENIDO =====

    /**
     * Navega a un módulo y aplica highlight a los términos buscados
     */
    navigateWithHighlight(topicId, searchTerm) {
      if (!searchTerm) {
        window.nclexApp.navigate(`topic/${topicId}`);
        return;
      }

      // Guardar término para aplicar highlight después del render
      sessionStorage.setItem('nclex_highlight_term', searchTerm);
      
      // Navegar al módulo
      window.nclexApp.navigate(`topic/${topicId}`);
      
      // Aplicar highlight después de que el DOM se actualice
      setTimeout(() => this.applyHighlightToCurrentPage(searchTerm), 100);
      setTimeout(() => this.applyHighlightToCurrentPage(searchTerm), 300); // Fallback
    },

    /**
     * Aplica highlight amarillo a los términos en la página actual
     */
    applyHighlightToCurrentPage(searchTerm) {
      const term = searchTerm || sessionStorage.getItem('nclex_highlight_term');
      if (!term) return;
      
      // Limpiar highlight anterior
      this.clearHighlight();
      
      const terms = term.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
      if (terms.length === 0) return;
      
      // Crear regex para todos los términos
      const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
      
      // Función recursiva para recorrer nodos de texto
      const highlightNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!regex.test(text)) return;
          
          // Reset regex
          regex.lastIndex = 0;
          
          // Crear span con highlight
          const span = document.createElement('span');
          span.innerHTML = text.replace(regex, '<mark class="nclex-highlight" style="background: linear-gradient(120deg, #fef08a 0%, #fde047 100%); color: #1f2937; padding: 0 2px; border-radius: 2px; font-weight: 600;">$1</mark>');
          
          // Reemplazar nodo
          if (span.childNodes.length > 0) {
            const fragment = document.createDocumentFragment();
            while (span.firstChild) {
              fragment.appendChild(span.firstChild);
            }
            node.parentNode.replaceChild(fragment, node);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Ignorar ciertos elementos
          if (['SCRIPT', 'STYLE', 'MARK', 'INPUT', 'TEXTAREA'].includes(node.tagName)) return;
          
          // Recursión en hijos (copia estática para evitar problemas con modificaciones)
          Array.from(node.childNodes).forEach(highlightNode);
        }
      };
      
      // Aplicar al contenido principal
      const appView = document.getElementById('app-view');
      if (appView) {
        highlightNode(appView);
        
        // Scroll al primer highlight
        const firstHighlight = appView.querySelector('.nclex-highlight');
        if (firstHighlight) {
          firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      
      // Mostrar indicador de highlight
      this.showHighlightIndicator(term);
    },

    /**
     * Limpia todos los highlights de la página
     */
    clearHighlight() {
      const marks = document.querySelectorAll('.nclex-highlight');
      marks.forEach(mark => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize(); // Fusionar nodos de texto adyacentes
      });
      
      // Remover indicador
      const indicator = document.getElementById('nclex-highlight-indicator');
      if (indicator) indicator.remove();
    },

    /**
     * Muestra un indicador flotante con el término resaltado
     */
    showHighlightIndicator(term) {
      // Remover anterior si existe
      const existing = document.getElementById('nclex-highlight-indicator');
      if (existing) existing.remove();
      
      const indicator = document.createElement('div');
      indicator.id = 'nclex-highlight-indicator';
      indicator.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: highlightIndicatorIn 0.3s ease;
        ">
          <i class="fa-solid fa-highlighter"></i>
          <span>Highlight: "${term.substring(0, 30)}${term.length > 30 ? '...' : ''}"</span>
          <button onclick="window.SmartSearchEngine.clearHighlight()" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            margin-left: 4px;
          ">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <style>
          @keyframes highlightIndicatorIn {
            from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        </style>
      `;
      
      document.body.appendChild(indicator);
      
      // Auto-remover después de 5 segundos
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.style.opacity = '0';
          indicator.style.transform = 'translateX(-50%) translateY(-10px)';
          setTimeout(() => indicator.remove(), 300);
        }
      }, 5000);
    },

    // ===== UI INTEGRATION =====

    bindUI() {
      // 1. SIDEBAR SEARCH (solo títulos, sin highlight)
      const sidebarInput = document.getElementById('global-search');
      if (sidebarInput) {
        sidebarInput.addEventListener('input', (e) => {
          clearTimeout(this.timers.sidebar);
          this.timers.sidebar = setTimeout(() => {
            this.handleSidebarSearch(e.target.value);
          }, this.config.debounceMs);
        });
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
          const results = document.getElementById('sidebar-search-results');
          if (results && !sidebarInput.contains(e.target) && !results.contains(e.target)) {
            results.classList.remove('active');
            results.innerHTML = '';
          }
        });
      }

      // 2. SMART SEARCH (contenido completo, con highlight)
      document.addEventListener('input', (e) => {
        if (e.target.id === 'home-search') {
          clearTimeout(this.timers.smart);
          this.timers.smart = setTimeout(() => {
            this.handleSmartSearch(e.target.value);
          }, this.config.debounceMs);
        }
      });

      // 3. Navegación desde resultados
      document.addEventListener('click', (e) => {
        // Sidebar result (sin highlight)
        const sidebarResult = e.target.closest('[data-sidebar-result]');
        if (sidebarResult) {
          const topicId = sidebarResult.dataset.sidebarResult;
          this.clearHighlight();
          sessionStorage.removeItem('nclex_highlight_term');
          window.nclexApp.navigate(`topic/${topicId}`);
          this.clearSidebarResults();
          return;
        }
        
        // Smart result (con highlight)
        const smartResult = e.target.closest('[data-smart-result]');
        if (smartResult) {
          const topicId = smartResult.dataset.smartResult;
          const searchTerm = smartResult.dataset.searchTerm;
          this.clearSmartResults();
          this.navigateWithHighlight(topicId, searchTerm);
          return;
        }
      });

      // 4. Aplicar highlight al cargar página (si venimos de búsqueda)
      window.addEventListener('routechange', () => {
        const savedTerm = sessionStorage.getItem('nclex_highlight_term');
        if (savedTerm) {
          setTimeout(() => this.applyHighlightToCurrentPage(savedTerm), 100);
        }
      });
    },

    clearSidebarResults() {
      const input = document.getElementById('global-search');
      const results = document.getElementById('sidebar-search-results');
      if (input) input.value = '';
      if (results) {
        results.classList.remove('active');
        results.innerHTML = '';
      }
    },

    clearSmartResults() {
      const input = document.getElementById('home-search');
      const results = document.getElementById('home-search-results');
      if (input) input.value = '';
      if (results) {
        results.classList.remove('active');
        results.innerHTML = '';
      }
    },

    // ===== RENDER RESULTADOS =====

    handleSidebarSearch(term) {
      const container = document.getElementById('sidebar-search-results');
      if (!container) return;

      if (!term || term.length < this.config.sidebarMinChars) {
        container.classList.remove('active');
        container.innerHTML = '';
        return;
      }

      const results = this.querySidebar(term);
      
      if (results.length === 0) {
        container.innerHTML = `
          <div class="p-4 text-center text-[var(--brand-text-muted)] text-sm">
            ${this.getLang() === 'es' ? 'No se encontraron módulos' : 'No modules found'}
          </div>
        `;
        container.classList.add('active');
        return;
      }

      const isEs = this.getLang() === 'es';
      
      container.innerHTML = results.map(item => `
        <div data-sidebar-result="${item.id}" 
             class="p-3 border-b border-[var(--brand-border)] hover:bg-[rgba(var(--brand-blue-rgb),0.05)] cursor-pointer transition flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[rgba(var(--brand-blue-rgb),0.1)] flex items-center justify-center flex-shrink-0"
               style="color: rgb(var(--brand-blue-rgb));">
            <i class="fa-solid fa-${item.icon} text-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-sm text-[var(--brand-text)] truncate">
              ${isEs ? item.displayTitleES : item.displayTitleEN}
            </div>
          </div>
          <i class="fa-solid fa-chevron-right text-xs text-[var(--brand-text-muted)]"></i>
        </div>
      `).join('');
      
      container.classList.add('active');
    },

    handleSmartSearch(term) {
      const container = document.getElementById('home-search-results');
      if (!container) return;

      if (!term || term.length < this.config.smartMinChars) {
        container.classList.remove('active');
        container.innerHTML = '';
        return;
      }

      const results = this.querySmart(term);
      
      if (results.length === 0) {
        container.innerHTML = `
          <div class="p-6 text-center text-[var(--brand-text-muted)]">
            <i class="fa-solid fa-search text-2xl mb-2 opacity-50"></i>
            <p class="text-sm">${this.getLang() === 'es' ? 'No se encontraron resultados en el contenido' : 'No results found in content'}</p>
          </div>
        `;
        container.classList.add('active');
        return;
      }

      const isEs = this.getLang() === 'es';
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const highlightRegex = new RegExp(`(${escapedTerm.split(/\s+/).filter(t => t.length >= 2).join('|')})`, 'gi');

      container.innerHTML = results.map(item => {
        const title = isEs ? item.titleES : item.titleEN;
        const highlightedTitle = title.replace(highlightRegex, '<mark class="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded font-semibold">$1</mark>');
        const highlightedSnippet = item.snippet.replace(highlightRegex, '<mark class="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded">$1</mark>');
        
        const matchBadges = item.matches.map(m => {
          if (m === 'title') return `<span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">Título</span>`;
          if (m === 'content') return `<span class="text-[10px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium">Contenido</span>`;
          return '';
        }).join('');

        return `
          <div data-smart-result="${item.id}" data-search-term="${term.replace(/"/g, '&quot;')}"
               class="p-4 border-b border-[var(--brand-border)] hover:bg-[rgba(var(--brand-blue-rgb),0.05)] cursor-pointer transition">
            <div class="flex items-start gap-3 mb-2">
              <div class="w-10 h-10 rounded-xl bg-[rgba(var(--brand-blue-rgb),0.1)] flex items-center justify-center flex-shrink-0"
                   style="color: rgb(var(--brand-blue-rgb));">
                <i class="fa-solid fa-${item.icon}"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-[var(--brand-text)] mb-1">${highlightedTitle}</div>
                <div class="flex gap-1 mb-2">${matchBadges}</div>
              </div>
            </div>
            <div class="text-sm text-[var(--brand-text-muted)] leading-relaxed pl-13 ml-[52px]">
              ${highlightedSnippet}
            </div>
            <div class="mt-2 text-xs text-[var(--brand-blue-rgb)] font-medium flex items-center gap-1 ml-[52px]">
              <i class="fa-solid fa-highlighter"></i>
              ${isEs ? 'Click para ver con resaltado' : 'Click to view with highlight'}
            </div>
          </div>
        `;
      }).join('');
      
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

  // ===== EXPOSICIÓN GLOBAL =====
  window.SmartSearchEngine = SearchService;
  
  // Inicializar
  SearchService.init();

})();