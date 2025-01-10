const mongoose = require("mongoose");

const mongooseConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected ${connect.connection.name}`);
  } catch (error) {
    console.log(`Error in connecting DB ${error.message}`);
  }
};

module.exports = mongooseConnection;
