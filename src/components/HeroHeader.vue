<script setup lang="ts">
import meImage from "../assets/me1.jpg";
</script>

<template>
  <div class="relative mx-auto w-full lg:w-[80%]">
    <!-- Hero Section with Background -->
    <div
      class="relative h-[500px] overflow-hidden sm:h-[600px]"
      style="background-image: url('https://cbtthailand.dasta.or.th/upload-file-api/Resources/RelateAttraction/Images/RAT770066/1.jpeg'); background-size: cover; background-position: center; background-repeat: no-repeat;"
    >

      <!-- Text Overlay -->
      <div class="relative z-10 w-full flex h-full flex-col justify-start pl-8 pr-8 pt-8 pb-8 text-left sm:pl-12 sm:pr-12 sm:pt-12 sm:pb-12">
        <h1
          class="mb-3 text-5xl font-bold leading-tight text-white drop-shadow-lg sm:text-6xl md:text-7xl"
        >
          Travel Explorer
        </h1>
        <p
          class="max-w-2xl text-lg font-light leading-relaxed text-white/95 drop-shadow-md sm:text-xl"
        >
        Welcome to Travel Explorer, your guide to the world's most beautiful destinations. Find inspiring travel guides, from magnificent cityscapes to tropical paradises.
        </p>
      </div>
    </div>

    <!-- Content Section with Image and Text -->
    <div class="relative -mt-[200px] sm:-mt-[250px] md:-mt-[300px] mx-auto w-full flex flex-col gap-6 pl-0 pr-4 sm:flex-row sm:items-end sm:gap-8 sm:pr-0">
      <!-- Embedded Image -->
      <div class="relative z-20 shrink-0 ml-8 sm:ml-12 sm:w-80 md:w-96">
        <img
          :src="meImage"
          alt="Travel Explorer"
          class="h-auto w-full sm:h-[500px] md:h-[600px] sm:w-80 md:w-96 sm:object-cover"
        />
      </div>

      <!-- Introductory Text Section -->
      <div class="relative z-10 sm:ml-8">
        <div class="px-6 pt-2 pb-8 sm:px-8 sm:pt-2 sm:pb-10">
          <h2 class="mb-4 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            Hi, welcome to Travel Explorer 👋
          </h2>
          <p class="text-base leading-relaxed text-slate-600 sm:text-lg">
            I've created a website for travel recommendations. Here, you will receive a special experience from our blog, which is filled with inspiration and carefully curated travel tips so you can create your own unforgettable journeys. Have fun discovering and enjoy every step of the adventure!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

