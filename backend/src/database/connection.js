const sql = require('mssql');
const dbConfig = require('./config');

exports.getConnection = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        return pool;
    } catch (error) {
        throw new Error('No se puedo conectar a la base de datos.');
    }
};

exports.sql = sql;
