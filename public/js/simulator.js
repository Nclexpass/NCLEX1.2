/* simulator.js — Motor Cloud FINAL (PROD)
   - UI Estética + Multi-Selección de Temas
   - CSV parser robusto (comillas + saltos de línea)
   - Handlers seguros (sin JSON.stringify en onclick)
*/

(function () {
  'use strict';

  // --- CONFIGURACIÓN ---
  const SHEET_ID = "2PACX-1vTuJc6DOuIIYv9jOERaUMa8yoo0ZFJY9BiVrvFU7Qa2VMJHGfP_i5C8RZpmXo41jg49IUjDP8lT_ze0";
  const GOOGLE_CSV_URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?output=csv`;

  // Debug: cambia a true si quieres logs detallados
  const DEBUG = false;

  const STORAGE = {
    lang: 'nclex_lang',
    selectedCats: 'nclex_sim_selected_cats',
    limit: 'nclex_sim_limit',
    font: 'nclex_sim_font'
  };

  // --- ESTADO ---
  const state = {
    allQuestions: [],
    activeSession: [],
    currentIndex: 0,
    score: 0,
    userSelection: [],
    isLoading: true,
    categories: {},
    error: null,
    limit: 10,
    fontSize: 1,
    isRationaleMode: false,
    lastSubmitted: null,
    selectedCategories: [],
    pendingShowQuestionIndex: null
  };

  // --- LOGS ---
  const log = (...a) => { if (DEBUG) console.log(...a); };
  const warn = (...a) => { if (DEBUG) console.warn(...a); };
  const errLog = (...a) => { console.error(...a); };

  // --- HELPERS ---
  function getLang() {
    try { return localStorage.getItem(STORAGE.lang) || 'es'; }
    catch (_) { return 'es'; }
  }

  function bilingual(es, en) {
    return `<span class="lang-es">${es || ''}</span><span class="lang-en hidden-lang">${en || es || ''}</span>`;
  }

  function applyGlobalLanguage(root) {
    try {
      const currentLang = getLang();
      const isEs = currentLang === 'es';
      document.documentElement.lang = currentLang;

      const scope = root || document;
      scope.querySelectorAll('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      scope.querySelectorAll('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
    } catch (_) {}
  }

  function normalizeKey(s) {
    return (s || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  function escapeHtml(s) {
    return (s || '').toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Para strings dentro de atributos onclick='...'
  function escapeJsString(s) {
    return (s || '').toString()
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
  }

  // Permite un set MUY básico de tags; todo lo demás se escapa.
  function safeRichText(input) {
    const raw = (input || '').toString();
    const escaped = escapeHtml(raw).replace(/\n/g, '<br>');

    // Re-habilitar tags comunes si venían en el texto (como &lt;br&gt;)
    return escaped
      .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
      .replace(/&lt;(\/?)strong&gt;/gi, '<$1strong>')
      .replace(/&lt;(\/?)b&gt;/gi, '<$1b>')
      .replace(/&lt;(\/?)em&gt;/gi, '<$1em>')
      .replace(/&lt;(\/?)i&gt;/gi, '<$1i>')
      .replace(/&lt;(\/?)u&gt;/gi, '<$1u>');
  }

  function isOnSimulatorRoute() {
    // Detecta el estado del nav (logic.js marca el botón activo con bg-gray-100 / bg-white/10)
    const btn = document.querySelector('.nav-btn[data-route="simulator"]');
    if (!btn) return false;
    return btn.classList.contains('bg-gray-100') || btn.classList.contains('bg-white/10') || btn.classList.contains('text-brand-blue') || btn.classList.contains('text-white');
  }

  function scrollToTop() {
    if (typeof window.scrollToTop === 'function') {
      window.scrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // --- CSV PARSER ROBUSTO (comillas + saltos de línea) ---
  function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuote = false;

    const src = (text || '').toString().replace(/\r/g, '');

    for (let i = 0; i < src.length; i++) {
      const ch = src[i];
      const nx = src[i + 1];

      if (inQuote) {
        if (ch === '"') {
          if (nx === '"') { field += '"'; i++; }
          else { inQuote = false; }
        } else {
          field += ch;
        }
      } else {
        if (ch === '"') {
          inQuote = true;
        } else if (ch === ',') {
          row.push(field.trim());
          field = '';
        } else if (ch === '\n') {
          row.push(field.trim());
          if (row.some(c => (c || '').toString().trim() !== '')) rows.push(row);
          row = [];
          field = '';
        } else {
          field += ch;
        }
      }
    }

    // última celda/fila
    row.push(field.trim());
    if (row.some(c => (c || '').toString().trim() !== '')) rows.push(row);

    return rows;
  }

  // --- CONEXIÓN RESILIENTE (CORS proxies) ---
  async function fetchWithFallback(url) {
    const strategies = [
      { name: "Direct", url },
      { name: "Primary Proxy", url: `https://corsproxy.io/?${encodeURIComponent(url)}` },
      { name: "Backup Proxy", url: `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` }
    ];

    let lastError = null;
    for (const strategy of strategies) {
      try {
        log(`Attempting connection via ${strategy.name}...`);

        const cacheBuster = strategy.url.includes('?') ? `&t=${Date.now()}` : `?t=${Date.now()}`;
        const response = await fetch(strategy.url + cacheBuster, { cache: 'no-store' });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const text = await response.text();
        const trimmed = text.trim();
        const low = trimmed.slice(0, 300).toLowerCase();

        // Evitar páginas HTML de error / auth
        if (trimmed.startsWith('<') && (low.includes('<!doctype') || low.includes('<html'))) {
          throw new Error("Invalid HTML response");
        }
        // CSV mínimo
        if (trimmed.length < 20) throw new Error("Response too short");

        return text;
      } catch (e) {
        warn(`Strategy ${strategy.name} failed:`, e);
        lastError = e;
      }
    }
    throw lastError;
  }

  // --- ENCONTRAR ÍNDICE DE COLUMNA POR NOMBRE (normalizado) ---
  function findColumnIndex(headers, possibleNames) {
    const possibles = (possibleNames || []).map(normalizeKey).filter(Boolean);

    for (let i = 0; i < headers.length; i++) {
      const h = normalizeKey(headers[i]);
      if (!h) continue;

      for (const p of possibles) {
        if (h === p || h.includes(p) || p.includes(h)) return i;
      }
    }
    return -1;
  }

  function looksLikeHeaderRow(headers, columnDefinitions) {
    let matches = 0;
    for (const def of columnDefinitions) {
      const idx = findColumnIndex(headers, def.possible);
      if (idx !== -1) matches++;
    }
    return matches >= 3;
  }

  // --- PARSER DE RESPUESTAS CORRECTAS (A/B/C/D, 1/2/3/4, "A and C", "A/C", etc.) ---
  function parseCorrectLetters(correctRaw) {
    const raw = (correctRaw || '').toString().toLowerCase();

    const cleaned = raw
      .replace(/\b(and|y)\b/gi, ' ')
      .replace(/[()\[\]\.]/g, ' ')
      .replace(/[^a-d0-4,;|\/\s]/g, ' ');

    const tokens = cleaned
      .split(/[,;|\/\s]+/)
      .map(t => t.trim())
      .filter(Boolean);

    const mapped = tokens
      .map(t => {
        if (['a', 'b', 'c', 'd'].includes(t)) return t;
        if (['1', '2', '3', '4'].includes(t)) return ['a', 'b', 'c', 'd'][Number(t) - 1];
        return null;
      })
      .filter(Boolean);

    return Array.from(new Set(mapped));
  }

  function getValue(cols, idx) {
    if (typeof idx !== 'number' || idx < 0 || idx >= cols.length) return '';
    return (cols[idx] ?? '').toString();
  }

  // --- SHUFFLE (Fisher-Yates) ---
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  // --- PARSER CON CABECERAS Y MAPEO INTELIGENTE ---
  function parseAndLoad(csvText) {
    try {
      const table = parseCSV(csvText);
      if (!table || table.length < 2) throw new Error("CSV vacío o insuficiente");

      const headers = table[0];

      const columnDefinitions = [
        { field: 'id',          possible: ['id', 'questionid', 'code', 'codigo'], defaultIdx: 0, optional: false },
        { field: 'category',    possible: ['category', 'categoria', 'categoría', 'cat', 'tema', 'topic'], defaultIdx: 1, optional: false },

        { field: 'textEs',      possible: ['textEs','text_es','textoEs','texto_es','preguntaEs','pregunta_es','questionEs','question_es','question es','pregunta es','spanish'], defaultIdx: 2, optional: false },
        { field: 'textEn',      possible: ['textEn','text_en','textoEn','texto_en','preguntaEn','pregunta_en','questionEn','question_en','question en','english'], defaultIdx: 3, optional: true },

        { field: 'optAEs',      possible: ['optAEs','opt_a_es','aEs','a_es','optionAEs','option_a_es','option a es','opcion a es'], defaultIdx: 4, optional: false },
        { field: 'optAEn',      possible: ['optAEn','opt_a_en','aEn','a_en','optionAEn','option_a_en','option a en'], defaultIdx: 5, optional: true },

        { field: 'optBEs',      possible: ['optBEs','opt_b_es','bEs','b_es','optionBEs','option_b_es','option b es','opcion b es'], defaultIdx: 6, optional: false },
        { field: 'optBEn',      possible: ['optBEn','opt_b_en','bEn','b_en','optionBEn','option_b_en','option b en'], defaultIdx: 7, optional: true },

        { field: 'optCEs',      possible: ['optCEs','opt_c_es','cEs','c_es','optionCEs','option_c_es','option c es','opcion c es'], defaultIdx: 8, optional: false },
        { field: 'optCEn',      possible: ['optCEn','opt_c_en','cEn','c_en','optionCEn','option_c_en','option c en'], defaultIdx: 9, optional: true },

        { field: 'optDEs',      possible: ['optDEs','opt_d_es','dEs','d_es','optionDEs','option_d_es','option d es','opcion d es'], defaultIdx: 10, optional: true },
        { field: 'optDEn',      possible: ['optDEn','opt_d_en','dEn','d_en','optionDEn','option_d_en','option d en'], defaultIdx: 11, optional: true },

        { field: 'correct',     possible: ['correct','correcta','correctas','answer','answers','key','respuesta','respuestas','respuesta correcta'], defaultIdx: 12, optional: false },

        { field: 'rationaleEs', possible: ['rationaleEs','rationale_es','explicacionEs','explicacion_es','explicación es','feedback es','rationale es','rationale','explicacion','explicación','explanation','feedback'], defaultIdx: 13, optional: true },
        { field: 'rationaleEn', possible: ['rationaleEn','rationale_en','explicacionEn','explicacion_en','explicación en','feedback en','rationale en','rationale','explicacion','explicación','explanation','feedback'], defaultIdx: 14, optional: true },

        { field: 'type',        possible: ['type','tipo','format','formato','questiontype'], defaultIdx: 15, optional: true }
      ];

      const hasHeaders = looksLikeHeaderRow(headers, columnDefinitions);

      const colMap = {};
      let dataStartRow = 0;

      if (hasHeaders) {
        columnDefinitions.forEach(def => {
          const idx = findColumnIndex(headers, def.possible);
          colMap[def.field] = idx !== -1 ? idx : (def.optional ? -1 : def.defaultIdx);
          if (idx === -1 && !def.optional) {
            warn(`Columna "${def.field}" no encontrada, usando índice por defecto ${def.defaultIdx}`);
          }
        });
        dataStartRow = 1;
      } else {
        warn("No se detectaron cabeceras, usando orden fijo de columnas (compatibilidad)");
        columnDefinitions.forEach(def => { colMap[def.field] = def.defaultIdx; });
        dataStartRow = 0;
      }

      const parsed = [];

      for (let i = dataStartRow; i < table.length; i++) {
        const cols = table[i];
        if (!cols || cols.length === 0) continue;

        try {
          const id = (getValue(cols, colMap.id) || `q_${i}`).trim() || `q_${i}`;
          const category = (getValue(cols, colMap.category) || 'General').trim() || 'General';

          const textEs = getValue(cols, colMap.textEs);
          const textEn = getValue(cols, colMap.textEn) || textEs;

          const optAEs = getValue(cols, colMap.optAEs);
          const optAEn = getValue(cols, colMap.optAEn) || optAEs;

          const optBEs = getValue(cols, colMap.optBEs);
          const optBEn = getValue(cols, colMap.optBEn) || optBEs;

          const optCEs = getValue(cols, colMap.optCEs);
          const optCEn = getValue(cols, colMap.optCEn) || optCEs;

          const optDEs = getValue(cols, colMap.optDEs);
          const optDEn = getValue(cols, colMap.optDEn) || optDEs;

          const correctRaw = getValue(cols, colMap.correct);
          const rationaleEs = getValue(cols, colMap.rationaleEs);
          const rationaleEn = getValue(cols, colMap.rationaleEn) || rationaleEs;
          const typeRaw = getValue(cols, colMap.type);

          const correctLetters = parseCorrectLetters(correctRaw);

          if (correctLetters.length === 0) {
            warn(`Pregunta ${id} omitida: no tiene respuestas correctas válidas.`);
            continue;
          }

          const options = [
            { id: 'a', textEs: optAEs, textEn: optAEn, correct: correctLetters.includes('a') },
            { id: 'b', textEs: optBEs, textEn: optBEn, correct: correctLetters.includes('b') },
            { id: 'c', textEs: optCEs, textEn: optCEn, correct: correctLetters.includes('c') },
            { id: 'd', textEs: optDEs, textEn: optDEn, correct: correctLetters.includes('d') }
          ].filter(o => ((o.textEs || o.textEn || '').trim() !== ''));

          if ((!textEs && !textEn) || options.length < 2) continue;

          const lowerType = (typeRaw || '').toLowerCase();
          const inferredSata =
            lowerType.includes('sata') ||
            lowerType.includes('selectall') ||
            lowerType.includes('select all') ||
            correctLetters.length > 1 ||
            ((textEs || '').toLowerCase().includes('selecciona todas') || (textEn || '').toLowerCase().includes('select all'));

          parsed.push({
            id,
            category,
            textEs,
            textEn,
            options,
            rationaleEs,
            rationaleEn,
            type: inferredSata ? 'sata' : 'single',
            tags: [category, typeRaw].filter(Boolean)
          });
        } catch (e) {
          warn("Error parseando fila", i, e);
        }
      }

      if (parsed.length === 0) throw new Error("No se pudo cargar ninguna pregunta válida.");

      state.allQuestions = parsed;

      state.categories = {};
      parsed.forEach(q => {
        const cat = (q.category || 'General').trim() || 'General';
        state.categories[cat] = (state.categories[cat] || 0) + 1;
      });

      // Reconciliar selecciones guardadas
      const existingCats = new Set(Object.keys(state.categories));
      state.selectedCategories = (state.selectedCategories || []).filter(c => existingCats.has(c));

      window.SIMULATOR_QUESTIONS = parsed;
      state.isLoading = false;
      state.error = null;

      // Si había un "jump to question" pendiente
      if (typeof state.pendingShowQuestionIndex === 'number') {
        const idx = state.pendingShowQuestionIndex;
        state.pendingShowQuestionIndex = null;
        showQuestionByIndex(idx);
        return;
      }

      checkAndRender();

    } catch (parseError) {
      errLog("Error en parseAndLoad:", parseError);
      state.error = "Error de formato en la base de datos. Verifica que las columnas sean correctas.";
      state.isLoading = false;
      checkAndRender();
    }
  }

  // --- PERSISTENCIA ---
  function loadPrefs() {
    try {
      const rawCats = localStorage.getItem(STORAGE.selectedCats);
      if (rawCats) {
        const parsed = JSON.parse(rawCats);
        if (Array.isArray(parsed)) state.selectedCategories = parsed.filter(Boolean).map(String);
      }
      const rawLimit = localStorage.getItem(STORAGE.limit);
      if (rawLimit) {
        const n = Number(rawLimit);
        if (Number.isFinite(n) && n > 0) state.limit = Math.max(1, Math.floor(n));
      }
      const rawFont = localStorage.getItem(STORAGE.font);
      if (rawFont) {
        const f = Number(rawFont);
        if (Number.isFinite(f)) state.fontSize = Math.max(0.8, Math.min(1.6, f));
      }
    } catch (_) {}
  }

  function savePrefs() {
    try {
      localStorage.setItem(STORAGE.selectedCats, JSON.stringify(state.selectedCategories || []));
      localStorage.setItem(STORAGE.limit, String(state.limit || 10));
      localStorage.setItem(STORAGE.font, String(state.fontSize || 1));
    } catch (_) {}
  }

  // --- CARGA PRINCIPAL ---
  async function loadQuestions() {
    state.isLoading = true;
    state.error = null;
    checkAndRender();
    try {
      const csvData = await fetchWithFallback(GOOGLE_CSV_URL);
      parseAndLoad(csvData);
    } catch (e) {
      errLog("🔥 Simulator Critical Failure:", e);
      state.error = `Error de conexión: no se pudo acceder a la base de datos.<br><span class="text-xs text-gray-400">${(e && e.message) ? escapeHtml(e.message) : 'Unknown error'}</span>`;
      state.isLoading = false;
      checkAndRender();
    }
  }

  // --- ICONOS Y ESTILOS ---
  function getCategoryStyle(catName) {
    const n = (catName || '').toLowerCase();
    if (n.includes('newborn') || n.includes('neo')) return { i: 'baby', c: 'text-pink-400', badge: 'bg-pink-500/10 text-pink-600 dark:text-pink-200 dark:bg-pink-500/10' };
    if (n.includes('matern') || n.includes('labor')) return { i: 'person-pregnant', c: 'text-rose-500', badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-200 dark:bg-rose-500/10' };
    if (n.includes('pediat')) return { i: 'child-reaching', c: 'text-yellow-500', badge: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-200 dark:bg-yellow-500/10' };
    if (n.includes('cardio')) return { i: 'heart-pulse', c: 'text-red-500', badge: 'bg-red-500/10 text-red-600 dark:text-red-200 dark:bg-red-500/10' };
    if (n.includes('respir')) return { i: 'lungs', c: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-200 dark:bg-blue-500/10' };
    if (n.includes('neuro') || n.includes('psych')) return { i: 'brain', c: 'text-purple-500', badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-200 dark:bg-purple-500/10' };
    if (n.includes('pharm')) return { i: 'pills', c: 'text-indigo-500', badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-200 dark:bg-indigo-500/10' };
    if (n.includes('infect') || n.includes('safety')) return { i: 'shield-virus', c: 'text-green-500', badge: 'bg-green-500/10 text-green-600 dark:text-green-200 dark:bg-green-500/10' };
    return { i: 'notes-medical', c: 'text-brand-blue', badge: 'bg-brand-blue/10 text-brand-blue dark:text-blue-200 dark:bg-blue-500/10' };
  }

  function getClinicalTip(category) {
    const n = (category || '').toLowerCase();
    if (n.includes('pharm')) return bilingual("💊 <strong>Tip:</strong> Contraindicaciones + niveles terapéuticos.", "💊 <strong>Tip:</strong> Contraindications + therapeutic levels.");
    if (n.includes('priorit')) return bilingual("🚨 <strong>Tip:</strong> ¿Quién muere si no actúas AHORA?", "🚨 <strong>Tip:</strong> Who dies if you don't act NOW?");
    if (n.includes('infect')) return bilingual("🦠 <strong>Tip:</strong> Contacto, Gotas o Aire → PPE.", "🦠 <strong>Tip:</strong> Contact, Droplet, Airborne → PPE.");
    return bilingual("🧠 <strong>Estrategia:</strong> Lee la pregunta 2 veces.", "🧠 <strong>Strategy:</strong> Read the stem twice.");
  }

  // --- MULTI SELECT HELPERS ---
  function isSelectedCategory(cat) {
    return (state.selectedCategories || []).includes(cat);
  }

  function toggleSelectedCategory(cat) {
    const list = state.selectedCategories || [];
    if (list.includes(cat)) state.selectedCategories = list.filter(x => x !== cat);
    else state.selectedCategories = [...list, cat];
    savePrefs();
    renderNow();
  }

  function clearSelectedCategories() {
    state.selectedCategories = [];
    savePrefs();
    renderNow();
  }

  function selectAllCategories() {
    state.selectedCategories = Object.keys(state.categories || {}).sort();
    savePrefs();
    renderNow();
  }

  // --- QUIZ START HELPERS ---
  function startQuizWithCategories(catsArray) {
    const cats = Array.isArray(catsArray) ? catsArray.filter(Boolean) : [];
    const set = new Set(cats);

    let pool = [];
    if (set.size === 0) {
      pool = [...state.allQuestions];
    } else {
      pool = state.allQuestions.filter(q => set.has(q.category));
    }

    shuffle(pool);
    if (state.limit < pool.length) pool = pool.slice(0, state.limit);

    state.activeSession = pool;
    state.currentIndex = 0;
    state.score = 0;
    state.userSelection = [];
    state.isRationaleMode = false;
    state.lastSubmitted = null;

    renderNow();
  }

  // --- RENDERIZADO ---
  function checkAndRender() {
    if (isOnSimulatorRoute()) renderNow();
  }

  function renderNow() {
    const view = document.getElementById('app-view');
    scrollToTop();

    if (view && typeof window.renderSimulatorPage === 'function') {
      view.innerHTML = window.renderSimulatorPage();
      applyGlobalLanguage(view);
    }
  }

  function renderLoading() {
    return `
      <div class="p-6 max-w-5xl mx-auto">
        <div class="rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-card">
          <div class="p-6 bg-gradient-to-r from-brand-blue/10 to-purple-500/10 dark:from-blue-500/10 dark:to-purple-500/10 border-b border-slate-200 dark:border-white/10">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-white/10 animate-pulse"></div>
              <div class="flex-1">
                <div class="h-4 w-56 bg-slate-200 dark:bg-white/10 rounded animate-pulse mb-2"></div>
                <div class="h-3 w-80 bg-slate-200 dark:bg-white/10 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          <div class="p-6 space-y-3">
            <div class="h-12 bg-slate-200 dark:bg-white/10 rounded-2xl animate-pulse"></div>
            <div class="h-12 bg-slate-200 dark:bg-white/10 rounded-2xl animate-pulse"></div>
            <div class="h-12 bg-slate-200 dark:bg-white/10 rounded-2xl animate-pulse"></div>
            <div class="mt-3 text-sm text-slate-600 dark:text-slate-300">${bilingual("Cargando preguntas...", "Loading questions...")}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderError() {
    return `
      <div class="p-6 max-w-5xl mx-auto">
        <div class="rounded-3xl overflow-hidden shadow-xl border border-red-200 dark:border-red-900/30 bg-white dark:bg-brand-card">
          <div class="p-6 bg-red-50 dark:bg-red-900/10 border-b border-red-200 dark:border-red-900/30">
            <h2 class="text-2xl font-black text-red-600 dark:text-red-300">${bilingual("Error", "Error")}</h2>
            <div class="text-sm text-slate-700 dark:text-slate-200 mt-2">${state.error || ''}</div>
          </div>
          <div class="p-6 flex flex-wrap gap-2">
            <button onclick="window.simController.forceReload()" class="px-5 py-2.5 rounded-2xl bg-brand-blue text-white font-black shadow hover:shadow-lg transition">
              ${bilingual("Reintentar", "Retry")}
            </button>
            <button onclick="window.simController.quit()" class="px-5 py-2.5 rounded-2xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-black">
              ${bilingual("Volver", "Back")}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderLobby() {
    const cats = Object.keys(state.categories || {}).sort((a, b) => (state.categories[b] || 0) - (state.categories[a] || 0));
    const total = state.allQuestions.length;

    const selectedCount = (state.selectedCategories || []).length;
    const selectedLabel = selectedCount === 0
      ? bilingual("Ninguno seleccionado", "None selected")
      : bilingual(`${selectedCount} seleccionados`, `${selectedCount} selected`);

    const limitOptions = [10, 20, 30, 40, 50, 75, 100].map(n => {
      const active = state.limit === n;
      return `<button onclick="window.simController.setLimit(${n})"
        class="px-3 py-1.5 rounded-full text-xs font-black transition ${active ? 'bg-brand-blue text-white shadow' : 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white hover:opacity-90'}">${n}</button>`;
    }).join('');

    const selectedChips = (state.selectedCategories || []).slice(0, 8).map(cat => {
      const style = getCategoryStyle(cat);
      return `
        <button onclick="window.simController.toggleCategory('${escapeJsString(cat)}')"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black ${style.badge} border border-slate-200/50 dark:border-white/10 hover:opacity-90 transition">
          <i class="fa-solid fa-${style.i}"></i>
          ${escapeHtml(cat)}
          <span class="opacity-70">✕</span>
        </button>
      `;
    }).join('');

    const moreChip = (state.selectedCategories || []).length > 8
      ? `<span class="text-xs font-bold text-slate-500 dark:text-slate-300">+${(state.selectedCategories.length - 8)} más</span>`
      : '';

    const categoryCards = cats.map(cat => {
      const style = getCategoryStyle(cat);
      const count = state.categories[cat] || 0;
      const selected = isSelectedCategory(cat);

      const ring = selected ? 'ring-2 ring-brand-blue ring-offset-2 ring-offset-white dark:ring-offset-brand-card' : '';
      const bg = selected ? 'bg-brand-blue/5 dark:bg-brand-blue/10 border-brand-blue/40' : 'bg-white dark:bg-brand-card border-slate-200 dark:border-white/10';
      const check = selected
        ? `<span class="w-6 h-6 rounded-xl bg-brand-blue text-white inline-flex items-center justify-center text-xs font-black shadow">✓</span>`
        : `<span class="w-6 h-6 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 inline-flex items-center justify-center text-xs font-black">+</span>`;

      return `
        <div class="rounded-3xl border ${bg} shadow-sm hover:shadow-lg transition ${ring}">
          <button onclick="window.simController.toggleCategory('${escapeJsString(cat)}')" class="w-full text-left p-5">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                  <i class="fa-solid fa-${style.i} ${style.c}"></i>
                </div>
                <div>
                  <div class="font-black text-slate-900 dark:text-white leading-tight">${escapeHtml(cat)}</div>
                  <div class="mt-1 text-xs text-slate-600 dark:text-slate-300">${getClinicalTip(cat)}</div>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2">
                ${check}
                <span class="text-xs font-black px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200">${count}</span>
              </div>
            </div>
          </button>

          <div class="px-5 pb-5 -mt-2 flex items-center justify-between gap-2">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-300">
              ${selected ? bilingual("Incluido en mezcla", "Included in mix") : bilingual("Toca para agregar", "Tap to add")}
            </span>
            <button onclick="window.simController.startQuiz('${escapeJsString(cat)}')"
              class="px-4 py-2 rounded-2xl text-xs font-black bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white hover:opacity-90 transition">
              ${bilingual("Solo", "Only")}
            </button>
          </div>
        </div>
      `;
    }).join('');

    const canStartSelected = selectedCount > 0;

    return `
      <div class="p-6 max-w-6xl mx-auto">
        <header class="mb-6">
          <div class="rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-card">
            <div class="p-6 bg-gradient-to-r from-brand-blue/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-emerald-500/10">
              <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                    ${bilingual("Simulador NCLEX", "NCLEX Simulator")}
                  </h1>
                  <p class="text-slate-600 dark:text-slate-300 mt-1">
                    ${bilingual("Selecciona varios temas y mezcla preguntas.", "Select multiple topics and mix questions.")}
                  </p>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <button onclick="window.simController.startQuiz('ALL')" class="px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-black shadow hover:shadow-lg transition">
                    ${bilingual("Mixto total", "Full mix")}
                  </button>
                  <button onclick="window.simController.startSelected()"
                    class="px-5 py-2.5 rounded-2xl ${canStartSelected ? 'bg-brand-blue text-white shadow hover:shadow-lg' : 'bg-slate-300 dark:bg-white/10 text-slate-500 dark:text-slate-400 cursor-not-allowed'} font-black transition"
                    ${canStartSelected ? '' : 'disabled'}>
                    ${bilingual("Iniciar selección", "Start selection")}
                  </button>
                </div>
              </div>

              <div class="mt-4 flex flex-wrap items-center gap-2">
                <span class="text-xs font-black px-3 py-1.5 rounded-full bg-white/70 dark:bg-black/20 border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-200">
                  ${bilingual("Seleccionados:", "Selected:")} ${selectedLabel}
                </span>

                <button onclick="window.simController.selectAll()" class="px-3 py-1.5 rounded-full text-xs font-black bg-white/70 dark:bg-black/20 border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:opacity-90 transition">
                  ${bilingual("Seleccionar todo", "Select all")}
                </button>
                <button onclick="window.simController.clearSelected()" class="px-3 py-1.5 rounded-full text-xs font-black bg-white/70 dark:bg-black/20 border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:opacity-90 transition">
                  ${bilingual("Limpiar", "Clear")}
                </button>

                <span class="ml-auto text-xs font-bold text-slate-600 dark:text-slate-300">
                  ${bilingual("Preguntas cargadas:", "Loaded questions:")} <span class="font-black">${total}</span>
                </span>
              </div>

              ${(selectedCount > 0)
                ? `<div class="mt-3 flex flex-wrap items-center gap-2">${selectedChips}${moreChip}</div>`
                : `<div class="mt-3 text-xs text-slate-600 dark:text-slate-300">${bilingual("Tip: toca varias tarjetas para mezclar temas.", "Tip: tap multiple cards to mix topics.")}</div>`
              }
            </div>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div class="lg:col-span-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              ${categoryCards}
            </div>
          </div>

          <aside class="space-y-4 lg:sticky lg:top-4 h-fit">
            <div class="rounded-3xl shadow-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-card overflow-hidden">
              <div class="p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                <div class="font-black text-slate-900 dark:text-white">${bilingual("Configuración", "Settings")}</div>
                <div class="text-xs text-slate-600 dark:text-slate-300 mt-1">${bilingual("Ajusta tu práctica.", "Tune your practice.")}</div>
              </div>

              <div class="p-5">
                <div class="text-xs font-black text-slate-600 dark:text-slate-300 mb-2">${bilingual("Número de preguntas", "Questions count")}</div>
                <div class="flex flex-wrap gap-2">${limitOptions}</div>

                <div class="mt-5 text-xs font-black text-slate-600 dark:text-slate-300 mb-2">${bilingual("Tamaño de letra", "Font size")}</div>
                <div class="flex gap-2">
                  <button onclick="window.simController.adjustFont(-0.1)" class="px-4 py-2 rounded-2xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-black hover:opacity-90 transition">A-</button>
                  <button onclick="window.simController.adjustFont(0.1)" class="px-4 py-2 rounded-2xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-black hover:opacity-90 transition">A+</button>
                </div>

                <div class="mt-5 p-4 rounded-2xl bg-slate-900 text-white shadow-inner">
                  <div class="font-black">${bilingual("Modo mezcla", "Mix mode")}</div>
                  <div class="text-xs text-slate-200 mt-1">
                    ${bilingual("Selecciona temas y luego “Iniciar selección”.", "Select topics then “Start selection”.")}
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-3xl shadow-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-card overflow-hidden">
              <div class="p-5">
                <div class="font-black text-slate-900 dark:text-white">${bilingual("Acciones rápidas", "Quick actions")}</div>
                <div class="mt-3 grid grid-cols-1 gap-2">
                  <button onclick="window.simController.startQuiz('ALL')" class="px-5 py-3 rounded-2xl bg-slate-900 text-white font-black hover:opacity-90 transition">
                    ${bilingual("Mixto total", "Full mix")}
                  </button>
                  <button onclick="window.simController.startSelected()"
                    class="px-5 py-3 rounded-2xl ${canStartSelected ? 'bg-brand-blue text-white' : 'bg-slate-300 dark:bg-white/10 text-slate-500 dark:text-slate-400 cursor-not-allowed'} font-black transition"
                    ${canStartSelected ? '' : 'disabled'}>
                    ${bilingual("Iniciar selección", "Start selection")}
                  </button>
                  <button onclick="window.simController.clearSelected()" class="px-5 py-3 rounded-2xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-black hover:opacity-90 transition">
                    ${bilingual("Limpiar selección", "Clear selection")}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;
  }

  function renderActiveQuiz() {
    const q = state.activeSession[state.currentIndex];
    if (!q) return renderLobby();

    const current = state.currentIndex + 1;
    const total = state.activeSession.length;
    const progress = Math.round((current / Math.max(1, total)) * 100);

    const isSata = q.type === 'sata';
    const selected = new Set(state.userSelection || []);

    const optionButtons = q.options.map(opt => {
      const isSelected = selected.has(opt.id);

      const base = `w-full text-left p-4 rounded-3xl border transition`;
      const classes = isSelected
        ? `${base} border-brand-blue bg-brand-blue/10 dark:bg-brand-blue/20 shadow-sm`
        : `${base} border-slate-200 dark:border-white/10 bg-white dark:bg-brand-card hover:border-slate-300 dark:hover:border-white/20 hover:shadow-sm`;

      const badge = isSata
        ? `<span class="inline-flex items-center justify-center w-6 h-6 rounded-2xl border ${isSelected ? 'bg-brand-blue border-brand-blue text-white shadow' : 'border-slate-300 dark:border-white/20 text-slate-600 dark:text-slate-300'} text-xs font-black">${isSelected ? '✓' : ''}</span>`
        : `<span class="inline-flex items-center justify-center w-8 h-8 rounded-2xl ${isSelected ? 'bg-brand-blue text-white shadow' : 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white'} text-xs font-black">${opt.id.toUpperCase()}</span>`;

      return `
        <button onclick="window.simController.selectOption('${opt.id}')" class="${classes}">
          <div class="flex items-start gap-3">
            ${badge}
            <div class="flex-1" style="font-size:${state.fontSize}rem">
              ${bilingual(safeRichText(opt.textEs), safeRichText(opt.textEn))}
            </div>
          </div>
        </button>
      `;
    }).join('');

    const canSubmit = (state.userSelection || []).length > 0;

    return `
      <div class="p-6 max-w-5xl mx-auto">
        <div class="rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-card">
          <div class="p-6 bg-gradient-to-r from-brand-blue/10 to-purple-500/10 dark:from-blue-500/10 dark:to-purple-500/10 border-b border-slate-200 dark:border-white/10">
            <div class="flex items-center justify-between gap-3">
              <div class="text-sm font-black text-slate-700 dark:text-slate-200">
                ${bilingual("Pregunta", "Question")} ${current} / ${total}
                <span class="ml-2 text-xs px-3 py-1 rounded-full bg-white/70 dark:bg-black/20 border border-white/60 dark:border-white/10">${escapeHtml(q.category)}</span>
                <span class="ml-2 text-xs px-3 py-1 rounded-full ${isSata ? 'bg-purple-500/15 text-purple-700 dark:text-purple-200 dark:bg-purple-500/15' : 'bg-blue-500/15 text-blue-700 dark:text-blue-200 dark:bg-blue-500/15'}">
                  ${isSata ? bilingual("SATA", "SATA") : bilingual("Single", "Single")}
                </span>
              </div>
              <div class="text-xs font-black text-slate-700 dark:text-slate-200">${progress}%</div>
            </div>

            <div class="mt-3 h-2.5 rounded-full bg-white/60 dark:bg-white/10 overflow-hidden">
              <div class="h-full bg-brand-blue" style="width:${progress}%"></div>
            </div>
          </div>

          <div class="p-6">
            <div class="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-5"
              style="font-size:${Math.max(1.15, state.fontSize + 0.15)}rem">
              ${bilingual(safeRichText(q.textEs), safeRichText(q.textEn))}
            </div>

            <div class="space-y-3">
              ${optionButtons}
            </div>

            <div class="mt-6 flex flex-wrap gap-2">
              <button onclick="window.simController.quit()" class="px-5 py-2.5 rounded-2xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-black hover:opacity-90 transition">
                ${bilingual("Salir", "Quit")}
              </button>

              <button onclick="window.simController.submit()"
                class="px-5 py-2.5 rounded-2xl ${canSubmit ? 'bg-brand-blue text-white shadow hover:shadow-lg' : 'bg-slate-300 dark:bg-white/10 text-slate-500 dark:text-slate-400 cursor-not-allowed'} font-black transition"
                ${canSubmit ? '' : 'disabled'}>
                ${bilingual("Enviar", "Submit")}
              </button>
            </div>

            <div class="mt-4 text-xs text-slate-600 dark:text-slate-300">
              ${isSata ? bilingual("Selecciona TODAS las correctas.", "Select ALL that apply.") : bilingual("Selecciona UNA respuesta.", "Select ONE answer.")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderRationale() {
    const q = state.activeSession[state.currentIndex];
    if (!q) return renderLobby();

    const correctIds = q.options.filter(o => o.correct).map(o => o.id);
    const selected = state.userSelection || [];

    const isCorrect = (q.type === 'single')
      ? correctIds.includes(selected[0])
      : (correctIds.length === selected.length &&
         correctIds.every(i => selected.includes(i)) &&
         selected.every(i => correctIds.includes(i)));

    const optionCards = q.options.map(opt => {
      const picked = selected.includes(opt.id);
      const right = opt.correct;

      const border =
        right ? 'border-green-400 dark:border-green-700' :
        picked && !right ? 'border-red-400 dark:border-red-700' :
        'border-slate-200 dark:border-white/10';

      const bg =
        right ? 'bg-green-50 dark:bg-green-900/10' :
        picked && !right ? 'bg-red-50 dark:bg-red-900/10' :
        'bg-white dark:bg-brand-card';

      const tag =
        right ? `<span class="text-xs font-black px-3 py-1 rounded-full bg-green-600 text-white shadow">${bilingual("Correcta", "Correct")}</span>` :
        picked && !right ? `<span class="text-xs font-black px-3 py-1 rounded-full bg-red-600 text-white shadow">${bilingual("Tu elección", "Your pick")}</span>` :
        `<span class="text-xs font-black px-3 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200">${opt.id.toUpperCase()}</span>`;

      return `
        <div class="p-4 rounded-3xl border ${border} ${bg} shadow-sm">
          <div class="flex items-start gap-3">
            <div class="shrink-0">${tag}</div>
            <div class="flex-1" style="font-size:${state.fontSize}rem">
              ${bilingual(safeRichText(opt.textEs), safeRichText(opt.textEn))}
            </div>
          </div>
        </div>
      `;
    }).join('');

    const headerBadge = isCorrect
      ? `<div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-600 text-white text-sm font-black shadow">
            <i class="fa-solid fa-check"></i> ${bilingual("Correcto", "Correct")}
         </div>`
      : `<div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-600 text-white text-sm font-black shadow">
            <i class="fa-solid fa-xmark"></i> ${bilingual("Incorrecto", "Incorrect")}
         </div>`;

    const rationaleBlock = (q.rationaleEs || q.rationaleEn)
      ? `<div class="mt-5 p-5 rounded-3xl bg-slate-900 text-white shadow-inner">
          <div class="font-black text-lg mb-2">${bilingual("Razonamiento", "Rationale")}</div>
          <div class="text-sm text-slate-200" style="font-size:${Math.max(0.95, state.fontSize)}rem">
            ${bilingual(safeRichText(q.rationaleEs), safeRichText(q.rationaleEn))}
          </div>
        </div>`
      : '';

    return `
      <div class="p-6 max-w-5xl mx-auto">
        <div class="rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-card">
          <div class="p-6 bg-gradient-to-r from-slate-900/5 to-brand-blue/10 dark:from-white/5 dark:to-blue-500/10 border-b border-slate-200 dark:border-white/10">
            <div class="flex items-center justify-between gap-3">
              <div class="text-sm font-black text-slate-700 dark:text-slate-200">
                ${bilingual("Revisión", "Review")} • ${escapeHtml(q.category)} • ${q.type === 'sata' ? 'SATA' : 'Single'}
              </div>
              ${headerBadge}
            </div>
          </div>

          <div class="p-6">
            <div class="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-5"
              style="font-size:${Math.max(1.15, state.fontSize + 0.15)}rem">
              ${bilingual(safeRichText(q.textEs), safeRichText(q.textEn))}
            </div>

            <div class="space-y-3">
              ${optionCards}
            </div>

            ${rationaleBlock}

            <div class="mt-6 flex flex-wrap gap-2">
              <button onclick="window.simController.quit()" class="px-5 py-2.5 rounded-2xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-black hover:opacity-90 transition">
                ${bilingual("Salir", "Quit")}
              </button>

              <button onclick="window.simController.next()" class="px-5 py-2.5 rounded-2xl bg-brand-blue text-white font-black shadow hover:shadow-lg transition">
                ${bilingual("Siguiente", "Next")}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderResults() {
    const total = state.activeSession.length || 0;
    const score = state.score || 0;
    const pct = total ? Math.round((score / total) * 100) : 0;

    const msg = pct >= 80
      ? bilingual("Excelente. Estás listo.", "Excellent. You're ready.")
      : pct >= 65
        ? bilingual("Vas bien. Refuerza tus debilidades.", "Good progress. Reinforce weaknesses.")
        : bilingual("Necesitas más práctica. Sigue entrenando.", "You need more practice. Keep training.");

    return `
      <div class="p-6 max-w-4xl mx-auto">
        <div class="rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-card">
          <div class="p-6 bg-gradient-to-r from-emerald-500/10 to-brand-blue/10 dark:from-emerald-500/10 dark:to-blue-500/10 border-b border-slate-200 dark:border-white/10">
            <h2 class="text-3xl font-black text-slate-900 dark:text-white">${bilingual("Resultados", "Results")}</h2>
            <p class="text-slate-600 dark:text-slate-300 mt-1">${msg}</p>
          </div>

          <div class="p-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-5 rounded-3xl bg-slate-100 dark:bg-white/10">
              <div class="text-xs font-black text-slate-600 dark:text-slate-300">${bilingual("Puntaje", "Score")}</div>
              <div class="text-3xl font-black text-slate-900 dark:text-white">${score} / ${total}</div>
            </div>
            <div class="p-5 rounded-3xl bg-slate-100 dark:bg-white/10">
              <div class="text-xs font-black text-slate-600 dark:text-slate-300">${bilingual("Porcentaje", "Percent")}</div>
              <div class="text-3xl font-black text-slate-900 dark:text-white">${pct}%</div>
            </div>
            <div class="p-5 rounded-3xl bg-slate-900 text-white">
              <div class="text-xs font-black text-slate-200">${bilingual("Siguiente paso", "Next step")}</div>
              <div class="text-sm font-bold mt-1">
                ${bilingual("Mezcla temas y sube tu límite para más dificultad.", "Mix topics and increase your limit for more challenge.")}
              </div>
            </div>
          </div>

          <div class="p-6 pt-0 flex flex-wrap gap-2">
            <button onclick="window.simController.quit()" class="px-5 py-2.5 rounded-2xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-black hover:opacity-90 transition">
              ${bilingual("Volver al lobby", "Back to lobby")}
            </button>
            <button onclick="window.simController.startQuiz('ALL')" class="px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-black shadow hover:shadow-lg transition">
              ${bilingual("Repetir mixto total", "Retry full mix")}
            </button>
            <button onclick="window.simController.startSelected()"
              class="px-5 py-2.5 rounded-2xl ${((state.selectedCategories || []).length > 0) ? 'bg-brand-blue text-white shadow hover:shadow-lg' : 'bg-slate-300 dark:bg-white/10 text-slate-500 dark:text-slate-400 cursor-not-allowed'} font-black transition"
              ${((state.selectedCategories || []).length > 0) ? '' : 'disabled'}>
              ${bilingual("Repetir selección", "Retry selection")}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- FUNCIÓN DE RENDER EXPORTADA ---
  window.renderSimulatorPage = function () {
    if (state.isLoading) return renderLoading();
    if (state.error) return renderError();
    if (state.activeSession.length > 0 && state.isRationaleMode) return renderRationale();
    if (state.activeSession.length > 0) return renderActiveQuiz();
    return renderLobby();
  };

  // --- FLOW HELPERS ---
  function showQuestionByIndex(index) {
    const q = state.allQuestions[index];
    if (!q) return;

    state.activeSession = [q];
    state.currentIndex = 0;
    state.score = 0;
    state.userSelection = [];
    state.isRationaleMode = false;
    state.lastSubmitted = null;

    renderNow();
  }

  // --- CONTROLADOR GLOBAL ---
  window.simController = {
    setLimit(n) {
      state.limit = Math.max(1, Number(n) || 10);
      savePrefs();
      renderNow();
    },
    adjustFont(delta) {
      state.fontSize = Math.max(0.8, Math.min(1.6, state.fontSize + (Number(delta) || 0)));
      savePrefs();
      renderNow();
    },

    // compatibilidad: iniciar SOLO una categoría o ALL
    startQuiz(c) {
      if (c === 'ALL') startQuizWithCategories([]);
      else startQuizWithCategories([c]);
    },

    // multi-select
    toggleCategory(cat) { toggleSelectedCategory(cat); },
    clearSelected() { clearSelectedCategories(); },
    selectAll() { selectAllCategories(); },
    startSelected() { startQuizWithCategories(state.selectedCategories || []); },

    // quiz flow
    selectOption(id) {
      const q = state.activeSession[state.currentIndex];
      if (!q) return;

      if (q.type === 'single') {
        state.userSelection = [id];
      } else {
        if (state.userSelection.includes(id)) state.userSelection = state.userSelection.filter(x => x !== id);
        else state.userSelection.push(id);
      }
      renderNow();
    },

    submit() {
      const q = state.activeSession[state.currentIndex];
      if (!q) return;
      if (!state.userSelection || state.userSelection.length === 0) return;

      const correctIds = q.options.filter(o => o.correct).map(o => o.id);
      const isCorrect = (q.type === 'single')
        ? correctIds.includes(state.userSelection[0])
        : (correctIds.length === state.userSelection.length &&
           correctIds.every(i => state.userSelection.includes(i)) &&
           state.userSelection.every(i => correctIds.includes(i)));

      if (isCorrect) state.score++;
      state.isRationaleMode = true;
      state.lastSubmitted = { isCorrect, correctIds: [...correctIds], selected: [...state.userSelection] };

      renderNow();
    },

    next() {
      state.currentIndex++;
      state.userSelection = [];
      state.isRationaleMode = false;
      state.lastSubmitted = null;

      if (state.currentIndex >= state.activeSession.length) {
        const view = document.getElementById('app-view');
        if (view) {
          view.innerHTML = renderResults();
          applyGlobalLanguage(view);
        }
      } else {
        renderNow();
      }
    },

    quit() {
      state.activeSession = [];
      state.userSelection = [];
      state.isRationaleMode = false;
      state.lastSubmitted = null;
      renderNow();
    },

    forceReload() {
      state.allQuestions = [];
      state.activeSession = [];
      state.currentIndex = 0;
      state.score = 0;
      state.userSelection = [];
      state.isLoading = true;
      state.categories = {};
      state.error = null;
      state.isRationaleMode = false;
      state.lastSubmitted = null;
      loadQuestions();
    }
  };

  window.showSimulatorQuestion = function (index) {
    const idx = Number(index);
    if (!Number.isFinite(idx) || idx < 0) return;

    if (!state.allQuestions || state.allQuestions.length === 0) {
      state.pendingShowQuestionIndex = idx;
      if (!state.isLoading) loadQuestions();
      return;
    }

    showQuestionByIndex(idx);
  };

  // Inicialización
  loadPrefs();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadQuestions);
  } else {
    loadQuestions();
  }

})();
