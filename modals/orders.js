const mongoose = require("mongoose");

const orders = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    book: { type: mongoose.Types.ObjectId, ref: "book" },
    status: {
      type: String,
      default: "Order placed",
      enum: ["Order placed","Out for Delivery","Delivered","canceled"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orders);
