const sql = require('mssql');
const { dbConfig } = require('./config');

exports.getConnection = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        return pool;
    } catch (error) {
        throw error;
    }
};

exports.sql = sql;