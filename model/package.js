const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema({
  packageTitle: {
    type: String,
  },
  packageDiscription: {
    type: String,
  },
  packageItinerary: {
    type: String,
  },
  packageSlot: {
    type: String,
  },
  packageDuration: {
    type: String,
  },
  packageRoute: {
    type: String,
  },
  packagePrice: {
    type: String,
  },
  packageImage: {
    type: String,
  },
});

module.exports = mongoose.model("Package", packageSchema);
