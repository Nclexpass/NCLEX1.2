// skins.js — UI History Museum: 20 Historical Interface Eras + The Neural Vision Masterpiece
// Curated collection of interface design evolution from 1984 to spatial computing era

(function() {
    'use strict';

    // ===== THE SKINS MUSEUM =====
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

        // ===== SERIES: CUPERTINO DESIGN (Fruit-Inspired Aesthetic) =====
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

        // ===== SERIES: OPEN-CORE (Robot-Inspired Aesthetic) =====
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

        // ===== SERIES: CINEMA-PHONE (Entertainment-Focused Aesthetic) =====
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

        // ===== SERIES: ELECTRIC DRIVE (Automotive-Inspired Aesthetic) =====
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

        // ===== SERIES: BONUS LEGACY (Completing the 20) =====
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

    // ===== MASTERPIECE CSS =====
    const MASTERPIECE_CSS = `
        /* Neural Vision: Spatial Computing Aesthetic */
        .skin-neural-vision {
            --brand-blue-rgb: 139, 126, 255;
            --brand-bg: #E8E5FF;
            --brand-card: rgba(255, 255, 255, 0.85);
            --brand-border: rgba(139, 126, 255, 0.2);
            --brand-sidebar: rgba(255, 255, 255, 0.9);
            --brand-sidebar-border: rgba(139, 126, 255, 0.25);
            --brand-text: #2D2A3E;
            --brand-text-muted: #6B6880;
            
            background: linear-gradient(135deg, #E8E5FF 0%, #F0EDFF 50%, #FFFFFF 100%);
        }
        
        .skin-neural-vision .glassmorphic {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(139, 126, 255, 0.3);
            box-shadow: 0 8px 32px rgba(139, 126, 255, 0.15);
        }
        
        /* Classic Glossy: Legacy Skeuomorphic */
        .skin-classic-glossy {
            --brand-blue-rgb: 74, 144, 226;
            --brand-bg: #1D4E89;
            --brand-card: rgba(80, 137, 198, 0.95);
            --brand-border: rgba(74, 144, 226, 0.5);
            --brand-sidebar: rgba(29, 78, 137, 0.95);
            --brand-sidebar-border: rgba(74, 144, 226, 0.4);
            --brand-text: #FFFFFF;
            --brand-text-muted: #B8D4F1;
            
            background: linear-gradient(180deg, #1D4E89 0%, #2C5F9E 100%);
        }
        
        /* Vivid Flat */
        .skin-vivid-flat {
            --brand-blue-rgb: 0, 122, 255;
            --brand-bg: #FFFFFF;
            --brand-card: #FFFFFF;
            --brand-border: #E5E5EA;
            --brand-sidebar: #FAFAFA;
            --brand-sidebar-border: #E5E5EA;
            --brand-text: #000000;
            --brand-text-muted: #86868B;
        }
        
        /* Frosted Depth */
        .skin-frosted-depth {
            --brand-blue-rgb: 88, 86, 214;
            --brand-bg: #F2F2F7;
            --brand-card: rgba(255, 255, 255, 0.8);
            --brand-border: rgba(88, 86, 214, 0.2);
            --brand-sidebar: rgba(255, 255, 255, 0.85);
            --brand-sidebar-border: rgba(0, 0, 0, 0.08);
            --brand-text: #1C1C1E;
            --brand-text-muted: #636366;
        }
        
        /* Bold Editorial */
        .skin-bold-editorial {
            --brand-blue-rgb: 10, 132, 255;
            --brand-bg: #1C1C1E;
            --brand-card: #2C2C2E;
            --brand-border: #3A3A3C;
            --brand-sidebar: #1C1C1E;
            --brand-sidebar-border: #2C2C2E;
            --brand-text: #FFFFFF;
            --brand-text-muted: #AEAEB2;
        }
        
        /* Dark Obsidian */
        .skin-dark-obsidian {
            --brand-blue-rgb: 10, 132, 255;
            --brand-bg: #000000;
            --brand-card: #1C1C1E;
            --brand-border: #2C2C2E;
            --brand-sidebar: #000000;
            --brand-sidebar-border: #1C1C1E;
            --brand-text: #FFFFFF;
            --brand-text-muted: #8E8E93;
        }
        
        /* Modular Grid */
        .skin-modular-grid {
            --brand-blue-rgb: 255, 149, 0;
            --brand-bg: #F2F2F7;
            --brand-card: #FFFFFF;
            --brand-border: #D1D1D6;
            --brand-sidebar: #FFFFFF;
            --brand-sidebar-border: #E5E5EA;
            --brand-text: #000000;
            --brand-text-muted: #636366;
        }
        
        /* Dynamic Layering */
        .skin-dynamic-layering {
            --brand-blue-rgb: 88, 86, 214;
            --brand-bg: #E5E5EA;
            --brand-card: rgba(255, 255, 255, 0.95);
            --brand-border: rgba(0, 0, 0, 0.1);
            --brand-sidebar: rgba(255, 255, 255, 0.9);
            --brand-sidebar-border: rgba(0, 0, 0, 0.08);
            --brand-text: #1C1C1E;
            --brand-text-muted: #48484A;
        }
        
        /* Neon Hollow */
        .skin-neon-hollow {
            --brand-blue-rgb: 3, 218, 198;
            --brand-bg: #121212;
            --brand-card: #1E1E1E;
            --brand-border: rgba(3, 218, 198, 0.3);
            --brand-sidebar: #1E1E1E;
            --brand-sidebar-border: #2C2C2C;
            --brand-text: #FFFFFF;
            --brand-text-muted: #B3B3B3;
        }
        
        /* Paper Layers */
        .skin-paper-layers {
            --brand-blue-rgb: 98, 0, 238;
            --brand-bg: #FAFAFA;
            --brand-card: #FFFFFF;
            --brand-border: #E0E0E0;
            --brand-sidebar: #FFFFFF;
            --brand-sidebar-border: #E8E8E8;
            --brand-text: #212121;
            --brand-text-muted: #757575;
        }
        
        /* Tonal Adaptive */
        .skin-tonal-adaptive {
            --brand-blue-rgb: 208, 188, 255;
            --brand-bg: #FEF7FF;
            --brand-card: #FFFBFE;
            --brand-border: rgba(208, 188, 255, 0.4);
            --brand-sidebar: #FFFBFE;
            --brand-sidebar-border: #E8DEF8;
            --brand-text: #1C1B1F;
            --brand-text-muted: #49454F;
        }
        
        /* Liquid Stream */
        .skin-liquid-stream {
            --brand-blue-rgb: 0, 188, 212;
            --brand-bg: #1A1A1D;
            --brand-card: #2D2D30;
            --brand-border: rgba(0, 188, 212, 0.3);
            --brand-sidebar: #2D2D30;
            --brand-sidebar-border: #3D3D40;
            --brand-text: #FFFFFF;
            --brand-text-muted: #CCCCCC;
        }
        
        /* Onyx Premium */
        .skin-onyx-premium {
            --brand-blue-rgb: 33, 150, 243;
            --brand-bg: #000000;
            --brand-card: #1C1C1C;
            --brand-border: rgba(33, 150, 243, 0.4);
            --brand-sidebar: #1C1C1C;
            --brand-sidebar-border: #2C2C2C;
            --brand-text: #FFFFFF;
            --brand-text-muted: #AAAAAA;
        }
        
        /* Surgical Hybrid */
        .skin-surgical-hybrid {
            --brand-blue-rgb: 25, 118, 210;
            --brand-bg: #F5F5F5;
            --brand-card: #FFFFFF;
            --brand-border: rgba(0, 0, 0, 0.12);
            --brand-sidebar: #FFFFFF;
            --brand-sidebar-border: #E0E0E0;
            --brand-text: #212121;
            --brand-text-muted: #616161;
        }
        
        /* Pure Essence */
        .skin-pure-essence {
            --brand-blue-rgb: 66, 133, 244;
            --brand-bg: #FFFFFF;
            --brand-card: #FAFAFA;
            --brand-border: #DADCE0;
            --brand-sidebar: #FAFAFA;
            --brand-sidebar-border: #E8EAED;
            --brand-text: #202124;
            --brand-text-muted: #5F6368;
        }
        
        /* Horizon Dashboard */
        .skin-horizon-dashboard {
            --brand-blue-rgb: 232, 33, 39;
            --brand-bg: #1C1C1C;
            --brand-card: #2C2C2C;
            --brand-border: rgba(232, 33, 39, 0.4);
            --brand-sidebar: #2C2C2C;
            --brand-sidebar-border: #3C3C3C;
            --brand-text: #FFFFFF;
            --brand-text-muted: #CCCCCC;
        }
        
        /* Clean Horizon */
        .skin-clean-horizon {
            --brand-blue-rgb: 62, 106, 225;
            --brand-bg: #F4F4F4;
            --brand-card: #FFFFFF;
            --brand-border: rgba(0, 0, 0, 0.08);
            --brand-sidebar: #FFFFFF;
            --brand-sidebar-border: #E0E0E0;
            --brand-text: #1A1A1A;
            --brand-text-muted: #666666;
        }
        
        /* Vector Spatial */
        .skin-vector-spatial {
            --brand-blue-rgb: 0, 212, 255;
            --brand-bg: #000000;
            --brand-card: #0A0A0A;
            --brand-border: rgba(0, 212, 255, 0.4);
            --brand-sidebar: #0A0A0A;
            --brand-sidebar-border: rgba(0, 212, 255, 0.3);
            --brand-text: #FFFFFF;
            --brand-text-muted: #AAAAAA;
        }
        
        /* Hyper-Driver Engine */
        .skin-hyper-driver {
            --brand-blue-rgb: 255, 8, 68;
            --brand-bg: #0D0D0D;
            --brand-card: #1A1A1A;
            --brand-border: rgba(255, 8, 68, 0.4);
            --brand-sidebar: #1A1A1A;
            --brand-sidebar-border: rgba(255, 8, 68, 0.3);
            --brand-text: #FFFFFF;
            --brand-text-muted: #CCCCCC;
        }
        
        /* Retro Pixel */
        .skin-retro-pixel {
            --brand-blue-rgb: 0, 0, 0;
            --brand-bg: #C0C0C0;
            --brand-card: #FFFFFF;
            --brand-border: #000000;
            --brand-sidebar: #FFFFFF;
            --brand-sidebar-border: #000000;
            --brand-text: #000000;
            --brand-text-muted: #666666;
            
            font-family: 'Courier New', monospace;
        }
        
        .skin-retro-pixel .card {
            border: 2px solid #000000;
            box-shadow: 4px 4px 0 #666666;
            border-radius: 0;
        }
        
        /* Aero Transparency */
        .skin-aero-transparency {
            --brand-blue-rgb: 74, 158, 255;
            --brand-bg: #D9E8F7;
            --brand-card: rgba(240, 246, 252, 0.85);
            --brand-border: rgba(74, 158, 255, 0.4);
            --brand-sidebar: rgba(240, 246, 252, 0.9);
            --brand-sidebar-border: rgba(74, 158, 255, 0.3);
            --brand-text: #003D5C;
            --brand-text-muted: #4A7B9D;
            
            background: linear-gradient(180deg, #D9E8F7 0%, #A8C8E8 100%);
        }
        
        .skin-aero-transparency .glassmorphic {
            background: rgba(240, 246, 252, 0.7);
            backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        
        /* Cyber Neural */
        .skin-cyber-neural {
            --brand-blue-rgb: 0, 255, 255;
            --brand-bg: #0A0E27;
            --brand-card: rgba(26, 31, 58, 0.9);
            --brand-border: rgba(0, 255, 255, 0.5);
            --brand-sidebar: rgba(26, 31, 58, 0.95);
            --brand-sidebar-border: rgba(0, 255, 255, 0.4);
            --brand-text: #FFFFFF;
            --brand-text-muted: #8899AA;
            
            background: linear-gradient(135deg, #0A0E27 0%, #1A1F3A 100%);
        }
        
        .skin-cyber-neural .card {
            border: 1px solid rgba(0, 255, 255, 0.4);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }

        /* ===== ANIMATION CLASSES ===== */
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        @keyframes pulse-soft {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        
        @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes glow-breathe {
            0%, 100% { filter: drop-shadow(0 0 5px currentColor); }
            50% { filter: drop-shadow(0 0 15px currentColor); }
        }
        
        @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
    `;

    // ===== SKIN APPLICATION LOGIC =====
    function applySkin(skinId) {
        const skin = SKINS.find(s => s.id === skinId);
        if (!skin) return;

        // Remove all skin classes
        document.body.className = document.body.className
            .split(' ')
            .filter(c => !c.startsWith('skin-'))
            .join(' ');

        // Apply new skin
        document.body.classList.add(`skin-${skinId}`);

        // Store preference
        try {
            localStorage.setItem('nclex_skin_v1', skinId);
        } catch (e) {}

        // Trigger custom event
        window.dispatchEvent(new CustomEvent('skinchange', { detail: { skin } }));
        
        console.log(`✨ Skin applied: ${skin.name}`);
    }

    function initSkins() {
        // Inject masterpiece CSS
        if (!document.getElementById('masterpiece-css')) {
            const style = document.createElement('style');
            style.id = 'masterpiece-css';
            style.textContent = MASTERPIECE_CSS;
            document.head.appendChild(style);
        }

        // Load saved skin or apply masterpiece
        const savedSkin = localStorage.getItem('nclex_skin_v1') || 'neural-vision';
        applySkin(savedSkin);
    }

    // ===== RENDER SKIN SELECTOR UI =====
    function renderSkinSelector() {
        const currentSkin = window.SkinSystem.current();
        const t = window.t || ((es, en) => es);
        
        return `
            <div class="animate-fade-in">
                <h1 class="text-3xl font-black text-[var(--brand-text)] mb-2">
                    <span class="lang-es">Galería de Estilos</span>
                    <span class="lang-en hidden-lang">Style Gallery</span>
                </h1>
                <p class="text-[var(--brand-text-muted)] mb-8">
                    <span class="lang-es">20 estilos de interfaz históricos + La Obra Maestra Neural</span>
                    <span class="lang-en hidden-lang">20 historical interface styles + The Neural Masterpiece</span>
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    ${SKINS.map(skin => {
                        const isActive = currentSkin === skin.id;
                        const isMasterpiece = skin.isMasterpiece;
                        
                        return `
                            <div 
                                onclick="window.SkinSystem.apply('${skin.id}')"
                                class="group relative bg-[var(--brand-card)] border-2 rounded-2xl p-6 cursor-pointer transition-all hover:scale-105 ${
                                    isActive 
                                        ? 'border-[rgb(var(--brand-blue-rgb))] shadow-lg shadow-[rgb(var(--brand-blue-rgb))]/20' 
                                        : 'border-[var(--brand-border)] hover:border-[rgb(var(--brand-blue-rgb))]/50'
                                } ${isMasterpiece ? 'ring-4 ring-yellow-400/50' : ''}">
                                
                                ${isMasterpiece ? '<div class="absolute -top-3 -right-3 bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">✨ MASTERPIECE</div>' : ''}
                                
                                <div class="flex items-center gap-3 mb-4">
                                    <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${skin.animation}" 
                                         style="background: linear-gradient(135deg, ${skin.colors[0]}, ${skin.colors[2]});">
                                        <i class="fa-solid fa-${skin.icon} text-white"></i>
                                    </div>
                                    ${isActive ? '<i class="fa-solid fa-check text-[rgb(var(--brand-blue-rgb))] text-xl"></i>' : ''}
                                </div>
                                
                                <h3 class="font-bold text-[var(--brand-text)] mb-2">
                                    <span class="lang-es">${skin.nameEs}</span>
                                    <span class="lang-en hidden-lang">${skin.name}</span>
                                </h3>
                                
                                <div class="flex gap-1">
                                    ${skin.colors.map(color => `
                                        <div class="w-8 h-8 rounded-lg border border-[var(--brand-border)]" style="background-color: ${color};"></div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // ===== PUBLIC API =====
    window.SkinSystem = {
        SKINS: SKINS,
        apply: applySkin,
        current: () => {
            const currentClass = Array.from(document.body.classList)
                .find(c => c.startsWith('skin-'));
            return currentClass ? currentClass.replace('skin-', '') : null;
        },
        renderSkinSelector: renderSkinSelector
    };

    // Backward compatibility
    window.NCLEX_SKINS = window.SkinSystem;

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSkins);
    } else {
        initSkins();
    }
    
    console.log('🎨 Skin System loaded - 20 skins available');
})();