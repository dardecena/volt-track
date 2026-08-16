import { ChargingState, type RobotStatus } from '../types/robot.types';

export interface DisplayStatus {
    label: string;
    color: string;
    icon: string;
}

export function getDisplayStatus(status: RobotStatus | null): DisplayStatus {
    if (!status) {
        return {
            label: 'Unknown',
            color: 'grey',
            icon: 'mdi-help-circle-outline'
        };
    }

    switch (status.chargingState) {
        case ChargingState.OFFLINE:
            return {
                label: 'Offline',
                color: 'grey',
                icon: 'mdi-power-plug-off'
            };
        case ChargingState.ERROR:
            return {
                label: 'Error',
                color: 'error',
                icon: 'mdi-alert-circle'
            };
        case ChargingState.CHARGING:
            return {
                label: 'Charging',
                color: 'primary',
                icon: 'mdi-lightning-bolt'
            };
        case ChargingState.IDLE:
            return {
                label: 'Idle',
                color: 'success',
                icon: 'mdi-circle-medium'
            };
    }
}

export function batteryColor(level: number): string {
    if (level === 0) return 'grey';
    if (level <= 14 && level > 0) return '#E28080';
    if (level <= 39 && level >= 15 ) return '#E2A25D';
    if (level <= 79 && level >=40) return '#E8CB6B';
    if (level <=100 && level >= 80) return '#6FBF8B';
    return '#A5A8F0';
}