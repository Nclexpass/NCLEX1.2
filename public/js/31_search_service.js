// 31_search_service.js — Deep Search Engine (Safe Version)
(function() {
  'use strict';

  const SearchService = {
    index: [],
    isReady: false,
    attempts: 0,
    maxAttempts: 15,

    init() {
      console.log("🔍 Smart Search: Iniciando cerebro...");
      this.tryBuildIndex();
    },

    tryBuildIndex() {
      const topics = window.nclexApp && typeof window.nclexApp.getTopics === 'function' 
        ? window.nclexApp.getTopics() : [];
      if (topics.length > 0) {
        this.buildIndex(topics);
      } else {
        this.attempts++;
        if (this.attempts < this.maxAttempts) setTimeout(() => this.tryBuildIndex(), 1000);
      }
    },

    // FUNCIÓN CRÍTICA: Extrae títulos sin importar cómo estén escritos en el módulo
    getSafeTitle(t, lang) {
      if (!t) return "";
      if (t.title && typeof t.title === 'object') return t.title[lang] || t.title['es'] || "";
      if (t[`label_${lang}`]) return t[`label_${lang}`];
      return t.name || t.id || "Módulo";
    },

    buildIndex(topics) {
      this.index = [];
      topics.forEach(topic => {
        if (!topic || !topic.id) return;
        
        const titleES = this.getSafeTitle(topic, 'es');
        const titleEN = this.getSafeTitle(topic, 'en');

        const div = document.createElement('div');
        div.innerHTML = (typeof topic.render === 'function' ? topic.render() : topic.content) || '';
        const rawContent = div.textContent || div.innerText || '';

        this.index.push({
          id: topic.id,
          fullSearchText: (titleES + ' ' + titleEN + ' ' + rawContent).toLowerCase(),
          titleES, titleEN,
          icon: topic.icon || 'book',
          preview: rawContent.substring(0, 80).trim() + '...'
        });
      });
      this.isReady = true;
      console.log(`✅ Smart Search: ${this.index.length} módulos indexados con éxito.`);
    },

    query(term) {
      if (!term || term.length < 2) return [];
      const q = term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return this.index.filter(item => {
          const target = item.fullSearchText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return target.includes(q);
      });
    }
  };

  window.SmartSearchEngine = SearchService;
  SearchService.init();
})();