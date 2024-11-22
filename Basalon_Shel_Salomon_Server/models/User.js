const mongoose = require("mongoose");
const path = require("path");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "uploads\\Default_pfp.svg.png",
  },
  gigs: [
    {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Gig",
    },
  ],
});

const User = mongoose.model("NewUser", UserSchema);

module.exports = User;
