// 17_bnotepad.js — Apple Notes (VERSIÓN MEJORADA 3.1)
// MEJORAS: Botón integrado en el sidebar junto a Library, diseño NCLEX, funcionalidad mejorada

(function () {
    'use strict';

    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        STORAGE_KEY: 'nclex_apple_notes_v8',
        POS_KEY: 'nclex_apple_pos_v8',
        Z_INDEX: 9985,
        DEFAULT_WIDTH: 380,
        DEFAULT_HEIGHT: 520,
        MAX_INSTANCES: 1,
        OFFSET_FROM_LIBRARY: 60
    };

    // ===== ESTADO =====
    const state = {
        isOpen: false,
        content: '',
        x: 0,
        y: 0,
        w: CONFIG.DEFAULT_WIDTH,
        h: CONFIG.DEFAULT_HEIGHT,
        closeTimeout: null,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        dragStartLeft: 0,
        dragStartTop: 0,
        wordCount: 0,
        lastSaved: null
    };

    // ===== SINGLETON PATTERN =====
    if (window.__bnotepadInitialized) {
        console.log('📝 BNotepad ya inicializado, ignorando...');
        return;
    }
    window.__bnotepadInitialized = true;

    let elements = {
        trigger: null,
        window: null,
        textarea: null,
        header: null,
        closeBtn: null,
        downloadBtn: null,
        wordCountEl: null,
        saveIndicator: null
    };

    let eventListeners = [];

    // ===== PERSISTENCIA SEGURA =====
    
    function loadState() {
        try {
            const saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
            state.content = saved.content || '';
            state.isOpen = saved.isOpen || false;
            state.lastSaved = saved.lastSaved || null;
        } catch (e) {
            console.warn('Error loading notes:', e);
            state.content = '';
            state.isOpen = false;
        }

        try {
            const pos = JSON.parse(localStorage.getItem(CONFIG.POS_KEY) || '{}');
            state.x = pos.x ?? calculateInitialX();
            state.y = pos.y ?? 100;
            state.w = pos.w ?? CONFIG.DEFAULT_WIDTH;
            state.h = pos.h ?? CONFIG.DEFAULT_HEIGHT;
            constrainToViewport();
        } catch (e) {
            console.warn('Error loading position:', e);
            resetPosition();
        }
    }

    function calculateInitialX() {
        const libraryBtn = document.querySelector('[data-route="library"], #library-btn, .library-trigger');
        if (libraryBtn) {
            const rect = libraryBtn.getBoundingClientRect();
            return rect.right + CONFIG.OFFSET_FROM_LIBRARY;
        }
        return window.innerWidth - CONFIG.DEFAULT_WIDTH - 280;
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
        } catch (e) {
            console.warn('Error saving notes:', e);
        }
    }

    function savePosition() {
        if (!elements.window) return;
        try {
            const rect = elements.window.getBoundingClientRect();
            state.x = rect.left;
            state.y = rect.top;
            state.w = rect.width;
            state.h = rect.height;
            localStorage.setItem(CONFIG.POS_KEY, JSON.stringify({
                x: state.x, y: state.y, w: state.w, h: state.h
            }));
        } catch (e) {
            console.warn('Error saving position:', e);
        }
    }

    function resetPosition() {
        state.x = calculateInitialX();
        state.y = 100;
        state.w = CONFIG.DEFAULT_WIDTH;
        state.h = CONFIG.DEFAULT_HEIGHT;
    }

    function constrainToViewport() {
        const margin = 20;
        state.x = Math.max(margin, Math.min(state.x, window.innerWidth - state.w - margin));
        state.y = Math.max(margin, Math.min(state.y, window.innerHeight - state.h - margin));
    }

    // ===== UTILIDADES =====
    
    function addEventListenerWithCleanup(element, event, handler, options) {
        element.addEventListener(event, handler, options);
        eventListeners.push({ element, event, handler });
    }

    function cleanupEventListeners() {
        eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        eventListeners = [];
    }

    function updateWordCount() {
        const text = state.content || '';
        state.wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        if (elements.wordCountEl) {
            elements.wordCountEl.textContent = `${state.wordCount} words`;
        }
    }

    function updateSaveIndicator() {
        if (!elements.saveIndicator) return;
        if (state.lastSaved) {
            const date = new Date(state.lastSaved);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            elements.saveIndicator.textContent = `Saved at ${timeStr}`;
            elements.saveIndicator.style.opacity = '1';
        }
    }

    // ===== ESTILOS DINÁMICOS (modificados: botón sidebar, no fixed) =====
    
    function injectStyles() {
        if (document.getElementById('apple-notes-style-v4')) return;

        const style = document.createElement('style');
        style.id = 'apple-notes-style-v4';
        style.textContent = `
            /* Botón de notas en el sidebar - Estilo NCLEX Essentials */
            #bnotepad-trigger-btn {
                width: 100%;
                padding: 0.75rem 1rem;
                border-radius: 0.75rem;
                background: linear-gradient(135deg, 
                    rgba(var(--brand-blue-rgb, 0, 122, 255), 0.1), 
                    rgba(var(--brand-blue-rgb, 0, 122, 255), 0.05));
                border: 1px solid var(--brand-border);
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 0.75rem;
                color: var(--brand-text);
                font-size: 0.875rem;
                font-weight: 600;
                transition: all 0.2s ease;
                cursor: pointer;
                position: relative;
            }
            
            #bnotepad-trigger-btn i {
                width: 1.5rem;
                text-align: center;
                color: rgb(var(--brand-blue-rgb));
                font-size: 1.125rem;
            }
            
            #bnotepad-trigger-btn:hover {
                background: rgba(var(--brand-blue-rgb), 0.15);
                border-color: rgb(var(--brand-blue-rgb));
            }
            
            .dark #bnotepad-trigger-btn {
                background: rgba(var(--brand-blue-rgb), 0.15);
                border-color: var(--brand-border);
            }
            
            .dark #bnotepad-trigger-btn:hover {
                background: rgba(var(--brand-blue-rgb), 0.25);
            }
            
            #bnotepad-trigger-btn.active {
                background: rgba(var(--brand-blue-rgb), 0.2);
                color: rgb(var(--brand-blue-rgb));
            }
            
            /* Badge de notificación */
            #bnotepad-trigger-btn::after {
                content: '';
                position: absolute;
                top: -2px;
                right: -2px;
                width: 12px;
                height: 12px;
                background: #FF3B30;
                border-radius: 50%;
                border: 2px solid var(--brand-bg);
                opacity: 0;
                transform: scale(0);
                transition: all 0.3s ease;
            }
            
            #bnotepad-trigger-btn.has-content::after {
                opacity: 1;
                transform: scale(1);
            }

            /* Ventana de notas - Estilo NCLEX (sin cambios) */
            #bnotepad-window {
                position: fixed;
                background: var(--brand-card, rgba(255, 255, 255, 0.98));
                backdrop-filter: blur(30px) saturate(200%);
                border: 1px solid var(--brand-border, rgba(0, 0, 0, 0.08));
                border-radius: 20px;
                box-shadow: 
                    0 25px 50px -12px rgba(0, 0, 0, 0.25),
                    0 0 0 1px rgba(0, 0, 0, 0.02);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index: ${CONFIG.Z_INDEX + 1};
                transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
                            transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
                            visibility 0.25s;
                opacity: 0;
                transform: scale(0.9) translateY(20px);
                visibility: hidden;
                min-width: 320px;
                min-height: 240px;
            }
            
            .dark #bnotepad-window {
                background: var(--brand-card, rgba(28, 28, 30, 0.98));
                border-color: var(--brand-border, rgba(255, 255, 255, 0.1));
                box-shadow: 
                    0 25px 50px -12px rgba(0, 0, 0, 0.5),
                    0 0 0 1px rgba(255, 255, 255, 0.05);
            }
            
            #bnotepad-window.visible {
                opacity: 1;
                transform: scale(1) translateY(0);
                visibility: visible;
            }

            /* Header arrastrable */
            #bnotepad-header {
                height: 52px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
                cursor: grab;
                user-select: none;
                background: linear-gradient(180deg, 
                    rgba(var(--brand-blue-rgb, 0, 122, 255), 0.08) 0%, 
                    transparent 100%
                );
                border-bottom: 1px solid var(--brand-border, rgba(0, 0, 0, 0.06));
            }
            
            #bnotepad-header:active {
                cursor: grabbing;
            }

            /* Botones de tráfico estilo macOS */
            .bnotepad-traffic { display: flex; gap: 10px; }
            .bnotepad-dot { 
                width: 14px; height: 14px; border-radius: 50%; cursor: pointer;
                transition: all 0.2s ease; position: relative;
                box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.1);
            }
            .bnotepad-dot:hover { transform: scale(1.15); }
            .bnotepad-dot::before {
                content: ''; position: absolute; inset: 0; border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent);
            }
            .dot-red { background: #FF5F57; }
            .dot-yellow { background: #FEBC2E; }
            .dot-green { background: #28C840; }

            .bnotepad-header-center {
                position: absolute; left: 50%; transform: translateX(-50%);
                display: flex; flex-direction: column; align-items: center; gap: 2px;
            }
            .bnotepad-title {
                font-size: 13px; font-weight: 700; color: var(--brand-text, #1C1C1E);
                letter-spacing: -0.01em;
            }
            .bnotepad-subtitle {
                font-size: 10px; font-weight: 500; color: var(--brand-text-muted, #8E8E93);
                text-transform: uppercase; letter-spacing: 0.05em;
            }

            .bnotepad-header-actions { display: flex; gap: 8px; align-items: center; }

            #bnotepad-download {
                width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
                border-radius: 8px; transition: all 0.2s ease;
                color: var(--brand-text-muted, #8E8E93); background: transparent; border: none;
                cursor: pointer; font-size: 14px;
            }
            #bnotepad-download:hover {
                background: rgba(var(--brand-blue-rgb, 0, 122, 255), 0.1);
                color: rgb(var(--brand-blue-rgb, 0, 122, 255)); transform: translateY(-1px);
            }

            #bnotepad-toolbar {
                display: flex; gap: 4px; padding: 8px 16px;
                border-bottom: 1px solid var(--brand-border, rgba(0, 0, 0, 0.06));
                background: rgba(var(--brand-blue-rgb, 0, 122, 255), 0.02);
            }
            .bnotepad-tool-btn {
                width: 32px; height: 32px; border-radius: 8px; border: none;
                background: transparent; color: var(--brand-text-muted, #8E8E93);
                cursor: pointer; transition: all 0.15s ease;
                display: flex; align-items: center; justify-content: center; font-size: 14px;
            }
            .bnotepad-tool-btn:hover {
                background: rgba(var(--brand-blue-rgb, 0, 122, 255), 0.1);
                color: rgb(var(--brand-blue-rgb, 0, 122, 255));
            }

            #bnotepad-textarea {
                flex: 1; width: 100%; background: transparent; border: none; resize: none;
                padding: 20px; font-size: 15px; line-height: 1.7; outline: none;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
                color: var(--brand-text, #1C1C1E); tab-size: 4; letter-spacing: -0.01em;
            }
            .dark #bnotepad-textarea { color: var(--brand-text, #E5E5E5); }
            #bnotepad-textarea::placeholder {
                color: var(--brand-text-muted, #8E8E93); font-style: italic;
            }

            #bnotepad-footer {
                height: 36px; display: flex; align-items: center; justify-content: space-between;
                padding: 0 20px; border-top: 1px solid var(--brand-border, rgba(0, 0, 0, 0.06));
                background: rgba(var(--brand-blue-rgb, 0, 122, 255), 0.02);
                font-size: 11px; color: var(--brand-text-muted, #8E8E93); font-weight: 500;
            }
            
            #bnotepad-wordcount { text-transform: uppercase; letter-spacing: 0.03em; }
            
            #bnotepad-save-indicator {
                display: flex; align-items: center; gap: 6px; opacity: 0; transition: opacity 0.3s ease;
            }
            #bnotepad-save-indicator::before {
                content: '✓'; font-size: 10px; width: 14px; height: 14px;
                background: #34C759; color: white; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
            }

            .bnotepad-resize-handle {
                position: absolute; bottom: 0; right: 0; width: 24px; height: 24px;
                cursor: nwse-resize; background: linear-gradient(135deg, 
                    transparent 45%, var(--brand-text-muted, #C7C7CC) 45%,
                    var(--brand-text-muted, #C7C7CC) 55%, transparent 55%);
                border-bottom-right-radius: 20px; opacity: 0.2; transition: opacity 0.2s;
            }
            .bnotepad-resize-handle:hover { opacity: 0.5; }

            @keyframes bnotepad-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
            .bnotepad-notify { animation: bnotepad-pulse 0.4s ease; }
        `;
        document.head.appendChild(style);
    }

    // ===== CREACIÓN DE ELEMENTOS (modificada: botón en sidebar) =====
    
    function createElements() {
        if (elements.trigger && document.body.contains(elements.trigger)) return;

        injectStyles();

        // Botón flotante reemplazado por botón de sidebar
        elements.trigger = document.createElement('button');
        elements.trigger.id = 'bnotepad-trigger-btn';
        elements.trigger.setAttribute('aria-label', 'Abrir bloc de notas');
        elements.trigger.setAttribute('title', 'Quick Notes (Ctrl+Shift+N)');
        elements.trigger.innerHTML = `
            <i class="fa-solid fa-pen-to-square"></i>
            <span class="lang-es">Quick Notes</span>
            <span class="lang-en hidden-lang">Quick Notes</span>
        `;
        
        // Insertar en el contenedor del sidebar
        const container = document.getElementById('bnotepad-sidebar-trigger-container');
        if (container) {
            container.appendChild(elements.trigger);
        } else {
            // Fallback: sidebar al final
            document.querySelector('#main-sidebar')?.appendChild(elements.trigger);
        }

        // Ventana (sin cambios)
        elements.window = document.createElement('div');
        elements.window.id = 'bnotepad-window';
        elements.window.setAttribute('role', 'dialog');
        elements.window.setAttribute('aria-label', 'Bloc de notas');
        elements.window.innerHTML = `
            <div id="bnotepad-header">
                <div class="bnotepad-traffic">
                    <div class="bnotepad-dot dot-red" data-action="close" title="Cerrar" role="button" tabindex="0" aria-label="Cerrar"></div>
                    <div class="bnotepad-dot dot-yellow" data-action="minimize" title="Minimizar" role="button" tabindex="0" aria-label="Minimizar"></div>
                    <div class="bnotepad-dot dot-green" data-action="maximize" title="Maximizar" role="button" tabindex="0" aria-label="Maximizar"></div>
                </div>
                <div class="bnotepad-header-center">
                    <div class="bnotepad-title">Quick Notes</div>
                    <div class="bnotepad-subtitle">NCLEX Essentials</div>
                </div>
                <div class="bnotepad-header-actions">
                    <button id="bnotepad-download" title="Descargar nota" aria-label="Descargar nota">
                        <i class="fa-solid fa-download"></i>
                    </button>
                </div>
            </div>
            
            <div id="bnotepad-toolbar">
                <button class="bnotepad-tool-btn" data-cmd="bold" title="Negrita (Ctrl+B)">
                    <i class="fa-solid fa-bold"></i>
                </button>
                <button class="bnotepad-tool-btn" data-cmd="italic" title="Cursiva (Ctrl+I)">
                    <i class="fa-solid fa-italic"></i>
                </button>
                <button class="bnotepad-tool-btn" data-cmd="insertUnorderedList" title="Lista">
                    <i class="fa-solid fa-list-ul"></i>
                </button>
                <div style="width: 1px; height: 20px; background: var(--brand-border); margin: 6px 4px;"></div>
                <button class="bnotepad-tool-btn" data-action="clear" title="Limpiar nota">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
            
            <textarea id="bnotepad-textarea" placeholder="Escribe tus apuntes de estudio aquí..."></textarea>
            
            <div id="bnotepad-footer">
                <span id="bnotepad-wordcount">0 words</span>
                <span id="bnotepad-save-indicator">Saved</span>
            </div>
            
            <div class="bnotepad-resize-handle"></div>
        `;

        document.body.appendChild(elements.window);

        // Cachear referencias
        elements.textarea = elements.window.querySelector('#bnotepad-textarea');
        elements.header = elements.window.querySelector('#bnotepad-header');
        elements.closeBtn = elements.window.querySelector('.dot-red');
        elements.downloadBtn = elements.window.querySelector('#bnotepad-download');
        elements.wordCountEl = elements.window.querySelector('#bnotepad-wordcount');
        elements.saveIndicator = elements.window.querySelector('#bnotepad-save-indicator');

        applyStateToElements();
        setupEvents();
        updateWordCount();
    }

    function applyStateToElements() {
        if (!elements.window || !elements.textarea) return;

        elements.window.style.left = state.x + 'px';
        elements.window.style.top = state.y + 'px';
        elements.window.style.width = state.w + 'px';
        elements.window.style.height = state.h + 'px';
        elements.textarea.value = state.content;
        
        if (state.content.trim()) {
            elements.trigger?.classList.add('has-content');
        }
    }

    // ===== EVENTOS (sin cambios relevantes) =====
    
    function setupEvents() {
        cleanupEventListeners();

        addEventListenerWithCleanup(elements.trigger, 'click', toggleNotepad);
        addEventListenerWithCleanup(elements.header, 'mousedown', startDrag);
        
        const trafficContainer = elements.header.querySelector('.bnotepad-traffic');
        addEventListenerWithCleanup(trafficContainer, 'click', handleTrafficClick);

        const toolbar = elements.window.querySelector('#bnotepad-toolbar');
        addEventListenerWithCleanup(toolbar, 'click', handleToolbarClick);

        addEventListenerWithCleanup(elements.downloadBtn, 'click', downloadNote);

        let saveTimeout;
        addEventListenerWithCleanup(elements.textarea, 'input', (e) => {
            state.content = e.target.value;
            updateWordCount();
            
            if (state.content.trim()) {
                elements.trigger?.classList.add('has-content');
            } else {
                elements.trigger?.classList.remove('has-content');
            }
            
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveContent, 500);
        });

        addEventListenerWithCleanup(document, 'keydown', handleKeyboard);
        addEventListenerWithCleanup(window, 'resize', handleWindowResize);
    }

    function handleTrafficClick(e) {
        const dot = e.target.closest('.bnotepad-dot');
        if (!dot) return;
        
        const action = dot.dataset.action;
        if (action === 'close') closeNotepad();
        else if (action === 'minimize') minimizeNotepad();
        else if (action === 'maximize') maximizeNotepad();
    }

    function handleToolbarClick(e) {
        const btn = e.target.closest('.bnotepad-tool-btn');
        if (!btn) return;
        
        const cmd = btn.dataset.cmd;
        const action = btn.dataset.action;
        
        if (cmd) {
            document.execCommand(cmd, false, null);
            elements.textarea.focus();
        } else if (action === 'clear') {
            if (confirm('¿Limpiar todas las notas?')) {
                state.content = '';
                elements.textarea.value = '';
                updateWordCount();
                saveContent();
                elements.trigger?.classList.remove('has-content');
            }
        }
    }

    function handleKeyboard(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
            e.preventDefault();
            toggleNotepad();
        }
        if (e.key === 'Escape' && state.isOpen) {
            closeNotepad();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 's' && state.isOpen) {
            e.preventDefault();
            saveContent();
            showSaveFeedback();
        }
    }

    function showSaveFeedback() {
        if (!elements.downloadBtn) return;
        const originalHTML = elements.downloadBtn.innerHTML;
        elements.downloadBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        elements.downloadBtn.style.color = '#34C759';
        
        setTimeout(() => {
            elements.downloadBtn.innerHTML = originalHTML;
            elements.downloadBtn.style.color = '';
        }, 1000);
    }

    function handleWindowResize() {
        if (!elements.window) return;
        const rect = elements.window.getBoundingClientRect();
        let needsUpdate = false;
        
        if (rect.right > window.innerWidth) {
            state.x = window.innerWidth - state.w - 20;
            needsUpdate = true;
        }
        if (rect.bottom > window.innerHeight) {
            state.y = window.innerHeight - state.h - 20;
            needsUpdate = true;
        }
        
        if (needsUpdate) {
            applyStateToElements();
            savePosition();
        }
    }

    // ===== ARRASTRE =====
    
    function startDrag(e) {
        if (e.target.closest('.bnotepad-dot') || 
            e.target.closest('#bnotepad-download') ||
            e.target.closest('.bnotepad-header-actions')) return;
        if (e.button !== 0) return;
        
        e.preventDefault();
        state.isDragging = true;
        state.dragStartX = e.clientX;
        state.dragStartY = e.clientY;
        state.dragStartLeft = elements.window.offsetLeft;
        state.dragStartTop = elements.window.offsetTop;

        document.addEventListener('mousemove', onDragMove, { passive: false });
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
        savePosition();
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
    }

    // ===== CONTROL DE VISIBILIDAD =====
    
    function toggleNotepad() {
        state.isOpen ? closeNotepad() : openNotepad();
    }

    function openNotepad() {
        if (!elements.window) return;
        
        if (state.closeTimeout) {
            clearTimeout(state.closeTimeout);
            state.closeTimeout = null;
        }
        
        elements.window.classList.add('visible');
        elements.trigger.classList.add('active');
        state.isOpen = true;
        saveContent();
        
        setTimeout(() => {
            elements.textarea?.focus();
            const len = elements.textarea?.value.length || 0;
            elements.textarea?.setSelectionRange(len, len);
        }, 50);
    }

    function closeNotepad() {
        if (!elements.window) return;
        
        elements.window.classList.remove('visible');
        elements.trigger.classList.remove('active');
        
        state.closeTimeout = setTimeout(() => {
            state.closeTimeout = null;
        }, 250);
        
        state.isOpen = false;
        saveContent();
    }

    function minimizeNotepad() {
        closeNotepad();
    }

    function maximizeNotepad() {
        if (!elements.window) return;
        const isMaximized = elements.window.style.width === '100vw';
        
        if (isMaximized) {
            applyStateToElements();
        } else {
            elements.window.style.left = '10px';
            elements.window.style.top = '10px';
            elements.window.style.width = 'calc(100vw - 20px)';
            elements.window.style.height = 'calc(100vh - 20px)';
        }
    }

    // ===== DESCARGA =====
    
    function downloadNote() {
        const content = elements.textarea?.value || state.content || '';
        if (!content.trim()) {
            alert('No hay contenido para descargar');
            return;
        }
        
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `NCLEX_Notes_${timestamp}.txt`;
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        showSaveFeedback();
    }

    // ===== API PÚBLICA =====
    
    window.BNotepad = {
        open: openNotepad,
        close: closeNotepad,
        toggle: toggleNotepad,
        getContent: () => state.content,
        setContent: (text) => {
            state.content = text;
            if (elements.textarea) elements.textarea.value = text;
            updateWordCount();
            saveContent();
        },
        isOpen: () => state.isOpen
    };

    window.anClose = closeNotepad;
    window.anDownload = downloadNote;

    // ===== INICIALIZACIÓN =====
    
    function init() {
        console.log('📝 BNotepad v3.1 (sidebar) initializing...');
        
        loadState();
        createElements();
        
        if (state.isOpen) openNotepad();
        
        console.log('✅ BNotepad initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('beforeunload', () => {
        saveContent();
        savePosition();
    });

})();