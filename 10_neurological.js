// 10_neurological.js — Neurological Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: Fusionando arquitectura de NEURO8 con profundidad de NEURO6/7
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // Helper de traducción para arquitectura DRY (Don't Repeat Yourself)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'neurological',
    title: { es: 'Neurología (Neuro)', en: 'Neurological (Neuro)' },
    subtitle: { es: 'GCS, PIC, ACV, Convulsiones y Neurodegenerativos', en: 'GCS, ICP, Stroke, Seizures & Neurodegenerative' },
    icon: 'brain',
    color: 'violet',

    render() {
      return `
        <style>
          .neuro-card {
            @apply bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border shadow-sm p-5;
          }
        </style>
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-brain"></i>
                <span class="lang-es">Masterclass Neuro</span>
                <span class="lang-en hidden-lang">Neuro Masterclass</span>
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Sistema Neurológico', 'Neurological System')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('Prioridades: <strong class="text-red-500">LOC</strong> (Conciencia), Seguridad en Convulsiones y PIC.', 
                    'Priorities: <strong class="text-red-500">LOC</strong> (Level of Consciousness), Seizure Safety & ICP.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderNeuroAnatomy()}
          ${this.renderAssessment()}
          ${this.renderCranialNerves()}
          ${this.renderICP()}
          ${this.renderMeningitis()}
          ${this.renderSeizures()}
          ${this.renderStroke()}
          ${this.renderSpinalCord()}
          ${this.renderNeurodegenerative()}
          ${this.renderNeuroMeds()}
          ${this.renderProcedures()}
        </div>
      `;
    },

    // --- 0. NEUROANATOMÍA RÁPIDA ---
    renderNeuroAnatomy() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">0</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Neuroanatomía Rápida', 'Quick Neuroanatomy')}
            </h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="neuro-card border-t-4 border-blue-500">
              <strong class="text-blue-600 dark:text-blue-400 block mb-1 text-lg">Frontal</strong>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                ${t('Personalidad, Juicio, Movimiento, <strong>Broca</strong> (Habla).', 'Personality, Judgment, Movement, <strong>Broca\'s</strong> (Speech).')}
              </p>
            </div>
            <div class="neuro-card border-t-4 border-green-500">
              <strong class="text-green-600 dark:text-green-400 block mb-1 text-lg">Parietal</strong>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                ${t('Sensación (Tacto, Dolor, Temp), Espacio.', 'Sensation (Touch, Pain, Temp), Spatial.')}
              </p>
            </div>
            <div class="neuro-card border-t-4 border-amber-500">
              <strong class="text-amber-600 dark:text-amber-400 block mb-1 text-lg">Temporal</strong>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                ${t('Audición, Memoria, <strong>Wernicke</strong> (Comprensión).', 'Hearing, Memory, <strong>Wernicke\'s</strong> (Comprehension).')}
              </p>
            </div>
            <div class="neuro-card border-t-4 border-purple-500">
              <strong class="text-purple-600 dark:text-purple-400 block mb-1 text-lg">Occipital</strong>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                ${t('Visión. Lesión → Ceguera cortical.', 'Vision. Injury → Cortical blindness.')}
              </p>
            </div>
          </div>
          <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <strong class="text-indigo-700 dark:text-indigo-300 block mb-1">
              ${t('Localización de Signos Clave:', 'Key Signs Localization:')}
            </strong>
            <ul class="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
              <li>${t('<strong>Afasia de Broca:</strong> Expresiva (Motor).', '<strong>Broca\'s Aphasia:</strong> Expressive (Motor).')}</li>
              <li>${t('<strong>Afasia de Wernicke:</strong> Receptiva (Comprensión).', '<strong>Wernicke\'s Aphasia:</strong> Receptive (Comprehension).')}</li>
            </ul>
          </div>
        </section>
      `;
    },

    // --- 1. ASSESSMENT & GCS ---
    renderAssessment() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black text-lg shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Escala de Coma de Glasgow (GCS)', 'Glasgow Coma Scale (GCS)')}
            </h2>
          </div>

          <div class="neuro-card shadow-lg mb-6">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h3 class="font-bold text-violet-800 dark:text-violet-300 text-xl">
                  ${t('Score: 3 (Coma) - 15 (Alerta)', 'Score: 3 (Coma) - 15 (Alert)')}
                </h3>
                <p class="text-sm text-gray-500">
                  ${t('Mnemotécnico: <strong class="text-violet-600">"Ojos 4, Verbal 5, Motor 6"</strong>', 'Mnemonic: <strong class="text-violet-600">"Eyes 4, Verbal 5, Motor 6"</strong>')}
                </p>
              </div>
              <div class="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm animate-pulse">
                <i class="fa-solid fa-triangle-exclamation mr-1"></i>
                ${t('GCS ≤ 8 = INTUBACIÓN (Coma)', 'GCS ≤ 8 = INTUBATE (Coma)')}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm md:text-base">
              <div class="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <strong class="block text-indigo-500 mb-3 text-lg uppercase tracking-wide border-b border-indigo-200 pb-1">
                  <i class="fa-regular fa-eye mr-2"></i> ${t('Ojos (4)', 'Eyes (4)')}
                </strong>
                <ul class="space-y-2 text-gray-700 dark:text-gray-300 font-medium">
                  <li class="flex justify-between"><span>4: ${t('Espontánea', 'Spontaneous')}</span> <span class="font-bold text-indigo-600">4</span></li>
                  <li class="flex justify-between"><span>3: ${t('A la voz', 'To voice')}</span> <span class="font-bold text-indigo-600">3</span></li>
                  <li class="flex justify-between"><span>2: ${t('Al dolor', 'To pain')}</span> <span class="font-bold text-indigo-600">2</span></li>
                  <li class="flex justify-between text-gray-400"><span>1: ${t('Ninguna', 'None')}</span> <span>1</span></li>
                </ul>
              </div>
              <div class="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <strong class="block text-indigo-500 mb-3 text-lg uppercase tracking-wide border-b border-indigo-200 pb-1">
                  <i class="fa-regular fa-comment-dots mr-2"></i> ${t('Verbal (5)', 'Verbal (5)')}
                </strong>
                <ul class="space-y-2 text-gray-700 dark:text-gray-300 font-medium">
                  <li class="flex justify-between"><span>5: ${t('Orientado', 'Oriented')}</span> <span class="font-bold text-indigo-600">5</span></li>
                  <li class="flex justify-between"><span>4: ${t('Confuso', 'Confused')}</span> <span class="font-bold text-indigo-600">4</span></li>
                  <li class="flex justify-between"><span>3: ${t('Inapropiado', 'Inappropriate')}</span> <span class="font-bold text-indigo-600">3</span></li>
                  <li class="flex justify-between"><span>2: ${t('Incomprensible', 'Incomprehensible')}</span> <span class="font-bold text-indigo-600">2</span></li>
                  <li class="flex justify-between text-gray-400"><span>1: ${t('Ninguna', 'None')}</span> <span>1</span></li>
                </ul>
              </div>
              <div class="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <strong class="block text-indigo-500 mb-3 text-lg uppercase tracking-wide border-b border-indigo-200 pb-1">
                  <i class="fa-solid fa-person-running mr-2"></i> ${t('Motor (6)', 'Motor (6)')}
                </strong>
                <ul class="space-y-2 text-gray-700 dark:text-gray-300 font-medium">
                  <li class="flex justify-between"><span>6: ${t('Obedece', 'Obeys')}</span> <span class="font-bold text-indigo-600">6</span></li>
                  <li class="flex justify-between"><span>5: ${t('Localiza dolor', 'Localizes pain')}</span> <span class="font-bold text-indigo-600">5</span></li>
                  <li class="flex justify-between"><span>4: ${t('Retira al dolor', 'Withdraws')}</span> <span class="font-bold text-indigo-600">4</span></li>
                  <li class="flex justify-between text-amber-600"><span>3: ${t('Decorticación', 'Decorticate')}</span> <span class="font-bold">3</span></li>
                  <li class="flex justify-between text-red-600"><span>2: ${t('Descerebración', 'Decerebrate')}</span> <span class="font-bold">2</span></li>
                  <li class="flex justify-between text-gray-400"><span>1: ${t('Ninguna', 'None')}</span> <span>1</span></li>
                </ul>
              </div>
            </div>
            
            <div class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800 text-sm">
              <strong class="block text-amber-800 dark:text-amber-400 mb-1">${t('Posturas:', 'Posturing:')}</strong>
              <p><strong>De<span class="text-red-600">COR</span>ticate</strong> = Manos al <span class="text-red-600">COR</span>azón (Flexión). Cortex dañado.</p>
              <p><strong>D<span class="text-red-600">E</span>c<span class="text-red-600">E</span>r<span class="text-red-600">E</span>brate</strong> = <span class="text-red-600">E</span>xtensión (<span class="text-red-600">E</span>xtremidades). Tronco dañado. <strong>PEOR PRONÓSTICO.</strong></p>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. CRANIAL NERVES (From NEURO8) ---
    renderCranialNerves() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-white font-black text-lg shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Pares Craneales (NCLEX High-Yield)', 'Cranial Nerves (NCLEX High-Yield)')}
            </h2>
          </div>

          <div class="bg-white dark:bg-brand-card rounded-3xl p-6 shadow-md border border-gray-200 dark:border-brand-border">
            <div class="mb-4 text-center p-3 bg-pink-50 dark:bg-pink-900/10 rounded-xl">
               <strong class="text-pink-700 dark:text-pink-300 block mb-1">Mnemonic:</strong>
               <p class="text-sm italic text-gray-700 dark:text-gray-300">"<strong>O</strong>h <strong>O</strong>h <strong>O</strong>h <strong>T</strong>o <strong>T</strong>ouch <strong>A</strong>nd <strong>F</strong>eel <strong>V</strong>ery <strong>G</strong>ood <strong>V</strong>elvet <strong>A</strong>h <strong>H</strong>eaven"</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
               <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                 <strong class="text-gray-900 dark:text-white">I. Olfactory</strong>
                 <p class="text-gray-500 text-xs">${t('Olor (café, jabón).', 'Smell (coffee, soap).')}</p>
               </div>
               <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                 <strong class="text-gray-900 dark:text-white">II. Optic</strong>
                 <p class="text-gray-500 text-xs">${t('Visión (Snellen chart).', 'Vision (Snellen chart).')}</p>
               </div>
               <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                 <strong class="text-gray-900 dark:text-white">III. Oculomotor</strong>
                 <p class="text-gray-500 text-xs">${t('Pupilas (PERRLA), párpados.', 'Pupils (PERRLA), eyelids.')}</p>
               </div>
               <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                 <strong class="text-gray-900 dark:text-white">IV. Trochlear</strong>
                 <p class="text-gray-500 text-xs">${t('Ojos abajo/adentro.', 'Eye movement down/in.')}</p>
               </div>
               <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                 <strong class="text-gray-900 dark:text-white">V. Trigeminal</strong>
                 <p class="text-gray-500 text-xs">${t('Masticación, sensación facial.', 'Chewing, face sensation.')}</p>
               </div>
               <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                 <strong class="text-gray-900 dark:text-white">VI. Abducens</strong>
                 <p class="text-gray-500 text-xs">${t('Ojos lateral.', 'Eye movement lateral.')}</p>
               </div>
               <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                 <strong class="text-gray-900 dark:text-white">VII. Facial</strong>
                 <p class="text-gray-500 text-xs">${t('Expresión facial (sonreír), gusto.', 'Facial expression (smile), taste.')}</p>
               </div>
               <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                 <strong class="text-gray-900 dark:text-white">VIII. Vestibulocochlear</strong>
                 <p class="text-gray-500 text-xs">${t('Audición, equilibrio.', 'Hearing, balance.')}</p>
               </div>
               <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                 <strong class="text-gray-900 dark:text-white">IX. Glossopharyngeal</strong>
                 <p class="text-gray-500 text-xs">${t('Reflejo nauseoso, tragar.', 'Gag reflex, swallow.')}</p>
               </div>
               <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                 <strong class="text-gray-900 dark:text-white">X. Vagus</strong>
                 <p class="text-gray-500 text-xs">${t('Habla, tragar, parasimpático.', 'Speech, swallow, parasympathetic.')}</p>
               </div>
               <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                 <strong class="text-gray-900 dark:text-white">XI. Accessory</strong>
                 <p class="text-gray-500 text-xs">${t('Encoger hombros (fuerza).', 'Shoulder shrug (strength).')}</p>
               </div>
               <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                 <strong class="text-gray-900 dark:text-white">XII. Hypoglossal</strong>
                 <p class="text-gray-500 text-xs">${t('Movimiento lengua (sacar lengua).', 'Tongue movement (stick out).')}</p>
               </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 3. ICP ---
    renderICP() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Hipertensión Intracraneal (PIC)', 'Intracranial Hypertension (ICP)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-200 dark:border-red-800">
              <strong class="text-xl text-red-700 dark:text-red-400 block mb-4 border-b border-red-200 pb-2">
                ${t('Triada de Cushing (Signo Tardío)', 'Cushing\'s Triad (Late Sign)')}
              </strong>
              
              <ul class="space-y-4 bg-white dark:bg-black/20 p-4 rounded-xl shadow-sm">
                  <li class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg"><i class="fa-solid fa-arrow-up"></i></div>
                    <div>
                      <span class="block font-bold text-gray-900 dark:text-gray-100">${t('Hipertensión Sistólica', 'Systolic Hypertension')}</span>
                      <span class="text-xs text-gray-500">${t('Presión de pulso amplia.', 'Widening pulse pressure.')}</span>
                    </div>
                  </li>
                  <li class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg"><i class="fa-solid fa-arrow-down"></i></div>
                    <div>
                      <span class="block font-bold text-gray-900 dark:text-gray-100">${t('Bradicardia', 'Bradycardia')}</span>
                      <span class="text-xs text-gray-500">${t('Pulso lleno.', 'Bounding pulse.')}</span>
                    </div>
                  </li>
                  <li class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg"><i class="fa-solid fa-lungs"></i></div>
                    <div>
                      <span class="block font-bold text-gray-900 dark:text-gray-100">${t('Respiración Irregular', 'Irregular Respirations')}</span>
                      <span class="text-xs text-gray-500">${t('Cheyne-Stokes.', 'Cheyne-Stokes.')}</span>
                    </div>
                  </li>
              </ul>
              <div class="mt-4 p-3 bg-white dark:bg-black/20 rounded-xl border border-red-100 dark:border-red-800/30 text-sm">
                 <strong class="text-red-600 dark:text-red-400 uppercase block mb-1">${t('¡CONTRARIO AL SHOCK!', 'OPPOSITE OF SHOCK!')}</strong>
                 <p class="text-gray-600 dark:text-gray-400">${t('Shock: BP baja, HR alta. Cushing: BP alta, HR baja.', 'Shock: Low BP, High HR. Cushing: High BP, Low HR.')}</p>
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <strong class="text-xl text-violet-700 dark:text-violet-400 block mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                ${t('Intervenciones (ICLEAN)', 'Interventions (ICLEAN)')}
              </strong>
              
              <ul class="space-y-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                <li class="flex gap-3"><i class="fa-solid fa-bed text-violet-500 mt-1"></i> <span>${t('<strong>Posición:</strong> Cabecera 30°, cabeza neutra. NO flexión cadera.', '<strong>Position:</strong> HOB 30°, head midline. NO hip flexion.')}</span></li>
                <li class="flex gap-3"><i class="fa-solid fa-volume-xmark text-violet-500 mt-1"></i> <span>${t('<strong>Estímulos Bajos:</strong> Ambiente tranquilo, luces bajas.', '<strong>Low Stimuli:</strong> Quiet environment, dim lights.')}</span></li>
                <li class="flex gap-3"><i class="fa-solid fa-ban text-red-500 mt-1"></i> <span>${t('<strong>Evitar Valsalva:</strong> Tos, estornudos. Dar ablandadores.', '<strong>Avoid Valsalva:</strong> Cough, sneeze. Give stool softeners.')}</span></li>
                <li class="flex gap-3"><i class="fa-solid fa-thermometer text-violet-500 mt-1"></i> <span>${t('<strong>Temperatura:</strong> Controlar fiebre (↑ demanda metabólica).', '<strong>Temperature:</strong> Control fever (↑ metabolic demand).')}</span></li>
                <li class="flex gap-3"><i class="fa-solid fa-pills text-blue-500 mt-1"></i> <span>${t('<strong>Meds:</strong> Manitol (Osmótico), Salino Hipertónico 3%.', '<strong>Meds:</strong> Mannitol (Osmotic), Hypertonic Saline 3%.')}</span></li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. MENINGITIS ---
    renderMeningitis() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
             <div class="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-lg shadow-lg">4</div>
             <h2 class="text-2xl font-black text-gray-900 dark:text-white">Meningitis</h2>
          </div>

          <div class="bg-teal-50 dark:bg-teal-900/10 p-6 rounded-3xl border border-teal-200 dark:border-teal-800">
             <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-1">
                  <h3 class="font-bold text-teal-800 dark:text-teal-300 text-lg mb-2">${t('Signos Clásicos', 'Classic Signs')}</h3>
                  <ul class="space-y-2 text-sm text-gray-800 dark:text-gray-200 mt-4">
                    <li><i class="fa-solid fa-check text-teal-500 mr-2"></i> ${t('<strong>Cefalea Severa</strong>, Fotofobia.', '<strong>Severe Headache</strong>, Photophobia.')}</li>
                    <li><i class="fa-solid fa-check text-teal-500 mr-2"></i> ${t('<strong>Rigidez de Nuca</strong>.', '<strong>Nuchal Rigidity</strong> (Stiff neck).')}</li>
                    <li><i class="fa-solid fa-check text-teal-500 mr-2"></i> ${t('<strong>Kernig:</strong> Dolor al extender rodilla.', '<strong>Kernig\'s:</strong> Pain extending knee.')}</li>
                    <li><i class="fa-solid fa-check text-teal-500 mr-2"></i> ${t('<strong>Brudzinski:</strong> Flexión cuello causa flexión rodillas.', '<strong>Brudzinski\'s:</strong> Neck flexion causes knee flexion.')}</li>
                  </ul>
                </div>
                
                <div class="flex-1">
                   <div class="bg-white dark:bg-black/30 p-4 rounded-xl border border-teal-100 dark:border-teal-800 shadow-sm mb-3">
                      <strong class="block text-red-600 font-black uppercase mb-1">${t('PRECAUCIONES GOTAS (DROPLET)', 'DROPLET PRECAUTIONS')}</strong>
                      <span class="text-sm text-gray-700 dark:text-gray-300">${t('Hasta 24h de antibióticos. Mascarilla quirúrgica.', 'Until 24h of antibiotics. Surgical mask.')}</span>
                   </div>
                   <div class="mb-3">
                     <strong class="text-teal-700 dark:text-teal-400 block mb-1">${t('Punción Lumbar:', 'Lumbar Puncture:')}</strong>
                     <p class="text-sm text-gray-700 dark:text-gray-300">${t('Posición fetal. Post: Plano 4-6h (evitar cefalea).', 'Fetal position. Post: Flat 4-6h (prevent headache).')}</p>
                   </div>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 5. SEIZURES ---
    renderSeizures() {
      return `
        <section>
           <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-lg shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">${t('Convulsiones', 'Seizures')}</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="neuro-card bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800">
                <h3 class="font-bold text-orange-800 dark:text-orange-300 mb-2 text-lg">${t('Seguridad Aguda', 'Acute Safety')}</h3>
                <ul class="space-y-3 text-sm md:text-base">
                   <li class="flex items-center gap-3"><i class="fa-solid fa-user-shield text-green-500"></i> <span>${t('<strong>Posición Lateral</strong> (Vía aérea).', '<strong>Side Lying</strong> (Airway).')}</span></li>
                   <li class="flex items-center gap-3"><i class="fa-solid fa-ban text-red-500"></i> <span>${t('<strong>NO Restringir.</strong>', '<strong>NO Restraints.</strong>')}</span></li>
                   <li class="flex items-center gap-3"><i class="fa-solid fa-ban text-red-500"></i> <span>${t('<strong>NADA en boca.</strong>', '<strong>NOTHING in mouth.</strong>')}</span></li>
                   <li class="flex items-center gap-3"><i class="fa-solid fa-clock text-blue-500"></i> <span>${t('<strong>Cronometrar.</strong> >5 min = Emergencia.', '<strong>Time it.</strong> >5 min = Emergency.')}</span></li>
                </ul>
             </div>

             <div class="neuro-card">
                <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-2 text-lg">${t('Tipos de Crisis', 'Seizure Types')}</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm text-left">
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr><td class="p-2 font-bold">${t('Tónico-Clónica', 'Tonic-Clonic')}</td><td class="p-2">${t('Rigidez + Sacudidas. Pérdida conciencia.', 'Stiff + Jerking. Loss of consciousness.')}</td></tr>
                      <tr><td class="p-2 font-bold">${t('Ausencia', 'Absence')}</td><td class="p-2">${t('Mirada perdida. Breve (Niños).', 'Staring spell. Brief (Kids).')}</td></tr>
                      <tr><td class="p-2 font-bold">${t('Atónica', 'Atonic')}</td><td class="p-2">${t('Caída súbita (Drop attack).', 'Sudden drop.')}</td></tr>
                    </tbody>
                  </table>
                </div>
                <div class="mt-4 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-800">
                   <strong>Status Epilepticus:</strong> ${t('Benzo IV (Lorazepam) primero, luego carga de Fenitoína.', 'IV Benzo (Lorazepam) first, then Phenytoin load.')}
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 6. STROKE ---
    renderStroke() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white font-black text-lg shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">${t('ACV (Stroke)', 'Stroke (CVA)')}</h2>
          </div>

          <div class="space-y-6">
            <div class="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                 <div>
                   <strong class="text-lg text-blue-600 block mb-2">${t('Isquémico (Coágulo)', 'Ischemic (Clot)')}</strong>
                   <ul class="text-sm list-disc list-inside text-gray-700 dark:text-gray-300">
                     <li>${t('<strong>tPA:</strong> Ventana < 4.5 hrs.', '<strong>tPA:</strong> Window < 4.5 hrs.')}</li>
                     <li>${t('CT sin contraste PRIMERO.', 'Non-contrast CT FIRST.')}</li>
                     <li>${t('Contraindicado: Cirugía reciente, sangrado, HTA severa.', 'Contraindicated: Recent surgery, bleed, severe HTN.')}</li>
                   </ul>
                 </div>
                 <div>
                   <strong class="text-lg text-red-600 block mb-2">${t('Hemorrágico (Sangrado)', 'Hemorrhagic (Bleed)')}</strong>
                   <ul class="text-sm list-disc list-inside text-gray-700 dark:text-gray-300">
                     <li>${t('<strong>NO tPA.</strong>', '<strong>NO tPA.</strong>')}</li>
                     <li>${t('Control estricto de BP (<140/90).', 'Strict BP control (<140/90).')}</li>
                     <li>${t('Precauciones de convulsiones.', 'Seizure precautions.')}</li>
                   </ul>
                 </div>
               </div>
            </div>

            <div class="neuro-card border-l-8 border-red-500">
              <h3 class="font-bold text-red-700 dark:text-red-400 text-lg mb-2">
                ${t('Disfagia y Nutrición (PRIORIDAD)', 'Dysphagia & Nutrition (PRIORITY)')}
              </h3>
              <ul class="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                <li><i class="fa-solid fa-user-nurse text-red-500 mr-2"></i> ${t('Evaluación deglución antes de NADA por boca (NPO).', 'Swallow screen before ANY oral intake (NPO).')}</li>
                <li><i class="fa-solid fa-chair text-red-500 mr-2"></i> ${t('Posición: Sentado 90°, mentón al pecho.', 'Position: High Fowler\'s 90°, chin-tuck.')}</li>
                <li><i class="fa-solid fa-ban text-red-500 mr-2"></i> ${t('<strong class="text-red-600 uppercase">NO PAJITAS/POPOTES</strong> (Riesgo aspiración).', '<strong class="text-red-600 uppercase">NO STRAWS</strong> (Aspiration risk).')}</li>
                <li><i class="fa-solid fa-glass-water text-red-500 mr-2"></i> ${t('Líquidos espesados.', 'Thickened liquids.')}</li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 7. SPINAL CORD ---
    renderSpinalCord() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-white font-black text-lg shadow-lg">7</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
               ${t('Lesión Medular (SCI)', 'Spinal Cord Injury (SCI)')}
            </h2>
          </div>

          <div class="bg-pink-50 dark:bg-pink-900/10 p-6 rounded-3xl border-l-8 border-red-600 shadow-lg relative overflow-hidden">
             <h3 class="font-black text-pink-900 dark:text-pink-300 text-xl mb-1">
               ${t('DISREFLEXIA AUTONÓMICA (T6 o superior)', 'AUTONOMIC DYSREFLEXIA (T6 or higher)')}
             </h3>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                   <strong class="block mb-2 text-sm uppercase text-pink-700 dark:text-pink-400">${t('Signos', 'Signs')}</strong>
                   <ul class="text-sm list-disc list-inside text-gray-800 dark:text-gray-200">
                      <li>${t('HTA Severa + Cefalea pulsátil.', 'Severe HTN + Pounding headache.')}</li>
                      <li>${t('Bradicardia.', 'Bradycardia.')}</li>
                      <li>${t('Sudoración/Rubor (arriba de lesión).', 'Sweating/Flushing (above injury).')}</li>
                   </ul>
                </div>
                <div>
                   <strong class="block mb-2 text-sm uppercase text-pink-700 dark:text-pink-400">${t('Intervenciones (Orden)', 'Interventions (Order)')}</strong>
                   <ol class="text-sm font-bold text-gray-900 dark:text-white space-y-2 list-decimal list-inside">
                      <li class="text-red-600 dark:text-red-400 text-base">${t('SENTAR AL PACIENTE (90°) - Prioridad #1.', 'SIT PATIENT UP (90°) - Priority #1.')}</li>
                      <li>${t('Buscar causa (Vejiga llena, fecaloma, ropa).', 'Find cause (Full bladder, impaction, clothes).')}</li>
                      <li>${t('Antihipertensivos si persiste.', 'Antihypertensives if persists.')}</li>
                   </ol>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 8. NEURODEGENERATIVE ---
    renderNeurodegenerative() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-black text-lg shadow-lg">8</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">${t('Neurodegenerativos', 'Neurodegenerative')}</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="neuro-card border-t-4 border-gray-500">
              <strong class="text-gray-700 dark:text-gray-300 block mb-2 text-lg">Parkinson's</strong>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>TRAP:</strong> Tremor, Rigidity, Akinesia, Posture.</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">${t('Tx: Levodopa/Carbidopa. Dieta baja en proteína.', 'Tx: Levodopa/Carbidopa. Low protein diet.')}</p>
            </div>
            <div class="neuro-card border-t-4 border-blue-500">
              <strong class="text-blue-600 dark:text-blue-400 block mb-2 text-lg">MS (Esclerosis Múltiple)</strong>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">${t('Desmielinización. Fatiga, visión.', 'Demyelination. Fatigue, vision.')}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">${t('Tx: Interferón. Evitar calor/estrés.', 'Tx: Interferon. Avoid heat/stress.')}</p>
            </div>
            <div class="neuro-card border-t-4 border-purple-500">
              <strong class="text-purple-600 dark:text-purple-400 block mb-2 text-lg">Alzheimer's</strong>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">${t('Demencia. Seguridad (deambulación).', 'Dementia. Safety (wandering).')}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">${t('Tx: Donepezilo. Validación (no confrontar).', 'Tx: Donepezil. Validation (do not confront).')}</p>
            </div>
          </div>

          <div class="mt-6 bg-cyan-50 dark:bg-cyan-900/10 p-4 rounded-xl border border-cyan-200 dark:border-cyan-800">
            <strong class="text-cyan-700 dark:text-cyan-400 block mb-1">${t('Otros Trastornos:', 'Other Disorders:')}</strong>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs mt-2">
              <div class="bg-white dark:bg-black/20 p-2 rounded"><strong>Miastenia Gravis:</strong> ${t('Debilidad mejora con reposo.', 'Weakness improves w/ rest.')}</div>
              <div class="bg-white dark:bg-black/20 p-2 rounded"><strong>Guillain-Barré:</strong> ${t('Parálisis ascendente. Prioridad respiratoria.', 'Ascending paralysis. Resp priority.')}</div>
              <div class="bg-white dark:bg-black/20 p-2 rounded"><strong>ALS (ELA):</strong> ${t('Degeneración motora pura. Cognición intacta.', 'Motor degeneration. Cognition intact.')}</div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 9. MEDS ---
    renderNeuroMeds() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-lg">9</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">${t('Farmacología', 'Pharmacology')}</h2>
          </div>

          <div class="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-800 text-white uppercase text-xs">
                <tr><th class="p-3">Med</th><th class="p-3">${t('Puntos Clave', 'Key Points')}</th></tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="p-3 font-bold text-emerald-700 dark:text-emerald-400">Phenytoin (Dilantin)</td>
                  <td class="p-3 text-gray-700 dark:text-gray-300">${t('Rango: 10-20. Hiperplasia gingival. <strong>IV SOLO con Salina (NS)</strong>.', 'Range: 10-20. Gingival hyperplasia. <strong>IV ONLY with NS</strong>.')}</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-emerald-700 dark:text-emerald-400">Levetiracetam (Keppra)</td>
                  <td class="p-3 text-gray-700 dark:text-gray-300">${t('Depresión SNC, somnolencia. No conducir.', 'CNS depression, drowsiness. No driving.')}</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-emerald-700 dark:text-emerald-400">Mannitol</td>
                  <td class="p-3 text-gray-700 dark:text-gray-300">${t('Diurético osmótico para PIC. Usar filtro (cristales).', 'Osmotic diuretic for ICP. Use filter (crystals).')}</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-emerald-700 dark:text-emerald-400">Carbamazepine</td>
                  <td class="p-3 text-gray-700 dark:text-gray-300">${t('Agranulocitosis (infección). No jugo toronja.', 'Agranulocytosis (infection). No grapefruit.')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      `;
    },

    // --- 10. PROCEDURES ---
    renderProcedures() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">10</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">${t('Procedimientos', 'Procedures')}</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="neuro-card border-l-8 border-blue-500">
              <h3 class="font-bold text-blue-700 dark:text-blue-400 mb-3">${t('Monitoreo PIC (EVD)', 'ICP Monitoring (EVD)')}</h3>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>${t('Nivelar transductor al <strong>Trago/Oído medio</strong>.', 'Level transducer to <strong>Tragus/Mid-ear</strong>.')}</li>
                <li>${t('Técnica estéril estricta.', 'Strict sterile technique.')}</li>
              </ul>
            </div>
            <div class="neuro-card border-l-8 border-amber-500">
              <h3 class="font-bold text-amber-700 dark:text-amber-400 mb-3">${t('Punción Lumbar (LP)', 'Lumbar Puncture (LP)')}</h3>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>${t('Posición fetal (C-shape). Plano después.', 'Fetal position. Flat after.')}</li>
                <li>${t('Contraindicado si PIC elevada.', 'Contraindicated if High ICP.')}</li>
              </ul>
            </div>
            <div class="neuro-card border-l-8 border-green-500">
               <h3 class="font-bold text-green-700 dark:text-green-400 mb-3">${t('Imagenología (CT vs MRI)', 'Imaging (CT vs MRI)')}</h3>
               <p class="text-sm text-gray-700 dark:text-gray-300">
                 ${t('<strong>CT:</strong> Rápido, sangrado agudo. <br><strong>MRI:</strong> Lento, isquemia temprana, tejidos.', '<strong>CT:</strong> Fast, acute bleed. <br><strong>MRI:</strong> Slow, early ischemia, tissues.')}
               </p>
            </div>
            <div class="neuro-card border-l-8 border-red-500">
               <h3 class="font-bold text-red-700 dark:text-red-400 mb-3">${t('Vía Aérea', 'Airway')}</h3>
               <p class="text-sm text-gray-700 dark:text-gray-300">
                 ${t('Hiperventilación SOLO en herniación inminente.', 'Hyperventilation ONLY in impending herniation.')}
               </p>
            </div>
          </div>
        </section>
      `;
    }
  });
})();