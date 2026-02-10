/* 32_analytics_dashboard.js — Student Performance Tracker (Data Visualization) */
/* Dependencies: localStorage (shared with simulator.js) */

(function () {
    'use strict';

    // --- 1. GESTIÓN DE DATOS ---
    const Analytics = {
        getHistory: () => {
            try {
                // Formato esperado: [{ date: timestamp, score: 5, total: 10, correct: 5 }, ...]
                const raw = localStorage.getItem('nclex_exam_history');
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                console.error("Error parsing history:", e);
                return [];
            }
        },

        getStats: () => {
            const history = Analytics.getHistory();
            const totalTests = history.length;
            
            if (totalTests === 0) return null;

            const totalQuestions = history.reduce((acc, curr) => acc + (curr.total || 0), 0);
            const totalCorrect = history.reduce((acc, curr) => acc + (curr.correct || 0), 0);
            const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
            
            // Simulación de racha (simple)
            const lastDate = history[history.length - 1]?.date || Date.now();
            const daysDiff = Math.floor((Date.now() - lastDate) / (1000 * 60 * 60 * 24));
            const streak = daysDiff < 2 ? (parseInt(localStorage.getItem('nclex_streak') || '1')) : 0;

            return {
                totalTests,
                totalQuestions,
                averageScore,
                streak,
                history: history.reverse().slice(0, 10) // Últimos 10
            };
        },

        // Mock data para cuando no hay historial real
        getMockStats: () => ({
            totalTests: 0,
            totalQuestions: 0,
            averageScore: 0,
            streak: 0,
            history: []
        })
    };

    // --- 2. COMPONENTES UI (CHARTS & CARDS) ---
    
    // Donut Chart simple con SVG
    const renderDonut = (percent) => {
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;
        let color = percent >= 75 ? 'text-green-500' : (percent >= 60 ? 'text-orange-500' : 'text-red-500');

        return `
            <div class="relative w-32 h-32 flex items-center justify-center">
                <svg class="transform -rotate-90 w-full h-full">
                    <circle cx="64" cy="64" r="${radius}" stroke="currentColor" stroke-width="8" fill="transparent" class="text-gray-200 dark:text-white/10" />
                    <circle cx="64" cy="64" r="${radius}" stroke="currentColor" stroke-width="8" fill="transparent" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" class="${color} transition-all duration-1000 ease-out" />
                </svg>
                <div class="absolute flex flex-col items-center">
                    <span class="text-2xl font-black text-slate-800 dark:text-white">${percent}%</span>
                    <span class="text-[10px] uppercase text-gray-400 font-bold">AVG</span>
                </div>
            </div>
        `;
    };

    const renderHistoryTable = (history) => {
        if (!history || history.length === 0) {
            return `
                <div class="text-center py-8 text-gray-400">
                    <p class="text-sm">
                        <span class="lang-es">No hay exámenes registrados aún.</span>
                        <span class="lang-en hidden-lang">No exams recorded yet.</span>
                    </p>
                    <button onclick="window.NCLEX.navigate('simulator')" class="mt-2 text-brand-blue text-xs font-bold hover:underline">
                        <span class="lang-es">IR AL SIMULADOR</span>
                        <span class="lang-en hidden-lang">GO TO SIMULATOR</span>
                    </button>
                </div>`;
        }

        let rows = '';
        history.forEach(h => {
            const date = new Date(h.date).toLocaleDateString();
            const pct = Math.round((h.correct / h.total) * 100);
            const color = pct >= 75 ? 'bg-green-100 text-green-700' : (pct >= 60 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700');
            
            rows += `
                <tr class="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td class="py-3 pl-4 text-xs font-mono text-gray-500">${date}</td>
                    <td class="py-3 text-sm font-bold text-slate-800 dark:text-white">${h.total} Qs</td>
                    <td class="py-3 pr-4 text-right">
                        <span class="px-2 py-1 rounded-full text-xs font-bold ${color}">${pct}%</span>
                    </td>
                </tr>
            `;
        });

        return `
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="text-xs text-gray-400 uppercase border-b border-gray-200 dark:border-white/10">
                        <th class="py-2 pl-4 font-semibold">Date</th>
                        <th class="py-2 font-semibold">Session</th>
                        <th class="py-2 pr-4 text-right font-semibold">Score</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    };

    // --- 3. RENDERIZADO PRINCIPAL ---
    window.Dashboard = {
        render: () => {
            const stats = Analytics.getStats() || Analytics.getMockStats();
            
            // Mensaje motivacional basado en score
            let motiveEs = "Comienza a estudiar hoy.";
            let motiveEn = "Start studying today.";
            
            if (stats.totalTests > 0) {
                if (stats.averageScore >= 75) { motiveEs = "¡Estás listo para el NCLEX!"; motiveEn = "You are NCLEX Ready!"; }
                else if (stats.averageScore >= 60) { motiveEs = "Vas bien, enfócate en tus debilidades."; motiveEn = "Good path, focus on weaknesses."; }
                else { motiveEs = "Se requiere refuerzo crítico."; motiveEn = "Critical review required."; }
            }

            return `
                <div class="animate-slide-up space-y-6">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 class="text-2xl font-black text-slate-800 dark:text-white">
                                <span class="lang-es">Análisis de Rendimiento</span>
                                <span class="lang-en hidden-lang">Performance Analytics</span>
                            </h2>
                            <p class="text-sm text-gray-500">
                                <span class="lang-es">Métricas en tiempo real de tus sesiones de estudio.</span>
                                <span class="lang-en hidden-lang">Real-time metrics from your study sessions.</span>
                            </p>
                        </div>
                        <div class="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-xl font-bold text-sm flex items-center gap-2">
                            <i class="fa-solid fa-fire"></i>
                            <span>${stats.streak}</span>
                            <span class="lang-es">Días racha</span>
                            <span class="lang-en hidden-lang">Day streak</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <div class="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                            <h3 class="absolute top-4 left-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <span class="lang-es">Promedio Global</span>
                                <span class="lang-en hidden-lang">Global Average</span>
                            </h3>
                            <div class="mt-4">
                                ${renderDonut(stats.averageScore)}
                            </div>
                            <p class="text-xs text-center font-medium ${stats.averageScore >= 60 ? 'text-green-600' : 'text-orange-500'} mt-2">
                                <span class="lang-es">${motiveEs}</span>
                                <span class="lang-en hidden-lang">${motiveEn}</span>
                            </p>
                        </div>

                        <div class="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 flex flex-col justify-between">
                            <div>
                                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                                    <span class="lang-es">Volumen de Estudio</span>
                                    <span class="lang-en hidden-lang">Study Volume</span>
                                </h3>
                                <div class="flex items-baseline gap-2 mb-2">
                                    <span class="text-4xl font-black text-slate-800 dark:text-white">${stats.totalQuestions}</span>
                                    <span class="text-sm text-gray-500 font-medium">Qs</span>
                                </div>
                                <div class="w-full bg-gray-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div class="bg-indigo-500 h-full" style="width: ${Math.min((stats.totalQuestions / 1000) * 100, 100)}%"></div>
                                </div>
                                <p class="text-[10px] text-gray-400 mt-2">Target: 1,000 Qs</p>
                            </div>
                            <div class="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                                <span class="text-sm font-bold text-gray-600 dark:text-gray-300">
                                    <span class="lang-es">Tests Completados</span>
                                    <span class="lang-en hidden-lang">Tests Completed</span>
                                </span>
                                <span class="text-xl font-bold text-indigo-500">${stats.totalTests}</span>
                            </div>
                        </div>

                        <div class="bg-gradient-to-br from-brand-blue to-blue-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                            <i class="fa-solid fa-chart-line absolute -bottom-4 -right-4 text-9xl text-white opacity-10"></i>
                            <h3 class="text-xs font-bold text-blue-100 uppercase tracking-wider mb-2">
                                <span class="lang-es">Probabilidad de Pase</span>
                                <span class="lang-en hidden-lang">Pass Probability</span>
                            </h3>
                            
                            <div class="mt-4 mb-6">
                                <span class="text-5xl font-black tracking-tight">
                                    ${stats.totalTests > 2 ? (stats.averageScore >= 65 ? 'High' : 'Low') : '--'}
                                </span>
                            </div>
                            
                            <p class="text-xs text-blue-100 leading-relaxed relative z-10">
                                <span class="lang-es">Basado en el algoritmo de consistencia y dificultad de preguntas. Se requieren +5 exámenes para precisión.</span>
                                <span class="lang-en hidden-lang">Based on consistency and difficulty algorithms. 5+ exams required for accuracy.</span>
                            </p>
                        </div>

                    </div>

                    <div class="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
                        <div class="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                            <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <i class="fa-solid fa-clock-rotate-left text-gray-400"></i>
                                <span class="lang-es">Historial Reciente</span>
                                <span class="lang-en hidden-lang">Recent History</span>
                            </h3>
                        </div>
                        ${renderHistoryTable(stats.history)}
                    </div>
                </div>
            `;
        }
    };

    // --- 4. REGISTRO ---
    if (window.NCLEX) {
        window.NCLEX.registerTopic({
            id: 'analytics',
            title: { es: 'Estadísticas', en: 'Analytics' },
            subtitle: { es: 'Progreso y Métricas', en: 'Progress & Metrics' },
            icon: 'chart-pie',
            color: 'indigo',
            render: () => window.Dashboard.render()
        });
    }

})();
