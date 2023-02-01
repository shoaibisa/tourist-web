const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema({
  packageTitle: {
    type: String,
  },
  packageDescription: {
    type: String,
  },
  packageItinerary: {
    type: String,
  },
  packageSlot: {
    type: Number,
  },
  packageDuration: {
    type: String,
  },
  packageRoutes: [
    {
      type: String,
    },
  ],
  packagePrice: {
    type: String,
  },
  packageImage: {
    type: String,
  },
  packageGuide: {
    type: Schema.Types.ObjectId,
    ref: "Guide",
  },
});

module.exports = mongoose.model("Package", packageSchema);
