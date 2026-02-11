// 17_bnotepad.js — Libreta Apple Flotante (Botón y Ventana Arrastrables)
// VERSIÓN: 7.0 (Total Freedom)

(function() {
    'use strict';

    const CONFIG = {
        KEY: 'nclex_student_notes_v7',
        POS_BTN_KEY: 'nclex_notes_btn_pos',
        POS_WIN_KEY: 'nclex_notes_win_pos',
        COLORS: [
            { id: 'yellow', bg: '#fff9c4', border: '#fbc02d' },
            { id: 'blue',   bg: '#e3f2fd', border: '#42a5f5' },
            { id: 'pink',   bg: '#fce4ec', border: '#ec407a' },
            { id: 'green',  bg: '#e8f5e9', border: '#66bb6a' },
            { id: 'white',  bg: '#ffffff', border: '#cfd8dc' }
        ]
    };

    const state = {
        notes: [],
        currentId: null,
        isOpen: false,
        isMinimized: false,
        drag: { active: false, currentX: 0, currentY: 0, initialX: 0, initialY: 0, xOffset: 0, yOffset: 0 }
    };

    // --- GESTIÓN DE DATOS ---
    function loadNotes() {
        try {
            const raw = localStorage.getItem(CONFIG.KEY);
            state.notes = raw ? JSON.parse(raw) : [];
            if (state.notes.length === 0) createNote('Apuntes Generales', 'white');
            else state.currentId = state.notes[0].id;
        } catch (e) {
            state.notes = [];
            createNote('Mis Apuntes', 'yellow');
        }
    }

    function createNote(title = 'Nueva Nota', color = 'yellow') {
        const newNote = { id: Date.now().toString(), title, content: '', color, date: new Date().toISOString() };
        state.notes.unshift(newNote);
        state.currentId = newNote.id;
        saveNotes();
        renderSidebar();
        renderEditor();
    }

    function saveNotes() { localStorage.setItem(CONFIG.KEY, JSON.stringify(state.notes)); }
    function getCurrentNote() { return state.notes.find(n => n.id === state.currentId) || state.notes[0]; }

    // --- UTILIDAD DE ARRASTRE UNIVERSAL ---
    function makeDraggable(element, storageKey, onClick) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        let hasMoved = false;

        // Cargar posición guardada
        const savedPos = localStorage.getItem(storageKey);
        if (savedPos) {
            const pos = JSON.parse(savedPos);
            element.style.left = pos.left;
            element.style.top = pos.top;
            element.style.bottom = 'auto';
            element.style.right = 'auto';
        }

        const start = (e) => {
            if (e.target.closest('.no-drag')) return; // Evitar arrastre en botones de cierre, etc.
            
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            
            isDragging = true;
            hasMoved = false;
            startX = clientX;
            startY = clientY;
            
            const rect = element.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            element.style.transition = 'none'; // Quitar transición para movimiento fluido
            
            document.addEventListener(e.type.includes('touch') ? 'touchmove' : 'mousemove', move, { passive: false });
            document.addEventListener(e.type.includes('touch') ? 'touchend' : 'mouseup', end);
        };

        const move = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            
            const dx = clientX - startX;
            const dy = clientY - startY;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved = true;

            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;

            // Límites de pantalla
            const maxW = window.innerWidth - element.offsetWidth;
            const maxH = window.innerHeight - element.offsetHeight;
            
            element.style.left = `${Math.min(Math.max(0, newLeft), maxW)}px`;
            element.style.top = `${Math.min(Math.max(0, newTop), maxH)}px`;
            element.style.bottom = 'auto';
            element.style.right = 'auto';
        };

        const end = () => {
            if (!isDragging) return;
            isDragging = false;
            element.style.transition = ''; // Restaurar transición

            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', end);
            document.removeEventListener('touchmove', move);
            document.removeEventListener('touchend', end);

            // Guardar posición
            localStorage.setItem(storageKey, JSON.stringify({
                left: element.style.left,
                top: element.style.top
            }));

            // Si no se movió mucho, es un click
            if (!hasMoved && onClick) onClick();
        };

        element.addEventListener('mousedown', start);
        element.addEventListener('touchstart', start, { passive: false });
    }

    // --- INTERFAZ ---
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
            .n-paper {
                background-image: linear-gradient(#999 0.05em, transparent 0.1em);
                background-size: 100% 2em;
                line-height: 2em;
                background-attachment: local;
            }
            .dark .n-paper {
                background-image: linear-gradient(#444 0.05em, transparent 0.1em);
            }
            .n-animate-open { animation: n-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            @keyframes n-pop { 0% { transform: scale(0.9) opacity(0); } 100% { transform: scale(1) opacity(1); } }
        `;
        document.head.appendChild(style);
    }

    function buildUI() {
        const container = document.createElement('div');
        container.id = 'notepad-root';
        document.body.appendChild(container);

        // 1. BOTÓN FLOTANTE (ARRASTRABLE)
        const trigger = document.createElement('div'); // Div para evitar clicks nativos del button
        trigger.className = 'fixed z-[9990] w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform group';
        // Posición inicial por defecto (si no hay guardada)
        trigger.style.right = '20px';
        trigger.style.bottom = '100px'; 
        
        trigger.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 opacity-20 rounded-2xl pointer-events-none"></div>
            <i class="fa-solid fa-pen-nib text-2xl text-orange-500 dark:text-orange-400 pointer-events-none"></i>
        `;
        container.appendChild(trigger);

        // Hacer el botón arrastrable
        makeDraggable(trigger, CONFIG.POS_BTN_KEY, () => API.toggle());

        // 2. VENTANA PRINCIPAL (ARRASTRABLE)
        const win = document.createElement('div');
        win.id = 'notepad-window';
        win.className = 'fixed z-[9999] hidden flex-col w-[800px] h-[550px] max-w-[95vw] max-h-[85vh] n-glass rounded-xl overflow-hidden n-animate-open shadow-2xl';
        // Posición inicial centrada por defecto
        win.style.left = 'calc(50% - 400px)';
        win.style.top = 'calc(50% - 275px)';

        win.innerHTML = `
            <div id="n-header" class="h-12 bg-gray-50/80 dark:bg-black/20 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 cursor-move select-none">
                <div class="flex items-center gap-3 pointer-events-none">
                    <div class="flex gap-1.5 group pointer-events-auto no-drag">
                        <button onclick="API.close()" class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"></button>
                        <button onclick="API.minimize()" class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"></button>
                        <button onclick="API.maximize()" class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600"></button>
                    </div>
                    <span class="font-bold text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2">
                        <i class="fa-solid fa-book-open"></i> Libreta
                    </span>
                    <span id="n-save-status" class="text-[10px] text-green-500 font-medium opacity-0 transition-opacity"><i class="fa-solid fa-check"></i></span>
                </div>
                <div class="flex items-center gap-2 pointer-events-auto no-drag">
                    <button onclick="API.addNote()" class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md font-bold hover:bg-blue-200">+ Nueva</button>
                    <button onclick="API.download()" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-download"></i></button>
                </div>
            </div>

            <div class="flex flex-1 overflow-hidden">
                <div id="n-sidebar" class="w-48 bg-gray-50/50 dark:bg-black/10 border-r border-gray-200 dark:border-white/5 flex flex-col hidden md:flex">
                    <div id="n-list" class="flex-1 overflow-y-auto p-2 space-y-1"></div>
                </div>
                <div class="flex-1 flex flex-col bg-white dark:bg-[#1C1C1E] relative">
                    <input type="text" id="n-title-input" class="w-full px-6 pt-4 pb-2 text-lg font-bold bg-transparent border-none focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400" placeholder="Título...">
                    <textarea id="n-editor" class="flex-1 w-full resize-none border-none focus:outline-none px-6 py-0 n-paper text-base text-gray-700 dark:text-gray-300 leading-8" placeholder="Escribe aquí..."></textarea>
                    <div class="h-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between px-4 text-[10px] text-gray-400 select-none bg-white dark:bg-[#1C1C1E]">
                        <span id="n-date">Hoy</span>
                        <span id="n-words">0 palabras</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(win);

        // Hacer la ventana arrastrable desde el header
        const header = win.querySelector('#n-header');
        makeDraggable(win, CONFIG.POS_WIN_KEY); // Arrastre del contenedor entero
        // Truco: Para que solo se arrastre desde el header, podríamos limitar el evento, 
        // pero makeDraggable es genérico. En este caso simple, dejaremos que se mueva.
        // Mejor opción: Reutilizar makeDraggable pero adjuntar el listener SOLO al header que controla la ventana WIN
        
        // Re-implementación rápida específica para ventana desde header
        header.onmousedown = header.ontouchstart = (e) => {
            if(e.target.closest('.no-drag')) return;
            // Usamos la lógica de makeDraggable pero aplicada manualmente
            // Para simplificar, usamos el sistema genérico pero pasamos el header como trigger y win como target
            // Por ahora, el código anterior makeDraggable mueve el elemento al que se le hace attach.
            // Vamos a corregirlo:
        };
        
        // FIX: Hacer que la ventana solo se mueva desde el header
        // Reemplazamos la llamada genérica anterior por una especifica
        header.addEventListener('mousedown', (e) => startDragWindow(e, win));
        header.addEventListener('touchstart', (e) => startDragWindow(e, win), {passive:false});
        
        // Recuperar pos ventana
        const savedWinPos = localStorage.getItem(CONFIG.POS_WIN_KEY);
        if(savedWinPos) {
            const p = JSON.parse(savedWinPos);
            win.style.left = p.left;
            win.style.top = p.top;
        }

        setupEvents();
    }

    // Lógica especifica para arrastrar ventana desde header
    function startDragWindow(e, win) {
        if(e.target.closest('.no-drag')) return;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        const rect = win.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;
        
        const move = (ev) => {
            ev.preventDefault();
            const cx = ev.type.includes('touch') ? ev.touches[0].clientX : ev.clientX;
            const cy = ev.type.includes('touch') ? ev.touches[0].clientY : ev.clientY;
            
            win.style.left = (cx - offsetX) + 'px';
            win.style.top = (cy - offsetY) + 'px';
            win.style.transform = 'none'; // Anular centrado CSS si existe
        };
        
        const end = () => {
            document.removeEventListener(e.type.includes('touch')?'touchmove':'mousemove', move);
            document.removeEventListener(e.type.includes('touch')?'touchend':'mouseup', end);
            localStorage.setItem(CONFIG.POS_WIN_KEY, JSON.stringify({left: win.style.left, top: win.style.top}));
        };
        
        document.addEventListener(e.type.includes('touch')?'touchmove':'mousemove', move, {passive:false});
        document.addEventListener(e.type.includes('touch')?'touchend':'mouseup', end);
    }

    function renderSidebar() {
        const list = document.getElementById('n-list');
        if (!list) return;
        list.innerHTML = state.notes.map(note => `
            <div onclick="API.selectNote('${note.id}')" class="cursor-pointer p-2 rounded-lg text-xs transition-colors ${note.id === state.currentId ? 'bg-white dark:bg-white/10 shadow-sm font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5'}">
                <div class="truncate">${note.title || 'Sin título'}</div>
                <div class="text-[9px] opacity-70 mt-0.5">${new Date(note.date).toLocaleDateString()}</div>
            </div>
        `).join('');
    }

    function renderEditor() {
        const note = getCurrentNote();
        if (!note) return;
        document.getElementById('n-title-input').value = note.title;
        document.getElementById('n-editor').value = note.content;
        updateFooter(note);
    }

    function updateFooter(note) {
        const d = new Date(note.date);
        document.getElementById('n-date').innerText = `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
        document.getElementById('n-words').innerText = `${note.content.trim().split(/\s+/).length} palabras`;
    }

    function setupEvents() {
        const titleInput = document.getElementById('n-title-input');
        const editor = document.getElementById('n-editor');
        const autoSave = () => {
            const note = getCurrentNote();
            note.title = titleInput.value;
            note.content = editor.value;
            note.date = new Date().toISOString();
            saveNotes();
            renderSidebar();
            updateFooter(note);
            const ind = document.getElementById('n-save-status');
            ind.style.opacity = '1';
            setTimeout(() => ind.style.opacity = '0', 1000);
        };
        titleInput.addEventListener('input', autoSave);
        editor.addEventListener('input', autoSave);
    }

    const API = {
        toggle: () => {
            const win = document.getElementById('notepad-window');
            state.isOpen = !state.isOpen;
            if (state.isOpen) {
                win.classList.remove('hidden');
                win.classList.add('flex');
                renderSidebar(); renderEditor();
            } else {
                win.classList.add('hidden');
                win.classList.remove('flex');
            }
        },
        close: () => API.toggle(),
        minimize: () => {
            const win = document.getElementById('notepad-window');
            state.isMinimized = !state.isMinimized;
            win.style.height = state.isMinimized ? '48px' : '550px';
        },
        maximize: () => {
            const win = document.getElementById('notepad-window');
            win.style.width = '95vw'; win.style.height = '90vh'; win.style.top = '5vh'; win.style.left = '2.5vw';
        },
        addNote: () => createNote(),
        selectNote: (id) => { state.currentId = id; renderSidebar(); renderEditor(); },
        download: () => {
            const note = getCurrentNote();
            const blob = new Blob([note.content], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${note.title || 'nota'}.txt`;
            a.click();
        }
    };

    window.API = API;
    window.toggleNotepad = API.toggle;

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { loadNotes(); injectStyles(); buildUI(); });
    else { loadNotes(); injectStyles(); buildUI(); }

})();
