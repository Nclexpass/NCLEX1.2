/* 33_library.js — Library Module (Compatible con PUBLIC/LIBRARY/catalog.js) */
(function () {
    'use strict';

    // Esperar a que el núcleo (logic.js) esté listo
    // Si no está listo, reintentar en 500ms
    if (!window.NCLEX && !window.nclexApp) {
        setTimeout(() => location.reload(), 1000); 
        return;
    }

    // --- RENDERIZADO ---
    const Library = {
        render: () => {
            // LEER DATOS: Usamos la variable global que viene de PUBLIC/LIBRARY/catalog.js
            // Si no existe, usamos un array vacío para no romper la página.
            const books = window.NCLEX_CATALOG || [];

            let contentHTML = '';

            if (books.length === 0) {
                contentHTML = `
                    <div class="col-span-full flex flex-col items-center justify-center p-12 text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                        <i class="fa-solid fa-book-open text-4xl mb-4 opacity-50"></i>
                        <p>No se encontraron libros.</p>
                        <p class="text-xs mt-2 text-center">Verifica que el archivo <code>PUBLIC/LIBRARY/catalog.js</code><br>contenga: <code>window.NCLEX_CATALOG = [...]</code></p>
                    </div>`;
            } else {
                books.forEach(book => {
                    // Determinar colores si no vienen definidos
                    const colorClass = book.color || 'bg-blue-600';
                    
                    contentHTML += `
                        <div class="group relative bg-white dark:bg-[#1c1c1e] rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col h-full">
                            <div class="h-40 ${colorClass} relative p-4 flex flex-col justify-end text-white overflow-hidden shrink-0">
                                <i class="fa-solid fa-book absolute top-2 right-2 text-white/20 text-5xl transform rotate-12 group-hover:scale-110 transition-transform"></i>
                                <div class="relative z-10">
                                    <span class="text-[10px] uppercase font-bold tracking-widest opacity-90 border border-white/30 px-2 py-0.5 rounded mb-1 inline-block shadow-sm">${book.type || 'RECURSO'}</span>
                                    <h3 class="font-bold text-sm leading-tight line-clamp-2 shadow-black/50 drop-shadow-md">${book.title}</h3>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>

                            <div class="p-4 flex-1 flex flex-col justify-between">
                                <div class="mb-3">
                                    <p class="text-xs text-gray-400 font-medium truncate mb-1"><i class="fa-solid fa-user-pen mr-1"></i> ${book.author || 'NCLEX Prep'}</p>
                                    <p class="text-[11px] text-gray-500 line-clamp-3 leading-relaxed">${book.description || 'Sin descripción disponible.'}</p>
                                </div>
                                <button onclick="window.open('${book.url}', '_blank')" class="mt-auto w-full py-2.5 bg-gray-50 dark:bg-white/5 hover:bg-brand-blue hover:text-white text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 group-btn border border-gray-200 dark:border-white/10">
                                    <span>ABRIR RECURSO</span>
                                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
            }

            return `
                <div class="animate-fade-in pb-20">
                    <div class="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
                        <div>
                            <h2 class="text-2xl font-black text-slate-800 dark:text-white mb-1 flex items-center gap-3">
                                <span class="lang-es">Biblioteca Digital</span>
                                <span class="lang-en hidden-lang">Digital Library</span>
                                <span class="text-xs font-normal px-2 py-1 bg-brand-blue/10 text-brand-blue rounded-full">${books.length} Items</span>
                            </h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                <span class="lang-es">Recursos oficiales, guías y protocolos clínicos.</span>
                                <span class="lang-en hidden-lang">Official resources, guides, and clinical protocols.</span>
                            </p>
                        </div>
                        
                        <div class="relative w-full md:w-64">
                            <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                            <input type="text" placeholder="Buscar..." onkeyup="window.Library.filter(this.value)" 
                                class="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/50 transition-all">
                        </div>
                    </div>

                    <div id="library-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        ${contentHTML}
                    </div>
                </div>
            `;
        },

        // Filtro simple en cliente (Búsqueda instantánea)
        filter: (term) => {
            const t = term.toLowerCase();
            const items = document.querySelectorAll('#library-grid > div');
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(t) ? 'flex' : 'none';
            });
        }
    };

    // Exponer globalmente
    window.Library = Library;

    // Registrar en el sistema principal
    if (window.NCLEX && window.NCLEX.registerTopic) {
        window.NCLEX.registerTopic({
            id: 'library',
            title: { es: 'Biblioteca', en: 'Library' },
            subtitle: { es: 'Recursos PDF', en: 'PDF Resources' },
            icon: 'book-bookmark',
            color: 'teal',
            render: () => window.Library.render()
        });
    }

})();
