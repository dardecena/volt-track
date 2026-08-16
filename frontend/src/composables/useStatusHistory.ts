import {ref, watch, type Ref, computed} from 'vue';
import { robotsApi } from '../api/robots.api';
import { extractErrorMessage } from '../api/http.ts';
import type { RobotStatus } from '../types/robot.types';

const LIMIT =6;

export function useStatusHistory(
    robotId: Ref<string | null>,

) {
    const history = ref<RobotStatus[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const page = ref(1);
    const total = ref(0);

    const pageCount = computed(() => {
        return Math.max(1, Math.ceil(total.value / LIMIT));
    })

    async function load() {
        if (!robotId.value) return;

        const requestedRobotId = robotId.value;
        const requestedPage = page.value;

        loading.value = true;
        error.value = null;
        try {
            const result = await robotsApi.fetchStatusHistory(requestedRobotId, requestedPage, LIMIT);
            if (
                robotId.value !== requestedRobotId ||
                page.value !== requestedPage
            ) {
                return;
            }

            history.value = result.data;
            total.value = result.total;

        } catch (err) {
            if (
                robotId.value !== requestedRobotId ||
                page.value !== requestedPage
            ) {
                return;
            }
            error.value = extractErrorMessage(err);

        } finally {
            if (
                robotId.value === requestedRobotId ||
                page.value === requestedPage
            ) {
                loading.value = false;
            }
        }
    }

    function goToPage(targetPage: number) {
        page.value = targetPage;
        void load();
    }

    watch(robotId, (id) => {
        history.value = [];
        page.value = 1;
        total.value = 0;
        error.value = null;
        if (id) void load();
    });

    return { history, loading, error, page, pageCount, goToPage };
}