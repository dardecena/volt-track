import { ref, watch, type Ref } from 'vue';
import { robotsApi } from '../api/robots.api';
import { extractErrorMessage } from '../api/http.ts';
import type { RobotStatus } from '../types/robot.types';


export function useStatusHistory(
    robotId: Ref<string | null>
) {
    const history = ref<RobotStatus[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);


    async function load() {
        if (!robotId.value) return;
        loading.value = true;
        error.value = null;

        try {
            const result = await robotsApi.fetchStatusHistory(robotId.value);
            history.value = result.data;
        } catch (err) {
            error.value = extractErrorMessage(err);
        } finally {
            loading.value = false;
        }
    }

    watch(robotId, (id) => {
        history.value = [];
        if (id) void load();
    });

    // if (refreshSignal) {
    //     watch(refreshSignal, () => void load());
    // }

    return { history, loading, error };
}