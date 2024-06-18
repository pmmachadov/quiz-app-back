const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http'); // Añadido
const { Server } = require('socket.io'); // Añadido
require('dotenv').config();

// Crear la aplicación de Express
const app = express();

// Crear un servidor HTTP
const server = http.createServer(app); // Modificado

// Crear una instancia de Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*',
    }
}); // Modificado

// Importar el controlador de Socket.IO
const socketController = require('./controllers/socketController');

// Configuración de middlewares
app.use(cors());
app.use(express.json());

// Importa las rutas
const userRoutes = require('./routes/userRoutes');
const topicRoutes = require('./routes/topicRoutes');

// Usa las rutas
app.use('/api/user', userRoutes);
app.use('/api', topicRoutes);

// Configuración para producción
if (process.env.NODE_ENV === 'production') {
    const frontEndPath = path.join(__dirname, '../../quiz-app-front-end/dist');
    app.use(express.static(frontEndPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontEndPath, 'index.html'));
    });
}

// Inicializar Socket.IO usando el controlador
socketController.initializeSocket(io);

// Puerto de la aplicación
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
