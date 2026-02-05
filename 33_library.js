// 33_library.js — Biblioteca Premium (Auto-Covers + Lector)
(function () {
  'use strict';
  if (!window.NCLEX) return;

  const CATALOG_URL = '/library/catalog.json';

  const LibraryUI = {
    items: [],
    loading: false,

    async init() {
      this.loading = true;
      this.render();
      try {
        const res = await fetch(CATALOG_URL + '?t=' + Date.now());
        if (res.ok) {
           this.items = await res.json();
           this.items.sort((a,b) => a.title.es.localeCompare(b.title.es));
        }
      } catch (e) { console.warn(e); } 
      finally {
        this.loading = false;
        this.render();
      }
    },

    getCoverArt(title) {
      const gradients = ['from-blue-500 to-cyan-400', 'from-emerald-500 to-teal-400', 'from-rose-500 to-pink-400', 'from-indigo-500 to-purple-400'];
      const grad = gradients[title.length % gradients.length];
      return `<div class="w-full h-full bg-gradient-to-br ${grad} flex flex-col justify-between p-4 relative overflow-hidden shadow-inner"><i class="fa-solid fa-book-medical absolute -bottom-4 -right-4 text-6xl text-white/10 rotate-12"></i><div class="font-serif font-bold text-white text-lg leading-tight line-clamp-4 drop-shadow-md z-10">${title}</div></div>`;
    },

    openReader(item) {
      if (!item.fileUrl) return;
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(item.fileUrl)}&embedded=true`;
      const modal = document.createElement('div');
      modal.className = "fixed inset-0 z-[60] bg-black/95 backdrop-blur animate-fade-in flex flex-col";
      modal.innerHTML = `<div class="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10"><span class="text-white font-bold truncate">${item.title.es}</span><button id="close-reader" class="px-3 py-1 bg-white/10 rounded text-white text-sm">Cerrar</button></div><iframe src="${viewerUrl}" class="flex-1 w-full border-0"></iframe>`;
      document.body.appendChild(modal);
      document.getElementById('close-reader').onclick = () => modal.remove();
    },

    getShell() {
      return `<div class="animate-fade-in pb-20"><div class="flex items-center justify-between mb-8"><div><h1 class="text-3xl font-black text-slate-900 dark:text-white">Biblioteca</h1></div><button onclick="window.NCLEX_LIBRARY.init()" class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-brand-blue hover:text-white flex items-center justify-center"><i class="fa-solid fa-rotate"></i></button></div>${this.loading ? '<div class="text-center">Cargando...</div>' : this.getGrid()}</div>`;
    },

    getGrid() {
      if (!this.items.length) return `<div class="text-center py-10 text-gray-400">Sin libros disponibles.</div>`;
      return `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">${this.items.map(item => {
        const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');
        return `<div class="group cursor-pointer" onclick="window.NCLEX_LIBRARY.openReader(${itemJson})"><div class="aspect-[2/3] w-full rounded-r-lg overflow-hidden shadow-md group-hover:-translate-y-2 transition-all bg-white">${this.getCoverArt(item.title.es)}</div><div class="mt-2 font-bold text-sm text-slate-800 dark:text-gray-200 line-clamp-2">${item.title.es}</div></div>`;
      }).join('')}</div>`;
    },

    render() {
      const view = document.getElementById('app-view');
      if (view) view.innerHTML = this.getShell();
    }
  };

  window.NCLEX_LIBRARY = LibraryUI;
  NCLEX.registerTopic({ id: 'library', title: { es: 'Biblioteca', en: 'Library' }, icon: 'book-open', color: 'slate', render: () => LibraryUI.getShell(), onLoad: () => LibraryUI.init() });
})();
