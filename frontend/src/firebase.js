import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkZp2_L8jTzYKXLuM-o118l9hpYJ7jdGE",
  authDomain: "qchat-5454.firebaseapp.com",
  projectId: "qchat-5454",
  storageBucket: "qchat-5454.firebasestorage.app",
  messagingSenderId: "662208948869",
  appId: "1:662208948869:web:8bd51cc8f56477cadc17ec",
  measurementId: "G-3JXC7QJDL7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );
  }
  return window.recaptchaVerifier;
};

export { auth };