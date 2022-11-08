const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder
} = require("../controllers/orderControllers");

const userPermissions = require("../middleware/userPermissions");

router.route("/").post(createOrder).get(userPermissions("admin"), getAllOrders);
router.route("/me").get(getCurrentUserOrders);

router
  .route("/:id")
  .get(userPermissions("admin"), getSingleOrder)
  .patch(updateOrder)
  
module.exports = router;
