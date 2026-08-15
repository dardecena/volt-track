import { http } from "./http";
import type { Robot } from "../types/robot.types.ts";
import type { PaginatedStatusHistory } from "../types/robot.types.ts";

export const robotsApi = {
    async fetchRobots(): Promise<Robot[]> {
        const { data } = await http.get<Robot[]>("/robots");
        return data;
    },

    async fetchStatusHistory(
        robotId: string,
        page: number,
        limit: number,
    ): Promise<PaginatedStatusHistory> {
        const { data } = await http.get<PaginatedStatusHistory>(
            `/robots/${robotId}/history`,
            { params: { page, limit } }
        );
        return data;
    }
}