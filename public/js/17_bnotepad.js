// 17_bnotepad.js — Libreta Virtual Apple (Arrglable & No Intrusiva)
// NO MODIFICA TU HTML - TODO SE CREA DINÁMICAMENTE
(function() {
    'use strict';
    
    // CONFIGURACIÓN
    const CONFIG = {
        STORAGE_KEY: 'nclex_draggable_notebook_v4',
        POSITION_KEY: 'nclex_notebook_position',
        AUTO_SAVE_DELAY: 1500,
        DEFAULT_COLORS: ['#007AFF', '#34C759', '#FF9500', '#FF2D55', '#5856D6', '#5AC8FA'],
        MAX_PAGES_PER_NOTEBOOK: 100,
        MAX_NOTEBOOKS: 20
    };
    
    // ESTADO
    const state = {
        notebooks: [],
        currentNotebook: null,
        currentPageIndex: 0,
        editingNotebook: null,
        selectedColor: '#007AFF',
        autoSaveTimer: null,
        isNotebookOpen: false,
        isDragging: false,
        dragOffset: { x: 0, y: 0 }
    };
    
    // UTILIDADES
    function t(es, en) {
        const lang = localStorage.getItem('nclex_lang') || 'es';
        return lang === 'en' ? en : es;
    }
    
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    function formatDate(date) {
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (hours < 24) {
            if (hours === 0) return t('Hace unos minutos', 'Just now');
            if (hours === 1) return t('Hace 1 hora', '1 hour ago');
            return t(`Hace ${hours} horas`, `${hours} hours ago`);
        }
        
        return d.toLocaleDateString();
    }
    
    function countWords(text) {
        return text.trim() ? text.trim().split(/\s+/).length : 0;
    }
    
    // GESTIÓN DE DATOS
    function loadData() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (data) {
                state.notebooks = JSON.parse(data);
            }
        } catch (e) {
            console.error('Error loading notebooks:', e);
            state.notebooks = [];
        }
    }
    
    function saveData() {
        clearTimeout(state.autoSaveTimer);
        state.autoSaveTimer = setTimeout(() => {
            try {
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state.notebooks));
            } catch (e) {
                console.error('Error saving notebooks:', e);
            }
        }, CONFIG.AUTO_SAVE_DELAY);
    }
    
    // INYECCIÓN DINÁMICA DE ELEMENTOS
    function injectStyles() {
        if (document.getElementById('notebook-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notebook-styles';
        style.textContent = `
            /* Estilos para la ventana arrastrable */
            .draggable-notebook-window {
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid rgba(0, 0, 0, 0.1);
                box-shadow: 
                    0 20px 60px rgba(0, 0, 0, 0.15),
                    0 10px 40px rgba(0, 0, 0, 0.1),
                    0 1px 0 rgba(255, 255, 255, 0.5) inset;
                border-radius: 16px;
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .dark .draggable-notebook-window {
                background: rgba(28, 28, 30, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 
                    0 20px 60px rgba(0, 0, 0, 0.4),
                    0 10px 40px rgba(0, 0, 0, 0.3),
                    0 1px 0 rgba(255, 255, 255, 0.05) inset;
            }
            
            .notebook-drag-handle {
                cursor: move;
                user-select: none;
                -webkit-user-drag: none;
            }
            
            .notebook-drag-handle:hover {
                background: rgba(0, 0, 0, 0.05);
            }
            
            .dark .notebook-drag-handle:hover {
                background: rgba(255, 255, 255, 0.05);
            }
            
            /* Resaltado al arrastrar */
            .dragging {
                opacity: 0.95;
                box-shadow: 
                    0 30px 80px rgba(0, 0, 0, 0.25),
                    0 15px 50px rgba(0, 0, 0, 0.2),
                    0 1px 0 rgba(255, 255, 255, 0.5) inset !important;
            }
            
            /* Efecto de elevación */
            .elevated {
                transform: translateY(-2px);
                box-shadow: 
                    0 30px 80px rgba(0, 0, 0, 0.2),
                    0 15px 50px rgba(0, 0, 0, 0.15),
                    0 1px 0 rgba(255, 255, 255, 0.5) inset;
            }
            
            .dark .elevated {
                box-shadow: 
                    0 30px 80px rgba(0, 0, 0, 0.5),
                    0 15px 50px rgba(0, 0, 0, 0.4),
                    0 1px 0 rgba(255, 255, 255, 0.1) inset;
            }
            
            /* Animaciones */
            @keyframes notebookSlideIn {
                from { 
                    opacity: 0; 
                    transform: translateX(30px) scale(0.95); 
                }
                to { 
                    opacity: 1; 
                    transform: translateX(0) scale(1); 
                }
            }
            
            @keyframes notebookFadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .notebook-slide-in {
                animation: notebookSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            
            .notebook-fade-in {
                animation: notebookFadeIn 0.3s ease-out forwards;
            }
            
            /* Estilos Apple para controles */
            .apple-control {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            
            .apple-control:hover {
                transform: scale(1.1);
            }
            
            .apple-control-close { background: #FF5F57; }
            .apple-control-minimize { background: #FFBD2E; }
            .apple-control-maximize { background: #28CA42; }
            
            /* Página estilo Apple */
            .apple-page {
                background: linear-gradient(to right, #f5f5f7 0%, #f5f5f7 1px, #ffffff 1px, #ffffff 100%);
                background-size: 40px 100%;
            }
            
            .dark .apple-page {
                background: linear-gradient(to right, #1a1a1c 0%, #1a1a1c 1px, #1C1C1E 1px, #1C1C1E 100%);
                background-size: 40px 100%;
            }
            
            .apple-lines {
                background: linear-gradient(to bottom, transparent 0%, transparent 94%, #e0e0e0 94%, #e0e0e0 100%);
                background-size: 100% 28px;
            }
            
            .dark .apple-lines {
                background: linear-gradient(to bottom, transparent 0%, transparent 94%, #2C2C2E 94%, #2C2C2E 100%);
                background-size: 100% 28px;
            }
            
            /* Scrollbar estilo Apple */
            .apple-scrollbar::-webkit-scrollbar {
                width: 8px;
            }
            
            .apple-scrollbar::-webkit-scrollbar-track {
                background: transparent;
                border-radius: 4px;
            }
            
            .apple-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 4px;
            }
            
            .dark .apple-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .apple-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.2);
            }
            
            .dark .apple-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            /* Botón flotante estilo Apple */
            .apple-floating-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                box-shadow: 
                    0 10px 30px rgba(102, 126, 234, 0.3),
                    0 1px 8px rgba(102, 126, 234, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .apple-floating-btn:hover {
                transform: translateY(-2px);
                box-shadow: 
                    0 15px 40px rgba(102, 126, 234, 0.4),
                    0 2px 10px rgba(102, 126, 234, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }
            
            .apple-floating-btn:active {
                transform: translateY(0);
                box-shadow: 
                    0 5px 20px rgba(102, 126, 234, 0.3),
                    0 1px 5px rgba(102, 126, 234, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(style);
    }
    
    function createFloatingButton() {
        // Crear botón flotante en la esquina inferior derecha
        if (document.getElementById('notebook-floating-btn')) return;
        
        const btn = document.createElement('button');
        btn.id = 'notebook-floating-btn';
        btn.className = 'fixed bottom-8 right-8 z-[60] w-14 h-14 rounded-2xl apple-floating-btn text-white flex items-center justify-center transition-all duration-300 group';
        btn.innerHTML = `
            <i class="fa-solid fa-book text-xl"></i>
            <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                ${t('Libreta Virtual', 'Virtual Notebook')}
                <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
        `;
        btn.onclick = () => window.NotebookManager.toggleNotebook();
        
        document.body.appendChild(btn);
    }
    
    function createNotebookWindow() {
        // Crear ventana arrastrable de libreta
        if (document.getElementById('notebook-window')) return;
        
        const windowDiv = document.createElement('div');
        windowDiv.id = 'notebook-window';
        windowDiv.className = 'fixed z-[70] hidden draggable-notebook-window notebook-slide-in';
        
        // Obtener posición guardada o usar posición por defecto (derecha)
        const savedPos = localStorage.getItem(CONFIG.POSITION_KEY);
        let initialPosition = { top: '100px', right: '20px', left: 'auto' };
        
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                if (pos.top && pos.left) {
                    initialPosition = { 
                        top: pos.top, 
                        left: pos.left, 
                        right: 'auto',
                        width: pos.width || '380px',
                        height: pos.height || '500px'
                    };
                }
            } catch (e) {
                console.error('Error loading notebook position:', e);
            }
        }
        
        // Aplicar posición inicial
        Object.assign(windowDiv.style, {
            width: initialPosition.width || '380px',
            height: initialPosition.height || '500px',
            top: initialPosition.top,
            left: initialPosition.left || 'auto',
            right: initialPosition.right || 'auto'
        });
        
        windowDiv.innerHTML = `
            <!-- Barra de título Apple Style -->
            <div class="notebook-drag-handle flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10 rounded-t-16">
                <div class="flex items-center gap-2">
                    <div class="flex gap-2">
                        <div class="apple-control apple-control-close" onclick="window.NotebookManager.closeNotebook()"></div>
                        <div class="apple-control apple-control-minimize" onclick="window.NotebookManager.toggleMinimize()"></div>
                        <div class="apple-control apple-control-maximize" onclick="window.NotebookManager.toggleMaximize()"></div>
                    </div>
                    <div class="ml-3 flex items-center gap-2">
                        <i class="fa-solid fa-book text-blue-600 dark:text-blue-400"></i>
                        <span class="font-semibold text-sm text-gray-800 dark:text-gray-200">
                            ${t('Libreta', 'Notebook')}
                        </span>
                    </div>
                </div>
                
                <div class="flex items-center gap-2">
                    <button onclick="window.NotebookManager.createNewNotebook()" 
                            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10">
                        <i class="fa-solid fa-plus text-sm"></i>
                    </button>
                    <button onclick="window.NotebookManager.downloadCurrentPage()" 
                            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10">
                        <i class="fa-solid fa-download text-sm"></i>
                    </button>
                </div>
            </div>
            
            <!-- Contenido principal -->
            <div class="flex flex-col h-[calc(100%-56px)]">
                <!-- Selector de libretas -->
                <div class="px-4 py-3 border-b border-gray-200 dark:border-white/10">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            ${t('Libretas', 'Notebooks')}
                        </h3>
                        <button onclick="window.NotebookManager.showNotebooksModal()" 
                                class="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                            ${t('Administrar', 'Manage')}
                        </button>
                    </div>
                    
                    <div class="flex items-center gap-2 overflow-x-auto pb-2 apple-scrollbar">
                        <div id="notebooks-tabs" class="flex gap-1">
                            <!-- Las libretas se cargarán aquí como pestañas -->
                        </div>
                    </div>
                </div>
                
                <!-- Área de escritura -->
                <div class="flex-1 p-4 overflow-hidden">
                    <div class="apple-page h-full rounded-xl shadow-inner overflow-hidden">
                        <div class="h-full p-6 apple-lines">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h4 id="current-notebook-title" class="font-bold text-gray-800 dark:text-gray-200 text-lg"></h4>
                                    <p id="current-page-info" class="text-xs text-gray-500 mt-1"></p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button onclick="window.NotebookManager.prevPage()" 
                                            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10">
                                        <i class="fa-solid fa-chevron-left"></i>
                                    </button>
                                    <span id="current-page-number" class="text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[20px] text-center">1</span>
                                    <button onclick="window.NotebookManager.nextPage()" 
                                            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10">
                                        <i class="fa-solid fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <textarea id="notebook-editor" 
                                      class="w-full h-[calc(100%-60px)] bg-transparent text-gray-900 dark:text-gray-100 font-sans text-base leading-relaxed resize-none focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500"
                                      placeholder="${t('Escribe tus notas aquí...', 'Write your notes here...')}"
                                      spellcheck="true"
                                      autocomplete="off"></textarea>
                        </div>
                    </div>
                </div>
                
                <!-- Barra de estado -->
                <div class="px-4 py-2 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50 dark:bg-white/5">
                    <div class="flex items-center gap-4">
                        <span id="word-count">0 ${t('palabras', 'words')}</span>
                        <span id="char-count">0 ${t('caracteres', 'characters')}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="window.NotebookManager.addPage()" 
                                class="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                            + ${t('Nueva página', 'New page')}
                        </button>
                        <span id="save-status" class="text-green-500 hidden">
                            <i class="fa-solid fa-check"></i> ${t('Guardado', 'Saved')}
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(windowDiv);
        setupDraggableWindow();
        setupEditorEvents();
    }
    
    function createNotebooksModal() {
        // Crear modal para administrar libretas
        if (document.getElementById('notebooks-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'notebooks-modal';
        modal.className = 'fixed inset-0 z-[80] hidden bg-black/40 backdrop-blur-sm';
        modal.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden draggable-notebook-window notebook-fade-in">
                    <div class="px-6 py-5 border-b border-gray-200 dark:border-white/10">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                                ${t('Administrar Libretas', 'Manage Notebooks')}
                            </h3>
                            <button onclick="window.NotebookManager.closeNotebooksModal()" 
                                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="p-6">
                        <div class="mb-6">
                            <button onclick="window.NotebookManager.createNewNotebookModal()" 
                                    class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-bold">
                                <i class="fa-solid fa-plus"></i>
                                ${t('Crear Nueva Libreta', 'Create New Notebook')}
                            </button>
                        </div>
                        
                        <div class="mb-4">
                            <div class="relative">
                                <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input type="text" id="modal-search-notebooks" 
                                       placeholder="${t('Buscar libretas...', 'Search notebooks...')}" 
                                       class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                            </div>
                        </div>
                        
                        <div id="modal-notebooks-list" class="space-y-2 max-h-[300px] overflow-y-auto apple-scrollbar">
                            <!-- Lista de libretas en el modal -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'notebooks-modal') {
                window.NotebookManager.closeNotebooksModal();
            }
        });
    }
    
    function createNewNotebookModal() {
        // Modal para crear nueva libreta
        if (document.getElementById('new-notebook-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'new-notebook-modal';
        modal.className = 'fixed inset-0 z-[90] hidden bg-black/40 backdrop-blur-sm';
        modal.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden draggable-notebook-window notebook-fade-in">
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            ${t('Nueva Libreta', 'New Notebook')}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-6">
                            ${t('Dale un nombre a tu libreta y elige un color', 'Give your notebook a name and choose a color')}
                        </p>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    ${t('Nombre de la libreta', 'Notebook Name')}
                                </label>
                                <input type="text" id="new-notebook-name" 
                                       class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                       placeholder="${t('Ej: Farmacología', 'E.g.: Pharmacology')}">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    ${t('Color', 'Color')}
                                </label>
                                <div class="grid grid-cols-6 gap-2">
                                    ${CONFIG.DEFAULT_COLORS.map(color => `
                                        <button onclick="window.NotebookManager.selectNotebookColor('${color}')" 
                                                class="color-option w-8 h-8 rounded-lg border-2 border-white dark:border-gray-800 hover:scale-110 transition-transform"
                                                style="background-color: ${color}">
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex justify-end gap-3 mt-8">
                            <button onclick="window.NotebookManager.closeNewNotebookModal()" 
                                    class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                ${t('Cancelar', 'Cancel')}
                            </button>
                            <button onclick="window.NotebookManager.saveNewNotebook()" 
                                    class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                                ${t('Crear', 'Create')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'new-notebook-modal') {
                window.NotebookManager.closeNewNotebookModal();
            }
        });
    }
    
    // FUNCIONES DE ARRASTRE
    function setupDraggableWindow() {
        const windowEl = document.getElementById('notebook-window');
        const dragHandle = windowEl.querySelector('.notebook-drag-handle');
        
        if (!windowEl || !dragHandle) return;
        
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        
        const startDrag = (e) => {
            if (e.target.closest('button') || e.target.closest('.apple-control')) return;
            
            isDragging = true;
            state.isDragging = true;
            
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            
            startX = clientX;
            startY = clientY;
            
            const rect = windowEl.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            
            windowEl.classList.add('dragging', 'elevated');
            
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchmove', onDrag, { passive: false });
            document.addEventListener('touchend', endDrag);
        };
        
        const onDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            
            const dx = clientX - startX;
            const dy = clientY - startY;
            
            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;
            
            // Limitar a los bordes de la pantalla
            const maxX = window.innerWidth - windowEl.offsetWidth;
            const maxY = window.innerHeight - windowEl.offsetHeight;
            
            newLeft = Math.max(0, Math.min(newLeft, maxX));
            newTop = Math.max(0, Math.min(newTop, maxY));
            
            windowEl.style.left = `${newLeft}px`;
            windowEl.style.top = `${newTop}px`;
            windowEl.style.right = 'auto';
        };
        
        const endDrag = () => {
            if (!isDragging) return;
            
            isDragging = false;
            state.isDragging = false;
            
            windowEl.classList.remove('dragging');
            setTimeout(() => windowEl.classList.remove('elevated'), 300);
            
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', onDrag);
            document.removeEventListener('touchend', endDrag);
            
            // Guardar posición
            saveWindowPosition();
        };
        
        dragHandle.addEventListener('mousedown', startDrag);
        dragHandle.addEventListener('touchstart', startDrag, { passive: false });
        
        // Prevenir selección de texto durante el arrastre
        dragHandle.addEventListener('selectstart', (e) => {
            if (isDragging) e.preventDefault();
        });
    }
    
    function saveWindowPosition() {
        const windowEl = document.getElementById('notebook-window');
        if (!windowEl) return;
        
        const position = {
            top: windowEl.style.top,
            left: windowEl.style.left,
            width: windowEl.style.width,
            height: windowEl.style.height
        };
        
        localStorage.setItem(CONFIG.POSITION_KEY, JSON.stringify(position));
    }
    
    function setupEditorEvents() {
        const editor = document.getElementById('notebook-editor');
        if (editor) {
            editor.addEventListener('input', () => {
                window.NotebookManager.updateCounters();
                window.NotebookManager.saveCurrentPage();
            });
        }
    }
    
    // API PÚBLICA
    window.NotebookManager = {
        // Gestión de ventana
        toggleNotebook: function() {
            const windowEl = document.getElementById('notebook-window');
            if (!windowEl) return;
            
            if (windowEl.classList.contains('hidden')) {
                this.openNotebook();
            } else {
                this.closeNotebook();
            }
        },
        
        openNotebook: function() {
            const windowEl = document.getElementById('notebook-window');
            if (!windowEl) return;
            
            windowEl.classList.remove('hidden');
            state.isNotebookOpen = true;
            
            // Cargar primera libreta si existe
            if (state.notebooks.length > 0 && !state.currentNotebook) {
                this.openNotebookById(state.notebooks[0].id);
            } else if (state.currentNotebook) {
                this.loadCurrentNotebook();
            }
        },
        
        closeNotebook: function() {
            const windowEl = document.getElementById('notebook-window');
            if (!windowEl) return;
            
            windowEl.classList.add('hidden');
            state.isNotebookOpen = false;
            this.saveCurrentPage();
            saveWindowPosition();
        },
        
        toggleMinimize: function() {
            const windowEl = document.getElementById('notebook-window');
            if (!windowEl) return;
            
            const isMinimized = windowEl.style.height === '56px';
            
            if (isMinimized) {
                windowEl.style.height = '500px';
                windowEl.querySelector('.fa-chevron-up')?.classList.replace('fa-chevron-up', 'fa-chevron-down');
            } else {
                windowEl.style.height = '56px';
                windowEl.querySelector('.fa-chevron-down')?.classList.replace('fa-chevron-down', 'fa-chevron-up');
                saveWindowPosition();
            }
        },
        
        toggleMaximize: function() {
            const windowEl = document.getElementById('notebook-window');
            if (!windowEl) return;
            
            const isMaximized = windowEl.style.width === '90vw';
            
            if (isMaximized) {
                windowEl.style.width = '380px';
                windowEl.style.height = '500px';
                windowEl.style.top = '100px';
                windowEl.style.left = 'calc(100% - 400px)';
            } else {
                windowEl.style.width = '90vw';
                windowEl.style.height = '90vh';
                windowEl.style.top = '5vh';
                windowEl.style.left = '5vw';
            }
            
            saveWindowPosition();
        },
        
        // Gestión de libretas
        createNewNotebookModal: function() {
            state.editingNotebook = null;
            state.selectedColor = CONFIG.DEFAULT_COLORS[0];
            document.getElementById('new-notebook-name').value = '';
            
            document.querySelectorAll('.color-option').forEach(btn => {
                btn.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-500');
            });
            
            document.getElementById('new-notebook-modal').classList.remove('hidden');
        },
        
        selectNotebookColor: function(color) {
            state.selectedColor = color;
            document.querySelectorAll('.color-option').forEach(btn => {
                btn.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-500');
                if (btn.style.backgroundColor === color) {
                    btn.classList.add('ring-2', 'ring-offset-2', 'ring-blue-500');
                }
            });
        },
        
        saveNewNotebook: function() {
            const nameInput = document.getElementById('new-notebook-name');
            const name = nameInput.value.trim();
            
            if (!name) {
                alert(t('Por favor ingresa un nombre para la libreta', 'Please enter a notebook name'));
                return;
            }
            
            if (state.notebooks.length >= CONFIG.MAX_NOTEBOOKS) {
                alert(t('Has alcanzado el límite máximo de libretas', 'You have reached the maximum number of notebooks'));
                return;
            }
            
            const newNotebook = {
                id: generateId(),
                name: name,
                color: state.selectedColor,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                pages: [{
                    id: generateId(),
                    content: '',
                    createdAt: new Date().toISOString(),
                    pageNumber: 1
                }]
            };
            
            state.notebooks.unshift(newNotebook);
            state.currentNotebook = newNotebook;
            state.currentPageIndex = 0;
            
            saveData();
            this.loadNotebooksTabs();
            this.loadCurrentNotebook();
            this.closeNewNotebookModal();
            
            if (!state.isNotebookOpen) {
                this.openNotebook();
            }
        },
        
        openNotebookById: function(notebookId) {
            const notebook = state.notebooks.find(n => n.id === notebookId);
            if (!notebook) return;
            
            state.currentNotebook = notebook;
            state.currentPageIndex = 0;
            
            if (!notebook.pages || notebook.pages.length === 0) {
                notebook.pages = [{
                    id: generateId(),
                    content: '',
                    createdAt: new Date().toISOString(),
                    pageNumber: 1
                }];
                saveData();
            }
            
            this.loadCurrentNotebook();
            this.loadNotebooksTabs();
        },
        
        loadCurrentNotebook: function() {
            if (!state.currentNotebook) return;
            
            const editor = document.getElementById('notebook-editor');
            const title = document.getElementById('current-notebook-title');
            const pageInfo = document.getElementById('current-page-info');
            const pageNumber = document.getElementById('current-page-number');
            
            if (title) {
                title.textContent = state.currentNotebook.name;
                title.style.color = state.currentNotebook.color;
            }
            
            if (pageInfo) {
                pageInfo.textContent = t('Última modificación: ', 'Last modified: ') + 
                    formatDate(state.currentNotebook.lastModified);
            }
            
            if (state.currentNotebook.pages[state.currentPageIndex]) {
                const page = state.currentNotebook.pages[state.currentPageIndex];
                
                if (editor) editor.value = page.content;
                if (pageNumber) pageNumber.textContent = page.pageNumber;
                
                this.updateCounters();
            }
        },
        
        loadNotebooksTabs: function() {
            const container = document.getElementById('notebooks-tabs');
            if (!container) return;
            
            let html = '';
            state.notebooks.forEach(notebook => {
                const isActive = state.currentNotebook && state.currentNotebook.id === notebook.id;
                
                html += `
                    <button onclick="window.NotebookManager.openNotebookById('${notebook.id}')" 
                            class="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${isActive ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}"
                            style="${isActive ? `border-left: 3px solid ${notebook.color}` : ''}">
                        <i class="fa-solid fa-book mr-1" style="color: ${notebook.color}"></i>
                        ${notebook.name}
                    </button>
                `;
            });
            
            container.innerHTML = html;
        },
        
        // Gestión de páginas
        prevPage: function() {
            if (state.currentPageIndex > 0) {
                this.saveCurrentPage();
                state.currentPageIndex--;
                this.loadCurrentNotebook();
            }
        },
        
        nextPage: function() {
            if (state.currentNotebook && state.currentPageIndex < state.currentNotebook.pages.length - 1) {
                this.saveCurrentPage();
                state.currentPageIndex++;
                this.loadCurrentNotebook();
            } else {
                this.addPage();
            }
        },
        
        addPage: function() {
            if (!state.currentNotebook) return;
            
            if (state.currentNotebook.pages.length >= CONFIG.MAX_PAGES_PER_NOTEBOOK) {
                alert(t('Has alcanzado el límite máximo de páginas por libreta', 'You have reached the maximum pages per notebook'));
                return;
            }
            
            this.saveCurrentPage();
            
            const newPage = {
                id: generateId(),
                content: '',
                createdAt: new Date().toISOString(),
                pageNumber: state.currentNotebook.pages.length + 1
            };
            
            state.currentNotebook.pages.push(newPage);
            state.currentPageIndex = state.currentNotebook.pages.length - 1;
            state.currentNotebook.lastModified = new Date().toISOString();
            
            saveData();
            this.loadCurrentNotebook();
            
            // Mostrar indicador de guardado
            this.showSaveIndicator();
        },
        
        saveCurrentPage: function() {
            if (!state.currentNotebook || !state.currentNotebook.pages[state.currentPageIndex]) return;
            
            const editor = document.getElementById('notebook-editor');
            if (editor) {
                state.currentNotebook.pages[state.currentPageIndex].content = editor.value;
                state.currentNotebook.lastModified = new Date().toISOString();
                saveData();
                this.updateCounters();
            }
        },
        
        updateCounters: function() {
            if (!state.currentNotebook || !state.currentNotebook.pages[state.currentPageIndex]) return;
            
            const content = state.currentNotebook.pages[state.currentPageIndex].content;
            const wordCount = document.getElementById('word-count');
            const charCount = document.getElementById('char-count');
            
            if (wordCount) {
                wordCount.textContent = `${countWords(content)} ${t('palabras', 'words')}`;
            }
            if (charCount) {
                charCount.textContent = `${content.length} ${t('caracteres', 'characters')}`;
            }
        },
        
        showSaveIndicator: function() {
            const indicator = document.getElementById('save-status');
            if (indicator) {
                indicator.classList.remove('hidden');
                setTimeout(() => {
                    indicator.classList.add('hidden');
                }, 2000);
            }
        },
        
        // Modal de libretas
        showNotebooksModal: function() {
            this.loadModalNotebooksList();
            document.getElementById('notebooks-modal').classList.remove('hidden');
        },
        
        closeNotebooksModal: function() {
            document.getElementById('notebooks-modal').classList.add('hidden');
        },
        
        loadModalNotebooksList: function() {
            const container = document.getElementById('modal-notebooks-list');
            if (!container) return;
            
            if (state.notebooks.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fa-solid fa-book-open text-4xl mb-4 opacity-50"></i>
                        <p class="text-sm">${t('No hay libretas aún', 'No notebooks yet')}</p>
                    </div>
                `;
                return;
            }
            
            let html = '<div class="space-y-2">';
            state.notebooks.forEach(notebook => {
                const pageCount = notebook.pages ? notebook.pages.length : 0;
                const lastModified = formatDate(notebook.lastModified);
                const isCurrent = state.currentNotebook && state.currentNotebook.id === notebook.id;
                
                html += `
                    <div class="p-3 rounded-lg border ${isCurrent ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-800'} transition-colors">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg" style="background-color: ${notebook.color}"></div>
                                <div>
                                    <h4 class="font-bold text-gray-800 dark:text-white">${notebook.name}</h4>
                                    <p class="text-xs text-gray-500">
                                        ${pageCount} ${t('páginas', 'pages')} • ${lastModified}
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center gap-1">
                                ${isCurrent ? `
                                    <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded">
                                        ${t('Actual', 'Current')}
                                    </span>
                                ` : ''}
                                <button onclick="event.stopPropagation(); window.NotebookManager.openNotebookById('${notebook.id}'); window.NotebookManager.closeNotebooksModal()" 
                                        class="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                                    ${t('Abrir', 'Open')}
                                </button>
                                <button onclick="event.stopPropagation(); window.NotebookManager.deleteNotebook('${notebook.id}')" 
                                        class="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800/50">
                                    ${t('Eliminar', 'Delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            container.innerHTML = html;
            
            // Configurar búsqueda en modal
            const searchInput = document.getElementById('modal-search-notebooks');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const items = container.querySelectorAll('div > div');
                    
                    items.forEach(item => {
                        const title = item.querySelector('h4').textContent.toLowerCase();
                        item.style.display = title.includes(searchTerm) ? 'flex' : 'none';
                    });
                });
            }
        },
        
        deleteNotebook: function(notebookId) {
            if (!confirm(t('¿Estás seguro de que quieres eliminar esta libreta? Esta acción no se puede deshacer.', 'Are you sure you want to delete this notebook? This action cannot be undone.'))) {
                return;
            }
            
            const index = state.notebooks.findIndex(n => n.id === notebookId);
            if (index !== -1) {
                state.notebooks.splice(index, 1);
                saveData();
                
                if (state.currentNotebook && state.currentNotebook.id === notebookId) {
                    state.currentNotebook = state.notebooks[0] || null;
                    state.currentPageIndex = 0;
                    this.loadCurrentNotebook();
                }
                
                this.loadNotebooksTabs();
                this.loadModalNotebooksList();
            }
        },
        
        closeNewNotebookModal: function() {
            document.getElementById('new-notebook-modal').classList.add('hidden');
        },
        
        // Exportación
        downloadCurrentPage: function() {
            if (!state.currentNotebook || !state.currentNotebook.pages[state.currentPageIndex]) return;
            
            this.saveCurrentPage();
            const page = state.currentNotebook.pages[state.currentPageIndex];
            const content = `${t('Página', 'Page')} ${page.pageNumber} - ${state.currentNotebook.name}\n\n${page.content}\n\n---\n${t('Exportado', 'Exported')}: ${new Date().toLocaleString()}`;
            
            this.downloadFile(content, `${state.currentNotebook.name}_${t('Página', 'Page')}_${page.pageNumber}.txt`);
        },
        
        downloadFile: function(content, filename) {
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename.replace(/[^a-z0-9]/gi, '_');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showSaveIndicator();
        },
        
        // Crear nueva libreta desde barra de título
        createNewNotebook: function() {
            this.createNewNotebookModal();
        }
    };
    
    // INICIALIZACIÓN
    function init() {
        // Cargar datos
        loadData();
        
        // Inyectar estilos
        injectStyles();
        
        // Crear elementos dinámicamente
        createFloatingButton();
        createNotebookWindow();
        createNotebooksModal();
        createNewNotebookModal();
        
        // Configurar auto-guardado periódico
        setInterval(() => {
            if (state.currentNotebook && state.isNotebookOpen) {
                window.NotebookManager.saveCurrentPage();
            }
        }, 30000);
        
        // Cargar primera libreta si existe
        if (state.notebooks.length > 0) {
            state.currentNotebook = state.notebooks[0];
            state.currentPageIndex = 0;
        }
        
        console.log('📓 Draggable Apple Notebook v4.0 inicializado');
    }
    
    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();