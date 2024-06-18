exports.findTopics = 'SELECT * FROM Topics';
exports.findQuestionsByTopicId = `
    SELECT q.id AS question_id, q.statement, a.id AS answer_id, a.answer, a.is_correct
    FROM Questions q
    JOIN Answers a ON q.id = a.question_id
    WHERE q.topic_id = ?
`;
