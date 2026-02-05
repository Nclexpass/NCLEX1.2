// 33_library.js — Biblioteca (GitHub Release BOOKS -> catalog.json automático)
// ✅ Lee /library/catalog.json (generado por GitHub Actions)
// ✅ Muestra lista, búsqueda, orden, placeholder de carátula
// ✅ Abre PDFs en nueva pestaña (porque GitHub Releases bloquea iframe/PDF.js por CORS/X-Frame)

(function () {
  'use strict';

  if (!window.NCLEX) return;

  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  // Catálogo desde tu hosting (Firebase)
  const CATALOG_URL = window.NCLEX_LIBRARY_CATALOG_URL || '/library/catalog.json';

  // -------- helpers
  const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

  const isAbsoluteUrl = (u) => /^https?:\/\//i.test(String(u || ''));

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

  const safeTime = (ms) => {
    const n = Number(ms);
    if (!Number.isFinite(n)) return null;
    const min = 946684800000;        // 2000-01-01
    const max = 4102444800000;       // 2100-01-01
    if (n < min || n > max) return null;
    return n;
  };

  // Crea un "título bonito" si vienen nombres raros
  const prettifyTitle = (s) => String(s || '')
    .replace(/\.pdf$/i, '')
    .replace(/[_]+/g, ' ')
    .replace(/[.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

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
          t('Para que la biblioteca funcione en local, abre con un servidor.', 'To use the library locally, run a server.');
        this.renderIntoDom();
        return;
      }

      try {
        // cache-bust para que NO se quede pegado con catálogos viejos
        const url = CATALOG_URL + (CATALOG_URL.includes('?') ? '&' : '?') + 'v=' + Date.now();

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        let list = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data?.items)) list = data.items;
        else if (data && typeof data === 'object') list = [data];

        this._itemsRaw = list.map((x) => {
          const titleObj = (x && typeof x.title === 'object') ? x.title : null;

          const rawTitleEs = titleObj?.es || x.titleEs || x.title || '';
          const rawTitleEn = titleObj?.en || x.titleEn || x.title || '';

          // si no vino título bonito, lo sacamos del fileUrl
          let fallbackName = '';
          try {
            const u = new URL(String(x.fileUrl || ''), window.location.origin);
            fallbackName = decodeURIComponent(u.pathname.split('/').pop() || '');
          } catch { /* ignore */ }

          const titleEs = prettifyTitle(rawTitleEs || fallbackName);
          const titleEn = prettifyTitle(rawTitleEn || fallbackName);

          const added = safeTime(x.addedAt) ?? Date.now();

          return {
            id: String(x.id || titleEs || titleEn || Math.random().toString(16).slice(2)),
            title: { es: String(titleEs || ''), en: String(titleEn || '') },
            author: String(x.author || ''),
            type: String(x.type || ''),
            fileUrl: resolveUrl(x.fileUrl || x.filePath || ''),
            coverUrl: resolveUrl(x.coverUrl || x.coverPath || ''), // ahora puede venir vacío
            tags: Array.isArray(x.tags) ? x.tags.map(String) : [],
            addedAt: added
          };
        });

        this.applyFilterSort();
      } catch (e) {
        console.error(e);
        this._error = `${t('No pude cargar el catálogo de la biblioteca.', 'Could not load the library catalog.')} (${escapeHTML(e.message || String(e))})`;
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

    // ----- viewer (IMPORTANTE: GitHub Releases bloquea iframe/PDF.js -> abrimos en nueva pestaña)
    openViewer(item) {
      if (!item?.fileUrl) return;

      const url = item.fileUrl;

      // Abrir en nueva pestaña para que se lea (evita CORS/X-Frame)
      window.open(url, '_blank', 'noopener,noreferrer');
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
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  ${t('Nota: Los PDFs están en GitHub Releases. Se abren en una pestaña nueva para evitar CORS.', 'Note: PDFs are hosted on GitHub Releases. We open them in a new tab to avoid CORS.')}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <a href="${escapeHTML(resolveUrl(CATALOG_URL))}" target="_blank" rel="noopener noreferrer"
                  class="px-4 py-2 rounded-xl bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:shadow-md transition backdrop-blur">
                  <i class="fa-solid fa-code mr-2 text-brand-blue"></i>${t('Ver Catálogo', 'View Catalog')}
                </a>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                <input id="library-search" type="text"
                  placeholder="Buscar por título, autor, tags..."
                  class="w-full bg-gray-100 dark:bg-black/30 border border-transparent focus:border-brand-blue/30 rounded-xl py-3 pl-11 pr-4 text-base leading-[1.25] focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder-gray-500" />
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

      // Si no hay coverUrl (porque será automático luego), ponemos placeholder bonito
      const coverNode = `
        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-black">
          <div class="w-14 h-14 rounded-2xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-slate-700 flex items-center justify-center mb-3">
            <i class="fa-solid fa-file-pdf text-red-500 text-2xl"></i>
          </div>
          <div class="text-xs font-extrabold text-slate-700 dark:text-slate-200 px-6 text-center line-clamp-2">
            ${escapeHTML(title)}
          </div>
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

              <a href="${escapeHTML(item.fileUrl)}" target="_blank" rel="noopener noreferrer"
                class="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 flex items-center justify-center transition"
                title="Descargar / Ver">
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

      if (search) search.addEventListener('input', (e) => this.setFilter(e.target.value));
      if (sort) sort.addEventListener('change', (e) => this.setSort(e.target.value));
      if (reload) reload.addEventListener('click', () => this.load());

      if (!this._escBound) {
        this._escBound = true;
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            // no modal ahora, solo por compatibilidad
          }
        });
      }
    },

    onLoad() {
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
