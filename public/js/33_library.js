/* 33_library.js — Library Module (Offline/GitHub Compatible) */
(function () {
    'use strict';

    // Esperar a que el núcleo (logic.js) esté listo
    if (!window.NCLEX && !window.nclexApp) return;

    // --- RENDERIZADO ---
    const Library = {
        render: () => {
            // LEER DATOS: Usamos la variable global cargada por catalog.js
            // Si no existe, usamos un array vacío para no romper la página.
            const books = window.NCLEX_CATALOG || [];

            let contentHTML = '';

            if (books.length === 0) {
                contentHTML = `
                    <div class="col-span-full flex flex-col items-center justify-center p-12 text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                        <i class="fa-solid fa-book-open text-4xl mb-4 opacity-50"></i>
                        <p>No catalog data found.</p>
                        <p class="text-xs mt-2">Ensure <code>PUBLIC/LIBRARY/catalog.js</code> is loaded correctly.</p>
                    </div>`;
            } else {
                books.forEach(book => {
                    contentHTML += `
                        <div class="group relative bg-white dark:bg-[#1c1c1e] rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col">
                            <div class="h-40 ${book.color || 'bg-gray-500'} relative p-4 flex flex-col justify-end text-white overflow-hidden">
                                <i class="fa-solid fa-book absolute top-2 right-2 text-white/20 text-5xl transform rotate-12 group-hover:scale-110 transition-transform"></i>
                                <div class="relative z-10">
                                    <span class="text-[10px] uppercase font-bold tracking-widest opacity-90 border border-white/30 px-2 py-0.5 rounded mb-1 inline-block">${book.type}</span>
                                    <h3 class="font-bold text-sm leading-tight line-clamp-2 shadow-black/50 drop-shadow-md">${book.title}</h3>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>

                            <div class="p-4 flex-1 flex flex-col justify-between">
                                <div class="mb-3">
                                    <p class="text-xs text-gray-400 font-medium truncate">${book.author}</p>
                                    <p class="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-snug">${book.description || ''}</p>
                                </div>
                                <button onclick="window.open('${book.url}', '_blank')" class="w-full py-2 bg-gray-50 dark:bg-white/5 hover:bg-brand-blue hover:text-white text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 group-btn border border-gray-100 dark:border-white/5">
                                    <span>ABRIR PDF</span>
                                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
            }

            return `
                <div class="animate-fade-in pb-20">
                    <div class="mb-8">
                        <h2 class="text-2xl font-black text-slate-800 dark:text-white mb-2">
                            <span class="lang-es">Biblioteca Digital</span>
                            <span class="lang-en hidden-lang">Digital Library</span>
                        </h2>
                        <div class="relative max-w-md">
                            <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                            <input type="text" placeholder="Filtrar recursos..." onkeyup="window.Library.filter(this.value)" 
                                class="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:border-brand-blue transition-colors">
                        </div>
                    </div>

                    <div id="library-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        ${contentHTML}
                    </div>
                </div>
            `;
        },

        // Filtro simple en cliente
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

    // Registrar en el sistema principal si existe
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
