const mongoose = require("mongoose");
const URL =
  "mongodb+srv://sumit:sumit1234@cluster0.ncc2u.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database Connected in mongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connecting in mongoDB: ${error.message}`);
  }
};

module.exports = connectDB;
