<script setup lang="ts">
import meImage from "../assets/me1.jpg";
</script>

<template>
  <section class="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
    <div class="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur-sm sm:p-12">
      <!-- Header Section -->
      <header class="mb-12 text-center">
        <div class="mb-6 flex justify-center">
          <div class="relative">
            <div
              class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-sky-400 opacity-20 blur-xl"
            ></div>
            <img
              :src="meImage"
              alt="Profile"
              class="relative h-32 w-32 rounded-full object-cover shadow-2xl ring-4 ring-blue-100 transition-transform duration-300 hover:scale-105 sm:h-40 sm:w-40"
            />
          </div>
        </div>
        <h1 class="mb-4 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          CONTACT ME.
        </h1>
      </header>

      <!-- Contact Information Section -->
      <div class="mx-auto max-w-3xl">
        <div class="mb-8 text-center">
          <h2 class="mb-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Get in Touch</h2>
          <div class="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-sky-500"></div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          <!-- Email -->
          <a
            href="mailto:pataveekorn2001@gmail.com"
            class="group flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md"
          >
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:from-blue-200 group-hover:to-blue-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-6 w-6"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="mb-1 font-semibold text-slate-900">Email</h3>
              <p class="text-sm text-slate-600 transition-colors group-hover:text-blue-600">
                pataveekorn2001@gmail.com
              </p>
            </div>
          </a>

          <!-- Phone -->
          <a
            href="tel:0923256944"
            class="group flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md"
          >
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 text-green-600 transition-transform duration-300 group-hover:scale-110 group-hover:from-green-200 group-hover:to-green-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-6 w-6"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="mb-1 font-semibold text-slate-900">Phone</h3>
              <p class="text-sm text-slate-600 transition-colors group-hover:text-green-600">
                092-325-6944
              </p>
            </div>
          </a>

          <!-- Location -->
          <div
            class="group flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-all duration-300 hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-md"
          >
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 transition-transform duration-300 group-hover:scale-110 group-hover:from-purple-200 group-hover:to-purple-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-6 w-6"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="mb-1 font-semibold text-slate-900">Location</h3>
              <p class="text-sm text-slate-600">
                Hua Hin, Prachuap Khiri Khan
                <br />
                <span class="text-xs text-slate-500">(Open to relocate to Bangkok for work.)</span>
              </p>
            </div>
          </div>

          <!-- LinkedIn -->
          <a
            href="https://www.linkedin.com/in/wave41205"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md"
          >
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white transition-transform duration-300 group-hover:scale-110 group-hover:from-blue-600 group-hover:to-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-6 w-6"
              >
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="mb-1 font-semibold text-slate-900">LinkedIn</h3>
              <p class="text-sm text-slate-600 transition-colors group-hover:text-blue-600">
                www.linkedin.com/in/wave41205
              </p>
            </div>
          </a>

          <!-- GitHub -->
          <a
            href="https://github.com/wpc41205"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-all duration-300 hover:border-slate-400 hover:bg-slate-100/50 hover:shadow-md"
          >
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white transition-transform duration-300 group-hover:scale-110 group-hover:from-slate-800 group-hover:to-slate-950"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-6 w-6"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="mb-1 font-semibold text-slate-900">GitHub</h3>
              <p class="text-sm text-slate-600 transition-colors group-hover:text-slate-700">
                https://github.com/wpc41205
              </p>
            </div>
          </a>

          <!-- Resume -->
          <a
            href="https://drive.google.com/drive/folders/1M9gLgVE_WeKQc0D1G7zoSasFU6bsouv2?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-all duration-300 hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-md"
          >
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 transition-transform duration-300 group-hover:scale-110 group-hover:from-amber-200 group-hover:to-amber-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-6 w-6"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="mb-1 font-semibold text-slate-900">Resume</h3>
              <p class="text-sm text-slate-600 transition-colors group-hover:text-amber-600">
                View my resume
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

