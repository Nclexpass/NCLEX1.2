// 33_library.js — NCLEX Library Ultimate (Vision Pro Style)
// 💎 Efectos: 3D Tilt Real + Glassmorphism + Sombras Dinámicas
// 🚀 Motor: Conexión Directa a GitHub API (Sin intermediarios)
// 🎨 Arte: Generación Procedural de Portadas Premium

(function () {
  'use strict';
  
  // Esperar a que el sistema base cargue
  if (!window.NCLEX) {
    // Si NCLEX no está listo, esperamos un poco o registramos el evento
    setTimeout(initLibrary, 1000); 
    return;
  } else {
    initLibrary();
  }

  function initLibrary() {
    // --- CONFIGURACIÓN ---
    const CONFIG = {
      repo: 'Nclexpass/NCLEX1.2', 
      tag: 'BOOKS', // El TAG exacto de tus releases
      colors: [
        ['from-indigo-500 via-purple-500 to-pink-500', 'text-indigo-100', 'shadow-indigo-500/50'],
        ['from-emerald-400 via-teal-500 to-cyan-600', 'text-teal-100', 'shadow-teal-500/50'],
        ['from-orange-400 via-red-500 to-rose-600', 'text-orange-100', 'shadow-orange-500/50'],
        ['from-blue-400 via-blue-600 to-indigo-800', 'text-blue-100', 'shadow-blue-500/50'],
        ['from-slate-600 via-slate-700 to-slate-900', 'text-gray-300', 'shadow-gray-500/50']
      ]
    };

    const LibraryUI = {
      items: [],
      loading: true,
      error: false,

      async init() {
        this.render(); // Renderiza el esqueleto de carga
        
        try {
          console.log(`💎 Iniciando Biblioteca Premium...`);
          // URL directa a la API de GitHub
          const apiUrl = `https://api.github.com/repos/${CONFIG.repo}/releases/tags/${CONFIG.tag}`;
          
          const res = await fetch(apiUrl);
          if (!res.ok) {
             if(res.status === 404) throw new Error("No se encontró el Release 'BOOKS'.");
             throw new Error(`Error de conexión GitHub: ${res.status}`);
          }

          const data = await res.json();
          
          // Transformar datos crudos en Objetos Premium
          this.items = (data.assets || [])
            .filter(a => a.name.toLowerCase().endsWith('.pdf'))
            .map(a => ({
              id: String(a.id),
              title: a.name.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\.pdf$/i, ''),
              url: a.browser_download_url,
              size: (a.size / 1024 / 1024).toFixed(1) + ' MB',
              date: new Date(a.created_at).toLocaleDateString()
            }));

          // Ordenar alfabéticamente
          this.items.sort((a,b) => a.title.localeCompare(b.title));
          console.log(`✅ ${this.items.length} libros cargados.`);

        } catch (e) {
          console.error("Error crítico:", e);
          this.error = e.message;
        } finally {
          this.loading = false;
          this.render();
        }
      },

      // --- GENERADOR DE PORTADAS 3D ---
      getCover(title, index) {
        // Elegir paleta de colores basada en el título
        let hash = 0;
        for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
        const theme = CONFIG.colors[Math.abs(hash) % CONFIG.colors.length];
        const [grad, text, shadow] = theme;

        return `
          <div class="absolute inset-0 bg-gradient-to-br ${grad} p-6 flex flex-col justify-between overflow-hidden">
             <div class="absolute inset-0 opacity-20" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+');"></div>
             
             <i class="fa-solid fa-book-medical absolute -right-8 -bottom-8 text-[8rem] text-white opacity-10 rotate-12 blur-[2px]"></i>
             
             <div class="relative z-10">
               <div class="w-8 h-1 bg-white/50 mb-4 rounded-full backdrop-blur-md"></div>
               <h3 class="font-serif font-black text-white text-xl md:text-2xl leading-tight tracking-wide drop-shadow-lg line-clamp-4">
                 ${title}
               </h3>
             </div>
             
             <div class="relative z-10 flex items-center justify-between border-t border-white/20 pt-3 mt-2">
               <div class="flex items-center gap-1.5 opacity-90">
                  <i class="fa-brands fa-apple text-white text-sm"></i>
                  <span class="text-[9px] font-bold text-white tracking-[0.2em] uppercase">iBOOKS</span>
               </div>
               <div class="px-2 py-0.5 bg-black/20 rounded text-[9px] font-bold text-white backdrop-blur">PDF</div>
             </div>
          </div>
        `;
      },

      // --- LECTOR INMERSIVO (MODAL) ---
      openReader(item) {
        if (!item.url) return;
        const viewer = `https://docs.google.com/viewer?url=${encodeURIComponent(item.url)}&embedded=true`;

        const modal = document.createElement('div');
        modal.className = "fixed inset-0 z-[100] flex flex-col animate-fade-in";
        modal.innerHTML = `
          <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-xl"></div>
          
          <div class="relative z-10 flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10 shadow-2xl">
             <div class="flex items-center gap-4">
               <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                 <i class="fa-solid fa-book-open text-white"></i>
               </div>
               <div>
                 <h2 class="text-white font-bold text-sm md:text-base max-w-xs md:max-w-md truncate">${item.title}</h2>
                 <p class="text-white/40 text-[10px] uppercase tracking-widest font-bold">Modo Lectura</p>
               </div>
             </div>
             <button id="close-modal" class="group px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
               <span class="text-xs font-bold text-white group-hover:text-red-300 uppercase tracking-widest transition-colors">Cerrar</span>
             </button>
          </div>

          <div class="relative z-10 flex-1 w-full bg-transparent overflow-hidden">
             <div class="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-4">
               <div class="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
               <span class="text-xs font-bold tracking-[0.3em] animate-pulse">CARGANDO...</span>
             </div>
             <iframe src="${viewer}" class="absolute inset-0 w-full h-full border-0 opacity-0 transition-opacity duration-700" onload="this.style.opacity=1" allowfullscreen></iframe>
          </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        const close = () => {
          modal.classList.add('opacity-0', 'scale-95'); // Animación salida
          setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 300);
        };
        
        document.getElementById('close-modal').onclick = close;
      },

      // --- SHELL PRINCIPAL ---
      getShell() {
        return `
          <div class="animate-fade-in pb-24 px-4 md:px-8 min-h-screen">
            
            <div class="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 mt-8 gap-6">
              <div>
                <h1 class="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-600 to-slate-900 dark:from-white dark:via-slate-300 dark:to-slate-500 drop-shadow-sm">
                  Biblioteca
                </h1>
                <div class="flex items-center gap-3 mt-3">
                  <span class="relative flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <p class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-[0.25em]">
                    Colección Cloud • En Vivo
                  </p>
                </div>
              </div>
              
              <button onclick="window.NCLEX_LIBRARY.init()" class="group relative px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300">
                <div class="flex items-center gap-3">
                  <i class="fa-solid fa-rotate text-gray-400 group-hover:text-blue-500 group-hover:rotate-180 transition-all duration-700"></i>
                  <span class="text-xs font-bold text-gray-500 dark:text-gray-300 group-hover:text-blue-500 uppercase tracking-widest">Recargar</span>
                </div>
              </button>
            </div>

            ${this.loading ? this.getSkeleton() : this.getGrid()}
          </div>
        `;
      },

      getGrid() {
        if (this.error) return `
          <div class="p-10 rounded-3xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 text-center">
            <i class="fa-solid fa-triangle-exclamation text-4xl text-red-400 mb-4"></i>
            <h3 class="text-lg font-bold text-red-600 dark:text-red-300">Error de Conexión</h3>
            <p class="text-sm text-red-500/70 mt-2">${this.error}</p>
            <p class="text-xs mt-4 text-gray-400">Verifica que el Release 'BOOKS' exista en GitHub.</p>
          </div>`;

        if (!this.items.length) return `
          <div class="py-20 text-center opacity-50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">
            <i class="fa-solid fa-cloud-arrow-down text-6xl mb-4 text-gray-400"></i>
            <p class="font-bold text-gray-500">No hay libros disponibles</p>
          </div>`;
        
        return `
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 gap-y-12">
            ${this.items.map((item, idx) => {
               const jsonItem = JSON.stringify(item).replace(/"/g, '&quot;');
               return `
               <div class="group relative perspective-1000 cursor-pointer" onclick="window.NCLEX_LIBRARY.openReader(${jsonItem})">
                 <div class="relative w-full aspect-[2/3] bg-gray-900 rounded-r-xl rounded-l-md shadow-2xl 
                             transform-gpu transition-all duration-500 ease-out
                             group-hover:-translate-y-4 group-hover:rotate-y-[-10deg] group-hover:rotate-x-[5deg] group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                    
                    <div class="absolute top-0 bottom-0 -left-2 w-4 bg-gray-800 transform -skew-y-6 origin-right opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div class="absolute inset-0 rounded-r-xl rounded-l-md overflow-hidden z-10 bg-gray-800">
                      ${this.getCover(item.title, idx)}
                    </div>
                    
                    <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 pointer-events-none z-20 transition-opacity duration-500"></div>

                    <div class="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] bg-black/20">
                      <div class="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                        <i class="fa-solid fa-book-open text-xl"></i>
                      </div>
                    </div>
                 </div>

                 <div class="mt-5 px-2 space-y-1 transition-transform duration-300 group-hover:translate-y-1">
                   <h3 class="text-sm font-bold text-slate-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-blue-500 transition-colors">${item.title}</h3>
                   <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">${item.size}</p>
                 </div>
               </div>`;
            }).join('')}
          </div>
        `;
      },

      getSkeleton() {
        return `
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            ${[1,2,3,4].map(() => `
              <div class="animate-pulse">
                 <div class="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-xl mb-4"></div>
                 <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                 <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
              </div>
            `).join('')}
          </div>`;
      },

      render() {
        const view = document.getElementById('app-view');
        if (view) {
          view.innerHTML = this.getShell();
          // Si ya cargó y no hay items, intenta iniciar de nuevo
          if(!this.loading && !this.items.length && !this.error) this.init();
        }
      }
    };

    // INICIALIZACIÓN GLOBAL
    window.NCLEX_LIBRARY = LibraryUI;
    if (window.NCLEX && window.NCLEX.registerTopic) {
      window.NCLEX.registerTopic({ 
        id: 'library', 
        title: { es: 'Biblioteca', en: 'Library' }, 
        subtitle: { es: 'Colección Premium', en: 'Premium Collection' },
        icon: 'book-open', 
        color: 'slate', 
        render: () => { 
          setTimeout(() => LibraryUI.init(), 10); 
          return LibraryUI.getShell(); 
        }
      });
    }
  }
})();
