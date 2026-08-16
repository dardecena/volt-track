<script setup lang="ts">
import { batteryColor } from "../utils/status";

defineProps<{
  level: number;
}>()

</script>

<template>
  <div class="battery-indicator">
    <v-progress-linear
      :model-value=level
      :color=batteryColor(level)
      bg-color="grey-lighten-3"
      height="6"
      rounded
      class="battery-indicator__bar"
    />
    <span class="battery-indicator__text">{{ level }}%</span>
  </div>
</template>
<style scoped>
.battery-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.battery-indicator__bar {
  flex: 1;
}

.battery-indicator__text {
  font-size: 12px;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.6);
  min-width: 28px;
  text-align: right;
}
</style>