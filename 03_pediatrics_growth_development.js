// 03_pediatrics_growth_development.js — Pediatría: Crecimiento y Desarrollo (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: High-Yield, Bilingüe, Optimizada y Completa
// FUSIÓN TÉCNICA Y DE CONTENIDO: PGDEV4-8
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Dependencias: window.NCLEX.registerTopic

(function () {
  'use strict';

  // Helper interno de traducción para código más limpio (DRY)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'peds-growth',
    title: { es: 'Pediatría: Crecimiento', en: 'Pediatrics: Growth' },
    subtitle: { es: 'Hitos, Erikson, Juego, Seguridad y Hospitalización', en: 'Milestones, Erikson, Play, Safety & Hospital' },
    icon: 'child-reaching',
    color: 'emerald',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-shapes"></i>
                <span class="lang-es">Masterclass Pediatría</span>
                <span class="lang-en hidden-lang">Peds Masterclass</span>
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Desarrollo Infantil Completo', 'Comprehensive Growth & Dev')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('Hitos Motores, Teorías (Erikson/Piaget), Reflejos, Seguridad y Hospitalización.', 'Motor Milestones, Theorists (Erikson/Piaget), Reflexes, Safety & Hospitalization.')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderTheoristsTable()}
          ${this.renderInfant()}
          ${this.renderToddler()}
          ${this.renderPreschool()}
          ${this.renderSchoolAge()}
          ${this.renderAdolescent()}
          ${this.renderPlayTypes()}
          ${this.renderHospitalizationAndDeath()}
          ${this.renderPainScales()}
        </div>
      `;
    },

    // --- 1. Erikson & Piaget (Theorists Table - Reintegrado por alto valor visual) ---
    renderTheoristsTable() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white font-black text-lg shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Resumen de Teorías', 'Theorists Summary')}
            </h2>
          </div>
          <div class="overflow-x-auto bg-white dark:bg-brand-card rounded-3xl shadow-xl border border-gray-200 dark:border-brand-border">
            <table class="w-full text-sm md:text-base text-left">
              <thead class="bg-slate-800 text-white uppercase text-xs tracking-wider">
                <tr>
                  <th scope="col" class="px-6 py-4">${t('Edad', 'Age')}</th>
                  <th scope="col" class="px-6 py-4">Erikson (${t('Psicosocial', 'Psychosocial')})</th>
                  <th scope="col" class="px-6 py-4">Piaget (${t('Cognitivo', 'Cognitive')})</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 font-medium text-gray-700 dark:text-gray-300">
                <tr class="bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors">
                  <td class="px-6 py-4 font-bold">${t('Lactante (0-1)', 'Infant (0-1)')}</td>
                  <td class="px-6 py-4"><div class="font-bold text-blue-700 dark:text-blue-300">Trust vs Mistrust</div></td>
                  <td class="px-6 py-4">Sensorimotor</td>
                </tr>
                <tr class="bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors">
                  <td class="px-6 py-4 font-bold">${t('Niño peq. (1-3)', 'Toddler (1-3)')}</td>
                  <td class="px-6 py-4"><div class="font-bold text-amber-700 dark:text-amber-300">Autonomy vs Shame</div></td>
                  <td class="px-6 py-4">Pre-operational</td>
                </tr>
                <tr class="bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors">
                  <td class="px-6 py-4 font-bold">${t('Preescolar (3-6)', 'Preschool (3-6)')}</td>
                  <td class="px-6 py-4"><div class="font-bold text-purple-700 dark:text-purple-300">Initiative vs Guilt</div></td>
                  <td class="px-6 py-4">Pre-operational <br><span class="text-xs italic">(Magical Thinking)</span></td>
                </tr>
                <tr class="bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors">
                  <td class="px-6 py-4 font-bold">${t('Escolar (6-12)', 'School (6-12)')}</td>
                  <td class="px-6 py-4"><div class="font-bold text-green-700 dark:text-green-300">Industry vs Inferiority</div></td>
                  <td class="px-6 py-4">Concrete Ops</td>
                </tr>
                 <tr class="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors">
                  <td class="px-6 py-4 font-bold">${t('Adolescente (12-18)', 'Adolescent (12-18)')}</td>
                  <td class="px-6 py-4"><div class="font-bold text-gray-700 dark:text-gray-300">Identity vs Confusion</div></td>
                  <td class="px-6 py-4">Formal Ops</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      `;
    },

    // --- 2. Infant (0-12m) ---
    renderInfant() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-lg">2</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Lactante (0-12 Meses)', 'Infant (0-12 Months)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="text-lg font-black text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-baby"></i> ${t('Hitos Motores', 'Motor Milestones')}
              </h3>
              <ul class="text-sm space-y-3 text-gray-700 dark:text-gray-300">
                <li class="pl-3 border-l-4 border-emerald-400"><strong>2 mo:</strong> ${t('Sonrisa Social, Levanta cabeza (prono).', 'Social Smile, Lifts head (prone).')}</li>
                <li class="pl-3 border-l-4 border-emerald-400"><strong>4 mo:</strong> ${t('Rueda (Rolls). Control cabeza. Desaparece Moro.', 'Rolls over. Head control. Moro gone.')}</li>
                <li class="pl-3 border-l-4 border-emerald-400"><strong>6 mo:</strong> ${t('Sienta con apoyo. Balbucea.', 'Sits with support. Babbles.')}</li>
                <li class="pl-3 border-l-4 border-emerald-400"><strong>8-9 mo:</strong> ${t('Sienta SOLO. Pinza (Pincer). Gatea. Ansiedad extraños.', 'Sits ALONE. Pincer grasp. Crawls. Stranger anxiety.')}</li>
                <li class="pl-3 border-l-4 border-emerald-400"><strong>12 mo:</strong> ${t('Camina. Dice 3-5 palabras.', 'Walks. Says 3-5 words.')}</li>
              </ul>
              
              <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
                 <strong class="text-blue-700 dark:text-blue-300 text-xs uppercase block mb-1">${t('Reglas de Peso y Fontanelas', 'Weight & Fontanels')}</strong>
                 <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                    <li>${t('<strong>Peso:</strong> Duplica @ 6 meses. Triplica @ 1 año.', '<strong>Weight:</strong> Doubles @ 6 mos. Triples @ 1 yr.')}</li>
                    <li>${t('<strong>Fontanela Post:</strong> Cierra 2-3 meses.', '<strong>Post Fontanel:</strong> Closes 2-3 mos.')}</li>
                    <li>${t('<strong>Fontanela Ant:</strong> Cierra 12-18 meses.', '<strong>Ant Fontanel:</strong> Closes 12-18 mos.')}</li>
                 </ul>
              </div>
            </div>

            <div class="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-800 shadow-lg">
              <strong class="block text-emerald-800 dark:text-emerald-300 text-lg mb-3">
                <i class="fa-solid fa-shield-halved"></i> ${t('Seguridad y Reflejos', 'Safety & Reflexes')}
              </strong>
              
              <div class="mb-4 bg-white dark:bg-black/20 p-3 rounded-xl">
                 <strong class="text-xs uppercase text-gray-500 mb-1 block">${t('Reflejos Primitivos', 'Primitive Reflexes')}</strong>
                 <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>Moro/Rooting:</strong> ${t('Desaparece a los 4 meses.', 'Disappears at 4 mos.')}</li>
                    <li><strong>Babinski:</strong> ${t('Positivo (dedos abanicados) es NORMAL < 1 año. Anormal si camina.', 'Positive (fanning toes) NORMAL < 1 yr. Abnormal if walking.')}</li>
                 </ul>
              </div>

              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                <li class="flex gap-2 items-start"><i class="fa-solid fa-bed text-red-500 mt-1"></i> ${t('<strong>SIDS:</strong> Dormir boca arriba (Back to sleep).', '<strong>SIDS:</strong> Back to sleep.')}</li>
                <li class="flex gap-2 items-start"><i class="fa-solid fa-car text-blue-500 mt-1"></i> ${t('<strong>Auto:</strong> Mirando ATRÁS (Rear-facing) hasta 2 años.', '<strong>Car:</strong> Rear-facing until 2 years.')}</li>
                <li class="flex gap-2 items-start"><i class="fa-solid fa-ban text-orange-500 mt-1"></i> ${t('<strong>NO Miel:</strong> Riesgo botulismo (< 1 año).', '<strong>NO Honey:</strong> Botulism risk (< 1 yr).')}</li>
                <li class="flex gap-2 items-start"><i class="fa-solid fa-cow text-purple-500 mt-1"></i> ${t('<strong>Leche:</strong> Entera solo al año (no antes).', '<strong>Milk:</strong> Whole milk only at 1 yr.')}</li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 3. Toddler (1-3y) ---
    renderToddler() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Niño Pequeño (1-3 Años)', 'Toddler (1-3 Years)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <h3 class="text-lg font-black text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-person-walking"></i> ${t('Desarrollo y Conducta', 'Development & Behavior')}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                ${t('Autonomía vs Vergüenza. Negativismo ("NO"). Ritualismo (Rutinas).', 'Autonomy vs Shame. Negativism ("NO"). Ritualism (Routines).')}
              </p>
              
              <div class="mb-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border-l-4 border-blue-500">
                 <strong class="block text-blue-700 dark:text-blue-300 text-sm mb-1">${t('Motricidad Fina (Bloques)', 'Fine Motor (Blocks)')}</strong>
                 <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                    <li>15 mo: ${t('2 bloques', '2 blocks')}</li>
                    <li>18 mo: ${t('3-4 bloques', '3-4 blocks')}</li>
                    <li>24 mo: ${t('6-7 bloques', '6-7 blocks')}</li>
                 </ul>
              </div>

              <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                 <strong class="text-xs uppercase text-gray-600 dark:text-gray-400 block mb-1">${t('Entrenamiento Baño (18-24m)', 'Toilet Training (18-24m)')}</strong>
                 <span class="text-xs text-gray-700 dark:text-gray-300">${t('Signos: Pañal seco 2h+, interés, sigue instrucciones.', 'Signs: Dry diaper 2h+, interest, follows instructions.')}</span>
              </div>
            </div>

            <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
              <strong class="block text-gray-900 dark:text-white text-lg mb-3">
                <i class="fa-solid fa-utensils text-orange-500"></i> ${t('Nutrición & Seguridad', 'Nutrition & Safety')}
              </strong>
              
              <div class="mb-4">
                <strong class="text-sm text-gray-800 dark:text-gray-200">${t('Anorexia Fisiológica', 'Physiologic Anorexia')}</strong>
                <p class="text-xs text-gray-500 mt-1">
                  ${t('Comen menos por crecimiento lento. No forzar.', 'Eat less due to slow growth. Do not force.')}
                </p>
              </div>

              <div class="p-3 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10 rounded-r-xl">
                 <span class="font-bold text-red-600 uppercase text-xs tracking-wider block mb-1">${t('PELIGRO ASFIXIA', 'CHOKING HAZARDS')}</span>
                 <p class="text-sm font-bold text-gray-700 dark:text-gray-300">
                    ${t('Uvas enteras, Hot dogs, Nueces, Mantequilla de maní espesa, Palomitas.', 'Whole grapes, Hot dogs, Nuts, Thick peanut butter, Popcorn.')}
                 </p>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Preschool (3-6y) ---
    renderPreschool() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white font-black text-lg shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Preescolar (3-6 Años)', 'Preschool (3-6 Years)')}
            </h2>
          </div>

          <div class="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-3xl border border-purple-200 dark:border-purple-800 shadow-lg">
             <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-1">
                   <h3 class="text-lg font-black text-purple-800 dark:text-purple-300 mb-2">
                     ${t('Pensamiento Mágico', 'Magical Thinking')}
                   </h3>
                   <p class="text-sm text-gray-700 dark:text-gray-300 mb-4">
                     ${t('Iniciativa vs Culpa. Creen que pensamientos causan eventos ("Hermano enfermó porque me enojé"). Animismo.', 'Initiative vs Guilt. Thoughts cause events ("Brother sick because I was mad"). Animism.')}
                   </p>
                   <div class="p-3 bg-white dark:bg-black/20 rounded-xl border border-purple-100 dark:border-purple-800">
                      <strong class="text-xs uppercase text-purple-600 dark:text-purple-400 block mb-1">${t('Intervención', 'Intervention')}</strong>
                      <p class="text-xs text-gray-600 dark:text-gray-400">
                        ${t('Usar juego médico (muñecas). Explicar que enfermedad NO es castigo. Términos literales.', 'Use medical play (dolls). Explain illness is NOT punishment. Literal terms.')}
                      </p>
                   </div>
                </div>
                <div class="flex-1 border-l-2 border-purple-200 dark:border-purple-800 pl-4">
                   <strong class="block text-gray-900 dark:text-white mb-2 text-sm">${t('Hitos Motores', 'Motor Milestones')}</strong>
                   <ul class="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                      <li><i class="fa-solid fa-bicycle text-purple-500 mr-2"></i> ${t('<strong>3 años:</strong> Triciclo. Copia círculo.', '<strong>3 yrs:</strong> Tricycle. Copies circle.')}</li>
                      <li><i class="fa-solid fa-scissors text-purple-500 mr-2"></i> ${t('<strong>4 años:</strong> Tijeras. Salta en un pie.', '<strong>4 yrs:</strong> Scissors. Hops on one foot.')}</li>
                      <li><i class="fa-solid fa-shoe-prints text-purple-500 mr-2"></i> ${t('<strong>5 años:</strong> Ata zapatos. Copia triángulo.', '<strong>5 yrs:</strong> Ties shoes. Copies triangle.')}</li>
                   </ul>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 5. School Age (6-12y) ---
    renderSchoolAge() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-lg shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Escolar (6-12 Años)', 'School Age (6-12 Years)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
                <h3 class="text-lg font-black text-orange-600 dark:text-orange-400 mb-2">
                  ${t('Industria & Reglas', 'Industry & Rules')}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  ${t('Competencia, logros, escuela. Pensamiento concreto. Coleccionan cosas. Miedo a perder control.', 'Competence, achievement, school. Concrete thinking. Collecting items. Fear loss of control.')}
                </p>
                <div class="p-2 bg-orange-50 dark:bg-orange-900/10 rounded-lg text-xs border border-orange-100 dark:border-orange-800">
                    <strong class="block mb-1">${t('Inicio Pubertad', 'Puberty Onset')}</strong>
                    ${t('Chicas: Botón mamario. Chicos: Agrandamiento testicular.', 'Girls: Breast buds. Boys: Testicular enlargement.')}
                </div>
             </div>
             
             <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg">
                <strong class="block text-gray-900 dark:text-white mb-2">${t('Salud Común', 'Common Health')}</strong>
                <div class="space-y-3">
                   <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <strong class="text-xs text-orange-600 uppercase block">Pediculosis (Piojos)</strong>
                      <p class="text-xs text-gray-600 dark:text-gray-400">${t('No saltan. Contacto directo. Liendres blancas pegadas.', 'Do not jump. Direct contact. White nits stuck to hair.')}</p>
                   </div>
                   <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <strong class="text-xs text-orange-600 uppercase block">Escoliosis</strong>
                      <p class="text-xs text-gray-600 dark:text-gray-400">${t('Screening preadolescente. Corsé 23h/día si es necesario.', 'Preadolescent screening. Brace 23h/day if needed.')}</p>
                   </div>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 6. Adolescent (12-18y) ---
    renderAdolescent() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white font-black text-lg shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Adolescente (12-18 Años)', 'Adolescent (12-18 Years)')}
            </h2>
          </div>

          <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-200 dark:border-red-800 shadow-lg">
             <h3 class="text-lg font-black text-red-700 dark:text-red-400 mb-2">
               ${t('Identidad e Independencia', 'Identity & Independence')}
             </h3>
             <p class="text-sm text-gray-700 dark:text-gray-300 mb-4">
               ${t('Pares (#1 prioridad). Imagen corporal. "Invencibilidad" (riesgo de accidentes).', 'Peers (#1 priority). Body image. "Invincibility" (risk of accidents).')}
             </p>
             
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white dark:bg-black/20 p-4 rounded-xl border border-red-100 dark:border-red-900">
                   <strong class="block text-red-600 dark:text-red-300 text-sm uppercase mb-1">${t('Salud & Seguridad', 'Health & Safety')}</strong>
                   <ul class="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                      <li>${t('<strong>#1 Causa Muerte:</strong> Accidentes vehículos.', '<strong>#1 Cause Death:</strong> Car accidents.')}</li>
                      <li>${t('<strong>#2 Causa:</strong> Suicidio (Monitorear depresión).', '<strong>#2 Cause:</strong> Suicide (Monitor depression).')}</li>
                      <li>${t('<strong>Vacunas:</strong> VPH (Gardasil), Tdap, Meningococo.', '<strong>Vaccines:</strong> HPV, Tdap, Meningococcal.')}</li>
                   </ul>
                </div>
                <div class="bg-white dark:bg-black/20 p-4 rounded-xl border border-red-100 dark:border-red-900">
                   <strong class="block text-red-600 dark:text-red-300 text-sm uppercase mb-1">${t('Privacidad', 'Privacy')}</strong>
                   <p class="text-xs text-gray-600 dark:text-gray-400">
                      ${t('Entrevistar SIN padres para temas sensibles (sexo, drogas). Honestidad sobre confidencialidad.', 'Interview WITHOUT parents for sensitive topics (sex, drugs). Honest regarding confidentiality.')}
                   </p>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 7. Play Types ---
    renderPlayTypes() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center text-white font-black text-lg shadow-lg">7</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Tipos de Juego (Parten)', 'Types of Play (Parten)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border-b-4 border-pink-500 shadow-sm text-center">
                <strong class="block text-pink-600 dark:text-pink-400">Solitary</strong>
                <span class="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 px-2 rounded">Infant</span>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">${t('Juega solo.', 'Plays alone.')}</p>
             </div>
             <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border-b-4 border-blue-500 shadow-sm text-center">
                <strong class="block text-blue-600 dark:text-blue-400">Parallel</strong>
                <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 rounded">Toddler</span>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">${t('Juega AL LADO, no con ellos.', 'Plays BESIDE, not with them.')}</p>
             </div>
             <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border-b-4 border-purple-500 shadow-sm text-center">
                <strong class="block text-purple-600 dark:text-purple-400">Associative</strong>
                <span class="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 rounded">Preschool</span>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">${t('Juego desorganizado, sin reglas.', 'Unorganized, no rules.')}</p>
             </div>
             <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border-b-4 border-green-500 shadow-sm text-center">
                <strong class="block text-green-600 dark:text-green-400">Cooperative</strong>
                <span class="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 rounded">School</span>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">${t('Líderes, Reglas, Metas.', 'Leaders, Rules, Goals.')}</p>
             </div>
          </div>
        </section>
      `;
    },

    // --- 8. Hospitalization & Death ---
    renderHospitalizationAndDeath() {
      return `
        <section>
          <div class="mt-8 mb-8 p-6 bg-slate-900 text-white rounded-3xl shadow-xl border border-slate-700">
            <h3 class="text-xl font-bold mb-6 text-center text-emerald-400 uppercase tracking-widest">
              <i class="fa-solid fa-hospital"></i> ${t('Hospitalización y Muerte', 'Hospitalization & Death')}
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div class="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <strong class="text-amber-400 block mb-2">${t('Ansiedad Separación (Toddler)', 'Separation Anxiety (Toddler)')}</strong>
                  <ol class="text-sm text-gray-300 list-decimal list-inside space-y-1">
                     <li><strong>Protest:</strong> ${t('Grita, llora, busca.', 'Screams, cries, seeks.')}</li>
                     <li><strong>Despair:</strong> ${t('Silencioso, deprimido.', 'Quiet, depressed.')}</li>
                     <li><strong>Detachment:</strong> ${t('Ignora a padres (Malo).', 'Ignores parents (Bad).')}</li>
                  </ol>
               </div>

               <div class="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <strong class="text-purple-400 block mb-2">${t('Preescolar: Pensamiento Mágico', 'Preschool: Magical Thinking')}</strong>
                  <p class="text-xs text-gray-300 mb-2">${t('Muerte = Sueño (Reversible). Culpa (creen que lo causaron).', 'Death = Sleep (Reversible). Guilt (think they caused it).')}</p>
                  <em class="text-xs text-gray-400 block border-t border-white/10 pt-2">${t('Intervención: Explicaciones literales y concretas.', 'Intervention: Literal, concrete explanations.')}</em>
               </div>

               <div class="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <strong class="text-green-400 block mb-2">${t('Escolar/Teen', 'School/Teen')}</strong>
                  <p class="text-xs text-gray-300 mb-2">${t('Muerte = Irreversible, Universal. Miedo al dolor/mutilación.', 'Death = Irreversible, Universal. Fear of pain/mutilation.')}</p>
                  <em class="text-xs text-gray-400 block border-t border-white/10 pt-2">${t('Dar control y privacidad.', 'Give control and privacy.')}</em>
               </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 9. Pain Scales ---
    renderPainScales() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white font-black text-lg shadow-lg">8</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Escalas de Dolor', 'Pain Scales')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
             <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-red-200 dark:border-red-900 shadow-sm">
                <strong class="text-red-600 dark:text-red-400 block text-lg mb-1">FLACC</strong>
                <p class="text-xs text-gray-500 mb-2">2 mo - 7 yrs</p>
                <p class="text-sm text-gray-700 dark:text-gray-300">${t('Face, Legs, Activity, Cry. (Observacional).', 'Face, Legs, Activity, Cry. (Observational).')}</p>
             </div>
             <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-yellow-200 dark:border-yellow-900 shadow-sm">
                <strong class="text-yellow-600 dark:text-yellow-400 block text-lg mb-1">FACES</strong>
                <p class="text-xs text-gray-500 mb-2">3 yrs +</p>
                <p class="text-sm text-gray-700 dark:text-gray-300">${t('Niño señala la cara.', 'Child points to face.')}</p>
             </div>
             <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-blue-200 dark:border-blue-900 shadow-sm">
                <strong class="text-blue-600 dark:text-blue-400 block text-lg mb-1">Numeric</strong>
                <p class="text-xs text-gray-500 mb-2">5 yrs +</p>
                <p class="text-sm text-gray-700 dark:text-gray-300">${t('Escala 0-10 (Requiere orden numérico).', 'Scale 0-10 (Requires number order).')}</p>
             </div>
          </div>
        </section>
      `;
    }
  });
})();