import { db } from "../core/firebase.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const container = document.getElementById("ticketsContainer");

const q = query(
  collection(db, "tickets"),
  orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {
  container.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const t = docSnap.data();

    const div = document.createElement("div");
    div.className = "ticket";

    div.innerHTML = `
      <p><b>👤 المستخدم:</b> ${t.tiktokName || "غير معروف"}</p>
      <p><b>📌 النوع:</b> ${t.issueType || "-"}</p>
      <p><b>📝 المشكل:</b><br>${t.message || "-"}</p>
      <p><b>🕒 الوقت:</b>
        ${t.createdAt?.toDate().toLocaleString("ar-TN") || "-"}
      </p>
      <p><b>📍 الحالة:</b> open</p>
    `;

    container.appendChild(div);
  });
});
