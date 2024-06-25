const { v4: uuidv4 } = require('uuid');
const questionModel = require('../models/questionModel');
const studentModel = require('../models/studentModel');

let games = [];
const waitingRooms = {};

function initializeSocket(io) {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('startGame', ({ topicId, gameCode }) => {
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
                        const icons = [
                            'fa-react', 'fa-js', 'fa-html5', 'fa-css3', 'fa-python', 'fa-java', 'fa-node', 'fa-php', 'fa-swift', 'fa-git',
                            'fa-docker', 'fa-aws', 'fa-android', 'fa-apple', 'fa-linux', 'fa-database', 'fa-code', 'fa-cloud', 'fa-terminal', 'fa-robot'
                        ];
                        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
                        const studentId = uuidv4();
                        await studentModel.createStudent(username, code, randomIcon);
                        student = { id: studentId, username, gameCode: code, icon: randomIcon };
                    }
                    if (!game.students.find(s => s.username === username)) {
                        game.students.push(student);
                        waitingRooms[code].students.push(student);
                        socket.join(code);
                        io.to(code).emit('studentsInRoom', waitingRooms[code].students);
                        socket.emit('loginSuccess', { game, student });
                    } else {
                        socket.emit('error', 'Username already taken');
                    }
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

        socket.on('joinGame', async ({ gameCode, username }) => {
            try {
                const game = games.find(g => g.gameCode === gameCode);
                if (game) {
                    const icons = [
                        'fa-react', 'fa-js', 'fa-html5', 'fa-css3', 'fa-python', 'fa-java', 'fa-node', 'fa-php', 'fa-swift', 'fa-git',
                        'fa-docker', 'fa-aws', 'fa-android', 'fa-apple', 'fa-linux', 'fa-database', 'fa-code', 'fa-cloud', 'fa-terminal', 'fa-robot'
                    ];
                    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
                    const student = { id: uuidv4(), username, icon: randomIcon };
                    game.students.push(student);
                    waitingRooms[gameCode].students.push(student);
                    socket.join(gameCode);
                    io.to(gameCode).emit('studentsInRoom', waitingRooms[gameCode].students);
                    socket.emit('joinedGame', { game, student });
                } else {
                    socket.emit('error', 'Invalid game code');
                }
            } catch (error) {
                console.error('Error joining game:', error);
                socket.emit('error', 'Join failed');
            }
        });
    });
}

module.exports = {
    initializeSocket,
};
