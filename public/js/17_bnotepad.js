// 17_bnotepad.js — Apple Notes "Student Edition" (Sticky & Lined Paper)
// VERSIÓN: 6.0 (Ultimate Student)

(function() {
    'use strict';

    // CONFIGURACIÓN
    const CONFIG = {
        KEY: 'nclex_student_notes_v6',
        POS_KEY: 'nclex_notes_pos_v6',
        COLORS: [
            { id: 'yellow', bg: '#fff9c4', border: '#fbc02d' }, // Amarillo Nota
            { id: 'blue',   bg: '#e3f2fd', border: '#42a5f5' }, // Azul Aire
            { id: 'pink',   bg: '#fce4ec', border: '#ec407a' }, // Rosa Pastel
            { id: 'green',  bg: '#e8f5e9', border: '#66bb6a' }, // Verde Menta
            { id: 'white',  bg: '#ffffff', border: '#cfd8dc' }  // Blanco Limpio
        ]
    };

    // ESTADO
    const state = {
        notes: [],
        currentId: null,
        isOpen: false,
        isMinimized: false,
        drag: { active: false, currentX: 0, currentY: 0, initialX: 0, initialY: 0, xOffset: 0, yOffset: 0 }
    };

    // -------------------------------------------------------------------------
    // 1. GESTIÓN DE DATOS
    // -------------------------------------------------------------------------
    function loadNotes() {
        try {
            const raw = localStorage.getItem(CONFIG.KEY);
            state.notes = raw ? JSON.parse(raw) : [];
            
            if (state.notes.length === 0) {
                createNote('Apuntes Generales', 'white');
            } else {
                state.currentId = state.notes[0].id;
            }
        } catch (e) {
            console.error("Error loading notes", e);
            state.notes = [];
            createNote('Mis Apuntes', 'yellow');
        }
    }

    function createNote(title = 'Nueva Nota', color = 'yellow') {
        const newNote = {
            id: Date.now().toString(),
            title: title,
            content: '',
            color: color,
            date: new Date().toISOString()
        };
        state.notes.unshift(newNote);
        state.currentId = newNote.id;
        saveNotes();
        renderSidebar();
        renderEditor();
    }

    function saveNotes() {
        localStorage.setItem(CONFIG.KEY, JSON.stringify(state.notes));
    }

    function getCurrentNote() {
        return state.notes.find(n => n.id === state.currentId) || state.notes[0];
    }

    // -------------------------------------------------------------------------
    // 2. INTERFAZ (DOM)
    // -------------------------------------------------------------------------
    function injectStyles() {
        if (document.getElementById('notepad-styles')) return;
        const style = document.createElement('style');
        style.id = 'notepad-styles';
        style.textContent = `
            .n-glass {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(0,0,0,0.1);
                box-shadow: 0 20px 50px rgba(0,0,0,0.2);
            }
            .dark .n-glass {
                background: rgba(30, 30, 32, 0.95);
                border: 1px solid rgba(255,255,255,0.1);
            }
            
            /* Papel Rayado (Lined Paper Effect) */
            .n-paper {
                background-image: linear-gradient(#999 0.05em, transparent 0.1em);
                background-size: 100% 2em;
                line-height: 2em;
                background-attachment: local;
            }
            .dark .n-paper {
                background-image: linear-gradient(#444 0.05em, transparent 0.1em);
            }

            .n-btn { transition: all 0.2s; }
            .n-btn:hover { transform: scale(1.1); }
            .n-btn:active { transform: scale(0.95); }

            .n-scrollbar::-webkit-scrollbar { width: 6px; }
            .n-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
            .dark .n-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }

            /* Animaciones */
            @keyframes n-pop {
                0% { transform: scale(0.9) opacity(0); }
                100% { transform: scale(1) opacity(1); }
            }
            .n-animate-open { animation: n-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `;
        document.head.appendChild(style);
    }

    function buildUI() {
        const container = document.createElement('div');
        container.id = 'notepad-root';
        document.body.appendChild(container);

        // 1. Botón Flotante (Icono a la derecha)
        const trigger = document.createElement('button');
        trigger.className = 'fixed right-6 bottom-24 z-[9990] w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform group';
        trigger.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 opacity-20 rounded-2xl group-hover:opacity-30 transition-opacity"></div>
            <i class="fa-solid fa-pen-nib text-2xl text-orange-500 dark:text-orange-400"></i>
            <span class="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Notas Rápidas
            </span>
        `;
        trigger.onclick = () => API.toggle();
        container.appendChild(trigger);

        // 2. Ventana Principal
        const win = document.createElement('div');
        win.id = 'notepad-window';
        win.className = 'fixed z-[9999] hidden flex-col w-[800px] h-[550px] max-w-[95vw] max-h-[85vh] n-glass rounded-xl overflow-hidden n-animate-open';
        // Posición inicial centrada
        win.style.left = 'calc(50% - 400px)';
        win.style.top = 'calc(50% - 275px)';

        win.innerHTML = `
            <div id="n-header" class="h-12 bg-gray-50/80 dark:bg-black/20 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 cursor-move select-none">
                <div class="flex items-center gap-3">
                    <div class="flex gap-1.5 group">
                        <button onclick="API.close()" class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"></button>
                        <button onclick="API.minimize()" class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"></button>
                        <button onclick="API.maximize()" class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"></button>
                    </div>
                    <div class="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    <span class="font-bold text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2">
                        <i class="fa-solid fa-book-open"></i> Libreta de Estudio
                    </span>
                    <span id="n-save-status" class="text-[10px] text-green-500 font-medium opacity-0 transition-opacity">
                        <i class="fa-solid fa-check"></i> Guardado
                    </span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="API.addNote()" class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md font-bold hover:bg-blue-200 transition-colors">
                        + Nueva
                    </button>
                    <button onclick="API.download()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Descargar">
                        <i class="fa-solid fa-download"></i>
                    </button>
                </div>
            </div>

            <div class="flex flex-1 overflow-hidden">
                <div id="n-sidebar" class="w-48 bg-gray-50/50 dark:bg-black/10 border-r border-gray-200 dark:border-white/5 flex flex-col hidden md:flex">
                    <div class="p-2 border-b border-gray-200 dark:border-white/5">
                        <input type="text" placeholder="Buscar..." class="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-blue-500">
                    </div>
                    <div id="n-list" class="flex-1 overflow-y-auto n-scrollbar p-2 space-y-1">
                        </div>
                </div>

                <div class="flex-1 flex flex-col bg-white dark:bg-[#1C1C1E] relative">
                    <input type="text" id="n-title-input" 
                        class="w-full px-6 pt-4 pb-2 text-lg font-bold bg-transparent border-none focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
                        placeholder="Título de la nota...">
                    
                    <textarea id="n-editor" 
                        class="flex-1 w-full resize-none border-none focus:outline-none px-6 py-0 n-paper text-base text-gray-700 dark:text-gray-300 leading-8"
                        placeholder="Escribe aquí tus apuntes..."></textarea>
                    
                    <div class="h-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between px-4 text-[10px] text-gray-400 select-none bg-white dark:bg-[#1C1C1E]">
                        <span id="n-date">Actualizado: Hoy</span>
                        <span id="n-words">0 palabras</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(win);

        setupDrag(win);
        setupEvents();
    }

    // -------------------------------------------------------------------------
    // 3. LÓGICA
    // -------------------------------------------------------------------------
    function renderSidebar() {
        const list = document.getElementById('n-list');
        if (!list) return;

        list.innerHTML = state.notes.map(note => `
            <div onclick="API.selectNote('${note.id}')" 
                 class="cursor-pointer p-2 rounded-lg text-xs transition-colors ${note.id === state.currentId ? 'bg-white dark:bg-white/10 shadow-sm font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5'}">
                <div class="truncate">${note.title || 'Sin título'}</div>
                <div class="text-[9px] opacity-70 mt-0.5">${new Date(note.date).toLocaleDateString()}</div>
            </div>
        `).join('');
    }

    function renderEditor() {
        const note = getCurrentNote();
        if (!note) return;

        const titleInput = document.getElementById('n-title-input');
        const editor = document.getElementById('n-editor');
        const dateDisplay = document.getElementById('n-date');
        const wordCount = document.getElementById('n-words');

        if (titleInput) titleInput.value = note.title;
        if (editor) editor.value = note.content;
        
        if (dateDisplay) {
            const d = new Date(note.date);
            dateDisplay.innerText = `Editado: ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
        }
        
        if (wordCount) {
            const count = note.content.trim().split(/\s+/).length;
            wordCount.innerText = `${note.content ? count : 0} palabras`;
        }
    }

    function setupEvents() {
        const titleInput = document.getElementById('n-title-input');
        const editor = document.getElementById('n-editor');

        const autoSave = () => {
            const note = getCurrentNote();
            if (note) {
                note.title = titleInput.value;
                note.content = editor.value;
                note.date = new Date().toISOString();
                saveNotes();
                renderSidebar(); // Actualizar lista lateral
                
                // Indicador visual
                const ind = document.getElementById('n-save-status');
                ind.style.opacity = '1';
                setTimeout(() => ind.style.opacity = '0', 1500);
            }
        };

        titleInput.addEventListener('input', autoSave);
        editor.addEventListener('input', autoSave);
    }

    // ARRASTRE (DRAG & DROP)
    function setupDrag(el) {
        const header = document.getElementById('n-header');
        
        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mousemove', drag);

        function dragStart(e) {
            if (e.target.closest('button')) return;
            state.drag.initialX = e.clientX - state.drag.xOffset;
            state.drag.initialY = e.clientY - state.drag.yOffset;
            
            if (e.target === header || header.contains(e.target)) {
                state.drag.active = true;
            }
        }

        function dragEnd(e) {
            state.drag.initialX = state.drag.currentX;
            state.drag.initialY = state.drag.currentY;
            state.drag.active = false;
        }

        function drag(e) {
            if (state.drag.active) {
                e.preventDefault();
                state.drag.currentX = e.clientX - state.drag.initialX;
                state.drag.currentY = e.clientY - state.drag.initialY;

                state.drag.xOffset = state.drag.currentX;
                state.drag.yOffset = state.drag.currentY;

                setTranslate(state.drag.currentX, state.drag.currentY, el);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
    }

    // -------------------------------------------------------------------------
    // 4. API PÚBLICA
    // -------------------------------------------------------------------------
    const API = {
        toggle: () => {
            const win = document.getElementById('notepad-window');
            if (!win) return;
            
            if (state.isOpen) {
                win.classList.add('hidden');
                win.classList.remove('flex');
            } else {
                win.classList.remove('hidden');
                win.classList.add('flex');
                renderSidebar();
                renderEditor();
            }
            state.isOpen = !state.isOpen;
        },

        close: () => {
            const win = document.getElementById('notepad-window');
            win.classList.add('hidden');
            win.classList.remove('flex');
            state.isOpen = false;
        },

        minimize: () => {
            const win = document.getElementById('notepad-window');
            if (state.isMinimized) {
                win.style.height = '550px';
                win.querySelector('#n-sidebar').classList.remove('hidden');
            } else {
                win.style.height = '48px'; // Solo header
                win.querySelector('#n-sidebar').classList.add('hidden');
            }
            state.isMinimized = !state.isMinimized;
        },

        maximize: () => {
            // Simple toggle fullscreen logic could go here
            const win = document.getElementById('notepad-window');
            win.style.width = '90vw';
            win.style.height = '90vh';
            win.style.top = '5vh';
            win.style.left = '5vw';
            win.style.transform = 'none'; // Reset drag transform
            state.drag.xOffset = 0;
            state.drag.yOffset = 0;
        },

        addNote: () => {
            createNote();
        },

        selectNote: (id) => {
            state.currentId = id;
            renderSidebar();
            renderEditor();
        },

        download: () => {
            const note = getCurrentNote();
            const blob = new Blob([note.content], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${note.title || 'nota'}.txt`;
            a.click();
        }
    };

    // EXPOSICIÓN GLOBAL
    window.API = API; // Para uso interno de botones HTML
    window.toggleNotepad = API.toggle; // Compatibilidad con tu botón HTML antiguo

    // BOOTSTRAP
    function init() {
        loadNotes();
        injectStyles();
        buildUI();
        console.log("📝 Student Notepad v6 Loaded");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
