/* 32_analytics_dashboard.js — Performance Dashboard (VERSIÓN CORREGIDA 3.0) */

(function () {
    'use strict';
    
    console.log('📊 NCLEX Dashboard v3.0 loading...');

    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        STORAGE_KEYS: {
            progress: 'nclex_progress',
            quizHistory: 'nclex_quiz_history',
            timeSpent: 'nclex_time_spent',
            lastVisit: 'nclex_last_visit'
        },
        CHART_COLORS: {
            primary: 'rgb(var(--brand-blue-rgb))',
            success: '#22c55e',
            warning: '#f59e0b',
            danger: '#ef4444',
            neutral: 'rgba(var(--brand-text-muted), 0.3)'
        }
    };

    // ===== ESTADO DEL DASHBOARD =====
    const state = {
        isRegistered: false,
        stats: {
            completedModules: 0,
            totalModules: 0,
            quizAttempts: 0,
            averageScore: 0,
            studyStreak: 0,
            totalStudyTime: 0,
            weakAreas: [],
            strongAreas: []
        }
    };

    // ===== UTILIDADES =====

    function safeStorageGet(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn(`Error reading ${key}:`, e);
            return defaultValue;
        }
    }

    function safeStorageSet(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn(`Error saving ${key}:`, e);
            return false;
        }
    }

    function formatDuration(minutes) {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }

    function getRelativeTime(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Hoy';
        if (days === 1) return 'Ayer';
        if (days < 7) return `Hace ${days} días`;
        if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
        return `Hace ${Math.floor(days / 30)} meses`;
    }

    // ===== CÁLCULO DE ESTADÍSTICAS =====

    function calculateStats() {
        const topics = window.nclexApp?.getTopics() || [];
        const completed = safeStorageGet(CONFIG.STORAGE_KEYS.progress, []);
        const quizHistory = safeStorageGet(CONFIG.STORAGE_KEYS.quizHistory, []);
        const timeSpent = safeStorageGet(CONFIG.STORAGE_KEYS.timeSpent, {});
        const lastVisit = safeStorageGet(CONFIG.STORAGE_KEYS.lastVisit);

        // Actualizar visita
        const today = new Date().toISOString().split('T')[0];
        if (lastVisit !== today) {
            safeStorageSet(CONFIG.STORAGE_KEYS.lastVisit, today);
        }

        // Calcular racha de estudio
        state.stats.studyStreak = calculateStreak();

        // Módulos
        state.stats.totalModules = topics.length;
        state.stats.completedModules = completed.length;

        // Quiz stats
        state.stats.quizAttempts = quizHistory.length;
        state.stats.averageScore = quizHistory.length > 0
            ? Math.round(quizHistory.reduce((a, b) => a + (b.score || 0), 0) / quizHistory.length)
            : 0;

        // Tiempo total
        state.stats.totalStudyTime = Object.values(timeSpent).reduce((a, b) => a + b, 0);

        // Áreas fuertes y débiles (basado en quiz history por categoría)
        const categoryScores = {};
        quizHistory.forEach(quiz => {
            if (!quiz.category) return;
            if (!categoryScores[quiz.category]) {
                categoryScores[quiz.category] = { total: 0, count: 0 };
            }
            categoryScores[quiz.category].total += quiz.score || 0;
            categoryScores[quiz.category].count++;
        });

        const categoryAverages = Object.entries(categoryScores).map(([cat, data]) => ({
            category: cat,
            average: data.total / data.count
        })).sort((a, b) => b.average - a.average);

        state.stats.strongAreas = categoryAverages.slice(0, 3).filter(a => a.average >= 70);
        state.stats.weakAreas = categoryAverages.slice(-3).filter(a => a.average < 70).reverse();

        return state.stats;
    }

    function calculateStreak() {
        // Simplificado: contar días consecutivos con actividad
        // En producción, esto vendría de un log detallado
        return safeStorageGet('nclex_streak', 0);
    }

    // ===== RENDERIZADO =====

    function renderDashboard() {
        const stats = calculateStats();
        const isEs = (localStorage.getItem('nclex_lang') || 'es') === 'es';
        const percentComplete = stats.totalModules > 0 
            ? Math.round((stats.completedModules / stats.totalModules) * 100) 
            : 0;

        // Determinar mensaje motivacional
        let motivationMessage = isEs 
            ? '¡Empieza tu viaje hacia el NCLEX!' 
            : 'Start your NCLEX journey!';
        
        if (stats.studyStreak > 0) {
            motivationMessage = isEs
                ? `🔥 ¡Racha de ${stats.studyStreak} días! ¡Sigue así!`
                : `🔥 ${stats.studyStreak} day streak! Keep it up!`;
        } else if (percentComplete > 0) {
            motivationMessage = isEs
                ? `Vas por buen camino. ¡${percentComplete}% completado!`
                : `You're on track. ${percentComplete}% completed!`;
        }

        return `
            <div class="p-6 max-w-7xl mx-auto animate-fade-in">
                <!-- Header -->
                <div class="mb-8">
                    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 class="text-3xl md:text-4xl font-black text-[var(--brand-text)] mb-2">
                                <i class="fa-solid fa-chart-line mr-3" style="color: rgb(var(--brand-blue-rgb));"></i>
                                ${isEs ? 'Panel de Rendimiento' : 'Performance Dashboard'}
                            </h1>
                            <p class="text-[var(--brand-text-muted)] text-lg">${motivationMessage}</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.Dashboard.refresh()" 
                                class="px-4 py-2 rounded-xl bg-[var(--brand-card)] border border-[var(--brand-border)] text-[var(--brand-text)] hover:bg-[var(--brand-bg)] transition flex items-center gap-2">
                                <i class="fa-solid fa-rotate"></i>
                                ${isEs ? 'Actualizar' : 'Refresh'}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    ${renderStatCard({
                        icon: 'book-open',
                        value: `${stats.completedModules}/${stats.totalModules}`,
                        label: isEs ? 'Módulos' : 'Modules',
                        color: CONFIG.CHART_COLORS.primary,
                        subtext: `${percentComplete}%`
                    })}
                    ${renderStatCard({
                        icon: 'brain',
                        value: stats.quizAttempts,
                        label: isEs ? 'Quizzes' : 'Quizzes',
                        color: CONFIG.CHART_COLORS.success,
                        subtext: stats.averageScore > 0 ? `${stats.averageScore}% avg` : null
                    })}
                    ${renderStatCard({
                        icon: 'fire',
                        value: stats.studyStreak,
                        label: isEs ? 'Días racha' : 'Day streak',
                        color: CONFIG.CHART_COLORS.warning,
                        subtext: stats.studyStreak > 5 ? (isEs ? '¡Increíble!' : 'Amazing!') : null
                    })}
                    ${renderStatCard({
                        icon: 'clock',
                        value: formatDuration(stats.totalStudyTime),
                        label: isEs ? 'Tiempo estudio' : 'Study time',
                        color: CONFIG.CHART_COLORS.neutral,
                        subtext: null
                    })}
                </div>

                <!-- Progress Section -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <!-- Main Progress -->
                    <div class="lg:col-span-2 bg-[var(--brand-card)] rounded-3xl p-6 border border-[var(--brand-border)] shadow-lg">
                        <h2 class="text-xl font-bold text-[var(--brand-text)] mb-4">
                            ${isEs ? 'Progreso por Categoría' : 'Progress by Category'}
                        </h2>
                        <div class="space-y-4">
                            ${renderCategoryProgress()}
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="bg-[var(--brand-card)] rounded-3xl p-6 border border-[var(--brand-border)] shadow-lg">
                        <h2 class="text-xl font-bold text-[var(--brand-text)] mb-4">
                            ${isEs ? 'Acciones Rápidas' : 'Quick Actions'}
                        </h2>
                        <div class="space-y-3">
                            <button onclick="window.nclexApp.navigate('simulator')" 
                                class="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-left hover:opacity-90 transition group">
                                <div class="flex items-center gap-3">
                                    <i class="fa-solid fa-play text-xl group-hover:scale-110 transition-transform"></i>
                                    <div>
                                        <div class="font-bold">${isEs ? 'Iniciar Quiz' : 'Start Quiz'}</div>
                                        <div class="text-xs opacity-80">${isEs ? 'Práctica adaptativa' : 'Adaptive practice'}</div>
                                    </div>
                                </div>
                            </button>
                            
                            <button onclick="window.nclexApp.navigate('home')" 
                                class="w-full p-4 rounded-2xl bg-[var(--brand-bg)] border border-[var(--brand-border)] text-[var(--brand-text)] text-left hover:bg-[rgba(var(--brand-blue-rgb),0.05)] transition">
                                <div class="flex items-center gap-3">
                                    <i class="fa-solid fa-book" style="color: rgb(var(--brand-blue-rgb));"></i>
                                    <div>
                                        <div class="font-bold">${isEs ? 'Estudiar Módulos' : 'Study Modules'}</div>
                                        <div class="text-xs text-[var(--brand-text-muted)]">${isEs ? 'Contenido estructurado' : 'Structured content'}</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Strengths & Weaknesses -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${renderAreasSection('strong', isEs)}
                    ${renderAreasSection('weak', isEs)}
                </div>

                <!-- Recent Activity -->
                <div class="mt-8 bg-[var(--brand-card)] rounded-3xl p-6 border border-[var(--brand-border)] shadow-lg">
                    <h2 class="text-xl font-bold text-[var(--brand-text)] mb-4">
                        ${isEs ? 'Actividad Reciente' : 'Recent Activity'}
                    </h2>
                    ${renderRecentActivity(isEs)}
                </div>
            </div>
        `;
    }

    function renderStatCard({ icon, value, label, color, subtext }) {
        return `
            <div class="bg-[var(--brand-card)] rounded-2xl p-5 border border-[var(--brand-border)] shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center" 
                         style="background: ${color.replace('rgb', 'rgba').replace(')', ', 0.1)')}; color: ${color};">
                        <i class="fa-solid fa-${icon}"></i>
                    </div>
                    ${subtext ? `<span class="text-xs font-medium px-2 py-1 rounded-full bg-[var(--brand-bg)] text-[var(--brand-text-muted)]">${subtext}</span>` : ''}
                </div>
                <div class="text-2xl font-black text-[var(--brand-text)]">${value}</div>
                <div class="text-sm text-[var(--brand-text-muted)]">${label}</div>
            </div>
        `;
    }

    function renderCategoryProgress() {
        const topics = window.nclexApp?.getTopics() || [];
        const completed = safeStorageGet(CONFIG.STORAGE_KEYS.progress, []);
        
        // Agrupar por categorías (usar color como agrupador simple)
        const categories = {};
        topics.forEach(t => {
            const color = t.color || 'blue';
            if (!categories[color]) {
                categories[color] = { total: 0, completed: 0, topics: [] };
            }
            categories[color].total++;
            categories[color].topics.push(t);
            if (completed.includes(t.id)) {
                categories[color].completed++;
            }
        });

        return Object.entries(categories).map(([color, data]) => {
            const percent = Math.round((data.completed / data.total) * 100);
            const colorData = getColorData(color);
            
            return `
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-lg ${colorData.bg} flex items-center justify-center text-white flex-shrink-0">
                        <i class="fa-solid fa-${data.topics[0]?.icon || 'book'}"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between mb-1">
                            <span class="font-medium text-[var(--brand-text)] text-sm">${colorData.label}</span>
                            <span class="text-sm text-[var(--brand-text-muted)]">${data.completed}/${data.total}</span>
                        </div>
                        <div class="h-2 bg-[var(--brand-bg)] rounded-full overflow-hidden">
                            <div class="h-full ${colorData.bg} transition-all duration-500" style="width: ${percent}%"></div>
                        </div>
                    </div>
                    <span class="text-sm font-bold ${colorData.text} w-12 text-right">${percent}%</span>
                </div>
            `;
        }).join('');
    }

    function renderAreasSection(type, isEs) {
        const isStrong = type === 'strong';
        const areas = isStrong ? state.stats.strongAreas : state.stats.weakAreas;
        const title = isStrong 
            ? (isEs ? '💪 Áreas Fuertes' : '💪 Strong Areas')
            : (isEs ? '📚 Áreas a Mejorar' : '📚 Areas to Improve');
        const emptyMsg = isStrong
            ? (isEs ? 'Completa más quizzes para ver tus fortalezas' : 'Complete more quizzes to see your strengths')
            : (isEs ? '¡Sigue practicando para mejorar!' : 'Keep practicing to improve!');

        return `
            <div class="bg-[var(--brand-card)] rounded-3xl p-6 border border-[var(--brand-border)] shadow-lg">
                <h3 class="text-lg font-bold text-[var(--brand-text)] mb-4">${title}</h3>
                ${areas.length > 0 ? `
                    <div class="space-y-3">
                        ${areas.map(area => `
                            <div class="flex items-center justify-between p-3 rounded-xl bg-[var(--brand-bg)]">
                                <span class="font-medium text-[var(--brand-text)]">${area.category}</span>
                                <span class="text-sm font-bold ${isStrong ? 'text-green-600' : 'text-amber-600'}">
                                    ${Math.round(area.average)}%
                                </span>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="text-center py-8 text-[var(--brand-text-muted)]">
                        <i class="fa-solid fa-chart-pie text-3xl mb-3 opacity-50"></i>
                        <p class="text-sm">${emptyMsg}</p>
                    </div>
                `}
            </div>
        `;
    }

    function renderRecentActivity(isEs) {
        const quizHistory = safeStorageGet(CONFIG.STORAGE_KEYS.quizHistory, []).slice(-5).reverse();
        
        if (quizHistory.length === 0) {
            return `
                <div class="text-center py-8 text-[var(--brand-text-muted)]">
                    <i class="fa-solid fa-clipboard-list text-3xl mb-3 opacity-50"></i>
                    <p>${isEs ? 'No hay actividad reciente. ¡Empieza a estudiar!' : 'No recent activity. Start studying!'}</p>
                </div>
            `;
        }

        return `
            <div class="space-y-3">
                ${quizHistory.map((quiz, index) => {
                    const scoreColor = quiz.score >= 80 ? 'text-green-600' : quiz.score >= 60 ? 'text-amber-600' : 'text-red-600';
                    const scoreBg = quiz.score >= 80 ? 'bg-green-100 dark:bg-green-900/30' : quiz.score >= 60 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30';
                    
                    return `
                        <div class="flex items-center gap-4 p-4 rounded-2xl bg-[var(--brand-bg)] hover:bg-[rgba(var(--brand-blue-rgb),0.05)] transition">
                            <div class="w-10 h-10 rounded-full ${scoreBg} ${scoreColor} flex items-center justify-center font-bold">
                                ${quiz.score}%
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-[var(--brand-text)]">${quiz.category || (isEs ? 'Quiz General' : 'General Quiz')}</div>
                                <div class="text-sm text-[var(--brand-text-muted)]">${getRelativeTime(quiz.date)}</div>
                            </div>
                            <i class="fa-solid fa-chevron-right text-[var(--brand-text-muted)]"></i>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function getColorData(colorName) {
        const map = {
            blue:   { bg: 'bg-blue-500',   text: 'text-blue-600',   label: 'Fundamentos' },
            purple: { bg: 'bg-purple-500', text: 'text-purple-600', label: 'Farmacología' },
            green:  { bg: 'bg-green-500',  text: 'text-green-600',  label: 'Pediatría' },
            red:    { bg: 'bg-red-500',    text: 'text-red-600',    label: 'Emergencias' },
            orange: { bg: 'bg-orange-500', text: 'text-orange-600', label: 'Maternidad' },
            teal:   { bg: 'bg-teal-500',   text: 'text-teal-600',   label: 'Salud Mental' },
            indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', label: 'Cirugía' },
            yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', label: 'Geriatría' }
        };
        return map[colorName] || { bg: 'bg-gray-500', text: 'text-gray-600', label: 'General' };
    }

    // ===== API PÚBLICA =====

    window.Dashboard = {
        refresh() {
            const view = document.getElementById('app-view');
            if (view && state.isRegistered) {
                view.innerHTML = renderDashboard();
                if (typeof window.applyGlobalLanguage === 'function') {
                    window.applyGlobalLanguage();
                }
            }
        },
        
        recordQuiz(category, score, totalQuestions) {
            const history = safeStorageGet(CONFIG.STORAGE_KEYS.quizHistory, []);
            history.push({
                category,
                score: Math.round((score / totalQuestions) * 100),
                date: new Date().toISOString(),
                totalQuestions
            });
            // Mantener solo últimos 50
            if (history.length > 50) history.shift();
            safeStorageSet(CONFIG.STORAGE_KEYS.quizHistory, history);
        },
        
        recordStudyTime(moduleId, minutes) {
            const timeSpent = safeStorageGet(CONFIG.STORAGE_KEYS.timeSpent, {});
            timeSpent[moduleId] = (timeSpent[moduleId] || 0) + minutes;
            safeStorageSet(CONFIG.STORAGE_KEYS.timeSpent, timeSpent);
        },
        
        getStats() {
            return calculateStats();
        }
    };

    // ===== REGISTRO EN SISTEMA =====

    function register() {
        if (state.isRegistered) return;
        if (!window.NCLEX || typeof window.NCLEX.registerTopic !== 'function') {
            console.warn('NCLEX registry not found. Retrying...');
            setTimeout(register, 500);
            return;
        }

        window.NCLEX.registerTopic({
            id: 'dashboard',
            order: 0,
            title: {
                es: 'Panel de Rendimiento',
                en: 'Performance Dashboard'
            },
            icon: 'chart-line',
            color: 'indigo',
            render: renderDashboard
        });

        state.isRegistered = true;
        console.log('✅ Dashboard registered successfully');
    }

    // ===== INICIALIZACIÓN =====

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', register);
    } else {
        register();
    }

})();