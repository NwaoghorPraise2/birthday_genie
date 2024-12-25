import {Express, Request, Response} from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import logger from './logger';
import config from '../config/config';

const options = {
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
        }
    },
    apis: ['./src/router/*.ts']
};

/**
 * SwaggerDocs class integrates Swagger documentation with the Express application.
 *
 * - Swagger setup: Configures Swagger UI and serves the API documentation.
 * - JWT Authentication: Supports bearer token authentication through Swagger security schemes.
 * - Documentation routes: Exposes `/docs` for the UI and `/docs.json` for the raw JSON format of the API documentation.
 *
 * Key Considerations:
 * - API Discoverability: Enhances API discoverability and documentation through a user-friendly Swagger interface.
 * - Security: Includes support for JWT-based authentication in the API documentation.
 * - Maintainability: Automatically reads API routes for dynamic and up-to-date documentation.
 */
class SwaggerDocs {
    private app: Express;
    private swaggerUi;
    private swaggerSpec;

    constructor(app: Express) {
        this.app = app;
        this.swaggerUi = swaggerUi;
        this.swaggerSpec = swaggerJsDoc(options);
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
    };
}

export default SwaggerDocs;

