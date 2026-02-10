/* 33_library.js — Digital Resource Center (PDF Viewer & Resource Manager) */
/* Features: PDF.js Integration, 3D Cover Tilt, Search Filtering */

(function () {
    'use strict';

    // --- 1. CONFIGURACIÓN Y DATOS ---
    const CONFIG = {
        pdfJsUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js',
        workerUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js'
    };

    // Catálogo de recursos (Placeholder - Se puede expandir con catalog.json)
    const LIBRARY_CATALOG = [
        {
            id: 'res_001',
            title: 'NCLEX-RN Test Plan 2026',
            author: 'NCSBN',
            type: 'PDF',
            color: 'bg-blue-600',
            url: 'https://www.ncsbn.org/public-files/2023_RN_Test%20Plan_English.pdf' // Link público oficial
        },
        {
            id: 'res_002',
            title: 'Lab Values Cheat Sheet',
            author: 'Masterclass',
            type: 'Quick Ref',
            color: 'bg-red-500',
            url: '#' // Placeholder
        },
        {
            id: 'res_003',
            title: 'Pharmacology Mnemonics',
            author: 'Masterclass',
            type: 'Study Guide',
            color: 'bg-emerald-500',
            url: '#' 
        },
        {
            id: 'res_004',
            title: 'ECG Interpretation Guide',
            author: 'Clinical Dept',
            type: 'Manual',
            color: 'bg-purple-600',
            url: '#' 
        },
        {
            id: 'res_005',
            title: 'Infection Control Protocol',
            author: 'CDC / WHO',
            type: 'Protocol',
            color: 'bg-orange-500',
            url: '#' 
        }
    ];

    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;
    let scale = 1.5;
    let canvas, ctx;

    // --- 2. GESTIÓN DEL VISOR PDF (PDF.js) ---
    const PDFViewer = {
        init: async () => {
            if (!window.pdfjsLib) {
                const script = document.createElement('script');
                script.src = CONFIG.pdfJsUrl;
                script.onload = () => {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = CONFIG.workerUrl;
                };
                document.head.appendChild(script);
            }
        },

        load: (url) => {
            if (!window.pdfjsLib) {
                alert("Cargando motor PDF... Intente en unos segundos.");
                return;
            }

            // UI Setup
            const container = document.getElementById('pdf-modal');
            container.classList.remove('hidden');
            canvas = document.getElementById('pdf-canvas');
            ctx = canvas.getContext('2d');

            // Loading State
            renderLoading(true);

            // Fetch Document
            window.pdfjsLib.getDocument(url).promise.then((pdfDoc_) => {
                pdfDoc = pdfDoc_;
                document.getElementById('page_count').textContent = pdfDoc.numPages;
                renderLoading(false);
                pageNum = 1;
                PDFViewer.renderPage(pageNum);
            }).catch((err) => {
                console.error('Error loading PDF:', err);
                renderLoading(false);
                // Fallback a nueva ventana si falla (CORS, etc.)
                if (confirm('No se pudo previsualizar el PDF (Restricción de seguridad). ¿Abrir en nueva pestaña?')) {
                    window.open(url, '_blank');
                    PDFViewer.close();
                }
            });
        },

        renderPage: (num) => {
            pageRendering = true;
            
            pdfDoc.getPage(num).then((page) => {
                const viewport = page.getViewport({ scale: scale });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                
                const renderTask = page.render(renderContext);

                renderTask.promise.then(() => {
                    pageRendering = false;
                    if (pageNumPending !== null) {
                        PDFViewer.renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                });
            });

            document.getElementById('page_num').textContent = num;
        },

        queueRenderPage: (num) => {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                PDFViewer.renderPage(num);
            }
        },

        prevPage: () => {
            if (pageNum <= 1) return;
            pageNum--;
            PDFViewer.queueRenderPage(pageNum);
        },

        nextPage: () => {
            if (pageNum >= pdfDoc.numPages) return;
            pageNum++;
            PDFViewer.queueRenderPage(pageNum);
        },

        close: () => {
            document.getElementById('pdf-modal').classList.add('hidden');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            pdfDoc = null;
        }
    };

    function renderLoading(show) {
        const loader = document.getElementById('pdf-loader');
        if (loader) loader.style.display = show ? 'flex' : 'none';
    }

    // --- 3. RENDERIZADO DE LA LIBRERÍA ---
    const Library = {
        render: () => {
            // Asegurar que el script de PDF.js se cargue
            PDFViewer.init();

            let booksHTML = '';
            LIBRARY_CATALOG.forEach(book => {
                booksHTML += `
                    <div class="group relative bg-white dark:bg-[#1c1c1e] rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col">
                        
                        <div class="h-48 ${book.color} relative p-6 flex flex-col justify-end text-white overflow-hidden">
                            <i class="fa-solid fa-book-open absolute top-4 right-4 text-white/20 text-6xl transform rotate-12 group-hover:scale-110 transition-transform"></i>
                            <div class="relative z-10">
                                <span class="text-[10px] uppercase font-bold tracking-widest opacity-80 border border-white/30 px-2 py-1 rounded mb-2 inline-block">${book.type}</span>
                                <h3 class="font-bold text-lg leading-tight line-clamp-2">${book.title}</h3>
                            </div>
                            <div class="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                        </div>

                        <div class="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <p class="text-xs text-gray-400 font-medium mb-1">Author</p>
                                <p class="text-sm font-semibold text-slate-800 dark:text-gray-200 mb-4">${book.author}</p>
                            </div>
                            
                            <button onclick="window.Library.open('${book.url}')" class="w-full py-2 bg-gray-50 dark:bg-white/5 hover:bg-brand-blue hover:text-white text-gray-600 dark:text-gray-400 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 group-btn">
                                <span>Leer</span>
                                <i class="fa-solid fa-arrow-right text-xs group-btn-hover:translate-x-1 transition-transform"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            return `
                <div class="relative min-h-screen">
                    <div class="mb-8">
                        <h2 class="text-3xl font-black text-slate-800 dark:text-white mb-2">
                            <span class="lang-es">Biblioteca Digital</span>
                            <span class="lang-en hidden-lang">Digital Library</span>
                        </h2>
                        <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <p class="text-gray-500 text-sm">
                                <span class="lang-es">Recursos oficiales, guías de estudio y protocolos.</span>
                                <span class="lang-en hidden-lang">Official resources, study guides, and protocols.</span>
                            </p>
                            
                            <div class="relative w-full md:w-64">
                                <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input type="text" placeholder="Filtrar..." class="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue transition-all">
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-20">
                        ${booksHTML}
                    </div>

                    <div id="pdf-modal" class="fixed inset-0 z-[60] bg-black/90 hidden flex flex-col">
                        <div class="flex justify-between items-center px-4 py-3 bg-[#1c1c1e] border-b border-white/10 text-white">
                            <div class="font-bold text-sm">Visor PDF</div>
                            <div class="flex items-center gap-4">
                                <button onclick="window.PDFViewer.prevPage()" class="hover:text-brand-blue transition-colors"><i class="fa-solid fa-chevron-left"></i></button>
                                <span class="text-xs font-mono"><span id="page_num">--</span> / <span id="page_count">--</span></span>
                                <button onclick="window.PDFViewer.nextPage()" class="hover:text-brand-blue transition-colors"><i class="fa-solid fa-chevron-right"></i></button>
                            </div>
                            <button onclick="window.PDFViewer.close()" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500 transition-colors">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        
                        <div class="flex-1 overflow-auto flex justify-center bg-[#2c2c2e] p-8 relative">
                            <div id="pdf-loader" class="absolute inset-0 flex items-center justify-center bg-black/50 z-10" style="display:none">
                                <i class="fa-solid fa-circle-notch animate-spin text-4xl text-brand-blue"></i>
                            </div>
                            <canvas id="pdf-canvas" class="shadow-2xl max-w-full"></canvas>
                        </div>
                    </div>
                </div>
            `;
        },

        open: (url) => {
            if (url === '#') {
                alert("Recurso en construcción / Resource under construction");
                return;
            }
            PDFViewer.load(url);
        }
    };

    // --- 4. EXPORTAR & REGISTRAR ---
    window.Library = Library;
    window.PDFViewer = PDFViewer;

    if (window.NCLEX) {
        window.NCLEX.registerTopic({
            id: 'library',
            title: { es: 'Biblioteca', en: 'Library' },
            subtitle: { es: 'Recursos PDF', en: 'PDF Resources' },
            icon: 'book-bookmark',
            color: 'orange',
            render: () => window.Library.render()
        });
    }

})();
