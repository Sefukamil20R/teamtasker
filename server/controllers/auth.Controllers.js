import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
console.log('Register route hit', req.body); // Log the request body
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const role = (await User.countDocuments()) === 0 ? 'admin' : 'member';

  const user = await User.create({ name, email, password: hashedPassword, role });
  res.status(201).json({ token: generateToken(user._id) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  res.json({ token: generateToken(user._id) });
};

export const getMe = async (req, res) => {
  res.json(req.user);
};
