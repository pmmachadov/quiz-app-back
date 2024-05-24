const fs = require('fs');
const path = require('path');

const questionsFilePath = path.join(__dirname, '../data/topicQuestionsData.json');

const getAllQuestions = (req, res) => {
    fs.readFile(questionsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading JSON data' });
        }
        try {
            const questions = JSON.parse(data).questions;
            res.json({ questions });
        } catch (parseError) {
            res.status(500).json({ error: 'Error parsing JSON data' });
        }
    });
};

const getQuestionById = (req, res) => {
    fs.readFile(questionsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading JSON data' });
        }
        try {
            const questions = JSON.parse(data).questions;
            const question = questions.find(q => q.id === parseInt(req.params.id, 10));
            if (question) {
                res.json(question);
            } else {
                res.status(404).json({ error: 'Question not found' });
            }
        } catch (parseError) {
            res.status(500).json({ error: 'Error parsing JSON data' });
        }
    });
};

module.exports = {
    getAllQuestions,
    getQuestionById,
};
