import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSensorStore = defineStore(
  'sensor',
  () => {
    const pH = ref(4.8)

    // Fungsi untuk menentukan warna berdasarkan nilai pH
    const pHColor = computed(() => {
      if (pH.value <= 3) return pH.value <= 1 ? '#FF0000' : '#DC143C' // Merah hingga Oranye
      if (pH.value <= 6) return pH.value <= 5 ? '#FFBF00' : '#50C878' // Kuning hingga Hijau Muda
      if (pH.value === 7) return '#008000' // Hijau (Netral)
      if (pH.value <= 14) return pH.value <= 9 ? '#0096FF' : '#0047AB' // Hijau-Biru hingga Biru Muda
      return '#000' // Default untuk nilai tak terduga
    })
    return { pH, pHColor }
  },
  {
    persist: true,
  },
)
