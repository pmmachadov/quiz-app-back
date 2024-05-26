const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../config/email');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  console.log('Received data:', { name, email, password });

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO Teachers (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const mailOptions = {
      from: `"Quiz App" <${process.env.QUIZZ_APP_EMAIL}>`,
      to: email,
      subject: 'Confirm your email',
      html: `
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
          <h2>Confirm your registration on QuizzApp</h2>
          <p>Click the button below to confirm your email address and complete your registration.</p>
          <a href="${process.env.CLIENT_URL}/confirm/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Confirm</a>
        </div>
      `,
    };

    console.log('Sending email with options:', mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Email could not be sent', error });
      } else {
        console.log('Email sent successfully:', info);
        res.status(200).json({ message: 'Registration successful, please confirm your email' });
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.confirmEmail = async (req, res) => {
  const token = req.params.token;
  console.log('Token received for confirmation:', token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const [user] = await pool.query('SELECT * FROM Teachers WHERE id = ?', [decoded.id]);
    console.log('User found:', user);

    if (user.length === 0) {
      console.log('User not found with ID:', decoded.id);
      return res.redirect(`${process.env.CLIENT_URL}/confirm?success=false`);
    }

    const [updateResult] = await pool.query('UPDATE Teachers SET isConfirmed = ? WHERE id = ?', [true, decoded.id]);
    console.log('Update result:', updateResult);

    if (updateResult.affectedRows === 0) {
      console.log('No rows affected. Update failed for user ID:', decoded.id);
      throw new Error('Failed to update confirmation status.');
    }

    return res.redirect(`${process.env.CLIENT_URL}/confirm?success=true`);
  } catch (error) {
    console.error('Error confirming email:', error);
    return res.redirect(`${process.env.CLIENT_URL}/confirm?success=false`);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM Teachers WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
