// 26_high_risk_pharm_master.js
// Módulo de Farmacología de Alto Riesgo para NCLEX Masterclass
// AUTOR ORIGINAL: REYNIER DIAZ GERONES
// OPTIMIZACIÓN TÉCNICA: Senior Dev Synthesis
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // --- Helper: Traducción Bilingüe ---
  // Genera el markup estándar para el sistema de cambio de idioma
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: '26', // ID normalizado según v6/7
    title: { es: 'Farmacología Alto Riesgo', en: 'High Risk Pharmacology' },
    subtitle: { es: 'Insulina, Anticoagulantes y PINCH', en: 'Insulin, Anticoagulants & PINCH' },
    icon: 'pills',
    color: 'purple',

    // Método principal de renderizado
    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-triangle-exclamation"></i>
                ${t('Módulo Final 26', 'Final Module 26')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Farmacología de Alto Riesgo', 'High Risk Pharmacology')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('Medicamentos que matan si hay error. PINCH, Insulina y Cálculos.', 'Meds that kill on error. PINCH, Insulin & Calculations.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderPINCH()}
          ${this.renderInsulinMastery()}
          ${this.renderAnticoagulants()}
          ${this.renderMagnesiumDigoxin()}
          ${this.renderSafetyAdmin()}
          ${this.renderCalculations()}
        </div>
      `;
    },

    // --- 1. PINCH Mnemonic (Optimized Data Structure) ---
    renderPINCH() {
      const pinchItems = [
        { letter: 'P', title: t('Potasio (IV)', 'Potassium (IV)'), desc: t('NUNCA IV Push.', 'NEVER IV Push.'), color: 'text-purple-600', border: 'border-purple-500' },
        { letter: 'I', title: t('Insulina', 'Insulin'), desc: t('Doble chequeo. Jeringa de unidades.', 'Double check. Unit syringe.'), color: 'text-purple-600', border: 'border-purple-500' },
        { letter: 'N', title: t('Narcóticos', 'Narcotics'), desc: t('Opioides IV/PCA. Descarte con testigo.', 'IV Opioids/PCA. Witnessed waste.'), color: 'text-purple-600', border: 'border-purple-500' },
        { letter: 'C', title: t('Chemo', 'Chemotherapy'), desc: t('Vesicantes. Manejo especial.', 'Vesicants. Special handling.'), color: 'text-purple-600', border: 'border-purple-500' },
        { letter: 'H', title: t('Heparina', 'Heparin'), desc: t('Anticoagulantes IV.', 'IV Anticoagulants.'), color: 'text-purple-600', border: 'border-purple-500' }
      ];

      return `
        <section class="bg-white dark:bg-slate-800 rounded-2xl p-6 border-l-4 border-purple-500 shadow-sm">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <i class="fa-solid fa-triangle-exclamation text-purple-500"></i>
            ${t('Regla de Seguridad: "PINCH"', 'Safety Rule: "PINCH"')}
          </h2>
          <p class="text-sm text-slate-500 mb-6">
            ${t('Estos medicamentos requieren <strong>DOBLE CHEQUEO (2 RNs)</strong> antes de administrar.', 'These medications require <strong>DOUBLE CHECK (2 RNs)</strong> before administration.')}
          </p>
          
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            ${pinchItems.map(item => `
              <div class="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg hover:shadow-md transition-shadow">
                <div class="text-2xl font-black ${item.color}">${item.letter}</div>
                <div class="text-xs font-bold mt-1 text-slate-800 dark:text-slate-200">${item.title}</div>
                <p class="text-[10px] text-slate-500 leading-tight mt-1">${item.desc}</p>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    },

    // --- 2. Insulin Mastery (Protocol + Mixing) ---
    renderInsulinMastery() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Insulina & Diabetes', 'Insulin & Diabetes')}
            </h2>
          </div>

          <div class="bg-white dark:bg-brand-card p-4 md:p-6 rounded-3xl border border-blue-200 dark:border-blue-800 shadow-lg mb-6 overflow-hidden">
             <div class="overflow-x-auto">
               <table class="w-full text-sm text-left">
                 <thead class="bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 uppercase text-xs">
                   <tr>
                     <th class="p-3">${t('Tipo', 'Type')}</th>
                     <th class="p-3">${t('Ejemplo', 'Example')}</th>
                     <th class="p-3 font-bold text-red-600 dark:text-red-400">${t('Pico (Riesgo)', 'Peak (Risk)')}</th>
                     <th class="p-3">Nursing Tip</th>
                   </tr>
                 </thead>
                 <tbody class="divide-y divide-blue-100 dark:divide-blue-800">
                   <tr>
                     <td class="p-3 font-bold">${t('Rápida', 'Rapid')}</td>
                     <td class="p-3">Lispro / Aspart</td>
                     <td class="p-3 font-bold text-red-600">30 min - 1 hr</td>
                     <td class="p-3 text-xs">${t('Comida debe estar <strong>EN FRENTE</strong> del paciente.', 'Food must be <strong>IN FRONT</strong> of patient.')}</td>
                   </tr>
                   <tr>
                     <td class="p-3 font-bold">${t('Corta', 'Short')}</td>
                     <td class="p-3">Regular</td>
                     <td class="p-3 font-bold text-orange-500">2 - 4 hrs</td>
                     <td class="p-3 text-xs">${t('Única <strong>IV</strong>. Usada en DKA.', 'Only <strong>IV</strong> type. Used in DKA.')}</td>
                   </tr>
                   <tr>
                     <td class="p-3 font-bold">${t('Intermedia', 'Intermediate')}</td>
                     <td class="p-3">NPH</td>
                     <td class="p-3 font-bold text-yellow-600">4 - 12 hrs</td>
                     <td class="p-3 text-xs">${t('Nubosa. Dar snack a media tarde.', 'Cloudy. Give mid-afternoon snack.')}</td>
                   </tr>
                   <tr>
                     <td class="p-3 font-bold">${t('Larga', 'Long')}</td>
                     <td class="p-3">Glargine (Lantus)</td>
                     <td class="p-3 text-green-600">NO PEAK</td>
                     <td class="p-3 text-xs text-red-500 font-bold">${t('NO MEZCLAR.', 'DO NOT MIX.')}</td>
                   </tr>
                 </tbody>
               </table>
             </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border-l-4 border-blue-500">
                 <h3 class="font-bold text-blue-800 dark:text-blue-300 mb-2 text-lg">
                   ${t('Mezcla de Insulinas', 'Insulin Mixing')}
                 </h3>
                 <p class="text-sm mb-3">
                    <span class="font-bold bg-white dark:bg-black px-2 py-1 rounded text-blue-700 shadow-sm">RN (Regular -> NPH)</span>
                    <br>
                    <span class="text-xs italic">"Clear before Cloudy"</span>
                 </p>
                 <ol class="list-decimal list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>${t('Aire en NPH (Nubosa)', 'Air into NPH (Cloudy)')}</li>
                    <li>${t('Aire en Regular (Clara)', 'Air into Regular (Clear)')}</li>
                    <li>${t('Aspirar <strong>Regular</strong>', 'Draw up <strong>Regular</strong>')}</li>
                    <li>${t('Aspirar <strong>NPH</strong>', 'Draw up <strong>NPH</strong>')}</li>
                 </ol>
              </div>

              <div class="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                 <h3 class="font-bold text-slate-800 dark:text-slate-300 mb-2 text-lg">
                    ${t('Hipoglucemia', 'Hypoglycemia')}
                 </h3>
                 <div class="space-y-3 text-sm">
                    <div>
                        <strong class="text-orange-600">Consciente (Regla 15/15):</strong><br>
                        ${t('15g Carbohidratos (jugo, tabletas). Revaluar en 15 min.', '15g Carbs (juice, tabs). Recheck in 15 min.')}
                    </div>
                    <div>
                        <strong class="text-red-600">Inconsciente:</strong><br>
                        ${t('Glucagón 1mg IM/SubQ o Dextrosa 50% IV.', 'Glucagon 1mg IM/SubQ or Dextrose 50% IV.')}
                        <br>
                        <span class="text-xs italic bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">${t('Posición lateral (riesgo vómito).', 'Side-lying position (aspiration risk).')}</span>
                    </div>
                 </div>
              </div>
          </div>
        </section>
      `;
    },

    // --- 3. Anticoagulants (Heparin vs Warfarin) ---
    renderAnticoagulants() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Heparina vs Warfarina', 'Heparin vs Warfarin')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
             
             <div class="bg-white dark:bg-slate-800 p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-black text-slate-900 dark:text-white">HEPARIN</h3>
                    <span class="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded uppercase">${t('Rápida IV/SQ', 'Fast IV/SQ')}</span>
                </div>
                <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                   <li class="flex justify-between">
                     <span>Lab:</span> <span class="font-bold font-mono">aPTT</span>
                   </li>
                   <li class="flex justify-between">
                     <span>Normal:</span> <span class="font-mono">30-40 sec</span>
                   </li>
                   <li class="flex justify-between text-blue-600 font-bold">
                     <span>${t('Terapéutico:', 'Therapeutic:')}</span> <span class="font-mono">60-80 sec</span>
                   </li>
                   <li class="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
                     <span class="block text-xs text-gray-500 uppercase font-bold text-center mb-1">Antidote</span>
                     <div class="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold text-center p-2 rounded">
                        ${t('Sulfato de Protamina', 'Protamine Sulfate')}
                     </div>
                   </li>
                   <li class="text-center text-xs text-green-600 font-bold mt-2">
                     <i class="fa-solid fa-check-circle"></i> ${t('Seguro en Embarazo', 'Safe in Pregnancy')}
                   </li>
                </ul>
             </div>

             <div class="bg-white dark:bg-slate-800 p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-black text-slate-900 dark:text-white">WARFARIN</h3>
                    <span class="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-1 rounded uppercase">${t('Lenta Oral', 'Slow Oral')}</span>
                </div>
                <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                   <li class="flex justify-between">
                     <span>Lab:</span> <span class="font-bold font-mono">PT / INR</span>
                   </li>
                   <li class="flex justify-between">
                     <span>Normal INR:</span> <span class="font-mono">0.8 - 1.1</span>
                   </li>
                   <li class="flex justify-between text-orange-600 font-bold">
                     <span>${t('Terapéutico:', 'Therapeutic:')}</span> <span class="font-mono">2.0 - 3.0</span>
                   </li>
                   <li class="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
                     <span class="block text-xs text-gray-500 uppercase font-bold text-center mb-1">Antidote</span>
                     <div class="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold text-center p-2 rounded">
                        ${t('Vitamina K', 'Vitamin K')}
                     </div>
                   </li>
                   <li class="text-center text-xs text-slate-500 italic mt-2 px-2">
                     ${t('Mantener ingesta constante de vegetales verdes.', 'Consistent intake of green leafy veggies.')}
                   </li>
                </ul>
             </div>
          </div>
          
          <div class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800 text-center">
             <p class="text-sm font-medium text-yellow-800 dark:text-yellow-300">
               <i class="fa-solid fa-bridge mr-2"></i>
               ${t('<strong>Terapia Puente:</strong> Heparina + Warfarina juntas hasta INR terapéutico.', '<strong>Bridge Therapy:</strong> Heparin + Warfarin together until INR is therapeutic.')}
             </p>
          </div>
        </section>
      `;
    },

    // --- 4. Magnesium & Digoxin (Comprehensive) ---
    renderMagnesiumDigoxin() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Magnesio y Digoxina', 'Magnesium & Digoxin')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex flex-col h-full">
                <strong class="text-lg text-emerald-800 dark:text-emerald-300 block mb-2">Magnesium Sulfate</strong>
                <p class="text-xs text-gray-500 mb-3 uppercase font-bold tracking-wide">"Mag is a Drag" (CNS Depressant)</p>
                
                <div class="flex-grow text-sm text-gray-700 dark:text-gray-300 space-y-2">
                   <p><strong>Uso:</strong> Pre-eclampsia (prevenir convulsiones), Torsades.</p>
                   <div class="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                       <strong class="block text-xs mb-1">Toxicidad (BURP):</strong>
                       <ul class="list-disc list-inside ml-1 text-xs space-y-1">
                         <li><strong>B</strong>P Drop (Hipotensión)</li>
                         <li><strong>U</strong>rine Output Drop (< 30ml/hr)</li>
                         <li><strong>R</strong>espirations Drop (< 12/min)</li>
                         <li><strong>P</strong>atellar Reflex absent (Arreflexia)</li>
                       </ul>
                   </div>
                </div>
                <div class="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-800">
                    <span class="text-xs font-bold text-red-600 block">Antídoto:</span>
                    <span class="font-bold text-slate-800 dark:text-white">Gluconato de Calcio (Calcium Gluconate)</span>
                </div>
             </div>

             <div class="p-5 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-200 dark:border-yellow-800 flex flex-col h-full">
                <strong class="text-lg text-yellow-800 dark:text-yellow-300 block mb-2">Digoxin (Lanoxin)</strong>
                <p class="text-xs text-gray-500 mb-3 uppercase font-bold tracking-wide">Inotrópico (+) / Cronotrópico (-)</p>
                
                <div class="flex-grow text-sm text-gray-700 dark:text-gray-300 space-y-2">
                   <p><strong>Rango Terapéutico:</strong> 0.5 - 2.0 ng/mL</p>
                   <div class="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                       <strong class="block text-xs mb-1 text-red-600">${t('REGLAS CRÍTICAS', 'CRITICAL RULES')}</strong>
                       <ul class="list-disc list-inside ml-1 text-xs space-y-1">
                         <li>${t('Pulso Apical 1 min completo.', 'Apical Pulse 1 full min.')}</li>
                         <li>${t('Retener Adultos: < 60 bpm', 'Hold Adults: < 60 bpm')}</li>
                         <li>${t('Retener Bebés: < 90 bpm', 'Hold Infants: < 90 bpm')}</li>
                         <li>${t('Hipokalemia = ↑ Riesgo Toxicidad', 'Hypokalemia = ↑ Toxicity Risk')}</li>
                       </ul>
                   </div>
                   <p class="text-xs mt-2"><strong>Toxicidad:</strong> N/V, Anorexia, <span class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">Halos visuales</span>.</p>
                </div>
                <div class="mt-4 pt-3 border-t border-yellow-200 dark:border-yellow-800">
                    <span class="text-xs font-bold text-red-600 block">Antídoto:</span>
                    <span class="font-bold text-slate-800 dark:text-white">Digibind (Immune Fab)</span>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 5. Safety & Admin (Consolidated) ---
    renderSafetyAdmin() {
      return `
        <section class="mt-8">
           <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700">
              <h3 class="font-bold text-gray-900 dark:text-white mb-4 text-lg">
                 ${t('Administración Segura', 'Safe Administration')}
              </h3>
              
              <div class="grid md:grid-cols-3 gap-6 text-sm text-gray-700 dark:text-gray-300">
                 <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2 text-red-600 font-bold">
                        <i class="fa-solid fa-ban"></i>
                        <span>${t('NO Triturar', 'Do Not Crush')}</span>
                    </div>
                    <p class="text-xs bg-white dark:bg-slate-700 p-3 rounded border border-gray-100 dark:border-gray-600">
                       SR (Sustained Release), ER (Extended), XL, LA, ${t('Recubrimiento Entérico', 'Enteric Coated')}.
                    </p>
                 </div>

                 <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2 text-blue-600 font-bold">
                        <i class="fa-solid fa-note-sticky"></i>
                        <span>${t('Parches', 'Transdermal')}</span>
                    </div>
                    <p class="text-xs bg-white dark:bg-slate-700 p-3 rounded border border-gray-100 dark:border-gray-600">
                       ${t('Quitar viejo. Rotar sitio. Piel sin vello. NO cortar. NO calor.', 'Remove old. Rotate site. Hairless skin. NO cut. NO heat.')}
                    </p>
                 </div>

                 <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2 text-purple-600 font-bold">
                        <i class="fa-solid fa-eye-dropper"></i>
                        <span>${t('Oftálmico', 'Ophthalmic')}</span>
                    </div>
                    <p class="text-xs bg-white dark:bg-slate-700 p-3 rounded border border-gray-100 dark:border-gray-600">
                       ${t('Saco conjuntival. Presionar canto interno (evita sistémico). Esperar 5 min.', 'Conjunctival sac. Press inner canthus (prevent systemic). Wait 5 min.')}
                    </p>
                 </div>
              </div>
           </div>
        </section>
      `;
    },

    // --- 6. Calculations (Critical for NCLEX) ---
    renderCalculations() {
      return `
        <section class="mt-8 mb-12">
           <div class="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
              <h3 class="font-bold text-xl mb-6 text-yellow-400 flex items-center gap-2">
                 <i class="fa-solid fa-calculator"></i> 
                 ${t('Cálculos Críticos', 'Critical Calculations')}
              </h3>
              
              <div class="grid md:grid-cols-3 gap-6 text-sm">
                 <div class="bg-white/10 p-4 rounded-xl border border-white/10 hover:border-yellow-400/50 transition-colors">
                    <strong class="block text-green-300 mb-2">Basic Dose</strong>
                    <div class="font-mono text-lg mb-2 text-center bg-black/30 p-2 rounded text-white">
                       (D / H) x Q = X
                    </div>
                    <span class="text-xs text-gray-400 block text-center">Desired / Have x Quantity</span>
                 </div>
                 
                 <div class="bg-white/10 p-4 rounded-xl border border-white/10 hover:border-yellow-400/50 transition-colors">
                    <strong class="block text-blue-300 mb-2">IV Flow Rate (mL/hr)</strong>
                    <div class="font-mono text-lg mb-2 text-center bg-black/30 p-2 rounded text-white">
                       Total Vol / Total Hours
                    </div>
                    <span class="text-xs text-gray-400 block text-center">Pump Setting</span>
                 </div>

                 <div class="bg-white/10 p-4 rounded-xl border border-white/10 hover:border-yellow-400/50 transition-colors">
                    <strong class="block text-purple-300 mb-2">Drip Rate (gtt/min)</strong>
                    <div class="font-mono text-lg mb-2 text-center bg-black/30 p-2 rounded text-white">
                       (Vol x DF) / Minutes
                    </div>
                    <span class="text-xs text-gray-400 block text-center">DF = Drop Factor (10, 15, 20, 60)</span>
                 </div>
              </div>
           </div>
        </section>
      `;
    }
  });
})();