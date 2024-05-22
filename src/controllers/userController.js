const fs = require('fs');
const path = require('path');

// Path to the JSON file
const dataPath = path.join(__dirname, '../data/data.json');

// Helper to read the JSON file
const readData = () => {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
};

// Get all students
exports.getAllStudents = (req, res) => {
    const data = readData();
    res.status(200).json(data.students);
};
