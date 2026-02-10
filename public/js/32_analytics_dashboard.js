// 32_analytics_dashboard.js — Dashboard de Métricas Bilingüe & Auto-Actualizable
// VERSIÓN AUDITADA: Integración nativa con logic.js + Captura automática de datos del simulador
// Dependencias: window.NCLEX, localStorage

(function() {
  'use strict';

  // 1. Guard Clause: Verificación de seguridad
  if (!window.NCLEX && !window.nclexApp) {
      console.error("Critical: NCLEX Core not found. Module 32 skipped.");
      return;
  }

  console.log("Cargando Módulo 32: Analytics Dashboard...");

  // 2. Helper Bilingüe (Compatible con tu sistema logic.js)
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  // 3. Registrar Tópico (Esto hace que aparezca en el menú)
  // Aseguramos compatibilidad si NCLEX está definido
  if (window.NCLEX) {
      NCLEX.registerTopic({
        id: 'dashboard', 
        title: { es: 'Panel de Métricas', en: 'Performance Dashboard' },
        subtitle: { es: 'Progreso y Análisis', en: 'Progress & Analytics' },
        icon: 'chart-pie',
        color: 'indigo',
    
        render() {
          Analytics.loadData(); // Recargar datos al abrir
          return Analytics.getHTML();
        }
      });
  }

  // --- LÓGICA DEL DASHBOARD ---
  const Analytics = {
    data: { total: 0, correct: 0, score: 0, streak: 0, progress: 0 },

    loadData() {
      try {
        // Recuperar historial
        const history = JSON.parse(localStorage.getItem('nclex_exam_history') || '[]');
        const readModules = JSON.parse(localStorage.getItem('nclex_progress') || '[]'); // Corregido key a 'nclex_progress' según logic.js
        
        let totalQ = 0;
        let totalCorrect = 0;

        history.forEach(session => {
            totalQ += (parseInt(session.total) || 0);
            totalCorrect += (parseInt(session.correct) || 0);
        });

        // Calcular porcentaje global
        const score = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;
        
        // Calcular progreso de lectura
        // Usamos window.NCLEX.getAllTopics() si existe para ser más precisos, o fallback
        const topics = (window.NCLEX && window.NCLEX.getAllTopics) ? window.NCLEX.getAllTopics() : [];
        const totalTopics = topics.length || 32;
        const progress = Math.min(100, Math.round((readModules.length / totalTopics) * 100));

        this.data = {
            total: totalQ,
            correct: totalCorrect,
            score: score,
            streak: parseInt(localStorage.getItem('nclex_streak') || '0'),
            progress: progress
        };
      } catch (e) {
        console.error("Error cargando analíticas:", e);
      }
    },

    getHTML() {
      // ESTADO VACÍO (Si no ha hecho exámenes)
      if (this.data.total === 0) {
          return `
            <div class="flex flex-col items-center justify-center py-12 text-center animate-fade-in bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <div class="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 text-4xl">
                    <i class="fa-solid fa-chart-simple"></i>
                </div>
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    ${t('Panel de Métricas Vacío', 'Empty Dashboard')}
                </h2>
                <p class="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                    ${t('El sistema necesita datos. Completa tu primer simulacro para activar la inteligencia artificial y ver tu rendimiento.', 'System needs data. Complete your first simulation to activate AI insights and track performance.')}
                </p>
                <button onclick="window.nclexApp.navigate('simulator')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
                    <i class="fa-solid fa-play"></i> ${t('Ir al Simulador', 'Go to Simulator')}
                </button>
            </div>
          `;
      }

      // DASHBOARD CON DATOS
      const scoreColor = this.data.score >= 75 ? 'text-green-500' : (this.data.score >= 50 ? 'text-yellow-500' : 'text-red-500');
      
      return `
        <div class="animate-fade-in space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center relative overflow-hidden">
                    <h3 class="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-wider z-10">
                        ${t('Puntaje Global', 'Global Score')}
                    </h3>
                    <div class="relative w-32 h-32 z-10">
                        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path class="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"/>
                            <path class="${scoreColor} transition-all duration-1000" stroke-dasharray="${this.data.score}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center text-3xl font-black text-slate-800 dark:text-white">
                            ${this.data.score}%
                        </div>
                    </div>
                    <i class="fa-solid fa-trophy absolute -bottom-4 -right-4 text-9xl text-gray-100 dark:text-slate-700/50 -z-0 transform rotate-12"></i>
                </div>

                <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-center space-y-6">
                    <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                        <span class="text-sm text-gray-500 dark:text-gray-400">${t('Preguntas', 'Questions')}</span>
                        <span class="text-2xl font-bold text-slate-800 dark:text-white">${this.data.total}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                        <span class="text-sm text-gray-500 dark:text-gray-400">${t('Aciertos', 'Correct')}</span>
                        <span class="text-2xl font-bold text-green-500">${this.data.correct}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500 dark:text-gray-400">${t('Racha', 'Streak')}</span>
                        <span class="text-2xl font-bold text-orange-500">${this.data.streak} <i class="fa-solid fa-fire text-lg"></i></span>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
                    <div class="z-10">
                        <h3 class="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">${t('Progreso del Curso', 'Course Progress')}</h3>
                        <div class="flex items-end gap-2 mb-4">
                            <p class="text-4xl font-black">${this.data.progress}%</p>
                            <p class="text-sm text-indigo-200 mb-1">${t('Completado', 'Completed')}</p>
                        </div>
                    </div>
                    <div class="w-full bg-black/20 rounded-full h-3 mb-4 z-10">
                        <div class="bg-white h-3 rounded-full transition-all duration-1000 shadow-glow" style="width: ${this.data.progress}%"></div>
                    </div>
                    <button onclick="window.nclexApp.navigate('home')" class="w-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-3 rounded-xl transition-colors border border-white/10 z-10">
                        ${t('Continuar Estudio', 'Continue Studying')}
                    </button>
                    <i class="fa-solid fa-graduation-cap absolute top-2 right-2 text-8xl text-white/10 transform -rotate-12"></i>
                </div>
            </div>

            <div class="flex justify-center pt-6">
                <button onclick="window.nclexApp.navigate('simulator')" class="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-3 text-lg">
                    <i class="fa-solid fa-bolt text-yellow-400 dark:text-yellow-600"></i>
                    ${t('Entrenar Ahora', 'Train Now')}
                </button>
            </div>
        </div>
      `;
    }
  };

  // --- INTERCEPTOR DE DATOS DEL SIMULADOR (Auto-Save Patch FIXED) ---
  const observer = new MutationObserver((mutations) => {
    const appView = document.getElementById('app-view');
    if (!appView) return;

    // Buscamos si apareció la pantalla de resultados del simulador
    const resultsHeader = appView.querySelector('h2');
    // Verificar si estamos en la pantalla de resultados (títulos bilingües)
    if (resultsHeader && (resultsHeader.innerText.includes('Resultados') || resultsHeader.innerText.includes('Results'))) {
        
        let correct = null;
        let total = null;

        // ESTRATEGIA DOM: Buscar los bloques que contienen "Correct" y "Total"
        // simulator.js usa spans con texto 'Correctas'/'Correct' y 'Total'
        // Los números están en el elemento hermano o padre.
        
        const allSpans = Array.from(appView.querySelectorAll('span'));
        
        // Buscar el número de CORRECTAS
        const correctLabel = allSpans.find(el => /Correct/i.test(el.innerText));
        if (correctLabel && correctLabel.parentElement) {
            // En simulator.js, el número es el primer hijo del div padre, o un hermano previo
            const numberEl = correctLabel.parentElement.querySelector('.text-2xl');
            if (numberEl) correct = parseInt(numberEl.innerText);
        }

        // Buscar el número TOTAL
        const totalLabel = allSpans.find(el => /Total/i.test(el.innerText));
        if (totalLabel && totalLabel.parentElement) {
             const numberEl = totalLabel.parentElement.querySelector('.text-2xl');
             if (numberEl) total = parseInt(numberEl.innerText);
        }

        // Si falló la estrategia DOM precisa, intentar un fallback (menos preciso pero útil)
        if (correct === null || total === null) {
             // Buscar números grandes en la pantalla
             const bigNumbers = Array.from(appView.querySelectorAll('.text-2xl')).map(el => parseInt(el.innerText)).filter(n => !isNaN(n));
             if (bigNumbers.length >= 2) {
                 // Asumir heurísticamente que el menor es aciertos y el mayor es total (si no hay 3 números)
                 // simulator.js muestra: SCORE (grande), TOTAL (grande).
                 correct = bigNumbers[0];
                 total = bigNumbers[1];
             }
        }

        if (correct !== null && total !== null && total > 0) {
            
            // Guardar en Historial si es un nuevo resultado
            const lastSession = JSON.parse(localStorage.getItem('nclex_last_session_id') || '0');
            const currentSessionId = Date.now();
            
            // Evitar guardar duplicados (debounce de 10 seg)
            if (currentSessionId - lastSession > 10000) {
                const history = JSON.parse(localStorage.getItem('nclex_exam_history') || '[]');
                history.push({
                    date: currentSessionId,
                    correct: correct,
                    total: total,
                    score: Math.round((correct/total)*100)
                });
                localStorage.setItem('nclex_exam_history', JSON.stringify(history));
                
                // Actualizar racha
                let streak = parseInt(localStorage.getItem('nclex_streak') || '0');
                localStorage.setItem('nclex_streak', streak + 1);
                
                localStorage.setItem('nclex_last_session_id', currentSessionId);
                console.log(`📊 Analytics: Resultados capturados (C:${correct}/T:${total}) y guardados.`);
            }
        }
    }
  });

  // Iniciar el observador sobre el contenedor principal
  const targetNode = document.getElementById('app-view') || document.body;
  observer.observe(targetNode, { childList: true, subtree: true });

})();