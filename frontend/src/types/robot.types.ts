export type ChargingState = 'idle' | 'charging' | 'error' | 'offline'

export const ChargingState = {
    IDLE: 'idle',
    CHARGING: 'charging',
    ERROR: 'error',
    OFFLINE: 'offline'
} as const

export interface RobotStatus {
    id: string;
    robotId: string;
    batteryLevel: number;
    chargingState: ChargingState;
    lastSeen: string;
    errorCode: number | null;
    createdAt: string;
}

export interface Robot {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    latestStatus: RobotStatus | null;
}

export interface PaginatedStatusHistory {
    data: RobotStatus[];
    total: number;
    page: number;
    limit: number;
}
