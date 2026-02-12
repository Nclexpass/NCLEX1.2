// premium_books_library.js — Apple-style PDF Library (VERSIÓN CORREGIDA 3.0)
// FIXED: Mejor manejo de errores, integración con tema, caché de resultados

(function () {
  'use strict';

  // ===== DEPENDENCIAS =====
  const U = window.NCLEXUtils || {
    $: (s) => document.querySelector(s),
    $$: (s) => Array.from(document.querySelectorAll(s)),
    storageGet: (k, d) => d,
    storageSet: () => false,
    debounce: (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; },
    escapeHtml: (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
    format: { truncate: (t, m) => t.length > m ? t.slice(0, m) + '...' : t, formatFileSize: (b) => b < 1024 * 1024 ? (b / 1024).toFixed(0) + ' KB' : (b / (1024 * 1024)).toFixed(1) + ' MB' }
  };

  const { $, $$, storageGet, storageSet, debounce, escapeHtml, format: { truncate, formatFileSize } } = U;

  // ===== CONFIGURACIÓN =====
  const CONFIG = {
    GITHUB_RELEASE_URL: 'https://api.github.com/repos/Nclexpass/NCLEX1.2/releases/tags/BOOKS',
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
    STORAGE_KEY: 'books_cache',
    CACHE_TIME_KEY: 'books_cache_time',
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
  };

  // ===== ESTADO =====
  const state = {
    books: [],
    isLoading: false,
    error: null,
    lastFetch: 0,
    retryCount: 0,
    isOpen: false
  };

  // ===== ESTILOS =====
  function injectStyles() {
    if (document.getElementById('nclex-library-styles-v3')) return;

    const style = document.createElement('style');
    style.id = 'nclex-library-styles-v3';
    style.textContent = `
      /* Botón flotante */
      #nclex-library-btn {
        position: fixed;
        top: 24px;
        right: 24px;
        width: 48px;
        height: 48px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgb(var(--brand-blue-rgb)), rgba(var(--brand-blue-rgb), 0.8));
        border: none;
        box-shadow: 0 8px 25px rgba(var(--brand-blue-rgb), 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 9980;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        color: white;
      }
      
      #nclex-library-btn:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 12px 35px rgba(var(--brand-blue-rgb), 0.4);
      }
      
      #nclex-library-btn:active {
        transform: scale(0.95);
      }

      /* Badge de notificación */
      .nclex-lib-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #ef4444;
        border: 2px solid var(--brand-card, white);
        display: none;
      }
      
      .dark .nclex-lib-badge {
        border-color: var(--brand-card, #1c1c1e);
      }
      
      .nclex-lib-badge.visible {
        display: block;
      }

      /* Modal */
      #nclex-library-modal {
        position: fixed;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      #nclex-library-modal.visible {
        display: flex;
        opacity: 1;
      }

      /* Contenedor principal */
      .nclex-lib-container {
        width: 100%;
        max-width: 900px;
        max-height: 85vh;
        background: var(--brand-card, rgba(255, 255, 255, 0.95));
        border: 1px solid var(--brand-border, rgba(0, 0, 0, 0.1));
        border-radius: 20px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: scale(0.95);
        transition: transform 0.3s ease;
      }
      
      #nclex-library-modal.visible .nclex-lib-container {
        transform: scale(1);
      }
      
      .dark .nclex-lib-container {
        background: var(--brand-card, rgba(28, 28, 30, 0.95));
        border-color: var(--brand-border, rgba(255, 255, 255, 0.1));
      }

      /* Header */
      .nclex-lib-header {
        padding: 20px 24px;
        background: linear-gradient(to bottom, var(--brand-bg, #f5f5f7), var(--brand-card, white));
        border-bottom: 1px solid var(--brand-border, rgba(0, 0, 0, 0.1));
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .dark .nclex-lib-header {
        background: linear-gradient(to bottom, rgba(255,255,255,0.05), var(--brand-card, #1c1c1e));
      }

      /* Grid de libros */
      .nclex-lib-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
        padding: 24px;
        overflow-y: auto;
        max-height: calc(85vh - 140px);
      }

      @media (max-width: 640px) {
        .nclex-lib-grid {
          grid-template-columns: 1fr;
          padding: 16px;
        }
      }

      /* Tarjeta de libro */
      .nclex-lib-book {
        background: var(--brand-bg, #f5f5f7);
        border: 1px solid var(--brand-border, rgba(0, 0, 0, 0.05));
        border-radius: 16px;
        padding: 20px;
        display: flex;
        gap: 16px;
        transition: all 0.2s ease;
        cursor: pointer;
      }
      
      .nclex-lib-book:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border-color: rgba(var(--brand-blue-rgb), 0.3);
      }
      
      .dark .nclex-lib-book {
        background: rgba(255, 255, 255, 0.05);
      }

      /* Thumbnail */
      .nclex-lib-thumb {
        width: 70px;
        height: 95px;
        border-radius: 8px;
        background: linear-gradient(135deg, #475569 0%, #1e293b 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .nclex-lib-thumb i {
        color: white;
        font-size: 28px;
        opacity: 0.9;
      }

      /* Info del libro */
      .nclex-lib-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      
      .nclex-lib-title {
        font-weight: 700;
        font-size: 15px;
        color: var(--brand-text, #1c1c1e);
        line-height: 1.3;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .nclex-lib-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 12px;
        color: var(--brand-text-muted, #6b7280);
        margin-bottom: 12px;
      }
      
      .nclex-lib-meta span {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      /* Botón de descarga */
      .nclex-lib-download {
        margin-top: auto;
        padding: 10px 16px;
        border-radius: 10px;
        background: rgb(var(--brand-blue-rgb));
        color: white;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.15s ease;
        border: none;
        cursor: pointer;
      }
      
      .nclex-lib-download:hover {
        opacity: 0.9;
        transform: scale(1.02);
      }
      
      .nclex-lib-download:active {
        transform: scale(0.98);
      }

      /* Estados */
      .nclex-lib-loading,
      .nclex-lib-error,
      .nclex-lib-empty {
        padding: 60px 24px;
        text-align: center;
        color: var(--brand-text-muted, #6b7280);
      }
      
      .nclex-lib-loading-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid var(--brand-bg, #e5e7eb);
        border-top-color: rgb(var(--brand-blue-rgb));
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .nclex-lib-error-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #fee2e2;
        color: #dc2626;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        margin: 0 auto 16px;
      }
      
      .dark .nclex-lib-error-icon {
        background: rgba(220, 38, 38, 0.2);
      }

      /* Footer */
      .nclex-lib-footer {
        padding: 16px 24px;
        background: var(--brand-bg, #f5f5f7);
        border-top: 1px solid var(--brand-border, rgba(0, 0, 0, 0.05));
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: var(--brand-text-muted, #6b7280);
      }
      
      .nclex-lib-refresh {
        padding: 8px 16px;
        border-radius: 8px;
        background: transparent;
        border: 1px solid var(--brand-border, rgba(0, 0, 0, 0.1));
        color: var(--brand-text, #1c1c1e);
        font-size: 12px;
        cursor: pointer;
        transition: all 0.15s;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      
      .nclex-lib-refresh:hover {
        background: var(--brand-card, white);
      }
    `;
    document.head.appendChild(style);
  }

  // ===== UTILIDADES =====

  function isSpanishUI() {
    const esEl = document.querySelector('.lang-es');
    return !!(esEl && !esEl.classList.contains('hidden-lang'));
  }

  function t(es, en) {
    return isSpanishUI() ? es : en;
  }

  function getCachedData() {
    const cached = storageGet(CONFIG.STORAGE_KEY, null);
    const cachedTime = storageGet(CONFIG.CACHE_TIME_KEY, 0);
    const now = Date.now();
    
    if (cached && (now - cachedTime) < CONFIG.CACHE_DURATION) {
      console.log('📚 Using cached books data');
      return cached;
    }
    return null;
  }

  function setCachedData(data) {
    storageSet(CONFIG.STORAGE_KEY, data);
    storageSet(CONFIG.CACHE_TIME_KEY, Date.now());
  }

  // ===== FETCH DE DATOS =====

  async function fetchBooks() {
    // Intentar usar caché primero
    const cached = getCachedData();
    if (cached) {
      state.books = cached;
      state.isLoading = false;
      render();
      // Fetch en background para actualizar
      fetchFromAPI(true);
      return;
    }

    await fetchFromAPI(false);
  }

  async function fetchFromAPI(silent = false) {
    if (!silent) {
      state.isLoading = true;
      state.error = null;
      render();
    }

    try {
      const response = await fetch(CONFIG.GITHUB_RELEASE_URL, {
        cache: 'no-store',
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const release = await response.json();

      state.books = (release.assets || [])
        .filter(a => (a.name || '').toLowerCase().endsWith('.pdf'))
        .map(a => ({
          id: a.id,
          name: cleanFileName(a.name),
          rawName: a.name,
          size: a.size || 0,
          downloadUrl: a.browser_download_url,
          updatedAt: a.updated_at ? new Date(a.updated_at) : null,
          downloadCount: a.download_count || 0
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      state.lastFetch = Date.now();
      state.retryCount = 0;
      setCachedData(state.books);

    } catch (error) {
      console.error('Error fetching books:', error);
      
      // Reintentar si no es silent y no hemos agotado reintentos
      if (!silent && state.retryCount < CONFIG.MAX_RETRIES) {
        state.retryCount++;
        console.log(`Retrying... (${state.retryCount}/${CONFIG.MAX_RETRIES})`);
        setTimeout(() => fetchFromAPI(false), CONFIG.RETRY_DELAY * state.retryCount);
        return;
      }

      state.error = error.message;
      
      // Usar caché vieja si existe como fallback
      const oldCache = storageGet(CONFIG.STORAGE_KEY, null);
      if (oldCache) {
        state.books = oldCache;
        state.error = t('Datos desactualizados', 'Stale data');
      }
    } finally {
      state.isLoading = false;
      render();
    }
  }

  function cleanFileName(filename) {
    return filename
      .replace(/\.pdf$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }

  // ===== RENDERIZADO =====

  function render() {
    const modal = document.getElementById('nclex-library-modal');
    if (!modal) return;

    const content = modal.querySelector('.nclex-lib-content') || modal;

    if (state.isLoading && state.books.length === 0) {
      content.innerHTML = `
        <div class="nclex-lib-loading">
          <div class="nclex-lib-loading-spinner"></div>
          <p class="font-medium">${t('Cargando biblioteca...', 'Loading library...')}</p>
          <p class="text-sm opacity-70 mt-2">${t('Conectando con GitHub', 'Connecting to GitHub')}</p>
        </div>
      `;
      return;
    }

    if (state.error && state.books.length === 0) {
      content.innerHTML = `
        <div class="nclex-lib-error">
          <div class="nclex-lib-error-icon">
            <i class="fa-solid fa-exclamation-triangle"></i>
          </div>
          <h3 class="font-bold text-lg text-[var(--brand-text)] mb-2">
            ${t('Error de conexión', 'Connection error')}
          </h3>
          <p class="text-sm mb-4">${escapeHtml(state.error)}</p>
          <button onclick="window.Library.refresh()" 
            class="px-4 py-2 rounded-xl bg-[rgb(var(--brand-blue-rgb))] text-white font-bold">
            ${t('Reintentar', 'Retry')}
          </button>
        </div>
      `;
      return;
    }

    if (state.books.length === 0) {
      content.innerHTML = `
        <div class="nclex-lib-empty">
          <div class="text-5xl mb-4">📚</div>
          <p class="font-medium">${t('No se encontraron libros', 'No books found')}</p>
        </div>
      `;
      return;
    }

    const booksHtml = state.books.map(book => {
      const size = formatFileSize(book.size);
      const date = book.updatedAt 
        ? book.updatedAt.toLocaleDateString(isSpanishUI() ? 'es-ES' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : '';

      return `
        <div class="nclex-lib-book">
          <div class="nclex-lib-thumb">
            <i class="fa-solid fa-file-pdf"></i>
          </div>
          <div class="nclex-lib-info">
            <div class="nclex-lib-title" title="${escapeHtml(book.name)}">
              ${escapeHtml(book.name)}
            </div>
            <div class="nclex-lib-meta">
              ${size ? `<span><i class="fa-solid fa-hard-drive"></i> ${size}</span>` : ''}
              ${date ? `<span><i class="fa-regular fa-calendar"></i> ${date}</span>` : ''}
              ${book.downloadCount ? `<span><i class="fa-solid fa-download"></i> ${book.downloadCount}</span>` : ''}
            </div>
            <a href="${book.downloadUrl}" target="_blank" rel="noopener noreferrer"
               class="nclex-lib-download"
               onclick="window.Library.trackDownload('${book.id}')">
              <i class="fa-solid fa-cloud-arrow-down"></i>
              ${t('Descargar PDF', 'Download PDF')}
            </a>
          </div>
        </div>
      `;
    }).join('');

    content.innerHTML = `<div class="nclex-lib-grid">${booksHtml}</div>`;
  }

  // ===== DOM ELEMENTS =====

  function ensureElements() {
    if (document.getElementById('nclex-library-btn')) return;

    injectStyles();

    // Botón flotante
    const btn = document.createElement('button');
    btn.id = 'nclex-library-btn';
    btn.setAttribute('aria-label', t('Abrir biblioteca', 'Open library'));
    btn.innerHTML = `
      <i class="fa-solid fa-book-open text-xl"></i>
      <span class="nclex-lib-badge" id="nclex-lib-badge"></span>
    `;
    btn.addEventListener('click', open);
    document.body.appendChild(btn);

    // Modal
    const modal = document.createElement('div');
    modal.id = 'nclex-library-modal';
    modal.innerHTML = `
      <div class="nclex-lib-container">
        <div class="nclex-lib-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
              <i class="fa-solid fa-book-open"></i>
            </div>
            <div>
              <h2 class="font-bold text-[var(--brand-text)]">Library</h2>
              <p class="text-xs text-[var(--brand-text-muted)]">
                ${state.books.length} ${t('PDFs disponibles', 'PDFs available')}
              </p>
            </div>
          </div>
          <button onclick="window.Library.close()" 
            class="w-10 h-10 rounded-full hover:bg-[var(--brand-bg)] flex items-center justify-center text-[var(--brand-text)] transition">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        
        <div class="nclex-lib-content flex-1 overflow-hidden"></div>
        
        <div class="nclex-lib-footer">
          <span>
            <i class="fa-brands fa-github mr-1"></i>
            ${t('Fuente: GitHub Releases', 'Source: GitHub Releases')}
          </span>
          <button onclick="window.Library.refresh()" class="nclex-lib-refresh">
            <i class="fa-solid fa-rotate"></i>
            ${t('Actualizar', 'Refresh')}
          </button>
        </div>
      </div>
    `;

    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isOpen) close();
    });

    document.body.appendChild(modal);
  }

  // ===== API PÚBLICA =====

  function open() {
    ensureElements();
    const modal = document.getElementById('nclex-library-modal');
    if (!modal) return;

    state.isOpen = true;
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';

    if (state.books.length === 0 && !state.isLoading) {
      fetchBooks();
    } else {
      render();
    }
  }

  function close() {
    const modal = document.getElementById('nclex-library-modal');
    if (!modal) return;

    state.isOpen = false;
    modal.classList.remove('visible');
    document.body.style.overflow = '';
  }

  async function refresh() {
    state.retryCount = 0;
    storageSet(CONFIG.CACHE_TIME_KEY, 0); // Invalidar caché
    await fetchBooks();
  }

  function trackDownload(bookId) {
    // Analytics opcional
    console.log('📥 Download tracked:', bookId);
  }

  function showNotification() {
    const badge = document.getElementById('nclex-lib-badge');
    if (badge) badge.classList.add('visible');
  }

  // Exponer API
  window.Library = {
    open,
    close,
    refresh,
    trackDownload,
    showNotification,
    getBooks: () => state.books,
    isOpen: () => state.isOpen
  };

  // Inicialización
  function init() {
    ensureElements();
    // Precargar en background
    setTimeout(() => {
      if (!state.isOpen) fetchBooks();
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();