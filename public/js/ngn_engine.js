/* ngn_engine.js — Next Generation NCLEX Case Engine (Clinical Audit: PASSED) */
/* Integrates with logic.js via window.NCLEX.registerTopic */

(function () {
    'use strict';

    // --- 1. ESTADO INTERNO DEL MÓDULO ---
    let currentCaseIndex = 0;
    let currentTab = 'intro'; // intro, history, nurses, vitals, labs
    let userAnswers = new Set();
    let isSubmitted = false;

    // --- 2. BASE DE DATOS CLÍNICA (NGN CASES) ---
    const NGN_CASES = [
        {
            id: 'ngn_001_sepsis',
            title: { es: 'Caso Clínico 1: Deterioro Neurológico', en: 'Case Study 1: Neurological Decline' },
            scenario: {
                es: 'Una clienta de 78 años es traída al Departamento de Emergencias (DE) por su hija debido a un estado mental alterado.',
                en: 'A 78-year-old female client is brought to the Emergency Department (ED) by her daughter due to altered mental status.'
            },
            data: {
                history: {
                    title: { es: 'Historia Clínica / HPI', en: 'History / HPI' },
                    content: `
                        <p class="mb-2"><strong>10:00 AM:</strong></p>
                        <p class="mb-4 text-sm">
                            <span class="lang-es">La hija reporta que la madre ha estado "actuando extraño" durante 2 días. Hoy la encontró letárgica y "muy caliente al tacto". Antecedentes de Diabetes Tipo 2 e Hipertensión. Alergia a Penicilina (reacción: urticaria).</span>
                            <span class="lang-en hidden-lang">Daughter reports mother has been "acting strange" for 2 days. Found her lethargic today and "very hot to touch". History of Type 2 Diabetes and Hypertension. Allergy to Penicillin (reaction: hives).</span>
                        </p>
                    `
                },
                nurses: {
                    title: { es: 'Notas de Enfermería', en: 'Nurses Notes' },
                    content: `
                        <p class="mb-2"><strong>10:15 AM:</strong></p>
                        <p class="mb-4 text-sm">
                            <span class="lang-es">Cliente desorientada en tiempo y lugar. Responde a estímulos dolorosos pero se duerme rápidamente. Piel caliente, seca y rubicunda. Mucosas secas. Se inserta vía IV #20g en antebrazo derecho. Orina concentrada y turbia en pañal.</span>
                            <span class="lang-en hidden-lang">Client disoriented to time and place. Responds to painful stimuli but falls asleep quickly. Skin hot, dry, and flushed. Dry mucous membranes. #20g IV inserted in right forearm. Concentrated, cloudy urine noted in brief.</span>
                        </p>
                    `
                },
                vitals: {
                    title: { es: 'Signos Vitales', en: 'Vital Signs' },
                    content: `
                        <table class="w-full text-sm text-left border-collapse">
                            <tr class="border-b dark:border-white/10"><td class="py-2 font-bold">Temp</td><td class="py-2 text-red-500 font-bold">39.4°C (102.9°F)</td></tr>
                            <tr class="border-b dark:border-white/10"><td class="py-2 font-bold">HR (P)</td><td class="py-2 text-red-500 font-bold">118 bpm</td></tr>
                            <tr class="border-b dark:border-white/10"><td class="py-2 font-bold">RR</td><td class="py-2">24 rpm</td></tr>
                            <tr class="border-b dark:border-white/10"><td class="py-2 font-bold">BP</td><td class="py-2 text-orange-500">92/54 mmHg</td></tr>
                            <tr><td class="py-2 font-bold">O2 Sat</td><td class="py-2">94% (Room Air)</td></tr>
                        </table>
                    `
                },
                labs: {
                    title: { es: 'Laboratorios', en: 'Laboratory Results' },
                    content: `
                        <table class="w-full text-sm text-left border-collapse">
                            <tr class="border-b dark:border-white/10"><td class="py-2">WBC</td><td class="py-2 text-red-500 font-bold">18,500 /mm³ (H)</td></tr>
                            <tr class="border-b dark:border-white/10"><td class="py-2">Lactate</td><td class="py-2 text-red-500 font-bold">3.2 mmol/L (H)</td></tr>
                            <tr class="border-b dark:border-white/10"><td class="py-2">Creatinine</td><td class="py-2 text-orange-500">1.4 mg/dL (H)</td></tr>
                            <tr><td class="py-2">Glucose</td><td class="py-2 text-orange-500">198 mg/dL (H)</td></tr>
                        </table>
                    `
                }
            },
            question: {
                type: 'highlight', // Simulado con checkboxes
                prompt: {
                    es: 'Seleccione los 4 hallazgos que requieren seguimiento inmediato (Cues):',
                    en: 'Select the 4 findings that require immediate follow-up (Cues):'
                },
                options: [
                    { id: 1, text: { es: 'Temperatura 39.4°C', en: 'Temperature 39.4°C' }, correct: true },
                    { id: 2, text: { es: 'Alergia a Penicilina', en: 'Penicillin Allergy' }, correct: false },
                    { id: 3, text: { es: 'Presión Arterial 92/54 mmHg', en: 'BP 92/54 mmHg' }, correct: true },
                    { id: 4, text: { es: 'Frecuencia Cardíaca 118 lpm', en: 'Heart Rate 118 bpm' }, correct: true },
                    { id: 5, text: { es: 'Glucosa 198 mg/dL', en: 'Glucose 198 mg/dL' }, correct: false }, // Elevado pero no la prioridad inmediata vs sepsis shock
                    { id: 6, text: { es: 'Lactato 3.2 mmol/L', en: 'Lactate 3.2 mmol/L' }, correct: true }
                ],
                rationale: {
                    es: 'El cliente presenta signos clásicos de Sepsis severa/Shock séptico. La hipotensión (92/54), taquicardia (118), fiebre alta (39.4) y lactato elevado (>2) indican hipoperfusión tisular y requieren intervención inmediata (Protocolo de Sepsis). La alergia y la glucosa son importantes pero secundarias a la estabilización hemodinámica.',
                    en: 'Client presents with classic signs of Severe Sepsis/Septic Shock. Hypotension (92/54), Tachycardia (118), High Fever (39.4), and Elevated Lactate (>2) indicate tissue hypoperfusion requiring immediate intervention (Sepsis Bundle). Allergy and glucose are important but secondary to hemodynamic stabilization.'
                }
            }
        }
    ];

    // --- 3. FUNCIONES DEL MOTOR ---

    function renderTabsHTML(caseData) {
        const tabs = ['history', 'nurses', 'vitals', 'labs'];
        let html = '<div class="flex flex-wrap gap-2 mb-4 border-b border-gray-200 dark:border-white/10 pb-2">';
        
        tabs.forEach(t => {
            const isActive = currentTab === t;
            const titleEs = caseData.data[t].title.es;
            const titleEn = caseData.data[t].title.en;
            
            // Tailwind classes for active vs inactive tabs
            const activeClass = "bg-brand-blue text-white shadow-md";
            const inactiveClass = "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10";
            
            html += `
                <button onclick="window.NGNEngine.switchTab('${t}')" 
                    class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${isActive ? activeClass : inactiveClass}">
                    <span class="lang-es">${titleEs}</span>
                    <span class="lang-en hidden-lang">${titleEn}</span>
                </button>
            `;
        });
        html += '</div>';
        return html;
    }

    function renderContentHTML(caseData) {
        if (!caseData.data[currentTab]) return '';
        return `
            <div class="animate-fade-in bg-white dark:bg-[#1c1c1e] p-4 rounded-xl border border-gray-100 dark:border-white/5 h-full overflow-y-auto">
                <h3 class="text-brand-blue font-bold mb-3 uppercase text-xs tracking-wider">
                    <span class="lang-es">${caseData.data[currentTab].title.es}</span>
                    <span class="lang-en hidden-lang">${caseData.data[currentTab].title.en}</span>
                </h3>
                <div class="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-gray-300">
                    ${caseData.data[currentTab].content}
                </div>
            </div>
        `;
    }

    function renderQuestionHTML(c) {
        let optionsHTML = '<div class="grid grid-cols-1 gap-2">';
        
        c.question.options.forEach(opt => {
            const isSelected = userAnswers.has(opt.id);
            const isCorrect = opt.correct;
            
            let btnClass = "border-gray-200 dark:border-white/10 hover:border-brand-blue";
            let icon = '<i class="fa-regular fa-square"></i>';
            
            if (isSubmitted) {
                if (isCorrect && isSelected) {
                    btnClass = "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400";
                    icon = '<i class="fa-solid fa-check-square"></i>';
                } else if (!isCorrect && isSelected) {
                    btnClass = "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
                    icon = '<i class="fa-solid fa-xmark"></i>';
                } else if (isCorrect && !isSelected) {
                    btnClass = "border-green-500 border-dashed opacity-70";
                    icon = '<i class="fa-regular fa-square-check"></i>';
                }
            } else if (isSelected) {
                btnClass = "bg-blue-50 dark:bg-blue-900/20 border-brand-blue text-brand-blue shadow-sm";
                icon = '<i class="fa-solid fa-check-square"></i>';
            }

            optionsHTML += `
                <button onclick="window.NGNEngine.toggleOption(${opt.id})" ${isSubmitted ? 'disabled' : ''}
                    class="flex items-center gap-3 p-3 text-left rounded-lg border-2 transition-all ${btnClass}">
                    <div class="text-lg">${icon}</div>
                    <div class="text-sm font-medium">
                        <span class="lang-es">${opt.text.es}</span>
                        <span class="lang-en hidden-lang">${opt.text.en}</span>
                    </div>
                </button>
            `;
        });
        optionsHTML += '</div>';

        return `
            <div class="bg-slate-50 dark:bg-black/30 p-4 rounded-xl border border-gray-200 dark:border-white/5 h-full flex flex-col">
                <div class="flex items-center gap-2 mb-4 text-orange-500 font-bold text-xs uppercase tracking-widest">
                    <i class="fa-solid fa-brain"></i>
                    <span>NGN ITEM: RECOGNIZING CUES</span>
                </div>
                
                <p class="font-bold text-slate-800 dark:text-white mb-4">
                    <span class="lang-es">${c.question.prompt.es}</span>
                    <span class="lang-en hidden-lang">${c.question.prompt.en}</span>
                </p>

                <div class="flex-1 overflow-y-auto mb-4">
                    ${optionsHTML}
                </div>

                ${!isSubmitted ? `
                    <button onclick="window.NGNEngine.submit()" class="w-full bg-brand-blue text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-600 transition-colors">
                        <span class="lang-es">Enviar Respuesta</span>
                        <span class="lang-en hidden-lang">Submit Answer</span>
                    </button>
                ` : `
                    <div class="animate-fade-in bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800 text-sm">
                        <strong class="block text-brand-blue mb-1">Rationale / Justificación:</strong>
                        <p class="text-slate-700 dark:text-gray-300 leading-snug">
                            <span class="lang-es">${c.question.rationale.es}</span>
                            <span class="lang-en hidden-lang">${c.question.rationale.en}</span>
                        </p>
                    </div>
                `}
            </div>
        `;
    }

    // --- 4. API PÚBLICA DEL MÓDULO ---
    window.NGNEngine = {
        render: () => {
            const c = NGN_CASES[currentCaseIndex];
            
            // Layout: Split Screen (Left: Chart, Right: Question)
            return `
                <div class="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4">
                    <div class="w-full md:w-1/2 flex flex-col">
                        <div class="mb-2">
                             <h2 class="text-xl font-black text-slate-800 dark:text-white leading-tight">
                                <span class="lang-es">${c.title.es}</span>
                                <span class="lang-en hidden-lang">${c.title.en}</span>
                             </h2>
                             <p class="text-xs text-gray-500 truncate">EMR: #782392-X | LOC: ER-Bed 4</p>
                        </div>
                        
                        ${renderTabsHTML(c)}
                        <div class="flex-1 overflow-hidden relative">
                             ${renderContentHTML(c)}
                        </div>
                    </div>

                    <div class="w-full md:w-1/2 flex flex-col h-full pt-12 md:pt-0">
                        ${renderQuestionHTML(c)}
                    </div>
                </div>
            `;
        },

        switchTab: (tabName) => {
            currentTab = tabName;
            // Re-renderizar solo la vista actual (si la app lo permite) o toda la vista
            // En arquitectura simple, llamamos al render global de la app
            if (window.NCLEX) window.NCLEX.navigate('ngn'); // Hack para refrescar UI
        },

        toggleOption: (id) => {
            if (isSubmitted) return;
            if (userAnswers.has(id)) {
                userAnswers.delete(id);
            } else {
                userAnswers.add(id);
            }
            if (window.NCLEX) window.NCLEX.navigate('ngn');
        },

        submit: () => {
            if (userAnswers.size === 0) {
                if(window.NCLEX) window.NCLEX.showToast("Seleccione al menos una opción / Select at least one option");
                return;
            }
            isSubmitted = true;
            if (window.NCLEX) window.NCLEX.navigate('ngn');
        },

        reset: () => {
            currentCaseIndex = 0;
            currentTab = 'history';
            userAnswers.clear();
            isSubmitted = false;
        }
    };

    // --- 5. REGISTRO EN EL SISTEMA PRINCIPAL ---
    if (window.NCLEX) {
        window.NCLEX.registerTopic({
            id: 'ngn',
            title: { es: 'Casos Clínicos NGN', en: 'NGN Case Studies' },
            subtitle: { es: 'Práctica de Escenarios', en: 'Scenario Practice' },
            icon: 'user-doctor', // Requiere FontAwesome
            color: 'purple',
            render: () => window.NGNEngine.render()
        });
    }

})();
