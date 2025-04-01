<template>
  <nav class="navbar">
    <router-link to="/" class="logo">Блог</router-link>
    
    <div class="auth-section">
      <template v-if="!user">
        <button @click="signInWithGoogle" class="google-btn">
          <img src="https://www.google.com/favicon.ico" alt="Google" class="google-icon" />
          Увійти
        </button>
      </template>
      
      <template v-else>
        <div class="user-info">
          <img :src="user.photoURL" :alt="user.displayName" class="user-avatar" />
          <span class="user-name">{{ user.displayName }}</span>
        </div>
        <button @click="signOut" class="logout-btn">
          Вийти
        </button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { useAuth } from '../composables/useAuth';
import { onMounted, ref } from 'vue';

const { user } = useAuth();

const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Помилка входу:", error);
  }
};

const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Помилка виходу:", error);
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s ease;
}

.logo:hover {
  color: #4CAF50;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.google-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.google-btn:hover {
  background-color: #f5f5f5;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.google-icon {
  width: 16px;
  height: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4CAF50;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
}

.logout-btn {
  padding: 6px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #c82333;
  transform: translateY(-1px);
}

@media (min-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .user-name {
    display: none;
  }

  .auth-section {
    gap: 0.5rem;
  }
}
</style> 