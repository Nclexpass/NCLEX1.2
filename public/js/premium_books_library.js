// premium_books_library.js — Rediseño iPod Classic (Cover Flow + Click Wheel)
(function() {
    'use strict';

    const GITHUB_RELEASE_URL = 'https://api.github.com/repos/Nclexpass/NCLEX1.2/releases/tags/BOOKS';
    const GITHUB_DOWNLOAD_BASE = 'https://github.com/Nclexpass/NCLEX1.2/releases/download/BOOKS/';

    // --- Estado (idéntico) ---
    const state = {
        books: [],
        isLoading: false,
        error: null,
        thumbnails: {}
    };

    // --- Utilidades (sin cambios) ---
    function t(es, en) {
        const esEl = document.querySelector('.lang-es');
        return esEl && esEl.offsetParent !== null ? es : en;
    }

    function formatFileSize(bytes) {
        if (!bytes) return '';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    // --- 🎨 ESTILOS IPOD CLASSIC (reemplaza por completo los Apple Books) ---
    function injectIPodStyles() {
        if (document.getElementById('ipod-classic-styles')) return;
        const style = document.createElement('style');
        style.id = 'ipod-classic-styles';
        style.innerHTML = `
            /* Fuente Chicago / System */
            .ipod-font {
                font-family: 'Chicago', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
                letter-spacing: 0.5px;
            }

            /* ------------------------------
               CARCASA DEL IPOD (modal)
            ------------------------------ */
            .ipod-body {
                background: linear-gradient(145deg, #e6e6e6 0%, #cdcdcd 100%);
                border-radius: 32px;
                border: 1px solid rgba(0,0,0,0.25);
                box-shadow: 
                    inset 0 2px 5px rgba(255,255,255,0.6),
                    inset 0 -2px 5px rgba(0,0,0,0.1),
                    0 15px 30px rgba(0,0,0,0.3);
                padding: 20px 18px 18px 18px;
                position: relative;
                width: 440px;
                max-width: 95vw;
                margin: 0 auto;
            }

            /* PANTALLA (efecto cristal curvo) */
            .ipod-screen {
                background: #1e1e1e;
                border-radius: 18px;
                padding: 16px 12px;
                box-shadow: 
                    inset 0 0 0 2px rgba(0,0,0,0.7),
                    inset 0 0 20px rgba(0,0,0,0.5),
                    0 6px 0 #0a0a0a;
                border-bottom: 2px solid #3a3a3a;
                margin-bottom: 20px;
            }

            /* BARRA DE ESTADO IPOD */
            .ipod-status-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #bbb;
                font-size: 11px;
                padding: 0 4px 8px 4px;
                border-bottom: 1px solid #333;
                margin-bottom: 12px;
                text-transform: uppercase;
                font-family: 'Chicago', monospace;
            }
            .ipod-battery {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .ipod-battery i {
                color: #7ed321;
            }

            /* --- CONTENEDOR DE CARÁTULAS (scroll horizontal con snap) --- */
            .ipod-coverflow {
                display: flex;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                gap: 20px;
                padding: 8px 4px 20px 4px;
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none;  /* IE */
            }
            .ipod-coverflow::-webkit-scrollbar {
                display: none; /* Chrome/Safari */
            }

            /* Cada carátula (álbum) */
            .ipod-cover-item {
                flex: 0 0 auto;
                scroll-snap-align: center;
                width: 160px;
                display: flex;
                flex-direction: column;
                align-items: center;
                transition: transform 0.2s ease;
                cursor: pointer;
            }
            .ipod-cover-item:hover {
                transform: scale(1.02);
            }

            /* Contenedor cuadrado de la carátula (efecto polaroid) */
            .ipod-thumb {
                width: 140px;
                height: 140px;
                border-radius: 12px;
                background: #3a3a3a;
                box-shadow: 0 8px 0 #0f0f0f, 0 12px 25px rgba(0,0,0,0.4);
                overflow: hidden;
                position: relative;
                border: 2px solid #f0f0f0;
                margin-bottom: 12px;
            }
            .ipod-thumb img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: none;
            }
            .ipod-thumb .pdf-placeholder {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                background: #2a2a2a;
                color: #8e8e93;
                font-size: 40px;
            }
            .ipod-thumb .thumbnail-loader {
                position: absolute;
                inset: 0;
                display: none;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,0.5);
                backdrop-filter: blur(2px);
                color: white;
            }

            /* Título del libro (como en iPod) */
            .ipod-album-title {
                font-size: 12px;
                font-weight: 600;
                color: #fff;
                text-align: center;
                line-height: 1.3;
                max-width: 140px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-shadow: 0 1px 2px black;
                font-family: 'Chicago', 'Helvetica Neue', sans-serif;
                letter-spacing: 0.5px;
            }
            .ipod-album-meta {
                font-size: 9px;
                color: #aaa;
                margin-top: 4px;
                display: flex;
                gap: 8px;
            }

            /* Botón de descarga oculto, aparece al hover */
            .ipod-download-icon {
                position: absolute;
                bottom: 6px;
                right: 6px;
                background: rgba(0,122,255,0.9);
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.2s;
                border: 1px solid white;
                box-shadow: 0 2px 6px black;
            }
            .ipod-cover-item:hover .ipod-download-icon {
                opacity: 1;
            }

            /* --- CLICK WHEEL (la rueda mítica) --- */
            .ipod-clickwheel {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 8px;
            }
            .wheel-ring {
                width: 180px;
                height: 180px;
                background: radial-gradient(circle at 30% 30%, #f5f5f5, #bdbdbd);
                border-radius: 50%;
                box-shadow: 
                    inset 0 -8px 0 #7a7a7a,
                    inset 0 8px 10px rgba(255,255,255,0.7),
                    0 10px 15px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }
            .wheel-inner {
                width: 90px;
                height: 90px;
                background: radial-gradient(circle at 30% 30%, #e0e0e0, #a0a0a0);
                border-radius: 50%;
                box-shadow: inset 0 -4px 0 #6e6e6e, inset 0 4px 6px white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: #333;
                font-weight: bold;
                text-transform: uppercase;
            }
            .wheel-button {
                position: absolute;
                color: #222;
                font-weight: bold;
                font-size: 14px;
                text-shadow: 0 1px 0 white;
            }
            .menu-btn { top: 20px; left: 50%; transform: translateX(-50%); }
            .prev-btn { left: 20px; top: 50%; transform: translateY(-50%); }
            .next-btn { right: 20px; top: 50%; transform: translateY(-50%); }
            .playpause-btn { bottom: 20px; left: 50%; transform: translateX(-50%); }
            .select-center { 
                width: 50px; 
                height: 50px; 
                background: radial-gradient(circle at 30% 30%, #d0d0d0, #909090);
                border-radius: 50%;
                box-shadow: inset 0 -2px 0 #5a5a5a, inset 0 2px 6px white;
            }

            /* Loader / Error / Empty states (con estilo iPod) */
            .ipod-screen-message {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 260px;
                color: #bbb;
                font-family: 'Chicago', monospace;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }

    // --- pdf.js lazy loader (sin cambios) ---
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

    // --- Generar miniatura (adaptada a contenedor cuadrado) ---
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
            // Escala para llenar bien 140x140
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

    // --- Lazy loading observer (apunta a .ipod-thumb) ---
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

        document.querySelectorAll('.ipod-thumb[data-pdf-url]:not(.observed)').forEach(el => {
            el.classList.add('observed');
            thumbnailObserver.observe(el);
        });
    }

    // --- Fetch desde GitHub (idéntico) ---
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

    // --- 🎛️ CREAR MODAL CON FORMA DE IPOD CLASSIC ---
    function createModal() {
        if (document.getElementById('library-modal')) return;

        const modalHTML = `
            <div id="library-modal" class="fixed inset-0 z-[9999] hidden items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div class="ipod-body">
                    <!-- PANTALLA IPOD -->
                    <div class="ipod-screen">
                        <div class="ipod-status-bar">
                            <span>NCLEX</span>
                            <span class="ipod-battery">
                                <i class="fa-solid fa-bolt"></i>
                                <i class="fa-regular fa-circle"></i>
                                <i class="fa-regular fa-circle"></i>
                                <i class="fa-regular fa-circle"></i>
                                <i class="fa-regular fa-circle"></i>
                            </span>
                        </div>
                        <!-- CONTENIDO DINÁMICO (carátulas / loader / error) -->
                        <div id="lib-content" class="min-h-[260px]"></div>
                    </div>
                    <!-- CLICK WHEEL (puramente decorativa pero con botones) -->
                    <div class="ipod-clickwheel">
                        <div class="wheel-ring">
                            <div class="wheel-inner">
                                <div class="select-center"></div>
                            </div>
                            <span class="wheel-button menu-btn">MENÚ</span>
                            <span class="wheel-button prev-btn"><i class="fa-solid fa-backward-step"></i></span>
                            <span class="wheel-button next-btn"><i class="fa-solid fa-forward-step"></i></span>
                            <span class="wheel-button playpause-btn"><i class="fa-solid fa-play"></i><i class="fa-solid fa-pause"></i></span>
                        </div>
                    </div>
                    <!-- Footer sutil (fuente) -->
                    <div class="text-center text-[9px] text-gray-600 mt-3 font-mono tracking-wider">
                        <span>GitHub Release • NCLEX</span>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        injectIPodStyles();
    }

    // --- 🖼️ RENDERIZAR CARÁTULAS (Cover Flow horizontal) ---
    function renderModalContent() {
        const contentEl = document.getElementById('lib-content');
        if (!contentEl) return;

        // Loading
        if (state.isLoading) {
            contentEl.innerHTML = `
                <div class="ipod-screen-message">
                    <div class="w-12 h-12 border-3 border-gray-500 border-t-white rounded-full animate-spin mb-4"></div>
                    <p class="text-sm">Cargando biblioteca...</p>
                    <p class="text-[10px] mt-2">⌛ buscando álbumes</p>
                </div>
            `;
            return;
        }

        // Error
        if (state.error) {
            contentEl.innerHTML = `
                <div class="ipod-screen-message">
                    <i class="fa-solid fa-exclamation-triangle text-4xl text-yellow-500 mb-3"></i>
                    <p class="text-sm font-bold">Error de conexión</p>
                    <p class="text-[10px] mt-1 px-4">${state.error}</p>
                    <button onclick="window.library.refresh()" class="mt-5 px-5 py-2 bg-blue-600 text-white text-xs rounded-full shadow-md">
                        <i class="fa-solid fa-rotate mr-1"></i> Reintentar
                    </button>
                </div>
            `;
            return;
        }

        // Vacío
        if (state.books.length === 0) {
            contentEl.innerHTML = `
                <div class="ipod-screen-message">
                    <i class="fa-regular fa-compact-disc text-5xl text-gray-600 mb-3"></i>
                    <p class="text-sm">No hay PDFs</p>
                    <p class="text-[10px] mt-1">el release está vacío</p>
                </div>
            `;
            return;
        }

        // 🎵 COVER FLOW: carátulas horizontales con snap
        let html = `<div class="ipod-coverflow">`;
        state.books.forEach(book => {
            const formattedSize = formatFileSize(book.size);
            const date = book.updatedAt.toLocaleDateString();
            html += `
                <div class="ipod-cover-item" onclick="window.open('${book.downloadUrl}', '_blank')">
                    <div class="ipod-thumb" data-pdf-url="${book.downloadUrl}">
                        <div class="pdf-placeholder">
                            <i class="fa-regular fa-file-pdf"></i>
                        </div>
                        <img class="absolute inset-0 w-full h-full object-cover hidden" alt="${book.name}">
                        <div class="thumbnail-loader">
                            <i class="fa-solid fa-circle-notch fa-spin text-white text-lg"></i>
                        </div>
                        <div class="ipod-download-icon">
                            <i class="fa-solid fa-arrow-down"></i>
                        </div>
                    </div>
                    <span class="ipod-album-title" title="${book.name}">${book.name}</span>
                    <span class="ipod-album-meta">
                        <span>${formattedSize}</span>
                        <span>•</span>
                        <span>${date}</span>
                    </span>
                </div>
            `;
        });
        html += '</div>';
        contentEl.innerHTML = html;
    }

    // --- Botón flotante (mismo diseño, pero con tooltip sutil) ---
    function createFloatingButton() {
        if (document.getElementById('library-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'library-btn';
        btn.onclick = () => window.library?.open();
        btn.className = 'fixed top-6 right-6 z-[9980] flex items-center justify-center shadow-lg';
        btn.style.background = 'linear-gradient(145deg, #f0f0f0, #d0d0d0)';
        btn.style.borderRadius = '50%';
        btn.style.width = '56px';
        btn.style.height = '56px';
        btn.style.border = '1px solid rgba(0,0,0,0.2)';
        btn.style.boxShadow = 'inset 0 2px 3px white, inset 0 -2px 3px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.2)';
        
        btn.innerHTML = `
            <i class="fa-solid fa-ipod text-3xl text-blue-600"></i>
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            <div class="absolute top-full right-0 mt-3 px-4 py-2 bg-black/80 text-white text-xs font-medium rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                <span class="lang-es">Biblioteca iPod</span>
                <span class="lang-en hidden-lang">iPod Library</span>
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
        injectIPodStyles();
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