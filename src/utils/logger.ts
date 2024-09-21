import {createLogger, format, transports} from 'winston';
import { ConsoleTransportInstance } from 'winston/lib/winston/transports';
import util from 'util';

class Logger {
    private consoleLogFormat = format.printf((info) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { timestamp, level, message, meta = {}} = info;

        const customLevel = level.toUpperCase();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const customTimeStamp = timestamp;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const customMessage = message;
        const customMeta = util.inspect(meta, { showHidden: false, depth: null });

        const customLog = `${customLevel} - [${customTimeStamp}]: ${customMessage}\n${'META - '} ${customMeta}\n`

        return customLog;
    });


    private consoleTransport = (): Array<ConsoleTransportInstance> => {
        return [
            new transports.Console({
                level: 'info',
                format: format.combine(
                    format.timestamp(),
                    this.consoleLogFormat
                )
            })

        ];
    };


    public logger = createLogger({
        defaultMeta:{
            meta: {

            }
        },
        transports:[
            ...this.consoleTransport()
        ]
    });
}

export default new Logger().logger;