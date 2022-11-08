const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview
} = require("../controllers/reviewControllers");

router.route("/").get(getAllReviews).post(createReview);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(updateReview)
  .delete(deleteReview);

 
module.exports = router;
