// premium_books_library.js — Visual Library v7.1 (Masterpiece Edition)
// FEATURES: Diseño Tapa Dura de Lujo, Lomo Texturizado, Cinta de Seda, Visor Online
// MODIFICADO: Se elimina el botón flotante, se expone window.Library.open()

(function () {
  'use strict';

  // ===== DEPENDENCIAS (sin cambios) =====
  const U = window.NCLEXUtils || {
    $: (s) => document.querySelector(s),
    $$: (s) => Array.from(document.querySelectorAll(s)),
    storageGet: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } },
    storageSet: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
    escapeHtml: (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
    format: {} 
  };
  const { storageGet, storageSet, escapeHtml } = U;

  const formatFileSize = (U.format && U.format.formatFileSize) ? U.format.formatFileSize : (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // ===== CONFIGURACIÓN — PALETA ÉLITE =====
  const CONFIG = {
    GITHUB_RELEASE_URL: 'https://api.github.com/repos/Nclexpass/NCLEX1.2/releases/tags/BOOKS',
    CACHE_DURATION: 5 * 60 * 1000, 
    STORAGE_KEY: 'books_cache',
    CACHE_TIME_KEY: 'books_cache_time',
    MAX_RETRIES: 2,
    RETRY_DELAY: 1500,
    COVERS: [
      ['#1a1e2c', '#2d3748'],
      ['#3c2a4d', '#4a2c5d'],
      ['#1f3a3f', '#2b4a55'],
      ['#5e3a3a', '#7a4c4c'],
      ['#2d4a3b', '#3e6b4b'],
      ['#2a3f5e', '#3c5a7d'],
      ['#4a3b2a', '#63543a']
    ]
  };

  // ===== ESTADO =====
  const state = { books: [], isLoading: false, error: null, isOpen: false };

  function getCoverColor(title) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) { hash = title.charCodeAt(i) + ((hash << 5) - hash); }
    const index = Math.abs(hash) % CONFIG.COVERS.length;
    return CONFIG.COVERS[index];
  }

  // ===== ESTILOS (sin cambios) =====
  function injectStyles() {
    if (document.getElementById('nclex-library-styles-v6')) return;
    const style = document.createElement('style');
    style.id = 'nclex-library-styles-v6';
    style.textContent = ` ... `; // (mismo contenido, omitido por brevedad)
    document.head.appendChild(style);
  }

  // ===== FETCH DATOS (sin cambios) =====
  async function fetchBooks() {
    const cached = storageGet(CONFIG.STORAGE_KEY, null);
    const cachedTime = storageGet(CONFIG.CACHE_TIME_KEY, 0);
    
    if (cached && (Date.now() - cachedTime) < CONFIG.CACHE_DURATION) {
      state.books = cached;
      render();
      fetchFromAPI(true);
      return;
    }
    await fetchFromAPI(false);
  }

  async function fetchFromAPI(silent) {
    if (!silent) { state.isLoading = true; render(); }
    try {
      const res = await fetch(CONFIG.GITHUB_RELEASE_URL);
      if (!res.ok) throw new Error();
      const data = await res.json();
      state.books = (data.assets || [])
        .filter(a => a.name.toLowerCase().endsWith('.pdf'))
        .map(a => ({
          id: a.id,
          name: a.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          size: a.size,
          url: a.browser_download_url,
          date: a.updated_at
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      storageSet(CONFIG.STORAGE_KEY, state.books);
      storageSet(CONFIG.CACHE_TIME_KEY, Date.now());
    } catch (e) {
      if (!silent) state.error = "Error loading books";
    } finally {
      state.isLoading = false;
      render();
    }
  }

  // ===== RENDERIZADO (sin cambios) =====
  function render() {
    const modal = document.getElementById('nclex-library-modal');
    if (!modal) return;
    const content = modal.querySelector('.nclex-lib-content');

    if (state.isLoading && !state.books.length) {
      content.innerHTML = `<div class="nclex-lib-loading"><i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4"></i><p class="font-bold tracking-wide">${t('PREPARANDO BIBLIOTECA...', 'PREPARING LIBRARY...')}</p></div>`;
      return;
    }

    if (!state.books.length) {
      content.innerHTML = `<div class="nclex-lib-loading"><p>${t('No se encontraron libros', 'No books found')}</p></div>`;
      return;
    }

    content.innerHTML = `<div class="nclex-lib-grid">
      ${state.books.map(book => {
        const [bgFrom, bgTo] = getCoverColor(book.name);
        const googleViewerUrl = `https://docs.google.com/viewer?embedded=false&url=${encodeURIComponent(book.url)}`;

        return `
        <div class="book-item group">
          
          <div class="book-cover" onclick="window.open('${googleViewerUrl}', '_blank')" 
               style="background: radial-gradient(circle at 30% 40%, ${bgFrom}, ${bgTo});">
            
            <div class="book-ribbon"></div>
            <div class="book-frame"></div>
            <div class="page-edge"></div>
            
            <div class="book-content">
              <div class="book-title">${escapeHtml(book.name)}</div>
              <div class="book-logo"><i class="fa-solid fa-staff-snake"></i></div>
            </div>

            <div style="position:absolute; inset:0; background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz4KPC9zdmc+'); pointer-events:none; opacity:0.2;"></div>
            
            <div style="position:absolute; left:0; top:0; bottom:0; width:12px; background: linear-gradient(to right, rgba(255,255,255,0.1), transparent); pointer-events:none;"></div>
          </div>
          
          <div class="book-details">
            <div class="book-meta-info">
              <i class="fa-solid fa-file-pdf" style="color:#b31b1b;"></i> ${formatFileSize(book.size)}
            </div>
            
            <div class="book-actions">
                <a href="${googleViewerUrl}" target="_blank" class="action-btn btn-read">
                    <i class="fa-solid fa-book-open"></i> ${t('LEER', 'READ')}
                </a>
                <a href="${book.url}" target="_blank" class="action-btn btn-down" title="${t('Descargar', 'Download')}">
                    <i class="fa-solid fa-download"></i>
                </a>
            </div>
          </div>
        </div>
        `;
      }).join('')}
    </div>`;
  }

  // ===== FUNCIONES DE APERTURA/CIERRE =====
  function openLibrary() {
    state.isOpen = true;
    const modal = document.getElementById('nclex-library-modal');
    if (modal) {
      modal.classList.add('visible');
      if (!state.books.length) fetchBooks();
    }
  }

  function closeLibrary() {
    state.isOpen = false;
    const modal = document.getElementById('nclex-library-modal');
    if (modal) modal.classList.remove('visible');
  }

  // ===== INICIALIZACIÓN (sin botón flotante) =====
  function init() {
    // No se crea el botón flotante, solo el modal y los estilos
    if (document.getElementById('nclex-library-modal')) return;
    
    injectStyles();

    const modal = document.createElement('div');
    modal.id = 'nclex-library-modal';
    modal.innerHTML = `
      <div class="nclex-lib-container">
        <div class="nclex-lib-header">
          <div>
            <h2 class="font-black text-2xl text-[var(--brand-text)] flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                <i class="fa-solid fa-book-medical"></i>
              </span>
              NCLEX LIBRARY
            </h2>
            <p class="text-xs text-[var(--brand-text-muted)] mt-1 ml-1 font-bold tracking-widest uppercase opacity-70">
              ${t('COLECCIÓN OFICIAL', 'OFFICIAL COLLECTION')}
            </p>
          </div>
          <button class="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition"
            onclick="window.Library?.close()">
            <i class="fa-solid fa-xmark text-xl text-[var(--brand-text-muted)]"></i>
          </button>
        </div>
        <div class="nclex-lib-content flex-1 overflow-y-auto bg-[var(--brand-bg)] custom-scrollbar"></div>
      </div>
    `;
    modal.onclick = (e) => { if(e.target === modal) closeLibrary(); };
    document.body.appendChild(modal);

    // Exponer API pública
    window.Library = {
      open: openLibrary,
      close: closeLibrary,
      isOpen: () => state.isOpen
    };

    // Carga inicial en segundo plano (opcional)
    setTimeout(fetchBooks, 2500);
  }

  function isSpanishUI() { const esEl = document.querySelector('.lang-es'); return esEl ? !esEl.classList.contains('hidden-lang') : true; }
  function t(es, en) { return isSpanishUI() ? es : en; }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();