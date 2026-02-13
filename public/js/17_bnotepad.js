// 17_bnotepad.js — Gestor de Notas Profesional (Multi‑nota, Nube por Usuario)
// Dependencias: auth.js (window.NCLEX_AUTH, Firebase), utils.js

(function() {
    'use strict';

    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        STORAGE_KEY: 'nclex_notes_ui_v1',   // solo para UI (posición, nota activa)
        COLLECTION: 'notes',                 // subcolección dentro de cada usuario
        Z_INDEX: 9990,
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
    if (window.__bnotepadV2Initialized) {
        console.log('📝 BNotepad V2 ya está inicializado');
        return;
    }
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
        if (!window.NCLEX_AUTH || !window.firebaseApp) {
            // Si no está disponible, esperar a que auth cargue
            return null;
        }
        try {
            const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
            return getFirestore(window.firebaseApp);
        } catch (e) {
            console.error('Error al obtener Firestore:', e);
            return null;
        }
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

            if (state.notes.length === 0) {
                // Crear nota por defecto
                await createNewNote('Bienvenido', 'Toma tus apuntes de estudio aquí...');
            } else {
                // Seleccionar la primera o la última activa
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
        } catch (e) {
            console.error('Error cargando notas:', e);
        }
    }

    async function saveNoteToCloud(noteId, updates) {
        if (!state.currentUser) return;
        const db = await getDb();
        if (!db) return;

        try {
            const { doc, updateDoc, setDoc, Timestamp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
            const noteRef = doc(db, 'users', state.currentUser, CONFIG.COLLECTION, noteId);
            const data = {
                ...updates,
                updatedAt: Timestamp.now()
            };
            await setDoc(noteRef, data, { merge: true });
            
            // Actualizar en memoria
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
        } catch {
            return {};
        }
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

    // ===== RENDERIZADO DE LA VENTANA =====
    function injectStyles() {
        if (document.getElementById('bnotepad-v2-style')) return;
        const style = document.createElement('style');
        style.id = 'bnotepad-v2-style';
        style.textContent = `
            /* Botón en barra lateral (ya está en HTML) */
            
            /* Ventana principal */
            #bnotepad-window-v2 {
                position: fixed;
                background: var(--brand-card, rgba(255,255,255,0.98));
                backdrop-filter: blur(30px) saturate(200%);
                border: 1px solid var(--brand-border, rgba(0,0,0,0.1));
                border-radius: 24px;
                box-shadow: 0 30px 60px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.02);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index: ${CONFIG.Z_INDEX};
                transition: opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1), visibility 0.25s;
                opacity: 0;
                transform: scale(0.95) translateY(10px);
                visibility: hidden;
                min-width: 400px;
                min-height: 400px;
                resize: both;
            }
            .dark #bnotepad-window-v2 {
                background: var(--brand-card, rgba(28,28,30,0.98));
                border-color: var(--brand-border, rgba(255,255,255,0.1));
                box-shadow: 0 30px 60px -15px #000, 0 0 0 1px rgba(255,255,255,0.05);
            }
            #bnotepad-window-v2.visible {
                opacity: 1;
                transform: scale(1) translateY(0);
                visibility: visible;
            }

            /* Header arrastrable */
            #bnotepad-header-v2 {
                height: 56px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
                cursor: grab;
                user-select: none;
                background: linear-gradient(180deg, rgba(var(--brand-blue-rgb),0.05) 0%, transparent 100%);
                border-bottom: 1px solid var(--brand-border);
            }
            #bnotepad-header-v2:active { cursor: grabbing; }

            /* Pestañas de notas */
            .bnotepad-tabs {
                display: flex;
                gap: 4px;
                overflow-x: auto;
                max-width: 60%;
                padding: 4px 0;
                scrollbar-width: thin;
            }
            .bnotepad-tab {
                padding: 6px 12px;
                background: rgba(var(--brand-blue-rgb),0.08);
                border-radius: 30px;
                font-size: 12px;
                font-weight: 600;
                color: var(--brand-text-muted);
                white-space: nowrap;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                border: 1px solid transparent;
                transition: all 0.15s;
            }
            .bnotepad-tab.active {
                background: rgb(var(--brand-blue-rgb));
                color: white;
                border-color: rgb(var(--brand-blue-rgb));
            }
            .bnotepad-tab .tab-close {
                opacity: 0.5;
                font-size: 10px;
                padding: 2px;
                border-radius: 50%;
            }
            .bnotepad-tab .tab-close:hover {
                opacity: 1;
                background: rgba(255,255,255,0.2);
            }

            /* Botones de tráfico (macOS) */
            .traffic-lights {
                display: flex;
                gap: 10px;
            }
            .traffic-dot {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.1);
            }
            .dot-red { background: #FF5F57; }
            .dot-yellow { background: #FEBC2E; }
            .dot-green { background: #28C840; }

            /* Toolbar */
            #bnotepad-toolbar-v2 {
                padding: 10px 20px;
                border-bottom: 1px solid var(--brand-border);
                background: rgba(var(--brand-blue-rgb),0.02);
                display: flex;
                gap: 4px;
                flex-wrap: wrap;
            }
            .tool-btn {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                background: transparent;
                border: none;
                color: var(--brand-text-muted);
                cursor: pointer;
                transition: all 0.15s;
            }
            .tool-btn:hover {
                background: rgba(var(--brand-blue-rgb),0.1);
                color: rgb(var(--brand-blue-rgb));
            }

            /* Área de contenido (título y texto) */
            .bnotepad-title-edit {
                padding: 12px 20px 0 20px;
            }
            .bnotepad-title-edit input {
                width: 100%;
                background: transparent;
                border: none;
                font-size: 20px;
                font-weight: 700;
                color: var(--brand-text);
                outline: none;
                padding: 8px 0;
                border-bottom: 2px solid transparent;
                transition: border-color 0.2s;
            }
            .bnotepad-title-edit input:focus {
                border-bottom-color: rgb(var(--brand-blue-rgb));
            }

            #bnotepad-textarea-v2 {
                flex: 1;
                width: 100%;
                padding: 16px 20px;
                background: transparent;
                border: none;
                resize: none;
                font-size: 15px;
                line-height: 1.7;
                color: var(--brand-text);
                outline: none;
                font-family: inherit;
            }

            /* Footer */
            #bnotepad-footer-v2 {
                height: 40px;
                padding: 0 20px;
                border-top: 1px solid var(--brand-border);
                background: rgba(var(--brand-blue-rgb),0.02);
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 11px;
                color: var(--brand-text-muted);
            }

            /* Resize handle */
            .resize-handle {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 24px;
                height: 24px;
                cursor: nwse-resize;
                background: linear-gradient(135deg, transparent 45%, var(--brand-text-muted) 45%, var(--brand-text-muted) 55%, transparent 55%);
                opacity: 0.3;
                border-bottom-right-radius: 24px;
            }
            .resize-handle:hover { opacity: 0.8; }
        `;
        document.head.appendChild(style);
    }

    function createElements() {
        if (elements.window) return;

        injectStyles();

        // Ventana
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
                <button class="tool-btn" data-cmd="bold" title="Negrita"><i class="fa-solid fa-bold"></i></button>
                <button class="tool-btn" data-cmd="italic" title="Cursiva"><i class="fa-solid fa-italic"></i></button>
                <button class="tool-btn" data-cmd="underline" title="Subrayado"><i class="fa-solid fa-underline"></i></button>
                <div style="width:1px; height:20px; background:var(--brand-border); margin:0 4px;"></div>
                <button class="tool-btn" data-cmd="insertUnorderedList" title="Lista"><i class="fa-solid fa-list-ul"></i></button>
                <button class="tool-btn" data-cmd="insertOrderedList" title="Lista numerada"><i class="fa-solid fa-list-ol"></i></button>
                <div style="width:1px; height:20px; background:var(--brand-border); margin:0 4px;"></div>
                <button class="tool-btn" data-action="download" title="Descargar nota"><i class="fa-solid fa-download"></i></button>
                <button class="tool-btn" data-action="delete" title="Eliminar nota"><i class="fa-solid fa-trash-can"></i></button>
            </div>

            <div class="bnotepad-title-edit">
                <input type="text" id="bnotepad-title-input" placeholder="Título de la nota">
            </div>

            <textarea id="bnotepad-textarea-v2" placeholder="Escribe tus apuntes de estudio aquí..."></textarea>

            <div id="bnotepad-footer-v2">
                <span id="bnotepad-wordcount">0 palabras</span>
                <span id="bnotepad-save-indicator">Guardado</span>
            </div>

            <div class="resize-handle" id="bnotepad-resize"></div>
        `;

        document.body.appendChild(elements.window);

        // Cachear subelementos
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
                    <span>${note.title || 'Sin título'}</span>
                    <span class="tab-close" data-delete-id="${note.id}" title="Eliminar">×</span>
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
        elements.saveIndicator.textContent = '✓ Guardado';
        setTimeout(() => {
            elements.saveIndicator.textContent = 'Guardado';
        }, 1500);
    }

    // ===== EVENTOS =====
    function setupEvents() {
        cleanupEventListeners();

        // Header: arrastre
        addEventListenerWithCleanup(elements.header, 'mousedown', startDrag);

        // Botones de tráfico
        addEventListenerWithCleanup(elements.header.querySelector('.traffic-lights'), 'click', (e) => {
            const dot = e.target.closest('.traffic-dot');
            if (!dot) return;
            const action = dot.dataset.action;
            if (action === 'close') closeNotepad();
            else if (action === 'minimize') closeNotepad(); // minimizar = cerrar por ahora
            else if (action === 'maximize') toggleMaximize();
        });

        // Nueva nota
        addEventListenerWithCleanup(elements.newBtn, 'click', () => createNewNote());

        // Tabs: cambio y eliminación
        addEventListenerWithCleanup(elements.tabs, 'click', (e) => {
            const tab = e.target.closest('.bnotepad-tab');
            if (!tab) return;
            const noteId = tab.dataset.noteId;
            if (noteId && state.activeNoteId !== noteId) {
                // Guardar cambios de la nota anterior antes de cambiar
                saveCurrentNote();
                state.activeNoteId = noteId;
                renderNotesList();
                renderActiveNote();
                saveUIState();
            }
            const closeBtn = e.target.closest('.tab-close');
            if (closeBtn) {
                e.stopPropagation();
                const deleteId = closeBtn.dataset.deleteId;
                if (deleteId) deleteNoteFromCloud(deleteId);
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

        // Título
        addEventListenerWithCleanup(elements.titleInput, 'input', () => {
            const note = state.notes.find(n => n.id === state.activeNoteId);
            if (!note) return;
            note.title = elements.titleInput.value;
            scheduleSave();
            renderNotesList(); // actualizar título en pestaña
        });

        // Textarea
        let saveTimeout;
        addEventListenerWithCleanup(elements.textarea, 'input', () => {
            const note = state.notes.find(n => n.id === state.activeNoteId);
            if (!note) return;
            note.content = elements.textarea.value;
            updateWordCount();
            scheduleSave();
        });

        // Resize handle
        addEventListenerWithCleanup(elements.resizeHandle, 'mousedown', startResize);

        // Guardar al perder foco
        addEventListenerWithCleanup(elements.textarea, 'blur', () => saveCurrentNote());
        addEventListenerWithCleanup(elements.titleInput, 'blur', () => saveCurrentNote());

        // Teclas globales
        addEventListenerWithCleanup(document, 'keydown', (e) => {
            if (e.key === 'Escape' && state.isOpen) closeNotepad();
            if ((e.ctrlKey || e.metaKey) && e.key === 's' && state.isOpen) {
                e.preventDefault();
                saveCurrentNote();
                showSaveIndicator();
            }
        });

        // Cerrar sesión: guardar antes de salir
        window.addEventListener('beforeunload', () => {
            saveCurrentNote();
        });
    }

    function scheduleSave() {
        if (state.saveTimeout) clearTimeout(state.saveTimeout);
        state.saveTimeout = setTimeout(() => {
            saveCurrentNote();
        }, 800);
    }

    async function saveCurrentNote() {
        if (!state.activeNoteId || !state.currentUser) return;
        const note = state.notes.find(n => n.id === state.activeNoteId);
        if (!note) return;
        await saveNoteToCloud(note.id, {
            title: note.title,
            content: note.content
        });
        showSaveIndicator();
        saveUIState();
    }

    function downloadCurrentNote() {
        const note = state.notes.find(n => n.id === state.activeNoteId);
        if (!note) return;
        const content = `# ${note.title}\n\n${note.content}`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `NCLEX_${note.title.replace(/\s+/g, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // ===== ARRASTRE Y REDIMENSIONADO =====
    function startDrag(e) {
        if (e.button !== 0) return;
        if (e.target.closest('.tool-btn, .traffic-dot, .bnotepad-tab, #bnotepad-new-note')) return;
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
        e.preventDefault();

        let newLeft = state.dragStartLeft + (e.clientX - state.dragStartX);
        let newTop = state.dragStartTop + (e.clientY - state.dragStartY);

        const margin = 10;
        newLeft = Math.max(margin, Math.min(newLeft, window.innerWidth - elements.window.offsetWidth - margin));
        newTop = Math.max(margin, Math.min(newTop, window.innerHeight - elements.window.offsetHeight - margin));

        elements.window.style.left = newLeft + 'px';
        elements.window.style.top = newTop + 'px';
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
        state.dragStartLeft = elements.window.offsetLeft;
        state.dragStartTop = elements.window.offsetTop;
        state.dragStartWidth = elements.window.offsetWidth;
        state.dragStartHeight = elements.window.offsetHeight;

        document.addEventListener('mousemove', onResizeMove);
        document.addEventListener('mouseup', onResizeEnd);
    }

    function onResizeMove(e) {
        if (!state.isResizing) return;
        const dx = e.clientX - state.dragStartX;
        const dy = e.clientY - state.dragStartY;
        const newWidth = Math.max(400, state.dragStartWidth + dx);
        const newHeight = Math.max(400, state.dragStartHeight + dy);
        elements.window.style.width = newWidth + 'px';
        elements.window.style.height = newHeight + 'px';
    }

    function onResizeEnd() {
        if (!state.isResizing) return;
        state.isResizing = false;
        state.w = elements.window.offsetWidth;
        state.h = elements.window.offsetHeight;
        saveUIState();
        document.removeEventListener('mousemove', onResizeMove);
        document.removeEventListener('mouseup', onResizeEnd);
    }

    function toggleMaximize() {
        // Alternar entre maximizado y tamaño guardado
        if (elements.window.style.width === '100vw') {
            // Restaurar
            elements.window.style.left = state.x + 'px';
            elements.window.style.top = state.y + 'px';
            elements.window.style.width = state.w + 'px';
            elements.window.style.height = state.h + 'px';
        } else {
            // Maximizar
            elements.window.style.left = '10px';
            elements.window.style.top = '10px';
            elements.window.style.width = 'calc(100vw - 20px)';
            elements.window.style.height = 'calc(100vh - 20px)';
        }
    }

    // ===== CONTROL DE VISIBILIDAD =====
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

    // ===== INICIALIZACIÓN =====
    async function init() {
        console.log('📝 BNotepad V2 iniciando...');

        // Obtener usuario actual
        const checkUser = () => {
            try {
                const session = JSON.parse(localStorage.getItem('nclex_user_session_v5') || 'null');
                return session?.name || null;
            } catch {
                return null;
            }
        };
        state.currentUser = checkUser();

        if (!state.currentUser) {
            console.log('Notas: usuario no autenticado, esperando login...');
            // Escuchar cambios en auth (simplificado: se puede mejorar con evento personalizado)
            const interval = setInterval(() => {
                const newUser = checkUser();
                if (newUser && newUser !== state.currentUser) {
                    state.currentUser = newUser;
                    clearInterval(interval);
                    loadNotesFromCloud();
                }
            }, 1000);
            return;
        }

        // Cargar posición guardada
        const saved = loadUIState();
        if (saved) {
            state.x = saved.x ?? 100;
            state.y = saved.y ?? 80;
            state.w = saved.w ?? CONFIG.DEFAULT_WIDTH;
            state.h = saved.h ?? CONFIG.DEFAULT_HEIGHT;
            state.isOpen = saved.isOpen ?? false;
        }

        createElements();

        // Cargar notas desde la nube
        await loadNotesFromCloud();

        if (state.isOpen) openNotepad();

        // Exponer API pública
        window.BNotepad = {
            open: openNotepad,
            close: closeNotepad,
            toggle: toggleNotepad,
            isOpen: () => state.isOpen
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();