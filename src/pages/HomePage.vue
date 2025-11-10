<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import HeroHeader from "../components/HeroHeader.vue";
import LoadingState from "../components/LoadingState.vue";
import EmptyState from "../components/EmptyState.vue";
import TripList from "../components/TripList.vue";
import { getTrips, type Trip } from "../api";

const trips = ref<Trip[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  const data = await getTrips();
  trips.value = Array.isArray(data) ? data : [];
  isLoading.value = false;
});

const hasTrips = computed(() => trips.value.length > 0);
</script>

<template>
  <section class="flex w-full flex-1 flex-col gap-10 sm:gap-12">
    <HeroHeader />

    <div class="flex w-full flex-1 items-center justify-center">
      <LoadingState v-if="isLoading" />
      <EmptyState v-else-if="!hasTrips" />
      <TripList v-else :trips="trips" />
    </div>
  </section>
</template>

