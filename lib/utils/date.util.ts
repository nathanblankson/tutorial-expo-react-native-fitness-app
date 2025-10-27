/**
 * Formats a duration given in seconds into a human-readable string.
 * Examples:
 * - 45 seconds -> "45 s"
 * - 125 seconds -> "2 m 5 s"
 * - 3600 seconds -> "1 h"
 * - 3665 seconds -> "1 h 1 m 5 s"
 * @param seconds
 */
export function formatDuration(seconds: number): string {
    if (seconds < 60) {
        return `${seconds} s`;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
        if (remainingSeconds > 0) {
            return `${hours} h ${minutes} m ${remainingSeconds} s`;
        } else if (minutes > 0) {
            return `${hours} h ${minutes} m`;
        } else {
            return `${hours} h`;
        }
    } else {
        if (remainingSeconds > 0) {
            return `${minutes} m ${remainingSeconds} s`;
        } else {
            return `${minutes} m`;
        }
    }
}
