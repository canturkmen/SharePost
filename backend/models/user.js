const mongoose = require('mongoose');
const uniqueValidataor = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {type: String, requried: true, unique: true},
  password: {type: String, required: true}
}).plugin(uniqueValidataor);

module.exports = mongoose.model("User", userSchema);
