import app from './app';
import config from './config/config';
import logger from './utils/logger';

/**
 * Server class to handle the application server initialization and startup
 * 
 * - The constructor initializes the server's port, using the value from the config or a default.
 * - The `startApp` method handles starting the server, logging successful initialization, 
 *   and implementing error handling for graceful failure and shutdown in case of logging errors.
 * - This ensures that the server has observability (through logging) and handles failures with a safe exit.
 * 
 * Key Considerations:
 * - Environment Variables: The port is retrieved from a configuration file (`config.PORT`).
 * - Logging: Logs both successful and failed server startups for monitoring and debugging.
 * - Graceful Shutdown: In the event of a logging error, the server shuts down safely to avoid running in a broken state.
 */
class Server {
    private port: number;

    constructor() {
        this.port = Number(config.PORT) || 3000;
    }

    public startApp(): void {
        const server = app.listen(this.port, '0.0.0.0');  
        (() => {
            try {
                logger.info(`SERVER RUNNING ON ${this.port}`, {
                    meta: {
                        PORT: config.PORT,
                        SERVER_URL: config.SERVER_URL
                    }
                });
                // process.on('unhandledRejection', (reason, promise) => {
                //     logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
                //     server.close(() => {
                //         process.exit(1);
                //     });
                // });
                // process.on('uncaughtException', (error) => {
                //     logger.error('Uncaught Exception:', { meta: error });
                //     process.exit(1);
                // });
                // process.on('SIGTERM', () => {
                //     logger.info('SIGTERM RECEIVED. Shutting down gracefully');
                //     server.close(() => {
                //         logger.info('Process terminated!');
                //     });
                // });
                // process.on('SIGINT', () => {
                //     logger.info('SIGINT RECEIVED. Shutting down gracefully');
                //     server.close(() => {
                //         logger.info('Process terminated!');
                //     });
                // });
            } catch (error) {
                logger.error('Failed to log server metadata:', { meta: error });

                server.close((error) => {
                    if (error) {
                        logger.error('Server closed due to logging failure');
                    }
                    process.exit(1);
                });
            }
        })();
    }
}

const server = new Server();
server.startApp();
