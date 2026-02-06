// 06_respiratory.js — Respiratory Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: Synthesized Technical & Clinical Excellence
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026 (Updated Visuals)
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // Helper interno para traducción eficiente
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'respiratory',
    title: { es: 'Sistema Respiratorio', en: 'Respiratory System' },
    subtitle: { es: 'Gases, Emergencias y Ventiladores', en: 'ABGs, Emergencies & Vents' },
    icon: 'lungs',
    color: 'sky',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-lungs"></i>
                <span class="lang-es">Prioridad Nivel 1</span>
                <span class="lang-en hidden-lang">Priority Level 1</span>
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                <span class="lang-es">Enfermería Respiratoria</span>
                <span class="lang-en hidden-lang">Respiratory Nursing</span>
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                <span class="lang-es">Vía Aérea, Intercambio de Gases, Farmacología y Seguridad.</span>
                <span class="lang-en hidden-lang">Airway, Gas Exchange, Pharmacology & Safety.</span>
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderAssessment()}
          ${this.renderDiagnostics()}
          ${this.renderEmergencies()}
          ${this.renderPathologies()}
          ${this.renderProcedures()}
          ${this.renderPharmacology()}
        </div>
      `;
    },

    // --- 1. Assessment (RAT BED CLAMP) ---
    renderAssessment() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Valoración de Hipoxia', 'Hypoxia Assessment')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white dark:bg-brand-card rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-brand-border">
              <h3 class="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-dog"></i> Mnemonic: RAT BED CLAMP
              </h3>
              <div class="space-y-4">
                <div class="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-2xl border-l-4 border-yellow-500">
                  <strong class="block text-yellow-800 dark:text-yellow-300 mb-1 uppercase text-xs tracking-wide">
                    ${t('SIGNOS TEMPRANOS (RAT)', 'EARLY SIGNS (RAT)')}
                  </strong>
                  <ul class="text-sm font-bold text-gray-800 dark:text-gray-200 space-y-1">
                    <li><span class="text-red-600">R</span> - ${t('Restlessness (Inquietud)', 'Restlessness')}</li>
                    <li><span class="text-red-600">A</span> - ${t('Anxiety (Ansiedad)', 'Anxiety')}</li>
                    <li><span class="text-red-600">T</span> - ${t('Tachycardia / Tachypnea', 'Tachycardia / Tachypnea')}</li>
                  </ul>
                </div>
                <div class="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border-l-4 border-orange-500">
                  <strong class="block text-orange-800 dark:text-orange-300 mb-1 uppercase text-xs tracking-wide">
                    ${t('EN PROGRESO (BED)', 'PROGRESSING (BED)')}
                  </strong>
                  <ul class="text-sm font-bold text-gray-800 dark:text-gray-200 space-y-1">
                    <li><span class="text-orange-600">B</span> - ${t('Bradycardia (Bradicardia)', 'Bradycardia')}</li>
                    <li><span class="text-orange-600">E</span> - ${t('Extreme Restlessness (Confusión)', 'Extreme Restlessness / Confusion')}</li>
                    <li><span class="text-orange-600">D</span> - ${t('Dyspnea (Severa)', 'Dyspnea (Severe)')}</li>
                  </ul>
                </div>
                <div class="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border-l-4 border-red-500">
                  <strong class="block text-red-800 dark:text-red-300 mb-1 uppercase text-xs tracking-wide">
                    ${t('SIGNOS TARDÍOS (CLAMP)', 'LATE SIGNS (CLAMP)')}
                  </strong>
                  <ul class="text-sm font-bold text-gray-800 dark:text-gray-200 space-y-1">
                    <li><span class="text-red-700">C</span> - ${t('Cyanosis (Central)', 'Cyanosis (Central)')}</li>
                    <li><span class="text-red-700">L</span> - ${t('Lethargy (Letargo)', 'Lethargy')}</li>
                    <li><span class="text-red-700">A</span> - ${t('Altered Mental Status', 'Altered Mental Status')}</li>
                    <li><span class="text-red-700">M</span> - ${t('Mottled skin (Piel moteada)', 'Mottled skin')}</li>
                    <li><span class="text-red-700">P</span> - ${t('Poor perfusion (Hipotensión)', 'Poor perfusion')}</li>
                  </ul>
                </div>
              </div>
              <p class="mt-4 text-xs text-center text-red-500 font-bold">
                ${t('* Cianosis es un signo TARDÍO. Evaluar siempre signos tempranos.', '* Cyanosis is a LATE sign. Always assess early signs.')}
              </p>
            </div>

            <div class="bg-white dark:bg-brand-card rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-brand-border">
              <h3 class="text-xl font-bold text-indigo-600 mb-4">
                ${t('Sonidos Pulmonares', 'Lung Sounds')}
              </h3>
              <ul class="space-y-4">
                <li class="flex items-start gap-3">
                  <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase w-20 text-center flex-shrink-0">Crackles</span>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <strong class="block text-gray-900 dark:text-white">Fluid (CHF, Pneumonia)</strong>
                    ${t('Estertores (como velcro). Tx: Diuréticos, Fowler.', 'Fine/Coarse sound (Velcro). Tx: Diuretics, Fowler\'s.')}
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold uppercase w-20 text-center flex-shrink-0">Wheeze</span>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <strong class="block text-gray-900 dark:text-white">Narrow Airway (Asthma)</strong>
                    ${t('Sibilancias musicales. Tx: Broncodilatadores.', 'Musical whistle. Tx: Bronchodilators.')}
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase w-20 text-center flex-shrink-0">Stridor</span>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <strong class="block text-red-600 dark:text-red-400">OBSTRUCTION (Emergency)</strong>
                    ${t('Sonido agudo INSPIRATORIO. ¡Intubación!', 'High-pitched INSPIRATORY. Intubate!')}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. Diagnostics (ROME - Clean Visual Design) ---
    renderDiagnostics() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white font-black text-lg shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">ABG Interpretation (ROME)</h2>
          </div>

          <div class="bg-sky-50 dark:bg-sky-900/10 p-6 rounded-3xl border border-sky-200 dark:border-sky-800 shadow-lg mb-6">
             <div class="grid md:grid-cols-2 gap-8 items-start">
                
                <div class="flex flex-col gap-4">
                   <div class="text-center mb-2">
                       <h3 class="text-4xl font-black text-sky-700 dark:text-sky-300 tracking-widest">R.O.M.E.</h3>
                       <p class="text-xs text-sky-600 dark:text-sky-400 font-bold uppercase">Method</p>
                   </div>
                   
                   <div class="bg-white dark:bg-brand-card p-4 rounded-xl border-l-4 border-sky-500 shadow-sm flex items-center gap-4">
                       <div class="bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 w-12 h-12 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0">RO</div>
                       <div>
                           <strong class="block text-gray-900 dark:text-white">Respiratory Opposite</strong>
                           <div class="flex gap-2 mt-1">
                               <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">pH <i class="fa-solid fa-arrow-up text-green-500"></i> PCO2 <i class="fa-solid fa-arrow-down text-red-500"></i></span>
                               <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">pH <i class="fa-solid fa-arrow-down text-red-500"></i> PCO2 <i class="fa-solid fa-arrow-up text-green-500"></i></span>
                           </div>
                       </div>
                   </div>

                   <div class="bg-white dark:bg-brand-card p-4 rounded-xl border-l-4 border-sky-500 shadow-sm flex items-center gap-4">
                       <div class="bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 w-12 h-12 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0">ME</div>
                       <div>
                           <strong class="block text-gray-900 dark:text-white">Metabolic Equal</strong>
                           <div class="flex gap-2 mt-1">
                               <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">pH <i class="fa-solid fa-arrow-up text-green-500"></i> HCO3 <i class="fa-solid fa-arrow-up text-green-500"></i></span>
                               <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">pH <i class="fa-solid fa-arrow-down text-red-500"></i> HCO3 <i class="fa-solid fa-arrow-down text-red-500"></i></span>
                           </div>
                       </div>
                   </div>
                </div>
                
                <div class="space-y-3 text-sm">
                   <div class="p-4 bg-white dark:bg-brand-card rounded-xl border-l-4 border-blue-500 shadow-sm">
                      <strong class="block text-blue-700 dark:text-blue-400 text-base mb-1">Respiratory Acidosis (pH ↓ CO2 ↑)</strong>
                      <span class="text-gray-600 dark:text-gray-400 text-xs">
                        ${t('<strong>Causa:</strong> Hipoventilación, EPOC, Opioides.', '<strong>Cause:</strong> Hypoventilation, COPD, Opioids.')}
                      </span>
                   </div>
                   <div class="p-4 bg-white dark:bg-brand-card rounded-xl border-l-4 border-red-500 shadow-sm">
                      <strong class="block text-red-700 dark:text-red-400 text-base mb-1">Metabolic Acidosis (pH ↓ HCO3 ↓)</strong>
                      <span class="text-gray-600 dark:text-gray-400 text-xs">
                        ${t('<strong>Causa:</strong> Diarrea ("Ass-idosis"), DKA, Falla Renal.', '<strong>Cause:</strong> Diarrhea ("Ass-idosis"), DKA, Renal Failure.')}
                      </span>
                   </div>
                   
                   <div class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                     <strong class="text-amber-700 dark:text-amber-300 block mb-1">NCLEX Compensation Trick:</strong>
                     <p class="text-xs text-gray-700 dark:text-gray-300">
                       ${t('Si pH es NORMAL pero PaCO2 y HCO3 ANORMALES → Compensado.<br>Si pH es ANORMAL y solo UNO es anormal → Sin compensar.',
                           'If pH NORMAL but PaCO2 & HCO3 ABNORMAL → Compensated.<br>If pH ABNORMAL and only ONE abnormal → Uncompensated.')}
                     </p>
                   </div>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 3. Emergencies (PE, Pneumothorax, ARDS) ---
    renderEmergencies() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white font-black text-lg shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Emergencias Agudas', 'Acute Emergencies')}
            </h2>
          </div>

          <div class="mb-6 bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-200 dark:border-red-800 shadow-md">
            <div class="flex items-center gap-3 mb-4">
               <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600"><i class="fa-solid fa-clot"></i></div>
               <h3 class="text-xl font-black text-red-800 dark:text-red-300">Pulmonary Embolism (PE)</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <strong class="block text-gray-900 dark:text-white mb-2 text-sm uppercase">Signs (The S's)</strong>
                <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li class="flex items-center gap-2"><i class="fa-solid fa-bolt text-yellow-500"></i> ${t('<strong>Súbito</strong> dolor de pecho', '<strong>Sudden</strong> chest pain')}</li>
                  <li class="flex items-center gap-2"><i class="fa-solid fa-lungs text-blue-500"></i> ${t('<strong>Shortness</strong> (Falta) de aire', '<strong>Shortness</strong> of breath')}</li>
                  <li class="flex items-center gap-2"><i class="fa-solid fa-heart-pulse text-red-500"></i> <strong>SpO2 ↓</strong> (Hypoxemia)</li>
                  <li class="flex items-center gap-2"><i class="fa-solid fa-skull text-gray-500"></i> ${t('Sensación de muerte', 'Impending doom')}</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-brand-card p-4 rounded-xl border border-red-100 dark:border-red-800/50">
                <strong class="block text-red-600 dark:text-red-400 mb-2 text-sm uppercase">Nursing Actions (ABCDE)</strong>
                <ol class="list-decimal list-inside text-sm font-bold text-gray-800 dark:text-gray-200 space-y-2">
                  <li><strong>A</strong>irway & <strong>O2</strong> (15L/min)</li>
                  <li><strong>B</strong>reathing: High Fowler's</li>
                  <li><strong>C</strong>irculation: IV access, ECG</li>
                  <li><strong>D</strong>rugs: Anticoagulants (Heparin/Warfarin)</li>
                  <li><strong>E</strong>valuate: D-dimer, CT Angio</li>
                </ol>
              </div>
              <div class="bg-white dark:bg-brand-card p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                <strong class="block text-blue-600 dark:text-blue-400 mb-2 text-sm uppercase">Risk Factors (VIRCHOW)</strong>
                <p class="text-xs text-gray-700 dark:text-gray-300">
                   Venous stasis (Immobility), Injury to vessels (Surgery), Hypercoagulability (Cancer, OCPs).
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border-l-4 border-orange-500 shadow-sm">
              <strong class="text-lg block text-gray-900 dark:text-white mb-1">Pneumothorax</strong>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2 mt-2">
                <li class="flex items-start gap-2"><i class="fa-solid fa-ban text-red-500 mt-0.5"></i> ${t('<strong>Ausencia ruidos</strong> lado afectado.', '<strong>Absent sounds</strong> affected side.')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-arrow-right text-orange-500 mt-0.5"></i> ${t('<strong>Desviación traqueal</strong> (Tensión).', '<strong>Tracheal deviation</strong> (Tension).')}</li>
              </ul>
            </div>
            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border-l-4 border-gray-600 shadow-sm">
              <strong class="text-lg block text-gray-900 dark:text-white mb-1">ARDS</strong>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2 mt-2">
                <li class="flex items-start gap-2"><i class="fa-solid fa-mask-ventilator text-blue-500 mt-0.5"></i> ${t('<strong>Hipoxemia refractaria</strong> (O2 bajo aunque des 100%).', '<strong>Refractory hypoxemia</strong> (Low O2 despite 100% FiO2).')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-x-ray text-gray-500 mt-0.5"></i> ${t('<strong>White Out</strong> en Rayos-X.', '<strong>White Out</strong> on X-Ray.')}</li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Pathologies ---
    renderPathologies() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Patologías Comunes', 'Common Pathologies')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-200 dark:border-emerald-800">
              <strong class="text-emerald-800 dark:text-emerald-300 text-lg block mb-3">COPD (EPOC)</strong>
              <div class="grid grid-cols-2 gap-2 mb-3">
                <div class="bg-white dark:bg-gray-800 p-2 rounded-lg">
                  <strong class="text-pink-600 text-xs block">Pink Puffers</strong>
                  <span class="text-[10px] leading-tight block">(Emphysema) Barrel chest, pursed lips.</span>
                </div>
                <div class="bg-white dark:bg-gray-800 p-2 rounded-lg">
                  <strong class="text-blue-600 text-xs block">Blue Bloaters</strong>
                  <span class="text-[10px] leading-tight block">(Bronchitis) Cyanosis, edema.</span>
                </div>
              </div>
              <ul class="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <li>${t('<strong>Retenedor CO2:</strong> Estímulo = Hipoxia.', '<strong>CO2 Retainer:</strong> Drive = Hypoxia.')}</li>
                <li>${t('<strong>Pursed Lip Breathing:</strong> Saca CO2.', '<strong>Pursed Lip Breathing:</strong> Expels CO2.')}</li>
              </ul>
            </div>

            <div class="p-5 bg-pink-50 dark:bg-pink-900/10 rounded-3xl border border-pink-200 dark:border-pink-800">
              <strong class="text-pink-800 dark:text-pink-300 text-lg block mb-3">Asthma</strong>
              <ul class="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <li class="font-bold text-red-600 dark:text-red-400">
                    <i class="fa-solid fa-bell-slash mr-1"></i> 
                    ${t('Silent Chest = Fallo Respiratorio.', 'Silent Chest = Resp Failure.')}
                </li>
                <li>${t('<strong>Triggers:</strong> Alérgenos, estrés, frío.', '<strong>Triggers:</strong> Allergens, stress, cold.')}</li>
                <li>${t('<strong>Tx Agudo (AIM):</strong> Albuterol, Ipratropium, Methylprednisolone.', '<strong>Acute Tx (AIM):</strong> Albuterol, Ipratropium, Methylprednisolone.')}</li>
              </ul>
            </div>

            <div class="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-200 dark:border-blue-800">
              <strong class="text-blue-800 dark:text-blue-300 text-lg block mb-3">Pneumonia</strong>
              <ul class="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <li>${t('<strong>Síntomas:</strong> Fiebre, esputo verde/amarillo.', '<strong>Sx:</strong> Fever, green/yellow sputum.')}</li>
                <li>${t('<strong>Ancianos:</strong> CONFUSIÓN es signo #1.', '<strong>Elderly:</strong> CONFUSION is sign #1.')}</li>
                <li>${t('<strong>Intervención:</strong> Cultivo ANTES de antibióticos.', '<strong>Intervention:</strong> Culture BEFORE antibiotics.')}</li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 5. Procedures ---
    renderProcedures() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white font-black text-lg shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Tubos y Ventiladores', 'Tubes & Vents')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="font-bold text-teal-700 dark:text-teal-400 mb-3 text-lg">Chest Tube (Water Seal)</h3>
              <div class="space-y-3 mt-4">
                 <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Tidaling (Olas)</span>
                    <span class="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">NORMAL</span>
                 </div>
                 <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                        <span class="text-sm text-gray-700 dark:text-gray-300">Continuous Bubbling</span>
                        <div class="text-[10px] text-gray-500">${t('En sello de agua', 'In water seal')}</div>
                    </div>
                    <span class="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded">AIR LEAK</span>
                 </div>
                 
                 <div class="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl text-sm">
                    <strong class="block text-red-700 dark:text-red-400 mb-1 uppercase text-xs">Emergency: Tube Out?</strong>
                    <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 text-xs space-y-1">
                        <li>${t('Cubrir con gasa vaselinada.', 'Cover with petroleum gauze.')}</li>
                        <li>${t('Fijar en <strong>3 lados</strong>.', 'Tape on <strong>3 sides</strong>.')}</li>
                        <li>${t('<strong>NUNCA CLAMPAR</strong> (riesgo tensión).', '<strong>NEVER CLAMP</strong> (tension risk).')}</li>
                        <li>${t('Si desconectado del sistema: meter en agua estéril.', 'If disconnected from system: put in sterile water.')}</li>
                    </ol>
                 </div>
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="font-bold text-indigo-700 dark:text-indigo-400 mb-3 text-lg">Ventilator Alarms (HOLD)</h3>
              <div class="space-y-4">
                 <div class="flex gap-3">
                    <div class="bg-purple-100 text-purple-700 w-10 h-10 flex items-center justify-center rounded-xl font-black text-lg">H</div>
                    <div>
                        <strong class="block text-gray-900 dark:text-white">High Pressure</strong>
                        <span class="text-xs text-gray-500 uppercase font-bold">OBSTRUCTION</span>
                        <p class="text-xs text-gray-600 dark:text-gray-400">${t('Morder tubo, secreciones, acodamiento.', 'Biting, secretions, kink.')}</p>
                    </div>
                 </div>
                 <div class="flex gap-3">
                    <div class="bg-blue-100 text-blue-700 w-10 h-10 flex items-center justify-center rounded-xl font-black text-lg">L</div>
                    <div>
                        <strong class="block text-gray-900 dark:text-white">Low Pressure</strong>
                        <span class="text-xs text-gray-500 uppercase font-bold">DISCONNECTION</span>
                        <p class="text-xs text-gray-600 dark:text-gray-400">${t('Fuga de cuff, extubación.', 'Cuff leak, extubation.')}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 6. Pharmacology (RIPE) ---
    renderPharmacology() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-lg shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Farmacología (TB - RIPE)', 'Pharmacology (TB - RIPE)')}
            </h2>
          </div>

          <div class="bg-gray-100 dark:bg-gray-800 rounded-2xl p-5 border border-gray-300 dark:border-gray-700">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
               <div class="bg-white dark:bg-gray-900 p-3 rounded-lg">
                 <strong class="text-orange-600 block">R - Rifampin</strong>
                 <p class="text-xs mt-1 leading-tight">
                   ${t('Fluidos naranjas. Interfiere con anticonceptivos.', 'Orange fluids. Interacts with OCPs.')}
                 </p>
                 <strong class="text-[10px] text-red-500 block mt-1 uppercase">Hepatotoxic</strong>
               </div>
               <div class="bg-white dark:bg-gray-900 p-3 rounded-lg">
                 <strong class="text-yellow-600 block">I - Isoniazid</strong>
                 <p class="text-xs mt-1 leading-tight">
                   ${t('Neuropatía. Tomar con Vitamina B6.', 'Neuropathy. Take with Vit B6.')}
                 </p>
                 <strong class="text-[10px] text-red-500 block mt-1 uppercase">Hepatotoxic</strong>
               </div>
               <div class="bg-white dark:bg-gray-900 p-3 rounded-lg">
                 <strong class="text-gray-600 block">P - Pyrazinamide</strong>
                 <p class="text-xs mt-1 leading-tight">
                   ${t('Gota (Ácido úrico). Beber agua.', 'Gout (Uric acid). Drink water.')}
                 </p>
                 <strong class="text-[10px] text-red-500 block mt-1 uppercase">Hepatotoxic</strong>
               </div>
               <div class="bg-white dark:bg-gray-900 p-3 rounded-lg">
                 <strong class="text-green-600 block">E - Ethambutol</strong>
                 <p class="text-xs mt-1 leading-tight">
                   ${t('Ojos (Eyes). Reportar cambios visión.', 'Eyes. Report vision changes.')}
                 </p>
               </div>
            </div>
            <div class="mt-4 text-center text-xs text-gray-500 italic">
               ${t('Tratamiento 6-9 meses. No alcohol.', 'Tx 6-9 months. No alcohol.')}
            </div>
          </div>
        </section>
      `;
    }
  });
})();