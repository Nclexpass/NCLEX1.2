// 33_library.js — Biblioteca AUTO (GitHub Release BOOKS) + carátulas automáticas lazy
// ✅ NO depende de /library/catalog.json
// ✅ Lista PDFs del Release tag "BOOKS"
// ✅ Visor interno (PDF.js) usando PROXY CORS para poder leer releases
// ✅ Carátulas: 1ra página con PDF.js (lazy + cache en localStorage)

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
  // IMPORTANTE: GitHub Releases bloquea CORS.
  // Usamos un proxy CORS para que PDF.js pueda leer el PDF.
  // =========================
  const CORS_PROXY = 'https://corsproxy.io/?'; // si algún día falla, te digo alternativas

  const proxify = (url) => `${CORS_PROXY}${encodeURIComponent(url)}`;

  // =========================
  // PDF.js (para visor y carátulas)
  // =========================
  const PDFJS_LIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // =========================
  // COVERS cache
  // =========================
  const COVERS_KEY = 'NCLEX_COVERS_V1';
  const COVER_MAX_WIDTH = 420;
  const COVER_JPEG_QUALITY = 0.82;

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

  const prettyType = () => 'PDF';

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
        try { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL; } catch {}
        resolve(window.pdfjsLib);
        return;
      }

      const s = document.createElement('script');
      s.src = PDFJS_LIB_URL;
      s.async = true;
      s.onload = () => {
        if (!window.pdfjsLib) return reject(new Error('PDF.js no cargó'));
        try { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL; } catch {}
        resolve(window.pdfjsLib);
      };
      s.onerror = () => reject(new Error('No pude cargar PDF.js (CDN)'));
      document.head.appendChild(s);
    });

    return _pdfjsReady;
  };

  // =========================
  // Covers cache helpers
  // =========================
  const loadCoversCache = () => {
    try {
      const raw = localStorage.getItem(COVERS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };
  const saveCoversCache = (obj) => {
    try { localStorage.setItem(COVERS_KEY, JSON.stringify(obj || {})); } catch {}
  };

  // =========================
  // Render cover
  // =========================
  async function renderCoverFromPdf(pdfUrl) {
    const pdfjsLib = await loadPdfJs();

    // IMPORTANTE: usar URL proxificada
    const url = proxify(pdfUrl);

    const doc = await pdfjsLib.getDocument({ url }).promise;
    const page = await doc.getPage(1);

    const viewport1 = page.getViewport({ scale: 1 });
    const scale = Math.max(1, COVER_MAX_WIDTH / viewport1.width);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    return canvas.toDataURL('image/jpeg', COVER_JPEG_QUALITY);
  }

  // -------- UI / state
  const LibraryCloud = {
    _itemsRaw: [],
    _items: [],
    _filter: '',
    _sort: 'recent',
    _loading: false,
    _error: '',
    _observer: null,
    _covers: loadCoversCache(),
    _coverInFlight: new Set(),

    // Viewer
    _pdf: null,
    _pdfUrl: null,
    _page: 1,
    _pages: 1,
    _rendering: false,

    async load() {
      this._loading = true;
      this._error = '';
      this.renderIntoDom();

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
              coverUrl: '',
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

    // ================
    // VIEWER (PDF.js)
    // ================
    async openViewer(item) {
      if (!item?.fileUrl) return;

      const modal = document.getElementById('library-viewer');
      const title = document.getElementById('library-viewer-title');
      const err = document.getElementById('library-viewer-error');
      const loading = document.getElementById('library-viewer-loading');

      if (title) title.textContent = (item.title?.es || item.title?.en || item.id || '');
      if (err) { err.textContent = ''; err.classList.add('hidden'); }
      if (loading) loading.classList.remove('hidden');
      if (modal) modal.classList.remove('hidden');

      try {
        const pdfjsLib = await loadPdfJs();

        // IMPORTANTE: proxify
        this._pdfUrl = item.fileUrl;
        const url = proxify(item.fileUrl);

        this._pdf = await pdfjsLib.getDocument({ url }).promise;
        this._pages = this._pdf.numPages;
        this._page = 1;

        await this.renderPage();
        this.updateControls();
      } catch (e) {
        console.error(e);
        if (err) {
          err.innerHTML =
            `${t('No pude leer este PDF desde GitHub (CORS).', 'Could not read this PDF from GitHub (CORS).')}<br>` +
            `<span class="text-xs opacity-80">${escapeHTML(e.message || String(e))}</span><br><br>` +
            `${t('Solución rápida:', 'Quick fix:')} ` +
            `<a class="underline font-bold" href="${escapeHTML(this._pdfUrl)}" target="_blank" rel="noopener noreferrer">` +
            `${t('Abrir en otra pestaña', 'Open in new tab')}</a>`;
          err.classList.remove('hidden');
        }
      } finally {
        if (loading) loading.classList.add('hidden');
      }
    },

    closeViewer() {
      const modal = document.getElementById('library-viewer');
      if (modal) modal.classList.add('hidden');

      this._pdf = null;
      this._pdfUrl = null;
      this._page = 1;
      this._pages = 1;

      const canvas = document.getElementById('library-pdf-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },

    async renderPage() {
      if (!this._pdf || this._rendering) return;
      this._rendering = true;

      try {
        const page = await this._pdf.getPage(this._page);
        const canvas = document.getElementById('library-pdf-canvas');
        const wrap = document.getElementById('library-pdf-wrap');
        if (!canvas || !wrap) return;

        const maxW = Math.min(wrap.clientWidth - 24, 1100);
        const viewport1 = page.getViewport({ scale: 1 });
        const scale = Math.max(1, maxW / viewport1.width);
        const viewport = page.getViewport({ scale });

        const ctx = canvas.getContext('2d', { alpha: false });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({ canvasContext: ctx, viewport }).promise;
      } finally {
        this._rendering = false;
      }
    },

    async prevPage() {
      if (!this._pdf || this._page <= 1) return;
      this._page--;
      await this.renderPage();
      this.updateControls();
    },

    async nextPage() {
      if (!this._pdf || this._page >= this._pages) return;
      this._page++;
      await this.renderPage();
      this.updateControls();
    },

    updateControls() {
      const p = document.getElementById('library-page');
      const prev = document.getElementById('library-prev');
      const next = document.getElementById('library-next');
      if (p) p.textContent = this._pdf ? `${this._page} / ${this._pages}` : '';
      if (prev) prev.disabled = !this._pdf || this._page <= 1;
      if (next) next.disabled = !this._pdf || this._page >= this._pages;
    },

    // =========================
    // Covers (lazy + cache)
    // =========================
    setupCoverObserver() {
      if (this._observer) {
        try { this._observer.disconnect(); } catch {}
      }

      const nodes = document.querySelectorAll('div[data-cover-id]');
      if (!nodes.length) return;

      this._observer = new IntersectionObserver(async (entries) => {
        for (const ent of entries) {
          if (!ent.isIntersecting) continue;
          const card = ent.target;
          const id = card.getAttribute('data-cover-id');
          const url = card.getAttribute('data-cover-url');
          if (!id || !url) continue;

          try { this._observer.unobserve(card); } catch {}

          // ya en cache
          if (this._covers[id]) {
            this.applyCover(card, this._covers[id]);
            continue;
          }

          if (this._coverInFlight.has(id)) continue;
          this._coverInFlight.add(id);

          try {
            const dataUrl = await renderCoverFromPdf(url);
            this._covers[id] = dataUrl;
            saveCoversCache(this._covers);
            this.applyCover(card, dataUrl);
          } catch (e) {
            // si falla, se queda el placeholder
          } finally {
            this._coverInFlight.delete(id);
          }
        }
      }, { root: null, rootMargin: '250px 0px', threshold: 0.01 });

      nodes.forEach(n => this._observer.observe(n));
    },

    applyCover(card, dataUrl) {
      const img = card.querySelector('img[data-auto-cover="1"]');
      const ph = card.querySelector('[data-cover-placeholder="1"]');
      if (img) {
        img.src = dataUrl;
        img.classList.remove('hidden');
      }
      if (ph) ph.classList.add('hidden');
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
                  <i class="fa-brands fa-github mr-2"></i>GitHub BOOKS
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
              <div class="flex items-center justify-between mb-4 relative z-10">
                <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">${t('Colección', 'Collection')}</h2>
                <button id="library-reload"
                  class="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold shadow-sm hover:opacity-90 transition">
                  <i class="fa-solid fa-rotate mr-2"></i>${t('Actualizar', 'Reload')}
                </button>
              </div>

              <div id="library-grid" class="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-start">
                ${this._loading ? this.skeletonHTML() : ''}
              </div>
            </div>
          </section>

          <!-- Viewer -->
          <div id="library-viewer" class="fixed inset-0 z-[140] bg-slate-900/80 backdrop-blur-sm hidden">
            <div class="absolute inset-0" id="library-viewer-backdrop"></div>

            <div class="relative max-w-6xl mx-auto mt-10 p-4">
              <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-700">
                <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                  <div class="font-bold text-gray-700 dark:text-gray-200 truncate" id="library-viewer-title"></div>

                  <div class="flex items-center gap-2">
                    <button id="library-prev" class="px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 font-bold">
                      <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <div id="library-page" class="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 font-bold text-sm"></div>
                    <button id="library-next" class="px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 font-bold">
                      <i class="fa-solid fa-chevron-right"></i>
                    </button>

                    <button id="library-close-btn" class="w-10 h-10 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>

                <div class="p-4">
                  <div id="library-viewer-loading" class="hidden mb-3 text-sm text-gray-500 dark:text-gray-400">
                    ${t('Cargando PDF...', 'Loading PDF...')}
                  </div>
                  <div id="library-viewer-error" class="hidden mb-3 text-sm text-red-600"></div>

                  <div id="library-pdf-wrap" class="w-full h-[75vh] overflow-auto rounded-xl bg-black/90 flex items-start justify-center p-3">
                    <canvas id="library-pdf-canvas" class="bg-white rounded-lg shadow"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      `;
    },

    skeletonHTML() {
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

    cardHTML(item) {
      const title = item.title?.es || item.title?.en || item.id || '';

      return `
        <div class="group rounded-3xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-0.5 max-w-[260px] w-full"
             data-cover-id="${escapeHTML(item.id)}"
             data-cover-url="${escapeHTML(item.fileUrl)}">

          <div class="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900">
            <div data-cover-placeholder="1" class="absolute inset-0 flex flex-col items-center justify-center">
              <div class="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-3">
                <i class="fa-solid fa-file-pdf text-red-500 text-2xl"></i>
              </div>
              <div class="text-xs font-extrabold text-slate-200 px-6 text-center line-clamp-2">${escapeHTML(title)}</div>
            </div>

            <img data-auto-cover="1" class="hidden absolute inset-0 w-full h-full object-cover" alt="${escapeHTML(title)}" loading="lazy" />

            <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/75 via-black/20 to-transparent">
              <span class="text-xs px-2 py-1 rounded-full bg-white/15 text-white font-extrabold backdrop-blur border border-white/15">
                ${prettyType()}
              </span>
            </div>
          </div>

          <div class="p-4">
            <div class="font-extrabold text-slate-900 dark:text-white truncate" title="${escapeHTML(title)}">${escapeHTML(title)}</div>

            <div class="mt-4 flex items-center gap-2">
              <button data-open="${escapeHTML(item.id)}"
                class="flex-1 px-3 py-2 rounded-2xl bg-brand-blue text-white font-extrabold hover:opacity-90 transition">
                <i class="fa-solid fa-eye mr-2"></i>${t('Abrir', 'Open')}
              </button>

              <a href="${escapeHTML(item.fileUrl)}" target="_blank" rel="noopener noreferrer"
                class="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 flex items-center justify-center transition"
                title="Link directo">
                <i class="fa-solid fa-link"></i>
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
      this.bindEvents();
      this.renderStats();
      this.renderGrid();
      this.setupCoverObserver();
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

      el.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="text-sm font-extrabold text-gray-700 dark:text-gray-200">${t('Mostrando', 'Showing')}</div>
          <div class="text-sm font-extrabold text-brand-blue">${showing}/${total}</div>
        </div>
        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          ${t('Carátulas y visor usan proxy CORS para GitHub Releases.', 'Covers and viewer use a CORS proxy for GitHub Releases.')}
        </div>
      `;
    },

    renderGrid() {
      const grid = document.getElementById('library-grid');
      if (!grid) return;

      if (this._loading) {
        grid.innerHTML = this.skeletonHTML();
        return;
      }

      if (this._error) {
        grid.innerHTML = `<div class="col-span-full p-8 text-red-500 font-bold">${this._error}</div>`;
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

      // re-observar covers
      this.setupCoverObserver();
    },

    bindEvents() {
      const search = document.getElementById('library-search');
      const sort = document.getElementById('library-sort');
      const reload = document.getElementById('library-reload');

      const closeBtn = document.getElementById('library-close-btn');
      const backdrop = document.getElementById('library-viewer-backdrop');
      const prevBtn = document.getElementById('library-prev');
      const nextBtn = document.getElementById('library-next');

      if (search) search.addEventListener('input', (e) => this.setFilter(e.target.value));
      if (sort) sort.addEventListener('change', (e) => this.setSort(e.target.value));
      if (reload) reload.addEventListener('click', () => this.load());

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeViewer());
      if (backdrop) backdrop.addEventListener('click', () => this.closeViewer());
      if (prevBtn) prevBtn.addEventListener('click', () => this.prevPage());
      if (nextBtn) nextBtn.addEventListener('click', () => this.nextPage());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeViewer();
      });
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
