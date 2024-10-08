import { Express, Request, Response } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import logger from './logger';
import config from '../config/config';
import path from 'path';  // Use path module for resolving paths

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Birthday Genie API Docs',
            version: config.APP_VERSION as string,
            description: 'API documentation for Birthday Genie'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
    },
    apis: [path.resolve(__dirname, './src/router/*.ts')], // Use compiled JavaScript files
};

const swaggerSpec = (() => {
    try {
        return swaggerJsDoc(options);
    } catch (error) {
        logger.error('Error generating Swagger spec:', error);
        throw error;
    }
})();

class SwaggerDocs {
    private app: Express;
    private swaggerUi: typeof swaggerUi;
    private swaggerSpec: object;

    constructor(app: Express) {
        this.app = app;
        this.swaggerUi = swaggerUi;
        this.swaggerSpec = swaggerSpec;
        this.swaggerDocs();
    }

    private swaggerDocs = () => {
        this.app.use('/docs', this.swaggerUi.serve, this.swaggerUi.setup(this.swaggerSpec));

        logger.info(`Docs available at ${config.SERVER_URL}/docs`);

        // JSON format
        this.app.get('/docs.json', (req: Request, res: Response) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(this.swaggerSpec);
        });
    }
}

export default SwaggerDocs;
