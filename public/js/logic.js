/* logic.js — Core navigation + Search + Progress + NGN INTEGRATION (MASTER VERSION) */

(function () {
    'use strict';
  
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
    // --- COLOR MAP SYSTEM (ROBUST) ---
    const colorMap = {
        blue:   { bg: 'bg-blue-500',   text: 'text-blue-500',   grad: 'from-blue-500 to-blue-600',   light: 'bg-blue-100',   dark: 'dark:bg-blue-900/30' },
        purple: { bg: 'bg-purple-500', text: 'text-purple-500', grad: 'from-purple-500 to-purple-600', light: 'bg-purple-100', dark: 'dark:bg-purple-900/30' },
        green:  { bg: 'bg-green-500',  text: 'text-green-500',  grad: 'from-green-500 to-green-600',  light: 'bg-green-100',  dark: 'dark:bg-green-900/30' },
        red:    { bg: 'bg-red-500',    text: 'text-red-500',    grad: 'from-red-500 to-red-600',    light: 'bg-red-100',    dark: 'dark:bg-red-900/30' },
        orange: { bg: 'bg-orange-500', text: 'text-orange-500', grad: 'from-orange-500 to-orange-600', light: 'bg-orange-100', dark: 'dark:bg-orange-900/30' },
        teal:   { bg: 'bg-teal-500',   text: 'text-teal-500',   grad: 'from-teal-500 to-teal-600',   light: 'bg-teal-100',   dark: 'dark:bg-teal-900/30' },
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', grad: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-100', dark: 'dark:bg-indigo-900/30' },
        cyan:   { bg: 'bg-cyan-500',   text: 'text-cyan-500',   grad: 'from-cyan-500 to-cyan-600',   light: 'bg-cyan-100',   dark: 'dark:bg-cyan-900/30' },
        pink:   { bg: 'bg-pink-500',   text: 'text-pink-500',   grad: 'from-pink-500 to-pink-600',   light: 'bg-pink-100',   dark: 'dark:bg-pink-900/30' },
        rose:   { bg: 'bg-rose-500',   text: 'text-rose-500',   grad: 'from-rose-500 to-rose-600',   light: 'bg-rose-100',   dark: 'dark:bg-rose-900/30' },
        slate:  { bg: 'bg-slate-500',  text: 'text-slate-500',  grad: 'from-slate-500 to-slate-600',  light: 'bg-slate-100',  dark: 'dark:bg-slate-800/50' },
        yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', grad: 'from-yellow-400 to-yellow-600', light: 'bg-yellow-100', dark: 'dark:bg-yellow-900/30' },
        emerald:{ bg: 'bg-emerald-500',text: 'text-emerald-500',grad: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-100', dark: 'dark:bg-emerald-900/30' },
        stone:  { bg: 'bg-stone-500',  text: 'text-stone-500',  grad: 'from-stone-500 to-stone-600',   light: 'bg-stone-100',   dark: 'dark:bg-stone-800/50' },
        violet: { bg: 'bg-violet-500', text: 'text-violet-500', grad: 'from-violet-500 to-violet-600', light: 'bg-violet-100', dark: 'dark:bg-violet-900/30' },
        sky:    { bg: 'bg-sky-500',    text: 'text-sky-500',    grad: 'from-sky-500 to-sky-600',     light: 'bg-sky-100',    dark: 'dark:bg-sky-900/30' },
        gray:   { bg: 'bg-gray-500',   text: 'text-gray-500',   grad: 'from-gray-500 to-gray-600',   light: 'bg-gray-100',   dark: 'dark:bg-gray-800/50' }
    };

    const getColor = (colorName) => colorMap[colorName] || colorMap.blue;
  
    // SAFE STORAGE
    let savedProgress = [];
    try {
        const stored = localStorage.getItem('nclex_progress');
        savedProgress = stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.warn("Error reading progress, resetting.", e);
        localStorage.setItem('nclex_progress', '[]');
    }
  
    const savedTheme = localStorage.getItem('nclex_theme') || 'dark';
    const savedLang = localStorage.getItem('nclex_lang') || 'es';
  
    const state = {
      topics: [],
      currentRoute: 'home',
      currentLang: savedLang,
      currentTheme: savedTheme,
      completedTopics: savedProgress,
      isAppLoaded: false,
      updateTimer: null,
      scrollPositions: {} 
    };
  
    // --- SMART SEARCH TEXT INDEX (NCLEX OPTIMIZED) ---
    const SmartTextIndex = (() => {
      const index = [];
      const PRIORITY_KEYWORDS = ['priority', 'safety', 'airway', 'breathing', 'circulation', 'emergency', 'assessment', 'risk', 'suicide'];
    
      function stripHTML(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
      }
    
      function extractHeadings(html) {
        const container = document.createElement('div');
        container.innerHTML = html;
        return Array.from(container.querySelectorAll('h2, h3, h4')).map(h => ({
          level: h.tagName.toLowerCase(),
          text: h.textContent.trim()
        }));
      }
    
      function normalize(text) {
        return text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      }
    
      function indexTopic(topic) {
        let rawContent = '';
    
        if (typeof topic.render === 'function') {
          rawContent = topic.render();
        } else if (typeof topic.content === 'string') {
          rawContent = topic.content;
        }
    
        if (!rawContent) return;
    
        const plainText = normalize(stripHTML(rawContent));
        const headings = extractHeadings(rawContent);
    
        index.push({
          id: topic.id,
          title: topic.title?.es || topic.title?.en || topic.title || '',
          subtitle: topic.subtitle?.es || topic.subtitle?.en || '',
          text: plainText,
          headings,
          color: topic.color || 'blue'
        });
      }
    
      function build(topics) {
        index.length = 0;
        topics.forEach(indexTopic);
      }
    
      function search(term) {
        const q = normalize(term);
        const results = [];
    
        index.forEach(topic => {
          if (!topic.text.includes(q)) return;
    
          let boost = 0;
          const combinedTitle = (topic.title + ' ' + topic.subtitle).toLowerCase();
          PRIORITY_KEYWORDS.forEach(pk => {
              if(combinedTitle.includes(pk)) boost += 5;
          });

          topic.headings.forEach(h => {
            if (normalize(h.text).includes(q)) {
              results.push({
                type: 'section',
                topicId: topic.id,
                topicTitle: topic.title,
                heading: h.text,
                color: topic.color,
                boost: boost
              });
            }
          });
    
          results.push({
            type: 'topic',
            topicId: topic.id,
            topicTitle: topic.title,
            color: topic.color,
            boost: boost
          });
        });
    
        return results;
      }
    
      return { build, search };
    })();

    window.NCLEX = {
      registerTopic(topic) {
        if (!topic || !topic.id) return;
        topic.id = String(topic.id);
        
        const idx = state.topics.findIndex(t => t.id === topic.id);
        if (idx >= 0) {
            state.topics[idx] = topic;
        } else {
            state.topics.push(topic);
        }

        state.topics.sort((a, b) => {
            const numA = parseInt(a.id.match(/^\d+/)?.[0]) || 999;
            const numB = parseInt(b.id.match(/^\d+/)?.[0]) || 999;
            if (numA !== numB) return numA - numB;
            return a.id.localeCompare(b.id);
        });
        
        if (state.updateTimer) clearTimeout(state.updateTimer);
        state.updateTimer = setTimeout(() => {
            if (state.isAppLoaded) {
                updateNav();
                SmartTextIndex.build(state.topics);
                if (state.currentRoute === `topic/${topic.id}`) {
                    render(state.currentRoute);
                }
            }
        }, 50);
      },
      getAllTopics() { return state.topics; }
    };
  
    window.nclexApp = {
      navigate(route) {
        if (state.currentRoute === route && route !== 'home') return true;
        
        const main = $('#main-content');
        if (main) state.scrollPositions[state.currentRoute] = main.scrollTop;

        state.currentRoute = route;
        render(route);
        updateNavActive(route);
        
        if(route === 'home' && state.scrollPositions['home']) {
            setTimeout(() => { if(main) main.scrollTop = state.scrollPositions['home']; }, 10);
        } else {
            if(window.scrollToTop) window.scrollToTop();
        }
        return true;
      },
      
      toggleLanguage() {
        state.currentLang = state.currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('nclex_lang', state.currentLang);
        applyLanguageGlobal(); 
      },
      
      toggleTheme() {
        state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('nclex_theme', state.currentTheme);
        applyTheme();
        updateNavActive(state.currentRoute); 
      },
      
      toggleTopicComplete(topicId) {
          const index = state.completedTopics.indexOf(topicId);
          if (index > -1) state.completedTopics.splice(index, 1);
          else state.completedTopics.push(topicId);
          localStorage.setItem('nclex_progress', JSON.stringify(state.completedTopics));
          
          render(state.currentRoute);
          updateNav();
      },

      navigateToQuestion(index) {
          this.navigate('simulator');
          let attempts = 0;
          const interval = setInterval(() => {
              if (window.showSimulatorQuestion) {
                  window.showSimulatorQuestion(index);
                  clearInterval(interval);
              } else if (attempts >= 10) {
                  clearInterval(interval);
              }
              attempts++;
          }, 100);
      },
  
      getTopics() { return state.topics; }
    };
  
    window.scrollToTop = function() {
      const main = $('#main-content');
      if(main) main.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    if(!window.toggleNotepad) {
        window.toggleNotepad = function() { console.warn("Notepad module not yet loaded."); };
    }
  
    // --- BUSCADOR DE SIDEBAR ---
    function initSearch() {
      const searchInput = $('#global-search');
      if(!searchInput) return; 
  
      searchInput.addEventListener('input', (e) => {
          const term = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const navContainer = $('#topics-nav');
          if(!navContainer) return;
  
          const buttons = $$('.nav-btn', navContainer);
          buttons.forEach(btn => {
              if (term === '') {
                  btn.style.display = 'flex';
              } else {
                  const text = btn.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  const route = btn.getAttribute('data-route') || '';
                  if (text.includes(term) || route.includes(term)) {
                      btn.style.display = 'flex';
                  } else {
                      btn.style.display = 'none';
                  }
              }
          });
      });
    }
  
    // --- BUSCADOR DE PÁGINA PRINCIPAL (INTELIGENTE) ---
    function initHomeSearch() {
      const searchInput = $('#home-search');
      const clearBtn = $('#clear-search');
      if (!searchInput) return;
  
      const RESULT_CONTAINER_ID = 'dashboard-search-results';
      let resultsContainer = $('#' + RESULT_CONTAINER_ID);
      
      if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = RESULT_CONTAINER_ID; 
        resultsContainer.className = 'hidden absolute w-full z-50 top-full left-0 mt-2 bg-white dark:bg-[#1C1C1E] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ring-1 ring-black/5 no-scrollbar';
        
        if (searchInput.parentNode) {
          searchInput.parentNode.style.position = 'relative';
          searchInput.parentNode.appendChild(resultsContainer);
        }
      }
  
      let searchTimeout = null;
  
      const handleInput = (e) => {
        const term = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        
        if (clearBtn) {
            clearBtn.classList.toggle('hidden', term.length === 0);
        }

        if (searchTimeout) clearTimeout(searchTimeout);
        
        if (term.length < 2) {
          resultsContainer.classList.add('hidden');
          return;
        }
  
        searchTimeout = setTimeout(() => {
          performHomeSearch(term, resultsContainer);
        }, 300);
      };

      searchInput.addEventListener('input', handleInput);
      
      if (clearBtn) {
          clearBtn.addEventListener('click', () => {
              searchInput.value = '';
              resultsContainer.classList.add('hidden');
              clearBtn.classList.add('hidden');
              searchInput.focus();
          });
      }
  
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
          resultsContainer.classList.add('hidden');
        }
      });
    }
  
    function performHomeSearch(term, resultsContainer) {
      const searchResults = [];
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const termRegex = new RegExp(escapedTerm, 'g');
      
      state.topics.forEach(topic => {
        let score = 0;
        let matches = [];
        
        const titleEs = topic.title?.es?.toLowerCase() || '';
        const titleEn = topic.title?.en?.toLowerCase() || '';
        const subtitleEs = topic.subtitle?.es?.toLowerCase() || '';
        const subtitleEn = topic.subtitle?.en?.toLowerCase() || '';
        
        if (titleEs.includes(term) || titleEn.includes(term)) {
          score += 20;
          matches.push('title');
        }
        
        if (subtitleEs.includes(term) || subtitleEn.includes(term)) {
          score += 10;
          matches.push('subtitle');
        }
        
        if (topic.content && typeof topic.content === 'string') {
          const content = topic.content.toLowerCase();
          const contentMatches = (content.match(termRegex) || []).length;
          if (contentMatches > 0) {
            score += contentMatches;
            matches.push(`content (${contentMatches} matches)`);
          }
        }
        
        if (topic.keywords) {
          const keywords = Array.isArray(topic.keywords) ? topic.keywords : [];
          const keywordMatches = keywords.filter(kw => 
            kw.toLowerCase().includes(term)
          ).length;
          if (keywordMatches > 0) {
            score += keywordMatches * 5;
            matches.push(`keywords (${keywordMatches} matches)`);
          }
        }
        
        if (score > 0) {
          searchResults.push({
            type: 'topic',
            topic,
            score,
            matches,
            title: topic.title,
            subtitle: topic.subtitle,
            color: topic.color || 'blue'
          });
        }
      });
      
      if (window.SIMULATOR_QUESTIONS && Array.isArray(window.SIMULATOR_QUESTIONS)) {
        window.SIMULATOR_QUESTIONS.forEach((q, idx) => {
          let score = 0;
          let matches = [];
          
          const text = (q.text || '').toLowerCase();
          const explanation = (q.explanation || '').toLowerCase();
          const tags = (q.tags || []).map(t => t.toLowerCase());
          
          if (text.includes(term)) {
            score += 8;
            matches.push('question');
          }
          
          if (explanation.includes(term)) {
            score += 4;
            matches.push('explanation');
          }
          
          const tagMatches = tags.filter(tag => tag.includes(term));
          if (tagMatches.length > 0) {
            score += tagMatches.length * 2;
            matches.push(`tags (${tagMatches.length} matches)`);
          }
          
          if (score > 0) {
            searchResults.push({
              type: 'question',
              question: q,
              index: idx,
              score,
              matches,
              title: { es: q.text?.slice(0, 80) + '...', en: q.text?.slice(0, 80) + '...' },
              subtitle: { es: 'Pregunta del Simulador', en: 'Simulator Question' },
              color: 'purple'
            });
          }
        });
      }

      const textMatches = SmartTextIndex.search(term);
      
      textMatches.forEach(match => {
        const fullTopic = state.topics.find(t => t.id === match.topicId);
        const existing = searchResults.find(r => r.type === 'topic' && r.topic.id === match.topicId);
        
        if (existing) {
             existing.score += (5 + (match.boost || 0));
             return;
        }

        searchResults.push({
          type: 'topic',
          topic: fullTopic || {
            id: match.topicId,
            title: { es: match.topicTitle, en: match.topicTitle },
            color: match.color
          },
          score: (match.type === 'section' ? 12 : 6) + (match.boost || 0),
          matches: match.heading ? [`section: ${match.heading}`] : ['content'],
          title: { es: match.heading || match.topicTitle, en: match.heading || match.topicTitle },
          subtitle: { 
            es: match.heading ? 'Coincidencia en sección' : 'Coincidencia en contenido',
            en: match.heading ? 'Section match' : 'Content match'
          },
          color: match.color
        });
      });
      
      searchResults.sort((a, b) => b.score - a.score);
      
      if (searchResults.length === 0) {
        resultsContainer.innerHTML = `
          <div class="p-8 text-center">
            <i class="fa-solid fa-search text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-500 font-medium">
              <span class="lang-es">No se encontraron resultados para "<span class="text-brand-blue">${term}</span>"</span>
              <span class="lang-en hidden-lang">No results found for "<span class="text-brand-blue">${term}</span>"</span>
            </p>
            <p class="text-sm text-gray-400 mt-2">
              <span class="lang-es">Intenta con palabras más generales o términos médicos específicos</span>
              <span class="lang-en hidden-lang">Try more general words or specific medical terms</span>
            </p>
          </div>
        `;
      } else {
        resultsContainer.innerHTML = `
          <div class="p-4 border-b border-gray-100 dark:border-brand-border bg-gray-50 dark:bg-black/20">
            <h3 class="font-bold text-sm text-gray-700 dark:text-gray-300">
              <i class="fa-solid fa-search mr-2 text-brand-blue"></i>
              <span class="lang-es">${searchResults.length} resultados para "<span class="text-brand-blue">${term}</span>"</span>
              <span class="lang-en hidden-lang">${searchResults.length} results for "<span class="text-brand-blue">${term}</span>"</span>
            </h3>
          </div>
          <div class="max-h-96 overflow-y-auto">
            ${searchResults.map((result, idx) => {
              const colors = getColor(result.color);
              const icon = result.type === 'topic' ? 
                normalizeFaIcon(result.topic.icon) : 'brain';
              
              const matchInfo = result.matches.join(', ');
              const titleHTML = getBilingualTitle({ title: result.title });
              const subtitleHTML = getBilingualTitle({ title: result.subtitle });
              
              return `
              <div class="p-4 border-b border-gray-100 dark:border-brand-border hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" 
                   onclick="${result.type === 'topic' ? `window.nclexApp.navigate('topic/${result.topic.id}')` : `window.nclexApp.navigateToQuestion(${result.index})`}">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br ${colors.grad} flex items-center justify-center text-white flex-shrink-0">
                    <i class="fa-solid fa-${icon}"></i>
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-start">
                      <h4 class="font-bold text-slate-900 dark:text-white line-clamp-2">${titleHTML}</h4>
                      <span class="text-xs px-2 py-1 rounded-full ${colors.light} ${colors.text}">
                        ${result.type === 'topic' ? 
                          '<span class="lang-es">Tema</span><span class="lang-en hidden-lang">Topic</span>' : 
                          '<span class="lang-es">Simulador</span><span class="lang-en hidden-lang">Simulator</span>'}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${subtitleHTML}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <i class="fa-solid fa-signal mr-1"></i> ${result.score} pts
                      </span>
                      <span class="text-xs text-gray-500">
                        <i class="fa-solid fa-check mr-1"></i> ${matchInfo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              `;
            }).join('')}
          </div>
        `;
      }
      
      resultsContainer.classList.remove('hidden');
    }
  
    function applyLanguageGlobal() {
      const isEs = state.currentLang === 'es';
      document.documentElement.lang = isEs ? 'es' : 'en';
      
      $$('.lang-es').forEach(el => isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      $$('.lang-en').forEach(el => !isEs ? el.classList.remove('hidden-lang') : el.classList.add('hidden-lang'));
      
      const searchInput = $('#global-search');
      if(searchInput) searchInput.placeholder = isEs ? "Buscar..." : "Search...";
      
      const homeSearchInput = $('#home-search');
      if(homeSearchInput) {
        homeSearchInput.placeholder = isEs ? 
          "Buscar términos médicos, diagnósticos, fármacos..." : 
          "Search medical terms, diagnoses, drugs...";
      }
    }
  
    function applyTheme() {
      document.documentElement.classList.toggle('dark', state.currentTheme === 'dark');
    }
  
    function getBilingualTitle(t) {
        if (!t.title) return 'Sin título';
        if (typeof t.title === 'object') {
            return `<span class="lang-es">${t.title.es || ''}</span><span class="lang-en hidden-lang">${t.title.en || ''}</span>`;
        }
        return t.title;
    }

    function normalizeFaIcon(icon) {
        if (typeof icon !== 'string') return 'book';
        const raw = icon.trim();
        if (!raw) return 'book';
        const tokens = raw.split(/\s+/).filter(Boolean);
        const exclude = new Set([
            'fa', 'fas', 'far', 'fal', 'fad', 'fab',
            'fa-solid', 'fa-regular', 'fa-light', 'fa-thin', 'fa-duotone', 'fa-brands',
            'fa-sharp', 'fa-sharp-solid', 'fa-sharp-regular', 'fa-sharp-light', 'fa-sharp-thin',
            'fa-fw', 'fa-ul', 'fa-li', 'fa-border', 'fa-pull-left', 'fa-pull-right',
            'fa-spin', 'fa-pulse', 'fa-beat', 'fa-fade', 'fa-bounce', 'fa-flip', 'fa-shake',
            'fa-xs', 'fa-sm', 'fa-lg', 'fa-xl', 'fa-2xs', 'fa-2xl',
            'fa-1x','fa-2x','fa-3x','fa-4x','fa-5x','fa-6x','fa-7x','fa-8x','fa-9x','fa-10x',
            'fa-rotate-90','fa-rotate-180','fa-rotate-270','fa-flip-horizontal','fa-flip-vertical','fa-flip-both',
            'fa-inverse'
        ]);

        for (let i = tokens.length - 1; i >= 0; i--) {
            const tok = tokens[i];
            if (!tok) continue;
            if (exclude.has(tok)) continue;
            if (tok.startsWith('fa-')) {
                const name = tok.slice(3);
                if (name) return name;
            }
            if (tokens.length == 1) return tok.replace(/^fa-/, '') || 'book';
        }
        return 'book';
    }

    function getClinicalBadges(t) {
        const title = (typeof t.title === 'object' ? (t.title.en + t.title.es) : t.title).toLowerCase();
        let badges = '';
        if(title.includes('pharm') || title.includes('drug')) 
            badges += `<span title="Pharmacology" class="mr-1 text-xs">💊</span>`;
        if(title.includes('pediatric') || title.includes('child') || title.includes('newborn')) 
            badges += `<span title="Pediatrics" class="mr-1 text-xs">👶</span>`;
        if(title.includes('maternity') || title.includes('ob/gyn') || title.includes('labor')) 
            badges += `<span title="Maternity" class="mr-1 text-xs">🤰</span>`;
        if(title.includes('priority') || title.includes('emergency') || title.includes('critical')) 
            badges += `<span title="High Priority" class="mr-1 text-xs">🚨</span>`;
        return badges;
    }
  
    function updateNav() {
      const container = $('#topics-nav');
      if (!container) return;
  
      container.innerHTML = state.topics.map(t => {
        const isComplete = state.completedTopics.includes(t.id);
        const checkMark = isComplete ? `<i class="fa-solid fa-circle-check text-green-500 ml-auto text-xs"></i>` : '';
        const titleHTML = getBilingualTitle(t);
        const colors = getColor(t.color || 'blue');
        
        return `
        <button onclick="window.nclexApp.navigate('topic/${t.id}')" data-route="topic/${t.id}" class="nav-btn w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-500 dark:text-gray-400 group text-left">
          <div class="w-6 flex justify-center shrink-0">
              <i class="fa-solid fa-${normalizeFaIcon(t.icon)} ${colors.text} group-hover:scale-110 transition-transform"></i>
          </div>
          <span class="hidden lg:block text-sm font-bold truncate flex-1">${titleHTML}</span>
          ${checkMark}
        </button>
      `}).join('');
      
      updateNavActive(state.currentRoute);
      applyLanguageGlobal();
      
      const searchInput = $('#global-search');
      if(searchInput && searchInput.value) {
          searchInput.dispatchEvent(new Event('input'));
      }
    }
  
    function updateNavActive(route) {
      $$('.nav-btn').forEach(btn => {
        const btnRoute = btn.getAttribute('data-route');
        const isActive = btnRoute === route;
        
        btn.classList.remove('bg-gray-100', 'bg-white/10', 'text-brand-blue', 'text-white', 'text-gray-500', 'text-gray-400', 'dark:text-gray-400');
        
        if (isActive) {
           if (state.currentTheme === 'light') {
               btn.classList.add('bg-gray-100', 'text-brand-blue'); 
           } else {
               btn.classList.add('bg-white/10', 'text-white'); 
           }
        } else {
           btn.classList.add('text-gray-500', 'dark:text-gray-400');
        }
      });
    }
  
    function render(route) {
      const view = $('#app-view');
      if (!view) return;
  
      view.style.opacity = '0';
      view.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
          try {
              if (route === 'home') {
                view.innerHTML = renderHome();
                setTimeout(() => initHomeSearch(), 50);
              } else if (route === 'simulator') {
                if (window.renderSimulatorPage) {
                  view.innerHTML = window.renderSimulatorPage();
                } else {
                  view.innerHTML = `<div class="p-10 text-center flex flex-col items-center justify-center h-64">
                    <i class="fa-solid fa-spinner animate-spin text-4xl text-brand-blue mb-4"></i>
                    <p class="text-gray-500">
                        <span class="lang-es">Cargando Simulador...</span>
                        <span class="lang-en hidden-lang">Loading Simulator...</span>
                    </p>
                  </div>`;
                  setTimeout(() => {
                      if(window.renderSimulatorPage && state.currentRoute === 'simulator') {
                          view.innerHTML = window.renderSimulatorPage();
                          applyLanguageGlobal();
                      }
                  }, 800);
                }
              } else if (route === 'ngn-sepsis') {
                  if (window.renderNGNCase) {
                      view.innerHTML = window.renderNGNCase('sepsis');
                  } else {
                      view.innerHTML = `<div class="p-10 text-center flex flex-col items-center justify-center h-64">
                        <i class="fa-solid fa-user-doctor animate-pulse text-4xl text-rose-500 mb-4"></i>
                        <p class="text-gray-500">
                            <span class="lang-es">Inicializando Motor NGN...</span>
                            <span class="lang-en hidden-lang">Initializing NGN Engine...</span>
                        </p>
                      </div>`;
                      setTimeout(() => {
                          if (window.renderNGNCase) {
                               view.innerHTML = window.renderNGNCase('sepsis');
                          } else {
                              view.innerHTML = `<div class="p-8 bg-red-100 text-red-800 rounded-xl border border-red-200">
                                  <h3 class="font-bold">Error</h3>
                                  <p>NGN Engine not loaded. Please check ngn_engine.js</p>
                              </div>`;
                          }
                          applyLanguageGlobal();
                      }, 1000);
                  }
              } else if (route.startsWith('topic/')) {
                const topicId = route.split('/')[1];
                view.innerHTML = renderTopic(topicId);
              } else {
                view.innerHTML = `<div class="p-10 text-center text-gray-500">
                    <span class="lang-es">Módulo no encontrado o ruta desconocida.</span>
                    <span class="lang-en hidden-lang">Module not found or unknown route.</span>
                </div>`;
              }
          } catch (err) {
              console.error(err);
              view.innerHTML = `<div class="p-4 bg-red-100 text-red-800 rounded-lg">Error de renderizado / Render error: ${err.message}</div>`;
          }
  
          applyLanguageGlobal();
          updateNavActive(route);
          
          view.style.opacity = '1';
          view.style.transform = 'translateY(0)';
          
      }, 150);
  
      const backBtn = $('#back-to-top');
      if (backBtn) {
          if (route === 'home') {
             backBtn.classList.add('hidden');
             backBtn.classList.remove('flex');
          } else {
             backBtn.classList.remove('hidden');
             backBtn.classList.add('flex');
          }
      }
    }
  
    function renderHome() {
      const totalTopics = state.topics.length;
      const completedCount = state.completedTopics.length;
      const progressPercent = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);
  
      const topicsHTML = state.topics.length > 0
        ? state.topics.map(t => {
            const isComplete = state.completedTopics.includes(t.id);
            const borderClass = isComplete ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200 dark:border-brand-border';
            const iconCheck = isComplete ? '<div class="absolute top-4 right-4 text-green-500 animate-bounce-short"><i class="fa-solid fa-circle-check text-xl"></i></div>' : '';
            const titleHTML = getBilingualTitle(t);
            const colors = getColor(t.color || 'blue');
            const subtitleHTML = typeof t.subtitle === 'object' ? `<span class="lang-es">${t.subtitle.es}</span><span class="lang-en hidden-lang">${t.subtitle.en}</span>` : (t.subtitle || 'Guía NCLEX');
            const badges = getClinicalBadges(t);
  
            return `
          <div role="button" onclick="window.nclexApp.navigate('topic/${t.id}')" class="bg-white dark:bg-brand-card p-6 rounded-2xl shadow-lg border ${borderClass} hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer relative">
            ${iconCheck}
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br ${colors.grad} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-${normalizeFaIcon(t.icon)} text-xl"></i>
              </div>
              <div class="flex gap-1">${badges}</div>
            </div>
            <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-white truncate" title="${t.title?.es || t.title}">${titleHTML}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 truncate">${subtitleHTML}</p>
            <div class="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full ${colors.bg} w-0 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>
        `}).join('')
        : `<div class="col-span-full p-10 text-center text-gray-500 animate-pulse">
            <span class="lang-es">Cargando módulos educativos...</span>
            <span class="lang-en hidden-lang">Loading educational modules...</span>
        </div>`;
  
      return `
        <header class="mb-8 animate-slide-in">
          <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            <span class="lang-es">Sistema NCLEX Masterclass</span>
            <span class="lang-en hidden-lang">NCLEX Masterclass OS</span>
          </h1>
          <p class="text-gray-500 text-lg">
            <span class="lang-es">Tu éxito empieza hoy.</span>
            <span class="lang-en hidden-lang">Your success starts today.</span>
          </p>
        </header>
        <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg mb-10 relative overflow-hidden">
           <div class="flex justify-between items-end mb-2 relative z-10">
             <div>
                 <h2 class="text-xl font-bold text-slate-900 dark:text-white">
                     <span class="lang-es">Progreso Global</span><span class="lang-en hidden-lang">Overall Progress</span>
                 </h2>
                 <p class="text-sm text-gray-500">${completedCount} / ${totalTopics} <span class="lang-es">módulos</span><span class="lang-en hidden-lang">modules</span></p>
             </div>
             <span class="text-3xl font-black text-brand-blue">${progressPercent}%</span>
           </div>
           <div class="w-full h-4 bg-gray-100 dark:bg-black/40 rounded-full overflow-hidden relative z-10">
             <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out" style="width: ${progressPercent}%"></div>
           </div>
        </div>

        <div class="bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg mb-10 relative">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">
                <i class="fa-solid fa-search mr-2 text-brand-blue"></i>
                <span class="lang-es">Búsqueda Inteligente</span>
                <span class="lang-en hidden-lang">Smart Search</span>
              </h2>
              <p class="text-sm text-gray-500">
                <span class="lang-es">Encuentra información en todos los módulos</span>
                <span class="lang-en hidden-lang">Find information across all modules</span>
              </p>
            </div>
            <div class="text-xs px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-bold">
              <span class="lang-es">${state.topics.length} temas</span>
              <span class="lang-en hidden-lang">${state.topics.length} topics</span>
            </div>
          </div>
          
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              id="home-search"
              class="w-full bg-white dark:bg-black/30 border-2 border-gray-200 dark:border-brand-border focus:border-brand-blue rounded-2xl py-4 pl-12 pr-10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 shadow-sm transition-all"
              placeholder="Buscar términos médicos, diagnósticos, fármacos..."
            />
            <button id="clear-search" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-blue hidden p-1">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          
          <div class="flex flex-wrap gap-2 mt-4">
            <span class="text-xs text-gray-500 font-medium">
              <span class="lang-es">Ejemplos:</span>
              <span class="lang-en hidden-lang">Examples:</span>
            </span>
            <button onclick="document.getElementById('home-search').value='diabetes'; document.getElementById('home-search').dispatchEvent(new Event('input'));" class="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors">
              diabetes
            </button>
            <button onclick="document.getElementById('home-search').value='cardiovascular'; document.getElementById('home-search').dispatchEvent(new Event('input'));" class="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors">
              cardiovascular
            </button>
            <button onclick="document.getElementById('home-search').value='pediatrics'; document.getElementById('home-search').dispatchEvent(new Event('input'));" class="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors">
              pediatrics
            </button>
            <button onclick="document.getElementById('home-search').value='SATA'; document.getElementById('home-search').dispatchEvent(new Event('input'));" class="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors">
              SATA
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
           <div role="button" onclick="window.nclexApp.navigate('simulator')" class="col-span-1 bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-3xl text-white shadow-xl cursor-pointer hover:shadow-2xl transition-all relative overflow-hidden group">
                <div class="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-125 transition-transform"><i class="fa-solid fa-brain text-8xl"></i></div>
                <h2 class="text-xl font-black mb-1 relative z-10"><i class="fa-solid fa-gamepad mr-2"></i><span class="lang-es">Simulador</span><span class="lang-en hidden-lang">Simulator</span></h2>
                <p class="text-sm opacity-90 mt-2 relative z-10"><span class="lang-es">Práctica adaptativa (SATA + Opciones)</span><span class="lang-en hidden-lang">Adaptive practice (SATA + Options)</span></p>
           </div>
           
           <div role="button" onclick="window.nclexApp.navigate('ngn-sepsis')" class="col-span-1 bg-gradient-to-br from-rose-500 to-orange-600 p-6 rounded-3xl text-white shadow-xl cursor-pointer hover:shadow-2xl transition-all relative overflow-hidden group">
                <div class="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-125 transition-transform"><i class="fa-solid fa-user-doctor text-8xl"></i></div>
                <h2 class="text-xl font-black mb-1 relative z-10"><i class="fa-solid fa-notes-medical mr-2"></i>NGN Case: Sepsis</h2>
                <p class="text-sm opacity-90 mt-2 relative z-10"><span class="lang-es">Estudio de caso de nueva generación</span><span class="lang-en hidden-lang">Next Gen Case Study Demo</span></p>
           </div>

           <div class="col-span-1 bg-white dark:bg-brand-card p-6 rounded-3xl border border-gray-200 dark:border-brand-border shadow-lg flex flex-col justify-center">
             <h2 class="text-xl font-bold mb-1"><i class="fa-solid fa-layer-group text-brand-blue mr-2"></i><span class="lang-es">Biblioteca</span><span class="lang-en hidden-lang">Library</span></h2>
             <div>
                 <span class="text-4xl font-black">${state.topics.length}</span> <span class="text-gray-500 text-sm"><span class="lang-es">Temas</span><span class="lang-en hidden-lang">Topics</span></span>
             </div>
           </div>
        </div>
        <section>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            ${topicsHTML}
          </div>
        </section>
      `;
    }
  
    function renderTopic(topicId) {
      const topic = state.topics.find(t => t.id === topicId);
      if (!topic) return `<div class="p-10 text-center"><h2 class="text-xl font-bold">Error 404</h2><p>Topic ID ${topicId} not found.</p></div>`;
      
      const isComplete = state.completedTopics.includes(topicId);
      const completeBtn = `
          <button onclick="window.nclexApp.toggleTopicComplete('${topicId}')" class="px-6 py-3 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2 ${isComplete ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'}">
              <i class="fa-solid ${isComplete ? 'fa-circle-check' : 'fa-circle'}"></i>
              <span class="lang-es">${isComplete ? 'Completado' : 'Marcar Leído'}</span>
              <span class="lang-en hidden-lang">${isComplete ? 'Completed' : 'Mark as Read'}</span>
          </button>`;
  
      let content = typeof topic.render === 'function' ? topic.render() : (topic.content || '');
      
      if(content.includes('</header>')) {
          content = content.replace('</header>', `<div class="mt-4 flex justify-end md:absolute md:top-8 md:right-8">${completeBtn}</div></header>`);
          content = content.replace('<header', '<header class="relative" ');
      } else {
          content = `<div class="mb-6 flex justify-end sticky top-0 z-20 bg-brand-bg/95 dark:bg-brand-dark/95 backdrop-blur py-2">${completeBtn}</div>` + content;
      }
      
      return `
        <div class="animate-fade-in pb-20 relative">
            <button onclick="window.nclexApp.navigate('home')" class="mb-4 flex items-center gap-2 text-gray-500 hover:text-brand-blue transition-colors font-medium text-sm group">
                <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> <span class="lang-es">Volver al Inicio</span><span class="lang-en hidden-lang">Back to Home</span>
            </button>
            <div class="prose prose-slate dark:prose-invert max-w-none prose-h1:text-3xl prose-h2:text-2xl prose-a:text-brand-blue">
                ${content}
            </div>
        </div>
      `;
    }
  
    function init() {
      applyTheme();
      applyLanguageGlobal();
      state.isAppLoaded = true;
      updateNav();
      
      SmartTextIndex.build(state.topics);
      
      render('home');
      updateNavActive('home');
      
      initSearch();
      
      const loader = $('#loading');
      if(loader) setTimeout(() => loader.classList.add('hidden'), 500);
    }
  
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  
})();