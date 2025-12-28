// ================= Firebase Imports =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// ================= Firebase Config =================
const firebaseConfig = {
    apiKey: "AIzaSyAd8C9-0_Zw93XUn-9RokqRFI880L09qRI",
    authDomain: "davenci-conseils-pro.firebaseapp.com",
    projectId: "davenci-conseils-pro",
    storageBucket: "davenci-conseils-pro.firebasestorage.app",
    messagingSenderId: "518911977926",
    appId: "1:518911977926:web:3d65a902f910b5fa86aac7",
    measurementId: "G-G8PNJ0B66Q"
  };
// ================= Init =================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔐 هذا السطر يحل 80% من مشكلتك
await setPersistence(auth, browserLocalPersistence);

console.log("Firebase initialized");


// ===================================================
// ================= REGISTER =========================
// ===================================================
const registerForm = document.getElementById("registerForm");
const regMsg = document.getElementById("regMsg");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const tiktokInput = document.getElementById("tiktokUsername");
    const tiktokUsername = tiktokInput ? tiktokInput.value.trim() : "";

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // اسم TikTok (اختياري)
      if (tiktokUsername) {
        await updateProfile(user, {
          displayName: tiktokUsername
        });
      }

      // Firestore user
      await setDoc(doc(db, "users", user.uid), {
        email,
        tiktokUsername: tiktokUsername || null,
        role: "client",     // admin | support | client
        active: true,
        createdAt: new Date()
      });

      window.location.href = "dashboard.html";
    } catch (err) {
      regMsg.innerText = err.message;
    }
  });
}

// ===================================================
// ================= LOGIN ============================
// ===================================================
const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMsg");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (err) {
      loginMsg.innerText = err.message;
    }
  });
}

// ===================================================
// ============ DASHBOARD PROTECTION + ROLES ==========
// ===================================================
onAuthStateChanged(auth, async (user) => {
  const path = window.location.pathname;

  // 🟥 لو مش مسجل
  if (!user) {
    if (!path.includes("login") && !path.includes("register")) {
      window.location.href = "login.html";
    }
    return;
  }

  // 🟩 لو مسجل وهو في login أو register
  if (path.includes("login") || path.includes("register")) {
    window.location.href = "dashboard.html";
    return;
  }

  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    let role = "client";
    let active = true;

  const OWNER_EMAIL = "davenci.c.o.s.pro@gmail.com";

if (!snap.exists()) {
  await setDoc(ref, {
    email: user.email,
    role: user.email === OWNER_EMAIL ? "owner" : "client",
    active: true,
    createdAt: new Date()
  });


    } else {
      role = snap.data().role || "client";
      active = snap.data().active !== false;
    }

    if (!active) {
      alert("الحساب موقوف");
      await signOut(auth);
      window.location.href = "login.html";
      return;
    }

    console.log("ROLE =", role);

  if (!document.querySelector(".dashboard-grid")) return;

document.querySelectorAll("[data-role]").forEach(el => {
  const allowed = el.dataset.role.split(" ");

  el.style.display =
    role === "owner" || allowed.includes(role)
      ? "block"
      : "none";
});
    

  } catch (err) {
    console.error("Dashboard error:", err);
  }
});
// ===================================================
// ================= LOGOUT ===========================
// ===================================================
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}
// ================= STAFF REGISTER =================
const staffForm = document.getElementById("staffRegisterForm");
const msg = document.getElementById("msg");

if (staffForm) {
  staffForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      msg.innerText = "❌ عَمّر جميع الحقول";
      return;
    }

    try {
      // إنشاء الحساب
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // إنشاء المستخدم في Firestore كـ staff
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "staff",
        active: true,
        createdAt: new Date()
      });

      msg.innerText = "✅ تم تسجيل الموظف بنجاح";

      // تحويل لتسجيل الدخول
      setTimeout(() => {
        window.location.href = "../login.html";
      }, 1500);

    } catch (err) {
      msg.innerText = "❌ " + err.message;
    }
  });
}
