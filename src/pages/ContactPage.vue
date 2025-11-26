<script setup lang="ts">
import { reactive, ref } from "vue";

const form = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const errors = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const isSubmitting = ref(false);
const isSuccess = ref(false);

const validate = () => {
  errors.name = form.name.trim() ? "" : "Name is required";
  errors.email = /\S+@\S+\.\S+/.test(form.email) ? "" : "Please enter a valid email";
  errors.subject = form.subject.trim() ? "" : "Subject is required";
  errors.message = form.message.trim() ? "" : "Message is required";

  return !errors.name && !errors.email && !errors.subject && !errors.message;
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  isSuccess.value = false;

  if (!validate()) {
    return;
  }

  isSubmitting.value = true;

  // Simulate form submission
  await new Promise((resolve) => setTimeout(resolve, 1000));

  isSubmitting.value = false;
  isSuccess.value = true;
  form.name = "";
  form.email = "";
  form.subject = "";
  form.message = "";
};
</script>

<template>
  <section class="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-[80%]">
    <div class="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg sm:p-12">
      <header class="mb-8 text-center">
        <h1 class="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">Contact Us</h1>
        <p class="text-lg text-slate-600">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as
          soon as possible.
        </p>
      </header>

      <div class="grid gap-8 md:grid-cols-2">
        <div class="space-y-6">
          <div>
            <h2 class="mb-4 text-2xl font-semibold text-slate-900">Get in Touch</h2>
            <p class="mb-6 text-slate-600 leading-relaxed">
              Whether you have a question about features, need help, or want to provide
              feedback, we're here to help.
            </p>

            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-5 w-5"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900">Email</h3>
                  <p class="text-slate-600">contact@travelexplorer.com</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-5 w-5"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900">Phone</h3>
                  <p class="text-slate-600">+1 (555) 123-4567</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-5 w-5"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900">Address</h3>
                  <p class="text-slate-600">123 Travel Street, Adventure City, AC 12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <form @submit="handleSubmit" class="space-y-4">
            <div>
              <label for="name" class="mb-1 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Your name"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
            </div>

            <div>
              <label for="email" class="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="your.email@example.com"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
            </div>

            <div>
              <label for="subject" class="mb-1 block text-sm font-medium text-slate-700">
                Subject
              </label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                required
                class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="What's this about?"
              />
              <p v-if="errors.subject" class="mt-1 text-sm text-red-500">
                {{ errors.subject }}
              </p>
            </div>

            <div>
              <label for="message" class="mb-1 block text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                required
                class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Tell us more..."
              ></textarea>
              <p v-if="errors.message" class="mt-1 text-sm text-red-500">
                {{ errors.message }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full rounded-full bg-gradient-to-r from-blue-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-600 hover:to-sky-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span v-if="!isSubmitting">Send Message</span>
              <span v-else>Sending...</span>
            </button>

            <div
              v-if="isSuccess"
              class="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              Thank you! Your message has been sent successfully. We'll get back to you soon.
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

