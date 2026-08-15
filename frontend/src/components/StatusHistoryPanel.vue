<script setup lang='ts'>
import { toRef } from 'vue';
import { useStatusHistory } from '../composables/useStatusHistory';

const props = defineProps<{
  robotId: string | null;
}>()

const robotId = toRef(props, 'robotId');
const { history, loading, error } = useStatusHistory(robotId);
</script>

<template>
  <v-card>
    <v-card-item>
      <template #title>
        Status History
      </template>
    </v-card-item>

    <v-divider />

    <div>
      <!--  Empty state: not robot selected -->
      <div v-if="!robotId">
        <v-icon icon="mdi-history" size="40" class="mb-3 text-medium emphasis" />
        <p class="text-body-2 text-medium-emphasis text center">
          Click a robot row to inspect its history
        </p>
      </div>

      <template v-else>
        <!--  ErrorHandling -->
        <v-alert v-if="error">
          {{ error }}
        </v-alert>

        <!--  Loading -->
        <div v-if="loading">
          <v-skeleton-loader />
        </div>
        <!--  No data -->
        <div v-else-if="!history.length && !error">
          <v-icon icon = "mdi-tray-remove" size="40" class="mb-3 text-medium-emphasis" />
          <p>No status history yet</p>
        </div>

        <!--  Timeline -->
        <v-timeline v-else density="compact" side="end" class="pa-4">
          <v-timeline-item
              v-for="entry in history"
              :key="entry.id"
              size="small"
          >
            <div>
              {{ entry }}
            </div>

          </v-timeline-item>
        </v-timeline>
      </template>

    </div>






  </v-card>
</template>

<style scoped>
</style>