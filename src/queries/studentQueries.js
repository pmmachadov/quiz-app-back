exports.findStudentByUsername = 'SELECT * FROM Students WHERE username = ?';
exports.createStudent = 'INSERT INTO Students (username, game_code, icon) VALUES (?, ?, ?)';
exports.findStudentById = 'SELECT * FROM Students WHERE id = ?';
