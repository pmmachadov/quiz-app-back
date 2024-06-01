const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Importa las rutas
const userRoutes = require('./routes/userRoutes');
const topicRoutes = require('./routes/topicRoutes');

// Configuración de middlewares
app.use(cors());
app.use(express.json());

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

// Puerto de la aplicación
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
