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
            --brand-primary: #8B7EFF;
            --brand-primary-rgb: 139, 126, 255;
            --brand-bg: #E8E5FF;
            --brand-card: rgba(255, 255, 255, 0.85);
            --brand-border: rgba(139, 126, 255, 0.2);
            --brand-text: #2D2A3E;
            --brand-text-muted: #6B6880;
            --brand-blue: #8B7EFF;
            --brand-blue-rgb: 139, 126, 255;
            
            background: linear-gradient(135deg, #E8E5FF 0%, #F0EDFF 50%, #FFFFFF 100%);
        }
        
        .skin-neural-vision .glassmorphic {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(139, 126, 255, 0.3);
            box-shadow: 0 8px 32px rgba(139, 126, 255, 0.15);
        }
        
        .skin-neural-vision button:hover,
        .skin-neural-vision .interactive:hover {
            background: rgba(139, 126, 255, 0.1);
            transform: translateY(-2px);
        }
        
        /* Classic Glossy: Legacy Skeuomorphic */
        .skin-classic-glossy {
            --brand-primary: #4A90E2;
            --brand-primary-rgb: 74, 144, 226;
            --brand-bg: #1D4E89;
            --brand-card: rgba(80, 137, 198, 0.95);
            --brand-border: rgba(74, 144, 226, 0.5);
            --brand-text: #FFFFFF;
            --brand-text-muted: #B8D4F1;
            --brand-blue: #4A90E2;
            --brand-blue-rgb: 74, 144, 226;
            
            background: linear-gradient(180deg, #1D4E89 0%, #2C5F9E 100%);
        }
        
        .skin-classic-glossy .btn,
        .skin-classic-glossy button {
            background: linear-gradient(180deg, #5089C6 0%, #3A71A8 100%);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
            border: 1px solid rgba(0, 0, 0, 0.4);
        }
        
        /* Vivid Flat: The 2013 Revolution */
        .skin-vivid-flat {
            --brand-primary: #007AFF;
            --brand-primary-rgb: 0, 122, 255;
            --brand-bg: #FFFFFF;
            --brand-card: rgba(255, 255, 255, 0.98);
            --brand-border: rgba(0, 122, 255, 0.2);
            --brand-text: #000000;
            --brand-text-muted: #8E8E93;
            --brand-blue: #007AFF;
            --brand-blue-rgb: 0, 122, 255;
            
            background: linear-gradient(135deg, #FF3B30 0%, #FF9500 25%, #FFCC00 50%, #34C759 75%, #007AFF 100%);
        }
        
        .skin-vivid-flat .btn,
        .skin-vivid-flat button {
            background: #007AFF;
            border: none;
            border-radius: 8px;
            box-shadow: none;
        }
        
        /* Frosted Depth: Refined Blur */
        .skin-frosted-depth {
            --brand-primary: #5856D6;
            --brand-primary-rgb: 88, 86, 214;
            --brand-bg: #F2F2F7;
            --brand-card: rgba(255, 255, 255, 0.8);
            --brand-border: rgba(88, 86, 214, 0.15);
            --brand-text: #000000;
            --brand-text-muted: #8E8E93;
            --brand-blue: #5856D6;
            --brand-blue-rgb: 88, 86, 214;
            
            background: #F2F2F7;
        }
        
        .skin-frosted-depth .glassmorphic {
            background: rgba(255, 255, 255, 0.72);
            backdrop-filter: blur(20px) saturate(180%);
            border: 0.5px solid rgba(0, 0, 0, 0.04);
        }
        
        /* Bold Editorial: Typography Focus */
        .skin-bold-editorial {
            --brand-primary: #0A84FF;
            --brand-primary-rgb: 10, 132, 255;
            --brand-bg: #1C1C1E;
            --brand-card: rgba(44, 44, 46, 0.98);
            --brand-border: rgba(84, 84, 88, 0.65);
            --brand-text: #FFFFFF;
            --brand-text-muted: #AEAEB2;
            --brand-blue: #0A84FF;
            --brand-blue-rgb: 10, 132, 255;
            
            background: #1C1C1E;
        }
        
        .skin-bold-editorial h1,
        .skin-bold-editorial h2 {
            font-weight: 900;
            font-size: 2.5em;
            letter-spacing: -0.02em;
        }
        
        /* Dark Mode Obsidian: Pure Black */
        .skin-dark-obsidian {
            --brand-primary: #0A84FF;
            --brand-primary-rgb: 10, 132, 255;
            --brand-bg: #000000;
            --brand-card: rgba(28, 28, 30, 0.98);
            --brand-border: rgba(84, 84, 88, 0.48);
            --brand-text: #FFFFFF;
            --brand-text-muted: #AEAEB2;
            --brand-blue: #0A84FF;
            --brand-blue-rgb: 10, 132, 255;
            
            background: #000000;
        }
        
        .skin-dark-obsidian .card {
            background: rgba(28, 28, 30, 0.9);
            border: 1px solid rgba(84, 84, 88, 0.3);
        }
        
        /* Modular Grid: Widget-Style Blocks */
        .skin-modular-grid {
            --brand-primary: #FF9500;
            --brand-primary-rgb: 255, 149, 0;
            --brand-bg: #F2F2F7;
            --brand-card: rgba(255, 255, 255, 0.95);
            --brand-border: rgba(0, 0, 0, 0.1);
            --brand-text: #000000;
            --brand-text-muted: #8E8E93;
            --brand-blue: #FF9500;
            --brand-blue-rgb: 255, 149, 0;
            
            background: #F2F2F7;
        }
        
        .skin-modular-grid .card {
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        /* Dynamic Layering: Depth Effects */
        .skin-dynamic-layering {
            --brand-primary: #5856D6;
            --brand-primary-rgb: 88, 86, 214;
            --brand-bg: #E5E5EA;
            --brand-card: rgba(255, 255, 255, 0.92);
            --brand-border: rgba(0, 0, 0, 0.08);
            --brand-text: #000000;
            --brand-text-muted: #8E8E93;
            --brand-blue: #5856D6;
            --brand-blue-rgb: 88, 86, 214;
            
            background: linear-gradient(180deg, #E5E5EA 0%, #D1D1D6 100%);
        }
        
        .skin-dynamic-layering .card {
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);
            transform: translateZ(0);
        }
        
        /* Neon Hollow: Tron-Blue Accents */
        .skin-neon-hollow {
            --brand-primary: #03DAC6;
            --brand-primary-rgb: 3, 218, 198;
            --brand-bg: #121212;
            --brand-card: rgba(30, 30, 30, 0.95);
            --brand-border: rgba(3, 218, 198, 0.3);
            --brand-text: #FFFFFF;
            --brand-text-muted: #B3B3B3;
            --brand-blue: #03DAC6;
            --brand-blue-rgb: 3, 218, 198;
            
            background: #121212;
        }
        
        .skin-neon-hollow .btn {
            border: 2px solid #03DAC6;
            background: transparent;
            color: #03DAC6;
        }
        
        .skin-neon-hollow .btn:hover {
            background: rgba(3, 218, 198, 0.1);
            box-shadow: 0 0 20px rgba(3, 218, 198, 0.5);
        }
        
        /* Paper Layers: Material Design Classic */
        .skin-paper-layers {
            --brand-primary: #6200EE;
            --brand-primary-rgb: 98, 0, 238;
            --brand-bg: #FAFAFA;
            --brand-card: rgba(255, 255, 255, 0.98);
            --brand-border: rgba(0, 0, 0, 0.12);
            --brand-text: #000000;
            --brand-text-muted: #757575;
            --brand-blue: #6200EE;
            --brand-blue-rgb: 98, 0, 238;
            
            background: #FAFAFA;
        }
        
        .skin-paper-layers .card {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.14), 0 4px 5px rgba(0, 0, 0, 0.12);
            border-radius: 4px;
        }
        
        /* Tonal Adaptive: Material You */
        .skin-tonal-adaptive {
            --brand-primary: #D0BCFF;
            --brand-primary-rgb: 208, 188, 255;
            --brand-bg: #FEF7FF;
            --brand-card: rgba(255, 251, 254, 0.95);
            --brand-border: rgba(208, 188, 255, 0.2);
            --brand-text: #1C1B1F;
            --brand-text-muted: #49454F;
            --brand-blue: #D0BCFF;
            --brand-blue-rgb: 208, 188, 255;
            
            background: linear-gradient(135deg, #FEF7FF 0%, #FFFBFE 100%);
        }
        
        .skin-tonal-adaptive .card {
            background: rgba(255, 251, 254, 0.9);
            border-radius: 28px;
        }
        
        /* Liquid Stream: Translucent Floating Panels */
        .skin-liquid-stream {
            --brand-primary: #00BCD4;
            --brand-primary-rgb: 0, 188, 212;
            --brand-bg: #1A1A1D;
            --brand-card: rgba(45, 45, 48, 0.85);
            --brand-border: rgba(0, 188, 212, 0.3);
            --brand-text: #FFFFFF;
            --brand-text-muted: #B0B0B0;
            --brand-blue: #00BCD4;
            --brand-blue-rgb: 0, 188, 212;
            
            background: linear-gradient(135deg, #1A1A1D 0%, #2D2D30 100%);
        }
        
        .skin-liquid-stream .glassmorphic {
            background: rgba(45, 45, 48, 0.7);
            backdrop-filter: blur(24px) saturate(150%);
            border: 1px solid rgba(0, 188, 212, 0.2);
        }
        
        /* Onyx Premium: Cinematic Black */
        .skin-onyx-premium {
            --brand-primary: #2196F3;
            --brand-primary-rgb: 33, 150, 243;
            --brand-bg: #000000;
            --brand-card: rgba(28, 28, 28, 0.98);
            --brand-border: rgba(33, 150, 243, 0.25);
            --brand-text: #FFFFFF;
            --brand-text-muted: #AAAAAA;
            --brand-blue: #2196F3;
            --brand-blue-rgb: 33, 150, 243;
            
            background: #000000;
        }
        
        .skin-onyx-premium .card {
            background: rgba(28, 28, 28, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
        }
        
        /* Surgical Hybrid: Clean Professional */
        .skin-surgical-hybrid {
            --brand-primary: #1976D2;
            --brand-primary-rgb: 25, 118, 210;
            --brand-bg: #F5F5F5;
            --brand-card: rgba(255, 255, 255, 0.98);
            --brand-border: rgba(0, 0, 0, 0.08);
            --brand-text: #212121;
            --brand-text-muted: #757575;
            --brand-blue: #1976D2;
            --brand-blue-rgb: 25, 118, 210;
            
            background: #F5F5F5;
        }
        
        .skin-surgical-hybrid .btn {
            border-radius: 2px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Pure Essence: Stock Minimalism */
        .skin-pure-essence {
            --brand-primary: #4285F4;
            --brand-primary-rgb: 66, 133, 244;
            --brand-bg: #FFFFFF;
            --brand-card: rgba(255, 255, 255, 0.98);
            --brand-border: rgba(0, 0, 0, 0.06);
            --brand-text: #202124;
            --brand-text-muted: #5F6368;
            --brand-blue: #4285F4;
            --brand-blue-rgb: 66, 133, 244;
            
            background: #FFFFFF;
        }
        
        .skin-pure-essence .card {
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
            border-radius: 8px;
        }
        
        /* Horizon Dashboard: Automotive Minimalism */
        .skin-horizon-dashboard {
            --brand-primary: #E82127;
            --brand-primary-rgb: 232, 33, 39;
            --brand-bg: #1C1C1C;
            --brand-card: rgba(44, 44, 44, 0.95);
            --brand-border: rgba(232, 33, 39, 0.3);
            --brand-text: #FFFFFF;
            --brand-text-muted: #CCCCCC;
            --brand-blue: #E82127;
            --brand-blue-rgb: 232, 33, 39;
            
            background: linear-gradient(180deg, #1C1C1C 0%, #2C2C2C 100%);
        }
        
        .skin-horizon-dashboard .gauge-icon {
            filter: drop-shadow(0 0 8px rgba(232, 33, 39, 0.6));
        }
        
        /* Clean Horizon: Wide Layout Precision */
        .skin-clean-horizon {
            --brand-primary: #3E6AE1;
            --brand-primary-rgb: 62, 106, 225;
            --brand-bg: #F4F4F4;
            --brand-card: rgba(255, 255, 255, 0.98);
            --brand-border: rgba(0, 0, 0, 0.08);
            --brand-text: #1A1A1A;
            --brand-text-muted: #666666;
            --brand-blue: #3E6AE1;
            --brand-blue-rgb: 62, 106, 225;
            
            background: #F4F4F4;
        }
        
        .skin-clean-horizon .container {
            max-width: 1400px;
        }
        
        /* Vector Spatial: 3D Modular Control */
        .skin-vector-spatial {
            --brand-primary: #00D4FF;
            --brand-primary-rgb: 0, 212, 255;
            --brand-bg: #000000;
            --brand-card: rgba(10, 10, 10, 0.95);
            --brand-border: rgba(0, 212, 255, 0.4);
            --brand-text: #FFFFFF;
            --brand-text-muted: #AAAAAA;
            --brand-blue: #00D4FF;
            --brand-blue-rgb: 0, 212, 255;
            
            background: #000000;
        }
        
        .skin-vector-spatial .card {
            border: 2px solid rgba(0, 212, 255, 0.3);
            transform: perspective(1000px) rotateX(2deg);
        }
        
        /* Hyper-Driver Engine: Gaming Visualizer */
        .skin-hyper-driver {
            --brand-primary: #FF0844;
            --brand-primary-rgb: 255, 8, 68;
            --brand-bg: #0D0D0D;
            --brand-card: rgba(26, 26, 26, 0.95);
            --brand-border: rgba(255, 8, 68, 0.4);
            --brand-text: #FFFFFF;
            --brand-text-muted: #CCCCCC;
            --brand-blue: #FF0844;
            --brand-blue-rgb: 255, 8, 68;
            
            background: radial-gradient(circle at center, #1A1A1A 0%, #0D0D0D 100%);
        }
        
        .skin-hyper-driver .btn:hover {
            box-shadow: 0 0 30px rgba(255, 8, 68, 0.8);
        }
        
        /* Retro Pixel: 1984 Monochrome */
        .skin-retro-pixel {
            --brand-primary: #000000;
            --brand-primary-rgb: 0, 0, 0;
            --brand-bg: #C0C0C0;
            --brand-card: rgba(255, 255, 255, 0.98);
            --brand-border: rgba(0, 0, 0, 0.8);
            --brand-text: #000000;
            --brand-text-muted: #666666;
            --brand-blue: #000000;
            --brand-blue-rgb: 0, 0, 0;
            
            background: #C0C0C0;
            font-family: 'Courier New', monospace;
        }
        
        .skin-retro-pixel .card {
            border: 2px solid #000000;
            box-shadow: 4px 4px 0 #666666;
            border-radius: 0;
        }
        
        /* Aero Transparency: 2007 Glass Era */
        .skin-aero-transparency {
            --brand-primary: #4A9EFF;
            --brand-primary-rgb: 74, 158, 255;
            --brand-bg: #D9E8F7;
            --brand-card: rgba(240, 246, 252, 0.85);
            --brand-border: rgba(74, 158, 255, 0.4);
            --brand-text: #003D5C;
            --brand-text-muted: #4A7B9D;
            --brand-blue: #4A9EFF;
            --brand-blue-rgb: 74, 158, 255;
            
            background: linear-gradient(180deg, #D9E8F7 0%, #A8C8E8 100%);
        }
        
        .skin-aero-transparency .glassmorphic {
            background: rgba(240, 246, 252, 0.7);
            backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        
        /* Cyber Neural: Neon Dystopia */
        .skin-cyber-neural {
            --brand-primary: #00FFFF;
            --brand-primary-rgb: 0, 255, 255;
            --brand-bg: #0A0E27;
            --brand-card: rgba(26, 31, 58, 0.9);
            --brand-border: rgba(0, 255, 255, 0.5);
            --brand-text: #FFFFFF;
            --brand-text-muted: #8899AA;
            --brand-blue: #00FFFF;
            --brand-blue-rgb: 0, 255, 255;
            
            background: linear-gradient(135deg, #0A0E27 0%, #1A1F3A 100%);
        }
        
        .skin-cyber-neural .card {
            border: 1px solid rgba(0, 255, 255, 0.4);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.1);
        }
        
        .skin-cyber-neural .btn:hover {
            background: rgba(0, 255, 255, 0.15);
            text-shadow: 0 0 10px #00FFFF;
        }

        /* ===== ANIMATION CLASSES ===== */
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        .shimmer {
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0.3) 50%, 
                transparent 100%
            );
            background-size: 200% 100%;
            animation: shimmer 3s infinite;
        }
        
        @keyframes pulse-soft {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        
        .pulse-soft {
            animation: pulse-soft 2s ease-in-out infinite;
        }
        
        @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        .float-slow {
            animation: float-slow 6s ease-in-out infinite;
        }
        
        @keyframes glow-breathe {
            0%, 100% { filter: drop-shadow(0 0 5px currentColor); }
            50% { filter: drop-shadow(0 0 15px currentColor); }
        }
        
        .glow-breathe {
            animation: glow-breathe 3s ease-in-out infinite;
        }
        
        @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        
        .bounce-subtle {
            animation: bounce-subtle 1s ease-in-out infinite;
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
        window.dispatchEvent(new CustomEvent('skinChanged', { detail: { skin } }));
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

    // ===== PUBLIC API =====
    window.NCLEX_SKINS = {
        all: SKINS,
        masterpiece: SKINS.find(s => s.isMasterpiece),
        apply: applySkin,
        current: () => {
            const currentClass = Array.from(document.body.classList)
                .find(c => c.startsWith('skin-'));
            return currentClass ? currentClass.replace('skin-', '') : null;
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSkins);
    } else {
        initSkins();
    }
})();