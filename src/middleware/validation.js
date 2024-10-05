
import { check, validationResult } from 'express-validator';

// user's register validation
export const userValidation = [
  check('name')
    .notEmpty().withMessage('Name is required'),
  
  check('email')
    .isEmail().withMessage('Invalid email')
    .notEmpty().withMessage('Email is required'),
  
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// login validation
export const loginValidation = [
  check('email')
    .isEmail().withMessage('Invalid email')
    .notEmpty().withMessage('Email is required'),
  
  check('password')
    .notEmpty().withMessage('Password is required')
];


export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
