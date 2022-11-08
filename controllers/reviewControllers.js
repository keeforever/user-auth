const Reviews = require("../model/Reviews");
const Products = require("../model/Products");
const CustomError = require("../errors");
const checkPermissions = require("../utils/checkPermissions");
const { StatusCodes } = require("http-status-codes");

const createReview = async (req, res) => {
  const productId = req.body.product;
  req.body.user = req.user.userID;
  // check product
  const isValidProduct = await Products.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.BadRequestError(
      `No product id of ${productId} found.`
    );
  }
  // check already reviewed
  const isAlreadyReviewed = await Reviews.findOne({
    product: productId,
    user: req.user.userID,
  });

  if (isAlreadyReviewed) {
    throw new CustomError.BadRequestError(`This product already reviewed.`);
  }

  const review = await Reviews.create(req.body);
  res.status(StatusCodes.OK).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Reviews.find({}).populate({
    path: "product",
    select: "name price",
  });
  res.status(StatusCodes.OK).json({ reviews });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Reviews.findOne({ _id: reviewId });
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;

  req.body.user = req.user.userID;
  const review = await Reviews.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.BadRequestError(`No review id of ${reviewId} found.`);
  }

  checkPermissions(req.user, review.user.toString());

  const { rating, title, comment } = req.body;

  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  // check review
  const review = await Reviews.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.BadRequestError(`No review id of ${reviewId} found.`);
  }
  //check user to perform delete
  checkPermissions(req.user, review.user.toString());
  await review.remove();

  res.status(StatusCodes.OK).json({ review });
};

// get product reviews
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const review = await Reviews.find({ product: productId });
  res.status(StatusCodes.OK).json({ review, reviewCounts: review.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
