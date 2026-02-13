// utils.js — Utilidades compartidas NCLEX Masterclass (VERSIÓN 3.5.0)
// FIXED: Storage.get ahora maneja strings no JSON (como 'es' o 'en')

(function() {
    'use strict';

    const CONFIG = {
        VERSION: '3.5.0', // Sincronizado con logic.js y index.html
        STORAGE_PREFIX: 'nclex_',
        DEBOUNCE_DEFAULT: 150,
        THROTTLE_DEFAULT: 100
    };

    const Utils = {
        isPlainObject(value) {
            return Object.prototype.toString.call(value) === '[object Object]';
        },

        isArray(value) {
            return Array.isArray(value);
        },

        isEmpty(value) {
            if (value == null) return true;
            if (typeof value === 'string') return value.trim() === '';
            if (Array.isArray(value)) return value.length === 0;
            if (this.isPlainObject(value)) return Object.keys(value).length === 0;
            return false;
        },

        generateId(prefix = 'nclex') {
            return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        },

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

    const Storage = {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(CONFIG.STORAGE_PREFIX + key);
                if (item === null) return defaultValue;
                // Intentar parsear como JSON; si falla, devolver el string original
                try {
                    return JSON.parse(item);
                } catch {
                    return item; // No es JSON, devolver raw (ej: 'es')
                }
            } catch (e) {
                console.warn(`Storage.get error for "${key}":`, e);
                return defaultValue;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn(`Storage.set error for "${key}":`, e);
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

        remove(key) {
            try {
                localStorage.removeItem(CONFIG.STORAGE_PREFIX + key);
                return true;
            } catch (e) {
                console.warn(`Storage.remove error for "${key}":`, e);
                return false;
            }
        },

        cleanup() {
            const keys = Object.keys(localStorage);
            const nclexKeys = keys.filter(k => k.startsWith(CONFIG.STORAGE_PREFIX));
            
            const toRemove = nclexKeys
                .filter(k => !k.includes('progress') && !k.includes('lang') && !k.includes('theme'))
                .slice(0, 5);
            
            toRemove.forEach(k => localStorage.removeItem(k));
            console.log('Storage cleaned up, removed:', toRemove);
        },

        keys() {
            return Object.keys(localStorage)
                .filter(k => k.startsWith(CONFIG.STORAGE_PREFIX))
                .map(k => k.replace(CONFIG.STORAGE_PREFIX, ''));
        }
    };

    const Timing = {
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

        ready(fn) {
            if (document.readyState !== 'loading') {
                fn();
            } else {
                document.addEventListener('DOMContentLoaded', fn);
            }
        },

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        raf() {
            return new Promise(resolve => requestAnimationFrame(resolve));
        },

        measure(fn, label = 'Function') {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            console.log(`${label} took ${(end - start).toFixed(2)}ms`);
            return result;
        }
    };

    const Format = {
        duration(minutes, short = false) {
            if (minutes < 60) return short ? `${minutes}m` : `${minutes} minutos`;
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            if (short) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
            return mins > 0 ? `${hours} horas ${mins} minutos` : `${hours} horas`;
        },

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

        number(num, decimals = 0) {
            return num.toLocaleString('es-ES', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        },

        percent(value, total, decimals = 0) {
            if (total === 0) return '0%';
            return ((value / total) * 100).toFixed(decimals) + '%';
        },

        truncate(text, maxLength, suffix = '...') {
            if (!text || text.length <= maxLength) return text;
            return text.substring(0, maxLength - suffix.length).trim() + suffix;
        },

        capitalize(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        titleCase(str) {
            return str
                .replace(/_/g, ' ')
                .replace(/-/g, ' ')
                .split(' ')
                .map(word => this.capitalize(word))
                .join(' ');
        },

        formatFileSize(bytes) {
            if (bytes === 0 || !bytes) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        }
    };

    const DOM = {
        $(selector, context = document) {
            return context.querySelector(selector);
        },

        $$(selector, context = document) {
            return Array.from(context.querySelectorAll(selector));
        },

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

        empty(el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        },

        escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        data(el, key, value) {
            if (value === undefined) {
                return el.dataset[key];
            }
            el.dataset[key] = value;
        },

        addClass(els, ...classes) {
            const elements = Array.isArray(els) ? els : [els];
            elements.forEach(el => el.classList.add(...classes));
        },

        removeClass(els, ...classes) {
            const elements = Array.isArray(els) ? els : [els];
            elements.forEach(el => el.classList.remove(...classes));
        },

        toggleClass(els, className, force) {
            const elements = Array.isArray(els) ? els : [els];
            elements.forEach(el => el.classList.toggle(className, force));
        },

        hasClass(el, className) {
            return el.classList.contains(className);
        },

        closest(el, selector) {
            return el.closest(selector);
        },

        rect(el) {
            return el.getBoundingClientRect();
        },

        scrollTo(el, options = {}) {
            const { behavior = 'smooth', block = 'start' } = options;
            el.scrollIntoView({ behavior, block });
        }
    };

    const Events = {
        _delegates: new Map(),

        on(el, event, handler, options = {}) {
            el.addEventListener(event, handler, options);
            return () => el.removeEventListener(event, handler, options);
        },

        once(el, event, handler) {
            return this.on(el, event, handler, { once: true });
        },

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

        emit(target, eventName, detail = {}) {
            const event = new CustomEvent(eventName, { detail, bubbles: true });
            target.dispatchEvent(event);
        },

        cleanup() {
            this._delegates.forEach(({ container, event, handler }) => {
                container.removeEventListener(event, handler);
            });
            this._delegates.clear();
        }
    };

    const Validate = {
        email(str) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
        },

        required(str) {
            return str != null && String(str).trim() !== '';
        },

        minLength(str, min) {
            return String(str).length >= min;
        },

        range(num, min, max) {
            const n = Number(num);
            return !isNaN(n) && n >= min && n <= max;
        },

        number(str) {
            return !isNaN(Number(str)) && !isNaN(parseFloat(str));
        }
    };

    const Theme = {
        getVar(name, fallback = '') {
            return getComputedStyle(document.documentElement)
                .getPropertyValue(name).trim() || fallback;
        },

        setVar(name, value) {
            document.documentElement.style.setProperty(name, value);
        },

        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        fade(color, opacity) {
            if (color.includes('rgb(var')) {
                return color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
            }
            const rgb = this.hexToRgb(color);
            if (rgb) {
                return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            }
            return color;
        }
    };

    window.NCLEXUtils = {
        version: CONFIG.VERSION,
        
        utils: Utils,
        storage: Storage,
        timing: Timing,
        format: Format,
        dom: DOM,
        events: Events,
        validate: Validate,
        theme: Theme,

        $: DOM.$,
        $$: DOM.$$,
        debounce: Timing.debounce,
        throttle: Timing.throttle,
        storageGet: Storage.get.bind(Storage),
        storageSet: Storage.set.bind(Storage),
        escapeHtml: DOM.escapeHtml,
        truncate: Format.truncate,
        relativeTime: Format.relativeTime,
        formatFileSize: Format.formatFileSize,
        
        ready: Timing.ready
    };

    console.log('🔧 NCLEXUtils v' + CONFIG.VERSION + ' loaded');

})();