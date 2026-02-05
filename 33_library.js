// 33_library.js — NCLEX Library Ultimate Edition
// 💎 Tecnología: Hybrid Fetch (Static + API Fallback)
// 🎨 Diseño: Glassmorphism + 3D Tilt + Apple Style Gradients
// 🚀 Features: Instant Search, Embedded Reader, Smart Error Recovery

(function () {
  'use strict';
  if (!window.NCLEX) return;

  // CONFIGURACIÓN
  const CONFIG = {
    repo: 'Nclexpass/NCLEX1.2',
    tag: 'BOOKS',
    staticCatalog: '/library/catalog.json',
    colors: [
      ['from-blue-600 to-indigo-600', 'text-blue-100', 'shadow-blue-500/20'],
      ['from-emerald-500 to-teal-600', 'text-emerald-100', 'shadow-emerald-500/20'],
      ['from-rose-500 to-pink-600', 'text-pink-100', 'shadow-pink-500/20'],
      ['from-violet-600 to-fuchsia-600', 'text-purple-100', 'shadow-purple-500/20'],
      ['from-amber-500 to-orange-600', 'text-orange-100', 'shadow-orange-500/20'],
      ['from-slate-700 to-slate-900', 'text-gray-300', 'shadow-gray-500/20'],
      ['from-cyan-500 to-blue-500', 'text-cyan-100', 'shadow-cyan-500/20']
    ]
  };

  const LibraryUI = {
    items: [],
    loading: true,
    filter: '',

    async init() {
      this.render();
      
      try {
        // ESTRATEGIA HÍBRIDA:
        // 1. Intentar cargar el catálogo estático (Velocidad extrema)
        // 2. Si falla o está vacío, llamar a la API de GitHub (Resiliencia)
        
        let data = [];
        let source = 'static';

        try {
          // Cache busting para asegurar frescura
          const res = await fetch(`${CONFIG.staticCatalog}?t=${Date.now()}`);
          if (res.ok) data = await res.json();
        } catch(e) { console.log('Static fetch failed, switching to API'); }

        if (!data || data.length === 0) {
          source = 'api';
          console.log('🔄 Fetching from GitHub API...');
          const apiUrl = `https://api.github.com/repos/${CONFIG.repo}/releases/tags/${CONFIG.tag}`;
          const apiRes = await fetch(apiUrl);
          if (!apiRes.ok) throw new Error('Cloud connection failed');
          const apiData = await apiRes.json();
          
          data = (apiData.assets || [])
            .filter(a => a.name.toLowerCase().endsWith('.pdf'))
            .map(a => ({
              id: String(a.id),
              title: a.name.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\.pdf$/i, ''),
              fileUrl: a.browser_download_url,
              size: (a.size / 1024 / 1024).toFixed(2) + ' MB'
            }));
        }

        this.items = data.sort((a,b) => a.title.localeCompare(b.title));
        console.log(`💎 Library Loaded: ${this.items.length} items (${source} source)`);

      } catch (e) {
        console.error(e);
        this.error = true;
      } finally {
        this.loading = false;
        this.render();
      }
    },

    // --- GENERADOR DE ARTE PROCEDURAL ---
    getArt(title) {
      // Algoritmo determinista: El mismo título siempre genera el mismo color
      let hash = 0;
      for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
      
      const theme = CONFIG.colors[Math.abs(hash) % CONFIG.colors.length];
      const [grad, text, shadow] = theme;

      return {
        html: `
          <div class="w-full h-full bg-gradient-to-br ${grad} p-5 relative flex flex-col justify-between overflow-hidden">
             <div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
             
             <i class="fa-solid fa-book-medical absolute -right-6 -bottom-8 text-[6rem] opacity-20 rotate-12 text-white blur-[1px]"></i>
             
             <div class="relative z-10 font-serif font-bold text-white text-lg leading-tight tracking-wide drop-shadow-lg line-clamp-4">
               ${title}
             </div>
             
             <div class="relative z-10 flex items-center gap-2 opacity-90">
               <div class="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white tracking-widest uppercase shadow-sm">
                 PREMIUM PDF
               </div>
             </div>
          </div>
        `,
        shadowClass: shadow
      };
    },

    // --- LECTOR INMERSIVO ---
    openReader(item) {
      if (!item.fileUrl) return;
      const url = `https://docs.google.com/viewer?url=${encodeURIComponent(item.fileUrl)}&embedded=true`;

      const modal = document.createElement('div');
      modal.className = "fixed inset-0 z-[100] flex flex-col animate-fade-in";
      modal.innerHTML = `
        <div class="absolute inset-0 bg-slate-900/95 backdrop-blur-md"></div>
        
        <div class="relative z-10 flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10 shadow-2xl backdrop-blur-xl">
           <div class="flex items-center gap-4 overflow-hidden">
             <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
               <i class="fa-solid fa-book-open text-white text-sm"></i>
             </div>
             <div class="flex flex-col">
               <span class="text-white font-bold truncate text-sm md:text-lg tracking-tight">${item.title}</span>
               <span class="text-white/50 text-[10px] uppercase tracking-widest font-bold">Lector Inmersivo v2.0</span>
             </div>
           </div>
           
           <button id="close-reader" class="group px-5 py-2 rounded-full bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 transition-all duration-300">
             <span class="text-xs font-bold text-white group-hover:text-red-400 uppercase tracking-widest">Cerrar</span>
           </button>
        </div>
        
        <div class="flex-1 relative z-10 w-full bg-transparent overflow-hidden">
           <div class="absolute inset-0 flex items-center justify-center flex-col gap-4 text-white/30">
              <div class="w-16 h-16 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
              <p class="text-xs uppercase tracking-[0.2em] font-bold animate-pulse">Cargando Documento...</p>
           </div>
           <iframe src="${url}" class="absolute inset-0 w-full h-full border-0 bg-transparent opacity-0 transition-opacity duration-700" onload="this.style.opacity=1" allowfullscreen></iframe>
        </div>
      `;
      
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
      
      const close = () => {
        modal.classList.add('opacity-0', 'scale-95'); // Efecto de salida
        setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 200);
      };
      
      document.getElementById('close-reader').onclick = close;
    },

    // --- RENDERIZADO VISUAL ---
    getShell() {
      return `
        <div class="animate-fade-in min-h-screen pb-24 px-4 md:px-8">
          
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 mt-6 gap-4">
            <div>
              <h1 class="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-gray-200 dark:to-gray-400 drop-shadow-sm">
                Biblioteca
              </h1>
              <p class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2 ml-1 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Colección Digital en la Nube
              </p>
            </div>
            
            <button onclick="window.NCLEX_LIBRARY.init()" class="group relative px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-rotate text-gray-400 group-hover:text-blue-500 group-hover:rotate-180 transition-all duration-500"></i>
                <span class="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-blue-500 uppercase tracking-wider">Actualizar</span>
              </div>
            </button>
          </div>

          <div class="relative max-w-md mb-12 group">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div class="relative bg-white dark:bg-gray-900 rounded-2xl ring-1 ring-gray-900/5 shadow-xl flex items-center px-4 py-3">
              <i class="fa-solid fa-search text-gray-400 mr-3"></i>
              <input type="text" placeholder="Buscar libro, autor o tema..." 
                class="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white placeholder-gray-400 font-medium"
                oninput="window.NCLEX_LIBRARY.filter = this.value; window.NCLEX_LIBRARY.renderGrid();">
            </div>
          </div>

          ${this.loading ? this.getSkeleton() : '<div id="lib-grid"></div>'}
        </div>
      `;
    },

    renderGrid() {
      const container = document.getElementById('lib-grid');
      if (!container) return;

      let filtered = this.items;
      if (this.filter) {
        const q = this.filter.toLowerCase();
        filtered = this.items.filter(i => i.title.toLowerCase().includes(q));
      }

      if (this.error) {
        container.innerHTML = `<div class="p-10 text-center rounded-3xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20"><i class="fa-solid fa-wifi text-4xl text-red-400 mb-4"></i><p class="font-bold text-red-500">Error de Conexión</p></div>`;
        return;
      }
      
      if (filtered.length === 0) {
        container.innerHTML = `<div class="text-center py-20 opacity-50"><i class="fa-solid fa-folder-open text-6xl mb-4"></i><p>No se encontraron libros</p></div>`;
        return;
      }

      container.innerHTML = `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 gap-y-12">
          ${filtered.map(item => {
            const art = this.getArt(item.title);
            const jsonItem = JSON.stringify(item).replace(/"/g, '&quot;');
            
            return `
            <div class="group relative perspective-1000 cursor-pointer" onclick="window.NCLEX_LIBRARY.openReader(${jsonItem})">
              <div class="relative w-full aspect-[2/3] rounded-r-xl rounded-l-md bg-white dark:bg-gray-800 
                          shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] 
                          group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] 
                          ${art.shadowClass} 
                          transform-gpu transition-all duration-500 ease-out 
                          group-hover:-translate-y-3 group-hover:rotate-y-6 group-hover:rotate-x-2">
                 
                 <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-black/20 z-20 rounded-l-md backdrop-blur-sm"></div>
                 <div class="absolute left-1.5 top-0 bottom-0 w-[1px] bg-white/30 z-20"></div>
                 
                 ${art.html}
                 
                 <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                 <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                   <div class="px-5 py-2 rounded-full bg-white/90 backdrop-blur text-slate-900 text-xs font-black uppercase tracking-widest shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                     Leer
                   </div>
                 </div>
              </div>

              <div class="mt-4 px-1 space-y-1 transition-opacity duration-300 group-hover:opacity-100">
                <h3 class="font-bold text-slate-800 dark:text-gray-100 text-sm leading-snug line-clamp-2 group-hover:text-blue-500 transition-colors">
                  ${item.title}
                </h3>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">PDF</span>
                  <span class="text-[10px] font-medium text-gray-400">${item.size || 'Cloud'}</span>
                </div>
              </div>
            </div>`;
          }).join('')}
        </div>
      `;
    },

    getSkeleton() {
      return `<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8">${[1,2,3,4,5].map(() => `
        <div class="animate-pulse">
           <div class="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-xl mb-4"></div>
           <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
           <div class="h-2 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
        </div>
      `).join('')}</div>`;
    },

    render() {
      const view = document.getElementById('app-view');
      if (view) {
        view.innerHTML = this.getShell();
        this.renderGrid();
      }
    }
  };

  // INICIALIZACIÓN GLOBAL
  window.NCLEX_LIBRARY = LibraryUI;
  NCLEX.registerTopic({ 
    id: 'library', 
    title: { es: 'Biblioteca', en: 'Library' }, 
    subtitle: { es: 'Colección Premium', en: 'Premium Collection' },
    icon: 'book-open', 
    color: 'slate', 
    render: () => { 
      // Render inicial y carga asíncrona
      setTimeout(() => LibraryUI.init(), 0); 
      return LibraryUI.getShell(); 
    }
  });
})();
