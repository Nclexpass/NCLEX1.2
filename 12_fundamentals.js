// 12_fundamentals.js — Fundamentals, Safety & Delegation Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: Isolation, PPE, Delegation, Positioning, Safety & IV Fluids
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Consolidado y Optimizado para máxima eficiencia técnica y académica.
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // Helper interno de traducción para mantener el código DRY (Don't Repeat Yourself)
  // Genera automáticamente los spans para inglés y español
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'fundamentals',
    title: { es: 'Fundamentos y Seguridad', en: 'Fundamentals & Safety' },
    subtitle: { es: 'Aislamiento, Delegación y Riesgos', en: 'Isolation, Delegation & Hazards' },
    icon: 'user-shield',
    color: 'slate',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-shield-virus"></i>
                ${t('Masterclass Fundamentos', 'Fundamentals Masterclass')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Gestión del Cuidado', 'Management of Care')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('Seguridad del Paciente, Control de Infecciones y Delegación.', 'Patient Safety, Infection Control & Delegation.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderIsolation()}
          ${this.renderPPE()}
          ${this.renderDelegation()}
          ${this.renderSafetyFallsAndSeizures()}
          ${this.renderFireSafety()}
          ${this.renderIVTherapy()}
          ${this.renderPositions()}
          ${this.renderEthicalLegal()}
        </div>
      `;
    },

    // --- 1. ISOLATION PRECAUTIONS (Contenido v6 + Estilo v8) ---
    renderIsolation() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Precauciones de Aislamiento', 'Isolation Precautions')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-sm hover:-translate-y-1 transition-transform">
              <strong class="text-blue-800 dark:text-blue-300 block text-lg mb-2 flex items-center gap-2">
                <i class="fa-solid fa-wind"></i> ${t('AÉREAS (AIRBORNE)', 'AIRBORNE')}
              </strong>
              <div class="bg-white dark:bg-black/20 p-2 rounded text-xs font-bold text-center mb-3 border border-blue-100 dark:border-blue-900">
                MTV + SHD
              </div>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                <li><strong>M</strong>easles ${t('(Sarampión)', '')}</li>
                <li><strong>T</strong>uberculosis (Pulmonary/Laryngeal)</li>
                <li><strong>V</strong>aricella (Chickenpox)</li>
                <li><strong>S</strong>mallpox ${t('(Viruela)', '')}</li>
                <li><strong>H</strong>erpes Zoster ${t('(Diseminado)', '(Disseminated)')}</li>
                <li><strong>D</strong> (COVID-19/SARS - ${t('protocolo', 'protocol')})</li>
              </ul>
              <div class="mt-3 text-xs text-blue-900 dark:text-blue-200 font-medium border-t border-blue-200 pt-2">
                <i class="fa-solid fa-shield-halved mr-1"></i> 
                ${t('Mascarilla N95, Presión Negativa, Puerta Cerrada.', 'N95 Mask, Negative Pressure, Door Closed.')}
              </div>
            </div>

            <div class="bg-green-50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm hover:-translate-y-1 transition-transform">
              <strong class="text-green-800 dark:text-green-300 block text-lg mb-2 flex items-center gap-2">
                <i class="fa-solid fa-head-side-cough"></i> ${t('GOTITAS (DROPLET)', 'DROPLET')}
              </strong>
              <div class="bg-white dark:bg-black/20 p-2 rounded text-xs font-bold text-center mb-3 border border-green-100 dark:border-green-900">
                DR MIMP
              </div>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                <li><strong>D</strong>iphtheria</li>
                <li><strong>R</strong>ubella</li>
                <li><strong>M</strong>umps / <strong>M</strong>eningitis</li>
                <li><strong>I</strong>nfluenza</li>
                <li><strong>P</strong>ertussis / <strong>P</strong>neumonia</li>
              </ul>
              <div class="mt-3 text-xs text-green-900 dark:text-green-200 font-medium border-t border-green-200 pt-2">
                <i class="fa-solid fa-shield-halved mr-1"></i> 
                ${t('Mascarilla Quirúrgica, Goggles, Habitación Privada/Cohorte.', 'Surgical Mask, Goggles, Private/Cohort Room.')}
              </div>
            </div>

            <div class="bg-orange-50 dark:bg-orange-900/10 p-5 rounded-2xl border border-orange-200 dark:border-orange-800 shadow-sm hover:-translate-y-1 transition-transform">
              <strong class="text-orange-800 dark:text-orange-300 block text-lg mb-2 flex items-center gap-2">
                <i class="fa-solid fa-hand-dots"></i> ${t('CONTACTO', 'CONTACT')}
              </strong>
              <div class="bg-white dark:bg-black/20 p-2 rounded text-xs font-bold text-center mb-3 border border-orange-100 dark:border-orange-900">
                MRS. WEE + HR
              </div>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                <li><strong>M</strong>RSA / <strong>V</strong>RE</li>
                <li><strong>R</strong>SV / <strong>R</strong>otavirus</li>
                <li><strong>S</strong>cabies / <strong>S</strong>kin Infections</li>
                <li><strong>W</strong>ound infections</li>
                <li><strong>E</strong>nteric (<strong>C. Diff</strong>) / <strong>E</strong>ye</li>
                <li><strong>H</strong>epatitis A / Herpes Simplex</li>
              </ul>
              <div class="mt-3 text-xs text-orange-900 dark:text-orange-200 font-medium border-t border-orange-200 pt-2">
                <i class="fa-solid fa-shield-halved mr-1"></i> 
                ${t('Guantes + Bata. Equipo dedicado.', 'Gloves + Gown. Dedicated Equipment.')} <br>
                <span class="text-red-500 font-bold text-[10px] uppercase">${t('C. Diff: SOLO Agua y Jabón!', 'C. Diff: Soap & Water ONLY!')}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 p-5 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border-l-8 border-purple-500 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <strong class="text-lg text-purple-800 dark:text-purple-300">
                ${t('AMBIENTE PROTECTOR (NEUTROPÉNICO)', 'PROTECTIVE ENVIRONMENT (NEUTROPENIC)')}
              </strong>
              <i class="fa-solid fa-shield-virus text-purple-400 text-xl"></i>
            </div>
            <p class="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">IMMUNOCOMPROMISED (ANC < 1000)</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
               <ul class="list-disc list-inside">
                  <li>${t('Habitación Privada. Presión <strong>POSITIVA</strong>.', 'Private Room. <strong>POSITIVE</strong> Pressure.')}</li>
                  <li>${t('Filtración HEPA (Aire entra filtrado).', 'HEPA Filtration (Incoming air).')}</li>
               </ul>
               <ul class="list-disc list-inside">
                  <li>${t('NO flores frescas/plantas/fruta fresca.', 'NO fresh flowers/plants/fresh fruit.')}</li>
                  <li>${t('Limitar visitas. No personas enfermas.', 'Limit visitors. No sick people.')}</li>
               </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. PPE DONNING & DOFFING ---
    renderPPE() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Orden de EPP (PPE Order)', 'PPE Order')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-md relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                <strong class="text-green-600 dark:text-green-400 block text-xl mb-4 text-center uppercase">
                  ${t('Donning (Ponerse)', 'Donning (Put On)')}
                  <span class="block text-xs text-gray-400 font-normal mt-1 normal-case">Up the body -> Hands</span>
                </strong>
                <ol class="space-y-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                   <li class="flex items-center gap-3">
                      <span class="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs border border-green-200">1</span>
                      ${t('Bata (Gown)', 'Gown')}
                   </li>
                   <li class="flex items-center gap-3">
                      <span class="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs border border-green-200">2</span>
                      ${t('Mascarilla / Respirador', 'Mask / Respirator')}
                   </li>
                   <li class="flex items-center gap-3">
                      <span class="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs border border-green-200">3</span>
                      ${t('Goggles / Pantalla Facial', 'Goggles / Face Shield')}
                   </li>
                   <li class="flex items-center gap-3">
                      <span class="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs border border-green-200">4</span>
                      ${t('Guantes (Sobre los puños)', 'Gloves (Over cuffs)')}
                   </li>
                </ol>
             </div>

             <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-md relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                <strong class="text-red-600 dark:text-red-400 block text-xl mb-4 text-center uppercase">
                  ${t('Doffing (Quitarse)', 'Doffing (Take Off)')}
                  <span class="block text-xs text-gray-400 font-normal mt-1 normal-case">Alphabetical Order</span>
                </strong>
                <ol class="space-y-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                   <li class="flex items-center gap-3">
                      <span class="bg-red-100 text-red-700 w-6 h-6 rounded-full flex items-center justify-center text-xs border border-red-200">1</span>
                      ${t('Guantes', 'Gloves')} <span class="text-xs font-normal text-gray-400 ml-auto italic">Dirty!</span>
                   </li>
                   <li class="flex items-center gap-3">
                      <span class="bg-red-100 text-red-700 w-6 h-6 rounded-full flex items-center justify-center text-xs border border-red-200">2</span>
                      ${t('Goggles / Pantalla', 'Goggles / Face Shield')}
                   </li>
                   <li class="flex items-center gap-3">
                      <span class="bg-red-100 text-red-700 w-6 h-6 rounded-full flex items-center justify-center text-xs border border-red-200">3</span>
                      ${t('Bata', 'Gown')}
                   </li>
                   <li class="flex items-center gap-3">
                      <span class="bg-red-100 text-red-700 w-6 h-6 rounded-full flex items-center justify-center text-xs border border-red-200">4</span>
                      ${t('Mascarilla', 'Mask')}
                   </li>
                   <li class="flex items-center gap-3 border-t border-gray-100 pt-2 mt-2">
                       <i class="fa-solid fa-hands-bubbles text-blue-400"></i> ${t('Higiene de Manos', 'Hand Hygiene')}
                   </li>
                </ol>
             </div>
          </div>
        </section>
      `;
    },

    // --- 3. DELEGATION ---
    renderDelegation() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-lg shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Delegación (Scope of Practice)', 'Delegation (Scope of Practice)')}
            </h2>
          </div>

          <div class="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
             <strong class="block text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide mb-2">${t('Los 5 Correctos', 'The 5 Rights')}</strong>
             <div class="flex flex-wrap justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                <span class="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">Task</span>
                <span class="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">Circumstance</span>
                <span class="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">Person</span>
                <span class="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">Direction</span>
                <span class="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">Supervision</span>
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div class="p-5 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-200 dark:border-teal-800">
                <div class="flex justify-between items-center mb-3">
                    <strong class="text-teal-800 dark:text-teal-300 text-lg">RN</strong>
                    <span class="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-1 rounded uppercase">Clinical Judgment</span>
                </div>
                <div class="bg-white dark:bg-black/20 p-2 rounded text-xs font-bold text-center mb-3">
                   "EAT" (Evaluate, Assess, Teach)
                </div>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                   <li>${t('Valoración Inicial / Alta.', 'Initial Assessment / Discharge.')}</li>
                   <li>${t('Plan de Cuidado / Diagnóstico.', 'Care Planning / Diagnosis.')}</li>
                   <li>${t('Enseñanza (Inicial/Compleja).', 'Teaching (Initial/Complex).')}</li>
                   <li>${t('Transfusiones / IV Push.', 'Blood Transfusions / IV Push.')}</li>
                   <li>${t('Pacientes Inestables.', 'Unstable Patients.')}</li>
                </ul>
             </div>

             <div class="p-5 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-200 dark:border-yellow-800">
                <div class="flex justify-between items-center mb-3">
                    <strong class="text-yellow-800 dark:text-yellow-300 text-lg">LPN / LVN</strong>
                    <span class="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded uppercase">Stable Patients</span>
                </div>
                <div class="bg-white dark:bg-black/20 p-2 rounded text-xs font-bold text-center mb-3">
                   "SPPO" (Stable, Pills, Poke, O2)
                </div>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                   <li>${t('Pacientes Crónicos / Estables.', 'Chronic / Stable Patients.')}</li>
                   <li>${t('Meds Oral/IM/SubQ (NO IV Push).', 'Meds Oral/IM/SubQ (NO IV Push).')}</li>
                   <li>${t('Curaciones Estériles / Foley.', 'Sterile Dressings / Foley.')}</li>
                   <li>${t('Reforzar enseñanza (NO inicial).', 'Reinforce teaching (NO initial).')}</li>
                </ul>
             </div>

             <div class="p-5 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-center mb-3">
                    <strong class="text-gray-800 dark:text-gray-200 text-lg">UAP / CNA</strong>
                    <span class="text-[10px] font-bold bg-gray-200 text-gray-800 px-2 py-1 rounded uppercase">Routine</span>
                </div>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                   <li>${t('ADLs (Baño, Comer, Aseo).', 'ADLs (Bath, Eat, Toileting).')}</li>
                   <li>${t('Vitales de Rutina (Estables).', 'Routine Vitals (Stable).')}</li>
                   <li>${t('I&O (Medición).', 'I&O (Measurement).')}</li>
                   <li>${t('Recolección muestras (Orina/Heces).', 'Specimen collection (Urine/Stool).')}</li>
                   <li>${t('Posicionamiento (No agudos).', 'Positioning (Non-acute).')}</li>
                </ul>
             </div>
          </div>
        </section>
      `;
    },

    // --- 4. SAFETY, FALLS & SEIZURES (Fusionado con v6) ---
    renderSafetyFallsAndSeizures() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Seguridad, Caídas y Convulsiones', 'Safety, Falls & Seizures')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="bg-white dark:bg-brand-card p-5 rounded-2xl border-l-4 border-indigo-500 shadow-sm">
                <strong class="text-indigo-700 dark:text-indigo-400 block text-lg mb-2">
                    <i class="fa-solid fa-person-falling-burst mr-1"></i> ${t('Precauciones de Caídas', 'Fall Precautions')}
                </strong>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                   <li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${t('Cama posición más baja y frenada.', 'Bed lowest position & locked.')}</li>
                   <li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${t('2 Barandillas arriba (4 es restricción).', '2 Side rails up (4 is restraint).')}</li>
                   <li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${t('Timbre al alcance.', 'Call light within reach.')}</li>
                   <li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${t('Medias antideslizantes / Iluminación.', 'Non-skid socks / Lighting.')}</li>
                </ul>
             </div>

             <div class="bg-white dark:bg-brand-card p-5 rounded-2xl border-l-4 border-emerald-500 shadow-sm">
                <strong class="text-emerald-700 dark:text-emerald-400 block text-lg mb-2">
                    <i class="fa-solid fa-brain mr-1"></i> ${t('Precauciones de Convulsiones', 'Seizure Precautions')}
                </strong>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                   <li><strong>PRE:</strong> ${t('Succión y O2 en cabecera. Almohadillar barandillas.', 'Suction & O2 at bedside. Pad side rails.')}</li>
                   <li><strong>DURING:</strong> ${t('Posición lateral. Proteger cabeza. Cronometrar.', 'Side-lying. Protect head. Time it.')}</li>
                   <li><strong>NEVER:</strong> ${t('Restringir o meter objetos en la boca.', 'Restrain or insert objects in mouth.')}</li>
                </ul>
             </div>

             <div class="bg-white dark:bg-brand-card p-5 rounded-2xl border-l-4 border-orange-500 shadow-sm md:col-span-2">
                <strong class="text-orange-700 dark:text-orange-400 block text-lg mb-2">
                    <i class="fa-solid fa-handcuffs mr-1"></i> ${t('Restricciones Físicas (Restraints)', 'Physical Restraints')}
                </strong>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                    <ul class="space-y-2">
                       <li><i class="fa-solid fa-triangle-exclamation text-orange-500 mr-2"></i> ${t('<strong>Último recurso</strong>. Alternativas primero.', '<strong>Last resort</strong>. Alternatives first.')}</li>
                       <li><i class="fa-solid fa-clock text-blue-500 mr-2"></i> ${t('Orden MD requerida (< 1 hr). NO PRN.', 'MD order required (< 1 hr). NO PRN.')}</li>
                    </ul>
                    <ul class="space-y-2">
                       <li><i class="fa-solid fa-eye text-blue-500 mr-2"></i> ${t('Chequear Circulación: q15-30 min.', 'Check Circulation: q15-30 min.')}</li>
                       <li><i class="fa-solid fa-unlock text-green-500 mr-2"></i> ${t('Liberar/ROM: q2 horas.', 'Release/ROM: q2 hours.')}</li>
                       <li><i class="fa-solid fa-link text-gray-500 mr-2"></i> ${t('Atar al BASTIDOR (Quick Release).', 'Tie to BED FRAME (Quick Release).')}</li>
                    </ul>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 5. FIRE SAFETY ---
    renderFireSafety() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-lg shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Seguridad contra Incendios', 'Fire Safety')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
             <div class="bg-orange-50 dark:bg-orange-900/10 p-5 rounded-2xl border border-orange-200 dark:border-orange-800">
                <strong class="text-orange-800 dark:text-orange-300 text-3xl block mb-2">R.A.C.E.</strong>
                <p class="text-xs text-gray-500 mb-4 font-bold uppercase">${t('Pasos en caso de incendio', 'Steps for fire')}</p>
                <div class="text-sm text-left space-y-2 text-gray-700 dark:text-gray-300 pl-4 border-l-2 border-orange-300">
                   <p><strong>R</strong>escue ${t('(Rescatar pacientes)', '(Patients)')}</p>
                   <p><strong>A</strong>larm ${t('(Activar alarma)', '(Activate alarm)')}</p>
                   <p><strong>C</strong>ontain ${t('(Cerrar puertas/O2)', '(Close doors/O2)')}</p>
                   <p><strong>E</strong>xtinguish ${t('(Extinguir)', '(Extinguish)')}</p>
                </div>
             </div>

             <div class="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-200 dark:border-red-800">
                <strong class="text-red-800 dark:text-red-300 text-3xl block mb-2">P.A.S.S.</strong>
                <p class="text-xs text-gray-500 mb-4 font-bold uppercase">${t('Uso del Extintor', 'Extinguisher Use')}</p>
                <div class="text-sm text-left space-y-2 text-gray-700 dark:text-gray-300 pl-4 border-l-2 border-red-300">
                   <p><strong>P</strong>ull ${t('(Tirar pasador)', '(Pin)')}</p>
                   <p><strong>A</strong>im ${t('(Apuntar a base)', '(Base)')}</p>
                   <p><strong>S</strong>queeze ${t('(Apretar)', '(Handle)')}</p>
                   <p><strong>S</strong>weep ${t('(Barrer)', '(Side to side)')}</p>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 6. IV THERAPY (Recuperado contenido completo de v6) ---
    renderIVTherapy() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-black text-lg shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Terapia IV', 'IV Therapy')}
            </h2>
          </div>

          <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
             <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <strong class="block text-cyan-600 dark:text-cyan-400 mb-1">ISOTONIC</strong>
                <p class="text-xs text-gray-500 mb-2 font-mono">0.9% NS, LR, D5W (in bag)</p>
                <p class="text-xs text-gray-700 dark:text-gray-300">
                   ${t('Misma osmolaridad. Reemplazo de volumen. Riesgo: Sobrecarga.', 'Same osmolarity. Volume replacement. Risk: Overload.')}
                </p>
             </div>
             <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <strong class="block text-blue-600 dark:text-blue-400 mb-1">HYPOTONIC</strong>
                <p class="text-xs text-gray-500 mb-2 font-mono">0.45% NS, 0.33% NS</p>
                <p class="text-xs text-gray-700 dark:text-gray-300">
                   ${t('Hidrata la célula (Hincha). Cuidado con ICP.', 'Hydrates cell (Swells). Watch for Increased ICP.')}
                </p>
             </div>
             <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <strong class="block text-indigo-600 dark:text-indigo-400 mb-1">HYPERTONIC</strong>
                <p class="text-xs text-gray-500 mb-2 font-mono">3% NS, D10W, TPN</p>
                <p class="text-xs text-gray-700 dark:text-gray-300">
                   ${t('Deshidrata célula (Encoge). Para Edema Cerebral / Hiponatremia severa.', 'Shrinks cell. For Cerebral Edema / Severe Hyponatremia.')}
                </p>
             </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="p-5 bg-cyan-50 dark:bg-cyan-900/10 rounded-2xl border border-cyan-200 dark:border-cyan-800">
              <strong class="text-cyan-800 dark:text-cyan-300 block mb-2">${t('Infiltración', 'Infiltration')}</strong>
              <p class="text-xs text-gray-500 mb-2">${t('Fría, Pálida, Hinchada.', 'Cool, Pale, Swollen.')}</p>
              <div class="text-xs font-bold bg-white dark:bg-cyan-900/30 p-2 rounded border border-cyan-100 dark:border-cyan-800">
                 Stop -> Elevate -> <span class="text-cyan-600">Cold Compress</span>.
              </div>
            </div>

            <div class="p-5 bg-pink-50 dark:bg-pink-900/10 rounded-2xl border border-pink-200 dark:border-pink-800">
              <strong class="text-pink-800 dark:text-pink-300 block mb-2">${t('Flebitis', 'Phlebitis')}</strong>
              <p class="text-xs text-gray-500 mb-2">${t('Caliente, Roja, Dolorosa.', 'Warm, Red Streak, Painful.')}</p>
              <div class="text-xs font-bold bg-white dark:bg-pink-900/30 p-2 rounded border border-pink-100 dark:border-pink-800">
                 Stop -> Remove -> <span class="text-pink-600">Warm Compress</span>.
              </div>
            </div>

            <div class="p-5 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-200 dark:border-rose-800">
              <strong class="text-rose-800 dark:text-rose-300 block mb-2">${t('Extravasación', 'Extravasation')}</strong>
              <p class="text-xs text-gray-500 mb-2">${t('Vesicante (Quimio). Necrosis.', 'Vesicant. Tissue necrosis.')}</p>
              <div class="text-xs font-bold bg-white dark:bg-rose-900/30 p-2 rounded border border-rose-100 dark:border-rose-800">
                 Stop -> Aspirate -> Antidote.
              </div>
            </div>

            <div class="p-5 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-200 dark:border-purple-800">
              <strong class="text-purple-800 dark:text-purple-300 block mb-2">${t('Embolia Aérea', 'Air Embolism')}</strong>
              <p class="text-xs text-gray-500 mb-2">${t('Disnea, Dolor pecho, Soplo.', 'Dyspnea, Chest pain, Murmur.')}</p>
              <div class="text-xs font-bold bg-white dark:bg-purple-900/30 p-2 rounded border border-purple-100 dark:border-purple-800">
                 Clamp -> <span class="text-purple-600">Trendelenburg + Left Side</span> -> O2.
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 7. POSITIONING (Grid Layout de v8 con contenido completo v6) ---
    renderPositions() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">7</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Posicionamiento del Paciente', 'Patient Positioning')}
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
             <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-brand-card shadow-sm">
                <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Air Embolism</strong>
                <span class="font-bold text-gray-800 dark:text-gray-200">Trendelenburg + Left Side</span>
                <p class="text-xs text-gray-500 mt-1">${t('Atrapa aire en aurícula derecha.', 'Traps air in right atrium.')}</p>
             </div>
             <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-brand-card shadow-sm">
                <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Liver Biopsy (Post)</strong>
                <span class="font-bold text-gray-800 dark:text-gray-200">Right Side (Lateral)</span>
                <p class="text-xs text-gray-500 mt-1">${t('Aplica presión en sitio punción.', 'Applies pressure to puncture site.')}</p>
             </div>
             <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-brand-card shadow-sm">
                <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Thoracentesis</strong>
                <span class="font-bold text-gray-800 dark:text-gray-200">Sitting, leaning over table</span>
                <p class="text-xs text-gray-500 mt-1">${t('Expande espacios intercostales.', 'Expands intercostal spaces.')}</p>
             </div>
             <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-brand-card shadow-sm">
                <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">NG Tube / Eating</strong>
                <span class="font-bold text-gray-800 dark:text-gray-200">High Fowler's</span>
                <p class="text-xs text-gray-500 mt-1">${t('Previene aspiración.', 'Prevents aspiration.')}</p>
             </div>
             <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-brand-card shadow-sm">
                <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Enema</strong>
                <span class="font-bold text-gray-800 dark:text-gray-200">Sims (Left Side)</span>
                <p class="text-xs text-gray-500 mt-1">${t('Sigue anatomía del colon.', 'Follows colon anatomy.')}</p>
             </div>
             <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-brand-card shadow-sm">
                <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Post-Lumbar Puncture</strong>
                <span class="font-bold text-gray-800 dark:text-gray-200">Flat / Supine</span>
                <p class="text-xs text-gray-500 mt-1">${t('Previene cefalea espinal.', 'Prevents spinal headache.')}</p>
             </div>
             <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-brand-card shadow-sm">
                <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Shock</strong>
                <span class="font-bold text-gray-800 dark:text-gray-200">Modified Trendelenburg</span>
                <p class="text-xs text-gray-500 mt-1">${t('Piernas elevadas (Retorno venoso).', 'Legs elevated (Venous return).')}</p>
             </div>
             <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-brand-card shadow-sm">
                <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Resp. Distress</strong>
                <span class="font-bold text-gray-800 dark:text-gray-200">High Fowler's / Orthopneic</span>
                <p class="text-xs text-gray-500 mt-1">${t('Maximiza expansión pulmonar.', 'Maximizes lung expansion.')}</p>
             </div>
             <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-brand-card shadow-sm">
                <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Amputation (Lower)</strong>
                <span class="font-bold text-gray-800 dark:text-gray-200">Elevate 24h, then Prone</span>
                <p class="text-xs text-gray-500 mt-1">${t('Edema (1º día), Prevenir contractura (después).', 'Edema (1st day), Prevent contracture (after).')}</p>
             </div>
          </div>
        </section>
      `;
    },

    // --- 8. ETHICAL & LEGAL (Completo v6) ---
    renderEthicalLegal() {
      return `
        <section class="mt-8 mb-12">
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-4">
                    ${t('Principios Éticos & Legales', 'Ethical & Legal Principles')}
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white dark:bg-gray-800 p-3 rounded shadow-sm">
                        <strong class="text-blue-600 block">Autonomy (Autonomía)</strong>
                        <span class="text-sm text-gray-600 dark:text-gray-400">${t('Derecho a decidir (Consentimiento).', 'Right to self-determination.')}</span>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded shadow-sm">
                        <strong class="text-blue-600 block">Beneficence (Beneficencia)</strong>
                        <span class="text-sm text-gray-600 dark:text-gray-400">${t('Hacer el bien.', 'Do good.')}</span>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded shadow-sm">
                        <strong class="text-blue-600 block">Non-maleficence (No maleficencia)</strong>
                        <span class="text-sm text-gray-600 dark:text-gray-400">${t('No hacer daño.', 'Do no harm.')}</span>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded shadow-sm">
                        <strong class="text-blue-600 block">Veracity (Veracidad)</strong>
                        <span class="text-sm text-gray-600 dark:text-gray-400">${t('Decir la verdad.', 'Truth-telling.')}</span>
                    </div>
                </div>
                
                <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div class="bg-white dark:bg-gray-800 p-3 rounded border-l-4 border-red-400">
                        <strong class="text-red-500 block mb-1">Unintentional Torts</strong>
                        <ul class="space-y-1 text-xs">
                            <li><strong>Negligence:</strong> ${t('Práctica bajo el estándar.', 'Practice below standard.')}</li>
                            <li><strong>Malpractice:</strong> ${t('Negligencia Profesional.', 'Professional Negligence.')}</li>
                        </ul>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded border-l-4 border-red-600">
                        <strong class="text-red-700 dark:text-red-500 block mb-1">Intentional Torts</strong>
                        <ul class="space-y-1 text-xs">
                            <li><strong>Assault:</strong> ${t('Amenaza (Sin tocar).', 'Threat (No touching).')}</li>
                            <li><strong>Battery:</strong> ${t('Contacto físico sin consentimiento.', 'Touch without consent.')}</li>
                            <li><strong>False Imprisonment:</strong> ${t('Restricción sin orden.', 'Restraint without order.')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
      `;
    }
  });
})();