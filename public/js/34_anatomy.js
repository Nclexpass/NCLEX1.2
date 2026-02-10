// ============================================================================
// ANATOMY MASTERCLASS "TITANIUM" v12.0 - Professional Refactored Version
// ============================================================================
// 🏥 MODULO: Anatomía Clínica Interactiva para NCLEX
// 🎯 Características: Audio procedural, inyección de datos clínicos, diseño responsivo
// 📚 Mantenibilidad: Código modular, arquitectura limpia, documentación completa
// ============================================================================

/**
 * Clase principal del módulo de Anatomía Clínica
 * Sistema interactivo para estudio de anatomía con enfoque en enfermería
 */
class NCLEXAnatomyMaster {
  constructor() {
    this.id = 'clinical-anatomy';
    this.version = '12.0';
    this.isInitialized = false;
    
    // Estado de la aplicación
    this.state = this.initializeState();
    
    // Base de datos médica
    this.medicalDatabase = this.createMedicalDatabase();
    
    // Sistema de audio
    this.audioEngine = null;
    this.audioIntervals = new Set();
    
    // Referencias DOM
    this.domRefs = {
      appView: null,
      controls: null,
      panel: null
    };
    
    // Configuración de UI
    this.uiConfig = {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        dark: '#1f2937'
      },
      animations: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    };
    
