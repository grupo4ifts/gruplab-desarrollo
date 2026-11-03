const { sql, getConnection } = require('../database/connection');
const queries = require('../database/queries');

exports.obtenerAulas = async () => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request().query(queries.obtenerAulas);
        return resultado.recordset;
    } catch (error) {
        throw error;
    }
};

exports.crearAula = async (nombre, join_code, duenio) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('name', sql.NVarChar, nombre)
            .input('join_code', sql.NVarChar, join_code)
            .input('duenio', sql.NVarChar, duenio)
            .query(queries.crearAula);
        return resultado.recordset;
    } catch (error) {
        throw error;
    }
};

exports.obtenerAulaPorCodigo = async (join_code) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('join_code', sql.NVarChar, join_code)
            .query(queries.obtenerAulaPorCodigo);

        if (resultado.recordset.length === 0) {
            return [];
        }

        return resultado.recordset;
    } catch (error) {
        throw error;
    }
};

exports.obtenerAulaPorId = async (id) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(queries.obtenerAulaPorId);

        if (resultado.recordset.length === 0) {
            return [];
        }

        return resultado.recordset;
    } catch (error) {
        throw error;
    }
};

exports.eliminarAula = async (id) => {
    const pool = await getConnection();
    try {
        const aulaEncontrada = await pool.request()
            .input('id', sql.Int, id)
            .query(queries.obtenerAulaPorId);

        if (aulaEncontrada.recordset.length === 0) {
            return [];
        } else {
            await pool.request()
                .input('id', sql.Int, id)
                .query(queries.eliminarAula);

            return aulaEncontrada.recordset[0];
        }
    } catch (error) {
        throw error;
    }
};
