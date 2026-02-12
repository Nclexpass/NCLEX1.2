// premium_books_library.js — Apple-style PDF Library (GitHub Releases)
// Uses GitHub release tag: BOOKS
// IMPORTANT: styles are namespaced to avoid overriding global app styles.

(function () {
  'use strict';

  // --- CONFIG ---
  const GITHUB_RELEASE_URL = 'https://api.github.com/repos/Nclexpass/NCLEX1.2/releases/tags/BOOKS';
  const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // --- STATE ---
  const state = {
    books: [],
    isLoading: false,
    error: null,
    pdfjsReady: false,
    thumbnails: new Map()
  };

  // --- i18n helper (matches app language toggle) ---
  function isSpanishUI() {
    const esEl = document.querySelector('.lang-es');
    return !!(esEl && esEl.offsetParent !== null);
  }
  function t(es, en) {
    return isSpanishUI() ? es : en;
  }

  // --- STYLE (namespaced) ---
  function ensureStyles() {
    if (document.getElementById('nclex-library-styles')) return;

    const style = document.createElement('style');
    style.id = 'nclex-library-styles';
    style.textContent = `
      .nclex-lib-glass{
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        background: rgba(242, 242, 247, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.7);
        box-shadow: 0 20px 60px rgba(0,0,0,0.18);
      }
      .dark .nclex-lib-glass{
        background: rgba(28, 28, 30, 0.92);
        border: 1px solid rgba(44, 44, 46, 0.8);
        box-shadow: 0 20px 60px rgba(0,0,0,0.45);
      }

      .nclex-lib-titlebar{
        background: linear-gradient(to bottom, rgba(255,255,255,.9), rgba(242,242,247,.9));
        border-bottom: 1px solid rgba(0,0,0,0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      .dark .nclex-lib-titlebar{
        background: linear-gradient(to bottom, rgba(44,44,46,.9), rgba(28,28,30,.9));
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }

      .nclex-lib-scroll::-webkit-scrollbar{ width: 8px; height: 8px; }
      .nclex-lib-scroll::-webkit-scrollbar-thumb{ background: rgba(0,0,0,0.12); border-radius: 999px; }
      .dark .nclex-lib-scroll::-webkit-scrollbar-thumb{ background: rgba(255,255,255,0.18); }

      .nclex-lib-card{
        background: rgba(255,255,255,0.7);
        border: 1px solid rgba(255,255,255,0.5);
        transition: transform .2s ease, box-shadow .2s ease;
      }
      .dark .nclex-lib-card{
        background: rgba(44,44,46,0.55);
        border: 1px solid rgba(255,255,255,0.08);
      }
      .nclex-lib-card:hover{
        transform: translateY(-4px);
        box-shadow: 0 14px 30px rgba(0,0,0,0.18);
      }

      .nclex-lib-thumb{
        width: 90px;
        height: 120px;
        border-radius: 12px;
        overflow: hidden;
        background: rgba(0,0,0,0.05);
        position: relative;
        flex-shrink: 0;
      }
      .dark .nclex-lib-thumb{ background: rgba(255,255,255,0.06); }

      #nclex-library-btn{
        position: fixed;
        top: 24px;
        right: 24px;
        width: 48px;
        height: 48px;
        border-radius: 16px;
        display:flex;
        align-items:center;
        justify-content:center;
        z-index: 9980;
        border: 1px solid rgba(255,255,255,0.2);
        background: linear-gradient(135deg, rgba(37,99,235,0.95), rgba(147,51,234,0.95));
        box-shadow: 0 18px 40px rgba(37,99,235,0.25);
        transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
      }
      #nclex-library-btn:hover{
        transform: translateY(-2px);
        box-shadow: 0 18px 40px rgba(37,99,235,0.35);
      }
      #nclex-library-btn:active{ transform: scale(0.96); }

      .nclex-lib-badge{
        position:absolute;
        top:-4px;
        right:-4px;
        width:14px;
        height:14px;
        border-radius:999px;
        background:#ef4444;
        border:2px solid white;
      }
      .dark .nclex-lib-badge{ border-color: #111827; }
    `;
    document.head.appendChild(style);
  }

  // --- PDF.js loader ---
  async function loadPdfJs() {
    if (state.pdfjsReady) return true;

    // If already present
    if (window.pdfjsLib) {
      try {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      } catch {}
      state.pdfjsReady = true;
      return true;
    }

    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = PDFJS_CDN;
      s.onload = () => {
        try {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
          state.pdfjsReady = true;
          resolve(true);
        } catch (e) {
          console.error('pdf.js init error', e);
          resolve(false);
        }
      };
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  }

  // --- Data ---
  async function fetchBooks() {
    state.isLoading = true;
    state.error = null;
    render();

    try {
      const res = await fetch(GITHUB_RELEASE_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudo conectar con GitHub');
      const release = await res.json();

      state.books = (release.assets || [])
        .filter(a => (a.name || '').toLowerCase().endsWith('.pdf'))
        .map(a => ({
          id: a.id,
          name: String(a.name || '').replace(/\.pdf$/i, '').replace(/[-_]/g, ' '),
          rawName: a.name,
          size: a.size || 0,
          downloadUrl: a.browser_download_url,
          updatedAt: a.updated_at ? new Date(a.updated_at) : null
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    } catch (e) {
      console.error('Error fetching GitHub release:', e);
      state.error = e?.message || 'Error desconocido';
      state.books = [];
    } finally {
      state.isLoading = false;
      render();
    }
  }

  function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // --- Thumbnails ---
  async function buildThumbnail(book) {
    if (state.thumbnails.has(book.id)) return state.thumbnails.get(book.id);

    const ok = await loadPdfJs();
    if (!ok || !window.pdfjsLib) return null;

    try {
      const loadingTask = window.pdfjsLib.getDocument({ url: book.downloadUrl });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 0.55 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: false });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({ canvasContext: ctx, viewport }).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

      state.thumbnails.set(book.id, dataUrl);
      return dataUrl;
    } catch (e) {
      console.warn('thumbnail error', book.name, e);
      state.thumbnails.set(book.id, null);
      return null;
    }
  }

  async function buildVisibleThumbnails() {
    const modal = document.getElementById('nclex-library-modal');
    if (!modal || modal.classList.contains('hidden')) return;

    const cards = modal.querySelectorAll('[data-book-id]');
    const toBuild = [];
    cards.forEach(c => {
      const id = Number(c.getAttribute('data-book-id'));
      if (!state.thumbnails.has(id)) toBuild.push(id);
    });

    // build a few at a time
    for (const id of toBuild.slice(0, 8)) {
      const book = state.books.find(b => b.id === id);
      if (!book) continue;
      const thumb = await buildThumbnail(book);
      const img = modal.querySelector(`[data-thumb-for="${id}"]`);
      const loader = modal.querySelector(`[data-thumb-loader="${id}"]`);
      if (loader) loader.remove();
      if (img && thumb) img.src = thumb;
      if (img && !thumb) img.style.display = 'none';
    }
  }

  // --- UI ---
  function ensureButton() {
    if (document.getElementById('nclex-library-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'nclex-library-btn';
    btn.setAttribute('aria-label', 'Open Library');
    btn.innerHTML = `
      <i class="fa-solid fa-book-open text-white text-xl"></i>
      <span class="nclex-lib-badge"></span>
    `;
    btn.addEventListener('click', open);
    document.body.appendChild(btn);
  }

  function ensureModal() {
    if (document.getElementById('nclex-library-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'nclex-library-modal';
    modal.className = 'fixed inset-0 hidden items-center justify-center p-4 bg-black/50 backdrop-blur-sm';
    modal.style.zIndex = '9999';

    modal.innerHTML = `
      <div class="w-full max-w-5xl max-h-[85vh] nclex-lib-glass rounded-2xl overflow-hidden flex flex-col">
        <div class="nclex-lib-titlebar flex items-center justify-between px-5 py-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <i class="fa-solid fa-book-open text-white text-sm"></i>
            </div>
            <div>
              <h2 class="font-semibold text-gray-800 dark:text-white text-base">Library</h2>
              <p id="nclex-lib-subtitle" class="text-xs text-gray-500 dark:text-gray-400">NCLEX PDF Collection</p>
            </div>
          </div>
          <button id="nclex-lib-close" class="w-9 h-9 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div id="nclex-lib-content" class="flex-1 overflow-y-auto p-5 nclex-lib-scroll" style="max-height: calc(85vh - 70px);"></div>

        <div class="px-5 py-3 border-t border-gray-200 dark:border-white/10 text-xs text-gray-500 flex justify-between items-center bg-white/50 dark:bg-black/20">
          <span><i class="fa-regular fa-circle-check mr-1"></i> ${t('Fuente: GitHub Releases', 'Source: GitHub Releases')}</span>
          <button id="nclex-lib-refresh" class="px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center gap-1">
            <i class="fa-solid fa-rotate"></i> ${t('Actualizar', 'Refresh')}
          </button>
        </div>
      </div>
    `;

    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    document.body.appendChild(modal);

    modal.querySelector('#nclex-lib-close')?.addEventListener('click', close);
    modal.querySelector('#nclex-lib-refresh')?.addEventListener('click', refresh);
  }

  function render() {
    const modal = document.getElementById('nclex-library-modal');
    const content = document.getElementById('nclex-lib-content');
    const subtitle = document.getElementById('nclex-lib-subtitle');
    if (!modal || !content) return;

    if (subtitle) subtitle.textContent = state.books.length ? `${state.books.length} PDFs` : 'NCLEX PDF Collection';

    if (state.isLoading) {
      content.innerHTML = `
        <div class="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div class="relative w-16 h-16 mb-4">
            <div class="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p class="font-medium">${t('Conectando con GitHub...', 'Connecting to GitHub...')}</p>
          <p class="text-xs mt-2 opacity-75">${t('Obteniendo lista de PDFs', 'Fetching PDF list')}</p>
        </div>
      `;
      return;
    }

    if (state.error) {
      content.innerHTML = `
        <div class="flex flex-col items-center justify-center h-64 text-center px-6">
          <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <i class="fa-solid fa-exclamation-triangle text-2xl text-red-600 dark:text-red-400"></i>
          </div>
          <h3 class="font-semibold text-gray-800 dark:text-white mb-1">${t('Error de conexión', 'Connection error')}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${state.error}</p>
          <button class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold" id="nclex-lib-retry">
            ${t('Reintentar', 'Retry')}
          </button>
        </div>
      `;
      content.querySelector('#nclex-lib-retry')?.addEventListener('click', refresh);
      return;
    }

    if (!state.books.length) {
      content.innerHTML = `
        <div class="flex flex-col items-center justify-center h-64">
          <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <i class="fa-solid fa-box-open text-2xl text-gray-500"></i>
          </div>
          <p class="text-gray-600 dark:text-gray-400">${t('No se encontraron PDFs en el release BOOKS', 'No PDFs found in BOOKS release')}</p>
        </div>
      `;
      return;
    }

    // Cards
    let html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
    for (const b of state.books) {
      const size = formatFileSize(b.size);
      const date = b.updatedAt ? b.updatedAt.toLocaleDateString() : '';
      html += `
        <div class="nclex-lib-card rounded-2xl p-4 flex gap-4" data-book-id="${b.id}">
          <div class="nclex-lib-thumb">
            <img data-thumb-for="${b.id}" alt="" class="w-full h-full object-cover" />
            <div data-thumb-loader="${b.id}" class="absolute inset-0 flex items-center justify-center text-gray-400">
              <i class="fa-solid fa-circle-notch fa-spin"></i>
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-black text-gray-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2" title="${escapeHTML(b.name)}">${escapeHTML(b.name)}</h3>
            <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span><i class="fa-regular fa-file mr-1"></i>PDF</span>
              ${size ? `<span>•</span><span><i class="fa-regular fa-hard-drive mr-1"></i>${size}</span>` : ''}
              ${date ? `<span>•</span><span><i class="fa-regular fa-calendar mr-1"></i>${date}</span>` : ''}
            </div>

            <a href="${b.downloadUrl}" target="_blank"
               class="inline-flex items-center justify-center w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-colors shadow-md hover:shadow-blue-500/30">
              <i class="fa-solid fa-cloud-arrow-down mr-2"></i> ${t('Descargar', 'Download')}
            </a>
          </div>
        </div>
      `;
    }
    html += `</div>`;
    content.innerHTML = html;

    // Kick off thumbnail generation after render
    setTimeout(buildVisibleThumbnails, 50);
  }

  function escapeHTML(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // --- Public API ---
  async function open() {
    ensureStyles();
    ensureModal();
    const modal = document.getElementById('nclex-library-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    if (!state.books.length && !state.isLoading) await fetchBooks();
    else {
      render();
      setTimeout(buildVisibleThumbnails, 50);
    }
  }

  function close() {
    const modal = document.getElementById('nclex-library-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  async function refresh() {
    await fetchBooks();
    setTimeout(buildVisibleThumbnails, 50);
  }

  // expose
  window.library = window.library || {};
  window.library.open = open;
  window.library.close = close;
  window.library.refresh = refresh;

  // --- INIT ---
  function init() {
    ensureStyles();
    ensureButton();
    ensureModal();

    // preload list in background after DOM is ready (keeps UI snappy)
    fetchBooks();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
