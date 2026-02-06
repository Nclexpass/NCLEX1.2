// 18_leadership_management.js — Leadership & Management Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: Triage, Styles, Ethics, Legal, Delegation & QI
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // Helper de traducción para limpiar el código (Technical Optimization)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'leadership',
    title: { es: 'Liderazgo y Gestión', en: 'Leadership & Management' },
    subtitle: { es: 'Triaje, Delegación y Ética', en: 'Triage, Delegation & Ethics' },
    icon: 'user-tie',
    color: 'blue',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-scale-balanced"></i>
                ${t('Gestión Clínica Integral', 'Comprehensive Clinical Management')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Liderazgo y Priorización', 'Leadership & Prioritization')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('Triaje, Delegación, Legal, Ética y Estilos de Liderazgo.', 'Triage, Delegation, Legal, Ethics & Leadership Styles.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderPrioritizationTriage()}
          ${this.renderLeadershipStyles()}
          ${this.renderDelegation()} 
          ${this.renderEthicsAdvocacy()}
          ${this.renderLegalManagement()}
          ${this.renderQualityImprovement()}
          ${this.renderQuiz()}
        </div>
      `;
    },

    // --- 1. Prioritization & Disaster Triage (From v8) ---
    renderPrioritizationTriage() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg animate-pulse">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Priorización y Triaje (Desastres)', 'Prioritization & Triage (Disaster)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-list-ol text-blue-500"></i>
                ${t('Principios de Priorización', 'Prioritization Principles')}
              </h3>
              <ul class="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <li class="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border-l-4 border-red-500">
                  <strong class="block text-red-700 dark:text-red-400 mb-1">
                    ${t('Inestable vs Estable', 'Unstable vs Stable')}
                  </strong>
                  ${t('Inestable, agudo o impredecible SIEMPRE va primero.', 'Unstable, acute, or unpredictable ALWAYS comes first.')}
                </li>
                <li class="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl border-l-4 border-orange-500">
                  <strong class="block text-orange-700 dark:text-orange-400 mb-1">
                    ${t('ABC > Seguridad > Dolor', 'ABC > Safety > Pain')}
                  </strong>
                  ${t('Vía aérea, Respiración, Circulación superan todo (excepto en paro cardíaco: CAB).', 'Airway, Breathing, Circulation trumps all (except in cardiac arrest: CAB).')}
                </li>
                <li class="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border-l-4 border-blue-500">
                  <strong class="block text-blue-700 dark:text-blue-400 mb-1">
                    ${t('Sistémico vs Local', 'Systemic vs Local')}
                  </strong>
                  ${t('"Vida antes que extremidad". Shock (sistémico) > Fractura brazo (local).', '"Life over limb". Shock (systemic) > Arm fracture (local).')}
                </li>
              </ul>
            </div>

            <div class="p-6 bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-10 text-6xl"><i class="fa-solid fa-biohazard"></i></div>
              <h3 class="text-xl font-bold mb-4 text-yellow-400">
                ${t('Triaje de Desastres (START)', 'Disaster Triage (START)')}
              </h3>
              <p class="text-sm text-gray-400 mb-4">
                ${t('Hacer el mayor bien para el mayor número (Utilitarismo).', 'Do the greatest good for the greatest number (Utilitarianism).')}
              </p>
              
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-red-600 flex-shrink-0"></div>
                  <div>
                    <strong class="text-red-400 text-sm block">RED (Emergent/Immediate)</strong>
                    <span class="text-xs text-gray-300">
                      ${t('Vida amenazada pero SALVABLE (Obstrucción vía aérea, shock, neumotórax).', 'Life-threatening but SALVAGEABLE (Airway obstruct, shock, pneumothorax).')}
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-yellow-500 flex-shrink-0"></div>
                  <div>
                    <strong class="text-yellow-400 text-sm block">YELLOW (Urgent)</strong>
                    <span class="text-xs text-gray-300">
                      ${t('Lesiones mayores, estable por ahora (Fractura abierta). Espera 30m-2h.', 'Major injuries, stable for now (Open fx). Can wait 30m-2h.')}
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-green-500 flex-shrink-0"></div>
                  <div>
                    <strong class="text-green-400 text-sm block">GREEN (Non-Urgent)</strong>
                    <span class="text-xs text-gray-300">
                      ${t('"Caminantes". Cortes menores. Se mueven solos.', '"Walking Wounded". Minor cuts. Can move themselves.')}
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-black border border-gray-600 flex-shrink-0"></div>
                  <div>
                    <strong class="text-gray-400 text-sm block">BLACK (Expectant/Deceased)</strong>
                    <span class="text-xs text-gray-300">
                      ${t('Muerto o insalvable (Paro cardíaco, quemadura >60%). NO RCP en desastres.', 'Dead or unsalvageable (Cardiac arrest, >60% burns). NO CPR in disasters.')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. Leadership Styles (From v8/v7) ---
    renderLeadershipStyles() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Estilos de Liderazgo', 'Leadership Styles')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border-t-4 border-purple-500 shadow-sm">
              <strong class="text-purple-700 dark:text-purple-400 block mb-2 text-lg">
                ${t('Autocrático', 'Autocratic')}
              </strong>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                ${t('Líder toma todas las decisiones. Control total.', 'Leader makes all decisions. Total control.')}
              </p>
              <div class="bg-purple-50 dark:bg-purple-900/10 p-2 rounded text-xs text-purple-800 dark:text-purple-300 font-bold">
                <i class="fa-solid fa-check mr-1"></i> 
                ${t('Mejor para: Emergencias (Código Azul), Desastres.', 'Best for: Emergencies (Code Blue), Disasters.')}
              </div>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border-t-4 border-blue-500 shadow-sm">
              <strong class="text-blue-700 dark:text-blue-400 block mb-2 text-lg">
                ${t('Democrático', 'Democratic')}
              </strong>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                ${t('Colaborativo. Toma tiempo. El equipo opina.', 'Collaborative. Time consuming. Team input.')}
              </p>
              <div class="bg-blue-50 dark:bg-blue-900/10 p-2 rounded text-xs text-blue-800 dark:text-blue-300 font-bold">
                <i class="fa-solid fa-check mr-1"></i> 
                ${t('Mejor para: Políticas, horarios, resolución de conflictos.', 'Best for: Policies, scheduling, conflict resolution.')}
              </div>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border-t-4 border-green-500 shadow-sm">
              <strong class="text-green-700 dark:text-green-400 block mb-2 text-lg">
                ${t('Laissez-Faire', 'Laissez-Faire')}
              </strong>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                ${t('"Manos fuera". Poca dirección. Permisivo.', '"Hands-off". Little direction. Permissive.')}
              </p>
              <div class="bg-green-50 dark:bg-green-900/10 p-2 rounded text-xs text-green-800 dark:text-green-300 font-bold">
                <i class="fa-solid fa-check mr-1"></i> 
                ${t('Mejor para: Expertos altamente motivados.', 'Best for: Highly motivated experts.')}
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 3. DELEGATION & SUPERVISION (Critical Content from v7) ---
    renderDelegation() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Delegación y Supervisión', 'Delegation & Supervision')}
            </h2>
          </div>

          <div class="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-3xl border border-purple-200 dark:border-purple-800">
            <h3 class="text-xl font-bold text-purple-800 dark:text-purple-300 mb-4">
              <i class="fa-solid fa-people-arrows"></i> 
              ${t('Las 5 Reglas de la Delegación', 'The 5 Rights of Delegation')}
            </h3>
            
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              ${['Task', 'Person', 'Direction', 'Supervision', 'Circumstances'].map((right, i) => `
                <div class="bg-white dark:bg-black/20 p-3 rounded-xl text-center border border-purple-100 dark:border-purple-700">
                  <div class="text-2xl font-black text-purple-600 dark:text-purple-400 mb-1">${i + 1}</div>
                  <strong class="text-sm text-purple-800 dark:text-purple-300">Right ${right}</strong>
                </div>
              `).join('')}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white dark:bg-brand-card p-5 rounded-2xl border border-red-200 dark:border-red-800">
                <h4 class="text-lg font-bold text-red-700 dark:text-red-400 mb-3">
                  <i class="fa-solid fa-ban"></i> 
                  ${t('NO Delegar a UAP', 'DO NOT Delegate to UAP')}
                </h4>
                <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li class="flex items-start gap-2">
                    <i class="fa-solid fa-stethoscope text-red-500 mt-0.5"></i>
                    <span><strong>Assessment</strong> ${t('(evaluar herida, dolor)', '(e.g., wound assessment, pain)')}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="fa-solid fa-syringe text-red-500 mt-0.5"></i>
                    <span><strong>Meds/IV</strong> ${t('(excepto oral/tópica estable si permitido)', '(except stable oral/topical if allowed)')}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="fa-solid fa-graduation-cap text-red-500 mt-0.5"></i>
                    <span><strong>Teaching</strong> ${t('(Educación inicial)', '(Initial teaching)')}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="fa-solid fa-tasks text-red-500 mt-0.5"></i>
                    <span><strong>Unstable Pts</strong> ${t('(paciente crítico, cambios)', '(critical care, acute changes)')}</span>
                  </li>
                </ul>
              </div>

              <div class="bg-white dark:bg-brand-card p-5 rounded-2xl border border-green-200 dark:border-green-800">
                <h4 class="text-lg font-bold text-green-700 dark:text-green-400 mb-3">
                  <i class="fa-solid fa-list-check"></i> 
                  ${t('Sí Delegar a UAP', 'OK to Delegate to UAP')}
                </h4>
                <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li class="flex items-start gap-2">
                    <i class="fa-solid fa-vitals text-green-500 mt-0.5"></i>
                    <span><strong>Vitals</strong> ${t('(estables)', '(stable)')}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="fa-solid fa-bed text-green-500 mt-0.5"></i>
                    <span><strong>ADLs</strong> ${t('(Higiene, movilización)', '(Hygiene, ambulation)')}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="fa-solid fa-utensils text-green-500 mt-0.5"></i>
                    <span><strong>Feeding</strong> ${t('(sin riesgo aspiración)', '(no aspiration risk)')}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="mt-6 bg-orange-50 dark:bg-orange-900/10 p-5 rounded-2xl border border-orange-200 dark:border-orange-800">
                <h4 class="text-lg font-bold text-orange-800 dark:text-orange-300 mb-3 flex items-center gap-2">
                  <i class="fa-solid fa-user-nurse"></i>
                  ${t('Rol del LPN/LVN', 'LPN/LVN Role')}
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-white dark:bg-black/20 p-3 rounded-xl">
                    <strong class="text-green-600 dark:text-green-400 block mb-1">CAN DO:</strong>
                    <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>${t('Pacientes <strong>Estables</strong> (Crónicos).', '<strong>Stable</strong> Clients (Chronic).')}</li>
                      <li>${t('Medicamentos Orales/IM/SQ.', 'Oral/IM/SQ Meds.')}</li>
                      <li>${t('Curaciones estériles.', 'Sterile dressings.')}</li>
                      <li>${t('Reforzar enseñanza.', 'Reinforce teaching.')}</li>
                    </ul>
                  </div>
                  <div class="bg-white dark:bg-black/20 p-3 rounded-xl">
                    <strong class="text-red-600 dark:text-red-400 block mb-1">CANNOT DO:</strong>
                    <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>${t('Pacientes inestables / Nuevos ingresos.', 'Unstable clients / New admissions.')}</li>
                      <li>${t('IV Push / Sangre.', 'IV Push / Blood products.')}</li>
                      <li>${t('Planificación de alta / Eval inicial.', 'Discharge planning / Initial assessment.')}</li>
                    </ul>
                  </div>
                </div>
            </div>

            <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                <i class="fa-solid fa-lightbulb"></i>
                ${t('Regla Mnemotécnica NCLEX', 'NCLEX Mnemonic Rule')}
              </h4>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                ${t('<strong>"RN: A-E-I-O-U"</strong> - El RN realiza: Assessment, Education, IV meds, O2 therapy, Unstable patients.', '<strong>"RN: A-E-I-O-U"</strong> - RN does: Assessment, Education, IV meds, O2 therapy, Unstable patients.')}
              </p>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Ethical Principles & Advocacy (Merged v7/v8) ---
    renderEthicsAdvocacy() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Principios Éticos y Abogacía', 'Ethical Principles & Advocacy')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mb-8">
            ${this.renderEthicalCard('Autonomy', 'Autonomía', 'Right to make own decisions (Refusal).', 'Derecho a decidir (Rechazo).', 'hand-paper')}
            ${this.renderEthicalCard('Beneficence', 'Beneficencia', 'Duty to do good.', 'Deber de hacer el bien.', 'hand-holding-heart')}
            ${this.renderEthicalCard('Non-maleficence', 'No Maleficencia', 'Duty to do NO HARM.', 'Deber de NO dañar.', 'shield-halved')}
            ${this.renderEthicalCard('Veracity', 'Veracidad', 'Duty to tell the TRUTH.', 'Deber de decir la VERDAD.', 'comments')}
            ${this.renderEthicalCard('Fidelity', 'Fidelidad', 'Keeping promises/loyalty.', 'Cumplir promesas/lealtad.', 'handshake')}
            ${this.renderEthicalCard('Justice', 'Justicia', 'Fairness & equality.', 'Equidad e igualdad.', 'scale-balanced')}
          </div>

          <div class="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-200 dark:border-indigo-800">
             <strong class="text-indigo-800 dark:text-indigo-300 block mb-3 text-lg flex items-center gap-2">
                <i class="fa-solid fa-bullhorn"></i>
                ${t('Abogacía del Paciente', 'Patient Advocacy')}
             </strong>
             <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
               ${t('El rol principal del enfermero líder es proteger la autonomía del paciente.', 'Nurse leader primary role is protecting patient autonomy.')}
             </p>
             <ul class="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
               <li>${t('Ser la voz del paciente cuando no puede hablar.', 'Be the patient\'s voice when they cannot speak.')}</li>
               <li>${t('Cuestionar órdenes médicas inseguras.', 'Question unsafe medical orders.')}</li>
               <li>${t('Educar para empoderar decisiones.', 'Educate to empower decisions.')}</li>
             </ul>
          </div>
        </section>
      `;
    },

    renderEthicalCard(titleEn, titleEs, descEn, descEs, icon) {
      return `
        <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <i class="fa-solid fa-${icon}"></i>
            </div>
            <strong class="text-gray-900 dark:text-white">
              ${t(titleEs, titleEn)}
            </strong>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-snug">
            ${t(descEs, descEn)}
          </p>
        </div>
      `;
    },

    // --- 5. Legal & Torts (Merged v7 Torts + v8 Incident Reporting) ---
    renderLegalManagement() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Legal (Agravios y Gestión)', 'Legal (Torts & Management)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div class="p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-3xl border border-yellow-200 dark:border-yellow-800">
              <h3 class="text-xl font-bold text-yellow-800 dark:text-yellow-300 mb-3 text-center">Unintentional (Sin Intención)</h3>
              <ul class="space-y-4">
                <li class="bg-white dark:bg-black/20 p-4 rounded-2xl">
                  <strong class="block text-gray-900 dark:text-white mb-1"><i class="fa-solid fa-xmark text-red-500 mr-2"></i> Negligence</strong>
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    ${t('Caer por debajo del estándar de cuidado (ej: olvidar subir barandas).', 'Falling below standard of care (e.g., forgetting side rails).')}
                  </span>
                </li>
                <li class="bg-white dark:bg-black/20 p-4 rounded-2xl">
                  <strong class="block text-gray-900 dark:text-white mb-1"><i class="fa-solid fa-user-doctor text-blue-500 mr-2"></i> Malpractice</strong>
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    ${t('Negligencia Profesional (con licencia). Daño causado.', 'Professional negligence. Harm caused.')}
                  </span>
                </li>
              </ul>
            </div>

            <div class="p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-800">
              <h3 class="text-xl font-bold text-red-800 dark:text-red-300 mb-3 text-center">Intentional (Intencional)</h3>
              <ul class="space-y-4 mt-4">
                <li class="bg-white dark:bg-black/20 p-4 rounded-2xl">
                  <strong class="block text-gray-900 dark:text-white mb-1">Assault vs Battery</strong>
                  <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <p><strong class="text-red-500">Assault:</strong> ${t('AMENAZA (Verbal). Sin tocar.', 'THREAT (Verbal). No touch.')}</p>
                    <p><strong class="text-red-500">Battery:</strong> ${t('CONTACTO físico sin permiso.', 'Physical CONTACT w/o consent.')}</p>
                  </div>
                </li>
                <li class="bg-white dark:bg-black/20 p-4 rounded-2xl">
                  <strong class="block text-gray-900 dark:text-white mb-1">False Imprisonment</strong>
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    ${t('Restricciones sin orden médica.', 'Restraints without order.')}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div class="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-200 dark:border-amber-800 shadow-md">
            <strong class="text-xl text-amber-800 dark:text-amber-300 block mb-4">
              <i class="fa-solid fa-file-contract mr-2"></i>
              ${t('Reporte de Incidentes (Occurrence Report)', 'Incident Reporting (Occurrence Report)')}
            </strong>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div class="text-sm text-gray-600 dark:text-gray-400">
                  <strong class="block mb-1">${t('Cuándo reportar:', 'When to report:')}</strong>
                  <ul class="list-disc list-inside">
                    <li>${t('Errores de medicación / Caídas.', 'Med errors / Falls.')}</li>
                    <li>${t('Pérdida de propiedad / Pinchazos.', 'Property loss / Needlesticks.')}</li>
                  </ul>
               </div>
               <div class="bg-white dark:bg-black/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
                  <strong class="text-red-600 dark:text-red-400 block mb-2 text-xs uppercase font-black">
                    ${t('REGLA DE ORO LEGAL:', 'LEGAL GOLDEN RULE:')}
                  </strong>
                  <p class="text-sm text-gray-800 dark:text-gray-200 font-medium">
                    ${t('NUNCA menciones el reporte de incidente en la historia clínica. Es interno. Si lo mencionas, puede usarse en la corte.', 'NEVER mention incident report in chart. It is internal. If mentioned, it can be subpoenaed.')}
                  </p>
               </div>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-200 dark:border-blue-800">
               <h3 class="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">Advance Directives</h3>
               <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                 <li><strong>Living Will:</strong> ${t('Instrucciones soporte vital (DNR).', 'Life support instructions (DNR).')}</li>
                 <li><strong>Power of Attorney:</strong> ${t('Persona designada para decidir.', 'Person designated to decide.')}</li>
               </ul>
             </div>
             <div class="bg-green-50 dark:bg-green-900/10 p-6 rounded-3xl border border-green-200 dark:border-green-800">
                <h3 class="text-lg font-black text-green-800 dark:text-green-300 mb-2">
                  <i class="fa-solid fa-file-signature"></i> Consent
                </h3>
                <div class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                   <p><strong class="text-green-600">Provider:</strong> ${t('Explica procedimiento/riesgos.', 'Explains procedure/risks.')}</p>
                   <p><strong class="text-green-600">Nurse:</strong> ${t('TESTIGO de firma. Verifica competencia.', 'WITNESS signature. Verify competence.')}</p>
                   <p class="text-red-500 font-bold text-xs">${t('¡Enfermera NO explica la cirugía!', 'Nurse does NOT explain surgery!')}</p>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 6. Quality Improvement (From v8) ---
    renderQualityImprovement() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Mejora de Calidad (QI)', 'Quality Improvement (QI)')}
            </h2>
          </div>

          <div class="p-6 bg-teal-50 dark:bg-teal-900/10 rounded-3xl border border-teal-200 dark:border-teal-800">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div class="bg-white dark:bg-black/20 p-4 rounded-xl">
                 <strong class="text-teal-700 dark:text-teal-300 block mb-2">Root Cause Analysis (RCA)</strong>
                 <p class="text-xs text-gray-600 dark:text-gray-400">
                   ${t('Retrospectivo. ¿Por qué ocurrió el error? Enfocado en sistemas, no en culpar.', 'Retrospective. Why did it happen? Focus on systems, not blaming.')}
                 </p>
               </div>
               <div class="bg-white dark:bg-black/20 p-4 rounded-xl">
                 <strong class="text-teal-700 dark:text-teal-300 block mb-2">PDSA Cycle</strong>
                 <p class="text-xs text-gray-600 dark:text-gray-400">
                   ${t('Plan, Do, Study, Act. Probar cambios a pequeña escala.', 'Plan, Do, Study, Act. Test changes on small scale.')}
                 </p>
               </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 7. Quiz (From v7) ---
    renderQuiz() {
      return `
        <div class="mt-12 bg-gray-900 text-white p-6 rounded-3xl border border-gray-700">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <i class="fa-solid fa-clipboard-question text-blue-400"></i> 
                ${t('Repaso Rápido', 'Quick Review')}
            </h3>
            <div class="space-y-4 text-sm">
                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('1. Paciente intenta salir. Enf: "Si te levantas, te sedaré".', '1. Patient tries to leave. Nurse: "If you get up, I\'ll sedate you".')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-blue-500">
                        <strong>Assault (Asalto).</strong> 
                        ${t('Es una AMENAZA verbal. No hubo contacto (Batería).', 'Verbal THREAT. No contact (Battery).')}
                    </div>
                </details>
                
                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('2. Desastre masivo. ¿Estilo de liderazgo?', '2. Mass casualty. Leadership style?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-blue-500">
                        <strong>Autocratic.</strong> 
                        ${t('Crisis requieren comandos claros y rápidos.', 'Crises require clear, fast commands.')}
                    </div>
                </details>

                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('3. ¿Qué delegar a UAP?', '3. What to delegate to UAP?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-blue-500">
                        <strong>${t('Signos vitales, higiene, ambulación (Estables).', 'Vitals, hygiene, ambulation (Stable).')}</strong> 
                        ${t('NUNCA: Evaluación, Educación, Meds IV.', 'NEVER: Assessment, Education, IV Meds.')}
                    </div>
                </details>
            </div>
        </div>
      `;
    }
  });
})();