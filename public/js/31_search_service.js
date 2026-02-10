/* 31_search_service.js — Global Search Engine (Spotlight/Command Palette Style) */
/* Optimized for Clinical Terminology & Fast Indexing */

(function () {
    'use strict';

    // --- CONFIGURACIÓN ---
    const CONFIG = {
        minChars: 2,
        maxResults: 10,
        hotkey: 'k' // Ctrl/Cmd + K
    };

    let searchIndex = [];
    let isOpen = false;

    // --- 1. MOTOR DE INDEXADO ---
    const SearchEngine = {
        init: () => {
            // Esperar a que NCLEX esté listo para indexar módulos
            setTimeout(SearchEngine.buildIndex, 1000);
            
            // Inyectar UI
            SearchUI.inject();
            
            // Event Listeners Globales
            document.addEventListener('keydown', (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === CONFIG.hotkey) {
                    e.preventDefault();
                    SearchUI.toggle();
                }
                if (e.key === 'Escape' && isOpen) {
                    SearchUI.close();
                }
            });
        },

        buildIndex: () => {
            if (!window.NCLEX) return;
            
            const state = window.NCLEX.getState();
            searchIndex = []; // Reset

            // 1. Indexar Módulos
            Object.values(state.modules).forEach(mod => {
                const titleEs = typeof mod.title === 'object' ? mod.title.es : mod.title;
                const titleEn = typeof mod.title === 'object' ? mod.title.en : mod.title;
                
                searchIndex.push({
                    id: mod.id,
                    type: 'module',
                    title: { es: titleEs, en: titleEn },
                    keywords: `${titleEs} ${titleEn} ${mod.subtitle?.es || ''} ${mod.subtitle?.en || ''}`.toLowerCase(),
                    icon: mod.icon || 'book'
                });
            });

            // 2. Indexar Conceptos Médicos Clave (Hardcoded para demostración rápida)
            const medicalTerms = [
                { id: 'ngn', term: 'Sepsis', desc: { es: 'Caso clínico NGN', en: 'NGN Case Study' } },
                { id: 'ngn', term: 'Shock', desc: { es: 'Protocolos de emergencia', en: 'Emergency protocols' } },
                { id: 'anatomy', term: 'Cardio', desc: { es: 'Anatomía del corazón', en: 'Heart anatomy' } },
                { id: 'simulator', term: 'Examen', desc: { es: 'Simulador NCLEX', en: 'NCLEX Simulator' } }
            ];

            medicalTerms.forEach(item => {
                searchIndex.push({
                    id: item.id,
                    type: 'concept',
                    title: { es: item.term, en: item.term },
                    keywords: `${item.term} ${item.desc.es} ${item.desc.en}`.toLowerCase(),
                    icon: 'stethoscope'
                });
            });

            console.log(`[Search] Index built: ${searchIndex.length} items.`);
        },

        query: (q) => {
            const normalized = q.toLowerCase().trim();
            if (normalized.length < CONFIG.minChars) return [];

            return searchIndex.filter(item => 
                item.keywords.includes(normalized)
            ).slice(0, CONFIG.maxResults);
        }
    };

    // --- 2. INTERFAZ DE USUARIO (UI) ---
    const SearchUI = {
        inject: () => {
            // 1. Botón Flotante (FAB)
            const fabContainer = document.getElementById('floating-tools-container');
            if (fabContainer) {
                const btn = document.createElement('div');
                btn.innerHTML = `
                    <button onclick="window.SearchService.toggle()" class="w-12 h-12 bg-white dark:bg-[#2c2c2e] text-brand-blue rounded-full shadow-lg border border-gray-200 dark:border-white/10 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer group z-40">
                        <i class="fa-solid fa-magnifying-glass text-lg group-hover:rotate-90 transition-transform duration-300"></i>
                    </button>
                `;
                fabContainer.appendChild(btn);
            }

            // 2. Modal de Búsqueda
            const modal = document.createElement('div');
            modal.id = 'search-modal';
            modal.className = 'fixed inset-0 z-[100] hidden';
            modal.innerHTML = `
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onclick="window.SearchService.close()"></div>
                
                <div class="relative w-full max-w-2xl mx-auto mt-20 px-4 animate-slide-up">
                    <div class="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10">
                        
                        <div class="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-white/5">
                            <i class="fa-solid fa-magnifying-glass text-gray-400 text-xl ml-2"></i>
                            <input type="text" id="search-input" 
                                class="w-full bg-transparent text-xl font-medium text-slate-800 dark:text-white placeholder-gray-400 focus:outline-none"
                                placeholder="Buscar temas, casos, conceptos..." 
                                autocomplete="off">
                            <button onclick="window.SearchService.close()" class="text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-500">ESC</button>
                        </div>

                        <div id="search-results" class="max-h-[60vh] overflow-y-auto p-2">
                            <div class="p-8 text-center text-gray-400">
                                <i class="fa-brands fa-searchengin text-4xl mb-3 opacity-50"></i>
                                <p class="text-sm">Escribe para buscar en la Masterclass.</p>
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 dark:bg-black/20 p-2 text-center text-[10px] text-gray-400 font-mono">
                            NCLEX SEARCH ENGINE V2.0
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Listener Input
            document.getElementById('search-input').addEventListener('input', (e) => {
                SearchUI.renderResults(e.target.value);
            });
        },

        toggle: () => {
            const modal = document.getElementById('search-modal');
            const input = document.getElementById('search-input');
            
            if (isOpen) {
                SearchUI.close();
            } else {
                modal.classList.remove('hidden');
                isOpen = true;
                setTimeout(() => input.focus(), 50);
                document.body.style.overflow = 'hidden'; // Lock scroll
            }
        },

        close: () => {
            const modal = document.getElementById('search-modal');
            modal.classList.add('hidden');
            isOpen = false;
            document.body.style.overflow = ''; // Unlock scroll
            document.getElementById('search-input').value = '';
            document.getElementById('search-results').innerHTML = ''; // Clear
        },

        renderResults: (query) => {
            const container = document.getElementById('search-results');
            const results = SearchEngine.query(query);

            if (query.length < CONFIG.minChars) {
                container.innerHTML = `
                    <div class="p-8 text-center text-gray-400">
                        <p class="text-sm">Escribe al menos ${CONFIG.minChars} caracteres...</p>
                    </div>`;
                return;
            }

            if (results.length === 0) {
                container.innerHTML = `
                    <div class="p-8 text-center text-gray-400">
                        <i class="fa-regular fa-face-frown text-2xl mb-2"></i>
                        <p class="text-sm">No se encontraron resultados para "${query}"</p>
                    </div>`;
                return;
            }

            let html = '<div class="flex flex-col gap-1">';
            results.forEach(res => {
                html += `
                    <button onclick="window.SearchService.go('${res.id}')" 
                        class="flex items-center gap-4 p-3 rounded-xl hover:bg-brand-blue/5 dark:hover:bg-blue-500/10 hover:border-brand-blue/30 border border-transparent transition-all group text-left">
                        
                        <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                            <i class="fa-solid fa-${res.icon}"></i>
                        </div>
                        
                        <div class="flex-1">
                            <div class="font-bold text-slate-800 dark:text-gray-200 text-sm">
                                <span class="lang-es">${res.title.es}</span>
                                <span class="lang-en hidden-lang" style="display:none">${res.title.en}</span>
                            </div>
                            <div class="text-xs text-gray-400">
                                ${res.type.toUpperCase()}
                            </div>
                        </div>
                        
                        <i class="fa-solid fa-chevron-right text-gray-300 group-hover:text-brand-blue"></i>
                    </button>
                `;
            });
            html += '</div>';
            
            container.innerHTML = html;
            
            // Re-apply language check
            if (window.NCLEX) window.NCLEX.toggleLanguage(); window.NCLEX.toggleLanguage();
        },

        go: (id) => {
            if (window.NCLEX) {
                window.NCLEX.navigate(id);
                SearchUI.close();
            }
        }
    };

    // --- 3. API PÚBLICA ---
    window.SearchService = {
        toggle: SearchUI.toggle,
        close: SearchUI.close,
        go: SearchUI.go
    };

    // Inicializar al cargar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', SearchEngine.init);
    } else {
        SearchEngine.init();
    }

})();
