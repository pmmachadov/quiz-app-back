const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Path to the JSON file
const dataPath = path.join(__dirname, '../data/data.json');

// Helper to read the JSON file
const readData = () => {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
};

// Helper to write to the JSON file
const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

const getAllQuestions = () => {
    const data = readData();
    return data.questions;
};

const getQuestionById = (id) => {
    const data = readData();
    return data.questions.find(question => question.id === id);
};

const getQuestionsByStudentId = (studentId) => {
    const data = readData();
    return data.questions.filter(question => question.student_id === studentId);
};

const createQuestion = (newQuestion) => {
    const data = readData();
    newQuestion.id = uuidv4();
    data.questions.push(newQuestion);
    writeData(data);
    return newQuestion;
};

const updateQuestion = (id, updatedQuestion) => {
    const data = readData();
    const index = data.questions.findIndex(question => question.id === id);
    if (index !== -1) {
        data.questions[index] = { ...data.questions[index], ...updatedQuestion };
        writeData(data);
        return data.questions[index];
    }
    return null;
};

const deleteQuestion = (id) => {
    const data = readData();
    const index = data.questions.findIndex(question => question.id === id);
    if (index !== -1) {
        const deletedQuestion = data.questions.splice(index, 1);
        writeData(data);
        return deletedQuestion;
    }
    return null;
};

module.exports = {
    getAllQuestions,
    getQuestionById,
    getQuestionsByStudentId,
    createQuestion,
    updateQuestion,
    deleteQuestion
};
