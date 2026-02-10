// 34_anatomy.js — NCLEX Anatomy MasterClass "TITANIUM" v12.0
// 🏥 MODULE: Clinical Anatomy Interactive System
// 🎯 PARA: Estudiantes de enfermería NCLEX
// 📦 DATOS: Base de datos médica completa + Imágenes Wikimedia
// 🔧 ESTADO: Funcional completo

class AnatomyTitanium {
    constructor() {
        this.id = 'anatomy';
        this.title = {
            es: 'Anatomía Clínica',
            en: 'Clinical Anatomy'
        };
        this.version = '12.0';
        this.icon = 'heart-pulse';
        
        // Estado
        this.state = {
            system: 'cardio',
            selectedPart: null,
            lang: 'es',
            audio: false,
            tab: 'clinical',
            zoom: 1,
            loading: false
        };
        
        // Base de datos médica completa
        this.db = this.createMedicalDatabase();
        
        // Sistema de audio
        this.audioCtx = null;
        this.audioInterval = null;
        
        // Vincular métodos
        this.bindMethods();
    }
    
    createMedicalDatabase() {
        return {
            cardio: {
                id: 'cardio',
                label: { es: 'Cardiovascular', en: 'Cardiovascular' },
                description: { es: 'Corazón y sistema circulatorio', en: 'Heart and circulatory system' },
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Diagram_of_the_human_heart_%28cropped%29.svg/800px-Diagram_of_the_human_heart_%28cropped%29.svg.png',
                color: '#FF3B30',
                audio: 'heart',
                parts: {
                    'aorta': {
                        id: 'aorta',
                        name: { es: 'Aorta', en: 'Aorta' },
                        position: { top: '20%', left: '52%' },
                        clinical: {
                            es: 'Arteria principal del cuerpo. Transporta sangre oxigenada desde el ventrículo izquierdo al resto del cuerpo.',
                            en: 'Main artery of the body. Carries oxygenated blood from left ventricle to body.'
                        },
                        nclex: {
                            es: '🚨 DISECCIÓN AÓRTICA: Dolor desgarrante en espalda, diferencia de presión arterial >20mmHg entre brazos. EMERGENCIA MÉDICA.',
                            en: '🚨 AORTIC DISSECTION: Tearing back pain, BP difference >20mmHg between arms. MEDICAL EMERGENCY.'
                        },
                        labs: 'Ecocardiograma, TAC torácico, D-dímero',
                        interventions: [
                            'Control estricto de presión arterial',
                            'Administrar betabloqueadores IV',
                            'Preparar para cirugía de emergencia',
                            'Monitorizar pulsos periféricos'
                        ],
                        diseases: ['Disección aórtica', 'Aneurisma aórtico', 'Estenosis aórtica'],
                        nclexTips: [
                            'Diferencia de PA >20mmHg entre brazos = signo de disección',
                            'Dolor desgarrante que se irradia a espalda',
                            'Emergencia quirúrgica inmediata'
                        ]
                    },
                    'ventricle_left': {
                        id: 'ventricle_left',
                        name: { es: 'Ventrículo Izquierdo', en: 'Left Ventricle' },
                        position: { top: '55%', left: '60%' },
                        clinical: {
                            es: 'Cámara muscular más gruesa. Bomba sangre a todo el cuerpo a través de la aorta.',
                            en: 'Thickest muscular chamber. Pumps blood to body through aorta.'
                        },
                        nclex: {
                            es: '⚠️ INSUFICIENCIA CARDÍACA IZQUIERDA: Disnea, ortopnea, crepitantes pulmonares, esputo rosado.',
                            en: '⚠️ LEFT HEART FAILURE: Dyspnea, orthopnea, crackles, pink frothy sputum.'
                        },
                        labs: 'BNP (>100 pg/mL), Ecocardiograma (FE <40%), Radiografía de tórax',
                        interventions: [
                            'Administrar diuréticos (furosemida)',
                            'Restricción de líquidos',
                            'Monitorizar balance hídrico',
                            'Posición semifowler'
                        ],
                        diseases: ['Insuficiencia cardíaca izquierda', 'Cardiomiopatía', 'Hipertrofia ventricular'],
                        nclexTips: [
                            'FE <40% = insuficiencia cardíaca',
                            'BNP elevado = diagnóstico de IC',
                            'Sonidos: S3 galope en IC'
                        ]
                    },
                    'atrium_right': {
                        id: 'atrium_right',
                        name: { es: 'Aurícula Derecha', en: 'Right Atrium' },
                        position: { top: '25%', left: '30%' },
                        clinical: {
                            es: 'Recibe sangre desoxigenada de la vena cava superior e inferior. Contiene nódulo SA (marcapasos natural).',
                            en: 'Receives deoxygenated blood from SVC/IVC. Contains SA node (natural pacemaker).'
                        },
                        nclex: {
                            es: '📌 FIBRILACIÓN AURICULAR: Ritmo irregular irregular, riesgo de émbolos, anticoagulación necesaria.',
                            en: '📌 ATRIAL FIBRILLATION: Irregularly irregular rhythm, embolic risk, anticoagulation needed.'
                        },
                        labs: 'ECG, INR (si en warfarina), Troponina',
                        interventions: [
                            'Monitorizar ritmo cardíaco',
                            'Administrar anticoagulantes',
                            'Cardioversión eléctrica si inestable',
                            'Control de frecuencia con betabloqueadores'
                        ],
                        diseases: ['Fibrilación auricular', 'Flutter auricular', 'Trombosis auricular'],
                        nclexTips: [
                            'Ritmo irregular irregular = FA',
                            'Riesgo ACV = necesidad de anticoagulación',
                            'Cardioversión sincronizada para FA'
                        ]
                    }
                }
            },
            resp: {
                id: 'resp',
                label: { es: 'Respiratorio', en: 'Respiratory' },
                description: { es: 'Pulmones y vías respiratorias', en: 'Lungs and airways' },
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Lungs_diagram_detailed.svg/800px-Lungs_diagram_detailed.svg.png',
                color: '#007AFF',
                audio: 'lungs',
                parts: {
                    'trachea': {
                        id: 'trachea',
                        name: { es: 'Tráquea', en: 'Trachea' },
                        position: { top: '15%', left: '50%' },
                        clinical: {
                            es: 'Vía aérea principal. Anillos cartilaginosos en forma de C mantienen permeabilidad.',
                            en: 'Main airway. C-shaped cartilaginous rings maintain patency.'
                        },
                        nclex: {
                            es: '🚨 NEUMOTÓRAX A TENSIÓN: Desviación traqueal hacia lado opuesto, hipotensión, distensión venosa yugular.',
                            en: '🚨 TENSION PNEUMOTHORAX: Tracheal deviation away from affected side, hypotension, JVD.'
                        },
                        labs: 'Gasometría arterial, Radiografía de tórax, Broncoscopia',
                        interventions: [
                            'Mantener vía aérea permeable',
                            'Intubación si necesario',
                            'Toracostomía para neumotórax',
                            'Succión de secreciones'
                        ],
                        diseases: ['Estridor', 'Traqueítis', 'Obstrucción traqueal'],
                        nclexTips: [
                            'Desviación traqueal = neumotórax a tensión',
                            'Sonido estridor = obstrucción alta vía aérea',
                            'Emergencia: cricotiroidotomía'
                        ]
                    },
                    'lung_right': {
                        id: 'lung_right',
                        name: { es: 'Pulmón Derecho', en: 'Right Lung' },
                        position: { top: '40%', left: '70%' },
                        clinical: {
                            es: 'Tres lóbulos (superior, medio, inferior). Sitio común de neumonía por aspiración.',
                            en: 'Three lobes (upper, middle, lower). Common site for aspiration pneumonia.'
                        },
                        nclex: {
                            es: '⚠️ NEUMONÍA: Fiebre, tos productiva, crepitantes localizados, consolidación en RX.',
                            en: '⚠️ PNEUMONIA: Fever, productive cough, localized crackles, consolidation on CXR.'
                        },
                        labs: 'Cultivo de esputo, Hemograma, Proteína C reactiva',
                        interventions: [
                            'Antibióticos según cultivo',
                            'Terapia respiratoria',
                            'Oxigenoterapia',
                            'Incentivómetro'
                        ],
                        diseases: ['Neumonía', 'Atelectasia', 'Derrame pleural', 'Cáncer pulmonar'],
                        nclexTips: [
                            'Crepitantes = neumonía/edema',
                            'Broncófonos aumentados = consolidación',
                            'Frote pleural = pleuritis'
                        ]
                    }
                }
            },
            neuro: {
                id: 'neuro',
                label: { es: 'Neurológico', en: 'Neurological' },
                description: { es: 'Cerebro y sistema nervioso', en: 'Brain and nervous system' },
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Lobes_of_the_brain_NL.svg/800px-Lobes_of_the_brain_NL.svg.png',
                color: '#5856D6',
                audio: null,
                parts: {
                    'frontal': {
                        id: 'frontal',
                        name: { es: 'Lóbulo Frontal', en: 'Frontal Lobe' },
                        position: { top: '25%', left: '25%' },
                        clinical: {
                            es: 'Funciones ejecutivas, personalidad, juicio, movimiento voluntario, área de Broca (habla).',
                            en: 'Executive functions, personality, judgment, voluntary movement, Broca\'s area (speech).'
                        },
                        nclex: {
                            es: '⚠️ LESIÓN FRONTAL: Cambios de personalidad, desinhibición, afasia expresiva, hemiparesia contralateral.',
                            en: '⚠️ FRONTAL LOBE INJURY: Personality changes, disinhibition, expressive aphasia, contralateral hemiparesis.'
                        },
                        labs: 'TAC craneal, RMN, EEG, Escala de Glasgow',
                        interventions: [
                            'Evaluar nivel de conciencia',
                            'Monitorizar signos neurológicos',
                            'Proteger de autolesiones',
                            'Terapia del habla'
                        ],
                        diseases: ['Accidente cerebrovascular frontal', 'Tumor cerebral', 'Trauma craneoencefálico'],
                        nclexTips: [
                            'Área de Broca = afasia expresiva',
                            'Cambios conductuales = lesión frontal',
                            'Hemiparesia contralateral'
                        ]
                    },
                    'brainstem': {
                        id: 'brainstem',
                        name: { es: 'Tronco Encefálico', en: 'Brainstem' },
                        position: { top: '60%', left: '52%' },
                        clinical: {
                            es: 'Control de funciones vitales: respiración, frecuencia cardíaca, presión arterial, reflejos.',
                            en: 'Controls vital functions: breathing, heart rate, blood pressure, reflexes.'
                        },
                        nclex: {
                            es: '🚨 HERNIACIÓN CEREBRAL: Triada de Cushing (HTA, bradicardia, respiración irregular). EMERGENCIA.',
                            en: '🚨 BRAIN HERNIATION: Cushing\'s triad (HTN, bradycardia, irregular breathing). EMERGENCY.'
                        }
                    }
                }
            },
            gi: {
                id: 'gi',
                label: { es: 'Gastrointestinal', en: 'Gastrointestinal' },
                description: { es: 'Sistema digestivo', en: 'Digestive system' },
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Digestive_system_diagram_en.svg/800px-Digestive_system_diagram_en.svg.png',
                color: '#34C759',
                audio: 'bowel',
                parts: {
                    'liver': {
                        id: 'liver',
                        name: { es: 'Hígado', en: 'Liver' },
                        position: { top: '35%', left: '65%' },
                        clinical: {
                            es: 'Metabolismo de fármacos, producción de bilis, síntesis de proteínas, desintoxicación.',
                            en: 'Drug metabolism, bile production, protein synthesis, detoxification.'
                        },
                        nclex: {
                            es: '⚠️ CIRROSIS HEPÁTICA: Ascitis, encefalopatía, varices esofágicas, coagulopatía.',
                            en: '⚠️ LIVER CIRRHOSIS: Ascites, encephalopathy, esophageal varices, coagulopathy.'
                        },
                        labs: 'ALT, AST, Bilirrubina, Albúmina, TP/INR',
                        interventions: [
                            'Restricción de sodio',
                            'Diuréticos (espironolactona)',
                            'Lactulosa para encefalopatía',
                            'Vitamina K para coagulopatía'
                        ]
                    },
                    'appendix': {
                        id: 'appendix',
                        name: { es: 'Apéndice', en: 'Appendix' },
                        position: { top: '70%', left: '40%' },
                        clinical: {
                            es: 'Estructura vestigial en ciego. Inflamación = apendicitis (emergencia quirúrgica).',
                            en: 'Vestigial structure in cecum. Inflammation = appendicitis (surgical emergency).'
                        },
                        nclex: {
                            es: '🚨 APENDICITIS: Dolor McBurney, fiebre, leucocitosis, anorexia. Ruptura = peritonitis.',
                            en: '🚨 APPENDICITIS: McBurney\'s pain, fever, leukocytosis, anorexia. Rupture = peritonitis.'
                        },
                        labs: 'Hemograma (leucocitosis), Proteína C reactiva, Ecografía abdominal',
                        interventions: [
                            'NPO inmediato',
                            'Antibióticos IV',
                            'Preparar para apendicectomía',
                            'Analgesia (evitar opioides que enmascaren)'
                        ]
                    }
                }
            }
        };
    }
    
