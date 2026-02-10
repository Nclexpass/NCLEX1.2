/* ngn_engine.js — Motor Next Generation NCLEX (AUDITED, ENHANCED & CONNECTED) */

(function () {
  'use strict';

  // --- BASE DE DATOS DE CASOS NGN (CLINICALLY VERIFIED) ---
  const NGN_CASES = [
    // CASO 1: SEPSIS
    {
      id: 'sepsis',
      title: 'ER Admission - Altered Mental Status / Ingreso UR: Estado Mental Alterado',
      scenario: '78-year-old female client brought to ED by daughter due to confusion. / Cliente femenina de 78 años traída a UR por su hija debido a confusión.',
      tabs: {
        history: `
          <h4 class="font-bold mb-2 text-brand-blue">History of Present Illness / Historia de la Enfermedad Actual</h4>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <span class="lang-en hidden-lang">Client brought to ED by daughter. Daughter reports client has been "acting strange" for 2 days, is lethargic, and had a shaking episode (rigors) this morning. Daughter notes client has not been eating or drinking well.</span>
            <span class="lang-es">Cliente traída a UR por su hija. La hija reporta que la cliente ha estado "actuando extraño" por 2 días, está letárgica y tuvo un episodio de temblores (escalofríos) esta mañana. La hija nota que no ha estado comiendo ni bebiendo bien.</span>
          </p>
          <h4 class="font-bold mb-2 text-brand-blue">Past Medical History / Antecedentes Médicos</h4>
          <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Type 2 Diabetes Mellitus (A1C 7.2%) / Diabetes Mellitus Tipo 2</li>
            <li>Hypertension / Hipertensión</li>
            <li>Recurrent Urinary Tract Infections (last episode 3 months ago) / IVU Recurrentes (último hace 3 meses)</li>
            <li>Osteoarthritis / Osteoartritis</li>
          </ul>
        `,
        nurses_notes: `
          <div class="space-y-4 font-mono text-sm">
            <div class="border-l-4 border-brand-blue pl-4 py-1">
              <span class="text-xs font-bold text-gray-500 block mb-1">10:00 - Assessment / Evaluación</span>
              <p>
                <span class="lang-en hidden-lang">Client is drowsiness but arousable to tactile stimuli. Oriented to person only (baseline: oriented x4). Skin is flushed, hot, and dry. Mucous membranes are dry/tacky. Capillary refill > 3 seconds. Daughter states "her urine smells very strong and looks dark".</span>
                <span class="lang-es">Cliente somnolienta pero responde a estímulos táctiles. Orientada solo en persona (base: orientada x4). Piel enrojecida, caliente y seca. Membranas mucosas secas/pegajosas. Llenado capilar > 3 segundos. La hija dice "su orina huele muy fuerte y se ve oscura".</span>
              </p>
            </div>
            <div class="border-l-4 border-purple-500 pl-4 py-1">
              <span class="text-xs font-bold text-gray-500 block mb-1">10:15 - Interventions / Intervenciones</span>
              <p>
                <span class="lang-en hidden-lang">Two peripheral IVs established: 20G Right AC and 18G Left Forearm. Blood cultures x2 sets drawn (aerobic/anaerobic). Straight catheterization performed: 45mL of cloudy, foul-smelling, dark amber urine obtained.</span>
                <span class="lang-es">Dos vías IV periféricas establecidas: 20G en fosa antecubital derecha y 18G en antebrazo izquierdo. Hemocultivos x2 sets extraídos (aerobio/anaerobio). Cateterismo directo realizado: se obtuvieron 45mL de orina turbia, fétida y color ámbar oscuro.</span>
              </p>
            </div>
          </div>
        `,
        vitals: `
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-100 dark:bg-gray-800">
                <tr><th class="p-2">Parameter</th><th class="p-2">10:00 (Admission)</th><th class="p-2">Reference</th></tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                <tr><td class="p-2 font-medium">Temp</td><td class="p-2 text-red-600 font-bold">38.9°C (102°F)</td><td class="p-2 text-gray-500">36.5-37.5°C</td></tr>
                <tr><td class="p-2 font-medium">HR</td><td class="p-2 text-red-600 font-bold">112 bpm</td><td class="p-2 text-gray-500">60-100 bpm</td></tr>
                <tr><td class="p-2 font-medium">RR</td><td class="p-2 text-orange-500 font-bold">22 bpm</td><td class="p-2 text-gray-500">12-20 bpm</td></tr>
                <tr><td class="p-2 font-medium">BP</td><td class="p-2 text-red-600 font-bold">94/52 mmHg</td><td class="p-2 text-gray-500">120/80 mmHg</td></tr>
                <tr><td class="p-2 font-medium">O2 Sat</td><td class="p-2">95% RA</td><td class="p-2 text-gray-500">>95%</td></tr>
                <tr><td class="p-2 font-medium">Pain</td><td class="p-2">N/A (Confusion)</td><td class="p-2 text-gray-500">0-10</td></tr>
            </tbody>
          </table>
        `,
        labs: `
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-100 dark:bg-gray-800"><tr><th class="p-2">Test</th><th class="p-2">Result</th><th class="p-2">Normal Range</th></tr></thead>
            <tbody>
              <tr class="border-b dark:border-gray-700"><td class="p-2">WBC</td><td class="p-2 text-red-600 font-bold">24,500 /mm³</td><td class="p-2">4,500 - 11,000</td></tr>
              <tr class="border-b dark:border-gray-700"><td class="p-2">Neutrophils</td><td class="p-2 text-red-600 font-bold">88% (Left Shift)</td><td class="p-2">55 - 70%</td></tr>
              <tr class="border-b dark:border-gray-700"><td class="p-2">Lactate</td><td class="p-2 text-red-600 font-bold">4.2 mmol/L</td><td class="p-2">< 2.0</td></tr>
              <tr class="border-b dark:border-gray-700"><td class="p-2">Creatinine</td><td class="p-2 text-orange-500 font-bold">1.8 mg/dL</td><td class="p-2">0.6 - 1.2</td></tr>
              <tr class="border-b dark:border-gray-700"><td class="p-2">Glucose</td><td class="p-2 text-orange-500 font-bold">195 mg/dL</td><td class="p-2">70 - 100</td></tr>
              <tr class="border-b dark:border-gray-700"><td class="p-2">Urine WBC</td><td class="p-2 text-red-600 font-bold">>100 /hpf</td><td class="p-2">0 - 5</td></tr>
              <tr class="border-b dark:border-gray-700"><td class="p-2">Urine Nitrites</td><td class="p-2 text-red-600 font-bold">Positive</td><td class="p-2">Negative</td></tr>
            </tbody>
          </table>
        `
      },
      questions: [
        {
          step: 1,
          phase: 'Recognize Cues',
          type: 'highlight',
          prompt: 'Click to highlight the findings that are consistent with a diagnosis of Sepsis or Shock. / Haga clic para resaltar los hallazgos consistentes con un diagnóstico de Sepsis o Shock.',
          text: 'Client is [drowsy but arousable], oriented to [person only]. Skin [hot and dry]. BP [94/52], HR [112]. Urine [cloudy with foul odor]. Lactate [4.2 mmol/L].',
          correctPhrases: ['drowsy but arousable', 'person only', '94/52', '112', '4.2 mmol/L'],
          explanation: `
            <h5 class="font-bold text-green-600 mb-2">Clinical Rationale:</h5>
            <p><strong>Sepsis Cues (qSOFA criteria & Hypoperfusion):</strong></p>
            <ul class="list-disc pl-5 text-sm space-y-1 mt-1">
                <li><strong>Hypotension (94/52):</strong> Indicates vasodilation and early shock state (MAP ~66).</li>
                <li><strong>Tachycardia (112):</strong> Compensatory mechanism for low stroke volume.</li>
                <li><strong>Altered Mental Status:</strong> "Drowsy", "Person only" indicates poor cerebral perfusion.</li>
                <li><strong>Lactate 4.2:</strong> Critical finding indicating anaerobic metabolism and tissue hypoperfusion (Septic Shock territory).</li>
            </ul>
            <p class="mt-2 text-xs text-gray-500"><em>Note: "Hot/Dry skin" suggests fever/dehydration but is less specific for shock than the hemodynamic markers. "Cloudy urine" indicates the source (infection) but not the severity (sepsis).</em></p>
            <hr class="my-2 border-gray-200 dark:border-gray-700">
            <p class="lang-es text-sm"><strong>Racional Clínico (Español):</strong> Signos clave de Sepsis/Shock incluyen hipotensión (vasodilatación), taquicardia (compensación), estado mental alterado (mala perfusión cerebral) y lactato elevado (metabolismo anaeróbico). La orina turbia indica la fuente, no la severidad.</p>
          `
        },
        {
          step: 2,
          phase: 'Analyze Cues',
          type: 'matrix',
          prompt: 'For each finding below, specify if it is consistent with Sepsis, Dehydration, or Hypoglycemia. / Especifique si cada hallazgo es consistente con Sepsis, Deshidratación o Hipoglucemia.',
          options: [
            { text: 'Hypotension (BP 94/52)', sepsis: true, dehyd: true, hypo: false },
            { text: 'Leukocytosis (WBC 24.5k)', sepsis: true, dehyd: false, hypo: false }, // Infection specific
            { text: 'Hyperglycemia (195)', sepsis: true, dehyd: false, hypo: false }, // Stress response
            { text: 'Elevated Lactate (4.2)', sepsis: true, dehyd: true, hypo: false }, // Hypoperfusion
            { text: 'Confusion', sepsis: true, dehyd: true, hypo: true } // Non-specific
          ],
          columns: ['Sepsis', 'Dehydration', 'Hypoglycemia'],
          explanation: `
             <h5 class="font-bold text-green-600 mb-2">Analysis:</h5>
             <p class="text-sm">The clinical picture strongly points to <strong>Sepsis</strong>. While Dehydration shares some signs (hypotension, lactate, confusion), it does NOT cause massive leukocytosis (WBC 24k). Hypoglycemia is ruled out because the glucose is 195 (Hyperglycemia due to stress/cortisol).</p>
             <p class="lang-es text-sm mt-2"><strong>Análisis:</strong> El cuadro apunta fuertemente a <strong>Sepsis</strong>. La deshidratación no causa leucocitosis masiva. La hipoglucemia se descarta por la glucosa de 195 (respuesta al estrés).</p>
          `
        },
        {
          step: 3,
          phase: 'Prioritize Hypotheses',
          type: 'cloze',
          prompt: 'Complete the hypothesis statement. / Complete la declaración de hipótesis.',
          template: 'The client is most likely experiencing {0} leading to {1}. / El cliente probablemente está experimentando {0} llevando a {1}.',
          dropdowns: [
            { id: 0, options: ['Diabetic Ketoacidosis', 'Urosepsis', 'Ischemic Stroke'], correct: 'Urosepsis' },
            { id: 1, options: ['Septic Shock', 'Cardiogenic Shock', 'Fluid Overload'], correct: 'Septic Shock' }
          ],
          explanation: `
            <h5 class="font-bold text-green-600 mb-2">Priority Hypothesis:</h5>
            <p class="text-sm"><strong>Urosepsis -> Septic Shock</strong>. The source is urinary (Positive Nitrites/WBCs). The severity is Shock (Lactate > 4, Hypotension requiring fluids). DKA is unlikely (pH not provided but Glucose 195 is too low for typical DKA, and no ketones mentioned). Stroke is unlikely given the fever and generalized vs. focal deficits.</p>
            <p class="lang-es text-sm mt-2"><strong>Hipótesis Prioritaria:</strong> Urosepsis progresando a Shock Séptico. Fuente urinaria confirmada, severidad demostrada por lactato e hipotensión. DKA improbable (glucosa baja para DKA típica). ACV improbable (fiebre, sin focalidad).</p>
          `
        },
        {
          step: 4,
          phase: 'Generate Solutions',
          type: 'sata', 
          prompt: 'Which interventions are part of the "Hour-1 Sepsis Bundle"? Select all that apply. / ¿Qué intervenciones son parte del "Paquete de la Primera Hora de Sepsis"? Seleccione todas las que correspondan.',
          options: [
            { id: 'a', text: 'Measure Lactate Level / Medir nivel de Lactato', correct: true },
            { id: 'b', text: 'Obtain Blood Cultures before antibiotics / Obtener Hemocultivos antes de antibióticos', correct: true },
            { id: 'c', text: 'Administer Broad-Spectrum Antibiotics / Administrar Antibióticos de Amplio Espectro', correct: true },
            { id: 'd', text: 'Administer 30 mL/kg Crystalloid for hypotension or lactate ≥ 4 / Administrar 30 mL/kg de Cristaloide', correct: true },
            { id: 'e', text: 'Administer 1 ampule of D50W IV push / Administrar D50W IV', correct: false } // Glucose is high
          ],
          explanation: `
            <h5 class="font-bold text-green-600 mb-2">Surviving Sepsis Campaign (Hour-1 Bundle):</h5>
            <ul class="list-disc pl-5 text-sm">
                <li><strong>Measure Lactate:</strong> Essential to identify tissue hypoperfusion.</li>
                <li><strong>Cultures BEFORE Abx:</strong> To identify pathogen without sterilization interference.</li>
                <li><strong>Broad-Spectrum Abx:</strong> Mortality increases by 7.6% for every hour delay.</li>
                <li><strong>Fluids (30mL/kg):</strong> Critical for volume resuscitation in distributive shock.</li>
            </ul>
            <p class="text-xs mt-1 text-red-500">D50W is contraindicated as client is hyperglycemic (195 mg/dL).</p>
            <p class="lang-es text-sm mt-2"><strong>Bundle de Sepsis:</strong> Medir lactato, Cultivos ANTES de antibióticos, Antibióticos de amplio espectro inmediatos, Fluidos agresivos. D50W está contraindicado por hiperglucemia.</p>
          `
        },
        {
          step: 5,
          phase: 'Take Action',
          type: 'matrix-action', 
          prompt: 'Determine if the potential provider order is Indicated (Safe/Effective), Non-Essential, or Contraindicated (Harmful). / Determine si la orden es Indicada, No Esencial o Contraindicada.',
          options: [
            { text: '0.9% Normal Saline 2000 mL IV bolus', indicated: true, non: false, contra: false }, // ~30ml/kg for 70kg
            { text: 'Furosemide (Lasix) 40 mg IV Push', indicated: false, non: false, contra: true }, 
            { text: 'Vancomycin + Ceftriaxone IV', indicated: true, non: false, contra: false },
            { text: 'Strict Bedrest', indicated: true, non: false, contra: false } // Fall risk + Shock
          ],
          columns: ['Indicated', 'Non-Essential', 'Contraindicated'],
          explanation: `
            <h5 class="font-bold text-green-600 mb-2">Safety Check:</h5>
            <p class="text-sm mb-2"><strong>CONTRAINDICATED: Furosemide.</strong> The client is in septic shock (hypotension). Diuretics will deplete intravascular volume further, worsening perfusion and potentially causing cardiac arrest or renal failure.</p>
            <p class="text-sm"><strong>INDICATED:</strong> Fluids (Resuscitation), Antibiotics (Infection Control), Bedrest (Safety/Fall Risk due to confusion).</p>
            <p class="lang-es text-sm mt-2"><strong>Seguridad:</strong> Furosemida CONTRAINDICADA en shock (empeora hipoperfusión). Fluidos y Antibióticos son vitales.</p>
          `
        },
        {
          step: 6,
          phase: 'Evaluate Outcomes',
          type: 'cloze',
          prompt: 'Which findings indicate the client is responding to treatment? / ¿Qué hallazgos indican que el cliente responde al tratamiento?',
          template: 'The client is improving if MAP is > {0} and Lactate is {1}. / El cliente mejora si la PAM es > {0} y el Lactato está {1}.',
          dropdowns: [
            { id: 0, options: ['60 mmHg', '65 mmHg', '90 mmHg'], correct: '65 mmHg' },
            { id: 1, options: ['Trending down (< 2.0)', 'Trending up (> 4.0)', 'Stable at 4.0'], correct: 'Trending down (< 2.0)' }
          ],
          explanation: `
             <h5 class="font-bold text-green-600 mb-2">Evaluation Criteria:</h5>
             <p class="text-sm"><strong>MAP > 65 mmHg</strong> is the standard target to ensure organ perfusion (kidneys/brain). <strong>Lactate clearance</strong> (trending down below 2.0) indicates that anaerobic metabolism has resolved and tissues are receiving oxygen.</p>
             <p class="lang-es text-sm mt-2"><strong>Evaluación:</strong> PAM > 65 mmHg asegura perfusión de órganos. Aclaramiento de Lactato (< 2.0) indica resolución del metabolismo anaeróbico.</p>
          `
        }
      ]
    },

    // CASO 2: HEART FAILURE
    {
      id: 'heart_failure',
      title: 'Acute Decompensated Heart Failure / Falla Cardíaca Descompensada',
      scenario: '68-year-old male presenting to ED with severe shortness of breath. / Masculino de 68 años se presenta en UR con dificultad respiratoria severa.',
      tabs: {
        history: `
          <h4 class="font-bold mb-2 text-brand-blue">Medical History / Historia Médica</h4>
          <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Chronic Heart Failure (EF 35%) / Falla Cardíaca Crónica (FE 35%)</li>
            <li>Hypertension / Hipertensión</li>
            <li>Myocardial Infarction (2 years ago) / Infarto (hace 2 años)</li>
            <li>Non-compliant with medication / No cumple con medicación</li>
          </ul>
          <p class="mt-4 text-sm"><strong>HPI:</strong> Client reports gaining 4 kg in the last 3 days. States "I feel like I'm drowning when I lie down". / Cliente reporta aumento de 4 kg en 3 días. Dice "Siento que me ahogo cuando me acuesto".</p>
        `,
        nurses_notes: `
          <div class="space-y-4 font-mono text-sm">
            <div class="border-l-4 border-red-500 pl-4 py-1">
              <span class="text-xs font-bold text-gray-500 block mb-1">08:00 - Admission Assessment</span>
              <p>
                <span class="lang-en hidden-lang">Client is anxious, sitting in tripod position. Jugular Vein Distension (JVD) present. Bilateral crackles auscultated in lower and middle lung lobes. +3 pitting edema in bilateral lower extremities. Coughing up pink, frothy sputum.</span>
                <span class="lang-es">Cliente ansioso, en posición de trípode. Ingurgitación Yugular (JVD) presente. Estertores (crackles) bilaterales en lóbulos medios e inferiores. Edema con fóvea +3 en extremidades inferiores. Tos con esputo rosado y espumoso.</span>
              </p>
            </div>
          </div>
        `,
        vitals: `
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-100 dark:bg-gray-800"><tr><th class="p-2">Param</th><th class="p-2">Value</th></tr></thead>
            <tbody>
                <tr><td class="p-2 font-bold">BP</td><td class="p-2 text-red-600 font-bold">168/94 mmHg</td></tr>
                <tr><td class="p-2 font-bold">HR</td><td class="p-2 text-orange-500">110 bpm</td></tr>
                <tr><td class="p-2 font-bold">RR</td><td class="p-2 text-red-600 font-bold">28 bpm (Labored)</td></tr>
                <tr><td class="p-2 font-bold">O2 Sat</td><td class="p-2 text-red-600 font-bold">86% on RA</td></tr>
            </tbody>
          </table>
        `,
        labs: `
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-100 dark:bg-gray-800"><tr><th class="p-2">Test</th><th class="p-2">Result</th><th class="p-2">Ref</th></tr></thead>
            <tbody>
              <tr><td class="p-2">BNP</td><td class="p-2 text-red-600 font-bold">1,250 pg/mL</td><td class="p-2">< 100</td></tr>
              <tr><td class="p-2">Potassium</td><td class="p-2 text-gray-700">4.5 mEq/L</td><td class="p-2">3.5 - 5.0</td></tr>
              <tr><td class="p-2">Sodium</td><td class="p-2 text-orange-500">131 mEq/L</td><td class="p-2">135 - 145</td></tr>
              <tr><td class="p-2">Creatinine</td><td class="p-2 text-orange-500">1.4 mg/dL</td><td class="p-2">0.6 - 1.2</td></tr>
            </tbody>
          </table>
        `
      },
      questions: [
        {
          step: 1,
          phase: 'Recognize Cues',
          type: 'highlight',
          prompt: 'Highlight findings requiring immediate intervention. / Resalte hallazgos que requieren intervención inmediata.',
          text: 'Client sitting in [tripod position]. [Jugular Vein Distension]. [Crackles] in lungs. O2 Sat [86%]. BNP [1,250 pg/mL]. Coughing up [pink, frothy sputum].',
          correctPhrases: ['tripod position', 'Crackles', '86%', '1,250 pg/mL', 'pink, frothy sputum'],
          explanation: `<p class="text-sm"><strong>Pulmonary Edema:</strong> Pink frothy sputum and O2 86% indicate fluid in alveoli. Crackles and BNP confirm Heart Failure exacerbation.</p>`
        },
        {
          step: 2,
          phase: 'Analyze Cues',
          type: 'matrix',
          prompt: 'Match findings to the likely condition. / Relacione los hallazgos con la condición probable.',
          options: [
            { text: 'Elevated BNP (>1000)', hf: true, pna: false, copd: false },
            { text: 'Pink Frothy Sputum', hf: true, pna: false, copd: false },
            { text: 'Fever / Purulent Sputum', hf: false, pna: true, copd: false },
            { text: 'Barrel Chest', hf: false, pna: false, copd: true }
          ],
          columns: ['Heart Failure', 'Pneumonia', 'COPD'],
          explanation: `<p class="text-sm">Elevated BNP and Pink Frothy Sputum are classic hallmarks of <strong>Left-Sided Heart Failure</strong> leading to pulmonary edema.</p>`
        },
        {
          step: 3,
          phase: 'Prioritize Hypotheses',
          type: 'cloze',
          // CORRECTION: Prompt updated to be an instruction, not a duplicate of the template
          prompt: 'Complete the statement regarding the client\'s condition. / Complete la declaración sobre la condición del cliente.',
          template: 'The client is experiencing {0} causing {1}.',
          dropdowns: [
             { id: 0, options: ['Right Sided HF', 'Left Sided HF', 'Renal Failure'], correct: 'Left Sided HF' },
             { id: 1, options: ['Pulmonary Edema', 'Systemic Edema', 'Ascites'], correct: 'Pulmonary Edema' }
          ],
          explanation: `<p class="text-sm"><strong>Left = Lungs.</strong> Failure of the left ventricle causes backup into pulmonary circulation (Crackles, O2 drop, Dyspnea).</p>`
        },
        {
          step: 4,
          phase: 'Generate Solutions',
          type: 'sata',
          prompt: 'Which orders do you anticipate? (Select All That Apply)',
          options: [
             { id: 'a', text: 'Administer Furosemide (Lasix) IV', correct: true },
             { id: 'b', text: 'Place client in High-Fowler’s position', correct: true },
             { id: 'c', text: 'Administer Oxygen via Non-Rebreather', correct: true },
             { id: 'd', text: 'Administer 0.9% Normal Saline Bolus', correct: false }, // CONTRAINDICATED
             { id: 'e', text: 'Insert Indwelling Urinary Catheter', correct: true } // Monitor output strictly
          ],
          explanation: `<p class="text-sm"><strong>Priority:</strong> Unload volume (Lasix), Improve breathing (High-Fowler's + O2). <strong>NEVER</strong> give fluids to a HF patient in overload.</p>`
        },
        {
          step: 5,
          phase: 'Take Action',
          type: 'matrix-action',
          prompt: 'Classify the actions.',
          options: [
            { text: 'IV Furosemide 40mg push', indicated: true, non: false, contra: false },
            { text: 'IV Morphine 2mg', indicated: true, non: false, contra: false }, // Reduces preload/anxiety
            { text: 'IV 0.9% NaCl 500ml Bolus', indicated: false, non: false, contra: true } // DANGER
          ],
          columns: ['Indicated', 'Non-Essential', 'Contraindicated'],
          explanation: `<p class="text-sm">Morphine is indicated in acute pulmonary edema to reduce anxiety and preload (vasodilation). Fluids are contraindicated.</p>`
        },
        {
          step: 6,
          phase: 'Evaluate Outcomes',
          type: 'cloze',
          prompt: 'Treatment is effective if...',
          template: 'Treatment is effective if urine output {0} and lung sounds {1}.',
          dropdowns: [
             { id: 0, options: ['decreases', 'increases'], correct: 'increases' },
             { id: 1, options: ['become clear', 'have more crackles'], correct: 'become clear' }
          ],
          explanation: `<p class="text-sm">Diuretics should increase urine output to remove fluid from lungs, clearing the crackles.</p>`
        }
      ]
    },

    // CASO 3: DKA
    {
      id: 'dka',
      title: 'Diabetic Ketoacidosis (DKA) / Cetoacidosis Diabética',
      scenario: '19-year-old female with Type 1 DM brought by friends due to confusion and vomiting. / Femenina de 19 años con DM Tipo 1 traída por confusión y vómitos.',
      tabs: {
        history: `
          <h4 class="font-bold mb-2 text-brand-blue">History / Historia</h4>
          <p class="text-gray-700 dark:text-gray-300">Client has Type 1 Diabetes since age 8. Friends report she "ran out of insulin pens" 2 days ago. Started vomiting yesterday. Complains of abdominal pain.</p>
        `,
        vitals: `
          <table class="w-full text-sm">
            <tr><td class="p-2 font-bold">BP</td><td class="p-2 text-red-600">92/58 mmHg</td></tr>
            <tr><td class="p-2 font-bold">HR</td><td class="p-2 text-red-600">124 bpm</td></tr>
            <tr><td class="p-2 font-bold">RR</td><td class="p-2 text-orange-500">28 bpm (Deep/Rapid)</td></tr>
            <tr><td class="p-2 font-bold">Temp</td><td class="p-2">37.1°C</td></tr>
          </table>
          <p class="mt-2 text-xs text-gray-500">Note: Strong fruity odor on breath.</p>
        `,
        labs: `
          <table class="w-full text-sm">
            <thead class="bg-gray-100 dark:bg-gray-800"><tr><th class="p-2">Test</th><th class="p-2">Result</th><th class="p-2">Ref</th></tr></thead>
            <tbody>
              <tr><td class="p-2">Glucose</td><td class="p-2 text-red-600 font-bold">580 mg/dL</td><td class="p-2">70-100</td></tr>
              <tr><td class="p-2">pH</td><td class="p-2 text-red-600 font-bold">7.12</td><td class="p-2">7.35-7.45</td></tr>
              <tr><td class="p-2">HCO3</td><td class="p-2 text-red-600 font-bold">10 mEq/L</td><td class="p-2">22-26</td></tr>
              <tr><td class="p-2">Potassium</td><td class="p-2 text-orange-500 font-bold">5.8 mEq/L</td><td class="p-2">3.5-5.0</td></tr>
              <tr><td class="p-2">Ketones</td><td class="p-2 text-red-600 font-bold">Large</td><td class="p-2">Negative</td></tr>
            </tbody>
          </table>
        `
      },
      questions: [
        {
          step: 1,
          phase: 'Recognize Cues',
          type: 'highlight',
          prompt: 'Highlight consistent signs of DKA.',
          text: 'Glucose [580 mg/dL]. pH [7.12]. [Kussmaul respirations]. [Fruity breath odor]. BP [92/58].',
          correctPhrases: ['580 mg/dL', '7.12', 'Kussmaul respirations', 'Fruity breath odor', '92/58'],
          explanation: `<p class="text-sm">Classic DKA triad: Hyperglycemia, Acidosis (pH < 7.35), Ketosis (Fruity breath).</p>`
        },
        {
          step: 2,
          phase: 'Analyze Cues',
          type: 'matrix',
          prompt: 'Distinguish DKA from HHS.',
          options: [
            { text: 'Positive Ketones', dka: true, hhs: false },
            { text: 'Metabolic Acidosis (pH < 7.35)', dka: true, hhs: false },
            { text: 'Glucose > 600 (often >800)', dka: false, hhs: true },
            { text: 'Rapid Onset', dka: true, hhs: false }
          ],
          columns: ['DKA', 'HHS'],
          explanation: `<p class="text-sm">DKA is characterized by Ketoacidosis and rapid onset. HHS usually has higher glucose but NO acidosis/ketones.</p>`
        },
        {
          step: 3,
          phase: 'Prioritize Hypotheses',
          type: 'cloze',
          prompt: 'The primary problem is...',
          template: 'The client has {0} leading to {1}.',
          dropdowns: [
             { id: 0, options: ['Insulin Deficiency', 'Insulin Resistance'], correct: 'Insulin Deficiency' },
             { id: 1, options: ['Metabolic Acidosis', 'Respiratory Acidosis'], correct: 'Metabolic Acidosis' }
          ],
          explanation: `<p class="text-sm">Lack of insulin causes breakdown of fats into ketones (acids), leading to metabolic acidosis.</p>`
        },
        {
          step: 4,
          phase: 'Generate Solutions',
          type: 'sata',
          prompt: 'Select appropriate interventions (SATA).',
          options: [
             { id: 'a', text: 'Start IV Normal Saline 0.9%', correct: true },
             { id: 'b', text: 'Start Regular Insulin IV drip', correct: true },
             { id: 'c', text: 'Administer subcutaneous Glargine', correct: false }, // Not for acute
             { id: 'd', text: 'Monitor Potassium levels closely', correct: true },
             { id: 'e', text: 'Administer Bicarbonate IV push', correct: false } // Only if pH < 6.9 usually
          ],
          explanation: `<p class="text-sm"><strong>Fluid First!</strong> Rehydrate (NS), then Insulin IV to lower sugar. Insulin drives Potassium into cells, so monitoring K+ is vital to prevent hypokalemia.</p>`
        },
        {
          step: 5,
          phase: 'Take Action',
          type: 'matrix-action',
          prompt: 'Order of Actions',
          options: [
            { text: 'Start 0.9% NS Bolus', indicated: true, non: false, contra: false },
            { text: 'Check K+ before starting Insulin', indicated: true, non: false, contra: false },
            { text: 'Give Insulin if K+ is < 3.3', indicated: false, non: false, contra: true } // FATAL
          ],
          columns: ['Critical/First', 'Routine', 'Contraindicated'],
          explanation: `<p class="text-sm"><strong>Safety Alert:</strong> If K+ is low (<3.3), do NOT start insulin yet (it will lower K+ further and stop the heart). Replete K+ first. Fluids are step 1.</p>`
        },
        {
          step: 6,
          phase: 'Evaluate Outcomes',
          type: 'cloze',
          prompt: 'DKA is resolving when...',
          template: 'Anion gap is {0} and pH is {1}.',
          dropdowns: [
             { id: 0, options: ['closed (<12)', 'open (>12)'], correct: 'closed (<12)' },
             { id: 1, options: ['> 7.30', '< 7.15'], correct: '> 7.30' }
          ],
          explanation: `<p class="text-sm">Resolution of DKA is defined by closure of the Anion Gap and normalization of pH, not just glucose levels.</p>`
        }
      ]
    }
  ];

  // --- ESTADO ---
  const state = {
    activeCase: null,
    currentStep: 0,
    currentTab: 'nurses_notes',
    userAnswers: {},
    scores: {}
  };

  // --- BRIDGE FUNCTION FOR LOGIC.JS ---
  // Esta función es la que llama logic.js para renderizar el caso
  window.renderNGNCase = function(caseId) {
      // Intentar encontrar el caso (fallback al primero si no existe el ID exacto)
      const targetCase = NGN_CASES.find(c => c.id === caseId) || NGN_CASES[0];
      
      // Inicializar estado interno del motor
      state.activeCase = targetCase;
      state.currentStep = 0;
      state.userAnswers = {};
      state.scores = {};
      state.currentTab = 'nurses_notes';

      // Retornar el HTML string para que logic.js lo inyecte
      return window.NGN_ENGINE.generateLayoutHTML();
  };

  // --- RENDERIZADOR ---
  window.NGN_ENGINE = {
    // Función interna que genera el string HTML completo
    generateLayoutHTML() {
      if (!state.activeCase) return '<div class="p-10 text-center">Case data missing</div>';

      const tabContent = state.activeCase.tabs[state.currentTab] || '';
      const tabsHTML = this.renderTabs();
      const phaseTitle = this.getPhaseTitle(state.currentStep);
      const questionHTML = this.renderQuestion();

      return `
        <div class="fixed inset-0 bg-gray-100 dark:bg-gray-900 z-40 flex flex-col md:flex-row h-screen overflow-hidden animate-fade-in">
          <div class="w-full md:w-1/2 flex flex-col border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-card">
             <div class="p-4 bg-brand-blue text-white shadow-md z-10 flex justify-between items-center">
                <div>
                    <h2 class="font-bold text-lg"><i class="fa-solid fa-file-medical mr-2"></i> Medical Record</h2>
                    <p class="text-[10px] uppercase tracking-wide opacity-90">NGN Case Study: ${state.activeCase.title}</p>
                </div>
                <div class="text-right hidden sm:block">
                    <span class="bg-white/20 px-2 py-1 rounded text-xs font-mono font-bold">${state.activeCase.id.toUpperCase()}</span>
                </div>
             </div>
             
             <div class="flex overflow-x-auto bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 scrollbar-hide shrink-0" id="ngn-tabs-container">
                ${tabsHTML}
             </div>
             
             <div id="chart-content" class="flex-1 overflow-y-auto p-6 prose dark:prose-invert max-w-none text-sm leading-relaxed custom-scrollbar">
                ${tabContent}
             </div>
          </div>

          <div class="w-full md:w-1/2 flex flex-col bg-gray-50 dark:bg-gray-900 relative">
             <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-brand-card shadow-sm z-10 shrink-0">
                <div>
                   <span class="text-[10px] font-black text-brand-blue uppercase tracking-widest block mb-1">Step ${state.currentStep + 1} / 6</span>
                   <h3 class="font-bold text-slate-800 dark:text-white text-sm md:text-base" id="phase-title">
                      ${phaseTitle}
                   </h3>
                </div>
                <button onclick="window.nclexApp.navigate('home')" class="text-gray-400 hover:text-red-500 text-xs font-bold border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-900/10">
                    <i class="fa-solid fa-right-from-bracket mr-1"></i> <span class="lang-es">SALIR</span><span class="lang-en hidden-lang">EXIT</span>
                </button>
             </div>

             <div id="ngn-question-area" class="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                ${questionHTML}
             </div>

             <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-card flex justify-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] shrink-0">
                <button onclick="window.NGN_ENGINE.submitStep()" class="bg-slate-900 dark:bg-brand-blue text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-blue-600 transition-all flex items-center gap-2 text-sm transform active:scale-95">
                   <span class="lang-es">Enviar Respuesta</span><span class="lang-en hidden-lang">Submit Answer</span> <i class="fa-solid fa-paper-plane"></i>
                </button>
             </div>
          </div>
        </div>

        <div id="rationale-modal" class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm hidden flex items-center justify-center p-4">
            <div class="bg-white dark:bg-brand-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-slide-in">
                <div class="bg-green-500 text-white p-4 font-bold flex justify-between items-center">
                    <span><i class="fa-solid fa-check-double mr-2"></i> <span class="lang-es">Respuesta Enviada</span><span class="lang-en hidden-lang">Answer Submitted</span></span>
                    <button onclick="window.NGN_ENGINE.nextStep()" class="hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="p-6 overflow-y-auto max-h-[60vh]">
                    <div id="rationale-content" class="prose dark:prose-invert max-w-none text-sm"></div>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-black/20 text-right border-t border-gray-100 dark:border-gray-700">
                    <button onclick="window.NGN_ENGINE.nextStep()" class="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold text-sm shadow hover:bg-blue-600 transition-colors">
                        <span class="lang-es">Siguiente Paso</span><span class="lang-en hidden-lang">Continue to Next Step</span> <i class="fa-solid fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
      `;
    },

    renderTabs() {
      const tabs = [
        { id: 'history', label: 'History & HPI' },
        { id: 'nurses_notes', label: 'Nurses Notes' },
        { id: 'vitals', label: 'Vital Signs' },
        { id: 'labs', label: 'Laboratory Results' }
      ];

      return tabs.map(t => {
        const active = state.currentTab === t.id 
            ? 'border-b-4 border-brand-blue text-brand-blue bg-white dark:bg-brand-card font-bold shadow-sm' 
            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 border-b-4 border-transparent';
        return `<button onclick="window.NGN_ENGINE.switchTab('${t.id}')" class="px-6 py-3 text-xs uppercase tracking-wide whitespace-nowrap transition-all ${active}">${t.label}</button>`;
      }).join('');
    },

    switchTab(tabId) {
      state.currentTab = tabId;
      const content = document.getElementById('chart-content');
      if (content) {
          content.innerHTML = state.activeCase.tabs[tabId];
          // Re-aplicar clases de idioma
          const currentLang = localStorage.getItem('nclex_lang') || 'es';
          const isEs = currentLang === 'es';
          content.querySelectorAll('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
          content.querySelectorAll('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      }
      // Actualizar visualmente los tabs
      const tabContainer = document.getElementById('ngn-tabs-container');
      if (tabContainer) tabContainer.innerHTML = this.renderTabs();
    },

    getPhaseTitle(step) {
      const q = state.activeCase.questions[step];
      return q ? `<i class="fa-solid fa-clipboard-check mr-2 text-brand-blue"></i>${q.phase}` : 'Clinical Judgment';
    },

    renderQuestion() {
      const q = state.activeCase.questions[state.currentStep];
      if (!q) return `<div class="text-center p-10"><i class="fa-solid fa-spinner animate-spin text-2xl"></i></div>`;

      let html = `<div class="mb-6 font-medium text-lg text-slate-900 dark:text-white leading-relaxed border-l-4 border-yellow-400 pl-4 py-1">${q.prompt}</div>`;

      // Dispatcher de Tipos de Pregunta
      if (q.type === 'highlight') {
        html += `<div class="p-6 bg-white dark:bg-brand-card rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 leading-loose text-base shadow-inner font-serif" id="highlight-text">`;
        const parts = q.text.split(/(\[.*?\])/g);
        html += parts.map((part, idx) => {
          if (part.startsWith('[') && part.endsWith(']')) {
            const cleanText = part.slice(1, -1);
            return `<span onclick="window.NGN_ENGINE.toggleHighlight(this)" class="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 px-1 rounded transition-colors border-b border-gray-300 border-dotted select-none font-medium text-brand-blue" data-text="${cleanText}">${cleanText}</span>`;
          }
          return part;
        }).join('');
        html += `</div>`;
      } 
      else if (q.type === 'matrix' || q.type === 'matrix-action') {
        html += `
          <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <table class="w-full text-sm text-left">
              <thead class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <tr>
                  <th class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50">Item</th>
                  ${q.columns.map(c => `<th class="px-6 py-4 text-center border-l border-gray-200 dark:border-gray-700">${c}</th>`).join('')}
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-brand-card divide-y divide-gray-100 dark:divide-gray-700">
                ${q.options.map((opt, idx) => `
                  <tr class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">${opt.text}</td>
                    ${q.columns.map((col, cIdx) => `
                      <td class="px-6 py-4 text-center border-l border-gray-100 dark:border-gray-700">
                        <input type="radio" name="matrix_row_${idx}" value="${cIdx}" class="w-5 h-5 text-brand-blue bg-gray-100 border-gray-300 focus:ring-brand-blue cursor-pointer transition-transform active:scale-90">
                      </td>
                    `).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
      else if (q.type === 'cloze') {
        let template = q.template;
        q.dropdowns.forEach(dd => {
            const selectHtml = `
              <select id="cloze_${dd.id}" class="inline-block mx-1 bg-white dark:bg-gray-800 border-2 border-brand-blue/30 rounded-lg px-3 py-1.5 text-sm font-bold text-brand-blue focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none shadow-sm cursor-pointer hover:border-brand-blue">
                 <option value="">Select Option...</option>
                 ${dd.options.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            `;
            // USAR REPLACEALL PARA MAYOR ROBUSTEZ
            template = template.replaceAll(`{${dd.id}}`, selectHtml);
        });
        html += `<div class="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-2xl text-lg leading-loose border border-blue-100 dark:border-blue-900/30 shadow-sm text-center">${template}</div>`;
      }
      else if (q.type === 'sata') {
        html += `<div class="space-y-3">
          ${q.options.map(opt => `
            <label class="flex items-start p-4 bg-white dark:bg-brand-card border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-white/5 transition-all shadow-sm hover:shadow-md group select-none">
              <div class="flex items-center h-5">
                <input type="checkbox" name="ngn_sata" value="${opt.id}" class="w-5 h-5 text-brand-blue rounded border-gray-300 focus:ring-brand-blue cursor-pointer">
              </div>
              <span class="ml-3 text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors font-medium">${opt.text}</span>
            </label>
          `).join('')}
        </div>`;
      }

      return html;
    },

    toggleHighlight(el) {
      if (el.classList.contains('bg-yellow-300')) {
        el.classList.remove('bg-yellow-300', 'text-black', 'shadow-sm', 'font-bold');
        el.classList.add('hover:bg-yellow-100', 'text-brand-blue');
      } else {
        el.classList.add('bg-yellow-300', 'text-black', 'shadow-sm', 'font-bold');
        el.classList.remove('hover:bg-yellow-100', 'text-brand-blue');
      }
    },

    submitStep() {
      const q = state.activeCase.questions[state.currentStep];
      let isStepComplete = false;
      
      // Validaciones básicas
      if (q.type === 'highlight') {
         const selected = document.querySelectorAll('#highlight-text .bg-yellow-300');
         if(selected.length > 0) isStepComplete = true;
      } else if (q.type.includes('matrix')) {
         const rows = q.options.length;
         let completedRows = 0;
         for(let i=0; i<rows; i++) {
             if(document.querySelector(`input[name="matrix_row_${i}"]:checked`)) completedRows++;
         }
         if(completedRows === rows) isStepComplete = true;
      } else if (q.type === 'cloze') {
         const selects = document.querySelectorAll('select');
         const filled = Array.from(selects).every(s => s.value !== "");
         if(filled) isStepComplete = true;
      } else if (q.type === 'sata') {
          if(document.querySelectorAll('input[name=ngn_sata]:checked').length > 0) isStepComplete = true;
      }

      if (!isStepComplete) {
        alert("Please complete the required actions before submitting.");
        return;
      }

      // Mostrar Racional
      this.showRationale(q);
    },

    showRationale(question) {
        const modal = document.getElementById('rationale-modal');
        const content = document.getElementById('rationale-content');
        if(modal && content) {
            content.innerHTML = question.explanation || '<p>No rationale available.</p>';
            modal.classList.remove('hidden');
            
            // Re-aplicar idioma en modal
            const currentLang = localStorage.getItem('nclex_lang') || 'es';
            const isEs = currentLang === 'es';
            content.querySelectorAll('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
            content.querySelectorAll('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));

        } else {
            // Fallback si algo falla
            this.nextStep();
        }
    },

    nextStep() {
        const modal = document.getElementById('rationale-modal');
        if(modal) modal.classList.add('hidden');

        state.currentStep++;
        
        if (state.currentStep < state.activeCase.questions.length) {
            // Actualizar vista de pregunta
            const area = document.getElementById('ngn-question-area');
            if (!area) return;

            area.style.opacity = '0';
            setTimeout(() => {
                // Update Layout for Next Question
                area.innerHTML = this.renderQuestion();
                
                const stepIndicator = document.querySelector('span.text-\\[10px\\]');
                if(stepIndicator) stepIndicator.innerText = `Step ${state.currentStep + 1} / 6`;
                
                const phaseTitle = document.getElementById('phase-title');
                if(phaseTitle) phaseTitle.innerHTML = this.getPhaseTitle(state.currentStep);
                
                area.style.opacity = '1';
                area.scrollTop = 0;
            }, 200);
        } else {
            this.finishCase();
        }
    },

    finishCase() {
      // Usar logic.js navigate o reemplazar el contenido manualmente
      const html = `
        <div class="max-w-2xl mx-auto py-20 text-center animate-fade-in px-4">
           <div class="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg ring-4 ring-green-50 dark:ring-green-900/20">
              <i class="fa-solid fa-flag-checkered"></i>
           </div>
           <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-2">
                <span class="lang-es">Caso de Estudio Completado</span><span class="lang-en hidden-lang">Case Study Completed</span>
           </h2>
           <p class="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                <span class="lang-es">Has navegado con éxito el Modelo de Juicio Clínico para</span>
                <span class="lang-en hidden-lang">You have successfully navigated the Clinical Judgment Model for</span>
                <strong>${state.activeCase.title}</strong>.
           </p>
           
           <div class="p-6 bg-white dark:bg-brand-card rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 text-left">
              <h3 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center"><i class="fa-solid fa-notes-medical mr-2 text-brand-blue"></i> 
                <span class="lang-es">Puntos Clave</span><span class="lang-en hidden-lang">Key Takeaways</span>:
              </h3>
              <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1 mr-2"></i> 
                    <span class="lang-es">Revisión completa de hallazgos clínicos.</span>
                    <span class="lang-en hidden-lang">Complete review of clinical findings.</span>
                  </li>
                  <li class="flex items-start"><i class="fa-solid fa-check text-green-500 mt-1 mr-2"></i> 
                    <span class="lang-es">Aplicación correcta de prioridades de seguridad.</span>
                    <span class="lang-en hidden-lang">Correct application of safety priorities.</span>
                  </li>
              </ul>
           </div>

           <button onclick="window.nclexApp.navigate('home')" class="bg-brand-blue text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-blue-600 hover:scale-105 transition-all w-full md:w-auto">
                <i class="fa-solid fa-house mr-2"></i> <span class="lang-es">Volver al Inicio</span><span class="lang-en hidden-lang">Return to Dashboard</span>
           </button>
        </div>
      `;
      
      const container = document.getElementById('app-view');
      if(container) {
          container.innerHTML = html;
          // Aplicar idioma
          const currentLang = localStorage.getItem('nclex_lang') || 'es';
          const isEs = currentLang === 'es';
          container.querySelectorAll('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
          container.querySelectorAll('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      }
    }
  };
})();
