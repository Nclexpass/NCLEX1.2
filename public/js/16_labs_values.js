// 16_labs_values.js — Laboratory Values Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: Optimized Architecture & Full Content
// CREADO POR REYNIER DIAZ GERONES
// Combinación de lógica v8.0 con contenido clínico detallado v7.2

(function() {
  'use strict';

  // Safety Check
  if (typeof window.NCLEX === 'undefined') return;

  // --- HELPER DE TRADUCCIÓN (Optimización Técnica DRY) ---
  // Genera el HTML para bilingüismo sin repetir etiquetas constantemente
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  // CSS dinámico para el "Modo Estudio" (Blur effect)
  const style = document.createElement('style');
  style.innerHTML = `
    .study-mode .lab-value { filter: blur(6px); cursor: pointer; transition: all 0.3s; background: rgba(0,0,0,0.1); border-radius: 4px; user-select: none; }
    .study-mode .lab-value:hover, .study-mode .lab-value.revealed { filter: blur(0); background: transparent; }
    .study-mode .lab-value:hover::after { content: '👁️'; position: absolute; top: -15px; right: 0; font-size: 10px; }
  `;
  document.head.appendChild(style);

  NCLEX.registerTopic({
    id: 'labs-values',
    title: { es: 'Valores de Laboratorio', en: 'Laboratory Values' },
    subtitle: { es: 'Masterclass: Rangos y Farmacología', en: 'Masterclass: Ranges & Pharmacology' },
    icon: 'flask',
    color: 'cyan',

    render() {
      // Iniciar listeners después de que el DOM se pinte
      setTimeout(() => this.initInteractions(), 100);

      return `
        ${this.renderHeader()}
        <div id="labs-content" class="space-y-12 animate-fade-in transition-all">
          ${this.renderPrinciples()}
          ${this.renderElectrolytes()}
          ${this.renderHematologyCoag()}
          ${this.renderRenalMetabolic()}
          ${this.renderABGs()}
          ${this.renderCardiacLiver()}
          ${this.renderDrugLevels()}
          ${this.renderUrinalysis()}
        </div>
      `;
    },

    initInteractions() {
        const toggleBtn = document.getElementById('study-mode-toggle');
        const content = document.getElementById('labs-content');
        
        // Función para manejar clics en los valores de laboratorio individuales
        const handleLabValueClick = (e) => {
            if (content.classList.contains('study-mode') && e.target.classList.contains('lab-value')) {
                e.target.classList.add('revealed');
            }
        };

        if(toggleBtn && content) {
            toggleBtn.addEventListener('click', () => {
                const isActive = content.classList.contains('study-mode');
                
                if (isActive) {
                    // Desactivar modo estudio
                    content.classList.remove('study-mode');
                    content.removeEventListener('click', handleLabValueClick);
                } else {
                    // Activar modo estudio
                    content.classList.add('study-mode');
                    // Ocultar de nuevo todos los valores
                    document.querySelectorAll('.lab-value').forEach(el => {
                        el.classList.remove('revealed');
                    });
                    content.addEventListener('click', handleLabValueClick);
                }

                // Actualizar el estado del botón (Accesibilidad)
                const newIsActive = !isActive;
                toggleBtn.setAttribute('aria-pressed', newIsActive);

                // Actualizar el texto del botón usando el helper t()
                toggleBtn.innerHTML = newIsActive 
                    ? `<i class="fa-solid fa-eye-slash"></i> ${t('Modo Estudio (ON)', 'Study Mode (ON)')}`
                    : `<i class="fa-solid fa-eye"></i> ${t('Modo Estudio (OFF)', 'Study Mode (OFF)')}`;
                
                // Forzar actualización de visibilidad de idioma si la app principal lo requiere
                if(window.nclexApp && window.nclexApp.toggleLanguage) {
                     const currentLang = localStorage.getItem('nclex_lang') || 'es';
                     const isEs = currentLang === 'es';
                     toggleBtn.querySelectorAll('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
                     toggleBtn.querySelectorAll('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
                }
            });
        }
    },

    // --- Header with Toggle ---
    renderHeader() {
      return `
        <header class="flex flex-col gap-4 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-sm font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-flask"></i>
                ${t('NCLEX High-Yield', 'NCLEX High-Yield')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Hoja Maestra de Laboratorios', 'Lab Values Cheat Sheet')}
              </h1>
            </div>
            
            <button id="study-mode-toggle" aria-pressed="false" class="bg-slate-800 text-white dark:bg-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                <i class="fa-solid fa-eye"></i> 
                ${t('Modo Estudio (OFF)', 'Study Mode (OFF)')}
            </button>
          </div>
          
          <div class="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 flex items-start gap-3">
             <i class="fa-solid fa-lightbulb text-yellow-600 mt-1"></i>
             <p class="text-sm text-gray-700 dark:text-gray-300">
                ${t(
                  '<strong>Tip:</strong> Activa el "Modo Estudio" para ocultar los valores y ponerte a prueba. Haz clic en un número borroso para revelarlo.',
                  '<strong>Tip:</strong> Turn on "Study Mode" to hide values and quiz yourself. Click a blurred number to reveal it.'
                )}
             </p>
          </div>
        </header>
      `;
    },

    // --- 1. Principles ---
    renderPrinciples() {
      return `
        <section class="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-6 border border-blue-100 dark:border-blue-800">
          <h3 class="flex items-center gap-3 text-xl font-bold text-blue-800 dark:text-blue-300 mb-4">
            <i class="fa-solid fa-scale-balanced"></i>
            ${t('Reglas de Oro del NCLEX', 'NCLEX Golden Rules')}
          </h3>
          <ul class="space-y-3 text-base text-gray-700 dark:text-gray-300">
            <li class="flex items-start gap-3">
              <span class="bg-blue-200 text-blue-800 font-bold px-2 rounded min-w-[30px] text-center">1</span>
              <div>
                <strong class="text-slate-900 dark:text-white">Assess before Action:</strong> 
                ${t(
                  'Si el K+ es 6.0, primero <span class="text-red-600 font-bold">MONITOREA EL CORAZÓN</span> (ECG), luego llama.',
                  'If K+ is 6.0, first <span class="text-red-600 font-bold">MONITOR HEART</span> (ECG), then call MD.'
                )}
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="bg-blue-200 text-blue-800 font-bold px-2 rounded min-w-[30px] text-center">2</span>
              <div>
                <strong class="text-slate-900 dark:text-white">Trend vs. Isolated:</strong> 
                ${t(
                  'Un cambio agudo en un paciente sano es peor que un valor crónico en uno enfermo (ej: CO2 alto en EPOC).',
                  'Acute change in healthy pt is worse than chronic value in sick pt (e.g., high CO2 in COPD).'
                )}
              </div>
            </li>
          </ul>
        </section>
      `;
    },

    // --- 2. Electrolytes ---
    renderElectrolytes() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-black text-xl shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Electrolitos (Vitales)', 'Electrolytes (Vitals)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            <div class="group bg-white dark:bg-brand-card rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-brand-border hover:border-red-400 transition-all">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-2xl font-black text-red-600 dark:text-red-400">Potassium (K+)</h3>
                <span class="lab-value bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg font-mono font-bold text-lg relative">3.5 - 5.0</span>
              </div>
              <div class="space-y-4">
                <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900">
                  <strong class="text-red-700 dark:text-red-300 block mb-1 uppercase tracking-wider text-sm">CRITICAL / PANIC</strong>
                  <div class="flex justify-between items-center">
                    <span class="lab-value text-lg font-bold">< 3.0 or > 5.5</span>
                    <span class="text-xs font-bold text-red-600 dark:text-red-400 border border-red-200 px-2 py-1 rounded bg-white dark:bg-black/20">PRIORITY 1</span>
                  </div>
                </div>
                <div>
                  <strong class="block text-slate-700 dark:text-gray-300 mb-1">Hyperkalemia (> 5.0)</strong>
                  <ul class="text-sm text-gray-600 dark:text-gray-400 list-disc ml-4 space-y-1">
                    <li>
                        ${t(
                          '<span class="text-red-500 font-bold">Ondas T PICUDAS</span> y Elevación ST.',
                          '<span class="text-red-500 font-bold">PEAKED T-Waves</span> & ST Elevation.'
                        )}
                    </li>
                    <li>
                        <strong>Meds:</strong> 
                        ${t(
                          'Gluconato de Calcio (protege corazón), Insulina IV + Dextrosa (temporal), <span class="text-green-600 font-bold">Kayexalate</span> (permanente).',
                          'Calcium Gluconate (protect heart), IV Insulin + Dextrose (temp), <span class="text-green-600 font-bold">Kayexalate</span> (permanent).'
                        )}
                    </li>
                  </ul>
                </div>
                <div>
                  <strong class="block text-slate-700 dark:text-gray-300 mb-1">Hypokalemia (< 3.5)</strong>
                  <ul class="text-sm text-gray-600 dark:text-gray-400 list-disc ml-4 space-y-1">
                    <li>
                        ${t(
                          'Ondas U prominentes, Calambres Musculares.',
                          'Prominent U-Waves, Muscle Cramps.'
                        )}
                    </li>
                    <li>
                        ${t(
                          '<span class="text-red-500 font-bold">NUNCA K+ en IV PUSH</span> (Inyección Letal). Max 10-20 mEq/hr con bomba.',
                          '<span class="text-red-500 font-bold">NEVER IV PUSH K+</span> (Lethal Injection). Max 10-20 mEq/hr via Pump.'
                        )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="group bg-white dark:bg-brand-card rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-brand-border hover:border-blue-400 transition-all">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-2xl font-black text-blue-600 dark:text-blue-400">Sodium (Na+)</h3>
                <span class="lab-value bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg font-mono font-bold text-lg relative">135 - 145</span>
              </div>
              <div class="space-y-4">
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900">
                  <strong class="text-blue-700 dark:text-blue-300 block mb-1 uppercase tracking-wider text-sm">CRITICAL (NEURO)</strong>
                  <span class="lab-value text-lg font-bold">< 125 or > 155</span>
                  <p class="text-sm mt-1 opacity-80">
                      ${t(
                        'Cambio en conciencia (LOC), <strong class="text-red-500">Riesgo Convulsiones</strong>.',
                        'Change in LOC, <strong class="text-red-500">Seizure Risk</strong>.'
                      )}
                  </p>
                </div>
                <div>
                  <strong class="block text-slate-700 dark:text-gray-300 mb-1">Nursing Implication</strong>
                  <ul class="text-sm text-gray-600 dark:text-gray-400 list-disc ml-4">
                    <li>
                        ${t(
                          '<strong>SIADH:</strong> Na+ Bajo (Sangre Diluida). Restringir fluidos.',
                          '<strong>SIADH:</strong> Low Na+ (Dilute Blood). Fluid Restriction.'
                        )}
                    </li>
                    <li>
                        ${t(
                          '<strong>DI:</strong> Na+ Alto (Sangre Concentrada). Dar fluidos.',
                          '<strong>DI:</strong> High Na+ (Concentrated Blood). Give Fluids.'
                        )}
                    </li>
                    <li>${t('Nunca corregir rápido (Riesgo de daño cerebral/Desmielinización).', 'Never correct fast (Demyelination risk).')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 xl:col-span-2">
                <div class="group bg-white dark:bg-brand-card rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-brand-border">
                   <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-black text-orange-600 dark:text-orange-400">Calcium (Ca+)</h3>
                    <span class="lab-value bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg font-mono font-bold relative">9.0 - 10.5</span>
                  </div>
                  
                  <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2 mt-4">
                    <li>
                        <strong class="text-red-500">Hypocalcemia (< 9.0):</strong> <br>
                        ${t(
                          'Tetania, <span class="font-bold underline">Chvostek</span> (Mejilla), <span class="font-bold underline">Trousseau</span> (Manguito BP). Riesgo de Espasmo Laríngeo.',
                          'Tetany, <span class="font-bold underline">Chvostek\'s</span> (Cheek), <span class="font-bold underline">Trousseau\'s</span> (BP Cuff). Risk of Laryngeal Spasm.'
                        )}
                    </li>
                  </ul>
                </div>

                <div class="group bg-white dark:bg-brand-card rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-brand-border">
                   <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-black text-emerald-600 dark:text-emerald-400">Magnesium (Mg+)</h3>
                    <span class="lab-value bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg font-mono font-bold relative">1.3 - 2.1</span>
                  </div>
                  <p class="text-xs text-gray-500 mb-2 italic">"Magnesium is a drag" (Sedative)</p>
                  <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>
                        <strong class="text-red-500">Hypomagnesemia (< 1.3):</strong> <br>
                        ${t(
                          'Hiper-reflexia, <span class="font-bold text-red-600">Torsades de Pointes</span> (Paro Cardíaco).',
                          'Hyper-reflexia, <span class="font-bold text-red-600">Torsades de Pointes</span> (Cardiac Arrest).'
                        )}
                    </li>
                    <li>
                        <strong class="text-emerald-700 dark:text-emerald-300">Hyper:</strong> 
                        ${t(
                          'Pérdida de Reflejos Tendinosos (DTRs). Antídoto: Gluconato de Calcio.',
                          'Loss of DTRs (Deep Tendon Reflexes). Antidote: Calcium Gluconate.'
                        )}
                    </li>
                  </ul>
                </div>
            </div>

          </div>
        </section>
      `;
    },

    // --- 3. Hematology & Coagulation ---
    renderHematologyCoag() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Hematología y Coagulación', 'Heme & Coagulation')}
            </h2>
          </div>

          <div class="overflow-x-auto bg-white dark:bg-brand-card rounded-3xl shadow-lg border border-gray-200 dark:border-brand-border mb-8">
            <table class="w-full text-left border-collapse min-w-[600px]">
              <thead class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs uppercase">
                <tr>
                  <th class="px-6 py-4 rounded-tl-3xl">
                      ${t('Prueba', 'Test')}
                  </th>
                  <th class="px-6 py-4">
                      ${t('Rango Normal', 'Normal Range')}
                  </th>
                  <th class="px-6 py-4">
                      ${t('Contexto Clínico', 'Clinical Context')}
                  </th>
                  <th class="px-6 py-4 rounded-tr-3xl">
                      ${t('Acción / Antídoto', 'Action / Antidote')}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                <tr class="hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                  <td class="px-6 py-4 font-bold">Hemoglobin (Hgb)</td>
                  <td class="px-6 py-4"><span class="lab-value font-mono font-bold relative">12 - 18</span></td>
                  <td class="px-6 py-4 text-xs">
                      ${t('Capacidad de oxígeno.', 'Oxygen capacity.')}
                  </td>
                  <td class="px-6 py-4"><span class="font-bold text-red-600">< 7 = Transfuse</span></td>
                </tr>
                <tr class="hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                  <td class="px-6 py-4 font-bold">Platelets</td>
                  <td class="px-6 py-4"><span class="lab-value font-mono font-bold relative">150k - 400k</span></td>
                  <td class="px-6 py-4 text-xs">
                      ${t('Coagulación.', 'Clotting ability.')}
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-bold text-red-600">< 50k = Precautions</span><br>
                    <span class="text-xs text-gray-500">
                        ${t('Cepillo suave, no rasuradora eléctrica.', 'Soft toothbrush, no electric razors.')}
                    </span><br>
                    <span class="text-xs text-red-500 font-bold">
                        ${t('< 20k = Sangrado espontáneo, puede requerir transfusión.', '< 20k = Risk of spontaneous bleeding, may require transfusion.')}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 font-bold">WBC</td>
                  <td class="px-6 py-4"><span class="lab-value font-mono font-bold relative">5k - 10k</span></td>
                  <td class="px-6 py-4 text-xs">
                      ${t('Estado Inmune.', 'Immune Status.')}
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-bold text-orange-600">< 1,000 ANC</span> = ${t('Precauciones Neutropénicas.', 'Neutropenic Precautions.')}<br>
                    <span class="text-[10px] text-gray-500">
                        ${t('Sin flores, ni frutas/verduras crudas.', 'No flowers, no fresh fruit/veggies.')}
                    </span>
                  </td>
                </tr>
                <tr class="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500">
                  <td class="px-6 py-4 font-bold text-blue-800 dark:text-blue-300">aPTT (Heparin)</td>
                  <td class="px-6 py-4"><span class="lab-value font-mono font-bold relative">30 - 40s</span></td>
                  <td class="px-6 py-4">
                    Target: <span class="lab-value font-bold text-lg relative">1.5 - 2.5x</span> (60-80s)<br>
                    <span class="text-xs text-blue-600">
                        ${t('En goteo de Heparina.', 'While on Heparin drip.')}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <strong>
                        ${t('Antídoto: Sulfato de Protamina', 'Antidote: Protamine Sulfate')}
                    </strong>
                  </td>
                </tr>
                <tr class="bg-pink-50 dark:bg-pink-900/10 border-l-4 border-pink-500">
                  <td class="px-6 py-4 font-bold text-pink-800 dark:text-pink-300">INR (Warfarin)</td>
                  <td class="px-6 py-4"><span class="lab-value font-mono font-bold relative">0.8 - 1.1</span></td>
                  <td class="px-6 py-4">
                    Therapeutic: <span class="lab-value font-bold text-lg relative">2 - 3</span><br>
                    Mechanical Valve: <span class="lab-value font-bold relative">2.5 - 3.5</span>
                  </td>
                  <td class="px-6 py-4">
                    <strong>
                        ${t('Antídoto: Vitamina K', 'Antidote: Vitamin K')}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      `;
    },

    // --- 4. Renal & Metabolic ---
    renderRenalMetabolic() {
      return `
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          
          <div class="bg-white dark:bg-brand-card rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-brand-border">
            <h3 class="text-xl font-bold text-amber-600 dark:text-amber-400 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-kidneys"></i> Renal Function
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span class="text-gray-600 dark:text-gray-300">Creatinine (Cr)</span>
                <div class="text-right">
                  <span class="lab-value font-bold font-mono text-lg block relative">0.6 - 1.2</span>
                  <span class="text-xs text-amber-600 font-bold uppercase">
                      ${t('Mejor Indicador', 'Best Indicator')}
                  </span>
                </div>
              </div>
              <div class="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span class="text-gray-600 dark:text-gray-300">BUN</span>
                <div class="text-right">
                  <span class="lab-value font-bold font-mono text-lg block relative">10 - 20</span>
                  <span class="text-xs text-gray-500">
                      ${t('Afectado por deshidratación.', 'Affected by dehydration.')}
                  </span>
                </div>
              </div>
              <div class="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-sm text-amber-800 dark:text-amber-200">
                <strong>Safety:</strong> ${t(
                  'Si va a CT con contraste, verifica la Creatinina primero.',
                  'Verify Creatinine before Contrast Dye (CT Scan).'
                )}
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-brand-card rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-brand-border">
             <h3 class="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-candy-cane"></i> Glucose Control
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="font-bold text-gray-700 dark:text-gray-200">
                    ${t('Glucosa Ayuno', 'Fasting Glucose')}
                </span>
                <span class="lab-value font-mono text-lg relative">70 - 100</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-bold text-gray-700 dark:text-gray-200">HbA1c</span>
                <div class="text-right">
                  <span class="lab-value font-mono text-lg block relative">< 5.7%</span>
                  <span class="text-xs text-purple-500 font-bold">
                      ${t('Meta Diabética: < 7%', 'Diabetic Goal: < 7%')}
                  </span>
                </div>
              </div>
              <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900">
                <strong class="text-red-700 dark:text-red-300 text-sm">
                    ${t('Protocolo Hipoglucemia (< 70):', 'Hypoglycemia (< 70) Protocol:')}
                </strong>
                <p class="text-xs text-red-600 dark:text-red-400 mt-1">
                  ${t(
                    '1. Despierto? 15g Carbohidrato Rápido (Jugo).<br>2. Inconsciente? D50W IV o Glucagón IM.',
                    '1. Awake? 15g Fast Carb (Juice).<br>2. Unconscious? IV D50W or IM Glucagon.'
                  )}
                </p>
              </div>
            </div>
          </div>

        </section>
      `;
    },

    // --- 5. ABGs ---
    renderABGs() {
      return `
        <section class="mt-12">
           <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white font-black text-xl shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">ABGs (Arterial Blood Gases)</h2>
          </div>
          
          <div class="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div class="mb-6">
              <h3 class="text-2xl font-bold text-cyan-300 mb-2">
                  ${t('Método ROME (Interpretación Rápida)', 'ROME Method (Quick Interpretation)')}
              </h3>
              <p class="text-sm text-cyan-100/80">
                ${t(
                  '<strong>R</strong>espiratory <strong>O</strong>pposite (Respiratorio Opuesto), <strong>M</strong>etabolic <strong>E</strong>qual (Metabólico Igual). Para pH y PaCO2: si uno es anormal y el otro se mueve en dirección opuesta, es respiratorio.',
                  '<strong>R</strong>espiratory <strong>O</strong>pposite, <strong>M</strong>etabolic <strong>E</strong>qual. For pH and PaCO2: if one is abnormal and the other moves in the opposite direction, it\'s respiratory.'
                )}
              </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 text-center mt-4">
              <div class="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
                <h4 class="text-gray-400 uppercase text-xs font-bold mb-2">
                    ${t('Acidez', 'Acidity')}
                </h4>
                <div class="text-4xl font-black mb-1">pH</div>
                <div class="lab-value text-2xl font-mono text-cyan-300 relative">7.35 - 7.45</div>
                <div class="flex justify-between text-xs mt-2 px-4 opacity-70">
                  <span>Acid</span>
                  <span>Alk</span>
                </div>
              </div>

              <div class="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
                <h4 class="text-gray-400 uppercase text-xs font-bold mb-2">
                    ${t('Respiratorio (Pulmones)', 'Respiratory (Lungs)')}
                </h4>
                <div class="text-4xl font-black mb-1">PaCO2</div>
                <div class="lab-value text-2xl font-mono text-cyan-300 relative">35 - 45</div>
                <div class="flex justify-between text-xs mt-2 px-4 opacity-70">
                  <span>Alk</span>
                  <span>Acid</span>
                </div>
                <p class="text-[10px] mt-2 text-yellow-300">
                    ${t('Opuesto al pH (ROME)', 'Opposite to pH (ROME)')}
                </p>
              </div>

              <div class="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
                <h4 class="text-gray-400 uppercase text-xs font-bold mb-2">
                    ${t('Metabólico (Riñones)', 'Metabolic (Kidneys)')}
                </h4>
                <div class="text-4xl font-black mb-1">HCO3</div>
                <div class="lab-value text-2xl font-mono text-cyan-300 relative">22 - 26</div>
                <div class="flex justify-between text-xs mt-2 px-4 opacity-70">
                  <span>Acid</span>
                  <span>Alk</span>
                </div>
                 <p class="text-[10px] mt-2 text-yellow-300">
                     ${t('Igual al pH (ROME)', 'Equal to pH (ROME)')}
                 </p>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 6. Cardiac, Liver ---
    renderCardiacLiver() {
      return `
        <section class="mt-12">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-6">
            ${t('Marcadores Específicos', 'Specific Organ Markers')}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl shadow border border-gray-100 dark:border-brand-border">
              <div class="text-red-500 mb-2"><i class="fa-solid fa-heart-pulse fa-xl"></i></div>
              <strong class="block text-lg text-gray-900 dark:text-white">Troponin</strong>
              <p class="text-sm text-gray-500 mb-2">
                  ${t('Infarto Miocardio (MI)', 'MI (Heart Attack)')}
              </p>
              <div class="lab-value font-mono font-bold text-xl relative">< 0.5 ng/mL</div>
              <p class="text-xs text-red-500 mt-1 font-bold">
                  ${t('Estándar de Oro.', 'Gold Standard.')}
              </p>
              
              <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <strong class="block text-lg text-gray-900 dark:text-white">BNP</strong>
                  <p class="text-sm text-gray-500">
                      ${t('Falla Cardíaca (HF)', 'Heart Failure')}
                  </p>
                  <div class="lab-value font-mono font-bold text-xl relative">< 100</div>
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl shadow border border-gray-100 dark:border-brand-border">
              <div class="text-amber-500 mb-2"><i class="fa-solid fa-martini-glass-citrus fa-xl"></i></div>
              <strong class="block text-lg text-gray-900 dark:text-white">ALT / AST</strong>
              <p class="text-sm text-gray-500 mb-2">
                  ${t('Función Hepática', 'Liver Function')}
              </p>
              <div class="lab-value font-mono font-bold text-xl relative">8 - 40 U/L</div>
              <p class="text-xs text-amber-600 mt-1 font-bold">
                  ${t('Hepatitis, Cirrosis, Sobredosis Tylenol.', 'Hepatitis, Cirrhosis, Tylenol OD.')}
              </p>
              
              <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <strong class="block text-lg text-gray-900 dark:text-white">Ammonia</strong>
                  <div class="lab-value font-mono font-bold text-xl relative">15 - 45</div>
                  <p class="text-xs text-amber-600 mt-1 font-bold">
                      ${t('Encefalopatía.', 'Encephalopathy.')}
                  </p>
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl shadow border border-gray-100 dark:border-brand-border">
              <div class="text-yellow-500 mb-2"><i class="fa-solid fa-lemon fa-xl"></i></div>
              <strong class="block text-lg text-gray-900 dark:text-white">Lipase</strong>
              <p class="text-sm text-gray-500 mb-2">Pancreatitis</p>
              <div class="lab-value font-mono font-bold text-xl relative">< 160</div>
              <p class="mt-2 text-xs bg-yellow-100 text-yellow-800 p-2 rounded">
                  <strong>Sx:</strong> 
                  ${t('Dolor epigástrico a espalda. Prioridad NPO.', 'Epigastric pain to back. NPO priority.')}
              </p>
            </div>
          </div>
        </section>
      `;
    },

    // --- 7. Therapeutic Drug Levels ---
    renderDrugLevels() {
      return `
        <section class="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-6">
            ${t('Niveles de Fármacos (Rango Terapéutico)', 'Therapeutic Drug Levels')}
          </h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div class="bg-white dark:bg-brand-card p-4 rounded-2xl shadow-sm border-l-4 border-emerald-500 relative overflow-hidden group">
              <strong class="text-emerald-700 dark:text-emerald-400 block text-lg">Digoxin</strong>
              <span class="text-xs text-gray-500">
                  ${t('Falla Cardíaca', 'Heart Failure')}
              </span>
              <div class="lab-value text-2xl font-black mt-2 mb-1 relative">0.5 - 2.0</div>
              <p class="text-xs text-red-500 font-bold mb-1">Toxic > 2.0</p>
              <div class="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded text-[11px] leading-tight">
                <strong>NCLEX:</strong> 
                ${t('Checar Pulso Apical 1 min. No dar si < 60 bpm.', 'Check Apical Pulse 1 min. Hold if < 60 bpm.')}
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-4 rounded-2xl shadow-sm border-l-4 border-blue-500 relative overflow-hidden group">
              <strong class="text-blue-700 dark:text-blue-400 block text-lg">Lithium</strong>
              <span class="text-xs text-gray-500">
                  ${t('Manía Bipolar', 'Bipolar Mania')}
              </span>
              <div class="lab-value text-2xl font-black mt-2 mb-1 relative">0.6 - 1.2</div>
              <p class="text-xs text-red-500 font-bold mb-1">Toxic > 1.5</p>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-[11px] leading-tight">
                <strong>NCLEX:</strong> 
                ${t('Sodio Bajo = Toxicidad. No limitar sal/agua.', 'Low Sodium = Toxicity. Don\'t limit salt/water.')}
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-4 rounded-2xl shadow-sm border-l-4 border-purple-500 relative overflow-hidden group">
              <strong class="text-purple-700 dark:text-purple-400 block text-lg">Phenytoin</strong>
              <span class="text-xs text-gray-500">
                  ${t('Convulsiones', 'Seizures')}
              </span>
              <div class="lab-value text-2xl font-black mt-2 mb-1 relative">10 - 20</div>
              <p class="text-xs text-red-500 font-bold mb-1">Toxic > 20</p>
              <p class="text-[10px] text-gray-500 mt-1">
                  ${t('Hiperplasia Gingival (Efecto Normal).', 'Gingival Hyperplasia (Normal SE).')}
              </p>
            </div>

            <div class="bg-white dark:bg-brand-card p-4 rounded-2xl shadow-sm border-l-4 border-orange-500 relative overflow-hidden group">
              <strong class="text-orange-700 dark:text-orange-400 block text-lg">Theophylline</strong>
              <span class="text-xs text-gray-500">
                  ${t('Espasmos Aéreos', 'Airway Spasms')}
              </span>
              <div class="lab-value text-2xl font-black mt-2 mb-1 relative">10 - 20</div>
              <p class="text-xs text-red-500 font-bold mb-1">Toxic > 20</p>
              <p class="text-[10px] text-gray-500 mt-1">
                  ${t('Evitar Cafeína. Monitorear Taquicardia.', 'Avoid Caffeine. Monitor for Tachycardia.')}
              </p>
            </div>

          </div>
        </section>
      `;
    },

    // --- 8. Urinalysis ---
    renderUrinalysis() {
      return `
        <section class="mt-12 mb-20">
           <div class="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-3xl p-6">
            <h3 class="font-bold text-lg text-yellow-800 dark:text-yellow-300 mb-4">Urinalysis: Specific Gravity</h3>
            <div class="flex flex-col md:flex-row items-center gap-6">
              <div class="lab-value text-4xl font-black text-slate-800 dark:text-white relative">1.005 - 1.030</div>
              <div class="flex-1 space-y-2">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-blue-600">Low (< 1.005):</span>
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                      ${t('Diluida. <span class="font-bold">Diabetes Insípida</span> (Falta ADH).', 'Dilute. <span class="font-bold">Diabetes Insipidus</span> (Lack of ADH).')}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-amber-600">High (> 1.030):</span>
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                      ${t('Concentrada. <span class="font-bold">Deshidratación</span> o <span class="font-bold">SIADH</span> (Exceso ADH).', 'Concentrated. <span class="font-bold">Dehydration</span> or <span class="font-bold">SIADH</span> (Too much ADH).')}
                  </span>
                </div>
              </div>
            </div>
           </div>
        </section>
      `;
    }
  });
})();