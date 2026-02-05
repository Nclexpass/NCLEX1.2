// 15_integumentary_burns.js — Complete NCLEX Masterclass
// VERSIÓN MAESTRA DEFINITIVA: Burns, Cancer, Wounds & Pharmacology
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Combined & Optimized by Senior Dev Assistant

(function() {
  'use strict';

  // Verificar que el core exista
  if (typeof window.NCLEX === 'undefined') {
      console.error("NCLEX Core not loaded.");
      return;
  }

  // Helper interno de traducción para código más limpio (DRY)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'integumentary',
    title: { es: 'Quemaduras y Tegumentario', en: 'Integumentary & Burns' },
    subtitle: { es: 'Regla de 9s, Parkland, Cáncer y Farmacología', en: 'Rule of 9s, Parkland, Cancer & Pharm' },
    icon: 'fire',
    color: 'orange',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-fire-extinguisher"></i>
                <span class="lang-es">NCLEX High Yield</span>
                <span class="lang-en hidden-lang">NCLEX High Yield</span>
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Sistema Tegumentario', 'Integumentary System')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('Prioridades: Vía Aérea (Inhalación), Reposición de Líquidos (Parkland) y Cáncer de Piel.', 
                    'Priorities: Airway (Inhalation), Fluid Resuscitation (Parkland) & Skin Cancer.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderBurnEmergencies()}
          ${this.renderDepthAndRuleOfNines()}
          ${this.renderParklandFormula()}
          ${this.renderPhasesAndLabs()} 
          ${this.renderWoundCareAndUlcers()}
          ${this.renderSkinDisorders()}
          ${this.renderPharmacology()}
          ${this.renderQuiz()}
        </div>
      `;
    },

    // --- 1. Burn Emergencies ---
    renderBurnEmergencies() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg animate-pulse">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Emergencias en Quemaduras', 'Burn Emergencies')}
            </h2>
          </div>

          <div class="p-6 bg-red-50 dark:bg-red-900/20 rounded-3xl border-l-8 border-red-600 shadow-xl mb-6">
            <div class="flex items-start gap-4">
               <i class="fa-solid fa-lungs-fire text-4xl text-red-600 mt-1"></i>
               <div class="w-full">
                 <strong class="text-xl text-red-800 dark:text-red-300 block mb-2 uppercase">
                   ${t('PRIORIDAD #1: Lesión por Inhalación', 'PRIORITY #1: Inhalation Injury')}
                 </strong>
                 <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
                   ${t('Sospechar si la quemadura ocurrió en espacio cerrado o cara/cuello.', 'Suspect if burn occurred in enclosed space or face/neck.')}
                 </p>
                 
                 <div class="bg-white dark:bg-black/30 p-4 rounded-xl border border-red-200 dark:border-red-800">
                   <strong class="block text-red-600 dark:text-red-400 text-sm mb-2 uppercase">
                     ${t('Signos de Alarma (Intubación Inminente)', 'Red Flags (Imminent Intubation)')}
                   </strong>
                   <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-bold text-gray-800 dark:text-gray-200">
                     <li>• ${t('Pelos nasales chamuscados', 'Singed nasal hairs')}</li>
                     <li>• ${t('Esputo carbonáceo (Hollín)', 'Carbonaceous sputum (Soot)')}</li>
                     <li>• ${t('Estridor / Ronquera', 'Stridor / Hoarseness')}</li>
                     <li>• ${t('Quemaduras faciales/cuello', 'Facial/Neck burns')}</li>
                   </ul>
                 </div>
               </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-5 bg-orange-50 dark:bg-orange-900/10 rounded-3xl border border-orange-200 dark:border-orange-800">
                <strong class="text-orange-800 dark:text-orange-300 block mb-2 flex items-center gap-2">
                    <i class="fa-solid fa-smog"></i>
                    ${t('Intoxicación por Monóxido de Carbono (CO)', 'Carbon Monoxide (CO) Poisoning')}
                </strong>
                <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    ${t('El pulsioxímetro es <strong>INÚTIL</strong> (marca 100% falso). Paciente con piel "rojo cereza" (tardío).', 
                        'Pulse ox is <strong>USELESS</strong> (reads false 100%). Patient has "cherry red" skin (late).')}
                </p>
                <div class="bg-white/50 p-2 rounded text-xs font-bold text-green-700 dark:text-green-400">
                    Tx: ${t('100% Oxígeno (Mascarilla No-Rebreather)', '100% Oxygen (Non-Rebreather mask)')}
                </div>
            </div>

            <div class="p-5 bg-yellow-50 dark:bg-yellow-900/10 rounded-3xl border border-yellow-200 dark:border-yellow-800">
                <strong class="text-yellow-800 dark:text-yellow-300 block mb-2 flex items-center gap-2">
                    <i class="fa-solid fa-bolt"></i>
                    ${t('Quemaduras Eléctricas', 'Electrical Burns')}
                </strong>
                <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    ${t('<strong>"Efecto Iceberg"</strong>: Daño interno masivo. Riesgo de Rabdomiólisis (Orina color té).', 
                        '<strong>"Iceberg Effect"</strong>: Massive internal damage. Risk of Rhabdomyolysis (Tea-colored urine).')}
                </p>
                <div class="bg-white/50 p-2 rounded text-xs font-bold text-red-600 dark:text-red-400">
                    Priority: ${t('Monitoreo ECG 24h (Riesgo Fibrilación Ventricular)', 'ECG Monitoring 24h (Risk of V-Fib)')}
                </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. Depth & Rule of Nines ---
    renderDepthAndRuleOfNines() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Profundidad y Regla de los 9s', 'Depth & Rule of Nines')}
            </h2>
          </div>

          <div class="mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto shadow-sm">
            <table class="w-full text-sm text-left">
              <thead class="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200 uppercase text-xs">
                <tr>
                  <th class="p-3">Degree</th>
                  <th class="p-3">Layer</th>
                  <th class="p-3">Appearance/Pain</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="p-3 font-bold">1st (Superficial)</td>
                  <td class="p-3">Epidermis</td>
                  <td class="p-3">Pink/Red, Dry, <span class="text-red-500 font-bold">Painful</span>. (Sunburn).</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold">2nd (Partial)</td>
                  <td class="p-3">Epidermis + Dermis</td>
                  <td class="p-3">Red, Weeping, <span class="text-red-500 font-bold">Blisters</span>, Very Painful.</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold">3rd (Full)</td>
                  <td class="p-3">SubQ / Fat</td>
                  <td class="p-3">Waxy White, Charred. <span class="text-blue-600 font-bold">PAINLESS</span> (nerves dead).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-orange-200 dark:border-orange-800 shadow-lg">
               <strong class="block text-center text-gray-500 mb-4 uppercase text-xs font-bold tracking-widest">Adult Body Surface Area (TBSA)</strong>
               <ul class="space-y-4 text-sm md:text-base">
                 <li class="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                   <span class="text-gray-600 dark:text-gray-400 font-medium">${t('Cabeza (Total)', 'Head (Total)')}</span>
                   <strong class="text-orange-600 dark:text-orange-400 text-lg">9%</strong>
                   <span class="text-xs text-gray-400">(4.5% Front / 4.5% Back)</span>
                 </li>
                 <li class="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                   <span class="text-gray-600 dark:text-gray-400 font-medium">${t('Torso (Total)', 'Torso (Total)')}</span>
                   <strong class="text-orange-600 dark:text-orange-400 text-lg">36%</strong>
                   <span class="text-xs text-gray-400">(18% Chest / 18% Back)</span>
                 </li>
                 <li class="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                   <span class="text-gray-600 dark:text-gray-400 font-medium">${t('Brazos (Cada uno)', 'Arms (Each)')}</span>
                   <strong class="text-orange-600 dark:text-orange-400 text-lg">9%</strong>
                   <span class="text-xs text-gray-400">(4.5% Front / 4.5% Back)</span>
                 </li>
                 <li class="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                   <span class="text-gray-600 dark:text-gray-400 font-medium">${t('Piernas (Cada una)', 'Legs (Each)')}</span>
                   <strong class="text-orange-600 dark:text-orange-400 text-lg">18%</strong>
                   <span class="text-xs text-gray-400">(9% Front / 9% Back)</span>
                 </li>
                 <li class="flex justify-between">
                   <span class="text-gray-600 dark:text-gray-400 font-medium">${t('Perineo', 'Perineum')}</span>
                   <strong class="text-orange-600 dark:text-orange-400 text-lg">1%</strong>
                 </li>
               </ul>
            </div>
            
            <div class="flex flex-col gap-4">
                <div class="bg-orange-50 dark:bg-orange-900/10 p-5 rounded-3xl border border-orange-200 dark:border-orange-800">
                   <strong class="text-orange-800 dark:text-orange-300 block mb-2 text-center text-lg">
                     ${t('Ejemplo Práctico NCLEX', 'NCLEX Practice Example')}
                   </strong>
                   <p class="text-sm text-gray-700 dark:text-gray-300 text-center mb-4">
                     ${t('Paciente con quemaduras en <strong>toda la espalda</strong>, <strong>brazo derecho completo</strong> y <strong>parte posterior de pierna izquierda</strong>.', 
                         'Patient with burns on <strong>entire back</strong>, <strong>entire right arm</strong>, and <strong>posterior left leg</strong>.')}
                   </p>
                   <div class="flex justify-center gap-2 text-xl font-black text-gray-800 dark:text-white">
                     <span>18%</span> <span class="text-gray-400">+</span> 
                     <span>9%</span> <span class="text-gray-400">+</span> 
                     <span>9%</span> <span class="text-gray-400">=</span> 
                     <span class="text-orange-600 text-3xl">36%</span>
                   </div>
                </div>
                <div class="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 text-xs">
                    <strong class="text-yellow-700">NCLEX TRAP:</strong>
                    ${t('No incluyas quemaduras de 1er grado (eritema) en el cálculo.', 'Do NOT include 1st degree burns (erythema) in calculation.')}
                </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 3. Parkland Formula ---
    renderParklandFormula() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Fórmula de Parkland', 'Parkland Formula')}
            </h2>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-200 dark:border-blue-800 shadow-lg">
            <div class="text-center mb-6">
              <strong class="text-3xl md:text-4xl text-blue-700 dark:text-blue-300 font-black tracking-tight">
                4 mL x kg x %TBSA
              </strong>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                ${t('= Volumen Total de Lactato Ringer (LR) para 24 horas.', '= Total Volume of Lactated Ringers (LR) for 24 hours.')}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white dark:bg-black/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800 relative">
                <div class="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <strong class="text-blue-800 dark:text-blue-300 block mb-2">
                  ${t('Primeras 8 Horas', 'First 8 Hours')}
                </strong>
                <p class="text-lg font-bold text-gray-800 dark:text-gray-200">
                  ${t('50% del Total', '50% of Total')}
                </p>
                <div class="mt-3 p-2 bg-red-100 dark:bg-red-900/30 rounded text-xs font-bold text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                  <i class="fa-solid fa-clock mr-1"></i>
                  ${t('El reloj empieza a la hora de la QUEMADURA, no a la llegada.', 'Time starts from time of INJURY, not arrival.')}
                </div>
              </div>

              <div class="bg-white dark:bg-black/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800 relative">
                <div class="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <strong class="text-blue-800 dark:text-blue-300 block mb-2">
                  ${t('Siguientes 16 Horas', 'Next 16 Hours')}
                </strong>
                <p class="text-lg font-bold text-gray-800 dark:text-gray-200">
                  ${t('50% Restante', 'Remaining 50%')}
                </p>
              </div>
            </div>
            
            <div class="mt-6 text-center">
               <span class="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-bold border border-green-200 dark:border-green-800">
                 <i class="fa-solid fa-check-circle mr-2"></i>
                 ${t('Meta: Orina &ge; 30 mL/hr', 'Goal: Urine &ge; 30 mL/hr')}
               </span>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Phases & Labs (Restored from V7.2) ---
    renderPhasesAndLabs() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Fases y Electrolitos', 'Phases & Electrolytes')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border-l-8 border-l-red-500 border border-gray-200 dark:border-brand-border shadow-lg">
              <div class="flex justify-between items-center mb-4">
                <strong class="text-lg text-red-700 dark:text-red-400">1. Resuscitative (0-72h)</strong>
              </div>
              <p class="text-sm text-gray-500 mb-4 italic">${t('Shock Hipovolémico / Tercer Espacio', 'Hypovolemic Shock / Third Spacing')}</p>
              
              <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li class="flex items-start">
                  <i class="fa-solid fa-arrow-up text-red-500 mt-1 mr-2"></i>
                  <div>
                    <strong>Potassium (K+):</strong> <span class="text-red-600 font-bold">ALTO / HIGH</span>
                    <span class="block text-xs text-gray-500">${t('Células destruidas liberan K+.', 'Destroyed cells release K+.')}</span>
                  </div>
                </li>
                <li class="flex items-start">
                  <i class="fa-solid fa-arrow-down text-blue-500 mt-1 mr-2"></i>
                  <div>
                    <strong>Sodium (Na+):</strong> <span class="text-blue-600 font-bold">BAJO / LOW</span>
                    <span class="block text-xs text-gray-500">${t('Atrapado en edema.', 'Trapped in edema.')}</span>
                  </div>
                </li>
                <li class="flex items-start">
                  <i class="fa-solid fa-arrow-up text-red-500 mt-1 mr-2"></i>
                  <div>
                    <strong>Hct/Hgb:</strong> <span class="text-red-600 font-bold">ALTO / HIGH</span>
                    <span class="block text-xs text-gray-500">${t('Hemoconcentración.', 'Hemoconcentration.')}</span>
                  </div>
                </li>
              </ul>
            </div>

            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border-l-8 border-l-blue-500 border border-gray-200 dark:border-brand-border shadow-lg">
              <div class="flex justify-between items-center mb-4">
                <strong class="text-lg text-blue-700 dark:text-blue-400">2. Acute/Diuretic (3-7 days)</strong>
              </div>
              <p class="text-sm text-gray-500 mb-4 italic">${t('Diuresis / Retorno de fluidos', 'Diuresis / Fluid shifts back')}</p>
              
              <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li class="flex items-start">
                  <i class="fa-solid fa-arrow-down text-blue-500 mt-1 mr-2"></i>
                  <div>
                    <strong>Potassium (K+):</strong> <span class="text-blue-600 font-bold">BAJO / LOW</span>
                    <span class="block text-xs text-gray-500">${t('Pérdida por orina. Retorno a células.', 'Lost in urine. Moves back to cells.')}</span>
                  </div>
                </li>
                 <li class="flex items-start">
                  <i class="fa-solid fa-arrow-down text-blue-500 mt-1 mr-2"></i>
                  <div>
                    <strong>Hct/Hgb:</strong> <span class="text-blue-600 font-bold">BAJO / LOW</span>
                    <span class="block text-xs text-gray-500">${t('Hemodilución.', 'Hemodilution.')}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 5. Wound Care & Ulcers (Merged V7.2 & V8) ---
    renderWoundCareAndUlcers() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Úlceras y Cuidado de Heridas', 'Pressure Ulcers & Wound Care')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800">
                <strong class="text-red-700 dark:text-red-300 block mb-1">Stage 1</strong>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  ${t('Piel intacta. <strong>NO blanqueable</strong>.', 'Intact skin. <strong>Non-blanchable</strong> redness.')}
                </p>
             </div>
             <div class="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800">
                <strong class="text-orange-700 dark:text-orange-300 block mb-1">Stage 2</strong>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  ${t('Pérdida parcial. <strong>Ampolla</strong>. Lecho rojo.', 'Partial loss. <strong>Blister</strong>. Red bed.')}
                </p>
             </div>
             <div class="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-200 dark:border-yellow-800">
                <strong class="text-yellow-700 dark:text-yellow-300 block mb-1">Stage 3</strong>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  ${t('Pérdida total piel. <strong>Grasa visible</strong>. Sin hueso.', 'Full thickness. <strong>Fat visible</strong>. No bone.')}
                </p>
             </div>
             <div class="p-4 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                <strong class="text-stone-700 dark:text-stone-300 block mb-1">Stage 4</strong>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  ${t('<strong>Hueso/Músculo visible</strong>.', '<strong>Bone/Muscle visible</strong>.')}
                </p>
             </div>
          </div>

          <div class="p-5 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-800">
             <strong class="text-lg text-green-800 dark:text-green-300 block mb-2">
                 ${t('Injertos de Piel (Skin Grafts)', 'Skin Grafts')}
             </strong>
             <ul class="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Autograft:</strong> ${t('Del propio paciente (Permanente).', 'From patient (Permanent).')}</li>
                <li><strong>Homograft/Allograft:</strong> ${t('De cadáver (Temporal).', 'From cadaver (Temporary).')}</li>
                <li><strong>Xenograft:</strong> ${t('De animal/cerdo (Temporal).', 'From animal/pig (Temporary).')}</li>
                <li class="pt-2 border-t border-green-200 dark:border-green-800">
                    <strong>NCLEX Care:</strong> ${t('Inmovilizar sitio injerto 3-7 días. Elevar extremidad. Dieta alta en Proteína y Vitamina C.', 'Immobilize graft site 3-7 days. Elevate. High Protein/Vit C diet.')}
                </li>
             </ul>
          </div>
        </section>
      `;
    },

    // --- 6. Skin Disorders & Cancer ---
    renderSkinDisorders() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-pink-600 flex items-center justify-center text-white font-black text-xl shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Cáncer y Trastornos', 'Cancer & Disorders')}
            </h2>
          </div>

          <div class="mb-8 bg-purple-50 dark:bg-purple-900/10 p-5 rounded-3xl border border-purple-200 dark:border-purple-800">
             <h3 class="text-center text-purple-800 dark:text-purple-300 font-bold mb-4">Melanoma Assessment: ABCDE</h3>
             <div class="flex justify-between text-center text-sm md:text-base">
                <div><strong class="block text-2xl text-purple-600">A</strong>${t('Asimetría','Asymmetry')}</div>
                <div><strong class="block text-2xl text-purple-600">B</strong>${t('Bordes','Border')}</div>
                <div><strong class="block text-2xl text-purple-600">C</strong>${t('Color','Color')}</div>
                <div><strong class="block text-2xl text-purple-600">D</strong>${t('Diámetro','Diameter')}</div>
                <div><strong class="block text-2xl text-purple-600">E</strong>${t('Evolución','Evolving')}</div>
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="p-5 bg-white dark:bg-brand-card rounded-2xl shadow-sm border border-gray-200 dark:border-brand-border">
               <strong class="text-lg text-pink-700 dark:text-pink-400 block mb-2">Psoriasis</strong>
               <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                 ${t('Autoinmune. Placas plateadas sobre base roja.', 'Autoimmune. Silver plaques on red base.')}
               </p>
               <div class="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded text-gray-700 dark:text-gray-300">
                 <span class="text-red-500 font-bold">NO rascar / DO NOT scratch.</span> Tx: UV Light, Methotrexate.
               </div>
             </div>

             <div class="p-5 bg-white dark:bg-brand-card rounded-2xl shadow-sm border border-gray-200 dark:border-brand-border">
               <strong class="text-lg text-red-700 dark:text-red-400 block mb-2">Herpes Zoster (Shingles)</strong>
               <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                 ${t('Reactivación varicela. Vesículas dolorosas a lo largo de un <strong>dermatoma</strong>.', 'Varicella reactivation. Painful vesicles along <strong>dermatome</strong>.')}
               </p>
               <div class="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded text-red-800 dark:text-red-200 font-bold">
                 ${t('AÉREA + CONTACTO (si abierto). NO embarazadas.', 'AIRBORNE + CONTACT (if open). NO pregnant staff.')}
               </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 7. Pharmacology ---
    renderPharmacology() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white font-black text-xl shadow-lg">7</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Farmacología', 'Pharmacology')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="p-5 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-800">
               <div class="flex justify-between items-start">
                 <strong class="text-lg text-green-800 dark:text-green-300">Isotretinoin (Accutane)</strong>
                 <span class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-black uppercase">Teratogen X</span>
               </div>
               <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-2 font-medium mt-3">
                 <li><i class="fa-solid fa-check text-green-500 mr-1"></i> ${t('<strong>iPLEDGE:</strong> 2 métodos anticonceptivos. Tests embarazo mensuales (-).', '<strong>iPLEDGE:</strong> 2 forms of contraception. Monthly negative preg tests.')}</li>
                 <li><i class="fa-solid fa-ban text-red-500 mr-1"></i> ${t('NO donar sangre. NO Vitamina A extra.', 'NO blood donation. NO extra Vit A.')}</li>
                 <li><i class="fa-solid fa-sun text-orange-500 mr-1"></i> ${t('Fotosensibilidad / Ojos secos.', 'Photosensitivity / Dry eyes.')}</li>
               </ul>
             </div>

             <div class="p-5 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-200 dark:border-yellow-800">
               <strong class="text-lg text-yellow-800 dark:text-yellow-300">Tetracyclines (Doxycycline)</strong>
               <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-2 font-medium mt-3">
                 <li><i class="fa-solid fa-sun text-yellow-600 mr-1"></i> ${t('Fotosensibilidad Severa.', 'Severe Photosensitivity.')}</li>
                 <li><i class="fa-solid fa-ban text-red-500 mr-1"></i> ${t('Estómago vacío. NO lácteos/hierro/antiácidos.', 'Empty stomach. NO dairy/iron/antacids.')}</li>
                 <li><i class="fa-solid fa-child text-red-500 mr-1"></i> ${t('NO embarazo/niños <8 años (Mancha dientes).', 'NO pregnancy/kids <8 (Teeth staining).')}</li>
               </ul>
             </div>
          </div>
        </section>
      `;
    },

    // --- 8. Mini-Quiz (Restored from V7.2) ---
    renderQuiz() {
      return `
        <div class="mt-12 bg-gray-900 text-white p-6 rounded-3xl border border-gray-700">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <i class="fa-solid fa-clipboard-question text-brand-blue"></i> 
                Quick Review (NCLEX Style)
            </h3>
            <div class="space-y-4 text-sm">
                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('1. ¿Prioridad en quemaduras de cara/cuello?', '1. Priority assessment for face/neck burns?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-brand-blue">
                        <strong>Airway Patency.</strong> Risk of laryngeal edema. Intubate early if stridor/soot present.
                    </div>
                </details>
                
                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                         ${t('2. Cálculo Parkland: 70kg, 40% TBSA. ¿Tasa primeras 8h?', '2. Parkland Calculation: 70kg, 40% TBSA. First 8h rate?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-brand-blue">
                        <strong>Total: 11,200 mL. First 8h: 5,600 mL → 700 mL/hr.</strong>
                    </div>
                </details>

                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('3. ¿Requisito para dispensar Isotretinoína?', '3. Requirement for dispensing Isotretinoin?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-brand-blue">
                         <strong>iPLEDGE:</strong> 2 negative pregnancy tests, 2 forms of contraception.
                    </div>
                </details>

                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('4. ¿Aislamiento para herpes zóster localizado y abierto?', '4. Isolation for localized open shingles?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-brand-blue">
                        <strong>Airborne + Contact</strong> (until crusted). Pregnant staff should not enter.
                    </div>
                </details>
            </div>
        </div>
      `;
    }
  });
})();