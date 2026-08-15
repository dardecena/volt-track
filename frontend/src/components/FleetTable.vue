<script setup lang='ts'>
import { useRobots } from '../composables/useRobots';

const { robots, loading } = useRobots();
</script>

<template>
  <v-card>
    <!-- Subtitle -->
    <v-card-item>
      <span class='text-h6'>Active machines</span>
    </v-card-item>

    <!-- On Error -->

    <!-- Loading -->
    <div v-if='loading' class='pa-4'>
      <v-skeleton-loader type='table-row@5' />
    </div>

    <!-- Robot Table -->
    <div>
      {{ robots }}
    </div>
  </v-card>
</template>

<style scoped>
</style>
