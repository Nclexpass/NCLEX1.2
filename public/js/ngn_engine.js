/* ngn_engine.js — Motor Next Generation NCLEX & Topic Registry v2.1 */
/* 🔗 ESTADO: BRIDGE ACTIVATED - ANATOMY COMPATIBLE */

(function () {
  'use strict';

  // =================================================================
  // 1. SISTEMA DE REGISTRO CENTRAL (EL PUENTE FALTANTE)
  // =================================================================
  // Esto permite que 34_anatomy.js y otros módulos se registren
  if (!window.NCLEX) {
    window.NCLEX = {
      topics: [], // Aquí se guardan Anatomía, Farmacología, etc.
      
      registerTopic: function(topic) {
        console.log(`✅ [NCLEX REGISTRY] Módulo registrado: ${topic.title.es}`);
        this.topics.push(topic);
        
        // Disparar evento para que la UI se actualice
        const event = new CustomEvent('nclex-topic-added', { detail: topic });
        document.dispatchEvent(event);
      }
    };
  }

  // =================================================================
  // 2. BASE DE DATOS DE CASOS NGN (CLINICALLY VERIFIED)
  // =================================================================
  const NGN_CASES = [
    // CASO 1: SEPSIS
    {
      id: 'sepsis',
      title: 'ER Admission - Altered Mental Status / Ingreso UR: Estado Mental Alterado',
      scenario: '78-year-old female client brought to ED by daughter due to confusion. / Cliente femenina de 78 años traída a UR por su hija debido a confusión.',
      tabs: {
        history: `
          <h4 class="font-bold mb-2 text-brand-blue">History of Present Illness / Historia de la Enfermedad Actual</h4>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <span class="lang-en hidden-lang">Client brought to ED by daughter. Daughter reports client has been "acting strange" for 2 days, is lethargic, and had a shaking episode (rigors) this morning. Daughter notes client has not been eating or drinking well.</span>
            <span class="lang-es">Cliente traída a UR por su hija. La hija reporta que la cliente ha estado "actuando extraño" por 2 días, está letárgica y tuvo un episodio de temblores (escalofríos) esta mañana. La hija nota que no ha estado comiendo ni bebiendo bien.</span>
          </p>
          <h4 class="font-bold mb-2 text-brand-blue">Past Medical History / Antecedentes Médicos</h4>
          <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Type 2 Diabetes Mellitus (A1C 7.2%) / Diabetes Mellitus Tipo 2</li>
            <li>Hypertension / Hipertensión</li>
            <li>Recurrent Urinary Tract Infections (last episode 3 months ago) / IVU Recurrentes (último hace 3 meses)</li>
            <li>Osteoarthritis / Osteoartritis</li>
          </ul>
        `,
        nurses_notes: `
          <div class="space-y-4 font-mono text-sm">
            <div class="border-l-4 border-brand-blue pl-4 py-1">
              <span class="text-xs font-bold text-gray-500 block mb-1">10:00 - Assessment / Evaluación</span>
              <p>
                <span class="lang-en hidden-lang">Client is drowsiness but arousable to tactile stimuli. Oriented to person only (baseline: oriented x4). Skin is flushed, hot, and dry. Mucous membranes are dry/tacky. Capillary refill > 3 seconds. Daughter states "her urine smells very strong and looks dark".</span>
                <span class="lang-es">Cliente somnolienta pero responde a estímulos táctiles. Orientada solo en persona (base: orientada x4). Piel enrojecida, caliente y seca. Membranas mucosas secas/pegajosas. Llenado capilar > 3 segundos. La hija dice "su orina huele muy fuerte y se ve oscura".</span>
              </p>
            </div>
            <div class="border-l-4 border-purple-500 pl-4 py-1">
              <span class="text-xs font-bold text-gray-500 block mb-1">10:15 - Interventions / Intervenciones</span>
              <p>
                <span class="lang-en hidden-lang">Two peripheral IVs established: 20G Right AC and 18G Left Forearm. Blood cultures x2 sets drawn (aerobic/anaerobic). Straight catheterization performed: 45mL of cloudy, foul-smelling, dark amber urine obtained.</span>
                <span class="lang-es">Dos vías IV periféricas establecidas: 20G en fosa antecubital derecha y 18G en antebrazo izquierdo. Hemocultivos x2 sets extraídos (aerobio/anaerobio). Cateterismo directo realizado: se obtuvieron 45mL de orina turbia, fétida y color ámbar oscuro.</span>
              </p>
            </div>
          </div>
        `,
        vitals: `
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-100 dark:bg-gray-800">
                <tr><th class="p-2">Parameter</th><th class="p-2">10:00 (Admission)</th><th class="p-2">Reference</th></tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                <tr><td class="p-2 font-medium">Temp</td><td class="p-2 text-red-600 font-bold">38.9°C (102°F)</td><td class="p-2 text-gray-500">36.5-37.5°C</td></tr>
                <tr><td class="p-2 font-medium">HR</td><td class="p-2 text-red-600 font-bold">112 bpm</td><td class="p-2 text-gray-500">60-100 bpm</td></tr>
                <tr><td class="p-2 font-medium">RR</td><td class="p-2 text-orange-500 font-bold">22 bpm</td><td class="p-2 text-gray-500">12-20 bpm</td></tr>
                <tr><td class="p-2 font-medium">BP</td><td class="p-2 text-red-600 font-bold">94/52 mmHg</td><td class="p-2 text-gray-500">120/80 mmHg</td></tr>
                <tr><td class="p-2 font-medium">O2 Sat</td><td class="p-2">95% RA</td><td class="p-2 text-gray-500">>95%</td></tr>
            </tbody>
          </table>
        `,
        labs: `
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-100 dark:bg-gray-800"><tr><th class="p-2">Test</th><th class="p-2">Result</th><th class="p-2">Range</th></tr></thead>
            <tbody>
              <tr class="border-b dark:border-gray-700"><td class="p-2">WBC</td><td class="p-2 text-red-600 font-bold">24,500</td><td class="p-2">4.5-11k</td></tr>
              <tr class="border-b dark:border-gray-700"><td class="p-2">Lactate</td><td class="p-2 text-red-600 font-bold">4.2 mmol/L</td><td class="p-2">< 2.0</td></tr>
              <tr class="border-b dark:border-gray-700"><td class="p-2">Glucose</td><td class="p-2 text-orange-500 font-bold">195 mg/dL</td><td class="p-2">70-100</td></tr>
            </tbody>
          </table>
        `
      },
      questions: [
        {
          step: 1,
          phase: 'Recognize Cues',
          type: 'highlight',
          prompt: 'Click to highlight findings consistent with Sepsis/Shock. / Clic para resaltar hallazgos de Sepsis.',
          text: 'Client is [drowsy but arousable], oriented to [person only]. Skin [hot and dry]. BP [94/52], HR [112]. Urine [cloudy with foul odor]. Lactate [4.2 mmol/L].',
          correctPhrases: ['drowsy but arousable', 'person only', '94/52', '112', '4.2 mmol/L'],
          explanation: `<p><strong>Sepsis Cues:</strong> Hypotension, Tachycardia, Altered Mental Status, Lactate > 4 (Hypoperfusion).</p>`
        },
        {
          step: 2,
          phase: 'Analyze Cues',
          type: 'matrix',
          prompt: 'Consistente con: / Consistent with:',
          options: [
            { text: 'Hypotension (BP 94/52)', sepsis: true, dehyd: true, hypo: false },
            { text: 'Leukocytosis (WBC 24.5k)', sepsis: true, dehyd: false, hypo: false },
            { text: 'Elevated Lactate (4.2)', sepsis: true, dehyd: true, hypo: false }
          ],
          columns: ['Sepsis', 'Dehydration', 'Hypoglycemia'],
          explanation: `<p>High WBC points to infection (Sepsis) over simple dehydration.</p>`
        }
      ]
    },
    // CASO 2: HEART FAILURE
    {
      id: 'heart_failure',
      title: 'Decompensated Heart Failure / Falla Cardíaca Descompensada',
      scenario: '68yo male, SOB, hx CHF. / Masc 68 años, disnea, historia ICC.',
      tabs: {
        history: `<p>Hx: CHF (EF 35%), HTN, MI. Gained 4kg in 3 days. / Historia: ICC, HTA, IAM. Ganó 4kg en 3 días.</p>`,
        nurses_notes: `<p>Tripod position. JVD present. Bilateral crackles. Pink frothy sputum. / Posición trípode. Ingurgitación yugular. Estertores. Esputo rosado.</p>`,
        vitals: `<p>BP 168/94, HR 110, RR 28, O2 86% RA.</p>`,
        labs: `<p>BNP 1,250 pg/mL (High). Na 131.</p>`
      },
      questions: [
        {
          step: 1,
          phase: 'Recognize Cues',
          type: 'highlight',
          prompt: 'Highlight critical findings. / Resalte hallazgos críticos.',
          text: 'Client in [tripod position]. [Jugular Vein Distension]. [Crackles] in lungs. O2 Sat [86%]. BNP [1,250 pg/mL]. Coughing [pink, frothy sputum].',
          correctPhrases: ['tripod position', 'Crackles', '86%', '1,250 pg/mL', 'pink, frothy sputum'],
          explanation: `<p>Signs of Acute Pulmonary Edema (Medical Emergency).</p>`
        }
      ]
    }
  ];

  // =================================================================
  // 3. MOTOR DE RENDERIZADO (CORE ENGINE)
  // =================================================================
  const state = { activeCase: null, currentStep: 0, currentTab: 'nurses_notes', userAnswers: {} };

  window.renderNGNCase = function(caseId) {
      const targetCase = NGN_CASES.find(c => c.id === caseId) || NGN_CASES[0];
      state.activeCase = targetCase;
      state.currentStep = 0;
      state.currentTab = 'nurses_notes';
      return window.NGN_ENGINE.generateLayoutHTML();
  };

  window.NGN_ENGINE = {
    generateLayoutHTML() {
      if (!state.activeCase) return '<div class="p-10">Case not found</div>';
      const q = state.activeCase.questions[state.currentStep];
      
      return `
        <div class="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900 animate-fade-in">
          <div class="w-full md:w-1/2 flex flex-col border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
             <div class="p-4 bg-brand-blue text-white flex justify-between shadow">
                <h2 class="font-bold"><i class="fa-solid fa-file-medical"></i> Medical Record</h2>
                <span class="text-xs bg-white/20 px-2 py-1 rounded">${state.activeCase.title}</span>
             </div>
             <div class="flex overflow-x-auto bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600" id="ngn-tabs">
                ${this.renderTabs()}
             </div>
             <div id="chart-content" class="flex-1 overflow-y-auto p-6 prose dark:prose-invert max-w-none text-sm">
                ${state.activeCase.tabs[state.currentTab]}
             </div>
          </div>

          <div class="w-full md:w-1/2 flex flex-col bg-gray-50 dark:bg-gray-900">
             <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between bg-white dark:bg-gray-800 shadow-sm">
                <div>
                   <span class="text-xs font-bold text-brand-blue uppercase">Step ${state.currentStep + 1} / ${state.activeCase.questions.length}</span>
                   <h3 class="font-bold text-gray-800 dark:text-white">${q.phase}</h3>
                </div>
                <button onclick="window.location.reload()" class="text-red-500 hover:bg-red-50 px-3 py-1 rounded text-xs font-bold border border-red-200">EXIT</button>
             </div>
             <div id="ngn-question-area" class="flex-1 overflow-y-auto p-6">
                ${this.renderQuestion(q)}
             </div>
             <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button onclick="window.NGN_ENGINE.submitStep()" class="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 shadow-lg transition">
                   <span class="lang-es">Enviar</span><span class="lang-en hidden-lang">Submit</span> <i class="fa-solid fa-paper-plane ml-2"></i>
                </button>
             </div>
          </div>
        </div>
        
        <div id="rationale-modal" class="fixed inset-0 z-50 bg-black/50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-slide-in">
                <div class="bg-green-600 text-white p-4 font-bold flex justify-between">
                    <span><i class="fa-solid fa-check-circle"></i> Rationale</span>
                    <button onclick="window.NGN_ENGINE.nextStep()"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="p-6 text-sm text-gray-700 dark:text-gray-300" id="rationale-content"></div>
                <div class="p-4 bg-gray-50 dark:bg-gray-900 text-right">
                    <button onclick="window.NGN_ENGINE.nextStep()" class="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">Next <i class="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
      `;
    },

    renderTabs() {
      const tabs = [{id:'history',l:'History'}, {id:'nurses_notes',l:'Notes'}, {id:'vitals',l:'Vitals'}, {id:'labs',l:'Labs'}];
      return tabs.map(t => `<button onclick="window.NGN_ENGINE.switchTab('${t.id}')" class="px-4 py-3 text-xs font-bold uppercase transition ${state.currentTab===t.id?'border-b-4 border-brand-blue text-brand-blue bg-white dark:bg-gray-800':'text-gray-500'}">${t.l}</button>`).join('');
    },

    switchTab(id) {
      state.currentTab = id;
      const el = document.getElementById('chart-content');
      if(el) {
          el.innerHTML = state.activeCase.tabs[id];
          window.nclexApp && window.nclexApp.updateLanguage && window.nclexApp.updateLanguage(); // Update lang if app exists
      }
      document.getElementById('ngn-tabs').innerHTML = this.renderTabs();
    },

    renderQuestion(q) {
      let h = `<div class="mb-6 text-lg font-medium text-gray-800 dark:text-white border-l-4 border-yellow-400 pl-4">${q.prompt}</div>`;
      
      if (q.type === 'highlight') {
        h += `<div class="p-5 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 leading-loose" id="highlight-text">`;
        h += q.text.split(/(\[.*?\])/).map(p => p.startsWith('[') ? `<span onclick="this.classList.toggle('bg-yellow-300');this.classList.toggle('text-black')" class="cursor-pointer text-blue-600 hover:bg-yellow-100 px-1 rounded transition">${p.slice(1,-1)}</span>` : p).join('');
        h += `</div>`;
      } else if (q.type === 'matrix') {
        h += `<table class="w-full text-sm"><thead class="bg-gray-100 dark:bg-gray-700"><tr><th class="p-2 text-left">Finding</th>${q.columns.map(c=>`<th class="p-2 text-center">${c}</th>`).join('')}</tr></thead><tbody>`;
        h += q.options.map((o,i) => `<tr><td class="p-2 border-b dark:border-gray-700">${o.text}</td>${q.columns.map((_,ci)=>`<td class="p-2 text-center border-b dark:border-gray-700"><input type="radio" name="r${i}" value="${ci}" class="w-4 h-4"></td>`).join('')}</tr>`).join('') + `</tbody></table>`;
      }
      return h;
    },

    submitStep() {
      const q = state.activeCase.questions[state.currentStep];
      const m = document.getElementById('rationale-modal');
      const c = document.getElementById('rationale-content');
      if(m && c) {
          c.innerHTML = q.explanation || "No rationale.";
          m.classList.remove('hidden');
      } else this.nextStep();
    },

    nextStep() {
      document.getElementById('rationale-modal').classList.add('hidden');
      state.currentStep++;
      if (state.currentStep < state.activeCase.questions.length) {
        document.getElementById('ngn-question-area').innerHTML = this.renderQuestion(state.activeCase.questions[state.currentStep]);
      } else {
        document.getElementById('app-view').innerHTML = `<div class="text-center p-20"><h2 class="text-3xl font-bold text-green-600 mb-4"><i class="fa-solid fa-check-circle"></i> Case Completed</h2><button onclick="window.location.reload()" class="bg-brand-blue text-white px-6 py-3 rounded-lg font-bold">Return Home</button></div>`;
      }
    }
  };
})();
