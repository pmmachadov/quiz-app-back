const studentModel = require('../models/studentModel');
const authService = require('../services/authService');

const icons = [
    'FaBeer', 'FaCoffee', 'FaApple', 'FaAndroid', 'FaAngular',
    'FaReact', 'FaVuejs', 'FaNodeJs', 'FaPython', 'FaPhp',
    'FaJava', 'FaJs', 'FaGit', 'FaAws', 'FaDocker'
];

exports.registerOrLogin = async (req, res) => {
    const { code, username } = req.body;

    if (!code || !username) {
        return res.status(400).json({ message: 'Code and username are required' });
    }

    try {
        let student = await studentModel.findByUsername(username);
        if (!student) {
            const icon = icons[Math.floor(Math.random() * icons.length)];
            const studentId = await studentModel.createStudent(username, icon);
            student = { id: studentId, username, icon };
        }

        const token = authService.generateToken({ id: student.id });
        res.status(200).json({ token, icon: student.icon });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
