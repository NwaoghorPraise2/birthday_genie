class GlobalError extends Error {
    public message: string;
    private statusCode: number;
    private success: boolean;

    constructor(statusCode: number, message: string){
        super(message);
        this.message = message;
        this.statusCode = 500;
        this.success = false;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default GlobalError;