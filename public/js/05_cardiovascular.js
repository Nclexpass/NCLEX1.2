// ============================================================
//  SECCIÓN MODIFICADA: GENERADOR EKG + GUÍA VISUAL
//  (Todo el resto del archivo permanece idéntico)
// ============================================================

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
window.startEKG = function(id, rhythm, bpm = 75) {
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

window.stopEKG = function(id) {
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

// --- GENERADOR EKG CONTINUO (SIN CORTES) ---
const getEKG = (type, bpm = 75, rhythm = type) => {
  const strokeColor = "stroke-green-600 dark:stroke-green-400";
  const gridColor = "text-green-100 dark:text-green-900/20";
  const uniqueId = `ekg-${type}-${ekgCounter++}`;
  const gridId = `grid-${uniqueId}`;

  // Path base del ritmo (un ciclo)
  let basePath = '';
  switch(type) {
    case 'sinus': basePath = "M0,50 h10 c2,-5 5,-5 8,0 h5 l5,-30 l5,60 l5,-30 h5 c3,-8 6,-8 10,0 h10 h10 c2,-5 5,-5 8,0 h5 l5,-30 l5,60 l5,-30 h5 c3,-8 6,-8 10,0 h10"; break;
    case 'brady': basePath = "M0,50 h30 c2,-5 5,-5 8,0 h5 l5,-30 l5,60 l5,-30 h5 c3,-8 6,-8 10,0 h30 h30 c2,-5 5,-5 8,0 h5 l5,-30 l5,60 l5,-30 h5 c3,-8 6,-8 10,0 h30"; break;
    case 'block3': basePath = "M0,55 h10 c2,-6 5,-6 8,0 h15 l5,-35 l5,70 l5,-35 h15 c2,-6 5,-6 8,0 h25 c2,-6 5,-6 8,0 h10 l5,-35 l5,70 l5,-35 h10 c2,-6 5,-6 8,0"; break;
    case 'vtach': basePath = "M0,50 l10,-40 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80 l10,-80 l10,80"; break;
    case 'vfib':  basePath = "M0,50 q5,-10 10,0 t10,5 t10,-15 t10,20 t10,-10 t10,15 t10,-20 t10,10 t10,-5 t10,15 t10,-10 t10,5 t10,-15 t10,10"; break;
    case 'asystole': basePath = "M0,50 c20,2 40,-2 60,1 80,-1 100,0 120,-1 140,1 160,0 180,0 200,0"; break;
    case 'afib':  basePath = "M0,50 l2,2 l2,-2 l2,2 l5,-30 l5,60 l5,-30 l2,2 l2,-2 l10,0 l2,-2 l2,2 l5,-30 l5,60 l5,-30 l2,2 l2,-2 l20,0 l2,-2 l2,2 l5,-30 l5,60 l5,-30"; break;
    case 'aflutter': basePath = "M0,50 l5,-10 l5,10 l5,-10 l5,10 l5,-30 l5,60 l5,-30 l5,-10 l5,10 l5,-10 l5,10 l5,-10 l5,10 l5,-30 l5,60 l5,-30"; break;
    case 'svt':   basePath = "M0,50 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25 l5,-35 l5,60 l5,-25"; break;
    case 'torsades': basePath = "M0,50 l5,-5 l5,5 l5,-10 l5,10 l5,-20 l5,20 l5,-35 l5,35 l5,-20 l5,20 l5,-10 l5,10 l5,-5 l5,5 l5,-5 l5,5 l5,-20 l5,20 l5,-35 l5,35"; break;
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

// --- 2. GUÍA VISUAL EKG — MODIFICADA CON ANIMACIÓN CONTINUA, SONIDOS REALES Y BRILLO ---
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
}
// ============================================================
//  FIN DE SECCIÓN MODIFICADA
// ============================================================