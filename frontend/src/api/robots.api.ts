import { http } from "./http";
import type { Robot } from "../types/robot.types.ts";

export const robotsApi = {
    async fetchRobots(): Promise<Robot[]> {
        const { data } = await http.get<Robot[]>("/robots");
        return data;
    },
}