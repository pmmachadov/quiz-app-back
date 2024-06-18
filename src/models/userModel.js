const pool = require('../config/db');
const bcrypt = require('bcrypt');
const userQueries = require('../queries/userQueries');

exports.findByEmail = async (email) => {
    const [users] = await pool.query(userQueries.findUserByEmail, [email]);
    return users[0];
};

exports.createUser = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(userQueries.createUser, [name, email, hashedPassword]);
    return result.insertId;
};

exports.findById = async (id) => {
    const [users] = await pool.query(userQueries.findUserById, [id]);
    return users[0];
};

exports.updateConfirmationStatus = async (id) => {
    const [result] = await pool.query(userQueries.updateConfirmationStatus, [true, id]);
    return result.affectedRows;
};
