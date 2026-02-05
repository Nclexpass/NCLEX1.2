// 19_prioritization_delegation.js — Prioritization & Delegation Masterclass (NCLEX)
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// VERSIÓN MAESTRA DEFINITIVA: Triage, Scope, Assignments & Safety
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // HELPER INTERNO: Optimización para evitar repetición de etiquetas HTML (DRY)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'prioritization',
    title: { es: 'Priorización y Delegación', en: 'Prioritization & Delegation' },
    subtitle: { es: 'Triaje, Asignaciones, RN/LPN/UAP y Seguridad', en: 'Triage, Assignments, Scope & Safety' },
    icon: 'list-ol',
    color: 'red',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-user-nurse"></i>
                ${t('Gestión del Cuidado', 'Management of Care')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Priorización y Delegación', 'Prioritization & Delegation')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('El núcleo del NCLEX: ¿A quién ver primero? ¿Quién hace qué?', 'The NCLEX core: Who to see first? Who does what?')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderFrameworks()}
          ${this.renderDelegationRules()}
          ${this.renderDelegationScopes()}
          ${this.renderAssignments()} 
          ${this.renderTriage()}
          ${this.renderQuiz()}
        </div>
      `;
    },

    // --- 1. Frameworks & Decision Making ---
    renderFrameworks() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Marcos de Priorización', 'Prioritization Frameworks')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
                <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
                  <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4">
                    1. ABCDE Framework
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    ${t('Siempre es el desempate #1 (salvo en paro cardíaco -> CAB).', 'Always the #1 tie-breaker (unless CPR needed -> CAB).')}
                  </p>
                  <ul class="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                    <li class="flex gap-2"><strong class="text-red-500">A:</strong> ${t('Airway - Estridor, Obstrucción, Anafilaxia.', 'Airway - Stridor, Obstruction, Anaphylaxis.')}</li>
                    <li class="flex gap-2"><strong class="text-blue-500">B:</strong> ${t('Breathing - SpO2 < 90%, Sibilancias severas, Retracciones.', 'Breathing - SpO2 < 90%, Severe wheezing, Retractions.')}</li>
                    <li class="flex gap-2"><strong class="text-green-500">C:</strong> ${t('Circulation - Hipotensión, Shock, Hemorragia severa.', 'Circulation - Hypotension, Shock, Severe bleeding.')}</li>
                    <li class="flex gap-2"><strong class="text-purple-500">D:</strong> ${t('Disability - Nivel de conciencia (GCS < 8), Pupilas, Stroke.', 'Disability - LOC (GCS < 8), Pupils, Stroke.')}</li>
                    <li class="flex gap-2"><strong class="text-yellow-500">E:</strong> ${t('Exposure - Hipotermia, Quemaduras graves.', 'Exposure - Hypothermia, Severe burns.')}</li>
                  </ul>
                </div>
                
                <div class="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 rounded-r-xl">
                    <h4 class="font-bold text-yellow-800 dark:text-yellow-300 uppercase text-xs tracking-widest block mb-2">Maslow's Hierarchy</h4>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                        ${t('1. Fisiológico (Aire, Agua) > 2. Seguridad > 3. Psicosocial.', '1. Physiological (Air, Water) > 2. Safety > 3. Psychosocial.')}
                    </p>
                </div>
            </div>

            <div class="p-6 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
               <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
                 ${t('Reglas de Decisión e Inestabilidad', 'Decision Rules & Instability')}
               </h3>
               
               <div class="space-y-4 mb-6">
                 <div class="p-3 bg-white dark:bg-black/20 rounded-xl border-l-4 border-purple-500">
                   <strong class="text-purple-700 dark:text-purple-400 block mb-1">Acute > Chronic</strong>
                   <span class="text-sm text-gray-600 dark:text-gray-300">${t('Confusión nueva (Delirio) vence a crónica (Demencia).', 'New onset confusion (Delirium) beats chronic (Dementia).')}</span>
                 </div>
                 <div class="p-3 bg-white dark:bg-black/20 rounded-xl border-l-4 border-orange-500">
                   <strong class="text-orange-700 dark:text-orange-400 block mb-1">Unstable > Stable</strong>
                   <span class="text-sm text-gray-600 dark:text-gray-300">${t('Signos vitales cambiantes > Paciente de alta.', 'Changing vitals > Discharge patient.')}</span>
                 </div>
                 <div class="p-3 bg-white dark:bg-black/20 rounded-xl border-l-4 border-blue-500">
                   <strong class="text-blue-700 dark:text-blue-400 block mb-1">Unexpected > Expected</strong>
                   <span class="text-sm text-gray-600 dark:text-gray-300">${t('Hemorragia inesperada > Dolor post-op esperado.', 'Unexpected hemorrhage > Expected post-op pain.')}</span>
                 </div>
               </div>

               <strong class="text-xs uppercase text-slate-500 block mb-2">${t('Palabras Clave de "Inestabilidad"', '"Instability" Keywords')}</strong>
               <div class="flex flex-wrap gap-2 justify-center mb-6">
                 <span class="px-3 py-1 bg-white dark:bg-black/20 rounded-full text-red-600 font-bold border border-red-200 text-sm">New onset</span>
                 <span class="px-3 py-1 bg-white dark:bg-black/20 rounded-full text-red-600 font-bold border border-red-200 text-sm">Acute</span>
                 <span class="px-3 py-1 bg-white dark:bg-black/20 rounded-full text-red-600 font-bold border border-red-200 text-sm">Changed</span>
                 <span class="px-3 py-1 bg-white dark:bg-black/20 rounded-full text-red-600 font-bold border border-red-200 text-sm">Hemorrhage</span>
                 <span class="px-3 py-1 bg-white dark:bg-black/20 rounded-full text-red-600 font-bold border border-red-200 text-sm">Sudden</span>
               </div>

               <div class="p-4 bg-white dark:bg-black/20 rounded-xl border-l-4 border-red-600 shadow-sm">
                 <strong class="block text-red-700 dark:text-red-400 mb-1 text-sm uppercase">Tie-Breaker Rule</strong>
                 <p class="text-sm text-gray-800 dark:text-gray-200 font-medium">
                   ${t('Si todo parece igual, pregunta: <strong>"¿Qué paciente morirá si no lo veo ahora?"</strong>', 'If all seems equal, ask: <strong>"Which patient will die if I don\'t see them right now?"</strong>')}
                 </p>
               </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. The 5 Rights of Delegation ---
    renderDelegationRules() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Los 5 Derechos de la Delegación', 'The 5 Rights of Delegation')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
             <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-gray-200 dark:border-brand-border text-center shadow-sm">
                <strong class="block text-purple-700 dark:text-purple-400 text-lg mb-1">1. Task</strong>
                <span class="text-xs text-gray-600 dark:text-gray-400">
                  ${t('¿Tarea rutinaria y de bajo riesgo?', 'Routine, low risk task?')}
                </span>
             </div>
             <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-gray-200 dark:border-brand-border text-center shadow-sm">
                <strong class="block text-purple-700 dark:text-purple-400 text-lg mb-1">2. Circumstance</strong>
                <span class="text-xs text-gray-600 dark:text-gray-400">
                  ${t('¿Paciente estable? ¿Recursos listos?', 'Patient stable? Resources available?')}
                </span>
             </div>
             <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-gray-200 dark:border-brand-border text-center shadow-sm">
                <strong class="block text-purple-700 dark:text-purple-400 text-lg mb-1">3. Person</strong>
                <span class="text-xs text-gray-600 dark:text-gray-400">
                  ${t('¿Competente? ¿Dentro del Scope?', 'Competent? Within Scope?')}
                </span>
             </div>
             <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-gray-200 dark:border-brand-border text-center shadow-sm">
                <strong class="block text-purple-700 dark:text-purple-400 text-lg mb-1">4. Direction</strong>
                <span class="text-xs text-gray-600 dark:text-gray-400">
                  ${t('Instrucciones claras: Qué, Cómo, Cuándo.', 'Clear instructions: What, How, When.')}
                </span>
             </div>
             <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-gray-200 dark:border-brand-border text-center shadow-sm">
                <strong class="block text-purple-700 dark:text-purple-400 text-lg mb-1">5. Supervision</strong>
                <span class="text-xs text-gray-600 dark:text-gray-400">
                  ${t('RN debe evaluar el resultado final.', 'RN must evaluate the outcome.')}
                </span>
             </div>
          </div>
        </section>
      `;
    },

    // --- 3. Delegation Scopes (RN/LPN/UAP) ---
    renderDelegationScopes() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white font-black text-xl shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Delegación (Scopes of Practice)', 'Delegation (Scopes of Practice)')}
            </h2>
          </div>

          <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl mb-8 text-center border border-gray-200 dark:border-gray-700">
             <strong class="text-xl text-gray-800 dark:text-white">RN ONLY: T.A.P.E.</strong>
             <div class="flex flex-wrap justify-center gap-4 mt-2 text-sm font-bold text-gray-600 dark:text-gray-400">
                <span><span class="text-red-500">T</span>eaching (Initial)</span>
                <span><span class="text-red-500">A</span>ssessment</span>
                <span><span class="text-red-500">P</span>lanning (Care Plans)</span>
                <span><span class="text-red-500">E</span>valuation</span>
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border-t-8 border-blue-600 shadow-md hover:-translate-y-1 transition-transform">
              <div class="text-center mb-4">
                <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-2">RN</div>
                <strong class="text-blue-800 dark:text-blue-300 block text-lg">Registered Nurse</strong>
              </div>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-blue-500 mt-1"></i> <strong>E.A.T.</strong>: Evaluate, Assess, Teach.</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-blue-500 mt-1"></i> ${t('Juicio Clínico / Planificación.', 'Clinical Judgment / Care Planning.')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-blue-500 mt-1"></i> ${t('Pacientes Inestables/Críticos.', 'Unstable/Critical Patients.')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-blue-500 mt-1"></i> ${t('Sangre / IV Push / Vías Centrales.', 'Blood / IV Push / Central Lines.')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-blue-500 mt-1"></i> ${t('Ingreso / Alta / Transferencia.', 'Admission / Discharge / Transfer.')}</li>
              </ul>
            </div>

            <div class="p-6 bg-teal-50 dark:bg-teal-900/10 rounded-3xl border-t-8 border-teal-500 shadow-md hover:-translate-y-1 transition-transform">
              <div class="text-center mb-4">
                <div class="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-2">LPN</div>
                <strong class="text-teal-800 dark:text-teal-300 block text-lg">LPN / LVN</strong>
              </div>
              <p class="text-xs text-center text-gray-500 mb-3 font-bold uppercase">"Stable Patients Only"</p>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-teal-500 mt-1"></i> ${t('Meds Oral / IM / SubQ.', 'Oral / IM / SubQ Meds.')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-teal-500 mt-1"></i> ${t('Reforzar enseñanza (NO inicial).', 'Reinforce teaching (NO initial).')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-teal-500 mt-1"></i> ${t('Curaciones estériles / Foley.', 'Sterile dressings / Foley.')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-teal-500 mt-1"></i> ${t('Monitorizar flujo IV (NO sangre).', 'Monitor IV flow (NO blood).')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-teal-500 mt-1"></i> ${t('Succión traqueostomía (crónico).', 'Trach suctioning (chronic).')}</li>
              </ul>
            </div>

            <div class="p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border-t-8 border-gray-500 shadow-md hover:-translate-y-1 transition-transform">
              <div class="text-center mb-4">
                <div class="w-12 h-12 bg-gray-500 text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-2">UAP</div>
                <strong class="text-gray-800 dark:text-gray-300 block text-lg">UAP / CNA</strong>
              </div>
              <p class="text-xs text-center text-gray-500 mb-3 font-bold uppercase">"Routine Tasks"</p>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-gray-500 mt-1"></i> ${t('ADLs (Baño, Aseo, Caminar).', 'ADLs (Bath, Toilet, Ambulate).')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-gray-500 mt-1"></i> ${t('Signos Vitales (Rutina/Estable).', 'Vital Signs (Routine/Stable).')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-gray-500 mt-1"></i> ${t('I&O (Medir orina/bolsa).', 'I&O (Measure urine/bag).')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-gray-500 mt-1"></i> ${t('Alimentar (SIN riesgo aspiración).', 'Feeding (NO aspiration risk).')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-gray-500 mt-1"></i> ${t('Posicionamiento.', 'Positioning.')}</li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Assignments & Floating (Restored from v6/7) ---
    renderAssignments() {
        return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Asignaciones y Enfermeras Flotantes', 'Assignments & Floating Nurses')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-200 dark:border-indigo-800">
               <h3 class="font-bold text-indigo-800 dark:text-indigo-300 mb-3 flex items-center gap-2">
                 <i class="fa-solid fa-user-tag"></i>
                 ${t('Reglas para Enfermeras Flotantes', 'Floating Nurse Rules')}
               </h3>
               <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
                 ${t('Asigna pacientes que requieran habilidades similares a su unidad de origen ("Like to Like").', 'Assign patients requiring skills similar to their home unit ("Like to Like").')}
               </p>
               <ul class="space-y-2 text-sm">
                 <li class="bg-white dark:bg-indigo-900/30 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <span class="block font-bold text-gray-800 dark:text-gray-200">${t('L&D Nurse → Med/Surg', 'L&D Nurse → Med/Surg')}</span>
                    <span class="text-xs text-gray-600 dark:text-gray-400">
                        ${t('OK: Trombosis (DVT), manejo de fluidos. <br>NO: Infecciones respiratorias, arritmias complejas.', 'OK: DVT, Fluid management. <br>NO: Respiratory infections, complex dysrhythmias.')}
                    </span>
                 </li>
                 <li class="bg-white dark:bg-indigo-900/30 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <span class="block font-bold text-gray-800 dark:text-gray-200">${t('Med/Surg Nurse → Pediátrico', 'Med/Surg Nurse → Pediatrics')}</span>
                    <span class="text-xs text-gray-600 dark:text-gray-400">
                        ${t('OK: Post-op apendicectomía (rutina), fracturas. <br>NO: Fibrosis quística, enfermedades infantiles raras.', 'OK: Post-op appendectomy (routine), fractures. <br>NO: Cystic fibrosis, rare childhood diseases.')}
                    </span>
                 </li>
               </ul>
            </div>

            <div class="space-y-4">
                <div class="p-5 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-200 dark:border-teal-800">
                   <h3 class="font-bold text-teal-800 dark:text-teal-300 mb-2">
                     ${t('Recién Graduados (New Grads)', 'New Graduates (New Grads)')}
                   </h3>
                   <p class="text-sm text-gray-700 dark:text-gray-300">
                     ${t('Asigna el paciente más <strong>estable</strong> y "de libro". Evita procedimientos complejos o que requieran intuición experta.', 'Assign the most <strong>stable</strong>, "textbook" patient. Avoid complex procedures or those requiring expert intuition.')}
                   </p>
                </div>
                
                <div class="p-5 bg-pink-50 dark:bg-pink-900/10 rounded-2xl border border-pink-200 dark:border-pink-800">
                   <h3 class="font-bold text-pink-800 dark:text-pink-300 mb-2">
                     ${t('Control de Infecciones (Rooming)', 'Infection Control (Rooming)')}
                   </h3>
                   <ul class="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                      <li class="flex items-center"><i class="fa-solid fa-check text-green-500 mr-2"></i> ${t('Cohorte: Misma infección activa = Misma habitación.', 'Cohort: Same active infection = Same room.')}</li>
                      <li class="flex items-center"><i class="fa-solid fa-xmark text-red-500 mr-2"></i> ${t('Inmunosuprimido + Infeccioso = NUNCA.', 'Immunocompromised + Infectious = NEVER.')}</li>
                      <li class="flex items-center"><i class="fa-solid fa-xmark text-red-500 mr-2"></i> ${t('Varicela/TB + Post-quirúrgico = NUNCA.', 'Varicella/TB + Post-op = NEVER.')}</li>
                   </ul>
                </div>
            </div>
          </div>
        </section>
        `;
    },

    // --- 5. Disaster Triage ---
    renderTriage() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Triaje de Desastres', 'Disaster Triage')}
            </h2>
          </div>

          <div class="mb-8 bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-200 dark:border-blue-800">
            <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-3">
              <i class="fa-solid fa-lightbulb"></i> 
              ${t('Regla Mnemotécnica S.T.A.R.T.', 'S.T.A.R.T. Triage Mnemonic')}
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-blue-700">S</strong> - 
                ${t('¿Respira? NO → Abrir vía. Si no → Black.', 'Breathing? NO → Open airway. If no → Black.')}
              </div>
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-blue-700">T</strong> - 
                ${t('¿Respiración > 30? Sí → Red.', 'Respirations > 30? Yes → Red.')}
              </div>
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-blue-700">A</strong> - 
                ${t('¿Perfusión > 2 seg? Sí → Red.', 'Perfusion > 2 sec? Yes → Red.')}
              </div>
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-blue-700">R</strong> - 
                ${t('¿Sigue comandos? NO → Red.', 'Follows commands? NO → Red.')}
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white text-center">
            <div class="p-6 bg-red-600 rounded-2xl shadow-md transform hover:scale-105 transition-transform">
              <strong class="text-xl block mb-1">RED</strong>
              <span class="text-xs font-bold uppercase opacity-80">Immediate (I)</span>
              <p class="text-sm mt-2">
                ${t('Amenaza vida inmediata (Shock, Neumotórax). Tratar ≤ 1h.', 'Immediate threat (Shock, Pneumothorax). Treat ≤ 1h.')}
              </p>
            </div>
            
            <div class="p-6 bg-yellow-500 rounded-2xl shadow-md transform hover:scale-105 transition-transform">
              <strong class="text-xl block mb-1">YELLOW</strong>
              <span class="text-xs font-bold uppercase opacity-80">Delayed (II)</span>
              <p class="text-sm mt-2">
                ${t('Heridas grandes, Fx abierta. Espera 30m-2h.', 'Major injuries, Open Fx. Wait 30m-2h.')}
              </p>
            </div>

            <div class="p-6 bg-green-600 rounded-2xl shadow-md transform hover:scale-105 transition-transform">
              <strong class="text-xl block mb-1">GREEN</strong>
              <span class="text-xs font-bold uppercase opacity-80">Minimal (III)</span>
              <p class="text-sm mt-2">
                ${t('"Walking Wounded". Cortes menores. Espera > 2h.', '"Walking Wounded". Minor cuts. Wait > 2 hours.')}
              </p>
            </div>

            <div class="p-6 bg-gray-900 rounded-2xl shadow-md transform hover:scale-105 transition-transform">
              <strong class="text-xl block mb-1">BLACK</strong>
              <span class="text-xs font-bold uppercase opacity-80">Expectant (0)</span>
              <p class="text-sm mt-2">
                ${t('Muerto o insalvable (Trauma masivo, Apnea).', 'Dead or unsavable (Massive trauma, Apnea).')}
              </p>
            </div>
          </div>
        </section>
      `;
    },

    // --- 6. Quiz (Combined & Comprehensive) ---
    renderQuiz() {
      return `
        <div class="mt-12 bg-gray-900 text-white p-6 rounded-3xl border border-gray-700">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <i class="fa-solid fa-clipboard-question text-red-400"></i> 
                ${t('Repaso Rápido', 'Quick Review')}
            </h3>
            <div class="space-y-4 text-sm">
                
                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('1. ¿Qué tarea es apropiada para delegar al LPN?', '1. Which task is appropriate for the LPN?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-red-500">
                        ${t('<strong>Cambio de vendaje estéril.</strong> El LPN puede realizar procedimientos estériles en pacientes estables. Evaluación inicial e IV Push son solo RN.', '<strong>Sterile dressing change.</strong> LPNs can do sterile skills on stable patients. Initial assessment and IV Push are RN only.')}
                    </div>
                </details>
                
                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('2. 4 pacientes en ER. ¿A quién ves primero?', '2. 4 ER clients. Who to see first?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-red-500">
                        ${t('<strong>34 años, habla arrastrada súbita (Stroke).</strong> "Brain Attack" es una emergencia aguda (Disability). Fractura y EPOC estable pueden esperar.', '<strong>34yo sudden slurred speech (Stroke).</strong> "Brain Attack" is an acute neurological emergency (Disability). Stable fracture and COPD can wait.')}
                    </div>
                </details>

                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('3. Desastre masivo: Paciente con herida en cabeza abierta y respiración agónica. ¿Etiqueta?', '3. Mass casualty: Client with open head wound, agonal breathing. Tag?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-red-500">
                        ${t('<strong>NEGRA (Black).</strong> Insalvable con recursos limitados. Enfócate en los que tienen chance de sobrevivir (Red).', '<strong>BLACK.</strong> Unsavable with limited resources. Focus on those with a chance (Red).')}
                    </div>
                </details>

                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('4. Delegación: ¿Puede un UAP medir orina de una bolsa Foley?', '4. Delegation: Can a UAP measure urine from a Foley bag?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-green-500">
                        ${t('<strong>SÍ.</strong> Medir y registrar (I&O) es rutinario. El RN debe evaluar el resultado.', '<strong>YES.</strong> Measuring and recording (I&O) is routine. The RN must evaluate the outcome.')}
                    </div>
                </details>
            </div>
        </div>
      `;
    }
  });
})();