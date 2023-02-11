const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guideSchema = new Schema(
  {
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
    guideImage: {
      type: String,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    packages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Package",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guide", guideSchema);
