// 33_library.js — Biblioteca (descarga simple + carátula automática placeholder)
// ✅ Lee /library/catalog.json generado manualmente o por script
// ✅ Evita CORS del visor: Usa Google Viewer para evitar descarga forzada
// ✅ Carátulas: si coverUrl está vacío o falla, usa placeholder bonito con título

(function () {
  'use strict';

  if (!window.NCLEX) return;

  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  const CATALOG_URL = window.NCLEX_LIBRARY_CATALOG_URL || '/library/catalog.json';

  // -------- helpers
  const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

  const isAbsoluteUrl = (u) => /^https?:\/\//i.test(String(u || ''));

  const resolveUrl = (maybeRelative) => {
    if (!maybeRelative) return '';
    let raw = String(maybeRelative);
    // Asegura que empiece con / si es relativa
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

  // -------- UI / state
  const LibraryCloud = {
    _itemsRaw: [],
    _items: [],
    _filter: '',
    _sort: 'recent',
    _loading: false,
    _error: '',
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
        // Cache busting para asegurar que lea el json nuevo
        const res = await fetch(CATALOG_URL + '?t=' + Date.now(), { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        let list = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data?.items)) list = data.items;
        else if (data && typeof data === 'object') list = [data];

        this._itemsRaw = list.map((x) => {
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

    // --- VISOR DE GOOGLE ---
    openInNewTab(item) {
      if (!item?.fileUrl) return;

      // Si es un PDF alojado en GitHub, usamos el visor de Google
      if (item.fileUrl.includes('github.com') && item.fileUrl.toLowerCase().endsWith('.pdf')) {
          const viewerUrl = `https://docs.google.com/viewer?embedded=false&url=${encodeURIComponent(item.fileUrl)}`;
          window.open(viewerUrl, '_blank', 'noopener,noreferrer');
      } else {
          window.open(item.fileUrl, '_blank', 'noopener,noreferrer');
      }
    },

    // Descargar directo
    download(item) {
      if (!item?.fileUrl) return;
      const a = document.createElement('a');
      a.href = item.fileUrl;
      a.rel = 'noopener noreferrer';
      a.download = '';
      document.body.appendChild(a);
      a.click();
      a.remove();
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
                <a href="${escapeHTML(resolveUrl(CATALOG_URL))}" target="_blank" rel="noopener noreferrer"
                  class="px-4 py-2 rounded-xl bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:shadow-md transition backdrop-blur">
                  <i class="fa-solid fa-code mr-2 text-brand-blue"></i>${t('Ver JSON', 'View JSON')}
                </a>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                <input id="library-search" type="text"
                  placeholder="Buscar..."
                  class="w-full bg-gray-100 dark:bg-black/30 border border-transparent focus:border-brand-blue/30 rounded-xl py-3 pl-11 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder-gray-500" />
              </div>

              <div class="flex items-center gap-2">
                <select id="library-sort"
                  class="flex-1 bg-gray-100 dark:bg-black/30 border border-transparent focus:border-brand-blue/30 rounded-xl py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all">
                  <option value="recent">Más recientes</option>
                  <option value="title">Título A-Z</option>
                  <option value="author">Autor A-Z</option>
                </select>
              </div>

              <div id="library-stats" class="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between">
                 <span class="text-xs text-gray-500">Estado</span>
                 <span class="font-bold text-brand-blue">Activo</span>
              </div>
            </div>
          </header>

          <section class="rounded-3xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900/40">
            <div class="relative p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-black">
              <div class="flex items-center justify-between mb-4 relative z-10">
                <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">${t('Colección', 'Collection')}</h2>
                <button id="library-reload"
                  class="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold shadow-sm hover:opacity-90 transition">
                  <i class="fa-solid fa-rotate mr-2"></i>${t('Recargar', 'Reload')}
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
      return `${Array.from({ length: 4 }).map(() => `
        <div class="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-white/5 overflow-hidden shadow-sm max-w-[260px] w-full h-[320px] animate-pulse"></div>
      `).join('')}`;
    },

    emptyHTML() {
      return `
        <div class="col-span-full p-10 text-center text-gray-500 dark:text-gray-400">
          <i class="fa-solid fa-books text-4xl mb-4 text-gray-300"></i>
          <p class="font-bold">${t('La biblioteca está vacía.', 'Library is empty.')}</p>
          <p class="text-xs mt-2 opacity-70">Asegúrate de que 'library/catalog.json' tenga datos.</p>
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
          <p class="text-xs mt-2 font-mono text-gray-500 max-w-xl mx-auto bg-gray-100 dark:bg-black/50 p-2 rounded">${this._error}</p>
          <button id="library-retry" class="mt-6 px-5 py-3 rounded-2xl bg-brand-blue text-white font-bold hover:opacity-90 transition">
            <i class="fa-solid fa-rotate mr-2"></i>${t('Reintentar', 'Retry')}
          </button>
        </div>
      `;
    },

    coverPlaceholderHTML(title, icon) {
      return `
        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-black">
          <div class="w-14 h-14 rounded-2xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-slate-700 flex items-center justify-center mb-3">
            <i class="fa-solid ${icon.color} fa-${icon.fa} text-2xl"></i>
          </div>
          <div class="text-xs font-extrabold text-slate-700 dark:text-slate-200 px-6 text-center line-clamp-2">
            ${escapeHTML(title)}
          </div>
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
        ? `<img src="${escapeHTML(cover)}" alt="${escapeHTML(title)}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" onerror="this.outerHTML=${JSON.stringify(this.coverPlaceholderHTML(title, icon))}" />`
        : this.coverPlaceholderHTML(title, icon);

      return `
        <div class="group rounded-3xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-0.5 max-w-[260px] w-full">
          <div class="aspect-[3/4] relative overflow-hidden">
            ${coverNode}
            <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/25 to-transparent">
               <span class="text-xs px-2 py-1 rounded-full bg-white/15 text-white font-extrabold backdrop-blur border border-white/15">${prettyType(item.type, item)}</span>
            </div>
          </div>
          <div class="p-4">
            <div class="font-extrabold text-slate-900 dark:text-white truncate" title="${escapeHTML(title)}">${escapeHTML(title)}</div>
            <div class="mt-4 flex items-center gap-2">
              <button data-download="${escapeHTML(item.id)}" class="flex-1 px-3 py-2 rounded-2xl bg-brand-blue text-white font-extrabold hover:opacity-90 transition"><i class="fa-solid fa-download mr-2"></i>Descargar</button>
              <button data-open="${escapeHTML(item.id)}" class="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-700 dark:text-gray-200 flex items-center justify-center transition"><i class="fa-solid fa-arrow-up-right-from-square"></i></button>
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
      if (this._loading) { el.innerHTML = 'Cargando...'; return; }
      const total = this._itemsRaw.length;
      el.innerHTML = `<span class="text-sm font-bold text-gray-500">Total:</span> <span class="font-extrabold text-brand-blue ml-2">${total}</span>`;
    },

    renderGrid() {
      const grid = document.getElementById('library-grid');
      if (!grid) return;
      if (this._loading) { grid.innerHTML = this.skeletonCardsHTML(); return; }
      if (this._error) { grid.innerHTML = this.errorHTML(); this.bindRetry(); return; }
      if (!this._items.length) { grid.innerHTML = this.emptyHTML(); return; }
      
      grid.innerHTML = this._items.map(it => this.cardHTML(it)).join('');
      
      grid.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => {
        const item = this._itemsRaw.find(x => x.id === btn.getAttribute('data-open'));
        if (item) this.openInNewTab(item);
      }));
      
      grid.querySelectorAll('[data-download]').forEach(btn => btn.addEventListener('click', () => {
        const item = this._itemsRaw.find(x => x.id === btn.getAttribute('data-download'));
        if (item) this.download(item);
      }));
    },

    bindRetry() {
        const btn = document.getElementById('library-retry');
        if(btn) btn.onclick = () => this.load();
    },

    bindShellEvents() {
      const search = document.getElementById('library-search');
      const sort = document.getElementById('library-sort');
      const reload = document.getElementById('library-reload');
      if (search) search.addEventListener('input', (e) => this.setFilter(e.target.value));
      if (sort) sort.addEventListener('change', (e) => this.setSort(e.target.value));
      if (reload) reload.addEventListener('click', () => this.load());
    },

    onLoad() { this.load(); }
  };

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
