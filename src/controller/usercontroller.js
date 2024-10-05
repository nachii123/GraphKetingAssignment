import User from '../model/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import { validationResult } from 'express-validator';

dotenv.config();

export const createUser = async (req, res) => {
  const error = validationResult(req)
  if (!error) return res.status(400).json({ error });

  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);
    
    res.status(201).json({ token, newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // user by mail
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create & sign JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '13h' }  // Set  our token expiry time as needed
    );

    // Sending token for response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
//   const User = req.user;
  try {
    const allUser = await User.find()
    res.status(200).json(allUser);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateUser = async (req, res) => {
  const  id  = req.params.id;
  const { name, email } = req.body;
  try {
    if (req.user.id !== id) return res.status(403).json({ message: 'Unauthorized' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};


export const deleteUser = async (req, res) => {
  const id = req.params.id;
  console.log("Attempting to delete user with ID:", id);

  try {
    console.log("User role:", req.user.role);
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete users' });
    }

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("User found:", user);

    // Remove the user
    await User.deleteOne(user);
    console.log("User removed successfully.");

    // Send success response
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    // Log the error for debugging
    console.error("Error deleting user:", err);
    
    // Send server error response
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


export const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
     try {
      const userId = req.user.id; 
      const user = await User.findById(userId); 
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
     res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };