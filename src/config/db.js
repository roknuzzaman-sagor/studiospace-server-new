const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI is not set');

    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || 'studiospace',
    });
    console.log(
      `MongoDB connected (database: ${mongoose.connection.name})`
    );
  } catch (err) {
    console.error('MongoDB error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
