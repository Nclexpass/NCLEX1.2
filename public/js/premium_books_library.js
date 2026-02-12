// premium_books_library.js — Visual Library v6.0 (Spectacular Edition)
// FEATURES: Diseño Tapa Dura, Borde Dorado, Cinta Roja Corregida, Visor Online

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
    // Paleta de colores PROFUNDOS (Estilo Académico)
    COVERS: [
      ['#0f172a', '#1e293b'], // Midnight Blue
      ['#450a0a', '#7f1d1d'], // Deep Red
      ['#064e3b', '#065f46'], // British Green
      ['#312e81', '#3730a3'], // Royal Indigo
      ['#4c1d95', '#5b21b6'], // Deep Purple
      ['#78350f', '#92400e'], // Leather Brown
      ['#111827', '#374151']  // Charcoal
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

  // ===== ESTILOS (CSS ART - NIVEL PRO) =====
  function injectStyles() {
    if (document.getElementById('nclex-library-styles-v6')) return;
    const style = document.createElement('style');
    style.id = 'nclex-library-styles-v6';
    style.textContent = `
      /* Botón flotante */
      #nclex-library-btn { position: fixed; top: 24px; right: 24px; width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, rgb(var(--brand-blue-rgb)), rgba(var(--brand-blue-rgb), 0.8)); border: none; box-shadow: 0 8px 25px rgba(var(--brand-blue-rgb), 0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 9980; transition: all 0.2s; color: white; }
      #nclex-library-btn:hover { transform: translateY(-2px) scale(1.05); }
      
      /* Modal Container */
      #nclex-library-modal { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.75); backdrop-filter: blur(12px); z-index: 9999; opacity: 0; transition: opacity 0.3s ease; }
      #nclex-library-modal.visible { display: flex; opacity: 1; }
      
      .nclex-lib-container { width: 100%; max-width: 1200px; height: 90vh; background: var(--brand-bg); border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; transform: scale(0.95); transition: transform 0.3s ease; box-shadow: 0 40px 80px rgba(0,0,0,0.6); border: 1px solid var(--brand-border); }
      #nclex-library-modal.visible .nclex-lib-container { transform: scale(1); }
      
      /* Grid (Estantería de Madera) */
      .nclex-lib-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
        gap: 50px 30px; 
        padding: 50px; 
        overflow-y: auto; 
      }
      
      /* === LIBRO 3D ESPECTACULAR === */
      .book-item { display: flex; flex-direction: column; align-items: center; perspective: 1200px; group: hover; }
      
      .book-cover {
        width: 100%; aspect-ratio: 1/1.55; /* Proporción áurea de libro */
        border-radius: 4px 8px 8px 4px;
        position: relative;
        box-shadow: 
          inset 6px 0 15px rgba(0,0,0,0.3), /* Sombra Lomo */
          0 10px 20px rgba(0,0,0,0.3), /* Sombra Suelo */
          0 2px 4px rgba(255,255,255,0.1); /* Brillo borde */
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 20px;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,0.1);
      }

      /* Efecto Hover (Levitación) */
      .book-item:hover .book-cover { 
        transform: translateY(-15px) rotateY(-8deg) scale(1.02); 
        box-shadow: 20px 30px 50px rgba(0,0,0,0.5); 
        z-index: 10;
      }

      /* Marco Dorado (Luxury Touch) */
      .book-frame {
        position: absolute; inset: 12px; 
        border: 1px solid rgba(255, 215, 0, 0.3); /* Dorado sutil */
        border-radius: 2px;
        pointer-events: none;
      }

      /* CINTA ROJA (CORREGIDA - NO TAPA TEXTO) */
      .book-ribbon {
        position: absolute;
        top: -6px;
        right: 15px; /* Más a la derecha */
        width: 20px;
        height: 40px;
        background: linear-gradient(to bottom, #ef4444, #b91c1c);
        box-shadow: 2px 2px 5px rgba(0,0,0,0.4);
        z-index: 5;
      }
      .book-ribbon::after {
        content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 10px;
        background: inherit; clip-path: polygon(0 0, 50% 100%, 100% 0); transform: translateY(9px);
      }

      /* TÍTULO (SEGURO Y ELEGANTE) */
      .book-content { 
        z-index: 20; height: 100%; display: flex; flex-direction: column; 
        justify-content: center; /* Centrado vertical */
        text-align: center;
        margin-top: 15px; /* Espacio para que la cinta no estorbe */
      }
      
      .book-title { 
        font-family: 'Times New Roman', serif; /* Toque académico */
        font-weight: 700; 
        color: #f8fafc; 
        font-size: 18px; 
        line-height: 1.2; 
        text-shadow: 0 2px 4px rgba(0,0,0,0.8); 
        letter-spacing: 0.5px;
        display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
        border-top: 1px solid rgba(255,255,255,0.2);
        border-bottom: 1px solid rgba(255,255,255,0.2);
        padding: 10px 0;
      }

      /* Logo Médico Abajo */
      .book-logo { margin-top: auto; color: rgba(255,215,0,0.4); font-size: 24px; margin-bottom: 5px; }

      /* Info y Botones Fuera del Libro */
      .book-details { margin-top: 18px; text-align: center; width: 100%; }
      .book-meta-info { font-size: 11px; color: var(--brand-text-muted); font-weight: 600; letter-spacing: 0.5px; margin-bottom: 8px; text-transform: uppercase; }
      
      .book-actions { display: flex; gap: 8px; justify-content: center; }
      
      .action-btn { 
        height: 32px; padding: 0 16px; border-radius: 16px; font-size: 12px; font-weight: 700; 
        text-decoration: none; display: flex; align-items: center; gap: 6px; 
        transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      
      .btn-read { 
        background: linear-gradient(to bottom, #3b82f6, #2563eb); 
        color: white; border: 1px solid #1d4ed8; 
      }
      .btn-read:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37,99,235,0.4); }
      
      .btn-down { background: var(--brand-card); color: var(--brand-text); border: 1px solid var(--brand-border); }
      .btn-down:hover { background: var(--brand-bg); transform: translateY(-2px); }

      /* Header */
      .nclex-lib-header { padding: 24px 32px; border-bottom: 1px solid var(--brand-border); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(to bottom, var(--brand-card), var(--brand-bg)); }
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
      content.innerHTML = `<div class="nclex-lib-loading"><i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-blue-600"></i><p class="font-bold tracking-wide">${t('PREPARANDO BIBLIOTECA...', 'PREPARING LIBRARY...')}</p></div>`;
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
               style="background: radial-gradient(circle at center, ${bgFrom}, ${bgTo});">
            
            <div class="book-ribbon"></div>
            
            <div class="book-frame"></div>
            
            <div class="book-content">
              <div class="book-title">${escapeHtml(book.name)}</div>
              <div class="book-logo"><i class="fa-solid fa-staff-snake"></i></div>
            </div>

            <div style="position:absolute; inset:0; background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+'); pointer-events:none; opacity:0.3;"></div>
            
            <div style="position:absolute; left:0; top:0; bottom:0; width:10px; background: linear-gradient(to right, rgba(255,255,255,0.2), transparent); pointer-events:none;"></div>
          </div>
          
          <div class="book-details">
            <div class="book-meta-info">
              <i class="fa-solid fa-file-pdf text-red-500 mr-1"></i> ${formatFileSize(book.size)}
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