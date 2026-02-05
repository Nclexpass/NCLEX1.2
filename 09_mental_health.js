// 09_mental_health.js — Mental Health Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: High-Yield, Seguridad, Farmacología, Legal y Emergencias
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Dependencias: window.NCLEX.registerTopic

(function () {
  'use strict';

  // Helper interno de traducción para optimizar código (DRY)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'mental-health',
    title: { es: 'Salud Mental (Psiquiatría)', en: 'Mental Health (Psych)' },
    subtitle: { es: 'Neurobiología, Seguridad y Trastornos', en: 'Neurobiology, Safety & Disorders' },
    icon: 'brain',
    color: 'teal',

    render() {
      return `
        <style>
          .card-base {
            background-color: white;
            border-radius: 1rem;
            border: 1px solid #e5e7eb;
            padding: 1rem;
            transition: all 0.3s;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }
          .dark .card-base {
            background-color: rgba(30, 41, 59, 0.5);
            border-color: #374151;
          }
          .card-base:hover {
            transform: translateY(-0.25rem);
          }
        </style>
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-user-nurse"></i>
                ${t('Prioridad #1: Seguridad', 'Priority #1: Safety')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Enfermería Psiquiátrica', 'Mental Health Nursing')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('NCLEX Core: Seguridad Física > Comunicación Terapéutica.', 'NCLEX Core: Physical Safety > Therapeutic Communication.')}
              </p>
            </div>
          </div>
          
          <div class="mt-6 p-5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-lg relative overflow-hidden">
            <i class="fa-solid fa-comments absolute -right-4 -bottom-4 text-8xl text-white/10"></i>
            <div class="relative z-10 flex items-start gap-4">
              <i class="fa-solid fa-star text-3xl text-yellow-300 mt-1"></i>
              <div>
                <strong class="block uppercase tracking-wider text-xs opacity-90 mb-1">NCLEX GOLDEN RULE</strong>
                <span class="font-bold text-lg leading-tight block">
                  ${t('NUNCA preguntes "¿Por qué?" (Es juzgar). NUNCA digas "No te preocupes" (Falsa esperanza).', 'NEVER ask "Why?" (Judgmental). NEVER say "Don\'t worry" (False reassurance).')}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderFoundations()}
          ${this.renderLegalRights()}
          ${this.renderAssessmentComm()}
          ${this.renderCriticalCare()}
          ${this.renderDisorders()}
          ${this.renderTherapies()} 
          ${this.renderPharmacologyLabs()}
          ${this.renderEducation()}
        </div>
      `;
    },

    // --- 1. Foundations ---
    renderFoundations() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Neurotransmisores Clave', 'Key Neurotransmitters')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 mt-4">
            <div class="card-base">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1 text-lg">Dopamina</strong>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <span class="block">⬆ ${t('Esquizofrenia (Psicosis)', 'Schizophrenia (Psychosis)')}</span>
                <span class="block">⬇ ${t('Enfermedad de Parkinson', 'Parkinson\'s Disease')}</span>
                <span class="block text-xs italic opacity-70 mt-1">${t('Motivación / Recompensa', 'Motivation / Reward')}</span>
              </p>
            </div>
            <div class="card-base">
              <strong class="text-pink-600 dark:text-pink-400 block mb-1 text-lg">Serotonina</strong>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <span class="block">⬇ ${t('Depresión, TOC', 'Depression, OCD')}</span>
                <span class="block">${t('Regula humor/sueño', 'Regulates mood/sleep')}</span>
                <span class="block text-xs italic opacity-70 mt-1">${t('Inhibitorio', 'Inhibitory')}</span>
              </p>
            </div>
            <div class="card-base">
              <strong class="text-blue-600 dark:text-blue-400 block mb-1 text-lg">GABA</strong>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <span class="block">⬇ ${t('Ansiedad, Insomnio', 'Anxiety, Insomnia')}</span>
                <span class="block">${t('Efecto calmante principal', 'Main calming effect')}</span>
                <span class="block text-xs italic opacity-70 mt-1">${t('Inhibitorio (Benzos)', 'Inhibitory (Benzos)')}</span>
              </p>
            </div>
            <div class="card-base">
              <strong class="text-red-600 dark:text-red-400 block mb-1 text-lg">Norepinefrina</strong>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <span class="block">⬇ ${t('Depresión, ADHD', 'Depression, ADHD')}</span>
                <span class="block">⬆ ${t('Ansiedad, Pánico', 'Anxiety, Panic')}</span>
                <span class="block text-xs italic opacity-70 mt-1">${t('Alerta / Respuesta estrés', 'Alertness / Stress response')}</span>
              </p>
            </div>
            <div class="card-base">
              <strong class="text-amber-600 dark:text-amber-400 block mb-1 text-lg">Acetilcolina</strong>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <span class="block">⬇ ${t('Alzheimer', 'Alzheimer\'s')}</span>
                <span class="block">${t('Memoria, aprendizaje', 'Memory, learning')}</span>
                <span class="block text-xs italic opacity-70 mt-1">${t('Excitatorio', 'Excitatory')}</span>
              </p>
            </div>
          </div>
        </section>
      `;
    },

    // --- 1B. Legal & Ethical Rights ---
    renderLegalRights() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-black text-lg shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Derechos Legales y Éticos', 'Legal & Ethical Rights')}
            </h2>
          </div>
          <div class="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-5 rounded-r-2xl mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <strong class="text-amber-700 dark:text-amber-300 block mb-1"><i class="fa-solid fa-scale-balanced mr-2"></i>${t('Rehusar Tratamiento', 'Refuse Treatment')}</strong>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  ${t('Derecho a rechazar, EXCEPTO si hay <strong class="text-red-500">peligro inminente</strong>.', 'Right to refuse, UNLESS there is <strong class="text-red-500">imminent danger</strong>.')}
                </p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <strong class="text-amber-700 dark:text-amber-300 block mb-1"><i class="fa-solid fa-file-contract mr-2"></i>${t('Confidencialidad', 'Confidentiality')}</strong>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  ${t('Privado. Excepción: <strong class="text-red-500">"Duty to Warn"</strong> (Tarasoff). Si amenaza a un tercero específico.', 'Private. Exception: <strong class="text-red-500">"Duty to Warn"</strong> (Tarasoff). If specific 3rd party threat.')}
                </p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-red-100 dark:border-red-900 shadow-sm">
                <strong class="text-amber-700 dark:text-amber-300 block mb-1"><i class="fa-solid fa-hand-back-fist mr-2"></i>${t('Restricciones (Restraints)', 'Restraints')}</strong>
                <div class="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <p><strong>Adults:</strong> Max 4 hrs.</p>
                  <p><strong>9-17 años:</strong> Max 2 hrs.</p>
                  <p><strong>< 9 años:</strong> Max 1 hr.</p>
                  <p class="font-bold text-red-500">${t('Evaluar c/15-30min. NUNCA PRN.', 'Assess q15-30min. NEVER PRN.')}</p>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <strong class="text-amber-700 dark:text-amber-300 block mb-1"><i class="fa-solid fa-user-lock mr-2"></i>${t('Involuntario (Commitment)', 'Involuntary Commitment')}</strong>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  ${t('Retiene derechos (excepto libertad). Juez decide tras 72h.', 'Retains rights (except freedom). Judge decides after 72h.')}
                </p>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. Assessment & Communication ---
    renderAssessmentComm() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white font-black text-lg shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Comunicación Terapéutica', 'Therapeutic Communication')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 border-l-8 border-green-500 bg-green-50 dark:bg-green-900/10 rounded-r-3xl shadow-sm">
              <h3 class="text-green-800 dark:text-green-300 font-black text-xl mb-4 flex items-center gap-2">
                <i class="fa-solid fa-check-circle"></i> DO (Correcto)
              </h3>
              <ul class="space-y-4 text-sm md:text-base text-gray-700 dark:text-gray-200">
                <li>
                  <strong class="block text-green-700 dark:text-green-400">${t('Aperturas Amplias', 'Broad Openings')}</strong>
                  ${t('"¿De qué te gustaría hablar hoy?"', '"What would you like to discuss?"')}
                </li>
                <li>
                  <strong class="block text-green-700 dark:text-green-400">${t('Reflejar', 'Reflecting')}</strong>
                  ${t('Paciente: "¿Debo divorciarme?" -> Enfermera: "¿Tú qué crees?".', 'Patient: "Should I divorce?" -> Nurse: "What do you think?".')}
                </li>
                <li>
                  <strong class="block text-green-700 dark:text-green-400">${t('Silencio Terapéutico', 'Therapeutic Silence')}</strong>
                  ${t('Permitir pausas; estar presente demuestra apoyo y paciencia.', 'Allow pauses; being present shows support and patience.')}
                </li>
              </ul>
            </div>
            
            <div class="p-6 border-l-8 border-red-500 bg-red-50 dark:bg-red-900/10 rounded-r-3xl shadow-sm">
              <h3 class="text-red-800 dark:text-red-300 font-black text-xl mb-4 flex items-center gap-2">
                <i class="fa-solid fa-circle-xmark"></i> DON'T (Incorrecto)
              </h3>
              <ul class="space-y-4 text-sm md:text-base text-gray-700 dark:text-gray-200">
                <li>
                  <strong class="block text-red-700 dark:text-red-400">${t('Preguntar "¿Por qué?"', 'Asking "Why?"')}</strong>
                  ${t('"¿Por qué estás enojado?" (Suena a acusación, genera defensividad).', '"Why are you angry?" (Sounds accusatory, creates defensiveness).')}
                </li>
                <li>
                  <strong class="block text-red-700 dark:text-red-400">${t('Garantías Falsas', 'False Reassurance')}</strong>
                  ${t('"Todo saldrá bien". (Invalida la experiencia real del paciente).', '"It will be okay". (Invalidates the patient\'s real experience).')}
                </li>
                <li>
                  <strong class="block text-red-700 dark:text-red-400">${t('Dar Consejos', 'Giving Advice')}</strong>
                  ${t('"Yo que tú..." (Quita autonomía y fomenta la dependencia).', '"If I were you..." (Removes autonomy and fosters dependency).')}
                </li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 3. Critical Care ---
    renderCriticalCare() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-lg animate-pulse">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Emergencias Psiquiátricas Agudas', 'Acute Psychiatric Emergencies')}
            </h2>
          </div>

          <div class="space-y-6">
            <div class="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-3xl p-6 relative overflow-hidden" role="alert">
              <div class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase">${t('Prioridad Máxima', 'Top Priority')}</div>
              <h3 class="text-xl font-black text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation"></i>
                ${t('Riesgo de Suicidio - S.A.D. P.E.R.S.O.N.S.', 'Suicide Risk - S.A.D. P.E.R.S.O.N.S.')}
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <strong class="block text-red-700 dark:text-red-400 mb-2">${t('Evaluación Directa (PLAN)', 'Direct Assessment (PLAN)')}</strong>
                  <ul class="list-disc list-inside text-sm text-gray-800 dark:text-gray-200 space-y-2">
                    <li>${t('<strong>Plan:</strong> ¿Tienes un plan específico?', '<strong>Plan:</strong> Do you have a specific plan?')}</li>
                    <li>${t('<strong>Medios:</strong> ¿Tienes acceso (arma, pastillas)?', '<strong>Means:</strong> Do you have access (gun, pills)?')}</li>
                    <li>${t('<strong>Intención/Letalidad:</strong> ¿Vas a usarlo?', '<strong>Intent/Lethality:</strong> Will you use it?')}</li>
                    <li class="text-red-600 dark:text-red-300 font-bold">${t('Alerta: Mejora repentina del humor (decisión tomada).', 'Red Flag: Sudden mood lift (decision made).')}</li>
                  </ul>
                </div>
                <div>
                   <strong class="block text-red-700 dark:text-red-400 mb-2">${t('Intervenciones Inmediatas', 'Immediate Interventions')}</strong>
                   <ul class="text-sm text-gray-800 dark:text-gray-200 space-y-2">
                     <li class="bg-white dark:bg-black/30 p-2 rounded border-l-4 border-red-500">
                       <strong>1:1 Observación constante:</strong> ${t('A un brazo de distancia. No privacidad.', 'Arms-length distance. No privacy.')}
                     </li>
                     <li class="bg-white dark:bg-black/30 p-2 rounded border-l-4 border-red-500">
                       ${t('<strong>Seguridad:</strong> Retirar cordones, cinturones, vidrio, cubiertos.', '<strong>Safety:</strong> Remove laces, belts, glass, cutlery.')}
                     </li>
                     <li class="bg-white dark:bg-black/30 p-2 rounded border-l-4 border-red-500">
                       ${t('<strong>Contrato de seguridad:</strong> Documentar acuerdo.', '<strong>Safety contract:</strong> Document agreement.')}
                     </li>
                   </ul>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-gray-800 text-white p-5 rounded-2xl shadow-lg border-t-4 border-indigo-500">
                <strong class="text-indigo-300 block mb-1">NMS (Neuroléptico Maligno)</strong>
                <span class="text-xs text-gray-400 block mb-2">Antipsicóticos (Haldol)</span>
                <div class="text-sm space-y-1">
                   <p>• <strong>Fiebre alta (>38.5°C)</strong></p>
                   <p>• Rigidez "tubo de plomo"</p>
                   <p>• CPK elevada</p>
                   <p class="text-indigo-200 font-bold text-xs mt-2">Tx: Dantrolene, Stop Med.</p>
                </div>
              </div>

              <div class="bg-gray-800 text-white p-5 rounded-2xl shadow-lg border-t-4 border-orange-500">
                <strong class="text-orange-300 block mb-1">Síndrome Serotoninérgico</strong>
                <span class="text-xs text-gray-400 block mb-2">SSRI + MAOI/St. John's</span>
                <div class="text-sm space-y-1">
                   <p>• <strong>Hiperreflexia / Clonus</strong></p>
                   <p>• Agitación, Diaforesis</p>
                   <p>• Midriasis (Pupilas dilatadas)</p>
                   <p class="text-orange-200 font-bold text-xs mt-2">Tx: Ciproheptadina.</p>
                </div>
              </div>

              <div class="bg-gray-800 text-white p-5 rounded-2xl shadow-lg border-t-4 border-rose-500">
                <strong class="text-rose-300 block mb-1">Delirium Tremens (DTs)</strong>
                <span class="text-xs text-gray-400 block mb-2">Alcohol (48-72h)</span>
                <div class="text-sm space-y-1">
                   <p>• <strong>Alucinaciones</strong></p>
                   <p>• Hipertensión, Taquicardia</p>
                   <p>• Riesgo convulsión letal</p>
                   <p class="text-rose-200 font-bold text-xs mt-2">Tx: Benzos, Tiamina (B1).</p>
                </div>
              </div>
              
              <div class="bg-gray-800 text-white p-5 rounded-2xl shadow-lg border-t-4 border-teal-500">
                <strong class="text-teal-300 block mb-1">${t('Abstinencia Opioides', 'Opioid Withdrawal')}</strong>
                <span class="text-xs text-gray-400 block mb-2">${t('No letal', 'Not lethal')}</span>
                <div class="text-sm space-y-1">
                   <p>• <strong>Rinorrea, Lagrimeo</strong></p>
                   <p>• Piloerección, Bostezos</p>
                   <p>• Diarrea, Pupilas dilatadas</p>
                   <p class="text-teal-200 font-bold text-xs mt-2">Tx: Metadona, Clonidina.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Disorders ---
    renderDisorders() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Trastornos Clínicos', 'Clinical Disorders')}
            </h2>
          </div>

          <div class="space-y-6">
            <div class="bg-white dark:bg-brand-card rounded-3xl p-6 shadow-md border border-gray-200 dark:border-brand-border">
              <h3 class="text-xl font-bold text-purple-700 dark:text-purple-400 mb-3">${t('Esquizofrenia', 'Schizophrenia')}</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <strong class="block text-gray-900 dark:text-white mb-2">${t('Síntomas Positivos', 'Positive Symptoms')}</strong>
                   <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                     <li><strong class="text-purple-600">Delirios:</strong> Falsas creencias (Grandeza/Paranoia). No confrontar. Presentar la realidad.</li>
                     <li><strong class="text-purple-600">Alucinaciones:</strong> Percepciones falsas. Preguntar "¿Qué dicen las voces?" (Comandos de daño).</li>
                   </ul>
                </div>
                <div>
                   <strong class="block text-gray-900 dark:text-white mb-2">${t('Síntomas Negativos', 'Negative Symptoms')}</strong>
                   <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                     <li>Apatía, falta de energía, aislamiento social, aplanamiento afectivo, anhedonia.</li>
                   </ul>
                </div>
              </div>
            </div>

            <div class="bg-amber-50 dark:bg-amber-900/10 rounded-3xl p-6 border border-amber-200 dark:border-amber-800">
               <h3 class="text-xl font-bold text-amber-800 dark:text-amber-300 mb-3">${t('Bipolar (Manía)', 'Bipolar (Mania)')}</h3>
               <div class="flex flex-wrap gap-3 text-sm">
                 <span class="px-3 py-1 bg-white dark:bg-black/20 rounded-full border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100">
                    <i class="fa-solid fa-utensils mr-1"></i> ${t('Finger Foods (altos en cal)', 'Finger Foods (high cal)')}
                 </span>
                 <span class="px-3 py-1 bg-white dark:bg-black/20 rounded-full border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100">
                    <i class="fa-solid fa-bed mr-1"></i> ${t('Baja estimulación', 'Low stimuli')}
                 </span>
                 <span class="px-3 py-1 bg-white dark:bg-black/20 rounded-full border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100">
                    <i class="fa-solid fa-person-circle-exclamation mr-1"></i> ${t('Límites firmes', 'Firm limits')}
                 </span>
               </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-rose-50 dark:bg-rose-900/10 rounded-3xl p-6 border border-rose-200 dark:border-rose-800">
                   <h3 class="text-lg font-bold text-rose-800 dark:text-rose-300 mb-3">Borderline (Límite)</h3>
                   <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                     <li>Miedo al abandono (real o imaginado).</li>
                     <li>Autolesiones (Cutting) y riesgo suicida.</li>
                     <li><strong class="text-rose-600">Splitting:</strong> "Tú eres buena, ella es mala".</li>
                     <li><strong>Tx:</strong> Límites consistentes, rotación de staff, validación.</li>
                   </ul>
                </div>
                
                <div class="bg-gray-100 dark:bg-gray-800 rounded-3xl p-6 border border-gray-300 dark:border-gray-700">
                   <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">Antisocial</h3>
                   <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                     <li>Sin remordimiento/empatía. Manipuladores.</li>
                     <li>Rompen reglas y derechos de otros.</li>
                     <li><strong>Tx:</strong> Límites claros ("No se tolera esta conducta").</li>
                   </ul>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div class="p-5 bg-pink-50 dark:bg-pink-900/10 rounded-2xl border border-pink-200 dark:border-pink-800">
                 <strong class="text-pink-800 dark:text-pink-300 block mb-1">Anorexia Nerviosa</strong>
                 <p class="text-sm text-gray-700 dark:text-gray-300">
                    Peso << 85%. Amenorrea, Lanugo, Hipotermia.<br>
                    <strong>Tx:</strong> Supervisión estricta durante y 1h post comidas.
                 </p>
               </div>
               <div class="p-5 bg-pink-50 dark:bg-pink-900/10 rounded-2xl border border-pink-200 dark:border-pink-800">
                 <strong class="text-pink-800 dark:text-pink-300 block mb-1">Bulimia Nerviosa</strong>
                 <p class="text-sm text-gray-700 dark:text-gray-300">
                    Peso normal. Atracón/Purga. Signo de Russell (nudillos).<br>
                    <strong>Riesgo:</strong> Hipokalemia (por vómito) -> Arritmias.
                 </p>
               </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 5B. Therapies ---
    renderTherapies() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-black text-lg shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('ECT (Terapia Electroconvulsiva)', 'ECT (Electroconvulsive Therapy)')}
            </h2>
          </div>
          
          <div class="bg-cyan-50 dark:bg-cyan-900/20 rounded-3xl p-6 border border-cyan-200 dark:border-cyan-800">
            <p class="text-sm text-gray-700 dark:text-gray-300 mb-4">
              ${t('Para depresión severa resistente. Induce convulsión controlada.', 'For severe resistant depression. Induces controlled seizure.')}
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div class="bg-white dark:bg-black/20 p-3 rounded-lg">
                <strong class="block text-cyan-700 dark:text-cyan-400 mb-1">Pre-Op</strong>
                <ul class="list-disc list-inside text-xs">
                  <li>NPO 6-8h.</li>
                  <li>Consentimiento firmado.</li>
                  <li>Vaciar vejiga.</li>
                  <li>Quitar dentaduras.</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-black/20 p-3 rounded-lg">
                <strong class="block text-cyan-700 dark:text-cyan-400 mb-1">Meds</strong>
                <ul class="list-disc list-inside text-xs">
                  <li>Atropina (secar secreciones).</li>
                  <li>Succinylcholine (relajante muscular).</li>
                  <li>Anestésico corto.</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-black/20 p-3 rounded-lg">
                <strong class="block text-cyan-700 dark:text-cyan-400 mb-1">Post-Op</strong>
                <ul class="list-disc list-inside text-xs">
                  <li>Posición lateral.</li>
                  <li>Confusión/Pérdida memoria (Temporal).</li>
                  <li>Reorientar.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 6. Pharmacology ---
    renderPharmacologyLabs() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-lg shadow-lg">7</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Farmacología Psiquiátrica', 'Psychiatric Pharmacology')}
            </h2>
          </div>

          <div class="overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-800 text-white uppercase text-xs">
                <tr>
                  <th class="p-4">${t('Med', 'Med')}</th>
                  <th class="p-4">${t('Info Clave & Seguridad', 'Key Info & Safety')}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-brand-card">
                <tr>
                  <td class="p-4 font-bold text-teal-700 dark:text-teal-400">Lithium</td>
                  <td class="p-4 text-gray-700 dark:text-gray-300">
                    Rango: <strong>0.6 - 1.2</strong>. Tóxico > 1.5.<br>
                    <strong>Tóxico:</strong> Temblor GRUESO, diarrea, tinnitus.<br>
                    <strong>Edu:</strong> Mantener Sodio y Fluidos estables (2-3L). NO diuréticos.
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-yellow-700 dark:text-yellow-400">Clozapine</td>
                  <td class="p-4 text-gray-700 dark:text-gray-300">
                    Riesgo: <strong class="text-red-500">Agranulocitosis</strong> (↓WBC).<br>
                    Monitorizar WBC semanalmente. Reportar fiebre/dolor garganta.
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-red-700 dark:text-red-400">MAOIs</td>
                  <td class="p-4 text-gray-700 dark:text-gray-300">
                    <strong>NO Tiramina</strong> (Queso añejo, Vino, Embutidos) -> Crisis HTA.<br>
                    Esperar 14 días para cambiar a SSRI.
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-purple-700 dark:text-purple-400">SSRIs</td>
                  <td class="p-4 text-gray-700 dark:text-gray-300">
                    Efecto en 4-6 semanas. <strong>Riesgo suicida</strong> al inicio (energía ↑).<br>
                    Síndrome Serotoninérgico (SAD HEAD). No parar abruptamente.
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-blue-700 dark:text-blue-400">Benzos</td>
                  <td class="p-4 text-gray-700 dark:text-gray-300">
                    Sedación, Depresión Resp. Adictivo.<br>
                    Antídoto: <strong>Flumazenil</strong>.
                  </td>
                </tr>
                 <tr>
                  <td class="p-4 font-bold text-indigo-700 dark:text-indigo-400">Typical Antipsych (Haldol)</td>
                  <td class="p-4 text-gray-700 dark:text-gray-300">
                    Riesgo alto de EPS (Distonía, Tardive Dyskinesia).<br>
                    Riesgo de NMS (Fiebre alta).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      `;
    },

    // --- 7. Education ---
    renderEducation() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-10">
            <div class="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-lg shadow-lg">8</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Mecanismos de Defensa', 'Defense Mechanisms')}
            </h2>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
            <div class="card-base">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Proyección</strong>
              <span class="text-xs text-gray-600 dark:text-gray-300">${t('"Tú me odias" (cuando yo te odio).', '"You hate me" (when I hate you).')}</span>
            </div>
            <div class="card-base">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Desplazamiento</strong>
              <span class="text-xs text-gray-600 dark:text-gray-300">${t('Golpear pared (ira redirigida a objeto seguro).', 'Punching wall (redirected anger).')}</span>
            </div>
            <div class="card-base">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Racionalización</strong>
              <span class="text-xs text-gray-600 dark:text-gray-300">${t('Excusas lógicas para fallos.', 'Logical excuses for failures.')}</span>
            </div>
            <div class="card-base">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Negación</strong>
              <span class="text-xs text-gray-600 dark:text-gray-300">${t('Rechazar realidad ("No soy alcohólico").', 'Refusing reality ("I\'m not alcoholic").')}</span>
            </div>
            <div class="card-base">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Regresión</strong>
              <span class="text-xs text-gray-600 dark:text-gray-300">${t('Conducta infantil (chuparse el dedo).', 'Child-like behavior (thumb sucking).')}</span>
            </div>
            <div class="card-base">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Sublimación</strong>
              <span class="text-xs text-gray-600 dark:text-gray-300">${t('Canalizar a algo positivo (Boxeo). MADURO.', 'Channeling to positive (Boxing). MATURE.')}</span>
            </div>
            <div class="card-base">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Intelectualización</strong>
              <span class="text-xs text-gray-600 dark:text-gray-300">${t('Usar lógica para evitar emoción.', 'Using logic to avoid emotion.')}</span>
            </div>
            <div class="card-base">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Represión</strong>
              <span class="text-xs text-gray-600 dark:text-gray-300">${t('Olvido inconsciente de trauma.', 'Unconscious forgetting of trauma.')}</span>
            </div>
            <div class="card-base">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Formación Reactiva</strong>
              <span class="text-xs text-gray-600 dark:text-gray-300">${t('Actuar opuesto a lo que se siente.', 'Acting opposite to feelings.')}</span>
            </div>
            <div class="card-base">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-1">Anulación</strong>
              <span class="text-xs text-gray-600 dark:text-gray-300">${t('Acción simbólica (lavarse manos compulsivo).', 'Symbolic action (hand washing).')}</span>
            </div>
          </div>
        </section>
      `;
    }
  });
})();