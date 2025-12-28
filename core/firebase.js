import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAd8C9-0_Zw93XUn-9RokqRFI880L09qRI",
    authDomain: "davenci-conseils-pro.firebaseapp.com",
    projectId: "davenci-conseils-pro",
    storageBucket: "davenci-conseils-pro.firebasestorage.app",
    messagingSenderId: "518911977926",
    appId: "1:518911977926:web:3d65a902f910b5fa86aac7",
    measurementId: "G-G8PNJ0B66Q"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
