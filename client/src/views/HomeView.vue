<script setup>
import BaseCard from '@/components/BaseCard.vue'
import BaseToggle from '@/components/BaseToggle.vue'
import { useSensorStore } from '@/stores/sensor.js'
import { useTimerStore } from '@/stores/timer.js'
import { storeToRefs } from 'pinia'
import { onMounted, ref, onUnmounted } from 'vue'

const sensorStore = useSensorStore()
const timerStore = useTimerStore()

const { pH, pHColor } = storeToRefs(sensorStore)
const { formattedTime, startTimer, stopTimer } = storeToRefs(timerStore)

// Fungsi untuk mengupdate pH secara periodik
const intervalId = ref(null)

onMounted(async () => {
  await sensorStore.getpHValue()
  startAutoUpdate() // Memulai pembaruan otomatis
})

// Fungsi untuk memperbarui pH setiap 5 detik
function startAutoUpdate() {
  intervalId.value = setInterval(async () => {
    await sensorStore.getpHValue()
    console.log('pH diperbarui secara otomatis')
  }, 5000)
}

function stopAutoUpdate() {
  if (intervalId.value) {
    clearInterval(intervalId.value)
    intervalId.value = null
  }
}

// Bersihkan interval saat komponen dihancurkan
onUnmounted(() => {
  stopAutoUpdate()
})


</script>

<template>
  <main class="w-full h-full mt-28 z-50">
    <section class="w-[90%] mx-auto grid gap-y-10">
      <section class="flex gap-x-5">
        <!-- Menampilkan status pH -->
        <BaseCard data-name="pH Status" :icon="true" :value="pH" :color-value="pHColor" />
      </section>

      <!-- BaseToggle untuk mengontrol status pump -->
      <BaseToggle width="60%" /> <!-- Menggunakan event @toggle untuk handle perubahan state -->
    </section>
  </main>
</template>
