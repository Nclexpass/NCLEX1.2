// 17_bnotepad.js — Bloc de Notas Flotante (Draggable & Sticky)
// CREADO POR REYNIER DIAZ GERONES
// VERSIÓN: 2.1 (Floating Window Mode)

(function() {
  'use strict';

  // Configuración
  const STORAGE_KEY = 'nclex_user_notes_v1';
  const POS_STORAGE_KEY = 'nclex_notepad_pos';
  let saveTimer;

  // Helper de traducción
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  // --- Lógica del Toggle (Abrir/Cerrar/Minimizar) ---
  window.toggleNotepad = function() {
    const win = document.getElementById('notepad-window');
    
    if (win) {
        if (win.classList.contains('hidden')) {
            // ABRIR
            win.classList.remove('hidden');
            // Asegurar que esté visible en pantalla (por si se guardó fuera)
            ensureVisible(win);
            
            // Focus en el área de texto
            const area = document.getElementById('bnotepad-area');
            if(area) setTimeout(() => area.focus(), 100);
        } else {
            // CERRAR (OCULTAR)
            win.classList.add('hidden');
        }
    }
  };

  // Función de seguridad para traer la ventana al viewport si se perdió
  function ensureVisible(element) {
      const rect = element.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (rect.right < 0 || rect.left > vw || rect.bottom < 0 || rect.top > vh) {
          // Resetear a posición segura
          element.style.top = '100px';
          element.style.left = (vw - 400) + 'px'; // Lado derecho aproximado
          localStorage.setItem(POS_STORAGE_KEY, JSON.stringify({ top: element.style.top, left: element.style.left }));
      }
  }

  // --- Lógica de Arrastre (Drag & Drop) ---
  function initDrag() {
      const win = document.getElementById('notepad-window');
      const header = document.getElementById('notepad-header');
      
      if (!win || !header) return;

      // Recuperar posición guardada
      try {
          const savedPos = JSON.parse(localStorage.getItem(POS_STORAGE_KEY));
          if (savedPos && savedPos.top && savedPos.left) {
              win.style.top = savedPos.top;
              win.style.left = savedPos.left;
          } else {
              // Posición default (arriba a la derecha)
              win.style.top = '100px';
              // Calculamos left dinámicamente para que no quede pegado
              win.style.left = (window.innerWidth - win.offsetWidth - 20) + 'px';
          }
      } catch(e) { console.warn("Error reading pos", e); }

      let isDragging = false;
      let startX, startY, initialLeft, initialTop;

      const startDrag = (e) => {
          // Solo arrastrar si se pulsa el header (y no los botones dentro)
          if (e.target.closest('button')) return;

          isDragging = true;
          
          // Soporte Mouse/Touch
          const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
          const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

          startX = clientX;
          startY = clientY;

          const rect = win.getBoundingClientRect();
          initialLeft = rect.left;
          initialTop = rect.top;

          document.addEventListener('mousemove', onDrag);
          document.addEventListener('mouseup', endDrag);
          document.addEventListener('touchmove', onDrag, { passive: false });
          document.addEventListener('touchend', endDrag);
          
          // Estilo visual
          win.style.transition = 'none'; // Quitar transición para que siga al mouse rápido
          win.style.opacity = '0.9';
      };

      const onDrag = (e) => {
          if (!isDragging) return;
          e.preventDefault();

          const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
          const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

          const dx = clientX - startX;
          const dy = clientY - startY;

          win.style.left = `${initialLeft + dx}px`;
          win.style.top = `${initialTop + dy}px`;
      };

      const endDrag = () => {
          isDragging = false;
          win.style.opacity = '1';
          win.style.transition = 'opacity 0.2s'; // Restaurar transición suave de opacidad

          document.removeEventListener('mousemove', onDrag);
          document.removeEventListener('mouseup', endDrag);
          document.removeEventListener('touchmove', onDrag);
          document.removeEventListener('touchend', endDrag);

          // Guardar posición final
          localStorage.setItem(POS_STORAGE_KEY, JSON.stringify({
              top: win.style.top,
              left: win.style.left
          }));
      };

      header.addEventListener('mousedown', startDrag);
      header.addEventListener('touchstart', startDrag, { passive: false });
  }

  // --- Guardar Notas (Debounced & Safe) ---
  window.saveNotes = function(content) {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
          try {
              localStorage.setItem(STORAGE_KEY, content);
              const status = document.getElementById('note-status');
              if(status) {
                  status.innerHTML = '<i class="fa-solid fa-check text-green-500"></i>';
                  setTimeout(() => status.innerHTML = '', 2000);
              }
          } catch (e) {
              console.error("Error saving notes:", e);
          }
      }, 500);
  };

  window.downloadNotes = function() {
      const content = document.getElementById('bnotepad-area').value;
      if (!content) return;
      const blob = new Blob([content], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `NCLEX_Notes_${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
  };

  window.clearNotes = function() {
      if (confirm("¿Borrar todas las notas? / Clear all notes?")) {
          document.getElementById('bnotepad-area').value = '';
          try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      }
  };

  // --- Inicialización ---
  function initNotepad() {
      const container = document.getElementById('notepad-container');
      if (!container) return; 

      // 1. Recuperar notas
      let savedNote = '';
      try { savedNote = localStorage.getItem(STORAGE_KEY) || ''; } catch (e) {}

      // 2. Renderizar UI interna (Toolbar + Textarea)
      container.innerHTML = `
        <div class="flex flex-col h-full">
          <div class="flex justify-between items-center mb-2 px-1">
               <span class="text-[10px] text-gray-400 font-mono flex items-center gap-2">
                  <span id="note-status"></span>
               </span>
               <div class="flex gap-2">
                  <button onclick="window.downloadNotes()" class="text-xs text-gray-500 hover:text-blue-500 transition-colors" title="Download .txt">
                      <i class="fa-solid fa-download"></i>
                  </button>
                  <button onclick="window.clearNotes()" class="text-xs text-gray-500 hover:text-red-500 transition-colors" title="Clear All">
                      <i class="fa-solid fa-trash"></i>
                  </button>
               </div>
          </div>

          <textarea 
              id="bnotepad-area"
              class="flex-1 w-full bg-yellow-50 dark:bg-[#151517] text-slate-800 dark:text-gray-300 font-mono text-sm leading-relaxed rounded-lg border border-gray-200 dark:border-white/10 p-3 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 resize-y transition-colors placeholder-gray-400"
              style="min-height: 200px;"
              placeholder="Escribe aquí... / Type here..."
              spellcheck="false"
              oninput="window.saveNotes(this.value)"
          ></textarea>
        </div>
      `;

      // 3. Restaurar valor
      const area = document.getElementById('bnotepad-area');
      if (area) area.value = savedNote;

      // 4. Idioma
      const currentLang = localStorage.getItem('nclex_lang') || 'es';
      const isEs = currentLang === 'es';
      container.querySelectorAll('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      container.querySelectorAll('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));

      // 5. Iniciar Drag Logic
      initDrag();
  }

  // Arrancar
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNotepad);
  } else {
      initNotepad();
  }

})();