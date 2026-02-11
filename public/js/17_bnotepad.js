// 17_bnotepad.js — Versión Arrastrable e Independiente (Derecha)
(function() {
    'use strict';
    
    // --- CONFIGURACIÓN ---
    const CONFIG = {
        STORAGE_KEY: 'notes_pos_v2',
        DEFAULT_POSITION: { right: '20px', bottom: '20px' },
        DRAG_THRESHOLD: 5, // píxeles mínimos para considerar arrastre
        Z_INDEX: 9990
    };
    
    // --- GESTIÓN DE POSICIÓN ---
    const PositionManager = {
        save(el) {
            const rect = el.getBoundingClientRect();
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                x: rect.left,
                y: rect.top,
                width: window.innerWidth,
                height: window.innerHeight
            }));
        },
        
        load(el) {
            try {
                const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (!saved) return false;
                
                const { x, y, width: savedWidth, height: savedHeight } = JSON.parse(saved);
                
                // Verificar si la ventana ha cambiado significativamente de tamaño
                const currentWidth = window.innerWidth;
                const currentHeight = window.innerHeight;
                const widthRatio = currentWidth / savedWidth;
                const heightRatio = currentHeight / savedHeight;
                
                if (widthRatio < 0.8 || widthRatio > 1.2 || heightRatio < 0.8 || heightRatio > 1.2) {
                    console.log('Ventana redimensionada significativamente, usando posición por defecto');
                    return false;
                }
                
                // Ajustar posición si está fuera de los límites visibles
                const maxX = currentWidth - el.offsetWidth;
                const maxY = currentHeight - el.offsetHeight;
                
                const adjustedX = Math.max(10, Math.min(x, maxX - 10));
                const adjustedY = Math.max(10, Math.min(y, maxY - 10));
                
                el.style.left = `${adjustedX}px`;
                el.style.top = `${adjustedY}px`;
                el.style.right = 'auto';
                el.style.bottom = 'auto';
                
                return true;
            } catch (e) {
                console.error('Error cargando posición:', e);
                return false;
            }
        },
        
        setDefault(el) {
            Object.assign(el.style, CONFIG.DEFAULT_POSITION);
        }
    };
    
    // --- SISTEMA DE ARRASTRE ---
    class DraggableManager {
        constructor(el, onMoveCallback, onClickCallback) {
            this.el = el;
            this.onMoveCallback = onMoveCallback;
            this.onClickCallback = onClickCallback;
            this.isDragging = false;
            this.hasMoved = false;
            this.startX = 0;
            this.startY = 0;
            this.initialLeft = 0;
            this.initialTop = 0;
            this.animationId = null;
            
            this.bindEvents();
        }
        
        bindEvents() {
            this.el.addEventListener('mousedown', this.handleStart.bind(this));
            this.el.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
            
            // Prevenir arrastre accidental de imágenes/texto
            this.el.addEventListener('dragstart', (e) => e.preventDefault());
            this.el.style.userSelect = 'none';
            this.el.style.webkitUserSelect = 'none';
        }
        
        handleStart(e) {
            // Ignorar si se hace clic en un botón
            if (e.target.closest('button') || e.target.closest('a')) return;
            
            const isTouch = e.type === 'touchstart';
            const clientX = isTouch ? e.touches[0].clientX : e.clientX;
            const clientY = isTouch ? e.touches[0].clientY : e.clientY;
            
            this.isDragging = true;
            this.hasMoved = false;
            this.startX = clientX;
            this.startY = clientY;
            
            const rect = this.el.getBoundingClientRect();
            this.initialLeft = rect.left;
            this.initialTop = rect.top;
            
            // Desactivar transiciones durante el arrastre
            this.el.style.transition = 'none';
            this.el.style.cursor = 'grabbing';
            
            // Agregar clase durante el arrastre
            this.el.classList.add('dragging');
            
            // Vincular eventos de movimiento
            const moveEvent = isTouch ? 'touchmove' : 'mousemove';
            const endEvent = isTouch ? 'touchend' : 'mouseup';
            
            document.addEventListener(moveEvent, this.handleMove.bind(this), { passive: false });
            document.addEventListener(endEvent, this.handleEnd.bind(this));
            
            // También vincular eventos a nivel de documento para casos de cursor fuera
            if (!isTouch) {
                document.addEventListener('mouseleave', this.handleEnd.bind(this));
            }
            
            e.preventDefault();
        }
        
        handleMove(e) {
            if (!this.isDragging) return;
            
            const isTouch = e.type === 'touchmove';
            const clientX = isTouch ? e.touches[0].clientX : e.clientX;
            const clientY = isTouch ? e.touches[0].clientY : e.clientY;
            
            const dx = clientX - this.startX;
            const dy = clientY - this.startY;
            
            // Verificar si superó el umbral de arrastre
            if (!this.hasMoved && (Math.abs(dx) > CONFIG.DRAG_THRESHOLD || Math.abs(dy) > CONFIG.DRAG_THRESHOLD)) {
                this.hasMoved = true;
            }
            
            // Calcular nueva posición
            const newLeft = this.initialLeft + dx;
            const newTop = this.initialTop + dy;
            
            // Limitar a los bordes de la ventana
            const maxX = window.innerWidth - this.el.offsetWidth;
            const maxY = window.innerHeight - this.el.offsetHeight;
            
            const boundedLeft = Math.max(0, Math.min(newLeft, maxX));
            const boundedTop = Math.max(0, Math.min(newTop, maxY));
            
            // Aplicar transformación para mejor rendimiento
            this.el.style.transform = `translate3d(${boundedLeft - this.initialLeft}px, ${boundedTop - this.initialTop}px, 0)`;
            
            // Llamar callback si existe
            if (this.onMoveCallback) {
                this.onMoveCallback(boundedLeft, boundedTop);
            }
            
            if (this.hasMoved) {
                e.preventDefault();
            }
        }
        
        handleEnd() {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            this.el.style.cursor = '';
            this.el.classList.remove('dragging');
            
            // Restaurar transformación y actualizar posición real
            const transform = window.getComputedStyle(this.el).transform;
            if (transform && transform !== 'none') {
                const matrix = new DOMMatrixReadOnly(transform);
                const finalLeft = this.initialLeft + matrix.m41;
                const finalTop = this.initialTop + matrix.m42;
                
                this.el.style.transform = 'none';
                this.el.style.left = `${finalLeft}px`;
                this.el.style.top = `${finalTop}px`;
                this.el.style.right = 'auto';
                this.el.style.bottom = 'auto';
            }
            
            // Restaurar transición
            this.el.style.transition = '';
            
            // Guardar posición
            PositionManager.save(this.el);
            
            // Limpiar eventos
            this.cleanupEvents();
            
            // Si no se movió, ejecutar callback de clic
            if (!this.hasMoved && this.onClickCallback) {
                this.onClickCallback();
            }
        }
        
        cleanupEvents() {
            document.removeEventListener('mousemove', this.handleMove.bind(this));
            document.removeEventListener('mouseup', this.handleEnd.bind(this));
            document.removeEventListener('touchmove', this.handleMove.bind(this));
            document.removeEventListener('touchend', this.handleEnd.bind(this));
            document.removeEventListener('mouseleave', this.handleEnd.bind(this));
        }
        
        destroy() {
            this.cleanupEvents();
            this.el.removeEventListener('mousedown', this.handleStart.bind(this));
            this.el.removeEventListener('touchstart', this.handleStart.bind(this));
        }
    }
    
    // --- INTERFAZ DE USUARIO ---
    function createTriggerButton() {
        const trigger = document.createElement('div');
        trigger.id = 'notes-float-btn';
        trigger.className = 'fixed z-[9990] w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 cursor-move group hover:shadow-2xl transition-all duration-200';
        
        // Efecto de iluminación
        trigger.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 opacity-20 rounded-2xl pointer-events-none group-hover:opacity-30 transition-opacity"></div>
            <div class="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-300/30 pointer-events-none transition-all"></div>
            <i class="fa-solid fa-pen-nib text-2xl text-orange-500 dark:text-orange-400 pointer-events-none relative z-10 group-hover:scale-110 transition-transform"></i>
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        `;
        
        // Estilos adicionales
        Object.assign(trigger.style, {
            willChange: 'transform',
            backfaceVisibility: 'hidden'
        });
        
        return trigger;
    }
    
    // --- INICIALIZACIÓN ---
    function init() {
        // Esperar a que cargue el DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', buildUI);
        } else {
            buildUI();
        }
    }
    
    function buildUI() {
        // Crear botón trigger
        const trigger = createTriggerButton();
        document.body.appendChild(trigger);
        
        // Cargar o establecer posición por defecto
        if (!PositionManager.load(trigger)) {
            PositionManager.setDefault(trigger);
        }
        
        // Inicializar sistema de arrastre
        new DraggableManager(trigger, null, () => {
            // Callback al hacer clic (sin arrastrar)
            if (typeof window.toggleNotepad === 'function') {
                window.toggleNotepad();
            }
        });
        
        // Ajustar posición en redimensionamiento
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const rect = trigger.getBoundingClientRect();
                const isOutOfView = rect.right < 0 || rect.bottom < 0 || 
                                   rect.left > window.innerWidth || 
                                   rect.top > window.innerHeight;
                
                if (isOutOfView) {
                    PositionManager.setDefault(trigger);
                }
            }, 250);
        });
    }
    
    // Exponer función global
    window.toggleNotepad = window.toggleNotepad || function() {
        console.log('Notepad toggle function called - override this in your implementation');
    };
    
    // Inicializar
    init();
    
})();