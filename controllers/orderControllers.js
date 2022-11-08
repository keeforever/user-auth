const Order = require("../model/Order");
const Products = require("../model/Products");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const checkPermissions = require("../utils/checkPermissions");

const fakeStripe = (amount) => {
  return {
    clientSecret: "kjfgerhinfpiuurviwwewirwgrwurgwcuyrgwug",
    amount: amount,
  };
};

const createOrder = async (req, res) => {
  const { tax, shippingFee, items: cartItems } = req.body;

  let subTotal = 0;
  let orderItems = [];

  for (const items of cartItems) {
    const dbProduct = await Products.findOne({ _id: items.product });

    if (!dbProduct) {
      throw new CustomError.BadRequestError("no such item found. ");
    }

    const { _id: product, name, image, price } = dbProduct;
    const orderItem = { name, image, price, amount: items.amount, product };

    subTotal += items.amount * dbProduct.price;
    orderItems = [...orderItems, orderItem];
  }

  const total = tax + shippingFee + subTotal;
  // fake stripe payment
  const paymentIntent = await fakeStripe({
    amount: total,
    currency: "inr",
  });

  const order = await Order.create({
    tax,
    shippingFee,
    subTotal,
    total,
    orderItems,
    user: req.user.userID,
    clientSecret: paymentIntent.clientSecret,
  });

  res.status(StatusCodes.OK).json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });

  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const userID = req.user.userID;
  const user = await Order.find({ user: userID });

  res.status(StatusCodes.OK).json({ user });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIndent } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new Custom.BadRequestError("no such a item found !!!");
  }

  checkPermissions(req.user, order.user);
  order.paymentIndent = paymentIndent;
  order.status = "paid";

  order.save();
  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
};
