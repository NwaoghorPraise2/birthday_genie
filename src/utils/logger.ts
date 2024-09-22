/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { createLogger, format, transports } from 'winston';
import 'winston-mongodb';
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports';
import util from 'util';
import config from '../config/config';
import { ApplicationENV } from '../constant/application';
import path from 'path';
import * as sourceMapSupport from 'source-map-support';
import { red, blue, yellow, green, magenta } from 'colorette';
import { MongoDBTransportInstance } from 'winston-mongodb';

// Enable source map support for better stack traces in error logging
sourceMapSupport.install();

/**
 * Logger Class - Sets up and configures a Winston logger instance
 * 
 * - Console Transport: In development, logs are colored and printed to the console with additional metadata.
 * - File Transport: Logs are written to a file in JSON format for structured logging, allowing easy parsing in production environments.
 * - Colorization: Levels (e.g., ERROR, WARN, INFO) are colorized for better readability in the console.
 * - Meta Handling: Supports inspecting objects in-depth and serializing errors with full stack traces when necessary.
 * - Source Map Support: Added for better debugging (especially for TypeScript stack traces).
 * 
 * Key Considerations:
 * - Separation of concerns between console and file transports depending on environment.
 * - Console logs are highly readable, leveraging colors and inspecting metadata deeply.
 * - File logs use structured JSON to enable easy parsing in log management systems (e.g., Elasticsearch, Loggly).
 * - The configuration is flexible enough to scale with production needs, where file logging is essential for persistent storage.
 */
class Logger {

    // Method to colorize the log level in console output
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

    // Custom log format for console output, includes colorized level, timestamp, and inspected metadata
    private consoleLogFormat = format.printf((info) => {
        const { timestamp, level, message, meta = {} } = info;

        const customLevel = this.colorizeLevel(level.toUpperCase());
        const customTimeStamp = green(timestamp as string);
        const customMeta = util.inspect(meta, { showHidden: false, depth: null, colors: true });

        return `${customLevel} - [${customTimeStamp}]: ${message}\n${magenta('META - ')} ${customMeta}\n`;
    });

    // Custom log format for file output, includes structured metadata, error serialization
    private fileLogFormat = format.printf((info) => {
        const { timestamp, level, message, meta = {} } = info;

        // Serialize metadata for better handling in log files
        const logMeta: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(meta)) {
            if (value instanceof Error) {
                logMeta[key] = {
                    name: value.name,
                    message: value.message,
                    trace: value.stack || '',
                };
            } else {
                logMeta[key] = value;
            }
        }

        const logData = {
            level: level.toUpperCase(),
            timestamp,
            message,
            meta: logMeta,
        };

        return JSON.stringify(logData, null, 4);
    });

    // Console transport for development environment with colorized output
    private consoleTransport = (): Array<ConsoleTransportInstance> => {
        if (config.ENV === ApplicationENV.DEVELOPMENT) {
            return [
                new transports.Console({
                    level: 'info',
                    format: format.combine(
                        format.timestamp(),
                        this.consoleLogFormat
                    ),
                }),
            ];
        }

        return [];
    };

    // File transport for structured log storage in all environments
    private fileTransport = (): Array<FileTransportInstance> => {
        return [
            new transports.File({
                filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
                level: 'info',
                format: format.combine(
                    format.timestamp(),
                    this.fileLogFormat
                ),
            }),
        ];
    };

    //Mongodb transport for storing logs in mongodb
    private mongoTransport = (): Array<MongoDBTransportInstance> => {
        return [
            new transports.MongoDB({
                db: config.DATABASE_URL as string,
                level: 'info',
                metaKey: 'meta',
                expireAfterSeconds: 3600 * 24 * 30,
                collection: 'app_logs',
                options: {
                    useUnifiedTopology: true,
                }
            }),
        ];
    };

    // Create and configure the logger instance
    public logger = createLogger({
        defaultMeta: {
            meta: {},  // Default metadata (can be extended to include app-specific metadata)
        },
        transports: [
            ...this.consoleTransport(),
            ...this.fileTransport(),
            ...this.mongoTransport(),
        ],
    });
}

export default new Logger().logger;
