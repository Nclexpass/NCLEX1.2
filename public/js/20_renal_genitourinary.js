// 20_renal_genitourinary_MASTER.js — Renal & Genitourinary Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: Fusión de Arquitectura Eficiente + Contenido Completo
// CREADO POR REYNIER DIAZ GERONES
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // Helper interno para manejo bilingüe eficiente (DRY Architecture)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'renal',
    title: { es: 'Renal y Genitourinario', en: 'Renal & Genitourinary' },
    subtitle: { es: 'Fallo Renal, Diálisis, Electrolitos y Farmacología', en: 'Kidney Failure, Dialysis, Electrolytes & Pharmacology' },
    icon: 'filter',
    color: 'yellow',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-droplet"></i>
                ${t('Masterclass Renal Integral', 'Comprehensive Renal Masterclass')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Sistema Renal y Genitourinario', 'Renal & Genitourinary System')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('AKI vs CKD, Manejo de Electrolitos, Diálisis, Dietas y Farmacología.', 'AKI vs CKD, Electrolyte Management, Dialysis, Diets & Pharmacology.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderLabsAssessment()}
          ${this.renderRenalFailure()}
          ${this.renderAKIvsCKD()} 
          ${this.renderGlomerularDiseases()} 
          ${this.renderInfections()}
          ${this.renderProcedures()}
          ${this.renderPharmacology()}
          ${this.renderDiet()}
          ${this.renderQuiz()}
        </div>
      `;
    },

    // --- 1. Labs & Assessment ---
    renderLabsAssessment() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Laboratorios Clave y Evaluación', 'Key Labs & Assessment')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-200 dark:border-blue-800">
              <strong class="text-blue-800 dark:text-blue-300 block mb-1 text-lg">Creatinina (0.6 - 1.2 mg/dL)</strong>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                ${t('<strong>El Estándar de Oro.</strong> Mejor indicador de función renal. No se afecta por deshidratación.', '<strong>The Gold Standard.</strong> Best indicator of renal function. Not affected by dehydration.')}
              </p>
              <p class="text-xs text-red-500 font-bold mt-2">↑ Creatinina = ↓ GFR = ${t('Fallo Renal', 'Kidney Failure')}.</p>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-2xl border border-yellow-200 dark:border-yellow-800">
              <strong class="text-yellow-800 dark:text-yellow-300 block mb-1 text-lg">BUN (10 - 20 mg/dL)</strong>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                ${t('Nitrógeno Ureico en Sangre. Aumenta con deshidratación, hemorragia GI, catabolismo.', 'Blood Urea Nitrogen. Increases with dehydration, GI bleed, catabolism.')}
              </p>
              <p class="text-xs text-gray-500 mt-1">${t('Relación BUN:Creatinina normal = 10:1 a 20:1', 'Normal BUN:Creatinine ratio = 10:1 to 20:1')}</p>
            </div>

            <div class="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl border border-purple-200 dark:border-purple-800">
              <strong class="text-purple-800 dark:text-purple-300 block mb-1 text-lg">${t('Gravedad Específica', 'Specific Gravity')}</strong>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">Normal: 1.005 - 1.030</p>
              <ul class="text-xs list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li><strong class="text-red-500">High (>1.030):</strong> ${t('Concentrado (Deshidratación, SIADH)', 'Concentrated (Dehydration, SIADH)')}</li>
                <li><strong class="text-blue-500">Low (<1.005):</strong> ${t('Diluido (Diabetes insípida, Fallo renal)', 'Dilute (Diabetes insipidus, Renal failure)')}</li>
                <li><strong>Fixed (~1.010):</strong> ${t('Pérdida de capacidad de concentración (Daño severo)', 'Loss of concentrating ability (Severe damage)')}</li>
              </ul>
            </div>

            <div class="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-200 dark:border-red-800">
              <strong class="text-red-800 dark:text-red-300 block mb-1 text-lg">${t('Débito Urinario', 'Urine Output')}</strong>
              <div class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <div class="flex justify-between">
                  <span>Normal:</span>
                  <span class="font-bold">30-50 mL/hr</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-red-500">Oliguria:</span>
                  <span class="font-bold text-red-500">< 400 mL/${t('día', 'day')}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-blue-500">Anuria:</span>
                  <span class="font-bold text-blue-500">< 100 mL/${t('día', 'day')}</span>
                </div>
              </div>
              <p class="text-xs text-red-500 font-bold mt-2">< 30 mL/hr = ${t('Distrés renal → Notificar médico.', 'Kidney Distress → Notify MD.')}</p>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. Renal Failure (AKI & Hyperkalemia) ---
    renderRenalFailure() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Insuficiencia Renal Aguda (IRA/AKI)', 'Acute Kidney Injury (AKI)')}
            </h2>
          </div>

          <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg mb-6">
            <h3 class="font-bold text-gray-800 dark:text-white mb-4">
              ${t('Causas de Insuficiencia Renal', 'Causes of Renal Failure')}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
                <strong class="text-blue-700 dark:text-blue-400 block mb-2">Prerrenal (70%)</strong>
                <p class="text-gray-700 dark:text-gray-300">
                  ${t('Disminución de perfusión (Hipovolemia, Shock, HF). Riñón sano pero "seco".', 'Decreased perfusion (Hypovolemia, Shock, HF). Kidney healthy but "dry".')}
                </p>
              </div>
              
              <div class="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <strong class="text-yellow-700 dark:text-yellow-400 block mb-2">Intrarenal (25%)</strong>
                <p class="text-gray-700 dark:text-gray-300">
                  ${t('Daño directo (Nefrotóxicos: Contraste, Vancomicina, Gentamicina).', 'Direct damage (Nephrotoxins: Contrast, Vancomycin, Gentamicin).')}
                </p>
              </div>
              
              <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
                <strong class="text-red-700 dark:text-red-400 block mb-2">Posrenal (5%)</strong>
                <p class="text-gray-700 dark:text-gray-300">
                  ${t('Obstrucción (BPH, Cálculos, Tumores).', 'Obstruction (BPH, Stones, Tumors).')}
                </p>
              </div>
            </div>

            <h3 class="font-bold text-gray-800 dark:text-white mt-6 mb-3">${t('Fases de AKI', 'AKI Phases')}</h3>
            <ul class="space-y-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
              <li class="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border-l-4 border-red-500">
                <strong class="block text-red-700 dark:text-red-400">${t('Fase Oligúrica', 'Oliguric Phase')}</strong>
                ${t('Débito < 400mL/día. Sobrecarga fluidos, edema. <strong class="text-red-600">Hiperpotasemia</strong>, acidosis metabólica.', 'Output < 400mL/day. Fluid overload, edema. <strong class="text-red-600">Hyperkalemia</strong>, metabolic acidosis.')}
              </li>
              <li class="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border-l-4 border-blue-500">
                <strong class="block text-blue-700 dark:text-blue-400">${t('Fase Diurética', 'Diuretic Phase')}</strong>
                ${t('Débito alto (3-5L/día). Riesgo hipovolemia. <strong class="text-blue-600">Hipopotasemia</strong>, hiponatremia.', 'High output (3-5L/day). Hypovolemia risk. <strong class="text-blue-600">Hypokalemia</strong>, hyponatremia.')}
              </li>
            </ul>
          </div>

          <div class="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border-2 border-red-500 relative overflow-hidden">
            <div class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase">
                ${t('EMERGENCIA', 'EMERGENCY')}
            </div>
            <h3 class="text-xl font-black text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
              <i class="fa-solid fa-heart-pulse"></i> Hiperpotasemia (K+ > 5.0 mEq/L)
            </h3>
            
            <div class="mt-4 bg-white dark:bg-black/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
              <strong class="block text-gray-900 dark:text-white text-sm uppercase mb-2">
                ${t('Prioridad de Tratamiento (El Orden Importa)', 'Treatment Priority (Order Matters)')}
              </strong>
              <ol class="list-decimal list-inside text-sm font-bold text-gray-700 dark:text-gray-300 space-y-2 ml-2">
                <li><span class="text-purple-600">1. Gluconato de Calcio (10%):</span> ${t('Protege el corazón (estabiliza membranas). NO baja el K+. Accion: 1-3 min.', 'Protects heart (stabilizes membranes). Does NOT lower K+. Action: 1-3 min.')}</li>
                <li><span class="text-blue-600">2. Insulina Regular IV + Dextrosa (D50):</span> ${t('Mueve K+ al interior de las células. Accion: 15-30 min.', 'Shifts K+ into cells. Action: 15-30 min.')}</li>
                <li><span class="text-green-600">3. Bicarbonato de Sodio:</span> ${t('Corrige acidosis, ayuda a mover K+.', 'Corrects acidosis, helps shift K+.')}</li>
                <li><span class="text-orange-600">4. Diuréticos (Furosemida):</span> ${t('Excreción renal (si hay función).', 'Renal excretion (if function exists).')}</li>
                <li><span class="text-teal-600">5. Kayexalate:</span> ${t('Elimina K+ en heces. Lento (horas).', 'Eliminates K+ in stool. Slow (hours).')}</li>
                <li><span class="text-red-600">6. Diálisis:</span> ${t('Remoción inmediata para casos críticos.', 'Immediate removal for critical cases.')}</li>
              </ol>
            </div>
          </div>
        </section>
      `;
    },

    // --- 3. AKI vs CKD Comparison ---
    renderAKIvsCKD() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('AKI vs CKD (Comparativa)', 'AKI vs CKD (Comparison)')}
            </h2>
          </div>

          <div class="overflow-x-auto bg-white dark:bg-brand-card rounded-3xl shadow-lg border border-gray-200 dark:border-brand-border mb-6">
            <table class="w-full text-left border-collapse min-w-[600px]">
              <thead class="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs uppercase">
                <tr>
                  <th class="px-6 py-4 rounded-tl-3xl">${t('Característica', 'Feature')}</th>
                  <th class="px-6 py-4">AKI</th>
                  <th class="px-6 py-4 rounded-tr-3xl">CKD</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                <tr class="hover:bg-indigo-50 dark:hover:bg-indigo-900/10">
                  <td class="px-6 py-4 font-bold">${t('Inicio', 'Onset')}</td>
                  <td class="px-6 py-4 text-red-500 font-bold">${t('Agudo', 'Acute')}</td>
                  <td class="px-6 py-4 text-blue-500 font-bold">${t('Crónico (Años)', 'Chronic (Years)')}</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 font-bold">${t('Reversibilidad', 'Reversibility')}</td>
                  <td class="px-6 py-4 text-green-600 font-bold">${t('Potencialmente reversible', 'Potentially reversible')}</td>
                  <td class="px-6 py-4 text-red-500 font-bold">${t('Irreversible/Progresiva', 'Irreversible/Progressive')}</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 font-bold">${t('Anemia', 'Anemia')}</td>
                  <td class="px-6 py-4">${t('Rara', 'Rare')}</td>
                  <td class="px-6 py-4 text-red-500 font-bold">${t('Común (↓ Eritropoyetina)', 'Common (↓ Erythropoietin)')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-stone-50 dark:bg-stone-900/10 p-5 rounded-2xl border border-stone-200 dark:border-stone-800">
             <strong class="text-stone-700 dark:text-stone-300 block mb-2 text-sm uppercase">${t('Estadíos CKD (Basado en GFR)', 'CKD Stages (Based on GFR)')}</strong>
             <div class="space-y-2 text-sm">
                <div class="flex justify-between p-2 bg-white dark:bg-black/20 rounded">
                  <span><strong>Stage 1:</strong> GFR > 90</span>
                  <span class="text-green-600">Normal function</span>
                </div>
                <div class="flex justify-between p-2 bg-white dark:bg-black/20 rounded">
                  <span><strong>Stage 3:</strong> GFR 30-59</span>
                  <span class="text-yellow-600">Moderate</span>
                </div>
                <div class="flex justify-between p-2 bg-white dark:bg-black/20 rounded border border-red-200 dark:border-red-900">
                  <span><strong>Stage 5:</strong> GFR < 15</span>
                  <span class="text-red-600 font-bold">ESRD (${t('Requiere Diálisis/Trasplante', 'Requires Dialysis/Transplant')})</span>
                </div>
              </div>
          </div>
        </section>
      `;
    },
    
    // --- 4. Glomerular Diseases ---
    renderGlomerularDiseases() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-pink-600 flex items-center justify-center text-white font-black text-xl shadow-lg">G</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Glomerulonefritis y Síndrome Nefrótico', 'Glomerulonephritis & Nephrotic Syndrome')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <div class="bg-red-100 dark:bg-red-900/30 inline-block px-3 py-1 rounded-lg text-red-600 dark:text-red-400 font-bold text-xs uppercase mb-3">
                ${t('Inflamación', 'Inflammation')}
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                ${t('Glomerulonefritis Aguda', 'Acute Glomerulonephritis')}
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                ${t('Causa: Infección estreptocócica (hace 14 días).', 'Cause: Strep infection (14 days prior).')}
              </p>
              
              <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li class="flex gap-2">
                  <i class="fa-solid fa-droplet text-red-500 mt-1"></i>
                  <span><strong class="block">Hematuria</strong> ${t('Orina color "té" o "cola".', 'Tea-colored or cola-colored urine.')}</span>
                </li>
                <li class="flex gap-2">
                  <i class="fa-solid fa-face-flushed text-orange-500 mt-1"></i>
                  <span><strong class="block">Edema</strong> ${t('Periorbital (ojos) por la mañana.', 'Periorbital (eyes) in AM.')}</span>
                </li>
                <li class="flex gap-2">
                  <i class="fa-solid fa-gauge-high text-red-600 mt-1"></i>
                  <span><strong class="block text-red-600">Hipertensión</strong> ${t('Controlar TA.', 'Monitor BP.')}</span>
                </li>
              </ul>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <div class="bg-yellow-100 dark:bg-yellow-900/30 inline-block px-3 py-1 rounded-lg text-yellow-600 dark:text-yellow-400 font-bold text-xs uppercase mb-3">
                ${t('Permeabilidad', 'Permeability')}
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                ${t('Síndrome Nefrótico', 'Nephrotic Syndrome')}
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                ${t('Fuga masiva de proteínas.', 'Massive protein leakage.')}
              </p>
              
              <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li class="flex gap-2">
                  <i class="fa-solid fa-filter text-yellow-500 mt-1"></i>
                  <span><strong class="block text-red-600">Proteinuria Masiva</strong> > 3.5g/day. ${t('Orina espumosa.', 'Frothy urine.')}</span>
                </li>
                <li class="flex gap-2">
                  <i class="fa-solid fa-water text-blue-500 mt-1"></i>
                  <span><strong class="block">Hipoalbuminemia & Edema Severo</strong> ${t('Anasarca (generalizado). Ascitis.', 'Anasarca (generalized). Ascites.')}</span>
                </li>
                <li class="flex gap-2">
                  <i class="fa-solid fa-bacon text-orange-500 mt-1"></i>
                  <span><strong class="block">Hiperlipidemia</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 5. Infections (UTI & Stones) ---
    renderInfections() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Infecciones y Litiasis', 'Infections & Stones')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="font-bold text-teal-700 dark:text-teal-400 mb-3 text-lg">Cistitis vs Pielonefritis</h3>
              <div class="space-y-4">
                <div class="p-3 bg-teal-50 dark:bg-teal-900/10 rounded-xl">
                  <strong class="text-teal-800 dark:text-teal-300 block mb-1">Cistitis (Baja)</strong>
                  <ul class="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                    <li>Disuria, Urgencia, Frecuencia.</li>
                    <li>Orina turbia/fétida.</li>
                    <li><strong class="text-red-500">Ancianos:</strong> ${t('Confusión aguda (Delirio) es signo #1.', 'Acute confusion (Delirium) is sign #1.')}</li>
                  </ul>
                </div>
                
                <div class="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">
                  <strong class="text-red-800 dark:text-red-300 block mb-1">Pielonefritis (Alta/Riñón)</strong>
                  <ul class="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                    <li>Todo lo anterior <strong>+</strong> ${t('Fiebre alta, Escalofríos.', 'High fever, Chills.')}</li>
                    <li>${t('Dolor en ángulo costovertebral (CVA).', 'Costovertebral angle (CVA) tenderness.')}</li>
                    <li>Náuseas, vómitos.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="font-bold text-purple-700 dark:text-purple-400 mb-3 text-lg">
                  ${t('Litiasis Renal (Cálculos)', 'Renal Calculi (Stones)')}
              </h3>
              <div class="space-y-4">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  <p class="mb-2"><strong>${t('Cólico Renal', 'Renal Colic')}:</strong> ${t('Dolor súbito e intenso en flanco que irradia a la ingle. Paciente inquieto.', 'Sudden severe flank pain radiating to groin. Patient restless.')}</p>
                </div>
                
                <div class="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                  <strong class="text-purple-800 dark:text-purple-300 block mb-1">${t('Tipos de Cálculos', 'Types of Stones')}</strong>
                  <ul class="text-xs text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                    <li><strong>Oxalato de calcio:</strong> ${t('Evitar espinacas, nueces, chocolate.', 'Avoid spinach, nuts, chocolate.')}</li>
                    <li><strong>Ácido úrico:</strong> ${t('Gota/Quimio. Evitar purinas (hígado, sardinas).', 'Gout/Chemo. Avoid purines (liver, sardines).')}</li>
                  </ul>
                </div>
                
                <div class="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Manejo:</strong> ${t('Analgesia (Prioridad), Hidratación (3L/día), Colar orina.', 'Analgesia (Priority), Hydration (3L/day), Strain urine.')}
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 6. Procedures (Dialysis & TURP) ---
    renderProcedures() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Procedimientos (Diálisis y TURP)', 'Procedures (Dialysis & TURP)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="font-bold text-orange-700 dark:text-orange-400 mb-3 text-lg">
                ${t('Cuidado de Fístula AV', 'AV Fistula Care')}
              </h3>
              
              <div class="space-y-4 text-sm text-gray-700 dark:text-gray-300 mt-4">
                <div class="p-3 bg-green-50 dark:bg-green-900/10 rounded-xl">
                  <strong class="text-green-800 dark:text-green-300 block mb-1">
                    ${t('Evaluación (Cada turno)', 'Assessment (Every shift)')}
                  </strong>
                  <ul class="list-disc list-inside space-y-1">
                    <li><strong>Thrill:</strong> ${t('Vibración al palpar.', 'Vibration on palpation.')}</li>
                    <li><strong>Bruit:</strong> ${t('Soplo al auscultar.', 'Swooshing sound on auscultation.')}</li>
                    <li><strong>NO Thrill/Bruit = <span class="text-red-600">EMERGENCIA</span></strong> (Trombosis).</li>
                  </ul>
                </div>
                
                <div class="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">
                  <strong class="text-red-800 dark:text-red-300 block mb-1">${t('Restricciones', 'Restrictions')}</strong>
                  <ul class="list-disc list-inside space-y-1">
                    <li>NO BP (Presión).</li>
                    <li>NO IVs (Venopunciones).</li>
                    <li>NO Constricción en ese brazo.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="font-bold text-blue-700 dark:text-blue-400 mb-3 text-lg">TURP & ${t('Irrigación Vesical (CBI)', 'Bladder Irrigation (CBI)')}</h3>
              
              <p class="text-sm text-gray-500 mb-4">${t('Post-operatorio de Próstata (BPH).', 'Post-op Prostate (BPH).')}</p>
              
              <div class="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <div class="p-3 bg-pink-50 dark:bg-pink-900/10 rounded-xl">
                  <p class="text-xs text-pink-600 font-bold mt-1">
                    ${t('Color objetivo: <strong>ROSA CLARO</strong>', 'Target color: <strong>LIGHT PINK</strong>')}
                  </p>
                </div>
                
                <div class="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">
                  <strong class="text-red-800 dark:text-red-300 block mb-1">${t('Solución de Problemas', 'Troubleshooting')}</strong>
                  <ul class="list-disc list-inside space-y-1">
                    <li><strong>${t('Rojo brillante / Coágulos', 'Bright Red / Clots')}:</strong> ${t('AUMENTAR irrigación.', 'INCREASE irrigation.')}</li>
                    <li><strong>${t('No drena / Obstruido', 'No drainage / Obstructed')}:</strong> ${t('APAGAR irrigación, revisar kinks, irrigar manual (orden médica).', 'TURN OFF irrigation, check kinks, manual irrigate (MD order).')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg lg:col-span-2">
              <h3 class="font-bold text-teal-700 dark:text-teal-400 mb-3 text-lg flex items-center gap-2">
                <i class="fa-solid fa-circle-notch"></i>
                ${t('Diálisis Peritoneal (CAPD)', 'Peritoneal Dialysis (CAPD)')}
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <div class="p-3 bg-teal-50 dark:bg-teal-900/10 rounded-xl">
                    <strong class="block text-teal-800 dark:text-teal-300 mb-1">
                        ${t('Peritonitis (Signo #1)', 'Peritonitis (Sign #1)')}
                    </strong>
                    <p class="mb-2">
                        ${t('El efluente debe ser <strong class="text-green-600">CLARO</strong>.', 'Effluent must be <strong class="text-green-600">CLEAR</strong>.')}
                    </p>
                    <p class="text-red-600 font-bold text-xs">
                        ${t('Turbio (Cloudy) = INFECCIÓN.', 'Cloudy = INFECTION.')}
                    </p>
                </div>

                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <strong class="block text-gray-800 dark:text-gray-300 mb-1">Troubleshooting</strong>
                    <ul class="list-disc list-inside space-y-1 text-xs">
                        <li>
                            <strong class="text-blue-500">${t('Drenaje lento', 'Slow drain')}:</strong>
                            ${t('Girar al paciente de lado.', 'Turn patient side-to-side.')}
                        </li>
                        <li>
                            <strong class="text-orange-500">${t('Dolor/Calambres', 'Pain/Cramps')}:</strong>
                            ${t('Calentar solución (NO microondas).', 'Warm solution (NO microwave).')}
                        </li>
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 7. Pharmacology (Added from Ver 8) ---
    renderPharmacology() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Farmacología Renal', 'Renal Pharmacology')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
             <div class="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <strong class="text-emerald-700 dark:text-emerald-300 block mb-1">Epoetin Alfa (Epogen)</strong>
                <span class="text-gray-600 dark:text-gray-400">
                  ${t('Estimula RBC (Anemia). EA: <strong>Hipertensión</strong>, coágulos. Monitor Hgb.', 'Stimulates RBC (Anemia). SE: <strong>Hypertension</strong>, clots. Monitor Hgb.')}
                </span>
             </div>
             <div class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
                <strong class="text-blue-700 dark:text-blue-300 block mb-1">Phosphate Binders</strong>
                <span class="text-gray-600 dark:text-gray-400">
                  ${t('Sevelamer, Acetato de Calcio. Tomar <strong>CON COMIDA</strong>.', 'Sevelamer, Calcium Acetate. Take <strong>WITH MEALS</strong>.')}
                </span>
             </div>
             <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
                <strong class="text-red-700 dark:text-red-300 block mb-1">Kayexalate</strong>
                <span class="text-gray-600 dark:text-gray-400">
                  ${t('Baja Potasio (vía heces). Causa diarrea.', 'Lowers Potassium (via stool). Causes diarrhea.')}
                </span>
             </div>
             <div class="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
                <strong class="text-purple-700 dark:text-purple-300 block mb-1">Anticholinergics</strong>
                <span class="text-gray-600 dark:text-gray-400">
                  ${t('Oxybutynina. Para vejiga hiperactiva. EA: Boca seca, retención.', 'Oxybutynin. For overactive bladder. SE: Dry mouth, retention.')}
                </span>
             </div>
             <div class="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <strong class="text-yellow-700 dark:text-yellow-300 block mb-1">Finasteride</strong>
                <span class="text-gray-600 dark:text-gray-400">
                  ${t('Reduce próstata (BPH). Mujeres embarazadas NO tocar.', 'Shrinks prostate (BPH). Pregnant women DO NOT touch.')}
                </span>
             </div>
             <div class="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800">
                <strong class="text-orange-700 dark:text-orange-300 block mb-1">Tamsulosin (Flomax)</strong>
                <span class="text-gray-600 dark:text-gray-400">
                  ${t('Relaja músculo liso (BPH/Cálculos). EA: Hipotensión ortostática.', 'Relaxes smooth muscle (BPH/Stones). SE: Orthostatic hypotension.')}
                </span>
             </div>
          </div>
        </section>
      `;
    },

    // --- 8. Renal Diet (Added from Ver 8) ---
    renderDiet() {
      return `
        <section class="mt-8 mb-12">
          <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700">
             <h3 class="font-bold text-gray-900 dark:text-white text-lg mb-4 text-center">
                ${t('Dieta Renal (CKD)', 'Renal Diet (CKD)')}
             </h3>
             
             <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                <div class="p-3 bg-white dark:bg-black/20 rounded-xl border-t-4 border-red-500">
                   <strong class="block text-red-600 mb-1">Low Potassium</strong>
                   <span class="text-xs text-gray-500">
                     ${t('NO: Plátano, Naranja, Patata, Tomate.', 'NO: Banana, Orange, Potato, Tomato.')}
                   </span>
                </div>
                <div class="p-3 bg-white dark:bg-black/20 rounded-xl border-t-4 border-orange-500">
                   <strong class="block text-orange-600 mb-1">Low Phosphorus</strong>
                   <span class="text-xs text-gray-500">
                     ${t('NO: Lácteos, Yogur, Colas oscuras.', 'NO: Dairy, Yogurt, Dark colas.')}
                   </span>
                </div>
                <div class="p-3 bg-white dark:bg-black/20 rounded-xl border-t-4 border-blue-500">
                   <strong class="block text-blue-600 mb-1">Low Sodium</strong>
                   <span class="text-xs text-gray-500">
                     ${t('NO: Enlatados, Procesados.', 'NO: Canned, Processed.')}
                   </span>
                </div>
                <div class="p-3 bg-white dark:bg-black/20 rounded-xl border-t-4 border-purple-500">
                   <strong class="block text-purple-600 mb-1">Protein</strong>
                   <span class="text-xs text-gray-500">
                     ${t('Restringida pre-diálisis. Alta en Diálisis.', 'Restricted pre-dialysis. High in Dialysis.')}
                   </span>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 9. Quiz ---
    renderQuiz() {
      return `
        <div class="mt-12 bg-gray-900 text-white p-6 rounded-3xl border border-gray-700">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <i class="fa-solid fa-clipboard-question text-yellow-400"></i> 
                ${t('Repaso Rápido', 'Quick Review')}
            </h3>
            <div class="space-y-4 text-sm">
                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('1. Paciente CKD con K+ 6.8 mEq/L y onda T picuda. ¿Medicación prioritaria?', '1. CKD patient with K+ 6.8 mEq/L and peaked T-waves. Priority med?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-yellow-500">
                        ${t('<strong>Gluconato de Calcio al 10% IV.</strong> Se administra PRIMERO para estabilizar el corazón. La insulina se da después.', '<strong>10% Calcium Gluconate IV.</strong> Given FIRST to stabilize the heart. Insulin is given next.')}
                    </div>
                </details>
                
                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('2. Fístula AV: ¿Qué hallazgo requiere intervención inmediata?', '2. AV Fistula: Which finding needs immediate intervention?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-yellow-500">
                        ${t('<strong>Ausencia de Thrill y Bruit.</strong> Indica trombosis (coágulo). Emergencia.', '<strong>Absence of Thrill and Bruit.</strong> Indicates thrombosis (clot). Emergency.')}
                    </div>
                </details>

                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('3. Diálisis Peritoneal: Líquido turbio. ¿Qué significa?', '3. Peritoneal Dialysis: Cloudy fluid. What does it mean?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-yellow-500">
                        ${t('<strong>Peritonitis.</strong> Complicación grave. El líquido debe ser claro.', '<strong>Peritonitis.</strong> Serious complication. Fluid should be clear.')}
                    </div>
                </details>

                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('4. CBI post-TURP: Drenaje rojo brillante con coágulos. ¿Acción?', '4. Post-TURP CBI: Bright red drainage with clots. Action?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-yellow-500">
                        ${t('<strong>Aumentar la irrigación.</strong> Indica hemorragia activa. El objetivo es rosa claro.', '<strong>Increase irrigation rate.</strong> Indicates active bleeding. Goal is light pink.')}
                    </div>
                </details>
                
                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('5. Paciente anciano con confusión aguda, sin fiebre. ¿Qué considerar?', '5. Elderly patient with acute confusion, no fever. What to consider?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-yellow-500">
                        ${t('<strong>Infección urinaria (ITU).</strong> Confusión es el síntoma #1 en ancianos.', '<strong>Urinary Tract Infection (UTI).</strong> Confusion is symptom #1 in elderly.')}
                    </div>
                </details>
            </div>
        </div>
      `;
    }
  });
})();