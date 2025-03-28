const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://irvinmartinealejo:Password@maquiladora.uuwci.mongodb.net/maquila?retryWrites=true&w=majority&appName=maquiladora');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;