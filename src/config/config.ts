
export default {
    // General
    APP_NAME: process.env.APP_NAME,
    ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    APP_VERSION: process.env.APP_VERSION,

    // Database
    POSTGRES_URL: process.env.POSTGRES_URL,

    //HASH
    HASH_SALT: process.env.HASH_SALT,

    //CLOUDINARY
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET
};