<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { isAuthenticated, logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push("/login");
};
</script>

<template>
  <nav
    class="mx-auto flex w-full max-w-5xl items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-6"
  >
    <RouterLink
      to="/"
      class="text-lg font-semibold tracking-tight text-slate-900 transition hover:text-blue-600 sm:text-xl"
    >
      เที่ยวไหนดี
    </RouterLink>

    <div class="flex items-center gap-3">
      <RouterLink
        to="/dashboard"
        class="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 sm:inline-flex"
      >
        จัดการปลายทาง
      </RouterLink>

      <div class="flex flex-col items-end gap-1">
        <template v-if="isAuthenticated">
          <RouterLink
            to="/dashboard"
            class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 sm:hidden"
          >
            จัดการปลายทาง
          </RouterLink>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-red-500 bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:border-red-600 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            @click="handleLogout"
          >
            ออกจากระบบ
          </button>
        </template>
        <RouterLink
          v-else
          to="/login"
          class="inline-flex items-center gap-2 rounded-full border border-blue-500 bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:border-blue-600 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          เข้าสู่ระบบ
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
