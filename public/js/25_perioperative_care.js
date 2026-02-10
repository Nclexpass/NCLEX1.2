// 25_perioperative_care_MASTER.js — Perioperative Nursing Masterclass (NCLEX)
// VERSIÓN DEFINITIVA: Fusión de Contenido (v6, v7.1, v7.2) + Arquitectura Técnica (v8)
// AUTOR ORIGINAL: REYNIER DIAZ GERONES
// OPTIMIZADO: Senior Dev Refactor + Content Synthesis
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // Helper de traducción para reducir ruido visual en el código
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'perioperative',
    title: { es: 'Cuidados Perioperatorios', en: 'Perioperative Care' },
    subtitle: { es: 'Pre, Intra y Post-Op Safety', en: 'Pre, Intra & Post-Op Safety' },
    icon: 'user-doctor', // Icono unificado
    color: 'teal',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-hospital-user"></i>
                <span>${t('Módulo Final 25', 'Final Module 25')}</span>
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Enfermería Perioperatoria', 'Perioperative Nursing')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('Seguridad desde el ingreso hasta el alta. Protocolos universales y emergencias.', 'Safety from admission to discharge. Universal protocols & emergencies.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderPreOp()}
          ${this.renderIntraOp()}
          ${this.renderPostOpPACU()}
          ${this.renderSurgicalEmergencies()}
          ${this.renderWoundCare()}
        </div>
      `;
    },

    // --- 1. Pre-Operative (Consent + Meds + Allergies) ---
    renderPreOp() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Pre-Operatorio', 'Pre-Operative')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-teal-200 dark:border-teal-800 shadow-lg">
              <strong class="text-xl text-teal-800 dark:text-teal-300 block mb-4 flex items-center gap-2">
                <i class="fa-solid fa-file-signature"></i>
                ${t('Consentimiento Informado', 'Informed Consent')}
              </strong>
              
              <div class="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <div class="p-3 bg-teal-50 dark:bg-teal-900/10 rounded-xl">
                   <strong class="block text-teal-700 dark:text-teal-400 mb-1">Surgeon's Role (Provider):</strong>
                   ${t('Explica el procedimiento, riesgos, beneficios y alternativas.', 'Explains procedure, risks, benefits, alternatives.')}
                </div>
                <div class="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border-l-4 border-blue-500">
                   <strong class="block text-blue-700 dark:text-blue-400 mb-1">Nurse's Role (WITNESS):</strong>
                   <ul class="list-disc list-inside space-y-1">
                     <li>${t('Testigo de firma voluntaria.', 'Witness voluntary signature.')}</li>
                     <li>${t('Defensor: Verificar que el paciente está alerta (NO sedado).', 'Advocate: Verify patient is alert (NOT sedated).')}</li>
                     <li>${t('Si tiene dudas -> <strong>NO firmar y LLAMAR AL MD</strong>.', 'If doubts -> <strong>DO NOT sign & CALL MD</strong>.')}</li>
                   </ul>
                </div>
              </div>
            </div>

            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <strong class="text-xl text-gray-900 dark:text-white block mb-4">
                ${t('Seguridad y Preparación', 'Safety & Prep')}
              </strong>
              <ul class="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <li class="flex items-start gap-2">
                  <i class="fa-solid fa-ban text-red-500 mt-1"></i>
                  <div>
                    <strong class="text-gray-900 dark:text-white">NPO:</strong> 
                    ${t('6-8h sólidos, 2h líquidos claros. Prevenir broncoaspiración.', '6-8h solids, 2h clear liquids. Prevent aspiration pneumonia.')}
                  </div>
                </li>
                <li class="flex items-start gap-2">
                  <i class="fa-solid fa-triangle-exclamation text-yellow-500 mt-1"></i>
                  <div>
                    <strong class="text-gray-900 dark:text-white">Allergies (Red Flags):</strong> 
                    <br>• ${t('Látex (Asociado a: Plátano, Kiwi, Aguacate).', 'Latex (Linked to: Banana, Kiwi, Avocado).')}
                    <br>• ${t('Yodo/Mariscos (Betadine/Contraste).', 'Iodine/Shellfish (Betadine/Contrast).')}
                  </div>
                </li>
                <li class="flex items-start gap-2">
                  <i class="fa-solid fa-pills text-blue-500 mt-1"></i>
                  <div>
                    <strong class="text-gray-900 dark:text-white">Meds Management:</strong> 
                    <br>• ${t('<strong>Suspender:</strong> Anticoagulantes (Warfarina 5-7 días antes).', '<strong>Hold:</strong> Anticoagulants (Warfarin 5-7 days prior).')}
                    <br>• ${t('<strong>Administrar:</strong> Beta-bloqueadores, Anticonvulsivos (sorbo agua).', '<strong>Give:</strong> Beta-blockers, Anticonvulsants (sip of water).')}
                    <br>• ${t('<strong>Insulina:</strong> Consultar MD (Dosis reducida).', '<strong>Insulin:</strong> Consult MD (Reduced dose).')}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. Intra-Operative (Time Out, MH, Asepsis) ---
    renderIntraOp() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Intra-Operatorio', 'Intra-Operative')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
             <div class="p-6 bg-slate-900 text-white rounded-3xl shadow-xl">
               <strong class="text-yellow-400 text-xl block mb-4">
                 <i class="fa-solid fa-pause mr-2"></i> Universal Protocol (Time-Out)
               </strong>
               <p class="text-sm text-gray-300 mb-4">
                 ${t('Pausa obligatoria antes de la incisión. Todo el equipo se detiene.', 'Mandatory pause before incision. Entire team stops.')}
               </p>
               <ul class="space-y-2 text-sm font-bold">
                 <li class="flex items-center gap-2"><i class="fa-solid fa-check text-green-400"></i> Correct Patient</li>
                 <li class="flex items-center gap-2"><i class="fa-solid fa-check text-green-400"></i> Correct Site (Marked)</li>
                 <li class="flex items-center gap-2"><i class="fa-solid fa-check text-green-400"></i> Correct Procedure</li>
               </ul>
             </div>

             <div class="p-6 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800 shadow-md">
               <strong class="text-red-800 dark:text-red-300 text-xl block mb-3 flex items-center gap-2">
                 <i class="fa-solid fa-fire-flame-curved"></i>
                 ${t('Hipertermia Maligna (MH)', 'Malignant Hyperthermia (MH)')}
               </strong>
               <p class="text-xs text-red-600 dark:text-red-400 font-bold uppercase mb-2">Medical Emergency (Genetic)</p>
               <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                 <li>• <strong>Trigger:</strong> ${t('Anestesia (Succinylcholine, Gases).', 'Anesthesia (Succinylcholine, Gases).')}</li>
                 <li>• <strong>Early Sign:</strong> ${t('Taquicardia, <span class="text-red-600 font-bold">Rigidez Mandibular</span>.', 'Tachycardia, <span class="text-red-600 font-bold">Jaw Rigidity</span>.')}</li>
                 <li>• <strong>Late Sign:</strong> ${t('Fiebre extremadamente alta.', 'Extremely high fever.')}</li>
                 <li class="mt-2 pt-2 border-t border-red-200 dark:border-red-800">
                    <strong>Tx:</strong> <span class="bg-red-100 text-red-800 px-2 py-1 rounded font-bold">DANTROLENE (Dantrium)</span>
                 </li>
               </ul>
             </div>
          </div>

          <div class="bg-indigo-50 dark:bg-slate-700/30 p-5 rounded-2xl border border-indigo-100 dark:border-slate-600">
            <h3 class="font-bold text-indigo-900 dark:text-indigo-200 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-hands-bubbles text-indigo-500"></i>
                ${t('Principios de Asepsia Quirúrgica', 'Surgical Asepsis Principles')}
            </h3>
            <div class="grid md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300">
                <div class="flex items-start gap-2">
                    <i class="fa-solid fa-user-shield text-indigo-500 mt-1"></i>
                    <span><strong>Sterile Zone:</strong> ${t('Solo cintura al pecho y manos al frente.', 'Waist to chest level and hands in front.')}</span>
                </div>
                <div class="flex items-start gap-2">
                    <i class="fa-solid fa-rotate-left text-red-400 mt-1"></i>
                    <span><strong>Back:</strong> ${t('NUNCA dar la espalda al campo estéril.', 'NEVER turn your back on sterile field.')}</span>
                </div>
                <div class="flex items-start gap-2">
                    <i class="fa-solid fa-ruler-horizontal text-indigo-500 mt-1"></i>
                    <span><strong>Borders:</strong> ${t('Borde de 1 pulgada (2.5cm) se considera contaminado.', '1 inch (2.5cm) border is considered contaminated.')}</span>
                </div>
                <div class="flex items-start gap-2">
                    <i class="fa-solid fa-hand-dots text-red-400 mt-1"></i>
                    <span><strong>Reaching:</strong> ${t('No pasar brazos sobre el campo estéril.', 'Do not reach over the sterile field.')}</span>
                </div>
            </div>
        </div>
        </section>
      `;
    },

    // --- 3. Post-Op (PACU & Complications Table) ---
    renderPostOpPACU() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Post-Op (PACU)', 'Post-Op (PACU)')}
            </h2>
          </div>

          <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg mb-8">
             <strong class="text-xl text-purple-800 dark:text-purple-300 block mb-4 text-center">
               ${t('Prioridades de Enfermería', 'Nursing Priorities')}
             </strong>
             
             <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
               <div class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border-l-4 border-blue-500">
                 <strong class="text-blue-700 dark:text-blue-400 block mb-2">1. Airway (Vía Aérea)</strong>
                 <p class="text-gray-600 dark:text-gray-400">
                   ${t('Permeabilidad. Si vómito/inconsciente -> Posición Lateral.', 'Patency. If vomit/unconscious -> Lateral Position.')}
                 </p>
               </div>
               <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border-l-4 border-red-500">
                 <strong class="text-red-700 dark:text-red-400 block mb-2">2. Circulation</strong>
                 <p class="text-gray-600 dark:text-gray-400">
                   ${t('VS q15min. Monitorizar sangrado, color, pulsos.', 'VS q15min. Monitor bleeding, color, pulses.')}
                 </p>
               </div>
               <div class="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border-l-4 border-green-500">
                 <strong class="text-green-700 dark:text-green-400 block mb-2">3. Aldrete Score</strong>
                 <p class="text-gray-600 dark:text-gray-400">
                   ${t('Criterios de alta: Actividad, Resp, Circ, Conciencia, O2 Sat.', 'Discharge criteria: Activity, Resp, Circ, Consciousness, O2 Sat.')}
                 </p>
               </div>
             </div>
          </div>

          <div class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
             <table class="w-full text-sm text-left border-collapse bg-white dark:bg-slate-800">
                <thead class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                    <tr>
                        <th class="p-4 font-bold">${t('Complicación', 'Complication')}</th>
                        <th class="p-4 font-bold">${t('Signos', 'Signs')}</th>
                        <th class="p-4 font-bold">${t('Intervención Prioritaria', 'Priority Intervention')}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td class="p-4 font-bold text-red-600">Hemorrhage / Shock</td>
                        <td class="p-4 text-gray-600 dark:text-gray-300">
                           ${t('Taquicardia (1er signo), Hipotensión, Piel pálida/fría.', 'Tachycardia (1st sign), Hypotension, Pale/cool skin.')}
                        </td>
                        <td class="p-4 text-gray-700 dark:text-gray-200">
                           ${t('Reforzar apósito (no quitar 1ro), Fluidos IV, <strong>Trendelenburg</strong>.', 'Reinforce dressing (don\'t remove 1st), IV Fluids, <strong>Trendelenburg</strong>.')}
                        </td>
                    </tr>
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td class="p-4 font-bold text-blue-600">Atelectasia / Pneumonia</td>
                        <td class="p-4 text-gray-600 dark:text-gray-300">
                           ${t('Fiebre baja post-op (día 1-2), ruidos disminuidos.', 'Low grade fever post-op (day 1-2), diminished sounds.')}
                        </td>
                        <td class="p-4 text-gray-700 dark:text-gray-200">
                           ${t('<strong>Espirómetro Incentivo</strong> (10x/hora), Toser, Deambular.', '<strong>Incentive Spirometer</strong> (10x/hr), Cough, Ambulate.')}
                        </td>
                    </tr>
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td class="p-4 font-bold text-purple-600">DVT / PE</td>
                        <td class="p-4 text-gray-600 dark:text-gray-300">
                           ${t('Dolor pantorrilla, edema / Disnea súbita.', 'Calf pain, edema / Sudden dyspnea.')}
                        </td>
                        <td class="p-4 text-gray-700 dark:text-gray-200">
                           ${t('Medias TED/SCDs, Anticoagulantes. <strong>NO masajear piernas</strong>.', 'TED hose/SCDs, Anticoagulants. <strong>DO NOT massage legs</strong>.')}
                        </td>
                    </tr>
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td class="p-4 font-bold text-yellow-600">Urinary Retention</td>
                        <td class="p-4 text-gray-600 dark:text-gray-300">
                           ${t('No orina > 6-8h, vejiga distendida.', 'No void > 6-8h, distended bladder.')}
                        </td>
                        <td class="p-4 text-gray-700 dark:text-gray-200">
                           ${t('Bladder scan. Ayudar a pararse/baño antes de cateterizar.', 'Bladder scan. Help stand/bathroom before catheter.')}
                        </td>
                    </tr>
                </tbody>
             </table>
          </div>
        </section>
      `;
    },

    // --- 4. Surgical Emergencies (Wounds) ---
    renderSurgicalEmergencies() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Emergencias de Heridas', 'Wound Emergencies')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div class="p-6 bg-orange-50 dark:bg-orange-900/10 rounded-3xl border border-orange-200 dark:border-orange-800">
               <strong class="text-orange-800 dark:text-orange-300 text-lg block mb-2">Dehiscencia</strong>
               <p class="text-xs text-gray-500 mb-2">
                 ${t('Separación de bordes de la herida.', 'Separation of wound edges.')}
               </p>
               <ul class="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
                 <li>${t('Sensación de "pop" o chasquido.', 'Sensation of "pop".')}</li>
                 <li><strong>Tx:</strong> ${t('Steri-strips, Notificar MD.', 'Steri-strips, Notify MD.')}</li>
                 <li><strong>Pos:</strong> ${t('Low Fowler con rodillas flexionadas.', 'Low Fowler\'s with knees bent.')}</li>
               </ul>
             </div>

             <div class="p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-800">
               <strong class="text-red-800 dark:text-red-300 text-lg block mb-2">Evisceración</strong>
               <p class="text-xs text-gray-500 mb-2">
                 ${t('Protrusión de órganos internos a través de la herida.', 'Protrusion of internal organs through wound.')}
               </p>
               <div class="bg-white dark:bg-black/20 p-4 rounded-xl border border-red-100 dark:border-red-900 text-sm font-medium text-red-700 dark:text-red-300">
                 <h4 class="font-bold mb-2 text-xs uppercase opacity-80">${t('Protocolo de Acción:', 'Action Protocol:')}</h4>
                 <ol class="list-decimal list-inside space-y-2">
                   <li>${t('<strong>NO abandonar</strong> al paciente (Gritar por ayuda).', '<strong>DO NOT leave</strong> patient (Call for help).')}</li>
                   <li>${t('Posición <strong>Low Fowler + Rodillas flexionadas</strong> (Reduce tensión).', '<strong>Low Fowler + Knees bent</strong> (Reduces tension).')}</li>
                   <li>${t('Cubrir con <strong>Gasa Estéril + Salina</strong> (Prevenir necrosis).', 'Cover with <strong>Sterile Gauze + Saline</strong> (Prevent necrosis).')}</li>
                   <li>${t('NO intentar reintroducir órganos.', 'DO NOT attempt to reinsert organs.')}</li>
                   <li>${t('NPO (Preparar cirugía).', 'NPO (Prep for surgery).')}</li>
                 </ol>
               </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 5. Drains (Added from v8) ---
    renderWoundCare() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Drenajes Quirúrgicos', 'Surgical Drains')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border">
               <strong class="text-teal-700 dark:text-teal-400 block mb-2">Jackson-Pratt (JP)</strong>
               <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                 <li>• ${t('Drenaje cerrado, succión activa.', 'Closed drain, active suction.')}</li>
                 <li>• ${t('Comprimir la bombilla para mantener succión.', 'Compress bulb to maintain suction.')}</li>
                 <li>• ${t('Vaciar cuando esté medio lleno.', 'Empty when half full.')}</li>
               </ul>
             </div>
             
             <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border">
               <strong class="text-teal-700 dark:text-teal-400 block mb-2">Penrose</strong>
               <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                 <li>• ${t('Drenaje abierto, gravedad.', 'Open drain, gravity.')}</li>
                 <li>• ${t('Sin succión. Drena a gasas.', 'No suction. Drains into gauze.')}</li>
                 <li>• ${t('Seguridad: Alfiler para evitar que entre.', 'Safety: Pin to prevent retraction.')}</li>
               </ul>
             </div>
          </div>
        </section>
      `;
    }
  });
})();