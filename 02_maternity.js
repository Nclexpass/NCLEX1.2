// 02_maternity.js — OB/Maternity Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: Synthesized from MTER7.1, 7.2 & 8.
// Arquitectura optimizada con helpers (DRY) y contenido clínico completo.
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Dependencias: window.NCLEX.registerTopic

(function () {
  'use strict';

  // Helper interno de traducción para optimizar código (DRY Principle)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'maternity',
    title: { es: 'Maternidad (OB)', en: 'Maternity (OB)' },
    subtitle: { es: 'Embarazo, Parto y Emergencias', en: 'Pregnancy, Labor & Emergencies' },
    icon: 'person-pregnant',
    color: 'pink',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-heart-pulse"></i>
                ${t('Prioridad Nivel 1', 'Priority Level 1')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Enfermería Obstétrica', 'Maternity Nursing')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('Guía Clínica: Monitorización, Parto y Alto Riesgo.', 'Clinical Guide: Monitoring, Labor & High Risk.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderPrenatalCalc()}
          ${this.renderDiagnostics()}    
          ${this.renderPregnancyComp()}  
          ${this.renderTrueVsFalse()}
          ${this.renderLaborStages()}
          ${this.renderFHR()}
          ${this.renderEmergencies()}    
          ${this.renderPreeclampsia()}
          ${this.renderPostpartum()}
          ${this.renderMeds()}
          ${this.renderRh()}
          ${this.renderWarningSigns()}
        </div>
      `;
    },

    // --- 1. Prenatal Calculations & Assessment ---
    renderPrenatalCalc() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center text-white font-black text-lg shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Cálculos y Evaluación Prenatal', 'Prenatal Calculations & Assessment')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg relative overflow-hidden group">
              <div class="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-bl-full"></div>
              <h3 class="text-xl font-black text-pink-600 dark:text-pink-400 mb-4">Naegele's Rule (EDD)</h3>
              
              <div class="bg-pink-50 dark:bg-pink-900/10 p-5 rounded-xl border border-pink-100 dark:border-pink-800 mb-6 text-center">
                <p class="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider mb-2">Formula</p>
                <div class="flex flex-wrap items-center justify-center gap-2 font-mono text-xl font-black text-pink-600 dark:text-pink-400">
                  <span>(LMP - 3 Mo)</span>
                  <i class="fa-solid fa-plus text-sm text-gray-400"></i>
                  <span>7 Days</span>
                  <i class="fa-solid fa-plus text-sm text-gray-400"></i>
                  <span>1 Year</span>
                </div>
              </div>

              <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <p class="text-center font-bold text-gray-500 text-xs uppercase mb-2">NCLEX Example</p>
                <p class="text-lg font-medium text-gray-800 dark:text-gray-200 text-center">
                  LMP: Sep 10 <br>
                  <i class="fa-solid fa-arrow-down text-gray-400 my-1"></i><br>
                  ${t('Jun 10 <span class="text-pink-500 font-bold">(+7)</span> = <strong class="text-xl underline decoration-pink-500">Jun 17</strong>', 'Jun 10 <span class="text-pink-500 font-bold">(+7)</span> = <strong class="text-xl underline decoration-pink-500">Jun 17</strong>')}
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="text-xl font-black text-purple-600 dark:text-purple-400 mb-4">GTPAL Acronym</h3>
              <ul class="space-y-4 text-sm md:text-base text-gray-700 dark:text-gray-300">
                <li class="flex gap-3 items-center">
                    <span class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black flex-shrink-0">G</span> 
                    <span><strong>Gravida:</strong> ${t('Total de embarazos.', 'Total # Pregnancies.')}</span>
                </li>
                <li class="flex gap-3 items-center">
                    <span class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black flex-shrink-0">T</span> 
                    <span><strong>Term:</strong> ${t('Nacimientos > 37 semanas.', 'Births > 37 weeks.')}</span>
                </li>
                <li class="flex gap-3 items-center">
                    <span class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black flex-shrink-0">P</span> 
                    <span><strong>Preterm:</strong> ${t('Nacimientos 20 - 37 semanas.', 'Births 20 - 37 weeks.')}</span>
                </li>
                <li class="flex gap-3 items-center">
                    <span class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black flex-shrink-0">A</span> 
                    <span><strong>Abortions:</strong> ${t('Pérdidas < 20 semanas.', 'Losses < 20 weeks.')}</span>
                </li>
                <li class="flex gap-3 items-center">
                    <span class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black flex-shrink-0">L</span> 
                    <span><strong>Living:</strong> ${t('Niños vivos actualmente.', 'Children living now.')}</span>
                </li>
              </ul>
              <div class="mt-4 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                <strong class="text-sm text-purple-800 dark:text-purple-300">NCLEX Example:</strong>
                <p class="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  ${t('Mujer con 4 embarazos: 2 hijos a término, 1 hijo prematuro a las 32 semanas, 1 aborto espontáneo, y los 3 hijos viven.', 'Woman with 4 pregnancies: 2 term births, 1 preterm at 32 weeks, 1 miscarriage, and all 3 children are living.')}
                  <br><strong class="mt-1 inline-block">GTPAL: 4, 2, 1, 1, 3</strong>
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6 p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-200 dark:border-blue-800">
             <div class="flex items-center gap-3 mb-3">
               <i class="fa-solid fa-ruler-vertical text-blue-600 text-xl"></i>
               <h3 class="text-lg font-black text-blue-800 dark:text-blue-300">
                 ${t('Altura de Fondo Uterino (Regla de McDonald)', 'Fundal Height (McDonald\'s Rule)')}
               </h3>
             </div>
             <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div class="p-3 bg-white dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                   <strong class="block text-blue-600">12 Semanas</strong>
                   ${t('Sínfisis del pubis (apenas palpable).', 'Symphysis pubis (just palpable).')}
                </div>
                <div class="p-3 bg-white dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                   <strong class="block text-blue-600">20 Semanas</strong>
                   ${t('Nivel del ombligo.', 'Level of umbilicus.')}
                </div>
                <div class="p-3 bg-white dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                   <strong class="block text-blue-600">36 Semanas</strong>
                   ${t('Apófisis xifoides (máxima altura).', 'Xiphoid process (highest point).')}
                </div>
             </div>
             <p class="text-xs text-blue-700 dark:text-blue-300 mt-2 italic">
               ${t('Nota: Entre semanas 20-32, la altura en cm = semanas de gestación (±2cm).', 'Note: Between weeks 20-32, height in cm = weeks of gestation (±2cm).')}
             </p>
          </div>
        </section>
      `;
    },

    // --- 2. Diagnostics ---
    renderDiagnostics() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Diagnóstico y Vejiga', 'Diagnostics & Bladder')}
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="p-5 rounded-2xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-200 dark:border-cyan-800">
              <h4 class="font-bold text-cyan-900 dark:text-cyan-200 mb-2 flex items-center gap-2"><i class="fa-solid fa-eye"></i> Ultrasound</h4>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                ${t('Vejiga: <strong class="text-cyan-600 bg-cyan-100 dark:bg-cyan-900/50 px-1 rounded">LLENA</strong>', 'Bladder: <strong class="text-cyan-600 bg-cyan-100 dark:bg-cyan-900/50 px-1 rounded">FULL</strong>')}
              </p>
              <p class="text-xs text-gray-500 mt-2 italic">${t('¿Por qué? Empuja el útero hacia arriba para mejor visualización.', 'Why? Pushes uterus up for better visualization.')}</p>
            </div>

            <div class="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800">
              <h4 class="font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2"><i class="fa-solid fa-syringe"></i> Amniocentesis</h4>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                ${t('Vejiga: <strong class="text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50 px-1 rounded">VACÍA</strong>', 'Bladder: <strong class="text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50 px-1 rounded">EMPTY</strong>')}
              </p>
              <p class="text-xs text-gray-500 mt-2 italic">${t('¿Por qué? Evita punción accidental de la vejiga.', 'Why? Avoid accidental bladder puncture.')}</p>
              <p class="text-[10px] mt-1 text-red-500 font-bold">${t('Riesgo: pérdida de líquido amniótico, infección, aborto.', 'Risk: amniotic fluid leak, infection, miscarriage.')}</p>
            </div>

            <div class="p-5 rounded-2xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800">
              <h4 class="font-bold text-purple-900 dark:text-purple-200 mb-2 flex items-center gap-2"><i class="fa-solid fa-heart-pulse"></i> Stress Tests</h4>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li class="flex items-center gap-2"><i class="fa-solid fa-check text-green-500"></i> <strong>NST Reactivo</strong> (${t('Bueno', 'Good')})</li>
                <li class="flex items-center gap-2"><i class="fa-solid fa-check text-green-500"></i> <strong>CST Negativo</strong> (${t('Bueno', 'Good')})</li>
              </ul>
              <p class="text-xs text-gray-500 mt-2">
                ${t('NST: 2 aceleraciones en 20 min. CST: No desaceleraciones tardías con contracciones.', 'NST: 2 accelerations in 20 min. CST: No late decels with contractions.')}
              </p>
            </div>
          </div>
        </section>
      `;
    },

    // --- 3. Complications ---
    renderPregnancyComp() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-lg shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Alto Riesgo', 'High Risk')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="text-lg font-black text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-cube-sugar"></i> ${t('Diabetes Gestacional', 'Gestational Diabetes')}
              </h3>
              <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li><strong class="text-gray-900 dark:text-white">${t('Prueba de tolerancia a la glucosa:', 'Glucose tolerance test:')}</strong> ${t('1h > 180 mg/dL, 3h con 2 valores elevados.', '1h > 180 mg/dL, 3h with 2 elevated values.')}</li>
                <li><strong class="text-gray-900 dark:text-white">${t('Necesidad de Insulina:', 'Insulin Needs:')}</strong> ${t('AUMENTA en el 2º/3º trimestre.', 'INCREASE in 2nd/3rd trimester.')}</li>
                <li>${t('<strong>Postparto:</strong> La insulina cae bruscamente; monitorizar glucosa.', '<strong>Postpartum:</strong> Insulin drops sharply; monitor glucose.')}</li>
                <li class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900">
                  ${t('<strong class="text-red-600">Riesgo Neonatal:</strong> Macrosomía (>4000g), hipoglucemia, ictericia, defectos cardíacos.', '<strong class="text-red-600">Neonatal Risk:</strong> Macrosomia (>4000g), hypoglycemia, jaundice, cardiac defects.')}
                </li>
              </ul>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="text-lg font-black text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-bacteria"></i> ${t('Infecciones', 'Infections')}
              </h3>
              <div class="space-y-3">
                <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <strong class="block text-gray-900 dark:text-white text-sm">GBS (Streptococo Grupo B)</strong>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    ${t('Test 35-37 sem. Si (+), antibióticos IV <strong>DURANTE</strong> el parto (Penicilina 5 millones UI, luego 2.5 millones UI q4h).', 'Test 35-37 wks. If (+), IV antibiotics <strong>DURING</strong> labor (Penicillin 5 million units, then 2.5 million units q4h).')}
                  </p>
                </div>
                <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <strong class="block text-gray-900 dark:text-white text-sm">TORCH (Infecciones Congénitas)</strong>
                  <ul class="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside ml-2 mt-1">
                    <li><strong>T</strong>: ${t('Toxoplasmosis', 'Toxoplasmosis')} (evitar gatos, carne cruda)</li>
                    <li><strong>O</strong>: ${t('Otras (sífilis, varicela-zóster, parvovirus B19)', 'Other (syphilis, varicella-zoster, parvovirus B19)')}</li>
                    <li><strong>R</strong>: ${t('Rubéola', 'Rubella')} (vacuna contraindicada en embarazo)</li>
                    <li><strong>C</strong>: ${t('Citomegalovirus (CMV)', 'Cytomegalovirus (CMV)')} (principal causa viral de discapacidad congénita)</li>
                    <li><strong>H</strong>: ${t('Herpes simplex', 'Herpes simplex')} (cesárea si lesiones activas al parto)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
                <h3 class="text-lg font-black text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                    <i class="fa-solid fa-person-pregnant"></i> ${t('Hyperemesis Gravidarum', 'Hyperemesis Gravidarum')}
                </h3>
                <div class="text-sm text-gray-700 dark:text-gray-300">
                    <p class="mb-2">${t('Vómitos severos persistentes más allá del 1er trimestre.', 'Severe persistent vomiting past 1st trimester.')}</p>
                    <div class="bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-lg border-l-4 border-indigo-500">
                        <strong class="block text-indigo-800 dark:text-indigo-300 text-xs uppercase mb-1">${t('Diferencia Clave (Key Difference)', 'Key Difference')}</strong>
                        <ul class="list-disc list-inside text-xs space-y-1">
                            <li>${t('Pérdida de peso > 5%', 'Weight loss > 5%')}</li>
                            <li>${t('Desequilibrio electrolítico (hipokalemia)', 'Electrolyte imbalance (hypokalemia)')}</li>
                            <li><strong>${t('Cetonuria (Starvation Ketosis)', 'Ketonuria (Starvation Ketosis)')}</strong></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-200 dark:border-red-800 shadow-lg">
                <h3 class="text-lg font-black text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                    <i class="fa-solid fa-triangle-exclamation"></i> ${t('Embarazo Ectópico', 'Ectopic Pregnancy')}
                </h3>
                <div class="text-sm text-gray-800 dark:text-gray-200">
                    <p class="mb-2">${t('Implantación fuera del útero (típicamente trompas).', 'Implantation outside uterus (typically tubes).')}</p>
                    <div class="bg-white dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800">
                        <strong class="text-red-600 block mb-1 text-xs uppercase">${t('Signos de Ruptura (Emergencia)', 'Rupture Signs (Emergency)')}</strong>
                        <ul class="list-disc list-inside text-xs space-y-1">
                             <li>${t('Dolor abdominal unilateral severo', 'Severe unilateral abdominal pain')}</li>
                             <li><strong>${t('Dolor referido en hombro', 'Referred shoulder pain')}</strong> <span class="text-gray-500">(phrenic nerve irritation)</span></li>
                             <li>${t('Shock (hipotensión, taquicardia)', 'Shock (hypotension, tachycardia)')}</li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Labor: True vs False ---
    renderTrueVsFalse() {
      return `
        <section>
           <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-lg">4</div>
             <h2 class="text-2xl font-black text-gray-900 dark:text-white">
               ${t('Parto: ¿Real o Falso?', 'Labor: True vs False?')}
             </h2>
           </div>
           
           <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="p-5 rounded-2xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <h4 class="font-black text-gray-500 uppercase text-sm mb-3">${t('Parto Falso (Braxton Hicks)', 'False Labor (Braxton Hicks)')}</h4>
              <ul class="text-sm space-y-3 text-gray-600 dark:text-gray-400">
                <li class="flex items-center gap-3"><i class="fa-solid fa-person-walking text-gray-400"></i> <span>${t('Mejora al caminar/cambiar posición.', 'Improves with walking/position change.')}</span></li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-ban text-red-500"></i> <strong class="text-red-500">${t('SIN cambio cervical progresivo.', 'NO progressive cervical change.')}</strong></li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-clock text-gray-400"></i> <span>${t('Contracciones irregulares, no aumentan en intensidad.', 'Irregular contractions, don\'t intensify.')}</span></li>
              </ul>
            </div>

            <div class="p-5 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
              <h4 class="font-black text-green-700 dark:text-green-400 uppercase text-sm mb-3">${t('Parto Real', 'True Labor')}</h4>
              <ul class="text-sm space-y-3 text-gray-800 dark:text-gray-200">
                <li class="flex items-center gap-3"><i class="fa-solid fa-person-walking text-green-500"></i> <span>${t('Empeora al caminar.', 'Worsens with walking.')}</span></li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-arrows-spin text-green-600"></i> <strong class="text-green-600">${t('DILATACIÓN y BORRAMIENTO progresivos.', 'Progressive DILATION & EFFACEMENT.')}</strong></li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-wave-square text-green-500"></i> <span>${t('Contracciones regulares, aumentan en frecuencia/intensidad.', 'Regular contractions, increase in frequency/intensity.')}</span></li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 5. Labor Stages ---
    renderLaborStages() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Etapas del Parto', 'Labor Stages')}
            </h2>
          </div>

          <div class="space-y-4">
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border-l-4 border-indigo-500 shadow-sm">
              <strong class="text-indigo-600 block text-lg">${t('Etapa 1: Dilatación (0-10 cm)', 'Stage 1: Dilation (0-10 cm)')}</strong>
              <div class="flex gap-2 mt-1 text-xs text-gray-500">
                  <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">${t('Latente (0-3 cm)', 'Latent (0-3 cm)')}</span>
                  <span class="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded font-bold text-indigo-700 dark:text-indigo-300">${t('Activa (4-7 cm)', 'Active (4-7 cm)')}</span>
                  <span class="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 rounded font-bold text-purple-700 dark:text-purple-300">${t('Transición (8-10 cm)', 'Transition (8-10 cm)')}</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                ${t('<strong>Transición:</strong> Contracciones cada 2-3 min, dura 60-90 seg. Náuseas, temblores, irritabilidad.', '<strong>Transition:</strong> Contractions q2-3 min, last 60-90 sec. Nausea, shaking, irritability.')}
              </p>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border-l-4 border-blue-500 shadow-sm">
              <strong class="text-blue-600 block text-lg">${t('Etapa 2: Expulsión', 'Stage 2: Delivery')}</strong>
              <p class="text-sm text-gray-600 dark:text-gray-400">${t('¡Pujar! El bebé nace. Duración: nulípara 1-2h, multípara 20-60 min.', 'Pushing! Baby comes out. Duration: nulliparous 1-2h, multiparous 20-60 min.')}</p>
              
              <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                 <strong class="text-xs uppercase text-blue-800 dark:text-blue-300 block mb-2">${t('Movimientos Cardinales (Memory Trick)', 'Cardinal Movements (Memory Trick)')}</strong>
                 <p class="text-xs font-mono text-blue-700 dark:text-blue-400 font-bold mb-1">"Every Darn Fool In Egypt Eats Raw Eggs"</p>
                 <ol class="text-xs text-gray-700 dark:text-gray-300 list-decimal list-inside grid grid-cols-2 gap-x-2">
                    <li>${t('Engagement (Encajamiento)', 'Engagement')}</li>
                    <li>${t('Descent (Descenso)', 'Descent')}</li>
                    <li>${t('Flexion (Flexión)', 'Flexion')}</li>
                    <li>${t('Internal Rotation (Rot. Int.)', 'Internal Rotation')}</li>
                    <li>${t('Extension (Extensión)', 'Extension')}</li>
                    <li>${t('Ext. Rotation (Restitución)', 'Ext. Rotation')}</li>
                    <li>${t('Expulsion (Expulsión)', 'Expulsion')}</li>
                 </ol>
              </div>
            </div>

            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border-l-4 border-amber-500 shadow-sm">
              <strong class="text-amber-600 block text-lg">${t('Etapa 3: Placenta', 'Stage 3: Placenta')}</strong>
              <p class="text-sm text-gray-600 dark:text-gray-400">${t('Alumbramiento de la placenta (5-30 min). <strong class="text-red-500">Verificar integridad (superficies materna/fetal).</strong>', 'Placenta delivery (5-30 min). <strong class="text-red-500">Check integrity (maternal/fetal surfaces).</strong>')}</p>
            </div>

             <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border-l-4 border-green-500 shadow-sm">
              <strong class="text-green-600 block text-lg">${t('Etapa 4: Recuperación', 'Stage 4: Recovery')}</strong>
              <p class="text-sm text-gray-600 dark:text-gray-400">${t('Primeras 2-4 horas. Monitorizar Sangrado (≤500 mL normal), Signos Vitales, Fondo Uterino.', 'First 2-4 hours. Monitor Bleeding (≤500 mL normal), Vitals, Fundus.')}</p>
            </div>
          </div>
        </section>
      `;
    },

    // --- 6. VEAL CHOP ---
    renderFHR() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white font-black text-lg shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Monitor Fetal (VEAL CHOP)', 'Fetal Monitor (VEAL CHOP)')}
            </h2>
          </div>

          <div class="overflow-x-auto mt-4">
            <table class="w-full text-sm text-left border-collapse bg-white dark:bg-brand-card rounded-2xl shadow overflow-hidden">
                <thead class="bg-slate-800 text-white text-xs uppercase">
                    <tr>
                        <th scope="col" class="px-4 py-3">${t('Patrón', 'Pattern')}</th>
                        <th scope="col" class="px-4 py-3">${t('Causa', 'Cause')}</th>
                        <th scope="col" class="px-4 py-3">${t('Acción', 'Action')}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr class="bg-amber-50 dark:bg-amber-900/10">
                        <td scope="row" class="px-4 py-3 font-bold text-amber-700 dark:text-amber-300">Variable</td>
                        <td class="px-4 py-3 text-amber-700 dark:text-amber-300">${t('Compresión Cordón', 'Cord Compression')}</td>
                        <td class="px-4 py-3 font-bold">${t('Mover a la Madre (posición lateral)', 'Move Mom (side-lying)')}</td>
                    </tr>
                    <tr class="bg-blue-50 dark:bg-blue-900/10">
                        <td scope="row" class="px-4 py-3 font-bold text-blue-700 dark:text-blue-300">Early</td>
                        <td class="px-4 py-3 text-blue-700 dark:text-blue-300">${t('Compresión Cabeza (normal)', 'Head Compression (normal)')}</td>
                        <td class="px-4 py-3">${t('Monitorizar (OK)', 'Monitor (OK)')}</td>
                    </tr>
                    <tr>
                        <td scope="row" class="px-4 py-3 font-bold text-green-600">Accelerations</td>
                        <td class="px-4 py-3 text-green-600">${t('Bienestar Fetal (reactive)', 'Fetal Well-being (reactive)')}</td>
                        <td class="px-4 py-3">${t('Sin acción (OK)', 'No Action (OK)')}</td>
                    </tr>
                    <tr class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
                        <td scope="row" class="px-4 py-3 font-bold text-red-600 dark:text-red-400">LATE</td>
                        <td class="px-4 py-3 text-red-600 dark:text-red-400">${t('Insuficiencia Placentaria (↓O2)', 'Placental Insufficiency (↓O2)')}</td>
                        <td class="px-4 py-3 font-bold text-red-600 dark:text-red-400 uppercase">LION + ${t('Parar Pitocina', 'Stop Pitocin')}</td>
                    </tr>
                </tbody>
            </table>
            <div class="bg-gray-100 dark:bg-gray-800 p-4 text-center text-sm text-gray-700 dark:text-gray-300">
                <strong class="text-red-600 dark:text-red-400">LION para Desaceleraciones Tardías:</strong><br>
                ${t('<strong>L</strong>ateral (posición), <strong>I</strong>V fluids, <strong>O</strong>xígeno (8-10 L/min), <strong>N</strong>otificar proveedor. Parar pitocina inmediatamente.', '<strong>L</strong>ateral position, <strong>I</strong>V fluids, <strong>O</strong>xygen (8-10 L/min), <strong>N</strong>otify provider. Stop pitocin immediately.')}
            </div>
          </div>
        </section>
      `;
    },

    // --- 7. Emergencies (Priority 1) ---
    renderEmergencies() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-lg">7</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Emergencias (Prioridad 1)', 'Emergencies (Priority 1)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-800" role="alert">
              <h3 class="text-xl font-black text-red-800 dark:text-red-200 mb-2">
                <i class="fa-solid fa-code-branch"></i> ${t('Prolapso de Cordón', 'Prolapsed Cord')}
              </h3>
              
              <ul class="space-y-3 text-sm md:text-base text-gray-900 dark:text-white mt-4">
                <li class="flex items-center gap-2">
                  <span class="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                  <strong>${t('Posición:', 'Position:')}</strong> ${t('Trendelenburg / Rodillas-Pecho (aliviar presión).', 'Trendelenburg / Knee-Chest (relieve pressure).')}
                </li>
                <li class="flex items-center gap-2">
                  <span class="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                  <strong>${t('Mano Estéril:', 'Sterile Hand:')}</strong> ${t('Empujar cabeza ARRIBA (no tocar cordón).', 'Push head UP (don\'t touch cord).')}
                </li>
                <li class="flex items-center gap-2">
                   <span class="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                   ${t('Mantener cordón húmedo con solución salina estéril (NO intentar reinsertar).', 'Keep cord moist with sterile saline (DO NOT reinsert).')}
                </li>
                <li class="flex items-center gap-2">
                   <span class="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
                   ${t('Cesárea de emergencia INMEDIATA.', 'Emergency C-section IMMEDIATELY.')}
                </li>
              </ul>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                  <div class="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800">
                    <strong class="block text-sm text-amber-900 dark:text-amber-200 mb-1">${t('Placenta Previa', 'Placenta Previa')}</strong>
                    <span class="text-xs font-bold bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-2 py-1 rounded">${t('SIN DOLOR, sangrado rojo brillante', 'PAINLESS, bright red bleeding')}</span>
                    <p class="text-[10px] mt-2 text-red-500 font-bold">${t('ABSOLUTAMENTE: NO Examen Vaginal', 'ABSOLUTELY: NO Vaginal Exam')}</p>
                    <p class="text-[10px] text-gray-500 mt-1">${t('Tratamiento: reposo, cesárea programada a las 36-37 semanas.', 'Treatment: bed rest, scheduled C-section at 36-37 weeks.')}</p>
                  </div>
                  <div class="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-600">
                    <strong class="block text-sm text-slate-900 dark:text-slate-200 mb-1">${t('Desprendimiento Prematuro', 'Abruptio Placentae')}</strong>
                    <span class="text-xs font-bold bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white px-2 py-1 rounded">${t('CON DOLOR intenso, útero rígido', 'PAINFUL, rigid uterus')}</span>
                    <p class="text-[10px] mt-2 text-red-500 font-bold">${t('Cesárea de Emergencia', 'Emergency C-Section')}</p>
                    <p class="text-[10px] text-gray-500 mt-1">${t('Sangrado oscuro/oculto, coagulopatía, shock.', 'Dark/concealed bleeding, coagulopathy, shock.')}</p>
                  </div>
              </div>
              <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700">
                <strong class="block text-sm text-gray-900 dark:text-white mb-1">${t('Embolia de Líquido Amniótico', 'Amniotic Fluid Embolism')}</strong>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  ${t('<strong>TRIADA CLÁSICA:</strong> Dificultad respiratoria aguda, hipotensión, coagulopatía (DIC). Mortalidad 60-80%.', '<strong>CLASSIC TRIAD:</strong> Acute respiratory distress, hypotension, coagulopathy (DIC). Mortality 60-80%.')}
                  <br>${t('Tratamiento: Soporte cardiorrespiratorio, transfusiones, parto inmediato.', 'Treatment: Cardiorespiratory support, transfusions, immediate delivery.')}
                </p>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 8. Preeclampsia & HELLP ---
    renderPreeclampsia() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">8</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Preeclampsia (Sulfato de Magnesio)', 'Preeclampsia (Mag Sulfate)')}
            </h2>
          </div>

          <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-3xl shadow-lg">
             <strong class="block text-xl mb-2">Sulfato de Magnesio</strong>
             <p class="mb-4 text-purple-100">
                ${t('<strong>Indicación:</strong> PREVENIR CONVULSIONES (eclampsia). <em>No para bajar la presión arterial.</em> Nivel terapéutico: 4-7 mg/dL.', '<strong>Indication:</strong> PREVENT SEIZURES (eclampsia). <em>Not for lowering BP.</em> Therapeutic level: 4-7 mg/dL.')}
             </p>
             
             <div class="bg-white/10 p-4 rounded-xl border border-white/20">
                <strong class="block mb-2 text-sm uppercase opacity-75">${t('Criterios Diagnóstico Preeclampsia', 'Preeclampsia Diagnostic Criteria')}</strong>
                <ul class="text-sm grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                   <li>• TA ≥140/90 después de 20 semanas</li>
                   <li>• Proteinuria ≥300 mg/24h o ratio ≥0.3</li>
                   <li>• ${t('Síntomas: cefalea, alteraciones visuales, dolor epigástrico', 'Symptoms: headache, visual changes, epigastric pain')}</li>
                </ul>

                <strong class="block mb-2 text-sm uppercase opacity-75 mt-3">${t('Signos de Toxicidad por Magnesio', 'Magnesium Toxicity Signs')}</strong>
                <ul class="grid grid-cols-2 gap-2 text-sm">
                   <li>${t('Reflejos osteotendinosos ausentes', 'Absent deep tendon reflexes')}</li>
                   <li>${t('Diuresis &lt; 30ml/hr', 'Urine output &lt; 30ml/hr')}</li>
                   <li>${t('FR &lt; 12 resp/min', 'RR &lt; 12 breaths/min')}</li>
                   <li>${t('Somnolencia extrema', 'Extreme drowsiness')}</li>
                </ul>
                <div class="mt-4 pt-3 border-t border-white/20">
                    <span class="text-xs uppercase opacity-75 mr-2">${t('Antídoto:', 'Antidote:')}</span>
                    <strong>Gluconato de Calcio 1g IV lento (10% 10 mL)</strong>
                </div>
             </div>
          </div>

          <div class="mt-4 p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-800">
            <h3 class="text-lg font-black text-red-800 dark:text-red-200 mb-3">HELLP Syndrome</h3>
            <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
              ${t('Complicación severa de preeclampsia. Diagnóstico:', 'Severe preeclampsia complication. Diagnosis:')}
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div class="p-3 bg-white dark:bg-red-900/20 rounded-lg">
                <strong class="text-red-600 block">H - Hemólisis</strong>
                <p class="text-xs mt-1">${t('LDH ↑, bilirrubina ↑, esquistocitos en frotis', 'LDH ↑, bilirubin ↑, schistocytes on smear')}</p>
              </div>
              <div class="p-3 bg-white dark:bg-red-900/20 rounded-lg">
                <strong class="text-red-600 block">EL - Enzimas hepáticas ↑</strong>
                <p class="text-xs mt-1">${t('ALT/AST > 70 U/L, dolor epigástrico/RUQ', 'ALT/AST > 70 U/L, epigastric/RUQ pain')}</p>
              </div>
              <div class="p-3 bg-white dark:bg-red-900/20 rounded-lg">
                <strong class="text-red-600 block">LP - Plaquetas bajas</strong>
                <p class="text-xs mt-1">${t('&lt;100,000/mm³, riesgo sangrado', '&lt;100,000/mm³, bleeding risk')}</p>
              </div>
            </div>
            <p class="text-xs font-bold text-red-600 mt-3">
              ${t('TRATAMIENTO: Parto inmediato (cesárea) + sulfato de magnesio.', 'TREATMENT: Immediate delivery (C-section) + magnesium sulfate.')}
            </p>
          </div>
        </section>
      `;
    },

    // --- 9. Postpartum ---
    renderPostpartum() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white font-black text-lg shadow-lg">9</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Postparto', 'Postpartum')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border shadow">
              <strong class="block text-teal-700 dark:text-teal-300 text-lg mb-2">${t('Fondo Uterino', 'Fundus')}</strong>
              <div class="space-y-3">
                  <div class="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                      <strong class="text-red-600 dark:text-red-400 text-sm block">${t('Blando (Boggy) - Atonía Uterina', 'Boggy - Uterine Atony')}</strong>
                      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        ${t('Causa #1 de hemorragia postparto. Masajear hasta que esté firme. Si persiste: oxitocina, metilergonovina (si no HTA), carboprost.', '#1 cause of postpartum hemorrhage. Massage until firm. If persists: oxytocin, methylergonovine (if no HTN), carboprost.')}
                      </p>
                  </div>
                   <div class="p-3 bg-teal-50 dark:bg-teal-900/10 rounded-lg">
                      <strong class="text-teal-600 dark:text-teal-400 text-sm block">${t('Desviado (Displaced)', 'Displaced')}</strong>
                      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        ${t('Vejiga llena → desvía útero a la derecha. Intervención: Miccionar o cateterizar.', 'Full bladder → displaces uterus to right. Intervention: Void or catheterize.')}
                      </p>
                  </div>
                  <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <strong class="text-gray-900 dark:text-white text-sm block">${t('Ubicación esperada:', 'Expected location:')}</strong>
                      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        ${t('• Inmediato: medio uterino<br>• Día 1: 1 cm sobre ombligo<br>• Desciende 1 cm/día<br>• Día 10: no palpable', '• Immediate: mid-uterus<br>• Day 1: 1 cm above umbilicus<br>• Descends 1 cm/day<br>• Day 10: non-palpable')}
                      </p>
                  </div>
              </div>
            </div>
            
            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border shadow">
              <strong class="block text-rose-700 dark:text-rose-300 text-lg mb-2">Loquios</strong>
              <div class="text-sm space-y-2 mb-3 text-gray-600 dark:text-gray-400 mt-2">
                  <div class="p-2 border-l-4 border-red-500 pl-2">
                    <strong class="text-red-500">Rubra</strong> (1-3 ${t('días', 'days')}) - ${t('Rojo brillante, coágulos pequeños OK', 'Bright red, small clots OK')}
                  </div>
                  <div class="p-2 border-l-4 border-pink-400 pl-2">
                    <strong class="text-pink-400">Serosa</strong> (4-10 ${t('días', 'days')}) - ${t('Rosa/marrón, más acuoso', 'Pink/brown, more watery')}
                  </div>
                  <div class="p-2 border-l-4 border-yellow-500 pl-2">
                    <strong class="text-yellow-500">Alba</strong> (11+ ${t('días', 'days')}) - ${t('Blanco/amarillo, cremoso', 'White/yellow, creamy')}
                  </div>
              </div>
              <div class="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-3 rounded text-xs font-bold text-center mb-3">
                  ${t('📢 ALERTA: 1 Toalla empapada/hora = Hemorragia Postparto (>500 mL pérdida)', '📢 ALERT: 1 Saturated pad/hour = Postpartum Hemorrhage (>500 mL loss)')}
              </div>
              <div class="p-2 bg-blue-50 dark:bg-blue-900/10 rounded">
                <strong class="text-sm text-blue-800 dark:text-blue-300">${t('Signos de Infección Puerperal:', 'Puerperal Infection Signs:')}</strong>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  ${t('Fiebre >38°C, loquios fétidos, dolor abdominal, taquicardia. Causa común: endometritis.', 'Fever >38°C, foul-smelling lochia, abdominal pain, tachycardia. Common cause: endometritis.')}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-200 dark:border-purple-800">
            <h4 class="font-bold text-purple-800 dark:text-purple-300 mb-2">${t('Salud Mental Postparto', 'Postpartum Mental Health')}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div class="p-2 bg-white dark:bg-purple-900/20 rounded">
                <strong class="text-blue-600">${t('Baby Blues (70-80%)', 'Baby Blues (70-80%)')}</strong>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  ${t('Días 3-10, llanto, irritabilidad. Autolimitado.', 'Days 3-10, crying, irritability. Self-limited.')}
                </p>
              </div>
              <div class="p-2 bg-white dark:bg-red-900/20 rounded">
                <strong class="text-red-600">${t('Depresión Postparto (10-15%)', 'Postpartum Depression (10-15%)')}</strong>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  ${t('Tristeza persistente >2 semanas, anhedonia, culpa.', 'Persistent sadness >2 weeks, anhedonia, guilt.')}
                </p>
              </div>
              <div class="p-2 bg-white dark:bg-orange-900/20 rounded md:col-span-2">
                <strong class="text-orange-600">${t('Psicosis Postparto (0.1-0.2%) - EMERGENCIA', 'Postpartum Psychosis (0.1-0.2%) - EMERGENCY')}</strong>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  ${t('Alucinaciones, delirios, pensamientos de dañar al bebé. Hospitalización inmediata.', 'Hallucinations, delusions, thoughts of harming baby. Immediate hospitalization.')}
                </p>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 10. Pharmacology ---
    renderMeds() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-lg">10</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Farmacología Obstétrica', 'Obstetric Pharmacology')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <div class="p-4 bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-emerald-500 rounded-r-xl">
                 <strong class="block text-emerald-800 dark:text-emerald-300">Oxitocina (Pitocina)</strong>
                 <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   ${t('Inducción/aumento contracciones uterinas. Efecto adverso: taquicardia fetal, hiponatremia por efecto antidiurético.', 'Induction/augmentation of labor. Adverse: fetal tachycardia, hyponatremia from ADH effect.')}
                 </p>
                 <span class="text-xs font-bold text-red-500 block mt-2">${t('📢 PARAR si Desaceleraciones Tardías', '📢 STOP if Late Decels')}</span>
             </div>
             <div class="p-4 bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 rounded-r-xl">
                 <strong class="block text-blue-800 dark:text-blue-300">Methylergonovine (Methergine)</strong>
                 <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   ${t('Contrae útero postparto. Contraindicado: HTA, preeclampsia, enfermedad vascular.', 'Contracts postpartum uterus. Contraindicated: HTN, preeclampsia, vascular disease.')}
                 </p>
                 <span class="text-xs font-bold text-red-500 block mt-2">${t('🚫 NO si Hipertensión', '🚫 NO if Hypertension')}</span>
             </div>
             <div class="p-4 bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 rounded-r-xl">
                 <strong class="block text-orange-800 dark:text-orange-300">Terbutalina</strong>
                 <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   ${t('Tocolítico β2-agonista para detener parto prematuro. Efectos: taquicardia (madre/feto), hiperglucemia, hipokalemia, edema pulmonar.', 'Tocolytic β2-agonist for preterm labor. Effects: tachycardia (mom/fetus), hyperglycemia, hypokalemia, pulmonary edema.')}
                 </p>
             </div>
             <div class="p-4 bg-purple-50 dark:bg-purple-900/10 border-l-4 border-purple-500 rounded-r-xl">
                 <strong class="block text-purple-800 dark:text-purple-300">Betametasona</strong>
                 <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   ${t('Maduración pulmonar fetal (24-34 semanas). 2 dosis IM a la madre 24h aparte. Efecto máximo a las 48h.', 'Fetal lung maturation (24-34 weeks). 2 IM doses to mother 24h apart. Peak effect at 48h.')}
                 </p>
                 <span class="text-xs font-bold text-green-600 block mt-2">${t('Reduce SDR neonatal 50%', 'Reduces neonatal RDS 50%')}</span>
             </div>
             
             <div class="p-4 bg-cyan-50 dark:bg-cyan-900/10 border-l-4 border-cyan-500 rounded-r-xl md:col-span-2 lg:col-span-1">
                 <strong class="block text-cyan-800 dark:text-cyan-300">${t('Anestesia Epidural', 'Epidural Anesthesia')}</strong>
                 <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   ${t('Bloqueo regional para dolor. Riesgo #1: <strong>Hipotensión</strong>.', 'Regional pain block. Risk #1: <strong>Hypotension</strong>.')}
                 </p>
                 <ul class="text-[10px] mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    <li><i class="fa-solid fa-check text-green-500"></i> ${t('<strong>Antes:</strong> Bolus IV 500-1000mL (Isotónico)', '<strong>Pre:</strong> IV Bolus 500-1000mL (Isotonic)')}</li>
                    <li><i class="fa-solid fa-eye text-blue-500"></i> ${t('<strong>Monitor:</strong> PA materna cada 5 min', '<strong>Monitor:</strong> Maternal BP q5min')}</li>
                 </ul>
             </div>
          </div>
        </section>
      `;
    },

    // --- 11. Rh ---
    renderRh() {
      return `
        <section>
          <div class="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
             <h3 class="text-lg font-black text-gray-900 dark:text-white mb-3">
                <i class="fa-solid fa-droplet"></i> ${t('RhoGAM (Inmunoglobulina Rh)', 'RhoGAM (Rh Immune Globulin)')}
             </h3>
             <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                ${t('Solo si <strong class="text-red-500">la MAMÁ es Rh Negativo (-)</strong> y el <strong class="text-red-500">PADRE/BEBÉ es Rh Positivo (+)</strong>.', 'Only if <strong class="text-red-500">MOM is Rh Negative (-)</strong> and <strong class="text-red-500">FATHER/BABY is Rh Positive (+)</strong>.')}
             </p>
             <div class="flex flex-wrap gap-2 text-xs font-bold mb-4">
                <span class="bg-white dark:bg-black/20 px-3 py-1 rounded border border-gray-300 dark:border-gray-600">${t('28 Semanas (profilaxis prenatal)', '28 Weeks (prenatal prophylaxis)')}</span>
                <span class="bg-white dark:bg-black/20 px-3 py-1 rounded border border-gray-300 dark:border-gray-600">${t('72h Postparto (si bebé Rh+)', '72h Postpartum (if baby Rh+)')}</span>
                <span class="bg-white dark:bg-black/20 px-3 py-1 rounded border border-gray-300 dark:border-gray-600">${t('Trauma abdominal', 'Abdominal trauma')}</span>
                <span class="bg-white dark:bg-black/20 px-3 py-1 rounded border border-gray-300 dark:border-gray-600">${t('Aborto/embarazo ectópico', 'Miscarriage/ectopic')}</span>
                <span class="bg-white dark:bg-black/20 px-3 py-1 rounded border border-gray-300 dark:border-gray-600">${t('Amniocentesis/CVS', 'Amniocentesis/CVS')}</span>
             </div>
             <p class="text-xs text-gray-500">
                ${t('<strong>Mecanismo:</strong> Suprime la respuesta inmune materna a glóbulos Rh+ fetales, previniendo la formación de anticuerpos anti-D que podrían causar enfermedad hemolítica del recién nacido en futuros embarazos.', '<strong>Mechanism:</strong> Suppresses maternal immune response to fetal Rh+ RBCs, preventing anti-D antibody formation that could cause hemolytic disease of newborn in future pregnancies.')}
             </p>
          </div>
        </section>
      `;
    },

    // --- 12. Warning Signs ---
    renderWarningSigns() {
      return `
        <section>
          <div class="mt-8 mb-12 p-6 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-3xl shadow-2xl overflow-hidden relative">
            <h3 class="text-2xl font-black mb-6 text-center uppercase tracking-widest text-yellow-300">
              <i class="fa-solid fa-triangle-exclamation mr-2"></i>
              ${t('Signos de Alarma en Embarazo', 'Pregnancy Warning Signs')}
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center relative z-10">
              <div class="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                <i class="fa-solid fa-tint text-3xl mb-3 text-red-300"></i>
                <strong class="block mb-2">Sangrado Vaginal</strong>
                <p class="text-sm text-white/90">
                  ${t('Cualquier sangrado después de 20 semanas = URGENTE. Primer trimestre: evaluar embarazo ectópico/aborto.', 'Any bleeding after 20 weeks = URGENT. First trimester: evaluate ectopic/miscarriage.')}
                </p>
              </div>
              <div class="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                <i class="fa-solid fa-head-side-virus text-3xl mb-3 text-red-300"></i>
                <strong class="block mb-2">Cefalea Severa</strong>
                <p class="text-sm text-white/90">
                  ${t('Con alteraciones visuales (fotopsias, escotomas) = Preeclampsia/eclampsia.', 'With visual changes (photopsia, scotoma) = Preeclampsia/eclampsia.')}
                </p>
              </div>
              <div class="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                <i class="fa-solid fa-baby text-3xl mb-3 text-red-300"></i>
                <strong class="block mb-2">Disminución Movimientos Fetales</strong>
                <p class="text-sm text-white/90">
                  ${t('Menos de 10 movimientos en 2h después de 28 semanas = Evaluación fetal inmediata.', 'Fewer than 10 movements in 2h after 28 weeks = Immediate fetal evaluation.')}
                </p>
              </div>
              <div class="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                <i class="fa-solid fa-lungs text-3xl mb-3 text-red-300"></i>
                <strong class="block mb-2">Dificultad Respiratoria</strong>
                <p class="text-sm text-white/90">
                  ${t('Repentina con dolor torácico = Embolia pulmonar/líquido amniótico.', 'Sudden with chest pain = Pulmonary embolism/amniotic fluid embolism.')}
                </p>
              </div>
              <div class="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                <i class="fa-solid fa-temperature-high text-3xl mb-3 text-red-300"></i>
                <strong class="block mb-2">Fiebre >38°C</strong>
                <p class="text-sm text-white/90">
                  ${t('Con dolor abdominal = Corioamnionitis (infección intraamniótica).', 'With abdominal pain = Chorioamnionitis (intra-amniotic infection).')}
                </p>
              </div>
              <div class="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                <i class="fa-solid fa-exclamation-triangle text-3xl mb-3 text-yellow-300"></i>
                <strong class="block mb-2">Dolor Epigástrico/RUQ</strong>
                <p class="text-sm text-white/90">
                  ${t('Con náuseas/vómitos = HELLP syndrome (preeclampsia severa).', 'With nausea/vomiting = HELLP syndrome (severe preeclampsia).')}
                </p>
              </div>
            </div>
            <div class="text-center mt-6 text-sm text-white/80">
              ${t('<strong>ENFERMERÍA:</strong> Estos signos requieren evaluación INMEDIATA. No subestimar.', '<strong>NURSING:</strong> These signs require IMMEDIATE evaluation. Do not underestimate.')}
            </div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-500/10 blur-3xl pointer-events-none"></div>
          </div>
        </section>
      `;
    }
  });
})();