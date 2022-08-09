const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  listingId: { type: Number, required: true},
  handle: { type: String, required: true },
  uniqueId: {type: String, required: true, unique: true},
  title: {type: String, required: true},
  service: { type: String, required: true },
  zip: { type: Number, required: true },
  hourly: { type: Number, required: true },
});

module.exports = mongoose.model("Listing", listingSchema, 'listings');
