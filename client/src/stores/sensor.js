import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useSensorStore = defineStore(
  'sensor',
  () => {
    const BaseURL = 'http://localhost:5000/api'
    const pH = ref(7)
    const pHHistory = ref([]) // Array untuk menyimpan data pH
    const pumpTime = ref(0) // Menyimpan waktu pump dalam detik
    let pumpTimer = null // Variabel untuk menyimpan ID interval timer

    // Fungsi untuk menentukan warna berdasarkan nilai pH
    const pHColor = computed(() => {
      if (pH.value <= 3) return '#FF0000' // Merah (terlalu asam)
      if (pH.value <= 4) return '#DC143C' // Merah Muda (terlalu asam)
      if (pH.value < 5) return '#FFBF00' // Kuning (sedikit asam)
      if (pH.value >= 5 && pH.value <= 7) return '#008000' // Hijau Muda (optimal)
      if (pH.value === 7) return '#50C878' // Hijau (Netral)
      if (pH.value <= 14) return '#0047AB' // Biru (terlalu basa)
      return '#000' // Default untuk nilai tak terduga
    })

    // Fungsi untuk mendapatkan nilai pH dari API
    const getpHValue = async () => {
      try {
        const response = await axios.get(`${BaseURL}/ph`)
        const currentPH = response.data.data.ph
        pH.value = currentPH

        // Tambahkan nilai pH ke dalam array history
        pHHistory.value.push({
          time: new Date().toLocaleTimeString(), // Waktu dalam format jam:menit:detik
          value: currentPH,
        })

        // Batasi panjang history (misalnya hanya simpan 20 data terakhir)
        if (pHHistory.value.length > 10) {
          pHHistory.value.shift()
        }
      } catch (err) {
        console.log('error :', err)
      }
    }

    // Fungsi untuk menangani status pompa
    const handlePump = async (state) => {
      try {
        await axios.post(`${BaseURL}/relay`, {
          state,
        })

        if (state === 'ON') {
          startPumpTime() // Mulai menghitung waktu ketika pump diaktifkan
        } else {
          stopPumpTime() // Hentikan penghitungan waktu ketika pump dimatikan
        }
      } catch (err) {
        console.log(err)
      }
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

    return { pH, pHHistory, pHColor, getpHValue, handlePump }
  },
  {
    persist: true,
  },
)
