/* simulator.js — Motor de Examen NCLEX (CSV/Google Sheets + Logic Core) */
/* Optimizado para rendimiento, resistencia a fallos y UX móvil */

(function () {
    'use strict';

    // --- 1. CONFIGURACIÓN & ESTADO ---
    const CONFIG = {
        sheetId: "2PACX-1vTuJc6DOuIIYv9jOERaUMa8yoo0ZFJY9BiVrvFU7Qa2VMJHGfP_i5C8RZpmXo41jg49IUjDP8lT_ze0", // ID PROPORCIONADO
        csvUrl: function() { 
            return `https://docs.google.com/spreadsheets/d/e/${this.sheetId}/pub?output=csv`; 
        }
    };

    const state = {
        questions: [],      // Todas las preguntas cargadas
        activeSession: [],  // Preguntas de la sesión actual
        currentIndex: 0,
        score: 0,
        userSelection: new Set(), // IDs de opciones seleccionadas
        isRationale: false, // Modo revisión (después de contestar)
        isLoading: false,
        error: null,
        mode: 'random' // 'random', 'category', etc.
    };

    // --- 2. UTILIDADES DE PARSEO (ROBUST CSV) ---
    // Parsea CSV respetando comillas y saltos de línea dentro de celdas
    function parseCSV(str) {
        const arr = [];
        let quote = false;
        let col = 0, row = 0;
        
        for (let c = 0; c < str.length; c++) {
            let cc = str[c], nc = str[c+1];
            arr[row] = arr[row] || [];
            arr[row][col] = arr[row][col] || '';

            if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
            if (cc == '"') { quote = !quote; continue; }
            if (cc == ',' && !quote) { ++col; continue; }
            if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
            if (cc == '\n' && !quote) { ++row; col = 0; continue; }
            if (cc == '\r' && !quote) { ++row; col = 0; continue; }
            
            arr[row][col] += cc;
        }
        return arr;
    }

    function mapQuestions(rows) {
        if (!rows || rows.length < 2) return [];
        const headers = rows[0].map(h => h.trim().toLowerCase());
        
        return rows.slice(1).map((row, index) => {
            if (row.length < headers.length) return null;
            
            const q = {};
            headers.forEach((h, i) => q[h] = row[i]?.trim());
            
            // Detección automática de SATA (Select All That Apply)
            // Si hay múltiples respuestas correctas indicadas (ej: "A,C" o "1,3")
            q.isSATA = q.correct && (q.correct.includes(',') || q.correct.length > 1);
            
            // ID único interno
            q._id = index; 
            
            return q;
        }).filter(item => item && item.question_es && item.question_en); // Filtrar filas vacías
    }

    // --- 3. LÓGICA DEL MOTOR ---

    const Simulator = {
        // Carga inicial de datos
        init: async () => {
            if (state.questions.length > 0) return; // Ya cargado
            
            state.isLoading = true;
            renderLoading();
            
            try {
                const response = await fetch(CONFIG.csvUrl());
                if (!response.ok) throw new Error("Error de red al cargar preguntas");
                
                const text = await response.text();
                const rows = parseCSV(text);
                state.questions = mapQuestions(rows);
                
                console.log(`[Simulator] ${state.questions.length} preguntas cargadas.`);
                state.isLoading = false;
                Simulator.startSession(); // Auto-start
            } catch (e) {
                console.error(e);
                state.error = e.message;
                state.isLoading = false;
                renderError();
            }
        },

        startSession: (count = 10) => {
            // Mezclar y cortar
            const shuffled = [...state.questions].sort(() => 0.5 - Math.random());
            state.activeSession = shuffled.slice(0, count);
            state.currentIndex = 0;
            state.score = 0;
            state.userSelection.clear();
            state.isRationale = false;
            renderQuestion();
        },

        selectOption: (optLabel) => {
            if (state.isRationale) return; // Bloqueado si ya respondió
            
            const currentQ = state.activeSession[state.currentIndex];
            
            // Lógica SATA vs Single
            // Por simplicidad en CSV, asumimos que 'correct' es la letra/número correcto
            // Si el sistema es simple, select es único. Si es SATA, toggle.
            // Para este código base, usaremos SINGLE CHOICE por defecto salvo que activemos modo SATA complejo.
            // Ajuste: Permitir cambio de selección si no ha enviado.
            
            state.userSelection.clear();
            state.userSelection.add(optLabel);
            renderQuestion(); // Re-render para actualizar UI
        },

        submitAnswer: () => {
            if (state.userSelection.size === 0) {
                window.NCLEX.showToast("Selecciona una respuesta / Select an answer");
                return;
            }
            
            const currentQ = state.activeSession[state.currentIndex];
            const correctRaw = currentQ.correct || '';
            const selected = Array.from(state.userSelection)[0]; // Tomamos la primera (Single Choice Logic)
            
            // Normalizar comparación (ignorando mayúsculas/espacios)
            const isCorrect = correctRaw.trim().toLowerCase() === selected.toLowerCase();
            
            if (isCorrect) state.score++;
            
            state.isRationale = true;
            
            // Integración con Analytics (Módulo 32)
            if (window.Analytics) {
                // Enviar datos al dashboard
                // window.Analytics.logResult(isCorrect);
            }

            renderQuestion();
        },

        nextQuestion: () => {
            if (state.currentIndex < state.activeSession.length - 1) {
                state.currentIndex++;
                state.userSelection.clear();
                state.isRationale = false;
                renderQuestion();
            } else {
                renderResults();
            }
        },

        // API para vista
        getCurrentQuestion: () => state.activeSession[state.currentIndex]
    };

    // --- 4. RENDERIZADO ---

    function renderLoading() {
        const html = `
            <div class="flex flex-col items-center justify-center h-96">
                <div class="spinner border-4 border-brand-blue border-t-transparent w-12 h-12 rounded-full animate-spin mb-4"></div>
                <p class="text-gray-500 animate-pulse">Conectando con Google Database...</p>
            </div>
        `;
        document.getElementById('app-view').innerHTML = html;
    }

    function renderError() {
        const html = `
            <div class="flex flex-col items-center justify-center h-96 text-center p-6">
                <i class="fa-solid fa-wifi text-6xl text-red-400 mb-4"></i>
                <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2">Error de Conexión</h3>
                <p class="text-gray-500 mb-6">${state.error}</p>
                <button onclick="window.Simulator.init()" class="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold">Reintentar</button>
            </div>
        `;
        document.getElementById('app-view').innerHTML = html;
    }

    function renderQuestion() {
        const q = Simulator.getCurrentQuestion();
        const total = state.activeSession.length;
        const current = state.currentIndex + 1;
        const progress = (current / total) * 100;

        // Opciones (A, B, C, D...)
        // Asumimos columnas option_a_es, option_a_en, etc.
        const optionsKeys = ['a', 'b', 'c', 'd', 'e', 'f']; 
        let optionsHTML = '<div class="space-y-3">';
        
        optionsKeys.forEach(key => {
            const textEs = q[`option_${key}_es`];
            const textEn = q[`option_${key}_en`];
            
            if (!textEs && !textEn) return; // Skip empty options
            
            const isSelected = state.userSelection.has(key);
            const isCorrect = q.correct.toLowerCase().includes(key);
            
            let btnClass = "bg-white dark:bg-[#1c1c1e] border-gray-200 dark:border-white/10 hover:border-brand-blue dark:hover:border-brand-blue";
            let icon = `<span class="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center font-bold text-gray-500 text-sm">${key.toUpperCase()}</span>`;
            
            if (state.isRationale) {
                if (isCorrect) {
                    btnClass = "bg-green-50 dark:bg-green-900/20 border-green-500 ring-1 ring-green-500";
                    icon = `<div class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center"><i class="fa-solid fa-check"></i></div>`;
                } else if (isSelected && !isCorrect) {
                    btnClass = "bg-red-50 dark:bg-red-900/20 border-red-500";
                    icon = `<div class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"><i class="fa-solid fa-xmark"></i></div>`;
                } else {
                    btnClass += " opacity-60";
                }
            } else if (isSelected) {
                btnClass = "bg-blue-50 dark:bg-blue-900/20 border-brand-blue ring-1 ring-brand-blue shadow-md transform scale-[1.01]";
                icon = `<div class="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">${key.toUpperCase()}</div>`;
            }

            optionsHTML += `
                <button onclick="window.Simulator.selectOption('${key}')" ${state.isRationale ? 'disabled' : ''}
                    class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group ${btnClass}">
                    ${icon}
                    <div class="flex-1">
                        <span class="block text-sm font-medium text-slate-800 dark:text-gray-200 lang-es">${textEs}</span>
                        <span class="block text-sm font-medium text-slate-800 dark:text-gray-200 lang-en hidden-lang">${textEn}</span>
                    </div>
                </button>
            `;
        });
        optionsHTML += '</div>';

        // HTML Principal
        const html = `
            <div class="max-w-3xl mx-auto pb-20">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex flex-col">
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Question ${current} of ${total}</span>
                        <h2 class="text-xl font-black text-brand-blue">NCLEX SIMULATOR</h2>
                    </div>
                    <div class="text-right">
                        <span class="text-2xl font-bold text-slate-800 dark:text-white">${state.score}</span>
                        <span class="text-sm text-gray-400">pts</span>
                    </div>
                </div>
                
                <div class="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2 mb-8 overflow-hidden">
                    <div class="bg-brand-blue h-2 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                </div>

                <div class="bg-white dark:bg-[#1c1c1e] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mb-6">
                    <p class="text-lg md:text-xl font-medium text-slate-800 dark:text-white leading-relaxed mb-2">
                        <span class="lang-es">${q.question_es}</span>
                        <span class="lang-en hidden-lang">${q.question_en}</span>
                    </p>
                </div>

                ${optionsHTML}

                ${state.isRationale ? `
                    <div class="mt-6 animate-slide-up bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                        <div class="flex items-center gap-2 mb-2 text-brand-blue font-bold uppercase text-xs tracking-wider">
                            <i class="fa-solid fa-lightbulb"></i>
                            <span class="lang-es">Explicación / Rationale</span>
                            <span class="lang-en hidden-lang">Rationale</span>
                        </div>
                        <p class="text-slate-700 dark:text-gray-300 leading-relaxed text-sm">
                            <span class="lang-es">${q.rationale_es || 'Sin explicación disponible.'}</span>
                            <span class="lang-en hidden-lang">${q.rationale_en || 'No rationale available.'}</span>
                        </p>
                    </div>
                ` : ''}

                <div class="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur border-t border-gray-200 dark:border-white/10 flex justify-between items-center z-30">
                     <button onclick="window.NCLEX.navigate('home')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-medium px-4">
                        <span class="lang-es">Salir</span><span class="lang-en hidden-lang">Quit</span>
                     </button>

                     ${!state.isRationale ? `
                        <button onclick="window.Simulator.submitAnswer()" class="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                            <span class="lang-es">Enviar</span><span class="lang-en hidden-lang">Submit</span>
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                     ` : `
                        <button onclick="window.Simulator.nextQuestion()" class="bg-slate-800 dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                            <span class="lang-es">${current === total ? 'Ver Resultados' : 'Siguiente'}</span>
                            <span class="lang-en hidden-lang">${current === total ? 'See Results' : 'Next'}</span>
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                     `}
                </div>
            </div>
        `;
        
        document.getElementById('app-view').innerHTML = html;
        if(window.NCLEX) window.NCLEX.toggleLanguage(); window.NCLEX.toggleLanguage(); // Hack rápido para refrescar el idioma actual
    }

    function renderResults() {
        const percentage = Math.round((state.score / state.activeSession.length) * 100);
        let color = 'text-red-500';
        let msgEs = 'Necesitas reforzar conocimientos.';
        let msgEn = 'Review needed.';
        
        if (percentage >= 80) { color = 'text-green-500'; msgEs = '¡Excelente trabajo!'; msgEn = 'Great Job!'; }
        else if (percentage >= 60) { color = 'text-orange-500'; msgEs = 'Buen intento, sigue practicando.'; msgEn = 'Good try, keep practicing.'; }

        const html = `
            <div class="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
                <div class="w-32 h-32 rounded-full border-8 border-gray-100 dark:border-white/5 flex items-center justify-center mb-6 relative">
                    <span class="text-4xl font-black ${color}">${percentage}%</span>
                    <i class="fa-solid fa-trophy absolute -top-2 -right-2 text-3xl text-yellow-400 drop-shadow-md animate-bounce"></i>
                </div>
                
                <h2 class="text-3xl font-black text-slate-800 dark:text-white mb-2">
                    <span class="lang-es">Resultados del Examen</span>
                    <span class="lang-en hidden-lang">Exam Results</span>
                </h2>
                
                <p class="text-gray-500 dark:text-gray-400 mb-8 font-medium">
                    <span class="lang-es">${msgEs}</span>
                    <span class="lang-en hidden-lang">${msgEn}</span>
                </p>

                <div class="grid grid-cols-2 gap-4 w-full mb-8">
                    <div class="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                        <div class="text-2xl font-bold text-slate-800 dark:text-white">${state.score}</div>
                        <div class="text-xs text-gray-400 uppercase">Correctas</div>
                    </div>
                    <div class="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                        <div class="text-2xl font-bold text-slate-800 dark:text-white">${state.activeSession.length}</div>
                        <div class="text-xs text-gray-400 uppercase">Total</div>
                    </div>
                </div>

                <div class="flex flex-col w-full gap-3">
                    <button onclick="window.Simulator.startSession()" class="w-full bg-brand-blue text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-colors">
                        <span class="lang-es">Intentar Otro Set</span>
                        <span class="lang-en hidden-lang">Try Another Set</span>
                    </button>
                    <button onclick="window.NCLEX.navigate('home')" class="w-full bg-transparent text-gray-500 py-3 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        <span class="lang-es">Volver al Inicio</span>
                        <span class="lang-en hidden-lang">Back to Dashboard</span>
                    </button>
                </div>
            </div>
        `;
        document.getElementById('app-view').innerHTML = html;
        if(window.NCLEX) window.NCLEX.toggleLanguage(); window.NCLEX.toggleLanguage();
    }

    // --- 5. EXPORTAR & REGISTRAR ---
    window.Simulator = Simulator;

    if (window.NCLEX) {
        window.NCLEX.registerTopic({
            id: 'simulator',
            title: { es: 'Simulador de Examen', en: 'Exam Simulator' },
            subtitle: { es: 'Banco de Preguntas QBank', en: 'QBank Practice' },
            icon: 'clipboard-list',
            color: 'green',
            render: () => {
                Simulator.init();
                return '<div id="sim-container"></div>'; // Placeholder, init() tomará control
            }
        });
    }

})();
