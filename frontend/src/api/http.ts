import axios from 'axios';

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    timeout: 5000,
});

export function extractErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        if (Array.isArray(msg)) {
            return msg.join(', ');
        }

        if (typeof msg === 'string') {
            return msg;
        }

        if (err.code === 'ECONNABORTED') {
            return 'Request timed out';
        }

        if (!err.response) {
            return 'Could not reach the server';
        }
    }
    return 'Something went wrong';
}