const fs = require('fs');
const path = require('path');

exports.getTopics = (req, res) => {
    const filePath = path.join(__dirname, '../data/topics.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to read topics file' });
        }
        const topics = JSON.parse(data);
        res.json(topics);
    });
};
