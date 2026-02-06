// 33_library.js — NCLEX Library Ultimate (Bilingual + Hybrid Architecture) - VERSIÓN OPTIMIZADA
// 🌐 Soporte: Español/Inglés (Detección Automática y Dinámica)
// 💎 Efectos: 3D Tilt Real + Glassmorphism
// 🛡️ Motor: Lector Nativo (Predeterminado) + PDF.js (Motor de Respaldo)
// 🎨 Arte: Portadas con Estetoscopio + Generación Procedural
// ⚡ Optimizado: Memoria, Rendimiento, UX

(function () {
  'use strict';
  
  // Esperar a que el sistema base cargue
  if (!window.NCLEX) {
    setTimeout(initLibrary, 1000); 
    return;
  } else {
    initLibrary();
  }

  function initLibrary() {
    // --- CONFIGURACIÓN MAESTRA OPTIMIZADA ---
    const CONFIG = {
      repo: 'Nclexpass/NCLEX1.2', 
      tag: 'BOOKS',
      
      // ⚠️ RECOMENDACIÓN PRO: Dejar usePDFJS en false para GitHub Releases.
      // El lector nativo es más rápido y no tiene problemas de CORS con GitHub.
      usePDFJS: false,
      
      pdfJsCDN: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
      pdfJsWorker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
      maxPDFSize: 50 * 1024 * 1024, // 50MB máximo para PDF.js (archivos más grandes usarán nativo)
      
      coverImages: {
        'nclex-book-1.pdf': 'https://raw.githubusercontent.com/Nclexpass/NCLEX1.2/main/covers/book1.jpg',
      },
      
      defaultCoverColors: [
        ['from-indigo-500 via-purple-500 to-pink-500', 'text-indigo-100', 'shadow-indigo-500/50'],
        ['from-emerald-400 via-teal-500 to-cyan-600', 'text-teal-100', 'shadow-teal-500/50'],
        ['from-orange-400 via-red-500 to-rose-600', 'text-orange-100', 'shadow-orange-500/50'],
        ['from-blue-400 via-blue-600 to-indigo-800', 'text-blue-100', 'shadow-blue-500/50'],
        ['from-slate-600 via-slate-700 to-slate-900', 'text-gray-300', 'shadow-gray-500/50']
      ],
      
      cache: {
        enabled: true,
        ttl: 5 * 60 * 1000, // 5 minutos
        key: 'nclex_library_cache'
      }
    };

    // --- DICCIONARIO DE TRADUCCIONES ---
    const TRANSLATIONS = {
      es: {
        libraryTitle: "Biblioteca NCLEX",
        librarySubtitle: "Libros • Descarga Directa",
        loadingBooks: "Cargando biblioteca...",
        bookCount: "${count} Libros Disponibles",
        help: "Ayuda",
        reload: "Recargar",
        download: "Descargar",
        newTab: "Pestaña Nueva",
        close: "Cerrar",
        loadingPDF: "CARGANDO DOCUMENTO...",
        usingPDFJS: "RENDERIZANDO VISOR...",
        nativeReader: "Lector Nativo",
        previewUnavailable: "Vista previa no disponible",
        browserNotSupported: "Tu navegador prefiere descargar archivos grandes.",
        connectionError: "Error de Conexión",
        noBooks: "No hay libros disponibles",
        verifyBooks: "Verifica el Release 'BOOKS' en GitHub",
        retryConnection: "Reintentar",
        openNewTab: "Abrir en Pestaña",
        downloadNow: "Descargar Ahora",
        page: "Página",
        of: "de",
        loading: "Cargando...",
        errorLoading: "Error al cargar",
        fileTooLarge: "Archivo muy grande, usando lector nativo",
        clearCache: "Limpiar caché",
        cacheCleared: "Caché limpiado"
      },
      en: {
        libraryTitle: "NCLEX Library",
        librarySubtitle: "Books • Direct Download",
        loadingBooks: "Loading library...",
        bookCount: "${count} Books Available",
        help: "Help",
        reload: "Reload",
        download: "Download",
        newTab: "New Tab",
        close: "Close",
        loadingPDF: "LOADING DOCUMENT...",
        usingPDFJS: "RENDERING VIEWER...",
        nativeReader: "Native Reader",
        previewUnavailable: "Preview unavailable",
        browserNotSupported: "Your browser prefers downloading large files.",
        connectionError: "Connection Error",
        noBooks: "No books available",
        verifyBooks: "Check 'BOOKS' Release on GitHub",
        retryConnection: "Retry",
        openNewTab: "Open in Tab",
        downloadNow: "Download Now",
        page: "Page",
        of: "of",
        loading: "Loading...",
        errorLoading: "Error loading",
        fileTooLarge: "File too large, using native reader",
        clearCache: "Clear cache",
        cacheCleared: "Cache cleared"
      }
    };

    const LibraryUI = {
      items: [],
      loading: true,
      error: false,
      modalOpen: false,
      currentLang: 'es',
      observer: null,
      pdfDoc: null,
      pageNum: 1,
      pdfRendering: false,
      pendingPage: null,
      cacheTimer: null,
      
      // --- SISTEMA DE CACHÉ MEJORADO ---
      getCachedData() {
        if (!CONFIG.cache.enabled) return null;
        
        try {
          const cached = localStorage.getItem(CONFIG.cache.key);
          if (!cached) return null;
          
          const data = JSON.parse(cached);
          const now = Date.now();
          
          if (now - data.timestamp > CONFIG.cache.ttl) {
            localStorage.removeItem(CONFIG.cache.key);
            return null;
          }
          
          return data.items;
        } catch (e) {
          console.warn('Error reading cache:', e);
          return null;
        }
      },
      
      setCache(items) {
        if (!CONFIG.cache.enabled) return;
        
        try {
          const cacheData = {
            items: items,
            timestamp: Date.now()
          };
          localStorage.setItem(CONFIG.cache.key, JSON.stringify(cacheData));
        } catch (e) {
          console.warn('Error setting cache:', e);
        }
      },
      
      clearCache() {
        localStorage.removeItem(CONFIG.cache.key);
        this.showNotification(`✅ ${this.t('cacheCleared')}`);
      },

      // --- SISTEMA DE IDIOMAS OPTIMIZADO ---
      initLanguageObserver() {
        if ('MutationObserver' in window) {
          this.observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
              if (mutation.attributeName === 'data-lang' || mutation.attributeName === 'lang') {
                const newLang = document.documentElement.getAttribute('lang') || 
                               document.body.getAttribute('data-lang') || 'es';
                if (newLang !== this.currentLang) {
                  this.currentLang = newLang;
                  this.updateLanguage();
                }
                break;
              }
            }
          });
          
          this.observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['lang'] 
          });
          
          this.observer.observe(document.body, { 
            attributes: true, 
            attributeFilter: ['data-lang'] 
          });
        }
        
        this.detectInitialLanguage();
      },

      detectInitialLanguage() {
        const detected = document.documentElement.getAttribute('lang') || 
                        document.body.getAttribute('data-lang') || 
                        (navigator.language || 'es').substring(0, 2);
        this.currentLang = ['es', 'en'].includes(detected) ? detected : 'es';
      },

      t(key, variables = {}) {
        let translation = TRANSLATIONS[this.currentLang]?.[key] || 
                         TRANSLATIONS.es[key] || 
                         key;
        
        return translation.replace(/\${(\w+)}/g, (_, varName) => 
          variables[varName] || ''
        );
      },

      updateLanguage() {
        if (window.NCLEX && window.NCLEX.updateTopicTitle) {
          window.NCLEX.updateTopicTitle('library', {
            title: { 
              es: TRANSLATIONS.es.libraryTitle, 
              en: TRANSLATIONS.en.libraryTitle 
            },
            subtitle: { 
              es: TRANSLATIONS.es.librarySubtitle, 
              en: TRANSLATIONS.en.librarySubtitle 
            }
          });
        }
        
        if (!this.loading && !this.modalOpen) {
          this.render();
        }
      },

      // --- INICIALIZACIÓN OPTIMIZADA CON CACHÉ ---
      async init() {
        if (this.modalOpen) return;
        
        if (!this.observer) {
          this.initLanguageObserver();
        }
        
        this.renderSkeleton();
        
        // Intentar cargar desde caché primero
        const cachedItems = this.getCachedData();
        if (cachedItems && cachedItems.length > 0) {
          this.items = cachedItems;
          this.loading = false;
          this.render();
          
          // Cargar datos frescos en segundo plano
          setTimeout(() => this.loadFreshData(), 100);
        } else {
          await this.loadFreshData();
        }
      },

      async loadFreshData() {
        try {
          console.log(`📚 ${this.t('loadingBooks')}`);
          const apiUrl = `https://api.github.com/repos/${CONFIG.repo}/releases/tags/${CONFIG.tag}`;
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);
          
          const res = await fetch(apiUrl, { signal: controller.signal });
          clearTimeout(timeoutId);
          
          if (!res.ok) {
            throw new Error(`${this.t('connectionError')}: ${res.status}`);
          }

          const data = await res.json();
          
          this.items = (data.assets || [])
            .filter(a => {
              const name = a.name.toLowerCase();
              return name.endsWith('.pdf') || name.endsWith('.epub');
            })
            .map(a => {
              const size = parseInt(a.size);
              const shouldUsePDFJS = CONFIG.usePDFJS && size <= CONFIG.maxPDFSize;
              
              return {
                id: String(a.id),
                title: this.formatTitle(a.name),
                filename: a.name,
                url: a.browser_download_url,
                download_count: a.download_count || 0,
                size: this.formatFileSize(size),
                rawSize: size,
                date: new Date(a.created_at).toLocaleDateString(),
                fileType: a.name.toLowerCase().endsWith('.epub') ? 'EPUB' : 'PDF',
                coverUrl: CONFIG.coverImages[a.name] || null,
                usePDFJS: shouldUsePDFJS
              };
            });

          // Ordenar por popularidad
          this.items.sort((a, b) => b.download_count - a.download_count);
          
          // Guardar en caché
          this.setCache(this.items);
          
          console.log(`✅ ${this.items.length} Libros cargados`);

        } catch (e) {
          console.error("Error cargando datos:", e);
          this.error = e.name === 'AbortError' ? 
            `${this.t('connectionError')}: Timeout` : 
            e.message;
        } finally {
          this.loading = false;
          this.render();
        }
      },

      // --- UTILIDADES OPTIMIZADAS ---
      formatTitle(filename) {
        return filename
          .replace(/[_-]/g, ' ')
          .replace(/\.(pdf|epub)$/i, '')
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
      },

      formatFileSize(bytes) {
        if (bytes === 0 || isNaN(bytes)) return '0 B';
        const k = 1024;
        const sizes = this.currentLang === 'es' 
          ? ['B', 'KB', 'MB', 'GB'] 
          : ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
      },

      escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      },

      // --- RENDERIZADO VISUAL OPTIMIZADO ---
      getCover(item, index) {
        if (item.coverUrl) {
          return `
            <div class="absolute inset-0 overflow-hidden rounded-r-xl rounded-l-md bg-gray-800">
              <img src="${item.coverUrl}" 
                   alt="${this.escapeHtml(item.title)}" 
                   class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   loading="lazy"
                   onerror="this.style.display='none'; this.parentElement.innerHTML = window.NCLEX_LIBRARY.getGeneratedCover('${this.escapeHtml(item.title)}', ${index});">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4 z-10">
                <h3 class="font-serif font-black text-white text-lg drop-shadow-lg line-clamp-3">${this.escapeHtml(item.title)}</h3>
              </div>
            </div>`;
        }
        return this.getGeneratedCover(item.title, index);
      },

      getGeneratedCover(title, index) {
        let hash = 0;
        for (let i = 0; i < title.length; i++) {
          hash = title.charCodeAt(i) + ((hash << 5) - hash);
        }
        const theme = CONFIG.defaultCoverColors[Math.abs(hash) % CONFIG.defaultCoverColors.length];
        const [grad] = theme;

        return `
          <div class="absolute inset-0 bg-gradient-to-br ${grad} p-6 flex flex-col justify-between overflow-hidden rounded-r-xl rounded-l-md">
            <div class="absolute inset-0 opacity-20 pattern-dots-white"></div>
            <i class="fa-solid fa-book-medical absolute -right-8 -bottom-8 text-[8rem] text-white opacity-10 rotate-12 blur-[2px]"></i>
            <div class="relative z-10">
              <div class="w-8 h-1 bg-white/50 mb-4 rounded-full backdrop-blur-md"></div>
              <h3 class="font-serif font-black text-white text-xl leading-tight tracking-wide drop-shadow-lg line-clamp-4">${this.escapeHtml(title)}</h3>
            </div>
            <div class="relative z-10 flex items-center justify-between border-t border-white/20 pt-3 mt-2">
              <div class="flex items-center gap-1.5 opacity-90">
                <i class="fa-solid fa-stethoscope text-white text-sm"></i>
                <span class="text-[9px] font-bold text-white tracking-[0.2em] uppercase">NCLEX</span>
              </div>
              <div class="px-2 py-0.5 bg-black/20 rounded text-[9px] font-bold text-white backdrop-blur">
                ${this.items[index]?.fileType || 'PDF'}
              </div>
            </div>
          </div>`;
      },

      // --- SISTEMA DE DESCARGA OPTIMIZADO ---
      async downloadBook(item, event) {
        if (event) event.stopPropagation();
        
        const button = event?.currentTarget;
        const originalHTML = button?.innerHTML || '';
        const originalText = button?.textContent || '';
        
        if (button) {
          button.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i>';
          button.disabled = true;
          button.classList.add('opacity-50');
        }

        try {
          // Usar fetch para mejor manejo de errores
          const response = await fetch(item.url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = item.filename;
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Liberar memoria
          setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          
          this.showNotification(`✅ ${this.t('download')}: ${item.title}`);
          
          // Actualizar contador visualmente
          const downloadCount = document.querySelector(`[data-book-id="${item.id}"] .download-count`);
          if (downloadCount) {
            const current = parseInt(downloadCount.textContent) || 0;
            downloadCount.textContent = current + 1;
          }
          
        } catch (error) {
          console.error('Error en descarga:', error);
          // Fallback al método directo
          const link = document.createElement('a');
          link.href = item.url;
          link.download = item.filename;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          this.showNotification(`📥 ${this.t('downloadNow')}: ${item.title}`);
        } finally {
          if (button) {
            setTimeout(() => {
              button.innerHTML = originalHTML;
              button.disabled = false;
              button.classList.remove('opacity-50');
            }, 1500);
          }
        }
      },

      // --- LECTOR HÍBRIDO OPTIMIZADO ---
      async openReader(item) {
        if (this.modalOpen) return;
        this.modalOpen = true;
        
        // Prevenir clics múltiples
        document.body.style.pointerEvents = 'none';
        setTimeout(() => {
          document.body.style.pointerEvents = 'auto';
        }, 500);
        
        const modal = document.createElement('div');
        modal.className = "fixed inset-0 z-[100] flex flex-col animate-fade-in library-modal";
        modal.innerHTML = this.getModalHTML(item);
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        document.getElementById('close-modal').onclick = () => this.closeModal(modal);
        
        // Decidir estrategia basada en tamaño y configuración
        const usePDFJS = item.usePDFJS && CONFIG.usePDFJS;
        
        if (usePDFJS && !window.pdfjsLib) {
          try {
            await this.loadPDFJS();
            this.renderWithPDFJS(item, modal);
          } catch (error) {
            console.warn('PDF.js falló, usando nativo:', error);
            this.loadNativePDF(item, modal);
          }
        } else if (usePDFJS && window.pdfjsLib) {
          this.renderWithPDFJS(item, modal);
        } else {
          this.loadNativePDF(item, modal);
        }
      },

      getModalHTML(item) {
        const safeTitle = this.escapeHtml(item.title);
        const usePDFJS = item.usePDFJS && CONFIG.usePDFJS;
        const readerType = usePDFJS ? 'PDF.js' : this.t('nativeReader');
        
        return `
          <div class="absolute inset-0 bg-slate-900/95 backdrop-blur-xl"></div>
          <div class="relative z-10 flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 shadow-2xl">
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
                <i class="fa-solid fa-book-open text-white text-sm"></i>
              </div>
              <div class="min-w-0">
                <h2 class="text-white font-bold text-sm truncate" title="${safeTitle}">${safeTitle}</h2>
                <p class="text-white/40 text-[10px] uppercase font-bold">
                  ${item.size} • ${readerType}
                  ${item.rawSize > CONFIG.maxPDFSize ? ' • 📁' : ''}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="window.NCLEX_LIBRARY.downloadBook(${JSON.stringify(item).replace(/"/g, '&quot;').replace(/'/g, '&#x27;')}, event)" 
                      class="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all">
                <i class="fa-solid fa-download"></i> 
                <span class="hidden sm:inline">${this.t('download')}</span>
              </button>
              
              <a href="${item.url}" target="_blank" 
                 class="px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all">
                <i class="fa-solid fa-external-link-alt"></i> 
                <span class="hidden sm:inline">${this.t('newTab')}</span>
              </a>
              
              <button id="close-modal" 
                      class="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/30 text-white hover:text-red-300 flex items-center justify-center transition-all"
                      title="${this.t('close')}">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="relative z-10 flex-1 w-full bg-gray-900 overflow-hidden flex flex-col" id="pdf-container">
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-4" id="loading-indicator">
              <div class="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
              <span class="text-xs font-bold tracking-[0.3em] animate-pulse">${this.t('loadingPDF')}</span>
            </div>
          </div>
        `;
      },

      // ESTRATEGIA 1: Lector Nativo (Optimizado)
      loadNativePDF(item, modal) {
        const container = modal.querySelector('#pdf-container');
        const loading = modal.querySelector('#loading-indicator');
        
        // Si el archivo es muy grande, mostrar advertencia
        if (item.rawSize > CONFIG.maxPDFSize) {
          loading.querySelector('span').textContent = this.t('fileTooLarge');
        }
        
        const objectHTML = `
          <object data="${item.url}#toolbar=0&navpanes=0" 
                  type="application/pdf" 
                  class="w-full h-full relative z-20"
                  onload="this.style.opacity='1'; document.getElementById('loading-indicator').style.display='none';"
                  style="opacity:0; transition: opacity 0.3s ease-in;">
            <div class="fallback-content">
              ${this.getFallbackContent(item)}
            </div>
          </object>
        `;
        
        container.insertAdjacentHTML('beforeend', objectHTML);
        
        // Fallback después de 10 segundos
        setTimeout(() => {
          if (loading && loading.style.display !== 'none') {
            container.innerHTML = this.getFallbackContent(item, true);
          }
        }, 10000);
      },

      getFallbackContent(item, showButtons = true) {
        return `
          <div class="flex flex-col items-center justify-center h-full text-center p-8 gap-6">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-2xl">
              <i class="fa-regular fa-file-pdf text-3xl text-gray-500"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white mb-2">${this.t('previewUnavailable')}</h3>
              <p class="text-gray-400 max-w-md text-sm">${this.t('browserNotSupported')}</p>
            </div>
            ${showButtons ? `
            <div class="flex flex-col sm:flex-row gap-3 mt-4">
              <a href="${item.url}" target="_blank" 
                 class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                <i class="fa-solid fa-external-link-alt"></i> ${this.t('openNewTab')}
              </a>
              <button onclick="window.NCLEX_LIBRARY.downloadBook(${JSON.stringify(item).replace(/"/g, '&quot;').replace(/'/g, '&#x27;')}, event)" 
                      class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                <i class="fa-solid fa-download"></i> ${this.t('downloadNow')}
              </button>
            </div>
            ` : ''}
          </div>
        `;
      },

      // ESTRATEGIA 2: PDF.js (Optimizado para memoria)
      async loadPDFJS() {
        return new Promise((resolve, reject) => {
          if (window.pdfjsLib) {
            resolve();
            return;
          }
          
          const script = document.createElement('script');
          script.src = CONFIG.pdfJsCDN;
          script.onload = () => {
            if (window.pdfjsLib) {
              pdfjsLib.GlobalWorkerOptions.workerSrc = CONFIG.pdfJsWorker;
              resolve();
            } else {
              reject(new Error('PDF.js no se cargó correctamente'));
            }
          };
          script.onerror = () => reject(new Error('Error cargando PDF.js'));
          document.head.appendChild(script);
        });
      },

      async renderWithPDFJS(item, modal) {
        const container = modal.querySelector('#pdf-container');
        const loading = modal.querySelector('#loading-indicator');
        
        try {
          loading.querySelector('span').textContent = this.t('usingPDFJS');
          
          const loadingTask = pdfjsLib.getDocument(item.url);
          this.pdfDoc = await loadingTask.promise;
          
          if (this.pdfDoc.numPages === 0) {
            throw new Error('PDF vacío');
          }
          
          this.pageNum = 1;
          
          container.innerHTML = `
            <div class="flex-1 overflow-auto bg-gray-900 relative" id="pdf-viewer-container">
              <div class="sticky top-0 z-50 bg-black/50 backdrop-blur px-4 py-2 flex items-center justify-between border-b border-white/10">
                <div class="flex items-center gap-4 text-white">
                  <button id="prev-page" class="p-2 hover:bg-white/10 rounded transition-colors disabled:opacity-30" title="${this.t('page')} ${this.pageNum - 1}">
                    <i class="fa-solid fa-chevron-left"></i>
                  </button>
                  <span class="text-sm font-bold min-w-[80px] text-center">
                    <span id="page-num">${this.pageNum}</span> / <span id="page-count">${this.pdfDoc.numPages}</span>
                  </span>
                  <button id="next-page" class="p-2 hover:bg-white/10 rounded transition-colors" title="${this.t('page')} ${this.pageNum + 1}">
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
                <div class="text-xs text-gray-400">
                  ${this.t('page')} <span id="current-page">${this.pageNum}</span> ${this.t('of')} ${this.pdfDoc.numPages}
                </div>
              </div>
              <div class="p-4 flex justify-center">
                <canvas id="pdf-canvas" class="shadow-2xl max-w-full"></canvas>
              </div>
            </div>
          `;
          
          // Configurar eventos
          document.getElementById('prev-page').onclick = () => this.changePage(-1);
          document.getElementById('next-page').onclick = () => this.changePage(1);
          
          // Renderizar primera página
          await this.renderPDFPage(this.pageNum);
          
          // Ocultar loading
          loading.style.display = 'none';
          
        } catch (error) {
          console.error('Error PDF.js:', error);
          loading.style.display = 'none';
          container.innerHTML = this.getFallbackContent(item, true);
        }
      },

      async renderPDFPage(num) {
        if (this.pdfRendering || !this.pdfDoc || num < 1 || num > this.pdfDoc.numPages) {
          return;
        }
        
        this.pdfRendering = true;
        this.pageNum = num;
        
        const canvas = document.getElementById('pdf-canvas');
        if (!canvas) {
          this.pdfRendering = false;
          return;
        }
        
        const container = document.getElementById('pdf-viewer-container');
        const page = await this.pdfDoc.getPage(num);
        
        // Calcular escala óptima
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = container ? container.clientWidth - 80 : 800;
        const scale = Math.min(containerWidth / viewport.width, 2.0);
        const scaledViewport = page.getViewport({ scale });
        
        // Preparar canvas
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;
        
        const context = canvas.getContext('2d', { alpha: false });
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport
        };
        
        // Limpiar canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        await page.render(renderContext).promise;
        
        // Actualizar UI
        document.getElementById('page-num').textContent = num;
        document.getElementById('current-page').textContent = num;
        
        // Habilitar/deshabilitar botones
        document.getElementById('prev-page').disabled = num <= 1;
        document.getElementById('next-page').disabled = num >= this.pdfDoc.numPages;
        
        this.pdfRendering = false;
        
        // Procesar página pendiente si existe
        if (this.pendingPage !== null) {
          const nextPage = this.pendingPage;
          this.pendingPage = null;
          await this.renderPDFPage(nextPage);
        }
      },

      changePage(delta) {
        const newPage = this.pageNum + delta;
        
        if (newPage < 1 || newPage > this.pdfDoc.numPages) {
          return;
        }
        
        if (this.pdfRendering) {
          this.pendingPage = newPage;
        } else {
          this.renderPDFPage(newPage);
        }
      },

      closeModal(modal) {
        if (!modal) return;
        
        this.modalOpen = false;
        
        // Limpiar recursos de PDF.js
        if (this.pdfDoc) {
          this.pdfDoc.destroy();
          this.pdfDoc = null;
        }
        
        this.pdfRendering = false;
        this.pendingPage = null;
        this.pageNum = 1;
        
        // Animación de salida
        modal.classList.add('opacity-0', 'scale-95');
        
        setTimeout(() => {
          if (modal.parentNode) {
            modal.remove();
          }
          document.body.style.overflow = '';
          document.body.style.pointerEvents = 'auto';
        }, 300);
      },

      // --- SISTEMA DE NOTIFICACIONES OPTIMIZADO ---
      showNotification(message) {
        // Remover notificaciones anteriores
        document.querySelectorAll('.library-notification').forEach(el => {
          el.classList.add('opacity-0', 'translate-x-full');
          setTimeout(() => el.remove(), 300);
        });
        
        const notification = document.createElement('div');
        notification.className = 'library-notification fixed top-6 right-6 z-[101] px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-2xl animate-slide-in-right flex items-center gap-3';
        notification.innerHTML = `
          <i class="fa-solid fa-circle-check"></i>
          <span class="text-sm font-bold">${this.escapeHtml(message)}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.classList.add('opacity-0', 'translate-x-full');
          setTimeout(() => {
            if (notification.parentNode) {
              notification.remove();
            }
          }, 300);
        }, 3000);
      },

      // --- RENDERIZADO DE INTERFAZ ---
      renderSkeleton() {
        const view = document.getElementById('app-view');
        if (!view) return;
        view.innerHTML = this.getShell();
      },

      getShell() {
        const itemCount = this.items.length || '...';
        
        return `
          <div class="animate-fade-in pb-24 px-4 md:px-8 min-h-screen">
            <div class="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 mt-8 gap-6">
              <div>
                <h1 class="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-sm">
                  ${this.t('libraryTitle')}
                </h1>
                <div class="flex items-center gap-3 mt-3">
                  <span class="relative flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <p class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-[0.25em]">
                    ${this.t('bookCount', { count: itemCount })}
                  </p>
                </div>
              </div>
              <div class="flex gap-3">
                <button onclick="window.NCLEX_LIBRARY.showHelp()" 
                        class="group px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div class="flex items-center gap-3">
                    <i class="fa-solid fa-circle-info text-gray-400 group-hover:text-blue-400"></i>
                    <span class="text-xs font-bold text-gray-300 group-hover:text-white uppercase tracking-widest">
                      ${this.t('help')}
                    </span>
                  </div>
                </button>
                <button onclick="window.NCLEX_LIBRARY.init()" 
                        class="group px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 border border-blue-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div class="flex items-center gap-3">
                    <i class="fa-solid fa-rotate text-white group-hover:rotate-180 transition-all duration-700"></i>
                    <span class="text-xs font-bold text-white uppercase tracking-widest">
                      ${this.t('reload')}
                    </span>
                  </div>
                </button>
              </div>
            </div>
            ${this.loading ? this.getSkeletonHTML() : this.getGridHTML()}
          </div>`;
      },

      getGridHTML() {
        if (this.error) {
          return `
            <div class="p-10 rounded-3xl bg-gradient-to-br from-red-900/10 to-red-900/5 border border-red-500/20 text-center backdrop-blur-sm">
              <i class="fa-solid fa-triangle-exclamation text-4xl text-red-400 mb-4"></i>
              <h3 class="text-lg font-bold text-red-300">${this.t('connectionError')}</h3>
              <p class="text-sm text-red-400/70 mt-2">${this.escapeHtml(this.error)}</p>
              <div class="flex justify-center gap-3 mt-6">
                <button onclick="window.NCLEX_LIBRARY.init()" 
                        class="px-6 py-2 rounded-full bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors">
                  <span class="text-sm font-bold text-red-300">${this.t('retryConnection')}</span>
                </button>
                <button onclick="window.NCLEX_LIBRARY.clearCache()" 
                        class="px-6 py-2 rounded-full bg-gray-800/50 border border-gray-700/30 hover:bg-gray-700/50 transition-colors">
                  <span class="text-sm font-bold text-gray-300">${this.t('clearCache')}</span>
                </button>
              </div>
            </div>`;
        }

        if (!this.items.length) {
          return `
            <div class="py-20 text-center opacity-50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl backdrop-blur-sm">
              <i class="fa-solid fa-cloud-arrow-down text-6xl mb-4 text-gray-400"></i>
              <p class="font-bold text-gray-500 text-lg mb-2">${this.t('noBooks')}</p>
              <p class="text-sm text-gray-400">${this.t('verifyBooks')}</p>
            </div>`;
        }
        
        return `
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 gap-y-12">
            ${this.items.map((item, idx) => this.getBookCardHTML(item, idx)).join('')}
          </div>`;
      },

      getBookCardHTML(item, index) {
        const safeItem = JSON.stringify(item)
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;');
        
        return `
          <div class="group relative perspective-1000" data-book-id="${item.id}">
            <div class="relative w-full aspect-[2/3] rounded-r-xl rounded-l-md shadow-2xl transform-gpu transition-all duration-500 ease-out group-hover:-translate-y-4 group-hover:rotate-y-[-10deg] group-hover:rotate-x-[5deg] group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] cursor-pointer" 
                 onclick="window.NCLEX_LIBRARY.openReader(${safeItem})">
              <div class="absolute top-0 bottom-0 -left-2 w-4 bg-gray-800 transform -skew-y-6 origin-right opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="absolute inset-0 rounded-r-xl rounded-l-md overflow-hidden z-10">
                ${this.getCover(item, index)}
              </div>
              <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 pointer-events-none z-20 transition-opacity duration-500"></div>
              <div class="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] bg-black/20">
                <div class="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                  <i class="fa-solid fa-eye text-xl"></i>
                </div>
              </div>
            </div>
            
            <div class="mt-5 px-2 space-y-3 transition-transform duration-300 group-hover:translate-y-1">
              <h3 class="text-sm font-bold text-slate-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors" title="${this.escapeHtml(item.title)}">
                ${this.escapeHtml(item.title)}
              </h3>
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-1 text-gray-400">
                    <i class="fa-solid fa-download text-xs"></i>
                    <span class="download-count font-bold">${item.download_count}</span>
                  </div>
                  <span class="text-gray-400 font-bold">${item.size}</span>
                  <span class="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-[9px] font-bold rounded">
                    ${item.fileType}
                  </span>
                </div>
                <button onclick="window.NCLEX_LIBRARY.downloadBook(${safeItem}, event)" 
                        class="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <i class="fa-solid fa-download text-[9px]"></i> ${this.t('download')}
                </button>
              </div>
            </div>
          </div>`;
      },

      getSkeletonHTML() {
        return `
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            ${Array.from({ length: 10 }, (_, i) => `
              <div class="animate-pulse">
                <div class="aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl mb-4"></div>
                <div class="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                <div class="flex justify-between">
                  <div class="h-3 bg-gray-800 rounded w-1/4"></div>
                  <div class="h-6 bg-gray-800 rounded w-1/3"></div>
                </div>
              </div>
            `).join('')}
          </div>`;
      },

      showHelp() {
        const helpText = this.currentLang === 'es' ? 
          `📚 ${TRANSLATIONS.es.libraryTitle} - AYUDA

VISUALIZACIÓN:
• Click en cualquier libro: Abre lector nativo
• Archivos grandes (>50MB): Se abren en lector nativo automáticamente
• Si el PDF no carga: Usa "Abrir en Pestaña"

DESCARGA:
• Botón "Descargar": Guarda directamente en tu dispositivo
• El contador se actualiza visualmente

TECNOLOGÍA:
• Lector Nativo: Más rápido, menos consumo de memoria
• PDF.js: Para archivos pequeños (<50MB), con navegación

CONSEJOS:
• Para mejor experiencia, mantén usePDFJS: false
• Los datos se cachean por 5 minutos
• Recarga si faltan libros` :
          
          `📚 ${TRANSLATIONS.en.libraryTitle} - HELP

VIEWING:
• Click on any book: Opens native reader
• Large files (>50MB): Automatically open in native reader
• If PDF doesn't load: Use "Open in Tab"

DOWNLOAD:
• "Download" button: Saves directly to your device
• Counter updates visually

TECHNOLOGY:
• Native Reader: Faster, less memory consumption
• PDF.js: For small files (<50MB), with navigation

TIPS:
• For best experience, keep usePDFJS: false
• Data is cached for 5 minutes
• Reload if books are missing`;
        
        alert(helpText);
      },

      render() {
        const view = document.getElementById('app-view');
        if (view) {
          view.innerHTML = this.getShell();
        }
      }
    };

    // INICIALIZACIÓN GLOBAL
    window.NCLEX_LIBRARY = LibraryUI;
    
    if (window.NCLEX && window.NCLEX.registerTopic) {
      window.NCLEX.registerTopic({ 
        id: 'library', 
        title: { 
          es: TRANSLATIONS.es.libraryTitle, 
          en: TRANSLATIONS.en.libraryTitle 
        }, 
        subtitle: { 
          es: TRANSLATIONS.es.librarySubtitle, 
          en: TRANSLATIONS.en.librarySubtitle 
        }, 
        icon: 'book-open', 
        color: 'purple', 
        render: () => {
          setTimeout(() => LibraryUI.init(), 10); 
          return LibraryUI.getShell(); 
        }
      });
    }
    
    addCustomStyles();
  }
  
  function addCustomStyles() {
    const styles = `
      @keyframes slide-in-right {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      .animate-slide-in-right {
        animation: slide-in-right 0.3s ease-out;
      }
      
      .perspective-1000 {
        perspective: 1000px;
      }
      
      .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      
      .line-clamp-3 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
      
      .line-clamp-4 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
      }
      
      .pattern-dots-white {
        background-image: radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px);
        background-size: 20px 20px;
      }
      
      #pdf-canvas {
        background: white;
        border-radius: 8px;
        max-width: 100%;
        height: auto;
      }
      
      .fallback-content {
        animation: fadeIn 0.5s ease-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .library-notification {
        backdrop-filter: blur(10px);
      }
      
      /* Mejoras para el modal PDF.js */
      #pdf-viewer-container {
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.2) transparent;
      }
      
      #pdf-viewer-container::-webkit-scrollbar {
        width: 8px;
      }
      
      #pdf-viewer-container::-webkit-scrollbar-track {
        background: transparent;
      }
      
      #pdf-viewer-container::-webkit-scrollbar-thumb {
        background-color: rgba(255,255,255,0.2);
        border-radius: 4px;
      }
      
      /* Botones de navegación PDF */
      #prev-page:disabled, #next-page:disabled {
        cursor: not-allowed;
      }
    `;
    
    if (!document.querySelector('#library-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'library-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
  }
})();
