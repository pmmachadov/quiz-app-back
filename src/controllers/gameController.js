const { v4: uuidv4 } = require('uuid');
const questionModel = require('../models/questionModel');

let games = [];
const waitingRooms = {};

function initializeSocket(io) {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('startGame', (topicId) => {
            const gameCode = Math.floor(100000 + Math.random() * 900000).toString();
            const game = {
                id: uuidv4(),
                topicId,
                gameCode,
                students: [],
            };
            games.push(game);
            waitingRooms[gameCode] = { students: [] };
            socket.join(gameCode);
            socket.emit('gameStarted', { gameCode });
            console.log(`Game started with code: ${gameCode} for topicId: ${topicId}`);
        });

        socket.on('studentLogin', async ({ code, username }) => {
            try {
                const game = games.find(g => g.gameCode === code);
                if (game) {
                    let student = await studentModel.findByUsername(username);
                    if (!student) {
                        const studentId = uuidv4();
                        await studentModel.createStudent(studentId, username);
                        student = { id: studentId, username };
                    }
                    game.students.push(student);
                    waitingRooms[code].students.push(student);
                    socket.join(code);
                    io.to(code).emit('studentsInRoom', waitingRooms[code].students);
                    socket.emit('loginSuccess', { game, student });
                } else {
                    socket.emit('error', 'Invalid game code');
                }
            } catch (error) {
                console.error('Error during student login:', error);
                socket.emit('error', 'Login failed');
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
            for (const gameCode in waitingRooms) {
                const students = waitingRooms[gameCode].students;
                const index = students.findIndex(student => student.id === socket.id);
                if (index !== -1) {
                    students.splice(index, 1);
                    io.to(gameCode).emit('studentsInRoom', students);
                    if (students.length === 0) {
                        delete waitingRooms[gameCode];
                        const gameIndex = games.findIndex(g => g.gameCode === gameCode);
                        if (gameIndex !== -1) {
                            games.splice(gameIndex, 1);
                        }
                    }
                    break;
                }
            }
        });

        socket.on('getTopics', async () => {
            try {
                console.log('getTopics event received');
                const topics = await questionModel.findTopics();
                console.log('Sending topics:', topics);
                socket.emit('topics', topics);
            } catch (error) {
                console.error('Error fetching topics:', error);
                socket.emit('error', 'Error fetching topics');
            }
        });

        socket.on('getQuestionsByTopic', async (topicId) => {
            try {
                console.log('getQuestionsByTopic event received for topicId:', topicId);
                const questions = await questionModel.findByTopicId(topicId);
                console.log('Sending questions:', questions);
                socket.emit('questions', questions);
            } catch (error) {
                console.error('Error fetching questions:', error);
                socket.emit('error', 'Error fetching questions');
            }
        });

        socket.on('joinGame', ({ gameCode, username }) => {
            const game = games.find(g => g.gameCode === gameCode);
            if (game) {
                const student = { id: uuidv4(), username };
                game.students.push(student);
                waitingRooms[gameCode].students.push(student);
                socket.join(gameCode);
                io.to(gameCode).emit('studentsInRoom', waitingRooms[gameCode].students);
                socket.emit('joinedGame', { game, student });
            } else {
                socket.emit('error', 'Invalid game code');
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
            for (const gameCode in waitingRooms) {
                const students = waitingRooms[gameCode].students;
                const index = students.findIndex(student => student.id === socket.id);
                if (index !== -1) {
                    students.splice(index, 1);
                    io.to(gameCode).emit('studentsInRoom', students);
                    if (students.length === 0) {
                        delete waitingRooms[gameCode];
                        const gameIndex = games.findIndex(g => g.gameCode === gameCode);
                        if (gameIndex !== -1) {
                            games.splice(gameIndex, 1);
                        }
                    }
                    break;
                }
            }
        });
    });
}

module.exports = {
    initializeSocket,
};
