<script setup lang="ts">
</script>

<template>
  <section class="mx-auto w-full px-4 pt-0 pb-12 sm:px-6 sm:pt-0 sm:pb-16 lg:w-[60%]">
    <div class="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg sm:p-12">
      <header class="mb-12 text-center">
        <h1 class="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">
          About Travel Explorer
        </h1>
        <p class="mx-auto max-w-2xl text-lg text-slate-600">
          A travel recommendation app that helps you discover amazing destinations
        </p>
      </header>

      <div class="space-y-10">
        <!-- About the App -->
        <div class="space-y-4">
          <h2 class="text-2xl font-semibold text-slate-900">About the App</h2>
          <div class="h-px bg-slate-200"></div>
          <p class="leading-relaxed text-slate-600">
            Travel Explorer is a travel recommendation app designed to help users discover
            and explore interesting destinations from around the world. The app allows you to
            search for trips by category, tags, or keywords, with detailed information for
            each trip to help you plan your journey.
          </p>
        </div>

        <!-- Key Features -->
        <div class="space-y-4">
          <h2 class="text-2xl font-semibold text-slate-900">Key Features</h2>
          <div class="h-px bg-slate-200"></div>
          <ul class="grid gap-4 sm:grid-cols-2">
            <li class="flex items-start gap-3 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span class="text-slate-700">Search and explore diverse travel trips</span>
            </li>
            <li class="flex items-start gap-3 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span class="text-slate-700">Filter trips by category, tags, and keywords</span>
            </li>
            <li class="flex items-start gap-3 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span class="text-slate-700">View trip details with complete information</span>
            </li>
            <li class="flex items-start gap-3 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span class="text-slate-700">Create and manage your own trips</span>
            </li>
          </ul>
        </div>

        <!-- Tech Stack -->
        <div class="space-y-4">
          <h2 class="text-2xl font-semibold text-slate-900">Tech Stack</h2>
          <div class="h-px bg-slate-200"></div>
          <p class="leading-relaxed text-slate-600">
            This application is developed with modern technologies to provide the best user experience
          </p>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Frontend -->
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-5 transition-shadow hover:shadow-md">
              <h3 class="mb-3 text-base font-semibold text-slate-900">Frontend</h3>
              <ul class="space-y-2 text-sm text-slate-600">
                <li>• Vue 3 (Composition API)</li>
                <li>• TypeScript</li>
                <li>• Vue Router</li>
                <li>• Vite</li>
                <li>• Tailwind CSS</li>
                <li>• Axios</li>
              </ul>
            </div>
            <!-- Backend -->
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-5 transition-shadow hover:shadow-md">
              <h3 class="mb-3 text-base font-semibold text-slate-900">Backend</h3>
              <ul class="space-y-2 text-sm text-slate-600">
                <li>• Spring Boot 3.5.7</li>
                <li>• Java 21</li>
                <li>• Spring Data JPA</li>
                <li>• Spring Security</li>
                <li>• JWT Authentication</li>
                <li>• PostgreSQL</li>
              </ul>
            </div>
            <!-- Services & Tools -->
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-5 transition-shadow hover:shadow-md">
              <h3 class="mb-3 text-base font-semibold text-slate-900">Services & Tools</h3>
              <ul class="space-y-2 text-sm text-slate-600">
                <li>• Supabase (Storage)</li>
                <li>• Docker</li>
                <li>• Maven</li>
                <li>• Vue TSC (Type Checking)</li>
                <li>• Hot Module Replacement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>