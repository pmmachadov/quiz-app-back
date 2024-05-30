const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todos los temas
router.get('/topics', (req, res) => {
    const query = 'SELECT * FROM Topics';
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching topics:', err);
            res.status(500).json({ error: 'Error fetching topics' });
        } else {
            console.log('Topics fetched:', results);
            res.status(200).json(results);
        }
    });
});

// Obtener preguntas y respuestas para un tema específico
router.get('/topics/:topicId/questions', (req, res) => {
    const { topicId } = req.params;
    const query = `
    SELECT q.id AS question_id, q.statement, a.id AS answer_id, a.answer, a.is_correct
    FROM Questions q
    JOIN Answers a ON q.id = a.question_id
    WHERE q.topic_id = ?;
  `;
    pool.query(query, [topicId], (err, results) => {
        if (err) {
            console.error('Error fetching questions:', err);
            res.status(500).json({ error: 'Error fetching questions' });
        } else {
            const formattedResults = results.reduce((acc, row) => {
                const question = acc.find(q => q.question_id === row.question_id);
                const answer = { answer_id: row.answer_id, answer: row.answer, is_correct: row.is_correct };
                if (question) {
                    question.answers.push(answer);
                } else {
                    acc.push({
                        question_id: row.question_id,
                        statement: row.statement,
                        answers: [answer]
                    });
                }
                return acc;
            }, []);
            res.status(200).json(formattedResults);
        }
    });
});

module.exports = router;
