/* eslint-disable */
(function () {
    'use strict';
    console.log('NCLEX logic.js v2.1 loaded');

    // ==========================
    // NCLEX Core Registry
    // ==========================
    const NCLEX = window.NCLEX || {};
    window.NCLEX = NCLEX;

    const state = {
        topics: [],
        currentRoute: 'home',
        lang: 'es',
        theme: 'dark',
        user: { name: 'Reynier Diaz' }
    };

    // Helpers
    function $(id) { return document.getElementById(id); }
    function isDark() { return document.documentElement.classList.contains('dark'); }

    function t(es, en) {
        return state.lang === 'es' ? es : en;
    }

    function setLang(lang) {
        state.lang = lang;
        const esEls = document.querySelectorAll('.lang-es');
        const enEls = document.querySelectorAll('.lang-en');
        if (lang === 'es') {
            esEls.forEach(el => el.classList.remove('hidden-lang'));
            enEls.forEach(el => el.classList.add('hidden-lang'));
        } else {
            enEls.forEach(el => el.classList.remove('hidden-lang'));
            esEls.forEach(el => el.classList.add('hidden-lang'));
        }
        render(state.currentRoute);
    }

    function setTheme(theme) {
        state.theme = theme;
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        render(state.currentRoute);
    }

    function hideLoading() {
        const loading = $('loading');
        if (loading) {
            loading.classList.add('opacity-0');
            setTimeout(() => loading.remove(), 400);
        }
    }

    // ==========================
    // Topic Registry
    // ==========================
    NCLEX.registerTopic = function (topic) {
        // Prevent duplicates
        if (!topic || !topic.id) return;
        if (state.topics.find(t => t.id === topic.id)) return;
        state.topics.push(topic);

        // Keep order by "order" then by name
        state.topics.sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || (a.name || '').localeCompare(b.name || ''));
    };

    NCLEX.getAllTopics = function () {
        return state.topics;
    };

    // ==========================
    // Progress (localStorage)
    // ==========================
    function getTopicProgress(topicId) {
        try {
            const raw = localStorage.getItem(`nclex_progress_${topicId}`);
            const val = raw ? JSON.parse(raw) : { done: 0, total: 0 };
            if (!val || typeof val !== 'object') return { done: 0, total: 0 };
            return {
                done: Number(val.done || 0),
                total: Number(val.total || 0)
            };
        } catch (e) {
            return { done: 0, total: 0 };
        }
    }

    function getOverallProgress() {
        const topics = state.topics || [];
        let done = 0, total = 0;
        topics.forEach(tpc => {
            const p = getTopicProgress(tpc.id);
            done += p.done;
            total += p.total;
        });
        const pct = total ? Math.round((done / total) * 100) : 0;
        return { done, total, pct, modules: topics.length };
    }

    // ==========================
    // Navigation UI
    // ==========================
    function renderTopicsNav() {
        const container = $('topics-nav');
        if (!container) return;

        if (!state.topics.length) {
            container.innerHTML = `<div class="text-xs text-gray-400 px-4 py-2">${t('Cargando temas...', 'Loading topics...')}</div>`;
            return;
        }

        container.innerHTML = state.topics.map(topic => {
            const icon = topic.icon || 'fa-solid fa-book';
            const label = state.lang === 'es' ? (topic.label_es || topic.name || topic.id) : (topic.label_en || topic.name || topic.id);
            return `
                <button
                    class="nav-btn w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-300 group"
                    data-topic-id="${topic.id}"
                    onclick="window.nclexApp.navigate('topic/${topic.id}')"
                >
                    <div class="w-6 flex justify-center">
                        <i class="${icon} text-xl ${topic.iconColor || 'text-brand-blue'} group-hover:scale-110 transition-transform"></i>
                    </div>
                    <span class="hidden lg:block text-base font-bold truncate">${label}</span>
                </button>
            `;
        }).join('');
    }

    function updateNavActive(route) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        const homeBtn = document.querySelector('[data-route="home"]');
        const simBtn = document.querySelector('[data-route="simulator"]');

        if (route === 'home' && homeBtn) homeBtn.classList.add('active');
        else if (route === 'simulator' && simBtn) simBtn.classList.add('active');
        else if (route.startsWith('topic/')) {
            const topicId = route.split('/')[1];
            const topicBtn = document.querySelector(`[data-topic-id="${topicId}"]`);
            if (topicBtn) topicBtn.classList.add('active');
        }
    }

    // ==========================
    // Global Search (sidebar)
    // ==========================
    function initGlobalSearch() {
        const input = $('global-search');
        const results = $('home-search-results');
        if (!input || !results) return;

        const renderResults = (items) => {
            if (!items.length) {
                results.innerHTML = `<div class="p-4 text-sm text-gray-500">${t('No se encontraron resultados.', 'No results found.')}</div>`;
                results.classList.add('active');
                return;
            }
            results.innerHTML = items.slice(0, 12).map(item => `
                <button class="w-full text-left p-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border-b border-gray-200/60 dark:border-white/10"
                    onclick="window.nclexApp.navigate('topic/${item.topicId}')">
                    <div class="font-bold text-sm text-gray-800 dark:text-gray-100">${item.title}</div>
                    <div class="text-xs text-gray-500 mt-1">${item.topicLabel}</div>
                </button>
            `).join('');
            results.classList.add('active');
        };

        const buildIndex = () => {
            const idx = [];
            state.topics.forEach(topic => {
                const label = state.lang === 'es' ? (topic.label_es || topic.name) : (topic.label_en || topic.name);
                (topic.cards || []).forEach(card => {
                    idx.push({
                        topicId: topic.id,
                        topicLabel: label,
                        title: card.title || card.q || card.question || 'Item'
                    });
                });
            });
            return idx;
        };

        let searchIndex = buildIndex();

        input.addEventListener('focus', () => {
            searchIndex = buildIndex();
        });

        input.addEventListener('input', () => {
            const q = (input.value || '').trim().toLowerCase();
            if (!q) {
                results.classList.remove('active');
                results.innerHTML = '';
                return;
            }
            const matches = searchIndex.filter(x => (x.title || '').toLowerCase().includes(q));
            renderResults(matches);
        });

        document.addEventListener('click', (e) => {
            if (!results.contains(e.target) && e.target !== input) {
                results.classList.remove('active');
            }
        });
    }

    // ==========================
    // Renderers
    // ==========================
    function render(route) {
        state.currentRoute = route;
        updateNavActive(route);

        const view = $('app-view');
        if (!view) return;

        if (route === 'home') {
            view.innerHTML = renderHome();
            initHomeSearch();
            initBackToTop();
            return;
        }

        if (route === 'simulator') {
            view.innerHTML = renderSimulator();
            initBackToTop();
            return;
        }

        if (route.startsWith('topic/')) {
            const topicId = route.split('/')[1];
            const topic = state.topics.find(t => t.id === topicId);
            if (!topic) {
                view.innerHTML = `<div class="text-center text-gray-500 py-20">${t('Tema no encontrado.', 'Topic not found.')}</div>`;
                return;
            }
            view.innerHTML = renderTopic(topic);
            initBackToTop();
            return;
        }

        // fallback
        view.innerHTML = renderHome();
        initHomeSearch();
        initBackToTop();
    }

    function renderHome() {
        const overall = getOverallProgress();
        const topics = state.topics || [];

        const moduleCards = topics.map(topic => {
            const label = state.lang === 'es' ? (topic.label_es || topic.name) : (topic.label_en || topic.name);
            const sub = state.lang === 'es' ? (topic.subtitle_es || topic.subtitle || '') : (topic.subtitle_en || topic.subtitle || '');
            const icon = topic.icon || 'fa-solid fa-book';
            const icoBg = topic.cardColor || 'bg-white/5';

            return `
                <button onclick="window.nclexApp.navigate('topic/${topic.id}')"
                    class="group relative rounded-2xl bg-white/5 dark:bg-white/5 border border-white/10 hover:border-white/20 transition-all overflow-hidden text-left">
                    <div class="p-6">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl ${icoBg} flex items-center justify-center">
                                <i class="${icon} text-xl ${topic.iconColor || 'text-brand-blue'}"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="text-white font-black text-lg truncate">${label}</div>
                                <div class="text-gray-400 text-sm truncate">${sub}</div>
                            </div>
                        </div>
                        <div class="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div class="h-full bg-brand-blue rounded-full" style="width:${Math.min(100, Math.max(0, getTopicProgress(topic.id).total ? Math.round((getTopicProgress(topic.id).done/getTopicProgress(topic.id).total)*100) : 0))}%"></div>
                        </div>
                    </div>
                    <div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <div class="absolute -top-24 -right-24 w-64 h-64 bg-brand-blue/10 blur-3xl"></div>
                    </div>
                </button>
            `;
        }).join('');

        return `
            <div class="min-h-screen text-white">
                <div class="max-w-6xl mx-auto">
                    <div class="mb-8">
                        <div class="text-4xl font-black tracking-tight">NCLEX Masterclass OS</div>
                        <div class="text-gray-400 mt-1">${t('Tu éxito comienza hoy.', 'Your success starts today.')}</div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div class="lg:col-span-12 rounded-3xl bg-white/5 border border-white/10 p-6">
                            <div class="flex items-start justify-between gap-6">
                                <div>
                                    <div class="font-extrabold text-lg">${t('Progreso General', 'Overall Progress')}</div>
                                    <div class="text-sm text-gray-400">${overall.done} / ${overall.total || 0} ${t('preguntas', 'items')} • ${overall.modules} ${t('módulos', 'modules')}</div>
                                </div>
                                <div class="text-3xl font-black text-brand-blue">${overall.pct}%</div>
                            </div>
                            <div class="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div class="h-full bg-brand-blue rounded-full" style="width:${overall.pct}%"></div>
                            </div>
                        </div>

                        <div class="lg:col-span-12 rounded-3xl bg-white/5 border border-white/10 p-6">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center gap-3">
                                    <i class="fa-solid fa-magnifying-glass text-brand-blue"></i>
                                    <div>
                                        <div class="font-extrabold text-lg">${t('Búsqueda Inteligente', 'Smart Search')}</div>
                                        <div class="text-sm text-gray-400">${t('Encuentra información en todos los módulos', 'Find information across all modules')}</div>
                                    </div>
                                </div>
                                <div class="text-xs px-3 py-1 rounded-full bg-brand-blue/20 text-brand-blue font-bold">
                                    ${topics.length} ${t('temas', 'topics')}
                                </div>
                            </div>
                            <input id="home-smart-search" type="text"
                                class="w-full mt-2 bg-black/30 border border-white/10 focus:border-brand-blue/40 rounded-2xl px-4 py-3 outline-none"
                                placeholder="${t('Buscar términos médicos, diagnósticos, fármacos...', 'Search medical terms, diagnoses, drugs...')}" />
                            <div id="home-smart-results" class="mt-3 hidden"></div>
                            <div class="mt-3 text-xs text-gray-400">
                                ${t('Ejemplos:', 'Examples:')}
                                <span class="inline-flex gap-2 ml-2">
                                    <span class="px-2 py-1 rounded-full bg-blue-500/20 text-blue-200">diabetes</span>
                                    <span class="px-2 py-1 rounded-full bg-red-500/20 text-red-200">cardiovascular</span>
                                    <span class="px-2 py-1 rounded-full bg-green-500/20 text-green-200">pediatrics</span>
                                    <span class="px-2 py-1 rounded-full bg-purple-500/20 text-purple-200">SATA</span>
                                </span>
                            </div>
                        </div>

                        <div class="lg:col-span-4 rounded-3xl bg-gradient-to-br from-purple-600/60 to-purple-500/20 border border-white/10 p-6">
                            <div class="flex items-center gap-3 mb-2">
                                <i class="fa-solid fa-gamepad text-white"></i>
                                <div class="font-black text-lg">${t('Simulador', 'Simulator')}</div>
                            </div>
                            <div class="text-sm text-white/80">${t('Práctica adaptativa (SATA + Opciones)', 'Adaptive practice (SATA + Options)')}</div>
                            <button onclick="window.nclexApp.navigate('simulator')"
                                class="mt-4 w-full py-3 rounded-2xl bg-white/15 hover:bg-white/20 transition font-bold">
                                ${t('Abrir', 'Open')}
                            </button>
                        </div>

                        <div class="lg:col-span-4 rounded-3xl bg-gradient-to-br from-orange-500/70 to-red-500/20 border border-white/10 p-6">
                            <div class="flex items-center gap-3 mb-2">
                                <i class="fa-solid fa-notes-medical text-white"></i>
                                <div class="font-black text-lg">NGN Case: Sepsis</div>
                            </div>
                            <div class="text-sm text-white/80">${t('Demo de caso clínico Next Gen', 'Next Gen Case Study Demo')}</div>
                            <button onclick="window.nclexApp.navigate('topic/27_critical_thinking_ngn')"
                                class="mt-4 w-full py-3 rounded-2xl bg-white/15 hover:bg-white/20 transition font-bold">
                                ${t('Abrir', 'Open')}
                            </button>
                        </div>

                        <div class="lg:col-span-4 rounded-3xl bg-white/5 border border-white/10 p-6">
                            <div class="flex items-center gap-3 mb-2">
                                <i class="fa-solid fa-layer-group text-brand-blue"></i>
                                <div class="font-black text-lg">${t('Library', 'Library')}</div>
                            </div>
                            <div class="text-4xl font-black">${topics.length} <span class="text-base text-gray-400 font-bold">${t('temas', 'Topics')}</span></div>
                            <div class="text-sm text-gray-400 mt-2">${t('Acceso rápido desde el botón superior derecho.', 'Quick access from the top-right button.')}</div>
                        </div>

                        <div class="lg:col-span-12">
                            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                ${moduleCards || ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function initHomeSearch() {
        const input = document.getElementById('home-smart-search');
        const results = document.getElementById('home-smart-results');
        if (!input || !results) return;

        const index = [];
        state.topics.forEach(topic => {
            const topicLabel = state.lang === 'es' ? (topic.label_es || topic.name) : (topic.label_en || topic.name);
            (topic.cards || []).forEach(card => {
                const title = card.title || card.q || card.question || '';
                const text = (card.answer || card.a || card.explanation || '') + ' ' + (card.rationale || '');
                index.push({ topicId: topic.id, topicLabel, title, text });
            });
        });

        function show(items) {
            if (!items.length) {
                results.innerHTML = `<div class="text-sm text-gray-400 p-4">${t('Sin resultados.', 'No results.')}</div>`;
                results.classList.remove('hidden');
                return;
            }

            results.innerHTML = `
                <div class="rounded-2xl border border-white/10 overflow-hidden">
                    ${items.slice(0, 8).map(it => `
                        <button class="w-full text-left p-4 bg-white/5 hover:bg-white/10 transition border-b border-white/10"
                            onclick="window.nclexApp.navigate('topic/${it.topicId}')">
                            <div class="font-extrabold">${it.title || t('Resultado', 'Result')}</div>
                            <div class="text-xs text-gray-400 mt-1">${it.topicLabel}</div>
                        </button>
                    `).join('')}
                </div>
            `;
            results.classList.remove('hidden');
        }

        input.addEventListener('input', () => {
            const q = (input.value || '').trim().toLowerCase();
            if (!q) {
                results.classList.add('hidden');
                results.innerHTML = '';
                return;
            }
            const found = index.filter(it =>
                (it.title || '').toLowerCase().includes(q) ||
                (it.text || '').toLowerCase().includes(q) ||
                (it.topicLabel || '').toLowerCase().includes(q)
            );
            show(found);
        });
    }

    function renderSimulator() {
        return `
            <div class="text-white">
                <div class="text-3xl font-black mb-2">${t('Simulador', 'Simulator')}</div>
                <div class="text-gray-400 mb-6">${t('Aquí va tu simulador (ngn_engine.js / simulator.js).', 'Your simulator lives here (ngn_engine.js / simulator.js).')}</div>
                <div class="rounded-3xl bg-white/5 border border-white/10 p-6">
                    <div class="text-sm text-gray-300">
                        ${t('Si tu simulador ya existe, este view solo debe llamar tu UI del simulador.', 'If your simulator already exists, this view should call your simulator UI.')}
                    </div>
                </div>
            </div>
        `;
    }

    function renderTopic(topic) {
        const label = state.lang === 'es' ? (topic.label_es || topic.name) : (topic.label_en || topic.name);
        const subtitle = state.lang === 'es' ? (topic.subtitle_es || topic.subtitle || '') : (topic.subtitle_en || topic.subtitle || '');
        const cards = topic.cards || [];
        return `
            <div class="text-white">
                <div class="mb-6">
                    <div class="text-3xl font-black">${label}</div>
                    <div class="text-gray-400">${subtitle}</div>
                </div>
                <div class="grid grid-cols-1 gap-4">
                    ${cards.slice(0, 50).map((c, i) => `
                        <div class="rounded-3xl bg-white/5 border border-white/10 p-6">
                            <div class="font-extrabold mb-2">${c.title || c.q || c.question || (t('Tarjeta', 'Card') + ' ' + (i + 1))}</div>
                            <div class="text-gray-300 text-sm whitespace-pre-line">${c.answer || c.a || c.explanation || ''}</div>
                        </div>
                    `).join('')}
                    ${!cards.length ? `<div class="text-gray-400">${t('Este tema no tiene contenido registrado.', 'This topic has no registered content.')}</div>` : ''}
                </div>
            </div>
        `;
    }

    // Back to top button
    function initBackToTop() {
        const btn = document.getElementById('back-to-top');
        const main = document.getElementById('main-content');
        if (!btn || !main) return;

        const onScroll = () => {
            const y = main.scrollTop;
            if (y > 500) {
                btn.classList.remove('hidden');
                btn.classList.remove('opacity-0', 'translate-y-10');
            } else {
                btn.classList.add('opacity-0', 'translate-y-10');
                setTimeout(() => btn.classList.add('hidden'), 200);
            }
        };

        main.removeEventListener('scroll', onScroll);
        main.addEventListener('scroll', onScroll);
        onScroll();
    }

    // ==========================
    // Public API (nclexApp)
    // ==========================
    window.nclexApp = {
        navigate(route) {
            // Always allow re-render on Home for refresh
            if (state.currentRoute === route && route !== 'home') return;
            render(route);
        },
        toggleLanguage() {
            setLang(state.lang === 'es' ? 'en' : 'es');
        },
        toggleTheme() {
            setTheme(isDark() ? 'light' : 'dark');
        }
    };

    // ==========================
    // Init
    // ==========================
    function init() {
        // Load persisted prefs
        const savedLang = localStorage.getItem('nclex_lang');
        const savedTheme = localStorage.getItem('nclex_theme');

        if (savedLang === 'en' || savedLang === 'es') state.lang = savedLang;
        if (savedTheme === 'dark' || savedTheme === 'light') state.theme = savedTheme;

        setLang(state.lang);
        setTheme(state.theme);

        renderTopicsNav();
        initGlobalSearch();

        // Default Home
        render('home');
        hideLoading();
    }

    // Persist on changes
    const originalSetLang = setLang;
    setLang = function (lang) {
        localStorage.setItem('nclex_lang', lang);
        originalSetLang(lang);
        renderTopicsNav();
        initGlobalSearch();
    };

    const originalSetTheme = setTheme;
    setTheme = function (theme) {
        localStorage.setItem('nclex_theme', theme);
        originalSetTheme(theme);
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
