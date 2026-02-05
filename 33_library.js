// 33_library.js — Biblioteca AUTO (GitHub Release BOOKS) + carátulas automáticas lazy
// ✅ NO depende de /library/catalog.json
// ✅ Lee los PDFs DIRECTO del Release tag "BOOKS" (GitHub API)
// ✅ Abre PDFs en un visor (PDF.js viewer) para evitar que se descarguen
// ✅ Carátulas automáticas: renderiza 1ra página con PDF.js (lazy + cache en memoria)
// ✅ Funciona en Firebase Hosting sin correr scripts localmente

(function () {
  'use strict';

  if (!window.NCLEX) return;

  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  // =========================
  // CONFIG — GitHub Release
  // =========================
  const GITHUB_OWNER = 'Nclexpass';
  const GITHUB_REPO = 'NCLEX1.2';
  const GITHUB_RELEASE_TAG = 'BOOKS';

  const GITHUB_API_URL =
    `https://api.github.com/repos/${encodeURIComponent(GITHUB_OWNER)}/${encodeURIComponent(GITHUB_REPO)}` +
    `/releases/tags/${encodeURIComponent(GITHUB_RELEASE_TAG)}`;

  const GITHUB_RELEASE_PAGE =
    `https://github.com/${encodeURIComponent(GITHUB_OWNER)}/${encodeURIComponent(GITHUB_REPO)}` +
    `/releases/tag/${encodeURIComponent(GITHUB_RELEASE_TAG)}`;

  // =========================
  // PDF Viewer — evita descarga
  // =========================
  // Usamos el viewer oficial de PDF.js (hosteado por Mozilla).
  // Esto abre el PDF dentro del iframe, aunque GitHub lo fuerce a "download".
  const PDFJS_WEB_VIEWER = 'https://mozilla.github.io/pdf.js/web/viewer.html?file=';

  // =========================
  // PDF.js (para carátulas)
  // =========================
  const PDFJS_LIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // -------- helpers
  const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

  const normalize = (s) => String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const guessIsPDF = (item) => {
    const type = String(item.type || '').toLowerCase();
    const url = String(item.fileUrl || '').toLowerCase();
    return type === 'pdf' || url.endsWith('.pdf') || url.includes('.pdf?');
  };

  const prettyType = (type, item) => {
    const v = String(type || '').toLowerCase();
    if (v === 'pdf' || guessIsPDF(item)) return 'PDF';
    if (v === 'epub') return 'EPUB';
    return (v || 'FILE').toUpperCase();
  };

  const safeTime = (ms) => {
    const n = Number(ms);
    if (!Number.isFinite(n)) return null;
    const min = 946684800000;        // 2000-01-01
    const max = 4102444800000;       // 2100-01-01
    if (n < min || n > max) return null;
    return n;
  };

  // =========================
  // PDF.js loader (solo 1 vez)
  // =========================
  let _pdfjsReady = null;
  const loadPdfJs = () => {
    if (_pdfjsReady) return _pdfjsReady;

    _pdfjsReady = new Promise((resolve, reject) => {
      if (window.pdfjsLib) {
        try {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        } catch {}
        resolve(window.pdfjsLib);
        return;
      }

      const s = document.createElement('script');
      s.src = PDFJS_LIB_URL;
      s.async = true;
      s.onload = () => {
        if (!window.pdfjsLib) return reject(new Error('PDF.js no cargó'));
        try {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        } catch {}
        resolve(window.pdfjsLib);
      };
      s.onerror = () => reject(new Error('No pude cargar PDF.js (CDN)'));
      document.head.appendChild(s);
    });

    return _pdfjsReady;
  };

  // Cache en memoria para carátulas (no llena localStorage)
  const coverCache = new Map(); // id -> dataURL
  const coverInFlight = new Set(); // id

  async function renderCoverFromPdf(url, maxWidth = 420) {
    const pdfjsLib = await loadPdfJs();

    // traemos bytes del PDF
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`PDF HTTP ${res.status}`);
    const data = await res.arrayBuffer();

    const doc = await pdfjsLib.getDocument({ data }).promise;
    const page = await doc.getPage(1);

    // Escala para que quede liviano pero bonito
    const viewport1 = page.getViewport({ scale: 1 });
    const scale = Math.min(1, maxWidth / viewport1.width);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    // JPEG = más liviano que PNG
    return canvas.toDataURL('image/jpeg', 0.82);
  }

  // -------- UI / state
  const LibraryCloud = {
    _itemsRaw: [],
    _items: [],
    _filter: '',
    _sort: 'recent',
    _loading: false,
    _error: '',
    _viewerUrl: null,
    _escBound: false,
    _observer: null,

    async load() {
      this._loading = true;
      this._error = '';
      this.renderIntoDom();

      // Si abres con doble click (file://) fetch no funciona.
      if (window.location.protocol === 'file:') {
        this._loading = false;
        this._error =
          t('Estás abriendo el programa con doble click (file://).', 'You opened the app as a file (file://).') +
          '<br>' +
          t('Para que la biblioteca funcione en local, abre con un servidor.', 'To use the library locally, run a server.');
        this.renderIntoDom();
        return;
      }

      try {
        const res = await fetch(GITHUB_API_URL, {
          cache: 'no-store',
          headers: { 'Accept': 'application/vnd.github+json' }
        });
        if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`);

        const data = await res.json();

        const assets = Array.isArray(data?.assets) ? data.assets : [];
        const list = assets
          .filter(a => String(a?.content_type || '').toLowerCase().includes('pdf'))
          .map(a => {
            const name = String(a?.name || '').trim();
            const title = name.replace(/\.pdf$/i, '').replace(/[._]+/g, ' ').replace(/\s+/g, ' ').trim();

            return {
              id: name || Math.random().toString(16).slice(2),
              title: { es: title, en: title },
              author: '',
              type: 'pdf',
              fileUrl: String(a?.browser_download_url || ''),
              coverUrl: '', // auto cover
              tags: ['NCLEX'],
              addedAt: safeTime(Date.parse(a?.updated_at)) ?? Date.now(),
              source: 'github_release'
            };
          });

        this._itemsRaw = list;
        this.applyFilterSort();
      } catch (e) {
        console.error(e);
        this._error = `${t('No pude cargar los libros desde GitHub Release BOOKS.', 'Could not load books from GitHub Release BOOKS.')} (${escapeHTML(e.message || String(e))})`;
      } finally {
        this._loading = false;
        this.renderIntoDom();
      }
    },

    applyFilterSort() {
      const q = normalize(this._filter.trim());
      let items = [...this._itemsRaw];

      if (q) {
        items = items.filter(it => {
          const hay = normalize([it.title?.es, it.title?.en, it.author, ...(it.tags || [])].join(' '));
          return hay.includes(q);
        });
      }

      if (this._sort === 'title') {
        items.sort((a, b) => (a.title?.es || a.title?.en || '').localeCompare(b.title?.es || b.title?.en || ''));
      } else if (this._sort === 'author') {
        items.sort((a, b) => (a.author || '').localeCompare(b.author || '') || (a.title?.es || '').localeCompare(b.title?.es || ''));
      } else {
        items.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
      }

      this._items = items;
    },

    setFilter(v) {
      this._filter = String(v || '');
      this.applyFilterSort();
      this.renderGrid();
      this.renderStats();
    },

    setSort(v) {
      this._sort = String(v || 'recent');
      this.applyFilterSort();
      this.renderGrid();
    },

    // ----- viewer
    openViewer(item) {
      if (!item?.fileUrl) return;

      const isPDF = guessIsPDF(item);
      const url = item.fileUrl;

      if (!isPDF) {
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }

      const modal = document.getElementById('library-viewer');
      const frame = document.getElementById('library-frame');
      const title = document.getElementById('library-viewer-title');

      if (title) title.textContent = (item.title?.es || item.title?.en || item.id || '');

      // 👇 PDF.js viewer evita descarga
      const viewerUrl = PDFJS_WEB_VIEWER + encodeURIComponent(url);
      if (frame) frame.src = viewerUrl;

      if (modal) modal.classList.remove('hidden');

      this._viewerUrl = viewerUrl;
      this.updateFullscreenBtn();
    },

    closeViewer() {
      const modal = document.getElementById('library-viewer');
      const frame = document.getElementById('library-frame');
      const title = document.getElementById('library-viewer-title');
      if (frame) frame.src = 'about:blank';
      if (title) title.textContent = '';
      if (modal) modal.classList.add('hidden');
      this._viewerUrl = null;
      this.updateFullscreenBtn();
    },

    async toggleFullscreen() {
      const panel = document.getElementById('library-viewer-panel');
      if (!panel) return;

      try {
        if (!document.fullscreenElement) await panel.requestFullscreen();
        else await document.exitFullscreen();
      } catch (e) {
        console.warn('Fullscreen failed:', e);
      } finally {
        this.updateFullscreenBtn();
      }
    },

    updateFullscreenBtn() {
      const btn = document.getElementById('library-fullscreen-btn');
      if (!btn) return;
      const isOpen = !!this._viewerUrl;
      btn.disabled = !isOpen;
      btn.classList.toggle('opacity-40', !isOpen);
      btn.classList.toggle('cursor-not-allowed', !isOpen);
      btn.innerHTML = document.fullscreenElement
        ? `<i class="fa-solid fa-compress"></i>`
        : `<i class="fa-solid fa-expand"></i>`;
      btn.title = document.fullscreenElement ? 'Salir de pantalla completa' : 'Pantalla completa';
    },

    // ----- covers (lazy)
    setupCoverObserver() {
      // Limpia observer anterior
      if (this._observer) {
        try { this._observer.disconnect(); } catch {}
      }

      const nodes = document.querySelectorAll('[data-cover-id]');
      if (!nodes.length) return;

      this._observer = new IntersectionObserver(async (entries) => {
        for (const ent of entries) {
          if (!ent.isIntersecting) continue;
          const el = ent.target;
          const id = el.getAttribute('data-cover-id');
          if (!id) continue;

          // deja de observar ese nodo
          try { this._observer.unobserve(el); } catch {}

          // ya tenemos cover
          if (coverCache.has(id)) {
            el.src = coverCache.get(id);
            el.classList.remove('opacity-0');
            continue;
          }

          // si está en proceso
          if (coverInFlight.has(id)) continue;

          const item = this._itemsRaw.find(x => x.id === id);
          if (!item?.fileUrl) continue;

          coverInFlight.add(id);

          try {
            const dataUrl = await renderCoverFromPdf(item.fileUrl, 420);
            coverCache.set(id, dataUrl);

            // si sigue en DOM
            const still = document.querySelector(`img[data-cover-id="${CSS.escape(id)}"]`);
            if (still) {
              still.src = dataUrl;
              still.classList.remove('opacity-0');
            }
          } catch (e) {
            // si falla, lo dejamos con placeholder
            console.warn('Cover failed:', id, e);
          } finally {
            coverInFlight.delete(id);
          }
        }
      }, { root: null, rootMargin: '200px 0px', threshold: 0.01 });

      nodes.forEach(n => this._observer.observe(n));
    },

    // ----- render
    shellHTML() {
      return `
        <div class="animate-fade-in">
          <header class="mb-8">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  ${t('Biblioteca', 'Library')}
                </h1>
                <p class="mt-1 text-gray-500 dark:text-gray-400">
                  ${t('Libros y PDFs para todos los usuarios.', 'Books & PDFs for all users.')}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <a href="${escapeHTML(GITHUB_RELEASE_PAGE)}" target="_blank" rel="noopener noreferrer"
                  class="px-4 py-2 rounded-xl bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:shadow-md transition backdrop-blur">
                  <i class="fa-solid fa-cloud mr-2 text-brand-blue"></i>GitHub BOOKS
                </a>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                <input id="library-search" type="text"
                  placeholder="Buscar por título, autor, tags..."
                  class="w-full bg-gray-100 dark:bg-black/30 border border-transparent focus:border-brand-blue/30 rounded-xl py-3 pl-11 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder-gray-500" />
              </div>

              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500 dark:text-gray-400 font-semibold">${t('Orden:', 'Sort:')}</span>
                <select id="library-sort"
                  class="flex-1 bg-gray-100 dark:bg-black/30 border border-transparent focus:border-brand-blue/30 rounded-xl py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all">
                  <option value="recent">Más recientes</option>
                  <option value="title">Título A-Z</option>
                  <option value="author">Autor A-Z</option>
                </select>
              </div>

              <div id="library-stats" class="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
                <div class="text-sm font-bold text-gray-700 dark:text-gray-200">${t('Cargando...', 'Loading...')}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${t('Conectando a GitHub...', 'Connecting to GitHub...')}</div>
              </div>
            </div>
          </header>

          <section class="rounded-3xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900/40">
            <div class="relative p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-black">
              <div class="absolute inset-0 pointer-events-none opacity-70">
                <div class="absolute inset-x-0 top-1/3 h-px bg-gray-200/70 dark:bg-white/10"></div>
                <div class="absolute inset-x-0 top-2/3 h-px bg-gray-200/70 dark:bg-white/10"></div>
              </div>

              <div class="flex items-center justify-between mb-4 relative z-10">
                <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">${t('Colección', 'Collection')}</h2>
                <button id="library-reload"
                  class="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold shadow-sm hover:opacity-90 transition">
                  <i class="fa-solid fa-rotate mr-2"></i>${t('Actualizar', 'Reload')}
                </button>
              </div>

              <div id="library-grid" class="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-start">
                ${this.skeletonCardsHTML()}
              </div>
            </div>
          </section>

          <div id="library-viewer" class="fixed inset-0 z-[140] bg-slate-900/80 backdrop-blur-sm hidden">
            <div class="absolute inset-0" id="library-viewer-backdrop"></div>

            <div class="relative max-w-6xl mx-auto mt-10 p-4">
              <div id="library-viewer-panel" class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-700">
                <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                      <i class="fa-solid fa-book-open"></i>
                    </div>
                    <div class="font-bold text-gray-700 dark:text-gray-200 truncate" id="library-viewer-title"></div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button id="library-fullscreen-btn"
                      class="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
                      title="Pantalla completa" aria-label="Fullscreen">
                      <i class="fa-solid fa-expand"></i>
                    </button>

                    <button id="library-close-btn"
                      class="w-10 h-10 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                      title="Cerrar" aria-label="Close">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>

                <iframe id="library-frame" class="w-full h-[78vh] bg-black" title="PDF Viewer"></iframe>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    skeletonCardsHTML() {
      return `${Array.from({ length: 8 }).map(() => `
        <div class="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-white/5 overflow-hidden shadow-sm max-w-[260px] w-full">
          <div class="aspect-[3/4] bg-gray-100 dark:bg-white/10 animate-pulse"></div>
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-100 dark:bg-white/10 rounded animate-pulse"></div>
            <div class="h-3 bg-gray-100 dark:bg-white/10 rounded w-2/3 animate-pulse"></div>
            <div class="h-9 bg-gray-100 dark:bg-white/10 rounded-xl animate-pulse mt-3"></div>
          </div>
        </div>
      `).join('')}`;
    },

    emptyHTML() {
      return `
        <div class="col-span-full p-10 text-center text-gray-500 dark:text-gray-400">
          <div class="mx-auto w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4">
            <i class="fa-solid fa-books text-2xl"></i>
          </div>
          <p class="font-bold">${t('No hay libros que coincidan con tu búsqueda.', 'No books match your search.')}</p>
        </div>
      `;
    },

    errorHTML() {
      return `
        <div class="col-span-full p-10 text-center">
          <div class="mx-auto w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-600 dark:text-red-300">
            <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
          </div>
          <p class="font-extrabold text-slate-900 dark:text-white">${t('Error cargando biblioteca', 'Error loading library')}</p>
          <p class="text-sm mt-2 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">${this._error}</p>
          <button id="library-retry" class="mt-6 px-5 py-3 rounded-2xl bg-brand-blue text-white font-bold hover:opacity-90 transition">
            <i class="fa-solid fa-rotate mr-2"></i>${t('Reintentar', 'Retry')}
          </button>
        </div>
      `;
    },

    cardHTML(item) {
      const title = item.title?.es || item.title?.en || item.id || '';
      const author = item.author || '';
      const tags = (item.tags || []).slice(0, 3);

      // Placeholder elegante hasta que se genere la carátula
      return `
        <div class="group rounded-3xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-0.5 max-w-[260px] w-full">
          <div class="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-black">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-14 h-14 rounded-2xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
                <i class="fa-solid fa-file-pdf text-red-500 text-2xl"></i>
              </div>
            </div>

            <img
              data-cover-id="${escapeHTML(item.id)}"
              alt="${escapeHTML(title)}"
              class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300"
              loading="lazy"
            />

            <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/25 to-transparent">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs px-2 py-1 rounded-full bg-white/15 text-white font-extrabold backdrop-blur border border-white/15">
                  ${prettyType(item.type, item)}
                </span>
              </div>
            </div>
          </div>

          <div class="p-4">
            <div class="min-w-0">
              <div class="font-extrabold text-slate-900 dark:text-white truncate" title="${escapeHTML(title)}">${escapeHTML(title)}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">${author ? escapeHTML(author) : '&nbsp;'}</div>
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
              ${tags.map(tag => `
                <span class="text-[11px] px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-bold">
                  ${escapeHTML(tag)}
                </span>
              `).join('')}
            </div>

            <div class="mt-4 flex items-center gap-2">
              <button data-open="${escapeHTML(item.id)}"
                class="flex-1 px-3 py-2 rounded-2xl bg-brand-blue text-white font-extrabold hover:opacity-90 transition">
                <i class="fa-solid fa-eye mr-2"></i>${t('Abrir', 'Open')}
              </button>

              <a href="${escapeHTML(item.fileUrl)}" target="_blank" rel="noopener noreferrer"
                class="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 flex items-center justify-center transition"
                title="Descargar">
                <i class="fa-solid fa-download"></i>
              </a>
            </div>
          </div>
        </div>
      `;
    },

    renderIntoDom() {
      const view = document.getElementById('app-view');
      if (!view) return;
      view.innerHTML = this.shellHTML();
      this.bindShellEvents();
      this.renderStats();
      this.renderGrid();
    },

    renderStats() {
      const el = document.getElementById('library-stats');
      if (!el) return;

      if (this._loading) {
        el.innerHTML = `
          <div class="text-sm font-bold text-gray-700 dark:text-gray-200">${t('Cargando...', 'Loading...')}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${t('Conectando a GitHub...', 'Connecting to GitHub...')}</div>
        `;
        return;
      }

      const total = this._itemsRaw.length;
      const showing = this._items.length;
      const pdfs = this._itemsRaw.filter(guessIsPDF).length;

      el.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="text-sm font-extrabold text-gray-700 dark:text-gray-200">${t('Mostrando', 'Showing')}</div>
          <div class="text-sm font-extrabold text-brand-blue">${showing}/${total}</div>
        </div>
        <div class="mt-2 grid grid-cols-3 gap-2 text-xs">
          <div class="rounded-xl bg-gray-100 dark:bg-white/10 px-3 py-2 text-center">
            <div class="font-bold text-gray-700 dark:text-gray-200">PDF</div>
            <div class="text-gray-500 dark:text-gray-400">${pdfs}</div>
          </div>
          <div class="rounded-xl bg-gray-100 dark:bg-white/10 px-3 py-2 text-center">
            <div class="font-bold text-gray-700 dark:text-gray-200">${t('Total', 'Total')}</div>
            <div class="text-gray-500 dark:text-gray-400">${total}</div>
          </div>
          <div class="rounded-xl bg-gray-100 dark:bg-white/10 px-3 py-2 text-center">
            <div class="font-bold text-gray-700 dark:text-gray-200">${t('Nube', 'Cloud')}</div>
            <div class="text-gray-500 dark:text-gray-400">OK</div>
          </div>
        </div>
      `;
    },

    renderGrid() {
      const grid = document.getElementById('library-grid');
      if (!grid) return;

      if (this._loading) {
        grid.innerHTML = this.skeletonCardsHTML();
        return;
      }

      if (this._error) {
        grid.innerHTML = this.errorHTML();
        const btn = document.getElementById('library-retry');
        if (btn) btn.addEventListener('click', () => this.load());
        return;
      }

      if (!this._items.length) {
        grid.innerHTML = this.emptyHTML();
        return;
      }

      grid.innerHTML = this._items.map(it => this.cardHTML(it)).join('');

      grid.querySelectorAll('[data-open]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-open');
          const item = this._itemsRaw.find(x => x.id === id);
          if (item) this.openViewer(item);
        });
      });

      // 👇 activar carátulas lazy
      this.setupCoverObserver();
    },

    bindShellEvents() {
      const search = document.getElementById('library-search');
      const sort = document.getElementById('library-sort');
      const reload = document.getElementById('library-reload');
      const closeBtn = document.getElementById('library-close-btn');
      const backdrop = document.getElementById('library-viewer-backdrop');
      const fsBtn = document.getElementById('library-fullscreen-btn');

      if (search) search.addEventListener('input', (e) => this.setFilter(e.target.value));
      if (sort) sort.addEventListener('change', (e) => this.setSort(e.target.value));
      if (reload) reload.addEventListener('click', () => this.load());
      if (closeBtn) closeBtn.addEventListener('click', () => this.closeViewer());
      if (backdrop) backdrop.addEventListener('click', () => this.closeViewer());
      if (fsBtn) fsBtn.addEventListener('click', () => this.toggleFullscreen());

      if (!this._escBound) {
        this._escBound = true;
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
              this.updateFullscreenBtn();
              return;
            }
            this.closeViewer();
          }
        });
      }

      document.addEventListener('fullscreenchange', () => this.updateFullscreenBtn());
      this.updateFullscreenBtn();
    },

    onLoad() {
      this.closeViewer();
      this.load();
    }
  };

  // Registrar topic
  NCLEX.registerTopic({
    id: 'library',
    title: { es: 'Biblioteca', en: 'Library' },
    subtitle: { es: 'Libros en la nube', en: 'Cloud Library' },
    icon: 'book-open',
    color: 'teal',
    render() { return LibraryCloud.shellHTML(); },
    onLoad() { LibraryCloud.onLoad(); }
  });

})();
