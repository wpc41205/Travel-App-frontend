<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { getTripIdentifier } from "../utils/tripIdentifier";
import {
  createUserTrip,
  deleteUserTrip,
  getUserTrips,
  updateUserTrip,
  type UserTrip,
  type UserTripInput,
} from "../services/userTrips";
import { getAuthToken, useAuth } from "../composables/useAuth";
import ConfirmDialog from "../components/ConfirmDialog.vue";

const router = useRouter();
const { isAuthenticated } = useAuth();

const ownerId = ref<string | null>(getAuthToken());
const trips = ref<UserTrip[]>([]);
const isLoading = ref(true);
const isFormOpen = ref(false);
const isSubmitting = ref(false);
const editingTrip = ref<UserTrip | null>(null);
const errorMessage = ref<string | null>(null);
const showDeleteConfirm = ref(false);
const tripToDelete = ref<UserTrip | null>(null);

// Helper refs for form inputs
const additionalPhotosText = ref("");
const tagsText = ref("");

const form = reactive<UserTripInput>({
  title: "",
  description: "",
  image: "",
  photos: [],
  latitude: "",
  longitude: "",
  tags: [],
});

const hasTrips = computed(() => trips.value.length > 0);

const resetForm = () => {
  form.title = "";
  form.description = "";
  form.image = "";
  form.photos = [];
  form.latitude = "";
  form.longitude = "";
  form.tags = [];
  additionalPhotosText.value = "";
  tagsText.value = "";
};

const syncOwnerId = () => {
  const newOwnerId = getAuthToken();
  ownerId.value = newOwnerId;
};

watch(isAuthenticated, () => {
  syncOwnerId();
  loadTrips();
});

const loadTrips = async () => {
  const id = ownerId.value;
  
  if (!id) {
    trips.value = [];
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;
  
  try {
    const fetchedTrips = await getUserTrips(id);
    trips.value = fetchedTrips;
  } catch (error: any) {
    console.error("Error in loadTrips:", error);
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Unable to load your trips right now.";
    errorMessage.value = errorMsg;
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
  } finally {
    isLoading.value = false;
  }
};

const openEditForm = (trip: UserTrip) => {
  const identifier = getTripIdentifier(trip);
  if (!identifier) {
    errorMessage.value = "Cannot edit this trip. Missing trip identifier.";
    return;
  }
  router.push({ name: "edit-destination", params: { tripId: identifier } });
};

const closeForm = () => {
  isFormOpen.value = false;
  editingTrip.value = null;
  resetForm();
};

// Helper function to extract authorId from token if it's a JWT
const extractAuthorId = (token: string | null): number | undefined => {
  if (!token) return undefined;
  
  try {
    // Try to decode JWT token (if it's a JWT)
    const parts = token.split(".");
    if (parts.length === 3 && parts[1]) {
      const decoded = atob(parts[1]);
      if (decoded) {
        const payload = JSON.parse(decoded);
        if (payload.userId || payload.id || payload.user_id) {
          return Number(payload.userId || payload.id || payload.user_id);
        }
      }
    }
  } catch (e) {
    // Not a JWT or can't decode, try to parse as number directly
    const numId = Number(token);
    if (!isNaN(numId)) {
      return numId;
    }
  }
  
  return undefined;
};

const handleSubmit = async () => {
  const id = ownerId.value;
  if (!id) return;

  if (!form.title.trim()) {
    errorMessage.value = "Please provide the destination name.";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = null;

  try {
    // Process additional photos from textarea
    const additionalPhotos = additionalPhotosText.value
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && line.startsWith("http"));
    
    // Combine image and additional photos
    form.photos = [];
    if (form.image?.trim()) {
      form.photos.push(form.image.trim());
    }
    form.photos.push(...additionalPhotos);
    
    // Process tags from text input
    form.tags = tagsText.value
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag);
    
    // Try to extract authorId from token
    const authorId = extractAuthorId(id) || form.authorId;
    
    if (editingTrip.value) {
      await updateUserTrip(id, editingTrip.value.id, form, authorId);
    } else {
      await createUserTrip(id, form, authorId);
    }
    await loadTrips();
    closeForm();
  } catch (error) {
    console.error(error);
    errorMessage.value = "We couldn’t save your changes. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = (trip: UserTrip) => {
  tripToDelete.value = trip;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  const id = ownerId.value;
  const trip = tripToDelete.value;
  
  if (!id || !trip) return;

  try {
    await deleteUserTrip(id, trip.id);
    await loadTrips();
    tripToDelete.value = null;
  } catch (error) {
    console.error(error);
    errorMessage.value = "We couldn't delete this trip. Please try again.";
  } finally {
    showDeleteConfirm.value = false;
  }
};

const cancelDelete = () => {
  tripToDelete.value = null;
  showDeleteConfirm.value = false;
};

const deleteConfirmMessage = computed(() => {
  if (!tripToDelete.value || !tripToDelete.value.title) {
    return "";
  }
  return `Delete the trip "${tripToDelete.value.title}"?`;
});

const viewTrip = (trip: UserTrip) => {
  const identifier = getTripIdentifier(trip);
  if (!identifier) return;
  router.push({ name: "trip-detail", params: { tripId: identifier } });
};

const cleanTag = (tag: string): string => {
  // Remove special characters like brackets, quotes, etc. and keep only text
  return tag
    .replace(/[\[\]""''(){}]/g, "") // Remove brackets, quotes, parentheses, braces
    .trim();
};

const extractTags = (value: UserTrip["tags"]): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((tag): tag is string => typeof tag === "string" && tag.trim() !== "")
      .map((tag) => cleanTag(tag))
      .filter((tag) => tag !== "");
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[,|]/)
      .map((tag) => cleanTag(tag))
      .filter((tag) => tag !== "");
  }
  return [];
};

