const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

const gameController = require('./controllers/gameController');

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const topicRoutes = require('./routes/topicRoutes');
const studentRoutes = require('./routes/studentRoutes');

app.use('/api/user', userRoutes);
app.use('/api', topicRoutes);
app.use('/api/student', studentRoutes);

if (process.env.NODE_ENV === 'production') {
    const frontEndPath = path.join(__dirname, '../../quiz-app-front-end/dist');
    app.use(express.static(frontEndPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontEndPath, 'index.html'));
    });
}

gameController.initializeSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
