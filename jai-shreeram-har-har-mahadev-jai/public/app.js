import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVuBUOjk1Vyrnjy_iDOz9QKZyWzOmIBVQ",
  authDomain: "sekhar-vyshya-matrimony.firebaseapp.com",
  projectId: "sekhar-vyshya-matrimony",
  storageBucket: "sekhar-vyshya-matrimony.firebasestorage.app",
  messagingSenderId: "1077134834435",
  appId: "1:1077134834435:web:e197422e4885905eab8736",
  measurementId: "G-DQEPCRH30L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginPanel = document.querySelector("#loginPanel");
const memberPanel = document.querySelector("#memberPanel");
const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const logoutButton = document.querySelector("#logoutButton");
const tabs = document.querySelectorAll(".tab");
const showProfileForm = document.querySelector("#showProfileForm");
const profileForm = document.querySelector("#profileForm");
const accountEmail = document.querySelector("#accountEmail");
const deleteAccountButton = document.querySelector("#deleteAccountButton");
const accountMessage = document.querySelector("#accountMessage");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessage.textContent = "Checking login...";

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
    loginMessage.textContent = "";
  } catch (error) {
    loginMessage.textContent = "Login failed. Please check email and password.";
  }
});

logoutButton.addEventListener("click", async () => {
  await signOut(auth);
});

deleteAccountButton.addEventListener("click", async () => {
  const user = auth.currentUser;

  if (!user) {
    return;
  }

  const confirmed = confirm(
    "Delete your login account? This cannot be undone. For profile removal, please also contact admin."
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteUser(user);
    accountMessage.textContent = "";
    alert("Your login account has been deleted.");
  } catch (error) {
    if (error.code === "auth/requires-recent-login") {
      accountMessage.textContent = "Please logout, login again, then delete your account.";
      return;
    }

    accountMessage.textContent = "Could not delete account. Please contact admin.";
  }
});

onAuthStateChanged(auth, (user) => {
  const isLoggedIn = Boolean(user);
  loginPanel.classList.toggle("hidden", isLoggedIn);
  memberPanel.classList.toggle("hidden", !isLoggedIn);
  logoutButton.classList.toggle("hidden", !isLoggedIn);
  accountEmail.textContent = user?.email ?? "-";
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.target;

    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    document.querySelector("#brides").classList.toggle("hidden", target !== "brides");
    document.querySelector("#grooms").classList.toggle("hidden", target !== "grooms");
  });
});

showProfileForm.addEventListener("click", () => {
  profileForm.classList.toggle("hidden");
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const photoInput = document.querySelector("#profilePhotos");
  const photos = Array.from(photoInput.files);
  const maxPhotos = 8;
  const maxPhotoSize = 100 * 1024 * 1024;

  if (photos.length > maxPhotos) {
    alert("You can add only up to 8 photos.");
    return;
  }

  const oversizedPhoto = photos.find((photo) => photo.size > maxPhotoSize);
  if (oversizedPhoto) {
    alert(`Each photo must be 100 MB or less. This photo is too large: ${oversizedPhoto.name}`);
    return;
  }

  const fields = [
    ["Profile For", "#profileFor"],
    ["Date of Birth", "#dateOfBirth"],
    ["Place of Birth", "#placeOfBirth"],
    ["Rashi", "#rashi"],
    ["Nakshathra", "#nakshathra"],
    ["Gothram", "#gothram"],
    ["Uncles Gothram", "#unclesGothram"],
    ["Height", "#height"],
    ["Education", "#education"],
    ["Occupation / Income", "#occupationIncome"],
    ["Complexion", "#complexion"],
    ["Father Name", "#fatherName"],
    ["Occupation of Father", "#fatherOccupation"],
    ["Mother Name", "#motherName"],
    ["Occupation of Mother", "#motherOccupation"],
    ["Marital Status", "#maritalStatus"],
    ["Siblings", "#siblings"],
    ["Communication Address", "#communicationAddress"],
    ["Phone Number - Admin Only", "#phoneNumber"],
    ["Number of Photos Selected", "#profilePhotos"],
    ["About Family", "#aboutFamily"],
    ["Expectations", "#expectations"]
  ];

  const message = fields
    .map(([label, selector]) => {
      if (selector === "#profilePhotos") {
        return `${label}: ${photos.length}`;
      }

      return `${label}: ${document.querySelector(selector).value.trim()}`;
    })
    .join("\n");

  const text = encodeURIComponent(
    `New Matrimonial Profile Request\n\n${message}\n\nNote: Photos will be sent separately on WhatsApp. Phone number is for admin only.`
  );
  window.open(`https://wa.me/919849676581?text=${text}`, "_blank", "noreferrer");
});
