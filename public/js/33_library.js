// 33_library.js — NCLEX Library Ultimate (Bilingual + Hybrid Architecture)
// 🌐 Soporte: Español/Inglés (Detección Automática y Dinámica)
// 💎 Efectos: 3D Tilt Real + Glassmorphism
// 🛡️ Motor: Lector Nativo (Predeterminado) + PDF.js (Motor de Respaldo)
// 🎨 Arte: Portadas con Estetoscopio + Generación Procedural

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
    // --- CONFIGURACIÓN MAESTRA ---
    const CONFIG = {
      repo: 'Nclexpass/NCLEX1.2', 
      tag: 'BOOKS',
      
      // ⚠️ RECOMENDACIÓN PRO: Dejar usePDFJS en false para GitHub Releases.
      // El lector nativo es más rápido y no tiene problemas de CORS con GitHub.
      // Si usas false, usará <object>. Si usas true, intentará renderizar con Canvas.
      usePDFJS: false, 
      
      pdfJsCDN: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
      pdfJsWorker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
      
      coverImages: {
        // Ejemplo: 'nombre-archivo.pdf': 'url-imagen.jpg'
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
        of: "de"
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
        of: "of"
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

      // --- SISTEMA DE IDIOMAS (OBSERVER) ---
      initLanguageObserver() {
        if ('MutationObserver' in window) {
          this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.attributeName === 'data-lang' || mutation.attributeName === 'lang') {
                const newLang = document.documentElement.getAttribute('lang') || document.body.getAttribute('data-lang') || 'es';
                if (newLang !== this.currentLang) {
                  this.currentLang = newLang;
                  this.updateLanguage();
                }
              }
            });
          });
          this.observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
          this.observer.observe(document.body, { attributes: true, attributeFilter: ['data-lang'] });
        }
        this.detectInitialLanguage();
      },

      detectInitialLanguage() {
        const detected = document.documentElement.getAttribute('lang') || document.body.getAttribute('data-lang') || (navigator.language || 'es').substring(0, 2);
        this.currentLang = ['es', 'en'].includes(detected) ? detected : 'es';
      },

      t(key, variables = {}) {
        let translation = TRANSLATIONS[this.currentLang]?.[key] || TRANSLATIONS['es'][key] || key;
        Object.keys(variables).forEach(varKey => {
          translation = translation.replace(`\${${varKey}}`, variables[varKey]);
        });
        return translation;
      },

      updateLanguage() {
        if (window.NCLEX && window.NCLEX.updateTopicTitle) {
          window.NCLEX.updateTopicTitle('library', {
            title: { es: TRANSLATIONS.es.libraryTitle, en: TRANSLATIONS.en.libraryTitle },
            subtitle: { es: TRANSLATIONS.es.librarySubtitle, en: TRANSLATIONS.en.librarySubtitle }
          });
        }
        if (!this.loading && !this.modalOpen) this.render();
      },

      // --- INICIALIZACIÓN ---
      async init() {
        if (this.modalOpen) return;
        if (!this.observer) this.initLanguageObserver();
        
        this.renderSkeleton();
        
        try {
          console.log(`📚 ${this.t('loadingBooks')}`);
          const apiUrl = `https://api.github.com/repos/${CONFIG.repo}/releases/tags/${CONFIG.tag}`;
          
          const res = await fetch(apiUrl);
          if (!res.ok) throw new Error(`${this.t('connectionError')}: ${res.status}`);

          const data = await res.json();
          
          this.items = (data.assets || [])
            .filter(a => a.name.toLowerCase().endsWith('.pdf') || a.name.toLowerCase().endsWith('.epub'))
            .map(a => ({
              id: String(a.id),
              title: this.formatTitle(a.name),
              filename: a.name,
              url: a.browser_download_url,
              download_count: a.download_count || 0,
              size: this.formatFileSize(a.size),
              date: new Date(a.created_at).toLocaleDateString(),
              fileType: a.name.toLowerCase().endsWith('.epub') ? 'EPUB' : 'PDF',
              coverUrl: CONFIG.coverImages[a.name] || null
            }));

          // Ordenar por popularidad
          this.items.sort((a,b) => b.download_count - a.download_count);
          console.log(`✅ ${this.items.length} Libros cargados`);

        } catch (e) {
          console.error("Error crítico:", e);
          this.error = e.message;
        } finally {
          this.loading = false;
          this.render();
        }
      },

      // --- UTILIDADES ---
      formatTitle(filename) {
        return filename.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\.(pdf|epub)$/i, '')
          .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      },

      formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
      },

      escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      },

      // --- RENDERIZADO VISUAL ---
      getCover(item, index) {
        if (item.coverUrl) {
          return `<div class="absolute inset-0 overflow-hidden rounded-r-xl rounded-l-md bg-gray-800"><img src="${item.coverUrl}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"><div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div><div class="absolute top-4 left-4 z-10"><h3 class="font-serif font-black text-white text-lg drop-shadow-lg line-clamp-3">${this.escapeHtml(item.title)}</h3></div></div>`;
        }
        return this.getGeneratedCover(item.title, index);
      },

      getGeneratedCover(title, index) {
        let hash = 0;
        for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
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
               <div class="px-2 py-0.5 bg-black/20 rounded text-[9px] font-bold text-white backdrop-blur">${this.items[index]?.fileType || 'PDF'}</div>
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
        }

        const link = document.createElement('a');
        link.href = item.url;
        link.download = item.filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification(`📥 ${this.t('downloadNow')}: ${item.title}`);

        if (button) {
          setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
          }, 1500);
        }
      },

      // --- LECTOR (LA JOYA DE LA CORONA) ---
      async openReader(item) {
        this.modalOpen = true;
        
        if (CONFIG.usePDFJS && !window.pdfjsLib) {
          await this.loadPDFJS();
        }

        const modal = document.createElement('div');
        modal.className = "fixed inset-0 z-[100] flex flex-col animate-fade-in library-modal";
        modal.innerHTML = this.getModalHTML(item);
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        document.getElementById('close-modal').onclick = () => this.closeModal(modal);
        
        // Decidir estrategia (Nativo vs PDF.js)
        if (CONFIG.usePDFJS && window.pdfjsLib) {
            this.renderWithPDFJS(item, modal);
        } else {
            this.loadNativePDF(item, modal);
        }
      },

      getModalHTML(item) {
        const safeTitle = this.escapeHtml(item.title);
        return `
          <div class="absolute inset-0 bg-slate-900/95 backdrop-blur-xl"></div>
          <div class="relative z-10 flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 shadow-2xl">
             <div class="flex items-center gap-3 overflow-hidden">
               <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0"><i class="fa-solid fa-book-open text-white text-sm"></i></div>
               <div class="min-w-0">
                 <h2 class="text-white font-bold text-sm truncate" title="${safeTitle}">${safeTitle}</h2>
                 <p class="text-white/40 text-[10px] uppercase font-bold">${item.size} • ${CONFIG.usePDFJS ? 'PDF.js' : this.t('nativeReader')}</p>
               </div>
             </div>
             <div class="flex items-center gap-2">
               <a href="${item.url}" target="_blank" class="px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all"><i class="fa-solid fa-external-link-alt"></i> <span class="hidden sm:inline">${this.t('newTab')}</span></a>
               <button id="close-modal" class="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/30 text-white hover:text-red-300 flex items-center justify-center transition-all"><i class="fa-solid fa-xmark"></i></button>
             </div>
          </div>
          <div class="relative z-10 flex-1 w-full bg-gray-900 overflow-hidden flex flex-col" id="pdf-container">
             <div class="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-4" id="loading-indicator">
               <i class="fa-solid fa-circle-notch animate-spin text-4xl"></i>
               <span class="text-xs font-bold tracking-[0.3em] animate-pulse">${this.t('loadingPDF')}</span>
             </div>
          </div>
        `;
      },

      // ESTRATEGIA 1: Lector Nativo (Recomendado por defecto)
      loadNativePDF(item, modal) {
        const container = modal.querySelector('#pdf-container');
        const objectHTML = `
          <object data="${item.url}#toolbar=0" type="application/pdf" class="w-full h-full relative z-20" onload="document.getElementById('loading-indicator').style.display='none'">
             <div class="flex flex-col items-center justify-center h-full text-center p-8 gap-6">
               <i class="fa-regular fa-file-pdf text-6xl text-gray-600"></i>
               <h3 class="text-xl font-bold text-white">${this.t('previewUnavailable')}</h3>
               <p class="text-gray-400 max-w-md text-sm">${this.t('browserNotSupported')}</p>
               <a href="${item.url}" target="_blank" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">${this.t('openNewTab')}</a>
             </div>
          </object>
        `;
        container.insertAdjacentHTML('beforeend', objectHTML);
      },

      // ESTRATEGIA 2: PDF.js (Motor avanzado si usePDFJS = true)
      async loadPDFJS() {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = CONFIG.pdfJsCDN;
          script.onload = () => resolve();
          script.onerror = () => reject();
          document.head.appendChild(script);
        });
      },

      async renderWithPDFJS(item, modal) {
         const container = modal.querySelector('#pdf-container');
         const loading = modal.querySelector('#loading-indicator');
         
         // Configurar Worker
         if (window.pdfjsLib) {
           pdfjsLib.GlobalWorkerOptions.workerSrc = CONFIG.pdfJsWorker;
         }

         try {
             loading.querySelector('span').innerText = this.t('usingPDFJS');
             const loadingTask = pdfjsLib.getDocument(item.url);
             this.pdfDoc = await loadingTask.promise;
             this.pageNum = 1;

             container.innerHTML = `
                <div class="flex-1 overflow-auto flex justify-center bg-gray-900 p-4 relative h-full">
                    <canvas id="the-canvas" class="shadow-2xl"></canvas>
                </div>
                <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur px-4 py-2 rounded-full flex items-center gap-4 text-white z-50">
                    <button id="prev-page" class="hover:text-blue-400"><i class="fa-solid fa-chevron-left"></i></button>
                    <span class="text-xs font-bold"><span id="page-num">1</span> / <span id="page-count">--</span></span>
                    <button id="next-page" class="hover:text-blue-400"><i class="fa-solid fa-chevron-right"></i></button>
                </div>
             `;
             
             document.getElementById('page-count').textContent = this.pdfDoc.numPages;
             document.getElementById('prev-page').onclick = () => this.queueRenderPage(this.pageNum - 1);
             document.getElementById('next-page').onclick = () => this.queueRenderPage(this.pageNum + 1);

             this.renderPage(this.pageNum);

         } catch (error) {
             console.error('Error PDF.js (Fallback a Nativo):', error);
             container.innerHTML = '';
             this.loadNativePDF(item, modal); // Fallback automático
         }
      },

      renderPage(num) {
        this.pageRendering = true;
        this.pdfDoc.getPage(num).then((page) => {
            const canvas = document.getElementById('the-canvas');
            if(!canvas) return;
            const ctx = canvas.getContext('2d');
            const container = document.getElementById('pdf-container');
            
            const viewport = page.getViewport({scale: 1});
            const scale = (container.clientWidth - 40) / viewport.width; 
            const scaledViewport = page.getViewport({scale: Math.min(scale, 1.5)}); 

            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;

            const renderContext = { canvasContext: ctx, viewport: scaledViewport };
            page.render(renderContext).promise.then(() => {
                this.pageRendering = false;
                if (this.pageNumPending !== null) {
                    this.renderPage(this.pageNumPending);
                    this.pageNumPending = null;
                }
            });
        });
        document.getElementById('page-num').textContent = num;
      },

      queueRenderPage(num) {
        if (this.pageRendering) {
            this.pageNumPending = num;
        } else {
            if (num <= 0 || num > this.pdfDoc.numPages) return;
            this.pageNum = num;
            this.renderPage(num);
        }
      },

      closeModal(modal) {
        this.modalOpen = false;
        modal.classList.add('opacity-0', 'scale-95');
        setTimeout(() => modal.remove(), 300);
      },

      showNotification(message) {
        const n = document.createElement('div');
        n.className = 'fixed top-6 right-6 z-[101] px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-2xl animate-slide-in-right flex items-center gap-3';
        n.innerHTML = `<i class="fa-solid fa-circle-check"></i><span class="text-sm font-bold">${this.escapeHtml(message)}</span>`;
        document.body.appendChild(n);
        setTimeout(() => { n.classList.add('opacity-0', 'translate-x-full'); setTimeout(() => n.remove(), 300); }, 3000);
      },

      renderSkeleton() {
        const view = document.getElementById('app-view');
        if (view) view.innerHTML = this.getShell();
      },

      getShell() {
        return `
          <div class="animate-fade-in pb-24 px-4 md:px-8 min-h-screen">
            <div class="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 mt-8 gap-6">
              <div>
                <h1 class="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-sm">${this.t('libraryTitle')}</h1>
                <div class="flex items-center gap-3 mt-3">
                   <span class="relative flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
                   <p class="text-gray-500 text-xs font-bold uppercase tracking-[0.25em]">${this.t('bookCount', { count: this.items.length || '...' })}</p>
                </div>
              </div>
              <div class="flex gap-3">
                <button onclick="window.NCLEX_LIBRARY.showHelp()" class="group px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"><div class="flex items-center gap-3"><i class="fa-solid fa-circle-info text-gray-400 group-hover:text-blue-400"></i><span class="text-xs font-bold text-gray-300 group-hover:text-white uppercase tracking-widest">${this.t('help')}</span></div></button>
                <button onclick="window.NCLEX_LIBRARY.init()" class="group px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 border border-blue-400/30 shadow-lg hover:shadow-xl transition-all"><div class="flex items-center gap-3"><i class="fa-solid fa-rotate text-white group-hover:rotate-180 transition-all"></i><span class="text-xs font-bold text-white uppercase tracking-widest">${this.t('reload')}</span></div></button>
              </div>
            </div>
            ${this.loading ? this.getSkeletonHTML() : this.getGridHTML()}
          </div>`;
      },

      getGridHTML() {
        if (this.error) return `<div class="p-10 rounded-3xl bg-red-900/10 border border-red-500/20 text-center"><h3 class="text-red-300 font-bold">${this.t('connectionError')}</h3><p class="text-red-400/70 text-sm mt-2">${this.error}</p><button onclick="window.NCLEX_LIBRARY.init()" class="mt-4 px-4 py-2 bg-red-500/20 text-red-300 rounded-full text-sm font-bold">${this.t('retryConnection')}</button></div>`;
        if (!this.items.length) return `<div class="py-20 text-center opacity-50 border-2 border-dashed border-gray-700 rounded-3xl"><i class="fa-solid fa-cloud-arrow-down text-6xl mb-4 text-gray-400"></i><p class="font-bold text-gray-500">${this.t('noBooks')}</p></div>`;
        return `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 gap-y-12">${this.items.map((item, idx) => this.getBookCardHTML(item, idx)).join('')}</div>`;
      },

      getBookCardHTML(item, index) {
        const safeItem = JSON.stringify(item).replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
        return `<div class="group relative perspective-1000"><div class="relative w-full aspect-[2/3] rounded-r-xl rounded-l-md shadow-2xl transform-gpu transition-all duration-500 ease-out group-hover:-translate-y-4 group-hover:rotate-y-[-10deg] group-hover:rotate-x-[5deg] group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] cursor-pointer" onclick="window.NCLEX_LIBRARY.openReader(${safeItem})"><div class="absolute top-0 bottom-0 -left-2 w-4 bg-gray-800 transform -skew-y-6 origin-right opacity-0 group-hover:opacity-100 transition-opacity"></div><div class="absolute inset-0 rounded-r-xl rounded-l-md overflow-hidden z-10">${this.getCover(item, index)}</div><div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 pointer-events-none z-20 transition-opacity duration-500"></div><div class="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] bg-black/20"><div class="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-300"><i class="fa-solid fa-eye text-xl"></i></div></div></div><div class="mt-5 px-2 space-y-3 transition-transform duration-300 group-hover:translate-y-1"><h3 class="text-sm font-bold text-slate-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">${this.escapeHtml(item.title)}</h3><div class="flex items-center justify-between text-xs"><div class="flex items-center gap-4"><div class="flex items-center gap-1 text-gray-400"><i class="fa-solid fa-download text-xs"></i><span class="font-bold">${item.download_count}</span></div><span class="text-gray-400 font-bold">${item.size}</span></div><button onclick="window.NCLEX_LIBRARY.downloadBook(${safeItem}, event)" class="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-download text-[9px]"></i> ${this.t('download')}</button></div></div></div>`;
      },

      getSkeletonHTML() { return `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">${Array.from({length:10}).map(()=>`<div class="animate-pulse"><div class="aspect-[2/3] bg-gray-800 rounded-xl mb-4"></div><div class="h-4 bg-gray-800 rounded w-3/4 mb-2"></div></div>`).join('')}</div>`; },
      showHelp() { alert(`📚 ${this.t('help')} \n\n${this.currentLang === 'es' ? '• Click: Leer\n• Descargar: Guardar PDF' : '• Click: Read\n• Download: Save PDF'}`); }
    };

    window.NCLEX_LIBRARY = LibraryUI;
    if (window.NCLEX && window.NCLEX.registerTopic) {
      window.NCLEX.registerTopic({ id: 'library', title: { es: TRANSLATIONS.es.libraryTitle, en: TRANSLATIONS.en.libraryTitle }, subtitle: { es: TRANSLATIONS.es.librarySubtitle, en: TRANSLATIONS.en.librarySubtitle }, icon: 'book-open', color: 'purple', render: () => { setTimeout(() => LibraryUI.init(), 10); return LibraryUI.getShell(); } });
    }
    
    addCustomStyles();
  }
  
  function addCustomStyles() {
    const styles = `@keyframes slide-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; } .perspective-1000 { perspective: 1000px; } .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; } .line-clamp-3 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; } .line-clamp-4 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4; } .pattern-dots-white { background-image: radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px); background-size: 20px 20px; }`;
    if (!document.querySelector('#library-styles')) { const s = document.createElement('style'); s.id = 'library-styles'; s.textContent = styles; document.head.appendChild(s); }
  }
})();
