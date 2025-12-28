import { db } from "../core/firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";

// عناصر الصفحة
const btn = document.getElementById("sendBtn");
const msg = document.getElementById("msg");

btn.addEventListener("click", async () => {
  const tiktokName = document.getElementById("tiktokName").value.trim();
  const issueType = document.getElementById("issueType").value;
  const message = document.getElementById("ticketText").value.trim();
  const fileInput = document.getElementById("ticketImage");

  if (!tiktokName || !issueType || !message) {
    msg.textContent = "❌ أكمل كل الحقول";
    return;
  }

  msg.textContent = "⏳ جاري الإرسال...";

 
  // حفظ التذكرة
  await addDoc(collection(db, "tickets"), {
    tiktokName,
    issueType,
    message,
  
    createdAt: serverTimestamp(),
    replies: []
  });

  msg.textContent = "✅ تم إرسال التذكرة بنجاح";

  setTimeout(() => {
    window.location.href = "../staf/tickets.html";
  }, 1500);
});
