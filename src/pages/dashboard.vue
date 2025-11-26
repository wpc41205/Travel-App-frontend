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

const router = useRouter();
const { isAuthenticated } = useAuth();

const ownerId = ref<string | null>(getAuthToken());
const trips = ref<UserTrip[]>([]);
const isLoading = ref(true);
const isFormOpen = ref(false);
const isSubmitting = ref(false);
const editingTrip = ref<UserTrip | null>(null);
const errorMessage = ref<string | null>(null);

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

const openCreateForm = () => {
  editingTrip.value = null;
  resetForm();
  isFormOpen.value = true;
};

const openEditForm = (trip: UserTrip) => {
  editingTrip.value = trip;
  form.title = trip.title ?? "";
  form.description = trip.description ?? "";
  
  // Handle photos - can be string or array
  if (Array.isArray(trip.photos)) {
    form.photos = trip.photos.filter((p): p is string => typeof p === "string" && p.trim() !== "");
    form.image = trip.photos[0] ?? "";
    // Set additional photos (skip first one as it's in image field)
    additionalPhotosText.value = trip.photos.slice(1).join("\n");
  } else if (typeof trip.photos === "string" && trip.photos.trim()) {
    form.image = trip.photos;
    form.photos = [trip.photos];
    additionalPhotosText.value = "";
  } else {
    form.image = "";
    form.photos = [];
    additionalPhotosText.value = "";
  }
  
  form.latitude = (trip.latitude as string) || "";
  form.longitude = (trip.longitude as string) || "";
  
  // Handle tags
  if (Array.isArray(trip.tags)) {
    form.tags = trip.tags.filter((t): t is string => typeof t === "string" && t.trim() !== "");
    tagsText.value = form.tags.join(", ");
  } else if (typeof trip.tags === "string" && trip.tags.trim()) {
    form.tags = trip.tags.split(",").map(t => t.trim()).filter(t => t);
    tagsText.value = trip.tags;
  } else {
    form.tags = [];
    tagsText.value = "";
  }
  
  isFormOpen.value = true;
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

const handleDelete = async (trip: UserTrip) => {
  const id = ownerId.value;
  if (!id) return;
  const confirmed = window.confirm(`Delete the trip "${trip.title}"?`);
  if (!confirmed) return;

  try {
    await deleteUserTrip(id, trip.id);
    await loadTrips();
  } catch (error) {
    console.error(error);
    errorMessage.value = "We couldn’t delete this trip. Please try again.";
  }
};

const viewTrip = (trip: UserTrip) => {
  const identifier = getTripIdentifier(trip);
  if (!identifier) return;
  router.push({ name: "trip-detail", params: { tripId: identifier } });
};

const extractTags = (value: UserTrip["tags"]): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((tag): tag is string => typeof tag === "string" && tag.trim() !== "")
      .map((tag) => tag.trim());
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((tag) => tag.trim())
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

const totalTrips = computed(() => trips.value.length);

const taggedTripCount = computed(() =>
  trips.value.filter((trip) => extractTags(trip.tags).length > 0).length
);

const geoReadyCount = computed(() =>
  trips.value.filter(
    (trip) => formatCoordinates(trip.latitude, trip.longitude) !== "-"
  ).length
);

const photoInventory = computed(() =>
  trips.value.reduce((count, trip) => {
    if (Array.isArray(trip.photos)) {
      return (
        count +
        trip.photos.filter(
          (photo): photo is string => typeof photo === "string" && photo.trim() !== ""
        ).length
      );
    }

    if (typeof trip.photos === "string" && trip.photos.trim()) {
      return count + 1;
    }

    return count;
  }, 0)
);

const formatShare = (count: number): string => {
  const total = totalTrips.value;
  if (!total) return "0%";
  return `${Math.round((count / total) * 100)}%`;
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
  <section class="mx-auto flex w-full flex-col gap-8 px-4 py-8 lg:w-[80%] lg:px-0">
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
                {{ trip.description || "No description provided." }}
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
  </section>
</template>

