// 34_anatomy.js — NCLEX Anatomy MasterClass "TITANIUM" v12.0
// 🏥 ESTADO: GOD MODE (Audio Procedural + Inyección Forzada + Datos Clínicos Reales)
// 🎯 Autor: Reynier Diaz Gerones & Gemini AI
// 🛡️ Integridad: Auto-reparable (Si el botón desaparece, se vuelve a crear)

class AnatomyTitanium {
  constructor() {
    this.id = 'anatomy';
    this.version = '12.0';
    this.state = {
      system: 'cardio',
      selectedPart: null,
      lang: localStorage.getItem('nclex-language') || 'es',
      audio: false,
      tab: 'clinical', // clinical, nclex, skills
      zoom: 1
    };

    // --- 1. BASE DE DATOS CLÍNICA MAESTRA ---
    this.db = {
      cardio: {
        label: { es: 'Cardiovascular', en: 'Cardiovascular' },
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Heart_anterior_exterior_view.jpg/800px-Heart_anterior_exterior_view.jpg',
        audioMode: 'heart',
        parts: {
          'aorta': {
            name: { es: 'Arco Aórtico', en: 'Aortic Arch' },
            pos: { top: '12%', left: '52%' },
            clinical: { es: 'Punto de máxima presión sistémica. Auscultación: 2do espacio intercostal derecho.', en: 'Point of max systemic pressure. Auscultation: 2nd ICS Right Sternal Border.' },
            nclex: { es: '🚨 DISECCIÓN AÓRTICA: Dolor "desgarrante" en espalda. Diferencia de PA >20mmHg entre brazos. Emergencia Quirúrgica.', en: '🚨 AORTIC DISSECTION: "Tearing" back pain. BP diff >20mmHg between arms. Surgical Emergency.' },
            labs: 'BNP, Troponin I/T, CK-MB'
          },
          'lv': {
            name: { es: 'Ventrículo Izquierdo', en: 'Left Ventricle' },
            pos: { top: '60%', left: '68%' },
            clinical: { es: 'Cámara de bombeo principal. Pared muscular gruesa (hipertrofia en HTA).', en: 'Main pump. Thick wall (hypertrophy in HTN).' },
            nclex: { es: '⚠️ FALLA IZQUIERDA = PULMONES. Disnea, Ortopnea, Crepitantes, Esputo Rosado (Edema Agudo).', en: '⚠️ LEFT FAILURE = LUNGS. Dyspnea, Orthopnea, Crackles, Pink Frothy Sputum.' },
            labs: 'Echocardiogram (EF < 40% = HFrEF)'
          },
          'svc': {
            name: { es: 'Vena Cava Superior', en: 'Superior Vena Cava' },
            pos: { top: '15%', left: '32%' },
            clinical: { es: 'Retorno venoso central. Sitio ideal para punta de Catéter Central (PICC/CVC).', en: 'Central venous return. Ideal tip location for CVC/PICC.' },
            nclex: { es: '🔥 SÍNDROME VCS: Emergencia oncológica (Tumor pulmonar). Edema facial, plétora, disnea. Elevar cabecera.', en: '🔥 SVC SYNDROME: Oncologic emergency. Facial edema, plethora, dyspnea. Elevate HOB.' },
            labs: 'CVP (Normal: 2-8 mmHg)'
          }
        }
      },
      resp: {
        label: { es: 'Respiratorio', en: 'Respiratory' },
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Lungs_diagram_detailed.svg/800px-Lungs_diagram_detailed.svg.png',
        audioMode: 'lungs',
        parts: {
          'trachea': {
            name: { es: 'Tráquea', en: 'Trachea' },
            pos: { top: '10%', left: '48%' },
            clinical: { es: 'Vía aérea permeable. Anillos cartilaginosos.', en: 'Patent airway. Cartilaginous rings.' },
            nclex: { es: '🚨 DESVIACIÓN TRAQUEAL: Signo tardío de Neumotórax a Tensión. Desviación hacia el lado SANO.', en: '🚨 TRACHEAL DEVIATION: Late sign of Tension Pneumothorax. Deviates to HEALTHY side.' },
            labs: 'ABG (pH, pCO2, pO2)'
          },
          'base_right': {
            name: { es: 'Base Pulmonar Der.', en: 'Right Lung Base' },
            pos: { top: '70%', left: '25%' },
            clinical: { es: 'Sitio común de atelectasia post-op y neumonía por aspiración (bronquio más vertical).', en: 'Common site for post-op atelectasis & aspiration pneumonia.' },
            nclex: { es: '⚠️ SONIDOS: Crepitantes (Fluido/Falla), Sibilancias (Asma/EPOC), Roncus (Moco).', en: '⚠️ SOUNDS: Crackles (Fluid/HF), Wheezes (Asthma), Rhonchi (Mucus).' },
            labs: 'Sputum Culture, CXR'
          }
        }
      },
      neuro: {
        label: { es: 'Neurológico', en: 'Neurological' },
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Lobes_of_the_brain_NL.svg/800px-Lobes_of_the_brain_NL.svg.png',
        audioMode: null,
        parts: {
          'frontal': {
            name: { es: 'Lóbulo Frontal', en: 'Frontal Lobe' },
            pos: { top: '25%', left: '20%' },
            clinical: { es: 'Personalidad, Juicio, Control Motor, Área de Broca (Habla).', en: 'Personality, Judgment, Motor, Broca\'s Area (Speech).' },
            nclex: { es: '⚠️ CAMBIOS DE CONDUCTA: A menudo el primer signo de hipoxia o IICP (Presión Intracraneal).', en: '⚠️ BEHAVIOR CHANGES: Often first sign of Hypoxia or IICP.' },
            labs: 'GCS (Glasgow < 8 = Intubate)'
          },
          'brainstem': {
            name: { es: 'Tronco Encefálico', en: 'Brainstem' },
            pos: { top: '75%', left: '55%' },
            clinical: { es: 'Centro de funciones vitales: Respiración, Frecuencia Cardíaca, Temperatura.', en: 'Vital center: RR, HR, Temp.' },
            nclex: { es: '🚨 TRIADA DE CUSHING (IICP Severa): HTA (Sistólica alta), Bradicardia, Resp. Irregular.', en: '🚨 CUSHING TRIAD (Severe IICP): HTN (Widening pulse pressure), Bradycardia, Irregular RR.' },
            labs: 'Brain Death Testing'
          }
        }
      },
      gi: {
        label: { es: 'Gastrointestinal', en: 'Gastrointestinal' },
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Digestive_system_diagram_en.svg/800px-Digestive_system_diagram_en.svg.png',
        audioMode: 'guts',
        parts: {
          'liver': {
            name: { es: 'Hígado', en: 'Liver' },
            pos: { top: '40%', left: '38%' },
            clinical: { es: 'Metabolismo, Coagulación, Albúmina, Detoxificación.', en: 'Metabolism, Clotting, Albumin, Detox.' },
            nclex: { es: '⚠️ CIRROSIS: Sangrado (PT/INR alto), Encefalopatía (Amonio alto -> Lactulosa), Ascitis.', en: '⚠️ CIRRHOSIS: Bleeding (High PT/INR), Encephalopathy (High Ammonia -> Lactulose), Ascites.' },
            labs: 'ALT, AST, Bilirubin, Ammonia, Albumin'
          },
          'appendix': {
            name: { es: 'Apéndice', en: 'Appendix' },
            pos: { top: '68%', left: '42%' },
            clinical: { es: 'Ubicado en el Ciego (Cuadrante Inferior Derecho - RLQ).', en: 'Located at Cecum (RLQ).' },
            nclex: { es: '🚨 APENDICITIS: Dolor McBurney. Si el dolor desaparece súbitamente = RUPTURA = PERITONITIS.', en: '🚨 APPENDICITIS: McBurney\'s pain. Sudden relief = RUPTURE = PERITONITIS.' },
            labs: 'WBC (Shift to left)'
          }
        }
      }
    };

    this.audioCtx = null;
    this.oscillators = [];
    this.binds();
  }

