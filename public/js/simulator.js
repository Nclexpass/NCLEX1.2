/* simulator.js — Motor Cloud FINAL (PROD) v3.4 (Integrated Auth & Skins) */

(function () {
  'use strict';

  // ===== DEPENDENCIAS =====
  const U = window.NCLEXUtils || (() => {
    // Fallback mínimo si utils.js no ha cargado
    return {
      $: (s) => document.querySelector(s),
      $$: (s) => Array.from(document.querySelectorAll(s)),
      storageGet: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } },
      storageSet: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
      debounce: (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; },
      escapeHtml: (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
      format: { truncate: (t, m) => t.length > m ? t.slice(0, m) + '...' : t }
    };
  })();

  const { storageGet, storageSet, debounce, $, $$, escapeHtml } = U;

  // ===== CONFIGURACIÓN =====
  const CONFIG = {
    SHEET_ID: "2PACX-1vTuJc6DOuIIYv9jOERaUMa8yoo0ZFJY9BiVrvFU7Qa2VMJHGfP_i5C8RZpmXo41jg49IUjDP8lT_ze0",
    STORAGE_KEYS: {
      lang: 'nclex_lang', // Sincronizado con logic.js
      selectedCats: 'sim_selected_cats',
      limit: 'sim_limit',
      font: 'sim_font'
    }
  };

  const GOOGLE_CSV_URL = `https://docs.google.com/spreadsheets/d/e/${CONFIG.SHEET_ID}/pub?output=csv`;

  // ===== ESTADO =====
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
    pendingShowQuestionIndex: null,
    userAnswers: [] 
  };

  // ===== HELPERS =====
  function getLang() { return storageGet(CONFIG.STORAGE_KEYS.lang, 'es'); }

  function bilingual(es, en) {
    const current = getLang();
    const esSpan = `<span class="lang-es">${es || ''}</span>`;
    const enSpan = `<span class="lang-en hidden-lang">${en || es || ''}</span>`;
    return current === 'es' ? esSpan + enSpan : enSpan + esSpan;
  }

  function applyGlobalLanguage(root) {
    try {
      const currentLang = getLang();
      const isEs = currentLang === 'es';
      const scope = root || document;
      scope.querySelectorAll('.lang-es').forEach(el => el.classList.toggle('hidden-lang', !isEs));
      scope.querySelectorAll('.lang-en').forEach(el => el.classList.toggle('hidden-lang', isEs));
    } catch (_) {}
  }

  function escapeJsString(s) {
    return (s || '').toString().replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
  }

  function safeRichText(input) {
    return escapeHtml((input || '').toString()).replace(/\n/g, '<br>');
  }

  function isOnSimulatorRoute() {
    return window.nclexApp?.getCurrentRoute() === 'simulator';
  }

  function scrollToTop() {
    const main = $('#main-content');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ===== CSV PARSER =====
  function parseCSV(text) {
    // Parser simple y robusto
    const rows = [];
    let row = [];
    let field = '';
    let inQuote = false;
    const src = (text || '').toString().replace(/\r/g, '');

    for (let i = 0; i < src.length; i++) {
      const ch = src[i];
      if (inQuote) {
        if (ch === '"') {
          if (src[i + 1] === '"') { field += '"'; i++; }
          else { inQuote = false; }
        } else { field += ch; }
      } else {
        if (ch === '"') { inQuote = true; }
        else if (ch === ',') { row.push(field.trim()); field = ''; }
        else if (ch === '\n') {
          row.push(field.trim());
          if (row.some(c => c)) rows.push(row);
          row = []; field = '';
        } else { field += ch; }
      }
    }
    row.push(field.trim());
    if (row.some(c => c)) rows.push(row);
    return rows;
  }

  // ===== LOAD DATA =====
  async function fetchWithFallback(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      console.warn("Direct fetch failed, trying proxy...");
      const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxy);
      if (!res.ok) throw new Error("Proxy failed");
      return await res.text();
    }
  }

  function parseAndLoad(csvText) {
    try {
      const rows = parseCSV(csvText);
      if (rows.length < 2) throw new Error("CSV vacío");

      // Mapeo simple de columnas (Asumiendo orden estándar de Google Sheets)
      // ID, Category, TextEs, TextEn, OptAEs, OptAEn, ..., Correct, RationaleEs, RationaleEn, Type
      
      const parsed = [];
      // Empezamos en 1 para saltar headers
      for (let i = 1; i < rows.length; i++) {
        const col = rows[i];
        if (col.length < 13) continue;

        const correctRaw = (col[12] || '').toLowerCase();
        const correctLetters = correctRaw.match(/[a-d]/g) || [];
        if (correctLetters.length === 0) continue;

        const options = [
          { id: 'a', textEs: col[4], textEn: col[5] || col[4], correct: correctLetters.includes('a') },
          { id: 'b', textEs: col[6], textEn: col[7] || col[6], correct: correctLetters.includes('b') },
          { id: 'c', textEs: col[8], textEn: col[9] || col[8], correct: correctLetters.includes('c') },
          { id: 'd', textEs: col[10], textEn: col[11] || col[10], correct: correctLetters.includes('d') }
        ].filter(o => o.textEs);

        if (options.length < 2) continue;

        const isSata = correctLetters.length > 1 || (col[15] || '').toLowerCase().includes('sata');

        parsed.push({
          id: col[0] || `q${i}`,
          category: col[1] || 'General',
          textEs: col[2],
          textEn: col[3] || col[2],
          options,
          rationaleEs: col[13],
          rationaleEn: col[14] || col[13],
          type: isSata ? 'sata' : 'single'
        });
      }

      state.allQuestions = parsed;
      state.categories = {};
      parsed.forEach(q => {
        const c = q.category.trim();
        state.categories[c] = (state.categories[c] || 0) + 1;
      });

      state.isLoading = false;
      state.error = null;
      checkAndRender();

    } catch (e) {
      console.error("Parse error:", e);
      state.error = "Error procesando datos.";
      state.isLoading = false;
      checkAndRender();
    }
  }

  async function loadQuestions() {
    state.isLoading = true;
    checkAndRender();
    try {
      const data = await fetchWithFallback(GOOGLE_CSV_URL);
      parseAndLoad(data);
    } catch (e) {
      state.error = "No se pudo conectar con la base de datos.";
      state.isLoading = false;
      checkAndRender();
    }
  }

  // ===== PERSISTENCIA =====
  function loadPrefs() {
    state.selectedCategories = storageGet(CONFIG.STORAGE_KEYS.selectedCats, []);
    state.limit = storageGet(CONFIG.STORAGE_KEYS.limit, 10);
    state.fontSize = storageGet(CONFIG.STORAGE_KEYS.font, 1);
  }

  function savePrefs() {
    storageSet(CONFIG.STORAGE_KEYS.selectedCats, state.selectedCategories);
    storageSet(CONFIG.STORAGE_KEYS.limit, state.limit);
    storageSet(CONFIG.STORAGE_KEYS.font, state.fontSize);
  }

  // ===== SIMULATOR LOGIC =====
  function startQuiz(cats = []) {
    let pool = state.allQuestions;
    if (cats.length > 0) pool = pool.filter(q => cats.includes(q.category));
    
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    state.activeSession = pool.slice(0, state.limit);
    state.currentIndex = 0;
    state.score = 0;
    state.userSelection = [];
    state.isRationaleMode = false;
    state.userAnswers = [];
    renderNow();
  }

  function submitAnswer() {
    const q = state.activeSession[state.currentIndex];
    if (!q || state.userSelection.length === 0) return;

    const correctIds = q.options.filter(o => o.correct).map(o => o.id);
    const selected = state.userSelection;
    
    // Check correctness
    let isCorrect = false;
    if (q.type === 'single') {
      isCorrect = correctIds.includes(selected[0]);
    } else {
      isCorrect = correctIds.length === selected.length &&
                  correctIds.every(id => selected.includes(id));
    }

    if (isCorrect) state.score++;

    state.userAnswers.push({
      question: q,
      selected,
      isCorrect,
      correctIds,
      rationaleEs: q.rationaleEs,
      rationaleEn: q.rationaleEn
    });

    state.isRationaleMode = true;
    renderNow();
  }

  function nextQuestion() {
    if (state.currentIndex < state.activeSession.length - 1) {
      state.currentIndex++;
      state.userSelection = [];
      state.isRationaleMode = false;
      renderNow();
    } else {
      finishQuiz();
    }
  }

  async function finishQuiz() {
    // Guardar historial en la nube si está logueado
    if (window.NCLEX_AUTH) {
        try {
            const history = JSON.parse(localStorage.getItem('nclex_quiz_history') || '[]');
            history.push({
                date: new Date().toISOString(),
                score: state.score,
                total: state.activeSession.length,
                mode: 'simulator'
            });
            localStorage.setItem('nclex_quiz_history', JSON.stringify(history));
            // Forzar subida
            if(window.NCLEX_AUTH.forceSave) window.NCLEX_AUTH.forceSave();
        } catch(e) { console.error("Error saving history", e); }
    }
    
    // Renderizar resultados
    const view = $('#app-view');
    if (view) {
        view.innerHTML = renderResults();
        applyGlobalLanguage(view);
    }
  }

  // ===== RENDERERS =====
  function checkAndRender() {
    if (isOnSimulatorRoute()) renderNow();
  }

  const renderNow = debounce(() => {
    const view = $('#app-view');
    if (!view) return;
    scrollToTop();
    view.innerHTML = window.renderSimulatorPage();
    applyGlobalLanguage(view);
  }, 50);

  // --- PAGES ---
  function renderLoading() {
    return `<div class="p-10 text-center"><i class="fa-solid fa-circle-notch fa-spin text-4xl text-[var(--brand-blue)]"></i><p class="mt-4 text-[var(--brand-text-muted)]">${bilingual("Cargando base de datos...", "Loading database...")}</p></div>`;
  }

  function renderLobby() {
    const cats = Object.keys(state.categories).sort();
    const selectedCount = state.selectedCategories.length;
    
    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <header class="mb-8 text-center">
          <h1 class="text-3xl font-black text-[var(--brand-text)] mb-2">${bilingual("Simulador NCLEX", "NCLEX Simulator")}</h1>
          <p class="text-[var(--brand-text-muted)]">${bilingual("Personaliza tu sesión de práctica.", "Customize your practice session.")}</p>
        </header>

        <div class="bg-[var(--brand-card)] rounded-3xl p-6 shadow-lg border border-[var(--brand-border)] mb-6">
          <div class="flex justify-between items-center mb-4">
             <h2 class="font-bold text-[var(--brand-text)]">${bilingual("Categorías", "Categories")}</h2>
             <div class="space-x-2">
                <button onclick="window.simController.selectAll()" class="text-xs px-3 py-1 rounded-full bg-[var(--brand-bg)] text-[var(--brand-text)] font-bold">All</button>
                <button onclick="window.simController.clearSelected()" class="text-xs px-3 py-1 rounded-full bg-[var(--brand-bg)] text-[var(--brand-text)] font-bold">None</button>
             </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
             ${cats.map(c => {
                 const isSel = state.selectedCategories.includes(c);
                 return `<button onclick="window.simController.toggleCategory('${escapeJsString(c)}')" 
                    class="text-left px-4 py-3 rounded-xl border transition-all flex justify-between items-center ${isSel ? 'border-[var(--brand-blue)] bg-[var(--brand-blue)]/10' : 'border-[var(--brand-border)] hover:bg-[var(--brand-bg)]'}">
                    <span class="text-sm font-medium text-[var(--brand-text)] truncate">${c}</span>
                    ${isSel ? '<i class="fa-solid fa-check text-[var(--brand-blue)] text-xs"></i>' : ''}
                 </button>`;
             }).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-[var(--brand-card)] rounded-3xl p-6 shadow-lg border border-[var(--brand-border)]">
                <h2 class="font-bold text-[var(--brand-text)] mb-3">${bilingual("Preguntas", "Questions")}</h2>
                <div class="flex flex-wrap gap-2">
                    ${[10, 20, 50, 75].map(n => `
                        <button onclick="window.simController.setLimit(${n})" 
                            class="px-4 py-2 rounded-xl font-bold text-sm transition-colors ${state.limit === n ? 'bg-[var(--brand-blue)] text-white' : 'bg-[var(--brand-bg)] text-[var(--brand-text)]'}">
                            ${n}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-[var(--brand-card)] rounded-3xl p-6 shadow-lg border border-[var(--brand-border)] flex flex-col justify-center">
                 <button onclick="window.simController.startSelected()" 
                    ${selectedCount === 0 ? 'disabled' : ''}
                    class="w-full py-4 rounded-xl font-black text-white text-lg shadow-lg transition-transform active:scale-95 ${selectedCount > 0 ? 'bg-[var(--brand-blue)] hover:brightness-110' : 'bg-gray-400 cursor-not-allowed'}">
                    ${bilingual("COMENZAR EXAMEN", "START QUIZ")} (${selectedCount || '0'})
                 </button>
            </div>
        </div>
      </div>
    `;
  }

  function renderActiveQuiz() {
    const q = state.activeSession[state.currentIndex];
    const current = state.currentIndex + 1;
    const total = state.activeSession.length;
    const pct = Math.round((current / total) * 100);
    const isSata = q.type === 'sata';

    return `
      <div class="max-w-4xl mx-auto animate-fade-in pb-20">
        <div class="flex items-center justify-between mb-6">
            <button onclick="window.simController.quit()" class="text-sm font-bold text-[var(--brand-text-muted)] hover:text-red-500">
                <i class="fa-solid fa-xmark mr-1"></i> ${bilingual("Salir", "Quit")}
            </button>
            <div class="flex flex-col items-center">
                <span class="text-xs font-bold text-[var(--brand-text-muted)] uppercase tracking-widest">${bilingual("Pregunta", "Question")} ${current} / ${total}</span>
            </div>
            <div class="text-sm font-bold text-[var(--brand-text)]">${q.category}</div>
        </div>

        <div class="w-full h-1 bg-[var(--brand-bg)] rounded-full mb-8 overflow-hidden">
            <div class="h-full bg-[var(--brand-blue)] transition-all duration-500" style="width: ${pct}%"></div>
        </div>

        <div class="bg-[var(--brand-card)] rounded-3xl p-8 shadow-xl border border-[var(--brand-border)] mb-6">
             <div class="flex items-start gap-3 mb-6">
                ${isSata ? '<span class="px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-black">SATA</span>' : ''}
                <h2 class="text-xl md:text-2xl font-bold text-[var(--brand-text)] leading-relaxed" style="font-size: ${1.2 * state.fontSize}rem">
                    ${bilingual(safeRichText(q.textEs), safeRichText(q.textEn))}
                </h2>
             </div>

             <div class="space-y-3">
                ${q.options.map(opt => {
                    const isSel = state.userSelection.includes(opt.id);
                    return `
                        <button onclick="window.simController.selectOption('${opt.id}')" 
                            class="w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${isSel ? 'border-[var(--brand-blue)] bg-[var(--brand-blue)]/5' : 'border-[var(--brand-border)] hover:border-[var(--brand-text-muted)]'}">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0 transition-colors ${isSel ? 'bg-[var(--brand-blue)] text-white' : 'bg-[var(--brand-bg)] text-[var(--brand-text-muted)]'}">
                                ${opt.id.toUpperCase()}
                            </div>
                            <div class="pt-1 text-[var(--brand-text)]" style="font-size: ${state.fontSize}rem">
                                ${bilingual(safeRichText(opt.textEs), safeRichText(opt.textEn))}
                            </div>
                        </button>
                    `;
                }).join('')}
             </div>
        </div>

        <div class="flex justify-end">
            <button onclick="window.simController.submit()" 
                ${state.userSelection.length === 0 ? 'disabled' : ''}
                class="px-8 py-4 rounded-2xl font-black text-white shadow-lg transition-transform active:scale-95 ${state.userSelection.length > 0 ? 'bg-[var(--brand-blue)]' : 'bg-gray-300 cursor-not-allowed'}">
                ${bilingual("ENVIAR RESPUESTA", "SUBMIT ANSWER")}
            </button>
        </div>
      </div>
    `;
  }

  function renderRationale() {
    const q = state.activeSession[state.currentIndex];
    const correctIds = q.options.filter(o => o.correct).map(o => o.id);
    const selected = state.userSelection;
    // Lógica correcta Sata/Single
    const isCorrect = q.type === 'single' 
        ? correctIds.includes(selected[0]) 
        : (correctIds.length === selected.length && correctIds.every(id => selected.includes(id)));

    return `
      <div class="max-w-4xl mx-auto animate-fade-in pb-20">
         <div class="bg-[var(--brand-card)] rounded-3xl p-8 shadow-xl border-t-8 ${isCorrect ? 'border-green-500' : 'border-red-500'} mb-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl ${isCorrect ? 'bg-green-500' : 'bg-red-500'}">
                    <i class="fa-solid fa-${isCorrect ? 'check' : 'xmark'}"></i>
                </div>
                <div>
                    <h2 class="text-xl font-black text-[var(--brand-text)]">${isCorrect ? bilingual("¡Correcto!", "Correct!") : bilingual("Incorrecto", "Incorrect")}</h2>
                    <p class="text-sm text-[var(--brand-text-muted)]">${bilingual("Revisa el razonamiento abajo.", "Review the rationale below.")}</p>
                </div>
            </div>

            <div class="space-y-3 mb-8">
                ${q.options.map(opt => {
                    const isSel = selected.includes(opt.id);
                    const isRight = opt.correct;
                    let styleClass = "border-[var(--brand-border)] opacity-50"; // Default dim
                    let icon = "";

                    if (isRight) {
                        styleClass = "border-green-500 bg-green-50 dark:bg-green-900/20 opacity-100";
                        icon = '<i class="fa-solid fa-check text-green-600"></i>';
                    } else if (isSel && !isRight) {
                        styleClass = "border-red-500 bg-red-50 dark:bg-red-900/20 opacity-100";
                        icon = '<i class="fa-solid fa-xmark text-red-600"></i>';
                    }

                    return `
                        <div class="w-full text-left p-4 rounded-xl border-2 flex items-start gap-4 ${styleClass}">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0 bg-white/50 text-[var(--brand-text)]">
                                ${opt.id.toUpperCase()}
                            </div>
                            <div class="pt-1 flex-1 text-[var(--brand-text)]">
                                ${bilingual(safeRichText(opt.textEs), safeRichText(opt.textEn))}
                            </div>
                            <div class="pt-1">${icon}</div>
                        </div>
                    `;
                }).join('')}
             </div>

             <div class="p-6 rounded-2xl bg-[var(--brand-bg)] border border-[var(--brand-border)]">
                <h3 class="font-bold text-[var(--brand-text)] mb-2 uppercase text-xs tracking-wider">Rationale</h3>
                <div class="text-[var(--brand-text)] leading-relaxed">
                    ${bilingual(safeRichText(q.rationaleEs), safeRichText(q.rationaleEn))}
                </div>
             </div>
         </div>

         <div class="flex justify-end">
            <button onclick="window.simController.next()" 
                class="px-8 py-4 rounded-2xl font-black text-white shadow-lg transition-transform active:scale-95 bg-[var(--brand-blue)]">
                ${bilingual("SIGUIENTE", "NEXT QUESTION")} <i class="fa-solid fa-arrow-right ml-2"></i>
            </button>
        </div>
      </div>
    `;
  }

  function renderResults() {
    const total = state.activeSession.length;
    const score = state.score;
    const pct = Math.round((score / total) * 100);

    return `
        <div class="max-w-2xl mx-auto text-center animate-fade-in pt-10">
            <div class="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-4xl font-black mb-6 text-white shadow-xl ${pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}">
                ${pct}%
            </div>
            <h1 class="text-3xl font-black text-[var(--brand-text)] mb-2">${bilingual("Sesión Finalizada", "Session Completed")}</h1>
            <p class="text-[var(--brand-text-muted)] mb-8">${bilingual(`Obtuviste ${score} de ${total} preguntas correctas.`, `You got ${score} out of ${total} questions right.`)}</p>
            
            <div class="flex justify-center gap-4">
                <button onclick="window.simController.quit()" class="px-6 py-3 rounded-xl bg-[var(--brand-card)] border border-[var(--brand-border)] text-[var(--brand-text)] font-bold shadow-sm hover:bg-[var(--brand-bg)]">
                    ${bilingual("Volver al Inicio", "Back to Home")}
                </button>
                <button onclick="window.simController.startSelected()" class="px-6 py-3 rounded-xl bg-[var(--brand-blue)] text-white font-bold shadow-lg hover:brightness-110">
                    ${bilingual("Nueva Práctica", "New Practice")}
                </button>
            </div>
        </div>
    `;
  }

  // ===== API PÚBLICA =====
  window.renderSimulatorPage = function() {
    if (state.isLoading) return renderLoading();
    if (state.error) return `<div class="p-10 text-center text-red-500">${state.error} <br><button onclick="window.simController.forceReload()" class="mt-4 underline">Retry</button></div>`;
    if (state.activeSession.length === 0) return renderLobby();
    if (state.isRationaleMode) return renderRationale();
    return renderActiveQuiz();
  };

  window.simController = {
    setLimit: (n) => { state.limit = n; savePrefs(); renderNow(); },
    toggleCategory: (c) => { 
        if(state.selectedCategories.includes(c)) state.selectedCategories = state.selectedCategories.filter(x => x!==c);
        else state.selectedCategories.push(c);
        savePrefs(); renderNow();
    },
    selectAll: () => { state.selectedCategories = Object.keys(state.categories); savePrefs(); renderNow(); },
    clearSelected: () => { state.selectedCategories = []; savePrefs(); renderNow(); },
    startSelected: () => startQuiz(state.selectedCategories),
    startQuiz: (cat) => startQuiz(cat === 'ALL' ? [] : [cat]),
    selectOption: (id) => {
        const q = state.activeSession[state.currentIndex];
        if(q.type === 'single') state.userSelection = [id];
        else {
            if(state.userSelection.includes(id)) state.userSelection = state.userSelection.filter(x => x!==id);
            else state.userSelection.push(id);
        }
        renderNow();
    },
    submit: submitAnswer,
    next: nextQuestion,
    quit: () => { state.activeSession = []; renderNow(); },
    forceReload: loadQuestions
  };

  // ===== INIT =====
  loadPrefs();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadQuestions);
  else loadQuestions();

  // Escuchar cambio de idioma global
  window.addEventListener('languagechange', renderNow);

})();