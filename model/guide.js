const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guideSchema = new Schema({
  guideName: {
    type: String,
  },
  guideEmail: {
    type: String,
  },
  guidePassword: {
    type: String,
  },
  guidePhone: {
    type: String,
  },
  packages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Package",
    },
  ],
});

module.exports = mongoose.model("Guide", guideSchema);
