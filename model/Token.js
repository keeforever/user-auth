const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tokenSchema = new Schema({
  refreshToken: {
    type: String,
    require: true,
  },
  ip: {
    type: String,
    require: true,
  },
  userAgent: {
    type: String,
    require: true,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref : 'Users',
    require: true,
  },
});


module.exports = model('Token',tokenSchema)