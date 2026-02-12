// premium_books_library.js — Visual Library v4.0 (Apple Books Style)
// FEATURES: Portadas generadas automáticamente, Efecto 3D, Caché, Fechas arregladas

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
    // Paleta de colores para las portadas (Estilo Medicina/Moderno)
    COVERS: [
      ['#3b82f6', '#1d4ed8'], // Azul
      ['#8b5cf6', '#6d28d9'], // Púrpura
      ['#10b981', '#047857'], // Esmeralda
      ['#f59e0b', '#b45309'], // Ámbar
      ['#ec4899', '#be185d'], // Rosa
      ['#6366f1', '#4338ca'], // Índigo
      ['#0ea5e9', '#0369a1'], // Celeste
      ['#64748b', '#334155']  // Slate
    ]
  };

  // ===== ESTADO =====
  const state = { books: [], isLoading: false, error: null, isOpen: false };

  // ===== GENERADOR DE PORTADAS =====
  // Asigna un color consistente basado en el nombre del libro
  function getCoverColor(title) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % CONFIG.COVERS.length;
    return CONFIG.COVERS[index];
  }

  // ===== ESTILOS (CSS ART 3D) =====
  function injectStyles() {
    if (document.getElementById('nclex-library-styles-v4')) return;
    const style = document.createElement('style');
    style.id = 'nclex-library-styles-v4';
    style.textContent = `
      /* Botón flotante */
      #nclex-library-btn { position: fixed; top: 24px; right: 24px; width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, rgb(var(--brand-blue-rgb)), rgba(var(--brand-blue-rgb), 0.8)); border: none; box-shadow: 0 8px 25px rgba(var(--brand-blue-rgb), 0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 9980; transition: all 0.2s; color: white; }
      #nclex-library-btn:hover { transform: translateY(-2px) scale(1.05); }
      
      /* Modal */
      #nclex-library-modal { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 9999; opacity: 0; transition: opacity 0.3s ease; }
      #nclex-library-modal.visible { display: flex; opacity: 1; }
      
      .nclex-lib-container { width: 100%; max-width: 1000px; height: 85vh; background: var(--brand-bg); border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; transform: scale(0.95); transition: transform 0.3s ease; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
      #nclex-library-modal.visible .nclex-lib-container { transform: scale(1); }

      /* Grid de Libros (Estantería) */
      .nclex-lib-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); 
        gap: 32px 24px; 
        padding: 40px; 
        overflow-y: auto;
      }
      
      /* DISEÑO DE LIBRO 3D */
      .book-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        perspective: 1000px;
        cursor: pointer;
        group: hover;
      }

      .book-cover {
        width: 100%;
        aspect-ratio: 2/3;
        border-radius: 4px 12px 12px 4px;
        position: relative;
        box-shadow: 
          inset 4px 0 10px rgba(0,0,0,0.1), /* Sombra interior lomo */
          inset -1px 0 2px rgba(255,255,255,0.3), /* Brillo borde */
          5px 5px 15px rgba(0,0,0,0.15); /* Sombra 3D */
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 12px;
      }

      .book-item:hover .book-cover {
        transform: translateY(-8px) rotateY(-5deg);
        box-shadow: 
          inset 4px 0 10px rgba(0,0,0,0.1),
          15px 20px 30px rgba(0,0,0,0.25);
      }

      /* Decoración del libro */
      .book-spine {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 12px;
        background: rgba(0,0,0,0.2);
        z-index: 10;
        border-right: 1px solid rgba(255,255,255,0.1);
      }
      
      .book-content {
        z-index: 20;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .book-title {
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        color: white;
        font-size: 13px;
        line-height: 1.3;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
        letter-spacing: -0.02em;
      }

      .book-icon {
        color: rgba(255,255,255,0.8);
        font-size: 20px;
        align-self: flex-end;
      }

      .book-details {
        margin-top: 12px;
        text-align: center;
        width: 100%;
      }
      
      .book-meta-title {
        font-size: 12px;
        font-weight: 600;
        color: var(--brand-text);
        margin-bottom: 4px;
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis; 
      }
      
      .book-meta-info {
        font-size: 10px;
        color: var(--brand-text-muted);
        display: flex;
        justify-content: center;
        gap: 8px;
      }

      /* Header & Footer */
      .nclex-lib-header { padding: 20px; border-bottom: 1px solid var(--brand-border); display: flex; justify-content: space-between; align-items: center; }
      .nclex-lib-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--brand-text-muted); }
    `;
    document.head.appendChild(style);
  }

  // ===== UTILIDADES =====
  function isSpanishUI() {
    const esEl = document.querySelector('.lang-es');
    return esEl ? !esEl.classList.contains('hidden-lang') : true;
  }
  function t(es, en) { return isSpanishUI() ? es : en; }

  // ===== FETCH DATOS =====
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

  // ===== RENDERIZADO VISUAL =====
  function render() {
    const modal = document.getElementById('nclex-library-modal');
    if (!modal) return;
    const content = modal.querySelector('.nclex-lib-content');

    if (state.isLoading && !state.books.length) {
      content.innerHTML = `<div class="nclex-lib-loading"><i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4"></i><p>${t('Cargando biblioteca...', 'Loading Library...')}</p></div>`;
      return;
    }

    if (!state.books.length) {
      content.innerHTML = `<div class="nclex-lib-loading"><p>${t('No se encontraron libros', 'No books found')}</p></div>`;
      return;
    }

    content.innerHTML = `<div class="nclex-lib-grid">
      ${state.books.map(book => {
        const [bgFrom, bgTo] = getCoverColor(book.name);
        // Manejo seguro de fecha
        let dateStr = '';
        try {
           const d = new Date(book.date);
           if(!isNaN(d)) dateStr = d.toLocaleDateString(isSpanishUI() ? 'es-ES' : 'en-US', {month:'short', year:'numeric'});
        } catch(e) {}

        return `
        <a href="${book.url}" target="_blank" class="book-item group">
          <div class="book-cover" style="background: linear-gradient(135deg, ${bgFrom}, ${bgTo});">
            <div class="book-spine"></div>
            <div class="book-content">
              <div class="book-title">${escapeHtml(book.name)}</div>
              <div class="book-icon"><i class="fa-solid fa-book-medical"></i></div>
            </div>
            <div style="position:absolute; inset:0; background: linear-gradient(to right, rgba(255,255,255,0.1) 0%, transparent 100%); pointer-events:none;"></div>
          </div>
          <div class="book-details">
            <div class="book-meta-title">${escapeHtml(book.name)}</div>
            <div class="book-meta-info">
              <span>${formatFileSize(book.size)}</span>
              ${dateStr ? `<span>• ${dateStr}</span>` : ''}
            </div>
            <div class="mt-2 text-xs font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
               ${t('Descargar', 'Download')} <i class="fa-solid fa-arrow-down"></i>
            </div>
          </div>
        </a>
        `;
      }).join('')}
    </div>`;
  }

  // ===== INICIALIZACIÓN =====
  function init() {
    if (document.getElementById('nclex-library-btn')) return;
    injectStyles();

    // Botón flotante
    const btn = document.createElement('button');
    btn.id = 'nclex-library-btn';
    btn.innerHTML = `<i class="fa-solid fa-book-open text-xl"></i>`;
    btn.onclick = () => {
      state.isOpen = true;
      document.getElementById('nclex-library-modal').classList.add('visible');
      if(!state.books.length) fetchBooks();
    };
    document.body.appendChild(btn);

    // Modal Estructura
    const modal = document.createElement('div');
    modal.id = 'nclex-library-modal';
    modal.innerHTML = `
      <div class="nclex-lib-container">
        <div class="nclex-lib-header">
          <h2 class="font-bold text-xl text-[var(--brand-text)] flex items-center gap-2">
            <i class="fa-solid fa-graduation-cap text-blue-500"></i> Premium Library
          </h2>
          <button class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition"
            onclick="document.getElementById('nclex-library-modal').classList.remove('visible');">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <div class="nclex-lib-content flex-1 overflow-y-auto bg-[var(--brand-bg)]"></div>
      </div>
    `;
    modal.onclick = (e) => { if(e.target === modal) modal.classList.remove('visible'); };
    document.body.appendChild(modal);

    // Precargar
    setTimeout(fetchBooks, 2500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();