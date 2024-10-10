import app from './app';
import config from './config/config';
import logger from './utils/logger';

/**
 * Server class responsible for initializing and managing the application server lifecycle.
 * 
 * - Initializes the server port using the configuration value or defaults to 3000.
 * - Handles server startup, logging, and graceful shutdown on critical errors (unhandled rejections, uncaught exceptions, termination signals).
 * - Ensures the server's observability and robust error handling to prevent running in an unstable state.
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

                process.on('unhandledRejection', (reason, promise) => {
                    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
                    server.close(() => {
                        process.exit(1);
                    });
                });
                
                process.on('uncaughtException', (error) => {
                    logger.error('Uncaught Exception:', { meta: error });
                    process.exit(1);
                });

                process.on('SIGINT', () => {
                    logger.info('SIGINT RECEIVED. Shutting down gracefully');
                    server.close(() => {
                        logger.info('Process terminated!');
                    });
                });

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
