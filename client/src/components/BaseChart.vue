<template>
  <div
    class="bg-white w-full h-auto shadow-[0_3px_10px_rgb(0,0,0,0.2)] text-center p-5 rounded-3xl"
  >
    <apexchart width="100%" type="line" :options="chartOptions" :series="chartSeries"></apexchart>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSensorStore } from '@/stores/sensor.js'

const sensorStore = useSensorStore()

const chartOptions = computed(() => ({
  chart: {
    id: 'ph-monitoring-chart',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: true,
    },
  },
  xaxis: {
    categories: sensorStore.pHHistory.map((entry) => entry.time), // Waktu dari history
    title: {
      text: 'Time',
    },
  },
  yaxis: {
    title: {
      text: 'pH Level',
    },
    min: 0,
    max: 14,
  },
  stroke: {
    curve: 'smooth',
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  tooltip: {
    enabled: true,
  },
  grid: {
    borderColor: '#e7e7e7',
  },
}))

const chartSeries = computed(() => [
  {
    name: 'pH Level',
    data: sensorStore.pHHistory.map((entry) => entry.value),
  },
])
</script>
