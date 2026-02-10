{
type: "new file",
fileName: "30_common_student_errors.js",
fullContent: `
/* 30_common_student_errors.js — Trap Avoidance & NCLEX Mindset */

window.NCLEX.registerTopic({
  id: '30_common_student_errors',
  title: {
    es: 'Errores Comunes de Estudiantes',
    en: 'Common Student Errors'
  },
  subtitle: {
    es: 'Hospital Ideal vs. Mundo Real y Trampas Mentales',
    en: 'Ideal Hospital vs. Real World & Mental Traps'
  },
  icon: 'bug',
  color: 'orange',
  keywords: ['errors', 'nclex hospital', 'traps', 'mistakes', 'test-taking', 'assumptions', 'ideal world'],
  render: function () {
    return \`
      <header class="mb-8">
        <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2">
          <span class="lang-es">Errores Fatales en el NCLEX</span>
          <span class="lang-en hidden-lang">Fatal NCLEX Errors</span>
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-300">
          <span class="lang-es">El NCLEX no evalúa tu experiencia laboral, evalúa tu juicio clínico en un entorno ideal. Descubre por qué fallan los estudiantes inteligentes.</span>
          <span class="lang-en hidden-lang">The NCLEX doesn't test your work experience, it tests your clinical judgment in an ideal setting. Discover why smart students fail.</span>
        </p>
      </header>

      <section class="mb-10">
        <div class="bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-orange-200 dark:border-orange-900/30 overflow-hidden">
          <div class="bg-orange-500 text-white p-4 flex items-center justify-between">
            <h2 class="font-bold text-lg flex items-center">
              <i class="fa-solid fa-hospital-user mr-2"></i>
              <span class="lang-es">Error #1: Hospital Real vs. Hospital NCLEX</span>
              <span class="lang-en hidden-lang">Error #1: Real Hospital vs. NCLEX Hospital</span>
            </h2>
            <i class="fa-solid fa-1 text-4xl opacity-20"></i>
          </div>
          
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <h3 class="text-red-500 font-bold uppercase text-xs tracking-widest flex items-center">
                <i class="fa-solid fa-xmark mr-1"></i> 
                <span class="lang-es">Mundo Real (Incorrecto)</span>
                <span class="lang-en hidden-lang">Real World (Wrong)</span>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 italic">
                <span class="lang-es">"No tengo tiempo para sentarme a hablar con el paciente, tengo otros 6 pacientes."</span>
                <span class="lang-en hidden-lang">"I don't have time to sit and talk with the patient, I have 6 other patients."</span>
              </p>
              <p class="text-sm text-slate-600 dark:text-slate-400 italic">
                <span class="lang-es">"Llamaré a seguridad porque no hay staff suficiente."</span>
                <span class="lang-en hidden-lang">"I'll call security because we are short-staffed."</span>
              </p>
            </div>

            <div class="space-y-2">
              <h3 class="text-green-500 font-bold uppercase text-xs tracking-widest flex items-center">
                <i class="fa-solid fa-check mr-1"></i> 
                <span class="lang-es">Hospital NCLEX (Correcto)</span>
                <span class="lang-en hidden-lang">NCLEX Hospital (Correct)</span>
              </h3>
              <p class="text-sm text-slate-800 dark:text-slate-200 font-medium bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border-l-4 border-green-500">
                <span class="lang-es">Tienes TIEMPO ILIMITADO, personal ilimitado y equipo ilimitado. Solo tienes UN paciente en la pregunta. Nunca asumas falta de recursos.</span>
                <span class="lang-en hidden-lang">You have UNLIMITED TIME, unlimited staff, and unlimited equipment. You only have ONE patient in the question. Never assume lack of resources.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <div class="bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-purple-200 dark:border-purple-900/30 overflow-hidden">
          <div class="bg-purple-600 text-white p-4 flex items-center justify-between">
            <h2 class="font-bold text-lg flex items-center">
              <i class="fa-solid fa-pen-to-square mr-2"></i>
              <span class="lang-es">Error #2: Inventar Información ("What If")</span>
              <span class="lang-en hidden-lang">Error #2: Adding Information ("What If")</span>
            </h2>
            <i class="fa-solid fa-2 text-4xl opacity-20"></i>
          </div>
          <div class="p-6">
            <p class="text-lg text-slate-700 dark:text-slate-200 mb-4 font-serif text-center">
              <span class="lang-es">"Si no está escrito, NO está sucediendo."</span>
              <span class="lang-en hidden-lang">"If it's not written, it's NOT happening."</span>
            </p>
            
            <div class="flex flex-col md:flex-row items-center gap-6 bg-gray-50 dark:bg-black/20 p-4 rounded-xl">
              <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-2xl flex-shrink-0">
                <i class="fa-solid fa-brain"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white mb-1">
                  <span class="lang-es">El error del estudiante:</span>
                  <span class="lang-en hidden-lang">The Student's Mistake:</span>
                </h4>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  <span class="lang-es">Pregunta: "Un paciente tiene PA 90/60".<br>Estudiante piensa: "Bueno, ¿y si también tiene hemorragia interna? ¿Y si es un error de la máquina?".</span>
                  <span class="lang-en hidden-lang">Question: "Client has BP 90/60".<br>Student thinks: "Well, what if they also have internal bleeding? What if the machine is broken?".</span>
                </p>
              </div>
            </div>
            
            <div class="mt-4 text-center">
              <span class="inline-block bg-brand-blue text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                <span class="lang-es">Regla de Oro</span><span class="lang-en hidden-lang">Golden Rule</span>
              </span>
              <p class="text-sm mt-2 text-brand-blue">
                <span class="lang-es">Responde SOLO con los datos que tienes frente a ti.</span>
                <span class="lang-en hidden-lang">Answer ONLY with the data directly in front of you.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <div class="bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-teal-200 dark:border-teal-900/30 overflow-hidden">
          <div class="bg-teal-600 text-white p-4 flex items-center justify-between">
            <h2 class="font-bold text-lg flex items-center">
              <i class="fa-solid fa-clipboard-check mr-2"></i>
              <span class="lang-es">Error #3: Esperado vs. Complicación</span>
              <span class="lang-en hidden-lang">Error #3: Expected vs. Complication</span>
            </h2>
            <i class="fa-solid fa-3 text-4xl opacity-20"></i>
          </div>
          <div class="p-6">
            <p class="text-slate-600 dark:text-slate-300 mb-6">
              <span class="lang-es">No llames al médico por algo que tú ESPERAS que suceda debido a la enfermedad o tratamiento. Llama por lo INESPERADO o peligroso.</span>
              <span class="lang-en hidden-lang">Do not call the doctor for something you EXPECT to happen due to the disease or treatment. Call for the UNEXPECTED or dangerous.</span>
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 p-4 rounded-xl">
                <h4 class="font-bold text-green-700 dark:text-green-400 mb-2 text-center uppercase text-sm">
                  <span class="lang-es">Esperado (No Llamar)</span>
                  <span class="lang-en hidden-lang">Expected (Don't Call)</span>
                </h4>
                <ul class="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                  <li><i class="fa-solid fa-check text-green-500 mr-2"></i> Nausea during Chemotherapy</li>
                  <li><i class="fa-solid fa-check text-green-500 mr-2"></i> Pain 6/10 immediately post-op</li>
                  <li><i class="fa-solid fa-check text-green-500 mr-2"></i> Mild fever 24h after vaccine</li>
                </ul>
              </div>

              <div class="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl">
                <h4 class="font-bold text-red-700 dark:text-red-400 mb-2 text-center uppercase text-sm">
                  <span class="lang-es">Inesperado (PRIORIDAD)</span>
                  <span class="lang-en hidden-lang">Unexpected (PRIORITY)</span>
                </h4>
                <ul class="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                  <li><i class="fa-solid fa-exclamation-circle text-red-500 mr-2"></i> Fever during Chemotherapy (Sepsis)</li>
                  <li><i class="fa-solid fa-exclamation-circle text-red-500 mr-2"></i> Pain becoming severe/radiating</li>
                  <li><i class="fa-solid fa-exclamation-circle text-red-500 mr-2"></i> Dyspnea/Stridor after vaccine (Anaphylaxis)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <div class="bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-blue-200 dark:border-blue-900/30 overflow-hidden">
          <div class="bg-blue-600 text-white p-4 flex items-center justify-between">
            <h2 class="font-bold text-lg flex items-center">
              <i class="fa-solid fa-lungs mr-2"></i>
              <span class="lang-es">Error #4: La Trampa de la "Vía Aérea"</span>
              <span class="lang-en hidden-lang">Error #4: The "Airway" Trap</span>
            </h2>
            <i class="fa-solid fa-4 text-4xl opacity-20"></i>
          </div>
          <div class="p-6">
            <div class="flex items-start gap-4">
              <i class="fa-solid fa-triangle-exclamation text-yellow-500 text-3xl mt-1"></i>
              <div>
                 <p class="text-slate-700 dark:text-slate-200 font-bold mb-2">
                   <span class="lang-es">Mito: "Airway" siempre es la respuesta correcta.</span>
                   <span class="lang-en hidden-lang">Myth: "Airway" is always the correct answer.</span>
                 </p>
                 <p class="text-sm text-slate-600 dark:text-slate-400">
                   <span class="lang-es">Si el escenario dice: "El paciente está gritando de dolor..." o "El paciente habla coherentemente..." ¡Su vía aérea ESTÁ permeable! No elijas "Evaluar vía aérea".</span>
                   <span class="lang-en hidden-lang">If the scenario says: "Patient is screaming in pain..." or "Patient is speaking coherently..." Their airway IS patent! Do not choose "Assess airway".</span>
                 </p>
                 <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-800 dark:text-blue-200">
                    <strong>Tip:</strong> Look for issues with <em>Breathing</em> (gas exchange) or <em>Circulation</em> if the patient is talking.
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="bg-slate-900 text-white p-6 rounded-xl text-center shadow-xl">
        <h3 class="font-bold text-xl mb-2">
           <i class="fa-solid fa-graduation-cap text-yellow-400 mr-2"></i>
           <span class="lang-es">Mentalidad de Éxito</span>
           <span class="lang-en hidden-lang">Success Mindset</span>
        </h3>
        <p class="text-gray-300 text-sm max-w-2xl mx-auto">
          <span class="lang-es">"Soy un enfermero seguro y prudente. Tomo decisiones basadas en datos, priorizo la vida sobre la extremidad, y agudo sobre crónico."</span>
          <span class="lang-en hidden-lang">"I am a safe and prudent nurse. I make data-driven decisions, prioritize life over limb, and acute over chronic."</span>
        </p>
      </div>

    \`;
  }
});
`
}