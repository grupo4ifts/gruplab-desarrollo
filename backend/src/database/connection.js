const sql = require('mssql');
const dbConfig = require('./config');

exports.getConnection = async () => {
    const pool = await sql.connect(dbConfig);
    return pool;
};

exports.sql = sql;
