<script setup>
import { ref } from 'vue'
import { useTimerStore } from '../stores/timer'


defineProps({
  width: {
    type: String,
    default: '100%',
  },
})

const timerStore = useTimerStore()


const isClick = ref(false)
const toggle = async () => {
  isClick.value = !isClick.value

  // Menggunakan handlePump dari store untuk mengirimkan state
  const state = isClick.value ? 'ON' : 'OFF'
  await timerStore.handlePump(state)
}
</script>

<template>
  <section class="bg-white w-full h-full py-5 rounded-3xl">
    <div class="w-[80%] h-20 mx-auto relative flex items-center p-1 rounded-full"
      :class="isClick ? 'bg-green-500' : 'bg-slate-400'" :style="{ width }" @click="toggle">
      <div
        class="w-16 h-16 rounded-full bg-white absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-in-out"
        :class="isClick ? 'right-1' : 'left-1'" />
    </div>
    <p class="text-center mt-2 font-semibold">Pump</p>
  </section>
</template>
