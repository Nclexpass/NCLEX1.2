// 05_cardiovascular.js — Sistema Cardiovascular COMPLETO (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: EKG Generator, Vascular, Shock & Pharm
// FUSIÓN: Arquitectura v8 + Protocolos AHA 2020 (Atropina 1mg) + Seguridad Vasopresores v5
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// Dependencias: window.NCLEX.registerTopic
// ÚLTIMA MODIFICACIÓN: Animación EKG continua, sonidos reales por ritmo, brillo en la línea.

(function () {
  'use strict';

  // --- 0. CONTADOR PARA SVG ÚNICOS ---
  let ekgCounter = 0;

  // --- 1. HELPER DE TRADUCCIÓN (Internal) ---
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  // --- SISTEMA DE SONIDO Y ANIMACIÓN (MONITOR REAL) ---
  let audioContext = null;
  let isMuted = false;
  const activeIntervals = {};

  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Beep simple (frecuencia, duración)
  function beep(frequency = 800, duration = 80) {
    if (isMuted) return;
    initAudio();
    if (audioContext.state === 'suspended') audioContext.resume();

    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'square';
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration / 1000);
    gain.gain.linearRampToValueAtTime(0, now + duration / 1000 + 0.01);

    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + duration / 1000 + 0.01);
  }

  // Ruido para V-Fib (onda cuadrada modulada)
  function vfibNoise() {
    if (isMuted) return;
    initAudio();
    if (audioContext.state === 'suspended') audioContext.resume();

    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = 200 + Math.random() * 100;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Iniciar animación y sonido al hacer hover
  window.startEKG = function (id, rhythm, bpm = 75) {
    const el = document.getElementById(id);
    if (!el) return;

    // Activar animación de desplazamiento
    el.classList.add('ekg-moving');

    // Activar brillo en la línea
    const trace = el.querySelector('.ekg-trace');
    if (trace) trace.classList.add('ekg-glow');

    // Detener intervalo anterior si existe
    if (activeIntervals[id]) clearInterval(activeIntervals[id]);

    // Configurar sonido según el ritmo
    if (rhythm === 'asystole') {
      // sin sonido
      return;
    }

    if (rhythm === 'vfib') {
      // V-Fib: ruido caótico cada 100ms
      activeIntervals[id] = setInterval(() => {
        if (el.matches(':hover')) vfibNoise();
      }, 100);
      return;
    }

    if (rhythm === 'afib') {
      // A-Fib: intervalos irregulares entre 400-800ms (75-150 bpm)
      const nextBeep = () => {
        if (!el.matches(':hover')) return;
        const interval = 400 + Math.random() * 400;
        beep(750, 60);
        activeIntervals[id] = setTimeout(nextBeep, interval);
      };
      nextBeep();
      return;
    }

    // Ritmos regulares: intervalo = 60000 / bpm
    const intervalMs = 60000 / bpm;
    let frequency = 800;
    if (bpm < 60) frequency = 600;
    else if (bpm > 100) frequency = 1000;

    activeIntervals[id] = setInterval(() => {
      if (el.matches(':hover')) beep(frequency, 60);
    }, intervalMs);
  };

  window.stopEKG = function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('ekg-moving');
      const trace = el.querySelector('.ekg-trace');
      if (trace) trace.classList.remove('ekg-glow');
    }
    if (activeIntervals[id]) {
      clearInterval(activeIntervals[id]);
      delete activeIntervals[id];
    }
  };

  window.toggleEkgMute = function () {
    isMuted = !isMuted;
    const btn = document.getElementById('ekg-mute-btn');
    if (btn) {
      btn.innerHTML = isMuted
        ? '<i class="fa-solid fa-volume-xmark"></i>'
        : '<i class="fa-solid fa-volume-high"></i>';
      btn.title = isMuted ? 'Activar sonido' : 'Silenciar';
    }
  };

  // --- GENERADOR EKG CONTINUO (SIN CORTES) ---
  const getEKG = (type, bpm = 75, rhythm = type) => {
    const strokeColor = "stroke-green-600 dark:stroke-green-400";
    const gridColor = "text-green-100 dark:text-green-900/20";
    const uniqueId = `ekg-${type}-${ekgCounter++}`;
    const gridId = `grid-${uniqueId}`;

    // Path base del ritmo (un ciclo)
    let basePath = '';
    switch (type) {
      case 'sinus':
        basePath = "M0,50 h10 c2,-5 5,-5 8,0 h5 l5,-30 l5,60 l5,-30 h5 c3,-8 6,-8 10,0 h10 h10 c2,-5 5,-5 8,0 h5 l5,-30 l5,60 l5,-30 h5 c3,-8 6,-8 10,0 h10";
        break;
      case 'brady':
        basePath = "M0,50 h30 c2,-5 5,-5 8,0 h5 l5,-30 l5,60 l5,-30 h5 c3,-8 6,-8 10,0 h30 h30 c2,-5 5,-5 8,0 h5 l5,-30 l5,60 l5,-30 h5 c3,-8 6,-8 10,0 h30";
        break;
      case 'block3':
        basePath = "M0,55 h10 c2,-6 5,-6 8,0 h15 l5,-35 l5,70 l5,-35 h15 c2,-6 5,-6 8,0 h25 c2,-6 5,-6 8,0 h10 l5,-35 l5,70 l5,-35 h10 c2,-6 5,-6 8,0";
        break;
      case 'vtach':
        basePath = "M0,50 l10,-40 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80";
        break;
      case 'vfib':
        basePath = "M0,50 q5,-10 10,0 t10,5 t10,-15 t10,20 t10,-10 t10,15 t10,-20 t10,10 t10,-5 t10,15 t10,-10 t10,5 t10,-15 t10,10";
        break;
      case 'asystole':
        basePath = "M0,50 c20,2 40,-2 60,1 80,-1 100,0 120,-1 140,1 160,0 180,0 200,0";
        break;
      case 'afib':
        basePath = "M0,50 l2,2 l2,-2 l2,2 l5,-30 l5,60 l5,-30 l2,2 l2,-2 l10,0 l2,-2 l2,2 l5,-30 l5,60 l5,-30 l2,2 l2,-2 l20,0 l2,-2 l2,2 l5,-30 l5,60 l5,-30";
        break;
      case 'aflutter':
        basePath = "M0,50 l5,-10 l5,10 l5,-10 l5,10 l5,-30 l5,60 l5,-30 l5,-10 l5,10 l5,-10 l5,10 l5,-10 l5,10 l5,-30 l5,60 l5,-30";
        break;
      case 'svt':
        basePath = "M0,50 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25";
        break;
      case 'torsades':
        basePath = "M0,50 l5,-5 l5,5 l5,-10 l5,10 l5,-20 l5,20 l5,-35 l5,35 l5,-20 l5,20 l5,-10 l5,10 l5,-5 l5,5 l5,-5 l5,5 l5,-20 l5,20 l5,-35 l5,35";
        break;
    }

    // Repetir el path 20 veces para animación continua (SVG de 2000px)
    const repeatedPath = Array(20).fill(basePath).join('');

    return `
    <div id="${uniqueId}"
         class="w-full h-24 bg-white dark:bg-black/40 rounded-lg border border-green-200 dark:border-green-900/30 overflow-hidden relative my-3 shadow-inner ekg-strip"
         role="img"
         aria-label="EKG strip of ${type}"
         data-rhythm="${rhythm}"
         data-bpm="${bpm}"
         onmouseenter="startEKG('${uniqueId}', '${rhythm}', ${bpm})"
         onmouseleave="stopEKG('${uniqueId}')">
      <svg viewBox="0 0 2000 100" preserveAspectRatio="none" class="w-full h-full absolute inset-0">
        <defs>
          <pattern id="${gridId}" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5" class="${gridColor}"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#${gridId})" />
        <g class="ekg-trace">
          <path d="${repeatedPath}" fill="none" stroke-width="2" class="${strokeColor}" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      </svg>
    </div>`;
  };

  // --- ESTILOS PARA ANIMACIÓN Y BRILLO ---
  const ekgAnimationStyle = `
  <style>
    .ekg-moving .ekg-trace {
      animation: scrollEKG 8s linear infinite;
    }
    @keyframes scrollEKG {
      0% { transform: translateX(0); }
      100% { transform: translateX(-1000px); }
    }
    .ekg-glow {
      filter: drop-shadow(0 0 4px #22c55e) drop-shadow(0 0 8px #4ade80);
      transition: filter 0.2s ease;
    }
    .ekg-strip {
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .ekg-strip:hover {
      transform: scale(1.02);
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
      border-color: #22c55e;
    }
    .dark .ekg-strip:hover {
      box-shadow: 0 0 20px rgba(74, 222, 128, 0.4);
    }
    #ekg-mute-btn {
      transition: all 0.2s;
    }
    #ekg-mute-btn:hover {
      transform: scale(1.1);
    }
  </style>
  `;

  // --- REGISTRO DEL TÓPICO ---
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
          ${this.renderEKGStripGuide()}
          ${this.renderCriticalRhythms()}
          ${this.renderACLSAlgorithms()}
          ${this.renderVascularComparison()}
          ${this.renderDVT()}
          ${this.renderPharmacology()}
        </div>
      `;
    },

    // --- 0. ANATOMY & LABS ---
    renderAnatomyReview() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-l-4 border-gray-500 pl-4">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white uppercase">
              ${t('0. Anatomía y Parámetros', '0. Anatomy & Parameters')}
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
             <div class="bg-white dark:bg-brand-card p-5 rounded-3xl border border-gray-200 dark:border-brand-border shadow-sm">
                <strong class="text-lg text-red-600 dark:text-red-400 block mb-2 flex items-center gap-2">
                    <i class="fa-solid fa-droplet"></i> ${t('Válvulas (Flujo)', 'Valves (Flow)')}
                </strong>
                <p class="text-sm text-gray-500 mb-2 italic">Mnemonic: <strong>"Try Pulling My Aorta"</strong></p>
                <ol class="list-decimal pl-5 text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium space-y-1">
                   <li><strong>T</strong>ricuspid (Right Atrium → Right Ventricle)</li>
                   <li><strong>P</strong>ulmonic (Right Ventricle → Lungs)</li>
                   <li><strong>M</strong>itral (Left Atrium → Left Ventricle)</li>
                   <li><strong>A</strong>ortic (Left Ventricle → Body)</li>
                </ol>
                <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <strong class="text-sm text-blue-800 dark:text-blue-300">${t('Soplos (Lub-Dub):', 'Murmurs (Lub-Dub):')}</strong>
                  <ul class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <li><strong>S1:</strong> ${t('Cierre mitral/tricúspide', 'Mitral/tricuspid closure')}</li>
                    <li><strong>S2:</strong> ${t('Cierre aórtico/pulmonar', 'Aortic/pulmonic closure')}</li>
                    <li><strong>S3:</strong> ${t('Ventricular llenado rápido (HF)', 'Rapid ventricular filling (HF)')}</li>
                    <li><strong>S4:</strong> ${t('Contracción auricular (HTN)', 'Atrial contraction (HTN)')}</li>
                  </ul>
                </div>
             </div>
             <div class="bg-white dark:bg-brand-card p-5 rounded-3xl border border-gray-200 dark:border-brand-border shadow-sm">
                <strong class="text-lg text-blue-600 dark:text-blue-400 block mb-2 flex items-center gap-2">
                    <i class="fa-solid fa-flask"></i> ${t('Labs y Parámetros Críticos', 'Critical Labs & Parameters')}
                </strong>
                <ul class="space-y-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
                   <li class="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                      <span><strong>Troponina I/T</strong> (MI)</span>
                      <span class="font-bold text-red-500">> 0.5 ng/mL <span class="text-xs font-normal">(${t('pico 12-24h', 'peak 12-24h')})</span></span>
                   </li>
                   <li class="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                      <span><strong>CK-MB</strong> (cardíaca)</span>
                      <span class="font-bold text-red-500">> 5 ng/mL <span class="text-xs font-normal">(${t('pico 12h', 'peak 12h')})</span></span>
                   </li>
                   <li class="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                      <span><strong>BNP/NT-proBNP</strong> (HF)</span>
                      <span class="font-bold text-red-500">BNP >100 pg/mL ${t('(sugestivo)', '(suggestive)')}<br>>400 pg/mL ${t('(diagnóstico)', '(diagnostic)')}</span>
                   </li>
                   <li class="flex justify-between">
                      <span><strong>LDL Cholesterol</strong></span>
                      <span class="font-bold text-orange-500"><100 mg/dL <span class="text-xs font-normal">(${t('óptimo', 'optimal')})</span></span>
                   </li>
                </ul>
                <div class="mt-3 p-2 bg-red-50 dark:bg-red-900/10 rounded text-xs text-red-800 dark:text-red-300">
                  <strong>${t('Hemodinámica:', 'Hemodynamics:')}</strong> CVP 2-8 mmHg, PAWP 8-12 mmHg, CI 2.5-4.0 L/min/m²
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 1. PARÁMETROS EKG ---
    renderEKGParameters() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-l-4 border-blue-600 pl-4">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white uppercase">
              ${t('1. Intervalos EKG Normales', '1. Normal EKG Intervals')}
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-blue-200 dark:border-blue-800">
              <strong class="text-blue-700 dark:text-blue-400 block text-lg">PR Interval</strong>
              <div class="text-center mt-2">
                <span class="text-3xl font-black text-blue-600 dark:text-blue-300">0.12-0.20s</span>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ${t('Desde inicio onda P a inicio QRS', 'From P wave start to QRS start')}
                </p>
                <div class="mt-2 p-2 bg-red-50 dark:bg-red-900/10 rounded">
                  <p class="text-xs font-bold text-red-700 dark:text-red-300">
                    ${t('>0.20s: Bloqueo AV 1° grado', '>0.20s: 1st degree AV block')}
                  </p>
                </div>
              </div>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-green-200 dark:border-green-800">
              <strong class="text-green-700 dark:text-green-400 block text-lg">QRS Complex</strong>
              <div class="text-center mt-2">
                <span class="text-3xl font-black text-green-600 dark:text-green-300">0.06-0.10s</span>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ${t('Depolarización ventricular', 'Ventricular depolarization')}
                </p>
                <div class="mt-2 p-2 bg-red-50 dark:bg-red-900/10 rounded">
                  <p class="text-xs font-bold text-red-700 dark:text-red-300">
                    ${t('>0.12s: Bloqueo rama', '>0.12s: Bundle branch block')}
                  </p>
                </div>
              </div>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-purple-200 dark:border-purple-800">
              <strong class="text-purple-700 dark:text-purple-400 block text-lg">QT Interval</strong>
              <div class="text-center mt-2">
                <span class="text-3xl font-black text-purple-600 dark:text-purple-300">≤0.44s</span>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ${t('Corregido por frecuencia (QTc)', 'Corrected for heart rate (QTc)')}
                </p>
                <div class="mt-2 p-2 bg-red-50 dark:bg-red-900/10 rounded">
                  <p class="text-xs font-bold text-red-700 dark:text-red-300">
                    ${t('>0.50s: Riesgo Torsades', '>0.50s: Torsades risk')}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    ${t('Fórmula: QTc = QT/√RR', 'Formula: QTc = QT/√RR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <strong class="text-yellow-800 dark:text-yellow-300 block mb-2">${t('Cálculo de Frecuencia Cardíaca:', 'Heart Rate Calculation:')}</strong>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-blue-600">300/150/100</strong>
                <p class="text-xs">${t('Método grande', 'Large box method')}</p>
              </div>
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-blue-600">1500/pequeñas</strong>
                <p class="text-xs">${t('Método pequeño', 'Small box method')}</p>
              </div>
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-blue-600">6-sec × 10</strong>
                <p class="text-xs">${t('Método 6 segundos', '6-second method')}</p>
              </div>
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-blue-600">R-R interval</strong>
                <p class="text-xs">${t('Preciso (1/R-R)', 'Precise (1/R-R)')}</p>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 2. GUÍA VISUAL EKG (CON ANIMACIÓN CONTINUA, SONIDOS REALES Y BRILLO) ---
    renderEKGStripGuide() {
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
          
          ${ekgAnimationStyle}
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-green-600 dark:text-green-400 font-black">${t('Ritmo Sinusal', 'Normal Sinus')}</strong>
              ${getEKG('sinus', 75, 'sinus')}
              <p class="text-xs text-center text-gray-500">${t('Normal. 60-100 bpm. Onda P antes de cada QRS.', 'Normal. 60-100 bpm. P wave before each QRS.')}</p>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-blue-600 dark:text-blue-400 font-black">Sinus Bradycardia (< 60)</strong>
              ${getEKG('brady', 50, 'brady')}
              <p class="text-xs text-center text-gray-600 dark:text-gray-400">
                Tx: Atropine <strong class="text-blue-700">1 mg IV</strong> ${t('SOLO si sintomático (mareo, hipotensión).', 'ONLY if symptomatic (dizzy, hypotension).')}
              </p>
            </div>

            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border-2 border-red-500 dark:border-red-700 hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-red-700 dark:text-red-400 font-black flex items-center gap-2">
                 <i class="fa-solid fa-heart-crack"></i> 3rd Degree AV Block
              </strong>
              ${getEKG('block3', 40, 'block3')}
              <p class="text-xs text-center text-gray-600 dark:text-gray-400 font-bold mt-1">
                 ${t('Disociación completa P-QRS. ¡LETAL!', 'Complete P-QRS dissociation. LETHAL!')}
              </p>
              <p class="text-xs text-center text-red-600 dark:text-red-300 mt-1">
                 Tx: ${t('Marcapasos (TC -> Permanente). NO Atropina (ineficaz).', 'Pacemaker (TC -> Permanent). NO Atropine (ineffective).')}
              </p>
            </div>
            
            <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-red-600 dark:text-red-400 font-black">Ventricular Fibrillation (V-Fib)</strong>
              ${getEKG('vfib', 300, 'vfib')}
              <div class="text-center text-xs font-bold text-red-600 dark:text-red-400 uppercase animate-pulse mt-1">
                ${t('NO PULSO = DESFIBRILAR INMEDIATO', 'NO PULSE = IMMEDIATE DEFIB')}
              </div>
              <p class="text-xs text-center text-gray-700 dark:text-gray-300 mt-1">
                ${t('Ritmo caótico, sin QRS identificable.', 'Chaotic rhythm, no identifiable QRS.')}
              </p>
            </div>
            
            <div class="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-orange-600 dark:text-orange-400 font-black">Ventricular Tachycardia (V-Tach)</strong>
              ${getEKG('vtach', 180, 'vtach')}
              <p class="text-xs text-center text-gray-700 dark:text-gray-300 mt-1">
                ${t('<strong>Con pulso:</strong> Cardioversión sincronizada + Amiodarona.', '<strong>With pulse:</strong> Synchronized cardioversion + Amiodarone.')}<br>
                ${t('<strong>Sin pulso:</strong> Desfibrilar + ACLS.', '<strong>No pulse:</strong> Defibrillate + ACLS.')}
              </p>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-purple-600 dark:text-purple-400 font-black">Atrial Fibrillation (A-Fib)</strong>
              ${getEKG('afib', 110, 'afib')}
              <p class="text-xs text-center text-gray-500 mt-1">
                ${t('R-R irregular, sin onda P discernible.', 'Irregularly irregular, no discernible P waves.')}
                <br>
                <span class="font-bold text-purple-600">CHA₂DS₂-VASc ≥2: Anticoagular.</span>
              </p>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-pink-600 dark:text-pink-400 font-black">Atrial Flutter (A-Flutter)</strong>
              ${getEKG('aflutter', 150, 'aflutter')}
              <p class="text-xs text-center text-gray-500 mt-1">
                ${t('Patrón "dientes de sierra", onda P atrial (≥250/min).', '"Sawtooth" pattern, atrial waves (≥250/min).')}
                <br>
                <span class="font-bold text-pink-600">Razón AV 2:1, 3:1, 4:1.</span>
              </p>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-indigo-600 dark:text-indigo-400 font-black">SVT (>150 bpm)</strong>
              ${getEKG('svt', 200, 'svt')}
              <p class="text-xs text-center text-gray-600 dark:text-gray-300">
                Tx: <strong>Adenosine 6mg IV push rápido</strong> (12mg segunda dosis).
                ${t('Vagales primero si estable.', 'Vagal maneuvers first if stable.')}
              </p>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-teal-600 dark:text-teal-400 font-black">Torsades de Pointes</strong>
              ${getEKG('torsades', 120, 'torsades')}
              <p class="text-xs text-center text-gray-600 dark:text-gray-300 mt-1">
                Tx: <strong>Magnesium Sulfate 2g IV</strong> (QT prolongado).
                ${t('Corregir K+, Mg++, evitar fármacos prolongadores QT.', 'Correct K+, Mg++, avoid QT-prolonging drugs.')}
              </p>
            </div>
            
            <div class="p-4 bg-gray-100 dark:bg-black/30 rounded-2xl border border-gray-200 dark:border-brand-border hover:shadow-lg transition-shadow group">
              <strong class="text-sm uppercase text-gray-600 dark:text-gray-400 font-black">Asystole (Flatline)</strong>
              ${getEKG('asystole', 0, 'asystole')}
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

    // --- 3. RITMOS CRÍTICOS ---
    renderCriticalRhythms() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-l-4 border-red-600 pl-4">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white uppercase">
              ${t('3. Desfibrilación vs Cardioversión', '3. Defib vs Cardioversion')}
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div class="p-5 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800">
                <strong class="text-red-700 dark:text-red-400 block mb-2 uppercase text-lg flex items-center gap-2">
                  <i class="fa-solid fa-bolt"></i> ${t('Desfibrilación (Asincrónica)', 'Defibrillation (Asynchronous)')}
                </strong>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  ${t('<strong>Sincronización OFF</strong>. Energía alta. Paciente <strong>SIN PULSO</strong>.', '<strong>Sync OFF</strong>. High energy. <strong>PULSELESS</strong> patient.')}
                </p>
                <div class="space-y-2 text-sm font-bold text-red-800 dark:text-red-200">
                   <div class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-black/20 rounded-lg">
                     <strong>V-Fib</strong>: ${t('Energía: 200J (bifásico)', 'Energy: 200J (biphasic)')}
                   </div>
                   <div class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-black/20 rounded-lg">
                     <strong>Pulseless V-Tach</strong>: ${t('Energía: 200J (bifásico)', 'Energy: 200J (biphasic)')}
                   </div>
                </div>
                <div class="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <p class="text-xs font-bold text-red-900 dark:text-red-200">
                    ${t('Secuencia: 1) Confirmar sin pulso, 2) Cargar desfibrilador, 3) "Alejar" del paciente, 4) Descargar.', 'Sequence: 1) Confirm no pulse, 2) Charge defibrillator, 3) "Clear" patient, 4) Shock.')}
                  </p>
                </div>
             </div>
             <div class="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-200 dark:border-blue-800">
                <strong class="text-blue-700 dark:text-blue-400 block mb-2 uppercase text-lg flex items-center gap-2">
                  <i class="fa-solid fa-wave-square"></i> ${t('Cardioversión (Sincronizada)', 'Cardioversion (Synchronized)')}
                </strong>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  ${t('<strong>Sincronización ON</strong>. Evita onda T. Paciente <strong>CON PULSO</strong>. <strong>Sedación antes</strong>.', '<strong>Sync ON</strong>. Avoids T-wave. <strong>WITH PULSE</strong>. <strong>Sedate first</strong>.')}
                </p>
                <div class="space-y-2 text-sm font-bold text-blue-800 dark:text-blue-200">
                   <div class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-black/20 rounded-lg">
                     <strong>V-Tach con pulso</strong>: ${t('Energía: 100J (bifásico)', 'Energy: 100J (biphasic)')}
                   </div>
                   <div class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-black/20 rounded-lg">
                     <strong>SVT/A-Fib/A-Flutter</strong>: ${t('Energía: 50-100J (bifásico)', 'Energy: 50-100J (biphasic)')}
                   </div>
                </div>
                <div class="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <p class="text-xs font-bold text-blue-900 dark:text-blue-200">
                    ${t('Preparación: Oxígeno, acceso IV, monitor, equipo de reanimación disponible. Sedación (Midazolam, Propofol).', 'Preparation: O2, IV access, monitor, crash cart available. Sedation (Midazolam, Propofol).')}
                  </p>
                </div>
             </div>
          </div>
        </section>
      `;
    },

    // --- 4. ALGORITMOS ACLS ---
    renderACLSAlgorithms() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-l-4 border-purple-600 pl-4">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white uppercase">
              ${t('4. Algoritmos ACLS (Resumen)', '4. ACLS Algorithms (Summary)')}
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-5 bg-purple-50 dark:bg-purple-900/10 rounded-3xl border border-purple-200 dark:border-purple-800">
              <strong class="text-purple-800 dark:text-purple-300 block mb-3 text-lg">${t('Ritmos Desfibrilables', 'Shockable Rhythms')}</strong>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
                <strong>V-Fib / Pulseless V-Tach</strong>
              </p>
              <ol class="list-decimal pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>${t('Iniciar RCP de alta calidad', 'Start high-quality CPR')}</li>
                <li>${t('Desfibrilar (200J bifásico)', 'Defibrillate (200J biphasic)')}</li>
                <li>${t('CPR 2 min → Revaluar ritmo', 'CPR 2 min → Recheck rhythm')}</li>
                <li>${t('Epinefrina 1mg IV/IO q3-5min', 'Epinephrine 1mg IV/IO q3-5min')}</li>
                <li>${t('Amiodarona 300mg IV/IO (segunda dosis 150mg)', 'Amiodarone 300mg IV/IO (second dose 150mg)')}</li>
                <li>${t('Considerar causas reversibles (6Hs & 6Ts)', 'Consider reversible causes (6Hs & 6Ts)')}</li>
              </ol>
            </div>
            
            <div class="p-5 bg-gray-100 dark:bg-gray-800/50 rounded-3xl border border-gray-200 dark:border-gray-700">
              <strong class="text-gray-800 dark:text-gray-300 block mb-3 text-lg">${t('Ritmos No Desfibrilables', 'Non-Shockable Rhythms')}</strong>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
                <strong>Asystole / PEA (Actividad Eléctrica sin Pulso)</strong>
              </p>
              <ol class="list-decimal pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>${t('Iniciar RCP de alta calidad', 'Start high-quality CPR')}</li>
                <li>${t('<strong>NO DESFIBRILAR</strong>', '<strong>DO NOT DEFIBRILLATE</strong>')}</li>
                <li>${t('Epinefrina 1mg IV/IO q3-5min', 'Epinephrine 1mg IV/IO q3-5min')}</li>
                <li>${t('Atropina 1mg IV/IO q3-5min (solo para Asistolia/PEA bradicárdica)', 'Atropine 1mg IV/IO q3-5min (only for bradycardic Asystole/PEA)')}</li>
                <li class="font-bold text-red-600">${t('Buscar causas reversibles (6Hs y 6Ts):', 'Search reversible causes (6Hs & 6Ts):')}
                  <div class="grid grid-cols-2 gap-1 mt-1 text-xs">
                    <div>• Hypovolemia</div>
                    <div>• Hypoxia</div>
                    <div>• Hydrogen ion (acidosis)</div>
                    <div>• Hypo/hyperkalemia</div>
                    <div>• Hypothermia</div>
                    <div>• Tension pneumothorax</div>
                    <div>• Tamponade, cardiac</div>
                    <div>• Toxins</div>
                    <div>• Thrombosis (coronary)</div>
                    <div>• Thrombosis (pulmonary)</div>
                    <div>• Trauma</div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
          
          <div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <strong class="text-yellow-800 dark:text-yellow-300 block mb-2">${t('Consideraciones Especiales:', 'Special Considerations:')}</strong>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-red-600">${t('Hipotermia', 'Hypothermia')}</strong>
                <p class="text-xs">${t('No declarar muerte hasta calentar a 32-34°C', 'Do not pronounce dead until warmed to 32-34°C')}</p>
              </div>
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-red-600">${t('Embarazo', 'Pregnancy')}</strong>
                <p class="text-xs">${t('Desplazar útero izquierdo (manual), considerar cesárea perimortem', 'Left uterine displacement, consider perimortem C-section')}</p>
              </div>
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-red-600">${t('Ahogamiento', 'Drowning')}</strong>
                <p class="text-xs">${t('CPR inmediato, no maniobra Heimlich', 'Immediate CPR, no Heimlich maneuver')}</p>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 5. VASCULAR COMPARISON ---
    renderVascularComparison() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-l-4 border-teal-600 pl-4">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white uppercase">
              ${t('5. Arterial (PAD) vs Venoso (PVD)', '5. Arterial (PAD) vs Venous (PVD)')}
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border-t-4 border-red-500 shadow-lg">
              <div class="flex justify-between items-center mb-4">
                 <h3 class="text-xl font-black text-red-700 dark:text-red-400">PAD (Arterial)</h3>
                 <span class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-[10px] font-bold rounded uppercase">
                    ${t('Falta Oxígeno (Isquemia)', 'No Oxygen (Ischemia)')}
                 </span>
              </div>
              
              <ul class="space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-300">
                 <li class="flex gap-3">
                    <i class="fa-solid fa-person-walking text-red-500 mt-1"></i>
                    <div>
                       <strong class="block text-gray-900 dark:text-white">${t('Dolor: Claudicación Intermitente', 'Pain: Intermittent Claudication')}</strong>
                       <span class="text-xs md:text-sm">${t('Duele al caminar (muscular). Para al descansar. Mejora con la suspensión de la extremidad.', 'Pain with walking (muscular). Stops at rest. Improves with limb dependency.')}</span>
                    </div>
                 </li>
                 <li class="flex gap-3">
                    <i class="fa-solid fa-snowflake text-red-500 mt-1"></i>
                    <div>
                       <strong class="block text-gray-900 dark:text-white">${t('Piel: Fría/Brillante/Pálida', 'Skin: Cold/Shiny/Pale')}</strong>
                       <span class="text-xs md:text-sm">${t('Sin pelo (alopecia). Pulsos débiles o ausentes. Úlceras punzantes en dedos/talones.', 'Hairless (alopecia). Weak or absent pulses. Punched-out ulcers on toes/heels.')}</span>
                    </div>
                 </li>
                 <li class="flex gap-3">
                    <i class="fa-solid fa-stethoscope text-red-500 mt-1"></i>
                    <div>
                       <strong class="block text-gray-900 dark:text-white">${t('Índice Tobillo-Brazo (ABI)', 'Ankle-Brachial Index (ABI)')}</strong>
                       <span class="text-xs md:text-sm">${t('<strong>Normal:</strong> 1.0-1.4, <strong>PAD:</strong> <0.9, <strong>Severo:</strong> <0.4', '<strong>Normal:</strong> 1.0-1.4, <strong>PAD:</strong> <0.9, <strong>Severe:</strong> <0.4')}</span>
                    </div>
                 </li>
                 <li class="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900 text-center">
                    <strong class="block text-red-800 dark:text-red-300 uppercase font-black text-lg">
                        <i class="fa-solid fa-arrow-down mr-1"></i> DANGLE
                    </strong>
                    <span class="text-xs text-red-700 dark:text-red-400 font-bold">${t('Piernas Abajo (Colgar) - Aumenta flujo', 'Legs Down (Dangle) - Increases flow')}</span>
                 </li>
              </ul>
            </div>

            <div class="p-6 bg-white dark:bg-brand-card rounded-3xl border-t-4 border-blue-500 shadow-lg">
              <div class="flex justify-between items-center mb-4">
                 <h3 class="text-xl font-black text-blue-700 dark:text-blue-400">PVD (Venous)</h3>
                 <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-[10px] font-bold rounded uppercase">
                    ${t('Retorno Bloqueado (Estasis)', 'No Return (Stasis)')}
                 </span>
              </div>
              
              <ul class="space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-300">
                 <li class="flex gap-3">
                    <i class="fa-solid fa-weight-hanging text-blue-500 mt-1"></i>
                    <div>
                       <strong class="block text-gray-900 dark:text-white">${t('Dolor: Pesadez/Dolor Sordo', 'Pain: Dull/Achy/Heavy')}</strong>
                       <span class="text-xs md:text-sm">${t('Dolor constante, peor al final del día. Alivia con elevación. Calambres nocturnos.', 'Constant ache, worse end of day. Relieved by elevation. Night cramps.')}</span>
                    </div>
                 </li>
                 <li class="flex gap-3">
                    <i class="fa-solid fa-droplet text-blue-500 mt-1"></i>
                    <div>
                       <strong class="block text-gray-900 dark:text-white">${t('Piel: Edema/Marrón/Caliente', 'Skin: Edema/Brown/Warm')}</strong>
                       <span class="text-xs md:text-sm">${t('Caliente al tacto, gruesa (lipodermatosclerosis), color marrón (hemosiderosis). Úlceras irregulares, superficiales en maleolos.', 'Warm to touch, thick (lipodermatosclerosis), brown discoloration (hemosiderosis). Irregular, superficial ulcers at malleoli.')}</span>
                    </div>
                 </li>
                 <li class="flex gap-3">
                    <i class="fa-solid fa-hand text-blue-500 mt-1"></i>
                    <div>
                       <strong class="block text-gray-900 dark:text-white">${t('Factores de Riesgo', 'Risk Factors')}</strong>
                       <span class="text-xs md:text-sm">${t('TVP previa, obesidad, embarazo, inmovilidad, cirugía reciente.', 'Previous DVT, obesity, pregnancy, immobility, recent surgery.')}</span>
                    </div>
                 </li>
                 <li class="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900 text-center">
                    <strong class="block text-blue-800 dark:text-blue-300 uppercase font-black text-lg">
                        <i class="fa-solid fa-arrow-up mr-1"></i> ELEVATE
                    </strong>
                    <span class="text-xs text-blue-700 dark:text-blue-400 font-bold">${t('Piernas Arriba - Mejora retorno venoso', 'Legs Up - Improves venous return')}</span>
                 </li>
              </ul>
            </div>
          </div>
        </section>
      `;
    },

    // --- 6. DVT ---
    renderDVT() {
      return `
        <section>
          <div class="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-3xl border border-purple-200 dark:border-purple-800">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg">
                    <i class="fa-solid fa-clover"></i>
                </div>
                <h3 class="text-xl font-black text-purple-900 dark:text-purple-300 uppercase">
                    ${t('DVT - Trombosis Venosa Profunda', 'DVT - Deep Vein Thrombosis')}
                </h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <strong class="text-sm text-purple-800 dark:text-purple-300 block mb-2">${t('Escala de Wells para DVT:', 'Wells Score for DVT:')}</strong>
                    <ul class="text-sm md:text-base space-y-2 text-gray-600 dark:text-gray-400">
                        <li class="flex items-center gap-2"><i class="fa-solid fa-circle-exclamation text-purple-500"></i> <strong>+1</strong> ${t('Cáncer activo', 'Active cancer')}</li>
                        <li class="flex items-center gap-2"><i class="fa-solid fa-circle-exclamation text-purple-500"></i> <strong>+1</strong> ${t('Parálisis/inmovilización reciente', 'Paralysis/recent immobilization')}</li>
                        <li class="flex items-center gap-2"><i class="fa-solid fa-circle-exclamation text-purple-500"></i> <strong>+1</strong> ${t('Encamado >3 días/cirugía <4 semanas', 'Bedridden >3 days/surgery <4 weeks')}</li>
                        <li class="flex items-center gap-2"><i class="fa-solid fa-circle-exclamation text-purple-500"></i> <strong>+1</strong> ${t('Hinchazón completa de pierna', 'Entire leg swollen')}</li>
                    </ul>
                </div>
                <div class="bg-white dark:bg-black/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/50">
                    <strong class="text-red-600 block mb-2 uppercase">${t('¡PELIGRO: EMBOLIA PULMONAR!', 'DANGER: PULMONARY EMBOLISM!')}</strong>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        ${t('Si el coágulo se desprende, viaja a los pulmones.', 'If clot breaks loose, travels to lungs.')}
                    </p>
                    <ul class="text-xs font-bold text-red-700 dark:text-red-300 space-y-1">
                        <li>• ${t('Disnea súbita', 'Sudden dyspnea')}</li>
                        <li>• ${t('Dolor torácico (pleurítico)', 'Chest pain (pleuritic)')}</li>
                        <li>• ${t('Hipoxia & Taquicardia', 'Hypoxia & Tachycardia')}</li>
                    </ul>
                </div>
            </div>
          </div>
        </section>
      `;
    },

    // --- 7. PHARMACOLOGY ---
    renderPharmacology() {
      return `
        <section>
          <div class="flex items-center gap-3 mb-6 border-l-4 border-yellow-500 pl-4">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white uppercase">
              ${t('7. Farmacología Cardíaca Crítica', '7. Critical Cardiac Pharm')}
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-gray-200 dark:border-brand-border hover:border-yellow-400 transition-colors">
              <strong class="text-yellow-600 dark:text-yellow-400 text-lg block mb-1">Atropine</strong>
              <p class="text-gray-500 text-xs mb-2">Anticholinergic</p>
              <ul class="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                 <li><i class="fa-solid fa-arrow-up text-green-500"></i> ${t('Sube Frecuencia Cardíaca.', 'Increases Heart Rate.')}</li>
                 <li><strong class="text-black dark:text-white">Dosis: 1 mg IV</strong> (AHA 2020).</li>
                 <li><i class="fa-solid fa-triangle-exclamation text-orange-500"></i> ${t('Max 3mg total.', 'Max 3mg total.')}</li>
              </ul>
            </div>

            <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-gray-200 dark:border-brand-border hover:border-purple-400 transition-colors">
              <strong class="text-purple-600 dark:text-purple-400 text-lg block mb-1">Adenosine</strong>
              <p class="text-gray-500 text-xs mb-2">Antiarrhythmic (SVT)</p>
              <ul class="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                 <li><i class="fa-solid fa-syringe text-indigo-500"></i> ${t('IV PUSH RÁPIDO (1-2s).', 'FAST IV PUSH (1-2s).')}</li>
                 <li><i class="fa-solid fa-heart-crack text-red-500"></i> ${t('Paro breve es normal.', 'Brief asystole is expected.')}</li>
                 <li><strong class="text-black dark:text-white">6mg -> 12mg</strong></li>
              </ul>
            </div>
            
            <div class="p-4 bg-white dark:bg-brand-card rounded-xl border border-gray-200 dark:border-brand-border hover:border-blue-400 transition-colors">
              <strong class="text-blue-600 dark:text-blue-400 text-lg block mb-1">Amiodarone</strong>
              <p class="text-gray-500 text-xs mb-2">Antiarrhythmic (V-Fib/V-Tach)</p>
              <ul class="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                 <li><strong class="text-black dark:text-white">300mg IV</strong> ${t('(paro)', '(arrest)')}</li>
                 <li><i class="fa-solid fa-lungs text-red-500 mr-1"></i> ${t('Toxicidad Pulmonar.', 'Pulmonary Toxicity.')}</li>
                 <li><i class="fa-solid fa-wave-square text-blue-500 mr-1"></i> ${t('Prolonga QT → riesgo Torsades.', 'Prolongs QT → Torsades risk.')}</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
            <strong class="text-red-800 dark:text-red-300 block mb-2 flex items-center gap-2">
                <i class="fa-solid fa-shield-virus"></i>
                ${t('Precauciones de Extravasación de Vasopresores:', 'Vasopressor Extravasation Precautions:')}
            </strong>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-red-600">Norepinefrina / Dopamina</strong>
                <p class="mt-1 font-bold text-gray-800 dark:text-gray-200">
                    ${t('Antídoto: Phentolamine', 'Antidote: Phentolamine')}
                </p>
                <p class="text-gray-500">${t('Inyectar subcutáneo circular (Regitine). Previene necrosis.', 'Inject SQ circular (Regitine). Prevents necrosis.')}</p>
              </div>
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-blue-600">Beta Blockers (-lol)</strong>
                <p class="mt-1 text-gray-700 dark:text-gray-300">
                    ${t('Precaución: Asma/EPOC', 'Caution: Asthma/COPD')}
                </p>
                <p class="text-gray-500">${t('Broncoespasmo (B2 block). Oculta hipoglucemia.', 'Bronchospasm (B2 block). Hides hypoglycemia.')}</p>
              </div>
              <div class="p-2 bg-white dark:bg-black/20 rounded">
                <strong class="text-orange-600">Calcium Channel Blockers</strong>
                <p class="mt-1 text-gray-700 dark:text-gray-300">
                    Diltiazem / Verapamil
                </p>
                <p class="text-gray-500">${t('No dar si hay fallo cardíaco (reduce contractilidad).', 'No HF (reduces contractility).')}</p>
              </div>
            </div>
          </div>
        </section>
      `;
    }
  });
})();