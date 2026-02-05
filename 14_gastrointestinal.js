// 14_gastrointestinal.js — Complete GI & Nutrition Masterclass (NCLEX High-Yield)
// VERSIÓN MAESTRA DEFINITIVA: Pathologies, Tubes, TPN & Nutrition
// COMBINACIÓN ÓPTIMA: Estructura Técnica (GASTRO8) + Contenido Extenso (GASTRO5) + Pediatría (GASTRO6)
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // Helper function para manejo eficiente de idiomas (DRY Principle)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'gastrointestinal',
    title: { es: 'Gastrointestinal y Nutrición', en: 'GI & Nutrition' },
    subtitle: { es: 'Patologías, Sondas y Dietas', en: 'Pathologies, Tubes & Diets' },
    icon: 'utensils',
    color: 'amber',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-utensils"></i>
                ${t('Masterclass Digestivo', 'Digestive Masterclass')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Sistema Gastrointestinal', 'Gastrointestinal System')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('Prioridades: Pancreatitis, Cirrosis, TPN y Dietas Terapéuticas.', 'Priorities: Pancreatitis, Cirrhosis, TPN & Therapeutic Diets.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderAssessment()}
          ${this.renderPathologies()}
          ${this.renderEmergencies()}
          ${this.renderProceduresAndTubes()}
          ${this.renderPharmacology()}
          ${this.renderDietAndNutrition()}
        </div>
      `;
    },

    // --- 1. Assessment ---
    renderAssessment() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white font-black text-xl shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Valoración Abdominal (NCLEX Priority)', 'Abdominal Assessment (NCLEX Priority)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg lg:col-span-2">
              <strong class="text-xl text-amber-700 dark:text-amber-400 block mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                ${t('Secuencia de Examen Abdominal', 'Abdominal Exam Sequence')}
              </strong>
              <div class="flex flex-col gap-3 mt-4">
                <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                   <div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">1</div>
                   <span>
                     <strong class="text-amber-600 dark:text-amber-400">${t('Inspección', 'Inspection')}</strong> 
                     ${t('(Mirar): Contorno, cicatrices, pulsaciones, masas, peristalsis visible.', '(Look): Contour, scars, pulsations, masses, visible peristalsis.')}
                   </span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                   <div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">2</div>
                   <span>
                     <strong class="text-amber-600 dark:text-amber-400">${t('Auscultación', 'Auscultation')}</strong> 
                     ${t('(Escuchar): Sonidos intestinales (normales: 5-35/min). ANTES de tocar.', '(Listen): Bowel sounds (normal: 5-35/min). BEFORE touching.')}
                   </span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                   <div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">3</div>
                   <span>
                     <strong class="text-amber-600 dark:text-amber-400">${t('Percusión', 'Percussion')}</strong> 
                     ${t('(Tocar): Timpanismo (gas), matidez (masas, líquido).', '(Tap): Tympany (gas), dullness (masses, fluid).')}
                   </span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-red-200 dark:border-red-800">
                   <div class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">4</div>
                   <span>
                     <strong class="text-red-600 dark:text-red-400">${t('Palpación', 'Palpation')}</strong> 
                     ${t('(Tocar): <strong>ÚLTIMO</strong> (para no alterar sonidos). Ligera → profunda.', '(Touch): <strong>LAST</strong> (to avoid altering sounds). Light → deep.')}
                   </span>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
                ${t('Excepción al orden general (otros sistemas: inspección, palpación, percusión, auscultación).', 'Exception to general order (other systems: inspection, palpation, percussion, auscultation).')}
              </p>
            </div>

            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <strong class="text-xl text-blue-700 dark:text-blue-400 block mb-4">
                ${t('Interpretación Crítica', 'Critical Interpretation')}
              </strong>
              <div class="space-y-3 text-sm">
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <strong class="text-gray-900 dark:text-white">
                    ${t('Sonidos Intestinales:', 'Bowel Sounds:')}
                  </strong>
                  <ul class="mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• <strong>Hiper/Hyper</strong>: ${t('Obstrucción temprana, diarrea.', 'Early obstruction, diarrhea.')}</li>
                    <li>• <strong>Hipo/Hypo</strong>: ${t('Íleo paralítico, peritonitis, post-op.', 'Paralytic ileus, peritonitis, post-op.')}</li>
                    <li>• <strong>Absent x5min</strong>: ${t('Emergencia quirúrgica.', 'Surgical emergency.')}</li>
                  </ul>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <strong class="text-gray-900 dark:text-white">
                    ${t('Signos de Alarma:', 'Red Flags:')}
                  </strong>
                  <ul class="mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• <strong>Rigidez/Rigidity</strong>: Peritonitis.</li>
                    <li>• <strong>Rebote/Rebound Tenderness</strong>: ${t('Inflamación peritoneal.', 'Peritoneal inflammation.')}</li>
                    <li>• <strong>McBurney</strong>: Apendicitis (RLQ).</li>
                    <li>• <strong>Murphy</strong>: Colecistitis (RUQ).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <strong class="text-xl text-blue-700 dark:text-blue-400 block mb-4">
                ${t('Laboratorios Críticos', 'Critical Labs')}
              </strong>
              <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-500 dark:text-gray-400 uppercase border-b dark:border-gray-700">
                  <tr>
                    <th class="py-2">Test</th>
                    <th class="py-2">Normal</th>
                    <th class="py-2">${t('Significado Clínico', 'Clinical Significance')}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr>
                    <td class="py-2 font-bold text-gray-900 dark:text-white">Albumin</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">3.5 - 5.0 g/dL</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">↓ ${t('Desnutrición, cirrosis, ascitis.', 'Malnutrition, cirrhosis, ascites.')}</td>
                  </tr>
                  <tr>
                    <td class="py-2 font-bold text-gray-900 dark:text-white">Ammonia</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">15 - 45 µg/dL</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">↑ ${t('Encefalopatía hepática.', 'Hepatic encephalopathy.')}</td>
                  </tr>
                  <tr>
                    <td class="py-2 font-bold text-gray-900 dark:text-white">Amylase/Lipase</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">Amil: 30-110<br>Lip: 0-160</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">↑ ${t('Pancreatitis (Lipasa más específica).', 'Pancreatitis (Lipase more specific).')}</td>
                  </tr>
                  <tr>
                    <td class="py-2 font-bold text-gray-900 dark:text-white">AST / ALT</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">AST: 10-40<br>ALT: 7-56</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">↑ ${t('Daño hepático (ALT más específica).', 'Liver damage (ALT more specific).')}</td>
                  </tr>
                  <tr>
                    <td class="py-2 font-bold text-gray-900 dark:text-white">Bilirubin</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">0.1 - 1.2 mg/dL</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">↑ ${t('Ictericia.', 'Jaundice.')}</td>
                  </tr>
                  <tr>
                    <td class="py-2 font-bold text-gray-900 dark:text-white">TP/INR</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">INR: 0.8 - 1.2</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">↑ ${t('Fallo hepático (Riesgo sangrado).', 'Liver failure (Bleeding risk).')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <strong class="text-xl text-purple-700 dark:text-purple-400 block mb-4">
                ${t('Procedimientos Diagnósticos', 'Diagnostic Procedures')}
              </strong>
              <div class="space-y-4 text-sm">
                <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <strong class="text-purple-800 dark:text-purple-300">EGD (Upper GI)</strong>
                  <p class="text-gray-600 dark:text-gray-400 mt-1">
                    <strong>Pre:</strong> ${t('Ayuno 6-8h, consentimiento.', 'NPO 6-8h, consent.')}
                    <strong>Post:</strong> ${t('NPO hasta retorno del reflejo nauseoso (Gag Reflex).', 'NPO until Gag Reflex returns.')}
                  </p>
                </div>
                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <strong class="text-blue-800 dark:text-blue-300">Colonoscopy</strong>
                  <p class="text-gray-600 dark:text-gray-400 mt-1">
                    <strong>Pre:</strong> ${t('Dieta líquida clara 24h, Prep (PEG).', 'Clear liquid diet 24h, Prep (PEG).')}
                    <strong>Post:</strong> ${t('Vigilar perforación (dolor, fiebre).', 'Watch for perforation (pain, fever).')}
                  </p>
                </div>
                <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <strong class="text-green-800 dark:text-green-300">Paracentesis</strong>
                  <p class="text-gray-600 dark:text-gray-400 mt-1">
                    <strong>Pre:</strong> ${t('VACIAR VEJIGA (evitar punción), Fowler alta.', 'EMPTY BLADDER (avoid puncture), High Fowler.')}
                    <strong>Post:</strong> ${t('Monitorizar BP (Shock hipovolémico).', 'Monitor BP (Hypovolemic shock).')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. Pathologies ---
    renderPathologies() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Patologías Gastrointestinales (High-Yield)', 'Gastrointestinal Pathologies (High-Yield)')}
            </h2>
          </div>

          <div class="space-y-6">
            <div class="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-3xl border border-purple-200 dark:border-purple-800">
              <div class="flex flex-col md:flex-row justify-between mb-4 gap-2">
                 <h3 class="text-xl font-bold text-purple-900 dark:text-purple-300">
                    ${t('Pancreatitis Aguda', 'Acute Pancreatitis')}
                 </h3>
                 <div class="flex flex-wrap gap-2">
                    <span class="text-xs bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 px-2 py-1 rounded font-bold">Auto-Digestion</span>
                    <span class="text-xs bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 px-2 py-1 rounded font-bold">Causes: GETSMASHED</span>
                 </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <strong class="block text-purple-700 dark:text-purple-400 text-sm uppercase mb-2">
                    ${t('Presentación Clínica & Mnemotécnico', 'Clinical Presentation & Mnemonic')}
                  </strong>
                  <ul class="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• <strong>Dolor/Pain:</strong> ${t('Epigástrico a espalda, alivia al inclinarse.', 'Epigastric to back, relieved by leaning forward.')}</li>
                    <li>• <strong>Náuseas/Vómitos:</strong> Profuse.</li>
                    <li>• <strong>Grey-Turner:</strong> ${t('Equimosis en flancos (Turn around).', 'Flank bruising (Turn around).')}</li>
                    <li>• <strong>Cullen:</strong> ${t('Equimosis periumbilical (C de Círculo).', 'Periumbilical bruising (C for Circle).')}</li>
                    <li>• <strong>GETSMASHED</strong> (Causas):
                      <ul class="list-disc list-inside ml-4 mt-1 text-xs">
                        <li><strong>G</strong>allstones, <strong>E</strong>thanol, <strong>T</strong>rauma, <strong>S</strong>teroids, <strong>M</strong>umps, <strong>A</strong>utoimmune, <strong>S</strong>corpion, <strong>H</strong>yperlipidemia/Ca, <strong>E</strong>RCP, <strong>D</strong>rugs.</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div class="bg-white dark:bg-black/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900">
                  <strong class="block text-purple-700 dark:text-purple-400 text-sm uppercase mb-2">
                    ${t('Manejo (Prioridad NCLEX)', 'Management (NCLEX Priority)')}
                  </strong>
                  <ol class="list-decimal list-inside text-sm font-bold text-gray-900 dark:text-white space-y-2">
                    <li class="text-red-600 dark:text-red-400"><strong>NPO Strict</strong> (Gut rest).</li>
                    <li><strong>IV Fluids</strong> ${t('(Agresivos/Isotónicos) para prevenir necrosis.', '(Aggressive/Isotonic) to prevent necrosis.')}</li>
                    <li><strong>Analgesia IV</strong> (Hydromorphone/Fentanyl).</li>
                    <li><strong>NG Tube</strong> ${t('si vómito profuso/íleo.', 'if profuse vomiting/ileus.')}</li>
                    <li><strong>Monitor:</strong> ${t('Hipocalcemia (Tetania, Trousseau/Chvostek), Hiperglucemia.', 'Hypocalcemia (Tetany, Trousseau/Chvostek), Hyperglycemia.')}</li>
                    <li><strong>Nutrición:</strong> ${t('Enteral a Yeyuno (bypassear páncreas).', 'Enteral to Jejunum (bypass pancreas).')}</li>
                  </ol>
                </div>
              </div>
            </div>

            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                ${t('Cirrosis Hepática (Mnemotécnico: CHIPPER D)', 'Liver Cirrhosis (Mnemonic: CHIPPER D)')}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
                <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <strong class="text-red-600 block mb-1">C - Coagulopathy</strong>
                  <span class="text-gray-600 dark:text-gray-400">↓ Factors (INR ↑). Bleeding risk.</span>
                </div>
                <div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <strong class="text-orange-600 block mb-1">H - Hypoalbuminemia</strong>
                  <span class="text-gray-600 dark:text-gray-400">Ascitis, edema.</span>
                </div>
                <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <strong class="text-yellow-600 block mb-1">I - Icterus</strong>
                  <span class="text-gray-600 dark:text-gray-400">Jaundice, pruritus.</span>
                </div>
                <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <strong class="text-green-600 block mb-1">P - Portal HTN</strong>
                  <span class="text-gray-600 dark:text-gray-400">Esophageal varices, splenomegaly.</span>
                </div>
                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <strong class="text-blue-600 block mb-1">P - PSE (Encephalopathy)</strong>
                  <span class="text-gray-600 dark:text-gray-400">↑ Ammonia, confusion, asterixis.</span>
                </div>
                <div class="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <strong class="text-indigo-600 block mb-1">E - Erythema</strong>
                  <span class="text-gray-600 dark:text-gray-400">Palmar erythema, spider angiomas.</span>
                </div>
                <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <strong class="text-purple-600 block mb-1">R - Restrict Na+</strong>
                  <span class="text-gray-600 dark:text-gray-400">Manage ascites/fluid.</span>
                </div>
                <div class="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl md:col-span-2">
                  <strong class="text-pink-600 block mb-1">D - Diet Deficiencies</strong>
                  <span class="text-gray-600 dark:text-gray-400">↓ Vit A, D, E, K. Muscle wasting.</span>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <strong class="text-gray-700 dark:text-gray-300 block mb-2">
                   ${t('Manejo de Complicaciones:', 'Complication Management:')}
                </strong>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <strong class="text-red-600">Ascitis:</strong>
                    <ul class="list-disc list-inside">
                      <li>${t('Restricción Na+ y fluidos.', 'Restrict Na+ & Fluids.')}</li>
                      <li>Diuretics (Spironolactone + Furosemide).</li>
                      <li>Paracentesis + IV Albumin.</li>
                    </ul>
                  </div>
                  <div>
                    <strong class="text-red-600">Esophageal Varices:</strong>
                    <ul class="list-disc list-inside">
                      <li>Prevention: Non-selective BB (Propranolol).</li>
                      <li>Acute: Octreotide, Banding.</li>
                      <li><strong>NO</strong> Valsalva/Straining.</li>
                    </ul>
                  </div>
                  <div>
                    <strong class="text-red-600">Encephalopathy:</strong>
                    <ul class="list-disc list-inside">
                      <li><strong>Lactulosa:</strong> ${t('Atrapa NH3, meta: 2-3 deposiciones.', 'Traps NH3, goal: 2-3 soft stools.')}</li>
                      <li><strong>Rifaximin:</strong> ${t('Mata bacterias productoras de NH3.', 'Kills NH3-producing bacteria.')}</li>
                    </ul>
                  </div>
                  <div>
                    <strong class="text-red-600">Pruritus:</strong>
                    <ul class="list-disc list-inside">
                      <li>Cholestyramine (${t('Lejos de otros meds', 'Apart from other meds')}).</li>
                      <li>${t('Uñas cortas, compresas frías.', 'Short nails, cool compress.')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                 ${t('Otras Patologías Clave (NCLEX)', 'Other Key Pathologies (NCLEX)')}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                  <strong class="text-blue-800 dark:text-blue-300 block mb-1">Enfermedad Inflamatoria Intestinal (EII)</strong>
                  <div class="text-xs text-gray-600 dark:text-gray-400">
                    <p><strong>Crohn:</strong> ${t('Boca a ano, lesiones salteadas, fístulas.', 'Mouth to Anus, Skip lesions, Fistulas.')}</p>
                    <p><strong>Colitis (UC):</strong> ${t('Solo colon, continua, diarrea con sangre. Cura: Colectomía.', 'Colon only, Continuous, Bloody diarrhea. Cure: Colectomy.')}</p>
                  </div>
                </div>
                <div class="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl">
                  <strong class="text-green-800 dark:text-green-300 block mb-1">Úlcera Péptica (PUD)</strong>
                  <div class="text-xs text-gray-600 dark:text-gray-400">
                    <p><strong>Gastric:</strong> ${t('Dolor con comida (pérdida peso).', 'Pain with food (weight loss).')}</p>
                    <p><strong>Duodenal:</strong> ${t('Alivio con comida (dolor nocturno).', 'Relief with food (night pain).')}</p>
                    <p><strong>Causas:</strong> H. pylori, AINEs (NSAIDs).</p>
                  </div>
                </div>
                <div class="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                  <strong class="text-amber-800 dark:text-amber-300 block mb-1">ERGE / GERD</strong>
                  <div class="text-xs text-gray-600 dark:text-gray-400">
                    <p>Risk: Barrett's Esophagus (Cancer).</p>
                    <p>Tx: ${t('Elevar cabecera, no comer antes de dormir.', 'Elevate HOB, No eating before bed.')}</p>
                    <p>Avoid: Chocolate, Cafeína, Menta, Grasas.</p>
                  </div>
                </div>
                <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl">
                  <strong class="text-red-800 dark:text-red-300 block mb-1">Colecistitis</strong>
                  <div class="text-xs text-gray-600 dark:text-gray-400">
                    <p><strong>Murphy's Sign (+):</strong> ${t('Dolor inspiración profunda.', 'Pain deep inspiration.')}</p>
                    <p>Pain: RUQ $\rightarrow$ R shoulder. Trigger: Grasas.</p>
                  </div>
                </div>
                <div class="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                  <strong class="text-purple-800 dark:text-purple-300 block mb-1">Hepatitis Viral</strong>
                  <div class="text-xs text-gray-600 dark:text-gray-400">
                    <p><strong>A & E:</strong> Fecal-Oral ("Vowels from Bowels").</p>
                    <p><strong>B, C, D:</strong> Parenteral/Sexual (Blood/Body Fluids).</p>
                    <p><strong>C:</strong> ${t('Causa principal de trasplante/cáncer.', '#1 Cause of liver transplant/cancer.')}</p>
                  </div>
                </div>
                <div class="p-4 bg-cyan-50 dark:bg-cyan-900/10 rounded-xl">
                  <strong class="text-cyan-800 dark:text-cyan-300 block mb-1">Diverticulosis vs -itis</strong>
                  <div class="text-xs text-gray-600 dark:text-gray-400">
                    <p><strong>-osis:</strong> ${t('Fibra alta, fluidos.', 'High Fiber, Fluids.')}</p>
                    <p><strong>-itis:</strong> ${t('Líquidos claros/NPO, antibióticos. NO enemas.', 'Clear liquids/NPO, abx. NO enemas.')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-3xl border border-yellow-200 dark:border-yellow-800">
              <strong class="text-xl text-yellow-800 dark:text-yellow-300 block mb-4">
                 ${t('Pediatría GI (NCLEX High-Yield)', 'Pediatric GI (NCLEX High-Yield)')}
              </strong>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                 <div class="p-3 bg-white dark:bg-black/20 rounded-xl">
                    <strong class="text-gray-900 dark:text-white block">Pyloric Stenosis</strong>
                    <ul class="mt-1 list-disc list-inside text-gray-700 dark:text-gray-300 text-xs">
                       <li><strong>Olive-shaped mass</strong> (epigastric).</li>
                       <li><strong>Projectile vomiting</strong> (non-bilious).</li>
                       <li>Constant hunger.</li>
                    </ul>
                 </div>
                 <div class="p-3 bg-white dark:bg-black/20 rounded-xl">
                    <strong class="text-gray-900 dark:text-white block">Intussusception</strong>
                    <ul class="mt-1 list-disc list-inside text-gray-700 dark:text-gray-300 text-xs">
                       <li>Telescoping bowel.</li>
                       <li><strong>Sausage-shaped mass</strong> (RUQ).</li>
                       <li><strong>Currant jelly stool</strong> (mucus/blood).</li>
                       <li>Tx: Air enema.</li>
                    </ul>
                 </div>
                 <div class="p-3 bg-white dark:bg-black/20 rounded-xl">
                    <strong class="text-gray-900 dark:text-white block">Hirschsprung's</strong>
                    <ul class="mt-1 list-disc list-inside text-gray-700 dark:text-gray-300 text-xs">
                       <li>Aganglionic Megacolon.</li>
                       <li>No meconium > 24-48h.</li>
                       <li><strong>Ribbon-like stool</strong> (foul smelling).</li>
                    </ul>
                 </div>
              </div>
            </div>

          </div>
        </section>
      `;
    },

    // --- 3. Emergencies ---
    renderEmergencies() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Emergencias Gastrointestinales (Prioridad NCLEX)', 'Gastrointestinal Emergencies (NCLEX Priority)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="p-5 bg-white dark:bg-brand-card border-l-4 border-red-500 rounded-r-xl shadow-sm">
              <strong class="text-lg text-gray-900 dark:text-white">Apendicitis</strong>
              <p class="text-sm text-gray-600 dark:text-gray-400"><strong>Dolor:</strong> Periumbilical → RLQ (McBurney).</p>
              <ul class="text-sm text-gray-800 dark:text-gray-200 mt-2 space-y-1">
                 <li>• N/V, Anorexia.</li>
                 <li>• Psoas Sign / Obturator Sign (+).</li>
              </ul>
              <div class="mt-3 text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-2 rounded">
                 <strong>ALERTA:</strong> ${t('Alivio SÚBITO dolor = RUPTURA/PERFORACIÓN.', 'SUDDEN pain relief = RUPTURE/PERFORATION.')}
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2"><strong>NO</strong> aplicar calor, <strong>NO</strong> laxantes/enemas.</p>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card border-l-4 border-orange-500 rounded-r-xl shadow-sm">
              <strong class="text-lg text-gray-900 dark:text-white">Peritonitis</strong>
              <p class="text-sm text-gray-600 dark:text-gray-400">${t('Abdomen agudo/caliente.', 'Hot belly.')}</p>
              <ul class="text-sm font-bold text-gray-800 dark:text-gray-200 mt-2 space-y-1">
                 <li>• <strong>Rigidez / Abdomen en tabla</strong>.</li>
                 <li>• <strong>Dolor de Rebote (Rebound)</strong>.</li>
                 <li>• Fiebre, Taquicardia, Íleo.</li>
              </ul>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Tx: IV Fluids, Abx, NPO, Surgery.</p>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card border-l-4 border-blue-500 rounded-r-xl shadow-sm">
              <strong class="text-lg text-gray-900 dark:text-white">Obstrucción Intestinal</strong>
              <p class="text-sm text-gray-600 dark:text-gray-400">Mecánica vs Paralítica.</p>
              <ul class="text-sm text-gray-800 dark:text-gray-200 mt-2 space-y-1">
                 <li>• <strong>Sonidos Agudos (High pitched)</strong> (Temprano).</li>
                 <li>• <strong>Ausentes</strong> (Tardío/Paralítico).</li>
                 <li>• Vómito (olor fecaloide).</li>
              </ul>
              <div class="mt-3 text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-2 rounded">
                 <strong>Tx:</strong> NPO, NG Tube (decompression), IV Fluids.
              </div>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card border-l-4 border-green-500 rounded-r-xl shadow-sm">
              <strong class="text-lg text-gray-900 dark:text-white">Hemorragia Alta (Upper GI)</strong>
              <p class="text-sm text-gray-600 dark:text-gray-400">Proximal al lig. Treitz.</p>
              <ul class="text-sm text-gray-800 dark:text-gray-200 mt-2 space-y-1">
                 <li>• <strong>Hematemesis</strong> (Roja o "posos de café").</li>
                 <li>• <strong>Melena</strong> (Heces negras alquitranadas).</li>
                 <li>• Shock Hipovolémico.</li>
              </ul>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card border-l-4 border-purple-500 rounded-r-xl shadow-sm">
              <strong class="text-lg text-gray-900 dark:text-white">Hemorragia Baja (Lower GI)</strong>
              <p class="text-sm text-gray-600 dark:text-gray-400">Distal al lig. Treitz.</p>
              <ul class="text-sm text-gray-800 dark:text-gray-200 mt-2 space-y-1">
                 <li>• <strong>Hematoquecia/Rectorragia</strong> (Sangre roja brillante).</li>
                 <li>• Causa común: Diverticulosis, Pólipos.</li>
              </ul>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card border-l-4 border-rose-500 rounded-r-xl shadow-sm">
              <strong class="text-lg text-gray-900 dark:text-white">Isquemia Mesentérica</strong>
              <p class="text-sm text-gray-600 dark:text-gray-400"><strong>Dolor desproporcionado</strong> al examen.</p>
              <ul class="text-sm text-gray-800 dark:text-gray-200 mt-2 space-y-1">
                 <li>• Heces "Jalea de grosella" (Currant jelly).</li>
                 <li>• Alta mortalidad. Emergencia.</li>
              </ul>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card border-l-4 border-amber-500 rounded-r-xl shadow-sm lg:col-span-3">
              <strong class="text-lg text-gray-900 dark:text-white">Síndrome de Dumping (Post-Gastrectomía)</strong>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                   <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Vaciado gástrico rápido (30 min post-comida).</p>
                   <ul class="text-sm text-gray-800 dark:text-gray-200 space-y-1">
                     <li>• Vértigo, Taquicardia, Sudoración, Diarrea.</li>
                   </ul>
                </div>
                <div class="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 p-2 rounded">
                   <strong>Educación:</strong> ${t('Comidas pequeñas, Alta Proteína/Grasa, Bajo Carb. <strong>NO líquidos con comidas</strong>. Acostarse después de comer.', 'Small meals, High Protein/Fat, Low Carb. <strong>NO fluids w/ meals</strong>. Lie down after eating.')}
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Procedures & TPN ---
    renderProceduresAndTubes() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Procedimientos, Sondas y Nutrición', 'Procedures, Tubes & Nutrition')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="p-6 bg-slate-900 text-white rounded-3xl shadow-lg">
              <strong class="text-yellow-400 text-xl block mb-3">
                 ${t('Nutrición Parenteral Total (TPN)', 'Total Parenteral Nutrition (TPN)')}
              </strong>
              <ul class="space-y-3 text-sm text-gray-300">
                <li>• <strong>Route:</strong> ${t('SOLO Vía Central (PICC, Subclavia) - Hipertónico.', 'Central Line ONLY (PICC, Subclavian) - Hypertonic.')}</li>
                <li>• <strong>Asepsis:</strong> ${t('Estéril Quirúrgica.', 'Surgical Asepsis.')}</li>
                <li>• <strong>Monitoring:</strong>
                  <ul class="list-disc list-inside ml-4 mt-1">
                    <li>${t('Glucemia q6h (incluso sin diabetes).', 'Blood Glucose q6h (even non-diabetics).')}</li>
                    <li>Daily weights, I&O.</li>
                    <li>${t('Cambiar bolsa/tubo q24h.', 'Change tubing/bag q24h.')}</li>
                  </ul>
                </li>
                <li class="p-3 bg-red-900/50 border border-red-700 rounded text-red-200 font-bold">
                   <strong>EMERGENCY:</strong> ${t('Si TPN se acaba y no llega la nueva → <strong>Dextrosa 10% (D10W)</strong>. NUNCA parar de golpe (Hipoglucemia).', 'If TPN runs out → <strong>Dextrose 10% (D10W)</strong>. NEVER stop abruptly (Hypoglycemia).')}
                </li>
                <li><strong>Complications:</strong> Infection (CLABSI), Hyperglycemia, Fluid Overload, Refeeding Syndrome.</li>
              </ul>
            </div>

            <div class="space-y-6">
              <div class="p-6 bg-teal-50 dark:bg-teal-900/10 rounded-3xl border border-teal-200 dark:border-teal-800">
                <strong class="text-teal-800 dark:text-teal-300 text-lg block mb-3">NG Tube / Enteral Feeding</strong>
                <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li>• <strong>Placement Verification:</strong>
                    <ol class="list-decimal list-inside ml-4 mt-1">
                      <li><strong>X-Ray</strong> (Gold Standard).</li>
                      <li><strong>pH Aspiration</strong> (< 5.5).</li>
                      <li>${t('NUNCA solo auscultar aire.', 'NEVER rely on air bolus auscultation.')}</li>
                    </ol>
                  </li>
                  <li>• <strong>Residual Volume (GRV):</strong>
                    <ul class="list-disc list-inside ml-4 mt-1">
                      <li>Check q4h. If > 500mL → Hold feed + Provider.</li>
                      <li>${t('Retornar aspirado (prevenir desbalance).', 'Return aspirate (prevent imbalance).')}</li>
                    </ul>
                  </li>
                  <li>• <strong>Aspiration Precautions:</strong> ${t('Cabecera > 30-45° siempre.', 'HOB > 30-45° always.')}</li>
                </ul>
              </div>

              <div class="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-200 dark:border-amber-800">
                <strong class="text-amber-800 dark:text-amber-300 text-lg block mb-3">Ostomy Care (Stoma)</strong>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong class="text-amber-700 dark:text-amber-400">Stoma Appearance</strong>
                    <ul class="mt-1 space-y-1 text-gray-700 dark:text-gray-300">
                      <li class="text-green-600 font-bold">Pink / Red / Moist.</li>
                      <li class="text-red-600 font-bold">Pale / Purple / Black (Ischemia).</li>
                      <li>${t('Reportar cambios drásticos.', 'Report distinct changes.')}</li>
                    </ul>
                  </div>
                  <div>
                    <strong class="text-amber-700 dark:text-amber-400">Stool Characteristics</strong>
                    <ul class="mt-1 space-y-1 text-gray-700 dark:text-gray-300">
                      <li><strong>Ileostomy:</strong> Liquid (RLQ). Risk: Dehydration.</li>
                      <li><strong>Colostomy:</strong> Formed (LLQ). Irrigation possible.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 5. Pharmacology ---
    renderPharmacology() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-pink-600 flex items-center justify-center text-white font-black text-xl shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
               ${t('Farmacología Gastrointestinal (High-Yield)', 'Gastrointestinal Pharmacology (High-Yield)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
             <div class="p-4 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-200 dark:border-pink-800">
                <strong class="text-pink-700 dark:text-pink-300 block mb-1">PPIs (-prazole)</strong>
                <span class="text-gray-600 dark:text-gray-400">
                  ${t('Suprimen ácido. Tomar antes de comidas. Riesgo: Osteoporosis, C.Diff.', 'Suppress acid. Take before meals. Risk: Osteoporosis, C.Diff (Long term).')}
                </span>
             </div>
             <div class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
                <strong class="text-blue-700 dark:text-blue-300 block mb-1">H2 Blockers (-tidine)</strong>
                <span class="text-gray-600 dark:text-gray-400">
                   ${t('Reducen ácido. Famotidina. Con o sin comida.', 'Reduce acid. Famotidine. With/without meals.')}
                </span>
             </div>
             <div class="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800">
                <strong class="text-green-700 dark:text-green-300 block mb-1">Sucralfate</strong>
                <span class="text-gray-600 dark:text-gray-400">
                   ${t('"Mucosal Barrier". Estómago vacío (1h AC). NO con otros meds.', 'Mucosal Barrier. Empty stomach (1h ac). NO with other meds.')}
                </span>
             </div>
             <div class="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <strong class="text-yellow-700 dark:text-yellow-300 block mb-1">Misoprostol</strong>
                <span class="text-gray-600 dark:text-gray-400">
                   ${t('Protege estómago de AINEs. <strong>Cat X Embarazo</strong> (Abortivo).', 'Protects vs NSAIDs. <strong>Pregnancy Contraindication</strong> (Cat X).')}
                </span>
             </div>
             <div class="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
                <strong class="text-purple-700 dark:text-purple-300 block mb-1">Lactulosa</strong>
                <span class="text-gray-600 dark:text-gray-400">
                   ${t('Baja Amonio. Meta: 2-3 heces blandas. No parar por diarrea leve.', 'Lowers Ammonia. Goal: 2-3 soft stools. Don\'t stop for mild diarrhea.')}
                </span>
             </div>
             <div class="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <strong class="text-indigo-700 dark:text-indigo-300 block mb-1">Rifaximin</strong>
                <span class="text-gray-600 dark:text-gray-400">
                   ${t('Antibiótico no absorbible. Mata bacterias del amonio.', 'Non-absorbable abx. Kills ammonia bacteria.')}
                </span>
             </div>
             <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
                <strong class="text-red-700 dark:text-red-300 block mb-1">Mesalamine (5-ASA)</strong>
                <span class="text-gray-600 dark:text-gray-400">
                   ${t('Antiinflamatorio para EII (Colitis). Nefrotóxico.', 'Anti-inflammatory for IBD (UC). Nephrotoxic.')}
                </span>
             </div>
             <div class="p-4 bg-cyan-50 dark:bg-cyan-900/10 rounded-xl border border-cyan-200 dark:border-cyan-800">
                <strong class="text-cyan-700 dark:text-cyan-300 block mb-1">Antiemetics</strong>
                <span class="text-gray-600 dark:text-gray-400">
                   Ondansetron (QT prolong). Metoclopramide (${t('Discinesia tardía', 'Tardive dyskinesia')}).
                </span>
             </div>
          </div>
        </section>
      `;
    },

    // --- 6. Diets ---
    renderDietAndNutrition() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-lime-600 flex items-center justify-center text-white font-black text-xl shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Dietas Terapéuticas (NCLEX)', 'Therapeutic Diets (NCLEX)')}
            </h2>
          </div>

          <div class="overflow-hidden rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
            <table class="w-full text-left text-sm" role="grid">
              <thead class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th class="p-4">${t('Condición / Objetivo', 'Condition / Goal')}</th>
                  <th class="p-4">${t('Dieta Específica', 'Specific Diet')}</th>
                  <th class="p-4">${t('Características Clave', 'Key Features')}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-brand-card">
                <tr>
                  <td class="p-4 font-bold text-gray-900 dark:text-white">Celiac Disease</td>
                  <td class="p-4"><strong class="text-red-500">Gluten Free</strong></td>
                  <td class="p-4 text-gray-700 dark:text-gray-400">
                    <strong class="text-red-600">NO B.R.O.W.</strong> (Barley, Rye, Oats, Wheat). <br>
                    <strong class="text-green-600">OK:</strong> Rice, Corn, Potatoes, Quinoa.
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-gray-900 dark:text-white">Dumping Syndrome</td>
                  <td class="p-4">High Fat/Protein, Low Carb</td>
                  <td class="p-4 text-gray-700 dark:text-gray-400">
                    ${t('Pequeñas y frecuentes. NO líquidos con comida. Acostarse después.', 'Small/freq meals. NO fluids w/ meals. Lie down after eating.')}
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-gray-900 dark:text-white">Pancreatitis (Chronic)</td>
                  <td class="p-4">Low Fat + Enzymes</td>
                  <td class="p-4 text-gray-700 dark:text-white">
                    ${t('Enzimas con TODAS las comidas. NO masticar, no mezclar en leche.', 'Enzymes with ALL meals. DO NOT chew, do not mix w/ milk.')}
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-gray-900 dark:text-white">GERD</td>
                  <td class="p-4">Low Fat, Non-Acidic</td>
                  <td class="p-4 text-gray-700 dark:text-gray-400">
                    ${t('Evitar: Menta, chocolate, cafeína, cítricos, picante. Cenar temprano.', 'Avoid: Mint, chocolate, caffeine, citrus, spicy. Early dinner.')}
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-gray-900 dark:text-white">Diverticulosis</td>
                  <td class="p-4">High Fiber + Fluids</td>
                  <td class="p-4 text-gray-700 dark:text-gray400">
                    ${t('Prevenir estreñimiento (Frutas, granos).', 'Prevent constipation (Fruits, grains).')}
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-gray-900 dark:text-white">Diverticulitis</td>
                  <td class="p-4">Clear Liquids → Low Fiber</td>
                  <td class="p-4 text-gray-700 dark:text-gray-400">
                    ${t('Descanso intestinal (Bowel rest).', 'Bowel rest during inflammation.')}
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-gray-900 dark:text-white">IBD (Flare up)</td>
                  <td class="p-4">Low Residue</td>
                  <td class="p-4 text-gray-700 dark:text-gray-400">
                    ${t('Bajo en fibra para disminuir heces/dolor.', 'Low fiber to decrease stool/pain.')}
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-gray-900 dark:text-white">Liver Disease (Ascites)</td>
                  <td class="p-4">Low Sodium</td>
                  <td class="p-4 text-gray-700 dark:text-gray-400">
                    <span class="lang-es">< 2g Na+. Restricción de líquidos si es severo.</span><span class="lang-en hidden-lang">< 2g Na+. Fluid restriction if severe.</span>
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-gray-900 dark:text-white">Hepatic Encephalopathy</td>
                  <td class="p-4">Protein Restriction (Modified)</td>
                  <td class="p-4 text-gray-700 dark:text-gray-400">
                    ${t('Solo si es severo. Preferir proteína vegetal.', 'Only if severe. Prefer plant protein.')}
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-gray-900 dark:text-white">Cholecystitis</td>
                  <td class="p-4">Low Fat</td>
                  <td class="p-4 text-gray-700 dark:text-gray-400">
                    ${t('Evitar fritos/grasas para prevenir cólico.', 'Avoid fried/fatty foods to prevent colic.')}
                  </td>
                </tr>
                <tr>
                  <td class="p-4 font-bold text-gray-900 dark:text-white">Short Bowel Syndrome</td>
                  <td class="p-4">High Calorie + MCT</td>
                  <td class="p-4 text-gray-700 dark:text-gray-400">
                    ${t('Triglicéridos cadena media, vit liposolubles.', 'MCT oil, fat-soluble vitamins.')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      `;
    }
  });
})();