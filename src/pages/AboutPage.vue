<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-[80%]">
    <div class="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg sm:p-12">
      <header class="mb-8 text-center">
        <h1 class="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">
          About Travel Explorer
        </h1>
        <p class="text-lg text-slate-600">
          Discover amazing destinations and plan your perfect journey
        </p>
      </header>

      <div class="prose prose-slate mx-auto max-w-none">
        <div class="mb-8 space-y-6">
          <div>
            <h2 class="mb-3 text-2xl font-semibold text-slate-900">Our Mission</h2>
            <p class="text-slate-600 leading-relaxed">
              Travel Explorer is dedicated to helping travelers discover incredible destinations
              around the world. We provide a platform where you can explore, plan, and share
              your travel experiences with a community of passionate adventurers.
            </p>
          </div>

          <div>
            <h2 class="mb-3 text-2xl font-semibold text-slate-900">What We Offer</h2>
            <ul class="space-y-3 text-slate-600">
              <li class="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mt-1 h-5 w-5 flex-shrink-0 text-blue-500"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Curated travel destinations with detailed information</span>
              </li>
              <li class="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mt-1 h-5 w-5 flex-shrink-0 text-blue-500"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Create and manage your own travel trips</span>
              </li>
              <li class="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mt-1 h-5 w-5 flex-shrink-0 text-blue-500"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Share your travel experiences with others</span>
              </li>
              <li class="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mt-1 h-5 w-5 flex-shrink-0 text-blue-500"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Search and filter destinations by tags and categories</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 class="mb-3 text-2xl font-semibold text-slate-900">Get Started</h2>
            <p class="mb-4 text-slate-600 leading-relaxed">
              Ready to start exploring? Create an account to begin planning your next adventure
              and share your travel experiences with our community.
            </p>
            <div class="flex flex-wrap gap-3">
              <RouterLink
                to="/register"
                class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-600 hover:to-sky-600 hover:shadow-lg"
              >
                Sign Up Now
              </RouterLink>
              <RouterLink
                to="/"
                class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50"
              >
                Explore Destinations
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

