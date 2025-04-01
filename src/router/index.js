import { createRouter, createWebHistory } from "vue-router";
import BlogList from "../components/BlogList.vue";
import BlogPost from "../components/BlogPost.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: BlogList,
  },
  {
    path: "/post/:id",
    name: "Post",
    component: BlogPost,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
