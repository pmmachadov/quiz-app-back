-- Use the existing database
USE Quizz_app;

-- Create the Teachers table
CREATE TABLE Teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100)
);

-- Create the Sections table
CREATE TABLE Sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    teacher_id INT,
    FOREIGN KEY (teacher_id) REFERENCES Teachers(id)
);

-- Create the Tokens table
CREATE TABLE Tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(100) UNIQUE,
    section_id INT,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (section_id) REFERENCES Sections(id)
);

-- Create the Students table
CREATE TABLE Students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

-- Create the Connections table
CREATE TABLE Connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    token_id INT,
    FOREIGN KEY (student_id) REFERENCES Students(id),
    FOREIGN KEY (token_id) REFERENCES Tokens(id)
);

-- Create the Games table
CREATE TABLE Games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT,
    start_time DATETIME,
    duration INT, -- Duration in minutes
    FOREIGN KEY (section_id) REFERENCES Sections(id)
);

-- Create the Questions table
CREATE TABLE Questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    statement TEXT,
    difficulty ENUM('Easy', 'Medium', 'Hard'),
    game_id INT,
    FOREIGN KEY (game_id) REFERENCES Games(id)
);

-- Create the Answers table
CREATE TABLE Answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    answer TEXT,
    is_correct BOOLEAN,
    question_id INT,
    FOREIGN KEY (question_id) REFERENCES Questions(id)
);

-- Create the StudentAnswers table
CREATE TABLE StudentAnswers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    answer_id INT,
    FOREIGN KEY (student_id) REFERENCES Students(id),
    FOREIGN KEY (answer_id) REFERENCES Answers(id)
);

-- Create the Statistics table
CREATE TABLE Statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT,
    student_id INT,
    score INT,
    FOREIGN KEY (game_id) REFERENCES Games(id),
    FOREIGN KEY (student_id) REFERENCES Students(id)
);

-- comandos para reiniciar la tabla de teachers

-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE Teachers;
-- SET FOREIGN_KEY_CHECKS = 1;
-- select * from teachers;

ALTER TABLE Teachers ADD COLUMN isConfirmed BOOLEAN DEFAULT FALSE;

