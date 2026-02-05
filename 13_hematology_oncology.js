// 13_hematology_oncology.js — Hematology & Oncology Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: High-Yield Patho, Safety, Meds & Emergencies
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // Helper interno de traducción para mantener el código DRY (Don't Repeat Yourself)
  // Genera automáticamente los spans para el cambio de idioma.
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'hematology-oncology',
    title: { es: 'Hematología y Oncología', en: 'Hematology & Oncology' },
    subtitle: { es: 'Transfusiones, Cáncer y Seguridad', en: 'Transfusions, Cancer & Safety' },
    icon: 'droplet',
    color: 'rose',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-shield-heart"></i>
                ${t('Prioridad de Seguridad', 'Safety Priority')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Hematología y Oncología', 'Hematology & Oncology')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('Protocolos de Transfusión, Anemias, Cáncer y Emergencias.', 'Transfusion Protocols, Anemias, Cancer & Emergencies.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderTransfusionProtocol()}
          ${this.renderAnemias()} 
          ${this.renderSickleCell()}
          ${this.renderBleedingDisorders()}
          ${this.renderOncEmergencies()}
          ${this.renderPrecautions()}
          ${this.renderRadiationSafety()}
          ${this.renderPharmacology()}
          ${this.renderLabs()}
        </div>
      `;
    },

    // --- 1. Transfusion Protocol (Based on 7.2 detail + 8 structure) ---
    renderTransfusionProtocol() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white font-black text-xl shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Protocolo de Transfusión', 'Transfusion Protocol')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <strong class="text-xl text-gray-800 dark:text-white block mb-4 uppercase tracking-wide">
                <i class="fa-solid fa-clipboard-check text-yellow-500 mr-2"></i> 
                ${t('Verificación y Administración', 'Verification & Administration')}
              </strong>
              <ul class="space-y-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                <li class="flex gap-3"><i class="fa-solid fa-user-group text-rose-500 mt-1"></i> 
                  <span>
                    <strong>${t('Verificación Doble RN:', 'Double RN Verification:')}</strong>
                    ${t('2 enfermeras verifican ID, Tipo de Sangre (ABO/Rh), Expiración.', '2 Nurses verify ID, Blood Type (ABO/Rh), Expiration.')}
                  </span>
                </li>
                <li class="flex gap-3"><i class="fa-solid fa-droplet text-blue-500 mt-1"></i> 
                  <span>
                    <strong>${t('Solución:', 'Solution:')}</strong>
                    ${t('SOLO Salina Normal (0.9%). NUNCA Dextrosa (Hemólisis).', 'ONLY Normal Saline (0.9%). NEVER Dextrose (Hemolysis).')}
                  </span>
                </li>
                <li class="flex gap-3"><i class="fa-solid fa-syringe text-purple-500 mt-1"></i> 
                  <span>
                    <strong>${t('Acceso IV:', 'IV Access:')}</strong>
                    ${t('18G-20G (Evitar daño celular).', '18G-20G (Prevent cell damage).')}
                  </span>
                </li>
                <li class="flex gap-3"><i class="fa-solid fa-clock text-orange-500 mt-1"></i> 
                  <span>
                    <strong>${t('Primeros 15 Minutos:', 'First 15 Minutes:')}</strong>
                    ${t('RN permanece con paciente. Signos vitales al inicio, a los 15 min y al final.', 'RN stays with client. Vitals baseline, 15 mins, and end.')}
                  </span>
                </li>
                <li class="flex gap-3"><i class="fa-solid fa-hourglass-end text-green-500 mt-1"></i> 
                  <span>
                    <strong>${t('Tiempo Máximo:', 'Max Time:')}</strong>
                    ${t('4 horas máximo (Riesgo bacteriano).', '4 hours max (Bacterial risk).')}
                  </span>
                </li>
              </ul>
            </div>

            <div class="p-6 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800 shadow-xl relative">
               <div class="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase">Emergency</div>
               <h3 class="font-black text-xl text-red-800 dark:text-red-300 mb-2">
                 ${t('REACCIONES TRANSFUSIONALES', 'TRANSFUSION REACTIONS')}
               </h3>
               
               <div class="bg-white dark:bg-black/20 p-3 rounded-xl mb-4">
                 <strong class="block text-xs uppercase text-gray-500 mb-1">
                   ${t('Signos Clave (STOP IMMEDIATELY)', 'Key Signs (STOP IMMEDIATELY)')}
                 </strong>
                 <ul class="text-sm space-y-1 font-medium text-gray-800 dark:text-gray-200">
                   <li>• <span class="text-red-600 font-bold">Hemolítica (ABO):</span> ${t('Dolor lumbar, fiebre, orina oscura.', 'Flank/Back pain, fever, dark urine.')}</li>
                   <li>• <span class="text-orange-600 font-bold">Febril:</span> ${t('Fiebre >1°C, escalofríos.', 'Fever >1°C, chills.')}</li>
                   <li>• <span class="text-yellow-600 font-bold">Alérgica:</span> ${t('Urticaria, prurito.', 'Urticaria (hives), pruritus.')}</li>
                   <li>• <span class="text-blue-600 font-bold">TRALI:</span> ${t('Disnea aguda, edema pulmonar.', 'Acute dyspnea, pulm edema.')}</li>
                   <li>• <span class="text-purple-600 font-bold">TACO:</span> ${t('Sobrecarga, HTA, crepitantes.', 'Overload, HTN, crackles.')}</li>
                 </ul>
               </div>

               <div class="bg-red-100 dark:bg-red-900/40 p-4 rounded-xl border border-red-300 dark:border-red-700">
                 <strong class="block text-red-900 dark:text-red-100 uppercase text-xs mb-2 font-black">
                   ${t('Intervenciones RN (PRIORIDAD):', 'RN Interventions (PRIORITY):')}
                 </strong>
                 <ol class="list-decimal list-inside text-sm font-bold text-gray-900 dark:text-white space-y-1">
                   <li class="text-red-600 dark:text-red-400 uppercase">${t('DETENER la transfusión.', 'STOP the transfusion.')}</li>
                   <li>${t('Mantener IV con NS (NUEVA tubuladura).', 'Keep IV open with NS (NEW tubing).')}</li>
                   <li>${t('Notificar MD y Banco de Sangre.', 'Notify HCP and Blood Bank.')}</li>
                   <li>${t('Enviar bolsa/tubo/orina al lab.', 'Return bag/tubing, send urine.')}</li>
                 </ol>
               </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. Anemias (From 8.js - Integrated for completeness) ---
    renderAnemias() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              Anemias
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="p-5 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800">
                <strong class="text-orange-800 dark:text-orange-300 block mb-2 text-center text-lg">Iron Deficiency</strong>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                   <li><strong>${t('Tratamiento:', 'Treatment:')}</strong> ${t('Hierro Oral + <strong>Vitamina C</strong> (Jugo Naranja).', 'Oral Iron + <strong>Vitamin C</strong> (OJ).')}</li>
                   <li><strong>${t('Educación:', 'Teaching:')}</strong> ${t('No leche/antiácidos. Heces negras = Normal. Usar pajita (mancha dientes).', 'No milk/antacids. Black stools = Normal. Use straw (stains teeth).')}</li>
                </ul>
             </div>
             <div class="p-5 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800">
                <strong class="text-red-800 dark:text-red-300 block mb-2 text-center text-lg">Pernicious (B12)</strong>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                   <li><strong>${t('Causa:', 'Cause:')}</strong> ${t('Falta Factor Intrínseco (Estómago).', 'No Intrinsic Factor (Stomach).')}</li>
                   <li><strong>${t('Signos:', 'Signs:')}</strong> ${t('Lengua roja carnosa, Parestesias.', 'Beefy red tongue, Paresthesias.')}</li>
                   <li><strong>${t('Tx:', 'Tx:')}</strong> ${t('Inyecciones B12 IM de por vida.', 'Lifelong IM B12 injections.')}</li>
                </ul>
             </div>
          </div>
        </section>
      `;
    },

    // --- 3. Sickle Cell (High Yield - From 7.2) ---
    renderSickleCell() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Crisis de Células Falciformes', 'Sickle Cell Crisis')}
            </h2>
          </div>

          <div class="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-3xl border border-indigo-200 dark:border-indigo-800 shadow-lg">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 class="font-bold text-xl text-indigo-900 dark:text-indigo-200">
                ${t('Prioridad de Manejo: H.O.P.', 'Management Priority: H.O.P.')}
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
              <div class="bg-white dark:bg-brand-card p-4 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-800">
                <div class="w-10 h-10 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg mb-2"><i class="fa-solid fa-glass-water"></i></div>
                <strong class="text-lg block text-gray-900 dark:text-white">Hydration</strong>
                <p class="text-xs text-gray-500">${t('IV Fluids para diluir sangre.', 'IV Fluids to dilute blood.')}</p>
              </div>
              <div class="bg-white dark:bg-brand-card p-4 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-800">
                <div class="w-10 h-10 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-lg mb-2"><i class="fa-solid fa-lungs"></i></div>
                <strong class="text-lg block text-gray-900 dark:text-white">Oxygen</strong>
                <p class="text-xs text-gray-500">${t('Revertir hipoxia.', 'Reverse hypoxia.')}</p>
              </div>
              <div class="bg-white dark:bg-brand-card p-4 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-800">
                <div class="w-10 h-10 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-lg mb-2"><i class="fa-solid fa-pills"></i></div>
                <strong class="text-lg block text-gray-900 dark:text-white">Pain</strong>
                <p class="text-xs text-gray-500">${t('Opioides IV. NO Meperidina.', 'IV Opioids. NO Meperidine.')}</p>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div>
                  <strong class="text-red-600">${t('Desencadenantes:', 'Triggers:')}</strong>
                  <ul class="list-disc list-inside">
                    <li>${t('Deshidratación, Infección, Hipoxia, Frío.', 'Dehydration, Infection, Hypoxia, Cold.')}</li>
                  </ul>
                </div>
                <div>
                  <strong class="text-red-600">${t('Complicaciones:', 'Complications:')}</strong>
                  <ul class="list-disc list-inside">
                    <li>${t('ACV (Stroke), Síndrome Torácico Agudo, Secuestro Esplénico.', 'Stroke, Acute Chest Syndrome, Splenic Sequestration.')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Bleeding Disorders (From 8.js - Integrated) ---
    renderBleedingDisorders() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Trastornos de Coagulación', 'Bleeding Disorders')}
            </h2>
          </div>
          <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border-l-4 border-purple-500 shadow-sm">
             <strong class="text-purple-700 dark:text-purple-400 block text-lg mb-2">Hemophilia (A & B)</strong>
             <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                <li><strong>${t('Deficiencia:', 'Deficiency:')}</strong> ${t('Factor VIII o IX (Genético X-linked). PTT prolongado.', 'Factor VIII or IX (X-linked). Prolonged PTT.')}</li>
                <li><strong>${t('Riesgo:', 'Risk:')}</strong> ${t('Sangrado articular (Hemartrosis), craneal.', 'Joint bleed (Hemarthrosis), cranial.')}</li>
                <li><strong>${t('Tx:', 'Tx:')}</strong> ${t('Reemplazo de Factor IV. Hielo/Elevación en agudo.', 'IV Factor replacement. Ice/Elevate acute.')}</li>
             </ul>
          </div>
        </section>
      `;
    },

    // --- 5. Oncologic Emergencies (Detailed 6 items from 7.2) ---
    renderOncEmergencies() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Emergencias Oncológicas (6 CRÍTICAS)', 'Oncologic Emergencies (6 CRITICAL)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="p-5 bg-white dark:bg-brand-card rounded-3xl border border-amber-200 dark:border-amber-800 shadow-lg">
              <strong class="text-lg text-amber-600 dark:text-amber-400 block mb-2">1. Tumor Lysis Syndrome</strong>
              <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>Labs (CRUSH):</strong> <span class="text-red-500 font-bold">↑ K+</span>, <span class="text-red-500 font-bold">↑ Uric Acid</span>, <span class="text-red-500 font-bold">↑ PO4</span>, <span class="text-blue-500 font-bold">↓ Ca+</span>.</p>
                <p class="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2"><strong>Tx:</strong> ${t('Hidratación agresiva, Alopurinol.', 'Aggressive hydration, Allopurinol.')}</p>
              </div>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card rounded-3xl border border-red-200 dark:border-red-800 shadow-lg">
              <strong class="text-lg text-red-600 dark:text-red-400 block mb-2">2. SVC Syndrome</strong>
              <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p>${t('Tumor comprime Vena Cava Superior.', 'Tumor compresses Superior Vena Cava.')}</p>
                <p><strong>Signs (FACE):</strong> ${t('Edema facial (mañana), JVD, Disnea.', 'Facial edema (morning), JVD, Dyspnea.')}</p>
                <p class="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2"><strong>Tx:</strong> ${t('Fowler alto, Radiación.', 'High Fowler\'s, Radiation.')}</p>
              </div>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card rounded-3xl border border-blue-200 dark:border-blue-800 shadow-lg">
              <strong class="text-lg text-blue-600 dark:text-blue-400 block mb-2">3. SIADH</strong>
              <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p>${t('Exceso ADH (Cáncer Pulmón).', 'Excess ADH (Lung Cancer).')}</p>
                <p><strong>Labs:</strong> <span class="text-blue-500 font-bold">↓ Na+</span> (${t('Convulsiones', 'Seizures')}), ↑ Sp. Grav.</p>
                <p class="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2"><strong>Tx:</strong> ${t('Restricción líquidos, Salina 3%, Demeclociclina.', 'Fluid restriction, 3% Saline, Demeclocycline.')}</p>
              </div>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card rounded-3xl border border-purple-200 dark:border-purple-800 shadow-lg">
              <strong class="text-lg text-purple-600 dark:text-purple-400 block mb-2">4. Hypercalcemia</strong>
              <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p>${t('Metástasis óseas.', 'Bone metastasis.')}</p>
                <p><strong>Signs:</strong> ${t('Poliuria, debilidad muscular, confusión.', 'Polyuria, muscle weakness, confusion.')}</p>
                <p class="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2"><strong>Tx:</strong> ${t('Fluidos, Bifosfonatos.', 'Fluids, Bisphosphonates.')}</p>
              </div>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card rounded-3xl border border-rose-200 dark:border-rose-800 shadow-lg">
              <strong class="text-lg text-rose-600 dark:text-rose-400 block mb-2">5. Spinal Cord Compression</strong>
              <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>Signs:</strong> ${t('Dolor espalda severo, debilidad motora.', 'Severe back pain, motor weakness.')}</p>
                <p class="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2"><strong>Tx:</strong> ${t('Esteroides dosis alta, MRI STAT.', 'High-dose steroids, MRI STAT.')}</p>
              </div>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card rounded-3xl border border-cyan-200 dark:border-cyan-800 shadow-lg">
              <strong class="text-lg text-cyan-600 dark:text-cyan-400 block mb-2">6. Neutropenic Fever</strong>
              <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p class="text-red-600 font-bold">MEDICAL EMERGENCY</p>
                <p>${t('Temp >38°C + WBC Bajo.', 'Temp >38°C + Low WBC.')}</p>
                <p class="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2"><strong>Protocol:</strong> ${t('Antibióticos IV en < 1 HORA.', 'IV Abx within 1 HOUR.')}</p>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 6. Precautions (From 7.2 - Distinct Boxes) ---
    renderPrecautions() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Precauciones de Seguridad', 'Safety Precautions')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="border-2 border-orange-200 dark:border-orange-900 rounded-3xl overflow-hidden bg-orange-50 dark:bg-orange-900/10">
              <div class="bg-orange-100 dark:bg-orange-900/30 p-4 border-b border-orange-200 dark:border-orange-800">
                 <strong class="text-orange-800 dark:text-orange-200 uppercase block">Neutropenia (ANC &lt;1,000)</strong>
                 <span class="text-xs text-orange-600 dark:text-orange-300 font-bold">${t('Riesgo de Infección', 'Infection Risk')}</span>
              </div>
              <ul class="p-5 space-y-2 text-sm text-gray-800 dark:text-gray-200">
                <li><i class="fa-solid fa-ban text-red-500 mr-2"></i> ${t('NO Flores/Plantas frescas.', 'NO Fresh flowers/plants.')}</li>
                <li><i class="fa-solid fa-utensils text-red-500 mr-2"></i> ${t('NO Frutas/Vegetales crudos.', 'NO Raw fruits/veggies.')}</li>
                <li><i class="fa-solid fa-people-arrows text-blue-500 mr-2"></i> ${t('Evitar multitudes/enfermos.', 'Avoid crowds/sick people.')}</li>
                <li><i class="fa-solid fa-temperature-high text-red-500 mr-2"></i> <strong>Fever > 100.4°F (38°C) = EMERGENCY</strong></li>
              </ul>
            </div>

            <div class="border-2 border-red-200 dark:border-red-900 rounded-3xl overflow-hidden bg-red-50 dark:bg-red-900/10">
              <div class="bg-red-100 dark:bg-red-900/30 p-4 border-b border-red-200 dark:border-red-800">
                 <strong class="text-red-800 dark:text-red-200 uppercase block">Thrombocytopenia (Plt &lt;50k)</strong>
                 <span class="text-xs text-red-600 dark:text-red-300 font-bold">${t('Riesgo de Sangrado', 'Bleeding Risk')}</span>
              </div>
              <ul class="p-5 space-y-2 text-sm text-gray-800 dark:text-gray-200">
                <li><i class="fa-solid fa-tooth text-green-500 mr-2"></i> ${t('Cepillo suave, no hilo dental.', 'Soft toothbrush, no floss.')}</li>
                <li><i class="fa-solid fa-bolt text-green-500 mr-2"></i> ${t('Máquina de afeitar eléctrica.', 'Electric razor.')}</li>
                <li><i class="fa-solid fa-ban text-red-500 mr-2"></i> ${t('NO IM, NO rectales.', 'NO IM, NO rectal.')}</li>
                <li><i class="fa-solid fa-brain text-blue-500 mr-2"></i> ${t('Monitorear estado mental (Sangrado IC).', 'Monitor mental status (IC Bleed).')}</li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 7. Radiation (From 7.2) ---
    renderRadiationSafety() {
      return `
        <section>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div class="bg-slate-900 text-white p-6 rounded-3xl border border-gray-700 shadow-2xl">
              <h3 class="font-bold text-xl mb-4 flex items-center gap-2 text-yellow-400">
                <i class="fa-solid fa-radiation"></i> 
                ${t('Radiación Interna (Braquiterapia)', 'Internal Radiation (Brachytherapy)')}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <strong class="text-gray-400 text-xs uppercase block mb-2">Safety Rules (T.D.S.)</strong>
                  <ul class="space-y-2 text-sm">
                    <li><strong class="text-yellow-300">Time:</strong> ${t('Máx 30 min/turno.', 'Max 30 min/shift.')}</li>
                    <li><strong class="text-yellow-300">Distance:</strong> ${t('6 pies (2m).', '6 feet (2m).')}</li>
                    <li><strong class="text-yellow-300">Shielding:</strong> ${t('Plomo + Dosímetro.', 'Lead + Dosimeter.')}</li>
                    <li class="text-red-400 font-bold text-sm mt-2"><i class="fa-solid fa-ban"></i> ${t('NO embarazadas/niños.', 'NO pregnant/kids.')}</li>
                  </ul>
                </div>
                <div class="bg-white/10 p-4 rounded-xl border border-white/20">
                  <strong class="text-red-400 text-xs uppercase block mb-2">${t('Emergencia: Implante cae', 'Emergency: Implant dislodged')}</strong>
                  <ol class="space-y-1 text-sm list-decimal list-inside text-gray-300">
                    <li>${t('NO TOCAR con manos.', 'NO TOUCH with hands.')}</li>
                    <li>${t('Usar pinzas largas.', 'Use long forceps.')}</li>
                    <li>${t('Colocar en caja de plomo.', 'Place in lead container.')}</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div class="bg-slate-800 text-white p-6 rounded-3xl border border-gray-700 shadow-2xl">
              <h3 class="font-bold text-xl mb-4 flex items-center gap-2 text-blue-400">
                 <i class="fa-solid fa-x-ray"></i> ${t('Radiación Externa', 'External Radiation')}
              </h3>
              <ul class="space-y-2 text-sm">
                 <li><strong class="text-blue-300">Marks:</strong> ${t('NO borrar marcas en piel.', 'Do NOT wash off marks.')}</li>
                 <li><strong class="text-blue-300">Wash:</strong> ${t('Agua tibia, mano suave. NO frotar.', 'Warm water, gentle hand. NO rubbing.')}</li>
                 <li><strong class="text-blue-300">Avoid:</strong> ${t('Sol directo, lociones.', 'Direct sun, lotions.')}</li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 8. Pharmacology (Restored from 7.2 - Essential) ---
    renderPharmacology() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-lg">8</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Farmacología Clave', 'Key Pharmacology')}
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
             <div class="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <strong class="text-emerald-700 dark:text-emerald-300 block mb-1">Filgrastim</strong>
                <span class="text-xs text-gray-500 block mb-1">↑ WBC</span>
                <span class="text-gray-700 dark:text-gray-300">${t('Efecto: <strong>Dolor óseo</strong>.', 'Side effect: <strong>Bone pain</strong>.')}</span>
             </div>
             <div class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
                <strong class="text-blue-700 dark:text-blue-300 block mb-1">Epoetin Alfa</strong>
                <span class="text-xs text-gray-500 block mb-1">↑ RBC</span>
                <span class="text-gray-700 dark:text-gray-300">${t('Riesgo: <strong>Hipertensión</strong>.', 'Risk: <strong>Hypertension</strong>.')}</span>
             </div>
             <div class="p-4 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-200 dark:border-pink-800">
                <strong class="text-pink-700 dark:text-pink-300 block mb-1">Tamoxifen</strong>
                <span class="text-xs text-gray-500 block mb-1">Breast Ca</span>
                <span class="text-gray-700 dark:text-gray-300">${t('Riesgo: <strong>Cáncer Endometrial</strong> (sangrado).', 'Risk: <strong>Endometrial Ca</strong> (bleeding).')}</span>
             </div>
             <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
                <strong class="text-red-700 dark:text-red-300 block mb-1">Doxorrubicina</strong>
                <span class="text-xs text-gray-500 block mb-1">"Red Devil"</span>
                <span class="text-gray-700 dark:text-gray-300">${t('<strong>Cardiotoxicidad</strong> severa.', 'Severe <strong>Cardiotoxicity</strong>.')}</span>
             </div>
          </div>
        </section>
      `;
    },

    // --- 9. Labs (Merged 8.js Ranges + 7.2 Markers) ---
    renderLabs() {
      return `
        <section class="mt-8 mb-12">
            <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    ${t('Laboratorios Críticos', 'Critical Labs')}
                </h3>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                    <div class="p-3 bg-white dark:bg-black/30 rounded-xl shadow-sm">
                       <span class="block text-gray-500 text-xs">WBC</span>
                       <strong class="text-gray-900 dark:text-white text-xl">5-10</strong>
                       <div class="text-xs text-red-600 font-bold mt-1">Neutropenia &lt;1.0</div>
                    </div>
                    <div class="p-3 bg-white dark:bg-black/30 rounded-xl shadow-sm">
                       <span class="block text-gray-500 text-xs">Hgb</span>
                       <strong class="text-gray-900 dark:text-white text-xl">12-18</strong>
                       <div class="text-xs text-red-600 font-bold mt-1">Transfuse &lt;7</div>
                    </div>
                    <div class="p-3 bg-white dark:bg-black/30 rounded-xl shadow-sm">
                       <span class="block text-gray-500 text-xs">Platelets</span>
                       <strong class="text-gray-900 dark:text-white text-xl">150-400</strong>
                       <div class="text-xs text-red-600 font-bold mt-1">Bleeding &lt;20k</div>
                    </div>
                    <div class="p-3 bg-white dark:bg-black/30 rounded-xl shadow-sm">
                       <span class="block text-gray-500 text-xs">ANC</span>
                       <strong class="text-gray-900 dark:text-white text-xl">1.5-8.0</strong>
                       <div class="text-xs text-red-600 font-bold mt-1">Severe &lt;0.5</div>
                    </div>
                </div>

                <div class="bg-white dark:bg-black/30 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                   <strong class="text-gray-700 dark:text-gray-300 block mb-2 text-sm">${t('Marcadores Tumorales', 'Tumor Markers')}</strong>
                   <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-center">
                      <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <strong class="text-blue-700 dark:text-blue-300">PSA</strong><br>Prostate
                      </div>
                      <div class="p-2 bg-pink-50 dark:bg-pink-900/20 rounded">
                        <strong class="text-pink-700 dark:text-pink-300">CA-125</strong><br>Ovarian
                      </div>
                      <div class="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <strong class="text-green-700 dark:text-green-300">AFP</strong><br>Liver/Testicular
                      </div>
                      <div class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <strong class="text-purple-700 dark:text-purple-300">CEA</strong><br>Colon
                      </div>
                   </div>
                </div>
            </div>
        </section>
      `;
    }
  });
})();