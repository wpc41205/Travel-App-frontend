import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";

const LoginPage = () => import("../pages/LoginPage.vue");
const RegisterPage = () => import("../pages/RegisterPage.vue");
const TripDetailPage = () => import("../pages/TripDetailPage.vue");
const DashboardPage = () => import("../pages/dashboard.vue");
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterPage,
    },
    {
      path: "/trips/:tripId",
      name: "trip-detail",
      component: TripDetailPage,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardPage,
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;

