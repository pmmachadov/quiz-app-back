const userModel = require('../models/userModel');
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    const userId = await userModel.createUser(name, email, password);
    const token = authService.generateToken({ id: userId });

    await emailService.sendConfirmationEmail(email, token);
    res.status(200).json({ message: 'Registration successful, please confirm your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.confirmEmail = async (req, res) => {
  const token = req.params.token;
  try {
    const decoded = authService.verifyToken(token);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/confirm?success=false`);
    }

    const updated = await userModel.updateConfirmationStatus(decoded.id);
    if (updated === 0) {
      throw new Error('Failed to update confirmation status.');
    }

    return res.redirect(`${process.env.CLIENT_URL}/confirm?success=true`);
  } catch (error) {
    return res.redirect(`${process.env.CLIENT_URL}/confirm?success=false`);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = authService.generateToken({ id: user.id });
    res.status(200).json({ token, isConfirmed: user.isConfirmed });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
