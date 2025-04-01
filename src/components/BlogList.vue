<template>
  <div class="blog-container">
    <div class="blog-header">
      <h1>Останні статті</h1>
      <button v-if="user" @click="showNewPostForm = true" class="new-post-btn">
        Нова стаття
      </button>
    </div>

    <div class="posts-grid">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <h2>{{ post.title }}</h2>
        <p class="post-excerpt">{{ post.content.substring(0, 150) }}...</p>
        <div class="post-meta">
          <span class="post-author">{{ post.author }}</span>
          <span class="post-date">{{ formatDate(post.createdAt) }}</span>
        </div>
        <router-link :to="'/post/' + post.id" class="read-more">
          Читати далі
        </router-link>
      </div>
    </div>

    <!-- Форма для створення нового посту -->
    <div v-if="showNewPostForm" class="new-post-form">
      <h2>Нова стаття</h2>
      <form @submit.prevent="createPost">
        <div class="form-group">
          <label for="title">Заголовок</label>
          <input 
            type="text" 
            id="title" 
            v-model="newPost.title" 
            required
          >
        </div>
        <div class="form-group">
          <label for="content">Контент</label>
          <textarea 
            id="content" 
            v-model="newPost.content" 
            rows="10" 
            required
          ></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn">Опублікувати</button>
          <button type="button" @click="showNewPostForm = false" class="cancel-btn">
            Скасувати
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../composables/useAuth';

const { user } = useAuth();
const posts = ref([]);
const showNewPostForm = ref(false);
const newPost = ref({
  title: '',
  content: ''
});

onMounted(() => {
  loadPosts();
});

const loadPosts = async () => {
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    posts.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Помилка завантаження постів:', error);
  }
};

const createPost = async () => {
  try {
    await addDoc(collection(db, 'posts'), {
      title: newPost.value.title,
      content: newPost.value.content,
      author: user.value.displayName,
      authorId: user.value.uid,
      createdAt: new Date(),
      authorPhoto: user.value.photoURL
    });
    
    // Очищення форми
    newPost.value.title = '';
    newPost.value.content = '';
    showNewPostForm.value = false;
    
    // Перезавантаження постів
    loadPosts();
  } catch (error) {
    console.error('Помилка створення посту:', error);
  }
};

const formatDate = (date) => {
  return new Date(date.toDate()).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.blog-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  flex-grow: 1;
}

.blog-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  margin-bottom: 2rem;
  width: 100%;
}

.new-post-btn {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.new-post-btn:hover {
  background-color: #45a049;
  transform: translateY(-1px);
}

.posts-grid {
  display: grid;
  gap: 2rem;
  width: 100%;
  grid-template-columns: 1fr; /* За замовчуванням 1 колонка для мобільних */
}

.post-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.post-card h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.post-excerpt {
  color: #666;
  line-height: 1.6;
  flex-grow: 1;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 0.9rem;
}

.read-more {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.read-more:hover {
  color: #45a049;
}

/* Стилі для модального вікна нового поста */
.new-post-form {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  z-index: 1000;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.submit-btn,
.cancel-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
}

.submit-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #da190b;
}

/* Адаптивні стилі */
@media (min-width: 768px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 колонки для планшетів */
  }
}

@media (min-width: 1024px) {
  .posts-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 колонки для десктопів */
  }
}

/* Стилі для планшетів і десктопів */
@media (min-width: 768px) {
  .blog-container {
    padding: 2rem;
  }

  .blog-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
}
</style> 