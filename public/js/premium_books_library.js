// premium_books_library.js — Visual Library v7.0 (Masterpiece Edition)
// FEATURES: Diseño Tapa Dura de Lujo, Lomo Texturizado, Cinta de Seda, Visor Online

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

  // ===== CONFIGURACIÓN — PALETA ÉLITE (colores más profundos y sofisticados) =====
  const CONFIG = {
    GITHUB_RELEASE_URL: 'https://api.github.com/repos/Nclexpass/NCLEX1.2/releases/tags/BOOKS',
    CACHE_DURATION: 5 * 60 * 1000, 
    STORAGE_KEY: 'books_cache',
    CACHE_TIME_KEY: 'books_cache_time',
    MAX_RETRIES: 2,
    RETRY_DELAY: 1500,
    // 🎨 GRADIENTES PREMIUM — tonos académicos con profundidad
    COVERS: [
      ['#1a1e2c', '#2d3748'], // Grafito Azulado
      ['#3c2a4d', '#4a2c5d'], // Púrpura Imperial
      ['#1f3a3f', '#2b4a55'], // Verde Petróleo
      ['#5e3a3a', '#7a4c4c'], // Burdeos Profundo
      ['#2d4a3b', '#3e6b4b'], // Bosque Británico
      ['#2a3f5e', '#3c5a7d'], // Azul Prusia
      ['#4a3b2a', '#63543a']  // Cuero Envejecido
    ]
  };

  // ===== ESTADO (sin cambios) =====
  const state = { books: [], isLoading: false, error: null, isOpen: false };

  function getCoverColor(title) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) { hash = title.charCodeAt(i) + ((hash << 5) - hash); }
    const index = Math.abs(hash) % CONFIG.COVERS.length;
    return CONFIG.COVERS[index];
  }

  // ===== 🎨 ESTILOS REDISEÑADOS — Elegancia, Realismo, Profesionalismo =====
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
         BOTÓN FLOTANTE — Joya minimalista
      ------------------------------------------------ */
      #nclex-library-btn {
        position: fixed;
        top: 28px;
        right: 28px;
        width: 56px;
        height: 56px;
        border-radius: 18px;
        background: radial-gradient(circle at 30% 30%, #2a3f5e, #1a2a3a);
        border: 1px solid rgba(255, 215, 0, 0.25);
        box-shadow: 0 8px 25px rgba(0, 20, 40, 0.7), inset 0 1px 0 rgba(255,255,255,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 9980;
        transition: all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1);
        color: white;
        backdrop-filter: blur(4px);
        animation: lib-pulse 4s infinite ease-in-out;
      }
      #nclex-library-btn:hover {
        transform: translateY(-4px) scale(1.06);
        border-color: rgba(212, 175, 55, 0.6);
        box-shadow: 0 15px 35px rgba(0, 60, 120, 0.5);
      }
      @keyframes lib-pulse {
        0%, 100% { box-shadow: 0 8px 25px rgba(0, 20, 40, 0.7); }
        50% { box-shadow: 0 12px 35px rgba(30, 80, 150, 0.6); }
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
        border: 1px solid rgba(255,255,255,0.05);
      }
      #nclex-library-modal.visible .nclex-lib-container {
        transform: scale(1);
      }

      /* ------------------------------------------------
         CABECERA — Refinamiento académico
      ------------------------------------------------ */
      .nclex-lib-header {
        padding: 24px 36px;
        border-bottom: 1px solid var(--lib-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(to bottom, rgba(20, 25, 35, 0.95), var(--lib-bg));
        backdrop-filter: blur(8px);
      }
      .nclex-lib-header h2 {
        font-family: 'Cormorant Garamond', 'Times New Roman', serif;
        font-weight: 700;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        font-size: 1.8rem;
        background: linear-gradient(135deg, #fff, #c0c8d0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 2px 5px rgba(0,0,0,0.3);
      }
      .nclex-lib-header .w-10.h-10 {
        background: linear-gradient(145deg, #1e2a3a, #0f141c);
        border: 1px solid rgba(212,175,55,0.3);
        box-shadow: 0 5px 15px rgba(0,0,0,0.5);
      }

      /* ------------------------------------------------
         ESTANTERÍA — Grid con elegancia
      ------------------------------------------------ */
      .nclex-lib-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: 60px 35px;
        padding: 50px 45px;
        overflow-y: auto;
        background: 
          radial-gradient(circle at 20% 30%, rgba(80, 60, 40, 0.05) 0%, transparent 25%),
          radial-gradient(circle at 80% 70%, rgba(40, 60, 80, 0.05) 0%, transparent 30%);
      }

      /* ------------------------------------------------
         LIBRO 3D — Tapa Dura con Lomo Realista
      ------------------------------------------------ */
      .book-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        perspective: 1800px;
      }

      .book-cover {
        width: 100%;
        aspect-ratio: 1/1.55;
        border-radius: 4px 12px 12px 4px;
        position: relative;
        box-shadow: 
          inset -2px 0 8px rgba(0,0,0,0.6),
          inset 6px 0 12px rgba(0,0,0,0.5),
          0 15px 25px -8px rgba(0,0,0,0.5);
        transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.4, 1), 
                    box-shadow 0.35s ease;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 22px 18px;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,0.08);
        border-left-width: 2px;
        border-left-color: rgba(255,215,0,0.2);
      }

      /* Lomo texturizado (pseudo-elemento) */
      .book-cover::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 14px;
        height: 100%;
        background: var(--lib-spine);
        border-radius: 3px 0 0 3px;
        box-shadow: inset -1px 0 3px rgba(0,0,0,0.4);
        pointer-events: none;
        z-index: 3;
      }

      /* Sutil brillo en borde superior (tapa dura) */
      .book-cover::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, rgba(255,255,255,0.2), rgba(212,175,55,0.2), rgba(255,255,255,0.2));
        opacity: 0.6;
        pointer-events: none;
      }

      /* Efecto de página lateral */
      .book-cover .page-edge {
        position: absolute;
        right: 0;
        top: 4px;
        bottom: 4px;
        width: 4px;
        background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(200,200,200,0.05));
        border-radius: 2px;
        pointer-events: none;
        z-index: 2;
      }

      .book-item:hover .book-cover {
        transform: translateY(-18px) rotateY(-10deg) scale(1.04);
        box-shadow: 25px 35px 60px -10px rgba(0,0,0,0.7);
      }

      /* ------------------------------------------------
         MARCO DORADO — Filigrana sutil
      ------------------------------------------------ */
      .book-frame {
        position: absolute;
        inset: 14px;
        border: 1px solid var(--lib-gold);
        border-radius: 2px;
        opacity: 0.4;
        transition: opacity 0.25s;
        pointer-events: none;
        z-index: 4;
      }
      .book-item:hover .book-frame {
        opacity: 0.8;
        border-color: rgba(212, 175, 55, 0.7);
      }

      /* ------------------------------------------------
         CINTA DE SEDA — Rojo coral con caída natural
      ------------------------------------------------ */
      .book-ribbon {
        position: absolute;
        top: -8px;
        right: 18px;
        width: 24px;
        height: 52px;
        background: var(--lib-ribbon);
        box-shadow: 3px 5px 10px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.3);
        border-radius: 2px 2px 0 0;
        z-index: 15;
        transform: rotate(2deg);
      }
      .book-ribbon::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 14px;
        background: inherit;
        clip-path: polygon(0 0, 50% 100%, 100% 0);
        transform: translateY(10px);
        filter: drop-shadow(0 4px 4px rgba(0,0,0,0.3));
      }
      .book-ribbon::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 6px;
        background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
        border-radius: 2px 2px 0 0;
      }

      /* ------------------------------------------------
         CONTENIDO DEL LIBRO — Tipografía de culto
      ------------------------------------------------ */
      .book-content {
        z-index: 20;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        margin-top: 15px;
        position: relative;
      }

      .book-title {
        font-family: 'Cormorant Garamond', 'Times New Roman', serif;
        font-weight: 700;
        color: #fefcf5;
        font-size: 1.1rem;
        line-height: 1.3;
        text-shadow: 0 2px 6px rgba(0,0,0,0.9);
        letter-spacing: 0.03em;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
        padding: 12px 0;
        border-top: 1px solid rgba(212, 175, 55, 0.25);
        border-bottom: 1px solid rgba(212, 175, 55, 0.25);
        background: linear-gradient(to bottom, rgba(0,0,0,0.1), transparent);
      }

      .book-logo {
        margin-top: auto;
        color: rgba(212, 175, 55, 0.45);
        font-size: 26px;
        margin-bottom: 8px;
        filter: drop-shadow(0 2px 4px black);
      }

      /* ------------------------------------------------
         METADATOS Y ACCIONES — Elegancia discreta
      ------------------------------------------------ */
      .book-details {
        margin-top: 18px;
        text-align: center;
        width: 100%;
      }

      .book-meta-info {
        font-size: 11px;
        color: var(--lib-text-muted);
        font-weight: 600;
        letter-spacing: 1.2px;
        margin-bottom: 10px;
        text-transform: uppercase;
        background: rgba(10, 15, 20, 0.6);
        padding: 4px 8px;
        border-radius: 20px;
        display: inline-block;
        backdrop-filter: blur(2px);
        border: 1px solid rgba(255,255,255,0.05);
      }

      .book-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .action-btn {
        height: 36px;
        padding: 0 22px;
        border-radius: 30px;
        font-size: 12px;
        font-weight: 700;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        letter-spacing: 0.5px;
        border: none;
        position: relative;
        overflow: hidden;
      }

      .btn-read {
        background: linear-gradient(145deg, #2a4c7c, #1a2e4a);
        color: white;
        border: 1px solid rgba(212, 175, 55, 0.4);
      }
      .btn-read:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 18px rgba(30, 80, 150, 0.5);
        background: linear-gradient(145deg, #326094, #1e3a5a);
      }

      .btn-down {
        background: rgba(20, 28, 38, 0.9);
        color: var(--lib-text);
        border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(4px);
      }
      .btn-down:hover {
        background: rgba(30, 40, 55, 0.95);
        transform: translateY(-3px);
        border-color: rgba(212, 175, 55, 0.4);
        box-shadow: 0 8px 18px rgba(0,0,0,0.5);
      }

      /* ------------------------------------------------
         LOADER — Spinner refinado
      ------------------------------------------------ */
      .nclex-lib-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--lib-text-muted);
        font-size: 1.2rem;
        letter-spacing: 2px;
      }
      .nclex-lib-loading i {
        font-size: 3rem;
        color: rgba(212, 175, 55, 0.6);
        animation: lib-rotate 1.2s linear infinite;
        margin-bottom: 1rem;
        filter: drop-shadow(0 0 8px rgba(212,175,55,0.3));
      }
      @keyframes lib-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* ------------------------------------------------
         SCROLLBAR PERSONALIZADO — Acorde al lujo
      ------------------------------------------------ */
      .nclex-lib-grid::-webkit-scrollbar {
        width: 8px;
      }
      .nclex-lib-grid::-webkit-scrollbar-track {
        background: transparent;
      }
      .nclex-lib-grid::-webkit-scrollbar-thumb {
        background: rgba(212, 175, 55, 0.25);
        border-radius: 20px;
        border: 1px solid rgba(0,0,0,0.3);
      }
      .nclex-lib-grid::-webkit-scrollbar-thumb:hover {
        background: rgba(212, 175, 55, 0.5);
      }

      /* ------------------------------------------------
         AJUSTES RESPONSIVE & DETALLES FINALES
      ------------------------------------------------ */
      @media (max-width: 640px) {
        .nclex-lib-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); padding: 30px 20px; gap: 40px 20px; }
        .book-title { font-size: 0.95rem; }
        .nclex-lib-header { padding: 18px 24px; }
      }
    `;
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

  // ===== RENDERIZADO (sin cambios estructurales, solo apreciación estética) =====
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
            <div class="page-edge"></div> <!-- sutil página lateral -->
            
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

  // ===== INICIALIZACIÓN (sin cambios) =====
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

  function isSpanishUI() { const esEl = document.querySelector('.lang-es'); return esEl ? !esEl.classList.contains('hidden-lang') : true; }
  function t(es, en) { return isSpanishUI() ? es : en; }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();