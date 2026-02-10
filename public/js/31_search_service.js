// 31_search_service.js — Motor de Búsqueda Global con Drag & Drop
// VERSIÓN BLINDADA & FLOTANTE: Espera activamente a que los módulos carguen y permite arrastrar el botón.

(function() {
  'use strict';

  // Esperamos a que la app principal exponga su API
  if (!window.nclexApp && !window.NCLEX) return;

  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  const SearchService = {
    index: [],
    attempts: 0,
    maxAttempts: 15, // Aumentado para dar margen a la carga de módulos
    
    // Variables para el Drag & Drop
    isDragging: false,
    hasMoved: false,

    init() {
      console.log("🔍 Search Service: Iniciando...");
      this.injectUI();
      this.bindEvents();
      this.initDrag(); // Iniciar lógica de arrastre
      
      // Intentar indexar inmediatamente
      this.tryBuildIndex();
    },

    // LÓGICA DE REINTENTO (La clave para que funcione)
    tryBuildIndex() {
      // Acceder a los temas a través del método público de logic.js
      const topics = window.nclexApp && typeof window.nclexApp.getTopics === 'function' 
        ? window.nclexApp.getTopics() 
        : [];
        
      const count = topics.length;

      if (count > 0) {
        // ¡ÉXITO! Hay temas cargados
        this.buildIndex(topics);
        console.log(`✅ Search Service: Indexación completada. ${this.index.length} entradas generadas de ${count} módulos.`);
        
        // Actualizar el contador en el footer del modal
        const footerCount = document.getElementById('search-count-display');
        if(footerCount) footerCount.innerText = `${count} Modules Indexed`;
        
      } else {
        // FALLO TEMPORAL: Aún no hay temas, reintentar en 1 segundo
        this.attempts++;
        if (this.attempts < this.maxAttempts) {
          setTimeout(() => this.tryBuildIndex(), 1000);
        } else {
          console.error("❌ Search Service: Se agotaron los intentos. Verifique que logic.js esté cargado antes.");
        }
      }
    },

    buildIndex(topics) {
      this.index = [];
      topics.forEach(topic => {
        if (!topic || !topic.id) return;

        // Indexar ES y EN
        const textES = (topic.title?.es + ' ' + (topic.subtitle?.es || '')).toLowerCase();
        const textEN = (topic.title?.en + ' ' + (topic.subtitle?.en || '')).toLowerCase();

        this.index.push({
          id: topic.id,
          text: textES + ' | ' + textEN, // Búsqueda combinada
          titleObj: topic.title,
          subtitleObj: topic.subtitle,
          icon: topic.icon,
          color: topic.color
        });
      });
    },

    injectUI() {
      if (document.getElementById('global-search-btn')) return;

      // Recuperar posición guardada o usar default (esquina inferior derecha)
      const savedPos = JSON.parse(localStorage.getItem('nclex_search_pos')) || { bottom: '24px', right: '24px' };
      
      // Determinar estilo inicial. Si hay savedPos.top, usamos top/left, sino bottom/right.
      let styleString = '';
      if (savedPos.top) {
          styleString = `top: ${savedPos.top}; left: ${savedPos.left};`;
      } else {
          styleString = `bottom: ${savedPos.bottom}; right: ${savedPos.right};`;
      }

      // IMPORTANTE: Eliminamos las clases 'bottom-6 right-6' para que no interfieran con el estilo inline
      // Añadimos 'touch-action: none' para evitar scroll mientras se arrastra en móvil
      const html = `
        <button id="global-search-btn" 
                style="${styleString} touch-action: none; position: fixed;"
                class="z-[100] w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 group border-2 border-white dark:border-slate-800 cursor-grab active:cursor-grabbing">
           <i class="fa-solid fa-magnifying-glass text-xl pointer-events-none"></i>
        </button>

        <div id="search-modal" class="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300 flex items-start justify-center pt-24 px-4">
           <div id="search-container" class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden transform scale-95 transition-transform duration-300">
              <div class="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-4">
                 <i class="fa-solid fa-magnifying-glass text-gray-400 text-lg"></i>
                 <input type="text" id="global-search-input" 
                        class="w-full bg-transparent border-none focus:ring-0 text-lg text-slate-800 dark:text-white placeholder-gray-400 font-medium" 
                        placeholder="Buscar... / Search..." autocomplete="off">
                 <button id="close-search" class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                    <i class="fa-solid fa-xmark text-lg"></i>
                 </button>
              </div>
              <div id="search-results" class="max-h-[60vh] overflow-y-auto p-2 bg-gray-50 dark:bg-slate-950/50 min-h-[100px]">
                 <div class="text-center py-10 text-gray-400">
                    <p class="text-sm font-medium">${t('Escribe para buscar...', 'Type to search...')}</p>
                 </div>
              </div>
              <div class="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-[10px] text-gray-500 flex justify-between uppercase font-bold tracking-wider">
                 <span>ESC to close</span>
                 <span id="search-count-display">Loading...</span>
              </div>
           </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', html);
    },

    // NUEVA FUNCIÓN: Lógica para arrastrar el botón
    initDrag() {
        const btn = document.getElementById('global-search-btn');
        if (!btn) return;

        let offsetX, offsetY;
        let startX, startY;

        const startDrag = (e) => {
            // Prevenir scroll en móviles
            if (e.type === 'touchstart') {
                // e.preventDefault(); // Comentado para permitir tap simple sin bloquear UI
            }
            
            this.isDragging = false;
            this.hasMoved = false;

            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

            // Obtener posición actual del botón
            const rect = btn.getBoundingClientRect();
            
            // Calcular offset desde la esquina del botón
            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;

            startX = clientX;
            startY = clientY;

            // Listeners globales para el movimiento
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchmove', onDrag, { passive: false });
            document.addEventListener('touchend', endDrag);
        };

        const onDrag = (e) => {
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

            // Verificar si se ha movido lo suficiente para considerarlo un arrastre (umbral 5px)
            if (Math.abs(clientX - startX) > 5 || Math.abs(clientY - startY) > 5) {
                this.isDragging = true;
                this.hasMoved = true;
            }

            if (this.isDragging) {
                e.preventDefault(); // Prevenir selección de texto o scroll

                let newLeft = clientX - offsetX;
                let newTop = clientY - offsetY;

                // Restricciones de bordes (para que no salga de la pantalla)
                const maxX = window.innerWidth - btn.offsetWidth;
                const maxY = window.innerHeight - btn.offsetHeight;

                newLeft = Math.max(0, Math.min(newLeft, maxX));
                newTop = Math.max(0, Math.min(newTop, maxY));

                // Aplicar nuevas coordenadas
                btn.style.left = `${newLeft}px`;
                btn.style.top = `${newTop}px`;
                btn.style.bottom = 'auto';
                btn.style.right = 'auto';
            }
        };

        const endDrag = () => {
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', onDrag);
            document.removeEventListener('touchend', endDrag);

            // Guardar posición si hubo movimiento
            if (this.hasMoved) {
                const pos = {
                    top: btn.style.top,
                    left: btn.style.left
                };
                localStorage.setItem('nclex_search_pos', JSON.stringify(pos));
                
                // Pequeño timeout para resetear estado, para evitar conflicto con evento 'click'
                setTimeout(() => {
                    this.hasMoved = false;
                }, 50);
            }
        };

        btn.addEventListener('mousedown', startDrag);
        btn.addEventListener('touchstart', startDrag, { passive: false });
    },

    bindEvents() {
      const btn = document.getElementById('global-search-btn');
      const modal = document.getElementById('search-modal');
      const container = document.getElementById('search-container');
      const input = document.getElementById('global-search-input');
      const closeBtn = document.getElementById('close-search');

      if (!btn || !modal) return;

      const open = () => {
        // SI SE ESTÁ ARRASTRANDO, NO ABRIR
        if (this.hasMoved) return;

        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            container.classList.remove('scale-95');
            container.classList.add('scale-100');
        }, 10);
        input.value = '';
        input.focus();
      };

      const close = () => {
        modal.classList.add('opacity-0');
        container.classList.remove('scale-100');
        container.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
      };

      btn.addEventListener('click', open);
      // Soporte para touch end como click si no se movió
      btn.addEventListener('touchend', (e) => {
          if(!this.hasMoved) open();
      });

      closeBtn.addEventListener('click', close);
      modal.addEventListener('click', (e) => { if(e.target === modal) close(); });
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
        if (e.key === 'Escape') close();
      });

      input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        this.renderResults(query);
      });
    },

    renderResults(query) {
      const container = document.getElementById('search-results');
      if (query.length < 2) {
          container.innerHTML = `<div class="text-center py-10 text-gray-400 text-sm">...</div>`;
          return;
      }

      // Filtrar usando el índice combinado
      const matches = this.index.filter(item => item.text.includes(query));

      if (matches.length === 0) {
        container.innerHTML = `<div class="text-center py-8 text-gray-500">${t('Sin resultados', 'No results found')}</div>`;
        return;
      }

      let html = '<div class="space-y-2">';
      matches.forEach(match => {
        const titleHTML = t(match.titleObj.es, match.titleObj.en);
        const subHTML = match.subtitleObj ? t(match.subtitleObj.es, match.subtitleObj.en) : '';

        html += `
          <button onclick="window.nclexApp.navigate('topic/${match.id}'); document.getElementById('close-search').click();" 
                  class="w-full text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center gap-4 group border border-transparent hover:border-blue-100 dark:hover:border-blue-800">
             <div class="w-10 h-10 rounded-full bg-${match.color || 'blue'}-100 dark:bg-${match.color || 'blue'}-900/30 text-${match.color || 'blue'}-600 dark:text-${match.color || 'blue'}-400 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-${match.icon || 'book'}"></i>
             </div>
             <div class="flex-1 min-w-0">
                <div class="font-bold text-slate-800 dark:text-gray-200 text-sm truncate">${titleHTML}</div>
                <div class="text-xs text-gray-500 truncate">${subHTML}</div>
             </div>
             <i class="fa-solid fa-chevron-right text-gray-300 group-hover:text-blue-500"></i>
          </button>
        `;
      });
      html += '</div>';
      container.innerHTML = html;
      
      // Actualizar idioma manualmente
      const currentLang = localStorage.getItem('nclex_lang') || 'es';
      const isEs = currentLang === 'es';
      container.querySelectorAll('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      container.querySelectorAll('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
    }
  };

  SearchService.init();
})();