<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <footer
    class="mx-auto mt-auto w-full transition-all duration-300 lg:w-[75%] "
  >
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
      <!-- Brand Section -->
      <div class="flex flex-col gap-2">
        <RouterLink
          to="/"
          class="group flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 transition-all duration-300 hover:text-blue-600 sm:text-2xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-7 w-7 text-blue-500 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span class="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text font-extrabold text-transparent">
            Travel Explorer
          </span>
        </RouterLink>
        <p class="max-w-sm text-sm leading-relaxed text-slate-600">
          Discover amazing destinations and plan your perfect trip with Travel Explorer. Your journey starts here.
        </p>
      </div>

      <!-- Links Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:gap-8">
        <!-- Quick Links -->
        <div class="flex flex-col gap-2">
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900">Quick Links</h3>
          <nav class="flex flex-col gap-1.5">
            <RouterLink
              to="/"
              class="group relative text-sm font-medium text-slate-600 transition-all duration-200 hover:translate-x-1 hover:text-blue-600"
            >
              <span class="relative z-10">Home</span>
              <span class="absolute left-0 top-1/2 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-200 group-hover:w-full"></span>
            </RouterLink>
            <RouterLink
              to="/about"
              class="group relative text-sm font-medium text-slate-600 transition-all duration-200 hover:translate-x-1 hover:text-blue-600"
            >
              <span class="relative z-10">About</span>
              <span class="absolute left-0 top-1/2 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-200 group-hover:w-full"></span>
            </RouterLink>
            <RouterLink
              to="/contact"
              class="group relative text-sm font-medium text-slate-600 transition-all duration-200 hover:translate-x-1 hover:text-blue-600"
            >
              <span class="relative z-10">Contact</span>
              <span class="absolute left-0 top-1/2 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-200 group-hover:w-full"></span>
            </RouterLink>
          </nav>
        </div>

        <!-- Social Links -->
        <div class="flex flex-col gap-2">
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900">Follow Us</h3>
          <div class="flex gap-2">
            <a
              href="#"
              class="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200/50"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            
            <a
              href="#"
              class="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-pink-400 hover:bg-gradient-to-br hover:from-pink-500 hover:to-rose-500 hover:text-white hover:shadow-lg hover:shadow-pink-200/50"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="mt-2 pt-3 flex justify-between items-center border-t border-slate-200">
      <p class="text-left text-sm text-slate-500">
        © {{ new Date().getFullYear() }} Travel Explorer. All rights reserved.
      </p>
      <p class="text-right text-sm text-slate-500">
        Designed by Pataveekorn C.
      </p>
    </div>
  </footer>
</template>

