const express = require('express');
const app = express();
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const topicRoutes = require('./routes/topicRoutes');

app.use(express.json());

app.use('/api', quizRoutes);
app.use('/api', userRoutes);
app.use('/api', topicRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
