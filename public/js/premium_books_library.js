// premium_books_library.js — Biblioteca Elegante para GitHub Releases
// DESIGN SYSTEM: Estilo moderno, minimalista y profesional

(function() {
    'use strict';
    
    // DESIGN SYSTEM ELEGANTE
    const DESIGN = {
        colors: {
            primary: '#007AFF',
            secondary: '#5856D6',
            tertiary: '#FF9500',
            backgroundLight: '#F5F5F7',
            backgroundDark: '#1C1C1E',
            cardLight: '#FFFFFF',
            cardDark: '#1C1C1E',
            textPrimary: '#000000',
            textSecondary: '#8E8E93',
            textTertiary: '#C7C7CC'
        },
        typography: {
            largeTitle: 'font-bold text-3xl tracking-tight',
            title1: 'font-bold text-2xl',
            title2: 'font-bold text-xl',
            title3: 'font-semibold text-lg',
            body: 'text-base font-normal',
            callout: 'text-sm font-semibold',
            footnote: 'text-xs font-normal',
            caption1: 'text-xs font-normal text-gray-500',
            caption2: 'text-[10px] font-normal text-gray-400'
        },
        effects: {
            shadow: 'shadow-lg',
            shadowHover: 'shadow-xl',
            shadowCard: 'shadow-md',
            borderRadius: {
                small: 'rounded-lg',
                medium: 'rounded-xl',
                large: 'rounded-2xl',
                extraLarge: 'rounded-3xl'
            },
            transition: 'transition-all duration-300'
        }
    };
    
    // CONFIGURACIÓN GITHUB
    const GITHUB_CONFIG = {
        username: 'ReynierDiaz',
        repo: 'NCLEX1.2',
        releaseTag: 'BOOKS',
        apiUrl: 'https://api.github.com/repos/ReynierDiaz/NCLEX1.2/releases/tags/BOOKS'
    };
    
    // ESTADO
    const state = {
        books: [],
        isLoading: true,
        isLibraryOpen: false,
        viewMode: localStorage.getItem('library_view_mode') || 'grid',
        sortBy: 'popularity',
        filterCategory: 'all',
        lastSync: null,
        stats: {
            totalBooks: 0,
            totalSize: 0,
            totalDownloads: 0
        }
    };
    
    // HELPER BILINGÜE
    const t = (es, en) => {
        const currentLang = localStorage.getItem('nclex_lang') || 'es';
        return currentLang === 'es' ? es : en;
    };
    
    // 1. CONEXIÓN ELEGANTE A GITHUB
    async function fetchFromGitHub() {
        state.isLoading = true;
        updateLibraryView();
        
        try {
            console.log('📚 Conectando con biblioteca remota...');
            
            // Pequeño delay para mejor UX
            await new Promise(resolve => setTimeout(resolve, 600));
            
            const response = await fetch(GITHUB_CONFIG.apiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'NCLEX-Masterclass'
                }
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Colección "BOOKS" no encontrada');
                }
                throw new Error(`Error ${response.status}`);
            }
            
            const releaseData = await response.json();
            const books = processReleaseData(releaseData);
            
            // Actualizar estado con animación suave
            await animateStateUpdate(books);
            
            // Guardar en caché
            localStorage.setItem('books_cache', JSON.stringify({
                books: books,
                timestamp: Date.now(),
                releaseId: releaseData.id
            }));
            
            return books;
            
        } catch (error) {
            console.error('Error conectando:', error);
            showElegantToast(t('Error de conexión', 'Connection error'), error.message, 'error');
            return await loadCachedOrFallback();
        } finally {
            state.isLoading = false;
        }
    }
    
    async function animateStateUpdate(books) {
        return new Promise(resolve => {
            state.books = books;
            state.lastSync = new Date().toISOString();
            state.stats = calculateStats(books);
            
            // Pequeña animación
            setTimeout(resolve, 300);
        });
    }
    
    // 2. PROCESAR DATOS CON ESTILO
    function processReleaseData(releaseData) {
        if (!releaseData?.assets) return [];
        
        return releaseData.assets
            .filter(asset => asset.name.toLowerCase().endsWith('.pdf'))
            .map((pdfAsset, index) => {
                const coverAsset = findMatchingCover(pdfAsset.name, releaseData.assets);
                const category = determineBookCategory(pdfAsset.name);
                const popularity = calculatePopularity(pdfAsset.download_count);
                
                return {
                    id: `book_${pdfAsset.id}`,
                    order: index,
                    title: formatElegantTitle(pdfAsset.name),
                    subtitle: generateElegantSubtitle(category),
                    author: 'NCLEX Masterclass',
                    description: generateElegantDescription(pdfAsset.name, category),
                    category: category,
                    tags: generateTags(pdfAsset.name),
                    
                    // Archivos
                    file: pdfAsset.name,
                    fileUrl: pdfAsset.browser_download_url,
                    fileSize: pdfAsset.size,
                    formattedSize: formatFileSize(pdfAsset.size),
                    
                    // Carátula
                    coverUrl: coverAsset?.browser_download_url || null,
                    coverGradient: getCategoryGradient(category),
                    
                    // Metadatos
                    pages: estimatePageCount(pdfAsset.size, category),
                    year: 2024,
                    difficulty: estimateDifficulty(category),
                    
                    // Estadísticas
                    downloadCount: pdfAsset.download_count,
                    uploadedAt: pdfAsset.updated_at || pdfAsset.created_at,
                    
                    // UX
                    popularity: popularity,
                    isNew: isAssetNew(pdfAsset.created_at),
                    isFeatured: index < 3,
                    
                    // Estilo
                    accentColor: getAccentColor(category),
                    icon: getCategoryIcon(category)
                };
            })
            .sort((a, b) => b.popularity - a.popularity);
    }
    
    // 3. FUNCIONES DE DISEÑO ELEGANTE
    
    function formatElegantTitle(filename) {
        const name = filename.replace('.pdf', '').replace(/_/g, ' ');
        
        const titleMap = {
            'nclex': 'NCLEX-RN Official Guide',
            'saunders': 'Saunders Comprehensive Review',
            'pharmacology': 'Essential Pharmacology',
            'maternity': 'Maternal-Newborn Nursing',
            'pediatrics': 'Pediatric Care Guide',
            'mental': 'Psychiatric Nursing',
            'cardiovascular': 'Cardiac Care',
            'respiratory': 'Pulmonary Nursing'
        };
        
        for (const [key, properTitle] of Object.entries(titleMap)) {
            if (name.toLowerCase().includes(key)) {
                return properTitle;
            }
        }
        
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    
    function generateElegantSubtitle(category) {
        const subtitles = {
            'Examen': 'Material Oficial de Evaluación',
            'Revisión': 'Guía Completa de Estudio',
            'Farmacología': 'Referencia de Medicamentos',
            'Maternidad': 'Enfermería Materno-Infantil',
            'Pediatría': 'Salud y Desarrollo Infantil',
            'Salud Mental': 'Cuidado Psiquiátrico',
            'Cardiovascular': 'Cuidado Cardíaco',
            'Respiratorio': 'Salud Pulmonar'
        };
        
        return subtitles[category] || 'Material de Estudio NCLEX';
    }
    
    function getCategoryGradient(category) {
        const gradients = {
            'Examen': 'from-blue-500 to-cyan-500',
            'Revisión': 'from-purple-500 to-pink-500',
            'Farmacología': 'from-green-500 to-emerald-500',
            'Maternidad': 'from-rose-500 to-pink-400',
            'Pediatría': 'from-yellow-500 to-orange-400',
            'Salud Mental': 'from-indigo-500 to-blue-400',
            'Cardiovascular': 'from-red-500 to-rose-500',
            'Respiratorio': 'from-sky-500 to-blue-400'
        };
        
        return gradients[category] || 'from-gray-600 to-gray-400';
    }
    
    function getCategoryIcon(category) {
        const icons = {
            'Examen': 'fa-clipboard-check',
            'Revisión': 'fa-book-open',
            'Farmacología': 'fa-pills',
            'Maternidad': 'fa-baby',
            'Pediatría': 'fa-child',
            'Salud Mental': 'fa-brain',
            'Cardiovascular': 'fa-heart-pulse',
            'Respiratorio': 'fa-lungs'
        };
        
        return icons[category] || 'fa-book';
    }
    
    function getAccentColor(category) {
        const colors = {
            'Examen': 'text-blue-500',
            'Revisión': 'text-purple-500',
            'Farmacología': 'text-green-500',
            'Maternidad': 'text-pink-500',
            'Pediatría': 'text-orange-500',
            'Salud Mental': 'text-indigo-500',
            'Cardiovascular': 'text-red-500',
            'Respiratorio': 'text-sky-500'
        };
        
        return colors[category] || 'text-primary';
    }
    
    // 4. COMPONENTES DE INTERFAZ ELEGANTES
    
    function renderElegantHeader() {
        return `
            <div class="sticky top-0 z-40 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-lg border-b border-gray-200/30 dark:border-white/5">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 ${DESIGN.effects.borderRadius.medium} bg-gradient-to-br from-primary to-secondary 
                                            flex items-center justify-center text-white ${DESIGN.effects.shadow}">
                                    <i class="fa-solid fa-books text-lg"></i>
                                </div>
                                <div>
                                    <h1 class="${DESIGN.typography.title1} text-gray-900 dark:text-white">
                                        ${t('Biblioteca', 'Library')}
                                    </h1>
                                    <p class="${DESIGN.typography.caption1} text-gray-500">
                                        ${state.books.length} ${t('recursos', 'resources')} • 
                                        ${t('Actualizado', 'Updated')} ${state.lastSync ? formatRelativeTime(state.lastSync) : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-3">
                            <!-- Selector de vista -->
                            <div class="flex bg-gray-100 dark:bg-white/5 ${DESIGN.effects.borderRadius.small} p-1">
                                <button onclick="window.premiumBookLibrary.setViewMode('grid')" 
                                        class="w-8 h-8 ${DESIGN.effects.borderRadius.small} flex items-center justify-center 
                                               ${state.viewMode === 'grid' 
                                                   ? 'bg-white dark:bg-white/10 shadow-sm' 
                                                   : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'} 
                                               ${DESIGN.effects.transition}">
                                    <i class="fa-solid fa-grid-2"></i>
                                </button>
                                <button onclick="window.premiumBookLibrary.setViewMode('list')" 
                                        class="w-8 h-8 ${DESIGN.effects.borderRadius.small} flex items-center justify-center 
                                               ${state.viewMode === 'list' 
                                                   ? 'bg-white dark:bg-white/10 shadow-sm' 
                                                   : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'} 
                                               ${DESIGN.effects.transition}">
                                    <i class="fa-solid fa-list"></i>
                                </button>
                            </div>
                            
                            <!-- Botón cerrar -->
                            <button onclick="window.premiumBookLibrary.close()" 
                                    class="w-10 h-10 ${DESIGN.effects.borderRadius.medium} flex items-center justify-center 
                                           hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 
                                           ${DESIGN.effects.transition}">
                                <i class="fa-solid fa-xmark text-lg text-gray-500"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderBookCard(book) {
        return `
            <div class="group relative animate-card-enter" style="animation-delay: ${book.order * 50}ms">
                <div class="bg-white dark:bg-[#1C1C1E] ${DESIGN.effects.borderRadius.large} border border-gray-200/30 dark:border-white/10 
                            overflow-hidden ${DESIGN.effects.shadowCard} hover:${DESIGN.effects.shadowHover} 
                            ${DESIGN.effects.transition} hover:-translate-y-1 active:scale-[0.98] h-full flex flex-col">
                    
                    <!-- Portada con gradiente -->
                    <div class="relative overflow-hidden bg-gradient-to-br ${book.coverGradient}">
                        ${book.coverUrl ? `
                            <img src="${book.coverUrl}" alt="${book.title}" 
                                 class="w-full h-48 object-cover opacity-90 group-hover:scale-105 
                                        transition-transform duration-500">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        ` : `
                            <div class="w-full h-48 flex flex-col items-center justify-center p-6">
                                <i class="${book.icon} text-5xl text-white/80 mb-3"></i>
                                <p class="text-white/70 text-center text-sm font-medium leading-tight">
                                    ${book.title}
                                </p>
                            </div>
                        `}
                        
                        <!-- Badges -->
                        <div class="absolute top-3 right-3 flex flex-col gap-2">
                            ${book.isFeatured ? `
                                <div class="px-2 py-1 ${DESIGN.effects.borderRadius.small} bg-white/90 backdrop-blur-sm 
                                            text-xs font-bold text-gray-900 flex items-center gap-1">
                                    <i class="fa-solid fa-star text-yellow-500"></i>
                                    ${t('Destacado', 'Featured')}
                                </div>
                            ` : ''}
                            
                            ${book.isNew ? `
                                <div class="px-2 py-1 ${DESIGN.effects.borderRadius.small} bg-green-500 text-white text-xs font-bold">
                                    ${t('Nuevo', 'New')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Contenido -->
                    <div class="p-5 flex-1 flex flex-col">
                        <!-- Categoría -->
                        <div class="mb-3">
                            <span class="${DESIGN.typography.caption2} ${book.accentColor} font-semibold uppercase tracking-wider">
                                ${book.category}
                            </span>
                        </div>
                        
                        <!-- Título y subtítulo -->
                        <h3 class="${DESIGN.typography.title3} text-gray-900 dark:text-white mb-1 line-clamp-2 
                                   group-hover:text-primary ${DESIGN.effects.transition}">
                            ${book.title}
                        </h3>
                        <p class="${DESIGN.typography.caption1} text-gray-500 mb-3">
                            ${book.subtitle}
                        </p>
                        
                        <!-- Descripción -->
                        <p class="${DESIGN.typography.footnote} text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">
                            ${book.description}
                        </p>
                        
                        <!-- Estadísticas -->
                        <div class="flex items-center justify-between ${DESIGN.typography.caption2} text-gray-400 mb-4 
                                   pt-3 border-t border-gray-100/50 dark:border-white/5">
                            <div class="flex items-center gap-3">
                                <span class="flex items-center gap-1">
                                    <i class="fa-solid fa-file-lines"></i>
                                    ${book.pages} ${t('págs', 'pgs')}
                                </span>
                                <span class="flex items-center gap-1">
                                    <i class="fa-solid fa-hard-drive"></i>
                                    ${book.formattedSize}
                                </span>
                            </div>
                            <span class="flex items-center gap-1 ${book.downloadCount > 100 ? 'text-orange-500' : ''}">
                                <i class="fa-solid fa-download"></i>
                                ${book.downloadCount}
                            </span>
                        </div>
                        
                        <!-- Botón de acción -->
                        <button onclick="window.premiumBookLibrary.previewBook('${book.id}')" 
                                class="w-full py-3 ${DESIGN.effects.borderRadius.medium} bg-gray-100 dark:bg-white/5 
                                       text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 
                                       active:scale-95 ${DESIGN.effects.transition} flex items-center justify-center gap-2 
                                       ${DESIGN.typography.callout} font-semibold">
                            <i class="fa-solid fa-eye"></i>
                            ${t('Explorar', 'Explore')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderBookList(book) {
        return `
            <div class="group animate-card-enter" style="animation-delay: ${book.order * 30}ms">
                <div class="flex items-center gap-4 p-4 ${DESIGN.effects.borderRadius.large} hover:bg-gray-50/50 
                            dark:hover:bg-white/5 active:scale-[0.98] ${DESIGN.effects.transition} 
                            border-b border-gray-100/30 dark:border-white/5 last:border-0">
                    
                    <!-- Mini portada -->
                    <div class="w-12 h-12 ${DESIGN.effects.borderRadius.medium} bg-gradient-to-br ${book.coverGradient} 
                                flex items-center justify-center text-white ${DESIGN.effects.shadowCard} flex-shrink-0">
                        ${book.coverUrl ? `
                            <img src="${book.coverUrl}" alt="${book.title}" 
                                 class="w-full h-full object-cover ${DESIGN.effects.borderRadius.medium}">
                        ` : `
                            <i class="${book.icon}"></i>
                        `}
                    </div>
                    
                    <!-- Contenido -->
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start mb-1">
                            <h3 class="${DESIGN.typography.callout} font-semibold text-gray-900 dark:text-white truncate">
                                ${book.title}
                            </h3>
                            <span class="${DESIGN.typography.caption2} text-gray-400 bg-gray-100 dark:bg-white/5 
                                        px-2 py-1 ${DESIGN.effects.borderRadius.small} flex-shrink-0 ml-2">
                                ${book.formattedSize}
                            </span>
                        </div>
                        
                        <p class="${DESIGN.typography.caption1} text-gray-500 mb-2 truncate">
                            ${book.subtitle}
                        </p>
                        
                        <div class="flex items-center gap-3 ${DESIGN.typography.caption2} text-gray-400">
                            <span class="flex items-center gap-1 ${book.accentColor}">
                                <i class="${book.icon}"></i>
                                ${book.category}
                            </span>
                            <span>•</span>
                            <span class="flex items-center gap-1">
                                <i class="fa-solid fa-download"></i>
                                ${book.downloadCount}
                            </span>
                            <span>•</span>
                            <span class="flex items-center gap-1">
                                <i class="fa-solid fa-file-lines"></i>
                                ${book.pages}p
                            </span>
                        </div>
                    </div>
                    
                    <!-- Acción rápida -->
                    <button onclick="window.premiumBookLibrary.downloadBook('${book.id}')" 
                            class="w-10 h-10 ${DESIGN.effects.borderRadius.medium} flex items-center justify-center 
                                   hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 
                                   ${DESIGN.effects.transition} text-gray-500"
                            title="${t('Descargar', 'Download')}">
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    // 5. MODAL PRINCIPAL ELEGANTE
    function createElegantModal() {
        if (document.getElementById('elegant-books-modal')) return;
        
        const modalHTML = `
            <div id="elegant-books-modal" class="fixed inset-0 z-[9999] hidden">
                
                <!-- Fondo con blur -->
                <div class="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500"
                     onclick="window.premiumBookLibrary.close()"></div>
                
                <!-- Contenedor del modal -->
                <div class="absolute inset-0 flex items-center justify-center p-4">
                    <div class="w-full max-w-6xl h-[90vh] bg-white dark:bg-[#1C1C1E] 
                                ${DESIGN.effects.borderRadius.extraLarge} ${DESIGN.effects.shadow} 
                                overflow-hidden flex flex-col animate-modal-enter">
                        
                        <!-- Encabezado -->
                        <div id="elegant-books-header"></div>
                        
                        <!-- Área de contenido -->
                        <div class="flex-1 overflow-hidden flex">
                            <!-- Panel lateral para filtros -->
                            <div class="hidden lg:block w-64 border-r border-gray-200/30 dark:border-white/5 
                                        bg-gray-50/30 dark:bg-black/20 p-6">
                                ${renderSidebar()}
                            </div>
                            
                            <!-- Contenido principal -->
                            <div class="flex-1 overflow-hidden flex flex-col">
                                <!-- Barra de estadísticas -->
                                <div class="px-6 py-4 border-b border-gray-200/30 dark:border-white/5 
                                            bg-gray-50/20 dark:bg-white/5">
                                    ${renderStatsBar()}
                                </div>
                                
                                <!-- Grid/Lista de libros -->
                                <div id="elegant-books-content" class="flex-1 overflow-y-auto p-6">
                                    ${renderSkeletonLoader()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    function renderSkeletonLoader() {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${Array.from({length: 6}).map((_, i) => `
                    <div class="animate-pulse">
                        <div class="bg-gray-200 dark:bg-white/5 ${DESIGN.effects.borderRadius.large} h-64"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    function renderStatsBar() {
        const totalSize = state.books.reduce((sum, book) => sum + (book.fileSize || 0), 0);
        const formattedSize = formatFileSize(totalSize);
        
        return `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 ${DESIGN.effects.borderRadius.small} bg-primary"></div>
                        <span class="${DESIGN.typography.caption1} text-gray-600 dark:text-gray-400">
                            ${state.books.length} ${t('recursos', 'resources')}
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 ${DESIGN.effects.borderRadius.small} bg-green-500"></div>
                        <span class="${DESIGN.typography.caption1} text-gray-600 dark:text-gray-400">
                            ${formattedSize} ${t('total', 'total')}
                        </span>
                    </div>
                </div>
                <button onclick="window.premiumBookLibrary.refresh()" 
                        class="flex items-center gap-2 ${DESIGN.typography.callout} text-primary 
                               hover:text-blue-600 active:scale-95 ${DESIGN.effects.transition}">
                    <i class="fa-solid fa-arrow-rotate-right"></i>
                    ${t('Actualizar', 'Refresh')}
                </button>
            </div>
        `;
    }
    
    // 6. API PÚBLICA ELEGANTE
    window.premiumBookLibrary = {
        // Abrir biblioteca con animación
        async open() {
            createElegantModal();
            
            const modal = document.getElementById('elegant-books-modal');
            const header = document.getElementById('elegant-books-header');
            const content = document.getElementById('elegant-books-content');
            
            if (!modal || !header || !content) return;
            
            // Mostrar modal
            modal.classList.remove('hidden');
            
            // Animación de entrada
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Renderizar contenido inicial
            header.innerHTML = renderElegantHeader();
            content.innerHTML = renderSkeletonLoader();
            
            // Cargar datos
            await this.refresh();
            
            // Aplicar idioma
            this.applyLanguage();
        },
        
        // Cerrar con animación suave
        async close() {
            const modal = document.getElementById('elegant-books-modal');
            if (!modal) return;
            
            // Animación de salida
            modal.querySelector('.animate-modal-enter').classList.add('animate-modal-exit');
            
            await new Promise(resolve => setTimeout(resolve, 300));
            modal.classList.add('hidden');
            
            // Resetear animación
            setTimeout(() => {
                const modalContent = modal.querySelector('.animate-modal-enter');
                if (modalContent) {
                    modalContent.classList.remove('animate-modal-exit');
                }
            }, 350);
        },
        
        // Refrescar datos
        async refresh() {
            const content = document.getElementById('elegant-books-content');
            if (content) {
                content.innerHTML = renderSkeletonLoader();
            }
            
            await fetchFromGitHub();
            updateLibraryView();
            
            // Mostrar notificación
            this.showElegantToast(
                t('Biblioteca actualizada', 'Library updated'),
                t('Se sincronizaron', 'Synced') + ` ${state.books.length} ` + t('recursos', 'resources')
            );
        },
        
        // Vista previa de libro
        previewBook(bookId) {
            const book = state.books.find(b => b.id === bookId);
            if (!book) return;
            
            // Crear modal de vista previa
            this.showBookPreview(book);
        },
        
        // Descargar libro
        async downloadBook(bookId) {
            const book = state.books.find(b => b.id === bookId);
            if (!book) return;
            
            try {
                // Mostrar notificación de descarga
                this.showElegantToast(
                    t('Descargando', 'Downloading'),
                    book.title
                );
                
                // Abrir en nueva pestaña
                window.open(book.fileUrl, '_blank');
                
                // Actualizar contador
                book.downloadCount++;
                
            } catch (error) {
                this.showElegantToast(
                    t('Error', 'Error'),
                    t('No se pudo descargar', 'Could not download'),
                    'error'
                );
            }
        },
        
        // Cambiar modo de vista
        setViewMode(mode) {
            state.viewMode = mode;
            updateLibraryView();
            localStorage.setItem('library_view_mode', mode);
        },
        
        // Aplicar idioma
        applyLanguage() {
            updateLibraryView();
        },
        
        // Mostrar notificación elegante
        showElegantToast(title, message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `
                fixed top-6 right-6 z-[10000] max-w-sm
                bg-white dark:bg-[#1C1C1E] ${DESIGN.effects.borderRadius.large} ${DESIGN.effects.shadow} 
                border border-gray-200/30 dark:border-white/10
                p-4 transform translate-x-full
                animate-toast-enter
            `;
            
            const icon = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
            const color = type === 'error' ? 'text-red-500' : 'text-green-500';
            
            toast.innerHTML = `
                <div class="flex items-start gap-3">
                    <i class="fa-solid ${icon} text-lg ${color} mt-0.5"></i>
                    <div class="flex-1">
                        <div class="font-semibold text-gray-900 dark:text-white">${title}</div>
                        <div class="text-sm text-gray-500 mt-1">${message}</div>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="w-8 h-8 ${DESIGN.effects.borderRadius.small} flex items-center justify-center 
                                   hover:bg-gray-100 dark:hover:bg-white/10 ${DESIGN.effects.transition}">
                        <i class="fa-solid fa-xmark text-gray-400"></i>
                    </button>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            // Auto-remover
            setTimeout(() => {
                toast.classList.add('animate-toast-exit');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    };
    
    // 7. FUNCIONES AUXILIARES
    
    function updateLibraryView() {
        const content = document.getElementById('elegant-books-content');
        const header = document.getElementById('elegant-books-header');
        
        if (header) {
            header.innerHTML = renderElegantHeader();
        }
        
        if (!content) return;
        
        if (state.isLoading) {
            content.innerHTML = renderSkeletonLoader();
            return;
        }
        
        if (state.books.length === 0) {
            content.innerHTML = renderEmptyState();
            return;
        }
        
        const booksToShow = state.books;
        
        content.innerHTML = `
            ${state.viewMode === 'grid' 
                ? `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${booksToShow.map(renderBookCard).join('')}
                   </div>`
                : `<div class="space-y-2">${booksToShow.map(renderBookList).join('')}</div>`
            }
        `;
    }
    
    function renderEmptyState() {
        return `
            <div class="h-full flex flex-col items-center justify-center p-12 text-center">
                <div class="w-24 h-24 ${DESIGN.effects.borderRadius.extraLarge} bg-gradient-to-br from-gray-200 to-gray-300 
                            dark:from-white/5 dark:to-white/10 flex items-center justify-center mb-6">
                    <i class="fa-solid fa-books text-3xl text-gray-400"></i>
                </div>
                <h3 class="${DESIGN.typography.title2} text-gray-900 dark:text-white mb-2">
                    ${t('Biblioteca Vacía', 'Empty Library')}
                </h3>
                <p class="${DESIGN.typography.body} text-gray-500 max-w-md mb-6">
                    ${t('No se encontraron recursos en la colección remota.', 
                        'No resources found in remote collection.')}
                </p>
                <button onclick="window.premiumBookLibrary.refresh()" 
                        class="px-6 py-3 ${DESIGN.effects.borderRadius.medium} bg-primary text-white font-semibold 
                               hover:bg-blue-600 active:scale-95 ${DESIGN.effects.transition}">
                    <i class="fa-solid fa-rotate mr-2"></i>
                    ${t('Intentar Nuevamente', 'Try Again')}
                </button>
            </div>
        `;
    }
    
    function renderSidebar() {
        const categories = [...new Set(state.books.map(b => b.category))];
        
        return `
            <div class="space-y-6">
                <div>
                    <h4 class="${DESIGN.typography.callout} font-semibold text-gray-900 
                               dark:text-white mb-3">
                        ${t('Categorías', 'Categories')}
                    </h4>
                    <div class="space-y-1">
                        ${categories.map(cat => `
                            <button class="w-full text-left px-3 py-2 ${DESIGN.effects.borderRadius.medium} 
                                          hover:bg-gray-100 dark:hover:bg-white/5 ${DESIGN.effects.transition} 
                                          text-sm ${state.filterCategory === cat 
                                              ? 'bg-primary/10 text-primary' 
                                              : 'text-gray-600 dark:text-gray-400'}">
                                ${cat}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // 8. INICIALIZACIÓN
    
    function init() {
        // Cargar preferencias
        state.viewMode = localStorage.getItem('library_view_mode') || 'grid';
        
        // Crear botón flotante elegante
        createElegantFloatingButton();
        
        // Cargar datos en background
        setTimeout(() => fetchFromGitHub(), 1000);
        
        // Agregar estilos CSS
        addElegantStyles();
    }
    
    function createElegantFloatingButton() {
        if (document.getElementById('elegant-books-btn')) return;
        
        const buttonHTML = `
            <button id="elegant-books-btn" 
                    onclick="window.premiumBookLibrary.open()"
                    class="fixed bottom-32 right-8 z-[9998] group">
                <div class="relative">
                    <!-- Efecto de brillo -->
                    <div class="absolute inset-0 bg-primary ${DESIGN.effects.borderRadius.large} blur-xl 
                                opacity-20 group-hover:opacity-30 ${DESIGN.effects.transition}"></div>
                    
                    <!-- Botón principal -->
                    <div class="relative w-14 h-14 bg-gradient-to-br from-gray-900 to-slate-800 
                                hover:from-black hover:to-slate-900 text-white ${DESIGN.effects.borderRadius.large} 
                                ${DESIGN.effects.shadow} flex items-center justify-center 
                                ${DESIGN.effects.transition} group-hover:-translate-y-1 
                                active:scale-95 border border-white/10">
                        <i class="fa-solid fa-book-open text-lg ${DESIGN.effects.transition} 
                                  group-hover:rotate-12"></i>
                        
                        <!-- Indicador de nuevos recursos -->
                        ${state.books.some(b => b.isNew) ? `
                            <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 
                                        ${DESIGN.effects.borderRadius.small} border-2 border-white dark:border-[#1C1C1E] 
                                        animate-pulse"></div>
                        ` : ''}
                    </div>
                    
                    <!-- Tooltip elegante -->
                    <div class="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 
                                bg-gray-900 text-white px-3 py-1.5 ${DESIGN.effects.borderRadius.medium} 
                                text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 
                                ${DESIGN.effects.transition} pointer-events-none">
                        ${t('Biblioteca', 'Library')}
                        <div class="absolute left-full top-1/2 -translate-y-1/2 
                                    border-8 border-transparent border-l-gray-900"></div>
                    </div>
                </div>
            </button>
        `;
        
        document.body.insertAdjacentHTML('beforeend', buttonHTML);
    }
    
    function addElegantStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Animaciones elegantes */
            @keyframes modal-enter {
                0% { 
                    opacity: 0; 
                    transform: scale(0.95) translateY(20px); 
                }
                100% { 
                    opacity: 1; 
                    transform: scale(1) translateY(0); 
                }
            }
            
            @keyframes modal-exit {
                0% { 
                    opacity: 1; 
                    transform: scale(1) translateY(0); 
                }
                100% { 
                    opacity: 0; 
                    transform: scale(0.95) translateY(20px); 
                }
            }
            
            @keyframes card-enter {
                0% { 
                    opacity: 0; 
                    transform: translateY(10px); 
                }
                100% { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            
            @keyframes toast-enter {
                0% { 
                    opacity: 0; 
                    transform: translateX(100%); 
                }
                100% { 
                    opacity: 1; 
                    transform: translateX(0); 
                }
            }
            
            @keyframes toast-exit {
                0% { 
                    opacity: 1; 
                    transform: translateX(0); 
                }
                100% { 
                    opacity: 0; 
                    transform: translateX(100%); 
                }
            }
            
            .animate-modal-enter {
                animation: modal-enter 0.4s ease-out forwards;
            }
            
            .animate-modal-exit {
                animation: modal-exit 0.3s ease-out forwards;
            }
            
            .animate-card-enter {
                animation: card-enter 0.5s ease-out forwards;
            }
            
            .animate-toast-enter {
                animation: toast-enter 0.3s ease-out forwards;
            }
            
            .animate-toast-exit {
                animation: toast-exit 0.3s ease-out forwards;
            }
            
            /* Scrollbar elegante */
            #elegant-books-content {
                scrollbar-width: thin;
            }
            
            #elegant-books-content::-webkit-scrollbar {
                width: 6px;
            }
            
            #elegant-books-content::-webkit-scrollbar-track {
                background: transparent;
            }
            
            #elegant-books-content::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 3px;
            }
            
            .dark #elegant-books-content::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
            }
            
            /* Efectos de glass morphism */
            .glass-effect {
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                background: rgba(255, 255, 255, 0.7);
            }
            
            .dark .glass-effect {
                background: rgba(28, 28, 30, 0.7);
            }
            
            /* Utilidades para texto */
            .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            .line-clamp-3 {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            /* Efecto de gradiente animado */
            .gradient-animate {
                background-size: 200% 200%;
                animation: gradient 3s ease infinite;
            }
            
            @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // FUNCIONES HELPER (implementaciones básicas)
    function showElegantToast(title, message, type = 'success') {
        console.log(`${type.toUpperCase()}: ${title} - ${message}`);
    }
    
    function findMatchingCover(pdfName, assets) {
        const baseName = pdfName.replace('.pdf', '');
        const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
        
        for (const ext of extensions) {
            const coverName = baseName + ext;
            const cover = assets.find(a => a.name === coverName);
            if (cover) return cover;
        }
        return null;
    }
    
    function determineBookCategory(filename) {
        const lower = filename.toLowerCase();
        const categories = {
            'nclex': 'Examen',
            'saunders': 'Revisión',
            'pharm': 'Farmacología',
            'maternity': 'Maternidad',
            'pediatric': 'Pediatría',
            'mental': 'Salud Mental',
            'cardio': 'Cardiovascular',
            'respir': 'Respiratorio',
            'neuro': 'Neurológico'
        };
        
        for (const [key, category] of Object.entries(categories)) {
            if (lower.includes(key)) {
                return category;
            }
        }
        return 'General';
    }
    
    function calculatePopularity(downloads) {
        return downloads || 0;
    }
    
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    
    function formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return t('ahora', 'just now');
        if (diffMins < 60) return t('hace', '') + ` ${diffMins} ` + t('min', 'min ago');
        if (diffMins < 1440) return t('hace', '') + ` ${Math.floor(diffMins / 60)} ` + t('h', 'h ago');
        return date.toLocaleDateString();
    }
    
    function calculateStats(books) {
        return {
            totalBooks: books.length,
            totalSize: books.reduce((sum, b) => sum + (b.fileSize || 0), 0),
            totalDownloads: books.reduce((sum, b) => sum + (b.downloadCount || 0), 0)
        };
    }
    
    // INICIAR
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();