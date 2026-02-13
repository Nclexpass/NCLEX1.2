/* 32_analytics_dashboard.js — Student Performance Analytics v4.1 
   UPDATES: Fixed icon layout, Didactic Breakdown, NCLEX Pass Probability
*/

(function () {
    'use strict';

    // ===== DEPENDENCIAS =====
    const $ = (sel) => document.querySelector(sel);
    const U = window.NCLEXUtils || { storageGet: (k,d)=>JSON.parse(localStorage.getItem(k))||d };

    // ===== RENDERIZADOR PRINCIPAL =====
    function renderDashboard() {
        // 1. Obtener Datos Reales
        const progress = U.storageGet('nclex_progress', []);
        // Simulamos stats del QBank si no hay suficientes datos
        const qbankStats = U.storageGet('sim_stats', { 
            totalQuestions: 0, 
            correct: 0, 
            weakness: ['Pharmacology', 'Physiological Adaptation'], 
            strength: ['Safety', 'Basic Care'] 
        });

        // Calculos
        const totalModules = 30; // Aproximado
        const completionRate = Math.round((progress.length / totalModules) * 100);
        const qbankScore = qbankStats.totalQuestions > 0 
            ? Math.round((qbankStats.correct / qbankStats.totalQuestions) * 100) 
            : 0;

        // Probabilidad de Aprobar (Algoritmo simple)
        let passProb = Math.min(99, (completionRate * 0.4) + (qbankScore * 0.6));
        if (qbankStats.totalQuestions < 50) passProb = passProb * 0.5; // Penalización por poca data
        passProb = Math.round(passProb);

        // Colores dinámicos para la probabilidad
        const probColor = passProb > 75 ? 'text-green-500' : (passProb > 40 ? 'text-yellow-500' : 'text-red-500');

        return `
            <div class="animate-fade-in pb-20">
                <header class="mb-8">
                    <h1 class="text-3xl font-black text-[var(--brand-text)] mb-2">Panel de Rendimiento</h1>
                    <p class="text-[var(--brand-text-muted)]">Análisis de preparación para el NCLEX-RN</p>
                </header>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    
                    <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)] shadow-lg relative overflow-hidden">
                        <div class="absolute top-0 right-0 p-4 opacity-5">
                            <i class="fa-solid fa-chart-pie text-9xl"></i>
                        </div>
                        <h3 class="text-sm font-bold text-[var(--brand-text-muted)] uppercase tracking-wider mb-2">Probabilidad de Aprobar</h3>
                        <div class="flex items-end gap-2">
                            <span class="text-5xl font-black ${probColor}">${passProb}%</span>
                            <span class="text-sm mb-2 text-[var(--brand-text-muted)]">Calculado</span>
                        </div>
                        <div class="mt-4 w-full bg-[var(--brand-bg)] h-2 rounded-full overflow-hidden">
                            <div class="h-full bg-current ${probColor}" style="width: ${passProb}%"></div>
                        </div>
                        <p class="text-xs mt-3 opacity-70 text-[var(--brand-text)]">Basado en módulos completados y puntaje del QBank.</p>
                    </div>

                    <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)] shadow-lg">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-sm font-bold text-[var(--brand-text-muted)] uppercase tracking-wider">Temario</h3>
                                <div class="text-3xl font-black text-[var(--brand-text)] mt-1">${progress.length} / ${totalModules}</div>
                                <div class="text-xs text-green-600 font-bold mt-1">Módulos Completados</div>
                            </div>
                            <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-xl">
                                <i class="fa-solid fa-book-open"></i>
                            </div>
                        </div>
                        <div class="flex gap-1 h-3 mt-4">
                            ${Array(10).fill(0).map((_, i) => {
                                const active = (i * 10) < completionRate;
                                return `<div class="flex-1 rounded-full ${active ? 'bg-blue-500' : 'bg-[var(--brand-bg)]'}"></div>`;
                            }).join('')}
                        </div>
                    </div>

                    <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)] shadow-lg">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-sm font-bold text-[var(--brand-text-muted)] uppercase tracking-wider">QBank Score</h3>
                                <div class="text-3xl font-black text-[var(--brand-text)] mt-1">${qbankScore}%</div>
                                <div class="text-xs text-[var(--brand-text-muted)] mt-1">${qbankStats.totalQuestions} preguntas respondidas</div>
                            </div>
                            <div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center text-xl">
                                <i class="fa-solid fa-brain"></i>
                            </div>
                        </div>
                         <button onclick="window.nclexApp.navigate('simulator')" class="w-full py-2 rounded-lg bg-[var(--brand-bg)] text-xs font-bold text-[var(--brand-text)] hover:bg-[var(--brand-border)] transition">
                            Ir al Banco de Preguntas
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)]">
                        <h3 class="font-bold text-[var(--brand-text)] mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-triangle-exclamation text-orange-500"></i> Áreas a Mejorar
                        </h3>
                        <div class="space-y-3">
                            ${qbankStats.weakness.map(topic => `
                                <div class="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30">
                                    <span class="text-sm font-medium text-orange-800 dark:text-orange-200">${topic}</span>
                                    <button class="text-xs bg-white dark:bg-black/20 px-3 py-1 rounded-lg font-bold text-orange-600 hover:scale-105 transition">Repasar</button>
                                </div>
                            `).join('')}
                            ${qbankStats.weakness.length === 0 ? '<p class="text-sm text-[var(--brand-text-muted)]">No hay datos suficientes aún.</p>' : ''}
                        </div>
                    </div>

                    <div class="bg-[var(--brand-card)] p-6 rounded-3xl border border-[var(--brand-border)]">
                        <h3 class="font-bold text-[var(--brand-text)] mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-medal text-green-500"></i> Tus Fortalezas
                        </h3>
                        <div class="space-y-3">
                            ${qbankStats.strength.map(topic => `
                                <div class="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30">
                                    <span class="text-sm font-medium text-green-800 dark:text-green-200">${topic}</span>
                                    <i class="fa-solid fa-check-circle text-green-500"></i>
                                </div>
                            `).join('')}
                             ${qbankStats.strength.length === 0 ? '<p class="text-sm text-[var(--brand-text-muted)]">No hay datos suficientes aún.</p>' : ''}
                        </div>
                    </div>

                </div>
            </div>
        `;
    }

    // Exponer
    window.renderAnalyticsPage = renderDashboard;

})();