// 08_endocrine.js — Endocrine Masterclass (NCLEX High-Yield)
// VERSIÓN MAESTRA DEFINITIVA: Diabetes, Thyroid, Adrenals & Emergencies
// CREADO POR: REYNIER DIAZ GERONES
// SÍNTESIS TÉCNICA Y ACADÉMICA OPTIMIZADA
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // Helper de traducción simple y limpio
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'endocrine',
    title: { es: 'Sistema Endocrino', en: 'Endocrine System' },
    subtitle: { es: 'Diabetes, Tiroides y Adrenales', en: 'Diabetes, Thyroid & Adrenals' },
    icon: 'cubes-stacked',
    color: 'purple',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="flex gap-2 mb-2">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-extrabold uppercase tracking-wider">
                    <i class="fa-solid fa-notes-medical"></i>
                    <span class="lang-es">Masterclass Endocrino</span>
                    <span class="lang-en hidden-lang">Endocrine Masterclass</span>
                </div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-extrabold uppercase tracking-wider">
                    <i class="fa-solid fa-flask"></i>
                    <span class="lang-es">Prioridad Nivel 1</span>
                    <span class="lang-en hidden-lang">Priority Level 1</span>
                </div>
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                <span class="lang-es">Sistema Endocrino</span>
                <span class="lang-en hidden-lang">Endocrine System</span>
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                <span class="lang-es">Prioridades: Hipoglucemia, Crisis Adrenal, Tormenta Tiroidea.</span>
                <span class="lang-en hidden-lang">Priorities: Hypoglycemia, Adrenal Crisis, Thyroid Storm.</span>
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderPathoReview()}
          ${this.renderAssessment()}
          ${this.renderDiagnostics()}
          ${this.renderPharmacology()}
          ${this.renderEmergencies()}
          ${this.renderEducation()}
        </div>
      `;
    },

    // --- 1. Patho Review (High Yield Concepts) ---
    renderPathoReview() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Fisiopatología "High-Yield"</span>
              <span class="lang-en hidden-lang">"High-Yield" Patho</span>
            </h2>
          </div>

          <div class="bg-white dark:bg-brand-card p-6 rounded-3xl shadow-lg border border-gray-200 dark:border-brand-border">
            <p class="text-gray-600 dark:text-gray-300 mb-6 text-base italic border-l-4 border-purple-500 pl-4">
              <span class="lang-es">El sistema endocrino es un juego de <strong>Balance</strong>. Todo es "Mucho" (Hiper) o "Poco" (Hipo).</span>
              <span class="lang-en hidden-lang">The endocrine system is a game of <strong>Balance</strong>. Everything is "Too Much" (Hyper) or "Too Little" (Hypo).</span>
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-200 dark:border-blue-800 hover:-translate-y-1 transition-transform">
                <strong class="text-blue-700 dark:text-blue-300 block mb-1">Pancreas</strong>
                <span class="text-sm text-gray-600 dark:text-gray-400">Insulin vs Glucagon</span>
                <div class="mt-2 text-xs font-bold bg-white dark:bg-black/20 p-2 rounded text-center text-blue-800 dark:text-blue-200">${t('Control de Azúcar', 'Sugar Control')}</div>
                <p class="text-xs text-gray-500 mt-2">${t('Insulina ↓ glucosa. Glucagón ↑ glucosa. Amilina ↓ glucosa posprandial.', 'Insulin ↓ glucose. Glucagon ↑ glucose. Amylin ↓ postprandial glucose.')}</p>
              </div>
              <div class="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800 hover:-translate-y-1 transition-transform">
                <strong class="text-orange-700 dark:text-orange-300 block mb-1">Thyroid</strong>
                <span class="text-sm text-gray-600 dark:text-gray-400">T3, T4, Calcitonin</span>
                <div class="mt-2 text-xs font-bold bg-white dark:bg-black/20 p-2 rounded text-center text-orange-800 dark:text-orange-200">${t('Metabolismo y Calcio', 'Metabolism & Ca²⁺')}</div>
                <p class="text-xs text-gray-500 mt-2">${t('T3/T4: metabolismo basal, temperatura. Calcitonina: baja el calcio sérico.', 'T3/T4: basal metabolism, temp. Calcitonin: lowers serum calcium.')}</p>
              </div>
              <div class="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800 hover:-translate-y-1 transition-transform">
                <strong class="text-amber-700 dark:text-amber-300 block mb-1">Adrenals</strong>
                <span class="text-sm text-gray-600 dark:text-gray-400">Cortisol, Aldosterone</span>
                <div class="mt-2 text-xs font-bold bg-white dark:bg-black/20 p-2 rounded text-center text-amber-800 dark:text-amber-200">${t('Estrés, Sal y Azúcar', 'Stress, Salt, Sugar')}</div>
                <p class="text-xs text-gray-500 mt-2">${t('Cortisol: estrés, gluconeogénesis. Aldosterona: Retiene Na⁺, Excreta K⁺.', 'Cortisol: stress, gluconeogenesis. Aldosterone: Retains Na⁺, Excretes K⁺.')}</p>
              </div>
              <div class="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-200 dark:border-indigo-800 hover:-translate-y-1 transition-transform">
                <strong class="text-indigo-700 dark:text-indigo-300 block mb-1">Pituitary</strong>
                <span class="text-sm text-gray-600 dark:text-gray-400">ADH (Vasopressin)</span>
                <div class="mt-2 text-xs font-bold bg-white dark:bg-black/20 p-2 rounded text-center text-indigo-800 dark:text-indigo-200">${t('Balance de Fluidos', 'Fluid Balance')}</div>
                <p class="text-xs text-gray-500 mt-2">${t('ADH: reabsorción de agua → orina concentrada. SIADH vs DI.', 'ADH: water reabsorption → concentrated urine. SIADH vs DI.')}</p>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. Assessment (Symptom Analysis) ---
    renderAssessment() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-lg shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Valoración (Hipo vs Hiper)</span>
              <span class="lang-en hidden-lang">Assessment (Hypo vs Hyper)</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            <div class="bg-white dark:bg-brand-card rounded-3xl shadow-lg border border-gray-200 dark:border-brand-border overflow-hidden">
              <div class="bg-gray-100 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="font-black text-lg text-gray-800 dark:text-white flex items-center gap-2">
                  <i class="fa-solid fa-bolt text-yellow-500"></i> Thyroid (Metabolism)
                </h3>
              </div>
              <div class="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700 mt-2">
                <div class="p-5">
                  <strong class="text-orange-600 dark:text-orange-400 block mb-2 text-lg">HYPER (Graves)</strong>
                  <p class="text-xs font-bold text-gray-400 mb-3 uppercase">"Running High"</p>
                  <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <li class="flex items-start gap-2"><i class="fa-solid fa-fire text-orange-400 w-5 flex-shrink-0 mt-0.5"></i> ${t('Intolerancia al calor, Sudoración', 'Heat Intolerance, Sweating')}</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-weight-scale text-orange-400 w-5 flex-shrink-0 mt-0.5"></i> ${t('Pérdida de peso a pesar de ↑ apetito', 'Weight Loss despite ↑ appetite')}</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-heart-pulse text-red-500 w-5 flex-shrink-0 mt-0.5"></i> ${t('Taquicardia, Palpitaciones, HTA', 'Tachycardia, Palpitations, Hypertension')}</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-eye text-blue-400 w-5 flex-shrink-0 mt-0.5"></i> ${t('Exoftalmos, Mirada fija', 'Exophthalmos, Lid lag, Stare')}</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-hand text-orange-400 w-5 flex-shrink-0 mt-0.5"></i> ${t('Temblor fino, Hiperreflexia', 'Fine tremor, Hyperreflexia')}</li>
                  </ul>
                </div>
                <div class="p-5">
                  <strong class="text-purple-600 dark:text-purple-400 block mb-2 text-lg">HYPO (Hashimoto)</strong>
                  <p class="text-xs font-bold text-gray-400 mb-3 uppercase">"Slow Motion"</p>
                  <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <li class="flex items-start gap-2"><i class="fa-solid fa-snowflake text-blue-400 w-5 flex-shrink-0 mt-0.5"></i> ${t('Intolerancia al frío', 'Cold Intolerance')}</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-weight-hanging text-purple-400 w-5 flex-shrink-0 mt-0.5"></i> ${t('Ganancia de peso, Fatiga', 'Weight Gain, Fatigue')}</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-bed text-purple-400 w-5 flex-shrink-0 mt-0.5"></i> ${t('Letargo, Bradicardia', 'Lethargy, Bradycardia')}</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-poo text-purple-400 w-5 flex-shrink-0 mt-0.5"></i> ${t('Estreñimiento, Mixedema', 'Constipation, Myxedema')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card rounded-3xl shadow-lg border border-gray-200 dark:border-brand-border overflow-hidden">
              <div class="bg-gray-100 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="font-black text-lg text-gray-800 dark:text-white flex items-center gap-2">
                  <i class="fa-solid fa-kidneys text-amber-600"></i> Adrenals (Steroids)
                </h3>
              </div>
              <div class="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700 mt-2">
                <div class="p-5">
                  <strong class="text-amber-700 dark:text-amber-400 block mb-2 text-lg">ADDISON'S</strong>
                  <p class="text-xs font-bold text-gray-400 mb-3 uppercase">"Absent Steroids"</p>
                  <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <li class="flex items-start gap-2"><i class="fa-solid fa-arrow-down text-red-500 w-5 flex-shrink-0 mt-0.5"></i> ${t('Hipotensión (ortostática), Shock', 'Hypotension (orthostatic), Shock risk')}</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-sun text-amber-500 w-5 flex-shrink-0 mt-0.5"></i> ${t('Hiperpigmentación (bronceado)', 'Hyperpigmentation (bronze skin)')}</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-flask text-gray-400 w-5 flex-shrink-0 mt-0.5"></i> <strong class="text-red-500">LOW</strong> Na⁺, Glucose</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-flask text-gray-400 w-5 flex-shrink-0 mt-0.5"></i> <strong class="text-green-500">HIGH</strong> K⁺, Ca²⁺</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-person-walking text-amber-500 w-5 flex-shrink-0 mt-0.5"></i> ${t('Debilidad, Pérdida peso', 'Weakness, Weight loss')}</li>
                  </ul>
                </div>
                <div class="p-5">
                  <strong class="text-pink-600 dark:text-pink-400 block mb-2 text-lg">CUSHING'S</strong>
                  <p class="text-xs font-bold text-gray-400 mb-3 uppercase">"Cushion of Steroids"</p>
                  <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <li class="flex items-start gap-2"><i class="fa-solid fa-face-smile text-pink-400 w-5 flex-shrink-0 mt-0.5"></i> ${t('Cara de luna, Joroba de búfalo', 'Moon face, Buffalo hump, Truncal obesity')}</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-bone text-gray-400 w-5 flex-shrink-0 mt-0.5"></i> ${t('Osteoporosis, Fracturas', 'Osteoporosis, Pathologic fractures')}</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-flask text-gray-400 w-5 flex-shrink-0 mt-0.5"></i> <strong class="text-green-500">HIGH</strong> Na⁺, Glucose</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-flask text-gray-400 w-5 flex-shrink-0 mt-0.5"></i> <strong class="text-red-500">LOW</strong> K⁺, Ca²⁺</li>
                    <li class="flex items-start gap-2"><i class="fa-solid fa-bandage text-pink-400 w-5 flex-shrink-0 mt-0.5"></i> ${t('Piel fina, Estrías púrpuras', 'Thin skin, Bruising, Purple striae')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                <strong class="text-red-600 dark:text-red-400 block mb-2"><i class="fa-solid fa-triangle-exclamation mr-2"></i>Pheochromocytoma</strong>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    ${t('Tumor de la médula adrenal que secreta catecolaminas excesivas.', 'Adrenal medulla tumor secreting excessive catecholamines.')}
                </p>
                <div class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">5 P's:</div>
                <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-2">
                    <li>1. <strong>P</strong>ressure (Severe Hypertension)</li>
                    <li>2. <strong>P</strong>alpitations (Tachycardia)</li>
                    <li>3. <strong>P</strong>erspiration (Profuse sweating)</li>
                    <li>4. <strong>P</strong>ain (Severe pounding headache)</li>
                    <li>5. <strong>P</strong>allor</li>
                </ul>
                <div class="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-3 py-2 rounded text-xs font-bold border border-red-200 dark:border-red-800">
                    ${t('¡NO palpar abdomen! Puede liberar catecolaminas y causar crisis hipertensiva.', 'DO NOT palpate abdomen! May release catecholamines causing hypertensive crisis.')}
                </div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                <strong class="text-blue-600 dark:text-blue-400 block mb-2"><i class="fa-solid fa-ruler-combined mr-2"></i>Metabolic Syndrome (Syndrome X)</strong>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    ${t('Factores que aumentan riesgo de Diabetes Tipo 2 y Enfermedad Cardiovascular. (3 o más presentes):', 'Factors increasing risk of Type 2 Diabetes and Cardiovascular Disease. (3 or more present):')}
                </p>
                <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                    <li class="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                        <span>Abdominal Obesity</span>
                        <span class="font-bold">Waist >40" (M), >35" (F)</span>
                    </li>
                    <li class="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                        <span>Triglycerides</span>
                        <span class="font-bold">> 150 mg/dL</span>
                    </li>
                    <li class="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                        <span>HDL (Good Cholesterol)</span>
                        <span class="font-bold">< 40 (M), < 50 (F)</span>
                    </li>
                    <li class="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                        <span>Blood Pressure</span>
                        <span class="font-bold">≥ 130/85 mmHg</span>
                    </li>
                    <li class="flex justify-between">
                        <span>Fasting Glucose</span>
                        <span class="font-bold">≥ 100 mg/dL</span>
                    </li>
                </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 3. Diagnostics & Labs ---
    renderDiagnostics() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Laboratorios Clave</span>
              <span class="lang-en hidden-lang">Key Labs</span>
            </h2>
          </div>

          <div class="bg-white dark:bg-brand-card rounded-3xl shadow-lg border border-gray-200 dark:border-brand-border overflow-hidden mb-6">
            <table class="w-full text-left text-sm md:text-base">
              <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold uppercase text-xs">
                <tr>
                  <th scope="col" class="px-6 py-4">Lab / Test</th>
                  <th scope="col" class="px-6 py-4">Normal Range</th>
                  <th scope="col" class="px-6 py-4">Significance</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                <tr class="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                  <td class="px-6 py-4 font-bold text-blue-600">HbA1C</td>
                  <td class="px-6 py-4">< 5.7%</td>
                  <td class="px-6 py-4">
                    ${t('Control glucémico promedio de 3 meses. <strong>> 6.5% = Diabetes</strong>.', '3-month average glucose control. <strong>> 6.5% = Diabetes</strong>.')}
                  </td>
                </tr>
                <tr class="hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors">
                  <td class="px-6 py-4 font-bold text-indigo-600">Specific Gravity</td>
                  <td class="px-6 py-4">1.005 - 1.030</td>
                  <td class="px-6 py-4">
                    ${t('<strong>Bajo (< 1.005):</strong> DI (Orina diluida). <strong>Alto (> 1.030):</strong> SIADH (Orina concentrada).', '<strong>Low (< 1.005):</strong> DI (Dilute urine). <strong>High (> 1.030):</strong> SIADH (Concentrated urine).')}
                  </td>
                </tr>
                <tr class="hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors">
                  <td class="px-6 py-4 font-bold text-yellow-600">Calcium (Ca²⁺)</td>
                  <td class="px-6 py-4">8.5 - 10.5 mg/dL</td>
                  <td class="px-6 py-4">
                    ${t('Post-tiroidectomía: Monitorear <strong>hipo</strong>calcemia. <strong>Chvostek + Trousseau.</strong>', 'Post-thyroidectomy: Monitor <strong>hypo</strong>calcemia. <strong>Chvostek + Trousseau sign.</strong>')}
                  </td>
                </tr>
                <tr class="hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors">
                  <td class="px-6 py-4 font-bold text-orange-600">TSH</td>
                  <td class="px-6 py-4">0.4 - 4.0 mIU/L</td>
                  <td class="px-6 py-4">
                    ${t('<strong>Alto</strong> = Hipotiroidismo (Primario). <strong>Bajo</strong> = Hipertiroidismo.', '<strong>High</strong> = Primary hypothyroidism. <strong>Low</strong> = Hyperthyroidism.')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-200 dark:border-gray-700">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-4">SIADH vs Diabetes Insipidus (DI)</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead class="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th class="px-4 py-2 font-bold">${t('Parámetro', 'Parameter')}</th>
                    <th class="px-4 py-2 font-bold text-blue-600">SIADH</th>
                    <th class="px-4 py-2 font-bold text-red-600">DI (Central/Nephrogenic)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td class="px-4 py-2 font-medium">${t('Nivel ADH', 'ADH Level')}</td>
                    <td class="px-4 py-2 text-blue-600">↑↑↑ (High)</td>
                    <td class="px-4 py-2 text-red-600">↓↓↓ (Low)</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 font-medium">${t('Gasto Urinario', 'Urine Output')}</td>
                    <td class="px-4 py-2">↓ (${t('Oliguria', 'Oliguria')})</td>
                    <td class="px-4 py-2">↑↑↑ (${t('Poliuria', 'Polyuria')})</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 font-medium">${t('Gravedad Específica', 'Spec. Gravity')}</td>
                    <td class="px-4 py-2">↑ (>1.030)</td>
                    <td class="px-4 py-2">↓ (<1.005)</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 font-medium">${t('Sodio (Na⁺)', 'Serum Na⁺')}</td>
                    <td class="px-4 py-2">↓ (${t('Hiponatremia', 'Hyponatremia')})</td>
                    <td class="px-4 py-2">↑ (${t('Hipernatremia', 'Hypernatremia')})</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Pharmacology ---
    renderPharmacology() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-white font-black text-lg shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Farmacología: Diabetes & Tiroides</span>
              <span class="lang-en hidden-lang">Pharmacology: Diabetes & Thyroid</span>
            </h2>
          </div>

          <div class="bg-white dark:bg-brand-card p-6 rounded-3xl shadow-lg border border-gray-200 dark:border-brand-border">
            <h3 class="text-xl font-black text-blue-600 dark:text-blue-400 mb-4"><i class="fa-solid fa-chart-area mr-2"></i> ${t('Picos de Insulina (Seguridad)', 'Insulin Peaks (Safety)')}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center mb-8">
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-l-4 border-red-500 shadow-sm">
                <strong class="block text-red-600 dark:text-red-400">Rapid (Lispro/Aspart)</strong>
                <span class="text-xs text-gray-500">Onset: 15 min</span>
                <div class="mt-2 font-black text-lg text-gray-800 dark:text-white">Peak: 30m - 3h</div>
                <span class="text-xs font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded block mt-2">${t('¡DAR CON COMIDA!', 'GIVE WITH FOOD!')}</span>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-l-4 border-yellow-500 shadow-sm">
                <strong class="block text-yellow-600 dark:text-yellow-400">Regular (Short)</strong>
                <span class="text-xs text-gray-500">Onset: 30 min</span>
                <div class="mt-2 font-black text-lg text-gray-800 dark:text-white">Peak: 2 - 5h</div>
                <span class="text-xs font-bold text-yellow-600 dark:text-yellow-400 block mt-2">${t('Única insulina IV', 'Only IV Insulin')}</span>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-l-4 border-orange-500 shadow-sm">
                <strong class="block text-orange-600 dark:text-orange-400">NPH (Intermediate)</strong>
                <span class="text-xs text-gray-500">${t('Suspensión turbia', 'Cloudy suspension')}</span>
                <div class="mt-2 font-black text-lg text-gray-800 dark:text-white">Peak: 4 - 12h</div>
                <span class="text-xs font-bold text-orange-600 dark:text-orange-400 block mt-2">${t('Turbia. Regular antes NPH.', 'Cloudy. Draw Regular first.')}</span>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-l-4 border-green-500 shadow-sm">
                <strong class="block text-green-600 dark:text-green-400">Long (Glargine)</strong>
                <span class="text-xs text-gray-500">${t('Sin pico', 'No peak')}</span>
                <div class="mt-2 font-black text-lg text-gray-800 dark:text-white">Duration: 24h</div>
                <span class="text-xs font-bold text-green-600 dark:text-green-400 block mt-2">${t('NO MEZCLAR', 'DO NOT MIX')}</span>
              </div>
            </div>

            <div class="mb-8">
              <h4 class="text-lg font-bold text-gray-800 dark:text-white mb-4">${t('Antidiabéticos Orales e Inyectables', 'Oral & Injectable Antidiabetic Drugs')}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                  <strong class="text-blue-600 block mb-1">Metformin (Biguanide)</strong>
                  <p class="text-xs text-red-500 font-bold mt-1">${t('Acidosis láctica. Suspender antes de contraste.', 'Lactic acidosis. Hold before contrast dye.')}</p>
                </div>
                <div class="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                  <strong class="text-green-600 block mb-1">Sulfonylureas (Glipizide)</strong>
                  <p class="text-xs text-red-500 font-bold mt-1">${t('Hipoglucemia (esp. ancianos). Evitar alcohol.', 'Hypoglycemia (esp. elderly). Avoid alcohol.')}</p>
                </div>
                <div class="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                  <strong class="text-purple-600 block mb-1">SGLT2 (Canagliflozin)</strong>
                  <p class="text-xs text-red-500 font-bold mt-1">${t('Infecciones urinarias (ITU), Candidiasis.', 'UTI, Yeast infections.')}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-bold text-gray-800 dark:text-white mb-4">${t('Medicamentos Tiroideos', 'Thyroid Medications')}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
                  <strong class="text-orange-600 block mb-1">Levothyroxine (Synthroid)</strong>
                  <p class="text-xs text-red-500 font-bold mt-1">${t('Estómago vacío. Evitar Ca/Fe por 4h.', 'Empty stomach. Avoid Ca/Fe for 4h.')}</p>
                  <p class="text-xs text-blue-500">${t('Para Hipotiroidismo. Vida media larga.', 'For Hypothyroidism. Long half-life.')}</p>
                </div>
                <div class="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                  <strong class="text-red-600 block mb-1">Methimazole / PTU</strong>
                  <p class="text-xs text-red-500 font-bold mt-1">${t('EA: Agranulocitosis (fiebre/dolor garganta = EMERGENCIA).', 'SE: Agranulocytosis (fever/sore throat = EMERGENCY).')}</p>
                  <p class="text-xs text-blue-500">${t('Para Graves (Hiper).', 'For Graves (Hyper).')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 5. Emergencies (Critical Care) ---
    renderEmergencies() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Emergencias Endocrinas</span>
              <span class="lang-en hidden-lang">Endocrine Emergencies</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border-l-8 border-red-500 shadow-md">
              <h3 class="text-xl font-black text-red-700 dark:text-red-400 mb-2">Hypoglycemia (< 70 mg/dL)</h3>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300 italic mb-4">"Cold and Clammy, need some Candy"</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-black/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                  <strong class="block text-red-600 dark:text-red-400 text-sm mb-2 uppercase tracking-wide">Protocol Rule of 15</strong>
                  <ul class="text-sm space-y-2 text-gray-800 dark:text-gray-200">
                    <li class="flex items-start gap-2">
                      <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded flex-shrink-0">${t('Consciente', 'Conscious')}</span>
                      <span>${t('<strong>15g Carbs rápidos</strong> (Jugo, Dulce). Rechecar 15 min.', '<strong>15g Fast Carbs</strong> (Juice, Candy). Re-check 15 min.')}</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded flex-shrink-0">${t('Inconsciente', 'Unconscious')}</span>
                      <span>${t('<strong>IM Glucagón</strong> o <strong>IV Dextrosa 50%</strong>. ¡NADA PO!', '<strong>IM Glucagon</strong> or <strong>IV Dextrose 50%</strong>. NOTHING PO!')}</span>
                    </li>
                  </ul>
                </div>
                <div class="bg-white dark:bg-black/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <strong class="block text-blue-600 dark:text-blue-400 text-sm mb-2 uppercase tracking-wide">${t('Fenómenos Nocturnos', 'Nocturnal Phenomena')}</strong>
                  <ul class="text-sm space-y-1 text-gray-800 dark:text-gray-200">
                    <li>• ${t('<strong>Somogyi:</strong> Hipo nocturna → Rebote Hiper AM.', '<strong>Somogyi:</strong> Nocturnal Hypo → Rebound Hyper AM.')}</li>
                    <li>• ${t('<strong>Dawn (Amanecer):</strong> Hiper AM por hormonas (GH).', '<strong>Dawn:</strong> AM Hyper due to hormones (GH).')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-3xl border-l-8 border-orange-500 shadow-md">
              <h3 class="text-xl font-black text-orange-700 dark:text-orange-400 mb-2">Hyperglycemic Crises</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <strong class="text-orange-800 dark:text-orange-300 block mb-2">DKA (Type 1)</strong>
                  <ul class="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                    <li><span class="font-bold text-red-500">Ketones + Acidosis (pH < 7.3)</span></li>
                    <li>BG: 250 - 600</li>
                    <li>Sxs: Kussmaul, Aliento frutal, Inicio rápido.</li>
                  </ul>
                </div>
                <div>
                  <strong class="text-orange-800 dark:text-orange-300 block mb-2">HHS (Type 2)</strong>
                  <ul class="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                    <li><strong class="text-green-500">NO Cetonas / NO Acidosis</strong></li>
                    <li>BG: > 600 (Muy alto)</li>
                    <li>Sxs: Deshidratación extrema, Inicio lento.</li>
                  </ul>
                </div>
              </div>
              <div class="pt-3 border-t border-orange-200 dark:border-orange-800">
                <strong class="text-gray-700 dark:text-gray-300 block mb-1">Treatment Priorities:</strong>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  1. <strong>Fluids (NS)</strong> → 2. <strong>Insulin IV</strong> (Regular) → 3. <strong>Potassium</strong> (Add K+ even if normal, unless high).
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-3xl border-l-8 border-purple-500 shadow-md">
                <h3 class="text-xl font-black text-purple-700 dark:text-purple-400 mb-2">Thyroid Storm</h3>
                <ul class="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-2">
                  <li><strong>Temp > 104°F, Taquicardia extrema.</strong></li>
                  <li><strong>Tx (ABCD):</strong> Antithyroid (PTU), Beta-blockers, Corticosteroids, Dextrose/Iodine.</li>
                  <li><span class="text-red-500 font-bold">NO ASPIRINA.</span></li>
                </ul>
              </div>

              <div class="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border-l-8 border-amber-500 shadow-md">
                <h3 class="text-xl font-black text-amber-700 dark:text-amber-400 mb-2">Adrenal Crisis</h3>
                <ul class="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-2">
                  <li><strong>Shock Hipotenso Severo.</strong></li>
                  <li>Causa: Retiro abrupto de esteroides o estrés.</li>
                  <li><strong>Tx:</strong> IV Hydrocortisone + NS Bolus.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 6. Patient Education ---
    renderEducation() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-black text-lg shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Educación del Paciente', 'Patient Education')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-sm">
              <strong class="text-green-700 dark:text-green-400 text-lg block mb-3">
                <i class="fa-solid fa-shoe-prints mr-2"></i> ${t('Cuidado de Pies (Diabetes)', 'Diabetic Foot Care')}
              </strong>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2 mt-2">
                <li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${t('Inspeccionar <strong>DIARIAMENTE</strong>.', 'Inspect <strong>DAILY</strong>.')}</li>
                <li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${t('Secar entre dedos. <strong>NO loción entre dedos</strong>.', 'Dry between toes. <strong>NO lotion between toes</strong>.')}</li>
                <li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${t('Uñas rectas. Zapatos de cuero.', 'Cut nails straight. Leather shoes.')}</li>
                <li><i class="fa-solid fa-xmark text-red-500 mr-2"></i> ${t('NUNCA descalzo. NO almohadillas térmicas.', 'NEVER barefoot. NO heating pads.')}</li>
              </ul>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-sm">
              <strong class="text-green-700 dark:text-green-400 text-lg block mb-3">
                <i class="fa-solid fa-virus mr-2"></i> ${t('Reglas de Día Enfermo', 'Sick Day Rules')}
              </strong>
              <div class="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-800 mb-3">
                 <span class="text-red-700 dark:text-red-300 font-bold text-sm block text-center">
                    <i class="fa-solid fa-syringe mr-1"></i> ${t('¡NO DETENER LA INSULINA!', 'DO NOT STOP INSULIN!')}
                 </span>
                 <span class="text-xs text-center block text-gray-500 mt-1">${t('El estrés sube la glucosa.', 'Stress raises glucose.')}</span>
              </div>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>• ${t('Monitorear glucosa c/4h.', 'Monitor BG q4h.')}</li>
                <li>• ${t('Hidratar con líquidos sin azúcar.', 'Hydrate with sugar-free fluids.')}</li>
                <li>• ${t('Checar cetonas si BG > 240.', 'Check ketones if BG > 240.')}</li>
              </ul>
            </div>
          </div>
        </section>
      `;
    }
  });
})();