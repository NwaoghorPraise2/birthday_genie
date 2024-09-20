import app from './app';
import config from './config/config';

class Server {
    private port: number;

    constructor(){
        this.port = Number(config.PORT) || 3000;
    }

    public startApp(): void {
        const server = app.listen(this.port);
    
        (() => {  
            try {
                console.info(`Server running on port ${this.port}`, {
                    meta: {
                        PORT: config.PORT,
                        SERVER_URL: config.SERVER_URL
                    }
                });
            } catch (error) {
                console.error(`Failed to log server metadata:`, { meta: error });

                server.close((error) => {
                    if (error) {
                    console.error('Server closed due to logging failure');
                    }

                    process.exit(1);
                })
            }
        })();
    }
    
}

const server = new Server();
server.startApp();