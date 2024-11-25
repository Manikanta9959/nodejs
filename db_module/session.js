import config from '../config.js';
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
    host: config.HOST,
    port: config.PORT,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB,
});


