<script setup>
import { ref } from 'vue'

defineProps({
  width: {
    type: String,
    default: '100%',
  },
})

const isClick = ref(false)
const toggle = () => {
  isClick.value = !isClick.value
}
</script>

<template>
  <section class="bg-white w-full h-full py-5 rounded-3xl">
    <div
      class="w-[80%] h-20 mx-auto relative flex items-center p-1 rounded-full bg-green-500"
      :style="{ width }"
      @click="toggle"
    >
      <div
        class="w-16 h-16 rounded-full bg-white absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-in-out"
        :class="isClick ? 'right-1' : 'left-1'"
      />
    </div>
    <p class="text-center mt-2 font-semibold">Pump</p>
  </section>
</template>
