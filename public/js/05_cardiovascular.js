// 05_cardiovascular.js — Sistema Cardiovascular COMPLETO (NCLEX)
// VERSIÓN MAESTRA DEFINITIVA: EKG Generator, Vascular, Shock & Pharm
// FUSIÓN: Arquitectura v8 + Protocolos AHA 2020 (Atropina 1mg) + Seguridad Vasopresores v5
// CREADO POR REYNIER DIAZ GERONES, 01-16-2026
// MODIFICADO PARA SONIDO Y TRAZO PROFESIONAL (SOLO SECCIÓN 2)
// --- MEJORAS: trazados realistas, beep nítido, asistolia continua, V-Fib caótico filtrado ---

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

  function clearEkgHandle(handle) {
    if (!handle) return;
    if (typeof handle === 'number') {
      clearInterval(handle);
      clearTimeout(handle);
      return;
    }
    if (handle.interval) clearInterval(handle.interval);
    if (handle.timeout) clearTimeout(handle.timeout);
    if (handle.timeouts && Array.isArray(handle.timeouts)) {
      for (const tid of handle.timeouts) clearTimeout(tid);
    }
  }

  // --- MEJORADO: Beep corto y nítido (∼1080 Hz, 38 ms) ---
  function beep(frequency = 1080, duration = 38) {
    if (isMuted) return;
    initAudio();
    if (audioContext.state === 'suspended') audioContext.resume();

    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.0001, now);

    const osc = audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    // Ligera caída de tono (realismo)
    osc.frequency.exponentialRampToValueAtTime(Math.max(800, frequency * 0.92), now + duration / 1000);

    // Ataque rápido, decaimiento natural
    gain.gain.linearRampToValueAtTime(0.35, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration / 1000);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(now);
    osc.stop(now + duration / 1000);
  }

  // --- MEJORADO: Ruido caótico para V-Fib (filtro pasa banda, blanco) ---
  function vfibNoiseBurst() {
    if (isMuted) return;
    initAudio();
    if (audioContext.state === 'suspended') audioContext.resume();

    const now = audioContext.currentTime;
    const bufferSize = 4096;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400 + Math.random() * 800, now);
    filter.Q.setValueAtTime(1.5 + Math.random() * 2, now);

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.08);
  }

  // --- NUEVO: Sonido continuo para asistolia (sirena plana) ---
  function startContinuousAsystoleSound(el, id) {
    if (!el || !id) return;
    initAudio();
    if (audioContext.state === 'suspended') audioContext.resume();

    const gain = audioContext.createGain();
    const osc = audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, audioContext.currentTime); // 420 Hz, tono grave

    osc.connect(gain);
    gain.connect(audioContext.destination);

    const targetGain = isMuted ? 0 : 0.12;
    gain.gain.setValueAtTime(targetGain, audioContext.currentTime);

    osc.start();

    activeIntervals[id] = {
      kind: 'asystole-continuous',
      oscillator: osc,
      gain: gain,
      originalGain: 0.12,
      el: el
    };
  }

  function stopContinuousAsystoleSound(id) {
    const handle = activeIntervals[id];
    if (handle && handle.kind === 'asystole-continuous') {
      try {
        handle.oscillator.stop();
        handle.oscillator.disconnect();
        handle.gain.disconnect();
      } catch (e) {}
      delete activeIntervals[id];
    }
  }

  function pickFrequencyByBpm(bpm) {
    if (!Number.isFinite(bpm)) return 950;
    if (bpm < 60) return 780;
    if (bpm > 150) return 1100;
    if (bpm > 110) return 1020;
    return 950;
  }

  // Iniciar animación y sonido al hacer hover
  window.startEKG = function (id, rhythm, bpm = 75) {
    const el = document.getElementById(id);
    if (!el) return;

    el.classList.add('ekg-moving');
    const trace = el.querySelector('.ekg-trace');
    if (trace) trace.classList.add('ekg-glow');

    clearEkgHandle(activeIntervals[id]);
    delete activeIntervals[id];

    // --- ASISTOLIA: tono continuo mientras hover ---
    if (rhythm === 'asystole') {
      startContinuousAsystoleSound(el, id);
      return;
    }

    // --- V-FIB: ruido continuo + alarma ---
    if (rhythm === 'vfib') {
      const timeouts = [];
      const noiseInterval = setInterval(() => {
        if (el.matches(':hover')) vfibNoiseBurst();
      }, 70);
      const alarmInterval = setInterval(() => {
        if (el.matches(':hover')) beep(1180, 70);
      }, 520);
      activeIntervals[id] = { kind: 'vfib', interval: noiseInterval, timeouts: [alarmInterval, ...timeouts] };
      return;
    }

    // --- TODOS LOS DEMÁS: beep sincronizado a QRS del trazo ---
    const cycleMs = Number(el.dataset.cycleMs) || 8000;
    const qrsMsRaw = (el.dataset.qrsMs || '').trim();
    const qrsMsList = qrsMsRaw ? qrsMsRaw.split(',').map((s) => Number(s.trim())) : null;

    const freq = pickFrequencyByBpm(Number(el.dataset.bpm) || bpm);

    if (qrsMsList && qrsMsList.length) {
      scheduleQrsBeepList(el, id, qrsMsList, cycleMs, freq);
      return;
    }

    // Fallback (si no hay lista)
    const intervalMs = 60000 / Math.max(1, bpm);
    activeIntervals[id] = setInterval(() => {
      if (el.matches(':hover')) beep(freq, 55);
    }, intervalMs);
  };

  window.stopEKG = function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('ekg-moving');
      const trace = el.querySelector('.ekg-trace');
      if (trace) trace.classList.remove('ekg-glow');
    }
    // Detener sonido continuo de asistolia si existe
    if (activeIntervals[id] && activeIntervals[id].kind === 'asystole-continuous') {
      stopContinuousAsystoleSound(id);
    } else {
      clearEkgHandle(activeIntervals[id]);
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

    // Ajustar todos los sonidos continuos de asistolia
    for (const id in activeIntervals) {
      const h = activeIntervals[id];
      if (h && h.kind === 'asystole-continuous' && h.gain) {
        h.gain.gain.setValueAtTime(isMuted ? 0 : h.originalGain, audioContext.currentTime);
      }
    }
  };

  function scheduleQrsBeepList(el, id, qrsMsList, cycleMs, frequency) {
    if (!qrsMsList || !qrsMsList.length) return;

    const qrs = qrsMsList
      .map((v) => Math.max(0, Math.min(cycleMs, Number(v) || 0)))
      .filter((v) => Number.isFinite(v))
      .sort((a, b) => a - b);

    if (!qrs.length) return;

    let idx = 0;
    let lastT = 0; // ms
    const tick = () => {
      if (!el.matches(':hover')) return;

      const target = qrs[idx];
      const delay = Math.max(0, target - lastT);

      activeIntervals[id] = {
        kind: 'qrs',
        timeout: setTimeout(() => {
          if (el.matches(':hover')) beep(frequency, 55);
          lastT = target;
          idx += 1;
          if (idx >= qrs.length) {
            idx = 0;
            lastT = lastT - cycleMs;
          }
          tick();
        }, delay),
      };
    };

    tick();
  }

  // ============================================================
  //   GENERADOR EKG CON TRAZOS CLÍNICAMENTE EXACTOS (MEJORADO)
  //   + SIN CORTES (LOOP REAL) + QRS TIMING PARA SONIDO EXACTO
  // ============================================================
  const getEKG = (type, bpm = 75, rhythm = type) => {
    const strokeColor = 'stroke-green-600 dark:stroke-green-400';
    const gridColor = 'text-green-100 dark:text-green-900/20';
    const uniqueId = `ekg-${type}-${ekgCounter++}`;
    const gridId = `grid-${uniqueId}`;

    // --- “Papel” fijo: 8s en viewport, 2 segmentos duplicados para loop perfecto ---
    const VIEW_W = 2000;
    const VIEW_H = 100;
    const MID_Y = 50;
    const PX_PER_SEC = 250; // 2000px / 8s = 250px/s
    const CYCLE_MS = 8000;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const gauss = (x, mu, sigma) => Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));

    // Seed determinista por strip
    let seed = 0;
    for (let i = 0; i < uniqueId.length; i++) seed = (seed * 31 + uniqueId.charCodeAt(i)) >>> 0;
    function rng() {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 4294967296;
    }
    // Ruido determinista de alta frecuencia
    function noiseAt(x) {
      const h = Math.floor(x / 5);
      let n = (seed ^ (h * 1234567)) >>> 0;
      n ^= n << 13; n ^= n >>> 17; n ^= n << 5;
      return ((n >>> 0) / 4294967296) * 2 - 1;
    }

    const rrSec = bpm > 0 ? 60 / bpm : 1;
    const beatPx = rrSec * PX_PER_SEC;

    const MV_TO_PX = 22; // 1 mV = 22 px

    // --- Onda PQRST realista (amplitudes y duraciones corregidas) ---
    function pqrstReal(tPx, rrPx, options = {}) {
      const pAmp = options.pAmp ?? 0.15;
      const qAmp = options.qAmp ?? -0.12;
      const rAmp = options.rAmp ?? 1.5;
      const sAmp = options.sAmp ?? -0.35;
      const tAmp = options.tAmp ?? 0.35;

      // Posiciones típicas (fracción del RR)
      const pMu = 0.16 * rrPx;
      const qMu = 0.38 * rrPx;
      const rMu = 0.41 * rrPx;
      const sMu = 0.44 * rrPx;
      const tMu = 0.68 * rrPx;

      // Anchuras (sigma en px)
      const pW = 0.03 * rrPx;     // ~0.08 s
      const qW = 0.012 * rrPx;    // 0.03 s
      const rW = 0.01 * rrPx;     // 0.025 s
      const sW = 0.014 * rrPx;    // 0.035 s
      const tW = 0.06 * rrPx;     // 0.15 s

      let mv = 0;
      mv += pAmp * gauss(tPx, pMu, pW);
      mv += qAmp * gauss(tPx, qMu, qW);
      mv += rAmp * gauss(tPx, rMu, rW);
      mv += sAmp * gauss(tPx, sMu, sW);
      mv += tAmp * gauss(tPx, tMu, tW);
      return mv;
    }

    // --- Complejo ancho (TV, Torsades) ---
    function wideComplex(tPx, rrPx, amp = 1.6, widthFactor = 1.0) {
      const rMu = 0.45 * rrPx;
      const sMu = 0.52 * rrPx;
      // QRS ancho ~0.16 s
      const sigmaR = 0.07 * rrPx * widthFactor;
      const sigmaS = 0.08 * rrPx * widthFactor;
      let mv = 0;
      mv += amp * gauss(tPx, rMu, sigmaR);
      mv += -0.6 * gauss(tPx, sMu, sigmaS);
      // Pequeña muesca (notch) frecuente en TV
      mv += 0.1 * gauss(tPx, rMu - 0.03 * rrPx, 0.02 * rrPx);
      return mv;
    }

    // --- Precomputos deterministas por ritmo ---
    const vfibKnots = [];
    if (type === 'vfib') {
      for (let i = 0; i < VIEW_W / 10 + 3; i++) {
        vfibKnots.push(rng() * 1.2 - 0.6);
      }
    }
    function vfibAt(xPx) {
      const idx = Math.floor(xPx / 10);
      const f = (xPx % 10) / 10;
      const a = vfibKnots[(idx + vfibKnots.length) % vfibKnots.length];
      const b = vfibKnots[(idx + 1 + vfibKnots.length) % vfibKnots.length];
      return a + (b - a) * f;
    }

    // A-Fib: QRS irregulares + baseline fibrilatoria
    const afibQrs = [];
    if (type === 'afib') {
      let x = 40;
      while (x < VIEW_W - 80) {
        const rrSecVar = 0.6 + rng() * 0.8; // 0.6-1.4 s → 100-43 bpm
        const rrPx = rrSecVar * PX_PER_SEC;
        x += rrPx;
        afibQrs.push(x);
      }
    }

    // 3rd degree block: P regulares, QRS lentos
    const blockP = [];
    const blockQ = [];
    if (type === 'block3') {
      const atrialRate = 90;
      const ventRate = bpm; // 40 bpm típico
      const pRR = (60 / atrialRate) * PX_PER_SEC;
      const vRR = (60 / Math.max(1, ventRate)) * PX_PER_SEC;
      for (let px = 40; px < VIEW_W + 1; px += pRR) blockP.push(px);
      for (let vx = 80; vx < VIEW_W + 1; vx += vRR) blockQ.push(vx);
    }

    // Torsades: modulación sinusoidal de amplitud
    const torsadesMod = [];
    if (type === 'torsades') {
      for (let i = 0; i < 50; i++) {
        torsadesMod.push(Math.sin(i * 0.6) * 0.6 + 0.7);
      }
    }

    // --- Cálculo del trazo (mV) ---
    function computeY(sampleX) {
      const xPx = sampleX;
      let mv = 0;

      // Línea base suave (respiración) y ruido eléctrico mínimo
      mv += 0.02 * Math.sin((2 * Math.PI * xPx) / (VIEW_W * 0.8));
      mv += noiseAt(xPx) * 0.005; // ruido casi imperceptible

      switch (type) {
        case 'sinus':
        case 'brady': {
          const tPx = xPx % beatPx;
          mv += pqrstReal(tPx, beatPx, {});
          break;
        }
        case 'svt': {
          const tPx = xPx % beatPx;
          mv += pqrstReal(tPx, beatPx, { pAmp: 0, tAmp: 0.25, rAmp: 1.2 });
          break;
        }
        case 'aflutter': {
          const tPx = xPx % beatPx;
          mv += pqrstReal(tPx, beatPx, { pAmp: 0, tAmp: 0.2, rAmp: 1.1 });
          // Ondas F en diente de sierra a 300/min (5 Hz)
          const flutterFreq = 5;
          const sec = xPx / PX_PER_SEC;
          const tri = 2 * (sec * flutterFreq - Math.floor(sec * flutterFreq + 0.5));
          mv += 0.16 * tri;
          break;
        }
        case 'afib': {
          // Baseline fibrilatoria: múltiples senos no armónicos
          const sec = xPx / PX_PER_SEC;
          mv += 0.07 * Math.sin(2 * Math.PI * 6.2 * sec);
          mv += 0.05 * Math.sin(2 * Math.PI * 8.7 * sec + 0.4);
          mv += 0.04 * Math.sin(2 * Math.PI * 11.3 * sec + 1.1);
          mv += noiseAt(xPx * 2) * 0.03;

          // QRS irregulares, estrechos
          for (let i = 0; i < afibQrs.length; i++) {
            const qx = afibQrs[i];
            const dx = xPx - qx;
            if (dx < -40 || dx > 80) continue;
            mv += -0.1 * gauss(dx, 0, 5);
            mv += 1.1 * gauss(dx, 8, 4);
            mv += -0.25 * gauss(dx, 16, 6);
            mv += 0.15 * gauss(dx, 60, 18); // T
          }
          break;
        }
        case 'vtach': {
          const tPx = xPx % beatPx;
          mv += wideComplex(tPx, beatPx, 1.6, 1.2);
          break;
        }
        case 'torsades': {
          const tPx = xPx % beatPx;
          const beatIdx = Math.floor(xPx / beatPx);
          const mod = torsadesMod[beatIdx % torsadesMod.length] || 1;
          const axis = Math.sin(beatIdx * 0.5) > 0 ? 1 : -1;
          mv += wideComplex(tPx, beatPx, 1.4 * mod, 1.1) * axis;
          break;
        }
        case 'vfib': {
          // Caos: mezcla de ruido interpolado y senos erráticos
          const base = vfibAt(xPx) * 0.9;
          const chaos = Math.sin(xPx * 0.08) * 0.4 + Math.sin(xPx * 0.13) * 0.3;
          mv += base + chaos * 0.6;
          break;
        }
        case 'block3': {
          // Ondas P regulares
          for (let i = 0; i < blockP.length; i++) {
            const px = blockP[i];
            const dx = xPx - px;
            if (dx < -40 || dx > 60) continue;
            mv += 0.12 * gauss(dx, 0, 10);
          }
          // QRS de escape ventriculares (anchos, lentos)
          for (let j = 0; j < blockQ.length; j++) {
            const qx = blockQ[j];
            const dx = xPx - qx;
            if (dx < -70 || dx > 120) continue;
            mv += -0.1 * gauss(dx, 0, 12);
            mv += 1.2 * gauss(dx, 30, 12);
            mv += -0.3 * gauss(dx, 50, 16);
            mv += 0.18 * gauss(dx, 100, 25);
          }
          break;
        }
        case 'asystole': {
          // Línea casi plana con respiración y ruido ínfimo
          mv += 0.01 * Math.sin((2 * Math.PI * xPx) / (VIEW_W * 0.7));
          mv += noiseAt(xPx) * 0.005;
          break;
        }
      }

      // Convertir a Y (invertido, 1 mV = 22 px)
      const y = MID_Y - mv * MV_TO_PX;
      return clamp(y, 8, 92);
    }

    // --- Construcción del path (2 segmentos idénticos para loop perfecto) ---
    function buildSegment(xOffset, moveCmd) {
      let d = '';
      for (let x = 0; x <= VIEW_W; x++) {
        const y = computeY(x);
        const cmd = x === 0 ? moveCmd : 'L';
        d += `${cmd}${x + xOffset},${y.toFixed(2)} `;
      }
      return d.trim();
    }

    const path1 = buildSegment(0, 'M');
    const path2 = buildSegment(VIEW_W, 'L');
    const repeatedPath = `${path1} ${path2}`;

    // --- Lista de QRS (ms) exacta por ciclo (para sonido) ---
    const qrsMs = [];
    if (type === 'afib') {
      for (const qx of afibQrs) {
        const tMs = ((qx + 8) / PX_PER_SEC) * 1000;
        if (tMs > 0 && tMs < CYCLE_MS) qrsMs.push(Math.round(tMs));
      }
    } else if (type === 'block3') {
      for (const qx of blockQ) {
        const tMs = ((qx + 30) / PX_PER_SEC) * 1000;
        if (tMs > 0 && tMs < CYCLE_MS) qrsMs.push(Math.round(tMs));
      }
    } else if (type !== 'vfib' && type !== 'asystole') {
      const intervalMs = 60000 / Math.max(1, bpm);
      let t0 = (type === 'vtach' || type === 'torsades' ? 0.45 : 0.41) * intervalMs;
      while (t0 < CYCLE_MS + 1) {
        if (t0 >= 0 && t0 < CYCLE_MS) qrsMs.push(Math.round(t0));
        t0 += intervalMs;
      }
    }

    const qrsAttr = qrsMs.length ? qrsMs.join(',') : '';

    return `
      <div id="${uniqueId}"
           class="w-full h-24 bg-white dark:bg-black/40 rounded-lg border border-green-200 dark:border-green-900/30 overflow-hidden relative my-3 shadow-inner ekg-strip"
           role="img"
           aria-label="EKG strip of ${type}"
           data-rhythm="${rhythm}"
           data-bpm="${bpm}"
           data-cycle-ms="${CYCLE_MS}"
           data-qrs-ms="${qrsAttr}"
           style="--ekg-speed: 8s;"
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

  // --- ESTILOS PARA ANIMACIÓN CONTINUA Y BRILLO (sin cambios) ---
  const ekgAnimationStyle = `
    <style>
      .ekg-moving .ekg-trace {
        transform-box: fill-box;
        transform-origin: center;
        animation: scrollEKG var(--ekg-speed, 8s) linear infinite;
      }
      @keyframes scrollEKG {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
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

  // --- REGISTRO DEL TÓPICO (el resto del código NO se modifica) ---
  if (window.NCLEX) {
    window.NCLEX.registerTopic({
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

      // --- 0. ANATOMY & LABS (sin cambios) ---
      renderAnatomyReview() { /* ... */ },

      // --- 1. PARÁMETROS EKG (sin cambios) ---
      renderEKGParameters() { /* ... */ },

      // --- 2. GUÍA VISUAL EKG (MEJORADA) ---
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

      // --- 3. RITMOS CRÍTICOS (sin cambios) ---
      renderCriticalRhythms() { /* ... */ },

      // --- 4. ALGORITMOS ACLS (sin cambios) ---
      renderACLSAlgorithms() { /* ... */ },

      // --- 5. VASCULAR COMPARISON (sin cambios) ---
      renderVascularComparison() { /* ... */ },

      // --- 6. DVT (sin cambios) ---
      renderDVT() { /* ... */ },

      // --- 7. PHARMACOLOGY (sin cambios) ---
      renderPharmacology() { /* ... */ },
    });
  }
})();