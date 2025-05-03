import User from '../models/User.model.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.status(200).json({ message: 'Users retrieved successfully!', data: users });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving users.', error: error.message });
    }
};