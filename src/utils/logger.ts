/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {createLogger, format, transports} from 'winston';
import {ConsoleTransportInstance, FileTransportInstance} from 'winston/lib/winston/transports';
import util from 'util';
import config from '../config/config';
import {ApplicationENV} from '../constant/application';
import path from 'path';
import * as sourceMapSupport from 'source-map-support';
import {red, blue, yellow, green, magenta} from 'colorette';

// Enable source map support for better stack traces in error logging
sourceMapSupport.install();

/**
 * Logger class sets up and configures a Winston logger instance.
 *
 * - Development Logging: In development mode, logs are colorized and output to the console for readability.
 * - Production Logging: Logs are written to a file in JSON format, making them easy to parse and manage in production.
 * - Log Customization: Log levels (INFO, WARN, ERROR) are colorized for console output, and errors are serialized with full stack traces.
 * - Source Map Support: Improves debugging by enabling better TypeScript stack traces in log output.
 *
 * Key Considerations:
 * - Multi-Environment Support: Differentiates between development and production logging strategies.
 * - Structured Logging: File logs use structured JSON for easier analysis in log management systems.
 * - Extensibility: The logger can be extended to support additional transports (e.g., databases) for long-term storage or analysis.
 */
class Logger {
    /**
     * Method to colorize log levels for console output.
     */
    private colorizeLevel(level: string): string {
        switch (level) {
            case 'ERROR':
                return red(level);
            case 'WARN':
                return yellow(level);
            case 'INFO':
                return blue(level);
            default:
                return level;
        }
    }

    /**
     * Custom format for console logs, including colorized levels, timestamps, and metadata.
     */
    private consoleLogFormat = format.printf((info) => {
        const {timestamp, level, message, meta = {}} = info;

        const customLevel = this.colorizeLevel(level.toUpperCase());
        const customTimeStamp = green(timestamp as string);
        const customMeta = util.inspect(meta, {showHidden: false, depth: null, colors: true});

        return `${customLevel} - [${customTimeStamp}]: ${message}\n${magenta('META - ')} ${customMeta}\n`;
    });

    /**
     * Custom format for file logs, structured in JSON format with serialized metadata.
     */
    private fileLogFormat = format.printf((info) => {
        const {timestamp, level, message, meta = {}} = info;

        const logMeta: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(meta)) {
            if (value instanceof Error) {
                logMeta[key] = {
                    name: value.name,
                    message: value.message,
                    trace: value.stack || ''
                };
            } else {
                logMeta[key] = value;
            }
        }

        const logData = {
            level: level.toUpperCase(),
            timestamp,
            message,
            meta: logMeta
        };

        return JSON.stringify(logData, null, 4);
    });

    /**
     * Console transport for development environment with colorized log output.
     */
    private consoleTransport = (): Array<ConsoleTransportInstance> => {
        if (config.ENV === ApplicationENV.DEVELOPMENT) {
            return [
                new transports.Console({
                    level: 'info',
                    format: format.combine(format.timestamp(), this.consoleLogFormat)
                })
            ];
        }
        return [];
    };

    /**
     * File transport for structured logging in JSON format.
     */
    private fileTransport = (): Array<FileTransportInstance> => {
        return [
            new transports.File({
                filename: path.join(__dirname, '../', '../', '../', 'logs', `${config.ENV}.log`),
                level: 'info',
                format: format.combine(format.timestamp(), this.fileLogFormat)
            })
        ];
    };

    /**
     * Creates and configures the Winston logger instance.
     */
    public logger = createLogger({
        defaultMeta: {
            meta: {} // Default metadata for logs
        },
        transports: [...this.consoleTransport(), ...this.fileTransport()]
    });
}

export default new Logger().logger;

