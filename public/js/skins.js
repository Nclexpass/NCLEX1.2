// skins.js — Professional Selection: 4 Distinctive Premium Skins
// Diseñados con obsesión por el detalle, legibilidad y personalidad única.

(function() {
    'use strict';

    // ===== 4 SKINS ÚNICOS =====
    const SKINS = [
        {
            id: "clinical-calm",
            name: "Clinical Calm",
            nameEs: "Calma Clínica",
            icon: "heart-pulse",
            colors: ["#E0F2E9", "#2E7D5E", "#1A2E2A"],
            animation: "float-slow",
            description: "Inspirado en entornos hospitalarios, con verdes suaves y alta claridad."
        },
        {
            id: "classic-glossy",
            name: "Classic Glossy",
            nameEs: "Brillo Clásico",
            icon: "gem",
            colors: ["#1D4E89", "#F0F7FF", "#0A2A44"],
            animation: "shimmer",
            description: "Estilo skeuomorphic con botones brillantes y profundidad real."
        },
        {
            id: "frosted-depth",
            name: "Frosted Depth",
            nameEs: "Profundidad Esmerilada",
            icon: "cube",
            colors: ["#F2F2F7", "#5856D6", "#1C1C1E"],
            animation: "float-slow",
            description: "Vidrio esmerilado moderno, perfecto para modos claro y oscuro."
        },
        {
            id: "cyber-edge",
            name: "Cyber Edge",
            nameEs: "Borde Cibernético",
            icon: "microchip",
            colors: ["#0A0E27", "#2DD4BF", "#E2E8F0"],
            animation: "glow-breathe",
            description: "Toques neón sutiles sobre fondo oscuro elegante."
        }
    ];

    // ===== ESTILOS PREMIUM DETALLADOS =====
    const PREMIUM_CSS = `
        /* ===== ANIMACIONES ===== */
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        .shimmer {
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
            background-size: 200% 100%;
            animation: shimmer 3s infinite;
        }
        @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
        }
        .float-slow { animation: float-slow 5s ease-in-out infinite; }
        @keyframes glow-breathe {
            0%, 100% { filter: drop-shadow(0 0 3px currentColor); }
            50% { filter: drop-shadow(0 0 10px currentColor); }
        }
        .glow-breathe { animation: glow-breathe 3s ease-in-out infinite; }

        /* ===== SKIN: CLINICAL CALM ===== */
        .skin-clinical-calm {
            --brand-primary: #2E7D5E;
            --brand-primary-rgb: 46, 125, 94;
            --brand-bg: #F0F7F4;
            --brand-card: #FFFFFF;
            --brand-border: #D0E5DA;
            --brand-text: #1A2E2A;
            --brand-text-muted: #4A665E;
            --brand-sidebar: #FFFFFF;
            --brand-sidebar-border: #D0E5DA;
            background: linear-gradient(145deg, #F0F7F4 0%, #E5F0EB 100%);
        }
        .dark.skin-clinical-calm {
            --brand-bg: #0F1F1A;
            --brand-card: #1E2F2A;
            --brand-border: #2E4A40;
            --brand-text: #E0F0E9;
            --brand-text-muted: #9BB8B0;
            --brand-sidebar: #1A2A24;
            --brand-sidebar-border: #2E4A40;
            background: linear-gradient(145deg, #0F1F1A 0%, #172A23 100%);
        }
        .skin-clinical-calm button,
        .skin-clinical-calm .nav-btn {
            background: white;
            border: 1px solid var(--brand-border);
            border-radius: 40px;
            padding: 0.7rem 1.5rem;
            font-weight: 600;
            color: var(--brand-text);
            box-shadow: 0 2px 8px rgba(46,125,94,0.1), inset 0 1px 2px white;
            transition: all 0.2s;
        }
        .dark.skin-clinical-calm button,
        .dark.skin-clinical-calm .nav-btn {
            background: #1E2F2A;
            border-color: #3E5F55;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.05);
            color: #E0F0E9;
        }
        .skin-clinical-calm button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(46,125,94,0.25), inset 0 1px 3px white;
            border-color: #2E7D5E;
        }
        .skin-clinical-calm input[type="text"],
        .skin-clinical-calm input[type="search"] {
            background: white;
            border: 1px solid var(--brand-border);
            border-radius: 30px;
            padding: 0.75rem 1.2rem;
            color: var(--brand-text);
        }
        .dark.skin-clinical-calm input {
            background: #1E2F2A;
            border-color: #3E5F55;
            color: #E0F0E9;
        }
        .skin-clinical-calm .card {
            background: var(--brand-card);
            border: 1px solid var(--brand-border);
            border-radius: 28px;
            box-shadow: 0 6px 20px rgba(46,125,94,0.08);
            padding: 1.5rem;
        }
        .skin-clinical-calm #main-sidebar {
            background: var(--brand-sidebar);
            border-color: var(--brand-sidebar-border);
        }

        /* ===== SKIN: CLASSIC GLOSSY ===== */
        .skin-classic-glossy {
            --brand-primary: #2C7BE5;
            --brand-primary-rgb: 44, 123, 229;
            --brand-bg: #E5F0FF;
            --brand-card: #FFFFFF;
            --brand-border: #B8D1F0;
            --brand-text: #0F2B45;
            --brand-text-muted: #4A6A8A;
            --brand-sidebar: #FFFFFF;
            --brand-sidebar-border: #B8D1F0;
            background: linear-gradient(180deg, #E5F0FF 0%, #D0E2FF 100%);
        }
        .dark.skin-classic-glossy {
            --brand-bg: #0A1929;
            --brand-card: #132F4C;
            --brand-border: #2C4E72;
            --brand-text: #F0F8FF;
            --brand-text-muted: #A0C0E0;
            --brand-sidebar: #0F2740;
            --brand-sidebar-border: #2C4E72;
            background: linear-gradient(180deg, #0A1929 0%, #102437 100%);
        }
        .skin-classic-glossy button,
        .skin-classic-glossy .nav-btn {
            background: linear-gradient(180deg, #FFFFFF 0%, #F0F7FF 100%);
            border: 2px solid var(--brand-border);
            border-radius: 12px;
            padding: 0.7rem 1.5rem;
            font-weight: 700;
            color: #0F2B45;
            text-shadow: 0 1px 0 white;
            box-shadow: 0 4px 8px rgba(0,20,50,0.2), inset 0 2px 0 white;
        }
        .dark.skin-classic-glossy button,
        .dark.skin-classic-glossy .nav-btn {
            background: linear-gradient(180deg, #1E3A5F 0%, #132F4C 100%);
            border-color: #3A6A9A;
            color: #F0F8FF;
            text-shadow: 0 -1px 0 #0A1929;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .skin-classic-glossy button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(44,123,229,0.3), inset 0 2px 0 white;
        }
        .skin-classic-glossy input {
            background: white;
            border: 2px solid #B8D1F0;
            border-radius: 10px;
            padding: 0.7rem 1rem;
            color: #0F2B45;
        }
        .dark.skin-classic-glossy input {
            background: #132F4C;
            border-color: #3A6A9A;
            color: #F0F8FF;
        }
        .skin-classic-glossy .card {
            background: var(--brand-card);
            border: 1px solid var(--brand-border);
            border-radius: 20px;
            box-shadow: 0 10px 25px -5px rgba(44,123,229,0.2), inset 0 1px 2px white;
            padding: 1.5rem;
        }
        .skin-classic-glossy #main-sidebar {
            background: var(--brand-sidebar);
            border-color: var(--brand-sidebar-border);
        }

        /* ===== SKIN: FROSTED DEPTH ===== */
        .skin-frosted-depth {
            --brand-primary: #6366F1;
            --brand-primary-rgb: 99, 102, 241;
            --brand-bg: #F8FAFC;
            --brand-card: rgba(255,255,255,0.6);
            --brand-border: rgba(99,102,241,0.15);
            --brand-text: #0F172A;
            --brand-text-muted: #475569;
            --brand-sidebar: rgba(255,255,255,0.7);
            --brand-sidebar-border: rgba(99,102,241,0.1);
            background: #F8FAFC;
        }
        .dark.skin-frosted-depth {
            --brand-bg: #0F172A;
            --brand-card: rgba(30,41,59,0.7);
            --brand-border: rgba(99,102,241,0.3);
            --brand-text: #F1F5F9;
            --brand-text-muted: #94A3B8;
            --brand-sidebar: rgba(15,23,42,0.8);
            --brand-sidebar-border: rgba(99,102,241,0.2);
            background: #0F172A;
        }
        .skin-frosted-depth button,
        .skin-frosted-depth .nav-btn {
            background: rgba(255,255,255,0.5);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(99,102,241,0.2);
            border-radius: 40px;
            padding: 0.7rem 1.5rem;
            font-weight: 600;
            color: var(--brand-text);
            box-shadow: 0 4px 12px rgba(0,0,0,0.03), inset 0 1px 2px white;
        }
        .dark.skin-frosted-depth button,
        .dark.skin-frosted-depth .nav-btn {
            background: rgba(30,41,59,0.6);
            border-color: rgba(99,102,241,0.4);
            box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);
            color: #F1F5F9;
        }
        .skin-frosted-depth button:hover {
            background: rgba(255,255,255,0.7);
            border-color: rgba(99,102,241,0.4);
            transform: translateY(-2px);
        }
        .skin-frosted-depth input {
            background: rgba(255,255,255,0.5);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(99,102,241,0.2);
            border-radius: 40px;
            padding: 0.7rem 1.2rem;
            color: var(--brand-text);
        }
        .dark.skin-frosted-depth input {
            background: rgba(30,41,59,0.5);
            border-color: rgba(99,102,241,0.3);
            color: #F1F5F9;
        }
        .skin-frosted-depth .card {
            background: var(--brand-card);
            backdrop-filter: blur(20px);
            border: 1px solid var(--brand-border);
            border-radius: 32px;
            box-shadow: 0 10px 30px -10px rgba(99,102,241,0.1);
            padding: 1.5rem;
        }
        .skin-frosted-depth #main-sidebar {
            background: var(--brand-sidebar);
            backdrop-filter: blur(16px);
            border-color: var(--brand-sidebar-border);
        }

        /* ===== SKIN: CYBER EDGE ===== */
        .skin-cyber-edge {
            --brand-primary: #2DD4BF;
            --brand-primary-rgb: 45, 212, 191;
            --brand-bg: #0B1120;
            --brand-card: #1E293B;
            --brand-border: #334155;
            --brand-text: #F1F5F9;
            --brand-text-muted: #94A3B8;
            --brand-sidebar: #111827;
            --brand-sidebar-border: #1E293B;
            background: radial-gradient(circle at 70% 10%, #1E293B, #0B1120);
        }
        .dark.skin-cyber-edge {
            /* ya es oscuro, se mantiene */
        }
        .skin-cyber-edge button,
        .skin-cyber-edge .nav-btn {
            background: transparent;
            border: 2px solid #2DD4BF;
            border-radius: 8px;
            padding: 0.7rem 1.5rem;
            font-weight: 600;
            color: #2DD4BF;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 0 8px rgba(45,212,191,0.3);
            transition: all 0.2s;
        }
        .skin-cyber-edge button:hover {
            background: rgba(45,212,191,0.1);
            box-shadow: 0 0 20px #2DD4BF;
            transform: translateY(-2px);
            border-color: #5EEAD4;
            color: #5EEAD4;
        }
        .skin-cyber-edge input {
            background: #1E293B;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 0.7rem 1.2rem;
            color: #F1F5F9;
        }
        .skin-cyber-edge input:focus {
            border-color: #2DD4BF;
            box-shadow: 0 0 0 3px rgba(45,212,191,0.2);
        }
        .skin-cyber-edge .card {
            background: #1E293B;
            border: 1px solid #334155;
            border-radius: 24px;
            box-shadow: 0 10px 30px -5px rgba(0,0,0,0.8);
            padding: 1.5rem;
        }
        .skin-cyber-edge #main-sidebar {
            background: #111827;
            border-color: #1E293B;
        }
        .skin-cyber-edge .nav-btn.active {
            background: rgba(45,212,191,0.15);
            color: #2DD4BF;
        }
    `;

    function applySkin(skinId) {
        const skin = SKINS.find(s => s.id === skinId);
        if (!skin) return;

        document.body.className = document.body.className
            .split(' ')
            .filter(c => !c.startsWith('skin-'))
            .join(' ');

        document.body.classList.add(`skin-${skinId}`);
        try { localStorage.setItem('nclex_skin_v1', skinId); } catch (e) {}
        window.dispatchEvent(new CustomEvent('skinchange', { detail: { skin } }));
    }

    function initSkins() {
        if (!document.getElementById('premium-skins-css')) {
            const style = document.createElement('style');
            style.id = 'premium-skins-css';
            style.textContent = PREMIUM_CSS;
            document.head.appendChild(style);
        }
        const savedSkin = localStorage.getItem('nclex_skin_v1') || 'clinical-calm';
        applySkin(savedSkin);
    }

    function renderSkinSelector() {
        const currentSkinId = window.SkinSystem.current();
        return `
            <header class="mb-8">
                <h1 class="text-4xl font-black mb-2">Galería de Estilos</h1>
                <p class="text-[var(--brand-text-muted)] text-lg">4 skins premium, meticulosamente diseñados.</p>
            </header>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pb-16">
                ${SKINS.map(skin => {
                    const isActive = currentSkinId === skin.id;
                    return `
                        <div onclick="window.SkinSystem.apply('${skin.id}')" 
                             class="group cursor-pointer transform transition-all hover:scale-[1.02]">
                            <div class="rounded-3xl overflow-hidden border-4 ${isActive ? 'border-[rgb(var(--brand-primary-rgb))]' : 'border-transparent'} shadow-2xl">
                                <div class="h-40 w-full" style="background: linear-gradient(145deg, ${skin.colors[0]} 0%, ${skin.colors[1]} 100%);"></div>
                                <div class="p-6 bg-[var(--brand-card)]">
                                    <div class="flex items-center gap-3 mb-3">
                                        <i class="fa-solid fa-${skin.icon} text-3xl" style="color: rgb(var(--brand-primary-rgb));"></i>
                                        <h2 class="text-2xl font-bold">${skin.nameEs}</h2>
                                    </div>
                                    <p class="text-[var(--brand-text-muted)] mb-4">${skin.description}</p>
                                    <div class="flex gap-2">
                                        ${skin.colors.map(c => `<div class="w-8 h-8 rounded-full border-2 border-white shadow" style="background: ${c};"></div>`).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    window.SkinSystem = {
        SKINS,
        apply: applySkin,
        renderSkinSelector,
        current: () => {
            const c = Array.from(document.body.classList).find(c => c.startsWith('skin-'));
            return c ? c.replace('skin-', '') : null;
        }
    };

    window.NCLEX_SKINS = window.SkinSystem;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSkins);
    } else {
        initSkins();
    }
})();