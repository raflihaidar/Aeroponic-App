<script setup>
import ChartIcon from './icons/ChartIcon.vue'
import DownloadIcon from './icons/DownloadIcon.vue'
import HomeIcon from './icons/HomeIcon.vue'
import ResetIcon from './icons/ResetIcon.vue'
import SettingsIcon from './icons/SettingsIcon.vue'
</script>

<template>
  <nav
    class="bg-white w-[95vw] px-5 py-4 rounded-full left-1/2 bottom-3 -translate-x-1/2 h-auto text-center fixed"
  >
    <ul class="w-full flex justify-between text-sm">
      <li>
        <ResetIcon />
        <p class="text-xs mt-1">Reset</p>
      </li>
      <li>
        <DownloadIcon />
        <p class="text-xs mt-1">Data</p>
      </li>
      <li>
        <HomeIcon />
        <p class="text-xs mt-1">Home</p>
      </li>
      <li>
        <ChartIcon />
        <p class="text-xs mt-1">Charts</p>
      </li>
      <li>
        <SettingsIcon />
        <p class="text-xs mt-1">Settings</p>
      </li>
    </ul>
  </nav>
</template>
