/* 29_negative_rationales.js — The Art of Elimination & Identifying Distractors */

(function() {
  if (!window.NCLEX) return;

  window.NCLEX.registerTopic({
    id: '29_negative_rationales',
    title: {
      es: 'Racionales Negativos y Estrategias de Descarte',
      en: 'Negative Rationales & Elimination Strategies'
    },
    subtitle: {
      es: 'Cómo identificar y eliminar distractores en el NCLEX',
      en: 'How to identify and eliminate distractors on the NCLEX'
    },
    icon: 'filter-circle-xmark',
    color: 'rose',
    keywords: ['elimination', 'distractors', 'strategy', 'test-taking', 'negative rationale', 'wrong answers'],
    render: function () {
      return `
        <header class="mb-8">
          <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2">
            <span class="lang-es">El Arte del Descarte</span>
            <span class="lang-en hidden-lang">The Art of Elimination</span>
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-300">
            <span class="lang-es">En el NCLEX, saber por qué una respuesta es INCORRECTA (Racional Negativo) es tan vital como saber la correcta. Aprende a detectar las trampas.</span>
            <span class="lang-en hidden-lang">On the NCLEX, knowing why an answer is WRONG (Negative Rationale) is as vital as knowing the right one. Learn to spot the traps.</span>
          </p>
        </header>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
            <div class="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mr-3">
              <i class="fa-solid fa-spider text-rose-600 dark:text-rose-400"></i>
            </div>
            <span class="lang-es">Anatomía de un Distractor</span>
            <span class="lang-en hidden-lang">Anatomy of a Distractor</span>
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-brand-card p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
              <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <i class="fa-solid fa-bed text-6xl"></i>
              </div>
              <h3 class="font-bold text-lg text-rose-600 dark:text-rose-400 mb-2">
                 1. La Trampa de "No Hacer Nada" <span class="text-xs text-gray-500 block font-normal text-slate-500">(The "Do Nothing" Trap)</span>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
                <span class="lang-es">Opciones que sugieren "monitorear", "documentar" o "reevaluar más tarde" cuando el paciente está en peligro o angustia aguda.</span>
                <span class="lang-en hidden-lang">Options suggesting to "monitor", "document", or "re-assess later" when the patient is in danger or acute distress.</span>
              </p>
              <div class="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-lg border-l-4 border-rose-500">
                <p class="text-xs font-bold text-rose-800 dark:text-rose-200">
                  <i class="fa-solid fa-ban mr-1"></i> Negative Rationale:
                </p>
                <p class="text-xs text-slate-700 dark:text-slate-300 italic">
                  "Ignoring a problem does not solve it. Unless the patient is stable, 'monitoring' is usually a wrong action."
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
               <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <i class="fa-solid fa-user-doctor text-6xl"></i>
              </div>
              <h3 class="font-bold text-lg text-rose-600 dark:text-rose-400 mb-2">
                 2. "Llamar al Médico" <span class="text-xs text-gray-500 block font-normal text-slate-500">(Passing the Buck)</span>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
                <span class="lang-es">Llamar al proveedor de salud ANTES de realizar una evaluación de enfermería o una intervención independiente.</span>
                <span class="lang-en hidden-lang">Calling the healthcare provider BEFORE performing a nursing assessment or independent intervention.</span>
              </p>
              <div class="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-lg border-l-4 border-rose-500">
                <p class="text-xs font-bold text-rose-800 dark:text-rose-200">
                  <i class="fa-solid fa-ban mr-1"></i> Negative Rationale:
                </p>
                <p class="text-xs text-slate-700 dark:text-slate-300 italic">
                  "The doctor will ask 'What is the BP?'. If you haven't measured it, you failed. Assess first, then call."
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
               <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <i class="fa-solid fa-comments text-6xl"></i>
              </div>
              <h3 class="font-bold text-lg text-rose-600 dark:text-rose-400 mb-2">
                 3. La Pregunta "¿Por qué?" <span class="text-xs text-gray-500 block font-normal text-slate-500">(The "Why" Question)</span>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
                <span class="lang-es">Cualquier opción en salud mental o comunicación que empiece con "¿Por qué siente usted...?" o "¿Por qué hizo...?".</span>
                <span class="lang-en hidden-lang">Any option in mental health or communication starting with "Why do you feel..." or "Why did you...".</span>
              </p>
              <div class="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-lg border-l-4 border-rose-500">
                <p class="text-xs font-bold text-rose-800 dark:text-rose-200">
                  <i class="fa-solid fa-ban mr-1"></i> Negative Rationale:
                </p>
                <p class="text-xs text-slate-700 dark:text-slate-300 italic">
                  "'Why' questions are judgmental and cause the patient to become defensive. It blocks therapeutic communication."
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
               <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <i class="fa-solid fa-bullseye text-6xl"></i>
              </div>
              <h3 class="font-bold text-lg text-rose-600 dark:text-rose-400 mb-2">
                 4. Cierto pero Irrelevante <span class="text-xs text-gray-500 block font-normal text-slate-500">(True but Irrelevant)</span>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
                <span class="lang-es">Una afirmación que es médicamente correcta (un hecho real) pero NO responde a la pregunta específica o al problema prioritario.</span>
                <span class="lang-en hidden-lang">A statement that is medically correct (a fact) but DOES NOT answer the specific question or address the priority problem.</span>
              </p>
              <div class="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-lg border-l-4 border-rose-500">
                <p class="text-xs font-bold text-rose-800 dark:text-rose-200">
                  <i class="fa-solid fa-ban mr-1"></i> Negative Rationale:
                </p>
                <p class="text-xs text-slate-700 dark:text-slate-300 italic">
                  "The fact that 'Diabetes causes neuropathy' is true, but it doesn't help the patient who is currently hypoglycemic."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div class="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
             <h2 class="text-xl font-bold mb-4 flex items-center">
               <i class="fa-solid fa-vial mr-2"></i> 
               <span class="lang-es">Práctica de Descarte</span>
               <span class="lang-en hidden-lang">Elimination Practice</span>
             </h2>
             
             <div class="mb-6">
               <p class="font-serif text-lg leading-relaxed mb-4">
                 <span class="text-brand-blue font-bold">Q:</span> 
                 <span class="lang-es">Un cliente con insuficiencia cardíaca congestiva (CHF) se queja de dificultad para respirar (disnea). ¿Cuál es la acción de enfermería prioritaria?</span>
                 <span class="lang-en hidden-lang">A client with Congestive Heart Failure (CHF) complains of shortness of breath (dyspnea). What is the priority nursing action?</span>
               </p>
             </div>

             <div class="space-y-3">
               <div class="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-red-500 transition-colors cursor-help group" onclick="this.classList.toggle('border-red-500'); this.querySelector('.rationale').classList.toggle('hidden')">
                 <div class="flex items-center justify-between">
                   <span class="font-bold text-gray-300 group-hover:text-white">A. <span class="lang-es">Llamar al médico inmediatamente.</span><span class="lang-en hidden-lang">Call the physician immediately.</span></span>
                   <i class="fa-solid fa-circle-xmark text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                 </div>
                 <div class="rationale hidden mt-3 text-sm text-red-300 border-t border-white/10 pt-2 animate-fade-in">
                   <strong>Negative Rationale:</strong> "Pass the Buck". You must assess/intervene (positioning) before calling. The doctor is not in the room; you are.
                 </div>
               </div>

               <div class="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-green-500 transition-colors cursor-help group" onclick="this.classList.toggle('border-green-500'); this.querySelector('.rationale').classList.toggle('hidden')">
                 <div class="flex items-center justify-between">
                   <span class="font-bold text-gray-300 group-hover:text-white">B. <span class="lang-es">Elevar la cabecera de la cama (High-Fowler's).</span><span class="lang-en hidden-lang">Elevate the head of the bed (High-Fowler's).</span></span>
                   <i class="fa-solid fa-circle-check text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                 </div>
                 <div class="rationale hidden mt-3 text-sm text-green-300 border-t border-white/10 pt-2 animate-fade-in">
                   <strong>CORRECT:</strong> Immediate independent intervention. Uses gravity to improve lung expansion and reduce venous return (preload).
                 </div>
               </div>

               <div class="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-red-500 transition-colors cursor-help group" onclick="this.classList.toggle('border-red-500'); this.querySelector('.rationale').classList.toggle('hidden')">
                 <div class="flex items-center justify-between">
                   <span class="font-bold text-gray-300 group-hover:text-white">C. <span class="lang-es">Documentar los hallazgos.</span><span class="lang-en hidden-lang">Document the findings.</span></span>
                   <i class="fa-solid fa-circle-xmark text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                 </div>
                 <div class="rationale hidden mt-3 text-sm text-red-300 border-t border-white/10 pt-2 animate-fade-in">
                   <strong>Negative Rationale:</strong> "Do Nothing". Documentation does not help the patient breathe. Airway/Breathing is the priority.
                 </div>
               </div>

               <div class="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-red-500 transition-colors cursor-help group" onclick="this.classList.toggle('border-red-500'); this.querySelector('.rationale').classList.toggle('hidden')">
                 <div class="flex items-center justify-between">
                   <span class="font-bold text-gray-300 group-hover:text-white">D. <span class="lang-es">Preguntar al paciente por qué no tomó sus diuréticos.</span><span class="lang-en hidden-lang">Ask the patient why they didn't take their diuretics.</span></span>
                   <i class="fa-solid fa-circle-xmark text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                 </div>
                 <div class="rationale hidden mt-3 text-sm text-red-300 border-t border-white/10 pt-2 animate-fade-in">
                   <strong>Negative Rationale:</strong> "The 'Why' Question". Judgmental and not appropriate during an acute respiratory crisis. Focus on physiology, not psychology right now.
                 </div>
               </div>
             </div>
             
             <p class="text-center text-xs text-gray-500 mt-4 italic">
               <span class="lang-es">Haz clic en las opciones para ver los racionales.</span>
               <span class="lang-en hidden-lang">Click options to reveal rationales.</span>
             </p>
          </div>
        </section>
      `;
    }
  });
})();