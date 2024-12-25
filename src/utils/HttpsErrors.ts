/**
 * GlobalError class extends the native Error object to provide custom error handling.
 *
 * - Status Code: Defaults to 500 but can be customized when instantiating the error.
 * - Success Flag: Indicates whether the request was successful (always `false` for errors).
 * - Stack Trace: Automatically captures the stack trace for easier debugging.
 *
 * Key Considerations:
 * - Custom Error Handling: This class can be used to throw structured errors throughout the application,
 *   simplifying the process of creating consistent error responses.
 * - Extendability: The structure allows for further customization, such as adding more error metadata or logging.
 */
class GlobalError extends Error {
    public message: string;
    private statusCode: number;
    private success: boolean;

    constructor(statusCode: number, message: string) {
        super(message);
        this.message = message;
        this.statusCode = statusCode || 500;
        this.success = false;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default GlobalError;

