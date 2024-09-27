/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import fs from 'fs';

// Enable source map support for better stack traces in error logging
sourceMapSupport.install();

class Logger {

    private colorizeLevel(level: string): string {
        switch (level) {
            case 'ERROR': return red(level);
            case 'WARN': return yellow(level);
            case 'INFO': return blue(level);
            default: return level;
        }
    }

    private consoleLogFormat = format.printf((info) => {
        const { timestamp, level, message, meta = {} } = info;
        const customLevel = this.colorizeLevel(level.toUpperCase());
        const customTimeStamp = green(timestamp as string);
        const customMeta = util.inspect(meta, { showHidden: false, depth: null, colors: true });

        return `${customLevel} - [${customTimeStamp}]: ${message}\n${magenta('META - ')} ${customMeta}\n`;
    });

    private fileLogFormat = format.printf((info) => {
        const { timestamp, level, message, meta = {} } = info;
        const logMeta: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(meta)) {
            if (value instanceof Error) {
                logMeta[key] = { name: value.name, message: value.message, trace: value.stack || '' };
            } else {
                logMeta[key] = value;
            }
        }

        const logData = { level: level.toUpperCase(), timestamp, message, meta: logMeta };
        return JSON.stringify(logData, null, 4);
    });

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

    private fileTransport = (): Array<FileTransportInstance> => {
        const logPath = path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`);

        try {
            const dir = path.dirname(logPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
               // console.log(`Log directory created at: ${dir}`);
            }
        } catch (err) {
            this.logger.error('Failed to create log directory:', err);
        }
        if (config.ENV === ApplicationENV.PRODUCTION) {
            return [
                new transports.File({
                    filename: logPath,
                    level: 'info',
                    format: format.combine(
                        format.timestamp(),
                        this.fileLogFormat
                    ),
                }),
            ];
        }

        return [
            new transports.File({
                filename: logPath,
                level: 'info',
                format: format.combine(
                    format.timestamp(),
                    this.fileLogFormat
                ),
            }),
        ];
    };

    private mongoTransport = (): Array<MongoDBTransportInstance> => {
    //    this.logger.info('Initializing MongoDB Transport with DB URL:', config.DATABASE_URL);
        if (config.ENV !== ApplicationENV.PRODUCTION) {
            return [];
        }

        return [
            new transports.MongoDB({
                db: config.DATABASE_URL as string,
                level: 'info',
                metaKey: 'meta',
                expireAfterSeconds: 3600 * 24 * 30,
                collection: 'app_logs',
                options: {
                    useUnifiedTopology: true,
                },
            }),
        ];
    };

    public logger = createLogger({
        defaultMeta: { meta: {} },
        transports: [
            ...this.fileTransport(),
            ...this.consoleTransport(),
            ...this.mongoTransport(),
        ],
    });

    constructor() {
        // Global error handler for Winston logging errors
        this.logger.on('error', (err) => {
            this.logger.error('Winston logger encountered an error:', err);
        });
    }
}

export default new Logger().logger;
