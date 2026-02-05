// 33_library.js — Biblioteca Premium (Auto-Covers + Lector)
// ✅ Genera portadas CSS automáticamente (Estilo Apple Books)
// ✅ Lector de PDF integrado (sin descargar)

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
        // Truco ?t=... para evitar caché antigua
        const res = await fetch(CATALOG_URL + '?t=' + Date.now());
        if (res.ok) {
           this.items = await res.json();
           // Ordenar alfabéticamente
           this.items.sort((a,b) => a.title.es.localeCompare(b.title.es));
        }
      } catch (e) {
        console.warn("Catálogo no disponible aún", e);
      } finally {
        this.loading = false;
        this.render();
      }
    },

    // --- GENERADOR DE PORTADAS AUTOMÁTICO ---
    getCoverArt(title) {
      // Paletas de colores estilo Apple (Gradientes)
      const gradients = [
        'from-blue-500 to-cyan-400',
        'from-emerald-500 to-teal-400',
        'from-orange-500 to-amber-400',
        'from-rose-500 to-pink-400',
        'from-indigo-500 to-purple-400',
        'from-slate-600 to-slate-800'
      ];
      
      const index = title.length % gradients.length;
      const grad = gradients[index];

      return `
        <div class="w-full h-full bg-gradient-to-br ${grad} flex flex-col justify-between p-4 relative overflow-hidden shadow-inner">
           <i class="fa-solid fa-book-medical absolute -bottom-4 -right-4 text-6xl text-white/10 rotate-12"></i>
           <div class="font-serif font-bold text-white text-lg leading-tight line-clamp-4 drop-shadow-md z-10">
             ${title}
           </div>
           <div class="text-[10px] uppercase tracking-widest text-white/60 font-medium z-10 mt-2">
             NCLEX Library
           </div>
        </div>
      `;
    },

    // --- LECTOR INTEGRADO ---
    openReader(item) {
      if (!item.fileUrl) return;

      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(item.fileUrl)}&embedded=true`;

      const modal = document.createElement('div');
      modal.className = "fixed inset-0 z-[60] bg-black/95 backdrop-blur animate-fade-in flex flex-col";
      modal.innerHTML = `
        <div class="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
           <div class="flex items-center gap-3">
             <div class="w-8 h-8 rounded bg-brand-blue flex items-center justify-center text-white">
               <i class="fa-solid fa-book-open text-sm"></i>
             </div>
             <span class="text-white font-bold truncate max-w-xs md:max-w-md">${item.title.es}</span>
           </div>
           <button id="close-reader" class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-bold transition">
             Cerrar / Close
           </button>
        </div>
        <div class="flex-1 w-full bg-gray-900 relative">
           <div class="absolute inset-0 flex items-center justify-center text-gray-500">
              <div class="text-center">
                 <i class="fa-solid fa-circle-notch fa-spin text-3xl mb-2"></i>
                 <p>Cargando documento...</p>
              </div>
           </div>
           <iframe src="${viewerUrl}" class="absolute inset-0 w-full h-full border-0 z-10" allowfullscreen></iframe>
        </div>
      `;
      
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden'; 

      document.getElementById('close-reader').onclick = () => {
        modal.remove();
        document.body.style.overflow = '';
      };
    },

    // --- RENDERIZADO ---
    getShell() {
      return `
        <div class="animate-fade-in pb-20">
          <div class="flex items-center justify-between mb-8 px-1">
            <div>
              <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                <i class="fa-solid fa-layer-group text-brand-blue mr-2"></i>Biblioteca
              </h1>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-1">Colección oficial de estudio</p>
            </div>
            <button onclick="window.NCLEX_LIBRARY.init()" class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-brand-blue hover:text-white transition flex items-center justify-center text-gray-500">
              <i class="fa-solid fa-rotate"></i>
            </button>
          </div>

          ${this.loading ? this.getSkeleton() : this.getGrid()}
        </div>
      `;
    },

    getGrid() {
      if (this.items.length === 0) {
        return `
          <div class="flex flex-col items-center justify-center py-20 text-gray-400">
            <i class="fa-solid fa-book-bookmark text-5xl mb-4 text-gray-200 dark:text-gray-700"></i>
            <p>Conectando con la nube...</p>
            <p class="text-xs mt-2">Si es la primera vez, espera unos minutos.</p>
          </div>`;
      }

      return `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
          ${this.items.map(item => this.getItemCard(item)).join('')}
        </div>
      `;
    },

    getItemCard(item) {
      const coverArt = this.getCoverArt(item.title.es);
      const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');

      return `
        <div class="group relative flex flex-col gap-3 cursor-pointer select-none" onclick="window.NCLEX_LIBRARY.openReader(${itemJson})">
          <div class="relative aspect-[2/3] w-full rounded-r-lg rounded-l-sm overflow-hidden shadow-[5px_5px_15px_-5px_rgba(0,0,0,0.3)] group-hover:shadow-[8px_8px_25px_-5px_rgba(0,0,0,0.4)] group-hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-gray-800 transform preserve-3d">
             <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-black/20 z-20"></div>
             <div class="absolute left-1.5 top-0 bottom-0 w-px bg-white/20 z-20"></div>
             ${coverArt}
             <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] z-30">
               <span class="bg-white text-black px-4 py-2 rounded-full font-bold text-xs transform scale-90 group-hover:scale-100 transition-transform">
                 <i class="fa-solid fa-book-open mr-1"></i> LEER
               </span>
             </div>
          </div>
          <div class="space-y-1 px-1">
            <h3 class="font-bold text-slate-800 dark:text-gray-200 text-sm leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
              ${item.title.es}
            </h3>
            <div class="flex items-center justify-between">
              <p class="text-[10px] text-gray-400 font-bold tracking-wide">PDF</p>
              <i class="fa-solid fa-circle-arrow-right text-gray-300 group-hover:text-brand-blue text-xs transition-colors"></i>
            </div>
          </div>
        </div>
      `;
    },

    getSkeleton() {
      return `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          ${[1,2,3,4].map(() => `<div class="animate-pulse flex flex-col gap-3"><div class="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-lg"></div><div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div></div>`).join('')}
        </div>
      `;
    },

    render() {
      const view = document.getElementById('app-view');
      if (view) view.innerHTML = this.getShell();
    }
  };

  window.NCLEX_LIBRARY = LibraryUI;

  NCLEX.registerTopic({
    id: 'library',
    title: { es: 'Biblioteca', en: 'Library' },
    subtitle: { es: 'Libros Digitales', en: 'Digital Books' },
    icon: 'book-open',
    color: 'slate',
    render: () => LibraryUI.getShell(),
    onLoad: () => LibraryUI.init()
  });

})();
