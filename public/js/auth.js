// js/auth.js — VERSIÓN ADMINISTRADOR (Tu control total)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

(function() {
  'use strict';

  // ===== 1. CONEXIÓN A FIREBASE =====
  const firebaseConfig = {
    apiKey: "AIzaSyDIkDN9hipuPsB-iYNig0M496mZD8lAX08",
    authDomain: "nclex-masterclass-b009c.firebaseapp.com",
    projectId: "nclex-masterclass-b009c",
    storageBucket: "nclex-masterclass-b009c.firebasestorage.app",
    messagingSenderId: "500261470699",
    appId: "1:500261470699:web:d18551e1cbed41a81699ae"
  };

  let app, db;
  try {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      console.log("🔥 Sistema de Cuentas Activo");
  } catch (e) {
      console.error("Error Firebase:", e);
  }

  // ===== 2. TU LLAVE MAESTRA (¡CÁMBIALA AQUÍ!) =====
  const MASTER_KEY = "Guitarra89#"; // <--- Esta es la contraseña que solo TÚ debes saber
  
  const STORAGE_KEY = 'nclex_user_session_v5';
  const KEYS_TO_SYNC = ['nclex_progress', 'nclex_quiz_history', 'nclex_time_spent', 'nclex_last_visit', 'sim_selected_cats'];
  let autoSaveInterval = null;

  // ===== 3. SISTEMA DE DATOS (NUBE) =====
  
  async function syncDown(userId) {
      if (!db || !userId) return;
      try {
          const docSnap = await getDoc(doc(db, "users", userId));
          if (docSnap.exists()) {
              const data = docSnap.data();
              KEYS_TO_SYNC.forEach(key => {
                  if (data[key]) localStorage.setItem(key, JSON.stringify(data[key]));
              });
              window.dispatchEvent(new Event('nclex:dataLoaded'));
          }
      } catch (e) { console.error(e); }
  }

  async function syncUp() {
      const user = checkAuth();
      if (!db || !user) return;
      
      const dataToSave = { lastSync: new Date().toISOString() };
      let hasData = false;
      
      KEYS_TO_SYNC.forEach(key => {
          const item = localStorage.getItem(key);
          if (item) { dataToSave[key] = JSON.parse(item); hasData = true; }
      });

      if (hasData) await setDoc(doc(db, "users", user.name), dataToSave, { merge: true });
  }

  function startAutoSave() {
      if (autoSaveInterval) clearInterval(autoSaveInterval);
      autoSaveInterval = setInterval(syncUp, 60000); // Guardar cada minuto
  }

  // ===== 4. PANTALLA DE LOGIN / REGISTRO =====

  function checkAuth() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
  }

  function renderAuthScreen() {
    if (document.getElementById('auth-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.className = 'fixed inset-0 z-[100] bg-[#F5F5F7] flex items-center justify-center p-4';
    
    overlay.innerHTML = `
      <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 animate-fade-in">
        <div class="p-8 pb-4 text-center">
          <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <i class="fa-solid fa-user-nurse text-3xl text-white"></i>
          </div>
          <h1 class="text-2xl font-black text-gray-900">NCLEX ESSENTIALS</h1>
          <p class="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">Concise Study Suite</p>
        </div>

        <div class="px-8 pb-8 space-y-4">
            
            <div id="view-login" class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-gray-400 uppercase ml-1">Usuario</label>
                    <input type="text" id="login-user" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 font-bold outline-none focus:border-blue-500 transition-colors">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-400 uppercase ml-1">Contraseña</label>
                    <input type="password" id="login-pass" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 font-bold outline-none focus:border-blue-500 transition-colors">
                </div>
                <button id="btn-login" class="w-full bg-blue-600 text-white font-bold rounded-xl py-3 shadow-lg hover:bg-blue-700 transition-transform active:scale-95">
                    Entrar
                </button>
                
                <div class="pt-4 border-t border-gray-100 text-center">
                    <button id="toggle-register" class="text-xs text-blue-500 font-bold hover:underline">
                        ¿Eres Administrador? Crear cuenta nueva
                    </button>
                </div>
            </div>

            <div id="view-register" class="space-y-4 hidden">
                <div class="p-3 bg-yellow-50 border border-yellow-100 rounded-xl flex items-center gap-3">
                    <i class="fa-solid fa-lock text-yellow-600"></i>
                    <p class="text-xs font-bold text-yellow-800">Modo Administrador</p>
                </div>

                <div>
                    <input type="text" id="reg-user" placeholder="Nuevo Usuario" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-bold outline-none">
                </div>
                <div>
                    <input type="text" id="reg-pass" placeholder="Contraseña para el estudiante" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-bold outline-none">
                </div>
                <div>
                    <label class="text-xs font-bold text-red-400 uppercase ml-1">Clave Maestra</label>
                    <input type="password" id="reg-master" placeholder="Tu código secreto" class="w-full bg-red-50 border border-red-100 text-red-900 rounded-xl p-3 font-bold outline-none focus:border-red-500">
                </div>
                
                <button id="btn-register" class="w-full bg-gray-900 text-white font-bold rounded-xl py-3 shadow-lg hover:bg-gray-800 transition-transform active:scale-95">
                    Crear Estudiante
                </button>
                
                <div class="text-center pt-2">
                    <button id="toggle-login" class="text-xs text-gray-400 font-bold hover:text-gray-600">
                        Cancelar / Volver al Login
                    </button>
                </div>
            </div>

            <p id="auth-msg" class="text-center text-sm font-bold min-h-[20px]"></p>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // LÓGICA DE INTERFAZ
    const viewLogin = document.getElementById('view-login');
    const viewRegister = document.getElementById('view-register');
    const msg = document.getElementById('auth-msg');

    // Cambiar entre pantallas
    document.getElementById('toggle-register').onclick = () => {
        viewLogin.classList.add('hidden');
        viewRegister.classList.remove('hidden');
        msg.innerText = "";
    };
    document.getElementById('toggle-login').onclick = () => {
        viewRegister.classList.add('hidden');
        viewLogin.classList.remove('hidden');
        msg.innerText = "";
    };

    // --- ACCIÓN: LOGIN ---
    document.getElementById('btn-login').onclick = async () => {
        const user = document.getElementById('login-user').value.trim();
        const pass = document.getElementById('login-pass').value.trim();
        
        if (!user || !pass) return showMsg("Faltan datos", "text-red-500");
        
        document.getElementById('btn-login').innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

        try {
            const docRef = doc(db, "users", user);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().password === pass) {
                completeLogin(user);
            } else {
                showMsg("Usuario o contraseña incorrectos", "text-red-500");
                document.getElementById('btn-login').innerHTML = 'Entrar';
            }
        } catch (e) {
            console.error(e);
            showMsg("Error de conexión", "text-red-500");
            document.getElementById('btn-login').innerHTML = 'Entrar';
        }
    };

    // --- ACCIÓN: CREAR ESTUDIANTE (ADMIN) ---
    document.getElementById('btn-register').onclick = async () => {
        const user = document.getElementById('reg-user').value.trim();
        const pass = document.getElementById('reg-pass').value.trim();
        const master = document.getElementById('reg-master').value.trim();

        if (!user || !pass) return showMsg("Faltan datos del estudiante", "text-red-500");
        
        // AQUÍ SE COMPRUEBA TU CLAVE MAESTRA
        if (master !== MASTER_KEY) {
            return showMsg("⛔ Clave Maestra Incorrecta", "text-red-600");
        }

        try {
            const docRef = doc(db, "users", user);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                showMsg("Este usuario ya existe", "text-orange-500");
            } else {
                // Crear el usuario en la base de datos
                await setDoc(docRef, {
                    password: pass,
                    created: new Date().toISOString(),
                    role: 'student'
                });
                
                showMsg("✅ Estudiante creado con éxito", "text-green-600");
                setTimeout(() => {
                    // Volver al login automáticamente
                    viewRegister.classList.add('hidden');
                    viewLogin.classList.remove('hidden');
                    document.getElementById('login-user').value = user;
                    msg.innerText = "Ya puedes entrar con la cuenta nueva";
                }, 1500);
            }
        } catch (e) {
            console.error(e);
            showMsg("Error al crear usuario", "text-red-500");
        }
    };

    function showMsg(text, color) {
        msg.className = `text-center text-sm font-bold min-h-[20px] ${color}`;
        msg.innerText = text;
    }

    async function completeLogin(username) {
        const session = { name: username, loginTime: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        await syncDown(username);
        startAutoSave();
        document.getElementById('auth-overlay').remove();
        if(window.nclexApp && window.nclexApp.refreshUI) window.nclexApp.refreshUI();
    }
  }

  // ===== INICIALIZACIÓN =====
  function init() {
    const user = checkAuth();
    if (!user) {
      setTimeout(renderAuthScreen, 1500);
    } else {
      console.log("👤 Sesión activa:", user.name);
      syncDown(user.name); 
      startAutoSave();
    }
  }

  window.NCLEX_AUTH = {
      logout: () => {
          if(confirm("¿Cerrar sesión?")) {
              syncUp().then(() => {
                  localStorage.removeItem(STORAGE_KEY);
                  location.reload();
              });
          }
      },
      forceSave: syncUp
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
