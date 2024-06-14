const pool = require('../config/db');
const queries = require('../queries/questionQueries');

const getAllQuestions = async () => {
    const [result] = await pool.query(queries.GET_ALL_QUESTIONS);
    return result;
};

const getQuestionById = async (id) => {
    const [result] = await pool.query(queries.GET_QUESTION_BY_ID, [id]);
    return result;
};

const createQuestion = async (text, answers) => {
    const [result] = await pool.query(queries.CREATE_QUESTION, [text, JSON.stringify(answers)]);
    return result;
};

const updateQuestion = async (id, text, answers) => {
    const [result] = await pool.query(queries.UPDATE_QUESTION, [text, JSON.stringify(answers), id]);
    return result;
};

const deleteQuestion = async (id) => {
    const [result] = await pool.query(queries.DELETE_QUESTION, [id]);
    return result;
};

module.exports = {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
};
