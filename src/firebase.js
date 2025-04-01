import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Тут вам потрібно буде вставити ваші дані з Firebase Console
  apiKey: "AIzaSyC_tgLAvvlMaNzEiRfb4PTa7lQYcR3ITpM",
  authDomain: "vue-blog-c2039.firebaseapp.com",
  projectId: "vue-blog-c2039",
  storageBucket: "vue-blog-c2039.appspot.com",
  messagingSenderId: "709252024649",
  appId: "1:709252024649:web:b136955e1d73ab42bbf298",
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
