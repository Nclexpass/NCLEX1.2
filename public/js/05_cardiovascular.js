// 05_cardiovascular.js — Sistema Cardiovascular COMPLETO (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: EKG Generator, Vascular, Shock & Pharm
// FUSIÓN: Arquitectura v8 + Protocolos AHA 2020 (Atropina 1mg) + Seguridad Vasopresores v5
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Dependencias: window.NCLEX.registerTopic

(function () {
  'use strict';

  // --- 0. CONTADOR PARA SVG ÚNICOS ---
  let ekgCounter = 0;

  // --- 1. HELPER DE TRADUCCIÓN (Internal) ---
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  // --- 1b. SISTEMA DE SONIDO EKG (Verde y con Beep) ---
  let audioContext = null;
  let isMuted = false;
  let currentOscillator = null;
  let currentGain = null;

  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playEKGBeep(rhythm) {
    if (isMuted) return;
    initAudio();
    if (audioContext.state === 'suspended') audioContext.resume();

    // Detener sonido anterior si existe
    if (currentOscillator) {
      try {
        currentOscillator.stop();
        currentOscillator.disconnect();
      } catch (e) {}
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    // Frecuencia según ritmo (tono clínico característico)
    let frequency = 880; // A5 (normal)
    let type = 'sine';
    if (rhythm.includes('brady')) { frequency = 440; type = 'sine'; } // A4 más grave
    else if (rhythm.includes('tach') || rhythm.includes('svt')) { frequency = 1046.5; type = 'sine'; } // C6 agudo
    else if (rhythm.includes('fib') || rhythm.includes('flutter')) { frequency = 220; type = 'sawtooth'; } // caótico
    else if (rhythm.includes('block')) { frequency = 330; type = 'triangle'; } // intermitente
    else if (rhythm.includes('asystole')) { frequency = 60; type = 'sine'; } // muy grave
    else if (rhythm.includes('torsades')) { frequency = 523.25; type = 'square'; } // C5
    
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = 0.15; // volumen moderado
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.15); // beep corto (150ms)
    
    currentOscillator = osc;
    currentGain = gain;
  }

  // Exponer funciones para inline events
  window.playEKGBeep = playEKGBeep;
  window.toggleEkgMute = function() {
    isMuted = !isMuted;
    const btn = document.getElementById('ekg-mute-btn');
    if (btn) {
      btn.innerHTML = isMuted 
        ? '<i class="fa-solid fa-volume-xmark"></i>' 
        : '<i class="fa-solid fa-volume-high"></i>';
      btn.title = isMuted ? 'Activar sonido' : 'Silenciar';
    }
  };

  // --- 2. GENERADOR EKG (SVG Vectorial) — COLOR VERDE MONITOR ANTIGUO ---
  const getEKG = (type) => {
    // Colores verdes retro
    const strokeColor = "stroke-green-600 dark:stroke-green-400";
    const gridColor = "text-green-100 dark:text-green-900/20";
    
    const uniqueId = `grid-${type}-${ekgCounter++}-${Math.random().toString(36).substr(2, 9)}`;
    
    const grid = `
      <defs>
        <pattern id="${uniqueId}" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5" class="${gridColor}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#${uniqueId})" />
    `;

    let path = '';
    switch(type) {
      case 'sinus': path = "M0,50 h10 c2,-5 5,-5 8,0 h5 l5,-30 l5,60 l5,-30 h5 c3,-8 6,-8 10,0 h10 h10 c2,-5 5,-5 8,0 h5 l5,-30 l5,60 l5,-30 h5 c3,-8 6,-8 10,0 h10"; break;
      case 'brady': path = "M0,50 h30 c2,-5 5,-5 8,0 h5 l5,-30 l5,60 l5,-30 h5 c3,-8 6,-8 10,0 h30 h30 c2,-5 5,-5 8,0 h5 l5,-30 l5,60 l5,-30 h5 c3,-8 6,-8 10,0 h30"; break;
      case 'block3': path = "M0,55 h10 c2,-6 5,-6 8,0 h15 l5,-35 l5,70 l5,-35 h15 c2,-6 5,-6 8,0 h25 c2,-6 5,-6 8,0 h10 l5,-35 l5,70 l5,-35 h10 c2,-6 5,-6 8,0"; break;
      case 'vtach': path = "M0,50 l10,-40 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80"; break;
      case 'vfib':  path = "M0,50 q5,-10 10,0 t10,5 t10,-15 t10,20 t10,-10 t10,15 t10,-20 t10,10 t10,-5 t10,15 t10,-10 t10,5 t10,-15 t10,10"; break;
      case 'asystole': path = "M0,50 c20,2 40,-2 60,1 80,-1 100,0 120,-1 140,1 160,0 180,0 200,0"; break;
      case 'afib':  path = "M0,50 l2,2 l2,-2 l2,2 l5,-30 l5,60 l5,-30 l2,2 l2,-2 l10,0 l2,-2 l2,2 l5,-30 l5,60 l5,-30 l2,2 l2,-2 l20,0 l2,-2 l2,2 l5,-30 l5,60 l5,-30"; break;
      case 'aflutter': path = "M0,50 l5,-10 l5,10 l5,-10 l5,10 l5,-30 l5,60 l5,-30 l5,-10 l5,10 l5,-10 l5,10 l5,-10 l5,10 l5,-30 l5,60 l5,-30"; break;
      case 'svt':   path = "M0,50 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25"; break;
      case 'torsades': path = "M0,50 l5,-5 l5,5 l5,-10 l5,10 l5,-20 l5,20 l5,-35 l5,35 l5,-20 l5,20 l5,-10 l5,10 l5,-5 l5,5 l5,-5 l5,5 l5,-20 l5,20 l5,-35 l5,35"; break;
    }
    
    return `
      <div class="w-full h-24 bg-white dark:bg-black/40 rounded-lg border border-green-200 dark:border-green-900/30 overflow-hidden relative my-3 shadow-inner group ekg-strip" 
           role="img" 
           aria-label="EKG strip of ${type}"
           data-rhythm="${type}"
           onmouseenter="playEKGBeep('${type}')">
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" class="w-full h-full absolute inset-0">
          ${grid}
          <path d="${path}" fill="none" stroke-width="2" class="${strokeColor}" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>`;
  };

  // --- 3. REGISTRO DEL TÓPICO (sin cambios en el resto) ---
  NCLEX.registerTopic({
    id: 'cardiovascular',
    title: { es: 'Cardiovascular (EKG)', en: 'Cardiovascular (EKG)' },
    subtitle: { es: 'Ritmos, Vascular y Farmacología', en: 'Rhythms, Vascular & Pharm' },
    icon: 'heart-pulse',
    color: 'red',

    render() {
      return `
        <header class="animate-fade-in flex flex-col gap-4 border-b border-gray-200 dark:border-brand-border pb-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <i class="fa-solid fa-heart-pulse"></i>
                ${t('Prioridad Nivel 1', 'Priority Level 1')}
              </div>
              <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                ${t('Cardiología NCLEX', 'NCLEX Cardiology')}
              </h1>
              <p class="mt-2 text-lg text-slate-600 dark:text-slate-400 font-medium">
                 ${t('Perfusión, Ritmos Letales y Seguridad en Medicamentos (AHA 2020).', 'Perfusion, Lethal Rhythms & Med Safety (AHA 2020).')}
              </p>
            </div>
          </div>
        </header>

        <div class="space-y-16 mt-10 animate-slide-in-up">
          ${this.renderAnatomyReview()}
          ${this.renderEKGParameters()}
          ${this.renderEKGStripGuide()}   <!-- sección modificada con verde, hover y sonido -->
          ${this.renderCriticalRhythms()}
          ${this.renderACLSAlgorithms()}
          ${this.renderVascularComparison()}
          ${this.renderDVT()}
          ${this.renderPharmacology()}
        </div>
      `;
    },

    // 0. ANATOMY & LABS (sin cambios)
    renderAnatomyReview() { /* ... (contenido original, sin modificar) ... */ 
      return `...`; // (omitido por brevedad, pero debe conservarse exactamente igual)
    },

    // 1. PARÁMETROS EKG (sin cambios)
    renderEKGParameters() { /* ... (original) ... */ 
      return `...`; // (omitido por brevedad)
    },

    // 2. GUÍA RÁPIDA EKG — MODIFICADA: verde, hover, sonido y mute
    renderEKGStripGuide() {
      // Estilo para la animación hover y botón mute
      const hoverStyle = `
        <style>
          .ekg-strip {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .ekg-strip:hover {
            transform: scale(1.02);
            box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
            border-color: #22c55e;
          }
          .dark .ekg-strip:hover {
            box-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
          }
          #ekg-mute-btn {
            transition: all 0.2s;
          }
          #ekg-mute-btn:hover {
            transform: scale(1.1);
          }
        </style>
      `;

      return `
        <section>
          <div class="flex items-center justify-between mb-6 border-l-4 border-blue-500 pl-4">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white uppercase">
              ${t('2. Guía Visual EKG', '2. EKG Quick View')}
            </h2>
            <button id="ekg-mute-btn" 
                    onclick="window.toggleEkgMute()" 
                    class="px-3 py-1.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm font-medium"
                    title="Silenciar">
              <i class="fa-solid fa-volume-high"></i>
            </button>
          </div>
          
          ${hoverStyle}
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-green-600 dark:text-green-400 font-black">${t('Ritmo Sinusal', 'Normal Sinus')}</strong>
              ${getEKG('sinus')}
              <p class="text-xs text-center text-gray-500">${t('Normal. 60-100 bpm. Onda P antes de cada QRS.', 'Normal. 60-100 bpm. P wave before each QRS.')}</p>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-blue-600 dark:text-blue-400 font-black">Sinus Bradycardia (< 60)</strong>
              ${getEKG('brady')}
              <p class="text-xs text-center text-gray-600 dark:text-gray-400">
                Tx: Atropine <strong class="text-blue-700">1 mg IV</strong> ${t('SOLO si sintomático (mareo, hipotensión).', 'ONLY if symptomatic (dizzy, hypotension).')}
              </p>
            </div>

            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border-2 border-red-500 dark:border-red-700 hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-red-700 dark:text-red-400 font-black flex items-center gap-2">
                 <i class="fa-solid fa-heart-crack"></i> 3rd Degree AV Block
              </strong>
              ${getEKG('block3')}
              <p class="text-xs text-center text-gray-600 dark:text-gray-400 font-bold mt-1">
                 ${t('Disociación completa P-QRS. ¡LETAL!', 'Complete P-QRS dissociation. LETHAL!')}
              </p>
              <p class="text-xs text-center text-red-600 dark:text-red-300 mt-1">
                 Tx: ${t('Marcapasos (TC -> Permanente). NO Atropina (ineficaz).', 'Pacemaker (TC -> Permanent). NO Atropine (ineffective).')}
              </p>
            </div>
            
            <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-red-600 dark:text-red-400 font-black">Ventricular Fibrillation (V-Fib)</strong>
              ${getEKG('vfib')}
              <div class="text-center text-xs font-bold text-red-600 dark:text-red-400 uppercase animate-pulse mt-1">
                ${t('NO PULSO = DESFIBRILAR INMEDIATO', 'NO PULSE = IMMEDIATE DEFIB')}
              </div>
              <p class="text-xs text-center text-gray-700 dark:text-gray-300 mt-1">
                ${t('Ritmo caótico, sin QRS identificable.', 'Chaotic rhythm, no identifiable QRS.')}
              </p>
            </div>
            
            <div class="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-orange-600 dark:text-orange-400 font-black">Ventricular Tachycardia (V-Tach)</strong>
              ${getEKG('vtach')}
              <p class="text-xs text-center text-gray-700 dark:text-gray-300 mt-1">
                ${t('<strong>Con pulso:</strong> Cardioversión sincronizada + Amiodarona.', '<strong>With pulse:</strong> Synchronized cardioversion + Amiodarone.')}<br>
                ${t('<strong>Sin pulso:</strong> Desfibrilar + ACLS.', '<strong>No pulse:</strong> Defibrillate + ACLS.')}
              </p>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-purple-600 dark:text-purple-400 font-black">Atrial Fibrillation (A-Fib)</strong>
              ${getEKG('afib')}
              <p class="text-xs text-center text-gray-500 mt-1">
                ${t('R-R irregular, sin onda P discernible.', 'Irregularly irregular, no discernible P waves.')}
                <br>
                <span class="font-bold text-purple-600">CHA₂DS₂-VASc ≥2: Anticoagular.</span>
              </p>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-pink-600 dark:text-pink-400 font-black">Atrial Flutter (A-Flutter)</strong>
              ${getEKG('aflutter')}
              <p class="text-xs text-center text-gray-500 mt-1">
                ${t('Patrón "dientes de sierra", onda P atrial (≥250/min).', '"Sawtooth" pattern, atrial waves (≥250/min).')}
                <br>
                <span class="font-bold text-pink-600">Razón AV 2:1, 3:1, 4:1.</span>
              </p>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-indigo-600 dark:text-indigo-400 font-black">SVT (>150 bpm)</strong>
              ${getEKG('svt')}
              <p class="text-xs text-center text-gray-600 dark:text-gray-300">
                Tx: <strong>Adenosine 6mg IV push rápido</strong> (12mg segunda dosis).
                ${t('Vagales primero si estable.', 'Vagal maneuvers first if stable.')}
              </p>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-teal-600 dark:text-teal-400 font-black">Torsades de Pointes</strong>
              ${getEKG('torsades')}
              <p class="text-xs text-center text-gray-600 dark:text-gray-300 mt-1">
                Tx: <strong>Magnesium Sulfate 2g IV</strong> (QT prolongado).
                ${t('Corregir K+, Mg++, evitar fármacos prolongadores QT.', 'Correct K+, Mg++, avoid QT-prolonging drugs.')}
              </p>
            </div>
            
             <div class="p-4 bg-gray-100 dark:bg-black/30 rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-gray-600 dark:text-gray-400 font-black">Asystole (Flatline)</strong>
              ${getEKG('asystole')}
              <div class="text-center text-xs font-bold text-gray-500 uppercase">
                ${t('NO DESFIBRILAR. CPR + EPI q3-5min.', 'NO SHOCK. CPR + EPI q3-5min.')}
              </div>
              <p class="text-xs text-center text-gray-600 dark:text-gray-400 mt-1">
                ${t('Buscar causas reversibles (6Hs y 6Ts).', 'Search reversible causes (6Hs & 6Ts).')}
              </p>
            </div>
          </div>
        </section>
      `;
    },

    // 3. RITMOS CRÍTICOS (sin cambios)
    renderCriticalRhythms() { /* ... (original) ... */ 
      return `...`;
    },

    // 4. ALGORITMOS ACLS (sin cambios)
    renderACLSAlgorithms() { /* ... (original) ... */ 
      return `...`;
    },

    // 5. VASCULAR COMPARISON (sin cambios)
    renderVascularComparison() { /* ... (original) ... */ 
      return `...`;
    },

    // 6. DVT (sin cambios)
    renderDVT() { /* ... (original) ... */ 
      return `...`;
    },

    // 7. PHARMACOLOGY (sin cambios)
    renderPharmacology() { /* ... (original) ... */ 
      return `...`;
    }
  });
})();