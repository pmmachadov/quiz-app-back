const questionModel = require('../models/questionModel');

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await questionModel.getAllQuestions();
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getQuestionById = async (req, res) => {
    const { id } = req.params;
    try {
        const question = await questionModel.getQuestionById(id);
        if (question.length === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json(question[0]);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createQuestion = async (req, res) => {
    const { text, answers } = req.body;
    try {
        const result = await questionModel.createQuestion(text, answers);
        res.status(201).json({ id: result.insertId, text, answers });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { text, answers } = req.body;
    try {
        const result = await questionModel.updateQuestion(id, text, answers);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json({ id, text, answers });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await questionModel.deleteQuestion(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
