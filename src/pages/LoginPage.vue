<script setup lang="ts">
import { reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { login, type LoginPayload } from "../api";
import { useAuth } from "../composables/useAuth";

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

const form = reactive<LoginForm>({
  email: "",
  password: "",
  remember: false,
});

const errors = reactive<Record<keyof LoginForm, string>>({
  email: "",
  password: "",
  remember: "",
});

const isSubmitting = ref(false);
const isSuccess = ref(false);
const serverError = ref("");
const router = useRouter();
const { login: saveAuthState, logout: clearAuthState, sync: syncAuthState } = useAuth();

const validate = () => {
  errors.email = /\S+@\S+\.\S+/.test(form.email)
    ? ""
    : "กรุณากรอกอีเมลให้ถูกต้อง";
  errors.password = form.password ? "" : "กรุณากรอกรหัสผ่าน";

  return !errors.email && !errors.password;
};

const resetForm = () => {
  form.email = "";
  form.password = "";
  form.remember = false;
};

const handleSubmit = async () => {
  isSuccess.value = false;
  serverError.value = "";
  if (!validate()) {
    return;
  }

  isSubmitting.value = true;

  const payload: LoginPayload = {
    email: form.email.trim(),
    password: form.password,
  };

  const { success, message, token } = await login(payload);

  isSubmitting.value = false;

  if (!success) {
    serverError.value = message ?? "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
    return;
  }

  if (!token) {
    console.warn("No token received from API response");
    serverError.value = "ไม่ได้รับ token จากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
    return;
  }

  saveAuthState(token, form.remember);
  syncAuthState();

  isSuccess.value = true;
  await router.push("/");
};

const handleLogout = () => {
  clearAuthState();
  syncAuthState();
  resetForm();
  isSuccess.value = false;
};
</script>

<template>
  <section
    class="mx-auto flex h-[50px] w-full max-w-xl flex-col gap-3 rounded-3xl border border-slate-200 bg-white/80 px-4 py-4 shadow-lg backdrop-blur-sm"
  >
    <header class="space-y-3 text-center">
      <p class="text-3xl font-bold tracking-tight text-blue-500 sm:text-4xl">
        เข้าสู่ระบบ
      </p>
      <h1 class="text-sm font-medium text-slate-600 sm:text-lg">
        ยินดีต้อนรับ เข้าสู่เที่ยวไหนดี
      </h1>
    </header>

    <form class="grid gap-4" @submit.prevent="handleSubmit">
      <div class="grid gap-3">
        <div class="grid gap-2">
          <label for="email" class="text-sm font-medium text-slate-700">
            อีเมล
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="กรอกอีเมลของคุณ"
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
            placeholder="กรอกรหัสผ่านของคุณ"
            class="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <p v-if="errors.password" class="text-sm text-red-500">
            {{ errors.password }}
          </p>
        </div>
      </div>

      <label class="flex items-center gap-3 text-sm text-slate-600">
        <input
          v-model="form.remember"
          type="checkbox"
          class="h-4 w-4 rounded border-slate-300 text-blue-500 focus:ring-blue-400"
        />
        <span>จดจำฉันในครั้งถัดไป</span>
      </label>

      <button
        :type="isSuccess ? 'button' : 'submit'"
        :class="[
          'mt-1 inline-flex h-[46px] w-[200px] items-center justify-center gap-2 self-center justify-self-center rounded-full border px-6 py-3 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500',
          isSuccess
            ? 'border-red-500 bg-red-500 hover:border-red-600 hover:bg-red-600 focus:ring-red-300'
            : 'border-blue-500 bg-blue-500 hover:border-blue-600 hover:bg-blue-600 focus:ring-blue-300'
        ]"
        :disabled="isSubmitting"
        @click="isSuccess ? handleLogout() : undefined"
      >
        <span v-if="isSuccess">ออกจากระบบ</span>
        <span v-else-if="!isSubmitting">เข้าสู่ระบบ</span>
        <span v-else>กำลังตรวจสอบ...</span>
      </button>

      <p v-if="serverError" class="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
        {{ serverError }}
      </p>

      <p v-if="isSuccess" class="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        เข้าสู่ระบบสำเร็จ! ระบบกำลังนำคุณไปยังแดชบอร์ด
      </p>
    </form>

    <footer class="flex flex-col gap-3 text-center text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:text-left">
      <p>ยังไม่มีบัญชี?</p>
      <RouterLink
        to="/register"
        class="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
      >
        สมัครสมาชิกใหม่
      </RouterLink>
    </footer>
  </section>
</template>

