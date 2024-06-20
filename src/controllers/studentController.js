const studentModel = require('../models/studentModel');
const authService = require('../services/authService');

exports.registerOrLogin = async (req, res) => {
    const { gameCode, username } = req.body;

    console.log('Received gameCode:', gameCode);
    console.log('Received username:', username);

    if (!gameCode || !username) {
        console.error('Game code and username are required');
        return res.status(400).json({ message: 'Game code and username are required' });
    }

    try {
        let student = await studentModel.findByUsername(username);
        if (!student) {
            const studentId = await studentModel.createStudent(username, gameCode);
            student = { id: studentId, username, gameCode };
        }

        const token = authService.generateToken({ id: student.id });
        res.status(200).json({ token, game: gameCode, student });
    } catch (error) {
        console.error('Error during student registration or login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
