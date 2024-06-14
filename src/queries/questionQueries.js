module.exports = {
    GET_ALL_QUESTIONS: 'SELECT * FROM Questions',
    GET_QUESTION_BY_ID: 'SELECT * FROM Questions WHERE id = ?',
    CREATE_QUESTION: 'INSERT INTO Questions (text, answers) VALUES (?, ?)',
    UPDATE_QUESTION: 'UPDATE Questions SET text = ?, answers = ? WHERE id = ?',
    DELETE_QUESTION: 'DELETE FROM Questions WHERE id = ?',
};
