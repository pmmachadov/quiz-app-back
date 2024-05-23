const Answer = require('../models/qna');

exports.getAllAnswers = (req, res) => {
    const answers = Answer.getAllAnswers();
    res.status(200).json(answers);
};

exports.getAnswersByQuestionId = (req, res) => {
    const answers = Answer.getAnswersByQuestionId(req.params.questionId);
    res.status(200).json(answers);
};
