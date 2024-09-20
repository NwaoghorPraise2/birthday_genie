export type ThttpResponse = {
    success: boolean,
    statusCode: number,
    request: {
        ip?: string | null,
        method?: string,
        url?: string,
    }
    message: string,
    data: unknown
}

export type ThttpError = {
    success: boolean,
    statusCode: number,
    request: {
        ip?: string | null,
        method?: string,
        url?: string,
    }
    message: string,
    data: unknown,
    trace?: object | null
}