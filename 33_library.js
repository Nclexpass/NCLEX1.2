// 33_library.js — Biblioteca Cliente Directo (Sin Scripts de Servidor)
// ✅ Conexión directa a la API de GitHub (Releases)
// ✅ Portadas automáticas de colores
// ✅ Lector Integrado

(function () {
  'use strict';
  if (!window.NCLEX) return;

  // CONFIGURACIÓN: Tu repositorio exacto
  const REPO = 'Nclexpass/NCLEX1.2'; 
  const TAG = 'BOOKS'; // Asegúrate de que tus Releases tengan este tag exacto
  const API_URL = `https://api.github.com/repos/${REPO}/releases/tags/${TAG}`;

  const LibraryUI = {
    items: [],
    loading: false,

    async init() {
      this.loading = true;
      this.render();
      
      try {
        console.log("📚 Consultando libros en:", API_URL);
        
        // 1. Petición directa a GitHub
        const res = await fetch(API_URL);
        
        if (!res.ok) {
           console.warn("Error GitHub:", res.status);
           if(res.status === 404) throw new Error("No existe el Release 'BOOKS' en GitHub.");
           throw new Error("No se pudo conectar con la biblioteca.");
        }

        const data = await res.json();
        
        // 2. Procesar los archivos PDF
        this.items = (data.assets || [])
          .filter(asset => asset.name.toLowerCase().endsWith('.pdf'))
          .map(asset => {
             // Limpiar nombre del archivo
             const cleanName = asset.name
               .replace(/_/g, ' ')
               .replace(/-/g, ' ')
               .replace(/\.pdf$/i, '');
               
             return {
               id: String(asset.id),
               title: cleanName,
               fileUrl: asset.browser_download_url,
               size: (asset.size / 1024 / 1024).toFixed(1) + ' MB'
             };
          });

        // Ordenar alfabéticamente
        this.items.sort((a,b) => a.title.localeCompare(b.title));
        console.log(`✅ ${this.items.length} libros cargados.`);

      } catch (e) {
        console.error(e);
        this.error = e.message;
      } finally {
        this.loading = false;
        this.render();
      }
    },

    // Generador de Portadas (Gradientes)
    getCover(title) {
      const colors = [
        ['from-blue-600 to-cyan-500', 'text-blue-200'],
        ['from-emerald-600 to-teal-500', 'text-emerald-200'],
        ['from-rose-600 to-pink-500', 'text-pink-200'],
        ['from-violet-600 to-purple-500', 'text-purple-200'],
        ['from-amber-500 to-orange-400', 'text-orange-100']
      ];
      const index = title.length % colors.length;
      const [bg, iconColor] = colors[index];

      return `
        <div class="w-full h-full bg-gradient-to-br ${bg} p-4 relative flex flex-col justify-between overflow-hidden shadow-inner">
           <i class="fa-solid fa-book-medical absolute -right-4 -bottom-4 text-[5rem] opacity-20 rotate-12 ${iconColor}"></i>
           <div class="relative z-10 font-serif font-bold text-white text-lg leading-tight drop-shadow-md line-clamp-4">${title}</div>
           <div class="relative z-10 flex items-center gap-1 opacity-80"><i class="fa-brands fa-github text-white text-xs"></i><span class="text-[9px] font-bold text-white tracking-widest uppercase">CLOUD</span></div>
        </div>
      `;
    },

    // Lector PDF Integrado
    openReader(item) {
      if (!item.fileUrl) return;
      // Usamos Google Viewer embebido
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(item.fileUrl)}&embedded=true`;

      const modal = document.createElement('div');
      modal.className = "fixed inset-0 z-[100] bg-black/95 backdrop-blur-md animate-fade-in flex flex-col";
      modal.innerHTML = `
        <div class="flex items-center justify-between px-4 py-3 bg-white/10 border-b border-white/10 shadow-lg">
           <div class="flex items-center gap-3 overflow-hidden">
             <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0"><i class="fa-solid fa-book-open text-white text-sm"></i></div>
             <span class="text-white font-bold truncate text-sm md:text-base">${item.title}</span>
           </div>
           <button id="close-reader-btn" class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-xs font-bold transition uppercase tracking-wide">Cerrar</button>
        </div>
        <div class="flex-1 w-full bg-gray-900 relative">
           <div class="absolute inset-0 flex items-center justify-center text-gray-500 flex-col gap-2">
              <i class="fa-solid fa-circle-notch fa-spin text-3xl"></i>
              <p class="text-xs uppercase tracking-widest">Cargando PDF...</p>
           </div>
           <iframe src="${viewerUrl}" class="absolute inset-0 w-full h-full border-0 z-10 bg-transparent" allowfullscreen></iframe>
        </div>
      `;
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden'; 
      document.getElementById('close-reader-btn').onclick = () => { modal.remove(); document.body.style.overflow = ''; };
    },

    getShell() {
      return `
        <div class="animate-fade-in pb-24 px-2">
          <div class="flex items-center justify-between mb-8 mt-2">
            <div><h1 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Biblioteca</h1><p class="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">Colección Digital</p></div>
            <button onclick="window.NCLEX_LIBRARY.init()" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-brand-blue hover:text-white transition flex items-center justify-center text-gray-500"><i class="fa-solid fa-rotate"></i></button>
          </div>
          ${this.loading ? this.getSkeleton() : this.getGrid()}
        </div>
      `;
    },

    getGrid() {
      if (this.error) {
         return `<div class="p-10 text-center text-red-400 border border-red-200 rounded-xl"><i class="fa-solid fa-triangle-exclamation mb-2 text-2xl"></i><p>${this.error}</p><p class="text-xs mt-2 text-gray-400">Verifica que el Release 'BOOKS' exista en GitHub.</p></div>`;
      }
      if (!this.items || this.items.length === 0) return `<div class="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl"><i class="fa-solid fa-cloud-arrow-down text-5xl mb-4 text-gray-300"></i><p class="font-medium">No se encontraron libros.</p></div>`;
      
      return `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">${this.items.map(item => {
        const jsonItem = JSON.stringify(item).replace(/"/g, '&quot;');
        return `<div class="group relative flex flex-col gap-3 cursor-pointer select-none perspective-1000" onclick="window.NCLEX_LIBRARY.openReader(${jsonItem})">
          <div class="relative aspect-[2/3] w-full rounded-r-md rounded-l-sm bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden transform-gpu">
             <div class="absolute left-0 top-0 bottom-0 w-1 bg-black/10 z-20"></div><div class="absolute left-1 top-0 bottom-0 w-[1px] bg-white/20 z-20"></div>
             ${this.getCover(item.title)}
             <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-30"><div class="w-12 h-12 rounded-full bg-white text-brand-blue flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300"><i class="fa-solid fa-book-open text-lg"></i></div></div>
          </div>
          <div class="space-y-0.5 px-1"><h3 class="font-bold text-slate-800 dark:text-gray-100 text-xs md:text-sm leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">${item.title}</h3><p class="text-[10px] text-gray-400 font-bold tracking-wide uppercase">${item.size}</p></div>
        </div>`;
      }).join('')}</div>`;
    },

    getSkeleton() {
      return `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">${[1,2,3,4].map(() => `<div class="animate-pulse flex flex-col gap-3"><div class="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-md"></div><div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div></div>`).join('')}</div>`;
    },

    render() {
      const view = document.getElementById('app-view');
      if (view) view.innerHTML = this.getShell();
    }
  };

  // Cargar automáticamente
  window.NCLEX_LIBRARY = LibraryUI;
  NCLEX.registerTopic({ id: 'library', title: { es: 'Biblioteca', en: 'Library' }, icon: 'book-open', color: 'slate', render: () => LibraryUI.getShell(), onLoad: () => LibraryUI.init() });
})();
