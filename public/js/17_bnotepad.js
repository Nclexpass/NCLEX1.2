// 17_bnotepad.js — Apple Notes (Draggable + Floating Trigger)
// Created for NCLEX Masterclass (Reynier Diaz Gerones)
// Single source of truth: removes need for inline notepad code in index.html

(function () {
  'use strict';

  // --- CONFIG ---
  const CONFIG = {
    STORAGE_KEY: 'nclex_notebook_apple',
    POS_KEY: 'nclex_notepad_trigger_pos_v1',
    AUTO_SAVE_DELAY: 1200,
    MAX_PAGES: 50,
    Z_INDEX: 9999,
    TRIGGER_DEFAULT: { right: 20, bottom: 20 },
    DRAG_THRESHOLD: 5,
    COLORS: [
      { name: 'yellow', light: '#FFD60A', dark: '#FFB800' },
      { name: 'blue',   light: '#007AFF', dark: '#0A84FF' },
      { name: 'pink',   light: '#FF2D55', dark: '#FF375F' },
      { name: 'green',  light: '#34C759', dark: '#30D158' },
      { name: 'purple', light: '#AF52DE', dark: '#BF5AF2' },
      { name: 'orange', light: '#FF9500', dark: '#FF9F0A' }
    ]
  };

  // --- STATE ---
  const state = {
    pages: [],
    currentIndex: 0,
    sidebarOpen: true,
    isOpen: false,
    isFullscreen: false,
    saveTimer: null,
    trigger: null,
    win: null
  };

  // --- UTIL ---
  function isSpanishUI() {
    const esEl = document.querySelector('.lang-es');
    return !!(esEl && esEl.offsetParent !== null);
  }
  function t(es, en) {
    return isSpanishUI() ? es : en;
  }

  function safeJSONParse(raw, fallback) {
    try { return JSON.parse(raw); } catch { return fallback; }
  }

  function loadPages() {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    state.pages = raw ? safeJSONParse(raw, []) : [];
    if (!Array.isArray(state.pages)) state.pages = [];
    if (state.pages.length === 0) {
      state.pages.push(makePage(0));
      state.currentIndex = 0;
      savePages(true);
    }
  }

  function savePages(immediate = false) {
    clearTimeout(state.saveTimer);
    const doSave = () => {
      try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state.pages));
        showSaveIndicator();
      } catch (e) {
        console.error('Error saving notes:', e);
      }
    };
    if (immediate) doSave();
    else state.saveTimer = setTimeout(doSave, CONFIG.AUTO_SAVE_DELAY);
  }

  function makePage(colorIndex = 0) {
    const c = CONFIG.COLORS[colorIndex % CONFIG.COLORS.length];
    return {
      id: Date.now() + Math.random(),
      title: `${t('Nota', 'Note')} ${state.pages.length + 1}`,
      content: '',
      color: c.name,
      colorLight: c.light,
      colorDark: c.dark,
      updatedAt: new Date().toISOString(),
      starred: false
    };
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(n, max));
  }

  function formatAppleDate(iso) {
    const date = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 0) return `${t('Hoy', 'Today')} ${t('a las', 'at')} ${time}`;
    if (diffDays === 1) return `${t('Ayer', 'Yesterday')} ${t('a las', 'at')} ${time}`;
    if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'long' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  // --- TRIGGER (Floating Button) ---
  function loadTriggerPos() {
    const raw = localStorage.getItem(CONFIG.POS_KEY);
    const pos = raw ? safeJSONParse(raw, null) : null;
    if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') return null;
    return pos;
  }
  function saveTriggerPos(el) {
    const r = el.getBoundingClientRect();
    localStorage.setItem(CONFIG.POS_KEY, JSON.stringify({ x: r.left, y: r.top, vw: window.innerWidth, vh: window.innerHeight }));
  }

  function createTrigger() {
    if (document.getElementById('notes-float-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'notes-float-btn';
    btn.style.position = 'fixed';
    btn.style.zIndex = String(CONFIG.Z_INDEX);
    btn.className =
      'w-14 h-14 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 ' +
      'bg-white/90 dark:bg-gray-900/70 backdrop-blur-md flex items-center justify-center ' +
      'cursor-move select-none group hover:shadow-2xl transition-all duration-200';

    btn.innerHTML = `
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 opacity-15 rounded-2xl pointer-events-none group-hover:opacity-25 transition-opacity"></div>
      <i class="fa-solid fa-pen-nib text-2xl text-orange-500 dark:text-orange-400 pointer-events-none relative z-10 group-hover:scale-110 transition-transform"></i>
      <div class="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="absolute top-full right-0 mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
        ${t('Notas', 'Notes')}
        <div class="absolute -top-1 right-6 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    `;

    document.body.appendChild(btn);
    state.trigger = btn;

    // Position
    const saved = loadTriggerPos();
    if (saved) {
      // If viewport changed a lot, fall back
      const wRatio = window.innerWidth / (saved.vw || window.innerWidth);
      const hRatio = window.innerHeight / (saved.vh || window.innerHeight);
      if (wRatio >= 0.75 && wRatio <= 1.25 && hRatio >= 0.75 && hRatio <= 1.25) {
        btn.style.left = clamp(saved.x, 10, window.innerWidth - 70) + 'px';
        btn.style.top = clamp(saved.y, 10, window.innerHeight - 70) + 'px';
      } else {
        btn.style.right = CONFIG.TRIGGER_DEFAULT.right + 'px';
        btn.style.bottom = CONFIG.TRIGGER_DEFAULT.bottom + 'px';
      }
    } else {
      btn.style.right = CONFIG.TRIGGER_DEFAULT.right + 'px';
      btn.style.bottom = CONFIG.TRIGGER_DEFAULT.bottom + 'px';
    }

    setupTriggerDrag(btn);
  }

  function setupTriggerDrag(el) {
    let dragging = false;
    let moved = false;
    let sx = 0, sy = 0;
    let baseLeft = 0, baseTop = 0;

    const start = (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      dragging = true;
      moved = false;

      const p = e.type === 'touchstart' ? e.touches[0] : e;
      sx = p.clientX; sy = p.clientY;

      const rect = el.getBoundingClientRect();
      baseLeft = rect.left; baseTop = rect.top;

      el.style.transition = 'none';
      el.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const move = (e) => {
      if (!dragging) return;
      const p = e.type === 'touchmove' ? e.touches[0] : e;
      const dx = p.clientX - sx;
      const dy = p.clientY - sy;

      if (!moved && (Math.abs(dx) > CONFIG.DRAG_THRESHOLD || Math.abs(dy) > CONFIG.DRAG_THRESHOLD)) moved = true;

      const newLeft = clamp(baseLeft + dx, 0, window.innerWidth - el.offsetWidth);
      const newTop = clamp(baseTop + dy, 0, window.innerHeight - el.offsetHeight);

      el.style.left = newLeft + 'px';
      el.style.top = newTop + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';

      if (moved) e.preventDefault();
    };

    const end = () => {
      if (!dragging) return;
      dragging = false;
      el.style.cursor = '';
      el.style.transition = '';
      saveTriggerPos(el);

      if (!moved) toggleNotepad();
    };

    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start, { passive: false });
    document.addEventListener('mousemove', move, { passive: false });
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('mouseup', end);
    document.addEventListener('touchend', end);

    window.addEventListener('resize', () => {
      // Keep trigger on-screen
      const r = el.getBoundingClientRect();
      if (r.left > window.innerWidth || r.top > window.innerHeight || r.right < 0 || r.bottom < 0) {
        el.style.left = '';
        el.style.top = '';
        el.style.right = CONFIG.TRIGGER_DEFAULT.right + 'px';
        el.style.bottom = CONFIG.TRIGGER_DEFAULT.bottom + 'px';
        localStorage.removeItem(CONFIG.POS_KEY);
      }
    });
  }

  // --- WINDOW UI ---
  function ensureContainer() {
    let container = document.getElementById('notepad-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notepad-container';
      document.body.appendChild(container);
    }
    container.style.zIndex = String(CONFIG.Z_INDEX);
    return container;
  }

  function buildWindow() {
    if (document.getElementById('notepad-window')) return;

    const container = ensureContainer();
    container.innerHTML = `
      <div id="notepad-window" class="fixed hidden flex-col w-[860px] h-[620px] max-w-[92vw] max-h-[92vh] apple-glass rounded-2xl overflow-hidden"
           style="z-index:${CONFIG.Z_INDEX}; left: 50%; top: 50%; transform: translate(-50%, -50%);">
        <div id="notepad-titlebar" class="apple-titlebar flex items-center justify-between px-4 py-2.5 cursor-move select-none">
          <div class="flex items-center">
            <div class="apple-control apple-control-close" title="${t('Cerrar', 'Close')}" data-action="close"></div>
            <div class="apple-control apple-control-minimize" title="${t('Ocultar', 'Hide')}" data-action="close"></div>
            <div class="apple-control apple-control-maximize" title="${t('Pantalla completa', 'Fullscreen')}" data-action="fullscreen"></div>
          </div>

          <div class="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <i class="fa-solid fa-book text-gray-600 dark:text-gray-300 text-sm"></i>
            <span id="np-title" class="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate max-w-[240px]"></span>
            <span id="np-counter" class="text-xs text-gray-500 font-medium"></span>
          </div>

          <div class="flex items-center gap-2">
            <button class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10" data-action="star" title="${t('Favorito', 'Star')}">
              <i id="np-star-icon" class="fa-regular fa-star text-sm"></i>
            </button>
            <button class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10" data-action="sidebar" title="${t('Sidebar', 'Sidebar')}">
              <i class="fa-solid fa-sidebar text-sm"></i>
            </button>
            <button class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10" data-action="export" title="${t('Exportar', 'Export')}">
              <i class="fa-solid fa-arrow-up-from-bracket text-sm"></i>
            </button>
          </div>
        </div>

        <div class="flex flex-1 overflow-hidden">
          <div id="np-sidebar" class="apple-sidebar flex flex-col w-64 transition-all duration-300">
            <div class="p-4 border-b border-gray-200 dark:border-white/10">
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-semibold text-gray-800 dark:text-gray-200">${t('Notas', 'Notes')}</h3>
                <button class="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600" data-action="add" title="${t('Nueva', 'New')}">
                  <i class="fa-solid fa-plus text-sm"></i>
                </button>
              </div>
              <input id="np-title-input" type="text" class="apple-input w-full" placeholder="${t('Título...', 'Title...')}" />
            </div>

            <div id="np-list" class="flex-1 overflow-y-auto p-2 apple-scrollbar"></div>

            <div class="p-4 border-t border-gray-200 dark:border-white/10">
              <div class="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">${t('Colores', 'Colors')}</div>
              <div class="flex gap-2 flex-wrap">
                ${CONFIG.COLORS.map((c, i) => `
                  <button data-action="color" data-color="${i}" class="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 shadow-sm hover:scale-110 transition-transform"
                          style="background-color:${c.light}"></button>
                `).join('')}
              </div>
              <button class="mt-3 w-full apple-button flex items-center justify-center gap-2" data-action="delete">
                <i class="fa-solid fa-trash text-xs"></i> ${t('Eliminar', 'Delete')}
              </button>
            </div>
          </div>

          <div id="np-content" class="flex-1 flex flex-col transition-all duration-300 ml-64">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-white/10">
              <div class="flex items-center gap-2">
                <button class="apple-button" data-action="prev" title="${t('Anterior', 'Previous')}"><i class="fa-solid fa-chevron-left text-xs"></i></button>
                <button class="apple-button flex items-center gap-2" data-action="add"><i class="fa-solid fa-plus text-xs"></i> ${t('Nueva', 'New')}</button>
                <button class="apple-button" data-action="next" title="${t('Siguiente', 'Next')}"><i class="fa-solid fa-chevron-right text-xs"></i></button>
              </div>

              <div class="flex items-center gap-3">
                <span id="np-save" class="text-xs text-green-500 opacity-0 transition-opacity">
                  <i class="fa-solid fa-check"></i> ${t('Guardado', 'Saved')}
                </span>
                <span class="text-xs text-gray-500">${new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <textarea id="np-editor" class="flex-1 w-full apple-editor text-gray-900 dark:text-gray-100 p-6 focus:outline-none resize-none placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="${t('Escribe tus notas aquí...', 'Start writing your notes here...')}"></textarea>

            <div class="px-4 py-2 border-t border-gray-200 dark:border-white/10 text-xs text-gray-500 flex justify-between">
              <div><i class="fa-regular fa-clock mr-1"></i><span id="np-last">${t('Listo', 'Ready')}</span></div>
              <div><i class="fa-solid fa-keyboard mr-1"></i><span id="np-chars">0 ${t('caracteres', 'characters')}</span></div>
            </div>
          </div>
        </div>

        <div id="np-resize" class="notepad-resize-handle text-gray-600 dark:text-gray-300"></div>
      </div>

      <div id="np-confirm" class="fixed inset-0 hidden items-center justify-center p-4" style="z-index:${CONFIG.Z_INDEX + 1}">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="apple-modal rounded-2xl p-6 w-96 relative">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <i class="fa-solid fa-trash text-red-600 dark:text-red-400"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">${t('Eliminar Nota', 'Delete Note')}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">${t('Esta acción no se puede deshacer.', 'This action cannot be undone.')}</p>
            </div>
          </div>
          <p class="text-gray-700 dark:text-gray-300 mb-6">${t('¿Eliminar la nota actual?', 'Delete the current note?')}</p>
          <div class="flex justify-end gap-3">
            <button class="apple-button" data-action="cancel-delete">${t('Cancelar', 'Cancel')}</button>
            <button class="accent-button bg-red-500 hover:bg-red-600" data-action="confirm-delete">${t('Eliminar', 'Delete')}</button>
          </div>
        </div>
      </div>
    `;

    state.win = document.getElementById('notepad-window');
    wireWindowEvents();
    centerWindow();
    renderAll();
    setupWindowDrag();
    setupResizeHandle();
    setupHotkeys();
    observeDarkMode();
  }

  function centerWindow() {
    const win = state.win || document.getElementById('notepad-window');
    if (!win) return;
    if (state.isFullscreen) return;
    win.style.left = '50%';
    win.style.top = '50%';
    win.style.transform = 'translate(-50%, -50%)';
  }

  function wireWindowEvents() {
    const container = ensureContainer();
    container.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (!el) return;
      const action = el.getAttribute('data-action');
      if (!action) return;

      switch (action) {
        case 'close': closeNotepad(); break;
        case 'fullscreen': toggleFullscreen(); break;
        case 'sidebar': toggleSidebar(); break;
        case 'add': addPage(); break;
        case 'delete': askDelete(); break;
        case 'confirm-delete': confirmDelete(); break;
        case 'cancel-delete': hideDeleteModal(); break;
        case 'prev': prevPage(); break;
        case 'next': nextPage(); break;
        case 'export': exportPage(); break;
        case 'star': toggleStar(); break;
        case 'color': changeColor(parseInt(el.getAttribute('data-color'), 10)); break;
        default: break;
      }
    });

    // Title input
    container.addEventListener('input', (e) => {
      if (e.target && e.target.id === 'np-title-input') {
        updateTitle(e.target.value);
      }
      if (e.target && e.target.id === 'np-editor') {
        updateContent(e.target.value);
      }
    });

    // Sidebar list click
    container.addEventListener('click', (e) => {
      const row = e.target.closest('[data-page-index]');
      if (!row) return;
      const idx = parseInt(row.getAttribute('data-page-index'), 10);
      if (!Number.isFinite(idx)) return;
      goToPage(idx);
    });
  }

  // --- RENDER ---
  function getCurrentPage() {
    return state.pages[state.currentIndex];
  }

  function renderAll() {
    renderHeader();
    renderSidebar();
    renderEditor();
  }

  function renderHeader() {
    const page = getCurrentPage();
    if (!page) return;

    const titleEl = document.getElementById('np-title');
    const counterEl = document.getElementById('np-counter');
    const starIcon = document.getElementById('np-star-icon');
    const titleInput = document.getElementById('np-title-input');

    if (titleEl) titleEl.textContent = page.title || '';
    if (counterEl) counterEl.textContent = `${state.currentIndex + 1} ${t('de', 'of')} ${state.pages.length}`;
    if (titleInput) titleInput.value = page.title || '';
    if (starIcon) starIcon.className = (page.starred ? 'fa-solid' : 'fa-regular') + ' fa-star text-sm';
  }

  function renderSidebar() {
    const list = document.getElementById('np-list');
    if (!list) return;

    const sorted = [...state.pages].map((p, i) => ({ p, i }))
      .sort((a, b) => (b.p.starred === a.p.starred ? 0 : (b.p.starred ? 1 : -1)));

    let html = '<div class="space-y-1">';
    for (const { p, i } of sorted) {
      const active = i === state.currentIndex;
      html += `
        <div class="sidebar-page ${active ? 'active' : ''} rounded-xl" data-page-index="${i}">
          <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
            <div class="w-2 h-2 rounded-full" style="background-color:${p.colorLight}"></div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm truncate">${escapeHTML(p.title || '')}</div>
              <div class="text-xs text-gray-500 truncate">${formatAppleDate(p.updatedAt)}</div>
            </div>
            ${p.starred ? '<i class="fa-solid fa-star text-[10px] text-yellow-500"></i>' : ''}
          </div>
        </div>
      `;
    }
    html += '</div>';
    list.innerHTML = html;
  }

  function renderEditor() {
    const page = getCurrentPage();
    const editor = document.getElementById('np-editor');
    if (!page || !editor) return;

    editor.value = page.content || '';
    updateCharCount(editor.value);
    applyEditorTheme(page);
    const last = document.getElementById('np-last');
    if (last) last.textContent = `${t('Actualizado', 'Updated')}: ${formatAppleDate(page.updatedAt)}`;
  }

  function applyEditorTheme(page) {
    const editor = document.getElementById('np-editor');
    if (!editor) return;
    const isDark = document.documentElement.classList.contains('dark');
    const base = isDark ? page.colorDark : page.colorLight;
    editor.style.backgroundColor = base + '20';
    editor.style.color = isDark ? '#f0f0f0' : '#111827';
  }

  function updateCharCount(text) {
    const el = document.getElementById('np-chars');
    if (!el) return;
    el.textContent = `${(text || '').length} ${t('caracteres', 'characters')}`;
  }

  function escapeHTML(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // --- ACTIONS ---
  function updateTitle(value) {
    const page = getCurrentPage();
    if (!page) return;
    const v = (value || '').trim();
    if (!v) return;
    page.title = v;
    page.updatedAt = new Date().toISOString();
    savePages();
    renderHeader();
    renderSidebar();
  }

  function updateContent(value) {
    const page = getCurrentPage();
    if (!page) return;
    page.content = value || '';
    page.updatedAt = new Date().toISOString();
    updateCharCount(page.content);
    savePages();
  }

  function addPage() {
    if (state.pages.length >= CONFIG.MAX_PAGES) return;
    state.pages.push(makePage(state.pages.length));
    state.currentIndex = state.pages.length - 1;
    savePages(true);
    renderAll();
  }

  function goToPage(idx) {
    if (idx < 0 || idx >= state.pages.length) return;
    state.currentIndex = idx;
    renderAll();
  }

  function nextPage() {
    if (state.currentIndex < state.pages.length - 1) goToPage(state.currentIndex + 1);
    else addPage();
  }

  function prevPage() {
    if (state.currentIndex > 0) goToPage(state.currentIndex - 1);
  }

  function askDelete() {
    const modal = document.getElementById('np-confirm');
    if (modal) modal.classList.remove('hidden'), modal.classList.add('flex');
  }
  function hideDeleteModal() {
    const modal = document.getElementById('np-confirm');
    if (modal) modal.classList.add('hidden'), modal.classList.remove('flex');
  }
  function confirmDelete() {
    if (state.pages.length <= 1) {
      state.pages[0].content = '';
      state.pages[0].updatedAt = new Date().toISOString();
      savePages(true);
      hideDeleteModal();
      renderAll();
      return;
    }
    state.pages.splice(state.currentIndex, 1);
    state.currentIndex = clamp(state.currentIndex, 0, state.pages.length - 1);
    savePages(true);
    hideDeleteModal();
    renderAll();
  }

  function toggleStar() {
    const page = getCurrentPage();
    if (!page) return;
    page.starred = !page.starred;
    page.updatedAt = new Date().toISOString();
    savePages();
    renderHeader();
    renderSidebar();
  }

  function toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
    const sidebar = document.getElementById('np-sidebar');
    const content = document.getElementById('np-content');
    if (!sidebar || !content) return;

    if (state.sidebarOpen) {
      sidebar.classList.remove('hidden', 'w-0');
      sidebar.classList.add('flex', 'w-64');
      content.classList.remove('ml-0');
      content.classList.add('ml-64');
    } else {
      sidebar.classList.add('hidden', 'w-0');
      sidebar.classList.remove('flex', 'w-64');
      content.classList.remove('ml-64');
      content.classList.add('ml-0');
    }
  }

  function changeColor(index) {
    const page = getCurrentPage();
    const c = CONFIG.COLORS[index];
    if (!page || !c) return;
    page.color = c.name;
    page.colorLight = c.light;
    page.colorDark = c.dark;
    page.updatedAt = new Date().toISOString();
    savePages();
    renderEditor();
    renderSidebar();
  }

  function exportPage() {
    const page = getCurrentPage();
    if (!page) return;
    const blob = new Blob([`# ${page.title}\n\n${page.content}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page.title}.md`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function toggleFullscreen() {
    const win = state.win;
    if (!win) return;
    state.isFullscreen = !state.isFullscreen;

    if (state.isFullscreen) {
      win.style.left = '0';
      win.style.top = '0';
      win.style.transform = 'none';
      win.style.width = '100vw';
      win.style.height = '100vh';
      win.style.borderRadius = '0';
    } else {
      win.style.width = '';
      win.style.height = '';
      win.style.borderRadius = '';
      centerWindow();
    }
  }

  function showSaveIndicator() {
    const el = document.getElementById('np-save');
    if (!el) return;
    el.classList.remove('opacity-0');
    el.classList.add('opacity-100');
    setTimeout(() => {
      el.classList.remove('opacity-100');
      el.classList.add('opacity-0');
    }, 1500);
  }

  // --- DRAG WINDOW ---
  function setupWindowDrag() {
    const win = state.win;
    const bar = document.getElementById('notepad-titlebar');
    if (!win || !bar) return;

    let dragging = false;
    let sx = 0, sy = 0;
    let startLeft = 0, startTop = 0;

    const start = (e) => {
      if (state.isFullscreen) return;
      if (e.target.closest('button') || e.target.closest('.apple-control')) return;

      const p = e.type === 'touchstart' ? e.touches[0] : e;
      dragging = true;
      sx = p.clientX; sy = p.clientY;

      const rect = win.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      win.style.transition = 'none';
      e.preventDefault();
    };

    const move = (e) => {
      if (!dragging) return;
      const p = e.type === 'touchmove' ? e.touches[0] : e;
      const dx = p.clientX - sx;
      const dy = p.clientY - sy;

      const left = clamp(startLeft + dx, 0, window.innerWidth - win.offsetWidth);
      const top = clamp(startTop + dy, 0, window.innerHeight - win.offsetHeight);

      win.style.left = left + 'px';
      win.style.top = top + 'px';
      win.style.transform = 'none';

      e.preventDefault();
    };

    const end = () => {
      if (!dragging) return;
      dragging = false;
      win.style.transition = '';
    };

    bar.addEventListener('mousedown', start);
    bar.addEventListener('touchstart', start, { passive: false });
    document.addEventListener('mousemove', move, { passive: false });
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('mouseup', end);
    document.addEventListener('touchend', end);
  }

  function setupResizeHandle() {
    const win = state.win;
    const handle = document.getElementById('np-resize');
    if (!win || !handle) return;

    let resizing = false;
    let sw = 0, sh = 0, sx = 0, sy = 0;

    const start = (e) => {
      if (state.isFullscreen) return;
      resizing = true;
      const r = win.getBoundingClientRect();
      sw = r.width; sh = r.height;
      sx = e.clientX; sy = e.clientY;
      e.preventDefault();
    };

    const move = (e) => {
      if (!resizing) return;
      const w = clamp(sw + (e.clientX - sx), 420, window.innerWidth - 10);
      const h = clamp(sh + (e.clientY - sy), 320, window.innerHeight - 10);
      win.style.width = w + 'px';
      win.style.height = h + 'px';
      e.preventDefault();
    };

    const end = () => { resizing = false; };

    handle.addEventListener('mousedown', start);
    document.addEventListener('mousemove', move, { passive: false });
    document.addEventListener('mouseup', end);
  }

  // --- HOTKEYS / DARK MODE ---
  function setupHotkeys() {
    document.addEventListener('keydown', (e) => {
      if (!state.isOpen) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        savePages(true);
        showSaveIndicator();
      }
      if (e.key === 'Escape') closeNotepad();
    });
  }

  function observeDarkMode() {
    const mo = new MutationObserver(() => {
      const page = getCurrentPage();
      if (page) applyEditorTheme(page);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  // --- OPEN / CLOSE ---
  function openNotepad() {
    buildWindow();
    if (!state.win) state.win = document.getElementById('notepad-window');
    if (!state.win) return;

    state.win.classList.remove('hidden');
    state.win.classList.add('flex');
    state.win.style.opacity = '0';
    state.win.style.transform = state.isFullscreen ? 'none' : (state.win.style.transform || 'translate(-50%, -50%)');
    requestAnimationFrame(() => {
      state.win.style.transition = 'opacity 0.25s ease-out';
      state.win.style.opacity = '1';
    });

    state.isOpen = true;
    renderAll();
  }

  function closeNotepad() {
    if (!state.win) state.win = document.getElementById('notepad-window');
    if (!state.win) return;

    state.win.style.transition = 'opacity 0.2s ease-out';
    state.win.style.opacity = '0';
    setTimeout(() => {
      state.win.classList.add('hidden');
      state.win.classList.remove('flex');
      state.win.style.opacity = '1';
      state.win.style.transition = '';
    }, 200);

    hideDeleteModal();
    state.isOpen = false;
    savePages(true);
  }

  function toggleNotepad() {
    if (!state.isOpen) openNotepad();
    else closeNotepad();
  }

  // Expose globals used elsewhere
  window.toggleNotepad = toggleNotepad;
  window.openNotepad = openNotepad;
  window.closeNotepad = closeNotepad;

  // --- INIT ---
  function init() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    loadPages();
    createTrigger();
    // Build window lazily on first open
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
