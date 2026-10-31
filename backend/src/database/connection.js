const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

exports.getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        console.log("¡Conectado exitosamente a AWS RDS (SQL Server)!");
        return pool;
    } catch (error) {
        console.error("Error al conectar con la base de datos de AWS:", error);
        throw error;
    }
};

exports.sql = sql;