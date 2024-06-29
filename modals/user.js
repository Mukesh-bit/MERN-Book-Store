const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    profilePic: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg",
    },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    fav: [{ type: mongoose.Types.ObjectId, ref: "book" }],
    cart: [{ type: mongoose.Types.ObjectId, ref: "book" }],
    orders: [{ type: mongoose.Types.ObjectId, ref: "order" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", user);
