<script setup lang="ts">
import type { RobotStatus } from "../types/robot.types";
import { getDisplayStatus } from "../utils/status";

const props = defineProps<{
    status: RobotStatus | null
}>()

const display = getDisplayStatus(props.status);
</script>

<template>
    <v-chip :color="display.color" size="small" variant="tonal">
      <v-icon :icon="display.icon" size="14" start />
      {{ display.label }}
    </v-chip>
</template>