export const adminOnly = (req, res, next) => {
    const user = req.user;  // req.user is populated by JWT auth middleware

    console.log(user)
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();  // If the user is an admin, proceed to the next middleware/controller
  };
