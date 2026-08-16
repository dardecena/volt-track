<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRobots } from "./composables/useRobots.ts";
import FleetTable from "./components/FleetTable.vue";
import StatusHistoryPanel from "./components/StatusHistoryPanel.vue";

const { loadRobots, loading } = useRobots();
const selectedRobotId = ref<string | null>(null);
const showRefreshed = ref(false);

async function refresh() {
  const success = await loadRobots();
  if (success) {
    selectedRobotId.value = null
    showRefreshed.value = true;
  }
}

onMounted(() => loadRobots());
</script>

<template>
  <v-app>
    <!-- Navigation  -->
    <v-navigation-drawer width="240">
      <div class="d-flex align-center ga-2 pa-4">
        <v-avatar size="32" color="primary" rounded="lg">
          <v-icon icon="mdi-lightning-bolt" color="white" size="20" />
        </v-avatar>
        <span class="text-h6 font-weight-bold">VoltTrack</span>
      </div>
      <v-list nav density="compact" class="px-2">
        <v-list-item
          title="Fleet Monitor"
          prepend-icon="mdi-view-dashboard"
          active
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Header  -->
    <v-app-bar flat>
      <v-app-bar-title class="header-title">
        <div>Fleet monitor</div>
      </v-app-bar-title>
      <v-spacer />
      <v-btn
        icon="mdi-refresh"
        variant="text"
        color="grey-darken-1"
        :loading="loading"
        @click="refresh"
      />
    </v-app-bar>

    <!-- FleetTable and StatusPanel  -->
    <v-main>
      <v-container fluid class="dashboard-layout">
        <FleetTable
            class="dashboard-layout__main"
            @select="(id) => (selectedRobotId = id)"
            :selected-robot-id="selectedRobotId"
        />
        <StatusHistoryPanel
            class="dashboard-layout__side"
            :robot-id="selectedRobotId"
        />
      </v-container>
    </v-main>

    <v-snackbar
      v-model="showRefreshed"
      :timeout="2000"
      location="top right"
    >
      Data refreshed
    </v-snackbar>
  </v-app>
</template>

<style scoped>

.header-title {
  flex: 0 1 auto;
  min-width: 0;
}

</style>