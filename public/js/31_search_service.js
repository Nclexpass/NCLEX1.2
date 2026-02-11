// 31_search_service.js — Buscador PRO estable, sin errores de DOM
(function() {
    'use strict';

    const CONFIG = {
        minQueryLength: 2,
        maxResults: 15,
        highlightDelay: 500,
        debounceTime: 300,
        maxIndexAttempts: 30,
        indexRetryDelay: 500,
        cacheLimit: 50
    };

    // --- Utilidad de idioma (misma que en libreta) ---
    function t(es, en) {
        const esEl = document.querySelector('.lang-es');
        return esEl && esEl.offsetParent !== null ? es : en;
    }

    function normalizeText(str) {
        if (!str) return '';
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    // Mapeo de colores a clases reales de Tailwind
    const COLOR_CLASSES = {
        blue:   { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-600 dark:text-blue-400' },
        green:  { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-600 dark:text-green-400' },
        purple: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-600 dark:text-purple-400' },
        red:    { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-600 dark:text-red-400' },
        yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-600 dark:text-yellow-400' },
        indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-600 dark:text-indigo-400' },
        pink:   { bg: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-600 dark:text-pink-400' },
        gray:   { bg: 'bg-gray-100 dark:bg-gray-800/40', text: 'text-gray-600 dark:text-gray-400' }
    };

    class SearchService {
        constructor() {
            this.index = [];
            this.isIndexed = false;
            this.searchInput = null;
            this.resultsContainer = null;
            this.resultsCache = new Map();
            this.lastQuery = '';
            this.attempts = 0;
            this.debounceTimer = null;
        }

        init() {
            // Esperar a que los topics estén disponibles
            this.waitForTopics();
            this.connectUI();
            this.setupGlobalListeners();
            window.SearchService = this; // API pública
        }

        // --- Espera inteligente por los datos ---
        waitForTopics() {
            // Si ya hay topics globales, los usa
            if (window.NCLEX_TOPICS && Array.isArray(window.NCLEX_TOPICS) && window.NCLEX_TOPICS.length) {
                this.buildIndex(window.NCLEX_TOPICS);
                return;
            }
            // Si la app está disponible, intenta obtenerlos
            const app = window.nclexApp || window.NCLEX;
            if (app && typeof app.getTopics === 'function') {
                const topics = app.getTopics();
                if (topics && topics.length) {
                    this.buildIndex(topics);
                    return;
                }
            }
            // Reintenta con backoff
            this.attempts++;
            if (this.attempts < CONFIG.maxIndexAttempts) {
                setTimeout(() => this.waitForTopics(), CONFIG.indexRetryDelay);
            }
        }

        // --- Construcción del índice (solo texto normalizado) ---
        buildIndex(topics) {
            console.log(`🔍 Search: indexando ${topics.length} temas`);
            this.index = topics
                .filter(t => t && t.id && t.title)
                .map(t => {
                    const titleES = t.title?.es || t.title || '';
                    const titleEN = t.title?.en || t.title || '';
                    const subES = t.subtitle?.es || t.subtitle || '';
                    const subEN = t.subtitle?.en || t.subtitle || '';

                    return {
                        id: t.id,
                        searchable: normalizeText(titleES + ' ' + subES + ' ' + titleEN + ' ' + subEN),
                        titleES,
                        titleEN,
                        subtitleES: subES,
                        subtitleEN: subEN,
                        icon: t.icon || 'book',
                        color: COLOR_CLASSES[t.color] ? t.color : 'blue',
                        lastAccessed: 0
                    };
                });
            this.isIndexed = true;
        }

        // --- Conexión con UI ---
        connectUI() {
            this.searchInput = document.getElementById('global-search');
            this.resultsContainer = document.getElementById('home-search-results');
            if (!this.searchInput || !this.resultsContainer) {
                setTimeout(() => this.connectUI(), 1000);
                return;
            }
            this.setupInputEvents();
        }

        setupInputEvents() {
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(this.debounceTimer);
                const q = e.target.value;
                if (!q.trim()) this.hideResults();
                this.debounceTimer = setTimeout(() => {
                    this.handleSearch(q);
                }, CONFIG.debounceTime);
            });

            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.clearSearch();
                    this.searchInput.blur();
                }
            });

            this.searchInput.addEventListener('click', () => {
                if (this.searchInput.value.length >= CONFIG.minQueryLength) {
                    this.showResults();
                }
            });
        }

        setupGlobalListeners() {
            // Cerrar al hacer clic fuera
            document.addEventListener('click', (e) => {
                const wrapper = this.searchInput?.closest('.relative');
                if (wrapper && !wrapper.contains(e.target)) {
                    this.hideResults();
                }
            });

            // Atajos Ctrl+K y navegación
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    this.searchInput?.focus();
                }
                if (this.resultsContainer?.style.display === 'block') {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        this.navigateResults(e.key === 'ArrowDown' ? 1 : -1);
                    }
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.selectActiveResult();
                    }
                }
            });
        }

        // --- Búsqueda con scoring y caché ---
        handleSearch(query) {
            if (!this.isIndexed || !query) return;
            query = query.trim();
            this.lastQuery = query;
            if (query.length < CONFIG.minQueryLength) {
                this.hideResults();
                return;
            }

            const cacheKey = query + '_' + (t('es', 'en') === 'es' ? 'es' : 'en');
            if (this.resultsCache.has(cacheKey)) {
                this.renderResults(this.resultsCache.get(cacheKey));
                return;
            }

            const normQuery = normalizeText(query);
            const words = normQuery.split(/\s+/).filter(w => w.length > 0);

            const results = this.index
                .map(item => {
                    let score = 0;
                    words.forEach(word => {
                        if (item.searchable.includes(word)) score += 10;
                        const title = t('es', 'en') === 'es' ? item.titleES : item.titleEN;
                        if (normalizeText(title).includes(word)) score += 5;
                    });
                    // bonus por reciente
                    if (Date.now() - item.lastAccessed < 86400000) score += 2;
                    return { ...item, score };
                })
                .filter(r => r.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, CONFIG.maxResults);

            // Guardar en caché (con límite)
            if (this.resultsCache.size >= CONFIG.cacheLimit) {
                const firstKey = this.resultsCache.keys().next().value;
                this.resultsCache.delete(firstKey);
            }
            this.resultsCache.set(cacheKey, results);
            this.renderResults(results);
        }

        // --- Renderizado seguro (sin clases dinámicas) ---
        renderResults(results) {
            if (!results || !results.length) {
                this.renderNoResults();
                return;
            }

            const isEs = t('es', 'en') === 'es';
            let html = `<div class="py-2 divide-y divide-gray-100 dark:divide-gray-800/50">`;

            results.forEach((item, idx) => {
                const title = isEs ? item.titleES : item.titleEN;
                const subtitle = isEs ? item.subtitleES : item.subtitleEN;
                const color = COLOR_CLASSES[item.color] || COLOR_CLASSES.blue;
                const activeClass = idx === 0 ? 'active bg-gray-50 dark:bg-white/5' : '';

                html += `
                    <div class="search-result-item ${activeClass} cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                         data-id="${item.id}"
                         onclick="window.SearchService.navigateToResult('${item.id}')"
                         onmouseover="window.SearchService.setActiveResult(${idx})">
                        <div class="px-4 py-3 flex items-center gap-3">
                            <div class="w-9 h-9 rounded-lg ${color.bg} ${color.text} flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-${item.icon} text-sm"></i>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="font-bold text-sm text-gray-800 dark:text-gray-100 truncate">${this.safeHighlight(title, this.lastQuery)}</div>
                                <div class="text-xs text-gray-500 truncate">${subtitle}</div>
                            </div>
                            <i class="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                        </div>
                    </div>
                `;
            });

            html += `
                <div class="px-4 py-1.5 text-[10px] text-gray-400 bg-gray-50 dark:bg-black/20 flex justify-between items-center rounded-b-lg">
                    <span>↵ ${t('Seleccionar', 'Select')}</span>
                    <span>↓ ↑ ${t('Navegar', 'Navigate')}</span>
                </div>
            `;

            this.resultsContainer.innerHTML = html;
            this.showResults();
        }

        renderNoResults() {
            const isEs = t('es', 'en') === 'es';
            this.resultsContainer.innerHTML = `
                <div class="p-8 text-center">
                    <i class="fa-solid fa-magnifying-glass text-gray-300 text-3xl mb-3"></i>
                    <p class="text-gray-500 text-sm font-medium">${isEs ? 'No hay resultados' : 'No results'}</p>
                </div>
            `;
            this.showResults();
        }

        safeHighlight(text, query) {
            if (!query) return text;
            const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escaped})`, 'gi');
            return text.replace(regex, '<span class="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-0.5 rounded font-bold">$1</span>');
        }

        // --- Navegación y activación ---
        navigateToResult(topicId) {
            // Marcar como visitado
            const idx = this.index.findIndex(i => i.id === topicId);
            if (idx !== -1) this.index[idx].lastAccessed = Date.now();

            const app = window.nclexApp || window.NCLEX;
            if (app && typeof app.navigate === 'function') {
                app.navigate(`topic/${topicId}`);
            } else {
                console.warn('nclexApp.navigate no disponible');
            }

            this.hideResults();
            this.searchInput.value = '';
            this.searchInput.blur();
        }

        // --- Highlight de contenido NO destructivo ---
        highlightAllContent(query) {
            if (!query) return;
            this.clearHighlights();

            const content = document.getElementById('app-view');
            if (!content) return;

            const walker = document.createTreeWalker(
                content,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        const parent = node.parentElement;
                        if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.tagName === 'TEXTAREA') return NodeFilter.FILTER_REJECT;
                        if (parent.offsetParent === null) return NodeFilter.FILTER_REJECT;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            const normQuery = normalizeText(query);
            const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            const marks = [];

            let node;
            while (node = walker.nextNode()) {
                if (!normalizeText(node.nodeValue).includes(normQuery)) continue;

                const span = document.createElement('span');
                span.innerHTML = node.nodeValue.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800/60 text-black dark:text-white px-0.5 rounded search-highlight">$1</mark>');
                node.parentNode.replaceChild(span, node);
                marks.push(span);
            }

            if (marks.length) {
                marks[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    marks.forEach(mark => {
                        mark.querySelectorAll('.search-highlight').forEach(el => {
                            el.classList.remove('bg-yellow-200', 'dark:bg-yellow-800/60');
                            el.classList.add('bg-yellow-300', 'dark:bg-yellow-700/80');
                        });
                    });
                }, 2000);
            }
        }

        clearHighlights() {
            const marks = document.querySelectorAll('.search-highlight');
            marks.forEach(mark => {
                const parent = mark.parentNode;
                if (parent) {
                    parent.replaceWith(parent.textContent);
                }
            });
        }

        // --- Helpers UI ---
        showResults() {
            if (this.resultsContainer) {
                this.resultsContainer.style.display = 'block';
                this.resultsContainer.classList.remove('hidden');
            }
        }

        hideResults() {
            if (this.resultsContainer) {
                this.resultsContainer.style.display = 'none';
                this.resultsContainer.classList.add('hidden');
            }
        }

        clearSearch() {
            if (this.searchInput) this.searchInput.value = '';
            this.hideResults();
            this.clearHighlights();
        }

        navigateResults(direction) {
            const items = this.resultsContainer?.querySelectorAll('.search-result-item');
            if (!items || !items.length) return;
            const active = this.resultsContainer.querySelector('.active');
            let idx = Array.from(items).indexOf(active);
            if (idx === -1) idx = direction > 0 ? 0 : items.length - 1;
            else idx = (idx + direction + items.length) % items.length;
            this.setActiveResult(idx);
            items[idx]?.scrollIntoView({ block: 'nearest' });
        }

        setActiveResult(index) {
            const items = this.resultsContainer?.querySelectorAll('.search-result-item');
            items?.forEach(el => el.classList.remove('active', 'bg-gray-50', 'dark:bg-white/5'));
            if (items && items[index]) {
                items[index].classList.add('active', 'bg-gray-50', 'dark:bg-white/5');
            }
        }

        selectActiveResult() {
            const active = this.resultsContainer?.querySelector('.active');
            if (active && active.dataset.id) {
                this.navigateToResult(active.dataset.id);
            }
        }
    }

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new SearchService().init());
    } else {
        new SearchService().init();
    }
})();