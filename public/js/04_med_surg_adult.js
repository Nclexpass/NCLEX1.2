// 04_med_surg_adult.js — Med-Surg Adult Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: Fluids, GI, Renal, Shock & Perioperative
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Fusionado y Optimizado para NCLEX High Yield
// Dependencias: window.NCLEX.registerTopic

(function () {
  'use strict';

  NCLEX.registerTopic({
    id: 'med-surg-adult',
    title: { es: 'Med-Surg General', en: 'General Med-Surg' },
    subtitle: { es: 'Fluidos, Renal, GI & Shock', en: 'Fluids, Renal, GI & Shock' },
    icon: 'bed-pulse',
    color: 'indigo',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-3 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-user-nurse"></i>
                <span class="lang-es">Sistemas Críticos</span>
                <span class="lang-en hidden-lang">Critical Systems</span>
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                <span class="lang-es">Adult Health Med-Surg</span>
                <span class="lang-en hidden-lang">Adult Health Med-Surg</span>
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                <span class="lang-es">Seguridad Clínica: Electrolitos, Sepsis, Fallo Renal y Perioperatorio.</span>
                <span class="lang-en hidden-lang">Clinical Safety: Electrolytes, Sepsis, Renal Failure & Perioperative.</span>
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderFluidsElectrolytes()}
          ${this.renderShockSepsis()}
          ${this.renderGI()}
          ${this.renderRenal()}
          ${this.renderPerioperative()}
          ${this.renderOncologySafety()}
        </div>
      `;
    },

    // --- 1. Fluids & Electrolytes ---
    renderFluidsElectrolytes() {
      return `
        <section>
          <div class="flex items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">1</div>
            <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Fluidos y Electrolitos</span>
              <span class="lang-en hidden-lang">Fluids & Electrolytes</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white dark:bg-brand-card p-6 md:p-8 rounded-3xl border-2 border-red-100 dark:border-red-900/50 shadow-xl relative overflow-hidden group">
              <div class="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm uppercase tracking-wider">NCLEX #1 Priority</div>
              
              <div class="flex items-center gap-3 mb-6">
                <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                  <i class="fa-solid fa-heart-circle-bolt text-2xl"></i>
                </div>
                <div>
                  <h3 class="text-2xl font-black text-gray-900 dark:text-white">Potassium (K+)</h3>
                  <p class="text-sm font-bold text-red-500">3.5 - 5.0 mEq/L <span class="text-xs font-normal text-gray-400">(<span class="lang-es">Crítico</span><span class="lang-en hidden-lang">Critical</span>: <6.0 or <2.5)</span></p>
                </div>
              </div>

              <div class="space-y-6">
                <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800">
                  <strong class="block text-lg text-red-800 dark:text-red-300 mb-2">Hyperkalemia (> 5.0 mEq/L)</strong>
                  <div class="mb-3">
                    <span class="text-xs font-bold text-gray-500 uppercase"><span class="lang-es">Causas comunes:</span><span class="lang-en hidden-lang">Common causes:</span></span>
                    <span class="text-xs text-gray-600 dark:text-gray-400 ml-2">
                      <span class="lang-es">Insuf. renal, IECA/ARA-II, diuréticos ahorradores (espironolactona), hemólisis.</span>
                      <span class="lang-en hidden-lang">Renal failure, ACE/ARBs, K+-sparing diuretics (spironolactone), hemolysis.</span>
                    </span>
                  </div>
                  <ul class="space-y-2 text-sm text-gray-800 dark:text-gray-200 mt-2">
                    <li class="flex items-center gap-2">
                      <i class="fa-solid fa-wave-square text-red-500"></i>
                      <span><strong>EKG:</strong> <span class="lang-es">Ondas T picudas, ST elevación, QRS ancho, bradicardia → asistolia.</span><span class="lang-en hidden-lang">Peaked T waves, ST elevation, wide QRS, bradycardia → asystole.</span></span>
                    </li>
                    <li class="flex items-center gap-2">
                      <i class="fa-solid fa-syringe text-blue-500"></i>
                      <span><strong><span class="lang-es">Tratamiento de Emergencia (EN ORDEN):</span><span class="lang-en hidden-lang">Emergency Treatment (IN ORDER):</span></strong></span>
                    </li>
                    <li class="ml-6 text-xs space-y-1">
                      1. <strong>Calcio gluconato/Cloruro (1-2g IV)</strong> - <span class="lang-es">Estabiliza membrana cardiaca (NO baja K+).</span><span class="lang-en hidden-lang">Stabilizes cardiac membrane (Does NOT lower K+).</span>
                    </li>
                    <li class="ml-6 text-xs">
                      2. <strong>Insulina regular (10 U) + D50W 1 ampolla</strong> - <span class="lang-es">Desplaza K+ a intracelular.</span><span class="lang-en hidden-lang">Shifts K+ into cells.</span>
                    </li>
                    <li class="ml-6 text-xs">
                      3. <strong>Beta-2 agonistas (Albuterol nebulizado)</strong> - <span class="lang-es">Desplaza K+ a intracelular.</span><span class="lang-en hidden-lang">Shifts K+ into cells.</span>
                    </li>
                     <li class="flex items-center gap-2 mt-2">
                      <i class="fa-solid fa-poop text-green-600"></i>
                      <span><strong><span class="lang-es">Excreción:</span><span class="lang-en hidden-lang">Excretion:</span></strong> <span class="lang-es">Kayexalate (PO/PR) 15-30g, diálisis (si insuf. renal).</span><span class="lang-en hidden-lang">Kayexalate (PO/PR) 15-30g, dialysis (if renal failure).</span></span>
                    </li>
                  </ul>
                </div>

                <div class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <strong class="block text-lg text-blue-800 dark:text-blue-300 mb-2">Hypokalemia (< 3.5 mEq/L)</strong>
                  <div class="mb-3">
                    <span class="text-xs font-bold text-gray-500 uppercase"><span class="lang-es">Causas:</span><span class="lang-en hidden-lang">Causes:</span></span>
                    <span class="text-xs text-gray-600 dark:text-gray-400 ml-2">
                      <span class="lang-es">Diuréticos de asa/tiazidas, vómitos/diarrea, alcalosis.</span>
                      <span class="lang-en hidden-lang">Loop/thiazide diuretics, vomiting/diarrhea, alkalosis.</span>
                    </span>
                  </div>
                  <ul class="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                    <li class="flex items-center gap-2">
                      <i class="fa-solid fa-wave-square text-blue-500"></i>
                      <span><strong>EKG:</strong> <span class="lang-es">Ondas T aplanadas, onda U prominente, depresión ST, arritmias.</span><span class="lang-en hidden-lang">Flattened T waves, prominent U wave, ST depression, arrhythmias.</span></span>
                    </li>
                    <li class="flex items-center gap-2">
                      <i class="fa-solid fa-hand text-orange-500"></i>
                      <span><strong><span class="lang-es">Manifestaciones:</span><span class="lang-en hidden-lang">Manifestations:</span></strong> <span class="lang-es">Debilidad muscular (inicio en piernas), calambres, íleo paralítico.</span><span class="lang-en hidden-lang">Muscle weakness (starts in legs), cramps, paralytic ileus.</span></span>
                    </li>
                    <li class="mt-3 bg-white dark:bg-black/30 p-3 rounded-xl border border-red-500/30 flex items-center gap-3 shadow-sm">
                      <i class="fa-solid fa-skull-crossbones text-red-600 text-xl"></i>
                      <div class="leading-tight">
                        <span class="block font-black text-red-600 text-xs uppercase"><span class="lang-es">ADMINISTRACIÓN SEGURA DE K+ IV</span><span class="lang-en hidden-lang">SAFE IV K+ ADMINISTRATION</span></span>
                        <span class="text-sm font-bold text-gray-800 dark:text-gray-200">
                          <span class="lang-es">NUNCA administrar K+ IV puro. Siempre diluido en bomba de infusión (<strong>Máx 10 mEq/hora</strong> en vía periférica, 20 mEq/hora en CVC).</span>
                          <span class="lang-en hidden-lang">NEVER administer IV push K+. Always diluted on infusion pump (<strong>Max 10 mEq/hr</strong> peripheral, 20 mEq/hr CVC).</span>
                        </span>
                      </div>
                    </li>
                    <li class="text-xs text-gray-500 italic mt-2">
                      <span class="lang-es">Monitorizar K+ sérico durante reposición. Suplementar también Mg++ si hay hipomagnesemia concomitante.</span>
                      <span class="lang-en hidden-lang">Monitor serum K+ during replacement. Also supplement Mg++ if concurrent hypomagnesemia.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-6">
               <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600">
                      <i class="fa-solid fa-brain text-xl"></i>
                    </div>
                    <div>
                      <h3 class="text-xl font-black text-gray-900 dark:text-white">Sodium (Na+)</h3>
                      <p class="text-sm font-bold text-gray-500">135 - 145 mEq/L</p>
                      <p class="text-xs text-gray-400">
                        <span class="lang-es">Corrección máxima segura: 8-12 mEq/L en 24h</span>
                        <span class="lang-en hidden-lang">Max safe correction: 8-12 mEq/L in 24h</span>
                      </p>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div class="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border-l-4 border-yellow-500">
                      <p class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Hyponatremia (< 135 mEq/L)</p>
                      <ul class="list-disc list-inside text-xs md:text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li><span class="lang-es"><strong>Neurológico:</strong> Confusión, cefalea, convulsiones, coma (edema cerebral).</span><span class="lang-en hidden-lang"><strong>Neuro:</strong> Confusion, headache, seizures, coma (cerebral edema).</span></li>
                        <li><span class="lang-es"><strong>Euvolémica (SIADH):</strong> Restricción hídrica, demeclociclina.</span><span class="lang-en hidden-lang"><strong>Euvolemic (SIADH):</strong> Fluid restriction, demeclocycline.</span></li>
                        <li><span class="lang-es"><strong>Hipovolémica:</strong> Suero salino isotónico (0.9%).</span><span class="lang-en hidden-lang"><strong>Hypovolemic:</strong> Isotonic saline (0.9%).</span></li>
                        <li class="text-red-600 font-bold"><span class="lang-es">PRIORIDAD: Precauciones anticonvulsivas. Corrección LENTA para evitar mielinólisis pontina central.</span><span class="lang-en hidden-lang">PRIORITY: Seizure precautions. SLOW correction to avoid central pontine myelinolysis.</span></li>
                      </ul>
                    </div>
                    <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border-l-4 border-red-500">
                      <p class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Hypernatremia (> 145 mEq/L)</p>
                      <ul class="list-disc list-inside text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        <li><span class="lang-es">Deshidratación hiperosmolar. Reposición con solución hipotónica (0.45% NaCl) LENTA.</span><span class="lang-en hidden-lang">Hyperosmolar dehydration. Replace with hypotonic solution (0.45% NaCl) SLOWLY.</span></li>
                      </ul>
                    </div>
                  </div>
               </div>

               <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600">
                      <i class="fa-solid fa-bone text-xl"></i>
                    </div>
                    <div>
                      <h3 class="text-xl font-black text-gray-900 dark:text-white">Calcium (Ca++)</h3>
                      <p class="text-sm font-bold text-gray-500">Total: 9.0 - 10.5 mg/dL</p>
                      <p class="text-xs text-gray-400">
                        <span class="lang-es">Ionizado: 4.5 - 5.5 mg/dL (crítico)</span>
                        <span class="lang-en hidden-lang">Ionized: 4.5 - 5.5 mg/dL (critical)</span>
                      </p>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <strong class="text-xs text-gray-500 uppercase tracking-widest">Hypocalcemia (< 9.0 mg/dL)</strong>
                      <div class="grid grid-cols-2 gap-3 mt-2">
                        <div class="bg-orange-50 dark:bg-orange-900/10 p-2 rounded-xl border border-orange-100 dark:border-orange-800 text-center">
                          <span class="block font-bold text-orange-700 dark:text-orange-300 text-sm">Trousseau's Sign</span>
                          <span class="text-[10px] text-gray-500">
                            <span class="lang-es">Espasmo carpopedal con manguito de PA inflado >3 min</span>
                            <span class="lang-en hidden-lang">Carpopedal spasm w/ BP cuff inflated >3 min</span>
                          </span>
                        </div>
                        <div class="bg-orange-50 dark:bg-orange-900/10 p-2 rounded-xl border border-orange-100 dark:border-orange-800 text-center">
                          <span class="block font-bold text-orange-700 dark:text-orange-300 text-sm">Chvostek's Sign</span>
                          <span class="text-[10px] text-gray-500">
                            <span class="lang-es">Contracción facial al golpear nervio facial</span>
                            <span class="lang-en hidden-lang">Facial twitching when tapping facial nerve</span>
                          </span>
                        </div>
                      </div>
                      <p class="text-xs text-center text-gray-400 italic mt-2">
                        <span class="lang-es">Post-tiroidectomía (daño paratiroides), pancreatitis, sepsis.</span>
                        <span class="lang-en hidden-lang">Post-thyroidectomy (parathyroid damage), pancreatitis, sepsis.</span>
                      </p>
                      <div class="mt-3 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                        <span class="text-xs font-bold text-blue-700"><span class="lang-es">Tratamiento:</span><span class="lang-en hidden-lang">Treatment:</span></span>
                        <span class="text-xs text-gray-600 dark:text-gray-400 ml-2">
                          <span class="lang-es">Gluconato/Cloruro de calcio IV (emergencia), Calcio oral + Vitamina D.</span>
                          <span class="lang-en hidden-lang">IV Calcium Gluconate/Chloride (emergency), PO Calcium + Vit D.</span>
                        </span>
                      </div>
                    </div>
                    <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <strong class="text-xs text-gray-500 uppercase tracking-widest">Hypercalcemia (> 10.5 mg/dL)</strong>
                      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <span class="lang-es">"Piedras, huesos, gemidos, tronco psíquico". Hidratación + Furosemida, Bifosfonatos (pamidronato), calcitonina.</span>
                        <span class="lang-en hidden-lang">"Stones, bones, groans, psych overtones". Hydration + Furosemide, Bisphosphonates, Calcitonin.</span>
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. Shock & Sepsis ---
    renderShockSepsis() {
      return `
        <section>
          <div class="flex items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-500/30">2</div>
            <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Shock y Sepsis (SSC 2021)</span>
              <span class="lang-en hidden-lang">Shock & Sepsis (SSC 2021)</span>
            </h2>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-gray-700 mb-8">
             <h3 class="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <i class="fa-solid fa-hourglass-start text-red-500"></i> <span class="lang-es">Bundle de Sepsis (Hora-1)</span><span class="lang-en hidden-lang">Sepsis Hour-1 Bundle</span>
             </h3>
             
             <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border-l-4 border-red-500">
               <strong class="block text-red-800 dark:text-red-300 mb-2 text-sm uppercase"><span class="lang-es">Definición Sepsis (SOFA ≥2)</span><span class="lang-en hidden-lang">Sepsis Definition (SOFA ≥2)</span></strong>
               <p class="text-xs text-gray-600 dark:text-gray-400">
                 <span class="lang-es">Infección + disfunción orgánica. <strong>Shock séptico:</strong> Sepsis + hipotensión que requiere vasopresores + lactato >2 mmol/L.</span>
                 <span class="lang-en hidden-lang">Infection + organ dysfunction. <strong>Septic Shock:</strong> Sepsis + hypotension requiring vasopressors + lactate >2 mmol/L.</span>
               </p>
             </div>
             
             <div class="relative mt-4">
                <div class="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
                
                <div class="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                   <div class="bg-white dark:bg-brand-card p-4 rounded-xl shadow-md border-t-4 border-red-500 flex flex-col items-center text-center">
                      <div class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm mb-2">1</div>
                      <strong class="block text-gray-900 dark:text-white text-sm"><span class="lang-es">Lactato</span><span class="lang-en hidden-lang">Lactate</span></strong>
                      <span class="text-xs text-gray-500">
                        <span class="lang-es">Medir inicial y en 2-4h si >2 mmol/L. Objetivo: ↓ >10%.</span>
                        <span class="lang-en hidden-lang">Measure initial & in 2-4h if >2. Goal: ↓ >10%.</span>
                      </span>
                   </div>
                   <div class="bg-white dark:bg-brand-card p-4 rounded-xl shadow-md border-t-4 border-purple-500 flex flex-col items-center text-center">
                      <div class="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm mb-2">2</div>
                      <strong class="block text-gray-900 dark:text-white text-sm"><span class="lang-es">Cultivos</span><span class="lang-en hidden-lang">Cultures</span></strong>
                      <span class="text-xs text-gray-500">
                        <span class="lang-es">2 sets (sangre) <strong>ANTES</strong> de antibióticos. + otros focos.</span>
                        <span class="lang-en hidden-lang">2 sets (blood) <strong>BEFORE</strong> abx. + other sites.</span>
                      </span>
                   </div>
                   <div class="bg-white dark:bg-brand-card p-4 rounded-xl shadow-md border-t-4 border-blue-500 flex flex-col items-center text-center">
                      <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm mb-2">3</div>
                      <strong class="block text-gray-900 dark:text-white text-sm"><span class="lang-es">Antibióticos</span><span class="lang-en hidden-lang">Antibiotics</span></strong>
                      <span class="text-xs text-gray-500">
                        <span class="lang-es">Amplio espectro en PRIMERA HORA. Re-evaluar a 48-72h.</span>
                        <span class="lang-en hidden-lang">Broad spectrum in 1st HOUR. Re-evaluate at 48-72h.</span>
                      </span>
                   </div>
                   <div class="bg-white dark:bg-brand-card p-4 rounded-xl shadow-md border-t-4 border-cyan-500 flex flex-col items-center text-center">
                      <div class="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-sm mb-2">4</div>
                      <strong class="block text-gray-900 dark:text-white text-sm"><span class="lang-es">Fluidos</span><span class="lang-en hidden-lang">Fluids</span></strong>
                      <span class="text-xs text-gray-500">
                        <span class="lang-es">30 mL/kg de cristaloides en 1h si hipotensión o lactato ≥4.</span>
                        <span class="lang-en hidden-lang">30 mL/kg crystalloids in 1h if hypotension or lactate ≥4.</span>
                      </span>
                   </div>
                   <div class="bg-white dark:bg-brand-card p-4 rounded-xl shadow-md border-t-4 border-orange-500 flex flex-col items-center text-center">
                      <div class="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm mb-2">5</div>
                      <strong class="block text-gray-900 dark:text-white text-sm"><span class="lang-es">Vasopresores</span><span class="lang-en hidden-lang">Vasopressors</span></strong>
                      <span class="text-xs text-gray-500">
                        <span class="lang-es">Norepinefrina si hipotensión persistente. MAP objetivo ≥65 mmHg.</span>
                        <span class="lang-en hidden-lang">Norepinephrine if hypotension persists. Target MAP ≥65 mmHg.</span>
                      </span>
                   </div>
                </div>
             </div>
             <div class="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
               <p class="text-xs text-blue-800 dark:text-blue-300 text-center">
                 <span class="lang-es"><strong>Monitoreo:</strong> PVC 8-12 mmHg, ScvO2 >70%, diuresis >0.5 mL/kg/h.</span>
                 <span class="lang-en hidden-lang"><strong>Monitoring:</strong> CVP 8-12 mmHg, ScvO2 >70%, urine output >0.5 mL/kg/h.</span>
               </p>
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <strong class="block text-lg text-gray-900 dark:text-white mb-2">Hypovolemic Shock</strong>
              <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-3">
                 <span class="text-sm font-bold text-gray-500"><span class="lang-es">Signos Clásicos</span><span class="lang-en hidden-lang">Classic Signs</span></span>
                 <span class="text-sm font-bold text-red-500">
                    <span class="lang-es">↓BP, ↑HR, ↑RR, ↓UO, piel fría/húmeda</span>
                    <span class="lang-en hidden-lang">↓BP, ↑HR, ↑RR, ↓UO, cool/clammy skin</span>
                 </span>
              </div>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                 <li class="flex items-start gap-2">
                   <i class="fa-solid fa-check text-green-500 mr-1 mt-1"></i>
                   <span>
                      <strong><span class="lang-es">Fluidos:</span><span class="lang-en hidden-lang">Fluids:</span></strong> 
                      <span class="lang-es">Cristaloides isotónicos (LR o 0.9% NaCl). 1-2 L bolo inicial.</span>
                      <span class="lang-en hidden-lang">Isotonic crystalloids (LR or 0.9% NaCl). 1-2 L initial bolus.</span>
                   </span>
                 </li>
                 <li class="flex items-start gap-2">
                   <i class="fa-solid fa-check text-green-500 mr-1 mt-1"></i>
                   <span>
                      <strong><span class="lang-es">Posición:</span><span class="lang-en hidden-lang">Position:</span></strong> 
                      <span class="lang-es">Trendelenburg modificado (piernas elevadas 20°).</span>
                      <span class="lang-en hidden-lang">Modified Trendelenburg (legs elevated 20°).</span>
                   </span>
                 </li>
                 <li class="flex items-start gap-2">
                   <i class="fa-solid fa-check text-green-500 mr-1 mt-1"></i>
                   <span>
                      <strong><span class="lang-es">Sangre:</span><span class="lang-en hidden-lang">Blood:</span></strong> 
                      <span class="lang-es">O- (emergencia), tipo y cruzado cuando sea posible.</span>
                      <span class="lang-en hidden-lang">O- (emergency), type & cross when possible.</span>
                   </span>
                 </li>
                 <li class="text-xs text-gray-500 italic mt-2">
                   <span class="lang-es">Buscar y controlar fuente de sangrado (quirúrgica si necesario).</span>
                   <span class="lang-en hidden-lang">Find and control bleeding source (surgical if needed).</span>
                 </li>
              </ul>
            </div>
            
            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <strong class="block text-lg text-gray-900 dark:text-white mb-2">Anaphylactic Shock</strong>
              <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 text-center mb-3">
                 <strong class="block text-purple-700 dark:text-purple-300 uppercase text-xs mb-1"><span class="lang-es">Intervención de Prioridad #1</span><span class="lang-en hidden-lang">#1 Priority Intervention</span></strong>
                 <div class="text-xl font-black text-purple-800 dark:text-purple-200">
                    Epinefrina 0.3-0.5 mg IM<br>
                    <span class="text-xs font-normal text-gray-600 dark:text-gray-300">
                        <span class="lang-es">(Músculo anterolateral del muslo)</span>
                        <span class="lang-en hidden-lang">(Anterolateral thigh muscle)</span>
                    </span>
                 </div>
              </div>
               <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                 <li>
                    <strong><span class="lang-es">Posición:</span><span class="lang-en hidden-lang">Position:</span></strong> 
                    <span class="lang-es">Supina con piernas elevadas (si no hay distress respiratorio).</span>
                    <span class="lang-en hidden-lang">Supine with legs elevated (if no respiratory distress).</span>
                 </li>
                 <li>
                    <strong><span class="lang-es">O2:</span><span class="lang-en hidden-lang">O2:</span></strong> 
                    <span class="lang-es">Alto flujo (10-15 L/min) con mascarilla no-rebreather.</span>
                    <span class="lang-en hidden-lang">High flow (10-15 L/min) via non-rebreather mask.</span>
                 </li>
                 <li>
                    <strong><span class="lang-es">Otros meds:</span><span class="lang-en hidden-lang">Other meds:</span></strong> 
                    <span class="lang-es">Antihistamínicos, corticosteroides, broncodilatadores.</span>
                    <span class="lang-en hidden-lang">Antihistamines, corticosteroids, bronchodilators.</span>
                 </li>
                 <li>
                    <strong><span class="lang-es">Repetir Epi:</span><span class="lang-en hidden-lang">Repeat Epi:</span></strong> 
                    <span class="lang-es">Cada 5-15 minutos si persisten síntomas.</span>
                    <span class="lang-en hidden-lang">Every 5-15 mins if symptoms persist.</span>
                 </li>
               </ul>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <strong class="block text-lg text-gray-900 dark:text-white mb-2">Cardiogenic Shock</strong>
              <div class="flex items-center justify-between bg-red-100 dark:bg-red-900/20 p-3 rounded-lg mb-3">
                 <span class="text-sm font-bold text-red-500"><span class="lang-es">Signos</span><span class="lang-en hidden-lang">Signs</span></span>
                 <span class="text-sm font-bold text-red-500"><span class="lang-es">↓BP, ↑HR, ↑PVC, ↓CO, estertores</span><span class="lang-en hidden-lang">↓BP, ↑HR, ↑CVP, ↓CO, crackles</span></span>
              </div>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                 <li class="flex items-start gap-2">
                   <i class="fa-solid fa-ban text-red-500 mr-1 mt-1"></i>
                   <span>
                      <strong><span class="lang-es">EVITAR sobrecarga de fluidos.</span><span class="lang-en hidden-lang">AVOID fluid overload.</span></strong> 
                      <span class="lang-es">Monitoreo estricto de entrada/salida.</span>
                      <span class="lang-en hidden-lang">Strict I/O monitoring.</span>
                   </span>
                 </li>
                 <li class="flex items-start gap-2">
                   <i class="fa-solid fa-pump-medical text-blue-500 mr-1 mt-1"></i>
                   <span>
                      <strong><span class="lang-es">Inotrópicos:</span><span class="lang-en hidden-lang">Inotropes:</span></strong> 
                      <span class="lang-es">Dobutamina, Milrinona (aumentar contractilidad).</span>
                      <span class="lang-en hidden-lang">Dobutamine, Milrinone (increase contractility).</span>
                   </span>
                 </li>
                 <li class="flex items-start gap-2">
                   <i class="fa-solid fa-heart-circle-plus text-purple-500 mr-1 mt-1"></i>
                   <span>
                      <strong><span class="lang-es">Asistencia mecánica:</span><span class="lang-en hidden-lang">Mechanical assist:</span></strong> 
                      <span class="lang-es">Balón intraaórtico (IABP), ECMO.</span>
                      <span class="lang-en hidden-lang">Intra-aortic balloon pump (IABP), ECMO.</span>
                   </span>
                 </li>
                 <li class="text-xs text-gray-500 italic mt-2">
                   <span class="lang-es">Posición: Semi-Fowler para facilitar ventilación.</span>
                   <span class="lang-en hidden-lang">Position: Semi-Fowler to facilitate breathing.</span>
                 </li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 3. GI ---
    renderGI() {
      return `
        <section>
          <div class="flex items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-500/30">3</div>
            <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Gastrointestinal (GI) Crítico</span>
              <span class="lang-en hidden-lang">Critical Gastrointestinal (GI)</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-black text-amber-600 dark:text-amber-400">Acute Pancreatitis</h3>
                <span class="text-xs font-bold text-gray-400">
                  <span class="lang-es">AUTODIGESTIÓN por enzimas</span>
                  <span class="lang-en hidden-lang">AUTODIGESTION by enzymes</span>
                </span>
              </div>
              
              <div class="space-y-4 mt-4">
                <div class="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                  <strong class="block text-amber-800 dark:text-amber-300 text-sm mb-1"><span class="lang-es">Causas (I GET SMASHED):</span><span class="lang-en hidden-lang">Causes (I GET SMASHED):</span></strong>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    <span class="lang-es">Idiopática, G (Galstones #1), E (EtOH #2), T (Trauma), S (Steroids), M (Mumps), A (Autoimmune), S (Scorpion sting), H (Hyperlipidemia/Calcio), E (ERCP), D (Drugs).</span>
                    <span class="lang-en hidden-lang">Idiopathic, Gallstones (#1), EtOH (#2), Trauma, Steroids, Mumps, Autoimmune, Scorpion sting, Hyperlipidemia/Ca++, ERCP, Drugs.</span>
                  </p>
                </div>

                <p class="text-sm text-gray-700 dark:text-gray-300">
                  <span class="lang-es"><strong>Dolor:</strong> Epigástrico severo, irradiado a espalda, aliviado al inclinarse hacia adelante. <strong>Signos:</strong> Cullen's (equimosis periumbilical), Grey-Turner's (equimosis en flancos).</span>
                  <span class="lang-en hidden-lang"><strong>Pain:</strong> Severe epigastric, radiates to back, relieved by leaning forward. <strong>Signs:</strong> Cullen's (periumbilical ecchymosis), Grey-Turner's (flank ecchymosis).</span>
                </p>

                <div class="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border-l-4 border-amber-500">
                  <strong class="block text-amber-900 dark:text-amber-200 mb-2 text-sm uppercase"><span class="lang-es">Prioridad: NPO y Soporte</span><span class="lang-en hidden-lang">Priority: NPO & Support</span></strong>
                  <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>1. <strong><span class="lang-es">NPO absoluto</span><span class="lang-en hidden-lang">Strict NPO</span></strong> <span class="lang-es">(reposo intestinal).</span><span class="lang-en hidden-lang">(bowel rest).</span></li>
                    <li>2. <strong><span class="lang-es">Sonda nasogástrica</span><span class="lang-en hidden-lang">NG Tube</span></strong> <span class="lang-es">(si íleo/vómitos incoercibles).</span><span class="lang-en hidden-lang">(if ileus/uncontrollable vomiting).</span></li>
                    <li>3. <strong><span class="lang-es">Fluidos IV agresivos</span><span class="lang-en hidden-lang">Aggressive IV fluids</span></strong> <span class="lang-es">(6-8 L/día) - Ringer Lactato.</span><span class="lang-en hidden-lang">(6-8 L/day) - Lactated Ringer's.</span></li>
                    <li>4. <strong><span class="lang-es">Analgesia</span><span class="lang-en hidden-lang">Analgesia</span></strong> <span class="lang-es">(Hydromorphone/Morphine - EVITAR Meperidina).</span><span class="lang-en hidden-lang">(Hydromorphone/Morphine - AVOID Meperidine).</span></li>
                    <li>5. <strong><span class="lang-es">Nutrición enteral temprana</span><span class="lang-en hidden-lang">Early enteral nutrition</span></strong> <span class="lang-es">(sonda yeyunal) vs parenteral si no tolera.</span><span class="lang-en hidden-lang">(jejunal) vs parenteral if intolerant.</span></li>
                  </ul>
                </div>

                <div class="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                  <strong class="text-sm text-red-800 dark:text-red-300"><span class="lang-es">Pronóstico (Ranson/APACHE II):</span><span class="lang-en hidden-lang">Prognosis (Ranson/APACHE II):</span></strong>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span class="lang-es">Leve vs Severa (necrosis). Complicaciones: Seudoquiste, absceso pancreático, insuficiencia orgánica.</span>
                    <span class="lang-en hidden-lang">Mild vs Severe (necrosis). Complications: Pseudocyst, pancreatic abscess, organ failure.</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="text-xl font-black text-amber-600 dark:text-amber-400 mb-4">Liver Cirrhosis & Complications</h3>
              <div class="space-y-4">
                <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border-l-4 border-red-500">
                  <strong class="block text-lg text-red-800 dark:text-red-300">Hepatic Encephalopathy (Ammonia ↑)</strong>
                  <span class="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                    <span class="lang-es">Confusión, asterixis (flapping tremor), fetor hepático, coma.</span>
                    <span class="lang-en hidden-lang">Confusion, asterixis (flapping tremor), hepatic fetor, coma.</span>
                  </span>
                  <div class="text-xs bg-white dark:bg-black/30 p-2 rounded-lg">
                    <strong class="text-red-600"><span class="lang-es">Tratamiento:</span><span class="lang-en hidden-lang">Treatment:</span></strong> <span class="lang-es">Lactulosa (30 mL PO/PR hasta 2-3 deposiciones blandas/día), Rifaximina, restricción de proteínas (sólo en fase aguda).</span><span class="lang-en hidden-lang">Lactulose (30 mL PO/PR to 2-3 soft stools/day), Rifaximin, protein restriction (only in acute phase).</span>
                  </div>
                </div>
                <div class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border-l-4 border-blue-500">
                  <strong class="block text-lg text-blue-800 dark:text-blue-300">Ascites (Albumin ↓, Portal HTN)</strong>
                  <span class="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                    <span class="lang-es">Distensión abdominal, onda líquida, matidez a los flancos.</span>
                    <span class="lang-en hidden-lang">Abdominal distention, fluid wave, shifting dullness.</span>
                  </span>
                  <div class="text-xs bg-white dark:bg-black/30 p-2 rounded-lg">
                    <strong class="text-blue-600"><span class="lang-es">Tratamiento:</span><span class="lang-en hidden-lang">Treatment:</span></strong> <span class="lang-es">Restricción de Na+ (<2 g/día), diuréticos (espironolactona + furosemida), paracentesis evacuadora + albúmina IV (6-8 g/L removido).</span><span class="lang-en hidden-lang">Na+ restriction (<2 g/day), diuretics (spironolactone + furosemide), paracentesis + albumin IV (6-8 g/L removed).</span>
                  </div>
                </div>
                <div class="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border-l-4 border-orange-500">
                  <strong class="block text-lg text-orange-800 dark:text-orange-300">Esophageal Varices (Bleeding)</strong>
                  <span class="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                    <span class="lang-es">Hematemesis, melena, shock hipovolémico. Mortalidad alta.</span>
                    <span class="lang-en hidden-lang">Hematemesis, melena, hypovolemic shock. High mortality.</span>
                  </span>
                  <div class="text-xs bg-white dark:bg-black/30 p-2 rounded-lg">
                    <strong class="text-orange-600"><span class="lang-es">Manejo Agudo:</span><span class="lang-en hidden-lang">Acute Mgmt:</span></strong> <span class="lang-es">Estabilización ABC, octreotide IV, antibióticos profilácticos (ceftriaxona), banding endoscópico, balón de Sengstaken-Blakemore. <strong class="text-red-600">NO usar sonda nasogástrica.</strong></span><span class="lang-en hidden-lang">ABCs, Octreotide IV, prophylactic abx (ceftriaxone), banding, Sengstaken-Blakemore tube. <strong class="text-red-600">NO NG tube.</strong></span>
                  </div>
                </div>
                <div class="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <strong class="text-sm text-purple-800 dark:text-purple-300">Child-Pugh Classification</strong>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <strong>A (5-6 pts):</strong> <span class="lang-es">Buen pronóstico, cirugía posible.</span><span class="lang-en hidden-lang">Good prognosis, surgery possible.</span><br>
                    <strong>B (7-9 pts):</strong> <span class="lang-es">Compensado.</span><span class="lang-en hidden-lang">Compensated.</span><br>
                    <strong>C (10-15 pts):</strong> <span class="lang-es">Descompensado, trasplante hepático.</span><span class="lang-en hidden-lang">Decompensated, liver transplant.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Renal ---
    renderRenal() {
      return `
        <section>
          <div class="flex items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-yellow-500/30">4</div>
            <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Renal y Diálisis</span>
              <span class="lang-en hidden-lang">Renal & Dialysis</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="text-xl font-black text-gray-900 dark:text-white mb-4">Acute Kidney Injury (AKI)</h3>
              <div class="space-y-4">
                <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border-l-4 border-red-500">
                  <strong class="block text-red-800 dark:text-red-300"><span class="lang-es">Criterios KDIGO</span><span class="lang-en hidden-lang">KDIGO Criteria</span></strong>
                  <div class="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div class="bg-white dark:bg-black/30 p-2 rounded text-center">
                      <strong>Stage 1</strong><br>Cr 1.5-1.9x basal <span class="lang-es">o</span><span class="lang-en hidden-lang">or</span> UO <0.5 mL/kg/h x 6-12h
                    </div>
                    <div class="bg-white dark:bg-black/30 p-2 rounded text-center">
                      <strong>Stage 2</strong><br>Cr 2.0-2.9x basal <span class="lang-es">o</span><span class="lang-en hidden-lang">or</span> UO <0.5 mL/kg/h x ≥12h
                    </div>
                    <div class="bg-white dark:bg-black/30 p-2 rounded text-center">
                      <strong>Stage 3</strong><br>Cr 3.0x basal <span class="lang-es">o</span><span class="lang-en hidden-lang">or</span> UO <0.3 mL/kg/h x ≥24h
                    </div>
                    <div class="bg-white dark:bg-black/30 p-2 rounded text-center">
                      <strong>Dialysis</strong><br>Cr >4.0 mg/dL <span class="lang-es">o indicaciones urgentes</span><span class="lang-en hidden-lang">or urgent indications</span>
                    </div>
                  </div>
                </div>

                <div class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border-l-4 border-blue-500">
                  <strong class="block text-blue-800 dark:text-blue-300"><span class="lang-es">Fases de AKI</span><span class="lang-en hidden-lang">AKI Phases</span></strong>
                  <div class="mt-3 space-y-3">
                    <div class="p-3 bg-white dark:bg-black/20 rounded-lg">
                      <strong class="block text-red-600 text-sm">1. <span class="lang-es">Oligúrica</span><span class="lang-en hidden-lang">Oliguric</span> (< 400 mL/day)</strong>
                      <span class="text-xs text-gray-600 dark:text-gray-400">
                        <span class="lang-es">Hiperkalemia, sobrecarga de fluidos, acidosis metabólica.</span>
                        <span class="lang-en hidden-lang">Hyperkalemia, fluid overload, metabolic acidosis.</span>
                      </span>
                      <span class="text-xs font-bold bg-red-200 dark:bg-red-800 px-2 py-1 rounded text-red-900 dark:text-red-100 mt-1 inline-block">
                        <span class="lang-es">RESTRICCIÓN: Fluidos, K+, Fosfato</span>
                        <span class="lang-en hidden-lang">RESTRICT: Fluids, K+, Phosphate</span>
                      </span>
                    </div>
                    <div class="p-3 bg-white dark:bg-black/20 rounded-lg">
                      <strong class="block text-green-600 text-sm">2. <span class="lang-es">Diurética</span><span class="lang-en hidden-lang">Diuretic</span> (3-6 L/day)</strong>
                      <span class="text-xs text-gray-600 dark:text-gray-400">
                        <span class="lang-es">Deshidratación, hipokalemia, hiponatremia.</span>
                        <span class="lang-en hidden-lang">Dehydration, hypokalemia, hyponatremia.</span>
                      </span>
                      <span class="text-xs font-bold bg-green-200 dark:bg-green-800 px-2 py-1 rounded text-green-900 dark:text-green-100 mt-1 inline-block">
                        <span class="lang-es">REPOSICIÓN: Fluidos y Electrolitos</span>
                        <span class="lang-en hidden-lang">REPLACE: Fluids & Electrolytes</span>
                      </span>
                    </div>
                    <div class="p-3 bg-white dark:bg-black/20 rounded-lg">
                      <strong class="block text-yellow-600 text-sm">3. <span class="lang-es">Recuperación</span><span class="lang-en hidden-lang">Recovery</span></strong>
                      <span class="text-xs text-gray-600 dark:text-gray-400">
                        <span class="lang-es">Normalización gradual de función renal (semanas-meses).</span>
                        <span class="lang-en hidden-lang">Gradual return of renal function (weeks-months).</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div class="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <strong class="text-sm text-purple-800 dark:text-purple-300"><span class="lang-es">Indicaciones de Diálisis Urgente</span><span class="lang-en hidden-lang">Urgent Dialysis Indications</span></strong>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span class="lang-es">Hiperkalemia refractaria, sobrecarga de fluidos (edema pulmonar), acidosis metabólica severa (pH <7.2), pericarditis urémica, encefalopatía, intoxicaciones.</span>
                    <span class="lang-en hidden-lang">Refractory hyperkalemia, fluid overload (pulmonary edema), severe met. acidosis (pH <7.2), uremic pericarditis, encephalopathy, intoxications.</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-3xl border border-yellow-200 dark:border-yellow-800">
                <h3 class="text-xl font-black text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
                  <i class="fa-solid fa-ban text-red-500"></i> <span class="lang-es">Seguridad de Fístula AV</span><span class="lang-en hidden-lang">AV Fistula Safety</span>
                </h3>
                
                <div class="bg-white dark:bg-black/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-700 mb-4 mt-4">
                  <p class="text-sm font-bold text-gray-700 dark:text-gray-300 text-center">
                    <span class="lang-es"><strong>BRAZO PROTEGIDO:</strong> NO tomar PA, NO punciones IV, NO extracciones, NO cargar peso.</span>
                    <span class="lang-en hidden-lang"><strong>PROTECTED ARM:</strong> NO BP, NO IV sticks, NO blood draws, NO heavy lifting.</span>
                  </p>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="text-center p-3 bg-white dark:bg-black/30 rounded-xl">
                    <strong class="block text-indigo-600 text-lg">Thrill</strong>
                    <span class="text-xs text-gray-600">
                      <span class="lang-es">Frémito palpable (vibración suave). Evaluar diariamente.</span>
                      <span class="lang-en hidden-lang">Palpable thrill (vibration). Assess daily.</span>
                    </span>
                  </div>
                  <div class="text-center p-3 bg-white dark:bg-black/30 rounded-xl">
                    <strong class="block text-indigo-600 text-lg">Bruit</strong>
                    <span class="text-xs text-gray-600">
                      <span class="lang-es">Soplo audible con estetoscopio. Sonido continuo "swishing".</span>
                      <span class="lang-en hidden-lang">Audible bruit. Continuous "swishing" sound.</span>
                    </span>
                  </div>
                </div>
                
                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <strong class="text-sm text-blue-800 dark:text-blue-300 block mb-1"><span class="lang-es">Cuidados del Paciente</span><span class="lang-en hidden-lang">Patient Care</span></strong>
                  <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li><span class="lang-es">• No dormir sobre el brazo de la fístula.</span><span class="lang-en hidden-lang">• Do not sleep on fistula arm.</span></li>
                    <li><span class="lang-es">• No usar ropa ajustada o joyería en ese brazo.</span><span class="lang-en hidden-lang">• No tight clothing or jewelry on that arm.</span></li>
                    <li><span class="lang-es">• No aplicar calor/frío extremo.</span><span class="lang-en hidden-lang">• No extreme heat/cold.</span></li>
                    <li><span class="lang-es">• Tiempo de maduración: 6-8 semanas antes de usar.</span><span class="lang-en hidden-lang">• Maturation time: 6-8 weeks before use.</span></li>
                    <li><span class="lang-es">• Ausencia de thrill/bruit = <strong class="text-red-600">EMERGENCIA (trombosis)</strong>.</span><span class="lang-en hidden-lang">• Absence of thrill/bruit = <strong class="text-red-600">EMERGENCY (thrombosis)</strong>.</span></li>
                  </ul>
                </div>
              </div>

              <div class="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-200 dark:border-blue-800">
                <h3 class="text-xl font-black text-blue-800 dark:text-blue-300 mb-3">Hemodiálisis vs Diálisis Peritoneal</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-3 bg-white dark:bg-black/20 rounded-xl">
                    <strong class="block text-blue-600 text-sm">Hemodiálisis</strong>
                    <ul class="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                      <li><span class="lang-es">• 3-4 veces/semana, 3-4 horas/sesión.</span><span class="lang-en hidden-lang">• 3-4 times/week, 3-4 hours/session.</span></li>
                      <li><span class="lang-es">• Acceso: Fístula AV, injerto, catéter.</span><span class="lang-en hidden-lang">• Access: AV Fistula, graft, catheter.</span></li>
                      <li><span class="lang-es">• Complicaciones: Hipoten., calambres, infección acceso.</span><span class="lang-en hidden-lang">• Complications: Hypotension, cramps, access infection.</span></li>
                    </ul>
                  </div>
                  <div class="p-3 bg-white dark:bg-black/20 rounded-xl">
                    <strong class="block text-green-600 text-sm"><span class="lang-es">Diálisis Peritoneal</span><span class="lang-en hidden-lang">Peritoneal Dialysis</span></strong>
                    <ul class="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                      <li><span class="lang-es">• Diaria, en domicilio.</span><span class="lang-en hidden-lang">• Daily, at home.</span></li>
                      <li><span class="lang-es">• Acceso: Catéter peritoneal.</span><span class="lang-en hidden-lang">• Access: Peritoneal catheter.</span></li>
                      <li><span class="lang-es">• Complicaciones: Peritonitis (líquido turbio, dolor, fiebre).</span><span class="lang-en hidden-lang">• Complications: Peritonitis (cloudy fluid, pain, fever).</span></li>
                    </ul>
                  </div>
                </div>
                <p class="text-xs text-center text-gray-500 italic mt-3">
                  <span class="lang-es">Monitorear peso pre/post diálisis, signos vitales, equilibrio electrolítico.</span>
                  <span class="lang-en hidden-lang">Monitor pre/post dialysis weight, vital signs, electrolyte balance.</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 5. Perioperative ---
    renderPerioperative() {
      return `
        <section>
          <div class="flex items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-teal-500/30">5</div>
            <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Cuidado Perioperatorio</span>
              <span class="lang-en hidden-lang">Perioperative Care</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="bg-teal-50 dark:bg-teal-900/10 p-6 rounded-3xl border border-teal-200 dark:border-teal-800">
                <strong class="text-lg text-teal-800 dark:text-teal-300 block mb-2">Malignant Hyperthermia</strong>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span class="lang-es">Crisis hipermetabólica desencadenada por agentes anestésicos (succinilcolina, halotano) en individuos genéticamente susceptibles.</span>
                  <span class="lang-en hidden-lang">Hypermetabolic crisis triggered by anesthetic agents (succinylcholine, halothane) in genetically susceptible individuals.</span>
                </p>
                <div class="bg-white dark:bg-black/20 p-3 rounded-lg border-l-4 border-teal-500 mb-3">
                   <strong class="text-sm uppercase text-gray-500"><span class="lang-es">Signos Tempranos</span><span class="lang-en hidden-lang">Early Signs</span></strong>
                   <div class="text-sm font-bold text-teal-600 dark:text-teal-400 mt-1">
                      <span class="lang-es">Rigidez muscular (masetero primero), taquicardia, hipercapnia, fiebre (tardía).</span>
                      <span class="lang-en hidden-lang">Muscle rigidity (jaw first), tachycardia, hypercapnia, fever (late).</span>
                   </div>
                </div>
                <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-l-4 border-red-500">
                   <strong class="text-sm uppercase text-gray-500"><span class="lang-es">Protocolo de Emergencia</span><span class="lang-en hidden-lang">Emergency Protocol</span></strong>
                   <ol class="text-xs text-gray-700 dark:text-gray-300 mt-1 space-y-1">
                     <li>1. <strong><span class="lang-es">Descontinuar anestésico desencadenante.</span><span class="lang-en hidden-lang">Discontinue triggering agent.</span></strong></li>
                     <li>2. <strong><span class="lang-es">Hiperventilar con O2 100%</span><span class="lang-en hidden-lang">Hyperventilate with 100% O2</span></strong> (high flow).</li>
                     <li>3. <strong>Dantrolene 2.5 mg/kg IV</strong> <span class="lang-es">repetido hasta 10 mg/kg.</span><span class="lang-en hidden-lang">repeated up to 10 mg/kg.</span></li>
                     <li>4. <strong><span class="lang-es">Enfriamiento activo</span><span class="lang-en hidden-lang">Active cooling</span></strong> <span class="lang-es">(hielo, lavados fríos).</span><span class="lang-en hidden-lang">(ice, cold lavage).</span></li>
                     <li>5. <strong><span class="lang-es">Manejo de hiperkalemia y acidosis.</span><span class="lang-en hidden-lang">Manage hyperkalemia & acidosis.</span></strong></li>
                   </ol>
                </div>
                <p class="text-xs text-gray-500 italic mt-3">
                  <span class="lang-es">Paciente y familia deben ser informados y llevar identificación de alerta médica.</span>
                  <span class="lang-en hidden-lang">Patient and family must be informed and wear medical alert identification.</span>
                </p>
              </div>

              <div class="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-200 dark:border-amber-800">
                <strong class="text-lg text-amber-800 dark:text-amber-300 block mb-2"><span class="lang-es">Prevención de Complicaciones Postoperatorias</span><span class="lang-en hidden-lang">Post-op Complication Prevention</span></strong>
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div class="p-3 bg-white dark:bg-black/20 rounded-xl">
                    <strong class="block text-amber-600 text-sm">Atelectasia/Pneumonia</strong>
                    <ul class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <li><span class="lang-es">• Tos y respiraciones profundas.</span><span class="lang-en hidden-lang">• Cough & deep breathe.</span></li>
                      <li><span class="lang-es">• Espirometría de incentivo.</span><span class="lang-en hidden-lang">• Incentive spirometry.</span></li>
                      <li><span class="lang-es">• Movilización temprana.</span><span class="lang-en hidden-lang">• Early ambulation.</span></li>
                    </ul>
                  </div>
                  <div class="p-3 bg-white dark:bg-black/20 rounded-xl">
                    <strong class="block text-amber-600 text-sm">DVT/PE</strong>
                    <ul class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <li><span class="lang-es">• Medias de compresión.</span><span class="lang-en hidden-lang">• Compression stockings.</span></li>
                      <li><span class="lang-es">• Anticoagulación profiláctica.</span><span class="lang-en hidden-lang">• Prophylactic anticoagulation.</span></li>
                      <li><span class="lang-es">• Ejercicios de piernas.</span><span class="lang-en hidden-lang">• Leg exercises.</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-3xl border border-rose-200 dark:border-rose-800">
                <strong class="text-lg text-rose-800 dark:text-rose-300 block mb-2"><span class="lang-es">Dehiscencia y Evisceración</span><span class="lang-en hidden-lang">Dehiscence & Evisceration</span></strong>
                <div class="mb-4">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 bg-white dark:bg-black/20 rounded-lg border border-rose-200">
                      <strong class="block text-rose-600 text-sm"><span class="lang-es">Dehiscencia</span><span class="lang-en hidden-lang">Dehiscence</span></strong>
                      <span class="text-xs text-gray-600">
                         <span class="lang-es">Separación parcial de capas de la herida. Líquido serosanguinolento súbito.</span>
                         <span class="lang-en hidden-lang">Partial separation of wound layers. Sudden serosanguineous fluid.</span>
                      </span>
                    </div>
                    <div class="p-3 bg-white dark:bg-black/20 rounded-lg border border-rose-200">
                      <strong class="block text-red-600 text-sm"><span class="lang-es">Evisceración</span><span class="lang-en hidden-lang">Evisceration</span></strong>
                      <span class="text-xs text-gray-600">
                         <span class="lang-es">Órganos abdominales protruyen a través de la herida. <strong>EMERGENCIA QUIRÚRGICA.</strong></span>
                         <span class="lang-en hidden-lang">Abdominal organs protrude through wound. <strong>SURGICAL EMERGENCY.</strong></span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <strong class="block text-sm text-gray-700 dark:text-gray-300 mb-2"><span class="lang-es">Acciones Inmediatas ante Evisceración:</span><span class="lang-en hidden-lang">Immediate Actions for Evisceration:</span></strong>
                <ul class="text-sm space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                  <li class="flex gap-2">
                     <span class="font-bold text-rose-500">1.</span> 
                     <span>
                        <span class="lang-es"><strong>Mantener la calma y quedarse con el paciente.</strong> Llamar por ayuda/avisar al cirujano.</span>
                        <span class="lang-en hidden-lang"><strong>Stay calm & stay with patient.</strong> Call for help/notify surgeon.</span>
                     </span>
                  </li>
                   <li class="flex gap-2">
                     <span class="font-bold text-rose-500">2.</span> 
                     <span>
                        <span class="lang-es"><strong>Posicionar en</strong> <strong class="text-rose-600">Low Fowler's con rodillas flexionadas</strong> (reduce tensión abdominal).</span>
                        <span class="lang-en hidden-lang"><strong>Position in</strong> <strong class="text-rose-600">Low Fowler's with knees flexed</strong> (reduces abdominal tension).</span>
                     </span>
                  </li>
                   <li class="flex gap-2">
                     <span class="font-bold text-rose-500">3.</span> 
                     <span>
                        <span class="lang-es">Cubrir órganos con <strong>compresas estériles empapadas en solución salina estéril</strong>. No intentar reintroducirlos.</span>
                        <span class="lang-en hidden-lang">Cover organs with <strong>sterile saline-soaked gauze</strong>. Do NOT attempt to reinsert.</span>
                     </span>
                  </li>
                   <li class="flex gap-2">
                     <span class="font-bold text-rose-500">4.</span> 
                     <span>
                        <span class="lang-es">Preparar para reintervención quirúrgica inmediata. NPO, IV acceso grande, laboratorios, consentimiento.</span>
                        <span class="lang-en hidden-lang">Prep for immediate surgery. NPO, large bore IV, labs, consent.</span>
                     </span>
                  </li>
                </ul>
                <div class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p class="text-xs text-red-800 dark:text-red-200 font-bold">
                    <span class="lang-es">Factores de riesgo: Infección, mala nutrición (↓albúmina), obesidad, tos, vómitos, esfuerzo.</span>
                    <span class="lang-en hidden-lang">Risk factors: Infection, poor nutrition (↓albumin), obesity, coughing, vomiting, straining.</span>
                  </p>
                </div>
              </div>

              <div class="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-3xl border border-indigo-200 dark:border-indigo-800">
                <strong class="text-lg text-indigo-800 dark:text-indigo-300 block mb-2"><span class="lang-es">Síndrome Compartimental Abdominal</span><span class="lang-en hidden-lang">Abdominal Compartment Syndrome</span></strong>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span class="lang-es">Presión intraabdominal >20 mmHg con disfunción orgánica. Complicación postoperatoria grave.</span>
                  <span class="lang-en hidden-lang">Intra-abdominal pressure >20 mmHg with organ dysfunction. Serious postoperative complication.</span>
                </p>
                <div class="text-xs bg-white dark:bg-black/20 p-3 rounded-lg">
                  <strong class="text-indigo-600"><span class="lang-es">Signos:</span><span class="lang-en hidden-lang">Signs:</span></strong> <span class="lang-es">Distensión abdominal tensa, oliguria, hipoxia, ↑presión de vías aéreas. <strong>Tratamiento:</strong> Descompresión quirúrgica.</span><span class="lang-en hidden-lang">Tense abdomen, oliguria, hypoxia, ↑airway pressure. <strong>Treatment:</strong> Surgical decompression.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 6. Oncology ---
    renderOncologySafety() {
       return `
        <section>
          <div class="mt-8">
            <div class="flex items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
              <div class="w-12 h-12 rounded-2xl bg-purple-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/30">6</div>
              <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                <span class="lang-es">Seguridad en Oncología</span>
                <span class="lang-en hidden-lang">Oncology Safety</span>
              </h2>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col">
                <div class="flex items-center gap-4 mb-6">
                  <div class="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400">
                    <i class="fa-solid fa-radiation text-4xl"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Radiation Safety (Brachytherapy)</h4>
                    <div class="flex flex-wrap gap-2 mb-3">
                      <span class="px-3 py-1 bg-white dark:bg-black/30 rounded border border-gray-300 dark:border-gray-600 text-xs font-bold">Time (≤30 min)</span>
                      <span class="px-3 py-1 bg-white dark:bg-black/30 rounded border border-gray-300 dark:border-gray-600 text-xs font-bold">Distance (≥6 ft)</span>
                      <span class="px-3 py-1 bg-white dark:bg-black/30 rounded border border-gray-300 dark:border-gray-600 text-xs font-bold">Shielding (Lead Apron)</span>
                    </div>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-3">
                    <i class="fa-solid fa-hand-sparkles text-red-500"></i>
                    <span class="text-sm font-bold text-red-800 dark:text-red-200">
                      <span class="lang-es">Si el implante se cae: Usar <strong>pinzas largas</strong> → depositarlo en contenedor de plomo. NUNCA tocar con las manos.</span>
                      <span class="lang-en hidden-lang">If implant falls out: Use <strong>long forceps</strong> → place in lead container. NEVER touch with hands.</span>
                    </span>
                  </div>
                  <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <strong class="text-sm text-blue-800 dark:text-blue-300 block mb-1"><span class="lang-es">Precauciones para Visitantes/Familia</span><span class="lang-en hidden-lang">Visitor/Family Precautions</span></strong>
                    <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li><span class="lang-es">• Mantener distancia >6 pies (2 m).</span><span class="lang-en hidden-lang">• Keep distance >6 ft (2 m).</span></li>
                      <li><span class="lang-es">• Limitar tiempo de visita (<30 min/día).</span><span class="lang-en hidden-lang">• Limit visit time (<30 min/day).</span></li>
                      <li><span class="lang-es">• No visitar si embarazada o <16-18 años.</span><span class="lang-en hidden-lang">• No visitors if pregnant or <16-18 y/o.</span></li>
                      <li><span class="lang-es">• Habitación privada con baño propio.</span><span class="lang-en hidden-lang">• Private room with private bath.</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6">
                <div class="flex items-center gap-4 mb-6">
                  <div class="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl text-green-600 dark:text-green-400">
                    <i class="fa-solid fa-vial-circle-check text-4xl"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Chemotherapy Safety & Extravasation</h4>
                    <div class="flex flex-wrap gap-2 mb-3">
                      <span class="px-3 py-1 bg-white dark:bg-black/30 rounded border border-gray-300 dark:border-gray-600 text-xs font-bold"><span class="lang-es">PPE Completo</span><span class="lang-en hidden-lang">Full PPE</span></span>
                      <span class="px-3 py-1 bg-white dark:bg-black/30 rounded border border-gray-300 dark:border-gray-600 text-xs font-bold"><span class="lang-es">Manejo de Fluidos</span><span class="lang-en hidden-lang">Bodily Fluids</span></span>
                      <span class="px-3 py-1 bg-white dark:bg-black/30 rounded border border-gray-300 dark:border-gray-600 text-xs font-bold"><span class="lang-es">Antídotos</span><span class="lang-en hidden-lang">Antidotes</span></span>
                    </div>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border-l-4 border-red-500">
                    <strong class="block text-red-800 dark:text-red-300 text-sm mb-1"><span class="lang-es">Protocolo de Extravasación</span><span class="lang-en hidden-lang">Extravasation Protocol</span></strong>
                    <ol class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                      <li>1. <strong><span class="lang-es">Detener infusión inmediatamente.</span><span class="lang-en hidden-lang">Stop infusion immediately.</span></strong> <span class="lang-es">NO retirar la aguja/catéter.</span><span class="lang-en hidden-lang">Do NOT remove needle/catheter.</span></li>
                      <li>2. <strong><span class="lang-es">Aspirar cualquier medicamento residual</span><span class="lang-en hidden-lang">Aspirate residual drug</span></strong> <span class="lang-es">desde el puerto.</span><span class="lang-en hidden-lang">from the port.</span></li>
                      <li>3. <strong><span class="lang-es">Notificar al médico y farmacia oncológica.</span><span class="lang-en hidden-lang">Notify MD & oncology pharmacy.</span></strong></li>
                      <li>4. <strong><span class="lang-es">Aplicar antídoto específico</span><span class="lang-en hidden-lang">Apply specific antidote</span></strong> <span class="lang-es">si está indicado (ej. DMSO para antraciclinas).</span><span class="lang-en hidden-lang">if indicated (e.g., DMSO for anthracyclines).</span></li>
                      <li>5. <strong><span class="lang-es">Documentar extensivamente</span><span class="lang-en hidden-lang">Document extensively</span></strong> (site, drug, volume, actions).</li>
                    </ol>
                  </div>
                  <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <strong class="text-sm text-amber-800 dark:text-amber-300 block mb-1"><span class="lang-es">Efectos Adversos Comunes</span><span class="lang-en hidden-lang">Common Adverse Effects</span></strong>
                    <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <div>• <span class="lang-es">Mielosupresión (nadir 7-14 días)</span><span class="lang-en hidden-lang">Myelosuppression (nadir 7-14 days)</span></div>
                      <div>• Mucositis</div>
                      <div>• <span class="lang-es">Náusea/vómito</span><span class="lang-en hidden-lang">Nausea/Vomiting</span></div>
                      <div>• Alopecia</div>
                      <div>• <span class="lang-es">Neuropatía periférica</span><span class="lang-en hidden-lang">Peripheral Neuropathy</span></div>
                      <div>• <span class="lang-es">Síndrome de lisis tumoral</span><span class="lang-en hidden-lang">Tumor Lysis Syndrome</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
       `;
    }
  });
})();