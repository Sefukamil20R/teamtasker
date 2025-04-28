import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  try {
      const { name, email, password } = req.body;

      // Check if the user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
          return res.status(400).json({ message: 'A user with this email already exists. Please use a different email.' });
      }

      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
      if (!passwordRegex.test(password)) {
          return res.status(400).json({
              message: 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one special character.',
          });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Assign role (first user becomes admin)
      const role = (await User.countDocuments()) === 0 ? 'admin' : 'member';

      // Create the user
      const user = await User.create({ name, email, password: hashedPassword, role });

      res.status(201).json({ message: 'User registered successfully!', token: generateToken(user._id) });
  } catch (error) {
      res.status(500).json({ message: 'An error occurred while registering the user.', error: error.message });
  }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid email or password. Please try again.' });
        }

        res.json({ message: 'Login successful!', token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while logging in.', error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        res.json({ message: 'User details retrieved successfully!', user: req.user });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving user details.', error: error.message });
    }
};