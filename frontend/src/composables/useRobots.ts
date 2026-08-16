import { ref } from "vue";
import { extractErrorMessage } from "../api/http.ts";
import { robotsApi } from "../api/robots.api.ts";
import type { Robot } from "../types/robot.types.ts";


const robots = ref<Robot[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadRobots(): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
        robots.value = await robotsApi.fetchRobots();
        return true;
    } catch (err) {
        error.value = extractErrorMessage(err);
        return false;
    } finally {
        loading.value = false;
    }
}

export function useRobots() {
    return { robots, loading, error, loadRobots }
}
