<script setup lang="ts">
import { reactive, ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { createDestination, type CreateDestinationPayload } from "../api";

type DestinationForm = {
  name: string;
  description: string;
  tags: string;
  latitude: string;
  longitude: string;
};

const form = reactive<DestinationForm>({
  name: "",
  description: "",
  tags: "",
  latitude: "",
  longitude: "",
});

const errors = reactive<Record<keyof DestinationForm, string>>({
  name: "",
  description: "",
  tags: "",
  latitude: "",
  longitude: "",
});

const primaryImage = ref<File | null>(null);
const additionalImages = ref<File[]>([]);
const primaryImagePreview = ref<string | null>(null);
const additionalImagesPreview = ref<string[]>([]);
const isSubmitting = ref(false);
const serverError = ref("");
const serverSuccess = ref("");
const router = useRouter();

const validate = () => {
  errors.name = form.name.trim() ? "" : "Destination name is required";
  errors.latitude = form.latitude.trim() && !isNaN(Number(form.latitude)) 
    ? "" 
    : "Please enter a valid latitude";
  errors.longitude = form.longitude.trim() && !isNaN(Number(form.longitude)) 
    ? "" 
    : "Please enter a valid longitude";

  return !errors.name && !errors.latitude && !errors.longitude;
};

const handlePrimaryImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0 && target.files[0]) {
    // Clean up previous preview URL
    if (primaryImagePreview.value) {
      URL.revokeObjectURL(primaryImagePreview.value);
    }
    primaryImage.value = target.files[0];
    primaryImagePreview.value = URL.createObjectURL(target.files[0]);
  }
};

const handleAdditionalImagesChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    // Clean up previous preview URLs
    additionalImagesPreview.value.forEach(url => URL.revokeObjectURL(url));
    additionalImages.value = Array.from(target.files);
    additionalImagesPreview.value = Array.from(target.files).map(file => URL.createObjectURL(file));
  }
};

const removePrimaryImage = () => {
  if (primaryImagePreview.value) {
    URL.revokeObjectURL(primaryImagePreview.value);
  }
  primaryImage.value = null;
  primaryImagePreview.value = null;
  const primaryInput = document.getElementById("primary-image-input") as HTMLInputElement;
  if (primaryInput) primaryInput.value = "";
};

const removeAdditionalImage = (index: number) => {
  if (additionalImagesPreview.value[index]) {
    URL.revokeObjectURL(additionalImagesPreview.value[index]);
  }
  additionalImages.value.splice(index, 1);
  additionalImagesPreview.value.splice(index, 1);
  const additionalInput = document.getElementById("additional-images-input") as HTMLInputElement;
  if (additionalInput) additionalInput.value = "";
};

const handleCancel = () => {
  router.push("/dashboard");
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  serverError.value = "";
  serverSuccess.value = "";
  
  if (!validate()) {
    return;
  }

  isSubmitting.value = true;

  const payload: CreateDestinationPayload = {
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    tags: form.tags.trim() || undefined,
    latitude: form.latitude.trim() ? Number(form.latitude.trim()) : undefined,
    longitude: form.longitude.trim() ? Number(form.longitude.trim()) : undefined,
    ...(primaryImage.value && { primaryImage: primaryImage.value }),
    ...(additionalImages.value.length > 0 && { additionalImages: additionalImages.value }),
  };

  const { success, message } = await createDestination(payload);

  isSubmitting.value = false;

  if (!success) {
    serverError.value = message ?? "Failed to create destination. Please try again.";
    return;
  }

  serverSuccess.value = message ?? "Destination created successfully!";
  
  // Reset form
  form.name = "";
  form.description = "";
  form.tags = "";
  form.latitude = "";
  form.longitude = "";
  
  // Clean up preview URLs
  if (primaryImagePreview.value) {
    URL.revokeObjectURL(primaryImagePreview.value);
  }
  additionalImagesPreview.value.forEach(url => URL.revokeObjectURL(url));
  
  primaryImage.value = null;
  additionalImages.value = [];
  primaryImagePreview.value = null;
  additionalImagesPreview.value = [];
  
  // Reset file inputs
  const primaryInput = document.getElementById("primary-image-input") as HTMLInputElement;
  const additionalInput = document.getElementById("additional-images-input") as HTMLInputElement;
  if (primaryInput) primaryInput.value = "";
  if (additionalInput) additionalInput.value = "";

  // Redirect to dashboard after 2 seconds
  setTimeout(() => {
    router.push("/dashboard");
  }, 2000);
};

