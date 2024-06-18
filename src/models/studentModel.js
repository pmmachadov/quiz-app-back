const pool = require('../config/db');
const studentQueries = require('../queries/studentQueries');

exports.findByUsername = async (username) => {
    const [students] = await pool.query(studentQueries.findStudentByUsername, [username]);
    return students[0];
};

exports.createStudent = async (username, icon) => {
    const [result] = await pool.query(studentQueries.createStudent, [username, icon]);
    return result.insertId;
};

exports.findById = async (id) => {
    const [students] = await pool.query(studentQueries.findStudentById, [id]);
    return students[0];
};
