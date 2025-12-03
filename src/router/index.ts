import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";

const LoginPage = () => import("../pages/LoginPage.vue");
const RegisterPage = () => import("../pages/RegisterPage.vue");
const TripDetailPage = () => import("../pages/TripDetailPage.vue");
const DashboardPage = () => import("../pages/dashboard.vue");
const AboutPage = () => import("../pages/AboutPage.vue");
const ContactPage = () => import("../pages/ContactPage.vue");
const CreateDestinationPage = () => import("../pages/CreateDestinationPage.vue");
const EditDestinationPage = () => import("../pages/EditDestinationPage.vue");
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/about",
      name: "about",
      component: AboutPage,
    },
    {
      path: "/contact",
      name: "contact",
      component: ContactPage,
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
    {
      path: "/destinations/create",
      name: "create-destination",
      component: CreateDestinationPage,
    },
    {
      path: "/destinations/edit/:tripId",
      name: "edit-destination",
      component: EditDestinationPage,
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;

