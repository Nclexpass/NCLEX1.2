// 34_anatomy.js — NCLEX Anatomy Master Lab v10.2
// 🏥 ESTADO: INTEGRACIÓN ESTÁNDAR (Sincronizado con Engine v2.1 y Logic Master)
// 🎯 Función: Módulo de contenido puro. Se registra en window.NCLEX y deja que Logic.js pinte el botón.

class AnatomyMasterLab {
  constructor() {
    this.state = {
      currentSystem: 'cardio',
      currentPart: null,
      currentLang: 'es',
      audioEnabled: false,
      currentTab: 'info',
      quizQuestion: null,
      userAnswer: null,
      assessmentNotes: {}
    };

    // --- BASE DE DATOS COMPLETA (Sistemas principales) ---
    this.systemsDB = {
      cardio: {
        title: { es: 'Cardiovascular', en: 'Cardiovascular' },
        baseImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Heart_anterior_exterior_view.jpg/800px-Heart_anterior_exterior_view.jpg",
        audio: 'heartbeat',
        commonDisorders: { es: 'Falla Cardíaca, IAM', en: 'Heart Failure, MI' },
        parts: {
          'svc': {
            id: 'SVC', name: { es: 'Vena Cava Sup.', en: 'SVC' }, pos: { top: '15%', left: '35%' },
            desc: { es: 'Retorno venoso cabeza/brazos. Presión Venosa Central.', en: 'Venous return head/arms. CVP monitoring.' },
            nclex: { es: '⚠️ SÍNDROME VCS: Emergencia oncológica. Edema facial.', en: '⚠️ SVC SYNDROME: Emergency. Facial edema.' },
            assessment: { es: 'Evaluar ingurgitación yugular.', en: 'Assess JVD.' },
            procedures: [{ es: 'Manejo de vía central', en: 'Central line care' }],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/2135_Veins_Draining_into_Superior_Vena_Cava_Chart.jpg/400px-2135_Veins_Draining_into_Superior_Vena_Cava_Chart.jpg"
          },
          'aorta': {
            id: 'AO', name: { es: 'Aorta', en: 'Aorta' }, pos: { top: '12%', left: '55%' },
            desc: { es: 'Arteria sistémica principal. Alta presión.', en: 'Main systemic artery. High pressure.' },
            nclex: { es: '🚨 DISECCIÓN: Dolor de espalda desgarrante.', en: '🚨 DISSECTION: Tearing back pain.' },
            assessment: { es: 'Pulsos periféricos, PA bilateral.', en: 'Peripheral pulses, Bilateral BP.' },
            procedures: [{ es: 'Control estricto PA', en: 'Strict BP control' }],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Aorta_scheme_en.svg/400px-Aorta_scheme_en.svg.png"
          },
          'lv': {
            id: 'LV', name: { es: 'Ventrículo Izq.', en: 'Left Ventricle' }, pos: { top: '60%', left: '75%' },
            desc: { es: 'Bombeo sistémico. Pared gruesa.', en: 'Systemic pump. Thick wall.' },
            nclex: { es: '🚨 FALLA IZQUIERDA = PULMONES (Disnea, Crepitantes).', en: '🚨 LEFT FAILURE = LUNGS (Dyspnea, Crackles).' },
            assessment: { es: 'Auscultación pulmonar, SatO2.', en: 'Lung sounds, O2 Sat.' },
            procedures: [{ es: 'Posición Fowler', en: 'Fowler Position' }, { es: 'Diuréticos', en: 'Diuretics' }],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Gross_pathology_of_old_myocardial_infarction.jpg/400px-Gross_pathology_of_old_myocardial_infarction.jpg"
          }
        }
      },
      respiratory: {
        title: { es: 'Respiratorio', en: 'Respiratory' },
        baseImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Lungs_diagram_detailed.svg/800px-Lungs_diagram_detailed.svg.png",
        audio: 'breath',
        commonDisorders: { es: 'EPOC, Neumonía', en: 'COPD, Pneumonia' },
        parts: {
          'trachea': {
            id: 'TR', name: { es: 'Tráquea', en: 'Trachea' }, pos: { top: '15%', left: '50%' },
            desc: { es: 'Vía aérea principal. Cartílago.', en: 'Main airway. Cartilage.' },
            nclex: { es: '⚠️ DESVIACIÓN TRAQUEAL: Neumotórax a tensión.', en: '⚠️ TRACHEAL DEVIATION: Tension pneumothorax.' },
            assessment: { es: 'Palpar posición media.', en: 'Palpate midline.' },
            procedures: [{ es: 'Aspiración secreciones', en: 'Suctioning' }],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Trachea_%28gray%29.svg/400px-Trachea_%28gray%29.svg.png"
          },
          'r_lung': {
            id: 'RL', name: { es: 'Pulmón Derecho', en: 'Right Lung' }, pos: { top: '45%', left: '25%' },
            desc: { es: '3 lóbulos. Riesgo aspiración alto.', en: '3 lobes. High aspiration risk.' },
            nclex: { es: '📌 NEUMONÍA ASPIRATIVA: Lóbulo inferior derecho.', en: '📌 ASPIRATION PNEUMONIA: RLL.' },
            assessment: { es: 'Ruidos respiratorios, esfuerzo.', en: 'Breath sounds, effort.' },
            procedures: [{ es: 'Espirometría', en: 'Spirometry' }],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Lungs_diagram_simple.svg/400px-Lungs_diagram_simple.svg.png"
          }
        }
      },
      renal: {
        title: { es: 'Renal', en: 'Renal' },
        baseImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Urinary_system.svg/800px-Urinary_system.svg.png",
        audio: null,
        commonDisorders: { es: 'IRA, IRC', en: 'AKI, CKD' },
        parts: {
          'kidney': {
            id: 'KD', name: { es: 'Riñón', en: 'Kidney' }, pos: { top: '35%', left: '35%' },
            desc: { es: 'Filtración, control PA, eritropoyetina.', en: 'Filtration, BP control, EPO.' },
            nclex: { es: '📌 FALLA RENAL: Oliguria, Hiperkalemia (Arritmias).', en: '📌 KIDNEY FAILURE: Oliguria, Hyperkalemia.' },
            assessment: { es: 'Balance hídrico, edema, K+.', en: 'I&O, edema, K+.' },
            procedures: [{ es: 'Restricción líquidos', en: 'Fluid restriction' }],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Kidney_cross_section.jpg/400px-Kidney_cross_section.jpg"
          }
        }
      }
    };

    // --- PREGUNTAS NCLEX ---
    this.nclexQuestions = {
      cardio: [{
        question: { es: 'Paciente con IAM inferior, bradicardia e hipotensión. ¿Intervención prioritaria?', en: 'Patient w/ inferior MI, bradycardia, hypotension. Priority?' },
        options: [{ es: 'Atropina', en: 'Atropine' }, { es: 'Marcapasos', en: 'Pacing' }, { es: 'Elevar piernas', en: 'Elevate legs' }, { es: 'Líquidos IV', en: 'IV Fluids' }],
        correct: 2,
        rationale: { es: 'En infarto de ventrículo derecho, la precarga es crítica. Elevar piernas aumenta retorno venoso inmediatamente.', en: 'In RV infarct, preload is critical. Leg elevation increases venous return immediately.' }
      }]
    };

    this.audioCtx = null;
    this.audioInterval = null;
    this.#bindMethods();
  }

