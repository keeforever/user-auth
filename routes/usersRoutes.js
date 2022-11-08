const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getMe,
  getSingleUser,
  updateSingleUser,
  updateUserPassword,
} = require("../controllers/usersControllers");

const userPermissions = require('../middleware/userPermissions')

router.route("/").get(userPermissions('admin','owner'),getAllUsers);

// this route is prioritized.
router.route("/me").get(getMe);
router.route("/:id").get(getSingleUser);

router.route("/:id").patch(updateSingleUser);
router.route("/").patch(updateUserPassword);

module.exports = router;