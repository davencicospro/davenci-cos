import { db } from "../core/firebase.js";
import {
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const ticketId = params.get("id");

if (!ticketId) {
  document.body.innerHTML = "❌ لم يتم العثور على التذكرة";
  throw new Error("No ticket id");
}

const ticketRef = doc(db, "tickets", ticketId);

onSnapshot(ticketRef, (snap) => {
  if (!snap.exists()) return;

  const data = snap.data();

  document.getElementById("ticket").innerHTML = `
    <b>المشكل:</b> ${data.issueType}<br>
    <b>الشرح:</b> ${data.message}
  `;

  const repliesDiv = document.getElementById("replies");
  repliesDiv.innerHTML = "";

  (data.replies || []).forEach(r => {
    repliesDiv.innerHTML += `
      <div class="reply">
        <b>🛡️ دعم Davenci C.O.S</b><br>
        ${r.text}
      </div>
    `;
  });
});
