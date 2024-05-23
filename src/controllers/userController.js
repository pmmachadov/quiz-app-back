const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/data.json');

const readData = () => {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
};

exports.getAllStudents = (req, res) => {
    const data = readData();
    res.status(200).json(data.students);
};
