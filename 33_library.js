// 33_library.js — Biblioteca AUTO desde GitHub Releases (BOOKS)
// ✅ Funciona en LOCAL (con servidor) y cuando lo subas (Firebase/Netlify/etc).
// ✅ Carga AUTOMÁTICO desde GitHub Release tag "BOOKS" (assets .pdf).
// ✅ Cache (6 horas) para no pegar rate limit.
// ✅ Fallback: si existe /library/catalog.json lo intenta primero (opcional).
//
// IMPORTANTE:
// - NO abras index.html con doble click (file://) porque el navegador bloquea fetch(). Usa un servidor local.
// - Para carátulas automáticas: sube también al Release "BOOKS" un .jpg/.png/.webp con el MISMO nombre base del PDF.
//   Ej: Farmacologia_Pearson.pdf  +  Farmacologia_Pearson.jpg

(function () {
  'use strict';

  if (!window.NCLEX) return;

  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  // ✅ Fallback local (si lo quieres mantener)
  const CATALOG_URL = window.NCLEX_LIBRARY_CATALOG_URL || '/library/catalog.json';

  // ✅ GitHub Releases (AUTO)
  const GH_OWNER = 'Nclexpass';
  const GH_REPO = 'NCLEX1.2';
  const GH_TAG = 'BOOKS';

  // Cache para evitar rate-limit / latencia
  const GH_CACHE_KEY = 'nclex_gh_books_cache_v1';
  const GH_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 horas

  // -------- helpers
  const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

  const isAbsoluteUrl = (u) => /^https?:\/\//i.test(String(u || ''));

  // ✅ Siempre resuelve assets desde raíz del dominio
  const resolveUrl = (maybeRelative) => {
    if (!maybeRelative) return '';
    let raw = String(maybeRelative);
    if (!isAbsoluteUrl(raw) && !raw.startsWith('/')) raw = '/' + raw;

    try {
      const u = isAbsoluteUrl(raw) ? new URL(raw) : new URL(raw, window.location.origin);
      return u.toString();
    } catch {
      return encodeURI(raw);
    }
  };

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

  const guessIcon = (item) => {
    if (guessIsPDF(item)) return { fa: 'file-pdf', color: 'text-red-500' };
    const url = String(item.fileUrl || '').toLowerCase();
    if (String(item.type || '').toLowerCase() === 'epub' || url.endsWith('.epub')) return { fa: 'book-open', color: 'text-emerald-500' };
    return { fa: 'file', color: 'text-slate-500' };
  };

  const safeTime = (ms) => {
    const n = Number(ms);
    if (!Number.isFinite(n)) return null;
    const min = 946684800000;        // 2000-01-01
    const max = 4102444800000;       // 2100-01-01
    if (n < min || n > max) return null;
    return n;
  };

  const titleFromFilename = (name) => {
    const base = String(name || '').replace(/\.[^/.]+$/, '');
    return base.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const idFromFilename = (name) => {
    const base = String(name || '').replace(/\.[^/.]+$/, '');
    return base.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  };

  const tryReadCache = () => {
    try {
      const cached = JSON.parse(localStorage.getItem(GH_CACHE_KEY) || 'null');
      if (cached && cached.ts && Array.isArray(cached.items)) {
        if ((Date.now() - cached.ts) < GH_CACHE_TTL_MS) return cached.items;
      }
    } catch (_) {}
    return null;
  };

  const writeCache = (items) => {
    try {
      localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ ts: Date.now(), items }));
    } catch (_) {}
  };

  async function fetchBooksFromGitHubRelease() {
    const cached = tryReadCache();
    if (cached) return cached;

    const apiUrl = `https://api.github.com/repos/${encodeURIComponent(GH_OWNER)}/${encodeURIComponent(GH_REPO)}/releases/tags/${encodeURIComponent(GH_TAG)}`;
    const res = await fetch(apiUrl, {
      headers: { 'Accept': 'application/vnd.github+json' },
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`GitHub release fetch failed: HTTP ${res.status}`);

    const release = await res.json();
    const assets = Array.isArray(release.assets) ? release.assets : [];

    // PDFs
    const pdfs = assets.filter(a => a && /\.pdf$/i.test(a.name || ''));
    // Covers (map por nombre base)
    const coverMap = new Map(
      assets
        .filter(a => a && /\.(jpg|jpeg|png|webp)$/i.test(a.name || ''))
        .map(a => [String(a.name).replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase(), a.browser_download_url])
    );

    const items = pdfs.map(a => {
      const pdfName = String(a.name || '');
      const title = titleFromFilename(pdfName);
      const id = idFromFilename(pdfName);

      const baseKey = pdfName.replace(/\.pdf$/i, '').toLowerCase();
      const coverUrl = coverMap.get(baseKey) || '';

      return {
        id,
        title: { es: title, en: title },
        author: '',
        type: 'pdf',
        fileUrl: String(a.browser_download_url || ''),
        coverUrl: coverUrl ? String(coverUrl) : '',
        tags: ['NCLEX'],
        addedAt: Date.now(),
        source: 'github_release_live'
      };
    });

    writeCache(items);
    return items;
  }

  async function loadCatalogFallback() {
    const res = await fetch(CATALOG_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    let list = [];
    if (Array.isArray(data)) list = data;
    else if (Array.isArray(data?.items)) list = data.items;
    else if (data && typeof data === 'object') list = [data];

    return list.map((x) => {
      const titleObj = (x && typeof x.title === 'object') ? x.title : null;
      const titleEs = titleObj?.es || x.titleEs || x.title || '';
      const titleEn = titleObj?.en || x.titleEn || x.title || '';
      const added = safeTime(x.addedAt) ?? Date.now();

      return {
        id: String(x.id || titleEs || titleEn || Math.random().toString(16).slice(2)),
        title: { es: String(titleEs || ''), en: String(titleEn || '') },
        author: String(x.author || ''),
        type: String(x.type || ''),
        fileUrl: resolveUrl(x.fileUrl || x.filePath || ''),
        coverUrl: resolveUrl(x.coverUrl || x.coverPath || ''),
        tags: Array.isArray(x.tags) ? x.tags.map(String) : [],
        addedAt: added,
        source: String(x.source || 'catalog_fallback')
      };
    });
  }

  async function loadLibraryCatalogSmart() {
    // 1) Intentar GitHub (lo que tú quieres)
    try {
      const ghItems = await fetchBooksFromGitHubRelease();
      if (Array.isArray(ghItems) && ghItems.length) return ghItems;
    } catch (e) {
      console.warn('[Library] GitHub load failed:', e);
    }

    // 2) Fallback: catalog.json (si existe)
    try {
      const fb = await loadCatalogFallback();
      if (Array.isArray(fb)) return fb;
    } catch (e) {
      console.warn('[Library] Catalog fallback failed:', e);
    }

    return [];
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
          t('Para que la biblioteca funcione en local, abre con un servidor:', 'To use the library locally, run a server:') +
          `<br><br>
           <div class="text-left inline-block">
             <div class="font-bold mb-1">PowerShell:</div>
             <code class="block bg-black/5 dark:bg-white/10 p-3 rounded-xl text-xs">
               cd "A:\\NCLEX SOFTWARE\\NCLEX1.2"<br>
               firebase serve --only hosting
             </code>
           </div>`;
        this.renderIntoDom();
        return;
      }

      try {
        const list = await loadLibraryCatalogSmart();

        this._itemsRaw = (list || []).map((x) => {
          const titleObj = (x && typeof x.title === 'object') ? x.title : null;
          const titleEs = titleObj?.es || x.titleEs || x.title || '';
          const titleEn = titleObj?.en || x.titleEn || x.title || '';
          const added = safeTime(x.addedAt) ?? Date.now();

          return {
            id: String(x.id || titleEs || titleEn || Math.random().toString(16).slice(2)),
            title: { es: String(titleEs || ''), en: String(titleEn || '') },
            author: String(x.author || ''),
            type: String(x.type || ''),
            fileUrl: resolveUrl(x.fileUrl || x.filePath || ''),
            coverUrl: resolveUrl(x.coverUrl || x.coverPath || ''),
            tags: Array.isArray(x.tags) ? x.tags.map(String) : [],
            addedAt: added,
            source: String(x.source || 'auto')
          };
        });

        this.applyFilterSort();
      } catch (e) {
        console.error(e);
        this._error = `${t('No pude cargar la biblioteca desde GitHub Releases.', 'Could not load the library from GitHub Releases.')} (${escapeHTML(e.message || String(e))})`;
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
      if (frame) frame.src = url;
      if (modal) modal.classList.remove('hidden');

      this._viewerUrl = url;
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
                <a href="https://github.com/${escapeHTML(GH_OWNER)}/${escapeHTML(GH_REPO)}/releases/tag/${escapeHTML(GH_TAG)}"
                   target="_blank" rel="noopener noreferrer"
                  class="px-4 py-2 rounded-xl bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:shadow-md transition backdrop-blur">
                  <i class="fa-brands fa-github mr-2 text-slate-800 dark:text-slate-200"></i>${t('Ver BOOKS', 'View BOOKS')}
                </a>

                <a href="${escapeHTML(resolveUrl(CATALOG_URL))}" target="_blank" rel="noopener noreferrer"
                  class="px-4 py-2 rounded-xl bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:shadow-md transition backdrop-blur">
                  <i class="fa-solid fa-code mr-2 text-brand-blue"></i>${t('Ver Catálogo', 'View Catalog')}
                </a>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
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
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${t('Preparando tu gabinete.', 'Preparing your cabinet.')}</div>
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
      const icon = guessIcon(item);
      const title = item.title?.es || item.title?.en || item.id || '';
      const author = item.author || '';
      const tags = (item.tags || []).slice(0, 3);
      const cover = item.coverUrl || '';

      const coverNode = cover
        ? `<img src="${escapeHTML(cover)}" alt="${escapeHTML(title)}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />`
        : `
          <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-black">
            <div class="w-14 h-14 rounded-2xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-slate-700 flex items-center justify-center mb-3">
              <i class="fa-solid ${icon.color} fa-${icon.fa} text-2xl"></i>
            </div>
            <div class="text-xs font-extrabold text-slate-700 dark:text-slate-200 px-6 text-center line-clamp-2">${escapeHTML(title)}</div>
          </div>
        `;

      return `
        <div class="group rounded-3xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-0.5 max-w-[260px] w-full">
          <div class="aspect-[3/4] relative overflow-hidden">
            ${coverNode}
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

              <a href="${escapeHTML(item.fileUrl)}" download
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
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${t('Conectando...', 'Connecting...')}</div>
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
      if (reload) reload.addEventListener('click', () => {
        // limpiar cache para forzar refresh
        try { localStorage.removeItem(GH_CACHE_KEY); } catch (_) {}
        this.load();
      });
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
