// 17_bnotepad.js — Super Libreta Sticky con Diseño Apple
// VERSIÓN: 5.0 (Apple Design System)
(function() {
    'use strict';

    // CONFIGURACIÓN
    const CONFIG = {
        STORAGE_KEY: 'nclex_notebook_apple',
        AUTO_SAVE_DELAY: 1500,
        MAX_PAGES: 50,
        DEFAULT_COLORS: [
            { name: 'yellow', value: '#FFD60A', darkValue: '#FFB800' },
            { name: 'blue', value: '#007AFF', darkValue: '#0A84FF' },
            { name: 'pink', value: '#FF2D55', darkValue: '#FF375F' },
            { name: 'green', value: '#34C759', darkValue: '#30D158' },
            { name: 'purple', value: '#AF52DE', darkValue: '#BF5AF2' },
            { name: 'orange', value: '#FF9500', darkValue: '#FF9F0A' }
        ]
    };

    // ESTADO
    const state = {
        pages: [],
        currentIndex: 0,
        isDragging: false,
        autoSaveTimer: null,
        isFullscreen: false,
        sidebarOpen: true,
        selectedTool: 'select'
    };

    // -------------------------------------------------------------------------
    // 1. GESTIÓN DE DATOS
    // -------------------------------------------------------------------------
    
    function loadData() {
        try {
            const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
            state.pages = raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Error loading notes:", e);
            state.pages = [];
        }

        if (state.pages.length === 0) {
            createNewPage();
        }
    }

    function saveData() {
        clearTimeout(state.autoSaveTimer);
        state.autoSaveTimer = setTimeout(() => {
            try {
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state.pages));
                showSaveIndicator();
            } catch (e) {
                console.error("Error saving notes:", e);
            }
        }, CONFIG.AUTO_SAVE_DELAY);
    }

    function createNewPage(colorIndex = 0) {
        const color = CONFIG.DEFAULT_COLORS[colorIndex % CONFIG.DEFAULT_COLORS.length];
        const newPage = {
            id: Date.now() + Math.random(),
            content: '',
            color: color.name,
            colorValue: color.value,
            darkColorValue: color.darkValue,
            date: new Date().toISOString(),
            title: `New Note ${state.pages.length + 1}`,
            tags: [],
            starred: false
        };
        
        state.pages.push(newPage);
        return newPage;
    }

    // -------------------------------------------------------------------------
    // 2. UTILIDADES APPLE
    // -------------------------------------------------------------------------
    
    function showSaveIndicator() {
        const indicator = document.getElementById('save-indicator');
        if (indicator) {
            indicator.classList.remove('opacity-0');
            indicator.classList.add('opacity-100');
            setTimeout(() => {
                indicator.classList.remove('opacity-100');
                indicator.classList.add('opacity-0');
            }, 2000);
        }
    }

    function formatAppleDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'long' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    }

    // -------------------------------------------------------------------------
    // 3. INTERFAZ APPLE - VENTANA PRINCIPAL
    // -------------------------------------------------------------------------
    
    window.toggleNotepad = function() {
        const win = document.getElementById('notepad-window');
        if (!win) return;

        if (win.classList.contains('hidden')) {
            openNotepad();
        } else {
            closeNotepad();
        }
    };

    window.openNotepad = function() {
        const win = document.getElementById('notepad-window');
        if (!win) return;
        
        win.classList.remove('hidden');
        win.classList.add('flex');
        
        // Efecto de apertura Apple
        win.style.opacity = '0';
        win.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            win.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            win.style.opacity = '1';
            win.style.transform = 'scale(1)';
        }, 10);
        
        // Centrar en pantalla
        centerWindow();
        
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
        
        renderPage();
    };

    window.closeNotepad = function() {
        const win = document.getElementById('notepad-window');
        if (!win) return;
        
        // Efecto de cierre Apple
        win.style.opacity = '0';
        win.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            win.classList.add('hidden');
            win.classList.remove('flex');
            win.style.opacity = '1';
            win.style.transform = 'scale(1)';
        }, 300);
        
        // Restaurar scroll
        document.body.style.overflow = '';
        
        // Guardar datos inmediatamente
        saveData();
    };

    function centerWindow() {
        const win = document.getElementById('notepad-window');
        if (!win) return;
        
        const width = win.offsetWidth || 800;
        const height = win.offsetHeight || 600;
        
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        win.style.left = `${Math.max(20, left)}px`;
        win.style.top = `${Math.max(20, top)}px`;
    }

    // -------------------------------------------------------------------------
    // 4. RENDERIZADO APPLE
    // -------------------------------------------------------------------------
    
    function renderPage() {
        const page = state.pages[state.currentIndex];
        if (!page) return;
        
        // Actualizar área de texto
        const textArea = document.getElementById('notepad-editor');
        if (textArea) {
            textArea.value = page.content;
            updateEditorTheme(page.color);
        }
        
        // Actualizar UI
        updatePageCounter();
        updatePageTitle();
        updateColorTheme(page.colorValue);
        updateSidebar();
    }

    function updateEditorTheme(colorName) {
        const editor = document.getElementById('notepad-editor');
        if (!editor) return;
        
        // Limpiar clases anteriores
        editor.classList.remove(
            'bg-yellow-50', 'dark:bg-yellow-950/20',
            'bg-blue-50', 'dark:bg-blue-950/20',
            'bg-pink-50', 'dark:bg-pink-950/20',
            'bg-green-50', 'dark:bg-green-950/20',
            'bg-purple-50', 'dark:bg-purple-950/20',
            'bg-orange-50', 'dark:bg-orange-950/20'
        );
        
        // Aplicar nuevo tema
        switch(colorName) {
            case 'yellow':
                editor.classList.add('bg-yellow-50', 'dark:bg-yellow-950/20');
                break;
            case 'blue':
                editor.classList.add('bg-blue-50', 'dark:bg-blue-950/20');
                break;
            case 'pink':
                editor.classList.add('bg-pink-50', 'dark:bg-pink-950/20');
                break;
            case 'green':
                editor.classList.add('bg-green-50', 'dark:bg-green-950/20');
                break;
            case 'purple':
                editor.classList.add('bg-purple-50', 'dark:bg-purple-950/20');
                break;
            case 'orange':
                editor.classList.add('bg-orange-50', 'dark:bg-orange-950/20');
                break;
        }
    }

    function updateColorTheme(colorValue) {
        const root = document.documentElement;
        root.style.setProperty('--accent-color', colorValue);
        
        // Actualizar botones y elementos con color acento
        document.querySelectorAll('.accent-button').forEach(btn => {
            btn.style.backgroundColor = colorValue;
        });
    }

    function updatePageCounter() {
        const counter = document.getElementById('page-counter');
        if (counter) {
            counter.textContent = `${state.currentIndex + 1} of ${state.pages.length}`;
        }
    }

    function updatePageTitle() {
        const page = state.pages[state.currentIndex];
        if (!page) return;
        
        const titleElement = document.getElementById('page-title-display');
        const titleInput = document.getElementById('page-title-input');
        
        if (titleElement) titleElement.textContent = page.title;
        if (titleInput) titleInput.value = page.title;
    }

    function updateSidebar() {
        const sidebar = document.getElementById('notepad-sidebar');
        if (!sidebar) return;
        
        let html = '<div class="space-y-1">';
        
        state.pages.forEach((page, index) => {
            const isActive = index === state.currentIndex;
            const color = CONFIG.DEFAULT_COLORS.find(c => c.name === page.color) || CONFIG.DEFAULT_COLORS[0];
            
            html += `
                <div class="sidebar-page ${isActive ? 'active' : ''}" 
                     onclick="window.notepadActions.goToPage(${index})">
                    <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                        <div class="w-2 h-2 rounded-full" style="background-color: ${page.colorValue}"></div>
                        <div class="flex-1 min-w-0">
                            <div class="font-medium text-sm truncate">${page.title}</div>
                            <div class="text-xs text-gray-500 truncate">${formatAppleDate(page.date)}</div>
                        </div>
                        ${page.starred ? '<i class="fa-solid fa-star text-yellow-500 text-xs"></i>' : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        sidebar.innerHTML = html;
    }

    // -------------------------------------------------------------------------
    // 5. ACCIONES APPLE
    // -------------------------------------------------------------------------
    
    window.notepadActions = {
        updateContent: function(text) {
            if (!state.pages[state.currentIndex]) return;
            
            state.pages[state.currentIndex].content = text;
            state.pages[state.currentIndex].date = new Date().toISOString();
            saveData();
        },

        updateTitle: function(newTitle) {
            if (!newTitle?.trim()) return;
            
            state.pages[state.currentIndex].title = newTitle.trim();
            updatePageTitle();
            updateSidebar();
            saveData();
        },

        nextPage: function() {
            if (state.currentIndex < state.pages.length - 1) {
                state.currentIndex++;
                renderPage();
            } else {
                this.addPage();
            }
        },

        prevPage: function() {
            if (state.currentIndex > 0) {
                state.currentIndex--;
                renderPage();
            }
        },

        goToPage: function(index) {
            if (index >= 0 && index < state.pages.length) {
                state.currentIndex = index;
                renderPage();
            }
        },

        addPage: function() {
            if (state.pages.length >= CONFIG.MAX_PAGES) {
                this.showAlert('Maximum Pages', `You've reached the maximum of ${CONFIG.MAX_PAGES} pages.`);
                return;
            }
            
            const newPage = createNewPage(state.pages.length);
            state.currentIndex = state.pages.length - 1;
            renderPage();
            saveData();
            
            // Animar nueva página
            const sidebarItem = document.querySelector(`.sidebar-page:nth-child(${state.pages.length})`);
            if (sidebarItem) {
                sidebarItem.style.opacity = '0';
                setTimeout(() => {
                    sidebarItem.style.transition = 'opacity 0.3s';
                    sidebarItem.style.opacity = '1';
                }, 10);
            }
        },

        deletePage: function() {
            if (state.pages.length <= 1) {
                state.pages[0].content = '';
                state.pages[0].title = 'New Note 1';
                renderPage();
                saveData();
                return;
            }
            
            this.showDeleteConfirmation();
        },

        confirmDelete: function() {
            state.pages.splice(state.currentIndex, 1);
            
            if (state.currentIndex >= state.pages.length) {
                state.currentIndex = state.pages.length - 1;
            }
            
            renderPage();
            saveData();
        },

        changeColor: function(colorIndex) {
            const color = CONFIG.DEFAULT_COLORS[colorIndex];
            if (!color) return;
            
            const page = state.pages[state.currentIndex];
            if (!page) return;
            
            page.color = color.name;
            page.colorValue = color.value;
            page.darkColorValue = color.darkValue;
            
            renderPage();
            saveData();
        },

        toggleStar: function() {
            const page = state.pages[state.currentIndex];
            if (!page) return;
            
            page.starred = !page.starred;
            updateSidebar();
            saveData();
        },

        toggleSidebar: function() {
            state.sidebarOpen = !state.sidebarOpen;
            const sidebar = document.getElementById('notepad-sidebar');
            const content = document.getElementById('notepad-content');
            
            if (state.sidebarOpen) {
                sidebar.classList.remove('hidden', 'w-0');
                sidebar.classList.add('flex', 'w-64');
                content.classList.remove('ml-0');
                content.classList.add('ml-64');
            } else {
                sidebar.classList.add('hidden', 'w-0');
                sidebar.classList.remove('flex', 'w-64');
                content.classList.remove('ml-64');
                content.classList.add('ml-0');
            }
        },

        showDeleteConfirmation: function() {
            const modal = document.getElementById('delete-modal');
            if (modal) {
                modal.classList.remove('hidden');
            }
        },

        showAlert: function(title, message) {
            const alert = document.getElementById('alert-modal');
            const alertTitle = document.getElementById('alert-title');
            const alertMessage = document.getElementById('alert-message');
            
            if (alert && alertTitle && alertMessage) {
                alertTitle.textContent = title;
                alertMessage.textContent = message;
                alert.classList.remove('hidden');
            }
        },

        exportPage: function() {
            const page = state.pages[state.currentIndex];
            if (!page) return;
            
            const content = `# ${page.title}\n\n${page.content}\n\n---\n*Exported from NCLEX Notebook on ${new Date().toLocaleString()}*`;
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${page.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
            a.click();
            URL.revokeObjectURL(url);
        },

        toggleFullscreen: function() {
            const win = document.getElementById('notepad-window');
            if (!win) return;
            
            state.isFullscreen = !state.isFullscreen;
            
            if (state.isFullscreen) {
                win.classList.add('fullscreen');
                win.style.width = '100vw';
                win.style.height = '100vh';
                win.style.top = '0';
                win.style.left = '0';
                win.style.borderRadius = '0';
            } else {
                win.classList.remove('fullscreen');
                win.style.width = '';
                win.style.height = '';
                centerWindow();
            }
        }
    };

    // -------------------------------------------------------------------------
    // 6. INYECCIÓN DE ESTILOS APPLE
    // -------------------------------------------------------------------------
    
    function injectAppleStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --accent-color: #007AFF;
                --system-gray-6: #F2F2F7;
                --system-gray-5: #E5E5EA;
                --system-gray-3: #C7C7CC;
                --system-blue: #007AFF;
                --system-green: #34C759;
                --system-red: #FF3B30;
            }
            
            .apple-window {
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                background: rgba(242, 242, 247, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.8);
                box-shadow: 
                    0 4px 6px -1px rgba(0, 0, 0, 0.1),
                    0 2px 4px -1px rgba(0, 0, 0, 0.06),
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
            }
            
            .dark .apple-window {
                background: rgba(28, 28, 30, 0.8);
                border: 1px solid rgba(44, 44, 46, 0.8);
                box-shadow: 
                    0 4px 6px -1px rgba(0, 0, 0, 0.3),
                    0 2px 4px -1px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
            }
            
            .apple-titlebar {
                background: linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.9), 
                    rgba(242, 242, 247, 0.9)
                );
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .dark .apple-titlebar {
                background: linear-gradient(to bottom, 
                    rgba(44, 44, 46, 0.9), 
                    rgba(28, 28, 30, 0.9)
                );
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .apple-button {
                background: linear-gradient(180deg, 
                    rgba(255, 255, 255, 0.9) 0%, 
                    rgba(242, 242, 247, 0.9) 100%
                );
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 6.5px;
                padding: 4px 12px;
                font-size: 13px;
                font-weight: 500;
                color: #007AFF;
                transition: all 0.2s ease;
            }
            
            .apple-button:hover {
                background: linear-gradient(180deg, 
                    rgba(255, 255, 255, 1) 0%, 
                    rgba(242, 242, 247, 1) 100%
                );
                border-color: rgba(0, 0, 0, 0.15);
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .apple-button:active {
                transform: translateY(0);
                box-shadow: none;
            }
            
            .apple-control {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 8px;
                transition: transform 0.2s ease;
            }
            
            .apple-control:hover {
                transform: scale(1.1);
            }
            
            .apple-control-close { background: #FF5F57; }
            .apple-control-minimize { background: #FFBD2E; }
            .apple-control-maximize { background: #28CA42; }
            
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
            
            .apple-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.2);
            }
            
            .dark .apple-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .dark .apple-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .apple-editor {
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 15px;
                line-height: 1.6;
                letter-spacing: -0.01em;
            }
            
            .apple-sidebar {
                background: rgba(242, 242, 247, 0.6);
                border-right: 1px solid rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .dark .apple-sidebar {
                background: rgba(28, 28, 30, 0.6);
                border-right: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .sidebar-page.active {
                background: rgba(0, 122, 255, 0.1);
                border: 1px solid rgba(0, 122, 255, 0.2);
            }
            
            .apple-modal {
                background: rgba(242, 242, 247, 0.95);
                backdrop-filter: blur(30px) saturate(200%);
                -webkit-backdrop-filter: blur(30px) saturate(200%);
                border: 1px solid rgba(255, 255, 255, 0.8);
                box-shadow: 
                    0 20px 25px -5px rgba(0, 0, 0, 0.1),
                    0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            
            .dark .apple-modal {
                background: rgba(28, 28, 30, 0.95);
                border: 1px solid rgba(44, 44, 46, 0.8);
            }
            
            .apple-input {
                background: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 14px;
                transition: all 0.2s ease;
            }
            
            .apple-input:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
            }
            
            .dark .apple-input {
                background: rgba(44, 44, 46, 0.8);
                border-color: rgba(255, 255, 255, 0.1);
                color: white;
            }
            
            @keyframes appleBounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(0.95); }
            }
            
            .apple-bounce {
                animation: appleBounce 0.3s ease;
            }
            
            .accent-button {
                background: var(--accent-color);
                color: white;
                border: none;
                border-radius: 6.5px;
                padding: 4px 12px;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            
            .accent-button:hover {
                opacity: 0.9;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(var(--accent-rgb), 0.3);
            }
        `;
        document.head.appendChild(style);
    }

    // -------------------------------------------------------------------------
    // 7. INYECCIÓN DE HTML APPLE
    // -------------------------------------------------------------------------
    
    function injectAppleHTML() {
        const container = document.getElementById('notepad-container');
        if (!container) return;
        
        // Ventana principal
        container.innerHTML = `
            <div id="notepad-window" 
                 class="fixed z-[9999] hidden flex-col w-[800px] h-[600px] max-w-[90vw] max-h-[90vh] apple-window rounded-2xl overflow-hidden transition-all duration-300">
                
                <!-- Titlebar estilo macOS -->
                <div class="apple-titlebar flex items-center justify-between px-4 py-2.5 cursor-move select-none">
                    <!-- Controles de ventana -->
                    <div class="flex items-center">
                        <div class="apple-control apple-control-close" onclick="window.closeNotepad()"></div>
                        <div class="apple-control apple-control-minimize"></div>
                        <div class="apple-control apple-control-maximize" onclick="window.notepadActions.toggleFullscreen()"></div>
                    </div>
                    
                    <!-- Título centrado -->
                    <div class="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
                        <i class="fa-solid fa-book text-gray-600 dark:text-gray-300 text-sm"></i>
                        <span id="page-title-display" class="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate max-w-[200px]"></span>
                        <span id="page-counter" class="text-xs text-gray-500 font-medium"></span>
                    </div>
                    
                    <!-- Botones de acción -->
                    <div class="flex items-center gap-2">
                        <button onclick="window.notepadActions.toggleStar()" 
                                class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10">
                            <i class="fa-regular fa-star text-sm"></i>
                        </button>
                        <button onclick="window.notepadActions.toggleSidebar()" 
                                class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10">
                            <i class="fa-solid fa-sidebar text-sm"></i>
                        </button>
                        <button onclick="window.notepadActions.exportPage()" 
                                class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10">
                            <i class="fa-solid fa-arrow-up-from-bracket text-sm"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Contenido principal -->
                <div class="flex flex-1 overflow-hidden">
                    <!-- Sidebar -->
                    <div id="notepad-sidebar" class="apple-sidebar flex flex-col w-64 transition-all duration-300">
                        <div class="p-4 border-b border-gray-200 dark:border-white/10">
                            <div class="flex items-center justify-between mb-3">
                                <h3 class="font-semibold text-gray-800 dark:text-gray-200">Notes</h3>
                                <button onclick="window.notepadActions.addPage()" 
                                        class="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600">
                                    <i class="fa-solid fa-plus text-sm"></i>
                                </button>
                            </div>
                            <input id="page-title-input" type="text" 
                                   class="apple-input w-full mb-2" 
                                   placeholder="Note title..."
                                   oninput="window.notepadActions.updateTitle(this.value)">
                        </div>
                        
                        <div class="flex-1 overflow-y-auto p-2 apple-scrollbar" id="sidebar-content">
                            <!-- Las notas se cargarán aquí dinámicamente -->
                        </div>
                        
                        <!-- Paleta de colores -->
                        <div class="p-4 border-t border-gray-200 dark:border-white/10">
                            <div class="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">COLORS</div>
                            <div class="flex gap-2">
                                ${CONFIG.DEFAULT_COLORS.map((color, index) => `
                                    <button onclick="window.notepadActions.changeColor(${index})" 
                                            class="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 shadow-sm hover:scale-110 transition-transform"
                                            style="background-color: ${color.value}"
                                            title="${color.name.charAt(0).toUpperCase() + color.name.slice(1)}">
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Área del editor -->
                    <div id="notepad-content" class="flex-1 flex flex-col transition-all duration-300 ml-64">
                        <!-- Barra de herramientas -->
                        <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-white/10">
                            <div class="flex items-center gap-2">
                                <button onclick="window.notepadActions.prevPage()" 
                                        class="apple-button flex items-center gap-1">
                                    <i class="fa-solid fa-chevron-left text-xs"></i>
                                </button>
                                <button onclick="window.notepadActions.addPage()" 
                                        class="apple-button flex items-center gap-1">
                                    <i class="fa-solid fa-plus text-xs"></i> New
                                </button>
                                <button onclick="window.notepadActions.nextPage()" 
                                        class="apple-button flex items-center gap-1">
                                    <i class="fa-solid fa-chevron-right text-xs"></i>
                                </button>
                            </div>
                            
                            <div class="flex items-center gap-2">
                                <span id="save-indicator" class="text-xs text-green-500 opacity-0 transition-opacity">
                                    <i class="fa-solid fa-check"></i> Saved
                                </span>
                                <span class="text-xs text-gray-500">
                                    ${new Date().toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        
                        <!-- Editor principal -->
                        <textarea id="notepad-editor"
                                  class="flex-1 w-full apple-editor text-gray-900 dark:text-gray-100 p-6 focus:outline-none resize-none placeholder-gray-400 dark:placeholder-gray-500"
                                  placeholder="Start writing your notes here..."
                                  spellcheck="true"
                                  autocomplete="off"
                                  oninput="window.notepadActions.updateContent(this.value)"
                                  onkeydown="if(event.key === 'Tab'){event.preventDefault();const start=this.selectionStart;this.value=this.value.substring(0,start)+'\\t'+this.value.substring(this.selectionEnd);this.selectionStart=this.selectionEnd=start+1;}"
                        ></textarea>
                        
                        <!-- Barra de estado -->
                        <div class="px-4 py-2 border-t border-gray-200 dark:border-white/10 text-xs text-gray-500 flex justify-between">
                            <div>
                                <i class="fa-regular fa-clock mr-1"></i>
                                <span id="last-saved">Last saved just now</span>
                            </div>
                            <div>
                                <i class="fa-solid fa-keyboard mr-1"></i>
                                <span id="char-count">0 characters</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal de confirmación estilo Apple -->
            <div id="delete-modal" class="fixed inset-0 z-[10000] hidden">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 apple-modal rounded-2xl p-6 w-96">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <i class="fa-solid fa-trash text-red-600 dark:text-red-400"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 dark:text-white">Delete Note</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300">This action cannot be undone.</p>
                        </div>
                    </div>
                    
                    <p class="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to delete this note? The content will be permanently removed.</p>
                    
                    <div class="flex justify-end gap-3">
                        <button onclick="document.getElementById('delete-modal').classList.add('hidden')" 
                                class="apple-button">
                            Cancel
                        </button>
                        <button onclick="window.notepadActions.confirmDelete(); document.getElementById('delete-modal').classList.add('hidden')" 
                                class="accent-button bg-red-500 hover:bg-red-600">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Modal de alerta -->
            <div id="alert-modal" class="fixed inset-0 z-[10000] hidden">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 apple-modal rounded-2xl p-6 w-96">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <i class="fa-solid fa-exclamation-triangle text-yellow-600 dark:text-yellow-400"></i>
                        </div>
                        <div>
                            <h3 id="alert-title" class="font-semibold text-gray-900 dark:text-white"></h3>
                            <p id="alert-message" class="text-sm text-gray-600 dark:text-gray-300"></p>
                        </div>
                    </div>
                    
                    <div class="flex justify-end">
                        <button onclick="document.getElementById('alert-modal').classList.add('hidden')" 
                                class="accent-button">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // -------------------------------------------------------------------------
    // 8. INICIALIZACIÓN
    // -------------------------------------------------------------------------
    
    function init() {
        // Cargar datos
        loadData();
        
        // Inyectar estilos Apple
        injectAppleStyles();
        
        // Inyectar HTML Apple
        injectAppleHTML();
        
        // Configurar arrastre de ventana
        setupWindowDrag();
        
        // Configurar atajos de teclado
        setupKeyboardShortcuts();
        
        // Renderizar primera página
        renderPage();
        
        console.log('📓 Apple Notepad v5.0 initialized 🍎');
    }

    function setupWindowDrag() {
        const win = document.getElementById('notepad-window');
        const header = document.querySelector('.apple-titlebar');
        
        if (!win || !header) return;

        let startX, startY, initialLeft, initialTop;

        const startDrag = (e) => {
            if (e.target.closest('button') || e.target.closest('.apple-control')) return;
            if (state.isFullscreen) return;

            state.isDragging = true;
            const isTouch = e.type === 'touchstart';
            const clientX = isTouch ? e.touches[0].clientX : e.clientX;
            const clientY = isTouch ? e.touches[0].clientY : e.clientY;

            startX = clientX;
            startY = clientY;

            const rect = win.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            win.style.cursor = 'grabbing';
            win.style.userSelect = 'none';
            
            const moveEvent = isTouch ? 'touchmove' : 'mousemove';
            const endEvent = isTouch ? 'touchend' : 'mouseup';
            
            document.addEventListener(moveEvent, onDrag);
            document.addEventListener(endEvent, endDrag);
        };

        const onDrag = (e) => {
            if (!state.isDragging) return;
            
            const isTouch = e.type === 'touchmove';
            const clientX = isTouch ? e.touches[0].clientX : e.clientX;
            const clientY = isTouch ? e.touches[0].clientY : e.clientY;

            const dx = clientX - startX;
            const dy = clientY - startY;

            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;

            // Limitar a los bordes de la pantalla
            const maxX = window.innerWidth - win.offsetWidth;
            const maxY = window.innerHeight - win.offsetHeight;
            
            newLeft = Math.max(0, Math.min(newLeft, maxX));
            newTop = Math.max(0, Math.min(newTop, maxY));

            win.style.left = `${newLeft}px`;
            win.style.top = `${newTop}px`;
        };

        const endDrag = () => {
            state.isDragging = false;
            win.style.cursor = '';
            win.style.userSelect = '';
            
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', onDrag);
            document.removeEventListener('touchend', endDrag);
        };

        header.addEventListener('mousedown', startDrag);
        header.addEventListener('touchstart', startDrag, { passive: false });
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const win = document.getElementById('notepad-window');
            if (!win || win.classList.contains('hidden')) return;
            
            const textarea = document.getElementById('notepad-editor');
            
            // Solo procesar atajos si el textarea está enfocado o si son globales
            if (document.activeElement === textarea || !document.activeElement.matches('input, textarea, select, button')) {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    switch(e.key) {
                        case 'N':
                            e.preventDefault();
                            window.notepadActions.addPage();
                            break;
                        case 'S':
                            e.preventDefault();
                            saveData();
                            showSaveIndicator();
                            break;
                    }
                } else if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 's':
                            e.preventDefault();
                            saveData();
                            showSaveIndicator();
                            break;
                        case 'n':
                            e.preventDefault();
                            window.notepadActions.addPage();
                            break;
                        case 'ArrowLeft':
                            e.preventDefault();
                            window.notepadActions.prevPage();
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            window.notepadActions.nextPage();
                            break;
                        case 'b':
                            e.preventDefault();
                            window.notepadActions.toggleSidebar();
                            break;
                    }
                }
            }
            
            // Atajos globales
            if (e.key === 'Escape') {
                const modal = document.getElementById('delete-modal');
                const alert = document.getElementById('alert-modal');
                
                if (!modal.classList.contains('hidden')) {
                    modal.classList.add('hidden');
                } else if (!alert.classList.contains('hidden')) {
                    alert.classList.add('hidden');
                } else {
                    window.closeNotepad();
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // 9. INICIALIZAR APLICACIÓN
    // -------------------------------------------------------------------------
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();