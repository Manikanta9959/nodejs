import dotenv from "dotenv";
dotenv.config();

const config = {
    LOG_DIR : process.env.LOG_DIR,
    APP_PORT : process.env.APP_PORT,
    csvFilePath: process.env.CSV_FILE_PATH || './input.csv',
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 3306,
    USER: process.env.USER || 'root',
    PASSWORD: process.env.PASSWORD || 'admin123',
    DB: process.env.DB || 'testdb'
};
export default config;
