import { db } from "../../core/firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// ✅ نخدم بعد ما الصفحة تكمل تحميل
document.addEventListener("DOMContentLoaded", () => {

  // 🔒 حماية: فقط owner/admin
  const role = (localStorage.getItem("role") || "").toLowerCase();
  if (!["owner", "admin"].includes(role)) {
    alert("🚫 ليس لديك صلاحية نشر الإعلانات");
    location.href = "../announcements.html";
    return;
  }

  const btn = document.getElementById("publishAnnouncement");
  const msg = document.getElementById("msg");
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");

  if (!btn || !msg || !titleInput || !contentInput) {
    console.error("❌ عناصر الصفحة ناقصة (IDs غلط)");
    return;
  }

  btn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
      msg.textContent = "❌ أكمل عنوان الإعلان ونص الإعلان";
      return;
    }

    btn.disabled = true;
    msg.textContent = "⏳ جاري نشر الإعلان...";

    try {
      await addDoc(collection(db, "announcements"), {
        title,
        content,
        createdAt: serverTimestamp()
      });

      msg.textContent = "✅ تم نشر الإعلان بنجاح";
      titleInput.value = "";
      contentInput.value = "";

      setTimeout(() => {
        location.href = "../announcements.html";
      }, 800);

    } catch (e) {
      console.error("🔥 نشر الإعلان فشل:", e);
      msg.textContent = "❌ فشل النشر.. شوف Console (F12)";
      btn.disabled = false;
    }
  });

});
