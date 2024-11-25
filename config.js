import dotenv from "dotenv";
dotenv.config();

const config = {
    APP_PORT : process.env.APP_PORT || 4000,
    csvFilePath: process.env.CSV_FILE_PATH || './input.csv',
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 5432,
    USER: process.env.USER || 'postgres',
    PASSWORD: process.env.PASSWORD || 'admin123',
    DB: process.env.DB || 'postgres'
};
export default config;
