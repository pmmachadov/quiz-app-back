const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/topics', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM Topics');
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Error fetching topics' });
    }
});

router.get('/topics/:topicId/questions', async (req, res) => {
    const { topicId } = req.params;
    try {
        const [results] = await pool.query(`
            SELECT q.id AS question_id, q.statement, a.id AS answer_id, a.answer, a.is_correct
            FROM Questions q
            JOIN Answers a ON q.id = a.question_id
            WHERE q.topic_id = ?
        `, [topicId]);
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
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Error fetching questions' });
    }
});

module.exports = router;
