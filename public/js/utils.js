// utils.js — Utilidades compartidas NCLEX Masterclass (VERSIÓN 3.6.0)
// CORE SYSTEM UTILITIES

(function() {
    'use strict';

    const CONFIG = {
        VERSION: '3.6.0',
        STORAGE_PREFIX: 'nclex_',
        DEBOUNCE_DEFAULT: 150,
        THROTTLE_DEFAULT: 100
    };

    const Utils = {
        isPlainObject(value) { return Object.prototype.toString.call(value) === '[object Object]'; },
        isArray(value) { return Array.isArray(value); },
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
                    if (obj.hasOwnProperty(key)) cloned[key] = this.deepClone(obj[key]);
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
                        if (!target[key] || !this.isPlainObject(target[key])) target[key] = {};
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
                try { return JSON.parse(item); } catch { return item; }
            } catch (e) { return defaultValue; }
        },
        set(key, value) {
            try {
                localStorage.setItem(CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
                return true;
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    this.cleanup();
                    try {
                        localStorage.setItem(CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
                        return true;
                    } catch (e2) { return false; }
                }
                return false;
            }
        },
        remove(key) {
            try { localStorage.removeItem(CONFIG.STORAGE_PREFIX + key); return true; } catch { return false; }
        },
        cleanup() {
            Object.keys(localStorage)
                .filter(k => k.startsWith(CONFIG.STORAGE_PREFIX))
                .filter(k => !k.includes('progress') && !k.includes('lang') && !k.includes('theme') && !k.includes('quiz_history'))
                .slice(0, 5)
                .forEach(k => localStorage.removeItem(k));
        }
    };

    const Timing = {
        debounce(fn, wait = CONFIG.DEBOUNCE_DEFAULT, immediate = false) {
            let timeout;
            return function(...args) {
                const later = () => { timeout = null; if (!immediate) fn(...args); };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) fn(...args);
            };
        },
        throttle(fn, limit = CONFIG.THROTTLE_DEFAULT) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    fn(...args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        ready(fn) {
            if (document.readyState !== 'loading') fn();
            else document.addEventListener('DOMContentLoaded', fn);
        }
    };

    const Format = {
        truncate(text, maxLength, suffix = '...') {
            if (!text || text.length <= maxLength) return text;
            return text.substring(0, maxLength - suffix.length).trim() + suffix;
        },
        formatFileSize(bytes) {
            if (bytes === 0 || !bytes) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        },
        relativeTime(date, lang = 'es') {
            const now = new Date();
            const then = new Date(date);
            const diffMs = now - then;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (lang === 'es') {
                if (diffMins < 1) return 'Ahora mismo';
                if (diffMins < 60) return `Hace ${diffMins} min`;
                if (diffHours < 24) return `Hace ${diffHours} h`;
                return `Hace ${diffDays} días`;
            } else {
                if (diffMins < 1) return 'Just now';
                if (diffMins < 60) return `${diffMins} min ago`;
                if (diffHours < 24) return `${diffHours} h ago`;
                return `${diffDays} days ago`;
            }
        }
    };

    const DOM = {
        $(selector, context = document) { return context.querySelector(selector); },
        $$(selector, context = document) { return Array.from(context.querySelectorAll(selector)); },
        escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
    };

    // EXPORTS
    window.NCLEXUtils = {
        version: CONFIG.VERSION,
        utils: Utils,
        storage: Storage,
        timing: Timing,
        format: Format,
        dom: DOM,
        
        // Shortcuts
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

    console.log(`🔧 NCLEXUtils v${CONFIG.VERSION} loaded`);

})();