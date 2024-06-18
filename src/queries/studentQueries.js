exports.findStudentByUsername = 'SELECT * FROM Students WHERE username = ?';
exports.createStudent = 'INSERT INTO Students (username, icon) VALUES (?, ?)';
exports.findStudentById = 'SELECT * FROM Students WHERE id = ?';
