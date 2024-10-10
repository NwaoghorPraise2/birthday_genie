import { Request, Response, NextFunction } from 'express';

/**
 * AsyncMiddleware Class provides a utility for handling asynchronous middleware in Express.
 * 
 * - Error Handling: Wraps asynchronous route handlers to ensure that any errors are properly caught 
 *   and passed to the next error-handling middleware.
 * 
 * Key Considerations:
 * - Promises: Simplifies the use of async/await in middleware functions, ensuring that unhandled rejections 
 *   are caught and forwarded.
 * - Reusability: Allows for easy wrapping of any async function used as an Express middleware.
 */
class AsyncMiddleware {
    /**
     * Handles an asynchronous middleware function, catching errors and passing them to the next middleware.
     *
     * @param fn - The asynchronous middleware function to wrap
     * @returns A new function that takes Express request, response, and next parameters
     */
    handle(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
        return (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }
}

export default new AsyncMiddleware();
