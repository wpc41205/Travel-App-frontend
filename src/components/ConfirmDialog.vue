<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: "OK",
  cancelText: "Cancel",
  confirmButtonClass: "bg-red-600 hover:bg-red-700 text-white",
  cancelButtonClass: "bg-orange-100 hover:bg-orange-200 text-orange-700",
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  close: [];
}>();

const handleConfirm = () => {
  emit("confirm");
  emit("close");
};

const handleCancel = () => {
  emit("cancel");
  emit("close");
};

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    handleCancel();
  }
};

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.isOpen) {
    handleCancel();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isOpen"
            class="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            @click.stop
          >
            <h3 v-if="title" class="mb-2 text-lg font-semibold text-slate-900">
              {{ title }}
            </h3>
            <p :class="title ? 'mb-6 text-sm text-slate-600' : 'mb-6 text-sm text-slate-900'">
              {{ message }}
            </p>
            <div class="flex items-center justify-end gap-3">
              <button
                type="button"
                :class="[
                  'rounded-full px-5 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                  props.cancelButtonClass,
                ]"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>
              <button
                type="button"
                :class="[
                  'rounded-full px-5 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                  props.confirmButtonClass,
                ]"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

