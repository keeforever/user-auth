const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET)
};

const isValidJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};


const attachedCookiesResponse = ({ res, user, refreshToken}) => {
  const accessTokenJWT = createJWT({ payload: user });
  const refreshTokenJWT = createJWT({payload:{user,refreshToken}})

  const shortExp = 1000 * 1 ;
  const longExp = 1000 * 60 * 60 * 24;
  
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + shortExp),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  })
  
  res.cookie('refreshToken',refreshTokenJWT,{
    httpOnly : true,
    expires: new Date(Date.now() + longExp),
    secure :process.env.NODE_ENV === "production",
    signed : true
  })
};

const createJWTPayload = (user) => {
  return { name: user.name, userID: user._id, role: user.role };
};

module.exports = {
  createJWT,
  isValidJWT,
  attachedCookiesResponse,
  createJWTPayload
};
