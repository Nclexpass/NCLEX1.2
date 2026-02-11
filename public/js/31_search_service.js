// 31_search_service.js — Motor de Búsqueda Inteligente (Integrado en Barra Superior)
// VERSIÓN: Conecta la barra "bruta" con el cerebro del buscador flotante + Highlight

(function() {
  'use strict';

  // Esperamos a que la app principal exponga su API
  if (!window.nclexApp && !window.NCLEX) return;

  const SearchService = {
    index: [],
    attempts: 0,
    maxAttempts: 20, // Más intentos por si acaso
    searchContainer: null,
    searchInput: null,
    resultsContainer: null,

    init() {
      console.log("🔍 Search Service: Conectando al cerebro...");
      
      // 1. Intentar indexar el contenido
      this.tryBuildIndex();

      // 2. Esperar a que el DOM esté listo para conectar la barra existente
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => this.connectToExistingUI());
      } else {
          this.connectToExistingUI();
      }
    },

    // LÓGICA DE REINTENTO (Indexación)
    tryBuildIndex() {
      const topics = window.nclexApp && typeof window.nclexApp.getTopics === 'function' 
        ? window.nclexApp.getTopics() 
        : [];
        
      if (topics.length > 0) {
        this.buildIndex(topics);
        console.log(`✅ Search Service: ${this.index.length} módulos indexados.`);
      } else {
        this.attempts++;
        if (this.attempts < this.maxAttempts) {
          setTimeout(() => this.tryBuildIndex(), 1000); // Reintentar cada segundo
        }
      }
    },

    buildIndex(topics) {
      this.index = [];
      topics.forEach(topic => {
        if (!topic || !topic.id) return;
        
        // Texto plano para buscar (sin tildes, minúsculas)
        const textES = this.normalizeText(topic.title?.es + ' ' + (topic.subtitle?.es || ''));
        const textEN = this.normalizeText(topic.title?.en + ' ' + (topic.subtitle?.en || ''));

        this.index.push({
          id: topic.id,
          // Guardamos texto normalizado para buscar
          searchableText: textES + ' | ' + textEN, 
          // Guardamos objetos originales para mostrar
          title: topic.title,
          subtitle: topic.subtitle,
          icon: topic.icon,
          color: topic.color
        });
      });
    },

    normalizeText(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    },

    // CONEXIÓN CON TU BARRA DE BÚSQUEDA EXISTENTE
    connectToExistingUI() {
        // Buscamos el input que ya existe en tu HTML (el del centro)
        // En tu HTML anterior tenía el ID "global-search"
        this.searchInput = document.getElementById('global-search');
        this.resultsContainer = document.getElementById('home-search-results');

        if (!this.searchInput || !this.resultsContainer) {
            console.warn("⚠️ Search Service: No encontré la barra de búsqueda '#global-search'. Reintentando en 1s...");
            setTimeout(() => this.connectToExistingUI(), 1000);
            return;
        }

        console.log("🚀 Search Service: Barra de búsqueda conectada exitosamente.");

        // Eventos
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.length > 1) {
                this.renderResults(query);
                this.resultsContainer.classList.add('active'); // Mostrar lista
                this.resultsContainer.style.display = 'block';
            } else {
                this.resultsContainer.style.display = 'none';
            }
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.resultsContainer.contains(e.target)) {
                this.resultsContainer.style.display = 'none';
            }
        });
        
        // Enfocar input con atajo de teclado (Ctrl + K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
    },

    renderResults(query) {
        const normalizedQuery = this.normalizeText(query);
        const matches = this.index.filter(item => item.searchableText.includes(normalizedQuery));
        const currentLang = localStorage.getItem('nclex_lang') || 'es';
        const isEs = currentLang === 'es';

        if (matches.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="p-4 text-center text-gray-500 text-sm">
                    ${isEs ? 'No se encontraron resultados' : 'No results found'}
                </div>`;
            return;
        }

        let html = '<div class="py-2">';
        matches.forEach(match => {
            // Decidir qué idioma mostrar en el título
            const title = isEs ? match.title.es : match.title.en;
            const subtitle = isEs ? (match.subtitle?.es || '') : (match.subtitle?.en || '');
            
            // Resaltar la palabra coincidente en el título (Highlight)
            const highlightedTitle = this.highlightText(title, query);

            html += `
                <div onclick="window.SearchService.navigateTo('${match.id}', '${query}')" 
                     class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex items-center gap-3 border-b border-gray-100 dark:border-white/5 last:border-0 transition-colors">
                    
                    <div class="w-8 h-8 rounded-lg bg-${match.color || 'blue'}-100 dark:bg-${match.color || 'blue'}-900/30 text-${match.color || 'blue'}-600 dark:text-${match.color || 'blue'}-400 flex items-center justify-center shrink-0">
                        <i class="fa-solid fa-${match.icon || 'book'} text-sm"></i>
                    </div>
                    
                    <div>
                        <div class="font-bold text-sm text-gray-800 dark:text-gray-200">
                            ${highlightedTitle}
                        </div>
                        <div class="text-xs text-gray-500 truncate max-w-[200px]">
                            ${subtitle}
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        this.resultsContainer.innerHTML = html;
    },

    // Función auxiliar para resaltar texto en los resultados de la lista
    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 text-gray-900 px-0.5 rounded">$1</span>');
    },

    // FUNCIÓN PÚBLICA: Navegar y Resaltar en el Contenido
    navigateTo(topicId, query) {
        // 1. Navegar al tema
        if (window.nclexApp && window.nclexApp.navigate) {
            window.nclexApp.navigate(`topic/${topicId}`);
        }

        // 2. Cerrar resultados
        this.resultsContainer.style.display = 'none';
        this.searchInput.value = ''; // Limpiar input

        // 3. Esperar a que cargue el contenido y luego resaltar
        setTimeout(() => {
            this.highlightInContent(query);
        }, 800); // 800ms de espera para asegurar que el contenido cargó
    },

    // EL CEREBRO DEL HIGHLIGHT: Busca en el contenido HTML y marca las palabras
    highlightInContent(query) {
        if (!query) return;

        const contentArea = document.getElementById('app-view'); // El área donde se carga el contenido
        if (!contentArea) return;

        // Limpiar resaltados anteriores si los hay
        this.removeHighlights();

        // Usamos una librería ligera nativa o Mark.js si estuviera, pero haremos una implementación vanilla robusta
        const walker = document.createTreeWalker(contentArea, NodeFilter.SHOW_TEXT, null, false);
        const nodesToReplace = [];
        const regex = new RegExp(this.normalizeText(query), 'gi');

        let node;
        while (node = walker.nextNode()) {
            // Ignorar scripts y estilos
            if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') continue;

            const text = this.normalizeText(node.nodeValue);
            if (text.includes(this.normalizeText(query))) {
                nodesToReplace.push(node);
            }
        }

        // Reemplazar nodos de texto con spans resaltados
        // Nota: Esto es básico, para un highlight perfecto en HTML complejo se suele usar librerías como Mark.js, 
        // pero esto funcionará para títulos y párrafos simples.
        let firstMatch = null;

        nodesToReplace.forEach(node => {
            const span = document.createElement('span');
            const originalText = node.nodeValue;
            
            // Truco: Reemplazamos conservando mayúsculas/minúsculas originales visualmente
            // Es complejo hacerlo perfecto con Regex simple sin perder formato, 
            // así que simplemente marcaremos el nodo contenedor por ahora para no romper HTML.
            
            const parent = node.parentNode;
            if (parent) {
                // Añadir clase de highlight temporal
                // parent.style.backgroundColor = '#fef08a'; // Amarillo suave
                // parent.style.transition = 'background-color 0.5s';
                
                // Método más agresivo: innerHTML replace (Cuidado con eventos)
                const newHTML = parent.innerHTML.replace(
                    new RegExp(`(${query})`, 'gi'), 
                    '<mark class="bg-yellow-300 text-black px-1 rounded animate-pulse">$1</mark>'
                );
                
                try {
                    parent.innerHTML = newHTML;
                    if (!firstMatch) firstMatch = parent;
                } catch(e) {}
            }
        });

        // 4. Scroll hasta la primera coincidencia
        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Quitar highlight después de 5 segundos
            setTimeout(() => this.removeHighlights(), 5000);
        } else {
            console.log("No se encontraron coincidencias exactas en el texto visible.");
        }
    },

    removeHighlights() {
        const marks = document.querySelectorAll('mark');
        marks.forEach(mark => {
            // Reemplazar la etiqueta mark por su contenido de texto
            const parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize(); // Unir nodos de texto adyacentes
        });
    }
  };

  // Exponer al objeto global para poder llamarlo desde el HTML
  window.SearchService = SearchService;
  
  // Iniciar
  SearchService.init();

})();
