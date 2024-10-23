import os from 'os';
import config from '../config/config';
import {uptime} from 'process';

/**
 * HealthCheck class provides system and application health metrics.
 *
 * - System Health: Retrieves CPU load average, total memory, and free memory.
 * - Application Health: Tracks environment configuration, uptime, and memory usage statistics.
 *
 * Key Considerations:
 * - Resource Monitoring: Useful for monitoring system-level and application-level resource usage.
 * - Environment Awareness: Tracks the current environment from the configuration to aid in diagnostics.
 * - Uptime and Memory Usage: Provides real-time applicßßation performance metrics.
 */
class HealthCheck {
    private ENV: string;

    constructor() {
        this.ENV = config.ENV as string;
    }

    /**
     * Retrieves system-level health metrics.
     */
    getSystemHealth() {
        return {
            cpuUsage: os.loadavg(),
            totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
            freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`
        };
    }

    /**
     * Retrieves application-level health metrics, including uptime and memory usage.
     */
    getApplicationHealth() {
        return {
            environment: this.ENV,
            uptime: `${uptime()} seconds`,
            memoryUsage: {
                heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
                heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
            }
        };
    }
}

export default new HealthCheck();

