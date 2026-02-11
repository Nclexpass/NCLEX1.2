/* simulator.js — Motor Cloud FINAL (Parser Inteligente + Respuestas Correctas + UI Completa) */

(function () {
  'use strict';

  // --- CONFIGURACIÓN ---
  const SHEET_ID = "2PACX-1vTuJc6DOuIIYv9jOERaUMa8yoo0ZFJY9BiVrvFU7Qa2VMJHGfP_i5C8RZpmXo41jg49IUjDP8lT_ze0";
  const GOOGLE_CSV_URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?output=csv`;

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
    lastSubmitted: null
  };

  // --- HELPERS ---
  const bilingual = (es, en) => {
    return `<span class="lang-es">${es || ''}</span><span class="lang-en hidden-lang">${en || es || ''}</span>`;
  };

  function normalizeKey(s) {
    return (s || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replace(/[^a-z0-9]/g, '');     // quita espacios, guiones, underscores, etc.
  }

  // --- PARSER CSV ROBUSTO (maneja comillas) ---
  function parseCSVRow(rowText) {
    const result = [];
    let current = '';
    let inQuote = false;

    for (let i = 0; i < rowText.length; i++) {
      const char = rowText[i];
      const nextChar = rowText[i + 1];

      if (inQuote) {
        if (char === '"') {
          if (nextChar === '"') { current += '"'; i++; }
          else { inQuote = false; }
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuote = true;
        } else if (char === ',') {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
    }

    result.push(current.trim());
    return result;
  }

  // --- CONEXIÓN RESILIENTE (CORS proxies) ---
  async function fetchWithFallback(url) {
    const strategies = [
      { name: "Direct", url: url },
      { name: "Primary Proxy", url: `https://corsproxy.io/?${encodeURIComponent(url)}` },
      { name: "Backup Proxy", url: `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` }
    ];

    let lastError = null;
    for (const strategy of strategies) {
      try {
        console.log(`Attempting connection via ${strategy.name}...`);

        const cacheBuster = strategy.url.includes('?') ? `&t=${Date.now()}` : `?t=${Date.now()}`;
        const response = await fetch(strategy.url + cacheBuster, { cache: 'no-store' });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const text = await response.text();
        const trimmed = text.trim();

        if (trimmed.startsWith("<!DOCTYPE") || trimmed.includes("<html")) throw new Error("Invalid HTML response");
        if (trimmed.length < 50) throw new Error("Response too short");

        return text;
      } catch (e) {
        console.warn(`Strategy ${strategy.name} failed:`, e);
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
    const headerNorm = headers.map(normalizeKey);
    let matches = 0;

    for (const def of columnDefinitions) {
      const idx = findColumnIndex(headers, def.possible);
      if (idx !== -1) matches++;
    }

    // además: si la mayoría de celdas son cortas/palabras clave, suele ser header
    const shortCells = headerNorm.filter(h => h.length > 0 && h.length <= 20).length;
    const ratioShort = headers.length ? shortCells / headers.length : 0;

    return matches >= 3 && ratioShort >= 0.6;
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

  // --- PARSER CON CABECERAS Y MAPEO INTELIGENTE ---
  function parseAndLoad(csvText) {
    try {
      const rows = csvText.replace(/\r\n/g, '\n').split('\n').filter(r => r.trim() !== '');
      if (rows.length < 2) throw new Error("CSV vacío o insuficiente");

      const headers = parseCSVRow(rows[0]);

      const columnDefinitions = [
        { field: 'id',          possible: ['id', 'questionid', 'code', 'codigo'], defaultIdx: 0 },
        { field: 'category',    possible: ['category', 'categoria', 'categoría', 'cat', 'tema', 'topic'], defaultIdx: 1 },

        { field: 'textEs',      possible: ['textEs','text_es','textoEs','texto_es','preguntaEs','pregunta_es','questionEs','question_es','question es','pregunta es','spanish'], defaultIdx: 2 },
        { field: 'textEn',      possible: ['textEn','text_en','textoEn','texto_en','preguntaEn','pregunta_en','questionEn','question_en','question en','english'], defaultIdx: 3 },

        { field: 'optAEs',      possible: ['optAEs','opt_a_es','aEs','a_es','optionAEs','option_a_es','option a es','opcion a es'], defaultIdx: 4 },
        { field: 'optAEn',      possible: ['optAEn','opt_a_en','aEn','a_en','optionAEn','option_a_en','option a en'], defaultIdx: 5 },

        { field: 'optBEs',      possible: ['optBEs','opt_b_es','bEs','b_es','optionBEs','option_b_es','option b es','opcion b es'], defaultIdx: 6 },
        { field: 'optBEn',      possible: ['optBEn','opt_b_en','bEn','b_en','optionBEn','option_b_en','option b en'], defaultIdx: 7 },

        { field: 'optCEs',      possible: ['optCEs','opt_c_es','cEs','c_es','optionCEs','option_c_es','option c es','opcion c es'], defaultIdx: 8 },
        { field: 'optCEn',      possible: ['optCEn','opt_c_en','cEn','c_en','optionCEn','option_c_en','option c en'], defaultIdx: 9 },

        { field: 'optDEs',      possible: ['optDEs','opt_d_es','dEs','d_es','optionDEs','option_d_es','option d es','opcion d es'], defaultIdx: 10 },
        { field: 'optDEn',      possible: ['optDEn','opt_d_en','dEn','d_en','optionDEn','option_d_en','option d en'], defaultIdx: 11 },

        { field: 'correct',     possible: ['correct','correcta','correctas','answer','answers','key','respuesta','respuestas','respuesta correcta'], defaultIdx: 12 },

        { field: 'rationaleEs', possible: ['rationaleEs','rationale_es','explicacionEs','explicacion_es','explicación es','feedback es','rationale es'], defaultIdx: 13 },
        { field: 'rationaleEn', possible: ['rationaleEn','rationale_en','explicacionEn','explicacion_en','explicación en','feedback en','rationale en'], defaultIdx: 14 },

        { field: 'type',        possible: ['type','tipo','format','formato','questiontype'], defaultIdx: 15 }
      ];

      const hasHeaders = looksLikeHeaderRow(headers, columnDefinitions);

      const colMap = {};
      let dataStartRow = 0;

      if (hasHeaders) {
        columnDefinitions.forEach(def => {
          const idx = findColumnIndex(headers, def.possible);
          colMap[def.field] = idx !== -1 ? idx : def.defaultIdx;
          if (idx === -1) {
            console.warn(`Columna "${def.field}" no encontrada, usando índice por defecto ${def.defaultIdx}`);
          }
        });
        dataStartRow = 1;
      } else {
        console.warn("No se detectaron cabeceras, usando orden fijo de columnas (compatibilidad)");
        columnDefinitions.forEach(def => { colMap[def.field] = def.defaultIdx; });
        dataStartRow = 0;
      }

      const parsed = [];

      for (let i = dataStartRow; i < rows.length; i++) {
        const row = rows[i];
        if (!row.trim()) continue;

        const cols = parseCSVRow(row);

        const maxIdx = Math.max(...Object.values(colMap));
        if (cols.length <= maxIdx) continue;

        try {
          const id = cols[colMap.id] || `q_${i}`;
          const category = cols[colMap.category] || 'General';

          const textEs = cols[colMap.textEs] || '';
          const textEn = cols[colMap.textEn] || textEs;

          const optAEs = cols[colMap.optAEs] || '';
          const optAEn = cols[colMap.optAEn] || optAEs;

          const optBEs = cols[colMap.optBEs] || '';
          const optBEn = cols[colMap.optBEn] || optBEs;

          const optCEs = cols[colMap.optCEs] || '';
          const optCEn = cols[colMap.optCEn] || optCEs;

          const optDEs = cols[colMap.optDEs] || '';
          const optDEn = cols[colMap.optDEn] || optDEs;

          const correctRaw = cols[colMap.correct] || '';
          const rationaleEs = cols[colMap.rationaleEs] || '';
          const rationaleEn = cols[colMap.rationaleEn] || rationaleEs;
          const typeRaw = (cols[colMap.type] || '').toString();

          const correctLetters = parseCorrectLetters(correctRaw);

          if (correctLetters.length === 0) {
            console.warn(`Pregunta ${id} omitida: no tiene respuestas correctas válidas.`);
            continue;
          }

          const options = [
            { id: 'a', textEs: optAEs, textEn: optAEn, correct: correctLetters.includes('a') },
            { id: 'b', textEs: optBEs, textEn: optBEn, correct: correctLetters.includes('b') },
            { id: 'c', textEs: optCEs, textEn: optCEn, correct: correctLetters.includes('c') },
            { id: 'd', textEs: optDEs, textEn: optDEn, correct: correctLetters.includes('d') }
          ].filter(o => (o.textEs || o.textEn || '').trim() !== '');

          if (!textEs && !textEn) continue;
          if (options.length < 2) continue;

          const lowerType = typeRaw.toLowerCase();
          const inferredSata =
            lowerType.includes('sata') ||
            lowerType.includes('selectall') ||
            lowerType.includes('select all') ||
            correctLetters.length > 1 ||
            (textEs.toLowerCase().includes('selecciona todas') || textEn.toLowerCase().includes('select all'));

          const q = {
            id: id.toString().trim(),
            category: category.toString().trim() || 'General',
            textEs: textEs.toString(),
            textEn: textEn.toString(),
            options,
            rationaleEs: rationaleEs.toString(),
            rationaleEn: rationaleEn.toString(),
            type: inferredSata ? 'sata' : 'single',
            tags: [category, typeRaw].filter(Boolean)
          };

          parsed.push(q);
        } catch (err) {
          console.warn("Error parseando fila", i, err);
        }
      }

      if (parsed.length === 0) throw new Error("No se pudo cargar ninguna pregunta válida.");

      state.allQuestions = parsed;

      state.categories = {};
      parsed.forEach(q => {
        const cat = (q.category || 'General').trim() || 'General';
        state.categories[cat] = (state.categories[cat] || 0) + 1;
      });

      window.SIMULATOR_QUESTIONS = parsed;
      state.isLoading = false;
      state.error = null;
      checkAndRender();

      applyGlobalLanguage();

    } catch (parseError) {
      console.error("Error en parseAndLoad:", parseError);
      state.error = "Error de formato en la base de datos. Verifica que las columnas sean correctas.";
      state.isLoading = false;
      checkAndRender();
    }
  }

  function applyGlobalLanguage() {
    try {
      const currentLang = localStorage.getItem('nclex_lang') || 'es';
      const isEs = currentLang === 'es';
      document.documentElement.lang = currentLang;
      document.querySelectorAll('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      document.querySelectorAll('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
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
      console.error("🔥 Simulator Critical Failure:", e);
      state.error = `Error de conexión: no se pudo acceder a la base de datos.<br><span class="text-xs text-gray-400">${(e && e.message) ? e.message : 'Unknown error'}</span>`;
      state.isLoading = false;
      checkAndRender();
    }
  }

  // --- ICONOS Y ESTILOS ---
  function getCategoryStyle(catName) {
    const n = (catName || '').toLowerCase();
    if (n.includes('newborn') || n.includes('neo')) return { i: 'baby', c: 'text-pink-400' };
    if (n.includes('matern') || n.includes('labor')) return { i: 'person-pregnant', c: 'text-rose-500' };
    if (n.includes('pediat')) return { i: 'child-reaching', c: 'text-yellow-500' };
    if (n.includes('cardio')) return { i: 'heart-pulse', c: 'text-red-500' };
    if (n.includes('respir')) return { i: 'lungs', c: 'text-blue-400' };
    if (n.includes('neuro') || n.includes('psych')) return { i: 'brain', c: 'text-purple-500' };
    if (n.includes('pharm')) return { i: 'pills', c: 'text-indigo-500' };
    if (n.includes('infect') || n.includes('safety')) return { i: 'shield-virus', c: 'text-green-500' };
    return { i: 'notes-medical', c: 'text-brand-blue' };
  }

  function getClinicalTip(category) {
    const n = (category || '').toLowerCase();
    if (n.includes('pharm')) return bilingual("💊 <strong>Tip:</strong> Revisa siempre <em>Contraindicaciones</em> y <em>Niveles Terapéuticos</em>.", "💊 <strong>Tip:</strong> Always check <em>Contraindications</em> and <em>Therapeutic Levels</em>.");
    if (n.includes('priorit')) return bilingual("🚨 <strong>Tip:</strong> ¿Quién muere si no actúas AHORA? (Estable vs Inestable)", "🚨 <strong>Tip:</strong> Who dies if you don't act NOW? (Stable vs Unstable)");
    if (n.includes('infect')) return bilingual("🦠 <strong>Tip:</strong> Transmisión: Contacto, Gotas o Aire? PPE adecuado.", "🦠 <strong>Tip:</strong> Transmission: Contact, Droplet, or Airborne? Proper PPE.");
    return bilingual("🧠 <strong>Estrategia:</strong> Lee la pregunta dos veces. ¿Qué está preguntando REALMENTE?", "🧠 <strong>Strategy:</strong> Read the stem twice. What is it REALLY asking?");
  }

  // --- RENDERIZADO ---
  function checkAndRender() {
    if (window.nclexApp && window.nclexApp.currentRoute === 'simulator') {
      renderNow();
    }
  }

  function renderNow() {
    const view = document.getElementById('app-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view && window.renderSimulatorPage) {
      view.innerHTML = window.renderSimulatorPage();
      applyGlobalLanguage();
    }
  }

  function renderLoading() {
    return `
      <div class="p-6 max-w-3xl mx-auto">
        <div class="bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-slate-200 dark:border-white/10 p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 animate-pulse"></div>
            <div class="flex-1">
              <div class="h-4 w-40 bg-slate-200 dark:bg-white/10 rounded animate-pulse mb-2"></div>
              <div class="h-3 w-72 bg-slate-200 dark:bg-white/10 rounded animate-pulse"></div>
            </div>
          </div>
          <div class="mt-6 space-y-3">
            <div class="h-10 bg-slate-200 dark:bg-white/10 rounded-xl animate-pulse"></div>
            <div class="h-10 bg-slate-200 dark:bg-white/10 rounded-xl animate-pulse"></div>
            <div class="h-10 bg-slate-200 dark:bg-white/10 rounded-xl animate-pulse"></div>
          </div>
          <div class="mt-6 text-sm text-slate-600 dark:text-slate-300">
            ${bilingual("Cargando preguntas...", "Loading questions...")}
          </div>
        </div>
      </div>
    `;
  }

  function renderError() {
    return `
      <div class="p-6 max-w-3xl mx-auto">
        <div class="bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-red-200 dark:border-red-900/30 p-6">
          <h2 class="text-xl font-black text-red-600 mb-2">${bilingual("Error", "Error")}</h2>
          <div class="text-sm text-slate-700 dark:text-slate-200">${state.error || ''}</div>
          <div class="mt-5 flex gap-2">
            <button onclick="window.simController.forceReload()" class="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold">
              ${bilingual("Reintentar", "Retry")}
            </button>
            <button onclick="window.simController.quit()" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-bold">
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

    const limitOptions = [10, 20, 30, 40, 50, 75, 100].map(n => {
      const active = state.limit === n;
      return `<button onclick="window.simController.setLimit(${n})"
        class="px-3 py-1.5 rounded-full text-xs font-bold ${active ? 'bg-brand-blue text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white'}">${n}</button>`;
    }).join('');

    const catButtons = [
      `<button onclick="window.simController.startQuiz('ALL')" class="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-card shadow hover:shadow-lg transition">
        <div class="flex items-center justify-between">
          <div class="font-black text-slate-900 dark:text-white">${bilingual("Todas las categorías", "All categories")}</div>
          <div class="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200">${total}</div>
        </div>
        <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">${bilingual("Inicia un examen mixto", "Start a mixed quiz")}</div>
      </button>`
    ];

    cats.forEach(cat => {
      const style = getCategoryStyle(cat);
      catButtons.push(`
        <button onclick="window.simController.startQuiz(${JSON.stringify(cat)})" class="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-card shadow hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-${style.i} ${style.c}"></i>
              <div class="font-black text-slate-900 dark:text-white">${cat}</div>
            </div>
            <div class="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200">${state.categories[cat]}</div>
          </div>
          <div class="mt-2 text-xs text-slate-600 dark:text-slate-300">${getClinicalTip(cat)}</div>
        </button>
      `);
    });

    return `
      <div class="p-6 max-w-4xl mx-auto">
        <header class="mb-6">
          <h1 class="text-3xl font-black text-slate-900 dark:text-white">
            ${bilingual("Simulador NCLEX", "NCLEX Simulator")}
          </h1>
          <p class="text-slate-600 dark:text-slate-300 mt-1">
            ${bilingual("Elige una categoría y practica con feedback inmediato.", "Pick a category and practice with instant feedback.")}
          </p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-3">
            ${catButtons.join('')}
          </div>

          <aside class="space-y-4">
            <div class="bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-slate-200 dark:border-white/10 p-5">
              <div class="font-black text-slate-900 dark:text-white mb-2">${bilingual("Configuración", "Settings")}</div>

              <div class="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">${bilingual("Número de preguntas", "Questions count")}</div>
              <div class="flex flex-wrap gap-2">${limitOptions}</div>

              <div class="mt-4 text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">${bilingual("Tamaño de letra", "Font size")}</div>
              <div class="flex gap-2">
                <button onclick="window.simController.adjustFont(-0.1)" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-black">A-</button>
                <button onclick="window.simController.adjustFont(0.1)" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-black">A+</button>
              </div>

              <div class="mt-4 text-xs text-slate-600 dark:text-slate-300">
                ${bilingual("Preguntas cargadas:", "Questions loaded:")} <span class="font-bold">${total}</span>
              </div>
            </div>

            <div class="bg-slate-900 text-white rounded-2xl shadow-xl p-5">
              <div class="font-black text-lg">${bilingual("Tip rápido", "Quick tip")}</div>
              <p class="text-sm text-slate-200 mt-2">
                ${bilingual("No inventes información. Responde SOLO con lo que dice la pregunta.", "Do not add info. Answer ONLY based on what the stem says.")}
              </p>
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
      const base = `w-full text-left p-4 rounded-2xl border transition`;
      const classes = isSelected
        ? `${base} border-brand-blue bg-brand-blue/10 dark:bg-brand-blue/20`
        : `${base} border-slate-200 dark:border-white/10 bg-white dark:bg-brand-card hover:border-slate-300 dark:hover:border-white/20`;

      const badge = isSata
        ? `<span class="inline-flex items-center justify-center w-5 h-5 rounded-md border ${isSelected ? 'bg-brand-blue border-brand-blue text-white' : 'border-slate-300 dark:border-white/20 text-slate-600 dark:text-slate-300'} text-xs font-black">${isSelected ? '✓' : ''}</span>`
        : `<span class="inline-flex items-center justify-center w-7 h-7 rounded-full ${isSelected ? 'bg-brand-blue text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white'} text-xs font-black">${opt.id.toUpperCase()}</span>`;

      return `
        <button onclick="window.simController.selectOption('${opt.id}')" class="${classes}">
          <div class="flex items-start gap-3">
            ${badge}
            <div class="flex-1" style="font-size:${state.fontSize}rem">
              ${bilingual(opt.textEs, opt.textEn)}
            </div>
          </div>
        </button>
      `;
    }).join('');

    const canSubmit = (state.userSelection || []).length > 0;

    return `
      <div class="p-6 max-w-4xl mx-auto">
        <div class="bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-slate-200 dark:border-white/10 overflow-hidden">
          <div class="p-5 border-b border-slate-200 dark:border-white/10">
            <div class="flex items-center justify-between gap-3">
              <div class="text-sm font-bold text-slate-600 dark:text-slate-300">
                ${bilingual("Pregunta", "Question")} ${current} / ${total}
                <span class="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10">${q.category}</span>
                <span class="ml-2 text-xs px-2 py-0.5 rounded-full ${isSata ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'}">
                  ${isSata ? bilingual("SATA", "SATA") : bilingual("Single", "Single")}
                </span>
              </div>
              <div class="text-xs font-bold text-slate-600 dark:text-slate-300">${progress}%</div>
            </div>
            <div class="mt-3 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
              <div class="h-full bg-brand-blue" style="width:${progress}%"></div>
            </div>
          </div>

          <div class="p-6">
            <div class="text-xl font-black text-slate-900 dark:text-white mb-4" style="font-size:${Math.max(1.15, state.fontSize + 0.15)}rem">
              ${bilingual(q.textEs, q.textEn)}
            </div>

            <div class="space-y-3">
              ${optionButtons}
            </div>

            <div class="mt-6 flex flex-wrap gap-2">
              <button onclick="window.simController.quit()" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-bold">
                ${bilingual("Salir", "Quit")}
              </button>

              <button onclick="window.simController.submit()"
                class="px-4 py-2 rounded-xl ${canSubmit ? 'bg-brand-blue text-white' : 'bg-slate-300 dark:bg-white/10 text-slate-500 dark:text-slate-400 cursor-not-allowed'} font-bold"
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
    const isSata = q.type === 'sata';

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
        right ? `<span class="text-xs font-black px-2 py-0.5 rounded-full bg-green-600 text-white">${bilingual("Correcta", "Correct")}</span>` :
        picked && !right ? `<span class="text-xs font-black px-2 py-0.5 rounded-full bg-red-600 text-white">${bilingual("Tu elección", "Your pick")}</span>` :
        `<span class="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200">${opt.id.toUpperCase()}</span>`;

      return `
        <div class="p-4 rounded-2xl border ${border} ${bg}">
          <div class="flex items-start gap-3">
            <div class="shrink-0">${tag}</div>
            <div class="flex-1" style="font-size:${state.fontSize}rem">
              ${bilingual(opt.textEs, opt.textEn)}
            </div>
          </div>
        </div>
      `;
    }).join('');

    const headerBadge = isCorrect
      ? `<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-600 text-white text-sm font-black">
            <i class="fa-solid fa-check"></i> ${bilingual("Correcto", "Correct")}
         </div>`
      : `<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-sm font-black">
            <i class="fa-solid fa-xmark"></i> ${bilingual("Incorrecto", "Incorrect")}
         </div>`;

    const rationaleText = (state.rationaleModeLang && state.rationaleModeLang === 'en')
      ? (q.rationaleEn || q.rationaleEs || '')
      : (q.rationaleEs || q.rationaleEn || '');

    const rationaleBlock = (q.rationaleEs || q.rationaleEn)
      ? `<div class="mt-5 p-5 rounded-2xl bg-slate-900 text-white">
          <div class="font-black text-lg mb-2">${bilingual("Razonamiento", "Rationale")}</div>
          <div class="text-sm text-slate-200" style="font-size:${Math.max(0.95, state.fontSize)}rem">
            ${bilingual(q.rationaleEs, q.rationaleEn)}
          </div>
        </div>`
      : '';

    return `
      <div class="p-6 max-w-4xl mx-auto">
        <div class="bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-slate-200 dark:border-white/10 overflow-hidden">
          <div class="p-5 border-b border-slate-200 dark:border-white/10">
            <div class="flex items-center justify-between gap-3">
              <div class="text-sm font-bold text-slate-600 dark:text-slate-300">
                ${bilingual("Revisión", "Review")} • ${q.category} • ${isSata ? 'SATA' : 'Single'}
              </div>
              ${headerBadge}
            </div>
          </div>

          <div class="p-6">
            <div class="text-xl font-black text-slate-900 dark:text-white mb-4" style="font-size:${Math.max(1.15, state.fontSize + 0.15)}rem">
              ${bilingual(q.textEs, q.textEn)}
            </div>

            <div class="space-y-3">
              ${optionCards}
            </div>

            ${rationaleBlock}

            <div class="mt-6 flex flex-wrap gap-2">
              <button onclick="window.simController.quit()" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-bold">
                ${bilingual("Salir", "Quit")}
              </button>

              <button onclick="window.simController.next()" class="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold">
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
      <div class="p-6 max-w-3xl mx-auto">
        <div class="bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-slate-200 dark:border-white/10 p-6">
          <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">${bilingual("Resultados", "Results")}</h2>

          <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-4 rounded-2xl bg-slate-100 dark:bg-white/10">
              <div class="text-xs font-bold text-slate-600 dark:text-slate-300">${bilingual("Puntaje", "Score")}</div>
              <div class="text-2xl font-black text-slate-900 dark:text-white">${score} / ${total}</div>
            </div>
            <div class="p-4 rounded-2xl bg-slate-100 dark:bg-white/10">
              <div class="text-xs font-bold text-slate-600 dark:text-slate-300">${bilingual("Porcentaje", "Percent")}</div>
              <div class="text-2xl font-black text-slate-900 dark:text-white">${pct}%</div>
            </div>
            <div class="p-4 rounded-2xl bg-slate-900 text-white">
              <div class="text-xs font-bold text-slate-200">${bilingual("Feedback", "Feedback")}</div>
              <div class="text-sm font-bold mt-1">${msg}</div>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-2">
            <button onclick="window.simController.quit()" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-bold">
              ${bilingual("Volver al lobby", "Back to lobby")}
            </button>
            <button onclick="window.simController.startQuiz('ALL')" class="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold">
              ${bilingual("Repetir mixto", "Retry mixed")}
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

  // --- CONTROLADOR GLOBAL ---
  window.simController = {
    setLimit(n) { state.limit = Math.max(1, Number(n) || 10); renderNow(); },
    adjustFont(delta) {
      state.fontSize = Math.max(0.8, Math.min(1.5, state.fontSize + (Number(delta) || 0)));
      renderNow();
    },
    startQuiz(c) {
      let pool = (c === 'ALL') ? [...state.allQuestions] : state.allQuestions.filter(q => q.category === c);
      pool.sort(() => Math.random() - 0.5);
      if (state.limit < pool.length) pool = pool.slice(0, state.limit);

      state.activeSession = pool;
      state.currentIndex = 0;
      state.score = 0;
      state.userSelection = [];
      state.isRationaleMode = false;
      state.lastSubmitted = null;

      renderNow();
    },
    selectOption(id) {
      const q = state.activeSession[state.currentIndex];
      if (!q) return;

      if (q.type === 'single') {
        state.userSelection = [id];
      } else {
        if (state.userSelection.includes(id))
          state.userSelection = state.userSelection.filter(x => x !== id);
        else
          state.userSelection.push(id);
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
        if (view) view.innerHTML = renderResults();
        applyGlobalLanguage();
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
    if (!state.allQuestions[index]) return;
    state.activeSession = [state.allQuestions[index]];
    state.currentIndex = 0;
    state.score = 0;
    state.userSelection = [];
    state.isRationaleMode = false;
    state.lastSubmitted = null;
    renderNow();
  };

  // Inicialización
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadQuestions);
  } else {
    loadQuestions();
  }

})();
