// 17_bnotepad.js — Apple Notes (VERSIÓN 3.2)
// COLOCACIÓN: Botón pequeño al lado del botón "Library"
// Totalmente no intrusivo, espera a que Library exista y se acopla a su derecha

(function () {
    'use strict';

    const CONFIG = {
        STORAGE_KEY: 'nclex_apple_notes_v9',
        POS_KEY: 'nclex_apple_pos_v9',
        Z_INDEX: 9985,
        DEFAULT_WIDTH: 380,
        DEFAULT_HEIGHT: 520
    };

    const state = {
        isOpen: false,
        content: '',
        x: 0, y: 0, w: CONFIG.DEFAULT_WIDTH, h: CONFIG.DEFAULT_HEIGHT,
        closeTimeout: null,
        isDragging: false,
        dragStartX: 0, dragStartY: 0,
        dragStartLeft: 0, dragStartTop: 0,
        wordCount: 0,
        lastSaved: null
    };

    if (window.__bnotepadInitialized) return;
    window.__bnotepadInitialized = true;

    let elements = {
        trigger: null,
        window: null,
        textarea: null,
        header: null,
        downloadBtn: null,
        wordCountEl: null,
        saveIndicator: null
    };
    let eventListeners = [];
    let libraryObserver = null;

    // ===== PERSISTENCIA =====
    function loadState() {
        try {
            const saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
            state.content = saved.content || '';
            state.isOpen = saved.isOpen || false;
            state.lastSaved = saved.lastSaved || null;
        } catch (e) {}
        try {
            const pos = JSON.parse(localStorage.getItem(CONFIG.POS_KEY) || '{}');
            state.x = pos.x ?? 100;
            state.y = pos.y ?? 100;
            state.w = pos.w ?? CONFIG.DEFAULT_WIDTH;
            state.h = pos.h ?? CONFIG.DEFAULT_HEIGHT;
        } catch (e) {}
    }
    function saveContent() {
        try {
            state.lastSaved = new Date().toISOString();
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                content: state.content,
                isOpen: state.isOpen,
                lastSaved: state.lastSaved
            }));
            updateSaveIndicator();
        } catch (e) {}
    }
    function savePosition() {
        if (!elements.window) return;
        try {
            const rect = elements.window.getBoundingClientRect();
            state.x = rect.left; state.y = rect.top;
            state.w = rect.width; state.h = rect.height;
            localStorage.setItem(CONFIG.POS_KEY, JSON.stringify({ x: state.x, y: state.y, w: state.w, h: state.h }));
        } catch (e) {}
    }

    // ===== UTILIDADES =====
    function addEventListenerWithCleanup(el, ev, fn, opts) {
        el.addEventListener(ev, fn, opts);
        eventListeners.push({ el, ev, fn });
    }
    function cleanupEventListeners() {
        eventListeners.forEach(({ el, ev, fn }) => el.removeEventListener(ev, fn));
        eventListeners = [];
    }
    function updateWordCount() {
        const text = state.content || '';
        state.wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        if (elements.wordCountEl) elements.wordCountEl.textContent = `${state.wordCount} words`;
    }
    function updateSaveIndicator() {
        if (!elements.saveIndicator || !state.lastSaved) return;
        const date = new Date(state.lastSaved);
        elements.saveIndicator.textContent = `Saved at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        elements.saveIndicator.style.opacity = '1';
    }

    // ===== ESTILOS (solo lo necesario, sin estilos de botón fijo) =====
    function injectStyles() {
        if (document.getElementById('apple-notes-style-v5')) return;
        const style = document.createElement('style');
        style.id = 'apple-notes-style-v5';
        style.textContent = `
            /* Botón de notas junto a Library - estilo compacto */
            #bnotepad-trigger-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                border-radius: 10px;
                background: transparent;
                border: 1px solid var(--brand-border);
                color: var(--brand-text-muted);
                margin-left: 8px;
                transition: all 0.2s ease;
                cursor: pointer;
                position: relative;
            }
            #bnotepad-trigger-btn i {
                font-size: 1.1rem;
                color: rgb(var(--brand-blue-rgb));
            }
            #bnotepad-trigger-btn:hover {
                background: rgba(var(--brand-blue-rgb), 0.1);
                border-color: rgb(var(--brand-blue-rgb));
                transform: translateY(-1px);
            }
            #bnotepad-trigger-btn.active {
                background: rgba(var(--brand-blue-rgb), 0.15);
                border-color: rgb(var(--brand-blue-rgb));
            }
            #bnotepad-trigger-btn.has-content::after {
                content: '';
                position: absolute;
                top: -2px;
                right: -2px;
                width: 10px;
                height: 10px;
                background: #FF3B30;
                border-radius: 50%;
                border: 2px solid var(--brand-bg);
            }
            /* Tooltip bilingüe manejado por data-tooltip */
            #bnotepad-trigger-btn[data-tooltip-es]::before {
                content: attr(data-tooltip-es);
            }
            #bnotepad-trigger-btn[data-tooltip-en]::before {
                content: attr(data-tooltip-en);
            }

            /* Ventana (sin cambios) */
            #bnotepad-window { ... } /* mantener mismo CSS que tenías, no lo repito por brevedad */
        `;
        document.head.appendChild(style);
    }

    // ===== CREACIÓN DE LA VENTANA (siempre igual) =====
    function createWindow() {
        if (elements.window) return;
        elements.window = document.createElement('div');
        elements.window.id = 'bnotepad-window';
        elements.window.setAttribute('role', 'dialog');
        elements.window.innerHTML = ` ... `; // mismo HTML de la ventana
        document.body.appendChild(elements.window);
        elements.textarea = elements.window.querySelector('#bnotepad-textarea');
        elements.header = elements.window.querySelector('#bnotepad-header');
        elements.downloadBtn = elements.window.querySelector('#bnotepad-download');
        elements.wordCountEl = elements.window.querySelector('#bnotepad-wordcount');
        elements.saveIndicator = elements.window.querySelector('#bnotepad-save-indicator');
        applyWindowState();
        setupWindowEvents();
    }

    // ===== COLOCACIÓN DEL BOTÓN JUNTO A LIBRARY =====
    function placeTriggerButton() {
        if (elements.trigger) elements.trigger.remove();

        // Buscar el botón/elemento de Library (por texto o clase común)
        const libraryBtn = findLibraryButton();
        if (!libraryBtn) {
            // Si no existe, observar hasta que aparezca
            if (!libraryObserver) {
                libraryObserver = new MutationObserver(() => {
                    const btn = findLibraryButton();
                    if (btn) {
                        libraryObserver.disconnect();
                        libraryObserver = null;
                        placeTriggerButton();
                    }
                });
                libraryObserver.observe(document.body, { childList: true, subtree: true });
            }
            return;
        }

        // Crear el botón
        elements.trigger = document.createElement('button');
        elements.trigger.id = 'bnotepad-trigger-btn';
        elements.trigger.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        // Tooltips bilingües
        elements.trigger.setAttribute('data-tooltip-es', 'Notas rápidas (Ctrl+Shift+N)');
        elements.trigger.setAttribute('data-tooltip-en', 'Quick Notes (Ctrl+Shift+N)');
        // Clase para el idioma actual
        updateTriggerTooltip();

        // Insertar DESPUÉS del botón de Library (o a la derecha si están en fila)
        if (libraryBtn.parentNode) {
            // Si el Library está en un contenedor flex, lo agregamos como hermano
            libraryBtn.parentNode.insertBefore(elements.trigger, libraryBtn.nextSibling);
            // Estilo para que se vean en línea
            if (libraryBtn.parentNode.style.display !== 'flex') {
                libraryBtn.parentNode.style.display = 'flex';
                libraryBtn.parentNode.style.alignItems = 'center';
            }
        }

        // Agregar badge si hay contenido
        if (state.content.trim()) elements.trigger.classList.add('has-content');

        // Evento click
        elements.trigger.addEventListener('click', toggleNotepad);
    }

    function findLibraryButton() {
        // Intentar por texto "Library" o "30 Topics" o clase conocida
        const candidates = document.querySelectorAll('button, div, a');
        for (let el of candidates) {
            if (el.textContent.includes('Library') || el.textContent.includes('30 Topics') || 
                el.classList.contains('library-trigger') || el.id === 'library-btn') {
                return el;
            }
        }
        return null;
    }

    function updateTriggerTooltip() {
        if (!elements.trigger) return;
        const isSpanish = !document.querySelector('.lang-es.hidden-lang'); // truco simple
        elements.trigger.setAttribute('title', isSpanish ? 
            elements.trigger.getAttribute('data-tooltip-es') : 
            elements.trigger.getAttribute('data-tooltip-en'));
    }

    // ===== EVENTOS DE LA VENTANA (drag, resize, etc) =====
    function setupWindowEvents() { /* igual que antes */ }
    function startDrag(e) { /* igual */ }
    function onDragMove(e) { /* igual */ }
    function onDragEnd(e) { /* igual */ }
    function handleTrafficClick(e) { /* igual */ }
    function handleToolbarClick(e) { /* igual */ }
    function handleKeyboard(e) { /* igual, añadir toggle con Ctrl+Shift+N */ }
    function downloadNote() { /* igual */ }

    // ===== CONTROL DE VISIBILIDAD =====
    function toggleNotepad() { state.isOpen ? closeNotepad() : openNotepad(); }
    function openNotepad() { /* igual, más focus */ }
    function closeNotepad() { /* igual */ }

    // ===== API PÚBLICA =====
    window.BNotepad = { open: openNotepad, close: closeNotepad, toggle: toggleNotepad, getContent: () => state.content, setContent, isOpen: () => state.isOpen };
    window.anClose = closeNotepad;
    window.anDownload = downloadNote;

    // ===== INICIALIZACIÓN =====
    function init() {
        console.log('📝 BNotepad v3.2 - modo Library');
        loadState();
        injectStyles();
        createWindow();     // la ventana siempre existe, oculta
        placeTriggerButton(); // coloca el botón junto a Library cuando esté disponible
        // Escuchar cambios de idioma para actualizar tooltip
        document.addEventListener('nclex:languageChange', updateTriggerTooltip);
        if (state.isOpen) openNotepad();
    }

    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', init);
    else init();

    window.addEventListener('beforeunload', () => { saveContent(); savePosition(); });
})();