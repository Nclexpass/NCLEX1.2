// 34_anatomy.js — NCLEX Anatomy Lab (Creado por Reynier Diaz Gerones)
// 🫀 Features: Audio Pro + Debounce + Atomic State + Fallback Blindado
// 🎓 Contenido: Anatomía + Fisiología + Patologías + Quiz
// 💎 ESTADO: FINAL MASTER - UX POLISHED

class CardiacMasterLab {
  constructor() {
    this.instanceId = `cml-${Math.random().toString(36).substr(2, 9)}`;
    
    // --- STATE ---
    this.state = {
      currentPart: null,
      currentLang: 'es',
      isPaused: false,
      audioEnabled: false,
      heartbeatRate: 72,
      isInitialized: false,
      activeTab: 'physiology',
      modalOpen: false
    };
    
    this.severityMap = {
      critical: { border: 'border-red-500', bg: 'bg-red-900/20', text: 'text-red-400', icon: 'fa-skull-crossbones' },
      high: { border: 'border-orange-500', bg: 'bg-orange-900/20', text: 'text-orange-400', icon: 'fa-notes-medical' },
      medium: { border: 'border-yellow-500', bg: 'bg-yellow-900/20', text: 'text-yellow-400', icon: 'fa-notes-medical' }
    };

    this.anatomyDB = this.#createAnatomyDatabase();
    this.heartSounds = this.#createHeartSounds();
    this.nclexQuestions = this.#createNCLEXQuestions();
    
    // --- SYSTEMS ---
    this.audio = { context: null, masterGain: null, compressor: null, intervals: new Set(), isUnlocked: false };
    this.timers = { bpm: null };
    this.imageProxy = 'https://images.weserv.nl/?url=';
    this.imageFallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFmMjkzMyIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+RGlhZ3JhbWEgTm8gRGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';

    this.#bindMethods();
  }

