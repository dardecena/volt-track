<script setup lang="ts">
import { ref } from "vue";
import { useRobots } from "../composables/useRobots";
import {toDatetimeLocal} from "frontend/src/utils/datetime.ts";
import BatteryIndicator from "./BatteryIndicator.vue";
import StatusChip from "./StatusChip.vue";

const props = defineProps<{
  selectedRobotId: string | null;
}>()
const emit = defineEmits<{ select: [string] }>();
const { robots, loading, error, loadRobots } = useRobots();

const showRefreshed = ref(false)

async function retry() {
  const success = await loadRobots();
  if (success) {
    showRefreshed.value = true;
  }
}
</script>

<template>
  <v-card v-bind="$attrs">
    <!-- Subtitle -->
    <v-card-item>
      <span class="text-h6 font-weight-bold">Active robots</span>
    </v-card-item>

    <v-divider />

    <!-- On Error -->
    <v-alert v-if="error" type="error" variant="tonal" class="mx-4 mb-2">
      {{ error }}
      <template #append>
        <v-btn size="small" variant="text" @click="retry">Retry</v-btn>
      </template>
    </v-alert>

    <!-- Loading -->
    <div v-if="loading" class="pa-4">
      <v-progress-circular indeterminate color="primary" :size="40" />
    </div>

    <!-- Robot Table -->
    <div class="fleet-table__scroll">
      <v-table>
        <thead>
          <tr>
            <th>Robot ID</th>
            <th>Charging Status</th>
            <th>Battery Level</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="robot in robots"
            :key="robot.id"
            class="fleet-row"
            :class="{ 'fleet-row--selected': robot.id === selectedRobotId }"
            @click="emit('select', robot.id)"
          >
            <!-- Robot ID -->
            <td class="font-weight-medium">
              <div class="d-flex align-center ga-2">
                <v-avatar size="28" color="indigo-lighten-5" rounded="lg">
                  <v-icon icon="mdi-cube-outline" size="16" color="indigo-darken-1" />
                </v-avatar>
                {{ robot.id }}
              </div>
            </td>

            <!-- Status -->
            <td>
              <StatusChip :status="robot.latestStatus" />
            </td>

            <!-- Battery -->
            <td>
              <BatteryIndicator
                  v-if="robot.latestStatus"
                  :level="robot.latestStatus.batteryLevel"
              />
              <span v-else class="text-medium-emphasis">-</span>
            </td>

            <!-- Timestamp -->
            <td>
              <span v-if="robot.latestStatus">
                {{ toDatetimeLocal(robot.latestStatus.lastSeen) }}
              </span>
              <span v-else class="text-medium-emphasis">None</span>
            </td>
          </tr>
          <!-- No data available -->
          <tr v-if="!robots.length">
            <td colspan="4" class="text-center text-medium-emphasis py-6">
              No robots found
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-card>

  <v-snackbar
    v-model="showRefreshed"
    :timeout="2000"
    location="top right"
  >
    Data refreshed
  </v-snackbar>
</template>

<style scoped>
.fleet-row {
  cursor: pointer;
}

.fleet-row:hover {
  background: rgba(79, 70, 229, 0.04);
}

.fleet-row--selected {
  background: rgba(79, 70, 229, 0.08);
}

.fleet-row--selected:hover {
  background: rgba(79, 70, 229, 0.08);
}

.fleet-table__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 16px;
}

:deep(.v-card-item) {
  flex-shrink: 0;
}

:deep(thead th) {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

:deep(.v-progress-linear__background) {
  opacity: 1 !important;
}
</style>
