// 33_library.js — NCLEX Library Ultimate (Vision Pro Style) - MEJORADO
// 💎 Efectos: 3D Tilt Real + Glassmorphism + Sombras Dinámicas
// 🚀 Motor: Conexión Directa a GitHub API
// 🎨 Arte: Portadas Reales + Generación Procedural

(function () {
  'use strict';
  
  // Esperar a que el sistema base cargue
  if (!window.NCLEX) {
    setTimeout(initLibrary, 1000); 
    return;
  } else {
    initLibrary();
  }

  function initLibrary() {
    // --- CONFIGURACIÓN MEJORADA ---
    const CONFIG = {
      repo: 'Nclexpass/NCLEX1.2', 
      tag: 'BOOKS',
      // Mapeo de nombres de archivo a imágenes de portada (si existen)
      // Ejemplo: 'nombre-del-archivo.pdf': 'link-a-la-imagen.jpg'
      coverImages: {
        'nclex-book-1.pdf': 'https://raw.githubusercontent.com/Nclexpass/NCLEX1.2/main/covers/book1.jpg',
        'nclex-book-2.pdf': 'https://raw.githubusercontent.com/Nclexpass/NCLEX1.2/main/covers/book2.jpg',
      },
      defaultCoverColors: [
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
        this.render();
        
        try {
          console.log(`📚 Iniciando Biblioteca Premium Mejorada...`);
          const apiUrl = `https://api.github.com/repos/${CONFIG.repo}/releases/tags/${CONFIG.tag}`;
          
          const res = await fetch(apiUrl);
          if (!res.ok) {
             if(res.status === 404) throw new Error("No se encontró el Release 'BOOKS'.");
             throw new Error(`Error de conexión GitHub: ${res.status}`);
          }

          const data = await res.json();
          
          // Transformar datos con información adicional
          this.items = (data.assets || [])
            .filter(a => a.name.toLowerCase().endsWith('.pdf'))
            .map(a => ({
              id: String(a.id),
              title: this.formatTitle(a.name),
              filename: a.name,
              url: a.browser_download_url,
              download_count: a.download_count || 0,
              size: (a.size / 1024 / 1024).toFixed(1) + ' MB',
              date: new Date(a.created_at).toLocaleDateString(),
              hasCover: CONFIG.coverImages[a.name] !== undefined,
              coverUrl: CONFIG.coverImages[a.name] || null
            }));

          // Ordenar por popularidad (descargas) luego alfabéticamente
          this.items.sort((a,b) => {
            if (b.download_count !== a.download_count) {
              return b.download_count - a.download_count;
            }
            return a.title.localeCompare(b.title);
          });
          
          console.log(`✅ ${this.items.length} libros cargados.`);

        } catch (e) {
          console.error("Error crítico:", e);
          this.error = e.message;
        } finally {
          this.loading = false;
          this.render();
        }
      },

      // --- FUNCIONES AUXILIARES ---
      formatTitle(filename) {
        return filename
          .replace(/_/g, ' ')
          .replace(/-/g, ' ')
          .replace(/\.pdf$/i, '')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      },

      // --- SISTEMA DE PORTADAS MEJORADO ---
      getCover(item, index) {
        // Si tiene portada definida, usar imagen real
        if (item.coverUrl) {
          return `
            <div class="absolute inset-0 overflow-hidden rounded-r-xl rounded-l-md bg-gray-800">
              <img src="${item.coverUrl}" 
                   alt="${item.title}"
                   class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   onerror="this.style.display='none'; this.parentElement.innerHTML = window.NCLEX_LIBRARY.getGeneratedCover('${item.title}', ${index});">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div class="absolute top-4 left-4 z-10">
                <div class="w-8 h-1 bg-white/50 mb-3 rounded-full backdrop-blur-md"></div>
                <h3 class="font-serif font-black text-white text-lg md:text-xl leading-tight tracking-wide drop-shadow-lg line-clamp-3">
                  ${item.title}
                </h3>
              </div>
              
              <div class="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between border-t border-white/20 pt-3">
                <div class="flex items-center gap-1.5 opacity-90">
                  <i class="fa-solid fa-download text-white text-xs"></i>
                  <span class="text-[9px] font-bold text-white">${item.download_count}</span>
                </div>
                <div class="px-2 py-0.5 bg-black/40 rounded text-[9px] font-bold text-white backdrop-blur">PDF</div>
              </div>
            </div>
          `;
        }
        
        // Si no tiene portada, generar una procedural
        return this.getGeneratedCover(item.title, index);
      },

      getGeneratedCover(title, index) {
        let hash = 0;
        for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
        const theme = CONFIG.defaultCoverColors[Math.abs(hash) % CONFIG.defaultCoverColors.length];
        const [grad, text, shadow] = theme;

        return `
          <div class="absolute inset-0 bg-gradient-to-br ${grad} p-6 flex flex-col justify-between overflow-hidden rounded-r-xl rounded-l-md">
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
                  <i class="fa-solid fa-stethoscope text-white text-sm"></i>
                  <span class="text-[9px] font-bold text-white tracking-[0.2em] uppercase">NCLEX</span>
               </div>
               <div class="px-2 py-0.5 bg-black/20 rounded text-[9px] font-bold text-white backdrop-blur">PDF</div>
             </div>
          </div>
        `;
      },

      // --- FUNCIÓN DE DESCARGA MEJORADA ---
      downloadBook(item, event) {
        if (event) event.stopPropagation(); // Prevenir que se active el click del contenedor
        
        // Crear enlace de descarga invisible
        const link = document.createElement('a');
        link.href = item.url;
        link.download = item.filename;
        link.target = '_blank';
        
        // Animación de feedback
        const button = event?.currentTarget;
        if (button) {
          const originalHTML = button.innerHTML;
          button.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i>';
          button.disabled = true;
          
          setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
          }, 1500);
        }
        
        // Incrementar contador visual (simulado)
        const downloadCount = document.querySelector(`[data-book-id="${item.id}"] .download-count`);
        if (downloadCount) {
          const current = parseInt(downloadCount.textContent) || 0;
          downloadCount.textContent = current + 1;
        }
        
        // Disparar descarga
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Notificación de éxito
        this.showNotification(`📥 Descargando: ${item.title}`);
      },

      // --- LECTOR INMERSIVO CON OPCIÓN DE DESCARGA ---
      openReader(item) {
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
                 <p class="text-white/40 text-[10px] uppercase tracking-widest font-bold">Modo Lectura • ${item.size}</p>
               </div>
             </div>
             <div class="flex items-center gap-3">
               <button onclick="window.NCLEX_LIBRARY.downloadBook(${JSON.stringify(item).replace(/"/g, '&quot;')})" 
                       class="group px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition-all">
                 <span class="text-xs font-bold text-green-300 group-hover:text-green-200 uppercase tracking-widest transition-colors flex items-center gap-2">
                   <i class="fa-solid fa-download"></i> Descargar
                 </span>
               </button>
               <button id="close-modal" class="group px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                 <span class="text-xs font-bold text-white group-hover:text-red-300 uppercase tracking-widest transition-colors">Cerrar</span>
               </button>
             </div>
          </div>

          <div class="relative z-10 flex-1 w-full bg-transparent overflow-hidden">
             <div class="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-4">
               <div class="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
               <span class="text-xs font-bold tracking-[0.3em] animate-pulse">CARGANDO PDF...</span>
             </div>
             <iframe src="${viewer}" class="absolute inset-0 w-full h-full border-0 opacity-0 transition-opacity duration-700" onload="this.style.opacity=1" allowfullscreen></iframe>
          </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        const close = () => {
          modal.classList.add('opacity-0', 'scale-95');
          setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 300);
        };
        
        document.getElementById('close-modal').onclick = close;
      },

      // --- NOTIFICACIÓN ---
      showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-6 right-6 z-[101] px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-2xl animate-slide-in-right';
        notification.innerHTML = `
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-circle-check"></i>
            <span class="text-sm font-bold">${message}</span>
          </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.classList.add('opacity-0', 'translate-x-full');
          setTimeout(() => notification.remove(), 300);
        }, 3000);
      },

      // --- SHELL PRINCIPAL MEJORADO ---
      getShell() {
        return `
          <div class="animate-fade-in pb-24 px-4 md:px-8 min-h-screen">
            
            <div class="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 mt-8 gap-6">
              <div>
                <h1 class="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-sm">
                  Biblioteca NCLEX
                </h1>
                <div class="flex items-center gap-3 mt-3">
                  <span class="relative flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <p class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-[0.25em]">
                    ${this.items.length || '...'} Libros Disponibles • Descarga Directa
                  </p>
                </div>
              </div>
              
              <div class="flex gap-3">
                <button onclick="window.NCLEX_LIBRARY.showHelp()" 
                        class="group px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div class="flex items-center gap-3">
                    <i class="fa-solid fa-circle-info text-gray-400 group-hover:text-blue-400"></i>
                    <span class="text-xs font-bold text-gray-300 group-hover:text-white uppercase tracking-widest">Ayuda</span>
                  </div>
                </button>
                <button onclick="window.NCLEX_LIBRARY.init()" 
                        class="group px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 border border-blue-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div class="flex items-center gap-3">
                    <i class="fa-solid fa-rotate text-white group-hover:rotate-180 transition-all duration-700"></i>
                    <span class="text-xs font-bold text-white uppercase tracking-widest">Actualizar</span>
                  </div>
                </button>
              </div>
            </div>

            ${this.loading ? this.getSkeleton() : this.getGrid()}
          </div>
        `;
      },

      getGrid() {
        if (this.error) return `
          <div class="p-10 rounded-3xl bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-500/20 text-center backdrop-blur-sm">
            <i class="fa-solid fa-triangle-exclamation text-4xl text-red-400 mb-4"></i>
            <h3 class="text-lg font-bold text-red-300">Error de Conexión</h3>
            <p class="text-sm text-red-400/70 mt-2">${this.error}</p>
            <button onclick="window.NCLEX_LIBRARY.init()" class="mt-6 px-6 py-2 rounded-full bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors">
              <span class="text-sm font-bold text-red-300">Reintentar</span>
            </button>
          </div>`;

        if (!this.items.length) return `
          <div class="py-20 text-center opacity-50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl backdrop-blur-sm">
            <i class="fa-solid fa-cloud-arrow-down text-6xl mb-4 text-gray-400"></i>
            <p class="font-bold text-gray-500 text-lg mb-2">No hay libros disponibles</p>
            <p class="text-sm text-gray-400">Verifica que existan archivos PDF en el Release 'BOOKS'</p>
          </div>`;
        
        return `
          <div class="mb-8 p-4 rounded-2xl bg-gradient-to-r from-blue-900/10 to-purple-900/10 border border-white/5 backdrop-blur-sm">
            <div class="flex items-center gap-3 text-sm text-gray-400">
              <i class="fa-solid fa-lightbulb text-yellow-400"></i>
              <p><span class="font-bold text-white">Click</span> en cualquier libro para leerlo online • 
                 <span class="font-bold text-white">Botón Descargar</span> para guardarlo en tu dispositivo</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 gap-y-12">
            ${this.items.map((item, idx) => {
               const jsonItem = JSON.stringify(item).replace(/"/g, '&quot;');
               return `
               <div class="group relative perspective-1000">
                 <div class="relative w-full aspect-[2/3] rounded-r-xl rounded-l-md shadow-2xl 
                             transform-gpu transition-all duration-500 ease-out
                             group-hover:-translate-y-4 group-hover:rotate-y-[-10deg] group-hover:rotate-x-[5deg] group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
                      onclick="window.NCLEX_LIBRARY.openReader(${jsonItem})">
                    
                    <div class="absolute top-0 bottom-0 -left-2 w-4 bg-gray-800 transform -skew-y-6 origin-right opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div class="absolute inset-0 rounded-r-xl rounded-l-md overflow-hidden z-10">
                      ${this.getCover(item, idx)}
                    </div>
                    
                    <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 pointer-events-none z-20 transition-opacity duration-500"></div>

                    <div class="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] bg-black/20">
                      <div class="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                        <i class="fa-solid fa-eye text-xl"></i>
                      </div>
                    </div>
                 </div>

                 <div class="mt-5 px-2 space-y-3 transition-transform duration-300 group-hover:translate-y-1">
                   <h3 class="text-sm font-bold text-slate-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">${item.title}</h3>
                   
                   <div class="flex items-center justify-between text-xs">
                     <div class="flex items-center gap-4">
                       <div class="flex items-center gap-1 text-gray-400" data-book-id="${item.id}">
                         <i class="fa-solid fa-download text-xs"></i>
                         <span class="download-count font-bold">${item.download_count}</span>
                       </div>
                       <span class="text-gray-400 font-bold">${item.size}</span>
                     </div>
                     
                     <button onclick="window.NCLEX_LIBRARY.downloadBook(${jsonItem}, event)"
                             class="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-white transition-all duration-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                       <i class="fa-solid fa-download text-[9px]"></i>
                       Descargar
                     </button>
                   </div>
                 </div>
               </div>`;
            }).join('')}
          </div>
        `;
      },

      getSkeleton() {
        return `
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            ${[1,2,3,4,5,6,7,8,9,10].map(() => `
              <div class="animate-pulse">
                 <div class="aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl mb-4"></div>
                 <div class="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                 <div class="flex justify-between">
                   <div class="h-3 bg-gray-800 rounded w-1/4"></div>
                   <div class="h-6 bg-gray-800 rounded w-1/3"></div>
                 </div>
              </div>
            `).join('')}
          </div>`;
      },

      showHelp() {
        alert(`📚 AYUDA BIBLIOTECA NCLEX\n\n• CLICK en cualquier libro: Abrir en lector online\n• BOTÓN "Descargar": Guardar PDF en tu dispositivo\n• Las portadas se cargan automáticamente desde GitHub\n• Los libros se ordenan por popularidad (descargas)\n\n📌 Asegúrate de tener conexión a internet para descargar.`);
      },

      render() {
        const view = document.getElementById('app-view');
        if (view) {
          view.innerHTML = this.getShell();
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
        subtitle: { es: 'Libros NCLEX + Descargas', en: 'NCLEX Books + Downloads' },
        icon: 'book-open', 
        color: 'purple', 
        render: () => { 
          setTimeout(() => LibraryUI.init(), 10); 
          return LibraryUI.getShell(); 
        }
      });
    }
    
    // Añadir estilos CSS adicionales (AQUÍ ESTABA EL ERROR, CORREGIDO)
    addCustomStyles();
  }
  
  function addCustomStyles() {
    const styles = `
      @keyframes slide-in-right {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .animate-slide-in-right {
        animation: slide-in-right 0.3s ease-out;
      }
      .perspective-1000 {
        perspective: 1000px;
      }
      .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .line-clamp-3 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
      .line-clamp-4 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
})();
