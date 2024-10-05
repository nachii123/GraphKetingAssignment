// import express from 'express';
// import mongoose from 'mongoose';
// import userRoutes from './src/routes/user_routes.js';
// import { logger } from './src/middleware/logger.js';
// import dotenv from 'dotenv';
// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(logger); // Use logging middleware
// const url = process.env.CONNECTION_STRING
// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

// app.use('/api', userRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './src/routes/user_routes.js';
import { logger } from './src/middleware/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(logger); // Use logging middleware

const url = process.env.CONNECTION_STRING;

// Updated mongoose connection without deprecated options
mongoose.connect(url)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

