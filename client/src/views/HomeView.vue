<script setup>
import BaseCard from '@/components/BaseCard.vue'
import BaseToggle from '@/components/BaseToggle.vue'
import { useSensorStore } from '@/stores/sensor.js'
// import { useTimerStore } from '@/stores/timer.js'
import { storeToRefs } from 'pinia'
import { onMounted, ref, onUnmounted } from 'vue'
import BaseChart from '../components/BaseChart.vue'
import mqtt from 'mqtt' // Import mqtt.js

const sensorStore = useSensorStore()
// const timerStore = useTimerStore()
const wsClient = ref(null) // MQTT client
const isConnected = ref(false) // Connection status
const retryInterval = 3000 // Time interval for retrying connection (ms)
let retryTimeout = null // Timeout reference for reconnection

const { pH, pHColor } = storeToRefs(sensorStore)
// const { formattedTime, startTimer, stopTimer } = storeToRefs(timerStore)

// Function to initiate MQTT connection using WebSocket
const connectMQTT = () => {
  wsClient.value = mqtt.connect(
    'wss://e1ba2dc5f46b4b46a15520b16e2bebc2.s1.eu.hivemq.cloud:8884/mqtt',
    {
      username: 'esp32', // Username if required
      password: 'Esp322005', // Password if required
    },
  )

  wsClient.value.on('connect', () => {
    console.log('MQTT connected.')
    isConnected.value = true
    if (retryTimeout) {
      clearTimeout(retryTimeout) // Clear the retry timeout on successful connection
      retryTimeout = null
    }

    // Subscribe to topic
    wsClient.value.subscribe('esp32/sensor/ph', (err) => {
      if (err) {
        console.error('Subscription error:', err)
      } else {
        console.log('Subscribed to esp32/sensor/ph topic')
      }
    })
  })

  wsClient.value.on('message', (topic, message) => {
    // Handle incoming message
    console.log(`Message received on topic ${topic}:`, message.toString())
    if (topic === 'esp32/sensor/ph') {
      // Parse the message and update the sensor store (e.g., pH value)
      const sensorData = JSON.parse(message.toString())
      sensorStore.setPH(sensorData.ph)
    }
  })

  wsClient.value.on('error', (error) => {
    console.error('MQTT error:', error)
    isConnected.value = false
  })

  wsClient.value.on('close', () => {
    console.log('MQTT connection closed. Retrying...')
    isConnected.value = false
    attemptReconnect() // Trigger reconnection process when the connection closes
  })
}

// Retry connection mechanism
const attemptReconnect = () => {
  if (!isConnected.value) {
    retryTimeout = setTimeout(() => {
      console.log('Attempting to reconnect...')
      connectMQTT()
    }, retryInterval)
  }
}

onMounted(() => {
  connectMQTT()
})

onUnmounted(() => {
  if (wsClient.value) {
    wsClient.value.end() // Close the MQTT connection when component unmounts
  }
  if (retryTimeout) {
    clearTimeout(retryTimeout)
  }
})
</script>

<template>
  <main class="w-full h-full mt-28 pb-40 z-50">
    <section class="w-[90%] mx-auto grid gap-y-10">
      <section class="flex gap-x-5">
        <!-- Menampilkan status pH -->
        <BaseCard data-name="pH Status" :icon="true" :value="pH" :color-value="pHColor" />
      </section>

      <BaseChart />
      <!-- BaseToggle untuk mengontrol status pump -->
      <BaseToggle width="60%" />
      <!-- Menggunakan event @toggle untuk handle perubahan state -->
    </section>
  </main>
</template>
