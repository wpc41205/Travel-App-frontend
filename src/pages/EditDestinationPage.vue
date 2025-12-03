<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { api, updateDestination, type UpdateDestinationPayload } from "../api";
import type { UserTrip } from "../services/userTrips";

const router = useRouter();
const route = useRoute();

// Helper refs for form inputs
const tagsText = ref("");

const form = reactive({
  name: "",
  description: "",
  latitude: "",
  longitude: "",
});

const trip = ref<UserTrip | null>(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);
const serverSuccess = ref("");

// Image handling
const primaryImage = ref<File | null>(null);
const additionalImages = ref<File[]>([]);
const primaryImagePreview = ref<string | null>(null);
const additionalImagesPreview = ref<string[]>([]);
const existingPrimaryImageUrl = ref<string | null>(null);
const existingAdditionalImageUrls = ref<string[]>([]);

const errors = reactive({
  title: "",
  latitude: "",
  longitude: "",
});

const validate = () => {
  errors.title = form.name.trim() ? "" : "Destination name is required";
  errors.latitude = (typeof form.latitude === "string" && form.latitude.trim() && !isNaN(Number(form.latitude))) 
    ? "" 
    : "Please enter a valid latitude";
  errors.longitude = (typeof form.longitude === "string" && form.longitude.trim() && !isNaN(Number(form.longitude))) 
    ? "" 
    : "Please enter a valid longitude";

  return !errors.title && !errors.latitude && !errors.longitude;
};

const handlePrimaryImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0 && target.files[0]) {
    // Clean up previous preview URL
    if (primaryImagePreview.value && !primaryImagePreview.value.startsWith("http")) {
      URL.revokeObjectURL(primaryImagePreview.value);
    }
    primaryImage.value = target.files[0];
    primaryImagePreview.value = URL.createObjectURL(target.files[0]);
    existingPrimaryImageUrl.value = null; // Clear existing URL when new file is selected
  }
};

const handleAdditionalImagesChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    // Clean up previous preview URLs
    additionalImagesPreview.value.forEach(url => {
      if (!url.startsWith("http")) {
        URL.revokeObjectURL(url);
      }
    });
    additionalImages.value = Array.from(target.files);
    additionalImagesPreview.value = Array.from(target.files).map(file => URL.createObjectURL(file));
    existingAdditionalImageUrls.value = []; // Clear existing URLs when new files are selected
  }
};

const removePrimaryImage = () => {
  if (primaryImagePreview.value && !primaryImagePreview.value.startsWith("http")) {
    URL.revokeObjectURL(primaryImagePreview.value);
  }
  primaryImage.value = null;
  primaryImagePreview.value = null;
  existingPrimaryImageUrl.value = null;
  const primaryInput = document.getElementById("primary-image-input") as HTMLInputElement;
  if (primaryInput) primaryInput.value = "";
};

const removeAdditionalImage = (index: number) => {
  if (additionalImagesPreview.value[index] && !additionalImagesPreview.value[index].startsWith("http")) {
    URL.revokeObjectURL(additionalImagesPreview.value[index]);
  }
  additionalImages.value.splice(index, 1);
  additionalImagesPreview.value.splice(index, 1);
  existingAdditionalImageUrls.value.splice(index, 1);
  const additionalInput = document.getElementById("additional-images-input") as HTMLInputElement;
  if (additionalInput) additionalInput.value = "";
};

