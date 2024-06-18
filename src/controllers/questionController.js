const questionModel = require('../models/questionModel');

exports.getTopics = async (req, res) => {
    try {
        const topics = await questionModel.findTopics();
        res.status(200).json(topics);
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Error fetching topics' });
    }
};

exports.getQuestionsByTopic = async (req, res) => {
    const { topicId } = req.params;
    try {
        const questions = await questionModel.findByTopicId(topicId);
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Error fetching questions' });
    }
};
