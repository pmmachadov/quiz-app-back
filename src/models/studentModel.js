const pool = require('../config/db');
const bcrypt = require('bcrypt');
const studentQueries = require('../queries/studentQueries');

exports.findByUsername = async (username) => {
    const [students] = await pool.query(studentQueries.findStudentByUsername, [username]);
    return students[0];
};

exports.createStudent = async (name, username) => {
    const [result] = await pool.query(studentQueries.createStudent, [name, username]);
    return result.insertId;
};

exports.findById = async (id) => {
    const [students] = await pool.query(studentQueries.findStudentById, [id]);
    return students[0];
};

exports.updatePassword = async (id, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(studentQueries.updateStudentPassword, [hashedPassword, id]);
    return result.affectedRows;
};
