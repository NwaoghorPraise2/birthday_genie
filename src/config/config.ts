export default {
    // General
    APP_NAME: process.env.APP_NAME,
    ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    APP_VERSION: process.env.APP_VERSION,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BASE_URL: process.env.BASE_URL,
    ClIENT_URL: process.env.CLIENT_URL,
    CRYPTO_SECRET: process.env.CRYPTO_SECRET,

    // Database
    POSTGRES_URL: process.env.POSTGRES_URL,

    //HASH
    HASH_SALT: process.env.HASH_SALT,

    //CLOUDINARY
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,

    //JWT
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

    //EMAIL
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    EMAIL_FROM: process.env.EMAIL_FROM,

    //OAUTH
    GOOGLE_CLIENT_ID: process.env.CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.CALLBACK_URL,

    //OPENAI
    OPEN_AI_SECRET: process.env.OPEN_AI_SECRET
};

