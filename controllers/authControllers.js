const Users = require("../model/Users.js");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachedCookiesResponse, createJWTPayload } = require("../utils");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const Token = require("../model/Token");
const sendForgotPasswordEmail = require("../utils/sendForgotPasswordEmail");
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // check already registered user
  const isRegisteredUser = await Users.findOne({ email });
  if (isRegisteredUser) {
    throw new CustomError.BadRequestError("User already exist. Try to login !");
  }

  // set first user as admin
  const isFirstUser = (await Users.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await Users.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  await sendVerificationEmail({ to: email, verificationToken, email });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Account has registered. Please verify to login." });
};

/*
login route
*/
const login = async (req, res) => {
  const { email, password } = req.body;

  // check field values
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide the value");
  }

  // check user existence
  const user = await Users.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError("Email is not registered !!!");
  }

  if (!user.isVerified) {
    throw new CustomError.BadRequestError("Email is not verified !!!");
  }

  // compare password

  const grantAccess = await user.comparePassword(password);
  if (!grantAccess) {
    throw new CustomError.UnauthorizedRequestError(
      "Password does not match !!!"
    );
  }

  let refreshToken = "";

  // check refreshToken in DB
  const dbToken = await Token.findOne({ user: user._id });

  if (dbToken?.refreshToken) {
    const JWTPayload = createJWTPayload(user);
    attachedCookiesResponse({
      res,
      user: JWTPayload,
      refreshToken: dbToken.refreshToken,
    });
    res.status(StatusCodes.CREATED).json({ dbToken });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const ip = req.ip;
  const userAgent = req.get("user-agent");

  const token = await Token.create({
    refreshToken,
    ip,
    userAgent,
    user: user._id,
  });

  console.log(token);

  const JWTPayload = createJWTPayload(user);
  attachedCookiesResponse({ res, user: JWTPayload, refreshToken });
  res.status(StatusCodes.CREATED).json({ token });
};

const forgotPassword = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    throw new CustomError.BadRequestError("Email must be provided.");
  }
  const user = await Users.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError("Email is not registered !!!");
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");
  user.passwordToken = verificationToken;
  user.passwordTokenExpiryDate = new Date() + 1000 * 60 * 10;
  console.log(new Date() + 1000 * 60 * 10);
  await user.save();
  await sendForgotPasswordEmail({ verificationToken, to: email, email });
  res.json(verificationToken);
};

const resetPassword = async (req, res) => {
  const { verificationToken, email, password } = req.query;

  if (!verificationToken || !email || !password) {
    throw new CustomError.BadRequestError("bad request");
  }

  const user = await Users.findOne({ email });

  if (!user) {
    throw new CustomError.BadRequestError("bad request");
  }

  if(user.passwordToken === verificationToken){
    user.password = password
    user.passwordToken = ''
    user.passwordTokenExpiryDate=''
    await user.save()
  }
  res.send("reset password - done ");
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  console.log(verificationToken);
  const user = await Users.findOne({ email });

  if (!user) {
    throw new CustomError.BadRequestError("no such user found !!!");
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.BadRequestError("Invalid token!!!");
  }

  user.verificationToken = "";
  user.isVerified = true;
  user.verified = new Date(Date.now());
  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "verification success !", verified: true });
};

const logout = async (req, res) => {
  const {verificationToken, user:userId} = req.body

  console.log(req.user)

  res.cookie("accessToken", "logged out", {
    httpOnly: true,
    expires: new Date(),
  });

  res.cookie("refreshToken", "logged out", {
    httpOnly: true,
    expires: new Date(),
  });

  const user =await Token.findOneAndDelete({user: userId, verificationToken})
  console.log(user)
  res.send("user logged out");
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};

/* my programming story
2020 -  april -3 - python
        may - python
        june - python
        july - python
        august - html
        september - css
        november - js
        december - nothing
2021    january -2021 - small -project
        february - sass,sql,some dsa
        march - one job attempt fail
        april - planned to learn react, english, dsa, algorithms, and bla bla with veera
        may - nothing
        june 15-exam
        july -exam end love
        august - love
        september - love proposal failure
        october - got one small and largest js project
        november - mid that i finished
        december - learned react, finished 15 projects
2022    january - 4 extras
        february - spotify clone
        march - spotify clone
        april - spotify clone
        may - spotify clone
        june - finished spotify clone front end.
        july - started node js and completed 9 project.


        





*/
