/* 28_ethics_legal.js — Ethics, Legal Issues & Professional Standards */

(function() {
  if (!window.NCLEX) return;

  window.NCLEX.registerTopic({
    id: '28_ethics_legal',
    title: {
      es: 'Ética, Leyes y Normas Profesionales',
      en: 'Ethics, Legal Issues & Professional Standards'
    },
    subtitle: {
      es: 'Principios Éticos, Torts y Responsabilidad Legal',
      en: 'Ethical Principles, Torts & Legal Liability'
    },
    icon: 'scale-balanced',
    color: 'slate',
    keywords: ['ethics', 'legal', 'torts', 'hipaa', 'consent', 'negligence', 'malpractice', 'autonomy', 'beneficence'],
    render: function () {
      return `
        <header class="mb-8">
          <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2">
            <span class="lang-es">Ética y Marco Legal en Enfermería</span>
            <span class="lang-en hidden-lang">Nursing Ethics & Legal Framework</span>
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-300">
            <span class="lang-es">Dominio de principios éticos fundamentales, leyes civiles (torts), consentimiento informado y responsabilidad profesional para el NCLEX.</span>
            <span class="lang-en hidden-lang">Mastery of fundamental ethical principles, civil laws (torts), informed consent, and professional liability for the NCLEX.</span>
          </p>
        </header>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
            <div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
              <i class="fa-solid fa-gem text-indigo-600 dark:text-indigo-400"></i>
            </div>
            <span class="lang-es">Los 6 Principios Éticos Clave</span>
            <span class="lang-en hidden-lang">The 6 Key Ethical Principles</span>
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white dark:bg-brand-card p-5 rounded-xl border-l-4 border-indigo-500 shadow-sm">
              <h3 class="font-bold text-lg text-indigo-700 dark:text-indigo-300 mb-2">
                <span class="lang-es">1. Autonomía (Autonomy)</span>
                <span class="lang-en hidden-lang">1. Autonomy</span>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                <span class="lang-es">El derecho del paciente a tomar sus propias decisiones, incluso si no son las "mejores" médicamente.</span>
                <span class="lang-en hidden-lang">The client's right to make their own decisions, even if they are not medically "best".</span>
              </p>
              <div class="mt-2 text-xs bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded text-indigo-800 dark:text-indigo-200">
                <strong>Example:</strong> Patient refusing chemotherapy despite prognosis.
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-5 rounded-xl border-l-4 border-green-500 shadow-sm">
              <h3 class="font-bold text-lg text-green-700 dark:text-green-300 mb-2">
                <span class="lang-es">2. Beneficencia (Beneficence)</span>
                <span class="lang-en hidden-lang">2. Beneficence</span>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                <span class="lang-es">La obligación de hacer el bien y actuar en el mejor interés del cliente.</span>
                <span class="lang-en hidden-lang">The obligation to do good and act in the client's best interest.</span>
              </p>
            </div>

            <div class="bg-white dark:bg-brand-card p-5 rounded-xl border-l-4 border-red-500 shadow-sm">
              <h3 class="font-bold text-lg text-red-700 dark:text-red-300 mb-2">
                <span class="lang-es">3. No Maleficencia (Non-maleficence)</span>
                <span class="lang-en hidden-lang">3. Non-maleficence</span>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                <span class="lang-es">"Primero, no hacer daño". Evitar daño intencional o no intencional.</span>
                <span class="lang-en hidden-lang">"First, do no harm." Avoiding intentional or unintentional harm.</span>
              </p>
            </div>

            <div class="bg-white dark:bg-brand-card p-5 rounded-xl border-l-4 border-slate-500 shadow-sm">
              <h3 class="font-bold text-lg text-slate-700 dark:text-slate-300 mb-2">
                <span class="lang-es">4. Justicia (Justice)</span>
                <span class="lang-en hidden-lang">4. Justice</span>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                <span class="lang-es">Trato justo, equitativo y distribución imparcial de recursos (camas UCI, órganos).</span>
                <span class="lang-en hidden-lang">Fair treatment and impartial distribution of resources (ICU beds, organs).</span>
              </p>
            </div>

            <div class="bg-white dark:bg-brand-card p-5 rounded-xl border-l-4 border-cyan-500 shadow-sm">
              <h3 class="font-bold text-lg text-cyan-700 dark:text-cyan-300 mb-2">
                <span class="lang-es">5. Veracidad (Veracity)</span>
                <span class="lang-en hidden-lang">5. Veracity</span>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                <span class="lang-es">La obligación de decir la verdad. No mentir sobre diagnósticos o errores.</span>
                <span class="lang-en hidden-lang">The obligation to tell the truth. Not lying about diagnoses or errors.</span>
              </p>
            </div>

            <div class="bg-white dark:bg-brand-card p-5 rounded-xl border-l-4 border-pink-500 shadow-sm">
              <h3 class="font-bold text-lg text-pink-700 dark:text-pink-300 mb-2">
                <span class="lang-es">6. Fidelidad (Fidelity)</span>
                <span class="lang-en hidden-lang">6. Fidelity</span>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                <span class="lang-es">Mantener promesas y lealtad profesional al paciente.</span>
                <span class="lang-en hidden-lang">Keeping promises and professional loyalty to the patient.</span>
              </p>
              <div class="mt-2 text-xs bg-pink-50 dark:bg-pink-900/20 p-2 rounded text-pink-800 dark:text-pink-200">
                <strong>Example:</strong> Returning to the room exactly when you said you would.
              </div>
            </div>
          </div>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
            <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3">
              <i class="fa-solid fa-gavel text-orange-600 dark:text-orange-400"></i>
            </div>
            <span class="lang-es">Leyes Civiles (Torts)</span>
            <span class="lang-en hidden-lang">Legal Torts</span>
          </h2>

          <div class="overflow-x-auto bg-white dark:bg-brand-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 text-sm uppercase">
                  <th class="p-4 border-b border-gray-200 dark:border-gray-700">Type</th>
                  <th class="p-4 border-b border-gray-200 dark:border-gray-700">Term (NCLEX)</th>
                  <th class="p-4 border-b border-gray-200 dark:border-gray-700">Definition / Definición</th>
                  <th class="p-4 border-b border-gray-200 dark:border-gray-700">Example / Ejemplo</th>
                </tr>
              </thead>
              <tbody class="text-sm text-slate-700 dark:text-slate-300 divide-y divide-gray-100 dark:divide-gray-700">
                <tr class="bg-orange-50/50 dark:bg-orange-900/10">
                  <td class="p-4 font-bold" rowspan="2">Unintentional</td>
                  <td class="p-4 font-bold text-brand-blue">Negligence</td>
                  <td class="p-4">
                    <span class="lang-es">Falla en actuar como una persona prudente razonable.</span>
                    <span class="lang-en hidden-lang">Failure to act as a reasonable prudent person.</span>
                  </td>
                  <td class="p-4 italic">Forget to lock wheelchair brakes.</td>
                </tr>
                <tr class="bg-orange-50/50 dark:bg-orange-900/10">
                  <td class="p-4 font-bold text-brand-blue">Malpractice</td>
                  <td class="p-4">
                    <span class="lang-es">Negligencia profesional. Requiere: Deber, Incumplimiento, Daño y Causalidad.</span>
                    <span class="lang-en hidden-lang">Professional negligence. Requires: Duty, Breach, Harm, Causation.</span>
                  </td>
                  <td class="p-4 italic">Administering wrong dose causing cardiac arrest.</td>
                </tr>
                <tr>
                  <td class="p-4 font-bold" rowspan="3">Intentional</td>
                  <td class="p-4 font-bold text-red-500">Assault</td>
                  <td class="p-4">
                    <span class="lang-es">Amenaza de daño (sin tocar).</span>
                    <span class="lang-en hidden-lang">Threat of harm (no touching).</span>
                  </td>
                  <td class="p-4 italic">"If you don't take this pill, I will inject you."</td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-red-500">Battery</td>
                  <td class="p-4">
                    <span class="lang-es">Contacto físico no consentido o dañino.</span>
                    <span class="lang-en hidden-lang">Unconsented or harmful physical contact.</span>
                  </td>
                  <td class="p-4 italic">Injecting medication after patient refused.</td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-red-500">False Imprisonment</td>
                  <td class="p-4">
                    <span class="lang-es">Restricción injustificada de la libertad.</span>
                    <span class="lang-en hidden-lang">Unjustified restriction of freedom.</span>
                  </td>
                  <td class="p-4 italic">Applying restraints without an order or necessity.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          <div class="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
              <i class="fa-solid fa-file-signature mr-2"></i> Consentimiento Informado
            </h3>
            <div class="space-y-4">
              <div class="bg-white dark:bg-brand-card p-4 rounded-lg shadow-sm">
                <span class="text-xs font-bold text-gray-400 uppercase">Provider's Role (Médico)</span>
                <p class="text-sm font-medium mt-1">
                  <span class="lang-es">Explicar procedimiento, riesgos, beneficios y alternativas.</span>
                  <span class="lang-en hidden-lang">Explain procedure, risks, benefits, and alternatives.</span>
                </p>
              </div>
              <div class="bg-white dark:bg-brand-card p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                <span class="text-xs font-bold text-gray-400 uppercase">Nurse's Role (Enfermero)</span>
                <p class="text-sm font-medium mt-1">
                  <span class="lang-es">TESTIGO (Witness) de la firma, verificar capacidad del paciente y voluntariedad. NO explicar el procedimiento.</span>
                  <span class="lang-en hidden-lang">WITNESS signature, verify patient capacity and voluntariness. Do NOT explain the procedure.</span>
                </p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
             <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <i class="fa-solid fa-user-shield mr-2"></i> HIPAA & Privacidad
            </h3>
            <ul class="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li class="flex items-start">
                <i class="fa-solid fa-ban text-red-500 mt-1 mr-2"></i>
                <span>
                  <span class="lang-es">Nunca discutir pacientes en áreas públicas (ascensores, cafetería).</span>
                  <span class="lang-en hidden-lang">Never discuss patients in public areas (elevators, cafeteria).</span>
                </span>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-ban text-red-500 mt-1 mr-2"></i>
                <span>
                  <span class="lang-es">No acceder a registros de pacientes no asignados (incluso familiares).</span>
                  <span class="lang-en hidden-lang">Do not access records of unassigned patients (even family).</span>
                </span>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-check text-green-500 mt-1 mr-2"></i>
                <span>
                  <span class="lang-es">Cerrar sesión (Log out) siempre al dejar la computadora.</span>
                  <span class="lang-en hidden-lang">Always log out when leaving the computer terminal.</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <section class="mb-20">
          <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
            <h2 class="text-xl font-bold text-red-800 dark:text-red-300 mb-4">
              <i class="fa-solid fa-triangle-exclamation mr-2"></i> 
              <span class="lang-es">Reporte Obligatorio (Mandatory Reporting)</span>
              <span class="lang-en hidden-lang">Mandatory Reporting</span>
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-bold text-red-700 dark:text-red-400 text-sm uppercase mb-2">Abuse / Neglect</h4>
                <p class="text-sm text-slate-700 dark:text-slate-300 mb-2">
                  <span class="lang-es">El enfermero DEBE reportar sospecha de abuso en poblaciones vulnerables (Niños y Ancianos).</span>
                  <span class="lang-en hidden-lang">Nurse MUST report suspected abuse in vulnerable populations (Children & Elderly).</span>
                </p>
                <ul class="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400">
                  <li>Domestic abuse is usually NOT mandatory reporting unless a weapon is involved (check state laws), offer resources instead.</li>
                </ul>
              </div>
              <div>
                <h4 class="font-bold text-red-700 dark:text-red-400 text-sm uppercase mb-2">Impaired Coworker</h4>
                <p class="text-sm text-slate-700 dark:text-slate-300">
                  <span class="lang-es">Si sospecha que un colega está bajo la influencia (alcohol/drogas): Reportar inmediatamente al SUPERVISOR (Charge Nurse/Manager). No confrontar solo.</span>
                  <span class="lang-en hidden-lang">If suspecting a coworker is impaired (alcohol/drugs): Report immediately to SUPERVISOR (Charge Nurse/Manager). Do not confront alone.</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      `;
    }
  });
})();