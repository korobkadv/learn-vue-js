<template>
  <div class="post-container">
    <div v-if="post" class="post-content">
      <div class="post-header">
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <div class="author-info">
            <img :src="post.authorPhoto" :alt="post.author" class="author-avatar">
            <span>{{ post.author }}</span>
          </div>
          <span class="post-date">{{ formatDate(post.createdAt) }}</span>
        </div>
      </div>

      <div class="post-body">
        {{ post.content }}
      </div>

      <!-- Секція коментарів -->
      <div class="comments-section">
        <h2>Коментарі</h2>
        
        <!-- Форма для додавання коментаря -->
        <div v-if="user" class="comment-form">
          <textarea 
            v-model="newComment" 
            placeholder="Напишіть коментар..."
            rows="3"
          ></textarea>
          <button @click="addComment" class="submit-btn">
            Додати коментар
          </button>
        </div>

        <!-- Список коментарів -->
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment">
            <div class="comment-header">
              <img :src="comment.authorPhoto" :alt="comment.author" class="comment-avatar">
              <div class="comment-meta">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
              </div>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';

const route = useRoute();
const post = ref(null);
const comments = ref([]);
const user = ref(null);
const newComment = ref('');

onMounted(async () => {
  // Відстеження стану автентифікації
  auth.onAuthStateChanged((currentUser) => {
    user.value = currentUser;
  });

  // Завантаження посту
  await loadPost();
  // Завантаження коментарів
  await loadComments();
});

const loadPost = async () => {
  try {
    const docRef = doc(db, 'posts', route.params.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      post.value = { id: docSnap.id, ...docSnap.data() };
    }
  } catch (error) {
    console.error('Помилка завантаження посту:', error);
  }
};

const loadComments = async () => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', route.params.id),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    comments.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Помилка завантаження коментарів:', error);
  }
};

const addComment = async () => {
  if (!newComment.value.trim()) return;

  try {
    await addDoc(collection(db, 'comments'), {
      content: newComment.value,
      postId: route.params.id,
      author: user.value.displayName,
      authorId: user.value.uid,
      authorPhoto: user.value.photoURL,
      createdAt: new Date()
    });

    // Очищення форми
    newComment.value = '';
    // Перезавантаження коментарів
    await loadComments();
  } catch (error) {
    console.error('Помилка додавання коментаря:', error);
  }
};

const formatDate = (date) => {
  return new Date(date.toDate()).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.post-container {
  min-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.post-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-header {
  margin-bottom: 2rem;
}

.post-header h1 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.post-body {
  line-height: 1.8;
  color: #2c3e50;
  margin-bottom: 3rem;
}

.comments-section {
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.comments-section h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.comment-form {
  margin-bottom: 2rem;
}

.comment-form textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  resize: vertical;
}

.submit-btn {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.comment-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-meta {
  display: flex;
  flex-direction: column;
}

.comment-author {
  font-weight: 500;
  color: #2c3e50;
}

.comment-date {
  font-size: 0.8rem;
  color: #666;
}

.comment-content {
  margin: 0;
  color: #2c3e50;
  line-height: 1.5;
}
</style> 