  #bindMethods() {
    const methods = ['selectPart', 'togglePause', 'toggleAudio', 'changeHeartRate', 'resetSelection', 'changeTab', 'checkAnswer', 'expandImage', 'closeModal', 'handleGlobalClick', 'handleKeyDown', 'unlockAudio'];
    methods.forEach(m => this[m] = this[m].bind(this));
  }

  // --- 1. DATA ---
  #createAnatomyDatabase() {
    const images = {
      conduction: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/ConductionsystemoftheheartwithouttheHeart.png/400px-ConductionsystemoftheheartwithouttheHeart.png',
      circulation: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/202410_Systemic_and_pulmonary_circulation.svg/400px-202410_Systemic_and_pulmonary_circulation.svg.png',
      crossSection: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Gross_pathology_of_old_myocardial_infarction.jpg/400px-Gross_pathology_of_old_myocardial_infarction.jpg',
      aorta: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Aorta_scheme_en.svg/400px-Aorta_scheme_en.svg.png',
      venous: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/2135_Veins_Draining_into_Superior_Vena_Cava_Chart.jpg/400px-2135_Veins_Draining_into_Superior_Vena_Cava_Chart.jpg'
    };
    const uid = this.instanceId;

    return {
      heart: {
        title: { es: "Master Cardíaco NCLEX", en: "NCLEX Cardiac Master" },
        parts: {
          'ra': { id: 'RA-01', name: { es: "Aurícula Derecha", en: "Right Atrium" }, desc: { es: "Cámara receptora de pared delgada.", en: "Thin-walled receiving chamber." }, physiology: { es: "Presión: 2-6 mmHg • Nodo SA", en: "Pressure: 2-6 mmHg • SA Node" }, pathologies: { items: [{ es: "Fibrilación Auricular", en: "Atrial Fibrillation", severity: "high" }] }, clinical: { es: "📌 Foco del Nodo SA", en: "📌 SA Node location" }, color: "text-blue-400", gradient: `blueGradient_${uid}`, sound: "s1", imageUrl: images.conduction, imageCaption: { es: "Sistema de Conducción", en: "Conduction System" } },
          'la': { id: 'LA-02', name: { es: "Aurícula Izquierda", en: "Left Atrium" }, desc: { es: "Recibe sangre oxigenada.", en: "Receives oxygenated blood." }, physiology: { es: "Presión: 8-12 mmHg", en: "Pressure: 8-12 mmHg" }, pathologies: { items: [{ es: "Edema Pulmonar", en: "Pulmonary Edema", severity: "critical" }] }, clinical: { es: "📌 Falla causa congestión", en: "📌 Failure causes congestion" }, color: "text-red-400", gradient: `redGradient_${uid}`, sound: "s1", imageUrl: images.circulation, imageCaption: { es: "Circulación Pulmonar", en: "Pulmonary Circulation" } },
          'rv': { id: 'RV-03', name: { es: "Ventrículo Derecho", en: "Right Ventricle" }, desc: { es: "Bombea sangre a pulmones.", en: "Pumps blood to lungs." }, physiology: { es: "Presión: 25/5 mmHg", en: "Pressure: 25/5 mmHg" }, pathologies: { items: [{ es: "Falla Derecha", en: "Right Heart Failure", severity: "critical" }] }, clinical: { es: "⚠️ Signos: JVD, Ascitis", en: "⚠️ Signs: JVD, Ascites" }, color: "text-blue-500", gradient: `blueGradientDark_${uid}`, sound: "s1", imageUrl: images.crossSection, imageCaption: { es: "Pared Ventricular", en: "Ventricular Wall" } },
          'lv': { id: 'LV-04', name: { es: "Ventrículo Izquierdo", en: "Left Ventricle" }, desc: { es: "Cámara de alta presión.", en: "High pressure chamber." }, physiology: { es: "Presión: 120/80 mmHg", en: "Pressure: 120/80 mmHg" }, pathologies: { items: [{ es: "Infarto (IAM)", en: "Myocardial Infarction", severity: "critical" }] }, clinical: { es: "⚠️ Signos: Disnea", en: "⚠️ Signs: Dyspnea" }, color: "text-red-500", gradient: `redGradientDark_${uid}`, sound: "s1", imageUrl: images.crossSection, imageCaption: { es: "Hipertrofia VI", en: "LV Hypertrophy" } },
          'aorta': { id: 'AO-05', name: { es: "Aorta", en: "Aorta" }, desc: { es: "Arteria principal.", en: "Main artery." }, physiology: { es: "RVS (SVR)", en: "SVR" }, pathologies: { items: [{ es: "Aneurisma", en: "Aneurysm", severity: "critical" }] }, clinical: { es: "🚨 Dolor de espalda", en: "🚨 Back pain" }, color: "text-red-600", gradient: `redGradient_${uid}`, sound: "s2", imageUrl: images.aorta, imageCaption: { es: "Arco Aórtico", en: "Aortic Arch" } },
          'svc': { id: 'VC-06', name: { es: "Vena Cava Superior", en: "Superior Vena Cava" }, desc: { es: "Retorno venoso.", en: "Venous return." }, physiology: { es: "Vía central", en: "Central line" }, pathologies: { items: [{ es: "Síndrome VCS", en: "SVC Syndrome", severity: "high" }] }, clinical: { es: "📌 Acceso venoso", en: "📌 Venous access" }, color: "text-blue-600", gradient: `blueGradient_${uid}`, sound: null, imageUrl: images.venous, imageCaption: { es: "Drenaje Venoso", en: "Venous Drainage" } }
        }
      }
    };
  }

  #createHeartSounds() {
    return {
      s1: { frequency: [60, 40], duration: 0.15, type: 'triangle', hasNoise: true },
      s2: { frequency: [90, 60], duration: 0.12, type: 'triangle', hasNoise: false }
    };
  }

  #createNCLEXQuestions() {
    return {
      'ra': { q: { es: "¿Ubicación del nodo SA?", en: "SA node location?" }, a: 0, opts: [{ es: "Aurícula Der.", en: "Right Atrium" }, { es: "Ventrículo Izq.", en: "Left Ventricle" }, { es: "Septum", en: "Septum" }], exp: { es: "Aurícula derecha.", en: "Right atrium." } },
      'la': { q: { es: "¿Sangre que recibe la AI?", en: "Blood in LA?" }, a: 1, opts: [{ es: "Desoxigenada", en: "Deoxygenated" }, { es: "Oxigenada", en: "Oxygenated" }, { es: "Mixta", en: "Mixed" }], exp: { es: "Oxigenada de pulmones.", en: "Oxygenated from lungs." } },
      'rv': { q: { es: "¿Signo de falla derecha?", en: "Sign of Right Failure?" }, a: 2, opts: [{ es: "Tos", en: "Cough" }, { es: "Ortopnea", en: "Orthopnea" }, { es: "JVD", en: "JVD" }], exp: { es: "JVD y edema.", en: "JVD and edema." } },
      'lv': { q: { es: "¿Signo de falla izquierda?", en: "Sign of Left Failure?" }, a: 1, opts: [{ es: "Edema", en: "Edema" }, { es: "Crepitantes", en: "Crackles" }, { es: "Ascitis", en: "Ascites" }], exp: { es: "Congestión pulmonar.", en: "Pulmonary congestion." } },
      'aorta': { q: { es: "¿Presión normal?", en: "Normal pressure?" }, a: 0, opts: [{ es: "120/80", en: "120/80" }, { es: "25/10", en: "25/10" }, { es: "5/0", en: "5/0" }], exp: { es: "Sistémica arterial.", en: "Systemic arterial." } },
      'svc': { q: { es: "¿Qué drena la VCS?", en: "What does SVC drain?" }, a: 0, opts: [{ es: "Cabeza/Brazos", en: "Head/Arms" }, { es: "Piernas", en: "Legs" }, { es: "Intestinos", en: "Gut" }], exp: { es: "Parte superior.", en: "Upper body." } }
    };
  }

  // --- 2. INIT ---
  async init() {
    if (this.state.isInitialized) return;
    try { await this.#setupAudioEngine(); } catch (e) { console.warn('Audio init:', e); }
    this.#detectLanguage();
    this.#injectMasterStyles();
    this.#preloadImages();
    document.addEventListener('click', this.handleGlobalClick);
    document.addEventListener('keydown', this.handleKeyDown);
    this.state.isInitialized = true;
    console.log('🫀 Cardiac Master v7.4 (Diamond) Ready');
    if (this.audio.context) this.changeHeartRate(this.state.heartbeatRate);
  }

  #preloadImages() {
    Object.values(this.anatomyDB.heart.parts).forEach(p => {
      if (p.imageUrl) { const img = new Image(); img.src = this.#sanitizeUrl(p.imageUrl); }
    });
  }

  // --- 3. AUDIO ---
  async #setupAudioEngine() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.audio.context = new AudioContext();
    this.audio.masterGain = this.audio.context.createGain();
    this.audio.compressor = this.audio.context.createDynamicsCompressor();
    this.audio.masterGain.connect(this.audio.compressor);
    this.audio.compressor.connect(this.audio.context.destination);
    this.audio.masterGain.gain.value = 0.5;
  }

  async unlockAudio() {
    if (this.audio.isUnlocked || !this.audio.context) return;
    try {
      if (this.audio.context.state === 'suspended') await this.audio.context.resume();
      this.audio.isUnlocked = true;
    } catch (e) { console.warn('Audio unlock failed', e); throw e; }
  }

  changeHeartRate(bpm) {
    if (!this.state.isInitialized) return;
    this.state.heartbeatRate = Math.max(30, Math.min(200, bpm));
    
    if (this.timers.bpm) clearTimeout(this.timers.bpm);
    
    this.timers.bpm = setTimeout(() => {
      const durationMs = (60 / this.state.heartbeatRate) * 1000;
      if (document.documentElement) document.documentElement.style.setProperty('--beat-duration', `${durationMs}ms`);
      
      this.audio.intervals.forEach(i => clearInterval(i));
      this.audio.intervals.clear();

      if (!this.state.isPaused) {
        const interval = setInterval(() => {
          if (this.state.audioEnabled) {
            this.#playSound('s1', 0);
            this.#playSound('s2', durationMs * 0.35 / 1000);
          }
        }, durationMs);
        this.audio.intervals.add(interval);
      }
      this.#updateUIControls();
    }, 100);
  }

  #playSound(type, delay) {
    if (!this.audio.context || !this.state.audioEnabled || !this.audio.isUnlocked) return;
    try {
      const sound = this.heartSounds[type];
      const t = this.audio.context.currentTime + delay;
      const osc = this.audio.context.createOscillator();
      const gain = this.audio.context.createGain();
      
      osc.type = sound.type;
      osc.frequency.setValueAtTime(sound.frequency[0], t);
      osc.frequency.exponentialRampToValueAtTime(sound.frequency[1], t + sound.duration);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.6, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, t + sound.duration);

      osc.connect(gain);
      gain.connect(this.audio.masterGain);
      osc.start(t);
      osc.stop(t + sound.duration + 0.1);
      osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch(e){} };

      if (sound.hasNoise) this.#playNoise(t, sound.duration);
    } catch (e) {}
  }

  #playNoise(time, duration) {
    try {
      const bufferSize = this.audio.context.sampleRate * 0.1;
      const buffer = this.audio.context.createBuffer(1, bufferSize, this.audio.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.audio.context.createBufferSource();
      noise.buffer = buffer;
      const gain = this.audio.context.createGain();
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

      noise.connect(gain);
      gain.connect(this.audio.masterGain);
      noise.start(time);
      noise.stop(time + duration + 0.1);
      noise.onended = () => { try { noise.disconnect(); gain.disconnect(); } catch(e){} };
    } catch (e) {}
  }

  // --- 4. INTERACTION ---
  handleGlobalClick(e) {
    this.unlockAudio();
    const heartPart = e.target.closest('.heart-part');
    const modal = e.target.closest('.modal-overlay');
    const closeBtn = e.target.closest('.close-modal-btn');

    if (heartPart && !this.state.modalOpen) {
      this.selectPart(heartPart.id);
    } else if (this.state.modalOpen) {
      if (closeBtn || (modal && e.target.classList.contains('modal-overlay'))) this.closeModal();
    }
  }

  handleKeyDown(e) {
    const key = e.key.toLowerCase();
    if (['1','2','3','4'].includes(key) && this.state.currentPart) this.changeTab(['physiology', 'pathology', 'nclex', 'quiz'][parseInt(key)-1]);
    if (key === 'escape') { if (this.state.modalOpen) this.closeModal(); else if (this.state.currentPart) this.resetSelection(); }
    if (key === ' ' && !this.state.modalOpen) { e.preventDefault(); this.togglePause(); }
  }

  #updateAnimationState() {
    const container = document.querySelector('.heart-container');
    const ekg = document.querySelector('.ekg-line');
    if (!container) return;

    container.classList.remove('paused-animation', 'focus-mode');
    if (ekg) ekg.classList.remove('paused-animation');

    if (this.state.currentPart) {
      container.classList.add('focus-mode');
    } else if (this.state.isPaused) {
      container.classList.add('paused-animation');
      if (ekg) ekg.classList.add('paused-animation');
    }
  }

  selectPart(partId) {
    if (!this.anatomyDB.heart.parts[partId]) return;
    this.state.currentPart = partId;
    this.state.activeTab = 'physiology';
    if (navigator.vibrate) navigator.vibrate(20);

    document.querySelectorAll('.heart-part').forEach(el => {
      el.classList.remove('active-part', 'dimmed-part');
      el.id === partId ? el.classList.add('active-part') : el.classList.add('dimmed-part');
    });

    this.#updateAnimationState();
    this.#renderPanel();
  }

  resetSelection() {
    this.state.currentPart = null;
    document.querySelectorAll('.heart-part').forEach(el => el.classList.remove('active-part', 'dimmed-part'));
    this.#updateAnimationState();
    this.#renderPanel();
  }

  togglePause() {
    this.state.isPaused = !this.state.isPaused;
    this.#updateAnimationState();
    this.changeHeartRate(this.state.heartbeatRate);
    this.#updateUIControls();
  }

  async toggleAudio() {
    const prevEnabled = this.state.audioEnabled;
    this.state.audioEnabled = !prevEnabled;
    if (this.state.audioEnabled) {
      try { await this.unlockAudio(); } catch (e) { this.state.audioEnabled = false; }
    }
    this.#updateUIControls();
  }

  changeTab(tab) {
    this.state.activeTab = tab;
    this.#renderPanel();
  }

  checkAnswer(partId, idx) {
    const q = this.nclexQuestions?.[partId];
    if (!q) return;
    const isCorrect = q.a === idx;
    const fb = document.getElementById('quiz-feedback');
    if (fb) {
      const cls = isCorrect ? 'bg-green-900 border-green-500 text-green-100' : 'bg-red-900 border-red-500 text-red-100';
      const msg = isCorrect ? (this.state.currentLang === 'es' ? '¡Correcto!' : 'Correct!') : (this.state.currentLang === 'es' ? 'Incorrecto' : 'Incorrect');
      fb.innerHTML = `<div class="p-3 rounded border ${cls} bg-opacity-30 font-bold mt-2">${msg}<div class="text-xs font-normal mt-1 opacity-90">${q.exp[this.state.currentLang]}</div></div>`;
    }
  }

  #sanitizeUrl(url) {
    if (!url) return this.imageFallback;
    if (url.startsWith('data:')) return url;
    if (!url.startsWith('http')) return this.imageFallback;
    return this.imageProxy + encodeURIComponent(url);
  }

  expandImage(url) {
    if (this.state.modalOpen || !this.state.currentPart) return;
    
    // FIX: Extra verification to prevent crash
    const part = this.anatomyDB.heart.parts[this.state.currentPart];
    if (!part) return;

    this.state.modalOpen = true;
    const caption = part.imageCaption[this.state.currentLang];
    const safeUrl = this.#sanitizeUrl(url);

    const modal = document.createElement('div');
    modal.className = 'modal-overlay fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in';
    modal.innerHTML = `
      <div class="relative max-w-5xl w-full">
        <button class="close-modal-btn absolute -top-12 right-0 text-white text-2xl bg-white/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20"><i class="fas fa-times"></i></button>
        <div class="bg-gray-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl relative min-h-[200px]">
          <div class="absolute inset-0 flex items-center justify-center text-gray-500 z-0">
            <i class="fas fa-circle-notch fa-spin text-3xl"></i>
          </div>
          <img src="${safeUrl}" class="relative z-10 w-full max-h-[80vh] object-contain bg-gray-900" onerror="this.src='${this.imageFallback}'">
          <div class="relative z-20 p-4 text-center text-white font-bold bg-black/50 caption-text"></div>
        </div>
      </div>`;
    
    modal.querySelector('.caption-text').textContent = caption;
    document.body.appendChild(modal);
  }

  closeModal() {
    const m = document.querySelector('.modal-overlay');
    if (m) { m.remove(); this.state.modalOpen = false; }
  }

  destroy() {
    if (this.timers.bpm) clearTimeout(this.timers.bpm);
    this.audio.intervals.forEach(i => clearInterval(i));
    if (this.audio.context) this.audio.context.close();
    document.removeEventListener('click', this.handleGlobalClick);
    document.removeEventListener('keydown', this.handleKeyDown);
    this.closeModal();
  }

  // --- 5. RENDER ---
  #renderPanel() {
    const panel = document.getElementById('anatomy-info');
    if (!panel) return;
    if (!this.state.currentPart) { panel.innerHTML = this.#getEmptyStateHTML(); return; }

    const d = this.anatomyDB.heart.parts[this.state.currentPart];
    const isEs = this.state.currentLang === 'es';
    const tab = this.state.activeTab;
    
    let content = '';
    if (tab === 'physiology') {
      content = `
        <div class="space-y-4 animate-slide-up">
          <div class="bg-blue-900/20 p-4 rounded-xl border-l-4 border-blue-500">
            <h4 class="text-xs font-bold text-blue-400 uppercase mb-2">${isEs?'Fisiología':'Physiology'}</h4>
            <p class="text-sm text-blue-100 whitespace-pre-line">${d.physiology[this.state.currentLang]}</p>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-xl border border-white/5"><p class="text-sm text-gray-300">${d.desc[this.state.currentLang]}</p></div>
          ${d.imageUrl ? `<div class="cursor-zoom-in group relative overflow-hidden rounded-xl border border-white/10 mt-2 hover:border-white/30 transition" onclick="window.NCLEX_ANATOMY.expandImage('${d.imageUrl}')"><img src="${this.#sanitizeUrl(d.imageUrl)}" class="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition" onerror="this.src='${this.imageFallback}'"><div class="absolute bottom-0 inset-x-0 p-2 bg-black/60 text-xs font-bold text-white text-center">${d.imageCaption[this.state.currentLang]}</div></div>` : ''}
        </div>`;
    } else if (tab === 'pathology') {
      content = `<div class="space-y-3 animate-slide-up">${d.pathologies.items.map(p => {
        const map = this.severityMap[p.severity] || this.severityMap.medium;
        return `<div class="flex items-center gap-3 p-3 ${map.bg} rounded-lg border-l-4 ${map.border}"><i class="fas ${map.icon} ${map.text}"></i><span class="text-sm text-gray-200 font-bold">${p[this.state.currentLang]}</span></div>`;
      }).join('')}</div>`;
    } else if (tab === 'nclex') {
      content = `<div class="animate-slide-up bg-yellow-900/10 p-5 rounded-xl border border-yellow-500/30"><div class="flex items-start gap-3"><i class="fas fa-exclamation-circle text-2xl text-yellow-500"></i><div><h4 class="text-sm font-black text-yellow-400 uppercase mb-2">NCLEX PRIORITY</h4><p class="text-sm text-yellow-100 whitespace-pre-line">${d.clinical[this.state.currentLang]}</p></div></div></div>`;
    } else if (tab === 'quiz') {
      const q = this.nclexQuestions?.[this.state.currentPart];
      content = q ? `<div class="animate-slide-up"><p class="text-sm text-white font-bold mb-4 bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">${q.q[this.state.currentLang]}</p><div class="space-y-2">${q.opts.map((o,i)=>`<button onclick="window.NCLEX_ANATOMY.checkAnswer('${this.state.currentPart}',${i})" class="w-full text-left p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 transition border border-white/5 hover:border-white">${o[this.state.currentLang]}</button>`).join('')}</div><div id="quiz-feedback" class="mt-4"></div></div>` : `<div class="text-center text-gray-500 py-10">${isEs?'Sin preguntas':'No questions'}</div>`;
    }

    panel.innerHTML = `<div class="h-full flex flex-col"><div class="p-6 pb-2 bg-gradient-to-b from-gray-800/50 to-transparent"><div class="flex justify-between items-start mb-4"><div><h2 class="text-3xl font-black text-white leading-none mb-1">${d.name[this.state.currentLang]}</h2><span class="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded font-mono uppercase border border-white/5">ID: ${d.id}</span></div><button onclick="window.NCLEX_ANATOMY.resetSelection()" class="text-gray-500 hover:text-white transition p-2 bg-white/5 rounded-full"><i class="fas fa-times"></i></button></div><div class="flex gap-2 border-b border-white/10 pb-1 overflow-x-auto custom-scrollbar">${['physiology','pathology','nclex','quiz'].map(t=>`<button onclick="window.NCLEX_ANATOMY.changeTab('${t}')" class="px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${this.state.activeTab===t?'text-rose-400 border-b-2 border-rose-400':'text-gray-500 hover:text-gray-300'}">${t}</button>`).join('')}</div></div><div class="p-6 pt-4 flex-grow overflow-y-auto custom-scrollbar">${content}</div></div>`;
  }

  getInterface() {
    const isEs = this.state.currentLang === 'es';
    return `
      <div class="cardiac-master-app animate-fade-in pb-24">
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 mt-6 gap-4">
          <div><h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 tracking-tighter">${isEs ? 'MASTER CARDÍACO' : 'CARDIAC MASTER'} <span class="text-lg text-white/30 font-mono">v7.4</span></h1></div>
          <div class="flex items-center gap-3 bg-gray-900/80 p-2 rounded-xl border border-white/10 backdrop-blur">
            <button class="ctrl-btn" onclick="window.NCLEX_ANATOMY.changeHeartRate(${this.state.heartbeatRate - 10})"><i class="fas fa-minus"></i></button>
            <div class="text-center w-16"><div class="text-xl font-bold text-white bpm-val font-mono">${this.state.heartbeatRate}</div><div class="text-[9px] text-gray-500 font-bold">BPM</div></div>
            <button class="ctrl-btn" onclick="window.NCLEX_ANATOMY.changeHeartRate(${this.state.heartbeatRate + 10})"><i class="fas fa-plus"></i></button>
            <div class="h-8 w-px bg-white/10 mx-1"></div>
            <button class="ctrl-btn audio-btn" onclick="window.NCLEX_ANATOMY.toggleAudio()"><i class="fas fa-volume-mute"></i></button>
            <button class="ctrl-btn pause-btn" onclick="window.NCLEX_ANATOMY.togglePause()"><i class="fas fa-pause"></i></button>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row gap-6 items-stretch">
          <div class="w-full lg:w-2/3 bg-gray-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-8 relative overflow-hidden group shadow-2xl">
            <div class="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px]"></div>
            ${this.#getSVG()}
            <div class="absolute top-6 right-6 w-56">
              <div class="text-[10px] text-green-400 font-mono mb-1 flex justify-between font-bold"><span>EKG: LEAD II</span><span class="animate-pulse text-red-500">● LIVE</span></div>
              <div class="h-16 bg-black/60 rounded-lg border border-green-900/50 overflow-hidden relative shadow-inner">
                <div class="ekg-grid absolute inset-0 opacity-20"></div>
                <div class="ekg-line absolute top-1/2 left-0 w-full h-[2px] bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
              </div>
            </div>
          </div>
          <div id="anatomy-info" class="w-full lg:w-1/3 bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-0 overflow-hidden shadow-2xl flex flex-col min-h-[550px]">${this.#getEmptyStateHTML()}</div>
        </div>
      </div>
    `;
  }

  #getEmptyStateHTML() {
    const isEs = this.state.currentLang === 'es';
    return `<div class="h-full flex flex-col items-center justify-center text-center p-8"><div class="relative mb-8"><div class="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse"></div><div class="w-24 h-24 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center relative z-10 border border-white/10"><i class="fas fa-heartbeat text-4xl text-rose-500"></i></div></div><h3 class="text-2xl font-black text-white mb-3">${isEs ? 'Explora la Anatomía' : 'Explore Anatomy'}</h3><p class="text-gray-400 max-w-xs text-sm">${isEs ? 'Selecciona una estructura.' : 'Select a structure.'}</p></div>`;
  }

  #getSVG() {
    const uid = this.instanceId;
    return `<svg viewBox="0 0 200 220" class="w-full h-full max-h-[600px] drop-shadow-2xl heart-svg"><defs><linearGradient id="blueGradient_${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#1e3a8a"/></linearGradient><linearGradient id="blueGradientDark_${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2563eb"/><stop offset="1" stop-color="#172554"/></linearGradient><linearGradient id="redGradient_${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#991b1b"/></linearGradient><linearGradient id="redGradientDark_${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dc2626"/><stop offset="1" stop-color="#7f1d1d"/></linearGradient></defs><g class="heart-container"><path id="svc" class="heart-part" d="M75,20 C85,20 90,25 85,55 L75,55 C70,35 65,20 75,20 Z" fill="url(#blueGradient_${uid})"/><path id="aorta" class="heart-part" d="M90,25 C95,5 130,5 140,35 L125,55 C120,35 100,35 90,25 Z" fill="url(#redGradient_${uid})"/><path id="ra" class="heart-part" d="M50,55 C35,65 35,95 55,110 L85,95 L85,55 Z" fill="url(#blueGradient_${uid})"/><path id="la" class="heart-part" d="M115,55 L145,65 C155,75 155,95 135,110 L115,95 Z" fill="url(#redGradient_${uid})"/><path id="rv" class="heart-part" d="M55,110 C65,150 90,190 100,200 L110,120 L85,95 Z" fill="url(#blueGradientDark_${uid})"/><path id="lv" class="heart-part" d="M135,110 C145,140 120,190 100,200 L110,120 L115,95 Z" fill="url(#redGradientDark_${uid})"/></g></svg>`;
  }

  #updateUIControls() {
    const pauseBtn = document.querySelector('.pause-btn');
    if (pauseBtn) { pauseBtn.innerHTML = `<i class="fas fa-${this.state.isPaused ? 'play' : 'pause'}"></i>`; pauseBtn.classList.toggle('text-rose-400', this.state.isPaused); }
    const audioBtn = document.querySelector('.audio-btn');
    if (audioBtn) { audioBtn.innerHTML = `<i class="fas fa-volume-${this.state.audioEnabled ? 'up' : 'mute'}"></i>`; audioBtn.classList.toggle('text-green-400', this.state.audioEnabled); }
    const bpmVal = document.querySelector('.bpm-val');
    if (bpmVal) bpmVal.textContent = this.state.heartbeatRate;
  }

  #detectLanguage() {
    const l = document.documentElement.lang || navigator.language.split('-')[0];
    this.state.currentLang = ['es', 'en'].includes(l) ? l : 'es';
  }

  #injectMasterStyles() {
    if (document.getElementById(`style-${this.instanceId}`)) return;
    const css = `
      :root { --beat-duration: 800ms; }
      .ctrl-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; background: rgba(255, 255, 255, 0.03); color: #9ca3af; transition: all 0.2s; border: 1px solid rgba(255, 255, 255, 0.05); cursor: pointer; }
      .ctrl-btn:hover { background: rgba(255, 255, 255, 0.1); color: white; transform: translateY(-2px); }
      .heart-container { animation: heartbeat var(--beat-duration) infinite cubic-bezier(0.4, 0, 0.6, 1); transform-origin: center; will-change: transform; }
      .heart-container.focus-mode { animation: none !important; transform: scale(1.05); transition: transform 0.5s ease; }
      .paused-animation { animation-play-state: paused !important; }
      @keyframes heartbeat { 0%, 100% { transform: scale(1); } 15% { transform: scale(1.03); } 30% { transform: scale(1); } 45% { transform: scale(1.05); } 60% { transform: scale(1); } }
      .heart-part { cursor: pointer; transition: all 0.3s ease; stroke: rgba(255,255,255,0.1); stroke-width: 1; }
      .heart-part:hover { stroke: white; stroke-width: 2; filter: drop-shadow(0 0 15px rgba(255,255,255,0.3)); z-index: 10; }
      .active-part { stroke: #fbbf24 !important; stroke-width: 3 !important; filter: drop-shadow(0 0 25px rgba(251, 191, 36, 0.5)) !important; }
      .dimmed-part { opacity: 0.3; filter: grayscale(0.8); }
      .ekg-line { background: linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%); animation: ekgScan var(--beat-duration) linear infinite; will-change: transform; }
      @keyframes ekgScan { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
      .ekg-grid { background-image: linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px); background-size: 10px 10px; }
      .animate-slide-up { animation: slideUp 0.4s ease-out; }
      @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fadeIn 0.6s ease-out; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    `;
    const style = document.createElement('style'); 
    style.id = `style-${this.instanceId}`; 
    style.textContent = css; 
    document.head.appendChild(style);
  }
}

// --- BOOTSTRAP ---
(function () {
  let attempts = 0;
  const bootstrap = () => {
    if (!window.NCLEX || !window.NCLEX.registerTopic) {
      if (attempts++ < 10) setTimeout(bootstrap, 200);
      return;
    }
    try {
      const lab = new CardiacMasterLab();
      window.NCLEX_ANATOMY = lab;
      window.NCLEX.registerTopic({
        id: 'anatomy', title: {es:'Anatomía', en:'Anatomy'}, subtitle: {es:'Master Cardíaco v7.4', en:'Cardiac Master v7.4'}, icon: 'heart-pulse', color: 'rose',
        render: () => { setTimeout(() => lab.init().catch(console.error), 0); return lab.getInterface(); },
        onUnmount: () => lab.destroy()
      });
      console.log('✅ Cardiac Master v7.4 (Diamond) Initialized');
    } catch (e) { console.error('Init Failed:', e); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap); else bootstrap();
})();
