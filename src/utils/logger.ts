/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { createLogger, format, transports } from 'winston';
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports';
import util from 'util';
import config from '../config/config';
import { ApplicationENV } from '../constant/application';
import path from 'path';
import * as sourceMapSupoort from 'source-map-support';
import {red, blue, yellow, green, magenta} from 'colorette';

sourceMapSupoort.install();


class Logger {
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


    private consoleLogFormat = format.printf((info) => {
         
        const { timestamp, level, message, meta = {}} = info;

        const customLevel = this.colorizeLevel(level.toUpperCase());
         
        const customTimeStamp = green(timestamp as string);
         
        const customMessage = message;
        const customMeta = util.inspect(meta, { showHidden: false, depth: null, colors: true });

        const customLog = `${customLevel} - [${customTimeStamp}]: ${customMessage}\n${magenta('META - ')} ${customMeta}\n`;

        return customLog;
    });

    private fileLogFormat = format.printf((info) => {
         
        const { timestamp, level, message, meta = {}} = info;

        const logMeta: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(meta)){
            if (value instanceof Error){
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

    private consoleTransport = (): Array<ConsoleTransportInstance> => {
        if (config.ENV === ApplicationENV.DEVELOPMENT){
            return [
                new transports.Console({
                    level: 'info',
                    format: format.combine(
                        format.timestamp(),
                        this.consoleLogFormat
                    )
                })
            ];
        }

        return [];
    };

    private fileTransport = (): Array<FileTransportInstance> => {
        return [
            new transports.File({
                filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
                level: 'info',
                format: format.combine(
                    format.timestamp(),
                    this.fileLogFormat
                )
            })
        ];
    };

    public logger = createLogger({
        defaultMeta: {
            meta: {}
        },
        transports: [
            ...this.consoleTransport(),
            ...this.fileTransport()
        ]
    });
}

export default new Logger().logger;
