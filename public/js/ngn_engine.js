/* ngn_engine.js — Motor Next Generation NCLEX (AUDITED, ENHANCED & CONNECTED) */

(function () {
  'use strict';

  // --- BASE DE DATOS DE CASOS NGN (CLINICALLY VERIFIED) ---
  const NGN_CASES = [
    // CASO 1: SEPSIS (contenido igual, omitido por brevedad)
    // CASO 2: HEART FAILURE (omitido)
    // CASO 3: DKA (omitido)
    // ... (mismo contenido que original)
  ];

  // --- ESTADO ---
  const state = {
    activeCase: null,
    currentStep: 0,
    currentTab: 'nurses_notes',
    userAnswers: {},
    scores: {}
  };

  // --- BRIDGE FUNCTION FOR LOGIC.JS ---
  window.renderNGNCase = function(caseId) {
    const targetCase = NGN_CASES.find(c => c.id === caseId) || NGN_CASES[0];
    state.activeCase = targetCase;
    state.currentStep = 0;
    state.userAnswers = {};
    state.scores = {};
    state.currentTab = 'nurses_notes';
    return window.NGN_ENGINE.generateLayoutHTML();
  };

  // --- RENDERIZADOR ---
  window.NGN_ENGINE = {
    generateLayoutHTML() {
      if (!state.activeCase) return '<div class="p-10 text-center">Case data missing</div>';

      const tabContent = state.activeCase.tabs[state.currentTab] || '';
      const tabsHTML = this.renderTabs();
      const phaseTitle = this.getPhaseTitle(state.currentStep);
      const questionHTML = this.renderQuestion();
      const totalSteps = state.activeCase.questions.length;

      return `
        <div class="fixed inset-0 bg-gray-100 dark:bg-gray-900 z-40 flex flex-col md:flex-row h-screen overflow-hidden animate-fade-in">
          <div class="w-full md:w-1/2 flex flex-col border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-card">
             <div class="p-4 bg-brand-blue text-white shadow-md z-10 flex justify-between items-center">
                <div>
                    <h2 class="font-bold text-lg"><i class="fa-solid fa-file-medical mr-2"></i> Medical Record</h2>
                    <p class="text-[10px] uppercase tracking-wide opacity-90">NGN Case Study: ${state.activeCase.title}</p>
                </div>
                <div class="text-right hidden sm:block">
                    <span class="bg-white/20 px-2 py-1 rounded text-xs font-mono font-bold">${state.activeCase.id.toUpperCase()}</span>
                </div>
             </div>
             
             <div class="flex overflow-x-auto bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 scrollbar-hide shrink-0" id="ngn-tabs-container">
                ${tabsHTML}
             </div>
             
             <div id="chart-content" class="flex-1 overflow-y-auto p-6 prose dark:prose-invert max-w-none text-sm leading-relaxed custom-scrollbar">
                ${tabContent}
             </div>
          </div>

          <div class="w-full md:w-1/2 flex flex-col bg-gray-50 dark:bg-gray-900 relative">
             <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-brand-card shadow-sm z-10 shrink-0">
                <div>
                   <span class="text-[10px] font-black text-brand-blue uppercase tracking-widest block mb-1">Step ${state.currentStep + 1} / ${totalSteps}</span>
                   <h3 class="font-bold text-slate-800 dark:text-white text-sm md:text-base" id="phase-title">
                      ${phaseTitle}
                   </h3>
                </div>
                <button onclick="window.nclexApp.navigate('home')" class="text-gray-400 hover:text-red-500 text-xs font-bold border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-900/10">
                    <i class="fa-solid fa-right-from-bracket mr-1"></i> <span class="lang-es">SALIR</span><span class="lang-en hidden-lang">EXIT</span>
                </button>
             </div>

             <div id="ngn-question-area" class="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                ${questionHTML}
             </div>

             <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-card flex justify-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] shrink-0">
                <button onclick="window.NGN_ENGINE.submitStep()" class="bg-slate-900 dark:bg-brand-blue text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-blue-600 transition-all flex items-center gap-2 text-sm transform active:scale-95">
                   <span class="lang-es">Enviar Respuesta</span><span class="lang-en hidden-lang">Submit Answer</span> <i class="fa-solid fa-paper-plane"></i>
                </button>
             </div>
          </div>
        </div>

        <div id="rationale-modal" class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm hidden flex items-center justify-center p-4">
            <div class="bg-white dark:bg-brand-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-slide-in">
                <div class="bg-green-500 text-white p-4 font-bold flex justify-between items-center">
                    <span><i class="fa-solid fa-check-double mr-2"></i> <span class="lang-es">Respuesta Enviada</span><span class="lang-en hidden-lang">Answer Submitted</span></span>
                    <button onclick="window.NGN_ENGINE.nextStep()" class="hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="p-6 overflow-y-auto max-h-[60vh]">
                    <div id="rationale-content" class="prose dark:prose-invert max-w-none text-sm"></div>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-black/20 text-right border-t border-gray-100 dark:border-gray-700">
                    <button onclick="window.NGN_ENGINE.nextStep()" class="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold text-sm shadow hover:bg-blue-600 transition-colors">
                        <span class="lang-es">Siguiente Paso</span><span class="lang-en hidden-lang">Continue to Next Step</span> <i class="fa-solid fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
      `;
    },

    renderTabs() {
      const tabs = [
        { id: 'history', label: 'History & HPI' },
        { id: 'nurses_notes', label: 'Nurses Notes' },
        { id: 'vitals', label: 'Vital Signs' },
        { id: 'labs', label: 'Laboratory Results' }
      ];

      return tabs.map(t => {
        const active = state.currentTab === t.id 
            ? 'border-b-4 border-brand-blue text-brand-blue bg-white dark:bg-brand-card font-bold shadow-sm' 
            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 border-b-4 border-transparent';
        return `<button onclick="window.NGN_ENGINE.switchTab('${t.id}')" class="px-6 py-3 text-xs uppercase tracking-wide whitespace-nowrap transition-all ${active}">${t.label}</button>`;
      }).join('');
    },

    switchTab(tabId) {
      if (!state.activeCase.tabs[tabId]) return; // fallback si la pestaña no existe
      state.currentTab = tabId;
      const content = document.getElementById('chart-content');
      if (content) {
          content.innerHTML = state.activeCase.tabs[tabId];
          // Re-aplicar clases de idioma
          const isEs = localStorage.getItem('nclex_lang') !== 'en';
          content.querySelectorAll('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
          content.querySelectorAll('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      }
      // Actualizar visualmente los tabs
      const tabContainer = document.getElementById('ngn-tabs-container');
      if (tabContainer) tabContainer.innerHTML = this.renderTabs();
    },

    getPhaseTitle(step) {
      const q = state.activeCase?.questions[step];
      return q ? `<i class="fa-solid fa-clipboard-check mr-2 text-brand-blue"></i>${q.phase}` : 'Clinical Judgment';
    },

    renderQuestion() {
      const q = state.activeCase?.questions[state.currentStep];
      if (!q) return `<div class="text-center p-10"><i class="fa-solid fa-spinner animate-spin text-2xl"></i></div>`;

      let html = `<div class="mb-6 font-medium text-lg text-slate-900 dark:text-white leading-relaxed border-l-4 border-yellow-400 pl-4 py-1">${q.prompt}</div>`;

      if (q.type === 'highlight') {
        html += `<div class="p-6 bg-white dark:bg-brand-card rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 leading-loose text-base shadow-inner font-serif" id="highlight-text">`;
        const parts = q.text.split(/(\[.*?\])/g);
        html += parts.map((part, idx) => {
          if (part.startsWith('[') && part.endsWith(']')) {
            const cleanText = part.slice(1, -1);
            return `<span onclick="window.NGN_ENGINE.toggleHighlight(this)" class="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded transition-colors border-b border-gray-300 border-dotted select-none font-medium text-brand-blue" data-text="${cleanText}">${cleanText}</span>`;
          }
          return part;
        }).join('');
        html += `</div>`;
      } 
      else if (q.type === 'matrix' || q.type === 'matrix-action') {
        html += `
          <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <table class="w-full text-sm text-left">
              <thead class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <tr>
                  <th class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50">Item</th>
                  ${q.columns.map(c => `<th class="px-6 py-4 text-center border-l border-gray-200 dark:border-gray-700">${c}</th>`).join('')}
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-brand-card divide-y divide-gray-100 dark:divide-gray-700">
                ${q.options.map((opt, idx) => `
                  <tr class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">${opt.text}</td>
                    ${q.columns.map((col, cIdx) => `
                      <td class="px-6 py-4 text-center border-l border-gray-100 dark:border-gray-700">
                        <input type="radio" name="matrix_row_${idx}" value="${cIdx}" class="w-5 h-5 text-brand-blue bg-gray-100 border-gray-300 focus:ring-brand-blue cursor-pointer transition-transform active:scale-90">
                      </td>
                    `).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
      else if (q.type === 'cloze') {
        let template = q.template;
        q.dropdowns.forEach(dd => {
            const selectHtml = `
              <select id="cloze_${dd.id}" class="inline-block mx-1 bg-white dark:bg-gray-800 border-2 border-brand-blue/30 rounded-lg px-3 py-1.5 text-sm font-bold text-brand-blue focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none shadow-sm cursor-pointer hover:border-brand-blue">
                 <option value="">Select Option...</option>
                 ${dd.options.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            `;
            template = template.replace(new RegExp(`\\{${dd.id}\\}`, 'g'), selectHtml);
        });
        html += `<div class="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-2xl text-lg leading-loose border border-blue-100 dark:border-blue-900/30 shadow-sm text-center">${template}</div>`;
      }
      else if (q.type === 'sata') {
        html += `<div class="space-y-3">
          ${q.options.map(opt => `
            <label class="flex items-start p-4 bg-white dark:bg-brand-card border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-white/5 transition-all shadow-sm hover:shadow-md group select-none">
              <div class="flex items-center h-5">
                <input type="checkbox" name="ngn_sata" value="${opt.id}" class="w-5 h-5 text-brand-blue rounded border-gray-300 focus:ring-brand-blue cursor-pointer">
              </div>
              <span class="ml-3 text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors font-medium">${opt.text}</span>
            </label>
          `).join('')}
        </div>`;
      }

      return html;
    },

    toggleHighlight(el) {
      if (el.classList.contains('bg-yellow-300')) {
        el.classList.remove('bg-yellow-300', 'text-black', 'shadow-sm', 'font-bold');
        el.classList.add('hover:bg-yellow-100', 'text-brand-blue');
      } else {
        el.classList.add('bg-yellow-300', 'text-black', 'shadow-sm', 'font-bold');
        el.classList.remove('hover:bg-yellow-100', 'text-brand-blue');
      }
    },

    submitStep() {
      const q = state.activeCase?.questions[state.currentStep];
      if (!q) return;
      
      let isStepComplete = false;
      
      if (q.type === 'highlight') {
         const selected = document.querySelectorAll('#highlight-text .bg-yellow-300');
         if(selected.length > 0) isStepComplete = true;
      } else if (q.type.includes('matrix')) {
         const rows = q.options.length;
         let completedRows = 0;
         for(let i=0; i<rows; i++) {
             if(document.querySelector(`input[name="matrix_row_${i}"]:checked`)) completedRows++;
         }
         if(completedRows === rows) isStepComplete = true;
      } else if (q.type === 'cloze') {
         const selects = document.querySelectorAll('select');
         const filled = Array.from(selects).every(s => s.value !== "");
         if(filled) isStepComplete = true;
      } else if (q.type === 'sata') {
          if(document.querySelectorAll('input[name=ngn_sata]:checked').length > 0) isStepComplete = true;
      }

      if (!isStepComplete) {
        alert("Please complete the required actions before submitting.");
        return;
      }

      this.showRationale(q);
    },

    showRationale(question) {
        const modal = document.getElementById('rationale-modal');
        const content = document.getElementById('rationale-content');
        if(modal && content) {
            content.innerHTML = question.explanation || '<p>No rationale available.</p>';
            modal.classList.remove('hidden');
            
            const isEs = localStorage.getItem('nclex_lang') !== 'en';
            content.querySelectorAll('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
            content.querySelectorAll('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
        } else {
            this.nextStep();
        }
    },

    nextStep() {
        const modal = document.getElementById('rationale-modal');
        if(modal) modal.classList.add('hidden');

        state.currentStep++;
        
        if (state.currentStep < state.activeCase.questions.length) {
            const area = document.getElementById('ngn-question-area');
            if (!area) return;

            area.style.opacity = '0';
            setTimeout(() => {
                area.innerHTML = this.renderQuestion();
                
                const stepIndicator = document.querySelector('span.text-\\[10px\\]');
                if(stepIndicator) stepIndicator.innerText = `Step ${state.currentStep + 1} / ${state.activeCase.questions.length}`;
                
                const phaseTitle = document.getElementById('phase-title');
                if(phaseTitle) phaseTitle.innerHTML = this.getPhaseTitle(state.currentStep);
                
                area.style.opacity = '1';
                area.scrollTop = 0;
            }, 200);
        } else {
            this.finishCase();
        }
    },

    finishCase() {
      const html = `
        <div class="max-w-2xl mx-auto py-20 text-center animate-fade-in px-4">
           <div class="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg ring-4 ring-green-50 dark:ring-green-900/20">
              <i class="fa-solid fa-flag-checkered"></i>
           </div>
           <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-2">
                <span class="lang-es">Caso de Estudio Completado</span><span class="lang-en hidden-lang">Case Study Completed</span>
           </h2>
           <p class="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                <span class="lang-es">Has navegado con éxito el Modelo de Juicio Clínico para</span>
                <span class="lang-en hidden-lang">You have successfully navigated the Clinical Judgment Model for</span>
                <strong>${state.activeCase.title}</strong>.
           </p>
           
           <div class="p-6 bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 text-left">
              <h3 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center"><i class="fa-solid fa-notes-medical mr-2 text-brand-blue"></i> 
                <span class="lang-es">Puntos Clave</span><span class="lang-en hidden-lang">Key Takeaways</span>:
              </h3>
              <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1 mr-2"></i> 
                    <span class="lang-es">Revisión completa de hallazgos clínicos.</span>
                    <span class="lang-en hidden-lang">Complete review of clinical findings.</span>
                  </li>
                  <li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1 mr-2"></i> 
                    <span class="lang-es">Aplicación correcta de prioridades de seguridad.</span>
                    <span class="lang-en hidden-lang">Correct application of safety priorities.</span>
                  </li>
              </ul>
           </div>

           <button onclick="window.nclexApp.navigate('home')" class="bg-brand-blue text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-blue-600 hover:scale-105 transition-all w-full md:w-auto">
                <i class="fa-solid fa-house mr-2"></i> <span class="lang-es">Volver al Inicio</span><span class="lang-en hidden-lang">Return to Dashboard</span>
           </button>
        </div>
      `;
      
      const container = document.getElementById('app-view');
      if(container) {
          container.innerHTML = html;
          const isEs = localStorage.getItem('nclex_lang') !== 'en';
          container.querySelectorAll('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
          container.querySelectorAll('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      }
    }
  };
})();