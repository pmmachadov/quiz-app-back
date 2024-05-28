// questionController.js
const db = require('../config/db');

exports.getQuestionsByGame = async (req, res) => {
    const { gameId } = req.params;
    const [questions] = await db.query('SELECT * FROM Questions WHERE game_id = ?', [gameId]);
    for (let question of questions) {
        const [answers] = await db.query('SELECT * FROM Answers WHERE question_id = ?', [question.id]);
        question.answers = answers;
    }
    res.json(questions);
};
