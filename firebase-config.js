import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, push, set, remove, update, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
const firebaseConfig = {
     apiKey: "AIzaSyBkCma7jbfyqzzSNdYKsLLT1WbZbMrIpxs",
  authDomain: "enesogrenci-91325.firebaseapp.com",
  databaseURL: "https://enesogrenci-91325-default-rtdb.firebaseio.com",
  projectId: "enesogrenci-91325",
  storageBucket: "enesogrenci-91325.firebasestorage.app",
  messagingSenderId: "364088274010",
  appId: "1:364088274010:web:98dc1daac0d094246cbc63",
  measurementId: "G-VSCX9PWJSM"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, push, set, remove, update, get };
