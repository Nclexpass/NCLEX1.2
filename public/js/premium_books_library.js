// premium_books_library.js — Versión Arrastrable e Independiente (Mejorada)
(function() {
    'use strict';
    
    // --- CONFIGURACIÓN ---
    const CONFIG = {
        CATALOG_URL: 'library/catalog.json',
        STORAGE_KEY: 'lib_pos_v2',
        DEFAULT_POSITION: { left: '20px', bottom: '20px' },
        DRAG_THRESHOLD: 5,
        Z_INDEX: {
            BUTTON: 9980,
            MODAL: 9990
        },
        CACHE_DURATION: 5 * 60 * 1000 // 5 minutos
    };
    
    const THEME = {
        gradient: 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600',
        modalBg: 'bg-gray-50 dark:bg-[#0f0f11]',
        cardBg: 'bg-white dark:bg-[#1C1C1E]',
        textMain: 'text-slate-800 dark:text-slate-100',
        textMuted: 'text-slate-500 dark:text-slate-400',
        border: 'border-gray-200/50 dark:border-white/5',
        accent: 'text-blue-600 dark:text-blue-400'
    };

    // --- GESTIÓN DE ESTADO ---
    class BookLibraryState {
        constructor() {
            this.books = [];
            this.filteredBooks = [];
            this.isLoading = true;
            this.hasError = false;
            this.isModalOpen = false;
            this.currentFilter = 'all';
            this.searchQuery = '';
            this.cache = {
                categories: new Map(),
                formattedSizes: new Map(),
                lastFetch: 0
            };
        }

        filterBooks(filter = 'all', search = '') {
            this.currentFilter = filter;
            this.searchQuery = search.toLowerCase();
            
            let results = this.books;
            
            // Aplicar filtro de categoría
            if (filter !== 'all') {
                results = results.filter(book => 
                    book.category.toLowerCase() === filter.toLowerCase()
                );
            }
            
            // Aplicar búsqueda
            if (this.searchQuery) {
                results = results.filter(book => 
                    book.title.toLowerCase().includes(this.searchQuery) ||
                    book.author.toLowerCase().includes(this.searchQuery) ||
                    book.description?.toLowerCase().includes(this.searchQuery) ||
                    book.category.toLowerCase().includes(this.searchQuery)
                );
            }
            
            this.filteredBooks = results;
            return results;
        }

        getCategories() {
            const categories = new Set(this.books.map(book => book.category));
            return ['all', ...Array.from(categories)];
        }

        formatFileSize(bytes) {
            if (this.cache.formattedSizes.has(bytes)) {
                return this.cache.formattedSizes.get(bytes);
            }
            
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 Byte';
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            const size = (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
            
            this.cache.formattedSizes.set(bytes, size);
            return size;
        }
    }

    // --- GESTIÓN DE POSICIÓN ---
    const PositionManager = {
        save(el) {
            const rect = el.getBoundingClientRect();
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                x: rect.left,
                y: rect.top,
                width: window.innerWidth,
                height: window.innerHeight,
                timestamp: Date.now()
            }));
        },
        
        load(el) {
            try {
                const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (!saved) return false;
                
                const { x, y, width: savedWidth, height: savedHeight } = JSON.parse(saved);
                
                // Verificar si la ventana ha cambiado significativamente de tamaño
                const currentWidth = window.innerWidth;
                const currentHeight = window.innerHeight;
                const widthRatio = currentWidth / savedWidth;
                const heightRatio = currentHeight / savedHeight;
                
                if (widthRatio < 0.8 || widthRatio > 1.2 || heightRatio < 0.8 || heightRatio > 1.2) {
                    console.log('Ventana redimensionada significativamente, usando posición por defecto');
                    return false;
                }
                
                // Ajustar posición si está fuera de los límites visibles
                const maxX = currentWidth - el.offsetWidth;
                const maxY = currentHeight - el.offsetHeight;
                
                const adjustedX = Math.max(10, Math.min(x, maxX - 10));
                const adjustedY = Math.max(10, Math.min(y, maxY - 10));
                
                el.style.left = `${adjustedX}px`;
                el.style.top = `${adjustedY}px`;
                el.style.right = 'auto';
                el.style.bottom = 'auto';
                
                return true;
            } catch (e) {
                console.error('Error cargando posición:', e);
                return false;
            }
        },
        
        setDefault(el) {
            Object.assign(el.style, CONFIG.DEFAULT_POSITION);
        }
    };
    
    // --- SISTEMA DE ARRASTRE ---
    class DraggableManager {
        constructor(el, onMoveCallback, onClickCallback) {
            this.el = el;
            this.onMoveCallback = onMoveCallback;
            this.onClickCallback = onClickCallback;
            this.isDragging = false;
            this.hasMoved = false;
            this.startX = 0;
            this.startY = 0;
            this.initialLeft = 0;
            this.initialTop = 0;
            
            this.bindEvents();
        }
        
        bindEvents() {
            this.el.addEventListener('mousedown', this.handleStart.bind(this));
            this.el.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
            
            // Prevenir arrastre accidental
            this.el.addEventListener('dragstart', (e) => e.preventDefault());
            this.el.style.userSelect = 'none';
            this.el.style.webkitUserSelect = 'none';
        }
        
        handleStart(e) {
            if (e.target.closest('button') || e.target.closest('a')) return;
            
            const isTouch = e.type === 'touchstart';
            const clientX = isTouch ? e.touches[0].clientX : e.clientX;
            const clientY = isTouch ? e.touches[0].clientY : e.clientY;
            
            this.isDragging = true;
            this.hasMoved = false;
            this.startX = clientX;
            this.startY = clientY;
            
            const rect = this.el.getBoundingClientRect();
            this.initialLeft = rect.left;
            this.initialTop = rect.top;
            
            this.el.style.transition = 'none';
            this.el.style.cursor = 'grabbing';
            this.el.classList.add('dragging');
            
            const moveEvent = isTouch ? 'touchmove' : 'mousemove';
            const endEvent = isTouch ? 'touchend' : 'mouseup';
            
            document.addEventListener(moveEvent, this.handleMove.bind(this), { passive: false });
            document.addEventListener(endEvent, this.handleEnd.bind(this));
            
            if (!isTouch) {
                document.addEventListener('mouseleave', this.handleEnd.bind(this));
            }
            
            e.preventDefault();
        }
        
        handleMove(e) {
            if (!this.isDragging) return;
            
            const isTouch = e.type === 'touchmove';
            const clientX = isTouch ? e.touches[0].clientX : e.clientX;
            const clientY = isTouch ? e.touches[0].clientY : e.clientY;
            
            const dx = clientX - this.startX;
            const dy = clientY - this.startY;
            
            if (!this.hasMoved && (Math.abs(dx) > CONFIG.DRAG_THRESHOLD || Math.abs(dy) > CONFIG.DRAG_THRESHOLD)) {
                this.hasMoved = true;
            }
            
            const newLeft = this.initialLeft + dx;
            const newTop = this.initialTop + dy;
            
            const maxX = window.innerWidth - this.el.offsetWidth;
            const maxY = window.innerHeight - this.el.offsetHeight;
            
            const boundedLeft = Math.max(0, Math.min(newLeft, maxX));
            const boundedTop = Math.max(0, Math.min(newTop, maxY));
            
            this.el.style.transform = `translate3d(${boundedLeft - this.initialLeft}px, ${boundedTop - this.initialTop}px, 0)`;
            
            if (this.onMoveCallback) {
                this.onMoveCallback(boundedLeft, boundedTop);
            }
            
            if (this.hasMoved) {
                e.preventDefault();
            }
        }
        
        handleEnd() {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            this.el.style.cursor = '';
            this.el.classList.remove('dragging');
            
            const transform = window.getComputedStyle(this.el).transform;
            if (transform && transform !== 'none') {
                const matrix = new DOMMatrixReadOnly(transform);
                const finalLeft = this.initialLeft + matrix.m41;
                const finalTop = this.initialTop + matrix.m42;
                
                this.el.style.transform = 'none';
                this.el.style.left = `${finalLeft}px`;
                this.el.style.top = `${finalTop}px`;
                this.el.style.right = 'auto';
                this.el.style.bottom = 'auto';
            }
            
            this.el.style.transition = '';
            PositionManager.save(this.el);
            this.cleanupEvents();
            
            if (!this.hasMoved && this.onClickCallback) {
                this.onClickCallback();
            }
        }
        
        cleanupEvents() {
            document.removeEventListener('mousemove', this.handleMove.bind(this));
            document.removeEventListener('mouseup', this.handleEnd.bind(this));
            document.removeEventListener('touchmove', this.handleMove.bind(this));
            document.removeEventListener('touchend', this.handleEnd.bind(this));
            document.removeEventListener('mouseleave', this.handleEnd.bind(this));
        }
        
        destroy() {
            this.cleanupEvents();
            this.el.removeEventListener('mousedown', this.handleStart.bind(this));
            this.el.removeEventListener('touchstart', this.handleStart.bind(this));
        }
    }
    
    // --- INTERFAZ DE USUARIO ---
    class BookLibraryUI {
        constructor(state) {
            this.state = state;
            this.modal = null;
            this.draggableManager = null;
        }
        
        createFloatingButton() {
            if (document.getElementById('lib-float-btn')) return;
            
            const btn = document.createElement('div');
            btn.id = 'lib-float-btn';
            btn.className = 'fixed z-[9980] w-16 h-16 cursor-move group';
            
            btn.innerHTML = `
                <div class="absolute inset-0 rounded-full bg-blue-600 blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div class="relative w-full h-full rounded-full ${THEME.gradient} flex items-center justify-center shadow-xl border border-white/10 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <i class="fa-solid fa-book-open text-2xl text-white pointer-events-none"></i>
                    <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Biblioteca Premium
                </div>
            `;
            
            Object.assign(btn.style, {
                willChange: 'transform',
                backfaceVisibility: 'hidden'
            });
            
            document.body.appendChild(btn);
            
            this.draggableManager = new DraggableManager(btn, null, () => {
                if (window.premiumBookLibrary) {
                    window.premiumBookLibrary.open();
                }
            });
            
            if (!PositionManager.load(btn)) {
                PositionManager.setDefault(btn);
            }
            
            this.setupResizeHandler(btn);
            return btn;
        }
        
        setupResizeHandler(btn) {
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const rect = btn.getBoundingClientRect();
                    const isOutOfView = rect.right < 0 || rect.bottom < 0 || 
                                       rect.left > window.innerWidth || 
                                       rect.top > window.innerHeight;
                    
                    if (isOutOfView) {
                        PositionManager.setDefault(btn);
                    }
                }, 250);
            });
        }
        
        createModal() {
            if (document.getElementById('library-modal')) return;
            
            const modal = document.createElement('div');
            modal.id = 'library-modal';
            modal.className = `hidden fixed inset-0 z-[${CONFIG.Z_INDEX.MODAL}] p-4 md:p-6`;
            modal.innerHTML = `
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" data-action="close"></div>
                <div class="relative w-full max-w-6xl max-h-[90vh] mx-auto overflow-hidden rounded-2xl ${THEME.modalBg} shadow-2xl">
                    <!-- Header -->
                    <div class="sticky top-0 z-10 px-6 py-4 ${THEME.cardBg} border-b ${THEME.border}">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 rounded-full ${THEME.gradient} flex items-center justify-center">
                                    <i class="fa-solid fa-book text-white"></i>
                                </div>
                                <div>
                                    <h2 class="text-xl font-bold ${THEME.textMain}">Biblioteca Premium</h2>
                                    <p class="text-sm ${THEME.textMuted}">${this.state.books.length} libros disponibles</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2">
                                <button id="library-search-btn" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 ${THEME.textMuted} transition-colors" title="Buscar">
                                    <i class="fa-solid fa-search"></i>
                                </button>
                                <button id="library-close-btn" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 ${THEME.textMuted} transition-colors" title="Cerrar">
                                    <i class="fa-solid fa-times text-lg"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Filtros -->
                        <div class="mt-4 flex flex-wrap gap-2" id="library-filters"></div>
                        
                        <!-- Barra de búsqueda (oculta inicialmente) -->
                        <div id="library-search-bar" class="hidden mt-4">
                            <div class="relative">
                                <input type="text" id="library-search-input" 
                                       class="w-full px-4 py-2 pl-10 ${THEME.cardBg} border ${THEME.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${THEME.textMain}"
                                       placeholder="Buscar por título, autor o categoría...">
                                <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 ${THEME.textMuted}"></i>
                                <button id="library-clear-search" class="absolute right-3 top-1/2 transform -translate-y-1/2 ${THEME.textMuted} hover:text-red-500">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Contenido -->
                    <div class="overflow-y-auto p-6" style="max-height: calc(90vh - 140px)">
                        <div id="library-content">
                            ${this.getLoadingHTML()}
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="sticky bottom-0 px-6 py-4 ${THEME.cardBg} border-t ${THEME.border}">
                        <div class="flex justify-between items-center text-sm ${THEME.textMuted}">
                            <div id="library-stats"></div>
                            <div class="flex items-center space-x-4">
                                <button id="library-refresh-btn" class="flex items-center space-x-2 px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                    <i class="fa-solid fa-rotate"></i>
                                    <span>Actualizar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            this.modal = modal;
            this.bindModalEvents();
        }
        
        bindModalEvents() {
            // Cerrar modal
            this.modal.querySelector('[data-action="close"]').addEventListener('click', () => {
                if (window.premiumBookLibrary) {
                    window.premiumBookLibrary.close();
                }
            });
            
            document.getElementById('library-close-btn').addEventListener('click', () => {
                if (window.premiumBookLibrary) {
                    window.premiumBookLibrary.close();
                }
            });
            
            // Alternar búsqueda
            document.getElementById('library-search-btn').addEventListener('click', () => {
                const searchBar = document.getElementById('library-search-bar');
                searchBar.classList.toggle('hidden');
                if (!searchBar.classList.contains('hidden')) {
                    document.getElementById('library-search-input').focus();
                }
            });
            
            // Buscar
            const searchInput = document.getElementById('library-search-input');
            searchInput.addEventListener('input', (e) => {
                this.state.filterBooks(this.state.currentFilter, e.target.value);
                this.updateContentView();
            });
            
            // Limpiar búsqueda
            document.getElementById('library-clear-search').addEventListener('click', () => {
                searchInput.value = '';
                this.state.filterBooks(this.state.currentFilter, '');
                this.updateContentView();
            });
            
            // Actualizar
            document.getElementById('library-refresh-btn').addEventListener('click', () => {
                if (window.premiumBookLibrary && window.premiumBookLibrary.refresh) {
                    window.premiumBookLibrary.refresh();
                }
            });
            
            // Cerrar con Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                    if (window.premiumBookLibrary) {
                        window.premiumBookLibrary.close();
                    }
                }
            });
        }
        
        updateFilters() {
            const filtersContainer = document.getElementById('library-filters');
            if (!filtersContainer) return;
            
            const categories = this.state.getCategories();
            const filterButtons = categories.map(category => {
                const isActive = category === this.state.currentFilter;
                return `
                    <button class="filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isActive 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : `${THEME.cardBg} ${THEME.textMain} border ${THEME.border} hover:bg-gray-100 dark:hover:bg-gray-800`
                    }" data-category="${category}">
                        ${category === 'all' ? 'Todos' : category}
                        ${category !== 'all' ? `<span class="ml-1 text-xs opacity-75">(${
                            this.state.books.filter(b => b.category === category).length
                        })</span>` : ''}
                    </button>
                `;
            }).join('');
            
            filtersContainer.innerHTML = filterButtons;
            
            // Eventos para filtros
            filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const category = e.currentTarget.dataset.category;
                    this.state.filterBooks(category, this.state.searchQuery);
                    this.updateContentView();
                    
                    // Actualizar estado activo
                    filtersContainer.querySelectorAll('.filter-btn').forEach(b => {
                        b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
                        b.classList.add(THEME.cardBg, THEME.textMain, THEME.border);
                    });
                    e.currentTarget.classList.remove(THEME.cardBg, THEME.textMain, THEME.border);
                    e.currentTarget.classList.add('bg-blue-600', 'text-white', 'shadow-md');
                });
            });
        }
        
        updateContentView() {
            const contentEl = document.getElementById('library-content');
            const statsEl = document.getElementById('library-stats');
            
            if (!contentEl || !statsEl) return;
            
            if (this.state.isLoading) {
                contentEl.innerHTML = this.getLoadingHTML();
                statsEl.textContent = 'Cargando...';
                return;
            }
            
            if (this.state.hasError) {
                contentEl.innerHTML = this.getErrorHTML();
                statsEl.textContent = 'Error al cargar';
                return;
            }
            
            if (this.state.filteredBooks.length === 0) {
                contentEl.innerHTML = this.getEmptyHTML();
                statsEl.innerHTML = `<span class="${THEME.textMuted}">No se encontraron libros</span>`;
                return;
            }
            
            // Actualizar estadísticas
            statsEl.innerHTML = `
                Mostrando <span class="font-semibold ${THEME.accent}">${this.state.filteredBooks.length}</span> 
                de <span class="font-semibold">${this.state.books.length}</span> libros
                ${this.state.searchQuery ? ` para "<span class="font-semibold">${this.state.searchQuery}</span>"` : ''}
            `;
            
            // Renderizar libros
            contentEl.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${this.state.filteredBooks.map(book => this.renderBookCard(book)).join('')}
                </div>
            `;
            
            // Añadir eventos a los botones de descarga
            contentEl.querySelectorAll('.download-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const url = e.currentTarget.dataset.url;
                    const title = e.currentTarget.dataset.title;
                    this.handleDownload(url, title);
                });
            });
        }
        
        renderBookCard(book) {
            return `
                <div class="group relative ${THEME.cardBg} rounded-xl border ${THEME.border} p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <!-- Badge de categoría -->
                    <div class="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        ${book.category}
                    </div>
                    
                    <div class="flex items-start space-x-4">
                        <!-- Portada -->
                        <div class="w-20 h-28 flex-shrink-0 rounded-lg ${THEME.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            ${book.cover ? 
                                `<img src="${book.cover}" alt="${book.title}" class="w-full h-full object-cover rounded-lg">` :
                                `<i class="fa-solid fa-book text-white text-3xl"></i>`
                            }
                        </div>
                        
                        <!-- Contenido -->
                        <div class="flex-1 min-w-0">
                            <h3 class="font-bold text-lg ${THEME.textMain} mb-1 line-clamp-1">${book.title}</h3>
                            <p class="text-sm ${THEME.textMuted} mb-2">${book.author}</p>
                            
                            <p class="text-sm ${THEME.textMuted} mb-4 line-clamp-2">${book.description || 'Sin descripción disponible'}</p>
                            
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4 text-sm ${THEME.textMuted}">
                                    <span class="flex items-center space-x-1">
                                        <i class="fa-solid fa-file-pdf"></i>
                                        <span>${this.state.formatFileSize(book.size)}</span>
                                    </span>
                                    ${book.pages ? `
                                        <span class="flex items-center space-x-1">
                                            <i class="fa-solid fa-file-lines"></i>
                                            <span>${book.pages} págs</span>
                                        </span>
                                    ` : ''}
                                </div>
                                
                                <a href="${book.url}" 
                                   class="download-btn px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                                   data-url="${book.url}"
                                   data-title="${book.title}"
                                   target="_blank">
                                    <i class="fa-solid fa-download"></i>
                                    <span>Descargar</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Efecto hover -->
                    <div class="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
            `;
        }
        
        handleDownload(url, title) {
            // Aquí puedes añadir lógica adicional como tracking de descargas
            console.log(`Descargando: ${title}`);
            
            // Opcional: Mostrar notificación
            this.showNotification(`Descargando "${title}"...`);
        }
        
        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-[10000] transition-all transform translate-x-full ${
                type === 'info' ? 'bg-blue-600 text-white' :
                type === 'success' ? 'bg-green-600 text-white' :
                'bg-red-600 text-white'
            }`;
            notification.innerHTML = `
                <div class="flex items-center space-x-3">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Animación de entrada
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 10);
            
            // Eliminar después de 3 segundos
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }
        
        getLoadingHTML() {
            return `
                <div class="flex flex-col items-center justify-center h-64">
                    <div class="relative">
                        <div class="w-16 h-16 border-4 ${THEME.border} border-t-blue-600 rounded-full animate-spin"></div>
                        <i class="fa-solid fa-book-open text-2xl ${THEME.textMuted} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></i>
                    </div>
                    <p class="mt-4 ${THEME.textMuted}">Cargando catálogo...</p>
                </div>
            `;
        }
        
        getErrorHTML() {
            return `
                <div class="flex flex-col items-center justify-center h-64">
                    <div class="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                        <i class="fa-solid fa-exclamation-triangle text-3xl text-red-600 dark:text-red-400"></i>
                    </div>
                    <h3 class="text-lg font-semibold ${THEME.textMain} mb-2">Error al cargar el catálogo</h3>
                    <p class="text-center ${THEME.textMuted} mb-6">No se pudo cargar la biblioteca. Intenta nuevamente.</p>
                    <button id="retry-load-btn" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                        <i class="fa-solid fa-rotate mr-2"></i>
                        Reintentar
                    </button>
                </div>
            `;
        }
        
        getEmptyHTML() {
            return `
                <div class="flex flex-col items-center justify-center h-64">
                    <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <i class="fa-solid fa-book-open text-3xl ${THEME.textMuted}"></i>
                    </div>
                    <h3 class="text-lg font-semibold ${THEME.textMain} mb-2">No se encontraron libros</h3>
                    <p class="text-center ${THEME.textMuted}">
                        ${this.state.searchQuery ? 
                            `No hay resultados para "${this.state.searchQuery}". Intenta con otros términos.` :
                            'No hay libros disponibles en esta categoría.'}
                    </p>
                </div>
            `;
        }
    }
    
    // --- GESTIÓN PRINCIPAL ---
    class PremiumBookLibrary {
        constructor() {
            this.state = new BookLibraryState();
            this.ui = new BookLibraryUI(this.state);
            this.initialized = false;
        }
        
        async init() {
            if (this.initialized) return;
            
            try {
                await this.fetchCatalog();
                this.ui.createFloatingButton();
                this.ui.createModal();
                this.initialized = true;
                
                // Cargar estado inicial
                this.state.filterBooks();
                this.ui.updateFilters();
                this.ui.updateContentView();
                
            } catch (error) {
                console.error('Error inicializando biblioteca:', error);
            }
        }
        
        async fetchCatalog() {
            this.state.isLoading = true;
            this.state.hasError = false;
            
            // Verificar cache
            const now = Date.now();
            if (this.state.cache.lastFetch && (now - this.state.cache.lastFetch) < CONFIG.CACHE_DURATION) {
                console.log('Usando caché de catálogo');
                this.state.isLoading = false;
                return;
            }
            
            try {
                const response = await fetch(`${CONFIG.CATALOG_URL}?t=${now}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                this.state.books = await response.json();
                this.state.cache.lastFetch = now;
                
            } catch (error) {
                console.error('Error fetching catalog:', error);
                this.state.hasError = true;
                
                // Intentar cargar datos de respaldo si existen
                const backup = localStorage.getItem('library_backup');
                if (backup) {
                    try {
                        this.state.books = JSON.parse(backup);
                        this.state.hasError = false;
                        console.log('Usando datos de respaldo');
                    } catch (e) {
                        console.error('Error parsing backup:', e);
                    }
                }
            } finally {
                this.state.isLoading = false;
                
                // Guardar backup
                try {
                    localStorage.setItem('library_backup', JSON.stringify(this.state.books));
                } catch (e) {
                    console.warn('No se pudo guardar backup:', e);
                }
            }
        }
        
        async refresh() {
            this.state.cache.lastFetch = 0; // Forzar recarga
            this.state.isLoading = true;
            this.ui.updateContentView();
            
            await this.fetchCatalog();
            
            this.state.filterBooks(this.state.currentFilter, this.state.searchQuery);
            this.ui.updateFilters();
            this.ui.updateContentView();
            
            this.ui.showNotification('Catálogo actualizado', 'success');
        }
        
        open() {
            if (!this.initialized) {
                this.init();
                return;
            }
            
            const modal = document.getElementById('library-modal');
            if (modal) {
                modal.classList.remove('hidden');
                this.state.isModalOpen = true;
                
                // Actualizar contenido si hay cambios
                this.ui.updateContentView();
                
                // Enfocar búsqueda si hay consulta
                if (this.state.searchQuery) {
                    const searchInput = document.getElementById('library-search-input');
                    if (searchInput) {
                        searchInput.focus();
                    }
                }
            }
        }
        
        close() {
            const modal = document.getElementById('library-modal');
            if (modal) {
                modal.classList.add('hidden');
                this.state.isModalOpen = false;
            }
        }
        
        toggle() {
            if (this.state.isModalOpen) {
                this.close();
            } else {
                this.open();
            }
        }
        
        destroy() {
            // Limpiar event listeners y elementos
            const btn = document.getElementById('lib-float-btn');
            const modal = document.getElementById('library-modal');
            
            if (btn) btn.remove();
            if (modal) modal.remove();
            
            this.initialized = false;
        }
    }
    
    // --- INICIALIZACIÓN GLOBAL ---
    let libraryInstance = null;
    
    function initLibrary() {
        if (!libraryInstance) {
            libraryInstance = new PremiumBookLibrary();
            window.premiumBookLibrary = libraryInstance;
        }
        
        // Inicializar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                libraryInstance.init();
            });
        } else {
            libraryInstance.init();
        }
    }
    
    // Iniciar automáticamente
    initLibrary();
    
})();