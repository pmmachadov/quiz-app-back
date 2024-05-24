const express = require('express');
const app = express();
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const topicRoutes = require('./routes/topicRoutes');
const qnaRoutes = require('./routes/qnaRoutes');
const topicQuestionsRoutes = require('./routes/topicQuestionsRoutes');

app.use(express.json());

app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);
app.use('/api/topic', topicRoutes);
app.use('/api/answers', qnaRoutes);
app.use('/api/topic-questions', topicQuestionsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
