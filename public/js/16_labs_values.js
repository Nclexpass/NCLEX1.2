// 16_labs_values.js — Laboratory Values Masterclass (NCLEX) v4.0
// INTEGRACIÓN: Modo Estudio Global (Blur) + Bilingüismo Nativo

(function() {
  'use strict';

  // Helper de traducción seguro
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  // Registrar el módulo
  if (window.NCLEX && window.NCLEX.registerTopic) {
    window.NCLEX.registerTopic({
      id: 'labs-values',
      title: { es: 'Valores de Laboratorio', en: 'Laboratory Values' },
      subtitle: { es: 'Masterclass: Rangos y Farmacología', en: 'Masterclass: Ranges & Pharmacology' },
      icon: 'flask',
      color: 'cyan',

      render() {
        // Renderizado del contenido
        return `
          ${this.renderHeader()}
          <div id="labs-content" class="space-y-12 animate-fade-in transition-all pb-20">
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

      // Header simplificado (El toggle global está en el Dashboard, pero añadimos uno local por comodidad)
      renderHeader() {
        return `
          <header class="flex flex-col gap-4 border-b border-[var(--brand-border)] pb-6 mb-8">
            <div class="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-sm font-extrabold uppercase tracking-wider mb-2">
                  <i class="fa-solid fa-flask"></i>
                  ${t('NCLEX High-Yield', 'NCLEX High-Yield')}
                </div>
                <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-[var(--brand-text)]">
                  ${t('Hoja Maestra de Laboratorios', 'Lab Values Cheat Sheet')}
                </h1>
              </div>
              
              <button onclick="window.nclexApp.toggleStudyMode()" 
                class="bg-[var(--brand-card)] text-[var(--brand-text)] border border-[var(--brand-border)] px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 group">
                  <i class="fa-solid fa-eye-slash text-cyan-500 group-hover:scale-110 transition-transform"></i> 
                  ${t('Alternar Modo Estudio', 'Toggle Study Mode')}
              </button>
            </div>
            
            <div class="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 flex items-start gap-3">
               <i class="fa-solid fa-lightbulb text-yellow-600 mt-1"></i>
               <p class="text-sm text-[var(--brand-text)]">
                  ${t(
                    '<strong>Tip:</strong> Activa el "Modo Estudio" para ocultar los valores y ponerte a prueba. Pasa el mouse sobre un número borroso para revelarlo.',
                    '<strong>Tip:</strong> Turn on "Study Mode" to blur values and quiz yourself. Hover over a blurred number to reveal it.'
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
            <ul class="space-y-3 text-base text-[var(--brand-text)]">
              <li class="flex items-start gap-3">
                <span class="bg-blue-200 text-blue-800 font-bold px-2 rounded min-w-[30px] text-center">1</span>
                <div>
                  <strong class="text-[var(--brand-text)]">Assess before Action:</strong> 
                  ${t(
                    'Si el K+ es 6.0, primero <span class="text-red-600 font-bold">MONITOREA EL CORAZÓN</span> (ECG), luego llama.',
                    'If K+ is 6.0, first <span class="text-red-600 font-bold">MONITOR HEART</span> (ECG), then call MD.'
                  )}
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="bg-blue-200 text-blue-800 font-bold px-2 rounded min-w-[30px] text-center">2</span>
                <div>
                  <strong class="text-[var(--brand-text)]">Trend vs. Isolated:</strong> 
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
            <div class="flex items-center gap-3 mb-6 border-b border-[var(--brand-border)] pb-4">
              <div class="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-black text-xl shadow-lg">1</div>
              <h2 class="text-2xl font-black text-[var(--brand-text)]">
                ${t('Electrolitos (Vitales)', 'Electrolytes (Vitals)')}
              </h2>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              <div class="group bg-[var(--brand-card)] rounded-3xl p-6 shadow-lg border border-[var(--brand-border)] hover:border-red-400 transition-all">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-2xl font-black text-red-600 dark:text-red-400">Potassium (K+)</h3>
                  <span class="blur-target bg-[var(--brand-bg)] px-3 py-1 rounded-lg font-mono font-bold text-lg border border-[var(--brand-border)]">3.5 - 5.0</span>
                </div>
                <div class="space-y-4">
                  <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900">
                    <strong class="text-red-700 dark:text-red-300 block mb-1 uppercase tracking-wider text-sm">CRITICAL / PANIC</strong>
                    <div class="flex justify-between items-center">
                      <span class="blur-target text-lg font-bold">< 3.0 or > 5.5</span>
                      <span class="text-xs font-bold text-red-600 dark:text-red-400 border border-red-200 px-2 py-1 rounded bg-white dark:bg-black/20">PRIORITY 1</span>
                    </div>
                  </div>
                  <div>
                    <strong class="block text-[var(--brand-text)] mb-1">Hyperkalemia (> 5.0)</strong>
                    <ul class="text-sm text-[var(--brand-text-muted)] list-disc ml-4 space-y-1">
                      <li>
                          ${t(
                            '<span class="text-red-500 font-bold">Ondas T PICUDAS</span> y Elevación ST.',
                            '<span class="text-red-500 font-bold">PEAKED T-Waves</span> & ST Elevation.'
                          )}
                      </li>
                      <li>
                          <strong>Meds:</strong> 
                          ${t(
                            'Gluconato de Calcio, Insulina IV + Dextrosa, <span class="text-green-600 font-bold">Kayexalate</span>.',
                            'Calcium Gluconate, IV Insulin + Dextrose, <span class="text-green-600 font-bold">Kayexalate</span>.'
                          )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="group bg-[var(--brand-card)] rounded-3xl p-6 shadow-lg border border-[var(--brand-border)] hover:border-blue-400 transition-all">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-2xl font-black text-blue-600 dark:text-blue-400">Sodium (Na+)</h3>
                  <span class="blur-target bg-[var(--brand-bg)] px-3 py-1 rounded-lg font-mono font-bold text-lg border border-[var(--brand-border)]">135 - 145</span>
                </div>
                <div class="space-y-4">
                  <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900">
                    <strong class="text-blue-700 dark:text-blue-300 block mb-1 uppercase tracking-wider text-sm">CRITICAL (NEURO)</strong>
                    <span class="blur-target text-lg font-bold">< 125 or > 155</span>
                    <p class="text-sm mt-1 opacity-80">
                        ${t(
                          'Cambio en conciencia (LOC), <strong class="text-red-500">Riesgo Convulsiones</strong>.',
                          'Change in LOC, <strong class="text-red-500">Seizure Risk</strong>.'
                        )}
                    </p>
                  </div>
                  <div>
                    <strong class="block text-[var(--brand-text)] mb-1">Nursing Implication</strong>
                    <ul class="text-sm text-[var(--brand-text-muted)] list-disc ml-4">
                      <li>
                          ${t(
                            '<strong>SIADH:</strong> Na+ Bajo (Diluido). Restringir fluidos.',
                            '<strong>SIADH:</strong> Low Na+ (Dilute). Fluid Restriction.'
                          )}
                      </li>
                      <li>
                          ${t(
                            '<strong>DI:</strong> Na+ Alto (Concentrado). Dar fluidos.',
                            '<strong>DI:</strong> High Na+ (Concentrated). Give Fluids.'
                          )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 xl:col-span-2">
                  <div class="group bg-[var(--brand-card)] rounded-3xl p-6 shadow-lg border border-[var(--brand-border)]">
                     <div class="flex justify-between items-center mb-4">
                      <h3 class="text-xl font-black text-orange-600 dark:text-orange-400">Calcium (Ca+)</h3>
                      <span class="blur-target bg-[var(--brand-bg)] px-2 py-1 rounded-lg font-mono font-bold border border-[var(--brand-border)]">9.0 - 10.5</span>
                    </div>
                    
                    <ul class="text-sm text-[var(--brand-text-muted)] space-y-2 mt-4">
                      <li>
                          <strong class="text-red-500">Hypocalcemia (< 9.0):</strong> <br>
                          ${t(
                            'Tetania, <span class="font-bold underline">Chvostek</span> (Mejilla), <span class="font-bold underline">Trousseau</span> (Manguito BP).',
                            'Tetany, <span class="font-bold underline">Chvostek\'s</span> (Cheek), <span class="font-bold underline">Trousseau\'s</span> (BP Cuff).'
                          )}
                      </li>
                    </ul>
                  </div>

                  <div class="group bg-[var(--brand-card)] rounded-3xl p-6 shadow-lg border border-[var(--brand-border)]">
                     <div class="flex justify-between items-center mb-4">
                      <h3 class="text-xl font-black text-emerald-600 dark:text-emerald-400">Magnesium (Mg+)</h3>
                      <span class="blur-target bg-[var(--brand-bg)] px-2 py-1 rounded-lg font-mono font-bold border border-[var(--brand-border)]">1.3 - 2.1</span>
                    </div>
                    <ul class="text-sm text-[var(--brand-text-muted)] space-y-2">
                      <li>
                          <strong class="text-red-500">Hypomagnesemia (< 1.3):</strong> <br>
                          ${t(
                            'Hiper-reflexia, <span class="font-bold text-red-600">Torsades de Pointes</span>.',
                            'Hyper-reflexia, <span class="font-bold text-red-600">Torsades de Pointes</span>.'
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
            <div class="flex items-center gap-3 mb-6 border-b border-[var(--brand-border)] pb-4 mt-12">
              <div class="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg">2</div>
              <h2 class="text-2xl font-black text-[var(--brand-text)]">
                ${t('Hematología y Coagulación', 'Heme & Coagulation')}
              </h2>
            </div>

            <div class="overflow-x-auto bg-[var(--brand-card)] rounded-3xl shadow-lg border border-[var(--brand-border)] mb-8">
              <table class="w-full text-left border-collapse min-w-[600px]">
                <thead class="bg-[var(--brand-bg)] text-[var(--brand-text-muted)] text-xs uppercase">
                  <tr>
                    <th class="px-6 py-4 rounded-tl-3xl">${t('Prueba', 'Test')}</th>
                    <th class="px-6 py-4">${t('Rango Normal', 'Normal Range')}</th>
                    <th class="px-6 py-4">${t('Acción / Antídoto', 'Action / Antidote')}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[var(--brand-border)] text-sm text-[var(--brand-text)]">
                  <tr class="hover:bg-[var(--brand-bg)] transition-colors">
                    <td class="px-6 py-4 font-bold">Hemoglobin (Hgb)</td>
                    <td class="px-6 py-4"><span class="blur-target font-mono font-bold">12 - 18</span></td>
                    <td class="px-6 py-4"><span class="font-bold text-red-600">< 7 = Transfuse</span></td>
                  </tr>
                  <tr class="hover:bg-[var(--brand-bg)] transition-colors">
                    <td class="px-6 py-4 font-bold">Platelets</td>
                    <td class="px-6 py-4"><span class="blur-target font-mono font-bold">150k - 400k</span></td>
                    <td class="px-6 py-4">
                      <span class="font-bold text-red-600">< 50k = Precautions</span><br>
                    </td>
                  </tr>
                  <tr class="hover:bg-[var(--brand-bg)] transition-colors">
                    <td class="px-6 py-4 font-bold">WBC</td>
                    <td class="px-6 py-4"><span class="blur-target font-mono font-bold">5k - 10k</span></td>
                    <td class="px-6 py-4">
                      <span class="font-bold text-orange-600">< 1,000 ANC</span> = ${t('Precauciones Neutropénicas.', 'Neutropenic Precautions.')}
                    </td>
                  </tr>
                  <tr class="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500">
                    <td class="px-6 py-4 font-bold text-blue-800 dark:text-blue-300">aPTT (Heparin)</td>
                    <td class="px-6 py-4"><span class="blur-target font-mono font-bold">30 - 40s</span> (Target 1.5-2.5x)</td>
                    <td class="px-6 py-4">
                      <strong>${t('Antídoto: Sulfato de Protamina', 'Antidote: Protamine Sulfate')}</strong>
                    </td>
                  </tr>
                  <tr class="bg-pink-50 dark:bg-pink-900/10 border-l-4 border-pink-500">
                    <td class="px-6 py-4 font-bold text-pink-800 dark:text-pink-300">INR (Warfarin)</td>
                    <td class="px-6 py-4"><span class="blur-target font-mono font-bold">0.8 - 1.1</span> (Target 2-3)</td>
                    <td class="px-6 py-4">
                      <strong>${t('Antídoto: Vitamina K', 'Antidote: Vitamin K')}</strong>
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
            
            <div class="bg-[var(--brand-card)] rounded-3xl p-6 shadow-lg border border-[var(--brand-border)]">
              <h3 class="text-xl font-bold text-amber-600 dark:text-amber-400 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-kidneys"></i> Renal Function
              </h3>
              <div class="space-y-4">
                <div class="flex justify-between border-b border-[var(--brand-border)] pb-2">
                  <span class="text-[var(--brand-text)]">Creatinine (Cr)</span>
                  <div class="text-right">
                    <span class="blur-target font-bold font-mono text-lg block">0.6 - 1.2</span>
                    <span class="text-xs text-amber-600 font-bold uppercase">
                        ${t('Mejor Indicador', 'Best Indicator')}
                    </span>
                  </div>
                </div>
                <div class="flex justify-between border-b border-[var(--brand-border)] pb-2">
                  <span class="text-[var(--brand-text)]">BUN</span>
                  <div class="text-right">
                    <span class="blur-target font-bold font-mono text-lg block">10 - 20</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-[var(--brand-card)] rounded-3xl p-6 shadow-lg border border-[var(--brand-border)]">
               <h3 class="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-candy-cane"></i> Glucose Control
              </h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-[var(--brand-text)]">
                      ${t('Glucosa Ayuno', 'Fasting Glucose')}
                  </span>
                  <span class="blur-target font-mono text-lg">70 - 100</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-[var(--brand-text)]">HbA1c</span>
                  <span class="blur-target font-mono text-lg">< 5.7%</span>
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
             <div class="flex items-center gap-3 mb-6 border-b border-[var(--brand-border)] pb-4">
              <div class="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white font-black text-xl shadow-lg">5</div>
              <h2 class="text-2xl font-black text-[var(--brand-text)]">ABGs (Arterial Blood Gases)</h2>
            </div>
            
            <div class="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 text-center mt-4">
                <div class="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
                  <h4 class="text-gray-400 uppercase text-xs font-bold mb-2">
                      ${t('Acidez', 'Acidity')}
                  </h4>
                  <div class="text-4xl font-black mb-1">pH</div>
                  <div class="blur-target text-2xl font-mono text-cyan-300">7.35 - 7.45</div>
                </div>

                <div class="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
                  <h4 class="text-gray-400 uppercase text-xs font-bold mb-2">
                      ${t('Respiratorio', 'Respiratory')}
                  </h4>
                  <div class="text-4xl font-black mb-1">PaCO2</div>
                  <div class="blur-target text-2xl font-mono text-cyan-300">35 - 45</div>
                </div>

                <div class="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
                  <h4 class="text-gray-400 uppercase text-xs font-bold mb-2">
                      ${t('Metabólico', 'Metabolic')}
                  </h4>
                  <div class="text-4xl font-black mb-1">HCO3</div>
                  <div class="blur-target text-2xl font-mono text-cyan-300">22 - 26</div>
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
            <h2 class="text-2xl font-black text-[var(--brand-text)] mb-6">
              ${t('Marcadores Específicos', 'Specific Organ Markers')}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-[var(--brand-card)] p-6 rounded-3xl shadow border border-[var(--brand-border)]">
                <div class="text-red-500 mb-2"><i class="fa-solid fa-heart-pulse fa-xl"></i></div>
                <strong class="block text-lg text-[var(--brand-text)]">Troponin</strong>
                <p class="text-sm text-[var(--brand-text-muted)] mb-2">
                    ${t('Infarto Miocardio (MI)', 'MI (Heart Attack)')}
                </p>
                <div class="blur-target font-mono font-bold text-xl">< 0.5 ng/mL</div>
                
                <div class="mt-4 pt-4 border-t border-[var(--brand-border)]">
                    <strong class="block text-lg text-[var(--brand-text)]">BNP</strong>
                    <div class="blur-target font-mono font-bold text-xl">< 100</div>
                </div>
              </div>

              <div class="bg-[var(--brand-card)] p-6 rounded-3xl shadow border border-[var(--brand-border)]">
                <div class="text-amber-500 mb-2"><i class="fa-solid fa-martini-glass-citrus fa-xl"></i></div>
                <strong class="block text-lg text-[var(--brand-text)]">ALT / AST</strong>
                <p class="text-sm text-[var(--brand-text-muted)] mb-2">
                    ${t('Función Hepática', 'Liver Function')}
                </p>
                <div class="blur-target font-mono font-bold text-xl">8 - 40 U/L</div>
                
                <div class="mt-4 pt-4 border-t border-[var(--brand-border)]">
                    <strong class="block text-lg text-[var(--brand-text)]">Ammonia</strong>
                    <div class="blur-target font-mono font-bold text-xl">15 - 45</div>
                </div>
              </div>

              <div class="bg-[var(--brand-card)] p-6 rounded-3xl shadow border border-[var(--brand-border)]">
                <div class="text-yellow-500 mb-2"><i class="fa-solid fa-lemon fa-xl"></i></div>
                <strong class="block text-lg text-[var(--brand-text)]">Lipase</strong>
                <p class="text-sm text-[var(--brand-text-muted)] mb-2">Pancreatitis</p>
                <div class="blur-target font-mono font-bold text-xl">< 160</div>
              </div>
            </div>
          </section>
        `;
      },

      // --- 7. Therapeutic Drug Levels ---
      renderDrugLevels() {
        return `
          <section class="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 border border-[var(--brand-border)]">
            <h2 class="text-2xl font-black text-[var(--brand-text)] mb-6">
              ${t('Niveles de Fármacos (Rango Terapéutico)', 'Therapeutic Drug Levels')}
            </h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div class="bg-[var(--brand-card)] p-4 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                <strong class="text-emerald-700 dark:text-emerald-400 block text-lg">Digoxin</strong>
                <div class="blur-target text-2xl font-black mt-2 mb-1">0.5 - 2.0</div>
                <p class="text-xs text-red-500 font-bold mb-1">Toxic > 2.0</p>
              </div>

              <div class="bg-[var(--brand-card)] p-4 rounded-2xl shadow-sm border-l-4 border-blue-500">
                <strong class="text-blue-700 dark:text-blue-400 block text-lg">Lithium</strong>
                <div class="blur-target text-2xl font-black mt-2 mb-1">0.6 - 1.2</div>
                <p class="text-xs text-red-500 font-bold mb-1">Toxic > 1.5</p>
              </div>

              <div class="bg-[var(--brand-card)] p-4 rounded-2xl shadow-sm border-l-4 border-purple-500">
                <strong class="text-purple-700 dark:text-purple-400 block text-lg">Phenytoin</strong>
                <div class="blur-target text-2xl font-black mt-2 mb-1">10 - 20</div>
                <p class="text-xs text-red-500 font-bold mb-1">Toxic > 20</p>
              </div>

              <div class="bg-[var(--brand-card)] p-4 rounded-2xl shadow-sm border-l-4 border-orange-500">
                <strong class="text-orange-700 dark:text-orange-400 block text-lg">Theophylline</strong>
                <div class="blur-target text-2xl font-black mt-2 mb-1">10 - 20</div>
                <p class="text-xs text-red-500 font-bold mb-1">Toxic > 20</p>
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
                <div class="blur-target text-4xl font-black text-slate-800 dark:text-white">1.005 - 1.030</div>
                <div class="flex-1 space-y-2">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-blue-600">Low (< 1.005):</span>
                    <span class="text-sm text-[var(--brand-text)]">
                        ${t('Diluida (DI).', 'Dilute (DI).')}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-amber-600">High (> 1.030):</span>
                    <span class="text-sm text-[var(--brand-text)]">
                        ${t('Concentrada (Deshidratación/SIADH).', 'Concentrated (Dehydration/SIADH).')}
                    </span>
                  </div>
                </div>
              </div>
             </div>
          </section>
        `;
      }
    });
  }
})();