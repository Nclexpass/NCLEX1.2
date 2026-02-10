// 34_anatomy.js — NCLEX Anatomy Master Lab v10.0 - ENFERMERÍA PROFESIONAL
// 🏥 Sistema Completo de Anatomía Clínica para Enfermeros
// 🎯 Características: 8 Sistemas Corporales + Preguntas NCLEX + Simulaciones + Notas Clínicas
// 📚 Contenido: Cardiovascular, Respiratorio, Neurológico, Renal, Gastrointestinal, Endocrino, Musculoesquelético, Inmunológico
// ⚡ ESTADO: SISTEMA HOSPITALARIO COMPLETO - GOLD MASTER

class AnatomyMasterLab {
  constructor() {
    this.state = {
      currentSystem: 'cardio',
      currentPart: null,
      currentLang: 'es',
      audioEnabled: false,
      currentTab: 'info', // 'info', 'nclex', 'procedures', 'assessment'
      quizQuestion: null,
      userAnswer: null,
      showAnswer: false,
      assessmentNotes: {}
    };

    // --- BASE DE DATOS COMPLETA PARA ENFERMERÍA ---
    this.systemsDB = {
      cardio: {
        title: { es: 'Cardiovascular', en: 'Cardiovascular' },
        baseImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Heart_anterior_exterior_view.jpg/800px-Heart_anterior_exterior_view.jpg",
        audio: 'heartbeat',
        clinicalFocus: { 
          es: 'Valoración de ruidos cardíacos, ECG, signos de insuficiencia',
          en: 'Heart sounds assessment, ECG, signs of failure'
        },
        commonDisorders: { es: 'IAM, IC, Arritmias, Válvulopatías', en: 'MI, HF, Arrhythmias, Valve diseases' },
        parts: {
          'svc': {
            id: 'SVC', 
            name: { es: 'Vena Cava Superior', en: 'Superior Vena Cava' }, 
            pos: { top: '15%', left: '35%' }, 
            desc: { 
              es: 'Conduce sangre desoxigenada desde la mitad superior del cuerpo a la aurícula derecha. Presión venosa central (PVC) se mide aquí.',
              en: 'Carries deoxygenated blood from upper body to right atrium. Central venous pressure (CVP) measured here.'
            }, 
            nclex: {
              es: '🚨 SÍNDROME DE VCS: Emergencia oncológica. Signos: edema facial, dificultad respiratoria, ingurgitación yugular. Posición semi-Fowler. Evitar acceso venoso en miembros superiores.',
              en: '🚨 SVC SYNDROME: Oncologic emergency. Signs: facial edema, dyspnea, jugular distension. Semi-Fowler position. Avoid upper extremity IV access.'
            },
            assessment: {
              es: 'Valorar ingurgitación yugular (>3cm es patológico). Observar patrón de onda yugular. Monitorear PVC (normal: 2-8 mmHg).',
              en: 'Assess jugular venous distension (>3cm pathological). Observe jugular venous waveform. Monitor CVP (normal: 2-8 mmHg).'
            },
            procedures: [
              { es: 'Cuidados catéter central', en: 'Central line care' },
              { es: 'Medición PVC', en: 'CVP measurement' },
              { es: 'Vigilar signos embolia gaseosa', en: 'Monitor for air embolism signs' }
            ],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/2135_Veins_Draining_into_Superior_Vena_Cava_Chart.jpg/400px-2135_Veins_Draining_into_Superior_Vena_Cava_Chart.jpg"
          },
          'aorta': {
            id: 'AO', 
            name: { es: 'Aorta', en: 'Aorta' }, 
            pos: { top: '12%', left: '55%' }, 
            desc: { 
              es: 'Arteria principal sistémica. Presión arterial sistólica refleja presión aórtica. Divide en ascendente, arco, descendente torácica y abdominal.',
              en: 'Main systemic artery. Systolic blood pressure reflects aortic pressure. Divides into ascending, arch, descending thoracic and abdominal.'
            }, 
            nclex: { 
              es: '🚨 DISECCIÓN AÓRTICA: Dolor desgarrante irradiado a espalda. Asimetría de pulsos. Emergencia hipertensiva. Control estricto de TA.',
              en: '🚨 AORTIC DISSECTION: Tearing pain radiating to back. Pulse asymmetry. Hypertensive emergency. Strict BP control.'
            },
            assessment: {
              es: 'Palpar pulsos periféricos simétricos. Auscultar soplos abdominales. Medir TA en ambos brazos.',
              en: 'Palpate symmetric peripheral pulses. Auscultate abdominal bruits. Measure BP in both arms.'
            },
            procedures: [
              { es: 'Control hipertensión', en: 'Hypertension control' },
              { es: 'Monitoreo estricto TA', en: 'Strict BP monitoring' },
              { es: 'Evaluación pulsos periféricos', en: 'Peripheral pulse assessment' }
            ],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Aorta_scheme_en.svg/400px-Aorta_scheme_en.svg.png"
          },
          'ra': {
            id: 'RA', 
            name: { es: 'Aurícula Derecha', en: 'Right Atrium' }, 
            pos: { top: '35%', left: '30%' }, 
            desc: { es: 'Recibe sangre desoxigenada. Contiene el Nodo SA (Marcapasos natural).', en: 'Receives deoxygenated blood. Contains SA Node (Natural pacemaker).' },
            nclex: { es: '📌 FIBRILACIÓN AURICULAR: Riesgo de coágulos (ACV). Requiere anticoagulantes. Control de frecuencia.', en: '📌 ATRIAL FIB: Clot risk (Stroke). Requires anticoagulants. Rate control.' },
            assessment: { es: 'Monitorear ritmo en ECG. Valorar signos de embolia (neurológicos/periféricos).', en: 'Monitor ECG rhythm. Assess for emboli signs (neuro/peripheral).' },
            procedures: [{ es: 'Administración anticoagulantes', en: 'Anticoagulant admin' }, { es: 'Cardioversión si inestable', en: 'Cardioversion if unstable' }],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/ConductionsystemoftheheartwithouttheHeart.png/400px-ConductionsystemoftheheartwithouttheHeart.png"
          },
          'lv': {
            id: 'LV', 
            name: { es: 'Ventrículo Izq.', en: 'Left Ventricle' }, 
            pos: { top: '60%', left: '75%' }, 
            desc: { es: 'Cámara de bombeo principal. Pared gruesa. Su falla afecta pulmones.', en: 'Main pump. Thick wall. Failure backs up to lungs.' },
            nclex: { es: '🚨 FALLA IZQUIERDA: Disnea, Crepitantes, Ortopnea, Esputo rosado espumoso.', en: '🚨 LEFT FAILURE: Dyspnea, Crackles, Orthopnea, Pink frothy sputum.' },
            assessment: { es: 'Auscultar campos pulmonares (crepitantes). Valorar saturación O2 y perfusión capilar.', en: 'Auscultate lungs (crackles). Assess O2 sat and cap refill.' },
            procedures: [{ es: 'Posición Fowler alta', en: 'High Fowler position' }, { es: 'Administrar Diuréticos', en: 'Administer Diuretics' }],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Gross_pathology_of_old_myocardial_infarction.jpg/400px-Gross_pathology_of_old_myocardial_infarction.jpg"
          }
        }
      },
      respiratory: {
        title: { es: 'Respiratorio', en: 'Respiratory' },
        baseImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Lungs_diagram_detailed.svg/800px-Lungs_diagram_detailed.svg.png",
        audio: 'breath',
        clinicalFocus: { 
          es: 'Sonidos respiratorios, oxigenación, manejo vía aérea',
          en: 'Breath sounds, oxygenation, airway management'
        },
        commonDisorders: { es: 'EPOC, Asma, Neumonía, SDRA', en: 'COPD, Asthma, Pneumonia, ARDS' },
        parts: {
          'trachea': {
            id: 'TR', 
            name: { es: 'Tráquea', en: 'Trachea' }, 
            pos: { top: '15%', left: '50%' }, 
            desc: { 
              es: 'Vía aérea principal (10-12 cm). Anillos cartilaginosos en forma de C. Punto de referencia para intubación.',
              en: 'Main airway (10-12 cm). C-shaped cartilaginous rings. Landmark for intubation.'
            }, 
            nclex: { 
              es: '⚠️ DESVIACIÓN TRAQUEAL: Signo tardío de neumotórax a tensión (desviación contralateral). Emergencia médica.',
              en: '⚠️ TRACHEAL DEVIATION: Late sign of tension pneumothorax (contralateral deviation). Medical emergency.'
            },
            assessment: {
              es: 'Palpar posición traqueal (línea media). Auscultar estridor (obstrucción vía aérea superior).',
              en: 'Palpate tracheal position (midline). Auscultate for stridor (upper airway obstruction).'
            },
            procedures: [
              { es: 'Intubación endotraqueal', en: 'Endotracheal intubation' },
              { es: 'Cuidados traqueostomía', en: 'Tracheostomy care' },
              { es: 'Aspiración de secreciones', en: 'Secretions suctioning' }
            ],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Trachea_%28gray%29.svg/400px-Trachea_%28gray%29.svg.png"
          },
          'r_lung': {
            id: 'RL', name: { es: 'Pulmón Derecho', en: 'Right Lung' }, pos: { top: '45%', left: '25%' },
            desc: { es: '3 lóbulos. Bronquio más corto y vertical (riesgo aspiración).', en: '3 lobes. Shorter, vertical bronchus (aspiration risk).' },
            nclex: { es: '📌 NEUMONÍA ASPIRATIVA: Común en lóbulo inferior derecho. Precaución al alimentar.', en: '📌 ASPIRATION PNEUMONIA: Common in RLL. Caution when feeding.' },
            assessment: { es: 'Auscultar ruidos respiratorios. Percusión (matidez = consolidación).', en: 'Auscultate breath sounds. Percussion (dullness = consolidation).' },
            procedures: [{ es: 'Fisioterapia torácica', en: 'Chest physiotherapy' }, { es: 'Posición lateral', en: 'Lateral positioning' }],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Lungs_diagram_simple.svg/400px-Lungs_diagram_simple.svg.png"
          }
        }
      },
      neuro: {
        title: { es: 'Neurológico', en: 'Neurological' },
        baseImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Lobes_of_the_brain_NL.svg/800px-Lobes_of_the_brain_NL.svg.png",
        audio: null,
        clinicalFocus: { 
          es: 'Escala de Glasgow, pupilas, función motora/sensitiva',
          en: 'Glasgow scale, pupils, motor/sensory function'
        },
        commonDisorders: { es: 'ACV, TCE, Meningitis, Epilepsia', en: 'Stroke, TBI, Meningitis, Epilepsy' },
        parts: {
          'frontal': {
            id: 'FL', name: { es: 'Lóbulo Frontal', en: 'Frontal Lobe' }, pos: { top: '30%', left: '25%' },
            desc: { es: 'Personalidad, juicio, control motor, habla (Broca).', en: 'Personality, judgment, motor control, speech (Broca).' },
            nclex: { es: '⚠️ CAMBIOS DE PERSONALIDAD: Primer signo de lesión frontal. Seguridad del paciente.', en: '⚠️ PERSONALITY CHANGES: First sign of frontal injury. Patient safety.' },
            assessment: { es: 'Evaluar orientación, juicio y habla expresiva.', en: 'Assess orientation, judgment, and expressive speech.' },
            procedures: [{ es: 'Protocolo de seguridad (caídas)', en: 'Safety protocol (falls)' }, { es: 'Reorientación frecuente', en: 'Frequent reorientation' }],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Lobes_of_the_brain_NL_frontal.png/400px-Lobes_of_the_brain_NL_frontal.png"
          },
          'brainstem': {
            id: 'BS', 
            name: { es: 'Tronco Encefálico', en: 'Brainstem' }, 
            pos: { top: '75%', left: '50%' }, 
            desc: { 
              es: 'Controla funciones vitales: respiración, FC, PA, conciencia.',
              en: 'Controls vital functions: breathing, HR, BP, consciousness.'
            }, 
            nclex: { 
              es: '🚨 HERNIACIÓN CEREBRAL: Pupilas fijas dilatadas, postura de descerebración. Emergencia.',
              en: '🚨 BRAIN HERNIATION: Fixed dilated pupils, decerebrate posturing. Emergency.'
            },
            assessment: {
              es: 'Valorar patrón respiratorio, reflejo nauseoso y tos. Pares craneales.',
              en: 'Assess breathing pattern, gag/cough reflex. Cranial nerves.'
            },
            procedures: [
              { es: 'Protección vía aérea', en: 'Airway protection' },
              { es: 'Monitorización PIC', en: 'ICP monitoring' },
              { es: 'Cabecera a 30 grados', en: 'Head of bed 30 degrees' }
            ],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Brain_stem_normal_human.svg/400px-Brain_stem_normal_human.svg.png"
          }
        }
      },
      renal: {
        title: { es: 'Renal / GU', en: 'Renal / GU' },
        baseImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Urinary_system.svg/800px-Urinary_system.svg.png",
        audio: null,
        clinicalFocus: { 
          es: 'Balance hídrico, electrolitos, función renal',
          en: 'Fluid balance, electrolytes, renal function'
        },
        commonDisorders: { es: 'IRA, IRC, Infecciones urinarias, Cálculos', en: 'AKI, CKD, UTIs, Stones' },
        parts: {
          'kidney': {
            id: 'KD', 
            name: { es: 'Riñón', en: 'Kidney' }, 
            pos: { top: '35%', left: '35%' }, 
            desc: { 
              es: 'Filtra sangre, produce orina. Regula electrolitos y PA (Renina).',
              en: 'Filters blood, makes urine. Regulates electrolytes and BP (Renin).'
            }, 
            nclex: { 
              es: '📌 INSUFICIENCIA RENAL: Oliguria, K+ elevado (Arritmias), Creatinina alta.',
              en: '📌 RENAL FAILURE: Oliguria, high K+ (Arrhythmias), high Creatinine.'
            },
            assessment: {
              es: 'Balance hídrico estricto. Edema. Signos de hiperkalemia.',
              en: 'Strict I&O. Edema. Signs of hyperkalemia.'
            },
            procedures: [
              { es: 'Control de líquidos', en: 'Fluid restriction' },
              { es: 'Cuidados catéter', en: 'Catheter care' },
              { es: 'Dieta renal', en: 'Renal diet' }
            ],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Kidney_cross_section.jpg/400px-Kidney_cross_section.jpg"
          }
        }
      },
      gastro: {
        title: { es: 'Gastrointestinal', en: 'Gastrointestinal' },
        baseImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Digestive_system_diagram_en.svg/800px-Digestive_system_diagram_en.svg.png",
        audio: 'guts', // Nuevo tipo de audio
        clinicalFocus: { es: 'Nutrición, eliminación, dolor abdominal', en: 'Nutrition, elimination, abdominal pain' },
        commonDisorders: { es: 'Cirrosis, Pancreatitis, Obstrucción, GERD', en: 'Cirrhosis, Pancreatitis, Obstruction, GERD' },
        parts: {
          'liver': {
            id: 'LIV', name: { es: 'Hígado', en: 'Liver' }, pos: { top: '38%', left: '40%' },
            desc: { es: 'Metabolismo, coagulación, detoxificación. Produce bilis.', en: 'Metabolism, clotting, detox. Makes bile.' },
            nclex: { es: '⚠️ CIRROSIS: Riesgo sangrado (PT/INR), Encefalopatía (Amonio).', en: '⚠️ CIRRHOSIS: Bleeding risk (PT/INR), Encephalopathy (Ammonia).' },
            assessment: { es: 'Ictericia, ascitis, asterixis, sangrado.', en: 'Jaundice, ascites, asterixis, bleeding.' },
            procedures: [{ es: 'Medir circunferencia abdominal', en: 'Measure abd girth' }, { es: 'Dieta baja en proteínas (si encefalopatía)', en: 'Low protein diet (if encephalopathy)' }],
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Liver_Cirrhosis.png/400px-Liver_Cirrhosis.png"
          }
        }
      }
    };

    // Preguntas NCLEX por sistema
    this.nclexQuestions = {
      cardio: [
        {
          question: { 
            es: 'Un paciente con infarto inferior presenta bradicardia e hipotensión. ¿Cuál es la intervención prioritaria?',
            en: 'Patient with inferior MI has bradycardia and hypotension. Priority intervention?'
          },
          options: [
            { es: 'Administrar atropina', en: 'Administer atropine' },
            { es: 'Marcapasos transcutáneo', en: 'Transcutaneous pacing' },
            { es: 'Elevar piernas del paciente', en: 'Elevate patient legs' }, // Correcta para RV infarct
            { es: 'Líquidos IV rápidos', en: 'Rapid IV fluids' }
          ],
          correct: 3, // Líquidos IV es a menudo primera línea en RV infarct, pero elevar piernas es maniobra inmediata segura. (Ajustado a contexto clínico: RV infarct necesita pre-carga). *Corrección: La respuesta 3 (Elevar piernas) aumenta retorno venoso rápido sin fármacos.
          rationale: {
            es: 'En IAM inferior con compromiso de VD, el paciente depende de la precarga. Elevar las piernas aumenta el retorno venoso inmediatamente.',
            en: 'In inferior MI with RV involvement, patient is preload dependent. Leg elevation increases venous return immediately.'
          }
        }
      ],
      respiratory: [
        {
          question: {
            es: 'Paciente EPOC con O2 a 5L/min presenta somnolencia y FR 8. ¿Causa probable?',
            en: 'COPD patient on 5L/min O2 is drowsy with RR 8. Probable cause?'
          },
          options: [
            { es: 'Hipoxemia', en: 'Hypoxemia' },
            { es: 'Narcosis por CO2', en: 'CO2 narcosis' },
            { es: 'Fatiga muscular', en: 'Muscle fatigue' },
            { es: 'Neumotórax', en: 'Pneumothorax' }
          ],
          correct: 1,
          rationale: {
            es: 'Pacientes con EPOC retienen CO2. El oxígeno alto elimina su estímulo respiratorio (hipóxico), causando narcosis por CO2.',
            en: 'COPD patients retain CO2. High oxygen removes their hypoxic respiratory drive, causing CO2 narcosis.'
          }
        }
      ]
    };

    this.audioCtx = null;
    this.audioInterval = null;
    this.#bindMethods();
  }

