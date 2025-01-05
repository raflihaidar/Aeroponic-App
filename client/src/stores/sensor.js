import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useSensorStore = defineStore(
  'sensor',
  () => {
    const BaseURL = 'http://localhost:5000/api'
    const pH = ref(7)
    const pumpTime = ref(0) // Menyimpan waktu pump dalam detik
    let pumpTimer = null // Variabel untuk menyimpan ID interval timer

    // Fungsi untuk menentukan warna berdasarkan nilai pH
    const pHColor = computed(() => {
      if (pH.value <= 3) return '#FF0000' // Merah (terlalu asam)
      if (pH.value <= 4) return '#DC143C' // Merah Muda (terlalu asam)
      if (pH.value < 5) return '#FFBF00' // Kuning (sedikit asam)
      if (pH.value >= 5 && pH.value <= 6.5) return '#008000' // Hijau Muda (optimal) '#008000'
      if (pH.value === 7) return '#50C878' // Hijau (Netral)
      if (pH.value <= 9) return '#0096FF' // Biru Muda (sedikit basa)
      if (pH.value <= 14) return '#0047AB' // Biru (terlalu basa)
      return '#000' // Default untuk nilai tak terduga
    })

    // Fungsi untuk mendapatkan nilai pH dari API
    const getpHValue = async () => {
      try {
        const response = await axios.get(`${BaseURL}/ph`)
        pH.value = response.data.data.ph
      } catch (err) {
        console.log('error :', err)
      }
    }

    // Fungsi untuk menangani status pompa
    const handlePump = async (state) => {
      try {
        const response = await axios.post(`${BaseURL}/relay`, {
          state,
        })

        console.log(response.data.message)

        if (state === 'ON') {
          startPumpTime() // Mulai menghitung waktu ketika pump diaktifkan

          // Menambahkan logika untuk mulai timer waktu diam pompa selama 10 menit (600 detik)
          startPumpIdleTimer(600) // Mulai timer waktu diam 10 menit (600 detik)
        } else {
          stopPumpTime() // Hentikan penghitungan waktu ketika pump dimatikan
          stopPumpIdleTimer() // Hentikan timer waktu diam pompa
        }
      } catch (err) {
        console.log(err)
      }
    }

    // Fungsi untuk memulai timer diam pompa dengan durasi tertentu (misalnya 10 menit)
    const startPumpIdleTimer = (duration) => {
      isPumpIdle.value = true
      pumpIdleDuration.value = duration // Set durasi waktu diam pompa (misalnya 600 detik = 10 menit)

      pumpIdleTimerInterval = setInterval(() => {
        if (pumpIdleDuration.value > 0) {
          pumpIdleDuration.value -= 1
        } else {
          stopPumpIdleTimer() // Menghentikan timer pompa diam setelah waktu selesai
          resetTimer() // Mulai ulang timer setelah pompa diam
        }
      }, 1000)
    }

    // Fungsi untuk menghentikan timer diam pompa
    const stopPumpIdleTimer = () => {
      clearInterval(pumpIdleTimerInterval)
      pumpIdleTimerInterval = null
      isPumpIdle.value = false
    }
    // Fungsi untuk mulai menghitung waktu pump
    const startPumpTime = () => {
      pumpTimer = setInterval(() => {
        pumpTime.value += 1 // Menambah waktu setiap detik
      }, 1000)
    }

    // Fungsi untuk menghentikan penghitungan waktu pump
    const stopPumpTime = () => {
      clearInterval(pumpTimer) // Menghentikan penghitungan waktu
      pumpTimer = null
    }

    return { pH, pHColor, getpHValue, handlePump }
  },
  {
    persist: true,
  },
)