    bindMethods() {
        this.selectSystem = this.selectSystem.bind(this);
        this.selectPart = this.selectPart.bind(this);
        this.toggleAudio = this.toggleAudio.bind(this);
        this.closePanel = this.closePanel.bind(this);
        this.setTab = this.setTab.bind(this);
        this.zoom = this.zoom.bind(this);
        this.render = this.render.bind(this);
        this.init = this.init.bind(this);
    }
    
    // ==================== SISTEMA DE AUDIO REALISTA ====================
    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    playHeartbeat() {
        if (!this.state.audio || !this.audioCtx) return;
        
        const now = this.audioCtx.currentTime;
        
        // S1 - "Lub"
        const s1 = this.audioCtx.createOscillator();
        const s1Gain = this.audioCtx.createGain();
        s1.type = 'sine';
        s1.frequency.value = 55;
        s1Gain.gain.setValueAtTime(0, now);
        s1Gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
        s1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        // S2 - "Dub" (más agudo)
        const s2 = this.audioCtx.createOscillator();
        const s2Gain = this.audioCtx.createGain();
        s2.type = 'sine';
        s2.frequency.value = 65;
        s2Gain.gain.setValueAtTime(0, now + 0.3);
        s2Gain.gain.linearRampToValueAtTime(0.25, now + 0.32);
        s2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        
        s1.connect(s1Gain);
        s1Gain.connect(this.audioCtx.destination);
        s2.connect(s2Gain);
        s2Gain.connect(this.audioCtx.destination);
        
        s1.start(now);
        s1.stop(now + 0.2);
        s2.start(now + 0.3);
        s2.stop(now + 0.5);
    }
    
