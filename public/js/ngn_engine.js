/* ngn_engine.js — Motor Next Generation NCLEX (VERSIÓN CORREGIDA 3.0) */

(function () {
  'use strict';

  // ===== DEPENDENCIAS =====
  const U = window.NCLEXUtils || {
    $: (s) => document.querySelector(s),
    $$: (s) => Array.from(document.querySelectorAll(s)),
    storageGet: (k, d) => d,
    storageSet: () => false,
    escapeHtml: (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    dom: {
      toggleClass: (els, c, force) => els.forEach(el => el.classList.toggle(c, force))
    }
  };

  const { $, $$, storageGet, storageSet, escapeHtml } = U;

  // ===== BASE DE DATOS DE CASOS NGN =====
  const NGN_CASES = [
    {
      id: 'sepsis',
      title: 'Emergency Department: Sepsis Case',
      titleEs: 'Urgencias: Caso de Sepsis',
      category: 'Emergency',
      difficulty: 'Hard',
      estimatedTime: 15,
      scenario: {
        en: 'A 78-year-old male client is brought to the Emergency Department (ED) by his daughter due to increasing confusion and fever.',
        es: 'Un cliente masculino de 78 años es traído al Departamento de Emergencias por su hija debido a confusión creciente y fiebre.'
      },
      tabs: {
        notes: {
          label: { en: 'Nurses Notes', es: 'Notas de Enfermería' },
          icon: 'fa-user-nurse',
          content: {
            en: `<strong>10:00:</strong> Client arrived via private vehicle. Daughter reports client has had a UTI for 3 days and ran out of antibiotics yesterday. Since this morning, he has become "very sleepy and talking nonsense."<br><br>
                  <strong>10:15:</strong> Client is disoriented to time and place. Skin is flushed and warm to touch. Shivering noted. Capillary refill > 3 seconds. Responds to verbal stimuli but falls asleep quickly.`,
            es: `<strong>10:00:</strong> El cliente llegó en vehículo privado. La hija reporta que el cliente ha tenido una ITU por 3 días y se quedó sin antibióticos ayer. Desde esta mañana, está "muy somnoliento y hablando incoherencias."<br><br>
                  <strong>10:15:</strong> El cliente está desorientado en tiempo y lugar. Piel enrojecida y caliente al tacto. Escalofríos presentes. Llenado capilar > 3 segundos. Responde a estímulos verbales pero se duerme rápidamente.`
          }
        },
        vitals: {
          label: { en: 'Vital Signs', es: 'Signos Vitales' },
          icon: 'fa-heart-pulse',
          content: {
            en: `<div class="grid grid-cols-2 gap-4">
                  <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div class="text-xs text-red-600 dark:text-red-400 font-bold">TEMPERATURE</div>
                    <div class="text-2xl font-black text-red-600">38.9°C</div>
                    <div class="text-xs text-red-500">102°F - FEVER</div>
                  </div>
                  <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div class="text-xs text-red-600 dark:text-red-400 font-bold">HEART RATE</div>
                    <div class="text-2xl font-black text-red-600">118</div>
                    <div class="text-xs text-red-500">bpm - TACHYCARDIA</div>
                  </div>
                  <div class="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div class="text-xs text-yellow-600 dark:text-yellow-400 font-bold">RESPIRATORY RATE</div>
                    <div class="text-2xl font-black text-yellow-600">24</div>
                    <div class="text-xs text-yellow-500">breaths/min</div>
                  </div>
                  <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div class="text-xs text-red-600 dark:text-red-400 font-bold">BLOOD PRESSURE</div>
                    <div class="text-2xl font-black text-red-600">88/54</div>
                    <div class="text-xs text-red-500">mmHg - HYPOTENSION</div>
                  </div>
                  <div class="col-span-2 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div class="text-xs text-yellow-600 dark:text-yellow-400 font-bold">OXYGEN SATURATION</div>
                    <div class="text-2xl font-black text-yellow-600">91%</div>
                    <div class="text-xs text-yellow-500">Room Air - MILD HYPOXEMIA</div>
                  </div>
                </div>`,
            es: `<div class="grid grid-cols-2 gap-4">
                  <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div class="text-xs text-red-600 dark:text-red-400 font-bold">TEMPERATURA</div>
                    <div class="text-2xl font-black text-red-600">38.9°C</div>
                    <div class="text-xs text-red-500">102°F - FIEBRE</div>
                  </div>
                  <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div class="text-xs text-red-600 dark:text-red-400 font-bold">FRECUENCIA CARDÍACA</div>
                    <div class="text-2xl font-black text-red-600">118</div>
                    <div class="text-xs text-red-500">lpm - TAQUICARDIA</div>
                  </div>
                  <div class="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div class="text-xs text-yellow-600 dark:text-yellow-400 font-bold">FRECUENCIA RESPIRATORIA</div>
                    <div class="text-2xl font-black text-yellow-600">24</div>
                    <div class="text-xs text-yellow-500">resp/min</div>
                  </div>
                  <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div class="text-xs text-red-600 dark:text-red-400 font-bold">PRESIÓN ARTERIAL</div>
                    <div class="text-2xl font-black text-red-600">88/54</div>
                    <div class="text-xs text-red-500">mmHg - HIPOTENSIÓN</div>
                  </div>
                  <div class="col-span-2 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div class="text-xs text-yellow-600 dark:text-yellow-400 font-bold">SATURACIÓN DE OXÍGENO</div>
                    <div class="text-2xl font-black text-yellow-600">91%</div>
                    <div class="text-xs text-yellow-500">Aire Ambiente - HIPOXEMIA LEVE</div>
                  </div>
                </div>`
          }
        },
        labs: {
          label: { en: 'Laboratory Results', es: 'Resultados de Laboratorio' },
          icon: 'fa-flask',
          content: {
            en: `<div class="space-y-3">
                  <div class="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div>
                      <div class="font-bold text-red-700 dark:text-red-300">WBC</div>
                      <div class="text-xs text-red-600">White Blood Cells</div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-black text-red-600">24,000</div>
                      <div class="text-xs text-red-500">/mm³ (High) ⚠️</div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div>
                      <div class="font-bold text-red-700 dark:text-red-300">Lactate</div>
                      <div class="text-xs text-red-600">Lactic Acid</div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-black text-red-600">4.2</div>
                      <div class="text-xs text-red-500">mmol/L (Critical) 🚨</div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div>
                      <div class="font-bold text-yellow-700 dark:text-yellow-300">Creatinine</div>
                      <div class="text-xs text-yellow-600">Kidney Function</div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-black text-yellow-600">1.8</div>
                      <div class="text-xs text-yellow-500">mg/dL (Elevated)</div>
                    </div>
                  </div>
                  <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div class="font-bold text-blue-700 dark:text-blue-300 mb-1">Urine Analysis</div>
                    <div class="text-sm text-blue-600 dark:text-blue-400">
                      <span class="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-800 mr-2">+++ Bacteria</span>
                      <span class="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-800">+ Leukocyte Esterase</span>
                    </div>
                  </div>
                </div>`,
            es: `<div class="space-y-3">
                  <div class="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div>
                      <div class="font-bold text-red-700 dark:text-red-300">GLB</div>
                      <div class="text-xs text-red-600">Glóbulos Blancos</div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-black text-red-600">24,000</div>
                      <div class="text-xs text-red-500">/mm³ (Alto) ⚠️</div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div>
                      <div class="font-bold text-red-700 dark:text-red-300">Lactato</div>
                      <div class="text-xs text-red-600">Ácido Láctico</div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-black text-red-600">4.2</div>
                      <div class="text-xs text-red-500">mmol/L (Crítico) 🚨</div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div>
                      <div class="font-bold text-yellow-700 dark:text-yellow-300">Creatinina</div>
                      <div class="text-xs text-yellow-600">Función Renal</div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-black text-yellow-600">1.8</div>
                      <div class="text-xs text-yellow-500">mg/dL (Elevado)</div>
                    </div>
                  </div>
                  <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div class="font-bold text-blue-700 dark:text-blue-300 mb-1">Análisis de Orina</div>
                    <div class="text-sm text-blue-600 dark:text-blue-400">
                      <span class="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-800 mr-2">+++ Bacterias</span>
                      <span class="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-800">+ Esterasa Leucocitaria</span>
                    </div>
                  </div>
                </div>`
          }
        }
      },
      questions: [
        {
          step: 1,
          type: 'highlight',
          text: {
            es: 'Paso 1: Reconocer Pistas. ¿Qué hallazgos del caso son consistentes con Sepsis? Selecciona TODAS las que apliquen:',
            en: 'Step 1: Recognize Cues. Which findings are consistent with Sepsis? Select ALL that apply:'
          },
          options: [
            { id: 'temp', text: { es: 'Temperatura 38.9°C', en: 'Temperature 38.9°C' }, correct: true, rationale: { es: 'Fiebre >38°C es criterio de sepsis', en: 'Fever >38°C is a sepsis criterion' } },
            { id: 'bp', text: { es: 'PA 88/54 mmHg', en: 'BP 88/54 mmHg' }, correct: true, rationale: { es: 'Hipotensión indicada', en: 'Hypotension indicated' } },
            { id: 'hr', text: { es: 'FC 118 lpm', en: 'HR 118 bpm' }, correct: true, rationale: { es: 'Taquicardia >90 lpm', en: 'Tachycardia >90 bpm' } },
            { id: 'rr', text: { es: 'FR 24 rpm', en: 'RR 24 breaths/min' }, correct: true, rationale: { es: 'Taquipnea >20 rpm', en: 'Tachypnea >20 rpm' } },
            { id: 'lactate', text: { es: 'Lactato 4.2 mmol/L', en: 'Lactate 4.2 mmol/L' }, correct: true, rationale: { es: 'Lactato >2 indica hipoperfusión', en: 'Lactate >2 indicates hypoperfusion' } },
            { id: 'wbc', text: { es: 'GLB 24,000', en: 'WBC 24,000' }, correct: true, rationale: { es: 'Leucocitosis >12,000', en: 'Leukocytosis >12,000' } },
            { id: 'o2', text: { es: 'SatO2 91%', en: 'O2 Sat 91%' }, correct: false, rationale: { es: 'No es criterio de sepsis específico', en: 'Not specific sepsis criterion' } }
          ]
        },
        {
          step: 2,
          type: 'priority',
          text: {
            es: 'Paso 2: Priorizar. Basado en los datos, ¿cuál es la prioridad de intervención?',
            en: 'Step 2: Prioritize. Based on the data, what is the priority intervention?'
          },
          options: [
            { id: 'fluids', text: { es: 'Administrar fluidos IV (30ml/kg) inmediatamente', en: 'Administer IV fluids (30ml/kg) immediately' }, correct: true, rationale: { es: 'Hipotensión requiere reanimación con fluidos en primera hora', en: 'Hypotension requires fluid resuscitation in first hour' } },
            { id: 'antibiotics', text: { es: 'Iniciar antibióticos de amplio espectro', en: 'Start broad-spectrum antibiotics' }, correct: false, rationale: { es: 'Importante pero después de estabilización hemodinámica', en: 'Important but after hemodynamic stabilization' } },
            { id: 'vasopressors', text: { es: 'Iniciar vasopresores', en: 'Start vasopressors' }, correct: false, rationale: { es: 'Después de fluidos si persiste hipotensión', en: 'After fluids if hypotension persists' } },
            { id: 'ctscan', text: { es: 'Realizar TAC abdominal', en: 'Perform abdominal CT scan' }, correct: false, rationale: { es: 'No es prioridad inmediata', en: 'Not immediate priority' } }
          ]
        },
        {
          step: 3,
          type: 'action',
          text: {
            es: 'Paso 3: Acción. Después de fluidos, la PA sigue 85/50. ¿Qué ordenas?',
            en: 'Step 3: Action. After fluids, BP remains 85/50. What do you order?'
          },
          options: [
            { id: 'norepinephrine', text: { es: 'Norepinefrina IV', en: 'Norepinephrine IV' }, correct: true, rationale: { es: 'Vasopresor de primera línea en shock séptico', en: 'First-line vasopressor in septic shock' } },
            { id: 'dopamine', text: { es: 'Dopamina IV', en: 'Dopamine IV' }, correct: false, rationale: { es: 'No es primera línea según Surviving Sepsis', en: 'Not first-line per Surviving Sepsis' } },
            { id: 'morefluids', text: { es: 'Más fluidos (otros 30ml/kg)', en: 'More fluids (another 30ml/kg)' }, correct: false, rationale: { es: 'Riesgo de sobrecarga de fluidos', en: 'Risk of fluid overload' } },
            { id: 'steroids', text: { es: 'Hidrocortisona IV', en: 'Hydrocortisone IV' }, correct: false, rationale: { es: 'Solo si hay resistencia a vasopresores', en: 'Only if vasopressor-resistant' } }
          ]
        }
      ]
    }
  ];

  // ===== ESTADO =====
  const state = {
    activeCase: null,
    currentTab: 'notes',
    currentQuestion: 0,
    answers: {},
    showRationale: false,
    score: 0,
    isComplete: false
  };

  // ===== HELPERS =====

  function getLang() {
    return storageGet('lang', 'es');
  }

  function t(es, en) {
    return getLang() === 'es' ? es : en;
  }

  function getTabLabel(tab) {
    const lang = getLang();
    return tab.label[lang] || tab.label.en;
  }

  function getContent(content) {
    const lang = getLang();
    return content[lang] || content.en;
  }

  // ===== RENDERIZADO PRINCIPAL =====

  window.NGN_ENGINE = {
    generateLayoutHTML(caseId = 'sepsis') {
      const c = NGN_CASES.find(c => c.id === caseId) || NGN_CASES[0];
      state.activeCase = c;
      
      const tabData = c.tabs[state.currentTab];
      const currentQ = c.questions[state.currentQuestion];
      const progress = ((state.currentQuestion + 1) / c.questions.length) * 100;
      const lang = getLang();

      return `
        <div class="animate-fade-in pb-20">
          <!-- Header -->
          <div class="mb-6">
            <button onclick="window.nclexApp.navigate('home')" 
              class="text-sm text-[var(--brand-text-muted)] hover:text-[rgb(var(--brand-blue-rgb))] mb-2 flex items-center gap-2 transition">
              <i class="fa-solid fa-arrow-left"></i> 
              ${t('Volver al Dashboard', 'Back to Dashboard')}
            </button>
            
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="bg-orange-100 dark:bg-orange-900/30 text-orange-600 p-3 rounded-xl">
                  <i class="fa-solid fa-notes-medical text-2xl"></i>
                </div>
                <div>
                  <h1 class="text-2xl font-black text-[var(--brand-text)]">${getContent(c.title)}</h1>
                  <div class="flex items-center gap-2 text-sm text-[var(--brand-text-muted)]">
                    <span class="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold">NGN</span>
                    <span>•</span>
                    <span>${c.questions.length} ${t('preguntas', 'questions')}</span>
                    <span>•</span>
                    <span>~${c.estimatedTime} min</span>
                  </div>
                </div>
              </div>
              
              <!-- Progress Bar -->
              <div class="w-full md:w-64">
                <div class="flex justify-between text-xs font-bold text-[var(--brand-text-muted)] mb-1">
                  <span>${t('Progreso', 'Progress')}</span>
                  <span>${state.currentQuestion + 1}/${c.questions.length}</span>
                </div>
                <div class="h-2 bg-[var(--brand-bg)] rounded-full overflow-hidden">
                  <div class="h-full transition-all duration-500 rounded-full" 
                       style="width: ${progress}%; background: linear-gradient(90deg, #f97316, #ea580c);"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Scenario Banner -->
          <div class="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-triangle-exclamation text-amber-500 mt-1"></i>
              <div>
                <div class="font-bold text-amber-800 dark:text-amber-200 mb-1">${t('Escenario', 'Scenario')}</div>
                <div class="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">${getContent(c.scenario)}</div>
              </div>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[calc(100vh-320px)] min-h-[500px]">
            
            <!-- Left Panel: Case Data -->
            <div class="bg-[var(--brand-card)] rounded-2xl shadow-lg border border-[var(--brand-border)] flex flex-col overflow-hidden h-full">
              
              <!-- Tabs -->
              <div class="flex border-b border-[var(--brand-border)] bg-[var(--brand-bg)]">
                ${Object.entries(c.tabs).map(([key, tab]) => `
                  <button onclick="window.NGN_ENGINE.switchTab('${key}')" 
                    class="flex-1 py-3 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all relative
                    ${state.currentTab === key 
                      ? 'bg-[var(--brand-card)] text-[rgb(var(--brand-blue-rgb))]' 
                      : 'text-[var(--brand-text-muted)] hover:bg-[rgba(var(--brand-blue-rgb),0.05)]'}">
                    <i class="fa-solid ${tab.icon}"></i>
                    <span class="hidden sm:inline">${getTabLabel(tab)}</span>
                    ${state.currentTab === key ? `<div class="absolute top-0 left-0 right-0 h-0.5 bg-[rgb(var(--brand-blue-rgb))]"></div>` : ''}
                  </button>
                `).join('')}
              </div>

              <!-- Tab Content -->
              <div class="flex-1 p-6 overflow-y-auto bg-yellow-50/30 dark:bg-yellow-900/5">
                <h3 class="font-bold uppercase text-xs text-[var(--brand-text-muted)] mb-3 tracking-wider">
                  ${getTabLabel(tabData)}
                </h3>
                <div class="text-[var(--brand-text)] leading-relaxed text-base">
                  ${getContent(tabData.content)}
                </div>
              </div>
            </div>

            <!-- Right Panel: Question -->
            <div class="bg-[var(--brand-card)] rounded-2xl shadow-lg border border-[var(--brand-border)] flex flex-col h-full relative overflow-hidden">
              
              <!-- Question Header -->
              <div class="p-5 border-b border-[var(--brand-border)] bg-[var(--brand-bg)]">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase text-[rgb(var(--brand-blue-rgb))] tracking-wider">
                    ${t('Pregunta', 'Question')} ${currentQ.step} ${t('de', 'of')} ${c.questions.length}
                  </span>
                  <span class="text-xs font-bold text-[var(--brand-text-muted)]">
                    ${currentQ.type === 'highlight' ? 'SATA' : 
                      currentQ.type === 'priority' ? t('Prioridad', 'Priority') : 
                      t('Acción', 'Action')}
                  </span>
                </div>
              </div>

              <!-- Question Content -->
              <div class="flex-1 p-6 overflow-y-auto">
                <div class="mb-6">
                  <p class="text-lg font-medium text-[var(--brand-text)] leading-relaxed">
                    ${getContent(currentQ.text)}
                  </p>
                </div>

                <!-- Options -->
                <div class="space-y-3" id="ngn-options">
                  ${this.renderOptions(currentQ)}
                </div>

                <!-- Rationale (shown after submit) -->
                ${state.showRationale ? this.renderRationale(currentQ) : ''}
              </div>

              <!-- Footer Actions -->
              <div class="p-4 border-t border-[var(--brand-border)] bg-[var(--brand-bg)] flex justify-between items-center">
                <button onclick="window.NGN_ENGINE.resetCase()" 
                  class="px-4 py-2 rounded-xl text-sm font-bold text-[var(--brand-text-muted)] hover:text-red-500 transition">
                  <i class="fa-solid fa-rotate-left mr-1"></i> ${t('Reiniciar', 'Restart')}
                </button>
                
                ${!state.showRationale ? `
                  <button onclick="window.NGN_ENGINE.submitAnswer()" 
                    id="ngn-submit-btn"
                    class="px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition transform hover:scale-105 active:scale-95 opacity-50 cursor-not-allowed"
                    style="background: linear-gradient(135deg, #f97316, #ea580c);"
                    disabled>
                    ${t('Enviar Respuesta', 'Submit Answer')} <i class="fa-solid fa-arrow-right ml-2"></i>
                  </button>
                ` : state.currentQuestion < c.questions.length - 1 ? `
                  <button onclick="window.NGN_ENGINE.nextQuestion()" 
                    class="px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition transform hover:scale-105 active:scale-95"
                    style="background-color: rgb(var(--brand-blue-rgb));">
                    ${t('Siguiente', 'Next')} <i class="fa-solid fa-arrow-right ml-2"></i>
                  </button>
                ` : `
                  <button onclick="window.NGN_ENGINE.finishCase()" 
                    class="px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition transform hover:scale-105 active:scale-95 bg-green-600 hover:bg-green-700">
                    ${t('Ver Resultados', 'View Results')} <i class="fa-solid fa-check ml-2"></i>
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>
      `;
    },

    renderOptions(question) {
      const qType = question.type;
      const inputType = qType === 'highlight' ? 'checkbox' : 'radio';
      const currentAnswers = state.answers[question.step] || [];
      
      return question.options.map((opt, idx) => {
        const isSelected = currentAnswers.includes(opt.id);
        const isCorrect = opt.correct;
        const showResult = state.showRationale;
        
        // Determinar estilos
        let borderClass = 'border-[var(--brand-border)]';
        let bgClass = 'bg-[var(--brand-card)]';
        let iconHtml = `<span class="w-6 h-6 rounded-full border-2 border-[var(--brand-border)] flex items-center justify-center text-xs ${isSelected ? 'bg-[rgb(var(--brand-blue-rgb))] border-[rgb(var(--brand-blue-rgb))] text-white' : 'text-transparent'}">${isSelected ? '✓' : ''}</span>`;
        
        if (showResult) {
          if (isCorrect) {
            borderClass = 'border-green-500';
            bgClass = 'bg-green-50 dark:bg-green-900/20';
            iconHtml = `<span class="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs"><i class="fa-solid fa-check"></i></span>`;
          } else if (isSelected && !isCorrect) {
            borderClass = 'border-red-500';
            bgClass = 'bg-red-50 dark:bg-red-900/20';
            iconHtml = `<span class="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"><i class="fa-solid fa-times"></i></span>`;
          }
        } else if (isSelected) {
          borderClass = 'border-[rgb(var(--brand-blue-rgb))]';
          bgClass = 'bg-[rgba(var(--brand-blue-rgb),0.05)]';
        }

        return `
          <label class="flex items-start gap-4 p-4 rounded-xl border-2 ${borderClass} ${bgClass} cursor-pointer transition-all hover:shadow-md ${showResult ? 'cursor-default' : ''}"
                 ${!showResult ? `onclick="window.NGN_ENGINE.selectOption('${opt.id}', ${qType === 'highlight'})"` : ''}>
            <div class="mt-0.5">${iconHtml}</div>
            <div class="flex-1">
              <div class="font-medium text-[var(--brand-text)]">${getContent(opt.text)}</div>
              ${showResult ? `
                <div class="mt-2 text-sm ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
                  <i class="fa-solid ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'} mr-1"></i>
                  ${getContent(opt.rationale)}
                </div>
              ` : ''}
            </div>
          </label>
        `;
      }).join('');
    },

    renderRationale(question) {
      const allCorrect = question.options.filter(o => o.correct).map(o => o.id);
      const userAnswers = state.answers[question.step] || [];
      const isFullyCorrect = question.type === 'highlight' 
        ? allCorrect.length === userAnswers.length && allCorrect.every(id => userAnswers.includes(id))
        : allCorrect[0] === userAnswers[0];

      return `
        <div class="mt-6 p-5 rounded-2xl ${isFullyCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'}">
          <div class="flex items-center gap-2 mb-3">
            <i class="fa-solid ${isFullyCorrect ? 'fa-check-circle text-green-600' : 'fa-exclamation-circle text-amber-600'} text-xl"></i>
            <span class="font-bold ${isFullyCorrect ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}">
              ${isFullyCorrect ? t('¡Correcto!', 'Correct!') : t('Revisa tu respuesta', 'Review your answer')}
            </span>
          </div>
          <div class="text-sm text-[var(--brand-text-muted)]">
            ${question.type === 'highlight' 
              ? t('Las respuestas correctas están marcadas en verde.', 'Correct answers are marked in green.')
              : t('La respuesta correcta está marcada en verde.', 'The correct answer is marked in green.')}
          </div>
        </div>
      `;
    },

    // ===== ACCIONES =====

    switchTab(tabName) {
      state.currentTab = tabName;
      this.refresh();
    },

    selectOption(optionId, isMulti) {
      if (state.showRationale) return;
      
      const currentQ = state.activeCase.questions[state.currentQuestion];
      const step = currentQ.step;
      
      if (!state.answers[step]) state.answers[step] = [];
      
      if (isMulti) {
        // SATA: toggle
        const idx = state.answers[step].indexOf(optionId);
        if (idx > -1) {
          state.answers[step].splice(idx, 1);
        } else {
          state.answers[step].push(optionId);
        }
      } else {
        // Single select: reemplazar
        state.answers[step] = [optionId];
      }
      
      this.updateSubmitButton();
      this.refreshOptions();
    },

    updateSubmitButton() {
      const btn = document.getElementById('ngn-submit-btn');
      if (!btn) return;
      
      const currentQ = state.activeCase.questions[state.currentQuestion];
      const answers = state.answers[currentQ.step] || [];
      const hasAnswer = answers.length > 0;
      
      btn.disabled = !hasAnswer;
      btn.classList.toggle('opacity-50', !hasAnswer);
      btn.classList.toggle('cursor-not-allowed', !hasAnswer);
      btn.classList.toggle('hover:scale-105', hasAnswer);
      btn.classList.toggle('hover:shadow-xl', hasAnswer);
    },

    refreshOptions() {
      const container = document.getElementById('ngn-options');
      if (!container) return;
      
      const currentQ = state.activeCase.questions[state.currentQuestion];
      container.innerHTML = this.renderOptions(currentQ);
    },

    refresh() {
      const view = document.getElementById('app-view');
      if (!view) return;
      
      view.innerHTML = this.generateLayoutHTML();
      
      // Aplicar idioma global si existe
      if (typeof window.applyGlobalLanguage === 'function') {
        window.applyGlobalLanguage();
      }
      
      // Actualizar estado del botón
      this.updateSubmitButton();
    },

    submitAnswer() {
      const currentQ = state.activeCase.questions[state.currentQuestion];
      const answers = state.answers[currentQ.step] || [];
      
      if (answers.length === 0) return;
      
      state.showRationale = true;
      
      // Calcular score
      const correctOptions = currentQ.options.filter(o => o.correct).map(o => o.id);
      let isCorrect = false;
      
      if (currentQ.type === 'highlight') {
        // SATA: todas las correctas y ninguna incorrecta
        const allCorrectSelected = correctOptions.every(id => answers.includes(id));
        const noIncorrectSelected = answers.every(id => correctOptions.includes(id));
        isCorrect = allCorrectSelected && noIncorrectSelected;
      } else {
        // Single: la seleccionada es correcta
        isCorrect = correctOptions[0] === answers[0];
      }
      
      if (isCorrect) state.score++;
      
      this.refresh();
    },

    nextQuestion() {
      if (state.currentQuestion < state.activeCase.questions.length - 1) {
        state.currentQuestion++;
        state.showRationale = false;
        this.refresh();
      }
    },

    finishCase() {
      state.isComplete = true;
      this.showResults();
    },

    showResults() {
      const c = state.activeCase;
      const percent = Math.round((state.score / c.questions.length) * 100);
      const passed = percent >= 70;
      
      const view = document.getElementById('app-view');
      if (!view) return;
      
      // Guardar en dashboard si existe
      if (window.Dashboard && typeof window.Dashboard.recordQuiz === 'function') {
        window.Dashboard.recordQuiz('NGN-' + c.id, state.score, c.questions.length);
      }
      
      view.innerHTML = `
        <div class="p-6 max-w-2xl mx-auto animate-fade-in">
          <div class="bg-[var(--brand-card)] rounded-3xl shadow-xl border border-[var(--brand-border)] overflow-hidden">
            <div class="p-8 text-center ${passed ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'} text-white">
              <div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid ${passed ? 'fa-trophy' : 'fa-book-open'} text-4xl"></i>
              </div>
              <h2 class="text-3xl font-black mb-2">${passed ? t('¡Excelente!', 'Excellent!') : t('Sigue practicando', 'Keep practicing')}</h2>
              <p class="text-white/90">${passed 
                ? t('Has demostrado comprensión del caso NGN.', 'You have demonstrated NGN case understanding.')
                : t('Repasa el caso e intenta nuevamente.', 'Review the case and try again.')}</p>
            </div>
            
            <div class="p-8">
              <div class="grid grid-cols-3 gap-4 mb-8">
                <div class="text-center p-4 rounded-2xl bg-[var(--brand-bg)]">
                  <div class="text-3xl font-black text-[var(--brand-text)]">${state.score}/${c.questions.length}</div>
                  <div class="text-xs text-[var(--brand-text-muted)] uppercase tracking-wider">${t('Correctas', 'Correct')}</div>
                </div>
                <div class="text-center p-4 rounded-2xl bg-[var(--brand-bg)]">
                  <div class="text-3xl font-black text-[var(--brand-text)]">${percent}%</div>
                  <div class="text-xs text-[var(--brand-text-muted)] uppercase tracking-wider">${t('Puntuación', 'Score')}</div>
                </div>
                <div class="text-center p-4 rounded-2xl bg-[var(--brand-bg)]">
                  <div class="text-3xl font-black ${passed ? 'text-green-600' : 'text-amber-600'}">${passed ? 'PASS' : 'REVIEW'}</div>
                  <div class="text-xs text-[var(--brand-text-muted)] uppercase tracking-wider">${t('Estado', 'Status')}</div>
                </div>
              </div>
              
              <div class="flex gap-3">
                <button onclick="window.NGN_ENGINE.resetCase()" 
                  class="flex-1 px-6 py-3 rounded-2xl bg-[var(--brand-bg)] text-[var(--brand-text)] font-bold hover:opacity-90 transition">
                  <i class="fa-solid fa-rotate-left mr-2"></i> ${t('Reintentar', 'Retry')}
                </button>
                <button onclick="window.nclexApp.navigate('home')" 
                  class="flex-1 px-6 py-3 rounded-2xl text-white font-bold hover:opacity-90 transition"
                  style="background-color: rgb(var(--brand-blue-rgb));">
                  <i class="fa-solid fa-home mr-2"></i> ${t('Dashboard', 'Dashboard')}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    resetCase() {
      state.currentQuestion = 0;
      state.answers = {};
      state.showRationale = false;
      state.score = 0;
      state.isComplete = false;
      state.currentTab = 'notes';
      this.refresh();
    }
  };

  // ===== API PÚBLICA =====
  window.renderNGNCase = function(caseId) {
    state.activeCase = NGN_CASES.find(c => c.id === caseId) || NGN_CASES[0];
    state.currentQuestion = 0;
    state.answers = {};
    state.showRationale = false;
    state.score = 0;
    state.isComplete = false;
    state.currentTab = 'notes';
    
    return window.NGN_ENGINE.generateLayoutHTML(caseId);
  };

})();