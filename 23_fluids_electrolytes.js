// 23_fluids_electrolytes.js — Fluids, Electrolytes & Acid-Base Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: Combinación de arquitectura modular y contenido completo.
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Contenido NGN enfocado en seguridad, rangos críticos e intervenciones prioritarias.

(function() {
  'use strict';

  // Helper interno para traducción bilingüe (Principio DRY)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  window.NCLEX.registerTopic({
    id: '23', // ID estandarizado
    title: { es: 'Líquidos y Electrolitos', en: 'Fluids & Electrolytes' },
    subtitle: { es: 'Homeostasis, ABGs y Terapias IV', en: 'Homeostasis, ABGs & IV Therapy' },
    icon: 'droplet',
    color: 'cyan',

    // Método principal de renderizado
    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-slate-700 pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-flask"></i>
                ${t('Módulo 23', 'Module 23')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Líquidos y Electrolitos', 'Fluids & Electrolytes')}
              </h1>
              <p class="text-lg text-slate-600 dark:text-slate-300 mt-2">
                ${t('Dominio de la homeostasis corporal. Enfoque en seguridad IV, arritmias letales y corrección de desequilibrios ácido-base.', 
                   'Mastery of body homeostasis. Focus on IV administration safety, lethal arrhythmia recognition, and acid-base imbalance correction.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderNormalRanges()}
          <hr class="border-slate-200 dark:border-slate-700">
          ${this.renderIVSolutions()}
          <hr class="border-slate-200 dark:border-slate-700">
          ${this.renderPotassium()}
          ${this.renderSodium()}
          ${this.renderCalciumMagnesium()}
          ${this.renderABGs()}
          ${this.renderNGNCaseStudy()}
        </div>
      `;
    },

    // --- SECCIÓN 1: RANGOS NORMALES ---
    renderNormalRanges() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 pb-2">
            <div class="w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-black text-lg shadow-md">1</div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">
              ${t('Rangos Normales "Golden Standard"', 'Golden Standard Normal Ranges')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div class="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-cyan-200 dark:border-cyan-800/50">
                <h3 class="font-bold text-cyan-700 dark:text-cyan-300 mb-3 border-b border-cyan-200 dark:border-cyan-700 pb-2">
                    ${t('Electrolitos Séricos', 'Serum Electrolytes')}
                </h3>
                <ul class="space-y-2 text-slate-700 dark:text-slate-300">
                    <li class="flex justify-between"><span>${t('Sodio', 'Sodium')} (Na+)</span> <strong class="font-mono">135 - 145 mEq/L</strong></li>
                    <li class="flex justify-between"><span>${t('Potasio', 'Potassium')} (K+)</span> <strong class="font-mono">3.5 - 5.0 mEq/L</strong></li>
                    <li class="flex justify-between"><span>${t('Calcio', 'Calcium')} (Ca++)</span> <strong class="font-mono">9.0 - 10.5 mg/dL</strong></li>
                    <li class="flex justify-between"><span>${t('Magnesio', 'Magnesium')} (Mg+)</span> <strong class="font-mono">1.3 - 2.1 mEq/L</strong></li>
                    <li class="flex justify-between"><span>${t('Fósforo', 'Phosphorus')} (PO4)</span> <strong class="font-mono">3.0 - 4.5 mg/dL</strong></li>
                    <li class="flex justify-between"><span>${t('Cloruro', 'Chloride')} (Cl-)</span> <strong class="font-mono">98 - 106 mEq/L</strong></li>
                </ul>
            </div>
            
            <div class="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-pink-200 dark:border-pink-800/50">
                <h3 class="font-bold text-pink-700 dark:text-pink-300 mb-3 border-b border-pink-200 dark:border-pink-700 pb-2">
                    ${t('Gases Arteriales (ABGs)', 'Arterial Blood Gases (ABGs)')}
                </h3>
                <ul class="space-y-2 text-slate-700 dark:text-slate-300">
                    <li class="flex justify-between"><span>pH</span> <strong class="font-mono">7.35 - 7.45</strong></li>
                    <li class="flex justify-between"><span>PaCO2</span> <strong class="font-mono">35 - 45 mmHg</strong></li>
                    <li class="flex justify-between"><span>HCO3</span> <strong class="font-mono">21 - 28 mEq/L</strong></li>
                    <li class="flex justify-between"><span>PaO2</span> <strong class="font-mono">80 - 100 mmHg</strong></li>
                    <li class="flex justify-between"><span>SaO2</span> <strong class="font-mono">> 95%</strong></li>
                </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- SECCIÓN 2: SOLUCIONES IV ---
    renderIVSolutions() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 pb-2">
            <div class="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md">2</div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">
              ${t('Tipos de Soluciones IV', 'IV Solution Types')}
            </h2>
          </div>

          <div class="grid md:grid-cols-3 gap-4 text-sm">
            <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border-t-4 border-green-500 shadow-sm hover:-translate-y-1 transition-transform">
                <strong class="text-green-700 dark:text-green-400 text-lg block mb-1">
                    ${t('Isotónica', 'Isotonic')}
                </strong>
                <p class="text-xs text-slate-500 italic mb-2">"Stay where I put it"</p>
                <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                    <li><strong>Fluids:</strong> 0.9% NaCl (NS), Lactated Ringer's (LR).</li>
                    <li>
                        <strong class="text-green-600">Action:</strong> 
                        ${t('Expande volumen intravascular. Sin cambio de fluido.', 'Expands intravascular volume. No fluid shift.')}
                    </li>
                    <li>
                        <strong class="text-red-500">Use:</strong> 
                        ${t('Hipovolemia, Quemaduras, Shock.', 'Hypovolemia, Burns, Shock.')}
                    </li>
                </ul>
            </div>

            <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border-t-4 border-blue-500 shadow-sm hover:-translate-y-1 transition-transform">
                <strong class="text-blue-700 dark:text-blue-400 text-lg block mb-1">
                    ${t('Hipotónica', 'Hypotonic')}
                </strong>
                <p class="text-xs text-slate-500 italic mb-2">"Go Out of the vessel"</p>
                <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                    <li><strong>Fluids:</strong> 0.45% NaCl (1/2 NS), 0.33% NS.</li>
                    <li>
                        <strong class="text-blue-600">Action:</strong> 
                        ${t('Mueve agua HACIA la célula (Cell Swell).', 'Moves water INTO the cell (Cell Swell).')}
                    </li>
                    <li>
                        <strong class="text-red-500">Danger:</strong> 
                        ${t('NO DAR en trauma craneal (aumenta ICP) ni quemaduras.', 'DO NOT give in head trauma (inc. ICP) or burns.')}
                    </li>
                </ul>
            </div>

            <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border-t-4 border-purple-500 shadow-sm hover:-translate-y-1 transition-transform">
                <strong class="text-purple-700 dark:text-purple-400 text-lg block mb-1">
                    ${t('Hipertónica', 'Hypertonic')}
                </strong>
                <p class="text-xs text-slate-500 italic mb-2">"Enter the vessel"</p>
                <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                    <li><strong>Fluids:</strong> 3% NaCl, 5% NaCl, D10W, D5LR.</li>
                    <li>
                        <strong class="text-purple-600">Action:</strong> 
                        ${t('Saca agua DE la célula (Cell Shrink).', 'Pulls water OUT of the cell (Cell Shrink).')}
                    </li>
                    <li>
                        <strong class="text-red-500">Monitor:</strong> 
                        ${t('Riesgo de Edema Pulmonar / Sobrecarga.', 'Risk of Pulmonary Edema / Fluid Overload.')}
                    </li>
                </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- SECCIÓN 3: POTASIO ---
    renderPotassium() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 pb-2">
            <div class="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-md animate-pulse">3</div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">
              ${t('Potasio (K+) - Prioridad Cardíaca', 'Potassium (K+) - Cardiac Priority')}
            </h2>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
             <div class="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-200 dark:border-indigo-800">
                <strong class="text-indigo-700 dark:text-indigo-300 text-lg block mb-2">
                    ${t('Hipokalemia', 'Hypokalemia')} (< 3.5)
                </strong>
                <p class="text-xs text-slate-500 mb-2">
                    ${t('Causas: Diuréticos (Furosemida), Vómitos, NG suction.', 'Causes: Diuretics (Furosemide), Vomiting, NG suction.')}
                </p>
                <ul class="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 mb-3">
                   <li><strong>ECG:</strong> ${t('Ondas U prominentes, ST deprimido, T planas.', 'Prominent U waves, ST depression, Flat T waves.')}</li>
                   <li><strong>Sxs:</strong> ${t('Debilidad muscular, calambres, íleo paralítico.', 'Muscle weakness, cramps, paralytic ileus.')}</li>
                </ul>
                <div class="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl text-xs font-bold text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800 flex gap-2">
                   <i class="fa-solid fa-triangle-exclamation mt-0.5"></i>
                   <div>
                       ${t('¡NUNCA administrar IV Push! Siempre diluido y con bomba (Max 10-20 mEq/hr). Quema venas.', 'NEVER give IV Push! Always diluted via pump (Max 10-20 mEq/hr). Burns veins.')}
                   </div>
                </div>
             </div>

             <div class="p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-800">
                <strong class="text-red-700 dark:text-red-300 text-lg block mb-2">
                    ${t('Hiperkalemia', 'Hyperkalemia')} (> 5.0)
                </strong>
                <p class="text-xs text-slate-500 mb-2">
                    ${t('Causas: Falla renal, Espironolactona, Quemaduras.', 'Causes: Renal failure, Spironolactone, Burns.')}
                </p>
                <ul class="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 mb-3">
                   <li><strong>ECG:</strong> <span class="text-red-600 font-bold">${t('Ondas T picudas (Peaked T)', 'Peaked T Waves')}</span>.</li>
                   <li><strong>Sxs:</strong> ${t('Debilidad, Arritmias fatales.', 'Weakness, Fatal arrhythmias.')}</li>
                </ul>
                <div class="bg-white dark:bg-black/20 p-3 rounded-xl text-xs border border-red-100 dark:border-red-900/50">
                   <strong class="block mb-1 text-red-800 dark:text-red-200">${t('Protocolo de Emergencia "C I G K":', 'Emergency Protocol "C I G K":')}</strong>
                   <ol class="list-decimal list-inside space-y-1">
                        <li><strong>C</strong>alcio Gluconato ${t('(Protege corazón)', '(Protects heart)')}.</li>
                        <li><strong>I</strong>nsulina Reg IV + <strong>G</strong>lucosa ${t('(Mete K+ a célula)', '(Moves K+ into cell)')}.</li>
                        <li><strong>K</strong>ayexalate ${t('(Excreción fecal de K+)', '(Fecal excretion of K+)')}.</li>
                   </ol>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- SECCIÓN 4: SODIO ---
    renderSodium() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 pb-2">
            <div class="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md">4</div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">
              ${t('Sodio (Na+) - Prioridad Neurológica', 'Sodium (Na+) - Neurological Priority')}
            </h2>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-200 dark:border-blue-800 text-center mb-6">
             <p class="text-lg text-blue-800 dark:text-blue-200 font-medium italic">
               ${t('"Donde va el Sodio, va el Agua... y el Cerebro sufre los cambios."', 
                   '"Where Sodium goes, Water follows... and the Brain suffers the changes."')}
             </p>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
             <div class="p-5 bg-white dark:bg-slate-800 rounded-2xl border-l-4 border-blue-500 shadow-sm">
                <strong class="text-blue-700 dark:text-blue-400 block mb-2 text-lg">
                    ${t('Hiponatremia', 'Hyponatremia')} (< 135)
                </strong>
                <ul class="text-sm text-slate-700 dark:text-slate-300 list-disc list-inside space-y-2">
                   <li><strong>Riesgo:</strong> ${t('Edema cerebral, Convulsiones.', 'Cerebral edema, Seizures.')}</li>
                   <li><strong>Intervenciones:</strong> ${t('Restricción líquidos, Na+ Oral.', 'Fluid restriction, PO Sodium.')}</li>
                   <li><strong>Severo:</strong> ${t('Salina 3% (LENTO).', '3% Saline (SLOW).')}</li>
                   <li><strong>SIADH:</strong> ${t('Exceso ADH -> Retención agua -> Na+ diluido.', 'Excess ADH -> Water retention -> Dilutional Hyponatremia.')}</li>
                </ul>
             </div>

             <div class="p-5 bg-white dark:bg-slate-800 rounded-2xl border-l-4 border-orange-500 shadow-sm">
                <strong class="text-orange-700 dark:text-orange-400 block mb-2 text-lg">
                    ${t('Hipernatremia', 'Hypernatremia')} (> 145)
                </strong>
                <ul class="text-sm text-slate-700 dark:text-slate-300 list-disc list-inside space-y-2">
                   <li><strong>Signos:</strong> ${t('Sed extrema, lengua seca/hinchada, fiebre.', 'Extreme thirst, dry/swollen tongue, fever.')}</li>
                   <li><strong>Intervenciones:</strong> ${t('Fluidos Hipotónicos (0.45% NS).', 'Hypotonic fluids (0.45% NS).')}</li>
                   <li><strong>Diabetes Insípida:</strong> ${t('Falta ADH -> Poliuria masiva -> Hemoconcentración.', 'Lack of ADH -> Massive polyuria -> Hemoconcentration.')}</li>
                </ul>
             </div>
          </div>
        </section>
      `;
    },

    // --- SECCIÓN 5: CALCIO Y MAGNESIO ---
    renderCalciumMagnesium() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 pb-2">
            <div class="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md">5</div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">
              ${t('Calcio y Magnesio', 'Calcium & Magnesium')}
            </h2>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <table class="w-full text-sm text-left bg-white dark:bg-slate-800">
                <thead class="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200">
                   <tr>
                      <th class="p-4">${t('Electrolito', 'Electrolyte')}</th>
                      <th class="p-4">${t('Hipo (Bajo) = ¡EXCITACIÓN!', 'Hypo (Low) = EXCITATION!')}</th>
                      <th class="p-4">${t('Hiper (Alto) = ¡SEDACIÓN!', 'Hyper (High) = SEDATION!')}</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                   <tr>
                      <td class="p-4 font-bold text-orange-600">${t('Calcio', 'Calcium')} (Ca++)</td>
                      <td class="p-4 bg-red-50 dark:bg-red-900/10">
                         <span class="text-red-600 font-bold">${t('Tetania / Convulsiones', 'Tetany / Seizures')}</span><br>
                         ${t('Signo Chvostek (Cara)', 'Chvostek Sign (Face)')}<br>
                         ${t('Signo Trousseau (Espasmo brazo)', 'Trousseau Sign (Arm Spasm)')}
                      </td>
                      <td class="p-4 bg-blue-50 dark:bg-blue-900/10 text-slate-600 dark:text-slate-400">
                         ${t('Debilidad Muscular', 'Muscle Weakness')}<br>
                         ${t('Estreñimiento', 'Constipation')}<br>
                         ${t('Piedras renales', 'Kidney stones')}
                      </td>
                   </tr>
                   <tr>
                      <td class="p-4 font-bold text-emerald-600">${t('Magnesio', 'Magnesium')} (Mg+)</td>
                      <td class="p-4 bg-red-50 dark:bg-red-900/10">
                         ${t('Hiperreflexia (DTRs 4+)', 'Hyperreflexia (DTRs 4+)')}<br>
                         <span class="bg-black text-white px-1 rounded text-xs">Torsades de Pointes</span><br>
                         ${t('Tx: Sulfato de Magnesio', 'Tx: Magnesium Sulfate')}
                      </td>
                      <td class="p-4 bg-blue-50 dark:bg-blue-900/10 text-slate-600 dark:text-slate-400">
                         <div class="font-bold text-blue-600">"Mag is a Drag"</div>
                         ${t('Hiporreflexia (DTRs 0-1+)', 'Hyporeflexia (DTRs 0-1+)')}<br>
                         ${t('Depresión Respiratoria', 'Respiratory Depression')}<br>
                         <strong>${t('Antídoto: Gluconato Ca', 'Antidote: Ca Gluconate')}</strong>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
        </section>
      `;
    },

    // --- SECCIÓN 6: ABGs (ROME) ---
    renderABGs() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 pb-2">
            <div class="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white font-black text-lg shadow-md">6</div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">
              ${t('Interpretación ABG (ROME)', 'ABG Interpretation (ROME)')}
            </h2>
          </div>

          <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
             <div class="grid md:grid-cols-2 gap-8 items-center">
                <div class="text-center">
                   <div class="text-5xl font-black text-teal-600 dark:text-teal-400 tracking-[1rem] select-none">ROME</div>
                   <div class="mt-4 space-y-2">
                      <div class="flex items-center justify-center gap-2">
                         <span class="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">R</span>
                         <span class="text-teal-700 dark:text-teal-300 font-bold">Respiratory Opposite</span>
                         <span class="text-xs text-slate-500">(pH ↑ PCO2 ↓)</span>
                      </div>
                      <div class="flex items-center justify-center gap-2">
                         <span class="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">M</span>
                         <span class="text-teal-700 dark:text-teal-300 font-bold">Metabolic Equal</span>
                         <span class="text-xs text-slate-500">(pH ↑ HCO3 ↑)</span>
                      </div>
                   </div>
                </div>
                
                <div class="space-y-3 text-sm">
                   <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border-l-4 border-blue-500 shadow-sm">
                      <strong class="block text-blue-700 dark:text-blue-400">
                        ${t('Acidosis Respiratoria', 'Respiratory Acidosis')}
                      </strong>
                      <span class="text-slate-600 dark:text-slate-400">
                        ${t('Retención CO2 (Hipoventilación). Ej: COPD, Opioides.', 'CO2 Retention (Hypoventilation). Ex: COPD, Opioids.')}
                      </span>
                   </div>
                   <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border-l-4 border-green-500 shadow-sm">
                      <strong class="block text-green-700 dark:text-green-400">
                        ${t('Alcalosis Respiratoria', 'Respiratory Alkalosis')}
                      </strong>
                      <span class="text-slate-600 dark:text-slate-400">
                        ${t('Expulsión CO2 (Hiperventilación). Ej: Ansiedad, Pánico.', 'Excess CO2 expulsion (Hyperventilation). Ex: Anxiety, Panic.')}
                      </span>
                   </div>
                   <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border-l-4 border-red-500 shadow-sm">
                      <strong class="block text-red-700 dark:text-red-400">
                        ${t('Acidosis Metabólica', 'Metabolic Acidosis')}
                      </strong>
                      <span class="text-slate-600 dark:text-slate-400">
                        ${t('Pérdida base/Exceso ácido. Ej: Diarrea, DKA, Falla Renal.', 'Loss of base/Excess acid. Ex: Diarrhea, DKA, Renal Failure.')}
                      </span>
                   </div>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- SECCIÓN 7: CASO DE ESTUDIO NGN ---
    renderNGNCaseStudy() {
      return `
        <section class="mt-8">
           <div class="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-6 rounded-3xl shadow-xl">
              <h3 class="text-xl font-bold mb-2 flex items-center gap-2">
                 <i class="fa-solid fa-user-nurse"></i> NGN Clinical Judgment
              </h3>
              <p class="text-sm opacity-90 mb-4">
                 ${t('Paciente post-tiroidectomía refiere hormigueo alrededor de la boca y en los dedos.', 
                     'Post-thyroidectomy patient reports tingling around mouth and fingers.')}
              </p>
              
              <div class="bg-white/10 p-4 rounded-xl text-sm border border-white/20">
                 <div class="mb-2">
                    <strong class="text-cyan-200">${t('Análisis:', 'Analysis:')}</strong> 
                    ${t('Riesgo de daño a paratiroides -> Hipocalcemia.', 'Risk of parathyroid damage -> Hypocalcemia.')}
                 </div>
                 <div>
                    <strong class="text-cyan-200">${t('Acción Prioritaria:', 'Priority Action:')}</strong>
                    <ul class="list-disc list-inside mt-1 space-y-1">
                       <li>${t('Evaluar signos Chvostek/Trousseau.', 'Assess Chvostek/Trousseau signs.')}</li>
                       <li>${t('Tener Gluconato de Calcio IV listo.', 'Have IV Calcium Gluconate ready.')}</li>
                       <li>${t('Chequear vía aérea (riesgo laringoespasmo).', 'Check airway (laryngospasm risk).')}</li>
                    </ul>
                 </div>
              </div>
           </div>
        </section>
      `;
    }
  });
})();