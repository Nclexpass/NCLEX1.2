// 17_bnotepad.js — Full Page Notebook (Integrated Tab)
// Converted from Floating Window to Native View

(function () {
  'use strict';

  // --- CONFIG ---
  const CONFIG = {
    STORAGE_KEY: 'nclex_notebook_full',
    AUTO_SAVE_DELAY: 1000,
    MAX_PAGES: 100,
    COLORS: [
      { name: 'yellow', light: '#FEF9C3', dark: '#854D0E', border: '#FDE047' }, // Yellow-100 / Yellow-900
      { name: 'blue',   light: '#DBEAFE', dark: '#1E40AF', border: '#60A5FA' }, // Blue-100 / Blue-800
      { name: 'green',  light: '#DCFCE7', dark: '#166534', border: '#4ADE80' }, // Green-100 / Green-800
      { name: 'purple', light: '#F3E8FF', dark: '#6B21A8', border: '#A855F7' }, // Purple-100 / Purple-800
      { name: 'pink',   light: '#FCE7F3', dark: '#9D174D', border: '#F472B6' }, // Pink-100 / Pink-800
      { name: 'gray',   light: '#F3F4F6', dark: '#374151', border: '#9CA3AF' }  // Gray-100 / Gray-700
    ]
  };

  // --- STATE ---
  const state = {
    pages: [],
    currentIndex: 0,
    saveTimer: null,
    searchTerm: ''
  };

  // --- UTIL ---
  function safeJSONParse(raw, fallback) {
    try { return JSON.parse(raw); } catch { return fallback; }
  }

  function loadPages() {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    state.pages = raw ? safeJSONParse(raw, []) : [];
    if (!Array.isArray(state.pages)) state.pages = [];
    if (state.pages.length === 0) {
      addPage(false); // Add default page without saving immediately
      savePages(true);
    }
  }

  function savePages(immediate = false) {
    clearTimeout(state.saveTimer);
    const doSave = () => {
      try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state.pages));
        updateSaveStatus('Guardado / Saved');
      } catch (e) {
        console.error('Error saving notes:', e);
      }
    };
    if (immediate) doSave();
    else {
      updateSaveStatus('Escribiendo... / Typing...');
      state.saveTimer = setTimeout(doSave, CONFIG.AUTO_SAVE_DELAY);
    }
  }

  function makePage() {
    return {
      id: Date.now() + Math.random(),
      title: `Nota / Note ${state.pages.length + 1}`,
      content: '',
      colorIndex: 0,
      updatedAt: new Date().toISOString(),
      starred: false
    };
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
  }

  // --- RENDER ENGINE (HTML STRING) ---
  window.renderNotepadPage = function() {
    loadPages(); // Refresh data on navigate
    const activePage = state.pages[state.currentIndex] || state.pages[0];
    const activeColor = CONFIG.COLORS[activePage.colorIndex || 0];

    return `
      <div id="notepad-root" class="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 animate-fade-in">
         
         <div class="w-full lg:w-80 bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-gray-200 dark:border-brand-border flex flex-col overflow-hidden">
            <div class="p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20">
               <div class="flex justify-between items-center mb-4">
                  <h2 class="font-black text-xl text-slate-800 dark:text-white"><i class="fa-solid fa-book-bookmark mr-2 text-brand-blue"></i>Notes</h2>
                  <button data-np-action="add" class="bg-brand-blue text-white w-8 h-8 rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center">
                    <i class="fa-solid fa-plus"></i>
                  </button>
               </div>
               <div class="relative">
                 <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                 <input type="text" id="np-search" placeholder="Search notes..." class="w-full bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl py-2 pl-8 pr-3 text-sm focus:outline-none focus:border-brand-blue transition-colors">
               </div>
            </div>
            
            <div id="np-list" class="flex-1 overflow-y-auto p-3 space-y-2">
               ${renderSidebarList()}
            </div>
         </div>

         <div class="flex-1 bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-gray-200 dark:border-brand-border flex flex-col overflow-hidden relative">
            
            <div class="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-black/10">
               <div class="flex-1 mr-4">
                  <input type="text" id="np-title" value="${activePage.title}" class="w-full bg-transparent font-black text-xl text-slate-800 dark:text-white focus:outline-none placeholder-gray-400" placeholder="Note Title">
                  <p class="text-xs text-gray-500 mt-1 flex gap-2">
                     <span id="np-date">${formatDate(activePage.updatedAt)}</span>
                     <span id="np-status" class="text-brand-blue font-medium transition-opacity opacity-0">Guardado</span>
                  </p>
               </div>
               <div class="flex items-center gap-2">
                  <div class="flex -space-x-2 hover:space-x-1 transition-all mr-4">
                     ${CONFIG.COLORS.map((c, i) => `
                        <button data-np-action="color" data-idx="${i}" class="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 shadow-sm transform hover:scale-110 hover:z-10 transition-all" style="background-color: ${c.border}"></button>
                     `).join('')}
                  </div>
                  <button data-np-action="delete" class="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors" title="Delete Note">
                     <i class="fa-regular fa-trash-can"></i>
                  </button>
               </div>
            </div>

            <textarea id="np-editor" class="flex-1 w-full p-8 bg-transparent resize-none focus:outline-none text-slate-700 dark:text-gray-300 text-lg leading-relaxed font-medium" placeholder="Start typing your ideas here...">${activePage.content}</textarea>
            
            <div class="px-6 py-2 border-t border-gray-100 dark:border-white/5 text-xs text-gray-400 flex justify-between">
               <span id="np-chars">${activePage.content.length} chars</span>
               <span>Markdown Supported</span>
            </div>
         </div>
      </div>
    `;
  };

  function renderSidebarList() {
    return state.pages.map((p, idx) => {
      if (state.searchTerm && !p.title.toLowerCase().includes(state.searchTerm.toLowerCase()) && !p.content.toLowerCase().includes(state.searchTerm.toLowerCase())) return '';
      
      const isActive = idx === state.currentIndex;
      const color = CONFIG.COLORS[p.colorIndex || 0];
      
      return `
        <div data-np-action="select" data-idx="${idx}" class="group p-4 rounded-xl cursor-pointer transition-all border border-transparent ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-white/5'}">
           <div class="flex justify-between items-start mb-1">
              <h3 class="font-bold text-sm text-slate-800 dark:text-gray-200 truncate pr-2 ${isActive ? 'text-brand-blue' : ''}">${p.title || 'Untitled'}</h3>
              <div class="w-2 h-2 rounded-full" style="background-color: ${color.border}"></div>
           </div>
           <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">${p.content.substring(0, 60) || 'Empty note...'}</p>
        </div>
      `;
    }).join('');
  }

  // --- ACTIONS & EVENTS ---
  function bindEvents() {
    // Usamos delegación de eventos al documento para que funcione siempre que el HTML exista
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-np-action]');
      if (!target) return;
      
      const action = target.dataset.npAction;
      const idx = parseInt(target.dataset.idx);

      if (action === 'select') selectPage(idx);
      if (action === 'add') addPage();
      if (action === 'delete') deletePage();
      if (action === 'color') setPageColor(idx);
    });

    document.addEventListener('input', (e) => {
      if (e.target.id === 'np-title') updateTitle(e.target.value);
      if (e.target.id === 'np-editor') updateContent(e.target.value);
      if (e.target.id === 'np-search') {
        state.searchTerm = e.target.value;
        refreshSidebar();
      }
    });
  }

  function selectPage(idx) {
    state.currentIndex = idx;
    // Full re-render is safer to update editor state
    refreshAll();
  }

  function addPage(shouldRefresh = true) {
    if (state.pages.length >= CONFIG.MAX_PAGES) return alert('Notebook full');
    const newPage = makePage();
    state.pages.unshift(newPage); // Add to top
    state.currentIndex = 0;
    savePages(true);
    if (shouldRefresh) refreshAll();
  }

  function deletePage() {
    if (!confirm('Are you sure you want to delete this note?')) return;
    state.pages.splice(state.currentIndex, 1);
    if (state.pages.length === 0) addPage(false);
    state.currentIndex = 0;
    savePages(true);
    refreshAll();
  }

  function updateTitle(val) {
    state.pages[state.currentIndex].title = val;
    state.pages[state.currentIndex].updatedAt = new Date().toISOString();
    savePages();
    refreshSidebar(); // Solo refrescamos sidebar para no perder foco
  }

  function updateContent(val) {
    state.pages[state.currentIndex].content = val;
    state.pages[state.currentIndex].updatedAt = new Date().toISOString();
    document.getElementById('np-chars').textContent = `${val.length} chars`;
    savePages();
  }

  function setPageColor(colorIdx) {
    state.pages[state.currentIndex].colorIndex = colorIdx;
    savePages(true);
    refreshSidebar();
  }

  function updateSaveStatus(msg) {
    const el = document.getElementById('np-status');
    if (el) {
      el.textContent = msg;
      el.style.opacity = '1';
      setTimeout(() => el.style.opacity = '0', 2000);
    }
  }

  function refreshAll() {
    // Si estamos en la ruta 'notepad', actualizamos el DOM
    if (document.getElementById('notepad-root')) {
       document.getElementById('app-view').innerHTML = window.renderNotepadPage();
    }
  }

  function refreshSidebar() {
    const list = document.getElementById('np-list');
    if (list) list.innerHTML = renderSidebarList();
  }

  // Init
  bindEvents();

})();