const { v4: uuidv4 } = require('uuid');

let games = [];
const waitingRooms = {}; // Store waiting room details

function initializeSocket(io) {
    io.on('connection', (socket) => {
        console.log('New client connected');

        // Start game event
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

        // Manejar evento de obtener temas
        socket.on('getTopics', async () => {
            try {
                const topics = await questionModel.findTopics();
                socket.emit('topics', topics);
            } catch (error) {
                socket.emit('error', 'Error fetching topics');
            }
        });

        // Manejar evento de obtener preguntas por tema
        socket.on('getQuestionsByTopic', async (topicId) => {
            try {
                const questions = await questionModel.findByTopicId(topicId);
                socket.emit('questions', questions);
            } catch (error) {
                socket.emit('error', 'Error fetching questions');
            }
        });

        // Join game event
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

        // Disconnect event
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
