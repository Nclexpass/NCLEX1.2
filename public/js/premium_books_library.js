// premium_books_library.js — Visual Library v5.0 (Luxury Edition)
// FEATURES: Portadas "Editorial", Cinta Roja, Títulos Grandes, Visor Online

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
    // Paleta de colores "Editorial" (Más oscuros y elegantes)
    COVERS: [
      ['#1e3a8a', '#172554'], // Azul Marino Profundo
      ['#581c87', '#3b0764'], // Púrpura Real
      ['#065f46', '#064e3b'], // Verde Bosque
      ['#9a3412', '#7c2d12'], // Terracota
      ['#831843', '#500724'], // Vino
      ['#3730a3', '#312e81'], // Índigo Oscuro
      ['#0c4a6e', '#082f49'], // Azul Petróleo
      ['#334155', '#0f172a']  // Pizarra
    ]
  };

  // ===== ESTADO =====
  const state = { books: [], isLoading: false, error: null, isOpen: false };

  // ===== GENERADOR DE COLOR =====
  function getCoverColor(title) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) { hash = title.charCodeAt(i) + ((hash << 5) - hash); }
    const index = Math.abs(hash) % CONFIG.COVERS.length;
    return CONFIG.COVERS[index];
  }

  // ===== ESTILOS (DISEÑO DE LUJO) =====
  function injectStyles() {
    if (document.getElementById('nclex-library-styles-v5')) return;
    const style = document.createElement('style');
    style.id = 'nclex-library-styles-v5';
    style.textContent = `
      /* Botón flotante */
      #nclex-library-btn { position: fixed; top: 24px; right: 24px; width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, rgb(var(--brand-blue-rgb)), rgba(var(--brand-blue-rgb), 0.8)); border: none; box-shadow: 0 8px 25px rgba(var(--brand-blue-rgb), 0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 9980; transition: all 0.2s; color: white; }
      #nclex-library-btn:hover { transform: translateY(-2px) scale(1.05); }
      
      /* Modal */
      #nclex-library-modal { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); z-index: 9999; opacity: 0; transition: opacity 0.3s ease; }
      #nclex-library-modal.visible { display: flex; opacity: 1; }
      .nclex-lib-container { width: 100%; max-width: 1100px; height: 90vh; background: var(--brand-bg); border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; transform: scale(0.95); transition: transform 0.3s ease; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
      #nclex-library-modal.visible .nclex-lib-container { transform: scale(1); }
      
      /* Grid de Libros */
      .nclex-lib-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); 
        gap: 48px 32px; 
        padding: 40px; 
        overflow-y: auto; 
      }
      
      /* DISEÑO LIBRO 3D MEJORADO */
      .book-item { display: flex; flex-direction: column; align-items: center; perspective: 1000px; group: hover; }
      
      .book-cover {
        width: 100%; aspect-ratio: 2/3.1; /* Un poco más alto */
        border-radius: 2px 6px 6px 2px;
        position: relative;
        box-shadow: 
          inset 10px 0 20px rgba(0,0,0,0.2), /* Sombra lomo fuerte */
          5px 5px 15px rgba(0,0,0,0.25);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 16px;
        cursor: pointer;
        border-left: 4px solid rgba(255,255,255,0.1); /* Efecto encuadernación */
      }

      .book-item:hover .book-cover { 
        transform: translateY(-10px) rotateY(-5deg); 
        box-shadow: 15px 25px 40px rgba(0,0,0,0.35); 
      }

      /* La Cinta Roja (Bookmark) */
      .book-bookmark {
        position: absolute;
        top: -5px;
        right: 20px;
        width: 24px;
        height: 45px;
        background: #dc2626; /* Rojo intenso */
        box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        z-index: 30;
      }
      .book-bookmark::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10px;
        background: inherit;
        clip-path: polygon(0 0, 50% 100%, 100% 0);
        transform: translateY(9px);
      }

      /* Título Grande */
      .book-content { z-index: 20; height: 100%; display: flex; flex-direction: column; justify-content: flex-start; padding-top: 10px; }
      .book-title { 
        font-family: 'Inter', sans-serif; 
        font-weight: 900; 
        text-transform: uppercase;
        color: white; 
        font-size: 16px; /* Más grande */
        line-height: 1.2; 
        text-shadow: 0 2px 10px rgba(0,0,0,0.5); 
        display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; 
        letter-spacing: 0.02em;
        text-align: center;
      }
      
      /* Decoración inferior */
      .book-bottom-deco {
        position: absolute; bottom: 20px; left: 0; right: 0; height: 2px; background: rgba(255,215,0, 0.4); /* Dorado sutil */
      }
      .book-icon { position: absolute; bottom: 30px; left: 0; right: 0; text-align: center; color: rgba(255,255,255,0.3); font-size: 24px; }

      /* Info y Botones */
      .book-details { margin-top: 16px; text-align: center; width: 100%; }
      .book-meta-info { font-size: 11px; color: var(--brand-text-muted); font-weight: 500; margin-bottom: 10px; }
      
      .book-actions { display: flex; gap: 8px; justify-content: center; opacity: 0; transform: translateY(10px); transition: all 0.2s; }
      .book-item:hover .book-actions { opacity: 1; transform: translateY(0); }
      
      .action-btn { 
        padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 6px; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .btn-read { background: #2563eb; color: white; border: 1px solid #1d4ed8; }
      .btn-read:hover { background: #1d4ed8; transform: scale(1.05); }
      .btn-down { background: white; color: #475569; border: 1px solid #e2e8f0; }
      .btn-down:hover { background: #f8fafc; color: #0f172a; }
      .dark .btn-down { background: #1e293b; color: #e2e8f0; border-color: #334155; }

      .nclex-lib-header { padding: 24px; border-bottom: 1px solid var(--brand-border); display: flex; justify-content: space-between; align-items: center; }
      .nclex-lib-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--brand-text-muted); }
    `;
    document.head.appendChild(style);
  }

  // ===== UTILIDADES =====
  function isSpanishUI() { const esEl = document.querySelector('.lang-es'); return esEl ? !esEl.classList.contains('hidden-lang') : true; }
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
      content.innerHTML = `<div class="nclex-lib-loading"><i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-blue-500"></i><p class="font-bold">${t('Preparando estantería...', 'Preparing shelves...')}</p></div>`;
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
               style="background: radial-gradient(circle at top right, ${bgFrom}, ${bgTo});">
            
            <div class="book-bookmark"></div>
            
            <div class="book-content">
              <div class="book-title">${escapeHtml(book.name)}</div>
            </div>
            
            <div class="book-icon"><i class="fa-solid fa-staff-snake"></i></div>
            <div class="book-bottom-deco"></div>
            
            <div style="position:absolute; inset:0; background: linear-gradient(to right, rgba(255,255,255,0.15) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.3) 100%); pointer-events:none;"></div>
          </div>
          
          <div class="book-details">
            <div class="book-meta-info">
              <span>${formatFileSize(book.size)} • PDF</span>
            </div>
            
            <div class="book-actions">
                <a href="${googleViewerUrl}" target="_blank" class="action-btn btn-read">
                    <i class="fa-solid fa-book-open"></i> ${t('Leer', 'Read')}
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

  // ===== INICIALIZACIÓN =====
  function init() {
    if (document.getElementById('nclex-library-btn')) return;
    injectStyles();

    const btn = document.createElement('button');
    btn.id = 'nclex-library-btn';
    btn.setAttribute('aria-label', 'Open Library');
    btn.innerHTML = `<i class="fa-solid fa-book-open text-xl"></i>`;
    btn.onclick = () => {
      state.isOpen = true;
      document.getElementById('nclex-library-modal').classList.add('visible');
      if(!state.books.length) fetchBooks();
    };
    document.body.appendChild(btn);

    const modal = document.createElement('div');
    modal.id = 'nclex-library-modal';
    modal.innerHTML = `
      <div class="nclex-lib-container">
        <div class="nclex-lib-header">
          <div>
            <h2 class="font-black text-2xl text-[var(--brand-text)] flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                <i class="fa-solid fa-book-medical"></i>
              </span>
              NCLEX LIBRARY
            </h2>
            <p class="text-xs text-[var(--brand-text-muted)] mt-1 ml-1 font-medium tracking-wide uppercase">
              ${t('Recursos Premium & Guías de Estudio', 'Premium Resources & Study Guides')}
            </p>
          </div>
          <button class="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition"
            onclick="document.getElementById('nclex-library-modal').classList.remove('visible');">
            <i class="fa-solid fa-xmark text-xl text-[var(--brand-text-muted)]"></i>
          </button>
        </div>
        <div class="nclex-lib-content flex-1 overflow-y-auto bg-[var(--brand-bg)] custom-scrollbar"></div>
      </div>
    `;
    modal.onclick = (e) => { if(e.target === modal) modal.classList.remove('visible'); };
    document.body.appendChild(modal);

    setTimeout(fetchBooks, 2500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();