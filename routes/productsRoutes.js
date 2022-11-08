const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productsControllers");
const { getSingleProductReviews} = require('../controllers/reviewControllers')

const userPermissions = require("../middleware/userPermissions");

router
  .route("/")
  .get(userPermissions("admin"), getAllProducts)
  .post(userPermissions("admin"), createProduct);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(userPermissions("admin"), updateProduct)
  .delete(userPermissions("admin"), deleteProduct);

  router.route('/:id/reviews').get(getSingleProductReviews)

router.route("/uploads/image").post(userPermissions("admin"), uploadImage);

module.exports = router;
