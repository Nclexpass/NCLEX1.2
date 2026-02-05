// 21_infectious_immune.js — Infectious & Immune Masterclass (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: Isolation, PPE, HIV/AIDS, Anaphylaxis, Diseases & Vaccines
// CREADO POR REYNIER DIAZ GERONES, 01-21-2026
// FUSIÓN TÉCNICA Y ACADÉMICA OPTIMIZADA
// Dependencias: window.NCLEX.registerTopic

(function() {
  'use strict';

  // Helper interno para traducción (Arquitectura DRY tomada de v8)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  NCLEX.registerTopic({
    id: 'infectious',
    title: { es: 'Infecciosas e Inmunes', en: 'Infectious & Immune' },
    subtitle: { es: 'Aislamiento, EPP, VIH y Vacunas', en: 'Isolation, PPE, HIV & Vaccines' },
    icon: 'shield-virus',
    color: 'green',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-2 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-biohazard"></i>
                ${t('Control de Infecciones Masterclass', 'Infection Control Masterclass')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                ${t('Infecciosas e Inmunología', 'Infectious & Immunology')}
              </h1>
              <p class="text-lg text-gray-500 mt-2">
                ${t('Precauciones, EPP, VIH, Emergencias y Vacunación.', 'Precautions, PPE, HIV, Emergencies & Vaccination.')}
              </p>
            </div>
            <div class="lang-switch"></div>
          </div>
        </header>

        <div class="space-y-12 animate-slide-in-up">
          ${this.renderIsolation()}
          ${this.renderPPE()}
          ${this.renderImmuneEmergencies()}
          ${this.renderAutoimmune()}
          ${this.renderHIV()}
          ${this.renderInfectiousDiseases()}
          ${this.renderVaccinations()}
          ${this.renderQuiz()}
        </div>
      `;
    },

    // --- 1. Isolation Precautions (Contenido detallado de v6 con arquitectura de v8) ---
    renderIsolation() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">1</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Precauciones de Aislamiento', 'Isolation Precautions')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div class="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border-t-4 border-blue-500 shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <strong class="text-xl text-blue-800 dark:text-blue-300">AIRBORNE</strong>
                <i class="fa-solid fa-wind text-blue-400 text-xl"></i>
              </div>
              <p class="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Mnemonic: MTV + RR</p>
              <ul class="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-4">
                <li><strong>M</strong>easles (${t('Sarampión', 'Measles')})</li>
                <li><strong>T</strong>uberculosis (TB) ${t('pulmonar o laríngea', 'pulmonary or laryngeal')}</li>
                <li><strong>V</strong>aricella (Chickenpox)</li>
                <li><strong>R</strong>ubeola (Rubella/German Measles)</li>
                <li><strong>R</strong> (Varicella Zoster) - ${t('herpes zóster diseminado', 'disseminated herpes zoster')}</li>
              </ul>
              <div class="p-3 bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-blue-900 text-xs">
                <strong class="block text-blue-700 dark:text-blue-400 mb-1">
                  ${t('Requisitos:', 'Requirements:')}
                </strong>
                ${t('Máscara N95 + Cuarto de presión negativa + Puerta cerrada.', 'N95 Mask + Negative pressure room + Door closed.')}
              </div>
            </div>

            <div class="p-6 bg-green-50 dark:bg-green-900/10 rounded-3xl border-t-4 border-green-500 shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <strong class="text-xl text-green-800 dark:text-green-300">DROPLET</strong>
                <i class="fa-solid fa-head-side-cough text-green-400 text-xl"></i>
              </div>
              <p class="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Mnemonic: SPIDERMAN</p>
              <ul class="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-4">
                <li><strong>S</strong>epsis / Scarlet Fever</li>
                <li><strong>P</strong>ertussis / Pneumonia</li>
                <li><strong>I</strong>nfluenza (incl H1N1)</li>
                <li><strong>D</strong>iphtheria (Pharyngeal)</li>
                <li><strong>E</strong>piglottitis</li>
                <li><strong>R</strong>ubella / Respiratory (Adenovirus)</li>
                <li><strong>M</strong>eningitis / Mumps / Mycoplasma</li>
                <li><strong>A</strong>denovirus</li>
                <li><strong>N</strong>eisseria meningitidis</li>
              </ul>
              <div class="p-3 bg-white dark:bg-gray-800 rounded-xl border border-green-100 dark:border-green-900 text-xs">
                <strong class="block text-green-700 dark:text-green-400 mb-1">
                  ${t('Requisitos:', 'Requirements:')}
                </strong>
                ${t('Máscara quirúrgica + Protección ocular. Distancia ≥1m.', 'Surgical mask + Eye protection. Distance ≥1m.')}
              </div>
            </div>

            <div class="p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-3xl border-t-4 border-yellow-500 shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <strong class="text-xl text-yellow-800 dark:text-yellow-300">CONTACT</strong>
                <i class="fa-solid fa-hand-dots text-yellow-400 text-xl"></i>
              </div>
              <p class="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Mnemonic: MRS. WEE</p>
              <ul class="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-4">
                <li><strong>M</strong>RSA / VRE</li>
                <li><strong>R</strong>SV</li>
                <li><strong>S</strong>cabies / Herpes / Varicella (local)</li>
                <li><strong>W</strong>ound infections</li>
                <li><strong>E</strong>nteric: C. diff (${t('SOLO agua y jabón', 'SOAP & WATER ONLY')})</li>
                <li><strong>E</strong>ye infections</li>
              </ul>
              <div class="p-3 bg-white dark:bg-gray-800 rounded-xl border border-yellow-100 dark:border-yellow-900 text-xs">
                <strong class="block text-yellow-700 dark:text-yellow-400 mb-1">
                  ${t('Requisitos:', 'Requirements:')}
                </strong>
                ${t('Bata + Guantes + Equipo dedicado.', 'Gown + Gloves + Dedicated equipment.')}
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. PPE Order (Visual de v6/7) ---
    renderPPE() {
      return `
        <section>
          <div class="mt-8 bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800">
            <h3 class="font-bold text-2xl mb-6 text-center flex items-center justify-center gap-2">
              <i class="fa-solid fa-vest"></i> 
              ${t('Orden del EPP', 'PPE Order')}
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
              <div class="relative p-5 rounded-2xl bg-white/5 border border-white/10">
                <div class="absolute -top-4 -left-4 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">IN</div>
                <strong class="block text-green-400 mb-2 text-xl tracking-wide uppercase">
                  ${t('Ponerse (Donning)', 'Donning (Put On)')}
                </strong>
                <p class="text-xs text-gray-400 mb-4 italic">"De abajo hacia arriba, cara antes de manos"</p>
                <ol class="text-sm space-y-2 text-gray-300">
                  <li><span class="font-bold text-green-500">1.</span> Bata (Gown)</li>
                  <li><span class="font-bold text-green-500">2.</span> Mascarilla/Respirador (Mask)</li>
                  <li><span class="font-bold text-green-500">3.</span> Gafas/Careta (Goggles)</li>
                  <li><span class="font-bold text-green-500">4.</span> Guantes (Gloves)</li>
                </ol>
              </div>
              
              <div class="relative p-5 rounded-2xl bg-white/5 border border-white/10">
                <div class="absolute -top-4 -right-4 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">OUT</div>
                <strong class="block text-red-400 mb-2 text-xl tracking-wide text-right uppercase">
                  ${t('Quitarse (Doffing)', 'Doffing (Take Off)')}
                </strong>
                <p class="text-xs text-gray-400 mb-4 italic text-right">"Orden alfabético en inglés: G-G-G-M"</p>
                <ol class="text-sm space-y-2 text-gray-300 text-right">
                  <li>Guantes (Gloves) <span class="font-bold text-red-500">1.</span></li>
                  <li>Gafas (Goggles) <span class="font-bold text-red-500">2.</span></li>
                  <li>Bata (Gown) <span class="font-bold text-red-500">3.</span></li>
                  <li>Mascarilla (Mask) <span class="font-bold text-red-500">4.</span></li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 3. Immune Emergencies (Combinación: UI v8 + Detalles dosis v6) ---
    renderImmuneEmergencies() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
            <div class="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg animate-pulse">3</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Emergencias: Anafilaxis', 'Emergencies: Anaphylaxis')}
            </h2>
          </div>

          <div class="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-200 dark:border-red-800 shadow-xl">
            <div class="flex items-start gap-4 mb-6">
              <i class="fa-solid fa-lungs text-4xl text-red-600"></i>
              <div>
                <strong class="text-xl text-red-800 dark:text-red-300 block">
                  ${t('Signos Críticos', 'Critical Signs')}
                </strong>
                <p class="text-sm text-red-700 dark:text-red-200 mt-1">
                  ${t('Estridor, Sibilancias, Hipotensión, Urticaria, Angioedema, Taquicardia.', 'Stridor, Wheezing, Hypotension, Hives, Angioedema, Tachycardia.')}
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-black/20 p-5 rounded-2xl border-l-8 border-red-600">
              <strong class="text-lg text-gray-900 dark:text-white block mb-3 uppercase tracking-wide">
                ${t('Protocolo (Orden de Prioridad)', 'Protocol (Priority Order)')}
              </strong>
              <ol class="list-decimal list-inside space-y-2 text-sm md:text-base font-bold text-gray-800 dark:text-gray-200">
                <li class="text-red-600 dark:text-red-400">
                  ${t('DETENER la infusión / alérgeno.', 'STOP the infusion / allergen.')}
                </li>
                <li>
                  <span class="text-blue-600 dark:text-blue-400">AIRWAY</span> 
                  ${t('- Posición, Oxígeno 100%, preparar intubación.', '- Position, 100% O2, prep intubation.')}
                </li>
                <li>
                  <span class="text-green-600 dark:text-green-400">EPINEPHRINE IM</span> 
                  ${t('(Vasto lateral). Repetir cada 5-15 min.', '(Vastus lateralis). Repeat q 5-15 min.')}
                  <div class="ml-6 text-xs font-normal text-gray-500 mt-1">
                     Adults: 0.3-0.5 mg (1:1000) | Peds: 0.01 mg/kg
                  </div>
                </li>
                <li>
                  ${t('Fluidos IV (Cristaloides) para shock.', 'IV Fluids (Crystalloids) for shock.')}
                </li>
                <li>
                  ${t('Adjuntos: Difenhidramina + Esteroides.', 'Adjuncts: Diphenhydramine + Steroids.')}
                </li>
              </ol>
            </div>
          </div>
        </section>
      `;
    },

    // --- 4. Autoimmune (Lupus - Mnemotecnia v6 en UI v8) ---
    renderAutoimmune() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">4</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Lupus Eritematoso Sistémico (SLE)', 'Systemic Lupus Erythematosus (SLE)')}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-3xl border border-purple-200 dark:border-purple-800">
              <strong class="text-purple-800 dark:text-purple-300 block mb-2 text-lg">
                Mnemonic: SOAP BRAIN MD
              </strong>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-2 list-disc list-inside">
                <li><strong>S</strong>erositis (pleuritis/pericarditis)</li>
                <li><strong>O</strong>ral ulcers</li>
                <li><strong>A</strong>rthritis (non-erosive)</li>
                <li><strong>P</strong>hotosensitivity (<i class="fa-solid fa-sun text-yellow-500"></i> Trigger!)</li>
                <li><strong>B</strong>lood disorders (anemia/leukopenia)</li>
                <li><strong>R</strong>enal (Proteinuria - Watch Kidneys!)</li>
                <li><strong>A</strong>NA positive</li>
                <li><strong>I</strong>mmunologic</li>
                <li><strong>N</strong>eurologic (psychosis/seizures)</li>
                <li><strong>M</strong>alar Rash (Butterfly)</li>
                <li><strong>D</strong>iscoid Rash</li>
              </ul>
            </div>

            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-brand-border shadow-sm">
              <strong class="text-gray-900 dark:text-white block mb-3 text-lg">
                ${t('Educación al Paciente', 'Patient Education')}
              </strong>
              <ul class="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-2">
                <li>${t('Evitar luz solar directa (Bloqueador SPF 50+, ropa larga).', 'Avoid direct sunlight (SPF 50+, long sleeves).')}</li>
                <li>${t('Evitar estrés físico y emocional (causa brotes).', 'Avoid physical/emotional stress (causes flares).')}</li>
                <li>${t('Prevenir infecciones (están inmunosupresos).', 'Prevent infection (immunosuppressed).')}</li>
                <li>${t('Jabón suave, sin perfumes.', 'Mild soap, no perfumes.')}</li>
                <li class="font-bold text-red-500">${t('Monitorear Creatinina (Nefritis).', 'Monitor Creatinine (Nephritis).')}</li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 5. HIV / AIDS (Estructura v8 + Datos fluidos v6) ---
    renderHIV() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-pink-600 flex items-center justify-center text-white font-black text-xl shadow-lg">5</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">VIH / SIDA (HIV/AIDS)</h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="p-6 bg-pink-50 dark:bg-pink-900/10 rounded-3xl border-l-8 border-pink-500 shadow-sm">
               <strong class="text-xl text-pink-800 dark:text-pink-300 block mb-3">
                  ${t('Transmisión y Fluidos', 'Transmission & Fluids')}
               </strong>
               <ul class="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                  <li class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-pink-100 dark:border-pink-900">
                     <strong class="block text-gray-900 dark:text-white mb-1">
                        ${t('Fluidos Infecciosos:', 'Infectious Fluids:')}
                     </strong>
                     ${t('Sangre, Semen, Secreciones Vaginales, Leche Materna.', 'Blood, Semen, Vaginal Secretions, Breast Milk.')}
                     <br><em class="text-xs text-red-500 mt-1 block">NOT: Saliva, Sweat, Tears, Urine (unless blood visible).</em>
                  </li>
                  <li class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-pink-100 dark:border-pink-900">
                     <strong class="block text-green-700 dark:text-green-400 mb-1">
                        ${t('Precauciones: ESTÁNDAR', 'Precautions: STANDARD')}
                     </strong>
                     ${t('Guantes solo si hay contacto con fluidos. No aislamiento especial.', 'Gloves only if contact with fluids. No special isolation.')}
                  </li>
               </ul>
            </div>

            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg">
              <strong class="text-xl text-purple-700 dark:text-purple-300 block mb-4">
                ${t('Criterios de SIDA (AIDS)', 'AIDS Criteria')}
              </strong>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">HIV + ${t('Uno de los siguientes:', 'One of the following:')}</p>
              <ul class="space-y-3 text-sm text-gray-800 dark:text-gray-200 font-bold">
                <li class="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div class="w-8 h-8 bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-200 rounded-full flex items-center justify-center">1</div>
                  <span>CD4 Count < 200 cells/mm³</span>
                </li>
                <li class="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div class="w-8 h-8 bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-200 rounded-full flex items-center justify-center">2</div>
                  <span>${t('Infección Oportunista (PCP, Kaposi, TB)', 'Opportunistic Infection (PCP, Kaposi, TB)')}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 6. Infectious Diseases (Contenido Único de v8) ---
    renderInfectiousDiseases() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-lg">6</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Enfermedades Específicas', 'Specific Diseases')}
            </h2>
          </div>

          <div class="space-y-6">
            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border-l-4 border-orange-500 shadow-sm">
              <strong class="text-lg text-orange-700 dark:text-orange-400 block mb-2">Tuberculosis (TB)</strong>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong class="block text-gray-900 dark:text-white mb-1">Mantoux (PPD) Skin Test:</strong>
                  <ul class="text-gray-600 dark:text-gray-400 space-y-1">
                    <li>> 15mm: ${t('Positivo (Bajo riesgo).', 'Positive (Low risk).')}</li>
                    <li>> 10mm: ${t('Positivo (Inmigrantes, Drogas IV).', 'Positive (Immigrants, IV drugs).')}</li>
                    <li>> 5mm: ${t('Positivo (VIH, Contacto reciente).', 'Positive (HIV, Recent contact).')}</li>
                  </ul>
                </div>
                <div>
                  <strong class="block text-gray-900 dark:text-white mb-1">Confirmation:</strong>
                  <p class="text-gray-600 dark:text-gray-400">${t('Cultivo de Esputo (Gold Standard).', 'Sputum Culture (Gold Standard).')}</p>
                </div>
              </div>
            </div>

            <div class="p-5 bg-white dark:bg-brand-card rounded-2xl border-l-4 border-green-500 shadow-sm">
              <strong class="text-lg text-green-700 dark:text-green-400 block mb-2">Lyme Disease</strong>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold border border-red-300">
                  <i class="fa-solid fa-bullseye"></i>
                </div>
                <div class="text-sm font-bold text-gray-800 dark:text-gray-200">
                  ${t('Signo: "Bullseye Rash" (Eritema migratorio).', 'Sign: "Bullseye Rash" (Erythema migrans).')}
                </div>
              </div>
              <p class="mt-2 text-xs text-gray-500">
                 ${t('Tx: Doxiciclina. Prevención: Ropa larga, repelente (Ticks).', 'Tx: Doxycycline. Prev: Long sleeves, repellent (Ticks).')}
              </p>
            </div>
          </div>
        </section>
      `;
    },

    // --- 7. Vaccinations (Contenido Único de v8) ---
    renderVaccinations() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 mt-8">
            <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">7</div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">
              ${t('Vacunación (Puntos Clave)', 'Vaccination (Key Points)')}
            </h2>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-200 dark:border-blue-800">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <strong class="text-blue-800 dark:text-blue-300 block mb-2 text-lg">
                  ${t('Vacunas Vivas (Live)', 'Live Vaccines')}
                </strong>
                <p class="text-xs text-gray-500 mb-2 font-bold uppercase">MMR, Varicella, Rotavirus, Flu Mist</p>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <li><i class="fa-solid fa-ban text-red-500 mr-2"></i> ${t('NO en Embarazo.', 'NO in Pregnancy.')}</li>
                  <li><i class="fa-solid fa-ban text-red-500 mr-2"></i> ${t('NO en Inmunocomprometidos.', 'NO in Immunocompromised.')}</li>
                </ul>
              </div>
              
              <div>
                <strong class="text-blue-800 dark:text-blue-300 block mb-2 text-lg">
                  ${t('Alergias Comunes', 'Common Allergies')}
                </strong>
                <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Influenza:</strong> ${t('Huevo (Egg).', 'Egg.')}</li>
                  <li><strong>MMR / Varicella:</strong> ${t('Gelatina, Neomicina.', 'Gelatin, Neomycin.')}</li>
                  <li><strong>Hep B:</strong> ${t('Levadura (Yeast).', 'Yeast.')}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 8. Quiz (El más completo de v6) ---
    renderQuiz() {
      return `
        <div class="mt-12 bg-gray-900 text-white p-6 rounded-3xl border border-gray-700">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <i class="fa-solid fa-clipboard-question text-green-400"></i> 
                ${t('Repaso Rápido', 'Quick Review')}
            </h3>
            <div class="space-y-4 text-sm">
                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('1. Paciente con TB activa. ¿Qué habitación?', '1. Client with active TB. Which room?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-green-500">
                        ${t('<strong>Presión Negativa.</strong> TB es Airborne. Puerta cerrada, salida de aire al exterior.', '<strong>Negative Pressure.</strong> TB is Airborne. Door closed, air vents outside.')}
                    </div>
                </details>
                
                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('2. Paciente con C. diff. ¿Higiene de manos?', '2. Client with C. diff. Hand hygiene?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-green-500">
                        ${t('<strong>Agua y Jabón.</strong> El alcohol NO mata las esporas.', '<strong>Soap and Water.</strong> Alcohol does NOT kill spores.')}
                    </div>
                </details>

                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('3. Estridor tras penicilina IV. ¿Acción #1?', '3. Stridor after IV penicillin. Action #1?')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-green-500">
                        ${t('<strong>DETENER la infusión.</strong> Luego epinefrina.', '<strong>STOP the infusion.</strong> Then epinephrine.')}
                    </div>
                </details>

                <details class="group bg-white/5 p-4 rounded-xl border border-white/10 open:bg-white/10 transition-all">
                    <summary class="font-bold cursor-pointer select-none flex justify-between items-center">
                        ${t('4. ¿Enfermedad que NO es droplet? a) Difteria b) Varicela', '4. Disease that is NOT droplet? a) Diphtheria b) Varicella')}
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 text-gray-300 pl-4 border-l-2 border-green-500">
                        ${t('<strong>b) Varicela (Airborne).</strong> Difteria es Droplet.', '<strong>b) Varicella (Airborne).</strong> Diphtheria is Droplet.')}
                    </div>
                </details>
            </div>
        </div>
      `;
    }
  });
})();