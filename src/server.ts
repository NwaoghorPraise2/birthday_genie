import app from './app';
import config from './config/config';
import logger from './utils/logger';

class Server {
    private port: number;

    constructor(){
        this.port = Number(config.PORT) || 3000;
    }

    public startApp(): void {
        const server = app.listen(this.port);
    
        (() => {  
            try {
                logger.info(`SERVER RUNNING ON ${this.port}`, {
                    meta: {
                        PORT: config.PORT,
                        SERVER_URL: config.SERVER_URL
                    }
                });
            } catch (error) {
                logger.error(`Failed to log server metadata:`, { meta: error });

                server.close((error) => {
                    if (error) {
                    logger.error('Server closed due to logging failure');
                    }

                    process.exit(1);
                })
            }
        })();
    }
    
}

const server = new Server();
server.startApp();