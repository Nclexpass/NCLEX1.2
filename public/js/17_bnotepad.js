// 17_bnotepad.js — Gestor de Notas Profesional (Integrated with Auth & Skins)
// Version 3.2.0 - Event Driven Architecture

(function() {
    'use strict';

    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        STORAGE_KEY: 'nclex_notes_ui_v2',   // UI preference storage
        COLLECTION: 'notes',                 // Firestore subcollection
        Z_INDEX: 9950,                       // Debajo del Auth Overlay (9999) pero encima de todo lo demás
        DEFAULT_WIDTH: 520,
        DEFAULT_HEIGHT: 620
    };

    // ===== ESTADO =====
    const state = {
        isOpen: false,
        notes: [],                // [{ id, title, content, updatedAt }]
        activeNoteId: null,
        x: 100,
        y: 80,
        w: CONFIG.DEFAULT_WIDTH,
        h: CONFIG.DEFAULT_HEIGHT,
        isDragging: false,
        isResizing: false,
        dragStartX: 0,
        dragStartY: 0,
        dragStartLeft: 0,
        dragStartTop: 0,
        resizeDirection: null,
        saveTimeout: null,
        currentUser: null
    };

    // ===== SINGLETON =====
    if (window.__bnotepadV2Initialized) return;
    window.__bnotepadV2Initialized = true;

    let elements = {};
    let eventListeners = [];

    // ===== UTILIDADES =====
    function addEventListenerWithCleanup(element, event, handler, options) {
        if (!element) return;
        element.addEventListener(event, handler, options);
        eventListeners.push({ element, event, handler });
    }

    function cleanupEventListeners() {
        eventListeners.forEach(({ element, event, handler }) => {
            element?.removeEventListener(event, handler);
        });
        eventListeners = [];
    }

    // ===== FIRESTORE (NUBE) =====
    async function getDb() {
        // Intenta usar la instancia global si existe (optimización)
        if (window.firebaseApp) {
            try {
                const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
                return getFirestore(window.firebaseApp);
            } catch (e) { console.error("Firebase import error", e); }
        }
        return null;
    }

    async function loadNotesFromCloud() {
        if (!state.currentUser) return;
        const db = await getDb();
        if (!db) return;

        try {
            const { collection, query, orderBy, getDocs } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
            const notesRef = collection(db, 'users', state.currentUser, CONFIG.COLLECTION);
            const q = query(notesRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            
            state.notes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                updatedAt: doc.data().updatedAt?.toDate?.() || new Date(doc.data().updatedAt)
            }));

            // Si no hay notas, crear bienvenida
            if (state.notes.length === 0) {
                await createNewNote('Bienvenido', 'Toma tus apuntes de estudio aquí. Se guardan en tu cuenta automáticamente.');
            } else {
                // Restaurar última nota activa o la más reciente
                const savedUI = loadUIState();
                const activeId = savedUI?.activeNoteId;
                if (activeId && state.notes.some(n => n.id === activeId)) {
                    state.activeNoteId = activeId;
                } else {
                    state.activeNoteId = state.notes[0]?.id;
                }
            }
            renderNotesList();
            renderActiveNote();
            console.log(`📝 BNotepad: ${state.notes.length} notas cargadas.`);
        } catch (e) {
            console.error('Error cargando notas:', e);
        }
    }

    async function saveNoteToCloud(noteId, updates) {
        if (!state.currentUser) return;
        const db = await getDb();
        if (!db) return;

        try {
            const { doc, setDoc, Timestamp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
            const noteRef = doc(db, 'users', state.currentUser, CONFIG.COLLECTION, noteId);
            const data = {
                ...updates,
                updatedAt: Timestamp.now()
            };
            await setDoc(noteRef, data, { merge: true });
            
            // Actualizar memoria local
            const note = state.notes.find(n => n.id === noteId);
            if (note) {
                Object.assign(note, updates);
                note.updatedAt = new Date();
            }
        } catch (e) {
            console.error('Error guardando nota:', e);
        }
    }

    async function createNewNote(title = 'Sin título', content = '') {
        if (!state.currentUser) return;
        const db = await getDb();
        if (!db) return;

        try {
            const { collection, addDoc, Timestamp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
            const notesRef = collection(db, 'users', state.currentUser, CONFIG.COLLECTION);
            const now = Timestamp.now();
            const newNote = {
                title: title || 'Nueva nota',
                content: content || '',
                createdAt: now,
                updatedAt: now
            };
            const docRef = await addDoc(notesRef, newNote);
            
            state.notes.unshift({
                id: docRef.id,
                ...newNote,
                updatedAt: new Date()
            });
            state.activeNoteId = docRef.id;
            renderNotesList();
            renderActiveNote();
            saveUIState();
        } catch (e) {
            console.error('Error creando nota:', e);
        }
    }

    async function deleteNoteFromCloud(noteId) {
        if (!state.currentUser || !noteId) return;
        if (!confirm('¿Eliminar esta nota permanentemente?')) return;

        const db = await getDb();
        if (!db) return;

        try {
            const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
            const noteRef = doc(db, 'users', state.currentUser, CONFIG.COLLECTION, noteId);
            await deleteDoc(noteRef);
            
            state.notes = state.notes.filter(n => n.id !== noteId);
            // Seleccionar otra nota si la activa se borró
            if (state.activeNoteId === noteId) {
                state.activeNoteId = state.notes[0]?.id || null;
            }
            renderNotesList();
            renderActiveNote();
            saveUIState();
        } catch (e) {
            console.error('Error eliminando nota:', e);
        }
    }

    // ===== UI (LOCAL) =====
    function loadUIState() {
        try {
            return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || {};
        } catch { return {}; }
    }

    function saveUIState() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                activeNoteId: state.activeNoteId,
                x: state.x,
                y: state.y,
                w: state.w,
                h: state.h,
                isOpen: state.isOpen
            }));
        } catch (e) {}
    }

    // ===== RENDERIZADO =====
    function injectStyles() {
        if (document.getElementById('bnotepad-v2-style')) return;
        const style = document.createElement('style');
        style.id = 'bnotepad-v2-style';
        style.textContent = `
            #bnotepad-window-v2 {
                position: fixed;
                background: var(--brand-card, #ffffff);
                backdrop-filter: blur(20px);
                border: 1px solid var(--brand-border, #e2e8f0);
                border-radius: 16px;
                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index: ${CONFIG.Z_INDEX};
                transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
                opacity: 0;
                transform: scale(0.95);
                visibility: hidden;
                min-width: 350px;
                min-height: 400px;
            }
            .dark #bnotepad-window-v2 {
                background: var(--brand-card, #1c1c1e);
                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
            }
            #bnotepad-window-v2.visible {
                opacity: 1;
                transform: scale(1);
                visibility: visible;
            }

            /* Header */
            #bnotepad-header-v2 {
                height: 48px;
                display: flex;
                align-items: center;
                padding: 0 16px;
                cursor: grab;
                background: rgba(var(--brand-blue-rgb), 0.05);
                border-bottom: 1px solid var(--brand-border, #e2e8f0);
                gap: 12px;
            }
            #bnotepad-header-v2:active { cursor: grabbing; }

            /* Traffic Lights */
            .traffic-lights { display: flex; gap: 8px; }
            .traffic-dot { width: 12px; height: 12px; border-radius: 50%; cursor: pointer; transition: opacity 0.2s; }
            .traffic-dot:hover { opacity: 0.8; }
            .dot-red { background: #ff5f57; }
            .dot-yellow { background: #febc2e; }
            .dot-green { background: #28c840; }

            /* Tabs */
            .bnotepad-tabs {
                flex: 1;
                display: flex;
                gap: 4px;
                overflow-x: auto;
                scrollbar-width: none;
                padding: 4px 0;
            }
            .bnotepad-tab {
                padding: 4px 10px;
                background: rgba(var(--brand-blue-rgb), 0.05);
                border-radius: 6px;
                font-size: 11px;
                font-weight: 600;
                color: var(--brand-text-muted);
                white-space: nowrap;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.2s;
            }
            .bnotepad-tab.active {
                background: rgb(var(--brand-blue-rgb));
                color: white;
            }
            .tab-close:hover { color: #ff5f57; }

            /* Toolbar & Tools */
            #bnotepad-toolbar-v2 {
                padding: 8px 16px;
                border-bottom: 1px solid var(--brand-border);
                display: flex; gap: 4px;
                background: var(--brand-bg);
            }
            .tool-btn {
                width: 28px; height: 28px;
                border-radius: 4px;
                border: none;
                background: transparent;
                color: var(--brand-text-muted);
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                transition: 0.2s;
            }
            .tool-btn:hover { background: rgba(var(--brand-blue-rgb), 0.1); color: rgb(var(--brand-blue-rgb)); }

            /* Editor */
            .bnotepad-title-edit { padding: 12px 16px 0; }
            .bnotepad-title-edit input {
                width: 100%; border: none; background: transparent;
                font-size: 18px; font-weight: 700; color: var(--brand-text);
                outline: none; padding-bottom: 8px;
                border-bottom: 2px solid transparent;
            }
            .bnotepad-title-edit input:focus { border-bottom-color: rgb(var(--brand-blue-rgb)); }
            
            #bnotepad-textarea-v2 {
                flex: 1; width: 100%; padding: 16px;
                border: none; background: transparent; resize: none;
                font-size: 14px; line-height: 1.6; color: var(--brand-text);
                outline: none; font-family: inherit;
            }

            /* Footer */
            #bnotepad-footer-v2 {
                height: 32px; padding: 0 16px;
                border-top: 1px solid var(--brand-border);
                display: flex; align-items: center; justify-content: space-between;
                font-size: 10px; color: var(--brand-text-muted);
                background: var(--brand-bg);
            }
            
            .resize-handle {
                position: absolute; bottom: 0; right: 0;
                width: 20px; height: 20px; cursor: nwse-resize;
                opacity: 0.5;
            }
        `;
        document.head.appendChild(style);
    }

    function createElements() {
        if (elements.window) return;
        injectStyles();

        elements.window = document.createElement('div');
        elements.window.id = 'bnotepad-window-v2';
        elements.window.innerHTML = `
            <div id="bnotepad-header-v2">
                <div class="traffic-lights">
                    <div class="traffic-dot dot-red" data-action="close" title="Cerrar"></div>
                    <div class="traffic-dot dot-yellow" data-action="minimize" title="Minimizar"></div>
                    <div class="traffic-dot dot-green" data-action="maximize" title="Maximizar"></div>
                </div>
                <div class="bnotepad-tabs" id="bnotepad-tabs"></div>
                <button id="bnotepad-new-note" class="tool-btn" title="Nueva nota"><i class="fa-solid fa-plus"></i></button>
            </div>
            
            <div id="bnotepad-toolbar-v2">
                <button class="tool-btn" data-cmd="bold"><i class="fa-solid fa-bold"></i></button>
                <button class="tool-btn" data-cmd="italic"><i class="fa-solid fa-italic"></i></button>
                <button class="tool-btn" data-cmd="underline"><i class="fa-solid fa-underline"></i></button>
                <div style="width:1px; height:16px; background:var(--brand-border); margin:0 4px;"></div>
                <button class="tool-btn" data-cmd="insertUnorderedList"><i class="fa-solid fa-list-ul"></i></button>
                <button class="tool-btn" data-action="download"><i class="fa-solid fa-download"></i></button>
                <button class="tool-btn" data-action="delete"><i class="fa-solid fa-trash-can"></i></button>
            </div>

            <div class="bnotepad-title-edit">
                <input type="text" id="bnotepad-title-input" placeholder="Título">
            </div>

            <textarea id="bnotepad-textarea-v2" placeholder="Tus apuntes..."></textarea>

            <div id="bnotepad-footer-v2">
                <span id="bnotepad-wordcount">0 palabras</span>
                <span id="bnotepad-save-indicator">Sincronizado</span>
            </div>
            <div class="resize-handle" id="bnotepad-resize"></div>
        `;

        document.body.appendChild(elements.window);

        // Referencias
        elements.header = elements.window.querySelector('#bnotepad-header-v2');
        elements.tabs = elements.window.querySelector('#bnotepad-tabs');
        elements.newBtn = elements.window.querySelector('#bnotepad-new-note');
        elements.titleInput = elements.window.querySelector('#bnotepad-title-input');
        elements.textarea = elements.window.querySelector('#bnotepad-textarea-v2');
        elements.wordCount = elements.window.querySelector('#bnotepad-wordcount');
        elements.saveIndicator = elements.window.querySelector('#bnotepad-save-indicator');
        elements.resizeHandle = elements.window.querySelector('#bnotepad-resize');

        applyPosition();
        setupEvents();
    }

    function applyPosition() {
        if (!elements.window) return;
        elements.window.style.left = state.x + 'px';
        elements.window.style.top = state.y + 'px';
        elements.window.style.width = state.w + 'px';
        elements.window.style.height = state.h + 'px';
    }

    function renderNotesList() {
        if (!elements.tabs) return;
        elements.tabs.innerHTML = state.notes.map(note => {
            const isActive = note.id === state.activeNoteId;
            return `
                <div class="bnotepad-tab ${isActive ? 'active' : ''}" data-note-id="${note.id}">
                    <span>${note.title || 'Nota'}</span>
                    ${isActive ? '<span class="tab-close" data-delete-id="'+note.id+'">×</span>' : ''}
                </div>
            `;
        }).join('');
    }

    function renderActiveNote() {
        const note = state.notes.find(n => n.id === state.activeNoteId);
        if (!note) {
            elements.titleInput.value = '';
            elements.textarea.value = '';
            return;
        }
        elements.titleInput.value = note.title || '';
        elements.textarea.value = note.content || '';
        updateWordCount();
    }

    function updateWordCount() {
        const text = elements.textarea?.value || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        if (elements.wordCount) elements.wordCount.textContent = `${words} palabras`;
    }

    function showSaveIndicator() {
        if (!elements.saveIndicator) return;
        elements.saveIndicator.textContent = 'Guardando...';
        setTimeout(() => {
            elements.saveIndicator.textContent = '✓ En Nube';
        }, 800);
    }

    // ===== EVENTOS DE USUARIO =====
    function setupEvents() {
        cleanupEventListeners();

        // Dragging
        addEventListenerWithCleanup(elements.header, 'mousedown', startDrag);

        // Header actions
        addEventListenerWithCleanup(elements.header, 'click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            if (action === 'close' || action === 'minimize') closeNotepad();
            if (action === 'maximize') toggleMaximize();
            if (e.target.closest('#bnotepad-new-note')) createNewNote();
        });

        // Tabs
        addEventListenerWithCleanup(elements.tabs, 'click', (e) => {
            const tab = e.target.closest('.bnotepad-tab');
            if (!tab) return;
            
            const close = e.target.closest('.tab-close');
            if (close) {
                e.stopPropagation();
                deleteNoteFromCloud(close.dataset.deleteId);
                return;
            }

            const noteId = tab.dataset.noteId;
            if (noteId && state.activeNoteId !== noteId) {
                saveCurrentNote(); // Guardar anterior
                state.activeNoteId = noteId;
                renderNotesList();
                renderActiveNote();
                saveUIState();
            }
        });

        // Toolbar
        addEventListenerWithCleanup(elements.window.querySelector('#bnotepad-toolbar-v2'), 'click', (e) => {
            const btn = e.target.closest('.tool-btn');
            if (!btn) return;
            const cmd = btn.dataset.cmd;
            const action = btn.dataset.action;
            if (cmd) {
                document.execCommand(cmd, false, null);
                elements.textarea.focus();
            } else if (action === 'download') {
                downloadCurrentNote();
            } else if (action === 'delete') {
                if (state.activeNoteId) deleteNoteFromCloud(state.activeNoteId);
            }
        });

        // Inputs
        const onInput = () => {
            const note = state.notes.find(n => n.id === state.activeNoteId);
            if (note) {
                note.title = elements.titleInput.value;
                note.content = elements.textarea.value;
                updateWordCount();
                renderNotesList(); // Actualizar tab título
                scheduleSave();
            }
        };

        addEventListenerWithCleanup(elements.titleInput, 'input', onInput);
        addEventListenerWithCleanup(elements.textarea, 'input', onInput);
        
        // Resize
        addEventListenerWithCleanup(elements.resizeHandle, 'mousedown', startResize);
    }

    function scheduleSave() {
        showSaveIndicator();
        if (state.saveTimeout) clearTimeout(state.saveTimeout);
        state.saveTimeout = setTimeout(saveCurrentNote, 1500);
    }

    async function saveCurrentNote() {
        if (!state.activeNoteId || !state.currentUser) return;
        const note = state.notes.find(n => n.id === state.activeNoteId);
        if (!note) return;
        await saveNoteToCloud(note.id, {
            title: note.title,
            content: note.content
        });
        saveUIState();
    }

    function downloadCurrentNote() {
        const note = state.notes.find(n => n.id === state.activeNoteId);
        if (!note) return;
        const blob = new Blob([`# ${note.title}\n\n${note.content}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `NCLEX_${note.title.replace(/\s+/g, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // ===== WINDOW CONTROLS =====
    function startDrag(e) {
        if (e.target.closest('button, .traffic-dot, .bnotepad-tab')) return;
        e.preventDefault();
        state.isDragging = true;
        state.dragStartX = e.clientX;
        state.dragStartY = e.clientY;
        state.dragStartLeft = elements.window.offsetLeft;
        state.dragStartTop = elements.window.offsetTop;
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
    }

    function onDragMove(e) {
        if (!state.isDragging) return;
        elements.window.style.left = (state.dragStartLeft + (e.clientX - state.dragStartX)) + 'px';
        elements.window.style.top = (state.dragStartTop + (e.clientY - state.dragStartY)) + 'px';
    }

    function onDragEnd() {
        if (!state.isDragging) return;
        state.isDragging = false;
        state.x = elements.window.offsetLeft;
        state.y = elements.window.offsetTop;
        saveUIState();
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
    }

    function startResize(e) {
        e.preventDefault();
        state.isResizing = true;
        state.dragStartX = e.clientX;
        state.dragStartY = e.clientY;
        state.dragStartWidth = elements.window.offsetWidth;
        state.dragStartHeight = elements.window.offsetHeight;
        document.addEventListener('mousemove', onResizeMove);
        document.addEventListener('mouseup', onResizeEnd);
    }

    function onResizeMove(e) {
        if (!state.isResizing) return;
        elements.window.style.width = Math.max(300, state.dragStartWidth + (e.clientX - state.dragStartX)) + 'px';
        elements.window.style.height = Math.max(300, state.dragStartHeight + (e.clientY - state.dragStartY)) + 'px';
    }

    function onResizeEnd() {
        state.isResizing = false;
        state.w = elements.window.offsetWidth;
        state.h = elements.window.offsetHeight;
        saveUIState();
        document.removeEventListener('mousemove', onResizeMove);
        document.removeEventListener('mouseup', onResizeEnd);
    }

    function toggleMaximize() {
        if (elements.window.style.width === '90vw') {
            applyPosition();
        } else {
            elements.window.style.left = '5vw';
            elements.window.style.top = '5vh';
            elements.window.style.width = '90vw';
            elements.window.style.height = '90vh';
        }
    }

    function openNotepad() {
        if (!elements.window) createElements();
        elements.window.classList.add('visible');
        document.getElementById('notepad-sidebar-btn')?.classList.add('active');
        state.isOpen = true;
        saveUIState();
    }

    function closeNotepad() {
        if (!elements.window) return;
        elements.window.classList.remove('visible');
        document.getElementById('notepad-sidebar-btn')?.classList.remove('active');
        state.isOpen = false;
        saveUIState();
    }

    function toggleNotepad() {
        state.isOpen ? closeNotepad() : openNotepad();
    }

    // ===== INICIALIZACIÓN INTEGRADA =====
    function init() {
        // Verificar usuario actual de forma segura
        const user = window.NCLEX_AUTH?.getUser?.() || JSON.parse(localStorage.getItem('nclex_user_session_v5') || 'null');
        
        if (user && user.name) {
            state.currentUser = user.name;
            // Cargar posición guardada
            const saved = loadUIState();
            state.x = saved.x ?? 100;
            state.y = saved.y ?? 80;
            state.w = saved.w ?? CONFIG.DEFAULT_WIDTH;
            state.h = saved.h ?? CONFIG.DEFAULT_HEIGHT;
            state.isOpen = saved.isOpen ?? false;
            
            createElements();
            if(state.isOpen) openNotepad();
            loadNotesFromCloud();
        } else {
            console.log('📝 BNotepad: Esperando inicio de sesión...');
        }
    }

    // 1. Carga inicial
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 2. ESCUCHA DE EVENTOS AUTH (INTEGRACIÓN CLAVE)
    window.addEventListener('nclex:dataLoaded', () => {
        console.log('📝 BNotepad: Detectado login, recargando...');
        init();
    });

    // API Pública
    window.BNotepad = {
        open: openNotepad,
        close: closeNotepad,
        toggle: toggleNotepad,
        isOpen: () => state.isOpen
    };

})();