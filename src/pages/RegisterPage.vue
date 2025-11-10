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
  errors.fullName = form.fullName.trim() ? "" : "กรุณากรอกชื่อ-นามสกุล";
  errors.email = /\S+@\S+\.\S+/.test(form.email)
    ? ""
    : "กรุณากรอกอีเมลให้ถูกต้อง";
  errors.password =
    form.password.length >= 8
      ? ""
      : "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";

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
    serverError.value = message ?? "การลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
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
    class="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 rounded-3xl border border-slate-200 bg-white/70 px-6 py-10 shadow-lg backdrop-blur-sm sm:px-10"
  >
    <header class="space-y-3 text-center sm:text-left">
      <p class="text-sm font-semibold uppercase tracking-widest text-blue-500">
        สมัครสมาชิก
      </p>
      <h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        เริ่มต้นวางแผนการเดินทางในฝันกับเรา
      </h1>
      <p class="text-base text-slate-600 sm:max-w-xl">
        สร้างบัญชีเพื่อบันทึกทริปที่คุณชอบ รับคำแนะนำเฉพาะตัว และอัปเดตโปรโมชั่นใหม่ล่าสุดก่อนใคร
      </p>
    </header>

    <form class="grid gap-7" @submit.prevent="handleSubmit">
      <div class="grid gap-2">
        <label for="fullName" class="text-sm font-medium text-slate-700">
          ชื่อ-นามสกุล
        </label>
        <input
          id="fullName"
          v-model="form.fullName"
          type="text"
          placeholder="เช่น กมลชนก จันทรัตน์"
          class="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <p v-if="errors.fullName" class="text-sm text-red-500">
          {{ errors.fullName }}
        </p>
      </div>

      <div class="grid gap-2">
        <label for="email" class="text-sm font-medium text-slate-700">
          อีเมล
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="you@example.com"
          class="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <p v-if="errors.email" class="text-sm text-red-500">
          {{ errors.email }}
        </p>
      </div>

      <div class="grid gap-2">
        <label for="password" class="text-sm font-medium text-slate-700">
          รหัสผ่าน
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="รหัสผ่านอย่างน้อย 8 ตัว"
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
        class="inline-flex items-center justify-center gap-2 rounded-full border border-blue-500 bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:border-blue-600 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500 w-[200px] h-[50px] self-center justify-self-center"
        :disabled="isSubmitting"
      >
        <span v-if="!isSubmitting">สร้างบัญชี</span>
        <span v-else>กำลังดำเนินการ...</span>
      </button>

      <p v-if="isSuccess" class="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        ลงทะเบียนสำเร็จ! โปรดตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี
      </p>
    </form>
  </section>
</template>

