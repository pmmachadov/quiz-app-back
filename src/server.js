const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ➔ Cambiar origin a una lista que incluya el origen permitido, no usar '*'
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
const io = new Server(server, {
    cors: {
        origin: allowedOrigins, // Permitir la lista de orígenes
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
});

const gameController = require('./controllers/gameController');

// ➔ Cambiar origin a una lista que incluya el origen permitido, no usar '*'
app.use(cors({
    origin: allowedOrigins, // Permitir la lista de orígenes
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));

app.use(express.json());

// Definir rutas
const userRoutes = require('./routes/userRoutes');
const topicRoutes = require('./routes/topicRoutes');
const studentRoutes = require('./routes/studentRoutes');

app.use('/api/user', userRoutes);
app.use('/api', topicRoutes);
app.use('/api/student', studentRoutes);

// Configurar la entrega de archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
    const frontEndPath = path.join(__dirname, '../../quiz-app-front-end/dist');
    app.use(express.static(frontEndPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontEndPath, 'index.html'));
    });
}

// Inicializar los sockets
gameController.initializeSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Manejar las conexiones socket.io
io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    // Manejar el evento personalizado 'studentRegisterOrLogin'
    socket.on('studentRegisterOrLogin', ({ code, username }) => {
        console.log('studentRegisterOrLogin event received:', { code, username });

        const game = { code, name: 'Sample Game' }; // Ejemplo de objeto de juego
        const student = { username }; // Ejemplo de objeto de estudiante

        socket.emit('joinSuccess', { game, student }); // Emitir evento de éxito
    });

    // Manejar la desconexión
    socket.on('disconnect', (reason) => {
        console.log('user disconnected:', socket.id, 'reason:', reason);
    });

    // Manejar errores de conexión
    socket.on('connect_error', (err) => {
        console.log('Connection error:', err);
    });
});
