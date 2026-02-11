// premium_books_library.js — Apple Books redesign + real covers
(function() {
    'use strict';

    const GITHUB_RELEASE_URL = 'https://api.github.com/repos/Nclexpass/NCLEX1.2/releases/tags/BOOKS';
    const GITHUB_DOWNLOAD_BASE = 'https://github.com/Nclexpass/NCLEX1.2/releases/download/BOOKS/';

    // --- Estado ---
    const state = {
        books: [],
        isLoading: false,
        error: null,
        thumbnails: {}      // caché de carátulas
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

    // --- Estilos Apple Books puros ---
    function injectAppleStyles() {
        if (document.getElementById('apple-books-styles')) return;
        const style = document.createElement('style');
        style.id = 'apple-books-styles';
        style.innerHTML = `
            /* Base Apple SF */
            .font-apple {
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
                letter-spacing: -0.01em;
            }

            /* Cristal suave Apple */
            .apple-glass {
                background: rgba(255,255,255,0.88);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                border: 0.5px solid rgba(0,0,0,0.04);
            }
            .dark .apple-glass {
                background: rgba(30,30,32,0.92);
                border-color: rgba(255,255,255,0.06);
            }

            /* Scroll nativo macOS */
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
            }

            /* Contenedor de carátula estilo Apple Books */
            .thumbnail-container {
                width: 120px;
                height: 160px;
                border-radius: 12px;
                background: #f5f5f7;
                box-shadow: 0 8px 20px -6px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.02);
                transition: transform 0.2s ease, box-shadow 0.3s ease;
                overflow: hidden;
                flex-shrink: 0;
            }
            .dark .thumbnail-container {
                background: #1c1c1e;
                box-shadow: 0 8px 20px -6px rgba(0,0,0,0.5);
            }
            .group:hover .thumbnail-container {
                transform: scale(1.02);
                box-shadow: 0 16px 30px -8px rgba(0,0,0,0.15);
            }

            /* Placeholder PDF (minimalista) */
            .pdf-placeholder {
                background: #e8e8ed;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #8e8e93;
                font-size: 36px;
            }
            .dark .pdf-placeholder {
                background: #2c2c2e;
                color: #aeaeb2;
            }

            /* Tarjetas de libro — diseño Apple Books */
            .apple-book-card {
                background: white;
                border-radius: 20px;
                padding: 20px;
                display: flex;
                gap: 20px;
                transition: all 0.2s ease;
                border: 1px solid rgba(0,0,0,0.04);
                box-shadow: 0 2px 12px rgba(0,0,0,0.02);
            }
            .dark .apple-book-card {
                background: #1c1c1e;
                border-color: rgba(255,255,255,0.06);
                box-shadow: 0 2px 12px rgba(0,0,0,0.2);
            }
            .apple-book-card:hover {
                background: #fafafc;
                border-color: rgba(0,122,255,0.2);
                box-shadow: 0 8px 24px rgba(0,122,255,0.08);
            }
            .dark .apple-book-card:hover {
                background: #242426;
                border-color: rgba(10,132,255,0.3);
            }

            /* Título de libro */
            .book-title {
                font-size: 1.1rem;
                font-weight: 600;
                line-height: 1.3;
                margin-bottom: 6px;
                color: #1d1d1f;
            }
            .dark .book-title {
                color: #fff;
            }

            /* Metadatos */
            .book-meta {
                font-size: 0.75rem;
                color: #8e8e93;
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
                letter-spacing: -0.01em;
            }

            /* Botón de descarga — estilo link */
            .download-link {
                display: inline-flex;
                align-items: center;
                padding: 8px 16px;
                border-radius: 40px;
                font-size: 0.85rem;
                font-weight: 500;
                color: #007aff;
                background: rgba(0,122,255,0.05);
                border: 0.5px solid rgba(0,122,255,0.2);
                transition: all 0.2s;
                text-decoration: none;
                width: fit-content;
            }
            .dark .download-link {
                color: #0a84ff;
                background: rgba(10,132,255,0.1);
                border-color: rgba(10,132,255,0.3);
            }
            .download-link:hover {
                background: rgba(0,122,255,0.1);
                border-color: #007aff;
            }

            /* Modal Apple Books */
            .apple-modal {
                background: rgba(255,255,255,0.7);
                backdrop-filter: blur(40px);
                -webkit-backdrop-filter: blur(40px);
                border-radius: 32px;
                border: 0.5px solid rgba(255,255,255,0.5);
                box-shadow: 0 24px 48px -16px rgba(0,0,0,0.2);
            }
            .dark .apple-modal {
                background: rgba(20,20,22,0.8);
                border-color: rgba(255,255,255,0.1);
            }

            /* Botón flotante — discreto Apple */
            #library-btn {
                width: 52px;
                height: 52px;
                border-radius: 28px;
                background: white;
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 0.5px solid rgba(0,0,0,0.1);
                box-shadow: 0 8px 20px rgba(0,0,0,0.06);
                color: #007aff;
                transition: all 0.2s ease;
            }
            .dark #library-btn {
                background: #1c1c1e;
                border-color: rgba(255,255,255,0.15);
                color: #0a84ff;
                box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            }
            #library-btn:hover {
                transform: scale(1.04);
                box-shadow: 0 12px 28px rgba(0,122,255,0.2);
                background: #f8f8fc;
            }
            .dark #library-btn:hover {
                background: #2c2c2e;
                box-shadow: 0 12px 28px rgba(10,132,255,0.2);
            }
        `;
        document.head.appendChild(style);
    }

    // --- pdf.js lazy loader ---
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

    // --- Generar miniatura desde primera página del PDF (alta calidad) ---
    async function renderThumbnail(pdfUrl, container) {
        if (!pdfUrl || !container) return;
        if (state.thumbnails[pdfUrl]) {
            const img = container.querySelector('img');
            const placeholder = container.querySelector('.pdf-placeholder');
            const loader = container.querySelector('.thumbnail-loader');
            if (placeholder) placeholder.style.display = 'none';
            if (loader) loader.style.display = 'none';
            if (img) {
                img.src = state.thumbnails[pdfUrl];
                img.style.display = 'block';
            }
            return;
        }

        try {
            const pdfjs = await ensurePdfJs();
            const loadingTask = pdfjs.getDocument(pdfUrl);
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            // Escala para que ocupe 120x160 aprox
            const viewport = page.getViewport({ scale: 0.9 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            const dataURL = canvas.toDataURL('image/jpeg', 0.9);
            state.thumbnails[pdfUrl] = dataURL;

            const img = container.querySelector('img');
            const placeholder = container.querySelector('.pdf-placeholder');
            const loader = container.querySelector('.thumbnail-loader');
            if (placeholder) placeholder.style.display = 'none';
            if (loader) loader.style.display = 'none';
            if (img) {
                img.src = dataURL;
                img.style.display = 'block';
            }
        } catch (err) {
            console.warn('Error generating thumbnail:', err);
            const loader = container.querySelector('.thumbnail-loader');
            if (loader) loader.style.display = 'none';
        }
    }

    // --- Lazy loading observer ---
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
                            thumbnailObserver.unobserve(container);
                        }
                    }
                });
            }, { rootMargin: '200px' });
        }

        document.querySelectorAll('.thumbnail-container[data-pdf-url]:not(.observed)').forEach(el => {
            el.classList.add('observed');
            thumbnailObserver.observe(el);
        });
    }

    // --- Fetch desde GitHub (sin cambios funcionales) ---
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

            // Limpiar caché de thumbnails si ya no existen
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
            observeThumbnails();
        }
    }

    // --- Crear modal con diseño Apple Books ---
    function createModal() {
        if (document.getElementById('library-modal')) return;

        const modalHTML = `
            <div id="library-modal" class="fixed inset-0 z-[9999] hidden items-center justify-center p-6 bg-black/30 backdrop-blur-sm">
                <div class="w-full max-w-6xl max-h-[90vh] apple-modal overflow-hidden flex flex-col animate-slide-up">
                    <!-- Header minimalista -->
                    <div class="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <i class="fa-solid fa-book text-blue-600 dark:text-blue-400 text-base"></i>
                            </div>
                            <div>
                                <h2 class="font-semibold text-gray-800 dark:text-white text-lg font-apple tracking-tight">Biblioteca NCLEX</h2>
                                <p id="lib-subtitle" class="text-xs text-gray-500 dark:text-gray-400 font-apple">PDFs actualizados desde GitHub</p>
                            </div>
                        </div>
                        <button onclick="window.library?.close()" class="w-9 h-9 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors">
                            <i class="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>
                    <!-- Contenido -->
                    <div id="lib-content" class="flex-1 overflow-y-auto p-6 apple-scrollbar" style="max-height: calc(90vh - 80px);"></div>
                    <!-- Footer simple -->
                    <div class="px-6 py-3 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-xs text-gray-500">
                        <span><i class="fa-regular fa-circle-check text-blue-500 mr-1"></i> Fuente: GitHub Releases</span>
                        <button onclick="window.library.refresh()" class="px-4 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5">
                            <i class="fa-solid fa-arrow-rotate-right"></i> Actualizar
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        injectAppleStyles();
    }

    // --- Renderizar contenido con carátulas grandes ---
    function renderModalContent() {
        const contentEl = document.getElementById('lib-content');
        const subtitleEl = document.getElementById('lib-subtitle');
        if (!contentEl) return;

        if (subtitleEl) {
            subtitleEl.textContent = state.books.length 
                ? `${state.books.length} libros disponibles` 
                : 'NCLEX PDF Collection';
        }

        if (state.isLoading) {
            contentEl.innerHTML = `
                <div class="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <div class="relative w-14 h-14 mb-4">
                        <div class="absolute inset-0 border-3 border-gray-200 dark:border-gray-700 rounded-full"></div>
                        <div class="absolute inset-0 border-3 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p class="font-medium font-apple">Cargando biblioteca...</p>
                </div>
            `;
            return;
        }

        if (state.error) {
            contentEl.innerHTML = `
                <div class="flex flex-col items-center justify-center h-64 text-center px-6">
                    <div class="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                        <i class="fa-solid fa-exclamation-triangle text-xl text-red-600 dark:text-red-400"></i>
                    </div>
                    <h3 class="font-semibold text-gray-800 dark:text-white mb-1 font-apple">Error de conexión</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${state.error}</p>
                    <button onclick="window.library.refresh()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-sm transition-all flex items-center gap-2">
                        <i class="fa-solid fa-rotate"></i> Reintentar
                    </button>
                </div>
            `;
            return;
        }

        if (state.books.length === 0) {
            contentEl.innerHTML = `
                <div class="flex flex-col items-center justify-center h-64">
                    <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <i class="fa-solid fa-box-open text-xl text-gray-500"></i>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 font-apple">No hay PDFs en este release</p>
                </div>
            `;
            return;
        }

        // Grid de libros — estilo Apple Books
        let html = `<div class="grid grid-cols-1 gap-5">`;
        state.books.forEach(book => {
            const formattedSize = formatFileSize(book.size);
            const date = book.updatedAt.toLocaleDateString();
            html += `
                <div class="apple-book-card group">
                    <!-- Thumbnail grande 120x160 -->
                    <div class="thumbnail-container relative" data-pdf-url="${book.downloadUrl}">
                        <div class="pdf-placeholder absolute inset-0">
                            <i class="fa-regular fa-file-pdf"></i>
                        </div>
                        <img class="absolute inset-0 w-full h-full object-cover hidden" alt="${book.name}">
                        <div class="thumbnail-loader absolute inset-0 hidden items-center justify-center bg-black/20 backdrop-blur-sm">
                            <i class="fa-solid fa-circle-notch fa-spin text-white text-lg"></i>
                        </div>
                    </div>
                    <!-- Info -->
                    <div class="flex-1 flex flex-col">
                        <h3 class="book-title font-apple line-clamp-2" title="${book.name}">
                            ${book.name}
                        </h3>
                        <div class="book-meta font-apple">
                            <span class="flex items-center gap-1"><i class="fa-regular fa-file-pdf"></i>PDF</span>
                            <span class="flex items-center gap-1"><i class="fa-regular fa-hard-drive"></i>${formattedSize}</span>
                            <span class="flex items-center gap-1"><i class="fa-regular fa-calendar"></i>${date}</span>
                        </div>
                        <a href="${book.downloadUrl}" 
                           target="_blank"
                           class="download-link font-apple">
                            <i class="fa-solid fa-arrow-down mr-1.5"></i>
                            ${t('Descargar', 'Download')}
                        </a>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        contentEl.innerHTML = html;
    }

    // --- Botón flotante minimalista Apple ---
    function createFloatingButton() {
        if (document.getElementById('library-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'library-btn';
        btn.onclick = () => window.library?.open();
        btn.className = 'fixed top-6 right-6 z-[9980] flex items-center justify-center shadow-lg';
        
        btn.innerHTML = `
            <i class="fa-solid fa-book text-2xl"></i>
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            <div class="absolute top-full right-0 mt-3 px-4 py-2 bg-white/90 backdrop-blur-xl text-gray-800 text-xs font-medium rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg border border-black/5 dark:bg-gray-800/90 dark:text-white dark:border-white/10">
                <span class="lang-es">Biblioteca</span>
                <span class="lang-en hidden-lang">Library</span>
            </div>
        `;

        document.body.appendChild(btn);
    }

    // --- API pública (idéntica) ---
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
                    observeThumbnails();
                }
            }
        },

        close() {
            const modal = document.getElementById('library-modal');
            if (modal) modal.classList.add('hidden');
        },

        async refresh() {
            state.thumbnails = {};
            await fetchBooks();
        }
    };

    // --- Inicialización ---
    function init() {
        injectAppleStyles();
        createFloatingButton();
        createModal();
        ensurePdfJs().catch(() => {});
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => fetchBooks());
        } else {
            fetchBooks();
        }
    }

    init();
})();