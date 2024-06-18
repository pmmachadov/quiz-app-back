exports.findUserByEmail = 'SELECT * FROM Teachers WHERE email = ?';
exports.createUser = 'INSERT INTO Teachers (name, email, password) VALUES (?, ?, ?)';
exports.findUserById = 'SELECT * FROM Teachers WHERE id = ?';
exports.updateConfirmationStatus = 'UPDATE Teachers SET isConfirmed = ? WHERE id = ?';
