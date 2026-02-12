// 17_bnotepad.js — Bloc de Notas Flotante (Versión de Alta Visibilidad)
// Se asegura de aparecer siempre encima de todo.

(function () {
  'use strict';

  console.log('🚀 Iniciando Bloc de Notas Flotante...');

  const CONFIG = {
    STORAGE_KEY: 'nclex_float_notes_v2',
    POS_KEY: 'nclex_float_pos_v2',
    Z_INDEX: 100000, // ¡Z-Index extremo para que nada lo tape!
    COLORS: [
      { bg: '#fefce8', border: '#fde047' }, // Amarillo
      { bg: '#eff6ff', border: '#60a5fa' }, // Azul
      { bg: '#f0fdf4', border: '#4ade80' }, // Verde
      { bg: '#faf5ff', border: '#a855f7' }, // Morado
      { bg: '#fff1f2', border: '#fb7185' }  // Rosa
    ]
  };

  const state = {
    isOpen: false,
    content: '',
    colorIdx: 0,
    x: 0, y: 0, 
    w: 360, h: 500
  };

  // --- CARGAR DATOS ---
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
      state.content = saved.content || '';
      state.colorIdx = saved.colorIdx || 0;
      state.isOpen = saved.isOpen || false;
      
      const pos = JSON.parse(localStorage.getItem(CONFIG.POS_KEY) || '{}');
      // Posición por defecto segura (esquina inferior derecha)
      state.x = pos.x || window.innerWidth - 380;
      state.y = pos.y || window.innerHeight - 550;
      state.w = pos.w || 360;
      state.h = pos.h || 500;
    } catch (e) { console.error(e); }
  }

  function saveState() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
      content: state.content,
      colorIdx: state.colorIdx,
      isOpen: state.isOpen
    }));
  }

  function savePos() {
    localStorage.setItem(CONFIG.POS_KEY, JSON.stringify({
      x: state.x, y: state.y, w: state.w, h: state.h
    }));
  }

  // --- CONSTRUIR UI ---
  function buildUI() {
    // Evitar duplicados
    if (document.getElementById('np-trigger')) return;

    console.log('🔨 Construyendo botón flotante...');

    // 1. EL BOTÓN FLOTANTE (Lápiz)
    const trigger = document.createElement('div');
    trigger.id = 'np-trigger';
    // Usamos bg-blue-600 estándar para asegurar visibilidad inmediata
    trigger.className = 'fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 hover:bg-blue-700 transition-all duration-300 group';
    trigger.style.zIndex = CONFIG.Z_INDEX; // Forzado
    trigger.innerHTML = `
        <i class="fa-solid fa-pen text-2xl"></i>
        <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse hidden" id="np-dot"></div>
    `;
    trigger.onclick = toggleWindow;
    
    // 2. LA VENTANA FLOTANTE
    const win = document.createElement('div');
    win.id = 'np-window';
    win.className = 'fixed flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-600 hidden transition-all duration-200';
    win.style.zIndex = CONFIG.Z_INDEX;
    win.style.backdropFilter = 'blur(20px)';
    win.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    
    win.innerHTML = `
      <div id="np-header" class="h-12 bg-gray-100/80 dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 cursor-move select-none">
         <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer shadow-sm" onclick="window.closeNotepad()" title="Cerrar"></span>
            <span class="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer shadow-sm" onclick="window.minimizeNotepad()" title="Minimizar"></span>
            <span class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer shadow-sm" onclick="window.expandNotepad()" title="Expandir"></span>
         </div>
         <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">NOTAS</span>
         <div class="flex gap-3">
            <button id="np-color-btn" class="text-gray-400 hover:text-blue-500 transition-colors"><i class="fa-solid fa-palette"></i></button>
            <button id="np-trash-btn" class="text-gray-400 hover:text-red-500 transition-colors"><i class="fa-solid fa-trash-can"></i></button>
         </div>
      </div>

      <textarea id="np-textarea" class="flex-1 w-full p-5 bg-transparent resize-none focus:outline-none text-slate-800 text-lg leading-relaxed font-medium placeholder-gray-400/70" placeholder="Escribe tus notas aquí..."></textarea>

      <div class="h-6 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center px-4 text-[10px] text-gray-400 select-none">
         <span id="np-status">Guardado automático</span>
         <i class="fa-solid fa-grip-lines-vertical cursor-nwse-resize hover:text-blue-500" id="np-resize"></i>
      </div>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(win);

    // Eventos
    const textarea = win.querySelector('#np-textarea');
    textarea.value = state.content;
    textarea.addEventListener('input', (e) => {
      state.content = e.target.value;
      saveState();
      const status = document.getElementById('np-status');
      if(status) status.innerText = 'Guardando...';
      setTimeout(() => { if(status) status.innerText = 'Guardado'; }, 800);
    });

    win.querySelector('#np-color-btn').onclick = cycleColor;
    win.querySelector('#np-trash-btn').onclick = () => {
      if(confirm('¿Borrar todas las notas?')) {
        state.content = '';
        textarea.value = '';
        saveState();
      }
    };

    applyTheme(); 
    initDrag(win);
    initResize(win);
    applyPos(win);
    
    if(state.isOpen) openNotepad();
  }

  // --- LÓGICA DE VENTANA ---
  function toggleWindow() {
    state.isOpen ? closeNotepad() : openNotepad();
  }

  function openNotepad() {
    const win = document.getElementById('np-window');
    const trigger = document.getElementById('np-trigger');
    if(!win) return;

    win.classList.remove('hidden');
    // Pequeña animación de entrada
    win.style.opacity = '0';
    win.style.transform = 'scale(0.95)';
    
    requestAnimationFrame(() => {
        win.style.transition = 'opacity 0.2s, transform 0.2s';
        win.style.opacity = '1';
        win.style.transform = 'scale(1)';
    });

    state.isOpen = true;
    saveState();
    
    // Ocultar el botón flotante mientras la ventana está abierta (opcional, más limpio)
    if(trigger) {
        trigger.style.transform = 'scale(0)'; 
        trigger.style.opacity = '0';
    }
  }

  function closeNotepad() {
    const win = document.getElementById('np-window');
    const trigger = document.getElementById('np-trigger');
    if(!win) return;

    win.style.opacity = '0';
    win.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        win.classList.add('hidden');
    }, 200);

    state.isOpen = false;
    saveState();

    // Reaparecer el botón
    if(trigger) {
        trigger.style.transform = 'scale(1)';
        trigger.style.opacity = '1';
    }
  }

  window.closeNotepad = closeNotepad;
  window.minimizeNotepad = closeNotepad;
  window.expandNotepad = () => {
    state.w = 600; state.h = 800;
    state.x = (window.innerWidth - 600) / 2;
    state.y = (window.innerHeight - 800) / 2;
    const win = document.getElementById('np-window');
    applyPos(win);
    savePos();
  };

  function cycleColor() {
    state.colorIdx = (state.colorIdx + 1) % CONFIG.COLORS.length;
    applyTheme();
    saveState();
  }

  function applyTheme() {
    const win = document.getElementById('np-window');
    const area = document.getElementById('np-textarea');
    if(!win || !area) return;

    const c = CONFIG.COLORS[state.colorIdx];
    win.style.backgroundColor = c.bg;
    area.style.color = '#1e293b'; 
    win.style.borderColor = c.border;
  }

  function applyPos(win) {
    // Asegurar que esté dentro de la pantalla
    if(state.x > window.innerWidth - 50) state.x = window.innerWidth - 400;
    if(state.y > window.innerHeight - 50) state.y = 100;
    if(state.x < 0) state.x = 20;
    if(state.y < 0) state.y = 20;
    
    win.style.left = state.x + 'px';
    win.style.top = state.y + 'px';
    win.style.width = state.w + 'px';
    win.style.height = state.h + 'px';
  }

  // --- DRAG & DROP (Arrastrar) ---
  function initDrag(win) {
    const header = win.querySelector('#np-header');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    header.onmousedown = (e) => {
      // Ignorar clicks en botones
      if(e.target.tagName === 'BUTTON' || e.target.tagName === 'I' || e.target.tagName === 'SPAN') return;
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = win.offsetLeft;
      initialTop = win.offsetTop;
      header.style.cursor = 'grabbing';
      e.preventDefault();
    };

    document.onmousemove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      state.x = initialLeft + dx;
      state.y = initialTop + dy;
      win.style.left = state.x + 'px';
      win.style.top = state.y + 'px';
    };

    document.onmouseup = () => {
      if(isDragging) {
        isDragging = false;
        header.style.cursor = 'move';
        savePos();
      }
    };
  }

  // --- RESIZE (Redimensionar) ---
  function initResize(win) {
    const handle = win.querySelector('#np-resize');
    let isResizing = false;
    let startX, startY, startW, startH;

    handle.onmousedown = (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startW = parseInt(document.defaultView.getComputedStyle(win).width, 10);
      startH = parseInt(document.defaultView.getComputedStyle(win).height, 10);
      e.stopPropagation();
      e.preventDefault();
    };

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const w = startW + e.clientX - startX;
      const h = startH + e.clientY - startY;
      if (w > 250) { state.w = w; win.style.width = w + 'px'; }
      if (h > 300) { state.h = h; win.style.height = h + 'px'; }
    });

    document.addEventListener('mouseup', () => {
      if(isResizing) {
        isResizing = false;
        savePos();
      }
    });
  }

  // --- INICIO ---
  loadState();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildUI);
  else buildUI();

})();