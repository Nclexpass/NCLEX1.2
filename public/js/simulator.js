/* simulator.js — Motor Cloud FINAL PRO v4.0 (Timer + Exam Mode + Visuals) */

(function () {
  'use strict';

  // ===== DEPENDENCIAS =====
  const U = window.NCLEXUtils || (() => {
    return {
      $: (s) => document.querySelector(s),
      $$: (s) => Array.from(document.querySelectorAll(s)),
      storageGet: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } },
      storageSet: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
      escapeHtml: (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    };
  })();

  const { storageGet, storageSet, $ } = U;

  // ===== CONFIGURACIÓN =====
  const CONFIG = {
    SHEET_ID: "2PACX-1vTuJc6DOuIIYv9jOERaUMa8yoo0ZFJY9BiVrvFU7Qa2VMJHGfP_i5C8RZpmXo41jg49IUjDP8lT_ze0",
    STORAGE_KEYS: {
      lang: 'nclex_lang',
      selectedCats: 'sim_selected_cats',
      limit: 'sim_limit',
      mode: 'sim_mode' // 'practice' or 'exam'
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
    
    // Preferencias
    limit: 10,
    mode: 'practice', // 'practice' (feedback inmediato) | 'exam' (feedback al final)
    
    // Runtime
    isRationaleMode: false,
    startTime: null,
    timerInterval: null,
    elapsedSeconds: 0,
    userAnswers: [],
    selectedCategories: []
  };

  // ===== HELPERS =====
  function getLang() { 
      return (window.nclexApp && window.nclexApp.getCurrentLang) ? window.nclexApp.getCurrentLang() : 'es';
  }

  function t(es, en) { return getLang() === 'es' ? es : en; }

  function formatTime(seconds) {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
  }

  function startTimer() {
      stopTimer();
      state.startTime = Date.now();
      state.elapsedSeconds = 0;
      state.timerInterval = setInterval(() => {
          state.elapsedSeconds++;
          const timerEl = document.getElementById('sim-timer');
          if (timerEl) timerEl.innerText = formatTime(state.elapsedSeconds);
      }, 1000);
  }

  function stopTimer() {
      if (state.timerInterval) {
          clearInterval(state.timerInterval);
          state.timerInterval = null;
      }
  }

  function scrollToTop() {
    const main = $('#main-content');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ===== CSV PARSER =====
  function parseCSV(text) {
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
  async function loadQuestions() {
    state.isLoading = true;
    checkAndRender();
    try {
      const res = await fetch(GOOGLE_CSV_URL);
      if (!res.ok) throw new Error("Network error");
      const text = await res.text();
      parseAndLoad(text);
    } catch (e) {
      console.warn("Proxy fallback...");
      try {
          const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(GOOGLE_CSV_URL)}`;
          const res = await fetch(proxy);
          const text = await res.text();
          parseAndLoad(text);
      } catch(err) {
          state.error = "Error conectando a base de datos. Verifica tu conexión.";
          state.isLoading = false;
          checkAndRender();
      }
    }
  }

  function parseAndLoad(csvText) {
      const rows = parseCSV(csvText);
      const parsed = [];
      
      // Skip header (row 0)
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
  }

  // ===== PERSISTENCIA =====
  function loadPrefs() {
    state.selectedCategories = storageGet(CONFIG.STORAGE_KEYS.selectedCats, []);
    state.limit = storageGet(CONFIG.STORAGE_KEYS.limit, 10);
    state.mode = storageGet(CONFIG.STORAGE_KEYS.mode, 'practice');
  }

  function savePrefs() {
    storageSet(CONFIG.STORAGE_KEYS.selectedCats, state.selectedCategories);
    storageSet(CONFIG.STORAGE_KEYS.limit, state.limit);
    storageSet(CONFIG.STORAGE_KEYS.mode, state.mode);
  }

  // ===== LOGICA DEL JUEGO =====
  function startQuiz() {
    let pool = state.allQuestions;
    if (state.selectedCategories.length > 0) {
        pool = pool.filter(q => state.selectedCategories.includes(q.category));
    }
    
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    state.activeSession = pool.slice(0, state.limit);
    if(state.activeSession.length === 0) {
        alert(t("No hay preguntas en esta categoría.", "No questions available in this category."));
        return;
    }

    state.currentIndex = 0;
    state.score = 0;
    state.userSelection = [];
    state.isRationaleMode = false;
    state.userAnswers = [];
    
    startTimer();
    renderNow();
  }

  function submitAnswer() {
    const q = state.activeSession[state.currentIndex];
    if (!q || state.userSelection.length === 0) return;

    const correctIds = q.options.filter(o => o.correct).map(o => o.id);
    const selected = state.userSelection;
    
    let isCorrect = false;
    if (q.type === 'single') {
      isCorrect = correctIds.includes(selected[0]);
    } else {
      isCorrect = correctIds.length === selected.length && correctIds.every(id => selected.includes(id));
    }

    if (isCorrect) state.score++;

    // Guardar respuesta
    state.userAnswers.push({
      question: q,
      selected,
      isCorrect,
      correctIds
    });

    if (state.mode === 'practice') {
        state.isRationaleMode = true;
    } else {
        nextQuestion(); // En modo examen salta directo
        return;
    }
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
    stopTimer();
    
    // Guardar en la nube
    if (window.NCLEX_AUTH) {
        try {
            const history = JSON.parse(localStorage.getItem('nclex_quiz_history') || '[]');
            history.push({
                date: new Date().toISOString(),
                score: state.score,
                total: state.activeSession.length,
                mode: state.mode,
                time: state.elapsedSeconds
            });
            localStorage.setItem('nclex_quiz_history', JSON.stringify(history));
            if(window.NCLEX_AUTH.forceSave) window.NCLEX_AUTH.forceSave();
        } catch(e) {}
    }
    
    renderResults();
  }

  // ===== RENDERIZADORES =====
  function checkAndRender() {
    if (window.nclexApp && window.nclexApp.getCurrentRoute() === 'simulator') {
        renderNow();
    }
  }

  function renderNow() {
    const view = $('#app-view');
    if (!view) return;
    scrollToTop();
    view.innerHTML = window.renderSimulatorPage();
    if(window.applyGlobalLanguage) window.applyGlobalLanguage(view);
  }

  // --- 1. LOADING ---
  function renderLoading() {
    return `
      <div class="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
        <div class="w-16 h-16 border-4 border-gray-200 border-t-[var(--brand-blue)] rounded-full animate-spin mb-4"></div>
        <p class="text-[var(--brand-text-muted)] font-bold tracking-widest text-sm">LOADING DATABASE...</p>
      </div>
    `;
  }

  // --- 2. LOBBY (CONFIGURACIÓN) ---
  function renderLobby() {
    const cats = Object.keys(state.categories).sort();
    const selectedCount = state.selectedCategories.length;
    
    return `
      <div class="max-w-4xl mx-auto animate-fade-in pb-20">
        <header class="mb-10 text-center">
          <div class="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <i class="fa-solid fa-brain text-4xl text-white"></i>
          </div>
          <h1 class="text-3xl font-black text-[var(--brand-text)] mb-2 tracking-tight">${t("Simulador Profesional", "Professional Simulator")}</h1>
          <p class="text-[var(--brand-text-muted)]">${t("Configura tu sesión de entrenamiento", "Customize your training session")}</p>
        </header>

        <div class="bg-[var(--brand-card)] p-2 rounded-2xl border border-[var(--brand-border)] flex mb-8 max-w-md mx-auto shadow-sm">
            <button onclick="window.simController.setMode('practice')" 
                class="flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${state.mode === 'practice' ? 'bg-[rgb(var(--brand-blue-rgb))] text-white shadow-md' : 'text-[var(--brand-text-muted)] hover:bg-[var(--brand-bg)]'}">
                <i class="fa-solid fa-graduation-cap"></i> ${t("Práctica", "Practice")}
            </button>
            <button onclick="window.simController.setMode('exam')" 
                class="flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${state.mode === 'exam' ? 'bg-purple-600 text-white shadow-md' : 'text-[var(--brand-text-muted)] hover:bg-[var(--brand-bg)]'}">
                <i class="fa-solid fa-stopwatch"></i> ${t("Examen", "Exam Mode")}
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-[var(--brand-card)] rounded-3xl p-6 shadow-xl border border-[var(--brand-border)] relative overflow-hidden">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-bold text-[var(--brand-text)] flex items-center gap-2">
                        <i class="fa-solid fa-layer-group text-[var(--brand-text-muted)]"></i> ${t("Categorías", "Categories")}
                    </h2>
                    <div class="space-x-1">
                        <button onclick="window.simController.selectAll()" class="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-[var(--brand-bg)] text-[var(--brand-text)] hover:bg-gray-200">All</button>
                        <button onclick="window.simController.clearSelected()" class="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-[var(--brand-bg)] text-[var(--brand-text)] hover:bg-gray-200">None</button>
                    </div>
                </div>
                <div class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    ${cats.map(c => {
                        const isSel = state.selectedCategories.includes(c);
                        return `
                            <button onclick="window.simController.toggleCategory('${c}')" 
                                class="w-full text-left px-4 py-3 rounded-xl border transition-all flex justify-between items-center ${isSel ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-[var(--brand-border)] hover:border-gray-400'}">
                                <span class="text-sm font-medium text-[var(--brand-text)] truncate w-4/5">${c}</span>
                                ${isSel ? '<i class="fa-solid fa-circle-check text-blue-500"></i>' : '<i class="fa-regular fa-circle text-gray-300"></i>'}
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="flex flex-col gap-6">
                <div class="bg-[var(--brand-card)] rounded-3xl p-6 shadow-xl border border-[var(--brand-border)]">
                    <h2 class="font-bold text-[var(--brand-text)] mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-list-ol text-[var(--brand-text-muted)]"></i> ${t("Cantidad", "Questions")}
                    </h2>
                    <div class="grid grid-cols-4 gap-2">
                        ${[10, 20, 50, 75].map(n => `
                            <button onclick="window.simController.setLimit(${n})" 
                                class="py-2 rounded-xl font-bold text-sm transition-colors border ${state.limit === n ? 'border-blue-500 bg-blue-500 text-white' : 'border-[var(--brand-border)] text-[var(--brand-text)] hover:bg-[var(--brand-bg)]'}">
                                ${n}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <button onclick="window.simController.start()" 
                    ${selectedCount === 0 ? 'disabled' : ''}
                    class="flex-1 rounded-3xl font-black text-white text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 ${selectedCount > 0 ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300 cursor-not-allowed'}">
                    <span>${t("INICIAR", "START")}</span>
                    <i class="fa-solid fa-play"></i>
                </button>
            </div>
        </div>
      </div>
    `;
  }

  // --- 3. ACTIVE QUIZ (JUEGO) ---
  function renderActiveQuiz() {
    const q = state.activeSession[state.currentIndex];
    const current = state.currentIndex + 1;
    const total = state.activeSession.length;
    const progress = (current / total) * 100;
    const isSata = q.type === 'sata';

    return `
      <div class="max-w-5xl mx-auto animate-fade-in pb-32">
        <div class="sticky top-0 z-20 bg-[var(--brand-bg)]/90 backdrop-blur-md py-4 border-b border-[var(--brand-border)] mb-6 -mx-6 px-6 md:rounded-b-2xl">
            <div class="flex justify-between items-center max-w-5xl mx-auto">
                <button onclick="window.simController.quit()" class="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">
                    <i class="fa-solid fa-power-off mr-1"></i> ${t("Salir", "Quit")}
                </button>
                
                <div class="flex flex-col items-center">
                    <div class="text-lg font-black font-mono text-[var(--brand-text)]" id="sim-timer">00:00</div>
                    <div class="w-32 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div class="h-full bg-blue-500 transition-all duration-300" style="width: ${progress}%"></div>
                    </div>
                </div>

                <div class="text-xs font-bold text-[var(--brand-text-muted)] bg-[var(--brand-card)] px-3 py-1 rounded-lg border border-[var(--brand-border)]">
                    Q ${current} / ${total}
                </div>
            </div>
        </div>

        <div class="bg-[var(--brand-card)] rounded-3xl p-6 md:p-10 shadow-2xl border border-[var(--brand-border)] relative overflow-hidden">
             <div class="absolute top-0 left-0 w-2 h-full ${isSata ? 'bg-purple-500' : 'bg-blue-500'}"></div>
             
             <div class="mb-8">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-[10px] font-black uppercase tracking-widest text-[var(--brand-text-muted)]">${q.category}</span>
                    ${isSata ? '<span class="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-700 uppercase">Select All That Apply</span>' : ''}
                </div>
                <h2 class="text-xl md:text-2xl font-bold text-[var(--brand-text)] leading-relaxed">
                    ${t(q.textEs, q.textEn)}
                </h2>
             </div>

             <div class="space-y-3">
                ${q.options.map(opt => {
                    const isSel = state.userSelection.includes(opt.id);
                    // Visual States
                    let baseClass = "border-2 border-[var(--brand-border)] hover:border-gray-300 hover:bg-[var(--brand-bg)]";
                    let iconClass = isSata ? "fa-square" : "fa-circle";
                    let textClass = "text-[var(--brand-text)]";
                    
                    if (isSel) {
                        baseClass = "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md transform scale-[1.01]";
                        iconClass = isSata ? "fa-check-square text-blue-600" : "fa-dot-circle text-blue-600";
                        textClass = "text-blue-900 dark:text-blue-100 font-semibold";
                    }

                    return `
                        <button onclick="window.simController.select('${opt.id}')" 
                            class="w-full text-left p-5 rounded-xl transition-all duration-200 flex items-start gap-4 group ${baseClass}">
                            <div class="mt-0.5 text-xl text-gray-300 group-hover:text-gray-400 transition-colors">
                                <i class="fa-regular ${iconClass}"></i>
                            </div>
                            <div class="flex-1 ${textClass} text-base md:text-lg">
                                ${t(opt.textEs, opt.textEn)}
                            </div>
                        </button>
                    `;
                }).join('')}
             </div>
        </div>

        <div class="fixed bottom-0 left-0 w-full bg-[var(--brand-card)] border-t border-[var(--brand-border)] p-4 z-30">
            <div class="max-w-5xl mx-auto flex justify-end">
                <button onclick="window.simController.submit()" 
                    ${state.userSelection.length === 0 ? 'disabled' : ''}
                    class="px-8 py-4 rounded-xl font-black text-white text-lg shadow-xl transition-transform active:scale-95 ${state.userSelection.length > 0 ? 'bg-[rgb(var(--brand-blue-rgb))] hover:brightness-110' : 'bg-gray-300 cursor-not-allowed'}">
                    ${t("CONFIRMAR", "SUBMIT")}
                </button>
            </div>
        </div>
      </div>
    `;
  }

  // --- 4. RATIONALE (Solo en modo práctica) ---
  function renderRationale() {
    const q = state.activeSession[state.currentIndex];
    const correctIds = q.options.filter(o => o.correct).map(o => o.id);
    const selected = state.userSelection;
    const isCorrect = q.type === 'single' 
        ? correctIds.includes(selected[0]) 
        : (correctIds.length === selected.length && correctIds.every(id => selected.includes(id)));

    return `
      <div class="max-w-5xl mx-auto animate-fade-in pb-32">
         <div class="mb-6 p-6 rounded-3xl flex items-center gap-4 text-white shadow-lg ${isCorrect ? 'bg-green-500' : 'bg-red-500'}">
            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
                <i class="fa-solid fa-${isCorrect ? 'check' : 'xmark'}"></i>
            </div>
            <div>
                <h2 class="text-2xl font-black">${isCorrect ? t("¡Correcto!", "Correct!") : t("Incorrecto", "Incorrect")}</h2>
                <p class="opacity-90 text-sm font-medium">${t("Revisa la explicación abajo", "Review the rationale below")}</p>
            </div>
         </div>

         <div class="bg-[var(--brand-card)] rounded-3xl p-8 shadow-xl border border-[var(--brand-border)] mb-6 opacity-75 grayscale-[50%]">
            <h3 class="font-bold text-[var(--brand-text)] mb-4">${t(q.textEs, q.textEn)}</h3>
            <div class="space-y-2">
                ${q.options.map(opt => {
                    const isSel = selected.includes(opt.id);
                    const isRight = opt.correct;
                    let style = "border-[var(--brand-border)] bg-[var(--brand-bg)] opacity-50";
                    let icon = "";

                    if (isRight) {
                        style = "border-green-500 bg-green-50 dark:bg-green-900/20 opacity-100 font-bold";
                        icon = '<i class="fa-solid fa-check text-green-600"></i>';
                    } else if (isSel && !isRight) {
                        style = "border-red-500 bg-red-50 dark:bg-red-900/20 opacity-100";
                        icon = '<i class="fa-solid fa-xmark text-red-600"></i>';
                    }

                    return `
                        <div class="p-3 rounded-lg border flex justify-between items-center ${style}">
                            <span class="text-[var(--brand-text)]">${t(opt.textEs, opt.textEn)}</span>
                            ${icon}
                        </div>
                    `;
                }).join('')}
            </div>
         </div>

         <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-xl">
            <h4 class="text-blue-800 dark:text-blue-300 font-black uppercase tracking-widest text-xs mb-2">RATIONALE</h4>
            <p class="text-[var(--brand-text)] leading-relaxed text-lg">
                ${t(q.rationaleEs, q.rationaleEn)}
            </p>
         </div>

         <div class="fixed bottom-0 left-0 w-full bg-[var(--brand-card)] border-t border-[var(--brand-border)] p-4 z-30">
            <div class="max-w-5xl mx-auto flex justify-end">
                <button onclick="window.simController.next()" 
                    class="px-8 py-4 rounded-xl font-black text-white text-lg shadow-xl bg-gray-900 hover:bg-black transition-transform active:scale-95">
                    ${t("SIGUIENTE", "NEXT")} <i class="fa-solid fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
      </div>
    `;
  }

  // --- 5. RESULTS ---
  function renderResults() {
    const total = state.activeSession.length;
    const score = state.score;
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 60; // NCLEX standardish

    return `
        <div class="max-w-lg mx-auto text-center animate-fade-in pt-10">
            <div class="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
                <svg class="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" stroke-width="12" fill="transparent" class="text-gray-200 dark:text-gray-700" />
                    <circle cx="96" cy="96" r="88" stroke="currentColor" stroke-width="12" fill="transparent" 
                        stroke-dasharray="552" stroke-dashoffset="${552 - (552 * pct / 100)}" 
                        class="${passed ? 'text-green-500' : 'text-red-500'} transition-all duration-1000 ease-out" />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-5xl font-black text-[var(--brand-text)]">${pct}%</span>
                    <span class="text-xs font-bold text-[var(--brand-text-muted)] uppercase">${passed ? 'PASS' : 'FAIL'}</span>
                </div>
            </div>

            <h1 class="text-3xl font-black text-[var(--brand-text)] mb-2">${passed ? t("¡Buen Trabajo!", "Good Job!") : t("Sigue Practicando", "Keep Practicing")}</h1>
            <p class="text-[var(--brand-text-muted)] mb-8">${t(`Respondiste ${score} de ${total} correctamente.`, `You answered ${score} out of ${total} correctly.`)}</p>
            
            <div class="bg-[var(--brand-card)] p-4 rounded-xl border border-[var(--brand-border)] mb-8 flex justify-around">
                <div>
                    <div class="text-xs text-[var(--brand-text-muted)] uppercase">Tiempo</div>
                    <div class="font-mono font-bold text-[var(--brand-text)]">${formatTime(state.elapsedSeconds)}</div>
                </div>
                <div>
                    <div class="text-xs text-[var(--brand-text-muted)] uppercase">Modo</div>
                    <div class="font-bold text-[var(--brand-text)] capitalized">${state.mode}</div>
                </div>
            </div>

            <div class="flex flex-col gap-3">
                <button onclick="window.simController.quit()" class="w-full py-4 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text)] font-bold hover:bg-[var(--brand-bg)]">
                    ${t("Volver al Inicio", "Back to Home")}
                </button>
                <button onclick="window.simController.start()" class="w-full py-4 rounded-xl bg-[rgb(var(--brand-blue-rgb))] text-white font-bold shadow-lg hover:brightness-110">
                    ${t("Intentar de Nuevo", "Try Again")}
                </button>
            </div>
        </div>
    `;
  }

  // ===== PUBLIC API =====
  window.renderSimulatorPage = function() {
    if (state.isLoading) return renderLoading();
    if (state.error) return `<div class="p-10 text-center text-red-500 font-bold">${state.error} <br><button onclick="loadQuestions()" class="mt-4 underline">Reintentar</button></div>`;
    if (state.activeSession.length === 0) return renderLobby();
    if (state.isRationaleMode) return renderRationale();
    return renderActiveQuiz();
  };

  window.simController = {
    setLimit: (n) => { state.limit = n; savePrefs(); renderNow(); },
    setMode: (m) => { state.mode = m; savePrefs(); renderNow(); },
    toggleCategory: (c) => { 
        if(state.selectedCategories.includes(c)) state.selectedCategories = state.selectedCategories.filter(x => x!==c);
        else state.selectedCategories.push(c);
        savePrefs(); renderNow();
    },
    selectAll: () => { state.selectedCategories = Object.keys(state.categories); savePrefs(); renderNow(); },
    clearSelected: () => { state.selectedCategories = []; savePrefs(); renderNow(); },
    start: startQuiz,
    select: (id) => {
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
    quit: () => { 
        if(confirm(t("¿Seguro que quieres salir?", "Are you sure?"))) {
            stopTimer();
            state.activeSession = []; 
            renderNow(); 
        }
    }
  };

  // Init
  loadPrefs();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadQuestions);
  else loadQuestions();

  window.addEventListener('languagechange', renderNow);

})();