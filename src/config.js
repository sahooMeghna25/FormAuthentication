const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Login");

//check database connected or not

connect
  .then(() => {
    console.log("Database Connected Succesfully");
  })
  .catch(() => {
    console.error("Database cannot connected");
  });

//Create Schema

const loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

//collection part

const collection = new mongoose.model("users", loginSchema);

module.exports = collection;
