// Type definition for a standard HTTP response object
export type ThttpResponse = {
    success: boolean,  // Indicates whether the request was successful
    statusCode: number,  // HTTP status code (e.g., 200, 404, 500)
    request: {
        ip?: string | null,  // Optional client IP address (may be omitted in production)
        method?: string,  // HTTP method used (e.g., GET, POST)
        url?: string,  // Requested URL
    },
    message: string,  // A message describing the response (e.g., "Success", "Resource not found")
    data: unknown  // The actual response payload (can be any type, depending on the API)
}

// Type definition for a standard HTTP error object
export interface ThttpError extends Error {
    success: boolean,  // Indicates whether the request was successful (false in the case of an error)
    statusCode: number,  // HTTP status code (e.g., 400, 500)
    request: {
        ip?: string | null,  // Optional client IP address (may be omitted in production)
        method?: string,  // HTTP method used (e.g., GET, POST)
        url?: string,  // Requested URL
    },
    message: string,  // A message describing the error (e.g., "Internal Server Error", "Bad Request")
    data: unknown,  // Additional data or information about the error (usually null)
    trace?: object | null  // Optional stack trace or error trace (omitted in production)
}
