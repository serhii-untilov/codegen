/**
 * date/time helpers
 */

export function nowDateTime() {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');

    return {
        date: `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`,
        time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
    };
}
