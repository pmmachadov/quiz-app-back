const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const topicRoutes = require('./routes/topicRoutes');
const qnaRoutes = require('./routes/qnaRoutes');
const topicQuestionsRoutes = require('./routes/topicQuestionsRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);
app.use('/api/topic', topicRoutes);
app.use('/api/answers', qnaRoutes);
app.use('/api/topic-questions', topicQuestionsRoutes);

if (process.env.NODE_ENV === 'production') {
    const frontEndPath = path.join(__dirname, '../../quiz-app-front-end/dist');

    app.use(express.static(frontEndPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(frontEndPath, 'index.html'));
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
