import { ZodError } from 'zod';
import RequestValidator from '../types/validator.types';
import { NextFunction, Request, Response } from 'express';
import GlobalError from '../utils/HttpsErrors';

/**
 * Validator Class - Standardizes request validation using Zod schemas.
 * 
 * - Request Validation: Validates the request body, parameters, and query using the provided Zod schemas.
 * - Error Handling: Catches validation errors and transforms them into a standardized error format.
 * - Middleware: Acts as middleware in the Express.js framework to ensure that only valid requests proceed.
 * 
 * Key Considerations:
 * - Centralized Validation: By using a single class for validation, the application can maintain consistent error handling and validation logic.
 * - Asynchronous Parsing: Utilizes asynchronous parsing methods for Zod, ensuring non-blocking behavior during validation.
 * - Flexibility: Can validate various parts of the request (body, params, query) based on the provided schema.
 */
export default class Validator {
    /**
     * Validates the incoming request against the provided Zod schema.
     *
     * @param validator - The request validator object containing Zod schemas for body, params, and query
     * @returns A middleware function that validates the request
     */
    public static validateRequest(validator: RequestValidator) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (validator.body) {
                    req.body = await validator.body.parseAsync(req.body);
                }
                if (validator.params) {
                    req.params = await validator.params.parseAsync(req.params);
                }
                if (validator.query) {
                    req.query = await validator.query.parseAsync(req.query);
                }
    
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    const specificMessages = error.errors.map(err => err.message);    //Make better mesaage for error.
                    return next(new GlobalError(422, specificMessages.join(', ')));
                }
                next(error);
            }
        }
    }
}
