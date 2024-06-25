const studentModel = require('../models/studentModel');
const authService = require('../services/authService');
const { v4: uuidv4 } = require('uuid');

exports.studentRegisterOrLogin = async (req, res) => {
    const { gameCode, username } = req.body;

    if (!gameCode || !username) {
        return res.status(400).json({ message: 'Game code and username are required' });
    }

    try {
        let student = await studentModel.findByUsername(username);
        if (!student) {
            const icons = [
                'fa-react', 'fa-js', 'fa-html5', 'fa-css3', 'fa-python', 'fa-java', 'fa-node', 'fa-php', 'fa-swift', 'fa-git',
                'fa-docker', 'fa-aws', 'fa-android', 'fa-apple', 'fa-linux', 'fa-database', 'fa-code', 'fa-cloud', 'fa-terminal', 'fa-robot'
            ];
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            const studentId = await studentModel.createStudent(username, gameCode, randomIcon);
            student = { id: studentId, username, gameCode, icon: randomIcon };
        }

        const token = authService.generateToken({ id: student.id });
        res.status(200).json({ token, student });
    } catch (error) {
        console.error('Error during student registration or login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
