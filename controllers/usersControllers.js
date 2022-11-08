const Users = require("../model/Users");
const { StatusCodes } = require("http-status-codes");
const { createJWTPayload, attachedCookiesResponse } = require("../utils");
const CustomError = require("../errors");
const checkPermissions = require('../utils/checkPermissions')

const getAllUsers = async (req, res) => {
  const users = await Users.find({}).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getMe = (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const getSingleUser = async (req, res) => {
  const user = await Users.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.BadRequestError(`no user id of ${req.params.id}`);
  }
  checkPermissions(req.user, req.params.id)
  res.status(StatusCodes.OK).json({ user });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please fill the fields !!!");
  }

  const userID = req.user.userID;
  const user = await Users.findOne({ _id: userID });

  const grantAccess = await user.comparePassword(oldPassword);

  if (!grantAccess) {
    throw new CustomError.UnauthorizedRequestError("Unauthorized request !!!");
  }
  user.password = newPassword;
  user.save();
  res.status(StatusCodes.OK).json({ msg: "Success ! Password updated." });
};

// update with Model.
const updateSingleUser = async (req, res) => {
  const { email, name } = req.body;
  if(!email || !name){
    throw new CustomError.BadRequestError('Email,Name - required.')
  }
  const user = await Users.findOne({_id:req.user.userID})
  user.email = email
  user.name = name
  user.save()
  const JWTPayload = createJWTPayload(user)
  attachedCookiesResponse({res,user : JWTPayload})
  res.status(StatusCodes.OK).json({ user: JWTPayload });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  getMe,
  updateSingleUser,
  updateUserPassword,
};


// update user with finOneAndUpdate
// const updateSingleUser = async (req, res) => {
//   const { email, name } = req.body;
//   if(!email || !name){
//     throw new CustomError.BadRequestError('Email,Name - required.')
//   }
//   const user = await Users.findOneAndUpdate(
//     { _id: req.user.userID },
//     { email, name },
//     { new: true,runValidators:true }
//   ).select("-password");

//   const JWTPayload = createJWTPayload(user)
//   attachedCookiesResponse({res,user : JWTPayload})
//   res.status(StatusCodes.OK).json({ user: JWTPayload });
// };