const {
    getAllQuestions,
    getQuestionById,
    getQuestionsByStudentId,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = require('../models/question');

// Create a new question
exports.createQuestion = (req, res) => {
    const newQuestion = createQuestion(req.body);
    res.status(201).json(newQuestion);
};

// Get all questions
exports.getAllQuestions = (req, res) => {
    const questions = getAllQuestions();
    res.status(200).json(questions);
};

// Get a question by ID
exports.getQuestionById = (req, res) => {
    const question = getQuestionById(req.params.id);
    if (question) {
        res.status(200).json(question);
    } else {
        res.status(404).json({ error: 'Question not found' });
    }
};

// Get questions by student ID
exports.getQuestionsByStudentId = (req, res) => {
    const questions = getQuestionsByStudentId(req.params.student_id);
    res.status(200).json(questions);
};

// Update a question
exports.updateQuestion = (req, res) => {
    const updatedQuestion = updateQuestion(req.params.id, req.body);
    if (updatedQuestion) {
        res.status(200).json(updatedQuestion);
    } else {
        res.status(404).json({ error: 'Question not found' });
    }
};

// Delete a question
exports.deleteQuestion = (req, res) => {
    const deletedQuestion = deleteQuestion(req.params.id);
    if (deletedQuestion) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Question not found' });
    }
};
