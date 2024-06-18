const questionModel = require('../models/questionModel');

exports.initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

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

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};