    playBreathSound() {
        if (!this.state.audio || !this.audioCtx) return;
        
        const now = this.audioCtx.currentTime;
        const duration = 4; // 4 segundos para ciclo completo
        
        // Ruido blanco para sonido respiratorio
        const bufferSize = this.audioCtx.sampleRate * duration;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        
        // Filtro para simular pulmones
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 300;
        filter.Q.value = 1;
        
        // Envolvente de respiración
        const gainNode = this.audioCtx.createGain();
        
        // Inspiración (2s) y espiración (2s)
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 1.5); // Inspiración
        gainNode.gain.linearRampToValueAtTime(0.1, now + 2);   // Pausa
        gainNode.gain.linearRampToValueAtTime(0, now + 4);     // Espiración
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        
        source.start(now);
        source.stop(now + duration);
    }
    
    startAudioSimulation() {
        this.stopAudioSimulation();
        if (!this.state.audio) return;
        
        this.initAudio();
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        
        const system = this.db[this.state.system];
        
        if (system.audio === 'heart') {
            this.audioInterval = setInterval(() => this.playHeartbeat(), 1000); // 60 BPM
        } else if (system.audio === 'lungs') {
            this.audioInterval = setInterval(() => this.playBreathSound(), 4000); // 15 respiraciones/min
        } else if (system.audio === 'bowel') {
            this.audioInterval = setInterval(() => {
                if (Math.random() > 0.7) {
                    this.playBowelSound();
                }
            }, 3000);
        }
    }
    
    playBowelSound() {
        if (!this.state.audio || !this.audioCtx) return;
        
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.value = 50 + Math.random() * 100;
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 0.35);
    }
    
    stopAudioSimulation() {
        if (this.audioInterval) {
            clearInterval(this.audioInterval);
            this.audioInterval = null;
        }
    }
    
    toggleAudio() {
        this.state.audio = !this.state.audio;
        if (this.state.audio) {
            this.startAudioSimulation();
        } else {
            this.stopAudioSimulation();
        }
        this.updateView();
    }
    
    // ==================== INTERFAZ DE USUARIO ====================
    render() {
        const system = this.db[this.state.system];
        const isEs = this.state.lang === 'es';
        
        return `
            <div class="animate-fade-in">
                <!-- Header -->
                <div class="mb-8">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-2">
                                <i class="fas fa-heart-pulse text-brand-blue mr-3"></i>
                                ${this.title[this.state.lang]}
                            </h1>
                            <p class="text-gray-600 dark:text-gray-300">
                                ${isEs ? 'Sistema interactivo de anatomía clínica para estudiantes de enfermería' : 
                                        'Interactive clinical anatomy system for nursing students'}
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                                <span class="font-bold text-brand-blue">v${this.version}</span>
                                <span class="text-gray-500 mx-2">•</span>
                                <span class="text-gray-600 dark:text-gray-400">${system.label[this.state.lang]}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sistema de navegación -->
                    <div class="flex flex-wrap gap-2 mb-8">
                        ${Object.values(this.db).map(sys => `
                            <button onclick="window.nclexAnatomy.selectSystem('${sys.id}')"
                                class="px-5 py-3 rounded-xl font-bold transition-all transform active:scale-95 flex items-center gap-3
                                ${this.state.system === sys.id 
                                    ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg' 
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}"
                                style="${this.state.system === sys.id ? `border-left: 4px solid ${sys.color}` : ''}">
                                <i class="fas fa-${sys.id === 'cardio' ? 'heart' : 
                                                sys.id === 'resp' ? 'lungs' : 
                                                sys.id === 'neuro' ? 'brain' : 
                                                'stomach'}"></i>
                                ${sys.label[this.state.lang]}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Contenido principal -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Panel de visualización (2/3) -->
                    <div class="lg:col-span-2">
                        <div class="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 shadow-xl">
                            <!-- Grid overlay médico -->
                            <div class="absolute inset-0 opacity-5 pointer-events-none"
                                 style="background-image: 
                                     linear-gradient(90deg, transparent 79px, #ababab 79px, #ababab 81px, transparent 81px),
                                     linear-gradient(#eee .1em, transparent .1em);
                                     background-size: 100% 1.2em;">
                            </div>
                            
                            <!-- Imagen anatómica -->
                            <div class="relative p-8 flex items-center justify-center min-h-[500px]">
                                ${this.state.loading ? `
                                    <div class="text-center">
                                        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mb-4"></div>
                                        <p class="text-gray-600 dark:text-gray-400">${isEs ? 'Cargando anatomía...' : 'Loading anatomy...'}</p>
                                    </div>
                                ` : `
                                    <img src="${system.image}"
                                         alt="${system.label[this.state.lang]}"
                                         class="max-w-full max-h-[70vh] object-contain transition-transform duration-500"
                                         style="transform: scale(${this.state.zoom})"
                                         id="anatomy-image"
                                         onload="window.nclexAnatomy.imageLoaded()"
                                         onerror="window.nclexAnatomy.imageError()">
                                `}
                            </div>
                            
                            <!-- Marcadores interactivos -->
                            ${!this.state.loading ? `
                                <div class="absolute inset-0">
                                    ${Object.values(system.parts).map(part => `
                                        <button onclick="window.nclexAnatomy.selectPart('${part.id}')"
                                            class="absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-3 border-white cursor-pointer transition-all duration-300 z-10 group animate-pulse-slow
                                            ${this.state.selectedPart === part.id 
                                                ? 'bg-clinical-error scale-125 ring-4 ring-red-500/50 shadow-lg' 
                                                : 'bg-brand-blue/80 hover:scale-110 hover:bg-brand-blue'}"
                                            style="top: ${part.position.top}; left: ${part.position.left};
                                                   box-shadow: 0 0 0 4px rgba(0,122,255,0.3);">
                                            <div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-gray-700 z-20">
                                                ${part.name[this.state.lang]}
                                                <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                            <div class="w-full h-full flex items-center justify-center">
                                                <i class="fas fa-plus text-white text-xs"></i>
                                            </div>
                                        </button>
                                    `).join('')}
                                </div>
                            ` : ''}
                            
                            <!-- Controles flotantes -->
                            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 shadow-2xl z-20"
                                 id="anatomy-controls">
                                ${this.renderControls()}
                            </div>
                            
                            <!-- Indicador del sistema -->
                            <div class="absolute top-6 left-6 px-4 py-2 rounded-full bg-gradient-to-r ${this.state.system === 'cardio' ? 'from-red-500/20 to-red-600/20' :
                                                                                                          this.state.system === 'resp' ? 'from-blue-500/20 to-blue-600/20' :
                                                                                                          this.state.system === 'neuro' ? 'from-purple-500/20 to-purple-600/20' :
                                                                                                          'from-green-500/20 to-green-600/20'} border ${this.state.system === 'cardio' ? 'border-red-500/30' :
                                                                                                                                                          this.state.system === 'resp' ? 'border-blue-500/30' :
                                                                                                                                                          this.state.system === 'neuro' ? 'border-purple-500/30' :
                                                                                                                                                          'border-green-500/30'}">
                                <div class="flex items-center gap-3">
                                    <div class="w-3 h-3 rounded-full ${this.state.system === 'cardio' ? 'bg-red-500' :
                                                                        this.state.system === 'resp' ? 'bg-blue-500' :
                                                                        this.state.system === 'neuro' ? 'bg-purple-500' :
                                                                        'bg-green-500'} animate-pulse"></div>
                                    <span class="text-sm font-bold text-gray-800 dark:text-gray-200">${system.label[this.state.lang].toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Información del sistema -->
                        <div class="mt-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                <i class="fas fa-info-circle text-brand-blue mr-2"></i>
                                ${isEs ? 'Acerca del sistema' : 'About the system'}
                            </h3>
                            <p class="text-gray-700 dark:text-gray-300 mb-4">
                                ${system.description[this.state.lang]}
                            </p>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                ${Object.values(system.parts).map(part => `
                                    <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-blue dark:hover:border-brand-blue transition-colors cursor-pointer"
                                         onclick="window.nclexAnatomy.selectPart('${part.id}')">
                                        <div class="font-bold text-gray-900 dark:text-white text-sm mb-1">${part.name[this.state.lang]}</div>
                                        <div class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">${part.clinical[this.state.lang].substring(0, 80)}...</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Panel lateral de detalles (1/3) -->
                    <div class="lg:col-span-1">
                        ${this.renderDetailPanel()}
                    </div>
                </div>
                
                <!-- Footer educativo -->
                <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                <i class="fas fa-graduation-cap text-brand-blue mr-2"></i>
                                ${isEs ? 'Recursos para estudiantes' : 'Student Resources'}
                            </h4>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">
                                ${isEs ? 'Este módulo está diseñado específicamente para el examen NCLEX-RN. Todas las imágenes son de dominio público de Wikimedia Commons.' :
                                        'This module is specifically designed for the NCLEX-RN exam. All images are public domain from Wikimedia Commons.'}
                            </p>
                        </div>
                        <div class="flex gap-4">
                            <button onclick="window.nclexAnatomy.printNotes()"
                                    class="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2">
                                <i class="fas fa-print"></i>
                                ${isEs ? 'Imprimir' : 'Print'}
                            </button>
                            <button onclick="window.nclexAnatomy.addAllToNotes()"
                                    class="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                                <i class="fas fa-save"></i>
                                ${isEs ? 'Guardar todo' : 'Save all'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderControls() {
        const isEs = this.state.lang === 'es';
        const system = this.db[this.state.system];
        
        return `
            <button onclick="window.nclexAnatomy.toggleAudio()" 
                    class="flex items-center gap-3 px-4 py-2 rounded-xl transition-all transform active:scale-95
                    ${this.state.audio 
                        ? 'bg-clinical-success text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}"
                    title="${system.audio ? (isEs ? 'Activar sonidos' : 'Toggle sounds') : (isEs ? 'Sin sonido disponible' : 'No audio available')}"
                    ${!system.audio ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                <i class="fas ${this.state.audio ? 'fa-volume-high' : 'fa-volume-off'} text-lg"></i>
                <span class="font-medium hidden sm:inline">${isEs ? 'Sonido' : 'Audio'}</span>
            </button>
            
            <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl">
                <button onclick="window.nclexAnatomy.zoom(-0.1)"
                        class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                    <i class="fas fa-search-minus"></i>
                </button>
                <div class="w-16 text-center">
                    <span class="text-sm font-bold text-gray-900 dark:text-white">${Math.round(this.state.zoom * 100)}%</span>
                </div>
                <button onclick="window.nclexAnatomy.zoom(0.1)"
                        class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                    <i class="fas fa-search-plus"></i>
                </button>
            </div>
            
            <button onclick="window.nclexAnatomy.resetView()"
                    class="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2">
                <i class="fas fa-rotate"></i>
                <span class="hidden sm:inline">${isEs ? 'Reiniciar' : 'Reset'}</span>
            </button>
        `;
    }
    
    renderDetailPanel() {
        const system = this.db[this.state.system];
        const part = this.state.selectedPart ? system.parts[this.state.selectedPart] : null;
        const isEs = this.state.lang === 'es';
        
        if (!part) {
            return `
                <div class="sticky top-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-2xl p-8 shadow-xl h-[600px] flex flex-col items-center justify-center text-center">
                    <div class="w-24 h-24 bg-gradient-to-br from-brand-blue/20 to-blue-600/20 rounded-full flex items-center justify-center mb-6">
                        <i class="fas fa-search text-4xl text-brand-blue"></i>
                    </div>
                    <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-4">
                        ${isEs ? 'Explora la anatomía' : 'Explore anatomy'}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
                        ${isEs ? 
                            'Haz clic en cualquier marcador 🔵 para ver información clínica detallada, puntos NCLEX y protocolos de enfermería.' :
                            'Click any blue marker 🔵 to view detailed clinical information, NCLEX points, and nursing protocols.'}
                    </p>
                    <div class="space-y-4 w-full max-w-sm">
                        <div class="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <div class="w-3 h-3 bg-clinical-success rounded-full animate-pulse"></div>
                            <span class="text-sm text-gray-700 dark:text-gray-300">${isEs ? 'Información clínica' : 'Clinical information'}</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <div class="w-3 h-3 bg-clinical-warning rounded-full animate-pulse"></div>
                            <span class="text-sm text-gray-700 dark:text-gray-300">${isEs ? 'Puntos clave NCLEX' : 'NCLEX key points'}</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <div class="w-3 h-3 bg-clinical-error rounded-full animate-pulse"></div>
                            <span class="text-sm text-gray-700 dark:text-gray-300">${isEs ? 'Intervenciones de enfermería' : 'Nursing interventions'}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="sticky top-6 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden shadow-xl h-[600px] flex flex-col">
                <!-- Encabezado -->
                <div class="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h2 class="text-2xl font-black text-white mb-2">${part.name[this.state.lang]}</h2>
                            <div class="flex items-center gap-3">
                                <span class="text-xs font-bold bg-clinical-error/20 text-clinical-error px-2 py-1 rounded">
                                    ${isEs ? 'PRIORIDAD' : 'PRIORITY'}
                                </span>
                                <span class="text-xs text-gray-400">${system.label[this.state.lang]}</span>
                            </div>
                        </div>
                        <button onclick="window.nclexAnatomy.closePanel()"
                                class="text-gray-400 hover:text-white transition-colors">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- Pestañas -->
                    <div class="flex border-b border-gray-700">
                        <button onclick="window.nclexAnatomy.setTab('clinical')"
                                class="flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2
                                ${this.state.tab === 'clinical' 
                                    ? 'text-white border-b-2 border-clinical-success' 
                                    : 'text-gray-400 hover:text-gray-300'}"
                                style="${this.state.tab === 'clinical' ? 'background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)' : ''}">
                            <i class="fas fa-stethoscope"></i>
                            ${isEs ? 'Clínico' : 'Clinical'}
                        </button>
                        <button onclick="window.nclexAnatomy.setTab('nclex')"
                                class="flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2
                                ${this.state.tab === 'nclex' 
                                    ? 'text-white border-b-2 border-clinical-warning' 
                                    : 'text-gray-400 hover:text-gray-300'}"
                                style="${this.state.tab === 'nclex' ? 'background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)' : ''}">
                            <i class="fas fa-graduation-cap"></i>
                            NCLEX
                        </button>
                        <button onclick="window.nclexAnatomy.setTab('nursing')"
                                class="flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2
                                ${this.state.tab === 'nursing' 
                                    ? 'text-white border-b-2 border-clinical-error' 
                                    : 'text-gray-400 hover:text-gray-300'}"
                                style="${this.state.tab === 'nursing' ? 'background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)' : ''}">
                            <i class="fas fa-user-nurse"></i>
                            ${isEs ? 'Enfermería' : 'Nursing'}
                        </button>
                    </div>
                </div>
                
                <!-- Contenido con scroll -->
                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    ${this.state.tab === 'clinical' ? this.renderClinicalContent(part) :
                      this.state.tab === 'nclex' ? this.renderNCLEXContent(part) :
                      this.renderNursingContent(part)}
                </div>
                
                <!-- Acciones rápidas -->
                <div class="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <div class="flex gap-3">
                        <button onclick="window.nclexAnatomy.addToNotes(part)"
                                class="flex-1 py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                            <i class="fas fa-note-sticky"></i>
                            ${isEs ? 'Añadir a notas' : 'Add to notes'}
                        </button>
                        <button onclick="window.nclexAnatomy.flashcard(part)"
                                class="px-4 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 transition-colors"
                                title="${isEs ? 'Crear tarjeta de estudio' : 'Create study card'}">
                            <i class="fas fa-layer-group"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderClinicalContent(part) {
        const isEs = this.state.lang === 'es';
        return `
            <div class="space-y-6">
                <div class="p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/20">
                    <h4 class="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase mb-3 flex items-center">
                        <i class="fas fa-microscope mr-2"></i>
                        ${isEs ? 'ANATOMÍA Y FISIOLOGÍA' : 'ANATOMY & PHYSIOLOGY'}
                    </h4>
                    <p class="text-gray-800 dark:text-gray-200 leading-relaxed">${part.clinical[this.state.lang]}</p>
                </div>
                
                <div class="p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-900/20">
                    <h4 class="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase mb-3 flex items-center">
                        <i class="fas fa-vial mr-2"></i>
                        ${isEs ? 'PRUEBAS DE LABORATORIO' : 'LABORATORY TESTS'}
                    </h4>
                    <div class="space-y-2">
                        ${part.labs.split(', ').map(lab => `
                            <div class="flex items-center gap-3 p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                                <i class="fas fa-flask text-purple-500"></i>
                                <span class="font-mono text-sm text-gray-800 dark:text-gray-200">${lab}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                ${part.diseases ? `
                    <div class="p-4 rounded-xl border-2 border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20">
                        <h4 class="text-sm font-bold text-red-700 dark:text-red-400 uppercase mb-3 flex items-center">
                            <i class="fas fa-disease mr-2"></i>
                            ${isEs ? 'CONDICIONES RELACIONADAS' : 'RELATED CONDITIONS'}
                        </h4>
                        <div class="flex flex-wrap gap-2">
                            ${part.diseases.map(disease => `
                                <span class="px-3 py-1 bg-white/50 dark:bg-black/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium border border-red-300 dark:border-red-700">
                                    ${disease}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    renderNCLEXContent(part) {
        const isEs = this.state.lang === 'es';
        return `
            <div class="space-y-6">
                <div class="p-4 rounded-xl border-2 border-yellow-200 dark:border-yellow-800/50 bg-yellow-50 dark:bg-yellow-900/20">
                    <h4 class="text-sm font-bold text-yellow-700 dark:text-yellow-400 uppercase mb-3 flex items-center">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        ${isEs ? 'PUNTO CRÍTICO NCLEX' : 'NCLEX CRITICAL POINT'}
                    </h4>
                    <p class="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">${part.nclex[this.state.lang]}</p>
                </div>
                
                ${part.nclexTips ? `
                    <div class="p-4 rounded-xl border-2 border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-900/20">
                        <h4 class="text-sm font-bold text-orange-700 dark:text-orange-400 uppercase mb-3 flex items-center">
                            <i class="fas fa-lightbulb mr-2"></i>
                            ${isEs ? 'CONSEJOS PARA EL EXAMEN' : 'EXAM TIPS'}
                        </h4>
                        <ul class="space-y-3">
                            ${part.nclexTips.map(tip => `
                                <li class="flex items-start gap-3">
                                    <i class="fas fa-check text-green-500 mt-1"></i>
                                    <span class="text-gray-800 dark:text-gray-200 text-sm">${tip}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
                    <h4 class="text-sm font-bold text-gray-700 dark:text-gray-400 uppercase mb-3 flex items-center">
                        <i class="fas fa-clipboard-question mr-2"></i>
                        ${isEs ? 'POSIBLES PREGUNTAS' : 'POSSIBLE QUESTIONS'}
                    </h4>
                    <div class="space-y-4">
                        <div class="p-3 bg-white dark:bg-gray-900 rounded-lg">
                            <p class="text-sm text-gray-700 dark:text-gray-300 italic mb-2">
                                ${isEs ? 'Un paciente presenta... ¿Cuál es tu PRIORIDAD de acción?' : 
                                        'A patient presents with... What is your PRIORITY action?'}
                            </p>
                            <div class="text-xs text-gray-500 dark:text-gray-400">
                                ${isEs ? 'Tema frecuente en NCLEX' : 'Frequent NCLEX topic'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderNursingContent(part) {
        const isEs = this.state.lang === 'es';
        return `
            <div class="space-y-6">
                <div class="p-4 rounded-xl border-2 border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-900/20">
                    <h4 class="text-sm font-bold text-green-700 dark:text-green-400 uppercase mb-3 flex items-center">
                        <i class="fas fa-procedures mr-2"></i>
                        ${isEs ? 'INTERVENCIONES DE ENFERMERÍA' : 'NURSING INTERVENTIONS'}
                    </h4>
                    <ul class="space-y-3">
                        ${part.interventions.map((intervention, index) => `
                            <li class="flex items-start gap-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                                <span class="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    ${index + 1}
                                </span>
                                <span class="text-gray-800 dark:text-gray-200">${intervention}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-900/20">
                    <h4 class="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase mb-3 flex items-center">
                        <i class="fas fa-chart-line mr-2"></i>
                        ${isEs ? 'MONITORIZACIÓN' : 'MONITORING'}
                    </h4>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="p-3 bg-white/50 dark:bg-black/20 rounded-lg text-center">
                            <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">q4h</div>
                            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">${isEs ? 'Signos vitales' : 'Vital signs'}</div>
                        </div>
                        <div class="p-3 bg-white/50 dark:bg-black/20 rounded-lg text-center">
                            <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">q8h</div>
                            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">${isEs ? 'Evaluación' : 'Assessment'}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ==================== MÉTODOS PRINCIPALES ====================
    selectSystem(systemId) {
        if (this.db[systemId]) {
            this.state.system = systemId;
            this.state.selectedPart = null;
            this.state.zoom = 1;
            this.state.loading = true;
            this.stopAudioSimulation();
            this.state.audio = false;
            this.updateView();
        }
    }
    
    selectPart(partId) {
        const system = this.db[this.state.system];
        if (system.parts[partId]) {
            this.state.selectedPart = partId;
            this.state.tab = 'clinical';
            this.updateView();
        }
    }
    
    toggleAudio() {
        const system = this.db[this.state.system];
        if (!system.audio) return;
        
        this.state.audio = !this.state.audio;
        if (this.state.audio) {
            this.startAudioSimulation();
        } else {
            this.stopAudioSimulation();
        }
        this.updateView();
    }
    
    closePanel() {
        this.state.selectedPart = null;
        this.updateView();
    }
    
    setTab(tab) {
        this.state.tab = tab;
        this.updateView();
    }
    
    zoom(amount) {
        const newZoom = this.state.zoom + amount;
        this.state.zoom = Math.max(0.5, Math.min(3, newZoom));
        this.updateView();
    }
    
    resetView() {
        this.state.zoom = 1;
        this.updateView();
    }
    
    imageLoaded() {
        this.state.loading = false;
        this.updateView();
    }
    
    imageError() {
        this.state.loading = false;
        // Si la imagen falla, usar una alternativa
        this.db[this.state.system].image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Simple_diagram_of_heart_%28cropped%29.svg/800px-Simple_diagram_of_heart_%28cropped%29.svg.png';
        this.updateView();
    }
    
    addToNotes(part) {
        const isEs = this.state.lang === 'es';
        const system = this.db[this.state.system];
        
        const note = {
            title: `${system.label[this.state.lang]} - ${part.name[this.state.lang]}`,
            content: `
📌 **${isEs ? 'Información Clínica' : 'Clinical Information'}:** ${part.clinical[this.state.lang]}

🚨 **${isEs ? 'Punto NCLEX' : 'NCLEX Point'}:** ${part.nclex[this.state.lang]}

🔬 **${isEs ? 'Pruebas de Laboratorio' : 'Laboratory Tests'}:** ${part.labs}

💊 **${isEs ? 'Intervenciones' : 'Interventions'}:**
${part.interventions.map(int => `• ${int}`).join('\n')}

📅 ${isEs ? 'Fecha' : 'Date'}: ${new Date().toLocaleDateString()}
            `,
            timestamp: new Date().toISOString(),
            tags: ['anatomía', system.id, part.id]
        };
        
        // Guardar en el sistema de notas
        if (window.nclexApp && window.nclexApp.addNote) {
            window.nclexApp.addNote(note);
        } else {
            // Fallback: guardar en localStorage
            const notes = JSON.parse(localStorage.getItem('nclex-notes') || '[]');
            notes.push(note);
            localStorage.setItem('nclex-notes', JSON.stringify(notes));
            
            // Mostrar notificación
            this.showNotification(isEs ? 'Añadido a notas' : 'Added to notes');
        }
    }
    
    flashcard(part) {
        const isEs = this.state.lang === 'es';
        const flashcard = {
            front: `${part.name[this.state.lang]}`,
            back: `
${part.clinical[this.state.lang]}

${isEs ? 'Punto NCLEX:' : 'NCLEX Point:'} ${part.nclex[this.state.lang]}
            `,
            category: this.db[this.state.system].label[this.state.lang]
        };
        
        // Guardar tarjeta de estudio
        const flashcards = JSON.parse(localStorage.getItem('nclex-flashcards') || '[]');
        flashcards.push(flashcard);
        localStorage.setItem('nclex-flashcards', JSON.stringify(flashcards));
        
        this.showNotification(isEs ? 'Tarjeta creada' : 'Flashcard created');
    }
    
    showNotification(message) {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = 'fixed top-6 right-6 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-2xl z-[100] animate-fade-in';
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas fa-check-circle text-xl"></i>
                <span class="font-bold">${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('animate-fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    updateView() {
        const appView = document.getElementById('app-view');
        if (appView) {
            appView.innerHTML = this.render();
        }
    }
    
    init() {
        console.log('🚀 Anatomy Titanium v12.0 initialized');
        this.updateView();
        
        // Añadir estilos CSS adicionales
        this.injectStyles();
    }
    
    injectStyles() {
        const styleId = 'anatomy-styles';
        if (document.getElementById(styleId)) return;
        
        const styles = `
            <style id="${styleId}">
                .animate-pulse-slow {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 3px;
                }
                
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4b5563;
                }
                
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fade-out {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(10px); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
                
                .animate-fade-out {
                    animation: fade-out 0.3s ease-out forwards;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// ==================== INTEGRACIÓN CON EL SISTEMA PRINCIPAL ====================
(function() {
    // Crear instancia
    window.nclexAnatomy = new AnatomyTitanium();
    
    // Integrar con el sistema NCLEX
    if (window.nclexApp) {
        // Registrar como módulo
        window.nclexApp.registerModule({
            id: 'anatomy',
            title: { es: 'Anatomía Clínica', en: 'Clinical Anatomy' },
            icon: 'heart-pulse',
            color: 'blue',
            render: () => {
                setTimeout(() => window.nclexAnatomy.init(), 100);
                return window.nclexAnatomy.render();
            }
        });
        
        // Sincronizar idioma
        window.nclexAnatomy.state.lang = window.nclexApp.state.lang;
    }
    
    // Inyectar botón en la navegación si no existe
    const injectButton = () => {
        const nav = document.getElementById('topics-nav');
        if (!nav || document.getElementById('btn-anatomy')) return;
        
        const button = document.createElement('button');
        button.id = 'btn-anatomy';
        button.className = 'nav-btn w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-300 group';
        button.onclick = () => {
            if (window.nclexApp) {
                window.nclexApp.navigate('anatomy');
            } else {
                const appView = document.getElementById('app-view');
                appView.innerHTML = window.nclexAnatomy.render();
                window.nclexAnatomy.init();
            }
        };
        
        button.innerHTML = `
            <div class="w-6 flex justify-center">
                <i class="fa-solid fa-heart-pulse text-xl text-brand-blue group-hover:scale-110 transition-transform"></i>
            </div>
            <span class="hidden lg:block text-base font-bold">Anatomía Clínica</span>
        `;
        
        nav.appendChild(button);
    };
    
    // Intentar inyectar varias veces (por si el DOM no está listo)
    let attempts = 0;
    const tryInject = setInterval(() => {
        injectButton();
        attempts++;
        if (attempts > 10 || document.getElementById('btn-anatomy')) {
            clearInterval(tryInject);
        }
    }, 500);
    
    console.log('✅ Anatomy module loaded successfully');
})();
