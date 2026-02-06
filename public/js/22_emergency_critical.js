// 22_emergency_critical.js — Emergency & Critical Care Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: Triage, Trauma, Shock, ACLS & Antidotes
// Autor Original: Reynier Diaz Gerones | Refactorización Técnica: Senior Dev
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // Helper interno de traducción para mantener el código DRY
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'emergency',
    title: { es: 'Emergencias y Críticos', en: 'Emergency & Critical Care' },
    subtitle: { es: 'Triage, Trauma, Shock & ACLS', en: 'Triage, Trauma, Shock & ACLS' },
    icon: 'truck-medical',
    color: 'red',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-star-of-life"></i>
                <span class="lang-es">Módulo Maestro 22</span>
                <span class="lang-en hidden-lang">Master Module 22</span>
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                <span class="lang-es">Emergencias y Cuidados Críticos</span>
                <span class="lang-en hidden-lang">Emergency & Critical Care</span>
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                <span class="lang-es">Triage, ABCDE, Shock, Quemaduras y Antídotos.</span>
                <span class="lang-en hidden-lang">Triage, ABCDE, Shock, Burns & Antidotes.</span>
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderDisasterTriage()}
          ${this.renderPrimarySurvey()}
          ${this.renderGlasgowComaScale()}
          ${this.renderICPAndCushing()} 
          ${this.renderShockTypes()}
          ${this.renderTraumaBurns()}
          ${this.renderACLSVisuals()}
          ${this.renderACLSPearls()}
          ${this.renderAntidotes()}
          ${this.renderQuiz()}
        </div>
      `;
    },

    // --- 1. Disaster Triage ---
    renderDisasterTriage() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Triage de Desastres (MCI)</span>
              <span class="lang-en hidden-lang">Disaster Triage (MCI)</span>
            </h2>
          </div>

          <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6 italic border-l-4 border-red-500 pl-4">
              <span class="lang-es">Objetivo Utilitario: "El mayor bien para el mayor número".</span>
              <span class="lang-en hidden-lang">Utilitarian Goal: "The greatest good for the greatest number".</span>
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div class="p-4 rounded-2xl bg-red-500 text-white shadow-lg transform hover:-translate-y-1 transition-transform">
                    <div class="text-3xl font-black mb-1"><i class="fa-solid fa-kit-medical"></i></div>
                    <strong class="block uppercase tracking-wider mb-2">RED (Emergent)</strong>
                    <p class="text-xs opacity-90">
                        <span class="lang-es">Vida en peligro inmediato pero <strong>salvable</strong>. (Neumotórax, Hemorragia activa).</span>
                        <span class="lang-en hidden-lang">Life-threatening but <strong>treatable</strong>. (Pneumothorax, Active bleed).</span>
                    </p>
                </div>
                <div class="p-4 rounded-2xl bg-yellow-500 text-white shadow-lg transform hover:-translate-y-1 transition-transform">
                    <div class="text-3xl font-black mb-1"><i class="fa-solid fa-hourglass-half"></i></div>
                    <strong class="block uppercase tracking-wider mb-2">YELLOW (Urgent)</strong>
                    <p class="text-xs opacity-90">
                        <span class="lang-es">Serio pero estable. Espera 30-60 min. (Fractura abierta sin shock).</span>
                        <span class="lang-en hidden-lang">Serious but stable. Wait 30-60 min. (Open fx w/o shock).</span>
                    </p>
                </div>
                <div class="p-4 rounded-2xl bg-green-500 text-white shadow-lg transform hover:-translate-y-1 transition-transform">
                    <div class="text-3xl font-black mb-1"><i class="fa-solid fa-person-walking"></i></div>
                    <strong class="block uppercase tracking-wider mb-2">GREEN (Minor)</strong>
                    <p class="text-xs opacity-90">
                        <span class="lang-es">"Caminantes". Esperan horas. (Cortes, esguinces).</span>
                        <span class="lang-en hidden-lang">"Walking Wounded". Wait hours. (Cuts, sprains).</span>
                    </p>
                </div>
                <div class="p-4 rounded-2xl bg-slate-900 text-white shadow-lg transform hover:-translate-y-1 transition-transform">
                    <div class="text-3xl font-black mb-1"><i class="fa-solid fa-skull"></i></div>
                    <strong class="block uppercase tracking-wider mb-2">BLACK (Expectant)</strong>
                    <p class="text-xs opacity-90">
                        <span class="lang-es">Muerto o insalvable. (Paro, Quemadura >90%). <strong>NO CPR.</strong></span>
                        <span class="lang-en hidden-lang">Dead or unsalvageable. (Arrest, Burn >90%). <strong>NO CPR.</strong></span>
                    </p>
                </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. Primary Survey (ABCDE) ---
    renderPrimarySurvey() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Evaluación Primaria (ABCDE)</span>
              <span class="lang-en hidden-lang">Primary Survey (ABCDE)</span>
            </h2>
          </div>

          <div class="bg-slate-50 dark:bg-slate-900/30 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div class="divide-y divide-slate-200 dark:divide-slate-700">
                ${this.renderSurveyItem('A', 'Airway + C-Spine', 
                  t('¿Vía permeable? Si trauma: <strong>Jaw-Thrust</strong> (Tracción mandibular). NO inclinar cabeza.', 'Patent airway? If trauma: <strong>Jaw-Thrust</strong>. NO head-tilt.'), 'blue')}
                
                ${this.renderSurveyItem('B', 'Breathing', 
                  t('Auscultar, expansión torácica, O2. ¿Neumotórax a tensión?', 'Auscultate, chest expansion, O2. Tension pneumothorax?'), 'cyan')}
                
                ${this.renderSurveyItem('C', 'Circulation', 
                  t('Pulsos, color, control hemorragia. <strong>CPR si no hay pulso.</strong> 2 vías IV 18G.', 'Pulses, color, hemorrhage control. <strong>CPR if no pulse.</strong> 2 large bore IVs.'), 'red')}
                
                ${this.renderSurveyItem('D', 'Disability', 
                  t('Neurológico: GCS, Pupilas (PERRLA).', 'Neuro: GCS, Pupils (PERRLA).'), 'purple')}
                
                ${this.renderSurveyItem('E', 'Exposure', 
                  t('Cortar ropa, buscar lesiones. <strong>Prevenir hipotermia</strong> (mantas).', 'Cut clothes, find injuries. <strong>Prevent hypothermia</strong> (warm blankets).'), 'orange')}
            </div>
          </div>
        </section>
      `;
    },

    // Helper para ABCDE
    renderSurveyItem(letter, title, desc, color) {
      const colorClass = {
        blue: 'text-blue-600 bg-blue-100',
        cyan: 'text-cyan-600 bg-cyan-100',
        red: 'text-red-600 bg-red-100',
        purple: 'text-purple-600 bg-purple-100',
        orange: 'text-orange-600 bg-orange-100'
      }[color];

      return `
        <div class="p-5 flex gap-5 items-start hover:bg-white dark:hover:bg-slate-800/50 transition-colors">
            <div class="w-12 h-12 rounded-full ${colorClass} flex items-center justify-center font-black text-xl shrink-0 shadow-sm">${letter}</div>
            <div>
                <h3 class="font-bold text-gray-900 dark:text-white text-lg">${title}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${desc}</p>
            </div>
        </div>
      `;
    },

    // --- 3. Glasgow Coma Scale ---
    renderGlasgowComaScale() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">Glasgow Coma Scale (GCS)</h2>
          </div>

          <div class="bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border p-6 shadow-md">
             <div class="flex justify-between items-center mb-6">
                <span class="text-sm font-bold text-gray-500 uppercase tracking-widest">Neuro Assessment</span>
                <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-200 animate-pulse">
                   ${t('GCS ≤ 8 = INTUBAR', 'GCS ≤ 8 = INTUBATE')}
                </span>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div class="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800">
                   <strong class="block text-indigo-700 dark:text-indigo-300 mb-2 border-b border-indigo-200 pb-1">
                     ${t('Apertura Ocular (4)', 'Eye Opening (4)')}
                   </strong>
                   <ul class="space-y-1 text-gray-700 dark:text-gray-300">
                     <li class="flex justify-between"><span>Espontánea</span> <strong>4</strong></li>
                     <li class="flex justify-between"><span>Al sonido</span> <strong>3</strong></li>
                     <li class="flex justify-between"><span>Al dolor</span> <strong>2</strong></li>
                     <li class="flex justify-between"><span>Ninguna</span> <strong>1</strong></li>
                   </ul>
                </div>
                <div class="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800">
                   <strong class="block text-indigo-700 dark:text-indigo-300 mb-2 border-b border-indigo-200 pb-1">
                     ${t('Verbal (5)', 'Verbal (5)')}
                   </strong>
                   <ul class="space-y-1 text-gray-700 dark:text-gray-300">
                     <li class="flex justify-between"><span>Orientado</span> <strong>5</strong></li>
                     <li class="flex justify-between"><span>Confuso</span> <strong>4</strong></li>
                     <li class="flex justify-between"><span>Palabras inapr.</span> <strong>3</strong></li>
                     <li class="flex justify-between"><span>Sonidos</span> <strong>2</strong></li>
                     <li class="flex justify-between"><span>Ninguna</span> <strong>1</strong></li>
                   </ul>
                </div>
                <div class="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800">
                   <strong class="block text-indigo-700 dark:text-indigo-300 mb-2 border-b border-indigo-200 pb-1">
                     ${t('Motor (6)', 'Motor (6)')}
                   </strong>
                   <ul class="space-y-1 text-gray-700 dark:text-gray-300">
                     <li class="flex justify-between"><span>Obedece</span> <strong>6</strong></li>
                     <li class="flex justify-between"><span>Localiza dolor</span> <strong>5</strong></li>
                     <li class="flex justify-between"><span>Retira</span> <strong>4</strong></li>
                     <li class="flex justify-between text-red-600"><span>Decorticación (Flex)</span> <strong>3</strong></li>
                     <li class="flex justify-between text-red-600"><span>Descerebración (Ext)</span> <strong>2</strong></li>
                     <li class="flex justify-between"><span>Ninguna</span> <strong>1</strong></li>
                   </ul>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 4. ICP & Cushing's Triad (Added from V7.2) ---
    renderICPAndCushing() {
        return `
        <section class="mt-8">
            <div class="p-5 bg-indigo-50 dark:bg-slate-800/50 rounded-2xl border border-indigo-200 dark:border-indigo-900 shadow-sm">
                <h3 class="font-bold text-lg mb-3 text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
                   <i class="fa-solid fa-brain"></i>
                   <span class="lang-es">PIC Elevada y Tríada de Cushing</span>
                   <span class="lang-en hidden-lang">High ICP & Cushing's Triad</span>
                </h3>
                <div class="grid md:grid-cols-2 gap-6 text-sm">
                    <div class="bg-white dark:bg-black/20 p-4 rounded-xl">
                        <strong class="text-red-600 block mb-2 border-b border-red-100 dark:border-red-900/30 pb-1">Cushing's Triad (Signo Tardío):</strong>
                        <ul class="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                            <li><strong>HTN Sistólica:</strong> Presión de pulso ensanchada (Widening pulse pressure).</li>
                            <li><strong>Bradicardia:</strong> Pulso lento y lleno.</li>
                            <li><strong>Resp. Irregular:</strong> Cheyne-Stokes.</li>
                        </ul>
                    </div>
                    <div>
                        <strong class="text-green-600 block mb-2">Nursing Interventions:</strong>
                        <ul class="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                            <li>Posición: <strong>30-45° (Semi-Fowler)</strong>.</li>
                            <li>Cabeza: <strong>Midline</strong> (Alineada, NO flexión).</li>
                            <li>Ambiente: <strong>Quiet/Dim</strong> (Bajo estímulo).</li>
                            <li>Evitar: Tos, esfuerzo (Valsalva), succión >10 seg.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        `;
    },

    // --- 5. Shock Types & Stages ---
    renderShockTypes() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Tipos de Shock</span>
              <span class="lang-en hidden-lang">Types of Shock</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border-l-4 border-blue-500 shadow-sm">
                <strong class="text-lg text-blue-700 dark:text-blue-400 block mb-1">Hipovolémico</strong>
                <p class="text-xs text-gray-500 mb-2">${t('Pérdida sangre/fluidos.', 'Blood/fluid loss.')}</p>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                   <li>• <strong>S/S:</strong> Taquicardia, Hipotensión, Piel fría/húmeda.</li>
                   <li>• <strong>Tx:</strong> 2 Vías gruesas, Fluidos Isotónicos, Sangre.</li>
                   <li>• <strong>Posición:</strong> Pies arriba (Trendelenburg modificado).</li>
                </ul>
             </div>

             <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border-l-4 border-red-500 shadow-sm">
                <strong class="text-lg text-red-700 dark:text-red-400 block mb-1">Cardiogénico</strong>
                <p class="text-xs text-gray-500 mb-2">${t('Falla de bomba (MI).', 'Pump failure (MI).')}</p>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                   <li>• <strong>S/S:</strong> Taquicardia, Hipotensión, Edema pulmonar (Crepitantes).</li>
                   <li>• <strong>Tx:</strong> <span class="text-red-600 font-bold">NO BOLOS.</span> Inotrópicos (Dobutamina).</li>
                </ul>
             </div>

             <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border-l-4 border-purple-500 shadow-sm">
                <strong class="text-lg text-purple-700 dark:text-purple-400 block mb-1">Séptico</strong>
                <p class="text-xs text-gray-500 mb-2">${t('Infección sistémica.', 'Systemic infection.')}</p>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                   <li>• <strong>S/S:</strong> Fiebre, Lactato > 2, Hipotensión persistente.</li>
                   <li>• <strong>Tx:</strong> Cultivos PAN -> Antibióticos IV -> Vasopresores.</li>
                </ul>
             </div>

             <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border-l-4 border-yellow-500 shadow-sm">
                <strong class="text-lg text-yellow-700 dark:text-yellow-400 block mb-1">Neurogénico</strong>
                <p class="text-xs text-gray-500 mb-2">${t('Lesión medular (T6+).', 'Spinal cord injury (T6+).')}</p>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                   <li>• <strong>S/S:</strong> <span class="text-red-600 font-bold">Bradicardia</span>, Hipotensión, Piel caliente.</li>
                   <li>• <strong>Tx:</strong> Atropina (FC), Vasopresores, Fluidos.</li>
                </ul>
             </div>
          </div>
          
          <div class="mt-4 p-4 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-200 dark:border-pink-800">
             <strong class="text-pink-700 dark:text-pink-400 block mb-2 text-lg">Anafiláctico</strong>
             <div class="flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-700 dark:text-gray-300">
                <div>
                   <strong>Signos:</strong> Estridor, Sibilancias, Angioedema, Urticaria.
                </div>
                <div>
                   <strong>Acción #1:</strong> <span class="text-red-600 font-black text-lg">IM EPINEFRINA</span>
                </div>
             </div>
          </div>

          <div class="mt-6 p-5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm border border-slate-200 dark:border-slate-700">
                <strong class="block mb-3 text-slate-900 dark:text-white text-base">
                    <span class="lang-es">Fases Clave del Shock:</span>
                    <span class="lang-en hidden-lang">Key Stages of Shock:</span>
                </strong>
                <ul class="space-y-3 text-slate-600 dark:text-slate-400">
                    <li class="pl-3 border-l-2 border-orange-500"><span class="font-bold text-orange-600 dark:text-orange-400">Compensatory:</span> FC ↑, TA normal (vasoconstricción), Piel fría, Oliguria. <em class="text-xs block">¡Detectarlo aquí para salvar la vida!</em></li>
                    <li class="pl-3 border-l-2 border-red-500"><span class="font-bold text-red-600 dark:text-red-400">Progressive:</span> TA ↓ (Hipotensión), Estado mental alterado, Acidosis metabólica, Edema.</li>
                    <li class="pl-3 border-l-2 border-slate-500"><span class="font-bold text-slate-600 dark:text-slate-300">Refractory:</span> Daño orgánico irreversible (MODS), Muerte inminente.</li>
                </ul>
          </div>
        </section>
      `;
    },

    // --- 6. Trauma & Burns ---
    renderTraumaBurns() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              <span class="lang-es">Trauma y Quemaduras</span>
              <span class="lang-en hidden-lang">Trauma & Burns</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div class="p-6 bg-orange-50 dark:bg-orange-900/10 rounded-3xl border border-orange-200 dark:border-orange-800">
                <h3 class="font-bold text-orange-800 dark:text-orange-300 mb-3 text-lg">Parkland Formula (Burns)</h3>
                
                <div class="mb-4 text-xs text-slate-600 dark:text-slate-400">
                    <strong>Rule of Nines:</strong> Head 9%, Arms 9% ea, Legs 18% ea, Torso 36%, Perineum 1%.
                </div>

                <div class="bg-white dark:bg-black/20 p-4 rounded-xl text-center mb-4">
                   <span class="text-2xl font-black text-orange-600 font-mono">4 mL x kg x %TBSA</span>
                   <p class="text-xs text-gray-500 mt-1">Lactato Ringer (LR)</p>
                </div>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                   <li><strong>1ras 8 horas:</strong> 50% del volumen total.</li>
                   <li><strong>Siguientes 16 horas:</strong> 50% restante.</li>
                   <li class="text-xs text-red-500 italic font-bold">
                      ${t('*El tiempo cuenta desde la QUEMADURA, no la llegada.*', '*Time starts from INJURY, not arrival.*')}
                   </li>
                </ul>
             </div>

             <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-md">
                <h3 class="font-bold text-gray-900 dark:text-white mb-3 text-lg">Intervenciones Traumáticas</h3>
                <div class="space-y-4 text-sm">
                   <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <strong class="text-blue-600 block">Tubo Torácico Desplazado:</strong>
                      <span class="text-gray-600 dark:text-gray-400">Salida de tórax: Cubrir con gasa estéril (Vaselinada) + Cinta en <strong class="text-red-500">3 lados</strong>.</span>
                   </div>
                   <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <strong class="text-blue-600 block">Tubo Torácico Desconectado:</strong>
                      <span class="text-gray-600 dark:text-gray-400">Desconexión del sistema: Sumergir extremo en <strong class="text-blue-500">Agua Estéril</strong> (Water Seal).</span>
                   </div>
                   <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <strong class="text-blue-600 block">Embolia Grasa (Fémur):</strong>
                      <span class="text-gray-600 dark:text-gray-400">Signo: <strong class="text-red-500">Petequias en pecho</strong> + Confusión. Acción: O2 + Inmovilizar.</span>
                   </div>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 7. ACLS Visuals (From V4 - Excellent for teaching) ---
    renderACLSVisuals() {
        return `
        <section class="mt-8">
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">ACLS: ¿Desfibrilar o No?</h3>
            <div class="flex flex-col md:flex-row gap-4 items-stretch">
               <div class="flex-1 bg-green-50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-200 dark:border-green-800">
                  <div class="flex items-center gap-3 mb-3">
                     <div class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg"><i class="fa-solid fa-bolt"></i></div>
                     <strong class="text-green-800 dark:text-green-300 text-lg">SHOCKABLE</strong>
                  </div>
                  <ul class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 space-y-1">
                     <li>• V-Fib (Ventricular Fibrillation)</li>
                     <li>• Pulseless V-Tach</li>
                  </ul>
                  <div class="bg-white dark:bg-black/20 p-3 rounded-xl text-center">
                     <span class="text-xs uppercase text-gray-500 font-bold block mb-1">Action</span>
                     <strong class="text-green-600 dark:text-green-400">DEFIBRILLATE + CPR</strong>
                  </div>
               </div>

               <div class="flex-1 bg-gray-100 dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-3 mb-3">
                     <div class="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center text-lg"><i class="fa-solid fa-ban"></i></div>
                     <strong class="text-gray-800 dark:text-gray-300 text-lg">NON-SHOCKABLE</strong>
                  </div>
                  <ul class="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 space-y-1">
                     <li>• Asystole (Flatline)</li>
                     <li>• PEA (Pulseless Electrical Activity)</li>
                  </ul>
                  <div class="bg-white dark:bg-black/20 p-3 rounded-xl text-center">
                     <span class="text-xs uppercase text-gray-500 font-bold block mb-1">Action</span>
                     <strong class="text-gray-700 dark:text-gray-300">CPR + Epinephrine ONLY</strong>
                  </div>
               </div>
            </div>
        </section>
        `;
    },

    // --- 8. ACLS Pearls ---
    renderACLSPearls() {
      return `
        <section class="mt-8">
           <div class="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-slate-700">
              <h3 class="font-bold text-xl mb-4 flex items-center gap-2 text-yellow-400">
                 <i class="fa-solid fa-heart-pulse"></i> Perlas Clínicas ACLS
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                 <div class="p-3 bg-white/10 rounded-xl">
                    <strong class="block text-green-400 mb-1">Adenosina (SVT)</strong>
                    <span class="text-gray-300">IV Push RÁPIDO (1-2s) + Flush. Causa asistolia breve (normal).</span>
                 </div>
                 <div class="p-3 bg-white/10 rounded-xl">
                    <strong class="block text-red-400 mb-1">Asistolia</strong>
                    <span class="text-gray-300 font-bold">¡NO DESFIBRILAR!</span> <span class="text-gray-400">Solo CPR + Epinefrina.</span>
                 </div>
                 <div class="p-3 bg-white/10 rounded-xl">
                    <strong class="block text-blue-400 mb-1">Amiodarona</strong>
                    <span class="text-gray-300">Para V-Fib/V-Tach refractaria.</span>
                 </div>
                 <div class="p-3 bg-white/10 rounded-xl">
                    <strong class="block text-yellow-400 mb-1">Atropina</strong>
                    <span class="text-gray-300">Para Bradicardia Sintomática. (0.5 - 1 mg).</span>
                 </div>
                 <div class="p-3 bg-white/10 rounded-xl md:col-span-2">
                    <strong class="block text-purple-400 mb-1">MONA (Infarto)</strong>
                    <span class="text-gray-300">Morfina, O2, Nitroglicerina, Aspirina. <em class="text-xs text-gray-400">(Orden real: O2 -> Aspirina -> Nitro -> Morfina).</em></span>
                 </div>
              </div>
           </div>
        </section>
      `;
    },

    // --- 9. Antidotes (Added from V7.2) ---
    renderAntidotes() {
        return `
        <section class="mt-8">
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-flask"></i> Antídotos Esenciales
            </h3>
            <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <table class="w-full text-sm text-left bg-white dark:bg-brand-card">
                    <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                        <tr>
                            <th class="p-3">Tóxico / Droga</th>
                            <th class="p-3">Antídoto</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                            <td class="p-3 font-medium">Opioids (Heroin, Morphine)</td>
                            <td class="p-3 text-red-600 font-bold">Naloxone (Narcan)</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-medium">Benzodiazepines</td>
                            <td class="p-3 text-blue-600 font-bold">Flumazenil</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-medium">Warfarin (Coumadin)</td>
                            <td class="p-3 text-green-600 font-bold">Vitamin K</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-medium">Heparin</td>
                            <td class="p-3 text-purple-600 font-bold">Protamine Sulfate</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-medium">Acetaminophen (Tylenol)</td>
                            <td class="p-3 text-orange-600 font-bold">Acetylcysteine</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        `;
    },

    // --- 10. Quiz (Added from V4) ---
    renderQuiz() {
      return `
        <div class="mt-12 bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <i class="fa-solid fa-clipboard-question text-red-500"></i> 
                <span class="lang-es">Repaso Rápido</span><span class="lang-en hidden-lang">Quick Review</span>
            </h3>
            <div class="space-y-4 text-sm">
                <details class="group bg-white dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-gray-700 open:bg-gray-50 dark:open:bg-white/5 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center text-gray-800 dark:text-gray-200">
                        <span class="lang-es">1. Paciente con quemaduras en cara y voz ronca. ¿Prioridad?</span>
                        <span class="lang-en hidden-lang">1. Patient with face burns and hoarse voice. Priority?</span>
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-600 dark:text-gray-300 pl-4 border-l-2 border-red-500">
                        <span class="lang-es"><strong>Intubación Inmediata.</strong> Signos de lesión por inhalación. La vía aérea se cerrará por edema.</span>
                        <span class="lang-en hidden-lang"><strong>Immediate Intubation.</strong> Signs of inhalation injury. Airway will swell shut.</span>
                    </div>
                </details>
                
                <details class="group bg-white dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-gray-700 open:bg-gray-50 dark:open:bg-white/5 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center text-gray-800 dark:text-gray-200">
                        <span class="lang-es">2. V-Fib en el monitor. Sin pulso. ¿Acción?</span>
                        <span class="lang-en hidden-lang">2. V-Fib on monitor. No pulse. Action?</span>
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-600 dark:text-gray-300 pl-4 border-l-2 border-red-500">
                        <span class="lang-es"><strong>DESFIBRILAR.</strong> Es el tratamiento definitivo. Si no está listo, CPR.</span>
                        <span class="lang-en hidden-lang"><strong>DEFIBRILLATE.</strong> Definitive treatment. If not ready, CPR.</span>
                    </div>
                </details>

                <details class="group bg-white dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-gray-700 open:bg-gray-50 dark:open:bg-white/5 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center text-gray-800 dark:text-gray-200">
                        <span class="lang-es">3. Lesión espinal T4, hipotensión y BRADICARDIA. ¿Tipo de Shock?</span>
                        <span class="lang-en hidden-lang">3. T4 Spinal injury, hypotension and BRADYCARDIA. Shock type?</span>
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-600 dark:text-gray-300 pl-4 border-l-2 border-red-500">
                        <span class="lang-es"><strong>Neurogénico.</strong> Es el único shock con bradicardia (pérdida de tono simpático).</span>
                        <span class="lang-en hidden-lang"><strong>Neurogenic.</strong> The only shock with bradycardia (loss of sympathetic tone).</span>
                    </div>
                </details>
            </div>
        </div>
      `;
    }
  });
})();