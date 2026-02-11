// premium_books_library.js — Versión Mejorada: Más eficiente y robusta
(function() {
    'use strict';
    
    // RUTA AL CATÁLOGO
    const CATALOG_URL = 'library/catalog.json';
    
    // DESIGN SYSTEM CONFIG - Optimizado para rendimiento
    const THEME = {
        gradient: 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600',
        modalBg: 'bg-gray-50 dark:bg-[#0f0f11]',
        cardBg: 'bg-white dark:bg-[#1C1C1E]',
        textMain: 'text-slate-800 dark:text-slate-100',
        textMuted: 'text-slate-500 dark:text-slate-400',
        border: 'border-gray-200/50 dark:border-white/5'
    };
    
    // MAPPINGS - Centralizados para mejor mantenimiento
    const CATEGORY_CONFIG = {
        'Examen': {
            gradient: 'from-blue-500 to-cyan-400',
            icon: 'fa-clipboard-question',
            subtitle: 'Exámenes de práctica',
            accent: 'text-blue-500'
        },
        'Farmacología': {
            gradient: 'from-emerald-500 to-teal-400',
            icon: 'fa-capsules',
            subtitle: 'Medicamentos y dosis',
            accent: 'text-emerald-500'
        },
        'Maternidad': {
            gradient: 'from-pink-500 to-rose-400',
            icon: 'fa-baby-carriage',
            subtitle: 'Cuidado prenatal y postnatal',
            accent: 'text-pink-500'
        },
        'Revisión': {
            gradient: 'from-violet-500 to-fuchsia-500',
            icon: 'fa-book-journal-whills',
            subtitle: 'Resúmenes completos',
            accent: 'text-violet-500'
        },
        'Pediatría': {
            gradient: 'from-orange-400 to-amber-400',
            icon: 'fa-shapes',
            subtitle: 'Cuidado infantil',
            accent: 'text-orange-500'
        },
        'Salud Mental': {
            gradient: 'from-indigo-500 to-purple-500',
            icon: 'fa-brain',
            subtitle: 'Psiquiatría y psicología',
            accent: 'text-indigo-500'
        }
    };
    
    // ESTADO con validación
    const state = {
        books: [],
        isLoading: true,
        hasError: false,
        errorMessage: '',
        viewMode: localStorage.getItem('library_view_mode') || 'grid',
        isModalOpen: false
    };
    
    // Cache para evitar recálculos
    const cache = {
        categories: new Map(),
        formattedSizes: new Map()
    };
    
    // --- 1. UTILIDADES MEJORADAS ---
    const utils = {
        t(es, en) {
            return (localStorage.getItem('nclex_lang') === 'en') ? en : es;
        },
        
        formatFileSize(bytes) {
            if (cache.formattedSizes.has(bytes)) {
                return cache.formattedSizes.get(bytes);
            }
            
            if (!bytes || bytes === 0) {
                const result = 'PDF';
                cache.formattedSizes.set(bytes, result);
                return result;
            }
            
            let result;
            if (bytes < 1024 * 1024) {
                result = (bytes / 1024).toFixed(0) + ' KB';
            } else {
                result = (bytes / (1024 * 1024)).toFixed(1) + ' MB';
            }
            
            cache.formattedSizes.set(bytes, result);
            return result;
        },
        
        getCategoryConfig(category) {
            const cat = category || 'General';
            if (cache.categories.has(cat)) {
                return cache.categories.get(cat);
            }
            
            const config = CATEGORY_CONFIG[cat] || {
                gradient: 'from-slate-500 to-gray-400',
                icon: 'fa-book',
                subtitle: cat,
                accent: 'text-slate-500'
            };
            
            cache.categories.set(cat, config);
            return config;
        },
        
        debounce(fn, delay) {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => fn.apply(this, args), delay);
            };
        },
        
        async fetchWithTimeout(url, options = {}, timeout = 8000) {
            const controller = new AbortController();
            const { signal } = controller;
            
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            try {
                const response = await fetch(url, { ...options, signal });
                clearTimeout(timeoutId);
                return response;
            } catch (error) {
                clearTimeout(timeoutId);
                throw error;
            }
        }
    };
    
    // --- 2. LÓGICA DE CARGA OPTIMIZADA ---
    async function fetchCatalog() {
        state.isLoading = true;
        state.hasError = false;
        updateLibraryView();
        
        try {
            // Intentar primero sin cache, luego con fallback
            const response = await utils.fetchWithTimeout(
                `${CATALOG_URL}?t=${Date.now()}`,
                { cache: 'no-store' }
            ).catch(() => fetch(CATALOG_URL)); // Fallback con cache normal
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Validar estructura del JSON
            if (!Array.isArray(data)) {
                throw new Error('Formato de catálogo inválido');
            }
            
            state.books = data.map(processBookData);
            
        } catch (error) {
            console.error('Library Error:', error);
            state.hasError = true;
            state.errorMessage = error.message;
            showNotification(utils.t('Error al cargar catálogo', 'Failed to load catalog'), 'error');
        } finally {
            state.isLoading = false;
            updateLibraryView();
            renderFloatingButton();
        }
    }
    
    function processBookData(item) {
        const cat = item.category || 'General';
        const config = utils.getCategoryConfig(cat);
        
        return {
            ...item,
            subtitle: config.subtitle,
            coverGradient: config.gradient,
            icon: config.icon,
            accentColor: config.accent,
            formattedSize: utils.formatFileSize(item.fileSize),
            hasCover: item.coverUrl && !item.coverUrl.includes('null')
        };
    }
    
    // --- 3. COMPONENTES MEJORADOS ---
    
    // A. NOTIFICACIÓN TOAST
    function showNotification(message, type = 'info') {
        const types = {
            info: 'bg-blue-500',
            success: 'bg-green-500',
            warning: 'bg-yellow-500',
            error: 'bg-red-500'
        };
        
        const toast = document.createElement('div');
        toast.className = `
            fixed top-6 right-6 z-[200] px-4 py-3 rounded-lg shadow-xl 
            text-white font-medium text-sm animate-slide-in-right
            ${types[type]} transform transition-all duration-300
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
    
    // B. BOTÓN FLOTANTE MEJORADO
    function renderFloatingButton() {
        const existingBtn = document.getElementById('lib-float-btn');
        if (existingBtn) {
            // Actualizar estado existente
            const indicator = existingBtn.querySelector('.status-indicator');
            if (indicator) {
                indicator.className = `status-indicator absolute top-3 right-4 w-3 h-3 rounded-full border-2 
                    ${state.isLoading ? 'bg-yellow-500 border-indigo-600 animate-pulse' :
                      state.hasError ? 'bg-red-500 border-red-600' :
                      state.books.length > 0 ? 'bg-green-500 border-indigo-600' :
                      'bg-gray-400 border-gray-600'}`;
            }
            return;
        }
        
        const btn = document.createElement('button');
        btn.id = 'lib-float-btn';
        btn.className = `
            fixed bottom-8 right-8 z-[90] group transition-all duration-300 
            hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        `;
        btn.onclick = () => window.premiumBookLibrary.open();
        btn.setAttribute('aria-label', utils.t('Abrir biblioteca', 'Open library'));
        
        btn.innerHTML = `
            <div class="absolute inset-0 rounded-full bg-blue-600 blur-lg opacity-40 
                group-hover:opacity-70 transition-opacity duration-300"></div>
            
            <div class="relative w-16 h-16 rounded-full ${THEME.gradient} flex items-center 
                justify-center shadow-xl border border-white/10 overflow-hidden">
                
                <div class="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
                
                <i class="fa-solid fa-book-open text-2xl text-white drop-shadow-md 
                    group-hover:scale-110 transition-transform duration-300"></i>
                
                <div class="status-indicator absolute top-3 right-4 w-3 h-3 rounded-full border-2 
                    ${state.isLoading ? 'bg-yellow-500 border-indigo-600 animate-pulse' :
                      state.hasError ? 'bg-red-500 border-red-600' :
                      state.books.length > 0 ? 'bg-green-500 border-indigo-600' :
                      'bg-gray-400 border-gray-600'}"></div>
            </div>
            
            <div class="tooltip absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-gray-900 
                text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 
                transition-all duration-200 pointer-events-none shadow-lg translate-y-2 
                group-hover:translate-y-0">
                ${utils.t('Biblioteca Premium', 'Premium Library')}
                ${state.books.length > 0 ? 
                    `<span class="ml-2 px-1.5 py-0.5 bg-blue-500 rounded text-xs">${state.books.length}</span>` : ''}
                <div class="absolute -bottom-1 right-6 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
        `;
        
        document.body.appendChild(btn);
    }
    
    // C. TARJETA DE LIBRO OPTIMIZADA
    function renderBookCard(book) {
        const config = utils.getCategoryConfig(book.category);
        
        return `
            <div class="group relative flex flex-col h-full ${THEME.cardBg} rounded-2xl 
                border ${THEME.border} shadow-sm hover:shadow-2xl transition-all duration-300 
                hover:-translate-y-1 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                
                <!-- Portada -->
                <div class="relative h-52 overflow-hidden bg-gradient-to-br ${book.coverGradient}">
                    ${book.hasCover 
                        ? `<img src="${book.coverUrl}" alt="${book.title}" 
                            class="w-full h-full object-cover transition-transform duration-700 
                            group-hover:scale-110" loading="lazy" 
                            onerror="this.style.display='none';this.parentNode.innerHTML='<div class=\"w-full h-full flex items-center justify-center\"><i class=\"${book.icon} text-6xl text-white/80 drop-shadow-lg\"></i></div>';">`
                        : `<div class="w-full h-full flex items-center justify-center">
                            <i class="${book.icon} text-6xl text-white/80 drop-shadow-lg"></i>
                           </div>`
                    }
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    
                    <!-- Badge de categoría -->
                    <div class="absolute top-3 left-3">
                        <span class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider 
                            text-white bg-black/40 backdrop-blur-md rounded-md border border-white/10">
                            ${book.category}
                        </span>
                    </div>
                </div>
                
                <!-- Contenido -->
                <div class="p-5 flex-1 flex flex-col">
                    <h3 class="text-lg font-bold ${THEME.textMain} leading-tight mb-1 
                        line-clamp-2" title="${book.title}">
                        ${book.title}
                    </h3>
                    <p class="text-xs ${THEME.textMuted} mb-4 font-medium">${book.subtitle}</p>
                    
                    <!-- Metadata -->
                    <div class="mt-auto flex items-center justify-between pt-4 
                        border-t ${THEME.border}">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-mono ${THEME.textMuted} 
                                bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                                ${book.formattedSize}
                            </span>
                            ${book.pages ? `
                                <span class="text-[10px] font-mono ${THEME.textMuted} 
                                    bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                                    ${book.pages} págs
                                </span>
                            ` : ''}
                        </div>
                        
                        <button onclick="window.premiumBookLibrary.download('${book.id}')" 
                                class="pl-3 pr-2 py-1.5 rounded-lg text-sm font-bold 
                                ${book.accentColor} hover:bg-blue-50 dark:hover:bg-blue-900/20 
                                transition-colors flex items-center gap-2 focus:outline-none 
                                focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                aria-label="${utils.t('Abrir', 'Open')} ${book.title}">
                            ${utils.t('Abrir', 'Open')} 
                            <i class="fa-solid fa-arrow-right-long transition-transform 
                                group-hover:translate-x-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // D. MODAL MEJORADO
    function createModal() {
        if (document.getElementById('library-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'library-modal';
        modal.className = 'fixed inset-0 z-[100] hidden';
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', utils.t('Biblioteca Premium', 'Premium Library'));
        
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                 onclick="window.premiumBookLibrary.close()"></div>
            
            <div class="absolute inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                <div class="w-full max-w-7xl h-[85vh] ${THEME.modalBg} rounded-3xl shadow-2xl 
                    overflow-hidden flex flex-col animate-slide-up pointer-events-auto ring-1 ring-white/10">
                    
                    <!-- Header -->
                    <div class="sticky top-0 z-50 ${THEME.cardBg}/95 backdrop-blur-md 
                        border-b ${THEME.border} px-6 py-5 flex justify-between items-center select-none">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl ${THEME.gradient} flex items-center 
                                justify-center text-white shadow-lg shadow-indigo-500/20">
                                <i class="fa-solid fa-book-bookmark text-xl"></i>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold ${THEME.textMain} tracking-tight">
                                    ${utils.t('Biblioteca', 'Library')}
                                </h2>
                                <p class="text-xs ${THEME.textMuted} font-medium flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full 
                                        ${state.isLoading ? 'bg-yellow-500 animate-pulse' :
                                          state.hasError ? 'bg-red-500' :
                                          'bg-green-500'}"></span>
                                    ${state.isLoading 
                                        ? utils.t('Cargando...', 'Loading...') 
                                        : `${state.books.length} ${utils.t('recursos', 'resources')}`
                                    }
                                </p>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-3">
                            <button onclick="window.premiumBookLibrary.refresh()" 
                                class="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 
                                flex items-center justify-center ${THEME.textMuted} 
                                hover:bg-blue-100 hover:text-blue-500 dark:hover:bg-blue-900/30 
                                transition-all duration-200"
                                aria-label="${utils.t('Actualizar', 'Refresh')}">
                                <i class="fa-solid fa-rotate text-lg"></i>
                            </button>
                            <button onclick="window.premiumBookLibrary.close()" 
                                class="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 
                                flex items-center justify-center ${THEME.textMuted} 
                                hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 
                                transition-all duration-200"
                                aria-label="${utils.t('Cerrar', 'Close')}">
                                <i class="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Contenido -->
                    <div id="lib-content" class="flex-1 overflow-y-auto p-6 lg:p-8 
                        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 scroll-smooth">
                        <!-- Contenido dinámico -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        addModalStyles();
    }
    
    function addModalStyles() {
        if (document.getElementById('library-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'library-styles';
        style.textContent = `
            @keyframes slideUp {
                from { 
                    transform: translateY(40px) scale(0.95); 
                    opacity: 0; 
                }
                to { 
                    transform: translateY(0) scale(1); 
                    opacity: 1; 
                }
            }
            
            @keyframes slideInRight {
                from { 
                    transform: translateX(100%); 
                    opacity: 0; 
                }
                to { 
                    transform: translateX(0); 
                    opacity: 1; 
                }
            }
            
            .animate-slide-up { 
                animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
            }
            
            .animate-slide-in-right {
                animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            
            /* Custom Scrollbar */
            #lib-content::-webkit-scrollbar { 
                width: 10px; 
                height: 10px;
            }
            
            #lib-content::-webkit-scrollbar-track { 
                background: transparent; 
                margin: 8px 0;
            }
            
            #lib-content::-webkit-scrollbar-thumb { 
                background-color: rgba(156, 163, 175, 0.4); 
                border-radius: 20px; 
                border: 3px solid transparent; 
                background-clip: content-box; 
            }
            
            #lib-content::-webkit-scrollbar-thumb:hover { 
                background-color: rgba(156, 163, 175, 0.6); 
            }
            
            /* Line clamp utility */
            .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }
    
    // --- 4. MANEJO DE VISTAS ---
    function updateLibraryView() {
        const content = document.getElementById('lib-content');
        if (!content) return;
        
        if (state.isLoading) {
            content.innerHTML = `
                <div class="col-span-full h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                    <i class="fa-solid fa-circle-notch fa-spin text-4xl text-indigo-500"></i>
                    <p class="animate-pulse">${utils.t('Cargando biblioteca...', 'Loading library...')}</p>
                </div>`;
            return;
        }
        
        if (state.hasError) {
            content.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center text-center py-20">
                    <i class="fa-solid fa-triangle-exclamation text-6xl text-red-400 mb-4"></i>
                    <p class="text-xl font-medium ${THEME.textMain} mb-2">
                        ${utils.t('Error de conexión', 'Connection error')}
                    </p>
                    <p class="text-sm ${THEME.textMuted} mb-6 max-w-md">
                        ${utils.t('No se pudo cargar el catálogo. Verifica tu conexión o intenta más tarde.', 
                                 'Could not load catalog. Check your connection or try again later.')}
                    </p>
                    <button onclick="window.premiumBookLibrary.refresh()" 
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                        transition-colors font-medium flex items-center gap-2">
                        <i class="fa-solid fa-rotate"></i>
                        ${utils.t('Reintentar', 'Retry')}
                    </button>
                </div>`;
            return;
        }
        
        if (state.books.length === 0) {
            content.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center text-center py-20 opacity-60">
                    <i class="fa-solid fa-folder-open text-6xl text-gray-300 mb-4"></i>
                    <p class="text-xl font-medium ${THEME.textMain}">
                        ${utils.t('Biblioteca vacía', 'Empty library')}
                    </p>
                    <p class="text-sm ${THEME.textMuted} mt-2">
                        ${utils.t('Agrega libros a la carpeta', 'Add books to the folder')} 
                        <code class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">library/</code>
                    </p>
                </div>`;
            return;
        }
        
        content.innerHTML = state.books.map(renderBookCard).join('');
        
        // Lazy loading para imágenes
        const images = content.querySelectorAll('img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src;
                        observer.unobserve(img);
                    }
                });
            });
            images.forEach(img => observer.observe(img));
        }
    }
    
    // --- 5. API PÚBLICA MEJORADA ---
    window.premiumBookLibrary = {
        async open() {
            if (state.isModalOpen) return;
            
            createModal();
            const modal = document.getElementById('library-modal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            state.isModalOpen = true;
            
            // Bloquear scroll
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
            
            // Focus management para accesibilidad
            modal.setAttribute('aria-hidden', 'false');
            
            if (state.books.length === 0 && !state.hasError) {
                await fetchCatalog();
            }
            
            updateLibraryView();
        },
        
        close() {
            const modal = document.getElementById('library-modal');
            if (!modal) return;
            
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            state.isModalOpen = false;
            
            // Restaurar scroll
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            
            // Focus management
            modal.setAttribute('aria-hidden', 'true');
            
            // Devolver focus al botón flotante
            const floatBtn = document.getElementById('lib-float-btn');
            if (floatBtn) floatBtn.focus();
        },
        
        download(id) {
            const book = state.books.find(b => b.id === id);
            if (!book || !book.fileUrl) {
                showNotification(utils.t('Libro no disponible', 'Book not available'), 'error');
                return;
            }
            
            showNotification(
                utils.t(`Abriendo: ${book.title}`, `Opening: ${book.title}`), 
                'info'
            );
            
            // Abrir en nueva pestaña
            const link = document.createElement('a');
            link.href = book.fileUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.click();
        },
        
        async refresh() {
            showNotification(utils.t('Actualizando catálogo...', 'Updating catalog...'), 'info');
            await fetchCatalog();
        },
        
        getStats() {
            return {
                total: state.books.length,
                categories: [...new Set(state.books.map(b => b.category))],
                isLoading: state.isLoading,
                hasError: state.hasError
            };
        }
    };
    
    // --- 6. EVENT LISTENERS GLOBALES ---
    function setupGlobalListeners() {
        // Cerrar modal con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isModalOpen) {
                window.premiumBookLibrary.close();
            }
        });
        
        // Recargar cuando vuelve la conexión
        window.addEventListener('online', () => {
            if (state.hasError) {
                showNotification(utils.t('Conexión restablecida', 'Connection restored'), 'success');
                fetchCatalog();
            }
        });
        
        // Prevenir memory leaks
        window.addEventListener('beforeunload', () => {
            window.premiumBookLibrary.close();
        });
    }
    
    // --- 7. INICIALIZACIÓN ---
    function init() {
        renderFloatingButton();
        setupGlobalListeners();
        fetchCatalog();
        
        // Exponer utilidades para debugging
        if (window.location.hostname === 'localhost') {
            window._libraryDebug = {
                state,
                utils,
                refresh: () => fetchCatalog()
            };
        }
    }
    
    // Auto-start mejorado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();