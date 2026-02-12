// auth.js — VERSIÓN CLOUD FINAL (Firebase Conectado & Bilingüe) - CORREGIDO v2
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

(function() {
  'use strict';

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
      console.log("🔥 Firebase conectado");
  } catch (e) {
      console.error("Error Firebase:", e);
  }

  const ADMIN_PASSWORD = "Guitarra89#"; 
  const SECRET_SALT = "NCLEX-MASTER-KEY-2026"; 
  const STORAGE_KEY = 'nclex_user_session_v2'; 

  const bilingual = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  function checkAuth() {
    const activeUser = localStorage.getItem(STORAGE_KEY);
    if (activeUser) {
      forceRemoveLoading();
      updateUserUI(activeUser);
      return true;
    }
    return false;
  }

  function forceRemoveLoading() {
    const loading = document.getElementById('loading');
    if (loading) { 
      loading.style.opacity = '0'; 
      setTimeout(() => {
        loading.classList.add('hidden');
        loading.style.display = 'none';
      }, 500); 
    }
  }

  function renderAuthScreen(mode) {
    // Forzar mostrar overlay sobre todo
    forceRemoveLoading();
    
    let overlay = document.getElementById('auth-overlay');
    if (overlay) overlay.remove();
    
    overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.className = 'fixed inset-0 z-[9999] bg-[#0f172a] flex items-center justify-center p-4';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:#0f172a;display:flex;align-items:center;justify-content:center;padding:16px;';
    document.body.appendChild(overlay);

    if (mode === 'admin') renderAdminPanel(overlay);
    else if (mode === 'register') renderRegisterPanel(overlay);
    else renderLoginPanel(overlay);
    
    // Sincronizar idioma
    const lang = localStorage.getItem('nclex_lang') || 'es';
    const isEs = lang === 'es';
    overlay.querySelectorAll('.lang-es').forEach(el => el.classList.toggle('hidden-lang', !isEs));
    overlay.querySelectorAll('.lang-en').forEach(el => el.classList.toggle('hidden-lang', isEs));
  }

  function renderLoginPanel(overlay) {
    overlay.innerHTML = `
      <div class="w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-2xl p-6 border border-gray-200 dark:border-white/10 animate-fade-in">
        <div class="text-center mb-6">
            <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-1">${bilingual("Iniciar Sesión", "Login")}</h2>
            <p class="text-green-500 text-xs font-bold uppercase flex items-center justify-center gap-2">
                <i class="fa-solid fa-cloud"></i> ${bilingual("Sistema Cloud Activo", "Cloud System Active")}
            </p>
        </div>
        <form id="login-form" class="space-y-4">
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase ml-1">${bilingual("Usuario", "Username")}</label>
            <input type="text" id="login-name" class="w-full bg-gray-100 dark:bg-black/30 text-gray-900 dark:text-white rounded-xl py-3 px-4 border-transparent focus:border-brand-blue outline-none font-bold placeholder-gray-400" placeholder="Ej: Maria" required autocomplete="username">
          </div>
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase ml-1">${bilingual("Contraseña", "Password")}</label>
            <input type="password" id="login-pass" class="w-full bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-700 focus:border-brand-blue rounded-xl py-3 px-4 outline-none dark:text-white placeholder-gray-400" placeholder="••••••••" required autocomplete="current-password">
          </div>
          <button type="submit" id="btn-login" class="w-full bg-brand-blue text-white font-bold py-4 rounded-xl hover:bg-blue-600 shadow-lg active:scale-[0.98] mt-2 transition-all">
            ${bilingual("ENTRAR", "ENTER")}
          </button>
        </form>
        <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
            <button onclick="window.nclexAuth.switchView('register')" class="text-brand-blue font-bold hover:underline text-sm uppercase tracking-wide">${bilingual("¿No tienes cuenta? Regístrate", "No account? Register")}</button>
        </div>
      </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('login-name').value;
      const pass = document.getElementById('login-pass').value.trim();
      const btn = document.getElementById('btn-login');
      
      btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> ${bilingual("Verificando...", "Verifying...")}`;
      btn.disabled = true;

      await loginUserFromCloud(name, pass, overlay);
      
      if (document.body.contains(btn)) {
          btn.innerHTML = bilingual("ENTRAR", "ENTER");
          btn.disabled = false;
      }
    });
  }

  function renderRegisterPanel(overlay) {
    overlay.innerHTML = `
      <div class="w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-2xl p-6 border border-gray-200 dark:border-white/10 animate-fade-in">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">${bilingual("Crear Cuenta", "Create Account")}</h2>
            <button onclick="window.nclexAuth.showAdminLogin()" class="text-xs bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full text-gray-500 hover:text-brand-blue font-bold transition-colors">⚙ Admin</button>
        </div>
        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl mb-4 border border-blue-100 dark:border-blue-800 flex items-start gap-3">
             <i class="fa-solid fa-lock text-blue-500 mt-1"></i>
             <p class="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">${bilingual("Necesitas un <strong>Código de Acceso</strong> proporcionado por el instructor.", "You need an <strong>Access Code</strong> provided by the instructor.")}</p>
        </div>
        <form id="register-form" class="space-y-3">
          <div><label class="text-[10px] font-bold text-gray-500 uppercase ml-1">${bilingual("Nombre (Usuario)", "Name (Username)")}</label><input type="text" id="reg-name" required class="w-full bg-gray-100 dark:bg-black/30 rounded-xl py-3 px-4 outline-none dark:text-white font-bold" placeholder="Ej: Maria"></div>
          <div><label class="text-[10px] font-bold text-gray-500 uppercase ml-1">${bilingual("Código de Acceso", "Access Code")}</label><input type="text" id="reg-token" required class="w-full bg-gray-100 dark:bg-black/30 rounded-xl py-3 px-4 outline-none font-mono text-center tracking-widest uppercase dark:text-white" placeholder="XXXXXX"></div>
          <div><label class="text-[10px] font-bold text-gray-500 uppercase ml-1">${bilingual("Contraseña", "Password")}</label><input type="password" id="reg-pass" required class="w-full bg-gray-100 dark:bg-black/30 rounded-xl py-3 px-4 outline-none dark:text-white" placeholder="••••••••"></div>
          <button type="submit" id="btn-reg" class="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl shadow-lg mt-2 active:scale-[0.98] hover:shadow-xl transition-all">${bilingual("REGISTRARME", "REGISTER")}</button>
        </form>
        <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
            <button onclick="window.nclexAuth.switchView('login')" class="text-brand-blue font-bold hover:underline text-sm uppercase tracking-wide">${bilingual("¿Ya tienes cuenta? Entrar", "Have account? Login")}</button>
        </div>
      </div>
    `;

    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const token = document.getElementById('reg-token').value.trim().toUpperCase();
      const pass = document.getElementById('reg-pass').value.trim();
      const btn = document.getElementById('btn-reg');

      if (token === generateHash(name)) {
        btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> ${bilingual("Creando...", "Creating...")}`;
        btn.disabled = true;
        
        await registerUserInCloud(name, pass, overlay);
        
        if (document.body.contains(btn)) {
            btn.innerHTML = bilingual("REGISTRARME", "REGISTER");
            btn.disabled = false;
        }
      } else {
        alert(`⛔ CÓDIGO INVÁLIDO / INVALID CODE`);
      }
    });
  }

  function renderAdminPanel(overlay) {
    overlay.innerHTML = `
      <div class="w-full max-w-md bg-slate-900 text-white rounded-3xl shadow-2xl p-8 border border-slate-700 animate-fade-in relative">
        <button onclick="window.nclexAuth.switchView('login')" class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><i class="fa-solid fa-xmark fa-lg"></i></button>
        <h2 class="text-xl font-bold mb-1 text-yellow-500"><i class="fa-solid fa-user-shield mr-2"></i>Instructor Panel</h2>
        <div class="space-y-4 mt-6">
            <div>
                <label class="text-[10px] uppercase font-bold text-gray-400">${bilingual("Generar Acceso para:", "Generate Access for:")}</label>
                <input type="text" id="admin-student-name" class="w-full bg-black/50 border border-gray-700 rounded-xl py-3 px-4 text-white outline-none focus:border-yellow-500 transition-colors" placeholder="Student Name...">
            </div>
            <button onclick="window.nclexAuth.generateForStudent()" class="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95 transition-all">${bilingual("Generar Código", "Generate Code")}</button>
            
            <div id="result-area" class="hidden mt-4 bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p class="text-xs text-gray-400 mb-2">${bilingual("Código generado:", "Generated Code:")}</p>
                <div class="text-3xl font-mono font-black text-yellow-400 tracking-widest mb-3 select-all cursor-pointer" id="generated-code" onclick="window.nclexAuth.copyInvitation()">------</div>
                <button onclick="window.nclexAuth.copyInvitation()" class="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"><i class="fa-brands fa-whatsapp"></i> ${bilingual("Copiar Invitación", "Copy Invite")}</button>
            </div>
        </div>
      </div>
    `;
  }

  async function registerUserInCloud(name, pass, overlay) {
    if (!db) { alert("Error: No hay conexión."); return false; }
    const userId = name.trim().toLowerCase(); 
    const userRef = doc(db, "students", userId);
    
    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            alert("⚠️ USUARIO YA EXISTE / USER ALREADY EXISTS");
            return false;
        }
        await setDoc(userRef, {
            name: name.trim(), 
            pass: pass, 
            createdAt: new Date().toISOString(),
            role: 'student',
            lastLogin: new Date().toISOString(),
            platform: 'web_v5'
        });
        loginSuccess(overlay, name.trim());
        return true;
    } catch (error) {
        alert("Error de conexión / Connection error.");
        return false;
    }
  }

  async function loginUserFromCloud(name, pass, overlay) {
    if (!db) { alert("Error: No hay conexión."); return false; }
    const userId = name.trim().toLowerCase();
    const userRef = doc(db, "students", userId);

    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.pass === pass) {
          await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
          loginSuccess(overlay, userData.name);
          return true;
        } else {
          alert("❌ CONTRASEÑA INCORRECTA / WRONG PASSWORD");
          return false;
        }
      } else {
        alert("❌ USUARIO NO ENCONTRADO / USER NOT FOUND");
        return false;
      }
    } catch (error) {
      alert("Error de conexión / Connection error.");
      return false;
    }
  }

  function generateHash(name) {
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '');
    const stringToHash = cleanName + SECRET_SALT;
    let hash = 0;
    for (let i = 0; i < stringToHash.length; i++) {
      hash = ((hash << 5) - hash) + stringToHash.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase().slice(0, 6).padStart(6, 'X');
  }

  function loginSuccess(overlay, userName) {
    localStorage.setItem(STORAGE_KEY, userName); 
    overlay.remove();
    updateUserUI(userName);
  }

  function updateUserUI(userName) {
    const sidebarHeader = document.querySelector('aside .leading-tight');
    if (sidebarHeader) {
        let userSub = sidebarHeader.querySelector('.user-status-display');
        if (!userSub) {
            userSub = document.createElement('div');
            userSub.className = 'user-status-display text-[10px] text-gray-500 font-medium mt-1';
            sidebarHeader.appendChild(userSub);
        }
        userSub.innerHTML = `${bilingual("Estudiante:", "Student:")} <span class="text-brand-blue font-bold">${userName}</span>`;
    }
    
    const nav = document.getElementById('sidebar-nav');
    if (nav && !document.getElementById('logout-btn')) {
        const btn = document.createElement('button');
        btn.id = 'logout-btn';
        btn.className = "auth-action-btn w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 mt-4 border border-transparent hover:border-red-200 transition-all group";
        btn.innerHTML = `
            <div class="w-6 flex justify-center"><i class="fa-solid fa-power-off group-hover:scale-110 transition-transform"></i></div>
            <span class="hidden lg:block text-sm font-bold">${bilingual("Cerrar Sesión", "Log Out")}</span>`;
        btn.onclick = () => window.nclexAuth.resetAuth();
        nav.appendChild(btn);
    }
  }

  window.nclexAuth = {
      switchView: (viewName) => renderAuthScreen(viewName),
      showAdminLogin: () => { 
          const attempt = prompt("Contraseña de Instructor:");
          if (attempt === ADMIN_PASSWORD) renderAuthScreen('admin'); 
          else if (attempt !== null) alert("Acceso Denegado");
      },
      generateForStudent: () => {
        const name = document.getElementById('admin-student-name').value;
        if (!name) return alert("Escribe un nombre");
        document.getElementById('result-area').classList.remove('hidden');
        document.getElementById('generated-code').innerText = generateHash(name);
      },
      copyInvitation: () => {
        const name = document.getElementById('admin-student-name').value;
        const code = document.getElementById('generated-code').innerText;
        const text = `🎓 NCLEX MASTERCLASS\n\nUser: ${name}\nCode: ${code}\nLink: ${window.location.href.split('#')[0]}`;
        navigator.clipboard.writeText(text).then(() => alert("Copiado!")).catch(() => prompt("Copia manual:", text));
      },
      resetAuth: () => {
        if(confirm("¿Cerrar sesión?")) {
          localStorage.removeItem(STORAGE_KEY);
          location.reload();
        }
      }
  };

  // ===== INICIALIZACIÓN INMEDIATA =====
  function init() {
    // Si no hay usuario logueado, mostrar auth inmediatamente
    if (!checkAuth()) {
      // Esperar un momento por si el loader está visible
      setTimeout(() => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          renderAuthScreen('login');
        }
      }, 100);
    }
  }

  // Ejecutar inmediatamente o cuando DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Backup: si algo falla, forzar auth en 2 segundos
  setTimeout(() => {
    if (!localStorage.getItem(STORAGE_KEY) && !document.getElementById('auth-overlay')) {
      renderAuthScreen('login');
    }
  }, 2000);

})();