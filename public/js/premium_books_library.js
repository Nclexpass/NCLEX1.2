// premium_books_library.js — Visual Library v7.2 (Masterpiece Edition)
// FEATURES: Diseño Tapa Dura de Lujo, Lomo Texturizado, Cinta de Seda, Visor Online
// MODIFICADO: Se elimina el botón flotante, se expone window.Library.open()

(function () {
  'use strict';

  // ===== DEPENDENCIAS =====
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

  // ===== CONFIGURACIÓN =====
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

  // ===== ESTILOS COMPLETOS =====
  function injectStyles() {
    if (document.getElementById('nclex-library-styles-v6')) return;
    const style = document.createElement('style');
    style.id = 'nclex-library-styles-v6';
    style.textContent = `
      /* ------------------------------------------------
         TEMA PREMIUM — Variables de lujo
      ------------------------------------------------ */
      :root {
        --lib-bg: #0a0c12;
        --lib-card: #14181f;
        --lib-border: rgba(255, 255, 255, 0.08);
        --lib-text: #f0f3fa;
        --lib-text-muted: #a0a8b8;
        --lib-gold: rgba(212, 175, 55, 0.6);
        --lib-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.6);
        --lib-ribbon: linear-gradient(145deg, #b31b1b, #7a0e0e);
        --lib-spine: linear-gradient(90deg, rgba(0,0,0,0.25) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0.2) 100%);
      }

      /* ------------------------------------------------
         MODAL — Galería de Cristal
      ------------------------------------------------ */
      #nclex-library-modal {
        position: fixed;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(16px) saturate(180%);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      }
      #nclex-library-modal.visible {
        display: flex;
        opacity: 1;
      }

      .nclex-lib-container {
        width: 100%;
        max-width: 1300px;
        height: 90vh;
        background: var(--lib-bg);
        border-radius: 32px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: scale(0.96);
        transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        box-shadow: 0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(212, 175, 55, 0.15);
        border: 1px solid rgba(212, 175, 55, 0.18);
      }
      #nclex-library-modal.visible .nclex-lib-container { transform: scale(1); }

      .nclex-lib-topbar {
        padding: 18px 22px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(180deg, rgba(255,255,255,0.04), transparent);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }

      .nclex-lib-title {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .nclex-lib-badge {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(212, 175, 55, 0.14);
        border: 1px solid rgba(212, 175, 55, 0.25);
        box-shadow: 0 10px 18px rgba(0,0,0,0.35);
      }

      .nclex-lib-badge i { color: rgba(212, 175, 55, 0.9); }

      .nclex-lib-actions button {
        width: 44px;
        height: 44px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.04);
        color: var(--lib-text);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .nclex-lib-actions button:hover { background: rgba(255,255,255,0.08); transform: translateY(-1px); }

      .nclex-lib-content { padding: 22px; }

      .nclex-lib-loading {
        height: 100%;
        min-height: 420px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
        color: var(--lib-text);
      }

      .nclex-lib-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: 22px;
      }

      /* ------------------------------------------------
         BOOK CARD — Tapa dura premium
      ------------------------------------------------ */
      .book-item {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .book-cover {
        position: relative;
        width: 100%;
        height: 260px;
        border-radius: 20px;
        overflow: hidden;
        cursor: pointer;
        box-shadow: var(--lib-shadow);
        border: 1px solid rgba(255,255,255,0.10);
        transform: translateZ(0);
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }
      .book-item:hover .book-cover {
        transform: translateY(-6px) scale(1.015);
        box-shadow: 0 30px 55px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.25);
      }

      .book-frame {
        position: absolute;
        inset: 10px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.10);
        pointer-events: none;
      }

      .book-ribbon {
        position: absolute;
        right: 16px;
        top: -10px;
        width: 18px;
        height: 80px;
        background: var(--lib-ribbon);
        border-radius: 8px;
        box-shadow: 0 10px 15px rgba(0,0,0,0.35);
        opacity: 0.95;
      }
      .book-ribbon::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 0;
        right: 0;
        margin: auto;
        width: 0;
        height: 0;
        border-left: 9px solid transparent;
        border-right: 9px solid transparent;
        border-top: 10px solid #7a0e0e;
      }

      .page-edge {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 20px;
        background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.18));
        opacity: 0.9;
        pointer-events: none;
      }

      .book-content {
        position: absolute;
        inset: 0;
        padding: 18px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .book-title {
        font-weight: 900;
        letter-spacing: -0.02em;
        color: rgba(255,255,255,0.92);
        text-shadow: 0 10px 18px rgba(0,0,0,0.55);
        font-size: 14px;
        line-height: 1.15;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .book-logo {
        width: 42px;
        height: 42px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.25);
        border: 1px solid rgba(255,255,255,0.14);
      }
      .book-logo i { color: rgba(212,175,55,0.9); font-size: 18px; }

      .book-details {
        padding: 12px 12px 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .book-meta-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        color: var(--lib-text-muted);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .custom-scrollbar::-webkit-scrollbar { width: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 999px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.16); }
    `;
    document.head.appendChild(style);
  }

  // ===== LÓGICA DE APERTURA =====
  function openLibrary() {
    state.isOpen = true;
    const modal = document.getElementById('nclex-library-modal');
    if (!modal) return;
    modal.classList.add('visible');
    fetchBooks();
  }

  function closeLibrary() {
    state.isOpen = false;
    const modal = document.getElementById('nclex-library-modal');
    if (!modal) return;
    modal.classList.remove('visible');
  }

  // ===== OBTENER LIBROS =====
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
      state.error = null;

      let lastError = null;

      for (let attempt = 0; attempt <= CONFIG.MAX_RETRIES; attempt++) {
        try {
          const res = await fetch(CONFIG.GITHUB_RELEASE_URL, { cache: 'no-store' });

          if (!res.ok) {
            // Intentar leer mensaje de error de GitHub
            let detail = '';
            try {
              const ct = (res.headers.get('content-type') || '').toLowerCase();
              if (ct.includes('application/json')) {
                const j = await res.json();
                detail = j && j.message ? ` — ${j.message}` : '';
              }
            } catch (_) {}

            throw new Error(`HTTP ${res.status} ${res.statusText}${detail}`);
          }

          const data = await res.json();

          state.books = (data.assets || [])
            .filter(a => (a.name || '').toLowerCase().endsWith('.pdf'))
            .map(a => ({
              id: a.id,
              name: (a.name || '').replace(/\.pdf$/i, '').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              size: a.size,
              url: a.browser_download_url,
              date: a.updated_at
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
          
          storageSet(CONFIG.STORAGE_KEY, state.books);
          storageSet(CONFIG.CACHE_TIME_KEY, Date.now());

          lastError = null;
          break; // éxito
        } catch (err) {
          lastError = err;

          // Retry con backoff simple
          if (attempt < CONFIG.MAX_RETRIES) {
            await new Promise(r => setTimeout(r, CONFIG.RETRY_DELAY * (attempt + 1)));
            continue;
          }
        }
      }

      if (lastError) throw lastError;

    } catch (e) {
      if (!silent) state.error = (e && e.message) ? e.message : "Error loading books";
    } finally {
      state.isLoading = false;
      render();
    }
  }

  // ===== RENDERIZADO =====
  function render() {
    const modal = document.getElementById('nclex-library-modal');
    if (!modal) return;
    const content = modal.querySelector('.nclex-lib-content');

    if (state.isLoading && !state.books.length) {
      content.innerHTML = `<div class="nclex-lib-loading"><i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4"></i><p class="font-bold tracking-wide">${t('PREPARANDO BIBLIOTECA...', 'PREPARING LIBRARY...')}</p></div>`;
      return;
    }

    if (!state.books.length) {
      if (state.error) {
        content.innerHTML = `
          <div class="nclex-lib-loading" style="gap:12px;">
            <p class="font-bold">${t('No se pudo cargar la biblioteca', 'Unable to load library')}</p>
            <p style="max-width:720px; text-align:center; opacity:0.85;">${escapeHtml(state.error)}</p>
            <button id="nclex-lib-retry" class="px-6 py-3 rounded-full font-black tracking-wide"
              style="background: rgba(212,175,55,0.18); border: 1px solid rgba(212,175,55,0.35); color: var(--lib-text);">
              ${t('REINTENTAR', 'RETRY')}
            </button>
            <p style="opacity:0.7; font-size:12px; text-align:center; max-width:760px;">
              ${t('Tip: GitHub puede limitar solicitudes (rate limit). Espera 1–2 minutos y reintenta.',
                   'Tip: GitHub may rate-limit requests. Wait 1–2 minutes and retry.')}
            </p>
          </div>
        `;
        const retryBtn = content.querySelector('#nclex-lib-retry');
        if (retryBtn) retryBtn.onclick = () => fetchFromAPI(false);
      } else {
        content.innerHTML = `<div class="nclex-lib-loading"><p>${t('No se encontraron libros', 'No books found')}</p></div>`;
      }
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
              <i class="fa-solid fa-file-pdf"></i>
              <span>${formatFileSize(book.size)}</span>
            </div>
          </div>

        </div>
        `;
      }).join('')}
    </div>`;
  }

  // ===== INIT DEL MODAL =====
  function init() {
    injectStyles();

    const modal = document.createElement('div');
    modal.id = 'nclex-library-modal';
    modal.innerHTML = `
      <div class="nclex-lib-container">
        <div class="nclex-lib-topbar">
          <div class="nclex-lib-title">
            <div class="nclex-lib-badge"><i class="fa-solid fa-books"></i></div>
            <div>
              <p class="text-xl font-black text-[var(--brand-text)] tracking-tight">${t('PREMIUM LIBRARY', 'PREMIUM LIBRARY')}</p>
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

    // Bind seguro (si existe el botón del Home)
    const premiumBtn = document.getElementById('premiumLibraryBtn');
    if (premiumBtn && !premiumBtn.__nclexLibBound) {
      premiumBtn.__nclexLibBound = true;
      premiumBtn.addEventListener('click', openLibrary);
    }

    // Carga inicial en segundo plano (opcional)
    setTimeout(fetchBooks, 2500);
  }

  function isSpanishUI() { const esEl = document.querySelector('.lang-es'); return esEl ? !esEl.classList.contains('hidden-lang') : true; }
  function t(es, en) { return isSpanishUI() ? es : en; }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
