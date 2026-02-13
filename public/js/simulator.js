/* simulator.js — Motor Cloud FINAL (PROD) v4.0
   MEJORAS: Exportación PDF, Sync de Idioma, Racionales Robustos
*/

(function () {
  'use strict';

  // ===== DEPENDENCIAS SEGURAS =====
  const U = window.NCLEXUtils || (() => {
    // Fallback mínimo si utils no ha cargado
    return {
      $: (s) => document.querySelector(s),
      $$: (s) => Array.from(document.querySelectorAll(s)),
      storageGet: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } },
      storageSet: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
      debounce: (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; },
      escapeHtml: (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
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
    sessionHistory: [], // Para guardar respuestas y generar PDF
    currentIndex: 0,
    score: 0,
    userSelection: [],
    isLoading: true,
    categories: {},
    error: null,
    limit: 10,
    fontSize: 1,
    isRationaleMode: false,
    selectedCategories: [],
    pendingShowQuestionIndex: null
  };

  // ===== HELPERS DE IDIOMA =====

  function getLang() {
    // PRIORIDAD 1: Estado global de la App (logic.js)
    if (window.nclexApp && typeof window.nclexApp.getCurrentLang === 'function') {
      return window.nclexApp.getCurrentLang();
    }
    // PRIORIDAD 2: localStorage
    return storageGet(CONFIG.STORAGE_KEYS.lang, 'es');
  }

  function bilingual(es, en) {
    // Genera HTML con ambas versiones para toggle rápido por CSS
    const esText = es || '';
    const enText = en || es || '';
    return `<span class="lang-es">${esText}</span><span class="lang-en hidden-lang">${enText}</span>`;
  }

  function applyGlobalLanguage(root) {
    try {
      const currentLang = getLang();
      const isEs = currentLang === 'es';
      
      const scope = root || document;
      const langEs = scope.querySelectorAll('.lang-es');
      const langEn = scope.querySelectorAll('.lang-en');
      
      langEs.forEach(el => el.classList.toggle('hidden-lang', !isEs));
      langEn.forEach(el => el.classList.toggle('hidden-lang', isEs));
      
      // Sincronizar documento
      document.documentElement.lang = currentLang;
    } catch (e) {
      console.warn('Error applying language:', e);
    }
  }

  // ===== HELPERS DE TEXTO =====
  
  function safeRichText(input) {
    const raw = (input || '').toString();
    // Permitir etiquetas básicas de formato
    let processed = escapeHtml(raw);
    
    // Restaurar etiquetas seguras
    const tags = ['br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'span'];
    tags.forEach(tag => {
        const regexOpen = new RegExp(`&lt;${tag}&gt;`, 'gi');
        const regexClose = new RegExp(`&lt;/${tag}&gt;`, 'gi');
        processed = processed.replace(regexOpen, `<${tag}>`).replace(regexClose, `</${tag}>`);
    });
    
    // Convertir saltos de línea
    processed = processed.replace(/\n/g, '<br>');
    
    return processed;
  }

  // ===== GENERADOR PDF =====

  function downloadReport() {
    const isEs = getLang() === 'es';
    const title = isEs ? 'Reporte de Resultados NCLEX' : 'NCLEX Results Report';
    const date = new Date().toLocaleString();
    const scoreText = `${state.score} / ${state.activeSession.length}`;
    
    let content = `
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #333; }
          h1 { color: #007bff; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          .meta { margin-bottom: 30px; font-size: 14px; color: #666; }
          .q-block { margin-bottom: 30px; page-break-inside: avoid; border: 1px solid #eee; padding: 15px; border-radius: 8px; }
          .q-title { font-weight: bold; margin-bottom: 10px; font-size: 16px; }
          .q-cat { font-size: 10px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 5px; }
          .opt { margin: 5px 0; padding: 5px; font-size: 14px; }
          .correct { background-color: #d4edda; color: #155724; border-left: 4px solid #28a745; }
          .wrong { background-color: #f8d7da; color: #721c24; border-left: 4px solid #dc3545; }
          .rationale { margin-top: 10px; background: #f8f9fa; padding: 10px; border-left: 4px solid #007bff; font-size: 13px; font-style: italic; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Score:</strong> ${scoreText}</p>
          <p><strong>Student:</strong> Reynier Diaz Gerones</p>
        </div>
    `;

    state.sessionHistory.forEach((item, idx) => {
        const q = item.question;
        const text = isEs ? q.textEs : (q.textEn || q.textEs);
        const rationale = isEs ? q.rationaleEs : (q.rationaleEn || q.rationaleEs);
        
        content += `<div class="q-block">
            <div class="q-cat">${q.category}</div>
            <div class="q-title">Q${idx + 1}: ${text}</div>`;
            
        q.options.forEach(opt => {
            const optText = isEs ? opt.textEs : (opt.textEn || opt.textEs);
            const isSelected = item.selected.includes(opt.id);
            const isCorrect = opt.correct;
            let className = 'opt';
            
            if (isCorrect) className += ' correct';
            else if (isSelected) className += ' wrong'; // Selected but wrong
            
            let icon = '⚪';
            if (isCorrect) icon = '✅';
            else if (isSelected) icon = '❌';

            content += `<div class="${className}">${icon} ${optText}</div>`;
        });

        if (rationale) {
            content += `<div class="rationale"><strong>Rationale:</strong> ${rationale}</div>`;
        }
        
        content += `</div>`;
    });

    content += `
        <script>window.print();</script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
    } else {
        alert('Please allow popups to download the PDF.');
    }
  }

  // ===== LOGIC DE CARGA =====

  async function loadQuestions() {
    state.isLoading = true;
    checkAndRender();
    
    try {
      // Usar proxy para evitar problemas de CORS
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(GOOGLE_CSV_URL)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Network error');
      
      const csvText = await response.text();
      parseAndLoad(csvText);
      
    } catch (e) {
      console.error("Error loading CSV:", e);
      state.error = `Error loading database: ${e.message}`;
      state.isLoading = false;
      checkAndRender();
    }
  }

  function parseAndLoad(text) {
    try {
        const rows = parseCSV(text); // Helper simple de CSV
        const parsed = [];
        
        // Asumimos estructura: ID, Category, QuestionES, QuestionEN, A_ES, A_EN, B_ES, B_EN, ... Correct, RationaleES, RationaleEN
        // Saltamos header row 0
        for(let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if(row.length < 10) continue; 
            
            // Mapeo seguro de columnas (ajustar según tu CSV real)
            const q = {
                id: row[0],
                category: row[1] || 'General',
                textEs: row[2],
                textEn: row[3] || row[2],
                options: [
                    { id: 'a', textEs: row[4], textEn: row[5], correct: false },
                    { id: 'b', textEs: row[6], textEn: row[7], correct: false },
                    { id: 'c', textEs: row[8], textEn: row[9], correct: false },
                    { id: 'd', textEs: row[10], textEn: row[11], correct: false }
                ],
                correctRaw: row[12],
                rationaleEs: row[13],
                rationaleEn: row[14],
                type: (row[15] || '').toLowerCase().includes('sata') ? 'sata' : 'single'
            };

            // Marcar correctas
            const correctKeys = (q.correctRaw || '').toLowerCase();
            q.options.forEach(opt => {
                if(correctKeys.includes(opt.id)) opt.correct = true;
            });
            
            // Validar que tenga al menos una correcta
            if(q.options.some(o => o.correct)) {
                parsed.push(q);
            }
        }
        
        state.allQuestions = parsed;
        
        // Extraer categorías
        const cats = {};
        parsed.forEach(p => {
            const c = p.category.trim();
            cats[c] = (cats[c] || 0) + 1;
        });
        state.categories = cats;
        
        state.isLoading = false;
        checkAndRender();

    } catch (e) {
        state.error = "Error parsing CSV data";
        state.isLoading = false;
        checkAndRender();
    }
  }

  function parseCSV(str) {
      const arr = [];
      let quote = false;
      let col = 0, c = 0;
      for (; c < str.length; c++) {
          let cc = str[c], nc = str[c+1];
          arr[col] = arr[col] || [];
          arr[col][0] = arr[col][0] || "";
          
          if (cc == '"' && quote && nc == '"') { arr[col][arr[col].length-1] += cc; ++c; continue; }
          if (cc == '"') { quote = !quote; continue; }
          if (cc == ',' && !quote) { ++col; continue; }
          if (cc == '\r' && nc == '\n' && !quote) { ++col; continue; }
          if (cc == '\n' && !quote) { ++col; continue; }
          if (cc == '\r' && !quote) { ++col; continue; }
          
          arr[col][arr[col].length-1] += cc;
      }
      return arr;
  }

  // ===== RENDERIZADO =====

  function checkAndRender() {
     const view = document.getElementById('app-view');
     if(view && window.nclexApp && window.nclexApp.getCurrentRoute() === 'simulator') {
         view.innerHTML = window.renderSimulatorPage();
         applyGlobalLanguage(view);
     }
  }

  function renderLobby() {
      const cats = Object.keys(state.categories);
      return `
        <div class="animate-fade-in">
            <h1 class="text-3xl font-black mb-6 text-[var(--brand-text)]">${bilingual('Simulador NCLEX', 'NCLEX Simulator')}</h1>
            
            <div class="bg-[var(--brand-card)] p-6 rounded-3xl shadow-lg border border-[var(--brand-border)] mb-8">
                <h2 class="text-xl font-bold mb-4 text-[var(--brand-text)]">${bilingual('Selecciona Temas', 'Select Topics')}</h2>
                <div class="flex flex-wrap gap-2 mb-6">
                    ${cats.map(c => `
                        <button onclick="window.simController.toggleCat('${c}')" 
                            class="px-4 py-2 rounded-full text-sm font-bold border transition-all ${state.selectedCategories.includes(c) ? 'bg-[rgb(var(--brand-blue-rgb))] text-white border-transparent' : 'bg-[var(--brand-bg)] text-[var(--brand-text-muted)] border-[var(--brand-border)] hover:border-[rgb(var(--brand-blue-rgb))]'}">
                            ${c} <span class="opacity-60 ml-1">(${state.categories[c]})</span>
                        </button>
                    `).join('')}
                </div>
                
                <div class="flex flex-wrap gap-4 items-center">
                    <button onclick="window.simController.start()" 
                        class="px-8 py-3 rounded-xl font-black text-white shadow-lg hover:scale-105 transition-transform"
                        style="background-color: rgb(var(--brand-blue-rgb));">
                        ${bilingual('COMENZAR EXAMEN', 'START EXAM')}
                    </button>
                    
                    <select id="sim-limit" onchange="window.simController.setLimit(this.value)" class="bg-[var(--brand-bg)] border border-[var(--brand-border)] rounded-xl px-4 py-3 font-bold text-[var(--brand-text)]">
                        <option value="10">10 ${bilingual('Preguntas', 'Questions')}</option>
                        <option value="25">25 ${bilingual('Preguntas', 'Questions')}</option>
                        <option value="50">50 ${bilingual('Preguntas', 'Questions')}</option>
                        <option value="100">100 ${bilingual('Preguntas', 'Questions')}</option>
                    </select>
                </div>
            </div>
        </div>
      `;
  }

  function renderQuiz() {
      const q = state.activeSession[state.currentIndex];
      const total = state.activeSession.length;
      const progress = ((state.currentIndex + 1) / total) * 100;
      
      return `
        <div class="max-w-4xl mx-auto animate-fade-in">
            <div class="flex justify-between items-end mb-2 px-2">
                <span class="text-sm font-bold text-[var(--brand-text-muted)]">${bilingual('Pregunta', 'Question')} ${state.currentIndex + 1} / ${total}</span>
                <span class="text-xs font-bold px-2 py-1 rounded bg-[var(--brand-bg)] text-[var(--brand-text-muted)]">${q.category}</span>
            </div>
            <div class="h-2 bg-[var(--brand-bg)] rounded-full overflow-hidden mb-6">
                <div class="h-full bg-[rgb(var(--brand-blue-rgb))] transition-all duration-300" style="width: ${progress}%"></div>
            </div>

            <div class="bg-[var(--brand-card)] p-6 md:p-8 rounded-3xl shadow-xl border border-[var(--brand-border)] mb-6">
                <p class="text-xl md:text-2xl font-bold text-[var(--brand-text)] mb-8 leading-relaxed blur-target">
                    ${bilingual(safeRichText(q.textEs), safeRichText(q.textEn))}
                </p>

                <div class="space-y-3">
                    ${q.options.map(opt => {
                        const isSelected = state.userSelection.includes(opt.id);
                        return `
                            <button onclick="window.simController.select('${opt.id}')" 
                                class="w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 hover:bg-[var(--brand-bg)]
                                ${isSelected ? 'border-[rgb(var(--brand-blue-rgb))] bg-[rgba(var(--brand-blue-rgb),0.05)]' : 'border-[var(--brand-border)] bg-transparent'}">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 transition-colors
                                    ${isSelected ? 'bg-[rgb(var(--brand-blue-rgb))] text-white' : 'bg-[var(--brand-bg)] text-[var(--brand-text-muted)]'}">
                                    ${opt.id.toUpperCase()}
                                </div>
                                <div class="pt-1 text-[var(--brand-text)] blur-target">
                                    ${bilingual(opt.textEs, opt.textEn)}
                                </div>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="flex justify-between items-center">
                <button onclick="window.simController.quit()" class="text-red-500 font-bold hover:underline px-4">
                    ${bilingual('Salir', 'Quit')}
                </button>
                <button onclick="window.simController.submit()" 
                    class="px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style="background-color: rgb(var(--brand-blue-rgb));"
                    ${state.userSelection.length === 0 ? 'disabled' : ''}>
                    ${bilingual('Responder', 'Submit')}
                </button>
            </div>
        </div>
      `;
  }

  function renderRationaleView() {
      const q = state.activeSession[state.currentIndex];
      const userSel = state.sessionHistory[state.currentIndex].selected;
      
      // Check if correct
      const correctIds = q.options.filter(o => o.correct).map(o => o.id);
      const isCorrect = (q.type === 'single') 
        ? correctIds.includes(userSel[0])
        : (correctIds.length === userSel.length && correctIds.every(id => userSel.includes(id)));

      return `
        <div class="max-w-4xl mx-auto animate-fade-in">
            <div class="mb-6 text-center">
                <div class="inline-flex items-center gap-2 px-6 py-2 rounded-full font-black text-white shadow-md ${isCorrect ? 'bg-green-500' : 'bg-red-500'}">
                    <i class="fa-solid ${isCorrect ? 'fa-check' : 'fa-xmark'}"></i>
                    ${isCorrect ? bilingual('¡CORRECTO!', 'CORRECT!') : bilingual('INCORRECTO', 'INCORRECT')}
                </div>
            </div>

            <div class="bg-[var(--brand-card)] p-6 md:p-8 rounded-3xl shadow-xl border border-[var(--brand-border)] mb-6 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-2 h-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'}"></div>
                
                <h3 class="text-lg font-bold text-[var(--brand-text)] mb-4">${bilingual('Explicación / Rationale:', 'Rationale:')}</h3>
                <div class="prose dark:prose-invert max-w-none text-[var(--brand-text)] mb-6 blur-target bg-[var(--brand-bg)] p-4 rounded-xl border border-[var(--brand-border)]">
                    ${bilingual(safeRichText(q.rationaleEs), safeRichText(q.rationaleEn))}
                </div>

                <h4 class="font-bold text-sm text-[var(--brand-text-muted)] mb-2 uppercase tracking-wider">${bilingual('Opciones:', 'Options:')}</h4>
                <div class="space-y-2">
                    ${q.options.map(opt => {
                        const isOptCorrect = opt.correct;
                        const wasSelected = userSel.includes(opt.id);
                        let style = "border-[var(--brand-border)] opacity-60";
                        let icon = "";

                        if (isOptCorrect) {
                            style = "border-green-500 bg-green-50 dark:bg-green-900/20 opacity-100 font-bold";
                            icon = `<i class="fa-solid fa-check text-green-500"></i>`;
                        } else if (wasSelected) {
                            style = "border-red-500 bg-red-50 dark:bg-red-900/20 opacity-100";
                            icon = `<i class="fa-solid fa-xmark text-red-500"></i>`;
                        }

                        return `
                            <div class="flex items-center gap-3 p-3 rounded-lg border ${style} text-sm">
                                <span class="w-6 shrink-0 text-center">${opt.id.toUpperCase()}</span>
                                <span class="flex-1">${bilingual(opt.textEs, opt.textEn)}</span>
                                ${icon}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="flex justify-end">
                <button onclick="window.simController.next()" 
                    class="px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                    style="background-color: rgb(var(--brand-blue-rgb));">
                    ${bilingual('Siguiente', 'Next')} <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
      `;
  }

  function renderResults() {
      const total = state.activeSession.length;
      const score = state.score;
      const percentage = Math.round((score / total) * 100);
      
      let message = "";
      let color = "";
      
      if(percentage >= 80) { message = "Excellent! You are ready."; color = "text-green-500"; }
      else if(percentage >= 60) { message = "Good job, but keep practicing."; color = "text-yellow-500"; }
      else { message = "Needs improvement. Review the rationales."; color = "text-red-500"; }

      return `
        <div class="max-w-3xl mx-auto text-center animate-fade-in pt-10">
            <div class="w-32 h-32 rounded-full border-8 flex items-center justify-center mx-auto mb-6 text-4xl font-black shadow-xl"
                style="border-color: rgb(var(--brand-blue-rgb)); color: rgb(var(--brand-blue-rgb));">
                ${percentage}%
            </div>
            
            <h2 class="text-3xl font-black text-[var(--brand-text)] mb-2">${bilingual('Resultados', 'Results')}</h2>
            <p class="text-xl ${color} font-bold mb-8">${message}</p>
            
            <div class="grid grid-cols-2 gap-4 max-w-md mx-auto mb-10">
                <div class="bg-[var(--brand-card)] p-4 rounded-2xl border border-[var(--brand-border)] shadow-sm">
                    <div class="text-xs text-[var(--brand-text-muted)] uppercase font-bold">${bilingual('Correctas', 'Correct')}</div>
                    <div class="text-2xl font-black text-green-500">${score}</div>
                </div>
                <div class="bg-[var(--brand-card)] p-4 rounded-2xl border border-[var(--brand-border)] shadow-sm">
                    <div class="text-xs text-[var(--brand-text-muted)] uppercase font-bold">${bilingual('Total', 'Total')}</div>
                    <div class="text-2xl font-black text-[var(--brand-text)]">${total}</div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button onclick="window.simController.quit()" class="px-6 py-3 rounded-xl font-bold bg-[var(--brand-bg)] text-[var(--brand-text)] border border-[var(--brand-border)] hover:bg-[var(--brand-border)] transition">
                    ${bilingual('Volver al Inicio', 'Back to Lobby')}
                </button>
                <button onclick="window.downloadReport()" class="px-6 py-3 rounded-xl font-bold text-white bg-gray-800 hover:bg-gray-900 transition flex items-center justify-center gap-2 shadow-lg">
                    <i class="fa-solid fa-file-pdf"></i> ${bilingual('Descargar Reporte PDF', 'Download PDF Report')}
                </button>
            </div>
        </div>
      `;
  }

  // ===== API GLOBAL =====

  window.renderSimulatorPage = function() {
      if(state.isLoading) return `<div class="p-10 text-center animate-pulse"><div class="text-4xl mb-4">🩺</div><p>${bilingual('Cargando Base de Datos...', 'Loading Database...')}</p></div>`;
      if(state.error) return `<div class="p-10 text-center text-red-500"><div class="text-4xl mb-4">⚠️</div><p>${state.error}</p><button onclick="location.reload()" class="mt-4 px-4 py-2 bg-red-100 rounded-lg">Retry</button></div>`;
      
      if(state.activeSession.length === 0) return renderLobby();
      if(state.currentIndex >= state.activeSession.length) return renderResults();
      if(state.isRationaleMode) return renderRationaleView();
      return renderQuiz();
  };

  window.downloadReport = downloadReport;

  window.simController = {
      toggleCat: (c) => {
          if(state.selectedCategories.includes(c)) state.selectedCategories = state.selectedCategories.filter(x => x !== c);
          else state.selectedCategories.push(c);
          checkAndRender();
      },
      setLimit: (l) => { state.limit = parseInt(l); },
      start: () => {
          let pool = state.allQuestions;
          if(state.selectedCategories.length > 0) {
              pool = pool.filter(q => state.selectedCategories.includes(q.category));
          }
          if(pool.length === 0) { alert('No questions found for selected topics.'); return; }
          
          // Shuffle
          pool = pool.sort(() => Math.random() - 0.5).slice(0, state.limit);
          
          state.activeSession = pool;
          state.sessionHistory = [];
          state.currentIndex = 0;
          state.score = 0;
          state.userSelection = [];
          state.isRationaleMode = false;
          checkAndRender();
      },
      select: (id) => {
          const q = state.activeSession[state.currentIndex];
          if(q.type === 'single') {
              state.userSelection = [id];
          } else {
              if(state.userSelection.includes(id)) state.userSelection = state.userSelection.filter(x => x !== id);
              else state.userSelection.push(id);
          }
          checkAndRender();
      },
      submit: () => {
          const q = state.activeSession[state.currentIndex];
          const userSel = state.userSelection;
          
          // Guardar historia
          state.sessionHistory.push({
              question: q,
              selected: [...userSel]
          });

          // Calcular score
          const correctIds = q.options.filter(o => o.correct).map(o => o.id);
          const isCorrect = (q.type === 'single') 
            ? correctIds.includes(userSel[0])
            : (correctIds.length === userSel.length && correctIds.every(id => userSel.includes(id)));

          if(isCorrect) state.score++;
          
          state.isRationaleMode = true;
          checkAndRender();
      },
      next: () => {
          state.currentIndex++;
          state.userSelection = [];
          state.isRationaleMode = false;
          checkAndRender();
      },
      quit: () => {
          if(confirm('Are you sure you want to quit?')) {
              state.activeSession = [];
              checkAndRender();
          }
      }
  };

  // Auto-init si el DOM ya cargó
  if(document.readyState !== 'loading') loadQuestions();
  else document.addEventListener('DOMContentLoaded', loadQuestions);

})();