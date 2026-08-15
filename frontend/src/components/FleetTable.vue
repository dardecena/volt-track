<script setup lang='ts'>
import { useRobots } from '../composables/useRobots';

const emit = defineEmits<{ select: [string] }>();
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
            v-for='robot in robots'
            :key='robot.id'
            @click="emit('select', robot.id)"
          >
            <!-- Robot ID -->
            <td class='font-weight-medium'>{{ robot.id }}</td>
            <!-- Status -->
            <td v-if="robot.latestStatus">{{ robot.latestStatus.chargingState }}</td>
            <!-- Battery -->
            <td v-if="robot.latestStatus">{{ robot.latestStatus.batteryLevel }}</td>
            <!-- Timestamp -->
            <td>
              <span v-if='robot.latestStatus'>{{ robot.latestStatus.lastSeen }}</span>
            </td>
          </tr>
          <tr v-if='!robots.length'>
            <td>No machines found</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-card>
</template>

<style scoped>
</style>
