// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// dotenv.config();

// export const auth = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ message: 'Access denied' });
//     const newT = token.split(" ")[1];
//   console.log(token);
//   console.log(newT);
//   try {
//     const decoded = jwt.verify(newT, process.env.JWT_SECRET);
//     req.user = decoded;
//     console.log(req.user);
//     next();
//   } catch (err) {
//     res.status(400).json({ message: 'Invalid token',err });
//   }
// };

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const auth = (req, res, next) => {
  const token = req.headers['authorization']; // Better to use req.headers
  if (!token) return res.status(401).json({ message: 'Access denied' });

  // Split token and check for format
  const newT = token.split(" ")[1]; // Extract the token part after "Bearer"
  if (!newT) return res.status(401).json({ message: 'Access denied, token missing' });

  try {
    const decoded = jwt.verify(newT, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user object to the request
    console.log("Decoded user:", req.user); // Log the decoded user for debugging
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Token verification error:", err); // Log error for debugging
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};
