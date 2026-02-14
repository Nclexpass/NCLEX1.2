/* 32_analytics_dashboard.js — Student Performance Analytics v4.2 
   INTEGRATED: Conectado a nclex_quiz_history y Skins
*/

(function () {
    'use strict';

    // ===== DEPENDENCIAS =====
    const U = window.NCLEXUtils || { storageGet: (k,d)=>JSON.parse(localStorage.getItem(k))||d };

    // ===== RENDERIZADOR PRINCIPAL =====
    function renderDashboard() {
        // 1. Obtener Datos Reales (Sincronizados por Auth.js)
        const progress = U.storageGet('nclex_progress', []); // Array de IDs de temas completados
        const history = U.storageGet('nclex_quiz_history', []); // Array de resultados de exámenes

        // 2. Cálculos de Simulador
        let totalQuestions = 0;
        let totalCorrect = 0;
        
        history.forEach(session => {
            totalQuestions += (session.total || 0);
            totalCorrect += (session.score || 0);
        });

        const quizAverage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        
        // 3. Cálculos de Progreso Teórico
        const totalModules = 30; // Total aproximado de módulos en logic.js
        const completionRate = Math.round((progress.length / totalModules) * 100);

        // 4. Algoritmo de Probabilidad de Aprobar (Weighted)
        // 40% Teoría + 60% Práctica (con penalización si hay pocas preguntas)
        let passProb = 0;
        if (totalQuestions > 0) {
            passProb = (completionRate * 0.4) + (quizAverage * 0.6);
            // Penalización por falta de datos (confianza baja)
            if (totalQuestions < 50) passProb *= 0.8; 
            if (totalQuestions < 20) passProb *= 0.5;
        } else {
            // Si solo estudia teoría pero no practica
            passProb = completionRate * 0.2; 
        }
        passProb = Math.min(99, Math.round(passProb));

        // Colores dinámicos
        const probColorClass = passProb >= 75 ? 'text-green-500' : (passProb >= 50 ? 'text-yellow-500' : 'text-red-500');
        const probBarColor = passProb >= 75 ? 'bg-green-500' : (passProb >= 50 ? 'bg-yellow-500' : 'bg-red-500');

        return `
            <div class="animate-fade-in pb-20 max-w-6xl mx-auto">
                <header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 class="text-3xl font-black text-[var(--brand-text)] mb-1">Panel de Rendimiento</h1>
                        <p class="text-[var(--brand-text-muted)]">Análisis en tiempo real de tu preparación NCLEX.</p>
                    </div>
                    <div class="text-right hidden md:block">
                        <div class="text-xs font-bold text-[var(--brand-text-muted)] uppercase">Última Sincronización</div>
                        <div class="text-sm font-bold text-[var(--brand-text)]">${new Date().toLocaleDateString()}</div>
                    </div>
                </header>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)] shadow-lg relative overflow-hidden group">
                        <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <i class="fa-solid fa-chart-line text-9xl"></i>
                        </div>
                        <h3 class="text-xs font-black text-[var(--brand-text-muted)] uppercase tracking-widest mb-2">Probabilidad de Aprobar</h3>
                        <div class="flex items-baseline gap-2">
                            <span class="text-5xl font-black ${probColorClass}">${passProb}%</span>
                            <span class="text-xs font-bold text-[var(--brand-text-muted)]">Calculado</span>
                        </div>
                        <div class="mt-4 w-full bg-[var(--brand-bg)] h-3 rounded-full overflow-hidden border border-[var(--brand-border)]">
                            <div class="h-full ${probBarColor} transition-all duration-1000" style="width: ${passProb}%"></div>
                        </div>
                        <p class="text-xs mt-3 opacity-70 text-[var(--brand-text)]">
                            ${totalQuestions < 50 ? 'Simula más exámenes para aumentar la precisión.' : 'Basado en tu rendimiento histórico.'}
                        </p>
                    </div>

                    <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)] shadow-lg">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-xs font-black text-[var(--brand-text-muted)] uppercase tracking-widest">Progreso Teórico</h3>
                            <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <i class="fa-solid fa-book-open"></i>
                            </div>
                        </div>
                        <div class="text-3xl font-black text-[var(--brand-text)]">${progress.length} <span class="text-lg text-[var(--brand-text-muted)] font-medium">/ ${totalModules}</span></div>
                        <div class="text-xs font-bold text-[var(--brand-text-muted)] mt-1">Módulos Completados</div>
                        
                        <div class="flex gap-1 h-2 mt-4">
                            ${Array(10).fill(0).map((_, i) => {
                                const active = (i * 10) < completionRate;
                                return `<div class="flex-1 rounded-full ${active ? 'bg-blue-500' : 'bg-[var(--brand-bg)]'}"></div>`;
                            }).join('')}
                        </div>
                    </div>

                    <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)] shadow-lg">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-xs font-black text-[var(--brand-text-muted)] uppercase tracking-widest">Precisión QBank</h3>
                            <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                <i class="fa-solid fa-brain"></i>
                            </div>
                        </div>
                        <div class="text-3xl font-black text-[var(--brand-text)]">${quizAverage}%</div>
                        <div class="text-xs font-bold text-[var(--brand-text-muted)] mt-1">Promedio General</div>
                        
                        <div class="mt-4 flex items-center justify-between text-xs font-bold text-[var(--brand-text-muted)] border-t border-[var(--brand-border)] pt-3">
                            <span>Preguntas: ${totalQuestions}</span>
                            <span>Correctas: ${totalCorrect}</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div class="lg:col-span-2 bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)]">
                        <h3 class="font-bold text-[var(--brand-text)] mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-clock-rotate-left text-[var(--brand-blue)]"></i> Historial Reciente
                        </h3>
                        
                        ${history.length === 0 ? `
                            <div class="text-center py-10 bg-[var(--brand-bg)] rounded-2xl border border-dashed border-[var(--brand-border)]">
                                <div class="text-4xl mb-3 opacity-20">📭</div>
                                <p class="text-sm font-bold text-[var(--brand-text-muted)]">No hay exámenes registrados.</p>
                                <button onclick="window.nclexApp.navigate('simulator')" class="mt-4 px-4 py-2 bg-[var(--brand-blue)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition">
                                    Iniciar Simulador
                                </button>
                            </div>
                        ` : `
                            <div class="space-y-3">
                                ${history.slice().reverse().slice(0, 5).map(h => {
                                    const scorePct = Math.round((h.score / h.total) * 100);
                                    const isPass = scorePct >= 60;
                                    return `
                                        <div class="flex items-center justify-between p-4 rounded-2xl bg-[var(--brand-bg)] border border-[var(--brand-border)]">
                                            <div class="flex items-center gap-4">
                                                <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white ${isPass ? 'bg-green-500' : 'bg-red-500'}">
                                                    ${scorePct}%
                                                </div>
                                                <div>
                                                    <div class="text-sm font-bold text-[var(--brand-text)]">${h.mode === 'simulator' ? 'Simulador Práctico' : 'Examen Rápido'}</div>
                                                    <div class="text-xs text-[var(--brand-text-muted)]">${new Date(h.date).toLocaleDateString()} • ${h.total} preguntas</div>
                                                </div>
                                            </div>
                                            <div class="text-xs font-black ${isPass ? 'text-green-500' : 'text-red-500'}">
                                                ${isPass ? 'APROBADO' : 'REPASAR'}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                            <div class="mt-4 text-center">
                                <p class="text-xs text-[var(--brand-text-muted)]">Mostrando los últimos 5 intentos</p>
                            </div>
                        `}
                    </div>

                    <div class="space-y-6">
                        <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)]">
                            <h3 class="font-bold text-[var(--brand-text)] mb-4">Siguientes Pasos</h3>
                            <button onclick="window.nclexApp.navigate('simulator')" class="w-full flex items-center justify-between p-4 mb-3 rounded-2xl bg-[rgb(var(--brand-blue-rgb))] text-white shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all">
                                <span class="text-sm font-bold">Practicar en Simulador</span>
                                <i class="fa-solid fa-play"></i>
                            </button>
                            <button onclick="window.BNotepad.open()" class="w-full flex items-center justify-between p-4 rounded-2xl bg-[var(--brand-bg)] text-[var(--brand-text)] border border-[var(--brand-border)] hover:border-[var(--brand-blue)] transition-colors">
                                <span class="text-sm font-bold">Revisar Mis Notas</span>
                                <i class="fa-solid fa-pen"></i>
                            </button>
                        </div>

                        <div class="bg-gradient-to-br from-slate-800 to-black p-6 rounded-3xl text-white shadow-lg">
                            <h3 class="font-bold text-sm uppercase tracking-widest text-white/70 mb-2">Consejo del Día</h3>
                            <p class="text-sm font-medium leading-relaxed">
                                "La seguridad del paciente es siempre la prioridad #1. En preguntas de priorización, busca qué paciente morirá primero si no actúas."
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }

    // Exponer a Logic.js
    window.renderAnalyticsPage = renderDashboard;

})();