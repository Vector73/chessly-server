const mongoose = require("mongoose");
 
const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  email: { type: String, unique: true },
  name: String,
  username: String,
  picture: String,
  oauthProvider: String,
  verifiedEmail: Boolean,
  createdTime: Date,
});

var User = mongoose.model("user", UserSchema);

module.exports = User;
