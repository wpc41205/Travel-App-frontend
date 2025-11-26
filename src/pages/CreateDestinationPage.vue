<script setup lang="ts">
// UI only - no logic
</script>

<template>
  <section class="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 lg:px-0">
    <header class="flex flex-col gap-3">
      <div>
        <a
          href="/dashboard"
          class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
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
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Dashboard
        </a>
      </div>
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Create New</p>
        <h1 class="text-3xl font-semibold text-slate-900">Add Destination</h1>
        <p class="text-sm text-slate-500">
          Share the details for the place you'd like to add to your travel collection.
        </p>
      </div>
    </header>

    <div
      class="rounded-3xl bg-white/95 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8"
    >
      <form class="grid gap-4 md:grid-cols-2">
        <label class="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-slate-600">
          Destination name *
          <input
            type="text"
            class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="e.g., Grand Palace"
          />
        </label>

        <label class="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-slate-600">
          Description
          <textarea
            rows="4"
            class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Tell us about this destination..."
          ></textarea>
        </label>

        <label class="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-600">
          Upload Image (Primary - 1 image only)
          <div class="relative w-fit">
            <input
              type="file"
              accept="image/*"
              class="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-0"
              id="primary-image-input"
            />
            <div class="flex aspect-square w-40 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-blue-400 hover:bg-blue-50/50">
              <div class="flex flex-col items-center gap-2 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-10 w-10 text-slate-400 transition-colors"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-slate-600 transition-colors">
                    Click to upload
                  </p>
                  <p class="text-xs text-slate-400">or drag and drop</p>
                </div>
              </div>
            </div>
          </div>
          <p class="text-xs text-slate-400">Upload one primary image (single image only)</p>
        </label>

        <label class="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-600">
          Additional Images (Optional)
          <div class="relative">
            <input
              type="file"
              accept="image/*"
              multiple
              class="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-0"
              id="additional-images-input"
            />
            <div class="flex aspect-square w-40 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-blue-400 hover:bg-blue-50/50">
              <div class="flex flex-col items-center gap-2 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-10 w-10 text-slate-400 transition-colors"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-slate-600 transition-colors">
                    Click to upload
                  </p>
                  <p class="text-xs text-slate-400">or drag and drop</p>
                </div>
              </div>
            </div>
          </div>
          <p class="text-xs text-slate-400">Upload additional images (all images will be stored on the server)</p>
        </label>

        <label class="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-slate-600">
          Tags (comma separated)
          <input
            type="text"
            class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="food, streetfood, bangkok"
          />
          <p class="text-xs text-slate-400">Example: food, streetfood, bangkok</p>
        </label>

        <div class="grid grid-cols-2 gap-3">
          <label class="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Latitude
            <input
              type="text"
              class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="13.7563"
            />
          </label>
          <label class="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Longitude
            <input
              type="text"
              class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="100.5018"
            />
          </label>
        </div>

        <div class="md:col-span-2 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Create Destination
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

