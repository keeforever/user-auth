const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderItemSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  amount: { type: String, required: true },
  product: { type: mongoose.Types.ObjectId, ref:'Products',required: true }
});

const orderSchema = new Schema({
  tax: {
    type: Number,
    required: true,
  },
  shippingFee: {
    type: Number,
    required: true,
  },
  subTotal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  orderItems: {
    type: [orderItemSchema],
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ["pending", "failed", "paid", "delivered", "canceled"],
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  clientSecret: {
    type: String,
    required: true,
  },
  paymentIndent: {
    type: String
  }
});

const Order = model("Order", orderSchema);

module.exports =  Order 
