// 33_library.js — Biblioteca Premium (Estilo iPod/Apple Books)
// ✅ Lector Integrado (Modal Overlay)
// ✅ Grid Premium con sombras y efectos
// ✅ Manejo robusto de carátulas (reales o generadas)

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
        // Cache busting para ver siempre lo nuevo
        const res = await fetch(CATALOG_URL + '?t=' + Date.now());
        if (res.ok) {
           this.items = await res.json();
           // Ordenar por nombre por defecto
           this.items.sort((a,b) => a.title.es.localeCompare(b.title.es));
        }
      } catch (e) {
        console.error("Error catálogo", e);
      } finally {
        this.loading = false;
        this.render();
      }
    },

    // --- LECTOR INTEGRADO (Estilo Modal) ---
    openReader(item) {
      if (!item.fileUrl) return;

      // Usamos Google Viewer para embeber el PDF sin descargarlo
      // &embedded=true es la clave
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(item.fileUrl)}&embedded=true`;

      const modal = document.createElement('div');
      modal.className = "fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm animate-fade-in flex flex-col";
      modal.innerHTML = `
        <div class="flex items-center justify-between p-4 text-white bg-black/50">
           <div class="font-bold truncate max-w-md text-lg"><i class="fa-solid fa-book-open mr-2 text-brand-blue"></i> ${item.title.es}</div>
           <button id="close-reader" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
             <i class="fa-solid fa-xmark text-xl"></i>
           </button>
        </div>
        <div class="flex-1 w-full bg-white relative">
           <div class="absolute inset-0 flex items-center justify-center text-gray-400">
              <i class="fa-solid fa-spinner fa-spin text-4xl"></i>
           </div>
           <iframe src="${viewerUrl}" class="absolute inset-0 w-full h-full border-0 z-10" allowfullscreen></iframe>
        </div>
      `;
      
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo

      document.getElementById('close-reader').onclick = () => {
        modal.remove();
        document.body.style.overflow = '';
      };
    },

    // --- VISTAS ---
    getShell() {
      return `
        <div class="animate-fade-in pb-10">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Biblioteca</h1>
              <p class="text-gray-500 text-sm mt-1">Colección NCLEX Masterclass</p>
            </div>
            <button onclick="window.NCLEX_LIBRARY.init()" class="p-2 text-brand-blue hover:bg-blue-50 rounded-lg transition"><i class="fa-solid fa-rotate"></i></button>
          </div>

          ${this.loading ? this.getSkeleton() : this.getGrid()}
        </div>
      `;
    },

    getGrid() {
      if (this.items.length === 0) {
        return `<div class="p-10 text-center text-gray-400 italic">No hay libros disponibles en el catálogo.</div>`;
      }

      return `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
          ${this.items.map(item => this.getItemCard(item)).join('')}
        </div>
      `;
    },

    getItemCard(item) {
      // Si tiene carátula, úsala. Si no, genera un gradiente elegante.
      const hasCover = item.coverUrl && item.coverUrl.length > 5;
      
      const coverHTML = hasCover 
        ? `<img src="${item.coverUrl}" class="w-full h-full object-cover shadow-inner" loading="lazy">`
        : `<div class="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
             <i class="fa-solid fa-book-medical text-3xl text-white/20 mb-2"></i>
             <span class="text-white/80 font-serif font-bold text-xs leading-tight line-clamp-3">${item.title.es}</span>
           </div>`;

      // JSON stringify seguro para el onclick
      const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');

      return `
        <div class="group relative flex flex-col gap-3 cursor-pointer" onclick="window.NCLEX_LIBRARY.openReader(${itemJson})">
          <div class="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-[0_8px_20px_-5px_rgba(0,0,0,0.3)] group-hover:shadow-[0_12px_25px_-5px_rgba(0,0,0,0.4)] group-hover:-translate-y-1 transition-all duration-300 bg-gray-200 dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10">
             ${coverHTML}
             
             <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
               <div class="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                 <i class="fa-solid fa-book-open text-brand-blue"></i>
               </div>
             </div>
          </div>

          <div class="space-y-1">
            <h3 class="font-bold text-slate-900 dark:text-gray-100 text-sm leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
              ${item.title.es}
            </h3>
            <p class="text-xs text-gray-500 font-medium">${item.type.toUpperCase()}</p>
          </div>
        </div>
      `;
    },

    getSkeleton() {
      return `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          ${[1,2,3,4,5].map(() => `
            <div class="animate-pulse flex flex-col gap-3">
              <div class="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            </div>
          `).join('')}
        </div>
      `;
    },

    render() {
      const view = document.getElementById('app-view');
      if (view) view.innerHTML = this.getShell();
    }
  };

  // Exponer API global
  window.NCLEX_LIBRARY = LibraryUI;

  NCLEX.registerTopic({
    id: 'library',
    title: { es: 'Biblioteca', en: 'Library' },
    subtitle: { es: 'Colección Digital', en: 'Digital Collection' },
    icon: 'book-open',
    color: 'slate',
    render: () => LibraryUI.getShell(),
    onLoad: () => LibraryUI.init()
  });

})();
