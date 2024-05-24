const fs = require('fs');
const path = require('path');

exports.getTopicQuestions = (req, res) => {
    const filePath = path.join(__dirname, '../data/topicQuestionsData.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading topic questions data' });
        }
        const questions = JSON.parse(data).questions;
        res.json(questions);
    });
};

exports.getQuestionById = (req, res) => {
    const filePath = path.join(__dirname, '../data/topicQuestionsData.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading topic questions data' });
        }
        const questions = JSON.parse(data).questions;
        const question = questions.find(q => q.id === parseInt(req.params.id));
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    });
};
