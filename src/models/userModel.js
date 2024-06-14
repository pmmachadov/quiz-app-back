const pool = require('../config/db');

const getUserByEmail = async (email) => {
    const [result] = await pool.query('SELECT * FROM Teachers WHERE email = ?', [email]);
    return result;
};

const createUser = async (name, email, hashedPassword) => {
    const [result] = await pool.query('INSERT INTO Teachers (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    return result;
};

const confirmUserEmail = async (userId) => {
    const [result] = await pool.query('UPDATE Teachers SET isConfirmed = ? WHERE id = ?', [true, userId]);
    return result;
};

module.exports = {
    getUserByEmail,
    createUser,
    confirmUserEmail,
};
