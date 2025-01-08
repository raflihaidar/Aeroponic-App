<script setup>
import WarningIcon from '@/components/icons/WarningIcon.vue'
import SuccessIcon from '@/components/icons/SuccessIcon.vue'

defineProps({
  dataName: String,
  value: {
    type: Number,
    default: 0,
  },
  colorValue: {
    type: String,
    default: '#000',
  },
  icon: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <section
    class="bg-white w-full h-auto shadow-[0_3px_10px_rgb(0,0,0,0.2)] text-center px-2 py-5 rounded-3xl"
  >
    <h3 class="text-5xl font-semibold mb-2" :style="{ color: colorValue }">{{ value }}</h3>
    <component
      v-if="icon"
      :is="(value >= 5 && value <= 7) || value === 7 ? SuccessIcon : WarningIcon"
      class="mx-auto mb-2"
    />
    <p class="text-sm font-medium">{{ dataName }}</p>
  </section>
</template>
