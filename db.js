const mysql = require('mysql');

const pool = mysql.createPool({
    host: process.env.HOSTNAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORTDB,
    database: process.env.DATABASE,
    multipleStatements: process.env.MULTIPLESTATEMENTS
});

global.db = pool;