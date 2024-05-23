const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/qna.json');

const readData = () => {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
};

const getAllAnswers = () => {
    const data = readData();
    return data.answers;
};

const getAnswersByQuestionId = (questionId) => {
    const data = readData();
    return data.answers.filter(answer => answer.question_id === questionId);
};

module.exports = {
    getAllAnswers,
    getAnswersByQuestionId
};
