// js/auth.js — VERSIÓN CLOUD SYNC (Sincronización de Progreso)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

(function() {
  'use strict';

  // ===== 1. CONFIGURACIÓN FIREBASE =====
  const firebaseConfig = {
    apiKey: "AIzaSyC07GVdRw3IkVp230DTT1GyYS_gFFtPeHU",
    authDomain: "nclex-masterclass.firebaseapp.com",
    projectId: "nclex-masterclass",
    storageBucket: "nclex-masterclass.firebasestorage.app",
    messagingSenderId: "235534790151",
    appId: "1:235534790151:web:7f52194c17f176654d44a2"
  };

  let app, db;
  try {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      console.log("🔥 Firebase Cloud Sync activo");
  } catch (e) {
      console.error("Error conectando a Firebase:", e);
  }

  // ===== 2. VARIABLES DE ESTADO =====
  const STORAGE_KEY = 'nclex_user_session_v2';
  const KEYS_TO_SYNC = [
      'nclex_progress',      // Tu progreso general
      'nclex_quiz_history',  // Historial de exámenes
      'nclex_time_spent',    // Tiempo de estudio
      'nclex_last_visit',    // Última visita
      'sim_selected_cats',   // Preferencias del simulador
      'books_cache'          // Caché de libros (opcional)
  ];
  let autoSaveInterval = null;

  // ===== 3. SISTEMA DE SINCRONIZACIÓN (EL MOTOR NUEVO) =====
  
  // BAJAR DATOS (Cloud -> Local)
  async function syncDown(userId) {
      if (!db || !userId) return;
      console.log('☁️ Descargando progreso de la nube...');
      
      try {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
              const data = docSnap.data();
              
              // Restaurar cada clave en localStorage
              KEYS_TO_SYNC.forEach(key => {
                  if (data[key]) {
                      localStorage.setItem(key, JSON.stringify(data[key]));
                  }
              });
              
              console.log('✅ Progreso restaurado exitosamente');
              // Avisar al Dashboard que los datos han cambiado
              window.dispatchEvent(new Event('nclex:dataLoaded'));
          } else {
              console.log('✨ Usuario nuevo o sin datos previos');
          }
      } catch (error) {
          console.error("Error descargando datos:", error);
      }
  }

  // SUBIR DATOS (Local -> Cloud)
  async function syncUp() {
      const user = checkAuth();
      if (!db || !user) return;

      const dataToSave = {};
      let hasData = false;

      // Recolectar datos del localStorage
      KEYS_TO_SYNC.forEach(key => {
          const item = localStorage.getItem(key);
          if (item) {
              try {
                  dataToSave[key] = JSON.parse(item);
                  hasData = true;
              } catch (e) {}
          }
      });
      
      // Agregar timestamp
      dataToSave.lastSync = new Date().toISOString();

      if (hasData) {
          try {
              await setDoc(doc(db, "users", user.name), dataToSave, { merge: true });
              console.log('☁️ Progreso guardado en la nube');
          } catch (error) {
              console.error("Error subiendo datos:", error);
          }
      }
  }

  // Iniciar Autoguardado
  function startAutoSave() {
      if (autoSaveInterval) clearInterval(autoSaveInterval);
      // Guardar cada 60 segundos
      autoSaveInterval = setInterval(syncUp, 60000);
  }

  // ===== 4. LÓGICA DE AUTENTICACIÓN =====

  function checkAuth() {
    try {
      const session = localStorage.getItem(STORAGE_KEY);
      return session ? JSON.parse(session) : null;
    } catch { return null; }
  }

  function renderAuthScreen() {
    // Si ya existe el overlay, no duplicar
    if (document.getElementById('auth-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.className = 'fixed inset-0 z-[100] bg-[#F5F5F7] flex items-center justify-center p-4';
    overlay.innerHTML = `
      <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-gray-200">
        <div class="p-8 text-center">
          <div class="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <i class="fa-solid fa-user-nurse text-4xl text-white"></i>
          </div>
          <h1 class="text-2xl font-black text-gray-900 mb-2">NCLEX MASTERCLASS</h1>
          <p class="text-gray-500 mb-8 font-medium">Inicia sesión para guardar tu progreso</p>
          
          <div class="space-y-4">
            <div>
              <label class="block text-left text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Usuario / ID</label>
              <input type="text" id="auth-username" 
                class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-lg rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4 font-bold outline-none transition-all" 
                placeholder="Ej. Estudiante2026">
            </div>
            
            <button id="auth-login-btn" class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-bold rounded-xl text-lg px-5 py-4 transition-all transform active:scale-95 shadow-lg shadow-blue-500/20">
              Entrar y Sincronizar
            </button>
          </div>
          
          <p id="auth-error" class="mt-4 text-red-500 text-sm font-bold hidden"></p>
        </div>
        <div class="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p class="text-xs text-gray-400 font-medium">System v3.0 • Secure Cloud Sync</p>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Event Listeners
    const btn = document.getElementById('auth-login-btn');
    const input = document.getElementById('auth-username');
    
    const handleLogin = async () => {
        const username = input.value.trim();
        if (username.length < 3) {
            document.getElementById('auth-error').innerText = "Nombre muy corto";
            document.getElementById('auth-error').classList.remove('hidden');
            return;
        }

        // Animación de carga
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Conectando...';
        btn.disabled = true;

        // 1. Guardar sesión local
        const session = { name: username, loginTime: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

        // 2. DESCARGAR PROGRESO DE LA NUBE
        await syncDown(username);

        // 3. Cerrar overlay e iniciar app
        startAutoSave();
        overlay.remove();
        
        // Forzar actualización de UI
        if(window.nclexApp && window.nclexApp.refreshUI) window.nclexApp.refreshUI();
    };

    btn.onclick = handleLogin;
    input.onkeypress = (e) => { if(e.key === 'Enter') handleLogin() };
  }

  // ===== 5. INICIALIZACIÓN =====
  function init() {
    const user = checkAuth();
    if (!user) {
      // Esperar a que el loader principal desaparezca para no superponerse
      setTimeout(() => renderAuthScreen(), 1500);
    } else {
      console.log("👤 Usuario detectado:", user.name);
      // Si ya está logueado, sincronizar (bajar cambios recientes) y activar autoguardado
      syncDown(user.name); 
      startAutoSave();
    }
  }

  // Exponer función de logout globalmente
  window.NCLEX_AUTH = {
      logout: () => {
          if(confirm("¿Cerrar sesión? Tu progreso local se mantendrá pero no se sincronizará.")) {
              // Forzar una última subida antes de salir
              syncUp().then(() => {
                  localStorage.removeItem(STORAGE_KEY);
                  location.reload();
              });
          }
      },
      forceSave: syncUp // Para llamar manualmente si se desea
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();