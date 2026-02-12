// premium_books_library.js — Library (sin "Premium") desde GitHub Releases
(function() {
  'use strict';

  const GITHUB_RELEASE_URL = 'https://api.github.com/repos/Nclexpass/NCLEX1.2/releases/tags/BOOKS';
  const state = {
    books: [],
    isLoading: false,
    error: null
  };

  function t(es, en) {
    const esEl = document.querySelector('.lang-es');
    return esEl && esEl.offsetParent !== null ? es : en;
  }

  function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  async function fetchBooks() {
    state.isLoading = true;
    state.error = null;
    renderModalContent();

    try {
      const response = await fetch(GITHUB_RELEASE_URL);
      if (!response.ok) throw new Error('No se pudo conectar con GitHub');
      const release = await response.json();

      state.books = (release.assets || [])
        .filter(asset => (asset.name || '').toLowerCase().endsWith('.pdf'))
        .map(asset => ({
          id: asset.id,
          name: (asset.name || '').replace('.pdf', '').replace(/-/g, ' '),
          size: asset.size,
          downloadUrl: asset.browser_download_url,
          updatedAt: new Date(asset.updated_at)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching GitHub release:', error);
      state.error = error.message;
      state.books = [];
    } finally {
      state.isLoading = false;
      renderModalContent();
    }
  }

  function createModal() {
    if (document.getElementById('library-modal')) return;

    const modalHTML = `
      <div id="library-modal" class="fixed inset-0 z-[9999] hidden items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="w-full max-w-4xl max-h-[85vh] apple-glass rounded-2xl overflow-hidden flex flex-col">
          <div class="apple-titlebar flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-white/10">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <i class="fa-solid fa-book-open text-white text-sm"></i>
              </div>
              <div>
                <h2 class="font-semibold text-gray-800 dark:text-white text-base">Library</h2>
                <p id="lib-subtitle" class="text-xs text-gray-500 dark:text-gray-400">NCLEX PDF Collection</p>
              </div>
            </div>
            <button onclick="window.library?.close()" class="w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div id="lib-content" class="flex-1 overflow-y-auto p-5 apple-scrollbar" style="max-height: calc(85vh - 70px);">
            <div class="flex flex-col items-center justify-center h-40 text-gray-500">
              <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-3"></i>
              <p>Cargando catálogo desde GitHub...</p>
            </div>
          </div>

          <div class="px-5 py-3 border-t border-gray-200 dark:border-white/10 text-xs text-gray-500 flex justify-between items-center bg-white/50 dark:bg-black/20">
            <span><i class="fa-regular fa-circle-check mr-1"></i> Fuente: GitHub Releases</span>
            <button onclick="window.library.refresh()" class="px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center gap-1">
              <i class="fa-solid fa-rotate"></i> Actualizar
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  function renderModalContent() {
    const contentEl = document.getElementById('lib-content');
    const subtitleEl = document.getElementById('lib-subtitle');
    if (!contentEl) return;

    if (subtitleEl) {
      subtitleEl.textContent = state.books.length
        ? `${state.books.length} PDFs disponibles`
        : 'NCLEX PDF Collection';
    }

    if (state.isLoading) {
      contentEl.innerHTML = `
        <div class="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div class="relative w-16 h-16 mb-4">
            <div class="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p class="font-medium">Conectando con GitHub...</p>
          <p class="text-xs mt-2 opacity-75">Obteniendo lista de PDFs</p>
        </div>
      `;
      return;
    }

    if (state.error) {
      contentEl.innerHTML = `
        <div class="flex flex-col items-center justify-center h-64 text-center px-6">
          <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <i class="fa-solid fa-exclamation-triangle text-2xl text-red-600 dark:text-red-400"></i>
          </div>
          <h3 class="font-semibold text-gray-800 dark:text-white mb-1">Error de conexión</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${state.error}</p>
          <button onclick="window.library.refresh()" class="apple-button flex items-center gap-2">
            <i class="fa-solid fa-rotate"></i> Reintentar
          </button>
        </div>
      `;
      return;
    }

    if (state.books.length === 0) {
      contentEl.innerHTML = `
        <div class="flex flex-col items-center justify-center h-64">
          <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <i class="fa-solid fa-box-open text-2xl text-gray-500"></i>
          </div>
          <p class="text-gray-600 dark:text-gray-400">No se encontraron PDFs en el release BOOKS</p>
        </div>
      `;
      return;
    }

    let html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
    state.books.forEach(book => {
      const formattedSize = formatFileSize(book.size);
      const date = book.updatedAt.toLocaleDateString();

      html += `
        <div class="apple-glass rounded-xl p-4 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col group">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <i class="fa-solid fa-file-pdf text-xl"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1" title="${book.name}">
                ${book.name}
              </h3>
              <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span><i class="fa-regular fa-file mr-1"></i>PDF</span>
                <span>•</span>
                <span><i class="fa-regular fa-hard-drive mr-1"></i>${formattedSize}</span>
                <span>•</span>
                <span><i class="fa-regular fa-calendar mr-1"></i>${date}</span>
              </div>
              <a href="${book.downloadUrl}" target="_blank"
                class="inline-flex items-center justify-center w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-md hover:shadow-blue-500/30">
                <i class="fa-solid fa-cloud-arrow-down mr-2"></i>
                ${t('Descargar', 'Download')}
              </a>
            </div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    contentEl.innerHTML = html;
  }

  function createFloatingButton() {
    if (document.getElementById('library-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'library-btn';
    btn.onclick = () => window.library?.open();
    btn.className = 'fixed top-6 right-6 w-12 h-12 apple-glass bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 z-[9980] flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 active:scale-95 group border border-white/20';

    btn.innerHTML = `
      <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
      <i class="fa-solid fa-book-open text-xl relative group-hover:scale-110 transition-transform"></i>
      <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></div>
      <div class="absolute top-full right-0 mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
        <span class="lang-es">Biblioteca</span>
        <span class="lang-en hidden-lang">Library</span>
        <div class="absolute -top-1 right-6 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    `;

    document.body.appendChild(btn);
  }

  window.library = {
    async open() {
      createModal();
      const modal = document.getElementById('library-modal');
      if (!modal) return;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      if (state.books.length === 0 && !state.isLoading) {
        await fetchBooks();
      }
    },
    close() {
      const modal = document.getElementById('library-modal');
      if (modal) modal.classList.add('hidden');
    },
    async refresh() {
      await fetchBooks();
    }
  };

  function init() {
    createFloatingButton();
    createModal();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => fetchBooks());
    } else {
      fetchBooks();
    }
  }

  init();
})();
