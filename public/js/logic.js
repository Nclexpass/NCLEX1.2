/* logic.js — NCLEX Study App Logic (Routes + Topics + Search + Language) */
(function () {
  'use strict';

  // ----------------------------
  // Utilidades DOM
  // ----------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function safeText(s) {
    return (s ?? '').toString();
  }

  function escapeHtml(s) {
    return safeText(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeFaIcon(icon) {
    // Acepta "fa-baby", "baby", "fa-solid fa-baby"
    const raw = safeText(icon).trim();
    if (!raw) return 'book-medical';
    const match = raw.match(/fa-([a-z0-9-]+)/i);
    return match ? match[1] : raw.replace(/^fa-/, '');
  }

  // ----------------------------
  // Estado global
  // ----------------------------
  const app = window.nclexApp = window.nclexApp || {};
  app.topics = app.topics || [];
  app.currentRoute = app.currentRoute || 'home';
  app._lastPayload = app._lastPayload || null;

  const LANG_KEY = 'nclex_lang';
  const THEME_KEY = 'nclex_theme';
  const LAST_TOPIC_KEY = 'nclex_last_topic';

  function getLang() {
    return localStorage.getItem(LANG_KEY) || 'es';
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
  }

  function t(es, en) {
    return getLang() === 'es' ? (es ?? '') : (en ?? es ?? '');
  }

  // ----------------------------
  // Render helpers
  // ----------------------------
  function setView(html) {
    const view = $('#app-view');
    if (!view) return;
    view.innerHTML = html;
    applyGlobalLanguage(view);
  }

  function applyGlobalLanguage(root = document) {
    const lang = getLang();
    const isEs = lang === 'es';
    $$('.lang-es', root).forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
    $$('.lang-en', root).forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
    document.documentElement.lang = lang;
  }

  // ----------------------------
  // Tema (claro/oscuro)
  // ----------------------------
  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') html.classList.add('dark');
    else html.classList.remove('dark');
    localStorage.setItem(THEME_KEY, theme);
  }

  function toggleTheme() {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  // ----------------------------
  // Sidebar topics
  // ----------------------------
  function renderSidebarTopics() {
    const container = $('#topics-nav');
    if (!container) return;

    const html = (app.topics || []).map(topic => {
      const icon = normalizeFaIcon(topic.icon);
      const titleEs = topic.titleEs || '';
      const titleEn = topic.titleEn || titleEs || '';

      return `
        <button
          onclick="window.nclexApp.navigate('topic', {id: '${escapeHtml(topic.id)}'})"
          data-route="topic"
          data-topic-id="${escapeHtml(topic.id)}"
          class="nav-btn w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-300 group">
          <div class="w-6 flex justify-center">
            <i class="fa-solid fa-${icon} text-xl text-brand-blue group-hover:scale-110 transition-transform"></i>
          </div>
          <span class="hidden lg:block text-base font-bold lang-es">${escapeHtml(titleEs)}</span>
          <span class="hidden lg:block text-base font-bold lang-en hidden-lang">${escapeHtml(titleEn)}</span>
        </button>
      `;
    }).join('');

    container.innerHTML = html;
    applyGlobalLanguage(container);

    // refresca active state
    updateNavActive(app.currentRoute, app._lastPayload);
  }

  function updateHomeTopicsCount() {
    const el = $('#topics-count');
    if (el) el.textContent = String(app.topics.length);
  }

  // ----------------------------
  // Registro de temas (compatible con ambos formatos)
  // ----------------------------
  function normalizeTopicShape(topic) {
    // Soporta:
    // - titleEs/titleEn (antiguo)
    // - title: {es,en} (nuevo)
    if (topic.title && typeof topic.title === 'object') {
      topic.titleEs = topic.titleEs ?? topic.title.es ?? '';
      topic.titleEn = topic.titleEn ?? topic.title.en ?? topic.title.es ?? '';
    } else {
      topic.titleEs = topic.titleEs ?? '';
      topic.titleEn = topic.titleEn ?? topic.titleEs ?? '';
    }

    if (topic.subtitle && typeof topic.subtitle === 'object') {
      topic.subtitleEs = topic.subtitleEs ?? topic.subtitle.es ?? '';
      topic.subtitleEn = topic.subtitleEn ?? topic.subtitle.en ?? topic.subtitle.es ?? '';
    } else {
      topic.subtitleEs = topic.subtitleEs ?? '';
      topic.subtitleEn = topic.subtitleEn ?? topic.subtitleEs ?? '';
    }

    topic.tags = Array.isArray(topic.tags) ? topic.tags : (topic.tags ? [topic.tags] : []);
    topic.icon = topic.icon || 'book-medical';
    return topic;
  }

  function registerTopic(topic) {
    if (!topic || !topic.id) return;

    normalizeTopicShape(topic);

    // evita duplicados
    if (app.topics.some(t => t.id === topic.id)) return;

    app.topics.push(topic);

    // Mantén un espejo simple para otros módulos
    window.NCLEX_TOPICS = app.topics;

    // invalida índice inteligente
    SmartTextIndex.built = false;

    // actualiza UI sidebar y contador home (sin re-render pesado)
    renderSidebarTopics();
    updateHomeTopicsCount();
  }

  // API pública para tus scripts de temas
  window.NCLEX = window.NCLEX || {};
  window.NCLEX.registerTopic = registerTopic;

  // ----------------------------
  // Índice inteligente (para búsqueda home)
  // ----------------------------
  function stripHtml(html) {
    return safeText(html)
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const SmartTextIndex = {
    items: [],
    built: false,

    build() {
      this.items = [];
      (app.topics || []).forEach(topic => {
        const titleEs = topic.titleEs || '';
        const titleEn = topic.titleEn || titleEs || '';
        const tags = (topic.tags || []).join(' ');

        let blocksText = '';
        if (Array.isArray(topic.content)) {
          blocksText = topic.content.map(b =>
            `${b.titleEs || ''} ${b.titleEn || ''} ${b.contentEs || ''} ${b.contentEn || ''}`
          ).join(' ');
        } else if (typeof topic.render === 'function') {
          // Indexa el contenido HTML renderizado (para temas tipo 01_newborn.js)
          try {
            const html = topic.render();
            blocksText = stripHtml(html);
          } catch (e) {
            blocksText = '';
          }
        }

        const haystack = `${titleEs} ${titleEn} ${tags} ${blocksText}`.toLowerCase();
        this.items.push({ type: 'topic', topic, haystack });
      });

      this.built = true;
    },

    search(term, limit = 12) {
      if (!this.built) this.build();
      const q = (term || '').toLowerCase().trim();
      if (!q) return [];

      const tokens = q.split(/\s+/).filter(Boolean);
      const scored = [];

      for (const item of this.items) {
        let score = 0;
        for (const tk of tokens) {
          const idx = item.haystack.indexOf(tk);
          if (idx !== -1) score += (idx < 40 ? 12 : idx < 140 ? 7 : 3);
        }
        if (score > 0) scored.push({ ...item, score });
      }

      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, limit);
    }
  };

  // ----------------------------
  // Rutas / Navegación
  // ----------------------------
  function renderHome() {
    const totalTopics = app.topics.length;

    setView(`
      <div class="max-w-6xl mx-auto p-4 sm:p-6">
        <div class="rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-brand-card shadow-xl">
          <div class="p-6 bg-gradient-to-r from-brand-blue/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-emerald-500/10">
            <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                  <span class="lang-es">Dashboard</span><span class="lang-en hidden-lang">Dashboard</span>
                </h1>
                <p class="text-gray-600 dark:text-gray-300 mt-1">
                  <span class="lang-es">Busca un tema o una pregunta del simulador.</span>
                  <span class="lang-en hidden-lang">Search a topic or a simulator question.</span>
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <button onclick="window.nclexApp.navigate('simulator')" class="px-5 py-2.5 rounded-2xl bg-brand-blue text-white font-black shadow hover:shadow-lg transition">
                  <span class="lang-es">Ir al Simulador</span><span class="lang-en hidden-lang">Go to Simulator</span>
                </button>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <div class="text-xs font-bold text-gray-600 dark:text-gray-300">
                <span class="lang-es">Temas cargados:</span><span class="lang-en hidden-lang">Topics loaded:</span>
                <span id="topics-count" class="font-black">${totalTopics}</span>
              </div>
            </div>

            <div class="mt-5">
              <input id="dashboard-search" type="text" placeholder="${escapeHtml(t('Buscar… (tema o pregunta)', 'Search… (topic or question)'))}"
                class="w-full px-5 py-3 rounded-2xl bg-white/80 dark:bg-black/20 border border-white/60 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
              <div id="dashboard-search-results" class="mt-3 hidden"></div>
            </div>
          </div>
        </div>
      </div>
    `);

    initHomeSearch();
  }

  function renderTopics() {
    renderHome();
  }

  function renderTopicDetail(topicId) {
    const topic = app.topics.find(t => t.id === topicId);
    if (!topic) {
      setView(`<div class="p-6 text-red-600 dark:text-red-300 font-bold">Topic not found: ${escapeHtml(topicId)}</div>`);
      return;
    }

    localStorage.setItem(LAST_TOPIC_KEY, topicId);

    // ✅ NUEVO: si el tema trae render() (como 01_newborn.js) lo usamos
    if (typeof topic.render === 'function') {
      setView(`
        <div class="max-w-7xl mx-auto p-4 sm:p-6">
          <div class="flex items-center justify-between gap-2 mb-6">
            <button onclick="window.nclexApp.navigate('home')" class="px-4 py-2 rounded-2xl bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white font-black hover:opacity-90 transition">
              <span class="lang-es">← Volver</span><span class="lang-en hidden-lang">← Back</span>
            </button>

            <button onclick="window.nclexApp.navigate('simulator')" class="px-4 py-2 rounded-2xl bg-brand-blue text-white font-black shadow hover:shadow-lg transition">
              <span class="lang-es">Simulador</span><span class="lang-en hidden-lang">Simulator</span>
            </button>
          </div>

          ${topic.render()}
        </div>
      `);
      return;
    }

    // ✅ fallback: formato antiguo por bloques
    const blocks = (topic.content || []).map(block => `
      <div class="p-5 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-brand-card shadow-sm">
        <div class="font-black text-gray-900 dark:text-white text-lg mb-2">
          <span class="lang-es">${escapeHtml(block.titleEs || '')}</span>
          <span class="lang-en hidden-lang">${escapeHtml(block.titleEn || block.titleEs || '')}</span>
        </div>
        <div class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
          <div class="lang-es">${block.contentEs || ''}</div>
          <div class="lang-en hidden-lang">${block.contentEn || block.contentEs || ''}</div>
        </div>
      </div>
    `).join('');

    setView(`
      <div class="max-w-5xl mx-auto p-4 sm:p-6">
        <div class="flex items-center justify-between gap-2 mb-4">
          <button onclick="window.nclexApp.navigate('home')" class="px-4 py-2 rounded-2xl bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white font-black hover:opacity-90 transition">
            <span class="lang-es">← Volver</span><span class="lang-en hidden-lang">← Back</span>
          </button>

          <button onclick="window.nclexApp.navigate('simulator')" class="px-4 py-2 rounded-2xl bg-brand-blue text-white font-black shadow hover:shadow-lg transition">
            <span class="lang-es">Simulador</span><span class="lang-en hidden-lang">Simulator</span>
          </button>
        </div>

        <div class="rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-brand-card shadow-xl">
          <div class="p-6 bg-gradient-to-r from-brand-blue/10 to-purple-500/10 dark:from-blue-500/10 dark:to-purple-500/10 border-b border-gray-200 dark:border-white/10">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                <i class="fa-solid fa-${normalizeFaIcon(topic.icon) || 'book-medical'} text-brand-blue"></i>
              </div>
              <div>
                <div class="text-2xl font-black text-gray-900 dark:text-white">
                  <span class="lang-es">${escapeHtml(topic.titleEs || '')}</span>
                  <span class="lang-en hidden-lang">${escapeHtml(topic.titleEn || topic.titleEs || '')}</span>
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  ${(topic.tags || []).map(tag => `<span class="inline-flex px-3 py-1 rounded-full bg-white/70 dark:bg-black/20 border border-white/60 dark:border-white/10 font-bold mr-2">${escapeHtml(tag)}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 space-y-4">
            ${blocks}
          </div>
        </div>
      </div>
    `);
  }

  function renderSimulator() {
    if (window.renderSimulatorPage) {
      setView(window.renderSimulatorPage());
    } else {
      setView(`<div class="p-6">Simulator not loaded.</div>`);
    }
  }

  function updateNavActive(route, payload) {
    const navButtons = $$('[data-route]');
    navButtons.forEach(btn => {
      const r = btn.getAttribute('data-route');
      if (r !== route) {
        btn.classList.remove('active');
        return;
      }

      // ruta topic: activa solo el topic correcto
      if (route === 'topic') {
        const tid = btn.getAttribute('data-topic-id');
        if (tid && payload?.id === tid) btn.classList.add('active');
        else btn.classList.remove('active');
        return;
      }

      btn.classList.add('active');
    });
  }

  app.navigate = function (route, payload) {
    app.currentRoute = route;
    app._lastPayload = payload || null;
    updateNavActive(route, payload);

    if (route === 'home') renderHome();
    else if (route === 'topics') renderTopics();
    else if (route === 'topic') renderTopicDetail(payload?.id);
    else if (route === 'simulator') renderSimulator();
    else renderHome();
  };

  // ✅ NUEVO: botones del sidebar ahora sí funcionan
  app.toggleLanguage = function () {
    const newLang = getLang() === 'es' ? 'en' : 'es';
    setLang(newLang);
    applyGlobalLanguage();
    renderSidebarTopics();
    // re-render de la ruta actual para placeholders/textos
    app.navigate(app.currentRoute, app._lastPayload);
  };

  app.toggleTheme = function () {
    toggleTheme();
  };

  // Atajo: navegar a una pregunta del simulador desde la búsqueda
  app.navigateToQuestion = function (index) {
    app.navigate('simulator');
    setTimeout(() => {
      if (typeof window.showSimulatorQuestion === 'function') {
        window.showSimulatorQuestion(index);
      }
    }, 50);
  };

  app.getTopics = function () {
    return app.topics || [];
  };

  // ----------------------------
  // Sidebar Search (desactivado aquí)
  // ----------------------------
  function initSearch() {
    // Sidebar search is handled by 31_search_service.js (SearchService). Avoid double-binding.
    return;
  }

  // --- BUSCADOR DE PÁGINA PRINCIPAL (INTELIGENTE) ---
  function initHomeSearch() {
    const input = $('#dashboard-search');
    const resultsContainer = $('#dashboard-search-results');
    if (!input || !resultsContainer) return;

    const handle = () => {
      const term = input.value.trim();
      if (!term) {
        resultsContainer.classList.add('hidden');
        resultsContainer.innerHTML = '';
        return;
      }
      performHomeSearch(term, resultsContainer);
    };

    input.addEventListener('input', debounce(handle, 160));
  }

  function performHomeSearch(term, resultsContainer) {
    const qTerm = (term || '').toLowerCase().trim();
    const searchResults = [];

    // 1) Preguntas del simulador (Google Sheet)
    if (window.SIMULATOR_QUESTIONS && Array.isArray(window.SIMULATOR_QUESTIONS)) {
      window.SIMULATOR_QUESTIONS.forEach((q, idx) => {
        let score = 0;
        const matches = [];

        const textCore = (q.textEs || q.textEn || q.text || '').toString().toLowerCase();
        const rationaleCore = (q.rationaleEs || q.rationaleEn || q.explanation || '').toString().toLowerCase();
        const catCore = (q.category || '').toString().toLowerCase();

        const optionsCore = Array.isArray(q.options)
          ? q.options.map(o => (o.textEs || o.textEn || o.text || '')).join(' ').toString().toLowerCase()
          : '';

        const tags = (q.tags || []).map(tg => (tg || '').toString().toLowerCase());

        if (textCore.includes(qTerm)) { score += 10; matches.push('question'); }
        if (optionsCore.includes(qTerm)) { score += 6; matches.push('options'); }
        if (rationaleCore.includes(qTerm)) { score += 4; matches.push('rationale'); }
        if (catCore.includes(qTerm)) { score += 2; matches.push('category'); }

        const tagMatches = tags.filter(tag => tag.includes(qTerm));
        if (tagMatches.length > 0) { score += tagMatches.length * 2; matches.push(`tags (${tagMatches.length} matches)`); }

        if (score > 0) {
          const titleEsRaw = (q.textEs || q.text || q.textEn || '').toString();
          const titleEnRaw = (q.textEn || q.text || q.textEs || '').toString();
          const cut = (s) => {
            const tt = (s || '').toString().trim();
            return tt.length > 90 ? (tt.slice(0, 90) + '...') : tt;
          };

          const cat = (q.category || '').toString().trim();
          searchResults.push({
            type: 'question',
            question: q,
            index: idx,
            score,
            matches,
            title: { es: cut(titleEsRaw), en: cut(titleEnRaw) },
            subtitle: {
              es: cat ? `Simulador • ${cat}` : 'Pregunta del Simulador',
              en: cat ? `Simulator • ${cat}` : 'Simulator Question'
            },
            color: 'purple'
          });
        }
      });
    }

    // 2) Temas (texto completo)
    const textMatches = SmartTextIndex.search(qTerm);
    textMatches.forEach(m => {
      const topic = m.topic;
      const titleEs = topic.titleEs || '';
      const titleEn = topic.titleEn || titleEs || '';
      const subtitleEs = (topic.tags || []).slice(0, 3).join(' • ');
      const subtitleEn = subtitleEs;

      searchResults.push({
        type: 'topic',
        topic,
        score: m.score,
        matches: ['topic-text'],
        title: { es: titleEs, en: titleEn },
        subtitle: { es: subtitleEs, en: subtitleEn },
        color: 'blue'
      });
    });

    // Ordenar por score
    searchResults.sort((a, b) => b.score - a.score);

    // Render cards
    const cards = searchResults.slice(0, 12).map(result => {
      const isTopic = result.type === 'topic';
      const icon = isTopic ? normalizeFaIcon(result.topic.icon) : 'brain';
      const badge = isTopic
        ? `<span class="inline-flex px-3 py-1 rounded-full text-[11px] font-black bg-blue-500/15 text-blue-700 dark:text-blue-200 dark:bg-blue-500/15">${t('Tema', 'Topic')}</span>`
        : `<span class="inline-flex px-3 py-1 rounded-full text-[11px] font-black bg-purple-500/15 text-purple-700 dark:text-purple-200 dark:bg-purple-500/15">${t('Pregunta', 'Question')}</span>`;

      const onClick = isTopic
        ? `window.nclexApp.navigate('topic', {id: '${escapeHtml(result.topic.id)}'})`
        : `window.nclexApp.navigateToQuestion(${result.index})`;

      return `
        <button onclick="${onClick}"
          class="w-full text-left p-4 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-brand-card hover:shadow-lg transition">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center">
              <i class="fa-solid fa-${icon} text-${result.color === 'purple' ? 'purple-500' : 'brand-blue'}"></i>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                ${badge}
                <div class="text-xs text-gray-500 dark:text-gray-300 font-bold">${Math.round(result.score)}</div>
              </div>
              <div class="mt-1 font-black text-gray-900 dark:text-white leading-tight">
                <span class="lang-es">${escapeHtml(result.title.es || '')}</span>
                <span class="lang-en hidden-lang">${escapeHtml(result.title.en || result.title.es || '')}</span>
              </div>
              <div class="mt-1 text-xs text-gray-600 dark:text-gray-300">
                <span class="lang-es">${escapeHtml(result.subtitle.es || '')}</span>
                <span class="lang-en hidden-lang">${escapeHtml(result.subtitle.en || result.subtitle.es || '')}</span>
              </div>
            </div>
          </div>
        </button>
      `;
    }).join('');

    resultsContainer.innerHTML = `
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        ${cards || `<div class="text-sm text-gray-600 dark:text-gray-300">${t('Sin resultados.', 'No results.')}</div>`}
      </div>
    `;
    resultsContainer.classList.remove('hidden');
    applyGlobalLanguage(resultsContainer);
  }

  // ----------------------------
  // Helpers
  // ----------------------------
  function debounce(fn, wait = 200) {
    let tId;
    return function (...args) {
      clearTimeout(tId);
      tId = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // ----------------------------
  // Bootstrap
  // ----------------------------
  function init() {
    applyTheme(getTheme());
    setLang(getLang());
    initSearch();
    applyGlobalLanguage();

    // Render sidebar topics (ya deberían estar registrados cuando dispare DOMContentLoaded)
    renderSidebarTopics();
    updateHomeTopicsCount();

    // Ruta inicial
    const initial = app.currentRoute || 'home';
    app.navigate(initial, app._lastPayload);

    // Botones UI globales (si existen)
    const langBtn = $('#lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        app.toggleLanguage();
      });
    }

    const themeBtn = $('#theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => app.toggleTheme());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
