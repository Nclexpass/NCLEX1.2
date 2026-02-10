// 27_critical_thinking_ngn_master.js
// VERSIÓN MAESTRA DEFINITIVA: Fusión de Arquitectura v8 con Contenido Académico Completo v7.2
// Combina NCJMM, Marcos de Priorización, Matriz de Delegación y Estrategias SATA.
// CREADO POR REYNIER DIAZ GERONES
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // Guard Clause: Ensure Core Logic is loaded to prevent crash
  if (!window.NCLEX) {
      console.error("NCLEX Core not found. Module 27_critical_thinking_ngn skipped.");
      return;
  }

  // Helper interno para traducciones limpias
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'critical-thinking-master',
    title: { es: 'Pensamiento Crítico y NGN', en: 'Critical Thinking & NGN' },
    subtitle: { es: 'Estrategias, Priorización y Delegación', en: 'Strategies, Prioritization & Delegation' },
    icon: 'chess',
    color: 'slate',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-chess"></i>
                <span class="lang-es">Módulo Maestro 27</span>
                <span class="lang-en hidden-lang">Master Module 27</span>
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                <span class="lang-es">Juicio Clínico y Lógica NGN</span>
                <span class="lang-en hidden-lang">Clinical Judgment & NGN Logic</span>
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('No es solo qué sabes, es cómo usas lo que sabes. Domina la lógica del examen.', 'It\'s not just what you know, it\'s how you use what you know. Master the exam logic.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderNCJMM()}
          ${this.renderPrioritization()}
          ${this.renderRNHierarchy()}
          ${this.renderDelegation()}
          ${this.renderSATA()}
          ${this.renderPitfalls()}
        </div>
      `;
    },

    // --- 1. NCJMM (NGN Model) ---
    renderNCJMM() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Modelo de Juicio Clínico (NCJMM)', 'Clinical Judgment Model (NCJMM)')}
            </h2>
          </div>

          <div class="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-3xl border border-purple-200 dark:border-purple-800 shadow-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center italic">
              ${t('Cada Case Study sigue estrictamente este flujo mental de 6 pasos.', 'Every Case Study strictly follows this 6-step mental flow.')}
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               ${this.renderStep(1, 'Recognize Cues', 'Reconocer Pistas', 'Identify relevant/abnormal data. What matters?', 'Identificar datos anormales (Labs, Signos). ¿Qué importa?')}
               ${this.renderStep(2, 'Analyze Cues', 'Analizar Pistas', 'Connect the dots (e.g., Fever + Stiff neck = Meningitis?).', 'Conectar los puntos (Ej: Fiebre + Rigidez = ¿Meningitis?).')}
               ${this.renderStep(3, 'Prioritize Hypotheses', 'Priorizar Hipótesis', 'Rank urgency. What kills the patient first?', 'Jerarquizar. ¿Qué mata al paciente primero? (ABC, Maslow).')}
               ${this.renderStep(4, 'Generate Solutions', 'Generar Soluciones', 'Select interventions (Pharm vs Non-pharm).', 'Identificar intervenciones (Farmacológicas vs No farmacológicas).')}
               ${this.renderStep(5, 'Take Action', 'Actuar', 'Implement the priority solution.', 'Implementar la solución prioritaria.')}
               ${this.renderStep(6, 'Evaluate Outcomes', 'Evaluar', 'Did it work? Re-assess vitals or labs.', '¿Funcionó? Re-evaluar signos o laboratorios.')}
            </div>
          </div>
        </section>
      `;
    },

    renderStep(num, titleEn, titleEs, descEn, descEs) {
        return `
            <div class="bg-white dark:bg-brand-card p-4 rounded-xl border-l-4 border-purple-500 shadow-sm hover:translate-y-[-2px] transition-transform">
                <div class="flex items-center gap-2 mb-2">
                    <span class="bg-purple-100 text-purple-700 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">${num}</span>
                    <strong class="text-purple-800 dark:text-purple-300 text-sm">
                        ${t(titleEs, titleEn)}
                    </strong>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 leading-snug">
                    ${t(descEs, descEn)}
                </p>
            </div>
        `;
    },

    // --- 2. Prioritization Frameworks (Merged v7.2 and v8) ---
    renderPrioritization() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Estrategias de Priorización', 'Prioritization Strategies')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white dark:bg-brand-card p-5 rounded-2xl border-t-8 border-blue-500 shadow-lg">
               <strong class="text-blue-700 dark:text-blue-400 block mb-3 text-lg">1. ABC vs CAB</strong>
               <ul class="text-sm space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
                 <li><strong>${t('Regla General', 'General Rule')}:</strong> Airway > Breathing > Circulation.</li>
                 <li><strong>${t('Excepción (CPR)', 'Exception (CPR)')}:</strong> ${t('Si NO hay pulso/respiración (Paro) -> <strong>C-A-B</strong>.', 'If NO pulse/breathing (Arrest) -> <strong>C-A-B</strong>.')}</li>
                 <li><strong>${t('Trauma', 'Trauma')}:</strong> ${t('Hemorragia masiva exanguinante tiene prioridad sobre Airway.', 'Massive exsanguinating hemorrhage takes priority over Airway.')}</li>
               </ul>
            </div>

            <div class="bg-white dark:bg-brand-card p-5 rounded-2xl border-t-8 border-green-500 shadow-lg">
               <strong class="text-green-700 dark:text-green-400 block mb-3 text-lg">2. Maslow & ${t('Seguridad', 'Safety')}</strong>
               <ul class="text-sm space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
                 <li>${t('<strong>Fisiológico</strong> (Oxígeno, líquidos) > <strong>Psicológico</strong> (Ansiedad).', '<strong>Physiological</strong> (Oxygen, fluids) > <strong>Psychological</strong> (Anxiety).')}</li>
                 <li>${t('<strong>Riesgo Inminente</strong> (Confuso quitándose IV) > <strong>Problema Estable</strong> (Dolor crónico).', '<strong>Imminent Risk</strong> (Confused pulling IV) > <strong>Stable Problem</strong> (Chronic pain).')}</li>
               </ul>
            </div>
          </div>

          <div class="bg-slate-50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
             <h3 class="font-bold text-slate-800 dark:text-slate-300 mb-4">${t('Reglas de Desempate (Tie-Breakers)', 'Tie-Breakers')}</h3>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white dark:bg-brand-card p-4 rounded-lg shadow-sm">
                    <strong class="text-red-600 dark:text-red-400 block mb-1">Agudo vs Crónico</strong>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                        ${t('Inestable (Nuevo síntoma, cambio súbito) SIEMPRE gana a Estable (Historia de, diagnóstico antiguo).', 'Unstable (New symptom, sudden change) ALWAYS beats Stable (History of, old dx).')}
                    </p>
                </div>
                <div class="bg-white dark:bg-brand-card p-4 rounded-lg shadow-sm">
                    <strong class="text-red-600 dark:text-red-400 block mb-1">Sistémico vs Local</strong>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                        ${t('Vida antes que extremidad. Shock (hipotensión) > Fractura aislada.', 'Life over limb. Shock (hypotension) > Isolated fracture.')}
                    </p>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 3. RN Hierarchy (From v7.2 - Essential for avoiding "Passing the buck") ---
    renderRNHierarchy() {
        return `
        <section class="mt-8">
            <div class="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-xl border border-amber-200 dark:border-amber-800">
                <h3 class="font-bold text-lg mb-4 text-amber-800 dark:text-amber-300">
                    ${t('Jerarquía de Acciones del RN', 'RN Hierarchy of Actions')}
                </h3>
                <div class="relative border-l-2 border-amber-300 dark:border-amber-700 ml-3 space-y-5">
                    <div class="ml-6 relative">
                        <span class="absolute -left-[22px] bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-slate-900">1</span>
                        <p class="text-sm">
                            <strong>${t('Evaluar/Assess', 'Assess')}</strong>: 
                            ${t('Siempre el primer paso ante datos anormales. NO llamar al MD sin evaluar primero (a menos que sea paro).', 'Always first step with abnormal data. Do NOT call MD without assessing first (unless arrest).')}
                        </p>
                    </div>
                    <div class="ml-6 relative">
                        <span class="absolute -left-[22px] bg-orange-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-slate-900">2</span>
                        <p class="text-sm">
                            <strong>${t('Intervenir/Intervene', 'Intervene')}</strong>: 
                            ${t('Acciones de enfermería independientes (Posición, O2 si hay protocolo, Seguridad).', 'Independent nursing actions (Positioning, O2 if protocol, Safety).')}
                        </p>
                    </div>
                    <div class="ml-6 relative">
                        <span class="absolute -left-[22px] bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-slate-900">3</span>
                        <p class="text-sm">
                            <strong>${t('Notificar/Notify', 'Notify')}</strong>: 
                            ${t('Contactar proveedor con datos concretos (SBAR). No es lo primero si puedes hacer algo tú.', 'Contact provider with concrete data (SBAR). Not first if you can do something.')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
        `;
    },

    // --- 4. Delegation (Restored from v7.2) ---
    renderDelegation() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Delegación y Asignación', 'Delegation & Assignment')}
            </h2>
          </div>

          <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <table class="w-full text-sm text-left border-collapse bg-white dark:bg-slate-800">
                <thead>
                    <tr class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                        <th class="p-3 w-1/3 border-b border-r dark:border-slate-600">RN (Registered Nurse)</th>
                        <th class="p-3 w-1/3 border-b border-r dark:border-slate-600">LPN / LVN</th>
                        <th class="p-3 w-1/3 border-b dark:border-slate-600">UAP (CNA / Tech)</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-slate-600">
                    <tr>
                        <td class="p-4 align-top border-r dark:border-slate-600 bg-purple-50/50 dark:bg-purple-900/10">
                            <strong class="text-purple-700 dark:text-purple-300 block mb-2">${t('Regla "EAT"', '"EAT" Rule')}</strong>
                            <ul class="space-y-1 list-disc list-inside text-xs text-gray-700 dark:text-gray-300">
                                <li><strong>E</strong>valuate ${t('(Evaluar resultados)', '(Results)')}</li>
                                <li><strong>A</strong>ssess ${t('(Valoración inicial)', '(Initial)')}</li>
                                <li><strong>T</strong>each ${t('(Educación compleja)', '(Complex)')}</li>
                                <li>${t('Pacientes Inestables', 'Unstable Patients')}</li>
                                <li>${t('Sangre, IV Push', 'Blood, IV Push')}</li>
                            </ul>
                        </td>
                        <td class="p-4 align-top border-r dark:border-slate-600">
                            <strong class="text-gray-800 dark:text-white block mb-2">${t('Pacientes Estables', 'Stable Patients')}</strong>
                            <ul class="space-y-1 list-disc list-inside text-xs text-gray-600 dark:text-gray-400">
                                <li>${t('Meds Oral/IM/SubQ', 'Oral/IM/SubQ Meds')}</li>
                                <li>${t('Heridas simples', 'Simple wounds')}</li>
                                <li>${t('Re-evaluar (escuchar después de RN)', 'Re-assess (after RN)')}</li>
                                <li>${t('Sondas, Enemas', 'Tubes, Enemas')}</li>
                                <li class="font-bold text-red-500">${t('NO: Eval. Inicial / IV Push', 'NO: Initial Assess / IV Push')}</li>
                            </ul>
                        </td>
                        <td class="p-4 align-top">
                            <strong class="text-gray-800 dark:text-white block mb-2">${t('Rutina / Estandarizado', 'Routine / Standardized')}</strong>
                            <ul class="space-y-1 list-disc list-inside text-xs text-gray-600 dark:text-gray-400">
                                <li>${t('ADLs (Baño, Comida)', 'ADLs (Bath, Feed)')}</li>
                                <li>${t('Signos Vitales (Estables)', 'Vital Signs (Stable)')}</li>
                                <li>${t('Input/Output', 'I/O')}</li>
                                <li>${t('Posicionamiento', 'Positioning')}</li>
                                <li class="font-bold text-red-500">${t('NO: Interpretar datos', 'NO: Interpret data')}</li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
          
          <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border-l-4 border-red-500">
            <h4 class="text-xs font-bold text-red-700 dark:text-red-400 uppercase mb-1">
                ${t('Error Crítico: Asignación', 'Critical Error: Assignment')}
            </h4>
            <p class="text-sm text-gray-700 dark:text-gray-300">
                ${t('Nunca delegues lo que puedes COMER (EAT). El RN es responsable legalmente del resultado de la tarea delegada.', 'Never delegate what you can EAT. The RN is legally liable for the outcome of the delegated task.')}
            </p>
          </div>
        </section>
      `;
    },

    // --- 5. SATA Strategy (Restored from v7.2) ---
    renderSATA() {
        return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Cómo Vencer las "Select All That Apply"', 'How to Beat "Select All That Apply"')}
            </h2>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-teal-50 dark:bg-teal-900/10 p-5 rounded-2xl border border-teal-200 dark:border-teal-800">
                <strong class="text-teal-800 dark:text-teal-300 block mb-2 text-lg">
                    ${t('Técnica Verdadero/Falso', 'True/False Technique')}
                </strong>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    ${t('No mires las opciones en grupo. Evalúa cada una <strong>INDIVIDUALMENTE</strong>.', 'Don\'t view options as a group. Evaluate each <strong>INDIVIDUALLY</strong>.')}
                </p>
                <ol class="list-decimal list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
                    <li>${t('Cubre las opciones con tu mano.', 'Cover options with your hand.')}</li>
                    <li>${t('Lee la opción A: "¿Es esto VERDADERO para el caso?"', 'Read option A: "Is this TRUE for the case?"')}</li>
                    <li>${t('Si sí, selecciónala. Olvídala. Pasa a la B.', 'If yes, select. Forget it. Move to B.')}</li>
                    <li>${t('<strong>Nunca compares</strong> ("La A y la B se parecen...").', '<strong>Never compare</strong> ("A and B look alike...").')}</li>
                </ol>
            </div>

            <div class="bg-teal-50 dark:bg-teal-900/10 p-5 rounded-2xl border border-teal-200 dark:border-teal-800">
                <strong class="text-teal-800 dark:text-teal-300 block mb-2 text-lg">
                    ${t('Red Flags (Trampas)', 'Red Flags')}
                </strong>
                <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li><i class="fa-solid fa-xmark text-red-500 mr-2"></i> ${t('<strong>Absolutos:</strong> "Always", "Never", "All", "None" suelen ser falsos.', '<strong>Absolutes:</strong> "Always", "Never", "All", "None" are usually false.')}</li>
                    <li><i class="fa-solid fa-xmark text-red-500 mr-2"></i> ${t('<strong>"Why?":</strong> Nunca preguntar por qué (No terapéutico).', '<strong>"Why?":</strong> Never ask why (Non-therapeutic).')}</li>
                    <li><i class="fa-solid fa-xmark text-red-500 mr-2"></i> ${t('<strong>Pasar la papa:</strong> "Llamar al médico" no es la respuesta si no has evaluado.', '<strong>Buck passing:</strong> "Call MD" is not the answer if you haven\'t assessed.')}</li>
                </ul>
            </div>
          </div>
        </section>
        `;
    },

    // --- 6. Pitfalls (Merged) ---
    renderPitfalls() {
      return `
        <section class="mt-8 mb-12">
           <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                ${t('Errores Comunes de Pensamiento', 'Common Critical Thinking Errors')}
              </h3>
              
              <div class="grid md:grid-cols-2 gap-4 text-sm">
                 <div class="flex gap-3">
                    <div class="bg-rose-100 text-rose-600 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                    <div>
                       <strong class="block text-gray-900 dark:text-white">${t('Leer de Más ("Overthinking")', 'Overthinking (What If)')}</strong>
                       <span class="text-gray-600 dark:text-gray-400">${t('No inventes escenarios ("¿Y si el paciente tiene alergia rara?"). Responde solo con lo que ves.', 'Don\'t invent scenarios ("What if rare allergy?"). Answer only with what you see.')}</span>
                    </div>
                 </div>
                 <div class="flex gap-3">
                    <div class="bg-rose-100 text-rose-600 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                    <div>
                       <strong class="block text-gray-900 dark:text-white">${t('Cambiar la Respuesta', 'Changing the Answer')}</strong>
                       <span class="text-gray-600 dark:text-gray-400">${t('Tu primer instinto suele ser correcto (>50%). Solo cambia si leíste mal la pregunta.', 'First instinct is usually right (>50%). Only change if you misread the question.')}</span>
                    </div>
                 </div>
                 <div class="flex gap-3">
                    <div class="bg-rose-100 text-rose-600 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                    <div>
                       <strong class="block text-gray-900 dark:text-white">${t('Sesgo de Experiencia', 'Experience Bias')}</strong>
                       <span class="text-gray-600 dark:text-gray-400">${t('No respondas "como lo hacemos en mi hospital". Responde según el libro (Mundo perfecto NCLEX).', 'Don\'t answer "how we do it at my hospital". Answer by the book (NCLEX Perfect World).')}</span>
                    </div>
                 </div>
                 <div class="flex gap-3">
                    <div class="bg-rose-100 text-rose-600 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">4</div>
                    <div>
                       <strong class="block text-gray-900 dark:text-white">${t('Seguridad Física vs Psico', 'Physical vs Psychosocial')}</strong>
                       <span class="text-gray-600 dark:text-gray-400">${t('Si hay peligro físico inmediato, ignora (temporalmente) los sentimientos. Maslow manda.', 'If immediate physical danger, ignore (temporarily) feelings. Maslow rules.')}</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      `;
    }
  });
})();