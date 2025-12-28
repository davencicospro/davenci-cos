import { db } from "../core/firebase.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const container = document.getElementById("announcementsContainer");
const role = (localStorage.getItem("role") || "").toLowerCase();

const q = query(
  collection(db, "announcements"),
  orderBy("createdAt", "desc")
);

const snap = await getDocs(q);

container.innerHTML = "";

if (snap.empty) {
  container.innerHTML = "<p>لا توجد إعلانات</p>";
}

snap.forEach(d => {
  const data = d.data();

  const date = data.createdAt
    ? data.createdAt.toDate().toLocaleString("ar-TN")
    : "غير معروف";

  const card = document.createElement("div");
  card.style.border = "1px solid #ccc";
  card.style.borderRadius = "10px";
  card.style.padding = "10px";
  card.style.marginBottom = "10px";

  card.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.content}</p>
    <small>📅 ${date}</small>
    <br/>
    ${
      ["admin", "owner"].includes(role)
        ? `<button class="deleteBtn">🗑️ حذف الإعلان</button>`
        : ""
    }
  `;

  // زر الحذف
  if (["admin", "owner"].includes(role)) {
    card.querySelector(".deleteBtn").onclick = async () => {
      const ok = confirm("⚠️ هل أنت متأكد من حذف الإعلان؟");
      if (!ok) return;

      await deleteDoc(doc(db, "announcements", d.id));
      card.remove();
    };
  }

  container.appendChild(card);
});
