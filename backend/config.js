require('dotenv').config(); // Load environment variables from .env file

module.exports = {
  mongoURI: process.env.MONGO_DB_URI, // MongoDB connection URI from .env file
  port: process.env.PORT || 3000, // Port for your server
  jwtSecret: process.env.JWT_SECRET,
};
