// 17_bnotepad.js — Apple Notes (Mejorado: robusto, accesible, sin conflictos)
(function () {
    'use strict';

    const CONFIG = {
        STORAGE_KEY: 'nclex_apple_notes_v6',
        POS_KEY: 'nclex_apple_pos_v6',
        Z_INDEX: 9995,
        BTN_RIGHT: '84px',
        BTN_TOP: '24px',
        DEFAULT_WIDTH: 360,
        DEFAULT_HEIGHT: 480
    };

    // Estado interno (no accesible globalmente)
    const state = {
        isOpen: false,
        content: '',
        x: 0,
        y: 0,
        w: CONFIG.DEFAULT_WIDTH,
        h: CONFIG.DEFAULT_HEIGHT,
        closeTimeout: null
    };

    // Referencias DOM
    let triggerEl = null;
    let winEl = null;
    let textareaEl = null;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let dragStartLeft = 0, dragStartTop = 0;

    // --- Persistencia ---
    function loadState() {
        try {
            const saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
            state.content = saved.content || '';
            state.isOpen = saved.isOpen || false;
        } catch (e) {}

        try {
            const pos = JSON.parse(localStorage.getItem(CONFIG.POS_KEY) || '{}');
            state.x = pos.x ?? (window.innerWidth - CONFIG.DEFAULT_WIDTH - 40);
            state.y = pos.y ?? 90;
            state.w = pos.w ?? CONFIG.DEFAULT_WIDTH;
            state.h = pos.h ?? CONFIG.DEFAULT_HEIGHT;

            // Asegurar que la posición esté dentro de la ventana visible
            state.x = Math.max(0, Math.min(state.x, window.innerWidth - state.w - 20));
            state.y = Math.max(0, Math.min(state.y, window.innerHeight - state.h - 20));
        } catch (e) {}
    }

    function saveContent() {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
            content: state.content,
            isOpen: state.isOpen
        }));
    }

    function savePosition() {
        if (!winEl) return;
        const rect = winEl.getBoundingClientRect();
        state.x = rect.left;
        state.y = rect.top;
        state.w = rect.width;
        state.h = rect.height;
        localStorage.setItem(CONFIG.POS_KEY, JSON.stringify({
            x: state.x, y: state.y, w: state.w, h: state.h
        }));
    }

    // --- UI y estilos ---
    function injectStyles() {
        if (document.getElementById('apple-notes-style')) return;
        const style = document.createElement('style');
        style.id = 'apple-notes-style';
        style.textContent = `
            .an-trigger-btn {
                position: fixed; width: 48px; height: 48px; border-radius: 16px;
                background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(255, 255, 255, 0.4);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); backdrop-filter: blur(10px);
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; z-index: ${CONFIG.Z_INDEX}; transition: all 0.2s ease;
                color: #1C1C1E;
            }
            .dark .an-trigger-btn {
                background: rgba(30, 30, 30, 0.6); border-color: rgba(255,255,255,0.1);
                color: white;
            }
            .an-trigger-btn:hover {
                transform: translateY(-2px); background: rgba(255, 255, 255, 0.9);
                box-shadow: 0 8px 15px rgba(0,0,0,0.1);
            }
            .an-window {
                position: fixed; background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(25px) saturate(180%);
                border: 1px solid rgba(0, 0, 0, 0.05); border-radius: 14px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                display: flex; flex-direction: column; overflow: hidden;
                z-index: ${CONFIG.Z_INDEX}; transition: opacity 0.2s, transform 0.2s;
                opacity: 0; transform: scale(0.95);
                pointer-events: none; /* se activa cuando visible */
            }
            .dark .an-window {
                background: rgba(40, 40, 40, 0.85); border-color: rgba(255,255,255,0.1);
                color: white;
            }
            .an-window.visible {
                opacity: 1; transform: scale(1);
                pointer-events: auto;
            }
            .an-header {
                height: 48px; display: flex; align-items: center;
                justify-content: space-between; padding: 0 16px;
                cursor: move; user-select: none;
            }
            .an-traffic { display: flex; gap: 8px; }
            .an-dot { width: 12px; height: 12px; border-radius: 50%; cursor: pointer; }
            .dot-red { background: #FF5F57; }
            .dot-yellow { background: #FEBC2E; }
            .dot-green { background: #28C840; }
            .an-textarea {
                flex: 1; width: 100%; background: transparent; border: none;
                resize: none; padding: 10px 20px; font-size: 17px; outline: none;
                font-family: inherit;
            }
            .dark .an-textarea { color: #E5E5E5; }
        `;
        document.head.appendChild(style);
    }

    function createElements() {
        if (triggerEl && winEl) return;

        injectStyles();

        // Botón flotante
        triggerEl = document.createElement('div');
        triggerEl.id = 'apple-notes-trigger';
        triggerEl.className = 'an-trigger-btn';
        triggerEl.style.top = CONFIG.BTN_TOP;
        triggerEl.style.right = CONFIG.BTN_RIGHT;
        triggerEl.setAttribute('aria-label', 'Abrir bloc de notas');
        triggerEl.setAttribute('role', 'button');
        triggerEl.setAttribute('tabindex', '0');
        triggerEl.innerHTML = `<i class="fa-regular fa-note-sticky text-yellow-500 text-xl" aria-hidden="true"></i>`;
        triggerEl.addEventListener('click', toggleNotepad);
        triggerEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleNotepad();
            }
        });

        // Ventana
        winEl = document.createElement('div');
        winEl.id = 'apple-notes-window';
        winEl.className = 'an-window';
        winEl.innerHTML = `
            <div class="an-header" id="an-header">
                <div class="an-traffic">
                    <div class="an-dot dot-red" aria-label="Cerrar" role="button" tabindex="0"></div>
                    <div class="an-dot dot-yellow" aria-label="Minimizar" role="button" tabindex="0"></div>
                    <div class="an-dot dot-green" aria-label="Maximizar" role="button" tabindex="0"></div>
                </div>
                <div class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Quick Notes</div>
                <div class="text-yellow-500 cursor-pointer" id="an-download" aria-label="Descargar nota" role="button" tabindex="0">
                    <i class="fa-solid fa-arrow-up-from-bracket" aria-hidden="true"></i>
                </div>
            </div>
            <textarea id="an-textarea" class="an-textarea" placeholder="Start writing..."></textarea>
        `;

        // Aplicar posición y tamaño iniciales
        winEl.style.left = state.x + 'px';
        winEl.style.top = state.y + 'px';
        winEl.style.width = state.w + 'px';
        winEl.style.height = state.h + 'px';

        document.body.appendChild(triggerEl);
        document.body.appendChild(winEl);

        textareaEl = winEl.querySelector('#an-textarea');
        textareaEl.value = state.content;

        // Eventos internos
        setupEvents();
    }

    // --- Eventos ---
    function setupEvents() {
        // Header: arrastre
        const header = winEl.querySelector('#an-header');
        header.addEventListener('mousedown', startDrag);
        // Para evitar que el foco del textarea active el arrastre accidentalmente
        header.addEventListener('dragstart', (e) => e.preventDefault());

        // Botones de tráfico
        const redDot = winEl.querySelector('.dot-red');
        redDot.addEventListener('click', closeNotepad);
        redDot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeNotepad();
            }
        });

        // Botón de descarga
        const downloadBtn = winEl.querySelector('#an-download');
        downloadBtn.addEventListener('click', downloadNote);
        downloadBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                downloadNote();
            }
        });

        // Textarea: guardar cambios
        textareaEl.addEventListener('input', (e) => {
            state.content = e.target.value;
            saveContent();
        });

        // Al redimensionar la ventana, ajustar posición si está fuera
        window.addEventListener('resize', () => {
            if (!winEl) return;
            const rect = winEl.getBoundingClientRect();
            let newX = rect.left;
            let newY = rect.top;
            let changed = false;
            if (rect.right > window.innerWidth) {
                newX = window.innerWidth - rect.width - 20;
                changed = true;
            }
            if (rect.bottom > window.innerHeight) {
                newY = window.innerHeight - rect.height - 20;
                changed = true;
            }
            if (rect.left < 0) {
                newX = 20;
                changed = true;
            }
            if (rect.top < 0) {
                newY = 20;
                changed = true;
            }
            if (changed) {
                winEl.style.left = newX + 'px';
                winEl.style.top = newY + 'px';
                savePosition();
            }
        });
    }

    // --- Arrastre con addEventListener y limpieza ---
    function startDrag(e) {
        // No iniciar si se hizo clic en los botones de tráfico o descarga
        if (e.target.closest('.an-traffic') || e.target.closest('#an-download')) return;
        e.preventDefault();

        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragStartLeft = winEl.offsetLeft;
        dragStartTop = winEl.offsetTop;

        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
    }

    function onDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        let newLeft = dragStartLeft + (e.clientX - dragStartX);
        let newTop = dragStartTop + (e.clientY - dragStartY);

        // Limitar dentro de la ventana (con margen)
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - winEl.offsetWidth - 20));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - winEl.offsetHeight - 20));

        winEl.style.left = newLeft + 'px';
        winEl.style.top = newTop + 'px';
    }

    function onDragEnd() {
        if (isDragging) {
            isDragging = false;
            savePosition();
        }
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
    }

    // --- Control de visibilidad ---
    function toggleNotepad() {
        if (state.isOpen) {
            closeNotepad();
        } else {
            openNotepad();
        }
    }

    function openNotepad() {
        if (!winEl) return;
        // Cancelar cualquier cierre pendiente
        if (state.closeTimeout) {
            clearTimeout(state.closeTimeout);
            state.closeTimeout = null;
        }
        winEl.classList.add('visible');
        winEl.classList.remove('hidden'); // por si acaso
        state.isOpen = true;
        saveContent(); // persistir estado abierto
        triggerEl?.setAttribute('aria-label', 'Cerrar bloc de notas');
        // Enfocar textarea para escritura inmediata
        setTimeout(() => textareaEl?.focus(), 50);
    }

    function closeNotepad() {
        if (!winEl) return;
        winEl.classList.remove('visible');
        // Esperar animación antes de ocultar con hidden (para no bloquear interacción)
        state.closeTimeout = setTimeout(() => {
            winEl.classList.add('hidden');
            state.closeTimeout = null;
        }, 200);
        state.isOpen = false;
        saveContent();
        triggerEl?.setAttribute('aria-label', 'Abrir bloc de notas');
    }

    // --- Descarga ---
    function downloadNote() {
        const content = textareaEl?.value || state.content || '';
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'NCLEX_Notes.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- Inicialización ---
    function init() {
        loadState();
        createElements();

        // Restaurar visibilidad según estado guardado
        if (state.isOpen) {
            openNotepad();
        } else {
            // Asegurar que la ventana esté oculta pero con posición correcta
            winEl.classList.add('hidden');
            winEl.classList.remove('visible');
        }

        // Exponer API mínima si es necesario (opcional, pero mejor evitarlo)
        // Para compatibilidad con código legacy que espera window.anClose / window.anDownload
        window.anClose = closeNotepad;
        window.anDownload = downloadNote;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();