/* ngn_engine.js — Motor Next Generation NCLEX (FULL SEPSIS CASE) */

(function () {
  'use strict';

  // --- BASE DE DATOS DE CASOS NGN (DATOS REALES) ---
  const NGN_CASES = [
    {
      id: 'sepsis',
      title: 'Emergency Department: Sepsis Case',
      scenario: 'A 78-year-old male client is brought to the Emergency Department (ED) by his daughter due to increasing confusion and fever.',
      tabs: {
        notes: {
          label: 'Nurses Notes',
          icon: 'fa-user-nurse',
          content: `
            <strong>10:00:</strong> Client arrived via private vehicle. Daughter reports client has had a UTI for 3 days and ran out of antibiotics yesterday. Since this morning, he has become "very sleepy and talking nonsense."<br><br>
            <strong>10:15:</strong> Client is disoriented to time and place. Skin is flushed and warm to touch. Shivering noted. Capillary refill > 3 seconds. Responds to verbal stimuli but falls asleep quickly.
          `
        },
        vitals: {
          label: 'Vital Signs',
          icon: 'fa-heart-pulse',
          content: `
            <table class="w-full text-sm text-left">
              <tr class="border-b dark:border-gray-700"><td><strong>Temp:</strong></td><td class="text-red-500 font-bold">38.9°C (102°F)</td></tr>
              <tr class="border-b dark:border-gray-700"><td><strong>HR:</strong></td><td class="text-red-500 font-bold">118 bpm</td></tr>
              <tr class="border-b dark:border-gray-700"><td><strong>RR:</strong></td><td>24 breaths/min</td></tr>
              <tr class="border-b dark:border-gray-700"><td><strong>BP:</strong></td><td class="text-red-500 font-bold">88/54 mmHg</td></tr>
              <tr><td><strong>O2 Sat:</strong></td><td>91% on Room Air</td></tr>
            </table>
          `
        },
        labs: {
          label: 'Laboratory Results',
          icon: 'fa-flask',
          content: `
            <ul class="space-y-2 text-sm">
              <li><strong>WBC:</strong> <span class="text-red-500 font-bold">24,000/mm³</span> (High)</li>
              <li><strong>Lactate:</strong> <span class="text-red-500 font-bold">4.2 mmol/L</span> (Critical High)</li>
              <li><strong>Creatinine:</strong> 1.8 mg/dL (High)</li>
              <li><strong>Urine Analysis:</strong> +++ Bacteria, + Leukocyte Esterase</li>
            </ul>
          `
        }
      },
      questions: [
        {
          type: 'highlight', // Simplificado para visualización
          step: 1,
          text_es: 'Paso 1: Reconocer Pistas. ¿Qué hallazgos son consistentes con Sepsis?',
          text_en: 'Step 1: Recognize Cues. Which findings are consistent with Sepsis?',
          options: [
            { text: 'Temperature 38.9°C', correct: true },
            { text: 'BP 88/54 mmHg', correct: true },
            { text: 'Heart Rate 118 bpm', correct: true },
            { text: 'Confusion', correct: true },
            { text: 'Lactate 4.2', correct: true }
          ]
        },
        {
          type: 'choice',
          step: 2,
          text_es: 'Paso 2: Analizar Pistas. El cliente está en riesgo de desarrollar:',
          text_en: 'Step 2: Analyze Cues. The client is most at risk for developing:',
          options: [
            { text: 'Septic Shock', correct: true },
            { text: 'Pulmonary Embolism', correct: false },
            { text: 'Hypoglycemia', correct: false }
          ]
        },
        {
          type: 'action',
          step: 3,
          text_es: 'Paso 3: Tomar Acción. ¿Qué orden médica priorizarías?',
          text_en: 'Step 3: Take Action. Which order would you prioritize?',
          options: [
            { text: 'Administer IV Antibiotics', correct: false },
            { text: 'Start IV Fluids (0.9% NS Bolus)', correct: true, feedback: 'Fluids are priority for hypotension (ABC).' },
            { text: 'Administer Antipyretics', correct: false }
          ]
        }
      ]
    }
  ];

  // --- ESTADO ---
  const state = {
    activeCase: null,
    currentTab: 'notes'
  };

  // --- RENDERIZADOR ---
  window.NGN_ENGINE = {
    generateLayoutHTML() {
      if (!state.activeCase) return '<div class="p-10 text-center">Case data not loaded.</div>';
      
      const c = state.activeCase;
      const tabData = c.tabs[state.currentTab];

      return `
        <div class="animate-fade-in pb-20">
            <div class="mb-6">
                <button onclick="window.nclexApp.navigate('home')" class="text-sm text-gray-500 hover:text-brand-blue mb-2 flex items-center gap-2">
                    <i class="fa-solid fa-arrow-left"></i> Back to Dashboard
                </button>
                <div class="flex items-center gap-3">
                    <div class="bg-orange-100 dark:bg-orange-900/30 text-orange-600 p-2 rounded-lg">
                        <i class="fa-solid fa-notes-medical text-2xl"></i>
                    </div>
                    <div>
                        <h1 class="text-2xl font-black text-slate-900 dark:text-white">${c.title}</h1>
                        <p class="text-gray-500 text-sm">NGN Case Study • 6 Items</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
                <div class="bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-gray-200 dark:border-brand-border flex flex-col overflow-hidden h-full">
                    <div class="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20">
                        ${Object.keys(c.tabs).map(key => `
                            <button onclick="window.NGN_ENGINE.switchTab('${key}')" 
                                class="flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${state.currentTab === key ? 'bg-white dark:bg-brand-card text-brand-blue border-t-2 border-brand-blue' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}">
                                <i class="fa-solid ${c.tabs[key].icon}"></i>
                                <span class="hidden md:inline">${c.tabs[key].label}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div class="p-6 overflow-y-auto bg-yellow-50/50 dark:bg-yellow-900/5 font-serif text-slate-800 dark:text-gray-200 leading-relaxed text-lg flex-1">
                        <h3 class="font-bold uppercase text-xs text-gray-400 mb-2 tracking-widest">${tabData.label}</h3>
                        ${tabData.content}
                    </div>
                </div>

                <div class="bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-gray-200 dark:border-brand-border flex flex-col h-full relative overflow-hidden">
                   <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20">
                      <div class="flex justify-between items-center">
                          <span class="text-xs font-bold uppercase text-brand-blue">Question 1 of 6</span>
                          <span class="text-xs font-bold text-gray-400">Time: 00:45</span>
                      </div>
                   </div>
                   
                   <div class="p-6 overflow-y-auto flex-1">
                      <div class="mb-4">
                        <p class="text-lg font-medium text-slate-900 dark:text-white mb-4">
                           <span class="lang-es">${c.questions[0].text_es}</span>
                           <span class="lang-en hidden-lang">${c.questions[0].text_en}</span>
                        </p>
                      </div>

                      <div class="space-y-3">
                         ${c.questions[0].options.map((opt, idx) => `
                            <label class="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 cursor-pointer hover:border-brand-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
                                <input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue">
                                <span class="text-slate-700 dark:text-gray-300 font-medium group-hover:text-brand-blue">${opt.text}</span>
                            </label>
                         `).join('')}
                      </div>
                   </div>

                   <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 flex justify-end">
                      <button class="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                         Submit Answer <i class="fa-solid fa-arrow-right ml-2"></i>
                      </button>
                   </div>
                </div>
            </div>
        </div>
      `;
    },

    switchTab(tabName) {
      state.currentTab = tabName;
      // Re-renderizar solo la vista actual (hack rápido para refrescar)
      const view = document.getElementById('app-view');
      if (view) view.innerHTML = this.generateLayoutHTML();
    }
  };

  // --- API PUBLICA ---
  window.renderNGNCase = function(caseId) {
    // Buscar caso o usar el primero por defecto
    state.activeCase = NGN_CASES.find(c => c.id === caseId) || NGN_CASES[0];
    state.currentTab = 'notes';
    return window.NGN_ENGINE.generateLayoutHTML();
  };

})();