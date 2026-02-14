// skins.js — Sistema de skins basado en variables CSS (20 skins)
// Compatible con modo oscuro/claro y botón de tema

(function() {
    'use strict';

    // ===== TUS 20 SKINS ORIGINALES (sin cambios) =====
    const SKINS = [
        // ===== THE MASTERPIECE: SPATIAL COMPUTING ERA =====
        {
            id: "neural-vision",
            name: "The Neural Vision",
            nameEs: "La Visión Neural",
            icon: "sparkles",
            colors: ["#E8E5FF", "#FFFFFF", "#8B7EFF"],
            animation: "shimmer",
            isMasterpiece: true
        },
        // ===== SERIES: CUPERTINO DESIGN =====
        {
            id: "classic-glossy",
            name: "Classic Glossy",
            nameEs: "Brillo Clásico",
            icon: "gem",
            colors: ["#1D4E89", "#5089C6", "#4A90E2"],
            animation: "glow-breathe"
        },
        {
            id: "vivid-flat",
            name: "Vivid Flat",
            nameEs: "Plano Vibrante",
            icon: "zap",
            colors: ["#FF3B30", "#FFFFFF", "#007AFF"],
            animation: "pulse-soft"
        },
        {
            id: "frosted-depth",
            name: "Frosted Depth",
            nameEs: "Profundidad Esmerilada",
            icon: "cube",
            colors: ["#F2F2F7", "#FFFFFF", "#5856D6"],
            animation: "float-slow"
        },
        {
            id: "bold-editorial",
            name: "Bold Editorial",
            nameEs: "Editorial Audaz",
            icon: "star",
            colors: ["#1C1C1E", "#2C2C2E", "#0A84FF"],
            animation: "bounce-subtle"
        },
        {
            id: "dark-obsidian",
            name: "Dark Mode Obsidian",
            nameEs: "Obsidiana Oscura",
            icon: "moon",
            colors: ["#000000", "#1C1C1E", "#0A84FF"],
            animation: "shimmer"
        },
        {
            id: "modular-grid",
            name: "Modular Grid",
            nameEs: "Cuadrícula Modular",
            icon: "grid",
            colors: ["#F2F2F7", "#FFFFFF", "#FF9500"],
            animation: "pulse-soft"
        },
        {
            id: "dynamic-layering",
            name: "Dynamic Layering",
            nameEs: "Capas Dinámicas",
            icon: "layers",
            colors: ["#E5E5EA", "#FFFFFF", "#5856D6"],
            animation: "float-slow"
        },
        // ===== SERIES: OPEN-CORE =====
        {
            id: "neon-hollow",
            name: "Neon Hollow",
            nameEs: "Hueco Neón",
            icon: "bolt",
            colors: ["#121212", "#1E1E1E", "#03DAC6"],
            animation: "glow-breathe"
        },
        {
            id: "paper-layers",
            name: "Paper Layers",
            nameEs: "Capas de Papel",
            icon: "file",
            colors: ["#FAFAFA", "#FFFFFF", "#6200EE"],
            animation: "bounce-subtle"
        },
        {
            id: "tonal-adaptive",
            name: "Tonal Adaptive",
            nameEs: "Adaptativo Tonal",
            icon: "palette",
            colors: ["#FEF7FF", "#FFFBFE", "#D0BCFF"],
            animation: "shimmer"
        },
        // ===== SERIES: CINEMA-PHONE =====
        {
            id: "liquid-stream",
            name: "Liquid Stream",
            nameEs: "Corriente Líquida",
            icon: "droplet",
            colors: ["#1A1A1D", "#2D2D30", "#00BCD4"],
            animation: "float-slow"
        },
        {
            id: "onyx-premium",
            name: "Onyx Premium",
            nameEs: "Ónice Premium",
            icon: "trophy",
            colors: ["#000000", "#1C1C1C", "#2196F3"],
            animation: "glow-breathe"
        },
        {
            id: "surgical-hybrid",
            name: "Surgical Hybrid",
            nameEs: "Híbrido Quirúrgico",
            icon: "crosshair",
            colors: ["#F5F5F5", "#FFFFFF", "#1976D2"],
            animation: "pulse-soft"
        },
        {
            id: "pure-essence",
            name: "Pure Essence",
            nameEs: "Esencia Pura",
            icon: "circle",
            colors: ["#FFFFFF", "#FAFAFA", "#4285F4"],
            animation: "bounce-subtle"
        },
        // ===== SERIES: ELECTRIC DRIVE =====
        {
            id: "horizon-dashboard",
            name: "Horizon Dashboard",
            nameEs: "Tablero Horizonte",
            icon: "gauge",
            colors: ["#1C1C1C", "#2C2C2C", "#E82127"],
            animation: "shimmer"
        },
        {
            id: "clean-horizon",
            name: "Clean Horizon",
            nameEs: "Horizonte Limpio",
            icon: "compass",
            colors: ["#F4F4F4", "#FFFFFF", "#3E6AE1"],
            animation: "float-slow"
        },
        {
            id: "vector-spatial",
            name: "Vector Spatial",
            nameEs: "Espacial Vectorial",
            icon: "box",
            colors: ["#000000", "#0A0A0A", "#00D4FF"],
            animation: "glow-breathe"
        },
        {
            id: "hyper-driver",
            name: "Hyper-Driver Engine",
            nameEs: "Motor Hiper-Conductor",
            icon: "rocket",
            colors: ["#0D0D0D", "#1A1A1A", "#FF0844"],
            animation: "pulse-soft"
        },
        // ===== SERIES: BONUS LEGACY =====
        {
            id: "retro-pixel",
            name: "Retro Pixel",
            nameEs: "Píxel Retro",
            icon: "terminal",
            colors: ["#C0C0C0", "#FFFFFF", "#000000"],
            animation: "bounce-subtle"
        },
        {
            id: "aero-transparency",
            name: "Aero Transparency",
            nameEs: "Transparencia Aero",
            icon: "glass",
            colors: ["#D9E8F7", "#F0F6FC", "#4A9EFF"],
            animation: "shimmer"
        },
        {
            id: "cyber-neural",
            name: "Cyber Neural",
            nameEs: "Cyber Neural",
            icon: "cpu",
            colors: ["#0A0E27", "#1A1F3A", "#00FFFF"],
            animation: "glow-breathe"
        }
    ];

    // ===== GENERADOR DE VARIABLES CSS PARA CADA SKIN =====
    // Convierte color hex a RGB
    function hexToRgb(hex) {
        const c = hex.startsWith('#') ? hex.slice(1) : hex;
        const bigint = parseInt(c, 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    // Oscurece un color (para modo oscuro)
    function darkenColor(hex, percent = 0.3) {
        const rgb = hexToRgb(hex);
        const darkened = rgb.map(v => Math.round(v * (1 - percent)));
        return `#${darkened.map(v => v.toString(16).padStart(2, '0')).join('')}`;
    }

    // Aclara un color (para modo claro)
    function lightenColor(hex, percent = 0.2) {
        const rgb = hexToRgb(hex);
        const lightened = rgb.map(v => Math.min(255, Math.round(v + (255 - v) * percent)));
        return `#${lightened.map(v => v.toString(16).padStart(2, '0')).join('')}`;
    }

    // Genera variables para un skin
    function generateSkinVariables(skin) {
        const [bg, card, primary] = skin.colors;
        const primaryRgb = hexToRgb(primary).join(',');
        
        // Modo claro
        const light = {
            '--brand-primary': primary,
            '--brand-primary-rgb': primaryRgb,
            '--brand-bg': bg,
            '--brand-card': card,
            '--brand-border': lightenColor(primary, 0.6),
            '--brand-text': '#1E293B', // texto oscuro por defecto
            '--brand-text-muted': '#64748B',
            '--brand-sidebar': card,
            '--brand-sidebar-border': lightenColor(primary, 0.7),
        };

        // Modo oscuro: invertir fondos y texto
        const dark = {
            '--brand-primary': primary,
            '--brand-primary-rgb': primaryRgb,
            '--brand-bg': darkenColor(bg, 0.7),
            '--brand-card': darkenColor(card, 0.6),
            '--brand-border': darkenColor(primary, 0.5),
            '--brand-text': '#F1F5F9',
            '--brand-text-muted': '#94A3B8',
            '--brand-sidebar': darkenColor(card, 0.65),
            '--brand-sidebar-border': darkenColor(primary, 0.4),
        };

        return { light, dark };
    }

    // Precalcular variables para todos los skins
    const SKIN_VARS = {};
    SKINS.forEach(skin => {
        SKIN_VARS[skin.id] = generateSkinVariables(skin);
    });

    // ===== APLICAR SKIN =====
    function applySkin(skinId) {
        const skin = SKINS.find(s => s.id === skinId);
        if (!skin) return;

        // Limpiar clases de skin anteriores en el html
        document.documentElement.classList.remove(...Array.from(document.documentElement.classList).filter(c => c.startsWith('skin-')));
        document.documentElement.classList.add(`skin-${skinId}`);

        // Determinar modo actual
        const isDark = document.documentElement.classList.contains('dark');
        const vars = SKIN_VARS[skinId][isDark ? 'dark' : 'light'];

        // Aplicar variables al html
        Object.entries(vars).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });

        // Guardar preferencia
        try { localStorage.setItem('nclex_skin_v1', skinId); } catch (e) {}

        // Disparar evento
        window.dispatchEvent(new CustomEvent('skinchange', { detail: { skin } }));
    }

    // ===== INICIALIZACIÓN =====
    function initSkins() {
        // Observar cambios en la clase dark (para actualizar variables)
        const observer = new MutationObserver(() => {
            const currentSkin = window.SkinSystem.current();
            if (currentSkin) applySkin(currentSkin);
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        // Cargar skin guardado o usar neural-vision por defecto
        const savedSkin = localStorage.getItem('nclex_skin_v1') || 'neural-vision';
        applySkin(savedSkin);
    }

    // ===== API PÚBLICA =====
    window.SkinSystem = {
        SKINS: SKINS,
        apply: applySkin,
        current: () => {
            const match = Array.from(document.documentElement.classList).find(c => c.startsWith('skin-'));
            return match ? match.replace('skin-', '') : null;
        },
        renderSkinSelector: function() {
            // Puedes mantener tu función de selector aquí si la tenías
            return '<div>Selector de skins</div>';
        }
    };

    // Compatibilidad con código antiguo
    window.NCLEX_SKINS = window.SkinSystem;

    // Auto-inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSkins);
    } else {
        initSkins();
    }
})();