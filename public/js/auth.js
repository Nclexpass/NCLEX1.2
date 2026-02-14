// js/auth.js — VERSIÓN ADMINISTRADOR con SHA-256 (v3.7 FIXED - Safe JSON Parse)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

(function() {
  'use strict';

  // ===== 1. CONEXIÓN A FIREBASE =====
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
      console.log("🔥 Sistema de Cuentas Activo");
  } catch (e) {
      console.error("Error Firebase:", e);
  }

  // ===== 2. SEGURIDAD CON SHA-256 =====
  const MASTER_HASH = "612245dc8a2beb47bfe2011da7402ecee514ec795d47a665fa61d43863280ce0";
  
  async function verifyMasterKey(inputKey) {
      const cleanInput = inputKey.trim();
      const msgBuffer = new TextEncoder().encode(cleanInput);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex === MASTER_HASH;
  }
  
  const STORAGE_KEY = 'nclex_user_session_v5';
  
  const KEYS_TO_SYNC = [
    'nclex_progress', 
    'nclex_quiz_history', 
    'nclex_time_spent', 
    'nclex_last_visit', 
    'sim_selected_cats',
    'nclex_streak',
    'nclex_theme',
    'nclex_lang'
  ];
  
  let autoSaveInterval = null;

  // ===== 3. SISTEMA DE DATOS (NUBE) =====
  
  // FIX: Safe JSON parse - handles both JSON strings and plain strings
  function safeJSONParse(value) {
      if (!value) return null;
      try {
          return JSON.parse(value);
      } catch {
          // If it's not valid JSON, return the raw value
          return value;
      }
  }
  
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
          if (item) { 
              // FIX: Use safe parser that handles both JSON and plain strings
              dataToSave[key] = safeJSONParse(item); 
              hasData = true; 
          }
      });

      if (hasData) {
          try {
              await setDoc(doc(db, "users", user.name), dataToSave, { merge: true });
          } catch (e) {
              console.error("Error syncing data:", e);
          }
      }
  }

  function startAutoSave() {
      if (autoSaveInterval) clearInterval(autoSaveInterval);
      autoSaveInterval = setInterval(syncUp, 60000);
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

    const viewLogin = document.getElementById('view-login');
    const viewRegister = document.getElementById('view-register');
    const msg = document.getElementById('auth-msg');

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

    async function performLogin() {
        const user = document.getElementById('login-user').value.trim();
        const pass = document.getElementById('login-pass').value.trim();
        
        if (!user || !pass) return showMsg("Faltan datos", "text-red-500");
        
        const btnLogin = document.getElementById('btn-login');
        btnLogin.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
        btnLogin.disabled = true;

        try {
            const docRef = doc(db, "users", user);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().password === pass) {
                await completeLogin(user);
            } else {
                showMsg("Usuario o contraseña incorrectos", "text-red-500");
                btnLogin.innerHTML = 'Entrar';
                btnLogin.disabled = false;
            }
        } catch (e) {
            console.error(e);
            showMsg("Error de conexión", "text-red-500");
            btnLogin.innerHTML = 'Entrar';
            btnLogin.disabled = false;
        }
    }

    document.getElementById('btn-login').onclick = performLogin;

    document.getElementById('login-user').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performLogin();
    });
    document.getElementById('login-pass').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performLogin();
    });

    async function performRegister() {
        const user = document.getElementById('reg-user').value.trim();
        const pass = document.getElementById('reg-pass').value.trim();
        const master = document.getElementById('reg-master').value.trim();

        if (!user || !pass) return showMsg("Faltan datos del estudiante", "text-red-500");
        
        const btnRegister = document.getElementById('btn-register');
        btnRegister.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
        btnRegister.disabled = true;
        
        const isValid = await verifyMasterKey(master);
        if (!isValid) {
            showMsg("⛔ Clave Maestra Incorrecta", "text-red-600");
            btnRegister.innerHTML = 'Crear Estudiante';
            btnRegister.disabled = false;
            return;
        }

        try {
            const docRef = doc(db, "users", user);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                showMsg("Este usuario ya existe", "text-orange-500");
                btnRegister.innerHTML = 'Crear Estudiante';
                btnRegister.disabled = false;
            } else {
                await setDoc(docRef, {
                    password: pass,
                    created: new Date().toISOString(),
                    role: 'student'
                });
                
                showMsg("✅ Estudiante creado con éxito", "text-green-600");
                setTimeout(() => {
                    viewRegister.classList.add('hidden');
                    viewLogin.classList.remove('hidden');
                    document.getElementById('login-user').value = user;
                    msg.innerText = "Ya puedes entrar con la cuenta nueva";
                    btnRegister.innerHTML = 'Crear Estudiante';
                    btnRegister.disabled = false;
                }, 1500);
            }
        } catch (e) {
            console.error(e);
            showMsg("Error al crear usuario", "text-red-500");
            btnRegister.innerHTML = 'Crear Estudiante';
            btnRegister.disabled = false;
        }
    }

    document.getElementById('btn-register').onclick = performRegister;

    document.getElementById('reg-user').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performRegister();
    });
    document.getElementById('reg-pass').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performRegister();
    });
    document.getElementById('reg-master').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performRegister();
    });

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

  function init() {
    const user = checkAuth();
    if (!user) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderAuthScreen);
      } else {
        renderAuthScreen();
      }
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
