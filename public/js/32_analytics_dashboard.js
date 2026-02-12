/* 32_analytics_dashboard.js — Performance Dashboard (VERSIÓN CLOUD SYNC 3.1) */
/* Integrado con Firebase Auth para restaurar progreso automáticamente */

(function () {
    'use strict';
    
    console.log('📊 NCLEX Dashboard v3.1 loading...');

    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        STORAGE_KEYS: {
            progress: 'nclex_progress',
            quizHistory: 'nclex_quiz_history',
            timeSpent: 'nclex_time_spent',
            lastVisit: 'nclex_last_visit'
        },
        COLORS: {
            primary: 'rgb(var(--brand-blue-rgb))',
            success: '#22c55e',
            warning: '#f59e0b',
            danger: '#ef4444',
            neutral: '#cbd5e1'
        }
    };

    // ===== ESTADO =====
    const state = {
        isRegistered: false,
        stats: {
            completedModules: 0,
            totalModules: 30, // Aproximado, se ajusta dinámicamente
            quizAttempts: 0,
            averageScore: 0,
            studyStreak: 0,
            totalStudyTime: 0,
            weakAreas: [],
            strongAreas: []
        }
    };

    // ===== UTILIDADES =====

    function safeGet(key, fallback) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch { return fallback; }
    }

    function formatTime(minutes) {
        if (minutes < 60) return `${minutes}m`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    }

    // ===== CÁLCULO DE ESTADÍSTICAS =====

    function calculateStats() {
        const history = safeGet(CONFIG.STORAGE_KEYS.quizHistory, []);
        const timeSpent = safeGet(CONFIG.STORAGE_KEYS.timeSpent, {});
        
        // 1. Promedios y Totales
        const totalQuizzes = history.length;
        let totalScore = 0;
        let questionCount = 0;
        
        // Agrupar por categorías
        const catStats = {};

        history.forEach(quiz => {
            totalScore += (quiz.score || 0);
            questionCount += (quiz.total || 0);
            
            // Análisis por categoría
            if (quiz.category) {
                if (!catStats[quiz.category]) catStats[quiz.category] = { correct: 0, total: 0 };
                catStats[quiz.category].correct += quiz.score;
                catStats[quiz.category].total += quiz.total;
            }
        });

        // 2. Áreas Fuertes y Débiles
        const areas = Object.entries(catStats).map(([name, data]) => ({
            name,
            score: Math.round((data.correct / data.total) * 100)
        }));

        areas.sort((a, b) => b.score - a.score); // Ordenar de mayor a menor

        // 3. Tiempo Total
        const totalMinutes = Object.values(timeSpent).reduce((a, b) => a + b, 0);

        // Actualizar estado
        state.stats = {
            quizAttempts: totalQuizzes,
            averageScore: questionCount > 0 ? Math.round((totalScore / questionCount) * 100) : 0,
            totalStudyTime: totalMinutes,
            strongAreas: areas.slice(0, 3), // Top 3
            weakAreas: areas.slice(-3).reverse() // Bottom 3
        };

        return state.stats;
    }

    // ===== RENDERIZADO (UI) =====

    function renderDashboard() {
        const s = calculateStats();
        
        // Generar HTML de áreas
        const renderAreaList = (list, icon, colorClass) => {
            if (list.length === 0) return `<div class="text-sm text-gray-400 italic py-2">Sin datos suficientes</div>`;
            return list.map(area => `
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-${icon} ${colorClass}"></i>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${area.name}</span>
                    </div>
                    <span class="text-xs font-bold px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">${area.score}%</span>
                </div>
            `).join('');
        };

        return `
            <div id="dashboard-container" class="animate-fade-in max-w-6xl mx-auto space-y-6">
                
                <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
                    <div>
                        <h2 class="text-2xl font-black text-gray-900 dark:text-white">
                            <i class="fa-solid fa-chart-pie text-blue-500 mr-2"></i>Dashboard
                        </h2>
                        <p class="text-gray-500 text-sm mt-1">Tu progreso en tiempo real</p>
                    </div>
                    <div class="flex gap-2">
                        <div class="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <span class="block text-xs text-blue-500 font-bold uppercase">Promedio</span>
                            <span class="text-xl font-black text-blue-600 dark:text-blue-400">${s.averageScore}%</span>
                        </div>
                        <div class="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <span class="block text-xs text-purple-500 font-bold uppercase">Tiempo</span>
                            <span class="text-xl font-black text-purple-600 dark:text-purple-400">${formatTime(s.totalStudyTime)}</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div class="bg-white dark:bg-[#1C1C1E] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h3 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-bolt text-yellow-500"></i> Áreas Fuertes
                        </h3>
                        <div class="space-y-3">
                            ${renderAreaList(s.strongAreas, 'trophy', 'text-yellow-500')}
                        </div>
                    </div>

                    <div class="bg-white dark:bg-[#1C1C1E] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h3 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-arrow-trend-up text-red-500"></i> Necesita Atención
                        </h3>
                        <div class="space-y-3">
                            ${renderAreaList(s.weakAreas, 'triangle-exclamation', 'text-red-500')}
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-bold">¿Listo para practicar?</h3>
                        <p class="text-blue-100 text-sm">El simulador adapta las preguntas a tus áreas débiles.</p>
                    </div>
                    <button onclick="window.nclexApp.navigate('simulator')" 
                        class="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-md hover:scale-105 transition-transform">
                        Ir al Simulador
                    </button>
                </div>

            </div>
        `;
    }

    // ===== REGISTRO EN EL SISTEMA =====

    function register() {
        if (state.isRegistered) return;

        // Esperar a que NCLEX esté listo
        if (!window.NCLEX || typeof window.NCLEX.registerTopic !== 'function') {
            setTimeout(register, 500);
            return;
        }

        window.NCLEX.registerTopic({
            id: 'dashboard',
            order: 0, // Aparecerá primero
            title: { es: 'Panel de Progreso', en: 'Progress Dashboard' },
            icon: 'chart-line',
            color: 'indigo',
            render: renderDashboard
        });

        // Registrar función global para guardar resultados de Quizzes
        window.Dashboard = {
            recordQuiz: function(category, score, total) {
                const history = safeGet(CONFIG.STORAGE_KEYS.quizHistory, []);
                
                history.unshift({
                    date: Date.now(),
                    category,
                    score,
                    total
                });

                // Mantener solo los últimos 50
                if (history.length > 50) history.pop();

                localStorage.setItem(CONFIG.STORAGE_KEYS.quizHistory, JSON.stringify(history));
                
                // Forzar sincronización inmediata si Auth está disponible
                if (window.NCLEX_AUTH && window.NCLEX_AUTH.forceSave) {
                    window.NCLEX_AUTH.forceSave();
                }
            }
        };

        state.isRegistered = true;
    }

    // ===== LISTENER DE SINCRONIZACIÓN (LA PARTE CLAVE) =====
    // Esto conecta con Auth.js para actualizar la pantalla cuando bajan datos
    window.addEventListener('nclex:dataLoaded', () => {
        console.log('☁️ Dashboard: Datos sincronizados. Actualizando...');
        calculateStats(); // Recalcular con datos nuevos
        
        // Si el usuario está viendo el dashboard, refrescarlo
        const container = document.getElementById('dashboard-container');
        if (container && window.nclexApp) {
            // Un pequeño truco para forzar el re-renderizado suave
            const currentContent = renderDashboard();
            if (currentContent !== container.innerHTML) {
                container.outerHTML = currentContent;
            }
        }
    });

    // ===== INICIALIZACIÓN =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', register);
    } else {
        register();
    }

})();