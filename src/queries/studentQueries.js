exports.findStudentByUsername = 'SELECT * FROM Students WHERE username = ?';
exports.createStudent = 'INSERT INTO Students (name, username) VALUES (?, ?)';
exports.findStudentById = 'SELECT * FROM Students WHERE id = ?';
exports.updateStudentPassword = 'UPDATE Students SET password = ? WHERE id = ?';
