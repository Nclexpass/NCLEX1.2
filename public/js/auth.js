// js/auth.js — VERSIÓN 3.5.1 (Corrección de Visibilidad y Espacios)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
      console.log("🔥 Sistema NCLEX v3.5.1 Activo");
  } catch (e) { console.error("Error Firebase:", e); }

  // ===== 2. SEGURIDAD (HASHING) =====
  // Tu clave actual es: Budaplatoazul#
  const MASTER_HASH = "94089730fcb0896e9af9ef7eb2827f792c5983e5b84e45bba21abf2b3d209faf";
  
  async function verifyMasterKey(inputKey) {
      // .trim() elimina espacios invisibles que causan errores
      const cleanInput = inputKey.trim(); 
      const msgBuffer = new TextEncoder().encode(cleanInput);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex === MASTER_HASH;
  }
  
  const STORAGE_KEY = 'nclex_user_session_v351';
  const KEYS_TO_SYNC = ['nclex_progress', 'nclex_quiz_history', 'nclex_time_spent', 'nclex_last_visit', 'sim_selected_cats', 'nclex_streak'];
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
      autoSaveInterval = setInterval(syncUp, 60000);
  }

  function checkAuth() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
  }

  // ===== 4. PANTALLA DE LOGIN / REGISTRO =====

  function renderAuthScreen() {
    if (document.getElementById('auth-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.className = 'fixed inset-0 z-[100] bg-slate-900/90 flex items-center justify-center p-4 backdrop-blur-sm';
    
    // NOTA: He forzado text-slate-900 en los inputs para que se vea negro al escribir
    overlay.innerHTML = `
      <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 animate-fade-in font-sans">
        <div class="p-8 pb-4 text-center">
          <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <i class="fa-solid fa-user-nurse text-3xl text-white"></i>
          </div>
          <h1 class="text-2xl font-black text-slate-900">NCLEX ESSENTIALS</h1>
          <p class="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">BY REYNIER DIAZ v3.5.1</p>
        </div>

        <div class="px-8 pb-8 space-y-4">
            
            <div id="view-login" class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-slate-400 uppercase ml-1">Usuario</label>
                    <input type="text" id="login-user" style="color: #0f172a !important;" class="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl p-3 font-bold outline-none focus:border-blue-500 transition-colors">
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-400 uppercase ml-1">Contraseña</label>
                    <input type="password" id="login-pass" style="color: #0f172a !important;" class="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl p-3 font-bold outline-none focus:border-blue-500 transition-colors">
                </div>
                <button id="btn-login" class="w-full bg-blue-600 text-white font-bold rounded-xl py-4 shadow-lg hover:bg-blue-700 transition-transform active:scale-95">
                    Entrar al Sistema
                </button>
                
                <div class="pt-4 border-t border-slate-100 text-center">
                    <button id="toggle-register" class="text-xs text-blue-500 font-bold hover:underline italic">
                        ¿Eres Administrador? Crear cuenta de estudiante
                    </button>
                </div>
            </div>

            <div id="view-register" class="space-y-4 hidden">
                <div class="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                    <i class="fa-solid fa-shield-halved text-blue-600"></i>
                    <p class="text-xs font-bold text-blue-800 uppercase">Panel de Control Maestro</p>
                </div>

                <div>
                    <input type="text" id="reg-user" placeholder="Nombre del Estudiante" style="color: #0f172a !important;" class="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl p-3 font-bold outline-none">
                </div>
                <div>
                    <input type="text" id="reg-pass" placeholder="Asignar Contraseña" style="color: #0f172a !important;" class="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl p-3 font-bold outline-none">
                </div>
                <div class="bg-slate-900 p-4 rounded-2xl border-2 border-blue-500/30 shadow-inner">
                    <label class="text-[10px] font-black text-blue-400 uppercase block mb-2 tracking-widest text-center">Tu Clave Maestra de Administrador</label>
                    <input type="password" id="reg-master" placeholder="••••••••" style="color: #60a5fa !important;" class="w-full bg-transparent border-none text-center text-blue-400 font-black text-xl outline-none placeholder:text-slate-700">
                </div>
                
                <button id="btn-register" class="w-full bg-slate-900 text-white font-bold rounded-xl py-4 shadow-lg hover:bg-slate-800 transition-transform active:scale-95 border border-slate-700">
                    Registrar Nuevo Estudiante
                </button>
                
                <div class="text-center pt-2">
                    <button id="toggle-login" class="text-xs text-slate-400 font-bold hover:text-slate-600 underline">
                        Volver al inicio de sesión
                    </button>
                </div>
            </div>

            <p id="auth-msg" class="text-center text-[11px] font-black uppercase min-h-[20px] tracking-tight"></p>
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

    document.getElementById('btn-login').onclick = async () => {
        const user = document.getElementById('login-user').value.trim();
        const pass = document.getElementById('login-pass').value.trim();
        if (!user || !pass) return showMsg("⚠️ FALTAN DATOS", "text-amber-500");
        document.getElementById('btn-login').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        try {
            const docSnap = await getDoc(doc(db, "users", user));
            if (docSnap.exists() && docSnap.data().password === pass) {
                completeLogin(user);
            } else {
                showMsg("❌ USUARIO O CLAVE INCORRECTA", "text-red-500");
                document.getElementById('btn-login').innerHTML = 'Entrar al Sistema';
            }
        } catch (e) {
            showMsg("📡 ERROR DE CONEXIÓN", "text-red-500");
            document.getElementById('btn-login').innerHTML = 'Entrar al Sistema';
        }
    };

    document.getElementById('btn-register').onclick = async () => {
        const user = document.getElementById('reg-user').value.trim();
        const pass = document.getElementById('reg-pass').value.trim();
        const masterInput = document.getElementById('reg-master').value;

        if (!user || !pass) return showMsg("⚠️ RELLENA LOS DATOS", "text-amber-500");
        
        const isValid = await verifyMasterKey(masterInput);
        if (!isValid) return showMsg("⛔ CLAVE MAESTRA INCORRECTA", "text-red-600");

        try {
            const docRef = doc(db, "users", user);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                showMsg("👥 EL USUARIO YA EXISTE", "text-orange-500");
            } else {
                await setDoc(docRef, { password: pass, role: 'student', created: new Date().toISOString() });
                showMsg("✅ ESTUDIANTE CREADO", "text-green-600");
                setTimeout(() => {
                    viewRegister.classList.add('hidden');
                    viewLogin.classList.remove('hidden');
                    document.getElementById('login-user').value = user;
                    msg.innerText = "ACCESO LISTO PARA " + user.toUpperCase();
                }, 2000);
            }
        } catch (e) { showMsg("❌ ERROR AL CREAR", "text-red-500"); }
    };

    function showMsg(text, color) {
        msg.className = `text-center text-[11px] font-black uppercase min-h-[20px] tracking-tight ${color}`;
        msg.innerText = text;
    }

    async function completeLogin(username) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: username, time: Date.now() }));
        await syncDown(username);
        startAutoSave();
        document.getElementById('auth-overlay').remove();
    }
  }

  function init() {
    const user = checkAuth();
    if (!user) { setTimeout(renderAuthScreen, 1000); } 
    else { syncDown(user.name); startAutoSave(); }
  }

  window.NCLEX_AUTH = {
      logout: () => { 
        if(confirm("¿Cerrar sesión?")) { 
            localStorage.removeItem(STORAGE_KEY); 
            location.reload(); 
        } 
      }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();