const formatCoordinates = (
  latitude: UserTrip["latitude"],
  longitude: UserTrip["longitude"]
): string => {
  const lat = typeof latitude === "number" ? latitude : latitude?.toString().trim();
  const lng = typeof longitude === "number" ? longitude : longitude?.toString().trim();
  if (!lat && !lng) return "-";
  if (lat && lng) return `${lat}, ${lng}`;
  return lat ? `${lat}` : `${lng}`;
};

const formatDate = (value?: string | number | Date | null) => {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "-";
  }
};

const truncateDescription = (text: string | null | undefined, maxLength: number = 80): string => {
  if (!text) return "No description provided.";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

onMounted(async () => {
  syncOwnerId();
  
  // Wait a bit to ensure token is loaded
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Sync again in case token was loaded asynchronously
  syncOwnerId();
  
  await loadTrips();
});
</script>

<template>
  <section class="mx-auto flex w-full flex-col gap-8 px-4 py-8 lg:w-[75%] lg:px-0">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Dashboard</p>
        <h1 class="text-3xl font-semibold text-slate-900">Manage My Destinations</h1>
        <p class="text-sm text-slate-500">
          Create, edit, or remove the trips you own from this view.
        </p>
      </div>
      <RouterLink
        to="/destinations/create"
        class="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition-colors"
      >
        Add destination
      </RouterLink>
    </header>

    <div class="">
      <div v-if="isLoading" class="py-10 text-center text-sm text-slate-500">
        Loading your destinations...
      </div>
      <div v-else-if="!hasTrips" class="py-10 text-center text-sm text-slate-500">
        You haven’t created any destinations yet.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100 text-sm text-slate-600">
          <thead class="bg-slate-50/70 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
            <tr>
              <th class="px-4 py-3 text-left">Photo</th>
              <th class="px-4 py-3 text-left">Trip name</th>
              <th class="px-4 py-3 text-left">Description</th>
              <th class="px-4 py-3 text-left">Tags</th>
              <th class="px-4 py-3 text-left">Coordinates</th>
              <th class="px-4 py-3 text-left">Last updated</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="trip in trips"
              :key="trip.id"
              class="align-top transition-colors duration-200 hover:bg-slate-50/80"
            >
              <td class="px-4 py-4">
                <img
                  :src="Array.isArray(trip.photos) ? trip.photos[0] : ''"
                  :alt="trip.title ?? 'thumbnail'"
                  class="h-20 w-24 rounded-2xl object-cover shadow-sm ring-1 ring-slate-200/70"
                />
              </td>
              <td class="px-4 py-4">
                <button
                  type="button"
                  class="text-left text-base font-semibold text-slate-900 underline-offset-4 transition hover:text-blue-600 hover:underline"
                  @click="viewTrip(trip)"
                >
                  {{ trip.title }}
                </button>
              </td>
              <td class="px-4 py-4 max-w-[220px] text-sm text-slate-500">
                {{ truncateDescription(trip.description) }}
              </td>
              <td class="px-4 py-4 text-sm text-slate-600">
                <div
                  v-if="extractTags(trip.tags).length"
                  class="flex flex-wrap gap-2"
                >
                  <span
                    v-for="tag in extractTags(trip.tags)"
                    :key="`${trip.id}-${tag}`"
                    class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm"
                  >
                    {{ tag }}
                  </span>
                </div>
                <span v-else class="text-xs text-slate-400">No tags yet</span>
              </td>
              <td class="px-4 py-4 text-sm text-slate-600">
                <span
                  v-if="formatCoordinates(trip.latitude, trip.longitude) !== '-'"
                  class="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm"
                >
                  {{ formatCoordinates(trip.latitude, trip.longitude) }}
                </span>
                <span v-else class="text-xs text-slate-400">No coordinates</span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-500">
                {{ formatDate(trip.updatedAt) }}
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center justify-end gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    class="rounded-full bg-slate-100 px-4 py-1.5 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                    @click="openEditForm(trip)"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    class="rounded-full bg-red-50 px-4 py-1.5 text-red-600 transition hover:bg-red-100 hover:text-red-700"
                    @click="handleDelete(trip)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="isFormOpen"
      class="rounded-3xl bg-white/95 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
    >
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-slate-900">
            {{ editingTrip ? "Edit destination" : "Add a new destination" }}
          </h2>
          <p class="text-sm text-slate-500">Share the details for the place you’d like to manage.</p>
        </div>
        <button
          type="button"
          class="text-sm font-semibold text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
          @click="closeForm"
        >
          Close
        </button>
      </div>

      <form class="grid gap-4 md:grid-cols-2" @submit.prevent="handleSubmit">
        <label class="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Destination name *
          <input
            v-model="form.title"
            type="text"
            required
            class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <label class="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Description
          <textarea
            v-model="form.description"
            rows="4"
            class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          ></textarea>
        </label>

        <label class="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-slate-600">
          Primary image URL
          <input
            v-model="form.image"
            type="url"
            class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="https://"
          />
        </label>

        <label class="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-slate-600">
          Additional image URLs (one per line)
          <textarea
            v-model="additionalPhotosText"
            rows="3"
            class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          ></textarea>
          <p class="text-xs text-slate-400">List one direct image link per line.</p>
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
            />
          </label>
          <label class="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Longitude
            <input
              v-model="form.longitude"
              type="text"
              class="rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
        </div>

        <div class="md:col-span-2 flex items-center justify-end gap-3">
          <button
            type="button"
            class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
            @click="closeForm"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Saving..." : "Save" }}
          </button>
        </div>
      </form>

      <p v-if="errorMessage" class="mt-3 text-sm text-red-500">{{ errorMessage }}</p>
    </div>

    <ConfirmDialog
      :is-open="showDeleteConfirm"
      title=""
      :message="deleteConfirmMessage"
      confirm-text="OK"
      cancel-text="Cancel"
      confirm-button-class="bg-[#8B4513] hover:bg-[#654321] text-white border border-white"
      cancel-button-class="bg-orange-100 hover:bg-orange-200 text-orange-800"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      @close="cancelDelete"
    />
  </section>
</template>

