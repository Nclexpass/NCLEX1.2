// 17_bnotepad.js — Ultimate Floating Notepad (Draggable & Resizable)
// Features: Drag anywhere, Resize, Minimize, Auto-save, Apple-style Glass UI.

(function () {
  'use strict';

  const CONFIG = {
    STORAGE_KEY: 'nclex_float_notes',
    POS_KEY: 'nclex_float_pos',
    Z_INDEX: 99999, // Encima de todo
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
    isMinimized: false,
    content: '',
    colorIdx: 0,
    x: 0, y: 0, // Posición ventana
    w: 360, h: 500 // Tamaño inicial
  };

  // --- STORE ---
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
      state.content = saved.content || '';
      state.colorIdx = saved.colorIdx || 0;
      state.isOpen = saved.isOpen || false;
      
      const pos = JSON.parse(localStorage.getItem(CONFIG.POS_KEY) || '{}');
      state.x = pos.x || window.innerWidth - 400;
      state.y = pos.y || 100;
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

  // --- UI BUILDER ---
  function buildUI() {
    if (document.getElementById('nclex-notepad-root')) return;

    // 1. EL BOTÓN FLOTANTE (TRIGGER)
    const trigger = document.createElement('div');
    trigger.id = 'np-trigger';
    trigger.className = 'fixed bottom-6 right-6 w-14 h-14 bg-brand-blue text-white rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-[99998] group';
    trigger.innerHTML = `<i class="fa-solid fa-pen-nib text-xl"></i><div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white hidden" id="np-dot"></div>`;
    trigger.onclick = toggleWindow;
    
    // 2. LA VENTANA FLOTANTE
    const win = document.createElement('div');
    win.id = 'np-window';
    win.className = 'fixed flex flex-col rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 hidden opacity-0 transition-opacity duration-200';
    win.style.zIndex = CONFIG.Z_INDEX;
    win.style.backdropFilter = 'blur(12px)';
    win.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'; // Fondo sólido pero bonito
    
    // HTML Interno
    win.innerHTML = `
      <div id="np-header" class="h-10 bg-gray-100/80 dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 cursor-move select-none">
         <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" onclick="window.closeNotepad()"></span>
            <span class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer" onclick="window.minimizeNotepad()"></span>
            <span class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer" onclick="window.expandNotepad()"></span>
         </div>
         <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Quick Notes</span>
         <div class="flex gap-2">
            <button id="np-color-btn" class="text-gray-400 hover:text-brand-blue"><i class="fa-solid fa-palette"></i></button>
            <button id="np-trash-btn" class="text-gray-400 hover:text-red-500"><i class="fa-solid fa-trash"></i></button>
         </div>
      </div>

      <textarea id="np-textarea" class="flex-1 w-full p-4 bg-transparent resize-none focus:outline-none text-slate-800 dark:text-slate-900 text-base leading-relaxed font-medium placeholder-gray-400" placeholder="Escribe aquí... (Se guarda solo)"></textarea>

      <div class="h-6 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center px-3 text-[10px] text-gray-400">
         <span id="np-status">Listo</span>
         <i class="fa-solid fa-grip-lines-vertical cursor-nwse-resize" id="np-resize"></i>
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
      document.getElementById('np-status').innerText = 'Guardando...';
      setTimeout(() => document.getElementById('np-status').innerText = 'Guardado', 1000);
    });

    win.querySelector('#np-color-btn').onclick = cycleColor;
    win.querySelector('#np-trash-btn').onclick = () => {
      if(confirm('¿Borrar todo?')) {
        state.content = '';
        textarea.value = '';
        saveState();
      }
    };

    // Dark Mode Fix para el textarea
    applyTheme(); 

    // Inicializar lógica Drag & Resize
    initDrag(win);
    initResize(win);

    // Restaurar posición y estado
    applyPos(win);
    if(state.isOpen) openNotepad();
  }

  // --- LOGIC ---
  function toggleWindow() {
    state.isOpen ? closeNotepad() : openNotepad();
  }

  function openNotepad() {
    const win = document.getElementById('np-window');
    win.classList.remove('hidden');
    // Forzar reflow para animación
    void win.offsetWidth; 
    win.classList.remove('opacity-0');
    state.isOpen = true;
    saveState();
    applyTheme();
  }

  function closeNotepad() {
    const win = document.getElementById('np-window');
    win.classList.add('opacity-0');
    setTimeout(() => win.classList.add('hidden'), 200);
    state.isOpen = false;
    saveState();
  }

  // Exponer funciones globales para los botones del header
  window.closeNotepad = closeNotepad;
  window.minimizeNotepad = closeNotepad; // Por ahora igual
  window.expandNotepad = () => {
    state.w = 600; state.h = 800;
    state.x = (window.innerWidth - 600) / 2;
    state.y = (window.innerHeight - 800) / 2;
    applyPos(document.getElementById('np-window'));
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
    // En modo oscuro forzamos un gris claro para que se lea, o usamos el color
    // Aquí el truco: Usaremos el color seleccionado como fondo SUAVE
    win.style.backgroundColor = c.bg;
    // Si el usuario tiene modo oscuro en la web, el texto debe ser oscuro porque el fondo de la nota es claro (tipo Post-it)
    area.style.color = '#1e293b'; 
  }

  function applyPos(win) {
    // Seguridad para que no salga de pantalla
    if(state.x > window.innerWidth - 50) state.x = window.innerWidth - 360;
    if(state.y > window.innerHeight - 50) state.y = 100;
    
    win.style.left = state.x + 'px';
    win.style.top = state.y + 'px';
    win.style.width = state.w + 'px';
    win.style.height = state.h + 'px';
  }

  // --- DRAG & DROP SYSTEM ---
  function initDrag(win) {
    const header = win.querySelector('#np-header');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    header.onmousedown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = win.offsetLeft;
      initialTop = win.offsetTop;
      header.style.cursor = 'grabbing';
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
      if (w > 200) { state.w = w; win.style.width = w + 'px'; }
      if (h > 200) { state.h = h; win.style.height = h + 'px'; }
    });

    document.addEventListener('mouseup', () => {
      if(isResizing) {
        isResizing = false;
        savePos();
      }
    });
  }

  // --- INIT ---
  loadState();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildUI);
  else buildUI();

})();