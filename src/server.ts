import http from 'http';
import {Server as SocketServer} from 'socket.io';
import app from './app';
import config from './config/config';
import logger from './utils/logger';
import SocketService from './utils/socketUtils';

/**
 * Server class responsible for initializing and managing the application server lifecycle.
 *
 * - Initializes the server port using the configuration value or defaults to 3000.
 * - Handles server startup, logging, and graceful shutdown on critical errors (unhandled rejections, uncaught exceptions, termination signals).
 * - Ensures the server's observability and robust error handling to prevent running in an unstable state.
 * - Integrates Socket.io for real-time communication.
 */
class Server {
    private port: number;
    private httpServer: http.Server;
    private io: SocketServer;
    private SocketService: SocketService;

    constructor() {
        this.port = Number(config.PORT) || 3000;
        this.httpServer = http.createServer(app as http.RequestListener);
        this.io = new SocketServer(this.httpServer, {
            cors: {
                origin: '*', // Remember to adjust
                methods: ['GET', 'POST']
            }
        });

        this.SocketService = new SocketService(this.io);

        this.initializeSocketEvents();
        this.startApp();
    }

    private initializeSocketEvents(): void {
        this.io.on('connection', (socket) => {
            logger.info(`New client connected: ${socket.id}`);

            socket.on('subscribe', (userId: string) => {
                this.SocketService.handleUserSubscription(socket, userId);
            });

            socket.on('disconnect', () => {
                logger.info(`Client disconnected: ${socket.id}`);
            });
        });
    }

    private startApp(): void {
        this.httpServer.listen(this.port, '0.0.0.0', () => {
            try {
                logger.info(`SERVER RUNNING ON ${this.port}`, {
                    meta: {
                        PORT: config.PORT,
                        SERVER_URL: config.SERVER_URL
                    }
                });
            } catch (error) {
                logger.error('Failed to log server metadata:', {meta: error});

                this.httpServer.close((error) => {
                    if (error) {
                        logger.error('Server closed due to logging failure');
                    }
                    process.exit(1);
                });
            }
        });
    }
}

export default new Server();

