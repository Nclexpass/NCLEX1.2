/* ngn_engine.js — Next Gen NCLEX Case Engine v4.0 (PDF Export + Multi-Case Support) */

(function () {
  'use strict';

  // ===== DEPENDENCIAS SEGURAS =====
  const U = window.NCLEXUtils || (() => {
    return {
      $: (s) => document.querySelector(s),
      $$: (s) => Array.from(document.querySelectorAll(s)),
      storageGet: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } },
      escapeHtml: (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    };
  })();

  // ===== CONFIGURACIÓN DE CASOS (ÁREA EDITABLE) =====
  // Para agregar un nuevo caso, copia todo el bloque entre { ... } y pégalo después de la coma.
  const NGN_CASES = [
    {
      id: 'sepsis',
      title: { en: 'Emergency: Sepsis Protocol', es: 'Urgencias: Protocolo de Sepsis' },
      difficulty: 'Hard',
      time: 15, // minutos
      scenario: {
        en: 'A 78-year-old male client is brought to the ED by his daughter due to increasing confusion, fever, and lethargy.',
        es: 'Paciente masculino de 78 años es traído a Urgencias por su hija debido a confusión creciente, fiebre y letargo.'
      },
      // Pestañas de Información Clínica
      tabs: {
        notes: {
          label: { en: 'Nurses Notes', es: 'Notas Enfermería' },
          icon: 'fa-user-nurse',
          content: {
            en: `<strong>10:00:</strong> Client arrived via private vehicle. Daughter reports client has had a UTI for 3 days. Since this morning, he has become "very sleepy and talking nonsense."<br>
                 <strong>10:15:</strong> Client is disoriented x3. Skin flushed/warm. Shivering. Cap refill > 3s.`,
            es: `<strong>10:00:</strong> Cliente llega en vehículo particular. Hija reporta ITU de 3 días. Desde la mañana está "muy dormido y dice cosas sin sentido".<br>
                 <strong>10:15:</strong> Desorientado x3. Piel roja/caliente. Escalofríos. Llenado capilar > 3s.`
          }
        },
        vitals: {
          label: { en: 'Vital Signs', es: 'Signos Vitales' },
          icon: 'fa-heart-pulse',
          content: {
            en: `<div class="grid grid-cols-2 gap-2 text-sm">
                  <div class="p-2 bg-red-50 border border-red-200 rounded"><strong>Temp:</strong> 38.9°C (102°F)</div>
                  <div class="p-2 bg-red-50 border border-red-200 rounded"><strong>HR:</strong> 118 bpm</div>
                  <div class="p-2 bg-yellow-50 border border-yellow-200 rounded"><strong>RR:</strong> 24 /min</div>
                  <div class="p-2 bg-red-50 border border-red-200 rounded"><strong>BP:</strong> 88/54 mmHg</div>
                  <div class="col-span-2 p-2 bg-yellow-50 border border-yellow-200 rounded"><strong>O2 Sat:</strong> 91% (Room Air)</div>
                 </div>`,
            es: `<div class="grid grid-cols-2 gap-2 text-sm">
                  <div class="p-2 bg-red-50 border border-red-200 rounded"><strong>Temp:</strong> 38.9°C (Fiebre)</div>
                  <div class="p-2 bg-red-50 border border-red-200 rounded"><strong>FC:</strong> 118 lpm</div>
                  <div class="p-2 bg-yellow-50 border border-yellow-200 rounded"><strong>FR:</strong> 24 rpm</div>
                  <div class="p-2 bg-red-50 border border-red-200 rounded"><strong>PA:</strong> 88/54 mmHg</div>
                  <div class="col-span-2 p-2 bg-yellow-50 border border-yellow-200 rounded"><strong>SatO2:</strong> 91% (Aire Ambiente)</div>
                 </div>`
          }
        },
        labs: {
          label: { en: 'Labs', es: 'Laboratorio' },
          icon: 'fa-flask',
          content: {
            en: `<ul class="list-disc pl-4 space-y-1 text-sm">
                  <li><strong>WBC:</strong> 24,000 /mm³ (High)</li>
                  <li><strong>Lactate:</strong> 4.2 mmol/L (Critical)</li>
                  <li><strong>Creatinine:</strong> 1.8 mg/dL</li>
                  <li><strong>Urine:</strong> +++ Bacteria, + Leukocytes</li>
                 </ul>`,
            es: `<ul class="list-disc pl-4 space-y-1 text-sm">
                  <li><strong>Leucocitos:</strong> 24,000 /mm³ (Alto)</li>
                  <li><strong>Lactato:</strong> 4.2 mmol/L (Crítico)</li>
                  <li><strong>Creatinina:</strong> 1.8 mg/dL</li>
                  <li><strong>Orina:</strong> +++ Bacterias, + Leucocitos</li>
                 </ul>`
          }
        }
      },
      // Preguntas Secuenciales (Step 1, 2, 3...)
      questions: [
        {
          step: 1,
          type: 'highlight', // Selección Múltiple (SATA)
          text: {
            en: 'Step 1: Recognize Cues. Select ALL findings consistent with Sepsis:',
            es: 'Paso 1: Reconocer Pistas. Selecciona TODOS los hallazgos consistentes con Sepsis:'
          },
          options: [
            { id: 'opt1', text: { en: 'Temp 38.9°C', es: 'Temp 38.9°C' }, correct: true, rationale: { en: 'Fever is a classic sign of infection.', es: 'La fiebre es signo clásico de infección.' } },
            { id: 'opt2', text: { en: 'BP 88/54 mmHg', es: 'PA 88/54 mmHg' }, correct: true, rationale: { en: 'Hypotension indicates septic shock.', es: 'La hipotensión indica shock séptico.' } },
            { id: 'opt3', text: { en: 'HR 118 bpm', es: 'FC 118 lpm' }, correct: true, rationale: { en: 'Tachycardia is a compensatory mechanism.', es: 'La taquicardia es un mecanismo compensatorio.' } },
            { id: 'opt4', text: { en: 'Lactate 4.2', es: 'Lactato 4.2' }, correct: true, rationale: { en: 'Elevated lactate indicates tissue hypoxia.', es: 'Lactato elevado indica hipoxia tisular.' } },
            { id: 'opt5', text: { en: 'O2 Sat 91%', es: 'SatO2 91%' }, correct: false, rationale: { en: 'Hypoxia is present but not specific to sepsis definition.', es: 'Hay hipoxia pero no es criterio definitorio primario.' } }
          ]
        },
        {
          step: 2,
          type: 'priority', // Selección Única
          text: {
            en: 'Step 2: Prioritize. What is the PRIORITY intervention?',
            es: 'Paso 2: Priorizar. ¿Cuál es la intervención PRIORITARIA?'
          },
          options: [
            { id: 'p1', text: { en: 'IV Fluids (30ml/kg)', es: 'Fluidos IV (30ml/kg)' }, correct: true, rationale: { en: 'Fluid resuscitation is critical for hypotension.', es: 'La reanimación con fluidos es crítica para la hipotensión.' } },
            { id: 'p2', text: { en: 'IV Antibiotics', es: 'Antibióticos IV' }, correct: false, rationale: { en: 'Important, but fluids come first for perfusion.', es: 'Importante, pero la perfusión (fluidos) va primero.' } },
            { id: 'p3', text: { en: 'Vasopressors', es: 'Vasopresores' }, correct: false, rationale: { en: 'Used only after fluids fail.', es: 'Se usan solo si fallan los fluidos.' } },
            { id: 'p4', text: { en: 'CT Scan', es: 'TAC Abdominal' }, correct: false, rationale: { en: 'Diagnostic, not life-saving right now.', es: 'Diagnóstico, no salva la vida ahora mismo.' } }
          ]
        },
        {
          step: 3,
          type: 'action', // Selección Única
          text: {
            en: 'Step 3: Action. Fluids completed. BP is 85/50. What next?',
            es: 'Paso 3: Acción. Fluidos terminados. PA es 85/50. ¿Qué sigue?'
          },
          options: [
            { id: 'a1', text: { en: 'Start Norepinephrine', es: 'Iniciar Norepinefrina' }, correct: true, rationale: { en: 'First-line vasopressor for septic shock.', es: 'Vasopresor de primera línea en shock séptico.' } },
            { id: 'a2', text: { en: 'Give more fluids', es: 'Dar más fluidos' }, correct: false, rationale: { en: 'Risk of fluid overload (pulmonary edema).', es: 'Riesgo de sobrecarga (edema pulmonar).' } },
            { id: 'a3', text: { en: 'Give Lasix', es: 'Dar Lasix' }, correct: false, rationale: { en: 'Contraindicated in hypotension.', es: 'Contraindicado en hipotensión.' } }
          ]
        }
      ]
    }
  ];

  // ===== ESTADO INTERNO =====
  const state = {
    activeCase: null,
    currentTab: 'notes',
    currentQIndex: 0,
    answers: {}, // Mapa de respuestas { step: [ids] }
    history: [], // Historial para el reporte PDF
    score: 0,
    showRationale: false,
    isComplete: false
  };

  // ===== HELPERS =====
  function getLang() {
    if (window.nclexApp && typeof window.nclexApp.getCurrentLang === 'function') {
      return window.nclexApp.getCurrentLang();
    }
    return U.storageGet('nclex_lang', 'es');
  }

  function t(obj) {
    if (typeof obj === 'string') return obj;
    const lang = getLang();
    return obj[lang] || obj['en'] || '';
  }

  // ===== GENERADOR PDF (CLINICAL REPORT) =====
  function downloadNGNReport() {
    const lang = getLang();
    const isEs = lang === 'es';
    const c = state.activeCase;
    
    let html = `
      <html>
      <head>
        <title>NGN Clinical Report: ${t(c.title)}</title>
        <style>
          body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
          h1 { margin: 0; color: #0f172a; font-size: 24px; }
          .meta { font-size: 14px; color: #64748b; margin-top: 5px; }
          .scenario-box { background: #fff7ed; border: 1px solid #fed7aa; padding: 15px; border-radius: 8px; margin-bottom: 30px; font-size: 14px; }
          .q-block { margin-bottom: 25px; page-break-inside: avoid; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; }
          .q-step { font-weight: bold; text-transform: uppercase; font-size: 10px; color: #64748b; letter-spacing: 1px; }
          .q-text { font-weight: bold; font-size: 16px; margin: 5px 0 15px 0; }
          .opt { padding: 8px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
          .opt:last-child { border-bottom: none; }
          .status-correct { color: #166534; font-weight: bold; }
          .status-wrong { color: #991b1b; font-weight: bold; }
          .rationale { margin-top: 15px; background: #f8fafc; padding: 12px; font-size: 13px; font-style: italic; border-left: 3px solid #3b82f6; }
          .score-box { text-align: center; margin-top: 40px; padding: 20px; background: #f1f5f9; border-radius: 12px; font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>NCLEX NGN Report: ${t(c.title)}</h1>
          <div class="meta">
            ${isEs ? 'Estudiante' : 'Student'}: Reynier Diaz Gerones • Date: ${new Date().toLocaleDateString()}
          </div>
        </div>

        <div class="scenario-box">
          <strong>${isEs ? 'Escenario Clínico' : 'Clinical Scenario'}:</strong><br>
          ${t(c.scenario)}
        </div>
    `;

    state.history.forEach((h, idx) => {
      const q = h.question;
      const userAns = h.selected; // Array of IDs
      const correctAns = q.options.filter(o => o.correct).map(o => o.id);
      
      // Lógica de corrección simple para el reporte
      const isStepCorrect = (q.type === 'highlight')
        ? (correctAns.length === userAns.length && correctAns.every(id => userAns.includes(id)))
        : (correctAns[0] === userAns[0]);

      html += `<div class="q-block">
        <div class="q-step">${isEs ? 'PASO' : 'STEP'} ${q.step}</div>
        <div class="q-text">${t(q.text)}</div>`;

      q.options.forEach(opt => {
        const isSelected = userAns.includes(opt.id);
        const isCorrect = opt.correct;
        
        let marker = '⚪';
        let style = '';
        
        if (isCorrect) { marker = '✅'; style = 'status-correct'; }
        else if (isSelected) { marker = '❌'; style = 'status-wrong'; }
        
        // Solo mostrar opciones relevantes (seleccionadas o correctas) para ahorrar espacio
        if (isSelected || isCorrect) {
             html += `<div class="opt ${style}">${marker} ${t(opt.text)}</div>`;
        }
      });

      html += `<div class="rationale"><strong>Rationale:</strong> ${t(q.options.find(o => o.correct)?.rationale || 'Review clinical guidelines.')}</div>`;
      html += `</div>`;
    });

    html += `
        <div class="score-box">
            FINAL SCORE: ${state.score} / ${c.questions.length} (${Math.round((state.score/c.questions.length)*100)}%)
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
  }

  // ===== RENDERIZADO UI =====
  
  window.NGN_ENGINE = {
    renderLayout(caseId = 'sepsis') {
      const c = NGN_CASES.find(x => x.id === caseId) || NGN_CASES[0];
      state.activeCase = c;
      const lang = getLang();
      const isEs = lang === 'es';

      const q = c.questions[state.currentQIndex];
      const progress = ((state.currentQIndex + 1) / c.questions.length) * 100;
      
      const tabData = c.tabs[state.currentTab];

      return `
        <div class="animate-fade-in pb-20 max-w-[1600px] mx-auto">
          <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <button onclick="window.nclexApp.navigate('home')" class="text-sm font-bold text-[var(--brand-text-muted)] hover:text-[rgb(var(--brand-blue-rgb))] mb-2 flex items-center gap-2">
                    <i class="fa-solid fa-arrow-left"></i> ${isEs ? 'Volver' : 'Back'}
                </button>
                <h1 class="text-2xl font-black text-[var(--brand-text)] flex items-center gap-3">
                    <span class="bg-orange-500 text-white text-xs px-2 py-1 rounded-md">NGN</span>
                    ${t(c.title)}
                </h1>
             </div>
             <div class="flex items-center gap-4">
                <div class="text-right hidden md:block">
                    <div class="text-xs font-bold text-[var(--brand-text-muted)] uppercase">${isEs ? 'Tiempo' : 'Time'}</div>
                    <div class="font-mono font-bold text-[var(--brand-text)]">~${c.time} min</div>
                </div>
                <div class="w-32">
                    <div class="h-2 bg-[var(--brand-bg)] rounded-full overflow-hidden border border-[var(--brand-border)]">
                        <div class="h-full bg-orange-500 transition-all duration-500" style="width: ${progress}%"></div>
                    </div>
                </div>
             </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[calc(100vh-280px)] min-h-[600px]">
            
            <div class="bg-[var(--brand-card)] rounded-2xl shadow-xl border border-[var(--brand-border)] flex flex-col overflow-hidden">
                <div class="bg-orange-50 dark:bg-orange-900/10 p-4 border-b border-orange-100 dark:border-orange-800/30 text-sm text-[var(--brand-text)] leading-relaxed">
                    <strong>${isEs ? 'ESCENARIO' : 'SCENARIO'}:</strong> ${t(c.scenario)}
                </div>

                <div class="flex border-b border-[var(--brand-border)] bg-[var(--brand-bg)]">
                    ${Object.keys(c.tabs).map(key => {
                        const tab = c.tabs[key];
                        const isActive = state.currentTab === key;
                        return `
                            <button onclick="window.NGN_ENGINE.setTab('${key}')" 
                                class="flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2
                                ${isActive ? 'bg-[var(--brand-card)] text-orange-600 border-t-2 border-orange-500' : 'text-[var(--brand-text-muted)] hover:bg-[var(--brand-card)]'}">
                                <i class="fa-solid ${tab.icon}"></i> ${t(tab.label)}
                            </button>
                        `;
                    }).join('')}
                </div>

                <div class="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed text-[var(--brand-text)] bg-[var(--brand-card)]">
                    ${t(tabData.content)}
                </div>
            </div>

            <div class="bg-[var(--brand-card)] rounded-2xl shadow-xl border border-[var(--brand-border)] flex flex-col relative">
                <div class="p-6 border-b border-[var(--brand-border)]">
                    <span class="text-xs font-black text-orange-500 uppercase tracking-widest mb-2 block">
                        ${isEs ? 'PREGUNTA' : 'QUESTION'} ${q.step} / ${c.questions.length}
                    </span>
                    <h2 class="text-lg font-bold text-[var(--brand-text)]">${t(q.text)}</h2>
                </div>

                <div class="flex-1 p-6 overflow-y-auto space-y-3">
                    ${this.renderOptions(q)}
                    ${state.showRationale ? this.renderRationaleBox(q) : ''}
                </div>

                <div class="p-6 border-t border-[var(--brand-border)] bg-[var(--brand-bg)] flex justify-between items-center rounded-b-2xl">
                    ${!state.showRationale ? `
                        <button onclick="window.NGN_ENGINE.submit()" 
                            class="w-full py-4 rounded-xl font-black text-white shadow-lg bg-gradient-to-r from-orange-500 to-red-500 hover:scale-[1.02] transition-transform">
                            ${isEs ? 'ENVIAR RESPUESTA' : 'SUBMIT ANSWER'}
                        </button>
                    ` : `
                        <button onclick="window.NGN_ENGINE.next()" 
                            class="w-full py-4 rounded-xl font-black text-white shadow-lg bg-[rgb(var(--brand-blue-rgb))] hover:scale-[1.02] transition-transform">
                            ${state.currentQIndex < c.questions.length - 1 ? (isEs ? 'SIGUIENTE' : 'NEXT') : (isEs ? 'VER RESULTADOS' : 'VIEW RESULTS')} <i class="fa-solid fa-arrow-right ml-2"></i>
                        </button>
                    `}
                </div>
            </div>
          </div>
        </div>
      `;
    },

    renderOptions(q) {
        const answers = state.answers[q.step] || [];
        const isMulti = q.type === 'highlight';
        
        return q.options.map(opt => {
            const isSelected = answers.includes(opt.id);
            const isCorrect = opt.correct;
            const show = state.showRationale;
            
            let style = "border-[var(--brand-border)] hover:bg-[var(--brand-bg)]";
            let icon = isMulti ? "fa-square" : "fa-circle";
            
            if (show) {
                if (isCorrect) style = "border-green-500 bg-green-50 dark:bg-green-900/20";
                else if (isSelected) style = "border-red-500 bg-red-50 dark:bg-red-900/20";
            } else if (isSelected) {
                style = "border-[rgb(var(--brand-blue-rgb))] bg-[rgba(var(--brand-blue-rgb),0.05)] shadow-md";
                icon = isMulti ? "fa-check-square" : "fa-dot-circle";
            }

            return `
                <button ${!show ? `onclick="window.NGN_ENGINE.select('${opt.id}', ${isMulti})"` : ''}
                    class="w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${style}">
                    <i class="fa-regular ${icon} mt-1 ${isSelected ? 'text-[rgb(var(--brand-blue-rgb))]' : 'text-[var(--brand-text-muted)]'}"></i>
                    <span class="text-[var(--brand-text)] text-sm font-medium">${t(opt.text)}</span>
                    ${show && isCorrect ? '<i class="fa-solid fa-check text-green-600 ml-auto"></i>' : ''}
                    ${show && isSelected && !isCorrect ? '<i class="fa-solid fa-xmark text-red-600 ml-auto"></i>' : ''}
                </button>
            `;
        }).join('');
    },

    renderRationaleBox(q) {
        const answers = state.answers[q.step] || [];
        const correctIds = q.options.filter(o => o.correct).map(o => o.id);
        const isCorrect = (q.type === 'highlight')
            ? (correctIds.length === answers.length && correctIds.every(id => answers.includes(id)))
            : (correctIds[0] === answers[0]);
        
        const lang = getLang();
        
        return `
            <div class="mt-4 p-5 rounded-xl animate-fade-in ${isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}">
                <div class="font-bold mb-2 flex items-center gap-2 ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-orange-800 dark:text-orange-200'}">
                    <i class="fa-solid ${isCorrect ? 'fa-check' : 'fa-lightbulb'}"></i>
                    ${isCorrect ? (lang === 'es' ? '¡Correcto!' : 'Correct!') : (lang === 'es' ? 'Razonamiento Clínico' : 'Clinical Rationale')}
                </div>
                <div class="space-y-2 text-sm text-[var(--brand-text)]">
                    ${q.options.filter(o => o.correct).map(o => `
                        <div class="flex gap-2">
                            <i class="fa-solid fa-check text-green-500 mt-1"></i>
                            <span><strong>${t(o.text)}:</strong> ${t(o.rationale)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderResults() {
        const c = state.activeCase;
        const passed = (state.score / c.questions.length) >= 0.6; // 60% passing
        const isEs = getLang() === 'es';

        return `
            <div class="max-w-xl mx-auto pt-10 text-center animate-fade-in">
                <div class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-xl ${passed ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}">
                    <i class="fa-solid ${passed ? 'fa-user-nurse' : 'fa-book-medical'}"></i>
                </div>
                <h2 class="text-3xl font-black text-[var(--brand-text)] mb-2">${passed ? (isEs ? '¡Excelente Trabajo!' : 'Great Job!') : (isEs ? 'Sigue Practicando' : 'Keep Practicing')}</h2>
                <p class="text-[var(--brand-text-muted)] mb-8">${isEs ? 'Has completado el caso clínico.' : 'You have completed the clinical case.'}</p>
                
                <div class="bg-[var(--brand-card)] p-6 rounded-2xl border border-[var(--brand-border)] shadow-sm mb-8">
                    <div class="text-sm font-bold text-[var(--brand-text-muted)] uppercase mb-2">${isEs ? 'Puntaje Final' : 'Final Score'}</div>
                    <div class="text-4xl font-black text-[var(--brand-text)]">${state.score} / ${c.questions.length}</div>
                </div>

                <div class="flex flex-col gap-3">
                    <button onclick="window.downloadNGNReport()" class="w-full py-4 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 shadow-lg flex items-center justify-center gap-2">
                        <i class="fa-solid fa-file-pdf"></i> ${isEs ? 'Descargar Reporte Clínico' : 'Download Clinical Report'}
                    </button>
                    <button onclick="window.location.reload()" class="w-full py-4 rounded-xl font-bold bg-[var(--brand-bg)] text-[var(--brand-text)] hover:bg-[var(--brand-border)]">
                        ${isEs ? 'Volver al Inicio' : 'Back to Home'}
                    </button>
                </div>
            </div>
        `;
    },

    // ===== CONTROLADORES =====
    setTab(t) { state.currentTab = t; this.refresh(); },
    
    select(id, isMulti) {
        const step = state.activeCase.questions[state.currentQIndex].step;
        if (!state.answers[step]) state.answers[step] = [];
        
        if (isMulti) {
            if (state.answers[step].includes(id)) state.answers[step] = state.answers[step].filter(x => x !== id);
            else state.answers[step].push(id);
        } else {
            state.answers[step] = [id];
        }
        this.refresh();
    },

    submit() {
        const q = state.activeCase.questions[state.currentQIndex];
        const ans = state.answers[q.step] || [];
        if (ans.length === 0) return; // No answer

        // Save history for PDF
        state.history.push({ question: q, selected: [...ans] });

        // Score logic
        const correctIds = q.options.filter(o => o.correct).map(o => o.id);
        const isCorrect = (q.type === 'highlight')
            ? (correctIds.length === ans.length && correctIds.every(id => ans.includes(id)))
            : (correctIds[0] === ans[0]);
        
        if (isCorrect) state.score++;
        
        state.showRationale = true;
        this.refresh();
    },

    next() {
        if (state.currentQIndex < state.activeCase.questions.length - 1) {
            state.currentQIndex++;
            state.showRationale = false;
            this.refresh();
        } else {
            state.isComplete = true;
            const view = document.getElementById('app-view');
            view.innerHTML = this.renderResults();
        }
    },

    refresh() {
        const view = document.getElementById('app-view');
        if (view && !state.isComplete) {
            // Guardar scroll position si es necesario
            view.innerHTML = this.renderLayout(state.activeCase.id);
        }
    }
  };

  // Bridge global
  window.renderNGNCase = function(caseId) {
    state.currentQIndex = 0;
    state.score = 0;
    state.answers = {};
    state.history = [];
    state.showRationale = false;
    state.isComplete = false;
    state.currentTab = 'notes';
    return window.NGN_ENGINE.renderLayout(caseId);
  };
  
  window.downloadNGNReport = downloadNGNReport;

})();