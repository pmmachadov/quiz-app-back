const db = require('../config/db');

exports.getQuestionsByGame = async (req, res) => {
    const { gameId } = req.params;
    console.log(`Fetching questions for game ID: ${gameId}`);
    const [questions] = await db.query('SELECT * FROM Questions WHERE game_id = ?', [gameId]);
    for (let question of questions) {
        const [answers] = await db.query('SELECT * FROM Answers WHERE question_id = ?', [question.id]);
        question.answers = answers;
    }
    console.log('Questions fetched:', questions);
    res.json(questions);
};
