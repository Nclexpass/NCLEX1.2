// 17_bnotepad.js — Apple Notes (VERSIÓN CORREGIDA 3.0)
// FIXED: Prevención de duplicación, cleanup de eventos, sincronización con tema

(function () {
    'use strict';

    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        STORAGE_KEY: 'nclex_apple_notes_v7',
        POS_KEY: 'nclex_apple_pos_v7',
        Z_INDEX: 9985,
        BTN_RIGHT: '24px',
        BTN_TOP: '84px', // Movido para no tapar el botón de library
        DEFAULT_WIDTH: 360,
        DEFAULT_HEIGHT: 480,
        MAX_INSTANCES: 1 // Prevenir múltiples instancias
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
        dragStartTop: 0
    };

    // ===== SINGLETON PATTERN =====
    // Prevenir múltiples inicializaciones
    if (window.__bnotepadInitialized) {
        console.log('📝 BNotepad ya inicializado, ignorando...');
        return;
    }
    window.__bnotepadInitialized = true;

    // Referencias DOM (cacheadas)
    let elements = {
        trigger: null,
        window: null,
        textarea: null,
        header: null,
        closeBtn: null,
        downloadBtn: null
    };

    // Referencias a event listeners (para cleanup)
    let eventListeners = [];

    // ===== PERSISTENCIA SEGURA =====
    
    function loadState() {
        try {
            const saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
            state.content = saved.content || '';
            state.isOpen = saved.isOpen || false;
        } catch (e) {
            console.warn('Error loading notes:', e);
            state.content = '';
            state.isOpen = false;
        }

        try {
            const pos = JSON.parse(localStorage.getItem(CONFIG.POS_KEY) || '{}');
            state.x = pos.x ?? (window.innerWidth - CONFIG.DEFAULT_WIDTH - 40);
            state.y = pos.y ?? 100;
            state.w = pos.w ?? CONFIG.DEFAULT_WIDTH;
            state.h = pos.h ?? CONFIG.DEFAULT_HEIGHT;

            // Asegurar visibilidad en viewport
            constrainToViewport();
        } catch (e) {
            console.warn('Error loading position:', e);
            resetPosition();
        }
    }

    function saveContent() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                content: state.content,
                isOpen: state.isOpen
            }));
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
        state.x = window.innerWidth - CONFIG.DEFAULT_WIDTH - 40;
        state.y = 100;
        state.w = CONFIG.DEFAULT_WIDTH;
        state.h = CONFIG.DEFAULT_HEIGHT;
    }

    function constrainToViewport() {
        const margin = 20;
        state.x = Math.max(margin, Math.min(state.x, window.innerWidth - state.w - margin));
        state.y = Math.max(margin, Math.min(state.y, window.innerHeight - state.h - margin));
    }

    // ===== UTILIDADES DE EVENTOS =====
    
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

    // ===== ESTILOS DINÁMICOS =====
    
    function injectStyles() {
        if (document.getElementById('apple-notes-style-v3')) return;

        const style = document.createElement('style');
        style.id = 'apple-notes-style-v3';
        style.textContent = `
            /* Botón flotante */
            #bnotepad-trigger-btn {
                position: fixed;
                top: ${CONFIG.BTN_TOP};
                right: ${CONFIG.BTN_RIGHT};
                width: 48px;
                height: 48px;
                border-radius: 14px;
                background: var(--brand-card, rgba(255, 255, 255, 0.9));
                border: 1px solid var(--brand-border, rgba(0, 0, 0, 0.1));
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: ${CONFIG.Z_INDEX};
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                color: var(--brand-text, #1C1C1E);
            }
            
            .dark #bnotepad-trigger-btn {
                background: var(--brand-card, rgba(28, 28, 30, 0.9));
                border-color: var(--brand-border, rgba(255, 255, 255, 0.1));
                color: var(--brand-text, #FFFFFF);
            }
            
            #bnotepad-trigger-btn:hover {
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
            
            #bnotepad-trigger-btn:active {
                transform: scale(0.95);
            }
            
            #bnotepad-trigger-btn.active {
                background: rgb(var(--brand-blue-rgb, 0, 122, 255));
                color: white;
                border-color: transparent;
            }

            /* Ventana de notas */
            #bnotepad-window {
                position: fixed;
                background: var(--brand-card, rgba(255, 255, 255, 0.95));
                backdrop-filter: blur(25px) saturate(180%);
                border: 1px solid var(--brand-border, rgba(0, 0, 0, 0.08));
                border-radius: 16px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index: ${CONFIG.Z_INDEX + 1};
                transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
                opacity: 0;
                transform: scale(0.95) translateY(10px);
                visibility: hidden;
                min-width: 280px;
                min-height: 200px;
            }
            
            .dark #bnotepad-window {
                background: var(--brand-card, rgba(28, 28, 30, 0.95));
                border-color: var(--brand-border, rgba(255, 255, 255, 0.1));
            }
            
            #bnotepad-window.visible {
                opacity: 1;
                transform: scale(1) translateY(0);
                visibility: visible;
            }

            /* Header arrastrable */
            #bnotepad-header {
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 16px;
                cursor: grab;
                user-select: none;
                background: linear-gradient(to bottom, rgba(var(--brand-blue-rgb, 0, 122, 255), 0.08), transparent);
                border-bottom: 1px solid var(--brand-border, rgba(0, 0, 0, 0.05));
            }
            
            #bnotepad-header:active {
                cursor: grabbing;
            }

            /* Botones de tráfico */
            .bnotepad-traffic { 
                display: flex; 
                gap: 8px; 
            }
            
            .bnotepad-dot { 
                width: 12px; 
                height: 12px; 
                border-radius: 50%; 
                cursor: pointer;
                transition: transform 0.15s;
                position: relative;
            }
            
            .bnotepad-dot:hover {
                transform: scale(1.1);
            }
            
            .bnotepad-dot::after {
                content: '';
                position: absolute;
                inset: -4px;
                border-radius: 50%;
            }
            
            .dot-red { background: #FF5F57; }
            .dot-yellow { background: #FEBC2E; }
            .dot-green { background: #28C840; }

            /* Área de texto */
            #bnotepad-textarea {
                flex: 1;
                width: 100%;
                background: transparent;
                border: none;
                resize: none;
                padding: 16px 20px;
                font-size: 15px;
                line-height: 1.6;
                outline: none;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                color: var(--brand-text, #1C1C1E);
                tab-size: 4;
            }
            
            .dark #bnotepad-textarea { 
                color: var(--brand-text, #E5E5E5); 
            }
            
            #bnotepad-textarea::placeholder {
                color: var(--brand-text-muted, #8E8E93);
            }

            /* Botón de descarga */
            #bnotepad-download {
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                transition: all 0.15s;
                color: var(--brand-text-muted, #8E8E93);
            }
            
            #bnotepad-download:hover {
                background: rgba(var(--brand-blue-rgb, 0, 122, 255), 0.1);
                color: rgb(var(--brand-blue-rgb, 0, 122, 255));
            }

            /* Título */
            .bnotepad-title {
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                color: var(--brand-text-muted, #8E8E93);
            }

            /* Resize handle */
            .bnotepad-resize-handle {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 20px;
                height: 20px;
                cursor: nwse-resize;
                background: linear-gradient(135deg, transparent 50%, var(--brand-text-muted, #C7C7CC) 50%);
                border-bottom-right-radius: 16px;
                opacity: 0.3;
                transition: opacity 0.15s;
            }
            
            .bnotepad-resize-handle:hover {
                opacity: 0.6;
            }

            /* Animación de notificación */
            @keyframes bnotepad-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .bnotepad-notify {
                animation: bnotepad-pulse 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== CREACIÓN DE ELEMENTOS =====
    
    function createElements() {
        // Verificar si ya existen (prevenir duplicados)
        if (elements.trigger && document.body.contains(elements.trigger)) {
            console.log('📝 Elementos ya existen, reutilizando...');
            return;
        }

        injectStyles();

        // Botón flotante
        elements.trigger = document.createElement('button');
        elements.trigger.id = 'bnotepad-trigger-btn';
        elements.trigger.setAttribute('aria-label', 'Abrir bloc de notas');
        elements.trigger.setAttribute('title', 'Quick Notes (Ctrl/Cmd + Shift + N)');
        elements.trigger.innerHTML = `
            <i class="fa-regular fa-note-sticky text-xl"></i>
        `;
        
        // Ventana
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
                <div class="bnotepad-title">Quick Notes</div>
                <button id="bnotepad-download" title="Descargar nota" aria-label="Descargar nota">
                    <i class="fa-solid fa-arrow-up-from-bracket"></i>
                </button>
            </div>
            <textarea id="bnotepad-textarea" placeholder="Escribe tus notas aquí...&#10;&#10;• Ctrl+N: Nueva nota&#10;• Ctrl+S: Guardar&#10;• Esc: Cerrar"></textarea>
            <div class="bnotepad-resize-handle"></div>
        `;

        document.body.appendChild(elements.trigger);
        document.body.appendChild(elements.window);

        // Cachear referencias internas
        elements.textarea = elements.window.querySelector('#bnotepad-textarea');
        elements.header = elements.window.querySelector('#bnotepad-header');
        elements.closeBtn = elements.window.querySelector('.dot-red');
        elements.downloadBtn = elements.window.querySelector('#bnotepad-download');

        // Aplicar posición y contenido guardado
        applyStateToElements();
        
        // Configurar eventos
        setupEvents();
    }

    function applyStateToElements() {
        if (!elements.window || !elements.textarea) return;

        elements.window.style.left = state.x + 'px';
        elements.window.style.top = state.y + 'px';
        elements.window.style.width = state.w + 'px';
        elements.window.style.height = state.h + 'px';
        elements.textarea.value = state.content;
    }

    // ===== EVENTOS =====
    
    function setupEvents() {
        // Limpiar listeners anteriores si existen
        cleanupEventListeners();

        // Botón trigger
        addEventListenerWithCleanup(elements.trigger, 'click', toggleNotepad);
        addEventListenerWithCleanup(elements.trigger, 'keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleNotepad();
            }
        });

        // Header - arrastre
        addEventListenerWithCleanup(elements.header, 'mousedown', startDrag);
        
        // Botones de tráfico (delegación de eventos)
        const trafficContainer = elements.header.querySelector('.bnotepad-traffic');
        addEventListenerWithCleanup(trafficContainer, 'click', (e) => {
            const dot = e.target.closest('.bnotepad-dot');
            if (!dot) return;
            
            const action = dot.dataset.action;
            if (action === 'close') closeNotepad();
            else if (action === 'minimize') minimizeNotepad();
            else if (action === 'maximize') maximizeNotepad();
        });

        // Botón descarga
        addEventListenerWithCleanup(elements.downloadBtn, 'click', downloadNote);

        // Textarea - guardar cambios
        let saveTimeout;
        addEventListenerWithCleanup(elements.textarea, 'input', (e) => {
            state.content = e.target.value;
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveContent, 300); // Debounce de 300ms
        });

        // Atajos de teclado
        addEventListenerWithCleanup(document, 'keydown', handleKeyboard);

        // Resize de ventana
        addEventListenerWithCleanup(window, 'resize', handleWindowResize);

        // Clic fuera para cerrar (opcional, descomentar si se desea)
        // addEventListenerWithCleanup(document, 'mousedown', (e) => {
        //     if (state.isOpen && !elements.window.contains(e.target) && !elements.trigger.contains(e.target)) {
        //         closeNotepad();
        //     }
        // });
    }

    function handleKeyboard(e) {
        // Ctrl/Cmd + Shift + N: Toggle notepad
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
            e.preventDefault();
            toggleNotepad();
        }
        
        // Esc: Cerrar si está abierto
        if (e.key === 'Escape' && state.isOpen) {
            closeNotepad();
        }
        
        // Ctrl/Cmd + S: Guardar (prevenir comportamiento por defecto)
        if ((e.ctrlKey || e.metaKey) && e.key === 's' && state.isOpen) {
            e.preventDefault();
            saveContent();
            showSaveFeedback();
        }
    }

    function showSaveFeedback() {
        const originalText = elements.downloadBtn.innerHTML;
        elements.downloadBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        elements.downloadBtn.classList.add('bnotepad-notify');
        
        setTimeout(() => {
            elements.downloadBtn.innerHTML = originalText;
            elements.downloadBtn.classList.remove('bnotepad-notify');
        }, 1000);
    }

    function handleWindowResize() {
        if (!elements.window) return;
        
        // Asegurar que la ventana siga visible
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
        // Ignorar si se hizo clic en botones
        if (e.target.closest('.bnotepad-dot') || e.target.closest('#bnotepad-download')) return;
        if (e.button !== 0) return; // Solo clic izquierdo
        
        e.preventDefault();

        state.isDragging = true;
        state.dragStartX = e.clientX;
        state.dragStartY = e.clientY;
        state.dragStartLeft = elements.window.offsetLeft;
        state.dragStartTop = elements.window.offsetTop;

        // Agregar listeners temporales
        document.addEventListener('mousemove', onDragMove, { passive: false });
        document.addEventListener('mouseup', onDragEnd);
    }

    function onDragMove(e) {
        if (!state.isDragging) return;
        e.preventDefault();

        let newLeft = state.dragStartLeft + (e.clientX - state.dragStartX);
        let newTop = state.dragStartTop + (e.clientY - state.dragStartY);

        // Limitar al viewport
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
        
        // Cancelar cierre pendiente
        if (state.closeTimeout) {
            clearTimeout(state.closeTimeout);
            state.closeTimeout = null;
        }
        
        elements.window.classList.add('visible');
        elements.trigger.classList.add('active');
        state.isOpen = true;
        saveContent();
        
        // Enfocar textarea
        setTimeout(() => {
            elements.textarea?.focus();
            elements.textarea?.setSelectionRange(
                elements.textarea.value.length, 
                elements.textarea.value.length
            );
        }, 50);
    }

    function closeNotepad() {
        if (!elements.window) return;
        
        elements.window.classList.remove('visible');
        elements.trigger.classList.remove('active');
        
        // Delay para animación
        state.closeTimeout = setTimeout(() => {
            state.closeTimeout = null;
        }, 200);
        
        state.isOpen = false;
        saveContent();
    }

    function minimizeNotepad() {
        // Por ahora, mismo comportamiento que cerrar
        closeNotepad();
    }

    function maximizeNotepad() {
        if (!elements.window) return;
        
        const isMaximized = elements.window.style.width === '100vw';
        
        if (isMaximized) {
            // Restaurar
            applyStateToElements();
        } else {
            // Maximizar
            elements.window.style.left = '0';
            elements.window.style.top = '0';
            elements.window.style.width = '100vw';
            elements.window.style.height = '100vh';
        }
    }

    // ===== DESCARGA =====
    
    function downloadNote() {
        const content = elements.textarea?.value || state.content || '';
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
            saveContent();
        },
        isOpen: () => state.isOpen
    };

    // Compatibilidad legacy
    window.anClose = closeNotepad;
    window.anDownload = downloadNote;

    // ===== INICIALIZACIÓN =====
    
    function init() {
        console.log('📝 BNotepad v3.0 initializing...');
        
        loadState();
        createElements();
        
        // Restaurar estado
        if (state.isOpen) {
            openNotepad();
        }
        
        console.log('✅ BNotepad initialized');
    }

    // Punto de entrada
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup al cerrar página
    window.addEventListener('beforeunload', () => {
        saveContent();
        savePosition();
    });

})();