const loadTrip = async () => {
  const tripId = route.params.tripId as string;
  if (!tripId) {
    errorMessage.value = "Trip ID is required";
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    const response = await api.get<UserTrip>(`/trips/${tripId}`);
    trip.value = response.data;
    
    // Populate form with trip data
    form.name = trip.value.title ?? "";
    form.description = trip.value.description ?? "";
    
    // Handle photos - can be string or array
    if (Array.isArray(trip.value.photos)) {
      const photoUrls = trip.value.photos.filter((p): p is string => typeof p === "string" && p.trim() !== "");
      if (photoUrls.length > 0) {
        existingPrimaryImageUrl.value = photoUrls[0] || null;
        primaryImagePreview.value = photoUrls[0] || null;
        if (photoUrls.length > 1) {
          existingAdditionalImageUrls.value = photoUrls.slice(1);
          additionalImagesPreview.value = photoUrls.slice(1);
        }
      }
    } else if (typeof trip.value.photos === "string" && trip.value.photos.trim()) {
      existingPrimaryImageUrl.value = trip.value.photos;
      primaryImagePreview.value = trip.value.photos;
    }
    
    form.latitude = String(trip.value.latitude || "");
    form.longitude = String(trip.value.longitude || "");
    
    // Handle tags - clean special characters
    const cleanTag = (tag: string): string => {
      return tag.replace(/[\[\]""''(){}]/g, "").trim();
    };
    
    let tagsArray: string[] = [];
    if (Array.isArray(trip.value.tags)) {
      tagsArray = trip.value.tags
        .filter((t): t is string => typeof t === "string" && t.trim() !== "")
        .map(t => cleanTag(t));
    } else if (typeof trip.value.tags === "string" && trip.value.tags.trim()) {
      tagsArray = trip.value.tags
        .split(/[,|]/)
        .map(t => cleanTag(t))
        .filter(t => t);
    }
    tagsText.value = tagsArray.join(", ");
  } catch (error: any) {
    console.error("Error loading trip:", error);
    errorMessage.value = error.response?.data?.message || error.message || "Failed to load trip";
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  router.push("/dashboard");
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  errorMessage.value = null;
  serverSuccess.value = "";
  
  if (!validate()) {
    return;
  }

  if (!trip.value) {
    errorMessage.value = "Trip data is missing.";
    return;
  }

  isSubmitting.value = true;

  try {
    // Process tags from text input - clean special characters
    const cleanTag = (tag: string): string => {
      return tag.replace(/[\[\]""''(){}]/g, "").trim();
    };
    
    const tagsArray = tagsText.value
      .split(",")
      .map(tag => cleanTag(tag))
      .filter(tag => tag);
    
    const payload: UpdateDestinationPayload = {
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray.join(", ") : undefined,
      latitude: (typeof form.latitude === "string" && form.latitude.trim()) ? Number(form.latitude.trim()) : undefined,
      longitude: (typeof form.longitude === "string" && form.longitude.trim()) ? Number(form.longitude.trim()) : undefined,
      // If new image is selected, use it; otherwise, keep existing image URL
      ...(primaryImage.value 
        ? { primaryImage: primaryImage.value } 
        : existingPrimaryImageUrl.value 
          ? { existingPrimaryImageUrl: existingPrimaryImageUrl.value } 
          : {}),
      // If new additional images are selected, use them; otherwise, keep existing image URLs
      ...(additionalImages.value.length > 0 
        ? { additionalImages: additionalImages.value } 
        : existingAdditionalImageUrls.value.length > 0 
          ? { existingAdditionalImageUrls: existingAdditionalImageUrls.value } 
          : {}),
    };

    const { success, message } = await updateDestination(trip.value.id, payload);

    if (!success) {
      errorMessage.value = message ?? "Failed to update destination. Please try again.";
      return;
    }

    serverSuccess.value = message ?? "Destination updated successfully!";
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error.response?.data?.message || "We couldn't save your changes. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadTrip();
});

// Cleanup preview URLs when component unmounts
onBeforeUnmount(() => {
  if (primaryImagePreview.value && !primaryImagePreview.value.startsWith("http")) {
    URL.revokeObjectURL(primaryImagePreview.value);
  }
  additionalImagesPreview.value.forEach(url => {
    if (!url.startsWith("http")) {
      URL.revokeObjectURL(url);
    }
  });
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
        <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Edit Destination</p>
        <h1 class="text-3xl font-semibold text-slate-900">Edit Destination</h1>
        <p class="text-sm text-slate-500">
          Update the details for this destination.
        </p>
      </div>
    </header>

    <div v-if="isLoading" class="py-10 text-center text-sm text-slate-500">
      Loading destination...
    </div>

    <div
      v-else-if="trip"
      class="rounded-3xl bg-white/95 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8"
    >
      <form class="grid gap-4 md:grid-cols-2" @submit.prevent="handleSubmit">
        <label class="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-slate-600">
          Destination name *
          <input
            v-model="form.name"
            type="text"
            required
            class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="e.g., Grand Palace"
          />
          <p v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</p>
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
            v-model="tagsText"
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
          <div v-if="errorMessage" class="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ errorMessage }}
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
              <span v-if="isSubmitting">Updating...</span>
              <span v-else>Update Destination</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <div v-else class="py-10 text-center text-sm text-red-500">
      {{ errorMessage || "Trip not found" }}
    </div>
  </section>
</template>

