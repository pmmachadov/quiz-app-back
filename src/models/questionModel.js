const pool = require('../config/db');
const questionQueries = require('../queries/questionQueries');

exports.findTopics = async () => {
    const [results] = await pool.query(questionQueries.findTopics);
    console.log('Topics from database:', results);
    return results;
};

exports.findByTopicId = async (topicId) => {
    const [results] = await pool.query(questionQueries.findQuestionsByTopicId, [topicId]);

    return results.reduce((acc, row) => {
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
};