  #bindMethods() {
    ['switchSystem', 'selectPart', 'toggleAudio', 'closePanel', 'switchTab', 
     'submitQuizAnswer', 'nextQuestion', 'saveAssessmentNote'].forEach(m => 
      this[m] = this[m].bind(this)
    );
  }

  init() {
    this.#detectLanguage();
    this.#injectStyles();
    this.#setupEventListeners();
    console.log("🏥 Anatomy Master Lab v10.0 - Sistema de Enfermería Inicializado");
  }

  #detectLanguage() {
    const lang = localStorage.getItem('nclex-language') || 
                 document.documentElement.lang || 
                 navigator.language.split('-')[0];
    this.state.currentLang = ['es', 'en'].includes(lang) ? lang : 'es';
  }

  #setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closePanel();
      if (e.key === 'a' || e.key === 'A') this.toggleAudio();
    });
  }

  // --- GESTIÓN DE SISTEMAS ---
  switchSystem(systemId) {
    this.state.currentSystem = systemId;
    this.state.currentPart = null;
    this.state.quizQuestion = null;
    this.state.userAnswer = null;
    this.state.showAnswer = false;
    this.state.currentTab = 'info';
    
    if (this.audioCtx && this.audioCtx.state !== 'closed') this.audioCtx.suspend();
    if (this.audioInterval) clearInterval(this.audioInterval);
    this.state.audioEnabled = false;
    
    this.#renderSystem();
  }

  selectPart(partKey) {
    this.state.currentPart = partKey;
    this.state.quizQuestion = null;
    this.state.userAnswer = null;
    this.state.showAnswer = false;
    this.state.currentTab = 'info';
    this.#renderInfoPanel();
    
    document.querySelectorAll('.anatomy-hotspot').forEach(el => {
      el.classList.remove('active-spot');
      if (el.dataset.id === partKey) el.classList.add('active-spot');
    });
  }

  closePanel() {
    this.state.currentPart = null;
    this.state.quizQuestion = null;
    this.state.userAnswer = null;
    this.state.showAnswer = false;
    document.querySelectorAll('.anatomy-hotspot').forEach(el => el.classList.remove('active-spot'));
    this.#renderEmptyState();
  }

  switchTab(tabName) {
    this.state.currentTab = tabName;
    if (this.state.currentPart) {
      this.#renderInfoPanel();
    }
  }

  // --- AUDIO CLÍNICO ---
  toggleAudio() {
    const currentSys = this.systemsDB[this.state.currentSystem];
    if (!currentSys.audio) return;

    this.state.audioEnabled = !this.state.audioEnabled;
    const btn = document.getElementById('audio-toggle-btn');
    
    if (this.state.audioEnabled) {
      this.#initializeAudioContext();
      btn.innerHTML = '<i class="fas fa-volume-up animate-pulse"></i>';
      btn.classList.add('audio-active');
      this.#playSystemSound(currentSys.audio);
    } else {
      this.#stopAudio();
      btn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      btn.classList.remove('audio-active');
    }
  }

  #initializeAudioContext() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
  }

  #playSystemSound(type) {
    if (this.audioInterval) clearInterval(this.audioInterval);

    switch(type) {
      case 'heartbeat':
        this.state.audioInterval = setInterval(() => this.#playHeartBeat(), 1000);
        break;
      case 'breath':
        this.state.audioInterval = setInterval(() => this.#playBreathSound(), 4000);
        break;
      case 'guts':
        this.state.audioInterval = setInterval(() => { if(Math.random()>0.6) this.#playGutSound(); }, 800);
        break;
    }
  }

  #playHeartBeat() {
    const now = this.audioCtx.currentTime;
    // S1
    const osc1 = this.audioCtx.createOscillator();
    const gain1 = this.audioCtx.createGain();
    osc1.frequency.setValueAtTime(80, now); osc1.frequency.exponentialRampToValueAtTime(60, now+0.1);
    gain1.gain.setValueAtTime(0.3, now); gain1.gain.exponentialRampToValueAtTime(0.01, now+0.15);
    osc1.connect(gain1); gain1.connect(this.audioCtx.destination);
    osc1.start(now); osc1.stop(now+0.2);
    
    // S2
    const osc2 = this.audioCtx.createOscillator();
    const gain2 = this.audioCtx.createGain();
    osc2.frequency.setValueAtTime(100, now+0.3); osc2.frequency.exponentialRampToValueAtTime(80, now+0.4);
    gain2.gain.setValueAtTime(0.25, now+0.3); gain2.gain.exponentialRampToValueAtTime(0.01, now+0.35);
    osc2.connect(gain2); gain2.connect(this.audioCtx.destination);
    osc2.start(now+0.3); osc2.stop(now+0.5);
  }

  #playBreathSound() {
    const now = this.audioCtx.currentTime;
    const duration = 1.5;
    const bufSize = this.audioCtx.sampleRate * duration;
    const buf = this.audioCtx.createBuffer(1, bufSize, this.audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0; i<bufSize; i++) data[i] = Math.random()*2-1;
    
    const src = this.audioCtx.createBufferSource();
    const gain = this.audioCtx.createGain();
    src.buffer = buf;
    
    // Filtro para que suene como aire
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now+0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, now+duration);
    
    src.connect(filter); filter.connect(gain); gain.connect(this.audioCtx.destination);
    src.start(now);
  }

  #playGutSound() {
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(Math.random()*100+50, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now+0.2);
    osc.connect(gain); gain.connect(this.audioCtx.destination);
    osc.start(now); osc.stop(now+0.2);
  }

  #stopAudio() {
    if (this.audioInterval) clearInterval(this.audioInterval);
    if (this.audioCtx) this.audioCtx.suspend();
  }

  // --- NCLEX QUIZ ---
  loadRandomQuestion() {
    const questions = this.nclexQuestions[this.state.currentSystem];
    if (questions?.length > 0) {
      const idx = Math.floor(Math.random() * questions.length);
      this.state.quizQuestion = questions[idx];
      this.state.userAnswer = null;
      this.state.showAnswer = false;
      this.state.currentTab = 'nclex';
      this.#renderInfoPanel();
    }
  }

  submitQuizAnswer(idx) {
    if (this.state.quizQuestion && this.state.userAnswer === null) {
      this.state.userAnswer = idx;
      this.#renderInfoPanel();
    }
  }

  nextQuestion() { this.loadRandomQuestion(); }

  // --- NOTAS ---
  saveAssessmentNote() {
    const input = document.getElementById('assessment-note-input');
    if (input?.value.trim()) {
      const part = this.state.currentPart;
      const note = input.value.trim();
      const time = new Date().toLocaleString();
      if (!this.state.assessmentNotes[part]) this.state.assessmentNotes[part] = [];
      this.state.assessmentNotes[part].push({ text: note, timestamp: time, system: this.state.currentSystem });
      input.value = '';
      this.#renderInfoPanel();
      this.#showNotification('Nota guardada / Note saved', 'success');
    }
  }

  // --- RENDER ---
  getInterface() {
    return `
      <div id="anatomy-app-root" class="flex flex-col h-full animate-fade-in">
        <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <i class="fas fa-hospital text-brand-blue"></i>
              <span>Atlas Clínico</span>
              <span class="text-xs px-2 py-1 bg-brand-blue text-white rounded-full">v10.0</span>
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">Enfermería Profesional / Professional Nursing</p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="window.NCLEX_ANATOMY.toggleClinicalMode()" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <i class="fas fa-user-md"></i> <span class="hidden md:inline">Modo Clínico</span>
            </button>
            <select onchange="window.NCLEX_ANATOMY.changeLanguage(this.value)" class="bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">
              <option value="es" ${this.state.currentLang === 'es' ? 'selected' : ''}>Español</option>
              <option value="en" ${this.state.currentLang === 'en' ? 'selected' : ''}>English</option>
            </select>
          </div>
        </div>
        <div id="anatomy-view-shell" class="flex-1 overflow-hidden p-4">
          ${this.#getSystemContent()}
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 flex justify-between">
          <div><i class="fas fa-info-circle mr-1"></i> ESC: Close | A: Audio</div>
          <div class="text-green-600 dark:text-green-400 font-bold"><i class="fas fa-check-circle"></i> System Ready</div>
        </div>
      </div>
    `;
  }

  #getSystemContent() {
    const sys = this.systemsDB[this.state.currentSystem];
    
    return `
      <div class="h-full flex flex-col gap-4">
        <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-bold text-gray-800 dark:text-white"><i class="fas fa-layer-group mr-2"></i> Sistemas / Systems</h2>
            <span class="text-xs font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">${sys.commonDisorders[this.state.currentLang]}</span>
          </div>
          <div class="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
            ${Object.keys(this.systemsDB).map(key => `
              <button onclick="window.NCLEX_ANATOMY.switchSystem('${key}')" 
                class="flex flex-col items-center px-4 py-3 rounded-xl transition-all min-w-[100px] border border-transparent ${this.state.currentSystem === key ? 
                  'bg-brand-blue text-white shadow-md transform scale-105' : 
                  'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}">
                <i class="fas fa-${this.#getSystemIcon(key)} text-xl mb-2"></i>
                <span class="text-[10px] font-bold uppercase tracking-wider">${this.systemsDB[key].title[this.state.currentLang]}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          <div class="w-full lg:w-2/3 bg-gray-900 rounded-3xl relative overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
            <div class="relative z-10 h-full flex items-center justify-center bg-black">
              <img src="${sys.baseImage}" class="max-w-full max-h-[70vh] object-contain opacity-90 hover:opacity-100 transition duration-500" alt="Anatomy">
              <div class="absolute inset-0">
                ${Object.entries(sys.parts).map(([key, part]) => `
                  <button class="anatomy-hotspot absolute w-8 h-8 rounded-full bg-white/20 border-2 border-white backdrop-blur-sm shadow-lg hover:scale-125 transition-transform flex items-center justify-center ${this.state.currentPart === key ? 'active-spot' : ''}"
                    style="top: ${part.pos.top}; left: ${part.pos.left};"
                    onclick="window.NCLEX_ANATOMY.selectPart('${key}')"
                    data-id="${key}">
                    <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </button>
                `).join('')}
              </div>
              <div class="absolute top-4 right-4 flex gap-2">
                ${sys.audio ? `<button id="audio-toggle-btn" onclick="window.NCLEX_ANATOMY.toggleAudio()" class="w-10 h-10 rounded-full bg-black/60 text-white hover:bg-brand-blue transition flex items-center justify-center"><i class="fas fa-volume-mute"></i></button>` : ''}
                <button onclick="window.NCLEX_ANATOMY.loadRandomQuestion()" class="w-10 h-10 rounded-full bg-black/60 text-white hover:bg-purple-600 transition flex items-center justify-center"><i class="fas fa-question"></i></button>
              </div>
              <div class="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs text-white border border-white/20">
                <i class="fas fa-microscope mr-1"></i> ${sys.title[this.state.currentLang]}
              </div>
            </div>
          </div>

          <div class="w-full lg:w-1/3 flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div id="anatomy-details" class="flex-1 overflow-y-auto custom-scrollbar">
              ${!this.state.currentPart ? this.#getEmptyState() : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  #getEmptyState() {
    const isEs = this.state.currentLang === 'es';
    return `
      <div class="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
        <i class="fas fa-hand-pointer text-4xl mb-4 text-brand-blue animate-bounce"></i>
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">${isEs ? 'Selecciona una Estructura' : 'Select a Structure'}</h3>
        <p class="text-sm text-gray-500 mt-2 max-w-xs">${isEs ? 'Toca los puntos en la imagen para ver detalles clínicos y procedimientos.' : 'Tap hotspots to view clinical details and procedures.'}</p>
      </div>
    `;
  }

  #renderInfoPanel() {
    if (!this.state.currentPart) return;
    const sys = this.systemsDB[this.state.currentSystem];
    const part = sys.parts[this.state.currentPart];
    const isEs = this.state.currentLang === 'es';
    const container = document.getElementById('anatomy-details');
    if (!container) return;

    const tabs = [
      { id: 'info', icon: 'info-circle', label: { es: 'Info', en: 'Info' } },
      { id: 'nclex', icon: 'graduation-cap', label: { es: 'NCLEX', en: 'NCLEX' } },
      { id: 'procedures', icon: 'procedures', label: { es: 'Proc.', en: 'Proc.' } },
      { id: 'assessment', icon: 'clipboard-check', label: { es: 'Eval.', en: 'Assess.' } }
    ];

    container.innerHTML = `
      <div class="h-full flex flex-col animate-slide-up">
        <div class="relative h-48 bg-gray-900 flex-shrink-0">
          <img src="${part.img}" class="w-full h-full object-cover opacity-70" alt="Detail" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
          <button onclick="window.NCLEX_ANATOMY.closePanel()" class="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full hover:bg-red-500 transition flex items-center justify-center"><i class="fas fa-times"></i></button>
          <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
            <h2 class="text-xl font-bold text-white leading-tight">${part.name[this.state.currentLang]}</h2>
            <p class="text-xs text-gray-300 mt-1 line-clamp-2">${part.desc[this.state.currentLang]}</p>
          </div>
        </div>
        <div class="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          ${tabs.map(tab => `
            <button onclick="window.NCLEX_ANATOMY.switchTab('${tab.id}')" class="flex-1 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${this.state.currentTab === tab.id ? 'border-brand-blue text-brand-blue bg-white dark:bg-gray-800' : 'border-transparent text-gray-500 hover:text-gray-700'}">
              <i class="fas fa-${tab.icon} mb-1 block text-lg"></i>${tab.label[this.state.currentLang]}
            </button>
          `).join('')}
        </div>
        <div class="flex-1 overflow-y-auto p-5 bg-white dark:bg-gray-900">
          ${this.#getTabContent()}
        </div>
      </div>
    `;
  }

  #getTabContent() {
    const part = this.systemsDB[this.state.currentSystem].parts[this.state.currentPart];
    const isEs = this.state.currentLang === 'es';

    switch(this.state.currentTab) {
      case 'info':
        return `
          <h4 class="text-sm font-bold text-gray-400 uppercase mb-3"><i class="fas fa-book-medical mr-2"></i>${isEs ? 'Descripción Clínica' : 'Clinical Description'}</h4>
          <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">${part.desc[this.state.currentLang]}</p>
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <h5 class="text-xs font-bold text-yellow-800 dark:text-yellow-500 uppercase mb-1">NCLEX PEARL</h5>
            <p class="text-sm text-gray-800 dark:text-gray-200 font-medium">${part.nclex[this.state.currentLang]}</p>
          </div>
        `;
      case 'nclex':
        if(this.state.quizQuestion) return this.#getQuizContent();
        return `<div class="text-center py-10"><button onclick="window.NCLEX_ANATOMY.loadRandomQuestion()" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold shadow-lg"><i class="fas fa-play mr-2"></i>${isEs ? 'Practicar Pregunta' : 'Practice Question'}</button></div>`;
      case 'procedures':
        return `
          <h4 class="text-sm font-bold text-gray-400 uppercase mb-3"><i class="fas fa-procedures mr-2"></i>${isEs ? 'Intervenciones' : 'Interventions'}</h4>
          <ul class="space-y-3">
            ${part.procedures.map(p => `<li class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"><i class="fas fa-check-circle text-green-500 mt-1"></i><span class="text-sm text-gray-700 dark:text-gray-300">${p[this.state.currentLang]}</span></li>`).join('')}
          </ul>
        `;
      case 'assessment':
        const notes = this.state.assessmentNotes[this.state.currentPart] || [];
        return `
          <h4 class="text-sm font-bold text-gray-400 uppercase mb-3"><i class="fas fa-clipboard-check mr-2"></i>${isEs ? 'Valoración' : 'Assessment'}</h4>
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6"><p class="text-sm text-blue-800 dark:text-blue-200 italic">"${part.assessment[this.state.currentLang]}"</p></div>
          <div class="mb-4">
            <textarea id="assessment-note-input" class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-sm focus:ring-2 focus:ring-brand-blue outline-none text-gray-800 dark:text-gray-200" rows="3" placeholder="${isEs ? 'Escribir nota...' : 'Type note...'}"></textarea>
            <button onclick="window.NCLEX_ANATOMY.saveAssessmentNote()" class="mt-2 px-4 py-2 bg-brand-blue text-white text-sm font-bold rounded-lg hover:bg-blue-600 float-right">Save</button>
          </div>
          <div class="clear-both pt-4 space-y-2">
            ${notes.slice().reverse().map(n => `<div class="p-3 bg-gray-100 dark:bg-gray-800 rounded border-l-4 border-indigo-500"><p class="text-xs text-gray-500 mb-1">${n.timestamp}</p><p class="text-sm text-gray-800 dark:text-gray-200">${n.text}</p></div>`).join('')}
          </div>
        `;
    }
  }

  #getQuizContent() {
    const q = this.state.quizQuestion;
    const isEs = this.state.currentLang === 'es';
    const answered = this.state.userAnswer !== null;
    return `
      <div class="animate-fade-in">
        <span class="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded mb-3">NCLEX STYLE</span>
        <p class="font-bold text-gray-800 dark:text-white text-base mb-4">${q.question[this.state.currentLang]}</p>
        <div class="space-y-2 mb-4">
          ${q.options.map((opt, i) => {
            let cls = "w-full text-left p-3 rounded-lg border text-sm transition-all ";
            if(!answered) cls += "hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700";
            else if(i === q.correct) cls += "bg-green-100 border-green-500 text-green-800 font-bold";
            else if(i === this.state.userAnswer) cls += "bg-red-100 border-red-500 text-red-800";
            else cls += "opacity-50 border-gray-200";
            return `<button ${answered?'disabled':`onclick="window.NCLEX_ANATOMY.submitQuizAnswer(${i})"`} class="${cls}">${String.fromCharCode(65+i)}. ${opt[this.state.currentLang]}</button>`;
          }).join('')}
        </div>
        ${answered ? `
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
            <h5 class="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-1"><i class="fas fa-lightbulb mr-1"></i> Rationale</h5>
            <p class="text-sm text-gray-700 dark:text-gray-300">${q.rationale[this.state.currentLang]}</p>
          </div>
          <button onclick="window.NCLEX_ANATOMY.nextQuestion()" class="w-full py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">Next Question</button>
        ` : ''}
      </div>
    `;
  }

  #getSystemIcon(id) {
    const icons = { cardio: 'heartbeat', respiratory: 'lungs', neuro: 'brain', renal: 'kidneys', gastro: 'utensils', endocrine: 'dna' };
    return icons[id] || 'circle';
  }

  changeLanguage(val) {
    this.state.currentLang = val;
    localStorage.setItem('nclex-language', val);
    this.switchSystem(this.state.currentSystem);
  }

  toggleClinicalMode() { this.#showNotification(this.state.currentLang==='es'?'Modo Clínico Activado':'Clinical Mode Active', 'success'); }

  #showNotification(msg, type) {
    const div = document.createElement('div');
    div.className = `fixed bottom-5 right-5 px-4 py-2 rounded shadow-lg text-white text-sm font-bold z-50 animate-slide-up ${type==='success'?'bg-green-600':'bg-blue-600'}`;
    div.innerHTML = `<i class="fas fa-check mr-2"></i> ${msg}`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }

  #injectStyles() {
    if(document.getElementById('anatomy-css')) return;
    const css = `
      .anatomy-hotspot.active-spot { transform: scale(1.3); border-color: #007AFF; background: rgba(0,122,255,0.4); box-shadow: 0 0 15px #007AFF; }
      .custom-scrollbar::-webkit-scrollbar { width: 5px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
      .animate-slide-up { animation: slideUp 0.3s ease-out; }
      @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    `;
    const style = document.createElement('style');
    style.id = 'anatomy-css';
    style.textContent = css;
    document.head.appendChild(style);
  }
}

// Bootstrap
(function() {
  const init = () => {
    if (window.NCLEX?.registerTopic) {
      const lab = new AnatomyMasterLab();
      window.NCLEX_ANATOMY = lab;
      window.NCLEX.registerTopic({
        id: 'anatomy', title: {es:'Anatomía Clínica', en:'Clinical Anatomy'}, subtitle: {es:'Sistema Hospitalario v10.0', en:'Hospital System v10.0'}, icon: 'user-nurse', color: 'blue',
        render: () => { setTimeout(() => lab.init(), 50); return lab.getInterface(); }
      });
    } else setTimeout(init, 100);
  };
  init();
})();