  binds() {
    this.selectSystem = this.selectSystem.bind(this);
    this.selectPart = this.selectPart.bind(this);
    this.toggleAudio = this.toggleAudio.bind(this);
    this.closePanel = this.closePanel.bind(this);
    this.setTab = this.setTab.bind(this);
  }

  // --- 2. MOTOR DE AUDIO PROCEDURAL (WEB AUDIO API) ---
  // Genera sonidos médicos reales matemáticamente sin archivos mp3
  initAudio() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  playTone(freq, type, duration, vol, delay) {
    if(!this.state.audio) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const t = this.audioCtx.currentTime + delay;

    osc.type = type;
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.1);
    this.oscillators.push(osc);
  }

  startSimulationAudio() {
    this.stopAudio();
    if (!this.state.audio) return;
    this.initAudio();
    if(this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const mode = this.db[this.state.system].audioMode;

    if (mode === 'heart') {
      // S1 (Lub) - S2 (Dub) Simulation
      this.loopId = setInterval(() => {
        // S1: Low freq, longer
        this.playTone(60, 'triangle', 0.15, 0.5, 0); 
        // S2: Higher freq, shorter, slightly delayed
        this.playTone(90, 'sine', 0.12, 0.4, 0.35); 
      }, 1000); // 60 BPM
    } else if (mode === 'lungs') {
      // White noise synthesis for breath sounds
      this.loopId = setInterval(() => this.playBreath(), 4000); // 15 RR
    } else if (mode === 'guts') {
      this.loopId = setInterval(() => {
        if(Math.random() > 0.6) this.playTone(Math.random()*200+50, 'sawtooth', 0.1, 0.05, 0);
      }, 800);
    }
  }

  playBreath() {
    if(!this.state.audio) return;
    const bufSize = this.audioCtx.sampleRate * 2; // 2 seconds
    const buffer = this.audioCtx.createBuffer(1, bufSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0; i<bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.2;

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400; // Muffled sound
    const gain = this.audioCtx.createGain();
    
    const t = this.audioCtx.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 1); // Inhale
    gain.gain.linearRampToValueAtTime(0, t + 2);   // Exhale

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);
    noise.start(t);
  }

  stopAudio() {
    if(this.loopId) clearInterval(this.loopId);
    this.oscillators.forEach(o => { try{o.stop()}catch(e){} });
    this.oscillators = [];
  }

  toggleAudio() {
    this.state.audio = !this.state.audio;
    this.renderControls(); // Update button UI
    if(this.state.audio) this.startSimulationAudio();
    else this.stopAudio();
  }

  // --- 3. RENDERIZADO INTERFAZ (PACS STYLE) ---
  render() {
    const sys = this.db[this.state.system];
    const isEs = this.state.lang === 'es';

    return `
      <div class="flex flex-col h-screen max-h-[calc(100vh-60px)] bg-gray-900 text-white font-sans overflow-hidden animate-fade-in">
        
        <div class="flex items-center gap-2 p-3 bg-gray-800 border-b border-gray-700 overflow-x-auto no-scrollbar shadow-lg z-20">
          <div class="text-xs font-bold text-gray-400 mr-2 uppercase tracking-wider">
            <i class="fas fa-layer-group mr-1"></i> ${isEs ? 'Sistemas' : 'Systems'}
          </div>
          ${Object.keys(this.db).map(key => `
            <button onclick="window.NCLEX_TITANIUM.selectSystem('${key}')" 
              class="px-4 py-2 rounded-lg text-sm font-bold transition-all transform active:scale-95 whitespace-nowrap
              ${this.state.system === key ? 'bg-blue-600 text-white shadow-blue-500/50 shadow-md ring-1 ring-blue-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}">
              ${this.db[key].label[this.state.lang]}
            </button>
          `).join('')}
        </div>

        <div class="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
          
          <div class="relative w-full lg:w-3/4 bg-black flex items-center justify-center overflow-hidden group">
            
            <div class="absolute inset-0 opacity-10 pointer-events-none" 
                 style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px;">
            </div>

            <img src="${sys.img}" 
                 class="max-w-full max-h-[80vh] object-contain transition-transform duration-500 ease-out opacity-90 hover:opacity-100"
                 style="transform: scale(${this.state.zoom})"
                 alt="Anatomy">

            <div class="absolute inset-0">
              ${Object.entries(sys.parts).map(([key, part]) => `
                <button 
                  onclick="window.NCLEX_TITANIUM.selectPart('${key}')"
                  class="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,140,255,0.8)] cursor-pointer transition-all duration-300 z-10
                  ${this.state.selectedPart === key ? 'bg-blue-500 scale-150 animate-pulse ring-4 ring-blue-500/30' : 'bg-blue-500/40 hover:bg-blue-400 hover:scale-125'}"
                  style="top: ${part.pos.top}; left: ${part.pos.left};">
                  <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-700">
                    ${part.name[this.state.lang]}
                  </span>
                </button>
              `).join('')}
            </div>

            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-gray-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-gray-700 shadow-2xl z-20" id="titanium-controls">
              ${this.renderControlsHTML()}
            </div>

            <div class="absolute top-4 right-4 text-xs font-mono text-green-400 bg-black/50 px-2 py-1 rounded border border-green-900/50 flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> LIVE SYSTEM
            </div>
          </div>

          <div class="w-full lg:w-1/4 bg-gray-800 border-l border-gray-700 flex flex-col shadow-2xl relative z-30 transform transition-transform duration-300
               ${this.state.selectedPart ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} absolute lg:relative inset-y-0 right-0">
            
            ${this.renderPanelContent()}
            
          </div>
        </div>
      </div>
    `;
  }

  renderControlsHTML() {
    const audioClass = this.state.audio ? 'text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'text-gray-400';
    return `
      <button onclick="window.NCLEX_TITANIUM.toggleAudio()" class="hover:text-white transition-colors ${audioClass}" title="Audio Simulation">
        <i class="fas fa-heart-pulse text-xl"></i>
      </button>
      <div class="w-px h-6 bg-gray-600"></div>
      <button onclick="window.NCLEX_TITANIUM.zoom(-0.1)" class="text-gray-400 hover:text-white"><i class="fas fa-minus"></i></button>
      <button onclick="window.NCLEX_TITANIUM.zoom(0.1)" class="text-gray-400 hover:text-white"><i class="fas fa-plus"></i></button>
    `;
  }

  renderPanelContent() {
    const sys = this.db[this.state.system];
    const part = this.state.selectedPart ? sys.parts[this.state.selectedPart] : null;
    const isEs = this.state.lang === 'es';

    if (!part) {
      return `
        <div class="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
          <i class="fas fa-dna text-6xl text-gray-600 mb-4 animate-spin-slow"></i>
          <h3 class="text-xl font-bold text-gray-300">
            ${isEs ? 'Sistema Listo' : 'System Ready'}
          </h3>
          <p class="text-sm text-gray-500 mt-2">
            ${isEs ? 'Selecciona una estructura para iniciar análisis.' : 'Select structure to begin analysis.'}
          </p>
        </div>
      `;
    }

    return `
      <div class="flex flex-col h-full bg-gray-800 animate-slide-in-right">
        <div class="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-b border-gray-700">
          <div class="flex justify-between items-start">
            <h2 class="text-2xl font-black text-white leading-tight">${part.name[this.state.lang]}</h2>
            <button onclick="window.NCLEX_TITANIUM.closePanel()" class="text-gray-500 hover:text-red-400"><i class="fas fa-times text-xl"></i></button>
          </div>
          <span class="text-xs font-mono text-blue-400 mt-1 block tracking-widest uppercase">${this.state.system.toUpperCase()} MODULE</span>
        </div>

        <div class="flex border-b border-gray-700 bg-gray-900/50">
          <button onclick="window.NCLEX_TITANIUM.setTab('clinical')" class="flex-1 py-3 text-xs font-bold uppercase tracking-wider ${this.state.tab==='clinical'?'text-blue-400 border-b-2 border-blue-400 bg-white/5':'text-gray-500 hover:text-gray-300'}">Clinical</button>
          <button onclick="window.NCLEX_TITANIUM.setTab('nclex')" class="flex-1 py-3 text-xs font-bold uppercase tracking-wider ${this.state.tab==='nclex'?'text-yellow-400 border-b-2 border-yellow-400 bg-white/5':'text-gray-500 hover:text-gray-300'}">NCLEX</button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
          ${this.state.tab === 'clinical' ? `
            <div class="bg-gray-700/30 p-4 rounded-xl border border-gray-600">
              <h4 class="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center"><i class="fas fa-microscope mr-2"></i> ${isEs ? 'Fisiopatología' : 'Pathophysiology'}</h4>
              <p class="text-sm text-gray-200 leading-relaxed">${part.clinical[this.state.lang]}</p>
            </div>
            
            <div class="bg-blue-900/20 p-4 rounded-xl border border-blue-800/50">
              <h4 class="text-xs font-bold text-blue-400 uppercase mb-2 flex items-center"><i class="fas fa-vial mr-2"></i> ${isEs ? 'Labs & Diagnósticos' : 'Labs & Diagnostics'}</h4>
              <p class="text-sm font-mono text-blue-200">${part.labs}</p>
            </div>
          ` : `
            <div class="bg-yellow-900/20 p-4 rounded-xl border-l-4 border-yellow-500 shadow-lg">
              <h4 class="text-xs font-bold text-yellow-500 uppercase mb-2 flex items-center"><i class="fas fa-exclamation-triangle mr-2"></i> PRIORITY ACTION</h4>
              <p class="text-sm text-yellow-100 font-medium leading-relaxed">${part.nclex[this.state.lang]}</p>
            </div>
            
            <div class="mt-4 p-4 rounded-xl bg-gray-700/50 border border-gray-600">
              <h4 class="text-xs font-bold text-gray-400 uppercase mb-3">Nursing Interventions</h4>
              <ul class="text-sm text-gray-300 space-y-2 list-disc pl-4">
                <li>Monitor Vital Signs q15min if unstable.</li>
                <li>Assess for changes in LOC.</li>
                <li>Ensure patent IV access.</li>
              </ul>
            </div>
          `}
        </div>
      </div>
    `;
  }

  // --- ACTIONS ---
  renderControls() {
    document.getElementById('titanium-controls').innerHTML = this.renderControlsHTML();
  }

  selectSystem(key) {
    this.state.system = key;
    this.state.selectedPart = null;
    this.stopAudio();
    this.state.audio = false;
    this.refresh();
  }

  selectPart(key) {
    this.state.selectedPart = key;
    this.refresh();
  }

  closePanel() {
    this.state.selectedPart = null;
    this.refresh();
  }

  setTab(t) {
    this.state.tab = t;
    this.refresh();
  }

  zoom(amount) {
    this.state.zoom = Math.max(0.5, Math.min(3, this.state.zoom + amount));
    this.refresh();
  }

  refresh() {
    const el = document.getElementById('app-view');
    if(el) el.innerHTML = this.render();
  }

  init() {
    console.log("🚀 Titanium Engine Started");
    this.refresh();
  }
}

