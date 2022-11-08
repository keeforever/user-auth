const { StatusCodes } = require("http-status-codes");
const Products = require("../model/Products");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userID;
  const product = await Products.create(req.body);
  res.status(StatusCodes.OK).json({ product });
};

const getSingleProduct = async (req, res) => {
  const { id: productID } = req.params;
  const product = await Products.findOne({ _id: productID });
  res.status(StatusCodes.OK).json({ product });
};

const getAllProducts = async (req, res) => {
  const product = await Products.find({}).populate('review')

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productID } = req.params;

  const product = await Products.findOneAndUpdate(
    { _id: productID },
    req.body,
    { new: true, runValidators: true }
  );
  res.json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productID } = req.params;
  const product = await Products.findOne({ _id: productID });
  if(!product){
    throw new CustomError.BadRequestError('no item found.')
  }
  await product.remove()
  res.status(StatusCodes.OK).json({ product });
};

// file upload
const uploadImage = async (req, res) => {
  console.log(req.files);
  const file = req.files;
  if (!file) {
    throw new CustomError.BadRequestError("Must be file selected.");
  }

  if (!file.image.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("File selection must be an image.");
  }

  const maxSize = 1024 * 1024;

  if (file.image.size > maxSize) {
    throw new CustomError.BadRequestError("File size must be less than 1MB.");
  }
  const publicImage = path.join(
    __dirname,
    "../public/uploads/images/",
    file.image.name
  );
  await file.image.mv(publicImage)
  res.status(StatusCodes.OK).json({ image: { src:'/uploads/images/'+file.image.name} });
};

module.exports = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  uploadImage,
};
