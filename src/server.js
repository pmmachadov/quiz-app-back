// server.js (Backend)
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
        origin: 'http://localhost:5173', // Cambia esto a la URL de tu cliente
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true // Permitir el envío de cookies y credenciales
    }
});

const gameController = require('./controllers/gameController');

app.use(cors({
    origin: 'http://localhost:5173', // Cambia esto a la URL de tu cliente
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true // Permitir el envío de cookies y credenciales
}));
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

// Inicializar el socket.io en gameController
gameController.initializeSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Aquí agregamos el manejo de eventos de socket.io
io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('studentRegisterOrLogin', ({ code, username }) => {
        console.log('studentRegisterOrLogin event received:', { code, username });

        // Simular alguna lógica para registrar o iniciar sesión al estudiante
        const game = { code, name: 'Sample Game' }; // Ejemplo de objeto de juego
        const student = { username }; // Ejemplo de objeto de estudiante

        // Emitir evento de éxito
        socket.emit('joinSuccess', { game, student });

        // Opcionalmente manejar errores
        // socket.emit('joinError', { error: 'Some error message' });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });
});
