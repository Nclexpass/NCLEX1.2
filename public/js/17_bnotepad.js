// 17_bnotepad.js — Apple Notes Style (Pixel Perfect Match with Library)
// Dimensions: 48x48px | Radius: 16px | Gap: 12px
// Features: Draggable, Resizable, Auto-save, Export to .txt

(function () {
  'use strict';

  const CONFIG = {
    STORAGE_KEY: 'nclex_apple_notes_v4',
    POS_KEY: 'nclex_apple_pos_v4',
    Z_INDEX: 9995,
    // CÁLCULO DE POSICIÓN PERFECTA:
    // Right = 24px (Margen derecho) + 48px (Botón Library) + 12px (Espacio entre botones) = 84px
    BTN_RIGHT: '84px', 
    BTN_TOP: '24px'
  };

  const state = {
    isOpen: false,
    content: '',
    x: 0, y: 0, 
    w: 360, h: 480
  };

  // --- STORE ---
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
      state.content = saved.content || '';
      state.isOpen = saved.isOpen || false;
      
      const pos = JSON.parse(localStorage.getItem(CONFIG.POS_KEY) || '{}');
      state.x = pos.x || window.innerWidth - 400;
      state.y = pos.y || 90;
      state.w = pos.w || 360;
      state.h = pos.h || 480;
    } catch (e) { console.error(e); }
  }

  function saveState() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
      content: state.content,
      isOpen: state.isOpen
    }));
  }

  function savePos() {
    localStorage.setItem(CONFIG.POS_KEY, JSON.stringify({
      x: state.x, y: state.y, w: state.w, h: state.h
    }));
  }

  // --- STYLES ---
  function injectStyles() {
    if (document.getElementById('apple-notes-style')) return;
    const style = document.createElement('style');
    style.id = 'apple-notes-style';
    style.textContent = `
      /* Botón Trigger (IDÉNTICO AL DE LIBRARY) */
      .an-trigger-btn {
        position: fixed;
        width: 48px;   /* Igual que Library */
        height: 48px;  /* Igual que Library */
        border-radius: 16px; /* Misma curvatura que Library */
        background: rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: ${CONFIG.Z_INDEX};
      }
      .dark .an-trigger-btn {
        background: rgba(30, 30, 30, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .an-trigger-btn:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
      }
      .dark .an-trigger-btn:hover { background: rgba(50, 50, 50, 0.9); }

      /* Ventana Principal */
      .an-window {
        position: fixed;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(25px) saturate(180%);
        -webkit-backdrop-filter: blur(25px) saturate(180%);
        border: 1px solid rgba(0, 0, 0, 0.05);
        border-radius: 14px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        z-index: ${CONFIG.Z_INDEX};
      }
      .dark .an-window {
        background: rgba(40, 40, 40, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      }

      /* Cabecera (Toolbar) */
      .an-header {
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        background: transparent;
        cursor: move;
        user-select: none;
      }
      
      /* Semáforo (Traffic Lights) */
      .an-traffic { display: flex; gap: 8px; }
      .an-dot { width: 12px; height: 12px; border-radius: 50%; cursor: pointer; transition: transform 0.1s; }
      .an-dot:active { transform: scale(0.9); }
      .dot-red { background: #FF5F57; border: 0.5px solid rgba(0,0,0,0.1); }
      .dot-yellow { background: #FEBC2E; border: 0.5px solid rgba(0,0,0,0.1); }
      .dot-green { background: #28C840; border: 0.5px solid rgba(0,0,0,0.1); }

      /* Título */
      .an-title {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 13px;
        font-weight: 600;
        color: #888;
        letter-spacing: 0.5px;
      }

      /* Botón Descargar */
      .an-action-btn {
        color: #F59E0B;
        font-size: 16px;
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        transition: background 0.2s;
      }
      .an-action-btn:hover { background: rgba(245, 158, 11, 0.1); }
      .an-action-btn:active { transform: translateY(1px); }

      /* Área de Texto */
      .an-textarea {
        flex: 1;
        width: 100%;
        background: transparent;
        border: none;
        resize: none;
        padding: 0 20px 20px 20px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 17px;
        line-height: 1.5;
        color: #333;
        outline: none;
      }
      .dark .an-textarea { color: #E5E5E5; }
      .an-textarea::placeholder { color: #A1A1AA; font-weight: 400; }
      .an-textarea::-webkit-scrollbar { width: 6px; }
      .an-textarea::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }

      /* Resize Handle */
      .an-resize-handle {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 20px;
        height: 20px;
        cursor: nwse-resize;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        padding: 4px;
        opacity: 0.5;
      }
    `;
    document.head.appendChild(style);
  }

  // --- UI BUILDER ---
  function buildUI() {
    if (document.getElementById('apple-notes-trigger')) return;
    injectStyles();

    // 1. EL BOTÓN
    const trigger = document.createElement('div');
    trigger.id = 'apple-notes-trigger';
    trigger.className = 'an-trigger-btn';
    trigger.style.top = CONFIG.BTN_TOP;
    trigger.style.right = CONFIG.BTN_RIGHT;
    trigger.innerHTML = `<i class="fa-regular fa-note-sticky text-yellow-500 text-xl"></i>`;
    trigger.title = "Abrir Notas";
    trigger.onclick = toggleWindow;

    // 2. LA VENTANA
    const win = document.createElement('div');
    win.id = 'apple-notes-window';
    win.className = 'an-window hidden opacity-0';
    
    win.innerHTML = `
      <div class="an-header" id="an-header">
        <div class="an-traffic">
           <div class="an-dot dot-red" onclick="window.anClose()" title="Cerrar"></div>
           <div class="an-dot dot-yellow" onclick="window.anMinimize()" title="Minimizar"></div>
           <div class="an-dot dot-green" onclick="window.anExpand()" title="Expandir"></div>
        </div>
        <div class="an-title">Notas</div>
        <div class="an-action-btn" onclick="window.anDownload()" title="Descargar nota">
           <i class="fa-solid fa-arrow-up-from-bracket"></i>
        </div>
      </div>
      <textarea id="an-textarea" class="an-textarea" placeholder="Escribe aquí..."></textarea>
      <div class="an-resize-handle" id="an-resize">
         <i class="fa-solid fa-grip-lines text-[10px] text-gray-400 transform -rotate-45"></i>
      </div>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(win);

    const textarea = win.querySelector('#an-textarea');
    textarea.value = state.content;
    
    win.addEventListener('click', (e) => {
        if(e.target === win || e.target.id === 'an-header') textarea.focus();
    });

    textarea.addEventListener('input', (e) => {
      state.content = e.target.value;
      saveState();
    });

    initDrag(win);
    initResize(win);
    applyPos(win);

    if (state.isOpen) openNotepad();
  }

  // --- ACTIONS ---
  function toggleWindow() { state.isOpen ? closeNotepad() : openNotepad(); }

  function openNotepad() {
    const win = document.getElementById('apple-notes-window');
    const trigger = document.getElementById('apple-notes-trigger');
    if (!win) return;
    
    win.classList.remove('hidden');
    win.style.transform = 'scale(0.9)';
    win.style.opacity = '0';
    
    requestAnimationFrame(() => {
        win.style.transform = 'scale(1)';
        win.style.opacity = '1';
    });
    
    if (trigger) trigger.style.background = 'rgba(255, 255, 255, 0.9)';
    state.isOpen = true;
    saveState();
  }

  function closeNotepad() {
    const win = document.getElementById('apple-notes-window');
    const trigger = document.getElementById('apple-notes-trigger');
    if (!win) return;

    win.style.transform = 'scale(0.95)';
    win.style.opacity = '0';
    setTimeout(() => win.classList.add('hidden'), 200);

    if (trigger) trigger.style.background = ''; 
    state.isOpen = false;
    saveState();
  }

  window.anClose = closeNotepad;
  window.anMinimize = closeNotepad;
  window.anExpand = () => {
    state.w = 500; state.h = 600;
    state.x = (window.innerWidth - 500) / 2;
    state.y = (window.innerHeight - 600) / 2;
    const win = document.getElementById('apple-notes-window');
    applyPos(win);
    savePos();
  };

  window.anDownload = () => {
    const text = state.content;
    if (!text) return alert("La nota está vacía.");
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NCLEX_Nota_${new Date().toLocaleDateString().replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  function applyPos(win) {
    if(state.x > window.innerWidth - 50) state.x = window.innerWidth - 400;
    if(state.y > window.innerHeight - 50) state.y = 100;
    win.style.left = state.x + 'px';
    win.style.top = state.y + 'px';
    win.style.width = state.w + 'px';
    win.style.height = state.h + 'px';
  }

  // --- DRAG ---
  function initDrag(win) {
    const header = win.querySelector('#an-header');
    let isDragging = false, startX, startY, startL, startT;

    header.onmousedown = (e) => {
      if(e.target.closest('.an-traffic') || e.target.closest('.an-action-btn')) return;
      isDragging = true;
      startX = e.clientX; startY = e.clientY;
      startL = win.offsetLeft; startT = win.offsetTop;
      e.preventDefault();
    };

    document.onmousemove = (e) => {
      if(!isDragging) return;
      state.x = startL + (e.clientX - startX);
      state.y = startT + (e.clientY - startY);
      win.style.left = state.x + 'px';
      win.style.top = state.y + 'px';
    };

    document.onmouseup = () => { if(isDragging) { isDragging = false; savePos(); } };
  }

  // --- RESIZE ---
  function initResize(win) {
    const handle = win.querySelector('#an-resize');
    let isResizing = false, startX, startY, startW, startH;

    handle.onmousedown = (e) => {
      isResizing = true;
      startX = e.clientX; startY = e.clientY;
      startW = win.offsetWidth; startH = win.offsetHeight;
      e.stopPropagation(); e.preventDefault();
    };

    document.onmousemove = (e) => {
      if(!isResizing) return;
      state.w = Math.max(250, startW + (e.clientX - startX));
      state.h = Math.max(300, startH + (e.clientY - startY));
      win.style.width = state.w + 'px';
      win.style.height = state.h + 'px';
    };

    document.onmouseup = () => { if(isResizing) { isResizing = false; savePos(); } };
  }

  // --- INIT ---
  loadState();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildUI);
  else buildUI();

})();