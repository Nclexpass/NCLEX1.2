// 11_musculoskeletal.js — Musculoskeletal Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: Combined Best Practices
// CREADO POR REYNIER DIAZ GERONES
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // Helper interno de traducción para arquitectura limpia (DRY)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'musculoskeletal',
    title: { es: 'Musculoesquelético (Ortopedia)', en: 'Musculoskeletal (Ortho)' },
    subtitle: { es: 'Trauma, Movilidad, Pediatría y Farmacología', en: 'Trauma, Mobility, Pediatrics & Pharmacology' },
    icon: 'bone',
    color: 'stone',

    render() {
      return `
        <style>
          .med-card {
            @apply bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border shadow-sm p-5;
          }
        </style>
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-900/30 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-bone"></i>
                <span class="lang-es">Masterclass Ortopedia</span>
                <span class="lang-en hidden-lang">Ortho Masterclass</span>
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                <span class="lang-es">Sistema Musculoesquelético</span>
                <span class="lang-en hidden-lang">Musculoskeletal System</span>
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                <span class="lang-es">Prioridades: <strong class="text-red-500">Neurovascular</strong> (6 Ps), Síndrome Compartimental y Seguridad.</span>
                <span class="lang-en hidden-lang">Priorities: <strong class="text-red-500">Neurovascular</strong> (6 Ps), Compartment Syndrome & Safety.</span>
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderAssessment()}
          ${this.renderEmergencies()}
          ${this.renderFractures()}
          ${this.renderTractionCast()}
          ${this.renderArthroplasty()}
          ${this.renderPediatricMSK()} 
          ${this.renderChronicConditions()}
          ${this.renderMobilityAssist()}
          ${this.renderCrutchGaits()}
          ${this.renderOrthoMeds()}
          ${this.renderClinicalJudgment()}
        </div>
      `;
    },

    // --- 1. ASSESSMENT (NEUROVASCULAR) ---
    renderAssessment() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Evaluación Neurovascular (CMS)', 'Neurovascular Assessment (CMS)')}
            </h2>
          </div>

          <div class="bg-stone-50 dark:bg-stone-900/10 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-lg">
            <strong class="text-xl text-stone-800 dark:text-stone-300 block mb-4 border-b border-stone-200 pb-2">
              ${t('Prioridad #1: Las 6 Ps', 'Priority #1: The 6 Ps')}
            </strong>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div class="p-4 bg-white dark:bg-brand-card rounded-xl border-t-4 border-red-500 shadow-sm">
                  <strong class="block text-red-600 dark:text-red-400 mb-1 text-lg">C - Circulation</strong>
                  <ul class="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                     <li>${t('<strong>Color:</strong> Rosado vs Pálido/Cianótico', '<strong>Color:</strong> Pink vs Pale/Cyanotic')}</li>
                     <li>${t('<strong>Temp:</strong> Caliente vs Frío', '<strong>Temp:</strong> Warm vs Cool')}</li>
                     <li>${t('<strong>Llenado Capilar:</strong> < 3 seg', '<strong>Cap Refill:</strong> < 3 sec')}</li>
                     <li>${t('<strong>Pulsos:</strong> Palpables distal a lesión', '<strong>Pulses:</strong> Palpable distal to injury')}</li>
                  </ul>
               </div>
               <div class="p-4 bg-white dark:bg-brand-card rounded-xl border-t-4 border-green-500 shadow-sm">
                  <strong class="block text-green-600 dark:text-green-400 mb-1 text-lg">M - Motion</strong>
                  <ul class="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                     <li>${t('Movimiento activo distal.', 'Active movement distal.')}</li>
                     <li>${t('Debilidad = Daño motor/nervioso.', 'Weakness = Motor/nerve damage.')}</li>
                  </ul>
               </div>
               <div class="p-4 bg-white dark:bg-brand-card rounded-xl border-t-4 border-purple-500 shadow-sm">
                  <strong class="block text-purple-600 dark:text-purple-400 mb-1 text-lg">S - Sensation</strong>
                  <ul class="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                     <li>${t('<strong>Parestesia:</strong> Hormigueo (Signo temprano).', '<strong>Paresthesia:</strong> Tingling (Early sign).')}</li>
                     <li>${t('Dolor (Escala 0-10).', 'Pain (0-10 Scale).')}</li>
                  </ul>
               </div>
            </div>
            <div class="mt-4 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                <strong class="text-amber-800 dark:text-amber-300 block mb-1">${t('Signos de ALARMA:', 'RED FLAGS:')}</strong>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    ${t('Dolor desproporcionado, pérdida de pulso, "dedos blancos". <strong>"Signo del yeso":</strong> Dolor intenso que aumenta con la elevación.', 'Disproportionate pain, loss of pulse, "white fingers". <strong>"Cast Sign":</strong> Severe pain that increases with elevation.')}
                </p>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. EMERGENCIES ---
    renderEmergencies() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-lg animate-pulse">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Emergencias Críticas', 'Critical Emergencies')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border-2 border-red-500 relative overflow-hidden">
              <div class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase">Top Priority</div>
              <strong class="text-red-800 dark:text-red-300 text-xl block mb-2">
                ${t('Síndrome Compartimental', 'Compartment Syndrome')}
              </strong>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                ${t('Presión tisular > perfusión capilar. Isquemia irreversible en 4-6h.', 'Tissue pressure > capillary perfusion. Irreversible ischemia in 4-6h.')}
              </p>
              
              <ul class="text-base space-y-3 text-gray-800 dark:text-gray-200">
                <li class="flex items-start gap-2">
                  <i class="fa-solid fa-triangle-exclamation text-red-600 mt-1"></i>
                  <span>
                    ${t('<strong>Signo #1:</strong> Dolor intenso que NO cede con opioides y aumenta con el <strong>estiramiento pasivo</strong>.', '<strong>Sign #1:</strong> Severe pain UNRELIEVED by meds and increases with <strong>passive stretch</strong>.')}
                  </span>
                </li>
                <li class="pl-6 text-sm">
                   ${t('<strong>Signos Tardíos (No esperar):</strong> Ausencia de pulso, Parálisis, Palidez.', '<strong>Late Signs (Do not wait):</strong> Pulselessness, Paralysis, Pallor.')}
                </li>
              </ul>
              
              <div class="mt-4 p-3 bg-white dark:bg-black/30 rounded-xl border border-red-200 dark:border-red-800/50">
                 <strong class="block text-red-600 dark:text-red-400 text-xs uppercase mb-1">${t('ACCIÓN DE ENFERMERÍA', 'NURSING ACTION')}</strong>
                 <ul class="text-xs text-gray-800 dark:text-gray-200 list-decimal list-inside font-bold">
                    <li>${t('Notificar al MD Inmediatamente.', 'Notify MD Immediately.')}</li>
                    <li>${t('<strong>NO elevar</strong> (empeora isquemia).', '<strong>DO NOT elevate</strong> (worsens ischemia).')}</li>
                    <li>${t('Aflojar vendajes/bivalvar yeso.', 'Loosen dressings/bivalve cast.')}</li>
                    <li>${t('Preparar Fasciotomía.', 'Prepare Fasciotomy.')}</li>
                 </ul>
              </div>
            </div>

            <div class="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-3xl border border-orange-200 dark:border-orange-800">
              <strong class="text-orange-800 dark:text-orange-300 text-xl block mb-2">
                ${t('Síndrome de Embolia Grasa (FES)', 'Fat Embolism Syndrome (FES)')}
              </strong>
              <p class="text-xs text-gray-500 mb-3 font-bold uppercase">${t('Riesgo: Fracturas Huesos Largos (Fémur) 24-72h', 'Risk: Long Bone Fx (Femur) 24-72h')}</p>
              
              <div class="bg-white dark:bg-black/20 p-3 rounded-xl mb-3 shadow-sm">
                 <strong class="text-orange-600 text-sm block mb-1">${t('TRIADA CLÁSICA', 'CLASSIC TRIAD')}</strong>
                 <ol class="text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside space-y-1">
                    <li>${t('<strong>Hipoxemia (Resp):</strong> Disnea, dolor pecho, ↓SpO2.', '<strong>Hypoxemia (Resp):</strong> Dyspnea, chest pain, ↓SpO2.')}</li>
                    <li>${t('<strong>Cambios Neuro:</strong> Confusión, inquietud (signo temprano).', '<strong>Neuro Changes:</strong> Confusion, restlessness (early sign).')}</li>
                    <li>${t('<strong>Petequias:</strong> Tórax, axilas, cuello (distintivo).', '<strong>Petechiae:</strong> Chest, axilla, neck (hallmark).')}</li>
                 </ol>
              </div>

              <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl border border-orange-200 dark:border-orange-800">
                 <strong class="block text-orange-800 dark:text-orange-200 text-xs mb-1">${t('MANEJO', 'MANAGEMENT')}</strong>
                 <ul class="text-xs text-gray-800 dark:text-gray-200 list-disc list-inside">
                    <li>${t('<strong>Inmovilización temprana</strong> (Prevención).', '<strong>Early immobilization</strong> (Prevention).')}</li>
                    <li>${t('Oxígeno de alto flujo.', 'High-flow oxygen.')}</li>
                    <li>${t('Hidratación agresiva.', 'Aggressive hydration.')}</li>
                 </ul>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 3. COMMON FRACTURES ---
    renderFractures() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Fracturas Comunes (High-Yield)', 'Common Fractures (High-Yield)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="med-card border-t-4 border-blue-500">
              <strong class="text-blue-600 dark:text-blue-400 block mb-2 text-lg">${t('Cadera (Hip)', 'Hip Fracture')}</strong>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>${t('<strong>Signo:</strong> Pierna acortada y rotada externamente.', '<strong>Sign:</strong> Leg shortened and externally rotated.')}</li>
                <li>${t('<strong>Intracapsular:</strong> Riesgo necrosis avascular.', '<strong>Intracapsular:</strong> Avascular necrosis risk.')}</li>
                <li>${t('<strong>Complicación:</strong> Hemorragia, TVP/TEP.', '<strong>Complication:</strong> Hemorrhage, DVT/PE.')}</li>
              </ul>
            </div>
            <div class="med-card border-t-4 border-green-500">
              <strong class="text-green-600 dark:text-green-400 block mb-2 text-lg">${t('Muñeca (Colles)', 'Wrist (Colles)')}</strong>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>${t('<strong>Causa:</strong> Caída con mano extendida (FOOSH).', '<strong>Cause:</strong> Fall on outstretched hand (FOOSH).')}</li>
                <li>${t('<strong>Deformidad:</strong> "Mano en tenedor".', '<strong>Deformity:</strong> "Dinner fork".')}</li>
                <li>${t('<strong>Riesgo:</strong> Túnel carpiano agudo.', '<strong>Risk:</strong> Acute carpal tunnel.')}</li>
              </ul>
            </div>
            <div class="med-card border-t-4 border-purple-500">
              <strong class="text-purple-600 dark:text-purple-400 block mb-2 text-lg">${t('Vertebral (Compresión)', 'Vertebral (Compression)')}</strong>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>${t('<strong>Población:</strong> Osteoporosis (Mujeres post-meno).', '<strong>Population:</strong> Osteoporosis (Post-meno women).')}</li>
                <li>${t('<strong>Síntoma:</strong> Dolor lumbar súbito al toser/agacharse.', '<strong>Symptom:</strong> Sudden back pain w/ coughing/bending.')}</li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. CAST & TRACTION ---
    renderTractionCast() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-black text-lg shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Yesos y Tracción', 'Casts & Traction')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="bg-white dark:bg-brand-card p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-lg">
                <strong class="block text-stone-800 dark:text-stone-300 text-xl mb-3">${t('Cuidado del Yeso', 'Cast Care')}</strong>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                   <li class="flex gap-2 items-start"><i class="fa-solid fa-hand-paper text-amber-500 mt-1"></i> ${t('<strong>Manejo:</strong> Usar PALMAS (no dedos) mientras está húmedo para evitar abolladuras.', '<strong>Handling:</strong> Use PALMS (not fingers) while wet to prevent dents.')}</li>
                   <li class="flex gap-2 items-start"><i class="fa-solid fa-wind text-blue-500 mt-1"></i> ${t('<strong>Picazón:</strong> NUNCA meter objetos. Usar aire frío (secador).', '<strong>Itching:</strong> NEVER insert objects. Use cool air (dryer).')}</li>
                   <li class="flex gap-2 items-start"><i class="fa-solid fa-temperature-arrow-up text-red-500 mt-1"></i> ${t('<strong>Puntos Calientes:</strong> Signo de infección bajo el yeso.', '<strong>Hot Spots:</strong> Sign of infection under cast.')}</li>
                   <li class="flex gap-2 items-start"><i class="fa-solid fa-nose text-purple-500 mt-1"></i> ${t('<strong>Olor Fétido:</strong> Necrosis o infección.', '<strong>Foul Odor:</strong> Necrosis or infection.')}</li>
                </ul>
             </div>

             <div class="bg-white dark:bg-brand-card p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-lg">
                <strong class="block text-stone-800 dark:text-stone-300 text-xl mb-3">${t('Tracción (Traction)', 'Traction')}</strong>
                <div class="space-y-3">
                   <div class="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl">
                      <strong class="text-stone-700 dark:text-stone-300 text-sm block">Buck's (Cutánea)</strong>
                      <p class="text-xs text-gray-600 dark:text-gray-400">${t('Sin pines. Para fractura de cadera pre-op (reduce espasmos).', 'No pins. Hip fx pre-op (reduces spasms).')}</p>
                   </div>
                   <div class="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl">
                      <strong class="text-stone-700 dark:text-stone-300 text-sm block">Esquelética (Pines)</strong>
                      <p class="text-xs text-gray-600 dark:text-gray-400">${t('Pines en hueso. <strong>Cuidado:</strong> Clorhexidina/Salina (1 hisopo/pin). Reportar pus.', 'Pins in bone. <strong>Pin Care:</strong> Chlorhexidine/Saline (1 swab/pin). Report pus.')}</p>
                   </div>
                   <div class="p-3 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10 rounded-r-xl text-xs">
                      <strong class="text-red-600 block uppercase mb-1">${t('REGLA DE ORO', 'GOLDEN RULE')}</strong>
                      ${t('¡LAS PESAS DEBEN COLGAR LIBREMENTE! Nunca en el suelo o cama. No levantar sin orden.', 'WEIGHTS MUST HANG FREELY! Never on floor/bed. Do not lift without order.')}
                   </div>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 5. ARTHROPLASTY ---
    renderArthroplasty() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white font-black text-lg shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Artroplastía y Amputación', 'Arthroplasty & Amputation')}
            </h2>
          </div>

          <div class="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-slate-700">
             <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                   <h3 class="font-bold text-xl text-teal-400 mb-4 flex items-center gap-2">
                     <i class="fa-solid fa-bone"></i> ${t('Reemplazo Total de Cadera', 'Total Hip Replacement')}
                   </h3>
                   <div class="mb-4">
                      <strong class="text-white text-sm uppercase block mb-2 opacity-80">${t('Precauciones Anti-Luxación', 'Anti-Dislocation Precautions')}</strong>
                      <ul class="text-sm text-gray-300 space-y-2">
                         <li><i class="fa-solid fa-ban text-red-500 mr-2"></i> ${t('NO Flexión > 90° (No atar zapatos).', 'NO Flexion > 90° (No tying shoes).')}</li>
                         <li><i class="fa-solid fa-ban text-red-500 mr-2"></i> ${t('NO Cruzar piernas (Aducción).', 'NO Crossing legs (Adduction).')}</li>
                         <li><i class="fa-solid fa-ban text-red-500 mr-2"></i> ${t('NO Rotación Interna.', 'NO Internal Rotation.')}</li>
                         <li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${t('Usar cojín abductor.', 'Use abductor pillow.')}</li>
                      </ul>
                   </div>
                </div>

                <div class="p-4 bg-slate-800 rounded-2xl border-l-4 border-teal-500">
                   <h3 class="font-bold text-lg text-white mb-2">${t('Cuidados de Amputación', 'Amputation Care')}</h3>
                   <ul class="text-sm text-gray-300 space-y-2">
                     <li>• <strong>24h:</strong> ${t('Elevar muñón (Edema).', 'Elevate stump (Edema).')}</li>
                     <li>• <strong>>24h:</strong> ${t('Posición <strong>PRONA</strong> (boca abajo) 20-30 min x3/día (Prevenir contractura cadera).', '<strong>PRONE</strong> position 20-30 min x3/day (Prevent hip contracture).')}</li>
                     <li>• ${t('Vendaje en figura de 8 (Dar forma).', 'Figure-8 wrapping (Shaping).')}</li>
                   </ul>
                </div>
             </div>
             
             <div class="mt-6 pt-4 border-t border-slate-700">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-500/20 rounded-lg text-blue-300 font-bold text-xs">CPM Machine</div>
                    <p class="text-xs text-gray-400">
                        ${t('Máquina de Movimiento Pasivo Continuo: Usar para prevenir rigidez post-op rodilla.', 'Continuous Passive Motion: Use to prevent post-op knee stiffness.')}
                    </p>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 6. PEDIATRIC MSK (Restored from v6/7) ---
    renderPediatricMSK() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center text-white font-black text-lg shadow-lg">P</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Ortopedia Pediátrica', 'Pediatric Orthopedics')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="med-card border-t-4 border-pink-400">
              <strong class="text-pink-600 dark:text-pink-400 block mb-2 text-sm uppercase">${t('Displasia de Cadera (DDH)', 'Hip Dysplasia (DDH)')}</strong>
              <ul class="text-xs md:text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>${t('<strong>Signos:</strong> Pliegues glúteos asimétricos, Ortolani/Barlow (+).', '<strong>Signs:</strong> Asymmetric gluteal folds, Ortolani/Barlow (+).')}</li>
                <li>
                  <strong class="text-pink-700">Arnés de Pavlik:</strong>
                  <ul class="list-disc list-inside ml-2 mt-1 text-xs">
                    <li>${t('Usar 23-24h. NO ajustar correas.', 'Wear 23-24h. DO NOT adjust straps.')}</li>
                    <li>${t('Camiseta debajo (proteger piel).', 'Undershirt underneath (protect skin).')}</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div class="med-card border-t-4 border-indigo-500">
              <strong class="text-indigo-600 dark:text-indigo-400 block mb-2 text-sm uppercase">Escoliosis (Scoliosis)</strong>
              <ul class="text-xs md:text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>${t('<strong>Screening:</strong> Test de Adams (inclinarse).', '<strong>Screening:</strong> Adam\'s forward bend test.')}</li>
                <li>${t('<strong>Corsé (Boston):</strong> 23h/día. Detiene progresión, no cura.', '<strong>Brace (Boston):</strong> 23h/day. Stops progression, doesn\'t cure.')}</li>
                <li>${t('<strong>Post-Op:</strong> "Log Rolling" (Rodar en bloque).', '<strong>Post-Op:</strong> "Log Rolling" technique.')}</li>
              </ul>
            </div>

            <div class="med-card border-t-4 border-blue-500">
              <strong class="text-blue-600 dark:text-blue-400 block mb-2 text-sm uppercase">${t('Pie Equinovaro (Clubfoot)', 'Clubfoot')}</strong>
              <ul class="text-xs md:text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>${t('Deformidad rígida hacia adentro.', 'Rigid inward deformity.')}</li>
                <li>${t('<strong>Tx:</strong> Manipulación y yesos semanales (Ponseti).', '<strong>Tx:</strong> Serial casting (Ponseti method).')}</li>
                <li>${t('Mantenimiento con férula años.', 'Maintenance brace for years.')}</li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 7. CHRONIC CONDITIONS (Table Restored) ---
    renderChronicConditions() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Condiciones Crónicas', 'Chronic Conditions')}
            </h2>
          </div>

          <div class="overflow-x-auto rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg mb-6">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white uppercase text-xs">
                  <th class="p-4">Feature</th>
                  <th class="p-4 text-blue-600">Osteoartritis (OA)</th>
                  <th class="p-4 text-purple-600">Rheumatoid (RA)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-brand-card text-gray-700 dark:text-gray-300">
                <tr>
                  <td class="p-4 font-bold">Etiología</td>
                  <td class="p-4">${t('Desgaste (Degenerativa).', 'Wear & Tear (Degenerative).')}</td>
                  <td class="p-4">${t('Autoinmune (Sistémica).', 'Autoimmune (Systemic).')}</td>
                </tr>
                <tr>
                  <td class="p-4 font-bold">Patrón</td>
                  <td class="p-4">${t('Asimétrico. Soporte de peso.', 'Asymmetrical. Weight bearing.')}</td>
                  <td class="p-4">${t('Simétrico. Pequeñas articulaciones.', 'Symmetrical. Small joints.')}</td>
                </tr>
                <tr>
                  <td class="p-4 font-bold">Rigidez</td>
                  <td class="p-4">${t('< 30 min (Mañana).', '< 30 min (Morning).')}</td>
                  <td class="p-4">${t('> 30 min (Horas).', '> 30 min (Hours).')}</td>
                </tr>
                <tr>
                  <td class="p-4 font-bold">Dolor</td>
                  <td class="p-4">${t('Empeora con actividad.', 'Worse with activity.')}</td>
                  <td class="p-4">${t('Mejora con movimiento.', 'Better with movement.')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="p-5 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-200 dark:border-purple-800">
                <strong class="text-purple-800 dark:text-purple-300 block text-lg mb-2">${t('Gota (Gout)', 'Gout')}</strong>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                   <li>• ${t('<strong>Dieta:</strong> Baja en Purinas (No carnes rojas, mariscos, alcohol).', '<strong>Diet:</strong> Low Purine (No red meat, shellfish, alcohol).')}</li>
                   <li>• ${t('<strong>Fluidos:</strong> 2-3L/día (Eliminar ácido úrico).', '<strong>Fluids:</strong> 2-3L/day (Flush uric acid).')}</li>
                   <li>• ${t('<strong>Meds:</strong> Colchicina (Agudo), Alopurinol (Crónico).', '<strong>Meds:</strong> Colchicine (Acute), Allopurinol (Chronic).')}</li>
                </ul>
             </div>
             <div class="p-5 bg-stone-100 dark:bg-stone-900/30 rounded-2xl border border-stone-200 dark:border-stone-700">
                <strong class="text-stone-800 dark:text-stone-300 block text-lg mb-2">Osteoporosis</strong>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                   <li>• ${t('<strong>Riesgo:</strong> Mujeres postmeno, esteroides.', '<strong>Risk:</strong> Postmeno women, steroids.')}</li>
                   <li>• ${t('<strong>Ejercicio:</strong> Carga de peso (Caminar).', '<strong>Exercise:</strong> Weight-bearing (Walking).')}</li>
                   <li>• ${t('<strong>Meds:</strong> Calcio + Vit D + Bifosfonatos.', '<strong>Meds:</strong> Calcium + Vit D + Bisphosphonates.')}</li>
                </ul>
             </div>
          </div>
        </section>
      `;
    },

    // --- 8. MOBILITY & CRUTCH GAITS ---
    renderMobilityAssist() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-lg shadow-lg">7</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Movilidad y Seguridad', 'Mobility & Safety')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div class="bg-teal-50 dark:bg-teal-900/10 p-5 rounded-2xl border border-teal-200 dark:border-teal-800">
                <strong class="text-teal-800 dark:text-teal-300 block text-lg mb-2">${t('Bastón (Cane) - COAL', 'Cane - COAL')}</strong>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                   <li>${t('<strong>C</strong>ane <strong>O</strong>pposite <strong>A</strong>ffected <strong>L</strong>eg.', '<strong>C</strong>ane <strong>O</strong>pposite <strong>A</strong>ffected <strong>L</strong>eg.')}</li>
                   <li>${t('Sostener en el lado <strong>FUERTE</strong>.', 'Hold on <strong>STRONG</strong> side.')}</li>
                   <li>${t('Mover Bastón + Pierna Mala juntos.', 'Move Cane + Bad Leg together.')}</li>
                </ul>
             </div>
             <div class="bg-white dark:bg-brand-card p-5 rounded-2xl border border-stone-200 dark:border-stone-700">
                <strong class="text-stone-800 dark:text-stone-300 block text-lg mb-2">${t('Muletas: Escaleras', 'Crutches: Stairs')}</strong>
                <div class="text-center font-bold text-gray-700 dark:text-gray-300 my-2 italic">
                   "Up with the GOOD, Down with the BAD"
                </div>
                <ul class="text-sm text-gray-600 dark:text-gray-400">
                   <li>${t('<strong>SUBIR:</strong> Pierna Buena primero.', '<strong>UP:</strong> Good leg first.')}</li>
                   <li>${t('<strong>BAJAR:</strong> Muletas + Pierna Mala primero.', '<strong>DOWN:</strong> Crutches + Bad leg first.')}</li>
                </ul>
             </div>
          </div>
        </section>
      `;
    },

    renderCrutchGaits() {
      return `
        <section class="mt-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 ml-2">
             ${t('Marchas con Muletas (Gaits)', 'Crutch Gaits')}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-gray-200 dark:border-brand-border">
              <strong class="text-teal-600 block text-sm mb-1">2-Point</strong>
              <span class="text-xs block text-gray-600 dark:text-gray-400">${t('Pie Izq + Muleta Der juntos.', 'L Foot + R Crutch together.')}</span>
            </div>
            <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-gray-200 dark:border-brand-border">
              <strong class="text-teal-600 block text-sm mb-1">3-Point</strong>
              <span class="text-xs block text-gray-600 dark:text-gray-400">${t('Pierna afectada NO toca suelo. Muletas + Pierna Mala.', 'Affected leg NO weight bearing. Crutches + Bad Leg.')}</span>
            </div>
            <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-gray-200 dark:border-brand-border">
              <strong class="text-teal-600 block text-sm mb-1">4-Point</strong>
              <span class="text-xs block text-gray-600 dark:text-gray-400">${t('Muy estable. Lento. Alternado.', 'Very stable. Slow. Alternating.')}</span>
            </div>
            <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-gray-200 dark:border-brand-border">
              <strong class="text-teal-600 block text-sm mb-1">Swing-Through</strong>
              <span class="text-xs block text-gray-600 dark:text-gray-400">${t('Paraplejia. Balanceo más allá de muletas.', 'Paraplegia. Swing past crutches.')}</span>
            </div>
          </div>
        </section>
      `;
    },

    // --- 9. PHARMACOLOGY ---
    renderOrthoMeds() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-lg">8</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Farmacología', 'Pharmacology')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="med-card border-t-4 border-emerald-500">
              <strong class="text-emerald-600 text-lg block mb-1">Bisfosfonatos (Alendronato)</strong>
              <span class="text-xs text-gray-400 uppercase font-bold mb-2 block">Osteoporosis</span>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• ${t('Estómago vacío, vaso lleno agua.', 'Empty stomach, full glass water.')}</li>
                <li>• ${t('<strong class="text-red-500">Erguido 30 min</strong> (Esofagitis).', '<strong class="text-red-500">Sit up 30 min</strong> (Esophagitis).')}</li>
              </ul>
            </div>
            
            <div class="med-card border-t-4 border-indigo-500">
              <strong class="text-indigo-600 text-lg block mb-1">Relajantes (Baclofén)</strong>
              <span class="text-xs text-gray-400 uppercase font-bold mb-2 block">Espasmos</span>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• ${t('Causa somnolencia (No conducir).', 'Causes drowsiness (No driving).')}</li>
                <li>• ${t('<strong>Baclofén:</strong> NO parar abruptamente (Convulsiones).', '<strong>Baclofen:</strong> DO NOT stop abruptly (Seizures).')}</li>
              </ul>
            </div>
            
            <div class="med-card border-t-4 border-amber-500">
              <strong class="text-amber-600 text-lg block mb-1">Metotrexato</strong>
              <span class="text-xs text-gray-400 uppercase font-bold mb-2 block">Artritis Reumatoide</span>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• ${t('Hepatotóxico (No alcohol).', 'Hepatotoxic (No alcohol).')}</li>
                <li>• ${t('Teratogénico (No embarazo).', 'Teratogenic (No pregnancy).')}</li>
                <li>• ${t('Riesgo infección.', 'Infection risk.')}</li>
              </ul>
            </div>

            <div class="med-card border-t-4 border-red-500">
              <strong class="text-red-600 text-lg block mb-1">AINEs (Ibuprofeno)</strong>
              <span class="text-xs text-gray-400 uppercase font-bold mb-2 block">Inflamación</span>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• ${t('Tomar con comida (GI).', 'Take with food (GI).')}</li>
                <li>• ${t('Riesgo úlceras y riñón.', 'Ulcer and kidney risk.')}</li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },
    
    // --- 10. CLINICAL JUDGMENT (From v8) ---
    renderClinicalJudgment() {
        return `
            <section class="mt-8 mb-12 p-6 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                    ${t('Juicio Clínico NCLEX', 'NCLEX Clinical Judgment')}
                </h3>
                <div class="space-y-4">
                    <div class="flex gap-4 items-start">
                        <div class="bg-red-100 text-red-600 p-2 rounded-lg font-bold">1</div>
                        <p class="text-sm text-gray-700 dark:text-gray-300">
                            ${t('Paciente con fractura de fémur presenta disnea y confusión. <strong>Acción Prioritaria:</strong> Administrar Oxígeno (Sospecha Embolia Grasa).', 'Femur fracture patient presents with dyspnea and confusion. <strong>Priority Action:</strong> Administer Oxygen (Suspect Fat Embolism).')}
                        </p>
                    </div>
                    <div class="flex gap-4 items-start">
                        <div class="bg-red-100 text-red-600 p-2 rounded-lg font-bold">2</div>
                        <p class="text-sm text-gray-700 dark:text-gray-300">
                            ${t('Paciente con yeso nuevo reporta "dolor quemante" que no cede. <strong>Acción Prioritaria:</strong> Notificar al MD (Sospecha Síndrome Compartimental). NO elevar.', 'Patient with new cast reports "burning pain" unrelieved. <strong>Priority Action:</strong> Notify MD (Suspect Compartment Syndrome). DO NOT elevate.')}
                        </p>
                    </div>
                </div>
            </section>
        `;
    }
  });
})();