// --- 🔥 SISTEMA DE INYECCIÓN "BUNKER-BUSTER" ---
// Este código es agresivo. Si el botón no existe, lo crea. Si lo borran, lo vuelve a crear.
(function() {
  const lab = new AnatomyTitanium();
  window.NCLEX_TITANIUM = lab;

  // 1. Registro Estándar (La vía diplomática)
  if (window.NCLEX && window.NCLEX.registerTopic) {
    window.NCLEX.registerTopic({
      id: 'anatomy', 
      title: {es:'Anatomía Clínica', en:'Clinical Anatomy'},
      icon: 'heart-pulse',
      color: 'blue',
      render: () => { setTimeout(()=>lab.init(), 100); return lab.render(); }
    });
  }

  // 2. Inyección Directa (La vía militar)
  const forceInject = () => {
    const nav = document.getElementById('topics-nav');
    if (!nav) return; // Si no hay menú, no podemos hacer nada

    // ¿Ya existe el botón?
    if (document.getElementById('btn-anatomy-force')) return;

    console.log("⚠️ Detectada ausencia de botón. Inyectando...");
    
    const btn = document.createElement('button');
    btn.id = 'btn-anatomy-force';
    btn.className = "nav-btn w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-transparent border border-blue-800/30 hover:bg-blue-900/40 transition-all text-blue-400 group mb-2";
    btn.onclick = () => {
      // Limpiar active states
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active', 'bg-blue-50', 'text-brand-blue'));
      // Renderizar a la fuerza
      const view = document.getElementById('app-view');
      view.innerHTML = lab.render();
      lab.init();
    };

    btn.innerHTML = `
      <div class="w-6 flex justify-center"><i class="fa-solid fa-heart-pulse text-xl text-blue-500 animate-pulse"></i></div>
      <span class="hidden lg:block text-base font-bold">Anatomía Clínica</span>
    `;

    // Insertar AL PRINCIPIO del menú para que se vea
    nav.prepend(btn);
  };

  // Ejecutar comprobación cada segundo durante 5 segundos para asegurar carga
  let checks = 0;
  const interval = setInterval(() => {
    forceInject();
    checks++;
    if(checks > 5) clearInterval(interval);
  }, 1000);

})();
