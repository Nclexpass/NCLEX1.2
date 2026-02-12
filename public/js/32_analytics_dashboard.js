/* eslint-disable */
(function () {
    'use strict';
    console.log('NCLEX dashboard v2.1 loaded');

    if (!window.NCLEX || typeof window.NCLEX.registerTopic !== 'function') {
        console.warn('NCLEX registry not found. Dashboard topic not registered.');
        return;
    }

    window.NCLEX.registerTopic({
        id: 'dashboard',
        order: 32,
        name: 'Performance Dashboard',
        label_es: 'Panel de Rendimiento',
        label_en: 'Performance Dashboard',
        subtitle_es: 'Métricas, avance y recomendaciones.',
        subtitle_en: 'Metrics, progress, and recommendations.',
        icon: 'fa-solid fa-chart-line',
        iconColor: 'text-indigo-400',
        cardColor: 'bg-white/5',
        cards: [
            {
                title: 'Dashboard',
                q: 'Dashboard',
                answer: 'Este panel es un módulo adicional para ver tu avance.',
                explanation: 'Puedes expandirlo con métricas por tema, historial de simuladores, etc.'
            }
        ]
    });
})();
