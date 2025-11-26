<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { ref } from "vue";

const router = useRouter();
const route = useRoute();
const { isAuthenticated, logout } = useAuth();

const isMobileMenuOpen = ref(false);

const handleLogout = () => {
  logout();
  router.push("/login");
  isMobileMenuOpen.value = false;
};

const isActive = (path: string) => {
  return route.path === path;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<template>
  <nav
    class="relative mx-auto flex w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md px-4 py-3 shadow-lg shadow-slate-200/50 transition-all duration-300 sm:px-6 lg:w-[70%]"
  >
    <RouterLink
      to="/"
      class="group flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 transition-all duration-200 hover:text-blue-600 sm:text-xl"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-6 w-6 text-blue-500 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <span class="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text font-extrabold text-transparent">
        Travel Explorer
      </span>
    </RouterLink>

    <!-- Navigation Menu -->
    <div class="hidden items-center gap-1 md:flex">
      <RouterLink
        to="/"
        :class="[
          'group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
          isActive('/')
            ? 'bg-blue-50 text-blue-600'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </RouterLink>

      <RouterLink
        to="/about"
        :class="[
          'group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
          isActive('/about')
            ? 'bg-blue-50 text-blue-600'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <span>About</span>
      </RouterLink>

      <RouterLink
        to="/contact"
        :class="[
          'group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
          isActive('/contact')
            ? 'bg-blue-50 text-blue-600'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <span>Contact</span>
      </RouterLink>
    </div>

    <div class="flex items-center gap-3">
      <!-- Desktop Create Trip Button -->
      <RouterLink
        to="/dashboard"
        class="group hidden items-center gap-2 rounded-full border border-slate-200 bg-gradient-to-r from-blue-50 to-sky-50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:from-blue-100 hover:to-sky-100 hover:shadow-md hover:shadow-blue-200/50 lg:inline-flex"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 text-blue-600 transition-transform duration-200 group-hover:scale-110"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        <span>Create Trip</span>
      </RouterLink>

      <!-- Mobile Menu Button -->
      <button
        type="button"
        @click="toggleMobileMenu"
        class="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 md:hidden"
        aria-label="Toggle menu"
      >
        <svg
          v-if="!isMobileMenuOpen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-6 w-6"
        >
          <line x1="3" x2="21" y1="6" y2="6" />
          <line x1="3" x2="21" y1="12" y2="12" />
          <line x1="3" x2="21" y1="18" y2="18" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-6 w-6"
        >
          <line x1="18" x2="6" y1="6" y2="18" />
          <line x1="6" x2="18" y1="6" y2="18" />
        </svg>
      </button>

      <div class="hidden items-center gap-1.5 md:flex">
        <template v-if="isAuthenticated">
          <RouterLink
            to="/dashboard"
            class="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md sm:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4 text-blue-600"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            <span>Dashboard</span>
          </RouterLink>
          <button
            type="button"
            class="group inline-flex items-center gap-2 rounded-full border border-red-500 bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-200/50 transition-all duration-200 hover:border-red-600 hover:from-red-600 hover:to-rose-600 hover:shadow-lg hover:shadow-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
            @click="handleLogout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </template>
        <RouterLink
          v-else
          to="/login"
          class="group inline-flex items-center gap-2 rounded-full border border-blue-500 bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200/50 transition-all duration-200 hover:border-blue-600 hover:from-blue-600 hover:to-sky-600 hover:shadow-lg hover:shadow-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" x2="3" y1="12" y2="12" />
          </svg>
          <span>Sign In</span>
        </RouterLink>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="absolute left-0 right-0 top-full mt-2 mx-4 rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xl shadow-slate-200/50 md:hidden"
    >
      <div class="flex flex-col p-2">
        <RouterLink
          to="/"
          @click="closeMobileMenu"
          :class="[
            'group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
            isActive('/')
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </RouterLink>

        <RouterLink
          to="/about"
          @click="closeMobileMenu"
          :class="[
            'group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
            isActive('/about')
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <span>About</span>
        </RouterLink>

        <RouterLink
          to="/contact"
          @click="closeMobileMenu"
          :class="[
            'group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
            isActive('/contact')
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span>Contact</span>
        </RouterLink>

        <template v-if="isAuthenticated">
          <div class="my-1 border-t border-slate-200"></div>
          <RouterLink
            to="/dashboard"
            @click="closeMobileMenu"
            class="group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            <span>Dashboard</span>
          </RouterLink>
          <button
            type="button"
            @click="handleLogout"
            class="group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </template>
        <template v-else>
          <div class="my-1 border-t border-slate-200"></div>
          <RouterLink
            to="/login"
            @click="closeMobileMenu"
            class="group flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-600 hover:to-sky-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
            <span>Sign In</span>
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>
