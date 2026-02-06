// 33_library.js — NCLEX Library Ultimate (Solución: Preview Disponible)
// 🔧 SOLUCIÓN: PDF.js local + Servicio proxy para visualización
// 🌐 Soporte: Español/Inglés
// 💎 Efectos: 3D Tilt Real + Glassmorphism

(function () {
  'use strict';
  
  if (!window.NCLEX) {
    setTimeout(initLibrary, 1000); 
    return;
  } else {
    initLibrary();
  }

  function initLibrary() {
    // --- CONFIGURACIÓN CON SOLUCIÓN DEFINITIVA ---
    const CONFIG = {
      repo: 'Nclexpass/NCLEX1.2', 
      tag: 'BOOKS',
      
      // ✅ SOLUCIÓN: Usar PDF.js como visualizador principal
      usePDFJS: true, // IMPORTANTE: Debe ser TRUE
      pdfJsCDN: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
      pdfJsWorker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
      
      // Servicio proxy alternativo si PDF.js falla
      proxyServices: [
        'https://corsproxy.io/?', // Proxy CORS gratuito
        'https://api.allorigins.win/raw?url=' // Otro servicio
      ],
      
      coverImages: {
        'nclex-book-1.pdf': 'https://raw.githubusercontent.com/Nclexpass/NCLEX1.2/main/covers/book1.jpg',
      },
      
      defaultCoverColors: [
        ['from-indigo-500 via-purple-500 to-pink-500', 'text-indigo-100', 'shadow-indigo-500/50'],
        ['from-emerald-400 via-teal-500 to-cyan-600', 'text-teal-100', 'shadow-teal-500/50'],
        ['from-orange-400 via-red-500 to-rose-600', 'text-orange-100', 'shadow-orange-500/50'],
        ['from-blue-400 via-blue-600 to-indigo-800', 'text-blue-100', 'shadow-blue-500/50'],
        ['from-slate-600 via-slate-700 to-slate-900', 'text-gray-300', 'shadow-gray-500/50']
      ]
    };

    // --- DICCIONARIO DE TRADUCCIONES MEJORADO ---
    const TRANSLATIONS = {
      es: {
        libraryTitle: "Biblioteca NCLEX",
        librarySubtitle: "Libros • Visor Integrado",
        loadingBooks: "Cargando biblioteca...",
        bookCount: "${count} Libros Disponibles",
        help: "Ayuda",
        reload: "Recargar",
        download: "Descargar",
        newTab: "Pestaña Nueva",
        close: "Cerrar",
        loadingPDF: "PREPARANDO VISOR...",
        loadingDocument: "CARGANDO DOCUMENTO...",
        renderingPages: "RENDERIZANDO PÁGINAS...",
        viewerReady: "Visor PDF Listo",
        previewUnavailable: "Cargando alternativa...",
        browserNotSupported: "Usando visor PDF integrado...",
        connectionError: "Error de Conexión",
        noBooks: "No hay libros disponibles",
        verifyBooks: "Verifica el Release 'BOOKS' en GitHub",
        retryConnection: "Reintentar",
        openNewTab: "Abrir PDF Externo",
        downloadNow: "Descargar Ahora",
        page: "Página",
        of: "de",
        loading: "Cargando...",
        errorLoading: "Error al cargar",
        viewingOnline: "Visualización local",
        externalViewer: "Visor externo",
        forceDownload: "Forzar descarga",
        viewInBrowser: "Ver PDF",
        zoomIn: "Acercar",
        zoomOut: "Alejar",
        fitWidth: "Ajustar ancho",
        fitPage: "Ajustar página",
        totalPages: "Páginas totales",
        currentPage: "Página actual",
        searchPDF: "Buscar en PDF...",
        enterPage: "Ir a página..."
      },
      en: {
        libraryTitle: "NCLEX Library",
        librarySubtitle: "Books • Built-in Viewer",
        loadingBooks: "Loading library...",
        bookCount: "${count} Books Available",
        help: "Help",
        reload: "Reload",
        download: "Download",
        newTab: "New Tab",
        close: "Close",
        loadingPDF: "PREPARING VIEWER...",
        loadingDocument: "LOADING DOCUMENT...",
        renderingPages: "RENDERING PAGES...",
        viewerReady: "PDF Viewer Ready",
        previewUnavailable: "Loading alternative...",
        browserNotSupported: "Using built-in PDF viewer...",
        connectionError: "Connection Error",
        noBooks: "No books available",
        verifyBooks: "Check 'BOOKS' Release on GitHub",
        retryConnection: "Retry",
        openNewTab: "Open PDF Externally",
        downloadNow: "Download Now",
        page: "Page",
        of: "of",
        loading: "Loading...",
        errorLoading: "Error loading",
        viewingOnline: "Local viewing",
        externalViewer: "External viewer",
        forceDownload: "Force download",
        viewInBrowser: "View PDF",
        zoomIn: "Zoom in",
        zoomOut: "Zoom out",
        fitWidth: "Fit width",
        fitPage: "Fit page",
        totalPages: "Total pages",
        currentPage: "Current page",
        searchPDF: "Search in PDF...",
        enterPage: "Go to page..."
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
      currentScale: 1.0,
      pdfViewer: null,
      
      // --- SISTEMA DE IDIOMAS ---
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

      // --- INICIALIZACIÓN ---
      async init() {
        if (this.modalOpen) return;
        
        if (!this.observer) {
          this.initLanguageObserver();
        }
        
        this.renderSkeleton();
        
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
            .map(a => ({
              id: String(a.id),
              title: this.formatTitle(a.name),
              filename: a.name,
              url: a.browser_download_url,
              download_count: a.download_count || 0,
              size: this.formatFileSize(parseInt(a.size)),
              rawSize: parseInt(a.size),
              date: new Date(a.created_at).toLocaleDateString(),
              fileType: a.name.toLowerCase().endsWith('.epub') ? 'EPUB' : 'PDF',
              coverUrl: CONFIG.coverImages[a.name] || null
            }));

          this.items.sort((a, b) => b.download_count - a.download_count);
          
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

      // --- UTILIDADES ---
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

      // ✅ NUEVA FUNCIÓN: Obtener URL con proxy para evitar CORS
      async getPDFWithProxy(pdfUrl) {
        // Intentar primero directo (puede funcionar con GitHub)
        try {
          const testResponse = await fetch(pdfUrl, { method: 'HEAD' });
          if (testResponse.ok) {
            return pdfUrl; // Si funciona directo, usar directo
          }
        } catch (e) {
          console.log('URL directa falló, usando proxy...');
        }
        
        // Usar servicios proxy alternativos
        for (const proxy of CONFIG.proxyServices) {
          try {
            const proxyUrl = proxy + encodeURIComponent(pdfUrl);
            const test = await fetch(proxyUrl, { method: 'HEAD' });
            if (test.ok) {
              return proxyUrl;
            }
          } catch (e) {
            console.log(`Proxy ${proxy} falló, intentando siguiente...`);
          }
        }
        
        // Si todo falla, devolver la original
        return pdfUrl;
      },

      // --- RENDERIZADO VISUAL ---
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

      // --- DESCARGA ---
      async downloadBook(item, event) {
        if (event) event.stopPropagation();
        
        const button = event?.currentTarget;
        const originalHTML = button?.innerHTML || '';
        
        if (button) {
          button.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i>';
          button.disabled = true;
          button.classList.add('opacity-50');
        }

        try {
          const link = document.createElement('a');
          link.href = item.url;
          link.download = item.filename;
          link.target = '_blank';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          this.showNotification(`📥 ${this.t('downloadNow')}: ${item.title}`);
          
          const downloadCount = document.querySelector(`[data-book-id="${item.id}"] .download-count`);
          if (downloadCount) {
            const current = parseInt(downloadCount.textContent) || 0;
            downloadCount.textContent = current + 1;
          }
          
        } catch (error) {
          console.error('Error en descarga:', error);
          this.showNotification(`❌ ${this.t('errorLoading')}: ${item.title}`);
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

      // --- ✅ VISOR PDF.js MEJORADO (SOLUCIÓN DEFINITIVA) ---
      async openReader(item) {
        if (this.modalOpen) return;
        this.modalOpen = true;
        
        // Crear modal inmediatamente
        const modal = document.createElement('div');
        modal.className = "fixed inset-0 z-[100] flex flex-col animate-fade-in library-modal";
        modal.innerHTML = this.getModalHTML(item);
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        document.getElementById('close-modal').onclick = () => this.closeModal(modal);
        
        // Iniciar carga del PDF
        this.loadPDFWithProgress(item, modal);
      },

      getModalHTML(item) {
        const safeTitle = this.escapeHtml(item.title);
        
        return `
          <div class="absolute inset-0 bg-slate-900/95 backdrop-blur-xl"></div>
          <div class="relative z-10 flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 shadow-2xl">
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
                <i class="fa-solid fa-file-pdf text-white text-sm"></i>
              </div>
              <div class="min-w-0">
                <h2 class="text-white font-bold text-sm truncate" title="${safeTitle}">${safeTitle}</h2>
                <p class="text-white/40 text-[10px] uppercase font-bold">
                  ${item.size} • PDF.js • ${this.t('viewingOnline')}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="window.NCLEX_LIBRARY.downloadBook(${JSON.stringify(item).replace(/"/g, '&quot;').replace(/'/g, '&#x27;')}, event)" 
                      class="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all">
                <i class="fa-solid fa-download"></i> 
                <span class="hidden sm:inline">${this.t('download')}</span>
              </button>
              
              <button id="close-modal" 
                      class="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/30 text-white hover:text-red-300 flex items-center justify-center transition-all"
                      title="${this.t('close')}">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="relative z-10 flex-1 w-full bg-gray-900 overflow-hidden flex flex-col" id="viewer-container">
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-4" id="loading-indicator">
              <div class="w-16 h-16 relative">
                <div class="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div class="text-center">
                <span class="text-xs font-bold tracking-[0.3em] animate-pulse block mb-1">${this.t('loadingPDF')}</span>
                <span class="text-[10px] text-gray-400" id="loading-status">${this.t('loadingDocument')}</span>
                <div class="w-48 h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                  <div id="loading-bar" class="h-full bg-blue-500 rounded-full transition-all duration-300" style="width: 0%"></div>
                </div>
              </div>
            </div>
          </div>
        `;
      },

      async loadPDFWithProgress(item, modal) {
        const container = modal.querySelector('#viewer-container');
        const loading = modal.querySelector('#loading-indicator');
        const loadingStatus = modal.querySelector('#loading-status');
        const loadingBar = modal.querySelector('#loading-bar');
        
        try {
          // Paso 1: Cargar PDF.js si no está cargado
          loadingStatus.textContent = this.t('loadingDocument');
          loadingBar.style.width = '10%';
          
          if (!window.pdfjsLib) {
            await this.loadPDFJS();
          }
          
          loadingBar.style.width = '30%';
          loadingStatus.textContent = this.currentLang === 'es' ? 'Configurando visor...' : 'Setting up viewer...';
          
          // Paso 2: Configurar PDF.js
          pdfjsLib.GlobalWorkerOptions.workerSrc = CONFIG.pdfJsWorker;
          
          // Paso 3: Obtener PDF (con proxy si es necesario)
          loadingBar.style.width = '50%';
          loadingStatus.textContent = this.currentLang === 'es' ? 'Obteniendo documento...' : 'Fetching document...';
          
          const pdfUrl = await this.getPDFWithProxy(item.url);
          
          // Paso 4: Cargar documento
          loadingBar.style.width = '70%';
          loadingStatus.textContent = this.t('renderingPages');
          
          const loadingTask = pdfjsLib.getDocument({
            url: pdfUrl,
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
            cMapPacked: true,
          });
          
          this.pdfDoc = await loadingTask.promise;
          
          // Paso 5: Crear interfaz del visor
          loadingBar.style.width = '90%';
          
          container.innerHTML = this.createPDFViewerHTML();
          
          // Paso 6: Renderizar primera página
          loadingBar.style.width = '100%';
          await this.renderPDFPage(this.pageNum);
          
          // Paso 7: Ocultar loading y mostrar visor
          setTimeout(() => {
            loading.style.opacity = '0';
            loading.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
              loading.style.display = 'none';
              
              // Mostrar controles
              const controls = container.querySelector('#pdf-controls');
              if (controls) {
                controls.style.opacity = '1';
                controls.style.transform = 'translateY(0)';
              }
            }, 500);
          }, 500);
          
        } catch (error) {
          console.error('Error cargando PDF:', error);
          this.showFallbackViewer(item, container, loading, error);
        }
      },

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
              resolve();
            } else {
              reject(new Error('PDF.js no se cargó'));
            }
          };
          script.onerror = () => reject(new Error('Error cargando PDF.js'));
          document.head.appendChild(script);
        });
      },

      createPDFViewerHTML() {
        return `
          <div class="h-full flex flex-col bg-gray-900">
            <!-- Controles superiores -->
            <div id="pdf-controls" class="bg-black/50 backdrop-blur px-4 py-2 border-b border-white/10 flex items-center justify-between transition-all duration-300 opacity-0 transform translate-y-[-10px]">
              <div class="flex items-center gap-2">
                <button id="zoom-out" class="p-2 rounded hover:bg-white/10 text-white" title="${this.t('zoomOut')}">
                  <i class="fa-solid fa-magnifying-glass-minus"></i>
                </button>
                <span class="text-sm text-white font-bold min-w-[60px] text-center">${Math.round(this.currentScale * 100)}%</span>
                <button id="zoom-in" class="p-2 rounded hover:bg-white/10 text-white" title="${this.t('zoomIn')}">
                  <i class="fa-solid fa-magnifying-glass-plus"></i>
                </button>
                <button id="fit-width" class="p-2 rounded hover:bg-white/10 text-white ml-2" title="${this.t('fitWidth')}">
                  <i class="fa-solid fa-arrows-left-right"></i>
                </button>
                <button id="fit-page" class="p-2 rounded hover:bg-white/10 text-white" title="${this.t('fitPage')}">
                  <i class="fa-solid fa-expand"></i>
                </button>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2 text-white">
                  <button id="prev-page" class="p-2 rounded hover:bg-white/10 disabled:opacity-30" title="${this.t('page')} ${this.pageNum - 1}">
                    <i class="fa-solid fa-chevron-left"></i>
                  </button>
                  <div class="flex items-center gap-2">
                    <input type="number" id="page-input" 
                           class="w-16 bg-black/30 border border-white/20 rounded px-2 py-1 text-white text-center text-sm"
                           min="1" value="${this.pageNum}" 
                           placeholder="${this.t('enterPage')}">
                    <span class="text-sm">/ <span id="total-pages">${this.pdfDoc?.numPages || '?'}</span></span>
                  </div>
                  <button id="next-page" class="p-2 rounded hover:bg-white/10" title="${this.t('page')} ${this.pageNum + 1}">
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              
              <div class="text-xs text-gray-300">
                ${this.t('page')} <span id="current-page">${this.pageNum}</span> ${this.t('of')} <span id="page-count">${this.pdfDoc?.numPages || '?'}</span>
              </div>
            </div>
            
            <!-- Área del documento -->
            <div class="flex-1 overflow-auto bg-gray-800 p-4" id="pdf-viewport">
              <div class="min-h-full flex flex-col items-center">
                <canvas id="pdf-canvas" class="shadow-2xl bg-white rounded max-w-full"></canvas>
                <div id="page-info" class="mt-4 text-sm text-gray-400 text-center">
                  ${this.t('page')} <span id="display-page">${this.pageNum}</span> ${this.t('of')} ${this.pdfDoc?.numPages || '?'}
                </div>
              </div>
            </div>
            
            <!-- Controles inferiores -->
            <div class="bg-black/30 px-4 py-2 border-t border-white/10 flex justify-between items-center">
              <div class="text-xs text-gray-400">
                ${this.t('viewingOnline')} • PDF.js
              </div>
              <div class="flex items-center gap-2">
                <button id="first-page" class="p-1.5 rounded hover:bg-white/10 text-gray-300 text-xs">
                  <i class="fa-solid fa-backward-fast"></i>
                </button>
                <button id="last-page" class="p-1.5 rounded hover:bg-white/10 text-gray-300 text-xs">
                  <i class="fa-solid fa-forward-fast"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      },

      async renderPDFPage(pageNumber) {
        if (this.pdfRendering || !this.pdfDoc || pageNumber < 1 || pageNumber > this.pdfDoc.numPages) {
          return;
        }
        
        this.pdfRendering = true;
        this.pageNum = pageNumber;
        
        const canvas = document.getElementById('pdf-canvas');
        if (!canvas) {
          this.pdfRendering = false;
          return;
        }
        
        try {
          const page = await this.pdfDoc.getPage(pageNumber);
          const viewport = page.getViewport({ scale: this.currentScale });
          
          // Ajustar canvas al tamaño de la página
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          const context = canvas.getContext('2d', { alpha: false });
          
          // Fondo blanco
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          
          await page.render(renderContext).promise;
          
          // Actualizar UI
          this.updatePageControls();
          
        } catch (error) {
          console.error('Error renderizando página:', error);
        } finally {
          this.pdfRendering = false;
          
          if (this.pendingPage !== null) {
            const nextPage = this.pendingPage;
            this.pendingPage = null;
            await this.renderPDFPage(nextPage);
          }
        }
      },

      updatePageControls() {
        // Actualizar números de página
        const pageInput = document.getElementById('page-input');
        const currentPageSpan = document.getElementById('current-page');
        const displayPageSpan = document.getElementById('display-page');
        const totalPagesSpan = document.getElementById('total-pages');
        const pageCountSpan = document.getElementById('page-count');
        
        if (pageInput) pageInput.value = this.pageNum;
        if (currentPageSpan) currentPageSpan.textContent = this.pageNum;
        if (displayPageSpan) displayPageSpan.textContent = this.pageNum;
        if (totalPagesSpan && this.pdfDoc) totalPagesSpan.textContent = this.pdfDoc.numPages;
        if (pageCountSpan && this.pdfDoc) pageCountSpan.textContent = this.pdfDoc.numPages;
        
        // Actualizar botones de navegación
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const firstBtn = document.getElementById('first-page');
        const lastBtn = document.getElementById('last-page');
        
        if (prevBtn) prevBtn.disabled = this.pageNum <= 1;
        if (nextBtn && this.pdfDoc) nextBtn.disabled = this.pageNum >= this.pdfDoc.numPages;
        if (firstBtn) firstBtn.disabled = this.pageNum <= 1;
        if (lastBtn && this.pdfDoc) lastBtn.disabled = this.pageNum >= this.pdfDoc.numPages;
        
        // Actualizar escala
        const scaleDisplay = document.querySelector('#pdf-controls span:first-child');
        if (scaleDisplay) {
          scaleDisplay.textContent = `${Math.round(this.currentScale * 100)}%`;
        }
      },

      setupPDFControls() {
        // Navegación de páginas
        document.getElementById('prev-page')?.addEventListener('click', () => this.changePage(-1));
        document.getElementById('next-page')?.addEventListener('click', () => this.changePage(1));
        document.getElementById('first-page')?.addEventListener('click', () => this.goToPage(1));
        document.getElementById('last-page')?.addEventListener('click', () => {
          if (this.pdfDoc) this.goToPage(this.pdfDoc.numPages);
        });
        
        // Input de página
        const pageInput = document.getElementById('page-input');
        if (pageInput) {
          pageInput.addEventListener('change', (e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && this.pdfDoc && page <= this.pdfDoc.numPages) {
              this.goToPage(page);
            } else {
              e.target.value = this.pageNum;
            }
          });
          
          pageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              const page = parseInt(e.target.value);
              if (page >= 1 && this.pdfDoc && page <= this.pdfDoc.numPages) {
                this.goToPage(page);
              }
            }
          });
        }
        
        // Controles de zoom
        document.getElementById('zoom-in')?.addEventListener('click', () => this.changeZoom(0.2));
        document.getElementById('zoom-out')?.addEventListener('click', () => this.changeZoom(-0.2));
        document.getElementById('fit-width')?.addEventListener('click', () => this.fitToWidth());
        document.getElementById('fit-page')?.addEventListener('click', () => this.fitToPage());
      },

      changePage(delta) {
        const newPage = this.pageNum + delta;
        if (newPage >= 1 && this.pdfDoc && newPage <= this.pdfDoc.numPages) {
          this.goToPage(newPage);
        }
      },

      goToPage(pageNumber) {
        if (pageNumber === this.pageNum) return;
        
        if (this.pdfRendering) {
          this.pendingPage = pageNumber;
        } else {
          this.renderPDFPage(pageNumber);
        }
      },

      changeZoom(delta) {
        this.currentScale = Math.max(0.5, Math.min(3.0, this.currentScale + delta));
        this.renderPDFPage(this.pageNum);
      },

      async fitToWidth() {
        if (!this.pdfDoc) return;
        
        const canvas = document.getElementById('pdf-canvas');
        const viewport = document.getElementById('pdf-viewport');
        
        if (!canvas || !viewport) return;
        
        try {
          const page = await this.pdfDoc.getPage(this.pageNum);
          const pageViewport = page.getViewport({ scale: 1 });
          const containerWidth = viewport.clientWidth - 40; // Padding
          
          this.currentScale = containerWidth / pageViewport.width;
          this.currentScale = Math.max(0.5, Math.min(3.0, this.currentScale));
          
          await this.renderPDFPage(this.pageNum);
        } catch (error) {
          console.error('Error ajustando ancho:', error);
        }
      },

      async fitToPage() {
        if (!this.pdfDoc) return;
        
        const viewport = document.getElementById('pdf-viewport');
        
        if (!viewport) return;
        
        try {
          const page = await this.pdfDoc.getPage(this.pageNum);
          const pageViewport = page.getViewport({ scale: 1 });
          const containerWidth = viewport.clientWidth - 40;
          const containerHeight = viewport.clientHeight - 100;
          
          const widthScale = containerWidth / pageViewport.width;
          const heightScale = containerHeight / pageViewport.height;
          
          this.currentScale = Math.min(widthScale, heightScale, 2.0);
          this.currentScale = Math.max(0.5, this.currentScale);
          
          await this.renderPDFPage(this.pageNum);
        } catch (error) {
          console.error('Error ajustando página:', error);
        }
      },

      showFallbackViewer(item, container, loading, error) {
        console.log('Mostrando visor alternativo:', error);
        
        if (loading) {
          loading.style.display = 'none';
        }
        
        container.innerHTML = `
          <div class="flex flex-col items-center justify-center h-full text-center p-8 gap-6">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl">
              <i class="fa-solid fa-triangle-exclamation text-4xl text-white"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white mb-2">${this.t('previewUnavailable')}</h3>
              <p class="text-gray-400 max-w-md text-sm mb-4">
                ${this.currentLang === 'es' 
                  ? 'El visor PDF no pudo cargar directamente. Usa una de estas opciones:' 
                  : 'PDF viewer couldn\'t load directly. Use one of these options:'}
              </p>
              <div class="bg-gray-800/50 rounded-lg p-4 text-left max-w-md mx-auto">
                <p class="text-gray-300 text-sm mb-2"><strong>${this.currentLang === 'es' ? 'Posible causa:' : 'Possible cause:'}</strong></p>
                <ul class="text-gray-400 text-sm space-y-1 list-disc list-inside">
                  <li>${this.currentLang === 'es' ? 'Políticas CORS del navegador' : 'Browser CORS policies'}</li>
                  <li>${this.currentLang === 'es' ? 'PDF muy grande (>50MB)' : 'PDF too large (>50MB)'}</li>
                  <li>${this.currentLang === 'es' ? 'Conexión lenta o interrumpida' : 'Slow or interrupted connection'}</li>
                </ul>
              </div>
            </div>
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
            <div class="mt-6 text-xs text-gray-500">
              <p><i class="fa-solid fa-lightbulb text-yellow-400 mr-1"></i> 
                <strong>${this.currentLang === 'es' ? 'Consejo:' : 'Tip:'}</strong> 
                ${this.currentLang === 'es' 
                  ? 'Para archivos grandes, descarga y usa un visor local como Adobe Reader.' 
                  : 'For large files, download and use a local viewer like Adobe Reader.'}
              </p>
            </div>
          </div>
        `;
      },

      closeModal(modal) {
        if (!modal) return;
        
        this.modalOpen = false;
        
        // Limpiar recursos
        if (this.pdfDoc) {
          this.pdfDoc.destroy();
          this.pdfDoc = null;
        }
        
        this.pdfRendering = false;
        this.pendingPage = null;
        this.pageNum = 1;
        this.currentScale = 1.0;
        
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

      showNotification(message) {
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
          setTimeout(() => notification.remove(), 300);
        }, 3000);
      },

      // --- INTERFAZ PRINCIPAL ---
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
            
            <div class="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-900/10 to-purple-900/10 border border-white/5 backdrop-blur-sm">
              <div class="flex items-center gap-3 text-sm text-gray-400">
                <i class="fa-solid fa-lightbulb text-yellow-400"></i>
                <p><span class="font-bold text-white">Click</span>: ${this.t('viewInBrowser')} • 
                   <span class="font-bold text-white">${this.t('download')}</span>: ${this.currentLang === 'es' ? 'Guardar en dispositivo' : 'Save to device'}</p>
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
              <button onclick="window.NCLEX_LIBRARY.init()" 
                      class="mt-6 px-6 py-2 rounded-full bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors">
                <span class="text-sm font-bold text-red-300">${this.t('retryConnection')}</span>
              </button>
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

VISUALIZACIÓN INTEGRADA:
• Click en cualquier libro: Abre visor PDF integrado
• El visor usa PDF.js (tecnología moderna)
• Funciona completamente en tu navegador

CONTROLES DEL VISOR:
• Zoom +/-: Para acercar/alejar
• Ajustar ancho/página: Para mejor visualización
• Navegación: Flechas para cambiar página
• Input de página: Ir a página específica

SI NO CARGA:
1. Espera unos segundos (PDF.js necesita tiempo)
2. Revisa tu conexión a internet
3. Archivos muy grandes (>50MB) pueden tardar
4. Si persiste, usa "Abrir PDF Externo"

DESCARGA:
• Solo se descarga si usas el botón "Descargar"
• La visualización NO descarga el archivo

CONSEJOS:
• Para mejor experiencia, usa Chrome/Firefox
• PDF.js es compatible con la mayoría de navegadores
• Los controles aparecen después de cargar` :
          
          `📚 ${TRANSLATIONS.en.libraryTitle} - HELP

BUILT-IN VIEWER:
• Click on any book: Opens built-in PDF viewer
• Viewer uses PDF.js (modern technology)
• Works completely in your browser

VIEWER CONTROLS:
• Zoom +/-: To zoom in/out
• Fit width/page: For better viewing
• Navigation: Arrows to change page
• Page input: Go to specific page

IF IT DOESN'T LOAD:
1. Wait a few seconds (PDF.js needs time)
2. Check your internet connection
3. Very large files (>50MB) may take longer
4. If persists, use "Open PDF Externally"

DOWNLOAD:
• Only downloads if you use "Download" button
• Viewing does NOT download the file

TIPS:
• For best experience, use Chrome/Firefox
• PDF.js is compatible with most browsers
• Controls appear after loading`;
        
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
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        max-width: 100%;
        height: auto;
      }
      
      .library-notification {
        backdrop-filter: blur(10px);
      }
      
      /* Scrollbar personalizado */
      #pdf-viewport {
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.2) transparent;
      }
      
      #pdf-viewport::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      
      #pdf-viewport::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.05);
        border-radius: 5px;
      }
      
      #pdf-viewport::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
        border-radius: 5px;
      }
      
      #pdf-viewport::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.3);
      }
      
      /* Controles del visor */
      #pdf-controls button:not(:disabled):hover {
        background: rgba(255,255,255,0.15) !important;
        transform: scale(1.05);
        transition: all 0.2s ease;
      }
      
      #page-input {
        transition: all 0.2s ease;
      }
      
      #page-input:focus {
        outline: none;
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
      }
      
      /* Animación de carga */
      @keyframes pulse-glow {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .animate-pulse-glow {
        animation: pulse-glow 2s ease-in-out infinite;
      }
      
      /* Mejoras para móviles */
      @media (max-width: 640px) {
        #pdf-controls {
          flex-direction: column;
          gap: 8px;
          padding: 12px;
        }
        
        #pdf-controls > div {
          width: 100%;
          justify-content: center;
        }
        
        #page-input {
          width: 50px !important;
        }
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
