<script setup>
import BaseCard from '@/components/BaseCard.vue'
import BaseToggle from '@/components/BaseToggle.vue'
import { useSensorStore } from '@/stores/sensor.js'
import { storeToRefs } from 'pinia'

const sensorStore = useSensorStore()

const { pH, pHColor } = storeToRefs(sensorStore)
</script>

<template>
  <main class="w-full h-full mt-28 z-50">
    <section class="w-[90%] mx-auto grid gap-y-10">
      <BaseCard data-name="pH Status" :value="pH" :color-value="pHColor" />
      <BaseToggle width="60%" />
    </section>
  </main>
</template>
