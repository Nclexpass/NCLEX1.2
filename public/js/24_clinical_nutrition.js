// 24_clinical_nutrition.js — Clinical Nutrition & Diet Therapy Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: Renal, Cardiac, GI & Interactions
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Enfoque: Dietas Terapéuticas, Seguridad Alimentaria y Soporte Nutricional.

(function() {
  'use strict';

  // Helper interno para traducción limpia y reducción de código repetitivo
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: '24', // ID Estandarizado
    title: { es: 'Nutrición Clínica', en: 'Clinical Nutrition' },
    subtitle: { es: 'Dietas Renales, Cardíacas y GI', en: 'Renal, Cardiac & GI Diets' },
    icon: 'carrot',
    color: 'green',

    // Método principal de renderizado que orquesta las secciones
    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-utensils"></i>
                ${t('Módulo Final 24', 'Final Module 24')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Nutrición Clínica', 'Clinical Nutrition')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('La comida como medicina. Protocolos dietéticos para condiciones agudas y crónicas.', 'Food as medicine. Dietary protocols for acute and chronic conditions.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderRenalDiet()}
          ${this.renderGIPathologies()}
          ${this.renderDiabetesHypoglycemia()}
          ${this.renderCardiacDiet()}
          ${this.renderDrugFoodInteractions()}
          ${this.renderEnteralParenteral()}
        </div>
      `;
    },

    // --- 1. Renal Diet (CKD & ESRD) ---
    renderRenalDiet() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-white font-black text-xl shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Dieta Renal (CKD & ESRD)', 'Renal Diet (CKD & ESRD)')}
            </h2>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border-l-4 border-yellow-500 shadow-sm">
            <p class="text-sm text-slate-500 mb-4 italic">
                <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                ${t('El riñón enfermo no filtra bien. Todo se acumula. La dieta es RESTRICTIVA.', "The sick kidney doesn't filter well. Everything accumulates. Diet is RESTRICTIVE.")}
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl">
                    <h3 class="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-ban"></i> 
                        ${t('EVITAR / RESTRINGIR', 'AVOID / RESTRICT')}
                    </h3>
                    <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        <li>
                            <strong class="block text-red-600 dark:text-red-400">Sodium (Na):</strong>
                            ${t('Sal de mesa, enlatados, embutidos. (Retiene agua -> Edema/HTN).', 'Table salt, canned foods, cold cuts. (Retains water -> Edema/HTN).')}
                        </li>
                        <li>
                            <strong class="block text-red-600 dark:text-red-400">Potassium (K):</strong>
                            ${t('Plátanos, Naranjas, Papas, Espinaca, Tomates. (Riesgo Paro Cardíaco).', 'Bananas, Oranges, Potatoes, Spinach, Tomatoes. (Risk of Cardiac Arrest).')}
                        </li>
                        <li>
                            <strong class="block text-red-600 dark:text-red-400">Phosphorus (P):</strong>
                            ${t('Lácteos, Refrescos oscuros (Colas), Nueces. (Huesos frágiles).', 'Dairy, Dark sodas (Colas), Nuts. (Brittle bones).')}
                        </li>
                    </ul>
                </div>
                <div class="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl">
                    <h3 class="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-check"></i>
                        ${t('PERMITIDO / RECOMENDADO', 'ALLOWED / RECOMMENDED')}
                    </h3>
                    <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        <li>
                            <strong class="block text-green-600 dark:text-green-400">Carbs:</strong>
                            ${t('Pan blanco, arroz blanco, pasta. (Menos P/K que integrales).', 'White bread, white rice, pasta. (Lower P/K than whole grains).')}
                        </li>
                        <li>
                            <strong class="block text-green-600 dark:text-green-400">Protein:</strong>
                            ${t('Alta calidad (Huevo, Pollo) pero CONTROLADA. (Exceso sube BUN).', 'High quality (Egg, Chicken) but CONTROLLED. (Excess raises BUN).')}
                        </li>
                        <li>
                            <strong class="block text-green-600 dark:text-green-400">Fruits:</strong>
                            ${t('Manzanas, Uvas, Piña, Berries/Arándanos.', 'Apples, Grapes, Pineapple, Berries/Blueberries.')}
                        </li>
                    </ul>
                </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. GI Pathologies ---
    renderGIPathologies() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Patologías Gastrointestinales', 'Gastrointestinal Pathologies')}
            </h2>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border-t-4 border-orange-400 hover:shadow-md transition-shadow">
                    <h3 class="font-bold text-lg mb-2 text-orange-700 dark:text-orange-300">${t('Enfermedad Celíaca', 'Celiac Disease')}</h3>
                    <div class="bg-orange-50 dark:bg-orange-900/20 p-2 rounded text-xs text-center font-bold mb-2 text-orange-800 dark:text-orange-200">
                        NO "BROW" (Gluten)
                    </div>
                    <ul class="text-xs space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li><strong>B</strong>arley (${t('Cebada', 'Barley')})</li>
                        <li><strong>R</strong>ye (${t('Centeno', 'Rye')})</li>
                        <li><strong>O</strong>ats (${t('Avena - contam.', 'Oats - contam.')})</li>
                        <li><strong>W</strong>heat (${t('Trigo', 'Wheat')})</li>
                    </ul>
                    <p class="text-xs mt-3 font-bold text-green-600 pt-2 border-t border-gray-100 dark:border-gray-700">OK: Rice, Corn, Potato, Quinoa.</p>
                </div>

                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border-t-4 border-purple-400 hover:shadow-md transition-shadow">
                    <h3 class="font-bold text-lg mb-2 text-purple-700 dark:text-purple-300">Diverticulitis</h3>
                    <div class="space-y-3 text-xs text-gray-600 dark:text-gray-400">
                        <div>
                            <span class="font-bold text-xs uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded">${t('Fase Aguda', 'Acute Phase')}</span>
                            <div class="mt-1 pl-1">NPO -> Liq. Claros -> <strong>${t('Baja Fibra', 'Low Fiber')}</strong>.</div>
                        </div>
                        <div>
                            <span class="font-bold text-xs uppercase bg-green-100 text-green-800 px-2 py-0.5 rounded">${t('Mantenimiento', 'Maintenance')}</span>
                            <div class="mt-1 pl-1"><strong>${t('Alta Fibra', 'High Fiber')}</strong> + ${t('Mucha Agua', 'High Fluids')}.</div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border-t-4 border-blue-400 hover:shadow-md transition-shadow">
                    <h3 class="font-bold text-lg mb-2 text-blue-700 dark:text-blue-300">IBD (Crohn's/UC)</h3>
                    <ul class="text-xs space-y-2 mt-2 text-gray-600 dark:text-gray-400">
                        <li>
                            <strong>${t('Dieta:', 'Diet:')}</strong> ${t('Alta Caloría, Alta Proteína.', 'High Calorie, High Protein.')}
                        </li>
                        <li>
                            <strong>${t('Evitar:', 'Avoid:')}</strong> ${t('Alta fibra (crisis), lácteos, picante.', 'High fiber (flare-ups), dairy, spicy.')}
                        </li>
                        <li class="text-red-500 font-bold text-[10px] uppercase">
                             ⚠️ ${t('Riesgo Desnutrición', 'Malnutrition Risk')}
                        </li>
                    </ul>
                </div>
                
                <div class="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border-t-4 border-teal-400 hover:shadow-md transition-shadow">
                    <h3 class="font-bold text-lg mb-2 text-teal-700 dark:text-teal-300">Dumping Syndrome</h3>
                    <p class="text-[10px] text-slate-400 mb-2">${t('Post-Gastrectomía / Vaciamiento rápido', 'Post-Gastrectomy / Rapid emptying')}</p>
                    <ul class="text-xs space-y-2 mt-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>${t('Alta Proteína/Grasa', 'High Protein/Fat')}, <strong>${t('BAJO Carb', 'LOW Carb')}</strong>.</li>
                        <li><strong class="text-red-500">${t('NO LÍQUIDOS', 'NO FLUIDS')}</strong> ${t('con comida (esperar 30m).', 'w/ meals (wait 30m).')}</li>
                        <li><strong>${t('Acostarse', 'Lie down')}</strong> ${t('tras comer.', 'after eating.')}</li>
                    </ul>
                </div>
            </div>
        </section>
      `;
    },

    // --- 3. Diabetes & Hypoglycemia ---
    renderDiabetesHypoglycemia() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Diabetes & Hipoglucemia', 'Diabetes & Hypoglycemia')}
            </h2>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
            <div class="md:flex gap-6 items-start">
                <div class="flex-1">
                    <h3 class="font-bold text-lg text-blue-800 dark:text-blue-300 mb-2">
                        ${t('Regla 15/15 (Hipoglucemia &lt; 70)', '15/15 Rule (Hypoglycemia &lt; 70)')}
                    </h3>
                    <ol class="list-decimal list-inside text-sm space-y-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                        <li>${t('Consumir <strong>15g</strong> carbos simples (4oz jugo naranja/soda regular).', 'Consume <strong>15g</strong> simple carbs (4oz OJ/regular soda).')}</li>
                        <li>${t('Esperar <strong>15 minutos</strong> y rechequear glucosa.', 'Wait <strong>15 minutes</strong> and recheck glucose.')}</li>
                        <li>${t('Si sigue &lt; 70, REPETIR. Si &gt; 70, dar carbo complejo + proteína.', 'If &lt; 70, REPEAT. If &gt; 70, give complex carb + protein.')}</li>
                    </ol>
                    <div class="mt-3 bg-red-100 text-red-800 text-xs p-3 rounded-lg font-bold border border-red-200 flex items-center gap-2">
                        <i class="fa-solid fa-syringe"></i>
                        ${t('SI INCONSCIENTE: Glucagón IM o Dextrosa 50% (D50W) IV.', 'IF UNCONSCIOUS: Glucagon IM or Dextrose 50% (D50W) IV.')}
                    </div>
                </div>
                <div class="flex-1 mt-4 md:mt-0 bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 class="font-bold text-sm text-blue-600 mb-2 uppercase">${t('Dieta Diabética', 'Diabetic Diet')}</h4>
                    <ul class="text-sm space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>Carbs:</strong> ${t('Consistentes (45-60g/comida). Complejos > Simples.', 'Consistent (45-60g/meal). Complex > Simple.')}</li>
                        <li><strong>Fiber:</strong> ${t('ALTA (Enlentece absorción de glucosa).', 'HIGH (Slows glucose absorption).')}</li>
                    </ul>
                </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Cardiac Diet ---
    renderCardiacDiet() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-pink-600 flex items-center justify-center text-white font-black text-xl shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Dieta Cardíaca (DASH & HF)', 'Cardiac Diet (DASH & HF)')}
            </h2>
          </div>

          <div class="bg-pink-50 dark:bg-pink-900/10 p-6 rounded-2xl border border-pink-200 dark:border-pink-800">
            <div class="md:flex gap-6 items-center">
                <div class="flex-1">
                    <h3 class="font-bold text-lg text-pink-800 dark:text-pink-300">DASH (Hypertension)</h3>
                    <ul class="list-disc list-inside text-sm space-y-2 mt-2 text-slate-700 dark:text-slate-300">
                        <li><strong>Low Sodium:</strong> Ideal &lt; 1,500 mg/day.</li>
                        <li><strong>High:</strong> ${t('Frutas, vegetales, granos enteros.', 'Fruits, veggies, whole grains.')}</li>
                        <li><strong>Rich in:</strong> <span class="font-bold text-pink-600">Mg, Ca, K</span> ${t('(Bajan la Presión Arterial).', '(Lower Blood Pressure).')}</li>
                    </ul>
                </div>
                <div class="flex-1 mt-4 md:mt-0 bg-white dark:bg-slate-800 p-4 rounded-xl border border-pink-200 dark:border-pink-800">
                    <h4 class="font-bold text-sm text-red-600 mb-2 uppercase">${t('Falla Cardíaca (HF)', 'Heart Failure (HF)')}</h4>
                    <ul class="text-sm space-y-2 text-slate-600 dark:text-slate-400">
                        <li><i class="fa-solid fa-droplet-slash text-blue-400 mr-2"></i> <strong>Fluids:</strong> ${t('Restricción', 'Restrict')} &lt; 2L/day.</li>
                        <li><i class="fa-solid fa-scale-balanced text-slate-400 mr-2"></i> <strong>Daily Weight:</strong> ${t('Misma hora/ropa/báscula.', 'Same time/clothes/scale.')}</li>
                        <li class="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-bold">
                             ${t('Reportar: Ganancia >2-3 lbs/día o 5 lbs/sem.', 'Report: Gain >2-3 lbs/day or 5 lbs/week.')}
                        </li>
                    </ul>
                </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 5. Drug-Food Interactions ---
    renderDrugFoodInteractions() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Interacciones Fármaco-Alimento', 'Drug-Food Interactions')}
            </h2>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <table class="w-full text-sm text-left bg-white dark:bg-slate-800">
                    <thead class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 uppercase text-xs">
                        <tr>
                            <th class="p-3">Drug</th>
                            <th class="p-3">Food to Control</th>
                            <th class="p-3">Reason</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 dark:divide-slate-600">
                        <tr>
                            <td class="p-3 font-bold text-blue-600">Warfarin (Coumadin)</td>
                            <td class="p-3">
                                <strong>Vitamin K</strong><br>
                                <span class="text-xs text-slate-500">${t('Vegetales hoja verde (Espinaca/Kale)', 'Green leafy veg (Spinach/Kale)')}</span>
                            </td>
                            <td class="p-3 text-xs">
                                ${t('Antagonista. Mantener ingesta CONSTANTE, no eliminar.', 'Antagonist. Maintain CONSISTENT intake.')}
                            </td>
                        </tr>
                        <tr>
                            <td class="p-3 font-bold text-purple-600">MAOIs</td>
                            <td class="p-3">
                                <strong>Tyramine</strong><br>
                                <span class="text-xs text-slate-500">${t('Quesos añejos, Vino, Carnes curadas', 'Aged cheese, Wine, Cured meats')}</span>
                            </td>
                            <td class="p-3 text-xs text-red-600 font-bold">
                                ${t('Crisis Hipertensiva Severa.', 'Severe Hypertensive Crisis.')}
                            </td>
                        </tr>
                        <tr>
                            <td class="p-3 font-bold text-green-600">Statins / CCBs</td>
                            <td class="p-3"><strong>Grapefruit Juice</strong></td>
                            <td class="p-3 text-xs">${t('Toxicidad del fármaco.', 'Drug toxicity.')}</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-bold text-yellow-600">Iron (Oral)</td>
                            <td class="p-3">
                                ${t('Dar con <strong>Vit C</strong>. NO Calcio/Leche.', 'Give w/ <strong>Vit C</strong>. NO Calcium/Milk.')}
                            </td>
                            <td class="p-3 text-xs">${t('Vit C ↑ absorción. Ca++ bloquea.', 'Vit C ↑ absorption. Ca++ blocks.')}</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-bold text-pink-600">Lithium</td>
                            <td class="p-3"><strong>Sodium (Na)</strong> & Water</td>
                            <td class="p-3 text-xs">
                                ${t('Inverso: Bajo Na = Toxicidad. Alto Na = Ineficaz.', 'Inverse: Low Na = Toxicity. High Na = Ineffective.')}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
      `;
    },

    // --- 6. Enteral & Parenteral ---
    renderEnteralParenteral() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Soporte Nutricional', 'Nutritional Support')}
            </h2>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow border-l-4 border-indigo-500">
                <h3 class="font-bold text-lg mb-3 text-indigo-700 dark:text-indigo-400">
                    ${t('Enteral (NG Tube/PEG)', 'Enteral (NG Tube/PEG)')}
                </h3>
                <ul class="text-sm space-y-3 text-slate-700 dark:text-slate-300">
                    <li class="flex items-start gap-2">
                        <i class="fa-solid fa-angle-up mt-1 text-indigo-400"></i>
                        <span><strong>Position:</strong> ${t('Cabecera (HOB) 30-45° SIEMPRE para prevenir aspiración.', 'HOB 30-45° ALWAYS to prevent aspiration.')}</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="fa-solid fa-flask mt-1 text-indigo-400"></i>
                        <span><strong>Residual:</strong> ${t('Chequear c/4h. Retorno si &lt;500ml (ver protocolo).', 'Check q4h. Return if &lt;500ml (check policy).')}</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="fa-solid fa-x-ray mt-1 text-indigo-400"></i>
                        <span><strong>Placement:</strong> ${t('Rayos-X (Gold Std) o pH gástrico < 5.', 'X-Ray (Gold Std) or gastric pH < 5.')}</span>
                    </li>
                </ul>
            </div>
            
            <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow border-l-4 border-cyan-500">
                <h3 class="font-bold text-lg mb-3 text-cyan-700 dark:text-cyan-400">
                    ${t('Parenteral (TPN)', 'Parenteral (TPN)')}
                </h3>
                <p class="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">${t('Vía Central / PICC Requerido', 'Central Line / PICC Required')}</p>
                <ul class="text-sm space-y-3 text-slate-700 dark:text-slate-300">
                    <li class="flex items-start gap-2">
                        <i class="fa-solid fa-hand-sparkles mt-1 text-cyan-400"></i>
                        <span><strong>Sterile:</strong> ${t('Cambio tubo/bolsa c/24h estricto.', 'Change tubing/bag q24h strict.')}</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="fa-solid fa-kit-medical mt-1 text-cyan-400"></i>
                        <span><strong>Emergency:</strong> ${t('Si se acaba TPN -> Colgar <strong>Dextrosa 10% (D10W)</strong>.', 'If TPN runs out -> Hang <strong>Dextrose 10% (D10W)</strong>.')}</span>
                    </li>
                    <li class="bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                        <strong class="text-red-600 block">Refeeding Syndrome:</strong>
                        <span class="text-xs">${t('Caída rápida de P, K, Mg. Riesgo Cardíaco. Iniciar lento.', 'Rapid drop in P, K, Mg. Cardiac Risk. Start slow.')}</span>
                    </li>
                </ul>
            </div>
          </div>
        </section>
      `;
    }
  });
})();