// premium_books_library.js — Apple Library + Real PDF covers
(function() {
    'use strict';

    const GITHUB_RELEASE_URL = 'https://api.github.com/repos/Nclexpass/NCLEX1.2/releases/tags/BOOKS';
    const GITHUB_DOWNLOAD_BASE = 'https://github.com/Nclexpass/NCLEX1.2/releases/download/BOOKS/';

    // --- Estado global ---
    const state = {
        books: [],
        isLoading: false,
        error: null,
        thumbnails: {}      // cache de carátulas (dataURL)
    };

    // --- Utilidades ---
    function t(es, en) {
        const esEl = document.querySelector('.lang-es');
        return esEl && esEl.offsetParent !== null ? es : en;
    }

    function formatFileSize(bytes) {
        if (!bytes) return '';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    // --- Inyectar estilos Apple + thumbnails ---
    function injectAppleStyles() {
        if (document.getElementById('apple-library-styles')) return;
        const style = document.createElement('style');
        style.id = 'apple-library-styles';
        style.innerHTML = `
            /* Apple Glassmorphism refinado */
            .apple-glass {
                background: rgba(255,255,255,0.75);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                border: 0.5px solid rgba(255,255,255,0.3);
                box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05), 0 2px 5px rgba(0,0,0,0.02);
            }
            .dark .apple-glass {
                background: rgba(30,30,32,0.8);
                border-color: rgba(255,255,255,0.1);
                box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
            }

            /* Scroll tipo macOS */
            .apple-scrollbar::-webkit-scrollbar {
                width: 8px;
            }
            .apple-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .apple-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(0,0,0,0.2);
                border-radius: 100px;
                border: 2px solid transparent;
                background-clip: padding-box;
            }
            .dark .apple-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.2);
                background-clip: padding-box;
            }

            /* Contenedor de carátula (formato libro) */
            .thumbnail-container {
                width: 80px;
                height: 100px;
                border-radius: 8px;
                background: #f5f5f7;
                box-shadow: 0 5px 15px -5px rgba(0,0,0,0.1);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .dark .thumbnail-container {
                background: #1c1c1e;
                box-shadow: 0 5px 15px -5px rgba(0,0,0,0.5);
            }
            .group:hover .thumbnail-container {
                transform: scale(1.02);
                box-shadow: 0 12px 25px -8px rgba(0,0,0,0.15);
            }

            /* Placeholder de carga */
            .thumbnail-loader {
                background: rgba(0,0,0,0.3);
                backdrop-filter: blur(2px);
            }

            /* Tarjetas con efecto Apple */
            .apple-book-card {
                transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
                border: 0.5px solid transparent;
            }
            .apple-book-card:hover {
                border-color: rgba(0,122,255,0.3);
                background: rgba(255,255,255,0.9);
            }
            .dark .apple-book-card:hover {
                background: rgba(50,50,55,0.9);
                border-color: rgba(10,132,255,0.5);
            }

            /* Botón flotante estilo Live Activity */
            #library-btn {
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255,255,255,0.3);
                box-shadow: 0 10px 25px -5px rgba(0,113,227,0.4);
            }
            #library-btn:hover {
                box-shadow: 0 15px 30px -5px rgba(0,113,227,0.6);
            }

            /* Tipografía sistema */
            .font-apple {
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
            }
        `;
        document.head.appendChild(style);
    }

    // --- Cargar pdf.js bajo demanda ---
    function ensurePdfJs() {
        return new Promise((resolve, reject) => {
            if (window.pdfjsLib) {
                resolve(window.pdfjsLib);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.integrity = 'sha512-wH+WMZ5CRH9vQhCJ9R04mWQzW7I6UyUYvF9QDCQl1U6UIM6Jm8dnGfUTKqEX1+5LdXJjy5cMBYwltSfT2E3qQg==';
            script.crossOrigin = 'anonymous';
            script.onload = () => {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve(window.pdfjsLib);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // --- Generar miniatura desde primera página del PDF ---
    async function renderThumbnail(pdfUrl, container) {
        if (!pdfUrl || !container) return;
        if (state.thumbnails[pdfUrl]) {
            // Usar caché
            const img = container.querySelector('img');
            const placeholder = container.querySelector('.pdf-placeholder');
            const loader = container.querySelector('.thumbnail-loader');
            if (placeholder) placeholder.classList.add('hidden');
            if (loader) loader.classList.add('hidden');
            if (img) {
                img.src = state.thumbnails[pdfUrl];
                img.classList.remove('hidden');
            }
            return;
        }

        try {
            const pdfjs = await ensurePdfJs();
            const loadingTask = pdfjs.getDocument(pdfUrl);
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 0.5 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            const dataURL = canvas.toDataURL('image/jpeg', 0.85);
            
            // Guardar en caché
            state.thumbnails[pdfUrl] = dataURL;

            // Actualizar UI
            const img = container.querySelector('img');
            const placeholder = container.querySelector('.pdf-placeholder');
            const loader = container.querySelector('.thumbnail-loader');
            if (placeholder) placeholder.classList.add('hidden');
            if (loader) loader.classList.add('hidden');
            if (img) {
                img.src = dataURL;
                img.classList.remove('hidden');
            }
        } catch (err) {
            console.warn('Error generando carátula:', pdfUrl, err);
            // Fallback: mantener el icono, ocultar loader
            const loader = container.querySelector('.thumbnail-loader');
            if (loader) loader.classList.add('hidden');
        }
    }

    // --- Observador de intersección para lazy loading de thumbnails ---
    let thumbnailObserver;
    function observeThumbnails() {
        if (!thumbnailObserver) {
            thumbnailObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const container = entry.target;
                        const pdfUrl = container.dataset.pdfUrl;
                        if (pdfUrl) {
                            renderThumbnail(pdfUrl, container);
                            thumbnailObserver.unobserve(container); // una sola vez
                        }
                    }
                });
            }, { rootMargin: '100px' }); // precargar antes de entrar
        }

        document.querySelectorAll('.thumbnail-container[data-pdf-url]:not(.observed)').forEach(el => {
            el.classList.add('observed');
            thumbnailObserver.observe(el);
        });
    }

    // --- Obtener lista de PDFs desde GitHub (sin cambios) ---
    async function fetchBooks() {
        state.isLoading = true;
        state.error = null;
        renderModalContent();

        try {
            const response = await fetch(GITHUB_RELEASE_URL);
            if (!response.ok) throw new Error('No se pudo conectar con GitHub');

            const release = await response.json();
            
            state.books = release.assets
                .filter(asset => asset.name.toLowerCase().endsWith('.pdf'))
                .map(asset => ({
                    id: asset.id,
                    name: asset.name.replace('.pdf', '').replace(/-/g, ' '),
                    size: asset.size,
                    downloadUrl: asset.browser_download_url,
                    updatedAt: new Date(asset.updated_at)
                }))
                .sort((a, b) => a.name.localeCompare(b.name));

            // Limpiar caché de thumbnails si hay nuevos libros (para refrescar)
            const currentUrls = new Set(state.books.map(b => b.downloadUrl));
            Object.keys(state.thumbnails).forEach(url => {
                if (!currentUrls.has(url)) delete state.thumbnails[url];
            });

        } catch (error) {
            console.error('Error fetching GitHub release:', error);
            state.error = error.message;
            state.books = [];
        } finally {
            state.isLoading = false;
            renderModalContent();
            observeThumbnails(); // activar lazy loading
        }
    }

    // --- Crear modal (estructura Apple mejorada) ---
    function createModal() {
        if (document.getElementById('library-modal')) return;

        const modalHTML = `
            <div id="library-modal" class="fixed inset-0 z-[9999] hidden items-center justify-center p-4 bg-black/40 backdrop-blur-md">
                <div class="w-full max-w-5xl max-h-[85vh] apple-glass rounded-3xl overflow-hidden flex flex-col animate-slide-up shadow-2xl">
                    <div class="apple-titlebar flex items-center justify-between px-6 py-4 border-b border-white/20 dark:border-white/5">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <i class="fa-solid fa-book-open text-white text-base"></i>
                            </div>
                            <div>
                                <h2 class="font-semibold text-gray-800 dark:text-white text-lg font-apple tracking-tight">Library</h2>
                                <p id="lib-subtitle" class="text-xs text-gray-500 dark:text-gray-400 font-apple">NCLEX PDF Collection</p>
                            </div>
                        </div>
                        <button onclick="window.library?.close()" class="w-9 h-9 rounded-full hover:bg-gray-200/70 dark:hover:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-all">
                            <i class="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>
                    <div id="lib-content" class="flex-1 overflow-y-auto p-6 apple-scrollbar" style="max-height: calc(85vh - 80px);"></div>
                    <div class="px-6 py-4 border-t border-white/20 dark:border-white/5 text-xs text-gray-500 flex justify-between items-center bg-white/30 dark:bg-black/30 backdrop-blur-sm">
                        <span class="flex items-center gap-1"><i class="fa-regular fa-circle-check text-blue-500"></i> GitHub Releases · Actualizado automáticamente</span>
                        <button onclick="window.library.refresh()" class="px-4 py-2 rounded-xl hover:bg-gray-200/70 dark:hover:bg-white/10 transition-all flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                            <i class="fa-solid fa-arrow-rotate-right"></i> ${t('Actualizar', 'Refresh')}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        injectAppleStyles();
    }

    // --- Renderizar contenido del modal con carátulas Apple ---
    function renderModalContent() {
        const contentEl = document.getElementById('lib-content');
        const subtitleEl = document.getElementById('lib-subtitle');
        if (!contentEl) return;

        if (subtitleEl) {
            subtitleEl.textContent = state.books.length 
                ? `${state.books.length} PDFs disponibles` 
                : 'NCLEX PDF Collection';
        }

        if (state.isLoading) {
            contentEl.innerHTML = `
                <div class="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <div class="relative w-16 h-16 mb-4">
                        <div class="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                        <div class="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p class="font-medium font-apple">Conectando con GitHub...</p>
                    <p class="text-xs mt-2 opacity-75">Obteniendo catálogo de libros</p>
                </div>
            `;
            return;
        }

        if (state.error) {
            contentEl.innerHTML = `
                <div class="flex flex-col items-center justify-center h-64 text-center px-6">
                    <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                        <i class="fa-solid fa-exclamation-triangle text-2xl text-red-600 dark:text-red-400"></i>
                    </div>
                    <h3 class="font-semibold text-gray-800 dark:text-white mb-1 font-apple">Error de conexión</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${state.error}</p>
                    <button onclick="window.library.refresh()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-rotate"></i> Reintentar
                    </button>
                </div>
            `;
            return;
        }

        if (state.books.length === 0) {
            contentEl.innerHTML = `
                <div class="flex flex-col items-center justify-center h-64">
                    <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <i class="fa-solid fa-box-open text-2xl text-gray-500"></i>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 font-apple">No se encontraron PDFs en el release BOOKS</p>
                </div>
            `;
            return;
        }

        // Grid de libros con carátulas reales
        let html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-5">`;
        state.books.forEach(book => {
            const formattedSize = formatFileSize(book.size);
            const date = book.updatedAt.toLocaleDateString();
            html += `
                <div class="apple-book-card apple-glass rounded-2xl p-4 flex gap-4 group transition-all">
                    <!-- Contenedor de carátula con lazy loading -->
                    <div class="thumbnail-container relative flex-shrink-0 rounded-xl overflow-hidden" data-pdf-url="${book.downloadUrl}">
                        <!-- Placeholder con icono PDF -->
                        <div class="pdf-placeholder absolute inset-0 bg-gradient-to-br from-blue-500/90 to-purple-600/90 flex items-center justify-center text-white">
                            <i class="fa-solid fa-file-pdf text-2xl"></i>
                        </div>
                        <!-- Imagen de carátula (oculta inicialmente) -->
                        <img class="w-full h-full object-cover hidden" alt="${book.name}">
                        <!-- Loader durante generación -->
                        <div class="thumbnail-loader absolute inset-0 hidden items-center justify-center bg-black/30 backdrop-blur-sm">
                            <i class="fa-solid fa-circle-notch fa-spin text-white text-lg"></i>
                        </div>
                    </div>
                    
                    <div class="flex-1 min-w-0 flex flex-col">
                        <h3 class="font-bold text-gray-900 dark:text-white text-base line-clamp-2 mb-1 font-apple tracking-tight" title="${book.name}">
                            ${book.name}
                        </h3>
                        <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                            <span class="flex items-center gap-1"><i class="fa-regular fa-file-pdf"></i>PDF</span>
                            <span>•</span>
                            <span class="flex items-center gap-1"><i class="fa-regular fa-hard-drive"></i>${formattedSize}</span>
                            <span>•</span>
                            <span class="flex items-center gap-1"><i class="fa-regular fa-calendar"></i>${date}</span>
                        </div>
                        <a href="${book.downloadUrl}" 
                           target="_blank"
                           class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-600/20 hover:shadow-blue-600/40 transition-all">
                            <i class="fa-solid fa-cloud-arrow-down mr-2"></i>
                            ${t('Descargar', 'Download')}
                        </a>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        contentEl.innerHTML = html;
    }

    // --- Botón flotante (estilo Live Activity) ---
    function createFloatingButton() {
        if (document.getElementById('library-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'library-btn';
        btn.onclick = () => window.library?.open();
        btn.className = 'fixed top-6 right-6 w-14 h-14 apple-glass bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl z-[9980] flex items-center justify-center transition-all duration-300 hover:-translate-y-1 active:scale-95 group border border-white/30';
        
        btn.innerHTML = `
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <i class="fa-solid fa-book-open text-xl relative group-hover:scale-110 transition-transform"></i>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
            <div class="absolute top-full right-0 mt-3 px-4 py-2 bg-gray-900/90 backdrop-blur-md text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
                <span class="lang-es">Biblioteca NCLEX</span>
                <span class="lang-en hidden-lang">NCLEX Library</span>
                <div class="absolute -top-1.5 right-6 w-3 h-3 bg-gray-900/90 rotate-45 border-l border-t border-white/10"></div>
            </div>
        `;

        document.body.appendChild(btn);
    }

    // --- API pública (sin cambios) ---
    window.library = {
        async open() {
            createModal();
            const modal = document.getElementById('library-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                if (state.books.length === 0 && !state.isLoading) {
                    await fetchBooks();
                } else {
                    observeThumbnails(); // Si ya hay libros, observar igualmente
                }
            }
        },

        close() {
            const modal = document.getElementById('library-modal');
            if (modal) modal.classList.add('hidden');
        },

        async refresh() {
            // Limpiar caché de thumbnails para regenerar
            state.thumbnails = {};
            await fetchBooks();
        }
    };

    // --- Inicialización ---
    function init() {
        injectAppleStyles();
        createFloatingButton();
        createModal();
        // Precargar pdf.js en segundo plano
        ensurePdfJs().catch(e => console.warn('PDF.js no disponible, se usará icono por defecto', e));
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => fetchBooks());
        } else {
            fetchBooks();
        }
    }

    init();
})();