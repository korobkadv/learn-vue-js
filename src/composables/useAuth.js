import { ref } from "vue";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const user = ref(null);

// Відстежуємо стан автентифікації одразу, не чекаючи onMounted
onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
  console.log(
    "Auth state changed:",
    currentUser ? currentUser.email : "logged out"
  );
});

export function useAuth() {
  return {
    user,
  };
}