  #bindMethods() {
    ['switchSystem', 'selectPart', 'toggleAudio', 'closePanel', 'switchTab', 'submitQuizAnswer', 'nextQuestion', 'saveAssessmentNote', 'loadRandomQuestion', 'changeLanguage', 'toggleClinicalMode'].forEach(m => this[m] = this[m].bind(this));
  }

  init() {
    this.#detectLanguage();
    this.#injectStyles();
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.closePanel(); });
    console.log("✅ Anatomy Master v10.2 Loaded");
  }

  #detectLanguage() {
    const l = localStorage.getItem('nclex-language') || 'es';
    this.state.currentLang = l;
  }

  // --- LOGIC ---
  switchSystem(id) {
    this.state.currentSystem = id;
    this.state.currentPart = null;
    this.#stopAudio();
    this.state.audioEnabled = false;
    this.#renderSystem();
  }

  selectPart(key) {
    this.state.currentPart = key;
    this.state.currentTab = 'info';
    this.#renderInfoPanel();
    document.querySelectorAll('.anatomy-hotspot').forEach(el => {
      el.classList.toggle('active-spot', el.dataset.id === key);
    });
  }

  closePanel() {
    this.state.currentPart = null;
    document.querySelectorAll('.anatomy-hotspot').forEach(el => el.classList.remove('active-spot'));
    this.#renderEmptyState();
  }

  switchTab(tab) {
    this.state.currentTab = tab;
    this.#renderInfoPanel();
  }

  // --- AUDIO ---
  toggleAudio() {
    const sys = this.systemsDB[this.state.currentSystem];
    if (!sys.audio) return;
    this.state.audioEnabled = !this.state.audioEnabled;
    const btn = document.getElementById('audio-toggle-btn');
    if (this.state.audioEnabled) {
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      if (btn) { btn.innerHTML = '<i class="fas fa-volume-up animate-pulse"></i>'; btn.classList.add('text-green-400'); }
      this.#playSystemSound(sys.audio);
    } else {
      this.#stopAudio();
      if (btn) { btn.innerHTML = '<i class="fas fa-volume-mute"></i>'; btn.classList.remove('text-green-400'); }
    }
  }

  #playSystemSound(type) {
    if (this.audioInterval) clearInterval(this.audioInterval);
    if (type === 'heartbeat') this.state.audioInterval = setInterval(() => this.#beep(100, 0.1), 1000);
    else if (type === 'breath') this.state.audioInterval = setInterval(() => this.#beep(60, 1.0, 'sine'), 4000);
  }

  #beep(freq, dur, type='triangle') {
    if (!this.audioCtx) return;
    const o = this.audioCtx.createOscillator();
    const g = this.audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + dur);
    o.connect(g); g.connect(this.audioCtx.destination);
    o.start(); o.stop(this.audioCtx.currentTime + dur);
  }

  #stopAudio() {
    if (this.audioInterval) clearInterval(this.audioInterval);
    if (this.audioCtx) this.audioCtx.suspend();
  }

  // --- QUIZ & NOTES ---
  loadRandomQuestion() {
    const q = this.nclexQuestions[this.state.currentSystem];
    if (q) {
      this.state.quizQuestion = q[0];
      this.state.currentTab = 'nclex';
      this.#renderInfoPanel();
    }
  }

  submitQuizAnswer(i) {
    this.state.userAnswer = i;
    this.#renderInfoPanel();
  }

  nextQuestion() { this.loadRandomQuestion(); }

  saveAssessmentNote() {
    const txt = document.getElementById('note-input').value;
    if (txt) {
      if (!this.state.assessmentNotes[this.state.currentPart]) this.state.assessmentNotes[this.state.currentPart] = [];
      this.state.assessmentNotes[this.state.currentPart].push({ text: txt, time: new Date().toLocaleTimeString() });
      this.#renderInfoPanel();
    }
  }

  changeLanguage(val) {
    this.state.currentLang = val;
    localStorage.setItem('nclex-language', val);
    this.switchSystem(this.state.currentSystem);
  }

  toggleClinicalMode() { alert(this.state.currentLang==='es'?'Modo Clínico Activado':'Clinical Mode Active'); }

  // --- RENDER ---
  getInterface() {
    return `
      <div id="anatomy-app-root" class="flex flex-col h-full animate-fade-in">
        <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div><h1 class="text-2xl font-bold text-gray-800 dark:text-white"><i class="fas fa-hospital text-brand-blue mr-2"></i>Anatomy Master</h1></div>
          <div class="flex gap-2">
            <button onclick="window.NCLEX_ANATOMY.toggleClinicalMode()" class="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"><i class="fas fa-user-md"></i></button>
            <select onchange="window.NCLEX_ANATOMY.changeLanguage(this.value)" class="bg-gray-100 dark:bg-gray-800 rounded px-2 text-sm"><option value="es">Español</option><option value="en">English</option></select>
          </div>
        </div>
        <div id="anatomy-view-shell" class="flex-1 overflow-hidden p-4">${this.#getSystemContent()}</div>
      </div>
    `;
  }

  #getSystemContent() {
    const sys = this.systemsDB[this.state.currentSystem];
    const isEs = this.state.currentLang === 'es';
    return `
      <div class="h-full flex flex-col gap-4">
        <div class="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
          ${Object.keys(this.systemsDB).map(key => `<button onclick="window.NCLEX_ANATOMY.switchSystem('${key}')" class="px-4 py-2 rounded-lg font-bold uppercase transition ${this.state.currentSystem === key ? 'bg-brand-blue text-white shadow' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}">${this.systemsDB[key].title[this.state.currentLang]}</button>`).join('')}
        </div>
        <div class="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          <div class="w-full lg:w-2/3 bg-gray-900 rounded-2xl relative overflow-hidden shadow-xl border-4 border-white dark:border-gray-700">
            <div class="relative h-full flex items-center justify-center bg-black">
              <img src="${sys.baseImage}" class="max-w-full max-h-[70vh] object-contain opacity-90" onerror="this.src='https://via.placeholder.com/800x600?text=No+Image'">
              <div class="absolute inset-0">${Object.entries(sys.parts).map(([key, part]) => `<button class="anatomy-hotspot absolute w-8 h-8 rounded-full bg-white/20 border-2 border-white shadow-lg flex items-center justify-center hover:scale-125 transition ${this.state.currentPart === key ? 'active-spot' : ''}" style="top:${part.pos.top}; left:${part.pos.left};" onclick="window.NCLEX_ANATOMY.selectPart('${key}')" data-id="${key}"></button>`).join('')}</div>
              <div class="absolute top-4 right-4 flex gap-2">
                ${sys.audio ? `<button id="audio-toggle-btn" onclick="window.NCLEX_ANATOMY.toggleAudio()" class="w-10 h-10 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-blue-600"><i class="fas fa-volume-mute"></i></button>` : ''}
                <button onclick="window.NCLEX_ANATOMY.loadRandomQuestion()" class="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700"><i class="fas fa-question"></i></button>
              </div>
            </div>
          </div>
          <div class="w-full lg:w-1/3 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
            <div id="anatomy-details" class="flex-1 overflow-y-auto custom-scrollbar">${this.state.currentPart ? '' : this.#getEmptyState()}</div>
          </div>
        </div>
      </div>
    `;
  }

  #getEmptyState() { return `<div class="h-full flex items-center justify-center text-gray-400 flex-col"><i class="fas fa-hand-pointer text-3xl mb-2"></i><p>Select Structure</p></div>`; }

  #renderInfoPanel() {
    const container = document.getElementById('anatomy-details');
    if (!container || !this.state.currentPart) return;
    const part = this.systemsDB[this.state.currentSystem].parts[this.state.currentPart];
    const isEs = this.state.currentLang === 'es';
    
    const tabs = ['info', 'nclex', 'procedures', 'assessment'].map(t => `<button onclick="window.NCLEX_ANATOMY.switchTab('${t}')" class="flex-1 py-2 text-xs font-bold uppercase border-b-2 ${this.state.currentTab === t ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400'}">${t}</button>`).join('');

    let content = '';
    if (this.state.currentTab === 'info') {
      content = `<div class="p-4 space-y-4"><h3 class="text-xl font-bold dark:text-white">${part.name[this.state.currentLang]}</h3><p class="text-sm dark:text-gray-300">${part.desc[this.state.currentLang]}</p><div class="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded border-l-4 border-yellow-500"><p class="text-xs font-bold text-yellow-700">NCLEX:</p><p class="text-sm dark:text-white">${part.nclex[this.state.currentLang]}</p></div></div>`;
    } else if (this.state.currentTab === 'nclex') {
      if (this.state.quizQuestion) {
        const q = this.state.quizQuestion;
        const answered = this.state.userAnswer !== null;
        content = `<div class="p-4 space-y-4"><p class="font-bold text-sm dark:text-white">${q.question[this.state.currentLang]}</p><div class="space-y-2">${q.options.map((opt, i) => `<button onclick="window.NCLEX_ANATOMY.submitQuizAnswer(${i})" ${answered?'disabled':''} class="w-full text-left p-2 rounded border text-sm ${answered ? (i===q.correct?'bg-green-100 dark:text-black':i===this.state.userAnswer?'bg-red-100 dark:text-black':'opacity-50') : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white'}">${opt[this.state.currentLang]}</button>`).join('')}</div>${answered ? `<div class="bg-blue-50 dark:bg-blue-900/30 p-3 rounded text-sm dark:text-white"><strong>Rationale:</strong> ${q.rationale[this.state.currentLang]}</div>` : ''}</div>`;
      } else content = `<div class="p-8 text-center"><button onclick="window.NCLEX_ANATOMY.loadRandomQuestion()" class="bg-purple-600 text-white px-4 py-2 rounded">Quiz</button></div>`;
    } else if (this.state.currentTab === 'procedures') {
        content = `<div class="p-4"><ul class="list-disc pl-5 space-y-2 text-sm dark:text-gray-300">${part.procedures.map(p => `<li>${p[this.state.currentLang]}</li>`).join('')}</ul></div>`;
    } else if (this.state.currentTab === 'assessment') {
        const notes = this.state.assessmentNotes[this.state.currentPart] || [];
        content = `<div class="p-4 space-y-4"><div class="bg-blue-50 dark:bg-blue-900/30 p-3 rounded text-sm dark:text-white">${part.assessment[this.state.currentLang]}</div><textarea id="note-input" class="w-full border p-2 rounded dark:bg-gray-800 dark:text-white" placeholder="Note..."></textarea><button onclick="window.NCLEX_ANATOMY.saveAssessmentNote()" class="bg-blue-600 text-white px-4 py-2 rounded text-sm w-full">Save</button><div class="space-y-2 mt-4">${notes.map(n => `<div class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm text-gray-700 dark:text-gray-300">${n.text}</div>`).join('')}</div></div>`;
    }

    container.innerHTML = `<div class="h-full flex flex-col animate-slide-up"><div class="h-40 bg-gray-900 relative flex-shrink-0"><img src="${part.img}" class="w-full h-full object-cover opacity-60" onerror="this.src='https://via.placeholder.com/400x200'"><button onclick="window.NCLEX_ANATOMY.closePanel()" class="absolute top-2 right-2 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center"><i class="fas fa-times"></i></button></div><div class="flex border-b border-gray-200 dark:border-gray-700">${tabsHtml}</div><div class="flex-1 overflow-y-auto bg-white dark:bg-gray-900">${content}</div></div>`;
  }

  #injectStyles() {
    if(document.getElementById('anatomy-css')) return;
    const style = document.createElement('style');
    style.id = 'anatomy-css';
    style.textContent = `.anatomy-hotspot.active-spot { transform: scale(1.4); border-color: #007AFF; box-shadow: 0 0 15px #007AFF; background: rgba(0,122,255,0.4); } .custom-scrollbar::-webkit-scrollbar { width: 5px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; } .animate-slide-up { animation: slideUp 0.3s ease-out; } @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`;
    document.head.appendChild(style);
  }
}

// --- BOOTSTRAP (ESTANDARIZADO) ---
(function() {
  const start = () => {
    // Esperamos a que el MOTOR (ngn_engine) haya creado window.NCLEX
    if (window.NCLEX && window.NCLEX.registerTopic) {
      console.log("🚀 Registrando Anatomía en el Motor...");
      const lab = new AnatomyMasterLab();
      window.NCLEX_ANATOMY = lab;
      
      // Registro limpio, sin hacks. Logic.js se encargará de pintar el botón.
      window.NCLEX.registerTopic({
        id: 'anatomy', 
        title: {es:'Anatomía Clínica', en:'Clinical Anatomy'}, 
        subtitle: {es:'Atlas v10.2', en:'Atlas v10.2'}, 
        icon: 'heart-pulse', 
        color: 'blue',
        render: () => { 
          setTimeout(() => lab.init(), 100); 
          return lab.getInterface(); 
        }
      });
    } else {
      setTimeout(start, 100); // Reintentar si el motor aún no carga
    }
  };
  
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
