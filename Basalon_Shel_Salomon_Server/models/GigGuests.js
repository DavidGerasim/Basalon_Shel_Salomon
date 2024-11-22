const mongoose = require("mongoose");
const path = require("path");
const Schema = mongoose.Schema;

const GigGuestsSchema = new Schema({
  gigId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  musiciansCount: {
    type: String,
    required: true,
  },
  friendsCount: {
    type: String,
    required: true,
  },
});

GigGuestsSchema.index({ gigId: 1, userId: 1 }, { unique: true });

const GigGuests = mongoose.model("GigGuest", GigGuestsSchema);

module.exports = GigGuests;
