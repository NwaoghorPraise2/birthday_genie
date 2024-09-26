/* eslint-disable @typescript-eslint/no-floating-promises */
// Import essential modules for application functionality
import app from './app';
import config from './config/config';
import logger from './utils/logger';
import mongoDBConnector from './services/databaseService';
import rateLimiter from './config/rate-limiter';
import { Connection } from 'mongoose';

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
        // Assign the server port from config or default to 3000 if undefined
        this.port = Number(config.PORT) || 3000;
    }

    public startApp(): void {
        const server = app.listen(this.port);  // Start the server on the specified port
        
        (async () => {
            try {
                //Database Connection
                const connection = await mongoDBConnector.connect();
                logger.info('DATABASE CONNECTION', {
                    meta: {
                        name: connection?.name
                    }
                });

                //InitialRateLimiiter
                rateLimiter.initRatelimiter(connection as Connection);
                logger.info(`RATE LIMITER INITIALED`);


                // Log server startup details
                logger.info(`SERVER RUNNING ON ${this.port}`, {
                    meta: {
                        PORT: config.PORT,
                        SERVER_URL: config.SERVER_URL
                    }
                });
            } catch (error) {
                // Log error if logger fails and shut down the server gracefully
                logger.error('Failed to log server metadata:', { meta: error });

                // Safely close the server and exit the process with error code
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

// Instantiate and start the server
const server = new Server();
server.startApp();
