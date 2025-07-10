import { ConnectionConfiguration } from 'tedious';
import 'dotenv/config';

export const configuration: ConnectionConfiguration = {
    server: 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DBUSERNAME,
            password: process.env.PASSWORD,
        },
    },
    options: {
        database: 'bookish',
        trustServerCertificate: true,
        encrypt: false,
    },
};