    this.bindMethods();
  }

  /**
   * Inicializa el estado de la aplicación
   */
  initializeState() {
    return {
      currentSystem: 'cardio',
      selectedComponent: null,
      language: localStorage.getItem('nclex-language') || 'es',
      audioEnabled: false,
      activeTab: 'clinical',
      zoomLevel: 1,
      isLoading: false
    };
  }

  /**
   * Crea la base de datos médica estructurada
   */
  createMedicalDatabase() {
    return {
      cardio: this.createCardiovascularSystem(),
      resp: this.createRespiratorySystem(),
      neuro: this.createNeurologicalSystem(),
      gi: this.createGastrointestinalSystem()
    };
  }

  /**
   * Sistema cardiovascular
   */
  createCardiovascularSystem() {
    return {
      id: 'cardio',
      label: { es: 'Cardiovascular', en: 'Cardiovascular' },
      description: {
        es: 'Sistema circulatorio y cardíaco',
        en: 'Circulatory and cardiac system'
      },
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Heart_anterior_exterior_view.jpg/800px-Heart_anterior_exterior_view.jpg',
      audioProfile: 'heart',
      components: {
        'aorta': {
          id: 'aorta',
          name: { es: 'Arco Aórtico', en: 'Aortic Arch' },
          position: { top: '12%', left: '52%' },
          clinicalData: {
            pathophysiology: {
              es: 'Punto de máxima presión sistémica. Auscultación: 2do espacio intercostal derecho.',
              en: 'Point of max systemic pressure. Auscultation: 2nd ICS Right Sternal Border.'
            },
            priorityActions: {
              es: '🚨 DISECCIÓN AÓRTICA: Dolor "desgarrante" en espalda. Diferencia de PA >20mmHg entre brazos. Emergencia Quirúrgica.',
              en: '🚨 AORTIC DISSECTION: "Tearing" back pain. BP diff >20mmHg between arms. Surgical Emergency.'
            },
            labs: 'BNP, Troponin I/T, CK-MB',
            interventions: [
              'Monitorizar signos vitales cada 15 min en caso inestable',
              'Evaluar pulsos periféricos',
              'Preparar para intervención quirúrgica de emergencia'
            ]
          }
        },
        'lv': {
          id: 'lv',
          name: { es: 'Ventrículo Izquierdo', en: 'Left Ventricle' },
          position: { top: '60%', left: '68%' },
          clinicalData: {
            pathophysiology: {
              es: 'Cámara de bombeo principal. Pared muscular gruesa (hipertrofia en HTA).',
              en: 'Main pump. Thick wall (hypertrophy in HTN).'
            },
            priorityActions: {
              es: '⚠️ FALLA IZQUIERDA = PULMONES. Disnea, Ortopnea, Crepitantes, Esputo Rosado (Edema Agudo).',
              en: '⚠️ LEFT FAILURE = LUNGS. Dyspnea, Orthopnea, Crackles, Pink Frothy Sputum.'
            },
            labs: 'Ecocardiograma (FE < 40% = ICrFE)',
            interventions: [
              'Administrar diuréticos según prescripción',
              'Posición de Fowler alta',
              'Monitorizar saturación de oxígeno'
            ]
          }
        }
      }
    };
  }

  /**
   * Sistema respiratorio
   */
  createRespiratorySystem() {
    return {
      id: 'resp',
      label: { es: 'Respiratorio', en: 'Respiratory' },
      description: {
        es: 'Sistema pulmonar y vías respiratorias',
        en: 'Pulmonary system and airways'
      },
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Lungs_diagram_detailed.svg/800px-Lungs_diagram_detailed.svg.png',
      audioProfile: 'lungs',
      components: {
        'trachea': {
          id: 'trachea',
          name: { es: 'Tráquea', en: 'Trachea' },
          position: { top: '10%', left: '48%' },
          clinicalData: {
            pathophysiology: {
              es: 'Vía aérea permeable. Anillos cartilaginosos.',
              en: 'Patent airway. Cartilaginous rings.'
            },
            priorityActions: {
              es: '🚨 DESVIACIÓN TRAQUEAL: Signo tardío de Neumotórax a Tensión. Desviación hacia el lado SANO.',
              en: '🚨 TRACHEAL DEVIATION: Late sign of Tension Pneumothorax. Deviates to HEALTHY side.'
            },
            labs: 'Gasometría arterial (pH, pCO2, pO2)',
            interventions: [
              'Mantener vía aérea permeable',
              'Preparar para toracostomía',
              'Administrar oxígeno de alto flujo'
            ]
          }
        }
      }
    };
  }

  /**
   * Sistema neurológico
   */
  createNeurologicalSystem() {
    return {
      id: 'neuro',
      label: { es: 'Neurológico', en: 'Neurological' },
      description: {
        es: 'Sistema nervioso central y periférico',
        en: 'Central and peripheral nervous system'
      },
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Lobes_of_the_brain_NL.svg/800px-Lobes_of_the_brain_NL.svg.png',
      audioProfile: null,
      components: {
        'frontal': {
          id: 'frontal',
          name: { es: 'Lóbulo Frontal', en: 'Frontal Lobe' },
          position: { top: '25%', left: '20%' },
          clinicalData: {
            pathophysiology: {
              es: 'Personalidad, Juicio, Control Motor, Área de Broca (Habla).',
              en: 'Personality, Judgment, Motor, Broca\'s Area (Speech).'
            },
            priorityActions: {
              es: '⚠️ CAMBIOS DE CONDUCTA: A menudo el primer signo de hipoxia o HIC (Hipertensión Intracraneal).',
              en: '⚠️ BEHAVIOR CHANGES: Often first sign of Hypoxia or IICP.'
            },
            labs: 'Escala de Glasgow (GCS < 8 = Intubar)',
            interventions: [
              'Evaluar nivel de conciencia cada hora',
              'Monitorizar pupilas',
              'Evitar estímulos luminosos y sonoros intensos'
            ]
          }
        }
      }
    };
  }

  /**
   * Sistema gastrointestinal
   */
  createGastrointestinalSystem() {
    return {
      id: 'gi',
      label: { es: 'Gastrointestinal', en: 'Gastrointestinal' },
      description: {
        es: 'Sistema digestivo y órganos asociados',
        en: 'Digestive system and associated organs'
      },
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Digestive_system_diagram_en.svg/800px-Digestive_system_diagram_en.svg.png',
      audioProfile: 'bowel',
      components: {
        'liver': {
          id: 'liver',
          name: { es: 'Hígado', en: 'Liver' },
          position: { top: '40%', left: '38%' },
          clinicalData: {
            pathophysiology: {
              es: 'Metabolismo, Coagulación, Albúmina, Detoxificación.',
              en: 'Metabolism, Clotting, Albumin, Detox.'
            },
            priorityActions: {
              es: '⚠️ CIRROSIS: Sangrado (TP/INR alto), Encefalopatía (Amonio alto -> Lactulosa), Ascitis.',
              en: '⚠️ CIRRHOSIS: Bleeding (High PT/INR), Encephalopathy (High Ammonia -> Lactulose), Ascites.'
            },
            labs: 'ALT, AST, Bilirrubina, Amonio, Albúmina',
            interventions: [
              'Restricción de proteínas en dieta',
              'Administrar lactulosa según prescripción',
              'Monitorizar signos de sangrado'
            ]
          }
        }
      }
    };
  }

  /**
   * Vincula los métodos a la instancia
   */
  bindMethods() {
    this.methods = [
      'switchSystem',
      'selectAnatomicalComponent',
      'toggleAudio',
      'closeDetailPanel',
      'switchTab',
      'adjustZoom',
      'render',
      'initialize',
      'destroy'
    ];

    this.methods.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  /**
   * Inicializa el motor de audio
   */
  initializeAudioEngine() {
    if (!this.audioEngine && window.AudioContext) {
      this.audioEngine = new (window.AudioContext || window.webkitAudioContext)();
      
      // Configurar nodos de audio comunes
      this.audioNodes = {
        masterGain: this.audioEngine.createGain(),
        compressor: this.audioEngine.createDynamicsCompressor()
      };
      
      // Configurar cadena de audio
      this.audioNodes.compressor.connect(this.audioNodes.masterGain);
      this.audioNodes.masterGain.connect(this.audioEngine.destination);
      this.audioNodes.masterGain.gain.value = 0.3;
    }
  }

  /**
   * Genera sonido cardíaco
   */
  generateHeartSound() {
    if (!this.state.audioEnabled || !this.audioEngine) return;

    const now = this.audioEngine.currentTime;
    
    // S1 (Lub) - frecuencia baja
    const s1Oscillator = this.audioEngine.createOscillator();
    const s1Gain = this.audioEngine.createGain();
    
    s1Oscillator.type = 'triangle';
    s1Oscillator.frequency.setValueAtTime(60, now);
    
    s1Gain.gain.setValueAtTime(0, now);
    s1Gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
    s1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    s1Oscillator.connect(s1Gain);
    s1Gain.connect(this.audioNodes.compressor);
    
    s1Oscillator.start(now);
    s1Oscillator.stop(now + 0.25);
    
    // S2 (Dub) - frecuencia más alta, ligeramente después
    const s2Oscillator = this.audioEngine.createOscillator();
    const s2Gain = this.audioEngine.createGain();
    
    s2Oscillator.type = 'sine';
    s2Oscillator.frequency.setValueAtTime(90, now + 0.35);
    
    s2Gain.gain.setValueAtTime(0, now + 0.35);
    s2Gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
    s2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    s2Oscillator.connect(s2Gain);
    s2Gain.connect(this.audioNodes.compressor);
    
    s2Oscillator.start(now + 0.35);
    s2Oscillator.stop(now + 0.55);
  }

  /**
   * Genera sonido respiratorio
   */
  generateBreathSound() {
    if (!this.state.audioEnabled || !this.audioEngine) return;

    const now = this.audioEngine.currentTime;
    const bufferSize = this.audioEngine.sampleRate * 3; // 3 segundos
    const buffer = this.audioEngine.createBuffer(1, bufferSize, this.audioEngine.sampleRate);
    const output = buffer.getChannelData(0);
    
    // Generar ruido blanco
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = this.audioEngine.createBufferSource();
    noiseSource.buffer = buffer;
    
    // Filtro para simular sonido respiratorio
    const filter = this.audioEngine.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 1;
    
    const gainNode = this.audioEngine.createGain();
    
    // Envolvente de respiración
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 1.2); // Inspiración
    gainNode.gain.linearRampToValueAtTime(0, now + 2.4);   // Espiración
    
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioNodes.compressor);
    
    noiseSource.start(now);
    noiseSource.stop(now + 2.5);
  }

  /**
   * Inicia la simulación de audio según el sistema actual
   */
  startAudioSimulation() {
    this.stopAudioSimulation();
    
    if (!this.state.audioEnabled) return;
    
    this.initializeAudioEngine();
    
    const currentSystem = this.medicalDatabase[this.state.currentSystem];
    
    switch (currentSystem.audioProfile) {
      case 'heart':
        this.audioIntervals.add(
          setInterval(() => this.generateHeartSound(), 1000)
        );
        break;
        
      case 'lungs':
        this.audioIntervals.add(
          setInterval(() => this.generateBreathSound(), 4000)
        );
        break;
        
      case 'bowel':
        this.audioIntervals.add(
          setInterval(() => {
            if (Math.random() > 0.7) {
              this.generateBowelSound();
            }
          }, 3000)
        );
        break;
    }
  }

  /**
   * Genera sonido intestinal
   */
  generateBowelSound() {
    if (!this.state.audioEnabled || !this.audioEngine) return;

    const now = this.audioEngine.currentTime;
    const osc = this.audioEngine.createOscillator();
    const gain = this.audioEngine.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(50 + Math.random() * 150, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.connect(gain);
    gain.connect(this.audioNodes.compressor);
    
    osc.start(now);
    osc.stop(now + 0.35);
  }

  /**
   * Detiene todas las simulaciones de audio
   */
  stopAudioSimulation() {
    this.audioIntervals.forEach(interval => clearInterval(interval));
    this.audioIntervals.clear();
    
    if (this.audioEngine && this.audioEngine.state !== 'closed') {
      this.audioEngine.suspend();
    }
  }

  /**
   * Renderiza la interfaz principal
   */
  render() {
    const currentSystem = this.medicalDatabase[this.state.currentSystem];
    const isSpanish = this.state.language === 'es';
    
    return `
      <div class="anatomy-master-container">
        <!-- Barra de sistemas -->
        <nav class="system-navigation">
          <div class="system-label">
            <i class="fas fa-layer-group"></i>
            ${isSpanish ? 'SISTEMAS ANATÓMICOS' : 'ANATOMICAL SYSTEMS'}
          </div>
          <div class="system-buttons">
            ${Object.values(this.medicalDatabase).map(system => `
              <button class="system-button ${this.state.currentSystem === system.id ? 'active' : ''}"
                      data-system="${system.id}"
                      onclick="window.NCLEXAnatomy.switchSystem('${system.id}')">
                ${system.label[this.state.language]}
              </button>
            `).join('')}
          </div>
        </nav>

        <!-- Área principal -->
        <main class="anatomy-workspace">
          <!-- Panel de visualización -->
          <div class="visualization-panel">
            <div class="image-grid-overlay"></div>
            
            <img src="${currentSystem.imageUrl}" 
                 alt="${currentSystem.label[this.state.language]}"
                 class="anatomy-image"
                 style="transform: scale(${this.state.zoomLevel})">
            
            <!-- Marcadores anatómicos -->
            <div class="anatomical-markers">
              ${Object.values(currentSystem.components).map(component => `
                <button class="anatomy-marker ${this.state.selectedComponent === component.id ? 'selected' : ''}"
                        data-component="${component.id}"
                        style="top: ${component.position.top}; left: ${component.position.left};"
                        onclick="window.NCLEXAnatomy.selectAnatomicalComponent('${component.id}')">
                  <div class="marker-dot"></div>
                  <span class="marker-label">${component.name[this.state.language]}</span>
                </button>
              `).join('')}
            </div>

            <!-- Controles flotantes -->
            <div class="floating-controls" id="anatomy-controls">
              ${this.renderControls()}
            </div>

            <!-- Indicador de estado -->
            <div class="status-indicator">
              <span class="status-dot"></span>
              SISTEMA ACTIVO
            </div>
          </div>

          <!-- Panel lateral de detalles -->
          <aside class="detail-panel ${this.state.selectedComponent ? 'visible' : ''}">
            ${this.state.selectedComponent ? this.renderDetailPanel() : this.renderEmptyState()}
          </aside>
        </main>
      </div>
    `;
  }

  /**
   * Renderiza los controles de la interfaz
   */
  renderControls() {
    return `
      <button class="control-button ${this.state.audioEnabled ? 'active' : ''}"
              onclick="window.NCLEXAnatomy.toggleAudio()"
              title="${this.state.language === 'es' ? 'Simulación de audio' : 'Audio simulation'}">
        <i class="fas fa-heart-pulse"></i>
      </button>
      
      <div class="control-separator"></div>
      
      <button class="control-button"
              onclick="window.NCLEXAnatomy.adjustZoom(-0.1)"
              title="${this.state.language === 'es' ? 'Alejar' : 'Zoom out'}">
        <i class="fas fa-minus"></i>
      </button>
      
      <button class="control-button"
              onclick="window.NCLEXAnatomy.adjustZoom(0.1)"
              title="${this.state.language === 'es' ? 'Acercar' : 'Zoom in'}">
        <i class="fas fa-plus"></i>
      </button>
    `;
  }

  /**
   * Renderiza el panel de detalles
   */
  renderDetailPanel() {
    const currentSystem = this.medicalDatabase[this.state.currentSystem];
    const component = currentSystem.components[this.state.selectedComponent];
    const isSpanish = this.state.language === 'es';
    
    return `
      <div class="detail-content">
        <!-- Encabezado -->
        <header class="detail-header">
          <h2>${component.name[this.state.language]}</h2>
          <button class="close-button" onclick="window.NCLEXAnatomy.closeDetailPanel()">
            <i class="fas fa-times"></i>
          </button>
          <span class="system-tag">${this.state.currentSystem.toUpperCase()}</span>
        </header>

        <!-- Pestañas -->
        <nav class="detail-tabs">
          <button class="tab-button ${this.state.activeTab === 'clinical' ? 'active' : ''}"
                  onclick="window.NCLEXAnatomy.switchTab('clinical')">
            <i class="fas fa-stethoscope"></i>
            ${isSpanish ? 'CLÍNICO' : 'CLINICAL'}
          </button>
          <button class="tab-button ${this.state.activeTab === 'nclex' ? 'active' : ''}"
                  onclick="window.NCLEXAnatomy.switchTab('nclex')">
            <i class="fas fa-graduation-cap"></i>
            NCLEX
          </button>
        </nav>

        <!-- Contenido de pestañas -->
        <div class="tab-content">
          ${this.state.activeTab === 'clinical' ? this.renderClinicalContent(component) : this.renderNCLEXContent(component)}
        </div>
      </div>
    `;
  }

  /**
   * Renderiza contenido clínico
   */
  renderClinicalContent(component) {
    const isSpanish = this.state.language === 'es';
    
    return `
      <div class="clinical-content">
        <section class="info-card pathophysiology">
          <h3><i class="fas fa-microscope"></i> ${isSpanish ? 'FISIOPATOLOGÍA' : 'PATHOPHYSIOLOGY'}</h3>
          <p>${component.clinicalData.pathophysiology[this.state.language]}</p>
        </section>
        
        <section class="info-card diagnostics">
          <h3><i class="fas fa-vial"></i> ${isSpanish ? 'DIAGNÓSTICOS Y LABS' : 'DIAGNOSTICS & LABS'}</h3>
          <code>${component.clinicalData.labs}</code>
        </section>
        
        <section class="info-card interventions">
          <h3><i class="fas fa-procedures"></i> ${isSpanish ? 'INTERVENCIONES' : 'INTERVENTIONS'}</h3>
          <ul>
            ${component.clinicalData.interventions.map(intervention => `
              <li>${intervention}</li>
            `).join('')}
          </ul>
        </section>
      </div>
    `;
  }

  /**
   * Renderiza contenido NCLEX
   */
  renderNCLEXContent(component) {
    const isSpanish = this.state.language === 'es';
    
    return `
      <div class="nclex-content">
        <section class="priority-alert">
          <h3><i class="fas fa-exclamation-triangle"></i> ${isSpanish ? 'ACCIÓN PRIORITARIA' : 'PRIORITY ACTION'}</h3>
          <p>${component.clinicalData.priorityActions[this.state.language]}</p>
        </section>
        
        <section class="nursing-considerations">
          <h3><i class="fas fa-user-nurse"></i> ${isSpanish ? 'CONSIDERACIONES' : 'NURSING CONSIDERATIONS'}</h3>
          <ul>
            <li>${isSpanish ? 'Monitorizar signos vitales cada 15 min si inestable' : 'Monitor vital signs q15min if unstable'}</li>
            <li>${isSpanish ? 'Evaluar cambios en estado mental' : 'Assess for changes in LOC'}</li>
            <li>${isSpanish ? 'Asegurar acceso IV permeable' : 'Ensure patent IV access'}</li>
            <li>${isSpanish ? 'Documentar hallazgos anormales' : 'Document abnormal findings'}</li>
          </ul>
        </section>
      </div>
    `;
  }

  /**
   * Renderiza estado vacío del panel
   */
  renderEmptyState() {
    const isSpanish = this.state.language === 'es';
    
    return `
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-dna"></i>
        </div>
        <h3>${isSpanish ? 'SISTEMA PREPARADO' : 'SYSTEM READY'}</h3>
        <p>${isSpanish ? 'Selecciona una estructura anatómica para comenzar el análisis clínico.' : 'Select an anatomical structure to begin clinical analysis.'}</p>
      </div>
    `;
  }

  /**
   * Actualiza la interfaz
   */
  updateInterface() {
    if (!this.domRefs.appView) return;
    
    this.domRefs.appView.innerHTML = this.render();
    this.cacheDOMReferences();
    
    if (this.state.audioEnabled) {
      this.startAudioSimulation();
    }
  }

  /**
   * Cachea referencias DOM importantes
   */
  cacheDOMReferences() {
    this.domRefs.appView = document.getElementById('app-view');
    this.domRefs.controls = document.getElementById('anatomy-controls');
    this.domRefs.panel = document.querySelector('.detail-panel');
  }

  /**
   * Cambia el sistema anatómico actual
   */
  switchSystem(systemId) {
    if (!this.medicalDatabase[systemId] || this.state.isLoading) return;
    
    this.state.currentSystem = systemId;
    this.state.selectedComponent = null;
    this.state.audioEnabled = false;
    this.stopAudioSimulation();
    
    this.updateInterface();
  }

  /**
   * Selecciona un componente anatómico
   */
  selectAnatomicalComponent(componentId) {
    const currentSystem = this.medicalDatabase[this.state.currentSystem];
    
    if (!currentSystem.components[componentId]) return;
    
    this.state.selectedComponent = componentId;
    this.state.activeTab = 'clinical';
    this.updateInterface();
  }

  /**
   * Activa/desactiva el audio
   */
  toggleAudio() {
    this.state.audioEnabled = !this.state.audioEnabled;
    
    if (this.state.audioEnabled) {
      this.startAudioSimulation();
    } else {
      this.stopAudioSimulation();
    }
    
    this.updateInterface();
  }

  /**
   * Cierra el panel de detalles
   */
  closeDetailPanel() {
    this.state.selectedComponent = null;
    this.updateInterface();
  }

  /**
   * Cambia la pestaña activa
   */
  switchTab(tabId) {
    if (this.state.activeTab === tabId) return;
    
    this.state.activeTab = tabId;
    this.updateInterface();
  }

  /**
   * Ajusta el nivel de zoom
   */
  adjustZoom(amount) {
    const newZoom = this.state.zoomLevel + amount;
    this.state.zoomLevel = Math.max(0.5, Math.min(3, newZoom));
    this.updateInterface();
  }

  /**
   * Inicializa el módulo
   */
  initialize() {
    if (this.isInitialized) return;
    
    console.log('🚀 NCLEX Anatomy MasterClass v12.0 Initialized');
    
    this.isInitialized = true;
    this.updateInterface();
    
    // Cargar estilos CSS
    this.injectStyles();
  }

  /**
   * Inyecta estilos CSS necesarios
   */
  injectStyles() {
    if (document.getElementById('anatomy-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'anatomy-styles';
    styles.textContent = this.getCSSStyles();
    document.head.appendChild(styles);
  }

  /**
   * Retorna los estilos CSS para el módulo
   */
  getCSSStyles() {
    return `
      .anatomy-master-container {
        height: calc(100vh - 60px);
        background: #111827;
        color: white;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        overflow: hidden;
      }
      
      .system-navigation {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1rem;
        background: #1f2937;
        border-bottom: 1px solid #374151;
        overflow-x: auto;
      }
      
      .system-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        white-space: nowrap;
      }
      
      .system-buttons {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
      }
      
      .system-button {
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 700;
        background: #374151;
        color: #d1d5db;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
      }
      
      .system-button:hover {
        background: #4b5563;
      }
      
      .system-button.active {
        background: #3b82f6;
        color: white;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
      }
      
      .anatomy-workspace {
        display: flex;
        height: calc(100% - 3rem);
      }
      
      .visualization-panel {
        flex: 1;
        background: black;
        position: relative;
        overflow: hidden;
      }
      
      .image-grid-overlay {
        position: absolute;
        inset: 0;
        background-image: 
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
        background-size: 50px 50px;
        pointer-events: none;
      }
      
      .anatomy-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        opacity: 0.9;
        transition: opacity 0.3s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .anatomy-image:hover {
        opacity: 1;
      }
      
      .anatomical-markers {
        position: absolute;
        inset: 0;
      }
      
      .anatomy-marker {
        position: absolute;
        width: 24px;
        height: 24px;
        margin-left: -12px;
        margin-top: -12px;
        background: rgba(59, 130, 246, 0.4);
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 0 15px rgba(0, 140, 255, 0.8);
      }
      
      .anatomy-marker:hover {
        background: rgba(59, 130, 246, 0.8);
        transform: scale(1.25);
      }
      
      .anatomy-marker.selected {
        background: #3b82f6;
        transform: scale(1.5);
        animation: pulse 2s infinite;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
      }
      
      .marker-dot {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      
      .marker-label {
        position: absolute;
        top: -2rem;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid #374151;
        opacity: 0;
        transition: opacity 0.3s;
        white-space: nowrap;
        pointer-events: none;
      }
      
      .anatomy-marker:hover .marker-label {
        opacity: 1;
      }
      
      .floating-controls {
        position: absolute;
        bottom: 1.5rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 1rem;
        align-items: center;
        background: rgba(31, 41, 55, 0.8);
        backdrop-filter: blur(8px);
        padding: 0.75rem 1.5rem;
        border-radius: 9999px;
        border: 1px solid #4b5563;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      }
      
      .control-button {
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 1.25rem;
        cursor: pointer;
        transition: color 0.2s;
        padding: 0.5rem;
      }
      
      .control-button:hover {
        color: white;
      }
      
      .control-button.active {
        color: #10b981;
        text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
      }
      
      .control-separator {
        width: 1px;
        height: 1.5rem;
        background: #4b5563;
      }
      
      .status-indicator {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 0.75rem;
        font-family: monospace;
        color: #10b981;
        background: rgba(0, 0, 0, 0.5);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid rgba(16, 185, 129, 0.2);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .status-dot {
        width: 0.5rem;
        height: 0.5rem;
        background: #10b981;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
      
      .detail-panel {
        width: 100%;
        max-width: 28rem;
        background: #1f2937;
        border-left: 1px solid #374151;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
      }
      
      .detail-panel.visible {
        transform: translateX(0);
      }
      
      .detail-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      .detail-header {
        padding: 1.5rem;
        background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        border-bottom: 1px solid #374151;
      }
      
      .detail-header h2 {
        font-size: 1.875rem;
        font-weight: 900;
        color: white;
        margin-bottom: 0.25rem;
      }
      
      .close-button {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        background: none;
        border: none;
        color: #6b7280;
        font-size: 1.25rem;
        cursor: pointer;
        transition: color 0.2s;
      }
      
      .close-button:hover {
        color: #ef4444;
      }
      
      .system-tag {
        font-size: 0.75rem;
        font-family: monospace;
        color: #3b82f6;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
      
      .detail-tabs {
        display: flex;
        border-bottom: 1px solid #374151;
        background: rgba(0, 0, 0, 0.1);
      }
      
      .tab-button {
        flex: 1;
        padding: 1rem;
        background: none;
        border: none;
        color: #6b7280;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }
      
      .tab-button:hover {
        color: #d1d5db;
        background: rgba(255, 255, 255, 0.05);
      }
      
      .tab-button.active {
        color: #3b82f6;
        border-bottom: 2px solid #3b82f6;
        background: rgba(59, 130, 246, 0.05);
      }
      
      .tab-content {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
      }
      
      .clinical-content, .nclex-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .info-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid #374151;
        border-radius: 0.75rem;
        padding: 1.5rem;
      }
      
      .info-card h3 {
        font-size: 0.75rem;
        font-weight: 700;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .info-card p {
        color: #e5e7eb;
        line-height: 1.6;
      }
      
      .info-card code {
        font-family: 'JetBrains Mono', monospace;
        color: #93c5fd;
        font-size: 0.875rem;
      }
      
      .info-card ul {
        list-style: disc;
        margin-left: 1rem;
        color: #d1d5db;
      }
      
      .info-card li {
        margin-bottom: 0.5rem;
        line-height: 1.5;
      }
      
      .pathophysiology {
        border-left: 4px solid #3b82f6;
      }
      
      .diagnostics {
        border-left: 4px solid #8b5cf6;
      }
      
      .interventions {
        border-left: 4px solid #10b981;
      }
      
      .priority-alert {
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-left: 4px solid #f59e0b;
        border-radius: 0.75rem;
        padding: 1.5rem;
      }
      
      .priority-alert h3 {
        color: #f59e0b;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .priority-alert p {
        color: #fde68a;
        line-height: 1.6;
        font-weight: 500;
      }
      
      .nursing-considerations {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid #374151;
        border-radius: 0.75rem;
        padding: 1.5rem;
      }
      
      .empty-state {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        text-align: center;
        opacity: 0.5;
      }
      
      .empty-icon {
        font-size: 4rem;
        color: #4b5563;
        margin-bottom: 1.5rem;
        animation: spin 8s linear infinite;
      }
      
      .empty-state h3 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #9ca3af;
        margin-bottom: 0.5rem;
      }
      
      .empty-state p {
        color: #6b7280;
        max-width: 20rem;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      /* Responsive */
      @media (max-width: 1024px) {
        .anatomy-workspace {
          flex-direction: column;
        }
        
        .detail-panel {
          position: absolute;
          inset: 0;
          max-width: none;
          z-index: 50;
        }
        
        .floating-controls {
          bottom: auto;
          top: 1rem;
        }
      }
      
      /* Scrollbar personalizado */
      .tab-content::-webkit-scrollbar {
        width: 8px;
      }
      
      .tab-content::-webkit-scrollbar-track {
        background: #1f2937;
      }
      
      .tab-content::-webkit-scrollbar-thumb {
        background: #4b5563;
        border-radius: 4px;
      }
      
      .tab-content::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
      }
    `;
  }

  /**
   * Limpia recursos y destruye la instancia
   */
  destroy() {
    this.stopAudioSimulation();
    
    if (this.audioEngine) {
      this.audioEngine.close();
    }
    
    this.audioIntervals.clear();
    this.isInitialized = false;
    
    console.log('🧹 NCLEX Anatomy MasterClass destroyed');
  }
}

// ============================================================================
// SISTEMA DE INYECCIÓN MEJORADO
// ============================================================================
/**
 * Sistema de registro e inyección robusto
 */
class AnatomyModuleInjector {
  constructor() {
    this.moduleInstance = new NCLEXAnatomyMaster();
    this.registrationAttempts = 0;
    this.maxAttempts = 10;
    
    this.initialize();
  }
  
  /**
   * Inicializa el sistema de inyección
   */
  initialize() {
    // Método 1: Registro estándar en el sistema NCLEX principal
    this.attemptStandardRegistration();
    
    // Método 2: Inyección directa con reintentos
    this.startDirectInjection();
    
    // Método 3: Sistema de respaldo por eventos
    this.setupEventListeners();
    
    // Exponer la instancia globalmente
    window.NCLEXAnatomy = this.moduleInstance;
  }
  
  /**
   * Intenta registro estándar en el sistema NCLEX
   */
  attemptStandardRegistration() {
    if (window.NCLEX && typeof window.NCLEX.registerTopic === 'function') {
      try {
        window.NCLEX.registerTopic({
          id: this.moduleInstance.id,
          title: {
            es: 'Anatomía Clínica',
            en: 'Clinical Anatomy'
          },
          icon: 'heart-pulse',
          color: 'blue',
          priority: 1,
          render: () => {
            // Pequeño retraso para asegurar renderizado
            setTimeout(() => this.moduleInstance.initialize(), 50);
            return this.moduleInstance.render();
          },
          description: {
            es: 'Sistema interactivo de anatomía clínica para enfermería',
            en: 'Interactive clinical anatomy system for nursing'
          }
        });
        
        console.log('✅ Anatomy module registered successfully');
        return true;
      } catch (error) {
        console.warn('⚠️ Standard registration failed:', error);
        return false;
      }
    }
    return false;
  }
  
  /**
   * Inicia la inyección directa con sistema de reintentos
   */
  startDirectInjection() {
    const injectionInterval = setInterval(() => {
      if (this.registrationAttempts >= this.maxAttempts) {
        clearInterval(injectionInterval);
        console.log('⏹️ Maximum injection attempts reached');
        return;
      }
      
      this.registrationAttempts++;
      
      if (this.injectNavigationButton()) {
        clearInterval(injectionInterval);
        console.log('✅ Navigation button injected successfully');
      }
    }, 1000);
  }
  
  /**
   * Inyecta el botón de navegación en la interfaz
   */
  injectNavigationButton() {
    const navigationContainer = document.getElementById('topics-nav');
    
    if (!navigationContainer) {
      return false;
    }
    
    // Verificar si el botón ya existe
    if (document.getElementById('btn-anatomy-module')) {
      return true;
    }
    
    try {
      const buttonHTML = `
        <button id="btn-anatomy-module" 
                class="nav-topic-button anatomy-topic-button"
                data-module="anatomy">
          <div class="nav-icon">
            <i class="fa-solid fa-heart-pulse animate-gentle-pulse"></i>
          </div>
          <span class="nav-label">Anatomía Clínica</span>
          <span class="nav-badge">NUEVO</span>
        </button>
      `;
      
      // Insertar al principio del contenedor
      navigationContainer.insertAdjacentHTML('afterbegin', buttonHTML);
      
      // Añadir event listener
      const button = document.getElementById('btn-anatomy-module');
      button.addEventListener('click', () => this.activateModule());
      
      // Añadir estilos específicos
      this.injectButtonStyles();
      
      return true;
    } catch (error) {
      console.error('❌ Error injecting button:', error);
      return false;
    }
  }
  
  /**
   * Activa el módulo de anatomía
   */
  activateModule() {
    const appView = document.getElementById('app-view');
    
    if (!appView) {
      console.error('App view container not found');
      return;
    }
    
    // Limpiar estado activo de otros botones
    document.querySelectorAll('.nav-topic-button').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Marcar este botón como activo
    const anatomyButton = document.getElementById('btn-anatomy-module');
    if (anatomyButton) {
      anatomyButton.classList.add('active');
    }
    
    // Renderizar el módulo
    appView.innerHTML = this.moduleInstance.render();
    this.moduleInstance.initialize();
    
    // Desplazar al top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log('🚀 Anatomy module activated');
  }
  
  /**
   * Inyecta estilos CSS para el botón
   */
  injectButtonStyles() {
    const styleId = 'anatomy-button-styles';
    
    if (document.getElementById(styleId)) {
      return;
    }
    
    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
      .anatomy-topic-button {
        background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(30, 64, 175, 0.2) 100%);
        border: 1px solid rgba(59, 130, 246, 0.3);
        transition: all 0.3s ease;
      }
      
      .anatomy-topic-button:hover {
        background: linear-gradient(135deg, rgba(30, 64, 175, 0.2) 0%, rgba(30, 64, 175, 0.3) 100%);
        border-color: rgba(59, 130, 246, 0.5);
        transform: translateY(-2px);
      }
      
      .anatomy-topic-button.active {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.4) 100%);
        border-color: rgba(59, 130, 246, 0.7);
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
      }
      
      .anatomy-topic-button .nav-icon {
        color: #3b82f6;
      }
      
      .anatomy-topic-button .nav-badge {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        font-size: 0.7rem;
        padding: 0.1rem 0.4rem;
        border-radius: 0.25rem;
        font-weight: bold;
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
      }
      
      @keyframes gentle-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      .animate-gentle-pulse {
        animation: gentle-pulse 2s ease-in-out infinite;
      }
    `;
    
    document.head.appendChild(styles);
  }
  
  /**
   * Configura event listeners para detección de cambios
   */
  setupEventListeners() {
    // Observar cambios en el DOM
    const observer = new MutationObserver(() => {
      // Reintentar inyección si el botón desaparece
      if (!document.getElementById('btn-anatomy-module')) {
        this.injectNavigationButton();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Limpiar recursos al descargar la página
    window.addEventListener('beforeunload', () => {
      this.moduleInstance.destroy();
    });
  }
}

// ============================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================================================
// Esperar a que el DOM esté completamente cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AnatomyModuleInjector();
  });
} else {
  new AnatomyModuleInjector();
}

// Mensaje de inicio
console.log(`
╔══════════════════════════════════════════════════════╗
║      NCLEX ANATOMY MASTERCLASS v12.0 - TITANIUM      ║
║                🏥 Initializing...                    ║
╚══════════════════════════════════════════════════════╝
`);
