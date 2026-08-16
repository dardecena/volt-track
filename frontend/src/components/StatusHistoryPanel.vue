<script setup lang='ts'>
import { toRef, ref } from 'vue';
import { useStatusHistory } from '../composables/useStatusHistory';
import { batteryColor, getDisplayStatus } from "frontend/src/utils/status.ts";
import { toDatetimeLocal } from "frontend/src/utils/datetime.ts";

const props = defineProps<{
  robotId: string | null;
}>()

const robotId = toRef(props, 'robotId');
const showRefreshed = ref(false);
const { history, loading, error, page, pageCount, goToPage } = useStatusHistory(robotId);
</script>

<template>
  <v-card class="history-panel" v-bind="$attrs">
    <v-card-item>
      <template #title>
        <span class="text-h6 font-weight-bold text-medium-emphasis">
          {{ robotId ? `Robot ID ${robotId}` : 'Status History'}}
        </span>
      </template>
      <template #subtitle>
        <span class="panel-subtitle">
          {{ robotId? 'Detailed History' : 'Select a machine to view details'}}
        </span>
      </template>
    </v-card-item>

    <v-divider />

    <div class="history-panel__body">
      <!--  Empty state: not robot selected -->
      <div v-if="!robotId" class="history-panel__empty">
        <v-icon icon="mdi-history" size="40" class="mb-3 text-medium emphasis" />
        <p class="text-body-2 text-medium-emphasis text center">
          Click a robot row to inspect its history
        </p>
      </div>

      <template v-else>
        <!--  ErrorHandling -->
        <v-alert v-if="error" type="error" variant="tonal" class="ma-4">
          {{ error }}
          <template #append>
            <v-btn size="small" variant="text" @click="goToPage(page)">
              Retry
            </v-btn>
          </template>
        </v-alert>

        <!--  Loading -->
        <div v-if="loading" class="history-panel__loading">
          <v-progress-circular indeterminate color="primary" :size="40"/>
        </div>
        <!--  No data -->
        <div v-else-if="!history.length && !error" class="history-panel__empty">
          <v-icon icon = "mdi-tray-remove" size="40" class="mb-3 text-medium-emphasis" />
          <p class="text-body-2 text-medium-emphasis text-center">
            No status history yet
          </p>
        </div>

        <!--  Timeline -->
        <v-timeline v-else density="compact" side="end" class="pa-4">
          <v-timeline-item
              v-for="entry in history"
              :key="entry.id"
              :dot-color="getDisplayStatus(entry).color"
              size="small"
          >
            <div class="timeline-entry">
<!--              <div class="d-flex justify-space-between align-baseline">-->
              <!--  Status -->
                <div class='timeline-entry__label'>
                  {{ getDisplayStatus(entry).label }}
                </div>
                <!--  Timestamp -->
                <div class='timeline-entry__time'>
                  {{ toDatetimeLocal(entry.lastSeen) }}
                </div>
<!--              </div>-->
              <!--  Battery -->
              <div class='timeline-entry__battery'>
                <v-progress-linear
                  :model-value="entry.batteryLevel"
                  :color=batteryColor(entry.batteryLevel)
                  bg-color="grey-lighten-3"
                  height="6"
                  rounded
                />
                <span class="timeline-entry__battery-value">
                  {{ entry.batteryLevel }}%
                </span>
              </div>
              <!--  Error -->
              <p v-if="entry.errorCode !== null" class="timeline-entry__note">
                Error code: {{ entry.errorCode }}
              </p>
            </div>
          </v-timeline-item>
        </v-timeline>
      </template>
    </div>
    <!--  Pagination -->
    <template v-if="robotId">
      <v-divider v-if="robotId"/>

      <div class='d-flex align-center justify-space-between pa-4 history-panel__footer'>
        <v-btn
            icon='mdi-chevron-left'
            size='small'
            variant='text'
            :disabled='page <= 1'
            @click='goToPage(page - 1)'
        />
        <span class='text-label-small'>
              Page {{ page }} of {{ pageCount }}
            </span>
        <v-btn
            icon='mdi-chevron-right'
            size='small'
            variant='text'
            :disabled='page >= pageCount'
            @click='goToPage(page + 1)'
        />
      </div>
    </template>
  </v-card>

  <!--  Pagination -->
  <v-snackbar
      v-model="showRefreshed"
      :timeout="2000"
      location="top right"
  >
    Data refreshed
  </v-snackbar>
</template>

<style scoped>
.history-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.history-panel__body {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}

.history-panel__footer {
  flex-shrink: 0;
  background: white;
}

.history-panel__empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.history-panel__loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.v-progress-linear__background) {
  opacity: 1 !important;
}

.panel-subtitle {
  font-size: 12px;
  color: rgba(15, 23, 42, 0.5);
}

/* Use timeline's full-width */
:deep(.v-timeline) {
  width: 100%;
}

:deep(.v-timeline-divider__dot) {
  width: 10px !important;
  height: 10px !important;
}

:deep(.v-timeline-divider__inner-dot) {
  width: 10px !important;
  height: 10px !important;
  box-shadow: 0 0 0 2px white, 0 0 0 3px rgba(15, 23, 42, 0.06);
}

.timeline-entry {
  width: 100%;
}

.timeline-entry__battery {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  width: 100%;
}

.timeline-entry__battery :deep(.v-progress-linear) {
  flex: 1;
}

.timeline-entry__battery-value {
  font-size: 12px;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.6);
  min-width: 28px;
  text-align: right;
}

.timeline-entry__label {
  font-weight: 600;
  font-size: 12px;
}

.timeline-entry__note {
  margin-top: 6px;
  margin-bottom: 0;
  font-size: 11px;
  color: rgba(15, 23, 42, 0.5);
}

.timeline-entry__time {
  font-family: 'Inter', monospace;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: rgba(15,23, 42, 0.45);
  letter-spacing: 0.02em;
}

:deep(.v-timeline-item) {
  margin-bottom: 0 !important;
}

:deep(.v-timeline-item__body) {
  width: 100% !important;
  flex: 1 1 auto !important;
  padding-bottom: 4px !important;
  padding-block: 2px !important;
}

</style>