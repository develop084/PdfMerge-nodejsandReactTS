const User = require('../model/userModel');

exports.createUser = async (req, res) => {
    try {
      const { name, email, role } = req.body;
      const newUser = await User.create({ name, email, role });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create user' });
    }
  };
  
  // Get all users
  exports.getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: 'Failed to fetch users' });
    }
  };
  
  // Get a user by ID
  exports.getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Failed to fetch user' });
    }
  };
  
  // Update a user
  exports.updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, role } = req.body;
      const updatedUser = await User.findByIdAndUpdate(userId, { name, email, role }, { new: true });
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update user' });
    }
  };
  
  // Delete a user
  exports.deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
      await User.findByIdAndRemove(userId);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete user' });
    }
  };