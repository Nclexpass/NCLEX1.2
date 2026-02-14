// js/auth.js — VERSIÓN ADMINISTRADOR SEGURA (Firebase FIX 3.2)

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

(function() {
  'use strict';

  // ===============================
  // 1. CONFIGURACIÓN FIREBASE
  // ===============================

  const firebaseConfig = {
    apiKey: "AIzaSyC07GVdRw3IkVp230DTT1GyYS_gFFtPeHU",
    authDomain: "nclex-masterclass.firebaseapp.com",
    projectId: "nclex-masterclass",
    storageBucket: "nclex-masterclass.appspot.com", // ✅ CORREGIDO
    messagingSenderId: "235534790151",
    appId: "1:235534790151:web:7f52194c17f176654d44a2"
  };

  let app = null;
  let db = null;
  let isFirebaseReady = false;

  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    db = getFirestore(app);
    isFirebaseReady = true;

    console.log("🔥 Firebase inicializado correctamente");
  } catch (error) {
    console.error("❌ Error crítico inicializando Firebase:", error);
    isFirebaseReady = false;
  }

  // ===============================
  // 2. CONFIGURACIÓN LOCAL
  // ===============================

  const MASTER_KEY = "Guitarra89#";
  const STORAGE_KEY = 'nclex_user_session_v5';
  const KEYS_TO_SYNC = [
    'nclex_progress',
    'nclex_quiz_history',
    'nclex_time_spent',
    'nclex_last_visit',
    'sim_selected_cats'
  ];

  let autoSaveInterval = null;

  // ===============================
  // 3. SINCRONIZACIÓN
  // ===============================

  async function syncDown(userId) {
    if (!isFirebaseReady || !db || !userId) {
      console.warn("⚠ syncDown cancelado: Firebase no listo");
      return;
    }

    try {
      const docSnap = await getDoc(doc(db, "users", userId));

      if (docSnap.exists()) {
        const data = docSnap.data();

        KEYS_TO_SYNC.forEach(key => {
          if (data[key]) {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        });

        window.dispatchEvent(new Event('nclex:dataLoaded'));
        console.log("☁ Datos restaurados desde la nube");
      }
    } catch (error) {
      console.error("❌ Error en syncDown:", error);
    }
  }

  async function syncUp() {
    const user = checkAuth();

    if (!isFirebaseReady || !db || !user) {
      return;
    }

    try {
      const dataToSave = { lastSync: new Date().toISOString() };
      let hasData = false;

      KEYS_TO_SYNC.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          dataToSave[key] = JSON.parse(item);
          hasData = true;
        }
      });

      if (hasData) {
        await setDoc(doc(db, "users", user.name), dataToSave, { merge: true });
        console.log("☁ Datos sincronizados correctamente");
      }
    } catch (error) {
      console.error("❌ Error en syncUp:", error);
    }
  }

  function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(syncUp, 60000);
  }

  // ===============================
  // 4. AUTH LOCAL
  // ===============================

  function checkAuth() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  function completeLogin(username) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: username }));
    document.getElementById('auth-overlay')?.remove();
    syncDown(username);
    startAutoSave();
  }

  // ===============================
  // 5. UI LOGIN / REGISTER
  // ===============================

  function showMsg(message, className) {
    const msg = document.getElementById('auth-msg');
    if (!msg) return;
    msg.className = `text-center text-sm font-bold ${className}`;
    msg.innerText = message;
  }

  function renderAuthScreen() {
    if (!isFirebaseReady) {
      console.error("Firebase no disponible. No se puede mostrar login.");
      return;
    }

    if (document.getElementById('auth-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.className = 'fixed inset-0 z-[100] bg-[#F5F5F7] flex items-center justify-center p-4';

    overlay.innerHTML = `
      <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
        <h2 class="text-xl font-bold mb-4">Login NCLEX</h2>
        <input id="login-user" class="w-full border p-2 mb-3" placeholder="Usuario">
        <input id="login-pass" type="password" class="w-full border p-2 mb-3" placeholder="Contraseña">
        <button id="btn-login" class="w-full bg-blue-600 text-white py-2 rounded-lg">Entrar</button>
        <p id="auth-msg" class="mt-3 text-sm font-bold"></p>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('btn-login').onclick = async () => {
      const user = document.getElementById('login-user').value.trim();
      const pass = document.getElementById('login-pass').value.trim();

      if (!user || !pass) return showMsg("Faltan datos", "text-red-500");

      try {
        const docSnap = await getDoc(doc(db, "users", user));

        if (docSnap.exists() && docSnap.data().password === pass) {
          completeLogin(user);
        } else {
          showMsg("Usuario o contraseña incorrectos", "text-red-500");
        }
      } catch (error) {
        console.error(error);
        showMsg("Error de conexión con Firebase", "text-red-500");
      }
    };
  }

  // ===============================
  // 6. API GLOBAL SEGURA
  // ===============================

  window.NCLEX_AUTH = {
    isReady: () => isFirebaseReady,
    forceSave: () => syncUp(),
    logout: () => {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  };

  // ===============================
  // 7. INICIALIZACIÓN
  // ===============================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!checkAuth()) renderAuthScreen();
      else {
        startAutoSave();
        syncDown(checkAuth().name);
      }
    });
  } else {
    if (!checkAuth()) renderAuthScreen();
    else {
      startAutoSave();
      syncDown(checkAuth().name);
    }
  }

})();
