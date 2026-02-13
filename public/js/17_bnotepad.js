/* 17_bnotepad.js — Slide-out Notes Panel (VERSIÓN 4.0) */

(function () {
    'use strict';

    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        STORAGE_KEY: 'nclex_notepad_v4_content',
        AUTOSAVE_DELAY: 1000 // ms
    };

    // ===== ELEMENTOS DOM =====
    const elements = {
        wrapper: document.getElementById('notepad-wrapper'),
        tab: document.getElementById('notepad-tab'),
        textarea: document.getElementById('notepad-area'),
        saveBtn: document.getElementById('notepad-save'),
        clearBtn: document.getElementById('notepad-clear')
    };

    let saveTimeout;

    // ===== FUNCIONES PRINCIPALES =====

    function init() {
        console.log('📝 Initializing Slide-out Notepad v4.0...');

        // Validar existencia de elementos (seguridad si el HTML no cargó bien)
        if (!elements.wrapper || !elements.textarea) {
            console.warn('Notepad DOM elements not found. Retrying in 500ms...');
            setTimeout(init, 500);
            return;
        }

        // 1. Cargar contenido guardado
        loadContent();

        // 2. Event Listeners
        setupEventListeners();

        console.log('✅ Notepad initialized');
    }

    function loadContent() {
        try {
            const savedContent = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (savedContent) {
                elements.textarea.value = savedContent;
            } else {
                elements.textarea.placeholder = "Type your clinical notes here...\n(Auto-saved)";
            }
        } catch (e) {
            console.error('Error loading notes:', e);
        }
    }

    function saveContent() {
        try {
            const content = elements.textarea.value;
            localStorage.setItem(CONFIG.STORAGE_KEY, content);
            showSaveFeedback();
        } catch (e) {
            console.error('Error saving notes:', e);
        }
    }

    function clearContent() {
        if (confirm('Are you sure you want to clear all notes?')) {
            elements.textarea.value = '';
            saveContent();
            // Reset feedback color
            if (elements.saveBtn) elements.saveBtn.innerHTML = '<i class="fa-solid fa-save"></i> Save';
        }
    }

    // ===== INTERACCIÓN UI =====

    function togglePanel() {
        // Para dispositivos táctiles donde no hay "hover"
        elements.wrapper.classList.toggle('active');
    }

    function showSaveFeedback() {
        if (!elements.saveBtn) return;
        
        const originalText = elements.saveBtn.innerHTML;
        elements.saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saved';
        elements.saveBtn.classList.add('text-green-600');
        
        setTimeout(() => {
            elements.saveBtn.innerHTML = '<i class="fa-solid fa-save"></i> Save';
            elements.saveBtn.classList.remove('text-green-600');
        }, 2000);
    }

    function setupEventListeners() {
        // Auto-save al escribir (Debounce)
        elements.textarea.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveContent, CONFIG.AUTOSAVE_DELAY);
        });

        // Guardado manual
        if (elements.saveBtn) {
            elements.saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                clearTimeout(saveTimeout);
                saveContent();
            });
        }

        // Borrar notas
        if (elements.clearBtn) {
            elements.clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                clearContent();
            });
        }

        // Toggle táctil en la pestaña
        if (elements.tab) {
            elements.tab.addEventListener('click', togglePanel);
        }

        // Cerrar al hacer click fuera (opcional, mejora UX en móvil)
        document.addEventListener('click', (e) => {
            if (elements.wrapper.classList.contains('active') && 
                !elements.wrapper.contains(e.target) && 
                e.target !== elements.tab) {
                elements.wrapper.classList.remove('active');
            }
        });
    }

    // ===== ARRANQUE =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();