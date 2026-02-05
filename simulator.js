/* simulator.js — Motor Cloud FINAL (Clinical Audit + Resilience) */

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
    fontSize: 1, // 1 = normal, 1.1 = large, 1.2 = x-large
    isRationaleMode: false // FIX: Track view state to prevent reverting to question on re-render
  };

  // --- HELPER BILINGÜE ---
  const bilingual = (es, en) => {
      return `<span class="lang-es">${es || ''}</span><span class="lang-en hidden-lang">${en || es || ''}</span>`;
  };
  
  const getBilingualText = (obj, field) => {
      const es = obj[field + 'Es'] || obj[field];
      const en = obj[field + 'En'] || es;
      return bilingual(es, en);
  };

  // --- PARSER CSV ROBUSTO ---
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
              } else { current += char; }
          } else {
              if (char === '"') { inQuote = true; } 
              else if (char === ',') { result.push(current.trim()); current = ''; } 
              else { current += char; }
          }
      }
      result.push(current.trim());
      return result;
  }

  // --- CONEXIÓN RESILIENTE ---
  async function fetchWithFallback(url) {
      const strategies = [
          { name: "Primary Proxy", url: `https://corsproxy.io/?${encodeURIComponent(url)}` },
          { name: "Backup Proxy", url: `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` },
          { name: "Direct", url: url } // Fallback final (funciona si el navegador no bloquea CORS o en ciertos entornos)
      ];
      
      let lastError = null;
      for (const strategy of strategies) {
          try {
              console.log(`Attempting connection via ${strategy.name}...`);
              const response = await fetch(`${strategy.url}&t=${Date.now()}`); 
              if (!response.ok) throw new Error(`HTTP ${response.status}`);
              const text = await response.text();
              
              // Validación de integridad básica
              if (text.trim().startsWith("<!DOCTYPE") || text.includes("<html")) throw new Error("Invalid HTML response received (expected CSV).");
              if (text.length < 50) throw new Error("Response too short (Empty Data).");
              
              return text;
          } catch (e) { 
              console.warn(`Strategy ${strategy.name} failed:`, e);
              lastError = e; 
          }
      }
      throw lastError;
  }

  async function loadQuestions() {
    state.isLoading = true;
    state.error = null;
    checkAndRender();
    try {
      const csvData = await fetchWithFallback(GOOGLE_CSV_URL);
      parseAndLoad(csvData);
    } catch (e) {
      console.error("🔥 Simulator Critical Failure:", e);
      state.error = `Connection Error: Unable to reach Clinical Database.<br><span class="text-xs text-gray-400">${e.message}</span>`;
      state.isLoading = false;
      checkAndRender();
    }
  }

  function parseAndLoad(csvText) {
      try {
          // Normalizar saltos de línea para evitar errores de parseo
          const rows = csvText.replace(/\r\n/g, '\n').split('\n');
          const parsed = [];
          
          for(let i=1; i<rows.length; i++) {
              const row = rows[i];
              if(!row || row.trim() === '') continue;
              
              const cols = parseCSVRow(row);
              if (cols.length < 15) continue; 
              
              try {
                  const q = {
                    id: cols[0],
                    category: cols[1] || 'General',
                    textEs: cols[2],
                    textEn: cols[3],
                    options: [
                      { id: 'a', textEs: cols[4], textEn: cols[5], correct: isCorrect(cols[12], 'a') },
                      { id: 'b', textEs: cols[6], textEn: cols[7], correct: isCorrect(cols[12], 'b') },
                      { id: 'c', textEs: cols[8], textEn: cols[9], correct: isCorrect(cols[12], 'c') },
                      { id: 'd', textEs: cols[10], textEn: cols[11], correct: isCorrect(cols[12], 'd') },
                    ],
                    rationaleEs: cols[13],
                    rationaleEn: cols[14],
                    type: (cols[15] || '').toLowerCase().includes('sata') ? 'sata' : 'single',
                    tags: [cols[1], cols[15]].filter(Boolean)
                  };
                  // Validación mínima de contenido
                  if(q.textEs && q.textEs.length > 5 && q.options.some(o => o.textEs)) {
                      parsed.push(q);
                  }
              } catch(err) { console.warn("Row parse error:", err); }
          }
          
          if (parsed.length === 0) throw new Error("No valid questions parsed from CSV.");
          
          state.allQuestions = parsed;
          state.categories = {};
          parsed.forEach(q => {
              const cat = q.category.trim() || 'General';
              state.categories[cat] = (state.categories[cat] || 0) + 1;
          });
          
          window.SIMULATOR_QUESTIONS = parsed;
          state.isLoading = false;
          checkAndRender();
          
          // Re-aplicar idioma globalmente
          if(window.nclexApp && window.nclexApp.toggleLanguage) {
              const currentLang = localStorage.getItem('nclex_lang') || 'es';
              document.documentElement.lang = currentLang;
              const isEs = currentLang === 'es';
              document.querySelectorAll('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
              document.querySelectorAll('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
          }

      } catch (parseError) {
          state.error = "Data Corruption: The clinical database format is invalid.";
          state.isLoading = false;
          checkAndRender();
      }
  }

  function isCorrect(str, letter) { return str && str.toLowerCase().includes(letter.toLowerCase()); }

  // --- ICONOS Y ESTILOS ---
  function getCategoryStyle(catName) {
      const n = (catName || '').toLowerCase();
      // Maternidad
      if(n.includes('newborn') || n.includes('neo')) return { i: 'baby', c: 'text-pink-400' };
      if(n.includes('matern') || n.includes('labor')) return { i: 'person-pregnant', c: 'text-rose-500' };
      if(n.includes('pediat')) return { i: 'child-reaching', c: 'text-yellow-500' };
      // Sistemas
      if(n.includes('cardio')) return { i: 'heart-pulse', c: 'text-red-500' };
      if(n.includes('respir')) return { i: 'lungs', c: 'text-blue-400' };
      if(n.includes('neuro') || n.includes('psych')) return { i: 'brain', c: 'text-purple-500' };
      // Farmacología
      if(n.includes('pharm')) return { i: 'pills', c: 'text-indigo-500' };
      // Safety/Infection
      if(n.includes('infect') || n.includes('safety')) return { i: 'shield-virus', c: 'text-green-500' };
      
      // Default
      return { i: 'notes-medical', c: 'text-brand-blue' }; 
  }

  // --- ESTRATEGIAS CLÍNICAS (PEDAGOGÍA) ---
  function getClinicalTip(category) {
      const n = (category || '').toLowerCase();
      if(n.includes('pharm')) return bilingual("💊 <strong>Tip:</strong> Revisa siempre <em>Contraindicaciones</em> y <em>Niveles Terapéuticos</em> antes de administrar.", "💊 <strong>Tip:</strong> Always check <em>Contraindications</em> and <em>Therapeutic Levels</em> before admin.");
      if(n.includes('priorit')) return bilingual("🚨 <strong>Tip:</strong> Usa el método <em>Estable vs. Inestable</em>. ¿Quién muere si no actúas AHORA?", "🚨 <strong>Tip:</strong> Use <em>Stable vs. Unstable</em>. Who dies if you don't act NOW?");
      if(n.includes('infect')) return bilingual("🦠 <strong>Tip:</strong> Piensa en la transmisión: ¿Contacto, Gotas o Aire? PPE adecuado.", "🦠 <strong>Tip:</strong> Transmission: Contact, Droplet, or Airborne? Proper PPE.");
      return bilingual("🧠 <strong>Estrategia:</strong> Lee la pregunta dos veces. ¿Qué está preguntando REALMENTE?", "🧠 <strong>Strategy:</strong> Read the stem twice. What is it REALLY asking?");
  }

  // --- RENDERIZADO ---
  function checkAndRender() {
      // Solo renderizar si estamos en la ruta correcta
      if (window.nclexApp && window.nclexApp.currentRoute === 'simulator') {
          renderNow();
      }
  }

  function renderNow() {
      const view = document.getElementById('app-view');
      // UX Fix: Scroll to top on render
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if(view && window.renderSimulatorPage) {
          view.innerHTML = window.renderSimulatorPage();
          const currentLang = localStorage.getItem('nclex_lang') || 'es';
          const isEs = currentLang === 'es';
          view.querySelectorAll('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
          view.querySelectorAll('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      }
  }

  window.renderSimulatorPage = function() {
    if (state.isLoading) return `
        <div class="min-h-[60vh] flex flex-col items-center justify-center animate-pulse">
            <i class="fa-solid fa-satellite-dish text-6xl text-brand-blue mb-6 animate-bounce"></i>
            <h2 class="text-xl font-bold text-gray-700 dark:text-gray-300">
                <span class="lang-es">Conectando a la Base de Datos Clínica...</span>
                <span class="lang-en hidden-lang">Connecting to Clinical Database...</span>
            </h2>
            <p class="text-sm text-gray-400 mt-2">
                <span class="lang-es">Sincronizando Ítems NCLEX</span>
                <span class="lang-en hidden-lang">Syncing NCLEX Items</span>
            </p>
        </div>`;
        
    if (state.error) return `
        <div class="p-10 text-center border-2 border-red-100 rounded-3xl bg-red-50 dark:bg-red-900/10">
            <i class="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
            <h3 class="text-lg font-bold text-red-700 dark:text-red-400 mb-2">System Error</h3>
            <p class="text-red-600 dark:text-red-300 mb-6">${state.error}</p>
            <button onclick="window.simController.forceReload()" class="bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 transition-all">
                <i class="fa-solid fa-rotate-right mr-2"></i> Retry Connection
            </button>
        </div>`;
    
    // Check for Rationale Mode FIRST to maintain view
    if (state.activeSession.length > 0 && state.isRationaleMode) return renderRationale();
    if (state.activeSession.length > 0) return renderActiveQuiz();
    
    return renderLobby();
  };

  function renderLobby() {
    const limitBtn = (val, label) => {
        const isActive = state.limit === val;
        const style = isActive ? "bg-brand-blue text-white ring-2 ring-brand-blue ring-offset-2" : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/5";
        return `<button onclick="window.simController.setLimit(${val})" class="px-4 py-2 rounded-lg text-sm font-bold transition-all ${style}">${label}</button>`;
    };

    const cats = Object.entries(state.categories).map(([c, n]) => {
        const style = getCategoryStyle(c);
        return `
        <button onclick="window.simController.startQuiz('${c}')" class="p-5 bg-white dark:bg-brand-card border border-gray-100 dark:border-brand-border rounded-xl shadow-sm hover:shadow-md text-left transition-all hover:-translate-y-1 group relative overflow-hidden">
            <div class="absolute right-0 top-0 p-2 opacity-5"><i class="fa-solid fa-${style.i} text-6xl"></i></div>
            <div class="flex justify-between items-center relative z-10">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                        <i class="fa-solid fa-${style.i} text-lg ${style.c} group-hover:scale-110 transition-transform"></i>
                    </div>
                    <div>
                        <span class="font-bold text-slate-800 dark:text-white group-hover:text-brand-blue truncate block text-sm" title="${c}">${c}</span>
                        <span class="text-[10px] text-gray-400 font-medium">${n} ${bilingual("preguntas", "questions")}</span>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-right text-gray-300 group-hover:text-brand-blue transition-colors"></i>
            </div>
         </button>`;
    }).join('');

    return `
    <div class="max-w-5xl mx-auto animate-fade-in pb-20">
        <header class="mb-10 text-center">
            <h1 class="text-3xl lg:text-4xl font-black mb-3 text-slate-900 dark:text-white">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-purple-600">NCLEX Simulator</span>
            </h1>
            <p class="text-gray-500 font-medium max-w-xl mx-auto">
                ${bilingual("Practica con preguntas estilo examen real, incluyendo SATA y priorización.", "Practice with real exam-style questions, including SATA and prioritization.")}
            </p>
        </header>

        <div class="bg-white dark:bg-brand-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-brand-border mb-10">
            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 class="font-bold text-gray-700 dark:text-gray-200 mb-2 text-sm uppercase tracking-wide">${bilingual("Configuración de Sesión", "Session Config")}</h3>
                    <div class="flex gap-2">
                        ${limitBtn(10, '10')} ${limitBtn(25, '25')} ${limitBtn(50, '50')} ${limitBtn(9999, bilingual('Max', 'Max'))}
                    </div>
                </div>
                <div class="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                <button onclick="window.simController.startQuiz('ALL')" class="w-full md:w-auto px-8 py-4 bg-gradient-to-br from-brand-blue to-blue-700 text-white rounded-xl font-bold shadow-lg hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3">
                    <i class="fa-solid fa-play"></i>
                    <div class="text-left">
                        <div class="text-xs opacity-80 font-normal uppercase">${bilingual("Modo Rápido", "Quick Mode")}</div>
                        <div class="leading-none">${bilingual("Iniciar Mix Aleatorio", "Start Random Mix")}</div>
                    </div>
                </button>
            </div>
        </div>

        <h3 class="font-bold text-gray-700 dark:text-gray-200 mb-4 text-sm uppercase tracking-wide px-2">${bilingual("Categorías Clínicas", "Clinical Categories")}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${cats}
        </div>
        
        <div class="mt-12 text-center">
            <button onclick="window.simController.forceReload()" class="text-xs text-gray-400 hover:text-brand-blue font-bold flex items-center justify-center gap-2 mx-auto transition-colors px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
                <i class="fa-solid fa-rotate"></i> ${bilingual("Sincronizar Base de Datos", "Sync Database")}
            </button>
        </div>
    </div>`;
  }

  function renderActiveQuiz() {
      const q = state.activeSession[state.currentIndex];
      if(!q) return renderResults();
      const pct = Math.round(((state.currentIndex) / state.activeSession.length) * 100);
      const styleIcon = getCategoryStyle(q.category);
      const strategyTip = getClinicalTip(q.category);

      const opts = q.options.map(o => {
          const isSelected = state.userSelection.includes(o.id);
          const activeClass = isSelected 
            ? 'border-brand-blue bg-blue-50 dark:bg-blue-900/20 ring-1 ring-brand-blue shadow-md' 
            : 'border-gray-200 dark:border-gray-700 hover:border-brand-blue/50 hover:bg-gray-50 dark:hover:bg-white/5';
          
          return `
          <button onclick="window.simController.selectOption('${o.id}')" class="w-full text-left p-4 md:p-5 border-2 rounded-2xl mb-3 transition-all flex items-start gap-4 group ${activeClass}">
             <div class="mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-brand-blue border-brand-blue text-white' : 'border-gray-300 text-gray-400 group-hover:border-brand-blue group-hover:text-brand-blue'} transition-colors font-bold text-xs uppercase">
                ${isSelected ? '<i class="fa-solid fa-check"></i>' : o.id}
             </div>
             <div class="text-sm md:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed" style="font-size: ${state.fontSize}rem">
                ${getBilingualText(o, 'text')}
             </div>
          </button>`;
      }).join('');

      return `
      <div class="max-w-3xl mx-auto animate-fade-in pb-32">
        <div class="flex justify-between items-center mb-6">
            <button onclick="window.simController.quit()" class="text-gray-400 hover:text-red-500 font-bold text-xs flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                <i class="fa-solid fa-xmark"></i> ${bilingual("SALIR", "EXIT")}
            </button>
            <div class="flex items-center gap-2">
                 <button onclick="window.simController.adjustFont(-0.1)" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 text-xs font-bold" title="Smaller Text">A-</button>
                 <button onclick="window.simController.adjustFont(0.1)" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 text-xs font-bold" title="Larger Text">A+</button>
            </div>
            <span class="text-xs font-bold text-brand-blue bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full font-mono">
                ${state.currentIndex + 1} / ${state.activeSession.length}
            </span>
        </div>
        
        <div class="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mb-8 overflow-hidden">
            <div class="h-full bg-brand-blue transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" style="width:${pct}%"></div>
        </div>
        
        <div class="bg-white dark:bg-brand-card p-6 md:p-10 rounded-[2rem] shadow-xl border border-gray-100 dark:border-brand-border relative overflow-hidden">
            
            <div class="flex items-start justify-between mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0 ${styleIcon.c}">
                        <i class="fa-solid fa-${styleIcon.i}"></i>
                    </div>
                    <div>
                        <span class="text-[10px] uppercase text-gray-400 font-black tracking-widest block">${q.category}</span>
                        ${q.type === 'sata' 
                            ? `<span class="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 animate-pulse">
                                <i class="fa-solid fa-check-double mr-1"></i>SELECT ALL THAT APPLY
                               </span>` 
                            : ''}
                    </div>
                </div>
            </div>

            <h2 class="text-xl md:text-2xl font-bold mb-8 dark:text-white leading-relaxed" style="font-size: ${state.fontSize * 1.2}rem">
                ${getBilingualText(q, 'text')}
            </h2>

            <div class="mb-8 space-y-3">${opts}</div>

            <div class="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-xl border border-yellow-100 dark:border-yellow-900/30 mb-6 flex gap-3 items-start">
                 <i class="fa-solid fa-lightbulb text-yellow-500 mt-1"></i>
                 <p class="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed">${strategyTip}</p>
            </div>

            <button onclick="window.simController.submit()" class="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${state.userSelection.length>0?'bg-slate-900 dark:bg-brand-blue hover:bg-slate-800':'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}" ${state.userSelection.length===0?'disabled':''}>
                ${bilingual("Confirmar Respuesta", "Submit Answer")} <i class="fa-solid fa-paper-plane"></i>
            </button>
        </div>
      </div>`;
  }

  function renderRationale() {
      // UX Fix: Scroll top on rationale
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const q = state.activeSession[state.currentIndex];
      const correctIds = q.options.filter(o=>o.correct).map(o=>o.id);
      
      const isCorrect = (q.type==='single') 
        ? correctIds.includes(state.userSelection[0]) 
        : (correctIds.length===state.userSelection.length && correctIds.every(i=>state.userSelection.includes(i)) && state.userSelection.every(i=>correctIds.includes(i)));
      
      // Removed score increment from render to prevent inflation

      // Formateo inteligente del rationale (detecta párrafos)
      const rawRationale = getBilingualText(q, 'rationale');
      const formattedRationale = rawRationale.replace(/\n/g, '<br><br>');

      return `
      <div class="max-w-3xl mx-auto animate-fade-in pb-32 pt-6">
        <div class="bg-white dark:bg-brand-card p-8 rounded-[2.5rem] shadow-xl border-t-8 ${isCorrect?'border-green-500':'border-red-500'}">
            
            <div class="flex items-center gap-5 mb-8">
                <div class="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl shadow-xl transform ${isCorrect?'bg-green-500 rotate-[-10deg]':'bg-red-500 rotate-[10deg]'}">
                    <i class="fa-solid ${isCorrect?'fa-check':'fa-xmark'}"></i>
                </div>
                <div>
                    <h2 class="text-3xl font-black dark:text-white leading-none mb-1">${isCorrect ? bilingual("¡Correcto!", "Correct!") : bilingual("Incorrecto", "Incorrect")}</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        ${isCorrect ? bilingual("Excelente juicio clínico.", "Great clinical judgment.") : bilingual("Revisa la explicación detallada.", "Review the detailed rationale.")}
                    </p>
                </div>
            </div>

            <div class="bg-gray-50 dark:bg-black/20 p-6 md:p-8 rounded-3xl mb-8 border border-gray-100 dark:border-white/5">
                <h3 class="font-bold text-xs text-gray-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                    <i class="fa-solid fa-book-medical text-brand-blue"></i> ${bilingual("Rationale / Explicación", "Rationale / Explanation")}
                </h3>
                <div class="text-slate-700 dark:text-gray-300 leading-loose text-sm md:text-base prose dark:prose-invert max-w-none">
                    ${formattedRationale}
                </div>
            </div>

            <button onclick="window.simController.next()" class="w-full py-4 bg-brand-blue text-white rounded-xl font-bold shadow-lg hover:shadow-brand-blue/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
                ${bilingual("Siguiente Pregunta", "Next Question")} <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </button>
        </div>
      </div>`;
  }

  function renderResults() {
      const pct = Math.round((state.score/state.activeSession.length)*100) || 0;
      let msg = "";
      if (pct >= 85) msg = bilingual("🌟 ¡Nivel Experto! Listo para NCLEX.", "🌟 Expert Level! Ready for NCLEX.");
      else if (pct >= 60) msg = bilingual("✅ Buen trabajo, sigue así.", "✅ Good job, keep pushing.");
      else msg = bilingual("⚠️ Necesitas reforzar contenido.", "⚠️ Content review needed.");

      return `
      <div class="max-w-md mx-auto text-center py-20 animate-fade-in px-4">
        <div class="bg-white dark:bg-brand-card p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-brand-border relative overflow-hidden">
            <div class="w-40 h-40 rounded-full border-[12px] ${pct>=75?'border-green-500 text-green-500':'border-orange-500 text-orange-500'} flex items-center justify-center mx-auto mb-8 text-5xl font-black shadow-none bg-gray-50 dark:bg-white/5 relative">
                ${pct}%
                <div class="absolute inset-0 rounded-full border-[12px] border-gray-100 dark:border-gray-700 opacity-20" style="z-index:-1"></div>
            </div>
            
            <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">${bilingual("Resultados de Sesión", "Session Results")}</h2>
            <p class="text-sm font-bold text-gray-500 mb-8">${msg}</p>
            
            <div class="flex gap-4 mb-8">
                <div class="flex-1 bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-900/30">
                    <span class="block font-black text-green-600 dark:text-green-400 text-2xl">${state.score}</span>
                    <span class="text-[10px] text-green-600/70 uppercase font-bold tracking-wide">${bilingual("Correctas", "Correct")}</span>
                </div>
                <div class="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <span class="block font-black text-gray-800 dark:text-white text-2xl">${state.activeSession.length}</span>
                    <span class="text-[10px] text-gray-400 uppercase font-bold tracking-wide">${bilingual("Total", "Total")}</span>
                </div>
            </div>
            
            <button onclick="window.simController.quit()" class="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
                <i class="fa-solid fa-house mr-2"></i> ${bilingual("Volver al Inicio", "Back to Home")}
            </button>
        </div>
      </div>`;
  }

  // --- CONTROLADOR GLOBAL ---
  window.simController = {
      setLimit(n) { state.limit = n; renderNow(); },
      adjustFont(delta) { 
          state.fontSize = Math.max(0.8, Math.min(1.5, state.fontSize + delta)); 
          renderNow(); 
      },
      
      startQuiz(c) {
          let pool = c === 'ALL' ? [...state.allQuestions] : state.allQuestions.filter(q => q.category === c);
          pool.sort(() => Math.random() - 0.5);
          if (state.limit < pool.length) pool = pool.slice(0, state.limit);
          
          state.activeSession = pool; 
          state.currentIndex = 0; 
          state.score = 0; 
          state.userSelection = [];
          state.isRationaleMode = false; // Reset state
          renderNow();
      },
      
      selectOption(id) { 
          const q = state.activeSession[state.currentIndex];
          if(q.type==='single') {
              state.userSelection=[id];
          } else {
              if(state.userSelection.includes(id)) state.userSelection=state.userSelection.filter(x=>x!==id);
              else state.userSelection.push(id);
          }
          renderNow();
      },
      
      submit() { 
          // FIX: Calculate score HERE, not in render
          const q = state.activeSession[state.currentIndex];
          const correctIds = q.options.filter(o=>o.correct).map(o=>o.id);
          const isCorrect = (q.type==='single') 
            ? correctIds.includes(state.userSelection[0]) 
            : (correctIds.length===state.userSelection.length && correctIds.every(i=>state.userSelection.includes(i)) && state.userSelection.every(i=>correctIds.includes(i)));
          
          if(isCorrect) state.score++;

          state.isRationaleMode = true;
          renderNow(); // Use renderNow to maintain consistency
      },
      
      next() { 
          state.currentIndex++; 
          state.userSelection=[]; 
          state.isRationaleMode = false;
          if(state.currentIndex>=state.activeSession.length) {
              document.getElementById('app-view').innerHTML=renderResults(); 
          } else {
              renderNow(); 
          }
      },
      
      quit() { 
          state.activeSession=[]; 
          state.userSelection=[];
          state.isRationaleMode = false;
          renderNow(); 
      },
      
      forceReload() { 
          state.allQuestions=[]; 
          state.error = null; 
          loadQuestions(); 
      }
  };
  
  window.showSimulatorQuestion = function(index) {
      if(!state.allQuestions[index]) return;
      state.activeSession = [state.allQuestions[index]]; 
      state.currentIndex = 0; 
      state.score = 0; 
      state.userSelection = [];
      state.isRationaleMode = false;
      renderNow();
  };

  // Inicialización segura (esperar DOM)
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadQuestions);
  } else {
      loadQuestions();
  }

})();