// Cleanup preview URLs when component unmounts
onBeforeUnmount(() => {
  if (primaryImagePreview.value) {
    URL.revokeObjectURL(primaryImagePreview.value);
  }
  additionalImagesPreview.value.forEach(url => URL.revokeObjectURL(url));
});
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
      <form class="grid gap-4 md:grid-cols-2" @submit.prevent="handleSubmit">
        <label class="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-slate-600">
          Destination name *
          <input
            v-model="form.name"
            type="text"
            class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="e.g., Grand Palace"
          />
          <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
        </label>

        <label class="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-slate-600">
          Description
          <textarea
            v-model="form.description"
            rows="4"
            class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Tell us about this destination..."
          ></textarea>
        </label>

        <label class="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-600">
          Upload Image (Primary - 1 image only)
          <div class="flex flex-wrap gap-4">
            <div class="relative w-fit">
              <input
                type="file"
                accept="image/*"
                class="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-0"
                id="primary-image-input"
                @change="handlePrimaryImageChange"
              />
              <div 
                v-if="!primaryImagePreview"
                class="flex aspect-square w-40 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-blue-400 hover:bg-blue-50/50"
              >
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
              <div 
                v-else
                class="relative group"
              >
                <img
                  :src="primaryImagePreview"
                  :alt="primaryImage?.name || 'Primary image preview'"
                  class="aspect-square w-40 rounded-2xl object-cover border-2 border-slate-200"
                />
                <button
                  type="button"
                  @click.stop="removePrimaryImage"
                  class="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove image"
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
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <p class="text-xs text-slate-400">Upload one primary image (single image only)</p>
        </label>

        <label class="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-600">
          Additional Images (Optional)
          <div class="flex flex-col gap-4">
            <div class="relative w-fit">
              <input
                type="file"
                accept="image/*"
                multiple
                class="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-0"
                id="additional-images-input"
                @change="handleAdditionalImagesChange"
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
            <div v-if="additionalImagesPreview.length > 0" class="flex flex-wrap gap-4">
              <div
                v-for="(preview, index) in additionalImagesPreview"
                :key="index"
                class="relative group"
              >
                <img
                  :src="preview"
                  :alt="additionalImages[index]?.name || `Additional image ${index + 1}`"
                  class="aspect-square w-40 rounded-2xl object-cover border-2 border-slate-200"
                />
                <button
                  type="button"
                  @click="removeAdditionalImage(index)"
                  class="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove image"
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
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <p class="text-xs text-slate-400">Upload additional images (all images will be stored on the server)</p>
        </label>

        <label class="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-slate-600">
          Tags (comma separated)
          <input
            v-model="form.tags"
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
              v-model="form.latitude"
              type="text"
              class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="13.7563"
            />
            <p v-if="errors.latitude" class="text-xs text-red-500">{{ errors.latitude }}</p>
          </label>
          <label class="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Longitude
            <input
              v-model="form.longitude"
              type="text"
              class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="100.5018"
            />
            <p v-if="errors.longitude" class="text-xs text-red-500">{{ errors.longitude }}</p>
          </label>
        </div>

        <div class="md:col-span-2 flex flex-col gap-3 pt-2">
          <div v-if="serverError" class="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ serverError }}
          </div>
          <div v-if="serverSuccess" class="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {{ serverSuccess }}
          </div>
          <div class="flex items-center justify-end gap-3">
            <button
              type="button"
              class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
              @click="handleCancel"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">Creating...</span>
              <span v-else>Create Destination</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

