export function toDatetimeLocal(iso: string): string {
    const date = new Date(iso);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getFullYear()
    const hour =  date.getHours()
    const minutes = date.getMinutes()

    const pad= (n: number): string => {
        return String(n).padStart(2, '0');
    }
    return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minutes)}`;
}
