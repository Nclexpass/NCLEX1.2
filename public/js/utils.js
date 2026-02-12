// utils.js — Utilidades compartidas NCLEX Masterclass (VERSIÓN 3.0)
// Centraliza funciones comunes para eliminar código duplicado

(function() {
    'use strict';

    // ===== CONFIGURACIÓN GLOBAL =====
    const CONFIG = {
        VERSION: '3.0.0',
        STORAGE_PREFIX: 'nclex_',
        DEBOUNCE_DEFAULT: 150,
        THROTTLE_DEFAULT: 100
    };

    // ===== VALIDACIÓN Y TIPOS =====

    const Utils = {
        /**
         * Verifica si un valor es un objeto plano
         */
        isPlainObject(value) {
            return Object.prototype.toString.call(value) === '[object Object]';
        },

        /**
         * Verifica si un valor es un array
         */
        isArray(value) {
            Array.isArray(value);
        },

        /**
         * Verifica si un valor está vacío (null, undefined, '', [], {})
         */
        isEmpty(value) {
            if (value == null) return true;
            if (typeof value === 'string') return value.trim() === '';
            if (Array.isArray(value)) return value.length === 0;
            if (this.isPlainObject(value)) return Object.keys(value).length === 0;
            return false;
        },

        /**
         * Genera un ID único
         */
        generateId(prefix = 'nclex') {
            return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        },

        /**
         * Deep clone de objetos/arrays
         */
        deepClone(obj) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (Array.isArray(obj)) return obj.map(item => this.deepClone(item));
            if (this.isPlainObject(obj)) {
                const cloned = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        cloned[key] = this.deepClone(obj[key]);
                    }
                }
                return cloned;
            }
            return obj;
        },

        /**
         * Merge profundo de objetos
         */
        deepMerge(target, ...sources) {
            if (!sources.length) return target;
            const source = sources.shift();
            
            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    if (this.isPlainObject(source[key])) {
                        if (!target[key] || !this.isPlainObject(target[key])) {
                            target[key] = {};
                        }
                        this.deepMerge(target[key], source[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
            }
            
            return this.deepMerge(target, ...sources);
        }
    };

    // ===== LOCALSTORAGE SEGURO =====

    const Storage = {
        /**
         * Obtiene valor de localStorage con fallback
         */
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(CONFIG.STORAGE_PREFIX + key);
                if (item === null) return defaultValue;
                return JSON.parse(item);
            } catch (e) {
                console.warn(`Storage.get error for "${key}":`, e);
                return defaultValue;
            }
        },

        /**
         * Guarda valor en localStorage
         */
        set(key, value) {
            try {
                localStorage.setItem(CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn(`Storage.set error for "${key}":`, e);
                // Intentar limpiar espacio si está lleno
                if (e.name === 'QuotaExceededError') {
                    this.cleanup();
                    try {
                        localStorage.setItem(CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
                        return true;
                    } catch (e2) {
                        console.error('Storage full, cannot save:', e2);
                    }
                }
                return false;
            }
        },

        /**
         * Elimina una clave
         */
        remove(key) {
            try {
                localStorage.removeItem(CONFIG.STORAGE_PREFIX + key);
                return true;
            } catch (e) {
                console.warn(`Storage.remove error for "${key}":`, e);
                return false;
            }
        },

        /**
         * Limpia entradas antiguas para liberar espacio
         */
        cleanup() {
            const keys = Object.keys(localStorage);
            const nclexKeys = keys.filter(k => k.startsWith(CONFIG.STORAGE_PREFIX));
            
            // Ordenar por antigüedad (simulado por orden de keys)
            // En producción, usar timestamps
            const toRemove = nclexKeys
                .filter(k => !k.includes('progress') && !k.includes('lang') && !k.includes('theme'))
                .slice(0, 5);
            
            toRemove.forEach(k => localStorage.removeItem(k));
            console.log('Storage cleaned up, removed:', toRemove);
        },

        /**
         * Obtiene todas las keys de NCLEX
         */
        keys() {
            return Object.keys(localStorage)
                .filter(k => k.startsWith(CONFIG.STORAGE_PREFIX))
                .map(k => k.replace(CONFIG.STORAGE_PREFIX, ''));
        }
    };

    // ===== DEBOUNCE / THROTTLE =====

    const Timing = {
        _timers: new Map(),

        /**
         * Debounce: ejecuta función después de que deje de llamarse
         */
        debounce(fn, wait = CONFIG.DEBOUNCE_DEFAULT, immediate = false) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) fn(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) fn(...args);
            };
        },

        /**
         * Throttle: ejecuta función máximo una vez por período
         */
        throttle(fn, limit = CONFIG.THROTTLE_DEFAULT) {
            let inThrottle;
            return function executedFunction(...args) {
                if (!inThrottle) {
                    fn(...args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        /**
         * Ejecuta función después de que el DOM esté listo
         */
        ready(fn) {
            if (document.readyState !== 'loading') {
                fn();
            } else {
                document.addEventListener('DOMContentLoaded', fn);
            }
        },

        /**
         * Delay con Promise
         */
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        /**
         * RequestAnimationFrame con Promise
         */
        raf() {
            return new Promise(resolve => requestAnimationFrame(resolve));
        },

        /**
         * Mide tiempo de ejecución de una función
         */
        measure(fn, label = 'Function') {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            console.log(`${label} took ${(end - start).toFixed(2)}ms`);
            return result;
        }
    };

    // ===== FORMATO Y FECHAS =====

    const Format = {
        /**
         * Formatea duración en minutos a legible
         */
        duration(minutes, short = false) {
            if (minutes < 60) return short ? `${minutes}m` : `${minutes} minutos`;
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            if (short) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
            return mins > 0 ? `${hours} horas ${mins} minutos` : `${hours} horas`;
        },

        /**
         * Formatea fecha relativa
         */
        relativeTime(date, lang = 'es') {
            const now = new Date();
            const then = new Date(date);
            const diffMs = now - then;
            const diffSecs = Math.floor(diffMs / 1000);
            const diffMins = Math.floor(diffSecs / 60);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            const texts = {
                es: {
                    now: 'Ahora mismo',
                    mins: m => `Hace ${m} minuto${m > 1 ? 's' : ''}`,
                    hours: h => `Hace ${h} hora${h > 1 ? 's' : ''}`,
                    days: d => `Hace ${d} día${d > 1 ? 's' : ''}`,
                    weeks: w => `Hace ${w} semana${w > 1 ? 's' : ''}`,
                    months: m => `Hace ${m} mes${m > 1 ? 'es' : ''}`
                },
                en: {
                    now: 'Just now',
                    mins: m => `${m} minute${m > 1 ? 's' : ''} ago`,
                    hours: h => `${h} hour${h > 1 ? 's' : ''} ago`,
                    days: d => `${d} day${d > 1 ? 's' : ''} ago`,
                    weeks: w => `${w} week${w > 1 ? 's' : ''} ago`,
                    months: m => `${m} month${m > 1 ? 's' : ''} ago`
                }
            };

            const t = texts[lang] || texts.es;

            if (diffSecs < 60) return t.now;
            if (diffMins < 60) return t.mins(diffMins);
            if (diffHours < 24) return t.hours(diffHours);
            if (diffDays < 7) return t.days(diffDays);
            if (diffDays < 30) return t.weeks(Math.floor(diffDays / 7));
            return t.months(Math.floor(diffDays / 30));
        },

        /**
         * Formatea número con separadores
         */
        number(num, decimals = 0) {
            return num.toLocaleString('es-ES', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        },

        /**
         * Formatea porcentaje
         */
        percent(value, total, decimals = 0) {
            if (total === 0) return '0%';
            return ((value / total) * 100).toFixed(decimals) + '%';
        },

        /**
         * Trunca texto con ellipsis
         */
        truncate(text, maxLength, suffix = '...') {
            if (!text || text.length <= maxLength) return text;
            return text.substring(0, maxLength - suffix.length).trim() + suffix;
        },

        /**
         * Capitaliza primera letra
         */
        capitalize(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        /**
         * Convierte snake_case a Title Case
         */
        titleCase(str) {
            return str
                .replace(/_/g, ' ')
                .replace(/-/g, ' ')
                .split(' ')
                .map(word => this.capitalize(word))
                .join(' ');
        }
    };

    // ===== MANIPULACIÓN DEL DOM =====

    const DOM = {
        /**
         * Selector seguro con cache opcional
         */
        $(selector, context = document) {
            return context.querySelector(selector);
        },

        /**
         * Selector múltiple
         */
        $$(selector, context = document) {
            return Array.from(context.querySelectorAll(selector));
        },

        /**
         * Crea elemento con atributos
         */
        create(tag, attrs = {}, children = []) {
            const el = document.createElement(tag);
            
            for (const [key, value] of Object.entries(attrs)) {
                if (key === 'class') {
                    el.className = Array.isArray(value) ? value.join(' ') : value;
                } else if (key === 'style' && typeof value === 'object') {
                    Object.assign(el.style, value);
                } else if (key.startsWith('on') && typeof value === 'function') {
                    el.addEventListener(key.slice(2).toLowerCase(), value);
                } else if (key === 'text') {
                    el.textContent = value;
                } else if (key === 'html') {
                    el.innerHTML = value;
                } else {
                    el.setAttribute(key, value);
                }
            }

            children.forEach(child => {
                if (typeof child === 'string') {
                    el.appendChild(document.createTextNode(child));
                } else if (child instanceof Node) {
                    el.appendChild(child);
                }
            });

            return el;
        },

        /**
         * Elimina todos los hijos de un elemento
         */
        empty(el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        },

        /**
         * Escapa HTML para prevenir XSS
         */
        escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        /**
         * Obtiene o establece data attributes
         */
        data(el, key, value) {
            if (value === undefined) {
                return el.dataset[key];
            }
            el.dataset[key] = value;
        },

        /**
         * Añade clase(s) a elemento(s)
         */
        addClass(els, ...classes) {
            const elements = Array.isArray(els) ? els : [els];
            elements.forEach(el => el.classList.add(...classes));
        },

        /**
         * Remueve clase(s) de elemento(s)
         */
        removeClass(els, ...classes) {
            const elements = Array.isArray(els) ? els : [els];
            elements.forEach(el => el.classList.remove(...classes));
        },

        /**
         * Toggle clase con condición opcional
         */
        toggleClass(els, className, force) {
            const elements = Array.isArray(els) ? els : [els];
            elements.forEach(el => el.classList.toggle(className, force));
        },

        /**
         * Verifica si elemento tiene clase
         */
        hasClass(el, className) {
            return el.classList.contains(className);
        },

        /**
         * Encuentra ancestro más cercano con selector
         */
        closest(el, selector) {
            return el.closest(selector);
        },

        /**
         * Obtiene posición relativa al viewport
         */
        rect(el) {
            return el.getBoundingClientRect();
        },

        /**
         * Scroll suave a elemento
         */
        scrollTo(el, options = {}) {
            const { behavior = 'smooth', block = 'start' } = options;
            el.scrollIntoView({ behavior, block });
        }
    };

    // ===== EVENTOS =====

    const Events = {
        _delegates: new Map(),

        /**
         * Añade evento con auto-cleanup
         */
        on(el, event, handler, options = {}) {
            el.addEventListener(event, handler, options);
            return () => el.removeEventListener(event, handler, options);
        },

        /**
         * Evento una sola vez
         */
        once(el, event, handler) {
            return this.on(el, event, handler, { once: true });
        },

        /**
         * Delegación de eventos
         */
        delegate(container, event, selector, handler) {
            const wrappedHandler = (e) => {
                const target = e.target.closest(selector);
                if (target && container.contains(target)) {
                    handler.call(target, e, target);
                }
            };
            
            container.addEventListener(event, wrappedHandler);
            
            const key = `${event}-${selector}`;
            this._delegates.set(key, { container, event, handler: wrappedHandler });
            
            return () => {
                container.removeEventListener(event, wrappedHandler);
                this._delegates.delete(key);
            };
        },

        /**
         * Dispara evento personalizado
         */
        emit(target, eventName, detail = {}) {
            const event = new CustomEvent(eventName, { detail, bubbles: true });
            target.dispatchEvent(event);
        },

        /**
         * Limpia todas las delegaciones
         */
        cleanup() {
            this._delegates.forEach(({ container, event, handler }) => {
                container.removeEventListener(event, handler);
            });
            this._delegates.clear();
        }
    };

    // ===== VALIDACIÓN DE FORMULARIOS =====

    const Validate = {
        /**
         * Valida email
         */
        email(str) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
        },

        /**
         * Valida que no esté vacío
         */
        required(str) {
            return str != null && String(str).trim() !== '';
        },

        /**
         * Valida longitud mínima
         */
        minLength(str, min) {
            return String(str).length >= min;
        },

        /**
         * Valida rango numérico
         */
        range(num, min, max) {
            const n = Number(num);
            return !isNaN(n) && n >= min && n <= max;
        },

        /**
         * Valida que sea número
         */
        number(str) {
            return !isNaN(Number(str)) && !isNaN(parseFloat(str));
        }
    };

    // ===== COLORES Y TEMAS =====

    const Theme = {
        /**
         * Obtiene variable CSS
         */
        getVar(name, fallback = '') {
            return getComputedStyle(document.documentElement)
                .getPropertyValue(name).trim() || fallback;
        },

        /**
         * Establece variable CSS
         */
        setVar(name, value) {
            document.documentElement.style.setProperty(name, value);
        },

        /**
         * Convierte hex a rgb
         */
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        /**
         * Ajusta opacidad de color
         */
        fade(color, opacity) {
            // Si es rgb(var(--name)), extraer
            if (color.includes('rgb(var')) {
                return color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
            }
            // Si es hex, convertir
            const rgb = this.hexToRgb(color);
            if (rgb) {
                return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            }
            return color;
        }
    };

    // ===== EXPOSICIÓN GLOBAL =====

    window.NCLEXUtils = {
        version: CONFIG.VERSION,
        
        // Módulos
        utils: Utils,
        storage: Storage,
        timing: Timing,
        format: Format,
        dom: DOM,
        events: Events,
        validate: Validate,
        theme: Theme,

        // Accesos directos comunes
        $: DOM.$,
        $$: DOM.$$,
        debounce: Timing.debounce,
        throttle: Timing.throttle,
        storageGet: Storage.get.bind(Storage),
        storageSet: Storage.set.bind(Storage),
        escapeHtml: DOM.escapeHtml,
        truncate: Format.truncate,
        relativeTime: Format.relativeTime,
        
        // Helper para inicialización segura
        ready: Timing.ready
    };

    console.log('🔧 NCLEXUtils v' + CONFIG.VERSION + ' loaded');

})();