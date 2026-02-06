// 01_newborn.js — Newborn Masterclass NCLEX
// Módulo de Contenido: Evaluación Neonatal y Seguridad
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// VERSIÓN MASTER: Combina profundidad académica (BOR6) con optimización de código (BORN8)
// Dependencias: logic.js (NCLEX.registerTopic)

(function() {
  'use strict';

  // Función helper para traducción (Optimización de Código)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'newborn',
    title: { es: 'Recién Nacido', en: 'Newborn' },
    subtitle: { es: 'Evaluación, Seguridad y Patologías', en: 'Assessment, Safety & Pathologies' },
    icon: 'baby',
    color: 'blue',
    
    // Render principal
    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-baby-carriage"></i>
                ${t('Prioridad Nivel 1', 'Priority Level 1')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Enfermería Neonatal', 'Newborn Nursing')}
              </h1>
              <p class="text-gray-500 mt-2 text-lg">
                ${t('ABC, Termorregulación y Seguridad (SIDS).', 'ABC, Thermoregulation & Safety (SIDS).')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderAPGAR()}
          ${this.renderVitals()}
          ${this.renderMeds()}          
          ${this.renderColdStress()}
          ${this.renderRespDistress()}  
          ${this.renderHeadTrauma()} 
          ${this.renderFontanels()}     
          ${this.renderCordCirc()}
          ${this.renderSkin()}
          ${this.renderJaundice()}
          ${this.renderDiagnostics()}   
          ${this.renderStools()}
          ${this.renderFeeding()} ${this.renderReflexes()}
          ${this.renderCleft()}
          ${this.renderHip()}
          ${this.renderNAS()}
          ${this.renderSafety()}
        </div>
      `;
    },

    // --- 1. APGAR ---
    renderAPGAR() {
      return `
        <section id="section-apgar">
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg">1</div>
            <div>
                <h2 class="text-2xl font-black text-gray-900 dark:text-white">APGAR Scoring</h2>
                <p class="text-xs text-gray-500 font-medium">1 min & 5 min post-birth</p>
            </div>
          </div>
          
          <div class="bg-white dark:bg-brand-card rounded-3xl shadow-xl border border-gray-200 dark:border-brand-border overflow-hidden mt-4">
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                <thead class="text-xs text-white uppercase bg-slate-800 dark:bg-slate-900">
                  <tr>
                    <th scope="col" class="px-6 py-4">${t('Signo', 'Sign')}</th>
                    <th scope="col" class="px-6 py-4 bg-red-500/20 text-red-600 dark:text-red-400">0 Points</th>
                    <th scope="col" class="px-6 py-4 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">1 Point</th>
                    <th scope="col" class="px-6 py-4 bg-green-500/20 text-green-600 dark:text-green-400">2 Points</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700 font-medium">
                  <tr>
                    <td class="px-6 py-4 font-bold">Appearance (Color)</td>
                    <td class="px-6 py-4 text-red-500">${t('Azul / Pálido', 'Blue / Pale')}</td>
                    <td class="px-6 py-4 text-yellow-600">${t('Cuerpo Rosa, Ext. Azules', 'Body Pink, Ext. Blue')} <br><span class="text-[10px] opacity-75">(Acrocyanosis)</span></td>
                    <td class="px-6 py-4 text-green-600">${t('Todo Rosa', 'All Pink')}</td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 font-bold">Pulse (Heart Rate)</td>
                    <td class="px-6 py-4 text-red-500">${t('Ausente', 'Absent')}</td>
                    <td class="px-6 py-4 text-yellow-600">&lt; 100 bpm</td>
                    <td class="px-6 py-4 text-green-600">&gt; 100 bpm</td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 font-bold">Grimace (Reflex)</td>
                    <td class="px-6 py-4 text-red-500">${t('Sin Respuesta', 'No Response')}</td>
                    <td class="px-6 py-4 text-yellow-600">${t('Mueca', 'Grimace')}</td>
                    <td class="px-6 py-4 text-green-600">${t('Tos / Llanto', 'Cough / Cry')}</td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 font-bold">Activity (Muscle Tone)</td>
                    <td class="px-6 py-4 text-red-500">${t('Flácido', 'Flaccid')}</td>
                    <td class="px-6 py-4 text-yellow-600">${t('Algo de flexión', 'Some Flexion')}</td>
                    <td class="px-6 py-4 text-green-600">${t('Movimiento Activo', 'Active Motion')}</td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 font-bold">Respiration</td>
                    <td class="px-6 py-4 text-red-500">${t('Ausente', 'Absent')}</td>
                    <td class="px-6 py-4 text-yellow-600">${t('Lenta / Irregular', 'Slow / Irregular')}</td>
                    <td class="px-6 py-4 text-green-600">${t('Llanto fuerte', 'Strong Cry')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 p-3 text-center text-xs text-gray-500">
                <i class="fa-solid fa-lightbulb text-yellow-500 mr-1"></i> 
                ${t('Rango Normal: 7-10. Si &lt; 7: Estimular y O2. <strong class="text-red-600">Puntuación 0-3: Reanimación inmediata</strong>.', 'Normal Range: 7-10. If &lt; 7: Stimulate & O2. <strong class="text-red-600">Score 0-3: Immediate resuscitation</strong>.')}
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. Vitals ---
    renderVitals() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-lg shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Signos Vitales', 'Vital Signs')}
            </h2>
          </div>
          
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border shadow-lg text-center group hover:-translate-y-1 transition-transform">
              <p class="text-xs text-gray-400 uppercase font-bold tracking-widest">HR (Pulse)</p>
              <p class="text-3xl font-black text-teal-600 dark:text-teal-400 mt-2">110-160</p>
              <p class="text-xs text-gray-500 mt-1">bpm</p>
              <p class="text-[10px] text-red-400 mt-2 font-bold group-hover:opacity-100 opacity-0 transition-opacity">Crying: 180 ok<br>Sleep: 100 ok</p>
            </div>
            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border shadow-lg text-center group hover:-translate-y-1 transition-transform">
              <p class="text-xs text-gray-400 uppercase font-bold tracking-widest">RR (Resp)</p>
              <p class="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">30-60</p>
              <p class="text-xs text-gray-500 mt-1">min</p>
              <p class="text-[10px] text-blue-400 mt-2 font-bold group-hover:opacity-100 opacity-0 transition-opacity">Apnea &lt; 20s OK</p>
            </div>
            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border shadow-lg text-center hover:-translate-y-1 transition-transform">
              <p class="text-xs text-gray-400 uppercase font-bold tracking-widest">Temp (Ax)</p>
              <p class="text-xl font-black text-orange-600 dark:text-orange-400 mt-2">36.5-37.5°C</p>
              <p class="text-xs text-gray-500 mt-1">97.7-99.5°F</p>
            </div>
            <div class="p-5 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-lg text-center relative overflow-hidden hover:-translate-y-1 transition-transform">
              <p class="text-xs text-purple-800 dark:text-purple-300 uppercase font-bold tracking-widest">Glucose</p>
              <p class="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">&gt; 40-45</p>
              <p class="text-xs text-gray-500 mt-1">mg/dL</p>
              <p class="text-[10px] font-bold text-white bg-purple-500 px-2 py-0.5 rounded-full mt-2 inline-block uppercase animate-pulse">
                  ${t('Feed First!', 'Feed First!')}
              </p>
            </div>
          </div>
        </section>
      `;
    },

    // --- 3. Meds ---
    renderMeds() {
      return `
        <section>
          <div class="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800 mb-8">
            <h3 class="text-xl font-black text-indigo-900 dark:text-indigo-300 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-prescription-bottle-medical"></i>
              ${t('Meds: "Eyes & Thighs" (1ª Hora)', 'Meds: "Eyes & Thighs" (1st Hour)')}
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-white dark:bg-brand-card p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900 shadow-sm">
                <div class="flex items-center justify-between mb-2">
                  <strong class="text-indigo-700 dark:text-indigo-400">Vitamin K (Phytonadione)</strong>
                  <i class="fa-solid fa-syringe text-gray-400"></i>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  ${t('Intestino estéril = No Vit K = <strong>Enfermedad hemorrágica del RN</strong>. IM: 0.5-1 mg.', 'Sterile gut = No Vit K = <strong>Hemorrhagic disease of newborn</strong>. IM: 0.5-1 mg.')}
                </p>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">IM: Vastus Lateralis</span>
                </div>
              </div>

              <div class="bg-white dark:bg-brand-card p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900 shadow-sm">
                <div class="flex items-center justify-between mb-2">
                  <strong class="text-indigo-700 dark:text-indigo-400">Erythromycin Ointment</strong>
                  <i class="fa-solid fa-eye text-gray-400"></i>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  ${t('Prevención Oftalmía Neonatorum (Gonorrea/Clamidia).', 'Prevents Ophthalmia Neonatorum (GC/Chlamydia).')}
                </p>
                <span class="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Inner to Outer Canthus</span>
              </div>

              <div class="bg-white dark:bg-brand-card p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900 shadow-sm">
                <div class="flex items-center justify-between mb-2">
                  <strong class="text-indigo-700 dark:text-indigo-400">Hepatitis B Vaccine</strong>
                  <i class="fa-solid fa-shield-virus text-gray-400"></i>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  ${t('La única vacuna al nacer.', 'Only vaccine at birth.')}
                </p>
                <div class="inline-block bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[10px] font-bold px-2 py-1 rounded">
                  ${t('CONSENTIMIENTO REQUERIDO', 'CONSENT REQUIRED')}
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Cold Stress ---
    renderColdStress() {
      return `
        <section>
          <div class="bg-gradient-to-r from-cyan-600 to-blue-700 p-6 rounded-3xl text-white shadow-2xl mb-8 relative overflow-hidden">
            <div class="relative z-10">
                <h3 class="text-xl font-black mb-3 flex items-center gap-2">
                    <i class="fa-solid fa-temperature-arrow-down"></i> 
                    ${t('Tríada del Estrés por Frío', 'Cold Stress Triad')}
                </h3>
                <p class="mb-4 text-white/90 font-medium text-sm">
                ${t('Los recién nacidos generan calor mediante grasa parda (termogénesis sin temblor). Metabolismo ↑ para calentar, consumiendo glucosa → ↓Glu → ↑Metabolismo anaeróbico → Acidosis.', 'Newborns generate heat via brown fat (non-shivering thermogenesis). Metabolism spikes to warm up, burning glucose → ↓Glucose → ↑Anaerobic metabolism → Acidosis.')}
                </p>
                <div class="flex flex-col md:flex-row items-center justify-around text-center bg-black/20 p-4 rounded-xl backdrop-blur-sm gap-4">
                <div class="flex-1">
                    <div class="text-3xl font-bold">1. 📉 Temp</div>
                    <div class="text-xs opacity-75 uppercase tracking-wide">Hypothermia</div>
                </div>
                <i class="fa-solid fa-arrow-right text-white/50 hidden md:block"></i>
                <i class="fa-solid fa-arrow-down text-white/50 md:hidden"></i>
                <div class="flex-1">
                    <div class="text-3xl font-bold text-yellow-300">2. 📉 Glu</div>
                    <div class="text-xs opacity-75 uppercase tracking-wide">Hypoglycemia</div>
                </div>
                <i class="fa-solid fa-arrow-right text-white/50 hidden md:block"></i>
                <i class="fa-solid fa-arrow-down text-white/50 md:hidden"></i>
                <div class="flex-1">
                    <div class="text-3xl font-bold text-red-300">3. 📉 O2</div>
                    <div class="text-xs opacity-75 uppercase tracking-wide">Hypoxia/Acidosis</div>
                </div>
                </div>
            </div>
            <i class="fa-regular fa-snowflake absolute -right-4 -bottom-4 text-9xl text-white/10 rotate-12"></i>
          </div>
        </section>
      `;
    },

    // --- 5. Respiratory Distress ---
    renderRespDistress() {
      return `
        <section>
          <div class="border-2 border-red-500 border-dashed p-6 rounded-3xl bg-red-50 dark:bg-red-900/10 mb-8">
             <div class="flex items-center gap-3 mb-4">
                <div class="p-2 bg-red-600 text-white rounded-lg shadow-lg">
                   <i class="fa-solid fa-lungs-virus text-xl"></i>
                </div>
                <h3 class="text-xl font-black text-red-700 dark:text-red-400">
                   ${t('RED FLAGS Respiratorias', 'Respiratory RED FLAGS')}
                </h3>
             </div>
             
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <strong class="block text-red-800 dark:text-red-300 mb-2 uppercase text-xs tracking-wider">The "Scary" Triad</strong>
                  <ul class="space-y-3">
                    <li class="flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-black/20 p-2 rounded-lg">
                      <i class="fa-solid fa-circle-exclamation text-red-500"></i>
                      <span><strong>Grunting</strong> <span class="text-gray-500 text-xs">(Quejido espiratorio)</span></span>
                    </li>
                    <li class="flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-black/20 p-2 rounded-lg">
                      <i class="fa-solid fa-circle-exclamation text-red-500"></i>
                      <span><strong>Nasal Flaring</strong> <span class="text-gray-500 text-xs">(Aleteo nasal)</span></span>
                    </li>
                    <li class="flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-black/20 p-2 rounded-lg">
                      <i class="fa-solid fa-circle-exclamation text-red-500"></i>
                      <span><strong>Retractions</strong> <span class="text-gray-500 text-xs">(Costillas hundidas)</span></span>
                    </li>
                    <li class="flex items-center gap-3 text-sm text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/30 p-2 rounded-lg border border-red-300">
                      <i class="fa-solid fa-skull-crossbones"></i>
                      <span><strong>Cianosis central</strong> <span class="text-gray-500 text-xs">(Lengua/ labios azules)</span></span>
                    </li>
                  </ul>
               </div>
               <div>
                  <strong class="block text-red-800 dark:text-red-300 mb-2 uppercase text-xs tracking-wider">Patterns</strong>
                  <ul class="space-y-3">
                    <li class="text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-black/20 p-3 rounded-lg border-l-4 border-red-500">
                      <span class="font-bold block mb-1">See-Saw Breathing (Respiración en Balanceo):</span> 
                      <span class="text-xs block text-gray-600 dark:text-gray-400">${t('El tórax desciende y el abdomen se eleva durante la inspiración (PRIORIDAD ALTA).', 'Chest falls and abdomen rises during inspiration (HIGH PRIORITY).')}</span>
                    </li>
                     <li class="text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-black/20 p-3 rounded-lg border-l-4 border-yellow-500">
                      <span class="font-bold block mb-1">Apnea:</span> 
                      <span class="text-xs block text-gray-600 dark:text-gray-400">&gt; 20 segundos es patológico.</span>
                    </li>
                  </ul>
               </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 6. Head Trauma ---
    renderHeadTrauma() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">3</div>
            <div>
              <h2 class="text-2xl font-black text-gray-900 dark:text-white">
                ${t('Evaluación de la Cabeza', 'Head Assessment')}
              </h2>
              <p class="text-xs text-gray-500 font-medium">
                ${t('Caput vs Cefalohematoma', 'Caput vs Cephalohematoma')}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-4">
            <div class="p-6 bg-green-50 dark:bg-green-900/10 rounded-3xl border border-green-200 dark:border-green-800">
              <h3 class="text-xl font-black text-green-800 dark:text-green-300 mb-2">Caput Succedaneum</h3>
              <div class="inline-block px-3 py-1 bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-bold uppercase mb-4">
                <i class="fa-solid fa-check mr-1"></i> ${t('NORMAL', 'NORMAL')}
              </div>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• ${t('Edema (Líquido) del cuero cabelludo.', 'Scalp edema (Fluid).')}</li>
                <li>• ${t('<strong>C</strong>aput <strong>C</strong>ruza suturas (Crosses).', '<strong>C</strong>aput <strong>C</strong>rosses sutures.')}</li>
                <li>• ${t('Se resuelve en 1-3 días.', 'Resolves in 1-3 days.')}</li>
              </ul>
            </div>

            <div class="p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-800">
              <h3 class="text-xl font-black text-red-800 dark:text-red-300 mb-2">Cephalohematoma</h3>
              <div class="inline-block px-3 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-bold uppercase mb-4">
                <i class="fa-solid fa-eye mr-1"></i> ${t('MONITORIZAR', 'MONITOR')}
              </div>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• ${t('Sangre subperióstica (Hemorragia).', 'Subperiosteal blood (Bleeding).')}</li>
                <li>• ${t('NO cruza suturas (límites óseos).', 'Does NOT cross sutures (bone boundaries).')}</li>
                <li class="bg-red-100 dark:bg-red-900/50 p-2 rounded mt-2">
                    <i class="fa-solid fa-triangle-exclamation text-red-500 mr-1"></i> 
                    ${t('Riesgo: <strong>Hiperbilirrubinemia</strong> (degradación de 1g Hb = 35mg bilirrubina).', 'Risk: <strong>Hyperbilirubinemia</strong> (1g Hb breakdown = 35mg bilirubin).')}
                </li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 7. Fontanels ---
    renderFontanels() {
      return `
        <section>
          <div class="bg-gray-100 dark:bg-gray-800 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 mb-8">
            <h4 class="font-bold text-gray-900 dark:text-white mb-4"><i class="fa-regular fa-circle mr-2"></i>
              ${t('Fontanelas (Puntos Blandos)', 'Fontanels (Soft Spots)')}
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
               <div class="bg-white dark:bg-brand-card p-3 rounded-xl border border-gray-200 dark:border-gray-600">
                  <strong class="text-blue-600 dark:text-blue-400 block">Anterior</strong>
                  <span class="text-xs text-gray-500">Rombo 2-3cm (Diamond)</span>
                  <p class="text-sm font-bold mt-1">${t('Cierra: 12-18 Meses', 'Closes: 12-18 Months')}</p>
               </div>
               <div class="bg-white dark:bg-brand-card p-3 rounded-xl border border-gray-200 dark:border-gray-600">
                  <strong class="text-blue-600 dark:text-blue-400 block">Posterior</strong>
                  <span class="text-xs text-gray-500">Triángulo 0.5-1cm</span>
                  <p class="text-sm font-bold mt-1">${t('Cierra: 2-3 Meses', 'Closes: 2-3 Months')}</p>
               </div>
            </div>

            <div class="space-y-2 text-sm">
               <div class="flex items-center gap-3 bg-red-100 dark:bg-red-900/30 p-2 rounded-lg text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
                  <i class="fa-solid fa-arrow-up-right-dots text-xl"></i>
                  <span><strong>Bulging (Abultada):</strong> ${t('↑ Presión Intracraneal (Meningitis/Hidrocefalia). <em>Fontanela tensa + no late = ↑PIC urgente</em>.', '↑ ICP (Meningitis/Hydrocephalus). <em>Tense + non-pulsatile fontanel = urgent ↑ICP</em>.')} <span class="text-xs opacity-75 block">(Normal si llora/hace fuerza).</span></span>
               </div>
               <div class="flex items-center gap-3 bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800">
                  <i class="fa-solid fa-glass-water-droplet text-xl"></i>
                  <span><strong>Sunken (Hundida):</strong> ${t('Deshidratación Severa.', 'Severe Dehydration.')}</span>
               </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 8. Cord & Circumcision ---
    renderCordCirc() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Cordón Umbilical y Circuncisión', 'Umbilical Cord & Circumcision')}
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h4 class="font-bold text-gray-900 dark:text-white mb-2"><i class="fa-solid fa-ring text-blue-500 mr-2"></i>
                ${t('Cordón Umbilical', 'Umbilical Cord')}
              </h4>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-green-500 mt-1"></i> AVA: <strong>2 Arterias</strong> (pequeñas, pared gruesa) + <strong>1 Vena</strong> (grande, pared delgada).</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-triangle-exclamation text-yellow-500 mt-1"></i> ${t('1 arteria única (15-20% malformaciones renales).', '1 single artery (15-20% renal malformations).')}</li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-green-500 mt-1"></i> ${t('Cae en 10-14 días.', 'Falls off in 10-14 days.')}</li>
                <li class="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded"><i class="fa-solid fa-circle-info text-blue-500 mt-1"></i> <strong>${t('Agua y jabón neutro. NO alcohol.', 'Water/mild soap. NO alcohol.')}</strong></li>
              </ul>
            </div>
            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h4 class="font-bold text-gray-900 dark:text-white mb-2"><i class="fa-solid fa-scissors text-red-500 mr-2"></i>
                ${t('Circuncisión', 'Circumcision')}
              </h4>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li class="flex items-start gap-2"><i class="fa-solid fa-info-circle text-gray-400 mt-1"></i>
                  <strong>${t('Exudado amarillo:', 'Yellow exudate:')}</strong>
                  ${t('Normal (No limpiar).', 'Normal (Do not wipe).')}
                </li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-check text-green-500 mt-1"></i>
                  <strong>${t('Clamp (Gomco):', 'Clamp (Gomco):')}</strong>
                  ${t('Usar Vaselina con cada cambio.', 'Use Petroleum Jelly with each change.')}
                </li>
                <li class="flex items-start gap-2"><i class="fa-solid fa-xmark text-red-500 mt-1"></i>
                  <strong>${t('Plastibell:', 'Plastibell:')}</strong>
                  ${t('NO Vaselina (cae en 5-8 días).', 'NO Petroleum Jelly (falls off in 5-8 days).')}
                </li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 9. Skin ---
    renderSkin() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center text-white font-black text-lg shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Piel: ¿Normal o Alerta?', 'Skin: Normal or Alert?')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
              <strong class="block text-gray-800 dark:text-gray-200 mb-1">Mongolian Spots</strong>
              <p class="text-xs text-gray-500 mb-2">${t('Manchas azules (nalgas/espalda).', 'Blue spots (buttocks/back).')}</p>
              <div class="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded inline-block">
                ${t('Documentar (NO confundir con abuso)', 'Document (NOT abuse)')}
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
              <strong class="block text-gray-800 dark:text-gray-200 mb-1">Milia</strong>
              <p class="text-xs text-gray-500 mb-2">${t('Puntos blancos nariz.', 'White nose bumps.')}</p>
              <div class="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded inline-block">
                ${t('No exprimir (quistes de queratina)', 'Don\'t pop (keratin cysts)')}
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
              <strong class="block text-gray-800 dark:text-gray-200 mb-1">Vernix Caseosa</strong>
              <p class="text-xs text-gray-500 mb-2">${t('Sustancia blanca (queso).', 'White cheesy substance.')}</p>
              <div class="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded inline-block">
                ${t('No frotar (protección térmica)', 'Don\'t rub (thermal protection)')}
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
              <strong class="block text-gray-800 dark:text-gray-200 mb-1">Erythema Tox.</strong>
              <p class="text-xs text-gray-500 mb-2">${t('Sarpullido rojo con pústula central.', 'Red rash with central pustule.')}</p>
              <div class="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded inline-block">
                ${t('NORMAL (resuelve en días)', 'NORMAL (resolves in days)')}
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
              <strong class="block text-gray-800 dark:text-gray-200 mb-1">Lanugo</strong>
              <p class="text-xs text-gray-500 mb-2">${t('Vello fino en hombros/espalda.', 'Fine downy hair on shoulders/back.')}</p>
              <div class="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded inline-block">
                ${t('NORMAL (Cae después)', 'NORMAL (Falls off later)')}
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 md:col-span-3 lg:col-span-3">
              <strong class="block text-gray-800 dark:text-gray-200 mb-1">Birthmarks (Vascular)</strong>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div class="text-xs text-gray-500">
                  <span class="font-bold text-pink-600">Nevus Simplex (Stork Bite):</span> ${t('Palidece al presionar (Blanchable). Desaparece ~2 años.', 'Blanchable pink. Fades ~2 years.')}
                </div>
                <div class="text-xs text-gray-500">
                  <span class="font-bold text-red-700">Nevus Flammeus (Port Wine):</span> ${t('NO palidece. Permanente. (Posible asoc. Sturge-Weber).', 'Non-blanchable. Permanent. (Possible Sturge-Weber).')}
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 10. Jaundice ---
    renderJaundice() {
      return `
        <section>
          <div class="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-3xl border border-yellow-200 dark:border-yellow-800 mb-8">
            <h3 class="text-xl font-black text-yellow-800 dark:text-yellow-400 mb-4"><i class="fa-solid fa-sun mr-2"></i> ${t('Ictericia (Jaundice)', 'Jaundice')}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="border-l-4 border-red-500 pl-4">
                <strong class="text-red-600 block mb-1">Pathological (Malo)</strong>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  ${t('Aparece en las <strong>primeras 24 horas</strong>.', 'Appears within <strong>first 24 hours</strong>.')}
                </p>
                <p class="text-xs text-gray-500 mt-1">${t('Causa: Incompatibilidad Rh/ABO, sepsis, G6PD.', 'Cause: Rh/ABO incompatibility, sepsis, G6PD.')}</p>
              </div>
              <div class="border-l-4 border-green-500 pl-4">
                <strong class="text-green-600 block mb-1">Physiological (Benigno)</strong>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  ${t('Aparece <strong>día 2-5</strong>, resuelve &lt; 14 días.', 'Appears <strong>day 2-5</strong>, resolves &lt; 14 days.')}
                </p>
                <p class="text-xs text-gray-500 mt-1">${t('Causa: Hígado inmaduro + ↑ hemólisis fisiológica.', 'Cause: Immature liver + ↑ physiologic hemolysis.')}</p>
              </div>
            </div>

            <div class="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/40 rounded-xl border border-yellow-300 dark:border-yellow-700">
               <strong class="text-red-600 uppercase text-xs tracking-wider">CRITICAL: Kernicterus</strong>
               <p class="text-sm mt-1 text-gray-800 dark:text-gray-200">
                 ${t('Bilirrubina &gt; 20 mg/dL (nivel de riesgo alto). Depósito en ganglios basales → daño cerebral permanente. Fototerapia: &gt;15 mg/dL. Exsanguinotransfusión: &gt;20 mg/dL.', 'Bilirubin &gt; 20 mg/dL (high-risk level). Basal ganglia deposition → permanent brain damage. Phototherapy: &gt;15 mg/dL. Exchange transfusion: &gt;20 mg/dL.')}
                 <br><strong>${t('Signo: Opisthotonos', 'Sign: Opisthotonos')}</strong> <span class="text-xs">(Arqueo severo de espalda / Severe back arching).</span>
                 <br><span class="text-xs font-bold mt-1 block">${t('Enfermería: Posicionar de lado (Side-lying), alimentación frecuente.', 'Nursing: Position on side, frequent feeding.')}</span>
               </p>
            </div>

            <div class="mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-800">
              <p class="text-sm font-bold text-yellow-900 dark:text-yellow-200">
                ${t('Cuidados Fototerapia:', 'Phototherapy Care:')}
              </p>
              <ul class="list-disc list-inside text-xs mt-2 text-gray-700 dark:text-gray-300 grid grid-cols-1 md:grid-cols-3 gap-2">
                <li>${t('Cubrir ojos/genitales.', 'Cover eyes/genitals.')}</li>
                <li>${t('Solo pañal. NO lociones/cremas.', 'Diaper only. NO lotions/creams.')}</li>
                <li>${t('Monitorizar Temp/H2O cada 2-4h.', 'Monitor Temp/H2O q2-4h.')}</li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 11. Diagnostics ---
    renderDiagnostics() {
      return `
        <section>
           <div class="flex flex-col md:flex-row gap-6 mb-8">
              <div class="flex-1 bg-white dark:bg-brand-card p-5 rounded-2xl border border-gray-200 dark:border-brand-border shadow-md">
                 <strong class="text-slate-800 dark:text-white block mb-2"><i class="fa-solid fa-vial text-pink-500 mr-2"></i> PKU Test (Heel Stick)</strong>
                 <p class="text-sm text-gray-600 dark:text-gray-400">
                    ${t('Prueba genética metabólica (Fenilcetonuria, hipotiroidismo, galactosemia).', 'Genetic metabolic test (PKU, hypothyroidism, galactosemia).')}
                 </p>
                 <div class="mt-3 bg-pink-50 dark:bg-pink-900/20 p-2 rounded text-xs text-pink-800 dark:text-pink-300 font-bold border border-pink-200 dark:border-pink-800">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    ${t('Entre 24h-7 días de vida, después de 48h de alimentación proteica.', 'Between 24h-7 days old, after 48h of protein feeding.')}
                 </div>
              </div>

              <div class="flex-1 bg-white dark:bg-brand-card p-5 rounded-2xl border border-gray-200 dark:border-brand-border shadow-md">
                 <strong class="text-slate-800 dark:text-white block mb-2"><i class="fa-solid fa-weight-scale text-blue-500 mr-2"></i> Weight Loss</strong>
                 <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    ${t('Pérdida fisiológica normal por diuresis/pérdida de meconio.', 'Physiologic loss from diuresis/meconium passage.')}
                 </p>
                 <div class="flex items-end gap-2">
                     <span class="text-2xl font-black text-blue-600 dark:text-blue-400">5 - 10%</span>
                     <span class="text-xs text-gray-400 mb-1">${t('(Semana 1, recupera al día 10-14)', '(Week 1, regains by day 10-14)')}</span>
                 </div>
                 <div class="text-xs text-red-500 mt-2 font-bold">&gt;10% = Evaluar alimentación/hidratación</div>
              </div>
           </div>
        </section>
      `;
    },

    // --- 12. Stools ---
    renderStools() {
      return `
        <section>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="p-4 bg-slate-800 text-white rounded-2xl">
              <strong class="block text-sm uppercase tracking-wider text-slate-400">0-24 Hrs</strong>
              <div class="text-xl font-bold my-1">Meconium</div>
              <p class="text-xs opacity-70">${t('Negro, alquitranado, pegajoso.', 'Black, tarry, sticky.')}</p>
              <p class="text-[10px] mt-1 text-green-300">${t('Ausencia &gt;48h: atresia intestinal/obstrucción.', 'Absence &gt;48h: intestinal atresia/obstruction.')}</p>
            </div>
            <div class="p-4 bg-green-800 text-white rounded-2xl">
              <strong class="block text-sm uppercase tracking-wider text-green-300">Day 3-4</strong>
              <div class="text-xl font-bold my-1">Transitional</div>
              <p class="text-xs opacity-70">${t('Verdoso-marrón.', 'Greenish-brown.')}</p>
            </div>
            <div class="p-4 bg-yellow-500 text-white rounded-2xl">
              <strong class="block text-sm uppercase tracking-wider text-yellow-200">Breastfed</strong>
              <div class="text-xl font-bold my-1">Milk Stool</div>
              <p class="text-xs opacity-90">${t('Mostaza, semillas, olor dulce, 6-8/día.', 'Mustard, seedy, sweet smell, 6-8/day.')}</p>
            </div>
          </div>
        </section>
      `;
    },

    // --- 13. Feeding ---
    renderFeeding() {
      return `
        <section>
           <div class="bg-orange-50 dark:bg-orange-900/10 p-5 rounded-3xl border border-orange-200 dark:border-orange-800 mb-8">
              <h4 class="font-bold text-orange-900 dark:text-orange-300 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-bottle-droplet"></i>
                  ${t('Nutrición & Alimentación', 'Nutrition & Feeding')}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div class="bg-white dark:bg-brand-card p-4 rounded-2xl border border-gray-200 dark:border-brand-border">
                    <strong class="text-pink-600 dark:text-pink-400 block mb-2">Breastfeeding (Lactancia)</strong>
                    <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
                       <li>${t('<strong>Agarre (Latch):</strong> Boca bien abierta, nariz tocando pecho. Romper succión con dedo.', '<strong>Latch:</strong> Wide open mouth, nose to breast. Break suction with finger.')}</li>
                       <li>${t('<strong>Frecuencia:</strong> A demanda (cada 2-3h). 8-12 veces/día.', '<strong>Freq:</strong> On demand (q2-3h). 8-12 times/day.')}</li>
                       <li>${t('<strong>Colostro:</strong> "Oro líquido" (Rico en IgA), primeros días.', '<strong>Colostrum:</strong> "Liquid Gold" (IgA rich), first days.')}</li>
                       <li class="bg-orange-100 dark:bg-orange-900/20 p-1 rounded">${t('<strong>Almacenamiento:</strong> 4h ambiente, 4 días refri, 6-12m congelador.', '<strong>Storage:</strong> 4h room, 4 days fridge, 6-12m freezer.')}</li>
                    </ul>
                 </div>
                 <div class="bg-white dark:bg-brand-card p-4 rounded-2xl border border-gray-200 dark:border-brand-border">
                    <strong class="text-blue-600 dark:text-blue-400 block mb-2">Formula Feeding</strong>
                    <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
                       <li>${t('<strong>Preparación:</strong> Fortificada con Hierro. Agua primero, luego polvo. NO diluir extra.', '<strong>Prep:</strong> Iron-fortified. Water first, then powder. NO extra dilution.')}</li>
                       <li>${t('<strong>Seguridad:</strong> NO microondas (puntos calientes). Desechar botella usada tras 1h.', '<strong>Safety:</strong> NO microwave (hot spots). Discard used bottle after 1h.')}</li>
                       <li>${t('<strong>Eructar:</strong> Frecuentemente (cada 15-30ml).', '<strong>Burp:</strong> Frequently (every 0.5-1oz).')}</li>
                    </ul>
                 </div>
              </div>
           </div>
        </section>
      `;
    },

    // --- 14. Reflexes ---
    renderReflexes() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Reflejos Primitivos', 'Primitive Reflexes')}
            </h2>
          </div>
          
          <div class="space-y-3">
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border">
              <div class="flex justify-between items-center mb-1">
                 <strong class="text-indigo-600 dark:text-indigo-400">Moro (Startle)</strong>
                 <span class="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">4-6 m</span>
              </div>
              <p class="text-xs text-gray-500 mt-2">${t('Extiende brazos, abre manos, luego flexiona (forma "C").', 'Extends arms, opens hands, then flexes (forms "C").')}</p>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border">
              <div class="flex justify-between items-center mb-1">
                 <strong class="text-indigo-600 dark:text-indigo-400">Babinski</strong>
                 <span class="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">1 year</span>
              </div>
              <p class="text-xs text-gray-500 mb-1 mt-2">${t('Dedos de pie se abren en abanico (Fan out) al estimular planta.', 'Toes fan out when sole stroked.')}</p>
              <div class="text-[10px] inline-block font-bold text-red-500 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded">${t('En Adulto = Patológico (lesión UMN)', 'Adult = Pathological (UMN lesion)')}</div>
            </div>

            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border">
              <div class="flex justify-between items-center mb-1">
                 <strong class="text-indigo-600 dark:text-indigo-400">Rooting / Sucking</strong>
                 <span class="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">4 m</span>
              </div>
              <p class="text-xs text-gray-500">${t('Gira cabeza al tocar mejilla (rooting). Succión fuerte al poner dedo en boca.', 'Turns head when cheek touched. Strong suck with finger in mouth.')}</p>
            </div>

            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border">
              <div class="flex justify-between items-center mb-1">
                 <strong class="text-indigo-600 dark:text-indigo-400">Tónico del cuello (Esgrimista)</strong>
                 <span class="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">4-6 m</span>
              </div>
              <p class="text-xs text-gray-500">${t('Cabeza girada → brazo extendido mismo lado, opuesto flexionado.', 'Head turned → same-side arm extends, opposite flexes.')}</p>
            </div>

            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border">
              <div class="flex justify-between items-center mb-1">
                 <strong class="text-indigo-600 dark:text-indigo-400">Palmar / Plantar Grasp</strong>
                 <span class="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">3-4 m / 8 m</span>
              </div>
              <p class="text-xs text-gray-500">${t('Dedos se curvan alrededor del objeto colocado en palma/planta.', 'Fingers/toes curl around object placed in palm/sole.')}</p>
            </div>

            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border">
              <div class="flex justify-between items-center mb-1">
                 <strong class="text-indigo-600 dark:text-indigo-400">Stepping (Marcha)</strong>
                 <span class="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">4-8 weeks</span>
              </div>
              <p class="text-xs text-gray-500">${t('Movimiento de marcha cuando se sostiene verticalmente tocando superficie.', 'Walking motion when held upright touching surface.')}</p>
            </div>
          </div>
        </section>
      `;
    },

    // --- 15. Cleft ---
    renderCleft() {
      return `
        <section>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-3xl border border-rose-200 dark:border-rose-800">
              <h3 class="font-black text-rose-800 dark:text-rose-300 mb-3 flex items-center gap-2">
                 <i class="fa-solid fa-lips"></i> Cleft LIP
              </h3>
              <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li class="bg-white dark:bg-rose-900/20 p-2 rounded">
                    <strong>${t('Alimentación:', 'Feeding:')}</strong> ${t('Tetina larga (Haberman). Eructar cada 15-30mL.', 'Long nipple (Haberman). Burp every 15-30mL.')}
                </li>
                <li class="bg-white dark:bg-rose-900/20 p-2 rounded">
                    <strong>${t('Post-Op:', 'Post-Op:')}</strong> ${t('Posición <strong>Espalda</strong> o Lateral. Nunca Prone. Cuidar sutura con solución salina.', 'Position on <strong>Back</strong> or Side. NEVER Prone. Clean suture with saline.')}
                </li>
                <li class="text-xs opacity-75 mt-1">Logan Bow (Arco de metal) protege sutura. NO usar chupete.</li>
              </ul>
            </div>
            <div class="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-3xl border border-purple-200 dark:border-purple-800">
              <h3 class="font-black text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                 <i class="fa-regular fa-face-mouth-open"></i> Cleft PALATE
              </h3>
              <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li class="bg-white dark:bg-purple-900/20 p-2 rounded text-red-600 dark:text-red-300 font-bold">
                    <i class="fa-solid fa-triangle-exclamation"></i> ${t('Riesgo: Aspiración + Otitis media (disfunción trompa de Eustaquio).', 'Risk: Aspiration + Otitis media (Eustachian tube dysfunction).')}
                </li>
                <li class="bg-white dark:bg-purple-900/20 p-2 rounded">
                    <strong>${t('Alimentación (ESSR):', 'Feeding (ESSR):')}</strong> Enlarge nipple, Stimulate, Swallow, Rest. Alimentar en posición vertical.
                </li>
                <li class="bg-white dark:bg-purple-900/20 p-2 rounded">
                    <strong>${t('Post-Op:', 'Post-Op:')}</strong> ${t('NADA en la boca x 10-14 días (No pajitas, No cucharas, No chupetes).', 'NOTHING in mouth x 10-14 days (No straws, spoons, pacifiers).')}
                </li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 16. Hip Dysplasia ---
    renderHip() {
      return `
        <section>
          <div class="mt-8 p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
            <h3 class="text-xl font-black text-gray-900 dark:text-white mb-4">Hip Dysplasia (DDH)</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
              <div class="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                <strong class="block text-brand-blue mb-1">
                    ${t('Signo 1: Asimetría', 'Sign 1: Asymmetry')}
                </strong>
                <p class="text-gray-600 dark:text-gray-400">
                  ${t('Pliegues glúteos asimétricos. Pierna aparentemente más corta.', 'Asymmetric gluteal folds. Apparently shorter leg.')}
                </p>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                <strong class="block text-brand-blue mb-1">
                    ${t('Signo 2: Ortolani/Barlow', 'Sign 2: Ortolani/Barlow')}
                </strong>
                <p class="text-gray-600 dark:text-gray-400">
                  ${t('"Click" o "Clunk" al abducir/rotar caderas. Limitación en abducción (&lt;60°).', '"Click" or "Clunk" on abduction/rotation. Limited abduction (&lt;60°).')}
                </p>
              </div>
              <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <strong class="block text-blue-700 dark:text-blue-300 mb-1">Treatment: Pavlik Harness</strong>
                <ul class="text-xs text-blue-800 dark:text-blue-200 list-disc list-inside">
                    <li>${t('23-24h/día x 6-12 semanas', '23-24h/day x 6-12 weeks')}</li>
                    <li>${t('Camiseta debajo para evitar rozaduras', 'Shirt under to prevent chafing')}</li>
                    <li>${t('Masajear piel bajo correas 2-3x/día', 'Massage skin under straps 2-3x/day')}</li>
                    <li>${t('NO quitar para bañar', 'Do NOT remove for bathing')}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 17. NAS ---
    renderNAS() {
      return `
        <section>
          <div class="mt-8 bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-200 dark:border-red-800">
            <div class="flex items-start gap-4">
              <div class="p-3 bg-red-500 text-white rounded-xl shadow-lg">
                <i class="fa-solid fa-pills text-2xl"></i>
              </div>
              <div>
                <h3 class="text-xl font-black text-red-800 dark:text-red-300">Neonatal Abstinence Syndrome (NAS)</h3>
                <p class="text-sm font-bold text-red-600/80 uppercase mt-1">Opioid Withdrawal - Escala de Finnegan</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <strong class="block text-gray-900 dark:text-white mb-2">Symptoms (Signs)</strong>
                <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>${t('Llanto agudo, inconsolable (High-pitched cry).', 'High-pitched, inconsolable cry.')}</li>
                  <li>${t('Temblores / Hipertonía / Hiperreflexia.', 'Tremors / Hypertonia / Hyperreflexia.')}</li>
                  <li>${t('Estornudos frecuentes, bostezos, succión excesiva.', 'Frequent sneezing, yawning, excessive sucking.')}</li>
                  <li>${t('Diarrea, vómitos, pobre alimentación.', 'Diarrhea, vomiting, poor feeding.')}</li>
                </ul>
              </div>
              <div>
                <strong class="block text-gray-900 dark:text-white mb-2">Nursing Interventions</strong>
                <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>${t('<strong>Swaddle</strong> apretado con brazos flexionados (posición fetal).', '<strong>Swaddle</strong> tightly with arms flexed (fetal position).')}</li>
                  <li>${t('Reducir estímulos (luz baja, ruido mínimo, agrupar cuidados).', 'Reduce stimuli (dim lights, minimal noise, cluster care).')}</li>
                  <li>${t('Ofrecer chupete (Calmante no nutritivo).', 'Offer pacifier (Non-nutritive sucking).')}</li>
                  <li>${t('Posición vertical después de alimentar (reflujo).', 'Upright position after feeding (reflux).')}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 18. Safety (SIDS) ---
    renderSafety() {
      return `
        <section>
          <div class="mt-8 mb-12 p-8 bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden relative">
            <h3 class="text-2xl font-black mb-6 text-center uppercase tracking-widest text-emerald-400">
              ${t('Seguridad: Lo que Salva Vidas', 'Safety: What Saves Lives')}
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center relative z-10 mt-4">
              <div class="p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                <i class="fa-solid fa-bed text-4xl mb-4 text-emerald-400"></i>
                <strong class="block mb-2 text-lg">SIDS Prevention</strong>
                <p class="text-sm text-gray-300">
                  ${t('• Siempre dormir boca arriba (Back to Sleep)<br>• Cuna vacía (Sin almohadas, juguetes, protectores)<br>• Superficie firme<br>• Compartir habitación (no cama) x6-12m<br>• Evitar sobrecalentamiento<br>• Lactancia materna<br>• Ambiente libre de humo', '• Always Back to Sleep<br>• Empty crib (no pillows, toys, bumpers)<br>• Firm surface<br>• Room-sharing (no bed-sharing) x6-12m<br>• Avoid overheating<br>• Breastfeeding<br>• Smoke-free environment')}
                </p>
              </div>
              <div class="p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                <i class="fa-solid fa-car text-4xl mb-4 text-emerald-400"></i>
                <strong class="block mb-2 text-lg">Car Seat</strong>
                <p class="text-sm text-gray-300">
                  ${t('• Mirando hacia atrás hasta 2 años o límite del asiento<br>• Ángulo 45° (usar toalla enrollada si es necesario)<br>• Clip del arnés a nivel de axilas<br>• Prueba del "pellizco" (no holgura en arnés)<br>• Nunca dejar solo en auto', '• Rear-facing until 2yo or seat limit<br>• 45° angle (use rolled towel if needed)<br>• Harness clip at armpit level<br>• "Pinch test" (no slack in harness)<br>• Never leave alone in car')}
                </p>
              </div>
              <div class="p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                <i class="fa-solid fa-bath text-4xl mb-4 text-emerald-400"></i>
                <strong class="block mb-2 text-lg">Cord & Bath Safety</strong>
                <p class="text-sm text-gray-300">
                  ${t('• Pañal debajo del cordón (aireación)<br>• Baño de esponja hasta que caiga el cordón (5-15 días)<br>• Agua tibia (37-38°C), probar con codo<br>• Nunca dejar solo en agua<br>• Secar bien pliegues', '• Diaper below cord (air dry)<br>• Sponge bath until cord falls (5-15 days)<br>• Warm water (37-38°C), test with elbow<br>• Never leave alone in water<br>• Dry creases thoroughly')}
                </p>
              </div>
            </div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
          </div>
        </section>
      `;
    }
  });
})();