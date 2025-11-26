<script setup lang="ts">
import { reactive, ref } from "vue";

type FormState = {
  fullName: string;
  email: string;
  password: string;
};

import { register, type RegisterPayload } from "../api";

const form = reactive<FormState>({
  fullName: "",
  email: "",
  password: "",
});

const errors = reactive<Record<keyof FormState, string>>({
  fullName: "",
  email: "",
  password: "",
});

const isSubmitting = ref(false);
const isSuccess = ref(false);
const serverError = ref("");

const validate = () => {
  errors.fullName = form.fullName.trim() ? "" : "Please enter your full name";
  errors.email = /\S+@\S+\.\S+/.test(form.email)
    ? ""
    : "Please enter a valid email address";
  errors.password =
    form.password.length >= 8
      ? ""
      : "Passwords must be at least 8 characters long";

  return Object.values(errors).every((message) => message === "");
};

const resetMessages = () => {
  isSuccess.value = false;
  serverError.value = "";
};

const handleSubmit = async () => {
  resetMessages();
  if (!validate()) {
    return;
  }

  isSubmitting.value = true;

  const payload: RegisterPayload = {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    password: form.password,
  };

  const { success, message } = await register(payload);

  isSubmitting.value = false;

  if (!success) {
    serverError.value =
      message ?? "Registration failed. Please try again in a moment.";
    return;
  }

  isSuccess.value = true;
  form.fullName = "";
  form.email = "";
  form.password = "";
};
</script>

<template>
  <section
    class="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 rounded-3xl border border-slate-200 bg-white/70 px-6 py-8 shadow-lg backdrop-blur-sm sm:px-10 sm:py-10"
  >
    <header class="space-y-3 text-center">
      <p class="text-3xl font-bold tracking-tight text-blue-500 sm:text-4xl">
        Create an Account
      </p>
      <h1 class="text-sm font-medium text-slate-600 sm:text-lg">
        Start planning your dream trip with us
      </h1>
    </header>

    <form class="grid gap-3" @submit.prevent="handleSubmit">
      <div class="grid gap-2">
        <label for="fullName" class="text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="fullName"
          v-model="form.fullName"
          type="text"
          placeholder="Enter your full name"
          class="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <p v-if="errors.fullName" class="text-sm text-red-500">
          {{ errors.fullName }}
        </p>
      </div>

      <div class="grid gap-2">
        <label for="email" class="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Enter your email"
          class="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <p v-if="errors.email" class="text-sm text-red-500">
          {{ errors.email }}
        </p>
      </div>

      <div class="grid gap-2">
        <label for="password" class="text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Choose a password (min 8 characters)"
          class="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <p v-if="errors.password" class="text-sm text-red-500">
          {{ errors.password }}
        </p>
      </div>

      <p v-if="serverError" class="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
        {{ serverError }}
      </p>

      <button
        type="submit"
        class="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-blue-500 bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:border-blue-600 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500 w-[200px] h-[46px] self-center justify-self-center"
        :disabled="isSubmitting"
      >
        <span v-if="!isSubmitting">Sign up</span>
        <span v-else>Submitting...</span>
      </button>

      <p v-if="isSuccess" class="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        Registration successful! Please check your inbox to verify your account.
      </p>
    </form>
  </section>
</template>
